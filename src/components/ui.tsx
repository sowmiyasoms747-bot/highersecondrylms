import { ArrowRight, Check, ChevronLeft, X, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import avatar from '../assets/avatar-aarav.webp';
import { useApp, type Status } from '../state';
import { Tint, type Tone } from './Art';
import { Icon } from './Icon';

/** The open tab is kept in the address, so a tab can be linked to and survives Back. */
export function useTab<T extends string>(keys: readonly T[], fallback: T): [T, (k: T) => void] {
  const [params, set] = useSearchParams();
  const cur = params.get('tab') as T | null;
  return [cur && keys.includes(cur) ? cur : fallback, (k) => set((p) => { p.set('tab', k); return p; }, { replace: true })];
}

export function Tabs<T extends string>({ items, value, onChange }: { items: readonly (readonly [T, string])[]; value: T; onChange: (k: T) => void }) {
  const box = useRef<HTMLDivElement>(null);
  // On narrow screens the row scrolls sideways; keep the open tab in view.
  useEffect(() => {
    const on = box.current?.querySelector<HTMLElement>('.on');
    if (box.current && on) box.current.scrollLeft = on.offsetLeft - (box.current.clientWidth - on.offsetWidth) / 2;
  }, [value]);
  return (
    <div ref={box} className="tabs" role="group" aria-label="Sections">
      {items.map(([k, label]) => <button key={k} className={k === value ? 'on' : ''} aria-pressed={k === value} onClick={() => onChange(k)}>{label}</button>)}
    </div>
  );
}

export function Title({ children, back, action }: { children: ReactNode; back?: string; action?: ReactNode }) {
  return (
    <div className="title">
      {back && <Link to={back} className="back" aria-label="Back"><ChevronLeft size={24} /></Link>}
      <h1>{children}</h1>{action}
    </div>
  );
}

const PILL: Record<Status, string> = { 'On Track': 'green', 'Very Good': 'amber', Excellent: 'green', 'Needs Focus': 'red', 'Not Started': 'grey' };
export const StatusPill = ({ s }: { s: Status }) => <span className={`pill ${PILL[s]}`}>{s}</span>;
const BAR: Record<Status, string> = { 'On Track': 'b-green', 'Very Good': 'b-amber', Excellent: 'b-violet', 'Needs Focus': 'b-olive', 'Not Started': 'b-green' };
export function Bar({ value, tone, status }: { value: number; tone?: string; status?: Status }) {
  return <span className="bar" role="img" aria-label={`${value}%`}><i className={status ? BAR[status] : tone ?? 'b-brand'} style={{ width: `${value}%` }} /></span>;
}

export const RING = { coverage: '#6a24e6', practice: '#3f83f8', revision: '#9a5cf2', tests: '#c69cfb' };
export const METRICS = [['coverage', 'Syllabus Coverage'], ['practice', 'Practice Level'], ['revision', 'Revision Status'], ['tests', 'Test Performance']] as const;

/** Each band is one measure's share of the readiness total, in the colours of the list beside it. */
export function Ring({ size = 190 }: { size?: number }) {
  const { total, readiness } = useApp();
  const r = 42;
  const len = 2 * Math.PI * r;
  let from = 0;
  return (
    <div className="ring" style={{ width: size }} role="img" aria-label={`${total}% ready`}>
      <svg viewBox="0 0 100 100"><g transform="rotate(-90 50 50)" fill="none" strokeWidth="10">
        <circle cx="50" cy="50" r={r} stroke="#e9e1fb" />
        {METRICS.map(([k]) => {
          const part = (readiness[k] / 400) * len;
          const el = <circle key={k} cx="50" cy="50" r={r} stroke={RING[k]} strokeDasharray={`${Math.max(0, part - 0.8)} ${len}`} strokeDashoffset={-from} />;
          from += part;
          return el;
        })}
      </g></svg>
      <div><b>{total}%</b><span>Ready</span></div>
    </div>
  );
}

export function Metrics() {
  const { readiness } = useApp();
  return (
    <ul className="metrics">
      {METRICS.map(([k, name]) => <li key={k}><i style={{ borderColor: RING[k] }} /><span>{name}</span><b>{readiness[k]}%</b></li>)}
    </ul>
  );
}

export function Box({ on, partial, onClick, label }: { on: boolean; partial?: boolean; onClick?: () => void; label: string }) {
  const cls = `box${on ? ' on' : ''}${partial ? ' part' : ''}`;
  const body = on ? <Check size={17} strokeWidth={3.4} /> : null;
  return onClick ? <button className={cls} role="checkbox" aria-checked={on} aria-label={label} onClick={onClick}>{body}</button> : <span className={cls} role="img" aria-label={label}>{body}</span>;
}

/** `icon` is a line icon with a tone, or the name of a picture in assets/icons. */
export function IconCard({ to, icon, tone = 'violet', title, sub, foot }: { to: string; icon: LucideIcon | string; tone?: Tone; title: ReactNode; sub?: string; foot?: string }) {
  return (
    <Link to={to} className="card icon-card">
      {typeof icon === 'string' ? <Icon name={icon} size={72} /> : <Tint icon={icon} tone={tone} size={44} />}<b>{title}</b>{sub && <span>{sub}</span>}{foot && <em><i>{foot}</i></em>}
    </Link>
  );
}

export function Go({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  return <Link to={to} className={`btn ${className}`}>{children} <ArrowRight size={20} /></Link>;
}

export const Empty = ({ title, children }: { title: string; children?: ReactNode }) => <div className="empty"><b>{title}</b>{children && <div>{children}</div>}</div>;

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = ref.current; if (d && !d.open) d.showModal(); }, []);
  return (
    <dialog ref={ref} className="modal" aria-label={title} onClose={onClose} onClick={(e) => { if (e.target === ref.current) ref.current.close(); }}>
      <div className="modal-in"><header><h2>{title}</h2><button onClick={() => ref.current?.close()} aria-label="Close"><X size={24} /></button></header>{children}</div>
    </dialog>
  );
}

export function Avatar({ size = 44 }: { size?: number }) {
  const { data } = useApp();
  const src = data.photo ?? avatar;
  return <img className="avatar" src={src} alt="" style={{ width: size, height: size }} />;
}
