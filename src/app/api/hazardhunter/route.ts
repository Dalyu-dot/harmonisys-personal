import { fetchHazardAssessment } from '@/lib/action/hazardhunter';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { latitude, longitude } = body;

        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return NextResponse.json(
                {
                    message: 'Invalid coordinates',
                    data: {
                        success: false,
                        message: 'Latitude and longitude must be numbers.',
                        data: null,
                    },
                },
                { status: 400 }
            );
        }

        const hazardResult = await fetchHazardAssessment(latitude, longitude);

        return NextResponse.json(
            {
                message: 'Ok',
                data: {
                    success: true,
                    message: 'Hazard assessment fetched successfully.',
                    data: hazardResult,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('HazardHunter API error:', error);

        const errorMessage =
            error instanceof Error ? error.message : 'Internal server error';

        return NextResponse.json(
            {
                message: errorMessage,
                data: {
                    success: false,
                    message: errorMessage,
                    data: null,
                },
            },
            { status: 500 }
        );
    }
}
