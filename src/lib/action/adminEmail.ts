'use server';

import { AdminActionEmailPayload, sendAdminActionEmail } from "../mail/sendActionEmail";

// lib/action/adminEmail.ts


export async function notifyAdminAction(
    payload: AdminActionEmailPayload
): Promise<void> {
    try {
        await sendAdminActionEmail(payload);
    } catch (err) {
        // Log but never throw — a failed notification must not block the admin action
        console.error('[notifyAdminAction] Failed to send email:', err);
    }
}