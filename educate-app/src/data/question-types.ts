import type { QuestionTypeConfig } from '@/types';

export const Q_TYPES: QuestionTypeConfig[] = [
  { type: "short",     label: "Short Answer",     icon: "\u26a1", marks: "1\u20132 marks", color: "#f59e0b", desc: "Quick recall. Single sentence." },
  { type: "mid",       label: "Mid Answer",       icon: "\ud83d\udccb", marks: "3\u20135 marks", color: "#8b5cf6", desc: "2\u20133 developed points." },
  { type: "long",      label: "Extended Response", icon: "\ud83d\udcdd", marks: "6\u20138 marks", color: "#e94560", desc: "Full argument + evaluation." },
  { type: "flashcard", label: "Flashcards",        icon: "\ud83c\udccf", marks: "Key terms",  color: "#10b981", desc: "Flip to reveal definitions." },
];
