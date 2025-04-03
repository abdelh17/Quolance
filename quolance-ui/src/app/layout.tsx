import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import './globals.css';

import Footer from '@/components/global/Footer';

import ReactQueryProvider from '@/util/context/ReactQueryProvider';
import { StepsProvider } from '@/util/context/StepsContext';
import ToastProvider from '@/util/context/ToastProvider';
import { ChatInterface, ChatProvider } from '@/components/ui/chat/ChatProvider';

// Dynamically import the WebSocketProvider so that it loads only on the client
const WebSocketProvider = dynamic(
  () =>
    import('@/util/context/webSocketContext').then(
      (mod) => mod.WebSocketProvider
    ),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Quolance',
  description: 'One Stop Freelancing Services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' dir='ltr'>
      <body className='h-full overflow-x-hidden'>
        <ToastProvider>
          <ReactQueryProvider>
            <StepsProvider>
              <WebSocketProvider>
                <ChatProvider>
                  <div className='flex min-h-screen flex-col'>
                    <main className='flex flex-grow flex-col'>{children}</main>
                    <ChatInterface />
                    <Footer />
                  </div>
                </ChatProvider>
              </WebSocketProvider>
            </StepsProvider>
          </ReactQueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
