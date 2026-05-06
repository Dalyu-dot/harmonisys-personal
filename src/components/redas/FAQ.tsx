'use client';

import type React from 'react';
import {
    Accordion,
    AccordionItem,
    Button,
    Card,
    CardBody,
    CardHeader,
} from '@heroui/react';
import { HelpCircle, ChevronUp, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// REDAS Theme Configuration (BLUE)
const redasTheme = {
  background: 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100',
  headerGradient: 'from-blue-900 via-sky-800 to-indigo-900',
  primaryGradient: 'from-blue-600 to-sky-600',
  primaryHoverGradient: 'from-blue-700 to-sky-700',
  secondaryGradient: 'from-sky-600 to-indigo-600',
  tertiaryGradient: 'from-indigo-600 to-cyan-600',
  chipColor: 'bg-blue-100 text-blue-800',
  accentColor: 'border-blue-200',
};

type FAQItem = {
    question: string;
    answer: {
        description:
            | string
            | {
                  title: string;
                  points?: string[];
              }[];
        imageUrl?: string;
    };
};

type FAQProps = {
    data: FAQItem[];
};

const FAQ: React.FC<FAQProps> = ({ data }) => {
    const renderAnswer = (answer: FAQItem['answer']) => {
        return (
            <div className="space-y-4">
                {typeof answer.description === 'string' ? (
                    <p className="text-slate-700 leading-relaxed font-medium">
                        {answer.description}
                    </p>
                ) : (
                    <div className="space-y-4">
                        {answer.description.map((section, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <h4
                                        className={`text-slate-800 text-base ${
                                            section.points ? 'font-semibold' : 'font-normal'
                                        }`}
                                    >
                                        {section.title}
                                    </h4>
                                </div>
                                {section.points && (
                                    <div className="ml-6 space-y-1">
                                        {section.points.map((point, j) => (
                                            <div
                                                key={j}
                                                className="flex items-start gap-2"
                                            >
                                                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    {point}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {answer.imageUrl && (
                    <div className="mt-6 flex justify-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="relative bg-white p-2 rounded-xl shadow-lg">
                                <Image
                                    src={`/${answer.imageUrl}`}
                                    alt="FAQ Illustration"
                                    width={500}
                                    height={500}
                                    className={`rounded-lg ${
                                        answer.imageUrl ===
                                        'redas/REDAS_logo_name.png'
                                            ? 'max-w-[300px] max-h-[300px] object-contain'
                                            : 'max-w-full h-auto'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className={`min-h-screen ${redasTheme.background}`}
        >
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header Section */}
                <Card className="mb-8 bg-white/70 backdrop-blur-sm shadow-lg border border-white/20">
                    <CardHeader className="text-center py-8 justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div
                                className={`p-4 bg-gradient-to-r ${redasTheme.primaryGradient} rounded-2xl shadow-lg`}
                            >
                                <HelpCircle className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-center">
                                <h1
                                    className={`text-4xl lg:text-5xl font-black bg-gradient-to-r ${redasTheme.headerGradient} bg-clip-text text-transparent mb-2`}
                                >
                                    Frequently Asked Questions
                                </h1>
                                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                                    Find answers to common questions about REDAS
                                    and get the help you need
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* FAQ Content */}
                <Card className="bg-white/70 backdrop-blur-sm shadow-lg border border-white/20">
                    <CardBody className="p-6">
                        {data && data.length > 0 ? (
                            <Accordion
                                variant="splitted"
                                selectionMode="multiple"
                                className="space-y-3"
                            >
                                {data.map((item, index) => (
                                    <AccordionItem
                                        key={`faq-${index}-${item.question.slice(0, 20)}`}
                                        aria-label={`FAQ: ${item.question}`}
                                        title={
                                            <div className="flex items-center gap-3 w-full justify-start">
                                                <div
                                                    className={`p-2 bg-gradient-to-r from-blue-100 to-sky-100 rounded-lg flex-shrink-0`}
                                                >
                                                    <HelpCircle className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="leading-relaxed font-semibold text-slate-800 text-left flex-1">
                                                    {item.question}
                                                </span>
                                            </div>
                                        }
                                        indicator={({ isOpen }) => (
                                            <ChevronUp
                                                className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${
                                                    isOpen
                                                        ? 'rotate-90'
                                                        : 'rotate-180'
                                                }`}
                                            />
                                        )}
                                        classNames={{
                                            base: 'bg-gradient-to-r from-white/80 to-slate-50/80 shadow-sm hover:shadow-md transition-all duration-300 border border-blue-200/60',
                                            title: 'flex items-center justify-start',
                                            trigger:
                                                'py-4 px-6 hover:bg-white/60 transition-colors duration-200 flex items-center justify-start',
                                            content: 'px-6 pb-6 pt-2',
                                            indicator: 'text-purple-600',
                                        }}
                                    >
                                        <div className="ml-11">
                                            {renderAnswer(item.answer)}
                                        </div>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="text-center py-12">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-slate-100 rounded-full">
                                        <HelpCircle className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                            No FAQs Available
                                        </h3>
                                        <p className="text-slate-500">
                                            Check back later for frequently
                                            asked questions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/50 shadow-sm">
                        <CardBody className="p-4">
                            <p className="text-black text-sm font-medium">
                                💡 Can&apos;t find what you&apos;re looking for?{' '}
                                <a
                                    href="https://redas.phivolcs.dost.gov.ph/"
                                    className="text-blue-700 underline"
                                >
                                    Contact our REDAS support team
                                </a>{' '}
                                for personalized assistance.
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
