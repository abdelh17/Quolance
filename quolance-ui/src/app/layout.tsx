import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import './globals.css';

import Footer from '@/components/global/Footer';

import { StepsProvider } from '@/context/StepsContext';
import Providers from '@/util/Providers';

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
        className={`${monsterratFont.variable} ${monsterratFont.className} flex flex-col min-h-screen`}
      >
        <Providers>
          <StepsProvider>
            <main className="flex-grow">{children}</main>
            <Footer />
          </StepsProvider>
        </Providers>
      </body>
    </html>
  );
}
