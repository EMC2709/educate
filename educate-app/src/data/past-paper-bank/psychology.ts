import type { Question } from '@/types';

export const psychologyPastPaper: Question[] = [
  {
    topic: "Social Influence",
    question: "Describe and evaluate the social learning theory of aggression. In your answer refer to at least one relevant study.",
    answer: "Social Learning Theory (Bandura) proposes aggression is learned through observation and imitation of role models, reinforced by vicarious reinforcement. Bandura's Bobo doll experiments (1961, 1963): children exposed to aggressive adult models reproduced similar aggression — including novel acts. Live models, filmed models, and cartoon models all increased aggression. Children who saw the model punished showed less imitation (vicarious punishment). Evaluation: ecological validity concerns — Bobo doll is designed to be hit. Ethical issues — deliberate induction of aggressive behaviour in children. Ignores biological factors (testosterone, limbic system). However, explains cultural differences in aggression rates and media violence effects. Huesmann longitudinal study: childhood TV violence predicts adult aggression.",
    marks: 16,
    hint: "Describe the theory (observation, imitation, vicarious reinforcement). Describe Bobo doll study in detail. Evaluate: methodology, ethics, biological alternatives.",
  },
  {
    topic: "Social Influence",
    question: "Outline the procedures and findings of one study into obedience. Evaluate the study's contribution to our understanding of obedience.",
    answer: "Milgram (1963): Aim — to investigate whether ordinary Americans would obey an authority figure even when instructions conflicted with their conscience. Procedure — 40 male participants told they were in a learning study; confederate assigned 'learner' role. Participant (teacher) gave electric shocks (15–450V) for wrong answers. Experimenter gave standardised prods. Findings — 65% administered maximum 450V; all went to 300V. Signs of extreme stress observed. Evaluation: high internal validity (standardised procedure). Ethical issues — severe psychological distress, deception. Demand characteristics (Orne and Holland). All-male American sample limits generalisability. Cross-cultural replications (Meeus and Raaijmakers, Netherlands) produced similar results. Real-world application: understanding atrocities in wartime.",
    marks: 16,
    hint: "Be specific: numbers, voltage scale, prods. Evaluate: methodology, ethics, generalisability, real-world application.",
  },
  {
    topic: "Memory",
    question: "Describe and evaluate the multi-store model of memory (Atkinson and Shiffrin, 1968).",
    answer: "Three stores: Sensory Register — holds sensory info briefly; most decays. STM — capacity 7±2 chunks (Miller), duration 18–30s without rehearsal (Peterson & Peterson), acoustic encoding. LTM — unlimited capacity/duration, semantic encoding. Rehearsal transfers STM to LTM. Evidence: serial position effect (primacy = LTM; recency = STM). HM case study — severe anterograde amnesia with intact earlier LTM supports separate stores. Evaluation: overly simplistic — 'STM' is not a single store. Working Memory Model (Baddeley and Hitch): central executive, phonological loop, visuospatial sketchpad. Passive rehearsal does not explain flashbulb memories. Lack of ecological validity — artificial tasks.",
    marks: 16,
    hint: "Describe all three stores (capacity, duration, encoding). Use studies as evidence. Evaluate against WMM and ecological validity concerns.",
  },
  {
    topic: "Brain and Behaviour",
    question: "Discuss the role of biological factors in gender development. Refer to evidence in your answer.",
    answer: "Biological factors: chromosomes (XX=female, XY=male), hormones (oestrogen/testosterone), brain structure. Sex chromosomes: Klinefelter syndrome (XXY) and Turner syndrome (XO) show developmental differences linked to chromosomes. Hormonal influence: Money and Ehrhardt (1972) — females exposed to high androgens prenatally showed more 'masculine' toy preferences. Brain differences: Swaab — BSTc differs between males and females; may underpin gender identity. Animal studies: castrated male rats show female mating behaviours with oestrogen. Evaluation: reductionist — ignores social learning and cognition. David Reimer case (Money) — attempted gender reassignment ultimately failed, supporting biological basis. Cross-cultural variations in gender roles suggest social factors also matter. Biopsychosocial model most accepted.",
    marks: 16,
    hint: "Include specific studies. Evaluate by considering social/cognitive alternatives and the nature-nurture debate.",
  },
  {
    topic: "Psychological Problems",
    question: "Outline and evaluate one or more psychological explanations of depression.",
    answer: "Cognitive explanation (Beck's Cognitive Triad): negative automatic thoughts about self, world, and future. Cognitive distortions (overgeneralisation, catastrophising) maintain depression. Supported by efficacy of CBT. Abramson et al. (1978) — learned helplessness: depressed individuals attribute negatives to internal, stable, global causes. Evaluation: correlational evidence — negative cognitions may be symptom not cause. Ignores biological factors — low serotonin (monoamine hypothesis); SSRIs effective for ~50% of patients. Seligman's learned helplessness in dogs supports cognitive model but animal generalisability is limited. Gender differences (women twice as likely to be diagnosed) not explained by purely cognitive model.",
    marks: 16,
    hint: "Describe the cognitive triad in detail. Evaluate: correlation problem, biological alternatives (serotonin, SSRIs), gender and cultural factors.",
  },
  {
    topic: "Development",
    question: "Describe Piaget's theory of cognitive development. Evaluate the strengths and weaknesses of his research methods.",
    answer: "Piaget proposed four universal, sequential stages: Sensorimotor (0–2) — object permanence develops; Pre-operational (2–7) — egocentrism, no conservation; Concrete operational (7–11) — conservation, reversibility achieved; Formal operational (11+) — abstract reasoning. Evidence: conservation tasks — pre-operational children think taller beaker contains more water; three mountains task demonstrates egocentrism. Evaluation of methods: strengths — systematic observation, used many children. Weaknesses: tasks lacked ecological validity — abstract, unfamiliar. Hughes (1975) showed children can take another's perspective in a more meaningful task (policeman/doll), contradicting Piaget's egocentrism claims. Piaget may have underestimated children's abilities. Cultural universality questioned — stages may not be universal. Cross-sectional rather than longitudinal design.",
    marks: 16,
    hint: "Describe all four stages with examples. Evaluate: conservation tasks, Hughes's policeman study, ecological validity, cultural universality.",
  },
  {
    topic: "Research Methods",
    question: "Evaluate the use of experiments in psychological research. In your answer discuss both laboratory experiments and natural/field experiments.",
    answer: "Laboratory experiments: high control over variables (can isolate IV and DV), standardised procedures, replication possible — high internal validity and reliability. However, artificial settings reduce ecological validity — behaviour may not reflect real-world actions. Demand characteristics — participants may modify behaviour if aware of being studied (Orne). Ethical concerns: deception sometimes necessary. Natural/field experiments: take place in real-life settings, improving ecological validity and reducing demand characteristics. However, less control over extraneous variables reduces internal validity. Less replicable. Examples: Milgram (1963) — lab experiment, high control, ethical issues. Piliavin (1969) — New York subway natural experiment, high ecological validity but less control. Overall: experiments are the gold standard for establishing causality but must be balanced against ecological validity concerns and ethical constraints. A combination of methods strengthens psychological knowledge.",
    marks: 16,
    hint: "Compare lab (control, replication, low ecological validity) and field experiments (ecological validity, less control). Include named examples and discuss ethics.",
  },
  {
    topic: "Criminal Psychology",
    question: "Discuss the role of eyewitness testimony in criminal investigations. Evaluate factors that can affect the accuracy of eyewitness memory.",
    answer: "Eyewitness testimony (EWT) refers to accounts given by people who witnessed a crime. EWT is influential in court but psychological research reveals it is often unreliable. Loftus and Palmer (1974) — leading questions affect recall. Participants estimated different car crash speeds when asked 'smashed' vs 'hit'; 'smashed' group also recalled (non-existent) broken glass. Demonstrates post-event information contaminates memory. Factors affecting EWT accuracy: (1) Anxiety/stress — Yerkes-Dodson law: moderate arousal improves performance; extreme stress impairs recall. Weapon focus effect (Loftus, 1987) — attention drawn to weapon reduces accuracy of peripheral details. (2) Age — elderly and young children are more susceptible to misleading questions. (3) Age and duration of exposure — brief exposure reduces accuracy. (4) Post-event information — media, police questioning, co-witnesses can alter memories. (5) Confidence — not reliably correlated with accuracy; jurors overweight witness confidence. Evaluation: laboratory experiments on memory (Loftus) lack ecological validity — artificial stimuli, no real-world stress or consequences. However, cross-examination and identification parade research supports findings. Practical application: cognitive interview technique (Fisher and Geiselman) improves recall by reinstating context, reporting everything, recalling in different orders. EWT reforms include audio-recorded police interviews and judicial warnings to juries about reliability.",
    marks: 16,
    hint: "Describe EWT reliability research (Loftus and Palmer). List and explain factors (anxiety, age, leading questions, post-event). Evaluate with ecological validity and practical applications.",
  },
  {
    topic: "Memory",
    question: "Describe and evaluate research into the accuracy of long-term memory, including flashbulb memories and the effects of schemas.",
    answer: "Long-term memory is not a perfect recording of events — it is reconstructive (Bartlett, 1932). 'War of the Ghosts' study: participants recalled a Native American folk story in ways that were rationalised, shortened, and distorted to fit their own cultural schemas. Schemas are mental frameworks of existing knowledge that influence encoding and retrieval — filling gaps, distorting unusual information. Flashbulb memories (Brown and Kulik, 1977): highly detailed, vivid memories of personally significant, emotionally arousing events (e.g. hearing about 9/11). Believed to be more accurate and longer-lasting due to emotional arousal and physiological mechanisms (adrenaline strengthens hippocampal encoding). However, accuracy is debated — Neisser and Harsch (1992) tested recall of the Challenger disaster: 25% of participants gave different accounts a year later from their original reports despite high confidence. Evaluation: reconstructive memory has important implications for eyewitness testimony (Loftus). However, laboratory studies on memory have low ecological validity. Flashbulb memory research faces the problem of verifying whether memories are truly accurate. Overall, LTM is fallible, reconstructive, and influenced by prior knowledge and emotion.",
    marks: 16,
    hint: "Cover Bartlett's reconstructive memory (schemas), flashbulb memories (Brown and Kulik), and Neisser and Harsch's challenge. Evaluate ecological validity and practical implications.",
  },
  {
    topic: "Brain and Behaviour",
    question: "Discuss the contribution of neuroimaging and case studies to our understanding of the brain. Evaluate the strengths and weaknesses of each method.",
    answer: "Case studies of brain-damaged patients have provided early evidence for localisation of function. Phineas Gage (1848): a tamping rod destroyed his frontal lobe; his personality changed dramatically (from careful to impulsive), providing evidence for the frontal lobe's role in personality and decision-making. HM: bilateral hippocampal removal to treat epilepsy left him unable to form new long-term memories — strong evidence for the hippocampus in memory formation. Strengths: natural experiments; unique, rare data. Weaknesses: single cases cannot be generalised; damage is rarely confined to one area; rely on retrospective accounts. Neuroimaging: fMRI (functional MRI) measures blood oxygen levels to map active brain regions in real time. PET scans show glucose use. Advantages: non-invasive, detailed, in-vivo, can study healthy brains. Evidence for localisation: Broca's and Wernicke's areas confirmed in language production and comprehension. However: fMRI correlates brain activity with tasks but cannot establish causation. Brain is active in multiple regions simultaneously — oversimplification to say one region controls one function. Expensive and requires participants to remain still. Interpreting images is subjective. Overall: neuroimaging and case studies are complementary — case studies provide detail about individual damage; neuroimaging provides in-vivo group evidence. Neither alone is sufficient.",
    marks: 16,
    hint: "Contrast case studies (Gage, HM) with neuroimaging (fMRI, PET). For each: describe, give a strength, give a limitation. Compare the two methods.",
  },
];
