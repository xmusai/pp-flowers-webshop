// webshop-home.jsx — PP Flowers Algorithmic Buyer Command Center (webshop landing)
// Depends (all on window): WI, OBI, WS_CATS, WS_CAT_MAP, WS_PRODUCTS, wsEuro, wsShot,
//   wsBoxInfo, wsUnitPrice, wsGrade, loadOrders, ordRel, CUSTOMER, greeting
// Renders the personalized home; searching / picking a category hands off to the catalogue.

/* ---- account context (credit line + open invoices) ---- */
const WS_ACCOUNT = {
  creditLimit: 25000,
  creditUsed: 6550,           // open invoices + open (un-invoiced) orders
  openInvoices: [
    { id: 'INV-2026-0412', amount: 2156.00, dueInDays: 4,  period: 'Apr statement' },
    { id: 'INV-2026-0398', amount: 1284.50, dueInDays: 18, period: 'May statement' },
  ],
};

/* curated June / wedding-season picks (peonies, garden roses, ranunculus, anemone, hydrangea) */
const WH_SEASON_IDS = ['p-sarah', 's-ranunculus', 'r-rednaomi', 's-anemone', 's-hydrangea'];

function whEuroK(n) {
  // compact euro for the rail: € 18.450
  return '\u20AC\u00A0' + Math.round(n).toLocaleString('de-DE');
}
function whAvail(p) {
  const n = p.boxesLeft || 0;
  if (n <= 2) return { level: 'low', label: 'in stock' };
  if (n <= 5) return { level: 'mid', label: 'in stock' };
  return { level: 'high', label: 'In stock' };
}
function whBadgeIcon(b) {
  if (b === 'Auction-fresh') return WI.clock;
  if (b === 'Seasonal' || b === 'New') return WI.spark;
  return WI.star;
}
function whBadgeClass(b) {
  if (b === 'Seasonal') return 'season';
  if (b === 'Auction-fresh' || b === 'Top grade') return 'green';
  return '';
}

/* predictive restock — aggregates the buyer's real order history */
function whRestock() {
  let orders = [];
  try { orders = (typeof loadOrders === 'function') ? loadOrders() : []; } catch (e) {}
  const agg = {};
  orders.forEach((o) => (o.lines || []).forEach((l) => {
    if (!agg[l.id]) agg[l.id] = { id: l.id, count: 0, last: o.placedAt };
    agg[l.id].count += 1;
    if (new Date(o.placedAt) > new Date(agg[l.id].last)) agg[l.id].last = o.placedAt;
  }));
  const items = Object.values(agg)
    .map((a) => ({ ...a, p: WS_PRODUCTS.find((x) => x.id === a.id) }))
    .filter((a) => a.p)
    .sort((a, b) => new Date(a.last) - new Date(b.last)); // oldest reorder first = most due
  return items;
}
function whDaysSince(d) { return Math.floor((Date.now() - new Date(d).getTime()) / 86400000); }
function whFlag(oc) {
  if (!oc) return '';
  return oc.toUpperCase().replace(/[A-Z]/g, (c) => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65));
}
function whHash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

