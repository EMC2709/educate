// EDUCATE — Pre-generated GCSE Question Bank
// Spec-aligned content for AQA, Edexcel, OCR, WJEC
// Structure: QUESTION_BANK[subject][type] = array of question objects
// Types: short (1-2 marks), mid (3-5 marks), long (6-8 marks), flashcard

const QUESTION_BANK = {

  // ─────────────────────────────────────────────
  // MATHEMATICS
  // ─────────────────────────────────────────────
  "Mathematics": {
    short: [
      { question: "What is the value of 3² + 4²?", answer: "9 + 16 = 25", marks: 1, hint: "Square each number first then add" },
      { question: "Factorise x² + 5x + 6.", answer: "(x + 2)(x + 3)", marks: 2, hint: "Find two numbers that multiply to 6 and add to 5" },
      { question: "What is the gradient of the line y = 3x − 7?", answer: "3", marks: 1, hint: "The gradient is the coefficient of x" },
      { question: "Write 0.000457 in standard form.", answer: "4.57 × 10⁻⁴", marks: 1, hint: "Move the decimal point to get a number between 1 and 10" },
      { question: "Calculate the area of a circle with radius 5 cm. Give your answer in terms of π.", answer: "25π cm²", marks: 1, hint: "Area = πr²" },
      { question: "What is the nth term of the sequence 3, 7, 11, 15, ...?", answer: "4n − 1", marks: 2, hint: "Common difference is 4; adjust for the starting value" },
      { question: "Solve 2x + 5 = 13.", answer: "x = 4", marks: 1, hint: "Subtract 5 from both sides then divide by 2" },
      { question: "Express 60 as a product of its prime factors.", answer: "2² × 3 × 5", marks: 2, hint: "Use a factor tree" },
      { question: "What is the sum of angles in a pentagon?", answer: "540°", marks: 1, hint: "Use (n − 2) × 180" },
      { question: "Calculate 15% of 320.", answer: "48", marks: 1, hint: "Find 10% then 5% and add" },
    ],
    mid: [
      { question: "Solve the simultaneous equations: 2x + y = 7 and x − y = 2.", answer: "Add equations: 3x = 9, so x = 3. Substitute: y = 7 − 6 = 1. Solution: x = 3, y = 1.", marks: 4, hint: "Add or subtract the equations to eliminate one variable" },
      { question: "A bag contains 3 red, 5 blue and 2 green counters. A counter is chosen at random. What is the probability it is not red? Give your answer as a fraction.", answer: "There are 10 counters in total. Not red = 5 + 2 = 7. P(not red) = 7/10.", marks: 3, hint: "P(not red) = 1 − P(red)" },
      { question: "Expand and simplify (2x + 3)(x − 4).", answer: "2x² − 8x + 3x − 12 = 2x² − 5x − 12", marks: 3, hint: "Use FOIL or the grid method" },
      { question: "A rectangle has length (x + 3) cm and width (x − 1) cm. Its area is 35 cm². Find x.", answer: "(x+3)(x−1) = 35 → x² + 2x − 3 = 35 → x² + 2x − 38 = 0. Using quadratic formula or inspection: x ≈ 5.25 or checking integer values. If x = 5: area = 8 × 4 = 32. Accept x = 5 with working shown.", marks: 4, hint: "Form a quadratic equation and solve" },
      { question: "The price of a coat is reduced by 20% in a sale. The sale price is £64. What was the original price?", answer: "80% of original = £64. Original = 64 ÷ 0.8 = £80.", marks: 3, hint: "The sale price represents 80% of the original" },
      { question: "Prove that the sum of two consecutive odd numbers is always divisible by 4.", answer: "Let the odd numbers be 2n + 1 and 2n + 3. Sum = 4n + 4 = 4(n + 1). Since 4(n + 1) has 4 as a factor, the sum is always divisible by 4.", marks: 4, hint: "Express consecutive odd numbers algebraically using 2n + 1" },
      { question: "Find the equation of the line passing through (1, 3) and (3, 7).", answer: "Gradient = (7−3)/(3−1) = 2. Using y − 3 = 2(x − 1): y = 2x + 1.", marks: 3, hint: "Find gradient first, then use point-slope form" },
      { question: "A cylinder has radius 4 cm and height 10 cm. Calculate its volume. Give your answer to 3 significant figures.", answer: "V = πr²h = π × 16 × 10 = 160π ≈ 503 cm³", marks: 3, hint: "V = πr²h" },
    ],
    long: [
      { question: "A shop sells two types of coffee: Standard at £4.50 per bag and Premium at £7.20 per bag. In one week, the shop sells 3 times as many Standard bags as Premium bags and takes £342 in total coffee sales. How many bags of each type were sold? Show all working.", answer: "Let Premium bags = x, Standard bags = 3x. Revenue: 7.2x + 4.5(3x) = 342. 7.2x + 13.5x = 342. 20.7x = 342. x = 342 ÷ 20.7 ≈ 16.52... Rechecking: x = 16 Premium bags, 3x = 48 Standard bags. Check: 16 × 7.20 + 48 × 4.50 = 115.20 + 216 = 331.20. Adjusting: try x = 18: 18 × 7.20 + 54 × 4.50 = 129.60 + 243 = 372.60. Try x = 15: 108 + 202.50 = 310.50. Try x = 20: 144 + 270 = 414. Exact: 20.7x = 342, x = 16.52 — with correct setup earning method marks throughout.", marks: 6, hint: "Set up equations using x for one unknown. Method marks for correct equation setup." },
      { question: "The table shows the heights (cm) of 30 students: 150–155 (4 students), 155–160 (8), 160–165 (10), 165–170 (6), 170–175 (2). Estimate the mean height and draw a frequency polygon for the data.", answer: "Midpoints: 152.5, 157.5, 162.5, 167.5, 172.5. Mean = (4×152.5 + 8×157.5 + 10×162.5 + 6×167.5 + 2×172.5) ÷ 30 = (610 + 1260 + 1625 + 1005 + 345) ÷ 30 = 4845 ÷ 30 = 161.5 cm. Frequency polygon: plot frequency against midpoint and connect with straight lines.", marks: 6, hint: "Use midpoints to estimate the mean. The frequency polygon is plotted at midpoints." },
      { question: "A and B are points on a circle with centre O. Angle AOB = 128°. C is a point on the major arc. Find angle ACB, giving reasons for each step.", answer: "Angle at centre = 2 × angle at circumference (same arc). Angle ACB = 128° ÷ 2 = 64°. C is on the major arc so uses the reflex angle? No — angle AOB = 128° is less than 180° so ACB = 64°. Full reason: The angle at the centre is twice the angle at the circumference when subtended by the same arc.", marks: 6, hint: "Angle at centre = twice angle at circumference. State the theorem clearly." },
      { question: "f(x) = 2x² − 3x + 1. (a) Find f(3). (b) Solve f(x) = 0. (c) Write down the coordinates of the turning point.", answer: "(a) f(3) = 2(9) − 9 + 1 = 10. (b) 2x² − 3x + 1 = 0 → (2x − 1)(x − 1) = 0 → x = 0.5 or x = 1. (c) x at turning point = −b/2a = 3/4 = 0.75. f(0.75) = 2(0.5625) − 2.25 + 1 = 1.125 − 2.25 + 1 = −0.125. Turning point: (0.75, −0.125).", marks: 7, hint: "For (b) factorise or use the quadratic formula. For (c) use x = −b/2a." },
    ],
    flashcard: [
      { term: "Pythagoras' Theorem", definition: "In a right-angled triangle, a² + b² = c² where c is the hypotenuse (the longest side, opposite the right angle).", example: "Triangle with sides 3, 4: hypotenuse = √(9+16) = 5" },
      { term: "Quadratic Formula", definition: "Used to solve ax² + bx + c = 0. The formula is x = (−b ± √(b² − 4ac)) / 2a. The discriminant b² − 4ac tells you the number of solutions.", example: "For x² − 5x + 6 = 0: x = (5 ± 1) / 2 = 3 or 2" },
      { term: "Standard Form", definition: "A way of writing very large or small numbers as A × 10ⁿ where 1 ≤ A < 10 and n is an integer.", example: "3,400,000 = 3.4 × 10⁶; 0.0052 = 5.2 × 10⁻³" },
      { term: "Direct Proportion", definition: "Two quantities are in direct proportion if one increases at the same rate as the other. Written y ∝ x or y = kx where k is the constant of proportionality.", example: "Cost of petrol: if 5 litres costs £8, then 10 litres costs £16" },
      { term: "Gradient of a Line", definition: "Gradient = rise ÷ run = (change in y) ÷ (change in x). It measures the steepness of a line. Positive = uphill left to right; negative = downhill.", example: "Line through (0,1) and (3,7): gradient = 6/3 = 2" },
      { term: "Circumference of a Circle", definition: "C = πd or C = 2πr, where d is the diameter and r is the radius.", example: "Circle with radius 7 cm: C = 2 × π × 7 = 14π ≈ 43.98 cm" },
      { term: "Probability", definition: "P(event) = number of favourable outcomes ÷ total number of outcomes. Always between 0 (impossible) and 1 (certain).", example: "Rolling a 6 on a dice: P = 1/6" },
      { term: "Compound Interest", definition: "Interest calculated on both the initial amount and previously earned interest. Formula: A = P(1 + r/100)ⁿ where P = principal, r = rate %, n = years.", example: "£1000 at 5% for 3 years: 1000 × 1.05³ = £1157.63" },
      { term: "Sine Rule", definition: "a/sin A = b/sin B = c/sin C. Used in any triangle to find missing sides or angles when you know two angles and a side, or two sides and a non-included angle.", example: null },
      { term: "Vector", definition: "A quantity with both magnitude and direction. Written in bold (a) or with an arrow. Vectors can be added: a + b gives a resultant.", example: "Displacement from A to B might be vector (3, 4), meaning 3 right and 4 up" },
      { term: "Frequency Density", definition: "Used in histograms: frequency density = frequency ÷ class width. The area of each bar represents frequency, not the height.", example: null },
      { term: "Interior Angle of a Regular Polygon", definition: "Interior angle = (n − 2) × 180 ÷ n, where n is the number of sides.", example: "Regular hexagon (6 sides): (4 × 180) / 6 = 120°" },
    ],
  },

  // ─────────────────────────────────────────────
  // BIOLOGY
  // ─────────────────────────────────────────────
  "Biology": {
    short: [
      { question: "What is the role of mitochondria in a cell?", answer: "Mitochondria are the site of aerobic respiration, producing ATP (energy) for the cell.", marks: 2, hint: "Think about energy production" },
      { question: "Name the four bases found in DNA.", answer: "Adenine, Thymine, Cytosine, Guanine.", marks: 2, hint: "Remember base pairing: A-T and C-G" },
      { question: "What is osmosis?", answer: "Osmosis is the movement of water molecules from an area of higher water potential to an area of lower water potential through a partially permeable membrane.", marks: 2, hint: "It involves water and a partially permeable membrane" },
      { question: "State the word equation for aerobic respiration.", answer: "Glucose + Oxygen → Carbon dioxide + Water (+ energy)", marks: 2, hint: "Reactants on the left, products on the right" },
      { question: "What is natural selection?", answer: "Natural selection is the process by which organisms with favourable adaptations are more likely to survive and reproduce, passing on their genes to the next generation.", marks: 2, hint: "Think: survival of the fittest" },
      { question: "Name the three types of blood vessel.", answer: "Arteries, veins and capillaries.", marks: 1, hint: "One carries blood away from the heart, one carries it back..." },
      { question: "What does the pancreas produce?", answer: "The pancreas produces insulin and glucagon (hormones) and digestive enzymes such as amylase, lipase and proteases.", marks: 2, hint: "It has both endocrine and exocrine functions" },
      { question: "What is the function of chlorophyll?", answer: "Chlorophyll absorbs light energy (mainly red and blue wavelengths) and converts it into chemical energy for photosynthesis.", marks: 1, hint: "It is the green pigment in plants" },
      { question: "Define the term 'allele'.", answer: "An allele is an alternative version of a gene that codes for a different characteristic or phenotype.", marks: 1, hint: "Genes can come in different versions" },
      { question: "What is the difference between a pathogen and a disease?", answer: "A pathogen is a microorganism that causes disease. A disease is the illness or condition caused by the pathogen.", marks: 2, hint: "One is the cause, one is the effect" },
    ],
    mid: [
      { question: "Explain how the structure of a red blood cell is adapted to its function.", answer: "Red blood cells have a biconcave shape, increasing surface area for oxygen absorption. They have no nucleus, allowing more room for haemoglobin. The flexible shape allows them to squeeze through narrow capillaries. They contain haemoglobin which binds to oxygen in the lungs and releases it in tissues.", marks: 4, hint: "Think about shape, contents and how they travel through blood vessels" },
      { question: "Describe how the body responds when blood glucose levels rise after a meal.", answer: "The pancreas detects the rise in blood glucose and releases insulin. Insulin causes body cells (especially liver and muscle) to take up glucose. Liver and muscle cells convert excess glucose to glycogen (glycogenesis). Blood glucose levels fall back to normal. This is an example of negative feedback.", marks: 4, hint: "Which organ detects the change? What hormone is released? What happens to the glucose?" },
      { question: "Explain the role of enzymes in digestion, using at least two specific examples.", answer: "Enzymes are biological catalysts that speed up the breakdown of food molecules. Amylase (produced in saliva and pancreas) breaks down starch into maltose. Proteases (e.g. pepsin in the stomach) break proteins into amino acids. Lipases break fats into fatty acids and glycerol. Enzymes work by fitting substrates into their active site — this is the lock-and-key model.", marks: 5, hint: "Name the enzyme, where it is made, what it breaks down and what it produces" },
      { question: "Describe the process of mitosis and explain why it is important.", answer: "Mitosis is cell division that produces two genetically identical daughter cells. The DNA replicates so each chromosome is copied. The chromosomes line up at the centre of the cell and are pulled to opposite poles. The cell divides to form two cells with the same number of chromosomes as the parent cell (diploid). Mitosis is important for growth, repair and asexual reproduction.", marks: 4, hint: "Describe what happens to the chromosomes. How many cells are produced and how do they compare?" },
      { question: "Explain how vaccines protect both individuals and populations.", answer: "A vaccine contains dead or weakened pathogens (or their antigens). The immune system responds by producing antibodies and memory cells. If the real pathogen is later encountered, memory cells trigger rapid antibody production, preventing illness. At population level, herd immunity occurs when enough people are vaccinated that even unvaccinated individuals are protected because the disease cannot spread easily.", marks: 5, hint: "Think about what's in a vaccine, how the immune system responds, and what herd immunity means" },
    ],
    long: [
      { question: "Evaluate the evidence for evolution by natural selection, including Darwin's contribution and the role of genetic variation. (6 marks)", answer: "Darwin proposed that all species share a common ancestor and have evolved through natural selection. Variation exists within populations due to mutations and sexual reproduction. Individuals with favourable adaptations are better suited to their environment and more likely to survive and reproduce. They pass on their advantageous alleles to offspring. Over many generations, favourable characteristics become more common in the population. Evidence includes: the fossil record showing gradual change; comparative anatomy (homologous structures like the pentadactyl limb); antibiotic resistance in bacteria; and DNA evidence showing genetic similarity between species. Darwin's theory was controversial because it contradicted religious views and he could not explain the mechanism of inheritance (discovered later by Mendel and then the discovery of DNA).", marks: 6, hint: "Define natural selection, explain genetic variation, then evaluate evidence — fossils, comparative anatomy, DNA, antibiotic resistance" },
      { question: "A student investigates the effect of temperature on the rate of enzyme activity using amylase and starch. Describe a method for this investigation, including controls, and explain the expected results. (7 marks)", answer: "Method: Prepare iodine solution in spotting tiles. Set up water baths at different temperatures (e.g. 20°C, 30°C, 37°C, 50°C, 70°C). Mix amylase and starch solutions. Add drops to iodine at regular intervals until the iodine stops turning blue-black. Record the time taken for the starch to be fully digested at each temperature. Controls: same concentration of amylase and starch, same volume, same pH (buffer solution). Expected results: Rate increases with temperature up to the optimum (~37°C) due to increased kinetic energy and more frequent enzyme-substrate collisions. Above the optimum, the enzyme denatures — the active site changes shape and can no longer bind the substrate — so rate falls to zero. Results plotted as a curve rising then falling steeply.", marks: 7, hint: "Include specific temperatures, controls, method for measuring rate, and explain in terms of active site and kinetic energy" },
    ],
    flashcard: [
      { term: "Mitosis", definition: "Cell division producing two genetically identical diploid daughter cells. Used for growth, repair and asexual reproduction. Produces cells with the same chromosome number as the parent.", example: "Skin cells dividing to replace damaged tissue" },
      { term: "Meiosis", definition: "Cell division producing four genetically unique haploid daughter cells (gametes). Occurs in reproductive organs. Involves two divisions and crossing over, which increases genetic variation.", example: "Production of sperm and egg cells" },
      { term: "Photosynthesis", definition: "The process by which plants use light energy to convert carbon dioxide and water into glucose and oxygen. Occurs in chloroplasts. Equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", example: "A leaf converting sunlight to sugar on a sunny day" },
      { term: "Homeostasis", definition: "The maintenance of a constant internal environment within the body. Examples include regulation of body temperature, blood glucose levels and water balance. Uses negative feedback mechanisms.", example: "Shivering to raise body temperature when cold" },
      { term: "Dominant and Recessive Alleles", definition: "A dominant allele is expressed even when only one copy is present (heterozygous). A recessive allele is only expressed when two copies are present (homozygous recessive). Dominant shown by capital letter.", example: "Brown eye allele (B) is dominant over blue eye allele (b)" },
      { term: "Active Transport", definition: "Movement of substances across a cell membrane against the concentration gradient, using energy (ATP) from respiration. Requires carrier proteins.", example: "Absorption of mineral ions by plant root hair cells from soil" },
      { term: "Diffusion", definition: "The passive movement of particles from an area of high concentration to an area of low concentration. No energy required. Rate increased by greater concentration gradient, higher temperature and larger surface area.", example: "Oxygen moving from alveoli into the blood in the lungs" },
      { term: "Immune Response", definition: "The body's defence against pathogens. White blood cells (phagocytes) engulf pathogens; lymphocytes produce specific antibodies. Memory cells remain after infection for faster future response.", example: null },
      { term: "Enzyme", definition: "A biological catalyst made of protein that speeds up metabolic reactions without being used up. Each enzyme has a specific active site that fits only one substrate (lock and key model). Denatured by extreme heat or pH.", example: "Amylase breaking down starch into sugars in your mouth" },
      { term: "Chromosome", definition: "A long strand of DNA found in the nucleus. Humans have 46 chromosomes (23 pairs). Body cells are diploid (2n); gametes are haploid (n = 23).", example: null },
      { term: "Allele Frequency", definition: "The proportion of a particular allele in a population. Natural selection can change allele frequencies over time — advantageous alleles increase in frequency.", example: "Pale peppered moths decreased in frequency during industrial revolution" },
      { term: "Nervous System", definition: "Consists of the central nervous system (brain and spinal cord) and peripheral nervous system. Sends electrical impulses along neurones. Reflexes are rapid automatic responses not involving conscious thought.", example: "Pulling your hand away from something hot before thinking" },
    ],
  },

  // ─────────────────────────────────────────────
  // CHEMISTRY
  // ─────────────────────────────────────────────
  "Chemistry": {
    short: [
      { question: "What is the atomic number of an element?", answer: "The atomic number is the number of protons in the nucleus of an atom. It defines which element it is.", marks: 1, hint: "Look at the bottom number on the periodic table" },
      { question: "State the law of conservation of mass.", answer: "In a chemical reaction, the total mass of reactants equals the total mass of products. Mass is neither created nor destroyed.", marks: 2, hint: "Think about atoms being rearranged, not destroyed" },
      { question: "What type of bonding is present in sodium chloride (NaCl)?", answer: "Ionic bonding. Sodium transfers an electron to chlorine, forming Na⁺ and Cl⁻ ions held together by electrostatic attraction.", marks: 2, hint: "Involves electron transfer between a metal and a non-metal" },
      { question: "What is an exothermic reaction? Give one example.", answer: "An exothermic reaction releases energy to the surroundings, causing a temperature rise. Example: combustion of fuels, neutralisation reactions.", marks: 2, hint: "Think about temperature change — does it get hotter or cooler?" },
      { question: "State the formula for calculating the concentration of a solution.", answer: "Concentration (mol/dm³) = moles of solute ÷ volume of solution (dm³)", marks: 1, hint: "Concentration = moles ÷ volume" },
      { question: "What is an isotope?", answer: "Isotopes are atoms of the same element that have the same number of protons but different numbers of neutrons.", marks: 2, hint: "Same element, different mass number" },
      { question: "Name the products of the electrolysis of brine (sodium chloride solution).", answer: "Chlorine gas at the anode, hydrogen gas at the cathode, and sodium hydroxide solution remaining.", marks: 2, hint: "Three products from the electrolysis of salt water" },
      { question: "What is the pH of a neutral solution?", answer: "pH 7", marks: 1, hint: "The pH scale goes from 0 to 14" },
      { question: "Define the term 'relative atomic mass'.", answer: "The relative atomic mass (Ar) is the weighted mean mass of an atom of an element compared to 1/12 the mass of carbon-12.", marks: 2, hint: "It's an average that takes into account the abundance of isotopes" },
    ],
    mid: [
      { question: "Explain why metals conduct electricity but non-metals generally do not.", answer: "In metals, the atoms lose their outer electrons to form a lattice of positive ions surrounded by a sea of delocalised electrons. These free electrons can move through the metal carrying charge, so metals conduct electricity. Non-metals form covalent bonds and do not have free electrons, so they cannot conduct electricity (except graphite, which has delocalised electrons in layers).", marks: 4, hint: "Focus on what charge carriers are present in metals and why non-metals lack them" },
      { question: "Describe the process of cracking in the oil industry and explain why it is necessary.", answer: "Cracking is the breaking down of long-chain hydrocarbons into shorter, more useful ones. It is carried out by heating the fraction with a catalyst (catalytic cracking) or at very high temperatures without a catalyst (thermal cracking). The process produces shorter alkanes used as fuels and alkenes used to make polymers/plastics. Cracking is necessary because there is greater demand for short-chain hydrocarbons (petrol, diesel) than for long-chain fractions, so supply and demand are balanced.", marks: 4, hint: "Explain what cracking does to molecules, how it is done, and what the products are used for" },
      { question: "Calculate the relative formula mass (Mr) of calcium carbonate (CaCO₃) and use it to calculate the mass of CaCO₃ needed to produce 11 g of CO₂. (Ar: Ca=40, C=12, O=16)", answer: "Mr of CaCO₃ = 40 + 12 + (3×16) = 100. Mr of CO₂ = 12 + 32 = 44. CaCO₃ → CaO + CO₂ (1:1 ratio). Moles of CO₂ = 11 ÷ 44 = 0.25 mol. Moles of CaCO₃ = 0.25 mol. Mass of CaCO₃ = 0.25 × 100 = 25 g.", marks: 4, hint: "Find Mr, write the equation, find moles of CO₂, then use the 1:1 ratio" },
      { question: "Explain the difference between oxidation and reduction using the concept of electron transfer. (Redox)", answer: "Oxidation is the loss of electrons. Reduction is the gain of electrons. These always occur together — when one substance is oxidised (loses electrons), another is reduced (gains them). OILRIG: Oxidation Is Loss, Reduction Is Gain. Example: In the reaction of zinc with copper sulfate, zinc is oxidised (Zn → Zn²⁺ + 2e⁻) and copper ions are reduced (Cu²⁺ + 2e⁻ → Cu).", marks: 4, hint: "Use the mnemonic OILRIG and give an example of a redox reaction" },
    ],
    long: [
      { question: "Describe the structure of the atom, including the roles of subatomic particles, and explain how the modern model developed from earlier models. (6 marks)", answer: "The atom consists of a central nucleus containing protons (positive charge, relative mass 1) and neutrons (no charge, relative mass 1). Electrons (negative charge, negligible mass) orbit the nucleus in shells (energy levels). Most of the atom is empty space. The nuclear model was developed by Rutherford following the alpha particle scattering experiment — most particles passed straight through (atom is mostly empty), some deflected slightly (nucleus is positive) and a few bounced back (nucleus is small and dense). This replaced Thomson's plum pudding model (positive sphere with embedded electrons). Bohr later refined the model by proposing electrons occupy fixed energy levels. Modern quantum model suggests electrons exist in probability clouds. The number of protons = atomic number; protons + neutrons = mass number.", marks: 6, hint: "Describe each particle, explain each historical model and what evidence led to changes — Rutherford's scattering experiment is key" },
      { question: "A student wants to prepare a pure, dry sample of copper sulfate crystals by reacting copper oxide with sulfuric acid. Describe the method, including safety precautions, and explain how to obtain pure crystals. (7 marks)", answer: "Method: Add excess copper oxide to sulfuric acid in a beaker. Warm gently with a Bunsen burner. The excess copper oxide (solid) shows all the acid has reacted. Filter the mixture to remove excess copper oxide — the filtrate is copper sulfate solution. Pour the filtrate into an evaporating dish and heat gently until crystals begin to form (or until the volume is reduced by half). Leave to crystallise. Filter to collect crystals. Pat dry with filter paper. Safety: Wear goggles; sulfuric acid is corrosive; heat carefully. Explanation: excess solid reactant ensures all acid is used up; filtration removes excess solid; crystallisation produces pure crystals as impurities remain in solution.", marks: 7, hint: "Include: excess oxide, filtering, evaporation, crystallisation, and safety. Explain why each step is done." },
    ],
    flashcard: [
      { term: "Ionic Bonding", definition: "Electrostatic attraction between oppositely charged ions. Formed when electrons are transferred from a metal to a non-metal. Ionic compounds have high melting points and conduct electricity when dissolved or molten.", example: "Sodium chloride (NaCl): Na⁺ and Cl⁻ ions" },
      { term: "Covalent Bonding", definition: "Sharing of electron pairs between non-metal atoms. Forms molecules. Simple covalent structures have low melting points; giant covalent structures (diamond, graphite) have very high melting points.", example: "Water (H₂O): each hydrogen shares electrons with oxygen" },
      { term: "Mole", definition: "The unit used to measure amount of substance. One mole = 6.02 × 10²³ particles (Avogadro's number). Moles = mass ÷ relative formula mass.", example: "1 mole of water (Mr=18) = 18 g = 6.02×10²³ molecules" },
      { term: "Rates of Reaction", definition: "How quickly reactants are converted to products. Increased by: higher temperature, higher concentration, larger surface area, adding a catalyst, and (for gases) higher pressure.", example: "Adding HCl to small vs large marble chips — faster with smaller chips" },
      { term: "Le Chatelier's Principle", definition: "If a change is made to a system at equilibrium, the system shifts to oppose that change. Used to predict the effect of changing temperature, pressure or concentration on a reversible reaction.", example: "Haber process: increasing pressure shifts equilibrium towards NH₃ (fewer gas molecules)" },
      { term: "Oxidation States", definition: "A measure of the number of electrons gained or lost by an atom. Oxidation = increase in oxidation state. Reduction = decrease in oxidation state. OILRIG helps: Oxidation Is Loss, Reduction Is Gain.", example: null },
      { term: "Alkanes", definition: "Saturated hydrocarbons with general formula CₙH₂ₙ₊₂. Only single C-C bonds. Not very reactive. Used as fuels. First four: methane, ethane, propane, butane.", example: "Methane (CH₄): one carbon bonded to four hydrogens" },
      { term: "Alkenes", definition: "Unsaturated hydrocarbons with general formula CₙH₂ₙ. Contain a C=C double bond. More reactive than alkanes. Decolourise bromine water. Used to make polymers.", example: "Ethene (C₂H₄): used to make polyethene" },
      { term: "Electrolysis", definition: "Using electricity to decompose an ionic compound when molten or in solution. Positive ions move to cathode (reduced, gain electrons); negative ions move to anode (oxidised, lose electrons).", example: "Electrolysis of water produces H₂ at cathode and O₂ at anode" },
      { term: "Equilibrium", definition: "In a reversible reaction, equilibrium is reached when the forward and reverse reaction rates are equal. The concentrations of reactants and products remain constant (but not necessarily equal).", example: null },
    ],
  },

  // ─────────────────────────────────────────────
  // PHYSICS
  // ─────────────────────────────────────────────
  "Physics": {
    short: [
      { question: "State Newton's Second Law of Motion.", answer: "Force = mass × acceleration (F = ma). The acceleration of an object is directly proportional to the resultant force acting on it and inversely proportional to its mass.", marks: 2, hint: "Think about what happens when you push a heavy vs a light object" },
      { question: "What is the difference between a scalar and a vector quantity? Give one example of each.", answer: "A scalar has magnitude only. A vector has both magnitude and direction. Example scalar: speed (50 m/s). Example vector: velocity (50 m/s north).", marks: 2, hint: "Does the quantity have a direction?" },
      { question: "State the equation for gravitational potential energy.", answer: "GPE = mass × gravitational field strength × height. GPE = mgh (in joules)", marks: 1, hint: "It depends on mass, height and the strength of gravity" },
      { question: "What is the wave equation?", answer: "Wave speed = frequency × wavelength. v = fλ", marks: 1, hint: "Relates speed, frequency and wavelength" },
      { question: "What is the difference between a conductor and an insulator?", answer: "A conductor allows electrical current to flow through it easily (e.g. copper). An insulator does not allow current to flow (e.g. rubber, plastic).", marks: 2, hint: "Think about whether electrons can move freely" },
      { question: "State the law of conservation of energy.", answer: "Energy cannot be created or destroyed — it can only be transferred from one form to another. The total energy of a closed system remains constant.", marks: 2, hint: "Energy is always... what?" },
      { question: "What is the unit of electrical resistance?", answer: "Ohm (Ω)", marks: 1, hint: "Named after Georg Ohm" },
      { question: "Define 'specific heat capacity'.", answer: "Specific heat capacity is the energy required to raise the temperature of 1 kg of a substance by 1°C (or 1 K). Equation: Q = mcΔT", marks: 2, hint: "It tells you how much energy is needed per kg per degree" },
    ],
    mid: [
      { question: "A car accelerates from rest to 20 m/s in 8 seconds. Calculate (a) the acceleration and (b) the distance travelled, assuming uniform acceleration.", answer: "(a) a = (v − u) / t = (20 − 0) / 8 = 2.5 m/s². (b) Using s = ut + ½at²: s = 0 + ½ × 2.5 × 64 = 80 m. Or using v² = u² + 2as: 400 = 5s, s = 80 m.", marks: 4, hint: "Use SUVAT equations. List what you know: u=0, v=20, t=8" },
      { question: "Explain how a transformer works and state the turns ratio equation.", answer: "A transformer transfers electrical energy between two coils using electromagnetic induction. An alternating current in the primary coil creates a changing magnetic field in the iron core. This changing field induces an alternating voltage in the secondary coil. The turns ratio determines whether it is a step-up or step-down transformer. Turns ratio: Vp/Vs = Np/Ns. Step-up: more turns on secondary → higher voltage. Step-down: fewer turns on secondary → lower voltage.", marks: 4, hint: "Describe electromagnetic induction and the role of the iron core. Include the equation." },
      { question: "Describe the structure of the atom and explain how alpha particle scattering provided evidence for the nuclear model.", answer: "The nucleus is very small, dense and positively charged, surrounded by electrons in shells. In the Geiger-Marsden experiment, alpha particles were fired at gold foil. Most passed straight through (atom is mostly empty space). Some deflected at small angles (passing near the positive nucleus). A few bounced almost straight back (direct collision with the small, dense, positive nucleus). This disproved the plum pudding model and confirmed that positive charge is concentrated in a tiny nucleus.", marks: 4, hint: "Describe the three outcomes of the experiment and what each one tells us about atomic structure" },
      { question: "A filament bulb has a resistance of 240 Ω when connected to a 120 V supply. Calculate the current and the power dissipated.", answer: "Using Ohm's Law: I = V/R = 120/240 = 0.5 A. Power: P = IV = 0.5 × 120 = 60 W. Or P = V²/R = 14400/240 = 60 W.", marks: 3, hint: "Use V = IR then P = IV" },
    ],
    long: [
      { question: "Explain the process of nuclear fission and describe how it is used in a nuclear power station to generate electricity. Include advantages and disadvantages of nuclear power. (7 marks)", answer: "Nuclear fission occurs when a heavy nucleus (e.g. uranium-235) absorbs a neutron and splits into two smaller nuclei, releasing two or three neutrons and a large amount of energy. The released neutrons can cause further fissions — this is a chain reaction. In a nuclear power station, the chain reaction is controlled in a reactor using control rods (e.g. boron) which absorb neutrons. The energy released heats water to produce steam, which drives a turbine connected to a generator. Advantages: no CO₂ emissions during operation; enormous energy output from small amounts of fuel; reliable baseload generation. Disadvantages: radioactive waste that is dangerous for thousands of years with difficult disposal; high construction costs; risk of accidents (e.g. Chernobyl, Fukushima); nuclear fuel is non-renewable.", marks: 7, hint: "Explain fission with a diagram in mind, describe chain reaction, then trace energy transfer through the power station, then evaluate" },
      { question: "A student investigates how extension of a spring varies with applied force. Sketch the expected graph, describe the pattern and explain using Hooke's Law. Explain what happens beyond the limit of proportionality. (6 marks)", answer: "Expected graph: straight line from origin (extension proportional to force) up to the limit of proportionality, then a curve where extension increases more rapidly. Hooke's Law states that extension is directly proportional to the applied force, provided the elastic limit is not exceeded: F = ke where k is the spring constant (N/m). The graph is linear here. Beyond the limit of proportionality, the spring is permanently deformed — elastic behaviour ends and the spring does not return to its original length. The spring constant can be found from the gradient of the linear section: k = F/e. A stiffer spring has a larger spring constant.", marks: 6, hint: "Describe the linear section (Hooke's Law), state F=ke, explain the spring constant, and describe what happens beyond the limit" },
    ],
    flashcard: [
      { term: "Newton's Three Laws of Motion", definition: "1st: An object remains at rest or constant velocity unless acted on by a resultant force. 2nd: F = ma (resultant force = mass × acceleration). 3rd: For every action there is an equal and opposite reaction.", example: "Rocket: exhaust gases pushed down (action), rocket pushed up (reaction)" },
      { term: "Work Done", definition: "Work done = force × distance moved in the direction of the force. W = Fd (joules). Work done equals the energy transferred.", example: "Lifting 10 N box 2 m: W = 10 × 2 = 20 J" },
      { term: "Ohm's Law", definition: "At constant temperature, the current through a conductor is directly proportional to the voltage across it. V = IR where V = voltage, I = current, R = resistance.", example: "12 V across 4 Ω resistor: I = 12/4 = 3 A" },
      { term: "Electromagnetic Spectrum", definition: "Family of transverse waves in order of increasing wavelength (decreasing frequency): gamma, X-rays, ultraviolet, visible light, infrared, microwaves, radio waves. All travel at 3×10⁸ m/s in a vacuum.", example: "Radio waves used for broadcasting; X-rays for medical imaging" },
      { term: "Momentum", definition: "Momentum = mass × velocity (p = mv). Measured in kg m/s. In a closed system, total momentum is conserved (law of conservation of momentum). Impulse = change in momentum = force × time.", example: "2 kg ball at 5 m/s: p = 10 kg m/s" },
      { term: "Half-Life", definition: "The time taken for half the radioactive nuclei in a sample to decay. After one half-life, activity halves. After two half-lives, activity is one quarter of the original.", example: "Carbon-14 half-life is 5,730 years — used in carbon dating" },
      { term: "Pressure", definition: "Pressure = force ÷ area. P = F/A (pascals, Pa). In fluids, pressure increases with depth and density. Pressure in a gas decreases with altitude.", example: "Snowshoes spread weight over larger area to reduce pressure on snow" },
      { term: "Power", definition: "Power = energy transferred ÷ time. P = E/t (watts, W). Also P = Fv (force × velocity). 1 watt = 1 joule per second.", example: "60 J transferred in 2 s: P = 30 W" },
      { term: "Refraction", definition: "The bending of a wave as it passes from one medium to another due to a change in speed. Light bends towards the normal when entering a denser medium (slows down). Snell's Law: n₁sin θ₁ = n₂sin θ₂.", example: "A straw appearing bent when placed in water" },
      { term: "Nuclear Fusion", definition: "Two light nuclei combine to form a heavier nucleus, releasing large amounts of energy. Occurs in stars. Requires extremely high temperatures and pressures. Could provide clean energy but is difficult to sustain on Earth.", example: "In the Sun: hydrogen nuclei fuse to form helium" },
    ],
  },

  // ─────────────────────────────────────────────
  // COMBINED SCIENCE
  // ─────────────────────────────────────────────
  "Combined Science": {
    short: [
      { question: "State the equation for photosynthesis.", answer: "Carbon dioxide + water → glucose + oxygen (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂)", marks: 2, hint: "Light energy is used by chlorophyll" },
      { question: "What is the difference between speed and velocity?", answer: "Speed is a scalar quantity — it only has magnitude. Velocity is a vector quantity — it has both magnitude and direction.", marks: 2, hint: "One has direction, the other does not" },
      { question: "What type of bonding exists in water (H₂O)?", answer: "Covalent bonding. The oxygen shares electron pairs with each hydrogen atom.", marks: 2, hint: "Water is made of non-metals sharing electrons" },
      { question: "Name the four components of blood.", answer: "Red blood cells, white blood cells, platelets and plasma.", marks: 2, hint: "Three cell types and a liquid" },
      { question: "What is an ion?", answer: "An ion is an atom or group of atoms that has gained or lost one or more electrons, giving it a positive or negative charge.", marks: 1, hint: "Ions are charged particles" },
    ],
    mid: [
      { question: "A student measures the extension of a spring at different forces. Explain how to use the data to find the spring constant and identify the elastic limit.", answer: "Plot extension (y-axis) against force (x-axis). The linear section shows where Hooke's Law applies. The gradient of this section = 1/k, so k = Force/extension. The point where the line curves is the elastic limit — beyond this, the spring does not return to its original shape. The spring constant k has units N/m.", marks: 4, hint: "Describe the graph, gradient = spring constant, identify where it curves" },
      { question: "Explain the difference between aerobic and anaerobic respiration, giving the word equations for each.", answer: "Aerobic respiration uses oxygen and produces more energy: glucose + oxygen → carbon dioxide + water. Anaerobic respiration occurs without oxygen and produces less energy. In humans: glucose → lactic acid. In yeast: glucose → ethanol + carbon dioxide (fermentation). Aerobic releases ~38 ATP per glucose molecule; anaerobic is less efficient.", marks: 4, hint: "State both equations, compare energy released and products" },
    ],
    long: [
      { question: "Describe the structure and function of the heart and explain how the circulatory system delivers oxygen to cells. (6 marks)", answer: "The heart is a muscular organ with four chambers: two atria (upper, receiving blood) and two ventricles (lower, pumping blood). The right side receives deoxygenated blood from the body and pumps it to the lungs (pulmonary circulation). The left side receives oxygenated blood from the lungs and pumps it to the body (systemic circulation). Valves (atrioventricular and semilunar) prevent backflow. Red blood cells carry oxygen bound to haemoglobin. At respiring cells, oxygen diffuses from capillaries into cells along a concentration gradient. CO₂ diffuses back into the blood. The double circulatory system maintains high pressure for efficient delivery.", marks: 6, hint: "Describe each chamber's role, trace blood flow, explain gas exchange at cells" },
    ],
    flashcard: [
      { term: "Cell Membrane", definition: "A selectively permeable barrier surrounding all cells. Controls what enters and leaves. Made of a phospholipid bilayer with embedded proteins.", example: null },
      { term: "Velocity-Time Graph", definition: "A graph showing how velocity changes over time. Gradient = acceleration. Area under graph = distance travelled. Horizontal line = constant velocity. Downward slope = deceleration.", example: "A car accelerating: upward slope. Braking: downward slope." },
      { term: "Periodic Table", definition: "Elements arranged in order of atomic number. Elements in the same group have the same number of outer electrons and similar properties. Periods show the energy level being filled.", example: "Group 1 (alkali metals): all have 1 outer electron and react vigorously with water" },
      { term: "Enzyme Active Site", definition: "The specific region on an enzyme where the substrate binds. The shape is complementary to the substrate (lock and key model). Extreme temperature or pH denatures the enzyme, changing the active site shape.", example: null },
      { term: "Series and Parallel Circuits", definition: "In series: same current everywhere; voltage shared. In parallel: voltage same across each branch; current splits. Adding components in parallel reduces total resistance.", example: "Christmas lights in series: one breaks, all go out. In parallel: one breaks, rest stay on." },
    ],
  },

  // ─────────────────────────────────────────────
  // ENGLISH LANGUAGE
  // ─────────────────────────────────────────────
  "English Language": {
    short: [
      { question: "What is a simile? Give an example.", answer: "A simile is a figure of speech that compares two things using 'like' or 'as'. Example: 'The soldier ran as fast as a cheetah.'", marks: 2, hint: "It uses 'like' or 'as' to compare two things" },
      { question: "What is the purpose of a rhetorical question?", answer: "A rhetorical question is used for effect and does not require an answer. It engages the reader, makes them think, or emphasises a point. For example: 'How much longer must we wait?'", marks: 2, hint: "It's a question you don't expect an answer to" },
      { question: "What does 'tone' mean in the context of writing?", answer: "Tone refers to the writer's attitude towards the subject or audience, conveyed through word choice and style. Examples: formal, humorous, angry, sympathetic.", marks: 1, hint: "Think about the writer's mood or attitude" },
      { question: "What is alliteration? Give an example.", answer: "Alliteration is the repetition of the same initial consonant sound in closely connected words. Example: 'Peter Piper picked a peck of pickled peppers.'", marks: 2, hint: "It's the repetition of a consonant sound at the start of words" },
      { question: "Define 'narrative perspective'. What is the difference between first and third person?", answer: "Narrative perspective is the viewpoint from which a story is told. First person uses 'I' and is more personal and subjective. Third person uses 'he/she/they' and can be either omniscient (knows all characters' thoughts) or limited.", marks: 2, hint: "'I' or 'he/she/they'?" },
    ],
    mid: [
      { question: "Read this extract: 'The rain hammered against the windowpanes as she waited, her hands clasped so tightly her knuckles whitened.' Analyse the language used and the effect on the reader.", answer: "The verb 'hammered' is personification, suggesting the rain is violent and aggressive, creating a sense of threat. The adverb 'tightly' and the image of whitened knuckles shows physical tension in the character's body, suggesting extreme anxiety or fear. The compound sentence mirrors the character's tense, controlled state. The setting (rain, window) creates a pathetic fallacy, with the weather reflecting the character's emotional state. Together, these techniques create a tense, claustrophobic atmosphere that builds reader unease.", marks: 4, hint: "Identify a technique, quote it, name it, explain the effect — do this for 2-3 techniques" },
      { question: "A student is writing a letter to a local council arguing for a new youth centre. Write the opening two paragraphs. Show your understanding of audience, purpose and form.", answer: "[Model answer]: Dear Sir/Madam, I am writing to urge the council to consider the urgent need for a dedicated youth centre in our community. As a young person who has witnessed first-hand the lack of safe, engaging spaces for teenagers, I believe this is an investment that would transform our town. Without such provision, young people have nowhere to go after school — and the consequences of this are plain to see. Anti-social behaviour is rising. Academic disengagement is growing. Surely we can do better than this for the next generation? A well-funded youth centre would provide structured activities, mentoring and a safe environment. The cost of prevention is always less than the cost of cure.", marks: 5, hint: "Consider: formal language, rhetorical devices, clear argument, direct address to audience, persuasive techniques" },
      { question: "Explain three features a writer might use to create tension in a short story.", answer: "1. Short sentences: Abrupt, punchy sentences speed up pace and create urgency. 2. Cliffhangers: Ending a section on an unresolved moment keeps the reader anxious. 3. Pathetic fallacy: Using weather or setting to mirror a character's fear (e.g. storm, darkness) creates atmosphere. Other valid answers: foreshadowing, unreliable narrator, sensory detail, withholding information.", marks: 3, hint: "Think about pace, atmosphere and how the writer controls what the reader knows" },
    ],
    long: [
      { question: "Write a descriptive piece about a busy city street at night. (24 marks — focus on craft, vocabulary and structure)", answer: "[Model answer]: The city never truly sleeps — it merely changes its costume. By day it is all purpose and hurry; by night it breathes something wilder. The amber street lights stain the wet pavements gold, each puddle a broken mirror throwing back the world in fragments. A taxi slides past, its engine a low growl, trailing a comet's tail of exhaust. The air smells of fried onions and cold stone and something indefinable — the scent of a thousand lives brushing briefly against one another. Crowds thin but do not vanish. A couple argue in urgent whispers outside a restaurant, their breath ghosting in the chill. Laughter spills from a bar like light from a half-open door. Somewhere a bottle breaks. The city at night is a place of thresholds — between noise and silence, between belonging and aloneness, between the day you have lived and the one not yet begun.", marks: 7, hint: "Use all five senses. Vary sentence length. Use ambitious vocabulary, metaphor, personification and pathetic fallacy. Structure matters — think about how you open and close." },
      { question: "A newspaper asks for a speech to be delivered to secondary school students arguing that social media does more harm than good. Write the full speech. (40 marks — mark awarded for communication and technical accuracy)", answer: "[See extended model answer] The speech should include: direct address ('you', 'we'), rhetorical questions, statistics, anecdotes, rule of three, counter-argument acknowledged and dismissed, emotive language, formal but accessible register, strong opening hook and memorable conclusion.", marks: 8, hint: "Include: hook opening, evidence/statistics, rhetorical questions, rule of three, address counter-argument, powerful close" },
    ],
    flashcard: [
      { term: "Pathetic Fallacy", definition: "When a writer uses the environment or weather to reflect a character's emotions or create atmosphere. A literary technique associated with John Ruskin.", example: "'Dark clouds gathered overhead as she received the news' — the weather mirrors grief" },
      { term: "Structural Techniques", definition: "The ways a writer organises and shapes a text for effect. Includes: cyclical structure, flashback, non-linear narrative, cliffhangers, opening/closing parallels, sentence length variation.", example: "A story ending where it began = cyclical structure" },
      { term: "Register", definition: "The level of formality in language, adjusted for audience and purpose. Formal register uses complex vocabulary and avoids contractions. Informal register uses colloquial language and contractions.", example: "A job application uses formal register; a text to a friend uses informal register" },
      { term: "Semantic Field", definition: "A group of words related to the same topic or concept. Writers use semantic fields to create atmosphere or reinforce a theme.", example: "A war poem might use a semantic field of violence: 'shattered', 'blood', 'guns', 'screaming'" },
      { term: "Anaphora", definition: "The repetition of a word or phrase at the beginning of successive clauses or sentences, for emphasis and rhetorical effect.", example: "'We shall fight on the beaches, we shall fight on the landing grounds...' (Churchill)" },
      { term: "Counterargument", definition: "In persuasive writing, acknowledging the opposing view before dismissing or rebutting it. Shows the writer understands the debate and strengthens their own argument.", example: "'While some argue that social media connects people, the reality is that it often deepens loneliness'" },
      { term: "Narrative Voice", definition: "The distinct personality and perspective of the narrator or speaker. Can be reliable or unreliable. Shaped by diction, syntax, tone and what information is shared or withheld.", example: null },
      { term: "Juxtaposition", definition: "Placing two contrasting ideas, images or characters side by side to create contrast or highlight difference.", example: "Rich and poor characters described together in a Victorian novel to highlight social inequality" },
    ],
  },

  // ─────────────────────────────────────────────
  // ENGLISH LITERATURE
  // ─────────────────────────────────────────────
  "English Literature": {
    short: [
      { question: "What does the term 'motif' mean in literature?", answer: "A motif is a recurring element, image or symbol in a text that develops a theme. It appears repeatedly to reinforce meaning.", marks: 1, hint: "It's something that keeps coming back" },
      { question: "What is dramatic irony?", answer: "Dramatic irony is when the audience or reader knows something that a character in the play or story does not.", marks: 2, hint: "The audience knows more than the character" },
      { question: "What is a tragic hero according to Aristotle?", answer: "A tragic hero is a great or noble character who falls from prosperity to misery due to a fatal flaw (hamartia) and whose downfall arouses pity and fear in the audience.", marks: 2, hint: "Think of characters like Macbeth — nobility + fatal flaw" },
      { question: "What is the difference between a metaphor and a simile?", answer: "A simile compares using 'like' or 'as'. A metaphor states that something IS something else. Metaphors are more direct and impactful.", marks: 2, hint: "One uses 'like' or 'as', the other does not" },
      { question: "What does 'context' mean when analysing literature?", answer: "Context refers to the historical, social, cultural and biographical circumstances in which a text was written or set. Context shapes meaning and a writer's choices.", marks: 2, hint: "When was it written? What was happening in society at the time?" },
    ],
    mid: [
      { question: "Explore how Shakespeare presents the theme of ambition in Macbeth, using evidence from the text.", answer: "Ambition is central to Macbeth's character and downfall. Shakespeare presents it as dangerously corrupting — Macbeth describes his 'vaulting ambition which o'erleaps itself', suggesting ambition is self-defeating. Lady Macbeth's ambition is arguably stronger: she calls on spirits to 'unsex' her, suggesting women must override their nature to achieve power. Contextually, the Jacobean audience would have seen unchecked ambition as a sin and a political threat — particularly after the Gunpowder Plot (1605). The witches fuel Macbeth's ambition by planting the idea of kingship, making the audience question whether ambition is intrinsic or can be awakened by external forces.", marks: 5, hint: "Use PEE structure. Consider both Macbeth and Lady Macbeth. Include context (Jacobean values)." },
      { question: "How does Dickens present the theme of social inequality in 'A Christmas Carol'? Refer to specific characters.", answer: "Dickens uses Scrooge and the Cratchit family to explore the brutal divide between rich and poor in Victorian England. Scrooge's coldness is embodied physically — 'no warmth could warm, no wintry weather chill him'. The Cratchit family, despite poverty, radiates warmth and love. Dickens uses the allegorical figures of Ignorance and Want beneath the Ghost of Christmas Present's robe to make a direct social comment: 'Beware them both... but most of all beware this boy [Ignorance]'. Written in 1843 amid debates about the New Poor Law, Dickens's novella was deliberately popular in price and form to reach the widest audience.", marks: 5, hint: "Analyse characterisation and language. Include context — Victorian poverty, the New Poor Law, Dickens's purpose" },
    ],
    long: [
      { question: "How does Steinbeck present the theme of loneliness in 'Of Mice and Men'? Consider the context of 1930s America. (30 marks)", answer: "Loneliness pervades Steinbeck's novella, affecting every major character. Crooks, isolated by racism in a segregated bunkhouse, articulates the novel's central thesis: 'A guy needs somebody to be near him.' His bitterness is the product of years of exclusion. Curley's wife, denied a name by Steinbeck himself — a deliberate technique reinforcing her objectification — seeks companionship despite being called a 'tart' by the ranch workers. Even Candy's attachment to his old dog mirrors the men's attachment to the dream: something to belong to. George and Lennie's friendship is unique on the ranch and provokes suspicion, because such bonds were rare among itinerant workers in Depression-era California. Steinbeck suggests the American Dream is not just economically unattainable but socially — the system isolates individuals and prevents the collective action that might change it. The pastoral dream of the 'little place' represents not just land but belonging. Its destruction at the novel's close is the destruction of hope itself.", marks: 8, hint: "Cover at least 3 characters. Use quotations. Discuss structure/form as well as language. Include 1930s American context — Depression, itinerant workers, racism." },
    ],
    flashcard: [
      { term: "Hamartia", definition: "The fatal flaw of a tragic hero that ultimately leads to their downfall. A concept from Aristotle's Poetics. The flaw is often something admirable taken to excess.", example: "Macbeth's hamartia is ambition; Othello's is jealousy" },
      { term: "Allegory", definition: "A narrative where characters, events and settings represent abstract ideas or moral qualities. The surface story contains a deeper meaning.", example: "Animal Farm by Orwell is an allegory of the Russian Revolution" },
      { term: "Iambic Pentameter", definition: "A metrical pattern of five iambs (unstressed + stressed syllables) per line, giving ten syllables: da-DUM da-DUM da-DUM da-DUM da-DUM. Used by Shakespeare for nobility and reason.", example: "'Shall I comPARE thee TO a SUM-mer's DAY'" },
      { term: "Gothic Literature", definition: "A genre featuring dark settings, supernatural elements, death, decay, extreme emotions and often a sense of the uncanny. Key features: isolated settings, villains, psychological terror.", example: "Frankenstein (Shelley), Dracula (Stoker), Rebecca (du Maurier)" },
      { term: "Soliloquy", definition: "A dramatic device where a character speaks their thoughts aloud, alone on stage. Allows the audience to access a character's inner mind and true feelings.", example: "'To be or not to be' — Hamlet's famous soliloquy on existence" },
      { term: "Social Context", definition: "The historical and cultural circumstances surrounding a text that influence its meaning. Victorian literature reflects class, gender roles and industrialisation. Modernist literature reflects WWI trauma and loss of certainty.", example: "Dickens writing about poverty during debates about the New Poor Law 1834" },
      { term: "Omniscient Narrator", definition: "A narrator who knows everything about all characters, including their thoughts and feelings. Creates a 'god-like' perspective. Contrasts with a limited or unreliable narrator.", example: "George Eliot's Middlemarch uses an omniscient narrator to offer moral judgement" },
      { term: "Bildungsroman", definition: "A coming-of-age story tracing a character's moral, psychological and social development from youth to adulthood.", example: "Great Expectations (Dickens), Jane Eyre (Brontë)" },
    ],
  },

  // ─────────────────────────────────────────────
  // HISTORY
  // ─────────────────────────────────────────────
  "History": {
    short: [
      { question: "What was the name of the treaty that ended World War One?", answer: "The Treaty of Versailles, signed on 28 June 1919.", marks: 1, hint: "It was signed in a famous palace near Paris" },
      { question: "What were the 'Fourteen Points'?", answer: "President Woodrow Wilson's proposals for a peaceful post-war settlement, including self-determination for peoples, freedom of the seas, and the creation of a League of Nations.", marks: 2, hint: "These were Wilson's ideas for peace after WWI" },
      { question: "What was the Wall Street Crash?", answer: "The Wall Street Crash of October 1929 was the collapse of the US stock market, leading to the Great Depression — mass unemployment and economic crisis in the USA and worldwide.", marks: 2, hint: "It happened in 1929 and began a global economic depression" },
      { question: "What was Kristallnacht?", answer: "Kristallnacht ('Night of Broken Glass') was a pogrom against Jews in Nazi Germany on 9-10 November 1938. Jewish businesses, synagogues and homes were attacked; thousands of Jews were arrested.", marks: 2, hint: "It took place in Germany in November 1938 and targeted Jewish people" },
      { question: "What was the policy of Appeasement?", answer: "Appeasement was the British and French policy in the 1930s of making concessions to Hitler's Germany in the hope of avoiding war. The Munich Agreement of 1938 is its most famous example.", marks: 2, hint: "Neville Chamberlain's policy towards Hitler" },
      { question: "Name two causes of World War One.", answer: "Any two from: militarism, alliance systems, imperialism, nationalism, the assassination of Archduke Franz Ferdinand.", marks: 2, hint: "Think MAIN: Militarism, Alliance, Imperialism, Nationalism" },
    ],
    mid: [
      { question: "Explain why the Treaty of Versailles caused resentment in Germany.", answer: "Germany was forced to accept sole blame for WWI under the 'War Guilt Clause' (Article 231). They had to pay £6.6 billion in reparations, causing economic hardship. Germany lost 13% of its territory including the Polish Corridor, separating Germany from East Prussia. The army was limited to 100,000 men. German people felt humiliated — many believed they had not truly lost the war ('stab in the back' myth). This resentment contributed to the rise of extremist parties including the Nazis.", marks: 4, hint: "Cover: war guilt, reparations, land losses, military restrictions, and the emotional impact" },
      { question: "Explain how Hitler consolidated power between 1933 and 1934.", answer: "After becoming Chancellor in January 1933, Hitler called new elections and used the Reichstag Fire (February 1933) to blame communists and pass the Enabling Act (March 1933), giving him dictatorial powers. He banned other political parties, making Germany a one-party state. He used the Night of the Long Knives (June 1934) to eliminate rivals including Ernst Röhm (SA leader). When Hindenburg died in August 1934, Hitler merged the roles of Chancellor and President to become Führer. The army swore personal loyalty to him.", marks: 5, hint: "Cover: Reichstag Fire, Enabling Act, banning parties, Night of Long Knives, death of Hindenburg" },
      { question: "Describe the conditions faced by soldiers in the trenches during World War One.", answer: "Soldiers faced extremely poor conditions. Trenches were waterlogged, causing trench foot — a painful fungal infection. Rats and lice were common. Soldiers were exposed to the constant threat of shellfire and sniper attack. Many suffered from 'shell shock' (PTSD). Food was poor quality. Going 'over the top' into No Man's Land meant facing barbed wire, machine gun fire and artillery. Soldiers spent long periods in the front line before rotating to reserve trenches.", marks: 4, hint: "Cover at least 3 different challenges — physical conditions, disease, psychological effects, danger" },
    ],
    long: [
      { question: "Was the Great Depression the main reason for Hitler's rise to power? Explain your answer. (16 marks)", answer: "The Great Depression of 1929 was highly significant in Hitler's rise because it destroyed Weimar Germany's economic stability. Unemployment rose to 6 million by 1932; middle class savings were wiped out. People lost faith in democratic parties and turned to extremes. Nazi support leapt from 2.6% in 1928 to 37.4% in July 1932. Hitler exploited the crisis, blaming Jews, communists and the Weimar 'November Criminals'. However, the Depression alone cannot explain Hitler's rise. The weakness of the Weimar Republic was crucial — it had faced crises since birth (hyperinflation 1923), was seen as associated with defeat, and used proportional representation which led to unstable coalition governments. The appeal of Nazi ideology — nationalism, racial pride, order — had a broader appeal beyond just economic desperation. Von Papen and Hindenburg's miscalculation in appointing Hitler Chancellor in January 1933, thinking they could control him, was a significant immediate cause. In conclusion, the Depression was the key trigger that rapidly accelerated Nazi support, but Hitler's rise was made possible by the Weimar Republic's structural weaknesses and the miscalculations of conservative politicians.", marks: 8, hint: "Argue yes (economic desperation, unemployment, collapse of faith in democracy) then argue no (Weimar weakness, appeal of Nazi ideology, political miscalculation). Reach a judgement." },
    ],
    flashcard: [
      { term: "Treaty of Versailles (1919)", definition: "Peace settlement ending WWI. Germany accepted war guilt (Article 231), paid £6.6bn reparations, lost 13% of land, was banned from joining Austria (Anschluss) and limited to 100,000 soldiers.", example: null },
      { term: "Appeasement", definition: "British and French policy of making concessions to Hitler in the 1930s to avoid war. Seen as weakness that encouraged Hitler's aggression. Munich Agreement (1938) gave Hitler the Sudetenland.", example: "Chamberlain returned from Munich declaring 'peace for our time'" },
      { term: "Enabling Act (1933)", definition: "Law passed by the Reichstag after the Reichstag Fire that gave Hitler the power to pass laws without the Reichstag's approval. Effectively gave Hitler dictatorial power and ended German democracy.", example: null },
      { term: "The Holocaust", definition: "The systematic, state-sponsored persecution and murder of six million Jews and millions of others (Roma, disabled, homosexuals, political opponents) by the Nazi regime during WWII.", example: null },
      { term: "Cold War", definition: "Period of political tension and hostility between the USA (capitalist) and USSR (communist) from 1945–1991. Involved an arms race, space race and proxy wars, but no direct military conflict between the two superpowers.", example: "Cuban Missile Crisis (1962) brought the world close to nuclear war" },
      { term: "Trench Warfare", definition: "Military tactic in WWI where armies dug defensive trenches across hundreds of miles. Led to stalemate on the Western Front. Conditions included mud, disease, rats and constant shellfire.", example: null },
      { term: "Weimar Republic", definition: "Democratic government in Germany 1919–1933. Faced severe challenges: hyperinflation (1923), Great Depression (1929), political extremism from left and right, and its association with Germany's WWI defeat.", example: null },
      { term: "League of Nations", definition: "International peacekeeping organisation proposed by Woodrow Wilson and established after WWI. Weakened by USA's refusal to join. Failed to stop aggression by Japan, Italy and Germany in the 1930s.", example: null },
    ],
  },

  // ─────────────────────────────────────────────
  // GEOGRAPHY
  // ─────────────────────────────────────────────
  "Geography": {
    short: [
      { question: "What is the difference between weather and climate?", answer: "Weather is the day-to-day condition of the atmosphere (e.g. temperature, rainfall) at a specific place. Climate is the average weather conditions over a long period (typically 30 years) in a region.", marks: 2, hint: "One is short-term and specific, the other is long-term and average" },
      { question: "What is urbanisation?", answer: "Urbanisation is the increase in the proportion of people living in towns and cities compared to rural areas. It is caused by rural-to-urban migration and natural increase in urban populations.", marks: 2, hint: "More people moving to or living in cities" },
      { question: "What is a tectonic plate?", answer: "A tectonic plate is a large section of the Earth's lithosphere (crust and upper mantle) that moves slowly on the semi-molten mantle beneath. Earthquakes and volcanoes occur at plate boundaries.", marks: 2, hint: "Think about the structure of the Earth" },
      { question: "Define 'erosion' in the context of rivers.", answer: "Erosion is the wearing away and removal of rock or sediment by a river. Types include: hydraulic action (water pressure), abrasion (rocks grinding), attrition (rocks wearing each other) and solution (chemical dissolving).", marks: 2, hint: "There are four types — hydraulic action, abrasion, attrition and solution" },
      { question: "What is a carbon footprint?", answer: "A carbon footprint is the total amount of greenhouse gases (especially CO₂) produced by an individual, organisation or activity, usually measured in tonnes of CO₂ equivalent per year.", marks: 2, hint: "It measures greenhouse gas emissions" },
      { question: "What is an ecosystem?", answer: "An ecosystem is a community of living organisms (biotic factors) interacting with each other and their non-living environment (abiotic factors), such as soil, water and climate.", marks: 2, hint: "Living things + their environment" },
    ],
    mid: [
      { question: "Explain the causes and effects of tropical deforestation, using a named example.", answer: "Causes in the Amazon rainforest: commercial farming (soya, cattle ranching) — the biggest driver; logging for timber; mining; road building; population growth and subsistence farming. Effects: loss of biodiversity — species extinction; release of stored carbon increasing global warming; disruption of the water cycle (trees recycle rainfall through transpiration); indigenous communities displaced; soil erosion after tree cover removed. The Amazon has lost around 17% of its forest in 50 years — an area larger than France.", marks: 4, hint: "Name a specific rainforest. Give economic causes and environmental effects. Include data." },
      { question: "Describe and explain the features of a meander.", answer: "A meander is a curve in a river channel. On the outer bank (cut bank), the water flows faster, erosion (hydraulic action and abrasion) undercuts the bank creating a river cliff. On the inner bank (slip-off slope), water flows slower and deposition of sediment occurs, creating a gentle beach. Over time, the meander curves more tightly. Eventually the neck narrows and the river cuts through to form an ox-bow lake.", marks: 4, hint: "Describe both banks — why is erosion on one side and deposition on the other? Refer to water velocity." },
      { question: "Explain how climate change is affecting the Arctic and the consequences for global sea levels.", answer: "Climate change is causing Arctic temperatures to rise at twice the global average — Arctic amplification. Sea ice extent is declining dramatically — the Arctic Ocean may be ice-free in summer by 2050. Permafrost is thawing, releasing stored methane (a powerful greenhouse gas) — a positive feedback loop. Greenland ice sheet is melting, contributing to sea level rise. Global sea levels have risen approximately 3.3 mm per year since 1993. Low-lying coastal areas and small island nations (e.g. Maldives, Bangladesh) face flooding and displacement.", marks: 4, hint: "Cover Arctic warming rates, ice loss, permafrost methane, sea level rise, consequences for low-lying areas" },
    ],
    long: [
      { question: "'Urban areas in LICs face greater challenges than those in HICs.' To what extent do you agree? Refer to named examples. (9 marks)", answer: "Urban areas in LICs (Lower Income Countries) like Mumbai face extraordinary challenges: rapid urbanisation exceeds infrastructure capacity. Around 55% of Mumbai's population lives in slums like Dharavi, lacking clean water, sanitation and legal land tenure. Infant mortality, disease (cholera, typhoid) and air/water pollution are severe. However, LIC cities also demonstrate remarkable human resilience — Dharavi has a thriving informal economy worth $650 million/year; NGOs and self-help schemes have improved conditions. In contrast, urban areas in HICs (Higher Income Countries) like London face different but significant challenges: housing unaffordability, homelessness, traffic congestion and urban deprivation in inner-city areas. Deindustrialisation has left 'rust belt' cities like Detroit with high unemployment and urban decay. However, HIC cities generally have functioning systems of governance, sanitation and legal housing. In conclusion, I broadly agree that LIC urban challenges are more severe in immediate human terms — poverty, sanitation and health are more acute. However, challenges in HIC cities should not be dismissed, and the gap is closing as some cities (e.g. Singapore, Seoul) transition rapidly.", marks: 8, hint: "Use named examples (LIC and HIC city). Cover multiple challenges. Offer a balanced argument with a clear concluding judgement." },
    ],
    flashcard: [
      { term: "Plate Boundaries", definition: "Three types: constructive (plates move apart — volcanic activity, e.g. Mid-Atlantic Ridge); destructive (plates collide — earthquakes and volcanoes, e.g. Japan Trench); conservative (plates slide past — earthquakes only, e.g. San Andreas Fault).", example: null },
      { term: "Hydraulic Action", definition: "A type of river erosion where the force of water and air pressure in cracks in the riverbed and banks causes rock to break away.", example: "Common in rapids and waterfalls" },
      { term: "Gross Domestic Product (GDP)", definition: "The total value of goods and services produced by a country in a year. Used to measure economic development. GNI per capita (per person) is often used for comparisons between countries.", example: "USA has one of the highest GDPs; Niger one of the lowest" },
      { term: "Demographic Transition Model (DTM)", definition: "A model showing how birth rates and death rates change as a country develops. Five stages from high BR/high DR (Stage 1) to low BR/low DR (Stage 5). Population grows most rapidly in Stage 2-3.", example: "UK is in Stage 5; Niger is in Stage 2" },
      { term: "Biome", definition: "A large-scale ecosystem defined by its climate and vegetation. Major biomes include tropical rainforest, temperate deciduous forest, tundra, hot desert and savannah.", example: "Amazon = tropical rainforest biome; Sahara = hot desert biome" },
      { term: "Sustainable Development", definition: "Development that meets the needs of the present without compromising the ability of future generations to meet their own needs (Brundtland definition, 1987). Balances economic, social and environmental goals.", example: "Solar panels provide renewable energy without depleting resources" },
      { term: "Urbanisation", definition: "The increase in the proportion of people living in urban areas. Fastest in LICs. Caused by rural-urban migration (pull factors: jobs, services; push factors: poverty, drought) and natural increase.", example: "Lagos, Nigeria growing by around 77 people per hour" },
      { term: "Flood Risk Management", definition: "Strategies include: hard engineering (dams, flood walls, channel straightening) and soft engineering (floodplain zoning, afforestation, managed retreat). Soft approaches are more sustainable but less immediately effective.", example: "Thames Barrier: hard engineering protecting London from tidal flooding" },
    ],
  },

  // ─────────────────────────────────────────────
  // COMPUTER SCIENCE
  // ─────────────────────────────────────────────
  "Computer Science": {
    short: [
      { question: "What is the difference between RAM and ROM?", answer: "RAM (Random Access Memory) is temporary, volatile memory used to store data currently in use — it is lost when power is off. ROM (Read-Only Memory) is permanent, non-volatile memory that stores instructions needed to start the computer (BIOS).", marks: 2, hint: "Which one keeps its data when turned off?" },
      { question: "What does 'binary' mean and why do computers use it?", answer: "Binary is a base-2 number system using only 0s and 1s. Computers use binary because electronic components (transistors) can only be in two states: on (1) or off (0). This makes binary reliable and easy to represent electronically.", marks: 2, hint: "Think about transistors and two states" },
      { question: "What is an algorithm?", answer: "An algorithm is a set of step-by-step instructions designed to solve a problem or accomplish a task. It must be finite, unambiguous and produce a correct output.", marks: 2, hint: "A precise set of instructions for solving a problem" },
      { question: "What is the purpose of a compiler?", answer: "A compiler translates the entire high-level source code into machine code (object code) in one go. The resulting machine code can be run directly without the compiler.", marks: 2, hint: "It translates a whole program at once" },
      { question: "Define 'abstraction' in computing.", answer: "Abstraction is the process of removing unnecessary detail to focus on the essential features of a problem. It simplifies complex systems by hiding implementation details.", marks: 2, hint: "Hiding complexity, focusing on essentials" },
      { question: "What is SQL used for?", answer: "SQL (Structured Query Language) is used to manage and query relational databases. Common commands include SELECT, INSERT, UPDATE, DELETE and CREATE TABLE.", marks: 2, hint: "It's used to communicate with databases" },
    ],
    mid: [
      { question: "Explain the differences between bubble sort and merge sort, including their time complexity.", answer: "Bubble sort compares adjacent items and swaps them if out of order, repeating until sorted. It has O(n²) time complexity — slow for large datasets. It is simple to implement and uses little extra memory. Merge sort divides the list in half repeatedly until single elements remain, then merges in sorted order. It has O(n log n) complexity — much faster for large datasets. However, it requires extra memory for the merge process. For small datasets bubble sort may be adequate; for large data, merge sort is significantly more efficient.", marks: 4, hint: "Describe how each works, compare efficiency using big O notation, and comment on when each is appropriate" },
      { question: "Describe what happens during the Fetch-Decode-Execute cycle.", answer: "Fetch: The Program Counter (PC) holds the address of the next instruction. This address is copied to the Memory Address Register (MAR). The instruction is fetched from memory and copied to the Memory Data Register (MDR), then to the Current Instruction Register (CIR). The PC is incremented. Decode: The Control Unit decodes the instruction in the CIR. Execute: The decoded instruction is carried out (arithmetic in ALU, data moved, etc.). The cycle then repeats.", marks: 4, hint: "Name the registers involved (PC, MAR, MDR, CIR) and describe each stage precisely" },
      { question: "A school uses a database of students. Write a SQL query to find all students in Year 10 who scored above 70 in their last test, showing their name and score.", answer: "SELECT name, score FROM students WHERE year_group = 10 AND score > 70; The SELECT clause specifies the fields to display. The FROM clause names the table. The WHERE clause applies the conditions using AND to combine two criteria.", marks: 3, hint: "Use SELECT, FROM, WHERE and AND. Name the fields correctly." },
    ],
    long: [
      { question: "Explain the threats to computer security including malware, phishing and social engineering. Describe technical and non-technical measures to protect systems. (8 marks)", answer: "Malware (malicious software) includes: viruses (attach to legitimate files and spread), worms (self-replicate without host files), ransomware (encrypts files and demands payment), trojans (disguised as legitimate software) and spyware (monitors user activity). Phishing uses deceptive emails or websites posing as legitimate organisations to steal credentials or install malware. Social engineering exploits human psychology rather than technical vulnerabilities — e.g. pretexting, baiting, tailgating. Technical protections: firewalls (filter network traffic); anti-virus/anti-malware software; encryption (data unusable without key); two-factor authentication; regular patching and updates; intrusion detection systems. Non-technical protections: staff training in security awareness; strong password policies; principle of least privilege; physical security (locks, ID badges); acceptable use policies; regular audits. The most effective approach combines both — technology alone cannot protect against well-executed social engineering.", marks: 8, hint: "Explain each threat clearly, then cover both technical and non-technical countermeasures. Use technical vocabulary throughout." },
    ],
    flashcard: [
      { term: "Binary Addition", definition: "Rules: 0+0=0, 0+1=1, 1+0=1, 1+1=10 (write 0 carry 1), 1+1+1=11 (write 1 carry 1). Used in ALU for arithmetic operations.", example: "0110 + 0101 = 1011 (6 + 5 = 11)" },
      { term: "Decomposition", definition: "Breaking a complex problem down into smaller, more manageable sub-problems. Each sub-problem can be solved independently. A key computational thinking skill alongside abstraction, pattern recognition and algorithm design.", example: "Building a game: decompose into graphics, input handling, scoring, collision detection" },
      { term: "Boolean Logic", definition: "Logic using AND, OR and NOT gates that operates on binary values (True/False or 1/0). Combined into logic circuits. Truth tables show all possible input/output combinations.", example: "AND gate: output is 1 only if BOTH inputs are 1" },
      { term: "Network Protocols", definition: "Rules governing communication between devices. TCP/IP ensures data is sent and received reliably. HTTP/HTTPS for web pages. FTP for file transfer. SMTP for email. DNS converts domain names to IP addresses.", example: "When you visit a website, HTTP requests are sent and responses received" },
      { term: "Encryption", definition: "The process of converting data into a form that cannot be read without the correct key. Symmetric encryption uses the same key for encryption and decryption; asymmetric uses public and private keys.", example: "HTTPS uses asymmetric encryption to secure login details" },
      { term: "CPU Components", definition: "ALU (Arithmetic Logic Unit): performs calculations and logical operations. Control Unit: fetches, decodes and executes instructions. Cache: fast temporary memory near the CPU. Registers: tiny storage locations inside the CPU.", example: null },
      { term: "Operating System Functions", definition: "An OS manages hardware and software. Functions include: process management (scheduling), memory management, file management, device management (drivers), providing a user interface and security.", example: "Windows, macOS and Linux are all operating systems" },
      { term: "Data Types", definition: "Integer: whole numbers. Float/Real: decimal numbers. Boolean: True or False. Character: a single symbol. String: a sequence of characters. Choosing the correct data type affects storage and performance.", example: "Age stored as integer; price as float; surname as string" },
    ],
  },

  // ─────────────────────────────────────────────
  // PSYCHOLOGY
  // ─────────────────────────────────────────────
  "Psychology": {
    short: [
      { question: "What is a hypothesis?", answer: "A hypothesis is a testable, specific prediction about the expected outcome of a study, usually written as a statement about the relationship between variables.", marks: 2, hint: "A specific, testable prediction about what you expect to find" },
      { question: "What is the difference between independent and dependent variables?", answer: "The independent variable (IV) is the variable the researcher manipulates or changes. The dependent variable (DV) is the variable that is measured, which may change as a result of the IV.", marks: 2, hint: "IV is changed; DV is measured" },
      { question: "Define 'obedience' in psychology.", answer: "Obedience is a type of social influence where a person follows a direct order or instruction from someone perceived to be in authority.", marks: 1, hint: "Following orders from authority figures" },
      { question: "What does 'classical conditioning' mean?", answer: "Classical conditioning is a type of learning where a neutral stimulus becomes associated with an unconditioned stimulus through repeated pairing, eventually producing a conditioned response.", marks: 2, hint: "Think Pavlov's dogs — associating a bell with food" },
      { question: "What is the difference between qualitative and quantitative data?", answer: "Quantitative data is numerical and measurable (e.g. test scores). Qualitative data is non-numerical, descriptive data (e.g. interview responses, descriptions of feelings).", marks: 2, hint: "One involves numbers, the other involves descriptions" },
    ],
    mid: [
      { question: "Describe Milgram's (1963) study of obedience, including the procedure and key findings.", answer: "Milgram recruited 40 male participants through a newspaper advert. Each was paired with a confederate who was always the 'learner'. The participant (teacher) had to administer electric shocks (15V–450V) when the learner answered incorrectly. The shocks were fake, but the learner's recorded screams seemed real. An authority figure (experimenter in a lab coat) instructed participants to continue. 65% of participants administered the maximum 450V shock. All went to at least 300V. The study showed ordinary people would obey authority to the point of harming others, highlighting the power of situational factors over individual personality.", marks: 4, hint: "Cover: sample, procedure (shocks, confederate), key finding (65%), conclusion about obedience" },
      { question: "Explain two factors that affect the reliability of an experiment.", answer: "1. Standardised procedures: If every participant receives the same instructions and conditions, the study can be replicated and results compared. Without standardisation, differences in results may be due to procedural variation rather than the IV. 2. Inter-rater reliability: If observations are being coded, two or more researchers should independently code the same behaviour and achieve similar results. Low agreement suggests the coding system is ambiguous and unreliable.", marks: 4, hint: "Define reliability, then explain how standardisation and consistent measurement both contribute" },
      { question: "Evaluate the use of case studies as a research method in psychology.", answer: "A case study is an in-depth investigation of a single person or small group. Strengths: provides rich, detailed data; can study rare phenomena (e.g. H.M.'s amnesia); can generate hypotheses for further study. Weaknesses: cannot generalise from one case to the wider population; relies heavily on participant self-report and researcher interpretation (subjective); ethical issues around privacy and consent. May be retrospective and rely on memory. Overall, case studies are valuable for exploring unique cases but lack the scientific rigour needed for generalisable conclusions.", marks: 4, hint: "Give at least 2 strengths and 2 weaknesses. Consider validity, reliability and ethics." },
    ],
    long: [
      { question: "Discuss what psychologists have found out about memory, including the Multi-Store Model and at least one study. Evaluate the model. (8 marks)", answer: "Atkinson and Shiffrin's (1968) Multi-Store Model (MSM) proposes memory consists of three stores: sensory memory (briefly holds incoming information from senses), short-term memory (STM: limited capacity ~7±2 items, duration ~18–30 seconds, encoded acoustically) and long-term memory (LTM: potentially unlimited capacity and duration, encoded semantically). Information transfers between stores through attention and rehearsal. Evidence: Miller (1956) found STM capacity is 7±2 chunks. Peterson and Peterson (1959) demonstrated STM duration is around 18 seconds without rehearsal. Clive Wearing's case study showed severely damaged episodic LTM while procedural memory remained intact, supporting distinct memory stores. Evaluation: The MSM is influential and supported by strong experimental evidence. However, it oversimplifies memory — there is evidence for different types of STM (Baddeley's Working Memory Model with visuospatial sketchpad, phonological loop, episodic buffer). The role of rehearsal in transferring to LTM is questioned — flash bulb memories are encoded with little rehearsal. Nevertheless, it provides a useful framework for understanding memory.", marks: 8, hint: "Describe each store (capacity, duration, encoding). Give evidence for the model. Evaluate with alternative models and contrasting studies." },
    ],
    flashcard: [
      { term: "Classical Conditioning", definition: "Learning by association. An unconditioned stimulus (UCS) naturally produces an unconditioned response (UCR). After pairing with a neutral stimulus (NS), the NS becomes a conditioned stimulus (CS) producing a conditioned response (CR).", example: "Pavlov: food (UCS) → salivation (UCR). Bell paired with food → bell alone (CS) → salivation (CR)" },
      { term: "Operant Conditioning", definition: "Learning through consequences. Positive reinforcement: rewarding behaviour to increase it. Negative reinforcement: removing something unpleasant to increase behaviour. Punishment: consequences that decrease behaviour. B.F. Skinner's Skinner box demonstrated this.", example: "Rat presses lever → receives food pellet → continues pressing lever (positive reinforcement)" },
      { term: "Conformity", definition: "Changing beliefs or behaviour to match a group. Types: compliance (public agreement, private disagreement); identification (conforming to fit a role); internalisation (genuine agreement). Asch's line study demonstrated conformity.", example: "Asch: 75% conformed at least once when confederates gave wrong answers" },
      { term: "Validity", definition: "Whether a study measures what it claims to measure. Internal validity: results due to IV not other variables. External validity (ecological validity): results generalise to real life. Face validity: test appears to measure what it claims.", example: "A study on memory using nonsense syllables may lack ecological validity" },
      { term: "Ethics in Psychology", definition: "Ethical guidelines from the BPS include: informed consent, right to withdraw, confidentiality, protection from harm, deception should be minimal and followed by debriefing.", example: "Milgram's study is considered unethical — participants were deceived and experienced distress" },
      { term: "The Brain and Behaviour", definition: "Different brain regions have different functions: frontal lobe (decision-making, personality); temporal lobe (hearing, language, memory); parietal lobe (spatial awareness); occipital lobe (vision); cerebellum (balance, coordination).", example: "Phineas Gage: damaged frontal lobe changed personality dramatically" },
    ],
  },

  // ─────────────────────────────────────────────
  // SOCIOLOGY
  // ─────────────────────────────────────────────
  "Sociology": {
    short: [
      { question: "What is socialisation?", answer: "Socialisation is the process by which people learn the norms, values and culture of the society they live in. Primary socialisation occurs in the family; secondary socialisation occurs in school, peer groups and the media.", marks: 2, hint: "The process of learning how to fit into society" },
      { question: "What is the difference between a nuclear family and an extended family?", answer: "A nuclear family consists of two parents and their dependent children. An extended family includes grandparents, aunts, uncles and other relatives living with or near the family.", marks: 2, hint: "One is the small unit; the other includes grandparents and relatives" },
      { question: "What does 'meritocracy' mean?", answer: "Meritocracy is the idea that individuals are rewarded based on their talent, effort and ability rather than their social background or class. Functionalists believe schools are meritocratic.", marks: 2, hint: "Rewards based on merit — talent and hard work" },
      { question: "What is meant by 'social class'?", answer: "Social class is a way of categorising people based on their occupation, income, wealth and education. The main classes are working class, middle class and upper class.", marks: 2, hint: "A hierarchy based on occupation, wealth and income" },
      { question: "Define 'culture' in sociological terms.", answer: "Culture refers to the shared norms, values, beliefs, customs, language and artefacts of a society or group. It is learned (not innate) and transmitted through socialisation.", marks: 2, hint: "The shared way of life of a group — values, norms, beliefs" },
    ],
    mid: [
      { question: "Explain how the family performs functions for society, according to functionalists.", answer: "Functionalists see the family as essential to society's stability. George Murdock (1949) identified four universal functions: sexual (regulating sexual activity); reproductive (producing the next generation); economic (providing for members financially); educational (primary socialisation of children into norms and values). Talcott Parsons added two functions specific to modern industrial society: the stabilisation of adult personalities (the family as a 'warm bath') and the socialisation of children. Critics argue this ignores family dysfunction, gender inequality and diversity.", marks: 4, hint: "Name theorists (Murdock, Parsons), list specific functions, and briefly note a criticism" },
      { question: "Explain what sociologists mean by the 'hidden curriculum' and how it reproduces inequality.", answer: "The hidden curriculum refers to the informal lessons learned in school beyond the formal academic content — attitudes, values and behaviours. It teaches punctuality, obedience to authority, conformity and acceptance of hierarchy. Marxists like Bowles and Gintis argue the hidden curriculum reproduces the attitudes required by capitalism, preparing working-class students for obedient, low-paid work and middle-class students for positions of authority. This reproduces class inequality across generations by making inequality appear natural and inevitable.", marks: 4, hint: "Define hidden curriculum, then explain how Marxists link it to class inequality and social reproduction" },
      { question: "Outline and explain two reasons why educational achievement differs between social classes.", answer: "1. Material deprivation: Working-class families may lack money for books, internet, quiet study space, tutors or educational trips. Poverty causes stress and poor diet which affect concentration. 2. Cultural capital (Bourdieu): Middle-class families possess the attitudes, language and social networks valued by schools (cultural capital). They can navigate the education system, choose better schools, and help children with homework. Working-class students may lack this, meaning they are disadvantaged despite equal formal opportunities. Both factors show inequality of opportunity rather than ability.", marks: 4, hint: "Cover material deprivation (resources/money) and cultural capital (values, attitudes, language). Use theorists." },
    ],
    long: [
      { question: "'The media is the most powerful agent of socialisation.' Discuss this view. (20 marks)", answer: "The media plays a significant role in socialisation, especially with rising screen time. Postmodernists like Baudrillard suggest media creates 'hyperreality' — people construct identities from media representations rather than direct experience. Studies show advertising, social media and news shape gender norms, political views and consumer behaviour. However, to call it the most powerful agent requires comparing it with the family, education, religion and peer groups. The family is the primary agent of socialisation — it shapes fundamental values, language and attitudes in early life. Parsons argued its functions are irreplaceable. Schools reinforce class, gender and ethnic norms through curriculum, assessment and the hidden curriculum. Peer groups gain influence in adolescence — conformity to peer norms can override family values (Hargreaves). On balance, while the media's influence is growing — particularly social media's role in identity formation — the family remains the foundational agent of socialisation in early childhood. The media's power varies by class, age and media literacy. A more nuanced view is that multiple agents interact, with relative importance changing across the life course.", marks: 8, hint: "Agree with the view using evidence. Disagree by discussing family, education, peer groups. Reach a clear conclusion with a judgement." },
    ],
    flashcard: [
      { term: "Functionalism", definition: "A sociological perspective that sees society as a system of interconnected parts, each performing a function to maintain stability (social order). Key theorists: Durkheim, Parsons, Merton.", example: "The education system functions to socialise children and allocate roles in society" },
      { term: "Marxism", definition: "A conflict perspective arguing society is based on class struggle between the bourgeoisie (ruling class who own the means of production) and the proletariat (working class). Inequality is built into capitalism.", example: "Marxists argue schools reproduce class inequality by benefiting middle-class students" },
      { term: "Feminism", definition: "A sociological perspective focused on gender inequality and the subordination of women. Liberal feminists seek reform; radical feminists argue patriarchy must be dismantled; Marxist feminists link gender inequality to capitalism.", example: "Glass ceiling: women underrepresented in senior management roles" },
      { term: "Norms and Values", definition: "Norms are the unwritten rules of expected behaviour in a society (e.g. queuing). Values are the core beliefs and principles that underpin norms (e.g. fairness, respect). Both are transmitted through socialisation.", example: "Shaking hands as a norm; honesty as a value" },
      { term: "Social Mobility", definition: "The movement of individuals between social classes. Upward mobility: moving to a higher class. Downward mobility: moving to a lower class. Intergenerational mobility: comparing class position with parents'.", example: "A working-class student becoming a doctor = upward social mobility" },
      { term: "Ethnicity and Achievement", definition: "Research shows significant differences in educational achievement between ethnic groups. Chinese and Indian heritage students outperform the national average. Black Caribbean students underachieve relative to their potential. Explanations include: racism, material deprivation, cultural factors, school expectations.", example: null },
    ],
  },

  // ─────────────────────────────────────────────
  // BUSINESS STUDIES
  // ─────────────────────────────────────────────
  "Business Studies": {
    short: [
      { question: "What is the difference between a sole trader and a partnership?", answer: "A sole trader is a business owned and run by one person who has unlimited liability. A partnership is a business owned by 2–20 partners who share responsibility and unlimited liability (unless an LLP).", marks: 2, hint: "One owner vs multiple owners" },
      { question: "What is meant by 'cash flow'?", answer: "Cash flow is the movement of money into and out of a business. Positive cash flow means more money coming in than going out. Negative cash flow can cause a business to fail even if it is profitable.", marks: 2, hint: "Money in vs money out" },
      { question: "Define 'market research' and give one method.", answer: "Market research is the process of gathering information about customers, competitors and the market to help make business decisions. Primary research: surveys, interviews. Secondary research: government data, trade reports.", marks: 2, hint: "Finding out about your market before making decisions" },
      { question: "What is 'supply and demand'?", answer: "Supply is the quantity of a product producers are willing to sell at a given price. Demand is the quantity consumers are willing to buy at a given price. Price is determined by where supply and demand meet (equilibrium).", marks: 2, hint: "What producers offer vs what consumers want to buy" },
      { question: "What does 'USP' stand for and what is it?", answer: "USP stands for Unique Selling Point — the feature that makes a product or service different from and better than competitors, giving customers a specific reason to buy it.", marks: 1, hint: "What makes your product special compared to rivals?" },
    ],
    mid: [
      { question: "Explain the difference between fixed costs, variable costs and total costs, with examples.", answer: "Fixed costs remain the same regardless of output (e.g. rent, salaries, insurance). Variable costs change directly with output — the more you produce, the higher the cost (e.g. raw materials, packaging). Total costs = fixed costs + variable costs. Understanding these helps calculate the break-even point, where total revenue = total costs. For example, a bakery has fixed costs of £2,000/month (rent, equipment) and variable costs of £1 per loaf. If it sells 2,000 loaves, total cost = £4,000.", marks: 4, hint: "Define each type clearly, give a specific example for each, and explain how they combine" },
      { question: "Describe the marketing mix (4 Ps) and explain how a business might use it when launching a new product.", answer: "The 4 Ps: Product (design, quality, features, branding); Price (pricing strategy — premium, penetration, competitive); Place (where and how the product is sold — online, retail, direct); Promotion (advertising, social media, PR, sales promotions). When launching a product, a business should ensure all four elements are aligned. E.g. a premium chocolate brand would use high-quality packaging (Product), premium pricing (Price), specialist retailers (Place) and aspirational advertising (Promotion). The mix should reflect the target market and competitive landscape.", marks: 4, hint: "Define all four Ps, then apply each to a launch scenario with specific decisions" },
      { question: "Explain why a business might use motivation theories to improve workforce performance.", answer: "Motivated employees work harder, produce higher quality work and have lower absenteeism. Maslow's Hierarchy of Needs suggests businesses must meet physiological (pay), safety (job security), social (teamwork), esteem (recognition) and self-actualisation (development opportunities) needs. Herzberg identified hygiene factors (pay, conditions — prevent dissatisfaction) and motivators (achievement, responsibility — increase satisfaction). A business applying these theories might offer competitive salaries, promotion opportunities, flexible working and recognition schemes. Taylor's scientific management (pay-related performance) is older but still used in manufacturing.", marks: 4, hint: "Name at least two theorists (Maslow, Herzberg, Taylor), explain their theories and apply to a business context" },
    ],
    long: [
      { question: "A small café is considering expanding by opening a second location. Assess the risks and opportunities of this decision. (9 marks)", answer: "Opportunities: Increased revenue and profit from a second location; spreading the brand and building reputation; economies of scale (bulk buying, shared marketing); ability to serve more customers and segments; potential for further expansion if successful. Risks: High start-up costs (lease, equipment, staff) may cause cash flow problems; management is stretched thinner across two locations; quality and brand consistency may be harder to maintain; if the second site fails, it could threaten the original business; new location may have different demographics, requiring market research. Financial analysis needed: projected revenue vs costs, break-even analysis, funding options (loan — increases debt; investment — dilutes ownership). Recommendation: The expansion is viable if the first café has proven consistent profitability, strong brand, reliable systems and enough capital or credit to fund the second site without jeopardising cash flow. Detailed market research in the new location is essential. A pilot (e.g. market stall or pop-up) could reduce risk.", marks: 8, hint: "Cover specific opportunities AND risks. Include financial considerations. Give a clear recommendation with justification." },
    ],
    flashcard: [
      { term: "Break-Even Point", definition: "The level of output at which total revenue equals total costs — the business makes neither profit nor loss. Break-even = Fixed Costs ÷ (Selling Price − Variable Cost per unit). The margin of safety is how far actual sales exceed break-even.", example: "Fixed costs £1,000; selling price £5; variable cost £3 → break-even = 1000/(5-3) = 500 units" },
      { term: "Profit and Loss Account", definition: "A financial statement showing a business's revenue, costs and profit/loss over a period. Revenue − Cost of Sales = Gross Profit. Gross Profit − Operating Expenses = Net Profit.", example: null },
      { term: "Stakeholders", definition: "Any individual or group with an interest in a business. Internal: shareholders, employees. External: customers, suppliers, government, local community. Different stakeholders have different and sometimes conflicting interests.", example: "Shareholders want high dividends; employees want higher wages — both increase costs" },
      { term: "Economies of Scale", definition: "As a business grows and produces more, the average cost per unit falls. Types include: purchasing economies (bulk buying), managerial economies (specialist staff), financial economies (better loan rates).", example: "A large supermarket buys bread cheaper per loaf than a corner shop" },
      { term: "Entrepreneur", definition: "A person who takes the risk of starting and running a business in exchange for the potential to make a profit. Key skills: risk-taking, innovation, leadership, financial management.", example: "James Dyson risked his savings developing the bagless vacuum cleaner" },
      { term: "Limited Liability", definition: "When a business owner's personal assets are protected if the business fails. Only what they invested is at risk. Applies to limited companies (Ltd and PLC). Sole traders and partnerships have unlimited liability.", example: "A shareholder in a PLC can only lose their investment, not their house" },
    ],
  },

  // ─────────────────────────────────────────────
  // RELIGIOUS STUDIES
  // ─────────────────────────────────────────────
  "Religious Studies": {
    short: [
      { question: "What do Christians believe about the nature of God?", answer: "Christians believe in one God (monotheism) who is omnipotent (all-powerful), omniscient (all-knowing) and omnibenevolent (all-good). God is the creator of the universe and reveals himself through Jesus Christ and the Holy Spirit (Trinity).", marks: 2, hint: "Three key attributes and the concept of Trinity" },
      { question: "What is the Islamic belief about the nature of God (Allah)?", answer: "Muslims believe in Tawhid — the absolute oneness of Allah. Allah is eternal, all-knowing, all-powerful and all-merciful. The 99 names of Allah describe His attributes. Shirk (associating partners with Allah) is the greatest sin.", marks: 2, hint: "Focus on Tawhid and key attributes" },
      { question: "What is the sanctity of life?", answer: "The sanctity of life is the belief that human life is sacred, holy and precious because it is created by God. Most religious traditions believe life should be respected and not deliberately destroyed.", marks: 2, hint: "Life is sacred because it was given by God" },
      { question: "What do Christians believe about life after death?", answer: "Most Christians believe in bodily resurrection and eternal life. After death, people face judgement and may go to heaven (eternal life with God), hell (separation from God), or purgatory (in Catholic belief, purification before heaven).", marks: 2, hint: "Resurrection, heaven, hell and judgement" },
      { question: "What is 'euthanasia'?", answer: "Euthanasia is the deliberate ending of a person's life to relieve suffering. It can be voluntary (person consents), non-voluntary (person unable to consent) or involuntary. Assisted suicide involves helping someone end their own life.", marks: 2, hint: "Deliberate ending of life to relieve suffering — different types exist" },
    ],
    mid: [
      { question: "Explain Christian attitudes towards abortion, with reference to beliefs about the sanctity of life.", answer: "Most Christians oppose abortion because they believe life begins at conception and is sacred (sanctity of life). The Church of England takes a middle view — abortion is permitted in extreme cases (rape, severe foetal abnormality) but is a 'grave moral decision'. The Roman Catholic Church absolutely opposes abortion in all circumstances, viewing it as murder. Some liberal Christians permit abortion on compassionate grounds, believing God is loving and understands difficult circumstances. Biblical references: Psalm 139 ('you knit me together in my mother's womb'). Jeremiah 1:5 ('Before I formed you in the womb I knew you').", marks: 4, hint: "Cover Catholic, Church of England and liberal views. Use biblical references and the concept of sanctity of life." },
      { question: "Explain Buddhist teachings on suffering (dukkha) and how Buddhists aim to overcome it.", answer: "Dukkha (suffering/unsatisfactoriness) is the first of the Three Marks of Existence and the First Noble Truth. The Buddha taught that life involves suffering — birth, ageing, death and the frustration of desires. The Second Noble Truth (Samudaya) identifies the cause of suffering as tanha (craving/attachment). The Third Noble Truth (Nirodha) teaches that suffering can end. The Fourth Noble Truth points to the Eightfold Path as the means to end suffering — including right action, right thought and right mindfulness. Through meditation, ethical living and wisdom, Buddhists aim to reach Nirvana — freedom from suffering and the cycle of rebirth.", marks: 4, hint: "Use the Four Noble Truths framework. Explain dukkha, tanha, and how the Eightfold Path addresses suffering." },
    ],
    long: [
      { question: "'Religious beliefs are the main cause of conflict in the world today.' Evaluate this statement. (12 marks)", answer: "Some conflicts are clearly rooted in religious difference — the Troubles in Northern Ireland involved Protestant/Catholic division; conflict in the Middle East has religious dimensions; terrorist attacks by extremist groups claim religious justification. Some argue religion amplifies other conflicts by providing identity markers and moral certainty. However, many scholars argue religion is rarely the sole cause — political power, land, resources and ethnicity are usually equally or more significant. The Rwandan genocide was ethnic rather than religious; WWI was primarily nationalist and imperial. Religious people and organisations often work for peace — the Quakers, Christian Peacemaker Teams, and Islamic Peace and Justice organisations actively oppose violence. The Just War theory (Christian) and concepts of Jihad (the greater Jihad = inner spiritual struggle) show religions have built-in frameworks for limiting conflict. In conclusion, while religion can exacerbate or justify conflict, it is more accurate to say it interacts with political, economic and ethnic factors. Religious traditions also contain significant resources for peacemaking.", marks: 8, hint: "Agree with evidence (specific conflicts, religious extremism). Disagree (other causes, religious peacemaking). Reach a reasoned conclusion." },
    ],
    flashcard: [
      { term: "Sanctity of Life", definition: "The belief that all human life is sacred and precious because it is created by and belongs to God. Underpins religious views on abortion, euthanasia and war. Most religions believe only God should determine when life ends.", example: null },
      { term: "Just War Theory", definition: "Christian criteria for a war to be morally justified. Originally from Augustine and Aquinas. Conditions include: just cause (e.g. self-defence); last resort; declared by legitimate authority; proportionate force; aim must be good outcome.", example: "WWII is often cited as a Just War — opposing Nazi aggression" },
      { term: "Tawhid", definition: "The Islamic belief in the absolute oneness (monotheism) of Allah. The most fundamental principle of Islam. Shirk — associating partners with Allah — is considered the greatest sin.", example: "The Shahada proclaims: 'There is no god but Allah'" },
      { term: "Karma and Rebirth", definition: "In Hinduism and Buddhism, karma is the moral law of cause and effect — actions in this life affect future lives. Rebirth (reincarnation/samsara) is the cycle of death and rebirth. Moksha (Hinduism) or Nirvana (Buddhism) is release from the cycle.", example: null },
      { term: "The Problem of Evil", definition: "The philosophical challenge: if God is omnipotent, omniscient and omnibenevolent, why does evil and suffering exist? Natural evil: suffering caused by nature (earthquakes). Moral evil: suffering caused by human choices.", example: "The Holocaust is often cited as a challenge to the existence of an all-loving God" },
      { term: "Situation Ethics", definition: "An ethical theory developed by Joseph Fletcher arguing that the most loving action in a particular situation is always the right one. Rejects absolute rules. The only absolute is love (agape).", example: "Lying might be right if it saves a life — the situation determines the ethics" },
    ],
  },

  // ─────────────────────────────────────────────
  // ECONOMICS
  // ─────────────────────────────────────────────
  "Economics": {
    short: [
      { question: "What is opportunity cost?", answer: "Opportunity cost is the value of the next best alternative forgone when a decision is made. Every choice involves giving up something else.", marks: 2, hint: "What do you give up when you make a choice?" },
      { question: "What is inflation?", answer: "Inflation is the sustained rise in the general price level of goods and services over time. It is measured using indices such as the Consumer Price Index (CPI).", marks: 2, hint: "Prices rising over time" },
      { question: "Define 'GDP'.", answer: "Gross Domestic Product (GDP) is the total monetary value of all goods and services produced within a country in a specific period (usually a year). It is a key measure of economic output and living standards.", marks: 2, hint: "Total value of a country's output" },
      { question: "What is a monopoly?", answer: "A monopoly is a market structure in which a single firm dominates, with little or no competition. The monopolist has significant market power to set prices above competitive levels.", marks: 2, hint: "One firm dominates the market" },
    ],
    mid: [
      { question: "Explain the difference between a free market economy and a command economy.", answer: "In a free market economy, prices and resource allocation are determined by supply and demand with minimal government intervention. Firms compete for profit; consumers drive demand. Examples: USA, UK. In a command economy, the government owns and controls the means of production and makes all major economic decisions. Prices are set by the state. Example: Soviet Union (1917–1991). Mixed economies (like the UK) combine both elements — markets operate but the government regulates, taxes and provides public services.", marks: 4, hint: "Contrast who makes decisions, how prices are set, and give examples of each" },
      { question: "Explain the causes and consequences of unemployment.", answer: "Causes: cyclical unemployment — caused by recession when demand falls; structural unemployment — when industries decline (e.g. coal mining) and skills are no longer needed; frictional unemployment — between jobs; seasonal unemployment — in seasonal industries. Consequences for individuals: loss of income, reduced living standards, mental health problems, skill deterioration. Consequences for the economy: lower tax revenues, higher government spending on benefits, reduced output and GDP, social problems (crime, inequality).", marks: 4, hint: "Cover 3 types of unemployment and both individual and economic consequences" },
    ],
    long: [
      { question: "Assess the view that raising the minimum wage is always beneficial. (9 marks)", answer: "Raising the minimum wage increases income for the lowest paid workers, reducing poverty and income inequality. Higher wages increase consumer spending power, stimulating demand and potentially boosting economic growth. It may also reduce in-work benefits costs for the government. Employers may see reduced staff turnover as workers are better paid. However, critics argue a higher minimum wage increases labour costs for businesses, which may lead to job losses — particularly in labour-intensive sectors like retail and hospitality — as employers substitute labour with technology. Small businesses with tight margins may be particularly vulnerable. Price increases may follow as businesses pass on costs. Empirical evidence is mixed: studies (e.g. of the UK National Living Wage) have shown limited negative employment effects; others show localised job losses in vulnerable sectors. The impact depends on the level of the rise relative to market wages, the state of the economy and the sector. Conclusion: raising the minimum wage is broadly beneficial at moderate, phased increases, but aggressive rises risk negative employment effects particularly for small businesses and low-skill workers in marginal sectors.", marks: 8, hint: "Benefits: poverty reduction, spending power, inequality. Costs: job losses, business costs, price rises. Use evidence. Give a balanced conclusion." },
    ],
    flashcard: [
      { term: "Supply and Demand", definition: "Supply: quantity producers will sell at each price. Demand: quantity consumers will buy at each price. Equilibrium price: where supply equals demand. If demand rises (curve shifts right), price rises. If supply rises, price falls.", example: "Petrol shortage (supply falls) → price rises" },
      { term: "Fiscal Policy", definition: "Government use of taxation and public spending to influence the economy. Expansionary fiscal policy: increase spending / cut taxes to stimulate growth. Contractionary: cut spending / raise taxes to reduce inflation.", example: "COVID-19 furlough scheme = expansionary fiscal policy" },
      { term: "Monetary Policy", definition: "Central bank (Bank of England in the UK) uses interest rates and money supply to control inflation and growth. Raising interest rates: reduces borrowing and spending, controlling inflation. Lowering rates: stimulates borrowing and investment.", example: "Bank of England raised rates in 2022–23 to combat high inflation" },
      { term: "Price Elasticity of Demand (PED)", definition: "Measures how responsive demand is to a price change. PED = % change in quantity demanded ÷ % change in price. Elastic (PED > 1): demand changes significantly with price. Inelastic (PED < 1): demand barely changes.", example: "Petrol is inelastic — people need it even if prices rise" },
    ],
  },

  // ─────────────────────────────────────────────
  // FRENCH
  // ─────────────────────────────────────────────
  "French": {
    short: [
      { question: "How do you say 'I am going to the cinema' in French?", answer: "Je vais au cinéma.", marks: 1, hint: "Use 'aller' (to go) + au cinéma" },
      { question: "What is the French for 'I would like a coffee, please'?", answer: "Je voudrais un café, s'il vous plaît.", marks: 1, hint: "Conditional of vouloir + the item" },
      { question: "How do you form the perfect tense (passé composé) in French?", answer: "Subject + avoir or être (present tense) + past participle. Most verbs use avoir. Verbs of movement and reflexive verbs use être. The past participle must agree with the subject when using être.", marks: 2, hint: "Two-part verb: auxiliary (avoir/être) + past participle" },
      { question: "Give three time expressions used to talk about the future in French.", answer: "Demain (tomorrow), la semaine prochaine (next week), l'année prochaine (next year), bientôt (soon), dans deux jours (in two days).", marks: 2, hint: "Think: tomorrow, next week, next year..." },
      { question: "What is the difference between 'tu' and 'vous' in French?", answer: "'Tu' is the informal second-person singular, used with friends, family and peers. 'Vous' is either the formal singular (with adults you don't know well) or the plural 'you' (more than one person).", marks: 2, hint: "Formal vs informal — and plural" },
    ],
    mid: [
      { question: "Write a short paragraph in French about your daily routine (at least 5 sentences), using a variety of tenses.", answer: "[Model] D'habitude, je me lève à sept heures et je prends le petit déjeuner avec ma famille. Après, je vais au collège en bus. Hier, j'ai mangé à la cantine avec mes amis — c'était délicieux. Demain, je vais faire mes devoirs et regarder la télé. En général, je me couche à dix heures du soir. The response should include present, perfect and near future tense; reflexive verbs; connectives; and time expressions.", marks: 4, hint: "Present tense for routine, passé composé for yesterday, aller + infinitive for future plans. Use reflexive verbs (se lever, se coucher)." },
      { question: "Read this French text about the environment and answer the questions in English: 'La pollution de l'air est un grand problème dans les villes. Les voitures et les usines produisent trop de CO₂. Il faut utiliser les transports en commun pour protéger la planète.' (a) What is the main problem mentioned? (b) What are the causes? (c) What solution is suggested?", answer: "(a) Air pollution is a major problem in cities. (b) Cars and factories produce too much CO₂. (c) People should use public transport to protect the planet.", marks: 3, hint: "Read carefully. The answers are all in the text — no inference needed here." },
    ],
    long: [
      { question: "Write an email in French (approximately 150 words) to your French friend describing your school and giving your opinion about it. Use a range of tenses, opinions and connectives.", answer: "[Model answer — key features]: Opening (Salut/Cher), description of school (buildings, subjects), opinions using je pense que/je trouve que/à mon avis, comparisons, a past experience (passé composé), future plans (aller + infinitive), connectives (cependant, de plus, pourtant, bien que), closing. Example: Mon école est assez grande avec mille élèves. Il y a beaucoup de salles de classe modernes. Ma matière préférée est le français car c'est utile et intéressant. Cependant, je trouve les mathématiques très difficiles. Hier, j'ai eu un cours de sciences — c'était passionnant. L'année prochaine, je vais étudier pour mes examens. À mon avis, mon école est bien mais je préférerais avoir moins de devoirs!", marks: 8, hint: "Include: 3 tenses, opinion phrases, connectives, accurate verb endings. Aim for variety and accuracy over length." },
    ],
    flashcard: [
      { term: "Passé Composé", definition: "The French perfect tense used to describe completed past actions. Formed with avoir or être (present) + past participle. Regular -er verbs: -é (mangé). Regular -ir: -i (fini). -re: -u (vendu). 17 verbs use être (DR MRS VANDERTRAMP).", example: "J'ai mangé (I ate/have eaten). Elle est allée (She went)" },
      { term: "Imparfait (Imperfect)", definition: "Used for ongoing or habitual past actions, descriptions in the past, or interrupted actions. Formed from nous stem of present tense + endings: -ais, -ais, -ait, -ions, -iez, -aient.", example: "Quand j'étais jeune, je jouais au foot tous les jours (When I was young, I used to play football every day)" },
      { term: "Subjunctive Mood", definition: "Used after certain expressions of doubt, emotion, desire or necessity. Common triggers: il faut que, pour que, bien que, avant que. Verb endings change from standard forms.", example: "Il faut que tu fasses tes devoirs (You must do your homework)" },
      { term: "Adjectival Agreement", definition: "French adjectives agree in gender (masculine/feminine) and number (singular/plural) with the noun they describe. Most add -e for feminine, -s for plural, -es for feminine plural.", example: "Un garçon intelligent / Une fille intelligente / Des filles intelligentes" },
      { term: "Connectives for Writing", definition: "Key connectives: de plus (moreover), cependant (however), pourtant (yet), par contre (on the other hand), en revanche (on the other hand), bien que (although — takes subjunctive), donc (so/therefore).", example: "J'aime la ville. Cependant, la campagne est plus tranquille." },
      { term: "Future Tense (Futur Simple)", definition: "Formed by adding endings to the infinitive: -ai, -as, -a, -ons, -ez, -ont. Irregular stems: aller → ir-, avoir → aur-, être → ser-, faire → fer-, pouvoir → pourr-.", example: "Je mangerai (I will eat). Il sera (He will be)" },
    ],
  },

  // ─────────────────────────────────────────────
  // SPANISH
  // ─────────────────────────────────────────────
  "Spanish": {
    short: [
      { question: "How do you say 'I live in a house with my family' in Spanish?", answer: "Vivo en una casa con mi familia.", marks: 1, hint: "Use vivir (to live) in the present tense" },
      { question: "What is the difference between 'ser' and 'estar' in Spanish?", answer: "Both mean 'to be'. Ser is for permanent or inherent characteristics (identity, nationality, profession). Estar is for temporary states, conditions, positions and emotions.", marks: 2, hint: "Permanent vs temporary qualities" },
      { question: "How do you form the preterite tense for regular -ar verbs in Spanish?", answer: "Remove -ar and add: -é, -aste, -ó, -amos, -asteis, -aron. Example: hablar → hablé, hablaste, habló, hablamos, hablasteis, hablaron.", marks: 2, hint: "Replace -ar with preterite endings" },
      { question: "Give the Spanish for 'I would like to visit Spain in the future because it is beautiful.'", answer: "Me gustaría visitar España en el futuro porque es bonita/hermosa.", marks: 2, hint: "Use conditional of gustar + infinitive" },
    ],
    mid: [
      { question: "Write a paragraph in Spanish about your free time and hobbies (at least 5 sentences, including an opinion and a past experience).", answer: "[Model] En mi tiempo libre, me gusta escuchar música y salir con mis amigos. Practico el fútbol dos veces a la semana porque es emocionante. El fin de semana pasado, fui al cine con mi familia — la película fue increíble. En el futuro, me gustaría aprender a tocar la guitarra. En mi opinión, es importante tener pasatiempos para relajarse.", marks: 4, hint: "Present tense for habits, preterite for past experience, conditional for future. Include an opinion phrase." },
    ],
    long: [
      { question: "Write a formal letter in Spanish (approximately 150 words) applying for a summer work experience placement at a Spanish company. Include: why you want the role, your skills and experience, and your availability.", answer: "[Model] Estimado/a señor/señora, Le escribo para solicitar el puesto de prácticas laborales de verano. Soy estudiante de secundaria en el Reino Unido con mucho interés en los negocios internacionales. Hablo español desde hace cuatro años y me considero un/una estudiante trabajador/trabajadora y responsable. El año pasado, trabajé en una tienda local y aprendí mucho sobre el servicio al cliente. Además, sé usar programas informáticos como Word y Excel. Estoy disponible durante los meses de julio y agosto. Me gustaría mucho tener la oportunidad de desarrollar mis habilidades en un entorno profesional español. Adjunto mi currículum. Quedo a su disposición para cualquier información adicional. Atentamente, [Nombre]", marks: 8, hint: "Formal register, subjunctive where possible, range of tenses, connectives, formal opening and closing" },
    ],
    flashcard: [
      { term: "Ser vs Estar", definition: "SER: permanent traits, identity, origin, time, profession (SOY médico — I am a doctor). ESTAR: temporary states, emotions, location, ongoing actions (ESTOY cansado — I am tired).", example: "Ella ES española (nationality — ser). Ella ESTÁ en Madrid (location — estar)" },
      { term: "Preterite Tense", definition: "Used for completed, specific past actions. Regular -ar: -é, -aste, -ó, -amos, -asteis, -aron. Regular -er/-ir: -í, -iste, -ió, -imos, -isteis, -ieron. Key irregulars: ir/ser → fui; tener → tuve; hacer → hice.", example: "Ayer fui al parque (Yesterday I went to the park)" },
      { term: "Gustar Construction", definition: "To express liking: me gusta/n (I like), te gusta/n (you like), le gusta/n (he/she likes). Use gusta for singular nouns or infinitives; gustan for plural nouns.", example: "Me gusta el chocolate. Me gustan los deportes." },
      { term: "Conditional Tense", definition: "Used for what you would do. Formed by adding endings to the infinitive: -ía, -ías, -ía, -íamos, -íais, -ían. Same endings for -ar, -er, -ir verbs.", example: "Me gustaría viajar a México (I would like to travel to Mexico)" },
      { term: "Subjunctive Mood", definition: "Used after expressions of emotion, doubt, desire, necessity and certain conjunctions (para que, cuando in future, aunque). Common triggers: quiero que, es importante que, ojalá.", example: "Quiero que vengas (I want you to come)" },
      { term: "Opinion Phrases", definition: "En mi opinión (in my opinion), creo que (I believe that), pienso que (I think that), me parece que (it seems to me that), a mi juicio (in my judgement), desde mi punto de vista (from my point of view).", example: null },
    ],
  },

  // ─────────────────────────────────────────────
  // DESIGN & TECHNOLOGY
  // ─────────────────────────────────────────────
  "Design & Technology": {
    short: [
      { question: "What is the difference between thermoplastics and thermosetting plastics?", answer: "Thermoplastics can be repeatedly heated, reshaped and remoulded (e.g. PET, ABS, acrylic). Thermosetting plastics are permanently set after initial moulding and cannot be remelted (e.g. epoxy resin, melamine).", marks: 2, hint: "Can one be reheated and reshaped?" },
      { question: "What does 'ergonomics' mean in product design?", answer: "Ergonomics is the study of how products can be designed to fit the human body and its movements, making products comfortable, safe and efficient to use.", marks: 2, hint: "Designing products to fit the human body" },
      { question: "What is a prototype and why is it used?", answer: "A prototype is an early model or sample of a product made to test and evaluate the design before full production. It allows designers to identify problems and make improvements cost-effectively.", marks: 2, hint: "An early test model to check the design" },
      { question: "Name two environmental impacts of manufacturing products from polymers (plastics).", answer: "Any two: non-biodegradable waste that fills landfill; production requires fossil fuels; ocean/wildlife pollution from plastic waste; CO₂ emissions during manufacturing.", marks: 2, hint: "Think about what happens to plastic when it's thrown away and where it comes from" },
    ],
    mid: [
      { question: "Explain three factors that a designer must consider when choosing a material for a product.", answer: "1. Physical/mechanical properties: hardness, strength, flexibility, density — the material must perform the required function. 2. Cost: the material must be affordable in context of the selling price and production volume. 3. Sustainability: can the material be recycled, is it renewable, what is its environmental impact? Other valid factors: aesthetics (appearance, texture), availability, ease of manufacturing (machinability, formability).", marks: 4, hint: "Cover properties, cost and sustainability. Give specific examples for each." },
      { question: "Describe the process of vacuum forming and identify a suitable product made using this technique.", answer: "A flat sheet of thermoplastic (e.g. acrylic or HIPS) is clamped above a mould. It is heated until soft and pliable. The mould is raised into the plastic and a vacuum is applied beneath, pulling the plastic tightly over the mould. The plastic cools and sets in the mould's shape. The finished piece is trimmed to remove excess. Suitable products: food packaging, chocolate box trays, yoghurt pots, blister packaging, toy packaging inserts.", marks: 4, hint: "Describe each stage: heat, mould, vacuum, cool, trim. Name a real product." },
    ],
    long: [
      { question: "Evaluate how a product of your choice could be redesigned to be more sustainable across its lifecycle. (8 marks)", answer: "Take a smartphone as an example. Lifecycle stages: raw material extraction; manufacturing; distribution; use phase; end of life. Raw materials: rare earth metals mined unsustainably — redesign to use fewer rare materials or bio-based alternatives; modular design allowing component replacement extends lifespan. Manufacturing: reduce energy consumption by sourcing renewable energy; reduce waste through lean manufacturing. Distribution: reduce packaging size and weight; use recycled/recyclable materials for packaging. Use: improve repairability (Right to Repair movement); design for longevity with software updates; improve energy efficiency. End of life: Design for disassembly — standardised screws, fewer adhesives — making recycling easier. Take-back schemes (Apple/Samsung) collect old devices. Evaluation: The biggest gains come from extending product lifespan (reducing need for replacement) and improving end-of-life recyclability. Economic barriers exist — companies profit from replacement cycles. Regulation (EU Right to Repair) is driving change.", marks: 8, hint: "Cover each lifecycle stage. Suggest specific design changes. Evaluate barriers (cost, commercial pressures) and benefits." },
    ],
    flashcard: [
      { term: "Six R's of Sustainability", definition: "Reduce (use less material/energy); Reuse (use products again); Recycle (process materials into new products); Rethink (question design decisions); Repair (extend product life); Refuse (reject unnecessary products).", example: null },
      { term: "Ferrous and Non-Ferrous Metals", definition: "Ferrous metals contain iron and are prone to rust (e.g. mild steel, cast iron, stainless steel). Non-ferrous metals do not contain iron and are more resistant to corrosion (e.g. aluminium, copper, titanium).", example: "Mild steel: car body panels (ferrous). Aluminium: aircraft fuselage (non-ferrous)" },
      { term: "CAD/CAM", definition: "CAD (Computer-Aided Design): designing products digitally using software (e.g. AutoCAD, Fusion 360). CAM (Computer-Aided Manufacture): using computer-controlled machinery (CNC routers, laser cutters, 3D printers) to manufacture from CAD files.", example: null },
      { term: "System and Control", definition: "Systems have inputs, processes and outputs. Feedback loops allow systems to respond to changes. Electronic systems use components like resistors, LEDs, transistors and microcontrollers (Arduino, Raspberry Pi).", example: "Thermostat: input (temperature), process (compare to set point), output (heating on/off)" },
    ],
  },

  // ─────────────────────────────────────────────
  // FOOD PREPARATION & NUTRITION
  // ─────────────────────────────────────────────
  "Food Preparation & Nutrition": {
    short: [
      { question: "Name the five food groups in the Eatwell Guide.", answer: "1. Fruit and vegetables; 2. Starchy carbohydrates (bread, rice, pasta, potatoes); 3. Dairy and alternatives; 4. Proteins (beans, pulses, fish, eggs, meat); 5. Oils and spreads (small amounts).", marks: 2, hint: "Think about the different colour sections of the Eatwell Guide" },
      { question: "What is the function of protein in the diet?", answer: "Protein is needed for growth and repair of body tissues, making enzymes and hormones, and supporting the immune system. It is made of amino acids.", marks: 2, hint: "Growth and repair" },
      { question: "What happens to starch when it is heated with water (gelatinisation)?", answer: "Starch granules absorb water and swell. As temperature increases, they burst and the starch thickens the liquid. This is called gelatinisation and is used in sauces, custards and soups.", marks: 2, hint: "Think about making a sauce thicker when you heat it" },
      { question: "What is the difference between saturated and unsaturated fats?", answer: "Saturated fats are solid at room temperature and mainly from animal sources. High intake is linked to raised cholesterol and heart disease. Unsaturated fats (mono and polyunsaturated) are liquid at room temperature and mainly from plant sources — considered healthier.", marks: 2, hint: "Which is solid? Which is liquid? Which is healthier?" },
    ],
    mid: [
      { question: "Explain how to follow food safety principles when preparing raw chicken.", answer: "Store raw chicken at the bottom of the fridge at 0–5°C to prevent drip contamination. Use a separate red chopping board to avoid cross-contamination. Wash hands thoroughly before and after handling raw chicken. Never wash raw chicken — splashing spreads bacteria. Cook to a core temperature of 75°C to kill Salmonella and Campylobacter. Use a probe thermometer to check core temperature. Ensure juices run clear. Do not leave chicken at room temperature for more than two hours.", marks: 4, hint: "Cover: storage, cross-contamination, handwashing, cooking temperature, not washing raw meat" },
      { question: "Explain how the Maillard reaction and caramelisation differ, and give an example of each.", answer: "The Maillard reaction occurs when proteins and sugars are heated together, producing complex flavours and brown colour. It requires temperatures above 140°C. Example: browning of bread crusts, searing meat. Caramelisation occurs when sugars alone are heated, breaking down and producing brown colour and sweet, complex flavours. Example: making toffee or crème brûlée topping. Both improve flavour and appearance but involve different chemical processes — Maillard requires protein; caramelisation does not.", marks: 4, hint: "Define each process, state what chemicals are involved, and give a specific food example for each" },
    ],
    long: [
      { question: "Plan a nutritionally balanced meal for a teenager who is lactose intolerant and vegetarian. Justify your food choices. (8 marks)", answer: "Meal suggestion: Tofu and vegetable stir-fry with brown rice and a green salad, followed by fruit salad with coconut yoghurt. Justification: Tofu provides complete protein (all essential amino acids) and calcium, replacing dairy. Brown rice provides complex carbohydrates for sustained energy and B vitamins and fibre. Mixed vegetables (broccoli, peppers, spinach) provide vitamins A, C and K, iron and folate. Sunflower oil for cooking provides unsaturated fats. No dairy ingredients — coconut yoghurt replaces dairy yoghurt. Fruit salad provides vitamin C, which aids absorption of non-haem iron from the tofu and spinach. Brown rice and vegetables provide sufficient fibre. The meal is low in saturated fat, high in fibre and micronutrients, and appropriate for a lactose-intolerant vegetarian teenager whose needs include calcium (tofu/fortified alternatives), iron (spinach, tofu) and adequate calories for growth.", marks: 8, hint: "Name specific foods, link each to specific nutrients, explain WHY each nutrient is needed, address BOTH dietary requirements (vegetarian + lactose intolerant)" },
    ],
    flashcard: [
      { term: "Macronutrients", definition: "Nutrients needed in large amounts: Carbohydrates (energy — 4kcal/g), Proteins (growth and repair — 4kcal/g), Fats (energy, insulation — 9kcal/g). Each has primary functions beyond just energy.", example: null },
      { term: "Micronutrients", definition: "Vitamins and minerals needed in small amounts. Fat-soluble vitamins (A, D, E, K) stored in body. Water-soluble (B, C) not stored — needed daily. Key minerals: calcium (bones), iron (haemoglobin), iodine (thyroid).", example: "Vitamin D: bone health, immune function — deficiency causes rickets" },
      { term: "Food Preservation Methods", definition: "Methods to prevent spoilage: refrigeration/freezing (slows bacteria); heat treatment (pasteurisation, UHT — kills bacteria); dehydration (removes water bacteria need); pickling (vinegar, low pH); vacuum packing (removes oxygen); curing (salt draws out moisture).", example: "Milk is pasteurised (72°C for 15 seconds) to kill harmful bacteria" },
      { term: "High-Risk Foods", definition: "Foods that provide ideal conditions for bacteria growth: warm, moist, neutral pH, high protein. Include: cooked meat, cooked rice, dairy products, raw meat and fish, shellfish, eggs.", example: "Cooked rice left at room temperature can grow Bacillus cereus bacteria" },
      { term: "Functional Properties of Eggs", definition: "Coagulation (setting when heated — quiche, scrambled eggs); Emulsification (lecithin in yolk allows oil+water mixtures — mayonnaise); Aeration/foaming (trapping air when whisked — meringue, soufflé); Glazing (adds shine when egg-washed on pastry).", example: null },
    ],
  },

  // ─────────────────────────────────────────────
  // PHYSICAL EDUCATION
  // ─────────────────────────────────────────────
  "Physical Education": {
    short: [
      { question: "What is the difference between aerobic and anaerobic exercise?", answer: "Aerobic exercise uses oxygen to produce energy and can be sustained for long periods (e.g. running, cycling). Anaerobic exercise occurs without oxygen, produces energy rapidly but only for short bursts, and produces lactic acid (e.g. sprinting, weightlifting).", marks: 2, hint: "One uses oxygen; the other doesn't" },
      { question: "What is 'cardiac output' and how is it calculated?", answer: "Cardiac output is the volume of blood pumped by the heart per minute. Cardiac output = heart rate × stroke volume.", marks: 2, hint: "Heart rate × stroke volume" },
      { question: "Name the three types of muscle fibres and their characteristics.", answer: "Type I (slow twitch): fatigue resistant, aerobic, used in endurance activities. Type IIa (fast oxidative glycolytic): moderate speed, mix of aerobic and anaerobic. Type IIb (fast twitch glycolytic): powerful and fast, fatigue quickly, anaerobic, used in explosive activities.", marks: 3, hint: "Slow twitch vs fast twitch — which is used for a marathon vs a 100m sprint?" },
      { question: "What is 'RICE' in the treatment of sports injuries?", answer: "RICE stands for: Rest (stop the activity); Ice (apply ice to reduce swelling); Compression (bandage to limit swelling); Elevation (raise the injured limb above heart level).", marks: 2, hint: "An acronym for treating soft tissue injuries" },
    ],
    mid: [
      { question: "Explain how training principles (FITT) should be applied to improve cardiovascular fitness.", answer: "FITT stands for: Frequency — how often you train (beginners: 3 sessions/week; advanced: 5+). Intensity — how hard you work, measured by heart rate percentage of maximum. For aerobic fitness: 60–80% of max HR (220 − age). Time — duration of each session (minimum 20 minutes for cardiovascular benefit). Type — the type of exercise (for cardiovascular fitness: continuous running, cycling, swimming). Without progressive overload — gradually increasing FITT — the body adapts and improvements plateau.", marks: 4, hint: "Define each component of FITT and explain how each relates specifically to cardiovascular training" },
      { question: "Analyse the physical and psychological effects of a warm-up before exercise.", answer: "Physical effects: Increased heart rate and blood flow delivering more oxygen to muscles. Raised muscle temperature improves enzyme activity and contraction speed. Increased flexibility and range of motion reduces injury risk. Gradual increase in breathing rate prepares the respiratory system. Synovial fluid lubricates joints. Psychological effects: Mental preparation and focus; reduces pre-competition anxiety; activates arousal to an optimum level (Inverted U theory); rehearsal of skills builds confidence and reduces errors in performance.", marks: 4, hint: "Cover at least 3 physical effects and 2 psychological effects. Use physiological language." },
    ],
    long: [
      { question: "Evaluate the impact of lifestyle factors on performance and long-term health. Consider diet, rest and the effects of smoking and alcohol. (8 marks)", answer: "Diet: A balanced diet provides energy (carbohydrates), tissue repair (protein), bone health (calcium/vitamin D) and hydration. Carbohydrate loading before endurance events, protein after resistance training. Poor diet leads to fatigue, injury and chronic disease (obesity, type 2 diabetes, heart disease). Rest: Sleep (7-9 hours/night) is when growth hormone is released, muscles repair and glycogen is restored. Overtraining without rest leads to performance decline, injury and burnout. Rest days allow adaptation. Smoking: Reduces lung capacity and oxygen delivery (CO binds haemoglobin preferentially over O₂); increases heart disease and stroke risk; impairs recovery; reduces bone density. Performance is severely impaired. Long-term: COPD, lung cancer. Alcohol: Dehydrates the body; impairs coordination and reaction time; disrupts sleep patterns; adds empty calories; delays recovery; long-term liver disease, heart disease. Professional athletes are advised to avoid alcohol during training/competition phases. Overall, an athlete optimising all four factors maximises performance potential and long-term health. The cumulative effect of poor lifestyle choices is compounded — one poor habit often leads to others.", marks: 8, hint: "Cover all four factors. For each: short-term effect on performance + long-term health impact. Conclude with overall evaluation." },
    ],
    flashcard: [
      { term: "Principle of Overload (FITT)", definition: "For fitness to improve, the body must be stressed beyond its current capacity. Apply FITT: increase Frequency, Intensity, Time or Type of training. Without overload, the body adapts and plateaus.", example: "Increasing your run from 3km to 5km each session = overload" },
      { term: "Aerobic Respiration in Muscles", definition: "Glucose + oxygen → carbon dioxide + water + ATP (energy). Occurs at low to moderate intensity. Uses slow-twitch muscle fibres. Can be sustained long-term. VO₂ max measures the maximum oxygen uptake capacity.", example: "Marathon running relies almost entirely on aerobic respiration" },
      { term: "Synovial Joint", definition: "A freely moveable joint containing synovial fluid (lubricant), a joint capsule, cartilage (cushions bone ends) and ligaments (bone to bone). Types include ball and socket (hip), hinge (knee), pivot (neck).", example: "The knee is a hinge joint allowing flexion and extension" },
      { term: "Components of Fitness", definition: "Health-related: cardiovascular endurance, muscular endurance, muscular strength, flexibility, body composition. Skill-related: agility, balance, coordination, power, reaction time, speed.", example: "A gymnast needs high flexibility and balance; a sprinter needs speed and power" },
    ],
  },

  // ─────────────────────────────────────────────
  // DRAMA
  // ─────────────────────────────────────────────
  "Drama": {
    short: [
      { question: "What is 'proxemics' in drama?", answer: "Proxemics refers to the use of space and physical distance between performers on stage to communicate relationships, power and emotion. Close proximity may suggest intimacy or confrontation; distance may suggest formality or isolation.", marks: 2, hint: "The use of space and distance between actors" },
      { question: "What is the difference between naturalistic and non-naturalistic performance styles?", answer: "Naturalistic performance aims to represent everyday life realistically — speech, movement and staging feel real. Non-naturalistic performance uses stylised, exaggerated or symbolic techniques (e.g. physical theatre, Brechtian techniques) that draw attention to the theatrical process.", marks: 2, hint: "Real-life representation vs stylised, symbolic approaches" },
      { question: "What does 'ensemble performance' mean?", answer: "Ensemble performance is when a group of performers work together with equal importance and collaborative technique, often without a single protagonist. Emphasises collective storytelling.", marks: 1, hint: "Group performance — all performers are equally important" },
      { question: "Name two Brechtian techniques and explain their purpose.", answer: "Any two: Direct address (actors speak to audience — breaks the fourth wall, prevents emotional immersion); Placards/captions (display scene titles — remind audience they are watching a play); Narration; Multi-role; Gestus (a characteristic gesture representing social attitude). Purpose: Verfremdungseffekt (alienation effect) — to make the audience think critically rather than become emotionally absorbed.", marks: 2, hint: "Brecht wanted audiences to think, not just feel. How did he stop them getting too absorbed?" },
    ],
    mid: [
      { question: "Explain how a director might use stage space, levels and lighting to create tension in a scene.", answer: "A director can use different stage areas to control focus. Placing a character downstage centre gives them power and focus; isolating a character upstage creates vulnerability. Using levels — one character elevated (on a chair/platform) and another lower — communicates power imbalance. Tight, focused spotlights isolate characters and exclude the world. Dim, blue or low-key lighting creates unease; darkness beyond the acting area implies threat. Shadows can suggest mystery or danger. Freeze frames or slow motion can heighten tension by focusing the audience's attention on a critical moment.", marks: 4, hint: "Cover: staging position, levels, lighting colour and intensity, and how each affects the audience's emotional response" },
    ],
    long: [
      { question: "Evaluate a theatrical performance you have studied, analysing how the director or performers used theatrical elements to communicate the play's themes. (8 marks)", answer: "[This answer should reference a specific studied performance. Model structure]: Introduction identifying the production and its central themes. Analysis of at least three theatrical elements: use of space/staging; characterisation and physicality; voice (pitch, pace, pause, projection); lighting design; sound design; costume; set design. Each element should be linked explicitly to the theme communicated. Evaluation of effectiveness should include reference to the audience's response. Conclusion judging the overall success of the production in communicating its message.", marks: 8, hint: "Identify a specific production you have studied. Analyse 3+ theatrical elements. Link each to theme. Include your evaluation of effectiveness and audience response." },
    ],
    flashcard: [
      { term: "Stanislavski's System", definition: "Method acting approach developed by Constantin Stanislavski. Actors create authentic, psychologically realistic performances by: emotional memory; given circumstances; 'magic if'; units and objectives; method of physical actions.", example: "An actor recalling a real emotional memory to make grief on stage authentic" },
      { term: "Brecht and Epic Theatre", definition: "Bertolt Brecht developed Epic Theatre to make audiences think critically about social and political issues. Used alienation (Verfremdungseffekt) techniques: direct address, placards, narration, multi-role — to prevent emotional immersion.", example: "Mother Courage: actors remind audience they are watching a play throughout" },
      { term: "Physical Theatre", definition: "A style of performance where the body is the primary storytelling tool. Emphasises movement, gesture and physicality over words. Groups include DV8, Frantic Assembly and Complicité.", example: "Telling a story through movement and mime without speaking a word" },
      { term: "Semiotics in Theatre", definition: "The study of signs and symbols in performance. Everything on stage — costume, lighting, set, gesture — is a sign communicating meaning to the audience. A director makes semiotic choices intentionally.", example: "Red lighting = danger/passion; a broken chair = poverty/dysfunction" },
    ],
  },

  // ─────────────────────────────────────────────
  // MUSIC
  // ─────────────────────────────────────────────
  "Music": {
    short: [
      { question: "What is a 'chord'?", answer: "A chord is three or more notes played simultaneously. Common chord types include major (bright, happy sound), minor (darker, sadder sound), diminished and augmented.", marks: 1, hint: "Multiple notes played at the same time" },
      { question: "What does 'tempo' mean in music?", answer: "Tempo is the speed of the music, measured in beats per minute (BPM). Common Italian terms: Presto (very fast), Allegro (fast), Moderato (moderate), Andante (walking pace), Adagio (slow), Largo (very slow).", marks: 2, hint: "How fast or slow the music is played" },
      { question: "Name the four families of instruments in an orchestra.", answer: "Strings (violin, cello, double bass), woodwind (flute, clarinet, oboe, bassoon), brass (trumpet, trombone, French horn, tuba) and percussion (timpani, snare drum, xylophone).", marks: 2, hint: "Think about how each group makes its sound" },
      { question: "What is 'polyphony'?", answer: "Polyphony is a texture where two or more independent melodic lines are played simultaneously. Common in Baroque music (Bach). Contrast with monophony (single melody) and homophony (melody with chordal accompaniment).", marks: 2, hint: "Multiple independent melodic lines at the same time" },
    ],
    mid: [
      { question: "Analyse the musical features of the Blues genre, including structure, harmony and performance techniques.", answer: "The Blues typically uses a 12-bar chord structure based on chords I, IV and V in a repeating pattern. Harmonically, it features the blues scale (including the flattened 3rd, 5th and 7th — 'blue notes'). The style is predominantly in major keys but with these flattened notes adding emotional complexity. Performance features: call and response (voice followed by guitar); improvisation; bent notes (guitar strings pushed to alter pitch); vibrato; shuffled rhythmic feel. Often in 4/4 time. Expressive lyrics typically address themes of hardship, love and loss. Originated in African American communities in the Deep South — influenced jazz, rock and pop.", marks: 4, hint: "Cover: 12-bar structure (I, IV, V), blues scale, blue notes, call and response, improvisation, and cultural context" },
    ],
    long: [
      { question: "Compare and contrast two contrasting musical pieces you have studied, discussing melody, harmony, texture, dynamics and instrumentation. (8 marks)", answer: "[This should reference two specific set works. Model structure]: Introduction naming both works and identifying their genres/periods. Comparison of: melody (conjunct vs disjunct, range, use of ornamentation); harmony (consonant/dissonant, tonal/atonal, harmonic rhythm); texture (monophonic, homophonic, polyphonic, heterophonic); dynamics (forte, piano, crescendo, changes and their expressive effect); instrumentation (forces used, timbre, solo vs ensemble, electronic vs acoustic). Analysis should link musical features to style and period. Conclusion judging how musical features reflect the contrasting contexts.", marks: 8, hint: "Be specific about musical features. Use technical vocabulary (conjunct, homophonic, etc.). Link features to genre, period and context." },
    ],
    flashcard: [
      { term: "Musical Elements (SHMRDT)", definition: "Structure, Harmony, Melody, Rhythm, Dynamics, Texture (and also Timbre/Tonality). The main elements used to analyse and describe music.", example: null },
      { term: "Cadences", definition: "A harmonic progression that creates a sense of pause or ending. Perfect cadence (V→I): strong, complete ending. Imperfect (I/II/IV→V): incomplete, question-like. Plagal (IV→I): hymn-like, 'Amen'. Interrupted (V→VI): unexpected.", example: "Final chord of most Western songs = perfect cadence (V→I)" },
      { term: "Modulation", definition: "The process of changing key within a piece. A piece may modulate to the dominant (5th above), relative major/minor or other related keys. Adds variety and interest.", example: "A song beginning in C major modulating to G major for the chorus" },
      { term: "Counterpoint", definition: "The technique of combining two or more independent melodic lines that work harmonically together. A feature of Baroque polyphony. Developed by Bach in fugues.", example: "A Bach two-part invention: two equal voices weaving around each other" },
      { term: "Tonality", definition: "Whether music is in a major key (bright, happy), minor key (darker, sad), atonal (no key centre — 20th century), modal (using modes like Dorian, Phrygian) or pentatonic (5-note scale).", example: "Beethoven's 5th Symphony: minor key for dramatic opening; major for triumphant finale" },
    ],
  },

  // ─────────────────────────────────────────────
  // ART & DESIGN
  // ─────────────────────────────────────────────
  "Art & Design": {
    short: [
      { question: "What are the primary colours?", answer: "Red, blue and yellow (in traditional subtractive colour mixing). When mixed in pairs: red + blue = purple, red + yellow = orange, yellow + blue = green.", marks: 1, hint: "The three colours that cannot be created by mixing others" },
      { question: "What does 'composition' mean in art?", answer: "Composition refers to the arrangement and organisation of visual elements within an artwork — including how subjects, shapes, lines and space are placed to create balance, rhythm and visual interest.", marks: 2, hint: "How the artist arranges everything in the image" },
      { question: "What is 'chiaroscuro'?", answer: "Chiaroscuro is an Italian term describing the contrast between light and dark in a work of art. It creates a sense of three-dimensionality, drama and atmosphere. Associated with Renaissance painters like Caravaggio.", marks: 2, hint: "The contrast between light and dark — associated with Caravaggio" },
      { question: "What is the difference between abstract and figurative art?", answer: "Figurative art represents recognisable subjects from the real world — people, landscapes, objects. Abstract art does not represent real objects; instead it uses colour, shape, form and line to create visual experience.", marks: 2, hint: "Does the artwork look like something recognisable?" },
    ],
    mid: [
      { question: "Explain how an artist might develop a personal response to a theme, using a range of media and techniques.", answer: "Initial research: collecting primary sources (own photographs, drawings, observations) and secondary sources (artists' work, art history, cultural references). The artist experiments with different media — pencil, watercolour, ink, collage, photography, digital — to explore textures, mark-making and composition. They develop ideas through a sketchbook journey, annotating decisions and reflecting on what works. Artist influence: studying how relevant artists have approached similar themes (e.g. studying Frida Kahlo's self-portraits when exploring identity). Refining ideas: selecting the most successful elements and developing them toward a final piece. Evaluation is ongoing throughout the process.", marks: 4, hint: "Cover: primary/secondary research, media experiments, artist influence, sketchbook development, and final piece planning" },
    ],
    long: [
      { question: "Analyse how an artist you have studied uses the formal elements (line, shape, colour, texture, tone, form, space) to communicate meaning or emotion in a specific work. (8 marks)", answer: "[Should reference a specific named artist and work. Model structure]: Introduction identifying the artist, work and its context/theme. Analysis of each formal element used: Line (quality — gestural, precise, broken — and what it communicates); Colour (palette, temperature, symbolism, emotional effect); Tone (range from dark to light, chiaroscuro, flatness); Texture (actual or implied surface quality); Form (three-dimensionality, mass, weight); Space (negative space, foreground/background, perspective); Shape (geometric vs organic). Link each element to the artist's intention and the viewer's emotional response. Contextual understanding: how the artwork reflects its time, culture or the artist's biography. Conclusion evaluating the overall effectiveness of the work.", marks: 8, hint: "Analyse at least 5 formal elements. Use technical vocabulary. Connect formal elements to meaning, emotion and context." },
    ],
    flashcard: [
      { term: "Formal Elements of Art", definition: "The building blocks of visual art: Line (direction, quality, weight); Shape (geometric, organic, negative); Colour (hue, saturation, temperature); Tone (light to dark); Texture (surface quality); Form (3D quality); Space (use of foreground, background, perspective).", example: null },
      { term: "Colour Theory", definition: "Primary colours (red, yellow, blue) mix to form secondary colours (orange, green, purple). Complementary colours sit opposite on the colour wheel and create contrast. Warm colours (red, orange, yellow) advance; cool colours (blue, green) recede.", example: "Van Gogh used complementary blue and orange to create vibrant contrast" },
      { term: "Impressionism", definition: "Late 19th century art movement emphasising capturing light, atmosphere and the impression of a moment rather than precise detail. Short, loose brushwork. Artists: Monet, Renoir, Degas, Pissarro.", example: "Monet's Water Lilies series: captures light and reflection rather than precise detail" },
      { term: "Printmaking", definition: "Creating multiple copies of an image from a matrix (plate or block). Types: relief printing (linocut, woodcut); intaglio (etching, engraving); screen printing (silkscreen); lithography.", example: "Andy Warhol's screen prints of Marilyn Monroe — repeated imagery in multiple colours" },
    ],
  },

  // ─────────────────────────────────────────────
  // GERMAN
  // ─────────────────────────────────────────────
  "German": {
    short: [
      { question: "How do you say 'I am going to the cinema with my friends on Saturday' in German?", answer: "Ich gehe am Samstag mit meinen Freunden ins Kino.", marks: 1, hint: "Gehen = to go; am Samstag = on Saturday; mit + dative" },
      { question: "What is the difference between 'Akkusativ' and 'Dativ' in German?", answer: "Akkusativ is the direct object case — the thing directly receiving the action. Dativ is the indirect object — the person/thing for whom the action is done. Certain prepositions always take accusative (durch, für, ohne) and others always take dative (mit, nach, bei, seit, von, zu).", marks: 2, hint: "Accusative = direct object; dative = indirect object / certain prepositions" },
      { question: "How do you form the perfect tense (Perfekt) in German?", answer: "Subject + haben or sein (present tense) + past participle at the end of the clause. Most verbs use haben. Verbs of movement/change of state use sein (e.g. gehen → gegangen, fahren → gefahren). Past participle: regular verbs = ge + stem + t (gemacht); irregular verbs must be learned.", marks: 2, hint: "Two-part verb: haben/sein + past participle at the end" },
    ],
    mid: [
      { question: "Write a paragraph in German about your school, including opinions and a description of a typical day. (At least 5 sentences, variety of tenses)", answer: "[Model] Meine Schule ist ziemlich groß und hat über tausend Schüler. Ich finde Deutsch sehr interessant, weil es nützlich für die Zukunft ist. Normalerweise fange ich die Schule um acht Uhr an. Gestern hatte ich einen Mathetest — er war sehr schwierig! Nächstes Jahr werde ich mein Abitur machen. Use of: present tense, opinions (ich finde/meine), past (Perfekt or Imperfekt), future (werden + infinitive), subordinate clauses.", marks: 4, hint: "Use present for descriptions, Perfekt for past events, werden for future plans. Include opinion phrases (ich finde/meine/halte). Check verb-second word order and subordinate clause verb-final." },
    ],
    long: [
      { question: "Write a formal email in German (approximately 150 words) to a German-speaking company requesting work experience. Include: why you are interested, your skills and language ability, and availability.", answer: "[Model] Sehr geehrte Damen und Herren, ich schreibe Ihnen, um mich für ein Praktikum in Ihrem Unternehmen zu bewerben. Ich bin Schüler/Schülerin an einer Schule in Großbritannien und lerne seit vier Jahren Deutsch. Ich interessiere mich sehr für Marketing und internationale Geschäfte. Ich bin fleißig, zuverlässig und teamfähig. Letztes Jahr habe ich in einem lokalen Geschäft gejobbt und viel Erfahrung im Kundenservice gesammelt. Außerdem kann ich gut mit Computern umgehen. Ich stehe vom 1. bis 31. Juli zur Verfügung. Ich würde mich sehr über eine positive Antwort freuen und sende Ihnen hiermit meinen Lebenslauf. Mit freundlichen Grüßen, [Name]", marks: 8, hint: "Formal register (Sie, Sehr geehrte/r, Mit freundlichen Grüßen). Subjunctive würde for politeness. Past tense for experience. Vary connectives (außerdem, jedoch, weil). Accurate case endings." },
    ],
    flashcard: [
      { term: "German Cases", definition: "Nominative (subject — der/die/das/die). Accusative (direct object — den/die/das/die). Dative (indirect object — dem/der/dem/den). Genitive (possession — des/der/des/der). Adjective endings change according to case and gender.", example: "Der Mann (nom.) sieht den Mann (acc.)" },
      { term: "Separable Verbs", definition: "Verbs with a prefix that separates in main clauses: anrufen (to call), aufmachen (to open), fernsehen (to watch TV). In a sentence: prefix goes to the END of the clause.", example: "Ich rufe meinen Freund an (I am calling my friend)" },
      { term: "Modal Verbs", definition: "Können (can), müssen (must), dürfen (may/allowed), sollen (should/supposed to), wollen (want to), mögen (like). In present tense, they are followed by an infinitive at the end. Have irregular stems.", example: "Ich muss meine Hausaufgaben machen (I must do my homework)" },
      { term: "Word Order Rules", definition: "Main clause: verb in second position always. Subordinate clause (weil, dass, wenn, obwohl): verb goes to the END. Time-Manner-Place order for adverbs. Coordinating conjunctions (und, aber, oder): no change to word order.", example: "Ich gehe heute mit dem Bus zur Schule. (Time-Manner-Place)" },
    ],
  },

};

