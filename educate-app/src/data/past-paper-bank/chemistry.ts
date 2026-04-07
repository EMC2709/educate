import type { Question } from '@/types';

export const chemistryPastPaper: Question[] = [
  {
    topic: "Atomic Structure",
    question: "An atom of sodium has the electronic structure 2, 8, 1.\n\n(a) State the number of protons, neutrons and electrons in a sodium atom (²³Na, atomic number 11). (2 marks)\n\n(b) Explain why a sodium ion (Na⁺) has a different electronic structure from a sodium atom. (2 marks)",
    answer: "(a) Protons: 11, Neutrons: 12 (23 − 11), Electrons: 11\n\n(b) A sodium atom loses one electron from its outer shell to form a sodium ion (Na⁺). This gives it a full outer shell (2, 8) which is a stable electronic configuration. The ion has 11 protons but only 10 electrons, giving it an overall positive charge.\n\nMark scheme:\n(a)\n• Correct protons and electrons (11 each) — 1 mark\n• Correct neutrons (12) — 1 mark\n(b)\n• Loses one electron — 1 mark\n• Achieves stable/full outer shell configuration — 1 mark",
    marks: 4,
    hint: "(a) Atomic number = protons = electrons. Mass number − atomic number = neutrons. (b) Think about what happens to the outer electron when sodium forms an ion.",
  },
  {
    topic: "Bonding & Structure",
    question: "Diamond and graphite are both forms of carbon.\n\nExplain, in terms of structure and bonding, why diamond is hard and has a very high melting point, while graphite is soft and can conduct electricity.",
    answer: "Diamond: Each carbon atom is covalently bonded to four other carbon atoms in a giant covalent (macromolecular) structure forming a rigid tetrahedral lattice. Many strong covalent bonds must be broken to melt or break diamond, which requires a large amount of energy — hence the very high melting point and extreme hardness. There are no free electrons or ions, so diamond does not conduct electricity.\n\nGraphite: Each carbon atom is covalently bonded to three other carbon atoms, forming flat hexagonal layers. The fourth outer electron on each carbon is delocalised (free to move) between the layers. These delocalised electrons allow graphite to conduct electricity. The layers are held together by weak intermolecular forces (van der Waals forces), which allow layers to slide over each other — making graphite soft and slippery.\n\nMark scheme:\n• Diamond: four covalent bonds per atom / tetrahedral — 1 mark\n• Giant covalent structure / many strong bonds to break — 1 mark\n• Graphite: three covalent bonds per atom / layers — 1 mark\n• Weak forces between layers allow sliding — 1 mark\n• Delocalised electrons in graphite conduct electricity — 1 mark\n• Comparison or contrast clearly drawn — 1 mark",
    marks: 6,
    hint: "For each substance, describe the bonding within the structure and between layers (if applicable). Link the structure to each physical property asked about.",
  },
  {
    topic: "Quantitative Chemistry",
    question: "Calcium carbonate reacts with hydrochloric acid:\n\nCaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂\n\nCalculate the mass of calcium chloride produced when 10.0 g of calcium carbonate reacts with excess hydrochloric acid.\n\n(Relative atomic masses: Ca = 40, C = 12, O = 16, Cl = 35.5, H = 1)",
    answer: "Mr of CaCO₃ = 40 + 12 + (3 × 16) = 100\nMr of CaCl₂ = 40 + (2 × 35.5) = 111\n\nMoles of CaCO₃ = 10.0 ÷ 100 = 0.1 mol\nFrom the equation: 1 mol CaCO₃ produces 1 mol CaCl₂\nSo moles of CaCl₂ = 0.1 mol\n\nMass of CaCl₂ = 0.1 × 111 = 11.1 g\n\nMark scheme:\n• Correct Mr of CaCO₃ (100) — 1 mark\n• Correct Mr of CaCl₂ (111) — 1 mark\n• Correct moles of CaCO₃ (0.1) — 1 mark\n• Correct final mass (11.1 g) — 1 mark",
    marks: 4,
    hint: "Calculate the relative formula masses first. Then find moles of reactant, use the equation ratio to find moles of product, and convert back to mass.",
  },
  {
    topic: "Chemical Changes",
    question: "Describe what happens during the electrolysis of molten lead bromide (PbBr₂).\n\nInclude the products formed at each electrode and write half equations for the reactions.",
    answer: "When molten, lead bromide dissociates into Pb²⁺ ions and Br⁻ ions which are free to move. During electrolysis:\n\nAt the cathode (negative electrode): Lead ions are attracted, gain electrons and are reduced to form molten lead metal.\nHalf equation: Pb²⁺ + 2e⁻ → Pb\n\nAt the anode (positive electrode): Bromide ions are attracted, lose electrons and are oxidised to form bromine gas.\nHalf equation: 2Br⁻ → Br₂ + 2e⁻\n\nMark scheme:\n• Ions free to move when molten — 1 mark\n• Lead formed at cathode — 1 mark\n• Correct cathode half equation — 1 mark\n• Bromine formed at anode — 1 mark\n• Correct anode half equation — 1 mark\n• Correct use of reduction/oxidation terminology — 1 mark",
    marks: 6,
    hint: "Remember: positive ions move to the negative electrode (cathode) and negative ions move to the positive electrode (anode). Reduction occurs at the cathode, oxidation at the anode (OILRIG).",
  },
  {
    topic: "Energy Changes",
    question: "Explain, in terms of bond breaking and bond making, why the reaction between hydrogen and chlorine is exothermic.\n\nH₂ + Cl₂ → 2HCl\n\nBond energies: H–H = 436 kJ/mol, Cl–Cl = 242 kJ/mol, H–Cl = 431 kJ/mol",
    answer: "Energy required to break bonds (endothermic):\n1 × H–H = 436 kJ/mol\n1 × Cl–Cl = 242 kJ/mol\nTotal energy in = 436 + 242 = 678 kJ/mol\n\nEnergy released in making bonds (exothermic):\n2 × H–Cl = 2 × 431 = 862 kJ/mol\nTotal energy out = 862 kJ/mol\n\nOverall energy change = 678 − 862 = −184 kJ/mol\n\nThe reaction is exothermic because more energy is released making new bonds than is required to break the old bonds.\n\nMark scheme:\n• Correct energy to break bonds (678 kJ/mol) — 1 mark\n• Correct energy released making bonds (862 kJ/mol) — 1 mark\n• Correct overall energy change (−184 kJ/mol) — 1 mark\n• Explanation: more energy released than absorbed = exothermic — 1 mark",
    marks: 4,
    hint: "Calculate the total energy needed to break all bonds in reactants, then the total energy released when making all bonds in products. If more energy is released than absorbed, the reaction is exothermic.",
  },
  {
    topic: "Organic Chemistry",
    question: "Describe a chemical test you could use to distinguish between hexane (an alkane) and hexene (an alkene).\n\nState what you would observe with each substance.",
    answer: "Add bromine water (orange/brown) to each substance and shake.\n\nHexene (alkene): The bromine water is decolourised (turns from orange to colourless). This is because the C=C double bond in hexene reacts with bromine in an addition reaction.\n\nHexane (alkane): The bromine water remains orange. Alkanes are saturated (only single bonds) and do not react with bromine water under these conditions.\n\nMark scheme:\n• Correct test reagent (bromine water) — 1 mark\n• Correct observation for hexene (decolourised) — 1 mark",
    marks: 2,
    hint: "Think about which type of hydrocarbon has a double bond and which reagent tests for unsaturation.",
  },
  {
    topic: "Chemical Analysis",
    question: "A student has a solution that may contain sulfate ions.\n\nDescribe the test the student should carry out and the expected result if sulfate ions are present.",
    answer: "Add dilute hydrochloric acid to the solution (to remove any carbonate ions that might give a false positive), then add barium chloride solution.\n\nIf sulfate ions are present, a white precipitate of barium sulfate (BaSO₄) will form.\n\nBa²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)\n\nMark scheme:\n• Add hydrochloric acid then barium chloride — 1 mark\n• White precipitate observed — 1 mark",
    marks: 2,
    hint: "Which reagent produces an insoluble precipitate with sulfate ions? What acid is added first and why?",
  },
  {
    topic: "Atmosphere",
    question: "Describe how the composition of the Earth's early atmosphere changed over time to produce the atmosphere we have today.\n\nExplain the role of photosynthetic organisms in this process.",
    answer: "The early atmosphere was mainly carbon dioxide (similar to Venus and Mars today) with little or no oxygen, plus water vapour, nitrogen and small amounts of methane and ammonia. As the Earth cooled, water vapour condensed to form the oceans.\n\nCO₂ dissolved in the oceans, reducing atmospheric CO₂. Marine organisms used dissolved CO₂ to make calcium carbonate shells, which became sedimentary rocks (limestone) when organisms died. CO₂ was also locked into fossil fuels.\n\nPhotosynthetic organisms (first cyanobacteria, then algae and plants) evolved and used CO₂ for photosynthesis, producing oxygen as a by-product:\n6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n\nOver billions of years, oxygen levels gradually increased to the current 21%, while CO₂ decreased. Nitrogen built up as it is unreactive and was released by volcanic activity and denitrifying bacteria.\n\nMark scheme:\n• Early atmosphere mostly CO₂ — 1 mark\n• CO₂ dissolved in oceans / locked in rocks and fossil fuels — 1 mark\n• Photosynthetic organisms produced oxygen — 1 mark\n• Oxygen increased over time / CO₂ decreased — 1 mark\n• Reference to formation of sedimentary rocks from shells — 1 mark\n• Nitrogen accumulated as unreactive gas — 1 mark",
    marks: 6,
    hint: "Start with the early atmosphere, then describe how each main gas changed. Photosynthesis is the key process that added oxygen and removed CO₂.",
  },
];