/* spec-row icons (line style matches the system) */
const _si = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const SPEC_ICONS = {
  boxes: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><path d="M3 8.5 12 4l9 4.5-9 4.5z"/><path d="M3 8.5v7l9 4.5 9-4.5v-7"/><path d="M12 13v8"/></svg>),
  box: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M4 10h16M9 6V4h6v2"/></svg>),
  sprout: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><path d="M12 21v-8M12 13c-3.5 0-5-2.5-5-5 3.5 0 5 1.5 5 5zM12 13c0-3.5 1.5-6 5-6 0 3.5-1.5 6-5 6z"/></svg>),
  ruler: WI.ruler,
  scale: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><path d="M12 4v16M6 20h12M7.5 8h9l-2-3h-5z"/><path d="M4.5 13a2.5 2.5 0 0 0 5 0L7 8zM14.5 13a2.5 2.5 0 0 0 5 0L17 8z"/></svg>),
  buds: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><path d="M12 21v-6M12 15c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4zM12 13c0-2.5 1.5-4 4-4 0 2.5-1.5 4-4 4zM12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>),
  brush: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><path d="M15 5l4 4-8 8H7v-4z"/><path d="M5 19c1.5 0 2-1 3-2"/></svg>),
  tag: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/></svg>),
  factory: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><path d="M3 21V10l5 3V10l5 3V10l5 3v8z"/><path d="M3 21h18"/></svg>),
  fust: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><path d="M6 4h12l-1 16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"/><path d="M5 4h14M9 9h6"/></svg>),
  quality: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><path d="M6 3h12v18l-6-4-6 4z"/></svg>),
  maturity: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><path d="M7 4v15M7 19l-3-3M7 19l3-3M17 20V5M17 5l-3 3M17 5l3 3"/></svg>),
  globe: (p) => (<svg viewBox="0 0 24 24" {..._si} {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 2.6 2.8 15.4 0 18M12 3c-2.8 2.6-2.8 15.4 0 18"/></svg>),
};

/* full product spec list (real data where available, derived consistently otherwise) */
function whProductSpecs(p) {
  const { boxStems } = wsBoxInfo(p);
  const isPiece = p.unit === 'piece';
  const colour = (typeof WS_COLOURS !== 'undefined') ? WS_COLOURS.find((c) => c.id === p.colour) : null;
  const weight = Math.max(20, Math.round(p.stemCm * 0.8));
  const buds = 4 + (whHash(p.id) % 4);
  const fust = 500 + (whHash(p.id) % 499);
  const rows = [
    { key: 'units', icon: SPEC_ICONS.boxes, label: 'Priced per', value: `1 ${ppUnit(p)}` },
    { key: 'contents', icon: SPEC_ICONS.box, label: 'Order lot', value: ppQty(p, ppLot(p)) },
    { key: 'amount', icon: SPEC_ICONS.sprout, label: 'Sellers', value: String((ppRec(p) || {}).priced_offers || '\u2014') },
    { key: 'length', icon: SPEC_ICONS.ruler, label: 'Length', value: `${p.stemCm} cm` },
  ];
  if (!isPiece) {
    rows.push({ key: 'weight', icon: SPEC_ICONS.scale, label: 'Weight', value: `${weight} gram` });
    rows.push({ key: 'buds', icon: SPEC_ICONS.buds, label: 'Buds per stem', value: `minimal ${buds}` });
  }
  rows.push({ key: 'colour', icon: SPEC_ICONS.brush, label: 'Colour', value: colour ? colour.label : '—',
    dot: colour && colour.hex !== 'mixed' ? colour.hex : null, mixed: !!(colour && colour.hex === 'mixed') });
  rows.push({ key: 'perstem', icon: SPEC_ICONS.tag, label: `Price / ${ppUnit(p)}`, value: ppFromText(p) });
  rows.push({ key: 'asof', icon: SPEC_ICONS.tag, label: 'Prices', value: ppAsOf(p).replace('as of ', '') });
  rows.push({ key: 'grower', icon: SPEC_ICONS.factory, label: 'Manufacturer name', value: p.grower, link: true });
  rows.push({ key: 'fust', icon: SPEC_ICONS.fust, label: 'Fust code', value: String(fust) });
  rows.push({ key: 'quality', icon: SPEC_ICONS.quality, label: 'Quality', value: wsGrade(p) });
  rows.push({ key: 'maturity', icon: SPEC_ICONS.maturity, label: 'Maturity', value: '2-3' });
  rows.push({ key: 'country', icon: SPEC_ICONS.globe, label: 'Country of origin', value: p.origin, flag: whFlag(p.oc) });
  return rows;
}

/* spec rows (shared by the static product card and the restock hover popover) */
function WhSpecRows({ p, keys }) {
  let specs = whProductSpecs(p);
  if (keys) specs = keys.map((k) => specs.find((s) => s.key === k)).filter(Boolean);
  return (
    <div className="wh-sp-specs">
      {specs.map((s) => (
        <div className="wh-sp-row" key={s.label}>
          <span className="wh-sp-ic">{s.icon({})}</span>
          <span className="wh-sp-l">{s.label}</span>
          <span className={`wh-sp-v ${s.link ? 'link' : ''}`}>
            {s.flag && <span className="wh-sp-flag">{s.flag}</span>}
            {s.dot && <span className="wh-sp-dot" style={{ background: s.dot }} />}
            {s.mixed && <span className="wh-sp-dot mixed" />}
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* shared hover-reveal spec popover (used by the restock cards) */
function WhSpecPanel({ p, onAddBox, wished, onToggleWish, onClose }) {
  const cat = WS_CAT_MAP[p.cat] || {};
  return (
    <div className="wh-spec-pop" role="dialog" aria-label={`${p.name} full specifications`}>
      <div className="wh-sp-head">
        <span className="wh-sp-thumb" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")` }} />
        <span className="wh-sp-htext">
          <span className="wh-sp-n">{p.name}</span>
          <span className="wh-sp-sub">{p.sub}</span>
          {WH_DROPS[p.id] ? <span className="wh-sp-drop">▼ {WH_DROPS[p.id]}% · was {wsEuro(whWasPrice(p))}</span> : null}
        </span>
        {onToggleWish && (
          <button className={`wh-heart in-pop ${wished ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); onToggleWish(p.id); }} aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}>{WH_HEART({})}</button>
        )}
      </div>
      <WhSpecRows p={p} />
      {onClose && (
        <button className="wh-sp-hide" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Hide specifications">{OBI.chev({ style: { transform: 'rotate(-90deg)' } })}Hide specs</button>
      )}
      <button className="wh-radd wh-sp-add" onClick={(e) => { e.stopPropagation(); onAddBox(p); }}>{OBI.box({})}Add {ppQty(p, ppLot(p))}</button>
    </div>
  );
}

/* ---------------- webshop footer (explore grid + link columns) ---------------- */
function WhFooter({ onGoCatalogue, onOpenDetail, onNavigate }) {
  const { useState } = React;
  const tabs = [{ id: 'popular', label: 'Popular' }, ...WS_CATS.filter((c) => c.id !== 'all').map((c) => ({ id: c.id, label: c.label }))];
  const [tab, setTab] = useState('popular');
  const pool = tab === 'popular'
    ? [...WS_PRODUCTS].sort((a, b) => (WH_BESTSELLERS.includes(b.id) - WH_BESTSELLERS.includes(a.id)))
    : WS_PRODUCTS.filter((p) => p.cat === tab);
  const items = pool.slice(0, 18);
  const cols = [
    { h: 'Support', links: ['Help center', 'Delivery & logistics', 'Report a quality issue', 'Returns & credits', 'Contact us'] },
    { h: 'Buying', links: ['How the auction works', 'Standing orders', 'Webshop guide', 'Pricing & fees', 'Become a customer'] },
    { h: 'PP Flowers', links: ['About us', 'Growers & sourcing', 'Sustainability', 'Careers', 'Newsroom'] },
  ];
  return (
    <footer className="wh-foot">
      <div className="wh-foot-explore">
        <h2 className="wh-sec-title">Explore the assortment</h2>
        <div className="wh-foot-tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={`wh-foot-tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="wh-foot-grid">
          {items.map((p) => (
            <button key={p.id} className="wh-foot-cell" onClick={() => onOpenDetail(p)}>
              <span className="wh-foot-n">{p.name}</span>
              <span className="wh-foot-s">{(WS_CAT_MAP[p.cat] || {}).label || p.cat} · {p.origin}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="wh-foot-cols">
        {cols.map((c) => (
          <div className="wh-foot-col" key={c.h}>
            <h3>{c.h}</h3>
            {c.links.map((l) => (<a key={l} href="#" onClick={(e) => e.preventDefault()}>{l}</a>))}
          </div>
        ))}
      </div>
      <div className="wh-foot-bar">
        <span>© 2026 PP Flowers · Blooming your business</span>
        <span className="wh-foot-legal"><a href="#" onClick={(e) => e.preventDefault()}>Terms</a><a href="#" onClick={(e) => e.preventDefault()}>Privacy</a><a href="#" onClick={(e) => e.preventDefault()}>Cookies</a></span>
      </div>
    </footer>
  );
}

/* ---------------- horizontal product carousel with arrows ---------------- */
function WhCarousel({ children }) {
  const { useRef, useState, useEffect } = React;
  const ref = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const update = () => {
    const el = ref.current; if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };
  useEffect(() => { update(); }, []);
  const scroll = (dir) => { const el = ref.current; if (!el) return; el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: 'smooth' }); };
  return (
    <div className="wh-carousel">
      <button className={`wh-carr prev ${atStart ? 'off' : ''}`} onClick={() => scroll(-1)} aria-label="Previous">{OBI.back({})}</button>
      <div className="wh-carousel-track" ref={ref} onScroll={update}>{children}</div>
      <button className={`wh-carr next ${atEnd ? 'off' : ''}`} onClick={() => scroll(1)} aria-label="Next">{OBI.fwd({})}</button>
    </div>
  );
}

/* ---------------- Airbnb-style product card (image first, paired rows) ---------------- */
function WhProductCard({ p, qty, onAddBox, onSubBox, onOpen, wished, onToggleWish }) {
  const cat = WS_CAT_MAP[p.cat] || {};
  const grade = wsGradeId(p) === 'extra' ? 'A1 Extra' : 'A1';
  const sizeLbl = `${p.stemCm} cm`;
  return (
    <div className="wh-rcard air">
      <button className={`wh-heart ${wished ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); onToggleWish && onToggleWish(p.id); }} aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}>{WH_HEART({})}</button>
      <div className="wh-rc-photo" onClick={() => onOpen(p)} role="button" tabIndex={0}
        style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")` }}>
        {p.badge && <span className={`wh-tag ${whBadgeClass(p.badge)}`}>{whBadgeIcon(p.badge)({})}{p.badge}</span>}
      </div>
      <div className="wh-rc-body">
        <div className="wh-rc-line">
          <span className="wh-rc-name">{p.name}</span>
          <span className="wh-rc-country"><span className="fl">{whFlag(p.oc)}</span>{p.origin}</span>
        </div>
        <div className="wh-rc-line sub">
          <span className="wh-rc-size">{sizeLbl}</span>
          <span className="wh-rc-grower">{p.grower}</span>
        </div>
        <div className="wh-rc-line foot">
          <span className="wh-rc-price"><b>{ppFromText(p)}</b><span className="pu">/ {ppUnit(p)}</span></span>
        </div>
        <div className="wh-rc-line meta"><span className="wh-rc-meta">{ppMeta(p)}</span>{WH_DROPS[p.id] ? <span className="wh-rc-drop">▼ {WH_DROPS[p.id]}%</span> : null}</div>
        {qty > 0 ? (
          <div className="wh-boxstep full">
            <button className="wh-bs-btn" onClick={() => onSubBox && onSubBox(p)} aria-label={`Remove ${ppQty(p, ppLot(p))}`}>{WI.minus({})}</button>
            <span className="wh-bs-n"><b>{qty.toLocaleString('en')}</b> {ppUnitPlural(p, qty)} in cart</span>
            <button className="wh-bs-btn" onClick={() => onAddBox(p)} aria-label={`Add ${ppQty(p, ppLot(p))}`}>{WI.plus({})}</button>
          </div>
        ) : (
          <button className="wh-radd full" onClick={() => onAddBox(p)}>{OBI.box({})}Add {ppQty(p, ppLot(p))}</button>
        )}
      </div>
    </div>
  );
}

/* per-section view switch: photo carousel ↔ spec-card grid (mirrors the catalogue toolbar) */
function WhSecView({ view, onSet }) {
  return (
    <div className="ws-viewtoggle wh-sec-view">
      <button className={`ws-vt ${view !== 'grid' ? 'on' : ''}`} onClick={() => onSet('photo')} title="Photo cards">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 16l4.5-4.2a2 2 0 0 1 2.7 0L15 16"/><circle cx="15.6" cy="9.2" r="1.5"/></svg>
        <span>Photos</span>
      </button>
      <button className={`ws-vt ${view === 'grid' ? 'on' : ''}`} onClick={() => onSet('grid')} title="Specification grid">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>
        <span>Grid</span>
      </button>
    </div>
  );
}

/* ---------------- predictive restock card ---------------- */
function WhRestockCard({ item, qty, onAddBox, onSubBox, onOpen, wished, onToggleWish }) {
  return <WhProductCard p={item.p} qty={qty} onAddBox={onAddBox} onSubBox={onSubBox} onOpen={onOpen} wished={wished} onToggleWish={onToggleWish} />;
}

/* ---------------- product card: spec list is the card, image is a hover popover ---------------- */
function WhCard({ p, qty, onAddBox, onSub, onOpen, wished, onToggleWish, tiered }) {
  const cat = WS_CAT_MAP[p.cat] || {};
  const isPiece = p.unit === 'piece';
  const boxes = qty;
  const stop = (e) => e.stopPropagation();

  if (tiered) {
    const { useState } = React;
    const [openSpecs, setOpenSpecs] = useState(false);
    const stockLvl = p.boxesLeft >= 8 ? 'high' : p.boxesLeft >= 4 ? 'mid' : 'low';
    const KEY_6 = ['contents', 'amount', 'colour', 'quality', 'grower', 'country'];
    return (
      <div className={`wh-card spec-card tiered ${openSpecs ? 'open' : ''} ${boxes > 0 ? 'in-cart' : ''}`}>
        <div className="wh-sp-head">
          <span className="wh-sp-thumbwrap" onClick={(e) => { stop(e); onOpen(p); }} role="button" tabIndex={0} aria-label={`View ${p.name}`}>
            <span className="wh-sp-thumb" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")` }} />
            <span className="wh-imgpop" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")` }} aria-hidden="true">
              {p.badge && <span className={`wh-tag ${whBadgeClass(p.badge)}`}>{whBadgeIcon(p.badge)({})}{p.badge}</span>}
            </span>
          </span>
          <span className="wh-sp-htext">
            <span className="wh-sp-n">{p.name}</span>
            <span className="wh-sp-sub">{p.sub}</span>
          </span>
          <button className={`wh-heart in-pop ${wished ? 'on' : ''}`} onClick={(e) => { stop(e); onToggleWish && onToggleWish(p.id); }} aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}>{WH_HEART({})}</button>
        </div>

        <div className="wh-hero">
          <div className="wh-hero-price">
            <span className="hp-amt">{ppFromText(p)}</span>
            <span className="hp-unit">/ {ppUnit(p)}</span>
          </div>
          <div className="wh-hero-stem">{ppMeta(p)}</div>
          <div className="wh-hero-chips">
            <span className="wh-chip2">{SPEC_ICONS.ruler({})}{p.stemCm} cm</span>
            <span className={`wh-chip2 stock ${stockLvl}`}><span className="sd" />{ppStockText(p)}</span>
          </div>
        </div>

        <WhSpecRows p={p} keys={KEY_6} />
        <button className="wh-allspecs" onClick={(e) => { stop(e); setOpenSpecs(true); }} aria-expanded={openSpecs}>{SPEC_ICONS.boxes({})}<span className="lbl">View all specs</span>{OBI.fwd({ className: 'arr' })}</button>

        {boxes > 0 ? (
          <button className="wh-radd wh-sp-add in" onClick={(e) => { stop(e); onAddBox(p); }}>{WI.check({})}<span className="bx">{ppQty(p, boxes)} in cart</span></button>
        ) : (
          <button className="wh-radd wh-sp-add" onClick={(e) => { stop(e); onAddBox(p); }}>{OBI.box({})}Add {ppQty(p, ppLot(p))}</button>
        )}

        <WhSpecPanel p={p} onAddBox={onAddBox} wished={wished} onToggleWish={onToggleWish} onClose={() => setOpenSpecs(false)} />
      </div>
    );
  }

  return (
    <div className={`wh-card spec-card ${boxes > 0 ? 'in-cart' : ''}`}>
      <div className="wh-sp-head">
        <span className="wh-sp-thumbwrap" onClick={(e) => { stop(e); onOpen(p); }} role="button" tabIndex={0} aria-label={`View ${p.name}`}>
          <span className="wh-sp-thumb" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")` }} />
          <span className="wh-imgpop" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")` }} aria-hidden="true">
            {p.badge && <span className={`wh-tag ${whBadgeClass(p.badge)}`}>{whBadgeIcon(p.badge)({})}{p.badge}</span>}
          </span>
        </span>
        <span className="wh-sp-htext">
          <span className="wh-sp-n">{p.name}</span>
          <span className="wh-sp-sub">{p.sub}</span>
          {WH_DROPS[p.id] ? <span className="wh-sp-drop">▼ {WH_DROPS[p.id]}% · was {wsEuro(whWasPrice(p))}</span> : null}
        </span>
        <button className={`wh-heart in-pop ${wished ? 'on' : ''}`} onClick={(e) => { stop(e); onToggleWish && onToggleWish(p.id); }} aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}>{WH_HEART({})}</button>
      </div>
      <WhSpecRows p={p} />
      {boxes > 0 ? (
        <button className="wh-radd wh-sp-add in" onClick={(e) => { stop(e); onAddBox(p); }}>{WI.check({})}<span className="bx">{ppQty(p, boxes)} in cart</span></button>
      ) : (
        <button className="wh-radd wh-sp-add" onClick={(e) => { stop(e); onAddBox(p); }}>{OBI.box({})}Add {ppQty(p, ppLot(p))}</button>
      )}
    </div>
  );
}

/* ---------------- order cutoff / next truck ---------------- */
function WhCutoff() {
  const { useState, useEffect } = React;
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const d = new Date(now);
  const cutoff = new Date(now);
  cutoff.setHours(14, 0, 0, 0);
  let nextDay = false;
  if (d >= cutoff) { cutoff.setDate(cutoff.getDate() + 1); nextDay = true; }
  const ms = cutoff - d;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  const deliver = new Date(cutoff); deliver.setDate(deliver.getDate() + 1);
  const delLabel = deliver.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
  return (
    <div className="wh-rail-card wh-cutoff">
      <div className="wh-rc-head">
        <span className="ic">{WI.clock({})}</span>
        <h3>Auction cutoff</h3>
      </div>
      <div className="wh-cutoff-body">
        <div className="wh-count">
          <span className="t">{pad(h)}:{pad(m)}:{pad(s)}</span>
          <span className="lbl">until 14:00 CET</span>
        </div>
        <p className="wh-cutoff-note">
          Order before <b>14:00{nextDay ? ' tomorrow' : ''}</b> to ship on the next truck for <b>{delLabel}</b> delivery.
        </p>
        <div className="wh-cutoff-truck">
          {OBI.truck({})}
          <span className="tx">
            <span className="tt">Next truck · today 14:00</span>
            <span className="ts">Aalsmeer → EU road &amp; air-freight lanes</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- credit line + open invoices ---------------- */
function WhCredit({ onNavigate }) {
  const a = WS_ACCOUNT;
  const available = a.creditLimit - a.creditUsed;
  const pct = Math.min(100, Math.round((a.creditUsed / a.creditLimit) * 100));
  const openTotal = a.openInvoices.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="wh-rail-card">
      <div className="wh-rc-head">
        <span className="ic" style={{ background: 'color-mix(in oklab, var(--accent), #fff 84%)', color: 'var(--accent-deep)' }}>{CI.card({})}</span>
        <h3>Credit line</h3>
        <button className="more" aria-label="Open billing" onClick={() => onNavigate && onNavigate('home')}>{OBI.fwd({})}</button>
      </div>
      <div className="wh-credit-body">
        <div className="wh-credit-top">
          <span className="wh-credit-avail">{whEuroK(available)}</span>
          <span className="wh-credit-of">available of {whEuroK(a.creditLimit)}</span>
        </div>
        <div className="wh-credit-bar"><div className="wh-credit-fill" style={{ width: pct + '%' }} /></div>
        <div className="wh-credit-foot">
          <span className="used">{whEuroK(a.creditUsed)} in use</span>
          <span>{pct}% utilised</span>
        </div>
      </div>
      <div className="wh-inv">
        {a.openInvoices.map((inv) => (
          <div className="wh-inv-row" key={inv.id}>
            <span className="wh-inv-ic">{OBI.doc({})}</span>
            <span className="wh-inv-x">
              <span className="wh-inv-id">{inv.id}</span>
              <span className={`wh-inv-due ${inv.dueInDays <= 7 ? 'soon' : ''}`}>{inv.period} · due in {inv.dueInDays} days</span>
            </span>
            <span className="wh-inv-amt">{wsEuro(inv.amount)}</span>
          </div>
        ))}
        <div className="wh-inv-row" style={{ background: '#FCFAF5' }}>
          <span className="wh-inv-x"><span className="wh-inv-id">{a.openInvoices.length} open invoices</span></span>
          <span className="wh-inv-amt">{wsEuro(openTotal)}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- live quick-cart (sticky bulk entry) ---------------- */
function WsQuickCart({ lines, subtotal, units, minOrder, onInc, onDec, onCheckout }) {
  const meetsMin = subtotal >= minOrder;
  return (
    <div className="wh-rail-card wh-cart">
      <div className="wh-rc-head">
        <span className="ic">{WI.cart({})}</span>
        <h3>Your basket</h3>
        {units > 0 && <span className="wh-cart-count">{units}</span>}
      </div>
      {lines.length === 0 ? (
        <div className="wh-cart-empty">
          <span className="ec">{WI.cart({})}</span>
          <p>Add boxes from the grid — they stack up here for fast bulk checkout.</p>
        </div>
      ) : (
        <div className="wh-cart-list">
          {lines.map(({ p, qty }) => {
            const cat = WS_CAT_MAP[p.cat] || {};
            return (
              <div className="wh-cl" key={p.id}>
                <span className="wh-cl-thumb" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")` }} />
                <span className="wh-cl-x">
                  <span className="wh-cl-n">{p.name}</span>
                  <span className="wh-cl-step">
                    <button onClick={() => onDec(p.id)} aria-label="Less">{WI.minus({})}</button>
                    <span className="n">{qty}</span>
                    <button onClick={() => onInc(p.id)} aria-label="More">{WI.plus({})}</button>
                  </span>
                </span>
                <span className="wh-cl-amt">{wsEuro(ppLineTotal(p, qty))}</span>
              </div>
            );
          })}
        </div>
      )}
      <div className="wh-cart-foot">
        <div className="wh-cart-sub">
          <span className="l">Subtotal · excl. VAT</span>
          <span className="v">{wsEuro(subtotal)}</span>
        </div>
        <div className={`wh-cart-min ${meetsMin ? 'ok' : 'under'}`}>
          {meetsMin ? WI.check({}) : OBI.info({})}
          {meetsMin ? <span>Wholesale minimum met</span> : <span>{wsEuro(minOrder - subtotal)} to {wsEuro(minOrder)} minimum</span>}
        </div>
        <button className="wh-cart-cta" onClick={onCheckout} disabled={units === 0}>{WI.cart({})}Review &amp; checkout</button>
      </div>
    </div>
  );
}

/* ---------------- wishlist store ---------------- */
function loadWishlist() {
  try { const raw = localStorage.getItem('pp_wishlist'); if (raw) return JSON.parse(raw); } catch (e) {}
  return ['p-sarah', 'r-rednaomi', 's-hydrangea'];
}
function saveWishlist(ids) { try { localStorage.setItem('pp_wishlist', JSON.stringify(ids)); } catch (e) {} }
const WH_HEART = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20s-7-4.4-9.2-8.5C1.3 8.4 2.7 5 5.9 5 8 5 9.4 6.5 12 9c2.6-2.5 4-4 6.1-4 3.2 0 4.6 3.4 3.1 6.5C19 15.6 12 20 12 20z"/></svg>);

/* ---------------- combined rail panel: cart / wishlist / history ---------------- */
function WhRailPanel({ lines, subtotal, units, minOrder, onInc, onDec, onAddBox, onCheckout, onOpenDetail, onNavigate, wish, onToggleWish }) {
  const { useState } = React;
  const [tab, setTab] = useState('cart');
  const meetsMin = subtotal >= minOrder;
  const wishProducts = wish.map((id) => WS_PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  let orders = [];
  try { orders = (typeof loadOrders === 'function') ? loadOrders() : []; } catch (e) {}
  const history = orders.slice(0, 6);
  return (
    <div className="wh-rail-card wh-panelcard">
      <div className="wh-tabbar" role="tablist">
        <button role="tab" className={`wh-tab ${tab === 'cart' ? 'on' : ''}`} onClick={() => setTab('cart')}>
          {WI.cart({})}<span>Cart</span>{units > 0 && <span className="wh-tab-b">{units}</span>}
        </button>
        <button role="tab" className={`wh-tab ${tab === 'wishlist' ? 'on' : ''}`} onClick={() => setTab('wishlist')}>
          {WH_HEART({})}<span>Wishlist</span>{wishProducts.length > 0 && <span className="wh-tab-b">{wishProducts.length}</span>}
        </button>
        <button role="tab" className={`wh-tab ${tab === 'history' ? 'on' : ''}`} onClick={() => setTab('history')}>
          {WI.clock({})}<span>History</span>
        </button>
      </div>

      {tab === 'cart' && (
        <div className="wh-tab-body cart">
          {lines.length === 0 ? (
            <div className="wh-cart-empty"><span className="ec">{WI.cart({})}</span><p>Add boxes from the grid — they stack up here for fast bulk checkout.</p></div>
          ) : (
            <div className="wh-cart-list">
              {lines.map(({ p, qty }) => {
                const cat = WS_CAT_MAP[p.cat] || {};
                return (
                  <div className="wh-cl" key={p.id}>
                    <span className="wh-cl-thumb" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")` }} />
                    <span className="wh-cl-x">
                      <span className="wh-cl-n">{p.name}</span>
                      <span className="wh-cl-step">
                        <button onClick={() => onDec(p.id)} aria-label="Less">{WI.minus({})}</button>
                        <span className="n">{qty}</span>
                        <button onClick={() => onInc(p.id)} aria-label="More">{WI.plus({})}</button>
                      </span>
                    </span>
                    <span className="wh-cl-amt">{wsEuro(ppLineTotal(p, qty))}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="wh-cart-foot">
            <div className="wh-cart-sub"><span className="l">Subtotal · excl. VAT</span><span className="v">{wsEuro(subtotal)}</span></div>
            <div className={`wh-cart-min ${meetsMin ? 'ok' : 'under'}`}>
              {meetsMin ? WI.check({}) : OBI.info({})}
              {meetsMin ? <span>Wholesale minimum met</span> : <span>{wsEuro(minOrder - subtotal)} to {wsEuro(minOrder)} minimum</span>}
            </div>
            <button className="wh-cart-cta" onClick={onCheckout} disabled={units === 0}>{WI.cart({})}Review &amp; checkout</button>
          </div>
        </div>
      )}

      {tab === 'wishlist' && (
        <div className="wh-tab-body">
          {wishProducts.length === 0 ? (
            <div className="wh-cart-empty"><span className="ec">{WH_HEART({})}</span><p>Tap the heart on any variety to save it here for quick reordering.</p></div>
          ) : (
            <div className="wh-wishlist">
              {wishProducts.map((p) => {
                const cat = WS_CAT_MAP[p.cat] || {};
                return (
                  <div className="wh-wl" key={p.id}>
                    <span className="wh-cl-thumb" role="button" tabIndex={0} onClick={() => onOpenDetail && onOpenDetail(p)} style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")` }} />
                    <span className="wh-wl-x" role="button" tabIndex={0} onClick={() => onOpenDetail && onOpenDetail(p)}>
                      <span className="wh-cl-n">{p.name}</span>
                      <span className="wh-wl-price">{ppFromText(p)} <span className="u">/ {ppUnit(p)}</span></span>
                    </span>
                    <span className="wh-wl-act">
                      <button className="wh-wl-add" onClick={() => onAddBox(p)} aria-label="Add box">{OBI.box({})}</button>
                      <button className="wh-wl-rm" onClick={() => onToggleWish(p.id)} aria-label="Remove from wishlist">{WI.trash({})}</button>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="wh-tab-body">
          <div className="wh-hist">
            {history.map((o) => {
              const tot = ordSubtotal(o);
              const u = ordUnits(o);
              const names = o.lines.map((l) => l.name).join(', ');
              return (
                <div className="wh-ho" key={o.id}>
                  <div className="wh-ho-top"><span className="wh-ho-id">{o.id}</span><span className="wh-ho-date">{ordRel(o.placedAt)}</span></div>
                  <div className="wh-ho-names">{names}</div>
                  <div className="wh-ho-foot">
                    <span className="wh-ho-meta">{u} units · {wsEuro(tot)}</span>
                    <button className="wh-ho-re" onClick={() => { o.lines.forEach((l) => { const pp = WS_PRODUCTS.find((x) => x.id === l.id); if (pp) onAddBox(pp); }); }}>{WI.cart({})} Reorder</button>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="wh-hist-all" onClick={() => onNavigate && onNavigate('orders')}>View all orders {OBI.fwd({})}</button>
        </div>
      )}
    </div>
  );
}

/* ---------------- promotions carousel ---------------- */
const WH_PROMOS = [
  { tint: 'oklch(0.92 0.05 5)',   eyebrow: 'In season · June',  icon: WI.star,  title: 'Peony peak is here',
    sub: 'A1 Extra Sarah Bernhardt, cut to order from Dutch growers — book before the clock closes.', cta: 'Shop peonies', cat: 'peonies', img: 'p-sarah' },
  { tint: 'oklch(0.95 0.012 70)', eyebrow: 'This week only', icon: OBI.truck, title: 'Free freight over € 2.500',
    sub: 'Full-truck EU orders ship freight-free through Sunday. Fill a box, save on logistics.', cta: 'Browse assortment', cat: 'all', img: null },
  { tint: 'oklch(0.93 0.045 22)', eyebrow: 'Air-freight fresh', icon: WI.clock, title: 'Kenyan & Dutch roses',
    sub: 'Velvet Red Naomi and 50 cm+ stems landing daily on the 2-day lanes.', cta: 'Shop roses', cat: 'roses', img: 'r-rednaomi' },
  { tint: 'oklch(0.93 0.05 145)', eyebrow: 'Restocked', icon: WI.leaf, title: 'Wedding foliage, back in',
    sub: 'Silver-dollar eucalyptus and Italian ruscus — graded and sold by the box.', cta: 'Shop greens', cat: 'greens', img: 'gr-euc' },
];

function WhPromoBar({ onGoCatalogue }) {
  const { useState, useEffect, useRef } = React;
  const [i, setI] = useState(0);
  const paused = useRef(false);
  const n = WH_PROMOS.length;
  useEffect(() => {
    const t = setInterval(() => { if (!paused.current) setI((x) => (x + 1) % n); }, 4500);
    return () => clearInterval(t);
  }, [n]);
  const s = WH_PROMOS[i];
  return (
    <div className="wh-promo" style={{ '--tint': s.tint }}
      onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}>
      <div className="wh-promo-content" key={i}>
        <span className="wh-promo-badge">{s.icon({})}{s.eyebrow}</span>
        <span className="wh-promo-msg"><b>{s.title}</b> — {s.sub}</span>
      </div>
      <div className="wh-promo-dots">
        {WH_PROMOS.map((_, idx) => (
          <button key={idx} className={`wh-promo-dot ${idx === i ? 'on' : ''}`} onClick={() => setI(idx)} aria-label={`Promotion ${idx + 1}`} />
        ))}
      </div>
      <button className="wh-promo-cta" onClick={() => onGoCatalogue(s.cat)}><span>{s.cta}</span>{OBI.fwd({})}</button>
    </div>
  );
}

/* ---------------- all-categories column (1688-style) ---------------- */
function WhCategoryList({ catCounts, onGoCatalogue, onOpenDetail, onGoColour, onGoTag }) {
  const colourCounts = {};
  WS_PRODUCTS.forEach((p) => { colourCounts[p.colour] = (colourCounts[p.colour] || 0) + 1; });
  const colours = WS_COLOURS.filter((c) => colourCounts[c.id]);
  const badgeCounts = {};
  WS_PRODUCTS.forEach((p) => { if (p.badge) badgeCounts[p.badge] = (badgeCounts[p.badge] || 0) + 1; });
  const tags = Object.keys(badgeCounts);
  return (
    <aside className="wh-cats-col">
      <div className="wh-cats-card">
        <div className="wh-cats-head">{OBI.dash({ width: 16, height: 16 })}All categories</div>
        <div className="wh-cats-rows">
          {WS_CATS.filter((c) => c.id !== 'all').map((c) => {
            const prods = WS_PRODUCTS.filter((p) => p.cat === c.id);
            return (
              <div key={c.id} className="wh-cats-row" role="button" tabIndex={0}
                onClick={() => onGoCatalogue(c.id)} onKeyDown={(e) => e.key === 'Enter' && onGoCatalogue(c.id)}>
                <span className="dot" style={{ background: c.tint }} />
                <span className="lbl">{c.label}</span>
                <span className="n">{catCounts[c.id] || 0}</span>
                <span className="chev">{OBI.chev({})}</span>

                {/* hover flyout — products in this category */}
                <div className="wh-cat-flyout">
                  <div className="wh-cat-flyout-inner">
                    <div className="fly-head">
                      <span className="dot" style={{ background: c.tint }} />
                      <span className="fh-lbl">{c.label}</span>
                      <span className="fh-n">{prods.length} {prods.length === 1 ? 'variety' : 'varieties'}</span>
                    </div>
                    <div className="fly-grid">
                      {prods.slice(0, 6).map((p) => {
                        return (
                          <div key={p.id} className="fly-item"
                            onClick={(e) => { e.stopPropagation(); onOpenDetail ? onOpenDetail(p) : onGoCatalogue(c.id); }}>
                            <span className="fly-thumb" style={{ '--ph-tint': c.tint, backgroundImage: `url("${wsShot(p.id)}")` }} />
                            <span className="fly-name">{p.name}</span>
                            <span className="fly-price">{ppFromText(p)}<span className="u"> / {ppUnit(p)}</span></span>
                          </div>
                        );
                      })}
                    </div>
                    <button className="fly-all" onClick={(e) => { e.stopPropagation(); onGoCatalogue(c.id); }}>
                      Shop all {c.label} {OBI.fwd({})}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button className="wh-cats-all" onClick={() => onGoCatalogue('all')}>View full assortment {OBI.fwd({})}</button>
      </div>

      {/* colours panel */}
      <div className="wh-cats-card">
        <div className="wh-cats-head">{WI.leaf({ width: 16, height: 16 })}Colours</div>
        <div className="wh-chips">
          {colours.map((c) => (
            <button key={c.id} className="wh-chip" onClick={() => onGoColour && onGoColour(c.id)}>
              <span className={`wh-sw ${c.hex === 'mixed' ? 'mixed' : ''}`} style={c.hex === 'mixed' ? {} : { background: c.hex }} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* tags panel */}
      <div className="wh-cats-card">
        <div className="wh-cats-head">{WI.spark({ width: 16, height: 16 })}Tags</div>
        <div className="wh-chips">
          {tags.map((b) => (
            <button key={b} className={`wh-chip tag ${whBadgeClass(b)}`} onClick={() => onGoTag && onGoTag(b)}>
              {whBadgeIcon(b)({})}{b}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ---------------- the command center ---------------- */

// curated bestseller list (a real store would rank by sales volume)
const WH_BESTSELLERS = ['r-rednaomi', 'r-avalanche', 't-stronggold', 'c-bacardi', 'g-intenzz', 'gr-euc'];

// week-on-week clock price drops, in % (a real store would diff against last week's average)
const WH_DROPS = {
  'r-athena': 22, 't-negrita': 19, 'c-anastasia': 17, 'gr-ruscus': 15, 'g-germini': 14,
  'pl-kalanchoe': 13, 'r-quicksand': 12, 'gr-salal': 11, 's-lisianthus': 9, 'pl-succulent': 8,
};
const whWasPrice = (p) => p.perStem / (1 - (WH_DROPS[p.id] || 0) / 100);

/* quick-filter carousel — preset shortcuts into the catalogue */
function WhQuickFilters({ onGoFilter, onOpenDetail, rail, limit }) {
  const allDefs = [
    { id: 'top',     icon: WI.star,  shot: 'r-rednaomi', label: 'Top sellers',        tint: 'oklch(0.93 0.06 45)',  match: (p) => WH_BESTSELLERS.includes(p.id), preset: { filters: { ids: WH_BESTSELLERS } } },
    { id: 'instock', icon: WI.check, shot: 't-stronggold', label: 'In stock now',       tint: 'oklch(0.93 0.05 145)', match: (p) => whAvail(p).level === 'high',   preset: { filters: { avail: ['high'] } } },
    { id: 'value',   icon: WI.euro,  shot: 'r-athena', label: 'Best value',         tint: 'oklch(0.94 0.05 95)',  match: (p) => p.perStem <= 0.45,             preset: { filters: { maxPrice: 0.45 }, sort: 'price-asc' } },
    { id: 'long',    icon: WI.ruler, shot: 'r-avalanche', label: 'Long stem · 65 cm+', tint: 'oklch(0.92 0.045 250)', match: (p) => p.stemCm >= 66,               preset: { filters: { lengths: ['long'] }, sort: 'stem-desc' } },
    { id: 'fresh',   icon: WI.clock, shot: 'r-quicksand', label: 'Auction-fresh',      tint: 'oklch(0.93 0.045 22)', match: (p) => p.badge === 'Auction-fresh',   preset: { filters: { badges: ['Auction-fresh'] } } },
    { id: 'new',     icon: WI.spark, shot: 'c-anastasia', label: 'New this week',       tint: 'oklch(0.93 0.045 320)', match: (p) => p.badge === 'New',            preset: { filters: { badges: ['New'] } } },
    { id: 'vase',    icon: WI.drop,  shot: 'gr-euc', label: 'Long vase life',     tint: 'oklch(0.93 0.05 200)', match: (p) => p.vase >= 14,                  preset: { filters: { vase: [14] } } },
    { id: 'eco',     icon: WI.shield, shot: 'p-sarah', label: 'Sustainable · MPS', tint: 'oklch(0.93 0.05 150)', match: (p) => p.certs.includes('mps'),       preset: { filters: { certs: ['mps'] } } },
    { id: 'season',  icon: WI.leaf,  shot: 't-dynasty', label: 'Seasonal peak',      tint: 'oklch(0.92 0.05 350)', match: (p) => p.cat === 'season',            preset: { filters: { cat: 'season' } } },
  ];
  const defs = limit ? allDefs.slice(0, limit) : allDefs;
  return (
    <div className={`wh-quick ${rail ? 'rail' : ''}`} role="list">
      {defs.map((d) => {
        const matches = WS_PRODUCTS.filter(d.match);
        const n = matches.length;
        return (
          <div key={d.id} className="wh-qf" role="button" tabIndex={0} style={rail ? undefined : { background: d.tint }}
            onClick={() => onGoFilter && onGoFilter(d.preset)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onGoFilter && onGoFilter(d.preset); } }}>
            <span className="wh-qf-ic" style={rail ? { backgroundImage: `url("${wsShot(d.shot)}")` } : { background: d.tint }}>
              {rail ? <span className="wh-qf-badge" style={{ background: d.tint }}>{d.icon({ width: 13, height: 13 })}</span> : d.icon({})}
            </span>
            <span className="wh-qf-tx">
              <span className="wh-qf-l">{d.label}</span>
              <span className="wh-qf-n" style={rail ? { background: d.tint } : undefined}>{n} {n === 1 ? 'variety' : 'varieties'}</span>
            </span>
            <span className="wh-qf-go">{OBI.fwd({})}</span>

            {rail && (
              <div className="wh-cat-flyout wh-qf-flyout">
                <div className="wh-cat-flyout-inner">
                  <div className="fly-head">
                    <span className="fh-ic">{d.icon({ width: 16, height: 16 })}</span>
                    <span className="fh-lbl">{d.label}</span>
                    <span className="fh-n">{n} {n === 1 ? 'variety' : 'varieties'}</span>
                  </div>
                  <div className="fly-grid">
                    {matches.slice(0, 6).map((p) => {
                      const cat = WS_CAT_MAP[p.cat] || {};
                      return (
                        <div key={p.id} className="fly-item"
                          onClick={(e) => { e.stopPropagation(); onOpenDetail ? onOpenDetail(p) : onGoFilter(d.preset); }}>
                          <span className="fly-thumb" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")` }} />
                          <span className="fly-name">{p.name}</span>
                          <span className="fly-price">{ppFromText(p)}<span className="u"> / {ppUnit(p)}</span></span>
                        </div>
                      );
                    })}
                  </div>
                  <button className="fly-all" onClick={(e) => { e.stopPropagation(); onGoFilter && onGoFilter(d.preset); }}>
                    Shop all · {d.label} {OBI.fwd({})}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- top account bar (Amazon-style chrome, no search) ---------------- */
function WhBarCountdown() {
  const { useState, useEffect } = React;
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const d = new Date(now);
  const cutoff = new Date(now); cutoff.setHours(14, 0, 0, 0);
  if (d >= cutoff) cutoff.setDate(cutoff.getDate() + 1);
  const ms = cutoff - d;
  const pad = (n) => String(n).padStart(2, '0');
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
  return (
    <span className="wh-tb-item wh-tb-cutoff">
      {WI.clock({})}
      <span className="wh-tb-x"><span className="k">Auction cutoff</span><span className="v">{pad(h)}:{pad(m)}:{pad(s)}</span></span>
    </span>
  );
}

function WhTopBar({ balance, outstanding, units, subtotal, onTopUp, onCheckout, onProfile }) {
  return (
    <div className="wh-topbar">
      <button className="wh-tb-loc" type="button">
        {WI.pin({})}
        <span className="wh-tb-locx">
          <span className="s">Delivering to</span>
          <span className="b">{CUSTOMER.location}<span className="upd">Update location</span></span>
        </span>
      </button>
      <div className="wh-tb-right">
        <button className="wh-tb-item tap" type="button" onClick={onTopUp}>
          <span className="wh-tb-x"><span className="k">Balance</span><span className="v">{tuEuro(balance)}</span></span>
          <span className="wh-tb-topup">{WI.plus({})} Top up</span>
        </button>
        <span className="wh-tb-item">
          <span className="wh-tb-x"><span className="k">Outstanding</span><span className="v">{wsEuro(outstanding)}</span></span>
        </span>
        <span className="wh-tb-div" />
        <WhBarCountdown />
        <button className="wh-tb-basket" type="button" onClick={onCheckout} disabled={units === 0}>
          <span className="wh-tb-cart">{WI.cart({})}{units > 0 && <span className="b">{units}</span>}</span>
          <span className="wh-tb-x"><span className="k">Basket</span><span className="v">{wsEuro(subtotal)}</span></span>
        </button>
        <span className="wh-tb-div" />
        <button className="wh-tb-profile" type="button" onClick={onProfile}>
          <span className="wh-tb-ava">{(CUSTOMER.name || '?').trim()[0]}</span>
          <span className="wh-tb-x"><span className="k">Hello</span><span className="v">{CUSTOMER.name}</span></span>
        </button>
      </div>
    </div>
  );
}

const WH_LENGTHS = [
  { v: '30–40 cm', note: 'Short · fillers' },
  { v: '40–50 cm', note: 'Standard bunch' },
  { v: '50–60 cm', note: 'Most ordered' },
  { v: '60–70 cm', note: 'Premium' },
  { v: '70–80 cm', note: 'Extra long' },
  { v: '80 cm +', note: 'Show grade' },
];

/* ---------------- delivery-day calendar popover ---------------- */
function WhCalPop({ selected, onPick }) {
  const { useState } = React;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const monthLbl = view.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const firstDow = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7; // Mon=0
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = [...Array(firstDow).fill(null), ...Array(days)].map((v, i) => v === null && i < firstDow ? null : (i - firstDow + 1));
  const step = (d) => setView(new Date(view.getFullYear(), view.getMonth() + d, 1));
  const selKey = selected ? selected : '';
  return (
    <div className="wh-cal">
      <div className="wh-cal-head">
        <button className="wh-cal-nav" onClick={() => step(-1)} disabled={view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth()} aria-label="Previous month">{OBI.back({})}</button>
        <span className="wh-cal-title">{monthLbl}</span>
        <button className="wh-cal-nav" onClick={() => step(1)} aria-label="Next month">{OBI.fwd({})}</button>
      </div>
      <div className="wh-cal-dow">{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <span key={d}>{d}</span>)}</div>
      <div className="wh-cal-grid">
        {cells.map((n, i) => {
          if (n === null) return <span key={i} className="wh-cal-cell empty" />;
          const date = new Date(view.getFullYear(), view.getMonth(), n);
          const past = date < today;
          const isSun = date.getDay() === 0;
          const dis = past || isSun; // no Sunday auction
          const lbl = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
          const isToday = date.getTime() === today.getTime();
          return (
            <button key={i} className={`wh-cal-cell ${dis ? 'dis' : ''} ${selKey === lbl ? 'sel' : ''} ${isToday ? 'today' : ''}`}
              disabled={dis} onClick={() => onPick(lbl)}>{n}</button>
          );
        })}
      </div>
      <p className="wh-cal-note">{WI.clock({})} Auction cut-off 22:00 CET the evening before · no Sunday delivery</p>
    </div>
  );
}

/* ---------------- full filter modal (Airbnb-style, flower-industry facets) ---------------- */
const WH_FILTER_BASE = { cat: 'all', types: [], colours: [], lengths: [], avail: [], origins: [], growers: [], badges: [], grades: [], ripe: [], vase: [], certs: [], scent: false, maxPrice: null, ids: null };

function whFilterMatch(f, p) {
  if (f.cat && f.cat !== 'all' && p.cat !== f.cat) return false;
  if (f.ids && !f.ids.includes(p.id)) return false;
  if (f.colours.length && !f.colours.includes(p.colour)) return false;
  if (f.types.length && !f.types.includes(wsType(p))) return false;
  if (f.maxPrice != null && p.perStem > f.maxPrice) return false;
  if (f.grades.length && !f.grades.includes(wsGradeId(p))) return false;
  if (f.ripe.length && !f.ripe.includes(p.ripe)) return false;
  if (f.vase.length && !f.vase.some((min) => p.vase >= min)) return false;
  if (f.certs.length && !f.certs.some((c) => p.certs.includes(c))) return false;
  if (f.scent && !p.scent) return false;
  if (f.lengths.length && !f.lengths.some((id) => { const Lr = WS_LENGTHS.find((x) => x.id === id); return Lr && Lr.test(p.stemCm); })) return false;
  if (f.avail.length && !f.avail.includes(whAvail(p).level)) return false;
  if (f.origins.length && !f.origins.includes(p.oc)) return false;
  if (f.growers.length && !f.growers.includes(p.grower)) return false;
  if (f.badges && f.badges.length && !f.badges.includes(p.badge)) return false;
  return true;
}

const WH_FM_RECS = [
  { id: 'instock', icon: WI.check, label: 'In stock today', patch: (f) => ({ avail: f.avail.includes('high') ? f.avail.filter((x) => x !== 'high') : [...f.avail, 'high'] }), on: (f) => f.avail.includes('high') },
  { id: 'fresh',   icon: WI.clock, label: 'Auction-fresh',  patch: (f) => ({ badges: f.badges.includes('Auction-fresh') ? f.badges.filter((x) => x !== 'Auction-fresh') : [...f.badges, 'Auction-fresh'] }), on: (f) => f.badges.includes('Auction-fresh') },
  { id: 'long',    icon: WI.ruler, label: 'Long stem 60cm+', patch: (f) => ({ lengths: f.lengths.includes('long') ? f.lengths.filter((x) => x !== 'long') : [...f.lengths, 'long'] }), on: (f) => f.lengths.includes('long') },
  { id: 'eco',     icon: WI.shield, label: 'Sustainable',    patch: (f) => ({ certs: f.certs.includes('mps') ? f.certs.filter((x) => x !== 'mps') : [...f.certs, 'mps'] }), on: (f) => f.certs.includes('mps') },
];

function WhFmSection({ icon, title, children }) {
  return (
    <div className="wh-fm-sec">
      <div className="wh-fm-sec-h">{icon && <span className="ic">{icon({ width: 17, height: 17 })}</span>}{title}</div>
      {children}
    </div>
  );
}

function WhFilterModal({ onClose, onApply }) {
  const { useState, useMemo } = React;
  const [f, setF] = useState(WH_FILTER_BASE);
  const patch = (obj) => setF((cur) => ({ ...cur, ...obj }));
  const toggle = (key, id) => setF((cur) => ({ ...cur, [key]: cur[key].includes(id) ? cur[key].filter((x) => x !== id) : [...cur[key], id] }));
  const setCat = (id) => setF((cur) => ({ ...cur, cat: cur.cat === id ? 'all' : id }));
  const setType = (id) => setF((cur) => ({ ...cur, types: id === 'any' ? [] : [id] }));

  const allOrigins = useMemo(() => { const seen = {}; const out = []; WS_PRODUCTS.forEach((p) => { if (!seen[p.oc]) { seen[p.oc] = 1; out.push({ oc: p.oc, origin: p.origin }); } }); return out; }, []);
  const allGrowers = useMemo(() => [...new Set(WS_PRODUCTS.map((p) => p.grower))].sort(), []);
  const groups = WS_CATS.filter((c) => c.id !== 'all' && c.id !== 'accessories');
  const count = useMemo(() => WS_PRODUCTS.filter((p) => whFilterMatch(f, p)).length, [f]);
  const activeCount = f.types.length + f.colours.length + f.lengths.length + f.avail.length + f.origins.length
    + f.growers.length + f.badges.length + f.grades.length + f.ripe.length + f.vase.length + f.certs.length
    + (f.scent ? 1 : 0) + (f.maxPrice != null ? 1 : 0) + (f.cat !== 'all' ? 1 : 0);
  const priceVal = f.maxPrice == null ? WS_PRICE_MAX : f.maxPrice;

  return (
    <div className="wh-fm-overlay" onClick={onClose}>
      <div className="wh-fm" role="dialog" aria-modal="true" aria-label="Filters" onClick={(e) => e.stopPropagation()}>
        <header className="wh-fm-head">
          <button className="wh-fm-x" onClick={onClose} aria-label="Close">{OBI.close({})}</button>
          <h2>Filters</h2>
        </header>

        <div className="wh-fm-body">
          <WhFmSection icon={WI.leaf} title="Application">
            <div className="wh-fm-seg">
              {[{ id: 'any', label: 'Any' }, ...WS_TYPES].map((t) => (
                <button key={t.id} type="button" className={`wh-fm-segbtn ${(t.id === 'any' ? f.types.length === 0 : f.types.includes(t.id)) ? 'on' : ''}`} onClick={() => setType(t.id)}>{t.label}</button>
              ))}
            </div>
          </WhFmSection>

          <WhFmSection icon={SPEC_ICONS.factory} title="Main group">
            <div className="wh-fm-chips">
              {groups.map((c) => (
                <button key={c.id} type="button" className={`wh-fm-chip ${f.cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>
                  <span className="dot" style={{ background: c.tint }} />{c.label}
                </button>
              ))}
            </div>
          </WhFmSection>

          <WhFmSection icon={SPEC_ICONS.brush} title="Colour">
            <div className="wh-fm-swatches">
              {WS_COLOURS.map((c) => (
                <button key={c.id} type="button" className={`wh-fm-swatch ${f.colours.includes(c.id) ? 'on' : ''}`} onClick={() => toggle('colours', c.id)} title={c.label}>
                  <span className={`sw ${c.hex === 'mixed' ? 'mixed' : ''}`} style={c.hex !== 'mixed' ? { background: c.hex } : undefined} />
                  <span className="swl">{c.label}</span>
                </button>
              ))}
            </div>
          </WhFmSection>

          <WhFmSection icon={WI.ruler} title="Stem length">
            <div className="wh-fm-chips">
              {WS_LENGTHS.map((l) => (
                <button key={l.id} type="button" className={`wh-fm-chip ${f.lengths.includes(l.id) ? 'on' : ''}`} onClick={() => toggle('lengths', l.id)}>{l.label} · {l.range}</button>
              ))}
            </div>
          </WhFmSection>

          <WhFmSection icon={WI.euro} title="Price per stem">
            <div className="wh-fm-price">
              <div className="wh-fm-price-row"><span>Up to</span><span className="v">{wsEuro(priceVal)}{f.maxPrice == null ? '+' : ''}</span></div>
              <input type="range" className="wh-fm-range" min={WS_PRICE_MIN} max={WS_PRICE_MAX} step="0.01"
                style={{ '--fill': (((priceVal - WS_PRICE_MIN) / (WS_PRICE_MAX - WS_PRICE_MIN)) * 100) + '%' }}
                value={priceVal} onChange={(e) => patch({ maxPrice: parseFloat(e.target.value) >= WS_PRICE_MAX ? null : parseFloat(e.target.value) })} />
              <div className="wh-fm-price-ends"><span>{wsEuro(WS_PRICE_MIN)}</span><span>{wsEuro(WS_PRICE_MAX)}+</span></div>
            </div>
          </WhFmSection>

          <WhFmSection icon={SPEC_ICONS.globe} title="Country of origin">
            <div className="wh-fm-chips">
              {allOrigins.map((o) => (
                <button key={o.oc} type="button" className={`wh-fm-chip ${f.origins.includes(o.oc) ? 'on' : ''}`} onClick={() => toggle('origins', o.oc)}>
                  <span className="flag">{whFlag(o.oc)}</span>{o.origin}
                </button>
              ))}
            </div>
          </WhFmSection>

          <WhFmSection icon={SPEC_ICONS.factory} title="Grower">
            <div className="wh-fm-growers">
              {allGrowers.map((g) => (
                <button key={g} type="button" className={`wh-fm-check ${f.growers.includes(g) ? 'on' : ''}`} onClick={() => toggle('growers', g)}>
                  <span className="box">{WI.check({})}</span>{g}
                </button>
              ))}
            </div>
          </WhFmSection>
        </div>

        <footer className="wh-fm-foot">
          <button type="button" className="wh-fm-clear" onClick={() => setF(WH_FILTER_BASE)} disabled={activeCount === 0}>Clear all</button>
          <button type="button" className="wh-fm-show" onClick={() => onApply({ filters: f })}>Show {count} {count === 1 ? 'product' : 'products'}</button>
        </footer>
      </div>
    </div>
  );
}

function WsCommandCenter({ cart, catCounts, onAddBox, onSubBox, onOpenDetail, onGoCatalogue, onSearch, onGoColour, onGoTag, onGoFilter, lines, subtotal, units, minOrder, onInc, onDec, onCheckout, onNavigate, scope, setScope }) {
  const { useState } = React;
  const [q, setQ] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSeg, setOpenSeg] = useState(null); // 'search' | 'grower' | 'len' | null
  const [secView, setSecView] = useState('photo'); // browse cards: 'photo' | 'grid'
  const [grower, setGrower] = useState(null);
  const [len, setLen] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const browse = scope !== 'foryou';
  const toggleFilter = (f) => setActiveFilters((a) => a.includes(f) ? a.filter((x) => x !== f) : [...a, f]);
  const flowerFilters = scope === 'flowers'
    ? ['In stock today', 'Cutflowers', 'Roses', 'Tulips', 'Peonies', 'Clock Pre-sales', '60 cm+', 'Pots', 'Extras']
    : scope === 'plants'
    ? ['In stock today', 'Green plants', 'Flowering plants', 'Orchids', 'Arrangements', 'Pot size 12+', 'Pots', 'Extras']
    : ['In stock today', '60 cm+', 'A1 grade', 'Holland', 'By colour', 'Fragrant', 'Under €0.50/stem', 'Fair Trade'];
  const [balance, setBalance] = useState(() => (typeof loadBalance === 'function' ? loadBalance() : 0));
  const [topOpen, setTopOpen] = useState(false);
  const [wish, setWish] = useState(loadWishlist);
  const toggleWish = (id) => setWish((w) => { const n = w.includes(id) ? w.filter((x) => x !== id) : [id, ...w]; saveWishlist(n); return n; });
  const outstanding = WS_ACCOUNT.openInvoices.reduce((s, i) => s + i.amount, 0);
  const submit = () => { if (q.trim()) onSearch(q.trim()); };
  const restock = whRestock().slice(0, 6);
  const restockIds = new Set(restock.map((r) => r.id));
  const season = WH_SEASON_IDS.map((id) => WS_PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const seasonIds = new Set(WH_SEASON_IDS);
  // "Top of the clock today" — auction-fresh / graded picks not already shown above
  const topClock = WS_PRODUCTS
    .filter((p) => !seasonIds.has(p.id) && (p.badge || p.boxesLeft >= 7))
    .slice(0, 12);

  // extra tag rows — deterministic shuffles so each row shows a different, slide-able set
  const whShuffle = (salt) => [...WS_PRODUCTS]
    .map((p) => ({ p, k: Math.abs([...(p.id + salt)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)) }))
    .sort((a, b) => a.k - b.k).map((x) => x.p);
  const dedupe = (arr) => { const seen = new Set(); return arr.filter((p) => p && !seen.has(p.id) && seen.add(p.id)); };
  const fastestGrowing = whShuffle('grow').slice(0, 12);
  const bestSeller = dedupe([...WS_PRODUCTS.filter((p) => WH_BESTSELLERS.includes(p.id)), ...whShuffle('best')]).slice(0, 12);
  const highestQuality = [...WS_PRODUCTS].sort((a, b) => (wsGradeId(b) === 'extra') - (wsGradeId(a) === 'extra') || b.perStem - a.perStem).slice(0, 12);
  const mostFrequently = dedupe([...restock.map((r) => r.p), ...whShuffle('freq')]).slice(0, 12);
  const favourite = dedupe([...wish.map((id) => WS_PRODUCTS.find((p) => p.id === id)), ...whShuffle('fav')]).slice(0, 12);
  const extraRows = [
    { key: 'fastest', icon: WI.spark, tag: 'Momentum', title: 'Fastest growing', note: 'Climbing the order charts fastest this week.', items: fastestGrowing },
    { key: 'drops', icon: WI.euro, tag: 'Price watch', title: 'Biggest price drops', note: 'Lines that fell hardest on the clock this week — buy while they are low.',
      items: WS_PRODUCTS.filter((p) => WH_DROPS[p.id]).sort((a, b) => WH_DROPS[b.id] - WH_DROPS[a.id]) },
    { key: 'best', icon: WI.star, tag: 'Buyer favourite', title: 'Best seller', note: 'The boxes moving most across all buyers.', items: bestSeller },
    { key: 'quality', icon: WI.award, tag: 'Top grade', title: 'Highest quality', note: 'A1 Extra grades and premium stems first.', items: highestQuality },
    { key: 'freq', icon: WI.clock, tag: 'Your rhythm', title: 'Most frequently ordered', note: 'The lines you reach for again and again.', items: mostFrequently },
    { key: 'fav', icon: WH_HEART, tag: 'Saved by you', title: 'Favourites', note: 'From your wishlist and picks like them.', items: favourite },
  ].filter((r) => r.items.length > 0);

  // scope-driven discovery feed — "Find Flowers" / "Find Plants" stay on this page
  // and reshuffle the sections into more tags instead of navigating to the catalogue.
  const isPlant = (p) => (typeof wsType === 'function' ? wsType(p) === 'plants' : p.cat === 'plants');
  const isAcc = (p) => p.cat === 'accessories';
  const scopePool = WS_PRODUCTS.filter((p) => scope === 'plants' ? isPlant(p) : (!isPlant(p) && !isAcc(p)));
  const freshHigh = (p) => (typeof whAvail === 'function' ? whAvail(p).level === 'high' : p.stock === 'high');
  const discoverySigs = new Set();
  const discovery = [
    { key: 'season', green: true, icon: WI.star, tag: scope === 'plants' ? 'Greenhouse-fresh' : 'Peak season',
      title: scope === 'plants' ? 'Plants in season' : scope === 'flowers' ? 'Flowers in season now' : 'In season now · June',
      note: scope === 'plants' ? 'House-ready pots and green plants looking their best this week.' : scope === 'flowers' ? 'Cut flowers at their peak on the clock this week.' : 'Peonies, garden roses and field blooms at their peak.',
      items: scopePool.filter((p) => (scope === 'plants' || scope === 'flowers') ? true : (p.cat === 'season' || p.badge === 'Seasonal')) },
    { key: 'stock', icon: WI.check, tag: 'Ready today',
      title: 'In stock now', note: 'High availability — loads onto the next truck.',
      items: scopePool.filter(freshHigh) },
    { key: 'trending', icon: WI.clock, tag: 'Trending at the clock',
      title: 'Most ordered this week', note: 'What other buyers are stacking by the box.',
      items: scopePool.filter((p) => WH_BESTSELLERS.includes(p.id)) },
    { key: 'drops', icon: WI.euro, tag: 'Price watch',
      title: 'Biggest price drops', note: 'Lines that fell hardest on the clock this week — buy while they are low.',
      items: scopePool.filter((p) => WH_DROPS[p.id]).sort((a, b) => WH_DROPS[b.id] - WH_DROPS[a.id]) },
    { key: 'new', icon: WI.spark, tag: 'Just landed',
      title: 'New this week', note: 'The latest additions to the assortment.',
      items: scopePool.filter((p) => p.badge === 'New') },
    { key: 'value', icon: WI.euro, tag: 'Sharp pricing',
      title: 'Best value', note: 'Lowest price per stem — strong margins.',
      items: [...scopePool].sort((a, b) => a.perStem - b.perStem) },
  ].map((s) => ({ ...s, items: s.items.slice(0, 12) }))
   .filter((s) => {
     if (s.items.length === 0) return false;
     const sig = s.items.map((p) => p.id).sort().join(',');
     if (discoverySigs.has(sig)) return false;
     discoverySigs.add(sig); return true;
   });

  const railCats = null;

  return (
    <div className="wh">
      {/* command bar — full-width search band */}
      <div className="wh-bar">
        <div className="wh-searchwrap">
          {openSeg && <div className="wh-sb-scrim" onClick={() => setOpenSeg(null)} />}
          <div className={`wh-searchbar ${openSeg ? 'act' : ''}`} role="search">
            <div className={`wh-sb-seg grow ${openSeg === 'search' ? 'on' : ''}`} onClick={() => setOpenSeg('search')}>
              <span className="wh-sb-mark">🪴</span>
              <div className="wh-sb-txt">
                <span className="wh-sb-k">Search</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setOpenSeg('search')}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setOpenSeg(null); submit(); } }}
                  placeholder={scope === 'plants' ? 'Find Plants' : scope === 'flowers' ? 'Find Flowers' : 'Flowers, plants, growers…'} aria-label="Search the assortment" />
              </div>
              {openSeg === 'search' && (
                <div className="wh-pop" onClick={(e) => e.stopPropagation()}>
                  {q.trim() ? (
                    <React.Fragment>
                      <p className="wh-pop-h">Products</p>
                      {WS_PRODUCTS.filter((p) => (p.name + ' ' + p.sub + ' ' + p.grower).toLowerCase().includes(q.toLowerCase())).slice(0, 6).map((p) => (
                        <button key={p.id} className="wh-pop-row" onClick={() => { setOpenSeg(null); onOpenDetail(p); }}>
                          <span className="wh-pop-ic" style={{ background: (WS_CAT_MAP[p.cat] || {}).tint }}>{WI.bud({})}</span>
                          <span className="wh-pop-tx"><b>{p.name}</b><span>{(WS_CAT_MAP[p.cat] || {}).label} · {p.stemCm} cm</span></span>
                        </button>
                      ))}
                      <button className="wh-pop-row all" onClick={() => { setOpenSeg(null); onSearch(q.trim()); }}>{WI.search({})}<span className="wh-pop-tx"><b>Search “{q.trim()}”</b></span></button>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <p className="wh-pop-h">Recent searches</p>
                      {['Red Naomi 60cm', 'Eucalyptus', 'Peonies'].map((t) => (
                        <button key={t} className="wh-pop-row" onClick={() => { setQ(t); setOpenSeg(null); onSearch(t); }}>
                          <span className="wh-pop-ic">{WI.clock({})}</span>
                          <span className="wh-pop-tx"><b>{t}</b></span>
                        </button>
                      ))}
                      <p className="wh-pop-h">Browse categories</p>
                      <div className="wh-pop-tiles">
                        {WS_CATS.filter((c) => c.id !== 'all').slice(0, 6).map((c) => (
                          <button key={c.id} className="wh-pop-tile" onClick={() => { setOpenSeg(null); onGoCatalogue(c.id); }}>
                            <span className="tl-sw" style={{ background: c.tint }} />{c.label}
                          </button>
                        ))}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              )}
            </div>
            <span className="wh-sb-div" />
            <div className={`wh-sb-seg ${openSeg === 'grower' ? 'on' : ''}`} onClick={() => setOpenSeg('grower')}>
              <span className="wh-sb-k">Grower</span>
              <span className={`wh-sb-v ${grower ? '' : 'muted'}`}>{grower || 'Add any grower'}</span>
              {openSeg === 'grower' && (
                <div className="wh-pop" onClick={(e) => e.stopPropagation()}>
                  <p className="wh-pop-h">Popular growers</p>
                  <button className="wh-pop-row" onClick={() => { setGrower(null); setOpenSeg('len'); }}>
                    <span className="wh-pop-ic">{WI.spark({})}</span><span className="wh-pop-tx"><b>Any grower</b><span>Show the whole assortment</span></span>
                  </button>
                  {[...new Set(WS_PRODUCTS.map((p) => p.grower))].slice(0, 8).map((g) => (
                    <button key={g} className="wh-pop-row" onClick={() => { setGrower(g); setOpenSeg('len'); }}>
                      <span className="wh-pop-ic">{WI.leaf({})}</span>
                      <span className="wh-pop-tx"><b>{g}</b><span>{WS_PRODUCTS.filter((p) => p.grower === g).length} lines</span></span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="wh-sb-div" />
            <div className={`wh-sb-seg ${openSeg === 'len' ? 'on' : ''}`} onClick={() => setOpenSeg('len')}>
              <span className="wh-sb-k">Length</span>
              <span className={`wh-sb-v ${len ? '' : 'muted'}`}>{len || 'Any length'}</span>
              {openSeg === 'len' && (
                <div className="wh-pop right" onClick={(e) => e.stopPropagation()}>
                  <p className="wh-pop-h">Stem length</p>
                  <button className="wh-pop-row" onClick={() => { setLen(null); setOpenSeg(null); }}>
                    <span className="wh-pop-ic">{WI.spark({})}</span><span className="wh-pop-tx"><b>Any length</b><span>Show every grade</span></span>
                  </button>
                  <div className="wh-len-grid">
                    {WH_LENGTHS.map((l) => (
                      <button key={l.v} className={`wh-len-chip ${len === l.v ? 'on' : ''}`} onClick={() => { setLen(l.v); setOpenSeg(null); }}>
                        <b>{l.v}</b><span>{l.note}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button type="button" className="wh-sb-go" onClick={() => { setOpenSeg(null); submit(); }} aria-label="Search">{WI.search({})}</button>
          </div>
        </div>
        {browse && (
          <div className="wh-filterrow">
            <button className="wh-filt-all" onClick={() => setFilterOpen(true)}>{WI.sliders ? WI.sliders({}) : WI.filter({})}Filters</button>
            <span className="wh-filt-div" />
            <div className="wh-filt-chips">
              {flowerFilters.map((f) => (
                <button key={f} className={`wh-filt-chip ${activeFilters.includes(f) ? 'on' : ''}`} onClick={() => toggleFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="wh-split">
      <div className="wh-leftcol">

      {/* 1688-style hierarchy: all categories · main · quick-glance rail */}
      <div className="wh-layout">
        <div className="wh-main">
          {scope === 'foryou' ? (<React.Fragment>
          {/* predictive restock */}
          {restock.length > 0 && (
            <section className="wh-panel">
              <div className="wh-sec-h">
                <div className="wh-sec-l">
                  <h2 className="wh-sec-title">Ready to order</h2>
                  <p className="wh-sec-note">Recurring lines from your order history, ranked by what's due.</p>
                </div>
                <button className="wh-sec-link" onClick={() => onNavigate && onNavigate('orders')}>Order history {OBI.fwd({})}</button>
              </div>
              <WhCarousel>
                {restock.map((item) => (
                  <WhRestockCard key={item.id} item={item} qty={cart[item.id] || 0} onAddBox={onAddBox} onSubBox={onSubBox} onOpen={onOpenDetail} wished={wish.includes(item.id)} onToggleWish={toggleWish} />
                ))}
              </WhCarousel>
              {window.MsCopyLastBtn && (
                <div className="wh-copylast-strip">
                  <span className="wh-cls-tx">{WI.clock({})}Order the same as last week?</span>
                  <window.MsCopyLastBtn compact
                    addToCart={(src) => { src.lines.forEach((l) => { const pp = WS_PRODUCTS.find((x) => x.id === l.id); if (pp) onAddBox(pp); }); }} />
                </div>
              )}
            </section>
          )}

          {/* in season now */}
          <section>
            <div className="wh-sec-h">
              <div className="wh-sec-l">
                <h2 className="wh-sec-title">In season now · June</h2>
                <p className="wh-sec-note">High-grade peonies, garden roses and field blooms at their best this week.</p>
              </div>
              <button className="wh-sec-link" onClick={() => onGoCatalogue('season')}>See all seasonal {OBI.fwd({})}</button>
            </div>
            <WhCarousel>
              {season.map((p) => (
                <WhProductCard key={p.id} p={p} qty={cart[p.id] || 0} onAddBox={onAddBox} onSubBox={onSubBox} onOpen={onOpenDetail} wished={wish.includes(p.id)} onToggleWish={toggleWish} />
              ))}
            </WhCarousel>
          </section>

          {/* top of the clock */}
          <section>
            <div className="wh-sec-h">
              <div className="wh-sec-l">
                <span className="wh-sec-eyebrow">{WI.clock({})} Trending at the clock today</span>
                <h2 className="wh-sec-title">Top of the clock</h2>
                <p className="wh-sec-note">Auction-fresh and well-stocked — moving fast this morning.</p>
              </div>
              <button className="wh-sec-link" onClick={() => onGoCatalogue('all')}>Browse all {OBI.fwd({})}</button>
            </div>
            <WhCarousel>
              {topClock.map((p) => (
                <WhProductCard key={p.id} p={p} qty={cart[p.id] || 0} onAddBox={onAddBox} onSubBox={onSubBox} onOpen={onOpenDetail} wished={wish.includes(p.id)} onToggleWish={toggleWish} />
              ))}
            </WhCarousel>
          </section>

          {extraRows.map((r) => (
            <section key={r.key}>
              <div className="wh-sec-h">
                <div className="wh-sec-l">
                  <span className="wh-sec-eyebrow">{r.icon({})} {r.tag}</span>
                  <h2 className="wh-sec-title">{r.title}</h2>
                  <p className="wh-sec-note">{r.note}</p>
                </div>
                <button className="wh-sec-link" onClick={() => onGoCatalogue('all')}>Browse all {OBI.fwd({})}</button>
              </div>
              <WhCarousel>
                {r.items.map((p) => (
                  <WhProductCard key={p.id} p={p} qty={cart[p.id] || 0} onAddBox={onAddBox} onSubBox={onSubBox} onOpen={onOpenDetail} wished={wish.includes(p.id)} onToggleWish={toggleWish} />
                ))}
              </WhCarousel>
            </section>
          ))}
          </React.Fragment>
          ) : (
          discovery.map((s, si) => (
            <section key={s.key}>
              <div className="wh-sec-h">
                <div className="wh-sec-l">
                  <span className={`wh-sec-eyebrow ${s.green ? 'green' : ''}`}>{s.icon({})} {s.tag}</span>
                  <h2 className="wh-sec-title">{s.title}</h2>
                  <p className="wh-sec-note">{s.note}</p>
                </div>
                <div className="wh-sec-r">
                  {si === 0 && <WhSecView view={secView} onSet={setSecView} />}
                  <button className="wh-sec-link" onClick={() => onGoCatalogue(scope === 'plants' ? 'plants' : 'all')}>Browse all {OBI.fwd({})}</button>
                </div>
              </div>
              {secView === 'grid' ? (
                <div className="wh-grid ws-cat-grid">
                  {s.items.map((p) => (
                    <WhCard key={p.id} p={p} qty={cart[p.id] || 0} onAddBox={onAddBox} onSub={onSubBox} onOpen={onOpenDetail} wished={wish.includes(p.id)} onToggleWish={toggleWish} tiered />
                  ))}
                </div>
              ) : (
                <WhCarousel>
                  {s.items.map((p) => (
                    <WhProductCard key={p.id} p={p} qty={cart[p.id] || 0} onAddBox={onAddBox} onSubBox={onSubBox} onOpen={onOpenDetail} wished={wish.includes(p.id)} onToggleWish={toggleWish} />
                  ))}
                </WhCarousel>
              )}
            </section>
          ))
          )}
        </div>
      </div>
      </div>

        <aside className="wh-rail" style={{ display: 'none' }}>
        </aside>
      </div>

      <WhFooter onGoCatalogue={onGoCatalogue} onOpenDetail={onOpenDetail} onNavigate={onNavigate} />

      <TopUpModal open={topOpen} balance={balance} onClose={() => setTopOpen(false)}
        onDone={(amt) => { setBalance(addBalance(amt)); setTopOpen(false); }} />
      {filterOpen && (
        <WhFilterModal onClose={() => setFilterOpen(false)}
          onApply={(preset) => { setFilterOpen(false); onGoFilter && onGoFilter(preset); }} />
      )}
      {searchOpen && window.WhSearchTakeover && (
        <window.WhSearchTakeover initial={q}
          onClose={() => setSearchOpen(false)}
          onSearch={(qq) => { setSearchOpen(false); setQ(''); onSearch(qq); }}
          onAddBox={onAddBox}
          onAddUnits={(p, n) => { for (let i = 0; i < n; i++) onInc(p.id); }}
          onGoCatalogue={(c) => { setSearchOpen(false); onGoCatalogue(c); }}
          onGoFilter={(pr) => { setSearchOpen(false); onGoFilter(pr); }}
          onOpenDetail={(p) => { setSearchOpen(false); onOpenDetail(p); }} />
      )}
    </div>
  );
}

Object.assign(window, { WS_ACCOUNT, WsCommandCenter, WsQuickCart, WhPromoBar, whRestock, whAvail, WhCard, loadWishlist, saveWishlist });
