import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/Header';
import MiSaludAdminRequestsClient from '@/components/misalud/MiSaludAdminRequestsClient';

const MiSaludManagePage = async () => {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    if (session.user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    return (
        <div>
            <Header session={session} />
            <MiSaludAdminRequestsClient session={session} />
        </div>
    );
};

export default MiSaludManagePage;
