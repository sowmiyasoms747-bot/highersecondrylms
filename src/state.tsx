import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CHAPTERS, STREAMS, type Cls, type GoalId, type Stream, type SubjectId } from './data/subjects';

export type Step = 'concepts' | 'lecture' | 'notes' | 'practice';
export const STEPS: { id: Step; name: string; weight: number }[] = [
  { id: 'concepts', name: 'Concepts', weight: 40 },
  { id: 'lecture', name: 'Lecture', weight: 25 },
  { id: 'notes', name: 'Notes', weight: 15 },
  { id: 'practice', name: 'Practice', weight: 20 },
];

export interface Attempt { id: string; kind: 'practice' | 'quiz' | 'mock'; cls: Cls; stream: Stream; sid: SubjectId | null; title: string; correct: number; total: number; marks?: string; at: string }
export interface Task { id: string; date: string; title: string; minutes: number; done: boolean }
export interface Message { from: 'me' | 'buddy'; text: string; link?: { to: string; label: string } }
export interface MentorQuestion { id: string; subject: string; text: string; at: string }

interface Data {
  cls: Cls; stream: Stream; goals: GoalId[]; setupDone: boolean;
  steps: Record<string, Step[]>;
  doneAt: Record<string, string>;
  revision: Record<string, boolean[]>;
  attempts: Attempt[];
  tasks: Task[];
  week: { chapters: number; tests: number };
  days: string[];
  goalList: { id: string; text: string; done: boolean }[];
  habits: Record<string, string[]>;
  focus: Record<string, number>;
  myNotes: Record<string, string>;
  chat: Message[];
  mentor: MentorQuestion[];
  readNotices: string[];
  prefs: { plan: boolean; tests: boolean; quotes: boolean };
  photo?: string;
}
export interface User { name: string; email: string; mobile: string }

const DATA = 'lu-hss-data-demo';
const USER = 'lu-hss-demo';
const STUDENT: User = { name: 'Aarav Sharma', email: 'aarav@example.com', mobile: '9000000001' };

