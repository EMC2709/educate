import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

const OUT = 'docs/educator-slides-plan.pdf';

// ── Colours ─────────────────────────────────────────────────────────────────
const C = {
  indigo:   '#6366f1',
  indigoDk: '#4338ca',
  rose:     '#f43f5e',
  amber:    '#f59e0b',
  emerald:  '#10b981',
  slate:    '#1e293b',
  slateLight: '#334155',
  muted:    '#64748b',
  light:    '#f8fafc',
  white:    '#ffffff',
  border:   '#e2e8f0',
  pagebg:   '#f8fafc',
};

// ── Bead colours for The Educator illustration ───────────────────────────────
const BEADS = ['#ef4444','#1d4ed8','#eab308','#f8fafc','#ef4444','#1d4ed8',
               '#eab308','#f8fafc','#ef4444','#1d4ed8','#eab308','#f8fafc',
               '#ef4444','#1d4ed8'];

await mkdir(dirname(OUT), { recursive: true });

const doc = new PDFDocument({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 }, autoFirstPage: false });
const stream = createWriteStream(OUT);
doc.pipe(stream);

const PW = 595.28;
const PH = 841.89;
const ML = 48;
const MR = 48;
const CW = PW - ML - MR;

// ── Helpers ──────────────────────────────────────────────────────────────────

function addPage(bgColor = C.white) {
  doc.addPage();
  doc.rect(0, 0, PW, PH).fill(bgColor);
}

function hline(y, color = C.border, width = 0.5) {
  doc.moveTo(ML, y).lineTo(PW - MR, y).lineWidth(width).strokeColor(color).stroke();
}

function sectionBadge(x, y, text, color) {
  const pad = 8;
  const w = doc.font('Helvetica-Bold').fontSize(8).widthOfString(text) + pad * 2;
  doc.roundedRect(x, y - 2, w, 16, 4).fill(color + '22');
  doc.fill(color).font('Helvetica-Bold').fontSize(8).text(text, x + pad, y + 1);
  return w;
}

function sectionHeader(title, sectionNum, y) {
  // Accent bar
  doc.rect(ML, y, 3, 22).fill(C.indigo);
  // Number badge
  doc.circle(ML + 18, y + 11, 11).fill(C.indigo);
  doc.fill(C.white).font('Helvetica-Bold').fontSize(9)
     .text(String(sectionNum), ML + 14, y + 7, { width: 8, align: 'center' });
  // Title
  doc.fill(C.slate).font('Helvetica-Bold').fontSize(13)
     .text(title, ML + 36, y + 4);
  return y + 32;
}

function bullet(text, x, y, color = C.indigo) {
  doc.circle(x + 4, y + 5, 2.5).fill(color);
  doc.fill(C.slateLight).font('Helvetica').fontSize(10)
     .text(text, x + 12, y, { width: CW - (x - ML) - 12, lineGap: 2 });
  return doc.y + 2;
}

function subheading(text, y) {
  doc.fill(C.indigo).font('Helvetica-Bold').fontSize(10).text(text, ML, y);
  return doc.y + 4;
}

function bodyText(text, x, y, opts = {}) {
  doc.fill(C.slateLight).font('Helvetica').fontSize(10)
     .text(text, x, y, { width: CW - (x - ML), lineGap: 2, ...opts });
  return doc.y + 4;
}

function tableRow(cols, y, header = false) {
  const colW = [220, 130, 180];
  let x = ML;
  cols.forEach((col, i) => {
    if (header) {
      doc.rect(x, y, colW[i], 20).fill(C.indigo + '18');
      doc.fill(C.indigo).font('Helvetica-Bold').fontSize(9).text(col, x + 6, y + 6, { width: colW[i] - 8 });
    } else {
      doc.rect(x, y, colW[i], 18).fill(i % 2 === 0 ? C.white : C.pagebg).strokeColor(C.border).lineWidth(0.3).stroke();
      doc.fill(C.slateLight).font('Helvetica').fontSize(9).text(col, x + 6, y + 5, { width: colW[i] - 8 });
    }
    x += colW[i];
  });
  return y + (header ? 20 : 18);
}

