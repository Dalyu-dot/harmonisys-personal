export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MhpssLevel, RequestStatus, UserType } from '@prisma/client';

type PostBody = {
    toRole?: UserType;
    requestedMhpssLevel?: MhpssLevel;
};

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (session.user.role !== UserType.STANDARD) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Only STANDARD users can request role changes.',
                },
                { status: 403 }
            );
        }

        const body = (await req.json().catch(() => null)) as PostBody | null;
        const toRole = body?.toRole;
        const requestedMhpssLevel = body?.requestedMhpssLevel;

        if (
            !toRole ||
            (toRole !== UserType.RESPONDER && toRole !== UserType.ADMIN)
        ) {
            return NextResponse.json(
                { success: false, message: 'Invalid target role.' },
                { status: 400 }
            );
        }

        if (
            requestedMhpssLevel &&
            ![
                MhpssLevel.LEVEL_1,
                MhpssLevel.LEVEL_2,
                MhpssLevel.LEVEL_3,
                MhpssLevel.LEVEL_4,
            ].includes(requestedMhpssLevel)
        ) {
            return NextResponse.json(
                { success: false, message: 'Invalid requested MHPSS level.' },
                { status: 400 }
            );
        }

        if (toRole === UserType.RESPONDER && !requestedMhpssLevel) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Requested MHPSS level is required for responder requests.',
                },
                { status: 400 }
            );
        }

        if (toRole === UserType.ADMIN && requestedMhpssLevel) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        'MHPSS level should only be provided for responder requests.',
                },
                { status: 400 }
            );
        }

        const existing = await prisma.roleChangeRequest.findFirst({
            where: {
                userId: session.user.id,
                status: RequestStatus.PENDING,
            },
            select: { id: true },
        });

        if (existing) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'You already have a pending request.',
                },
                { status: 409 }
            );
        }

        const created = await prisma.roleChangeRequest.create({
            data: {
                userId: session.user.id,
                fromRole: session.user.role as UserType,
                toRole,
                requestedMhpssLevel:
                    toRole === UserType.RESPONDER ? requestedMhpssLevel : null,
                status: RequestStatus.PENDING,
            },
            select: {
                id: true,
                userId: true,
                fromRole: true,
                toRole: true,
                requestedMhpssLevel: true,
                status: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ success: true, data: created });
    } catch (err: any) {
        console.error('POST /api/admin/users/role-requests error:', err);
        return NextResponse.json(
            {
                success: false,
                message: err?.message || 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (session.user.role !== UserType.ADMIN) {
            return NextResponse.json(
                { success: false, message: 'Forbidden' },
                { status: 403 }
            );
        }

        const requests = await prisma.roleChangeRequest.findMany({
            where: { status: RequestStatus.PENDING },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                userId: true,
                fromRole: true,
                toRole: true,
                requestedMhpssLevel: true,
                requestedResponderOrganization: true,
                requestedMhpssCertificateFileUrl: true,
                status: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        competency: true,
                        mhpssLevel: true,
                        createdAt: true,
                    },
                },
            },
        });

        return NextResponse.json({ success: true, data: requests });
    } catch (err: any) {
        console.error('GET /api/admin/users/role-requests error:', err);
        return NextResponse.json(
            {
                success: false,
                message: err?.message || 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}
