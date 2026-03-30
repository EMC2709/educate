'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { MermaidDiagram } from './MermaidDiagram';

type ContentPart =
  | { type: 'text'; value: string }
  | { type: 'math-display'; value: string }
  | { type: 'math-inline'; value: string }
  | { type: 'mermaid'; value: string }
  | { type: 'code'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'inline-code'; value: string };

function parseContent(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  // Combined regex to match all special patterns in order of priority
  const regex = /(\$\$[\s\S]*?\$\$)|(`{3}mermaid\n[\s\S]*?`{3})|(`{3}[\s\S]*?`{3})|(\$[^$\n]+?\$)|(\*\*[^*]+?\*\*)|(`[^`]+?`)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    // Add text before this match
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }

    const matched = match[0];

    if (match[1]) {
      // $$...$$ display math
      parts.push({ type: 'math-display', value: matched.slice(2, -2).trim() });
    } else if (match[2]) {
      // ```mermaid\n...\n```
      const inner = matched.replace(/^`{3}mermaid\n/, '').replace(/`{3}$/, '').trim();
      parts.push({ type: 'mermaid', value: inner });
    } else if (match[3]) {
      // ```...\n```  generic code block
      const inner = matched.replace(/^`{3}\w*\n?/, '').replace(/`{3}$/, '').trim();
      parts.push({ type: 'code', value: inner });
    } else if (match[4]) {
      // $...$ inline math
      parts.push({ type: 'math-inline', value: matched.slice(1, -1).trim() });
    } else if (match[5]) {
      // **...** bold
      parts.push({ type: 'bold', value: matched.slice(2, -2) });
    } else if (match[6]) {
      // `...` inline code
      parts.push({ type: 'inline-code', value: matched.slice(1, -1) });
    }

    lastIndex = match.index + matched.length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return parts;
}

function RenderKaTeX({ latex, displayMode }: { latex: string; displayMode: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        trust: false,
        strict: false,
      });
    } catch {
      return null;
    }
  }, [latex, displayMode]);

  if (!html) {
    return <code className="text-amber-400 bg-neutral-800 px-1 rounded text-xs">{latex}</code>;
  }

  if (displayMode) {
    return (
      <div
        className="my-2 overflow-x-auto text-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function MessageContent({ content }: { content: string }) {
  const parts = useMemo(() => parseContent(content), [content]);

  return (
    <div className="message-content">
      {parts.map((part, i) => {
        switch (part.type) {
          case 'text':
            return <span key={i} className="whitespace-pre-wrap">{part.value}</span>;
          case 'math-display':
            return <RenderKaTeX key={i} latex={part.value} displayMode />;
          case 'math-inline':
            return <RenderKaTeX key={i} latex={part.value} displayMode={false} />;
          case 'mermaid':
            return <MermaidDiagram key={i} chart={part.value} />;
          case 'code':
            return (
              <pre key={i} className="bg-neutral-800 rounded-lg p-3 text-xs text-neutral-300 overflow-x-auto my-2 leading-relaxed">
                <code>{part.value}</code>
              </pre>
            );
          case 'bold':
            return <strong key={i} className="font-semibold text-white">{part.value}</strong>;
          case 'inline-code':
            return <code key={i} className="bg-neutral-800 text-amber-400 px-1.5 py-0.5 rounded text-[0.85em]">{part.value}</code>;
          default:
            return null;
        }
      })}
    </div>
  );
}
