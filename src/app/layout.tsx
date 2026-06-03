import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ChatWidgetLoader from '@/components/chatbot/ChatWidgetLoader';
import QueryProvider from '@/components/providers/QueryProvider';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'Harmonisys',
    description:
        'An integrated web-based platform for Disaster Risk Reduction and Management (DRRM) that incorporates multiple DRRM-H tools.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
            >
                <QueryProvider>
                    {children}
                    <ChatWidgetLoader />
                </QueryProvider>
            </body>
        </html>
    );
}
