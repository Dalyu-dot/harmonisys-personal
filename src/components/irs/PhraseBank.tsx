'use client';

import { useState } from 'react';

const PHRASES: Record<string, { label: string; phrase: string }[]> = {
    'What happened': [
        {
            label: 'Initial discovery',
            phrase: 'The incident was first observed at approximately [TIME] when [WHO] noticed [WHAT].',
        },
        {
            label: 'Equipment involved',
            phrase: 'The malfunction originated in [EQUIPMENT/SYSTEM], which was operating under [CONDITIONS] at the time.',
        },
        {
            label: 'Hazard encountered',
            phrase: 'A safety hazard was identified involving [DESCRIBE HAZARD], posing risk to personnel in the [AREA] vicinity.',
        },
        {
            label: 'Near miss',
            phrase: 'A near-miss event occurred when [DESCRIBE], narrowly avoiding [POTENTIAL OUTCOME].',
        },
        {
            label: 'Spill / release',
            phrase: 'An uncontrolled release of [SUBSTANCE] occurred from [SOURCE], affecting an estimated area of [SIZE/SCOPE].',
        },
    ],
    Cause: [
        {
            label: 'Equipment failure',
            phrase: 'Preliminary assessment suggests the cause was a mechanical failure in [COMPONENT] due to [REASON].',
        },
        {
            label: 'Human factor',
            phrase: 'The incident appears to have been contributed to by [HUMAN FACTOR], specifically [DESCRIBE].',
        },
        {
            label: 'Environmental',
            phrase: 'External environmental conditions including [WEATHER/CONDITION] are believed to have contributed to the incident.',
        },
        {
            label: 'Unknown cause',
            phrase: 'The root cause has not yet been determined. Investigation is ongoing to identify contributing factors.',
        },
    ],
    Response: [
        {
            label: 'Immediate action',
            phrase: 'Immediate containment measures were implemented, including [ACTIONS TAKEN] within [TIMEFRAME] of discovery.',
        },
        {
            label: 'Evacuation',
            phrase: 'The affected area was evacuated and cordoned off. Approximately [NUMBER] personnel were relocated to [SAFE AREA].',
        },
        {
            label: 'Authorities notified',
            phrase: 'Relevant authorities were notified at [TIME], including [AGENCIES/TEAMS].',
        },
        {
            label: 'Equipment shut down',
            phrase: 'Affected equipment was immediately shut down and locked out pending inspection and repair.',
        },
    ],
    Outcome: [
        {
            label: 'Injuries',
            phrase: 'As a result of the incident, [NUMBER] personnel sustained [TYPE OF INJURY] and were [TREATED/TRANSPORTED].',
        },
        {
            label: 'No injuries',
            phrase: 'No personnel injuries were reported as a result of this incident.',
        },
        {
            label: 'Property damage',
            phrase: 'Estimated property damage includes [DESCRIBE DAMAGE], with preliminary cost assessed at approximately [AMOUNT].',
        },
        {
            label: 'Operations impact',
            phrase: 'Operations in the affected area were suspended for [DURATION] to allow for [CLEANUP/REPAIR/INVESTIGATION].',
        },
    ],
};

type Props = {
    onInsert: (phrase: string) => void;
};

export const PhraseBank = ({ onInsert }: Props) => {
    const categories = Object.keys(PHRASES);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(categories[0]);
    const [flash, setFlash] = useState(false);

    const handleInsert = (phrase: string) => {
        onInsert(phrase);
        setFlash(true);
        setTimeout(() => setFlash(false), 1500);
    };

    return (
        <div className="mt-2">
            {/* Toggle row */}
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-[#7B122F] hover:opacity-75 transition-opacity mb-1"
            >
                <span
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                >
                    ▶
                </span>
                Quick phrases
                {flash && !isOpen && (
                    <span className="ml-1 text-slate-400">✓ inserted</span>
                )}
            </button>

            {/* Expandable panel */}
            {isOpen && (
                <div className="rounded-xl border border-[#7B122F]/15 bg-[#7B122F]/[0.03] p-3">
                    {/* Tabs */}
                    <div className="flex gap-1.5 flex-wrap mb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveTab(cat)}
                                className={`px-2.5 py-0.5 text-[11px] rounded-full border transition-all duration-150 ${
                                    activeTab === cat
                                        ? 'bg-[#7B122F] text-white border-[#7B122F]'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-[#7B122F]/40'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                        {flash && (
                            <span className="ml-auto text-[10px] text-[#7B122F] self-center animate-pulse">
                                ✓ inserted
                            </span>
                        )}
                    </div>

                    {/* Phrase chips — horizontal wrapping pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {PHRASES[activeTab].map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => handleInsert(item.phrase)}
                                className="px-2.5 py-1 text-[11px] rounded-lg border border-white bg-white text-slate-600 hover:border-[#7B122F]/30 hover:text-[#7B122F] hover:bg-[#7B122F]/[0.04] transition-all duration-150"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
