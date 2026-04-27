import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ChatProvider } from '@/context/ChatContext';
import { FloatingChat } from '@/components/layout/FloatingChat';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { ToastProvider } from '@/components/ui/Toast';
import { FocusModeProvider } from '@/components/layout/FocusMode';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { ServiceWorkerRegistration } from '@/components/layout/ServiceWorkerRegistration';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';

export const metadata: Metadata = {
  title: 'Educate — GCSE Revision',
  description: 'AI-powered GCSE revision tool with question banks, flashcards, and an AI tutor. AQA, Edexcel, OCR, WJEC.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f0f0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider signInUrl="/login" signUpUrl="/login" appearance={{ variables: { colorBackground: '#0f0f0f', colorText: '#ffffff', colorPrimary: '#6366f1' } }}>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full">
          <ToastProvider>
            <FocusModeProvider>
              <ChatProvider>
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
                <FloatingChat />
                <CommandPalette />
                <CookieBanner />
                <ServiceWorkerRegistration />
              </ChatProvider>
            </FocusModeProvider>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
