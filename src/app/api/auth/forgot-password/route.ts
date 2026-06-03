import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/action/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required.' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json(
                { error: 'No account found with that email address.' },
                { status: 404 }
            );
        }

        // Delete any existing reset tokens for this email
        await prisma.verificationToken.deleteMany({
            where: { identifier: `reset:${email}` },
        });

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        await prisma.verificationToken.create({
            data: {
                identifier: `reset:${email}`,
                token,
                expires,
            },
        });

        await sendPasswordResetEmail(email, token);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[forgot-password]', error);
        return NextResponse.json(
            { error: 'Something went wrong.' },
            { status: 500 }
        );
    }
}
