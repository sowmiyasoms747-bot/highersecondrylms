import { BookOpenCheck, Compass, ExternalLink, FileBadge, HeartPulse, RotateCcw, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SubjectIcon, Tint, type Tone } from '../components/Art';
import { Empty, Go, IconCard, Tabs, Title, useTab } from '../components/ui';
import { EXAMS, EXAM_TIPS, examOf, type ExamId } from '../data/content';
import { notesFor } from '../data/notes';
import { shuffle } from '../data/questions';
import { SUBJECT_NAMES, topicsOf } from '../data/subjects';
import { useApp } from '../state';

const TABS = [['papers', 'Previous Year Papers'], ['sheets', 'Revision Sheets'], ['crash', 'Crash Course'], ['tips', 'Exam Tips']] as const;
const LOOK: Record<ExamId, [LucideIcon, Tone]> = { board: [BookOpenCheck, 'blue'], jee: [FileBadge, 'pink'], neet: [HeartPulse, 'green'], cuet: [Compass, 'violet'] };

export function ExamPage() {
  const app = useApp();
  const [tab, setTab] = useTab(['papers', 'sheets', 'crash', 'tips'] as const, 'papers');
  // Crash course: the least finished chapters first, one a day.
  const plan = app.subjects.flatMap((s) => app.chapters(s).map((name, i) => ({ s, n: i + 1, name, p: app.chapterPct(s, i + 1) }))).filter((c) => c.p < 100).sort((a, b) => b.p - a.p).slice(0, 14);
  return (
    <>
      <Title>Exam Preparation</Title>
      <Tabs items={TABS} value={tab} onChange={setTab} />
      {tab === 'papers' && (
        <>
          <div className="grid-4 exams">{EXAMS.map((e) => <IconCard key={e.id} to={`/exam/${e.id}`} icon={LOOK[e.id][0]} tone={LOOK[e.id][1]} title={e.name} sub={e.note} foot={e.tag} />)}</div>
          <section className="sprint"><div><h2>Revision Sprint – Class {app.cls}</h2><p>High-yield topics, formulas &amp; important questions</p></div><Go to="/exam/sprint">Start Revision</Go></section>
        </>
      )}
      {tab === 'sheets' && <div className="rows">{app.subjects.map((s) => <Link className="row-card" key={s} to={`/materials/sheets?sid=${s}`}><SubjectIcon id={s} size={30} /><b className="grow">{SUBJECT_NAMES[s]}</b><span className="num">{app.chapters(s).filter((_, i) => notesFor(app.cls, s, i + 1).length).length} sheets</span><span className="chip">Open</span></Link>)}</div>}
      {tab === 'crash' && (plan.length ? (
        <>
          <p className="lead">A {plan.length}-day plan from your unfinished chapters, starting with those closest to done.</p>
          <div className="rows">{plan.map((c, i) => <Link className="row-card" key={c.s + c.n} to={`/subjects/${c.s}/${c.n}`}><span className="day">Day {i + 1}</span><span className="grow"><b>{c.name}</b><small>{SUBJECT_NAMES[c.s]}</small></span><span className="num">{c.p}%</span><span className="chip blue">Open</span></Link>)}</div>
        </>
      ) : <Empty title="Every chapter is complete"><Go to="/practice?tab=mock">Write a Mock Test</Go></Empty>)}
      {tab === 'tips' && <div className="grid-2">{EXAM_TIPS.map((t) => <section className="card pad tips" key={t.title}><h2>{t.title}</h2><ul>{t.items.map((x) => <li key={x}>{x}</li>)}</ul></section>)}</div>}
    </>
  );
}

export function ExamDetailPage() {
  const app = useApp();
  const e = examOf(useParams().id);
  if (!e) return <Navigate to="/exam" replace />;
  const sids = e.sids[app.stream];
  return (
    <>
      <Title back="/exam">{e.name} {e.note}</Title>
      <section className="card pad exam-head"><Tint icon={LOOK[e.id][0]} tone={LOOK[e.id][1]} size={54} /><div><p>{e.about}</p><p className="muted">Mock marking: +{e.mark} for correct{e.minus ? `, −${e.minus} for wrong` : ', no negative marks'}</p></div></section>
      <div className="grid-2">
        <section className="card pad"><h2>Previous year papers</h2><p>Papers and answer keys are published on the official site.</p><a className="btn soft" href={e.site} target="_blank" rel="noreferrer">{e.siteName} <ExternalLink size={18} /></a></section>
        <section className="card pad"><h2>Mock test</h2><p>Timed test with full solutions and analysis at the end.</p><Link className="btn" to={`/test?kind=mock&exam=${e.id}`}>Start Mock Test</Link></section>
      </div>
      <h2 className="mt">Practice by subject</h2>
      <div className="rows">{sids.map((s) => app.subjects.includes(s)
        ? <Link className="row-card" key={s} to={`/practice/${s}`}><SubjectIcon id={s} size={28} /><b className="grow">{SUBJECT_NAMES[s]}</b><span className="chip">{topicsOf(app.cls, s).length} Topics</span></Link>
        : <div className="row-card" key={s}><SubjectIcon id={s} size={28} /><b className="grow">{SUBJECT_NAMES[s]}</b><span className="pill grey">Not in your stream</span></div>)}</div>
      <section className="card pad tips mt"><h2>Tips</h2><ul>{e.tips.map((t) => <li key={t}>{t}</li>)}</ul></section>
    </>
  );
}

export function SprintPage() {
  const app = useApp();
  const build = () => shuffle(app.subjects.flatMap((s) => app.chapters(s).flatMap((name, i) => notesFor(app.cls, s, i + 1).filter((p) => p.term).map((p) => ({ s, name, ...p }))))).slice(0, 15);
  const [cards, setCards] = useState(build);
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);
  const [knew, setKnew] = useState(0);
  const restart = () => { setCards(build()); setAt(0); setKnew(0); setOpen(false); };
  const c = cards[at];
  if (!cards.length) return <><Title back="/exam">Revision Sprint</Title><Empty title="Revision cards for this class and stream are being prepared"><Go to="/practice">Practise Questions</Go></Empty></>;
  if (!c) return <><Title back="/exam">Revision Sprint</Title><section className="card result"><div className="score"><b>{knew} / {cards.length}</b><span>cards you knew</span></div></section><div className="finish"><button className="btn" onClick={restart}><RotateCcw size={20} /> New Sprint</button><Link className="btn soft" to="/exam">Back</Link></div></>;
  const next = (yes: boolean) => { if (yes) setKnew(knew + 1); setOpen(false); setAt(at + 1); };
  return (
    <>
      <Title back="/exam">Revision Sprint</Title>
      <div className="track"><i style={{ width: `${((at + 1) / cards.length) * 100}%` }} /></div>
      <section className="card flash"><p className="muted">{SUBJECT_NAMES[c.s]} • {c.name} • {at + 1} of {cards.length}</p><h2>{c.term}</h2>{open ? <p className="flash-back">{c.text}</p> : <p className="muted">Say the answer, then check.</p>}</section>
      <div className="finish">{open ? <><button className="btn" onClick={() => next(true)}>I Knew It</button><button className="btn soft" onClick={() => next(false)}>Revise Again</button></> : <button className="btn" onClick={() => setOpen(true)}>Show Answer</button>}</div>
    </>
  );
}
