import type { SubtopicContent } from '@/types';

export const physicsSubtopics: Record<string, Record<string, SubtopicContent>> = {
  "Energy": {
    "Energy Stores & Transfers": {
      short: [
        { question: "A ball of mass 2kg is held at a height of 5m. Calculate its gravitational potential energy. (g = 10 N/kg)", answer: "GPE = mgh = 2 \u00d7 10 \u00d7 5 = 100J", marks: 2, hint: "GPE = mass \u00d7 g \u00d7 height" },
        { question: "State the principle of conservation of energy.", answer: "Energy cannot be created or destroyed. It can only be transferred from one store to another. The total energy of a closed system remains constant.", marks: 2, hint: "Total energy stays the same \u2014 it just changes form" },
      ],
      mid: [
        { question: "A 0.5kg ball falls from rest through 8m. Calculate (a) its KE just before hitting the ground and (b) its speed at that point. Assume no air resistance. (g=10 N/kg)", answer: "(a) All GPE converts to KE. GPE = 0.5\u00d710\u00d78 = 40J = KE. (b) KE = \u00bdmv\u00b2 \u2192 v\u00b2 = 2\u00d740/0.5 = 160 \u2192 v = \u221a160 \u2248 12.6 m/s", marks: 4, hint: "GPE converts to KE. Use KE = \u00bdmv\u00b2 to find speed" },
      ],
      long: [
        { question: "A car of mass 1200kg accelerates from 10m/s to 30m/s. Calculate (a) the change in kinetic energy, (b) the work done by the engine if there is 8kJ of friction, (c) the force of the engine if this happens over 500m.", answer: "(a) \u0394KE = \u00bd\u00d71200\u00d730\u00b2 \u2212 \u00bd\u00d71200\u00d710\u00b2 = 540000 \u2212 60000 = 480000J = 480kJ. (b) Work done by engine = \u0394KE + work against friction = 480000 + 8000 = 488000J. (c) F = W/d = 488000/500 = 976N", marks: 6, hint: "KE = \u00bdmv\u00b2. Work done by engine must overcome friction AND increase KE. F = W/d" },
      ],
      flashcard: [
        { term: "Energy Stores", definition: "Kinetic (moving objects), Gravitational potential (raised objects), Elastic potential (stretched/compressed), Chemical (food/fuel), Thermal (heat), Nuclear, Electrostatic, Magnetic. Energy is transferred between stores by heating, waves, electrically, or mechanically.", example: "Burning wood: chemical store \u2192 thermal store (+ light radiation)" },
        { term: "KE and GPE Equations", definition: "KE = \u00bdmv\u00b2 (joules, kg, m/s). GPE = mgh (joules, kg, N/kg, m). In freefall with no air resistance: loss in GPE = gain in KE.", example: "v = \u221a(2gh): ball dropping 20m: v = \u221a(2\u00d710\u00d720) = \u221a400 = 20 m/s" },
        { term: "Efficiency", definition: "Efficiency = useful energy output / total energy input (\u00d7 100 for %). Always \u2264100% \u2014 some energy always dissipated as heat. Sankey diagrams show energy transfers and waste.", example: "LED uses 10W, 8W useful light: efficiency = 8/10 = 80%" },
      ],
    },
    "Specific Heat Capacity": {
      short: [
        { question: "Define specific heat capacity.", answer: "Specific heat capacity is the energy required to raise the temperature of 1kg of a substance by 1\u00b0C (or 1K). Units: J/kg\u00b0C.", marks: 2, hint: "Energy per kg per degree temperature rise" },
        { question: "Calculate the energy needed to heat 3kg of water from 20\u00b0C to 80\u00b0C. (c = 4200 J/kg\u00b0C)", answer: "Q = mc\u0394T = 3 \u00d7 4200 \u00d7 60 = 756,000J = 756kJ", marks: 3, hint: "Q = mc\u0394T where \u0394T = 80\u221220 = 60\u00b0C" },
      ],
      mid: [
        { question: "Describe an experiment to find the specific heat capacity of a metal block using electrical heating.", answer: "Drill two holes in a metal block \u2014 insert electric heater and thermometer. Record initial temperature. Connect heater to ammeter, voltmeter and power supply. Switch on and start timing. Record temperature every minute for 10 minutes. Note current (A) and voltage (V). Calculate energy: E = VIt. Plot temperature vs time; gradient \u00d7 time gives \u0394T. c = E/(m\u0394T). Controls: lag block in insulation to reduce heat loss, repeat to check consistency.", marks: 4, hint: "Describe apparatus setup (heater, thermometer, ammeter, voltmeter), how to measure energy (E=VIt), and how to calculate c from the data" },
      ],
      long: [
        { question: "Compare the specific heat capacities of water and copper (c_water = 4200, c_copper = 385 J/kg\u00b0C). Explain why this makes water useful as a coolant and in central heating, and why copper is used in saucepans.", answer: "Water has a very high SHC (4200 J/kg\u00b0C) \u2014 it takes a lot of energy to change its temperature. This means: it absorbs large amounts of heat energy without getting very hot (good coolant in car radiators, heat sinks for electronics). In central heating: water can carry large amounts of thermal energy from the boiler to radiators and release it slowly \u2014 efficient heat transfer with small volumes. The high SHC also means the sea heats and cools slowly \u2014 moderating coastal climates. Copper has low SHC (385 J/kg\u00b0C) \u2014 it heats up quickly with little energy input. This makes it good for saucepan bases \u2014 food heats quickly, responsive to heat changes. Copper is also a good thermal conductor, ensuring even heat distribution. The trade-off: copper would lose heat rapidly if used in central heating, so water is the better fluid despite being denser and heavier.", marks: 6, hint: "Explain what high SHC means (more energy to change temp), apply to water uses (coolant, heating), then explain why low SHC suits copper for cooking. Contrast the two." },
      ],
      flashcard: [
        { term: "Specific Heat Capacity Formula", definition: "Q = mc\u0394T. Q = energy (J), m = mass (kg), c = specific heat capacity (J/kg\u00b0C), \u0394T = temperature change (\u00b0C). Rearrange: c = Q/(m\u0394T); m = Q/(c\u0394T).", example: "Q to heat 2kg of water by 50\u00b0C: Q = 2 \u00d7 4200 \u00d7 50 = 420,000 J" },
        { term: "Thermal Conductivity", definition: "Rate at which heat flows through a material. Good conductors (metals): free electrons transfer thermal energy quickly. Poor conductors/insulators (wood, plastic, air): no free electrons. U-values measure heat loss through building materials.", example: "Metal spoon in hot liquid gets hot quickly (high conductivity). Wooden spoon stays cool." },
      ],
    },
  },
  "Forces": {
    "Newton's Laws": {
      short: [
        { question: "A resultant force of 40N acts on a 8kg object. Calculate the acceleration.", answer: "a = F/m = 40/8 = 5 m/s\u00b2", marks: 2, hint: "Newton's Second Law: F = ma, so a = F/m" },
        { question: "State Newton's Third Law and give an example.", answer: "For every action force there is an equal and opposite reaction force, acting on a different object. Example: a person pushes down on the floor (action); the floor pushes up on the person with an equal force (reaction).", marks: 2, hint: "Equal and opposite \u2014 but acting on DIFFERENT objects" },
      ],
      mid: [
        { question: "A car of mass 1500kg brakes from 20m/s to rest in 4 seconds. Calculate (a) the deceleration and (b) the braking force.", answer: "(a) a = (v\u2212u)/t = (0\u221220)/4 = \u22125 m/s\u00b2 (deceleration = 5 m/s\u00b2). (b) F = ma = 1500 \u00d7 5 = 7500N", marks: 4, hint: "Use v = u + at to find deceleration, then F = ma" },
      ],
      long: [
        { question: "Explain the factors that affect stopping distance of a vehicle and the safety implications of each.", answer: "Stopping distance = thinking distance + braking distance. Thinking distance (reaction time \u00d7 speed): affected by driver fatigue (slower reaction), alcohol/drugs (impair reactions, legal limit for driving), distractions (phone use), speed (higher speed = longer thinking distance even with same reaction time). Braking distance: depends on speed (force needed proportional to v\u00b2; doubling speed quadruples braking distance), road conditions (wet/icy reduces friction between tyres and road, increasing braking distance significantly), vehicle condition (worn tyres \u2014 reduced grip; worn brakes \u2014 less braking force). Safety implications: Speed limits reduce stopping distance quadratically. Drink/drive laws, phone-use laws address reaction time. Mandatory tyre tread depth (1.6mm). ABS (anti-lock braking) prevents wheel lock. MOT tests brakes and tyres.", marks: 7, hint: "Cover thinking distance factors (reaction time, alcohol, speed, distraction) and braking distance factors (speed squared relationship, road surface, tyre/brake condition). Link each to specific safety measures." },
      ],
      flashcard: [
        { term: "Newton's Three Laws", definition: "1st: Object at rest/constant velocity unless resultant force acts. 2nd: F = ma (resultant force = mass \u00d7 acceleration). 3rd: Every action has equal and opposite reaction on a different object.", example: "Rocket: hot gas pushed downward (action) \u2192 rocket pushed upward with equal force (reaction)" },
        { term: "Stopping Distance", definition: "Total stopping distance = thinking distance + braking distance. Thinking distance: affected by reaction time and speed. Braking distance: affected by speed (v\u00b2), road conditions (friction), vehicle condition. Doubling speed quadruples braking distance.", example: "At 30mph: ~23m total stopping distance. At 60mph: ~73m (not double \u2014 because braking distance quadruples)" },
        { term: "Weight vs Mass", definition: "Mass (kg): amount of matter \u2014 constant everywhere. Weight (N): gravitational force on the mass \u2014 depends on gravitational field strength. W = mg. On Earth g = 9.8 (\u224810) N/kg; on Moon g = 1.6 N/kg.", example: "60kg person: weight on Earth = 60\u00d710 = 600N; weight on Moon = 60\u00d71.6 = 96N" },
      ],
    },
    "Pressure": {
      short: [
        { question: "Calculate the pressure exerted by a force of 200N over an area of 0.05m\u00b2.", answer: "P = F/A = 200/0.05 = 4000 Pa (4 kPa)", marks: 2, hint: "P = F/A (pascals)" },
        { question: "Why does pressure in a liquid increase with depth?", answer: "As depth increases, more liquid sits above that point \u2014 the weight of liquid above increases. Pressure = h\u03c1g (height \u00d7 density \u00d7 gravitational field strength), so greater depth means greater pressure.", marks: 2, hint: "Think about how much liquid is above the point" },
      ],
      mid: [
        { question: "Explain how atmospheric pressure changes with altitude and why this affects boiling point.", answer: "Atmospheric pressure is caused by the weight of air above a surface. At higher altitudes, there is less air above \u2014 atmospheric pressure decreases. Boiling point is the temperature at which vapour pressure equals atmospheric pressure. At lower atmospheric pressure, liquids boil at a lower temperature \u2014 water boils below 100\u00b0C on a mountain. This affects cooking: at altitude, water boils at ~90\u00b0C, so food takes longer to cook.", marks: 4, hint: "Explain what causes atmospheric pressure, how altitude reduces it, and how this affects boiling point \u2014 with a practical example" },
      ],
      long: [
        { question: "Explain how hydraulic systems use pressure in liquids to transmit and multiply force. Give a calculation example.", answer: "Liquids are incompressible \u2014 pressure applied at one point is transmitted equally throughout the liquid in all directions (Pascal's law). A small force on a small piston creates a pressure: P = F\u2081/A\u2081. This pressure is transmitted through the liquid to a larger piston: F\u2082 = P \u00d7 A\u2082. Because A\u2082 > A\u2081, F\u2082 > F\u2081 \u2014 force is multiplied. Mechanical advantage = A\u2082/A\u2081. Example: car brakes \u2014 force on brake pedal (small piston, A\u2081=0.01m\u00b2) creates pressure P = 200/0.01 = 20000Pa. This transmitted to wheel cylinders (A\u2082=0.05m\u00b2): F\u2082 = 20000 \u00d7 0.05 = 1000N. Energy is conserved \u2014 the large piston moves a smaller distance. Applications: car brakes, hydraulic lifts, diggers, dental chairs.", marks: 7, hint: "Explain incompressibility, Pascal's law, P = F/A, force multiplication with worked example, conservation of energy, real applications" },
      ],
      flashcard: [
        { term: "Pressure Equations", definition: "Pressure = Force \u00f7 Area (Pa, N, m\u00b2). Pressure in a fluid: P = h\u03c1g (h = depth/m, \u03c1 = density kg/m\u00b3, g = 9.8 N/kg). Atmospheric pressure \u2248101,325 Pa at sea level.", example: "Depth 10m in water (\u03c1=1000): P = 10\u00d71000\u00d710 = 100,000 Pa = 1 atm extra" },
        { term: "Upthrust (Archimedes' Principle)", definition: "An object immersed in a fluid experiences an upward force (upthrust) equal to the weight of fluid displaced. Object floats when upthrust = weight (displaces its own weight of fluid).", example: "Ship floats because its large hollow shape displaces a weight of water equal to the ship's weight" },
      ],
    },
  },
  "Electricity": {
    "Circuits & Ohm's Law": {
      short: [
        { question: "A resistor has a current of 0.5A through it and a potential difference of 6V across it. Calculate its resistance.", answer: "R = V/I = 6/0.5 = 12\u03a9", marks: 2, hint: "Ohm's Law: V = IR, so R = V/I" },
        { question: "State the difference between series and parallel circuits in terms of current and voltage.", answer: "Series: current is the same at all points; voltage is shared between components. Parallel: voltage is the same across all branches; current splits between branches.", marks: 2, hint: "Series: same current. Parallel: same voltage." },
      ],
      mid: [
        { question: "Two resistors of 6\u03a9 and 12\u03a9 are connected in parallel. Calculate the combined resistance.", answer: "1/R = 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4. R = 4\u03a9", marks: 3, hint: "Parallel: 1/R_total = 1/R\u2081 + 1/R\u2082. The combined resistance is always less than the smallest." },
      ],
      long: [
        { question: "Design a circuit that would allow you to investigate how resistance of a wire changes with length. Describe the method, state variables and explain expected results.", answer: "Circuit: power supply, ammeter (in series), voltmeter (across the wire), and test wire attached to metre ruler with crocodile clips. Method: Set crocodile clip at different lengths (e.g. 10, 20, 30, 40, 50cm). For each length: record current (A) and voltage (V). Calculate R = V/I. Repeat 3 times for reliability. Independent variable: length of wire. Dependent variable: resistance. Controlled variables: material of wire (same wire), cross-sectional area (same wire), temperature (use low voltage to minimise heating), voltage setting. Expected results: resistance is directly proportional to length \u2014 graph of R vs length passes through origin as a straight line. Explanation: longer wire \u2192 more collisions between electrons and ions \u2192 greater resistance. R = \u03c1L/A where \u03c1 = resistivity.", marks: 7, hint: "Draw or describe circuit (ammeter in series, voltmeter in parallel). State all three variable types specifically. Predict graph shape and explain using particle/electron collision model." },
      ],
      flashcard: [
        { term: "Ohm's Law", definition: "V = IR for an ohmic conductor at constant temperature. Current is directly proportional to voltage. Non-ohmic conductors (e.g. diode, thermistor, filament lamp) have changing resistance. Graph: V vs I straight through origin = ohmic.", example: "Filament lamp: as it heats up, resistance increases \u2192 I-V curve bends (non-ohmic)" },
        { term: "Series Circuits", definition: "Same current (I) flows through all components. Voltage shared: V_total = V\u2081 + V\u2082 + ... Resistances add: R_total = R\u2081 + R\u2082 + ... If one component fails: circuit breaks.", example: "3\u03a9 and 5\u03a9 in series: R_total = 8\u03a9. With 12V: I = 12/8 = 1.5A everywhere" },
        { term: "Parallel Circuits", definition: "Same voltage (V) across all branches. Current splits: I_total = I\u2081 + I\u2082 + ... Resistance: 1/R_total = 1/R\u2081 + 1/R\u2082 + ... (total resistance less than smallest branch). If one branch fails: others continue.", example: "6\u03a9 and 12\u03a9 parallel: R = 4\u03a9. With 12V: total I = 3A (2A through 6\u03a9, 1A through 12\u03a9)" },
      ],
    },
  },
  "Waves": {
    "Wave Properties": {
      short: [
        { question: "A wave has a frequency of 200Hz and a wavelength of 1.5m. Calculate its speed.", answer: "v = f\u03bb = 200 \u00d7 1.5 = 300 m/s", marks: 2, hint: "v = f\u03bb (wave equation)" },
        { question: "What is the difference between transverse and longitudinal waves?", answer: "Transverse waves: oscillations perpendicular to the direction of energy transfer (e.g. light, water waves). Longitudinal waves: oscillations parallel to the direction of energy transfer \u2014 compressions and rarefactions (e.g. sound).", marks: 2, hint: "Which way do the particles vibrate relative to wave travel?" },
      ],
      mid: [
        { question: "Explain refraction of light at an interface between air and glass, including the change in speed and wavelength.", answer: "When light passes from air into glass (denser medium), it slows down. The frequency stays constant (fixed by source). Since v = f\u03bb and frequency is unchanged, wavelength decreases. The wave bends towards the normal because the wave front slows on one side before the other (Huygens' principle). The angle of refraction is less than the angle of incidence. When going from glass to air: speeds up, bends away from normal. Described by Snell's Law: n\u2081sin\u03b8\u2081 = n\u2082sin\u03b8\u2082.", marks: 4, hint: "Explain speed change, wavelength change (frequency constant), direction change (towards/away from normal), Snell's Law" },
      ],
      long: [
        { question: "Describe the electromagnetic spectrum, including the properties common to all EM waves and the specific uses and dangers of each region.", answer: "All EM waves: transverse, travel at 3\u00d710\u2078 m/s in vacuum, can travel through vacuum, transfer energy. In order of increasing frequency (decreasing wavelength): Radio: broadcast TV/radio, MRI-like uses \u2014 very low energy, harmless. Microwaves: satellite communications, cooking (water molecules absorb energy) \u2014 can cause internal tissue heating. Infrared: thermal imaging, remote controls, short-range communications, optical fibres \u2014 heating effect. Visible: sight, photography, photosynthesis \u2014 absorbed by retina. Ultraviolet: sterilisation, detecting counterfeit notes, causes sunburn, skin cancer, eye damage \u2014 can ionise. X-rays: medical imaging (denser tissue absorbs more), airport security \u2014 ionising radiation, DNA damage. Gamma: cancer treatment (radiotherapy), sterilisation \u2014 most energetic, deeply penetrating, highly ionising, causes cancer. Higher frequency = higher energy = more dangerous (ionising). Lead and thick concrete absorb gamma and X-rays.", marks: 8, hint: "List all 7 regions in order. For each: at least one use AND appropriate safety concern. Link energy level to ionising ability." },
      ],
      flashcard: [
        { term: "Wave Equation", definition: "v = f\u03bb. v = wave speed (m/s), f = frequency (Hz = 1/s), \u03bb = wavelength (m). Frequency is fixed by the source. Speed depends on medium. When speed changes (e.g. refraction), wavelength changes but frequency stays the same.", example: "Sound at 340m/s, frequency 170Hz: \u03bb = 340/170 = 2m" },
        { term: "The Electromagnetic Spectrum", definition: "All transverse waves at 3\u00d710\u2078 m/s in vacuum. Order (increasing \u03bb, decreasing f): gamma, X-ray, UV, visible, IR, microwave, radio. Higher frequency = more energy = more dangerous. Ionising: gamma, X-ray, UV.", example: "Visible light: 400nm (violet) to 700nm (red). Radio waves: metres to kilometres wavelength" },
        { term: "Total Internal Reflection", definition: "When light hits a boundary from denser to less dense medium at an angle greater than the critical angle, all light reflects back \u2014 none escapes. Used in optical fibres and diamond sparkle.", example: "Glass to air: critical angle ~42\u00b0. Optical fibres transmit data using TIR along the fibre" },
      ],
    },
  },
  "Nuclear Physics": {
    "Radioactivity": {
      short: [
        { question: "A radioactive sample has an initial activity of 400Bq and a half-life of 10 years. What is the activity after 30 years?", answer: "30 years = 3 half-lives. Activity halves 3 times: 400 \u2192 200 \u2192 100 \u2192 50Bq", marks: 2, hint: "Count how many half-lives fit into 30 years, then halve the activity each time" },
        { question: "State one property of alpha, one of beta and one of gamma radiation that makes each different from the others.", answer: "Alpha: heaviest, stopped by a sheet of paper/few cm of air, most ionising. Beta: faster, penetrates paper but stopped by 3mm aluminium. Gamma: electromagnetic wave, penetrates everything, reduced (not stopped) by thick lead or concrete.", marks: 3, hint: "Think about penetration and ionising ability" },
      ],
      mid: [
        { question: "Explain what happens to the atomic number and mass number when a nucleus decays by (a) alpha emission and (b) beta emission.", answer: "(a) Alpha decay: nucleus emits an alpha particle (\u2074\u2082He \u2014 2 protons, 2 neutrons). Mass number decreases by 4. Atomic number decreases by 2. Example: \u00b2\u00b3\u2078U \u2192 \u00b2\u00b3\u2074Th + \u2074He. (b) Beta decay: a neutron converts to a proton and electron. The electron (beta particle) is emitted. Mass number unchanged. Atomic number increases by 1. Example: \u00b9\u2074C \u2192 \u00b9\u2074N + \u03b2\u207b.", marks: 4, hint: "Alpha: A\u22124, Z\u22122. Beta: A unchanged, Z+1. Show example nuclear equations." },
      ],
      long: [
        { question: "Explain how radioactive decay is used in carbon dating to determine the age of organic materials. Include the assumptions the method makes and its limitations.", answer: "Carbon-14 (\u00b9\u2074C) is a radioactive isotope produced in the upper atmosphere by cosmic ray bombardment of nitrogen. Plants absorb \u00b9\u2074C through photosynthesis (as \u00b9\u2074CO\u2082). Animals absorb \u00b9\u2074C by eating plants. While alive, organisms maintain a constant ratio of \u00b9\u2074C to \u00b9\u00b2C (matching atmospheric ratio). When an organism dies, \u00b9\u2074C is no longer replenished and decays (half-life = 5,730 years). By measuring the remaining \u00b9\u2074C/\u00b9\u00b2C ratio and comparing to the original atmospheric ratio, scientists calculate how many half-lives have passed \u2192 determine age. Assumptions: (1) atmospheric \u00b9\u2074C concentration has been constant throughout history; (2) no contamination of sample with older/younger carbon; (3) the organism absorbed carbon in proportion to atmospheric ratio. Limitations: only reliable for materials up to ~50,000 years old (beyond ~8-9 half-lives, too little \u00b9\u2074C remains to measure accurately). Atmospheric \u00b9\u2074C has varied (calibrated using tree rings/dendrochronology). Contamination by modern carbon gives artificially young dates.", marks: 8, hint: "Explain: \u00b9\u2074C production, living organisms maintain constant ratio, death stops replenishment, decay allows calculation. State all three assumptions. Give specific limitations with reasons." },
      ],
      flashcard: [
        { term: "Types of Nuclear Radiation", definition: "Alpha (\u03b1): helium nucleus (\u00b2\u2074He), +2 charge, mass 4. Penetrating power: stopped by paper/skin. Most ionising. Beta (\u03b2): fast electron, \u22121 charge, negligible mass. Stopped by 3mm Al. Gamma (\u03b3): EM wave, no charge/mass. Penetrates lead (reduced). Least ionising.", example: "Smoke detectors use alpha (ionises air, completing circuit \u2014 smoke disrupts this)" },
        { term: "Half-Life", definition: "Time for half the radioactive nuclei to decay (or activity to halve). Random but predictable for large samples. After n half-lives, fraction remaining = (1/2)\u207f.", example: "t\u00bd = 5 years. After 15 years (3 half-lives): 1/8 of original nuclei remain. Activity = 1/8 of original" },
        { term: "Nuclear Fission vs Fusion", definition: "Fission: heavy nucleus splits (e.g. U-235 + neutron) releasing energy + 2-3 neutrons \u2192 chain reaction. Used in nuclear power stations. Fusion: light nuclei combine (e.g. hydrogen isotopes \u2192 helium) releasing more energy per kg. Occurs in stars. Requires extreme temperature/pressure. ITER project attempting sustained fusion.", example: "Fission: 1 kg of U-235 releases ~85 trillion joules. Fusion: cleaner, more energy-dense, no long-lived waste" },
      ],
    },
  },
};
