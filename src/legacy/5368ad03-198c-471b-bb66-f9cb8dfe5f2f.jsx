// tickets.jsx — support inbox: mail-style list + conversation thread inside the profile panel.

const _tk = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const TKI = {
  search: (p) => (<svg viewBox="0 0 24 24" {..._tk} {...p}><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>),
  reply: (p) => (<svg viewBox="0 0 24 24" {..._tk} {...p}><path d="M9 7 4 12l5 5"/><path d="M4 12h9a6 6 0 0 1 6 6v1"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" {..._tk} {...p}><circle cx="12" cy="12" r="9"/><path d="m8.4 12.3 2.5 2.5 4.7-5"/></svg>),
  reopen: (p) => (<svg viewBox="0 0 24 24" {..._tk} {...p}><path d="M4 12a8 8 0 1 1 2.6 5.9"/><path d="M4 19v-5h5"/></svg>),
  down: (p) => (<svg viewBox="0 0 24 24" {..._tk} {...p}><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg>),
  clip: (p) => (<svg viewBox="0 0 24 24" {..._tk} {...p}><path d="M18 11.5 12.2 17.3a4 4 0 0 1-5.7-5.7l7-7a2.8 2.8 0 0 1 4 4l-7 7a1.6 1.6 0 0 1-2.3-2.3l6.2-6.2"/></svg>),
  send: (p) => (<svg viewBox="0 0 24 24" {..._tk} {...p}><path d="M20 4 3.5 10.6a.5.5 0 0 0 .05.94L10 13.2l1.7 6.4a.5.5 0 0 0 .93.1L20 4Z"/><path d="M20 4 10 13.2"/></svg>),
  file: (p) => (<svg viewBox="0 0 24 24" {..._tk} {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" {..._tk} {...p}><path d="M12 5v14M5 12h14"/></svg>),
};

const TK_AGENTS = {
  lotte: { name: 'Lotte Meijer', role: 'Account desk', ini: 'LM', hue: 'plum' },
  sander: { name: 'Sander de Vries', role: 'Logistics', ini: 'SV', hue: 'sage' },
  nadia: { name: 'Nadia el Amrani', role: 'Finance', ini: 'NA', hue: 'sky' },
};
const TK_ME = { name: 'You', role: 'Test Account Flowers B.V.', ini: 'TA', hue: 'sand' };

const TK_TICKETS = [
  {
    id: 'T-2455', subj: 'Clock prices missing for Rosa Avalanche+', order: 'PPF-10588', opened: '2 Aug 2026',
    last: '09:14', status: 'Awaiting your reply', tone: 'amber', unread: true, agent: TK_AGENTS.lotte,
    msgs: [
      { who: 'me', time: '1 Aug · 16:40', body: ['Since yesterday the clock price column is empty for Rosa Avalanche+ on the 60cm grade. Other Rosa varieties show fine. We price our webshop off that column, so we are quoting blind this morning.'] },
      { who: 'agent', time: '2 Aug · 08:02', body: ['Thanks for flagging this — the grade was renamed at the auction on Friday (60cm became 60/70cm) and our mapping still pointed at the old code. I have queued a re-import for that variety.', 'Can you confirm you only trade the 60cm grade, or should I map 50cm as well while I am in there?'] },
      { who: 'agent', time: '2 Aug · 09:14', body: ['Re-import finished. Prices are back for both grades from the 08:30 clock onward. Leaving this open until you confirm the webshop picks them up.'] },
    ],
  },
  {
    id: 'T-2431', subj: 'Add second delivery address (Utrecht shop)', order: '—', opened: '28 Jul 2026',
    last: '28 Jul', status: 'In progress', tone: 'blue', unread: false, agent: TK_AGENTS.sander,
    msgs: [
      { who: 'me', time: '28 Jul · 11:05', body: ['We are opening a second location on Oudegracht in Utrecht from 1 September. Could you add it as a delivery address so we can split a single order over both shops?'] },
      { who: 'agent', time: '28 Jul · 14:22', body: ['Added to your account as a secondary address. Split delivery over two stops needs a route check first — Utrecht sits on the 06:30 run, so a same-morning drop is realistic but not guaranteed before 1 September.', 'I will come back once planning confirms the slot.'], atts: [{ n: 'route-check-utrecht.pdf', s: '184 KB' }] },
    ],
  },
  {
    id: 'T-2418', subj: 'Missing 2 boxes on order PPF-10432', order: 'PPF-10432', opened: '18 Jul 2026',
    last: '19 Jul', status: 'Resolved', tone: 'green', unread: false, agent: TK_AGENTS.sander,
    msgs: [
      { who: 'me', time: '18 Jul · 07:12', body: ['Delivery arrived at 06:40 with 14 boxes on the note but 12 on the cart. Missing are the two boxes of Hydrangea Magical Revolution. Photo of the pallet attached.'], atts: [{ n: 'pallet-0718.jpg', s: '1.2 MB' }] },
      { who: 'agent', time: '18 Jul · 09:48', body: ['Confirmed against the loading scan — two boxes stayed behind at the Aalsmeer hub. They go out on tomorrow morning\'s run at no charge, and the credit for today is already on your account.'] },
      { who: 'agent', time: '19 Jul · 07:30', body: ['Both boxes delivered this morning. Closing this one — reopen it if the count is still off.'] },
    ],
  },
  {
    id: 'T-2371', subj: 'Change standing delivery day to Thursday', order: '—', opened: '2 Jul 2026',
    last: '3 Jul', status: 'Resolved', tone: 'green', unread: false, agent: TK_AGENTS.sander,
    msgs: [
      { who: 'me', time: '2 Jul · 13:20', body: ['Our quiet day moved, so Wednesday deliveries no longer work. Can the standing order shift to Thursday from week 29?'] },
      { who: 'agent', time: '3 Jul · 08:11', body: ['Done — your standing order now runs Thursdays from week 29. Cut-off stays 22:00 the evening before.'] },
    ],
  },
  {
    id: 'T-2290', subj: 'Invoice copy for May statement', order: '—', opened: '14 Jun 2026',
    last: '14 Jun', status: 'Closed', tone: 'gray', unread: false, agent: TK_AGENTS.nadia,
    msgs: [
      { who: 'me', time: '14 Jun · 10:02', body: ['Our bookkeeper needs a duplicate of the May statement — the original never reached the accounts mailbox.'] },
      { who: 'agent', time: '14 Jun · 10:39', body: ['Attached, and I added accounts@ as a second recipient so future statements land there automatically.'], atts: [{ n: 'statement-2026-05.pdf', s: '96 KB' }] },
    ],
  },
];

const TK_OPEN = ['Awaiting your reply', 'Awaiting our reply', 'In progress'];

function PfTickets({ onNavigate }) {
  const { useState, useMemo, useRef, useEffect } = React;
  const [sel, setSel] = useState(TK_TICKETS[0].id);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [read, setRead] = useState({});
  const [extra, setExtra] = useState({});
  const [override, setOverride] = useState({});
  const [draft, setDraft] = useState('');
  const threadRef = useRef(null);

  const withState = (t) => Object.assign({}, t, override[t.id] || {}, { unread: t.unread && !read[t.id] });
  const all = TK_TICKETS.map(withState);
  const counts = { all: all.length, open: all.filter((t) => TK_OPEN.includes(t.status)).length, done: all.filter((t) => !TK_OPEN.includes(t.status)).length };

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter((t) => {
      if (filter === 'open' && !TK_OPEN.includes(t.status)) return false;
      if (filter === 'done' && TK_OPEN.includes(t.status)) return false;
      if (!needle) return true;
      return (t.subj + ' ' + t.id + ' ' + t.order + ' ' + t.agent.name).toLowerCase().includes(needle);
    });
  }, [q, filter, read, override]);

  const active = all.find((t) => t.id === sel) || list[0] || all[0];
  const msgs = active ? active.msgs.concat(extra[active.id] || []) : [];
  const open = active ? TK_OPEN.includes(active.status) : false;

  useEffect(() => { if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight; }, [sel, (extra[sel] || []).length]);

  const pick = (t) => { setSel(t.id); setRead((r) => Object.assign({}, r, { [t.id]: true })); setDraft(''); };
  const setStatus = (status, tone) => setOverride((o) => Object.assign({}, o, { [active.id]: { status, tone } }));
  const send = () => {
    const v = draft.trim();
    if (!v || !active) return;
    const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' · ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setExtra((e) => Object.assign({}, e, { [active.id]: (e[active.id] || []).concat([{ who: 'me', time: now, body: v.split(/\n{2,}/) }]) }));
    setStatus('Awaiting our reply', 'blue');
    setDraft('');
  };

  return (
    <React.Fragment>
      <div className="pf-panel-h">
        <h2 className="pf-headline">Past tickets</h2>
        <button className="pf-edit" onClick={() => onNavigate && onNavigate('support')}>{TKI.plus({})} New ticket</button>
      </div>

      <div className="tk-shell">
        <div className="tk-list">
          <div className="tk-list-top">
            <label className="tk-search">{TKI.search({})}<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tickets, orders, people" /></label>
            <div className="tk-filters">
              {[['all', 'All', counts.all], ['open', 'Open', counts.open], ['done', 'Resolved', counts.done]].map(([k, label, n]) => (
                <button key={k} className={`tk-chip ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{label}<i>{n}</i></button>
              ))}
            </div>
          </div>
          <ul className="tk-items">
            {list.map((t) => {
              const preview = (t.msgs.concat(extra[t.id] || [])).slice(-1)[0].body[0];
              return (
                <li key={t.id}>
                  <button className={`tk-item ${t.id === (active && active.id) ? 'on' : ''} ${t.unread ? 'new' : ''}`} onClick={() => pick(t)}>
                    <span className={`tk-av ${t.agent.hue}`}>{t.agent.ini}</span>
                    <span className="tk-it-tx">
                      <span className="tk-it-top"><b>{t.agent.name}</b><i>{t.last}</i></span>
                      <span className="tk-it-sub">{t.subj}</span>
                      <span className="tk-it-prev">{preview}</span>
                      <span className="tk-it-foot"><span className={`ord-pill ${t.tone}`}><span className="d" />{t.status}</span><span className="tk-it-id">{t.id}</span></span>
                    </span>
                  </button>
                </li>
              );
            })}
            {!list.length && <li className="tk-empty">No tickets match “{q}”.</li>}
          </ul>
        </div>

        {active && (
          <div className="tk-read">
            <header className="tk-read-h">
              <div className="tk-read-top">
                <div className="tk-read-ttl">
                  <h3>{active.subj}</h3>
                  <p className="tk-read-meta">{active.id} · {active.order !== '—' ? <React.Fragment>order <b>{active.order}</b> · </React.Fragment> : null}opened {active.opened} · handled by {active.agent.name}</p>
                </div>
                <span className={`ord-pill lg ${active.tone}`}><span className="d" />{active.status}</span>
              </div>
              <div className="tk-acts">
                <button className="tk-act prim" onClick={() => { const el = document.querySelector('.tk-reply textarea'); if (el) el.focus(); }}>{TKI.reply({})} Reply</button>
                {open
                  ? <button className="tk-act" onClick={() => setStatus('Resolved', 'green')}>{TKI.check({})} Mark resolved</button>
                  : <button className="tk-act" onClick={() => setStatus('In progress', 'blue')}>{TKI.reopen({})} Reopen</button>}
                <button className="tk-act">{TKI.down({})} Transcript</button>
              </div>
            </header>

            <div className="tk-thread" ref={threadRef}>
              {msgs.map((m, i) => {
                const p = m.who === 'me' ? TK_ME : active.agent;
                return (
                  <article key={i} className={`tk-msg ${m.who === 'me' ? 'me' : ''}`}>
                    <span className={`tk-av ${p.hue}`}>{p.ini}</span>
                    <div className="tk-msg-card">
                      <div className="tk-msg-h"><b>{p.name}</b><span>{p.role}</span><i>{m.time}</i></div>
                      {m.body.map((par, j) => <p key={j}>{par}</p>)}
                      {m.atts && (
                        <div className="tk-atts">
                          {m.atts.map((a) => (
                            <button key={a.n} className="tk-att">{TKI.file({})}<span>{a.n}</span><i>{a.s}</i></button>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="tk-reply">
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Reply to ${active.agent.name.split(' ')[0]}…`} />
              <div className="tk-reply-foot">
                <button className="tk-act sm">{TKI.clip({})} Attach file</button>
                <span className="tk-reply-hint">Replies reach the desk in minutes on weekdays, 06:00–17:00 CET.</span>
                <button className="tk-send" onClick={send} disabled={!draft.trim()} style={!draft.trim() ? { opacity: .4, cursor: 'default' } : {}}>Send {TKI.send({})}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { PfTickets, TKI });
