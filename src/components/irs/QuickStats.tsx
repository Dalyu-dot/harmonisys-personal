import { Card, CardBody, Skeleton } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import type { Event } from '@/app/api/irs/events/route';
import {
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
} from 'recharts';
import { CalendarDays, MapPin } from 'lucide-react';

interface Props {
    locationData: {
        color: string;
        name: string;
        value: number;
    }[];

    events: Event[];

    eventStats: {
        ongoing: number;
        completed: number;
        pending: number;
    };

    loading?: boolean;
}

const QuickStats = ({
    locationData,
    events,
    eventStats,
    loading = false,
}: Props) => {
    const statsRef = useRef<HTMLDivElement | null>(null);
    const wasInViewRef = useRef(false);
    const [chartKey, setChartKey] = useState(0);
    const triggerAnimate = () => setChartKey((k) => k + 1);

    const resolutionRate = Math.round(
        (eventStats.completed / Math.max(events.length, 1)) * 100
    );

    const gaugeData = [
        { name: 'rate', value: Math.min(Math.max(resolutionRate, 0), 100) },
    ];

    useEffect(() => {
        const el = statsRef.current;
        if (!el) return;

        wasInViewRef.current = false;

        const io = new IntersectionObserver(
            ([entry]) => {
                const isInView = !!entry?.isIntersecting;

                if (isInView && !wasInViewRef.current) {
                    triggerAnimate();
                }

                wasInViewRef.current = isInView;
            },
            {
                threshold: 0.35,
                rootMargin: '0px 0px -10% 0px',
            }
        );

        io.observe(el);

        return () => {
            io.disconnect();
        };
    }, []);

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-7 bg-[#7B122F] rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                    Events Statistics
                </h2>
            </div>

            {/* ✅ maroon theme + no height hack so it aligns naturally with IRSCharts card */}
            <Card
                ref={statsRef as any}
                className="relative overflow-hidden rounded-3xl bg-[#7B122F]/80 border border-white/25
        shadow-[0_0_0_1.5px_rgba(255,255,255,0.70),0_18px_45px_rgba(0,0,0,0.28)]
        hover:shadow-[0_0_0_2px_rgba(255,255,255,0.85),0_22px_55px_rgba(0,0,0,0.30)]
        transition-shadow duration-300"
            >
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1.5 ring-white/35" />

                {/* ✅ match IRSCharts padding */}
                <CardBody className="p-5 sm:p-6 flex flex-col">
                    {loading ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 items-stretch">
                                <Skeleton className="h-24 rounded-2xl" />
                                <Skeleton className="h-24 rounded-2xl" />
                            </div>
                            <Skeleton className="h-72 rounded-2xl" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {/* KPI tiles */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-white/85 border border-white/80 p-3 h-[84px] flex items-center">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="h-10 w-10 rounded-2xl bg-[#7B122F] flex items-center justify-center shadow-sm">
                                            <CalendarDays className="w-5 h-5 text-white" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="text-xs font-semibold text-slate-600 leading-tight">
                                                Total Events
                                            </div>
                                            <div className="mt-1 text-3xl font-black text-slate-900 leading-none">
                                                {events.length}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-white/85 border border-white/80 p-3 h-[84px] flex items-center">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="h-10 w-10 rounded-2xl bg-[#7B122F] flex items-center justify-center shadow-sm">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="text-xs font-semibold text-slate-600 leading-tight">
                                                Locations
                                            </div>
                                            <div className="mt-1 text-3xl font-black text-slate-900 leading-none">
                                                {locationData.length}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gauge */}
                            <div className="rounded-2xl bg-white/85 border border-white/80 p-2 flex flex-col items-center pb-4">
                                {/* chart */}
                                <div className="w-full h-[5.75rem]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <RadialBarChart
                                            key={chartKey}
                                            cx="50%"
                                            cy="56%"
                                            innerRadius="68%"
                                            outerRadius="100%"
                                            barSize={14}
                                            data={gaugeData}
                                            startAngle={180}
                                            endAngle={0}
                                        >
                                            <PolarAngleAxis
                                                type="number"
                                                domain={[0, 100]}
                                                angleAxisId={0}
                                                tick={false}
                                            />
                                            <RadialBar
                                                dataKey="value"
                                                cornerRadius={10}
                                                fill="#7B122F"
                                                background={{
                                                    fill: 'rgba(148, 163, 184, 0.45)',
                                                }}
                                                isAnimationActive={true}
                                                animationDuration={900}
                                                animationEasing="ease-out"
                                            />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* percent */}
                                <div className="-mt-4 mb-1 text-4xl font-black text-slate-900 leading-none">
                                    {resolutionRate}%
                                </div>

                                {/* label below */}
                                <div className="mt-1.5 text-sm font-black text-[#7B122F] leading-none">
                                    Resolution Rate
                                </div>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default QuickStats;
