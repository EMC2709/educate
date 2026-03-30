'use client';

import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage } from '@/types';

interface ChatContextType {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (input: string) => void;
  chatLoading: boolean;
  sendChat: (subject?: string | null, board?: string | null) => Promise<void>;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm your Educate AI tutor. Ask me anything about your subjects, exam technique, or any concept you're struggling with." },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);

  const sendChat = useCallback(async (subject?: string | null, board?: string | null) => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', content: msg }];
    setChatMessages(newMessages);
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          subject: subject ?? null,
          board: board ?? null,
        }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    }
    setChatLoading(false);
  }, [chatInput, chatLoading, chatMessages]);

  return (
    <ChatContext.Provider value={{ chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, chatLoading, sendChat, chatEndRef }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
