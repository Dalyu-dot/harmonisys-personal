import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UnahonReassessmentStatus } from '@prisma/client';

export async function GET() {
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

        return NextResponse.json({
            success: true,
            pendingRequest,
            hasPending: !!pendingRequest,
        });
    } catch (error) {
        console.error('Pending reassessment fetch error:', error);

        return NextResponse.json(
            { error: 'Failed to fetch pending reassessment' },
            { status: 500 }
        );
    }
}
