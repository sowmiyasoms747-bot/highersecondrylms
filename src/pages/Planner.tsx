import { Hourglass, Plus, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Bar, Box, Empty, Modal, Tabs, Title, useTab } from '../components/ui';
import { SUBJECT_NAMES } from '../data/subjects';
import { dayPlus, fmtDate, fmtMin, today, toDate, useApp, useSession, type Task } from '../state';

const TABS = [['my', 'My Plan'], ['week', 'Weekly Plan'], ['month', 'Monthly Plan'], ['custom', 'Custom Plan']] as const;

function TaskRow({ t }: { t: Task }) {
  const app = useApp();
  return <div className={`task${t.done ? ' done' : ''}`}><Box on={t.done} label={t.title} onClick={() => app.editTask(t.id, { done: !t.done })} /><span className="grow">{t.title}</span><span className="num">{t.minutes} min</span></div>;
}

function AddTask({ date }: { date: string }) {
  const app = useApp();
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(60);
  const add = (e: FormEvent) => { e.preventDefault(); if (!title.trim()) return; app.addTask({ date, title: title.trim(), minutes }); setTitle(''); };
  return (
    <form className="add-task" onSubmit={add}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task" aria-label="Task" maxLength={80} />
      <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} aria-label="Time">{[15, 30, 45, 60, 90, 120, 180].map((m) => <option key={m} value={m}>{m} min</option>)}</select>
      <button className="btn soft" aria-label="Add task"><Plus size={20} /> Add</button>
    </form>
  );
}

function EditPlan({ onClose }: { onClose: () => void }) {
  const app = useApp();
  const { patch } = useSession();
  const { week } = app.data;
  return (
    <Modal title="Edit Plan" onClose={onClose}>
      <h3>Today</h3>
      {app.todayTasks.map((t) => <div className="edit-task" key={t.id}><input value={t.title} aria-label="Task" maxLength={80} onChange={(e) => app.editTask(t.id, { title: e.target.value })} /><input type="number" min={5} max={480} step={5} value={t.minutes} aria-label="Minutes" onChange={(e) => app.editTask(t.id, { minutes: Math.min(480, Math.max(0, Number(e.target.value))) })} /><button onClick={() => app.removeTask(t.id)} aria-label={`Remove ${t.title}`}><Trash2 size={20} /></button></div>)}
      <AddTask date={today()} />
      <h3>Weekly goal</h3>
      <div className="two">
        <label>Chapters<input type="number" min={1} max={20} value={week.chapters} onChange={(e) => { const chapters = Math.min(20, Math.max(1, Number(e.target.value))); patch((d) => ({ week: { ...d.week, chapters } })); }} /></label>
        <label>Practice tests<input type="number" min={1} max={20} value={week.tests} onChange={(e) => { const tests = Math.min(20, Math.max(1, Number(e.target.value))); patch((d) => ({ week: { ...d.week, tests } })); }} /></label>
      </div>
      <div className="finish"><button className="btn" onClick={onClose}>Done</button></div>
    </Modal>
  );
}

function Month() {
  const app = useApp();
  const [offset, setOffset] = useState(0);
  const [day, setDay] = useState(today());
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const tasks = app.data.tasks.filter((t) => t.date === day);
  return (
    <div className="month">
      <section className="card pad">
        <header><button className="chip" onClick={() => setOffset(offset - 1)}>Previous</button><h2>{first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h2><button className="chip" onClick={() => setOffset(offset + 1)}>Next</button></header>
        <div className="cal">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <b key={d}>{d}</b>)}
          {Array.from({ length: lead }, (_, i) => <span key={`e${i}`} />)}
          {Array.from({ length: days }, (_, i) => { const d = dayPlus(i, first); const n = app.data.tasks.filter((t) => t.date === d).length; return <button key={d} className={`${d === day ? 'on ' : ''}${d === today() ? 'today' : ''}`} onClick={() => setDay(d)} aria-label={`${fmtDate(d)}, ${n} tasks`}>{i + 1}{n > 0 && <i>{n}</i>}</button>; })}
        </div>
      </section>
      <section className="card pad"><h2>{fmtDate(day)}</h2>{tasks.map((t) => <TaskRow key={t.id} t={t} />)}{!tasks.length && <p className="muted">No tasks for this day.</p>}<AddTask date={day} /></section>
    </div>
  );
}

