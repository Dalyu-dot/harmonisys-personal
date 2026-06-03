'use client';

import React, { useMemo } from 'react';

import { Card, CardBody, CardHeader, Progress, Chip } from '@heroui/react';
import { MapPin, Users, AlertTriangle } from 'lucide-react';
import type { DashboardChartsData } from '@/types';

interface DashboardChartsProps {
    chartsData: DashboardChartsData | null;
}

const COLORS = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
    '#F97316',
    '#84CC16',
];

const formatCategoryName = (value: string) => {
    return value
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const extractCity = (rawLocation: string) => {
    const value = String(rawLocation || '').trim();
    if (!value) return 'Unknown';

    const parts = value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length === 0) return 'Unknown';

    const ignored = new Set([
        'metro manila',
        'ncr',
        'national capital region',
        'philippines',
    ]);

    for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];
        const lower = part.toLowerCase();

        if (ignored.has(lower)) continue;

        if (
            lower.includes('city') ||
            lower.includes('municipality') ||
            lower.includes('manila') ||
            lower.includes('quezon') ||
            lower.includes('makati') ||
            lower.includes('pasig') ||
            lower.includes('taguig') ||
            lower.includes('pasay') ||
            lower.includes('parañaque') ||
            lower.includes('paranaque') ||
            lower.includes('las piñas') ||
            lower.includes('las pinas') ||
            lower.includes('mandaluyong') ||
            lower.includes('marikina') ||
            lower.includes('muntinlupa') ||
            lower.includes('caloocan') ||
            lower.includes('malabon') ||
            lower.includes('navotas') ||
            lower.includes('valenzuela') ||
            lower.includes('cebu') ||
            lower.includes('davao')
        ) {
            return part;
        }
    }

    if (parts.length >= 2) return parts[parts.length - 2];
    return parts[parts.length - 1];
};

const extractResponderName = (description: string) => {
    const raw = description.split('by ')[1]?.trim() || 'Unknown';
    return raw.replace(/\s+/g, ' ');
};

