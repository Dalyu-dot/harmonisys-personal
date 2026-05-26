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
                { error: 'Only approved Team Leaders can review these requests' },
                { status: 403 }
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
            existingRequest.requestedRole !== 'TEAM_MEMBER' ||
            existingRequest.reviewLevel !== 'TEAM_LEADER'
        ) {
            return NextResponse.json(
                { error: 'This request cannot be reviewed here' },
                { status: 400 }
            );
        }

        if (existingRequest.teamId !== leaderMembership.teamId) {
            return NextResponse.json(
                { error: 'You can only review requests for your own team' },
                { status: 403 }
            );
        }

        if (existingRequest.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'This request has already been reviewed' },
                { status: 400 }
            );
        }

        const teamName = leaderMembership.team.name;

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

            await prisma.notification.create({
                data: {
                    userId: existingRequest.userId,
                    type: 'MISALUD_TEAM_REJECTED',
                    title: 'MiSalud Request Rejected',
                    message: rejectionReason
                        ? `Your request to join ${teamName} as a Team Member was rejected. Reason: ${rejectionReason}`
                        : `Your request to join ${teamName} as a Team Member has been rejected.`,
                    read: false,
                    refId: id,
                    refType: 'MISALUD_REQUEST',
                    link: '/misalud/membership',
                },
            });

            return NextResponse.json({
                success: true,
                request: updated,
                message: 'Request rejected successfully',
            });
        }

        const existingMembership = await prisma.miSaludMembership.findFirst({
            where: {
                userId: existingRequest.userId,
                teamId: leaderMembership.teamId,
            },
        });

        if (existingMembership) {
            return NextResponse.json(
                { error: 'This user already has a membership for your team' },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            const membership = await tx.miSaludMembership.create({
                data: {
                    userId: existingRequest.userId,
                    teamId: leaderMembership.teamId,
                    role: 'TEAM_MEMBER',
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
                },
            });

            await tx.notification.create({
                data: {
                    userId: existingRequest.userId,
                    type: 'MISALUD_TEAM_APPROVED',
                    title: 'MiSalud Request Approved',
                    message: `Your request to join ${teamName} as a Team Member has been approved.`,
                    read: false,
                    refId: id,
                    refType: 'MISALUD_REQUEST',
                    link: '/misalud/membership',
                },
            });

            return { membership, updatedRequest };
        });

        return NextResponse.json({
            success: true,
            message: 'Team member request approved successfully',
            membership: result.membership,
            request: result.updatedRequest,
        });
    } catch (error) {
        console.error('Error reviewing Team Leader MiSalud request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}