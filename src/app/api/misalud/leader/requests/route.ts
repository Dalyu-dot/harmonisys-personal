import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const leaderMembership = await prisma.miSaludMembership.findFirst({
            where: {
                userId: session.user.id,
                role: 'TEAM_LEADER',
                status: 'APPROVED',
            },
            include: {
                team: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        if (!leaderMembership) {
            return NextResponse.json(
                {
                    error: 'Only approved Team Leaders can access these requests',
                },
                { status: 403 }
            );
        }

        const requests = await prisma.miSaludRequest.findMany({
            where: {
                requestedRole: 'TEAM_MEMBER',
                reviewLevel: 'TEAM_LEADER',
                status: 'PENDING',
                teamId: leaderMembership.teamId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({
            team: {
                id: leaderMembership.team.id,
                name: leaderMembership.team.name,
            },
            requests,
        });
    } catch (error) {
        console.error('Error fetching Team Leader MiSalud requests:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
