import type { SubjectBank } from '@/types';

import { mathematicsBank } from './mathematics';
import { biologyBank } from './biology';
import { chemistryBank } from './chemistry';
import { physicsBank } from './physics';
import { combinedScienceBank } from './combined-science';
import { englishLanguageBank } from './english-language';
import { englishLiteratureBank } from './english-literature';
import { historyBank } from './history';
import { geographyBank } from './geography';
import { computerScienceBank } from './computer-science';
import { psychologyBank } from './psychology';
import { sociologyBank } from './sociology';
import { businessStudiesBank } from './business-studies';
import { religiousStudiesBank } from './religious-studies';
import { economicsBank } from './economics';
import { frenchBank } from './french';
import { spanishBank } from './spanish';
import { germanBank } from './german';
import { designTechnologyBank } from './design-technology';
import { foodNutritionBank } from './food-nutrition';
import { physicalEducationBank } from './physical-education';
import { dramaBank } from './drama';
import { musicBank } from './music';
import { artDesignBank } from './art-design';
import { chineseBank } from './chinese';
import { graphicCommunicationBank } from './graphic-communication';
import { welshBank } from './welsh';

export const QUESTION_BANK: Record<string, SubjectBank> = {
  "Mathematics": mathematicsBank,
  "Biology": biologyBank,
  "Chemistry": chemistryBank,
  "Physics": physicsBank,
  "Combined Science": combinedScienceBank,
  "English Language": englishLanguageBank,
  "English Literature": englishLiteratureBank,
  "History": historyBank,
  "Geography": geographyBank,
  "Computer Science": computerScienceBank,
  "Psychology": psychologyBank,
  "Sociology": sociologyBank,
  "Business Studies": businessStudiesBank,
  "Religious Studies": religiousStudiesBank,
  "Economics": economicsBank,
  "French": frenchBank,
  "Spanish": spanishBank,
  "German": germanBank,
  "Design & Technology": designTechnologyBank,
  "Food Preparation & Nutrition": foodNutritionBank,
  "Physical Education": physicalEducationBank,
  "Drama": dramaBank,
  "Music": musicBank,
  "Art & Design": artDesignBank,
  "Chinese": chineseBank,
  "Graphic Communication": graphicCommunicationBank,
  "Welsh": welshBank,
};
