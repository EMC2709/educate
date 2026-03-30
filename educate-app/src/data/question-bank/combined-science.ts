import type { SubjectBank } from '@/types';

export const combinedScienceBank: SubjectBank = {
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
};
