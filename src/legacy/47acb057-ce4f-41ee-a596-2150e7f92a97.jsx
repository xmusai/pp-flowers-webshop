// topup.jsx — Top Up balance flow (mock) for My Dashboard
// Balance persists in localStorage. Revolut is named as the instant method;
// this is an original UI, not a reproduction of Revolut's app.

const TU_KEY = 'ppflowers.balance.v1';
function loadBalance() { try { const v = parseFloat(localStorage.getItem(TU_KEY)); return isNaN(v) ? 0 : v; } catch (e) { return 0; } }
function saveBalance(v) { try { localStorage.setItem(TU_KEY, String(v)); } catch (e) {} }
function addBalance(amt) { const v = loadBalance() + amt; saveBalance(v); return v; }
function tuEuro(n) { return '€\u00A0' + Number(n).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

const _tu = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const TUI = {
  wallet: (p) => (<svg viewBox="0 0 24 24" {..._tu} {...p}><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H17a2 2 0 0 1 2 2v.5"/><path d="M3 7.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5.5A2.5 2.5 0 0 1 3 7.5Z"/><circle cx="16.5" cy="13" r="1.3" fill="currentColor" stroke="none"/></svg>),
  bolt: (p) => (<svg viewBox="0 0 24 24" {..._tu} {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>),
  bank: (p) => (<svg viewBox="0 0 24 24" {..._tu} {...p}><path d="M4 10h16M5 10l7-5 7 5M6 10v8M10 10v8M14 10v8M18 10v8M4 21h16"/></svg>),
  lock: (p) => (<svg viewBox="0 0 24 24" {..._tu} {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" {..._tu} strokeWidth="2.2" {...p}><path d="M12 5v14M5 12h14"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" {..._tu} strokeWidth="2.4" {...p}><path d="m5 12.5 4.5 4.5L19 7"/></svg>),
  card: (p) => (<svg viewBox="0 0 24 24" {..._tu} {...p}><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/></svg>),
};

const TU_PRESETS = [250, 500, 1000, 2500];
const TU_METHODS = [
  { id: 'revolut', name: 'Revolut', acc: 'Business ••3344', note: 'Instant', icon: 'bolt', instant: true },
  { id: 'sepa', name: 'SEPA transfer', acc: 'NL91 ABNA ••8021', note: '1–2 days', icon: 'bank', instant: false },
];

function RevolutMark({ small }) {
  return <span className={`tu-rev ${small ? 'sm' : ''}`}><span className="tu-rev-r">R</span>Revolut</span>;
}

function TopUpModal({ open, balance, onClose, onDone }) {
  const { useState, useEffect } = React;
  const [step, setStep] = useState('amount');   // amount · processing · done
  const [amount, setAmount] = useState(500);
  const [method, setMethod] = useState('revolut');
  const [ref, setRef] = useState('');

  useEffect(() => {
    if (open) { setStep('amount'); setAmount(500); setMethod('revolut'); }
  }, [open]);

  useEffect(() => {
    if (step === 'processing') {
      const m = TU_METHODS.find((x) => x.id === method);
      const t = setTimeout(() => {
        setRef('PP-TU-' + Math.floor(100000 + Math.random() * 899999));
        setStep('done');
      }, m && m.instant ? 1700 : 1700);
      return () => clearTimeout(t);
    }
  }, [step, method]);

  if (!open) return null;
  const valid = amount >= 50;
  const newBalance = balance + amount;
  const m = TU_METHODS.find((x) => x.id === method) || TU_METHODS[0];

  return (
    <div className={`tu-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="tu-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="tu-close" onClick={onClose} aria-label="Close">{OBI.close({})}</button>

        {step === 'amount' && (
          <React.Fragment>
            <div className="tu-head">
              <p className="tu-eyebrow">Add funds</p>
              <h2 className="tu-title">Top up your balance</h2>
              <p className="tu-bal">Current balance <b>{tuEuro(balance)}</b></p>
            </div>

            <div className="tu-body">
              <label className="tu-label">Amount</label>
              <div className="tu-amounts">
                {TU_PRESETS.map((a) => (
                  <button key={a} className={`tu-amt ${amount === a ? 'on' : ''}`} onClick={() => setAmount(a)}>{tuEuro(a).replace(',00', '')}</button>
                ))}
              </div>
              <div className="tu-custom">
                <span className="tu-cur">€</span>
                <input type="number" min="0" step="50" value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))} />
                <span className="tu-custom-hint">Min. {tuEuro(50).replace(',00', '')}</span>
              </div>

              <label className="tu-label" style={{ marginTop: 22 }}>Pay with</label>
              <div className="tu-methods">
                {TU_METHODS.map((mm) => (
                  <button key={mm.id} className={`tu-method ${method === mm.id ? 'on' : ''}`} onClick={() => setMethod(mm.id)}>
                    <span className={`tu-method-ico ${mm.id === 'revolut' ? 'rev' : ''}`}>{TUI[mm.icon]({})}</span>
                    <span className="tu-method-tx">
                      <span className="tu-method-n">{mm.id === 'revolut' ? <RevolutMark small /> : mm.name}</span>
                      <span className="tu-method-s">{mm.acc}</span>
                    </span>
                    <span className={`tu-method-note ${mm.instant ? 'fast' : ''}`}>{mm.note}</span>
                    <span className="tu-method-tick">{TUI.check({})}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="tu-foot">
              <div className="tu-newbal"><span>New balance</span><span className="v">{tuEuro(newBalance)}</span></div>
              <button className="tu-cta" disabled={!valid} onClick={() => setStep('processing')}>
                {m.id === 'revolut' ? <React.Fragment>{TUI.bolt({})}Continue with Revolut</React.Fragment> : <React.Fragment>{TUI.bank({})}Continue</React.Fragment>}
              </button>
              <p className="tu-secure">{TUI.lock({})} Secured payment · demo environment</p>
            </div>
          </React.Fragment>
        )}

        {step === 'processing' && (
          <div className="tu-processing">
            <div className={`tu-spin ${m.id === 'revolut' ? 'rev' : ''}`}><span className="tu-spin-ring" />{m.id === 'revolut' ? <span className="tu-rev-r big">R</span> : TUI.bank({})}</div>
            <h2 className="tu-title">{m.id === 'revolut' ? 'Connecting to Revolut…' : 'Initiating transfer…'}</h2>
            <p className="tu-proc-sub">Authorising {tuEuro(amount)} from {m.name} {m.acc}</p>
          </div>
        )}

        {step === 'done' && (
          <div className="tu-done">
            <div className="tu-done-badge">{TUI.check({})}</div>
            <p className="tu-eyebrow">Payment confirmed</p>
            <h2 className="tu-title">{tuEuro(amount)} added</h2>
            <p className="tu-done-sub">Your balance is now <b>{tuEuro(newBalance)}</b>{m.instant ? ', available immediately.' : '. Funds arrive in 1–2 business days.'}</p>
            <div className="tu-receipt">
              <div className="tu-rrow"><span>Amount</span><span className="v">{tuEuro(amount)}</span></div>
              <div className="tu-rrow"><span>Method</span><span className="v">{m.id === 'revolut' ? <RevolutMark small /> : m.name}</span></div>
              <div className="tu-rrow"><span>Reference</span><span className="v">{ref}</span></div>
            </div>
            <button className="tu-cta" onClick={() => onDone(amount)}>{TUI.check({})}Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { loadBalance, saveBalance, addBalance, tuEuro, TopUpModal, TUI });
