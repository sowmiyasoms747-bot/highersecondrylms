import { BookOpenText, ChevronLeft, ChevronRight, ClipboardCheck, FileText, Video, type LucideIcon } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SubjectIcon, Tint, type Tone } from '../components/Art';
import { Bar, Box, Empty, Go, StatusPill, Tabs, Title, useTab } from '../components/ui';
import { REVISION_ROUNDS } from '../data/content';
import { notesFor } from '../data/notes';
import { SUBJECT_NAMES, topicsOf, type SubjectId } from '../data/subjects';
import { STEPS, fmtDate, statusOf, useApp, type Step } from '../state';

const LEARN_TABS = [['overview', 'Overview'], ['progress', 'In Progress'], ['completed', 'Completed'], ['revision', 'Revision']] as const;

export function LearningPage() {
  const app = useApp();
  const [tab, setTab] = useTab(['overview', 'progress', 'completed', 'revision'] as const, 'overview');
  const chapters = app.subjects.flatMap((s) => app.chapters(s).map((name, i) => ({ s, n: i + 1, name, p: app.chapterPct(s, i + 1) })));
  const list = chapters.filter((c) => (tab === 'completed' ? c.p === 100 : c.p > 0 && c.p < 100));
  return (
    <>
      <Title>My Learning</Title>
      <Tabs items={LEARN_TABS} value={tab} onChange={setTab} />
      {tab === 'overview' && (
        <table className="table">
          <thead><tr><th>Subject</th><th>Coverage</th><th>Readiness</th><th>Revision</th></tr></thead>
          <tbody>{app.subjects.map((s) => {
            const c = app.coverage(s);
            return <tr key={s}><td><Link to={`/subjects/${s}`} className="sub"><SubjectIcon id={s} size={28} />{SUBJECT_NAMES[s]}</Link></td><td><span className="cover"><Bar value={c} status={statusOf(c)} />{c}%</span></td><td><StatusPill s={statusOf(c)} /></td><td data-l="Revision">{app.rounds(s)} / 5</td></tr>;
          })}</tbody>
        </table>
      )}
      {(tab === 'progress' || tab === 'completed') && (
        <div className="rows">
          {list.map((c) => <Link className="row-card" key={c.s + c.n} to={`/subjects/${c.s}/${c.n}`}><SubjectIcon id={c.s} size={28} /><span className="grow"><b>{c.name}</b><small>{SUBJECT_NAMES[c.s]} – Chapter {c.n}</small></span><span className="num">{c.p}%</span><span className={`chip${c.p < 100 ? ' blue' : ''}`}>{c.p === 100 ? 'Revise' : 'Continue'}</span></Link>)}
          {!list.length && <Empty title={tab === 'completed' ? 'No chapters completed yet' : 'No chapters in progress'}><Go to="/subjects">Choose a Chapter</Go></Empty>}
        </div>
      )}
      {tab === 'revision' && (
        <div className="rows">{app.subjects.map((s) => <Link className="row-card" key={s} to={`/subjects/${s}?tab=revision`}><SubjectIcon id={s} size={28} /><b className="grow">{SUBJECT_NAMES[s]}</b><span className="dots" aria-hidden="true">{app.revision(s).map((v, i) => <i key={i} className={v ? 'on' : ''} />)}</span><span className="num">{app.rounds(s)} / 5</span><span className="chip">Revise</span></Link>)}</div>
      )}
    </>
  );
}

