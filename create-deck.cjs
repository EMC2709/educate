const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Educate";
pres.title = "Educate - GCSE Revision Platform";

// Color palette
const BG_DARK = "0A0A14";
const BG_CARD = "14142A";
const INDIGO = "6C63FF";
const ROSE = "E94560";
const WHITE = "FFFFFF";
const GRAY = "888899";
const LIGHT_GRAY = "CCCCDD";
const GREEN = "10B981";
const AMBER = "F59E0B";

// ─── SLIDE 1: Title ──────────────────────────────────────────────
let s1 = pres.addSlide();
s1.background = { color: BG_DARK };
// Decorative shapes
s1.addShape(pres.shapes.OVAL, { x: -1.5, y: -1.5, w: 4, h: 4, fill: { color: INDIGO, transparency: 85 } });
s1.addShape(pres.shapes.OVAL, { x: 7.5, y: 3, w: 4, h: 4, fill: { color: ROSE, transparency: 85 } });
// Logo
s1.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 4.5, y: 0.8, w: 1, h: 1, fill: { color: INDIGO }, rectRadius: 0.15 });
s1.addText("E", { x: 4.5, y: 0.8, w: 1, h: 1, fontSize: 36, fontFace: "Arial Black", color: WHITE, align: "center", valign: "middle" });
// Title
s1.addText("Educate", { x: 0.5, y: 2.0, w: 9, h: 1, fontSize: 54, fontFace: "Arial Black", color: WHITE, align: "center", valign: "middle" });
s1.addText("The AI-Powered GCSE Revision Platform\nThat Actually Prepares Students for Exams", { x: 1, y: 3.0, w: 8, h: 1, fontSize: 18, fontFace: "Calibri", color: LIGHT_GRAY, align: "center", valign: "middle", lineSpacingMultiple: 1.3 });
s1.addShape(pres.shapes.LINE, { x: 3.5, y: 4.2, w: 3, h: 0, line: { color: INDIGO, width: 2 } });
s1.addText("Not just recall. Real understanding.", { x: 1, y: 4.5, w: 8, h: 0.6, fontSize: 14, fontFace: "Calibri", color: INDIGO, align: "center", italic: true });

// ─── SLIDE 2: The Problem ────────────────────────────────────────
let s2 = pres.addSlide();
s2.background = { color: BG_DARK };
s2.addText("The GCSE Revision Market is Broken", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, fontFace: "Arial Black", color: WHITE, align: "center", margin: 0 });

const problems = [
  { title: "Multiple Choice Trap", icon: "?", color: AMBER, desc: "95% of revision apps only test recall with MCQs. But 60%+ of GCSE marks come from extended written answers. Students score 90% on apps, then get Grade 5 in the real exam." },
  { title: "Burnout Culture", icon: "!", color: ROSE, desc: "Apps like Tassomai set punitive daily targets. Entire classes have abandoned it. Exam stress is at crisis levels among 15-16 year olds." },
  { title: "Paywall Rage", icon: "\u00A3", color: "FF6B6B", desc: "Quizlet has 84% one-star reviews on Trustpilot. Students feel betrayed when free features disappear behind paywalls. Parents hate surprise auto-renewals." },
];

problems.forEach((p, i) => {
  const x = 0.5 + i * 3.15;
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.4, w: 2.9, h: 3.6, fill: { color: BG_CARD }, rectRadius: 0.15, line: { color: p.color, width: 1, transparency: 70 } });
  s2.addShape(pres.shapes.OVAL, { x: x + 1.05, y: 1.7, w: 0.8, h: 0.8, fill: { color: p.color, transparency: 80 } });
  s2.addText(p.icon, { x: x + 1.05, y: 1.7, w: 0.8, h: 0.8, fontSize: 22, fontFace: "Arial Black", color: p.color, align: "center", valign: "middle" });
  s2.addText(p.title, { x: x + 0.2, y: 2.7, w: 2.5, h: 0.5, fontSize: 16, fontFace: "Arial Black", color: WHITE, align: "center", valign: "middle" });
  s2.addText(p.desc, { x: x + 0.2, y: 3.2, w: 2.5, h: 1.6, fontSize: 10, fontFace: "Calibri", color: GRAY, align: "center", valign: "top", lineSpacingMultiple: 1.4 });
});

