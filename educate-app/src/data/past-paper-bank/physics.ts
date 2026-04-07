import type { Question } from '@/types';

export const physicsPastPaper: Question[] = [
  {
    topic: "Energy",
    question: "A ball of mass 0.5 kg is dropped from a height of 20 m.\n\n(a) Calculate the gravitational potential energy of the ball before it is dropped. (2 marks)\n\n(b) State the kinetic energy of the ball just before it hits the ground, assuming no air resistance. (1 mark)\n\n(c) Explain why in reality the kinetic energy would be less than your answer to (b). (1 mark)\n\n(Gravitational field strength g = 10 N/kg)",
    answer: "(a) GPE = mgh = 0.5 × 10 × 20 = 100 J\n\n(b) 100 J (by conservation of energy, all GPE converts to KE)\n\n(c) Some energy is transferred to the thermal energy store of the air and ball due to air resistance (friction/drag). So less energy is available as kinetic energy.\n\nMark scheme:\n(a)\n• Correct substitution into GPE = mgh — 1 mark\n• Correct answer of 100 J — 1 mark\n(b)\n• 100 J with reference to energy conservation — 1 mark\n(c)\n• Energy dissipated due to air resistance / friction — 1 mark",
    marks: 4,
    hint: "(a) Use GPE = mass × g × height. (b) Think about the conservation of energy. (c) What force acts on the ball as it falls through air?",
  },
  {
    topic: "Electricity",
    question: "A 12 V battery is connected to a circuit containing a 4 Ω resistor and a 6 Ω resistor in series.\n\n```mermaid\ngraph LR\n    A[12V Battery] --> B[4Ω]\n    B --> C[6Ω]\n    C --> A\n```\n\n(a) Calculate the total resistance of the circuit. (1 mark)\n\n(b) Calculate the current flowing through the circuit. (2 marks)\n\n(c) Calculate the potential difference across the 6 Ω resistor. (2 marks)\n\n(d) The 6 Ω resistor is replaced with a 6 Ω filament lamp. Explain what happens to the current as the lamp gets hotter. (1 mark)",
    answer: "(a) Total resistance = 4 + 6 = 10 Ω\n\n(b) I = V / R = 12 / 10 = 1.2 A\n\n(c) V = IR = 1.2 × 6 = 7.2 V\n\n(d) As the filament lamp gets hotter, its resistance increases. This increases the total resistance of the circuit, so the current decreases.\n\nMark scheme:\n(a) Correct total resistance 10 Ω — 1 mark\n(b)\n• Correct use of I = V/R — 1 mark\n• Correct answer 1.2 A — 1 mark\n(c)\n• Correct use of V = IR — 1 mark\n• Correct answer 7.2 V — 1 mark\n(d) Resistance increases with temperature so current decreases — 1 mark",
    marks: 6,
    hint: "(a) In series, resistances add up. (b) Use V = IR rearranged. (c) Use V = IR for just the 6 Ω resistor. (d) How does temperature affect the resistance of a filament lamp?",
  },
  {
    topic: "Particle Model",
    question: "A kettle contains 1.5 kg of water at 20°C. The kettle heats the water to 100°C.\n\nCalculate the energy transferred to the water.\n\n(Specific heat capacity of water = 4200 J/kg°C)",
    answer: "Temperature change = 100 − 20 = 80°C\n\nEnergy = mcΔθ = 1.5 × 4200 × 80 = 504,000 J = 504 kJ\n\nMark scheme:\n• Correct temperature change (80°C) — 1 mark\n• Correct substitution into E = mcΔθ — 1 mark\n• Correct answer 504,000 J or 504 kJ — 1 mark\n• Correct unit — 1 mark",
    marks: 4,
    hint: "First calculate the temperature change. Then use the equation E = mcΔθ (energy = mass × specific heat capacity × temperature change).",
  },
  {
    topic: "Atomic Structure",
    question: "Describe the nuclear model of the atom and explain how the results of the alpha particle scattering experiment provided evidence for this model.",
    answer: "The nuclear model: The atom has a small, dense, positively charged nucleus at the centre containing protons and neutrons. The nucleus is surrounded by electrons orbiting at relatively large distances. Most of the atom is empty space.\n\nAlpha particle scattering experiment (Geiger-Marsden/Rutherford): Alpha particles were fired at a thin gold foil. Most alpha particles passed straight through — showing the atom is mostly empty space. Some were deflected at small angles — showing the nucleus has a positive charge (repelling the positive alpha particles). A very small number were deflected back through large angles (> 90°) — showing the nucleus is very small, dense, and concentrated.\n\nThis replaced the plum pudding model which could not explain the large-angle deflections.\n\nMark scheme:\n• Small dense positive nucleus described — 1 mark\n• Electrons orbit at a distance / mostly empty space — 1 mark\n• Most alpha particles passed through — 1 mark\n• Some deflected — evidence for positive nucleus — 1 mark\n• Few bounced back — evidence for small dense nucleus — 1 mark\n• Reference to replacing plum pudding model — 1 mark",
    marks: 6,
    hint: "First describe the nuclear model, then explain how each observation from the alpha scattering experiment supports a specific feature of the model.",
  },
  {
    topic: "Forces",
    question: "A car of mass 1200 kg accelerates from rest to 15 m/s in 10 seconds.\n\n(a) Calculate the acceleration of the car. (2 marks)\n\n(b) Calculate the resultant force on the car. (2 marks)\n\n(c) Explain why the car reaches a maximum speed even though the engine force stays constant. (2 marks)",
    answer: "(a) a = (v − u) / t = (15 − 0) / 10 = 1.5 m/s²\n\n(b) F = ma = 1200 × 1.5 = 1800 N\n\n(c) As the car's speed increases, the air resistance (drag) also increases. Eventually the drag force equals the engine (driving) force, making the resultant force zero. With zero resultant force, by Newton's first law the car travels at a constant (maximum/terminal) velocity.\n\nMark scheme:\n(a)\n• Correct substitution into a = (v−u)/t — 1 mark\n• Correct answer 1.5 m/s² — 1 mark\n(b)\n• Correct substitution into F = ma — 1 mark\n• Correct answer 1800 N — 1 mark\n(c)\n• Drag/air resistance increases with speed — 1 mark\n• Resultant force becomes zero so velocity is constant — 1 mark",
    marks: 6,
    hint: "(a) Use a = change in velocity / time. (b) Use F = ma. (c) Think about what happens to resistive forces as speed increases and what this means for the resultant force.",
  },
  {
    topic: "Waves",
    question: "A sound wave has a frequency of 500 Hz and travels at a speed of 340 m/s.\n\n(a) Calculate the wavelength of the sound wave. (2 marks)\n\n(b) Explain why sound waves cannot travel through a vacuum but light waves can. (2 marks)",
    answer: "(a) v = fλ, so λ = v / f = 340 / 500 = 0.68 m\n\n(b) Sound waves are longitudinal mechanical waves — they require particles to vibrate and transfer energy through compressions and rarefactions. A vacuum contains no particles, so sound cannot travel through it. Light waves are electromagnetic (transverse) waves that consist of oscillating electric and magnetic fields. They do not require a medium and can travel through a vacuum.\n\nMark scheme:\n(a)\n• Correct rearrangement of wave equation — 1 mark\n• Correct answer 0.68 m — 1 mark\n(b)\n• Sound needs a medium / particles to travel — 1 mark\n• Light is electromagnetic and does not need a medium — 1 mark",
    marks: 4,
    hint: "(a) Rearrange v = fλ to find wavelength. (b) Think about the difference between mechanical waves and electromagnetic waves.",
  },
  {
    topic: "Magnetism & Electromagnetism",
    question: "Describe how a simple a.c. generator works.\n\nExplain why the output is alternating current rather than direct current.",
    answer: "A coil of wire is rotated inside a magnetic field (between the poles of a magnet). As the coil rotates, it cuts through magnetic field lines, which induces an electromotive force (EMF) / potential difference across the coil (Faraday's law). The coil is connected to an external circuit via slip rings and brushes, which maintain continuous contact as the coil rotates.\n\nThe current is alternating because as the coil rotates through 360°, each side of the coil alternately moves up and down through the field. This means the direction of the induced current reverses every half turn. The EMF varies sinusoidally — it is maximum when the coil is horizontal (cutting field lines at the greatest rate) and zero when the coil is vertical (moving parallel to the field lines).\n\nMark scheme:\n• Coil rotates in a magnetic field — 1 mark\n• EMF is induced by cutting field lines — 1 mark\n• Slip rings and brushes mentioned — 1 mark\n• Direction reverses every half turn — 1 mark\n• EMF is maximum when coil is horizontal, zero when vertical — 1 mark\n• Explanation links to alternating output — 1 mark",
    marks: 6,
    hint: "Describe the components (coil, magnets, slip rings). Explain what causes the EMF to be induced and why the direction of current changes during each rotation.",
  },
];
