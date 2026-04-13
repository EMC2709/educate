// ── Types ────────────────────────────────────────────────────────────────────

export interface YearPaper {
  year: string;       // "2024", "2023", etc.
  session: string;    // "June 2024", "November 2023"
  qpUrl: string;      // Question paper PDF URL
  msUrl: string;      // Mark scheme PDF URL
}

export interface PaperEntry {
  number: 1 | 2 | 3;
  title: string;
  description: string;
  duration?: string;
  marks?: number;
  tiered?: boolean;           // Has Foundation/Higher variants
  pmtSubject: string;         // PMT CDN subject key
  pmtBoard: string;           // PMT CDN board key
  pmtPaper: string;           // PMT CDN paper folder (without tier suffix)
  years: string[];            // Available June years
  novemberYears?: string[];   // Available November years
}

export interface BoardPastPapers {
  papers: PaperEntry[];
  officialUrl: string;
}

// ── PMT URL Builder ──────────────────────────────────────────────────────────

const PMT_BASE = 'https://pmt.physicsandmathstutor.com/download';

export function buildPdfUrl(
  pmtSubject: string,
  pmtBoard: string,
  pmtPaper: string,
  type: 'QP' | 'MS',
  session: string,
  tier?: 'H' | 'F',
): string {
  const paperFolder = tier ? `${pmtPaper}${tier}` : pmtPaper;
  return `${PMT_BASE}/${pmtSubject}/GCSE/Past-Papers/${pmtBoard}/${paperFolder}/${type}/${encodeURIComponent(session)} ${type}.pdf`;
}

/** Get all year papers for a paper entry */
export function getYearPapers(paper: PaperEntry, tier?: 'H' | 'F'): YearPaper[] {
  const result: YearPaper[] = [];
  for (const y of paper.years) {
    const session = `June ${y}`;
    result.push({
      year: y,
      session,
      qpUrl: buildPdfUrl(paper.pmtSubject, paper.pmtBoard, paper.pmtPaper, 'QP', session, paper.tiered ? (tier ?? 'H') : undefined),
      msUrl: buildPdfUrl(paper.pmtSubject, paper.pmtBoard, paper.pmtPaper, 'MS', session, paper.tiered ? (tier ?? 'H') : undefined),
    });
  }
  if (paper.novemberYears) {
    for (const y of paper.novemberYears) {
      const session = `November ${y}`;
      result.push({
        year: `Nov ${y}`,
        session,
        qpUrl: buildPdfUrl(paper.pmtSubject, paper.pmtBoard, paper.pmtPaper, 'QP', session, paper.tiered ? (tier ?? 'H') : undefined),
        msUrl: buildPdfUrl(paper.pmtSubject, paper.pmtBoard, paper.pmtPaper, 'MS', session, paper.tiered ? (tier ?? 'H') : undefined),
      });
    }
  }
  return result;
}

// ── Common year ranges ───────────────────────────────────────────────────────

const MATHS_YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];
const MATHS_NOV = ['2024', '2023', '2022', '2019', '2018', '2017'];
const SCI_YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018'];
const ENG_YEARS = ['2024', '2023', '2022', '2020', '2019', '2018', '2017'];
const ENG_NOV = ['2024', '2023', '2022', '2021', '2019', '2018', '2017'];
const HUM_YEARS = ['2024', '2023', '2022', '2021', '2020', '2019'];
const LANG_YEARS = ['2024', '2023', '2022', '2019', '2018'];
const OTHER_YEARS = ['2024', '2023', '2022', '2021', '2020', '2019'];

// ── Index ────────────────────────────────────────────────────────────────────

