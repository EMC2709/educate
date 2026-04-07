import type { Question } from '@/types';

export const combinedSciencePastPaper: Question[] = [
  {
    topic: "Biology",
    question: "Describe the process of mitosis and explain why it is important for growth and repair in organisms.",
    answer: "Before mitosis, the cell replicates its DNA so each chromosome is copied. The cell then divides in a series of stages: the chromosomes line up along the centre of the cell, spindle fibres pull the chromatids apart to opposite poles, and the cytoplasm divides (cytokinesis) to form two genetically identical daughter cells. Each daughter cell has the same number of chromosomes as the parent cell (diploid).\n\nMitosis is important for growth — organisms grow by increasing their cell number. It is also important for repair — damaged or worn cells are replaced by identical copies. Asexual reproduction also relies on mitosis.\n\nMark scheme:\n• DNA replication occurs before division — 1 mark\n• Chromosomes separate / pulled to opposite poles — 1 mark\n• Two genetically identical daughter cells produced — 1 mark\n• Importance for growth and repair explained — 1 mark",
    marks: 4,
    hint: "Describe what happens to the DNA before and during division. How many cells are produced and are they identical? Why does the body need this process?",
  },
  {
    topic: "Biology",
    question: "Explain how the lungs are adapted for efficient gas exchange.",
    answer: "The lungs contain millions of alveoli which provide a very large surface area for gas exchange. The alveolar walls are very thin (one cell thick), giving a short diffusion distance for oxygen and carbon dioxide. Each alveolus is surrounded by a dense network of blood capillaries which maintains a steep concentration gradient by continuously carrying oxygenated blood away and bringing deoxygenated blood. The moist lining of the alveoli allows gases to dissolve, facilitating diffusion. Good ventilation (breathing) also maintains the concentration gradient by bringing fresh air into the alveoli.\n\nMark scheme:\n• Large surface area (millions of alveoli) — 1 mark\n• Thin walls / short diffusion distance — 1 mark\n• Rich blood supply / maintains concentration gradient — 1 mark\n• Moist lining / ventilation maintains gradient — 1 mark",
    marks: 4,
    hint: "Think about the four features that make any gas exchange surface efficient: surface area, diffusion distance, concentration gradient, and moisture.",
  },
  {
    topic: "Chemistry",
    question: "Describe the structure of an ionic compound such as sodium chloride (NaCl) and explain why it has a high melting point.\n\nExplain why sodium chloride conducts electricity when molten but not when solid.",
    answer: "Sodium chloride has a giant ionic lattice structure. Sodium atoms lose one electron to form Na⁺ ions and chlorine atoms gain one electron to form Cl⁻ ions. These oppositely charged ions are held together by strong electrostatic forces of attraction (ionic bonds) in a regular repeating 3D arrangement.\n\nHigh melting point: There are many strong ionic bonds in all directions throughout the lattice. A large amount of energy is needed to overcome these strong electrostatic attractions, resulting in a high melting point (801°C).\n\nConductivity: In solid NaCl, the ions are held in fixed positions in the lattice and cannot move, so it cannot conduct electricity. When molten, the ionic bonds are broken and the ions are free to move throughout the liquid. These mobile ions can carry charge, allowing molten NaCl to conduct electricity.\n\nMark scheme:\n• Giant ionic lattice / regular arrangement — 1 mark\n• Strong electrostatic attraction between oppositely charged ions — 1 mark\n• Many strong bonds need lots of energy to break — 1 mark\n• Solid: ions fixed in position, cannot conduct — 1 mark\n• Molten: ions free to move, can carry charge — 1 mark\n• Clear link between ion mobility and electrical conductivity — 1 mark",
    marks: 6,
    hint: "Describe the lattice structure and bonding first, then link to melting point. For conductivity, think about what needs to move to carry electrical charge, and whether ions can move in each state.",
  },
  {
    topic: "Chemistry",
    question: "Balance the following equation and calculate the mass of magnesium oxide produced when 2.4 g of magnesium reacts completely with oxygen.\n\n_Mg + _O₂ → _MgO\n\n(Relative atomic masses: Mg = 24, O = 16)",
    answer: "Balanced equation: 2Mg + O₂ → 2MgO\n\nMr of Mg = 24\nMr of MgO = 24 + 16 = 40\n\nMoles of Mg = 2.4 / 24 = 0.1 mol\nFrom equation: 2 mol Mg produces 2 mol MgO (1:1 ratio)\nSo moles of MgO = 0.1 mol\n\nMass of MgO = 0.1 × 40 = 4.0 g\n\nMark scheme:\n• Correctly balanced equation — 1 mark\n• Correct moles of Mg (0.1) — 1 mark\n• Correct ratio identified (1:1) — 1 mark\n• Correct mass of MgO (4.0 g) — 1 mark",
    marks: 4,
    hint: "Balance the equation first. Then calculate moles of magnesium, use the mole ratio from the balanced equation, and convert moles of product to mass.",
  },
  {
    topic: "Physics",
    question: "A student connects a 6 V battery to a 3 Ω resistor.\n\n(a) Calculate the current through the resistor. (2 marks)\n\n(b) Calculate the power dissipated by the resistor. (2 marks)\n\n(c) The resistor is left on for 5 minutes. Calculate the energy transferred. (2 marks)",
    answer: "(a) I = V / R = 6 / 3 = 2 A\n\n(b) P = IV = 2 × 6 = 12 W (or P = V²/R = 36/3 = 12 W)\n\n(c) Time = 5 × 60 = 300 s\nE = Pt = 12 × 300 = 3600 J\n\nMark scheme:\n(a)\n• Correct use of I = V/R — 1 mark\n• Correct answer 2 A — 1 mark\n(b)\n• Correct use of P = IV or P = V²/R — 1 mark\n• Correct answer 12 W — 1 mark\n(c)\n• Correct time conversion to seconds (300 s) — 1 mark\n• Correct answer 3600 J — 1 mark",
    marks: 6,
    hint: "(a) Use Ohm's law V = IR. (b) Use P = IV or P = V²/R. (c) Convert time to seconds first, then use E = Pt.",
  },
  {
    topic: "Physics",
    question: "Explain the difference between elastic and inelastic deformation.\n\nA spring has a spring constant of 40 N/m. Calculate the extension when a force of 10 N is applied.",
    answer: "Elastic deformation: The object returns to its original shape and size when the force is removed. No permanent change occurs. This happens when the elastic limit is not exceeded.\n\nInelastic deformation: The object does not return to its original shape when the force is removed. A permanent change in shape occurs. This happens when the elastic limit is exceeded.\n\nExtension calculation:\nF = ke, so e = F / k = 10 / 40 = 0.25 m\n\nMark scheme:\n• Elastic: returns to original shape — 1 mark\n• Inelastic: permanently deformed — 1 mark\n• Correct rearrangement of F = ke — 1 mark\n• Correct answer 0.25 m — 1 mark",
    marks: 4,
    hint: "Think about what happens when you stretch a spring gently vs. too far. For the calculation, rearrange F = ke to find extension.",
  },
];