// ─── SLIDE 3: The Solution ───────────────────────────────────────
let s3 = pres.addSlide();
s3.background = { color: BG_DARK };
s3.addText("Educate: Built Different", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 32, fontFace: "Arial Black", color: WHITE, align: "center", margin: 0 });
s3.addText("The only revision platform that tests understanding, not just memory", { x: 1, y: 1.0, w: 8, h: 0.4, fontSize: 13, fontFace: "Calibri", color: GRAY, align: "center" });

const features = [
  { title: "AI Extended Answer\nPractice", icon: "\u270D", color: INDIGO, desc: "The ONLY app that helps students practice 3, 6, and 8-mark written responses with instant AI marking and structured feedback." },
  { title: "Intelligent Diagrams\n& Math", icon: "\u03A3", color: GREEN, desc: "AI tutor generates real-time mathematical formulas and process diagrams. Not static images." },
  { title: "Wellbeing-First\nDesign", icon: "\u2665", color: ROSE, desc: "Break reminders, sustainable pacing, stress check-ins. We tell students 'you've done enough today.'" },
  { title: "24/7 AI Tutor", icon: "\u{1F9E0}", color: AMBER, desc: "A personal tutor that guides thinking with Socratic questioning. Adapts to each student's level." },
];

features.forEach((f, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.5 + col * 4.7;
  const y = 1.6 + row * 1.85;
  s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.4, h: 1.6, fill: { color: BG_CARD }, rectRadius: 0.12, line: { color: f.color, width: 1, transparency: 60 } });
  s3.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.35, w: 0.7, h: 0.7, fill: { color: f.color, transparency: 75 } });
  s3.addText(f.icon, { x: x + 0.25, y: y + 0.35, w: 0.7, h: 0.7, fontSize: 20, color: f.color, align: "center", valign: "middle" });
  s3.addText(f.title, { x: x + 1.15, y: y + 0.15, w: 3.0, h: 0.55, fontSize: 13, fontFace: "Arial Black", color: WHITE, valign: "middle", lineSpacingMultiple: 1.1 });
  s3.addText(f.desc, { x: x + 1.15, y: y + 0.75, w: 3.0, h: 0.7, fontSize: 9.5, fontFace: "Calibri", color: GRAY, valign: "top", lineSpacingMultiple: 1.35 });
});

// ─── SLIDE 4: Competitive Matrix ─────────────────────────────────
let s4 = pres.addSlide();
s4.background = { color: BG_DARK };
s4.addText("Feature Comparison", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 32, fontFace: "Arial Black", color: WHITE, align: "center", margin: 0 });

const YES = { text: "\u2713", options: { color: GREEN, bold: true, align: "center", fontSize: 11 } };
const NO = { text: "\u2717", options: { color: "FF4444", align: "center", fontSize: 11 } };
const PART = (t) => ({ text: t, options: { color: AMBER, align: "center", fontSize: 9 } });
const HDR = (t) => ({ text: t, options: { bold: true, color: WHITE, fontSize: 10, fill: { color: "1A1A3E" }, align: "center" } });
const ROW_LABEL = (t) => ({ text: t, options: { color: LIGHT_GRAY, fontSize: 9, fill: { color: BG_CARD } } });

