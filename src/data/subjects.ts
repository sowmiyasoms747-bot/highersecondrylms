export type Cls = 11 | 12;
export type Stream = 'science' | 'commerce' | 'arts';
export type SubjectId =
  | 'physics' | 'chemistry' | 'maths' | 'biology' | 'english' | 'accountancy'
  | 'business' | 'economics' | 'history' | 'polsci' | 'geography';
export type GoalId = 'board' | 'jee' | 'neet' | 'cuet' | 'other';

export const STREAMS: Record<Stream, { name: string; subjects: SubjectId[] }> = {
  science: { name: 'Science', subjects: ['physics', 'chemistry', 'maths', 'biology', 'english'] },
  commerce: { name: 'Commerce', subjects: ['accountancy', 'business', 'economics', 'maths', 'english'] },
  arts: { name: 'Arts / Humanities', subjects: ['history', 'polsci', 'geography', 'economics', 'english'] },
};

export const SUBJECT_NAMES: Record<SubjectId, string> = {
  physics: 'Physics', chemistry: 'Chemistry', maths: 'Mathematics', biology: 'Biology', english: 'English',
  accountancy: 'Accountancy', business: 'Business Studies', economics: 'Economics',
  history: 'History', polsci: 'Political Science', geography: 'Geography',
};

export const GOALS: { id: GoalId; name: string; note: string; short: string }[] = [
  { id: 'board', name: 'Board Exam', note: '(State / CBSE)', short: 'Board Exam' },
  { id: 'jee', name: 'JEE', note: '(Engineering)', short: 'JEE' },
  { id: 'neet', name: 'NEET', note: '(Medical)', short: 'NEET' },
  { id: 'cuet', name: 'CUET', note: '(University Admission)', short: 'CUET' },
  { id: 'other', name: 'Other Competitive Exams', note: '', short: 'Other Exams' },
];

const list = (s: string) => s.split('|').map((x) => x.trim());