function drawEducator(cx, cy, scale = 1) {
  // Head
  doc.circle(cx, cy, 14 * scale).fill(C.white).strokeColor('#94a3b8').lineWidth(1).stroke();
  // Eyes
  doc.circle(cx - 4 * scale, cy - 3 * scale, 2 * scale).fill('#1e293b');
  doc.circle(cx + 4 * scale, cy - 3 * scale, 2 * scale).fill('#1e293b');
  // Smile
  doc.moveTo(cx - 4 * scale, cy + 3 * scale)
     .quadraticCurveTo(cx, cy + 7 * scale, cx + 4 * scale, cy + 3 * scale)
     .lineWidth(1.5 * scale).strokeColor('#1e293b').stroke();
  // Body beads
  const positions = [
    [0, 18],[3, 28],[-3, 38],[5, 47],[-4, 56],[6, 65],
    [-3, 74],[4, 83],[-5, 92],[5, 100],[-3, 109],[3, 118],[-4, 127],[4, 136],
  ];
  positions.forEach(([dx, dy], i) => {
    doc.circle(cx + dx * scale, cy + dy * scale, 7 * scale).fill(BEADS[i]).strokeColor('#ffffff').lineWidth(0.5).stroke();
  });
  // Arms (beads 5-6 level)
  doc.circle(cx - 16 * scale, cy + 65 * scale, 5 * scale).fill('#ef4444').strokeColor('#ffffff').lineWidth(0.5).stroke();
  doc.circle(cx + 18 * scale, cy + 60 * scale, 5 * scale).fill('#1d4ed8').strokeColor('#ffffff').lineWidth(0.5).stroke();
  doc.circle(cx - 24 * scale, cy + 58 * scale, 4 * scale).fill('#eab308').strokeColor('#ffffff').lineWidth(0.5).stroke();
  doc.circle(cx + 26 * scale, cy + 54 * scale, 4 * scale).fill('#eab308').strokeColor('#ffffff').lineWidth(0.5).stroke();
}

// ════════════════════════════════════════════════════════════════════════════
//  COVER PAGE
// ════════════════════════════════════════════════════════════════════════════

addPage(C.slate);

// Top gradient bar
doc.rect(0, 0, PW, 8).fill(C.indigo);

// Background pattern — subtle circles
for (let i = 0; i < 6; i++) {
  doc.circle(480 + i * 30, 120 + i * 40, 40 + i * 15)
     .lineWidth(1).strokeColor('#ffffff09').stroke();
}

// Bead character on cover
drawEducator(490, 250, 1.6);

// Title block
doc.fill(C.indigo).font('Helvetica-Bold').fontSize(11)
   .text('EDUCATE', ML, 130, { characterSpacing: 4 });

doc.fill(C.white).font('Helvetica-Bold').fontSize(34)
   .text('The Educator', ML, 150, { lineGap: 4 });

doc.fill(C.white).font('Helvetica-Bold').fontSize(28)
   .text('Slides Feature', ML, 192, { lineGap: 4 });

doc.moveTo(ML, 238).lineTo(ML + 180, 238).lineWidth(3).strokeColor(C.rose).stroke();

doc.fill('#94a3b8').font('Helvetica').fontSize(13)
   .text('Interactive Topic Slidepacks', ML, 250)
   .text('with Animated Character', ML, 268);

// Meta box
doc.roundedRect(ML, 320, 200, 70, 8).fill('#ffffff12');
const meta = [['Document', 'Educate Platform'], ['Date', 'April 2026'], ['Version', '1.0'], ['Status', 'Planning']];
meta.forEach(([k, v], i) => {
  doc.fill('#94a3b8').font('Helvetica').fontSize(9).text(k, ML + 14, 334 + i * 14);
  doc.fill(C.white).font('Helvetica-Bold').fontSize(9).text(v, ML + 80, 334 + i * 14);
});

// Bottom bar
doc.rect(0, PH - 40, PW, 40).fill(C.indigo + 'cc');
doc.fill(C.white).font('Helvetica').fontSize(9)
   .text('Confidential — Educate GCSE Revision Platform', ML, PH - 26);
doc.fill(C.white).font('Helvetica').fontSize(9)
   .text('Page 1', PW - 80, PH - 26, { width: 50, align: 'right' });

// ════════════════════════════════════════════════════════════════════════════
//  TABLE OF CONTENTS
// ════════════════════════════════════════════════════════════════════════════

addPage(C.pagebg);
doc.rect(0, 0, PW, 8).fill(C.indigo);

let y = 48;
doc.fill(C.slate).font('Helvetica-Bold').fontSize(22).text('Contents', ML, y); y += 36;
hline(y, C.indigo, 1.5); y += 16;

