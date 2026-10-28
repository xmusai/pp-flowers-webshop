// webshop-upgrades.jsx — v2 improvements: search takeover, VMP verify step, copy-last-week
// Depends on: webshop-data.jsx, orders-store.jsx, myshop-store.jsx, OBI (onboarding-data.jsx)

/* ---------- fuzzy search helpers ---------- */
function wuLev1(a, b) {
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) { i++; j++; continue; }
    edits++; if (edits > 1) return false;
    if (la > lb) i++; else if (lb > la) j++; else { i++; j++; }
  }
  return edits + (la - i) + (lb - j) <= 1;
}
/* "20x red naomi 60cm" → { qty, cm, text } */
function wuParse(raw) {
  let t = (raw || '').trim().toLowerCase();
  let qty = null, cm = null;
  const qm = t.match(/^(\d+)\s*[x×]\s*|^(\d+)\s+/);
  if (qm) { qty = parseInt(qm[1] || qm[2], 10); t = t.slice(qm[0].length); }
  const lm = t.match(/(\d{2,3})\s*cm/);
  if (lm) { cm = parseInt(lm[1], 10); t = t.replace(lm[0], ' '); }
  return { qty, cm, text: t.replace(/\s+/g, ' ').trim() };
}
function wuMatch(text, cm) {
  const toks = (text || '').split(/\s+/).filter(Boolean);
  if (!toks.length && cm == null) return [];
  const scored = WS_PRODUCTS.map((p) => {
    const words = (p.name + ' ' + p.sub + ' ' + p.grower + ' ' + p.origin + ' ' + ((WS_CAT_MAP[p.cat] || {}).label || '')).toLowerCase().split(/[^a-z0-9+]+/).filter(Boolean);
    let s = 0;
    toks.forEach((tk) => {
      if (p.name.toLowerCase() === tk) s += 4;
      else if (words.some((w) => w.startsWith(tk))) s += 2;
      else if (tk.length >= 4 && words.some((w) => wuLev1(w, tk))) s += 2;
    });
    if (toks.length && p.name.toLowerCase().startsWith(text)) s += 3;
    if (cm != null) { if (Math.abs(p.stemCm - cm) <= 10) s += 1.5; else if (!toks.length) s -= 99; }
    return { p, s };
  });
  const min = toks.length ? 2 : 1;
  return scored.filter((x) => x.s >= min).sort((a, b) => b.s - a.s);
}

/* ---------- recent searches ---------- */
const WU_RECENT_KEY = 'ppflowers.recent-searches.v1';
function wuRecent() {
  try { const raw = localStorage.getItem(WU_RECENT_KEY); if (raw) { const l = JSON.parse(raw); if (Array.isArray(l)) return l; } } catch (e) {}
  return [];
}
function wuPushRecent(q) {
  const list = [q, ...wuRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6);
  try { localStorage.setItem(WU_RECENT_KEY, JSON.stringify(list)); } catch (e) {}
  return list;
}

const WU_SHORTCUTS = [
  { label: 'Top sellers', preset: { filters: { ids: ['r-rednaomi', 'r-avalanche', 't-stronggold', 'c-bacardi', 'g-intenzz', 'gr-euc'] } } },
  { label: 'In stock now', preset: { filters: { avail: ['high'] } } },
  { label: 'Best value', preset: { filters: { maxPrice: 0.45 }, sort: 'price-asc' } },
  { label: 'Long stem · 65 cm+', preset: { filters: { lengths: ['long'] }, sort: 'stem-desc' } },
  { label: 'Sustainable · MPS', preset: { filters: { certs: ['mps'] } } },
];