const tableRows = [
  [HDR("Feature"), HDR("Educate"), HDR("Seneca"), HDR("Save My\nExams"), HDR("Tassomai"), HDR("BBC\nBitesize")],
  [ROW_LABEL("Extended answer practice"), YES, NO, NO, NO, NO],
  [ROW_LABEL("AI-powered marking"), YES, NO, PART("Basic"), NO, NO],
  [ROW_LABEL("AI tutor chat"), PART("Unlimited"), NO, NO, PART("1x/week"), NO],
  [ROW_LABEL("Live math & diagrams"), YES, NO, NO, NO, NO],
  [ROW_LABEL("Wellbeing features"), YES, NO, NO, NO, NO],
  [ROW_LABEL("Offline mode"), YES, NO, NO, NO, PART("Partial")],
  [ROW_LABEL("25+ GCSE subjects"), YES, YES, YES, PART("3 only"), YES],
  [ROW_LABEL("All 4 UK exam boards"), YES, YES, YES, PART("AQA only"), YES],
  [ROW_LABEL("Free tier with real value"), YES, PART("Limited"), PART("Limited"), NO, YES],
];

s4.addTable(tableRows, {
  x: 0.4, y: 1.2, w: 9.2,
  colW: [2.2, 1.2, 1.2, 1.2, 1.2, 1.2],
  rowH: [0.4, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35],
  border: { pt: 0.5, color: "2A2A4A" },
  fill: { color: BG_CARD },
  fontSize: 10,
  color: GRAY,
});

// ─── SLIDE 5: How It Works ───────────────────────────────────────
let s5 = pres.addSlide();
s5.background = { color: BG_DARK };
s5.addText("Revision That Actually Works", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 32, fontFace: "Arial Black", color: WHITE, align: "center", margin: 0 });

const steps = [
  { num: "1", title: "Choose Board\n& Subject", desc: "AQA, Edexcel, OCR\nor WJEC. 25+ subjects.", color: INDIGO },
  { num: "2", title: "Select\nTopics", desc: "Drill into specific\nsubtopics.", color: "8B5CF6" },
  { num: "3", title: "Practice", desc: "Short, mid, extended\nor flashcards.", color: AMBER },
  { num: "4", title: "Get AI\nFeedback", desc: "Instant marking with\nimprovement tips.", color: ROSE },
  { num: "5", title: "Track\nProgress", desc: "Strengths, weaknesses\n& focus areas.", color: GREEN },
];

steps.forEach((s, i) => {
  const x = 0.3 + i * 1.95;
  s5.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.5, w: 1.75, h: 3.2, fill: { color: BG_CARD }, rectRadius: 0.12, line: { color: s.color, width: 1, transparency: 60 } });
  s5.addShape(pres.shapes.OVAL, { x: x + 0.55, y: 1.8, w: 0.65, h: 0.65, fill: { color: s.color } });
  s5.addText(s.num, { x: x + 0.55, y: 1.8, w: 0.65, h: 0.65, fontSize: 22, fontFace: "Arial Black", color: WHITE, align: "center", valign: "middle" });
  s5.addText(s.title, { x: x + 0.1, y: 2.6, w: 1.55, h: 0.8, fontSize: 13, fontFace: "Arial Black", color: WHITE, align: "center", valign: "middle", lineSpacingMultiple: 1.1 });
  s5.addText(s.desc, { x: x + 0.1, y: 3.5, w: 1.55, h: 0.9, fontSize: 10, fontFace: "Calibri", color: GRAY, align: "center", lineSpacingMultiple: 1.3 });
  if (i < 4) {
    s5.addText("\u2192", { x: x + 1.7, y: 2.8, w: 0.3, h: 0.4, fontSize: 18, color: s.color, align: "center", valign: "middle" });
  }
});

// ─── SLIDE 6: For Schools ────────────────────────────────────────
let s6 = pres.addSlide();
s6.background = { color: BG_DARK };
s6.addText("Educate for Schools", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 32, fontFace: "Arial Black", color: WHITE, align: "center", margin: 0 });
s6.addText("Empower every student, support every teacher", { x: 1, y: 0.95, w: 8, h: 0.4, fontSize: 13, fontFace: "Calibri", color: GRAY, align: "center" });