export const PAST_PAPERS_INDEX: Record<string, Record<string, BoardPastPapers>> = {

  // ─── MATHEMATICS ──────────────────────────────────────────────────────────────
  'Mathematics': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Non-Calculator', description: 'No calculator allowed. Covers all areas of the specification.', duration: '1hr 30min', marks: 80, tiered: true, pmtSubject: 'Maths', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: MATHS_YEARS, novemberYears: MATHS_NOV },
        { number: 2, title: 'Paper 2: Calculator', description: 'Calculator allowed. Covers all areas of the specification.', duration: '1hr 30min', marks: 80, tiered: true, pmtSubject: 'Maths', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: MATHS_YEARS, novemberYears: MATHS_NOV },
        { number: 3, title: 'Paper 3: Calculator', description: 'Calculator allowed. Covers all areas of the specification.', duration: '1hr 30min', marks: 80, tiered: true, pmtSubject: 'Maths', pmtBoard: 'AQA', pmtPaper: 'Paper-3', years: MATHS_YEARS, novemberYears: MATHS_NOV },
      ],
    },
    Edexcel: {
      officialUrl: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/mathematics-2015.html',
      papers: [
        { number: 1, title: 'Paper 1: Non-Calculator', description: 'No calculator allowed. All content areas assessed.', duration: '1hr 30min', marks: 80, tiered: true, pmtSubject: 'Maths', pmtBoard: 'Edexcel', pmtPaper: 'Paper-1', years: MATHS_YEARS, novemberYears: MATHS_NOV },
        { number: 2, title: 'Paper 2: Calculator', description: 'Calculator allowed. All content areas assessed.', duration: '1hr 30min', marks: 80, tiered: true, pmtSubject: 'Maths', pmtBoard: 'Edexcel', pmtPaper: 'Paper-2', years: MATHS_YEARS, novemberYears: MATHS_NOV },
        { number: 3, title: 'Paper 3: Calculator', description: 'Calculator allowed. All content areas assessed.', duration: '1hr 30min', marks: 80, tiered: true, pmtSubject: 'Maths', pmtBoard: 'Edexcel', pmtPaper: 'Paper-3', years: MATHS_YEARS, novemberYears: MATHS_NOV },
      ],
    },
    OCR: {
      officialUrl: 'https://www.ocr.org.uk/qualifications/gcse/mathematics-j560-from-2015/assessment/',
      papers: [
        { number: 1, title: 'Paper 1: Non-Calculator', description: 'No calculator. Pure and applied mathematics.', duration: '1hr 30min', marks: 100, tiered: true, pmtSubject: 'Maths', pmtBoard: 'OCR', pmtPaper: 'Paper-1', years: MATHS_YEARS },
        { number: 2, title: 'Paper 2: Calculator', description: 'Calculator allowed. Pure and applied mathematics.', duration: '1hr 30min', marks: 100, tiered: true, pmtSubject: 'Maths', pmtBoard: 'OCR', pmtPaper: 'Paper-2', years: MATHS_YEARS },
        { number: 3, title: 'Paper 3: Calculator', description: 'Calculator allowed. Pure and applied mathematics.', duration: '1hr 30min', marks: 100, tiered: true, pmtSubject: 'Maths', pmtBoard: 'OCR', pmtPaper: 'Paper-3', years: MATHS_YEARS },
      ],
    },
  },

  // ─── ENGLISH LANGUAGE ─────────────────────────────────────────────────────────
  'English Language': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/english/gcse/english-language-8700/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Explorations in Creative Reading and Writing', description: 'Reading a fiction extract + creative writing task.', duration: '1hr 45min', marks: 80, pmtSubject: 'English-Language', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: ENG_YEARS, novemberYears: ENG_NOV },
        { number: 2, title: "Paper 2: Writers' Viewpoints and Perspectives", description: 'Reading two non-fiction texts + writing to present a viewpoint.', duration: '1hr 45min', marks: 80, pmtSubject: 'English-Language', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: ENG_YEARS, novemberYears: ENG_NOV },
      ],
    },
    Edexcel: {
      officialUrl: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/english-language-2015.html',
      papers: [
        { number: 1, title: 'Paper 1: Fiction and Imaginative Writing', description: 'Reading a fiction text + imaginative writing task.', duration: '1hr 45min', marks: 80, pmtSubject: 'English-Language', pmtBoard: 'Edexcel', pmtPaper: 'Paper-1', years: ENG_YEARS },
        { number: 2, title: 'Paper 2: Non-fiction and Transactional Writing', description: 'Reading two non-fiction texts + transactional writing.', duration: '2hr 5min', marks: 96, pmtSubject: 'English-Language', pmtBoard: 'Edexcel', pmtPaper: 'Paper-2', years: ENG_YEARS },
      ],
    },
  },

  // ─── ENGLISH LITERATURE ───────────────────────────────────────────────────────
  'English Literature': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/english/gcse/english-literature-8702/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Shakespeare and the 19th-century Novel', description: 'Essay on Shakespeare play + essay on 19th century prose text.', duration: '1hr 45min', marks: 64, pmtSubject: 'English-Literature', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: ENG_YEARS },
        { number: 2, title: 'Paper 2: Modern Texts and Poetry', description: 'Modern prose/drama essay + poetry anthology + unseen poem.', duration: '2hr 15min', marks: 96, pmtSubject: 'English-Literature', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: ENG_YEARS },
      ],
    },
    Edexcel: {
      officialUrl: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/english-literature-2015.html',
      papers: [
        { number: 1, title: 'Paper 1: Shakespeare and Post-1914 Literature', description: 'Shakespeare play + post-1914 British play or novel.', duration: '1hr 45min', marks: 80, pmtSubject: 'English-Literature', pmtBoard: 'Edexcel', pmtPaper: 'Paper-1', years: ENG_YEARS },
        { number: 2, title: 'Paper 2: 19th-century Novel and Poetry', description: '19th-century novel + poetry anthology + unseen poetry.', duration: '2hr 15min', marks: 80, pmtSubject: 'English-Literature', pmtBoard: 'Edexcel', pmtPaper: 'Paper-2', years: ENG_YEARS },
      ],
    },
  },

  // ─── BIOLOGY ──────────────────────────────────────────────────────────────────
  'Biology': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/science/gcse/biology-8461/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Cell Biology, Organisation, Infection, Bioenergetics', description: 'Topics 1-4. Multiple choice, short and long answer questions.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Biology', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: SCI_YEARS },
        { number: 2, title: 'Paper 2: Homeostasis, Inheritance, Ecology', description: 'Topics 5-7. Multiple choice, short and long answer questions.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Biology', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: SCI_YEARS },
      ],
    },
    Edexcel: {
      officialUrl: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/biology-2016.html',
      papers: [
        { number: 1, title: 'Paper 1: Key Concepts, Cells, Genes, Health', description: 'Topics 1-5. Multiple choice and open response.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Biology', pmtBoard: 'Edexcel', pmtPaper: 'Paper-1', years: SCI_YEARS },
        { number: 2, title: 'Paper 2: Plant, Animal, Ecosystems, Evolution', description: 'Topics 1, 6-9. Multiple choice and open response.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Biology', pmtBoard: 'Edexcel', pmtPaper: 'Paper-2', years: SCI_YEARS },
      ],
    },
  },

  // ─── CHEMISTRY ────────────────────────────────────────────────────────────────
  'Chemistry': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/science/gcse/chemistry-8462/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Atomic Structure, Bonding, Quantitative, Chemical Changes, Energy', description: 'Topics 1-5.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Chemistry', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: SCI_YEARS },
        { number: 2, title: 'Paper 2: Rates, Organic, Analysis, Atmosphere, Resources', description: 'Topics 6-10.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Chemistry', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: SCI_YEARS },
      ],
    },
    Edexcel: {
      officialUrl: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/chemistry-2016.html',
      papers: [
        { number: 1, title: 'Paper 1: Key Concepts, States, Chemical Changes, Extracting', description: 'Topics 1-5.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Chemistry', pmtBoard: 'Edexcel', pmtPaper: 'Paper-1', years: SCI_YEARS },
        { number: 2, title: 'Paper 2: Groups, Rates, Fuels, Earth, Atmosphere', description: 'Topics 1, 6-9.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Chemistry', pmtBoard: 'Edexcel', pmtPaper: 'Paper-2', years: SCI_YEARS },
      ],
    },
  },

  // ─── PHYSICS ──────────────────────────────────────────────────────────────────
  'Physics': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/science/gcse/physics-8463/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Energy, Electricity, Particles, Atomic Structure', description: 'Topics 1-4.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Physics', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: SCI_YEARS },
        { number: 2, title: 'Paper 2: Forces, Waves, Magnetism, Space', description: 'Topics 5-8.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Physics', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: SCI_YEARS },
      ],
    },
    Edexcel: {
      officialUrl: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/physics-2016.html',
      papers: [
        { number: 1, title: 'Paper 1: Key Concepts, Motion, Conservation, Waves, Light', description: 'Topics 1-5.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Physics', pmtBoard: 'Edexcel', pmtPaper: 'Paper-1', years: SCI_YEARS },
        { number: 2, title: 'Paper 2: Energy, Magnetism, Particles, Space', description: 'Topics 1, 6-15.', duration: '1hr 45min', marks: 100, tiered: true, pmtSubject: 'Physics', pmtBoard: 'Edexcel', pmtPaper: 'Paper-2', years: SCI_YEARS },
      ],
    },
  },

  // ─── COMBINED SCIENCE ─────────────────────────────────────────────────────────
  'Combined Science': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/science/gcse/combined-science-trilogy-8464/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Biology 1', description: 'Cell biology, organisation, infection, bioenergetics.', duration: '1hr 15min', marks: 70, tiered: true, pmtSubject: 'Combined-Science', pmtBoard: 'AQA', pmtPaper: 'Biology-Paper-1', years: SCI_YEARS },
        { number: 2, title: 'Paper 2: Chemistry 1', description: 'Atomic structure, bonding, quantitative, chemical changes.', duration: '1hr 15min', marks: 70, tiered: true, pmtSubject: 'Combined-Science', pmtBoard: 'AQA', pmtPaper: 'Chemistry-Paper-1', years: SCI_YEARS },
        { number: 3, title: 'Paper 3: Physics 1', description: 'Energy, electricity, particle model, atomic structure.', duration: '1hr 15min', marks: 70, tiered: true, pmtSubject: 'Combined-Science', pmtBoard: 'AQA', pmtPaper: 'Physics-Paper-1', years: SCI_YEARS },
      ],
    },
  },

  // ─── GEOGRAPHY ────────────────────────────────────────────────────────────────
  'Geography': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/geography/gcse/geography-8035/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Living with the Physical Environment', description: 'Natural hazards, ecosystems, physical landscapes.', duration: '1hr 30min', marks: 88, pmtSubject: 'Geography', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: HUM_YEARS },
        { number: 2, title: 'Paper 2: Challenges in the Human Environment', description: 'Urban issues, development, resource management.', duration: '1hr 30min', marks: 88, pmtSubject: 'Geography', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: HUM_YEARS },
        { number: 3, title: 'Paper 3: Geographical Applications', description: 'Issue evaluation, fieldwork, geographical skills.', duration: '1hr 15min', marks: 76, pmtSubject: 'Geography', pmtBoard: 'AQA', pmtPaper: 'Paper-3', years: HUM_YEARS },
      ],
    },
    Edexcel: {
      officialUrl: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/geography-b-2016.html',
      papers: [
        { number: 1, title: 'Paper 1: Global Geographical Issues', description: 'Hazardous earth, development dynamics, UK challenges.', duration: '1hr 30min', marks: 94, pmtSubject: 'Geography', pmtBoard: 'Edexcel', pmtPaper: 'Paper-1', years: HUM_YEARS },
        { number: 2, title: 'Paper 2: UK Geographical Issues', description: 'UK physical and human landscapes.', duration: '1hr 30min', marks: 94, pmtSubject: 'Geography', pmtBoard: 'Edexcel', pmtPaper: 'Paper-2', years: HUM_YEARS },
        { number: 3, title: 'Paper 3: People and Environment Issues', description: 'People and the biosphere, forests, consuming energy, fieldwork.', duration: '1hr 30min', marks: 64, pmtSubject: 'Geography', pmtBoard: 'Edexcel', pmtPaper: 'Paper-3', years: HUM_YEARS },
      ],
    },
  },

  // ─── HISTORY ──────────────────────────────────────────────────────────────────
  'History': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/history/gcse/history-8145/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Understanding the Modern World', description: 'Period and wider world depth studies.', duration: '2hr', marks: 84, pmtSubject: 'History', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: HUM_YEARS },
        { number: 2, title: 'Paper 2: Shaping the Nation', description: 'Thematic and British depth studies.', duration: '2hr', marks: 84, pmtSubject: 'History', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: HUM_YEARS },
      ],
    },
    Edexcel: {
      officialUrl: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/history-2016.html',
      papers: [
        { number: 1, title: 'Paper 1: Thematic Study and Historic Environment', description: 'Crime, medicine, warfare, or migration + historic environment.', duration: '1hr 15min', marks: 52, pmtSubject: 'History', pmtBoard: 'Edexcel', pmtPaper: 'Paper-1', years: HUM_YEARS },
        { number: 2, title: 'Paper 2: Period Study and British Depth Study', description: 'Two sections covering different historical periods.', duration: '1hr 45min', marks: 64, pmtSubject: 'History', pmtBoard: 'Edexcel', pmtPaper: 'Paper-2', years: HUM_YEARS },
        { number: 3, title: 'Paper 3: Modern Depth Study', description: 'Weimar & Nazi Germany, USA, or Superpower Relations.', duration: '1hr 20min', marks: 52, pmtSubject: 'History', pmtBoard: 'Edexcel', pmtPaper: 'Paper-3', years: HUM_YEARS },
      ],
    },
  },

  // ─── RELIGIOUS STUDIES ────────────────────────────────────────────────────────
  'Religious Studies': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/religious-studies/gcse/religious-studies-a-8062/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Study of Religions — Beliefs, Teachings, Practices', description: 'Christianity and one other religion.', duration: '1hr 45min', marks: 96, pmtSubject: 'Religious-Studies', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: HUM_YEARS },
        { number: 2, title: 'Paper 2: Thematic Studies', description: 'Four themes from religion and ethics.', duration: '1hr 45min', marks: 96, pmtSubject: 'Religious-Studies', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: HUM_YEARS },
      ],
    },
  },

  // ─── COMPUTER SCIENCE ─────────────────────────────────────────────────────────
  'Computer Science': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/computer-science-and-it/gcse/computer-science-8525/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Computational Thinking and Programming Skills', description: 'On-screen exam. Programming, algorithms, data structures.', duration: '2hr', marks: 80, pmtSubject: 'Computer-Science', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
        { number: 2, title: 'Paper 2: Computing Concepts', description: 'Written paper. Systems, networks, cyber security, data.', duration: '1hr 45min', marks: 80, pmtSubject: 'Computer-Science', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: OTHER_YEARS },
      ],
    },
    OCR: {
      officialUrl: 'https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/assessment/',
      papers: [
        { number: 1, title: 'Paper 1: Computer Systems', description: 'Architecture, memory, storage, networks, security, ethics.', duration: '1hr 30min', marks: 80, pmtSubject: 'Computer-Science', pmtBoard: 'OCR', pmtPaper: 'Paper-1', years: OTHER_YEARS },
        { number: 2, title: 'Paper 2: Computational Thinking, Algorithms and Programming', description: 'Algorithms, programming, logic, data representation.', duration: '1hr 30min', marks: 80, pmtSubject: 'Computer-Science', pmtBoard: 'OCR', pmtPaper: 'Paper-2', years: OTHER_YEARS },
      ],
    },
  },

  // ─── PSYCHOLOGY ───────────────────────────────────────────────────────────────
  'Psychology': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/psychology/gcse/psychology-8182/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Cognition and Behaviour', description: 'Memory, perception, development, research methods.', duration: '1hr 45min', marks: 100, pmtSubject: 'Psychology', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
        { number: 2, title: 'Paper 2: Social Context and Behaviour', description: 'Social influence, language, brain, psychological problems.', duration: '1hr 45min', marks: 100, pmtSubject: 'Psychology', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: OTHER_YEARS },
      ],
    },
  },

  // ─── SOCIOLOGY ────────────────────────────────────────────────────────────────
  'Sociology': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/sociology/gcse/sociology-8192/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: The Sociology of Families and Education', description: 'Family structures, education, research methods.', duration: '1hr 45min', marks: 100, pmtSubject: 'Sociology', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
        { number: 2, title: 'Paper 2: The Sociology of Crime and Social Stratification', description: 'Crime and deviance, social stratification.', duration: '1hr 45min', marks: 100, pmtSubject: 'Sociology', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: OTHER_YEARS },
      ],
    },
  },

  // ─── BUSINESS STUDIES ─────────────────────────────────────────────────────────
  'Business Studies': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/business/gcse/business-8132/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Influences of Operations and HRM on Business Activity', description: 'Business in the real world, influences, operations, HRM.', duration: '1hr 45min', marks: 90, pmtSubject: 'Business-Studies', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
        { number: 2, title: 'Paper 2: Influences of Marketing and Finance on Business Activity', description: 'Marketing, finance, external influences.', duration: '1hr 45min', marks: 90, pmtSubject: 'Business-Studies', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: OTHER_YEARS },
      ],
    },
    Edexcel: {
      officialUrl: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/business-2017.html',
      papers: [
        { number: 1, title: 'Paper 1: Investigating Small Business', description: 'Enterprise, spotting opportunities, finances, people.', duration: '1hr 30min', marks: 90, pmtSubject: 'Business-Studies', pmtBoard: 'Edexcel', pmtPaper: 'Paper-1', years: OTHER_YEARS },
        { number: 2, title: 'Paper 2: Building a Business', description: 'Growing the business, marketing, operations, finance, HR.', duration: '1hr 30min', marks: 90, pmtSubject: 'Business-Studies', pmtBoard: 'Edexcel', pmtPaper: 'Paper-2', years: OTHER_YEARS },
      ],
    },
  },

  // ─── ECONOMICS ────────────────────────────────────────────────────────────────
  'Economics': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/economics/gcse/economics-8136/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: How Markets Work', description: 'Economic foundations, markets, market failure.', duration: '1hr 45min', marks: 80, pmtSubject: 'Economics', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
        { number: 2, title: 'Paper 2: How the Economy Works', description: 'UK economy, international trade, macro policy.', duration: '1hr 45min', marks: 80, pmtSubject: 'Economics', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: OTHER_YEARS },
      ],
    },
  },

  // ─── DRAMA ────────────────────────────────────────────────────────────────────
  'Drama': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/drama/gcse/drama-8261/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Understanding Drama', description: 'Knowledge of drama, set text, and live theatre evaluation.', duration: '1hr 45min', marks: 80, pmtSubject: 'Drama', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
      ],
    },
  },

  // ─── MUSIC ────────────────────────────────────────────────────────────────────
  'Music': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/music/gcse/music-8271/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Understanding Music', description: 'Listening and appraising exam. Set works and unfamiliar music.', duration: '1hr 30min', marks: 84, pmtSubject: 'Music', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
      ],
    },
  },

  // ─── PHYSICAL EDUCATION ───────────────────────────────────────────────────────
  'Physical Education': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/physical-education/gcse/physical-education-8582/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: The Human Body and Movement in Physical Activity', description: 'Applied anatomy, movement analysis, physical training, sports psychology.', duration: '1hr 15min', marks: 78, pmtSubject: 'Physical-Education', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
        { number: 2, title: 'Paper 2: Socio-cultural Influences and Well-being', description: 'Socio-cultural influences, health, fitness, well-being.', duration: '1hr 15min', marks: 78, pmtSubject: 'Physical-Education', pmtBoard: 'AQA', pmtPaper: 'Paper-2', years: OTHER_YEARS },
      ],
    },
    Edexcel: {
      officialUrl: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/physical-education-2016.html',
      papers: [
        { number: 1, title: 'Paper 1: Fitness and Body Systems', description: 'Applied anatomy, physical training, use of data.', duration: '1hr 45min', marks: 90, pmtSubject: 'Physical-Education', pmtBoard: 'Edexcel', pmtPaper: 'Paper-1', years: OTHER_YEARS },
        { number: 2, title: 'Paper 2: Health and Performance', description: 'Health, fitness, well-being, sport psychology, socio-cultural.', duration: '1hr 15min', marks: 70, pmtSubject: 'Physical-Education', pmtBoard: 'Edexcel', pmtPaper: 'Paper-2', years: OTHER_YEARS },
      ],
    },
  },

  // ─── FRENCH ───────────────────────────────────────────────────────────────────
  'French': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/languages/gcse/french-8658/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Listening', description: 'Understanding spoken French in various contexts.', duration: '35min (F) / 45min (H)', marks: 40, tiered: true, pmtSubject: 'French', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: LANG_YEARS },
        { number: 2, title: 'Paper 3: Reading', description: 'Understanding written French texts.', duration: '45min (F) / 1hr (H)', marks: 60, tiered: true, pmtSubject: 'French', pmtBoard: 'AQA', pmtPaper: 'Paper-3', years: LANG_YEARS },
        { number: 3, title: 'Paper 4: Writing', description: 'Writing in French with grammar and vocabulary.', duration: '1hr (F) / 1hr 15min (H)', marks: 50, tiered: true, pmtSubject: 'French', pmtBoard: 'AQA', pmtPaper: 'Paper-4', years: LANG_YEARS },
      ],
    },
  },

  // ─── SPANISH ──────────────────────────────────────────────────────────────────
  'Spanish': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/languages/gcse/spanish-8698/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Listening', description: 'Understanding spoken Spanish in various contexts.', duration: '35min (F) / 45min (H)', marks: 40, tiered: true, pmtSubject: 'Spanish', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: LANG_YEARS },
        { number: 2, title: 'Paper 3: Reading', description: 'Understanding written Spanish texts.', duration: '45min (F) / 1hr (H)', marks: 60, tiered: true, pmtSubject: 'Spanish', pmtBoard: 'AQA', pmtPaper: 'Paper-3', years: LANG_YEARS },
        { number: 3, title: 'Paper 4: Writing', description: 'Writing in Spanish with grammar and vocabulary.', duration: '1hr (F) / 1hr 15min (H)', marks: 50, tiered: true, pmtSubject: 'Spanish', pmtBoard: 'AQA', pmtPaper: 'Paper-4', years: LANG_YEARS },
      ],
    },
  },

  // ─── GERMAN ───────────────────────────────────────────────────────────────────
  'German': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/languages/gcse/german-8668/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Listening', description: 'Understanding spoken German in various contexts.', duration: '35min (F) / 45min (H)', marks: 40, tiered: true, pmtSubject: 'German', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: LANG_YEARS },
        { number: 2, title: 'Paper 3: Reading', description: 'Understanding written German texts.', duration: '45min (F) / 1hr (H)', marks: 60, tiered: true, pmtSubject: 'German', pmtBoard: 'AQA', pmtPaper: 'Paper-3', years: LANG_YEARS },
        { number: 3, title: 'Paper 4: Writing', description: 'Writing in German with grammar and vocabulary.', duration: '1hr (F) / 1hr 15min (H)', marks: 50, tiered: true, pmtSubject: 'German', pmtBoard: 'AQA', pmtPaper: 'Paper-4', years: LANG_YEARS },
      ],
    },
  },

  // ─── CHINESE ──────────────────────────────────────────────────────────────────
  'Chinese': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/languages/gcse/chinese-spoken-mandarin-8673/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Listening', description: 'Understanding spoken Mandarin.', duration: '35min (F) / 45min (H)', marks: 40, tiered: true, pmtSubject: 'Chinese', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: LANG_YEARS },
        { number: 2, title: 'Paper 3: Reading', description: 'Understanding written Chinese texts.', duration: '45min (F) / 1hr (H)', marks: 60, tiered: true, pmtSubject: 'Chinese', pmtBoard: 'AQA', pmtPaper: 'Paper-3', years: LANG_YEARS },
        { number: 3, title: 'Paper 4: Writing', description: 'Writing in Chinese characters.', duration: '1hr (F) / 1hr 15min (H)', marks: 50, tiered: true, pmtSubject: 'Chinese', pmtBoard: 'AQA', pmtPaper: 'Paper-4', years: LANG_YEARS },
      ],
    },
  },

  // ─── FOOD PREPARATION & NUTRITION ─────────────────────────────────────────────
  'Food Preparation & Nutrition': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/food/gcse/food-preparation-and-nutrition-8585/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Food Preparation and Nutrition', description: 'Food, nutrition, food science, food safety, food provenance.', duration: '1hr 45min', marks: 100, pmtSubject: 'Food-Preparation-and-Nutrition', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
      ],
    },
  },

  // ─── DESIGN & TECHNOLOGY ──────────────────────────────────────────────────────
  'Design & Technology': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/design-and-technology/gcse/design-and-technology-8552/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Design and Technology', description: 'Core technical and specialist principles, designing and making.', duration: '2hr', marks: 100, pmtSubject: 'Design-and-Technology', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
      ],
    },
  },

  // ─── ART & DESIGN ────────────────────────────────────────────────────────────
  'Art & Design': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/art-and-design/gcse/art-and-design-8201-8206/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Portfolio', description: 'Sustained project developed from personal starting points.', marks: 96, pmtSubject: 'Art-and-Design', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
      ],
    },
  },

  // ─── GRAPHIC COMMUNICATION ────────────────────────────────────────────────────
  'Graphic Communication': {
    AQA: {
      officialUrl: 'https://www.aqa.org.uk/subjects/art-and-design/gcse/art-and-design-8201-8206/assessment-resources',
      papers: [
        { number: 1, title: 'Paper 1: Graphic Communication Portfolio', description: 'Portfolio of graphic communication work.', marks: 96, pmtSubject: 'Art-and-Design', pmtBoard: 'AQA', pmtPaper: 'Paper-1', years: OTHER_YEARS },
      ],
    },
  },

  // ─── WELSH ───────────────────────────────────────────────────────────────────
  // Welsh is a WJEC/Eduqas-exclusive subject. Past papers are available directly
  // from WJEC — use the official link below to download.
  'Welsh': {
    WJEC: {
      officialUrl: 'https://www.wjec.co.uk/qualifications/welsh-second-language/wjec-gcse-welsh-second-language.html',
      papers: [],
    },
  },
};
