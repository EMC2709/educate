'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useChat } from '@/context/ChatContext';
import { MessageContent } from '@/components/ui/MessageContent';

interface ChatPanelProps {
  subject?: string | null;
  board?: string | null;
}

export function ChatPanel({ subject, board }: ChatPanelProps) {
  const { data: session } = useSession();
  const { chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, chatLoading, sendChat, chatEndRef } = useChat();

  if (!chatOpen) return null;

  const isAuthenticated = !!session;

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setChatOpen(false)} />

      {/* Panel */}
      <div className="fixed inset-x-0 bottom-0 top-16 z-50 md:static md:z-auto md:w-[340px] md:flex-shrink-0 bg-neutral-900 border-l border-neutral-800 flex flex-col md:h-[calc(100vh-56px)] md:sticky md:top-14">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-full flex items-center justify-center text-sm">
              &#127891;
            </div>
            <div>
              <p className="m-0 font-semibold text-sm text-white">AI Tutor</p>
              <p className="m-0 text-[10px] text-emerald-400">&#9679; Online</p>
            </div>
          </div>
          <button onClick={() => setChatOpen(false)} className="bg-transparent border-none text-neutral-500 cursor-pointer text-lg hover:text-white p-1">
            &#10005;
          </button>
        </div>

        {/* Messages or Sign-in prompt */}
        {isAuthenticated ? (
          <>
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-2.5">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[90%] px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-white ${
                      msg.role === 'user'
                        ? 'bg-indigo-500 rounded-[14px_14px_4px_14px] whitespace-pre-wrap'
                        : 'bg-neutral-800 rounded-[14px_14px_14px_4px]'
                    }`}
                  >
                    {msg.role === 'user' ? msg.content : <MessageContent content={msg.content} />}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex gap-1 px-3.5 py-2.5 bg-neutral-800 rounded-[14px_14px_14px_4px] w-fit">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-neutral-800 flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) sendChat(subject, board); }}
                placeholder="Ask your AI tutor..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={() => sendChat(subject, board)}
                disabled={chatLoading || !chatInput.trim()}
                className="bg-indigo-500 border-none rounded-xl w-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white text-base"
              >
                &#8593;
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-3xl mb-4">
              &#128272;
            </div>
            <h3 className="text-white font-semibold text-base mb-2">Sign in to use AI Tutor</h3>
            <p className="text-neutral-400 text-xs mb-5 leading-relaxed">
              Get unlimited AI tutoring, answer marking, and personalised help with your school or Google account.
            </p>
            <Link
              href="/login"
              className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-6 py-2.5 rounded-xl no-underline transition-colors"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
