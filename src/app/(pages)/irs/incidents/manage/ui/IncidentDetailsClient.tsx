'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Chip,
    Textarea,
    Skeleton,
    Input,
} from '@heroui/react';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    ShieldAlert,
    Users,
    Paperclip,
} from 'lucide-react';

type IncidentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESOLVED';

type Incident = {
    id: string;
    location: string;
    date: string;
    summary: string;
    description: string;
    category: string;
    reporter: string | null;
    contact: string | null;
    severity: string;
    attachments: string[];
    createdAt: string;
    updatedAt: string;
    teamDeployed: string;
    otherCategoryDetail: string | null;
    reviewNote: string | null;
    reviewedAt: string | null;
    reviewedBy: string | null;
    status: IncidentStatus;
};

const statusChip = (status: IncidentStatus) => {
    switch (status) {
        case 'APPROVED':
            return { color: 'success' as const, label: 'APPROVED' };
        case 'REJECTED':
            return { color: 'danger' as const, label: 'REJECTED' };
        case 'RESOLVED':
            return { color: 'primary' as const, label: 'RESOLVED' };
        case 'PENDING':
        default:
            return { color: 'warning' as const, label: 'PENDING' };
    }
};

const severityChip = (severity: string) => {
    switch (severity.toLowerCase()) {
        case 'critical':
            return { color: 'danger' as const, label: 'CRITICAL' };
        case 'high':
            return { color: 'warning' as const, label: 'HIGH' };
        case 'medium':
            return { color: 'primary' as const, label: 'MEDIUM' };
        case 'low':
            return { color: 'success' as const, label: 'LOW' };
        default:
            return { color: 'default' as const, label: severity };
    }
};

