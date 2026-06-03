'use client';

import type { UnahonProps, FormRow, UnahonApiResponse } from '@/types/Unahon';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    getKeyValue,
    Pagination,
    Spinner,
    Button,
    Tooltip,
    Input,
    Card,
    CardBody,
    Chip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Skeleton,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@heroui/react';
import { AssessmentType } from '@prisma/client';
import {
    Eye,
    ChevronDown,
    Users,
    Calendar,
    Clock,
    FileText,
    RefreshCcw,
    Search,
    Trash2,
    ArrowLeft,
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { unahonDashboardCols } from '@/constants';
import type { Session } from 'next-auth';

// Filter options
const assessmentFilterOptions = [
    { label: 'All Assessments', value: 'all' },
    { label: 'Initial Assessments', value: AssessmentType.INITIAL_ASSESSMENT },
    { label: 'Re-assessments', value: AssessmentType.RE_ASSESSMENT },
];

const dateFilterOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Last 7 Days', value: 'recent-7' },
    { label: 'Last 30 Days', value: 'last-30' },
];

const assessmentColorMap: Record<
    AssessmentType,
    'success' | 'warning' | 'default' | 'primary' | 'secondary' | 'danger'
> = {
    INITIAL_ASSESSMENT: 'success',
    RE_ASSESSMENT: 'warning',
};

interface UnahonManagementProps {
    session: Session;
    onStateChange?: (isViewing: boolean) => void;
    onUnahonStateChange?: (
        isViewing: boolean,
        isReassessing: boolean,
        props?: UnahonProps
    ) => void;
}

/**
 * ✅ UI-only theme (Red/Maroon) — functions/logic unchanged
 */
const maroonUI = {
    pageBg: 'min-h-screen bg-gradient-to-br from-[#FAF3F6] via-[#F7E9EF] to-[#F2DEE6]',
    shell: 'bg-white/70 backdrop-blur-md border border-white/45 shadow-[0_18px_55px_rgba(42,6,13,0.18)]',
    sectionTitle: 'text-2xl font-black text-slate-900',
    sectionBar:
        'w-1 h-8 rounded-full bg-gradient-to-b from-[#7A0C1E] to-[#B91C1C]',
    cardHover:
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_65px_rgba(42,6,13,0.18)]',

    heroGradient: 'bg-gradient-to-r from-[#4A0707] via-[#6B0F0F] to-[#A11B1B]',
    heroTitle:
        'text-4xl lg:text-5xl font-black text-white drop-shadow-[0_12px_22px_rgba(0,0,0,0.35)]',
    heroSub: 'text-white/85 text-lg',

    controlBtn:
        'h-12 rounded-2xl font-semibold border border-white/20 shadow-md hover:shadow-lg transition-all',
    controlBtnAssess:
        'bg-gradient-to-r from-[#7A0C1E] via-[#991B1B] to-[#B91C1C] text-white',
    controlBtnDate:
        'bg-gradient-to-r from-[#2A060D] via-[#6B0F25] to-[#B91C1C] text-white',

    searchWrap:
        'bg-white/85 backdrop-blur-sm border-2 border-[#A11B1B]/35 shadow-sm ' +
        'hover:border-[#A11B1B]/60 focus-within:border-[#A11B1B] ' +
        'focus-within:shadow-[0_0_0_4px_rgba(161,27,27,0.12)] ' +
        'transition-all duration-300 h-12 rounded-2xl',

    searchInput: 'bg-transparent text-slate-800 placeholder:text-slate-500',

    // Stats
    statCard:
        'bg-white/75 backdrop-blur-md border border-white/55 shadow-[0_14px_40px_rgba(42,6,13,0.12)] rounded-3xl',
    statIconWrap: 'p-3 rounded-2xl shadow-sm border border-white/60',
    // table
    tableTh:
        'bg-gradient-to-r from-[#F2DEE6] to-[#F7EEF1] text-[#2A060D] font-extrabold border-b border-white/60',
    tableTd: 'border-b border-white/60',
    tableRow: 'hover:bg-[#B91C1C]/[0.04] transition-colors duration-200',

    // actions
    actionBtn:
        'h-8 rounded-xl border border-slate-200 bg-white/85 shadow-sm hover:shadow-md transition-all duration-200 px-2.5 text-xs font-semibold gap-1 min-w-0',
    actionView:
        'text-[#7A0C1E] hover:text-[#2A060D] hover:bg-[#B91C1C]/10 hover:border-[#B91C1C]/25',
    actionReassess:
        'text-[#B45309] hover:text-[#92400E] hover:bg-[#F59E0B]/10 hover:border-[#F59E0B]/25',
    actionDelete:
        'text-[#B91C1C] hover:text-[#7A0C1E] hover:bg-[#B91C1C]/10 hover:border-[#B91C1C]/25',

    // pagination
    pagerWrap:
        'gap-1 overflow-visible h-10 rounded-xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-lg',
    pagerItem:
        'w-10 h-10 text-sm rounded-lg bg-transparent hover:bg-[#B91C1C]/10 transition-all duration-200 font-medium text-slate-600 hover:text-[#7A0C1E]',
    pagerCursor:
        'bg-gradient-to-r from-[#2A060D] via-[#7A0C1E] to-[#B91C1C] shadow-xl text-white font-bold rounded-lg border-2 border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300',
    pagerNav:
        'bg-white/90 hover:bg-[#B91C1C]/10 border border-white/60 text-[#7A0C1E] rounded-lg shadow-md hover:shadow-lg transition-all duration-200',

    headerCard:
        'overflow-hidden rounded-[28px] shadow-[0_26px_80px_rgba(42,6,13,0.20)] border border-white/25',
    headerPad: 'px-8 py-10',
    toolbarCard:
        'rounded-[26px] bg-white/85 backdrop-blur-md border border-white/55 shadow-[0_14px_50px_rgba(42,6,13,0.14)]',
};

