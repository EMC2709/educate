'use client';

import { useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useChat } from '@/context/ChatContext';
import { MessageContent } from '@/components/ui/MessageContent';

export function FloatingChat() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    chatOpen, setChatOpen,
    chatMessages, chatInput, setChatInput,
    chatLoading, sendChat, chatEndRef,
  } = useChat();

  // Auto-focus input when panel opens
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [chatOpen]);

  // Derive subject/board from URL so chat stays contextual on quiz pages
  const parts = pathname.split('/').filter(Boolean);
  const subject = parts.length >= 2 ? decodeURIComponent(parts[1]) : null;
  const board   = parts.length >= 1 ? parts[0] : null;

  return (
    <>
      {/* ── Floating panel ──────────────────────────────────────── */}
      {chatOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[90] md:hidden"
            onClick={() => setChatOpen(false)}
          />

          <div
            className="fixed z-[100] flex flex-col overflow-hidden"
            style={{
              /* Full screen on mobile, floating box on desktop */
              bottom: 'calc(env(safe-area-inset-bottom) + 80px)',
              right: '16px',
              width: 'min(380px, calc(100vw - 32px))',
              height: 'min(520px, calc(100vh - 120px))',
              background: 'var(--chat-surface)',
              border: '1px solid var(--chat-border)',
              borderRadius: '20px',
              boxShadow: 'var(--chat-shadow)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 shrink-0"
              style={{ background: 'var(--chat-header-gradient)' }}>
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-full flex items-center justify-center text-base shrink-0">
                🎓
              </div>
              <div className="flex-1 min-w-0">
                <p className="m-0 font-bold text-sm text-white leading-tight">AI Tutor</p>
                <p className="m-0 text-[10px] text-emerald-400 leading-tight">● Online</p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-800 border-none text-neutral-400 cursor-pointer hover:bg-neutral-700 hover:text-white transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            {isSignedIn ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">
                          🎓
                        </div>
                      )}
                      <div
                        className="max-w-[82%] px-3.5 py-2.5 text-[13px] leading-relaxed"
                        style={{
                          background: msg.role === 'user' ? '#6366f1' : 'var(--chat-ai-bubble)',
                          color:      msg.role === 'user' ? '#ffffff' : 'var(--chat-ai-text)',
                          borderRadius: msg.role === 'user'
                            ? '16px 16px 4px 16px'
                            : '16px 16px 16px 4px',
                        }}
                      >
                        {msg.role === 'user'
                          ? <span className="whitespace-pre-wrap">{msg.content}</span>
                          : <MessageContent content={msg.content} />
                        }
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-full flex items-center justify-center text-xs shrink-0">🎓</div>
                      <div className="flex gap-1 px-3.5 py-2.5 rounded-2xl" style={{ background: 'var(--chat-ai-bubble)' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.18}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-neutral-800 flex gap-2 shrink-0">
                  <input
                    ref={inputRef}
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(subject, board); } }}
                    placeholder="Ask anything…"
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none transition-colors"
                    style={{ fontSize: '14px' }}
                    onFocus={e => (e.target.style.borderColor = '#6366f1')}
                    onBlur={e => (e.target.style.borderColor = 'var(--chat-input-blur)')}
                  />
                  <button
                    onClick={() => sendChat(subject, board)}
                    disabled={chatLoading || !chatInput.trim()}
                    className="w-10 h-10 rounded-xl border-none cursor-pointer flex items-center justify-center text-white text-base disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                    style={{ background: chatInput.trim() && !chatLoading ? '#6366f1' : 'var(--chat-send-idle)' }}
                  >
                    ↑
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-3xl mb-4">🔒</div>
                <h3 className="text-white font-semibold text-base mb-2">Sign in to use AI Tutor</h3>
                <p className="text-neutral-400 text-xs mb-5 leading-relaxed">
                  Get unlimited AI tutoring, personalised help with your subjects, and answer marking.
                </p>
                <Link
                  href="/login"
                  onClick={() => setChatOpen(false)}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-6 py-2.5 rounded-xl no-underline transition-colors"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── FAB button ──────────────────────────────────────────── */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed z-[100] border-none cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + 20px)',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: chatOpen
            ? 'var(--chat-fab-idle)'
            : 'linear-gradient(135deg, #6366f1, #ec4899)',
          boxShadow: chatOpen
            ? '0 4px 16px rgba(0,0,0,0.15)'
            : '0 4px 20px rgba(99,102,241,0.5)',
        }}
        aria-label="Open AI Tutor"
      >
        {chatOpen ? (
          <span className="text-white text-xl">✕</span>
        ) : (
          <span className="text-2xl">🎓</span>
        )}
      </button>
    </>
  );
}