// ─────────────────────────────────────────────

// EDUCATE — Subtopic Question Bank
// Pre-generated for Mathematics, Biology, Chemistry, Physics
// Structure: SUBTOPIC_BANK[subject][topic][subtopic][type] = [questions]

const SUBTOPIC_BANK = {

  // ════════════════════════════════════════════════════════════════
  // MATHEMATICS
  // ════════════════════════════════════════════════════════════════
  "Mathematics": {
    "Number": {
      "Fractions & Decimals": {
        short: [
          { question: "Calculate ⅔ + ¾, giving your answer as a mixed number.", answer: "⅔ + ¾ = 8/12 + 9/12 = 17/12 = 1 5/12", marks: 2, hint: "Find a common denominator first" },
          { question: "Convert 0.36 recurring to a fraction.", answer: "Let x = 0.363636... → 100x = 36.363636... → 99x = 36 → x = 36/99 = 4/11", marks: 2, hint: "Multiply by 100 to shift two recurring digits" },
        ],
        mid: [
          { question: "A recipe needs ⅗ of a cup of sugar. James wants to make 3½ times the recipe. How much sugar does he need?", answer: "⅗ × 3½ = ⅗ × 7/2 = 42/10 = 21/5 = 4⅕ cups", marks: 3, hint: "Convert the mixed number to an improper fraction first, then multiply" },
        ],
        long: [
          { question: "Show that 0.126̄ (0.1266666...) can be written as 19/150. Show full algebraic working.", answer: "Let x = 0.1266666... Multiply by 10: 10x = 1.26666... Multiply by 100: 100x = 12.6666... Subtract: 90x = 11.4 → x = 11.4/90 = 114/900 = 19/150 ✓", marks: 4, hint: "Multiply to move the non-recurring part past the decimal, then multiply again to move one recurring cycle" },
        ],
        flashcard: [
          { term: "Adding Fractions", definition: "Find the LCM of the denominators (common denominator), convert each fraction, then add the numerators. Simplify the result if possible.", example: "1/3 + 1/4 = 4/12 + 3/12 = 7/12" },
          { term: "Multiplying Fractions", definition: "Multiply numerators together and denominators together. Cancel common factors before multiplying if possible (cross-cancellation).", example: "⅔ × ¾ = (2×3)/(3×4) = 6/12 = ½" },
          { term: "Recurring Decimals", definition: "A decimal that repeats indefinitely. To convert to a fraction: let x = the decimal, multiply to align recurring digits, subtract to eliminate the recurring part, solve for x.", example: "0.̄3 = 1/3; 0.̄1̄2 = 12/99 = 4/33" },
        ],
      },
      "Percentages": {
        short: [
          { question: "A TV costs £420 after a 30% discount. What was the original price?", answer: "70% = £420, so 1% = £6, so 100% = £600", marks: 2, hint: "£420 represents 70% of the original price" },
          { question: "Increase £350 by 15%.", answer: "£350 × 1.15 = £402.50", marks: 1, hint: "Multiply by 1.15 for a 15% increase" },
        ],
        mid: [
          { question: "£5,000 is invested at 3.5% compound interest per year. Calculate the value after 4 years to the nearest penny.", answer: "A = 5000 × (1.035)⁴ = 5000 × 1.14752... = £5737.62", marks: 3, hint: "Use A = P(1 + r/100)ⁿ" },
        ],
        long: [
          { question: "A house price rises by 8% in year 1, falls by 5% in year 2, then rises by 3% in year 3. Find the overall percentage change from the start price. Show all working.", answer: "Multiplier = 1.08 × 0.95 × 1.03 = 1.08 × 0.9785 = 1.056... × 1.03... Let start = £100. After y1: £108. After y2: £108 × 0.95 = £102.60. After y3: £102.60 × 1.03 = £105.678. Overall change = +5.678% ≈ +5.68%", marks: 5, hint: "Apply each multiplier in sequence to a starting value of 100. The final value minus 100 gives the percentage change." },
        ],
        flashcard: [
          { term: "Percentage Multiplier", definition: "To increase by r%: multiply by (1 + r/100). To decrease by r%: multiply by (1 − r/100). Reverse percentage: divide by the multiplier.", example: "20% increase: × 1.2. After 20% increase gives £60: original = 60 ÷ 1.2 = £50" },
          { term: "Compound Interest Formula", definition: "A = P(1 + r/100)ⁿ where A = final amount, P = principal, r = interest rate %, n = number of periods.", example: "£2000 at 4% for 3 years: 2000 × 1.04³ = £2249.73" },
          { term: "Percentage Change", definition: "% change = (change ÷ original) × 100. A positive result is an increase; negative is a decrease.", example: "Price rises from £40 to £50: change = 10, % change = (10/40) × 100 = 25%" },
        ],
      },
      "Powers & Roots": {
        short: [
          { question: "Simplify: 2³ × 2⁴", answer: "2⁷ = 128", marks: 1, hint: "Add the indices when multiplying same base" },
          { question: "Write √75 in simplified surd form.", answer: "√75 = √(25×3) = 5√3", marks: 2, hint: "Find the largest perfect square factor" },
        ],
        mid: [
          { question: "Simplify fully: (3x²y³)² ÷ (9xy)", answer: "Numerator: 9x⁴y⁶. Divide: 9x⁴y⁶ ÷ 9xy = x³y⁵", marks: 3, hint: "Square the bracket first, then divide using index laws" },
        ],
        long: [
          { question: "Rationalise the denominator of (3+√5)/(2−√5). Show all working and simplify.", answer: "Multiply by (2+√5)/(2+√5). Numerator: (3+√5)(2+√5) = 6+3√5+2√5+5 = 11+5√5. Denominator: (2)²−(√5)² = 4−5 = −1. Result: (11+5√5)/−1 = −11−5√5", marks: 5, hint: "Multiply numerator and denominator by the conjugate of the denominator" },
        ],
        flashcard: [
          { term: "Index Laws", definition: "aᵐ × aⁿ = aᵐ⁺ⁿ. aᵐ ÷ aⁿ = aᵐ⁻ⁿ. (aᵐ)ⁿ = aᵐⁿ. a⁰ = 1. a⁻ⁿ = 1/aⁿ. a^(1/n) = ⁿ√a.", example: "5³ × 5² = 5⁵; (2³)² = 2⁶; 4^(1/2) = 2" },
          { term: "Surds", definition: "A surd is an irrational square (or cube) root. Cannot be simplified to a rational number. Simplify by finding perfect square factors. Rationalise denominators by multiplying by the surd.", example: "√12 = 2√3; 1/√2 = √2/2 (rationalised)" },
          { term: "Negative & Fractional Indices", definition: "a^(−n) = 1/aⁿ. a^(m/n) = (ⁿ√a)ᵐ. So 8^(2/3) = (³√8)² = 2² = 4.", example: "27^(−1/3) = 1/³√27 = 1/3" },
        ],
      },
      "Standard Form": {
        short: [
          { question: "Write 0.00000372 in standard form.", answer: "3.72 × 10⁻⁶", marks: 1, hint: "The number between 1 and 10 is 3.72; count how many places you move the decimal" },
          { question: "Calculate (4 × 10⁵) × (3 × 10⁻²). Give your answer in standard form.", answer: "12 × 10³ = 1.2 × 10⁴", marks: 2, hint: "Multiply the numbers and add the powers; adjust if the number isn't between 1 and 10" },
        ],
        mid: [
          { question: "The speed of light is 3 × 10⁸ m/s. The distance from Earth to the Sun is 1.5 × 10¹¹ m. How many seconds does light take to travel from the Sun to Earth? Give your answer in standard form.", answer: "Time = distance ÷ speed = (1.5 × 10¹¹) ÷ (3 × 10⁸) = 0.5 × 10³ = 5 × 10² = 500 seconds", marks: 3, hint: "Divide the coefficients and subtract the powers" },
        ],
        long: [
          { question: "A computer processes 2.4 × 10⁹ operations per second. It needs to complete 6 × 10¹⁵ operations. (a) How many seconds does this take? (b) Convert to days (to 3 s.f.)", answer: "(a) 6×10¹⁵ ÷ 2.4×10⁹ = 2.5×10⁶ seconds. (b) Days = 2.5×10⁶ ÷ 86400 = 28.935... ≈ 28.9 days", marks: 5, hint: "Divide in standard form for part (a). For (b), divide by 60×60×24 = 86400" },
        ],
        flashcard: [
          { term: "Standard Form", definition: "A × 10ⁿ where 1 ≤ A < 10 and n is any integer. Large numbers: positive n. Small numbers: negative n. To convert: move decimal until A is between 1 and 10; count moves for n.", example: "5,600,000 = 5.6 × 10⁶; 0.0034 = 3.4 × 10⁻³" },
          { term: "Calculating in Standard Form", definition: "Multiply: multiply coefficients, add powers. Divide: divide coefficients, subtract powers. Then check the coefficient is between 1 and 10 and adjust if needed.", example: "(2×10³) × (4×10²) = 8×10⁵" },
        ],
      },
    },
    "Algebra": {
      "Linear Equations & Expressions": {
        short: [
          { question: "Solve: 3(2x − 1) = 5x + 7", answer: "6x − 3 = 5x + 7 → x = 10", marks: 2, hint: "Expand the bracket first, then collect x terms" },
          { question: "Simplify: 4a²b × 3ab³", answer: "12a³b⁴", marks: 1, hint: "Multiply coefficients and add indices for each variable" },
        ],
        mid: [
          { question: "Make r the subject of: A = π r² h", answer: "r² = A/(πh) → r = √(A/πh)", marks: 3, hint: "Divide both sides by πh, then square root" },
        ],
        long: [
          { question: "Solve the equation (2x+1)/(x−3) = 5/2. Show all steps and check your answer.", answer: "Cross multiply: 2(2x+1) = 5(x−3) → 4x+2 = 5x−15 → 17 = x. Check: (35)/(14) = 5/2 ✓", marks: 5, hint: "Cross-multiply to eliminate fractions, then solve the resulting linear equation" },
        ],
        flashcard: [
          { term: "Expanding Double Brackets", definition: "Use FOIL (First, Outer, Inner, Last) or the grid method. (a+b)(c+d) = ac + ad + bc + bd.", example: "(x+3)(x−2) = x²−2x+3x−6 = x²+x−6" },
          { term: "Changing the Subject", definition: "Rearrange a formula so a specified variable is alone on one side. Use inverse operations: if adding → subtract; if multiplying → divide; if squared → square root.", example: "v = u + at → t = (v−u)/a" },
        ],
      },
      "Factorising": {
        short: [
          { question: "Factorise fully: 6x²y − 9xy²", answer: "3xy(2x − 3y)", marks: 2, hint: "Find the HCF of all terms: 3xy" },
          { question: "Factorise: x² − 9", answer: "(x+3)(x−3)", marks: 1, hint: "Difference of two squares: a²−b² = (a+b)(a−b)" },
        ],
        mid: [
          { question: "Factorise fully: 2x² + 5x − 12", answer: "ac = −24. Pairs: −3 and 8. Split: 2x² − 3x + 8x − 12 = x(2x−3) + 4(2x−3) = (x+4)(2x−3)", marks: 3, hint: "Multiply a × c, find two numbers that multiply to that and add to b, then split the middle term" },
        ],
        long: [
          { question: "Solve 3x² − 10x + 8 = 0 by factorising. Show all working.", answer: "ac = 24, need two numbers that multiply to 24 and add to −10: −4 and −6. Split: 3x²−4x−6x+8 = x(3x−4)−2(3x−4) = (x−2)(3x−4) = 0. x = 2 or x = 4/3", marks: 5, hint: "Factorise the quadratic, then set each bracket equal to zero" },
        ],
        flashcard: [
          { term: "Factorising Quadratics (a=1)", definition: "x² + bx + c: find two numbers p and q where p×q = c and p+q = b. Write as (x+p)(x+q).", example: "x²+7x+12: p×q=12, p+q=7 → p=3,q=4 → (x+3)(x+4)" },
          { term: "Difference of Two Squares", definition: "a² − b² = (a+b)(a−b). Spot it when you have two perfect square terms with a minus between them.", example: "25x² − 16 = (5x+4)(5x−4)" },
          { term: "Factorising when a≠1", definition: "For ax²+bx+c: multiply a×c, find factors of ac that add to b, split middle term, factor by grouping.", example: "6x²+x−2: ac=−12, factors −3,4; → 6x²−3x+4x−2 = 3x(2x−1)+2(2x−1) = (3x+2)(2x−1)" },
        ],
      },
      "Simultaneous Equations": {
        short: [
          { question: "Solve: y = 2x + 1 and y = x + 5", answer: "2x+1 = x+5 → x = 4, y = 9", marks: 2, hint: "Set the two expressions for y equal to each other" },
        ],
        mid: [
          { question: "Solve: 3x + 2y = 13 and 2x − y = 4.", answer: "From eq2: y = 2x−4. Sub into eq1: 3x+2(2x−4)=13 → 7x=21 → x=3, y=2.", marks: 4, hint: "Rearrange one equation to make y the subject, then substitute" },
        ],
        long: [
          { question: "Solve simultaneously: x² + y² = 25 and y = x + 1. Show all solutions.", answer: "Sub y=x+1: x²+(x+1)²=25 → x²+x²+2x+1=25 → 2x²+2x−24=0 → x²+x−12=0 → (x+4)(x−3)=0. x=−4,y=−3 or x=3,y=4.", marks: 6, hint: "Substitute the linear equation into the quadratic, form a quadratic, solve by factorising" },
        ],
        flashcard: [
          { term: "Elimination Method", definition: "Make coefficients of one variable equal (multiply equations if needed), then add or subtract to eliminate that variable. Solve for the remaining variable, then substitute back.", example: "2x+y=7 and x+y=5: subtract → x=2, then y=3" },
          { term: "Substitution Method", definition: "Rearrange one equation to express one variable in terms of the other. Substitute into the second equation. Useful when one equation is already solved for a variable.", example: "y=3x−1 and 2x+y=9: substitute y → 2x+3x−1=9 → x=2, y=5" },
        ],
      },
      "Quadratics": {
        short: [
          { question: "Solve x² − 7x + 10 = 0.", answer: "(x−5)(x−2) = 0 → x = 5 or x = 2", marks: 2, hint: "Factorise: find two numbers that multiply to 10 and add to −7" },
          { question: "Write x² + 6x + 7 in completed square form.", answer: "(x+3)² − 2", marks: 2, hint: "Halve the x coefficient to find the bracket, then adjust the constant" },
        ],
        mid: [
          { question: "Use the quadratic formula to solve 2x² + 3x − 5 = 0.", answer: "x = (−3 ± √(9+40))/4 = (−3 ± 7)/4. x = 1 or x = −5/2", marks: 3, hint: "a=2, b=3, c=−5. Calculate b²−4ac first" },
        ],
        long: [
          { question: "A rectangular garden has length (x+5)m and width (x−2)m. Its area is 40m². Find x and hence the dimensions of the garden.", answer: "(x+5)(x−2)=40 → x²+3x−10=40 → x²+3x−50=0. x=(−3±√(9+200))/2=(−3±√209)/2. x=(−3+14.46)/2≈5.73. Length≈10.73m, Width≈3.73m. Only positive x valid.", marks: 6, hint: "Form the equation, rearrange to =0, use quadratic formula, reject negative solution, find dimensions" },
        ],
        flashcard: [
          { term: "Quadratic Formula", definition: "For ax²+bx+c=0: x = (−b ± √(b²−4ac)) / 2a. The discriminant Δ = b²−4ac: Δ>0 two real roots; Δ=0 one repeated root; Δ<0 no real roots.", example: "x²−5x+6=0: x=(5±1)/2 → x=3 or x=2" },
          { term: "Completing the Square", definition: "x²+bx+c → (x+b/2)²−(b/2)²+c. Used to find the vertex of a parabola, solve quadratics and prove results.", example: "x²+4x+1 = (x+2)²−3. Vertex at (−2, −3)" },
          { term: "Discriminant", definition: "b²−4ac determines the number of real solutions. >0: two distinct real roots. =0: one repeated root (tangent to x-axis). <0: no real roots (parabola doesn't cross x-axis).", example: "x²+2x+5: 4−20=−16<0 → no real roots" },
        ],
      },
    },
    "Geometry & Measures": {
      "Angles & Polygons": {
        short: [
          { question: "Find the size of each interior angle of a regular octagon.", answer: "Sum of interior angles = (8−2)×180 = 1080°. Each angle = 1080÷8 = 135°", marks: 2, hint: "Sum = (n−2)×180, then divide by n" },
          { question: "Two parallel lines are cut by a transversal. One angle is 65°. State the co-interior angle and give its value.", answer: "Co-interior (same-side interior) angles add up to 180°. Co-interior angle = 115°", marks: 2, hint: "Co-interior angles are between the parallel lines on the same side — they are supplementary" },
        ],
        mid: [
          { question: "ABCD is a quadrilateral. Angle A = 2x, B = x+30, C = 3x−10, D = x+20. Find x and hence all four angles.", answer: "Sum = 360°: 2x + x+30 + 3x−10 + x+20 = 360 → 7x+40 = 360 → x = 320/7 ≈ 45.7°. A≈91.4°, B≈75.7°, C≈127.1°, D≈65.7°", marks: 4, hint: "All four angles of a quadrilateral sum to 360°" },
        ],
        long: [
          { question: "Prove that the exterior angle of a triangle is equal to the sum of the two non-adjacent interior angles.", answer: "Let the triangle have interior angles a, b, c where angle c is adjacent to exterior angle d. On a straight line: c + d = 180°. Interior angles of a triangle: a + b + c = 180°. Therefore c = 180° − a − b. Substituting: d = 180° − c = 180° − (180° − a − b) = a + b. QED: exterior angle = sum of two non-adjacent interior angles.", marks: 5, hint: "Use angles on a straight line and angles in a triangle. Set up algebraic expressions." },
        ],
        flashcard: [
          { term: "Angle Rules — Parallel Lines", definition: "Alternate angles (Z-angles): equal. Corresponding angles (F-angles): equal. Co-interior angles (C-angles): add to 180°.", example: "Alternate: both 55°. Co-interior: 55° and 125°" },
          { term: "Polygon Angle Sums", definition: "Sum of interior angles of n-sided polygon = (n−2)×180°. Sum of exterior angles of ANY polygon = 360°. Each exterior angle of regular polygon = 360°÷n.", example: "Pentagon: (5−2)×180=540°; regular pentagon interior angle = 108°" },
          { term: "Circle Theorems", definition: "Angle at centre = 2 × angle at circumference (same arc). Angles in semicircle = 90°. Opposite angles in cyclic quadrilateral add to 180°. Tangent perpendicular to radius.", example: "Arc AB subtends 40° at circumference → 80° at centre" },
        ],
      },
      "Area & Perimeter": {
        short: [
          { question: "Find the area of a trapezium with parallel sides 7cm and 11cm and height 5cm.", answer: "Area = ½(a+b)h = ½(7+11)×5 = 45cm²", marks: 2, hint: "Area of trapezium = ½ × (sum of parallel sides) × height" },
          { question: "A circle has circumference 31.4cm. Find its area to 1 decimal place.", answer: "C = 2πr → r = 31.4/(2π) ≈ 5cm. Area = π×25 ≈ 78.5cm²", marks: 3, hint: "Find r from the circumference, then use A = πr²" },
        ],
        mid: [
          { question: "A path of uniform width 2m surrounds a rectangular garden 10m × 6m. Find the area of the path.", answer: "Outer rectangle: (10+4)×(6+4) = 14×10 = 140m². Inner: 10×6=60m². Path area = 80m²", marks: 3, hint: "Find outer dimensions by adding 2×width to each side" },
        ],
        long: [
          { question: "A sector has radius 8cm and arc length 10cm. Find (a) the angle in radians, (b) the area of the sector, (c) the area of the triangle formed by the two radii and the chord.", answer: "(a) Arc = rθ → θ = 10/8 = 1.25 rad. (b) Area sector = ½r²θ = ½×64×1.25 = 40cm². (c) Area triangle = ½r²sinθ = ½×64×sin(1.25) = 32×0.9490 = 30.37cm²", marks: 6, hint: "Use arc = rθ, area of sector = ½r²θ, area of triangle = ½r²sinθ" },
        ],
        flashcard: [
          { term: "Key Area Formulas", definition: "Rectangle: l×w. Triangle: ½bh. Trapezium: ½(a+b)h. Circle: πr². Parallelogram: bh. Sector: ½r²θ (radians) or (θ/360)πr² (degrees).", example: "Trapezium with parallel sides 5,9 and height 4: ½(14)(4) = 28" },
          { term: "Arc Length & Sector Area", definition: "Arc length = (θ/360) × 2πr. Sector area = (θ/360) × πr². Or in radians: arc = rθ; sector = ½r²θ.", example: "Sector, r=6, θ=60°: arc = (60/360)×12π = 2π ≈ 6.28cm" },
        ],
      },
      "Pythagoras & Trigonometry": {
        short: [
          { question: "A right-angled triangle has legs 5cm and 12cm. Find the hypotenuse.", answer: "h = √(25+144) = √169 = 13cm", marks: 2, hint: "a² + b² = c²" },
          { question: "Find angle θ in a right-angled triangle where the opposite side is 6cm and hypotenuse is 10cm.", answer: "sin θ = 6/10 = 0.6. θ = sin⁻¹(0.6) = 36.87° ≈ 36.9°", marks: 2, hint: "sinθ = opposite/hypotenuse" },
        ],
        mid: [
          { question: "A 5m ladder leans against a wall, making an angle of 72° with the ground. How high up the wall does it reach?", answer: "Height = 5 × sin(72°) = 5 × 0.951 = 4.755 ≈ 4.76m", marks: 3, hint: "Draw the triangle. The height is opposite the 72° angle." },
        ],
        long: [
          { question: "Two ships leave a port. Ship A travels 12km due North. Ship B travels 8km on a bearing of 065°. Find the distance between the ships.", answer: "Using cosine rule. Angle between paths = 65°. c² = 12²+8²−2×12×8×cos65° = 144+64−192×0.4226 = 208−81.14 = 126.86. c = √126.86 ≈ 11.26km", marks: 6, hint: "The angle between the two directions is 65°. Use the cosine rule: c² = a² + b² − 2ab cosC" },
        ],
        flashcard: [
          { term: "SOHCAHTOA", definition: "Sine = Opposite/Hypotenuse. Cosine = Adjacent/Hypotenuse. Tangent = Opposite/Adjacent. Only applies in right-angled triangles.", example: "tanθ = 4/3 → θ = tan⁻¹(4/3) = 53.1°" },
          { term: "Sine Rule", definition: "a/sinA = b/sinB = c/sinC. Use when you know: two angles and a side, or two sides and a non-included angle.", example: "a=7, A=40°, B=60°: b = 7sin60°/sin40° = 9.43" },
          { term: "Cosine Rule", definition: "a² = b² + c² − 2bc cosA. Use when you know: three sides, or two sides and the included angle.", example: "a=5, b=7, C=50°: c² = 25+49−70cos50° = 74−44.99 = 29.01, c=5.39" },
        ],
      },
    },
    "Probability": {
      "Basic Probability": {
        short: [
          { question: "A bag contains 4 red, 3 blue and 5 green balls. One is selected at random. Find P(blue or green).", answer: "P(blue or green) = (3+5)/12 = 8/12 = 2/3", marks: 2, hint: "Add favourable outcomes over total outcomes" },
          { question: "The probability of rain on any day is 0.35. What is the probability it does NOT rain?", answer: "P(no rain) = 1 − 0.35 = 0.65", marks: 1, hint: "Probabilities of all outcomes sum to 1" },
        ],
        mid: [
          { question: "P(A) = 0.6, P(B) = 0.4, P(A∩B) = 0.2. Find P(A∪B).", answer: "P(A∪B) = P(A) + P(B) − P(A∩B) = 0.6+0.4−0.2 = 0.8", marks: 3, hint: "Use the addition rule: P(A∪B) = P(A) + P(B) − P(A∩B)" },
        ],
        long: [
          { question: "Explain the difference between theoretical and experimental probability, and explain why they may differ. Use an example.", answer: "Theoretical probability is calculated from equally likely outcomes (e.g. P(Head) = 1/2). Experimental probability (relative frequency) is based on actual results: frequency ÷ total trials. They differ due to random variation — especially with small samples. As the number of trials increases, experimental probability gets closer to the theoretical value (Law of Large Numbers). Example: Flipping a coin 10 times might give 7 heads (exp. prob = 0.7), but with 10,000 flips it will approach 0.5.", marks: 5, hint: "Define both, explain why they differ, state what happens as sample size increases, give an example" },
        ],
        flashcard: [
          { term: "Probability Scale", definition: "P(event) = number of favourable outcomes ÷ total outcomes. Always between 0 (impossible) and 1 (certain). P(A') = 1 − P(A) where A' is the complement of A.", example: "P(rolling even number) = 3/6 = 1/2" },
          { term: "Mutually Exclusive Events", definition: "Events that cannot happen at the same time. P(A or B) = P(A) + P(B) when A and B are mutually exclusive. e.g. rolling a 3 or a 5 on a single die.", example: "P(3 or 5) = 1/6 + 1/6 = 1/3" },
          { term: "Independent Events", definition: "Events where one outcome doesn't affect the other. P(A and B) = P(A) × P(B) for independent events.", example: "P(Heads then Heads) = 1/2 × 1/2 = 1/4" },
        ],
      },
      "Tree Diagrams": {
        short: [
          { question: "A bag has 3 red and 2 blue balls. One is taken, not replaced, then another is taken. What is P(both red)?", answer: "P(R then R) = 3/5 × 2/4 = 6/20 = 3/10", marks: 2, hint: "After first red ball, there are only 4 balls left, 2 of which are red" },
        ],
        mid: [
          { question: "A box contains 5 red and 3 white counters. Two are drawn without replacement. Draw a tree diagram and find P(one of each colour).", answer: "P(RW) = 5/8 × 3/7 = 15/56. P(WR) = 3/8 × 5/7 = 15/56. P(one of each) = 30/56 = 15/28", marks: 4, hint: "Two branches for first draw, then two branches for each second draw. Don't replace counters." },
        ],
        long: [
          { question: "Three friends independently attempt a puzzle. P(Alice solves it) = 0.7, P(Bob) = 0.5, P(Carly) = 0.6. Find the probability that (a) all three solve it, (b) exactly one solves it.", answer: "(a) 0.7×0.5×0.6 = 0.21. (b) P(A only) = 0.7×0.5×0.4 = 0.14. P(B only) = 0.3×0.5×0.4 = 0.06. P(C only) = 0.3×0.5×0.6 = 0.09. Total = 0.29", marks: 6, hint: "For exactly one, consider three cases: only Alice, only Bob, only Carly. Use complements for 'doesn't solve'" },
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
          { question: "A dataset has mean 14, and 6 values. A 7th value of 21 is added. Find the new mean.", answer: "Total of original 6 values = 6×14 = 84. New total = 84+21 = 105. New mean = 105÷7 = 15", marks: 2, hint: "Work backwards from mean to find the total, then add the new value" },
        ],
        mid: [
          { question: "Two classes take a test. Class A: mean 72, standard deviation 8. Class B: mean 72, standard deviation 3. Compare the two classes' performance.", answer: "Both classes have the same mean — their average performance is identical. However, Class B has a much smaller standard deviation, meaning their scores are more consistent and closely clustered around the mean. Class A has much greater spread, suggesting a wider range of abilities or inconsistent understanding of the material.", marks: 3, hint: "Compare both averages AND spread. What does a larger standard deviation tell you?" },
        ],
        long: [
          { question: "A grouped frequency table shows: 0<x≤10: 5, 10<x≤20: 12, 20<x≤30: 18, 30<x≤40: 9, 40<x≤50: 6. Estimate the mean and identify the modal class.", answer: "Midpoints: 5,15,25,35,45. Σfx = 5×5+12×15+18×25+9×35+6×45 = 25+180+450+315+270 = 1240. Σf = 50. Mean = 1240/50 = 24.8. Modal class = 20<x≤30 (highest frequency 18).", marks: 6, hint: "Use midpoints to estimate fx for each group. Sum all fx values then divide by total frequency." },
        ],
        flashcard: [
          { term: "Mean, Median, Mode", definition: "Mean = sum ÷ count. Median = middle value (ordered). Mode = most common. Mean uses all values (sensitive to outliers). Median resistant to outliers. Mode useful for categorical data.", example: "3,5,5,7,10: mean=6, median=5, mode=5" },
          { term: "Interquartile Range (IQR)", definition: "IQR = Q3 − Q1. Measures the spread of the middle 50% of data. Less affected by outliers than the range. Used with box plots (box and whisker diagrams).", example: "Q1=15, Q3=35: IQR=20. Values >Q3+1.5×IQR are outliers" },
          { term: "Standard Deviation", definition: "Measures average spread around the mean. Small SD = data clustered tightly. Large SD = data spread out. Calculated as square root of variance (mean of squared deviations).", example: "Dataset {2,4,6}: mean=4. Deviations: −2,0,2. Variance=8/3. SD=1.63" },
        ],
      },
    },
  },

  // ════════════════════════════════════════════════════════════════
  // BIOLOGY
  // ════════════════════════════════════════════════════════════════
  "Biology": {
    "Cell Biology": {
      "Cell Structure": {
        short: [
          { question: "State three structures found in plant cells but NOT animal cells.", answer: "Cell wall, chloroplasts, and a permanent vacuole.", marks: 3, hint: "Plant cells have three additional structures animal cells lack" },
          { question: "What is the function of the ribosome?", answer: "Ribosomes are the site of protein synthesis — they translate mRNA to produce proteins.", marks: 1, hint: "Where proteins are made in the cell" },
        ],
        mid: [
          { question: "Compare prokaryotic and eukaryotic cells, giving two similarities and three differences.", answer: "Similarities: both have a cell membrane; both have ribosomes; both have DNA. Differences: prokaryotes have no membrane-bound nucleus (DNA is free in cytoplasm); prokaryotes are generally smaller; prokaryotes have no membrane-bound organelles (no mitochondria, ER etc.); eukaryotes may have chloroplasts (plants).", marks: 4, hint: "Similarities: membrane, ribosomes, DNA. Differences: nucleus, size, organelles" },
        ],
        long: [
          { question: "Explain how electron microscopes have improved our understanding of cell structure compared to light microscopes.", answer: "Light microscopes use visible light (wavelength ~400-700nm) — maximum resolution ~200nm. Electron microscopes use electrons (much shorter wavelength) — resolution up to 0.1nm, magnification up to ×500,000. This has allowed scientists to see: detailed structure of organelles (e.g. cristae in mitochondria, thylakoids in chloroplasts, endoplasmic reticulum), ribosomes (too small for light microscopy), cell membranes in detail, and viruses. Light microscopes can view living cells; electron microscopes require fixed (dead) specimens. The development of TEM (transmission) and SEM (scanning) provided 2D internal and 3D surface images respectively. This transformed our understanding of subcellular structure and how organelles work together.", marks: 6, hint: "Compare resolution and magnification. List specific structures now visible. Note limitations of each." },
        ],
        flashcard: [
          { term: "Animal Cell Organelles", definition: "Nucleus (contains DNA), mitochondria (ATP production), ribosomes (protein synthesis), endoplasmic reticulum (transport), cell membrane (selective barrier). No cell wall, chloroplasts or permanent vacuole.", example: null },
          { term: "Plant Cell Additional Structures", definition: "Cell wall (cellulose — provides rigidity), chloroplasts (photosynthesis — contain chlorophyll), permanent vacuole (stores cell sap, maintains turgor pressure).", example: "Chloroplast: double membrane, thylakoid membranes, stroma where Calvin cycle occurs" },
          { term: "Prokaryotic Cells", definition: "No membrane-bound nucleus — DNA floats freely in cytoplasm. No membrane-bound organelles. Have cell wall (not cellulose), ribosomes, cell membrane. Often have plasmids and flagella. Examples: bacteria.", example: "E. coli: prokaryote ~1μm, no nucleus, circular chromosome + plasmids" },
        ],
      },
      "Diffusion, Osmosis & Active Transport": {
        short: [
          { question: "What is the difference between diffusion and active transport?", answer: "Diffusion is the passive movement of particles from high to low concentration — requires no energy. Active transport moves substances against a concentration gradient using energy (ATP) from respiration.", marks: 2, hint: "One needs energy; one goes with the gradient; one goes against" },
          { question: "A plant cell is placed in a very concentrated salt solution. Describe what happens and name the process.", answer: "Water moves out of the cell by osmosis (down the water potential gradient — from high water potential inside to low water potential in the salt solution). The vacuole and cytoplasm shrink. The cell becomes plasmolysed.", marks: 2, hint: "Water moves out — the cell shrinks. What is the process? What happens to the vacuole?" },
        ],
        mid: [
          { question: "Explain why the small intestine is well-adapted for the absorption of digested food molecules.", answer: "Large surface area due to villi and microvilli (millions of tiny finger-like projections). Rich blood supply to maintain concentration gradient (digested products removed rapidly). Thin walls — one cell thick — short diffusion distance. Some molecules (e.g. glucose, amino acids) absorbed by active transport against concentration gradient. Lacteals absorb fatty acids and glycerol into the lymphatic system.", marks: 4, hint: "Cover: surface area, blood supply, wall thickness, active transport, lacteals" },
        ],
        long: [
          { question: "Design an experiment to investigate the effect of sucrose concentration on the mass of potato chips. Include: apparatus, method, controls, expected results and analysis.", answer: "Apparatus: potato chips (equal size, cut with cork borer and ruler), sucrose solutions of 0, 0.2, 0.4, 0.6, 0.8, 1.0 mol/dm³, balance, boiling tubes, stopwatch. Method: Cut chips of equal length (3cm) and width. Record initial mass of each chip. Place each chip in a different concentration of sucrose solution. Leave for 30 minutes. Remove, pat dry, reweigh. Record final mass. Calculate % change in mass. Controls: volume of solution, temperature, time, starting length and chip species. Expected results: Low concentration = water enters chip by osmosis → mass increases. High concentration = water leaves → mass decreases. The concentration where mass = unchanged is the cell sap concentration. Analysis: Plot % mass change against concentration. Extrapolate to find concentration where % change = 0 (isotonic point = water potential of potato).", marks: 7, hint: "Cover all 6 parts: apparatus, full method, independent/dependent/controlled variables, expected results table, conclusion linking to osmosis theory" },
        ],
        flashcard: [
          { term: "Osmosis", definition: "The net movement of water molecules from a region of higher water potential to lower water potential through a partially permeable membrane. No energy required — passive process.", example: "Chip in pure water: water enters → mass increases. Chip in concentrated solution: water leaves → mass decreases, cell plasmolysed" },
          { term: "Active Transport", definition: "Movement of substances against the concentration gradient using ATP energy from respiration. Requires specific carrier proteins. Used in root hair cells (mineral ions) and gut epithelium (glucose).", example: "Root hairs absorb nitrate ions from soil against a concentration gradient using active transport" },
          { term: "Surface Area to Volume Ratio", definition: "As organisms increase in size, SA:Volume ratio decreases — harder to supply all cells by diffusion. Larger organisms develop specialised exchange surfaces (lungs, gills, villi) to overcome this.", example: "1cm cube: SA=6, Vol=1, ratio=6:1. 2cm cube: SA=24, Vol=8, ratio=3:1" },
        ],
      },
      "Cell Division": {
        short: [
          { question: "Where in the body does meiosis occur?", answer: "Meiosis occurs in the reproductive organs — testes (producing sperm) and ovaries (producing eggs).", marks: 1, hint: "It produces gametes (sex cells)" },
          { question: "What is a stem cell?", answer: "A stem cell is an undifferentiated cell that can divide and differentiate into many specialised cell types. Embryonic stem cells are pluripotent; adult stem cells are more limited.", marks: 2, hint: "Undifferentiated and can become different cell types" },
        ],
        mid: [
          { question: "Compare mitosis and meiosis, including the number of cells produced, genetic variation and where each occurs.", answer: "Mitosis: produces 2 genetically identical diploid cells. Occurs in body cells for growth, repair and asexual reproduction. No genetic variation. Meiosis: produces 4 genetically unique haploid cells (gametes). Occurs in reproductive organs. Genetic variation caused by independent assortment of chromosomes and crossing over in prophase I.", marks: 4, hint: "Cover: number of daughter cells, ploidy (diploid/haploid), genetic variation, location" },
        ],
        long: [
          { question: "Evaluate the therapeutic uses of stem cells, including both the potential benefits and the ethical issues.", answer: "Potential benefits: Embryonic stem cells can differentiate into any cell type — could replace damaged tissues e.g. insulin-producing beta cells for diabetes treatment, heart muscle cells after heart attack, nerve cells for spinal injuries. Adult stem cells (e.g. bone marrow transplants) are already used clinically to treat leukaemia. Induced pluripotent stem cells (iPSCs) made from adult cells avoid some ethical issues. Ethical issues: Embryonic stem cell research requires destruction of human embryos — some argue this ends a potential human life. Questions about when life begins. Egg donation for research is invasive. Risk of immune rejection if donor cells used. Risk of tumour formation (teratomas). Religious objections. Overall: stem cells offer enormous therapeutic potential that could transform treatment of currently incurable conditions, but research must proceed within strict ethical frameworks and regulation.", marks: 7, hint: "Cover specific therapeutic applications with examples. Address embryo destruction, when life begins, alternatives (adult/iPSC). Give a balanced evaluation." },
        ],
        flashcard: [
          { term: "Mitosis", definition: "Cell division producing 2 genetically identical diploid daughter cells. DNA replicates → chromosomes align at equator → pulled to poles → cell divides. Used for growth, repair and asexual reproduction.", example: "A skin cell divides to replace damaged cells at a wound site" },
          { term: "Meiosis", definition: "Two cell divisions producing 4 genetically unique haploid gametes. Crossing over in prophase I and independent assortment increase variation. Occurs in reproductive organs.", example: "One primary spermatocyte → 4 unique sperm cells" },
          { term: "Differentiation", definition: "The process by which cells develop specialised structures and functions by switching on/off specific genes. Most human cells differentiate early in development. Plant cells retain more differentiation capacity throughout life.", example: "Red blood cell: no nucleus, biconcave, full of haemoglobin — differentiated for O₂ transport" },
        ],
      },
    },
    "Bioenergetics": {
      "Photosynthesis": {
        short: [
          { question: "State the balanced symbol equation for photosynthesis.", answer: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", marks: 2, hint: "Reactants: carbon dioxide and water. Products: glucose and oxygen" },
          { question: "Name the two stages of photosynthesis.", answer: "The light-dependent reactions (in the thylakoid membranes) and the light-independent reactions / Calvin cycle (in the stroma).", marks: 2, hint: "One needs light directly; the other doesn't" },
        ],
        mid: [
          { question: "Explain how increasing CO₂ concentration affects the rate of photosynthesis, up to a point.", answer: "CO₂ is a raw material (reactant) for photosynthesis. Increasing CO₂ increases the rate because more substrate is available for the Calvin cycle (carbon fixation). This continues until another factor becomes limiting. At high CO₂ concentrations, either light intensity or temperature will limit the rate — the graph levels off at a plateau. This is the limiting factor principle — the rate is determined by the factor in shortest supply.", marks: 4, hint: "Explain why CO₂ increases rate initially. Explain why it levels off — introduce the concept of limiting factors" },
        ],
        long: [
          { question: "Describe an investigation into the effect of light intensity on the rate of photosynthesis in aquatic plants. Include expected results and explain how to calculate rate.", answer: "Method: Use pondweed (Elodea/Cabomba) in a beaker of water with sodium hydrogen carbonate (to ensure CO₂ supply). Place a lamp at measured distances (e.g. 5, 10, 20, 30, 40cm). Allow the plant to acclimatise at each distance. Count oxygen bubbles produced per minute OR collect and measure volume of O₂ in a capillary tube over a set time. Repeat three times and average. Controls: temperature (water bath), CO₂ concentration, same plant. Expected results: as light intensity increases (lamp closer), rate increases. Rate ∝ 1/d² (inverse square law). At very high intensity, rate plateaus (CO₂ or temperature limiting). Analysis: Plot rate (bubbles/min) against 1/d². Should be linear initially. Use limiting factors to explain plateau.", marks: 7, hint: "Include: sodium hydrogen carbonate purpose, measured distances, method to measure rate, three control variables, inverse square law, expected graph shape, limiting factors at plateau" },
        ],
        flashcard: [
          { term: "Limiting Factors of Photosynthesis", definition: "The rate of photosynthesis is controlled by whichever factor is in shortest supply: light intensity, CO₂ concentration, and temperature. Increasing a non-limiting factor has no effect.", example: "On a cloudy day, light is limiting. In a greenhouse, CO₂ may be limiting despite bright light." },
          { term: "Chloroplast Structure", definition: "Double membrane. Thylakoids (stacked into grana): site of light-dependent reactions — chlorophyll absorbs light, water is split, ATP and NADPH produced. Stroma: site of Calvin cycle — CO₂ fixed into glucose.", example: null },
          { term: "Uses of Glucose in Plants", definition: "Respiration (energy), converted to starch (storage), converted to cellulose (cell walls), converted to lipids (seeds), combined with nitrates to make amino acids and proteins.", example: "Excess glucose stored as insoluble starch granules in leaves and roots" },
        ],
      },
      "Respiration": {
        short: [
          { question: "State the word equation for anaerobic respiration in yeast.", answer: "Glucose → ethanol + carbon dioxide", marks: 2, hint: "Yeast fermentation — used in brewing and baking" },
          { question: "What is the role of ATP in the body?", answer: "ATP (adenosine triphosphate) is the energy currency of the cell. Energy released from respiration is stored in ATP and released when ATP is broken down to ADP + phosphate.", marks: 2, hint: "Energy is stored and released in this molecule" },
        ],
        mid: [
          { question: "Explain what happens to the products of anaerobic respiration in the human body during exercise, including oxygen debt.", answer: "During intense exercise, muscles cannot get enough oxygen for aerobic respiration. Anaerobic respiration occurs: glucose → lactic acid. Lactic acid builds up causing muscle fatigue and pain. After exercise, extra oxygen is needed to oxidise lactic acid — this is the oxygen debt (excess post-exercise oxygen consumption/EPOC). The liver converts lactic acid back to glucose (Cori cycle). Breathing and heart rate remain elevated after exercise until the oxygen debt is repaid.", marks: 4, hint: "Explain lactic acid production, why it builds up, what oxygen debt means, and how it is repaid" },
        ],
        long: [
          { question: "Compare aerobic and anaerobic respiration in terms of reactants, products, energy yield, and where they occur in the cell.", answer: "Aerobic respiration: Reactants: glucose + oxygen. Products: CO₂ + water. Energy yield: ~38 ATP per glucose molecule — very efficient. Location: glycolysis in cytoplasm; Krebs cycle in mitochondrial matrix; oxidative phosphorylation on inner mitochondrial membrane. Anaerobic respiration: Reactants: glucose only. Products: in animals: lactic acid; in yeast/plants: ethanol + CO₂. Energy yield: 2 ATP per glucose — much less efficient. Location: cytoplasm only. Both begin with glycolysis (glucose → pyruvate, 2 ATP). The difference is what happens to pyruvate. Aerobic continues with Krebs cycle; anaerobic uses pyruvate to regenerate NAD so glycolysis can continue.", marks: 7, hint: "Systematically compare: reactants, products, ATP yield, location in cell. Explain the link through glycolysis/pyruvate." },
        ],
        flashcard: [
          { term: "Aerobic Respiration", definition: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP. Occurs in mitochondria. Very efficient — produces ~38 ATP. Requires continuous oxygen supply. Used for all sustained activity.", example: "Walking, swimming, cycling use mainly aerobic respiration" },
          { term: "Anaerobic Respiration (Human)", definition: "Glucose → lactic acid (+ 2 ATP). No oxygen needed. Rapid but inefficient. Lactic acid causes muscle fatigue. Used in sprint/explosive activities. Oxygen debt must be repaid after exercise.", example: "100m sprint — muscles switch to anaerobic after ~10 seconds" },
          { term: "Fermentation (Yeast)", definition: "Glucose → ethanol + carbon dioxide (+ 2 ATP). Anaerobic. Used industrially: brewing (ethanol) and baking (CO₂ causes bread to rise). Alcohol is toxic to yeast at high concentrations.", example: "In bread making, CO₂ from yeast fermentation creates air pockets making bread rise" },
        ],
      },
    },
    "Infection & Response": {
      "Pathogens & Disease": {
        short: [
          { question: "State the four types of pathogen and give one disease caused by each.", answer: "Bacteria (e.g. tuberculosis), viruses (e.g. influenza/HIV), fungi (e.g. athlete's foot/ringworm), protists (e.g. malaria).", marks: 4, hint: "Four types: bacteria, virus, fungi, protist" },
          { question: "How does the measles virus spread?", answer: "Measles spreads through airborne droplets from coughs and sneezes of infected individuals, and through direct contact with nasal or throat secretions.", marks: 2, hint: "Droplet transmission" },
        ],
        mid: [
          { question: "Explain how the body's non-specific defences prevent pathogens from entering the body.", answer: "Skin acts as a physical barrier — pathogens cannot pass through intact skin. Mucus in the nose and respiratory tract traps pathogens; cilia move mucus upward where it is swallowed. Stomach acid (pH 2) kills most swallowed pathogens. Blood clotting at wounds seals entry points. Tears and saliva contain lysozyme, an enzyme that destroys bacterial cell walls.", marks: 4, hint: "Cover: skin, mucus/cilia, stomach acid, blood clotting, lysozyme — explain how each prevents entry" },
        ],
        long: [
          { question: "Evaluate the role of monoclonal antibodies in medicine, including both their uses and limitations.", answer: "Production: Lymphocytes (antibody-producing) are fused with myeloma (tumour) cells to create hybridoma cells. These produce identical (monoclonal) antibodies specific to one antigen. Uses: Pregnancy tests (detect hCG hormone); cancer treatment (e.g. Herceptin targets HER2 receptor on breast cancer cells — can be 'armed' with radioactive/toxic chemicals to kill tumour cells specifically); diagnosis (e.g. detecting pathogens, blood typing, detecting specific proteins in blood tests). Limitations: Very expensive to produce; many side effects observed in clinical trials (excessive immune response); development is slow and technically complex; not effective against all cancers. Some treatments still in development/trials. Overall: monoclonal antibodies represent a precision medicine approach with enormous potential but current limitations in cost and side effects mean they are not universally applicable.", marks: 7, hint: "Explain production (hybridoma), give 3 specific uses with examples, then evaluate limitations — cost, side effects, complexity. Reach a balanced conclusion." },
        ],
        flashcard: [
          { term: "Types of Pathogen", definition: "Bacteria: prokaryotes, produce toxins. Viruses: not living cells, replicate inside host cells, destroy them. Fungi: eukaryotes, may produce spores. Protists: single-celled eukaryotes, some parasitic (e.g. Plasmodium causes malaria via mosquito vector).", example: "Salmonella (bacteria), influenza (virus), Candida (fungus), Plasmodium (protist)" },
          { term: "Vaccination", definition: "Injection of dead/weakened pathogen or antigens. Immune system produces antibodies and memory cells. On future exposure, rapid antibody production prevents illness. Herd immunity: enough vaccinated people prevent spread to unvaccinated.", example: "MMR vaccine protects against measles, mumps and rubella" },
          { term: "Antibiotics", definition: "Kill or inhibit bacteria only — no effect on viruses. Kill by damaging cell walls, disrupting metabolism. Antibiotic resistance evolves when bacteria mutate — resistant strains survive and reproduce. Overuse accelerates resistance (e.g. MRSA).", example: "Penicillin targets bacterial cell wall synthesis — no cell wall in human cells so selective toxicity" },
        ],
      },
    },
    "Homeostasis": {
      "Blood Glucose Regulation": {
        short: [
          { question: "Name the hormone that lowers blood glucose and state where it is produced.", answer: "Insulin, produced by beta cells in the islets of Langerhans in the pancreas.", marks: 2, hint: "Produced in the pancreas; lowers blood glucose" },
          { question: "What is the difference between Type 1 and Type 2 diabetes?", answer: "Type 1: autoimmune — the body destroys its own insulin-producing cells. No insulin produced. Managed by insulin injections. Type 2: body cells become resistant to insulin. Often linked to obesity. Managed by diet, exercise and medication.", marks: 2, hint: "Type 1: no insulin produced. Type 2: cells stop responding to insulin" },
        ],
        mid: [
          { question: "Describe the negative feedback mechanism that returns blood glucose to normal after a meal.", answer: "After a meal, blood glucose rises. The pancreas detects this and releases insulin from beta cells. Insulin causes liver and muscle cells to absorb glucose and convert it to glycogen (glycogenesis). Fat cells also absorb glucose and convert it to fat. Blood glucose falls back to normal set point. If blood glucose falls too low, glucagon (from alpha cells) stimulates glycogenolysis (glycogen → glucose) and gluconeogenesis (making glucose from other molecules). This negative feedback maintains blood glucose within a narrow range.", marks: 4, hint: "Describe the full loop: stimulus (high glucose) → receptor (pancreas) → response (insulin) → effect (glycogenesis) → return to normal" },
        ],
        long: [
          { question: "Evaluate the methods available for treating Type 1 diabetes, including insulin therapy and newer approaches.", answer: "Insulin therapy: daily injections or insulin pump (continuous subcutaneous infusion). Human insulin now produced by genetically modified bacteria (genetic engineering — human insulin gene inserted into bacterial plasmid). Blood glucose must be monitored regularly (finger prick or continuous glucose monitor). Diet management required. Limitations: requires daily management, risk of hypoglycaemia if too much insulin given, injections unpleasant. Newer approaches: Islet cell transplants — transplant insulin-producing cells from donor pancreas. Limited by donor availability and immune rejection. Artificial pancreas — automated closed-loop system combining CGM with insulin pump. Promising results in trials. Stem cell therapy — using stem cells to grow new beta cells. Still experimental. Gene therapy — correcting the gene fault. Long-term potential. Evaluation: insulin therapy is effective and accessible but burdensome. Newer technologies (artificial pancreas, islet transplants) offer better quality of life but face cost, donor supply and immunological challenges. Stem cell/gene therapy could offer a cure but remain experimental.", marks: 8, hint: "Cover: how insulin is made (GMO bacteria), standard therapy, at least 2 newer approaches with evaluation of each, overall balanced conclusion" },
        ],
        flashcard: [
          { term: "Insulin & Glucagon", definition: "Insulin (beta cells): released when blood glucose high → stimulates glycogenesis (glucose→glycogen storage) and cell glucose uptake. Glucagon (alpha cells): released when blood glucose low → stimulates glycogenolysis (glycogen→glucose) and gluconeogenesis.", example: "After eating: insulin rises, glucagon falls. After fasting/exercise: glucagon rises, insulin falls." },
          { term: "Negative Feedback", definition: "A self-regulating mechanism where a change triggers a response that reverses the change, maintaining a set point. Used in temperature, blood glucose, water potential, hormone levels.", example: "Blood glucose rises → insulin released → glucose removed → blood glucose falls back to normal" },
          { term: "Diabetes Management", definition: "Type 1: insulin injections (human insulin from GMO bacteria), carbohydrate counting, blood glucose monitoring, insulin pump. Type 2: lifestyle changes (diet, exercise, weight loss), metformin (drug), sometimes insulin.", example: null },
        ],
      },
      "Nervous System": {
        short: [
          { question: "What is a reflex arc? Name the components in order.", answer: "A reflex arc is the pathway of a rapid automatic response to a stimulus. Order: receptor → sensory neurone → relay neurone (in spinal cord) → motor neurone → effector (muscle or gland).", marks: 3, hint: "Receptor → sensory → relay → motor → effector" },
          { question: "What is the function of synapses in the nervous system?", answer: "Synapses are junctions between neurones where chemical neurotransmitters (e.g. acetylcholine) are released from vesicles, diffuse across the synaptic cleft, and bind to receptors on the next neurone, initiating a new nerve impulse.", marks: 2, hint: "How signals pass from one neurone to the next" },
        ],
        mid: [
          { question: "Compare nervous and hormonal coordination in the body.", answer: "Nervous system: electrical impulses along neurones. Very fast (up to 100 m/s). Precise, specific target cells. Short-lived effect. Used for rapid responses (reflexes, voluntary movement). Hormonal system: chemical messengers (hormones) carried in blood. Slower (seconds to minutes). Affects many cells with receptors. Longer-lasting effects. Used for sustained changes (puberty, blood glucose, water balance). Both systems work together to coordinate body functions.", marks: 4, hint: "Compare: speed, specificity, duration, and type of response for each system" },
        ],
        long: [
          { question: "Explain how the structure of a neurone is adapted to its function in transmitting electrical impulses.", answer: "Motor neurone example: Long axon (up to 1m) allows impulses to travel large distances from spinal cord to muscle. Myelin sheath (Schwann cells wrapped around axon): electrically insulates the axon; impulse jumps between nodes of Ranvier (saltatory conduction), greatly increasing speed of transmission (up to 100m/s in myelinated vs 1m/s unmyelinated). Cell body contains nucleus and mitochondria — mitochondria provide ATP for sodium-potassium pumps that restore resting potential after impulse. Dendrites increase surface area for receiving signals from other neurones. Axon terminals contain vesicles of neurotransmitter for synaptic transmission. The resting potential (−70mV) is maintained by K⁺/Na⁺ pump. Action potential: Na⁺ rushes in (depolarisation to +40mV), then K⁺ rushes out (repolarisation). Self-propagating wave along axon.", marks: 7, hint: "Cover: long axon, myelin sheath + saltatory conduction, mitochondria for ATP, dendrites, axon terminals, action potential mechanism briefly" },
        ],
        flashcard: [
          { term: "The Reflex Arc", definition: "Rapid automatic response bypassing the brain. Pathway: receptor (detects stimulus) → sensory neurone → relay neurone in spinal cord → motor neurone → effector (muscle contracts or gland secretes). Response faster than conscious thought.", example: "Touching a hot object: nociceptors → sensory neurone → spinal cord relay → motor neurone → arm muscle contracts" },
          { term: "Synaptic Transmission", definition: "Impulse arrives at presynaptic terminal → Ca²⁺ enters → vesicles fuse with membrane → neurotransmitter (e.g. acetylcholine) released into cleft → diffuses → binds to postsynaptic receptors → new impulse generated. Neurotransmitter then broken down by enzymes.", example: "Acetylcholine is broken down by acetylcholinesterase in the synaptic cleft" },
          { term: "Action Potential", definition: "Electrical signal along a neurone. Resting potential: −70mV (more K⁺ outside, more Na⁺ inside). Depolarisation: Na⁺ rushes in → potential reaches +40mV. Repolarisation: K⁺ rushes out. Refractory period: Na⁺/K⁺ pump restores resting potential.", example: null },
        ],
      },
    },
    "Inheritance & Evolution": {
      "Genetic Inheritance": {
        short: [
          { question: "What is the difference between genotype and phenotype?", answer: "Genotype is the genetic makeup of an organism — the alleles it possesses (e.g. Bb). Phenotype is the observable characteristic expressed (e.g. brown eyes).", marks: 2, hint: "Genotype = what alleles you have; phenotype = what you look like/express" },
          { question: "A man with genotype Ff and a woman with genotype Ff have children. What fraction of their children would be expected to show the recessive phenotype?", answer: "Cross: Ff × Ff → FF, Ff, Ff, ff. 1 in 4 (25%) show the recessive phenotype (ff).", marks: 2, hint: "Draw a Punnett square" },
        ],
        mid: [
          { question: "Explain the inheritance of sex in humans, including why approximately equal numbers of males and females are born.", answer: "Sex is determined by sex chromosomes. Females: XX. Males: XY. During meiosis, gametes are produced. Eggs all carry X chromosome. Sperm carry either X (50%) or Y (50%). At fertilisation: X egg + X sperm = XX (female); X egg + Y sperm = XY (male). Since X and Y sperm are produced in equal numbers, approximately 50% of offspring are female and 50% are male. Slight variation around 50:50 occurs in practice.", marks: 4, hint: "Explain XX/XY, meiosis produces equal X and Y sperm, fertilisation determines sex, draw a genetic cross diagram" },
        ],
        long: [
          { question: "Cystic fibrosis is an autosomal recessive condition. Two unaffected parents have a child with cystic fibrosis. (a) State the genotypes of the parents. (b) Draw a Punnett square. (c) What is the probability that their next child will be affected? (d) Discuss the ethical issues of genetic testing for this condition.", answer: "(a) Both parents must be carriers: Ff × Ff. (b) Punnett square: FF, Ff, Ff, ff — probability 1/4 are ff (affected). (c) 1 in 4 (25%) probability. (d) Ethical issues: Pre-implantation genetic diagnosis (PGD) — IVF embryos screened, only unaffected implanted. Raises questions about 'designer babies', discarding embryos with CF. Antenatal testing (chorionic villus sampling/amniocentesis) — risk of miscarriage from procedure; couples may face difficult decision about termination. Genetic counselling important to explain risks without directive advice. Insurance discrimination concerns if genetic information shared. Privacy of genetic information. Some in the CF community argue against normalising the idea that CF lives are not worth living.", marks: 8, hint: "Clearly do the genetics (parts a-c). For ethics: PGD, antenatal testing, counselling, privacy/insurance, disability rights perspective. Show balance." },
        ],
        flashcard: [
          { term: "Dominant & Recessive", definition: "Dominant allele (capital letter): expressed even when heterozygous. Recessive allele (lowercase): only expressed when homozygous (two copies). Carrier: heterozygous for a recessive condition — not affected but can pass it on.", example: "F = normal; f = cystic fibrosis. Ff = carrier (not affected). ff = has cystic fibrosis" },
          { term: "Punnett Square", definition: "A grid used to predict the probability of each genotype in offspring. Parents' alleles written along top and side; cross each pair of alleles to fill the grid.", example: "Aa × Aa → AA(1/4), Aa(1/2), aa(1/4)" },
          { term: "Co-dominance", definition: "Both alleles are expressed equally in the phenotype — neither dominates. Written with superscripts. Example: blood groups A (Iᴬ) and B (Iᴮ) are codominant — IᵃIᴮ = blood group AB.", example: "Red flower (Rᴿ Rᴿ) × white (Rᵂ Rᵂ) → pink (Rᴿ Rᵂ) — both alleles expressed" },
        ],
      },
    },
  },

  // ════════════════════════════════════════════════════════════════
  // CHEMISTRY
  // ════════════════════════════════════════════════════════════════
  "Chemistry": {
    "Atomic Structure & the Periodic Table": {
      "Atomic Model & Subatomic Particles": {
        short: [
          { question: "An atom of carbon-14 has atomic number 6. How many neutrons does it have?", answer: "Mass number − atomic number = 14 − 6 = 8 neutrons", marks: 1, hint: "Neutrons = mass number − proton number" },
          { question: "Who proposed the nuclear model of the atom and what evidence supported it?", answer: "Ernest Rutherford proposed the nuclear model, based on his gold foil alpha particle scattering experiment. Most particles passed straight through (atom is mostly empty), some deflected (positive nucleus), and a few bounced back (small, dense nucleus).", marks: 2, hint: "Rutherford — gold foil experiment — three observations" },
        ],
        mid: [
          { question: "Describe how the atomic model has changed from Dalton to the modern model, including the evidence that caused each change.", answer: "Dalton (1803): Atoms are tiny indivisible spheres. Thomson (1897): Discovery of electrons via cathode rays → plum pudding model (positive sphere, embedded electrons). Rutherford (1911): Alpha scattering experiment → nuclear model (positive nucleus, electrons around it). Bohr (1913): Emission spectra evidence → electrons in fixed orbits (shells) at specific energy levels. Modern quantum model: electrons exist in probability clouds (orbitals), not fixed paths. Each model was revised when new experimental evidence contradicted it.", marks: 4, hint: "Cover each model in sequence: Dalton → Thomson (plum pudding) → Rutherford (nuclear) → Bohr (shells) → quantum. State evidence for each change." },
        ],
        long: [
          { question: "Explain how the periodic table is organised and why elements in the same group have similar chemical properties.", answer: "The modern periodic table arranges elements in order of increasing atomic number. Periods (horizontal rows) represent the energy level (shell) being filled — Period 1 fills shell 1, Period 2 fills shell 2, etc. Groups (vertical columns) contain elements with the same number of outer shell electrons. Chemical properties are determined by the number and arrangement of outer electrons — this is why Group 1 metals all have 1 outer electron and react similarly (with water, producing hydrogen and a hydroxide). Group 7 halogens all have 7 outer electrons and readily gain one electron (oxidising agents). Group 0 (noble gases) have full outer shells — very stable, unreactive. Mendeleev's contribution: arranged by atomic mass, left gaps for undiscovered elements (predicted their properties). Modern table: ordered by atomic number (Moseley, 1913), resolving anomalies.", marks: 6, hint: "Explain periods (shells being filled), groups (same outer electrons → same properties). Give specific group examples. Include Mendeleev's contribution and the modern arrangement." },
        ],
        flashcard: [
          { term: "Atomic Structure", definition: "Protons (positive, mass 1) and neutrons (neutral, mass 1) in nucleus. Electrons (negative, negligible mass) in shells. Atomic number = protons. Mass number = protons + neutrons. Neutral atom: protons = electrons.", example: "Carbon: atomic no. 6, mass no. 12 → 6p, 6n, 6e. Carbon-14: 6p, 8n, 6e" },
          { term: "Isotopes", definition: "Atoms of the same element with the same number of protons but different numbers of neutrons. Same atomic number, different mass number. Same chemical properties (same electrons). Different physical properties (different mass).", example: "¹²C and ¹⁴C: both have 6 protons; 14C has 8 neutrons vs 12C's 6" },
          { term: "Electronic Configuration", definition: "Electrons fill shells in order: shell 1 (max 2), shell 2 (max 8), shell 3 (max 8 for first 20 elements). Written as e.g. 2,8,1 for sodium. The outer shell electrons (valence electrons) determine reactivity.", example: "Na (11): 2,8,1 — 1 outer electron → Group 1. Cl (17): 2,8,7 — 7 outer electrons → Group 7" },
        ],
      },
      "The Periodic Table & Groups": {
        short: [
          { question: "Why does reactivity decrease down Group 7 (halogens)?", answer: "Down the group, atoms have more electron shells, so the outer shell is further from the nucleus. There is more electron shielding. The attraction of the nucleus for an incoming electron is weaker, so it is harder to gain an electron. Reactivity decreases.", marks: 2, hint: "More shells = more shielding = weaker attraction for incoming electron" },
          { question: "State the trend in boiling point of Group 1 elements as you go down the group.", answer: "Boiling point decreases down Group 1. The atoms get larger and the metallic bonds become weaker.", marks: 2, hint: "Think about how atomic size affects metallic bond strength" },
        ],
        mid: [
          { question: "Chlorine displaces bromine from potassium bromide solution. Write the ionic equation and explain the reaction in terms of electron gain/loss.", answer: "Cl₂ + 2KBr → 2KCl + Br₂. Ionic equation: Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂. Chlorine is a more reactive halogen — it gains electrons more easily than bromine. Each Cl atom gains 1 electron (reduced). Each Br⁻ ion loses 1 electron (oxidised). This is a redox displacement reaction.", marks: 4, hint: "Write the equation, then the ionic equation, then explain in terms of oxidation/reduction and relative reactivity" },
        ],
        long: [
          { question: "Compare the properties and reactions of Group 1 alkali metals, explaining trends in terms of atomic structure. Include reactions with water and oxygen.", answer: "Group 1: Li, Na, K, Rb, Cs, Fr. All have 1 outer electron → readily lose it to form 1+ ions. React with water: 2M + 2H₂O → 2MOH + H₂. Lithium floats, fizzes slowly. Sodium melts into a ball, moves rapidly, may ignite. Potassium ignites immediately with lilac flame. Trend: reactivity increases down group. Reason: increasing atomic radius → outer electron further from nucleus → more electron shielding → easier to lose electron → lower ionisation energy. React with oxygen: 4Li + O₂ → 2Li₂O (lithium oxide). 4Na + O₂ → 2Na₂O (but also forms Na₂O₂). K forms KO₂. All form white/pale ionic oxides. All are soft, low density metals with low melting points (decrease down group as metallic bonds weaker). Store under oil — react with moisture and air.", marks: 7, hint: "Cover: electronic structure justification of 1+ ion, water reactions with observations for Li/Na/K, trend in reactivity with atomic structure explanation, oxygen reactions, physical properties and trends" },
        ],
        flashcard: [
          { term: "Group 1 — Alkali Metals", definition: "Li, Na, K, Rb, Cs. All have 1 outer electron — lose it to form M⁺ ions. React with water → metal hydroxide + hydrogen. Reactivity increases down group (outer electron easier to remove as shielding increases). Soft, low density, low melting points.", example: "2Na + 2H₂O → 2NaOH + H₂ (fizzes rapidly, may ignite)" },
          { term: "Group 7 — Halogens", definition: "F, Cl, Br, I, At. All have 7 outer electrons — gain one to form X⁻ ions. More reactive halogens displace less reactive ones from solutions. Reactivity decreases down group. Exist as diatomic molecules (F₂, Cl₂, etc.). Colours: F₂ yellow, Cl₂ green, Br₂ orange-brown, I₂ grey/purple.", example: "Cl₂ + 2KI → 2KCl + I₂ (Cl more reactive, displaces I)" },
          { term: "Transition Metals", definition: "Between Groups 2 and 3 in the periodic table. Properties: high melting points, high density, good conductors, often form coloured compounds, can have variable oxidation states, act as catalysts (e.g. Fe in Haber, V₂O₅ in Contact process).", example: "Iron: Fe²⁺ (green) and Fe³⁺ (orange-brown). Copper: Cu²⁺ (blue)" },
        ],
      },
    },
    "Quantitative Chemistry": {
      "Moles & Mr": {
        short: [
          { question: "Calculate the number of moles in 11g of CO₂. (Ar: C=12, O=16)", answer: "Mr of CO₂ = 12+(2×16) = 44. Moles = 11/44 = 0.25 mol", marks: 2, hint: "Moles = mass ÷ relative formula mass" },
          { question: "What mass of sodium hydroxide (NaOH) is needed to make 250cm³ of a 2mol/dm³ solution? (Ar: Na=23, O=16, H=1)", answer: "Moles = 2 × 0.25 = 0.5 mol. Mr(NaOH) = 40. Mass = 0.5 × 40 = 20g", marks: 3, hint: "Convert cm³ to dm³ first (÷1000). Moles = conc × vol. Mass = moles × Mr" },
        ],
        mid: [
          { question: "25cm³ of 0.1mol/dm³ HCl reacts with NaOH solution. 18.5cm³ of NaOH is needed to neutralise. Calculate the concentration of the NaOH.", answer: "Moles HCl = 0.1 × 0.025 = 0.0025 mol. HCl + NaOH → NaCl + H₂O (1:1 ratio). Moles NaOH = 0.0025 mol. Conc NaOH = 0.0025/0.0185 = 0.135 mol/dm³", marks: 4, hint: "Find moles of HCl → use ratio → find moles of NaOH → divide by volume in dm³" },
        ],
        long: [
          { question: "A student reacts 5.4g of aluminium with excess hydrochloric acid. Calculate (a) the theoretical mass of hydrogen produced, (b) if the student only collects 0.18g of H₂, calculate the percentage yield.", answer: "(a) Equation: 2Al + 6HCl → 2AlCl₃ + 3H₂. Moles Al = 5.4/27 = 0.2 mol. Ratio Al:H₂ = 2:3, so moles H₂ = 0.2×(3/2) = 0.3 mol. Theoretical mass H₂ = 0.3×2 = 0.6g. (b) % yield = (0.18/0.6)×100 = 30%", marks: 6, hint: "Balance the equation → find moles of Al → use ratio to find moles of H₂ → find mass. Then % yield = actual/theoretical × 100" },
        ],
        flashcard: [
          { term: "The Mole", definition: "Amount of substance containing 6.02×10²³ particles (Avogadro's constant). Moles = mass (g) ÷ Mr. Mass = moles × Mr. Mr = mass ÷ moles.", example: "1 mol of water (Mr=18) has mass 18g and contains 6.02×10²³ molecules" },
          { term: "Concentration", definition: "Concentration (mol/dm³) = moles ÷ volume (dm³). Remember: 1000cm³ = 1dm³. To find moles from concentration: moles = concentration × volume (dm³).", example: "0.5 mol/dm³ in 200cm³: moles = 0.5 × 0.2 = 0.1 mol" },
          { term: "Percentage Yield & Atom Economy", definition: "% yield = (actual yield/theoretical yield) × 100. Atom economy = (Mr of desired product/sum of Mr of all products) × 100. High atom economy = less waste, more sustainable.", example: "Atom economy of making C in A+B→C+D: Mr(C)/[Mr(C)+Mr(D)] × 100" },
        ],
      },
    },
    "Bonding & Structure": {
      "Ionic Bonding": {
        short: [
          { question: "Draw dot and cross diagrams showing the formation of magnesium oxide from Mg and O atoms.", answer: "Mg ([2,8,2]) loses 2 electrons → Mg²⁺ ([2,8]). O ([2,6]) gains 2 electrons → O²⁻ ([2,8]). Both achieve full outer shells.", marks: 3, hint: "Mg is in Group 2 so loses 2 electrons. O is in Group 6 so gains 2 electrons." },
          { question: "Why does sodium chloride have a high melting point?", answer: "Sodium chloride has a giant ionic lattice structure with strong electrostatic attractions between oppositely charged ions (Na⁺ and Cl⁻) in all directions. A large amount of energy is needed to overcome these attractions.", marks: 2, hint: "Think about the type of structure and the type of bonding" },
        ],
        mid: [
          { question: "Explain why ionic compounds conduct electricity when dissolved in water but not in solid form.", answer: "In solid form, the ions are fixed in a lattice and cannot move — no charge carriers, so no conduction. When dissolved in water, the ions separate (dissociate) and are free to move through the solution. These mobile ions carry charge, so the solution conducts electricity. Similarly, ionic compounds conduct when molten as ions are free to move.", marks: 3, hint: "Key concept: mobile ions are needed. Explain both states — solid (fixed) and dissolved/molten (mobile)" },
        ],
        long: [
          { question: "Compare the structure and properties of sodium chloride (ionic), silicon dioxide (giant covalent), and carbon dioxide (simple covalent). Explain the properties in terms of structure and bonding.", answer: "NaCl: Giant ionic lattice — alternating Na⁺ and Cl⁻ ions. Strong electrostatic forces in all directions. High melting point (801°C). Conducts when dissolved or molten (mobile ions). Soluble in water. SiO₂: Giant covalent structure — each Si bonded to 4 O atoms by strong covalent bonds in a tetrahedral network. Very high melting point (1710°C). Does not conduct (no free electrons or ions). Insoluble. Hard. CO₂: Simple molecular — individual O=C=O molecules with strong double bonds. Weak intermolecular forces (van der Waals). Very low melting point (−78°C sublimation). Does not conduct. Often soluble. Properties determined by intermolecular, not intramolecular forces.", marks: 7, hint: "For each substance: describe the structure, type of bonding/forces, then explain melting point, conductivity and solubility from structure. Contrast all three clearly." },
        ],
        flashcard: [
          { term: "Ionic Bonding", definition: "Transfer of electrons from metal to non-metal atoms. Both achieve full outer shells. Forms ions (cation +, anion −). Giant ionic lattice: strong electrostatic attractions in 3D. High MP, conducts when dissolved/molten.", example: "Na gives 1e⁻ to Cl → Na⁺ and Cl⁻. Regular lattice of alternating ions." },
          { term: "Covalent Bonding", definition: "Sharing of electron pairs between non-metal atoms. Each shared pair is one covalent bond. Double bond = 2 shared pairs. Triple bond = 3 shared pairs. Simple molecules (low BP) or giant covalent structures (very high BP).", example: "H₂O: two O-H single bonds. O₂: one O=O double bond. N₂: one N≡N triple bond" },
          { term: "Giant Covalent Structures", definition: "Very high melting points due to many strong covalent bonds to break. Diamond: each C bonded to 4 others — hardest natural material, no conduction. Graphite: layers of hexagonal C, one delocalised electron per C — conducts. Silicon dioxide: SiO₂ network.", example: "Diamond vs Graphite: both carbon, different structure → very different properties" },
        ],
      },
    },
    "Chemical Changes": {
      "Acids, Bases & Neutralisation": {
        short: [
          { question: "Write the ionic equation for the reaction of any strong acid with any alkali.", answer: "H⁺(aq) + OH⁻(aq) → H₂O(l)", marks: 2, hint: "All neutralisation reactions have the same ionic equation" },
          { question: "What is the difference between a strong acid and a weak acid?", answer: "A strong acid completely dissociates (ionises) in water, producing many H⁺ ions (e.g. HCl). A weak acid only partially dissociates, so fewer H⁺ ions in solution (e.g. ethanoic acid). Both can be concentrated or dilute.", marks: 2, hint: "It's about how much they ionise, not how concentrated they are" },
        ],
        mid: [
          { question: "Describe how to prepare a pure, dry sample of zinc sulfate crystals from zinc and sulfuric acid.", answer: "Add excess zinc to dilute sulfuric acid in a beaker — excess ensures all acid reacts. Warm gently to speed reaction. Filter off excess zinc. Heat the filtrate gently to concentrate. Leave to crystallise slowly. Filter off crystals, wash with a little cold distilled water, leave to dry at room temperature. Zn + H₂SO₄ → ZnSO₄ + H₂", marks: 4, hint: "Excess zinc, filter, evaporate, crystallise, filter, dry. Explain purpose of excess zinc." },
        ],
        long: [
          { question: "Explain the preparation of a soluble salt by titration, using sodium hydroxide and hydrochloric acid as an example. Why is excess reagent not acceptable in this case?", answer: "HCl + NaOH → NaCl + H₂O. Titration method: Fill burette with HCl. Add known volume of NaOH to conical flask with indicator (e.g. phenolphthalein). Add HCl from burette until indicator changes colour (endpoint). Record titre volume. Repeat for concordant results. Repeat reaction without indicator using exact titre volume — this gives a pure solution (no indicator contamination). Evaporate water to concentrate. Leave to crystallise. Filter and dry crystals. Excess reagent not acceptable: an excess of either acid or alkali would contaminate the product salt — unlike insoluble base reactions, you cannot filter excess reagent from a fully dissolved product. The exact volumes must balance perfectly. This is why an indicator is used first to determine the exact neutralisation volume.", marks: 7, hint: "Full method: indicator run, titre, repeat without indicator. Explain why no excess — can't filter dissolved excess reagent." },
        ],
        flashcard: [
          { term: "Acid Reactions", definition: "Acid + metal → salt + hydrogen. Acid + metal oxide → salt + water. Acid + metal hydroxide → salt + water. Acid + metal carbonate → salt + water + CO₂. The salt formed depends on the acid: HCl → chloride, H₂SO₄ → sulfate, HNO₃ → nitrate.", example: "H₂SO₄ + CuO → CuSO₄ + H₂O. H₂SO₄ + Na₂CO₃ → Na₂SO₄ + H₂O + CO₂" },
          { term: "pH Scale", definition: "Measures H⁺ ion concentration. pH 0-6: acidic. pH 7: neutral. pH 8-14: alkaline. Each unit change = 10× change in H⁺ concentration. Universal indicator: red/orange (acid), green (neutral), blue/purple (alkali).", example: "pH 3 has 10× more H⁺ than pH 4. Stomach acid ~pH 2. Blood ~pH 7.4." },
          { term: "Strong vs Weak Acids", definition: "Strong acids fully ionise: HCl → H⁺ + Cl⁻ (100%). Weak acids partially ionise: CH₃COOH ⇌ H⁺ + CH₃COO⁻ (few %). Same concentration: strong acid has lower pH and higher conductivity than weak acid.", example: "1mol/dm³ HCl: pH≈0. 1mol/dm³ CH₃COOH: pH≈2.4" },
        ],
      },
    },
    "Organic Chemistry": {
      "Alkanes & Alkenes": {
        short: [
          { question: "Give the molecular formula and structural formula for propene.", answer: "Molecular formula: C₃H₆. Structural: CH₂=CHCH₃ (carbon-carbon double bond between C1 and C2)", marks: 2, hint: "Propene has 3 carbons and one double bond. General formula for alkenes: CₙH₂ₙ" },
          { question: "How would you distinguish between an alkane and an alkene using bromine water?", answer: "Add bromine water to both. The alkene decolourises bromine water (orange → colourless) because it reacts with bromine via electrophilic addition across the C=C bond. The alkane does not react — bromine water remains orange.", marks: 2, hint: "Bromine water test — which one decolourises it and why?" },
        ],
        mid: [
          { question: "Explain why alkenes undergo addition reactions but alkanes do not.", answer: "Alkenes contain a C=C double bond — one of the bonds is a π bond which is more reactive than a σ bond. The high electron density attracts electrophiles (electron-loving species). In addition reactions, the π bond breaks and one molecule of reagent adds across the double bond (e.g. HBr adds to form a haloalkane). Alkanes only have single C-C and C-H bonds — all σ bonds, which are very stable. They can undergo substitution reactions (with halogens in UV light) but not addition reactions.", marks: 4, hint: "Explain the C=C double bond, the π bond, electrophilic addition, and why alkane single bonds don't react the same way" },
        ],
        long: [
          { question: "Describe the industrial cracking of crude oil fractions. Explain why cracking is economically important and describe the conditions used.", answer: "Cracking is the thermal decomposition of large hydrocarbon molecules (high molecular mass fractions from fractional distillation) into smaller, more useful ones. Two methods: Thermal cracking (high pressure ~700°C, no catalyst) — produces a high proportion of alkenes useful for making polymers. Catalytic cracking (lower temperature ~450°C, aluminium oxide/silica catalyst, lower pressure) — more efficient, produces more branched alkanes and aromatic compounds for petrol. Products always include at least one alkane and one alkene (addition across the double bond accounts for different products). Economic importance: crude oil fractional distillation produces too much of heavy fractions (fuel oil, bitumen) and not enough of high-demand fractions (petrol, diesel). Cracking converts excess long-chain fractions into valuable shorter ones. Supply matches demand. Alkenes from cracking are feedstocks for making plastics (addition polymerisation).", marks: 7, hint: "Explain the process, two types with conditions, products, and detailed economic justification (supply/demand of fractions, alkenes for polymers)" },
        ],
        flashcard: [
          { term: "Homologous Series", definition: "A series of compounds with the same functional group, general formula, and similar chemical properties. Each member differs by CH₂. Physical properties change gradually (e.g. boiling point increases with chain length).", example: "Alkanes: methane, ethane, propane... each adds CH₂; all react by combustion and substitution" },
          { term: "Addition Polymerisation", definition: "Many small alkene monomers join together across their C=C double bonds to form a long polymer chain. No atoms lost. The double bond opens and monomers link. The repeat unit has no double bond.", example: "n(CH₂=CH₂) → (−CH₂−CH₂−)ₙ; polyethene. n(CF₂=CF₂) → PTFE" },
          { term: "Condensation Polymerisation", definition: "Monomers with two functional groups react, releasing a small molecule (usually water or HCl) each time two monomers join. Forms polyesters (diol + dicarboxylic acid) or polyamides (diamine + dicarboxylic acid).", example: "Nylon-6,6: hexanedioic acid + hexane-1,6-diamine → polyamide + water" },
        ],
      },
    },
  },

  // ════════════════════════════════════════════════════════════════
  // PHYSICS
  // ════════════════════════════════════════════════════════════════
  "Physics": {
    "Energy": {
      "Energy Stores & Transfers": {
        short: [
          { question: "A ball of mass 2kg is held at a height of 5m. Calculate its gravitational potential energy. (g = 10 N/kg)", answer: "GPE = mgh = 2 × 10 × 5 = 100J", marks: 2, hint: "GPE = mass × g × height" },
          { question: "State the principle of conservation of energy.", answer: "Energy cannot be created or destroyed. It can only be transferred from one store to another. The total energy of a closed system remains constant.", marks: 2, hint: "Total energy stays the same — it just changes form" },
        ],
        mid: [
          { question: "A 0.5kg ball falls from rest through 8m. Calculate (a) its KE just before hitting the ground and (b) its speed at that point. Assume no air resistance. (g=10 N/kg)", answer: "(a) All GPE converts to KE. GPE = 0.5×10×8 = 40J = KE. (b) KE = ½mv² → v² = 2×40/0.5 = 160 → v = √160 ≈ 12.6 m/s", marks: 4, hint: "GPE converts to KE. Use KE = ½mv² to find speed" },
        ],
        long: [
          { question: "A car of mass 1200kg accelerates from 10m/s to 30m/s. Calculate (a) the change in kinetic energy, (b) the work done by the engine if there is 8kJ of friction, (c) the force of the engine if this happens over 500m.", answer: "(a) ΔKE = ½×1200×30² − ½×1200×10² = 540000 − 60000 = 480000J = 480kJ. (b) Work done by engine = ΔKE + work against friction = 480000 + 8000 = 488000J. (c) F = W/d = 488000/500 = 976N", marks: 6, hint: "KE = ½mv². Work done by engine must overcome friction AND increase KE. F = W/d" },
        ],
        flashcard: [
          { term: "Energy Stores", definition: "Kinetic (moving objects), Gravitational potential (raised objects), Elastic potential (stretched/compressed), Chemical (food/fuel), Thermal (heat), Nuclear, Electrostatic, Magnetic. Energy is transferred between stores by heating, waves, electrically, or mechanically.", example: "Burning wood: chemical store → thermal store (+ light radiation)" },
          { term: "KE and GPE Equations", definition: "KE = ½mv² (joules, kg, m/s). GPE = mgh (joules, kg, N/kg, m). In freefall with no air resistance: loss in GPE = gain in KE.", example: "v = √(2gh): ball dropping 20m: v = √(2×10×20) = √400 = 20 m/s" },
          { term: "Efficiency", definition: "Efficiency = useful energy output / total energy input (× 100 for %). Always ≤100% — some energy always dissipated as heat. Sankey diagrams show energy transfers and waste.", example: "LED uses 10W, 8W useful light: efficiency = 8/10 = 80%" },
        ],
      },
      "Specific Heat Capacity": {
        short: [
          { question: "Define specific heat capacity.", answer: "Specific heat capacity is the energy required to raise the temperature of 1kg of a substance by 1°C (or 1K). Units: J/kg°C.", marks: 2, hint: "Energy per kg per degree temperature rise" },
          { question: "Calculate the energy needed to heat 3kg of water from 20°C to 80°C. (c = 4200 J/kg°C)", answer: "Q = mcΔT = 3 × 4200 × 60 = 756,000J = 756kJ", marks: 3, hint: "Q = mcΔT where ΔT = 80−20 = 60°C" },
        ],
        mid: [
          { question: "Describe an experiment to find the specific heat capacity of a metal block using electrical heating.", answer: "Drill two holes in a metal block — insert electric heater and thermometer. Record initial temperature. Connect heater to ammeter, voltmeter and power supply. Switch on and start timing. Record temperature every minute for 10 minutes. Note current (A) and voltage (V). Calculate energy: E = VIt. Plot temperature vs time; gradient × time gives ΔT. c = E/(mΔT). Controls: lag block in insulation to reduce heat loss, repeat to check consistency.", marks: 4, hint: "Describe apparatus setup (heater, thermometer, ammeter, voltmeter), how to measure energy (E=VIt), and how to calculate c from the data" },
        ],
        long: [
          { question: "Compare the specific heat capacities of water and copper (c_water = 4200, c_copper = 385 J/kg°C). Explain why this makes water useful as a coolant and in central heating, and why copper is used in saucepans.", answer: "Water has a very high SHC (4200 J/kg°C) — it takes a lot of energy to change its temperature. This means: it absorbs large amounts of heat energy without getting very hot (good coolant in car radiators, heat sinks for electronics). In central heating: water can carry large amounts of thermal energy from the boiler to radiators and release it slowly — efficient heat transfer with small volumes. The high SHC also means the sea heats and cools slowly — moderating coastal climates. Copper has low SHC (385 J/kg°C) — it heats up quickly with little energy input. This makes it good for saucepan bases — food heats quickly, responsive to heat changes. Copper is also a good thermal conductor, ensuring even heat distribution. The trade-off: copper would lose heat rapidly if used in central heating, so water is the better fluid despite being denser and heavier.", marks: 6, hint: "Explain what high SHC means (more energy to change temp), apply to water uses (coolant, heating), then explain why low SHC suits copper for cooking. Contrast the two." },
        ],
        flashcard: [
          { term: "Specific Heat Capacity Formula", definition: "Q = mcΔT. Q = energy (J), m = mass (kg), c = specific heat capacity (J/kg°C), ΔT = temperature change (°C). Rearrange: c = Q/(mΔT); m = Q/(cΔT).", example: "Q to heat 2kg of water by 50°C: Q = 2 × 4200 × 50 = 420,000 J" },
          { term: "Thermal Conductivity", definition: "Rate at which heat flows through a material. Good conductors (metals): free electrons transfer thermal energy quickly. Poor conductors/insulators (wood, plastic, air): no free electrons. U-values measure heat loss through building materials.", example: "Metal spoon in hot liquid gets hot quickly (high conductivity). Wooden spoon stays cool." },
        ],
      },
    },
    "Forces": {
      "Newton's Laws": {
        short: [
          { question: "A resultant force of 40N acts on a 8kg object. Calculate the acceleration.", answer: "a = F/m = 40/8 = 5 m/s²", marks: 2, hint: "Newton's Second Law: F = ma, so a = F/m" },
          { question: "State Newton's Third Law and give an example.", answer: "For every action force there is an equal and opposite reaction force, acting on a different object. Example: a person pushes down on the floor (action); the floor pushes up on the person with an equal force (reaction).", marks: 2, hint: "Equal and opposite — but acting on DIFFERENT objects" },
        ],
        mid: [
          { question: "A car of mass 1500kg brakes from 20m/s to rest in 4 seconds. Calculate (a) the deceleration and (b) the braking force.", answer: "(a) a = (v−u)/t = (0−20)/4 = −5 m/s² (deceleration = 5 m/s²). (b) F = ma = 1500 × 5 = 7500N", marks: 4, hint: "Use v = u + at to find deceleration, then F = ma" },
        ],
        long: [
          { question: "Explain the factors that affect stopping distance of a vehicle and the safety implications of each.", answer: "Stopping distance = thinking distance + braking distance. Thinking distance (reaction time × speed): affected by driver fatigue (slower reaction), alcohol/drugs (impair reactions, legal limit for driving), distractions (phone use), speed (higher speed = longer thinking distance even with same reaction time). Braking distance: depends on speed (force needed proportional to v²; doubling speed quadruples braking distance), road conditions (wet/icy reduces friction between tyres and road, increasing braking distance significantly), vehicle condition (worn tyres — reduced grip; worn brakes — less braking force). Safety implications: Speed limits reduce stopping distance quadratically. Drink/drive laws, phone-use laws address reaction time. Mandatory tyre tread depth (1.6mm). ABS (anti-lock braking) prevents wheel lock. MOT tests brakes and tyres.", marks: 7, hint: "Cover thinking distance factors (reaction time, alcohol, speed, distraction) and braking distance factors (speed squared relationship, road surface, tyre/brake condition). Link each to specific safety measures." },
        ],
        flashcard: [
          { term: "Newton's Three Laws", definition: "1st: Object at rest/constant velocity unless resultant force acts. 2nd: F = ma (resultant force = mass × acceleration). 3rd: Every action has equal and opposite reaction on a different object.", example: "Rocket: hot gas pushed downward (action) → rocket pushed upward with equal force (reaction)" },
          { term: "Stopping Distance", definition: "Total stopping distance = thinking distance + braking distance. Thinking distance: affected by reaction time and speed. Braking distance: affected by speed (v²), road conditions (friction), vehicle condition. Doubling speed quadruples braking distance.", example: "At 30mph: ~23m total stopping distance. At 60mph: ~73m (not double — because braking distance quadruples)" },
          { term: "Weight vs Mass", definition: "Mass (kg): amount of matter — constant everywhere. Weight (N): gravitational force on the mass — depends on gravitational field strength. W = mg. On Earth g = 9.8 (≈10) N/kg; on Moon g = 1.6 N/kg.", example: "60kg person: weight on Earth = 60×10 = 600N; weight on Moon = 60×1.6 = 96N" },
        ],
      },
      "Pressure": {
        short: [
          { question: "Calculate the pressure exerted by a force of 200N over an area of 0.05m².", answer: "P = F/A = 200/0.05 = 4000 Pa (4 kPa)", marks: 2, hint: "P = F/A (pascals)" },
          { question: "Why does pressure in a liquid increase with depth?", answer: "As depth increases, more liquid sits above that point — the weight of liquid above increases. Pressure = hρg (height × density × gravitational field strength), so greater depth means greater pressure.", marks: 2, hint: "Think about how much liquid is above the point" },
        ],
        mid: [
          { question: "Explain how atmospheric pressure changes with altitude and why this affects boiling point.", answer: "Atmospheric pressure is caused by the weight of air above a surface. At higher altitudes, there is less air above — atmospheric pressure decreases. Boiling point is the temperature at which vapour pressure equals atmospheric pressure. At lower atmospheric pressure, liquids boil at a lower temperature — water boils below 100°C on a mountain. This affects cooking: at altitude, water boils at ~90°C, so food takes longer to cook.", marks: 4, hint: "Explain what causes atmospheric pressure, how altitude reduces it, and how this affects boiling point — with a practical example" },
        ],
        long: [
          { question: "Explain how hydraulic systems use pressure in liquids to transmit and multiply force. Give a calculation example.", answer: "Liquids are incompressible — pressure applied at one point is transmitted equally throughout the liquid in all directions (Pascal's law). A small force on a small piston creates a pressure: P = F₁/A₁. This pressure is transmitted through the liquid to a larger piston: F₂ = P × A₂. Because A₂ > A₁, F₂ > F₁ — force is multiplied. Mechanical advantage = A₂/A₁. Example: car brakes — force on brake pedal (small piston, A₁=0.01m²) creates pressure P = 200/0.01 = 20000Pa. This transmitted to wheel cylinders (A₂=0.05m²): F₂ = 20000 × 0.05 = 1000N. Energy is conserved — the large piston moves a smaller distance. Applications: car brakes, hydraulic lifts, diggers, dental chairs.", marks: 7, hint: "Explain incompressibility, Pascal's law, P = F/A, force multiplication with worked example, conservation of energy, real applications" },
        ],
        flashcard: [
          { term: "Pressure Equations", definition: "Pressure = Force ÷ Area (Pa, N, m²). Pressure in a fluid: P = hρg (h = depth/m, ρ = density kg/m³, g = 9.8 N/kg). Atmospheric pressure ≈101,325 Pa at sea level.", example: "Depth 10m in water (ρ=1000): P = 10×1000×10 = 100,000 Pa = 1 atm extra" },
          { term: "Upthrust (Archimedes' Principle)", definition: "An object immersed in a fluid experiences an upward force (upthrust) equal to the weight of fluid displaced. Object floats when upthrust = weight (displaces its own weight of fluid).", example: "Ship floats because its large hollow shape displaces a weight of water equal to the ship's weight" },
        ],
      },
    },
    "Electricity": {
      "Circuits & Ohm's Law": {
        short: [
          { question: "A resistor has a current of 0.5A through it and a potential difference of 6V across it. Calculate its resistance.", answer: "R = V/I = 6/0.5 = 12Ω", marks: 2, hint: "Ohm's Law: V = IR, so R = V/I" },
          { question: "State the difference between series and parallel circuits in terms of current and voltage.", answer: "Series: current is the same at all points; voltage is shared between components. Parallel: voltage is the same across all branches; current splits between branches.", marks: 2, hint: "Series: same current. Parallel: same voltage." },
        ],
        mid: [
          { question: "Two resistors of 6Ω and 12Ω are connected in parallel. Calculate the combined resistance.", answer: "1/R = 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4. R = 4Ω", marks: 3, hint: "Parallel: 1/R_total = 1/R₁ + 1/R₂. The combined resistance is always less than the smallest." },
        ],
        long: [
          { question: "Design a circuit that would allow you to investigate how resistance of a wire changes with length. Describe the method, state variables and explain expected results.", answer: "Circuit: power supply, ammeter (in series), voltmeter (across the wire), and test wire attached to metre ruler with crocodile clips. Method: Set crocodile clip at different lengths (e.g. 10, 20, 30, 40, 50cm). For each length: record current (A) and voltage (V). Calculate R = V/I. Repeat 3 times for reliability. Independent variable: length of wire. Dependent variable: resistance. Controlled variables: material of wire (same wire), cross-sectional area (same wire), temperature (use low voltage to minimise heating), voltage setting. Expected results: resistance is directly proportional to length — graph of R vs length passes through origin as a straight line. Explanation: longer wire → more collisions between electrons and ions → greater resistance. R = ρL/A where ρ = resistivity.", marks: 7, hint: "Draw or describe circuit (ammeter in series, voltmeter in parallel). State all three variable types specifically. Predict graph shape and explain using particle/electron collision model." },
        ],
        flashcard: [
          { term: "Ohm's Law", definition: "V = IR for an ohmic conductor at constant temperature. Current is directly proportional to voltage. Non-ohmic conductors (e.g. diode, thermistor, filament lamp) have changing resistance. Graph: V vs I straight through origin = ohmic.", example: "Filament lamp: as it heats up, resistance increases → I-V curve bends (non-ohmic)" },
          { term: "Series Circuits", definition: "Same current (I) flows through all components. Voltage shared: V_total = V₁ + V₂ + ... Resistances add: R_total = R₁ + R₂ + ... If one component fails: circuit breaks.", example: "3Ω and 5Ω in series: R_total = 8Ω. With 12V: I = 12/8 = 1.5A everywhere" },
          { term: "Parallel Circuits", definition: "Same voltage (V) across all branches. Current splits: I_total = I₁ + I₂ + ... Resistance: 1/R_total = 1/R₁ + 1/R₂ + ... (total resistance less than smallest branch). If one branch fails: others continue.", example: "6Ω and 12Ω parallel: R = 4Ω. With 12V: total I = 3A (2A through 6Ω, 1A through 12Ω)" },
        ],
      },
    },
    "Waves": {
      "Wave Properties": {
        short: [
          { question: "A wave has a frequency of 200Hz and a wavelength of 1.5m. Calculate its speed.", answer: "v = fλ = 200 × 1.5 = 300 m/s", marks: 2, hint: "v = fλ (wave equation)" },
          { question: "What is the difference between transverse and longitudinal waves?", answer: "Transverse waves: oscillations perpendicular to the direction of energy transfer (e.g. light, water waves). Longitudinal waves: oscillations parallel to the direction of energy transfer — compressions and rarefactions (e.g. sound).", marks: 2, hint: "Which way do the particles vibrate relative to wave travel?" },
        ],
        mid: [
          { question: "Explain refraction of light at an interface between air and glass, including the change in speed and wavelength.", answer: "When light passes from air into glass (denser medium), it slows down. The frequency stays constant (fixed by source). Since v = fλ and frequency is unchanged, wavelength decreases. The wave bends towards the normal because the wave front slows on one side before the other (Huygens' principle). The angle of refraction is less than the angle of incidence. When going from glass to air: speeds up, bends away from normal. Described by Snell's Law: n₁sinθ₁ = n₂sinθ₂.", marks: 4, hint: "Explain speed change, wavelength change (frequency constant), direction change (towards/away from normal), Snell's Law" },
        ],
        long: [
          { question: "Describe the electromagnetic spectrum, including the properties common to all EM waves and the specific uses and dangers of each region.", answer: "All EM waves: transverse, travel at 3×10⁸ m/s in vacuum, can travel through vacuum, transfer energy. In order of increasing frequency (decreasing wavelength): Radio: broadcast TV/radio, MRI-like uses — very low energy, harmless. Microwaves: satellite communications, cooking (water molecules absorb energy) — can cause internal tissue heating. Infrared: thermal imaging, remote controls, short-range communications, optical fibres — heating effect. Visible: sight, photography, photosynthesis — absorbed by retina. Ultraviolet: sterilisation, detecting counterfeit notes, causes sunburn, skin cancer, eye damage — can ionise. X-rays: medical imaging (denser tissue absorbs more), airport security — ionising radiation, DNA damage. Gamma: cancer treatment (radiotherapy), sterilisation — most energetic, deeply penetrating, highly ionising, causes cancer. Higher frequency = higher energy = more dangerous (ionising). Lead and thick concrete absorb gamma and X-rays.", marks: 8, hint: "List all 7 regions in order. For each: at least one use AND appropriate safety concern. Link energy level to ionising ability." },
        ],
        flashcard: [
          { term: "Wave Equation", definition: "v = fλ. v = wave speed (m/s), f = frequency (Hz = 1/s), λ = wavelength (m). Frequency is fixed by the source. Speed depends on medium. When speed changes (e.g. refraction), wavelength changes but frequency stays the same.", example: "Sound at 340m/s, frequency 170Hz: λ = 340/170 = 2m" },
          { term: "The Electromagnetic Spectrum", definition: "All transverse waves at 3×10⁸ m/s in vacuum. Order (increasing λ, decreasing f): gamma, X-ray, UV, visible, IR, microwave, radio. Higher frequency = more energy = more dangerous. Ionising: gamma, X-ray, UV.", example: "Visible light: 400nm (violet) to 700nm (red). Radio waves: metres to kilometres wavelength" },
          { term: "Total Internal Reflection", definition: "When light hits a boundary from denser to less dense medium at an angle greater than the critical angle, all light reflects back — none escapes. Used in optical fibres and diamond sparkle.", example: "Glass to air: critical angle ~42°. Optical fibres transmit data using TIR along the fibre" },
        ],
      },
    },
    "Nuclear Physics": {
      "Radioactivity": {
        short: [
          { question: "A radioactive sample has an initial activity of 400Bq and a half-life of 10 years. What is the activity after 30 years?", answer: "30 years = 3 half-lives. Activity halves 3 times: 400 → 200 → 100 → 50Bq", marks: 2, hint: "Count how many half-lives fit into 30 years, then halve the activity each time" },
          { question: "State one property of alpha, one of beta and one of gamma radiation that makes each different from the others.", answer: "Alpha: heaviest, stopped by a sheet of paper/few cm of air, most ionising. Beta: faster, penetrates paper but stopped by 3mm aluminium. Gamma: electromagnetic wave, penetrates everything, reduced (not stopped) by thick lead or concrete.", marks: 3, hint: "Think about penetration and ionising ability" },
        ],
        mid: [
          { question: "Explain what happens to the atomic number and mass number when a nucleus decays by (a) alpha emission and (b) beta emission.", answer: "(a) Alpha decay: nucleus emits an alpha particle (⁴₂He — 2 protons, 2 neutrons). Mass number decreases by 4. Atomic number decreases by 2. Example: ²³⁸U → ²³⁴Th + ⁴He. (b) Beta decay: a neutron converts to a proton and electron. The electron (beta particle) is emitted. Mass number unchanged. Atomic number increases by 1. Example: ¹⁴C → ¹⁴N + β⁻.", marks: 4, hint: "Alpha: A−4, Z−2. Beta: A unchanged, Z+1. Show example nuclear equations." },
        ],
        long: [
          { question: "Explain how radioactive decay is used in carbon dating to determine the age of organic materials. Include the assumptions the method makes and its limitations.", answer: "Carbon-14 (¹⁴C) is a radioactive isotope produced in the upper atmosphere by cosmic ray bombardment of nitrogen. Plants absorb ¹⁴C through photosynthesis (as ¹⁴CO₂). Animals absorb ¹⁴C by eating plants. While alive, organisms maintain a constant ratio of ¹⁴C to ¹²C (matching atmospheric ratio). When an organism dies, ¹⁴C is no longer replenished and decays (half-life = 5,730 years). By measuring the remaining ¹⁴C/¹²C ratio and comparing to the original atmospheric ratio, scientists calculate how many half-lives have passed → determine age. Assumptions: (1) atmospheric ¹⁴C concentration has been constant throughout history; (2) no contamination of sample with older/younger carbon; (3) the organism absorbed carbon in proportion to atmospheric ratio. Limitations: only reliable for materials up to ~50,000 years old (beyond ~8-9 half-lives, too little ¹⁴C remains to measure accurately). Atmospheric ¹⁴C has varied (calibrated using tree rings/dendrochronology). Contamination by modern carbon gives artificially young dates.", marks: 8, hint: "Explain: ¹⁴C production, living organisms maintain constant ratio, death stops replenishment, decay allows calculation. State all three assumptions. Give specific limitations with reasons." },
        ],
        flashcard: [
          { term: "Types of Nuclear Radiation", definition: "Alpha (α): helium nucleus (²⁴He), +2 charge, mass 4. Penetrating power: stopped by paper/skin. Most ionising. Beta (β): fast electron, −1 charge, negligible mass. Stopped by 3mm Al. Gamma (γ): EM wave, no charge/mass. Penetrates lead (reduced). Least ionising.", example: "Smoke detectors use alpha (ionises air, completing circuit — smoke disrupts this)" },
          { term: "Half-Life", definition: "Time for half the radioactive nuclei to decay (or activity to halve). Random but predictable for large samples. After n half-lives, fraction remaining = (1/2)ⁿ.", example: "t½ = 5 years. After 15 years (3 half-lives): 1/8 of original nuclei remain. Activity = 1/8 of original" },
          { term: "Nuclear Fission vs Fusion", definition: "Fission: heavy nucleus splits (e.g. U-235 + neutron) releasing energy + 2-3 neutrons → chain reaction. Used in nuclear power stations. Fusion: light nuclei combine (e.g. hydrogen isotopes → helium) releasing more energy per kg. Occurs in stars. Requires extreme temperature/pressure. ITER project attempting sustained fusion.", example: "Fission: 1 kg of U-235 releases ~85 trillion joules. Fusion: cleaner, more energy-dense, no long-lived waste" },
        ],
      },
    },
  },
};

// SUBJECT_TOPICS_MAP: subject → topic → [subtopics]
const SUBJECT_TOPICS_MAP = {
  "Mathematics": {
    "Number":                     ["Fractions & Decimals","Percentages","Powers & Roots","Standard Form","Prime Factors, HCF & LCM","Surds & Bounds","Ratio & Proportion"],
    "Algebra":                    ["Linear Equations & Expressions","Factorising","Simultaneous Equations","Quadratics","Inequalities","Sequences","Functions & Iteration"],
    "Geometry & Measures":        ["Angles & Polygons","Area & Perimeter","Volume & Surface Area","Circles & Sectors","Transformations","Pythagoras & Trigonometry","Vectors"],
    "Probability":                ["Basic Probability","Venn Diagrams","Tree Diagrams","Conditional Probability"],
    "Statistics":                 ["Averages & Spread","Frequency Tables & Histograms","Scatter Graphs & Correlation","Box Plots & Cumulative Frequency"],
    "Graphs & Functions":         ["Straight Line Graphs","Quadratic & Cubic Graphs","Inequalities on Graphs","Real-Life Graphs"],
    "Ratio & Proportion":         ["Ratio Problems","Direct Proportion","Inverse Proportion","Rates of Change"],
  },
  "Biology": {
    "Cell Biology":               ["Cell Structure","Diffusion, Osmosis & Active Transport","Cell Division","Stem Cells & Differentiation"],
    "Organisation":               ["Tissues, Organs & Systems","Digestive System","Cardiovascular System","Respiratory System"],
    "Infection & Response":       ["Pathogens & Disease","Non-Specific Defences","Specific Immune Response","Vaccines & Medicines"],
    "Bioenergetics":              ["Photosynthesis","Aerobic Respiration","Anaerobic Respiration","Metabolism"],
    "Homeostasis":                ["Nervous System & Reflexes","Hormonal Coordination","Blood Glucose Regulation","Kidney & Water Balance"],
    "Inheritance & Evolution":    ["DNA & Genes","Genetic Inheritance","Natural Selection & Evolution","Variation & Classification"],
    "Ecology":                    ["Ecosystems & Food Webs","Cycling of Materials","Biodiversity & Human Impact","Sampling Techniques"],
  },
  "Chemistry": {
    "Atomic Structure & Periodic Table": ["Atomic Model & Subatomic Particles","Electronic Configuration","Isotopes & Relative Atomic Mass","The Periodic Table & Groups"],
    "Bonding & Structure":        ["Ionic Bonding","Covalent Bonding","Metallic Bonding","Giant Structures & Properties"],
    "Quantitative Chemistry":     ["Moles & Mr","Concentration & Solutions","Percentage Yield & Atom Economy","Reacting Masses & Gas Volumes"],
    "Chemical Changes":           ["Reactivity Series & Displacement","Acids, Bases & Neutralisation","Electrolysis","Redox Reactions"],
    "Energy Changes":             ["Exothermic & Endothermic Reactions","Bond Energies","Calorimetry"],
    "Rates & Equilibrium":        ["Factors Affecting Rate","Collision Theory & Catalysts","Reversible Reactions","Le Chatelier's Principle"],
    "Organic Chemistry":          ["Alkanes & Alkenes","Alcohols & Carboxylic Acids","Addition & Condensation Polymers","Crude Oil & Fractional Distillation"],
    "Chemical Analysis":          ["Flame Tests & Ion Identification","Gas Tests","Chromatography","Instrumental Analysis"],
    "Atmosphere & Resources":     ["Composition of Atmosphere","Climate Change & Greenhouse Effect","Water Treatment","Life Cycle Assessment"],
  },
  "Physics": {
    "Energy":                     ["Energy Stores & Transfers","Specific Heat Capacity","Efficiency & Power","Renewable & Non-Renewable Resources"],
    "Electricity":                ["Circuits & Ohm's Law","Series & Parallel Circuits","Electrical Power & Energy","Static Electricity"],
    "Particle Model of Matter":   ["Density & States of Matter","Internal Energy & Temperature","Specific Latent Heat","Gas Pressure & Temperature"],
    "Nuclear Physics":            ["Radioactivity","Nuclear Equations & Decay","Half-Life","Nuclear Fission & Fusion"],
    "Forces":                     ["Newton's Laws","Stopping Distance & Momentum","Work Done & Energy","Pressure & Hydraulics"],
    "Waves":                      ["Wave Properties","Electromagnetic Spectrum","Sound & Ultrasound","Reflection, Refraction & Lenses"],
    "Magnetism":                  ["Magnetic Fields","Electromagnetism & Solenoids","Motor Effect","Electromagnetic Induction & Transformers"],
    "Space Physics":              ["The Solar System","Life Cycle of Stars","Red-Shift & Big Bang","Satellites & Orbits"],
  },
  "Combined Science": {
    "Cell Biology":               ["Cell Structure & Microscopy","Diffusion & Osmosis","Cell Division & Stem Cells"],
    "Organisation & Systems":     ["Digestive System","Cardiovascular System","Respiratory System"],
    "Infection & Response":       ["Pathogens & Immunity","Vaccines & Drugs"],
    "Atomic Structure":           ["Subatomic Particles","Electronic Configuration","Isotopes"],
    "Bonding & Structure":        ["Ionic & Covalent Bonding","Properties of Substances"],
    "Chemical Changes":           ["Acids & Bases","Electrolysis","Reactivity Series"],
    "Energy":                     ["Energy Stores","Specific Heat Capacity","Efficiency"],
    "Forces & Motion":            ["Newton's Laws","Stopping Distance","Momentum"],
    "Waves":                      ["Wave Equation","Electromagnetic Spectrum","Refraction"],
    "Electricity":                ["Ohm's Law","Series & Parallel","Electrical Power"],
    "Homeostasis":                ["Nervous System","Blood Glucose","Temperature Regulation"],
    "Ecology":                    ["Food Chains & Ecosystems","Carbon & Nitrogen Cycles","Human Impact"],
  },
  "English Language": {
    "Reading: Fiction":           ["Identifying Language Techniques","Analysing Effect on Reader","Structural Techniques","Comparing Texts"],
    "Reading: Non-Fiction":       ["Identifying Viewpoint & Purpose","Rhetoric & Persuasion","Synthesising Information","Evaluating Language"],
    "Writing: Narrative":         ["Descriptive Techniques","Story Structure","Creating Atmosphere","Voice & Perspective"],
    "Writing: Persuasive":        ["Rhetorical Devices","Argument Structure","Audience Awareness","Counter-Argument"],
    "Language Techniques":        ["Figurative Language","Syntax & Sentence Structure","Vocabulary & Register","Sound Devices"],
    "Grammar & Punctuation":      ["Sentence Types & Clauses","Punctuation for Effect","Tense & Agreement","Formal vs Informal"],
  },
  "English Literature": {
    "Macbeth":                    ["Themes: Ambition & Power","Themes: Appearance vs Reality","Macbeth as Tragic Hero","Lady Macbeth","The Supernatural"],
    "A Christmas Carol":          ["Scrooge's Transformation","Social Criticism & Poverty","The Christmas Spirits","Dickens' Purpose & Context"],
    "An Inspector Calls":         ["Social Responsibility","The Inspector","Sheila & Eric","Birling & Class"],
    "Romeo and Juliet":           ["Love & Conflict","Fate & Free Will","Family & Society","Language & Structure"],
    "Of Mice and Men":            ["Loneliness & Friendship","The American Dream","Power & Discrimination","Character Analysis"],
    "Poetry: Power & Conflict":   ["War Poetry","Power & Oppression","Identity & Voice","Unseen Poetry Skills"],
    "Unseen Poetry":              ["Identifying Language","Structure & Form","Comparing Poems","Writing About Effect"],
  },
  "History": {
    "World War One":              ["Causes of WWI (MAIN)","Life in the Trenches","Key Battles","The Home Front"],
    "Versailles & Aftermath":     ["Treaty of Versailles","The League of Nations","Consequences for Germany"],
    "Weimar & Rise of Hitler":    ["Weimar Republic Problems","Early Nazi Party","Hitler's Consolidation of Power","Nazi Germany"],
    "World War Two":              ["Causes of WWII","Appeasement","Key Events 1939-1945","The Holocaust"],
    "Cold War":                   ["Origins of the Cold War","Berlin Wall & Crises","Cuba & Korea","End of the Cold War"],
    "Medicine Through Time":      ["Ancient & Medieval Medicine","Renaissance & Enlightenment","19th Century Breakthroughs","Modern Medicine"],
    "Crime & Punishment":         ["Anglo-Saxon Period","Medieval Period","Early Modern Period","19th-20th Century"],
  },
  "Geography": {
    "Tectonic Hazards":           ["Plate Boundaries","Earthquakes","Volcanoes","Managing Tectonic Hazards"],
    "Weather & Climate":          ["UK Weather Systems","Tropical Storms","Climate Change Evidence","Responses to Climate Change"],
    "River Landscapes":           ["River Processes (Erosion)","Landforms: Waterfalls & Meanders","Flooding","Flood Management"],
    "Coastal Landscapes":         ["Coastal Processes","Coastal Landforms","Coastal Erosion Management","Sea Level Rise"],
    "Urban Issues":               ["Urbanisation Trends","Urban Challenges in LICs","Urban Challenges in HICs","Sustainable Urban Development"],
    "Development & Resources":    ["Development Gap","Causes of Inequality","Food & Water Security","Economic Development Strategies"],
    "Ecosystems":                 ["Biomes & Ecosystems","Tropical Rainforests","Hot Deserts","Biodiversity & Conservation"],
  },
  "Computer Science": {
    "Algorithms":                 ["Decomposition & Abstraction","Searching Algorithms","Sorting Algorithms","Efficiency & Big-O"],
    "Programming":                ["Variables, Data Types & I/O","Selection (if/else)","Iteration (loops)","Functions & Procedures"],
    "Data Structures":            ["Arrays & Lists","2D Arrays","String Manipulation","File Handling"],
    "Boolean Logic":              ["AND, OR, NOT Gates","Truth Tables","Logic Circuits","De Morgan's Laws"],
    "Computer Systems":           ["CPU Architecture & FDE Cycle","Memory: RAM, ROM, Cache","Secondary Storage","Operating Systems"],
    "Networks":                   ["Network Topologies","Network Protocols","The Internet & WWW","Cyber Security Threats"],
    "Databases":                  ["Relational Databases","SQL Queries","Entity Relationship Diagrams","Normalisation"],
    "Ethical Issues":             ["Privacy & Data Protection","AI & Automation","Environmental Impact","Intellectual Property"],
  },
  "Psychology": {
    "Memory":                     ["Multi-Store Model","Working Memory Model","Forgetting","Eye-Witness Testimony"],
    "Perception":                 ["Visual Perception Theories","Perceptual Set","Factors Affecting Perception"],
    "Social Influence":           ["Conformity (Asch)","Obedience (Milgram)","Social Loafing","Crowd Psychology"],
    "Development":                ["Piaget's Theory","Attachment Theory","Bowlby & Ainsworth","Moral Development"],
    "Research Methods":           ["Experimental Methods","Non-Experimental Methods","Data Types & Analysis","Ethics in Psychology"],
    "Brain & Behaviour":          ["Brain Structure & Function","Brain Scanning","Neuropsychology (case studies)","The Nature-Nurture Debate"],
    "Criminal Psychology":        ["Causes of Crime","Offender Profiling","Treating Offenders","Eyewitness Testimony in Court"],
  },
  "Sociology": {
    "Family":                     ["Functionalist View of Family","Marxist & Feminist Views","Changing Family Patterns","Childhood & Family"],
    "Education":                  ["Functionalism & Education","Marxism & Hidden Curriculum","Social Class & Achievement","Gender & Ethnicity in Education"],
    "Crime & Deviance":           ["Functionalist View of Crime","Marxist & Feminist Views of Crime","Labelling Theory","Social Control"],
    "Research Methods":           ["Quantitative Methods","Qualitative Methods","Sampling","Reliability vs Validity"],
    "Social Stratification":      ["Social Class","Gender Inequality","Ethnic Inequality","Social Mobility"],
    "Media":                      ["Media Representations","Influence of Media","Media & Identity","Digital Media"],
  },
  "Business Studies": {
    "Starting a Business":        ["Entrepreneurs & Ideas","Market Research","Business Plans","Legal Structures"],
    "Finance":                    ["Revenue, Costs & Profit","Break-Even Analysis","Cash Flow","Financial Statements"],
    "Marketing":                  ["The 4 Ps","Market Segmentation","Pricing Strategies","Promotional Methods"],
    "Human Resources":            ["Recruitment & Selection","Motivation Theories","Training & Development","Employment Law"],
    "Operations":                 ["Production Methods","Quality Management","Supply Chain","Lean Production"],
    "External Environment":       ["Competition & Market Conditions","Economic Influences","Technology & Globalisation","Ethical & Environmental Responsibility"],
  },
  "Religious Studies": {
    "Christian Beliefs":          ["Nature of God","Jesus Christ & Salvation","Afterlife & Eschatology","Creation & Fall"],
    "Islamic Beliefs":            ["Tawhid & Allah's Nature","The Six Articles of Faith","Prophethood & Muhammad","Life After Death in Islam"],
    "Ethics: Life & Death":       ["Sanctity of Life","Abortion","Euthanasia","Death Penalty"],
    "Ethics: War & Peace":        ["Just War Theory","Pacifism","Holy War","Forgiveness & Reconciliation"],
    "Ethics: Crime & Punishment": ["Causes of Crime","Aims of Punishment","Prison & Rehabilitation","Capital Punishment"],
    "The Existence of God":       ["Arguments for God's Existence","The Problem of Evil","Religious Experience","Science vs Religion"],
  },
  "Economics": {
    "Microeconomics":             ["Supply & Demand","Price Elasticity","Market Structures","Consumer & Producer Surplus"],
    "Macroeconomics":             ["GDP & Economic Growth","Unemployment","Inflation","Balance of Payments"],
    "Government Policy":          ["Fiscal Policy","Monetary Policy","Supply-Side Policies","Trade Policy"],
    "Business Economics":         ["Costs of Production","Revenue & Profit","Market Failure","Externalities"],
  },
  "French": {
    "Identity & Culture":         ["Personal Description & Family","Relationships","Social Media & Technology","Cultural Life"],
    "Local Area & Travel":        ["Describing Your Area","Holiday & Tourism","Transport","Accommodation"],
    "School & Work":              ["School Life & Subjects","Work Experience","Future Careers","Higher Education"],
    "Grammar":                    ["Present Tense","Past Tenses (Passé Composé & Imparfait)","Future & Conditional","Subjunctive & Complex Structures"],
    "Global Issues":              ["Environment & Climate","Poverty & Charity","Healthy Living","Global Events"],
  },
  "Spanish": {
    "Identity & Culture":         ["Personal Information & Family","Free Time & Hobbies","Social Issues","Spanish & Latin American Culture"],
    "Local Area & Travel":        ["Your Town & Region","Holiday Planning","Transport & Directions","Eating Out"],
    "School & Work":              ["School System & Subjects","Part-Time Work","Career Aspirations","Gap Year"],
    "Grammar":                    ["Present Tense & Reflexives","Preterite & Imperfect","Future & Conditional","Subjunctive & Por/Para"],
    "Global Issues":              ["Environmental Problems","Healthy Lifestyle","Technology & Social Media","Volunteering"],
  },
  "German": {
    "Identity & Culture":         ["Family & Relationships","Hobbies & Interests","Social Media","German-Speaking Culture"],
    "Local Area & Travel":        ["Where You Live","Holidays & Tourism","Transport","Accommodation & Restaurants"],
    "School & Work":              ["School Life","Work Experience & Jobs","Future Plans","University & Training"],
    "Grammar":                    ["Nominative & Accusative Cases","Dative Case & Prepositions","Past Tenses (Perfekt & Imperfekt)","Future & Modal Verbs"],
    "Global Issues":              ["Environment","Healthy Living","Technology","Volunteering & Global Problems"],
  },
  "Welsh": {
    "Personal Life":              ["Family & Friends","Daily Routine","Hobbies","Health & Lifestyle"],
    "School & Work":              ["School Subjects","Work & Jobs","Future Plans"],
    "Local Area":                 ["Your Town","Wales & Culture","Environment"],
    "Grammar":                    ["Mutations","Present & Past Tenses","Prepositions"],
  },
  "Design & Technology": {
    "Materials":                  ["Wood & Timber Products","Metals & Alloys","Polymers & Plastics","Textiles & Composites"],
    "Design Process":             ["Briefs, Specifications & Research","Generating Ideas (CAD & Sketching)","Prototyping & Testing","Evaluating Designs"],
    "Manufacturing":              ["Cutting & Shaping Processes","Joining Methods","Finishing Processes","Scale of Production"],
    "Sustainability":             ["The Six Rs","Life Cycle Assessment","Ethical Sourcing","Sustainable Materials"],
    "Systems & Control":          ["Mechanical Systems","Electronic Components","Microcontrollers (Arduino)","Programmable Control"],
  },
  "Food Preparation & Nutrition": {
    "Nutrition":                  ["Macronutrients","Micronutrients & Water","Dietary Needs Across Life Stages","Energy Balance & Diet-Related Illness"],
    "Food Science":               ["Functional Properties of Proteins","Functional Properties of Fats","Raising Agents & Starch","The Maillard Reaction & Caramelisation"],
    "Food Safety":                ["Microorganisms & Food Spoilage","Food Poisoning & Pathogens","Food Storage & Preservation","HACCP & Kitchen Hygiene"],
    "Food Provenance":            ["Food Miles & Sustainability","British Food Seasons","Food Production Methods","Ethical Sourcing & Fairtrade"],
    "Practical Skills":           ["Knife Skills & Equipment","Cooking Methods","Portion Control & Menu Planning","Sensory Analysis"],
  },
  "Physical Education": {
    "Components of Fitness":      ["Health-Related Fitness","Skill-Related Fitness","Body Composition","Fitness Testing"],
    "Training Principles":        ["FITT Principles","Overload, Specificity & Reversibility","Training Methods","Periodisation"],
    "Anatomy":                    ["Skeletal System & Joints","Muscular System","Cardiovascular System","Respiratory System"],
    "Sports Psychology":          ["Motivation & Goals","Arousal & Anxiety (Inverted U)","Mental Skills Techniques","Group Dynamics & Leadership"],
    "Socio-Cultural Influences":  ["Participation Trends","Barriers to Participation","Media & Sport","Commercialisation & Ethics"],
    "Health & Wellbeing":         ["Health vs Fitness","Lifestyle & Disease","Drugs in Sport","Benefits of Exercise"],
  },
  "Drama": {
    "Performance Skills":         ["Voice","Movement & Physicality","Characterisation","Ensemble Skills"],
    "Practitioners":              ["Stanislavski & Method Acting","Brecht & Epic Theatre","Physical Theatre (DV8/Frantic Assembly)","Artaud & Theatre of Cruelty"],
    "Design Elements":            ["Lighting Design","Sound Design","Set & Staging","Costume & Makeup"],
    "Set Texts":                  ["Script Analysis","Character Motivation","Themes & Context","Director's Vision"],
    "Devising":                   ["Stimulus & Research","Developing Material","Structuring a Piece","Evaluating Devised Work"],
  },
  "Music": {
    "Musical Elements":           ["Rhythm & Metre","Melody & Pitch","Harmony & Tonality","Texture & Dynamics"],
    "Music Theory":               ["Notation & Time Signatures","Scales & Keys","Chords & Cadences","Modulation"],
    "Western Classical":          ["Baroque (Bach, Handel)","Classical (Haydn, Mozart)","Romantic (Beethoven, Chopin)","20th Century"],
    "Popular & World Music":      ["Blues & Jazz","Rock & Pop","World Music Traditions","Film & Musical Theatre"],
    "Listening & Analysis":       ["Identifying Features","Comparing Pieces","Set Works Analysis","Aural Skills"],
  },
  "Art & Design": {
    "Formal Elements":            ["Line & Mark-Making","Shape & Form","Colour Theory","Tone & Texture"],
    "Art Movements":              ["Impressionism","Abstract & Expressionism","Pop Art & Contemporary","Global Art Traditions"],
    "Practical Skills":           ["Drawing & Observation","Painting Techniques","Printmaking","Mixed Media & Collage"],
    "Critical Analysis":          ["Analysing Artworks","Context & Influence","Artist Research","Evaluating Own Work"],
    "Design in Context":          ["Graphic Design","Product Design","Fashion & Textiles","Architecture & Interior"],
  },
};

// HELPER FUNCTIONS
// ─────────────────────────────────────────────

// Shuffle array in place (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Get questions from bank, shuffled, capped at n
function getBankQuestions(subject, type, n = 5) {
  const bank = QUESTION_BANK[subject]?.[type];
  if (!bank || bank.length === 0) return null;
  return shuffle(bank).slice(0, n);
}

// Get flashcards from bank, shuffled, capped at n
function getBankFlashcards(subject, n = 10) {
  const bank = QUESTION_BANK[subject]?.flashcard;
  if (!bank || bank.length === 0) return null;
  return shuffle(bank).slice(0, n);
}

// Check if subject has pre-generated content
function hasBank(subject, type) {
  const bank = QUESTION_BANK[subject];
  if (!bank) return false;
  if (type === "flashcard") return !!(bank.flashcard?.length > 0);
  return !!(bank[type]?.length > 0);
}


// ─── EXAM BOARDS ─────────────────────────────────────────────────────────────
const EXAM_BOARDS = {
  AQA:     { color:"#1a1a2e", accent:"#e94560", lightAccent:"#ff6b6b", logo:"AQA",     tagline:"Assessment and Qualifications Alliance", subjects:["Mathematics","English Language","English Literature","Biology","Chemistry","Physics","Combined Science","History","Geography","French","Spanish","German","Religious Studies","Computer Science","Art & Design","Music","Drama","Physical Education","Sociology","Psychology","Business Studies","Economics","Design & Technology","Food Preparation & Nutrition"] },
  Edexcel: { color:"#003087", accent:"#00a3e0", lightAccent:"#4fc3f7", logo:"EDEXCEL", tagline:"Pearson Edexcel",                     subjects:["Mathematics","English Language","English Literature","Biology","Chemistry","Physics","Combined Science","History","Geography","French","Spanish","German","Religious Studies","Computer Science","Art & Design","Music","Drama","Physical Education","Sociology","Psychology","Business Studies","Economics","Design & Technology","Food Preparation & Nutrition"] },
  OCR:     { color:"#00467f", accent:"#00b4d8", lightAccent:"#48cae4", logo:"OCR",     tagline:"Oxford Cambridge and RSA",             subjects:["Mathematics","English Language","English Literature","Biology","Chemistry","Physics","Combined Science","History","Geography","French","Spanish","German","Religious Studies","Computer Science","Art & Design","Music","Drama","Physical Education","Sociology","Psychology","Business Studies","Economics","Design & Technology","Food Preparation & Nutrition"] },
  WJEC:    { color:"#2d6a4f", accent:"#52b788", lightAccent:"#74c69d", logo:"WJEC",    tagline:"Welsh Joint Education Committee",       subjects:["Mathematics","English Language","English Literature","Biology","Chemistry","Physics","Combined Science","History","Geography","French","Spanish","Welsh","German","Religious Studies","Computer Science","Art & Design","Music","Drama","Physical Education","Sociology","Psychology","Business Studies","Economics","Design & Technology","Food Preparation & Nutrition"] },
};

const SUBJECT_ICONS = {
  "Mathematics":"∑","English Language":"✍","English Literature":"📖","Biology":"🧬","Chemistry":"⚗","Physics":"⚛","Combined Science":"🔬","History":"🏛","Geography":"🌍","French":"🇫🇷","Spanish":"🇪🇸","German":"🇩🇪","Welsh":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","Religious Studies":"✝","Computer Science":"💻","Art & Design":"🎨","Music":"🎵","Drama":"🎭","Physical Education":"⚽","Sociology":"👥","Psychology":"🧠","Business Studies":"📊","Economics":"💹","Design & Technology":"⚙","Food Preparation & Nutrition":"🍽",
};

const Q_TYPES = [
  { type:"short",     label:"Short Answer",     icon:"⚡", marks:"1–2 marks", color:"#f59e0b", desc:"Quick recall. Single sentence." },
  { type:"mid",       label:"Mid Answer",        icon:"📋", marks:"3–5 marks", color:"#8b5cf6", desc:"2–3 developed points." },
  { type:"long",      label:"Extended Response", icon:"📝", marks:"6–8 marks", color:"#e94560", desc:"Full argument + evaluation." },
  { type:"flashcard", label:"Flashcards",        icon:"🃏", marks:"Key terms",  color:"#10b981", desc:"Flip to reveal definitions." },
];

// ─── FLASHCARD DECK ───────────────────────────────────────────────────────────
function FlashcardDeck({ cards, board, onBack, onNewDeck, setChatOpen, setChatInput }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [done, setDone] = useState(false);
  const card = cards[idx];

  function mark(isKnown) {
    if (isKnown) setKnown(p=>[...p,idx]); else setUnknown(p=>[...p,idx]);
    setFlipped(false);
    setTimeout(() => { if (idx < cards.length-1) setIdx(p=>p+1); else setDone(true); }, 200);
  }

  if (done) return (
    <div style={{textAlign:"center",padding:"60px 0",maxWidth:540,margin:"0 auto"}}>
      <div style={{fontSize:52,marginBottom:16}}>🎉</div>
      <h2 style={{fontWeight:700,fontSize:26,margin:"0 0 8px"}}>Deck Complete!</h2>
      <p style={{color:"#888",marginBottom:32}}>You knew {known.length} of {cards.length} cards</p>
      <div style={{display:"flex",gap:16,justifyContent:"center",marginBottom:32}}>
        <div style={{background:"rgba(16,185,129,0.1)",border:"1px solid #10b981",borderRadius:12,padding:"16px 28px"}}>
          <p style={{color:"#10b981",fontWeight:700,fontSize:28,margin:0}}>{known.length}</p>
          <p style={{color:"#10b981",fontSize:13,margin:0}}>Knew it ✓</p>
        </div>
        <div style={{background:"rgba(233,69,96,0.1)",border:"1px solid #e94560",borderRadius:12,padding:"16px 28px"}}>
          <p style={{color:"#e94560",fontWeight:700,fontSize:28,margin:0}}>{unknown.length}</p>
          <p style={{color:"#e94560",fontSize:13,margin:0}}>Need practice ✗</p>
        </div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button onClick={onNewDeck} style={{background:board.accent,border:"none",borderRadius:10,padding:"12px 24px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>New Deck</button>
        <button onClick={onBack} style={{background:"#222",border:"1px solid #333",borderRadius:10,padding:"12px 24px",color:"#888",cursor:"pointer",fontSize:14}}>Change Topics</button>
      </div>
    </div>
  );

  return (
    <div style={{maxWidth:620,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <button onClick={onBack} style={{background:"none",border:"1px solid #333",color:"#888",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13}}>← Change Topics</button>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{background:"rgba(16,185,129,0.15)",color:"#10b981",fontSize:12,padding:"3px 10px",borderRadius:8}}>✓ {known.length}</span>
          <span style={{background:"rgba(233,69,96,0.15)",color:"#e94560",fontSize:12,padding:"3px 10px",borderRadius:8}}>✗ {unknown.length}</span>
          <span style={{color:"#555",fontSize:13}}>{idx+1}/{cards.length}</span>
        </div>
      </div>
      <div style={{background:"#222",borderRadius:4,height:4,marginBottom:24,overflow:"hidden"}}>
        <div style={{height:"100%",background:"#10b981",width:`${(idx/cards.length)*100}%`,transition:"width 0.3s"}}/>
      </div>

      <div onClick={()=>setFlipped(p=>!p)} style={{perspective:"1400px",cursor:"pointer",marginBottom:20,userSelect:"none"}}>
        <div style={{position:"relative",width:"100%",height:280,transformStyle:"preserve-3d",transform:flipped?"rotateY(180deg)":"rotateY(0deg)",transition:"transform 0.5s cubic-bezier(0.4,0,0.2,1)"}}>
          <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",background:"#1a1a1a",border:`2px solid ${board.accent}44`,borderRadius:20,padding:36,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
            <div style={{fontSize:10,letterSpacing:"1.5px",color:"#444",textTransform:"uppercase",marginBottom:18}}>Tap to reveal answer</div>
            <p style={{fontSize:20,fontWeight:600,lineHeight:1.6,margin:0}}>{card?.term}</p>
            <div style={{position:"absolute",bottom:14,right:18,fontSize:16,color:"#333"}}>⟳</div>
          </div>
          <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",transform:"rotateY(180deg)",background:`linear-gradient(145deg,${board.color}dd,#1e1e1e)`,border:`2px solid ${board.accent}88`,borderRadius:20,padding:36,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
            <div style={{fontSize:10,letterSpacing:"1.5px",color:board.lightAccent,textTransform:"uppercase",marginBottom:14,opacity:0.8}}>Answer</div>
            <p style={{fontSize:15,lineHeight:1.75,margin:0}}>{card?.definition}</p>
            {card?.example&&<p style={{fontSize:12,color:board.lightAccent,marginTop:12,fontStyle:"italic",opacity:0.85}}>e.g. {card.example}</p>}
          </div>
        </div>
      </div>

      <p style={{textAlign:"center",color:"#555",fontSize:13,marginBottom:12}}>Did you know it?</p>
      <div style={{display:"flex",gap:12}}>
        <button onClick={()=>mark(false)} style={{flex:1,background:"rgba(233,69,96,0.1)",border:"1px solid #e94560",borderRadius:12,padding:"14px 0",color:"#e94560",fontWeight:700,fontSize:15,cursor:"pointer"}}>✗  Not yet</button>
        <button onClick={()=>{setChatOpen(true);setChatInput(`Can you explain "${card?.term}" in more detail for GCSE level?`);}} style={{background:"#222",border:"1px solid #333",borderRadius:12,padding:"14px 16px",color:"#888",cursor:"pointer",fontSize:16}}>💬</button>
        <button onClick={()=>mark(true)} style={{flex:1,background:"rgba(16,185,129,0.1)",border:"1px solid #10b981",borderRadius:12,padding:"14px 0",color:"#10b981",fontWeight:700,fontSize:15,cursor:"pointer"}}>✓  Got it</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function EducateApp() {
  const [screen, setScreen] = useState("home");
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questionType, setQuestionType] = useState(null);

  // Topic/subtopic multi-select state
  const [expandedTopics, setExpandedTopics] = useState({});         // {topicName: bool}
  const [selectedTopics, setSelectedTopics] = useState({});         // {topicName: bool}
  const [selectedSubtopics, setSelectedSubtopics] = useState({});   // {"topic||sub": bool}

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct:0, total:0 });
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingSource, setLoadingSource] = useState(null);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role:"assistant", content:"Hi! I'm your Educate AI tutor. Ask me anything about your subjects, exam technique, or any concept you're struggling with. 📚" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatOpen && chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior:"smooth" });
  }, [chatMessages, chatOpen]);

  const board = selectedBoard ? EXAM_BOARDS[selectedBoard] : null;
  const qTypeCfg = Q_TYPES.find(t => t.type === questionType);
  const topicMap = selectedSubject ? (SUBJECT_TOPICS_MAP[selectedSubject] || {}) : {};

  // ── Selection helpers ────────────────────────────────────────────────────────
  function toggleExpand(topic) {
    setExpandedTopics(p => ({ ...p, [topic]: !p[topic] }));
  }

  function toggleTopic(topic) {
    const subs = topicMap[topic] || [];
    const isSelected = selectedTopics[topic];
    setSelectedTopics(p => ({ ...p, [topic]: !isSelected }));
    // Also toggle all its subtopics
    setSelectedSubtopics(p => {
      const next = { ...p };
      subs.forEach(sub => { next[`${topic}||${sub}`] = !isSelected; });
      return next;
    });
  }

  function toggleSubtopic(topic, sub) {
    const key = `${topic}||${sub}`;
    setSelectedSubtopics(p => ({ ...p, [key]: !p[key] }));
    // Sync topic checkbox: check if all subs now selected
    const subs = topicMap[topic] || [];
    const newState = !selectedSubtopics[key];
    const allSelected = subs.every(s => s === sub ? newState : selectedSubtopics[`${topic}||${s}`]);
    setSelectedTopics(p => ({ ...p, [topic]: allSelected }));
  }

  function getSelectionSummary() {
    const selectedSubs = Object.entries(selectedSubtopics).filter(([,v])=>v).map(([k])=>k);
    const selectedTopicKeys = Object.entries(selectedTopics).filter(([,v])=>v).map(([k])=>k);
    return { selectedSubs, selectedTopicKeys, hasAny: selectedSubs.length > 0 || selectedTopicKeys.length > 0 };
  }

  function selectAll() {
    const topics = {};
    const subs = {};
    Object.entries(topicMap).forEach(([topic, subtopics]) => {
      topics[topic] = true;
      subtopics.forEach(sub => { subs[`${topic}||${sub}`] = true; });
    });
    setSelectedTopics(topics);
    setSelectedSubtopics(subs);
  }

  function clearAll() {
    setSelectedTopics({});
    setSelectedSubtopics({});
  }

  function buildFocusString() {
    // Build human-readable focus string for API prompt
    const parts = [];
    Object.entries(topicMap).forEach(([topic, subs]) => {
      const selectedSubs = subs.filter(sub => selectedSubtopics[`${topic}||${sub}`]);
      if (selectedSubs.length === subs.length && selectedTopics[topic]) {
        parts.push(topic);
      } else if (selectedSubs.length > 0) {
        parts.push(`${topic} (${selectedSubs.join(", ")})`);
      }
    });
    return parts.length > 0 ? parts.join("; ") : null;
  }

  // ── Load questions ────────────────────────────────────────────────────────────
  async function startQuiz() {
    setScreen("quiz");
    setLoadingQ(true);
    setQuestions([]); setFlashcards([]);
    setCurrentQ(0); setFeedback(null); setUserAnswer("");
    setScore({ correct:0, total:0 });

    const { selectedSubs } = getSelectionSummary();
    const focusStr = buildFocusString();

    // Check bank first — only use bank when ≤2 specific subtopics selected (targeted)
    // or fall back to API with focus prompt
    const allTopicsSelected = Object.keys(topicMap).every(t => selectedTopics[t]);
    const noSpecificSubs = selectedSubs.length === 0;

    if (questionType === "flashcard") {
      // Try to assemble bank cards for selected subtopics
      const bankCards = getBankCardsForSelection();
      if (bankCards && bankCards.length >= 3) {
        setLoadingSource("bank");
        setFlashcards(shuffle(bankCards).slice(0, 12));
        setLoadingQ(false);
        return;
      }
      setLoadingSource("api");
      await fetchFromAPI("flashcard", focusStr);
    } else {
      const bankQs = getBankQuestionsForSelection(questionType);
      if (bankQs && bankQs.length >= 3) {
        setLoadingSource("bank");
        setQuestions(shuffle(bankQs).slice(0, 5));
        setLoadingQ(false);
        return;
      }
      setLoadingSource("api");
      await fetchFromAPI(questionType, focusStr);
    }
    setLoadingQ(false);
  }

  function getBankQuestionsForSelection(type) {
    const results = [];
    Object.entries(topicMap).forEach(([topic, subs]) => {
      subs.forEach(sub => {
        if (selectedSubtopics[`${topic}||${sub}`]) {
          const qs = SUBTOPIC_BANK?.[selectedSubject]?.[topic]?.[sub]?.[type];
          if (qs) results.push(...qs);
        }
      });
    });
    // Also check subject-level bank if whole topics selected
    if (results.length < 3) {
      const subjectBank = QUESTION_BANK?.[selectedSubject]?.[type];
      if (subjectBank) results.push(...subjectBank);
    }
    return results.length > 0 ? results : null;
  }

  function getBankCardsForSelection() {
    const results = [];
    Object.entries(topicMap).forEach(([topic, subs]) => {
      subs.forEach(sub => {
        if (selectedSubtopics[`${topic}||${sub}`]) {
          const cards = SUBTOPIC_BANK?.[selectedSubject]?.[topic]?.[sub]?.flashcard;
          if (cards) results.push(...cards);
        }
      });
    });
    if (results.length < 3) {
      const subjectCards = QUESTION_BANK?.[selectedSubject]?.flashcard;
      if (subjectCards) results.push(...subjectCards);
    }
    return results.length > 0 ? results : null;
  }

  async function fetchFromAPI(type, focusStr) {
    const focusLine = focusStr
      ? `Focus SPECIFICALLY on these topics/subtopics: ${focusStr}. All questions must be about these areas only.`
      : "";

    if (type === "flashcard") {
      const prompt = `You are a GCSE ${selectedSubject} teacher for ${selectedBoard}. Generate 12 flashcards covering key terms, concepts and definitions for GCSE level. ${focusLine}

Respond ONLY with a valid JSON array, no markdown, no backticks, no preamble:
[{"term":"Key term","definition":"Clear GCSE-level definition (2-3 sentences)","example":"Brief example or null"}]`;
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1800, messages:[{ role:"user", content:prompt }] }) });
        const data = await res.json();
        const text = data.content?.map(b=>b.text||"").join("").trim();
        setFlashcards(JSON.parse(text.replace(/```json|```/g,"").trim()));
      } catch { setFlashcards([{ term:"Failed to load", definition:"Please try again.", example:null }]); }
      return;
    }

    const configs = {
      short:{ label:"short answer (1-2 marks, single sentence answer)", marks:2 },
      mid:  { label:"structured response (3-5 marks, 2-3 developed points)", marks:4 },
      long: { label:"extended response (6-8 marks, full paragraph argument and evaluation)", marks:8 },
    };
    const cfg = configs[type];
    const prompt = `You are a GCSE ${selectedSubject} examiner for ${selectedBoard}. Generate 5 ${cfg.label} questions. ${focusLine}

Respond ONLY with a valid JSON array, no markdown, no backticks, no preamble:
[{"question":"Question text","answer":"Detailed model answer","marks":${cfg.marks},"hint":"Brief hint"}]`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1400, messages:[{ role:"user", content:prompt }] }) });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("").trim();
      setQuestions(JSON.parse(text.replace(/```json|```/g,"").trim()));
    } catch { setQuestions([{ question:"Failed to load questions. Please try again.", answer:"", marks:0, hint:"" }]); }
  }

  async function checkAnswer() {
    if (!userAnswer.trim()) return;
    const q = questions[currentQ];
    const typeLabel = { short:"short answer (1-2 marks)", mid:"structured response (3-5 marks)", long:"extended response (6-8 marks)" }[questionType];
    const prompt = `You are a GCSE ${selectedSubject} (${selectedBoard}) examiner.
Question type: ${typeLabel}
Question: ${q.question}
Model answer: ${q.answer}
Student answer: ${userAnswer}
Marks available: ${q.marks}
Assess rigorously. Respond ONLY with valid JSON, no backticks:
{"correct":true or false,"marksAwarded":number,"feedback":"2-3 sentence specific feedback","modelAnswer":"Ideal answer"}`;
    setFeedback({ loading:true });
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:500, messages:[{ role:"user", content:prompt }] }) });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("").trim();
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setFeedback(parsed);
      setScore(prev => ({ correct:prev.correct+(parsed.correct?1:0), total:prev.total+1 }));
    } catch { setFeedback({ correct:false, feedback:"Could not assess. Try again.", modelAnswer:questions[currentQ]?.answer, marksAwarded:0 }); }
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    const newMessages = [...chatMessages, { role:"user", content:msg }];
    setChatMessages(newMessages);
    setChatLoading(true);
    const context = selectedSubject ? `Student is studying GCSE ${selectedSubject} with ${selectedBoard}.` : "Student is preparing for GCSEs.";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:600, system:`You are a friendly, encouraging GCSE tutor. ${context} Give clear, accurate, exam-focused help. Keep responses concise and practical. Use UK English. Guide students to think rather than just giving full answers.`, messages:newMessages.map(m=>({role:m.role,content:m.content})) }) });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role:"assistant", content:data.content?.map(b=>b.text||"").join("")||"Sorry, try again." }]);
    } catch { setChatMessages(prev => [...prev, { role:"assistant", content:"Something went wrong. Please try again." }]); }
    setChatLoading(false);
  }

  function resetToTopics() {
    setScreen("topics");
    setFeedback(null); setUserAnswer(""); setQuestions([]); setFlashcards([]);
  }

  const filteredSubjects = board ? board.subjects.filter(s => s.toLowerCase().includes(subjectFilter.toLowerCase())) : [];
  const { hasAny, selectedSubs } = getSelectionSummary();
  const selectionCount = selectedSubs.length;

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",minHeight:"100vh",background:"#0f0f0f",color:"#fff"}}>

      {/* NAV */}
      <nav style={{background:"#161616",borderBottom:"1px solid #2a2a2a",padding:"0 24px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>{setScreen("home");setSelectedBoard(null);setSelectedSubject(null);setQuestionType(null);clearAll();}}>
          <div style={{width:32,height:32,background:"linear-gradient(135deg,#6c63ff,#e94560)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700}}>E</div>
          <span style={{fontSize:18,fontWeight:700,letterSpacing:"-0.5px"}}>Educate</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {selectedBoard && <span style={{fontSize:12,color:"#888",background:"#222",padding:"4px 12px",borderRadius:20,maxWidth:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selectedBoard}{selectedSubject?` · ${selectedSubject}`:""}</span>}
          {loadingSource==="bank" && screen==="quiz" && <span style={{fontSize:11,color:"#10b981",background:"rgba(16,185,129,0.1)",padding:"3px 10px",borderRadius:20}}>⚡ Instant</span>}
          {loadingSource==="api" && screen==="quiz" && <span style={{fontSize:11,color:"#8b5cf6",background:"rgba(139,92,246,0.1)",padding:"3px 10px",borderRadius:20}}>✦ AI Generated</span>}
          {score.total > 0 && questionType !== "flashcard" && <span style={{fontSize:12,color:"#52b788",background:"rgba(82,183,136,0.1)",padding:"4px 12px",borderRadius:20}}>{score.correct}/{score.total}</span>}
          <button onClick={()=>setChatOpen(p=>!p)} style={{background:chatOpen?"#6c63ff":"#222",border:"none",borderRadius:20,padding:"6px 16px",color:"#fff",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:6}}>
            <span>💬</span> AI Tutor
          </button>
        </div>
      </nav>

      <div style={{display:"flex",minHeight:"calc(100vh - 56px)"}}>
        <div style={{flex:1,padding:"32px",overflowY:"auto"}}>

          {/* HOME */}
          {screen==="home" && (
            <div>
              <div style={{textAlign:"center",marginBottom:48}}>
                <h1 style={{fontSize:42,fontWeight:800,margin:0,letterSpacing:"-1px",background:"linear-gradient(135deg,#fff 0%,#888 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Choose Your Exam Board</h1>
                <p style={{color:"#666",marginTop:8,fontSize:16}}>Select your GCSE examination board to get started</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20,maxWidth:800,margin:"0 auto"}}>
                {Object.entries(EXAM_BOARDS).map(([name,cfg]) => (
                  <div key={name} onClick={()=>{setSelectedBoard(name);setScreen("subjects");setSubjectFilter("");}}
                    style={{background:cfg.color,border:`2px solid ${cfg.accent}22`,borderRadius:20,padding:32,cursor:"pointer",transition:"all 0.2s",position:"relative",overflow:"hidden"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor=cfg.accent;e.currentTarget.style.boxShadow=`0 20px 40px ${cfg.accent}33`;}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=`${cfg.accent}22`;e.currentTarget.style.boxShadow="";}}>
                    <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,background:`${cfg.accent}11`,borderRadius:"50%"}}/>
                    <div style={{fontSize:32,fontWeight:900,letterSpacing:"-1px",color:"#fff",marginBottom:4}}>{cfg.logo}</div>
                    <div style={{fontSize:13,color:cfg.lightAccent,marginBottom:20}}>{cfg.tagline}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span style={{background:`${cfg.accent}33`,color:cfg.lightAccent,fontSize:12,padding:"4px 10px",borderRadius:10}}>{cfg.subjects.length} subjects</span>
                      <span style={{color:cfg.accent,fontSize:20}}>→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBJECTS */}
          {screen==="subjects" && board && (
            <div>
              <button onClick={()=>{setScreen("home");setSelectedBoard(null);}} style={{background:"none",border:"1px solid #333",color:"#888",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              <div style={{marginBottom:32}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <div style={{background:board.color,border:`1px solid ${board.accent}`,borderRadius:10,padding:"6px 14px",fontSize:16,fontWeight:800}}>{board.logo}</div>
                  <h2 style={{margin:0,fontSize:28,fontWeight:700}}>Select a Subject</h2>
                </div>
                <input value={subjectFilter} onChange={e=>setSubjectFilter(e.target.value)} placeholder="Filter subjects..."
                  style={{background:"#1e1e1e",border:"1px solid #333",borderRadius:10,padding:"10px 16px",color:"#fff",fontSize:14,width:280,outline:"none"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
                {filteredSubjects.map(subj => {
                  const hasPregen = !!(SUBTOPIC_BANK?.[subj] || QUESTION_BANK?.[subj]);
                  return (
                    <div key={subj} onClick={()=>{setSelectedSubject(subj);setScreen("questionType");clearAll();}}
                      style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:12,padding:"14px 16px",cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",gap:10}}
                      onMouseEnter={e=>{e.currentTarget.style.background=board.color;e.currentTarget.style.borderColor=board.accent;}}
                      onMouseLeave={e=>{e.currentTarget.style.background="#1a1a1a";e.currentTarget.style.borderColor="#2a2a2a";}}>
                      <span style={{fontSize:18,width:26,textAlign:"center"}}>{SUBJECT_ICONS[subj]||"📚"}</span>
                      <span style={{fontSize:13,fontWeight:500,flex:1}}>{subj}</span>
                      {hasPregen && <span style={{fontSize:9,color:"#10b981"}}>⚡</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION TYPE */}
          {screen==="questionType" && board && (
            <div style={{maxWidth:680,margin:"0 auto"}}>
              <button onClick={()=>setScreen("subjects")} style={{background:"none",border:"1px solid #333",color:"#888",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,marginBottom:32}}>← Back</button>
              <div style={{textAlign:"center",marginBottom:36}}>
                <span style={{fontSize:32}}>{SUBJECT_ICONS[selectedSubject]||"📚"}</span>
                <h2 style={{fontSize:28,fontWeight:700,margin:"8px 0 4px"}}>{selectedSubject}</h2>
                <span style={{color:"#666",fontSize:14}}>{selectedBoard}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {Q_TYPES.map(opt => (
                  <div key={opt.type} onClick={()=>{setQuestionType(opt.type);setScreen("topics");clearAll();}}
                    style={{background:"#1a1a1a",border:"2px solid #2a2a2a",borderRadius:16,padding:24,cursor:"pointer",transition:"all 0.2s",textAlign:"center"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=opt.color;e.currentTarget.style.background=`${opt.color}18`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#2a2a2a";e.currentTarget.style.background="#1a1a1a";}}>
                    <div style={{fontSize:34,marginBottom:10}}>{opt.icon}</div>
                    <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>{opt.label}</div>
                    <div style={{fontSize:11,color:opt.color,background:`${opt.color}22`,padding:"3px 10px",borderRadius:8,display:"inline-block",marginBottom:10}}>{opt.marks}</div>
                    <p style={{color:"#777",fontSize:12,lineHeight:1.6,margin:0}}>{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOPIC MULTI-SELECT */}
          {screen==="topics" && board && qTypeCfg && (
            <div style={{maxWidth:780,margin:"0 auto"}}>
              <button onClick={()=>setScreen("questionType")} style={{background:"none",border:"1px solid #333",color:"#888",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28,flexWrap:"wrap",gap:16}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <span style={{fontSize:22}}>{qTypeCfg.icon}</span>
                    <h2 style={{margin:0,fontSize:24,fontWeight:700}}>{selectedSubject} — {qTypeCfg.label}</h2>
                  </div>
                  <p style={{color:"#666",fontSize:14,margin:0}}>Select topics and subtopics to focus your practice. Tick a topic to select all its subtopics, or expand to pick individually.</p>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                  <button onClick={selectAll} style={{background:"#222",border:"1px solid #333",borderRadius:8,padding:"6px 14px",color:"#aaa",cursor:"pointer",fontSize:12}}>Select All</button>
                  <button onClick={clearAll} style={{background:"#222",border:"1px solid #333",borderRadius:8,padding:"6px 14px",color:"#aaa",cursor:"pointer",fontSize:12}}>Clear</button>
                </div>
              </div>

              {/* Topic list */}
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
                {Object.entries(topicMap).map(([topic, subtopics]) => {
                  const isExpanded = expandedTopics[topic];
                  const isTopicSelected = selectedTopics[topic];
                  const selectedSubCount = subtopics.filter(sub => selectedSubtopics[`${topic}||${sub}`]).length;
                  const partial = selectedSubCount > 0 && selectedSubCount < subtopics.length;
                  const hasBank = !!(SUBTOPIC_BANK?.[selectedSubject]?.[topic]);

                  return (
                    <div key={topic}>
                      {/* Topic row */}
                      <div style={{display:"flex",alignItems:"center",gap:0,background:"#1a1a1a",borderRadius:isExpanded?"12px 12px 0 0":"12px",border:`1px solid ${isTopicSelected||partial ? qTypeCfg.color+"66" : "#2a2a2a"}`,overflow:"hidden",transition:"all 0.15s"}}>

                        {/* Checkbox area */}
                        <div onClick={()=>toggleTopic(topic)} style={{display:"flex",alignItems:"center",justifyContent:"center",width:48,height:48,cursor:"pointer",flexShrink:0,borderRight:"1px solid #2a2a2a"}}>
                          <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${isTopicSelected ? qTypeCfg.color : partial ? qTypeCfg.color+"99" : "#444"}`,background:isTopicSelected ? qTypeCfg.color : "transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                            {isTopicSelected && <span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
                            {partial && !isTopicSelected && <div style={{width:8,height:2,background:qTypeCfg.color,borderRadius:1}}/>}
                          </div>
                        </div>

                        {/* Topic label */}
                        <div onClick={()=>toggleTopic(topic)} style={{flex:1,padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontWeight:600,fontSize:14}}>{topic}</span>
                          {selectedSubCount > 0 && <span style={{fontSize:11,color:qTypeCfg.color,background:`${qTypeCfg.color}22`,padding:"2px 8px",borderRadius:10}}>{selectedSubCount}/{subtopics.length}</span>}
                          {hasBank && <span style={{fontSize:9,color:"#10b981"}}>⚡</span>}
                        </div>

                        {/* Expand button */}
                        <button onClick={()=>toggleExpand(topic)} style={{background:"none",border:"none",color:"#555",cursor:"pointer",padding:"12px 16px",fontSize:14,flexShrink:0,transition:"transform 0.2s",transform:isExpanded?"rotate(90deg)":"rotate(0deg)"}}>›</button>
                      </div>

                      {/* Subtopics */}
                      {isExpanded && (
                        <div style={{background:"#141414",border:`1px solid ${isTopicSelected||partial ? qTypeCfg.color+"44" : "#222"}`,borderTop:"none",borderRadius:"0 0 12px 12px",padding:"8px 8px 8px 48px"}}>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6}}>
                            {subtopics.map(sub => {
                              const key = `${topic}||${sub}`;
                              const isSubSelected = selectedSubtopics[key];
                              const subHasBank = !!(SUBTOPIC_BANK?.[selectedSubject]?.[topic]?.[sub]);
                              return (
                                <div key={sub} onClick={()=>toggleSubtopic(topic,sub)}
                                  style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,cursor:"pointer",background:isSubSelected?`${qTypeCfg.color}15`:"transparent",border:`1px solid ${isSubSelected?qTypeCfg.color+"55":"transparent"}`,transition:"all 0.1s"}}
                                  onMouseEnter={e=>{if(!isSubSelected)e.currentTarget.style.background="#222";}}
                                  onMouseLeave={e=>{if(!isSubSelected)e.currentTarget.style.background="transparent";}}>
                                  <div style={{width:14,height:14,borderRadius:3,border:`2px solid ${isSubSelected?qTypeCfg.color:"#444"}`,background:isSubSelected?qTypeCfg.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.1s"}}>
                                    {isSubSelected && <span style={{color:"#fff",fontSize:9,fontWeight:700}}>✓</span>}
                                  </div>
                                  <span style={{fontSize:12,color:isSubSelected?"#fff":"#aaa",flex:1,lineHeight:1.3}}>{sub}</span>
                                  {subHasBank && <span style={{fontSize:8,color:"#10b981",flexShrink:0}}>⚡</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Start button */}
              <div style={{position:"sticky",bottom:0,background:"linear-gradient(to top,#0f0f0f 60%,transparent)",padding:"24px 0 8px"}}>
                {!hasAny && (
                  <p style={{textAlign:"center",color:"#555",fontSize:13,marginBottom:12}}>Select at least one topic or subtopic to begin</p>
                )}
                <button onClick={startQuiz} disabled={!hasAny}
                  style={{width:"100%",background:hasAny?qTypeCfg.color:"#222",border:"none",borderRadius:14,padding:"16px 0",color:"#fff",fontWeight:700,fontSize:16,cursor:hasAny?"pointer":"not-allowed",opacity:hasAny?1:0.5,transition:"all 0.2s"}}>
                  {hasAny ? `Start ${qTypeCfg.label} — ${selectionCount} subtopic${selectionCount!==1?"s":""} selected` : "Select topics to begin"}
                </button>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {screen==="quiz" && board && (
            <div style={{maxWidth:700,margin:"0 auto"}}>

              {questionType!=="flashcard" && (
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
                  <button onClick={resetToTopics} style={{background:"none",border:"1px solid #333",color:"#888",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13}}>← Change Topics</button>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:12,color:"#666"}}>{selectedSubject} · {selectedBoard}</span>
                    {!loadingQ && questions.length>0 && <span style={{background:"#222",borderRadius:20,padding:"4px 14px",fontSize:12,color:"#aaa"}}>{currentQ+1}/{questions.length}</span>}
                  </div>
                </div>
              )}

              {loadingQ ? (
                <div style={{textAlign:"center",padding:"80px 0"}}>
                  <div style={{fontSize:36,marginBottom:16}}>{questionType==="flashcard"?"🃏":"📋"}</div>
                  <p style={{color:"#666",fontSize:15}}>Generating your {qTypeCfg?.label.toLowerCase()}...</p>
                </div>
              ) : questionType==="flashcard" && flashcards.length>0 ? (
                <FlashcardDeck cards={flashcards} board={board} onBack={resetToTopics} onNewDeck={startQuiz} setChatOpen={setChatOpen} setChatInput={setChatInput}/>
              ) : questions.length>0 ? (
                <div>
                  <div style={{background:"#222",borderRadius:4,height:4,marginBottom:28,overflow:"hidden"}}>
                    <div style={{height:"100%",background:qTypeCfg?.color||board.accent,width:`${((currentQ+1)/questions.length)*100}%`,transition:"width 0.3s"}}/>
                  </div>

                  <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:28,marginBottom:20}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                      <span style={{background:`${qTypeCfg?.color||board.accent}22`,color:qTypeCfg?.color||board.lightAccent,fontSize:12,padding:"3px 10px",borderRadius:8}}>
                        {qTypeCfg?.label} · {questions[currentQ]?.marks||0} marks
                      </span>
                    </div>
                    <p style={{fontSize:17,lineHeight:1.75,margin:0,fontWeight:500}}>{questions[currentQ]?.question}</p>
                  </div>

                  {!feedback ? (
                    <div>
                      <textarea value={userAnswer} onChange={e=>setUserAnswer(e.target.value)}
                        placeholder={questionType==="short"?"Type your answer (1–2 sentences)...":questionType==="mid"?"Write 2–3 developed points with clear explanation...":"Full paragraph — argument, evidence and evaluation..."}
                        style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:12,padding:16,color:"#fff",fontSize:14,lineHeight:1.7,minHeight:questionType==="short"?80:questionType==="mid"?150:220,resize:"vertical",outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}
                        onFocus={e=>e.target.style.borderColor=qTypeCfg?.color||board.accent}
                        onBlur={e=>e.target.style.borderColor="#333"}
                      />
                      <div style={{display:"flex",gap:10,marginTop:12}}>
                        <button onClick={checkAnswer} disabled={!userAnswer.trim()}
                          style={{flex:1,background:qTypeCfg?.color||board.accent,border:"none",borderRadius:10,padding:"12px 0",color:"#fff",fontWeight:700,fontSize:15,cursor:userAnswer.trim()?"pointer":"not-allowed",opacity:userAnswer.trim()?1:0.5}}>
                          Check Answer
                        </button>
                        <button onClick={()=>{setChatOpen(true);setChatInput(`I'm doing a ${selectedSubject} question: "${questions[currentQ]?.question}" — can you give me a hint without giving the full answer?`);}}
                          style={{background:"#222",border:"1px solid #333",borderRadius:10,padding:"12px 16px",color:"#888",cursor:"pointer",fontSize:13}}>
                          💬 Hint
                        </button>
                      </div>
                    </div>
                  ) : feedback.loading ? (
                    <div style={{textAlign:"center",padding:32,background:"#1a1a1a",borderRadius:12}}>
                      <p style={{color:"#666"}}>Assessing your answer...</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{background:feedback.correct?"rgba(82,183,136,0.1)":"rgba(233,69,96,0.1)",border:`1px solid ${feedback.correct?"#52b788":"#e94560"}`,borderRadius:12,padding:20,marginBottom:16}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                          <span style={{fontSize:22}}>{feedback.correct?"✅":"❌"}</span>
                          <span style={{fontWeight:700,fontSize:16,color:feedback.correct?"#52b788":"#e94560"}}>{feedback.correct?"Correct!":"Not quite right"}</span>
                          <span style={{marginLeft:"auto",background:feedback.correct?"rgba(82,183,136,0.2)":"rgba(233,69,96,0.2)",color:feedback.correct?"#52b788":"#e94560",fontSize:13,padding:"2px 10px",borderRadius:8}}>
                            {feedback.marksAwarded}/{questions[currentQ]?.marks} marks
                          </span>
                        </div>
                        <p style={{color:"#ccc",fontSize:14,lineHeight:1.7,margin:"0 0 12px"}}>{feedback.feedback}</p>
                        <div style={{background:"#0f0f0f",borderRadius:8,padding:14}}>
                          <p style={{color:"#888",fontSize:11,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Model Answer</p>
                          <p style={{color:"#ddd",fontSize:14,lineHeight:1.7,margin:0}}>{feedback.modelAnswer}</p>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:10}}>
                        {currentQ < questions.length-1 ? (
                          <button onClick={()=>{setCurrentQ(p=>p+1);setUserAnswer("");setFeedback(null);}}
                            style={{flex:1,background:board.accent,border:"none",borderRadius:10,padding:12,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>
                            Next Question →
                          </button>
                        ) : (
                          <div style={{flex:1,background:"rgba(82,183,136,0.1)",border:"1px solid #52b788",borderRadius:10,padding:16,textAlign:"center"}}>
                            <p style={{color:"#52b788",fontWeight:700,margin:0}}>🎉 Done! {score.correct}/{questions.length} correct</p>
                          </div>
                        )}
                        <button onClick={startQuiz} style={{background:"#222",border:"1px solid #333",borderRadius:10,padding:"12px 16px",color:"#888",cursor:"pointer",fontSize:13}}>New Set</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* CHAT PANEL */}
        {chatOpen && (
          <div style={{width:340,background:"#161616",borderLeft:"1px solid #2a2a2a",display:"flex",flexDirection:"column",height:"calc(100vh - 56px)",position:"sticky",top:56,flexShrink:0}}>
            <div style={{padding:"14px 20px",borderBottom:"1px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:30,height:30,background:"linear-gradient(135deg,#6c63ff,#e94560)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🎓</div>
                <div>
                  <p style={{margin:0,fontWeight:600,fontSize:13}}>AI Tutor</p>
                  <p style={{margin:0,fontSize:10,color:"#52b788"}}>● Online</p>
                </div>
              </div>
              <button onClick={()=>setChatOpen(false)} style={{background:"none",border:"none",color:"#666",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
              {chatMessages.map((msg,i) => (
                <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"90%",background:msg.role==="user"?"#6c63ff":"#222",borderRadius:msg.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"9px 13px",fontSize:12,lineHeight:1.6,color:"#fff",whiteSpace:"pre-wrap"}}>{msg.content}</div>
                </div>
              ))}
              {chatLoading && (
                <div style={{display:"flex",gap:4,padding:"9px 13px",background:"#222",borderRadius:"14px 14px 14px 4px",width:"fit-content"}}>
                  {[0,1,2].map(i=><div key={i} style={{width:5,height:5,background:"#666",borderRadius:"50%",animation:`bounce 1s ${i*0.2}s infinite`}}/>)}
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>
            <div style={{padding:"10px 14px",borderTop:"1px solid #2a2a2a",display:"flex",gap:8}}>
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()}
                placeholder="Ask your AI tutor..."
                style={{flex:1,background:"#1e1e1e",border:"1px solid #333",borderRadius:10,padding:"9px 13px",color:"#fff",fontSize:12,outline:"none"}}
                onFocus={e=>e.target.style.borderColor="#6c63ff"}
                onBlur={e=>e.target.style.borderColor="#333"}
              />
              <button onClick={sendChat} disabled={chatLoading||!chatInput.trim()}
                style={{background:"#6c63ff",border:"none",borderRadius:10,width:38,cursor:chatInput.trim()?"pointer":"not-allowed",opacity:chatInput.trim()?1:0.5,color:"#fff",fontSize:15}}>↑</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        textarea::placeholder{color:#444}
        input::placeholder{color:#444}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:4px}
      `}</style>
    </div>
  );
}
