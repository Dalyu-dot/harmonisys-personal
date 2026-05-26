// app/api/notifications/[id]/route.ts
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// ── PATCH /api/notifications/:id ──────────────────────────────────────────────
// Marks a single notification as read (ownership-checked).
export async function PATCH(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notification = await prisma.notification.findUnique({
        where: { id: params.id },
    });

    if (!notification || notification.userId !== session.user.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = await prisma.notification.update({
        where: { id: params.id },
        data: { read: true },
    });

    return NextResponse.json({ notification: updated });
}

// ── DELETE /api/notifications/:id ─────────────────────────────────────────────
export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notification = await prisma.notification.findUnique({
        where: { id: params.id },
    });

    if (!notification || notification.userId !== session.user.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.notification.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
}