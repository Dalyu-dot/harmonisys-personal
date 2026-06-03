'use client';

import { useState, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
import { Lock, CheckCircle, XCircle } from 'lucide-react';
import AuthFloatingInput from '@/components/auth/AuthFloatingInput';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'success' | 'invalid'>(
        'idle'
    );
    const [isPending, startTransition] = useTransition();

    if (!token) {
        return (
            <div className="flex flex-col items-center gap-3 text-center">
                <XCircle className="w-12 h-12 text-red-400" />
                <p className="text-white font-semibold text-lg">Invalid Link</p>
                <p className="text-white/60 text-sm">
                    This reset link is missing or malformed.
                </p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center gap-3 text-center">
                <CheckCircle className="w-12 h-12 text-yellow-300" />
                <p className="text-white font-semibold text-lg">
                    Password Updated!
                </p>
                <p className="text-white/60 text-sm">
                    Your password has been reset successfully.
                </p>
                <Button
                    onPress={() => router.push('/')}
                    className="mt-4 h-12 px-8 rounded-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-300"
                >
                    Go to Login
                </Button>
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className="flex flex-col items-center gap-3 text-center">
                <XCircle className="w-12 h-12 text-red-400" />
                <p className="text-white font-semibold text-lg">Link Expired</p>
                <p className="text-white/60 text-sm">
                    This reset link is invalid or has expired. Please request a
                    new one.
                </p>
                <Button
                    onPress={() => router.push('/')}
                    className="mt-4 h-12 px-8 rounded-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-300"
                >
                    Back to Login
                </Button>
            </div>
        );
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    if (res.status === 400 && data.error?.includes('expired')) {
                        setStatus('invalid');
                    } else {
                        setError(data.error || 'Something went wrong.');
                    }
                    return;
                }

                setStatus('success');
            } catch {
                setError('Network error. Please try again.');
            }
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-5 w-full">
            <div>
                <h2 className="text-white text-2xl font-bold">
                    Set New Password
                </h2>
                <p className="text-white/60 text-sm mt-1">
                    Must be at least 8 characters.
                </p>
            </div>

            <AuthFloatingInput
                type="password"
                label="New password"
                value={password}
                onChange={setPassword}
                icon={<Lock className="w-5 h-5" />}
                required
                autoComplete="new-password"
            />

            <AuthFloatingInput
                type="password"
                label="Confirm new password"
                value={confirm}
                onChange={setConfirm}
                icon={<Lock className="w-5 h-5" />}
                required
                autoComplete="new-password"
            />

            {error && (
                <div className="rounded-xl border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                isLoading={isPending}
                className="w-full h-14 rounded-2xl bg-yellow-400 text-black font-bold text-[18px] hover:bg-yellow-300"
            >
                Reset Password
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        // Wrap with your existing page background/layout as needed
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                <Suspense
                    fallback={
                        <p className="text-white/60 text-sm">Loading...</p>
                    }
                >
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
