'use client';

import { useState, useTransition } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@heroui/react';
import { Mail, CheckCircle } from 'lucide-react';
import AuthFloatingInput from './AuthFloatingInput';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleClose = () => {
        setEmail('');
        setError(null);
        setSent(false);
        onClose();
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            try {
                const res = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                const data = await res.json();

                if (!res.ok) {
                    if (res.status === 404) {
                        setError('No account found with that email address.');
                    } else {
                        setError(data.error || 'Something went wrong.');
                    }
                    return;
                }

                setSent(true);
            } catch {
                setError('Network error. Please try again.');
            }
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            placement="center"
            backdrop="opaque"
            classNames={{
                base: 'bg-[rgb(104,10,20)] border border-white/10 text-white rounded-3xl shadow-2xl',
                header: 'border-b border-white/10',
                footer: 'border-t border-white/10',
                closeButton: 'text-white hover:bg-white/10',
            }}
        >
            <ModalContent>
                <ModalHeader className="text-lg font-bold text-white">
                    Forgot Password
                </ModalHeader>

                <ModalBody className="py-6">
                    {sent ? (
                        <div className="flex flex-col items-center gap-3 py-4 text-center">
                            <CheckCircle className="w-12 h-12 text-yellow-300" />
                            <p className="text-white font-semibold text-base">
                                Check your inbox!
                            </p>
                            <p className="text-white/70 text-sm">
                                A reset link was sent to{' '}
                                <span className="font-medium text-yellow-300">
                                    {email}
                                </span>
                                . It expires in 1 hour.
                            </p>
                        </div>
                    ) : (
                        <form
                            id="forgot-form"
                            onSubmit={onSubmit}
                            className="space-y-4"
                        >
                            <p className="text-white/70 text-sm">
                                Enter your email address and we'll send you a
                                link to reset your password.
                            </p>

                            <AuthFloatingInput
                                type="email"
                                label="Enter your email"
                                value={email}
                                onChange={setEmail}
                                icon={<Mail className="w-5 h-5" />}
                                required
                                autoComplete="email"
                            />

                            {error && (
                                <div className="rounded-xl border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                                    {error}
                                </div>
                            )}
                        </form>
                    )}
                </ModalBody>

                <ModalFooter>
                    {sent ? (
                        <Button
                            onPress={handleClose}
                            className="w-full h-12 rounded-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-300"
                        >
                            Done
                        </Button>
                    ) : (
                        <div className="flex w-full gap-2">
                            <Button
                                variant="flat"
                                onPress={handleClose}
                                className="flex-1 h-12 rounded-2xl bg-white/10 text-white hover:bg-white/20"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="forgot-form"
                                isLoading={isPending}
                                className="flex-1 h-12 rounded-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-300"
                            >
                                Send Link
                            </Button>
                        </div>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ForgotPasswordModal;
