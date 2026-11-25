import { BookHeart, ChartNoAxesColumnIncreasing, Cpu, ExternalLink, FlaskConical, HeartPulse, Landmark, Route as RouteIcon, UserRoundCheck, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Tint, type Tone } from '../components/Art';
import { Go, IconCard, Tabs, Title, useTab } from '../components/ui';
import { ADMISSIONS, CAREERS, COLLEGES, GUIDANCE, ROADMAP } from '../data/content';

const TABS = [['paths', 'Career Paths'], ['colleges', 'Colleges'], ['exams', 'Exams & Admission'], ['guidance', 'Guidance']] as const;
const LOOK: Record<string, [LucideIcon, Tone]> = { engineering: [Cpu, 'violet'], medical: [HeartPulse, 'pink'], research: [FlaskConical, 'blue'], commerce: [ChartNoAxesColumnIncreasing, 'orange'], humanities: [BookHeart, 'orange'] };
const TYPE: Record<string, string> = { engineering: 'Engineering', medical: 'Medical', research: 'Science', commerce: 'Commerce', humanities: 'Humanities' };

const CollegeRow = ({ c }: { c: (typeof COLLEGES)[number] }) => <a className="row-card" href={c.site} target="_blank" rel="noreferrer"><span className="grow"><b>{c.name}</b><small>{c.place}</small></span><span className="pill grey opt">{c.type}</span><span className="chip">Website <ExternalLink size={15} /></span></a>;

export function CareerPage() {
  const [tab, setTab] = useTab(['paths', 'colleges', 'exams', 'guidance'] as const, 'paths');
  const [type, setType] = useState('All');
  return (
    <>
      <Title>Career &amp; Colleges</Title>
      <Tabs items={TABS} value={tab} onChange={setTab} />
      {tab === 'paths' && (
        <div className="grid-4 eight">
          {CAREERS.map((c) => <IconCard key={c.id} to={`/career/${c.id}`} icon={LOOK[c.id][0]} tone={LOOK[c.id][1]} title={c.note.startsWith('&') ? <>{c.name}<br />{c.note}</> : c.name} sub={c.note.startsWith('&') ? undefined : c.note} />)}
          <IconCard to="/career?tab=colleges" icon={Landmark} tone="violet" title="Top Colleges" sub="(NIT, IIT, AIIMS, etc.)" />
          <IconCard to="/career?tab=exams" icon={UserRoundCheck} tone="blue" title={<>Admission<br />Guidance</>} />
          <IconCard to="/career/roadmap" icon={RouteIcon} tone="green" title="Career Roadmaps" sub="(after Class 12)" />
        </div>
      )}
      {tab === 'colleges' && <><div className="chips">{['All', 'Engineering', 'Medical', 'Science', 'Commerce', 'Humanities'].map((t) => <button key={t} className={`chip${t === type ? ' on' : ''}`} aria-pressed={t === type} onClick={() => setType(t)}>{t}</button>)}</div><div className="rows">{COLLEGES.filter((c) => type === 'All' || c.type === type).map((c) => <CollegeRow key={c.name} c={c} />)}</div></>}
      {tab === 'exams' && <><p className="lead">Dates and rules change every year. Always check the official site.</p><div className="rows">{ADMISSIONS.map((a) => <a className="row-card" key={a.exam} href={a.site} target="_blank" rel="noreferrer"><span className="grow"><b>{a.exam}</b><small>{a.leads}</small></span><span className="chip">{a.siteName} <ExternalLink size={15} /></span></a>)}</div></>}
      {tab === 'guidance' && <><div className="grid-2">{GUIDANCE.map((g) => <article className="card pad" key={g.title}><h2>{g.title}</h2><p>{g.text}</p></article>)}</div><section className="sprint"><div><h2>Need personal advice?</h2><p>Send your question to a mentor</p></div><Go to="/mentor">Ask a Mentor</Go></section></>}
    </>
  );
}

export function CareerDetailPage() {
  const { id } = useParams();
  if (id === 'roadmap') return <><Title back="/career">Career Roadmap after Class 12</Title><ol className="roadmap">{ROADMAP.map((r, i) => <li className="card pad" key={r.title}><i>{i + 1}</i><div><h2>{r.title}</h2><p>{r.text}</p></div></li>)}</ol></>;
  const c = CAREERS.find((x) => x.id === id);
  if (!c) return <Navigate to="/career" replace />;
  const colleges = COLLEGES.filter((x) => x.type === TYPE[c.id]);
  return (
    <>
      <Title back="/career">{c.name} {c.note}</Title>
      <section className="card pad exam-head"><Tint icon={LOOK[c.id][0]} tone={LOOK[c.id][1]} size={54} /><p>{c.about}</p></section>
      <div className="grid-3 lists">{([['Courses', c.courses], ['Entrance exams', c.exams], ['Career options', c.roles]] as const).map(([t, l]) => <section className="card pad tips" key={t}><h2>{t}</h2><ul>{l.map((x) => <li key={x}>{x}</li>)}</ul></section>)}</div>
      <h2 className="mt">Your roadmap</h2>
      <ol className="roadmap">{c.steps.map((s, i) => <li className="card pad" key={s}><i>{i + 1}</i><p>{s}</p></li>)}</ol>
      <h2 className="mt">Colleges to explore</h2>
      <div className="rows">{colleges.map((x) => <CollegeRow key={x.name} c={x} />)}</div>
      <p className="lead mt-s">Have a question? <Link className="link" to="/mentor">Ask a mentor</Link></p>
    </>
  );
}