/** Chapter names per class and subject, following the NCERT books. */
export const CHAPTERS: Record<Cls, Record<SubjectId, string[]>> = {
  12: {
    physics: list('Electric Charges and Fields|Electrostatic Potential and Capacitance|Current Electricity|Moving Charges and Magnetism|Magnetism and Matter|Electromagnetic Induction|Alternating Current|Electromagnetic Waves|Ray Optics and Optical Instruments|Wave Optics|Dual Nature of Radiation and Matter|Atoms|Nuclei|Semiconductor Electronics'),
    chemistry: list('Solutions|Electrochemistry|Chemical Kinetics|The d- and f-Block Elements|Coordination Compounds|Haloalkanes and Haloarenes|Alcohols, Phenols and Ethers|Aldehydes, Ketones and Carboxylic Acids|Amines|Biomolecules'),
    maths: list('Relations and Functions|Inverse Trigonometric Functions|Matrices|Determinants|Continuity and Differentiability|Application of Derivatives|Integrals|Application of Integrals|Differential Equations|Vector Algebra|Three Dimensional Geometry|Linear Programming|Probability'),
    biology: list('Sexual Reproduction in Flowering Plants|Human Reproduction|Reproductive Health|Principles of Inheritance and Variation|Molecular Basis of Inheritance|Evolution|Human Health and Disease|Microbes in Human Welfare|Biotechnology: Principles and Processes|Biotechnology and its Applications|Organisms and Populations|Ecosystem|Biodiversity and Conservation'),
    english: list('The Last Lesson|Lost Spring|Deep Water|The Rattrap|Indigo|Poets and Pancakes|The Interview|Going Places|My Mother at Sixty-six|Keeping Quiet|A Thing of Beauty|A Roadside Stand|Aunt Jennifer’s Tigers|The Third Level|The Tiger King|Journey to the End of the Earth|The Enemy|On the Face of It|Memories of Childhood|Notice Writing|Invitation and Reply|Letter to the Editor|Job Application|Article Writing|Report Writing'),
    accountancy: list('Accounting for Partnership: Basic Concepts|Reconstitution: Admission of a Partner|Reconstitution: Retirement or Death of a Partner|Dissolution of Partnership Firm|Accounting for Share Capital|Issue and Redemption of Debentures|Financial Statements of a Company|Analysis of Financial Statements|Accounting Ratios|Cash Flow Statement'),
    business: list('Nature and Significance of Management|Principles of Management|Business Environment|Planning|Organising|Staffing|Directing|Controlling|Financial Management|Marketing Management|Consumer Protection'),
    economics: list('Introduction to Macroeconomics|National Income Accounting|Money and Banking|Determination of Income and Employment|Government Budget and the Economy|Open Economy Macroeconomics|Indian Economy on the Eve of Independence|Indian Economy 1950–1990|Liberalisation, Privatisation and Globalisation|Human Capital Formation in India|Rural Development|Employment: Growth and Informalisation|Environment and Sustainable Development|Comparative Development Experiences'),
    history: list('Bricks, Beads and Bones|Kings, Farmers and Towns|Kinship, Caste and Class|Thinkers, Beliefs and Buildings|Through the Eyes of Travellers|Bhakti–Sufi Traditions|An Imperial Capital: Vijayanagara|Peasants, Zamindars and the State|Colonialism and the Countryside|Rebels and the Raj|Mahatma Gandhi and the Nationalist Movement|Framing the Constitution'),
    polsci: list('The End of Bipolarity|Contemporary Centres of Power|Contemporary South Asia|International Organisations|Security in the Contemporary World|Environment and Natural Resources|Globalisation|Challenges of Nation Building|Era of One-Party Dominance|Politics of Planned Development|India’s External Relations|Challenges to the Congress System|The Crisis of Democratic Order|Regional Aspirations|Recent Developments in Indian Politics'),
    geography: list('Human Geography: Nature and Scope|The World Population|Human Development|Primary Activities|Secondary Activities|Tertiary and Quaternary Activities|Transport and Communication|International Trade|Population of India|Human Settlements|Land Resources and Agriculture|Water Resources|Mineral and Energy Resources|Planning and Sustainable Development|Transport and Communication in India|International Trade of India'),
  },
  11: {
    physics: list('Units and Measurements|Motion in a Straight Line|Motion in a Plane|Laws of Motion|Work, Energy and Power|System of Particles and Rotational Motion|Gravitation|Mechanical Properties of Solids|Mechanical Properties of Fluids|Thermal Properties of Matter|Thermodynamics|Kinetic Theory|Oscillations|Waves'),
    chemistry: list('Some Basic Concepts of Chemistry|Structure of Atom|Classification of Elements and Periodicity|Chemical Bonding and Molecular Structure|Thermodynamics|Equilibrium|Redox Reactions|Organic Chemistry: Basic Principles|Hydrocarbons'),
    maths: list('Sets|Relations and Functions|Trigonometric Functions|Complex Numbers and Quadratic Equations|Linear Inequalities|Permutations and Combinations|Binomial Theorem|Sequences and Series|Straight Lines|Conic Sections|Introduction to Three Dimensional Geometry|Limits and Derivatives|Statistics|Probability'),
    biology: list('The Living World|Biological Classification|Plant Kingdom|Animal Kingdom|Morphology of Flowering Plants|Anatomy of Flowering Plants|Structural Organisation in Animals|Cell: The Unit of Life|Biomolecules|Cell Cycle and Cell Division|Photosynthesis in Higher Plants|Respiration in Plants|Plant Growth and Development|Breathing and Exchange of Gases|Body Fluids and Circulation|Excretory Products and their Elimination|Locomotion and Movement|Neural Control and Coordination|Chemical Coordination and Integration'),
    english: list('The Portrait of a Lady|We’re Not Afraid to Die|Discovering Tut|The Adventure|Silk Road|A Photograph|The Laburnum Top|The Voice of the Rain|Childhood|Father to Son|The Summer of the Beautiful White Horse|The Address|Mother’s Day|Birth|The Tale of Melon City|Note-making|Poster and Advertisement|Speech and Debate'),
    accountancy: list('Introduction to Accounting|Theory Base of Accounting|Recording of Transactions I|Recording of Transactions II|Bank Reconciliation Statement|Trial Balance and Rectification of Errors|Depreciation, Provisions and Reserves|Financial Statements I|Financial Statements II'),
    business: list('Business, Trade and Commerce|Forms of Business Organisation|Private, Public and Global Enterprises|Business Services|Emerging Modes of Business|Social Responsibilities of Business|Formation of a Company|Sources of Business Finance|MSME and Business Entrepreneurship|Internal Trade|International Business'),
    economics: list('Introduction to Statistics|Collection of Data|Organisation of Data|Presentation of Data|Measures of Central Tendency|Correlation|Index Numbers|Introduction to Microeconomics|Theory of Consumer Behaviour|Production and Costs|Theory of the Firm under Perfect Competition|Market Equilibrium'),
    history: list('Writing and City Life|An Empire Across Three Continents|Nomadic Empires|The Three Orders|Changing Cultural Traditions|Displacing Indigenous Peoples|Paths to Modernisation'),
    polsci: list('Constitution: Why and How?|Rights in the Indian Constitution|Election and Representation|Executive|Legislature|Judiciary|Federalism|Local Governments|Constitution as a Living Document|The Philosophy of the Constitution|Political Theory: An Introduction|Freedom|Equality|Social Justice|Rights|Citizenship|Nationalism|Secularism'),
    geography: list('Geography as a Discipline|The Origin and Evolution of the Earth|Interior of the Earth|Distribution of Oceans and Continents|Geomorphic Processes|Landforms and their Evolution|Composition of Atmosphere|Solar Radiation and Temperature|Atmospheric Circulation|Water in the Atmosphere|World Climate|Water (Oceans)|Movements of Ocean Water|Biodiversity and Conservation|India: Location|Structure and Physiography|Drainage System|Climate of India|Natural Vegetation|Natural Hazards and Disasters'),
  },
};

