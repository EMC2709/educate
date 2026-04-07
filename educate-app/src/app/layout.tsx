import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ChatProvider } from '@/context/ChatContext';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { ToastProvider } from '@/components/ui/Toast';
import { FocusModeProvider } from '@/components/layout/FocusMode';
import { CookieBanner } from '@/components/layout/CookieBanner';

export const metadata: Metadata = {
  title: 'Educate — GCSE Revision',
  description: 'AI-powered GCSE revision tool with question banks, flashcards, and an AI tutor. AQA, Edexcel, OCR, WJEC.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ variables: { colorBackground: '#0f0f0f', colorText: '#ffffff', colorPrimary: '#6366f1' } }}>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full">
          <ToastProvider>
            <FocusModeProvider>
              <ChatProvider>
                {children}
                <CommandPalette />
                <CookieBanner />
              </ChatProvider>
            </FocusModeProvider>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
