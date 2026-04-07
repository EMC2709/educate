import type { SubtopicBank } from '@/types';
import { mathematicsSubtopics } from './mathematics';
import { biologySubtopics } from './biology';
import { chemistrySubtopics } from './chemistry';
import { physicsSubtopics } from './physics';
import { combinedScienceSubtopics } from './combined-science';

export { mathematicsSubtopics } from './mathematics';
export { biologySubtopics } from './biology';
export { chemistrySubtopics } from './chemistry';
export { physicsSubtopics } from './physics';
export { combinedScienceSubtopics } from './combined-science';

export const SUBTOPIC_BANK: SubtopicBank = {
  "Mathematics": mathematicsSubtopics,
  "Biology": biologySubtopics,
  "Chemistry": chemistrySubtopics,
  "Physics": physicsSubtopics,
  "Combined Science": combinedScienceSubtopics,
};
