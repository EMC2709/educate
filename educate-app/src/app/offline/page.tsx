'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">📵</div>
        <h1 className="text-2xl font-extrabold text-white mb-3">You&apos;re offline</h1>
        <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
          No internet connection detected. You can still access recently visited pages and your saved notes.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold px-6 py-3 rounded-xl border-none cursor-pointer transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
