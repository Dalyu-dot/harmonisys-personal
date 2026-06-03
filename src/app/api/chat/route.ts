// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { detectToolKey } from '@/lib/ai/knowledgeBase';
import { buildSystemPrompt } from '@/lib/ai/systemPrompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
    message?: string;
    pathname?: string;
    history?: { role: 'user' | 'assistant'; content: string }[];
};

function pageContext(pathname?: string) {
    const p = (pathname || '/').toLowerCase();
    if (
        p.startsWith('/irs') ||
        p.startsWith('/overview/irs') ||
        p.includes('/irs')
    ) {
        return 'User is currently on IRS pages.';
    }
    if (
        p.startsWith('/unahon') ||
        p.startsWith('/overview/unahon') ||
        p.includes('/unahon')
    ) {
        return 'User is currently on Unahon pages.';
    }
    if (
        p.startsWith('/misalud') ||
        p.startsWith('/overview/misalud') ||
        p.includes('/misalud')
    ) {
        return 'User is currently on MiSalud pages.';
    }
    if (
        p.startsWith('/hazardhunter') ||
        p.startsWith('/overview/hazardhunter') ||
        p.includes('/hazardhunter')
    ) {
        return 'User is currently on HazardHunter pages.';
    }
    if (
        p.startsWith('/redas') ||
        p.startsWith('/overview/redas') ||
        p.includes('/redas')
    ) {
        return 'User is currently on REDAS pages.';
    }
    return 'User is on general Harmonisys pages.';
}

// Cleans model output so it looks good in your UI
function cleanAssistantText(text: string) {
    let t = (text || '').toString();

    // Convert **text** -> "text"
    t = t.replace(/\*\*(.*?)\*\*/g, '"$1"');

    // Convert Next.js dynamic route params [param] -> <param>
    // Example: /misalud/team/[teamName] -> /misalud/team/<teamName>
    t = t.replace(/\[([^\]]+)\]/g, '<$1>');

    // Optional nicety: make <teamName> look more human
    t = t.replace(/<teamName>/g, '<team-name>');
    t = t
        .replace(/\/overview\/irs\b/gi, 'IRS Page')
        .replace(/\/irs\b/gi, 'IRS Page')
        .replace(/\/overview\/unahon\b/gi, 'Unahon Page')
        .replace(/\/unahon\b/gi, 'Unahon Dashboard')
        .replace(/\/overview\/misalud\b/gi, 'Mi Salud Page')
        .replace(/\/misalud\/team\/<team-name>\b/gi, 'Mi Salud Dashboard>')
        .replace(/\/misalud\b/gi, 'Mi Salud Dashboard')
        .replace(/\/overview\/hazardhunter\b/gi, 'HazardHunter Page')
        .replace(/\/hazardhunter\b/gi, 'HazardHunter Dashboard')
        .replace(/\/overview\/redas\b/gi, 'REDAS Page')
        .replace(/\/redas\b/gi, 'REDAS Dashboard');

    // Remove common markdown artifacts
    t = t
        .replace(/#{1,6}\s?/g, '') // headers like ### Title
        .replace(/__+/g, '') // underline
        .replace(/`+/g, '') // backticks / code fences
        .replace(/^- /gm, '') // dash bullets
        .trim();

    // Reduce excessive blank lines (keep max 2)
    t = t.replace(/\n{3,}/g, '\n\n');

    return t;
}

async function aiReply(params: {
    message: string;
    pathname?: string;
    history?: { role: 'user' | 'assistant'; content: string }[];
}) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        return 'AI service is not configured. Please set OPENROUTER_API_KEY.';
    }

    const detectedTool = detectToolKey(params.message);
    const systemPrompt = buildSystemPrompt({ activeTool: detectedTool });
    const ctx = pageContext(params.pathname);

    const history = Array.isArray(params.history)
        ? params.history.slice(-8)
        : [];

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'system', content: `Page context: ${ctx}` },
        ...history,
        { role: 'user', content: params.message },
    ];

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer':
                process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'Harmonisys DRRM-H Assistant',
        },
        body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
            temperature: 0.2,
            max_tokens: 700,
            messages,
        }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        console.error('OpenRouter error:', data);
        return 'The AI service is temporarily unavailable. Please try again.';
    }

    const raw =
        data?.choices?.[0]?.message?.content?.toString() ||
        "I couldn't generate a response. Please try again.";

    const reply = cleanAssistantText(raw);

    return reply || "I couldn't generate a response. Please try again.";
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Body;
        const message = body?.message?.toString() ?? '';
        const pathname = body?.pathname?.toString() ?? '/';
        const history = Array.isArray(body?.history) ? body.history : [];

        if (!message.trim()) {
            return NextResponse.json(
                { error: 'Message is required.' },
                { status: 400 }
            );
        }

        const reply = await aiReply({ message, pathname, history });
        return NextResponse.json({ reply });
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body.' },
            { status: 400 }
        );
    }
}
