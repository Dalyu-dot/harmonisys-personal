'use client';

import { useState, useRef } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Chip,
} from '@heroui/react';
import {
    UserCheck,
    Upload,
    X,
    AlertCircle,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import type { Session } from 'next-auth';

interface RoleRequestModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    session: Session;
    /** existing pending request (if any) from session or a fresh fetch */
    existingRequest?: {
        id: string;
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
        toRole: string;
        createdAt?: string;
    } | null;
    /** called after a successful submission so the parent can refresh session/state */
    onSuccess?: () => void;
}

export default function RoleRequestModal({
    isOpen,
    onOpenChange,
    session,
    existingRequest,
    onSuccess,
}: RoleRequestModalProps) {
    const [organization, setOrganization] = useState('');
    const [mhpssLevel, setMhpssLevel] = useState<'' | '1' | '2' | '3' | '4'>(
        ''
    );
    const [certFile, setCertFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const mhpssOptions = [
        { value: '1', label: 'Level 1 — Psychosocial Support' },
        { value: '2', label: 'Level 2 — Basic Psychological First Aid' },
        { value: '3', label: 'Level 3 — Counseling' },
        { value: '4', label: 'Level 4 — Clinical / Specialist' },
    ] as const;

    const handleSubmit = async () => {
        setError(null);

        if (!organization.trim()) {
            setError('Please enter your organization.');
            return;
        }

        try {
            setIsSubmitting(true);

            /* ── Upload certificate (if provided) ── */
            let certUrl: string | null = null;

            if (certFile) {
                const formData = new FormData();
                formData.append('file', certFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    const j = await uploadRes.json().catch(() => null);
                    throw new Error(j?.message || 'Certificate upload failed.');
                }

                const uploadData = await uploadRes.json();
                certUrl = uploadData.url ?? null;
            }

            /* ── Submit role-change request ── */
            const res = await fetch('/api/user/role-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toRole: 'RESPONDER',
                    requestedMhpssLevel: mhpssLevel
                        ? `LEVEL_${mhpssLevel}`
                        : null,
                    requestedResponderOrganization: organization.trim(),
                    requestedMhpssCertificateFileUrl: certUrl,
                }),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok || !json?.success) {
                throw new Error(json?.message || 'Failed to submit request.');
            }

            setSuccess(true);
            onSuccess?.();
        } catch (err: any) {
            setError(err.message ?? 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Status badge colours ── */
    const statusMeta = {
        PENDING: {
            color: 'warning' as const,
            icon: <Clock className="w-4 h-4" />,
            label: 'Pending Review',
        },
        APPROVED: {
            color: 'success' as const,
            icon: <CheckCircle2 className="w-4 h-4" />,
            label: 'Approved',
        },
        REJECTED: {
            color: 'danger' as const,
            icon: <X className="w-4 h-4" />,
            label: 'Rejected',
        },
        CANCELLED: {
            color: 'default' as const,
            icon: <X className="w-4 h-4" />,
            label: 'Cancelled',
        },
    };

    const hasPending = existingRequest?.status === 'PENDING';
    const wasRejected = existingRequest?.status === 'REJECTED';

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (isSubmitting) return;
                if (!open) {
                    // reset local state on close
                    setOrganization('');
                    setMhpssLevel('');
                    setCertFile(null);
                    setError(null);
                    setSuccess(false);
                }
                onOpenChange(open);
            }}
            size="lg"
        >
            <ModalContent>
                {/* ── Header ── */}
                <ModalHeader className="flex items-center gap-2 font-black text-[#4A0707]">
                    <UserCheck className="w-5 h-5" />
                    Request Responder Role
                </ModalHeader>

                <ModalBody className="space-y-4">
                    {/* ── Existing request banner ── */}
                    {existingRequest && !success && (
                        <div
                            className={`rounded-2xl p-4 border flex items-start gap-3 ${
                                existingRequest.status === 'PENDING'
                                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                                    : existingRequest.status === 'APPROVED'
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                      : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                        >
                            {statusMeta[existingRequest.status].icon}
                            <div className="text-sm">
                                <p className="font-semibold">
                                    {statusMeta[existingRequest.status].label}
                                </p>
                                <p className="opacity-80">
                                    {existingRequest.status === 'PENDING' &&
                                        'Your request is awaiting admin review. You will be notified by email.'}
                                    {existingRequest.status === 'APPROVED' &&
                                        'Your request was approved. Your role has been upgraded.'}
                                    {existingRequest.status === 'REJECTED' &&
                                        'Your request was rejected. You may submit a new request below.'}
                                </p>
                                {existingRequest.createdAt && (
                                    <p className="opacity-60 text-xs mt-1">
                                        Submitted:{' '}
                                        {new Date(
                                            existingRequest.createdAt
                                        ).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Success state ── */}
                    {success && (
                        <div className="rounded-2xl p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                            <div className="text-sm">
                                <p className="font-semibold text-base">
                                    Request Submitted!
                                </p>
                                <p className="opacity-80 mt-1">
                                    An email has been sent to the DRRM-H admin
                                    team. You will receive a notification at{' '}
                                    <span className="font-medium">
                                        {session.user?.email}
                                    </span>{' '}
                                    once your request is reviewed.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Form (show when no pending request OR was rejected) ── */}
                    {(!existingRequest || wasRejected) && !success && (
                        <>
                            <p className="text-sm text-slate-600">
                                Submit a request to upgrade your account to{' '}
                                <span className="font-semibold text-[#7A0C1E]">
                                    Responder
                                </span>
                                . The admin team will review and notify you via
                                email.
                            </p>

                            {/* Organization */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                    Organization{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="e.g. Red Cross, NDRRMC, LGU Pasig"
                                    value={organization}
                                    onValueChange={setOrganization}
                                    variant="bordered"
                                    isDisabled={isSubmitting}
                                    classNames={{
                                        inputWrapper:
                                            'border-[#A11B1B]/30 hover:border-[#A11B1B]/60 focus-within:border-[#A11B1B]',
                                    }}
                                />
                            </div>

                            {/* MHPSS Level (optional) */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                    MHPSS Level{' '}
                                    <span className="text-slate-400 font-normal normal-case">
                                        (optional)
                                    </span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {mhpssOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() =>
                                                setMhpssLevel((prev) =>
                                                    prev === opt.value
                                                        ? ''
                                                        : opt.value
                                                )
                                            }
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                mhpssLevel === opt.value
                                                    ? 'bg-gradient-to-r from-[#4A0707] to-[#A11B1B] text-white border-transparent shadow-md'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#A11B1B]/40'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Certificate upload (optional) */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                    MHPSS Certificate{' '}
                                    <span className="text-slate-400 font-normal normal-case">
                                        (optional — PDF or image)
                                    </span>
                                </label>

                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".pdf,image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        setCertFile(e.target.files?.[0] ?? null)
                                    }
                                />

                                {certFile ? (
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                                        <Upload className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm text-slate-700 truncate flex-1">
                                            {certFile.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCertFile(null);
                                                if (fileRef.current)
                                                    fileRef.current.value = '';
                                            }}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => fileRef.current?.click()}
                                        className="w-full flex items-center gap-2 justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 hover:border-[#A11B1B]/40 hover:bg-[#A11B1B]/5 hover:text-[#7A0C1E] transition-all"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Click to upload certificate
                                    </button>
                                )}
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}
                        </>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="light"
                        onPress={() => onOpenChange(false)}
                        isDisabled={isSubmitting}
                    >
                        {success ? 'Close' : 'Cancel'}
                    </Button>

                    {/* Only show submit when form is visible */}
                    {(!existingRequest || wasRejected) && !success && (
                        <Button
                            className="bg-gradient-to-r from-[#4A0707] via-[#6B0F0F] to-[#A11B1B] text-white font-semibold"
                            onPress={handleSubmit}
                            isLoading={isSubmitting}
                            startContent={
                                !isSubmitting && (
                                    <UserCheck className="w-4 h-4" />
                                )
                            }
                        >
                            Submit Request
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