/* ---------- dates ---------- */
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const dayPlus = (n: number, from = new Date()) => { const d = new Date(from); d.setDate(d.getDate() + n); return iso(d); };
export const today = () => iso(new Date());
export const toDate = (s: string) => { const [y, m, d] = s.slice(0, 10).split('-').map(Number); return new Date(y, m - 1, d); };
export const fmtDate = (s: string) => toDate(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/^(\w+) /, '$1, ');
export const fmtMin = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m}m`);
export const uid = () => Math.random().toString(36).slice(2, 10);

/* ---------- storage ---------- */
function read<T>(key: string): T | null {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') as T | null; } catch { return null; }
}

const blank = (): Data => ({
  cls: 12, stream: 'science', goals: ['board'], setupDone: false, steps: {}, doneAt: {}, revision: {}, attempts: [], tasks: [],
  week: { chapters: 5, tests: 3 }, days: [], goalList: [], habits: {}, focus: {}, myNotes: {}, chat: [], mentor: [], readNotices: [],
  prefs: { plan: true, tests: true, quotes: true },
});

/** Sample progress for the student, matching the figures in the design. */
function demoData(): Data {
  const d = blank();
  const all: Step[] = ['concepts', 'lecture', 'notes', 'practice'];
  const p65: Step[] = ['concepts', 'lecture'];
  const p80: Step[] = ['concepts', 'lecture', 'notes'];
  const fill = (sid: SubjectId, rows: (Step[] | 100)[]) => rows.forEach((r, i) => {
    const key = `12-${sid}-${i + 1}`;
    d.steps[key] = r === 100 ? all : r;
    if (r === 100) d.doneAt[key] = dayPlus(-20);
  });
  const full = (n: number) => Array<100>(n).fill(100);
  fill('physics', [100, 100, 100, p65, ['concepts'], 100, 100, 100, p80, 100, p65, 100, ['concepts']]);
  fill('chemistry', [...full(7), p80, p80]);
  fill('maths', [...full(7), p80, p65, p65]);
  fill('biology', [...full(11), ['concepts']]);
  fill('english', [...full(14), p80, p65]);
  d.doneAt['12-biology-11'] = dayPlus(-2);
  const rounds = (n: number) => [0, 1, 2, 3, 4].map((i) => i < n);
  d.revision = { '12-physics': rounds(3), '12-chemistry': rounds(4), '12-maths': rounds(3), '12-biology': rounds(4), '12-english': rounds(3) };
  const at = (n: number) => `${dayPlus(n)}T18:00:00`;
  const a = (kind: Attempt['kind'], sid: SubjectId | null, title: string, correct: number, total: number, n: number, marks?: string): Attempt =>
    ({ id: uid(), kind, cls: 12, stream: 'science', sid, title, correct, total, at: at(n), marks });
  d.attempts = [
    a('mock', null, 'Board Exam mock', 23, 30, -1, '23 / 30'), a('quiz', 'chemistry', 'Chemistry quiz', 8, 10, -3), a('quiz', 'physics', 'Physics quiz', 7, 10, -4),
    a('practice', 'physics', 'Ray Optics', 15, 20, -2), a('practice', 'chemistry', 'Electrochemical Cells', 16, 20, -5), a('practice', 'maths', 'Definite Integrals', 13, 20, -6),
    a('practice', 'biology', 'Evolution', 15, 20, -8), a('practice', 'english', 'Vistas', 11, 20, -9),
  ];
  const t = (n: number, title: string, minutes: number, done = false): Task => ({ id: uid(), date: dayPlus(n), title, minutes, done });
  d.tasks = [
    t(0, 'Physics: Ray Optics (Theory + Qs)', 90, true), t(0, 'Mathematics: Integrals (Practice)', 60), t(0, 'Chemistry: Aldehydes & Ketones', 60), t(0, 'Revise: Biology – Human Physiology', 60),
    t(1, 'Physics: Moving Charges (Notes + Qs)', 90), t(1, 'English: Article Writing', 45),
    t(2, 'Mathematics: Differential Equations', 60), t(2, 'Chemistry: Amines', 60),
    t(3, 'Biology: Ecosystem', 60), t(3, 'Physics: Nuclei', 60), t(4, 'Mathematics: Vector Algebra', 90),
    t(5, 'Full mock test and review', 180), t(6, 'Weekly revision', 120),
  ];
  d.days = Array.from({ length: 11 }, (_, i) => dayPlus(-1 - i));
  d.goalList = [
    { id: uid(), text: 'Score above 90% in boards', done: false }, { id: uid(), text: 'Finish the Physics syllabus', done: false }, { id: uid(), text: 'Write three mock tests', done: true },
  ];
  return d;
}

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
export type Status = 'Excellent' | 'Very Good' | 'On Track' | 'Needs Focus' | 'Not Started';
export const statusOf = (p: number): Status => (p >= 87 ? 'Excellent' : p >= 80 ? 'Very Good' : p >= 65 ? 'On Track' : p > 0 ? 'Needs Focus' : 'Not Started');

function useStore() {
  const [user, setUser] = useState<User>(() => ({ ...STUDENT, ...read<Partial<User>>(USER) }));
  const [data, setData] = useState<Data>(() => {
    const saved = read<Partial<Data>>(DATA);
    const d = { ...(saved ? blank() : demoData()), ...saved };
    return d.days.includes(today()) ? d : { ...d, days: [today(), ...d.days] };
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try { localStorage.setItem(DATA, JSON.stringify(data)); } catch { setToast('Storage is full. Your latest change was not saved.'); }
  }, [data]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const updateUser = useCallback((f: User) => {
    const next = { name: f.name.trim(), email: f.email.trim().toLowerCase(), mobile: f.mobile };
    localStorage.setItem(USER, JSON.stringify(next));
    setUser(next);
  }, []);
  const patch = useCallback((fn: (d: Data) => Partial<Data>) => setData((d) => ({ ...d, ...fn(d) })), []);

  const app = useMemo(() => {
    const { cls, stream } = data;
    const subjects = STREAMS[stream].subjects;
    const key = (sid: SubjectId, n: number) => `${cls}-${sid}-${n}`;
    const chapters = (sid: SubjectId) => CHAPTERS[cls][sid];
    const steps = (sid: SubjectId, n: number) => data.steps[key(sid, n)] ?? [];
    const chapterPct = (sid: SubjectId, n: number) => STEPS.reduce((s, x) => s + (steps(sid, n).includes(x.id) ? x.weight : 0), 0);
    const sum = (sid: SubjectId) => chapters(sid).reduce((s, _, i) => s + chapterPct(sid, i + 1), 0);
    const coverage = (sid: SubjectId) => Math.round(sum(sid) / chapters(sid).length);
    const completed = (sid: SubjectId) => chapters(sid).filter((_, i) => chapterPct(sid, i + 1) === 100).length;
    const revision = (sid: SubjectId) => data.revision[`${cls}-${sid}`] ?? [false, false, false, false, false];
    const rounds = (sid: SubjectId) => revision(sid).filter(Boolean).length;
    const mine = data.attempts.filter((a) => a.cls === cls && (a.sid === null ? a.stream === stream : subjects.includes(a.sid)));
    const acc = (list: Attempt[]) => pct(list.reduce((s, a) => s + a.correct, 0), list.reduce((s, a) => s + a.total, 0));
    const tests = mine.filter((a) => a.kind !== 'practice');
    const readiness = {
      coverage: Math.round(subjects.reduce((s, x) => s + sum(x), 0) / subjects.reduce((s, x) => s + chapters(x).length, 0)),
      practice: acc(mine.filter((a) => a.kind === 'practice')),
      revision: pct(subjects.reduce((s, x) => s + rounds(x), 0), subjects.length * 5),
      tests: acc(tests),
    };
    const total = Math.round((readiness.coverage + readiness.practice + readiness.revision + readiness.tests) / 4);
    const set = new Set(data.days);
    let streak = 0;
    while (set.has(dayPlus(-streak))) streak++;
    const since = dayPlus(-6);
    const weekChapters = Object.entries(data.doneAt).filter(([k, v]) => k.startsWith(`${cls}-`) && v >= since).length;
    const weekTests = tests.filter((a) => a.at.slice(0, 10) >= since).length;
    const weekPct = Math.round((Math.min(1, weekChapters / data.week.chapters) + Math.min(1, weekTests / data.week.tests)) * 50);
    const next = (sid: SubjectId) => Math.max(1, chapters(sid).findIndex((_, i) => chapterPct(sid, i + 1) < 100) + 1);
    return {
      user, data, cls, stream, subjects, chapters, steps, chapterPct, coverage, completed, revision, rounds, next,
      attempts: mine, tests, readiness, total, streak, weekChapters, weekTests, weekPct,
      todayTasks: data.tasks.filter((t) => t.date === today()),
      setStep: (sid: SubjectId, n: number, step: Step, on: boolean) => patch((d) => {
        const k = key(sid, n);
        const cur = d.steps[k] ?? [];
        const list = on ? [...new Set([...cur, step])] : cur.filter((s) => s !== step);
        const doneAt = { ...d.doneAt };
        if (list.length === STEPS.length) doneAt[k] ??= today(); else delete doneAt[k];
        return { steps: { ...d.steps, [k]: list }, doneAt };
      }),
      toggleRound: (sid: SubjectId, i: number) => patch((d) => ({ revision: { ...d.revision, [`${cls}-${sid}`]: revision(sid).map((v, j) => (j === i ? !v : v)) } })),
      addAttempt: (a: Omit<Attempt, 'id' | 'cls' | 'stream' | 'at'>) => patch((d) => ({ attempts: [{ ...a, id: uid(), cls, stream, at: `${today()}T${new Date().toTimeString().slice(0, 8)}` }, ...d.attempts] })),
      addTask: (t: Omit<Task, 'id' | 'done'>) => patch((d) => ({ tasks: [...d.tasks, { ...t, id: uid(), done: false }] })),
      editTask: (id: string, f: Partial<Task>) => patch((d) => ({ tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...f } : t)) })),
      removeTask: (id: string) => patch((d) => ({ tasks: d.tasks.filter((t) => t.id !== id) })),
    };
  }, [user, data, patch]);

  return { app, toast, setToast, updateUser, patch };
}

type Store = ReturnType<typeof useStore>;
const Ctx = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) { return <Ctx.Provider value={useStore()}>{children}</Ctx.Provider>; }
export function useSession() { const s = useContext(Ctx); if (!s) throw new Error('StoreProvider is missing'); return s; }
export function useApp() { return useSession().app; }
export type App = ReturnType<typeof useApp>;