const formatDate = (d: string | Date) => {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export default function IncidentDetailsClient({ id }: { id: string }) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [incident, setIncident] = useState<Incident | null>(null);
    const [reviewNote, setReviewNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const fetchOne = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/incidents/${id}`, {
                cache: 'no-store',
            });
            const json = await res.json();
            if (!res.ok)
                throw new Error(json?.error || 'Failed to load incident');

            setIncident(json.data);
            setReviewNote(json.data?.reviewNote ?? '');
        } catch (e) {
            console.error(e);
            setIncident(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOne();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const metaDate = useMemo(
        () => (incident ? formatDate(incident.date) : ''),
        [incident]
    );

    const update = async (status?: IncidentStatus) => {
        if (!incident) return;

        setSaving(true);
        setSaved(false);

        try {
            const payload: Record<string, any> = {};

            if (status) payload.status = status;
            payload.reviewNote = reviewNote; // always send (safe)

            const res = await fetch(`/api/admin/incidents/${incident.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || 'Update failed');

            setIncident(json.data);

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-slate-50 to-red-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Button
                        variant="flat"
                        color="primary"
                        startContent={<ArrowLeft className="w-4 h-4" />}
                        onPress={() => router.push('/irs/incidents/manage')}
                    >
                        Back to Management
                    </Button>

                    {!loading && incident && (
                        <div className="flex items-center gap-2">
                            <Chip
                                color={severityChip(incident.severity).color}
                                variant="flat"
                            >
                                {severityChip(incident.severity).label}
                            </Chip>
                            <Chip
                                color={statusChip(incident.status).color}
                                variant="flat"
                            >
                                {statusChip(incident.status).label}
                            </Chip>
                        </div>
                    )}
                </div>

                <Card className="rounded-[28px] bg-white/70 backdrop-blur-sm shadow-lg border border-white/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#7B122F] via-[#6b1029] to-[#5a0d22] p-6">
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-9 w-2/3 rounded-xl" />
                                <Skeleton className="h-4 w-1/2 rounded-xl" />
                            </div>
                        ) : incident ? (
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-white">
                                    {incident.summary}
                                </h1>
                                <p className="text-white/80 mt-2 font-mono text-sm">
                                    {incident.id}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-3xl font-black text-white">
                                    Incident not found
                                </h1>
                            </div>
                        )}
                    </div>

                    <CardBody className="p-6">
                        {loading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-24 w-full rounded-2xl" />
                                <Skeleton className="h-52 w-full rounded-2xl" />
                                <Skeleton className="h-40 w-full rounded-2xl" />
                            </div>
                        ) : !incident ? (
                            <div className="text-slate-700">
                                No data. Go back and try again.
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Meta grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-2xl bg-white/80 border border-white/70 p-4">
                                        <div className="flex items-center gap-2 text-slate-700 font-black">
                                            <MapPin className="w-4 h-4 text-[#7B122F]" />{' '}
                                            Location
                                        </div>
                                        <div className="mt-1 text-slate-900 font-bold">
                                            {incident.location}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-white/80 border border-white/70 p-4">
                                        <div className="flex items-center gap-2 text-slate-700 font-black">
                                            <Calendar className="w-4 h-4 text-[#7B122F]" />{' '}
                                            Date of Incident
                                        </div>
                                        <div className="mt-1 text-slate-900 font-bold">
                                            {metaDate}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-white/80 border border-white/70 p-4">
                                        <div className="flex items-center gap-2 text-slate-700 font-black">
                                            <ShieldAlert className="w-4 h-4 text-[#7B122F]" />{' '}
                                            Category
                                        </div>
                                        <div className="mt-1 text-slate-900 font-bold">
                                            {incident.category}
                                            {incident.category === 'OTHER' &&
                                            incident.otherCategoryDetail
                                                ? ` — ${incident.otherCategoryDetail}`
                                                : ''}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-white/80 border border-white/70 p-4">
                                        <div className="flex items-center gap-2 text-slate-700 font-black">
                                            <Users className="w-4 h-4 text-[#7B122F]" />{' '}
                                            Team Deployed
                                        </div>
                                        <div className="mt-1 text-slate-900 font-bold">
                                            {incident.teamDeployed}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <Card className="bg-white/80 border border-white/70 rounded-2xl">
                                    <CardHeader className="pb-2">
                                        <div className="text-lg font-black text-slate-900">
                                            Detailed Description
                                        </div>
                                    </CardHeader>
                                    <CardBody className="pt-0">
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {incident.description}
                                        </p>
                                    </CardBody>
                                </Card>

                                {/* Reporter */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Reporter"
                                        value={incident.reporter || 'Unknown'}
                                        isReadOnly
                                        variant="bordered"
                                    />
                                    <Input
                                        label="Contact"
                                        value={incident.contact || 'N/A'}
                                        isReadOnly
                                        variant="bordered"
                                    />
                                </div>

                                {/* Attachments */}
                                <Card className="bg-white/80 border border-white/70 rounded-2xl">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-2 text-slate-900 font-black">
                                            <Paperclip className="w-4 h-4 text-[#7B122F]" />{' '}
                                            Attachments
                                        </div>
                                    </CardHeader>
                                    <CardBody className="pt-0">
                                        {incident.attachments?.length ? (
                                            <ul className="list-disc pl-5 text-slate-700">
                                                {incident.attachments.map(
                                                    (a) => (
                                                        <li key={a}>{a}</li>
                                                    )
                                                )}
                                            </ul>
                                        ) : (
                                            <p className="text-slate-500">
                                                No attachments.
                                            </p>
                                        )}
                                    </CardBody>
                                </Card>

                                {/* Review note */}
                                <Card className="bg-white/80 border border-white/70 rounded-2xl">
                                    <CardHeader className="pb-2">
                                        <div className="text-lg font-black text-slate-900">
                                            Admin Review
                                        </div>
                                    </CardHeader>
                                    <CardBody className="pt-0 space-y-4">
                                        <Textarea
                                            label="Review Note"
                                            placeholder="Write a short note for approval/rejection..."
                                            value={reviewNote}
                                            onChange={(e) =>
                                                setReviewNote(e.target.value)
                                            }
                                            variant="bordered"
                                            minRows={3}
                                            isDisabled={saving}
                                        />

                                        <div className="flex flex-wrap gap-3 justify-end">
                                            <Button
                                                variant="flat"
                                                className="bg-emerald-50"
                                                isDisabled={
                                                    saving ||
                                                    incident.status ===
                                                        'APPROVED'
                                                }
                                                isLoading={
                                                    saving &&
                                                    incident.status !==
                                                        'APPROVED'
                                                }
                                                onPress={() =>
                                                    update('APPROVED')
                                                }
                                            >
                                                Approve
                                            </Button>

                                            <Button
                                                variant="flat"
                                                className="bg-rose-50"
                                                isDisabled={
                                                    saving ||
                                                    incident.status ===
                                                        'REJECTED'
                                                }
                                                isLoading={
                                                    saving &&
                                                    incident.status !==
                                                        'REJECTED'
                                                }
                                                onPress={() =>
                                                    update('REJECTED')
                                                }
                                            >
                                                Reject
                                            </Button>

                                            <Button
                                                variant="flat"
                                                className="bg-blue-50"
                                                isDisabled={
                                                    saving ||
                                                    incident.status ===
                                                        'RESOLVED'
                                                }
                                                isLoading={
                                                    saving &&
                                                    incident.status !==
                                                        'RESOLVED'
                                                }
                                                onPress={() =>
                                                    update('RESOLVED')
                                                }
                                            >
                                                Resolve
                                            </Button>

                                            <Button
                                                className="bg-[#7B122F] text-white"
                                                isDisabled={saving}
                                                isLoading={saving}
                                                onPress={() =>
                                                    update(undefined)
                                                }
                                            >
                                                Save Note
                                            </Button>
                                        </div>

                                        {saved && (
                                            <p className="text-sm text-emerald-600 font-bold text-right">
                                                Saved ✅
                                            </p>
                                        )}

                                        {(incident.reviewedAt ||
                                            incident.reviewedBy) && (
                                            <p className="text-xs text-slate-500">
                                                Last reviewed:{' '}
                                                {incident.reviewedAt
                                                    ? new Date(
                                                          incident.reviewedAt
                                                      ).toLocaleString()
                                                    : '—'}
                                                {incident.reviewedBy
                                                    ? ` • by ${incident.reviewedBy}`
                                                    : ''}
                                            </p>
                                        )}
                                    </CardBody>
                                </Card>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
