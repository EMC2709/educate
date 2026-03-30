import type { Metadata } from 'next';
import './globals.css';
import { ChatProvider } from '@/context/ChatContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Educate — GCSE Revision',
  description: 'AI-powered GCSE revision tool with question banks, flashcards, and an AI tutor. AQA, Edexcel, OCR, WJEC.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <AuthProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
