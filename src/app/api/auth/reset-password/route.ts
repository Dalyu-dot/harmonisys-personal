import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required.' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters.' },
                { status: 400 }
            );
        }

        // Find the token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                token,
                identifier: { startsWith: 'reset:' },
                expires: { gt: new Date() },
            },
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: 'Invalid or expired reset link.' },
                { status: 400 }
            );
        }

        const email = verificationToken.identifier.replace('reset:', '');

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        // Delete the used token
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: verificationToken.identifier,
                    token: verificationToken.token,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[reset-password]', error);
        return NextResponse.json(
            { error: 'Something went wrong.' },
            { status: 500 }
        );
    }
}