const toc = [
  ['01', 'Overview', 'What we are building and key goals'],
  ['02', 'The Educator Character', 'Design, colours, body structure and animations'],
  ['03', 'Data Architecture', 'Slide types, slidepack format and file structure'],
  ['04', 'Slide Content Structure', 'Per-slide template and volume estimates'],
  ['05', 'Slide Viewer UI', 'Desktop and mobile layouts, UI elements'],
  ['06', 'Narration System', 'Text bubble, TTS, and voice clone options'],
  ['07', 'Quiz Page Integration', 'Button placement and context passing'],
  ['08', 'Board Filtering', 'Shared vs board-specific content'],
  ['09', 'Phase Plan', 'Six phases across four weeks'],
  ['10', 'Key Risks & Mitigations', 'Risk register with guards'],
  ['11', 'Verification Checklist', 'Pre-launch checks'],
];

toc.forEach(([num, title, desc], i) => {
  const rowY = y + i * 46;
  doc.roundedRect(ML, rowY, CW, 40, 6)
     .fill(i % 2 === 0 ? C.white : '#f1f5f9');
  // Number
  doc.circle(ML + 22, rowY + 20, 14).fill(C.indigo + (i % 2 === 0 ? 'dd' : 'aa'));
  doc.fill(C.white).font('Helvetica-Bold').fontSize(10)
     .text(num, ML + 16, rowY + 15, { width: 12, align: 'center' });
  // Text
  doc.fill(C.slate).font('Helvetica-Bold').fontSize(11).text(title, ML + 46, rowY + 8);
  doc.fill(C.muted).font('Helvetica').fontSize(9).text(desc, ML + 46, rowY + 23);
  // Dots
  const dotX = ML + 46 + doc.widthOfString(title, { fontSize: 11 }) + 6;
  for (let d = 0; d < 30; d++) {
    const dx = dotX + d * 7;
    if (dx < PW - MR - 24) doc.circle(dx, rowY + 14, 1).fill(C.border);
  }
});

doc.rect(0, PH - 40, PW, 40).fill(C.indigo + 'cc');
doc.fill(C.white).font('Helvetica').fontSize(9).text('Educate — The Educator Slides Feature Plan', ML, PH - 26);
doc.fill(C.white).font('Helvetica').fontSize(9).text('Page 2', PW - 80, PH - 26, { width: 50, align: 'right' });

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 3 — OVERVIEW + EDUCATOR CHARACTER
// ════════════════════════════════════════════════════════════════════════════

addPage(C.white);
doc.rect(0, 0, PW, 8).fill(C.indigo);

y = 40;
y = sectionHeader('Overview', 1, y); y += 6;

y = subheading('What We Are Building', y);
y = bodyText(
  'An in-app interactive slide system — topic-specific slidepacks for every subject, board, and ' +
  'topic, with The Educator (an animated bead-chain character) floating alongside each slide and ' +
  'narrating the content. Accessible from a dedicated Slides button on the quiz page.',
  ML, y
);

y += 6;
y = subheading('Key Goals', y);
const goals = [
  'Topic-specific slidepacks — one per subtopic, not one per subject',
  'All 26 GCSE subjects across all 4 exam boards: AQA, Edexcel, OCR, WJEC',
  'The Educator character walks through each slide with narration',
  'Integrated directly into the existing quiz page flow',
  'Board-filtered content — AQA slides differ from Edexcel where specs differ',
  'Works on desktop (side-by-side) and mobile (stacked full-screen)',
];
goals.forEach(g => { y = bullet(g, ML, y); });

y += 12;
hline(y, C.border); y += 14;

y = sectionHeader('The Educator Character', 2, y); y += 6;

// Draw the character on this page
drawEducator(PW - 100, y + 20, 1.1);

y = subheading('Visual Design', y);
y = bodyText(
  'The Educator is built entirely in SVG — no image files. He is a friendly figure made of ' +
  '14 coloured beads arranged in a curved helix spine, with a large white circle head, ' +
  'simple cartoon eyes, and a smile arc.',
  ML, y, { width: CW - 90 }
);

y += 6;
y = subheading('Colour Palette', y);
const palette = [
  ['Red', '#ef4444'], ['Blue', '#1d4ed8'],
  ['Yellow', '#eab308'], ['White', '#f8fafc'],
];
palette.forEach(([name, hex]) => {
  doc.roundedRect(ML, y, 14, 14, 3).fill(hex).strokeColor(C.border).lineWidth(0.5).stroke();
  doc.fill(C.slateLight).font('Helvetica').fontSize(10).text(`${name}  ${hex}`, ML + 20, y + 2);
  y += 20;
});

