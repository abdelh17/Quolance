'use client';

import Header from '@/components/global/Header';
import HeroSection from '@/components/home/HeroSection';
import { useAuthGuard } from '@/api/auth-api';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <main>
      <Header />
      <HeroSection />
    </main>
  );
}
