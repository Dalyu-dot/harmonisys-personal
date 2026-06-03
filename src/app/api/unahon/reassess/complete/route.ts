import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UnahonReassessmentStatus } from '@prisma/client';

export async function PATCH() {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const pendingRequest = await prisma.unahonReassessmentRequest.findFirst(
            {
                where: {
                    userId: session.user.id,
                    status: UnahonReassessmentStatus.PENDING,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }
        );

        if (!pendingRequest) {
            return NextResponse.json(
                { error: 'No pending reassessment request found' },
                { status: 404 }
            );
        }

        const updatedRequest = await prisma.unahonReassessmentRequest.update({
            where: {
                id: pendingRequest.id,
            },
            data: {
                status: UnahonReassessmentStatus.COMPLETED,
                completedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            request: updatedRequest,
        });
    } catch (error) {
        console.error('Complete reassessment error:', error);

        return NextResponse.json(
            { error: 'Failed to complete reassessment request' },
            { status: 500 }
        );
    }
}