y += 6;
y = subheading('Animation States', y);
const animations = [
  ['Idle', 'Gentle float up/down — CSS keyframes, continuous loop'],
  ['Talking', 'Mouth pulses open/closed, slight head tilt, torso beads pulse'],
  ['Pointing', 'Right arm beads extend outward toward the slide content'],
  ['Celebrate', 'Full body bounce and spin triggered on slide completion'],
  ['Walking', 'Slides across screen, beads ripple with 40ms staggered delays'],
];
animations.forEach(([state, desc]) => {
  doc.fill(C.indigo).font('Helvetica-Bold').fontSize(10).text(`${state}: `, ML, y, { continued: true });
  doc.fill(C.slateLight).font('Helvetica').fontSize(10).text(desc);
  y = doc.y + 3;
});

doc.rect(0, PH - 40, PW, 40).fill(C.indigo + 'cc');
doc.fill(C.white).font('Helvetica').fontSize(9).text('Educate — The Educator Slides Feature Plan', ML, PH - 26);
doc.fill(C.white).font('Helvetica').fontSize(9).text('Page 3', PW - 80, PH - 26, { width: 50, align: 'right' });

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 4 — DATA ARCHITECTURE + SLIDE CONTENT
// ════════════════════════════════════════════════════════════════════════════

addPage(C.white);
doc.rect(0, 0, PW, 8).fill(C.indigo);

y = 40;
y = sectionHeader('Data Architecture', 3, y); y += 6;

y = subheading('Slide Interface', y);
const slideFields = [
  ['id', 'string', 'Unique identifier'],
  ['title', 'string', 'Slide heading'],
  ['bullets', 'string[]', '3–5 bullet points per slide'],
  ['diagram', 'string (optional)', 'Mermaid code or SVG string'],
  ['imageUrl', 'string (optional)', 'URL for diagram or photo'],
  ['narration', 'string', 'What The Educator says on this slide'],
  ['speakerNote', 'string (optional)', 'Teacher-facing note'],
];
y = tableRow(['Field', 'Type', 'Description'], y, true);
slideFields.forEach(row => { y = tableRow(row, y); });

y += 12;
y = subheading('Slidepack Interface', y);
const packFields = [
  ['subject', 'string', 'e.g. Biology'],
  ['board', 'string', 'AQA | Edexcel | OCR | WJEC'],
  ['topic', 'string', 'e.g. Cell Biology'],
  ['subtopic', 'string', 'e.g. Cell Structure and Microscopy'],
  ['slides', 'Slide[]', '6–10 slides per subtopic'],
  ['color', 'string', 'Subject accent colour (hex)'],
  ['estimatedMinutes', 'number', 'Estimated time to complete'],
];
y = tableRow(['Field', 'Type', 'Description'], y, true);
packFields.forEach(row => { y = tableRow(row, y); });

y += 12;
y = subheading('File Structure', y);
doc.roundedRect(ML, y, CW, 90, 6).fill('#f1f5f9');
doc.fill(C.slateLight).font('Courier').fontSize(8.5).text(
  'src/data/slidepacks/\n' +
  '  biology/\n' +
  '    aqa/\n' +
  '      cell-biology--cell-structure.ts\n' +
  '      cell-biology--diffusion-osmosis.ts\n' +
  '    edexcel/  ocr/  wjec/\n' +
  '  chemistry/  physics/  mathematics/  ...(all 26 subjects)\n' +
  '  index.ts   ← getSlidepacks(subject, board, topic, subtopic)',
  ML + 12, y + 10, { lineGap: 3 }
);
y += 100;

hline(y, C.border); y += 14;
y = sectionHeader('Slide Content Structure', 4, y); y += 6;

y = subheading('Per-Slidepack Template (6–10 slides)', y);
const slideTemplate = [
  ['Slide 1', 'Title slide with learning objectives'],
  ['Slides 2–3', 'Core concept explanation with diagrams'],
  ['Slides 4–5', 'Key definitions and worked examples'],
  ['Slides 6–7', 'Required practicals or calculations (where applicable)'],
  ['Slide 8', 'Common exam mistakes students make'],
  ['Slide 9', 'Exam-style practice question'],
  ['Slide 10', 'Key points recap and summary'],
];
slideTemplate.forEach(([slide, desc]) => {
  doc.fill(C.indigo).font('Helvetica-Bold').fontSize(10).text(`${slide}: `, ML, y, { continued: true });
  doc.fill(C.slateLight).font('Helvetica').fontSize(10).text(desc);
  y = doc.y + 3;
});

