import type { SubtopicContent } from '@/types';

/**
 * Combined Science subtopic bank.
 * Covers the most-picked topics across Biology, Chemistry and Physics strands
 * of the GCSE Combined Science specification (AQA, Edexcel, OCR, WJEC).
 *
 * Each subtopic includes short, mid and long-mark questions plus flashcards.
 */
export const combinedScienceSubtopics: Record<string, Record<string, SubtopicContent>> = {
  "Cell Biology": {
    "Cell Structure & Microscopy": {
      short: [
        { question: "Name three structures found in plant cells but not animal cells.", answer: "Cell wall, chloroplasts and a permanent vacuole.", marks: 3, hint: "Plant cells have three extras animal cells lack" },
        { question: "What is the role of the mitochondria?", answer: "Mitochondria are the site of aerobic respiration, producing ATP (energy) for the cell.", marks: 1, hint: "Where energy is released" },
      ],
      mid: [
        { question: "Calculate the magnification of an image if the actual size of a cell is 50 \u00b5m and the image is 5 mm wide.", answer: "Magnification = image size / actual size. Convert: 5 mm = 5000 \u00b5m. Magnification = 5000 / 50 = \u00d7100.", marks: 3, hint: "Convert units first; magnification has no units" },
      ],
      long: [
        { question: "Compare light microscopes and electron microscopes, including resolution, magnification and what they can show.", answer: "Light microscopes use visible light, max magnification ~\u00d72000, resolution ~200 nm. They show whole cells, nuclei, chloroplasts, and can view living specimens. Electron microscopes use a beam of electrons (much shorter wavelength), max magnification ~\u00d7500,000, resolution ~0.1 nm. They reveal sub-cellular structures like ribosomes, mitochondrial cristae and viruses but specimens must be dead and prepared in vacuum.", marks: 6, hint: "Compare 3 things: magnification, resolution, what each can see" },
      ],
      flashcard: [
        { term: "Animal Cell Structures", definition: "Nucleus, cytoplasm, cell membrane, mitochondria, ribosomes.", example: "Red blood cells lose their nucleus to fit more haemoglobin" },
        { term: "Plant Cell Extras", definition: "Cell wall (cellulose, support), chloroplasts (photosynthesis), permanent vacuole (sap, turgor pressure).", example: null },
        { term: "Magnification Formula", definition: "Magnification = image size \u00f7 actual size. Always convert units first (1 mm = 1000 \u00b5m).", example: "5 mm image of 50 \u00b5m cell \u2192 \u00d7100" },
      ],
    },
    "Diffusion & Osmosis": {
      short: [
        { question: "Define diffusion.", answer: "The net movement of particles from a region of higher concentration to a region of lower concentration, down a concentration gradient. It is a passive process (no energy required).", marks: 2, hint: "High to low — passive" },
        { question: "Define osmosis.", answer: "The net movement of water molecules from a dilute solution (high water potential) to a concentrated solution (low water potential) through a partially permeable membrane.", marks: 2, hint: "Water moving through a partially permeable membrane" },
      ],
      mid: [
        { question: "A potato chip placed in distilled water gains mass. Explain why, in terms of osmosis.", answer: "The water potential outside the chip (pure water) is higher than inside the cells. Water moves into the cells by osmosis through the partially permeable cell membrane. The cells become turgid, so the chip gains mass.", marks: 3, hint: "Compare water potential inside and outside; state direction" },
      ],
      long: [
        { question: "Describe how you would investigate the effect of sucrose concentration on the mass of potato chips. Include controls and how to make the results reliable.", answer: "Cut chips of equal length and width using a cork borer. Record initial mass on a balance. Place each chip in a different sucrose concentration (e.g. 0.0, 0.2, 0.4, 0.6, 0.8, 1.0 mol/dm\u00b3). Use the same volume of solution and the same temperature. Leave for 30 minutes. Remove, blot gently, reweigh. Calculate percentage change in mass = ((final \u2212 initial)/initial) \u00d7 100. Repeat each concentration three times and take a mean to improve reliability. Plot % mass change against concentration. The point where % change = 0 gives the concentration equal to the cell sap.", marks: 6, hint: "Cover: equal-size chips, IV/DV, controls, repeats, calculation" },
      ],
      flashcard: [
        { term: "Diffusion", definition: "Passive movement of particles from high to low concentration. No energy needed. Faster with bigger gradient, higher temperature, larger surface area.", example: "Oxygen moving from alveoli into blood" },
        { term: "Osmosis", definition: "Movement of water from high water potential to low water potential through a partially permeable membrane.", example: "Plant cells in pure water become turgid; in salt water they become flaccid/plasmolysed" },
        { term: "Active Transport", definition: "Movement of particles AGAINST a concentration gradient using energy from respiration (ATP). Uses carrier proteins.", example: "Root hair cells absorb mineral ions from dilute soil water" },
      ],
    },
    "Cell Division & Stem Cells": {
      short: [
        { question: "Name the type of cell division used for growth and repair.", answer: "Mitosis.", marks: 1, hint: "Produces two identical daughter cells" },
        { question: "What is a stem cell?", answer: "An undifferentiated cell that can divide and become specialised into different cell types.", marks: 2, hint: "Undifferentiated, can become other cell types" },
      ],
      mid: [
        { question: "Describe two medical uses of stem cells.", answer: "1) Bone marrow transplants \u2014 adult stem cells from bone marrow are used to treat leukaemia by replacing damaged blood-forming cells. 2) Therapeutic cloning / embryonic stem cells could be used to grow new tissues for conditions like type 1 diabetes (insulin-producing cells) or paralysis (nerve cells).", marks: 4, hint: "Give two examples with the condition treated" },
      ],
      long: [
        { question: "Discuss the ethical issues surrounding the use of embryonic stem cells in medicine.", answer: "Arguments for: embryonic stem cells can become any cell type, so they have huge potential to treat conditions like Parkinson\u2019s, paralysis and diabetes. Embryos are often surplus from IVF. Suffering of patients with currently incurable diseases could be reduced. Arguments against: extracting stem cells destroys the embryo, which some believe is the start of a human life. Religious objections. Risk of rejection or tumour formation. Possible safer alternatives like adult stem cells or induced pluripotent stem cells (iPSCs) avoid embryo use. A balanced view considers both the potential benefits and the moral status of the embryo.", marks: 6, hint: "Give arguments for, arguments against, then conclude" },
      ],
      flashcard: [
        { term: "Mitosis", definition: "Cell division that produces two genetically identical diploid daughter cells. Used for growth, repair, and asexual reproduction.", example: "Skin cells dividing to heal a cut" },
        { term: "Meiosis", definition: "Cell division that produces four genetically different haploid gametes. Occurs in reproductive organs.", example: "Sperm and egg formation" },
        { term: "Stem Cell", definition: "An undifferentiated cell capable of dividing and differentiating into specialised cell types. Embryonic = pluripotent; adult = limited to certain tissues.", example: "Bone marrow stem cells \u2192 red and white blood cells" },
      ],
    },
  },

  "Organisation & Systems": {
    "Digestive System": {
      short: [
        { question: "Name the enzyme that breaks down starch.", answer: "Amylase (produced in the salivary glands and pancreas).", marks: 1, hint: "Starts working in your mouth" },
        { question: "What is the role of bile in digestion?", answer: "Bile neutralises stomach acid (it is alkaline) and emulsifies fats \u2014 breaks large fat droplets into smaller ones to increase surface area for lipase.", marks: 2, hint: "Two roles: neutralise and emulsify" },
      ],
      mid: [
        { question: "Explain how the small intestine is adapted for absorption.", answer: "It is very long, providing time for absorption. The inner surface has villi and microvilli, giving a huge surface area. Each villus has a thin wall (one cell thick) for a short diffusion distance, a rich blood capillary network to maintain a steep concentration gradient, and a lacteal to absorb fatty acids.", marks: 4, hint: "Surface area, thin wall, blood supply, lacteal" },
      ],
      long: [
        { question: "Describe the path of a starchy meal through the digestive system, including the enzymes that act on it and where each works.", answer: "Mouth: chewing increases surface area; salivary amylase begins breaking starch into maltose. Oesophagus: peristalsis pushes food to the stomach. Stomach: acidic conditions kill bacteria; protease (pepsin) digests protein. Small intestine: pancreatic amylase finishes starch \u2192 maltose; maltase \u2192 glucose. Bile from the liver neutralises acid and emulsifies fat. Lipase digests fat \u2192 fatty acids + glycerol. Glucose, amino acids and fatty acids are absorbed through villi. Large intestine: water reabsorbed. Rectum: faeces stored.", marks: 6, hint: "Walk through each organ, naming enzymes and conditions" },
      ],
      flashcard: [
        { term: "Amylase", definition: "An enzyme that breaks starch down into maltose (a sugar). Made in the salivary glands and pancreas; works in the mouth and small intestine.", example: null },
        { term: "Protease", definition: "An enzyme that breaks proteins down into amino acids. Made in the stomach (pepsin), pancreas and small intestine.", example: null },
        { term: "Lipase", definition: "An enzyme that breaks lipids (fats) down into fatty acids and glycerol. Made in the pancreas and small intestine. Works best with bile.", example: null },
        { term: "Bile", definition: "Made in the liver, stored in the gall bladder. Alkaline (neutralises stomach acid); emulsifies fat into smaller droplets for lipase.", example: null },
      ],
    },
  },

  "Atomic Structure": {
    "Subatomic Particles": {
      short: [
        { question: "State the relative charge and relative mass of a proton, neutron and electron.", answer: "Proton: +1 charge, mass 1. Neutron: 0 charge, mass 1. Electron: -1 charge, mass ~1/1836 (negligible).", marks: 3, hint: "Three particles, three rows" },
        { question: "Where in an atom are protons found?", answer: "In the nucleus.", marks: 1, hint: "Centre of the atom" },
      ],
      mid: [
        { question: "An atom of magnesium has atomic number 12 and mass number 24. State the number of protons, neutrons and electrons.", answer: "Protons = atomic number = 12. Electrons = protons (neutral atom) = 12. Neutrons = mass \u2212 atomic = 24 \u2212 12 = 12.", marks: 3, hint: "Atomic number = protons; mass \u2212 atomic = neutrons" },
      ],
      long: [
        { question: "Describe how the model of the atom changed from Dalton\u2019s solid sphere to the modern nuclear model, including key experiments.", answer: "Dalton (early 1800s): atoms are tiny, indivisible solid spheres. Thomson (1897): discovered the electron \u2014 \u2018plum pudding\u2019 model, positive sphere with negative electrons embedded. Rutherford (1911): alpha particle scattering experiment \u2014 most particles passed through gold foil but a few deflected backwards, showing atoms are mostly empty space with a small dense positive nucleus. Bohr (1913): electrons orbit the nucleus in fixed energy levels (shells). Chadwick (1932): discovered the neutron in the nucleus. Modern model: a small dense nucleus of protons and neutrons, surrounded by electrons in shells.", marks: 6, hint: "Walk through Dalton \u2192 Thomson \u2192 Rutherford \u2192 Bohr \u2192 Chadwick" },
      ],
      flashcard: [
        { term: "Proton", definition: "Positively charged (+1) particle in the nucleus. Relative mass 1. Number of protons = atomic number = identity of the element.", example: null },
        { term: "Neutron", definition: "Neutral particle (charge 0) in the nucleus. Relative mass 1. Different numbers of neutrons in the same element = isotopes.", example: null },
        { term: "Electron", definition: "Negatively charged (-1) particle in shells around the nucleus. Mass is negligible (~1/1836). Determines chemical reactivity.", example: null },
        { term: "Isotope", definition: "Atoms of the same element with the same number of protons but different numbers of neutrons. Same chemistry, different mass.", example: "Carbon-12 and carbon-14 are isotopes of carbon" },
      ],
    },
  },

  "Bonding & Structure": {
    "Ionic & Covalent Bonding": {
      short: [
        { question: "What is an ionic bond?", answer: "The electrostatic force of attraction between oppositely charged ions, formed when electrons transfer from a metal to a non-metal.", marks: 2, hint: "Metal + non-metal — transfer of electrons" },
        { question: "What is a covalent bond?", answer: "A shared pair of electrons between two non-metal atoms.", marks: 1, hint: "Two non-metals sharing" },
      ],
      mid: [
        { question: "Explain why sodium chloride has a high melting point but is brittle.", answer: "Sodium chloride forms a giant ionic lattice with strong electrostatic forces of attraction between oppositely charged Na\u207a and Cl\u207b ions in all directions. Lots of energy is needed to overcome these forces, so the melting point is high. It is brittle because if the lattice is hit, layers shift so like charges line up and repel, splitting the crystal.", marks: 4, hint: "Cover both: structure for high MP, layer movement for brittleness" },
      ],
      long: [
        { question: "Compare the bonding, structure and properties of diamond and graphite, both forms of carbon.", answer: "Diamond: each carbon atom forms 4 covalent bonds in a tetrahedral arrangement, giving a giant covalent structure. Very hard, very high melting point (lots of strong bonds to break), does not conduct electricity (no free electrons \u2014 all 4 outer electrons used in bonds). Used for cutting tools. Graphite: each carbon forms 3 covalent bonds in flat hexagonal layers. Layers are held together by weak forces, so they can slide \u2014 graphite is soft and slippery. The 4th outer electron is delocalised between layers, so graphite conducts electricity. High melting point. Used as a lubricant and in electrodes/pencils.", marks: 6, hint: "For each: bonding, structure, hardness, conductivity, use" },
      ],
      flashcard: [
        { term: "Ionic Bond", definition: "Electrostatic attraction between oppositely charged ions. Formed when a metal loses electrons to a non-metal. Strong, gives high melting points.", example: "NaCl: Na loses 1e\u207b to Cl" },
        { term: "Covalent Bond", definition: "A shared pair of electrons between two non-metals. Each atom gets a full outer shell. Found in molecules and giant covalent structures.", example: "H\u2082, H\u2082O, CH\u2084, diamond, graphite" },
        { term: "Metallic Bond", definition: "Attraction between positive metal ions and a sea of delocalised electrons. Allows conduction of heat and electricity, malleability.", example: "Copper, iron, aluminium" },
      ],
    },
  },

  "Chemical Changes": {
    "Acids & Bases": {
      short: [
        { question: "What is the pH range of an acid?", answer: "Less than 7 (0\u20136).", marks: 1, hint: "Below neutral" },
        { question: "Write a general word equation for the reaction between an acid and a metal carbonate.", answer: "Acid + metal carbonate \u2192 salt + water + carbon dioxide.", marks: 2, hint: "Three products: salt, water, gas" },
      ],
      mid: [
        { question: "Describe how you could make pure dry copper sulfate crystals from copper oxide and dilute sulfuric acid.", answer: "Warm sulfuric acid in a beaker. Add copper oxide a little at a time, stirring, until no more reacts (excess solid present). Filter to remove unreacted copper oxide. Pour the filtrate into an evaporating basin and heat gently to evaporate some water. Leave to cool so crystals form (crystallisation). Pat dry with filter paper.", marks: 5, hint: "Steps: react excess, filter, crystallise, dry" },
      ],
      long: [
        { question: "Explain the difference between strong and weak acids in terms of ionisation, and give examples.", answer: "Strong acids fully ionise (dissociate) in water \u2014 every molecule splits into H\u207a ions and the negative ion. Examples: hydrochloric acid (HCl), sulfuric acid (H\u2082SO\u2084), nitric acid (HNO\u2083). Weak acids only partially ionise \u2014 only a small fraction of the molecules form H\u207a. Examples: ethanoic acid, citric acid, carbonic acid. At the same concentration, a strong acid has a much lower pH (more H\u207a). pH and H\u207a concentration are linked: each unit drop in pH = 10\u00d7 more H\u207a.", marks: 6, hint: "Ionisation, examples, pH link" },
      ],
      flashcard: [
        { term: "Acid", definition: "A substance that releases H\u207a ions in water. pH < 7. Tastes sour, turns litmus red.", example: "HCl, H\u2082SO\u2084, HNO\u2083" },
        { term: "Base / Alkali", definition: "Bases react with acids to form a salt and water. Alkalis are bases that dissolve in water and release OH\u207b ions. pH > 7.", example: "NaOH, KOH, Ca(OH)\u2082" },
        { term: "Neutralisation", definition: "Reaction between an acid and a base/alkali to form a salt and water. H\u207a + OH\u207b \u2192 H\u2082O.", example: "HCl + NaOH \u2192 NaCl + H\u2082O" },
      ],
    },
  },

  "Energy": {
    "Energy Stores": {
      short: [
        { question: "Name four energy stores.", answer: "Kinetic, gravitational potential, chemical, thermal (other valid: elastic, magnetic, electrostatic, nuclear).", marks: 4, hint: "Stores, not transfers" },
        { question: "State the equation for kinetic energy.", answer: "KE = 1/2 \u00d7 mass \u00d7 velocity\u00b2 (E\u2096 = \u00bdmv\u00b2). Mass in kg, velocity in m/s, energy in J.", marks: 2, hint: "Half m v squared" },
      ],
      mid: [
        { question: "A 60 kg cyclist accelerates from 0 to 8 m/s. Calculate the kinetic energy gained.", answer: "KE = \u00bd \u00d7 m \u00d7 v\u00b2 = 0.5 \u00d7 60 \u00d7 8\u00b2 = 0.5 \u00d7 60 \u00d7 64 = 1920 J.", marks: 3, hint: "Substitute into \u00bdmv\u00b2 \u2014 don\u2019t forget to square the velocity" },
      ],
      long: [
        { question: "A roller-coaster car of mass 500 kg starts at rest at the top of a 30 m hill. Assuming no friction, calculate its speed at the bottom. (g = 9.8 N/kg)", answer: "GPE at top = m \u00d7 g \u00d7 h = 500 \u00d7 9.8 \u00d7 30 = 147,000 J. With no friction, all GPE \u2192 KE. KE at bottom = 147,000 J. \u00bdmv\u00b2 = 147,000 \u2192 v\u00b2 = 2 \u00d7 147,000 / 500 = 588 \u2192 v = \u221a588 \u2248 24.2 m/s.", marks: 5, hint: "GPE = KE, then rearrange \u00bdmv\u00b2 = E to find v" },
      ],
      flashcard: [
        { term: "Kinetic Energy", definition: "Energy of a moving object. KE = \u00bd m v\u00b2. Doubles with mass; quadruples with velocity.", example: "Lorry vs cyclist at the same speed: lorry has much more KE" },
        { term: "Gravitational PE", definition: "Energy stored when an object is raised. GPE = m \u00d7 g \u00d7 h. g = 9.8 N/kg on Earth.", example: "Lifting a 1 kg book 1 m gains ~9.8 J of GPE" },
        { term: "Conservation of Energy", definition: "Energy cannot be created or destroyed, only transferred between stores. Total energy stays constant in a closed system.", example: "Pendulum: GPE \u2194 KE (some lost as heat over time)" },
      ],
    },
  },

  "Forces & Motion": {
    "Newton's Laws": {
      short: [
        { question: "State Newton\u2019s First Law.", answer: "An object will continue moving at the same velocity (or stay at rest) unless acted on by a resultant force.", marks: 2, hint: "Constant velocity unless..." },
        { question: "Write the equation linking force, mass and acceleration.", answer: "F = m \u00d7 a (Newton\u2019s Second Law). F in newtons, m in kg, a in m/s\u00b2.", marks: 1, hint: "Three letters" },
      ],
      mid: [
        { question: "A 70 kg cyclist accelerates at 2 m/s\u00b2. Calculate the resultant force on the cyclist.", answer: "F = m \u00d7 a = 70 \u00d7 2 = 140 N.", marks: 2, hint: "Direct substitution" },
      ],
      long: [
        { question: "Explain the difference between mass and weight, including how each is measured and their units.", answer: "Mass is the amount of matter in an object, measured in kilograms (kg) using a balance. It is the same anywhere in the universe. Weight is the force of gravity on an object\u2019s mass, measured in newtons (N) using a newton-meter (force-meter). Weight = mass \u00d7 gravitational field strength (W = m \u00d7 g). On Earth g \u2248 9.8 N/kg, so a 1 kg object weighs ~9.8 N. On the Moon g \u2248 1.6 N/kg, so the same object weighs only ~1.6 N \u2014 same mass, less weight.", marks: 5, hint: "Definition, unit, instrument, formula, example" },
      ],
      flashcard: [
        { term: "Newton\u2019s 1st Law", definition: "A body remains at rest or moves at constant velocity unless acted on by a resultant force. (\u2018Law of inertia\u2019.)", example: "Passenger jolts forward when a bus brakes" },
        { term: "Newton\u2019s 2nd Law", definition: "Resultant force = mass \u00d7 acceleration (F = ma). Larger force \u2192 larger acceleration; larger mass \u2192 smaller acceleration.", example: "Same engine in a heavy car accelerates more slowly" },
        { term: "Newton\u2019s 3rd Law", definition: "Every action has an equal and opposite reaction. Forces always come in pairs of equal size, opposite direction, on different objects.", example: "Walking: foot pushes ground back, ground pushes foot forward" },
      ],
    },
  },

  "Waves": {
    "Wave Equation": {
      short: [
        { question: "Write the wave equation linking speed, frequency and wavelength.", answer: "Wave speed = frequency \u00d7 wavelength (v = f \u00d7 \u03bb). Speed in m/s, frequency in Hz, wavelength in m.", marks: 1, hint: "v equals f times lambda" },
        { question: "What is the unit of frequency?", answer: "Hertz (Hz). 1 Hz = 1 wave per second.", marks: 1, hint: "Named after a German physicist" },
      ],
      mid: [
        { question: "A wave has a frequency of 50 Hz and a wavelength of 6 m. Calculate the wave speed.", answer: "v = f \u00d7 \u03bb = 50 \u00d7 6 = 300 m/s.", marks: 2, hint: "Direct substitution" },
      ],
      long: [
        { question: "Compare transverse and longitudinal waves, giving an example of each and describing how the particles move.", answer: "Transverse waves: oscillations are perpendicular (at 90\u00b0) to the direction of energy transfer. Particles move up and down while the wave moves sideways. Examples: water ripples, all electromagnetic waves (light, radio, X-rays), waves on a rope. Longitudinal waves: oscillations are parallel to the direction of energy transfer. Particles move back and forth, creating compressions and rarefactions. Examples: sound waves, P-waves in earthquakes. Both can be reflected, refracted and diffracted, and both transfer energy without transferring matter.", marks: 6, hint: "Direction of vibration, examples, common features" },
      ],
      flashcard: [
        { term: "Wave Equation", definition: "v = f \u00d7 \u03bb (wave speed = frequency \u00d7 wavelength). Units: m/s, Hz, m.", example: "Sound at 340 Hz with \u03bb = 1 m \u2192 v = 340 m/s" },
        { term: "Transverse Wave", definition: "Oscillations are perpendicular to the direction of energy transfer.", example: "Light, ripples on water, waves on a rope" },
        { term: "Longitudinal Wave", definition: "Oscillations are parallel to the direction of energy transfer. Compressions and rarefactions.", example: "Sound waves, P-waves in earthquakes" },
      ],
    },
  },

  "Electricity": {
    "Ohm's Law": {
      short: [
        { question: "State Ohm\u2019s Law.", answer: "Voltage = Current \u00d7 Resistance (V = IR). For an ohmic conductor at constant temperature, current is directly proportional to voltage.", marks: 2, hint: "V equals I times R" },
        { question: "What is the unit of resistance?", answer: "Ohm (\u03a9).", marks: 1, hint: "Greek letter omega" },
      ],
      mid: [
        { question: "A current of 2 A flows through a resistor when 12 V is applied. Calculate the resistance.", answer: "V = IR \u2192 R = V / I = 12 / 2 = 6 \u03a9.", marks: 2, hint: "Rearrange V = IR" },
      ],
      long: [
        { question: "Describe an experiment to investigate how the current through a fixed resistor depends on the voltage across it.", answer: "Set up a circuit with a battery, variable resistor, fixed resistor under test, ammeter in series and voltmeter in parallel across the fixed resistor. Adjust the variable resistor to change the voltage across the fixed resistor. Record voltage and current at several values. Reverse the connections to get negative values. Plot a graph of current (y) against voltage (x). For an ohmic resistor, the line should be straight and pass through the origin, with gradient = 1/R (so R is constant). Repeat readings to improve reliability.", marks: 6, hint: "Circuit, method, table, graph, conclusion" },
      ],
      flashcard: [
        { term: "Ohm\u2019s Law", definition: "V = IR. Voltage equals current times resistance. Holds for ohmic conductors at constant temperature.", example: "5 A through 4 \u03a9 \u2192 V = 20 V" },
        { term: "Series Circuit", definition: "Components in one loop. Same current everywhere; voltages add up; resistances add up.", example: "Christmas lights (old style): one bulb out = all out" },
        { term: "Parallel Circuit", definition: "Components in separate branches. Same voltage across each branch; currents add up; total resistance is less than the smallest branch.", example: "House wiring: each appliance gets full mains voltage" },
      ],
    },
  },
};
