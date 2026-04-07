import type { Question } from '@/types';
import { englishLiteraturePastPaper } from './english-literature';
import { historyPastPaper } from './history';
import { geographyPastPaper } from './geography';
import { religiousStudiesPastPaper } from './religious-studies';
import { sociologyPastPaper } from './sociology';
import { psychologyPastPaper } from './psychology';
import { businessStudiesPastPaper } from './business-studies';
import { economicsPastPaper } from './economics';
import { englishLanguagePastPaper } from './english-language';
import { dramaPastPaper } from './drama';
import { frenchPastPaper } from './french';
import { spanishPastPaper } from './spanish';
import { germanPastPaper } from './german';
import { chinesePastPaper } from './chinese';
import { mathematicsPastPaper } from './mathematics';
import { biologyPastPaper } from './biology';
import { chemistryPastPaper } from './chemistry';
import { physicsPastPaper } from './physics';
import { combinedSciencePastPaper } from './combined-science';
import { computerSciencePastPaper } from './computer-science';
import { musicPastPaper } from './music';
import { physicalEducationPastPaper } from './physical-education';
import { artDesignPastPaper } from './art-design';
import { foodNutritionPastPaper } from './food-nutrition';
import { designTechnologyPastPaper } from './design-technology';
import { graphicCommunicationPastPaper } from './graphic-communication';

export const PAST_PAPER_BANK: Record<string, Question[]> = {
  'English Literature': englishLiteraturePastPaper,
  'History': historyPastPaper,
  'Geography': geographyPastPaper,
  'Religious Studies': religiousStudiesPastPaper,
  'Sociology': sociologyPastPaper,
  'Psychology': psychologyPastPaper,
  'Business Studies': businessStudiesPastPaper,
  'Economics': economicsPastPaper,
  'English Language': englishLanguagePastPaper,
  'Drama': dramaPastPaper,
  'French': frenchPastPaper,
  'Spanish': spanishPastPaper,
  'German': germanPastPaper,
  'Chinese': chinesePastPaper,
  'Mathematics': mathematicsPastPaper,
  'Biology': biologyPastPaper,
  'Chemistry': chemistryPastPaper,
  'Physics': physicsPastPaper,
  'Combined Science': combinedSciencePastPaper,
  'Computer Science': computerSciencePastPaper,
  'Music': musicPastPaper,
  'Physical Education': physicalEducationPastPaper,
  'Art & Design': artDesignPastPaper,
  'Food Preparation & Nutrition': foodNutritionPastPaper,
  'Design & Technology': designTechnologyPastPaper,
  'Graphic Communication': graphicCommunicationPastPaper,
};
