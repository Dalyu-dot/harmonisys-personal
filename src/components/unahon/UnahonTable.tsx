'use client';

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    useDisclosure,
    Card,
    CardBody,
} from '@heroui/react';
import { columns, unahonSections } from '@/constants/index';
import { useCallback, useMemo, useRef } from 'react';
import type { UnahonTableProps, Row, Column } from '@/types';
import UnahonModal from './UnahonModal';

const bgColorClasses: Record<string, string> = {
    red: 'bg-gradient-to-br from-red-500 to-red-600',
    yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
};

const borderColorClasses: Record<string, string> = {
    red: 'border-red-300',
    yellow: 'border-yellow-300',
    green: 'border-green-300',
};

const sectionBgClasses: Record<string, string> = {
    red: 'from-red-50 to-red-100/50',
    yellow: 'from-yellow-50 to-yellow-100/50',
    green: 'from-green-50 to-green-100/50',
};

const UnahonTable: React.FC<UnahonTableProps> = ({
    index,
    isViewOnly,
    checklist,
    handleChecklistChange,
    competency,
    goToConfidentialPage,
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const currentSection = useMemo(() => unahonSections[index], [index]);
    const interventionsIndices = useRef<number[]>([]);
    const selectedRow = useRef<number>(1);
    const interventionIndex = useRef<number>(0);
    const isLastAssessmentSection = index === unahonSections.length - 1;

    const handleCheckboxChange = useCallback(
        (rowNumber: number, column: number, isSelected: boolean) => {
            handleChecklistChange(rowNumber, column);

            if (column === 0 && isSelected) {
                selectedRow.current = rowNumber;
                onOpen();
            }
        },
        [handleChecklistChange, onOpen]
    );

    const handleModalClose = () => {
        handleChecklistChange(selectedRow.current, 0);
    };

    const isDisagreeSequentiallyEnabled = useCallback(
        (rowNumber: number) => {
            if (isViewOnly) return false;
            if (rowNumber === 1) return true;

            const previousRow = checklist[index]?.[rowNumber - 1];
            return previousRow?.[1] === true;
        },
        [checklist, index, isViewOnly]
    );

    const renderCell = useCallback(
        (row: Row, columnKey: React.Key) => {
            switch (columnKey) {
                case 'empty':
                    if (row.number === 1) {
                        return (
                            <TableCell
                                rowSpan={currentSection.questions.length}
                                className={`${bgColorClasses[currentSection.color]} shadow-lg`}
                            >
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-white font-bold text-lg transform -rotate-90 whitespace-nowrap">
                                        {currentSection.color.toUpperCase()}{' '}
                                        LEVEL
                                    </div>
                                </div>
                            </TableCell>
                        );
                    } else {
                        return (
                            <TableCell className="hidden">
                                <div></div>
                            </TableCell>
                        );
                    }

                case 'description':
                    return (
                        <TableCell className="p-4">
                            <div className="flex flex-row gap-4 items-start">
                                <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-full ${bgColorClasses[currentSection.color]} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                                >
                                    {row.number}
                                </div>
                                <div
                                    className="text-slate-700 leading-relaxed flex-1"
                                    dangerouslySetInnerHTML={{
                                        __html: row.description,
                                    }}
                                />
                            </div>
                        </TableCell>
                    );

                case 'agree':
                    return (
                        <TableCell className="p-4 text-center">
                            <div className="flex justify-center">
                                <Checkbox
                                    isDisabled={isViewOnly}
                                    isSelected={
                                        checklist[index]?.[row.number]?.[0] ??
                                        false
                                    }
                                    onValueChange={(isSelected) =>
                                        handleCheckboxChange(
                                            row.number,
                                            0,
                                            isSelected
                                        )
                                    }
                                    classNames={{
                                        base: 'max-w-none',
                                        wrapper:
                                            'before:border-emerald-300 after:bg-emerald-500 scale-125',
                                    }}
                                />
                            </div>
                        </TableCell>
                    );

                case 'disagree':
                    return (
                        <TableCell className="p-4 text-center">
                            <div className="flex justify-center">
                                <Checkbox
                                    isDisabled={
                                        isViewOnly ||
                                        isLastAssessmentSection ||
                                        (!isDisagreeSequentiallyEnabled(
                                            row.number
                                        ) &&
                                            !(
                                                checklist[index]?.[
                                                    row.number
                                                ]?.[1] ?? false
                                            ))
                                    }
                                    isSelected={
                                        checklist[index]?.[row.number]?.[1] ??
                                        false
                                    }
                                    onValueChange={(isSelected) =>
                                        handleCheckboxChange(
                                            row.number,
                                            1,
                                            isSelected
                                        )
                                    }
                                    classNames={{
                                        base: 'max-w-none',
                                        wrapper:
                                            'before:border-slate-300 after:bg-slate-500 scale-125',
                                    }}
                                />
                            </div>
                        </TableCell>
                    );
                case 'intervention':
                    if (row.span) {
                        interventionIndex.current =
                            (interventionIndex.current %
                                currentSection.interventions.length) +
                            1;

                        const intervention =
                            currentSection.interventions[
                                interventionIndex.current - 1
                            ];

                        const interventionContent = (
                            <Card className="bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200">
                                <CardBody className="p-4">
                                    <ul className="space-y-2">
                                        {intervention.checklist.map(
                                            (item: string, index: number) => (
                                                <li
                                                    key={index}
                                                    className="text-slate-700 leading-relaxed flex items-start gap-2"
                                                >
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: item,
                                                        }}
                                                    />
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </CardBody>
                            </Card>
                        );
                        interventionsIndices.current[row.number - 1] =
                            interventionIndex.current;

                        return (
                            <TableCell rowSpan={row.span} className="p-4">
                                {interventionContent}
                            </TableCell>
                        );
                    } else {
                        interventionsIndices.current[row.number - 1] =
                            interventionIndex.current;

                        return (
                            <TableCell className="hidden">
                                <div></div>
                            </TableCell>
                        );
                    }

                default:
                    return <TableCell>cellValue</TableCell>;
            }
        },
        [checklist, index, isViewOnly, handleCheckboxChange]
    );

    return (
        <div>
            <Card
                className={`mb-6 bg-gradient-to-r ${sectionBgClasses[currentSection.color]} border ${borderColorClasses[currentSection.color]} shadow-lg`}
            >
                <CardBody className="p-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-4 h-4 rounded-full ${bgColorClasses[currentSection.color]} shadow-md`}
                        ></div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {currentSection.color.charAt(0).toUpperCase() +
                                currentSection.color.slice(1)}{' '}
                            Level Assessment
                        </h2>
                        <div
                            className={`px-3 py-1 rounded-full text-xs font-bold text-white ${bgColorClasses[currentSection.color]} shadow-md`}
                        >
                            Section {index + 1}
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm shadow-lg border border-white/20 overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        removeWrapper
                        aria-label={`Unahon ${currentSection.color} Category`}
                        classNames={{
                            table: 'border-collapse',
                            td: `border border-slate-200 bg-white/50`,
                            th: 'bg-gradient-to-r from-slate-100 to-slate-200 text-center text-slate-800 font-bold border border-slate-300',
                        }}
                    >
                        <TableHeader columns={columns}>
                            {(column: Column) => (
                                <TableColumn key={column.key} className="p-4">
                                    <span
                                        className={`text-base font-bold ${column.key === 'intervention' ? 'leading-tight' : ''}`}
                                        dangerouslySetInnerHTML={{
                                            __html: column.label,
                                        }}
                                    />
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody>
                            {currentSection.questions.map((item) => (
                                <TableRow
                                    key={item.number}
                                    className="hover:bg-slate-50/50 transition-colors duration-200"
                                >
                                    {(columnKey: React.Key) => {
                                        return renderCell(item, columnKey);
                                    }}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <UnahonModal
                index={index}
                rowNumber={
                    interventionsIndices.current[selectedRow.current - 1] - 1
                }
                isOpen={isOpen}
                competency={competency}
                onOpenChange={onOpenChange}
                onDone={goToConfidentialPage}
                onCancel={handleModalClose}
            />
        </div>
    );
};

export default UnahonTable;
