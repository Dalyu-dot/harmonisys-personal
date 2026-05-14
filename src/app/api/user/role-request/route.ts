/**
 * app/api/user/role-request/route.ts
 *
 * POST — Standard user submits a Responder role-upgrade request.
 *        Sends an email to the DRRM-H admin inbox.
 *
 * GET  — Returns the current user's latest RoleChangeRequest (if any),
 *        so the Header can show the pending badge.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Import auth from your main auth config
import { prisma } from '@/lib/prisma';
import { sendRoleRequestToAdmin } from '@/lib/email';
import { UserType, MhpssLevel } from '@prisma/client';

// ─── GET — fetch caller's latest request ────────────────────────────────────

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized.' },
      { status: 401 }
    );
  }

  const request = await prisma.roleChangeRequest.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      toRole: true,
      status: true,
      createdAt: true,
      requestedMhpssLevel: true,
      requestedResponderOrganization: true,
    },
  });

  return NextResponse.json({ success: true, data: request ?? null });
}

// ─── POST — submit a new request ────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized.' },
      { status: 401 }
    );
  }

  // Only STANDARD users may request a role change
  if (session.user.role !== UserType.STANDARD) {
    return NextResponse.json(
      { success: false, message: 'Only Standard users may request a role upgrade.' },
      { status: 403 }
    );
  }

  // Block duplicate pending requests
  const existing = await prisma.roleChangeRequest.findFirst({
    where: { userId: session.user.id, status: 'PENDING' },
  });

  if (existing) {
    return NextResponse.json(
      { success: false, message: 'You already have a pending role request.' },
      { status: 409 }
    );
  }

  // Parse body
  const body = await req.json().catch(() => ({}));
  const {
    toRole = 'RESPONDER',
    requestedMhpssLevel = null,
    requestedResponderOrganization = null,
    requestedMhpssCertificateFileUrl = null,
  } = body as {
    toRole?: string;
    requestedMhpssLevel?: string | null;
    requestedResponderOrganization?: string | null;
    requestedMhpssCertificateFileUrl?: string | null;
  };

  if (!requestedResponderOrganization?.trim()) {
    return NextResponse.json(
      { success: false, message: 'Organization is required.' },
      { status: 400 }
    );
  }

  // Validate MhpssLevel enum value if provided
  const validMhpssLevel =
    requestedMhpssLevel &&
    Object.values(MhpssLevel).includes(requestedMhpssLevel as MhpssLevel)
      ? (requestedMhpssLevel as MhpssLevel)
      : null;

  // Create DB record
  const roleRequest = await prisma.roleChangeRequest.create({
    data: {
      userId: session.user.id,
      fromRole: session.user.role as UserType,
      toRole: toRole as UserType,
      status: 'PENDING',
      requestedMhpssLevel: validMhpssLevel,
      requestedResponderOrganization: requestedResponderOrganization.trim(),
      requestedMhpssCertificateFileUrl,
    },
  });

  // Fire-and-forget email to admin
  sendRoleRequestToAdmin({
    userName: session.user.name ?? null,
    userEmail: session.user.email!,
    toRole: roleRequest.toRole,
    requestedMhpssLevel: roleRequest.requestedMhpssLevel,
    requestedOrganization: roleRequest.requestedResponderOrganization,
    requestedCertUrl: roleRequest.requestedMhpssCertificateFileUrl,
    requestId: roleRequest.id,
  }).catch((err) => {
    console.error('[email] sendRoleRequestToAdmin failed:', err);
  });

  return NextResponse.json({ success: true, data: roleRequest }, { status: 201 });
}