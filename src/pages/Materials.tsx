import { Pause, Play, Printer, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { LogoMark, SubjectIcon } from '../components/Art';
import { Empty, IconCard, Tabs, Title } from '../components/ui';
import { notesFor, type Point } from '../data/notes';
import { SUBJECT_NAMES, type SubjectId } from '../data/subjects';
import { useApp, useSession, type Step } from '../state';

type Kind = 'concepts' | 'notes' | 'videos' | 'mindmaps' | 'sheets' | 'downloads';
/** Each kind's picture is assets/icons/materials/<kind>.webp. */
const KINDS: Record<Kind, { name: string; title: [string, string]; sub: string; step?: Step }> = {
  concepts: { name: 'Chapter-wise Concepts', title: ['Chapter-wise', 'Concepts'], sub: '(Theory + Examples)', step: 'concepts' },
  notes: { name: 'Notes & Summary', title: ['Notes &', 'Summary'], sub: '(Concise PDFs)', step: 'notes' },
  videos: { name: 'Video Lectures', title: ['Video', 'Lectures'], sub: '(HD • Topic-wise)', step: 'lecture' },
  mindmaps: { name: 'Mind Maps', title: ['Mind Maps', ''], sub: '(Quick Review)' },
  sheets: { name: 'Revision Sheets', title: ['Revision Sheets', ''], sub: '(Formulae & Key Points)' },
  downloads: { name: 'Download Center', title: ['Download Center', ''], sub: '(All Materials)' },
};

/** The subject chosen on the tabs, kept in the address. */
function useSubjectTab() {
  const app = useApp();
  const [params, set] = useSearchParams();
  const raw = params.get('sid') as SubjectId | null;
  const sid: SubjectId | 'all' = raw && app.subjects.includes(raw) ? raw : 'all';
  const items = [['all', 'All Subjects'] as const, ...app.subjects.map((s) => [s, SUBJECT_NAMES[s]] as const)];
  return { sid, tabs: <Tabs<SubjectId | 'all'> items={items} value={sid} onChange={(k) => set(k === 'all' ? {} : { sid: k }, { replace: true })} /> };
}

export function MaterialsPage() {
  const app = useApp();
  const { sid, tabs } = useSubjectTab();
  return (
    <>
      <Title>Study Materials – Class {app.cls}</Title>
      {tabs}
      <div className="grid-3 six">
        {(Object.keys(KINDS) as Kind[]).map((k) => {
          const x = KINDS[k];
          return <IconCard key={k} to={`/materials/${k}${sid === 'all' ? '' : `?sid=${sid}`}`} icon={`materials/${k}`} title={<>{x.title[0]}{x.title[1] && <><br />{x.title[1]}</>}</>} sub={x.sub} />;
        })}
      </div>
    </>
  );
}

export function MaterialListPage() {
  const app = useApp();
  const kind = useParams().kind as Kind;
  const { sid, tabs } = useSubjectTab();
  const info = KINDS[kind];
  if (!info) return <Navigate to="/materials" replace />;
  const list = sid === 'all' ? app.subjects : [sid];
  return (
    <>
      <Title back="/materials">{info.name}</Title>
      {tabs}
      {kind === 'downloads' ? (
        <div className="rows">{list.map((s) => {
          const ready = app.chapters(s).filter((_, i) => notesFor(app.cls, s, i + 1).length).length;
          return <Link className="row-card" key={s} to={`/pack/${s}`}><SubjectIcon id={s} size={28} /><span className="grow"><b>{SUBJECT_NAMES[s]} notes pack</b><small>{ready ? `${ready} chapters in one PDF` : 'Being prepared'}</small></span><span className="chip">Open</span></Link>;
        })}</div>
      ) : list.map((s) => (
        <section key={s} className="group">
          {sid === 'all' && <h2><SubjectIcon id={s} size={26} /> {SUBJECT_NAMES[s]}</h2>}
          <div className="rows">{app.chapters(s).map((name, i) => {
            const ready = notesFor(app.cls, s, i + 1).length > 0;
            const done = !!info.step && app.steps(s, i + 1).includes(info.step);
            return <Link className="row-card" key={name} to={`/materials/${kind}/${s}/${i + 1}`}><span className="grow">{i + 1}.&nbsp; {name}</span>{done && <span className="pill green">Done</span>}{ready ? <span className="chip">Open</span> : <span className="pill grey">Being prepared</span>}</Link>;
          })}</div>
        </section>
      ))}
    </>
  );
}

const plain = (p: Point) => (p.term ? `${p.term}. ${p.text}` : p.text);

/** Slide lesson made from the chapter's key points. Replace with a <video> when recordings are ready. */
function Lecture({ title, points, onEnd }: { title: string; points: Point[]; onEnd: () => void }) {
  const slides = [{ text: title } as Point, ...points];
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [voice, setVoice] = useState(false);
  const finish = useRef(onEnd);
  finish.current = onEnd;
  const last = at === slides.length - 1;
  const canSpeak = 'speechSynthesis' in window;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (last) { setPlaying(false); finish.current(); } else setAt((a) => a + 1);
    }, at === 0 ? 2500 : Math.max(5000, plain(slides[at]).length * 75));
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, at]);
  useEffect(() => {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    if (!playing || !voice) return;
    const u = new SpeechSynthesisUtterance(plain(slides[at]));
    u.lang = 'en-IN';
    window.speechSynthesis.speak(u);
    return () => window.speechSynthesis.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, voice, at]);
  const s = slides[at];
  return (
    <section className="player">
      <div className={`slide${s.formula ? ' formula' : ''}${at === 0 ? ' cover-slide' : ''}`} key={at}>{s.term && <h2>{s.term}</h2>}<p>{s.text}</p></div>
      <div className="track"><i style={{ width: `${((at + 1) / slides.length) * 100}%` }} /></div>
      <div className="controls">
        <button onClick={() => setAt((a) => Math.max(0, a - 1))} aria-label="Previous"><SkipBack size={22} /></button>
        <button className="play" onClick={() => { if (last && !playing) setAt(0); setPlaying((p) => !p); }} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause size={26} /> : last ? <RotateCcw size={24} /> : <Play size={26} />}</button>
        <button onClick={() => { if (last) return; setAt((a) => a + 1); if (at + 1 === slides.length - 1) finish.current(); }} aria-label="Next"><SkipForward size={22} /></button>
        <span>{at + 1} / {slides.length}</span>
        {canSpeak && <button className="voice" onClick={() => setVoice((v) => !v)} aria-pressed={voice}>{voice ? <Volume2 size={22} /> : <VolumeX size={22} />} Voice {voice ? 'on' : 'off'}</button>}
      </div>
    </section>
  );
}