const UnahonManagement = ({
    session,
    onStateChange,
    onUnahonStateChange,
}: UnahonManagementProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const rowsPerPage = 10;
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<FormRow[]>([]);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [assessmentTypeFilter, setAssessmentTypeFilter] =
        useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');

    const [isHydrated, setIsHydrated] = useState(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [reassessConfirmOpen, setReassessConfirmOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [successTitle, setSuccessTitle] = useState('Notice');
    const [selectedDeleteItem, setSelectedDeleteItem] =
        useState<FormRow | null>(null);
    const [selectedReassessItem, setSelectedReassessItem] =
        useState<FormRow | null>(null);

    useEffect(() => setIsHydrated(true), []);
    useEffect(() => onStateChange?.(false), [onStateChange]);

    // Build API URL with all parameters
    const apiUrl = useMemo(() => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: rowsPerPage.toString(),
        });

        if (searchQuery.trim()) params.append('search', searchQuery.trim());
        if (assessmentTypeFilter !== 'all')
            params.append('assessmentType', assessmentTypeFilter);
        if (dateFilter !== 'all') params.append('dateFilter', dateFilter);

        return `/api/unahon?${params.toString()}`;
    }, [page, searchQuery, assessmentTypeFilter, dateFilter]);

    const { data, isLoading } = useQuery<UnahonApiResponse>({
        queryKey: [
            'unahon-management',
            page,
            searchQuery,
            assessmentTypeFilter,
            dateFilter,
        ],
        queryFn: async () => {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Failed to fetch Unahon assessments');
            }

            return response.json();
        },
        placeholderData: (previousData) => previousData,
        staleTime: 2 * 60 * 1000,
    });
    // Statistics calculation
    const statistics = useMemo(() => {
        if (!data?.data) {
            return {
                total: 0,
                initialAssessments: 0,
                reAssessments: 0,
                thisWeek: 0,
            };
        }

        const allEntries = Object.values(data.data).flat();
        const total = data.count || 0;

        const initialAssessments = allEntries.filter(
            (entry) =>
                entry.confidentialForm.assessmentType ===
                AssessmentType.INITIAL_ASSESSMENT
        ).length;

        const reAssessments = allEntries.filter(
            (entry) =>
                entry.confidentialForm.assessmentType ===
                AssessmentType.RE_ASSESSMENT
        ).length;

        const thisWeek = allEntries.filter((entry) => {
            const entryDate = new Date(entry.confidentialForm.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return entryDate >= weekAgo;
        }).length;

        return { total, initialAssessments, reAssessments, thisWeek };
    }, [data]);

    // Convert server data to table rows
    useEffect(() => {
        if (!data?.data) {
            setRows([]);
            return;
        }

        const getTableRows = () => {
            return Object.entries(data.data).flatMap(([clientId, entries]) =>
                entries.map(
                    (
                        { id, confidentialForm, responder, checklist },
                        index
                    ) => ({
                        id,
                        key: `${id}-${index}`,
                        'client-id': confidentialForm.client || 'N/A',
                        location: confidentialForm.location || 'N/A',
                        'responder-name': responder,
                        date: new Date(
                            confidentialForm.date
                        ).toLocaleDateString(),
                        affiliation: confidentialForm.affiliation || 'N/A',
                        'assessment-type': confidentialForm.assessmentType,
                        confidentialForm,
                        checklist,
                    })
                )
            );
        };

        setRows(getTableRows());
    }, [data]);

    useEffect(
        () => setPage(1),
        [searchQuery, assessmentTypeFilter, dateFilter]
    );

    const viewUnahonForm = useCallback(
        (item: FormRow) => {
            console.log('View Details clicked', item);

            const props: UnahonProps = {
                session,
                isViewOnly: true,
                isReassessment: false,
                unahonChecklist: item.checklist,
                clientConfidentialForm: item.confidentialForm,
                responder: item['responder-name'],
            };
            onUnahonStateChange?.(true, false, props);
        },
        [onUnahonStateChange, session]
    );

    const openReassessConfirm = useCallback((item: FormRow) => {
        setSelectedReassessItem(item);
        setReassessConfirmOpen(true);
    }, []);

    const reassessUnahonForm = useCallback(async () => {
        if (!selectedReassessItem) return;

        try {
            const res = await fetch('/api/unahon/reassess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: selectedReassessItem.confidentialForm.userId,
                    client: selectedReassessItem.confidentialForm.client,
                    affiliation:
                        selectedReassessItem.confidentialForm.affiliation,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to request reassessment');
            }

            setReassessConfirmOpen(false);
            setSelectedReassessItem(null);
            setSuccessTitle('Success');
            setSuccessMessage('Reassessment request sent to the user.');
            setSuccessModalOpen(true);

            await queryClient.invalidateQueries({
                queryKey: ['unahon-management'],
            });
        } catch (error) {
            console.error(error);
            setReassessConfirmOpen(false);
            setSelectedReassessItem(null);
            setSuccessTitle('Error');
            setSuccessMessage('Failed to send reassessment request.');
            setSuccessModalOpen(true);
        }
    }, [selectedReassessItem, queryClient]);

    const openDeleteConfirm = useCallback((item: FormRow) => {
        setSelectedDeleteItem(item);
        setDeleteConfirmOpen(true);
    }, []);

    const deleteUnahonForm = useCallback(async () => {
        if (!selectedDeleteItem) return;

        try {
            const res = await fetch(`/api/unahon/${selectedDeleteItem.id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to delete assessment');
            }

            setDeleteConfirmOpen(false);
            setSelectedDeleteItem(null);
            setSuccessTitle('Success');
            setSuccessMessage('Assessment deleted successfully.');
            setSuccessModalOpen(true);

            await queryClient.invalidateQueries({
                queryKey: ['unahon-management'],
            });
        } catch (error) {
            console.error(error);
            setDeleteConfirmOpen(false);
            setSelectedDeleteItem(null);
            setSuccessTitle('Error');
            setSuccessMessage('Failed to delete assessment.');
            setSuccessModalOpen(true);
        }
    }, [selectedDeleteItem, queryClient]);

    const renderCell = useCallback(
        (item: FormRow, columnKey: string | number) => {
            switch (columnKey) {
                case 'client-id':
                    return (
                        <div className="flex flex-col w-[160px]">
                            <span
                                className="font-mono text-sm font-semibold text-slate-900 truncate"
                                title={item['client-id']}
                            >
                                {item['client-id']}
                            </span>
                        </div>
                    );

                case 'responder-name':
                    return (
                        <div className="flex flex-col w-[100px]">
                            <span className="font-medium text-slate-800">
                                {item['responder-name']}
                            </span>
                        </div>
                    );

                case 'date':
                    return (
                        <div className="flex flex-col">
                            <span className="font-medium text-slate-800">
                                {item.date}
                            </span>
                            <span className="text-xs text-slate-500">
                                {new Date(
                                    item.confidentialForm.date
                                ).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                })}
                            </span>
                        </div>
                    );

                case 'location':
                    return (
                        <div className="w-[180px]">
                            <span
                                className="block font-medium text-slate-800 truncate whitespace-nowrap"
                                title={item.location}
                            >
                                {item.location}
                            </span>
                        </div>
                    );

                case 'affiliation':
                    return (
                        <Chip
                            size="sm"
                            variant="flat"
                            className="bg-slate-100 text-slate-700 font-medium"
                        >
                            {item.affiliation}
                        </Chip>
                    );

                case 'assessment-type':
                    return (
                        <div className="text-center">
                            <Chip
                                color={
                                    assessmentColorMap[item['assessment-type']]
                                }
                                variant="flat"
                            >
                                {item['assessment-type'].replaceAll('_', ' ')}
                            </Chip>
                        </div>
                    );

                case 'actions':
                    return (
                        <div className="flex justify-center items-center gap-2 whitespace-nowrap">
                            <Button
                                size="sm"
                                variant="light"
                                className={`${maroonUI.actionBtn} ${maroonUI.actionView}`}
                                onPress={() => viewUnahonForm(item)}
                                startContent={
                                    <Eye className="w-4 h-4 shrink-0" />
                                }
                            >
                                View
                            </Button>

                            <Button
                                size="sm"
                                variant="light"
                                className={`${maroonUI.actionBtn} ${maroonUI.actionReassess}`}
                                onPress={() => openReassessConfirm(item)}
                                startContent={
                                    <RefreshCcw className="w-4 h-4 shrink-0" />
                                }
                            >
                                Reassess
                            </Button>

                            <Button
                                size="sm"
                                variant="light"
                                className={`${maroonUI.actionBtn} ${maroonUI.actionDelete}`}
                                onPress={() => openDeleteConfirm(item)}
                                startContent={
                                    <Trash2 className="w-4 h-4 shrink-0" />
                                }
                            >
                                Delete
                            </Button>
                        </div>
                    );

                default:
                    return (
                        <span className="text-md sm:text-lg">
                            {getKeyValue(item, columnKey)}
                        </span>
                    );
            }
        },
        [viewUnahonForm, openReassessConfirm, openDeleteConfirm]
    );

    const loadingState = isLoading ? 'loading' : 'idle';
    const totalPages = data?.count ? Math.ceil(data.count / rowsPerPage) : 0;

    return (
        <div className={maroonUI.pageBg}>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* ✅ COMBINED HEADER + TOOLBAR (like User Controller) */}
                <Card className={`${maroonUI.headerCard} mb-8 overflow-hidden`}>
                    {/* Top gradient header */}
                    <div className={maroonUI.heroGradient}>
                        <div className={maroonUI.headerPad}>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h1 className={maroonUI.heroTitle}>
                                        Unahon Management
                                    </h1>
                                    <p className={`${maroonUI.heroSub} mt-2`}>
                                        Mental health assessment forms and
                                        analytics dashboard
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                                    <Button
                                        variant="light"
                                        startContent={
                                            <ArrowLeft className="w-4 h-4" />
                                        }
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
                      "
                                        onPress={() =>
                                            router.push('/dashboard')
                                        }
                                    >
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom toolbar area (attached) */}
                    <div className="bg-white/85 backdrop-blur-md border-t border-white/30">
                        <div className="px-6 py-5">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                {/* Left: filter buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button
                                                size="lg"
                                                className={`${maroonUI.controlBtn} ${maroonUI.controlBtnAssess} min-w-[220px] justify-between`}
                                                endContent={
                                                    <ChevronDown className="size-4 opacity-90" />
                                                }
                                                startContent={
                                                    <FileText className="w-4 h-4" />
                                                }
                                            >
                                                {
                                                    assessmentFilterOptions.find(
                                                        (o) =>
                                                            o.value ===
                                                            assessmentTypeFilter
                                                    )?.label
                                                }
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu className="bg-white/95 backdrop-blur-sm">
                                            {assessmentFilterOptions.map(
                                                (option) => (
                                                    <DropdownItem
                                                        key={option.value}
                                                        onPress={() =>
                                                            setAssessmentTypeFilter(
                                                                option.value
                                                            )
                                                        }
                                                        className="hover:bg-slate-100/80"
                                                    >
                                                        {option.label}
                                                    </DropdownItem>
                                                )
                                            )}
                                        </DropdownMenu>
                                    </Dropdown>

                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button
                                                size="lg"
                                                className={`${maroonUI.controlBtn} ${maroonUI.controlBtnDate} min-w-[180px] justify-between`}
                                                endContent={
                                                    <ChevronDown className="size-4 opacity-90" />
                                                }
                                                startContent={
                                                    <Calendar className="w-4 h-4" />
                                                }
                                            >
                                                {
                                                    dateFilterOptions.find(
                                                        (o) =>
                                                            o.value ===
                                                            dateFilter
                                                    )?.label
                                                }
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu className="bg-white/95 backdrop-blur-sm">
                                            {dateFilterOptions.map((option) => (
                                                <DropdownItem
                                                    key={option.value}
                                                    onPress={() =>
                                                        setDateFilter(
                                                            option.value
                                                        )
                                                    }
                                                    className="hover:bg-slate-100/80"
                                                >
                                                    {option.label}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>

                                {/* Right: search */}
                                <div className="w-full lg:w-[520px]">
                                    <Input
                                        placeholder="Search assessments, responders, or affiliations..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        classNames={{
                                            inputWrapper: maroonUI.searchWrap,
                                            input: maroonUI.searchInput,
                                        }}
                                        startContent={
                                            <Search className="h-5 w-5 text-[#7A0C1E]" />
                                        }
                                        endContent={
                                            searchQuery && (
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() =>
                                                        setSearchQuery('')
                                                    }
                                                    className="min-w-unit-6 w-6 h-6"
                                                >
                                                    <span className="text-slate-500">
                                                        ✕
                                                    </span>
                                                </Button>
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* ✅ STATS */}
                <div className="mb-8">
                    <h2
                        className={`${maroonUI.sectionTitle} mb-6 flex items-center gap-3`}
                    >
                        <div className={maroonUI.sectionBar} />
                        Dashboard Overview
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <Card
                                    key={index}
                                    className={`${maroonUI.statCard} animate-pulse`}
                                >
                                    <CardBody className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Skeleton className="w-14 h-14 rounded-2xl" />
                                            <div className="flex-1">
                                                <Skeleton className="w-32 h-6 rounded-lg mb-2" />
                                                <Skeleton className="w-24 h-4 rounded-lg" />
                                            </div>
                                        </div>
                                        <Skeleton className="w-24 h-10 rounded-lg mb-3" />
                                        <Skeleton className="w-full h-2 rounded-full" />
                                    </CardBody>
                                </Card>
                            ))
                        ) : (
                            <>
                                {/* Total Assessments */}
                                <Card
                                    className={`${maroonUI.statCard} ${maroonUI.cardHover}`}
                                >
                                    <CardBody className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div
                                                className={`${maroonUI.statIconWrap} bg-[#B91C1C]/10 text-[#7A0C1E]`}
                                            >
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    Total Assessments
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    All submissions
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <span className="text-4xl font-black text-slate-900">
                                                {statistics.total}
                                            </span>
                                            <span className="text-lg text-slate-500 ml-2">
                                                forms
                                            </span>
                                        </div>

                                        <div className="w-full bg-slate-200/80 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-[#7A0C1E] to-[#B91C1C] h-2 rounded-full w-full transition-all duration-500" />
                                        </div>
                                    </CardBody>
                                </Card>

                                {/* Initial Assessments */}
                                <Card
                                    className={`${maroonUI.statCard} ${maroonUI.cardHover}`}
                                >
                                    <CardBody className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div
                                                className={`${maroonUI.statIconWrap} bg-[#2A060D]/10 text-[#2A060D]`}
                                            >
                                                <Users className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    Initial Assessments
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    First evaluations
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <span className="text-4xl font-black text-slate-900">
                                                {statistics.initialAssessments}
                                            </span>
                                            <span className="text-lg text-slate-500 ml-2">
                                                initial
                                            </span>
                                        </div>

                                        <div className="w-full bg-slate-200/80 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-[#2A060D] to-[#6B0F25] h-2 rounded-full w-full transition-all duration-500" />
                                        </div>
                                    </CardBody>
                                </Card>

                                {/* Re-assessments */}
                                <Card
                                    className={`${maroonUI.statCard} ${maroonUI.cardHover}`}
                                >
                                    <CardBody className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div
                                                className={`${maroonUI.statIconWrap} bg-[#F59E0B]/10 text-[#B45309]`}
                                            >
                                                <Calendar className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    Re-assessments
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    Follow-up evaluations
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <span className="text-4xl font-black text-slate-900">
                                                {statistics.reAssessments}
                                            </span>
                                            <span className="text-lg text-slate-500 ml-2">
                                                follow-ups
                                            </span>
                                        </div>

                                        <div className="w-full bg-slate-200/80 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-[#B45309] to-[#F59E0B] h-2 rounded-full w-full transition-all duration-500" />
                                        </div>
                                    </CardBody>
                                </Card>

                                {/* This Week */}
                                <Card
                                    className={`${maroonUI.statCard} ${maroonUI.cardHover}`}
                                >
                                    <CardBody className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div
                                                className={`${maroonUI.statIconWrap} bg-[#7C3AED]/10 text-[#6D28D9]`}
                                            >
                                                <Clock className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    This Week
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    Recent activity
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <span className="text-4xl font-black text-slate-900">
                                                {statistics.thisWeek}
                                            </span>
                                            <span className="text-lg text-slate-500 ml-2">
                                                recent
                                            </span>
                                        </div>

                                        <div className="w-full bg-slate-200/80 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-[#6D28D9] to-[#A78BFA] h-2 rounded-full w-full transition-all duration-500" />
                                        </div>
                                    </CardBody>
                                </Card>
                            </>
                        )}
                    </div>
                </div>

                {/* ✅ TABLE */}
                <div className="mb-8">
                    <h2
                        className={`${maroonUI.sectionTitle} mb-6 flex items-center gap-3`}
                    >
                        <div className={maroonUI.sectionBar} />
                        Assessment Management
                    </h2>

                    <Card className={`${maroonUI.shell} rounded-[28px]`}>
                        <CardBody className="p-0 overflow-x-auto">
                            {!isHydrated ? (
                                <div className="flex items-center justify-center py-12">
                                    <Spinner size="lg" color="danger" />
                                </div>
                            ) : (
                                <Table
                                    aria-label="Unahon forms table"
                                    className="min-w-[1200px] table-fixed"
                                    classNames={{
                                        wrapper: 'shadow-none bg-transparent',
                                        th: maroonUI.tableTh,
                                        td: maroonUI.tableTd,
                                    }}
                                >
                                    <TableHeader columns={unahonDashboardCols}>
                                        {(column) => (
                                            <TableColumn
                                                key={column.key}
                                                className={`text-sm sm:text-md ${
                                                    column.key ===
                                                        'assessment-type' ||
                                                    column.key === 'actions'
                                                        ? 'text-center'
                                                        : ''
                                                } ${
                                                    column.key === 'client-id'
                                                        ? 'w-[160px]' // ⬆️ bigger Patient ID
                                                        : column.key ===
                                                            'responder-name'
                                                          ? 'w-[100px]' // ⬇️ smaller Responder
                                                          : column.key ===
                                                              'location'
                                                            ? 'w-[180px]'
                                                            : column.key ===
                                                                'date'
                                                              ? 'w-[120px]'
                                                              : column.key ===
                                                                  'affiliation'
                                                                ? 'w-[100px]'
                                                                : column.key ===
                                                                    'assessment-type'
                                                                  ? 'w-[180px]'
                                                                  : column.key ===
                                                                      'actions'
                                                                    ? 'w-[220px]'
                                                                    : ''
                                                }`}
                                            >
                                                {column.name}
                                            </TableColumn>
                                        )}
                                    </TableHeader>

                                    <TableBody
                                        items={rows}
                                        emptyContent={
                                            <div className="text-center py-12">
                                                <div className="text-6xl mb-4">
                                                    🔍
                                                </div>
                                                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                                    No assessments found
                                                </h3>
                                                <p className="text-slate-500">
                                                    Try adjusting your search
                                                    criteria or filters.
                                                </p>
                                            </div>
                                        }
                                        loadingContent={
                                            <div className="flex justify-center py-12">
                                                <Spinner
                                                    size="lg"
                                                    color="danger"
                                                />
                                            </div>
                                        }
                                        loadingState={loadingState}
                                    >
                                        {(item) => (
                                            <TableRow
                                                key={item.key}
                                                className={maroonUI.tableRow}
                                            >
                                                {(columnKey) => (
                                                    <TableCell
                                                        className={`text-sm ${
                                                            columnKey ===
                                                                'assessment-type' ||
                                                            columnKey ===
                                                                'actions'
                                                                ? 'text-center'
                                                                : ''
                                                        } ${columnKey === 'actions' ? 'px-2 py-3' : 'px-4 py-3'}`}
                                                    >
                                                        {renderCell(
                                                            item,
                                                            columnKey
                                                        )}
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* ✅ PAGINATION */}
                <Modal
                    isOpen={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                >
                    <ModalContent>
                        <ModalHeader className="font-bold">
                            Confirm Action
                        </ModalHeader>

                        <ModalBody>
                            <p className="text-slate-700 text-lg leading-relaxed">
                                Are you sure you want to{' '}
                                <span className="font-bold text-[#B91C1C]">
                                    DELETE
                                </span>{' '}
                                this assessment? This cannot be undone.
                            </p>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                variant="light"
                                onPress={() => {
                                    setDeleteConfirmOpen(false);
                                    setSelectedDeleteItem(null);
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="bg-[#7A0C1E] text-white"
                                onPress={deleteUnahonForm}
                            >
                                Confirm
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal
                    isOpen={reassessConfirmOpen}
                    onClose={() => setReassessConfirmOpen(false)}
                >
                    <ModalContent>
                        <ModalHeader className="font-bold">
                            Confirm Action
                        </ModalHeader>

                        <ModalBody>
                            <p className="text-slate-700 text-lg leading-relaxed">
                                Are you sure you want to{' '}
                                <span className="font-bold text-[#B45309]">
                                    REASSESS
                                </span>{' '}
                                this assessment?
                            </p>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                variant="light"
                                onPress={() => {
                                    setReassessConfirmOpen(false);
                                    setSelectedReassessItem(null);
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="bg-[#7A0C1E] text-white"
                                onPress={reassessUnahonForm}
                            >
                                Confirm
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal
                    isOpen={successModalOpen}
                    onClose={() => setSuccessModalOpen(false)}
                >
                    <ModalContent>
                        <ModalHeader className="font-bold">
                            {successTitle}
                        </ModalHeader>

                        <ModalBody>
                            <p className="text-slate-700 text-lg leading-relaxed">
                                {successMessage}
                            </p>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                className="bg-[#7A0C1E] text-white"
                                onPress={() => setSuccessModalOpen(false)}
                            >
                                OK
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {isHydrated && totalPages > 1 && (
                    <div className="flex w-full justify-center mt-6">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="danger"
                            page={page}
                            total={totalPages}
                            onChange={setPage}
                            classNames={{
                                wrapper: maroonUI.pagerWrap,
                                item: maroonUI.pagerItem,
                                cursor: maroonUI.pagerCursor,
                                prev: maroonUI.pagerNav,
                                next: maroonUI.pagerNav,
                                ellipsis:
                                    'text-slate-400 hover:text-[#7A0C1E] transition-colors duration-200',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnahonManagement;
