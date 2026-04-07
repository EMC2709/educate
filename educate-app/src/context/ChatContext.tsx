'use client';

import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useChat as useAIChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

interface ChatContextType {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessages: { role: 'user' | 'assistant'; content: string }[];
  chatInput: string;
  setChatInput: (input: string) => void;
  chatLoading: boolean;
  sendChat: (subject?: string | null, board?: string | null) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useAIChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        parts: [{ type: 'text', text: "Hi! I'm your Educate AI tutor. Ask me anything about your subjects, exam technique, or any concept you're struggling with." }],
      },
    ],
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatOpen]);

  const sendChat = (subject?: string | null, board?: string | null) => {
    if (!chatInput.trim() || isLoading) return;
    const text = chatInput;
    setChatInput('');
    sendMessage({ text }, { body: { subject: subject ?? null, board: board ?? null } });
  };

  const chatMessages = messages.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.parts?.map(p => p.type === 'text' ? p.text : '').join('') ?? '',
  }));

  return (
    <ChatContext.Provider value={{
      chatOpen, setChatOpen,
      chatMessages,
      chatInput,
      setChatInput,
      chatLoading: isLoading,
      sendChat,
      chatEndRef,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
