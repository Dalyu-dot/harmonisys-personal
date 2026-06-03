import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserType, UnahonReassessmentStatus } from '@prisma/client';

export async function POST(req: Request) {
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

        const body = await req.json();
        const { userId, client, affiliation } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const existingPending =
            await prisma.unahonReassessmentRequest.findFirst({
                where: {
                    userId,
                    status: UnahonReassessmentStatus.PENDING,
                },
            });

        if (existingPending) {
            return NextResponse.json({
                success: true,
                request: existingPending,
                message: 'User already has a pending reassessment request.',
            });
        }

        const request = await prisma.unahonReassessmentRequest.create({
            data: {
                userId,
                requestedById: session.user.id,
                client,
                affiliation,
            },
        });

        return NextResponse.json({
            success: true,
            request,
        });
    } catch (error) {
        console.error('Reassessment request error:', error);

        return NextResponse.json(
            { error: 'Failed to create reassessment request' },
            { status: 500 }
        );
    }
}
