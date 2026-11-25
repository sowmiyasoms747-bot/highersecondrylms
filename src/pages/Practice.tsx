import { CircleCheck, CircleX, Clock, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SubjectIcon } from '../components/Art';
import { Empty, Go, Modal, Tabs, Title, useTab } from '../components/ui';
import { EXAMS, examOf } from '../data/content';
import { pickQuestions, poolOf, type Question } from '../data/questions';
import { SUBJECT_NAMES, topicsOf, type SubjectId } from '../data/subjects';
import { fmtDate, useApp } from '../state';

const TABS = [['practice', 'Practice (Topic-wise)'], ['quizzes', 'Quizzes'], ['mock', 'Mock Tests']] as const;
const MOCK_SIZE = 30;

export function PracticePage() {
  const app = useApp();
  const [tab, setTab] = useTab(['practice', 'quizzes', 'mock'] as const, 'practice');
  const weak = [...app.subjects].sort((a, b) => app.coverage(a) - app.coverage(b))[0];
  const mocks = app.attempts.filter((a) => a.kind === 'mock');
  return (
    <>
      <Title>Practice &amp; Tests</Title>
      <Tabs items={TABS} value={tab} onChange={setTab} />
      {tab === 'practice' && (
        <div className="split">
          <div className="rows">{app.subjects.map((s) => { const t = topicsOf(app.cls, s).length; return <Link className="row-card" key={s} to={`/practice/${s}`}><SubjectIcon id={s} size={30} /><b className="grow">{SUBJECT_NAMES[s]}</b><span className="chip">{t} {t === 1 ? 'Topic' : 'Topics'}</span></Link>; })}</div>
          <section className="quick-practice"><Zap size={64} fill="#ffb31f" stroke="#f08a12" strokeWidth={1.4} /><h2>Quick Practice</h2><p>Topic-wise Questions<br />Instant Practice &amp; Feedback</p><Go to={`/test?kind=practice&sid=${weak}`}>Start Practice</Go></section>
        </div>
      )}
      {tab === 'quizzes' && (
        <div className="rows">{app.subjects.map((s) => {
          const best = Math.max(-1, ...app.attempts.filter((a) => a.kind === 'quiz' && a.sid === s).map((a) => Math.round((a.correct / a.total) * 100)));
          const n = Math.min(10, poolOf({ cls: app.cls, sids: [s] }).length);
          return <div className="row-card" key={s}><SubjectIcon id={s} size={30} /><span className="grow"><b>{SUBJECT_NAMES[s]} quiz</b><small>{n} questions – {n} minutes</small></span>{best >= 0 && <span className="pill green">Best {best}%</span>}<Link className="chip blue" to={`/test?kind=quiz&sid=${s}`}>{best >= 0 ? 'Try again' : 'Start'}</Link></div>;
        })}</div>
      )}
      {tab === 'mock' && (
        <>
          <div className="grid-4">{EXAMS.map((e) => {
            const sids = e.sids[app.stream];
            const n = Math.min(MOCK_SIZE, poolOf({ cls: app.cls, sids }).length);
            return <div className="card mock" key={e.id}><b>{e.name}</b><span>{e.note}</span><p>{n} questions<br />+{e.mark}{e.minus ? ` / −${e.minus}` : ''} marks</p><Link className="btn soft" to={`/test?kind=mock&exam=${e.id}`}>Start Mock</Link></div>;
          })}</div>
          <h2 className="mt">Past mock tests</h2>
          <div className="rows">{mocks.map((a) => <div className="row-card" key={a.id}><span className="grow"><b>{a.title}</b><small>{fmtDate(a.at)}</small></span><span className="num">{a.marks}</span><span className="pill green">{Math.round((a.correct / a.total) * 100)}%</span></div>)}{!mocks.length && <Empty title="No mock tests taken yet" />}</div>
        </>
      )}
    </>
  );
}

