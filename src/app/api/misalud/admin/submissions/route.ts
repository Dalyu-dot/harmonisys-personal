import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const submissions = await prisma.submission.findMany({
            include: {
                responses: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const data = submissions.map((submission) => ({
            id: submission.id,
            userId: submission.userId,
            name: submission.name,
            email: submission.user.email,
            team: submission.team,
            assessmentDate: submission.date,
            submittedAt: submission.createdAt,
            totalAnswers: submission.responses.length,
        }));

        return NextResponse.json({ submissions: data });
    } catch (error) {
        console.error('Error fetching Mi Salud admin submissions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
