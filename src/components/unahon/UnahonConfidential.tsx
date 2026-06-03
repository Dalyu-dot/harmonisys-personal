'use client';

import {
    Input,
    RadioGroup,
    Radio,
    DatePicker,
    cn,
    Card,
    CardBody,
    CardHeader,
} from '@heroui/react';
import { parseAbsoluteToLocal, toCalendarDate } from '@internationalized/date';
import { AssessmentType } from '@prisma/client';
import type { UnahonConfidentialProps } from '@/types';

const UnahonConfidential: React.FC<UnahonConfidentialProps> = ({
    confidentialForm,
    handleConfidentialFormChange,
    isViewOnly,
    isReassessment,
}) => {
    const assessmentTypeValue = isReassessment
        ? AssessmentType.RE_ASSESSMENT
        : isViewOnly
          ? confidentialForm.assessmentType
          : AssessmentType.INITIAL_ASSESSMENT;

    const assessmentDateValue =
        confidentialForm.date instanceof Date
            ? toCalendarDate(
                  parseAbsoluteToLocal(confidentialForm.date.toISOString())
              )
            : toCalendarDate(
                  parseAbsoluteToLocal(
                      new Date(confidentialForm.date).toISOString()
                  )
              );

    return (
        <div className="bg-gradient-to-br from-red-50 via-red-100/50 to-red-50 border-2 border-red-300 border-dashed shadow-xl rounded-2xl">
            <CardHeader className="text-center pb-4">
                <div className="w-full">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent tracking-widest">
                            CONFIDENTIAL
                        </h1>
                        <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <svg
                            className="w-5 h-5 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        <p className="text-red-600 font-semibold">
                            Restricted Access Document
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="p-8">
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:gap-8 items-start gap-6">
                        <Card className="flex-1 bg-white/70 backdrop-blur-sm shadow-md border border-slate-200">
                            <CardBody className="p-4">
                                <label
                                    htmlFor="client"
                                    className="text-slate-700 font-semibold mb-2 block"
                                >
                                    Patient ID:
                                </label>

                                <select
                                    id="client"
                                    value={confidentialForm.client || ''}
                                    disabled={isViewOnly}
                                    onChange={(event) =>
                                        handleConfidentialFormChange(
                                            'client',
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-red-400"
                                >
                                    <option value="" disabled>
                                        Select generated patient ID
                                    </option>

                                    {confidentialForm.client && (
                                        <option
                                            value={confidentialForm.client}
                                            hidden
                                        >
                                            {confidentialForm.client}
                                        </option>
                                    )}

                                    {(
                                        confidentialForm.availablePatientIds ||
                                        []
                                    ).map((code) => (
                                        <option key={code} value={code}>
                                            {code}
                                        </option>
                                    ))}
                                </select>
                            </CardBody>
                        </Card>

                        <Card className="bg-white/70 backdrop-blur-sm shadow-md border border-slate-200">
                            <CardBody className="p-4">
                                <label className="text-slate-700 font-semibold mb-3 block">
                                    Assessment Type:
                                </label>
                                <RadioGroup
                                    isDisabled
                                    orientation="horizontal"
                                    value={assessmentTypeValue}
                                    classNames={{
                                        wrapper: cn('gap-6'),
                                        base: 'flex-row',
                                    }}
                                >
                                    <Radio
                                        value={
                                            AssessmentType.INITIAL_ASSESSMENT
                                        }
                                        classNames={{
                                            base: 'flex items-center gap-2',
                                            wrapper:
                                                'before:border-emerald-300 after:bg-emerald-500',
                                        }}
                                    >
                                        <span className="font-medium">
                                            Initial Assessment
                                        </span>
                                    </Radio>

                                    <Radio
                                        value={AssessmentType.RE_ASSESSMENT}
                                        classNames={{
                                            base: 'flex items-center gap-2',
                                            wrapper:
                                                'before:border-blue-300 after:bg-blue-500',
                                        }}
                                    >
                                        <span className="font-medium">
                                            Re-assessment
                                        </span>
                                    </Radio>
                                </RadioGroup>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="bg-white/70 backdrop-blur-sm shadow-md border border-slate-200">
                            <CardBody className="p-4">
                                <label
                                    htmlFor="location"
                                    className="text-slate-700 font-semibold mb-2 block"
                                >
                                    Location:
                                </label>
                                <Input
                                    id="location"
                                    value={confidentialForm.location || ''}
                                    isDisabled
                                    variant="bordered"
                                    className="font-medium"
                                    classNames={{
                                        input: 'text-gray-900',
                                        label: 'text-gray-700 font-medium',
                                    }}
                                />
                            </CardBody>
                        </Card>

                        <Card className="bg-white/70 backdrop-blur-sm shadow-md border border-slate-200">
                            <CardBody className="p-4">
                                <label
                                    htmlFor="date"
                                    className="text-slate-700 font-semibold mb-2 block"
                                >
                                    Assessment Date:
                                </label>
                                <DatePicker
                                    id="date"
                                    aria-label="Assessment Date"
                                    isDisabled={isViewOnly}
                                    value={assessmentDateValue}
                                    onChange={(date) => {
                                        if (date) {
                                            const jsDate = new Date(
                                                date.year,
                                                date.month - 1,
                                                date.day
                                            );
                                            handleConfidentialFormChange(
                                                'date',
                                                jsDate
                                            );
                                        }
                                    }}
                                    variant="bordered"
                                    className="font-medium"
                                    classNames={{
                                        input: 'text-gray-900',
                                        label: 'text-gray-700 font-medium',
                                    }}
                                />
                            </CardBody>
                        </Card>
                    </div>

                    <Card className="bg-white/70 backdrop-blur-sm shadow-md border border-slate-200">
                        <CardBody className="p-4">
                            <label
                                htmlFor="affiliation"
                                className="text-slate-700 font-semibold mb-2 block"
                            >
                                Organization / Affiliation:
                            </label>
                            <Input
                                id="affiliation"
                                isDisabled
                                value={
                                    confidentialForm.affiliation ||
                                    'No organization provided'
                                }
                                variant="bordered"
                                className="font-medium"
                                classNames={{
                                    input: 'text-gray-900',
                                    label: 'text-gray-700 font-medium',
                                }}
                            />
                        </CardBody>
                    </Card>
                </div>

                <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 border-dashed">
                    <CardBody className="p-6 text-center">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <svg
                                className="w-6 h-6 text-amber-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                            <h2 className="text-2xl font-bold text-amber-800">
                                RESTRICTED ACCESS
                            </h2>
                        </div>
                        <p className="text-amber-700 font-semibold">
                            ONLY RESPONDERS ARE ALLOWED TO ACCESS THIS DOCUMENT
                        </p>
                    </CardBody>
                </Card>
            </CardBody>
        </div>
    );
};

export default UnahonConfidential;
