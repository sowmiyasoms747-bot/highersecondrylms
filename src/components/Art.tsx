import { BriefcaseBusiness, Calculator, Globe, Landmark, Scale, TrendingUp, type LucideIcon } from 'lucide-react';
import logo from '../assets/logo.webp';
import type { SubjectId } from '../data/subjects';
import { Icon, hasIcon } from './Icon';

export const LogoMark = ({ size = 40 }: { size?: number }) => <img className="logo-img" src={logo} width={size} height={Math.round(size * 0.873)} alt="" draggable={false} />;

export type Tone = 'blue' | 'pink' | 'violet' | 'orange' | 'green' | 'sky' | 'red';

/** Line icons for subjects that have no picture in assets/icons/subjects yet. */
const LINE_ICONS: Partial<Record<SubjectId, [LucideIcon, Tone]>> = {
  accountancy: [Calculator, 'blue'], business: [BriefcaseBusiness, 'orange'], economics: [TrendingUp, 'green'],
  history: [Landmark, 'orange'], polsci: [Scale, 'violet'], geography: [Globe, 'sky'],
};
export function SubjectIcon({ id, size = 24 }: { id: SubjectId; size?: number }) {
  const line = LINE_ICONS[id];
  if (!line || hasIcon(`subjects/${id}`)) return <Icon name={`subjects/${id}`} size={size} />;
  const [I, tone] = line;
  return <I size={size} className={`t-${tone}`} strokeWidth={2.3} fill="currentColor" fillOpacity={0.16} aria-hidden="true" />;
}

/** Outline icon with a soft tint, as used on the cards. */
export function Tint({ icon: I, tone, size = 38 }: { icon: LucideIcon; tone: Tone; size?: number }) {
  return <I size={size} className={`t-${tone}`} strokeWidth={2} fill="currentColor" fillOpacity={0.13} aria-hidden="true" />;
}

export function ArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="g-sky" x1="0" y1="0" x2="1" y2=".25"><stop offset="0" stopColor="#3a1a80" /><stop offset=".45" stopColor="#7d3fa8" /><stop offset=".75" stopColor="#e07a86" /><stop offset="1" stopColor="#b0549a" /></linearGradient>
        <radialGradient id="g-sun"><stop offset="0" stopColor="#fff1b8" /><stop offset=".25" stopColor="#ffc766" stopOpacity=".95" /><stop offset=".6" stopColor="#ff9a55" stopOpacity=".45" /><stop offset="1" stopColor="#ff9a55" stopOpacity="0" /></radialGradient>
        <linearGradient id="g-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8f5fc0" /><stop offset="1" stopColor="#4c2a8f" /></linearGradient>
        <linearGradient id="g-mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a3399" /><stop offset="1" stopColor="#2a1763" /></linearGradient>
        <linearGradient id="g-near" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5d3a3a" /><stop offset=".35" stopColor="#2b1a3b" /><stop offset="1" stopColor="#140b2c" /></linearGradient>
        <linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd45c" /><stop offset="1" stopColor="#f29b12" /></linearGradient>
        <linearGradient id="g-violet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9a5bf5" /><stop offset="1" stopColor="#4c12c4" /></linearGradient>
        <linearGradient id="g-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0a0b8" /><stop offset="1" stopColor="#a8568f" /></linearGradient>
        <linearGradient id="g-flask" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fe0ff" /><stop offset="1" stopColor="#2f8bf5" /></linearGradient>
      </defs>
    </svg>
  );
}

/** Student with raised arms on a hilltop at sunset. */
export function Sunset({ small }: { small?: boolean }) {
  return (
    <svg className="sunset" viewBox={small ? '0 0 860 300' : '0 0 960 300'} preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <rect width="960" height="300" fill="url(#g-sky)" /><circle cx="770" cy="150" r="330" fill="url(#g-sun)" />
      <path d="M0 210 70 168l58 26 92-74 70 62 60-24 80 52 96-64 74 46 82-58 92 60 98-76 88 54v128H0z" fill="url(#g-far)" opacity=".75" />
      <path d="m220 120 22 20-10 18 14 24-30-14-22 8-18-14z" fill="#b78be0" opacity=".35" />
      <path d="M0 238 80 214l90 30 100-40 110 48 96-28 110 36 110-30 120 20 244-40v90H0z" fill="url(#g-mid)" />
      <path d="M480 300c40-20 76-26 108-48 34-10 52-34 84-40 24-18 44-18 60-30 22-6 36-16 56-12 26 8 46 30 74 40 30 14 62 20 98 46v44z" fill="url(#g-near)" />
      <path d="m596 254 30-10 14 12-30 16zm74-40 26-8 20 14-36 10zm90-24 22-10 14 18-24 8zm50 30 24 2 16 18-30 2zm-110 34 34-12 22 16-36 14zm150 6 34 6 8 18-40-4z" fill="#f2a14f" opacity=".2" />
      <g fill="#160d2c" stroke="#160d2c" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="768" cy="92" r="9" stroke="none" /><path d="M758 104h20l-2 34h-16z" strokeWidth="4" />
        <path d="m759 106-14-14-12-18M777 106l14-14 12-18" fill="none" strokeWidth="7" /><path d="m763 136-5 36M773 136l5 36" fill="none" strokeWidth="9" />
      </g>
    </svg>
  );
}

