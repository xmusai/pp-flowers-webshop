// profile.jsx — My profile: complete-your-profile onboarding nudge, past tickets, top-up history.

const _pf = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const PFI = {
  user: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>),
  ticket: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4z"/><path d="M13 6v12"/></svg>),
  wallet: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M16.5 14.5h1.5"/></svg>),
  doc: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 16.5h4"/></svg>),
  down: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><circle cx="12" cy="12" r="9"/><path d="m8.4 12.3 2.5 2.5 4.7-5"/></svg>),
  dot: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><circle cx="12" cy="12" r="9"/></svg>),
  fwd: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="m9 5 7 7-7 7"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="M12 5v14M5 12h14"/></svg>),
};

const PF_DONE = ['address', 'business', 'services'];

const PF_BENEFITS = [
  ['Order without limits', 'Verified accounts unlock the full auction assortment and higher order volumes.'],
  ['Pay on account', 'Signed agreements get 14-day payment terms instead of prepayment.'],
  ['Faster delivery slots', 'Transport preferences let us book your route before the morning clock starts.'],
  ['Correct paperwork', 'VAT, customs and phyto documents are generated automatically for every order.'],
];

function pfEuro(n) { return '\u20AC\u00A0' + Number(n).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

/* the profile flow is a demo: every step arrives pre-answered so it can be walked through */
const PF_SEED = {
  street: 'Legmeerdijk', houseNo: '313', postal: '1431 GB', city: 'Aalsmeer', country: 'Netherlands',
  idFile: 'passport-scan.pdf',
  businessName: 'Test Account Flowers B.V.', vat: 'NL0093 4567 B01', legalForm: 'B.V.', industry: 'Florist / retail',
  services: ['Cut flowers', 'Plants'],
  packaging: 'Boxes', transport: 'ppflowers', carrier: '',
  trade: 'cross', eori: 'NL809345671', incoterm: 'DAP',
  signature: 'T. Account', accept: true,
};

/* confetti burst: fixed spread so the celebration lands the same way every time */
const PF_CONFETTI = (() => {
  const cols = ['var(--accent)', '#E6C247', '#7BA05B', '#E48AAE', '#5E84B8', '#EBB07A'];
  return Array.from({ length: 34 }, (_, i) => {
    const a = (i / 34) * Math.PI * 2 + (i % 3) * 0.22;
    const dist = 108 + ((i * 37) % 86);
    const round = i % 4 === 0;
    return {
      x: Math.round(Math.cos(a) * dist),
      y: Math.round(Math.sin(a) * dist * 0.82) - 26,
      r: Math.round(((i * 97) % 360) - 180),
      d: +(0.62 + ((i * 13) % 9) * 0.03).toFixed(2),
      c: cols[i % cols.length],
      w: round ? 7 : 6, h: round ? 7 : 11, round,
    };
  });
})();

/* the real Account Verification flow, embedded in the profile panel */
function PfOnboarding() {
  const { useState } = React;
  const STEPS = window.STEPS || [];
  const [step, setStep] = useState(() => { const i = STEPS.findIndex((s) => !PF_DONE.includes(s.id)); return i < 0 ? 0 : i; });
  const [data, setData] = useState(() => Object.assign({}, window.DEFAULT_DATA, PF_SEED));
  const [done, setDone] = useState(() => { const o = {}; PF_DONE.forEach((id) => { o[id] = true; }); return o; });
  const [finished, setFinished] = useState(false);
  const set = (k, v) => setData((d) => Object.assign({}, d, { [k]: v }));
  const meta = STEPS[step];
  if (!meta || !window.STEP_BODIES) return null;
  const valid = window.isStepValid ? window.isStepValid(meta.id, data) : true;
  const nDone = STEPS.filter((s) => done[s.id]).length;
  const pct = STEPS.length ? Math.round((nDone / STEPS.length) * 100) : 0;
  const onContinue = () => {
    if (!valid) return;
    setDone((p) => Object.assign({}, p, { [meta.id]: true }));
    if (step === STEPS.length - 1) { setFinished(true); return; }
    setStep((s) => s + 1);
  };

  return (
    <React.Fragment>
      <div className="pf-panel-h">
        <h2 className="pf-headline">Account Verification</h2>
        <span className="pf-obmeta">{nDone} of {STEPS.length} steps · {pct}%</span>
      </div>
      <p className="pf-obsub">Complete all {STEPS.length} steps to activate your account and start trading.</p>
      <div className="ob-progress">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`ob-seg ${finished || done[s.id] ? 'done' : ''} ${!finished && i === step ? 'current' : ''}`} />
        ))}
      </div>
      {finished ? (
        <div className="card ob-card pf-donecard"><div className="ob-done pf-done">
          <span className="pf-confetti" aria-hidden="true">
            {PF_CONFETTI.map((c, i) => (
              <i key={i} className="pf-cf" style={{ '--x': c.x + 'px', '--y': c.y + 'px', '--r': c.r + 'deg', '--d': c.d + 's', background: c.c, width: c.w + 'px', height: c.h + 'px', borderRadius: c.round ? '50%' : '1px' }} />
            ))}
          </span>
          <span className="pf-done-seal">
            <svg viewBox="0 0 64 64" className="pf-done-ring"><circle cx="32" cy="32" r="29" /></svg>
            <svg viewBox="0 0 64 64" className="pf-done-tick"><path d="M19 33.5 28 42.5 45.5 24" /></svg>
            <i className="pf-done-pulse" />
          </span>
          <h2>Account verified</h2>
          <p>Thanks, {data.signature || 'partner'} — your wholesale account is active and your paperwork is filed. The full assortment and clock prices are open to you now.</p>
          <div className="pf-done-rows">
            {[['Identity & business', 'Checked against the KvK register'], ['Trading terms', 'Weekly invoicing · 14-day payment'], ['Transport', 'PP Flowers route · Aalsmeer hub']].map(([h, s], i) => (
              <div className="pf-done-row" key={h} style={{ animationDelay: (0.75 + i * 0.13) + 's' }}>
                {PFI.check({})}<span><b>{h}</b>{s}</span>
              </div>
            ))}
          </div>
          <button type="button" className="pf-cta pf-done-cta" onClick={() => { window.__goRoute && window.__goRoute('home'); }}>Start ordering {PFI.fwd({})}</button>
        </div></div>
      ) : (
        <div className="ob-grid pf-obgrid">
          <div className="card ob-card">
            <div className="ob-card-head">
              <p className="ob-card-eyebrow">Step {step + 1} of {STEPS.length} · {meta.eyebrow}</p>
              <h2 className="ob-card-title">{meta.title}</h2>
              <p className="ob-card-desc">{meta.desc}</p>
            </div>
            <div className="ob-card-body">{React.createElement(window.STEP_BODIES[meta.id], { d: data, set })}</div>
            <div className="ob-card-foot">
              <button className="btn-ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}
                style={step === 0 ? { opacity: .4, cursor: 'default' } : {}}>{OBI.back()} Previous</button>
              <span className="ob-foot-meta">{valid ? 'Looks good' : 'Complete the required fields'}</span>
              <button className="btn-accent" disabled={!valid} onClick={onContinue}
                style={!valid ? { opacity: .45, cursor: 'default' } : {}}>
                {step === STEPS.length - 1 ? 'Finish & activate' : 'Submit & Continue'} {OBI.fwd()}
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

function ProfileView({ onNavigate }) {
  const { useState } = React;
  const [tab, setTab] = useState('about');
  const [tuOpen, setTuOpen] = useState(false);
  const [balance, setBalance] = useState(() => (window.loadBalance ? window.loadBalance() : 0));
  const steps = window.STEPS || [];
  const done = steps.filter((s) => PF_DONE.includes(s.id)).length;
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;

  const NavItem = ({ id, icon, label }) => (
    <button className={`pf-nav ${tab === id ? 'on' : ''}`} onClick={() => setTab(id)}>
      <span className="pf-nav-ic">{icon({})}</span>{label}
    </button>
  );

  return (
    <div className="canvas-max pf-wrap" style={{ maxWidth: 1680 }}>
      <div className="pf-split">
        <aside className="pf-rail">
          <h1 className="pf-title">Profile</h1>
          <NavItem id="about" icon={PFI.user} label="About me" />
          <NavItem id="onboarding" icon={PFI.check} label="Account information" />
          <NavItem id="tickets" icon={PFI.ticket} label="Past tickets" />
          <NavItem id="billing" icon={PFI.doc} label="Billing history" />
          <NavItem id="topups" icon={PFI.wallet} label="Top-up history" />
        </aside>

        <div className="pf-panel">
          {tab === 'about' && (
            <React.Fragment>
              <h2 className="pf-headline">About me</h2>
              <div className="pf-about">
                <div className="pf-idcard">
                  <span className="pf-avatar">T</span>
                  <p className="pf-idname">Test account</p>
                  <p className="pf-idrole">Wholesale buyer · Aalsmeer</p>
                  <p className="pf-idsince">Member since 26 May 2026</p>
                </div>
                <div className="pf-pitch">
                  <h3 className="pf-pitch-h">Complete your profile</h3>
                  <p>Your profile is what turns a browsing account into a trading account. Until it is complete we can only show you a limited assortment and hold your orders for prepayment.</p>
                  <ul className="pf-benefits">
                    {PF_BENEFITS.map(([h, p]) => (
                      <li key={h}>{PFI.check({})}<span><b>{h}</b>{p}</span></li>
                    ))}
                  </ul>
                  <button type="button" className="pf-cta" onClick={() => setTab('onboarding')}>Complete your profile {PFI.fwd({})}</button>
                </div>
              </div>
            </React.Fragment>
          )}

          {tab === 'onboarding' && <PfOnboarding />}

          {tab === 'tickets' && window.PfTickets && React.createElement(window.PfTickets, { onNavigate })}

          {tab === 'billing' && window.BillingView && React.createElement(window.BillingView, {})}

          {tab === 'topups' && window.TopupsView && React.createElement(window.TopupsView, { balance, onTopUp: () => setTuOpen(true) })}
        </div>
      </div>
      {window.TopUpModal && <window.TopUpModal open={tuOpen} balance={balance} onClose={() => setTuOpen(false)} onDone={(v) => { setBalance(typeof v === 'number' ? v : (window.loadBalance ? window.loadBalance() : balance)); setTuOpen(false); }} />}
    </div>
  );
}

Object.assign(window, { ProfileView, PFI, PfOnboarding });
