import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import IncidentDetailsClient from '../ui/IncidentDetailsClient';

export default async function IncidentAdminDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) redirect('/dashboard');
    if (session.user.role !== 'ADMIN') redirect('/dashboard');

    return <IncidentDetailsClient id={id} />;
}
