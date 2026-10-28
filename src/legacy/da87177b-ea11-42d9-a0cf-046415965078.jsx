// topups.jsx — top-up history: balance hero + credit ledger with running balance.

const _tp = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const TPI = {
  search: (p) => (<svg viewBox="0 0 24 24" {..._tp} {...p}><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" {..._tp} {...p}><path d="M12 5v14M5 12h14"/></svg>),
  down: (p) => (<svg viewBox="0 0 24 24" {..._tp} {...p}><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg>),
  bolt: (p) => (<svg viewBox="0 0 24 24" {..._tp} {...p}><path d="M13 3 5.5 13.2h5.2L10 21l7.6-10.2h-5.2z"/></svg>),
  bank: (p) => (<svg viewBox="0 0 24 24" {..._tp} {...p}><path d="M4 10h16M5.5 10v7M10 10v7M14 10v7M18.5 10v7M3.5 20h17M12 3.5 20 8H4z"/></svg>),
  clock: (p) => (<svg viewBox="0 0 24 24" {..._tp} {...p}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>),
};

const TU_ROWS = [
  { id: 'TU-0093', date: '28 Jul 2026', month: 'July 2026', method: 'Revolut', kind: 'instant', amount: 2200, status: 'Pending', tone: 'amber', note: 'Clears within the hour' },
  { id: 'TU-0091', date: '21 Jul 2026', month: 'July 2026', method: 'Revolut', kind: 'instant', amount: 2500, status: 'Cleared', tone: 'green', note: 'Reference PPF-TA-2107' },
  { id: 'TU-0088', date: '7 Jul 2026', month: 'July 2026', method: 'Bank transfer', kind: 'sepa', amount: 1800, status: 'Cleared', tone: 'green', note: 'ING · NL21 INGB 0004 5678 21' },
  { id: 'TU-0084', date: '24 Jun 2026', month: 'June 2026', method: 'Revolut', kind: 'instant', amount: 3200, status: 'Cleared', tone: 'green', note: 'Reference PPF-TA-2406' },
  { id: 'TU-0079', date: '9 Jun 2026', month: 'June 2026', method: 'Bank transfer', kind: 'sepa', amount: 1500, status: 'Cleared', tone: 'green', note: 'ING · NL21 INGB 0004 5678 21' },
  { id: 'TU-0072', date: '27 May 2026', month: 'May 2026', method: 'Bank transfer', kind: 'sepa', amount: 2000, status: 'Cleared', tone: 'green', note: 'Opening deposit' },
];

function tpEuro(n, dec) {
  return '\u20AC\u00A0' + Number(n).toLocaleString('nl-NL', { minimumFractionDigits: dec === 0 ? 0 : 2, maximumFractionDigits: dec === 0 ? 0 : 2 });
}

function TopupsView({ balance, onTopUp }) {
  const { useState, useMemo } = React;
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  const counts = { all: TU_ROWS.length, instant: TU_ROWS.filter((r) => r.kind === 'instant').length, sepa: TU_ROWS.filter((r) => r.kind === 'sepa').length };
  const total = TU_ROWS.filter((r) => r.status === 'Cleared').reduce((s, r) => s + r.amount, 0);
  const avg = Math.round(total / TU_ROWS.filter((r) => r.status === 'Cleared').length);
  const pending = TU_ROWS.filter((r) => r.status === 'Pending').reduce((s, r) => s + r.amount, 0);

  /* running balance: walk backwards from today's balance so each row shows the balance it produced */
  const withRunning = useMemo(() => {
    let run = balance;
    return TU_ROWS.map((r) => { const after = run; if (r.status === 'Cleared') run -= r.amount; return Object.assign({}, r, { after }); });
  }, [balance]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return withRunning.filter((r) => {
      if (filter !== 'all' && r.kind !== filter) return false;
      if (!needle) return true;
      return (r.id + ' ' + r.method + ' ' + r.note + ' ' + r.date).toLowerCase().includes(needle);
    });
  }, [q, filter, withRunning]);

  const groups = [];
  rows.forEach((r) => { const g = groups[groups.length - 1]; if (g && g.month === r.month) g.items.push(r); else groups.push({ month: r.month, items: [r] }); });

  return (
    <React.Fragment>
      <div className="pf-panel-h">
        <h2 className="pf-headline">Top-up history</h2>
      </div>

      <div className="tp-hero">
        <div className="tp-bal">
          <div className="tp-bal-tx">
            <span>Account balance</span>
            <b>{tpEuro(balance)}</b>
          </div>
          <div className="tp-bal-acts">
            <button className="tp-cta" onClick={onTopUp}>{TPI.plus({})} Top up balance</button>
            <button className="tp-ghost">{TPI.down({})} Statement</button>
          </div>
        </div>
      </div>

      <div className="bl-shell">
        <div className="bl-bar">
          <label className="tk-search">{TPI.search({})}<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reference or method" /></label>
        </div>

        <div className="tp-head">
          <span>Method</span><span>Date</span><span>Status</span><span className="r">Amount</span><span className="r">Balance after</span><span />
        </div>

        {groups.map((g) => (
          <div key={g.month}>
            <div className="bl-month">{g.month}<i>+ {tpEuro(g.items.reduce((s, r) => s + r.amount, 0))}</i></div>
            {g.items.map((r) => (
              <div className="tp-row" key={r.id}>
                <span className="tp-m">
                  <span className={`tp-ic ${r.kind}`}>{r.kind === 'instant' ? TPI.bolt({}) : TPI.bank({})}</span>
                  <span className="tp-mtx"><b>{r.method}{r.kind === 'instant' ? ' · instant' : ''}</b><i>{r.id} · {r.note}</i></span>
                </span>
                <span className="bl-dim">{r.date}</span>
                <span><span className={`ord-pill ${r.tone}`}><span className="d" />{r.status}</span></span>
                <span className="tp-amt">+ {tpEuro(r.amount)}</span>
                <span className="tp-after">{r.status === 'Cleared' ? tpEuro(r.after) : '—'}</span>
                <button className="pf-dl" aria-label={`Receipt ${r.id}`} title="Download receipt">{TPI.down({})}</button>
              </div>
            ))}
          </div>
        ))}
        {!rows.length && <div className="tk-empty">No top-ups match “{q}”.</div>}
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { TopupsView });