export function PracticeSubjectPage() {
  const app = useApp();
  const sid = useParams().sid as SubjectId;
  if (!app.subjects.includes(sid)) return <Navigate to="/practice" replace />;
  return (
    <>
      <Title back="/practice">{SUBJECT_NAMES[sid]} practice</Title>
      <div className="rows">
        {topicsOf(app.cls, sid).map(([t], i) => {
          const n = poolOf({ cls: app.cls, sids: [sid], topics: [t] }).length;
          const tries = app.attempts.filter((a) => a.kind === 'practice' && a.sid === sid && a.title === t);
          const best = Math.max(-1, ...tries.map((a) => Math.round((a.correct / a.total) * 100)));
          return <Link className="row-card" key={t} to={`/test?kind=practice&sid=${sid}&topic=${encodeURIComponent(t)}`}><span className="grow">{i + 1}.&nbsp; {t}</span>{best >= 0 && <span className="pill green">Best {best}%</span>}<span className="num">{n} questions</span><span className="chip blue">Practise</span></Link>;
        })}
      </div>
    </>
  );
}

interface Setup { kind: 'practice' | 'quiz' | 'mock'; title: string; sid: SubjectId | null; list: Question[]; mark: number; minus: number; seconds: number; back: string; chapter?: number }

function useSetup(): () => Setup | null {
  const app = useApp();
  const [p] = useSearchParams();
  return () => {
    const kind = p.get('kind');
    const sid = p.get('sid') as SubjectId | null;
    if (kind === 'mock') {
      const e = examOf(p.get('exam'));
      if (!e) return null;
      const list = pickQuestions({ cls: app.cls, sids: e.sids[app.stream], count: MOCK_SIZE });
      return { kind, title: `${e.name} mock`, sid: null, list, mark: e.mark, minus: e.minus, seconds: list.length * 90, back: '/practice?tab=mock' };
    }
    if (!sid || !app.subjects.includes(sid)) return null;
    if (kind === 'quiz') {
      const list = pickQuestions({ cls: app.cls, sids: [sid], count: 10 });
      return { kind, title: `${SUBJECT_NAMES[sid]} quiz`, sid, list, mark: 1, minus: 0, seconds: list.length * 60, back: '/practice?tab=quizzes' };
    }
    if (kind === 'practice') {
      const topics = p.getAll('topic');
      const chapter = Number(p.get('ch')) || undefined;
      const list = pickQuestions({ cls: app.cls, sids: [sid], topics: topics.length ? topics : undefined, count: 10 });
      return { kind, title: topics.join(' & ') || SUBJECT_NAMES[sid], sid, list, mark: 1, minus: 0, seconds: 0, back: chapter ? `/subjects/${sid}/${chapter}` : topics.length ? `/practice/${sid}` : '/practice', chapter };
    }
    return null;
  };
}

/** Remounts the runner for each new test, so a second test never reuses the first one's answers. */
export function TestPage() {
  const [p] = useSearchParams();
  const [round, setRound] = useState(0);
  return <Runner key={`${p.toString()}-${round}`} again={() => setRound((r) => r + 1)} />;
}