y += 8;
y = subheading('Volume Estimate', y);
const volumes = [
  'Sciences (Bio/Chem/Phys): 15 topics x 4 subtopics x 4 boards = 240 slidepacks x 8 slides = ~1,920 slides',
  'All 26 subjects x avg 12 subtopics x 4 boards = ~1,248 slidepacks total',
  'Estimated total slides across full platform: ~10,000 slides',
  'Generation: AI batch-generated from spec bullet points, then human-reviewed before going live',
];
volumes.forEach(v => { y = bullet(v, ML, y); });

doc.rect(0, PH - 40, PW, 40).fill(C.indigo + 'cc');
doc.fill(C.white).font('Helvetica').fontSize(9).text('Educate — The Educator Slides Feature Plan', ML, PH - 26);
doc.fill(C.white).font('Helvetica').fontSize(9).text('Page 4', PW - 80, PH - 26, { width: 50, align: 'right' });

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 5 — SLIDE VIEWER UI + NARRATION
// ════════════════════════════════════════════════════════════════════════════

addPage(C.white);
doc.rect(0, 0, PW, 8).fill(C.indigo);

y = 40;
y = sectionHeader('Slide Viewer UI', 5, y); y += 8;

// Mock UI wireframe
const wfX = ML; const wfY = y; const wfW = CW; const wfH = 160;
doc.roundedRect(wfX, wfY, wfW, wfH, 8).fill('#f8fafc').strokeColor(C.border).lineWidth(1).stroke();
// Header bar
doc.roundedRect(wfX, wfY, wfW, 26, 4).fill(C.indigo + '22');
doc.fill(C.indigo).font('Helvetica-Bold').fontSize(9)
   .text('Cell Structure & Microscopy', wfX + 12, wfY + 9);
doc.fill(C.muted).font('Helvetica').fontSize(8).text('2 / 8', wfX + wfW - 70, wfY + 9);
doc.fill(C.rose).font('Helvetica-Bold').fontSize(9).text('✕', wfX + wfW - 30, wfY + 9);
// Left panel — educator
doc.roundedRect(wfX + 8, wfY + 34, 110, 108, 6).fill('#f1f5f9');
drawEducator(wfX + 63, wfY + 56, 0.42);
// Speech bubble
doc.roundedRect(wfX + 8, wfY + 110, 110, 26, 5).fill(C.white).strokeColor(C.indigo + '44').lineWidth(0.8).stroke();
doc.fill(C.slateLight).font('Helvetica').fontSize(6.5)
   .text('"The nucleus controls all cell activity..."', wfX + 12, wfY + 117, { width: 100 });
// Right panel — slide
doc.fill(C.slate).font('Helvetica-Bold').fontSize(9).text('Cell Structure', wfX + 130, wfY + 38);
[
  'Animal cells: nucleus, membrane, cytoplasm',
  'Plant cells also have cell wall, chloroplasts',
  'Bacteria are prokaryotic — no nucleus',
].forEach((b, i) => {
  doc.circle(wfX + 138, wfY + 56 + i * 16, 2).fill(C.indigo);
  doc.fill(C.slateLight).font('Helvetica').fontSize(8)
     .text(b, wfX + 144, wfY + 51 + i * 16, { width: wfW - 150 });
});
// Bottom nav
doc.rect(wfX, wfY + wfH - 22, wfW, 22).fill(C.indigo + '11');
doc.fill(C.indigo).font('Helvetica-Bold').fontSize(8)
   .text('◀ Prev', wfX + 14, wfY + wfH - 15);
doc.roundedRect(wfX + 90, wfY + wfH - 16, 320, 7, 3).fill(C.border);
doc.roundedRect(wfX + 90, wfY + wfH - 16, 80, 7, 3).fill(C.indigo);
doc.fill(C.indigo).font('Helvetica-Bold').fontSize(8)
   .text('Next ▶', wfX + wfW - 60, wfY + wfH - 15);
y = wfY + wfH + 14;

