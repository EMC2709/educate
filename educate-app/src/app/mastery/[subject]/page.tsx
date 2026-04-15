'use client';

import { useState, useEffect, useMemo, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { SUBJECT_TOPICS, TopicNode } from '@/data/topic-map';
import { SUBJECT_TOPICS_MAP } from '@/data/subject-topics';

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': '#a78bfa', 'English Language': '#f472b6', 'English Literature': '#ec4899',
  'Biology': '#4ade80', 'Chemistry': '#fb923c', 'Physics': '#60a5fa',
  'Combined Science': '#38bdf8', 'History': '#fbbf24', 'Geography': '#a3e635',
  'French': '#f87171', 'Spanish': '#fb7185', 'Computer Science': '#22d3ee',
  'Business Studies': '#2dd4bf', 'Psychology': '#c084fc', 'Sociology': '#f472b6',
  'Religious Studies': '#fcd34d', 'Economics': '#34d399', 'Music': '#e879f9',
  'Drama': '#fb7185', 'Art & Design': '#f59e0b', 'Design & Technology': '#facc15',
  'Food Preparation & Nutrition': '#fb923c', 'Physical Education': '#38bdf8',
};

// Subject-specific scene cards — 4 scenes per subject
const SUBJECT_SCENES: Record<string, { emojis: string[]; label: string }[]> = {
  'Geography':                    [{ emojis:['🏔️','🌋','🏕️'], label:'Landscapes'    }, { emojis:['🌊','🏞️','⛵'], label:'Rivers & Coasts'}, { emojis:['🌦️','🌡️','🌪️'], label:'Climate'       }, { emojis:['🏙️','🌐','🗺️'], label:'Urban Worlds'  }],
  'Physics':                      [{ emojis:['⚡','🔋','💡'],  label:'Electricity'    }, { emojis:['🌊','📡','🎵'],  label:'Waves'         }, { emojis:['🚀','🌍','🪐'],  label:'Forces & Space'}, { emojis:['☢️','💥','⚛️'],  label:'Nuclear'       }],
  'Biology':                      [{ emojis:['🌿','🧬','🔬'],  label:'Cells'          }, { emojis:['🦋','🦠','🌱'],  label:'Organisms'     }, { emojis:['❤️','🩺','🩸'],  label:'Human Body'    }, { emojis:['🌍','♻️','🐸'],  label:'Ecology'       }],
  'Chemistry':                    [{ emojis:['⚗️','🧪','🔥'],  label:'Reactions'      }, { emojis:['⚛️','🧲','💎'],  label:'Atomic Theory' }, { emojis:['🌿','🧴','🧼'],  label:'Organic'       }, { emojis:['🏭','🌡️','⚡'],  label:'Industrial'    }],
  'Mathematics':                  [{ emojis:['📐','📏','🔺'],  label:'Geometry'       }, { emojis:['📊','📈','💹'],  label:'Statistics'    }, { emojis:['🔢','✖️','➕'],  label:'Algebra'       }, { emojis:['♾️','🎯','🔣'],  label:'Advanced Maths'}],
  'History':                      [{ emojis:['🏛️','⚔️','📜'],  label:'Ancient Worlds' }, { emojis:['⚓','🗡️','🏰'],  label:'Medieval'      }, { emojis:['📰','💣','✈️'],  label:'Modern War'    }, { emojis:['🌍','🕊️','🏗️'],  label:'Post-War World'}],
  'English Language':             [{ emojis:['📝','✒️','📖'],  label:'Reading'        }, { emojis:['🗞️','📰','✉️'],  label:'Writing'       }, { emojis:['🎤','💬','📢'],  label:'Speaking'      }, { emojis:['📚','🖊️','💭'],  label:'Analysis'      }],
  'English Literature':           [{ emojis:['📚','🎭','🖊️'],  label:'Drama'          }, { emojis:['🏰','⚔️','❤️'],  label:'Shakespeare'   }, { emojis:['🌊','🌿','🦋'],  label:'Poetry'        }, { emojis:['🌙','⭐','✨'],  label:'Themes'        }],
  'Computer Science':             [{ emojis:['💻','⌨️','🖥️'],  label:'Hardware'       }, { emojis:['🤖','🧠','⚙️'],  label:'Algorithms'    }, { emojis:['🌐','📡','🔗'],  label:'Networks'      }, { emojis:['🔐','🛡️','🔑'],  label:'Cybersecurity' }],
  'Business Studies':             [{ emojis:['📈','💰','🏢'],  label:'Business Basics'}, { emojis:['🤝','📋','💼'],  label:'Management'    }, { emojis:['🏪','🛒','📦'],  label:'Marketing'     }, { emojis:['🌐','✈️','💹'],  label:'Global Business'}],
  'Economics':                    [{ emojis:['💹','📊','🏦'],  label:'Markets'        }, { emojis:['⚖️','🌍','📉'],  label:'Macro'         }, { emojis:['🏭','👷','⛏️'],  label:'Production'    }, { emojis:['💰','🔄','📈'],  label:'Finance'       }],
  'Psychology':                   [{ emojis:['🧠','💭','🔬'],  label:'The Brain'      }, { emojis:['😊','😢','😡'],  label:'Emotion'       }, { emojis:['👶','👧','👴'],  label:'Development'   }, { emojis:['🛋️','📋','💊'],  label:'Mental Health' }],
  'Sociology':                    [{ emojis:['👥','🏘️','🌍'],  label:'Society'        }, { emojis:['⚖️','✊','🏛️'],  label:'Inequality'    }, { emojis:['📊','📰','📺'],  label:'Media'         }, { emojis:['🌱','♻️','🤝'],  label:'Social Change' }],
  'Religious Studies':            [{ emojis:['🕌','✝️','☪️'],  label:'World Faiths'   }, { emojis:['📖','🙏','🕍'],  label:'Sacred Texts'  }, { emojis:['⛩️','☮️','☯️'],  label:'Beliefs'       }, { emojis:['🕊️','❤️','🌍'],  label:'Ethics'        }],
  'French':                       [{ emojis:['🗼','🥐','🇫🇷'], label:'Culture'        }, { emojis:['🍷','🧀','🥖'],  label:'Food & Life'   }, { emojis:['🎨','🎭','🗺️'],  label:'Arts'          }, { emojis:['🚄','🏖️','💐'],  label:'Travel'        }],
  'Spanish':                      [{ emojis:['🏖️','⛪','🇪🇸'], label:'Culture'        }, { emojis:['🥘','🍊','💃'],  label:'Food & Dance'  }, { emojis:['⚽','🐂','🌞'],  label:'Sport & Sun'   }, { emojis:['🎸','🌴','🏔️'],  label:'Landscapes'    }],
  'German':                       [{ emojis:['🏰','🍺','🇩🇪'], label:'Culture'        }, { emojis:['⚙️','🚗','🏭'],  label:'Industry'      }, { emojis:['🎼','🎻','🎺'],  label:'Music'         }, { emojis:['🌲','⛰️','❄️'],  label:'Nature'        }],
  'Music':                        [{ emojis:['🎵','🎸','🎹'],  label:'Instruments'    }, { emojis:['🎺','🥁','🎻'],  label:'Orchestra'     }, { emojis:['🎤','🎙️','🎼'],  label:'Performance'   }, { emojis:['🎧','🎶','🎵'],  label:'Theory'        }],
  'Drama':                        [{ emojis:['🎭','🎬','🎪'],  label:'Performance'    }, { emojis:['🎤','💡','🎟️'],  label:'Production'    }, { emojis:['😂','😭','😱'],  label:'Emotion'       }, { emojis:['🏟️','👏','⭐'],  label:'Theatre'       }],
  'Art & Design':                 [{ emojis:['🎨','🖌️','✏️'],  label:'Drawing'        }, { emojis:['🖼️','🏺','🗿'],  label:'Fine Art'      }, { emojis:['📷','🎞️','✂️'],  label:'Photography'   }, { emojis:['🌈','💡','⭐'],  label:'Design'        }],
  'Design & Technology':          [{ emojis:['🔧','⚙️','🛠️'],  label:'Engineering'    }, { emojis:['💡','📐','🖥️'],  label:'Design'        }, { emojis:['🏗️','🔩','⚡'],  label:'Construction'  }, { emojis:['🚗','✈️','🤖'],  label:'Innovation'    }],
  'Food Preparation & Nutrition': [{ emojis:['🍽️','👨‍🍳','🥘'], label:'Cooking'        }, { emojis:['🥗','🍎','🥦'],  label:'Nutrition'     }, { emojis:['🔥','🧑‍🍳','⏱️'], label:'Methods'       }, { emojis:['🌾','🐄','🚜'],  label:'Food Science'  }],
  'Physical Education':           [{ emojis:['⚽','🏃','🏋️'],  label:'Sport'          }, { emojis:['🏊','🚴','🤸'],  label:'Fitness'       }, { emojis:['🏆','🥇','🎯'],  label:'Performance'   }, { emojis:['💪','❤️','🍎'],  label:'Health'        }],
  'Combined Science':             [{ emojis:['🧬','⚗️','⚡'],  label:'Science Basics' }, { emojis:['🔭','🌍','⚛️'],  label:'Space & Atoms' }, { emojis:['🧪','💡','🌡️'],  label:'Experiments'   }, { emojis:['🦠','🌿','🔬'],  label:'Life Science'  }],
};
const DEFAULT_SCENES = [
  { emojis: ['📚', '🎯', '⭐'], label: 'Study' },
  { emojis: ['💡', '🔬', '🧪'], label: 'Explore' },
  { emojis: ['🏆', '✅', '🌟'], label: 'Achieve' },
  { emojis: ['🧠', '📝', '🎓'], label: 'Master' },
];

