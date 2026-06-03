import { overviewContent } from '@/constants';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/Header';
import { auth } from '@/lib/auth';
import ToolOverview from '@/components/ToolOverview';

type PageProps = {
    params: Promise<{ toolName: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const OverviewPage = async ({ params }: PageProps) => {
    const session = await auth();
    const { toolName } = await params;

    const pageExists = overviewContent.hasOwnProperty(toolName);
    if (!pageExists) return notFound();

    const tool = overviewContent[toolName as keyof typeof overviewContent];

    // ✅ ROLE CHECK
    const roleRaw = String(session?.user?.role || '').toUpperCase();
    const isResponder = roleRaw.includes('RESPONDER');
    const isAdmin = roleRaw.includes('ADMIN');

    // ✅ Skip overview for RESPONDER/ADMIN
    if (session?.user && (isResponder || isAdmin)) {
        if (toolName === 'misalud') redirect('/misalud');
        if (toolName === 'unahon') redirect('/unahon'); // adjust if your dashboard route differs
        if (toolName === 'hazardhunter') redirect('/hazardhunter');
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header session={session} />
            <div className="flex-1">
                <ToolOverview
                    name={tool.name}
                    subheading={tool.subheading}
                    description={tool.description}
                    subdescription={tool.subdescription}
                    imageUrl={tool.imageUrl}
                    urls={tool.url}
                    isAuthenticated={!!session?.user}
                    userRole={session?.user?.role}
                />
            </div>
        </div>
    );
};

export default OverviewPage;
