import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file || typeof file === 'string') {
            return NextResponse.json(
                { success: false, message: 'No file provided.' },
                { status: 400 }
            );
        }

        if (file.size > MAX_SIZE_BYTES) {
            return NextResponse.json(
                { success: false, message: 'File must be less than 5 MB.' },
                { status: 400 }
            );
        }

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid file type. Allowed: PDF, JPG, PNG, DOC, DOCX.',
                },
                { status: 400 }
            );
        }

        const safeOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `mhpss-certificates/${Date.now()}-${safeOriginalName}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const blob = await put(fileName, buffer, {
            access: 'public',
            addRandomSuffix: true,
            contentType: file.type,
        });

        return NextResponse.json(
            { success: true, url: blob.url },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Upload error:', error?.message ?? error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message ?? 'Something went wrong during upload.',
            },
            { status: 500 }
        );
    }
}