const DashboardCharts: React.FC<DashboardChartsProps> = React.memo(
    ({ chartsData }) => {
        if (!chartsData) {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card
                            key={i}
                            className="bg-white/80 backdrop-blur-xl shadow-xl border border-white/60 rounded-3xl"
                        >
                            <CardBody className="p-6">
                                <div className="animate-pulse">
                                    <div className="h-5 bg-slate-200 rounded-lg w-1/3 mb-4" />
                                    <div className="h-56 bg-slate-200 rounded-2xl" />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            );
        }

        const categoryData = useMemo(
            () =>
                [...chartsData.distributions.category]
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 6),
            [chartsData.distributions.category]
        );

        const maxCategoryValue = useMemo(
            () => Math.max(...categoryData.map((c) => c.value), 1),
            [categoryData]
        );

        const groupedLocations = useMemo(() => {
            const groupedLocationsMap = new Map<string, number>();

            chartsData.topLocations.forEach((location) => {
                const city = extractCity(location.name);
                groupedLocationsMap.set(
                    city,
                    (groupedLocationsMap.get(city) || 0) + location.value
                );
            });

            return [...groupedLocationsMap.entries()]
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 6);
        }, [chartsData.topLocations]);

        const maxLocationValue = useMemo(
            () => Math.max(...groupedLocations.map((l) => l.value), 1),
            [groupedLocations]
        );

        const responderData = useMemo(
            () =>
                chartsData.recentActivity
                    .filter((activity) => activity.type === 'assessment')
                    .slice(0, 5)
                    .map((activity, index) => ({
                        id: activity.id,
                        rank: index + 1,
                        name: extractResponderName(activity.description),
                        title: activity.title,
                        timestamp: activity.timestamp,
                    })),
            [chartsData.recentActivity]
        );

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-slate-900">
                        Analytics Dashboard
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#7B122F]/30 to-transparent" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Incident Categories */}
                    <Card className="bg-white/90 backdrop-blur-xl shadow-xl border border-white/60 rounded-3xl">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl shadow-sm">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">
                                        Incident Categories
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Distribution by type
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody className="pt-2">
                            <div className="space-y-5">
                                {categoryData.map((item, index) => {
                                    const pct = Math.round(
                                        (item.value / maxCategoryValue) * 100
                                    );

                                    return (
                                        <div
                                            key={item.name}
                                            className="space-y-2.5"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div
                                                        className="w-4 h-4 rounded-full shadow-sm flex-shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                COLORS[
                                                                    index %
                                                                        COLORS.length
                                                                ],
                                                        }}
                                                    />
                                                    <span className="font-bold text-slate-700 truncate">
                                                        {formatCategoryName(
                                                            item.name
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <span className="font-black text-slate-900 text-lg">
                                                        {item.value}
                                                    </span>
                                                    <Chip
                                                        size="sm"
                                                        variant="flat"
                                                        className="min-w-[52px] justify-center bg-slate-100 text-slate-700"
                                                    >
                                                        {pct}%
                                                    </Chip>
                                                </div>
                                            </div>

                                            <Progress
                                                value={pct}
                                                className="max-w-full"
                                                color={
                                                    index === 0
                                                        ? 'danger'
                                                        : index === 1
                                                          ? 'warning'
                                                          : 'primary'
                                                }
                                                size="md"
                                                aria-labelledby="progress"
                                                aria-valuenow={pct}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Top Responders */}
                    <Card className="bg-white/90 backdrop-blur-xl shadow-xl border border-white/60 rounded-3xl">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-sm">
                                    <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">
                                        Top Responders
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Most active team members
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody className="pt-2">
                            <div className="space-y-3">
                                {responderData.length === 0 ? (
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-slate-500">
                                        No responder activity yet.
                                    </div>
                                ) : (
                                    responderData.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-black shadow-md">
                                                        #{item.rank}
                                                    </div>
                                                    {item.rank <= 3 && (
                                                        <div className="absolute -top-1 -right-1 text-xs">
                                                            🏆
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-black text-slate-900 truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-slate-600 truncate">
                                                        {item.title}
                                                    </p>
                                                </div>
                                            </div>

                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                className="bg-violet-100 text-violet-700 flex-shrink-0"
                                            >
                                                {new Date(
                                                    item.timestamp
                                                ).toLocaleDateString()}
                                            </Chip>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Top Locations */}
                    <Card className="bg-white/90 backdrop-blur-xl shadow-xl border border-white/60 rounded-3xl xl:col-span-2">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-[#F3D9E1] to-[#EBC7D3] rounded-2xl shadow-sm">
                                    <MapPin className="w-5 h-5 text-[#7B122F]" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">
                                        Top Incident Cities
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Grouped by city for cleaner analytics
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody className="pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {groupedLocations.length === 0 ? (
                                    <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-slate-500">
                                        No location data yet.
                                    </div>
                                ) : (
                                    groupedLocations.map((location, index) => {
                                        const pct = Math.round(
                                            (location.value /
                                                maxLocationValue) *
                                                100
                                        );

                                        return (
                                            <div
                                                key={location.name}
                                                className="rounded-2xl border border-[#E6C7D0] bg-gradient-to-r from-[#FAF1F4] to-[#F6E9EE] px-4 py-4 shadow-sm"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="relative flex-shrink-0">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A3153D] to-[#7B122F] text-white flex items-center justify-center font-black shadow-md">
                                                            {index + 1}
                                                        </div>
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <p className="font-black text-slate-900 truncate">
                                                                {location.name}
                                                            </p>
                                                            <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                                                                {location.value}{' '}
                                                                incident
                                                                {location.value !==
                                                                1
                                                                    ? 's'
                                                                    : ''}
                                                            </span>
                                                        </div>

                                                        <div className="mt-3">
                                                            <Progress
                                                                value={pct}
                                                                className="max-w-full"
                                                                color="danger"
                                                                size="sm"
                                                                aria-labelledby="progress"
                                                                aria-valuenow={
                                                                    pct
                                                                }
                                                                aria-valuemin={
                                                                    0
                                                                }
                                                                aria-valuemax={
                                                                    100
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }
);

export default DashboardCharts;