/* ---------- full-screen search takeover ---------- */
function WhSearchTakeover({ initial, onClose, onSearch, onAddBox, onAddUnits, onGoCatalogue, onGoFilter, onOpenDetail }) {
  const { useState, useEffect, useRef, useMemo } = React;
  const [q, setQ] = useState(initial || '');
  const [recent, setRecent] = useState(wuRecent);
  const [added, setAdded] = useState({});
  const inputRef = useRef(null);
  useEffect(() => { const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 60); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);
  const parsed = useMemo(() => wuParse(q), [q]);
  const hasQuery = !!(parsed.text || parsed.cm != null);
  const results = useMemo(() => (hasQuery ? wuMatch(parsed.text, parsed.cm) : []), [parsed.text, parsed.cm]);
  const smart = parsed.qty != null && results.length > 0 ? results[0].p : null;
  const flash = (id) => { setAdded((a) => ({ ...a, [id]: true })); setTimeout(() => setAdded((a) => { const n = { ...a }; delete n[id]; return n; }), 1600); };
  const submit = () => { const t = q.trim(); if (!t) return; setRecent(wuPushRecent(t)); onSearch(t); };
  const restock = useMemo(() => { try { return (typeof whRestock === 'function' ? whRestock() : []).slice(0, 4); } catch (e) { return []; } }, []);
  const catCounts = useMemo(() => { const m = {}; WS_PRODUCTS.forEach((p) => { m[p.cat] = (m[p.cat] || 0) + 1; }); return m; }, []);

  const Row = ({ p, meta }) => {
    const cat = WS_CAT_MAP[p.cat] || {};
    const { boxPrice } = wsBoxInfo(p);
    return (
      <div className="wst-row" role="button" tabIndex={0} onClick={() => onOpenDetail(p)}>
        <span className="wst-thumb" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")` }}></span>
        <span className="wst-tx">
          <span className="wst-n">{p.name}</span>
          <span className="wst-m">{meta || `${p.sub} · ${p.stemCm} cm · ${p.origin} · ${p.grower}`}</span>
        </span>
        <span className="wst-price"><b>{wsEuro(boxPrice)}</b><span className="u">/ box · {wsEuro(p.perStem)} / {p.unit === 'piece' ? 'pc' : 'stem'}</span></span>
        <button className={`wst-add${added[p.id] ? ' done' : ''}`} onClick={(e) => { e.stopPropagation(); onAddBox(p); flash(p.id); }}>
          {added[p.id] ? WI.check({}) : OBI.box({})}{added[p.id] ? 'Added' : 'Add box'}
        </button>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="wst-overlay" onClick={onClose}></div>
      <div className="wst-panel" role="dialog" aria-label="Search the assortment">
        <div className="wst-head">
          {WI.search({})}
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Search 50.000+ products — try &ldquo;20x red naomi 60cm&rdquo;" aria-label="Search the assortment" />
          {q && <button className="wst-clear" onClick={() => setQ('')} aria-label="Clear">{OBI.close({})}</button>}
          <span className="wst-esc">esc</span>
        </div>

        <div className="wst-body">
          {!hasQuery ? (
            <React.Fragment>
              {recent.length > 0 && (
                <div className="wst-sec">
                  <div className="wst-h">{WI.clock({})}Recent searches</div>
                  <div className="wst-chips">
                    {recent.map((r) => <button key={r} className="wst-chip" onClick={() => setQ(r)}>{r}</button>)}
                  </div>
                </div>
              )}
              {restock.length > 0 && (
                <div className="wst-sec">
                  <div className="wst-h">{WI.star({})}Your usual — one tap to restock</div>
                  <div className="wst-list">
                    {restock.map((it) => <Row key={it.id} p={it.p} meta={`Ordered ${it.count}× · last ${typeof ordRel === 'function' ? ordRel(it.last).toLowerCase() : ''}`} />)}
                  </div>
                </div>
              )}
              <div className="wst-sec">
                <div className="wst-h">{WI.spark({})}Shortcuts</div>
                <div className="wst-chips">
                  {WU_SHORTCUTS.map((s) => <button key={s.label} className="wst-chip acc" onClick={() => onGoFilter(s.preset)}>{s.label}</button>)}
                </div>
              </div>
              <div className="wst-sec">
                <div className="wst-h">{OBI.dash({ width: 15, height: 15 })}Browse by category</div>
                <div className="wst-cats">
                  {WS_CATS.filter((c) => c.id !== 'all').map((c) => (
                    <button key={c.id} className="wst-cat" onClick={() => onGoCatalogue(c.id)}>
                      <span className="dot" style={{ background: c.tint }}></span>
                      <span className="l">{c.label}</span>
                      <span className="n">{catCounts[c.id] || 0}</span>
                    </button>
                  ))}
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {smart && (
                <div className="wst-smart">
                  <span className="wst-thumb lg" style={{ '--ph-tint': (WS_CAT_MAP[smart.cat] || {}).tint, backgroundImage: `url("${wsShot(smart.id)}")` }}></span>
                  <span className="wst-tx">
                    <span className="wst-sm-tag">{WI.spark({})}Understood: {parsed.qty} × {smart.name}{parsed.cm != null ? ` · ~${parsed.cm} cm` : ''}</span>
                    <span className="wst-n">{smart.name} <span className="sub">{smart.sub}</span></span>
                    <span className="wst-m">{smart.stemCm} cm · {smart.unit === 'piece' ? 'per piece' : `${smart.bunch} stems / bunch`} · {smart.origin}</span>
                  </span>
                  <button className={`wst-smartadd${added['s-' + smart.id] ? ' done' : ''}`} onClick={() => { onAddUnits(smart, parsed.qty); flash('s-' + smart.id); }}>
                    {added['s-' + smart.id] ? WI.check({}) : WI.cart({})}
                    {added['s-' + smart.id] ? 'In your basket' : `Add ${parsed.qty} ${smart.unit === 'piece' ? 'pieces' : 'bunches'} · ${wsEuro(wsUnitPrice(smart) * parsed.qty)}`}
                  </button>
                </div>
              )}
              {results.length === 0 ? (
                <div className="wst-none">
                  <p>No direct match for &ldquo;{q}&rdquo;.</p>
                  <button className="wst-chip acc" onClick={submit}>Search the full catalogue {OBI.fwd({})}</button>
                </div>
              ) : (
                <div className="wst-sec">
                  <div className="wst-h">{WI.search({})}{results.length} {results.length === 1 ? 'match' : 'matches'}</div>
                  <div className="wst-list">
                    {results.slice(0, 8).map(({ p }) => <Row key={p.id} p={p} />)}
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>

        <div className="wst-foot">
          <span className="hint">Tip: type quantity + variety + length — <b>&ldquo;20x red naomi 60cm&rdquo;</b> lands straight in your basket.</span>
          <button className="wst-go" onClick={submit} disabled={!q.trim()}>Search catalogue {OBI.fwd({})}</button>
        </div>
      </div>
    </React.Fragment>
  );
}

/* ---------- checkout verify step (VMP re-check) ---------- */
function WsVerifyStep({ lines, onSwap, onRemoveLine, onPriceAdj, onBack, onContinue }) {
  const { useState, useEffect, useMemo } = React;
  const [phase, setPhase] = useState('checking');
  const issues = useMemo(() => {
    const sim = window.WS_SIM || { price: true, soldout: true };
    const out = { price: null, sold: null };
    if (sim.price && lines.length) {
      const l = lines[0];
      const perStemDelta = Math.max(0.02, Math.round(l.p.perStem * 0.08 * 100) / 100);
      const units = l.p.unit === 'piece' ? l.qty : l.qty * l.p.bunch;
      out.price = { l, perStemDelta, lineDelta: Math.round(perStemDelta * units * 100) / 100 };
    }
    if (sim.soldout && lines.length > 1) {
      const l = lines[lines.length - 1];
      const inCart = new Set(lines.map((x) => x.p.id));
      let alts = WS_PRODUCTS.filter((x) => x.cat === l.p.cat && !inCart.has(x.id) && x.boxesLeft > 2);
      if (!alts.length) alts = WS_PRODUCTS.filter((x) => x.colour === l.p.colour && !inCart.has(x.id) && x.boxesLeft > 2);
      alts = alts.sort((a, b) => Math.abs(a.stemCm - l.p.stemCm) - Math.abs(b.stemCm - l.p.stemCm)).slice(0, 2);
      out.sold = { l, alts };
    }
    return out;
  }, []);
  const [priceAck, setPriceAck] = useState(false);
  const [soldRes, setSoldRes] = useState(null);
  useEffect(() => { const t = setTimeout(() => setPhase('done'), 1100); return () => clearTimeout(t); }, []);
  const noIssues = !issues.price && !issues.sold;
  const pending = (issues.price && !priceAck) || (issues.sold && !soldRes);
  useEffect(() => {
    if (phase === 'done' && noIssues) { const t = setTimeout(onContinue, 800); return () => clearTimeout(t); }
  }, [phase]);

  const okLines = lines.filter((x) => x.p.id !== (issues.price && issues.price.l.p.id) && x.p.id !== (issues.sold && issues.sold.l.p.id));

  return (
    <React.Fragment>
      <div className="ws-dr-body wsv">
        <div className={`wsv-status ${phase}`}>
          {phase === 'checking'
            ? <React.Fragment><span className="wsv-spin"></span><span><b>Checking your basket with the VMP</b><br />Live availability &amp; today&rsquo;s grower prices…</span></React.Fragment>
            : noIssues
              ? <React.Fragment>{WI.check({})}<span><b>All lines available</b><br />Prices unchanged — taking you to delivery.</span></React.Fragment>
              : <React.Fragment>{OBI.info({})}<span><b>{(issues.price ? 1 : 0) + (issues.sold ? 1 : 0)} of {lines.length} lines need a look</b><br />The VMP moved since you filled your basket.</span></React.Fragment>}
        </div>

        {phase === 'done' && issues.price && (
          <div className={`wsv-issue amber${priceAck ? ' resolved' : ''}`}>
            <div className="wsv-i-head">
              <span className="wsv-thumb" style={{ '--ph-tint': (WS_CAT_MAP[issues.price.l.p.cat] || {}).tint, backgroundImage: `url("${wsShot(issues.price.l.p.id)}")` }}></span>
              <span className="tx">
                <span className="t">{issues.price.l.p.name} — price moved at the clock</span>
                <span className="s"><s>{wsEuro(issues.price.l.p.perStem)}</s> → <b>{wsEuro(issues.price.l.p.perStem + issues.price.perStemDelta)}</b> / stem · line +{wsEuro(issues.price.lineDelta)}</span>
              </span>
            </div>
            <p className="wsv-note">Prices follow the grower&rsquo;s live VMP listing — nothing is locked until you confirm.</p>
            {priceAck
              ? <div className="wsv-resolved">{WI.check({})}New price accepted</div>
              : <div className="wsv-acts">
                  <button className="wsv-btn dark" onClick={() => { setPriceAck(true); onPriceAdj(issues.price.lineDelta); }}>Accept new price · +{wsEuro(issues.price.lineDelta)}</button>
                  <button className="wsv-btn" onClick={() => { setPriceAck(true); onRemoveLine(issues.price.l.p.id); }}>Remove line</button>
                </div>}
          </div>
        )}

        {phase === 'done' && issues.sold && (
          <div className={`wsv-issue red${soldRes ? ' resolved' : ''}`}>
            <div className="wsv-i-head">
              <span className="wsv-thumb dim" style={{ '--ph-tint': (WS_CAT_MAP[issues.sold.l.p.cat] || {}).tint, backgroundImage: `url("${wsShot(issues.sold.l.p.id)}")` }}></span>
              <span className="tx">
                <span className="t">{issues.sold.l.p.name} — lot sold out at the grower</span>
                <span className="s">Another buyer took the last boxes. Nearest alternatives, in stock now:</span>
              </span>
            </div>
            {soldRes
              ? <div className="wsv-resolved">{WI.check({})}{soldRes}</div>
              : <React.Fragment>
                  <div className="wsv-alts">
                    {issues.sold.alts.map((a) => (
                      <div className="wsv-alt" key={a.id}>
                        <span className="wsv-thumb" style={{ '--ph-tint': (WS_CAT_MAP[a.cat] || {}).tint, backgroundImage: `url("${wsShot(a.id)}")` }}></span>
                        <span className="tx">
                          <span className="t">{a.name}</span>
                          <span className="s">{a.stemCm} cm · {wsEuro(a.perStem)} / {a.unit === 'piece' ? 'pc' : 'stem'} · {a.boxesLeft} boxes left</span>
                        </span>
                        <button className="wsv-btn dark sm" onClick={() => { onSwap(issues.sold.l.p.id, a); setSoldRes('Swapped to ' + a.name); }}>Swap</button>
                      </div>
                    ))}
                  </div>
                  <div className="wsv-acts">
                    <button className="wsv-btn" onClick={() => { onRemoveLine(issues.sold.l.p.id); setSoldRes('Line removed'); }}>Remove line instead</button>
                  </div>
                </React.Fragment>}
          </div>
        )}

        {phase === 'done' && !noIssues && okLines.length > 0 && (
          <div className="wsv-ok">
            {WI.check({})}<span>{okLines.length} other {okLines.length === 1 ? 'line' : 'lines'} available · prices unchanged</span>
          </div>
        )}
      </div>
      <div className="ws-dr-foot">
        <button className="ws-checkout" disabled={phase !== 'done' || pending} onClick={onContinue}>
          {phase !== 'done' ? 'Checking…' : pending ? 'Resolve the flagged lines to continue' : <React.Fragment>Continue to delivery{OBI.fwd({})}</React.Fragment>}
        </button>
        <button className="ws-clear" onClick={onBack}>Back to basket</button>
      </div>
    </React.Fragment>
  );
}

/* ---------- copy last week → fresh draft ---------- */
function wuIsoWeek(d) {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  return Math.ceil((((dt - y0) / 86400000) + 1) / 7);
}
function msCopyLastOrder() {
  let orders = [];
  try { orders = loadOrders(); } catch (e) {}
  const src = orders.find((o) => o.status === 'delivered') || orders[orders.length - 1];
  if (!src) return null;
  const wk = wuIsoWeek(new Date());
  const list = msLoadDrafts();
  let name = `Week ${wk} order`, i = 2;
  while (list.some((d) => d.name === name)) name = `Week ${wk} order · ${i++}`;
  const now = new Date().toISOString();
  const d = { id: 'd-' + Math.random().toString(36).slice(2, 8), name, createdAt: now, updatedAt: now,
    lines: src.lines.filter((l) => msProd(l.id)).map((l) => ({ id: l.id, qty: l.qty, from: 'copy of ' + src.id, addedAt: now, priceAt: l.perStem })) };
  msSaveDrafts([d, ...list]);
  msSetOpen(d.id);
  return { d, src };
}
function MsCopyLastBtn({ onDone, compact, addToCart }) {
  if (compact) {
    const run = () => {
      if (addToCart) {
        let orders = []; try { orders = loadOrders(); } catch (e) {}
        const src = orders.find((o) => o.status === 'delivered') || orders[orders.length - 1];
        if (src) { addToCart(src); if (onDone) onDone(null, src); }
        return;
      }
      const r = msCopyLastOrder(); if (r && onDone) onDone(r.d, r.src);
    };
    return (
      <button className="ms-copylast-mini" onClick={run}
        title="Add your latest delivered order to the basket at today's prices">
        {MSI.copy({})}Add last week to cart
      </button>
    );
  }
  return (
    <button className="ms-copylast" onClick={() => { const r = msCopyLastOrder(); if (r && onDone) onDone(r.d, r.src); }}>
      <span className="ic">{MSI.copy({})}</span>
      <span className="t">Copy last week</span>
      <span className="s">Your latest delivered order → a fresh draft at today&rsquo;s live prices</span>
    </button>
  );
}

Object.assign(window, { WhSearchTakeover, WsVerifyStep, MsCopyLastBtn, msCopyLastOrder });
