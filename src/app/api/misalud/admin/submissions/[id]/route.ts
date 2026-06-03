import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(_: Request, context: RouteContext) {
    try {
        const session = await auth();

        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await context.params;

        const submission = await prisma.submission.findUnique({
            where: { id },
            include: {
                responses: {
                    orderBy: {
                        questionId: 'asc',
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!submission) {
            return NextResponse.json(
                { error: 'Submission not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ submission });
    } catch (error) {
        console.error('Error fetching Mi Salud submission details:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(_: Request, context: RouteContext) {
    try {
        const session = await auth();

        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await context.params;

        const existing = await prisma.submission.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: 'Submission not found' },
                { status: 404 }
            );
        }

        await prisma.$transaction([
            prisma.questionResponse.deleteMany({
                where: {
                    submissionId: id,
                },
            }),

            prisma.submission.delete({
                where: {
                    id,
                },
            }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting Mi Salud submission:', error);

        return NextResponse.json(
            { error: 'Failed to delete submission' },
            { status: 500 }
        );
    }
}
