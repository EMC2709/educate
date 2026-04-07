import type { Question } from '@/types';

export const sociologyPastPaper: Question[] = [
  {
    topic: "Education",
    question: "Applying material from Item A and your knowledge, evaluate the view that the education system mainly serves the interests of the ruling class.\n\n[Item A: Marxists such as Althusser argue that the education system acts as an Ideological State Apparatus, reproducing class inequality by transmitting ruling-class ideology as 'common sense'.]\n\n```mermaid\nflowchart TD\n    A[Ruling Class\nowns means of production] --> B[Controls education\nas ISA - Althusser]\n    B --> C[Transmits ruling\nclass ideology]\n    C --> D[Working class accept\ninequality as normal]\n    D --> E[Reproduce class\nstructure each generation]\n    F[Counter-argument:\nFunctionalist view] --> G[Education serves\nall of society\nMeritocracy - Parsons]\n    H[Bowles and Gintis:\nCorrespondence Principle] --> I[School mirrors workplace\nTeaches obedience\nto authority]\n```",
    answer: "Marxist support (using Item A): Althusser — education as ISA transmits ruling-class ideology. Bowles and Gintis 'correspondence principle' — school mirrors the workplace, teaching punctuality, obedience to authority, acceptance of hierarchy. Willis's 'Learning to Labour' — working-class 'lads' reject school but still end up in working-class jobs, reproducing class structure. Hidden curriculum reproduces values that benefit capitalism. Counter-arguments: Functionalist (Durkheim, Parsons) — education serves society as a whole through socialisation and meritocracy. New Right — education provides opportunities for the able regardless of class background. Postmodern views — class is just one of many social divisions; race and gender intersect. Evaluation: Marxist analysis neglects agency (some working-class students do achieve mobility). However, statistics support persistent class inequality: private school pupils dominate Russell Group universities, senior professions, government.",
    marks: 20,
    hint: "Use Item A as a springboard but add your own knowledge. Apply AO1 (knowledge), AO2 (application), AO3 (evaluation) — aim for all three throughout.",
  },
  {
    topic: "Family",
    question: "Outline and explain two ways in which the family performs functions for individuals and/or society.",
    answer: "1. Primary socialisation (Parsons): the family is the first and most important agent of socialisation, teaching children the basic norms and values of their culture — language, emotional regulation, cultural expectations. For Parsons, this is the 'warm bath' function — the family provides emotional security and warmth in an otherwise competitive society. Without this, individuals would be unable to integrate into wider society. 2. Reproduction and physical maintenance: the family reproduces the next generation of workers and citizens (essential for society's continuation) and provides for their physical needs — food, shelter, healthcare. Engels (Marxist perspective) saw the family's reproductive function as serving capitalism by producing the next generation of labour power 'at no cost to the capitalist'.",
    marks: 10,
    hint: "Each point should link the function to its wider social significance — not just what the family does but why it matters for society or individuals.",
  },
  {
    topic: "Education",
    question: "Applying material from Item B and your knowledge, evaluate sociological explanations for gender differences in educational achievement.\n\n[Item B: Girls now outperform boys at GCSE and A-level across most subjects. Sociologists offer both internal (school-based) and external (wider society) explanations for this pattern.]",
    answer: "External factors: McRobbie — changing female role models and aspirations; girls now expect careers. Impact of feminism on attitudes. Sue Sharpe study (1970s vs 1990s) — girls' priorities shifted from 'love and marriage' to 'careers and independence'. Labour market changes — more service sector jobs traditionally associated with female skills. Internal school factors: Mitsos and Browne — coursework favours female learning styles (organisation, sustained effort). Teacher interaction — Skelton argues boys receive more attention but often negative. Laddish culture among boys (Mac an Ghaill) — peer pressure to underachieve, anti-school subculture. Evaluation of 'boys underachieving' narrative: some argue this creates a 'moral panic' — working-class boys and boys from certain ethnic groups are the real problem, not 'boys' as a whole. Gender alone is insufficient — intersectionality with class and ethnicity crucial.",
    marks: 20,
    hint: "Named studies are essential here. Use Item B to structure your response but make sure to develop points beyond it. End with a clear evaluative judgement.",
  },
  {
    topic: "Crime & Deviance",
    question: "Outline and explain two reasons why official crime statistics may not give an accurate picture of the extent of crime in society.",
    answer: "1. The 'dark figure' of crime — not all crimes are reported to or recorded by police. Reasons for non-reporting: victim doesn't consider it serious enough, fear of reprisal, embarrassment (sexual offences), distrust of police (particularly in some ethnic minority communities), insurance fraud concerns. The British Crime Survey/Crime Survey for England and Wales consistently shows reported crime is higher than recorded crime. 2. Police recording practices: police exercise discretion in whether to record a report as a crime. Moral panics lead to increased police attention on certain groups — labelling of young Black men as criminal (Hall et al. 'Policing the Crisis') leads to more stop and search, more arrests, more recorded crime in that group. This creates a self-fulfilling prophecy and over-represents certain demographics in crime statistics.",
    marks: 10,
    hint: "Use sociological concepts (dark figure, moral panic, labelling) to show your understanding — not just common sense observations.",
  },
  {
    topic: "Media",
    question: "Applying material from Item C and your knowledge, evaluate the view that the media is the most important agent of socialisation in contemporary society.\n\n[Item C: The rise of social media and 24-hour news has transformed how people receive information and cultural values. Some sociologists argue this has made the media more influential than traditional agents of socialisation such as the family and education.]",
    answer: "Arguments supporting media primacy (using Item C): Postmodernists (Baudrillard) — 'hyperreality', media constructs our sense of reality more than lived experience. Time spent on screens by young people (UK average 7+ hours daily) suggests enormous influence. Social media creates peer norms around body image, behaviour, values. Neo-Marxists — media owned by ruling class (Murdoch) transmits ruling-class ideology (Glasgow Media Group — Bad News). Arguments against: family remains primary socialiser for values formed in childhood — Parsons's 'warm bath'. Education provides formal, sustained socialisation over 13+ years. Religion still primary for many ethnic/religious communities. Evaluation: the media's influence is pervasive but largely secondary — it reinforces rather than replaces family values. However, for some demographics (particularly teenagers), media may have overtaken family as primary reference point for identity and norms. Needs qualification by class, age, and digital access.",
    marks: 20,
    hint: "Use Item C to discuss why the media might be more important NOW than historically. Link to concepts of postmodernity, globalisation, and digital culture.",
  },
];
