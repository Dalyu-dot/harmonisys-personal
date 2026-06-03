import Header from '@/components/Header';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import IncidentManageClient from './ui/IncidentManageClient';

export default async function IncidentManagePage() {
    const session = await auth();

    // Not logged in
    if (!session?.user) redirect('/dashboard');

    // Not admin
    if (session.user.role !== 'ADMIN') redirect('/dashboard');

    return (
        <div>
            <Header session={session} />
            <IncidentManageClient />
        </div>
    );
}
