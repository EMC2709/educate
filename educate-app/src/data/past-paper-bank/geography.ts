import type { Question } from '@/types';

export const geographyPastPaper: Question[] = [
  {
    topic: "Tectonic Hazards",
    question: "Assess the causes of a named tectonic hazard event you have studied. How far were the effects on people the result of physical rather than human factors?\n\nRefer to named evidence in your answer.",
    answer: "Students should refer to a specific event (e.g. Nepal Earthquake 2015, Haiti Earthquake 2010, or Japan Tsunami 2011). For Nepal: physical factors — magnitude 7.8 on Richter scale, shallow focus (8.2km depth), collision of Indian and Eurasian plates, timing (peak tourist season, middle of day). Human factors — poor building standards, mountainous terrain preventing aid access, high population density in Kathmandu valley, Nepal's LIC status (GDP $700 per capita), corruption in building regulations. The human factors arguably magnified the physical hazard into a disaster — compare with Japan 2011 where strict building codes reduced deaths despite stronger earthquake. Contrast: Haiti 2010 same magnitude as Japan but 230,000 deaths vs 15,000.",
    marks: 12,
    hint: "Name a specific event and use precise data (deaths, magnitude, Richter scale). The 'how far' command means you must reach a judgement about which factor was more significant.",
  },
  {
    topic: "Urban Issues",
    question: "Evaluate the effectiveness of strategies used to manage urban growth in one or more cities you have studied.",
    answer: "Students might refer to Rio de Janeiro's favela upgrading programme or Mumbai's Dharavi redevelopment. Rio: Favela-Bairro project — investment in infrastructure (water, sewage, roads), social programmes (education, healthcare). Effective in some areas but insufficient scale — hundreds of favelas, limited budget. UPP (Police Pacification Units) reduced violence in some favelas but militarisation had mixed results. Alternative approach: Singapore's model of public housing (HDB blocks housing 82% of population) — more sustainable but required authoritarian control. Evaluate using evidence: reduction in infant mortality rates, literacy rates, crime statistics. Conclude on what makes management effective: top-down vs bottom-up approaches, government commitment, sufficient funding.",
    marks: 12,
    hint: "Use named cities and specific schemes with data. 'Evaluate' means you must assess strengths and weaknesses and reach a judgement.",
  },
  {
    topic: "Development & Resources",
    question: "Study the resource management data. Explain the global pattern in access to clean water.\n\n[Students should refer to maps/statistics showing water access by HDI]\n\nFor this question, assess whether water insecurity is mainly caused by physical or human factors.",
    answer: "The pattern shows strong correlation between low HDI and poor water access — Sub-Saharan Africa and South Asia have highest levels of water insecurity. Physical factors: precipitation patterns (arid zones — Sahel, Middle East), climate change increasing drought frequency, aquifer depletion (e.g. Ogallala Aquifer, USA — ironic that a HIC faces physical scarcity). Human factors: poor infrastructure investment (no funds for treatment plants in LICs), agricultural use (70% of global freshwater), pollution of groundwater, political conflict (Syria, Yemen — war destroys infrastructure). On balance, human factors are more significant — many physically water-rich areas have poor access due to governance failures (Congo River basin — abundant water but poor infrastructure). Physical scarcity affects only ~33% of water-insecure people.",
    marks: 12,
    hint: "Engage specifically with any data or figures given. Use examples from both HICs and LICs to show the global pattern.",
  },
  {
    topic: "Development & Resources",
    question: "How and why does economic development vary within countries? Refer to examples from countries you have studied.",
    answer: "Within-country inequality is significant in both LICs/NEEs and HICs. Brazil — São Paulo state GDP per capita ~$15,000 vs North-East (Nordeste) ~$4,000. Reasons: historical colonial plantation economy in North-East, proximity to export routes in South, agglomeration economies in São Paulo (attracts further investment), selective migration of skilled workers to cities. UK — London and South-East vs North-East England. London's financial services sector generates 23% of UK GDP; North-East deindustrialisation left skills gaps. Government policies: Enterprise Zones, Northern Powerhouse — effectiveness debated. Use development indicators: infant mortality, literacy, GDP per capita, HDI to demonstrate variation. Conclusion: economic development within countries reflects cumulative causation and historical geography.",
    marks: 12,
    hint: "Use specific regional data — unemployment rates, GDP per region, or HDI scores. Compare regions within the same country, not between countries.",
  },
  {
    topic: "Ecosystems",
    question: "Assess the extent to which climate change is the main threat to the world's ecosystems.\n\nRefer to examples of specific ecosystems in your answer.",
    answer: "Climate change threatens multiple ecosystems: coral reefs (Great Barrier Reef — bleaching events 2016, 2017, 2020 due to sea temperature rise of 1°C above average); tropical rainforests (Amazon — drought stress reducing tree growth, increased fire risk); Arctic tundra (permafrost thaw releasing stored methane — positive feedback). However, other threats compete: deforestation (Amazon losing 10,000km² per year to farming/cattle — more immediate than climate change for many species), ocean acidification (from CO₂ absorption — separate from warming), invasive species, direct habitat destruction. Argument that deforestation is more immediately threatening than climate change for biodiversity hotspots. Climate change is a long-term systemic threat; direct destruction is more acute. On balance, climate change is the greatest long-term threat but not necessarily the main current threat.",
    marks: 12,
    hint: "Cover multiple specific ecosystems with data. The 'extent to which' framing requires a clear judgement — is it the main threat or not?",
  },
  {
    topic: "River Landscapes",
    question: "Using evidence, discuss how the characteristics of a river change from its upper course to its lower course.\n\n```mermaid\nflowchart LR\n    A[Upper Course\nV-shaped valley\nWaterfalls and rapids\nNarrow, shallow\nVertical erosion] --> B[Middle Course\nWider valley\nMeanders develop\nFloodplain begins\nLateral erosion]\n    B --> C[Lower Course\nWide flat floodplain\nLarge meanders\nOxbow lakes\nLevees\nDeposition dominant]\n```",
    answer: "Upper course: V-shaped valley, interlocking spurs, waterfalls (e.g. High Force, Teesdale — hard whinstone over softer limestone), rapids. River is narrow, shallow, fast with large, angular load. Dominant process: vertical erosion (hydraulic action, abrasion). Middle course: meanders develop as gradient decreases, valley widens, load becomes smaller and rounder due to attrition. Lateral erosion dominant. Floodplain begins to develop with river cliffs and slip-off slopes. Lower course: wide flat floodplain (e.g. Thames Valley), large meanders, oxbow lakes (from meander cut-off), levées, estuaries. River wide and deep but slow. Dominant process: deposition. Bradshaw Model formalises these changes: velocity actually increases downstream (larger channel = less friction) despite the gradient decrease — a common misconception.",
    marks: 8,
    hint: "Refer to the Bradshaw Model and use named UK examples. Address both channel characteristics and valley characteristics at each stage.",
  },
];