function Custom() {
  const app = useApp();
  const { setToast } = useSession();
  const [picked, setPicked] = useState(app.subjects.slice(0, 2));
  const [days, setDays] = useState(7);
  const [minutes, setMinutes] = useState(60);
  // Unfinished chapters of the chosen subjects, taken in turn so subjects alternate.
  const lists = picked.map((s) => app.chapters(s).map((name, i) => ({ s, name, p: app.chapterPct(s, i + 1) })).filter((c) => c.p < 100));
  const order = Array.from({ length: Math.max(0, ...lists.map((l) => l.length)) }, (_, i) => lists.map((l) => l[i])).flat().filter((x) => !!x);
  const plan = order.slice(0, days * 2).map((c, i) => ({ date: dayPlus(1 + (i % days)), title: `${SUBJECT_NAMES[c.s]}: ${c.name}`, minutes }));
  const save = () => {
    const fresh = plan.filter((p) => !app.data.tasks.some((t) => t.date === p.date && t.title === p.title));
    fresh.forEach(app.addTask);
    setToast(fresh.length ? `${fresh.length} tasks added to your plan` : 'These tasks are already in your plan');
  };
  return (
    <section className="card pad custom">
      <h2>Build a plan</h2>
      <fieldset><legend>Subjects</legend>{app.subjects.map((s) => <label key={s}><input type="checkbox" checked={picked.includes(s)} onChange={(e) => setPicked(e.target.checked ? [...picked, s] : picked.filter((x) => x !== s))} /> {SUBJECT_NAMES[s]}</label>)}</fieldset>
      <div className="two"><label>Days<select value={days} onChange={(e) => setDays(Number(e.target.value))}>{[3, 5, 7, 14].map((d) => <option key={d} value={d}>{d} days</option>)}</select></label><label>Time per chapter<select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>{[30, 45, 60, 90].map((d) => <option key={d} value={d}>{d} min</option>)}</select></label></div>
      {plan.length ? <><h3>Preview</h3><ul className="preview">{[...plan].sort((a, b) => a.date.localeCompare(b.date)).map((p) => <li key={p.date + p.title}><span>{fmtDate(p.date)}</span>{p.title}</li>)}</ul><button className="btn" onClick={save}>Add to My Plan</button></> : <p className="muted">Choose a subject with unfinished chapters.</p>}
    </section>
  );
}

export function PlannerPage() {
  const app = useApp();
  const [tab, setTab] = useTab(['my', 'week', 'month', 'custom'] as const, 'my');
  const [edit, setEdit] = useState(false);
  const total = app.todayTasks.reduce((s, t) => s + t.minutes, 0);
  const { week } = app.data;
  return (
    <>
      <Title>Study Planner</Title>
      <Tabs items={TABS} value={tab} onChange={setTab} />
      {tab === 'my' && (
        <>
          <section className="card plan"><header><h2>Today’s Plan – {fmtDate(today())}</h2>{total > 0 && <span className="time"><Hourglass size={20} /> {fmtMin(total)}</span>}</header>{app.todayTasks.map((t) => <TaskRow key={t.id} t={t} />)}{!app.todayTasks.length && <Empty title="Nothing planned for today" />}</section>
          <section className="card goal-bar"><div><h3>This Week’s Goal</h3><p>Complete {week.chapters} chapters &amp; {week.tests} practice tests</p><Bar value={app.weekPct} tone="b-green" /></div><b>{app.weekPct}%</b><button className="btn" onClick={() => setEdit(true)}>Edit Plan</button></section>
        </>
      )}
      {tab === 'week' && <div className="week">{Array.from({ length: 7 }, (_, i) => dayPlus(i)).map((d) => { const list = app.data.tasks.filter((t) => t.date === d); return <section className="card pad" key={d}><h2>{d === today() ? 'Today' : toDate(d).toLocaleDateString('en-GB', { weekday: 'long' })}<small>{toDate(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</small></h2>{list.map((t) => <TaskRow key={t.id} t={t} />)}{!list.length && <p className="muted">Free day</p>}</section>; })}</div>}
      {tab === 'month' && <Month />}
      {tab === 'custom' && <Custom />}
      {edit && <EditPlan onClose={() => setEdit(false)} />}
    </>
  );
}
