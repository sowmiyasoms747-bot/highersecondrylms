import { Bell, ChevronDown, CircleUserRound, Menu, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CAREERS, EXAMS } from '../data/content';
import { STREAMS, SUBJECT_NAMES, type Cls, type Stream } from '../data/subjects';
import { today, useApp, useSession } from '../state';
import { LogoMark } from './Art';
import { Icon } from './Icon';
import { Avatar } from './ui';

/** Address, label and icon name in assets/icons/menu. */
const NAV: [string, string, string][] = [
  ['/', 'Dashboard', 'dashboard'], ['/learning', 'My Learning', 'learning'], ['/subjects', 'Subjects', 'subjects'], ['/materials', 'Study Materials', 'materials'],
  ['/practice', 'Practice & Tests', 'practice'], ['/exam', 'Exam Prep', 'exam'], ['/buddy', 'AI Study Buddy', 'buddy'], ['/analytics', 'Progress & Analytics', 'analytics'],
  ['/planner', 'Study Planner', 'planner'], ['/motivation', 'Motivation Hub', 'motivation'], ['/career', 'Career & Colleges', 'career'], ['/mentor', 'Ask a Mentor', 'mentor'],
  ['/account', 'Settings', 'settings'], ['/help', 'Help & Support', 'help'],
];
const RESOURCES = [['Notes & Summary', 'notes'], ['Video Lectures', 'videos'], ['Mind Maps', 'mindmaps'], ['Revision Sheets', 'sheets'], ['Download Center', 'downloads']];
/** Pages that belong under a menu item but live at another address. */
const UNDER: Record<string, string> = { '/test': '/practice', '/pack': '/materials' };

function useOutside(ref: RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    const down = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) close(); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
  });
}

