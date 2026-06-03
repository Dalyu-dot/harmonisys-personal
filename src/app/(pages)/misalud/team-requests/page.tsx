import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/Header';
import MiSaludLeaderRequestsClient from '@/components/misalud/MiSaludLeaderRequestsClient';

const MiSaludTeamRequestsPage = async () => {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    if (session.user.role !== 'RESPONDER' && session.user.role !== 'ADMIN') {
        redirect('/overview/misalud');
    }

    return (
        <div>
            <Header session={session} />
            <MiSaludLeaderRequestsClient session={session} />
        </div>
    );
};

export default MiSaludTeamRequestsPage;
