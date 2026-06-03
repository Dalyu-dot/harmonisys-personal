import Header from '@/components/Header';
import UnahonManageClient from '@/components/unahon/UnahonManageClient';
import { auth } from '@/lib/auth';
import { UserType } from '@prisma/client';

export default async function UnahonManagementPage() {
    const session = await auth();

    if (!session) {
        return <div className="p-6">Not authenticated.</div>;
    }

    if (session.user.role !== UserType.ADMIN) {
        return <div className="p-6">Access Restricted (Admin only)</div>;
    }

    return (
        <div>
            <Header session={session} />
            <UnahonManageClient session={session} />
        </div>
    );
}
