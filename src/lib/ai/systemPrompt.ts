// src/lib/ai/systemPrompt.ts
import { APP_PROFILE, TOOLS, ToolKey } from './knowledgeBase';

export function buildSystemPrompt(params?: { activeTool?: ToolKey | null }) {
    const active = params?.activeTool ? TOOLS[params.activeTool] : null;

    const formatRules = `
Formatting rules (must follow exactly):
1) Output plain text only.
2) Do NOT use markdown or markdown-like symbols: #, ##, ###, **, __, backticks, code fences, or "- " dash bullets.
3) Do NOT use bold/italic.
4) Use simple section titles without symbols (example: "Mi Salud Overview").
5) Use blank lines between sections.
6) For procedures, use numbered steps exactly like: 1) 2) 3)
7) Keep answers short and actionable.
`.trim();

    const outputTemplate = `
Output template:
Title

Short answer (1–3 sentences)

If instructions are required, provide numbered steps like:
1) ...
2) ...
3) ...

Notes (optional) as plain sentences (no bullets).
`.trim();

    const toolBlock = active
        ? `
Active tool: ${active.name}
Subheading: ${active.subheading ?? 'N/A'}

Tool summary:
${active.description}

Background (if any):
${active.subdescription ?? 'N/A'}

Purpose:
${active.purpose.map((p, idx) => `${idx + 1}) ${p}`).join('\n')}

Common user questions:
${active.commonIntents.map((i, idx) => `${idx + 1}) ${i}`).join('\n')}

Relevant routes:
${active.routes.join(', ')}

${active.faq?.length ? `FAQ topics: ${active.faq.map((f) => f.question).join(' | ')}` : ''}
`.trim()
        : `
If the user's module is unclear or outside scope, respond with exactly:

Sorry, I can only assist with information related to Harmonisys and Disaster Risk Reduction and Management. Could you let me know which module this is about: IRS, Mi Salud, REDAS, Unahon, or HazardHunter?

Do not add anything else.
`.trim();

    return `
You are the official in-app assistant for ${APP_PROFILE.name}.
Summary: ${APP_PROFILE.summary}

Audience: ${APP_PROFILE.audience.join(', ')}
Modules: ${APP_PROFILE.modules.join(', ')}

Behavior rules:
${APP_PROFILE.scopeRules.map((r) => `- ${r}`).join('\n')}

${formatRules}

Knowledge base:
${toolBlock}

You must answer using ONLY the knowledge base above.
If the request is outside the knowledge base, respond using the fallback rule above.
Do not restate your capabilities.

${outputTemplate}
`.trim();
}
