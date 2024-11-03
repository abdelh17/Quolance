import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Footer from '@/components/global/Footer';
import { StepsProvider } from '@/context/StepsContext';


import './globals.css';

import Providers from '@/util/Providers';
//THIS IS THE GLOBAL LAYOUT, IT WILL WRAP ALL THE PAGES

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
        className={`${monsterratFont.variable} ${monsterratFont.className}`}
      >
        <Providers>
          <StepsProvider>
          <main>{children}</main>
          <Footer/>
          </StepsProvider>
        </Providers>
      </body>
    </html>
  );
}
