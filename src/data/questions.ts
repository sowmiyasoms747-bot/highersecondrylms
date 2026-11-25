import { topicsOf, type Cls, type SubjectId } from './subjects';

export interface Question { id: string; cls: Cls; sid: SubjectId; topic: string; q: string; options: string[]; answer: string; why: string }

/**
 * One line per question: topic number | question | correct | wrong | wrong | wrong | explanation.
 * Options are shuffled when shown. Topic numbers follow the order in subjects.ts.
 */
const RAW: Record<string, string> = {
  '12-physics': `
1|Two charges are moved to double their separation. The force between them becomes|one-fourth|one-half|double|four times|Coulomb force varies as 1/r².
1|A dielectric of constant K fills a charged, isolated capacitor. Its potential difference becomes|V/K|KV|V|K²V|Charge is fixed while capacitance becomes KC, so V = Q/KC.
2|A wire is stretched to twice its length. Its resistance becomes|4 times|2 times|half|unchanged|Volume is constant, so length doubles and area halves.
2|Kirchhoff’s loop rule is a statement of conservation of|energy|charge|momentum|mass|The sum of potential changes round a loop is zero.
3|A charge moves parallel to a uniform magnetic field. The magnetic force on it is|zero|qvB|qvB/2|2qvB|F = qvB sin θ and θ = 0.
3|A galvanometer is converted to an ammeter by connecting a|low resistance in parallel|high resistance in series|low resistance in series|high resistance in parallel|A small shunt carries most of the current.
4|Susceptibility is small and negative for a|diamagnetic material|paramagnetic material|ferromagnetic material|permanent magnet|Diamagnetic materials are weakly repelled.
4|Above its Curie temperature a ferromagnet becomes|paramagnetic|diamagnetic|superconducting|non-conducting|Thermal motion destroys the domain alignment.
5|Lenz’s law follows from conservation of|energy|charge|momentum|flux|The induced current opposes the change that causes it.
5|A 0.5 m rod moves at 4 m/s across a 0.2 T field, all mutually perpendicular. The EMF is|0.4 V|0.1 V|0.8 V|4 V|ε = Blv = 0.2 × 0.5 × 4 = 0.4 V.
6|At resonance in a series LCR circuit, the power factor is|1|0|0.5|infinite|The reactances cancel, so Z = R and cos φ = 1.
6|A transformer does not work with|steady DC|AC of 50 Hz|AC of 60 Hz|high-frequency AC|A steady current gives no changing flux.
7|Which has the highest frequency?|Gamma rays|X-rays|Microwaves|Ultraviolet|Gamma rays lie at the top of the spectrum.
7|In an electromagnetic wave, the ratio E₀/B₀ equals|c|1/c|c²|μ₀|E₀ = cB₀.
8|A lens has power +2 D. Its focal length is|50 cm|2 cm|20 cm|200 cm|f = 1/P = 0.5 m.
8|Optical fibres work on|total internal reflection|diffraction|dispersion|interference|Light is trapped in the denser core.
9|In Young’s experiment, fringe width increases when|the screen is moved farther away|slit separation is increased|violet light replaces red|the apparatus is put in water|β = λD/d, so it grows with D.
9|Polarisation proves that light waves are|transverse|longitudinal|mechanical|stationary|Only transverse waves can be polarised.
10|Stopping potential depends on|frequency of light|intensity of light|distance of the source|area of the plate|eV₀ = hν − φ₀.
10|If the momentum of a particle doubles, its de Broglie wavelength becomes|half|double|four times|one-fourth|λ = h/p.
11|The energy of the electron in the first excited state of hydrogen is|−3.4 eV|−13.6 eV|−1.51 eV|−6.8 eV|E₂ = −13.6/4 = −3.4 eV.
11|Nuclear radius is proportional to|A^(1/3)|A|A²|A^(2/3)|R = R₀A^(1/3).
12|Doping silicon with phosphorus gives|an n-type semiconductor|a p-type semiconductor|an intrinsic semiconductor|an insulator|Phosphorus is pentavalent and donates electrons.
12|In reverse bias, the depletion region of a p–n junction|widens|narrows|disappears|stays the same|Majority carriers are pulled away from the junction.`,
  '12-chemistry': `
1|Henry’s law constant K_H increases with|temperature|volume|mass of gas|amount of solvent|Gases become less soluble on heating, so K_H rises.
1|Molality is moles of solute per|kg of solvent|litre of solution|kg of solution|litre of solvent|Molality uses the mass of solvent.
2|Which solution has the highest boiling point at equal molality?|AlCl₃|NaCl|Glucose|CaCl₂|AlCl₃ gives the most particles (i = 4).
2|The van’t Hoff factor for complete dissociation of K₂SO₄ is|3|2|4|1|It gives 2K⁺ and one SO₄²⁻.
3|In a galvanic cell, the anode is the electrode where|oxidation occurs|reduction occurs|electrons are gained|gas must form|Oxidation always takes place at the anode.
3|If E° of a cell is positive, ΔG° is|negative|positive|zero|infinite|ΔG° = −nFE°.
4|Molar conductivity on dilution|increases|decreases|stays constant|becomes zero|Ions move more freely and weak electrolytes ionise more.
4|Charge needed to deposit 1 mol of Cu from Cu²⁺ is|2 F|1 F|3 F|0.5 F|Cu²⁺ + 2e⁻ → Cu.
5|The unit of the rate constant of a first-order reaction is|s⁻¹|mol L⁻¹ s⁻¹|L mol⁻¹ s⁻¹|mol L⁻¹|Rate divided by concentration gives s⁻¹.
5|The half-life of a first-order reaction|does not depend on initial concentration|doubles when concentration doubles|halves when concentration doubles|depends on pressure only|t½ = 0.693/k.
6|A catalyst changes the|activation energy|enthalpy of reaction|equilibrium constant|Gibbs energy change|It provides a path of lower activation energy.
6|A plot of ln k against 1/T has slope|−Ea/R|Ea/R|−R/Ea|A|From ln k = ln A − Ea/RT.
7|The magnetic moment of Fe³⁺ (3d⁵) is about|5.92 BM|1.73 BM|3.87 BM|4.90 BM|Five unpaired electrons: √(5 × 7) = 5.92.
7|Zr and Hf have similar radii because of|lanthanoid contraction|the inert pair effect|d–d transition|actinoid contraction|The 4f electrons shield poorly.
8|The coordination number of Co in [Co(en)₃]³⁺ is|6|3|4|2|Each en is bidentate: 3 × 2 = 6.
8|Which is a strong-field ligand?|CN⁻|F⁻|Cl⁻|I⁻|CN⁻ lies at the strong end of the spectrochemical series.
9|SN1 reaction is fastest with|tert-butyl bromide|methyl bromide|ethyl bromide|n-propyl bromide|It gives the most stable carbocation.
9|Alcoholic KOH with bromoethane gives mainly|ethene|ethanol|ethane|ethyne|Alcoholic KOH causes elimination.
10|Which is most acidic?|Phenol|Ethanol|Methanol|tert-Butanol|Phenoxide is resonance stabilised.
10|Lucas reagent gives immediate turbidity with|tert-butyl alcohol|ethanol|methanol|propan-1-ol|Tertiary alcohols react at once.
11|Tollens’ reagent is used to detect|aldehydes|ketones|tertiary alcohols|ethers|Aldehydes reduce it to a silver mirror.
11|Which undergoes the Cannizzaro reaction?|Formaldehyde|Acetaldehyde|Acetone|Propanal|It has no α-hydrogen.
12|Which is the strongest acid?|CCl₃COOH|CH₃COOH|CH₂ClCOOH|CHCl₂COOH|Three chlorines withdraw electrons most.
12|Hell–Volhard–Zelinsky reaction places a halogen at the|α-carbon|β-carbon|carboxyl carbon|γ-carbon|It needs an α-hydrogen.
13|The carbylamine test is given by|primary amines|secondary amines|tertiary amines|amides|Only primary amines form isocyanides.
13|In water, the strongest base among these is|dimethylamine|aniline|ammonia|trimethylamine|The secondary methylamine is strongest in aqueous solution.
14|The non-reducing sugar is|sucrose|glucose|maltose|lactose|Both anomeric carbons of sucrose are bonded.
14|Which base is absent in DNA?|Uracil|Thymine|Guanine|Cytosine|Uracil occurs in RNA.`,
  '12-maths': `
1|The relation “is congruent to” on triangles is|an equivalence relation|reflexive only|symmetric only|not transitive|It is reflexive, symmetric and transitive.
1|f: R → R, f(x) = x² is|neither one-one nor onto|one-one but not onto|onto but not one-one|bijective|f(1) = f(−1), and negatives are never reached.
2|The principal value of sin⁻¹(−1/2) is|−π/6|π/6|−π/3|7π/6|The range is [−π/2, π/2].
2|For x in [−1, 1], sin⁻¹x + cos⁻¹x equals|π/2|π|0|π/4|It is a standard identity.
3|If A is 2×3 and B is 3×4, AB has order|2×4|3×3|4×2|2×3|Rows of A and columns of B.
3|The diagonal entries of a skew-symmetric matrix are|0|1|−1|any number|Each diagonal entry equals its own negative.
4|If det A = 3 for a 3×3 matrix, det(2A) is|24|6|12|18|det(kA) = kⁿ det A = 8 × 3.
4|A square matrix has no inverse when its determinant is|0|1|−1|negative|A⁻¹ = adj A / det A.
5|d/dx sin(x²) is|2x cos x²|cos x²|2 sin x cos x|x² cos x²|Use the chain rule.
5|The modulus function at x = 0 is|continuous but not differentiable|differentiable|discontinuous|not defined|Left and right derivatives differ.
6|f(x) = x² − 4x is decreasing for|x < 2|x > 2|all x|x > 4|f′ = 2x − 4 < 0.
6|The radius of a circle grows at 2 cm/s. At r = 5 cm, its area grows at|20π cm²/s|10π cm²/s|25π cm²/s|4π cm²/s|dA/dt = 2πr dr/dt.
7|∫ eˣ(sin x + cos x) dx equals|eˣ sin x + C|eˣ cos x + C|−eˣ sin x + C|eˣ + C|∫eˣ(f + f′) = eˣf + C.
7|∫ dx/(1 + x²) equals|tan⁻¹x + C|sin⁻¹x + C|log(1 + x²) + C|cot⁻¹x + C|It is a standard integral.
8|∫₀¹ 3x² dx equals|1|3|1/3|6|x³ from 0 to 1 is 1.
8|The integral of x³ from −1 to 1 equals|0|1/2|1|2|The integrand is an odd function.
9|The area under y = x from x = 0 to 4 is|8|4|16|2|∫x dx = x²/2 = 8.
9|The area of the ellipse x²/9 + y²/4 = 1 is|6π|36π|13π|5π|πab = π × 3 × 2.
10|The order of (y″)³ + y′ = 0 is|2|3|1|6|The highest derivative is y″.
10|The integrating factor of dy/dx + y/x = x is|x|1/x|eˣ|log x|e^∫dx/x = x.
11|If a·b = 0 for non-zero vectors, they are|perpendicular|parallel|equal|opposite|cos θ = 0.
11|The magnitude of 2i − j + 2k is|3|5|9|√3|√(4 + 1 + 4) = 3.
12|If l, m, n are direction cosines, l² + m² + n² equals|1|0|3|−1|It is the basic identity.
12|The direction ratios of the line (x−1)/2 = (y+3)/−1 = z/4 are|2, −1, 4|1, −3, 0|1, 1, 4|1, 3, 4|Read the denominators.
13|The optimum of a linear programming problem with a bounded region lies at|a corner point|the origin always|the centre|an interior point only|This is the corner point theorem.
13|The constraints x ≥ 0, y ≥ 0 limit the region to the|first quadrant|second quadrant|third quadrant|fourth quadrant|Both coordinates must be non-negative.
14|If P(A) = 0.5, P(B) = 0.4 and they are independent, P(A∩B) is|0.2|0.9|0.1|0.45|Multiply the probabilities.
14|A die is thrown. The probability of a 4, given that the number is even, is|1/3|1/6|1/2|2/3|The even outcomes are 2, 4 and 6.`,
  '12-biology': `
1|The typical angiosperm embryo sac at maturity is|7-celled, 8-nucleate|8-celled, 7-nucleate|8-celled, 8-nucleate|7-celled, 7-nucleate|The central cell has two nuclei.
1|The endosperm of angiosperms is usually|triploid|diploid|haploid|tetraploid|It forms by triple fusion.
2|Ovulation is triggered by a surge of|LH|progesterone|prolactin|oxytocin|The LH surge occurs mid-cycle.
2|Sperms mature and gain motility in the|epididymis|urethra|prostate|seminal vesicle|They are stored and matured there.
3|Copper-T mainly works by|suppressing sperm motility|stopping ovulation|closing the oviduct|raising progesterone|Copper ions reduce sperm motility and fertilising capacity.
3|In IVF–ET, fertilisation takes place|outside the body|in the uterus|in the oviduct|in the ovary|In vitro means in laboratory conditions.
4|The F₂ phenotypic ratio of a dihybrid cross is|9 : 3 : 3 : 1|3 : 1|1 : 2 : 1|1 : 1 : 1 : 1|Two genes assort independently.
4|AB blood group shows|co-dominance|incomplete dominance|epistasis|polygenic inheritance|Both alleles are expressed.
5|Down’s syndrome is due to|trisomy 21|monosomy X|XXY|trisomy 18|There is an extra chromosome 21.
5|Haemophilia is|X-linked recessive|autosomal dominant|Y-linked|autosomal recessive|It affects males more often.
6|Semi-conservative replication was shown by|Meselson and Stahl|Watson and Crick|Griffith|Hershey and Chase|They used ¹⁵N-labelled E. coli.
6|In DNA, adenine pairs with|thymine|guanine|cytosine|uracil|They are joined by two hydrogen bonds.
7|The start codon is|AUG|UAA|UGA|UAG|It codes for methionine.
7|The inducer of the lac operon is|lactose|glucose|tryptophan|galactosidase|Lactose inactivates the repressor.
8|Forelimbs of whale and bat are|homologous organs|analogous organs|vestigial organs|identical organs|They share a structure but differ in function.
8|In Hardy–Weinberg, heterozygotes are represented by|2pq|p²|q²|p + q|p² + 2pq + q² = 1.
9|HIV mainly attacks|helper T-cells|red blood cells|platelets|B-cells only|It reduces helper T-lymphocytes.
9|Malaria spreads through|female Anopheles|male Anopheles|Aedes|Culex|Only the female feeds on blood.
10|Curd is formed by|Lactobacillus|Rhizobium|Penicillium|Aspergillus|LAB produce acids that coagulate milk proteins.
10|Biogas is mainly|methane|oxygen|nitrogen|hydrogen|Methanogens produce it.
11|EcoRI is a|restriction enzyme|ligase|polymerase|vector|It cuts at GAATTC.
11|The enzyme used in PCR is|Taq polymerase|DNA ligase|helicase|reverse transcriptase|It survives high temperature.
12|Bt toxin is obtained from|Bacillus thuringiensis|Escherichia coli|Agrobacterium|Bacillus subtilis|The cry genes come from it.
12|The first gene therapy treated deficiency of|ADA|insulin|factor VIII|thyroxine|It was done in 1990.
13|Logistic growth gives a curve that is|S-shaped|J-shaped|straight|bell-shaped|It levels off at carrying capacity.
13|Lichen is an example of|mutualism|parasitism|commensalism|competition|The alga and fungus both benefit.
14|The pyramid of energy is|always upright|always inverted|spindle-shaped|sometimes inverted|Energy is lost at each level.
14|About what share of energy passes to the next trophic level?|10%|1%|50%|90%|This is the 10 per cent law.
15|Ex situ conservation includes|seed banks|national parks|sanctuaries|biosphere reserves|It protects species outside their habitat.
15|Species diversity is usually highest in|the tropics|the poles|temperate regions|deserts|Diversity falls from the equator to the poles.`,
  '12-english': `
1|In “The Last Lesson”, M. Hamel teaches|French|German|History|Mathematics|It is the last French lesson before German is imposed.
1|Mukesh in “Lost Spring” wants to become a|motor mechanic|bangle maker|teacher|pilot|He dreams of learning to repair and drive cars.
2|In “My Mother at Sixty-six”, the mother’s face is compared to a|late winter’s moon|rose|lamp|wilted leaf|She looks wan and pale.
2|Aunt Jennifer’s tigers are|unafraid|weak|lonely|trapped|They pace in sleek, chivalric certainty.
3|The Tiger King was finally killed because of a|wooden toy tiger|real tiger|poisoned meal|hunting fall|A splinter caused a fatal infection.
3|In “The Enemy”, Dr Sadao is a|surgeon|soldier|fisherman|general|He operates on the wounded prisoner.
4|A notice should be written|inside a box|as a letter|as a poem|in dialogue form|A box is part of the format.
4|A formal invitation card is written in the|third person|first person|second person|imperative|For example, “Mr and Mrs Rao request…”.
5|A letter to the editor begins with the salutation|Sir/Madam|Dear friend|My dear|Hello|It is a formal letter.
5|In a job application, the bio-data should be|attached separately|written in the subject line|left out|written as a poem|It follows the covering letter.
6|A report is usually written in the|past tense|future tense|present perfect only|imperative mood|It tells what has happened.
6|Which must an article have?|A title|RSVP|A salutation|A postal address|The title comes first, then the writer’s name.
7|Choose the correct sentence.|Neither of the boys was present.|Neither of the boys were present.|Neither of the boy was present.|Neither boys was present.|“Neither of” takes a singular verb.
7|She has been living here ___ 2015.|since|for|from|by|“Since” goes with a point in time.
8|Skimming means reading to|get the main idea|find one fact|learn every word|check spelling|Scanning is for finding specific facts.
8|A passage that gives facts without opinion is|factual|persuasive|narrative|lyrical|Factual passages inform.`,
  '12-accountancy': `
1|In the absence of a partnership deed, profits are shared|equally|in capital ratio|by seniority|by age|This is the rule in the Indian Partnership Act, 1932.
1|Interest on a partner’s loan, when no rate is agreed, is allowed at|6% p.a.|12% p.a.|10% p.a.|no interest|The Act provides 6% per annum.
1|Goodwill is|an intangible asset|a current asset|a fictitious asset|a liability|It has value but no physical form.
1|The ideal current ratio is commonly taken as|2 : 1|1 : 1|3 : 1|1 : 2|Current assets should be about twice current liabilities.`,
  '12-business': `
1|Management is considered|an art, a science and a profession|only an art|only a science|none of these|It has features of all three.
1|The father of scientific management is|F. W. Taylor|Henri Fayol|Peter Drucker|Elton Mayo|Taylor studied work methods on the shop floor.
1|The first function of management is|planning|organising|directing|controlling|All other functions depend on it.
1|The 4 Ps of marketing are product, price, place and|promotion|people|profit|process|These form the marketing mix.`,
  '12-economics': `
1|Macroeconomics studies|the economy as a whole|a single firm|a household|one market|It deals with aggregates.
1|The central bank of India is the|Reserve Bank of India|State Bank of India|NABARD|SEBI|RBI issues currency and controls credit.
1|If MPC is 0.8, the multiplier is|5|4|0.8|1.25|k = 1/(1 − 0.8) = 5.
1|India’s New Economic Policy was launched in|1991|1947|1969|2001|It introduced liberalisation, privatisation and globalisation.`,
  '12-history': `
1|The Great Bath was found at|Mohenjodaro|Harappa|Lothal|Kalibangan|It is a Harappan-civilisation site in Sindh.
1|The Vijayanagara empire was founded in|1336|1526|1206|1757|Harihara and Bukka founded it.
1|The revolt of 1857 began at|Meerut|Delhi|Kanpur|Jhansi|Sepoys rose there on 10 May 1857.
1|The chairman of the Drafting Committee was|B. R. Ambedkar|Rajendra Prasad|Jawaharlal Nehru|Vallabhbhai Patel|He led the drafting of the Constitution.`,
  '12-polsci': `
1|The Soviet Union was dissolved in|1991|1989|1945|2001|It ended the bipolar order.
1|SAARC was formed in|1985|1967|1995|1947|It was founded at Dhaka.
1|India’s first general elections were held in|1951–52|1947|1950|1957|They ran from October 1951 to February 1952.
1|The Panchsheel agreement was signed between India and|China|Pakistan|Nepal|Sri Lanka|It was signed in 1954.`,
  '12-geography': `
1|The Human Development Index was created by|Mahbub ul Haq|Ellen Semple|Ratzel|Griffith Taylor|It was introduced in 1990.
1|The Suez Canal links the Red Sea with the|Mediterranean Sea|Black Sea|Arabian Sea|Baltic Sea|It shortens the Europe–Asia route.
1|Quaternary activities deal with|knowledge and information|mining|farming|manufacturing|They include research and IT.
1|Cotton grows best in|black soil|desert soil|laterite soil|peaty soil|Regur holds moisture well.`,
  '11-physics': `
1|The dimensional formula of force is|MLT⁻²|ML²T⁻²|MLT⁻¹|ML⁻¹T⁻²|Force is mass times acceleration.
1|At the highest point of a projectile, its vertical velocity is|zero|maximum|equal to g|equal to the launch speed|Only the horizontal component remains.
1|Escape velocity from the earth is about|11.2 km/s|7.9 km/s|9.8 km/s|3 km/s|v = √(2gR).
1|For an ideal gas, molar Cp − Cv equals|R|2R|R/2|zero|This is Mayer’s relation.`,
  '11-chemistry': `
1|The number of particles in one mole is|6.022 × 10²³|6.022 × 10²²|3.01 × 10²³|1.6 × 10⁻¹⁹|It is Avogadro’s number.
1|The shape of methane is|tetrahedral|trigonal planar|linear|pyramidal|Carbon is sp³ hybridised.
1|The pH of pure water at 25 °C is|7|0|14|1|The hydrogen ion concentration is 10⁻⁷ M.
1|The general formula of alkynes is|CₙH₂ₙ₋₂|CₙH₂ₙ|CₙH₂ₙ₊₂|CₙHₙ|They contain one triple bond.`,
  '11-maths': `
1|A set with n elements has how many subsets?|2ⁿ|n²|2n|n!|Each element is either in or out.
1|i² equals|−1|1|i|0|This is the definition of the imaginary unit.
1|The limit of sin x / x as x → 0 is|1|0|infinity|undefined|It is a standard limit.
1|⁵C₂ equals|10|20|5|25|5 × 4 / 2 = 10.`,
  '11-biology': `
1|The powerhouse of the cell is the|mitochondrion|nucleus|ribosome|lysosome|It produces ATP.
1|Crossing over occurs in|pachytene|leptotene|diplotene|zygotene|It happens during prophase I.
1|The pacemaker of the heart is the|SA node|AV node|bundle of His|Purkinje fibres|It starts the heartbeat.
1|The functional unit of the kidney is the|nephron|neuron|alveolus|sarcomere|Nephrons filter blood.`,
  '11-english': `
1|“The Portrait of a Lady” is written by|Khushwant Singh|R. K. Narayan|Ruskin Bond|Mulk Raj Anand|He writes about his grandmother.
1|Choose the correct word: He is senior ___ me.|to|than|from|of|“Senior” takes “to”.
1|The passive of “She writes a letter” is|A letter is written by her.|A letter was written by her.|A letter has written by her.|A letter is being written by her.|Simple present passive: is + past participle.
1|In note-making, the notes should be|in points with abbreviations|in full paragraphs|in dialogue|in verse|Points and recognisable abbreviations save space.`,
  '11-accountancy': `
1|The accounting equation is|Assets = Liabilities + Capital|Assets = Capital − Liabilities|Capital = Assets + Liabilities|Liabilities = Assets + Capital|It is the base of double entry.
1|A cash book records|cash transactions|credit sales only|credit purchases only|returns|It is a journal and a ledger for cash.
1|A trial balance is prepared to check|arithmetical accuracy|profit|cash balance|tax due|It tests that debits equal credits.
1|Depreciation is charged on|fixed assets|current assets|liabilities|stock|Fixed assets lose value through use and time.`,
  '11-business': `
1|A sole proprietor’s liability is|unlimited|limited|shared|nil|Personal property can be used to pay debts.
1|A public company needs at least how many members?|7|2|50|200|The Companies Act, 2013 sets seven as the minimum.
1|Which is an internal source of finance?|Retained earnings|Debentures|Bank loan|Public deposits|It comes from the firm’s own profits.
1|Retail trade sells goods to|final consumers|wholesalers|manufacturers|exporters|Retailers are the last link in the chain.`,
  '11-economics': `
1|The mean of 2, 4, 6, 8 is|5|4|6|20|20 ÷ 4 = 5.
1|Other things equal, when the price of a good rises, its demand|falls|rises|stays constant|becomes zero|Price and quantity demanded move in opposite directions.
1|The slope of an indifference curve is the|MRS|MRP|MRTS|MU|It is the marginal rate of substitution.
1|The correlation coefficient lies between|−1 and +1|0 and 1|−10 and 10|0 and 100|±1 means perfect correlation.`,
  '11-history': `
1|Mesopotamia lay between the Tigris and the|Euphrates|Nile|Indus|Jordan|The name means land between rivers.
1|Genghis Khan united the|Mongols|Romans|Arabs|Franks|He became Great Khan in 1206.
1|The Renaissance began in|Italy|England|Spain|Russia|Its early centres were cities such as Florence.
1|The Meiji Restoration took place in|Japan|China|Korea|Vietnam|It began in 1868.`,
  '11-polsci': `
1|The Constitution of India came into force on|26 January 1950|15 August 1947|26 November 1949|2 October 1950|It is celebrated as Republic Day.
1|The minimum voting age in India is|18|21|16|25|It was lowered from 21 by the 61st Amendment.
1|The upper house of Parliament is the|Rajya Sabha|Lok Sabha|Vidhan Sabha|Vidhan Parishad|It represents the States.
1|Panchayati Raj got constitutional status by the|73rd Amendment|42nd Amendment|44th Amendment|86th Amendment|It came into force in 1993.`,
  '11-geography': `
1|The theory of continental drift was given by|Alfred Wegener|Kant|Laplace|Davis|He proposed it in 1912.
1|The standard meridian of India is|82½° E|80° E|90° E|75½° E|It passes near Mirzapur.
1|The layer containing weather phenomena is the|troposphere|stratosphere|mesosphere|thermosphere|Nearly all water vapour lies there.
1|The longest river of peninsular India is the|Godavari|Krishna|Kaveri|Narmada|It is about 1,465 km long.`,
};

export const QUESTIONS: Question[] = Object.entries(RAW).flatMap(([key, block]) => {
  const [c, s] = key.split('-');
  const cls = Number(c) as Cls;
  const sid = s as SubjectId;
  const topics = topicsOf(cls, sid);
  return block.trim().split('\n').map((line, i) => {
    const [t, q, ok, a, b, d, why] = line.split('|');
    return { id: `${key}-${i}`, cls, sid, topic: topics[Number(t) - 1][0], q, options: [ok, a, b, d], answer: ok, why };
  });
});

export function shuffle<T>(a: T[]): T[] {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}

export interface Pick { cls: Cls; sids: SubjectId[]; topics?: string[]; count: number }
export const poolOf = ({ cls, sids, topics }: Omit<Pick, 'count'>) =>
  QUESTIONS.filter((x) => x.cls === cls && sids.includes(x.sid) && (!topics || topics.includes(x.topic)));
export const pickQuestions = (p: Pick): Question[] =>
  shuffle(poolOf(p)).slice(0, p.count).map((x) => ({ ...x, options: shuffle(x.options) }));
