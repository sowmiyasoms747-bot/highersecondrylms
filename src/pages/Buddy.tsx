import { ArrowRight, CalendarPlus, Lightbulb, MessageCircle, SquarePen, Sun, Trash2, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { askBuddy } from '../buddy';
import { Robot, Tint, type Tone } from '../components/Art';
import { useApp, useSession } from '../state';

/** Each card either sends a ready question or starts one for the student to finish. */
const CARDS: [string, string, LucideIcon, Tone, string, boolean][] = [
  ['Explain a Concept', '(in simple terms)', Lightbulb, 'blue', 'Explain ', false],
  ['Solve a Question', '(step-by-step)', SquarePen, 'violet', 'Solve ', false],
  ['Create a Study Plan', '(based on your goal)', CalendarPlus, 'pink', 'Create a study plan for me', true],
  ['Clear a Doubt', '(any subject)', MessageCircle, 'sky', 'My doubt is about ', false],
];

export function BuddyPage() {
  const app = useApp();
  const { patch } = useSession();
  const [text, setText] = useState('');
  const field = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const { chat } = app.data;
  useEffect(() => { if (chat.length) end.current?.scrollIntoView({ block: 'nearest' }); }, [chat.length]);
  const send = (t: string) => {
    const q = t.trim();
    if (!q) return;
    const a = askBuddy(q, app);
    patch((d) => ({ chat: [...d.chat, { from: 'me' as const, text: q }, { from: 'buddy' as const, ...a }].slice(-60) }));
    setText('');
  };
  return (
    <div className="buddy-page">
      <header className="buddy-head"><Robot size={96} /><div><h1>AI Study Buddy</h1><p>Your 24×7 learning assistant for <span className="nb">Class 11–12</span></p></div>{chat.length > 0 && <button className="btn soft" onClick={() => patch(() => ({ chat: [] }))}><Trash2 size={18} /> Clear chat</button>}</header>
      <section className="card buddy-panel">
        <h2><Sun size={34} fill="#ffb31f" stroke="#f08a12" /> How can I help you today?</h2>
        <div className="grid-4">{CARDS.map(([t, sub, I, tone, q, now]) => <button key={t} className="card icon-card" onClick={() => { if (now) send(q); else { setText(q); field.current?.focus(); } }}><Tint icon={I} tone={tone} size={42} /><b>{t}</b><span>{sub}</span></button>)}</div>
        {chat.length > 0 && <div className="chat" aria-live="polite">{chat.map((m, i) => <div key={i} className={`msg ${m.from}`}><p>{m.text}</p>{m.link && <Link to={m.link.to}>{m.link.label} <ArrowRight size={16} /></Link>}</div>)}<div ref={end} /></div>}
      </section>
      <form className="ask" onSubmit={(e) => { e.preventDefault(); send(text); }}>
        <input ref={field} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask a question... (e.g., Explain Gauss’s Law, solve this problem, etc.)" aria-label="Ask a question" maxLength={300} />
        <button aria-label="Send"><ArrowRight size={26} /></button>
      </form>
    </div>
  );
}
