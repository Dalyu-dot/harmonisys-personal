'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';

import { Incident } from '@/types';
import { parseIncidentDates } from '@/lib/action/irs';
import MiSaludStats from '@/components/misalud/MiSaludStats';
import MiSaludGrid from '@/components/misalud/MiSaludGrid';

type IncidentsDashboardProps = {
    userRole?: 'ADMIN' | 'RESPONDER' | 'STANDARD' | string;
};

const IncidentsDashboard = ({
    userRole = 'STANDARD',
}: IncidentsDashboardProps) => {
    const router = useRouter();

    const [incidentsData, setIncidentsData] = useState<Incident[]>([]);
    const [loadingIncidents, setLoadingIncidents] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        const canAccess = userRole === 'ADMIN' || userRole === 'RESPONDER';
        if (!canAccess) {
            router.replace('/overview/irs');
        }
    }, [userRole, router]);

    const fetchIncidentsData = async () => {
        try {
            const response = await fetch('/api/irs/incidents');
            if (!response.ok) {
                throw new Error('Failed to fetch incidents data');
            }

            const data = await response.json();
            setIncidentsData(data.map(parseIncidentDates));
        } catch (error) {
            console.error('Error fetching incidents data:', error);
        } finally {
            setLoadingIncidents(false);
        }
    };

    useEffect(() => {
        fetchIncidentsData();
    }, []);

    const incidentGroups = useMemo(() => {
        const groups: { [key: string]: Incident[] } = {};

        incidentsData.forEach((incident) => {
            const team = incident.teamDeployed || 'Unassigned';
            if (!groups[team]) {
                groups[team] = [];
            }
            groups[team].push(incident);
        });

        return Object.entries(groups).map(([teamDeployed, incidents]) => ({
            teamDeployed,
            incidents,
            totalIncidents: incidents.length,
            lastIncident: incidents.reduce(
                (latest, incident) =>
                    new Date(incident.createdAt) > new Date(latest)
                        ? incident.createdAt
                        : latest,
                incidents[0]?.createdAt || ''
            ),
            severityBreakdown: {} as { [key: string]: number },
        }));
    }, [incidentsData]);

    const filteredEvents = useMemo(() => {
        let filtered = incidentGroups;

        if (searchQuery) {
            filtered = filtered.filter(
                (group) =>
                    group.teamDeployed
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    group.incidents.some(
                        (incident) =>
                            incident.summary
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                            incident.location
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                            incident.category
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                    )
            );
        }

        return filtered;
    }, [incidentGroups, searchQuery]);

    const handleEventClick = (teamDeployed: string) => {
        router.push(`/irs/event/${encodeURIComponent(teamDeployed)}`);
    };

    return (
        <div
            className="min-h-screen"
            style={{
                background:
                    'linear-gradient(135deg, rgba(123,18,47,0.08) 0%, rgba(123,18,47,0.14) 35%, rgba(123,18,47,0.10) 100%)',
            }}
        >
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <Card className="mb-8 bg-white/70 backdrop-blur-sm shadow-lg border border-white/20 overflow-hidden rounded-[28px]">
                    <div className="bg-gradient-to-r from-[#7B122F] via-[#8E1738] to-[#A3153D]">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
                                        See Incidents
                                    </h1>
                                    <p className="text-white/85 text-lg">
                                        Browse, review, and monitor submitted
                                        incident reports in a dedicated IRS
                                        workspace
                                    </p>
                                </div>

                                <Button
                                    variant="light"
                                    startContent={
                                        <ArrowLeft className="w-4 h-4" />
                                    }
                                    className="h-12 px-6 bg-white/15 text-white border border-white/25 backdrop-blur-sm hover:bg-white/20 rounded-xl"
                                    onPress={() => router.push('/overview/irs')}
                                >
                                    Go back to IRS Page
                                </Button>
                            </div>
                        </div>
                    </div>

                    <CardBody className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_320px] gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Search by team, summary, location, or category"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-14 w-full rounded-2xl border border-white/80 bg-white/95 px-5 text-[15px] font-medium text-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.08)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#7B122F] focus:ring-2 focus:ring-[#7B122F]/20"
                            />

                            <select
                                value={selectedFilter}
                                onChange={(e) =>
                                    setSelectedFilter(e.target.value)
                                }
                                className="h-14 w-full rounded-2xl border border-white/80 bg-white/95 px-5 text-[15px] font-semibold text-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.08)] outline-none transition-all duration-200 focus:border-[#7B122F] focus:ring-2 focus:ring-[#7B122F]/20"
                            >
                                <option value="all">All Incidents</option>
                                <option value="status-pending">Pending</option>
                                <option value="status-resolved">
                                    Resolved
                                </option>
                                <option value="status-active">Active</option>
                            </select>
                        </div>
                    </CardBody>
                </Card>

                <MiSaludStats
                    isArchiveView={false}
                    teamsData={[]}
                    eventsData={[]}
                    selectedView="events"
                    teamGroups={[]}
                    filteredTeams={[]}
                    filteredEvents={filteredEvents}
                    questionnaireData={{ submissions: [] }}
                    incidentsData={incidentsData}
                    loading={loadingIncidents}
                />

                <MiSaludGrid
                    isLoading={loadingIncidents}
                    selectedView="events"
                    isArchiveView={false}
                    filteredTeams={[]}
                    handleTeamClick={() => {}}
                    filteredEvents={filteredEvents}
                    getTeamByEventId={() => undefined}
                    handleEventClick={handleEventClick}
                />
            </div>
        </div>
    );
};

export default IncidentsDashboard;