export function School() {
  const windows = (x: number, n: number, y: number) => Array.from({ length: n }, (_, i) => <rect key={`${x}${y}${i}`} x={x + i * 20} y={y} width="10" height="15" rx="1.5" fill="#6d3680" />);
  return (
    <svg className="school" viewBox="0 0 620 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <circle cx="90" cy="150" r="180" fill="url(#g-sun)" opacity=".75" />
      <path d="M200 100h150v120H200zM440 100h180v120H440z" fill="url(#g-wall)" /><path d="M194 94h162v9H194zM434 94h192v9H434z" fill="#ffc9d4" />
      <path d="M346 76h98v144h-98z" fill="url(#g-wall)" /><path d="m336 78 59-34 59 34z" fill="#ffc9d4" /><path d="M395 46V14" stroke="#5b2c74" strokeWidth="3" /><path d="m395 14 28 8-28 9z" fill="#4b2a8f" />
      {windows(212, 7, 116)}{windows(212, 7, 146)}{windows(212, 7, 176)}{windows(454, 8, 116)}{windows(454, 8, 146)}{windows(454, 8, 176)}{windows(361, 4, 96)}{windows(361, 4, 126)}
      <path d="M380 220v-44a15 15 0 0 1 30 0v44z" fill="#5b2c74" />
      <g fill="#3b2063"><circle cx="196" cy="198" r="24" /><circle cx="226" cy="206" r="18" /><circle cx="170" cy="208" r="18" /><circle cx="470" cy="208" r="18" /><circle cx="500" cy="212" r="16" /><circle cx="330" cy="214" r="14" /></g>
    </svg>
  );
}

export function Target({ size = 150 }: { size?: number }) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} aria-hidden="true">
      <ellipse cx="76" cy="148" rx="48" ry="8" fill="#5a1fd0" opacity=".18" />
      <circle cx="74" cy="84" r="60" fill="url(#g-violet)" /><circle cx="74" cy="84" r="46" fill="#fff" /><circle cx="74" cy="84" r="34" fill="url(#g-violet)" /><circle cx="74" cy="84" r="21" fill="#fff" /><circle cx="74" cy="84" r="11" fill="url(#g-violet)" />
      <path d="m76 82 50-50" stroke="#f08a1c" strokeWidth="6" strokeLinecap="round" /><path d="m118 40-2-18 18-18 4 16 16 4-18 18z" fill="url(#g-gold)" stroke="#e07c12" strokeWidth="2" strokeLinejoin="round" /><path d="m72 86 14-5-9-9z" fill="#e07c12" />
    </svg>
  );
}

export function Robot({ size = 84 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <ellipse cx="60" cy="113" rx="34" ry="5" fill="#5a1fd0" opacity=".2" /><path d="M60 26V12" stroke="#5b3bd6" strokeWidth="5" /><circle cx="60" cy="10" r="7" fill="#7b5cf0" />
      <rect x="6" y="52" width="14" height="30" rx="7" fill="#6d4be8" /><rect x="100" y="52" width="14" height="30" rx="7" fill="#6d4be8" />
      <rect x="14" y="26" width="92" height="74" rx="34" fill="url(#g-violet)" /><rect x="14" y="26" width="92" height="74" rx="34" fill="#8fa2ff" opacity=".28" />
      <rect x="24" y="42" width="72" height="46" rx="22" fill="#1a1550" /><ellipse cx="45" cy="62" rx="7" ry="9" fill="#8fe6ff" /><ellipse cx="75" cy="62" rx="7" ry="9" fill="#8fe6ff" /><circle cx="47" cy="59" r="2.6" fill="#fff" /><circle cx="77" cy="59" r="2.6" fill="#fff" /><path d="M52 76q8 6 16 0" stroke="#8fe6ff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M44 100h32l-6 10H50z" fill="#4c22b8" />
    </svg>
  );
}

export function Cap({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 80" width={size} height={size * 0.8} aria-hidden="true">
      <path d="M24 38v22c8 14 44 14 52 0V38L50 50z" fill="#e8920f" /><path d="M2 30 50 8l48 22-48 22z" fill="url(#g-gold)" /><path d="M2 30 50 52l48-22v5L50 57 2 35z" fill="#d17e08" /><path d="M88 34v28" stroke="#ffc945" strokeWidth="4" strokeLinecap="round" /><path d="M84 60h8l3 14H81z" fill="#ffc945" />
    </svg>
  );
}

export const FlaskArt = () => (
  <svg viewBox="0 0 64 64" width="60" height="60" aria-hidden="true"><path d="M24 4h16v4h-3v16l17 28a6 6 0 0 1-5 8H15a6 6 0 0 1-5-8l17-28V8h-3z" fill="#c9efff" /><path d="m20 36-9 16a5 5 0 0 0 4 7h34a5 5 0 0 0 4-7l-9-16c-8 4-14-4-24 0z" fill="url(#g-flask)" /><circle cx="28" cy="46" r="3" fill="#fff" opacity=".8" /><circle cx="37" cy="51" r="2" fill="#fff" opacity=".8" /></svg>
);
export const BarsArt = () => (
  <svg viewBox="0 0 64 64" width="60" height="60" aria-hidden="true"><rect x="4" y="34" width="14" height="24" rx="3" fill="url(#g-flask)" /><rect x="24" y="20" width="14" height="38" rx="3" fill="#4aa3f8" /><rect x="44" y="6" width="14" height="52" rx="3" fill="#2f7ff0" /></svg>
);
export const PaletteArt = () => (
  <svg viewBox="0 0 64 64" width="60" height="60" aria-hidden="true"><path d="M32 5C15 5 4 17 4 32s12 27 27 27c6 0 8-5 5-9-3-5 0-9 5-9h8c7 0 11-5 11-12C60 15 48 5 32 5z" fill="url(#g-gold)" /><circle cx="18" cy="32" r="5" fill="#fff" /><circle cx="25" cy="18" r="5" fill="#f0567e" /><circle cx="41" cy="17" r="5" fill="#7a3df0" /><circle cx="50" cy="28" r="5" fill="#35b4f5" /></svg>
);