const schoolFeatures = [
  { title: "Teacher Dashboard", desc: "Set assignments, track class progress, identify struggling students early. Export reports for parents' evenings.", color: INDIGO },
  { title: "Department-Wide\nLicensing", desc: "One price per student per year. All subjects, all boards. No per-subject upsells.", color: GREEN },
  { title: "Integration", desc: "Works alongside existing resources. Students use it at home AND in school. AI marking saves teacher time.", color: AMBER },
];

schoolFeatures.forEach((f, i) => {
  const x = 0.5 + i * 3.15;
  s6.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w: 2.9, h: 2.2, fill: { color: BG_CARD }, rectRadius: 0.12, line: { color: f.color, width: 1, transparency: 60 } });
  s6.addText(f.title, { x: x + 0.2, y: 1.8, w: 2.5, h: 0.55, fontSize: 14, fontFace: "Arial Black", color: WHITE, align: "center", valign: "middle" });
  s6.addText(f.desc, { x: x + 0.2, y: 2.4, w: 2.5, h: 1.2, fontSize: 10, fontFace: "Calibri", color: GRAY, align: "center", lineSpacingMultiple: 1.4 });
});

// Quote
s6.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 4.1, w: 8.4, h: 1.0, fill: { color: BG_CARD }, rectRadius: 0.1, line: { color: INDIGO, width: 1, transparency: 50 } });
s6.addText([
  { text: "Teachers spend 8+ hours per week marking. ", options: { italic: true, color: LIGHT_GRAY } },
  { text: "Educate's AI marking gives instant, detailed feedback", options: { italic: true, color: INDIGO, bold: true } },
  { text: " \u2014 freeing teachers to actually teach.", options: { italic: true, color: LIGHT_GRAY } },
], { x: 1.0, y: 4.15, w: 8.0, h: 0.9, fontSize: 11, fontFace: "Calibri", align: "center", valign: "middle" });

// ─── SLIDE 7: Pricing ───────────────────────────────────────────
let s7 = pres.addSlide();
s7.background = { color: BG_DARK };
s7.addText("Simple, Transparent Pricing", { x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 30, fontFace: "Arial Black", color: WHITE, align: "center", margin: 0 });
s7.addText("No hidden fees. No surprise renewals. No paywall traps.", { x: 1, y: 0.8, w: 8, h: 0.35, fontSize: 12, fontFace: "Calibri", color: GRAY, align: "center" });

const tiers = [
  {
    name: "Starter", price: "Free", period: "forever", color: GREEN, highlight: false,
    features: ["5 quiz sessions per day", "Full question bank (25+ subjects)", "Flashcards with spaced repetition", "Basic progress tracking"]
  },
  {
    name: "Pro", price: "\u00A34.99", period: "/month or \u00A339.99/year", color: INDIGO, highlight: true,
    features: ["Unlimited quiz sessions", "AI tutor chat (unlimited)", "AI answer marking & feedback", "Extended answer practice", "Smart study planner", "Offline mode"]
  },
  {
    name: "School", price: "\u00A32.49", period: "/student/year (min 30)", color: AMBER, highlight: false,
    features: ["Everything in Pro", "Teacher dashboard", "Class analytics & reports", "Parent summary emails", "Priority support", "Less than one revision guide"]
  },
];