y = subheading('UI Elements', y);
const uiItems = [
  'Subject colour-coded header with topic and subtopic name',
  'Slide counter (e.g. 2 of 8) and progress bar',
  'Previous and Next navigation buttons (keyboard: ← →)',
  'Auto-advance timer option (5 seconds per slide, configurable)',
  'Mute button to silence voice narration',
  'Fullscreen toggle and close button (keyboard: Escape)',
  'Mobile: stacked layout — slide above, The Educator avatar below',
];
uiItems.forEach(item => { y = bullet(item, ML, y); });

y += 10; hline(y, C.border); y += 14;
y = sectionHeader('Narration System', 6, y); y += 6;

const narrationModes = [
  {
    title: 'Text Bubble (Default — Free)',
    color: C.emerald,
    points: [
      'Narration text in speech bubble beside The Educator',
      'Auto-advances on configurable timer',
      'No API cost — available to all users including free tier',
    ],
  },
  {
    title: 'AI Voice (Premium)',
    color: C.indigo,
    points: [
      'Text passed to OpenAI TTS or ElevenLabs API',
      'Audio plays while talking animation runs',
      'Mouth animation syncs to audio playback',
      'Signed-in users only',
    ],
  },
];
narrationModes.forEach(mode => {
  doc.roundedRect(ML, y, CW, 62, 6).fill(mode.color + '0d').strokeColor(mode.color + '33').lineWidth(1).stroke();
  sectionBadge(ML + 10, y + 8, mode.title, mode.color);
  let py = y + 26;
  mode.points.forEach(p => { py = bullet(p, ML + 10, py, mode.color); });
  y += 68;
});

y += 4;
y = subheading('Voice Options Compared', y);
y = tableRow(['Option', 'Quality', 'Cost'], y, true);
const voices = [
  ['Browser speechSynthesis', 'Basic / Robotic', 'Free — built in'],
  ['OpenAI TTS', 'High quality, 6 voices', '~0.001p per slide'],
  ['ElevenLabs Voice Clone', 'Most natural, cloned voice', 'From $5/month'],
];
voices.forEach(row => { y = tableRow(row, y); });

doc.rect(0, PH - 40, PW, 40).fill(C.indigo + 'cc');
doc.fill(C.white).font('Helvetica').fontSize(9).text('Educate — The Educator Slides Feature Plan', ML, PH - 26);
doc.fill(C.white).font('Helvetica').fontSize(9).text('Page 5', PW - 80, PH - 26, { width: 50, align: 'right' });

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 6 — QUIZ INTEGRATION + BOARD FILTERING + PHASE PLAN
// ════════════════════════════════════════════════════════════════════════════

addPage(C.white);
doc.rect(0, 0, PW, 8).fill(C.indigo);

y = 40;
y = sectionHeader('Quiz Page Integration', 7, y); y += 6;

y = bodyText(
  'A "Slides" button appears in the quiz page header alongside the existing Change Topics button. ' +
  'Clicking it opens the SlideViewer modal pre-loaded with context from the active quiz session.',
  ML, y
);

y += 4;
// Context box
doc.roundedRect(ML, y, CW, 58, 6).fill('#f1f5f9');
doc.fill(C.indigo).font('Helvetica-Bold').fontSize(9).text('Context passed to SlideViewer', ML + 12, y + 10);
const ctxItems = [
  'Subject — from the URL (e.g. Biology)',
  'Board — from the URL (e.g. AQA)',
  'Topic — from sessionStorage (e.g. Cell Biology)',
  'Subtopic — from sessionStorage (e.g. Cell Structure and Microscopy)',
];
ctxItems.forEach((item, i) => {
  doc.fill(C.slateLight).font('Helvetica').fontSize(9).text(`• ${item}`, ML + 20, y + 24 + i * 10);
});
y += 68;

y = bodyText(
  'If no slidepack exists for that subtopic, The Educator shows a Coming Soon state. Students can ' +
  'view slides mid-quiz as a revision aid, or review them after getting an answer wrong.',
  ML, y
);

y += 10; hline(y, C.border); y += 14;
y = sectionHeader('Board Filtering', 8, y); y += 6;

y = subheading('Subjects requiring board-specific slides', y);
const boardSpecific = [
  'English Literature — different set texts per board',
  'History — different depth studies and periods per board',
  'Geography — different required named case studies per board',
  'Religious Studies — different faith combinations per board',
];
boardSpecific.forEach(b => { y = bullet(b, ML, y, C.rose); });

y += 6;
y = subheading('Subjects shared across boards (minor label differences only)', y);
const shared = ['Biology, Chemistry, Physics', 'Mathematics', 'Modern Languages (grammar core is identical)'];
shared.forEach(b => { y = bullet(b, ML, y, C.emerald); });

