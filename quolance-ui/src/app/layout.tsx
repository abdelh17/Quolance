import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import './globals.css';

import Footer from '@/components/global/Footer';

import { StepsProvider } from '@/util/context/StepsContext';
import ToastProvider from '@/util/context/ToastProvider';
import ReactQueryProvider from '@/util/context/ReactQueryProvider';

const monsterratFont = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--main-font',
});

export const metadata: Metadata = {
  title: 'Quolance',
  description: 'One Stop Freelancing Services',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' dir='ltr'>
      <body
        className={`${monsterratFont.variable} ${monsterratFont.className} flex min-h-screen flex-col`}
      >
        <ToastProvider>
          <ReactQueryProvider>
            <StepsProvider>
              <main className='flex-grow'>{children}</main>
              <Footer />
            </StepsProvider>
          </ReactQueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
