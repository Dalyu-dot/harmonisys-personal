'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
import { ArrowRight, Info } from 'lucide-react';

type HazardHunterOverviewProps = {
    name: string;
    subheading?: string;
    description: string;
    subdescription?: string;
    imageUrl: string; // logo (used in hero right)
    previewImageUrl?: string; // image for the right-side Image Card
    urls: string[]; // first url should be /hazardhunter
    isAuthenticated?: boolean;
    protectedRoutes?: string[];
    userRole?: 'ADMIN' | 'RESPONDER' | 'STANDARD' | string;
};

const HazardHunterOverview = ({
    name,
    subheading,
    description,
    subdescription,
    imageUrl,
    previewImageUrl,
    urls,
    isAuthenticated = false,
    protectedRoutes = urls,
    userRole = 'STANDARD',
}: HazardHunterOverviewProps) => {
    const isRouteProtected = (url: string) => protectedRoutes.includes(url);

    const router = useRouter();

    const roleRaw = String(userRole || 'STANDARD').toUpperCase();
    const isResponderRole = roleRaw.includes('RESPONDER');
    const isAdminRole = roleRaw.includes('ADMIN');

    // ✅ If Responder/Admin, skip overview page and go straight to dashboard
    useEffect(() => {
        if (isAuthenticated && (isResponderRole || isAdminRole)) {
            router.replace('/hazardhunter');
        }
    }, [isAuthenticated, isResponderRole, isAdminRole, router]);

    const heroSubtitle =
        subheading ??
        'Rapid Multi-Hazard Assessment Tool for Any Location in the Philippines';

    // ✅ Earth-tone HazardHunter theme
    const BG =
        'min-h-screen w-full bg-gradient-to-br from-[#f6f1e8] via-[#efe4d4] to-[#e8d7c2]';
    const PRIMARY = '#5A3E2B'; // earth brown
    const PRIMARY_HOVER = '#4A3223';
    const PRIMARY_DARK = '#3B2F2F'; // deep soil
    const PRIMARY_BTN = 'bg-[#5A3E2B] hover:bg-[#4A3223] text-white';

    const firstUrl = urls?.[0] ?? '/hazardhunter';

    const routeName = firstUrl
        .split('/')
        .at(-1)!
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

    // Optional: rename the button label
    const buttonLabel = 'HazardHunter Dashboard';

    const isProtected = isRouteProtected(firstUrl);
    const isAccessible = !isProtected || isAuthenticated;

    return (
        <div className={BG}>
            <div className="container mx-auto px-4 py-10 max-w-7xl">
                {/* HERO (NO CARD) */}
                <div className="grid lg:grid-cols-[1fr_220px] gap-6 items-start mb-10">
                    {/* Left: Title + Subtitle + Button */}
                    <div className="space-y-5">
                        <div>
                            <h1 className="text-5xl sm:text-6xl font-black leading-[1.02] tracking-tight bg-gradient-to-r from-[#5a3a1a] via-[#7b5230] to-[#a47445] bg-clip-text text-transparent">
                                {name}
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-700 mt-3">
                                {heroSubtitle}
                            </p>
                        </div>

                        {/* HazardHunter Button (below title/subtitle) */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {isAccessible ? (
                                <Button
                                    as={Link}
                                    href={firstUrl}
                                    className={`h-12 px-6 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 ${PRIMARY_BTN}`}
                                    endContent={
                                        <ArrowRight className="w-5 h-5" />
                                    }
                                >
                                    {buttonLabel || routeName}
                                </Button>
                            ) : (
                                <Button
                                    as={Link}
                                    href={firstUrl}
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
                                        ).style.backgroundColor = PRIMARY_HOVER;
                                    }}
                                    onMouseLeave={(e) => {
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.backgroundColor = PRIMARY;
                                    }}
                                >
                                    {buttonLabel || routeName}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Right: Logo */}
                    <div className="flex lg:justify-end">
                        <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]">
                            <Image
                                src={imageUrl || '/placeholder.svg'}
                                alt={`${name} logo`}
                                width={900}
                                height={700}
                                className="object-contain max-h-[480px] w-auto h-auto"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* BODY (About left, Image card right) */}
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* LEFT (2 cols): About Card */}
                    <div className="lg:col-span-3">
                        <div
                            className="bg-[linear-gradient(to_bottom,rgba(255,255,255,0.7),rgba(232,215,194,0.4))] backdrop-blur-sm rounded-2xl
                border border-white/80
                shadow-[0_0_0_1.5px_rgba(255,255,255,0.9),0_18px_40px_rgba(0,0,0,0.15)]
                p-6"
                        >
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

                            <div className="space-y-4">
                                <p className="text-slate-700 text-base sm:text-lg leading-relaxed text-justify">
                                    {description}
                                </p>

                                {/* Optional subdescription box (like your screenshot quote area) */}
                                {subdescription ? (
                                    <div
                                        className="border-l-4 rounded-r-xl p-4"
                                        style={{
                                            borderColor: '#d6b48c',
                                            background:
                                                'linear-gradient(to right, rgba(255,255,255,0.6), transparent)',
                                        }}
                                    >
                                        <p className="text-slate-700 leading-relaxed text-justify">
                                            {subdescription}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT (1 col): Image Card */}
                    <div
                        className="
            lg:col-span-2
            bg-[linear-gradient(to_bottom,rgba(255,255,255,0.7),rgba(232,215,194,0.4))]
            backdrop-blur-sm rounded-2xl
            border border-white/80
            shadow-[0_0_0_1.5px_rgba(255,255,255,0.9),0_18px_40px_rgba(0,0,0,0.15)]
            p-5
          "
                    >
                        <div className="relative w-[98%] mx-auto rounded-xl overflow-hidden bg-white/60">
                            <Image
                                src={previewImageUrl || '/hazardhunter1.png'}
                                alt={`${name} image`}
                                width={1200}
                                height={800}
                                className="w-full h-auto object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HazardHunterOverview;
