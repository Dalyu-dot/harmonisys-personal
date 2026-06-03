import { NextResponse } from 'next/server';

function normalize(s: string) {
    return s.toLowerCase().trim();
}

const FAQ: { keywords: string[]; reply: string }[] = [
    {
        keywords: ['report', 'incident', 'submit', 'irs'],
        reply: 'To report an incident: open **Incident Reporting System**, choose the incident type, fill in location/time, attach photos if available, then submit. If urgent, use **Report Emergency**.',
    },
    {
        keywords: ['hazardhunter', 'hazard', 'guidance', 'risk'],
        reply: '**HazardHunter** helps identify hazards and provides recommended actions based on your selected hazard type and context.',
    },
    {
        keywords: ['redas', 'map', 'mapping', 'exposure'],
        reply: '**REDAS** provides risk/exposure data and mapping tools for planning and assessment.',
    },
    {
        keywords: ['unahon', 'warning', 'monitor', 'forecast'],
        reply: '**Unahon** supports early-warning insights and monitoring information for preparedness and coordination.',
    },
    {
        keywords: ['mi salud', 'misalud', 'health', 'tracking', 'symptoms'],
        reply: '**Mi Salud** supports health indicator tracking and related workflows.',
    },
    {
        keywords: ['contact', 'hotline', 'emergency contacts', 'numbers'],
        reply: 'Emergency contacts are available in the **Quick Resources** panel (or the Contacts page). If you have specific jurisdiction, tell me your area and I’ll point you to the right link in the system.',
    },
];

export async function POST(req: Request) {
    try {
        const { message } = (await req.json()) as { message?: string };

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required.' },
                { status: 400 }
            );
        }

        const msg = normalize(message);

        // keyword match
        for (const item of FAQ) {
            if (item.keywords.some((k) => msg.includes(k))) {
                return NextResponse.json({ reply: item.reply });
            }
        }

        // fallback reply
        return NextResponse.json({
            reply: 'I can help with: incident reporting, HazardHunter, REDAS, Unahan, Mi Salud, resources, and login troubleshooting. What are you trying to do?',
        });
    } catch (e) {
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}