function Points({ points }: { points: Point[] }) {
  const facts = points.filter((p) => !p.formula);
  const formulas = points.filter((p) => p.formula);
  return (
    <>
      <dl className="facts">{facts.map((p) => <div key={p.text}><dt>{p.term}</dt><dd>{p.text}</dd></div>)}</dl>
      {formulas.length > 0 && <div className="formulas"><h3>Formulae</h3>{formulas.map((p) => <code key={p.text}>{p.text}</code>)}</div>}
    </>
  );
}

export function MaterialPage() {
  const app = useApp();
  const { patch, setToast } = useSession();
  const { kind: k, sid: s, n: nn } = useParams();
  const kind = k as Kind;
  const sid = s as SubjectId;
  const n = Number(nn);
  const info = KINDS[kind];
  if (!info || kind === 'downloads' || !app.subjects.includes(sid) || !app.chapters(sid)[n - 1]) return <Navigate to="/materials" replace />;
  const name = app.chapters(sid)[n - 1];
  const points = notesFor(app.cls, sid, n);
  const key = `${app.cls}-${sid}-${n}`;
  const step = info.step;
  const done = !!step && app.steps(sid, n).includes(step);
  const mark = () => { if (step && !done) { app.setStep(sid, n, step, true); setToast('Progress saved'); } };
  const facts = points.filter((p) => !p.formula);
  const own = (
    <label className="own"><b>My notes</b><textarea rows={5} value={app.data.myNotes[key] ?? ''} placeholder="Write your own points here. They are saved as you type." onChange={(e) => { const v = e.target.value; patch((d) => ({ myNotes: { ...d.myNotes, [key]: v } })); }} /></label>
  );
  return (
    <>
      <Title back={`/subjects/${sid}/${n}`} action={kind === 'notes' || kind === 'sheets' ? <button className="btn soft no-print" onClick={() => window.print()}><Printer size={20} /> Save as PDF</button> : undefined}>{name}</Title>
      <p className="crumb"><SubjectIcon id={sid} size={20} /> {SUBJECT_NAMES[sid]} – Chapter {n} • {info.name}</p>
      {!points.length && <Empty title="This material is being prepared">Study the chapter from your textbook for now. You can still write notes and mark your progress.</Empty>}
      {points.length > 0 && kind === 'concepts' && <section className="card pad"><Points points={points} /></section>}
      {points.length > 0 && kind === 'notes' && <section className="card pad sheet"><h2>Summary</h2><ul>{facts.map((p) => <li key={p.text}><b>{p.term}:</b> {p.text}</li>)}</ul>{points.some((p) => p.formula) && <><h2>Remember</h2><div className="formulas">{points.filter((p) => p.formula).map((p) => <code key={p.text}>{p.text}</code>)}</div></>}</section>}
      {points.length > 0 && kind === 'videos' && <Lecture key={key} title={name} points={points} onEnd={mark} />}
      {points.length > 0 && kind === 'mindmaps' && <div className="mindmap"><div>{facts.filter((_, i) => i % 2 === 0).map((p) => <article key={p.text}><b>{p.term}</b><p>{p.text}</p></article>)}</div><div className="hub"><span>{name}</span></div><div>{facts.filter((_, i) => i % 2).map((p) => <article key={p.text}><b>{p.term}</b><p>{p.text}</p></article>)}</div></div>}
      {points.length > 0 && kind === 'sheets' && <section className="card pad sheet"><Points points={points} /></section>}
      {kind === 'notes' && own}
      {step && <div className="finish no-print">{done ? <><span className="pill green">Done</span><Link className="btn soft" to={`/subjects/${sid}/${n}`}>Back to chapter</Link></> : <button className="btn" onClick={mark}>Mark as Done</button>}</div>}
    </>
  );
}

/** All notes of one subject on a printable page. */
export function PackPage() {
  const app = useApp();
  const sid = useParams().sid as SubjectId;
  if (!app.subjects.includes(sid)) return <Navigate to="/materials/downloads" replace />;
  const list = app.chapters(sid).map((name, i) => ({ name, n: i + 1, points: notesFor(app.cls, sid, i + 1) })).filter((c) => c.points.length);
  return (
    <>
      <Title back="/materials/downloads" action={list.length ? <button className="btn no-print" onClick={() => window.print()}><Printer size={20} /> Save as PDF</button> : undefined}>{SUBJECT_NAMES[sid]} notes pack – Class {app.cls}</Title>
      <p className="print-only print-head"><LogoMark size={34} /> Learning Universe LMS</p>
      {list.map((c) => <section className="card pad sheet pack" key={c.n}><h2>{c.n}. {c.name}</h2><ul>{c.points.filter((p) => !p.formula).map((p) => <li key={p.text}><b>{p.term}:</b> {p.text}</li>)}</ul><div className="formulas">{c.points.filter((p) => p.formula).map((p) => <code key={p.text}>{p.text}</code>)}</div></section>)}
      {!list.length && <Empty title="This notes pack is being prepared" />}
    </>
  );
}
