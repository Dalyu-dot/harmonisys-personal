'use server';

import { prisma } from '@/lib/prisma';
import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { MhpssLevel, UserType } from '@prisma/client';

export const handleGoogleLogin = async () => {
    await signIn('google', { redirectTo: '/' });
    revalidatePath('/');
};

export const handleCredentialsLogin = async (
    email: string,
    password: string
) => {
    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        success: false,
                        message: 'Invalid email or password.',
                    };
                default:
                    return {
                        success: false,
                        message: 'Something went wrong during login.',
                    };
            }
        }

        return {
            success: false,
            message: 'Something went wrong during login.',
        };
    }
};

export const handleSignOut = async () => {
    await signOut({ redirectTo: '/' });
};

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });

        return user;
    } catch {
        return null;
    }
};

export const getAccountById = async (userId: string) => {
    try {
        const account = await prisma.account.findFirst({ where: { userId } });

        return account;
    } catch {
        return null;
    }
};

export const getAllUsers = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;

        const users = await prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                mhpssLevel: true,
                responderOrganization: true,
                mhpssCertificateFileUrl: true,
                gender: true,
                region: true,
                createdAt: true,

                roleChangeRequests: {
                    where: { status: 'PENDING' },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        id: true,
                        fromRole: true,
                        toRole: true,
                        requestedMhpssLevel: true,
                        requestedResponderOrganization: true,
                        requestedMhpssCertificateFileUrl: true,
                        status: true,
                        createdAt: true,
                    },
                },

                updatedAt: false,
                image: false,
                password: false,
            },
            orderBy: {
                name: 'asc',
            },
        });

        const results = users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            mhpssLevel: u.mhpssLevel,
            responderOrganization: u.responderOrganization,
            mhpssCertificateFileUrl: u.mhpssCertificateFileUrl,
            gender: u.gender,
            region: u.region,
            createdAt: u.createdAt,
            pendingRoleRequest: u.roleChangeRequests?.[0] ?? null,
        }));

        const totalUsers = await prisma.user.count();

        return {
            count: totalUsers,
            results,
        };
    } catch (err) {
        console.error('Error fetching users:', err);
        return { error: 'Failed to fetch users' };
    }
};

export async function updateUserRole(userId: string, role: UserType) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role },
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating user role:', error);
        return { success: false, error: 'Failed to update user role' };
    }
}

export async function updateUserMhpssLevel(
    userId: string,
    mhpssLevel: MhpssLevel | null
) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { mhpssLevel },
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating user MHPSS level:', error);
        return { success: false, error: 'Failed to update user MHPSS level' };
    }
}

export async function updateUserResponderOrganization(
    userId: string,
    responderOrganization: string | null
) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { responderOrganization },
        });
        revalidatePath('/users');

        return { success: true };
    } catch (error) {
        console.error('Error updating user responder organization:', error);
        return {
            success: false,
            error: 'Failed to update user responder organization',
        };
    }
}

export async function updateUserRegion(userId: string, region: string | null) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { region },
        });
        revalidatePath('/users');

        return { success: true };
    } catch (error) {
        console.error('Error updating user region:', error);
        return {
            success: false,
            error: 'Failed to update user region',
        };
    }
}
