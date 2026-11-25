import { notesFor } from './data/notes';
import { poolOf, shuffle } from './data/questions';
import { SUBJECT_NAMES } from './data/subjects';
import type { App, Message } from './state';

const SKIP = new Set('a an the is are was were of in on to for and or what why how do does explain define describe me my please tell about give with law solve question doubt concept chapter'.split(' '));
const words = (s: string) => s.toLowerCase().replace(/[’']s\b/g, '').replace(/[^a-z0-9αβ ]/g, ' ').split(/\s+/).filter((w) => w.length > 1 && !SKIP.has(w)).map((w) => (w.length > 4 && /[^s]s$/.test(w) ? w.slice(0, -1) : w));
const num = (n: number) => String(Math.round(n * 1000) / 1000).replace('-', '−');

/** ax² + bx + c = 0 */
function quadratic(q: string): string | null {
  const s = q.toLowerCase().replace(/[−–]/g, '-').replace(/²/g, '^2').replace(/\s+/g, '');
  const m = s.match(/([+-]?\d*\.?\d*)x\^?2([+-]\d*\.?\d*)x([+-]\d+\.?\d*)=0/);
  if (!m) return null;
  const co = (t: string) => (t === '' || t === '+' ? 1 : t === '-' ? -1 : Number(t));
  const [a, b, c] = [co(m[1]), co(m[2]), Number(m[3])];
  if (!a) return null;
  const d = b * b - 4 * a * c;
  const head = `Step 1: a = ${num(a)}, b = ${num(b)}, c = ${num(c)}\nStep 2: Discriminant D = b² − 4ac = ${num(d)}`;
  if (d < 0) return `${head}\nStep 3: D is negative, so the roots are complex: x = (${num(-b)} ± i√${num(-d)}) / ${num(2 * a)}`;
  if (d === 0) return `${head}\nStep 3: D = 0, so the roots are equal.\nAnswer: x = ${num(-b / (2 * a))}`;
  return `${head}\nStep 3: x = (−b ± √D) / 2a\nAnswer: x = ${num((-b + Math.sqrt(d)) / (2 * a))} or x = ${num((-b - Math.sqrt(d)) / (2 * a))}`;
}

/** Arithmetic with + − × ÷ ^ and brackets. */
function arithmetic(q: string): string | null {
  const s = q.replace(/^\D*?(?=[\d(√-])/, '').replace(/[×x]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/[=?.]+$/, '');
  if (!/^[\d.+\-*/^()]+$/.test(s) || !/\d[+\-*/^]+\(*-?\d/.test(s)) return null;
  let i = 0;
  const atom = (): number => {
    if (s[i] === '-') { i++; return -atom(); }
    if (s[i] === '(') { i++; const v = sum(); if (s[i++] !== ')') throw new Error('bracket'); return v; }
    const m = s.slice(i).match(/^\d+\.?\d*|^\.\d+/);
    if (!m) throw new Error('number');
    i += m[0].length;
    return Number(m[0]);
  };
  const pow = (): number => { const v = atom(); if (s[i] === '^') { i++; return v ** pow(); } return v; };
  const mul = (): number => { let v = pow(); while (s[i] === '*' || s[i] === '/') v = s[i++] === '*' ? v * pow() : v / pow(); return v; };
  const sum = (): number => { let v = mul(); while (s[i] === '+' || s[i] === '-') v = s[i++] === '+' ? v + mul() : v - mul(); return v; };
  try { const v = sum(); return i === s.length && Number.isFinite(v) ? `Answer: ${num(v)}` : null; } catch { return null; }
}

/**
 * Answers from the notes and questions in this app.
 * Replace with a call to your AI service to answer any question.
 */
export function askBuddy(text: string, app: App): Omit<Message, 'from'> {
  const solved = quadratic(text) ?? arithmetic(text);
  if (solved) return { text: solved };

  if (/\b(plan|schedule|timetable)\b/i.test(text)) {
    const list = app.subjects.map((s) => ({ s, n: app.next(s), c: app.coverage(s) })).filter((x) => x.c < 100).sort((a, b) => a.c - b.c).slice(0, 3);
    if (!list.length) return { text: 'You have finished every chapter. Write a mock test each week and revise from your mistakes.', link: { to: '/practice?tab=mock', label: 'Mock tests' } };
    return { text: `Start with your least covered subjects:\n${list.map((x, i) => `${i + 1}. ${SUBJECT_NAMES[x.s]} (${x.c}%): ${app.chapters(x.s)[x.n - 1]}, 60 min`).join('\n')}\nThen revise one finished chapter for 30 min.`, link: { to: '/planner?tab=custom', label: 'Build a full plan' } };
  }
  if (/\b(quiz|practi[cs]e|test me)\b/i.test(text)) {
    const q = shuffle(poolOf({ cls: app.cls, sids: app.subjects }))[0];
    if (q) return { text: `${SUBJECT_NAMES[q.sid]}: ${q.q}\n${shuffle(q.options).map((o, i) => `${'ABCD'[i]}) ${o}`).join('\n')}`, link: { to: `/test?kind=practice&sid=${q.sid}&topic=${encodeURIComponent(q.topic)}`, label: 'Answer this topic' } };
  }

  const want = [...new Set(words(text))];
  const all = app.subjects.flatMap((sid) => app.chapters(sid).map((name, i) => {
    const points = notesFor(app.cls, sid, i + 1).map((p) => ({ term: words(p.term ?? ''), body: words(p.text) }));
    return { sid, n: i + 1, name, title: words(name), points };
  }));
  // A word found in few places says more about the question than a common one.
  const seen = (w: string) => all.reduce((c, ch) => c + (ch.title.includes(w) ? 1 : 0) + ch.points.filter((p) => p.term.includes(w) || p.body.includes(w)).length, 0);
  const weight = new Map(want.map((w) => [w, 1 / Math.sqrt(Math.max(1, seen(w)))]));
  const add = (list: string[], points: number) => want.reduce((t, w) => t + (list.includes(w) ? points * (weight.get(w) ?? 0) : 0), 0);
  let best = { score: 0, s: app.subjects[0], n: 0, name: '', hit: -1 };
  for (const ch of all) {
    const base = add(ch.title, 1.5);
    if (!ch.points.length && base > best.score) best = { score: base, s: ch.sid, n: ch.n, name: ch.name, hit: -1 };
    ch.points.forEach((p, j) => {
      const whole = p.term.length ? p.term.filter((w) => want.includes(w)).length / p.term.length : 0;
      const score = base + add(p.term, 3) + add(p.body, 2) + whole;
      if (score > best.score) best = { score, s: ch.sid, n: ch.n, name: ch.name, hit: j };
    });
  }
  if (best.score >= 1) {
    const points = notesFor(app.cls, best.s, best.n);
    const link = { to: `/subjects/${best.s}/${best.n}`, label: `Open ${best.name}` };
    if (!points.length) return { text: `This is covered in ${SUBJECT_NAMES[best.s]}, chapter ${best.n}: ${best.name}.`, link };
    const main = points[best.hit];
    const formulas = points.filter((p) => p.formula && p !== main).map((p) => `• ${p.text}`);
    const others = points.filter((p) => !p.formula && p !== main).slice(0, 2).map((p) => `• ${p.term}: ${p.text}`);
    return { text: `${main.term ? `${main.term}: ` : ''}${main.text}\n\nAlso from ${best.name}:\n${[...others, ...formulas].join('\n')}`, link };
  }
  return { text: 'I could not find that in your notes. Try a chapter or term, such as “Explain Gauss’s law”, an equation like x^2 − 5x + 6 = 0, or ask for a study plan.', link: { to: '/mentor', label: 'Ask a mentor' } };
}