y += 10; hline(y, C.border); y += 14;
y = sectionHeader('Phase Plan', 9, y); y += 6;

const phases = [
  { num: '1', title: 'Foundation', period: 'Week 1', color: C.indigo,
    items: ['Create slides.ts types and slidepack index helper', 'Build TheEducator.tsx SVG component (all animation states)', 'Build SlideViewer.tsx modal and SlideCard.tsx renderer', 'Add Slides button to quiz page header'] },
  { num: '2', title: 'The Educator Component', period: 'Week 1–2', color: C.rose,
    items: ['SVG body: 14 named circle elements in helix pattern', 'CSS keyframes: idle, talking, pointing, celebrate, walking', 'Staggered animation-delay per bead for wave effect', 'State prop with smooth transitions, tested all screen sizes'] },
  { num: '3', title: 'Slide Viewer UI', period: 'Week 2', color: C.amber,
    items: ['Keyboard navigation (arrows, Escape)', 'Responsive: side-by-side desktop, stacked mobile', 'Mermaid diagram rendering inside slides', 'Auto-advance timer with pause/resume'] },
  { num: '4', title: 'Content Generation', period: 'Week 2–4', color: C.emerald,
    items: ['Priority 1: Combined Science (48 slidepacks)', 'Priority 2: Biology, Chemistry, Physics', 'Priority 3: Mathematics', 'Remaining 23 subjects in batches'] },
  { num: '5', title: 'Narration System', period: 'Week 3', color: '#8b5cf6',
    items: ['Text bubble narration (default, free, no API)', 'OpenAI TTS API route /api/narrate', 'Mouth animation sync to audio.currentTime', 'Mute toggle persisted to localStorage'] },
  { num: '6', title: 'Board Filtering & Polish', period: 'Week 4', color: '#06b6d4',
    items: ['Board-aware slidepack lookup', 'Coming Soon state for missing slidepacks', 'Smooth modal animations, ARIA labels', 'Reduced motion support (prefers-reduced-motion)'] },
];

phases.forEach(phase => {
  if (y > PH - 160) {
    doc.rect(0, PH - 40, PW, 40).fill(C.indigo + 'cc');
    doc.fill(C.white).font('Helvetica').fontSize(9).text('Educate — The Educator Slides Feature Plan', ML, PH - 26);
    doc.fill(C.white).font('Helvetica').fontSize(9).text('Page 6', PW - 80, PH - 26, { width: 50, align: 'right' });
    addPage(C.white);
    doc.rect(0, 0, PW, 8).fill(C.indigo);
    y = 40;
  }
  const phH = 58;
  doc.roundedRect(ML, y, CW, phH, 6).fill(phase.color + '0d').strokeColor(phase.color + '33').lineWidth(1).stroke();
  doc.circle(ML + 20, y + 16, 12).fill(phase.color);
  doc.fill(C.white).font('Helvetica-Bold').fontSize(9)
     .text(phase.num, ML + 16, y + 12, { width: 8, align: 'center' });
  doc.fill(phase.color).font('Helvetica-Bold').fontSize(10)
     .text(phase.title, ML + 38, y + 8, { continued: true });
  doc.fill(C.muted).font('Helvetica').fontSize(9).text(`  ${phase.period}`);
  const mid = CW / 2 + ML;
  phase.items.forEach((item, i) => {
    const col = i < 2 ? ML + 38 : mid;
    const row = i < 2 ? y + 22 + i * 14 : y + 22 + (i - 2) * 14;
    doc.circle(col + 4, row + 5, 2).fill(phase.color);
    doc.fill(C.slateLight).font('Helvetica').fontSize(8.5)
       .text(item, col + 10, row, { width: mid - ML - 50 });
  });
  y += phH + 8;
});

doc.rect(0, PH - 40, PW, 40).fill(C.indigo + 'cc');
doc.fill(C.white).font('Helvetica').fontSize(9).text('Educate — The Educator Slides Feature Plan', ML, PH - 26);
doc.fill(C.white).font('Helvetica').fontSize(9).text('Page 6', PW - 80, PH - 26, { width: 50, align: 'right' });

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 7 — RISKS + VERIFICATION CHECKLIST
// ════════════════════════════════════════════════════════════════════════════

addPage(C.white);
doc.rect(0, 0, PW, 8).fill(C.indigo);

