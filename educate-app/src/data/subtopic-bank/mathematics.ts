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
        { question: "A house price rises by 8% in year 1, falls by 5% in year 2, then rises by 3% in year 3. Find the overall percentage change from the start price. Show all working.", answer: "Multiplier = 1.08 \u00d7 0.95 \u00d7 1.03 = 1.08 \u00d7 0.9785 = 1.056... \u00d7 1.03... Let start = \u00a3100. After y1: \u00a3108. After y2: \u00a3108 \u00d7 0.95 = \u00a3102.60. After y3: \u00a3102.60 \u00d7 1.03 = \u00a3105.678. Overall change = +5.678% \u2248 +5.68%", marks: 5, hint: "Apply each multiplier in sequence to a starting value of 100. The final value minus 100 gives the percentage change." },
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
        { question: "Factorise fully: 6x\u00b2y \u2212 9xy\u00b2", answer: "3xy(2x \u2212 3y)", marks: 2, hint: "Find the HCF of all terms: 3xy" },
        { question: "Factorise: x\u00b2 \u2212 9", answer: "(x+3)(x\u22123)", marks: 1, hint: "Difference of two squares: a\u00b2\u2212b\u00b2 = (a+b)(a\u2212b)" },
      ],
      mid: [
        { question: "Factorise fully: 2x\u00b2 + 5x \u2212 12", answer: "ac = \u221224. Pairs: \u22123 and 8. Split: 2x\u00b2 \u2212 3x + 8x \u2212 12 = x(2x\u22123) + 4(2x\u22123) = (x+4)(2x\u22123)", marks: 3, hint: "Multiply a \u00d7 c, find two numbers that multiply to that and add to b, then split the middle term" },
      ],
      long: [
        { question: "Solve 3x\u00b2 \u2212 10x + 8 = 0 by factorising. Show all working.", answer: "ac = 24, need two numbers that multiply to 24 and add to \u221210: \u22124 and \u22126. Split: 3x\u00b2\u22124x\u22126x+8 = x(3x\u22124)\u22122(3x\u22124) = (x\u22122)(3x\u22124) = 0. x = 2 or x = 4/3", marks: 5, hint: "Factorise the quadratic, then set each bracket equal to zero" },
      ],
      flashcard: [
        { term: "Factorising Quadratics (a=1)", definition: "x\u00b2 + bx + c: find two numbers p and q where p\u00d7q = c and p+q = b. Write as (x+p)(x+q).", example: "x\u00b2+7x+12: p\u00d7q=12, p+q=7 \u2192 p=3,q=4 \u2192 (x+3)(x+4)" },
        { term: "Difference of Two Squares", definition: "a\u00b2 \u2212 b\u00b2 = (a+b)(a\u2212b). Spot it when you have two perfect square terms with a minus between them.", example: "25x\u00b2 \u2212 16 = (5x+4)(5x\u22124)" },
        { term: "Factorising when a\u22601", definition: "For ax\u00b2+bx+c: multiply a\u00d7c, find factors of ac that add to b, split middle term, factor by grouping.", example: "6x\u00b2+x\u22122: ac=\u221212, factors \u22123,4; \u2192 6x\u00b2\u22123x+4x\u22122 = 3x(2x\u22121)+2(2x\u22121) = (3x+2)(2x\u22121)" },
      ],
    },
    "Simultaneous Equations": {
      short: [
        { question: "Solve: y = 2x + 1 and y = x + 5", answer: "2x+1 = x+5 \u2192 x = 4, y = 9", marks: 2, hint: "Set the two expressions for y equal to each other" },
      ],
      mid: [
        { question: "Solve: 3x + 2y = 13 and 2x \u2212 y = 4.", answer: "From eq2: y = 2x\u22124. Sub into eq1: 3x+2(2x\u22124)=13 \u2192 7x=21 \u2192 x=3, y=2.", marks: 4, hint: "Rearrange one equation to make y the subject, then substitute" },
      ],
      long: [
        { question: "Solve simultaneously: x\u00b2 + y\u00b2 = 25 and y = x + 1. Show all solutions.", answer: "Sub y=x+1: x\u00b2+(x+1)\u00b2=25 \u2192 x\u00b2+x\u00b2+2x+1=25 \u2192 2x\u00b2+2x\u221224=0 \u2192 x\u00b2+x\u221212=0 \u2192 (x+4)(x\u22123)=0. x=\u22124,y=\u22123 or x=3,y=4.", marks: 6, hint: "Substitute the linear equation into the quadratic, form a quadratic, solve by factorising" },
      ],
      flashcard: [
        { term: "Elimination Method", definition: "Make coefficients of one variable equal (multiply equations if needed), then add or subtract to eliminate that variable. Solve for the remaining variable, then substitute back.", example: "2x+y=7 and x+y=5: subtract \u2192 x=2, then y=3" },
        { term: "Substitution Method", definition: "Rearrange one equation to express one variable in terms of the other. Substitute into the second equation. Useful when one equation is already solved for a variable.", example: "y=3x\u22121 and 2x+y=9: substitute y \u2192 2x+3x\u22121=9 \u2192 x=2, y=5" },
      ],
    },
    "Quadratics": {
      short: [
        { question: "Solve x\u00b2 \u2212 7x + 10 = 0.", answer: "(x\u22125)(x\u22122) = 0 \u2192 x = 5 or x = 2", marks: 2, hint: "Factorise: find two numbers that multiply to 10 and add to \u22127" },
        { question: "Write x\u00b2 + 6x + 7 in completed square form.", answer: "(x+3)\u00b2 \u2212 2", marks: 2, hint: "Halve the x coefficient to find the bracket, then adjust the constant" },
      ],
      mid: [
        { question: "Use the quadratic formula to solve 2x\u00b2 + 3x \u2212 5 = 0.", answer: "x = (\u22123 \u00b1 \u221a(9+40))/4 = (\u22123 \u00b1 7)/4. x = 1 or x = \u22125/2", marks: 3, hint: "a=2, b=3, c=\u22125. Calculate b\u00b2\u22124ac first" },
      ],
      long: [
        { question: "A rectangular garden has length (x+5)m and width (x\u22122)m. Its area is 40m\u00b2. Find x and hence the dimensions of the garden.", answer: "(x+5)(x\u22122)=40 \u2192 x\u00b2+3x\u221210=40 \u2192 x\u00b2+3x\u221250=0. x=(\u22123\u00b1\u221a(9+200))/2=(\u22123\u00b1\u221a209)/2. x=(\u22123+14.46)/2\u22485.73. Length\u224810.73m, Width\u22483.73m. Only positive x valid.", marks: 6, hint: "Form the equation, rearrange to =0, use quadratic formula, reject negative solution, find dimensions" },
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
        { question: "Find the size of each interior angle of a regular octagon.", answer: "Sum of interior angles = (8\u22122)\u00d7180 = 1080\u00b0. Each angle = 1080\u00f78 = 135\u00b0", marks: 2, hint: "Sum = (n\u22122)\u00d7180, then divide by n" },
        { question: "Two parallel lines are cut by a transversal. One angle is 65\u00b0. State the co-interior angle and give its value.", answer: "Co-interior (same-side interior) angles add up to 180\u00b0. Co-interior angle = 115\u00b0", marks: 2, hint: "Co-interior angles are between the parallel lines on the same side \u2014 they are supplementary" },
      ],
      mid: [
        { question: "ABCD is a quadrilateral. Angle A = 2x, B = x+30, C = 3x\u221210, D = x+20. Find x and hence all four angles.", answer: "Sum = 360\u00b0: 2x + x+30 + 3x\u221210 + x+20 = 360 \u2192 7x+40 = 360 \u2192 x = 320/7 \u2248 45.7\u00b0. A\u224891.4\u00b0, B\u224875.7\u00b0, C\u2248127.1\u00b0, D\u224865.7\u00b0", marks: 4, hint: "All four angles of a quadrilateral sum to 360\u00b0" },
      ],
      long: [
        { question: "Prove that the exterior angle of a triangle is equal to the sum of the two non-adjacent interior angles.", answer: "Let the triangle have interior angles a, b, c where angle c is adjacent to exterior angle d. On a straight line: c + d = 180\u00b0. Interior angles of a triangle: a + b + c = 180\u00b0. Therefore c = 180\u00b0 \u2212 a \u2212 b. Substituting: d = 180\u00b0 \u2212 c = 180\u00b0 \u2212 (180\u00b0 \u2212 a \u2212 b) = a + b. QED: exterior angle = sum of two non-adjacent interior angles.", marks: 5, hint: "Use angles on a straight line and angles in a triangle. Set up algebraic expressions." },
      ],
      flashcard: [
        { term: "Angle Rules \u2014 Parallel Lines", definition: "Alternate angles (Z-angles): equal. Corresponding angles (F-angles): equal. Co-interior angles (C-angles): add to 180\u00b0.", example: "Alternate: both 55\u00b0. Co-interior: 55\u00b0 and 125\u00b0" },
        { term: "Polygon Angle Sums", definition: "Sum of interior angles of n-sided polygon = (n\u22122)\u00d7180\u00b0. Sum of exterior angles of ANY polygon = 360\u00b0. Each exterior angle of regular polygon = 360\u00b0\u00f7n.", example: "Pentagon: (5\u22122)\u00d7180=540\u00b0; regular pentagon interior angle = 108\u00b0" },
        { term: "Circle Theorems", definition: "Angle at centre = 2 \u00d7 angle at circumference (same arc). Angles in semicircle = 90\u00b0. Opposite angles in cyclic quadrilateral add to 180\u00b0. Tangent perpendicular to radius.", example: "Arc AB subtends 40\u00b0 at circumference \u2192 80\u00b0 at centre" },
      ],
    },
    "Area & Perimeter": {
      short: [
        { question: "Find the area of a trapezium with parallel sides 7cm and 11cm and height 5cm.", answer: "Area = \u00bd(a+b)h = \u00bd(7+11)\u00d75 = 45cm\u00b2", marks: 2, hint: "Area of trapezium = \u00bd \u00d7 (sum of parallel sides) \u00d7 height" },
        { question: "A circle has circumference 31.4cm. Find its area to 1 decimal place.", answer: "C = 2\u03c0r \u2192 r = 31.4/(2\u03c0) \u2248 5cm. Area = \u03c0\u00d725 \u2248 78.5cm\u00b2", marks: 3, hint: "Find r from the circumference, then use A = \u03c0r\u00b2" },
      ],
      mid: [
        { question: "A path of uniform width 2m surrounds a rectangular garden 10m \u00d7 6m. Find the area of the path.", answer: "Outer rectangle: (10+4)\u00d7(6+4) = 14\u00d710 = 140m\u00b2. Inner: 10\u00d76=60m\u00b2. Path area = 80m\u00b2", marks: 3, hint: "Find outer dimensions by adding 2\u00d7width to each side" },
      ],
      long: [
        { question: "A sector has radius 8cm and arc length 10cm. Find (a) the angle in radians, (b) the area of the sector, (c) the area of the triangle formed by the two radii and the chord.", answer: "(a) Arc = r\u03b8 \u2192 \u03b8 = 10/8 = 1.25 rad. (b) Area sector = \u00bdr\u00b2\u03b8 = \u00bd\u00d764\u00d71.25 = 40cm\u00b2. (c) Area triangle = \u00bdr\u00b2sin\u03b8 = \u00bd\u00d764\u00d7sin(1.25) = 32\u00d70.9490 = 30.37cm\u00b2", marks: 6, hint: "Use arc = r\u03b8, area of sector = \u00bdr\u00b2\u03b8, area of triangle = \u00bdr\u00b2sin\u03b8" },
      ],
      flashcard: [
        { term: "Key Area Formulas", definition: "Rectangle: l\u00d7w. Triangle: \u00bdbh. Trapezium: \u00bd(a+b)h. Circle: \u03c0r\u00b2. Parallelogram: bh. Sector: \u00bdr\u00b2\u03b8 (radians) or (\u03b8/360)\u03c0r\u00b2 (degrees).", example: "Trapezium with parallel sides 5,9 and height 4: \u00bd(14)(4) = 28" },
        { term: "Arc Length & Sector Area", definition: "Arc length = (\u03b8/360) \u00d7 2\u03c0r. Sector area = (\u03b8/360) \u00d7 \u03c0r\u00b2. Or in radians: arc = r\u03b8; sector = \u00bdr\u00b2\u03b8.", example: "Sector, r=6, \u03b8=60\u00b0: arc = (60/360)\u00d712\u03c0 = 2\u03c0 \u2248 6.28cm" },
      ],
    },
    "Pythagoras & Trigonometry": {
      short: [
        { question: "A right-angled triangle has legs 5cm and 12cm. Find the hypotenuse.", answer: "h = \u221a(25+144) = \u221a169 = 13cm", marks: 2, hint: "a\u00b2 + b\u00b2 = c\u00b2" },
        { question: "Find angle \u03b8 in a right-angled triangle where the opposite side is 6cm and hypotenuse is 10cm.", answer: "sin \u03b8 = 6/10 = 0.6. \u03b8 = sin\u207b\u00b9(0.6) = 36.87\u00b0 \u2248 36.9\u00b0", marks: 2, hint: "sin\u03b8 = opposite/hypotenuse" },
      ],
      mid: [
        { question: "A 5m ladder leans against a wall, making an angle of 72\u00b0 with the ground. How high up the wall does it reach?", answer: "Height = 5 \u00d7 sin(72\u00b0) = 5 \u00d7 0.951 = 4.755 \u2248 4.76m", marks: 3, hint: "Draw the triangle. The height is opposite the 72\u00b0 angle." },
      ],
      long: [
        { question: "Two ships leave a port. Ship A travels 12km due North. Ship B travels 8km on a bearing of 065\u00b0. Find the distance between the ships.", answer: "Using cosine rule. Angle between paths = 65\u00b0. c\u00b2 = 12\u00b2+8\u00b2\u22122\u00d712\u00d78\u00d7cos65\u00b0 = 144+64\u2212192\u00d70.4226 = 208\u221281.14 = 126.86. c = \u221a126.86 \u2248 11.26km", marks: 6, hint: "The angle between the two directions is 65\u00b0. Use the cosine rule: c\u00b2 = a\u00b2 + b\u00b2 \u2212 2ab cosC" },
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
        { question: "A bag has 3 red and 2 blue balls. One is taken, not replaced, then another is taken. What is P(both red)?", answer: "P(R then R) = 3/5 \u00d7 2/4 = 6/20 = 3/10", marks: 2, hint: "After first red ball, there are only 4 balls left, 2 of which are red" },
      ],
      mid: [
        { question: "A box contains 5 red and 3 white counters. Two are drawn without replacement. Draw a tree diagram and find P(one of each colour).", answer: "P(RW) = 5/8 \u00d7 3/7 = 15/56. P(WR) = 3/8 \u00d7 5/7 = 15/56. P(one of each) = 30/56 = 15/28", marks: 4, hint: "Two branches for first draw, then two branches for each second draw. Don't replace counters." },
      ],
      long: [
        { question: "Three friends independently attempt a puzzle. P(Alice solves it) = 0.7, P(Bob) = 0.5, P(Carly) = 0.6. Find the probability that (a) all three solve it, (b) exactly one solves it.", answer: "(a) 0.7\u00d70.5\u00d70.6 = 0.21. (b) P(A only) = 0.7\u00d70.5\u00d70.4 = 0.14. P(B only) = 0.3\u00d70.5\u00d70.4 = 0.06. P(C only) = 0.3\u00d70.5\u00d70.6 = 0.09. Total = 0.29", marks: 6, hint: "For exactly one, consider three cases: only Alice, only Bob, only Carly. Use complements for 'doesn't solve'" },
      ],
      flashcard: [
        { term: "Tree Diagrams", definition: "Used to show all possible outcomes of two or more events. Multiply along branches for AND (probability of a path). Add branches for OR (probability of multiple paths).", example: "P(Head then Tail) = 0.5 \u00d7 0.5 = 0.25" },
        { term: "Conditional Probability", definition: "P(B|A) = probability of B given A has occurred. For dependent events (without replacement): P(A and B) = P(A) \u00d7 P(B|A).", example: "Drawing 2 aces from a pack: 4/52 \u00d7 3/51 = 12/2652 = 1/221" },
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
        { question: "A grouped frequency table shows: 0<x\u226410: 5, 10<x\u226420: 12, 20<x\u226430: 18, 30<x\u226440: 9, 40<x\u226450: 6. Estimate the mean and identify the modal class.", answer: "Midpoints: 5,15,25,35,45. \u03a3fx = 5\u00d75+12\u00d715+18\u00d725+9\u00d735+6\u00d745 = 25+180+450+315+270 = 1240. \u03a3f = 50. Mean = 1240/50 = 24.8. Modal class = 20<x\u226430 (highest frequency 18).", marks: 6, hint: "Use midpoints to estimate fx for each group. Sum all fx values then divide by total frequency." },
      ],
      flashcard: [
        { term: "Mean, Median, Mode", definition: "Mean = sum \u00f7 count. Median = middle value (ordered). Mode = most common. Mean uses all values (sensitive to outliers). Median resistant to outliers. Mode useful for categorical data.", example: "3,5,5,7,10: mean=6, median=5, mode=5" },
        { term: "Interquartile Range (IQR)", definition: "IQR = Q3 \u2212 Q1. Measures the spread of the middle 50% of data. Less affected by outliers than the range. Used with box plots (box and whisker diagrams).", example: "Q1=15, Q3=35: IQR=20. Values >Q3+1.5\u00d7IQR are outliers" },
        { term: "Standard Deviation", definition: "Measures average spread around the mean. Small SD = data clustered tightly. Large SD = data spread out. Calculated as square root of variance (mean of squared deviations).", example: "Dataset {2,4,6}: mean=4. Deviations: \u22122,0,2. Variance=8/3. SD=1.63" },
      ],
    },
  },
};
