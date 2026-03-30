'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
            E
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Sign in to Educate</h1>
          <p className="text-neutral-400 text-sm">Use your school account to get started</p>
        </div>

        {/* SSO Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => signIn('microsoft-entra-id', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-[#2F2F2F] hover:bg-[#3a3a3a] border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-sm font-medium cursor-pointer transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            Sign in with Microsoft
          </button>

          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3.5 text-neutral-800 text-sm font-medium cursor-pointer transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-neutral-500 text-xs">or</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Continue without account */}
        <Link
          href="/"
          className="block text-center text-neutral-400 text-sm hover:text-white transition-colors no-underline mb-8"
        >
          Continue without an account &#8594;
        </Link>

        {/* What you get */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-neutral-300 mb-3 m-0">What&apos;s included:</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 text-xs mt-0.5">&#10003;</span>
              <span className="text-xs text-neutral-400"><span className="text-white">Free without login:</span> Question bank, flashcards, topic selection across all subjects</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-400 text-xs mt-0.5">&#9733;</span>
              <span className="text-xs text-neutral-400"><span className="text-white">With login:</span> AI Tutor chat, AI answer marking, AI-generated questions, progress tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
