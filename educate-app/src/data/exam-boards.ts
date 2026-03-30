import type { ExamBoard } from '@/types';

export const EXAM_BOARDS: Record<string, ExamBoard> = {
  AQA: {
    color: "#1a1a2e",
    accent: "#e94560",
    lightAccent: "#ff6b6b",
    logo: "AQA",
    tagline: "Assessment and Qualifications Alliance",
    subjects: ["Mathematics", "English Language", "English Literature", "Biology", "Chemistry", "Physics", "Combined Science", "History", "Geography", "French", "Spanish", "German", "Chinese", "Religious Studies", "Computer Science", "Art & Design", "Music", "Drama", "Physical Education", "Sociology", "Psychology", "Business Studies", "Economics", "Design & Technology", "Food Preparation & Nutrition", "Graphic Communication"],
  },
  Edexcel: {
    color: "#003087",
    accent: "#00a3e0",
    lightAccent: "#4fc3f7",
    logo: "EDEXCEL",
    tagline: "Pearson Edexcel",
    subjects: ["Mathematics", "English Language", "English Literature", "Biology", "Chemistry", "Physics", "Combined Science", "History", "Geography", "French", "Spanish", "German", "Chinese", "Religious Studies", "Computer Science", "Art & Design", "Music", "Drama", "Physical Education", "Sociology", "Psychology", "Business Studies", "Economics", "Design & Technology", "Food Preparation & Nutrition", "Graphic Communication"],
  },
  OCR: {
    color: "#00467f",
    accent: "#00b4d8",
    lightAccent: "#48cae4",
    logo: "OCR",
    tagline: "Oxford Cambridge and RSA",
    subjects: ["Mathematics", "English Language", "English Literature", "Biology", "Chemistry", "Physics", "Combined Science", "History", "Geography", "French", "Spanish", "German", "Chinese", "Religious Studies", "Computer Science", "Art & Design", "Music", "Drama", "Physical Education", "Sociology", "Psychology", "Business Studies", "Economics", "Design & Technology", "Food Preparation & Nutrition", "Graphic Communication"],
  },
  WJEC: {
    color: "#2d6a4f",
    accent: "#52b788",
    lightAccent: "#74c69d",
    logo: "WJEC",
    tagline: "Welsh Joint Education Committee",
    subjects: ["Mathematics", "English Language", "English Literature", "Biology", "Chemistry", "Physics", "Combined Science", "History", "Geography", "French", "Spanish", "Welsh", "German", "Chinese", "Religious Studies", "Computer Science", "Art & Design", "Music", "Drama", "Physical Education", "Sociology", "Psychology", "Business Studies", "Economics", "Design & Technology", "Food Preparation & Nutrition", "Graphic Communication"],
  },
};
