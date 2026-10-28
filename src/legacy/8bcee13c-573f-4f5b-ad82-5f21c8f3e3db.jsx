// myshop-store.jsx — "My Shop" draft orders + favourites (Concept B: boards)
// A draft = a named, persistent order-in-progress that customers fill over days.
// Depends on: WS_PRODUCTS/wsEuro/wsShot/WI (webshop-data.jsx). Optional: ordRel, setReorder (orders-store.jsx).

const MS_DRAFTS_KEY = 'ppflowers.myshop.drafts.v1';
const MS_FAVS_KEY = 'ppflowers.myshop.favs.v1';
const MS_OPEN_KEY = 'ppflowers.myshop.open.v1';

const MSI = {
  bag: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5.3 8h13.4l-1.1 12.2a1 1 0 0 1-1 .8H7.4a1 1 0 0 1-1-.8Z"/><path d="M9 11V6.8a3 3 0 0 1 6 0V11"/></svg>),
  draft: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 3.5h12V21l-6-4-6 4Z"/><path d="M12 8v5M9.5 10.5h5"/></svg>),
  pen: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17Z"/><path d="m13.5 6.5 3 3"/></svg>),
  copy: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>),
};

function msEmit() { try { window.dispatchEvent(new CustomEvent('myshop:change')); } catch (e) {} }
function msNow() { return new Date().toISOString(); }
function msProd(id) { return WS_PRODUCTS.find((p) => p.id === id); }

/* line = { id, qty (bunches|pieces), priceAt (€/stem when added), addedAt, from } */
function msSeedLine(id, qty, from, daysAgo, priceAt) {
  const p = msProd(id); if (!p) return null;
  return { id, qty, from, addedAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    priceAt: priceAt != null ? priceAt : p.perStem };
}

function msSeedDrafts() {
  const day = 86400000, now = Date.now();
  return [
    { id: 'd-week29', name: 'Week 29 order',
      createdAt: new Date(now - 4 * day).toISOString(), updatedAt: new Date(now - 1 * day).toISOString(),
      lines: [
        msSeedLine('r-rednaomi', 2, 'favourites', 4),
        msSeedLine('t-dynasty', 10, 'webshop', 4, 0.20),
        msSeedLine('gr-ruscus', 5, 'reorder of PP-204417', 3),
        msSeedLine('s-hydrangea', 4, 'quick add', 1),
      ].filter(Boolean) },
    { id: 'd-hotel', name: 'Hotel lobby · Friday',
      createdAt: new Date(now - 3 * day).toISOString(), updatedAt: new Date(now - 3 * day).toISOString(),
      lines: [msSeedLine('l-sorbonne', 6, 'webshop', 3), msSeedLine('gr-euc', 3, 'webshop', 3)].filter(Boolean) },
    { id: 'd-mday', name: 'Mother’s day stock-up',
      createdAt: new Date(now - 8 * day).toISOString(), updatedAt: new Date(now - 7 * day).toISOString(),
      lines: [msSeedLine('p-sarah', 4, 'webshop', 8), msSeedLine('t-stronggold', 6, 'webshop', 7), msSeedLine('s-ranunculus', 4, 'favourites', 7)].filter(Boolean) },
  ];
}

function msLoadDrafts() {
  try { const raw = localStorage.getItem(MS_DRAFTS_KEY); if (raw) { const l = JSON.parse(raw); if (Array.isArray(l)) return l; } } catch (e) {}
  return msSeedDrafts();
}
function msSaveDrafts(list) { try { localStorage.setItem(MS_DRAFTS_KEY, JSON.stringify(list)); } catch (e) {} msEmit(); }

function msOpenId() {
  let id = '';
  try { id = localStorage.getItem(MS_OPEN_KEY) || ''; } catch (e) {}
  const list = msLoadDrafts();
  if (list.some((d) => d.id === id)) return id;
  return list.length ? list[0].id : '';
}
function msSetOpen(id) { try { localStorage.setItem(MS_OPEN_KEY, id); } catch (e) {} msEmit(); }

