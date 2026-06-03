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

        const memberships = await prisma.miSaludMembership.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const requests = await prisma.miSaludRequest.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        const latestRequestByUser = new Map<
            string,
            (typeof requests)[number]
        >();

        for (const request of requests) {
            if (!latestRequestByUser.has(request.userId)) {
                latestRequestByUser.set(request.userId, request);
            }
        }

        const data = memberships.map((membership) => {
            const latestRequest = latestRequestByUser.get(membership.userId);

            return {
                id: membership.id,
                userId: membership.userId,
                name: membership.user.name,
                email: membership.user.email,
                teamName: membership.team.name,
                miSaludRole: membership.role,
                membershipStatus: membership.status,
                approvedAt: membership.approvedAt,
                createdAt: membership.createdAt,
                latestRequestStatus: latestRequest?.status || null,
                latestRequestRole: latestRequest?.requestedRole || null,
            };
        });

        return NextResponse.json({ users: data });
    } catch (error) {
        console.error('Error fetching Mi Salud admin users:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
