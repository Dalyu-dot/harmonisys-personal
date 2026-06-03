import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserType } from '@prisma/client';

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(_req: Request, context: RouteContext) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        if (session.user.role !== UserType.ADMIN) {
            return NextResponse.json({ error: 'Admin only' }, { status: 403 });
        }

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: 'Assessment ID is required' },
                { status: 400 }
            );
        }

        const existingAssessment = await prisma.unahon.findUnique({
            where: { id },
        });

        if (!existingAssessment) {
            return NextResponse.json(
                { error: 'Assessment not found' },
                { status: 404 }
            );
        }

        await prisma.unahon.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error('Delete assessment error:', error);

        return NextResponse.json(
            { error: 'Failed to delete assessment' },
            { status: 500 }
        );
    }
}
