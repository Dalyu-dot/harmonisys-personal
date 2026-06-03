// src/lib/ai/knowledgeBase.ts

export type ToolKey = 'irs' | 'redas' | 'unahon' | 'misalud' | 'hazardhunter';

export type FAQItem = {
    question: string;
    answer: string | { title?: string; points?: string[] }[];
    imageUrl?: string;
};

export type ToolKB = {
    key: ToolKey;
    name: string;
    subheading?: string;
    description: string;
    subdescription?: string;

    // What the tool is used for (operational)
    purpose: string[];

    // Who it’s for (not access control; just “intended users”)
    intendedUsers: string[];

    // Main routes in your Next.js app
    routes: string[];

    // Common user intents/questions (helps the model answer better)
    commonIntents: string[];

    // Optional FAQs
    faq?: FAQItem[];
};

export const APP_PROFILE = {
    name: 'Harmonisys (Project Sakuna)',
    summary:
        'A modular web-based platform for Disaster Risk Reduction and Management (DRRM) in the Philippines, integrating incident reporting, responder wellness monitoring, hazard assessment/mapping, and other DRRM-H tools.',
    audience: [
        'Emergency response teams',
        'Health professionals',
        'Disaster management agencies',
        'Local government units (LGUs)',
    ],
    modules: ['IRS', 'Mi Salud', 'REDAS', 'Unahon', 'HazardHunter'] as const,
    scopeRules: [
        'Stay within Harmonisys + DRRM support scope.',
        'If a user asks about something outside scope, gently redirect to what you can help with inside Harmonisys.',
        'Do not invent features that aren’t described in this knowledge base.',
        'If the user’s question is missing key details, ask ONE clarifying question, then proceed.',
    ],
    responseStyle: [
        'Be concise and actionable.',
        'Use headings and short bullet points when helpful.',
        'Prefer step-by-step instructions for “how do I…” questions.',
    ],
};

