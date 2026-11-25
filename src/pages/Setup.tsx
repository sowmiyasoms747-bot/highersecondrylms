import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarsArt, FlaskArt, PaletteArt, Target } from '../components/Art';
import { Box } from '../components/ui';
import { GOALS, STREAMS, type Cls, type GoalId, type Stream } from '../data/subjects';
import { useApp, useSession } from '../state';

const ART: Record<Stream, () => JSX.Element> = { science: FlaskArt, commerce: BarsArt, arts: PaletteArt };

export function SetupPage() {
  const { data } = useApp();
  const { patch } = useSession();
  const go = useNavigate();
  return (
    <div className="setup">
      <h1>Choose Your Class</h1>
      <div className="pick-2">
        {([11, 12] as Cls[]).map((c) => <button key={c} className={`pick${data.cls === c ? ' on' : ''}`} aria-pressed={data.cls === c} onClick={() => patch(() => ({ cls: c }))}>Class {c}{data.cls === c && <Check className="tick" size={26} strokeWidth={3} />}</button>)}
      </div>
      <h1>Select Your Stream</h1>
      <div className="pick-3">
        {(Object.keys(STREAMS) as Stream[]).map((s) => {
          const Art = ART[s];
          return <button key={s} className={`pick stream${data.stream === s ? ' on' : ''}`} aria-pressed={data.stream === s} onClick={() => patch(() => ({ stream: s }))}><Art />{STREAMS[s].name}{data.stream === s && <Check className="tick" size={26} strokeWidth={3} />}</button>;
        })}
      </div>
      <button className="btn big" onClick={() => go('/setup/goal')}>Continue <ArrowRight size={24} /></button>
    </div>
  );
}

export function GoalPage() {
  const { data } = useApp();
  const { patch } = useSession();
  const go = useNavigate();
  const toggle = (id: GoalId) => patch((d) => ({ goals: d.goals.includes(id) ? d.goals.filter((g) => g !== id) : GOALS.map((g) => g.id).filter((g) => g === id || d.goals.includes(g)) }));
  const chosen = GOALS.filter((g) => data.goals.includes(g.id));
  return (
    <div className="setup goal">
      <h1>Set Your Exam Goal</h1><p>Choose your primary and additional targets</p>
      <div className="goal-grid">
        <div className="goal-list">
          {GOALS.map((g) => {
            const on = data.goals.includes(g.id);
            return <button key={g.id} className={`goal-row${on ? ' on' : ''}`} role="checkbox" aria-checked={on} onClick={() => toggle(g.id)}><Box on={on} label="" /><span><b>{g.name}</b> {g.note}</span></button>;
          })}
        </div>
        <div className="goal-side">
          <Target size={180} />
          <div className="goal-card"><span>Your Goal</span><b>{chosen.map((g) => g.short).join(' + ') || 'Not set'}</b><em>Target: Class {data.cls}</em></div>
        </div>
      </div>
      <button className="btn big" disabled={!chosen.length} onClick={() => { patch(() => ({ setupDone: true })); go('/'); }}>Get Started <ArrowRight size={24} /></button>
    </div>
  );
}