y = 40;
y = sectionHeader('Key Risks & Mitigations', 10, y); y += 6;

const risks = [
  { risk: 'Massive content volume (26 subjects x 4 boards)', guard: 'Generate Sciences first, ship Phase 1, expand iteratively. Never block launch on completeness.' },
  { risk: 'AI-generated slides contain factual inaccuracies', guard: 'Human review pass required before going live. Unreviewed slides flagged with a warning badge.' },
  { risk: 'TTS voice sounds too robotic for daily use', guard: 'Text bubble is always the fallback. Voice is opt-in. ElevenLabs clone for premium users.' },
  { risk: 'Slidepack not yet available for a topic', guard: 'Graceful Coming Soon state. The Educator appears and says slides are being added soon.' },
  { risk: 'Mobile layout too cramped for side-by-side', guard: 'Stacked layout under 768px. The Educator becomes a small floating avatar rather than a full panel.' },
  { risk: 'Students skip slides and go straight to quiz', guard: 'Optional prompt after wrong answer — The Educator asks: "Want me to explain this topic?"' },
];

risks.forEach(({ risk, guard }) => {
  const rH = 44;
  doc.roundedRect(ML, y, CW, rH, 6).fill('#fff7ed').strokeColor('#f59e0b44').lineWidth(1).stroke();
  doc.roundedRect(ML, y, 3, rH, 2).fill(C.amber);
  doc.fill(C.slate).font('Helvetica-Bold').fontSize(9).text('Risk: ', ML + 10, y + 8, { continued: true });
  doc.fill(C.slateLight).font('Helvetica').fontSize(9).text(risk);
  doc.fill(C.emerald).font('Helvetica-Bold').fontSize(9).text('Guard: ', ML + 10, y + 24, { continued: true });
  doc.fill(C.slateLight).font('Helvetica').fontSize(9).text(guard, { width: CW - 20 });
  y += rH + 6;
});

y += 10; hline(y, C.border); y += 14;
y = sectionHeader('Verification Checklist', 11, y); y += 8;

const checks = [
  'The Educator renders all 5 animation states correctly on desktop and mobile',
  'Slides load for Biology / AQA / Cell Biology / Cell Structure with correct narration',
  'Slides button opens the correct subtopic slidepack based on current quiz context',
  'Board filter shows AQA vs Edexcel content correctly where specs differ',
  'Text bubble narration auto-advances through all slides on the timer',
  'TTS narration plays in sync with The Educator talking animation',
  'Keyboard navigation works: arrow keys for prev/next, Escape to close',
  'Mobile stacked layout renders correctly at 375px and 390px screen widths',
  'Coming Soon state displays correctly for subtopics with no slides yet',
  'Closing and reopening the viewer remembers the last slide position in session',
];

checks.forEach((check, i) => {
  doc.roundedRect(ML, y, 18, 18, 3).fill(C.white).strokeColor(C.indigo + '66').lineWidth(1).stroke();
  doc.fill(C.muted).font('Helvetica').fontSize(8).text(String(i + 1).padStart(2, '0'), ML + 5, y + 5);
  doc.fill(C.slateLight).font('Helvetica').fontSize(10).text(check, ML + 26, y + 4, { width: CW - 30 });
  y = doc.y + 6;
});

// Back cover-style footer
y += 16;
doc.roundedRect(ML, y, CW, 60, 8).fill(C.indigo + '0d').strokeColor(C.indigo + '22').lineWidth(1).stroke();
doc.fill(C.indigo).font('Helvetica-Bold').fontSize(11).text('Ready to build?', ML + 20, y + 14);
doc.fill(C.slateLight).font('Helvetica').fontSize(9)
   .text('The Educator feature will make Educate the only GCSE revision platform with a named,\nanimated mascot that personally guides students through every topic.', ML + 20, y + 30, { width: CW - 40 });

doc.rect(0, PH - 40, PW, 40).fill(C.indigo + 'cc');
doc.fill(C.white).font('Helvetica').fontSize(9).text('Educate — The Educator Slides Feature Plan', ML, PH - 26);
doc.fill(C.white).font('Helvetica').fontSize(9).text('Page 7', PW - 80, PH - 26, { width: 50, align: 'right' });

// ── Finalise ──────────────────────────────────────────────────────────────────
doc.end();
await new Promise((res, rej) => { stream.on('finish', res); stream.on('error', rej); });
console.log('PDF saved to', OUT);
