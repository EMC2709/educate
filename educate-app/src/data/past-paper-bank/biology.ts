import type { Question } from '@/types';

export const biologyPastPaper: Question[] = [
  {
    topic: "Cell Biology",
    question: "Compare and contrast the structure of a typical animal cell and a typical plant cell.\n\nYou should refer to at least three similarities and three differences.",
    answer: "Similarities: Both have a cell membrane (controls what enters/leaves), nucleus (contains DNA/genetic material), cytoplasm (where chemical reactions occur), mitochondria (site of aerobic respiration), ribosomes (site of protein synthesis).\n\nDifferences: Plant cells have a cellulose cell wall (provides structural support) — animal cells do not. Plant cells have a large permanent vacuole (filled with cell sap, maintains turgor pressure) — animal cells may have small temporary vacuoles. Plant cells contain chloroplasts (containing chlorophyll for photosynthesis) — animal cells do not.\n\nMark scheme:\n• At least three correct similarities with functions — 3 marks\n• At least three correct differences with explanations — 3 marks",
    marks: 6,
    hint: "Think about the organelles both types share (nucleus, mitochondria, etc.) and the structures unique to plant cells (cell wall, chloroplasts, permanent vacuole).",
  },
  {
    topic: "Organisation",
    question: "Describe how the structure of the small intestine is adapted for the absorption of digested food molecules.",
    answer: "The small intestine has villi (finger-like projections) which increase the surface area for absorption. Each villus contains a network of blood capillaries to absorb amino acids and sugars into the bloodstream, and a lacteal to absorb fatty acids and glycerol. The villi have a thin epithelial layer (one cell thick) to provide a short diffusion distance. The villi have a good blood supply which maintains a steep concentration gradient for efficient diffusion. Microvilli on the surface of epithelial cells further increase surface area.\n\nMark scheme:\n• Villi increase surface area — 1 mark\n• Thin epithelial layer / short diffusion distance — 1 mark\n• Rich blood supply / maintains concentration gradient — 1 mark\n• Reference to microvilli for additional surface area — 1 mark",
    marks: 4,
    hint: "Think about what makes absorption efficient: surface area, diffusion distance, and concentration gradients. How does the structure of the villus achieve each of these?",
  },
  {
    topic: "Infection & Response",
    question: "Explain how vaccination prevents a person from developing a disease when they encounter the pathogen in the future.",
    answer: "A vaccine contains a dead or inactive form of the pathogen (or parts of it such as antigens). When injected, the antigens stimulate white blood cells (lymphocytes) to produce specific antibodies. Memory cells are produced and remain in the body for a long time. If the same pathogen enters the body again, the memory cells recognise the antigens and rapidly produce large quantities of the correct antibodies. This secondary immune response is faster and stronger, destroying the pathogen before it can cause disease.\n\nMark scheme:\n• Vaccine contains dead/inactive pathogen or antigens — 1 mark\n• Stimulates lymphocytes to produce antibodies — 1 mark\n• Memory cells are produced — 1 mark\n• Secondary response is faster/produces more antibodies — 1 mark",
    marks: 4,
    hint: "Follow the sequence: what is in the vaccine, what the immune system does in response, what remains in the body afterwards, and what happens on re-exposure.",
  },
  {
    topic: "Bioenergetics",
    question: "A student investigated the effect of light intensity on the rate of photosynthesis using an aquatic plant.\n\nDescribe how you would carry out this experiment and explain what results you would expect.",
    answer: "Method: Place an aquatic plant (e.g. Elodea) in a beaker of water with sodium hydrogen carbonate solution (to provide CO₂). Position a lamp at measured distances from the plant (e.g. 10cm, 20cm, 30cm, 40cm, 50cm). Count the number of oxygen bubbles produced per minute at each distance (or collect gas using an inverted measuring cylinder). Use a ruler to measure distance. Repeat at each distance three times and calculate a mean. Control variables: temperature (use a heat shield/glass screen between lamp and beaker), concentration of CO₂, volume of water, same plant.\n\nExpected results: As light intensity increases (lamp closer), the rate of photosynthesis increases — more bubbles per minute. The rate eventually plateaus because another factor becomes limiting (temperature or CO₂ concentration).\n\nMark scheme:\n• Clear method with named plant and measurable variable — 1 mark\n• Correct independent variable (light intensity/distance) — 1 mark\n• Correct dependent variable (bubble count or gas volume) — 1 mark\n• Control variables identified — 1 mark\n• Repeats and mean mentioned — 1 mark\n• Correct expected results with reference to limiting factors — 1 mark",
    marks: 6,
    hint: "Think about what you change (independent variable), what you measure (dependent variable), and what you keep the same (control variables). What is the relationship between light intensity and photosynthesis rate?",
  },
  {
    topic: "Homeostasis",
    question: "Explain how blood glucose concentration is controlled after eating a meal rich in carbohydrates.",
    answer: "After eating carbohydrates, blood glucose concentration rises. The pancreas detects this rise and beta cells secrete insulin into the blood. Insulin causes cells (particularly liver and muscle cells) to take up glucose from the blood. In the liver, glucose is converted to glycogen for storage (glycogenesis). This causes blood glucose concentration to fall back to the normal level. This is an example of negative feedback — the response (insulin release) counteracts the change (high blood glucose) to restore the set point.\n\nMark scheme:\n• Blood glucose rises after eating — 1 mark\n• Pancreas releases insulin — 1 mark\n• Cells take up glucose / liver converts glucose to glycogen — 1 mark\n• Blood glucose returns to normal / negative feedback — 1 mark",
    marks: 4,
    hint: "Follow the sequence: stimulus (high blood glucose), receptor (pancreas), effector response (insulin), and outcome. Name the process of glucose storage.",
  },
  {
    topic: "Inheritance & Evolution",
    question: "Describe the process of natural selection and explain how it can lead to the evolution of a species over time.\n\nUse an example to support your answer.",
    answer: "Within a population there is genetic variation caused by mutations in DNA. Individuals with characteristics better suited to the environment are more likely to survive and reproduce (survival of the fittest). These advantageous alleles are passed on to offspring. Over many generations, the frequency of the beneficial allele increases in the population.\n\nExample: Peppered moths in industrial England — before industrialisation, pale moths were camouflaged on lichen-covered trees. During industrial revolution, soot blackened trees and pale moths were easily predated. Dark (melanic) moths had a survival advantage, so the allele for dark colouring increased in frequency. After the Clean Air Act, lichen returned and pale moths regained their advantage.\n\nMark scheme:\n• Genetic variation exists within a population — 1 mark\n• Better-adapted individuals survive and reproduce — 1 mark\n• Advantageous alleles passed to offspring — 1 mark\n• Frequency of allele changes over time — 1 mark\n• Relevant named example described — 1 mark\n• Example linked to the theory — 1 mark",
    marks: 6,
    hint: "Cover the four key steps: variation, selection pressure, survival and reproduction, and inheritance. Then use a specific named example such as antibiotic resistance or peppered moths.",
  },
  {
    topic: "Ecology",
    question: "Describe how you would use quadrats to investigate the distribution of a plant species across a habitat.\n\nExplain why a transect line might give more useful data than random quadrat sampling.",
    answer: "Place a transect line (measuring tape) across the habitat from one area to another (e.g. from the edge of a field to the centre). Place a quadrat at regular intervals along the transect (e.g. every 2 metres). Count the number of the target species in each quadrat, or estimate percentage cover. Record the distance along the transect for each sample. Repeat with additional parallel transects to improve reliability.\n\nA transect is more useful than random sampling when investigating how distribution changes across a habitat, as it shows a pattern of change related to an environmental gradient (e.g. light intensity decreasing from open field into woodland). Random sampling would not reveal this spatial pattern — it only gives an overall estimate of abundance.\n\nMark scheme:\n• Correct description of transect method — 1 mark\n• Quadrats placed at regular intervals — 1 mark\n• Appropriate measurement (species count or % cover) — 1 mark\n• Explanation of why transect shows distribution pattern / environmental gradient — 1 mark",
    marks: 4,
    hint: "A transect is a line along which you sample at regular intervals. Think about why the position of each sample matters when studying distribution rather than just abundance.",
  },
];
