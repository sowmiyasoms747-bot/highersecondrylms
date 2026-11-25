import { Send, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Empty, Title } from '../components/ui';
import { SUBJECT_NAMES } from '../data/subjects';
import { fmtDate, today, uid, useApp, useSession } from '../state';

export function MentorPage() {
  const app = useApp();
  const { patch, setToast } = useSession();
  const [subject, setSubject] = useState('Career guidance');
  const [text, setText] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (t.length < 10) { setToast('Write a little more so a mentor can help'); return; }
    patch((d) => ({ mentor: [{ id: uid(), subject, text: t, at: today() }, ...d.mentor] }));
    setText('');
    setToast('Question saved');
  };
  return (
    <>
      <Title>Ask a Mentor</Title>
      <form className="card pad form" onSubmit={submit}>
        <label>Topic<select value={subject} onChange={(e) => setSubject(e.target.value)}>{['Career guidance', 'Exam strategy', 'Study habits', ...app.subjects.map((s) => SUBJECT_NAMES[s])].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>Your question<textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your question here" maxLength={1000} /></label>
        <div><button className="btn">Submit Question <Send size={19} /></button></div>
      </form>
      <h2 className="mt">My questions</h2>
      <div className="rows">
        {app.data.mentor.map((m) => <div className="row-card" key={m.id}><span className="grow"><b>{m.text}</b><small>{m.subject} – {fmtDate(m.at)}</small></span><span className="pill amber">Awaiting reply</span><button onClick={() => patch((d) => ({ mentor: d.mentor.filter((x) => x.id !== m.id) }))} aria-label="Remove question"><Trash2 size={20} /></button></div>)}
        {!app.data.mentor.length && <Empty title="No questions yet" />}
      </div>
    </>
  );
}