/** Practice topics: [name, chapter numbers it covers]. */
export const TOPICS: Partial<Record<string, [string, number[]][]>> = {
  '12-physics': [['Electrostatics', [1, 2]], ['Current Electricity', [3]], ['Magnetic Effects of Current', [4]], ['Magnetism and Matter', [5]], ['Electromagnetic Induction', [6]], ['Alternating Current', [7]], ['Electromagnetic Waves', [8]], ['Ray Optics', [9]], ['Wave Optics', [10]], ['Dual Nature', [11]], ['Atoms and Nuclei', [12, 13]], ['Semiconductors', [14]]],
  '12-chemistry': [['Concentration and Solubility', [1]], ['Colligative Properties', [1]], ['Electrochemical Cells', [2]], ['Conductance and Electrolysis', [2]], ['Rate Laws', [3]], ['Temperature and Rate', [3]], ['d- and f-Block', [4]], ['Coordination Compounds', [5]], ['Haloalkanes and Haloarenes', [6]], ['Alcohols, Phenols and Ethers', [7]], ['Aldehydes and Ketones', [8]], ['Carboxylic Acids', [8]], ['Amines', [9]], ['Biomolecules', [10]]],
  '12-maths': [['Relations and Functions', [1]], ['Inverse Trigonometry', [2]], ['Matrices', [3]], ['Determinants', [4]], ['Continuity and Differentiability', [5]], ['Application of Derivatives', [6]], ['Indefinite Integrals', [7]], ['Definite Integrals', [7]], ['Area under Curves', [8]], ['Differential Equations', [9]], ['Vectors', [10]], ['3D Geometry', [11]], ['Linear Programming', [12]], ['Probability', [13]]],
  '12-biology': [['Reproduction in Plants', [1]], ['Human Reproduction', [2]], ['Reproductive Health', [3]], ['Mendelian Genetics', [4]], ['Chromosomal Inheritance', [4]], ['DNA and Replication', [5]], ['Gene Expression', [5]], ['Evolution', [6]], ['Health and Disease', [7]], ['Microbes in Human Welfare', [8]], ['Biotechnology: Principles', [9]], ['Biotechnology: Applications', [10]], ['Organisms and Populations', [11]], ['Ecosystem', [12]], ['Biodiversity', [13]]],
  '12-english': [['Flamingo: Prose', [1, 2, 3, 4, 5, 6, 7, 8]], ['Flamingo: Poetry', [9, 10, 11, 12, 13]], ['Vistas', [14, 15, 16, 17, 18, 19]], ['Notice and Invitation', [20, 21]], ['Letters and Job Application', [22, 23]], ['Article and Report', [24, 25]], ['Grammar', []], ['Reading Skills', []]],
};

export const topicsOf = (cls: Cls, sid: SubjectId): [string, number[]][] =>
  TOPICS[`${cls}-${sid}`] ?? [['Mixed Practice', CHAPTERS[cls][sid].map((_, i) => i + 1)]];