function Runner({ again }: { again: () => void }) {
  const app = useApp();
  const go = useNavigate();
  const [test] = useState(useSetup());
  const [at, setAt] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [over, setOver] = useState(false);
  const [confirm, setConfirm] = useState<'leave' | 'submit' | null>(null);
  const [end] = useState(() => Date.now() + (test?.seconds ?? 0) * 1000);
  const [left, setLeft] = useState(test?.seconds ?? 0);
  const saved = useRef(false);

  const list = test?.list ?? [];
  const correct = list.filter((q) => answers[q.id] === q.answer).length;
  const wrong = list.filter((q) => answers[q.id] && answers[q.id] !== q.answer).length;
  const finish = () => {
    if (!test || saved.current) return;
    saved.current = true;
    const marks = correct * test.mark - wrong * test.minus;
    app.addAttempt({ kind: test.kind, sid: test.sid, title: test.title, correct, total: list.length, marks: test.kind === 'mock' ? `${marks} / ${list.length * test.mark}` : undefined });
    if (test.chapter && test.sid) app.setStep(test.sid, test.chapter, 'practice', true);
    setConfirm(null);
    setOver(true);
    window.scrollTo(0, 0);
  };
  const done = useRef(finish);
  done.current = finish;
  useEffect(() => {
    if (!test?.seconds || over) return;
    const t = setInterval(() => {
      const s = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) done.current();
    }, 500);
    return () => clearInterval(t);
  }, [test, over, end]);

  if (!test) return <Navigate to="/practice" replace />;
  if (!list.length) return <><Title back={test.back}>{test.title}</Title><Empty title="Questions for this topic are being prepared"><Go to="/practice">Choose Another</Go></Empty></>;

  if (over) {
    const p = Math.round((correct / list.length) * 100);
    const marks = correct * test.mark - wrong * test.minus;
    return (
      <>
        <Title back={test.back}>{test.title}: Result</Title>
        <section className="card result"><div className="score"><b>{p}%</b><span>{p >= 80 ? 'Excellent work' : p >= 60 ? 'Good progress' : 'Keep practising'}</span></div><ul><li><b>{correct}</b>Correct</li><li><b>{wrong}</b>Wrong</li><li><b>{list.length - correct - wrong}</b>Skipped</li><li><b>{marks} / {list.length * test.mark}</b>Marks</li></ul></section>
        <div className="finish"><button className="btn" onClick={again}>Try Again</button><Link className="btn soft" to={test.back}>Back</Link></div>
        <h2 className="mt">Review</h2>
        <div className="rows">{list.map((q, i) => { const mine = answers[q.id]; const ok = mine === q.answer; return <article className="card review" key={q.id}><h3>{ok ? <CircleCheck size={22} className="t-green" /> : <CircleX size={22} className="t-red" />}<span>{i + 1}. {q.q}</span></h3>{!ok && <p>Your answer: {mine ?? 'Skipped'}</p>}<p><b>Answer: {q.answer}</b></p><p className="muted">{q.why}</p></article>; })}</div>
      </>
    );
  }

  const q = list[at];
  const mine = answers[q.id];
  const show = test.kind === 'practice' && !!mine;
  const last = at === list.length - 1;
  const open = list.length - Object.keys(answers).length;
  return (
    <div className="test">
      <header className="test-top"><h1>{test.title}</h1>{test.seconds > 0 && <span className={`timer${left < 60 ? ' low' : ''}`}><Clock size={20} /> {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</span>}<button className="btn soft" onClick={() => setConfirm('leave')}>Exit</button></header>
      <div className="track"><i style={{ width: `${((at + 1) / list.length) * 100}%` }} /></div>
      <section className="card question">
        <p className="muted">Question {at + 1} of {list.length} • {test.sid ? q.topic : SUBJECT_NAMES[q.sid]}</p>
        <h2>{q.q}</h2>
        <div className="options">{q.options.map((o, i) => {
          const state = show ? (o === q.answer ? ' right' : o === mine ? ' wrong' : '') : o === mine ? ' on' : '';
          return <button key={o} className={`option${state}`} disabled={show} aria-pressed={o === mine} onClick={() => setAnswers({ ...answers, [q.id]: o })}><i>{'ABCD'[i]}</i>{o}</button>;
        })}</div>
        {show && <p className={`why ${mine === q.answer ? 'right' : 'wrong'}`} role="status"><b>{mine === q.answer ? 'Correct!' : 'Not quite.'}</b> {q.why}</p>}
      </section>
      <div className="test-nav">
        <button className="btn soft" disabled={at === 0} onClick={() => setAt(at - 1)}>Previous</button>
        {mine && !show && <button className="btn soft" onClick={() => { const a = { ...answers }; delete a[q.id]; setAnswers(a); }}>Clear</button>}
        {last ? <button className="btn" onClick={() => (open ? setConfirm('submit') : finish())}>Finish</button> : <button className="btn" onClick={() => setAt(at + 1)}>Next</button>}
      </div>
      <nav className="numbers" aria-label="Questions">{list.map((x, i) => <button key={x.id} className={`${i === at ? 'now ' : ''}${answers[x.id] ? 'ans' : ''}`} onClick={() => setAt(i)} aria-label={`Question ${i + 1}${answers[x.id] ? ', answered' : ''}`}>{i + 1}</button>)}</nav>
      {confirm && (
        <Modal title={confirm === 'leave' ? 'Leave this test?' : 'Finish now?'} onClose={() => setConfirm(null)}>
          <p>{confirm === 'leave' ? 'Your answers will not be saved.' : `${open} question${open > 1 ? 's are' : ' is'} not answered.`}</p>
          <div className="finish">{confirm === 'leave' ? <button className="btn" onClick={() => go(test.back)}>Leave</button> : <button className="btn" onClick={finish}>Finish</button>}<button className="btn soft" onClick={() => setConfirm(null)}>Continue Test</button></div>
        </Modal>
      )}
    </div>
  );
}

