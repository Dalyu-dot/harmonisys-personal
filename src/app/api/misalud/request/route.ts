import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const {
            fullName,
            age,
            address,
            requestedRole,
            teamName,
            teamId,
        } = body;

        // Basic validation
        if (!fullName || !age || !address || !requestedRole) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Prevent duplicate pending requests
        const existing = await prisma.miSaludRequest.findFirst({
            where: {
                userId: session.user.id,
                status: 'PENDING',
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'You already have a pending request' },
                { status: 400 }
            );
        }

        // TEAM LEADER → create new team request (ADMIN review)
        if (requestedRole === 'TEAM_LEADER') {
            if (!teamName) {
                return NextResponse.json(
                    { error: 'Team name is required for Team Leader' },
                    { status: 400 }
                );
            }

            // ✅ Check if approved team already exists
            const existingTeam = await prisma.miSaludTeam.findFirst({
                where: {
                    name: {
                        equals: teamName.trim(),
                        mode: 'insensitive',
                    },
                },
            });

            if (existingTeam) {
                return NextResponse.json(
                    {
                        error: 'Team/Department Name already exists or is already taken.',
                    },
                    { status: 400 }
                );
            }

            // ✅ Check if another pending request already uses this name
            const existingPendingRequest = await prisma.miSaludRequest.findFirst({
                where: {
                    teamName: {
                        equals: teamName.trim(),
                        mode: 'insensitive',
                    },
                    requestedRole: 'TEAM_LEADER',
                    status: 'PENDING',
                },
            });

            if (existingPendingRequest) {
                return NextResponse.json(
                    {
                        error:
                            'A pending registration already uses this Team/Department Name.',
                    },
                    { status: 400 }
                );
            }

            await prisma.miSaludRequest.create({
                data: {
                    userId: session.user.id,
                    fullName,
                    age,
                    address,
                    requestedRole: 'TEAM_LEADER',
                    teamName,
                    reviewLevel: 'ADMIN',
                },
            });

            return NextResponse.json({
                success: true,
                message:
                    'Your team registration has been submitted. Please wait for admin approval.',
            });
        }

        // TEAM MEMBER → join team (TEAM LEADER review)
        if (requestedRole === 'TEAM_MEMBER') {
            if (!teamId) {
                return NextResponse.json(
                    { error: 'Team selection is required' },
                    { status: 400 }
                );
            }

            const team = await prisma.miSaludTeam.findUnique({
                where: { id: teamId },
            });

            if (!team) {
                return NextResponse.json(
                    { error: 'Selected team not found' },
                    { status: 404 }
                );
            }

            await prisma.miSaludRequest.create({
                data: {
                    userId: session.user.id,
                    fullName,
                    age,
                    address,
                    requestedRole: 'TEAM_MEMBER',
                    teamId,
                    teamName: team.name,
                    reviewLevel: 'TEAM_LEADER',
                },
            });

            return NextResponse.json({
                success: true,
                message:
                    'Your request has been submitted. Please wait for your team leader to approve your request.',
            });
        }

        return NextResponse.json(
            { error: 'Invalid role' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Error creating MiSalud request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}