function msAddTo(draftId, prodId, qty, from) {
  const list = msLoadDrafts();
  const d = list.find((x) => x.id === draftId); if (!d) return;
  const p = msProd(prodId); if (!p) return;
  const ex = d.lines.find((l) => l.id === prodId);
  if (ex) ex.qty += qty;
  else d.lines.push({ id: prodId, qty, from, addedAt: msNow(), priceAt: p.perStem });
  d.updatedAt = msNow();
  msSaveDrafts(list);
}
function msSetLineQty(draftId, prodId, qty) {
  const list = msLoadDrafts();
  const d = list.find((x) => x.id === draftId); if (!d) return;
  if (qty <= 0) d.lines = d.lines.filter((l) => l.id !== prodId);
  else { const l = d.lines.find((x) => x.id === prodId); if (l) l.qty = qty; }
  d.updatedAt = msNow();
  msSaveDrafts(list);
}
function msNewDraft(name) {
  const list = msLoadDrafts();
  let n = (name || '').trim();
  if (!n) { let i = 1; n = 'New draft'; while (list.some((d) => d.name === n)) n = 'New draft ' + (++i); }
  const d = { id: 'd-' + Math.random().toString(36).slice(2, 8), name: n, createdAt: msNow(), updatedAt: msNow(), lines: [] };
  msSaveDrafts([d, ...list]);
  msSetOpen(d.id);
  return d.id;
}
function msRenameDraft(id, name) {
  const list = msLoadDrafts();
  const d = list.find((x) => x.id === id); if (!d || !(name || '').trim()) return;
  d.name = name.trim(); d.updatedAt = msNow();
  msSaveDrafts(list);
}
function msDuplicateDraft(id) {
  const list = msLoadDrafts();
  const d = list.find((x) => x.id === id); if (!d) return;
  const copy = { ...d, id: 'd-' + Math.random().toString(36).slice(2, 8), name: d.name + ' (copy)',
    createdAt: msNow(), updatedAt: msNow(), lines: d.lines.map((l) => ({ ...l })) };
  msSaveDrafts([copy, ...list]);
  return copy.id;
}
function msDeleteDraft(id) {
  const list = msLoadDrafts().filter((d) => d.id !== id);
  msSaveDrafts(list);
  if (msOpenId() === id && list.length) msSetOpen(list[0].id);
}

/* ---- pricing (always live; priceAt remembers the price when added) ---- */
function msLineUnitPrice(l) { const p = msProd(l.id); if (!p) return 0; return p.unit === 'piece' ? p.perStem : p.perStem * p.bunch; }
function msLineTotal(l) { return msLineUnitPrice(l) * l.qty; }
function msPriceDelta(l) { const p = msProd(l.id); return p ? p.perStem - l.priceAt : 0; }
function msDraftSubtotal(d) { return d.lines.reduce((s, l) => s + msLineTotal(l), 0); }
function msDraftUnits(d) { return d.lines.reduce((s, l) => s + l.qty, 0); }
function msDraftFlags(d) { return d.lines.filter((l) => Math.abs(msPriceDelta(l)) > 0.001).length; }

function msRel(dt) {
  const ms = Date.now() - new Date(dt).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + ' min ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + ' h ago';
  const d = Math.floor(h / 24);
  if (d === 1) return 'yesterday';
  if (d < 7) return d + ' days ago';
  return Math.floor(d / 7) + ' wk ago';
}

/* ---- favourites: pinned products with a usual quantity ---- */
function msSeedFavs() {
  return [{ id: 'r-rednaomi', qty: 2 }, { id: 'r-avalanche', qty: 1 }, { id: 'gr-euc', qty: 2 }, { id: 'l-sorbonne', qty: 1 }, { id: 'g-intenzz', qty: 1 }];
}
function msLoadFavs() {
  try { const raw = localStorage.getItem(MS_FAVS_KEY); if (raw) { const l = JSON.parse(raw); if (Array.isArray(l)) return l; } } catch (e) {}
  return msSeedFavs();
}
function msSaveFavs(list) { try { localStorage.setItem(MS_FAVS_KEY, JSON.stringify(list)); } catch (e) {} msEmit(); }
function msIsFav(id) { return msLoadFavs().some((f) => f.id === id); }
function msToggleFav(id, qty = 1) {
  const list = msLoadFavs();
  if (list.some((f) => f.id === id)) msSaveFavs(list.filter((f) => f.id !== id));
  else msSaveFavs([{ id, qty }, ...list]);
}

/* ---- quick add: "20x red naomi" → { p, qty } ---- */
function msQuickParse(text) {
  let t = (text || '').trim();
  if (!t) return null;
  let qty = 1;
  const m = t.match(/^(\d+)\s*[x×]?\s*(.*)$/i);
  if (m && m[2]) { qty = Math.max(1, parseInt(m[1], 10)); t = m[2].trim(); }
  const q = t.toLowerCase();
  if (!q) return null;
  const toks = q.split(/\s+/);
  let best = null, bs = 0;
  WS_PRODUCTS.forEach((p) => {
    const name = p.name.toLowerCase();
    const hay = (p.name + ' ' + p.sub + ' ' + p.cat).toLowerCase();
    let s = 0;
    toks.forEach((tk) => { if (name.includes(tk)) s += 2; else if (hay.includes(tk)) s += 1; });
    if (name === q) s += 5;
    if (name.startsWith(q)) s += 2;
    if (s > bs) { bs = s; best = p; }
  });
  return bs >= 2 ? { p: best, qty } : null;
}

