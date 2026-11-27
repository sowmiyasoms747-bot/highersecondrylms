import { CalendarPlus, Check, Video } from 'lucide-react';
import { Empty, Title } from '../components/ui';
import { SUBJECT_NAMES } from '../data/subjects';
import { dayPlus, fmtDate, today, useApp, useSession } from '../state';

/** Class start times, one subject per slot. */
const SLOTS = ['16:00', '17:30', '19:00'];
const MINUTES = 60;

const fmtTime = (t: string) => new Date(`2000-01-01T${t}`).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });

/** Timetable for the next 7 days, built from the student's subjects and the next chapter in each. */
export function LivePage() {
  const app = useApp();
  const { setToast } = useSession();
  const now = new Date();
  const clock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const classes = [0, 1, 2, 3, 4, 5, 6].flatMap((d) => {
    const date = dayPlus(d);
    if (new Date(`${date}T00:00`).getDay() === 0) return []; // no classes on Sunday
    return SLOTS.map((time, i) => {
      const sid = app.subjects[(d * SLOTS.length + i) % app.subjects.length];
      const n = app.next(sid);
      return { id: `${date}-${time}`, date, time, sid, n, chapter: app.chapters(sid)[n - 1] };
    });
  }).filter((c) => c.date !== today() || addMin(c.time, MINUTES) > clock);

  const title = (c: (typeof classes)[number]) => `Live class: ${SUBJECT_NAMES[c.sid]} – ${c.chapter} (${fmtTime(c.time)})`;
  const added = (c: (typeof classes)[number]) => app.data.tasks.some((t) => t.date === c.date && t.title === title(c));
  const remind = (c: (typeof classes)[number]) => {
    app.addTask({ date: c.date, title: title(c), minutes: MINUTES });
    setToast('Added to your study planner');
  };
  const days = [...new Set(classes.map((c) => c.date))];

  return (
    <>
      <Title>Live Classes</Title>
      <p className="lead">Live sessions on the next chapter in each of your subjects. Add a class to your planner so you don’t miss it.</p>
      {days.map((date) => (
        <section key={date} className="mt-s">
          <h2>{date === today() ? 'Today' : date === dayPlus(1) ? 'Tomorrow' : fmtDate(date)}</h2>
          <div className="rows">
            {classes.filter((c) => c.date === date).map((c) => {
              const live = c.date === today() && c.time <= clock;
              return (
                <div className="row-card" key={c.id}>
                  <Video size={26} />
                  <span className="grow"><b>{SUBJECT_NAMES[c.sid]}: {c.chapter}</b><small>Chapter {c.n} – {fmtTime(c.time)} to {fmtTime(addMin(c.time, MINUTES))}</small></span>
                  {live
                    ? <span className="pill red">Live now</span>
                    : added(c)
                      ? <span className="pill green"><Check size={15} /> In planner</span>
                      : <button className="chip" onClick={() => remind(c)} aria-label="Add to planner"><CalendarPlus size={17} /><span>Add to planner</span></button>}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      {!days.length && <Empty title="No live classes scheduled" />}
    </>
  );
}

function addMin(t: string, m: number) {
  const [h, min] = t.split(':').map(Number);
  const total = h * 60 + min + m;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
