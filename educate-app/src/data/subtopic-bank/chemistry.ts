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
  "Energy Changes": {
    "Exothermic & Endothermic Reactions": {
      short: [
        {
          question: "Hand warmers use the oxidation of iron powder. State whether this reaction is exothermic or endothermic, and explain what this means in terms of energy transfer.",
          answer: "The reaction is exothermic. Energy is released to the surroundings, causing the temperature of the surroundings to increase.",
          marks: 2,
          hint: "Exothermic = energy released to surroundings → temperature rise",
        },
        {
          question: "A sports injury pack feels cold when activated. What type of energy change is occurring, and what is the sign of the temperature change for the surroundings?",
          answer: "The reaction is endothermic. Energy is absorbed from the surroundings, so the temperature of the surroundings decreases. The pack therefore feels cold.",
          marks: 2,
          hint: "Endothermic = energy absorbed from surroundings → temperature falls",
        },
      ],
      mid: [
        {
          question: "Sketch and label a reaction profile diagram for an exothermic reaction. Mark on the activation energy and the overall energy change (ΔH). Then explain how a catalyst changes the profile without changing ΔH.",
          answer: "The diagram shows reactants at a higher energy level than products (overall energy decrease). The peak represents the transition state. Activation energy (Ea) is the difference in energy between the reactants and the peak. ΔH is the difference in energy between reactants and products (negative for exothermic). A catalyst provides an alternative reaction pathway with a lower activation energy peak. The reactant and product energy levels remain unchanged, so ΔH is the same. The lower peak means more particles have enough energy to react, increasing the rate.",
          marks: 4,
          hint: "Draw: reactants above products, peak for transition state, label Ea (peak−reactants) and ΔH (reactants−products). Catalyst lowers peak only.",
        },
      ],
      long: [
        {
          question: "Describe the difference between exothermic and endothermic reactions in terms of energy transfer and temperature changes. Give two everyday examples of each. Explain what activation energy is and how a catalyst affects it, with reference to reaction profile diagrams.",
          answer: "In exothermic reactions, energy is transferred from the reacting system to the surroundings; the temperature of the surroundings increases. In endothermic reactions, energy is absorbed by the reacting system from the surroundings; the temperature of the surroundings decreases. Exothermic examples: combustion of fuels (fire gives off heat), hand warmers (oxidation of iron), neutralisation reactions. Endothermic examples: thermal decomposition (e.g. heating calcium carbonate), sports ice packs (ammonium nitrate dissolving), photosynthesis. Activation energy (Ea) is the minimum energy that reacting particles must have to react — it is the energy needed to break bonds in reactant molecules and start the reaction. On a reaction profile diagram, Ea is the energy difference between the reactants and the peak (transition state). A catalyst provides an alternative reaction pathway with a lower activation energy. On the profile, the peak is lower with a catalyst, but the energy levels of reactants and products are unchanged, so ΔH remains the same. More particles now have energy ≥ the lower Ea, so the reaction is faster.",
          marks: 6,
          hint: "Define exo/endo with temperature change. Two examples each. Define activation energy. Explain catalyst effect on Ea with profile diagram reference.",
        },
      ],
      flashcard: [
        {
          term: "Exothermic Reaction",
          definition: "A reaction that transfers energy to the surroundings, causing the temperature of the surroundings to increase. ΔH is negative. Products are at a lower energy level than reactants on a reaction profile.",
          example: "Combustion: CH₄ + 2O₂ → CO₂ + 2H₂O (releases heat). Hand warmers, neutralisation.",
        },
        {
          term: "Endothermic Reaction & Activation Energy",
          definition: "Endothermic: absorbs energy from surroundings; temperature decreases; ΔH is positive; products higher than reactants on profile. Activation energy (Ea): minimum energy particles need to react; represented by the peak height above reactants on a profile diagram. Catalysts lower Ea without changing ΔH.",
          example: "Thermal decomposition of CaCO₃ → CaO + CO₂ (requires heating). Sports injury cold packs.",
        },
      ],
    },
    "Bond Energies & Calculations": {
      short: [
        {
          question: "State whether bond breaking is exothermic or endothermic, and whether bond making is exothermic or endothermic.",
          answer: "Bond breaking is endothermic — energy must be supplied to break bonds. Bond making is exothermic — energy is released when bonds form.",
          marks: 2,
          hint: "Breaking = energy in (endo). Making = energy out (exo).",
        },
        {
          question: "The bond energy of H−H is 436 kJ/mol and of Cl−Cl is 243 kJ/mol. The bond energy of H−Cl is 432 kJ/mol. Calculate ΔH for H₂ + Cl₂ → 2HCl.",
          answer: "Energy in (bonds broken) = 436 + 243 = 679 kJ. Energy out (bonds made) = 2 × 432 = 864 kJ. ΔH = 679 − 864 = −185 kJ/mol. The reaction is exothermic.",
          marks: 3,
          hint: "ΔH = energy in − energy out. Break H−H and Cl−Cl, make two H−Cl bonds.",
        },
      ],
      mid: [
        {
          question: "Use the bond energies given to calculate ΔH for the combustion of methane: CH₄ + 2O₂ → CO₂ + 2H₂O. Bond energies (kJ/mol): C−H = 412, O=O = 498, C=O = 743, O−H = 463.",
          answer: "Bonds broken: 4 × C−H + 2 × O=O = (4 × 412) + (2 × 498) = 1648 + 996 = 2644 kJ. Bonds made: 2 × C=O + 4 × O−H = (2 × 743) + (4 × 463) = 1486 + 1852 = 3338 kJ. ΔH = 2644 − 3338 = −694 kJ/mol. Exothermic.",
          marks: 4,
          hint: "List every bond broken (reactants) and every bond made (products). ΔH = total energy in − total energy out.",
        },
      ],
      long: [
        {
          question: "Explain what bond energies are and how they are used to calculate the overall energy change for a reaction. Use the hydrogenation of ethene (C₂H₄ + H₂ → C₂H₆) to illustrate your answer. Bond energies (kJ/mol): C=C = 614, C−C = 347, C−H = 412, H−H = 436. State whether the reaction is exothermic or endothermic and explain why in terms of bonds broken and formed.",
          answer: "Bond energy is the energy needed to break one mole of a particular covalent bond in the gaseous state. Bond breaking is always endothermic (requires energy); bond making is always exothermic (releases energy). The overall ΔH = energy needed to break bonds in reactants − energy released when bonds form in products. For hydrogenation of ethene: Bonds broken: C=C (1 × 614 = 614 kJ) + H−H (1 × 436 = 436 kJ) = 1050 kJ. Note: the C−H bonds in ethene are not broken in this reaction; only the π component of the C=C and the H−H bond break. Bonds made: C−C (1 × 347 = 347 kJ) + 2 × C−H (2 × 412 = 824 kJ) = 1171 kJ. ΔH = 1050 − 1171 = −121 kJ/mol. The reaction is exothermic because more energy is released forming bonds in ethane than is needed to break bonds in ethene and hydrogen. The products are at a lower energy level than the reactants.",
          marks: 6,
          hint: "Define bond energy. State breaking = endo, making = exo. Show full calculation: bonds broken (C=C + H−H), bonds made (C−C + 2C−H). State exo/endo and explain.",
        },
      ],
      flashcard: [
        {
          term: "Bond Energy Calculation",
          definition: "ΔH = Σ(bond energies broken) − Σ(bond energies made). Bond breaking requires energy (endothermic). Bond making releases energy (exothermic). If ΔH is negative → exothermic overall. If ΔH is positive → endothermic overall.",
          example: "H₂ + Cl₂ → 2HCl: Break H−H (436) + Cl−Cl (243) = 679 kJ in. Make 2×H−Cl (2×432) = 864 kJ out. ΔH = 679−864 = −185 kJ/mol (exothermic).",
        },
        {
          term: "Bond Energy Definition",
          definition: "The energy (in kJ/mol) required to break one mole of a specified covalent bond in gaseous molecules. Values are averages across different molecules. A higher bond energy means a stronger, harder-to-break bond.",
          example: "C≡N triple bond (~890 kJ/mol) is stronger than C=N (~615 kJ/mol) which is stronger than C−N (~305 kJ/mol).",
        },
      ],
    },
    "Calorimetry": {
      short: [
        {
          question: "Write the formula used to calculate the energy change in a calorimetry experiment and state what each symbol represents.",
          answer: "Q = mcΔT. Q = heat energy transferred (J). m = mass of solution or water (g). c = specific heat capacity of water (4.18 J/g/°C). ΔT = temperature change (°C).",
          marks: 2,
          hint: "Q = mcΔT — mass, specific heat capacity, temperature change.",
        },
        {
          question: "In a calorimetry experiment, 100 g of water increases in temperature from 21.0°C to 34.5°C when a fuel is burned. Calculate the energy transferred to the water.",
          answer: "ΔT = 34.5 − 21.0 = 13.5°C. Q = mcΔT = 100 × 4.18 × 13.5 = 5643 J = 5.64 kJ.",
          marks: 2,
          hint: "Q = mcΔT. m = 100 g, c = 4.18 J/g/°C, ΔT = final − initial temperature.",
        },
      ],
      mid: [
        {
          question: "Describe the method for measuring the enthalpy of combustion of ethanol using simple calorimetry. Include all measurements needed and identify two sources of error.",
          answer: "Method: Weigh a spirit burner containing ethanol. Measure 100 cm³ (100 g) of water into a copper calorimeter. Record the initial temperature of the water. Light the spirit burner and place it under the calorimeter. Heat the water until the temperature rises by approximately 20−30°C. Extinguish the flame and record the maximum temperature. Reweigh the spirit burner to find the mass of ethanol burned. Calculate: ΔT = T_final − T_initial. Q = mcΔT (energy transferred to water). Moles of ethanol burned = mass burned ÷ Mr(ethanol, 46). ΔH_combustion = −Q ÷ moles (kJ/mol). Sources of error: (1) Heat loss to surroundings — the calorimeter and surrounding air absorb heat, so the calculated value is less than the true value. (2) Incomplete combustion — ethanol may not fully combust, releasing less energy. (3) Evaporation of ethanol from the wick between reweighing introduces error in mass burned.",
          marks: 4,
          hint: "State all measurements (mass of fuel, temp change, mass of water). Give equation. Name at least two errors: heat loss to surroundings, incomplete combustion, evaporation.",
        },
      ],
      long: [
        {
          question: "A student burns 0.46 g of ethanol (C₂H₅OH, Mr = 46) and uses the heat to warm 200 g of water from 19.5°C to 38.0°C. Calculate (a) the energy released in this experiment, (b) the molar enthalpy of combustion calculated from these results, (c) the data book value is −1371 kJ/mol; calculate the percentage error and suggest reasons for the discrepancy.",
          answer: "(a) ΔT = 38.0 − 19.5 = 18.5°C. Q = mcΔT = 200 × 4.18 × 18.5 = 15466 J = 15.47 kJ. (b) Moles of ethanol = 0.46 ÷ 46 = 0.01 mol. ΔH_combustion = −15.47 ÷ 0.01 = −1547 kJ/mol. (c) Percentage error = |−1547 − (−1371)| ÷ 1371 × 100 = 176 ÷ 1371 × 100 = 12.8%. Reasons for discrepancy: The student's value is more negative (higher) than the data book value — this means more energy was measured than expected, which could occur if the initial temperature reading was too high, but more likely the student's value should be less negative (lower) due to heat losses. If the student's value were lower than the data book: heat lost to surroundings and air rather than to the water; incomplete combustion producing carbon monoxide and soot rather than CO₂; evaporation of ethanol causing an overestimate of mass burned. The simple apparatus has no insulation and no draft shield.",
          marks: 7,
          hint: "(a) Q = mcΔT with m=200g, ΔT=18.5°C. (b) Moles = 0.46÷46, ΔH = −Q÷moles. (c) % error = |exp−book|÷book × 100. Explain heat loss, incomplete combustion, evaporation.",
        },
      ],
      flashcard: [
        {
          term: "Calorimetry Formula",
          definition: "Q = mcΔT. Q = energy transferred (J), m = mass of water (g), c = specific heat capacity of water = 4.18 J/g/°C, ΔT = temperature change (°C). To get kJ/mol: divide Q (in kJ) by moles of substance burned/reacted.",
          example: "50 g water, ΔT = 20°C: Q = 50 × 4.18 × 20 = 4180 J = 4.18 kJ.",
        },
        {
          term: "Sources of Error in Calorimetry",
          definition: "1. Heat loss to surroundings — energy heats air/apparatus not water (reduces calculated ΔH). 2. Incomplete combustion — less energy released than expected. 3. Evaporation of fuel — mass of fuel burned overestimated. 4. Heat capacity of calorimeter ignored. All these cause the experimental value to be less exothermic than the true value.",
          example: "Using a simple tin can instead of a proper bomb calorimeter gives much larger heat losses.",
        },
      ],
    },
  },
  "Rates of Reaction & Equilibrium": {
    "Factors Affecting Rate": {
      short: [
        {
          question: "Explain, using collision theory, why increasing concentration increases the rate of reaction.",
          answer: "Increasing the concentration means there are more reactant particles in the same volume. The particles are closer together, so they collide more frequently. More frequent collisions means more successful collisions per second, so the rate increases.",
          marks: 2,
          hint: "More particles in same volume → more frequent collisions → faster rate.",
        },
        {
          question: "Explain why increasing temperature increases the rate of reaction. Your answer must refer to collision theory and activation energy.",
          answer: "Increasing temperature gives particles more kinetic energy. They move faster, so they collide more frequently. More importantly, a greater proportion of particles have energy equal to or greater than the activation energy. This means more collisions are successful, so the rate increases significantly.",
          marks: 3,
          hint: "Two effects: more frequent collisions AND more particles have energy ≥ Ea (successful collisions).",
        },
      ],
      mid: [
        {
          question: "Marble chips (calcium carbonate) react with hydrochloric acid. Explain how and why each of the following increases the rate: (a) using smaller marble chips, (b) using more concentrated acid, (c) increasing temperature.",
          answer: "(a) Smaller chips: Crushing the marble into smaller pieces increases the total surface area exposed to the acid. More acid particles can collide with the marble surface simultaneously. More frequent collisions per unit time → faster rate. (b) More concentrated acid: More H⁺ ions in the same volume → particles are closer together → more frequent collisions between H⁺ and CaCO₃ surface → more successful collisions per second → faster rate. (c) Higher temperature: Acid and carbonate particles have more kinetic energy → move faster → collide more frequently. More importantly, a larger proportion of particles have energy ≥ activation energy → more successful collisions → significantly faster rate.",
          marks: 4,
          hint: "For each factor state the effect on collision frequency/energy and link to rate using collision theory. Surface area → more collisions at surface. Concentration → more particles per dm³. Temperature → more KE, more particles above Ea.",
        },
      ],
      long: [
        {
          question: "Describe the effect of all five main factors on rate of reaction and explain each using collision theory. Include how a catalyst works at the molecular level.",
          answer: "1. Concentration (solutions): More solute particles per unit volume → more frequent collisions between reactant particles → more successful collisions per second → faster rate. 2. Pressure (gases): Higher pressure reduces the volume, increasing the concentration of gas molecules → same effect as increasing concentration → more frequent collisions → faster rate. 3. Temperature: Increases kinetic energy of particles → faster movement → more frequent collisions. Crucially, a greater proportion of particles have kinetic energy ≥ activation energy (Ea) → more collisions are successful → rate increases significantly (roughly doubles per 10°C rise). 4. Surface area (solids): Breaking a solid into smaller pieces increases the total surface area. More reactant particles are exposed and available for collisions with the other reactant → more frequent collisions → faster rate. Particle size does not change the energy of individual collisions. 5. Catalysts: A catalyst provides an alternative reaction pathway with a lower activation energy. More particles in the distribution now have energy ≥ the lower Ea → more successful collisions → faster rate. The catalyst is not consumed (regenerated at end). Heterogeneous catalysts: reactants adsorb onto the catalyst surface, weakening bonds and lowering Ea. Homogeneous catalysts: form an intermediate with lower Ea pathway.",
          marks: 7,
          hint: "All 5 factors: concentration, pressure (gases), temperature, surface area, catalyst. For each: state the change → link to collision frequency or Ea → state effect on rate. Catalyst: lower Ea, not consumed.",
        },
      ],
      flashcard: [
        {
          term: "Collision Theory",
          definition: "Reactions occur when particles collide with sufficient energy (≥ activation energy) and correct orientation. Rate ∝ frequency of successful collisions. Factors that increase collision frequency or the proportion of particles with E ≥ Ea will increase rate.",
          example: "Doubling concentration → twice as many particles → roughly twice as many collisions per second → faster rate.",
        },
        {
          term: "Activation Energy (Ea)",
          definition: "The minimum energy that colliding particles must have for a reaction to occur. At higher temperatures, more particles have E ≥ Ea (Maxwell–Boltzmann distribution shifts right). Catalysts lower Ea, allowing more particles to react at the same temperature.",
          example: "Without catalyst: only a few particles exceed Ea. With catalyst: same temperature but lower Ea → many more particles can react.",
        },
        {
          term: "Effect of Surface Area on Rate",
          definition: "For solid reactants, rate depends on surface area exposed to the other reactant. Smaller particles = greater surface area = more collision sites = faster rate. Same total mass of reactant, but much faster reaction.",
          example: "Powdered calcium carbonate reacts much faster with HCl than marble chips of the same mass.",
        },
      ],
    },
    "Measuring Rate": {
      short: [
        {
          question: "A student investigates the rate of reaction between sodium thiosulfate and hydrochloric acid by timing how long it takes for a cross drawn on paper to disappear. State the chemical reason the cross disappears.",
          answer: "Sulfur is produced as a precipitate during the reaction. The sulfur makes the solution cloudy (turbid). As more sulfur forms, the solution becomes increasingly opaque until the cross can no longer be seen through it.",
          marks: 2,
          hint: "The product sulfur forms a precipitate → solution becomes cloudy → cross obscured.",
        },
        {
          question: "In a reaction producing a gas, give two methods that could be used to measure the rate of reaction.",
          answer: "1. Collect the gas in a gas syringe and measure the volume of gas produced at regular time intervals. 2. Place the reaction flask on a balance and measure the decrease in mass as gas escapes, at regular time intervals.",
          marks: 2,
          hint: "Measure either the volume of gas collected (syringe) or the loss in mass (balance).",
        },
      ],
      mid: [
        {
          question: "A student measures the rate of reaction between sodium thiosulfate (Na₂S₂O₃) and hydrochloric acid. Describe the full method, including how to vary concentration, what is measured, and how the results are used to compare rates.",
          answer: "Na₂S₂O₃(aq) + 2HCl(aq) → 2NaCl(aq) + SO₂(g) + S(s) + H₂O(l). Method: Place a conical flask on paper marked with a cross. Add a measured volume of sodium thiosulfate solution to the flask. Add a measured volume of HCl and start the stopwatch immediately. Look down through the flask from above. Stop the stopwatch when the cross can no longer be seen through the cloudy sulfur precipitate. Record the time taken (t). Rate is proportional to 1/t. Repeat with different concentrations of Na₂S₂O₃: to vary concentration, keep total volume constant — use less Na₂S₂O₃ and replace with water (e.g. 40 cm³ Na₂S₂O₃ + 10 cm³ water, then 30 + 20, etc.). Temperature must be controlled. Plot rate (1/t) against concentration: higher concentration → shorter time → higher rate → steeper line on graph.",
          marks: 4,
          hint: "Equipment: cross on paper, stopwatch, measuring cylinders. Measure time for cross to disappear. Rate = 1/t. Vary concentration keeping total volume constant. Control temperature.",
        },
      ],
      long: [
        {
          question: "Describe and compare three different methods for measuring the rate of a chemical reaction. For each method, state what is measured, give an example reaction where it is appropriate, and state one limitation.",
          answer: "1. Loss in mass (top-pan balance): The reaction flask is placed on a balance. As a gas is produced and escapes, the mass decreases over time. The rate is measured as mass lost per unit time or plotted as mass remaining against time. Example: CaCO₃ + HCl → CO₂ escapes, causing mass to decrease. Limitation: only works if the gas product escapes (open system); very accurate balance needed; gas escaping too quickly may give inaccurate readings. 2. Volume of gas collected (gas syringe or measuring cylinder over water): Gas produced is collected in a graduated gas syringe. Volume is read at regular time intervals. Rate measured as volume produced per unit time. Example: Zn + HCl → ZnCl₂ + H₂; hydrogen collected in syringe. Limitation: gas may dissolve in the reaction mixture (e.g. CO₂ in water), giving a lower reading; leaks in the apparatus cause errors. 3. Colorimetry / turbidity (cross disappearing method): Changes in colour or cloudiness are measured. Either use a colorimeter to measure absorbance, or time how long until a cross becomes obscured. Example: Na₂S₂O₃ + HCl → sulfur precipitate formed, causing cloudiness. Rate = 1/t. Limitation: subjective judgement of when the cross disappears (varies between observers); only works for reactions producing a visible colour change or precipitate; single data point per run.",
          marks: 6,
          hint: "Three methods: mass loss (balance), gas volume (syringe), colour/turbidity (colorimeter or cross method). For each: what is measured, example reaction, one limitation.",
        },
      ],
      flashcard: [
        {
          term: "Measuring Reaction Rate",
          definition: "Rate = change in measurable quantity ÷ time. Methods: (1) Gas volume collected over time. (2) Loss in mass as gas escapes. (3) Colour change measured by colorimeter. (4) Turbidity — time for cross to disappear (Na₂S₂O₃ + HCl). Rate ∝ 1/time for cross method.",
          example: "Na₂S₂O₃ + 2HCl → 2NaCl + SO₂ + S + H₂O. Sulfur precipitate clouds the solution. Shorter time = faster rate.",
        },
        {
          term: "Sodium Thiosulfate Required Practical",
          definition: "Investigates the effect of concentration (or temperature) on rate. Measure time (t) for sulfur precipitate to obscure a cross. Rate ∝ 1/t. Keep total volume constant when varying concentration. Control temperature. Plot 1/t against concentration for a straight-line relationship.",
          example: "50 cm³ Na₂S₂O₃ (0.15 mol/dm³): t = 42 s → rate = 0.024. At 0.10 mol/dm³: t = 65 s → rate = 0.015.",
        },
      ],
    },
    "Reversible Reactions & Equilibrium": {
      short: [
        {
          question: "What is meant by a reversible reaction? Use the correct symbol in your answer.",
          answer: "A reversible reaction is one in which the products can react together to re-form the original reactants. It is represented with a double arrow: ⇌. Both the forward and reverse reactions can occur.",
          marks: 2,
          hint: "Define reversible reaction and include the ⇌ symbol.",
        },
        {
          question: "State Le Chatelier's Principle.",
          answer: "If a system at equilibrium is subjected to a change in conditions (temperature, pressure, or concentration), the equilibrium will shift in the direction that opposes the change to minimise the effect of the disturbance.",
          marks: 2,
          hint: "The equilibrium shifts to oppose whatever change is applied.",
        },
      ],
      mid: [
        {
          question: "The Haber process: N₂(g) + 3H₂(g) ⇌ 2NH₃(g)  ΔH = −92 kJ/mol. Explain the effect on the equilibrium yield of ammonia of (a) increasing pressure and (b) increasing temperature. Then state the actual conditions used in industry and explain the compromise.",
          answer: "(a) Increasing pressure: Left side has 1 + 3 = 4 moles of gas. Right side has 2 moles of gas. By Le Chatelier, increasing pressure shifts equilibrium to the side with fewer gas moles — the right side. Yield of NH₃ increases. Industry uses ~200 atm. (b) Increasing temperature: The forward reaction is exothermic (ΔH = −92 kJ/mol). Increasing temperature favours the endothermic reverse reaction. Equilibrium shifts left. Yield of NH₃ decreases. To maximise yield, low temperature is preferred. Industrial compromise: Low temperature gives a high yield but a very slow rate. High temperature gives a poor yield but a fast rate. A temperature of ~450°C is used — a compromise between acceptable yield and acceptable rate. An iron catalyst is used to increase the rate without affecting the equilibrium position. Pressure of ~200 atm increases yield and rate, but very high pressures are expensive and dangerous.",
          marks: 5,
          hint: "Pressure: count gas moles each side, shift to fewer moles. Temperature: forward reaction exothermic → increase T shifts left. Industrial compromise: rate vs yield trade-off for temperature; catalyst speeds up both directions equally.",
        },
      ],
      long: [
        {
          question: "Explain what dynamic equilibrium means. Using the Contact process (2SO₂(g) + O₂(g) ⇌ 2SO₃(g)  ΔH = −196 kJ/mol) as an example, describe the effect of changing temperature, pressure, and catalyst on the position of equilibrium and the rate. State the industrial conditions used and justify them.",
          answer: "Dynamic equilibrium: In a closed system, when the rate of the forward reaction equals the rate of the reverse reaction, the concentrations of reactants and products remain constant over time. Both reactions are still occurring — it is dynamic — but at equal rates so the overall composition does not change. Contact process — making sulfur trioxide for sulfuric acid manufacture. Effect of temperature: The forward reaction is exothermic (ΔH = −196 kJ/mol). Increasing temperature shifts equilibrium left (towards endothermic direction) → less SO₃ produced. Decreasing temperature shifts equilibrium right → more SO₃ but reaction is too slow. Industrial condition: ~450°C (compromise for acceptable rate and yield ~98%). Effect of pressure: Left side: 2 + 1 = 3 moles of gas. Right side: 2 moles of gas. Increasing pressure favours the side with fewer gas moles → right side → more SO₃. High pressure (1–2 atm) is used. Very high pressures are unnecessary here because the yield is already high at modest pressure, and high pressure equipment is very expensive. Effect of catalyst: Vanadium(V) oxide (V₂O₅) is used as a catalyst. It speeds up both the forward and reverse reactions equally, so it does not change the position of equilibrium or the yield. It allows the reaction to reach equilibrium more quickly at the chosen temperature, making the process economically viable. The catalyst is regenerated during the reaction.",
          marks: 7,
          hint: "Define dynamic equilibrium (rates equal, concentrations constant). For Contact process: temperature (exothermic forward → increase T shifts left), pressure (3→2 moles gas → high P shifts right), catalyst (speeds rate only, not equilibrium). State industrial conditions with justification.",
        },
      ],
      flashcard: [
        {
          term: "Dynamic Equilibrium",
          definition: "In a closed system, equilibrium is reached when the rate of the forward reaction equals the rate of the reverse reaction. Concentrations of reactants and products remain constant (not necessarily equal). Both reactions continue at equal rates — hence 'dynamic'.",
          example: "N₂ + 3H₂ ⇌ 2NH₃: at equilibrium, NH₃ is being made and decomposed at the same rate. Concentrations are constant.",
        },
        {
          term: "Le Chatelier's Principle",
          definition: "If an equilibrium is disturbed by a change in conditions, the position of equilibrium shifts to minimise the effect of that change. Increase concentration of reactant → shifts right. Increase temperature → shifts towards endothermic direction. Increase pressure → shifts towards fewer moles of gas.",
          example: "N₂ + 3H₂ ⇌ 2NH₃: increase pressure → shifts right (4→2 gas moles) → more NH₃. Increase T → shifts left (forward is exothermic) → less NH₃.",
        },
        {
          term: "Haber Process Conditions",
          definition: "N₂ + 3H₂ ⇌ 2NH₃  ΔH = −92 kJ/mol. Conditions: ~450°C (compromise — lower T gives better yield but too slow), ~200 atm (higher P gives better yield and faster rate; higher pressures too costly/dangerous), iron catalyst (increases rate, does not affect equilibrium). Unreacted N₂/H₂ recycled.",
          example: "Yield ~15% per pass, but continuous recycling gives overall efficiency. Ammonia liquefies and is removed, pulling equilibrium right.",
        },
      ],
    },
  },
  "Electrolysis": {
    "Principles of Electrolysis": {
      short: [
        {
          question: "Define the term electrolyte and explain why an ionic compound must be molten or dissolved in water before it can be electrolysed.",
          answer: "An electrolyte is a substance that conducts electricity when molten or dissolved in water, due to the presence of free ions. In the solid state, ions are fixed in a lattice and cannot move, so charge cannot flow. When molten or dissolved, the ions are free to move towards the electrodes and carry charge.",
          marks: 2,
          hint: "Electrolyte conducts via mobile ions. Solid = ions fixed, no conduction.",
        },
        {
          question: "During electrolysis, which electrode do positive ions (cations) move towards, and what happens to them when they arrive?",
          answer: "Positive ions (cations) move towards the cathode (negative electrode). At the cathode they gain electrons (are reduced) to form neutral atoms or molecules.",
          marks: 2,
          hint: "Opposite charges attract: cation (+) → cathode (−). Gain electrons = reduction.",
        },
      ],
      mid: [
        {
          question: "Copper sulfate solution is electrolysed using inert (graphite) electrodes. Identify the products at each electrode and write half-equations for each. Explain what would be observed at each electrode.",
          answer: "Ions present in solution: Cu²⁺, SO₄²⁻, H⁺, OH⁻ (from water). Cathode (negative): Cu²⁺ ions are preferentially discharged (as Cu²⁺ is a less reactive metal ion, it is easier to reduce than H⁺). Cu²⁺ + 2e⁻ → Cu. Observation: Pink/red copper metal deposits on the cathode. Anode (positive): OH⁻ ions are preferentially discharged over SO₄²⁻ (OH⁻ is lower in the electrochemical series for discharge). 4OH⁻ → 2H₂O + O₂ + 4e⁻. Observation: Bubbles of colourless oxygen gas are produced. The blue colour of the solution fades as Cu²⁺ ions are used up.",
          marks: 4,
          hint: "State all ions. Cathode: Cu²⁺ preferentially reduced (less reactive than H⁺). Anode: OH⁻ preferentially oxidised. Write half-equations and state observations.",
        },
      ],
      long: [
        {
          question: "Compare the electrolysis of molten lead bromide (PbBr₂) with the electrolysis of concentrated sodium chloride solution (brine). For each, state the ions present, the products at each electrode, the half-equations, and what is observed.",
          answer: "Molten lead bromide (PbBr₂): Ions present: Pb²⁺ and Br⁻ (only these two, no water). Cathode: Pb²⁺ + 2e⁻ → Pb. Observation: Grey liquid lead metal forms. Anode: 2Br⁻ → Br₂ + 2e⁻. Observation: Brown fumes/vapour of bromine produced. Concentrated sodium chloride solution (brine): Ions present: Na⁺, Cl⁻, H⁺, OH⁻ (from water). Cathode: H⁺ is preferentially discharged over Na⁺ (Na is more reactive; Na⁺ harder to reduce). 2H⁺ + 2e⁻ → H₂. Observation: Colourless gas (hydrogen) bubbles at cathode — squeaky pop with lit splint. Anode: Cl⁻ is preferentially discharged over OH⁻ when concentrated. 2Cl⁻ → Cl₂ + 2e⁻. Observation: Yellow-green gas (chlorine) at anode — bleaches damp litmus paper. The remaining solution becomes sodium hydroxide (NaOH), as Na⁺ and OH⁻ ions remain in solution. Key difference: molten compound has only two ions (from the compound itself); aqueous solution also contains H⁺ and OH⁻ from water, so the preferred products are different.",
          marks: 7,
          hint: "Molten PbBr₂: only Pb²⁺ and Br⁻. Cathode: Pb formed. Anode: Br₂. Brine: four ions. Cathode: H₂ (H⁺ preferred over Na⁺). Anode: Cl₂ (Cl⁻ preferred when concentrated). Remaining solution: NaOH.",
        },
      ],
      flashcard: [
        {
          term: "Electrolysis — Key Terms",
          definition: "Electrolysis: using electrical energy to decompose an ionic compound. Electrolyte: ionic compound (molten or aqueous) that conducts electricity via mobile ions. Cathode (−): positive ions (cations) are reduced here (gain electrons). Anode (+): negative ions (anions) are oxidised here (lose electrons). 'AN OX, RED CAT' — ANOde OXidation, REDuction at CAThode.",
          example: "Electrolysis of molten NaCl: cathode: Na⁺ + e⁻ → Na. Anode: 2Cl⁻ → Cl₂ + 2e⁻.",
        },
        {
          term: "Preferential Discharge from Aqueous Solutions",
          definition: "When multiple ions are present, the ion discharged depends on reactivity. At cathode: less reactive metal ion preferred over H⁺; H⁺ preferred over reactive metal ions (e.g. Na⁺, K⁺). At anode: Cl⁻ or Br⁻ preferred over OH⁻ when concentrated; OH⁻ → O₂ if halide is dilute.",
          example: "CuSO₄(aq): cathode gives Cu (not H₂) because Cu²⁺ is less reactive. Dilute NaCl(aq): anode gives O₂ (not Cl₂) because Cl⁻ concentration is too low.",
        },
      ],
    },
    "Industrial Electrolysis": {
      short: [
        {
          question: "State the three useful products from the electrolysis of brine and give one use for each.",
          answer: "Hydrogen (H₂): used as a fuel and in the manufacture of margarine (hydrogenation). Chlorine (Cl₂): used to make bleach, PVC, and to sterilise drinking water. Sodium hydroxide (NaOH): used to make soap, paper pulp, and as an industrial alkali.",
          marks: 3,
          hint: "Brine electrolysis → H₂ (cathode), Cl₂ (anode), NaOH (remains in solution). One use each.",
        },
        {
          question: "Why is aluminium extracted by electrolysis rather than by reduction with carbon?",
          answer: "Aluminium is too reactive to be reduced by carbon. Its oxide (Al₂O₃) has a very high melting point and aluminium has a higher affinity for oxygen than carbon does at the temperatures that are practical. Electrolysis of molten aluminium oxide (Al₂O₃ dissolved in molten cryolite) is used instead.",
          marks: 2,
          hint: "Al is above carbon in the reactivity series — carbon cannot displace it. Electrolysis needed for reactive metals.",
        },
      ],
      mid: [
        {
          question: "Describe the electrolysis of copper sulfate solution using copper electrodes (as used in electroplating and copper purification). Explain what happens at each electrode and why the concentration of Cu²⁺ stays constant.",
          answer: "At the cathode: Cu²⁺ + 2e⁻ → Cu. Copper metal is deposited on the cathode. At the anode: Cu → Cu²⁺ + 2e⁻. The copper anode dissolves. The concentration of Cu²⁺ ions in solution stays approximately constant because for every Cu²⁺ ion removed and deposited at the cathode, one Cu²⁺ ion enters the solution from the dissolving anode. Uses: electroplating — a pure copper layer is deposited onto a cheaper metal object (cathode). Copper purification — impure copper anode dissolves; pure copper deposits on cathode; impurities (gold, silver) fall to the bottom as anode sludge.",
          marks: 4,
          hint: "Cathode: Cu²⁺ + 2e⁻ → Cu (deposition). Anode: Cu → Cu²⁺ + 2e⁻ (dissolution). Cu²⁺ constant because dissolution and deposition balance. Applications: electroplating, purification.",
        },
      ],
      long: [
        {
          question: "Describe the extraction of aluminium from aluminium oxide by electrolysis. Include: the source of Al₂O₃, why cryolite is used, what happens at each electrode with half-equations, why the carbon anodes must be replaced regularly, and one reason why aluminium production is expensive.",
          answer: "Source of Al₂O₃: Aluminium oxide is extracted from the ore bauxite (Al₂O₃·nH₂O) by purification (Bayer process). Why cryolite: Pure aluminium oxide has a very high melting point (~2050°C). It is dissolved in molten cryolite (Na₃AlF₆) which reduces the melting point to around 850°C. This makes the process much cheaper and more energy-efficient. Cathode (steel lining): Al³⁺ + 3e⁻ → Al. Molten aluminium sinks to the bottom of the cell and is tapped off. Anode (carbon/graphite): 2O²⁻ → O₂ + 4e⁻. Oxygen is produced at the anode. Anode replacement: The hot oxygen produced at the anode reacts with the hot carbon (graphite) anodes: C + O₂ → CO₂. The anodes gradually burn away (oxidised) and must be replaced regularly, adding to production costs. Expense: The process requires a continuous, large supply of electrical energy to maintain the high temperature of the molten electrolyte and to drive the electrolysis. Electricity costs make aluminium expensive to produce, which is why recycling aluminium saves ~95% of the energy compared to extraction.",
          marks: 7,
          hint: "Cover: Al₂O₃ from bauxite, cryolite lowers melting point, cathode half-equation (Al³⁺ + 3e⁻ → Al), anode half-equation (O²⁻ → O₂), why anodes oxidise and must be replaced, electricity cost.",
        },
      ],
      flashcard: [
        {
          term: "Electrolysis of Brine",
          definition: "Concentrated NaCl(aq) → cathode: 2H⁺ + 2e⁻ → H₂ (hydrogen gas). Anode: 2Cl⁻ → Cl₂ + 2e⁻ (chlorine gas). Remaining solution: NaOH. Uses: H₂ → fuel/margarine. Cl₂ → bleach/PVC/water sterilisation. NaOH → soap/paper/industrial alkali.",
          example: "Chlor-alkali industry produces all three products simultaneously from sea salt.",
        },
        {
          term: "Aluminium Extraction by Electrolysis",
          definition: "Al₂O₃ (from bauxite) dissolved in molten cryolite (lowers melting point to ~850°C). Cathode: Al³⁺ + 3e⁻ → Al (molten Al tapped off). Anode: 2O²⁻ → O₂ + 4e⁻ (O₂ burns carbon anodes → CO₂; anodes must be regularly replaced). Very energy-intensive — hence expensive and recycling saves ~95% energy.",
          example: "1 tonne of Al requires ~15,000 kWh of electricity. Recycling requires only ~750 kWh.",
        },
      ],
    },
  },
  "Chemical Analysis": {
    "Identifying Ions & Gases": {
      short: [
        {
          question: "State the colours observed in flame tests for the following metal ions: lithium, sodium, potassium, copper, calcium.",
          answer: "Lithium: crimson/red. Sodium: yellow. Potassium: lilac. Copper: blue-green. Calcium: orange-red.",
          marks: 2,
          hint: "Li = crimson, Na = yellow (very bright), K = lilac, Cu = blue-green, Ca = orange-red.",
        },
        {
          question: "Describe the test for hydrogen gas and state the result.",
          answer: "Hold a lit splint near the gas. Hydrogen burns with a squeaky pop (a small explosion). The flame ignites the hydrogen rapidly.",
          marks: 2,
          hint: "Lit splint + hydrogen → squeaky pop.",
        },
      ],
      mid: [
        {
          question: "Describe how you would test a solution to determine whether it contains Fe²⁺, Fe³⁺, or Cu²⁺ ions. State the reagent used and the observation for each ion.",
          answer: "Add sodium hydroxide solution (NaOH) to the unknown solution. Fe²⁺: Produces a green precipitate of iron(II) hydroxide. Fe²⁺ + 2OH⁻ → Fe(OH)₂ (green). Fe³⁺: Produces a brown/rust-coloured precipitate of iron(III) hydroxide. Fe³⁺ + 3OH⁻ → Fe(OH)₃ (brown). Cu²⁺: Produces a blue precipitate of copper(II) hydroxide. Cu²⁺ + 2OH⁻ → Cu(OH)₂ (blue). The precipitates form immediately on addition of NaOH and do not dissolve in excess (unlike Al³⁺ and Zn²⁺). Each colour is distinctive.",
          marks: 4,
          hint: "Reagent: NaOH solution. Fe²⁺ → green precipitate, Fe³⁺ → brown precipitate, Cu²⁺ → blue precipitate. Write ionic equations for each.",
        },
      ],
      long: [
        {
          question: "Describe the chemical tests used to identify the following: (a) carbonate ions (CO₃²⁻), (b) chloride ions (Cl⁻), (c) sulfate ions (SO₄²⁻). For each, state the reagent(s), the observation, and write an ionic equation where appropriate. Also describe the tests for chlorine gas and oxygen gas.",
          answer: "(a) Carbonate ions: Add dilute hydrochloric acid (HCl). Effervescence occurs — bubbles of colourless gas (CO₂) are produced. Pass the gas through limewater [Ca(OH)₂(aq)]. The limewater turns milky/cloudy. CO₃²⁻ + 2H⁺ → H₂O + CO₂. CO₂ + Ca(OH)₂ → CaCO₃ + H₂O (white precipitate makes it cloudy). (b) Chloride ions: Acidify the solution with dilute nitric acid (to remove interfering ions), then add silver nitrate solution (AgNO₃). A white precipitate of silver chloride forms. Ag⁺ + Cl⁻ → AgCl (white precipitate, curdy). The precipitate is soluble in dilute ammonia. (c) Sulfate ions: Acidify with dilute hydrochloric acid (to remove interfering ions such as carbonates), then add barium chloride solution (BaCl₂). A white precipitate of barium sulfate forms. Ba²⁺ + SO₄²⁻ → BaSO₄ (white precipitate, insoluble in dilute acid). Test for chlorine gas: Hold damp litmus paper near the gas. Chlorine bleaches the damp litmus paper, turning it white (first it may turn red due to acidity, then bleaches white). Chlorine dissolves in water to form HCl and HOCl (bleaching agent). Test for oxygen gas: Insert a glowing splint into the gas. The glowing splint relights.",
          marks: 7,
          hint: "Carbonates: HCl → CO₂, limewater turns cloudy. Chlorides: HNO₃ then AgNO₃ → white AgCl precipitate. Sulfates: HCl then BaCl₂ → white BaSO₄ precipitate. Chlorine: bleaches damp litmus. Oxygen: relights glowing splint.",
        },
      ],
      flashcard: [
        {
          term: "Flame Test Colours",
          definition: "Li⁺ = crimson/red. Na⁺ = yellow (very bright, dominant). K⁺ = lilac. Ca²⁺ = orange-red. Cu²⁺ = blue-green. Method: clean nichrome wire in HCl, dip in sample, hold in roaring Bunsen flame, observe colour.",
          example: "Sodium contamination turns any flame yellow — clean the wire thoroughly between tests.",
        },
        {
          term: "Precipitate Tests for Metal Ions",
          definition: "Add NaOH(aq) to test solution. Fe²⁺ → green precipitate [Fe(OH)₂]. Fe³⁺ → brown/rust precipitate [Fe(OH)₃]. Cu²⁺ → blue precipitate [Cu(OH)₂]. Ca²⁺ → white precipitate. Al³⁺ → white precipitate (dissolves in excess NaOH). Zn²⁺ → white precipitate (dissolves in excess NaOH).",
          example: "Fe²⁺ + 2OH⁻ → Fe(OH)₂↓ (green). Fe³⁺ + 3OH⁻ → Fe(OH)₃↓ (brown).",
        },
        {
          term: "Testing for Gases",
          definition: "H₂: lit splint → squeaky pop. O₂: glowing splint → relights. CO₂: limewater → turns milky. Cl₂: damp litmus paper → bleaches white. NH₃: damp red litmus → turns blue. SO₂: damp acidified potassium dichromate → turns green.",
          example: "CO₂ test: bubble gas through Ca(OH)₂(aq) → CaCO₃ white precipitate makes it cloudy.",
        },
      ],
    },
    "Chromatography": {
      short: [
        {
          question: "In paper chromatography, a spot of ink travels 4.5 cm from the baseline and the solvent front travels 7.5 cm. Calculate the Rf value.",
          answer: "Rf = distance moved by spot ÷ distance moved by solvent front = 4.5 ÷ 7.5 = 0.60.",
          marks: 2,
          hint: "Rf = distance of spot ÷ distance of solvent front. Always between 0 and 1.",
        },
        {
          question: "In a paper chromatography experiment to analyse food colourings, a sample produces two spots. What does this tell you about the food colouring?",
          answer: "The food colouring is a mixture of (at least) two different coloured substances. Each spot represents a different compound that has been separated because they have different solubilities in the solvent and different attractions to the paper (stationary phase).",
          marks: 2,
          hint: "Number of spots = number of different compounds. Two spots = mixture of at least two substances.",
        },
      ],
      mid: [
        {
          question: "Describe the method for performing paper chromatography to separate and identify the colours in a food dye sample. Include how you would use Rf values to identify an unknown compound.",
          answer: "Method: Draw a pencil baseline (not pen — ink would run) near the bottom of a piece of chromatography paper. Place a small concentrated spot of the food dye on the baseline using a capillary tube or pencil mark as guide. Place the paper in a suitable solvent (e.g. water or ethanol) in a beaker so the solvent level is below the baseline — the spots must not touch the solvent. Cover the beaker to prevent evaporation. Allow the solvent to travel up the paper (chromatography). When the solvent front is near the top, remove the paper and immediately mark the solvent front position with a pencil. Allow to dry. Measure the distance from the baseline to the solvent front and to the centre of each spot. Calculate Rf = distance moved by spot ÷ distance moved by solvent front. To identify an unknown dye, run known reference dyes alongside the unknown on the same chromatogram. Compare Rf values: a dye in the unknown matches a known compound if their Rf values are the same under identical conditions. Alternatively, compare the number of spots and their Rf values to a database.",
          marks: 4,
          hint: "Pencil baseline, concentrated spot, solvent below baseline, cover beaker, mark solvent front. Rf = spot distance ÷ solvent distance. Compare Rf to known standards for identification.",
        },
      ],
      long: [
        {
          question: "Explain the principles of paper chromatography, including the roles of the stationary phase and mobile phase. Explain why different compounds travel different distances. Describe how chromatography can be used to determine whether a sample is pure, and how Rf values are used in identification. Give an example of a real-world application.",
          answer: "Principles: Paper chromatography separates mixtures based on the different affinities of substances for the stationary phase (the paper, which holds water) and the mobile phase (the solvent, which moves up the paper by capillary action). Why compounds travel different distances: Each compound has different intermolecular forces with both the stationary phase (paper/water) and the mobile phase (solvent). A compound that is more soluble in the solvent / has weaker attractions to the paper will travel further (higher Rf). A compound with stronger attraction to the paper / less soluble in the solvent will travel less far (lower Rf). Separation occurs because these differences cause each compound to spend different proportions of time moving with the solvent versus adsorbed on the paper. Determining purity: A pure substance produces a single spot on a chromatogram. A mixture produces multiple spots (one for each component). If a substance is pure, only one spot will appear regardless of how long the chromatogram runs. Rf values for identification: Rf = distance moved by spot ÷ distance moved by solvent front. Rf values are characteristic for a given compound under the same conditions (same solvent, same paper, same temperature). Compare the Rf of an unknown with known compounds run on the same chromatogram, or with published Rf data. Real-world application: Food dye analysis — chromatography checks that food colourings contain only approved dyes and can detect illegal or undeclared additives. Also used in forensic science (analysing inks in documents), in medicine (checking purity of pharmaceutical compounds), and in biochemistry (separating amino acids).",
          marks: 7,
          hint: "Stationary phase = paper (water), mobile phase = solvent. Different Rf due to different attractions to each phase. Pure substance = one spot. Rf = spot ÷ solvent front. Application: food dye analysis, forensics.",
        },
      ],
      flashcard: [
        {
          term: "Rf Value",
          definition: "Rf = distance moved by substance ÷ distance moved by solvent front. Always between 0 and 1. Characteristic for a given substance under the same conditions (same solvent, temperature, paper). Used to identify unknown compounds by comparison with known standards.",
          example: "Spot moves 3.6 cm, solvent front 6.0 cm: Rf = 3.6 ÷ 6.0 = 0.60.",
        },
        {
          term: "Paper Chromatography",
          definition: "Stationary phase: paper (holds water). Mobile phase: solvent moves up paper by capillary action. Compounds with greater solubility in solvent / weaker attraction to paper travel further (higher Rf). A pure substance gives one spot; a mixture gives multiple spots. Pencil baseline (not ink). Solvent below baseline.",
          example: "Food dye chromatography: a dye producing 3 spots is a mixture of 3 compounds. Compare Rf values to known dyes to identify each component.",
        },
      ],
    },
  },
  "The Atmosphere & Earth's Resources": {
    "Atmosphere & Climate Change": {
      short: [
        {
          question: "State the approximate percentages of nitrogen, oxygen, and argon in the current atmosphere.",
          answer: "Nitrogen (N₂): approximately 78%. Oxygen (O₂): approximately 21%. Argon (Ar): approximately 1%. Carbon dioxide (CO₂): approximately 0.04%.",
          marks: 2,
          hint: "78% N₂, 21% O₂, ~1% Ar, 0.04% CO₂.",
        },
        {
          question: "Name three greenhouse gases and state one human activity that increases the concentration of each.",
          answer: "Carbon dioxide (CO₂): burning fossil fuels (combustion). Methane (CH₄): livestock farming (enteric fermentation), landfill. Water vapour (H₂O): increased evaporation from warming oceans (less directly controlled by one activity, but also released in combustion).",
          marks: 3,
          hint: "Greenhouse gases: CO₂ (combustion), CH₄ (livestock/landfill), H₂O vapour, N₂O (agriculture/fertilisers).",
        },
      ],
      mid: [
        {
          question: "Explain the greenhouse effect and how human activities are enhancing it, leading to climate change. Include the names of at least two greenhouse gases.",
          answer: "The natural greenhouse effect: Short-wavelength radiation (visible light) from the Sun passes through the atmosphere and is absorbed by the Earth's surface, which warms up and re-radiates longer-wavelength infrared (thermal) radiation. Greenhouse gases — including carbon dioxide (CO₂), methane (CH₄), and water vapour — absorb this infrared radiation and re-emit it in all directions, including back towards Earth. This keeps the Earth warmer than it would otherwise be. This is natural and essential for life. The enhanced greenhouse effect: Human activities — particularly the burning of fossil fuels, deforestation, and agriculture — have significantly increased concentrations of CO₂ and CH₄ in the atmosphere. More greenhouse gas molecules absorb more infrared radiation, causing more energy to be retained in the Earth–atmosphere system. This leads to global average temperatures rising (global warming), which is driving climate change: more extreme weather events, rising sea levels (due to ice melting and thermal expansion of oceans), changes in rainfall patterns, and threats to biodiversity.",
          marks: 4,
          hint: "Natural greenhouse effect: Sun's radiation in, Earth radiates IR, greenhouse gases absorb/re-emit IR. Enhanced effect: human activities increase CO₂/CH₄ → more IR trapped → global warming → climate change impacts.",
        },
      ],
      long: [
        {
          question: "Describe how the Earth's early atmosphere is thought to have formed and how it has changed to its current composition. Include the role of volcanic activity, photosynthesis, and the formation of sedimentary rocks and fossil fuels. Discuss the evidence for and potential impacts of human-induced climate change.",
          answer: "Early atmosphere formation: The early Earth (~4.6 billion years ago) had an atmosphere dominated by volcanic outgassing: mostly carbon dioxide (CO₂), water vapour (H₂O), nitrogen (N₂), and small amounts of methane and ammonia. Little or no free oxygen. As the Earth cooled, water vapour condensed to form the oceans. CO₂ dissolved in the oceans and was also removed to form carbonate rocks (sedimentary deposits, e.g. limestone: CO₂ + Ca(OH)₂ → CaCO₃). Photosynthesis: The evolution of photosynthetic organisms (cyanobacteria, ~3.5 billion years ago) began producing O₂: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. O₂ levels gradually rose over billions of years. N₂ accumulated as it is largely unreactive. Fossil fuels: Dead organisms from ancient seas and forests were buried under sediment, preventing decomposition. Over millions of years, heat and pressure converted them to coal, oil, and gas. The carbon in these fuels is from CO₂ that was originally fixed by ancient photosynthesis. Burning fossil fuels returns this stored CO₂ to the atmosphere. Evidence for human-induced climate change: Global average temperature records show a sharp increase since industrialisation (~1850). Atmospheric CO₂ measurements (e.g. Keeling Curve) show steady increase from ~280 ppm (pre-industrial) to >420 ppm. Ice core data correlates CO₂ levels with global temperatures over 800,000 years. Retreat of glaciers and Arctic sea ice observed. Sea levels rising. Potential impacts: more frequent and intense weather events (floods, droughts, hurricanes), sea level rise threatening coastal regions, ecosystem disruption and species extinction, food security risks.",
          marks: 7,
          hint: "Early atmosphere: CO₂ rich, volcanic, no O₂. CO₂ removed by: dissolving in oceans, forming limestone (CaCO₃), photosynthesis. O₂ built up via photosynthesis. Fossil fuels: ancient carbon stores. Evidence for climate change: temperature records, CO₂ measurements, ice cores. Impacts: weather, sea level, biodiversity.",
        },
      ],
      flashcard: [
        {
          term: "Current Atmosphere Composition",
          definition: "N₂ ≈ 78%, O₂ ≈ 21%, Ar ≈ 1%, CO₂ ≈ 0.04%, plus trace gases and variable water vapour. O₂ built up from photosynthesis over billions of years. CO₂ reduced from early volcanic atmosphere by: dissolving in oceans, forming carbonate rocks, photosynthesis, fossil fuel formation.",
          example: "Early Earth: ~95% CO₂ (like Venus today). Modern Earth: 0.04% CO₂ — most was removed by biological and geological processes.",
        },
        {
          term: "Greenhouse Effect & Climate Change",
          definition: "Greenhouse gases (CO₂, CH₄, H₂O vapour) absorb outgoing infrared radiation from Earth's surface and re-emit it, warming the planet. Human activities (combustion, deforestation, agriculture) enhance this effect → global warming → climate change. Impacts: rising sea levels, extreme weather, biodiversity loss.",
          example: "CO₂ increased from ~280 ppm (pre-industrial) to >420 ppm (2024). Global average temperature has risen ~1.2°C since 1850.",
        },
      ],
    },
    "Earth's Resources & Sustainability": {
      short: [
        {
          question: "Distinguish between finite (non-renewable) and renewable resources. Give one example of each.",
          answer: "Finite (non-renewable) resources are formed much more slowly than they are used; they will eventually run out (e.g. crude oil, natural gas, metal ores). Renewable resources can be replaced at the same rate or faster than they are used and will not run out (e.g. timber from sustainably managed forests, solar energy, wind energy).",
          marks: 2,
          hint: "Finite = formed slowly, will run out. Renewable = replenished at least as fast as used.",
        },
        {
          question: "Give two steps used to treat freshwater from rivers and lakes to make it safe to drink.",
          answer: "Filtration: passing water through layers of sand and gravel to remove insoluble particles and some bacteria. Chlorination: adding chlorine gas (or sodium hypochlorite) to kill harmful microorganisms/bacteria and make the water safe to drink.",
          marks: 2,
          hint: "Two of: sedimentation, filtration (sand/gravel), chlorination, pH adjustment.",
        },
      ],
      mid: [
        {
          question: "Describe the steps involved in treating river water to make it safe to drink. Include the purpose of each step. Then explain why sea water cannot simply be treated in the same way.",
          answer: "River water treatment: 1. Sedimentation: Water is held in settlement tanks where large particles and suspended solids sink to the bottom under gravity. 2. Filtration: Water passes through beds of sand and gravel to remove smaller particles, sediment, and some microorganisms. 3. Chlorination: Chlorine is added in controlled amounts to kill bacteria and other pathogens. The water is now safe to drink. Optional: pH adjustment (adding lime to raise pH if too acidic) and fluoridation (in some areas) for dental health. Sea water: Sea water contains high concentrations of dissolved salts (mainly NaCl). Simple filtration and chlorination do not remove dissolved ions. To make sea water drinkable, desalination is needed — either by distillation (boiling to produce steam, then condensing) or reverse osmosis (forcing water at high pressure through a semi-permeable membrane that allows water molecules through but not salt ions). Both methods require significantly more energy and are more expensive than treating fresh water.",
          marks: 4,
          hint: "River water: sedimentation (settling), filtration (sand/gravel), chlorination (kill bacteria). Sea water: dissolved salts — need desalination by distillation or reverse osmosis. Much more energy-intensive.",
        },
      ],
      long: [
        {
          question: "Explain what is meant by a life cycle assessment (LCA) and how it is used to evaluate the sustainability of a product. Discuss ways in which the use of Earth's limited resources can be made more sustainable, with reference to metals, water, and the Haber process.",
          answer: "Life Cycle Assessment (LCA): An LCA evaluates the environmental impact of a product across its entire life: (1) Extraction and processing of raw materials. (2) Manufacturing and packaging. (3) Use of the product. (4) End of life (disposal, recycling, or reuse). For each stage, inputs (energy, materials, water) and outputs (pollutants, waste, CO₂) are quantified. This allows comparison of products or processes to identify those with lower environmental impact. LCAs can be subjective — different weightings for environmental factors (e.g. energy vs water use) can lead to different conclusions. Sustainability of metals: Metal ores are finite resources. Recycling metals (e.g. aluminium, steel, copper) requires far less energy than extracting from ore. For example, recycling aluminium saves ~95% of the energy needed for extraction. Phytoremediation and bioleaching allow extraction from low-grade ores with less environmental impact. Reducing consumption (using less metal overall) and reusing products (e.g. glass bottles) are preferable to recycling. Water sustainability: Water is an essential resource. Reducing water use in industry (e.g. recycling water in cooling systems), fixing leaks in water distribution networks, and developing more energy-efficient desalination (e.g. improved reverse osmosis membranes) improve sustainability. Greywater recycling in homes reduces demand. Haber process sustainability: The Haber process produces ammonia (for fertilisers feeding ~50% of the world's population) but is energy-intensive (uses natural gas as H₂ source; runs at ~450°C and ~200 atm). Research into: using renewable energy (green hydrogen from electrolysis of water using solar/wind power), developing catalysts that work at lower temperatures and pressures, and improving yields to reduce energy waste per tonne of NH₃ produced are all improving sustainability.",
          marks: 7,
          hint: "LCA: 4 stages (extraction, manufacture, use, disposal). Limitations (subjectivity). Metals: recycling saves energy. Water: treatment, recycling, desalination. Haber: energy-intensive, green hydrogen, catalyst research. Reduce → reuse → recycle hierarchy.",
        },
      ],
      flashcard: [
        {
          term: "Life Cycle Assessment (LCA)",
          definition: "Evaluates the environmental impact of a product from cradle to grave: (1) raw material extraction, (2) manufacturing, (3) use, (4) disposal/recycling. Considers energy use, water, pollution, and waste at each stage. Used to compare the sustainability of products or processes.",
          example: "Comparing a glass bottle vs a plastic bottle: glass requires more energy to manufacture and transport (heavier) but is recycled more efficiently and doesn't release microplastics.",
        },
        {
          term: "Water Treatment & Sustainable Resources",
          definition: "Water treatment: sedimentation → filtration (sand/gravel) → chlorination. Sea water needs desalination (distillation or reverse osmosis — energy-intensive). Sustainability: reduce use of finite resources; recycle materials (aluminium recycling saves ~95% energy vs extraction); use renewable energy; LCA guides product design.",
          example: "Reverse osmosis forces water through semi-permeable membrane at high pressure, leaving salt ions behind. Used in water-scarce countries.",
        },
      ],
    },
  },
};
