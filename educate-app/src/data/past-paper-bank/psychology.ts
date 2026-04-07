import type { Question } from '@/types';

export const psychologyPastPaper: Question[] = [
  {
    topic: "Social Influence",
    question: "Describe and evaluate the social learning theory of aggression.\n\nIn your answer you should refer to at least one relevant study.",
    answer: "Social Learning Theory (Bandura) proposes aggression is learned through observation and imitation of role models, reinforced through vicarious reinforcement. Bandura's Bobo doll experiments (1961, 1963): children exposed to aggressive adult models reproduced similar aggression towards an inflatable doll — including novel aggressive acts not directly observed. Live models, filmed models, and cartoon models all increased aggression. Children who saw the model punished showed less imitation (vicarious punishment). Evaluation: High ecological validity concerns — Bobo doll is designed to be hit, not a real target. Ethical issues — deliberately induced aggressive behaviour in children. Ignores biological factors (testosterone, limbic system) — twin studies show genetic component to aggression. However, explains cultural differences in aggression rates and the role of media violence. Supported by further research: Huesmann longitudinal study showing childhood TV violence predicts adult aggression.",
    marks: 16,
    hint: "Describe the theory clearly (APRC format: Aim, Procedure, Results, Conclusion for studies), then evaluate using methodological issues and alternative explanations.",
  },
  {
    topic: "Social Influence",
    question: "Outline the procedures and findings of one study into obedience. Evaluate the study's contribution to our understanding of obedience.\n\n```mermaid\nflowchart TD\n    A[Milgram 1963\n40 male participants\nNewspaper advert] --> B[Participant = Teacher\nConfederate = Learner\nstrapped to chair]\n    B --> C[Wrong answer given\nTeacher told to\nadminister shock]\n    C --> D[Shocks: 15V to 450V\nin 15V increments\nLabelled Slight to XXX]\n    D --> E[Experimenter in lab coat\ngives prods to continue]\n    E --> F[KEY FINDING:\n65% went to 450V max\n100% went to 300V]\n```",
    answer: "Milgram (1963): Aim — to investigate whether ordinary Americans would obey an authority figure even when instructions conflicted with their conscience. Procedure — 40 male participants told they were in a study of learning; 'learner' (confederate) was strapped to chair. Participant acted as 'teacher' and gave electric shocks (15–450V) when learner got answers wrong. Experimenter wore lab coat (authority symbol) and gave standardised prods. Findings — 65% administered maximum 450V 'XXX' shock; all went to 300V. Signs of extreme stress observed (sweating, trembling). Evaluation: High internal validity (standardised procedure, objective measurement). Ethical issues — severe psychological distress, deception. Demand characteristics — participants may have 'known' shocks were fake (Orne and Holland). Generalisability — all-male American sample (1960s). However, cross-cultural replications (e.g. Meeus and Raaijmakers, Netherlands) produced similar results. Real-world application: understanding how ordinary people commit atrocities in wartime (Holocaust).",
    marks: 16,
    hint: "Be specific about the procedure — numbers, the voltage scale, the prods. Evaluation should cover methodology, ethics, and wider application.",
  },
  {
    topic: "Memory",
    question: "Describe and evaluate the multi-store model of memory (Atkinson and Shiffrin).",
    answer: "The Multi-Store Model (Atkinson and Shiffrin, 1968) proposes memory has three distinct stores: Sensory Register — holds information from the environment for a fraction of a second (iconic, echoic stores); most information decays rapidly. Short-Term Memory (STM) — capacity of 7±2 chunks (Miller), duration 18–30 seconds without rehearsal, mainly acoustic encoding. Maintenance rehearsal transfers information to LTM. Long-Term Memory (LTM) — potentially unlimited capacity and duration, mainly semantic encoding. Information retrieved from LTM can be held in STM (working memory). Supporting evidence: Serial position effect — primacy (LTM) and recency (STM) effects. HM case study — severe anterograde amnesia but intact LTM for events before surgery (supports separate stores). Evaluation: overly simplistic — 'STM' and 'LTM' are not single stores. Working Memory Model (Baddeley and Hitch) provides more nuanced STM model. Passive rehearsal loop doesn't explain how meaningful information is encoded without repetition. Lack of ecological validity — artificial memory tasks.",
    marks: 16,
    hint: "Describe all three stores with their specific features (capacity, duration, encoding). Use case studies as evidence and acknowledge that later models refined or replaced it.",
  },
  {
    topic: "Brain & Behaviour",
    question: "Discuss the role of biological factors in gender development.\n\nRefer to evidence in your answer.",
    answer: "Biological factors include chromosomes (XX=female, XY=male), hormones (oestrogen/testosterone), and brain structure differences. Sex chromosomes: Klinefelter syndrome (XXY) and Turner syndrome (XO) demonstrate the role of chromosomes — affected individuals show differences in typical gender development. Hormonal influence: Money and Ehrhardt (1972) — females exposed to high androgens prenatally (congenital adrenal hyperplasia) showed more 'masculine' toy preferences and behaviour. Testosterone correlates with dominance and aggression. Brain differences: Swaab (1985) — BSTc (bed nucleus of stria terminalis) differs between males and females and may underpin gender identity. Supporting animal studies: castrated male rats show female mating behaviours when given oestrogen. Evaluation: reductionist — ignores social learning and cognitive development. Nature-nurture cannot be easily separated (Money's case of David Reimer attempted gender reassignment — ultimately failed, supporting biological basis). Cross-cultural variations in gender roles suggest social factors matter too. Most psychologists now accept biopsychosocial model.",
    marks: 16,
    hint: "Include specific studies with details. Evaluate by considering alternative (social, cognitive) explanations and the nature-nurture debate.",
  },
  {
    topic: "Brain & Behaviour",
    question: "Outline and evaluate one or more psychological explanations of depression.",
    answer: "Cognitive explanation (Beck's Cognitive Triad): depression caused by negative automatic thoughts about self ('I am worthless'), world ('Everything goes wrong for me'), and future ('Things will never improve'). Cognitive distortions (overgeneralisation, catastrophising) maintain depression. Supported by efficacy of CBT — if changing thoughts reduces depression, thoughts must cause it. Abramson et al. (1978) — learned helplessness/attributional style: depressed individuals attribute negative events to internal, stable, global causes ('It's my fault, it will always be this way, it affects everything'). Evaluation: evidence is correlational — negative cognitions may be a symptom of depression, not the cause. Ignores biological factors — low serotonin (monoamine hypothesis): SSRIs (fluoxetine) effective for ~50% of patients, suggesting neurochemical basis. Seligman's research on learned helplessness in dogs supports cognitive model but animal studies have limited generalisability. Gender and cultural differences in depression rates suggest social factors (women twice as likely to be diagnosed) — not explained by purely cognitive model.",
    marks: 16,
    hint: "Give a clear, detailed explanation of the theory first, then evaluate using supporting evidence, contradictory evidence, and alternative explanations.",
  },
];
