'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@heroui/react';
import {
    ArrowRight,
    Info,
    ClipboardList,
    Activity,
    HeartPulse,
    BarChart3,
    ShieldCheck,
    CheckCircle2,
} from 'lucide-react';

type MiSaludOverviewProps = {
    name: string;
    subheading?: string;
    description: string;
    subdescription?: string;
    imageUrl: string;
    urls: string[];
    isAuthenticated?: boolean;
    protectedRoutes?: string[];
    userRole?: 'ADMIN' | 'RESPONDER' | 'STANDARD' | string;
};

const MiSaludOverview = ({
    name,
    subheading,
    description,
    subdescription,
    imageUrl,
    urls,
    isAuthenticated = false,
    protectedRoutes = urls,
    userRole = 'STANDARD',
}: MiSaludOverviewProps) => {
    const isRouteProtected = (url: string) => protectedRoutes.includes(url);

    const roleRaw = String(userRole || 'STANDARD').toUpperCase();

    const isResponderRole = roleRaw.includes('RESPONDER');
    const isAdminRole = roleRaw.includes('ADMIN');
    console.log('MiSaludOverview props:', {
        isAuthenticated,
        userRole,
        roleRaw,
        urls,
    });

    const isResponderView = isAuthenticated && isResponderRole;

    const canAccessMiSaludDashboard =
        isAuthenticated && (isAdminRole || isResponderRole);

    const router = useRouter();
    const dashboardUrl = '/misalud';

    useEffect(() => {
        if (isResponderView) {
            router.replace(dashboardUrl);
        }
    }, [isResponderView, dashboardUrl, router]);

    const heroSubtitle =
        subheading ??
        'Responder Fitness Monitoring and Stress Management Mobile App';

    const BG = 'bg-cover bg-center bg-no-repeat min-h-screen w-full';
    const PRIMARY = '#047857';
    const PRIMARY_HOVER = '#065F46';
    const PRIMARY_DARK = '#065F46';
    const PRIMARY_BTN = 'bg-emerald-700 hover:bg-emerald-800';

    const bgStyle: React.CSSProperties = {
        backgroundColor: '#ECFDF5',
    };

    const bulletPoints =
        subdescription
            ?.split(/[•\n]|\.\s+/)
            .map((s) => s.trim())
            .filter(Boolean)
            .map((s) => (s.endsWith('.') ? s : `${s}.`)) ?? [];

    return (
        <div className={BG} style={bgStyle}>
            <div className="container mx-auto px-4 py-10 max-w-7xl">
                {/* HERO */}
                <div className="grid lg:grid-cols-[1fr_220px] gap-6 items-start mb-10">
                    {/* Left */}
                    <div className="space-y-5">
                        <div>
                            <h1
                                className="text-5xl sm:text-6xl font-black leading-[1.02] tracking-tight"
                                style={{
                                    color: PRIMARY_DARK,
                                    textShadow:
                                        '0 4px 18px rgba(255,255,255,0.95)',
                                }}
                            >
                                {name}
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-700 mt-3">
                                {heroSubtitle}
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {urls.slice(0, 2).map((url, idx) => {
                                const isProtected = isRouteProtected(url);
                                const isAccessible =
                                    idx === 0
                                        ? canAccessMiSaludDashboard
                                        : !isProtected || isAuthenticated;

                                const routeName = url
                                    .split('/')
                                    .at(-1)!
                                    .replace(/[-_]/g, ' ')
                                    .replace(/\b\w/g, (l) => l.toUpperCase());

                                const isPrimary = idx === 0;

                                const buttonLabel =
                                    idx === 0
                                        ? 'Mi Salud Dashboard'
                                        : routeName;

                                return isAccessible ? (
                                    <Button
                                        key={url}
                                        as={Link}
                                        href={idx === 0 ? dashboardUrl : url}
                                        className={`h-12 px-6 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                                            isPrimary
                                                ? `${PRIMARY_BTN} text-white`
                                                : 'bg-white/80 hover:bg-white text-emerald-800 border border-emerald-200'
                                        }`}
                                        endContent={
                                            <ArrowRight className="w-5 h-5" />
                                        }
                                    >
                                        {buttonLabel}
                                    </Button>
                                ) : (
                                    <Button
                                        key={url}
                                        as={Link}
                                        href={idx === 0 ? dashboardUrl : url}
                                        size="lg"
                                        isDisabled
                                        className="font-bold text-white min-w-[240px] h-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02]"
                                        endContent={
                                            <ArrowRight className="w-5 h-5" />
                                        }
                                        style={{ backgroundColor: PRIMARY }}
                                        onMouseEnter={(e) => {
                                            (
                                                e.currentTarget as HTMLButtonElement
                                            ).style.backgroundColor =
                                                PRIMARY_HOVER;
                                        }}
                                        onMouseLeave={(e) => {
                                            (
                                                e.currentTarget as HTMLButtonElement
                                            ).style.backgroundColor = PRIMARY;
                                        }}
                                    >
                                        {buttonLabel}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex lg:justify-end">
                        <div className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px]">
                            <Image
                                src={imageUrl || '/placeholder.svg'}
                                alt={`${name} logo`}
                                fill
                                className="object-contain"
                                sizes="160px"
                                priority
                            />
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: PRIMARY }}
                                >
                                    <Info className="w-6 h-6 text-white" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        About {name}
                                    </h2>
                                    <div
                                        className="h-1 w-16 rounded-full mt-2"
                                        style={{ backgroundColor: PRIMARY }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-slate-700 text-base sm:text-lg leading-relaxed text-justify">
                                    {description}
                                </p>

                                {/* Key Features box — KEEP YOUR CONTENT, but match the other code vibe */}
                                <div className="bg-gradient-to-r from-emerald-50 to-white rounded-xl p-5 border border-emerald-100">
                                    <h3
                                        className="text-lg font-semibold mb-3"
                                        style={{ color: PRIMARY_DARK }}
                                    >
                                        Key Features
                                    </h3>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            {
                                                title: 'Fitness Monitoring',
                                                desc: 'Track physical health and fitness metrics',
                                                Icon: Activity,
                                            },
                                            {
                                                title: 'Stress Management',
                                                desc: 'Tools and insights for managing stress levels',
                                                Icon: HeartPulse,
                                            },
                                            {
                                                title: 'Real-time Analytics',
                                                desc: 'Live monitoring and performance tracking',
                                                Icon: BarChart3,
                                            },
                                            {
                                                title: 'Health Protection',
                                                desc: 'Proactive health monitoring for responders',
                                                Icon: ShieldCheck,
                                            },
                                        ].map(({ title, desc, Icon }) => (
                                            <div
                                                key={title}
                                                className="bg-white rounded-lg p-4 border border-slate-200 hover:border-emerald-200 transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                        <Icon
                                                            className="w-5 h-5"
                                                            style={{
                                                                color: PRIMARY,
                                                            }}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold text-slate-800 text-sm mb-1">
                                                            {title}
                                                        </h4>
                                                        <p className="text-xs text-slate-600">
                                                            {desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {subdescription ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: PRIMARY }}
                                >
                                    <ClipboardList className="w-6 h-6 text-white" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        Project Background
                                    </h2>
                                    <div
                                        className="h-1 w-16 rounded-full mt-2"
                                        style={{ backgroundColor: PRIMARY }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {bulletPoints
                                    .slice(0, 5)
                                    .map((point, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-slate-200 hover:border-emerald-200 transition-colors"
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                <CheckCircle2
                                                    className="w-5 h-5"
                                                    style={{ color: PRIMARY }}
                                                />
                                            </div>
                                            <p className="text-slate-700 text-sm leading-relaxed text-justify">
                                                {point}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MiSaludOverview;
