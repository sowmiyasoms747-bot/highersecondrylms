import { Link } from 'react-router-dom';
import students from '../assets/students.webp';
import { School, SubjectIcon, Sunset } from '../components/Art';
import { Icon } from '../components/Icon';
import { Bar, Box, Go, Metrics, Ring, StatusPill } from '../components/ui';
import { STREAMS, SUBJECT_NAMES } from '../data/subjects';
import { fmtMin, statusOf, useApp } from '../state';

/** Two label lines, address and icon name in assets/icons. */
const QUICK: [string, string, string, string][] = [
  ['Syllabus &', 'Chapters', '/subjects', 'quick/syllabus'], ['Notes &', 'Summary', '/materials/notes', 'quick/notes'], ['Video', 'Lectures', '/materials/videos', 'quick/video'],
  ['Question', 'Bank', '/practice', 'quick/bank'], ['Previous', 'Year Papers', '/exam', 'quick/papers'], ['Mock Tests', '(Board/JEE/NEET)', '/practice?tab=mock', 'quick/mock'], ['Revision', 'Sheets', '/exam?tab=sheets', 'quick/revision'],
];
const ALL: [string, string, string, string][] = [
  ['Chapter-wise', 'Concepts', '/materials/concepts', 'study/concepts'], ['Notes', '(PDF)', '/materials/notes', 'study/notes'], ['Video', 'Lectures', '/materials/videos', 'study/video'], ['Quick Revision', '(Sheets)', '/materials/sheets', 'study/revision'],
  ['Mind Maps', '', '/materials/mindmaps', 'study/mindmap'], ['PYQs', '(Previous Year)', '/exam', 'study/pyq'], ['Mock Tests', '(JEE/NEET/CUET)', '/practice?tab=mock', 'study/mock'], ['Practice', 'Questions', '/practice', 'study/practice'],
];

/** Lets a long “A/B/C” label continue on the next line after a slash. */
const breakable = (s: string) => s.replace(/\//g, '/\u200b');

export function DashboardPage() {
  const app = useApp();
  return (
    <div className="dash">
      <section className="hero">
        <School />
        <div className="hero-text"><Icon name="quick/cap" size={96} /><div><h1>Higher Secondary <span>(Class 11 – 12)</span></h1><p>Boards • JEE • NEET • CUET • All Subjects • Resources</p></div></div>
        <img src={students} alt="" className="hero-kids" />
        <p className="hero-script" aria-hidden="true"><span>Learn</span><span>Prepare</span><span>Practice</span><span>Achieve</span></p>
      </section>
      <nav className="quick" aria-label="Study shortcuts">
        {QUICK.map(([a, b, to, icon]) => <Link key={a + b} to={to} className="card"><Icon name={icon} size={42} /><span>{a}<br />{b.startsWith('(') ? <small>{breakable(b)}</small> : b}</span></Link>)}
      </nav>
      <section className="card d-subjects">
        <h2>Subject Progress – Class {app.cls} ({STREAMS[app.stream].name.split(' ')[0]})</h2>
        {app.subjects.map((s) => {
          const c = app.coverage(s);
          return <Link key={s} to={`/subjects/${s}`} className="sub-row"><SubjectIcon id={s} size={30} /><b>{SUBJECT_NAMES[s]}</b><Bar value={c} status={statusOf(c)} /><span>{c}%</span><StatusPill s={statusOf(c)} /></Link>;
        })}
      </section>
      <section className="card d-ready">
        <h2>Your Overall Readiness</h2>
        <div className="ready-in"><Ring size={182} /><Metrics /></div>
        <Go to="/analytics">View Detailed Analytics</Go>
      </section>
      <Link to="/analytics?tab=overall" className="card d-streak">
        <h2>Study Streak <Icon name="home/flame" size={26} /></h2>
        <div><p><b>{app.streak} {app.streak === 1 ? 'Day' : 'Days'}</b>Keep the Momentum!</p><Icon name="home/done" size={58} /></div>
      </Link>
      <section className="card d-plan">
        <h2>Today’s Study Plan <Icon name="home/plan" size={26} /></h2>
        {app.todayTasks.slice(0, 3).map((t) => <div key={t.id} className={t.done ? 'done' : ''}><Box on={t.done} label={t.title} onClick={() => app.editTask(t.id, { done: !t.done })} /><Link to="/planner" title={t.title}>{t.title}</Link><span>{fmtMin(t.minutes)}</span></div>)}
        {!app.todayTasks.length && <p className="muted">Nothing planned yet. <Link to="/planner" className="link">Plan today</Link></p>}
      </section>
      <section className="card d-all">
        <h2>Complete Study Material – All in One Place</h2>
        <div>{ALL.map(([a, b, to, icon]) => <Link key={a + b} to={to} className="tile"><Icon name={icon} size={46} /><span>{a}<br />{b.startsWith('(') ? <small>{breakable(b)}</small> : b}</span></Link>)}</div>
      </section>
      <Link to="/motivation" className="d-motive"><Sunset small /><h2>Motivation for You</h2><p>“Stay consistent. Big goals take daily effort.”</p></Link>
    </div>
  );
}
