'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, CardHeader, Button, Skeleton } from '@heroui/react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ClipboardList,
    HeartPulse,
    User,
    CalendarDays,
} from 'lucide-react';

type QuestionResponse = {
    id: string;
    questionId: number;
    questionText: string;
    selectedOption: string;
};

type SubmissionDetails = {
    id: string;
    name: string;
    date: string;
    team: string;
    createdAt: string;
    updatedAt: string;
    responses: QuestionResponse[];
    user: {
        id: string;
        name: string | null;
        email: string;
    };
};

interface Props {
    submissionId: string;
}

const formatDate = (value?: string | null) => {
    if (!value) return '—';

    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const MiSaludSubmissionDetailsClient = ({ submissionId }: Props) => {
    const router = useRouter();
    const { data: submission = null, isLoading: loading } =
        useQuery<SubmissionDetails | null>({
            queryKey: ['misalud-submission-details', submissionId],
            queryFn: async () => {
                const response = await fetch(
                    `/api/misalud/admin/submissions/${submissionId}`
                );
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.error || 'Failed to fetch submission'
                    );
                }

                return result.submission || null;
            },
            staleTime: 5 * 60 * 1000,
        });

    return (
        <div className="min-h-screen bg-emerald-50">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <Card className="mb-8 bg-white/70 backdrop-blur-sm shadow-lg border border-white/20 overflow-hidden rounded-[28px]">
                    <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
                                        Assess Health Details
                                    </h1>
                                    <p className="text-white/85 text-lg">
                                        View a full submitted wellness
                                        assessment
                                    </p>
                                </div>

                                <Button
                                    variant="light"
                                    startContent={
                                        <ArrowLeft className="w-4 h-4" />
                                    }
                                    className="h-12 px-6 bg-white/15 text-white border border-white/25 backdrop-blur-sm rounded-xl"
                                    onPress={() =>
                                        router.push('/misalud/manage')
                                    }
                                >
                                    Back to Mi Salud Admin
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {loading ? (
                    <Card className="bg-white/80 border border-white/20 shadow-lg rounded-2xl">
                        <CardBody className="p-6 space-y-4">
                            <Skeleton className="w-64 h-8 rounded-lg" />
                            <Skeleton className="w-full h-24 rounded-xl" />
                            <Skeleton className="w-full h-24 rounded-xl" />
                            <Skeleton className="w-full h-24 rounded-xl" />
                        </CardBody>
                    </Card>
                ) : !submission ? (
                    <Card className="bg-white/80 border border-white/20 shadow-lg rounded-2xl">
                        <CardBody className="p-12 text-center text-slate-500">
                            Submission not found.
                        </CardBody>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <Card className="bg-white/80 border border-white/20 shadow-lg rounded-2xl">
                            <CardHeader>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        Submission Information
                                    </h2>
                                    <p className="text-slate-600">
                                        Overview of the submitted Assess Health
                                        form
                                    </p>
                                </div>
                            </CardHeader>

                            <CardBody className="pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-emerald-700" />
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Name
                                            </p>
                                        </div>
                                        <p className="font-bold text-slate-800">
                                            {submission.name}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-emerald-700" />
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Email
                                            </p>
                                        </div>
                                        <p className="font-bold text-slate-800">
                                            {submission.user.email}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <HeartPulse className="w-4 h-4 text-emerald-700" />
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Team
                                            </p>
                                        </div>
                                        <p className="font-bold text-slate-800">
                                            {submission.team}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CalendarDays className="w-4 h-4 text-emerald-700" />
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Assessment Date
                                            </p>
                                        </div>
                                        <p className="font-bold text-slate-800">
                                            {formatDate(submission.date)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4 md:col-span-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ClipboardList className="w-4 h-4 text-emerald-700" />
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Submitted At
                                            </p>
                                        </div>
                                        <p className="font-bold text-slate-800">
                                            {formatDate(submission.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="bg-white/80 border border-white/20 shadow-lg rounded-2xl">
                            <CardHeader>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        Submitted Answers
                                    </h2>
                                    <p className="text-slate-600">
                                        Full response list for this assessment
                                    </p>
                                </div>
                            </CardHeader>

                            <CardBody className="pt-2">
                                <div className="space-y-4">
                                    {submission.responses.map((response) => (
                                        <div
                                            key={response.id}
                                            className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4"
                                        >
                                            <p className="text-sm font-semibold text-emerald-800 mb-2">
                                                {response.questionId}.{' '}
                                                {response.questionText}
                                            </p>
                                            <p className="text-slate-700 font-medium">
                                                {response.selectedOption}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MiSaludSubmissionDetailsClient;
