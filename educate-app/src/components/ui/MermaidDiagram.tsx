'use client';

import { useEffect, useRef, useState } from 'react';

let mermaidInitialized = false;

export function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;

        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            themeVariables: {
              primaryColor: '#6c63ff',
              primaryTextColor: '#fff',
              primaryBorderColor: '#6c63ff',
              lineColor: '#888',
              secondaryColor: '#1a1a2e',
              tertiaryColor: '#222',
              fontFamily: 'Segoe UI, system-ui, sans-serif',
              fontSize: '14px',
              nodeBorder: '#6c63ff',
              mainBkg: '#1a1a2e',
              textColor: '#fff',
            },
          });
          mermaidInitialized = true;
        }

        const { svg: renderedSvg } = await mermaid.render(idRef.current, chart.trim());
        if (!cancelled) setSvg(renderedSvg);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <pre className="bg-neutral-800 rounded-lg p-3 text-xs text-neutral-400 overflow-x-auto my-2">
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="bg-neutral-800/50 rounded-lg p-4 my-2 flex items-center justify-center min-h-[80px]">
        <div className="w-5 h-5 border-2 border-neutral-600 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-3 p-3 bg-neutral-800/30 rounded-xl overflow-x-auto flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
