// billing.jsx — billing history: statement summary + expandable invoice ledger.

const _bl = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const BLI = {
  search: (p) => (<svg viewBox="0 0 24 24" {..._bl} {...p}><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>),
  down: (p) => (<svg viewBox="0 0 24 24" {..._bl} {...p}><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg>),
  clock: (p) => (<svg viewBox="0 0 24 24" {..._bl} {...p}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>),
  chev: (p) => (<svg viewBox="0 0 24 24" {..._bl} {...p}><path d="m6 9 6 6 6-6"/></svg>),
  export: (p) => (<svg viewBox="0 0 24 24" {..._bl} {...p}><path d="M12 20V9m0 0-4 4m4-4 4 4M5 5h14"/></svg>),
  card: (p) => (<svg viewBox="0 0 24 24" {..._bl} {...p}><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10.5h18"/></svg>),
};

const BL_INVOICES = [
  { id: 'INV-2026-0714', date: '14 Jul 2026', month: 'July 2026', due: '28 Jul 2026', period: 'Week 28', amount: 6840.5, status: 'Paid', tone: 'green', paid: '22 Jul · Bank transfer',
    lines: [['PPF-10521', 'Rosa Avalanche+ · 12 boxes', 2410.0], ['PPF-10528', 'Tulipa mix · 9 boxes', 1685.5], ['PPF-10534', 'Hydrangea Magical · 6 boxes', 1920.0], ['PPF-10540', 'Greenery assortment', 825.0]] },
  { id: 'INV-2026-0707', date: '7 Jul 2026', month: 'July 2026', due: '21 Jul 2026', period: 'Week 27', amount: 4215.0, status: 'Paid', tone: 'green', paid: '15 Jul · Revolut',
    lines: [['PPF-10488', 'Rosa Red Naomi · 10 boxes', 2240.0], ['PPF-10495', 'Eustoma mix · 7 boxes', 1180.0], ['PPF-10502', 'Foliage & sundries', 795.0]] },
  { id: 'INV-2026-0630', date: '30 Jun 2026', month: 'June 2026', due: '14 Aug 2026', period: 'Week 26', amount: 7930.25, status: 'Open', tone: 'amber', paid: '',
    lines: [['PPF-10442', 'Rosa Avalanche+ · 15 boxes', 3015.25], ['PPF-10450', 'Peony Sarah Bernhardt · 8 boxes', 2460.0], ['PPF-10457', 'Hydrangea Magical · 5 boxes', 1600.0], ['PPF-10461', 'Packaging & transport', 855.0]] },
  { id: 'INV-2026-0623', date: '23 Jun 2026', month: 'June 2026', due: '7 Jul 2026', period: 'Week 25', amount: 2480.0, status: 'Paid', tone: 'green', paid: '2 Jul · Bank transfer',
    lines: [['PPF-10418', 'Tulipa mix · 8 boxes', 1490.0], ['PPF-10424', 'Greenery assortment', 990.0]] },
  { id: 'INV-2026-0616', date: '16 Jun 2026', month: 'June 2026', due: '30 Jun 2026', period: 'Week 24', amount: 5312.75, status: 'Paid', tone: 'green', paid: '27 Jun · Revolut',
    lines: [['PPF-10388', 'Rosa Red Naomi · 14 boxes', 3136.0], ['PPF-10394', 'Eustoma mix · 6 boxes', 1010.75], ['PPF-10399', 'Packaging & transport', 1166.0]] },
  { id: 'INV-2026-0526', date: '26 May 2026', month: 'May 2026', due: '9 Jun 2026', period: 'Week 21', amount: 3145.4, status: 'Paid', tone: 'green', paid: '5 Jun · Bank transfer',
    lines: [['PPF-10302', 'Opening order · mixed assortment', 2680.4], ['PPF-10308', 'Buckets & sleeves', 465.0]] },
];

function blEuro(n, dec) {
  return '\u20AC\u00A0' + Number(n).toLocaleString('nl-NL', { minimumFractionDigits: dec === 0 ? 0 : 2, maximumFractionDigits: dec === 0 ? 0 : 2 });
}

function BillingView() {
  const { useState, useMemo } = React;
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);

  const counts = {
    all: BL_INVOICES.length,
    open: BL_INVOICES.filter((i) => i.status === 'Open').length,
    paid: BL_INVOICES.filter((i) => i.status === 'Paid').length,
  };
  const outstanding = BL_INVOICES.filter((i) => i.status === 'Open').reduce((s, i) => s + i.amount, 0);
  const paidYtd = BL_INVOICES.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return BL_INVOICES.filter((i) => {
      if (filter === 'open' && i.status !== 'Open') return false;
      if (filter === 'paid' && i.status !== 'Paid') return false;
      if (!needle) return true;
      return (i.id + ' ' + i.period + ' ' + i.month + ' ' + i.lines.map((l) => l[0] + ' ' + l[1]).join(' ')).toLowerCase().includes(needle);
    });
  }, [q, filter]);

  const groups = [];
  rows.forEach((i) => {
    const g = groups[groups.length - 1];
    if (g && g.month === i.month) g.items.push(i); else groups.push({ month: i.month, items: [i] });
  });

  return (
    <React.Fragment>
      <div className="pf-panel-h">
        <h2 className="pf-headline">Billing history</h2>
      </div>

      <div className="bl-due">
        <span className="bl-due-ic">{BLI.clock({})}</span>
        <div className="bl-due-tx">
          <span>Outstanding</span>
          <b>{blEuro(outstanding)}</b>
        </div>
        <p className="bl-due-meta">INV-2026-0630 · Week 26 · payable by <b>14 Aug 2026</b></p>
        <div className="bl-due-acts">
          <button className="bl-pay">Pay now</button>
          <button className="tk-act" onClick={() => setOpen('INV-2026-0630')}>View invoice</button>
        </div>
      </div>

      <div className="bl-shell">
        <div className="bl-bar">
          <label className="tk-search">{BLI.search({})}<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invoice, week or order" /></label>
          <div className="tk-filters">
            {[['all', 'All', counts.all], ['open', 'Open', counts.open], ['paid', 'Paid', counts.paid]].map(([k, label, n]) => (
              <button key={k} className={`tk-chip ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{label}<i>{n}</i></button>
            ))}
          </div>
        </div>

        <div className="bl-head">
          <span>Invoice</span><span>Issued</span><span>Period</span><span>Due</span><span className="r">Amount</span><span>Status</span><span />
        </div>

        {groups.map((g) => (
          <div className="bl-group" key={g.month}>
            <div className="bl-month">{g.month}<i>{blEuro(g.items.reduce((s, i) => s + i.amount, 0))}</i></div>
            {g.items.map((i) => (
              <div className={`bl-rowwrap ${open === i.id ? 'on' : ''}`} key={i.id}>
                <div className="bl-row" onClick={() => setOpen(open === i.id ? null : i.id)}>
                  <span className="bl-id"><i className={`bl-chev ${open === i.id ? 'on' : ''}`}>{BLI.chev({})}</i>{i.id}</span>
                  <span className="bl-dim">{i.date}</span>
                  <span className="bl-dim">{i.period} · {i.lines.length} orders</span>
                  <span className="bl-dim">{i.due}</span>
                  <span className="bl-amt">{blEuro(i.amount)}</span>
                  <span><span className={`ord-pill ${i.tone}`}><span className="d" />{i.status}</span></span>
                  <button className="pf-dl" aria-label={`Download ${i.id}`} title="Download PDF" onClick={(e) => e.stopPropagation()}>{BLI.down({})}</button>
                </div>
                {open === i.id && (
                  <div className="bl-detail">
                    <ul className="bl-lines">
                      {i.lines.map((l) => (
                        <li key={l[0]}><b>{l[0]}</b><span>{l[1]}</span><i>{blEuro(l[2])}</i></li>
                      ))}
                    </ul>
                    <div className="bl-detail-foot">
                      <span className="bl-paid">{BLI.card({})}{i.paid ? `Paid ${i.paid}` : `Open · payable by ${i.due}`}</span>
                      <span className="bl-total">Total incl. VAT <b>{blEuro(i.amount)}</b></span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        {!rows.length && <div className="tk-empty">No invoices match “{q}”.</div>}
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { BillingView, BLI });
