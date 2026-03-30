import type { SubtopicContent } from '@/types';

export const chemistrySubtopics: Record<string, Record<string, SubtopicContent>> = {
  "Atomic Structure & the Periodic Table": {
    "Atomic Model & Subatomic Particles": {
      short: [
        { question: "An atom of carbon-14 has atomic number 6. How many neutrons does it have?", answer: "Mass number \u2212 atomic number = 14 \u2212 6 = 8 neutrons", marks: 1, hint: "Neutrons = mass number \u2212 proton number" },
        { question: "Who proposed the nuclear model of the atom and what evidence supported it?", answer: "Ernest Rutherford proposed the nuclear model, based on his gold foil alpha particle scattering experiment. Most particles passed straight through (atom is mostly empty), some deflected (positive nucleus), and a few bounced back (small, dense nucleus).", marks: 2, hint: "Rutherford \u2014 gold foil experiment \u2014 three observations" },
      ],
      mid: [
        { question: "Describe how the atomic model has changed from Dalton to the modern model, including the evidence that caused each change.", answer: "Dalton (1803): Atoms are tiny indivisible spheres. Thomson (1897): Discovery of electrons via cathode rays \u2192 plum pudding model (positive sphere, embedded electrons). Rutherford (1911): Alpha scattering experiment \u2192 nuclear model (positive nucleus, electrons around it). Bohr (1913): Emission spectra evidence \u2192 electrons in fixed orbits (shells) at specific energy levels. Modern quantum model: electrons exist in probability clouds (orbitals), not fixed paths. Each model was revised when new experimental evidence contradicted it.", marks: 4, hint: "Cover each model in sequence: Dalton \u2192 Thomson (plum pudding) \u2192 Rutherford (nuclear) \u2192 Bohr (shells) \u2192 quantum. State evidence for each change." },
      ],
      long: [
        { question: "Explain how the periodic table is organised and why elements in the same group have similar chemical properties.", answer: "The modern periodic table arranges elements in order of increasing atomic number. Periods (horizontal rows) represent the energy level (shell) being filled \u2014 Period 1 fills shell 1, Period 2 fills shell 2, etc. Groups (vertical columns) contain elements with the same number of outer shell electrons. Chemical properties are determined by the number and arrangement of outer electrons \u2014 this is why Group 1 metals all have 1 outer electron and react similarly (with water, producing hydrogen and a hydroxide). Group 7 halogens all have 7 outer electrons and readily gain one electron (oxidising agents). Group 0 (noble gases) have full outer shells \u2014 very stable, unreactive. Mendeleev's contribution: arranged by atomic mass, left gaps for undiscovered elements (predicted their properties). Modern table: ordered by atomic number (Moseley, 1913), resolving anomalies.", marks: 6, hint: "Explain periods (shells being filled), groups (same outer electrons \u2192 same properties). Give specific group examples. Include Mendeleev's contribution and the modern arrangement." },
      ],
      flashcard: [
        { term: "Atomic Structure", definition: "Protons (positive, mass 1) and neutrons (neutral, mass 1) in nucleus. Electrons (negative, negligible mass) in shells. Atomic number = protons. Mass number = protons + neutrons. Neutral atom: protons = electrons.", example: "Carbon: atomic no. 6, mass no. 12 \u2192 6p, 6n, 6e. Carbon-14: 6p, 8n, 6e" },
        { term: "Isotopes", definition: "Atoms of the same element with the same number of protons but different numbers of neutrons. Same atomic number, different mass number. Same chemical properties (same electrons). Different physical properties (different mass).", example: "\u00b9\u00b2C and \u00b9\u2074C: both have 6 protons; 14C has 8 neutrons vs 12C's 6" },
        { term: "Electronic Configuration", definition: "Electrons fill shells in order: shell 1 (max 2), shell 2 (max 8), shell 3 (max 8 for first 20 elements). Written as e.g. 2,8,1 for sodium. The outer shell electrons (valence electrons) determine reactivity.", example: "Na (11): 2,8,1 \u2014 1 outer electron \u2192 Group 1. Cl (17): 2,8,7 \u2014 7 outer electrons \u2192 Group 7" },
      ],
    },
    "The Periodic Table & Groups": {
      short: [
        { question: "Why does reactivity decrease down Group 7 (halogens)?", answer: "Down the group, atoms have more electron shells, so the outer shell is further from the nucleus. There is more electron shielding. The attraction of the nucleus for an incoming electron is weaker, so it is harder to gain an electron. Reactivity decreases.", marks: 2, hint: "More shells = more shielding = weaker attraction for incoming electron" },
        { question: "State the trend in boiling point of Group 1 elements as you go down the group.", answer: "Boiling point decreases down Group 1. The atoms get larger and the metallic bonds become weaker.", marks: 2, hint: "Think about how atomic size affects metallic bond strength" },
      ],
      mid: [
        { question: "Chlorine displaces bromine from potassium bromide solution. Write the ionic equation and explain the reaction in terms of electron gain/loss.", answer: "Cl\u2082 + 2KBr \u2192 2KCl + Br\u2082. Ionic equation: Cl\u2082 + 2Br\u207b \u2192 2Cl\u207b + Br\u2082. Chlorine is a more reactive halogen \u2014 it gains electrons more easily than bromine. Each Cl atom gains 1 electron (reduced). Each Br\u207b ion loses 1 electron (oxidised). This is a redox displacement reaction.", marks: 4, hint: "Write the equation, then the ionic equation, then explain in terms of oxidation/reduction and relative reactivity" },
      ],
      long: [
        { question: "Compare the properties and reactions of Group 1 alkali metals, explaining trends in terms of atomic structure. Include reactions with water and oxygen.", answer: "Group 1: Li, Na, K, Rb, Cs, Fr. All have 1 outer electron \u2192 readily lose it to form 1+ ions. React with water: 2M + 2H\u2082O \u2192 2MOH + H\u2082. Lithium floats, fizzes slowly. Sodium melts into a ball, moves rapidly, may ignite. Potassium ignites immediately with lilac flame. Trend: reactivity increases down group. Reason: increasing atomic radius \u2192 outer electron further from nucleus \u2192 more electron shielding \u2192 easier to lose electron \u2192 lower ionisation energy. React with oxygen: 4Li + O\u2082 \u2192 2Li\u2082O (lithium oxide). 4Na + O\u2082 \u2192 2Na\u2082O (but also forms Na\u2082O\u2082). K forms KO\u2082. All form white/pale ionic oxides. All are soft, low density metals with low melting points (decrease down group as metallic bonds weaker). Store under oil \u2014 react with moisture and air.", marks: 7, hint: "Cover: electronic structure justification of 1+ ion, water reactions with observations for Li/Na/K, trend in reactivity with atomic structure explanation, oxygen reactions, physical properties and trends" },
      ],
      flashcard: [
        { term: "Group 1 \u2014 Alkali Metals", definition: "Li, Na, K, Rb, Cs. All have 1 outer electron \u2014 lose it to form M\u207a ions. React with water \u2192 metal hydroxide + hydrogen. Reactivity increases down group (outer electron easier to remove as shielding increases). Soft, low density, low melting points.", example: "2Na + 2H\u2082O \u2192 2NaOH + H\u2082 (fizzes rapidly, may ignite)" },
        { term: "Group 7 \u2014 Halogens", definition: "F, Cl, Br, I, At. All have 7 outer electrons \u2014 gain one to form X\u207b ions. More reactive halogens displace less reactive ones from solutions. Reactivity decreases down group. Exist as diatomic molecules (F\u2082, Cl\u2082, etc.). Colours: F\u2082 yellow, Cl\u2082 green, Br\u2082 orange-brown, I\u2082 grey/purple.", example: "Cl\u2082 + 2KI \u2192 2KCl + I\u2082 (Cl more reactive, displaces I)" },
        { term: "Transition Metals", definition: "Between Groups 2 and 3 in the periodic table. Properties: high melting points, high density, good conductors, often form coloured compounds, can have variable oxidation states, act as catalysts (e.g. Fe in Haber, V\u2082O\u2085 in Contact process).", example: "Iron: Fe\u00b2\u207a (green) and Fe\u00b3\u207a (orange-brown). Copper: Cu\u00b2\u207a (blue)" },
      ],
    },
  },
  "Quantitative Chemistry": {
    "Moles & Mr": {
      short: [
        { question: "Calculate the number of moles in 11g of CO\u2082. (Ar: C=12, O=16)", answer: "Mr of CO\u2082 = 12+(2\u00d716) = 44. Moles = 11/44 = 0.25 mol", marks: 2, hint: "Moles = mass \u00f7 relative formula mass" },
        { question: "What mass of sodium hydroxide (NaOH) is needed to make 250cm\u00b3 of a 2mol/dm\u00b3 solution? (Ar: Na=23, O=16, H=1)", answer: "Moles = 2 \u00d7 0.25 = 0.5 mol. Mr(NaOH) = 40. Mass = 0.5 \u00d7 40 = 20g", marks: 3, hint: "Convert cm\u00b3 to dm\u00b3 first (\u00f71000). Moles = conc \u00d7 vol. Mass = moles \u00d7 Mr" },
      ],
      mid: [
        { question: "25cm\u00b3 of 0.1mol/dm\u00b3 HCl reacts with NaOH solution. 18.5cm\u00b3 of NaOH is needed to neutralise. Calculate the concentration of the NaOH.", answer: "Moles HCl = 0.1 \u00d7 0.025 = 0.0025 mol. HCl + NaOH \u2192 NaCl + H\u2082O (1:1 ratio). Moles NaOH = 0.0025 mol. Conc NaOH = 0.0025/0.0185 = 0.135 mol/dm\u00b3", marks: 4, hint: "Find moles of HCl \u2192 use ratio \u2192 find moles of NaOH \u2192 divide by volume in dm\u00b3" },
      ],
      long: [
        { question: "A student reacts 5.4g of aluminium with excess hydrochloric acid. Calculate (a) the theoretical mass of hydrogen produced, (b) if the student only collects 0.18g of H\u2082, calculate the percentage yield.", answer: "(a) Equation: 2Al + 6HCl \u2192 2AlCl\u2083 + 3H\u2082. Moles Al = 5.4/27 = 0.2 mol. Ratio Al:H\u2082 = 2:3, so moles H\u2082 = 0.2\u00d7(3/2) = 0.3 mol. Theoretical mass H\u2082 = 0.3\u00d72 = 0.6g. (b) % yield = (0.18/0.6)\u00d7100 = 30%", marks: 6, hint: "Balance the equation \u2192 find moles of Al \u2192 use ratio to find moles of H\u2082 \u2192 find mass. Then % yield = actual/theoretical \u00d7 100" },
      ],
      flashcard: [
        { term: "The Mole", definition: "Amount of substance containing 6.02\u00d710\u00b2\u00b3 particles (Avogadro's constant). Moles = mass (g) \u00f7 Mr. Mass = moles \u00d7 Mr. Mr = mass \u00f7 moles.", example: "1 mol of water (Mr=18) has mass 18g and contains 6.02\u00d710\u00b2\u00b3 molecules" },
        { term: "Concentration", definition: "Concentration (mol/dm\u00b3) = moles \u00f7 volume (dm\u00b3). Remember: 1000cm\u00b3 = 1dm\u00b3. To find moles from concentration: moles = concentration \u00d7 volume (dm\u00b3).", example: "0.5 mol/dm\u00b3 in 200cm\u00b3: moles = 0.5 \u00d7 0.2 = 0.1 mol" },
        { term: "Percentage Yield & Atom Economy", definition: "% yield = (actual yield/theoretical yield) \u00d7 100. Atom economy = (Mr of desired product/sum of Mr of all products) \u00d7 100. High atom economy = less waste, more sustainable.", example: "Atom economy of making C in A+B\u2192C+D: Mr(C)/[Mr(C)+Mr(D)] \u00d7 100" },
      ],
    },
  },
  "Bonding & Structure": {
    "Ionic Bonding": {
      short: [
        { question: "Draw dot and cross diagrams showing the formation of magnesium oxide from Mg and O atoms.", answer: "Mg ([2,8,2]) loses 2 electrons \u2192 Mg\u00b2\u207a ([2,8]). O ([2,6]) gains 2 electrons \u2192 O\u00b2\u207b ([2,8]). Both achieve full outer shells.", marks: 3, hint: "Mg is in Group 2 so loses 2 electrons. O is in Group 6 so gains 2 electrons." },
        { question: "Why does sodium chloride have a high melting point?", answer: "Sodium chloride has a giant ionic lattice structure with strong electrostatic attractions between oppositely charged ions (Na\u207a and Cl\u207b) in all directions. A large amount of energy is needed to overcome these attractions.", marks: 2, hint: "Think about the type of structure and the type of bonding" },
      ],
      mid: [
        { question: "Explain why ionic compounds conduct electricity when dissolved in water but not in solid form.", answer: "In solid form, the ions are fixed in a lattice and cannot move \u2014 no charge carriers, so no conduction. When dissolved in water, the ions separate (dissociate) and are free to move through the solution. These mobile ions carry charge, so the solution conducts electricity. Similarly, ionic compounds conduct when molten as ions are free to move.", marks: 3, hint: "Key concept: mobile ions are needed. Explain both states \u2014 solid (fixed) and dissolved/molten (mobile)" },
      ],
      long: [
        { question: "Compare the structure and properties of sodium chloride (ionic), silicon dioxide (giant covalent), and carbon dioxide (simple covalent). Explain the properties in terms of structure and bonding.", answer: "NaCl: Giant ionic lattice \u2014 alternating Na\u207a and Cl\u207b ions. Strong electrostatic forces in all directions. High melting point (801\u00b0C). Conducts when dissolved or molten (mobile ions). Soluble in water. SiO\u2082: Giant covalent structure \u2014 each Si bonded to 4 O atoms by strong covalent bonds in a tetrahedral network. Very high melting point (1710\u00b0C). Does not conduct (no free electrons or ions). Insoluble. Hard. CO\u2082: Simple molecular \u2014 individual O=C=O molecules with strong double bonds. Weak intermolecular forces (van der Waals). Very low melting point (\u221278\u00b0C sublimation). Does not conduct. Often soluble. Properties determined by intermolecular, not intramolecular forces.", marks: 7, hint: "For each substance: describe the structure, type of bonding/forces, then explain melting point, conductivity and solubility from structure. Contrast all three clearly." },
      ],
      flashcard: [
        { term: "Ionic Bonding", definition: "Transfer of electrons from metal to non-metal atoms. Both achieve full outer shells. Forms ions (cation +, anion \u2212). Giant ionic lattice: strong electrostatic attractions in 3D. High MP, conducts when dissolved/molten.", example: "Na gives 1e\u207b to Cl \u2192 Na\u207a and Cl\u207b. Regular lattice of alternating ions." },
        { term: "Covalent Bonding", definition: "Sharing of electron pairs between non-metal atoms. Each shared pair is one covalent bond. Double bond = 2 shared pairs. Triple bond = 3 shared pairs. Simple molecules (low BP) or giant covalent structures (very high BP).", example: "H\u2082O: two O-H single bonds. O\u2082: one O=O double bond. N\u2082: one N\u2261N triple bond" },
        { term: "Giant Covalent Structures", definition: "Very high melting points due to many strong covalent bonds to break. Diamond: each C bonded to 4 others \u2014 hardest natural material, no conduction. Graphite: layers of hexagonal C, one delocalised electron per C \u2014 conducts. Silicon dioxide: SiO\u2082 network.", example: "Diamond vs Graphite: both carbon, different structure \u2192 very different properties" },
      ],
    },
  },
  "Chemical Changes": {
    "Acids, Bases & Neutralisation": {
      short: [
        { question: "Write the ionic equation for the reaction of any strong acid with any alkali.", answer: "H\u207a(aq) + OH\u207b(aq) \u2192 H\u2082O(l)", marks: 2, hint: "All neutralisation reactions have the same ionic equation" },
        { question: "What is the difference between a strong acid and a weak acid?", answer: "A strong acid completely dissociates (ionises) in water, producing many H\u207a ions (e.g. HCl). A weak acid only partially dissociates, so fewer H\u207a ions in solution (e.g. ethanoic acid). Both can be concentrated or dilute.", marks: 2, hint: "It's about how much they ionise, not how concentrated they are" },
      ],
      mid: [
        { question: "Describe how to prepare a pure, dry sample of zinc sulfate crystals from zinc and sulfuric acid.", answer: "Add excess zinc to dilute sulfuric acid in a beaker \u2014 excess ensures all acid reacts. Warm gently to speed reaction. Filter off excess zinc. Heat the filtrate gently to concentrate. Leave to crystallise slowly. Filter off crystals, wash with a little cold distilled water, leave to dry at room temperature. Zn + H\u2082SO\u2084 \u2192 ZnSO\u2084 + H\u2082", marks: 4, hint: "Excess zinc, filter, evaporate, crystallise, filter, dry. Explain purpose of excess zinc." },
      ],
      long: [
        { question: "Explain the preparation of a soluble salt by titration, using sodium hydroxide and hydrochloric acid as an example. Why is excess reagent not acceptable in this case?", answer: "HCl + NaOH \u2192 NaCl + H\u2082O. Titration method: Fill burette with HCl. Add known volume of NaOH to conical flask with indicator (e.g. phenolphthalein). Add HCl from burette until indicator changes colour (endpoint). Record titre volume. Repeat for concordant results. Repeat reaction without indicator using exact titre volume \u2014 this gives a pure solution (no indicator contamination). Evaporate water to concentrate. Leave to crystallise. Filter and dry crystals. Excess reagent not acceptable: an excess of either acid or alkali would contaminate the product salt \u2014 unlike insoluble base reactions, you cannot filter excess reagent from a fully dissolved product. The exact volumes must balance perfectly. This is why an indicator is used first to determine the exact neutralisation volume.", marks: 7, hint: "Full method: indicator run, titre, repeat without indicator. Explain why no excess \u2014 can't filter dissolved excess reagent." },
      ],
      flashcard: [
        { term: "Acid Reactions", definition: "Acid + metal \u2192 salt + hydrogen. Acid + metal oxide \u2192 salt + water. Acid + metal hydroxide \u2192 salt + water. Acid + metal carbonate \u2192 salt + water + CO\u2082. The salt formed depends on the acid: HCl \u2192 chloride, H\u2082SO\u2084 \u2192 sulfate, HNO\u2083 \u2192 nitrate.", example: "H\u2082SO\u2084 + CuO \u2192 CuSO\u2084 + H\u2082O. H\u2082SO\u2084 + Na\u2082CO\u2083 \u2192 Na\u2082SO\u2084 + H\u2082O + CO\u2082" },
        { term: "pH Scale", definition: "Measures H\u207a ion concentration. pH 0-6: acidic. pH 7: neutral. pH 8-14: alkaline. Each unit change = 10\u00d7 change in H\u207a concentration. Universal indicator: red/orange (acid), green (neutral), blue/purple (alkali).", example: "pH 3 has 10\u00d7 more H\u207a than pH 4. Stomach acid ~pH 2. Blood ~pH 7.4." },
        { term: "Strong vs Weak Acids", definition: "Strong acids fully ionise: HCl \u2192 H\u207a + Cl\u207b (100%). Weak acids partially ionise: CH\u2083COOH \u21cc H\u207a + CH\u2083COO\u207b (few %). Same concentration: strong acid has lower pH and higher conductivity than weak acid.", example: "1mol/dm\u00b3 HCl: pH\u22480. 1mol/dm\u00b3 CH\u2083COOH: pH\u22482.4" },
      ],
    },
  },
  "Organic Chemistry": {
    "Alkanes & Alkenes": {
      short: [
        { question: "Give the molecular formula and structural formula for propene.", answer: "Molecular formula: C\u2083H\u2086. Structural: CH\u2082=CHCH\u2083 (carbon-carbon double bond between C1 and C2)", marks: 2, hint: "Propene has 3 carbons and one double bond. General formula for alkenes: C\u2099H\u2082\u2099" },
        { question: "How would you distinguish between an alkane and an alkene using bromine water?", answer: "Add bromine water to both. The alkene decolourises bromine water (orange \u2192 colourless) because it reacts with bromine via electrophilic addition across the C=C bond. The alkane does not react \u2014 bromine water remains orange.", marks: 2, hint: "Bromine water test \u2014 which one decolourises it and why?" },
      ],
      mid: [
        { question: "Explain why alkenes undergo addition reactions but alkanes do not.", answer: "Alkenes contain a C=C double bond \u2014 one of the bonds is a \u03c0 bond which is more reactive than a \u03c3 bond. The high electron density attracts electrophiles (electron-loving species). In addition reactions, the \u03c0 bond breaks and one molecule of reagent adds across the double bond (e.g. HBr adds to form a haloalkane). Alkanes only have single C-C and C-H bonds \u2014 all \u03c3 bonds, which are very stable. They can undergo substitution reactions (with halogens in UV light) but not addition reactions.", marks: 4, hint: "Explain the C=C double bond, the \u03c0 bond, electrophilic addition, and why alkane single bonds don't react the same way" },
      ],
      long: [
        { question: "Describe the industrial cracking of crude oil fractions. Explain why cracking is economically important and describe the conditions used.", answer: "Cracking is the thermal decomposition of large hydrocarbon molecules (high molecular mass fractions from fractional distillation) into smaller, more useful ones. Two methods: Thermal cracking (high pressure ~700\u00b0C, no catalyst) \u2014 produces a high proportion of alkenes useful for making polymers. Catalytic cracking (lower temperature ~450\u00b0C, aluminium oxide/silica catalyst, lower pressure) \u2014 more efficient, produces more branched alkanes and aromatic compounds for petrol. Products always include at least one alkane and one alkene (addition across the double bond accounts for different products). Economic importance: crude oil fractional distillation produces too much of heavy fractions (fuel oil, bitumen) and not enough of high-demand fractions (petrol, diesel). Cracking converts excess long-chain fractions into valuable shorter ones. Supply matches demand. Alkenes from cracking are feedstocks for making plastics (addition polymerisation).", marks: 7, hint: "Explain the process, two types with conditions, products, and detailed economic justification (supply/demand of fractions, alkenes for polymers)" },
      ],
      flashcard: [
        { term: "Homologous Series", definition: "A series of compounds with the same functional group, general formula, and similar chemical properties. Each member differs by CH\u2082. Physical properties change gradually (e.g. boiling point increases with chain length).", example: "Alkanes: methane, ethane, propane... each adds CH\u2082; all react by combustion and substitution" },
        { term: "Addition Polymerisation", definition: "Many small alkene monomers join together across their C=C double bonds to form a long polymer chain. No atoms lost. The double bond opens and monomers link. The repeat unit has no double bond.", example: "n(CH\u2082=CH\u2082) \u2192 (\u2212CH\u2082\u2212CH\u2082\u2212)\u2099; polyethene. n(CF\u2082=CF\u2082) \u2192 PTFE" },
        { term: "Condensation Polymerisation", definition: "Monomers with two functional groups react, releasing a small molecule (usually water or HCl) each time two monomers join. Forms polyesters (diol + dicarboxylic acid) or polyamides (diamine + dicarboxylic acid).", example: "Nylon-6,6: hexanedioic acid + hexane-1,6-diamine \u2192 polyamide + water" },
      ],
    },
  },
};
