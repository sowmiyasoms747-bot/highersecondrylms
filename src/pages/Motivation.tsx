import { Brain, Pause, Play, Quote, RotateCcw, Sprout, Target, Trash2, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Sunset, Tint, type Tone } from '../components/Art';
import { Box, Tabs, Title, useTab } from '../components/ui';
import { HABITS, QUOTES, STORIES, TIPS, WELLBEING } from '../data/content';
import { dayPlus, fmtDate, today, toDate, uid, useApp, useSession } from '../state';

const TABS = [['daily', 'Daily Motivation'], ['stories', 'Success Stories'], ['tips', 'Productivity Tips'], ['focus', 'Focus & Wellbeing']] as const;
type Panel = 'quote' | 'goals' | 'habits' | 'mind';
const CARDS: [Panel, string, string, LucideIcon, Tone][] = [['quote', 'Daily Quote', '', Quote, 'blue'], ['goals', 'Goal Tracker', '', Target, 'red'], ['habits', 'Habits & Discipline', '', Sprout, 'green'], ['mind', 'Mindset', '& Focus', Brain, 'violet']];

function Goals() {
  const { data } = useApp();
  const { patch } = useSession();
  const [text, setText] = useState('');
  const add = (e: FormEvent) => { e.preventDefault(); const t = text.trim(); if (!t) return; patch((d) => ({ goalList: [...d.goalList, { id: uid(), text: t, done: false }] })); setText(''); };
  return (
    <section className="card pad"><h2>Goal Tracker</h2>
      {data.goalList.map((g) => <div className={`task${g.done ? ' done' : ''}`} key={g.id}><Box on={g.done} label={g.text} onClick={() => patch((d) => ({ goalList: d.goalList.map((x) => (x.id === g.id ? { ...x, done: !x.done } : x)) }))} /><span className="grow">{g.text}</span><button onClick={() => patch((d) => ({ goalList: d.goalList.filter((x) => x.id !== g.id) }))} aria-label={`Remove ${g.text}`}><Trash2 size={19} /></button></div>)}
      <form className="add-task" onSubmit={add}><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a goal" aria-label="Goal" maxLength={80} /><button className="btn soft">Add</button></form>
    </section>
  );
}

function Habits() {
  const { data } = useApp();
  const { patch } = useSession();
  const week = Array.from({ length: 7 }, (_, i) => dayPlus(i - 6));
  const toggle = (id: string, day: string) => patch((d) => { const cur = d.habits[id] ?? []; return { habits: { ...d.habits, [id]: cur.includes(day) ? cur.filter((x) => x !== day) : [...cur, day] } }; });
  return (
    <section className="card pad"><h2>Habits &amp; Discipline</h2>
      <div className="habits"><table><thead><tr><th>Last 7 days</th>{week.map((d) => <th key={d}>{d === today() ? 'Today' : toDate(d).toLocaleDateString('en-GB', { weekday: 'short' })}</th>)}</tr></thead>
        <tbody>{HABITS.map((h) => <tr key={h.id}><td>{h.name}</td>{week.map((d) => <td key={d}><Box on={!!data.habits[h.id]?.includes(d)} label={`${h.name}, ${fmtDate(d)}`} onClick={() => toggle(h.id, d)} /></td>)}</tr>)}</tbody></table></div>
    </section>
  );
}

function FocusTimer() {
  const { data } = useApp();
  const { patch, setToast } = useSession();
  const [minutes, setMinutes] = useState(25);
  const [left, setLeft] = useState(25 * 60);
  const [end, setEnd] = useState<number | null>(null);
  const lengthRef = useRef(minutes);
  lengthRef.current = minutes;
  useEffect(() => {
    if (end === null) return;
    const t = setInterval(() => {
      const s = Math.max(0, Math.round((end - Date.now()) / 1000));
      setLeft(s);
      if (s > 0) return;
      setEnd(null);
      setLeft(lengthRef.current * 60);
      patch((d) => ({ focus: { ...d.focus, [today()]: (d.focus[today()] ?? 0) + lengthRef.current } }));
      setToast('Focus session complete. Take a short break.');
    }, 500);
    return () => clearInterval(t);
  }, [end, patch, setToast]);
  const choose = (m: number) => { setEnd(null); setMinutes(m); setLeft(m * 60); };
  return (
    <section className="card pad focus"><h2>Focus timer</h2>
      <div className="time-big">{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</div>
      <div className="finish"><button className="btn" onClick={() => { if (end === null) setEnd(Date.now() + left * 1000); else setEnd(null); }}>{end !== null ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start</>}</button><button className="btn soft" onClick={() => choose(minutes)}><RotateCcw size={19} /> Reset</button></div>
      <div className="chips">{[15, 25, 45, 60].map((m) => <button key={m} className={`chip${m === minutes ? ' on' : ''}`} onClick={() => choose(m)}>{m} min</button>)}</div>
      <p className="muted">Focused today: {data.focus[today()] ?? 0} min</p>
    </section>
  );
}

export function MotivationPage() {
  const [tab, setTab] = useTab(['daily', 'stories', 'tips', 'focus'] as const, 'daily');
  const [panel, setPanel] = useState<Panel>('quote');
  const [n, setN] = useState(0);
  const start = new Date().getDate();
  const quote = QUOTES[(n === 0 ? 0 : start + n) % QUOTES.length];
  const show = (p: Panel) => { if (p === 'quote') setN(panel === 'quote' ? n + 1 : n); setPanel(p); };
  return (
    <>
      <Title>Motivation Hub</Title>
      <Tabs items={TABS} value={tab} onChange={setTab} />
      {tab === 'daily' && (
        <>
          <section className="banner"><Sunset /><p key={quote}>“{quote}”</p></section>
          <div className="grid-4">{CARDS.map(([k, a, b, I, tone]) => <button key={k} className={`card icon-card${panel === k && k !== 'quote' ? ' on' : ''}`} aria-pressed={panel === k} onClick={() => show(k)}><Tint icon={I} tone={tone} size={42} /><b>{a}{b && <><br />{b}</>}</b></button>)}</div>
          <div className="mt-s">{panel === 'goals' && <Goals />}{panel === 'habits' && <Habits />}{panel === 'mind' && <FocusTimer />}</div>
        </>
      )}
      {tab === 'stories' && <div className="grid-2">{STORIES.map((s) => <article className="card pad story" key={s.name}><h2>{s.name}</h2><p className="muted">{s.tag}</p><p>{s.text}</p><p className="lesson">{s.lesson}</p></article>)}</div>}
      {tab === 'tips' && <div className="grid-3">{TIPS.map((t) => <article className="card pad" key={t.title}><h2>{t.title}</h2><p>{t.text}</p></article>)}</div>}
      {tab === 'focus' && <div className="split even"><FocusTimer /><div className="rows">{WELLBEING.map((w) => <article className="card pad" key={w.title}><h3>{w.title}</h3><p>{w.text}</p></article>)}</div></div>}
    </>
  );
}
