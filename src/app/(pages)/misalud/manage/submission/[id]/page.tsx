import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/Header';
import MiSaludSubmissionDetailsClient from '@/components/misalud/MiSaludSubmissionDetailsClient';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const MiSaludSubmissionDetailsPage = async ({ params }: PageProps) => {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    if (session.user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const { id } = await params;

    return (
        <div>
            <Header session={session} />
            <MiSaludSubmissionDetailsClient submissionId={id} />
        </div>
    );
};

export default MiSaludSubmissionDetailsPage;
