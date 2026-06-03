'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { ChevronDown, Link2, ArrowLeft } from 'lucide-react';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from '@heroui/dropdown';
import { Card, CardBody, CardHeader, Input } from '@heroui/react';
import { Button } from '@heroui/react';
import type { PlaceData } from '@/types';
import Image from 'next/image';
import { SocialIcon } from 'react-social-icons';
import { Skeleton } from '@heroui/react';
import Link from 'next/link';
import { REDAS_THEME } from '@/constants';

const REDAS = () => {
    const statCardBase =
        'relative overflow-hidden rounded-3xl border border-white/70 ' +
        'shadow-[0_0_0_1.5px_rgba(255,255,255,0.78),0_16px_40px_rgba(0,0,0,0.16)]';
    const [selectedLabel, setSelectedLabel] = useState('PROVINCES');
    const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const labels = [
        'PROVINCES',
        'CITIES',
        'REDAS Trained National Government Agencies',
        'REDAS Big Batches',
        'REDAS Trained State Universities and Colleges',
        'REDAS Trained Private Companies',
        'REDAS Trained NGOs and Federation',
        'REDAS Trained Philippine Disaster Resilience',
    ];

    const encodeForUrl = (text: string) => {
        return text.replace(/ /g, '+');
    };

    const { data: places = [], isLoading: placesLoading } = useQuery<string[]>({
        queryKey: ['redas-places', selectedLabel],
        queryFn: async () => {
            const response = await fetch(
                `/api/redas?sheetName=Trainings&label=${encodeForUrl(selectedLabel)}`
            );

            const result = await response.json();

            return Array.isArray(result)
                ? result.sort((a: string, b: string) => a.localeCompare(b))
                : [];
        },
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        setSelectedPlace(places[0] || null);
    }, [places]);

    const { data = [], isLoading: dataLoading } = useQuery<PlaceData[]>({
        queryKey: ['redas-training-data', selectedLabel, selectedPlace],
        queryFn: async () => {
            const response = await fetch(
                `/api/redas?sheetName=${encodeForUrl('Trainings')}&label=${encodeForUrl(selectedLabel)}&place=${encodeForUrl(selectedPlace || '')}`
            );

            const result = await response.json();

            return selectedPlace ? result[selectedPlace] || [] : [];
        },
        enabled: !!selectedPlace,
        staleTime: 5 * 60 * 1000,
    });

    const loading = placesLoading || dataLoading;

    function extractFileId(url: string) {
        const match = url.match(/[-\w]{25,}/);
        return match ? match[0] : '';
    }

    // Filter data based on search query
    const filteredData = data.filter((item) => {
        const hasValidArticleLink =
            item.article_link &&
            item.article_link.trim() !== '' &&
            item.article_link !== 'N/A';

        const matchesSearch =
            item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
            selectedPlace?.toLowerCase().includes(searchQuery.toLowerCase());

        return hasValidArticleLink && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* ✅ COMBINED HEADER + CONTROLS (like User Controller) */}
                <Card className="mb-8 bg-white/70 backdrop-blur-sm shadow-lg border border-white/20 overflow-hidden rounded-[28px]">
                    {/* ✅ HERO (top) */}
                    <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-600">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-white drop-shadow-[0_12px_22px_rgba(0,0,0,0.35)] mb-2">
                                        REDAS Dashboard
                                    </h1>
                                    <p className="text-white/85 text-lg">
                                        Explore comprehensive disaster
                                        resilience training programs across the
                                        Philippines
                                    </p>
                                </div>

                                <Button
                                    as={Link}
                                    href="/overview/redas"
                                    variant="light"
                                    startContent={
                                        <ArrowLeft className="w-4 h-4" />
                                    }
                                    className="bg-white/15 text-white border border-white/25 backdrop-blur-sm shadow-sm hover:bg-white/20 transition-all duration-300 font-medium lg:self-center"
                                >
                                    Go Back
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* ✅ CONTROLS (bottom attached) */}
                    <div className="bg-white/85 backdrop-blur-md border-t border-white/30">
                        <CardBody className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                                {/* Dropdowns */}
                                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button
                                                className="font-semibold min-w-[200px]"
                                                color="primary"
                                                variant="flat"
                                                size="lg"
                                                endContent={
                                                    <ChevronDown className="size-4" />
                                                }
                                            >
                                                📊 {selectedLabel}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu className="bg-white/95 backdrop-blur-sm max-h-[300px] overflow-y-auto">
                                            {labels.map((label) => (
                                                <DropdownItem
                                                    key={label}
                                                    onPress={() =>
                                                        setSelectedLabel(label)
                                                    }
                                                    className="hover:bg-slate-100/80"
                                                >
                                                    {label}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>

                                    {!placesLoading && places.length > 0 ? (
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button
                                                    className="font-semibold min-w-[200px]"
                                                    color="secondary"
                                                    variant="flat"
                                                    size="lg"
                                                    endContent={
                                                        <ChevronDown className="size-4" />
                                                    }
                                                >
                                                    📍{' '}
                                                    {selectedPlace ||
                                                        'Select Place'}
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu className="bg-white/95 backdrop-blur-sm max-h-[300px] overflow-y-auto">
                                                {places.map((place) => (
                                                    <DropdownItem
                                                        key={place}
                                                        onPress={() =>
                                                            setSelectedPlace(
                                                                place
                                                            )
                                                        }
                                                        className="hover:bg-slate-100/80"
                                                    >
                                                        {place}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </Dropdown>
                                    ) : (
                                        <Button
                                            isLoading={placesLoading}
                                            className="font-semibold min-w-[200px]"
                                            color="secondary"
                                            variant="flat"
                                            size="lg"
                                        >
                                            {placesLoading
                                                ? 'Loading Places...'
                                                : 'No Places Available'}
                                        </Button>
                                    )}
                                </div>

                                {/* ✅ Search Bar (border like User Controller) */}
                                <div className="w-full lg:w-auto">
                                    <Input
                                        placeholder="Search trainings and locations..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="min-w-[320px]"
                                        classNames={{
                                            input: 'text-slate-700 placeholder:text-slate-500',
                                            inputWrapper:
                                                'bg-white/85 backdrop-blur-sm border-2 border-blue-300/40 shadow-sm ' +
                                                'hover:border-blue-500/40 focus-within:border-blue-600/50 ' +
                                                'focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12)] ' +
                                                'transition-all duration-300 h-12 rounded-2xl',
                                        }}
                                        startContent={
                                            <svg
                                                className="h-5 w-5 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
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
                                                    <svg
                                                        className="h-4 w-4 text-slate-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </Button>
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </div>
                </Card>

                {/* Stats Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                        Training Overview
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Trainings */}
                        <Card
                            className={`${statCardBase} bg-[#eef2fb] border border-[#cfd8ee]`}
                        >
                            <CardBody className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-11 w-11 rounded-2xl bg-[#bcd0ff] flex items-center justify-center shadow-md">
                                        <svg
                                            className="w-6 h-6 text-[#2563eb]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Total Trainings
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Available programs
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    {filteredData.length > 0 ? (
                                        <>
                                            <span className="text-4xl font-bold text-slate-900">
                                                {filteredData.length}
                                            </span>
                                            <span className="text-lg text-slate-500 ml-2">
                                                programs
                                            </span>
                                        </>
                                    ) : (
                                        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                                            <span className="mt-0.5 text-amber-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                    <line
                                                        x1="12"
                                                        y1="9"
                                                        x2="12"
                                                        y2="13"
                                                    />
                                                    <line
                                                        x1="12"
                                                        y1="17"
                                                        x2="12.01"
                                                        y2="17"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="text-sm font-medium text-amber-800">
                                                Kindly contact REDAS to know
                                                their training programs and
                                                schedules.
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 h-2 w-full rounded-full bg-[#dbe7ff] overflow-hidden">
                                    <div className="h-full rounded-full bg-[#3b82f6] w-full" />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Selected Location */}
                        <Card
                            className={`${statCardBase} bg-[#eef8f0] border border-[#cfe8d4]`}
                        >
                            <CardBody className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-11 w-11 rounded-2xl bg-[#bfe8c8] flex items-center justify-center shadow-md">
                                        <svg
                                            className="w-6 h-6 text-[#16a34a]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Selected Location
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            City or area being viewed
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="text-2xl font-bold text-slate-900">
                                        {selectedPlace || 'None Selected'}
                                    </span>
                                </div>
                                <div className="mt-4 h-2 w-full rounded-full bg-[#d9f0de] overflow-hidden">
                                    <div className="h-full rounded-full bg-[#22c55e] w-full" />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Category */}
                        <Card
                            className={`${statCardBase} bg-[#f4edfb] border border-[#dfcff3]`}
                        >
                            <CardBody className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-11 w-11 rounded-2xl bg-[#d9b8f4] flex items-center justify-center shadow-md">
                                        <svg
                                            className="w-6 h-6 text-[#9333ea]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Training Category
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Selected training group
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="text-lg font-bold text-slate-900">
                                        {selectedLabel.replace(
                                            'REDAS Trained ',
                                            ''
                                        )}
                                    </span>
                                </div>
                                <div className="mt-4 h-2 w-full rounded-full bg-[#eadcf8] overflow-hidden">
                                    <div className="h-full rounded-full bg-[#a855f7] w-full" />
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Training Programs Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                        Training Programs
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Card
                                    key={index}
                                    className="bg-white/70 backdrop-blur-sm shadow-lg border border-white/20"
                                >
                                    {/* Image skeleton */}
                                    <Skeleton className="h-48 rounded-t-lg">
                                        <div className="h-48"></div>
                                    </Skeleton>

                                    {/* Header skeleton */}
                                    <div className="p-4 pb-2">
                                        <div className="flex justify-between items-start w-full">
                                            <div className="flex-1">
                                                <Skeleton className="w-32 h-6 rounded-full">
                                                    <div className="h-6"></div>
                                                </Skeleton>
                                            </div>
                                        </div>
                                    </div>

                                    <CardBody className="pt-0 pb-6">
                                        <div className="space-y-4">
                                            {/* Title skeleton */}
                                            <div>
                                                <Skeleton className="w-3/4 h-6 rounded-lg mb-2">
                                                    <div className="h-6"></div>
                                                </Skeleton>
                                                <Skeleton className="w-1/2 h-4 rounded-lg">
                                                    <div className="h-4"></div>
                                                </Skeleton>
                                            </div>

                                            {/* Action buttons skeleton */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="w-10 h-10 rounded-full">
                                                        <div className="h-10"></div>
                                                    </Skeleton>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="w-24 h-8 rounded-lg">
                                                        <div className="h-8"></div>
                                                    </Skeleton>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    ) : filteredData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData.map((item, index) => (
                                <Card
                                    key={index}
                                    className="bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                >
                                    <div className="h-48 w-full relative overflow-hidden">
                                        {/* Blurred background */}
                                        <Image
                                            src={
                                                item.gdrive_link === 'N/A'
                                                    ? '/dostPhivolcs_withtext.png'
                                                    : `https://drive.google.com/uc?export=view&id=${extractFileId(item.gdrive_link)}`
                                            }
                                            alt="REDAS Training background"
                                            fill
                                            className="object-cover blur-xl scale-110 opacity-60"
                                        />

                                        {/* Foreground image (FULL, not cropped) */}
                                        <Image
                                            src={
                                                item.gdrive_link === 'N/A'
                                                    ? '/dostPhivolcs_withtext.png'
                                                    : `https://drive.google.com/uc?export=view&id=${extractFileId(item.gdrive_link)}`
                                            }
                                            alt="REDAS Training"
                                            fill
                                            className="object-contain transition-transform duration-300 hover:scale-105"
                                        />

                                        {/* Optional soft overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                                    </div>

                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start w-full">
                                            <div className="flex-1">
                                                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                                    REDAS | {selectedPlace}
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardBody className="pt-0 pb-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                                    {item.date === 'N.D.'
                                                        ? 'No Date Available'
                                                        : item.date}
                                                </h3>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    {item.fb_link !== 'N/A' && (
                                                        <SocialIcon
                                                            bgColor="#1877f2"
                                                            url={item.fb_link}
                                                            style={{
                                                                height: '2.5rem',
                                                                width: '2.5rem',
                                                            }}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:scale-110 transition-transform duration-200"
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        as={Link}
                                                        href={item.article_link}
                                                        endContent={
                                                            <Link2 className="h-4 w-4" />
                                                        }
                                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        size="sm"
                                                    >
                                                        Visit Article
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-white/70 backdrop-blur-sm shadow-lg border border-white/20 max-w-md mx-auto">
                            <CardBody className="p-12 text-center">
                                <div className="text-6xl mb-6">🔍</div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                    No Training Programs Found
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    No training programs match your current
                                    selection. Try selecting a different
                                    location or category.
                                </p>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default REDAS;
