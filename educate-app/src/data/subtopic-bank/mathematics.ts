import type { SubtopicContent } from '@/types';

export const mathematicsSubtopics: Record<string, Record<string, SubtopicContent>> = {
  "Number": {
    "Fractions & Decimals": {
      short: [
        { question: "Calculate \u2154 + \u00be, giving your answer as a mixed number.", answer: "\u2154 + \u00be = 8/12 + 9/12 = 17/12 = 1 5/12", marks: 2, hint: "Find a common denominator first" },
        { question: "Convert 0.36 recurring to a fraction.", answer: "Let x = 0.363636... \u2192 100x = 36.363636... \u2192 99x = 36 \u2192 x = 36/99 = 4/11", marks: 2, hint: "Multiply by 100 to shift two recurring digits" },
      ],
      mid: [
        { question: "A recipe needs \u2157 of a cup of sugar. James wants to make 3\u00bd times the recipe. How much sugar does he need?", answer: "\u2157 \u00d7 3\u00bd = \u2157 \u00d7 7/2 = 42/10 = 21/5 = 4\u2155 cups", marks: 3, hint: "Convert the mixed number to an improper fraction first, then multiply" },
      ],
      long: [
        { question: "Show that 0.126\u0304 (0.1266666...) can be written as 19/150. Show full algebraic working.", answer: "Let x = 0.1266666... Multiply by 10: 10x = 1.26666... Multiply by 100: 100x = 12.6666... Subtract: 90x = 11.4 \u2192 x = 11.4/90 = 114/900 = 19/150 \u2713", marks: 4, hint: "Multiply to move the non-recurring part past the decimal, then multiply again to move one recurring cycle" },
      ],
      flashcard: [
        { term: "Adding Fractions", definition: "Find the LCM of the denominators (common denominator), convert each fraction, then add the numerators. Simplify the result if possible.", example: "1/3 + 1/4 = 4/12 + 3/12 = 7/12" },
        { term: "Multiplying Fractions", definition: "Multiply numerators together and denominators together. Cancel common factors before multiplying if possible (cross-cancellation).", example: "\u2154 \u00d7 \u00be = (2\u00d73)/(3\u00d74) = 6/12 = \u00bd" },
        { term: "Recurring Decimals", definition: "A decimal that repeats indefinitely. To convert to a fraction: let x = the decimal, multiply to align recurring digits, subtract to eliminate the recurring part, solve for x.", example: "0.\u03043 = 1/3; 0.\u03041\u03042 = 12/99 = 4/33" },
      ],
    },
    "Percentages": {
      short: [
        { question: "A TV costs \u00a3420 after a 30% discount. What was the original price?", answer: "70% = \u00a3420, so 1% = \u00a36, so 100% = \u00a3600", marks: 2, hint: "\u00a3420 represents 70% of the original price" },
        { question: "Increase \u00a3350 by 15%.", answer: "\u00a3350 \u00d7 1.15 = \u00a3402.50", marks: 1, hint: "Multiply by 1.15 for a 15% increase" },
      ],
      mid: [
        { question: "\u00a35,000 is invested at 3.5% compound interest per year. Calculate the value after 4 years to the nearest penny.", answer: "A = 5000 \u00d7 (1.035)\u2074 = 5000 \u00d7 1.14752... = \u00a35737.62", marks: 3, hint: "Use A = P(1 + r/100)\u207f" },
      ],
      long: [
        { question: "A house price rises by 8% in year 1, falls by 5% in year 2, then rises by 3% in year 3. Find the overall percentage change from the start price. Show all working.\n\n```mermaid\ngraph LR\n  A[\"£100\"] -->|\"×1.08 (+8%)\"| B[\"£108\"]\n  B -->|\"×0.95 (−5%)\"| C[\"£102.60\"]\n  C -->|\"×1.03 (+3%)\"| D[\"£105.68\"]\n  D --> E[\"Overall: +5.68%\"]\n```", answer: "Let start = £100. After y1: £108. After y2: £108 × 0.95 = £102.60. After y3: £102.60 × 1.03 = £105.678. Overall change = **+5.68%**", marks: 5, hint: "Apply each multiplier in sequence to a starting value of 100. The final value minus 100 gives the percentage change." },
      ],
      flashcard: [
        { term: "Percentage Multiplier", definition: "To increase by r%: multiply by (1 + r/100). To decrease by r%: multiply by (1 \u2212 r/100). Reverse percentage: divide by the multiplier.", example: "20% increase: \u00d7 1.2. After 20% increase gives \u00a360: original = 60 \u00f7 1.2 = \u00a350" },
        { term: "Compound Interest Formula", definition: "A = P(1 + r/100)\u207f where A = final amount, P = principal, r = interest rate %, n = number of periods.", example: "\u00a32000 at 4% for 3 years: 2000 \u00d7 1.04\u00b3 = \u00a32249.73" },
        { term: "Percentage Change", definition: "% change = (change \u00f7 original) \u00d7 100. A positive result is an increase; negative is a decrease.", example: "Price rises from \u00a340 to \u00a350: change = 10, % change = (10/40) \u00d7 100 = 25%" },
      ],
    },
    "Powers & Roots": {
      short: [
        { question: "Simplify: 2\u00b3 \u00d7 2\u2074", answer: "2\u2077 = 128", marks: 1, hint: "Add the indices when multiplying same base" },
        { question: "Write \u221a75 in simplified surd form.", answer: "\u221a75 = \u221a(25\u00d73) = 5\u221a3", marks: 2, hint: "Find the largest perfect square factor" },
      ],
      mid: [
        { question: "Simplify fully: (3x\u00b2y\u00b3)\u00b2 \u00f7 (9xy)", answer: "Numerator: 9x\u2074y\u2076. Divide: 9x\u2074y\u2076 \u00f7 9xy = x\u00b3y\u2075", marks: 3, hint: "Square the bracket first, then divide using index laws" },
      ],
      long: [
        { question: "Rationalise the denominator of (3+\u221a5)/(2\u2212\u221a5). Show all working and simplify.", answer: "Multiply by (2+\u221a5)/(2+\u221a5). Numerator: (3+\u221a5)(2+\u221a5) = 6+3\u221a5+2\u221a5+5 = 11+5\u221a5. Denominator: (2)\u00b2\u2212(\u221a5)\u00b2 = 4\u22125 = \u22121. Result: (11+5\u221a5)/\u22121 = \u221211\u22125\u221a5", marks: 5, hint: "Multiply numerator and denominator by the conjugate of the denominator" },
      ],
      flashcard: [
        { term: "Index Laws", definition: "a\u1d50 \u00d7 a\u207f = a\u1d50\u207a\u207f. a\u1d50 \u00f7 a\u207f = a\u1d50\u207b\u207f. (a\u1d50)\u207f = a\u1d50\u207f. a\u2070 = 1. a\u207b\u207f = 1/a\u207f. a^(1/n) = \u207f\u221aa.", example: "5\u00b3 \u00d7 5\u00b2 = 5\u2075; (2\u00b3)\u00b2 = 2\u2076; 4^(1/2) = 2" },
        { term: "Surds", definition: "A surd is an irrational square (or cube) root. Cannot be simplified to a rational number. Simplify by finding perfect square factors. Rationalise denominators by multiplying by the surd.", example: "\u221a12 = 2\u221a3; 1/\u221a2 = \u221a2/2 (rationalised)" },
        { term: "Negative & Fractional Indices", definition: "a^(\u2212n) = 1/a\u207f. a^(m/n) = (\u207f\u221aa)\u1d50. So 8^(2/3) = (\u00b3\u221a8)\u00b2 = 2\u00b2 = 4.", example: "27^(\u22121/3) = 1/\u00b3\u221a27 = 1/3" },
      ],
    },
    "Standard Form": {
      short: [
        { question: "Write 0.00000372 in standard form.", answer: "3.72 \u00d7 10\u207b\u2076", marks: 1, hint: "The number between 1 and 10 is 3.72; count how many places you move the decimal" },
        { question: "Calculate (4 \u00d7 10\u2075) \u00d7 (3 \u00d7 10\u207b\u00b2). Give your answer in standard form.", answer: "12 \u00d7 10\u00b3 = 1.2 \u00d7 10\u2074", marks: 2, hint: "Multiply the numbers and add the powers; adjust if the number isn't between 1 and 10" },
      ],
      mid: [
        { question: "The speed of light is 3 \u00d7 10\u2078 m/s. The distance from Earth to the Sun is 1.5 \u00d7 10\u00b9\u00b9 m. How many seconds does light take to travel from the Sun to Earth? Give your answer in standard form.", answer: "Time = distance \u00f7 speed = (1.5 \u00d7 10\u00b9\u00b9) \u00f7 (3 \u00d7 10\u2078) = 0.5 \u00d7 10\u00b3 = 5 \u00d7 10\u00b2 = 500 seconds", marks: 3, hint: "Divide the coefficients and subtract the powers" },
      ],
      long: [
        { question: "A computer processes 2.4 \u00d7 10\u2079 operations per second. It needs to complete 6 \u00d7 10\u00b9\u2075 operations. (a) How many seconds does this take? (b) Convert to days (to 3 s.f.)", answer: "(a) 6\u00d710\u00b9\u2075 \u00f7 2.4\u00d710\u2079 = 2.5\u00d710\u2076 seconds. (b) Days = 2.5\u00d710\u2076 \u00f7 86400 = 28.935... \u2248 28.9 days", marks: 5, hint: "Divide in standard form for part (a). For (b), divide by 60\u00d760\u00d724 = 86400" },
      ],
      flashcard: [
        { term: "Standard Form", definition: "A \u00d7 10\u207f where 1 \u2264 A < 10 and n is any integer. Large numbers: positive n. Small numbers: negative n. To convert: move decimal until A is between 1 and 10; count moves for n.", example: "5,600,000 = 5.6 \u00d7 10\u2076; 0.0034 = 3.4 \u00d7 10\u207b\u00b3" },
        { term: "Calculating in Standard Form", definition: "Multiply: multiply coefficients, add powers. Divide: divide coefficients, subtract powers. Then check the coefficient is between 1 and 10 and adjust if needed.", example: "(2\u00d710\u00b3) \u00d7 (4\u00d710\u00b2) = 8\u00d710\u2075" },
      ],
    },
  },
  "Algebra": {
    "Linear Equations & Expressions": {
      short: [
        { question: "Solve: 3(2x \u2212 1) = 5x + 7", answer: "6x \u2212 3 = 5x + 7 \u2192 x = 10", marks: 2, hint: "Expand the bracket first, then collect x terms" },
        { question: "Simplify: 4a\u00b2b \u00d7 3ab\u00b3", answer: "12a\u00b3b\u2074", marks: 1, hint: "Multiply coefficients and add indices for each variable" },
      ],
      mid: [
        { question: "Make r the subject of: A = \u03c0 r\u00b2 h", answer: "r\u00b2 = A/(\u03c0h) \u2192 r = \u221a(A/\u03c0h)", marks: 3, hint: "Divide both sides by \u03c0h, then square root" },
      ],
      long: [
        { question: "Solve the equation (2x+1)/(x\u22123) = 5/2. Show all steps and check your answer.", answer: "Cross multiply: 2(2x+1) = 5(x\u22123) \u2192 4x+2 = 5x\u221215 \u2192 17 = x. Check: (35)/(14) = 5/2 \u2713", marks: 5, hint: "Cross-multiply to eliminate fractions, then solve the resulting linear equation" },
      ],
      flashcard: [
        { term: "Expanding Double Brackets", definition: "Use FOIL (First, Outer, Inner, Last) or the grid method. (a+b)(c+d) = ac + ad + bc + bd.", example: "(x+3)(x\u22122) = x\u00b2\u22122x+3x\u22126 = x\u00b2+x\u22126" },
        { term: "Changing the Subject", definition: "Rearrange a formula so a specified variable is alone on one side. Use inverse operations: if adding \u2192 subtract; if multiplying \u2192 divide; if squared \u2192 square root.", example: "v = u + at \u2192 t = (v\u2212u)/a" },
      ],
    },
    "Factorising": {
      short: [
        { question: "Factorise fully: 6x²y − 9xy²\n\n```mermaid\ngraph LR\n  A[\"6x²y − 9xy²\"] -->|\"HCF = 3xy\"| B[\"3xy(? − ?)\"]\n  B --> C[\"3xy(2x − 3y)\"]\n```", answer: "**3xy(2x − 3y)**", marks: 2, hint: "Find the HCF of all terms: 3xy" },
        { question: "Factorise: x² − 9\n\n```mermaid\ngraph LR\n  A[\"x² − 9\"] -->|\"DOTS: a²−b²\"| B[\"a=x, b=3\"]\n  B --> C[\"(x+3)(x−3)\"]\n```", answer: "**(x+3)(x−3)**", marks: 1, hint: "Difference of two squares: a²−b² = (a+b)(a−b)" },
      ],
      mid: [
        { question: "Factorise fully: 2x² + 5x − 12\n\n```mermaid\ngraph TD\n  A[\"2x² + 5x − 12\"] -->|\"a×c = 2×(−12) = −24\"| B[\"Find pair: p×q = −24, p+q = 5\"]\n  B -->|\"−3 and 8\"| C[\"Split: 2x²−3x+8x−12\"]\n  C --> D[\"Group: x(2x−3)+4(2x−3)\"]\n  D --> E[\"(x+4)(2x−3)\"]\n```", answer: "ac = −24. Pairs: −3 and 8. Split: 2x² − 3x + 8x − 12 = x(2x−3) + 4(2x−3) = **(x+4)(2x−3)**", marks: 3, hint: "Multiply a × c, find two numbers that multiply to that and add to b, then split the middle term" },
      ],
      long: [
        { question: "Solve 3x² − 10x + 8 = 0 by factorising. Show all working.\n\n```mermaid\ngraph TD\n  A[\"3x² − 10x + 8 = 0\"] --> B[\"a×c = 24\"]\n  B --> C[\"Pair: −4 and −6\"]\n  C --> D[\"Split middle term\"]\n  D --> E[\"Group and factorise\"]\n  E --> F[\"Set each bracket = 0\"]\n```", answer: "ac = 24, need two numbers that multiply to 24 and add to −10: −4 and −6. Split: 3x²−4x−6x+8 = x(3x−4)−2(3x−4) = (x−2)(3x−4) = 0. **x = 2 or x = 4/3**", marks: 5, hint: "Factorise the quadratic, then set each bracket equal to zero" },
      ],
      flashcard: [
        { term: "Factorising Quadratics (a=1)", definition: "x\u00b2 + bx + c: find two numbers p and q where p\u00d7q = c and p+q = b. Write as (x+p)(x+q).", example: "x\u00b2+7x+12: p\u00d7q=12, p+q=7 \u2192 p=3,q=4 \u2192 (x+3)(x+4)" },
        { term: "Difference of Two Squares", definition: "a\u00b2 \u2212 b\u00b2 = (a+b)(a\u2212b). Spot it when you have two perfect square terms with a minus between them.", example: "25x\u00b2 \u2212 16 = (5x+4)(5x\u22124)" },
        { term: "Factorising when a\u22601", definition: "For ax\u00b2+bx+c: multiply a\u00d7c, find factors of ac that add to b, split middle term, factor by grouping.", example: "6x\u00b2+x\u22122: ac=\u221212, factors \u22123,4; \u2192 6x\u00b2\u22123x+4x\u22122 = 3x(2x\u22121)+2(2x\u22121) = (3x+2)(2x\u22121)" },
      ],
    },
    "Simultaneous Equations": {
      short: [
        { question: "Solve: y = 2x + 1 and y = x + 5\n\n```mermaid\ngraph LR\n  A[\"y = 2x + 1\"] --> C[\"Set equal\"]\n  B[\"y = x + 5\"] --> C\n  C --> D[\"2x + 1 = x + 5\"]\n  D --> E[\"x = 4, y = 9\"]\n```", answer: "2x+1 = x+5 → **x = 4, y = 9**", marks: 2, hint: "Set the two expressions for y equal to each other" },
      ],
      mid: [
        { question: "Solve: 3x + 2y = 13 and 2x − y = 4.\n\n```mermaid\ngraph TD\n  A[\"Eq1: 3x + 2y = 13\"] --> C[\"Substitute\"]\n  B[\"Eq2: 2x − y = 4\"] -->|\"Rearrange: y = 2x−4\"| C\n  C --> D[\"3x + 2(2x−4) = 13\"]\n  D --> E[\"7x = 21 → x = 3\"]\n  E --> F[\"y = 2(3)−4 = 2\"]\n```", answer: "From eq2: y = 2x−4. Sub into eq1: 3x+2(2x−4)=13 → 7x=21 → **x=3, y=2**.", marks: 4, hint: "Rearrange one equation to make y the subject, then substitute" },
      ],
      long: [
        { question: "Solve simultaneously: x² + y² = 25 and y = x + 1. Show all solutions.\n\n```mermaid\ngraph TD\n  A[\"Circle: x² + y² = 25\"] --> C[\"Sub y = x+1\"]\n  B[\"Line: y = x + 1\"] --> C\n  C --> D[\"x² + (x+1)² = 25\"]\n  D --> E[\"2x² + 2x − 24 = 0\"]\n  E --> F[\"x² + x − 12 = 0\"]\n  F --> G[\"(x+4)(x−3) = 0\"]\n  G --> H[\"x=−4, y=−3\"]\n  G --> I[\"x=3, y=4\"]\n```", answer: "Sub y=x+1: x²+(x+1)²=25 → x²+x²+2x+1=25 → 2x²+2x−24=0 → x²+x−12=0 → (x+4)(x−3)=0. **x=−4, y=−3** or **x=3, y=4**.", marks: 6, hint: "Substitute the linear equation into the quadratic, form a quadratic, solve by factorising" },
      ],
      flashcard: [
        { term: "Elimination Method", definition: "Make coefficients of one variable equal (multiply equations if needed), then add or subtract to eliminate that variable. Solve for the remaining variable, then substitute back.", example: "2x+y=7 and x+y=5: subtract \u2192 x=2, then y=3" },
        { term: "Substitution Method", definition: "Rearrange one equation to express one variable in terms of the other. Substitute into the second equation. Useful when one equation is already solved for a variable.", example: "y=3x\u22121 and 2x+y=9: substitute y \u2192 2x+3x\u22121=9 \u2192 x=2, y=5" },
      ],
    },
    "Quadratics": {
      short: [
        { question: "Solve x² − 7x + 10 = 0.\n\n```mermaid\ngraph LR\n  A[\"x² − 7x + 10 = 0\"] -->|\"Factorise\"| B[\"Find p,q: p×q=10, p+q=−7\"]\n  B --> C[\"(x−5)(x−2) = 0\"]\n  C --> D[\"x = 5 or x = 2\"]\n```", answer: "(x−5)(x−2) = 0 → **x = 5 or x = 2**", marks: 2, hint: "Factorise: find two numbers that multiply to 10 and add to −7" },
        { question: "Write x² + 6x + 7 in completed square form.\n\n```mermaid\ngraph LR\n  A[\"x² + 6x + 7\"] -->|\"Half of 6 = 3\"| B[\"(x+3)²\"]\n  B -->|\"(x+3)² = x²+6x+9\"| C[\"Adjust: −9+7 = −2\"]\n  C --> D[\"(x+3)² − 2\"]\n```", answer: "**(x+3)² − 2**", marks: 2, hint: "Halve the x coefficient to find the bracket, then adjust the constant" },
      ],
      mid: [
        { question: "Use the quadratic formula to solve 2x² + 3x − 5 = 0.\n\n```mermaid\ngraph TD\n  A[\"a=2, b=3, c=−5\"] --> B[\"Discriminant: b²−4ac\"]\n  B --> C[\"9 − 4(2)(−5) = 49\"]\n  C --> D[\"x = (−3 ± √49) / 4\"]\n  D --> E[\"x = (−3+7)/4 = 1\"]\n  D --> F[\"x = (−3−7)/4 = −5/2\"]\n```", answer: "x = (−3 ± √(9+40))/4 = (−3 ± 7)/4. **x = 1 or x = −5/2**", marks: 3, hint: "a=2, b=3, c=−5. Calculate b²−4ac first" },
      ],
      long: [
        { question: "A rectangular garden has length (x+5)m and width (x−2)m. Its area is 40m².\n\n```mermaid\ngraph TD\n  subgraph \"Garden\"\n    L[\"Length = (x+5)m\"]\n    W[\"Width = (x−2)m\"]\n  end\n  A[\"Area = 40m²\"]\n  L --> E[\"(x+5)(x−2) = 40\"]\n  W --> E\n  A --> E\n  E --> F[\"Solve quadratic\"]\n```\n\nFind x and hence the dimensions of the garden.", answer: "(x+5)(x−2)=40 → x²+3x−10=40 → x²+3x−50=0. x=(−3±√(9+200))/2=(−3±√209)/2. x=(−3+14.46)/2≈5.73. Length≈**10.73m**, Width≈**3.73m**. Only positive x valid.", marks: 6, hint: "Form the equation, rearrange to =0, use quadratic formula, reject negative solution, find dimensions" },
      ],
      flashcard: [
        { term: "Quadratic Formula", definition: "For ax\u00b2+bx+c=0: x = (\u2212b \u00b1 \u221a(b\u00b2\u22124ac)) / 2a. The discriminant \u0394 = b\u00b2\u22124ac: \u0394>0 two real roots; \u0394=0 one repeated root; \u0394<0 no real roots.", example: "x\u00b2\u22125x+6=0: x=(5\u00b11)/2 \u2192 x=3 or x=2" },
        { term: "Completing the Square", definition: "x\u00b2+bx+c \u2192 (x+b/2)\u00b2\u2212(b/2)\u00b2+c. Used to find the vertex of a parabola, solve quadratics and prove results.", example: "x\u00b2+4x+1 = (x+2)\u00b2\u22123. Vertex at (\u22122, \u22123)" },
        { term: "Discriminant", definition: "b\u00b2\u22124ac determines the number of real solutions. >0: two distinct real roots. =0: one repeated root (tangent to x-axis). <0: no real roots (parabola doesn't cross x-axis).", example: "x\u00b2+2x+5: 4\u221220=\u221216<0 \u2192 no real roots" },
      ],
    },
  },
  "Geometry & Measures": {
    "Angles & Polygons": {
      short: [
        { question: "Find the size of each interior angle of a regular octagon.\n\n```mermaid\ngraph TD\n  A[\"Regular Octagon\"]\n  A --- B[\"n = 8 sides\"]\n  B --- C[\"Sum = (n−2)×180\"]\n  C --- D[\"Each angle = Sum ÷ n\"]\n```", answer: "Sum of interior angles = (8−2)×180 = 1080°. Each angle = 1080÷8 = **135°**", marks: 2, hint: "Sum = (n−2)×180, then divide by n" },
        { question: "Two parallel lines are cut by a transversal. One angle is 65°.\n\n```mermaid\ngraph LR\n  subgraph \"Parallel Lines\"\n    A[\"65°\"] -->|\"Alternate (Z)\"| B[\"65°\"]\n    A -->|\"Co-interior (C)\"| C[\"? °\"]\n  end\n```\n\nState the co-interior angle and give its value.", answer: "Co-interior (same-side interior) angles add up to 180°. Co-interior angle = **115°**", marks: 2, hint: "Co-interior angles are between the parallel lines on the same side — they are supplementary" },
      ],
      mid: [
        { question: "ABCD is a quadrilateral.\n\n```mermaid\ngraph TD\n  A[\"A = 2x\"] --- B[\"B = x+30\"]\n  B --- C[\"C = 3x−10\"]\n  C --- D[\"D = x+20\"]\n  D --- A\n```\n\nFind x and hence all four angles.", answer: "Sum = 360°: 2x + x+30 + 3x−10 + x+20 = 360 → 7x+40 = 360 → x = 320/7 ≈ 45.7°. A≈91.4°, B≈75.7°, C≈127.1°, D≈65.7°", marks: 4, hint: "All four angles of a quadrilateral sum to 360°" },
      ],
      long: [
        { question: "Prove that the exterior angle of a triangle is equal to the sum of the two non-adjacent interior angles.\n\n```mermaid\ngraph LR\n  subgraph \"Triangle\"\n    A[\"angle a\"] --- B[\"angle b\"]\n    B --- C[\"angle c\"]\n    C --- A\n  end\n  C -->|\"straight line\"| D[\"exterior angle d\"]\n```", answer: "Let the triangle have interior angles a, b, c where angle c is adjacent to exterior angle d. On a straight line: c + d = 180°. Interior angles of a triangle: a + b + c = 180°. Therefore c = 180° − a − b. Substituting: d = 180° − c = 180° − (180° − a − b) = a + b. **QED: exterior angle = sum of two non-adjacent interior angles.**", marks: 5, hint: "Use angles on a straight line and angles in a triangle. Set up algebraic expressions." },
      ],
      flashcard: [
        { term: "Angle Rules — Parallel Lines", definition: "Alternate angles (Z-angles): equal. Corresponding angles (F-angles): equal. Co-interior angles (C-angles): add to 180°.", example: "Alternate: both 55°. Co-interior: 55° and 125°" },
        { term: "Polygon Angle Sums", definition: "Sum of interior angles of n-sided polygon = (n−2)×180°. Sum of exterior angles of ANY polygon = 360°. Each exterior angle of regular polygon = 360°÷n.", example: "Pentagon: (5−2)×180=540°; regular pentagon interior angle = 108°" },
        { term: "Circle Theorems", definition: "Angle at centre = 2 × angle at circumference (same arc). Angles in semicircle = 90°. Opposite angles in cyclic quadrilateral add to 180°. Tangent perpendicular to radius.", example: "Arc AB subtends 40° at circumference → 80° at centre" },
      ],
    },
    "Area & Perimeter": {
      short: [
        { question: "Find the area of a trapezium with parallel sides 7cm and 11cm and height 5cm.\n\n```mermaid\ngraph TD\n  subgraph \"Trapezium\"\n    A[\"a = 7cm\"] --- B[\"height = 5cm\"]\n    B --- C[\"b = 11cm\"]\n  end\n  D[\"Area = ½(a+b) × h\"]\n```", answer: "Area = ½(a+b)h = ½(7+11)×5 = **45cm²**", marks: 2, hint: "Area of trapezium = ½ × (sum of parallel sides) × height" },
        { question: "A circle has circumference 31.4cm. Find its area to 1 decimal place.\n\n```mermaid\ngraph LR\n  A[\"C = 31.4cm\"] -->|\"C = 2πr\"| B[\"Find r\"]\n  B -->|\"A = πr²\"| C[\"Find Area\"]\n```", answer: "C = 2πr → r = 31.4/(2π) ≈ 5cm. Area = π×25 ≈ **78.5cm²**", marks: 3, hint: "Find r from the circumference, then use A = πr²" },
      ],
      mid: [
        { question: "A path of uniform width 2m surrounds a rectangular garden 10m × 6m. Find the area of the path.\n\n```mermaid\ngraph TD\n  subgraph \"Outer: 14m × 10m\"\n    subgraph \"Inner Garden: 10m × 6m\"\n      G[\"Garden\"]\n    end\n    P[\"Path width = 2m all around\"]\n  end\n```", answer: "Outer rectangle: (10+4)×(6+4) = 14×10 = 140m². Inner: 10×6=60m². Path area = **80m²**", marks: 3, hint: "Find outer dimensions by adding 2×width to each side" },
      ],
      long: [
        { question: "A sector has radius 8cm and arc length 10cm. Find (a) the angle in radians, (b) the area of the sector, (c) the area of the triangle formed by the two radii and the chord.\n\n```mermaid\ngraph TD\n  A[\"Sector\"] --- B[\"radius = 8cm\"]\n  A --- C[\"arc = 10cm\"]\n  B --> D[\"θ = arc ÷ r\"]\n  D --> E[\"Area sector = ½r²θ\"]\n  D --> F[\"Area triangle = ½r²sinθ\"]\n```", answer: "(a) Arc = rθ → θ = 10/8 = 1.25 rad. (b) Area sector = ½r²θ = ½×64×1.25 = **40cm²**. (c) Area triangle = ½r²sinθ = ½×64×sin(1.25) = 32×0.9490 = **30.37cm²**", marks: 6, hint: "Use arc = rθ, area of sector = ½r²θ, area of triangle = ½r²sinθ" },
      ],
      flashcard: [
        { term: "Key Area Formulas", definition: "Rectangle: l×w. Triangle: ½bh. Trapezium: ½(a+b)h. Circle: πr². Parallelogram: bh. Sector: ½r²θ (radians) or (θ/360)πr² (degrees).", example: "Trapezium with parallel sides 5,9 and height 4: ½(14)(4) = 28" },
        { term: "Arc Length & Sector Area", definition: "Arc length = (θ/360) × 2πr. Sector area = (θ/360) × πr². Or in radians: arc = rθ; sector = ½r²θ.", example: "Sector, r=6, θ=60°: arc = (60/360)×12π = 2π ≈ 6.28cm" },
      ],
    },
    "Pythagoras & Trigonometry": {
      short: [
        { question: "A right-angled triangle has legs 5cm and 12cm. Find the hypotenuse.\n\n```mermaid\ngraph TD\n  A[\"5cm\"] --- B[\"90°\"]\n  B --- C[\"12cm\"]\n  A ---|\"hypotenuse = ?\"| C\n```", answer: "h = √(25+144) = √169 = **13cm**", marks: 2, hint: "a² + b² = c²" },
        { question: "Find angle θ in a right-angled triangle where the opposite side is 6cm and hypotenuse is 10cm.\n\n```mermaid\ngraph TD\n  A[\"θ = ?\"] ---|\"hypotenuse = 10cm\"| B[\"90°\"]\n  B ---|\"opposite = 6cm\"| A\n```", answer: "sin θ = 6/10 = 0.6. θ = sin⁻¹(0.6) = 36.87° ≈ **36.9°**", marks: 2, hint: "sinθ = opposite/hypotenuse" },
      ],
      mid: [
        { question: "A 5m ladder leans against a wall, making an angle of 72° with the ground. How high up the wall does it reach?\n\n```mermaid\ngraph TD\n  W[\"Wall\"] ---|\"height = ?\"| G[\"Ground\"]\n  W ---|\"ladder = 5m\"| L[\"72°\"]\n  L --- G\n```", answer: "Height = 5 × sin(72°) = 5 × 0.951 = 4.755 ≈ **4.76m**", marks: 3, hint: "Draw the triangle. The height is opposite the 72° angle." },
      ],
      long: [
        { question: "Two ships leave a port. Ship A travels 12km due North. Ship B travels 8km on a bearing of 065°. Find the distance between the ships.\n\n```mermaid\ngraph TD\n  P[\"Port\"] -->|\"12km North\"| A[\"Ship A\"]\n  P -->|\"8km bearing 065°\"| B[\"Ship B\"]\n  A ---|\"distance = ?\"| B\n  style P fill:#f59e0b,color:#000\n```", answer: "Using cosine rule. Angle between paths = 65°. c² = 12²+8²−2×12×8×cos65° = 144+64−192×0.4226 = 208−81.14 = 126.86. c = √126.86 ≈ **11.26km**", marks: 6, hint: "The angle between the two directions is 65°. Use the cosine rule: c² = a² + b² − 2ab cosC" },
      ],
      flashcard: [
        { term: "SOHCAHTOA", definition: "Sine = Opposite/Hypotenuse. Cosine = Adjacent/Hypotenuse. Tangent = Opposite/Adjacent. Only applies in right-angled triangles.", example: "tan\u03b8 = 4/3 \u2192 \u03b8 = tan\u207b\u00b9(4/3) = 53.1\u00b0" },
        { term: "Sine Rule", definition: "a/sinA = b/sinB = c/sinC. Use when you know: two angles and a side, or two sides and a non-included angle.", example: "a=7, A=40\u00b0, B=60\u00b0: b = 7sin60\u00b0/sin40\u00b0 = 9.43" },
        { term: "Cosine Rule", definition: "a\u00b2 = b\u00b2 + c\u00b2 \u2212 2bc cosA. Use when you know: three sides, or two sides and the included angle.", example: "a=5, b=7, C=50\u00b0: c\u00b2 = 25+49\u221270cos50\u00b0 = 74\u221244.99 = 29.01, c=5.39" },
      ],
    },
  },
  "Probability": {
    "Basic Probability": {
      short: [
        { question: "A bag contains 4 red, 3 blue and 5 green balls. One is selected at random. Find P(blue or green).", answer: "P(blue or green) = (3+5)/12 = 8/12 = 2/3", marks: 2, hint: "Add favourable outcomes over total outcomes" },
        { question: "The probability of rain on any day is 0.35. What is the probability it does NOT rain?", answer: "P(no rain) = 1 \u2212 0.35 = 0.65", marks: 1, hint: "Probabilities of all outcomes sum to 1" },
      ],
      mid: [
        { question: "P(A) = 0.6, P(B) = 0.4, P(A\u2229B) = 0.2. Find P(A\u222aB).", answer: "P(A\u222aB) = P(A) + P(B) \u2212 P(A\u2229B) = 0.6+0.4\u22120.2 = 0.8", marks: 3, hint: "Use the addition rule: P(A\u222aB) = P(A) + P(B) \u2212 P(A\u2229B)" },
      ],
      long: [
        { question: "Explain the difference between theoretical and experimental probability, and explain why they may differ. Use an example.", answer: "Theoretical probability is calculated from equally likely outcomes (e.g. P(Head) = 1/2). Experimental probability (relative frequency) is based on actual results: frequency \u00f7 total trials. They differ due to random variation \u2014 especially with small samples. As the number of trials increases, experimental probability gets closer to the theoretical value (Law of Large Numbers). Example: Flipping a coin 10 times might give 7 heads (exp. prob = 0.7), but with 10,000 flips it will approach 0.5.", marks: 5, hint: "Define both, explain why they differ, state what happens as sample size increases, give an example" },
      ],
      flashcard: [
        { term: "Probability Scale", definition: "P(event) = number of favourable outcomes \u00f7 total outcomes. Always between 0 (impossible) and 1 (certain). P(A') = 1 \u2212 P(A) where A' is the complement of A.", example: "P(rolling even number) = 3/6 = 1/2" },
        { term: "Mutually Exclusive Events", definition: "Events that cannot happen at the same time. P(A or B) = P(A) + P(B) when A and B are mutually exclusive. e.g. rolling a 3 or a 5 on a single die.", example: "P(3 or 5) = 1/6 + 1/6 = 1/3" },
        { term: "Independent Events", definition: "Events where one outcome doesn't affect the other. P(A and B) = P(A) \u00d7 P(B) for independent events.", example: "P(Heads then Heads) = 1/2 \u00d7 1/2 = 1/4" },
      ],
    },
    "Tree Diagrams": {
      short: [
        { question: "A bag has 3 red and 2 blue balls. One is taken, not replaced, then another is taken. What is P(both red)?\n\n```mermaid\ngraph LR\n  S((\"Start\")) -->|\"3/5\"| R1[\"Red\"]\n  S -->|\"2/5\"| B1[\"Blue\"]\n  R1 -->|\"2/4\"| R2[\"Red ✓\"]\n  R1 -->|\"2/4\"| B2[\"Blue\"]\n  B1 -->|\"3/4\"| R3[\"Red\"]\n  B1 -->|\"1/4\"| B3[\"Blue\"]\n```", answer: "P(R then R) = 3/5 × 2/4 = 6/20 = **3/10**", marks: 2, hint: "After first red ball, there are only 4 balls left, 2 of which are red" },
      ],
      mid: [
        { question: "A box contains 5 red and 3 white counters. Two are drawn without replacement. Find P(one of each colour).\n\n```mermaid\ngraph LR\n  S((\"Start\")) -->|\"5/8\"| R1[\"Red\"]\n  S -->|\"3/8\"| W1[\"White\"]\n  R1 -->|\"4/7\"| R2[\"Red\"]\n  R1 -->|\"3/7\"| W2[\"White ✓\"]\n  W1 -->|\"5/7\"| R3[\"Red ✓\"]\n  W1 -->|\"2/7\"| W3[\"White\"]\n```", answer: "P(RW) = 5/8 × 3/7 = 15/56. P(WR) = 3/8 × 5/7 = 15/56. P(one of each) = 30/56 = **15/28**", marks: 4, hint: "Two branches for first draw, then two branches for each second draw. Don't replace counters." },
      ],
      long: [
        { question: "Three friends independently attempt a puzzle. P(Alice solves it) = 0.7, P(Bob) = 0.5, P(Carly) = 0.6. Find the probability that (a) all three solve it, (b) exactly one solves it.\n\n```mermaid\ngraph LR\n  S((\"Start\")) -->|\"0.7\"| A[\"Alice ✓\"]\n  S -->|\"0.3\"| A2[\"Alice ✗\"]\n  A -->|\"0.5\"| B[\"Bob ✓\"]\n  A -->|\"0.5\"| B2[\"Bob ✗\"]\n  A2 -->|\"0.5\"| B3[\"Bob ✓\"]\n  A2 -->|\"0.5\"| B4[\"Bob ✗\"]\n```\n\nEach Bob branch then splits into Carly (0.6 solves / 0.4 doesn't).", answer: "(a) 0.7×0.5×0.6 = **0.21**. (b) P(A only) = 0.7×0.5×0.4 = 0.14. P(B only) = 0.3×0.5×0.4 = 0.06. P(C only) = 0.3×0.5×0.6 = 0.09. Total = **0.29**", marks: 6, hint: "For exactly one, consider three cases: only Alice, only Bob, only Carly. Use complements for 'doesn't solve'" },
      ],
      flashcard: [
        { term: "Tree Diagrams", definition: "Used to show all possible outcomes of two or more events. Multiply along branches for AND (probability of a path). Add branches for OR (probability of multiple paths).", example: "P(Head then Tail) = 0.5 × 0.5 = 0.25" },
        { term: "Conditional Probability", definition: "P(B|A) = probability of B given A has occurred. For dependent events (without replacement): P(A and B) = P(A) × P(B|A).", example: "Drawing 2 aces from a pack: 4/52 × 3/51 = 12/2652 = 1/221" },
      ],
    },
  },
  "Statistics": {
    "Averages & Spread": {
      short: [
        { question: "Find the median and interquartile range of: 3, 7, 9, 12, 15, 18, 21.", answer: "Median = 12. Q1 = 7, Q3 = 18. IQR = 11", marks: 3, hint: "Order the data. Median = middle value. Q1 = median of lower half, Q3 = median of upper half." },
        { question: "A dataset has mean 14, and 6 values. A 7th value of 21 is added. Find the new mean.", answer: "Total of original 6 values = 6\u00d714 = 84. New total = 84+21 = 105. New mean = 105\u00f77 = 15", marks: 2, hint: "Work backwards from mean to find the total, then add the new value" },
      ],
      mid: [
        { question: "Two classes take a test. Class A: mean 72, standard deviation 8. Class B: mean 72, standard deviation 3. Compare the two classes' performance.", answer: "Both classes have the same mean \u2014 their average performance is identical. However, Class B has a much smaller standard deviation, meaning their scores are more consistent and closely clustered around the mean. Class A has much greater spread, suggesting a wider range of abilities or inconsistent understanding of the material.", marks: 3, hint: "Compare both averages AND spread. What does a larger standard deviation tell you?" },
      ],
      long: [
        { question: "A grouped frequency table shows: 0<x≤10: 5, 10<x≤20: 12, 20<x≤30: 18, 30<x≤40: 9, 40<x≤50: 6. Estimate the mean and identify the modal class.\n\n```mermaid\ngraph LR\n  A[\"Class\"] --> B[\"Midpoint\"]\n  B --> C[\"f × midpoint\"]\n  C --> D[\"Σfx ÷ Σf\"]\n  D --> E[\"Estimated Mean\"]\n```\n\n| Class | f | Midpoint | f×m |\n|-------|---|----------|-----|\n| 0–10 | 5 | 5 | 25 |\n| 10–20 | 12 | 15 | 180 |\n| 20–30 | 18 | 25 | 450 |\n| 30–40 | 9 | 35 | 315 |\n| 40–50 | 6 | 45 | 270 |", answer: "Midpoints: 5,15,25,35,45. Σfx = 25+180+450+315+270 = 1240. Σf = 50. Mean = 1240/50 = **24.8**. Modal class = **20<x≤30** (highest frequency 18).", marks: 6, hint: "Use midpoints to estimate fx for each group. Sum all fx values then divide by total frequency." },
      ],
      flashcard: [
        { term: "Mean, Median, Mode", definition: "Mean = sum \u00f7 count. Median = middle value (ordered). Mode = most common. Mean uses all values (sensitive to outliers). Median resistant to outliers. Mode useful for categorical data.", example: "3,5,5,7,10: mean=6, median=5, mode=5" },
        { term: "Interquartile Range (IQR)", definition: "IQR = Q3 \u2212 Q1. Measures the spread of the middle 50% of data. Less affected by outliers than the range. Used with box plots (box and whisker diagrams).", example: "Q1=15, Q3=35: IQR=20. Values >Q3+1.5\u00d7IQR are outliers" },
        { term: "Standard Deviation", definition: "Measures average spread around the mean. Small SD = data clustered tightly. Large SD = data spread out. Calculated as square root of variance (mean of squared deviations).", example: "Dataset {2,4,6}: mean=4. Deviations: \u22122,0,2. Variance=8/3. SD=1.63" },
      ],
    },
  },
  "Ratio & Proportion": {
    "Ratio & Sharing": {
      short: [
        { question: "Simplify the ratio 36 : 48.", answer: "HCF of 36 and 48 is 12. 36 \u00f7 12 = 3, 48 \u00f7 12 = 4. Simplified ratio = **3 : 4**", marks: 1, hint: "Divide both parts by their highest common factor" },
        { question: "Divide \u00a3120 in the ratio 3 : 5.", answer: "Total parts = 3 + 5 = 8. One part = \u00a3120 \u00f7 8 = \u00a315. Shares: 3 \u00d7 \u00a315 = **\u00a345** and 5 \u00d7 \u00a315 = **\u00a375**", marks: 2, hint: "Find the total number of parts, then calculate one part\u2019s value" },
      ],
      mid: [
        { question: "Two alloys are mixed in the ratio 2 : 3 by mass to make 500g of a mixture. Alloy A costs \u00a38 per gram and Alloy B costs \u00a35 per gram. Find the total cost of the mixture.", answer: "Total parts = 5. Alloy A = (2/5) \u00d7 500 = 200g. Alloy B = (3/5) \u00d7 500 = 300g. Cost = 200 \u00d7 \u00a38 + 300 \u00d7 \u00a35 = \u00a31600 + \u00a31500 = **\u00a33100**", marks: 4, hint: "Find the mass of each alloy first, then multiply by the cost per gram" },
      ],
      long: [
        { question: "The angles in a triangle are in the ratio 2 : 3 : 7. (a) Find each angle. (b) Show that the triangle is obtuse. (c) Find the ratio of the smallest angle to the largest, giving your answer in its simplest form.", answer: "(a) Total parts = 12. One part = 180\u00b0 \u00f7 12 = 15\u00b0. Angles: 2\u00d715 = **30\u00b0**, 3\u00d715 = **45\u00b0**, 7\u00d715 = **105\u00b0**. (b) The largest angle is 105\u00b0 > 90\u00b0, so the triangle is **obtuse**. (c) Smallest : Largest = 30 : 105. HCF = 15. Simplest form = **2 : 7**", marks: 5, hint: "Sum of angles in a triangle = 180\u00b0. Divide by total parts to find one part\u2019s value." },
      ],
      flashcard: [
        { term: "Simplifying Ratios", definition: "Divide all parts of the ratio by their highest common factor (HCF). The ratio remains equivalent but in its lowest terms.", example: "24 : 36 \u2192 HCF = 12 \u2192 2 : 3" },
        { term: "Dividing in a Given Ratio", definition: "Find the total number of parts. Divide the whole amount by total parts to find one part. Multiply each ratio value by one part.", example: "Share \u00a3200 in 3:7 \u2192 10 parts \u2192 1 part = \u00a320 \u2192 shares are \u00a360 and \u00a3140" },
        { term: "Equivalent Ratios", definition: "Ratios are equivalent if one can be obtained from the other by multiplying or dividing all parts by the same number.", example: "1 : 4 = 3 : 12 = 5 : 20 (all equivalent)" },
      ],
    },
    "Direct & Inverse Proportion": {
      short: [
        { question: "y is directly proportional to x. When x = 5, y = 20. Find y when x = 8.", answer: "y = kx \u2192 20 = 5k \u2192 k = 4. When x = 8: y = 4 \u00d7 8 = **32**", marks: 2, hint: "Write y = kx, find k using the given values, then substitute" },
        { question: "y is inversely proportional to x. When x = 3, y = 12. Find y when x = 9.", answer: "y = k/x \u2192 12 = k/3 \u2192 k = 36. When x = 9: y = 36/9 = **4**", marks: 2, hint: "Write y = k/x, find k, then substitute x = 9" },
      ],
      mid: [
        { question: "The time T hours to fill a tank is inversely proportional to the number of pumps n used. With 4 pumps the tank fills in 6 hours. (a) Find an equation for T in terms of n. (b) How long with 8 pumps? (c) How many pumps are needed to fill it in 2 hours?", answer: "T = k/n \u2192 6 = k/4 \u2192 k = 24. (a) **T = 24/n**. (b) T = 24/8 = **3 hours**. (c) 2 = 24/n \u2192 n = **12 pumps**", marks: 4, hint: "Form T = k/n, find k from the given information, then answer each part" },
      ],
      long: [
        { question: "The resistance R of a wire is directly proportional to its length L and inversely proportional to the square of its diameter d. A wire of length 2m and diameter 3mm has resistance 4\u03a9. (a) Write a formula for R. (b) Find R for a wire of length 5m and diameter 1.5mm. (c) What diameter gives R = 9\u03a9 for a 3m wire?", answer: "R = kL/d\u00b2 \u2192 4 = k\u00d72/9 \u2192 k = 18. (a) **R = 18L/d\u00b2**. (b) R = 18\u00d75/1.5\u00b2 = 90/2.25 = **40\u03a9**. (c) 9 = 18\u00d73/d\u00b2 \u2192 d\u00b2 = 6 \u2192 d = \u221a6 \u2248 **2.45mm**", marks: 6, hint: "Write R = kL/d\u00b2, find k, then use the formula for each part. Square the diameter carefully." },
      ],
      flashcard: [
        { term: "Direct Proportion", definition: "y \u221d x means y = kx for some constant k (the constant of proportionality). As x increases, y increases in the same ratio. Graph is a straight line through the origin.", example: "Cost C \u221d weight w: C = 2.50w. 4kg costs \u00a310." },
        { term: "Inverse Proportion", definition: "y \u221d 1/x means y = k/x for some constant k. As x increases, y decreases. Product xy is always constant. Graph is a reciprocal curve.", example: "Speed s \u221d 1/time t: s = 120/t. At 60mph takes 2 hours." },
      ],
    },
    "Map Scales & Speed": {
      short: [
        { question: "A map has scale 1 : 50 000. Two towns are 6cm apart on the map. Find the real distance in km.", answer: "Real distance = 6 \u00d7 50 000 = 300 000 cm = 3000 m = **3 km**", marks: 2, hint: "Multiply the map distance by the scale factor, then convert units" },
        { question: "A car travels 156 km in 2 hours 36 minutes. Calculate its average speed in km/h.", answer: "Time = 2 hours 36 min = 2.6 hours. Speed = 156 \u00f7 2.6 = **60 km/h**", marks: 2, hint: "Convert minutes to a decimal fraction of an hour before dividing" },
      ],
      mid: [
        { question: "A cyclist travels at 15 km/h for 40 minutes, then at 20 km/h for 1 hour 15 minutes. Find the total distance travelled.", answer: "Leg 1: time = 40/60 = 2/3 h. Distance = 15 \u00d7 2/3 = 10 km. Leg 2: time = 1.25 h. Distance = 20 \u00d7 1.25 = 25 km. Total = **35 km**", marks: 3, hint: "Calculate each leg separately using distance = speed \u00d7 time, then add" },
      ],
      long: [
        { question: "A scale drawing of a room uses scale 1 : 40. On the drawing the room is 8.5cm long and 6.2cm wide. (a) Find the real dimensions of the room. (b) Calculate the real area in m\u00b2. (c) Carpet costs \u00a318.50 per m\u00b2. Find the cost to carpet the room.", answer: "(a) Length = 8.5 \u00d7 40 = 340 cm = **3.4 m**. Width = 6.2 \u00d7 40 = 248 cm = **2.48 m**. (b) Area = 3.4 \u00d7 2.48 = **8.432 m\u00b2**. (c) Cost = 8.432 \u00d7 \u00a318.50 = **\u00a3155.99**", marks: 5, hint: "Multiply drawing dimensions by the scale factor. Convert to metres before finding area." },
      ],
      flashcard: [
        { term: "Map Scale", definition: "A ratio comparing map distance to real distance. Scale 1 : n means 1 unit on the map = n units in reality. Multiply map measurement by n to find real distance.", example: "Scale 1:25000. 4cm on map = 4 \u00d7 25000 = 100000cm = 1km" },
        { term: "Speed, Distance, Time", definition: "Speed = Distance \u00f7 Time. Distance = Speed \u00d7 Time. Time = Distance \u00f7 Speed. Units must be consistent (e.g. km and hours give km/h).", example: "180km at 60km/h: Time = 180 \u00f7 60 = 3 hours" },
      ],
    },
  },
  "Sequences & Series": {
    "Linear & Quadratic Sequences": {
      short: [
        { question: "Find the nth term of the sequence: 5, 8, 11, 14, 17, ...", answer: "Common difference = 3. nth term = 3n + 2. Check: n=1 \u2192 5 \u2713, n=2 \u2192 8 \u2713. **nth term = 3n + 2**", marks: 2, hint: "Find the common difference \u2014 this is the coefficient of n. Subtract it from the first term to find the constant." },
        { question: "Is 98 a term in the sequence with nth term 4n \u2212 2? Show working.", answer: "4n \u2212 2 = 98 \u2192 4n = 100 \u2192 n = 25. Since n = 25 is a positive integer, **yes, 98 is the 25th term**.", marks: 2, hint: "Set the nth term formula equal to 98 and solve for n. Check n is a positive whole number." },
      ],
      mid: [
        { question: "A sequence begins: 3, 8, 15, 24, 35, ... (a) Find the second differences. (b) Hence find the nth term formula.", answer: "(a) First differences: 5, 7, 9, 11. Second differences: 2, 2, 2 (constant) \u2014 confirms quadratic. (b) an\u00b2 + bn + c. a = 2/2 = 1. For n=1: 1+b+c=3 \u2192 b+c=2. For n=2: 4+2b+c=8 \u2192 2b+c=4. Subtracting: b=2, c=0. **nth term = n\u00b2 + 2n**. Check: 1+2=3 \u2713, 4+4=8 \u2713", marks: 4, hint: "Constant second differences confirm a quadratic. The coefficient of n\u00b2 is half the second difference." },
      ],
      long: [
        { question: "The nth term of a sequence is n\u00b2 \u2212 3n + 5. (a) Find the first four terms. (b) Show that no term in the sequence equals zero. (c) Find the value of n for which the nth term first exceeds 100.", answer: "(a) n=1: 1\u22123+5=**3**. n=2: 4\u22126+5=**3**. n=3: 9\u22129+5=**5**. n=4: 16\u221212+5=**9**. (b) n\u00b2\u22123n+5=0 has discriminant 9\u221220=\u221211 < 0, so no real solutions \u2014 no term equals zero. (c) n\u00b2\u22123n+5>100 \u2192 n\u00b2\u22123n\u221295>0. Roots: n=(3\u00b1\u221a389)/2 \u2248 (3\u00b119.72)/2. Positive root \u2248 11.36. So **n=12** is the first integer where the term exceeds 100. Check: 144\u221236+5=113 > 100 \u2713", marks: 6, hint: "For part (b) use the discriminant. For part (c) solve the inequality and round up to the nearest integer." },
      ],
      flashcard: [
        { term: "nth Term of Linear Sequence", definition: "For a sequence with common difference d and first term a\u2081: nth term = dn + (a\u2081 \u2212 d). The coefficient of n equals the common difference.", example: "Sequence 7, 10, 13, 16: d=3, nth term = 3n + 4" },
        { term: "Identifying Quadratic Sequences", definition: "If first differences are not constant but second differences are constant, the sequence is quadratic. The coefficient of n\u00b2 = (second difference) \u00f7 2.", example: "Sequence 2, 5, 10, 17: first diff 3,5,7; second diff 2,2 \u2192 coefficient of n\u00b2 = 1" },
        { term: "nth Term of Quadratic Sequence", definition: "Form an\u00b2 + bn + c. Use a = (second difference)/2, then substitute known terms to find b and c using simultaneous equations.", example: "Sequence 1, 4, 9, 16: second diff = 2, a=1, b=0, c=0 \u2192 nth term = n\u00b2" },
      ],
    },
    "Geometric Sequences": {
      short: [
        { question: "A geometric sequence has first term 3 and common ratio 2. Write the first five terms and state the nth term formula.", answer: "Terms: **3, 6, 12, 24, 48**. nth term = 3 \u00d7 2^(n\u22121)", marks: 2, hint: "Multiply each term by the common ratio. General formula: first term \u00d7 r^(n\u22121)" },
        { question: "Find the common ratio of the geometric sequence: 500, 100, 20, 4, ...", answer: "r = 100/500 = 1/5. Check: 20/100 = 1/5 \u2713. **Common ratio = 0.2 (or 1/5)**", marks: 2, hint: "Divide any term by the previous term to find the common ratio" },
      ],
      mid: [
        { question: "A bacteria colony starts with 200 cells and doubles every hour. (a) Write the nth term (where n=1 at t=0 hours). (b) How many cells after 8 hours? (c) After how many hours does the count first exceed 50 000?", answer: "(a) nth term = 200 \u00d7 2^(n\u22121). At t=0 hours, n=1: 200. (b) At 8 hours, n=9: 200 \u00d7 2\u2078 = 200 \u00d7 256 = **51 200 cells**. (c) 200 \u00d7 2^(n\u22121) > 50000 \u2192 2^(n\u22121) > 250 \u2192 (n\u22121) > log\u2082250 \u2248 7.97 \u2192 n \u2265 9 \u2192 t = n\u22121 = **8 hours**", marks: 4, hint: "Set up nth term = 200 \u00d7 2^(n\u22121). For part (c) take logs or try values." },
      ],
      long: [
        { question: "A car is worth \u00a324 000 when new. Its value depreciates by 15% each year. (a) Write a formula for its value V after n years. (b) Find the value after 5 years to the nearest pound. (c) In which year does its value first drop below \u00a310 000? (d) Show that its value never reaches zero.", answer: "(a) **V = 24000 \u00d7 0.85\u207f**. (b) V = 24000 \u00d7 0.85\u2075 = 24000 \u00d7 0.4437 = **\u00a310 649**. (c) 24000 \u00d7 0.85\u207f < 10000 \u2192 0.85\u207f < 5/12. Try n=5: 0.4437 > 0.4167. n=6: 0.85\u2076 = 0.3771 < 0.4167 \u2192 value drops below \u00a310 000 in **year 6**. (d) 0.85\u207f > 0 for all finite n since 0.85 > 0, so V > 0 for all n \u2014 the value never reaches exactly zero.", marks: 7, hint: "Depreciation by 15% means multiply by 0.85 each year. Use trial values or logarithms for part (c)." },
      ],
      flashcard: [
        { term: "Geometric Sequence", definition: "A sequence where each term is found by multiplying the previous term by a fixed number called the common ratio r. nth term = ar^(n\u22121) where a is the first term.", example: "a=5, r=3: sequence is 5, 15, 45, 135. nth term = 5 \u00d7 3^(n\u22121)" },
        { term: "Growth & Decay", definition: "Exponential growth: multiply by r > 1 repeatedly. Exponential decay: multiply by 0 < r < 1 repeatedly. Formula: Amount = Initial \u00d7 r\u207f after n steps.", example: "\u00a31000 at 4% interest: after n years = 1000 \u00d7 1.04\u207f" },
      ],
    },
  },
  "Graphs & Functions": {
    "Straight Line Graphs": {
      short: [
        { question: "Find the gradient and y-intercept of the line 3y \u2212 6x = 9.", answer: "Rearrange: 3y = 6x + 9 \u2192 y = 2x + 3. **Gradient = 2, y-intercept = 3**", marks: 2, hint: "Rearrange into y = mx + c form. m is the gradient, c is the y-intercept." },
        { question: "Find the equation of the line passing through (2, 5) and (6, 13).", answer: "Gradient = (13\u22125)/(6\u22122) = 8/4 = 2. Using y\u22125 = 2(x\u22122): y = 2x + 1. **y = 2x + 1**", marks: 2, hint: "Calculate gradient = (y\u2082\u2212y\u2081)/(x\u2082\u2212x\u2081), then substitute one point into y = mx + c" },
      ],
      mid: [
        { question: "Line L\u2081 has equation y = 3x \u2212 4. Line L\u2082 is perpendicular to L\u2081 and passes through (6, 1). Find the equation of L\u2082 and the coordinates where L\u2082 crosses the x-axis.", answer: "Gradient of L\u2081 = 3. Perpendicular gradient = \u22121/3. L\u2082: y \u2212 1 = \u2212(1/3)(x \u2212 6) \u2192 y = \u2212x/3 + 3. x-axis: y=0 \u2192 x = 9. **L\u2082: y = \u2212x/3 + 3. Crosses x-axis at (9, 0)**", marks: 4, hint: "Perpendicular gradient = \u22121/m. Substitute the point to find c, then set y=0 for the x-intercept." },
      ],
      long: [
        { question: "Triangle ABC has vertices A(1, 2), B(5, 4) and C(3, 8). (a) Find the equations of sides AB and BC. (b) Show that AB and BC are perpendicular. (c) Find the midpoint M of AC and the equation of the line through M parallel to AB.", answer: "(a) AB: gradient = (4\u22122)/(5\u22121) = 1/2. y\u22122 = (1/2)(x\u22121) \u2192 **y = x/2 + 3/2**. BC: gradient = (8\u22124)/(3\u22125) = 4/(\u22122) = \u22122. y\u22124 = \u22122(x\u22125) \u2192 **y = \u22122x + 14**. (b) Gradient AB \u00d7 Gradient BC = (1/2) \u00d7 (\u22122) = \u22121 \u2192 **perpendicular** \u2713. (c) M = ((1+3)/2, (2+8)/2) = **(2, 5)**. Parallel to AB so gradient = 1/2. y \u2212 5 = (1/2)(x \u2212 2) \u2192 **y = x/2 + 4**", marks: 6, hint: "Use gradient formula for each side. Two lines are perpendicular if m\u2081 \u00d7 m\u2082 = \u22121. Midpoint = average of coordinates." },
      ],
      flashcard: [
        { term: "y = mx + c", definition: "Equation of a straight line. m = gradient (steepness and direction). c = y-intercept (where line crosses y-axis). Positive m slopes upward; negative m slopes downward.", example: "y = 3x \u2212 2: gradient 3, y-intercept \u22122. Crosses y-axis at (0, \u22122)." },
        { term: "Gradient Between Two Points", definition: "Gradient = (y\u2082 \u2212 y\u2081) / (x\u2082 \u2212 x\u2081). Measures rise over run. Positive = upward slope. Zero = horizontal. Undefined = vertical.", example: "Points (1,3) and (4,9): gradient = (9\u22123)/(4\u22121) = 6/3 = 2" },
        { term: "Parallel & Perpendicular Lines", definition: "Parallel lines have equal gradients. Perpendicular lines have gradients whose product is \u22121 (negative reciprocal). If m\u2081 = 3, perpendicular gradient m\u2082 = \u22121/3.", example: "y=2x+1 and y=2x\u22125 are parallel. y=2x+1 and y=\u2212x/2+3 are perpendicular." },
      ],
    },
    "Curved Graphs & Transformations": {
      short: [
        { question: "Sketch the graph y = x\u00b2 \u2212 4, labelling the y-intercept, x-intercepts and the vertex.", answer: "y-intercept: (0, \u22124). x-intercepts: x\u00b2=4 \u2192 x=\u00b12, so (\u22122, 0) and (2, 0). Vertex (minimum): (0, \u22124). U-shaped parabola symmetric about the y-axis.", marks: 2, hint: "Set x=0 for y-intercept, set y=0 for x-intercepts, vertex is the turning point" },
        { question: "The graph of y = f(x) is translated to give y = f(x \u2212 3) + 2. Describe the transformation.", answer: "Translation by the vector (3, 2) \u2014 the graph moves **3 units to the right** and **2 units up**.", marks: 2, hint: "f(x \u2212 a) shifts right by a; f(x) + b shifts up by b" },
      ],
      mid: [
        { question: "Given f(x) = x\u00b2 + 2x \u2212 3, sketch y = f(x) and y = \u2212f(x) on the same axes, labelling all intercepts and turning points.", answer: "f(x): roots at x=1 and x=\u22123 (factorise: (x+3)(x\u22121)=0). Vertex: complete square \u2192 (x+1)\u00b2\u22124, turning point (\u22121, \u22124). y-intercept (0, \u22123). \u2212f(x) reflects in x-axis: roots same at x=1 and x=\u22123, turning point (\u22121, **4**), y-intercept (0, **3**). Upside-down parabola.", marks: 4, hint: "Factorise f(x) for roots, complete the square for vertex. \u2212f(x) reflects every y-value through x-axis." },
      ],
      long: [
        { question: "The function f(x) = 2^x is defined for all real x. (a) Sketch the graph, labelling the y-intercept and one other point. (b) Describe the graph of y = 2^(x+1) \u2212 3 as a transformation of y = 2^x. (c) Write down the equation of the asymptote of y = 2^(x+1) \u2212 3. (d) Solve 2^(x+1) \u2212 3 = 13, giving an exact answer.", answer: "(a) y-intercept (0, 1); passes through (1, 2). Exponential growth curve approaching but never reaching y=0 as x\u2192\u2212\u221e. (b) Translation by vector (\u22121, \u22123): **1 unit left and 3 units down**. (c) Asymptote: **y = \u22123**. (d) 2^(x+1) = 16 \u2192 2^(x+1) = 2\u2074 \u2192 x+1 = 4 \u2192 **x = 3**", marks: 6, hint: "y = 2^x has asymptote y=0. Translations shift the whole graph including the asymptote. For part (d) write 16 as a power of 2." },
      ],
      flashcard: [
        { term: "Graph Transformations", definition: "y = f(x+a): shift left by a. y = f(x\u2212a): shift right by a. y = f(x)+b: shift up by b. y = f(x)\u2212b: shift down by b. y = \u2212f(x): reflect in x-axis. y = f(\u2212x): reflect in y-axis. y = af(x): stretch vertically by factor a.", example: "y=(x\u22122)\u00b2+3 is y=x\u00b2 shifted right 2 and up 3. Vertex at (2,3)." },
        { term: "Key Curve Shapes", definition: "Quadratic (y=x\u00b2): U-shape. Cubic (y=x\u00b3): S-shape through origin. Reciprocal (y=1/x): two branches, asymptotes at x=0 and y=0. Exponential (y=a^x): always positive, y-intercept at 1.", example: "y=1/x passes through (1,1) and (\u22121,\u22121). Never touches the axes." },
      ],
    },
    "Distance-Time & Velocity-Time Graphs": {
      short: [
        { question: "A distance-time graph shows a straight line from (0, 0) to (4, 120). Find the speed.", answer: "Speed = gradient = (120 \u2212 0) / (4 \u2212 0) = **30 km/h**", marks: 1, hint: "Speed = gradient of a distance-time graph" },
        { question: "On a velocity-time graph, a vehicle accelerates uniformly from 10 m/s to 34 m/s in 8 seconds. Find the acceleration.", answer: "Acceleration = gradient = (34 \u2212 10) / 8 = 24/8 = **3 m/s\u00b2**", marks: 2, hint: "Acceleration = gradient of a velocity-time graph" },
      ],
      mid: [
        { question: "A velocity-time graph shows: 0\u22125s constant acceleration from 0 to 20 m/s; 5\u221215s constant velocity 20 m/s; 15\u221220s uniform deceleration to rest. (a) Find the acceleration in the first 5s. (b) Find the total distance travelled.", answer: "(a) a = (20 \u2212 0)/5 = **4 m/s\u00b2**. (b) Area under graph = triangle + rectangle + triangle. Triangle 1: \u00bd\u00d75\u00d720 = 50m. Rectangle: 10\u00d720 = 200m. Triangle 2: \u00bd\u00d75\u00d720 = 50m. Total = **300m**", marks: 4, hint: "Acceleration = gradient. Distance = area under the velocity-time graph (triangles and rectangles)." },
      ],
      long: [
        { question: "A train leaves station A at rest and travels to station B. Its velocity-time graph has the following sections: accelerates uniformly at 0.5 m/s\u00b2 for 60s; travels at constant velocity for 5 minutes; decelerates uniformly to rest in 40s. (a) Find the maximum velocity. (b) Calculate the total distance A to B. (c) Find the average speed for the whole journey.", answer: "(a) v = u + at = 0 + 0.5 \u00d7 60 = **30 m/s**. (b) Area 1 (triangle): \u00bd\u00d760\u00d730 = 900m. Area 2 (rectangle): 300\u00d730 = 9000m. Area 3 (triangle): \u00bd\u00d740\u00d730 = 600m. Total = **10 500m (10.5km)**. (c) Total time = 60+300+40 = 400s. Average speed = 10500 \u00f7 400 = **26.25 m/s**", marks: 6, hint: "Sketch the graph first. Maximum velocity reached after acceleration phase. Total distance = total area. Average speed = total distance \u00f7 total time." },
      ],
      flashcard: [
        { term: "Distance-Time Graphs", definition: "Gradient = speed. Steeper gradient = faster speed. Horizontal line = stationary. Negative gradient = returning to start. Curved section = changing speed (acceleration/deceleration).", example: "Line from (0,0) to (3, 60): speed = 60\u00f73 = 20 m/s" },
        { term: "Velocity-Time Graphs", definition: "Gradient = acceleration (positive = speeding up, negative = slowing down). Area under graph = distance travelled. Horizontal line = constant velocity (zero acceleration).", example: "Triangle from 0 to 10s reaching 20m/s: distance = \u00bd\u00d710\u00d720 = 100m" },
      ],
    },
  },
  "Vectors": {
    "Vector Arithmetic": {
      short: [
        { question: "Vector **a** = (3, \u22121) and vector **b** = (\u22122, 5). Find **a** + 2**b** as a column vector.", answer: "2**b** = (\u22124, 10). **a** + 2**b** = (3 + (\u22124), \u22121 + 10) = **(\u22121, 9)**", marks: 2, hint: "Multiply b by 2 first, then add component by component" },
        { question: "Find the magnitude of the vector **v** = (5, \u221212).", answer: "|**v**| = \u221a(5\u00b2 + (\u221212)\u00b2) = \u221a(25 + 144) = \u221a169 = **13**", marks: 2, hint: "Magnitude = \u221a(x\u00b2 + y\u00b2) using Pythagoras\u2019 theorem" },
      ],
      mid: [
        { question: "OABC is a parallelogram. OA = **a** and OC = **c**. M is the midpoint of AB. (a) Write OB in terms of **a** and **c**. (b) Write OM in terms of **a** and **c**.", answer: "(a) OB = OA + AB = OA + OC = **a + c**. (b) AM = \u00bdAB = \u00bd**c** (since AB = OC = **c** in a parallelogram). OM = OA + AM = **a** + \u00bd**c**", marks: 4, hint: "In a parallelogram, opposite sides are equal vectors. Find a path from O to each point using the given vectors." },
      ],
      long: [
        { question: "OPQ is a triangle. OP = **p** and OQ = **q**. R is the point on PQ such that PR : RQ = 2 : 1. S is the midpoint of OQ. (a) Find OR in terms of **p** and **q**. (b) Find SR in terms of **p** and **q**. (c) Show that O, S and R are not collinear.", answer: "(a) PR/PQ = 2/3. OR = OP + PR = **p** + (2/3)(OQ \u2212 OP) = **p** + (2/3)(**q** \u2212 **p**) = (1/3)**p** + (2/3)**q**. (b) OS = \u00bd**q**. SR = OR \u2212 OS = (1/3)**p** + (2/3)**q** \u2212 \u00bd**q** = (1/3)**p** + (1/6)**q**. (c) If collinear, SR = k \u00d7 OS for some scalar k. SR = (1/3)**p** + (1/6)**q**. OS = \u00bd**q**. For collinearity need coefficient of **p** = 0, but (1/3) \u2260 0. Therefore **O, S and R are not collinear**.", marks: 6, hint: "Use vector path: OR = OP + (2/3)PQ. For collinearity, one vector must be a scalar multiple of the other \u2014 check if this is possible." },
      ],
      flashcard: [
        { term: "Column Vector Notation", definition: "A vector is written as a column: (x, y) where x is the horizontal component and y is the vertical component. Adding vectors: add components separately. Scalar multiplication: multiply each component.", example: "(2, 3) + (\u22121, 4) = (1, 7). 3\u00d7(2, 1) = (6, 3)" },
        { term: "Magnitude of a Vector", definition: "For vector **v** = (x, y): |**v**| = \u221a(x\u00b2 + y\u00b2). This is the length of the vector, found using Pythagoras\u2019 theorem.", example: "**v** = (\u22123, 4): |**v**| = \u221a(9+16) = \u221a25 = 5" },
      ],
    },
  },
  "3D Geometry": {
    "Volume & Surface Area of 3D Shapes": {
      short: [
        { question: "A cylinder has radius 4cm and height 10cm. Find (a) its volume and (b) its curved surface area. Give answers in terms of \u03c0.", answer: "(a) V = \u03c0r\u00b2h = \u03c0 \u00d7 16 \u00d7 10 = **160\u03c0 cm\u00b3**. (b) Curved SA = 2\u03c0rh = 2 \u00d7 \u03c0 \u00d7 4 \u00d7 10 = **80\u03c0 cm\u00b2**", marks: 2, hint: "Volume of cylinder = \u03c0r\u00b2h. Curved surface area = 2\u03c0rh (the rectangle that wraps around)." },
        { question: "A sphere has radius 6cm. Find its volume to 1 decimal place.", answer: "V = (4/3)\u03c0r\u00b3 = (4/3) \u00d7 \u03c0 \u00d7 216 = 288\u03c0 \u2248 **904.8 cm\u00b3**", marks: 2, hint: "Volume of sphere = (4/3)\u03c0r\u00b3" },
      ],
      mid: [
        { question: "A cone has base radius 5cm and slant height 13cm. Find (a) the perpendicular height, (b) the volume, (c) the total surface area. Give answers to 3 significant figures.", answer: "(a) h = \u221a(13\u00b2 \u2212 5\u00b2) = \u221a(169 \u2212 25) = \u221a144 = **12 cm**. (b) V = (1/3)\u03c0r\u00b2h = (1/3)\u03c0\u00d725\u00d712 = 100\u03c0 \u2248 **314 cm\u00b3**. (c) Total SA = \u03c0r\u00b2 + \u03c0rl = \u03c0\u00d725 + \u03c0\u00d75\u00d713 = 25\u03c0 + 65\u03c0 = 90\u03c0 \u2248 **283 cm\u00b2**", marks: 4, hint: "Use Pythagoras to find perpendicular height from slant height. Total SA = base area + curved surface area = \u03c0r\u00b2 + \u03c0rl." },
      ],
      long: [
        { question: "A solid is made by placing a hemisphere of radius 4cm on top of a cylinder of radius 4cm and height 9cm. (a) Find the total volume of the solid. (b) Find the total surface area of the solid. Give answers in terms of \u03c0.", answer: "(a) V cylinder = \u03c0\u00d716\u00d79 = 144\u03c0. V hemisphere = (1/2)\u00d7(4/3)\u03c0\u00d764 = 128\u03c0/3. Total V = 144\u03c0 + 128\u03c0/3 = 432\u03c0/3 + 128\u03c0/3 = **560\u03c0/3 cm\u00b3** \u2248 587 cm\u00b3. (b) SA includes: top curved surface of hemisphere = 2\u03c0r\u00b2 = 32\u03c0. Curved surface of cylinder = 2\u03c0rh = 72\u03c0. Base circle of cylinder = \u03c0r\u00b2 = 16\u03c0. Total SA = 32\u03c0 + 72\u03c0 + 16\u03c0 = **120\u03c0 cm\u00b2** \u2248 377 cm\u00b2", marks: 6, hint: "The circular face where hemisphere meets cylinder is internal \u2014 exclude it from surface area. Include base of cylinder and curved hemisphere top." },
      ],
      flashcard: [
        { term: "Volume Formulas", definition: "Cuboid: l\u00d7w\u00d7h. Prism: area of cross-section \u00d7 length. Cylinder: \u03c0r\u00b2h. Cone: (1/3)\u03c0r\u00b2h. Sphere: (4/3)\u03c0r\u00b3. Pyramid: (1/3) \u00d7 base area \u00d7 height.", example: "Cone r=3, h=4: V = (1/3)\u03c0\u00d79\u00d74 = 12\u03c0 \u2248 37.7 cm\u00b3" },
        { term: "Surface Area Formulas", definition: "Cylinder: 2\u03c0r\u00b2 + 2\u03c0rh (two circles + curved surface). Cone: \u03c0r\u00b2 + \u03c0rl where l = slant height. Sphere: 4\u03c0r\u00b2.", example: "Sphere r=5: SA = 4\u03c0\u00d725 = 100\u03c0 \u2248 314 cm\u00b2" },
      ],
    },
    "3D Pythagoras & Trigonometry": {
      short: [
        { question: "Find the length of the space diagonal of a cuboid with dimensions 3cm \u00d7 4cm \u00d7 12cm.", answer: "Face diagonal: d\u2081 = \u221a(3\u00b2 + 4\u00b2) = \u221a25 = 5cm. Space diagonal: d = \u221a(5\u00b2 + 12\u00b2) = \u221a(25 + 144) = \u221a169 = **13 cm**", marks: 3, hint: "Use Pythagoras twice: first across a face, then use that diagonal with the third dimension" },
        { question: "A vertical mast of height 8m stands on horizontal ground. A wire runs from the top of the mast to a point 6m from the base. Find the angle the wire makes with the ground to 1 decimal place.", answer: "tan \u03b8 = opposite/adjacent = 8/6. \u03b8 = tan\u207b\u00b9(8/6) = tan\u207b\u00b9(1.333) \u2248 **53.1\u00b0**", marks: 2, hint: "Draw the right-angled triangle. The angle at the ground uses opposite = 8m, adjacent = 6m." },
      ],
      mid: [
        { question: "A square-based pyramid has base side 10cm and all slant edges of length 13cm. Find (a) the height of the pyramid, (b) the angle that a slant edge makes with the base.", answer: "(a) Half-diagonal of base = (10\u221a2)/2 = 5\u221a2 cm. h = \u221a(13\u00b2 \u2212 (5\u221a2)\u00b2) = \u221a(169 \u2212 50) = \u221a119 \u2248 **10.91 cm**. (b) cos \u03b8 = adjacent/hypotenuse = 5\u221a2/13. \u03b8 = cos\u207b\u00b9(5\u221a2/13) \u2248 cos\u207b\u00b9(0.5440) \u2248 **57.0\u00b0**", marks: 4, hint: "The slant edge goes from a base corner to the apex. Find the distance from the centre of the base to a corner first." },
      ],
      long: [
        { question: "ABCDE is a square-based pyramid where ABCD is the horizontal base with AB = 8cm. E is the apex directly above the centre of the base, with height EF = 6cm (F = centre of ABCD). (a) State EF. (b) Find the angle EAF. (c) Find the slant height from the midpoint of AB to E. (d) Find the angle the slant face makes with the base.", answer: "(a) EF = **6cm**. (b) AF = half diagonal of base = (8\u221a2)/2 = 4\u221a2 cm \u2248 5.657cm. tan\u2220EAF = EF/AF = 6/(4\u221a2) \u2192 \u2220EAF = tan\u207b\u00b9(6/4\u221a2) \u2248 tan\u207b\u00b9(1.0607) \u2248 **46.7\u00b0**. (c) M = midpoint of AB. FM = 4cm (half of 8cm). Slant height ME = \u221a(4\u00b2 + 6\u00b2) = \u221a52 = 2\u221a13 \u2248 **7.21 cm**. (d) Angle = tan\u207b\u00b9(EF/FM) = tan\u207b\u00b9(6/4) \u2248 **56.3\u00b0**", marks: 6, hint: "Draw separate 2D right-angled triangles for each part. For (b) use the diagonal of the base; for (c) use the perpendicular from the centre to a side edge." },
      ],
      flashcard: [
        { term: "3D Pythagoras", definition: "Space diagonal of a cuboid: d = \u221a(l\u00b2 + w\u00b2 + h\u00b2). Applied in two steps: find a face diagonal using a\u00b2 + b\u00b2, then combine with the third dimension.", example: "Cuboid 2\u00d76\u00d73: face diag = \u221a(4+36) = \u221a40. Space diag = \u221a(40+9) = 7" },
        { term: "Angles in 3D Shapes", definition: "Identify the correct right-angled triangle within the 3D shape. The angle between a line and a plane is measured at the point where the line meets the plane, using the projection of the line onto the plane as the adjacent side.", example: "Angle of slant edge to base: use distance from base corner to foot of perpendicular as adjacent, height as opposite." },
      ],
    },
  },
};