type MasteryLevel = 'not-started' | 'learning' | 'reviewing' | 'mastered';
const MASTERY_META: Record<MasteryLevel, { label: string; color: string; emoji: string }> = {
  'not-started': { label: 'Locked',    color: '#525252', emoji: '🔒' },
  'learning':    { label: 'Learning',  color: '#f87171', emoji: '🌱' },
  'reviewing':   { label: 'Reviewing', color: '#fbbf24', emoji: '🔄' },
  'mastered':    { label: 'Mastered',  color: '#4ade80', emoji: '⭐' },
};

function getTopicMastery(subject: string, topicId: string): MasteryLevel {
  try {
    const raw = localStorage.getItem('educate-quiz-scores');
    if (raw) {
      const scores: Record<string, { correct: number; total: number }> = JSON.parse(raw);
      const data = scores[`${subject}:${topicId}`];
      if (data && data.total > 0) {
        const acc = data.correct / data.total;
        if (acc >= 0.9) return 'mastered';
        if (acc >= 0.7) return 'reviewing';
        return 'learning';
      }
    }
  } catch {}
  return 'not-started';
}

interface FlatTopic extends TopicNode {
  group: string;
  mastery: MasteryLevel;
}

// ── Snake layout constants ────────────────────────────────────────────────────
const ROW_H = 220;
const Y_START = 100;
const TURN_BULGE = 70;
// Width of each side-panel column (desktop only)
const SIDE_COL_W = 172;
// Large side panel card dimensions
const PANEL_W = 160;
const PANEL_H = 150;

