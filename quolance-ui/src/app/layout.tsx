import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Header from "@/components/global/Header";

import './globals.css';

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
         <Header/>
        <main className="pt-[100px]">
        {children}
        </main>
      </body>
    </html>
  );
}
