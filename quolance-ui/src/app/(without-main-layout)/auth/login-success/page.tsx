'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoShieldCheckmark } from 'react-icons/io5';
import { useAuthGuard } from '@/api/auth-api';

export default function Page() {
  const { user } = useAuthGuard({ middleware: 'auth' });

  const [counter, setCounter] = React.useState(3);
  const router = useRouter();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev - 1);
      if (counter === 1) {
        user?.role === 'ADMIN'
          ? router.push('/adminDashboard')
          : router.push('/dashboard');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [counter, router]);

  return (
    <div className='mt-4 flex h-screen w-full flex-col items-center justify-center gap-8 md:mt-0'>
      <IoShieldCheckmark className='text-primary text-9xl' />
      <h2 className='text-4xl font-bold'>You're logged in!</h2>
      <p className='text-lg'>
        Redirecting to your profile in {counter} seconds...
      </p>
      <Link href='/' className='text-primary underline'>
        Take me home
      </Link>
    </div>
  );
}