function getNodePositions(perRow: number, canvasW: number) {
  const leftPad = 64;
  const rightPad = 64;
  const span = canvasW - leftPad - rightPad;
  return Array.from({ length: perRow }, (_, i) =>
    leftPad + (perRow === 1 ? span / 2 : (i / (perRow - 1)) * span)
  );
}

function buildSnakePath(
  nodes: { x: number; y: number }[],
  perRow: number,
  canvasW: number,
): string {
  if (nodes.length === 0) return '';
  const nodeXs = getNodePositions(perRow, canvasW);
  const leftX = nodeXs[0];
  const rightX = nodeXs[nodeXs.length - 1];

  let d = `M ${nodes[0].x} ${nodes[0].y}`;

  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const prevRow = Math.floor((i - 1) / perRow);
    const currRow = Math.floor(i / perRow);

    if (prevRow === currRow) {
      const mx = (prev.x + curr.x) / 2;
      d += ` C ${mx} ${prev.y - 15}, ${mx} ${curr.y - 15}, ${curr.x} ${curr.y}`;
    } else {
      const isRightTurn = prevRow % 2 === 0;
      const cx = isRightTurn ? rightX + TURN_BULGE : leftX - TURN_BULGE;
      d += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
  }
  return d;
}

export default function MasteryPathwayPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectParam } = use(params);
  const subject = decodeURIComponent(subjectParam);
  const color = SUBJECT_COLORS[subject] || '#6366f1';
  const scenes = SUBJECT_SCENES[subject] || DEFAULT_SCENES;

  const router = useRouter();
  const [board, setBoard] = useState('');
  const [selected, setSelected] = useState<FlatTopic | null>(null);
  const [tick, setTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasW, setCanvasW] = useState(480);

  const perRow = canvasW < 360 ? 2 : canvasW < 520 ? 3 : 4;
  const nodeR = canvasW < 360 ? 28 : 34;

  useEffect(() => {
    const obs = new ResizeObserver(([e]) => setCanvasW(e.contentRect.width));
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const resolveQuizSelection = (topicName: string) => {
    const map = SUBJECT_TOPICS_MAP[subject];
    if (!map) return null;
    const lower = topicName.toLowerCase();
    for (const [topic, subs] of Object.entries(map)) {
      const hit = subs.find(s => s.toLowerCase() === lower);
      if (hit) return { topic, sub: hit };
    }
    for (const [topic, subs] of Object.entries(map)) {
      const hit = subs.find(s => s.toLowerCase().includes(lower) || lower.includes(s.toLowerCase()));
      if (hit) return { topic, sub: hit };
    }
    return null;
  };

  const launchQuiz = (type: 'flashcard' | 'short') => {
    if (!selected || !board) return;
    const match = resolveQuizSelection(selected.name);
    try {
      if (match) {
        sessionStorage.setItem('educate-selected-subtopics', JSON.stringify({ [`${match.topic}||${match.sub}`]: true }));
        sessionStorage.setItem('educate-selected-topics', JSON.stringify({}));
      } else {
        sessionStorage.removeItem('educate-selected-subtopics');
        sessionStorage.removeItem('educate-selected-topics');
      }
    } catch {}
    router.push(`/${board}/${encodeURIComponent(subject)}/quiz?type=${type}`);
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem('educate-user-subjects');
      if (cached) {
        const subs = JSON.parse(cached);
        const found = subs.find((s: { subject: string }) => s.subject === subject);
        if (found) setBoard(found.board);
      }
    } catch {}
  }, [subject]);

  const flatTopics: FlatTopic[] = useMemo(() => {
    const groups = SUBJECT_TOPICS[subject] || [];
    return groups.flatMap(g => g.topics.map(t => ({ ...t, group: g.name, mastery: getTopicMastery(subject, t.id) })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, tick]);

  useEffect(() => {
    const onStorage = () => setTick(t => t + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const stats = useMemo(() => {
    const total = flatTopics.length;
    const mastered = flatTopics.filter(t => t.mastery === 'mastered').length;
    return { total, mastered, pct: total ? Math.round((mastered / total) * 100) : 0 };
  }, [flatTopics]);

  // Build positioned nodes — first topic always unlocked
  const nodeXs = getNodePositions(perRow, canvasW);
  const positioned = flatTopics.map((topic, idx) => {
    const rowIdx = Math.floor(idx / perRow);
    const colIdx = idx % perRow;
    const isRTL = rowIdx % 2 === 1;
    const xArr = isRTL ? [...nodeXs].reverse() : nodeXs;
    const x = xArr[colIdx] ?? xArr[xArr.length - 1];
    const y = Y_START + rowIdx * ROW_H;
    // Unlock the first topic so users can jump straight in
    const mastery: MasteryLevel =
      idx === 0 && topic.mastery === 'not-started' ? 'learning' : topic.mastery;
    return { topic: { ...topic, mastery }, x, y, seq: idx + 1, rowIdx, colIdx };
  });

  const numRows = positioned.length > 0 ? Math.floor((flatTopics.length - 1) / perRow) + 1 : 0;
  const totalHeight = Y_START + numRows * ROW_H + 60;

  const pathD = buildSnakePath(positioned.map(p => ({ x: p.x, y: p.y })), perRow, canvasW);

  // Small U-turn cards (stay inside canvas)
  const sceneCards = Array.from({ length: Math.max(0, numRows - 1) }, (_, i) => {
    const y1 = Y_START + i * ROW_H;
    const y2 = Y_START + (i + 1) * ROW_H;
    const midY = (y1 + y2) / 2;
    const isRight = i % 2 === 0;
    const scene = scenes[i % scenes.length];
    return { midY, isRight, scene };
  });

  // Large side panels (shown in the flanking columns on desktop)
  const leftPanels  = sceneCards.filter(c => !c.isRight);
  const rightPanels = sceneCards.filter(c =>  c.isRight);

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a0a' }}>
      <Sidebar />
      <div className="flex-1 overflow-y-auto pb-20 md:pb-8">

        {/* ── Sticky header ── */}
        <div
          className="sticky top-0 z-20 border-b border-neutral-800 px-4 sm:px-6 py-3"
          style={{ backgroundColor: '#0a0a0aee', backdropFilter: 'blur(12px)' }}
        >
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Link href="/mastery" className="text-neutral-400 hover:text-white text-sm no-underline flex items-center gap-1.5 shrink-0">
              ← Back
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-extrabold text-white m-0 truncate">{subject}</h1>
              <p className="text-[10px] text-neutral-500 m-0">{stats.mastered}/{stats.total} mastered · {stats.pct}%</p>
            </div>
            <div className="w-20 bg-neutral-800 rounded-full h-2 shrink-0 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${stats.pct}%`, backgroundColor: color }} />
            </div>
          </div>
        </div>

        {flatTopics.length === 0 ? (
          <div className="max-w-xl mx-auto p-8 text-center">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10">
              <span className="text-4xl block mb-3">🚧</span>
              <p className="text-neutral-400 m-0">Pathway for {subject} is coming soon.</p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4">

            {/* ── Legend ── */}
            <div className="flex gap-3 justify-center flex-wrap mb-6">
              {Object.entries(MASTERY_META).map(([k, m]) => (
                <div key={k} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: m.color }}>
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>

            {/* ── Three-column layout: left panels | snake | right panels ── */}
            <div className="flex items-start gap-3">

              {/* LEFT side panels (desktop only) */}
              <div
                className="hidden lg:block relative shrink-0"
                style={{ width: SIDE_COL_W, height: totalHeight }}
              >
                {leftPanels.map((card, i) => (
                  <div
                    key={i}
                    className="absolute rounded-2xl flex flex-col items-center justify-center gap-2 select-none"
                    style={{
                      top: card.midY - PANEL_H / 2,
                      right: 8,
                      width: PANEL_W,
                      height: PANEL_H,
                      background: `linear-gradient(145deg, ${color}22, ${color}0a)`,
                      border: `1.5px solid ${color}40`,
                      boxShadow: `0 8px 32px ${color}18, inset 0 1px 0 ${color}20`,
                    }}
                  >
                    {/* Arrow pointing right toward path */}
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rotate-45 border-r-2 border-t-2 rounded-sm"
                      style={{ backgroundColor: '#0a0a0a', borderColor: `${color}40` }}
                    />
                    <div className="flex gap-1 text-4xl leading-none">
                      {card.scene.emojis.map((e, j) => (
                        <span key={j} className="drop-shadow-lg">{e}</span>
                      ))}
                    </div>
                    <span
                      className="text-[11px] font-bold uppercase tracking-widest text-center px-2"
                      style={{ color: `${color}bb` }}
                    >
                      {card.scene.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* ── Snake canvas ── */}
              <div
                ref={containerRef}
                className="flex-1 relative min-w-0"
                style={{ height: totalHeight }}
              >
                {/* Background glow */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-3xl opacity-5"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}, transparent 70%)` }}
                />

                {/* SVG path */}
                <svg
                  className="absolute inset-0 w-full overflow-visible pointer-events-none"
                  style={{ height: totalHeight }}
                  viewBox={`0 0 ${canvasW} ${totalHeight}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id={`pg-${subject}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={color} stopOpacity="0.3" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <path d={pathD} fill="none" stroke="#1a1a1a" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={pathD} fill="none" stroke="#2a2a2a" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 8" />
                  <path d={pathD} fill="none" stroke={`url(#pg-${subject})`} strokeWidth="5"
                    strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
                </svg>

                {/* ── Small U-turn scene chips (inside canvas at bends) ── */}
                {sceneCards.map(({ midY, isRight, scene }, i) => {
                  const chipW = 90;
                  const chipH = 70;
                  const turnX = isRight ? nodeXs[nodeXs.length - 1] + TURN_BULGE : nodeXs[0] - TURN_BULGE;
                  const left = Math.max(2, Math.min(canvasW - chipW - 2, turnX - chipW / 2));
                  return (
                    <div
                      key={i}
                      className="absolute rounded-xl flex flex-col items-center justify-center gap-0.5 pointer-events-none select-none"
                      style={{
                        left,
                        top: midY - chipH / 2,
                        width: chipW,
                        height: chipH,
                        background: `linear-gradient(135deg, ${color}14, ${color}06)`,
                        border: `1px solid ${color}25`,
                      }}
                    >
                      <div className="flex gap-0.5 text-lg leading-none">
                        {scene.emojis.map((e, j) => <span key={j}>{e}</span>)}
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: `${color}80` }}>
                        {scene.label}
                      </span>
                    </div>
                  );
                })}

                {/* ── Topic nodes ── */}
                {positioned.map(({ topic, x, y, seq }) => {
                  const meta = MASTERY_META[topic.mastery];
                  const isSelected = selected?.id === topic.id;
                  const isFirst = seq === 1;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelected(isSelected ? null : topic)}
                      className="absolute flex flex-col items-center cursor-pointer group border-none bg-transparent p-0"
                      style={{ left: x, top: y, transform: 'translate(-50%, -50%)', zIndex: 10 }}
                    >
                      {/* "Start here" label for first unlocked node */}
                      {isFirst && (
                        <div
                          className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest whitespace-nowrap px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}50` }}
                        >
                          ▶ Start Here
                        </div>
                      )}
                      {/* Circle */}
                      <div
                        className="rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                        style={{
                          width: nodeR * 2,
                          height: nodeR * 2,
                          background: topic.mastery === 'not-started'
                            ? 'radial-gradient(circle, #1c1c1c, #111)'
                            : `radial-gradient(circle, ${meta.color}30, ${meta.color}10)`,
                          border: `3px solid ${meta.color}`,
                          boxShadow: isSelected
                            ? `0 0 0 4px ${meta.color}50, 0 0 20px ${meta.color}60`
                            : isFirst
                              ? `0 0 18px ${meta.color}60, 0 0 36px ${meta.color}30`
                              : `0 0 12px ${meta.color}30`,
                        }}
                      >
                        <span className="text-lg leading-none select-none">{meta.emoji}</span>
                      </div>
                      {/* Sequence badge */}
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black"
                        style={{ backgroundColor: meta.color, color: '#000' }}
                      >
                        {seq}
                      </div>
                      {/* Label */}
                      <span
                        className="mt-2 text-[10px] font-semibold text-center leading-tight select-none"
                        style={{
                          maxWidth: nodeR * 2 + 20,
                          color: isSelected ? '#fff' : '#a3a3a3',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' as const,
                          overflow: 'hidden',
                        }}
                      >
                        {topic.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* RIGHT side panels (desktop only) */}
              <div
                className="hidden lg:block relative shrink-0"
                style={{ width: SIDE_COL_W, height: totalHeight }}
              >
                {rightPanels.map((card, i) => (
                  <div
                    key={i}
                    className="absolute rounded-2xl flex flex-col items-center justify-center gap-2 select-none"
                    style={{
                      top: card.midY - PANEL_H / 2,
                      left: 8,
                      width: PANEL_W,
                      height: PANEL_H,
                      background: `linear-gradient(145deg, ${color}22, ${color}0a)`,
                      border: `1.5px solid ${color}40`,
                      boxShadow: `0 8px 32px ${color}18, inset 0 1px 0 ${color}20`,
                    }}
                  >
                    {/* Arrow pointing left toward path */}
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-l-2 border-b-2 rounded-sm"
                      style={{ backgroundColor: '#0a0a0a', borderColor: `${color}40` }}
                    />
                    <div className="flex gap-1 text-4xl leading-none">
                      {card.scene.emojis.map((e, j) => (
                        <span key={j} className="drop-shadow-lg">{e}</span>
                      ))}
                    </div>
                    <span
                      className="text-[11px] font-bold uppercase tracking-widest text-center px-2"
                      style={{ color: `${color}bb` }}
                    >
                      {card.scene.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>{/* end three-column flex */}

            {/* ── Detail drawer ── */}
            {selected && (
              <div
                className="sticky bottom-4 mt-6 mx-auto max-w-md rounded-2xl p-5 shadow-2xl border"
                style={{
                  backgroundColor: '#111',
                  borderColor: `${color}50`,
                  boxShadow: `0 8px 40px ${color}25`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wide m-0 mb-0.5">{selected.group}</p>
                    <h3 className="text-base font-bold text-white m-0 truncate">{selected.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-neutral-500 hover:text-white text-xl leading-none cursor-pointer bg-transparent border-0 ml-3 shrink-0"
                  >×</button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${MASTERY_META[selected.mastery].color}20`, color: MASTERY_META[selected.mastery].color }}
                  >
                    {MASTERY_META[selected.mastery].emoji} {MASTERY_META[selected.mastery].label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => launchQuiz('short')}
                    className="text-center text-xs font-bold py-2.5 rounded-xl text-white cursor-pointer border-0 transition-opacity hover:opacity-90"
                    style={{ backgroundColor: color }}
                  >🎯 Quiz</button>
                  <button
                    onClick={() => launchQuiz('flashcard')}
                    className="text-center text-xs font-bold py-2.5 rounded-xl text-white bg-neutral-800 border border-neutral-700 cursor-pointer hover:bg-neutral-700 transition-colors"
                  >📚 Flashcards</button>
                </div>
                {!resolveQuizSelection(selected.name) && (
                  <p className="text-[9px] text-neutral-600 text-center mt-2 mb-0">Will study the whole subject.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <MobileNav />
    </div>
  );
}
