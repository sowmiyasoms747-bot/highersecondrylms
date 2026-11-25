import type { Stream, SubjectId } from './subjects';

export type ExamId = 'board' | 'jee' | 'neet' | 'cuet';
export interface Exam { id: ExamId; name: string; note: string; tag: string; about: string; mark: number; minus: number; sids: Record<Stream, SubjectId[]>; site: string; siteName: string; tips: string[] }

const SCI: SubjectId[] = ['physics', 'chemistry', 'maths', 'biology', 'english'];
const COM: SubjectId[] = ['accountancy', 'business', 'economics', 'maths', 'english'];
const ART: SubjectId[] = ['history', 'polsci', 'geography', 'economics', 'english'];
const same = (s: SubjectId[]) => ({ science: s, commerce: s, arts: s });

export const EXAMS: Exam[] = [
  { id: 'board', name: 'Board Exam', note: '(State / CBSE)', tag: 'PYQs + Solutions', about: 'Written board examination covering your full syllabus, with theory and practical or internal marks.', mark: 1, minus: 0, sids: { science: SCI, commerce: COM, arts: ART }, site: 'https://www.cbse.gov.in', siteName: 'cbse.gov.in', tips: ['Write step-wise answers; steps carry marks.', 'Revise NCERT examples and exercises first.', 'Practise full papers in three hours.'] },
  { id: 'jee', name: 'JEE', note: '(Main & Advanced)', tag: 'PYQs + Analysis', about: 'Entrance for engineering at NITs, IIITs and, through Advanced, the IITs. Physics, Chemistry and Mathematics from Classes 11 and 12.', mark: 4, minus: 1, sids: same(['physics', 'chemistry', 'maths']), site: 'https://jeemain.nta.nic.in', siteName: 'jeemain.nta.nic.in', tips: ['Attempt sure questions first; wrong answers cost a mark.', 'Keep an error notebook for each subject.', 'Analyse every mock for as long as you spent writing it.'] },
  { id: 'neet', name: 'NEET', note: '(UG)', tag: 'PYQs + Solutions', about: 'Single entrance for undergraduate medical and dental courses. Physics, Chemistry and Biology from Classes 11 and 12.', mark: 4, minus: 1, sids: same(['physics', 'chemistry', 'biology']), site: 'https://neet.nta.nic.in', siteName: 'neet.nta.nic.in', tips: ['Read NCERT Biology line by line.', 'Finish Biology quickly to leave time for Physics.', 'Revise formulae and reaction names daily.'] },
  { id: 'cuet', name: 'CUET', note: '(UG)', tag: 'PYQs + Practice', about: 'Common entrance for undergraduate admission to central and many other universities, with language, domain and general tests.', mark: 5, minus: 1, sids: { science: SCI, commerce: COM, arts: ART }, site: 'https://cuet.nta.nic.in', siteName: 'cuet.nta.nic.in', tips: ['Choose domain subjects by your target course.', 'NCERT Class 12 is the base for domain papers.', 'Practise reading passages every day.'] },
];
export const examOf = (id?: string | null) => EXAMS.find((e) => e.id === id);

export const EXAM_TIPS: { title: string; items: string[] }[] = [
  { title: 'One month before', items: ['Finish the syllabus and list weak chapters.', 'Solve one full paper every third day.', 'Revise formula sheets on alternate days.'] },
  { title: 'One week before', items: ['Stop new topics and revise notes only.', 'Fix your sleep to match the exam time.', 'Check hall ticket, ID and centre route.'] },
  { title: 'The night before', items: ['Skim one page of key points per chapter.', 'Pack pens, hall ticket and water.', 'Sleep at least seven hours.'] },
  { title: 'In the hall', items: ['Read the whole paper in the reading time.', 'Answer what you know best first.', 'Keep ten minutes to check numbering and units.'] },
];

export const QUOTES = [
  'Stay consistent today,\nfor the life you want tomorrow.',
  'Small steps every day become big results in the exam hall.',
  'You do not need to be perfect; you need to keep going.',
  'One chapter at a time is still forward.',
  'Discipline is choosing what you want most over what you want now.',
  'Your only competition is who you were yesterday.',
  'Hard topics become easy topics after enough honest tries.',
];

export const STORIES = [
  { name: 'A. P. J. Abdul Kalam', tag: 'Scientist and President of India', text: 'He grew up in Rameswaram in a family of modest means and sold newspapers as a boy. He studied physics and aeronautical engineering, led India’s missile programmes and became the 11th President of India.', lesson: 'Where you start does not decide where you finish.' },
  { name: 'Kalpana Chawla', tag: 'Astronaut', text: 'Born in Karnal, Haryana, she studied aeronautical engineering at Punjab Engineering College before moving to the United States. In 1997 she became the first woman of Indian origin in space.', lesson: 'Choose the goal first, then find the path.' },
  { name: 'Srinivasa Ramanujan', tag: 'Mathematician', text: 'Largely self-taught in Kumbakonam and Madras, he filled notebooks with original results. His letter to G. H. Hardy took him to Cambridge, and he became a Fellow of the Royal Society.', lesson: 'Deep curiosity can teach what no class offers.' },
  { name: 'Tessy Thomas', tag: 'Missile scientist', text: 'She studied engineering at Thrissur and joined DRDO, where she became project director for Agni-IV, the first woman to lead an Indian missile project.', lesson: 'Persistence makes room for those who follow.' },
];

