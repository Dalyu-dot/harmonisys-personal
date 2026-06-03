import { HeroUIProvider } from '@heroui/react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/landing/Hero';
import { auth } from '@/lib/auth';

const HowTo = dynamic(() => import('@/components/landing/HowTo'), {
    loading: () => <div className="h-[500px] bg-[#7A1111]" />,
});

const Carousel = dynamic(
    () => import('@/components/landing/carousel/Carousel'),
    {
        loading: () => <div className="h-[420px] bg-white" />,
    }
);

const Feature = dynamic(() => import('@/components/landing/Feature'), {
    loading: () => <div className="h-[320px] bg-white" />,
});

const Footer = dynamic(() => import('@/components/landing/Footer'), {
    loading: () => <div className="h-[220px] bg-[#18060C]" />,
});

const Home = async () => {
    const session = await auth();
    const isAuthenticated = !!session?.user;

    return (
        <HeroUIProvider>
            <Header session={session} />

            <main>
                <Hero session={session} />
                <HowTo />
                <Carousel isAuthenticated={isAuthenticated} />
                <Feature />
            </main>

            <Footer isAuthenticated={isAuthenticated} />
        </HeroUIProvider>
    );
};

export default Home;
