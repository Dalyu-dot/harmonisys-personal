import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const session = await auth();

        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const body = await request.json();
        const { action, rejectionReason } = body as {
            action?: 'APPROVE' | 'REJECT';
            rejectionReason?: string;
        };

        if (!action || !['APPROVE', 'REJECT'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action' },
                { status: 400 }
            );
        }

        const existingRequest = await prisma.miSaludRequest.findUnique({
            where: { id },
        });

        if (!existingRequest) {
            return NextResponse.json(
                { error: 'Request not found' },
                { status: 404 }
            );
        }

        if (
            existingRequest.requestedRole !== 'TEAM_LEADER' ||
            existingRequest.reviewLevel !== 'ADMIN'
        ) {
            return NextResponse.json(
                { error: 'This request cannot be reviewed by admin here' },
                { status: 400 }
            );
        }

        if (existingRequest.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'This request has already been reviewed' },
                { status: 400 }
            );
        }

        if (action === 'REJECT') {
            const updated = await prisma.miSaludRequest.update({
                where: { id },
                data: {
                    status: 'REJECTED',
                    reviewedAt: new Date(),
                    reviewedById: session.user.id,
                    rejectionReason: rejectionReason || null,
                },
            });

            return NextResponse.json({
                success: true,
                request: updated,
                message: 'Request rejected successfully',
            });
        }

        const existingTeam = await prisma.miSaludTeam.findFirst({
            where: {
                name: existingRequest.teamName,
            },
        });

        if (existingTeam) {
            return NextResponse.json(
                { error: 'A team with this name already exists' },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            const createdTeam = await tx.miSaludTeam.create({
                data: {
                    name: existingRequest.teamName,
                    leaderUserId: existingRequest.userId,
                    status: 'APPROVED',
                    reviewedAt: new Date(),
                    reviewedById: session.user.id,
                },
            });

            const membership = await tx.miSaludMembership.create({
                data: {
                    userId: existingRequest.userId,
                    teamId: createdTeam.id,
                    role: 'TEAM_LEADER',
                    status: 'APPROVED',
                    approvedAt: new Date(),
                },
            });

            const updatedRequest = await tx.miSaludRequest.update({
                where: { id },
                data: {
                    status: 'APPROVED',
                    reviewedAt: new Date(),
                    reviewedById: session.user.id,
                    teamId: createdTeam.id,
                },
            });

            return {
                createdTeam,
                membership,
                updatedRequest,
            };
        });

        return NextResponse.json({
            success: true,
            message: 'Team leader request approved successfully',
            team: result.createdTeam,
            membership: result.membership,
            request: result.updatedRequest,
        });
    } catch (error) {
        console.error('Error reviewing admin MiSalud request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
