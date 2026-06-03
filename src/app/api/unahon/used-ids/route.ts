import { NextResponse } from 'next/server';
import { getUsedPatientIds } from '@/lib/action/unahon';

export async function GET() {
    const ids = await getUsedPatientIds();
    return NextResponse.json(ids);
}
