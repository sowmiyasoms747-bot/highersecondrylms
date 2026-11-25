import { Camera, CircleQuestionMark, Info, Settings, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Avatar, Modal, Title } from '../components/ui';
import { FAQS } from '../data/content';
import { GOALS, STREAMS, type Cls, type GoalId, type Stream } from '../data/subjects';
import { useApp, useSession } from '../state';

type Section = 'profile' | 'settings' | 'preferences' | 'about';

function ProfileForm({ onDone }: { onDone: () => void }) {
  const { user, data } = useApp();
  const { updateUser, setToast, patch } = useSession();
  const [f, setF] = useState({ name: user.name, email: user.email, mobile: user.mobile });
  const [error, setError] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const photo = (e: ChangeEvent<HTMLInputElement>) => {
    const f0 = e.target.files?.[0];
    e.target.value = '';
    if (!f0) return;
    const img = new Image();
    const url = URL.createObjectURL(f0);
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 240;
      const s = Math.min(img.width, img.height);
      c.getContext('2d')?.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 240, 240);
      patch(() => ({ photo: c.toDataURL('image/jpeg', 0.85) }));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { setError('That file is not a photo.'); URL.revokeObjectURL(url); };
    img.src = url;
  };
  const save = (e: FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return setError('Enter your full name.');
    if (!/^[6-9]\d{9}$/.test(f.mobile)) return setError('Enter a 10-digit mobile number starting with 6, 7, 8 or 9.');
    updateUser(f);
    setToast('Profile saved');
    onDone();
  };
  return (
    <form className="form" onSubmit={save}>
      <div className="photo"><Avatar size={84} /><button type="button" className="btn soft" onClick={() => file.current?.click()}><Camera size={19} /> Change photo</button>{data.photo && <button type="button" className="link" onClick={() => patch(() => ({ photo: undefined }))}>Remove</button>}<input ref={file} type="file" accept="image/*" hidden onChange={photo} /></div>
      <label>Full name<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" required /></label>
      <label>Email<input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" required /></label>
      <label>Mobile number<input type="tel" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value })} autoComplete="tel-national" required /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="finish"><button className="btn">Save</button></div>
    </form>
  );
}

function Preferences({ onDone }: { onDone: () => void }) {
  const { data } = useApp();
  const { patch } = useSession();
  const flip = (id: GoalId) => patch((d) => ({ goals: d.goals.includes(id) ? (d.goals.length > 1 ? d.goals.filter((g) => g !== id) : d.goals) : GOALS.map((g) => g.id).filter((g) => g === id || d.goals.includes(g)) }));
  return (
    <div className="form">
      <div className="two">
        <label>Class<select value={data.cls} onChange={(e) => { const cls = Number(e.target.value) as Cls; patch(() => ({ cls })); }}><option value={11}>Class 11</option><option value={12}>Class 12</option></select></label>
        <label>Stream<select value={data.stream} onChange={(e) => { const stream = e.target.value as Stream; patch(() => ({ stream })); }}>{(Object.keys(STREAMS) as Stream[]).map((s) => <option key={s} value={s}>{STREAMS[s].name}</option>)}</select></label>
      </div>
      <fieldset><legend>Exam goals</legend>{GOALS.map((g) => <label key={g.id}><input type="checkbox" checked={data.goals.includes(g.id)} onChange={() => flip(g.id)} /> {g.name}</label>)}</fieldset>
      <fieldset><legend>Notifications</legend>{([['plan', 'Today’s plan'], ['tests', 'Weekly test goal'], ['quotes', 'Daily motivation']] as const).map(([k, t]) => <label key={k}><input type="checkbox" checked={data.prefs[k]} onChange={(e) => { const on = e.target.checked; patch((d) => ({ prefs: { ...d.prefs, [k]: on } })); }} /> {t}</label>)}</fieldset>
      <p className="muted">Language: English</p>
      <div className="finish"><button className="btn" onClick={onDone}>Done</button></div>
    </div>
  );
}

export function AccountPage() {
  const { user, cls, stream } = useApp();
  const [params, set] = useSearchParams();
  const open = params.get('open') as Section | null;
  const close = () => set({}, { replace: true });
  const item = (I: LucideIcon, title: string, sub: string, to: string) => <Link className="card acc" to={to}><I size={44} strokeWidth={1.9} /><span><b>{title}</b>{sub}</span></Link>;
  return (
    <>
      <Title>My Account</Title>
      <div className="account">
        <section className="card profile"><Avatar size={170} /><h2>{user.name}</h2><p>Class {cls} • {STREAMS[stream].name}</p><Link className="btn soft" to="/account?open=profile">Edit Profile</Link></section>
        <section className="card acc-list">
          {item(Settings, 'Account Settings', 'Update profile, email, mobile', '/account?open=settings')}
          {item(SlidersHorizontal, 'Preferences', 'Subjects, notifications, language', '/account?open=preferences')}
          {item(CircleQuestionMark, 'Help & Support', 'FAQs, chat support, contact us', '/help')}
          {item(Info, 'About Learning Universe LMS', 'Version, terms, privacy', '/account?open=about')}
        </section>
      </div>
      {open === 'profile' && <Modal title="Edit Profile" onClose={close}><ProfileForm onDone={close} /></Modal>}
      {open === 'settings' && <Modal title="Account Settings" onClose={close}><ProfileForm onDone={close} /></Modal>}
      {open === 'preferences' && <Modal title="Preferences" onClose={close}><Preferences onDone={close} /></Modal>}
      {open === 'about' && <Modal title="About Learning Universe LMS" onClose={close}><p>Higher Secondary (Classes 11–12), version 1.0</p><p><b>Terms:</b> For personal study.</p><p><b>Privacy:</b> Your profile and progress are kept in this browser and are not sent anywhere.</p></Modal>}
    </>
  );
}

const JOURNEY: [string, string, string][] = [
  ['Explore', 'Dashboard', '/'], ['Learn', '(My Learning)', '/learning'], ['Access', 'Study Materials', '/materials'],
  ['Practice &', 'Mock Tests', '/practice'], ['Exam Prep', '(PYQs & Revision)', '/exam'], ['Track Progress', '& Readiness', '/analytics'], ['Plan Your', 'Study', '/planner'], ['Get AI', 'Support', '/buddy'],
  ['Stay', 'Motivated', '/motivation'], ['Explore Careers', '& Colleges', '/career'], ['Get Help &', 'Manage Settings', '/account'],
];

export function HelpPage() {
  return (
    <>
      <Title>Help &amp; Support</Title>
      <section className="card pad"><h2>Frequently asked questions</h2>{FAQS.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
      <div className="grid-2 mt-s"><section className="card pad"><h2>Chat support</h2><p>Get quick help with your studies at any time.</p><Link className="btn soft" to="/buddy">Open AI Study Buddy</Link></section><section className="card pad"><h2>Contact us</h2><p>Send a question about your studies or career.</p><Link className="btn soft" to="/mentor">Ask a Mentor</Link></section></div>
      <h2 className="mt">Your learning journey</h2>
      <div className="journey">{JOURNEY.map(([a, b, to], i) => <Link className="card" key={to} to={to}><i>{i + 1}</i><span>{a}<br />{b}</span></Link>)}</div>
    </>
  );
}