export const TIPS = [
  { title: 'Pomodoro', text: 'Study 25 minutes, rest 5. After four rounds, take a longer break.' },
  { title: 'Active recall', text: 'Close the book and write what you remember before reading again.' },
  { title: 'Spaced revision', text: 'Revise after 1, 3, 7 and 21 days to keep a chapter fresh.' },
  { title: 'Two-list planning', text: 'Write three must-do tasks and three nice-to-do tasks each day.' },
  { title: 'Phone out of reach', text: 'Keep it in another room while you study. Distance beats willpower.' },
  { title: 'Teach it', text: 'Explain a concept aloud in simple words; the gaps show at once.' },
];

export const WELLBEING = [
  { title: 'Sleep 7–8 hours', text: 'Memory is strengthened while you sleep.' },
  { title: 'Move every day', text: 'Twenty minutes of walking lifts focus and mood.' },
  { title: 'Breathe 4-4-6', text: 'In for 4, hold for 4, out for 6. Repeat five times before a test.' },
  { title: 'Talk to someone', text: 'If worry stays for days, speak to a parent, teacher or counsellor. In India, Tele-MANAS (14416) is free and open all day.' },
];

export const HABITS = [
  { id: 'study', name: 'Studied at least 3 hours' },
  { id: 'revise', name: 'Revised yesterday’s topic' },
  { id: 'practice', name: 'Solved 10 questions' },
  { id: 'sleep', name: 'Slept 7 hours or more' },
  { id: 'move', name: 'Exercised or walked' },
];

export interface Career { id: string; name: string; note: string; about: string; courses: string[]; exams: string[]; roles: string[]; steps: string[] }
export const CAREERS: Career[] = [
  { id: 'engineering', name: 'Engineering', note: '(JEE)', about: 'Design, build and run technology, from software and electronics to bridges and energy systems.', courses: ['B.Tech / B.E.', 'B.Arch', 'Integrated M.Tech', 'Diploma'], exams: ['JEE Main', 'JEE Advanced', 'State counselling (such as TNEA)', 'BITSAT', 'VITEEE'], roles: ['Software engineer', 'Data scientist', 'Civil engineer', 'Electronics engineer'], steps: ['Take Physics, Chemistry and Maths', 'Prepare for JEE alongside boards', 'Join counselling with a branch list', 'Build projects from the first year'] },
  { id: 'medical', name: 'Medical', note: '(NEET)', about: 'Care for people’s health as a doctor, dentist, nurse, pharmacist or allied health professional.', courses: ['MBBS', 'BDS', 'BAMS / BHMS', 'B.Sc. Nursing', 'B.Pharm'], exams: ['NEET UG', 'Nursing and allied entrances'], roles: ['Doctor', 'Dentist', 'Pharmacist', 'Physiotherapist'], steps: ['Take Physics, Chemistry and Biology', 'Master NCERT Biology', 'Write NEET and join counselling', 'Plan for internship and PG'] },
  { id: 'research', name: 'Science', note: '& Research', about: 'Study nature and create knowledge in physics, chemistry, biology, mathematics and beyond.', courses: ['B.Sc.', 'BS–MS', 'Integrated M.Sc.', 'B.Stat / B.Math'], exams: ['IISER Aptitude Test', 'NEST', 'CUET UG', 'ISI admission test'], roles: ['Research scientist', 'Professor', 'Data analyst', 'Science writer'], steps: ['Choose the subject you enjoy most', 'Try olympiads and science fairs', 'Apply to IISERs, NISER and universities', 'Do summer research internships'] },
  { id: 'commerce', name: 'Commerce', note: '& Finance', about: 'Work with money, markets and business in accounts, banking, law and management.', courses: ['B.Com', 'BBA', 'CA', 'CS', 'CMA', 'BA Economics'], exams: ['CUET UG', 'CA Foundation', 'CSEET', 'IPMAT'], roles: ['Chartered accountant', 'Investment analyst', 'Banker', 'Entrepreneur'], steps: ['Strengthen accountancy and economics', 'Decide between degree and CA route', 'Register for the Foundation exam', 'Take articleship or internships'] },
  { id: 'humanities', name: 'Humanities', note: '& Social Sciences', about: 'Understand people, society, law, language, design and governance.', courses: ['BA', 'BA LLB', 'B.Des', 'BSW', 'BA Journalism'], exams: ['CUET UG', 'CLAT', 'UCEED', 'NIFT', 'NID DAT'], roles: ['Civil servant', 'Lawyer', 'Journalist', 'Psychologist', 'Designer'], steps: ['Read widely and write every week', 'Pick subjects for your target course', 'Prepare for CUET or CLAT', 'Start current-affairs notes'] },
];

