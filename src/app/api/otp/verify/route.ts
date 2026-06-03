import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otp';

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();
        console.log('verify-otp received:', { email, code });

        if (!email || !code) {
            return NextResponse.json(
                { success: false, message: 'Email and code are required.' },
                { status: 400 }
            );
        }

        const result = verifyOtp(email, code);
        console.log('verify result:', result);

        if (!result.ok) {
            const messages: Record<string, string> = {
                expired: 'Your OTP has expired. Please request a new one.',
                invalid: 'Invalid code. Please try again.',
                max_attempts: 'Too many attempts. Please request a new code.',
            };
            return NextResponse.json(
                { success: false, message: messages[result.reason] },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[verify-otp]', err);
        return NextResponse.json(
            { success: false, message: 'Verification failed. Try again.' },
            { status: 500 }
        );
    }
}