function Drop({ label, className, children, aria }: { label: ReactNode; className: string; aria?: string; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutside(ref, () => setOpen(false));
  return (
    <div className={`drop ${className}`} ref={ref}>
      <button aria-expanded={open} aria-label={aria} onClick={() => setOpen((o) => !o)}>{label}</button>
      {open && <div className="pop">{children(() => setOpen(false))}</div>}
    </div>
  );
}

const PLACEHOLDER = 'Search for notes, quizzes, topics...';
function SearchBox({ open, onClose }: { open: boolean; onClose: () => void }) {
  const app = useApp();
  const go = useNavigate();
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  useOutside(ref, () => setShow(false));
  useEffect(() => { if (open) field.current?.focus(); }, [open]);
  const index = useMemo(() => [
    ...NAV.map(([to, label]) => ({ label, sub: 'Page', to })),
    ...app.subjects.flatMap((s) => [
      { label: SUBJECT_NAMES[s], sub: 'Subject', to: `/subjects/${s}` },
      { label: `${SUBJECT_NAMES[s]} quiz`, sub: 'Quiz', to: `/test?kind=quiz&sid=${s}` },
      ...app.chapters(s).map((c, i) => ({ label: c, sub: `${SUBJECT_NAMES[s]} – Chapter ${i + 1}`, to: `/subjects/${s}/${i + 1}` })),
    ]),
    ...EXAMS.map((e) => ({ label: `${e.name} preparation`, sub: 'Exam', to: `/exam/${e.id}` })),
    ...CAREERS.map((c) => ({ label: `${c.name} ${c.note.replace(/[()]/g, '')}`, sub: 'Career', to: `/career/${c.id}` })),
    ...RESOURCES.map(([label, k]) => ({ label, sub: 'Study material', to: `/materials/${k}` })),
  ], [app]);
  const term = q.trim().toLowerCase();
  const hits = term ? index.filter((x) => `${x.label} ${x.sub}`.toLowerCase().includes(term)).slice(0, 8) : [];
  const close = () => { setQ(''); setShow(false); onClose(); };
  const pick = (to: string) => { close(); go(to); };
  return (
    <div className={`search${open ? ' open' : ''}`} ref={ref}>
      <Search size={19} />
      <input ref={field} value={q} placeholder={PLACEHOLDER} aria-label="Search for notes, quizzes and topics" onFocus={() => setShow(true)}
        onChange={(e) => { setQ(e.target.value); setShow(true); }} onKeyDown={(e) => { if (e.key === 'Enter' && hits[0]) pick(hits[0].to); if (e.key === 'Escape') close(); }} />
      {open && <button className="search-x" onClick={close} aria-label="Close search"><X size={20} /></button>}
      {show && term && (
        <div className="pop search-pop">
          {hits.map((h) => <button key={h.to + h.label} onClick={() => pick(h.to)}><b>{h.label}</b><span>{h.sub}</span></button>)}
          {!hits.length && <p>No results for “{q}”</p>}
        </div>
      )}
    </div>
  );
}

function Notices() {
  const app = useApp();
  const { patch } = useSession();
  const { prefs, week, readNotices } = app.data;
  const left = app.todayTasks.filter((t) => !t.done).length;
  const weak = [...app.subjects].sort((a, b) => app.coverage(a) - app.coverage(b))[0];
  const need = week.tests - app.weekTests;
  const list: { id: string; text: string; to: string }[] = [];
  if (prefs.plan && left) list.push({ id: `plan-${today()}-${left}`, text: `${left} task${left > 1 ? 's' : ''} left in today’s plan`, to: '/planner' });
  if (app.coverage(weak) < 65) list.push({ id: `weak-${weak}-${app.coverage(weak)}`, text: `${SUBJECT_NAMES[weak]} needs focus: ${app.coverage(weak)}% covered`, to: `/subjects/${weak}` });
  if (prefs.tests && need > 0) list.push({ id: `test-${today()}-${need}`, text: `${need} more test${need > 1 ? 's' : ''} to reach this week’s goal`, to: '/practice?tab=mock' });
  if (prefs.quotes) list.push({ id: `quote-${today()}`, text: 'Your daily motivation is ready', to: '/motivation' });
  const fresh = list.some((n) => !readNotices.includes(n.id));
  const mark = (ids: string[]) => patch((d) => ({ readNotices: [...new Set([...ids, ...d.readNotices])].slice(0, 60) }));
  return (
    <Drop className="bell" aria={fresh ? 'Notifications, new' : 'Notifications'} label={<><Bell size={25} />{fresh && <i />}</>}>
      {(close) => (
        <>
          <header><b>Notifications</b>{fresh && <button onClick={() => mark(list.map((n) => n.id))}>Mark all read</button>}</header>
          {list.map((n) => <Link key={n.id} to={n.to} className={readNotices.includes(n.id) ? '' : 'new'} onClick={() => { mark([n.id]); close(); }}>{n.text}</Link>)}
          {!list.length && <p>You are all caught up.</p>}
        </>
      )}
    </Drop>
  );
}

function HomeMenus() {
  const app = useApp();
  const { patch, setToast } = useSession();
  const set = (f: { cls?: Cls; stream?: Stream }, name: string, close: () => void) => { patch(() => f); setToast(`Now showing ${name}`); close(); };
  const label = (t: string) => <>{t} <ChevronDown size={17} /></>;
  return (
    <nav className="menus" aria-label="Quick menus">
      <Drop className="menu" label={label('Classes')}>{(c) => ([11, 12] as Cls[]).map((x) => <button key={x} className={app.cls === x ? 'on' : ''} onClick={() => set({ cls: x }, `Class ${x}`, c)}>Class {x}</button>)}</Drop>
      <Drop className="menu" label={label('Streams')}>{(c) => (Object.keys(STREAMS) as Stream[]).map((x) => <button key={x} className={app.stream === x ? 'on' : ''} onClick={() => set({ stream: x }, STREAMS[x].name, c)}>{STREAMS[x].name}</button>)}</Drop>
      <Drop className="menu" label={label('Exam Prep')}>{(c) => EXAMS.map((x) => <Link key={x.id} to={`/exam/${x.id}`} onClick={c}>{x.name} {x.note}</Link>)}</Drop>
      <Drop className="menu" label={label('Resources')}>{(c) => RESOURCES.map(([t, k]) => <Link key={k} to={`/materials/${k}`} onClick={c}>{t}</Link>)}</Drop>
    </nav>
  );
}

export function Layout() {
  const app = useApp();
  const { toast } = useSession();
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const home = pathname === '/';
  useEffect(() => { setMenu(false); setSearch(false); window.scrollTo(0, 0); }, [pathname]);
  // While the drawer is open: no page scroll behind it, and Escape or a resize closes it.
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(false);
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', key);
    window.addEventListener('resize', close);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', key); window.removeEventListener('resize', close); };
  }, [menu]);
  const root = `/${pathname.split('/')[1]}`;
  const active = UNDER[root] ?? root;
  return (
    <div className={`shell${home ? ' home' : ''}`}>
      <header className="top">
        <button className="burger" onClick={() => setMenu((m) => !m)} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu}>{menu ? <X /> : <Menu />}</button>
        <Link to="/" className="brand" aria-label="Learning Universe LMS, dashboard"><LogoMark size={42} /><b>Learning Universe LMS</b></Link>
        {home && <HomeMenus />}
        <SearchBox open={search} onClose={() => setSearch(false)} />
        <button className="find" onClick={() => setSearch(true)} aria-label="Search"><Search size={24} /></button>
        <Notices />
        {home
          ? <Link to="/account" className="me"><Avatar size={46} /><span><b>{app.user.name}</b>Class {app.cls} • {STREAMS[app.stream].name.split(' ')[0]}</span></Link>
          : <Link to="/account" className="me-ico" aria-label="My account"><CircleUserRound size={27} /></Link>}
      </header>
      <aside className={`side${menu ? ' open' : ''}`}>
        <nav aria-label="Main">
          {NAV.map(([to, label, icon]) => <NavLink key={to} to={to} end className={active === to ? 'on' : ''} title={label}><Icon name={`menu/${icon}`} size={30} /><span>{label}</span></NavLink>)}
        </nav>
      </aside>
      {menu && <div className="scrim" onClick={() => setMenu(false)} />}
      <main className="main"><div className="page"><Outlet /></div></main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
