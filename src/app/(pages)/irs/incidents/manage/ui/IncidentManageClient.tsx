'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Chip,
    Skeleton,
    Select,
    SelectItem,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@heroui/react';
import {
    Search,
    Eye,
    CheckCircle2,
    XCircle,
    CheckSquare,
    AlertTriangle,
    FileText,
    Clock,
    Tag,
    ShieldAlert,
    ArrowLeft,
} from 'lucide-react';

type IncidentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

type Incident = {
    id: string;
    location: string;
    date: string;
    summary: string;
    description: string;
    category: string;
    reporter: string | null;
    contact: string | null;
    severity: SeverityLevel | string;
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

const incidentUI = {
    pageBg: 'min-h-screen bg-gradient-to-br from-rose-50 via-slate-50 to-red-50',

    // main shell look
    headerCard:
        'overflow-hidden rounded-[28px] shadow-[0_26px_80px_rgba(42,6,13,0.20)] border border-white/25 bg-white/70 backdrop-blur-sm',
    heroGradient: 'bg-gradient-to-r from-[#7B122F] via-[#6b1029] to-[#5a0d22]',
    heroPad: 'px-8 py-10',
    heroTitle:
        'text-4xl lg:text-5xl font-black text-white drop-shadow-[0_12px_22px_rgba(0,0,0,0.35)]',
    heroSub: 'text-white/85 text-lg',

    toolbarWrap: 'bg-white/85 backdrop-blur-md border-t border-white/30',
    toolbarPad: 'px-6 py-5',

    // controls (dropdown + search) like Unahon
    selectTrigger:
        'h-12 rounded-2xl font-semibold border border-white/20 shadow-md hover:shadow-lg transition-all ' +
        'bg-gradient-to-r from-[#7B122F] via-[#6b1029] to-[#5a0d22] text-white',

    selectValue: '!text-white',
    selectLabel: '!text-white/90',
    selectIcon: '!text-white',

    searchWrap:
        'bg-white/85 backdrop-blur-sm border-2 border-[#7B122F]/35 shadow-sm ' +
        'hover:border-[#7B122F]/60 focus-within:border-[#7B122F] ' +
        'focus-within:shadow-[0_0_0_4px_rgba(123,18,47,0.12)] ' +
        'transition-all duration-300 h-12 rounded-2xl',
    searchInput: 'bg-transparent text-slate-800 placeholder:text-slate-500',

    sectionTitle:
        'text-2xl sm:text-3xl font-black tracking-tight text-slate-900',
    sectionBar:
        'w-1.5 h-7 rounded-full bg-gradient-to-b from-[#7B122F] to-[#5a0d22]',

    // stat cards (Unahon-like)
    statCard:
        'bg-white/75 backdrop-blur-md border border-white/55 shadow-[0_14px_40px_rgba(42,6,13,0.12)] rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_65px_rgba(42,6,13,0.18)]',

    // table container
    tableShell:
        'bg-white/70 backdrop-blur-sm shadow-lg border border-white/20 rounded-[28px] overflow-hidden',
    tableHeaderPill:
        'mx-5 mt-5 mb-3 rounded-2xl overflow-hidden border border-white/60 shadow-sm ' +
        'bg-gradient-to-r from-[#E5D0D7] via-[#F2E7EB] to-[#FBF6F7]',
    tableHeaderGrid: 'grid text-slate-800 font-semibold text-[13px]',
    tableGridCols: 'grid-cols-[1.3fr_1fr_1fr_2fr_1fr_1fr_1fr]',
    rowGrid:
        'grid items-center gap-x-2 ' +
        'grid-cols-[minmax(105px,0.72fr)_105px_95px_minmax(100px,0.7fr)_85px_95px_300px]',
    tableHeaderCell: 'px-3 py-3 flex items-center text-[12px]',
    hdrSummary: 'from-[#D9BCC5] to-[#F7EEF1]',
    hdrLocation: 'from-[#DDC5CD] to-[#F7EEF1]',
    hdrDate: 'from-[#E1CDD4] to-[#F7EEF1]',
    hdrTeam: 'from-[#E5D6DC] to-[#F7EEF1]',
    hdrSeverity: 'from-[#E9DEE3] to-[#F7EEF1]',
    hdrStatus: 'from-[#EEE7EA] to-[#F7EEF1]',
    hdrActions: 'from-[#F2EEF0] to-[#F7EEF1]',
    tableHeaderDivider: 'border-l border-white/60',
    tableHead: 'bg-gradient-to-r from-rose-50/60 to-slate-50/50',
    tableRow: 'hover:bg-white/60 transition-colors duration-200',

    // action buttons (Unahon-like)
    actionBtn:
        'h-7 rounded-lg border border-slate-200 bg-white/85 shadow-sm hover:shadow-md transition-all duration-200 font-semibold px-2 text-[11px] min-w-0 gap-1',
    actionView: 'text-[#7B122F] hover:bg-rose-50/60 hover:border-rose-200',
    actionApprove:
        'text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200',
    actionReject: 'text-rose-700 hover:bg-rose-50 hover:border-rose-200',
    actionResolve: 'text-blue-700 hover:bg-blue-50 hover:border-blue-200',
};

const formatDate = (d: string | Date) => {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export default function IncidentManageClient() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [incidents, setIncidents] = useState<Incident[]>([]);

    const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>(
        'ALL'
    );
    const [severityFilter, setSeverityFilter] = useState<'ALL' | SeverityLevel>(
        'ALL'
    );
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [updatedId, setUpdatedId] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
        null
    );
    const [selectedStatus, setSelectedStatus] = useState<IncidentStatus | null>(
        null
    );

    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const qs = new URLSearchParams();
            if (search.trim()) qs.set('q', search.trim());
            if (statusFilter !== 'ALL') qs.set('status', statusFilter);
            if (severityFilter !== 'ALL') qs.set('severity', severityFilter);

            const res = await fetch(`/api/admin/incidents?${qs.toString()}`, {
                cache: 'no-store',
            });
            const json = await res.json();

            if (!res.ok)
                throw new Error(json?.error || 'Failed to fetch incidents');
            setIncidents(json.data || []);
        } catch (e) {
            console.error(e);
            setIncidents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // refetch when filters/search change (debounced-ish)
    useEffect(() => {
        const t = setTimeout(fetchIncidents, 250);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, severityFilter, search]);

    const stats = useMemo(() => {
        const total = incidents.length;
        const pending = incidents.filter((i) => i.status === 'PENDING').length;
        const approved = incidents.filter(
            (i) => i.status === 'APPROVED'
        ).length;
        const rejected = incidents.filter(
            (i) => i.status === 'REJECTED'
        ).length;
        const resolved = incidents.filter(
            (i) => i.status === 'RESOLVED'
        ).length;

        return { total, pending, approved, rejected, resolved };
    }, [incidents]);

    const openConfirm = (id: string, status: IncidentStatus) => {
        setSelectedIncidentId(id);
        setSelectedStatus(status);
        setConfirmOpen(true);
    };

    const updateStatus = async (id: string, status: IncidentStatus) => {
        try {
            setUpdatingId(id);
            setUpdatedId(null);

            const res = await fetch(`/api/admin/incidents/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || 'Update failed');

            // Optimistic update
            setIncidents((prev) =>
                prev.map((x) => (x.id === id ? { ...x, status } : x))
            );

            // ✅ show Updated ✅ text for 2s
            setUpdatedId(id);
            setTimeout(() => setUpdatedId(null), 2000);
        } catch (e) {
            console.error(e);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-slate-50 to-red-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* ✅ HEADER + CONTROLS (Unahon-like) */}
                <Card className={`${incidentUI.headerCard} mb-8`}>
                    {/* HERO */}
                    <div className={incidentUI.heroGradient}>
                        <div className={incidentUI.heroPad}>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h1 className={incidentUI.heroTitle}>
                                        Incident Management
                                    </h1>
                                    <p className={`${incidentUI.heroSub} mt-2`}>
                                        Review incident reports, approve/reject,
                                        and track resolutions
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                                    <Button
                                        variant="light"
                                        className="
                    h-12 px-6
                    bg-white/15 text-white
                    border border-white/25
                    backdrop-blur-sm
                    shadow-sm hover:shadow-md
                    hover:bg-white/20
                    transition-all duration-300
                    font-medium
                    rounded-xl
                    flex items-center gap-2
                  "
                                        onPress={() =>
                                            router.push('/dashboard')
                                        }
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTROLS (attached like Unahon) */}
                    <div className={incidentUI.toolbarWrap}>
                        <div className={incidentUI.toolbarPad}>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Select
                                        label="Status"
                                        startContent={
                                            <Tag className="w-4 h-4 text-white/90" />
                                        }
                                        selectedKeys={[statusFilter]}
                                        onSelectionChange={(keys) =>
                                            setStatusFilter(
                                                (Array.from(keys)[0] as any) ??
                                                    'ALL'
                                            )
                                        }
                                        className="min-w-[210px]"
                                        variant="bordered"
                                        classNames={{
                                            trigger: incidentUI.selectTrigger,
                                            value: incidentUI.selectValue,
                                            label: incidentUI.selectLabel,
                                            selectorIcon: incidentUI.selectIcon,
                                        }}
                                    >
                                        <SelectItem key="ALL">
                                            All Status
                                        </SelectItem>
                                        <SelectItem key="PENDING">
                                            Pending
                                        </SelectItem>
                                        <SelectItem key="APPROVED">
                                            Approved
                                        </SelectItem>
                                        <SelectItem key="REJECTED">
                                            Rejected
                                        </SelectItem>
                                        <SelectItem key="RESOLVED">
                                            Resolved
                                        </SelectItem>
                                    </Select>

                                    <Select
                                        label="Severity"
                                        startContent={
                                            <ShieldAlert className="w-4 h-4 text-white/90" />
                                        }
                                        selectedKeys={[severityFilter]}
                                        onSelectionChange={(keys) =>
                                            setSeverityFilter(
                                                (Array.from(keys)[0] as any) ??
                                                    'ALL'
                                            )
                                        }
                                        className="min-w-[210px]"
                                        variant="bordered"
                                        classNames={{
                                            trigger: incidentUI.selectTrigger,
                                            value: incidentUI.selectValue,
                                            label: incidentUI.selectLabel,
                                            selectorIcon: incidentUI.selectIcon,
                                        }}
                                    >
                                        <SelectItem key="ALL">
                                            All Severity
                                        </SelectItem>
                                        <SelectItem key="LOW">Low</SelectItem>
                                        <SelectItem key="MEDIUM">
                                            Medium
                                        </SelectItem>
                                        <SelectItem key="HIGH">High</SelectItem>
                                        <SelectItem key="CRITICAL">
                                            Critical
                                        </SelectItem>
                                    </Select>
                                </div>

                                <div className="w-full lg:w-[520px]">
                                    <Input
                                        placeholder="Search summary, team, or location..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        classNames={{
                                            inputWrapper: incidentUI.searchWrap,
                                            input: incidentUI.searchInput,
                                        }}
                                        startContent={
                                            <Search className="h-5 w-5 text-[#7B122F]" />
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Overview */}
                <div className="mb-6 flex items-center gap-3">
                    <div className={incidentUI.sectionBar} />
                    <h2 className={incidentUI.sectionTitle}>
                        Dashboard Overview
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Card
                                key={i}
                                className={`${incidentUI.statCard} animate-pulse`}
                            >
                                <CardBody className="p-6">
                                    <Skeleton className="h-5 w-2/3 rounded-lg mb-3" />
                                    <Skeleton className="h-10 w-1/3 rounded-lg mb-2" />
                                    <Skeleton className="h-2 w-full rounded-full" />
                                </CardBody>
                            </Card>
                        ))
                    ) : (
                        <>
                            <Card className={incidentUI.statCard}>
                                <CardBody className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-600">
                                                Total Reports
                                            </div>
                                            <div className="mt-2 text-4xl font-black text-slate-900">
                                                {stats.total}
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-2xl shadow-sm border border-white/60 bg-[#7B122F]/10 text-[#7B122F]">
                                            <FileText className="w-7 h-7" />
                                        </div>
                                    </div>
                                    <div className="mt-3 h-1.5 rounded-full bg-[#7B122F]/25 overflow-hidden">
                                        <div className="h-full w-full bg-[#7B122F]" />
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className={incidentUI.statCard}>
                                <CardBody className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-600">
                                                Pending
                                            </div>
                                            <div className="mt-2 text-4xl font-black text-slate-900">
                                                {stats.pending}
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-2xl shadow-sm border border-white/60 bg-amber-50 text-amber-700">
                                            <Clock className="w-7 h-7" />
                                        </div>
                                    </div>
                                    <div className="mt-3 h-1.5 rounded-full bg-amber-200 overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500"
                                            style={{
                                                width: `${Math.min((stats.pending / Math.max(stats.total, 1)) * 100, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className={incidentUI.statCard}>
                                <CardBody className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-600">
                                                Approved
                                            </div>
                                            <div className="mt-2 text-4xl font-black text-slate-900">
                                                {stats.approved}
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-2xl shadow-sm border border-white/60 bg-emerald-50 text-emerald-700">
                                            <CheckCircle2 className="w-7 h-7" />
                                        </div>
                                    </div>
                                    <div className="mt-3 h-1.5 rounded-full bg-emerald-200 overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500"
                                            style={{
                                                width: `${Math.min((stats.approved / Math.max(stats.total, 1)) * 100, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className={incidentUI.statCard}>
                                <CardBody className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-600">
                                                Resolved
                                            </div>
                                            <div className="mt-2 text-4xl font-black text-slate-900">
                                                {stats.resolved}
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-2xl shadow-sm border border-white/60 bg-blue-50 text-blue-700">
                                            <CheckSquare className="w-7 h-7" />
                                        </div>
                                    </div>
                                    <div className="mt-3 h-1.5 rounded-full bg-blue-200 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500"
                                            style={{
                                                width: `${Math.min((stats.resolved / Math.max(stats.total, 1)) * 100, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className={incidentUI.statCard}>
                                <CardBody className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-600">
                                                Rejected
                                            </div>
                                            <div className="mt-2 text-4xl font-black text-slate-900">
                                                {stats.rejected}
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-2xl shadow-sm border border-white/60 bg-rose-50 text-rose-700">
                                            <XCircle className="w-7 h-7" />
                                        </div>
                                    </div>
                                    <div className="mt-3 h-1.5 rounded-full bg-rose-200 overflow-hidden">
                                        <div
                                            className="h-full bg-rose-500"
                                            style={{
                                                width: `${Math.min((stats.rejected / Math.max(stats.total, 1)) * 100, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </>
                    )}
                </div>

                {/* Table */}
                <div className="mb-6 flex items-center gap-3">
                    <div className={incidentUI.sectionBar} />
                    <h2 className={incidentUI.sectionTitle}>
                        Incident Reports
                    </h2>
                </div>

                <Card className={incidentUI.tableShell}>
                    <CardBody className="p-0">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-16 w-full rounded-2xl"
                                    />
                                ))}
                            </div>
                        ) : incidents.length === 0 ? (
                            <div className="p-10 text-center">
                                <div className="text-6xl mb-4">🗂️</div>
                                <div className="text-2xl font-black text-slate-900">
                                    No incidents found
                                </div>
                                <div className="text-slate-600 mt-2">
                                    Try changing filters or search terms.
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="w-full">
                                    {/* ✅ Unahon-like header pill (must be OUTSIDE table) */}
                                    <div className={incidentUI.tableHeaderPill}>
                                        <div
                                            className={`${incidentUI.tableHeaderGrid} ${incidentUI.rowGrid} divide-x divide-white/60 bg-gradient-to-r from-[#E5D0D7] via-[#F2E7EB] to-[#FBF6F7]`}
                                        >
                                            <div
                                                className={
                                                    incidentUI.tableHeaderCell
                                                }
                                            >
                                                Summary
                                            </div>
                                            <div
                                                className={
                                                    incidentUI.tableHeaderCell
                                                }
                                            >
                                                Location
                                            </div>
                                            <div
                                                className={
                                                    incidentUI.tableHeaderCell
                                                }
                                            >
                                                Date
                                            </div>
                                            <div
                                                className={
                                                    incidentUI.tableHeaderCell
                                                }
                                            >
                                                Team
                                            </div>
                                            <div
                                                className={
                                                    incidentUI.tableHeaderCell
                                                }
                                            >
                                                Severity
                                            </div>
                                            <div
                                                className={
                                                    incidentUI.tableHeaderCell
                                                }
                                            >
                                                Status
                                            </div>
                                            <div
                                                className={`${incidentUI.tableHeaderCell} justify-end`}
                                            >
                                                Actions
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-5 pb-5">
                                        <div className="divide-y divide-slate-200/60">
                                            {incidents.map((incident) => {
                                                const s = statusChip(
                                                    incident.status
                                                );
                                                const sev = severityChip(
                                                    String(incident.severity)
                                                );

                                                return (
                                                    <div
                                                        key={incident.id}
                                                        className={`${incidentUI.rowGrid} ${incidentUI.tableRow}`}
                                                    >
                                                        {/* Summary */}
                                                        <div className="py-3 pr-2 min-w-0">
                                                            <div className="font-semibold text-[13px] text-slate-900 line-clamp-2 leading-snug break-words">
                                                                {
                                                                    incident.summary
                                                                }
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 truncate">
                                                                Submitted by:{' '}
                                                                {incident.reporter?.trim() ||
                                                                    'Unknown reporter'}
                                                            </div>
                                                        </div>

                                                        {/* Location */}
                                                        <div className="py-3 pr-2 text-[12px] text-slate-700 font-medium min-w-0 truncate">
                                                            {incident.location}
                                                        </div>

                                                        {/* Date */}
                                                        <div className="py-3 pr-2 text-[12px] text-slate-700 font-medium whitespace-nowrap">
                                                            {formatDate(
                                                                incident.date
                                                            )}
                                                        </div>

                                                        {/* Team */}
                                                        <div className="py-3 pr-2 text-[12px] text-slate-700 font-medium min-w-0 truncate">
                                                            {
                                                                incident.teamDeployed
                                                            }
                                                        </div>

                                                        {/* Severity */}
                                                        <div className="py-4 pr-4">
                                                            <Chip
                                                                color={
                                                                    sev.color
                                                                }
                                                                variant="flat"
                                                                size="sm"
                                                                className="text-[10px] px-1.5"
                                                            >
                                                                {sev.label}
                                                            </Chip>
                                                        </div>

                                                        {/* Status */}
                                                        <div className="py-4 pr-4">
                                                            <Chip
                                                                color={s.color}
                                                                variant="flat"
                                                                size="sm"
                                                                className="text-[10px] px-1.5"
                                                            >
                                                                {s.label}
                                                            </Chip>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="py-4">
                                                            <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                                                <Button
                                                                    variant="flat"
                                                                    className={`${incidentUI.actionBtn} ${incidentUI.actionView}`}
                                                                    onPress={() =>
                                                                        router.push(
                                                                            `/irs/incidents/manage/${incident.id}`
                                                                        )
                                                                    }
                                                                    startContent={
                                                                        <span className="shrink-0 inline-flex items-center justify-center">
                                                                            <Eye className="w-3 h-3" />
                                                                        </span>
                                                                    }
                                                                >
                                                                    View
                                                                </Button>

                                                                <Button
                                                                    variant="flat"
                                                                    className={`${incidentUI.actionBtn} ${incidentUI.actionApprove}`}
                                                                    isDisabled={
                                                                        updatingId ===
                                                                            incident.id ||
                                                                        incident.status ===
                                                                            'APPROVED'
                                                                    }
                                                                    isLoading={
                                                                        updatingId ===
                                                                            incident.id &&
                                                                        incident.status !==
                                                                            'APPROVED'
                                                                    }
                                                                    onPress={() =>
                                                                        openConfirm(
                                                                            incident.id,
                                                                            'APPROVED'
                                                                        )
                                                                    }
                                                                    startContent={
                                                                        updatingId ===
                                                                            incident.id &&
                                                                        incident.status !==
                                                                            'APPROVED' ? null : (
                                                                            <span className="shrink-0 inline-flex items-center justify-center">
                                                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                                            </span>
                                                                        )
                                                                    }
                                                                >
                                                                    Approve
                                                                </Button>

                                                                <Button
                                                                    variant="flat"
                                                                    className={`${incidentUI.actionBtn} ${incidentUI.actionReject}`}
                                                                    isDisabled={
                                                                        updatingId ===
                                                                            incident.id ||
                                                                        incident.status ===
                                                                            'REJECTED'
                                                                    }
                                                                    isLoading={
                                                                        updatingId ===
                                                                            incident.id &&
                                                                        incident.status !==
                                                                            'REJECTED'
                                                                    }
                                                                    onPress={() =>
                                                                        openConfirm(
                                                                            incident.id,
                                                                            'REJECTED'
                                                                        )
                                                                    }
                                                                    startContent={
                                                                        updatingId ===
                                                                            incident.id &&
                                                                        incident.status !==
                                                                            'REJECTED' ? null : (
                                                                            <span className="shrink-0 inline-flex items-center justify-center">
                                                                                <XCircle className="w-3 h-3 text-rose-600" />
                                                                            </span>
                                                                        )
                                                                    }
                                                                >
                                                                    Reject
                                                                </Button>

                                                                <Button
                                                                    variant="flat"
                                                                    className={`${incidentUI.actionBtn} ${incidentUI.actionResolve}`}
                                                                    isDisabled={
                                                                        updatingId ===
                                                                            incident.id ||
                                                                        incident.status ===
                                                                            'RESOLVED'
                                                                    }
                                                                    isLoading={
                                                                        updatingId ===
                                                                            incident.id &&
                                                                        incident.status !==
                                                                            'RESOLVED'
                                                                    }
                                                                    onPress={() =>
                                                                        openConfirm(
                                                                            incident.id,
                                                                            'RESOLVED'
                                                                        )
                                                                    }
                                                                    startContent={
                                                                        updatingId ===
                                                                            incident.id &&
                                                                        incident.status !==
                                                                            'RESOLVED' ? null : (
                                                                            <span className="shrink-0 inline-flex items-center justify-center">
                                                                                <CheckSquare className="w-3 h-3 text-blue-600" />
                                                                            </span>
                                                                        )
                                                                    }
                                                                >
                                                                    Resolve
                                                                </Button>
                                                            </div>

                                                            {updatedId ===
                                                                incident.id && (
                                                                <div className="text-xs text-emerald-600 font-bold text-right mt-2">
                                                                    Updated ✅
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>
                {/* ✅ CONFIRM MODAL */}
                <Modal
                    isOpen={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                >
                    <ModalContent>
                        <ModalHeader className="font-bold">
                            Confirm Action
                        </ModalHeader>

                        <ModalBody>
                            <p className="text-slate-700">
                                Are you sure you want to{' '}
                                <span className="font-bold text-[#7B122F]">
                                    {selectedStatus}
                                </span>{' '}
                                this incident?
                            </p>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                variant="light"
                                onPress={() => setConfirmOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="bg-[#7B122F] text-white"
                                onPress={() => {
                                    if (selectedIncidentId && selectedStatus) {
                                        updateStatus(
                                            selectedIncidentId,
                                            selectedStatus
                                        );
                                    }
                                    setConfirmOpen(false);
                                }}
                            >
                                Confirm
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}
