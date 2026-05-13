'use client';

import { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalBody, Button } from '@heroui/react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    defaultView?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onOpenChange,
    defaultView = 'login',
}) => {
    const [view, setView] = useState<'login' | 'register'>(defaultView);

    useEffect(() => {
        if (isOpen) {
            setView(defaultView);
        }
    }, [isOpen, defaultView]);
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            hideCloseButton
            backdrop="blur"
            size="lg"
            classNames={{
                base: 'bg-transparent shadow-none',
                backdrop: 'bg-black/60 backdrop-blur-sm',
                wrapper: 'px-3 sm:px-4',
            }}
        >
            <ModalContent className="bg-transparent shadow-none">
                {(onClose) => (
                    <ModalBody className="p-0">
                        <div
                            className="
                relative overflow-hidden rounded-[28px]
                border border-white/15
                bg-[linear-gradient(180deg,rgba(120,14,22,0.96),rgba(58,6,12,0.96))]
                shadow-[0_30px_80px_rgba(0,0,0,0.45)]
              "
                        >
                            <div className="relative">
                                <div className="flex items-start justify-between px-6 pt-6 pb-4 sm:px-7 sm:pt-7">
                                    <div>
                                        <h2 className="text-[2.1rem] font-bold leading-none text-white">
                                            {view === 'login'
                                                ? 'Login'
                                                : 'Register'}
                                        </h2>
                                        <p className="mt-2 text-sm text-white/75">
                                            {view === 'login'
                                                ? 'Sign in to continue.'
                                                : 'Create an account to continue.'}
                                        </p>
                                    </div>

                                    <Button
                                        isIconOnly
                                        variant="light"
                                        radius="full"
                                        onPress={onClose}
                                        className="
                      min-w-0 w-11 h-11
                      bg-white/10 text-white
                      hover:bg-white/20
                      border border-white/10
                    "
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <div className="h-px w-full bg-white/15" />

                                <div className="max-h-[72vh] overflow-y-auto px-6 py-5 sm:px-7 sm:py-6 auth-scroll">
                                    {view === 'login' ? (
                                        <LoginForm
                                            onSwitchToRegister={() =>
                                                setView('register')
                                            }
                                            onSuccess={() => onClose()}
                                        />
                                    ) : (
                                        <RegisterForm
                                            onSwitchToLogin={() =>
                                                setView('login')
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                )}
            </ModalContent>
        </Modal>
    );
};

export default AuthModal;
