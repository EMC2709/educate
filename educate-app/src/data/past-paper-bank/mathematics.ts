import type { Question } from '@/types';

export const mathematicsPastPaper: Question[] = [
  {
    topic: "Number",
    question: "Write 0.00364 in standard form.",
    answer: "3.64 × 10⁻³\n\nMark scheme:\n• Correct value between 1 and 10 identified (3.64) — 1 mark\n• Correct power of 10 (10⁻³) — 1 mark",
    marks: 2,
    hint: "Standard form is written as A × 10ⁿ where 1 ≤ A < 10. Count how many places you move the decimal point to get a number between 1 and 10.",
  },
  {
    topic: "Algebra",
    question: "Solve the simultaneous equations:\n\n3x + 2y = 12\n\n5x − 2y = 20",
    answer: "Adding the two equations: 8x = 32, so x = 4\nSubstituting x = 4 into 3x + 2y = 12: 12 + 2y = 12, so 2y = 0, y = 0\n\nMark scheme:\n• Correct method to eliminate one variable — 1 mark\n• Correct value of x = 4 — 1 mark\n• Correct value of y = 0 — 1 mark",
    marks: 3,
    hint: "Look at the y terms — can you add or subtract the equations to eliminate y?",
  },
  {
    topic: "Algebra",
    question: "Make t the subject of the formula:\n\nv = u + at",
    answer: "v − u = at\nt = (v − u) / a\n\nMark scheme:\n• Correct first step subtracting u from both sides — 1 mark\n• Correct final rearrangement dividing by a — 1 mark",
    marks: 2,
    hint: "Isolate the term containing t first by subtracting u from both sides, then divide to get t on its own.",
  },
  {
    topic: "Geometry & Measures",
    question: "The diagram shows a right-angled triangle with hypotenuse 13 cm and one side of length 5 cm.\n\n```mermaid\ngraph TD\n    A[\" \"] --- B[\" \"]\n    B --- C[\" \"]\n    C --- A\n    style A fill:none,stroke:none\n    style B fill:none,stroke:none\n    style C fill:none,stroke:none\n```\n\n(a) Calculate the length of the third side. (2 marks)\n\n(b) Calculate the area of the triangle. (2 marks)",
    answer: "(a) Using Pythagoras: a² + 5² = 13²\na² + 25 = 169\na² = 144\na = 12 cm\n\n(b) Area = ½ × base × height = ½ × 5 × 12 = 30 cm²\n\nMark scheme:\n(a)\n• Correct substitution into Pythagoras' theorem — 1 mark\n• Correct answer of 12 cm — 1 mark\n(b)\n• Correct substitution into area formula — 1 mark\n• Correct answer of 30 cm² — 1 mark",
    marks: 4,
    hint: "(a) Use Pythagoras' theorem: a² + b² = c² where c is the hypotenuse. (b) The two shorter sides form the base and height of the triangle.",
  },
  {
    topic: "Probability",
    question: "A bag contains 4 red balls, 3 blue balls and 5 green balls. A ball is taken at random, not replaced, and then a second ball is taken.\n\n(a) Draw a tree diagram showing the probabilities for the first two picks. (2 marks)\n\n(b) Calculate the probability that both balls are red. (3 marks)",
    answer: "(a) Tree diagram should show:\nFirst pick: P(Red) = 4/12, P(Blue) = 3/12, P(Green) = 5/12\nSecond pick (without replacement): branches adjust denominators to 11 and numerators according to first pick.\n\n(b) P(Red then Red) = 4/12 × 3/11 = 12/132 = 1/11\n\nMark scheme:\n(a)\n• Correct probabilities on first branches — 1 mark\n• Correct adjusted probabilities on second branches (without replacement) — 1 mark\n(b)\n• Correct multiplication of fractions — 1 mark\n• Correct unsimplified answer 12/132 — 1 mark\n• Simplified to 1/11 — 1 mark",
    marks: 5,
    hint: "Without replacement means the total decreases by 1 for the second pick. Multiply along the branches for combined probability.",
  },
  {
    topic: "Statistics",
    question: "The table shows the heights of 30 students.\n\nHeight (h cm) | Frequency\n140 ≤ h < 150 | 4\n150 ≤ h < 160 | 9\n160 ≤ h < 170 | 12\n170 ≤ h < 180 | 5\n\nCalculate an estimate for the mean height.",
    answer: "Midpoints: 145, 155, 165, 175\nΣfx = (4 × 145) + (9 × 155) + (12 × 165) + (5 × 175)\n= 580 + 1395 + 1980 + 875 = 4830\nMean = 4830 ÷ 30 = 161 cm\n\nMark scheme:\n• Correct midpoints identified — 1 mark\n• Correct Σfx calculation — 1 mark\n• Correct division by 30 to find mean of 161 cm — 1 mark",
    marks: 3,
    hint: "Use the midpoint of each class interval. Multiply each midpoint by its frequency, add them up, then divide by the total frequency.",
  },
  {
    topic: "Ratio & Proportion",
    question: "Amy, Ben and Carlos share £240 in the ratio 3 : 5 : 4.\n\n(a) How much does each person receive? (2 marks)\n\n(b) Ben gives a quarter of his share to Carlos. How much does Carlos now have? (2 marks)",
    answer: "(a) Total parts = 3 + 5 + 4 = 12\nOne part = £240 ÷ 12 = £20\nAmy = 3 × £20 = £60\nBen = 5 × £20 = £100\nCarlos = 4 × £20 = £80\n\n(b) Ben gives ¼ × £100 = £25 to Carlos\nCarlos now has £80 + £25 = £105\n\nMark scheme:\n(a)\n• Correct value of one part (£20) — 1 mark\n• All three correct amounts — 1 mark\n(b)\n• Correct calculation of quarter of Ben's share (£25) — 1 mark\n• Correct final amount for Carlos (£105) — 1 mark",
    marks: 4,
    hint: "(a) Add the ratio parts together first, then divide £240 by the total parts. (b) Find a quarter of Ben's share and add it to Carlos's share.",
  },
  {
    topic: "Geometry & Measures",
    question: "Prove that the angle in a semicircle is always 90°.\n\nYou may use the fact that the angle at the centre is twice the angle at the circumference.",
    answer: "The diameter forms an angle of 180° at the centre (a straight line).\nBy the circle theorem, the angle at the centre is twice the angle at the circumference.\nTherefore the angle at the circumference = 180° ÷ 2 = 90°.\nHence the angle in a semicircle is always a right angle. QED.\n\nMark scheme:\n• States that the diameter subtends 180° at the centre — 1 mark\n• Quotes the relevant circle theorem — 1 mark\n• Correctly deduces 180° ÷ 2 = 90° — 1 mark",
    marks: 3,
    hint: "Start with the angle at the centre made by the diameter. What is this angle? Then apply the circle theorem about the relationship between centre and circumference angles.",
  },
];
