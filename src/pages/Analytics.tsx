import { Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SubjectIcon } from '../components/Art';
import { Bar, Empty, Go, METRICS, Metrics, Ring, StatusPill, Tabs, Title, useTab } from '../components/ui';
import { STREAMS, SUBJECT_NAMES } from '../data/subjects';
import { dayPlus, fmtDate, statusOf, today, toDate, useApp } from '../state';

const TABS = [['overall', 'Overall'], ['subject', 'Subject-wise'], ['tests', 'Tests & Exams'], ['reports', 'Reports']] as const;

export function AnalyticsPage() {
  const app = useApp();
  const [tab, setTab] = useTab(['overall', 'subject', 'tests', 'reports'] as const, 'subject');
  const table = (
    <table className="table">
      <thead><tr><th>Subject</th><th>Coverage</th><th>Revision</th><th>Readiness</th></tr></thead>
      <tbody>{app.subjects.map((s) => <tr key={s}><td><Link to={`/subjects/${s}?tab=progress`} className="sub"><SubjectIcon id={s} size={28} />{SUBJECT_NAMES[s]}</Link></td><td>{app.coverage(s)}%</td><td data-l="Revision">{app.rounds(s)} / 5</td><td><StatusPill s={statusOf(app.coverage(s))} /></td></tr>)}</tbody>
    </table>
  );
  const low = METRICS.reduce((a, b) => (app.readiness[b[0]] < app.readiness[a[0]] ? b : a));
  const weak = [...app.subjects].sort((a, b) => app.coverage(a) - app.coverage(b))[0];
  const advice = { coverage: `/subjects/${weak}`, practice: `/practice/${weak}`, revision: '/learning?tab=revision', tests: '/practice?tab=mock' }[low[0]];
  return (
    <>
      <Title action={tab === 'reports' ? <button className="btn soft no-print" onClick={() => window.print()}><Printer size={20} /> Save as PDF</button> : undefined}>Progress &amp; Analytics</Title>
      <Tabs items={TABS} value={tab} onChange={setTab} />
      {tab === 'subject' && <div className="analytics"><div>{table}</div><section className="card ready-card"><h2>Total Readiness</h2><Ring size={210} /><Metrics /></section></div>}
      {tab === 'overall' && (
        <div className="analytics">
          <div>
            <section className="card pad"><h2>Your four measures</h2>{METRICS.map(([k, name]) => <div className="meter" key={k}><span>{name}</span><Bar value={app.readiness[k]} /><b>{app.readiness[k]}%</b></div>)}</section>
            <section className="card pad mt-s"><h2>Last 14 days of study</h2><div className="streak">{Array.from({ length: 14 }, (_, i) => dayPlus(i - 13)).map((d) => <span key={d} className={app.data.days.includes(d) ? 'on' : ''} title={fmtDate(d)}>{toDate(d).getDate()}</span>)}</div><p className="muted">Current streak: {app.streak} {app.streak === 1 ? 'day' : 'days'}</p></section>
            <section className="sprint mt-s"><div><h2>Next best step</h2><p>{low[1]} is your lowest measure at {app.readiness[low[0]]}%</p></div><Go to={advice}>Improve Now</Go></section>
          </div>
          <section className="card ready-card"><h2>Total Readiness</h2><Ring size={210} /><Metrics /></section>
        </div>
      )}
      {tab === 'tests' && (app.attempts.length ? (
        <table className="table">
          <thead><tr><th>Test</th><th>Type</th><th>Date</th><th>Score</th></tr></thead>
          <tbody>{app.attempts.map((a) => <tr key={a.id}><td><b>{a.title}</b></td><td>{{ practice: 'Practice', quiz: 'Quiz', mock: 'Mock test' }[a.kind]}</td><td>{fmtDate(a.at)}</td><td>{a.correct} / {a.total} <span className={`pill ${a.correct / a.total >= 0.65 ? 'green' : 'amber'}`}>{Math.round((a.correct / a.total) * 100)}%</span></td></tr>)}</tbody>
        </table>
      ) : <Empty title="No tests taken yet"><Go to="/practice">Start Practice</Go></Empty>)}
      {tab === 'reports' && (
        <section className="card pad report">
          <h2>Progress report – {fmtDate(today())}</h2>
          <p><b>{app.user.name}</b> • Class {app.cls} • {STREAMS[app.stream].name}</p>
          <div className="grid-4 stats">{[['Readiness', `${app.total}%`], ['Study streak', `${app.streak} ${app.streak === 1 ? 'day' : 'days'}`], ['Tests this week', `${app.weekTests}`], ['Chapters this week', `${app.weekChapters}`]].map(([k, v]) => <div className="card" key={k}><b>{v}</b><span>{k}</span></div>)}</div>
          {table}
        </section>
      )}
    </>
  );
}
