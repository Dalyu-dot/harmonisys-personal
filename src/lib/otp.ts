/**
 * Server-side OTP store.
 * Uses a module-level Map so it survives across requests in the same process.
 * For multi-instance deployments, swap this for Redis / Upstash.
 */

interface OtpEntry {
    code: string;
    expiresAt: number; // unix ms
    attempts: number;
}

// Global singleton store (survives hot-reloads in Next.js dev via globalThis)
const g = globalThis as typeof globalThis & {
    __otpStore?: Map<string, OtpEntry>;
};
if (!g.__otpStore) g.__otpStore = new Map();
const store = g.__otpStore;

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

/** Generate a 6-digit OTP and store it keyed by email. */
export function generateOtp(email: string): string {
    const code = Math.floor(100_000 + Math.random() * 900_000).toString();
    store.set(email.toLowerCase(), {
        code,
        expiresAt: Date.now() + OTP_TTL_MS,
        attempts: 0,
    });
    return code;
}

export type VerifyResult =
    | { ok: true }
    | { ok: false; reason: 'expired' | 'invalid' | 'max_attempts' };

/** Verify the OTP for the given email. Deletes the entry on success. */
export function verifyOtp(email: string, code: string): VerifyResult {
    const entry = store.get(email.toLowerCase());

    if (!entry || Date.now() > entry.expiresAt) {
        store.delete(email.toLowerCase());
        return { ok: false, reason: 'expired' };
    }

    if (entry.attempts >= MAX_ATTEMPTS) {
        store.delete(email.toLowerCase());
        return { ok: false, reason: 'max_attempts' };
    }

    if (entry.code !== code.trim()) {
        entry.attempts += 1;
        return { ok: false, reason: 'invalid' };
    }

    store.delete(email.toLowerCase());
    return { ok: true };
}

/** Remove an OTP entry (e.g. user cancelled). */
export function deleteOtp(email: string) {
    store.delete(email.toLowerCase());
}
