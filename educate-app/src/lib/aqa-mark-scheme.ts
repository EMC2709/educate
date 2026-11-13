/**
 * Official AQA mark-scheme URLs, worked out from a paper's own footer code.
 *
 * AQA publishes mark schemes on its filestore as
 *   /sample-papers-and-mark-schemes/{YYYY}/{june|november}/AQA-{spec}{component}{paper}-MS-{MON}{yy}.PDF
 * e.g. Jun23/8300/1H → .../2023/june/AQA-83001H-MS-JUN23.PDF
 *      Jun23/8464/B/1H → .../2023/june/AQA-8464B1H-MS-JUN23.PDF
 *
 * Checked on 13 Nov 2026: June 2022, June 2023, November 2021 and November 2022 are
 * published there; 2024 and pre-2022 sittings are not, and History uses other names.
 * Callers must check a candidate exists before using it.
 */
import type { ExamCode } from './past-paper-match';

export const AQA_FILESTORE = 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes';

/** Candidate mark-scheme URLs for an AQA paper, most likely first. */
export function aqaMarkSchemeCandidates(code: ExamCode): string[] {
  const year = `20${code.yy}`;
  const folder = code.sitting === 'jun' ? 'june' : 'november';
  const mon = code.sitting.toUpperCase();

  const papers = [code.paper];
  const m = code.paper.match(/^(\d{1,2})([a-z]+)$/);
  if (m) {
    const [, num, letters] = m;
    // "2hr" (a reprint of 2H) → try "2h"
    if (/^[hf]./.test(letters)) papers.push(num + letters[0]);
    // Option letters ("1n" English Literature, "1a" Computer Science) share one mark scheme
    if (!/^[hf]$/.test(letters)) papers.push(num);
  }

  const spec = code.spec.toUpperCase();
  const comp = (code.component ?? '').toUpperCase();
  return [...new Set(papers)].map(
    p => `${AQA_FILESTORE}/${year}/${folder}/AQA-${spec}${comp}${p.toUpperCase()}-MS-${mon}${code.yy}.PDF`,
  );
}
