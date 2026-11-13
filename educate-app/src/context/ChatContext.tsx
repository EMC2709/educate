'use client';

import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useChat as useAIChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useAuth } from '@clerk/nextjs';

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

const AI_OFF_MESSAGE = 'AI features are switched off for your school, so the AI tutor is not available. You can still use quizzes, past papers and flashcards.';

/** The chat route answers errors as JSON ({ error }); fall back to a plain message for anything else */
function readableError(error: Error): string {
  try {
    const parsed = JSON.parse(error.message) as { error?: unknown };
    if (typeof parsed.error === 'string' && parsed.error) return parsed.error;
  } catch {}
  return 'Something went wrong. Please try again.';
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [aiOff, setAiOff] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { isSignedIn } = useAuth();

  const { messages, sendMessage, setMessages, status } = useAIChat<UIMessage>({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        parts: [{ type: 'text', text: "Hi! I'm your Educate AI tutor. Ask me anything about your subjects, exam technique, or any concept you're struggling with." }],
      },
    ],
    // A refused request (signed out, too many messages, AI switched off) shows its reason in the chat
    onError: error => addReply(readableError(error)),
  });

  const addReply = (text: string, userText?: string) => {
    const stamp = Date.now();
    setMessages(prev => [
      ...prev,
      ...(userText ? [{ id: `local-user-${stamp}`, role: 'user' as const, parts: [{ type: 'text' as const, text: userText }] }] : []),
      { id: `local-reply-${stamp}`, role: 'assistant' as const, parts: [{ type: 'text' as const, text }] },
    ]);
  };

  const isLoading = status === 'submitted' || status === 'streaming';

  // The school "AI off" switch lives on the server. Read it once per sign-in and mirror it in
  // localStorage, where the quiz page looks. The server enforces it whatever the browser holds.
  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/organisations')
      .then(r => (r.ok ? r.json() : null))
      .then((data: { organisation?: { ai_disabled?: boolean } | null } | null) => {
        const off = data?.organisation?.ai_disabled === true;
        setAiOff(off);
        try { localStorage.setItem('educate-ai-disabled', off ? 'true' : 'false'); } catch {}
      })
      .catch(() => {});
  }, [isSignedIn]);

  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatOpen]);

  const sendChat = (subject?: string | null, board?: string | null) => {
    if (!chatInput.trim() || isLoading) return;
    const text = chatInput;
    setChatInput('');
    // AI switched off for this student's school: answer locally, without calling the API
    if (aiOff) {
      addReply(AI_OFF_MESSAGE, text);
      return;
    }
    sendMessage({ text }, { body: { subject: subject ?? null, board: board ?? null } });
  };

  const chatMessages = messages.map((m, i) => {
    const content = m.parts?.map(p => p.type === 'text' ? p.text : '').join('') ?? '';
    // A finished reply with no text means the model declined or was cut off: say so instead of showing an empty bubble
    const finishedEmpty = m.role === 'assistant' && !content.trim() && !(isLoading && i === messages.length - 1);
    return {
      role: m.role as 'user' | 'assistant',
      content: finishedEmpty ? "Sorry, I can't answer that one. Try asking it a different way." : content,
    };
  });

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