export const TOOLS: Record<ToolKey, ToolKB> = {
    irs: {
        key: 'irs',
        name: 'Incident Reporting System (IRS)',
        subheading:
            'Cloud-based Disaster Recovery Planning and Decision Support Tool',
        description:
            'Automates the reporting process during emergency drills by generating summaries, comparing data over time, and assisting users in real-time documentation. Used to improve emergency response team skills and adherence to protocol.',
        subdescription:
            'Developed under the DRRM in Health Center (NICER program) of UP Manila, headed by Dr. Carlos Primero D. Gundran.',
        purpose: [
            'Document emergency drills/incidents',
            'Generate structured summaries for evaluation',
            'Compare drill data over time',
        ],
        intendedUsers: [
            'Emergency Response Teams (ERT)',
            'Disaster management staff',
            'Supervisors evaluating drill performance',
        ],
        routes: ['/irs', '/irs/event/[eventName]', '/overview/irs'],
        commonIntents: [
            'How do I create or submit an incident/event report?',
            'How do I view event details and summaries?',
            'How do I compare drill results over time?',
            'What data should I prepare before reporting?',
            'Troubleshooting: why can’t I find an event?',
        ],
    },

    redas: {
        key: 'redas',
        name: 'REDAS',
        subheading:
            'Integrated Tool for Earthquake and Hydrometeorological Hazard Analysis',
        description:
            'Rapid Earthquake Damage Assessment System (REDAS) provides near real-time estimates of impacts of earthquakes and other hazards (flood, wind, tsunami, lahars) to support preparedness and decision-making.',
        subdescription: 'Developed by PHIVOLCS (DOST) initially in 2002–2004.',
        purpose: [
            'Hazard monitoring (earthquake/tsunami/rain)',
            'Seismic Hazard Assessment (SHA) and simulations',
            'Multi-hazard impact assessment',
            'Support training + preparedness planning',
        ],
        intendedUsers: [
            'LGU operations centers',
            'DRRM officers',
            'Responders',
            'Planners/researchers',
        ],
        routes: ['/redas', '/redas/gis', '/overview/redas'],
        commonIntents: [
            'What is REDAS and what can it do?',
            'What are training requirements and schedule?',
            'What modules are covered in Basic vs Advanced?',
            'What hazards does REDAS cover?',
        ],
        faq: [
            {
                question: 'What is REDAS?',
                answer: 'REDAS is a PHIVOLCS-developed software tool package for earthquake/tsunami/rain monitoring, database development, hazard simulation, and multi-hazard impact assessment.',
                imageUrl: 'redas/REDAS_logo_name.png',
            },
            {
                question: 'What are the capabilities of REDAS?',
                answer: 'Real-time earthquake/tsunami/rain monitoring; SHA simulations (ground shaking, liquefaction, earthquake-induced landslides) minutes after an event; impact estimates (damage/fatalities/economic losses). Tools include SHAKE (Earthquake), FLoAT (Floods), SWIFT (Severe Wind), QLIST (Lahars), CropDAT (Agriculture).',
            },
            {
                question: 'How is REDAS distributed?',
                answer: 'Distributed through trainings free of charge (since 2006) to LGUs, private sector, academia, NGOs for land use planning, emergency preparedness, and DRRM mainstreaming.',
            },
            {
                question: 'How to avail REDAS and request training?',
                answer: 'Send a letter of request to the Director of DOST-PHIVOLCS (Teresito C. Bacolcol) via redas@phivolcs.dost.gov.ph and leyobautista@yahoo.com',
                imageUrl: 'redas/REDAS_Request_Flowchart.png',
            },
            {
                question: 'How many days is the training?',
                answer: 'Basic REDAS: typically 5-day training covering core tools. Advanced REDAS: separate program focusing on specialized modules.',
            },
        ],
    },

    unahon: {
        key: 'unahon',
        name: 'Unahon',
        subheading:
            'Digital Guide for IDP Behavior/Environmental Interventions and Resource Allocation',
        description:
            'A quick mental health screening tool designed for non-mental health professionals to help camp management prioritize and allocate resources/services for IDPs showing signs of distress after disasters.',
        subdescription:
            'Developed under NICER program (UP Manila), led by Dr. Anna Cristina A. Tuazon.',
        purpose: [
            'Rapid mental health screening',
            'Help prioritize support for distressed IDPs',
            'Support resource/service allocation decisions',
        ],
        intendedUsers: [
            'Camp management teams',
            'Non-mental health responders',
            'Humanitarian/disaster support staff',
        ],
        routes: ['/unahon', '/unahon/form', '/overview/unahon'],
        commonIntents: [
            'How do I fill out the Unahon screening form?',
            'What do the results mean?',
            'How do we prioritize support/resources using Unahon?',
            'What should we do if someone seems at risk?',
            'What info should we collect before screening?',
        ],
    },

    misalud: {
        key: 'misalud',
        name: 'Mi Salud',
        subheading:
            'Responder Fitness Monitoring and Stress Management Mobile App',
        description:
            'Monitors responders’ mental, emotional, and physical conditions before/during/after responses. Provides stress management recommendations based on screening answers.',
        subdescription:
            'A collaborative study across UP Manila, UP Diliman, WMSU, ZPPSU; funded under CHED DARETO project.',
        purpose: [
            'Track responder wellness over time',
            'Screen mental/emotional/physical conditions',
            'Provide stress management recommendations',
        ],
        intendedUsers: [
            'Disaster responders',
            'Responder team leaders',
            'Health/wellness support staff',
        ],
        routes: ['/misalud', '/misalud/team/[teamName]', '/overview/misalud'],
        commonIntents: [
            'How do I submit a wellness screening?',
            'How do I view team wellness stats?',
            'How do recommendations work?',
            'Troubleshooting: why don’t I see my team data?',
        ],
    },

    hazardhunter: {
        key: 'hazardhunter',
        name: 'HazardHunter',
        subheading:
            'Rapid Multi-Hazard Assessment Tool for Any Location in the Philippines',
        description:
            'Provides rapid hazard assessments for any location in the Philippines to determine exposure to hazards like earthquakes, volcanic eruptions, floods, rain-induced landslides, storm surges, and severe winds.',
        subdescription:
            'Product of GeoRisk Philippines led by PHIVOLCS with partner agencies.',
        purpose: [
            'Quick hazard screening for a location',
            'Support preparedness and land-use planning',
            'Inform DRRM decision-making',
        ],
        intendedUsers: [
            'LGUs',
            'Communities and organizations',
            'Planners and DRRM officers',
            'Individuals checking hazard exposure',
        ],
        routes: ['/hazardhunter', '/overview/hazardhunter'],
        commonIntents: [
            'How do I run a hazard check for an address/location?',
            'What hazards does HazardHunter cover?',
            'How should we interpret results for planning?',
            'What to do next after seeing a hazard risk?',
        ],
    },
};

/**
 * Lightweight tool detection (guide-only).
 * Used to route answers to the right module knowledge.
 */
export function detectToolKey(text: string): ToolKey | null {
    const t = text.toLowerCase();

    const rules: Array<[ToolKey, RegExp[]]> = [
        ['irs', [/(\birs\b|incident reporting|incident report|drill report)/i]],
        [
            'redas',
            [
                /(\bredas\b|earthquake damage assessment|phivolcs|sha\b|shake\b|float\b|swift\b|qlist\b|cropdat\b)/i,
            ],
        ],
        [
            'unahon',
            [
                /(\bunahon\b|idp|displaced persons|mental health screening|distress screening)/i,
            ],
        ],
        [
            'misalud',
            [
                /(\bmi\s*salud\b|misalud|responder wellness|stress management|fitness monitoring)/i,
            ],
        ],
        [
            'hazardhunter',
            [/(\bhazardhunter\b|hazard hunter|hazard assessment|georisk)/i],
        ],
    ];

    for (const [key, patterns] of rules) {
        if (patterns.some((p) => p.test(t))) return key;
    }
    return null;
}
