import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import IncidentsDashboard from '@/components/irs/IncidentsDashboard';
import { auth } from '@/lib/auth';

const IncidentsPage = async () => {
    const session = await auth();

    const role = session?.user?.role;
    const canAccess = session && (role === 'ADMIN' || role === 'RESPONDER');

    if (!canAccess) {
        redirect('/overview/irs');
    }

    return (
        <div>
            <Header session={session} />
            <IncidentsDashboard userRole={session?.user?.role} />
        </div>
    );
};

export default IncidentsPage;