tiers.forEach((t, i) => {
  const x = 0.4 + i * 3.2;
  const borderW = t.highlight ? 2 : 1;
  s7.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.35, w: 2.95, h: 3.8, fill: { color: BG_CARD }, rectRadius: 0.12, line: { color: t.color, width: borderW, transparency: t.highlight ? 0 : 60 } });
  if (t.highlight) {
    s7.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.6, y: 1.2, w: 1.75, h: 0.3, fill: { color: INDIGO }, rectRadius: 0.08 });
    s7.addText("MOST POPULAR", { x: x + 0.6, y: 1.2, w: 1.75, h: 0.3, fontSize: 8, fontFace: "Arial Black", color: WHITE, align: "center", valign: "middle" });
  }
  s7.addText(t.name, { x: x + 0.2, y: 1.55, w: 2.55, h: 0.4, fontSize: 18, fontFace: "Arial Black", color: t.color, align: "center", valign: "middle" });
  s7.addText(t.price, { x: x + 0.2, y: 1.95, w: 2.55, h: 0.5, fontSize: 28, fontFace: "Arial Black", color: WHITE, align: "center", valign: "middle" });
  s7.addText(t.period, { x: x + 0.2, y: 2.4, w: 2.55, h: 0.3, fontSize: 9, fontFace: "Calibri", color: GRAY, align: "center" });

  const featureTexts = t.features.map((f, fi) => ({
    text: "\u2713  " + f,
    options: { breakLine: fi < t.features.length - 1, color: LIGHT_GRAY, fontSize: 9.5, bullet: false }
  }));
  s7.addText(featureTexts, { x: x + 0.3, y: 2.85, w: 2.35, h: 2.1, fontFace: "Calibri", lineSpacingMultiple: 1.6, valign: "top" });
});

// ─── SLIDE 8: Market Opportunity ─────────────────────────────────
let s8 = pres.addSlide();
s8.background = { color: BG_DARK };
s8.addText("The Numbers", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 32, fontFace: "Arial Black", color: WHITE, align: "center", margin: 0 });

const stats = [
  { num: "750,000+", label: "GCSE students sit exams\neach year in England", color: INDIGO },
  { num: "\u00A32.1B", label: "UK EdTech\nmarket value", color: GREEN },
  { num: "73%", label: "of students use at least\none revision app", color: AMBER },
  { num: "3-5 apps", label: "average number each\nstudent uses", color: ROSE },
  { num: "0", label: "apps offer AI extended\nanswer practice", color: "FF6B6B" },
];

stats.forEach((st, i) => {
  const col = i < 3 ? i : i - 3;
  const row = i < 3 ? 0 : 1;
  const w = i < 3 ? 2.8 : 4.3;
  const x = i < 3 ? 0.6 + col * 3.1 : (i === 3 ? 0.6 : 5.2);
  const y = 1.3 + row * 2.0;
  s8.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 1.7, fill: { color: BG_CARD }, rectRadius: 0.12 });
  s8.addText(st.num, { x, y: y + 0.15, w, h: 0.8, fontSize: 36, fontFace: "Arial Black", color: st.color, align: "center", valign: "middle" });
  s8.addText(st.label, { x, y: y + 0.95, w, h: 0.6, fontSize: 11, fontFace: "Calibri", color: GRAY, align: "center", valign: "top", lineSpacingMultiple: 1.2 });
});

s8.addText("Educate is positioned to consolidate revision into one platform that actually prepares students for exams.", { x: 0.5, y: 5.0, w: 9, h: 0.4, fontSize: 11, fontFace: "Calibri", color: INDIGO, align: "center", italic: true });

// ─── SLIDE 9: Roadmap ───────────────────────────────────────────
let s9 = pres.addSlide();
s9.background = { color: BG_DARK };
s9.addText("Built and Ready", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 32, fontFace: "Arial Black", color: WHITE, align: "center", margin: 0 });

// Left panel - Live Now
s9.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 1.2, w: 4.4, h: 3.8, fill: { color: BG_CARD }, rectRadius: 0.12, line: { color: GREEN, width: 1, transparency: 50 } });
s9.addText("What's Live Now", { x: 0.6, y: 1.35, w: 4.0, h: 0.45, fontSize: 16, fontFace: "Arial Black", color: GREEN, margin: 0 });
const liveFeatures = ["Full platform with 25+ subjects, 4 exam boards", "Pre-built question bank with 500+ questions", "AI question generation & answer marking", "AI tutor chat with Socratic questioning", "KaTeX math rendering & Mermaid diagrams", "Mobile-responsive design"];
s9.addText(liveFeatures.map((f, i) => ({ text: "\u2713  " + f, options: { breakLine: i < liveFeatures.length - 1, color: LIGHT_GRAY, fontSize: 10 } })), { x: 0.7, y: 1.9, w: 3.9, h: 2.8, fontFace: "Calibri", lineSpacingMultiple: 1.7, valign: "top" });

