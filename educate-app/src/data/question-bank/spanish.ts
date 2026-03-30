import type { SubjectBank } from '@/types';

export const spanishBank: SubjectBank = {
  short: [
    { question: "How do you say 'I live in a house with my family' in Spanish?", answer: "Vivo en una casa con mi familia.", marks: 1, hint: "Use vivir (to live) in the present tense" },
    { question: "What is the difference between 'ser' and 'estar' in Spanish?", answer: "Both mean 'to be'. Ser is for permanent or inherent characteristics (identity, nationality, profession). Estar is for temporary states, conditions, positions and emotions.", marks: 2, hint: "Permanent vs temporary qualities" },
    { question: "How do you form the preterite tense for regular -ar verbs in Spanish?", answer: "Remove -ar and add: -é, -aste, -ó, -amos, -asteis, -aron. Example: hablar → hablé, hablaste, habló, hablamos, hablasteis, hablaron.", marks: 2, hint: "Replace -ar with preterite endings" },
    { question: "Give the Spanish for 'I would like to visit Spain in the future because it is beautiful.'", answer: "Me gustaría visitar España en el futuro porque es bonita/hermosa.", marks: 2, hint: "Use conditional of gustar + infinitive" },
  ],
  mid: [
    { question: "Write a paragraph in Spanish about your free time and hobbies (at least 5 sentences, including an opinion and a past experience).", answer: "[Model] En mi tiempo libre, me gusta escuchar música y salir con mis amigos. Practico el fútbol dos veces a la semana porque es emocionante. El fin de semana pasado, fui al cine con mi familia — la película fue increíble. En el futuro, me gustaría aprender a tocar la guitarra. En mi opinión, es importante tener pasatiempos para relajarse.", marks: 4, hint: "Present tense for habits, preterite for past experience, conditional for future. Include an opinion phrase." },
  ],
  long: [
    { question: "Write a formal letter in Spanish (approximately 150 words) applying for a summer work experience placement at a Spanish company. Include: why you want the role, your skills and experience, and your availability.", answer: "[Model] Estimado/a señor/señora, Le escribo para solicitar el puesto de prácticas laborales de verano. Soy estudiante de secundaria en el Reino Unido con mucho interés en los negocios internacionales. Hablo español desde hace cuatro años y me considero un/una estudiante trabajador/trabajadora y responsable. El año pasado, trabajé en una tienda local y aprendí mucho sobre el servicio al cliente. Además, sé usar programas informáticos como Word y Excel. Estoy disponible durante los meses de julio y agosto. Me gustaría mucho tener la oportunidad de desarrollar mis habilidades en un entorno profesional español. Adjunto mi currículum. Quedo a su disposición para cualquier información adicional. Atentamente, [Nombre]", marks: 8, hint: "Formal register, subjunctive where possible, range of tenses, connectives, formal opening and closing" },
  ],
  flashcard: [
    { term: "Ser vs Estar", definition: "SER: permanent traits, identity, origin, time, profession (SOY médico — I am a doctor). ESTAR: temporary states, emotions, location, ongoing actions (ESTOY cansado — I am tired).", example: "Ella ES española (nationality — ser). Ella ESTÁ en Madrid (location — estar)" },
    { term: "Preterite Tense", definition: "Used for completed, specific past actions. Regular -ar: -é, -aste, -ó, -amos, -asteis, -aron. Regular -er/-ir: -í, -iste, -ió, -imos, -isteis, -ieron. Key irregulars: ir/ser → fui; tener → tuve; hacer → hice.", example: "Ayer fui al parque (Yesterday I went to the park)" },
    { term: "Gustar Construction", definition: "To express liking: me gusta/n (I like), te gusta/n (you like), le gusta/n (he/she likes). Use gusta for singular nouns or infinitives; gustan for plural nouns.", example: "Me gusta el chocolate. Me gustan los deportes." },
    { term: "Conditional Tense", definition: "Used for what you would do. Formed by adding endings to the infinitive: -ía, -ías, -ía, -íamos, -íais, -ían. Same endings for -ar, -er, -ir verbs.", example: "Me gustaría viajar a México (I would like to travel to Mexico)" },
    { term: "Subjunctive Mood", definition: "Used after expressions of emotion, doubt, desire, necessity and certain conjunctions (para que, cuando in future, aunque). Common triggers: quiero que, es importante que, ojalá.", example: "Quiero que vengas (I want you to come)" },
    { term: "Opinion Phrases", definition: "En mi opinión (in my opinion), creo que (I believe that), pienso que (I think that), me parece que (it seems to me that), a mi juicio (in my judgement), desde mi punto de vista (from my point of view).", example: null },
  ],
};