export function SubjectsPage() {
  const app = useApp();
  return (
    <>
      <Title>Subjects – Class {app.cls}</Title>
      <div className="grid-3">
        {app.subjects.map((s) => {
          const c = app.coverage(s);
          return (
            <Link key={s} to={`/subjects/${s}`} className="card subject-card">
              <div><SubjectIcon id={s} size={44} /><b>{SUBJECT_NAMES[s]}</b><StatusPill s={statusOf(c)} /></div>
              <Bar value={c} /><p><span>Coverage: <b>{c}%</b></span><span>{app.completed(s)} / {app.chapters(s).length} Chapters</span></p>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function useSubject(): SubjectId | null {
  const { sid } = useParams();
  const app = useApp();
  return app.subjects.includes(sid as SubjectId) ? (sid as SubjectId) : null;
}

const SUBJECT_TABS = [['syllabus', 'Syllabus & Chapters'], ['progress', 'Progress'], ['revision', 'Revision'], ['tests', 'Tests']] as const;

export function SubjectPage() {
  const app = useApp();
  const sid = useSubject();
  const [tab, setTab] = useTab(['syllabus', 'progress', 'revision', 'tests'] as const, 'syllabus');
  if (!sid) return <Navigate to="/subjects" replace />;
  const names = app.chapters(sid);
  const mine = app.attempts.filter((a) => a.sid === sid);
  const started = names.filter((_, i) => { const p = app.chapterPct(sid, i + 1); return p > 0 && p < 100; }).length;
  return (
    <>
      <Title back="/subjects">{SUBJECT_NAMES[sid]} – Class {app.cls}</Title>
      <Tabs items={SUBJECT_TABS} value={tab} onChange={setTab} />
      {tab === 'syllabus' && (
        <>
          <section className="card cover-card"><p><span>Coverage: <b>{app.coverage(sid)}%</b></span><span>Completed: {app.completed(sid)} / {names.length} Chapters</span></p><Bar value={app.coverage(sid)} /></section>
          <div className="rows">
            {names.map((name, i) => {
              const p = app.chapterPct(sid, i + 1);
              return (
                <Link className="row-card" key={name} to={`/subjects/${sid}/${i + 1}`}>
                  <Box on={p === 100} partial={p > 0 && p < 100} label={p === 100 ? 'Completed' : p > 0 ? 'In progress' : 'Not started'} />
                  <span className="grow">{i + 1}.&nbsp; {name}</span><span className="num">{p}%</span><span className={`chip${p < 100 ? ' blue' : ''}`}>{p === 100 ? 'Revise' : p > 0 ? 'Continue' : 'Start'}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}
      {tab === 'progress' && (
        <>
          <div className="grid-4 stats">
            {[['Coverage', `${app.coverage(sid)}%`], ['Completed', `${app.completed(sid)}`], ['In progress', `${started}`], ['Not started', `${names.length - app.completed(sid) - started}`]].map(([k, v]) => <div className="card" key={k}><b>{v}</b><span>{k}</span></div>)}
          </div>
          <section className="card pad">
            <h2>Steps finished across {names.length} chapters</h2>
            {STEPS.map((st) => { const n = names.filter((_, i) => app.steps(sid, i + 1).includes(st.id)).length; return <div className="meter" key={st.id}><span>{st.name}</span><Bar value={Math.round((n / names.length) * 100)} /><b>{n} / {names.length}</b></div>; })}
          </section>
        </>
      )}
      {tab === 'revision' && (
        <>
          <section className="card cover-card"><p><span>Revision: <b>{app.rounds(sid)} / 5</b> rounds</span></p><Bar value={app.rounds(sid) * 20} /></section>
          <div className="rows">{REVISION_ROUNDS.map((r, i) => <div className="row-card" key={r}><Box on={app.revision(sid)[i]} label={r} onClick={() => app.toggleRound(sid, i)} /><span className="grow">Round {i + 1}: {r}</span><Link className="chip" to={[`/materials/concepts?sid=${sid}`, `/pack/${sid}`, `/practice/${sid}`, '/exam', '/practice?tab=mock'][i]}>Open</Link></div>)}</div>
        </>
      )}
      {tab === 'tests' && (
        <>
          <section className="sprint"><div><h2>{SUBJECT_NAMES[sid]} quiz</h2><p>Up to 10 questions from all topics, timed</p></div><Go to={`/test?kind=quiz&sid=${sid}`}>Start Quiz</Go></section>
          <div className="rows">
            {mine.map((a) => <div className="row-card" key={a.id}><span className="grow"><b>{a.title}</b><small>{a.kind === 'practice' ? 'Practice' : 'Quiz'} – {fmtDate(a.at)}</small></span><span className="num">{a.correct} / {a.total}</span><span className={`pill ${a.correct / a.total >= 0.65 ? 'green' : 'amber'}`}>{Math.round((a.correct / a.total) * 100)}%</span></div>)}
            {!mine.length && <Empty title="No tests taken yet" />}
          </div>
        </>
      )}
    </>
  );
}

const STEP_UI: Record<Step, [LucideIcon, Tone, string]> = {
  concepts: [BookOpenText, 'blue', 'Read the key ideas'], lecture: [Video, 'violet', 'Watch the lesson'], notes: [FileText, 'pink', 'Read and add notes'], practice: [ClipboardCheck, 'green', 'Answer questions'],
};

export function ChapterPage() {
  const app = useApp();
  const sid = useSubject();
  const n = Number(useParams().n);
  if (!sid || !app.chapters(sid)[n - 1]) return <Navigate to="/subjects" replace />;
  const name = app.chapters(sid)[n - 1];
  const p = app.chapterPct(sid, n);
  const has = notesFor(app.cls, sid, n).length > 0;
  const topics = topicsOf(app.cls, sid).filter(([, ch]) => ch.includes(n)).map(([t]) => `topic=${encodeURIComponent(t)}`);
  const to: Record<Step, string> = {
    concepts: `/materials/concepts/${sid}/${n}`, lecture: `/materials/videos/${sid}/${n}`, notes: `/materials/notes/${sid}/${n}`,
    practice: `/test?kind=practice&sid=${sid}&ch=${n}&${topics.join('&')}`,
  };
  return (
    <>
      <Title back={`/subjects/${sid}`}>{n}. {name}</Title>
      <section className="card cover-card"><p><span>{SUBJECT_NAMES[sid]} – Class {app.cls}</span><span>Progress: <b>{p}%</b></span></p><Bar value={p} /></section>
      <div className="grid-4">
        {STEPS.map((st) => {
          const [I, tone, hint] = STEP_UI[st.id];
          const done = app.steps(sid, n).includes(st.id);
          return (
            <div className={`card step${done ? ' done' : ''}`} key={st.id}>
              <Tint icon={I} tone={tone} size={46} /><b>{st.name}</b><span>{st.id === 'practice' || has ? hint : 'Use your textbook'}</span>
              <Link to={to[st.id]} className="chip">{done ? 'Open again' : 'Open'}</Link>
              <label><input type="checkbox" checked={done} onChange={(e) => app.setStep(sid, n, st.id, e.target.checked)} /> Done</label>
            </div>
          );
        })}
      </div>
      <div className="grid-2 wide-links">
        <Link className="card" to={`/materials/mindmaps/${sid}/${n}`}>Mind map <ChevronRight size={20} /></Link><Link className="card" to={`/materials/sheets/${sid}/${n}`}>Revision sheet <ChevronRight size={20} /></Link>
      </div>
      <div className="pager">
        {n > 1 ? <Link to={`/subjects/${sid}/${n - 1}`}><ChevronLeft size={20} /> {app.chapters(sid)[n - 2]}</Link> : <span />}
        {app.chapters(sid)[n] && <Link to={`/subjects/${sid}/${n + 1}`}>{app.chapters(sid)[n]} <ChevronRight size={20} /></Link>}
      </div>
    </>
  );
}
