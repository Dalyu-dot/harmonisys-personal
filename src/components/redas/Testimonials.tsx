'use client';

import {
    Card,
    CardBody,
    CardFooter,
    Divider,
    Button,
    Tabs,
    Tab,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import { Testimonial } from '@/types';

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedTab, setSelectedTab] = useState<'software' | 'training'>(
        'software'
    );
    const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter testimonials by tab
    const testimonials = allTestimonials.filter((t) => t.type === selectedTab);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length
        );
    };

    // Reset index when changing tabs
    useEffect(() => {
        setCurrentIndex(0);
    }, [selectedTab]);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const res = await fetch('/api/redas?sheetName=Testimonials');
                if (!res.ok) throw new Error('Failed to fetch testimonials');
                const data = await res.json();
                const arr = Array.isArray(data)
                    ? data
                    : Array.isArray(data.testimonials)
                      ? data.testimonials
                      : [];
                const mapped = arr.map((item: any) => ({
                    ...item,
                    type:
                        item.type === 'redasSoftware'
                            ? 'software'
                            : item.type === 'redasTraining'
                              ? 'training'
                              : item.type,
                }));
                setAllTestimonials(mapped);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTestimonials();
    }, []);

    if (loading) return <div>Loading testimonials...</div>;
    if (error) return <div>Error: {error}</div>;
    if (testimonials.length === 0) return <div>No testimonials found.</div>;

    return (
        <div className="space-y-4 p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/60 via-sky-50/50 to-slate-50/40 backdrop-blur-sm">
            <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) =>
                    setSelectedTab(key as 'software' | 'training')
                }
                className="w-full"
                variant="underlined"
                classNames={{
                    tabList:
                        'gap-6 w-full relative rounded-none p-0 border-b border-blue-200',
                    cursor: 'w-full bg-gradient-to-r from-blue-600 to-sky-600',
                    tab: 'max-w-fit px-0 h-12',
                    tabContent:
                        'group-data-[selected=true]:text-blue-800 font-semibold',
                }}
            >
                <Tab key="software" title="Software Testimonials">
                    <div className="relative mt-4">
                        <Card className="bg-white/80 backdrop-blur-sm border border-blue-200 shadow-md h-[170px] sm:h-[190px] flex flex-col">
                            <CardBody className="p-6 flex-1 overflow-hidden">
                                <div className="h-full overflow-y-auto pr-2">
                                    <p className="text-slate-700 italic text-base leading-relaxed">
                                        &quot;
                                        {testimonials[currentIndex]?.quote}
                                        &quot;
                                    </p>
                                </div>
                            </CardBody>

                            <Divider className="bg-blue-200" />

                            <CardFooter className="p-4 mt-auto">
                                <p className="text-sm font-semibold text-blue-900">
                                    {testimonials[currentIndex]?.author}
                                </p>
                            </CardFooter>
                        </Card>

                        <div className="flex justify-between items-center mt-6">
                            <Button
                                onPress={prevTestimonial}
                                className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 font-semibold"
                                size="sm"
                            >
                                Previous
                            </Button>

                            <div className="flex items-center gap-2">
                                {testimonials.map((_, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            index === currentIndex
                                                ? 'bg-blue-600 scale-125'
                                                : 'bg-blue-300 hover:bg-blue-400'
                                        }`}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <Button
                                onPress={nextTestimonial}
                                className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 font-semibold"
                                size="sm"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </Tab>

                <Tab key="training" title="Training Testimonials">
                    <div className="relative mt-4">
                        <Card className="bg-white/80 backdrop-blur-sm border border-blue-200 shadow-md h-[170px] sm:h-[190px] flex flex-col">
                            <CardBody className="p-6 flex-1 overflow-hidden">
                                <div className="h-full overflow-y-auto pr-2">
                                    <p className="text-slate-700 italic text-base leading-relaxed">
                                        &quot;
                                        {testimonials[currentIndex]?.quote}
                                        &quot;
                                    </p>
                                </div>
                            </CardBody>

                            <Divider className="bg-blue-200" />

                            <CardFooter className="p-4 mt-auto">
                                <p className="text-sm font-semibold text-blue-900">
                                    {testimonials[currentIndex]?.author}
                                </p>
                            </CardFooter>
                        </Card>

                        <div className="flex justify-between items-center mt-6">
                            <Button
                                onPress={prevTestimonial}
                                className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 font-semibold"
                                size="sm"
                            >
                                Previous
                            </Button>

                            <div className="flex items-center gap-2">
                                {testimonials.map((_, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            index === currentIndex
                                                ? 'bg-blue-600 scale-125'
                                                : 'bg-blue-300 hover:bg-blue-400'
                                        }`}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <Button
                                onPress={nextTestimonial}
                                className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 font-semibold"
                                size="sm"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};

export default Testimonials;