// Right panel - Coming Soon
s9.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.2, y: 1.2, w: 4.4, h: 3.8, fill: { color: BG_CARD }, rectRadius: 0.12, line: { color: INDIGO, width: 1, transparency: 50 } });
s9.addText("Coming Soon (Q2-Q3 2026)", { x: 5.4, y: 1.35, w: 4.0, h: 0.45, fontSize: 16, fontFace: "Arial Black", color: INDIGO, margin: 0 });
const comingFeatures = ["Spaced repetition engine", "Smart study planner with exam countdown", "Offline PWA mode", "Teacher dashboard & school licensing", "Parent progress summaries", "Gamification (streaks, XP, leaderboards)", "Past paper integration"];
s9.addText(comingFeatures.map((f, i) => ({ text: "\u25CB  " + f, options: { breakLine: i < comingFeatures.length - 1, color: GRAY, fontSize: 10 } })), { x: 5.5, y: 1.9, w: 3.9, h: 2.8, fontFace: "Calibri", lineSpacingMultiple: 1.55, valign: "top" });

// ─── SLIDE 10: Call to Action ────────────────────────────────────
let s10 = pres.addSlide();
s10.background = { color: BG_DARK };
s10.addShape(pres.shapes.OVAL, { x: -1, y: -1, w: 4, h: 4, fill: { color: INDIGO, transparency: 88 } });
s10.addShape(pres.shapes.OVAL, { x: 7, y: 3, w: 4.5, h: 4.5, fill: { color: ROSE, transparency: 88 } });

s10.addText("Let's Transform\nGCSE Revision", { x: 0.5, y: 0.8, w: 9, h: 1.4, fontSize: 40, fontFace: "Arial Black", color: WHITE, align: "center", valign: "middle", lineSpacingMultiple: 1.1 });
s10.addText("Partner with us to give every student the AI tutor they deserve", { x: 1, y: 2.3, w: 8, h: 0.5, fontSize: 14, fontFace: "Calibri", color: LIGHT_GRAY, align: "center" });

const ctas = [
  { text: "Schools: Book a free pilot for your Year 10/11 students", color: INDIGO },
  { text: "Parents: Sign up for early access at educate.app", color: GREEN },
  { text: "Investors: Let's talk \u2014 hello@educate.app", color: AMBER },
];

ctas.forEach((c, i) => {
  s10.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.5, y: 3.1 + i * 0.6, w: 7, h: 0.45, fill: { color: BG_CARD }, rectRadius: 0.08, line: { color: c.color, width: 1, transparency: 50 } });
  s10.addText(c.text, { x: 1.7, y: 3.1 + i * 0.6, w: 6.6, h: 0.45, fontSize: 12, fontFace: "Calibri", color: c.color, align: "center", valign: "middle" });
});

s10.addShape(pres.shapes.LINE, { x: 3.5, y: 4.95, w: 3, h: 0, line: { color: INDIGO, width: 2 } });
s10.addText("Educate \u2014 Not just recall. Real understanding.", { x: 1, y: 5.05, w: 8, h: 0.4, fontSize: 13, fontFace: "Calibri", color: INDIGO, align: "center", italic: true });

// Write file
pres.writeFile({ fileName: "C:\\Users\\LAPTOP80\\Desktop\\educate\\Educate_Pitch_Deck.pptx" })
  .then(() => console.log("Pitch deck created successfully!"))
  .catch(err => console.error("Error:", err));
