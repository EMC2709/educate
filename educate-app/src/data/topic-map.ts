/** Topic map for ALL GCSE subjects — used for mastery pathway */

export interface TopicNode {
  id: string;
  name: string;
  icon?: string;
}

export interface TopicGroup {
  name: string;
  topics: TopicNode[];
}

export const SUBJECT_TOPICS: Record<string, TopicGroup[]> = {
  'Mathematics': [
    { name: 'Number', topics: [
      { id: 'fractions-decimals', name: 'Fractions & Decimals' },
      { id: 'percentages', name: 'Percentages' },
      { id: 'powers-roots', name: 'Powers & Roots' },
      { id: 'standard-form', name: 'Standard Form' },
      { id: 'ratio-proportion', name: 'Ratio & Proportion' },
      { id: 'bounds', name: 'Bounds & Error Intervals' },
      { id: 'surds', name: 'Surds' },
    ]},
    { name: 'Algebra', topics: [
      { id: 'expressions', name: 'Expressions & Simplifying' },
      { id: 'linear-equations', name: 'Linear Equations' },
      { id: 'factorising', name: 'Factorising' },
      { id: 'simultaneous', name: 'Simultaneous Equations' },
      { id: 'quadratics', name: 'Quadratics' },
      { id: 'inequalities', name: 'Inequalities' },
      { id: 'sequences', name: 'Sequences (nth term)' },
      { id: 'graphs', name: 'Graphs & Coordinates' },
      { id: 'functions', name: 'Functions & Iteration' },
    ]},
    { name: 'Geometry', topics: [
      { id: 'angles', name: 'Angles & Polygons' },
      { id: 'area-perimeter', name: 'Area & Perimeter' },
      { id: 'volume', name: 'Volume & Surface Area' },
      { id: 'pythagoras', name: 'Pythagoras\u2019 Theorem' },
      { id: 'trigonometry', name: 'Trigonometry' },
      { id: 'circle-theorems', name: 'Circle Theorems' },
      { id: 'transformations', name: 'Transformations' },
      { id: 'vectors', name: 'Vectors' },
      { id: 'bearings', name: 'Bearings & Scale' },
    ]},
    { name: 'Probability & Statistics', topics: [
      { id: 'probability', name: 'Basic Probability' },
      { id: 'tree-diagrams', name: 'Tree Diagrams' },
      { id: 'venn-diagrams', name: 'Venn Diagrams' },
      { id: 'averages', name: 'Averages & Spread' },
      { id: 'cumulative', name: 'Cumulative Frequency' },
      { id: 'histograms', name: 'Histograms' },
    ]},
  ],

  'Biology': [
    { name: 'Cell Biology', topics: [
      { id: 'cell-structure', name: 'Cell Structure' },
      { id: 'cell-division', name: 'Cell Division (Mitosis)' },
      { id: 'diffusion-osmosis', name: 'Diffusion, Osmosis & Active Transport' },
      { id: 'stem-cells', name: 'Stem Cells' },
      { id: 'microscopy', name: 'Microscopy' },
    ]},
    { name: 'Organisation', topics: [
      { id: 'digestive-system', name: 'Digestive System' },
      { id: 'heart-blood', name: 'Heart & Blood Vessels' },
      { id: 'blood', name: 'Blood & Components' },
      { id: 'plant-organs', name: 'Plant Organ Systems' },
      { id: 'enzymes', name: 'Enzymes' },
    ]},
    { name: 'Infection & Response', topics: [
      { id: 'pathogens', name: 'Pathogens & Disease' },
      { id: 'immune-system', name: 'The Immune System' },
      { id: 'vaccination', name: 'Vaccination' },
      { id: 'antibiotics', name: 'Antibiotics & Painkillers' },
      { id: 'drug-development', name: 'Drug Development' },
    ]},
    { name: 'Bioenergetics', topics: [
      { id: 'photosynthesis', name: 'Photosynthesis' },
      { id: 'respiration', name: 'Respiration' },
      { id: 'exercise', name: 'Exercise & Metabolism' },
    ]},
    { name: 'Homeostasis', topics: [
      { id: 'nervous-system', name: 'Nervous System' },
      { id: 'hormones', name: 'Hormones & Endocrine' },
      { id: 'blood-glucose', name: 'Blood Glucose Regulation' },
      { id: 'kidneys', name: 'Kidneys & Water Balance' },
      { id: 'reproduction', name: 'Human Reproduction' },
    ]},
    { name: 'Inheritance & Evolution', topics: [
      { id: 'dna-genes', name: 'DNA & Genes' },
      { id: 'genetic-inheritance', name: 'Genetic Inheritance' },
      { id: 'variation', name: 'Variation' },
      { id: 'evolution', name: 'Evolution & Natural Selection' },
      { id: 'classification', name: 'Classification' },
    ]},
    { name: 'Ecology', topics: [
      { id: 'ecosystems', name: 'Ecosystems & Habitats' },
      { id: 'food-chains', name: 'Food Chains & Webs' },
      { id: 'biodiversity', name: 'Biodiversity' },
      { id: 'carbon-cycle', name: 'Carbon & Water Cycles' },
      { id: 'human-impact', name: 'Human Impact on Environment' },
    ]},
  ],

  'Chemistry': [
    { name: 'Atomic Structure', topics: [
      { id: 'atoms', name: 'Atoms & Elements' },
      { id: 'periodic-table', name: 'The Periodic Table' },
      { id: 'electron-config', name: 'Electron Configuration' },
      { id: 'isotopes', name: 'Isotopes & Relative Mass' },
      { id: 'history-atom', name: 'History of the Atom' },
    ]},
    { name: 'Bonding & Structure', topics: [
      { id: 'ionic-bonding', name: 'Ionic Bonding' },
      { id: 'covalent-bonding', name: 'Covalent Bonding' },
      { id: 'metallic-bonding', name: 'Metallic Bonding' },
      { id: 'properties', name: 'Properties of Structures' },
      { id: 'nanoparticles', name: 'Nanoparticles' },
    ]},
    { name: 'Quantitative Chemistry', topics: [
      { id: 'moles', name: 'Moles & Calculations' },
      { id: 'balancing', name: 'Balancing Equations' },
      { id: 'concentration', name: 'Concentration' },
      { id: 'yield-atom-economy', name: 'Yield & Atom Economy' },
    ]},
    { name: 'Chemical Changes', topics: [
      { id: 'reactivity-series', name: 'Reactivity Series' },
      { id: 'extraction-metals', name: 'Extraction of Metals' },
      { id: 'acids-bases', name: 'Acids, Bases & Salts' },
      { id: 'electrolysis', name: 'Electrolysis' },
      { id: 'neutralisation', name: 'Neutralisation' },
    ]},
    { name: 'Energy Changes', topics: [
      { id: 'exo-endo', name: 'Exothermic & Endothermic' },
      { id: 'bond-energies', name: 'Bond Energies' },
      { id: 'reaction-profiles', name: 'Reaction Profiles' },
    ]},
    { name: 'Rates & Equilibrium', topics: [
      { id: 'rate-of-reaction', name: 'Rate of Reaction' },
      { id: 'collision-theory', name: 'Collision Theory' },
      { id: 'catalysts', name: 'Catalysts' },
      { id: 'reversible', name: 'Reversible Reactions' },
      { id: 'le-chatelier', name: 'Le Chatelier\u2019s Principle' },
    ]},
    { name: 'Organic Chemistry', topics: [
      { id: 'hydrocarbons', name: 'Crude Oil & Hydrocarbons' },
      { id: 'alkanes-alkenes', name: 'Alkanes & Alkenes' },
      { id: 'polymers', name: 'Polymers' },
      { id: 'alcohols', name: 'Alcohols & Carboxylic Acids' },
    ]},
    { name: 'Earth & Atmosphere', topics: [
      { id: 'atmosphere', name: 'Earth\u2019s Atmosphere' },
      { id: 'greenhouse', name: 'Greenhouse Gases' },
      { id: 'resources', name: 'Earth\u2019s Resources' },
    ]},
  ],

  'Physics': [
    { name: 'Energy', topics: [
      { id: 'energy-stores', name: 'Energy Stores & Transfers' },
      { id: 'kinetic-energy', name: 'Kinetic & GPE' },
      { id: 'specific-heat', name: 'Specific Heat Capacity' },
      { id: 'power-efficiency', name: 'Power & Efficiency' },
      { id: 'energy-resources', name: 'Energy Resources' },
    ]},
    { name: 'Electricity', topics: [
      { id: 'circuits', name: 'Circuits & Components' },
      { id: 'series-parallel', name: 'Series & Parallel' },
      { id: 'resistance', name: 'Resistance & Ohm\u2019s Law' },
      { id: 'mains-electricity', name: 'Mains Electricity' },
      { id: 'power-energy', name: 'Electrical Power & Energy' },
      { id: 'static', name: 'Static Electricity' },
    ]},
    { name: 'Particle Model', topics: [
      { id: 'density', name: 'Density' },
      { id: 'states-of-matter', name: 'States of Matter' },
      { id: 'internal-energy', name: 'Internal Energy' },
      { id: 'specific-latent-heat', name: 'Specific Latent Heat' },
      { id: 'gas-pressure', name: 'Gas Pressure' },
    ]},
    { name: 'Atomic Structure', topics: [
      { id: 'atomic-model', name: 'Atomic Model' },
      { id: 'radioactivity', name: 'Radioactive Decay' },
      { id: 'half-life', name: 'Half-Life' },
      { id: 'uses-radiation', name: 'Uses of Radiation' },
      { id: 'nuclear-fission', name: 'Nuclear Fission & Fusion' },
    ]},
    { name: 'Forces', topics: [
      { id: 'forces-intro', name: 'Forces & Interactions' },
      { id: 'resultant-forces', name: 'Resultant Forces' },
      { id: 'speed-velocity', name: 'Speed, Velocity & Acceleration' },
      { id: 'newtons-laws', name: 'Newton\u2019s Laws' },
      { id: 'momentum', name: 'Momentum' },
      { id: 'stopping-distance', name: 'Stopping Distance' },
    ]},
    { name: 'Waves', topics: [
      { id: 'wave-properties', name: 'Wave Properties' },
      { id: 'em-spectrum', name: 'EM Spectrum' },
      { id: 'reflection-refraction', name: 'Reflection & Refraction' },
      { id: 'sound', name: 'Sound Waves' },
      { id: 'lenses', name: 'Lenses & Images' },
    ]},
    { name: 'Magnetism', topics: [
      { id: 'magnets', name: 'Magnets & Magnetic Fields' },
      { id: 'electromagnets', name: 'Electromagnets' },
      { id: 'motor-effect', name: 'Motor Effect' },
      { id: 'generators', name: 'Generators & Transformers' },
    ]},
    { name: 'Space', topics: [
      { id: 'solar-system', name: 'Solar System' },
      { id: 'life-cycle-stars', name: 'Life Cycle of Stars' },
      { id: 'red-shift', name: 'Red Shift & Big Bang' },
    ]},
  ],

  'Combined Science': [
    { name: 'Biology: Cells', topics: [
      { id: 'cell-structure', name: 'Cell Structure' },
      { id: 'transport', name: 'Transport in Cells' },
      { id: 'cell-division', name: 'Cell Division' },
    ]},
    { name: 'Biology: Organisation', topics: [
      { id: 'enzymes', name: 'Enzymes' },
      { id: 'digestive-system', name: 'Digestive System' },
      { id: 'heart-blood', name: 'Heart & Blood' },
    ]},
    { name: 'Biology: Disease', topics: [
      { id: 'pathogens', name: 'Pathogens' },
      { id: 'immune-response', name: 'Immune Response' },
      { id: 'vaccination', name: 'Vaccination' },
    ]},
    { name: 'Chemistry: Atoms', topics: [
      { id: 'atomic-structure', name: 'Atomic Structure' },
      { id: 'periodic-table', name: 'Periodic Table' },
      { id: 'bonding', name: 'Bonding' },
    ]},
    { name: 'Chemistry: Reactions', topics: [
      { id: 'acids-bases', name: 'Acids & Bases' },
      { id: 'rates', name: 'Rates of Reaction' },
      { id: 'energy-changes', name: 'Energy Changes' },
    ]},
    { name: 'Physics: Energy', topics: [
      { id: 'energy-transfers', name: 'Energy Transfers' },
      { id: 'electricity', name: 'Electricity' },
      { id: 'waves', name: 'Waves' },
    ]},
    { name: 'Physics: Forces', topics: [
      { id: 'forces-motion', name: 'Forces & Motion' },
      { id: 'radioactivity', name: 'Radioactivity' },
    ]},
  ],

  'English Language': [
    { name: 'Reading', topics: [
      { id: 'retrieve-info', name: 'Retrieving Information' },
      { id: 'language-analysis', name: 'Language Analysis' },
      { id: 'structure-analysis', name: 'Structure Analysis' },
      { id: 'evaluate-critically', name: 'Critical Evaluation' },
      { id: 'comparing-texts', name: 'Comparing Writers\u2019 Perspectives' },
    ]},
    { name: 'Writing', topics: [
      { id: 'descriptive-writing', name: 'Descriptive Writing' },
      { id: 'narrative-writing', name: 'Narrative Writing' },
      { id: 'persuasive-writing', name: 'Persuasive Writing' },
      { id: 'article-writing', name: 'Article & Report Writing' },
      { id: 'letter-writing', name: 'Letter & Speech Writing' },
    ]},
    { name: 'Technical Skills', topics: [
      { id: 'spelling-punctuation', name: 'Spelling & Punctuation' },
      { id: 'sentence-variety', name: 'Sentence Variety' },
      { id: 'paragraphing', name: 'Paragraphing & Cohesion' },
      { id: 'vocabulary', name: 'Ambitious Vocabulary' },
      { id: 'literary-techniques', name: 'Literary Techniques' },
    ]},
  ],

  'English Literature': [
    { name: 'Shakespeare', topics: [
      { id: 'macbeth', name: 'Macbeth' },
      { id: 'romeo-juliet', name: 'Romeo and Juliet' },
      { id: 'merchant-venice', name: 'The Merchant of Venice' },
      { id: 'much-ado', name: 'Much Ado About Nothing' },
    ]},
    { name: '19th Century Novel', topics: [
      { id: 'christmas-carol', name: 'A Christmas Carol' },
      { id: 'jekyll-hyde', name: 'Jekyll and Hyde' },
      { id: 'frankenstein', name: 'Frankenstein' },
      { id: 'sign-of-four', name: 'The Sign of the Four' },
    ]},
    { name: 'Modern Text', topics: [
      { id: 'inspector-calls', name: 'An Inspector Calls' },
      { id: 'lord-flies', name: 'Lord of the Flies' },
      { id: 'animal-farm', name: 'Animal Farm' },
      { id: 'blood-brothers', name: 'Blood Brothers' },
    ]},
    { name: 'Poetry', topics: [
      { id: 'power-conflict', name: 'Power & Conflict Poetry' },
      { id: 'love-relationships', name: 'Love & Relationships' },
      { id: 'unseen-poetry', name: 'Unseen Poetry' },
      { id: 'comparing-poems', name: 'Comparing Poems' },
    ]},
  ],

  'Geography': [
    { name: 'Physical Geography', topics: [
      { id: 'tectonic-hazards', name: 'Tectonic Hazards' },
      { id: 'weather-hazards', name: 'Weather Hazards' },
      { id: 'ecosystems', name: 'Ecosystems' },
      { id: 'rivers', name: 'River Landscapes' },
      { id: 'coasts', name: 'Coastal Landscapes' },
      { id: 'glaciation', name: 'Glacial Landscapes' },
    ]},
    { name: 'Human Geography', topics: [
      { id: 'urban-issues', name: 'Urban Issues & Challenges' },
      { id: 'changing-economy', name: 'Changing Economic World' },
      { id: 'resource-management', name: 'Resource Management' },
      { id: 'globalisation', name: 'Globalisation' },
      { id: 'development', name: 'Development Gap' },
    ]},
    { name: 'Fieldwork & Skills', topics: [
      { id: 'map-skills', name: 'Map Skills' },
      { id: 'graphical-skills', name: 'Graphical Skills' },
      { id: 'fieldwork', name: 'Fieldwork Methods' },
    ]},
  ],

  'History': [
    { name: 'Medicine Through Time', topics: [
      { id: 'medieval-medicine', name: 'Medieval Medicine' },
      { id: 'renaissance-medicine', name: 'Renaissance Medicine' },
      { id: 'industrial-medicine', name: 'Industrial Revolution Medicine' },
      { id: 'modern-medicine', name: 'Modern Medicine' },
    ]},
    { name: 'Conflict & Tension', topics: [
      { id: 'ww1-causes', name: 'Causes of WW1' },
      { id: 'ww1-events', name: 'Key Events of WW1' },
      { id: 'treaty-versailles', name: 'Treaty of Versailles' },
      { id: 'league-nations', name: 'League of Nations' },
      { id: 'rise-hitler', name: 'Rise of Hitler & WW2' },
    ]},
    { name: 'Elizabethan England', topics: [
      { id: 'elizabeth-court', name: 'Elizabeth\u2019s Court' },
      { id: 'religious-settlement', name: 'Religious Settlement' },
      { id: 'mary-queen-scots', name: 'Mary Queen of Scots' },
      { id: 'spanish-armada', name: 'Spanish Armada' },
      { id: 'elizabethan-society', name: 'Elizabethan Society' },
    ]},
    { name: 'Cold War', topics: [
      { id: 'cold-war-origins', name: 'Origins of the Cold War' },
      { id: 'berlin-wall', name: 'Berlin Wall & Crises' },
      { id: 'cuban-missile', name: 'Cuban Missile Crisis' },
      { id: 'vietnam-war', name: 'Vietnam War' },
      { id: 'end-cold-war', name: 'End of the Cold War' },
    ]},
  ],

  'Computer Science': [
    { name: 'Systems Architecture', topics: [
      { id: 'cpu', name: 'CPU & Fetch-Execute Cycle' },
      { id: 'memory', name: 'Memory (RAM & ROM)' },
      { id: 'storage', name: 'Secondary Storage' },
      { id: 'embedded-systems', name: 'Embedded Systems' },
    ]},
    { name: 'Data Representation', topics: [
      { id: 'binary', name: 'Binary & Hexadecimal' },
      { id: 'ascii-unicode', name: 'ASCII & Unicode' },
      { id: 'images-sound', name: 'Images & Sound' },
      { id: 'compression', name: 'Compression' },
    ]},
    { name: 'Networks', topics: [
      { id: 'network-types', name: 'Network Types (LAN/WAN)' },
      { id: 'protocols', name: 'Protocols & Layers' },
      { id: 'network-security', name: 'Network Security' },
    ]},
    { name: 'Programming', topics: [
      { id: 'variables-types', name: 'Variables & Data Types' },
      { id: 'selection-iteration', name: 'Selection & Iteration' },
      { id: 'arrays-records', name: 'Arrays & Records' },
      { id: 'functions-procedures', name: 'Functions & Procedures' },
      { id: 'algorithms', name: 'Searching & Sorting' },
    ]},
    { name: 'Cyber Security', topics: [
      { id: 'threats', name: 'Threats & Attacks' },
      { id: 'prevention', name: 'Prevention Methods' },
      { id: 'social-engineering', name: 'Social Engineering' },
    ]},
    { name: 'Ethics & Impact', topics: [
      { id: 'legislation', name: 'Legislation' },
      { id: 'ethical-issues', name: 'Ethical & Cultural Issues' },
      { id: 'environmental', name: 'Environmental Impact' },
    ]},
  ],

  'Spanish': [
    { name: 'Identity & Culture', topics: [
      { id: 'family', name: 'Family & Relationships' },
      { id: 'daily-routine', name: 'Daily Routine' },
      { id: 'free-time', name: 'Free Time & Hobbies' },
      { id: 'festivals', name: 'Customs & Festivals' },
    ]},
    { name: 'Local & Global', topics: [
      { id: 'home-town', name: 'Home & Town' },
      { id: 'social-issues', name: 'Social Issues' },
      { id: 'environment', name: 'Environment & Charity' },
      { id: 'healthy-living', name: 'Healthy Living' },
    ]},
    { name: 'Education & Work', topics: [
      { id: 'school-life', name: 'School Life' },
      { id: 'future-plans', name: 'Future Plans & Jobs' },
    ]},
    { name: 'Grammar', topics: [
      { id: 'present-tense', name: 'Present Tense' },
      { id: 'past-tenses', name: 'Preterite & Imperfect' },
      { id: 'future-conditional', name: 'Future & Conditional' },
      { id: 'subjunctive', name: 'Subjunctive' },
      { id: 'key-vocab', name: 'Key Vocabulary' },
    ]},
  ],

  'French': [
    { name: 'Identity & Culture', topics: [
      { id: 'family', name: 'Family & Relationships' },
      { id: 'daily-routine', name: 'Daily Routine' },
      { id: 'free-time', name: 'Free Time & Media' },
      { id: 'traditions', name: 'Customs & Traditions' },
    ]},
    { name: 'Local & Global', topics: [
      { id: 'home-area', name: 'Home & Local Area' },
      { id: 'holidays', name: 'Holidays & Travel' },
      { id: 'social-global', name: 'Social & Global Issues' },
    ]},
    { name: 'Education & Work', topics: [
      { id: 'school', name: 'School & Education' },
      { id: 'future-career', name: 'Future Career Plans' },
    ]},
    { name: 'Grammar', topics: [
      { id: 'present', name: 'Present Tense' },
      { id: 'past', name: 'Pass\u00e9 Compos\u00e9 & Imparfait' },
      { id: 'future-cond', name: 'Future & Conditional' },
      { id: 'key-vocab-fr', name: 'Key Vocabulary' },
    ]},
  ],

  'Religious Studies': [
    { name: 'Christianity Beliefs', topics: [
      { id: 'nature-god', name: 'Nature of God' },
      { id: 'trinity', name: 'The Trinity' },
      { id: 'creation', name: 'Creation' },
      { id: 'afterlife', name: 'Afterlife & Salvation' },
      { id: 'jesus-life', name: 'Jesus\u2019 Life & Teachings' },
      { id: 'sin-atonement', name: 'Sin & Atonement' },
    ]},
    { name: 'Islam Beliefs', topics: [
      { id: 'tawhid', name: 'Tawhid (Oneness of Allah)' },
      { id: 'prophethood', name: 'Prophethood' },
      { id: 'angels', name: 'Angels & Holy Books' },
      { id: 'akhirah', name: 'Akhirah (Afterlife)' },
      { id: 'predestination', name: 'Predestination' },
    ]},
    { name: 'Christian Practices', topics: [
      { id: 'worship', name: 'Worship & Prayer' },
      { id: 'sacraments', name: 'Sacraments & Ceremonies' },
      { id: 'pilgrimage', name: 'Pilgrimage' },
      { id: 'festivals-rs', name: 'Christian Festivals' },
      { id: 'church-community', name: 'Church & Community' },
    ]},
    { name: 'Islamic Practices', topics: [
      { id: 'five-pillars', name: 'Five Pillars' },
      { id: 'ten-obligatory', name: 'Ten Obligatory Acts' },
      { id: 'hajj', name: 'Hajj Pilgrimage' },
      { id: 'islamic-festivals', name: 'Islamic Festivals' },
      { id: 'jihad', name: 'Jihad' },
    ]},
    { name: 'Relationships & Family', topics: [
      { id: 'marriage', name: 'Marriage' },
      { id: 'divorce-rs', name: 'Divorce' },
      { id: 'family-rs', name: 'Family & Parenting' },
      { id: 'gender-equality', name: 'Gender Equality' },
      { id: 'sexuality', name: 'Sexuality' },
    ]},
    { name: 'Life & Death', topics: [
      { id: 'sanctity-life', name: 'Sanctity of Life' },
      { id: 'abortion', name: 'Abortion' },
      { id: 'euthanasia', name: 'Euthanasia' },
      { id: 'origins-universe', name: 'Origins of the Universe' },
      { id: 'death-afterlife', name: 'Death & Afterlife' },
    ]},
    { name: 'Peace, Crime & Justice', topics: [
      { id: 'peace-conflict', name: 'Peace & Conflict' },
      { id: 'just-war', name: 'Just War Theory' },
      { id: 'crime-punishment', name: 'Crime & Punishment' },
      { id: 'forgiveness', name: 'Forgiveness' },
      { id: 'human-rights', name: 'Human Rights & Justice' },
      { id: 'wealth-poverty', name: 'Wealth & Poverty' },
    ]},
  ],

  'Business Studies': [
    { name: 'Business in the Real World', topics: [
      { id: 'enterprise', name: 'Enterprise & Entrepreneurship' },
      { id: 'business-plans', name: 'Business Plans' },
      { id: 'ownership', name: 'Ownership & Liability' },
      { id: 'stakeholders', name: 'Stakeholders' },
      { id: 'business-growth', name: 'Business Growth' },
    ]},
    { name: 'Marketing', topics: [
      { id: 'market-research', name: 'Market Research' },
      { id: 'marketing-mix', name: 'Marketing Mix (4Ps)' },
      { id: 'segmentation', name: 'Market Segmentation' },
    ]},
    { name: 'Finance', topics: [
      { id: 'revenue-costs', name: 'Revenue, Costs & Profit' },
      { id: 'break-even', name: 'Break-Even Analysis' },
      { id: 'cash-flow', name: 'Cash Flow' },
      { id: 'sources-finance', name: 'Sources of Finance' },
    ]},
    { name: 'Operations', topics: [
      { id: 'production', name: 'Production Methods' },
      { id: 'quality', name: 'Quality Management' },
      { id: 'supply-chain', name: 'Supply Chain' },
    ]},
    { name: 'Human Resources', topics: [
      { id: 'recruitment', name: 'Recruitment & Selection' },
      { id: 'motivation', name: 'Motivation' },
      { id: 'training', name: 'Training & Development' },
    ]},
  ],

  'Psychology': [
    { name: 'Memory', topics: [
      { id: 'multi-store', name: 'Multi-Store Model' },
      { id: 'working-memory', name: 'Working Memory Model' },
      { id: 'long-term-memory', name: 'Types of Long-Term Memory' },
      { id: 'forgetting', name: 'Forgetting' },
      { id: 'eyewitness', name: 'Eyewitness Testimony' },
      { id: 'encoding', name: 'Encoding & Retrieval' },
    ]},
    { name: 'Social Influence', topics: [
      { id: 'conformity', name: 'Conformity' },
      { id: 'obedience', name: 'Obedience (Milgram)' },
      { id: 'minority-influence', name: 'Minority Influence' },
      { id: 'social-change', name: 'Social Change' },
      { id: 'bystander', name: 'Bystander Effect' },
    ]},
    { name: 'Psychopathology', topics: [
      { id: 'defining-abnormality', name: 'Defining Abnormality' },
      { id: 'phobias', name: 'Phobias' },
      { id: 'depression', name: 'Depression' },
      { id: 'ocd', name: 'OCD' },
      { id: 'treatments', name: 'Treatments & Therapies' },
    ]},
    { name: 'Development & Learning', topics: [
      { id: 'piaget', name: 'Piaget\u2019s Stages' },
      { id: 'classical-conditioning', name: 'Classical Conditioning' },
      { id: 'operant-conditioning', name: 'Operant Conditioning' },
      { id: 'attachment', name: 'Attachment' },
    ]},
    { name: 'Research Methods', topics: [
      { id: 'experiments', name: 'Experimental Methods' },
      { id: 'sampling', name: 'Sampling Methods' },
      { id: 'observations', name: 'Observations & Case Studies' },
      { id: 'correlations', name: 'Correlations' },
      { id: 'ethics-psych', name: 'Ethics in Psychology' },
      { id: 'data-analysis', name: 'Data Analysis' },
    ]},
  ],

  'Sociology': [
    { name: 'Sociological Theory', topics: [
      { id: 'functionalism', name: 'Functionalism' },
      { id: 'marxism', name: 'Marxism' },
      { id: 'feminism', name: 'Feminism' },
      { id: 'interactionism', name: 'Interactionism' },
    ]},
    { name: 'Families', topics: [
      { id: 'family-types', name: 'Family Types & Diversity' },
      { id: 'conjugal-roles', name: 'Conjugal Roles' },
      { id: 'divorce', name: 'Divorce & Marriage Trends' },
      { id: 'childhood', name: 'Childhood' },
      { id: 'domestic-labour', name: 'Domestic Labour' },
    ]},
    { name: 'Education', topics: [
      { id: 'role-education', name: 'Role of Education' },
      { id: 'class-achievement', name: 'Class & Achievement' },
      { id: 'gender-achievement', name: 'Gender & Achievement' },
      { id: 'ethnicity', name: 'Ethnicity & Achievement' },
      { id: 'hidden-curriculum', name: 'Hidden Curriculum' },
    ]},
    { name: 'Crime & Deviance', topics: [
      { id: 'theories-crime', name: 'Theories of Crime' },
      { id: 'crime-media', name: 'Crime & Media' },
      { id: 'social-control', name: 'Social Control' },
      { id: 'crime-stats', name: 'Crime Statistics' },
      { id: 'youth-crime', name: 'Youth Crime' },
    ]},
    { name: 'Social Stratification', topics: [
      { id: 'class-inequality', name: 'Class Inequality' },
      { id: 'gender-inequality', name: 'Gender Inequality' },
      { id: 'ethnic-inequality', name: 'Ethnic Inequality' },
      { id: 'poverty-wealth', name: 'Poverty & Wealth' },
    ]},
    { name: 'Research Methods', topics: [
      { id: 'questionnaires', name: 'Questionnaires & Interviews' },
      { id: 'observation', name: 'Observation' },
      { id: 'secondary-data', name: 'Secondary Data' },
      { id: 'sampling-soc', name: 'Sampling' },
      { id: 'ethics-soc', name: 'Ethics & Validity' },
    ]},
  ],

  'Food Preparation & Nutrition': [
    { name: 'Nutrition', topics: [
      { id: 'macronutrients', name: 'Macronutrients' },
      { id: 'micronutrients', name: 'Vitamins & Minerals' },
      { id: 'water-fibre', name: 'Water & Fibre' },
      { id: 'energy-needs', name: 'Energy Needs & BMR' },
      { id: 'dietary-needs', name: 'Dietary Needs & Life Stages' },
      { id: 'diet-related-ill-health', name: 'Diet-Related Ill Health' },
    ]},
    { name: 'Food Science', topics: [
      { id: 'food-science', name: 'Cooking & Heat Transfer' },
      { id: 'protein-denaturation', name: 'Protein Denaturation' },
      { id: 'starch-gelatinisation', name: 'Starch & Gelatinisation' },
      { id: 'raising-agents', name: 'Raising Agents' },
      { id: 'enzymic-browning', name: 'Enzymic Browning' },
    ]},
    { name: 'Food Provenance', topics: [
      { id: 'food-sources', name: 'Food Sources & Origins' },
      { id: 'food-processing', name: 'Primary & Secondary Processing' },
      { id: 'sustainability', name: 'Sustainability & Food Miles' },
      { id: 'seasonality', name: 'Seasonality' },
      { id: 'food-labelling', name: 'Food Labelling' },
    ]},
    { name: 'Food Choice & Culture', topics: [
      { id: 'religion-food', name: 'Religion & Food Choices' },
      { id: 'cuisines', name: 'British & International Cuisines' },
      { id: 'ethical-choices', name: 'Ethical Choices' },
      { id: 'sensory-analysis', name: 'Sensory Analysis' },
    ]},
    { name: 'Cooking & Preparation', topics: [
      { id: 'cooking-methods', name: 'Cooking Methods' },
      { id: 'knife-skills', name: 'Knife Skills' },
      { id: 'food-safety', name: 'Food Safety & Hygiene' },
      { id: 'food-spoilage', name: 'Food Spoilage & Preservation' },
      { id: 'food-preparation', name: 'Preparation Techniques' },
      { id: 'presentation', name: 'Presentation & Plating' },
    ]},
  ],

  'Art & Design': [
    { name: 'Drawing & 2D', topics: [
      { id: 'drawing', name: 'Drawing & Mark Making' },
      { id: 'perspective', name: 'Perspective & Proportion' },
      { id: 'tone-shading', name: 'Tone & Shading' },
      { id: 'still-life', name: 'Still Life' },
      { id: 'portraiture', name: 'Portraiture' },
    ]},
    { name: 'Colour & Painting', topics: [
      { id: 'painting', name: 'Painting Techniques' },
      { id: 'colour-theory', name: 'Colour Theory' },
      { id: 'watercolour', name: 'Watercolour' },
      { id: 'acrylic-oil', name: 'Acrylic & Oil' },
    ]},
    { name: 'Print & Mixed Media', topics: [
      { id: 'printmaking', name: 'Printmaking' },
      { id: 'mixed-media', name: 'Mixed Media' },
      { id: 'collage', name: 'Collage' },
      { id: 'photography', name: 'Photography' },
      { id: 'digital-art', name: 'Digital Art' },
    ]},
    { name: '3D & Sculpture', topics: [
      { id: 'clay-ceramics', name: 'Clay & Ceramics' },
      { id: 'sculpture', name: 'Sculpture' },
      { id: 'textiles', name: 'Textiles' },
    ]},
    { name: 'Art History & Analysis', topics: [
      { id: 'artists-analysis', name: 'Artist Analysis' },
      { id: 'art-movements', name: 'Art Movements' },
      { id: 'contemporary', name: 'Contemporary Art' },
      { id: 'critical-analysis', name: 'Critical Analysis' },
    ]},
  ],

  'Design & Technology': [
    { name: 'Materials & Components', topics: [
      { id: 'materials', name: 'Materials & Properties' },
      { id: 'timber', name: 'Timber & Manufactured Boards' },
      { id: 'metals-alloys', name: 'Metals & Alloys' },
      { id: 'polymers-dt', name: 'Polymers & Plastics' },
      { id: 'textiles-dt', name: 'Textiles & Fibres' },
      { id: 'smart-materials', name: 'Smart Materials' },
    ]},
    { name: 'Manufacturing & Tools', topics: [
      { id: 'manufacturing', name: 'Manufacturing Processes' },
      { id: 'hand-tools', name: 'Hand Tools & Equipment' },
      { id: 'cad-cam', name: 'CAD / CAM' },
      { id: 'joining-methods', name: 'Joining Methods' },
      { id: 'finishing', name: 'Surface Finishes' },
    ]},
    { name: 'Systems & Mechanisms', topics: [
      { id: 'energy-systems', name: 'Energy & Systems' },
      { id: 'mechanisms', name: 'Mechanisms & Levers' },
      { id: 'electronic-systems', name: 'Electronic Systems' },
      { id: 'programmable-components', name: 'Programmable Components' },
    ]},
    { name: 'Design Principles', topics: [
      { id: 'design-process', name: 'Design Process' },
      { id: 'design-brief', name: 'Briefs & Specifications' },
      { id: 'sustainability-dt', name: 'Sustainability & 6Rs' },
      { id: 'ergonomics', name: 'Ergonomics & Anthropometrics' },
      { id: 'iterative-design', name: 'Iterative Design' },
      { id: 'social-ethical', name: 'Social, Ethical & Environmental' },
    ]},
  ],

  'Economics': [
    { name: 'Economic Basics', topics: [
      { id: 'basic-econ-problem', name: 'Basic Economic Problem' },
      { id: 'opportunity-cost', name: 'Opportunity Cost' },
      { id: 'factors-production', name: 'Factors of Production' },
      { id: 'economic-systems', name: 'Economic Systems' },
    ]},
    { name: 'Microeconomics', topics: [
      { id: 'supply-demand', name: 'Supply & Demand' },
      { id: 'price-elasticity', name: 'Price Elasticity' },
      { id: 'market-failure', name: 'Market Failure' },
      { id: 'externalities', name: 'Externalities' },
      { id: 'competition', name: 'Competition & Monopoly' },
      { id: 'labour-market', name: 'Labour Markets & Wages' },
    ]},
    { name: 'Macroeconomics', topics: [
      { id: 'gdp-growth', name: 'GDP & Economic Growth' },
      { id: 'inflation', name: 'Inflation' },
      { id: 'unemployment', name: 'Unemployment' },
      { id: 'balance-of-payments', name: 'Balance of Payments' },
      { id: 'fiscal-policy', name: 'Fiscal Policy' },
      { id: 'monetary-policy', name: 'Monetary Policy' },
    ]},
    { name: 'Global Economy', topics: [
      { id: 'international-trade', name: 'International Trade' },
      { id: 'exchange-rates', name: 'Exchange Rates' },
      { id: 'globalisation-econ', name: 'Globalisation' },
      { id: 'developing-economies', name: 'Developing Economies' },
    ]},
  ],

  'Music': [
    { name: 'Musical Elements', topics: [
      { id: 'rhythm-metre', name: 'Rhythm & Metre' },
      { id: 'melody', name: 'Melody & Pitch' },
      { id: 'harmony', name: 'Harmony & Tonality' },
      { id: 'texture', name: 'Texture & Structure' },
      { id: 'dynamics-timbre', name: 'Dynamics & Timbre' },
      { id: 'tempo', name: 'Tempo & Articulation' },
    ]},
    { name: 'Areas of Study', topics: [
      { id: 'western-classical', name: 'Western Classical Tradition' },
      { id: 'popular-music', name: 'Popular Music' },
      { id: 'traditional-music', name: 'Traditional Music' },
      { id: 'film-music', name: 'Music for Film' },
      { id: 'musical-theatre', name: 'Musical Theatre' },
    ]},
    { name: 'Set Works & Composers', topics: [
      { id: 'baroque', name: 'Baroque Period' },
      { id: 'classical-period', name: 'Classical Period' },
      { id: 'romantic', name: 'Romantic Period' },
      { id: 'twentieth-century', name: '20th Century Music' },
    ]},
    { name: 'Performance & Composition', topics: [
      { id: 'composition-techniques', name: 'Composition Techniques' },
      { id: 'music-theory', name: 'Music Theory & Notation' },
      { id: 'chords-cadences', name: 'Chords & Cadences' },
      { id: 'scales-keys', name: 'Scales & Keys' },
      { id: 'improvisation', name: 'Improvisation' },
    ]},
  ],

  'Drama': [
    { name: 'Devising & Performance', topics: [
      { id: 'devising', name: 'Devising Theatre' },
      { id: 'staging', name: 'Staging & Design' },
      { id: 'character-development', name: 'Character Development' },
      { id: 'vocal-skills', name: 'Vocal Skills' },
      { id: 'physical-skills', name: 'Physical Skills' },
      { id: 'stage-directions', name: 'Stage Directions & Blocking' },
    ]},
    { name: 'Practitioners & Styles', topics: [
      { id: 'stanislavski', name: 'Stanislavski' },
      { id: 'brecht', name: 'Brecht' },
      { id: 'artaud', name: 'Artaud' },
      { id: 'frantic-assembly', name: 'Frantic Assembly' },
      { id: 'naturalism', name: 'Naturalism' },
      { id: 'physical-theatre', name: 'Physical Theatre' },
    ]},
    { name: 'Set Text Study', topics: [
      { id: 'blood-brothers-drama', name: 'Blood Brothers' },
      { id: 'dna-drama', name: 'DNA' },
      { id: 'an-inspector-calls-drama', name: 'An Inspector Calls' },
      { id: 'curious-incident', name: 'The Curious Incident' },
      { id: 'noughts-crosses', name: 'Noughts & Crosses' },
    ]},
    { name: 'Design & Analysis', topics: [
      { id: 'lighting-design', name: 'Lighting Design' },
      { id: 'sound-design', name: 'Sound Design' },
      { id: 'set-design', name: 'Set Design' },
      { id: 'costume-makeup', name: 'Costume & Makeup' },
      { id: 'live-theatre', name: 'Live Theatre Review' },
    ]},
  ],

  'Physical Education': [
    { name: 'Applied Anatomy', topics: [
      { id: 'skeletal-system', name: 'Skeletal System' },
      { id: 'muscular-system', name: 'Muscular System' },
      { id: 'joints-movement', name: 'Joints & Movement' },
      { id: 'cardio-respiratory', name: 'Cardio-Respiratory System' },
      { id: 'gas-exchange', name: 'Gas Exchange' },
      { id: 'energy-systems-pe', name: 'Aerobic & Anaerobic Systems' },
    ]},
    { name: 'Movement Analysis', topics: [
      { id: 'lever-systems', name: 'Lever Systems' },
      { id: 'planes-axes', name: 'Planes & Axes of Movement' },
      { id: 'muscle-contractions', name: 'Muscle Contractions' },
    ]},
    { name: 'Physical Training', topics: [
      { id: 'components-fitness', name: 'Components of Fitness' },
      { id: 'fitness-tests', name: 'Fitness Tests' },
      { id: 'training-methods', name: 'Training Methods' },
      { id: 'training-principles', name: 'Principles of Training (SPORT / FITT)' },
      { id: 'warm-up-cool-down', name: 'Warm-Up & Cool-Down' },
      { id: 'preventing-injury', name: 'Preventing Injury' },
    ]},
    { name: 'Health & Fitness', topics: [
      { id: 'diet-nutrition', name: 'Diet & Nutrition' },
      { id: 'sedentary-lifestyle', name: 'Sedentary Lifestyle' },
      { id: 'mental-health', name: 'Mental & Physical Health' },
    ]},
    { name: 'Sport Psychology', topics: [
      { id: 'skill-classification', name: 'Skill Classification' },
      { id: 'goal-setting', name: 'Goal Setting (SMART)' },
      { id: 'feedback', name: 'Types of Feedback' },
      { id: 'mental-preparation', name: 'Mental Preparation' },
      { id: 'arousal-anxiety', name: 'Arousal & Anxiety' },
    ]},
    { name: 'Socio-Cultural', topics: [
      { id: 'engagement', name: 'Engagement Patterns' },
      { id: 'commercialisation', name: 'Commercialisation' },
      { id: 'media-sport', name: 'Media in Sport' },
      { id: 'ethics-sport', name: 'Ethics & Deviance' },
      { id: 'drugs-sport', name: 'Drugs in Sport' },
    ]},
  ],
};