export const COLLEGES: { name: string; place: string; type: string; site: string }[] = [
  { name: 'IIT Madras', place: 'Chennai', type: 'Engineering', site: 'https://www.iitm.ac.in' },
  { name: 'IIT Bombay', place: 'Mumbai', type: 'Engineering', site: 'https://www.iitb.ac.in' },
  { name: 'IIT Delhi', place: 'New Delhi', type: 'Engineering', site: 'https://home.iitd.ac.in' },
  { name: 'NIT Tiruchirappalli', place: 'Tiruchirappalli', type: 'Engineering', site: 'https://www.nitt.edu' },
  { name: 'Anna University', place: 'Chennai', type: 'Engineering', site: 'https://www.annauniv.edu' },
  { name: 'AIIMS', place: 'New Delhi', type: 'Medical', site: 'https://www.aiims.edu' },
  { name: 'CMC Vellore', place: 'Vellore', type: 'Medical', site: 'https://www.cmch-vellore.edu' },
  { name: 'JIPMER', place: 'Puducherry', type: 'Medical', site: 'https://jipmer.edu.in' },
  { name: 'IISc', place: 'Bengaluru', type: 'Science', site: 'https://iisc.ac.in' },
  { name: 'IISER Pune', place: 'Pune', type: 'Science', site: 'https://www.iiserpune.ac.in' },
  { name: 'Loyola College', place: 'Chennai', type: 'Science', site: 'https://www.loyolacollege.edu' },
  { name: 'SRCC', place: 'Delhi', type: 'Commerce', site: 'https://www.srcc.edu' },
  { name: 'IIM Indore (IPM)', place: 'Indore', type: 'Commerce', site: 'https://www.iimidr.ac.in' },
  { name: 'St. Stephen’s College', place: 'Delhi', type: 'Humanities', site: 'https://www.ststephens.edu' },
  { name: 'NLSIU', place: 'Bengaluru', type: 'Humanities', site: 'https://www.nls.ac.in' },
  { name: 'NID', place: 'Ahmedabad', type: 'Humanities', site: 'https://www.nid.edu' },
];

export const ADMISSIONS: { exam: string; leads: string; site: string; siteName: string }[] = [
  { exam: 'JEE Main', leads: 'NITs, IIITs and other engineering colleges', site: 'https://jeemain.nta.nic.in', siteName: 'jeemain.nta.nic.in' },
  { exam: 'JEE Advanced', leads: 'IITs', site: 'https://jeeadv.ac.in', siteName: 'jeeadv.ac.in' },
  { exam: 'NEET UG', leads: 'MBBS, BDS and AYUSH courses', site: 'https://neet.nta.nic.in', siteName: 'neet.nta.nic.in' },
  { exam: 'CUET UG', leads: 'Central and participating universities', site: 'https://cuet.nta.nic.in', siteName: 'cuet.nta.nic.in' },
  { exam: 'CLAT', leads: 'National Law Universities', site: 'https://consortiumofnlus.ac.in', siteName: 'consortiumofnlus.ac.in' },
  { exam: 'NATA', leads: 'Bachelor of Architecture', site: 'https://www.nata.in', siteName: 'nata.in' },
  { exam: 'CA Foundation', leads: 'Chartered Accountancy', site: 'https://www.icai.org', siteName: 'icai.org' },
];

export const GUIDANCE = [
  { title: 'Know yourself', text: 'List three subjects you enjoy and three things you do well. Look for careers where the lists meet.' },
  { title: 'Compare courses', text: 'Check syllabus, fees, scholarships, location and what past students do now.' },
  { title: 'Keep a plan B', text: 'Apply across reach, match and safe colleges so one exam never decides everything.' },
  { title: 'Talk to people', text: 'Speak with teachers, seniors and people working in the field before you choose.' },
];

export const ROADMAP = [
  { title: 'Class 11', text: 'Build concepts, try olympiads and explore careers.' },
  { title: 'Class 12', text: 'Finish the syllabus early, register for entrances and take mocks.' },
  { title: 'Entrance exams', text: 'Write the exams for your goal and keep all application records.' },
  { title: 'Counselling', text: 'Fill choices in order of real preference; keep certificates ready.' },
  { title: 'First year', text: 'Settle in, build skills and look for projects and internships.' },
];

export const FAQS: [string, string][] = [
  ['How is my readiness calculated?', 'It is the average of four measures: syllabus coverage, practice accuracy, revision rounds done and test scores.'],
  ['How do I change my class or stream?', 'Open My Account, then Preferences, or use the Classes and Streams menus on the Dashboard. Progress for each class is kept separately.'],
  ['When does a chapter count as complete?', 'When all four steps are done: Concepts, Lecture, Notes and Practice.'],
  ['How do I save notes as a PDF?', 'Open Download Center, choose a subject, then press Save as PDF and pick “Save as PDF” in the print window.'],
  ['Where is my data stored?', 'On this device, in this browser. Another device or browser starts fresh.'],
];

export const REVISION_ROUNDS = ['Read concepts again', 'Revise notes and formulas', 'Practise topic questions', 'Solve previous year questions', 'Write a mock test'];
