import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4 gap-6">
      <SignIn
        routing="hash"
        appearance={{
          variables: {
            colorBackground: '#1a1a1a',
            colorText: '#ffffff',
            colorPrimary: '#6366f1',
            colorInputBackground: '#262626',
            colorInputText: '#ffffff',
          },
          elements: {
            card: 'shadow-none border border-neutral-800',
            headerTitle: 'text-white',
            headerSubtitle: 'text-neutral-400',
            socialButtonsBlockButton: 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white',
            formFieldLabel: 'text-neutral-300',
            footerActionLink: 'text-indigo-400',
            dividerLine: 'bg-neutral-700',
            dividerText: 'text-neutral-500',
          },
        }}
      />
      <Link
        href="/"
        className="text-neutral-500 text-sm hover:text-white transition-colors no-underline"
      >
        Continue without an account &rarr;
      </Link>
    </div>
  );
}
