import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'ADMIN')
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident)
        return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ data: incident });
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'ADMIN')
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { status, reviewNote } = body as {
        status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
        reviewNote?: string;
    };

    const updated = await prisma.incident.update({
        where: { id },
        data: {
            ...(status ? { status } : {}),
            ...(typeof reviewNote === 'string' ? { reviewNote } : {}),
            reviewedAt: new Date(),
            reviewedBy: session.user.email || session.user.id,
        },
    });

    return NextResponse.json({ data: updated });
}
