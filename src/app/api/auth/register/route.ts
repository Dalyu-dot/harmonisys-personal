import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Gender, MhpssLevel, RequestStatus, UserType } from '@prisma/client';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const firstName = String(formData.get('firstName') || '').trim();
        const lastName = String(formData.get('lastName') || '').trim();
        const gender = String(formData.get('gender') || '').trim();
        const region = String(formData.get('region') || '').trim();
        const mhpssLevel = String(formData.get('mhpssLevel') || '').trim();
        const responderOrganization = String(
            formData.get('responderOrganization') || ''
        ).trim();
        const role = String(formData.get('role') || '').trim();
        const privacyPolicyAccepted =
            String(formData.get('privacyPolicyAccepted') || '').trim() ===
            'true';
        const email = String(formData.get('email') || '').trim();
        const password = String(formData.get('password') || '');
        const confirmPassword = String(formData.get('confirmPassword') || '');
        const mhpssCertificateFile = formData.get(
            'mhpssCertificateFile'
        ) as File | null;

        const allowedMimeTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        let uploadedCertificatePath: string | null = null;

        if (
            !firstName ||
            !lastName ||
            !gender ||
            !region ||
            !role ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        if (!privacyPolicyAccepted) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'You must agree to the Privacy Policy.',
                },
                { status: 400 }
            );
        }

        if (!['MALE', 'FEMALE'].includes(gender)) {
            return NextResponse.json(
                { success: false, message: 'Invalid gender selected.' },
                { status: 400 }
            );
        }

        if (!['STANDARD', 'RESPONDER', 'ADMIN'].includes(role)) {
            return NextResponse.json(
                { success: false, message: 'Invalid role selected.' },
                { status: 400 }
            );
        }

        if (
            mhpssLevel &&
            !['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4'].includes(mhpssLevel)
        ) {
            return NextResponse.json(
                { success: false, message: 'Invalid MHPSS Level selected.' },
                { status: 400 }
            );
        }

        if (role === 'RESPONDER' && !mhpssLevel) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'MHPSS Level is required for responders.',
                },
                { status: 400 }
            );
        }

        if (role === 'RESPONDER' && !mhpssCertificateFile) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Certificate or proof of MHPSS Level is required for responders.',
                },
                { status: 400 }
            );
        }

        if (role === 'RESPONDER' && !responderOrganization) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Responder organization or affiliation is required for responders.',
                },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { success: false, message: 'Passwords do not match.' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Password must be at least 6 characters.',
                },
                { status: 400 }
            );
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'Email is already registered.' },
                { status: 409 }
            );
        }

        if (role === 'RESPONDER' && mhpssCertificateFile) {
            if (mhpssCertificateFile.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { success: false, message: 'File must be less than 5MB.' },
                    { status: 400 }
                );
            }
            if (!allowedMimeTypes.includes(mhpssCertificateFile.type)) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            'Invalid certificate file type. Allowed: PDF, JPG, JPEG, PNG, DOC, DOCX.',
                    },
                    { status: 400 }
                );
            }

            const bytes = await mhpssCertificateFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const safeOriginalName = mhpssCertificateFile.name.replace(
                /[^a-zA-Z0-9.-]/g,
                '_'
            );
            const fileName = `mhpss-certificates/${Date.now()}-${safeOriginalName}`;

            const blob = await put(fileName, buffer, {
                access: 'public',
                addRandomSuffix: true,
                contentType: mhpssCertificateFile.type,
            });

            uploadedCertificatePath = blob.url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const fullName = `${firstName} ${lastName}`.trim();

        const user = await prisma.user.create({
            data: {
                name: fullName,
                firstName,
                lastName,
                gender: gender as Gender,
                region,

                // Active values stay safe until admin approval
                role: UserType.STANDARD,
                mhpssLevel: null,

                privacyPolicyAccepted: Boolean(privacyPolicyAccepted),
                email: normalizedEmail,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true,
                gender: true,
                region: true,
                mhpssLevel: true,
                role: true,
            },
        });

        // Create pending request only when user asked for elevated access
        if (role !== 'STANDARD') {
            await prisma.roleChangeRequest.create({
                data: {
                    userId: user.id,
                    fromRole: UserType.STANDARD,
                    toRole: role as UserType,
                    requestedMhpssLevel:
                        role === 'RESPONDER'
                            ? (mhpssLevel as MhpssLevel)
                            : null,
                    requestedResponderOrganization:
                        role === 'RESPONDER' ? responderOrganization : null,
                    requestedMhpssCertificateFileUrl:
                        role === 'RESPONDER' ? uploadedCertificatePath : null,
                    status: RequestStatus.PENDING,
                },
            });
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    role === 'STANDARD'
                        ? 'Registration successful.'
                        : 'Registration successful. Your requested role is pending admin approval.',
                user: {
                    id: user.id,
                    name: user.name,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    gender: user.gender,
                    region: user.region,
                    mhpssLevel: user.mhpssLevel,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Register error FULL:', error);
        console.error('Register error message:', error?.message);
        console.error('Register error stack:', error?.stack);

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    'Something went wrong during registration.',
            },
            { status: 500 }
        );
    }
}