/* ---- React helpers ---- */
function useMyShop() {
  const { useState, useEffect } = React;
  const [, setTick] = useState(0);
  useEffect(() => {
    const f = () => setTick((t) => t + 1);
    window.addEventListener('myshop:change', f);
    return () => window.removeEventListener('myshop:change', f);
  }, []);
  return { drafts: msLoadDrafts(), favs: msLoadFavs(), openId: msOpenId() };
}

/* ---- shared popover: pick a draft ---- */
function MsDraftMenu({ anchor, onClose, onPick, extra, title }) {
  const { useEffect, useRef } = React;
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', close, true);
    document.addEventListener('keydown', esc);
    const s = document.querySelector('.scroll');
    if (s) s.addEventListener('scroll', onClose);
    return () => {
      document.removeEventListener('mousedown', close, true);
      document.removeEventListener('keydown', esc);
      if (s) s.removeEventListener('scroll', onClose);
    };
  }, []);
  const drafts = msLoadDrafts();
  const openId = msOpenId();
  const est = 52 + drafts.length * 38 + 44 + (extra ? 44 : 0);
  const below = anchor.bottom + 8 + est < window.innerHeight;
  const style = { position: 'fixed', left: Math.max(10, Math.min(anchor.left, window.innerWidth - 250)) };
  if (below) style.top = anchor.bottom + 8; else style.bottom = window.innerHeight - anchor.top + 8;
  return (
    <div className="ms-menu" style={style} ref={ref} onClick={(e) => e.stopPropagation()}>
      <div className="ms-menu-h">{title || 'Add to draft'}</div>
      {drafts.map((d) => (
        <button key={d.id} className="ms-menu-it" onClick={() => onPick(d.id)}>
          <span className="n">{d.name}</span>
          {d.id === openId && <span className="tag">open</span>}
        </button>
      ))}
      <div className="ms-menu-sep"></div>
      <button className="ms-menu-it" onClick={() => onPick('__new')}>{WI.plus({})}<span className="n">New draft…</span></button>
      {extra}
    </div>
  );
}

/* ---- entry point: webshop product card → draft (one box) ---- */
function WsDraftBtn({ p }) {
  const { useState } = React;
  const [anchor, setAnchor] = useState(null);
  const [done, setDone] = useState(false);
  const pick = (id) => {
    const did = id === '__new' ? msNewDraft() : id;
    msAddTo(did, p.id, p.box, 'webshop');
    setAnchor(null);
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <React.Fragment>
      <button className={`ms-wsbtn${done ? ' done' : ''}`} title="Add a box to a draft order"
        onClick={(e) => { e.stopPropagation(); setAnchor(anchor ? null : e.currentTarget.getBoundingClientRect()); }}>
        {done ? WI.check({}) : MSI.draft({})}
      </button>
      {anchor && (
        <MsDraftMenu anchor={anchor} onClose={() => setAnchor(null)} onPick={pick} title={`Add 1 box · ${p.name}`}
          extra={<React.Fragment>
            <div className="ms-menu-sep"></div>
            <button className="ms-menu-it" onClick={() => { msToggleFav(p.id, 1); setAnchor(null); }}>
              {WI.star({})}<span className="n">{msIsFav(p.id) ? 'Unpin favourite' : 'Pin as favourite'}</span>
            </button>
          </React.Fragment>} />
      )}
    </React.Fragment>
  );
}

/* ---- entry point: My Orders → add all lines to a draft ---- */
function OrdToDraftBtn({ o, lg }) {
  const { useState } = React;
  const [anchor, setAnchor] = useState(null);
  const [done, setDone] = useState(false);
  const pick = (id) => {
    const did = id === '__new' ? msNewDraft() : id;
    o.lines.forEach((l) => msAddTo(did, l.id, l.qty, 'reorder of ' + o.id));
    setAnchor(null);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };
  return (
    <React.Fragment>
      <button className={`ord-reorder ms-todraft${lg ? ' lg' : ''}`} title="Add all items from this order to a draft"
        onClick={(e) => { e.stopPropagation(); setAnchor(anchor ? null : e.currentTarget.getBoundingClientRect()); }}>
        {done ? WI.check({}) : MSI.draft({})}To draft
      </button>
      {anchor && <MsDraftMenu anchor={anchor} onClose={() => setAnchor(null)} onPick={pick} title={`Add ${o.lines.length} lines to draft`} />}
    </React.Fragment>
  );
}

Object.assign(window, { MSI, msLoadDrafts, msSaveDrafts, msOpenId, msSetOpen, msAddTo, msSetLineQty,
  msNewDraft, msRenameDraft, msDuplicateDraft, msDeleteDraft, msLineUnitPrice, msLineTotal, msPriceDelta,
  msDraftSubtotal, msDraftUnits, msDraftFlags, msRel, msLoadFavs, msIsFav, msToggleFav, msQuickParse,
  msProd, useMyShop, MsDraftMenu, WsDraftBtn, OrdToDraftBtn });
