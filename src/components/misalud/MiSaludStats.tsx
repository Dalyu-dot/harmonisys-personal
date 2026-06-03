import type { Team, Event } from '@/types';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon } from 'lucide-react';
import { QuestionnaireData, QuestionnaireSubmission } from './MiSalud';
import { Incident } from '@/types';

interface Props {
    isArchiveView: boolean;
    teamsData: Team[];
    eventsData: Event[];
    selectedView: 'teams' | 'events';
    teamGroups: {
        teamName: string;
        members: QuestionnaireSubmission[];
        totalSubmissions: number;
        lastSubmission: string;
    }[];
    filteredTeams:
        | Team[]
        | {
              teamName: string;
              members: QuestionnaireSubmission[];
              totalSubmissions: number;
              lastSubmission: string;
          }[];

    filteredEvents:
        | Event[]
        | {
              teamDeployed: string;
              incidents: Incident[];
              totalIncidents: number;
              lastIncident: Date;
              severityBreakdown: {
                  [key: string]: number;
              };
          }[];
    questionnaireData: QuestionnaireData;
    incidentsData: Incident[];
    loading?: boolean;
}

const MiSaludStats = ({
    isArchiveView,
    teamsData,
    eventsData,
    selectedView,
    teamGroups,
    filteredTeams,
    filteredEvents,
    questionnaireData,
    incidentsData,
    loading = false,
}: Props) => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <div
                    className={`w-1 h-8 rounded-full ${
                        selectedView === 'events'
                            ? 'bg-gradient-to-b from-[#7B122F] to-[#A3153D]'
                            : 'bg-gradient-to-b from-emerald-500 to-teal-600'
                    }`}
                ></div>
                Dashboard Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <Card
                            key={index}
                            className="bg-white/70 backdrop-blur-sm shadow-lg border border-white/20"
                        >
                            <CardBody className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <Skeleton className="w-14 h-14 rounded-xl">
                                        <div className="h-14"></div>
                                    </Skeleton>
                                    <div className="flex-1">
                                        <Skeleton className="w-40 h-6 rounded-lg mb-2">
                                            <div className="h-6"></div>
                                        </Skeleton>
                                        <Skeleton className="w-32 h-4 rounded-lg">
                                            <div className="h-4"></div>
                                        </Skeleton>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <Skeleton className="w-20 h-12 rounded-lg mb-2">
                                        <div className="h-12"></div>
                                    </Skeleton>
                                    <Skeleton className="w-24 h-6 rounded-lg">
                                        <div className="h-6"></div>
                                    </Skeleton>
                                </div>
                                <Skeleton className="w-full h-2 rounded-full">
                                    <div className="h-2"></div>
                                </Skeleton>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <>
                        <Card className="bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 hover:-translate-y-2">
                            <CardBody className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-100 rounded-xl">
                                        <UsersIcon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            {selectedView === 'events'
                                                ? 'Teams Deployed'
                                                : isArchiveView
                                                  ? 'Archived Teams'
                                                  : 'Active Teams'}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {selectedView === 'events'
                                                ? 'Teams with incident records'
                                                : 'Currently managed'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="text-4xl font-bold text-slate-900">
                                        {selectedView === 'events'
                                            ? filteredEvents.length
                                            : isArchiveView
                                              ? teamsData.length
                                              : teamGroups.length}
                                    </span>
                                    <span className="text-lg text-slate-500 ml-2">
                                        {selectedView === 'events'
                                            ? 'teams'
                                            : 'teams'}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full w-full transition-all duration-500 ${'bg-gradient-to-r from-blue-500 to-blue-600'}`}
                                    ></div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Total Submissions/Events */}
                        <Card className="bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 hover:-translate-y-2">
                            <CardBody className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-xl bg-red-100">
                                        <CalendarIcon className="w-8 h-8 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            {isArchiveView
                                                ? 'Archived Events'
                                                : selectedView === 'teams'
                                                  ? 'Total Submissions'
                                                  : 'Total Incidents'}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Data collected
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="text-4xl font-bold text-slate-900">
                                        {isArchiveView
                                            ? eventsData.length
                                            : selectedView === 'teams'
                                              ? questionnaireData.submissions
                                                    .length
                                              : incidentsData.length}
                                    </span>
                                    <span className="text-lg text-slate-500 ml-2">
                                        {selectedView === 'teams'
                                            ? 'submissions'
                                            : 'incidents'}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="h-2 rounded-full w-full transition-all duration-500 bg-gradient-to-r from-[#7B122F] to-[#A3153D]"></div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Showing Items */}
                        <Card className="bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 hover:-translate-y-2">
                            <CardBody className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div
                                        className={`p-3 rounded-xl ${'bg-green-100'}`}
                                    >
                                        <ClockIcon
                                            className={`w-8 h-8 ${'text-green-600'}`}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Filtered Results
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Currently showing
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="text-4xl font-bold text-slate-900">
                                        {selectedView === 'teams'
                                            ? filteredTeams.length
                                            : filteredEvents.length}
                                    </span>
                                    <span className="text-lg text-slate-500 ml-2">
                                        items
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full w-full transition-all duration-500 ${'bg-gradient-to-r from-green-500 to-green-600'}`}
                                    ></div>
                                </div>
                            </CardBody>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};

export default MiSaludStats;
