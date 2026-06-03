'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button, Card, CardBody, Input } from '@heroui/react';
import {
    MessageCircle,
    X,
    Send,
    ShieldCheck,
    AlertTriangle,
} from 'lucide-react';

type ChatMsg = {
    id: string;
    role: 'user' | 'bot';
    text: string;
    ts: number;
};

type ApiHistoryMsg = { role: 'user' | 'assistant'; content: string };

function toApiHistory(msgs: ChatMsg[]): ApiHistoryMsg[] {
    return msgs.slice(-12).map((m) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text,
    }));
}

const QUICK_CHIPS = [
    'How do I report an incident in IRS?',
    'What is Unahon used for?',
    'What is Mi Salud?',
    'What does HazardHunter check?',
];

function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    const theme = (() => {
        const p = (pathname || '/').toLowerCase();

        // default (home / general pages)
        let headerGradient =
            'linear-gradient(135deg, #5B0A0A, #7A1111, #A11B1B)';
        let userBubble = '#951515';
        let accent = '#8B1538';
        let alertBg = 'rgba(139, 21, 56, 0.10)';
        let alertBorder = 'rgba(139, 21, 56, 0.20)';

        // Match both main routes and /overview/* routes (and nested routes)
        const isIRS =
            p.startsWith('/irs') ||
            p.startsWith('/overview/irs') ||
            p.includes('/irs');
        const isUnahon =
            p.startsWith('/unahon') ||
            p.startsWith('/overview/unahon') ||
            p.includes('/unahon');
        const isMiSalud =
            p.startsWith('/misalud') ||
            p.startsWith('/overview/misalud') ||
            p.includes('/misalud');
        const isHazardHunter =
            p.startsWith('/hazardhunter') ||
            p.startsWith('/overview/hazardhunter') ||
            p.includes('/hazardhunter');
        const isREDAS =
            p.startsWith('/redas') ||
            p.startsWith('/overview/redas') ||
            p.includes('/redas');

        if (isIRS) {
            headerGradient =
                'linear-gradient(135deg, #4A0A18, #6B0F25, #8B1538)';
            userBubble = '#6B0F25';
            accent = '#8a002a';
            alertBg = 'rgba(74, 10, 24, 0.08)';
            alertBorder = 'rgba(74, 10, 24, 0.18)';
        } else if (isUnahon) {
            headerGradient =
                'linear-gradient(135deg, #7A0C1E, #991B1B, #B91C1C)';
            userBubble = '#991B1B';
            accent = '#b40000';
            alertBg = 'rgba(185, 28, 28, 0.08)';
            alertBorder = 'rgba(185, 28, 28, 0.18)';
        } else if (isMiSalud) {
            headerGradient =
                'linear-gradient(135deg, #065F46, #047857, #10B981)';
            userBubble = '#047857';
            accent = '#006745';
            alertBg = 'rgba(16, 185, 129, 0.10)';
            alertBorder = 'rgba(16, 185, 129, 0.22)';
        } else if (isHazardHunter) {
            headerGradient =
                'linear-gradient(135deg, #5A3A1A, #7B5A3A, #9D7C5A)';
            userBubble = '#7B5A3A';
            accent = '#62380f';
            alertBg = 'rgba(90, 58, 26, 0.08)';
            alertBorder = 'rgba(90, 58, 26, 0.18)';
        } else if (isREDAS) {
            headerGradient =
                'linear-gradient(135deg, #1E3A8A, #1D4ED8, #0284C7)';
            userBubble = '#1D4ED8';
            accent = '#0074ae';
            alertBg = 'rgba(2, 132, 199, 0.10)';
            alertBorder = 'rgba(2, 132, 199, 0.22)';
        }

        return { headerGradient, userBubble, accent, alertBg, alertBorder };
    })();

    const [messages, setMessages] = useState<ChatMsg[]>(() => [
        {
            id: uid(),
            role: 'bot',
            text:
                'Hello! I’m the Harmonisys DRRM Assistant.\n\n' +
                'I can guide you with:\n' +
                '1) IRS (Incident Reporting)\n' +
                '2) REDAS\n' +
                '3) Unahon\n' +
                '4) Mi Salud\n' +
                '5) HazardHunter\n\n' +
                'What would you like help with?',
            ts: Date.now(),
        },
    ]);

    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!listRef.current) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages, open]);

    async function send(text: string) {
        const trimmed = text.trim();
        if (!trimmed || loading) return;

        const userMsg: ChatMsg = {
            id: uid(),
            role: 'user',
            text: trimmed,
            ts: Date.now(),
        };

        // IMPORTANT: use a local updated array so history is correct (React state updates are async)
        const updatedMessages = [...messages, userMsg];

        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: trimmed,
                    pathname: pathname ?? '/',
                    history: toApiHistory(updatedMessages),
                }),
            });

            let data: any = null;

            try {
                data = await res.json();
            } catch {
                data = {
                    error: `Server returned ${res.status} (invalid response format)`,
                };
            }

            if (!res.ok) {
                const errMsg =
                    data?.error ?? `Request failed with status ${res.status}`;
                setMessages((m) => [
                    ...m,
                    { id: uid(), role: 'bot', text: errMsg, ts: Date.now() },
                ]);
                return;
            }

            const reply =
                data?.reply ??
                data?.error ??
                "Sorry — I couldn't process that. Please try again.";

            const botMsg: ChatMsg = {
                id: uid(),
                role: 'bot',
                text: reply,
                ts: Date.now(),
            };
            setMessages((m) => [...m, botMsg]);
        } catch {
            setMessages((m) => [
                ...m,
                {
                    id: uid(),
                    role: 'bot',
                    text: 'Network error. Please check your connection and try again.',
                    ts: Date.now(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Floating button */}
            <div className="fixed bottom-5 right-5 z-50">
                {!open ? (
                    <Button
                        onPress={() => setOpen(true)}
                        className="
              h-12 w-12 rounded-full
              shadow-[0_4px_12px_rgba(0,0,0,0.35),0_0_10px_rgba(255,255,255,0.45)]
              hover:shadow-[0_6px_18px_rgba(0,0,0,0.45),0_0_14px_rgba(255,255,255,0.6)]
              transition
            "
                        style={{
                            backgroundColor: theme.userBubble,
                            color: 'white',
                        }}
                        isIconOnly
                        aria-label="Open Harmonisys Assistant chat"
                    >
                        <MessageCircle className="h-6 w-6" />
                    </Button>
                ) : null}
            </div>

            {/* Chat window */}
            {open ? (
                <div className="fixed bottom-5 right-5 z-50 w-full max-w-[380px]">
                    <Card className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                        {/* Header */}
                        <div
                            className="px-4 py-3 flex items-center justify-between"
                            style={{
                                background: theme.headerGradient,
                                color: 'white',
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-9 w-9 rounded-2xl bg-white/15 flex items-center justify-center">
                                    <ShieldCheck
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-sm font-extrabold">
                                        DRRM-H Assistant
                                    </p>
                                    <p className="text-[11px] text-white/80">
                                        Guidance • Tools • Resources
                                    </p>
                                </div>
                            </div>

                            <Button
                                onPress={() => setOpen(false)}
                                isIconOnly
                                className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                                aria-label="Close chat"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <CardBody className="p-0">
                            {/* Alert note */}
                            <div
                                className="px-4 py-3 border-b flex gap-2"
                                style={{
                                    background: theme.alertBg,
                                    borderColor: theme.alertBorder,
                                }}
                            >
                                <AlertTriangle
                                    className="h-5 w-5 mt-0.5"
                                    style={{ color: theme.accent }}
                                />
                                <p
                                    className="text-xs leading-relaxed"
                                    style={{ color: theme.accent }}
                                >
                                    For life-threatening emergencies, contact
                                    local emergency services immediately.
                                </p>
                            </div>

                            {/* Messages */}
                            <div
                                ref={listRef}
                                className="h-[330px] overflow-y-auto px-4 py-3 space-y-3 bg-white"
                                aria-label="Chat messages"
                            >
                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                                                m.role === 'user'
                                                    ? 'text-white'
                                                    : 'bg-white text-slate-800 border'
                                            }`}
                                            style={
                                                m.role === 'user'
                                                    ? {
                                                          backgroundColor:
                                                              theme.userBubble,
                                                      }
                                                    : {
                                                          borderColor:
                                                              theme.alertBorder,
                                                          backgroundColor:
                                                              'rgba(255,255,255,0.9)',
                                                      }
                                            }
                                        >
                                            {m.text
                                                .split('\n')
                                                .map((line, idx) => (
                                                    <p
                                                        key={idx}
                                                        className="leading-relaxed"
                                                    >
                                                        {line || (
                                                            <span className="block h-2" />
                                                        )}
                                                    </p>
                                                ))}
                                        </div>
                                    </div>
                                ))}

                                {loading ? (
                                    <div className="text-xs text-slate-500 animate-pulse">
                                        Assistant is analyzing your request…
                                    </div>
                                ) : null}
                            </div>

                            {/* Quick chips */}
                            <div className="px-4 pb-2 pt-0 bg-white">
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_CHIPS.map((q) => (
                                        <button
                                            key={q}
                                            className="text-[11px] px-3 py-1.5 rounded-full border transition"
                                            style={{
                                                borderColor: theme.alertBorder,
                                                backgroundColor: theme.alertBg,
                                                color: theme.accent,
                                            }}
                                            onClick={() => send(q)}
                                            type="button"
                                            disabled={loading}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-slate-200 bg-white">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        send(input);
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Input
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        placeholder="Type your question…"
                                        aria-label="Chat input"
                                        isDisabled={loading}
                                    />
                                    <Button
                                        type="submit"
                                        isIconOnly
                                        aria-label="Send message"
                                        className="rounded-2xl shadow-sm hover:shadow-md transition"
                                        style={{
                                            backgroundColor: theme.accent,
                                            color: 'white',
                                        }}
                                        isDisabled={!input.trim() || loading}
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </form>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            ) : null}
        </>
    );
}
