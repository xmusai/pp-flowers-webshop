// webshop.jsx — PP Flowers Webshop view (catalogue, product detail, cart drawer, demo checkout)
// Depends on: webshop-data.jsx (WI, WS_CATS, WS_CAT_MAP, WS_PRODUCTS, wsUnitPrice, wsEuro), OBI, <image-slot>

const WS_MIN_ORDER = 500; // € wholesale minimum per delivery (EU) — matches signup qualify

// products that have a real photo shot — floated to the top of the grid
const WS_HAS_PHOTO = new Set(['t-stronggold', 's-hydrangea', 'pl-phal', 'c-bacardi', 'gr-euc', 'r-rednaomi', 'p-sarah', 'r-avalanche', 'r-athena', 'r-quicksand', 't-dynasty', 'c-anastasia']);

const WS_SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price · low to high' },
  { id: 'price-desc', label: 'Price · high to low' },
  { id: 'stem-desc', label: 'Stem length' },
  { id: 'name', label: 'Name A–Z' },
];

function wsBadgeClass(b) {
  if (b === 'Seasonal') return 'season';
  if (b === 'Auction-fresh' || b === 'Top grade') return 'green';
  return '';
}
function wsBadgeIcon(b) {
  if (b === 'Auction-fresh') return WI.clock;
  if (b === 'Seasonal' || b === 'New') return WI.spark;
  return WI.star;
}
const WS_STOCK = { high: 'In stock', mid: 'Limited stock', low: 'Low — order soon' };

// availability is coarse on purpose — the feed's quantities aren't reliable to show
function wsAvail(p) {
  const n = p.boxesLeft || 0;
  return { level: n <= 2 ? 'low' : n <= 5 ? 'mid' : 'high', label: ppStockText(p) };
}

const WS_VASE = { roses: '7–10 days', tulips: '5–7 days', chrys: '14–21 days', peonies: '5–7 days',
  lilies: '8–12 days', gerbera: '7–10 days', season: '6–9 days', greens: '14–21 days', plants: 'Weeks of display' };
const WS_LEAD = { NL: 'Next auction · ships same day', KE: 'Air-freight · 2 days', ET: 'Air-freight · 2 days',
  IT: 'Road · 1–2 days', ES: 'Road · 1–2 days' };

function wsDetail(p) {
  const grade = p.badge === 'Top grade' ? 'A1 Extra' : 'A1';
  const vase = WS_VASE[p.cat] || '7–10 days';
  const lead = WS_LEAD[p.oc] || 'Ships within 2 days';
  const desc = p.unit === 'piece'
    ? `${p.name} — ${p.sub.toLowerCase()}, grown by ${p.grower} in ${p.origin}. Delivered in flowering pots straight from the grower, graded for plant health and uniform height.`
    : `${p.name} is a ${p.sub.toLowerCase()} grown by ${p.grower} in ${p.origin}. Cut to order and graded for length and bloom consistency, every bunch arrives auction-fresh and conditioned, ready for the vase.`;
  return { grade, vase, lead, desc };
}

/* ---------------- product card (Release-style minimal) ---------------- */
function WsProduct({ p, qty, onBoxAdd, onBoxSub, onBoxSet, onOpen }) {
  const cat = WS_CAT_MAP[p.cat] || {};
  const { isPiece, boxPrice, content } = wsBoxInfo(p);
  const avail = wsAvail(p);
  const boxes = qty > 0 ? Math.round(qty / p.box) : 0;
  const stop = (e) => e.stopPropagation();
  return (
    <div className={`ws-prod ${qty > 0 ? 'in-cart' : ''}`} onClick={() => onOpen && onOpen(p)} role="button" tabIndex={0}>
      <div className="ws-photo" style={{ '--ph-tint': cat.tint }}>
        <image-slot id={`imgslot-${p.id}`} shape="rect" src={wsShot(p.id)} placeholder={`Drop a photo of ${p.name}`}></image-slot>
        {qty > 0 && <span className="ws-incart">{boxes} {boxes === 1 ? 'box' : 'boxes'}</span>}
        <div className="ws-quickadd" onClick={stop}>
          {qty > 0 ? (
            <div className="ws-step boxstep">
              <button onClick={onBoxSub} aria-label="One box less">{WI.minus({})}</button>
              <span className="boxinput">
                <input type="number" min="0" step="1" value={boxes}
                  onChange={(e) => onBoxSet(Math.max(0, parseInt(e.target.value) || 0))}
                  onFocus={(e) => e.target.select()} aria-label={`Boxes of ${p.name}`} />
                <span className="bx">{boxes === 1 ? 'box' : 'boxes'}</span>
              </span>
              <button onClick={onBoxAdd} aria-label="One box more">{WI.plus({})}</button>
            </div>
          ) : (
            <button className="ws-add" onClick={onBoxAdd}>{OBI.box({})}Add box</button>
          )}
          {window.WsDraftBtn && <window.WsDraftBtn p={p} />}
        </div>
      </div>
      <div className="ws-body">
        <h3 className="ws-name">{p.name}</h3>
        <div className="ws-price"><span className="pp">{wsEuro(boxPrice)}</span><span className="u">/ box</span></div>
        <p className="ws-cardsub"><span className={`avail ${avail.level}`}>{avail.label}</span></p>
      </div>
    </div>
  );
}

/* same product offered by different growers on the VMP (compare price / length / stock) */
function wsGrowerOffers(p) {
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
  const pool = [
    { grower: 'Marginpar', oc: 'KE', origin: 'Kenya' },
    { grower: 'Porta Nova', oc: 'NL', origin: 'Holland' },
    { grower: 'Black Tulip', oc: 'ET', origin: 'Ethiopia' },
    { grower: 'Joytech', oc: 'CO', origin: 'Colombia' },
    { grower: 'Zabo Plant', oc: 'NL', origin: 'Holland' },
    { grower: 'Selecta One', oc: 'KE', origin: 'Kenya' },
    { grower: 'Afriflora Sher', oc: 'ET', origin: 'Ethiopia' },
    { grower: 'Dümmen Orange', oc: 'NL', origin: 'Holland' },
    { grower: 'Tambuzi', oc: 'KE', origin: 'Kenya' },
    { grower: 'Wagagai', oc: 'UG', origin: 'Uganda' },
    { grower: 'Flores El Capiro', oc: 'CO', origin: 'Colombia' },
    { grower: 'Rosaprima', oc: 'EC', origin: 'Ecuador' },
  ].filter((g) => g.grower !== p.grower);
  const rec = (typeof ppRec === 'function') ? ppRec(p) : null;
  const fromPrice = rec && rec.from_price != null ? rec.from_price : p.perStem;
  const topPrice = rec && rec.range_ok && rec.max_price > fromPrice ? rec.max_price : Math.round(fromPrice * 1.6 * 100) / 100;
  const decorate = (g, extra) => {
    // the feed's from_price IS the cheapest offer — every other seller sits above it
    const t = ((hash(p.id + g.grower) % 92) + 8) / 100;
    const perStem = Math.max(0.05, Math.round((fromPrice + (topPrice - fromPrice) * t) * 100) / 100);
    const stemCm = p.stemCm + [-10, -5, 0, 5, 10][hash(g.grower) % 5];
    const grade = hash(g.grower + p.id) % 3 === 0 ? 'A1 Extra' : 'A1';
    const boxesLeft = 2 + (hash(g.grower + 'b') % 46);
    const moq = [1, 2, 4, 5][hash(g.grower + 'm') % 4];
    const lead = ['Same day', 'Next clock day', '24 h', '48 h'][hash(g.grower + 'l') % 4];
    const rating = (4.4 + (hash(g.grower + 'r') % 6) / 10).toFixed(1);
    const sold = 40 + (hash(g.grower + 's') % 480);
    return { grower: g.grower, oc: g.oc, origin: g.origin, perStem, stemCm, grade, boxesLeft, moq, lead, rating, sold, ...extra };
  };
  const base = { grower: p.grower, oc: p.oc, origin: p.origin, perStem: fromPrice, stemCm: p.stemCm, grade: wsGrade(p),
    boxesLeft: p.boxesLeft, moq: 1, lead: 'Next clock day', rating: (4.6 + (hash(p.id) % 4) / 10).toFixed(1), sold: 120 + (hash(p.id + 's') % 500), self: true };
  const start = hash(p.id) % pool.length;
  const maxOffers = rec ? Math.max(0, rec.priced_offers - 1) : 6;
  const n = Math.min(6 + (hash(p.id + 'n') % 2), maxOffers); // never more sellers than the feed reports
  const picks = Array.from({ length: n }, (_, i) => pool[(start + i * 2 + 1) % pool.length])
    .filter((g, i, a) => g && a.findIndex((x) => x.grower === g.grower) === i)
    .map((g) => decorate(g));
  return [base, ...picks].filter((o, i, a) => a.findIndex((x) => x.grower === o.grower) === i)
    .sort((a, b) => a.perStem - b.perStem);
}

/* ---------------- product detail ---------------- */
function WsDetail({ p, qty, onAdd, onInc, onDec, onBack, onOpen, onBasket, onSearch, units, subtotal }) {
  const { useState } = React;
  const [dq, setDq] = useState('');
  React.useEffect(() => { document.documentElement.classList.add('ws-detail-open'); return () => document.documentElement.classList.remove('ws-detail-open'); }, []);
  const cat = WS_CAT_MAP[p.cat] || {};
  const d = wsDetail(p);
  const isPiece = p.unit === 'piece';
  const unitWord = isPiece ? 'piece' : 'stem';
  const bunchPrice = p.perStem * p.bunch;
  const boxStems = p.bunch * p.box;
  const boxPrice = p.perStem * (isPiece ? p.box : boxStems);
  const sellWord = isPiece ? 'box' : 'bunch';
  const unitPrice = isPiece ? boxPrice : bunchPrice;

  const specs = [
    { k: 'Origin', v: <span className="ws-spv-oc"><span className="ws-oc">{p.oc}</span>{p.origin}</span> },
    !isPiece && { k: 'Stem length', v: `${p.stemCm} cm` },
    { k: 'Vase life', v: d.vase },
    { k: 'Priced per', v: `1 ${ppUnit(p)}` },
    { k: 'Sellers', v: String((ppRec(p) || {}).priced_offers || '—') },
    { k: 'Order lot', v: ppQty(p, ppLot(p)) },
    { k: 'Grower', v: p.grower },
    { k: 'Quality grade', v: d.grade },
    { k: 'Availability', v: ppStockText(p) },
    { k: 'Prices', v: ppAsOf(p) },
    { k: 'SKU', v: p.sku },
    { k: 'Lead time', v: d.lead },
  ].filter(Boolean);

  const offers = wsGrowerOffers(p);
  const bestPrice = Math.min(...offers.map((o) => o.perStem));

  return (
    <div className="ws-detail">
      <div className="ws-dtop">
        {false && <button className="ws-cartbtn sm" onClick={onBasket}>
          {WI.cart({})}<span>Basket</span>
          {subtotal > 0 && <span className="ws-cart-amt">{wsEuro(subtotal)}</span>}
          {units > 0 && <span className="ws-badge">{units}</span>}
        </button>}
      </div>

      <div className="ws-dgrid">
        <div className="ws-dmedia">
          <div className="ws-dimg" style={{ '--ph-tint': cat.tint }}>
            <image-slot id={`imgslot-${p.id}`} shape="rect" src={wsShot(p.id)} placeholder={`Drop a photo of ${p.name}`}></image-slot>
            {p.badge && (<span className={`ws-tag ${wsBadgeClass(p.badge)}`}>{wsBadgeIcon(p.badge)({})}{p.badge}</span>)}
          </div>

          <div className="ws-resv">
            <div className="ws-resv-top">
              <span className="tot">{qty > 0 ? wsEuro(ppLineTotal(p, qty)) : ppFromText(p)} <i>{qty > 0 ? 'total' : '/ ' + ppUnit(p)}</i></span>
              <span className="sub">{qty > 0 ? `${ppQty(p, qty)} · ${ppFromText(p)} / ${ppUnit(p)}` : ppMeta(p)}</span>
            </div>
            <div className="ws-resv-box">
              <div className="ws-resv-grid">
                <div className="ws-resv-cell">
                  <span className="lb">Priced per</span>
                  <span className="vl">1 {ppUnit(p)}</span>
                </div>
                <div className="ws-resv-cell">
                  <span className="lb">Sellers</span>
                  <span className="vl">{(ppRec(p) || {}).priced_offers || '—'}</span>
                </div>
              </div>
              <div className="ws-resv-cell qty">
                <div className="qtx"><span className="lb">Quantity</span><span className="vl">{ppQty(p, qty)}</span></div>
                <div className="ws-step">
                  <button onClick={onDec} disabled={qty === 0} aria-label="Remove one">{WI.minus({})}</button>
                  <span className="n">{qty}</span>
                  <button onClick={() => (qty === 0 ? onAdd() : onInc())} aria-label="Add one">{WI.plus({})}</button>
                </div>
              </div>
            </div>
            <button className="ws-resv-btn" onClick={qty === 0 ? onAdd : onBasket}>{qty === 0 ? 'Add to basket' : 'View basket'}</button>
            <p className="ws-resv-note">{qty === 0 ? "You won't be charged yet" : `${ppQty(p, units)} in basket · ${wsEuro(subtotal)}`}</p>
          </div>
        </div>

        <div className="ws-dinfo">
          <h1 className="ws-dtitle">{p.name}</h1>
          <p className="ws-dsub">{p.sub}</p>
          <div className="ws-dchips">
            <span className={`ws-stockpill ${p.stock}`}><span className="sd" />{WS_STOCK[p.stock]}</span>
            {!isPiece && <span className="ws-dchip">{p.stemCm} cm</span>}
            <span className="ws-dchip">{d.vase} vase</span>
            <span className="ws-dchip">{d.grade}</span>
          </div>
          <p className="ws-ddesc">{d.desc}</p>

          <div className="ws-specs-wrap">
            <div className="ws-specs-h">Specifications</div>
            <div className="ws-specs">
              {specs.map((s) => (
                <div className="ws-spec" key={s.k}><span className="sk">{s.k}</span><span className="sv">{s.v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {offers.length > 1 && (
        <div className="ws-growers">
          <div className="ws-gr-head">
            <h2 className="ws-rel-h">From different growers</h2>
            <p className="ws-gr-sub">{offers.length} growers offer {p.name} on the market — compare price per {unitWord}, stem length, MOQ and lead time.</p>
          </div>
          <div className="ws-gr-carousel">
            {offers.map((o) => {
              const oBoxPrice = o.perStem * (isPiece ? p.box : boxStems);
              const best = o.perStem === bestPrice;
              const av = o.boxesLeft >= 8 ? { l: 'In stock', c: 'high' } : o.boxesLeft >= 4 ? { l: 'Limited', c: 'mid' } : { l: 'Low stock', c: 'low' };
              return (
                <div className={`ws-gr-card ${o.self ? 'self' : ''} ${best ? 'best' : ''}`} key={o.grower}>
                  <div className="ws-gr-photo" style={{ '--ph-tint': cat.tint }}>
                    <image-slot id={`grimg-${p.id}-${o.grower}`} shape="rect" src={wsShot(p.id)} placeholder={p.name}></image-slot>
                    {best && <span className="ws-gr-badge">Best price</span>}
                    {o.self && <span className="ws-gr-self">Your view</span>}
                  </div>
                  <div className="ws-gr-cbody">
                    <div className="ws-gr-cgrower">{o.grower}<span className="ws-gr-crate">★ {o.rating}</span></div>
                    <div className="ws-gr-cloc"><span className="ws-oc">{o.oc}</span>{o.origin} · {o.sold}+ sold</div>
                    <div className="ws-gr-cmeta">
                      <span>{isPiece ? `${p.box} pcs / box` : `${o.stemCm} cm`}</span>
                      <span className="dot">·</span>
                      <span>{o.grade}</span>
                    </div>
                    <div className="ws-gr-cwhole">
                      <span>{ppStockText(p)}</span>
                      <span>MOQ {ppQty(p, o.moq * (isPiece ? 1 : p.bunch))} · {o.lead}</span>
                    </div>
                    <div className={`ws-gr-cstock ${av.c}`}><span className="sd" />{av.l}</div>
                    <div className="ws-gr-cprice">
                      <span className="ps">{wsEuro(o.perStem)}<i>/ {unitWord}</i></span>
                    </div>
                    <button className="ws-gr-add" onClick={onAdd} aria-label={`Add ${o.grower}`}>{WI.plus({})}Add</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- cart drawer (multi-step checkout) ---------------- */
function WsCartDrawer({ open, lines, subtotal, units, onClose, onInc, onDec, onRemove, onClear, onSwap, placed, orderNo, onPlace, onContinue, onTrack, onCheckout }) {
  const { useState, useMemo, useEffect } = React;
  const meetsMin = subtotal >= WS_MIN_ORDER;
  const [priceAdj, setPriceAdj] = useState(0);        // accepted VMP price updates
  const total = subtotal + priceAdj + 24.5;
  const [step, setStep] = useState('cart');           // cart · verify · delivery
  const [dateIdx, setDateIdx] = useState(0);
  const [payMethod, setPayMethod] = useState('later');  // later · now
  const acct = (typeof window !== 'undefined' && window.WS_ACCOUNT) || { creditLimit: 0, creditUsed: 0 };
  const creditAvail = acct.creditLimit - acct.creditUsed;
  const terms = payMethod === 'later' ? '30-day invoice' : 'Paid on order';

  const dates = useMemo(() => {
    const out = []; const d = new Date();
    while (out.length < 3) { d.setDate(d.getDate() + 1); const wd = d.getDay(); if (wd >= 1 && wd <= 5) out.push(new Date(d)); }
    return out;
  }, [open]);
  const fmtDate = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  useEffect(() => { if (!open) { const t = setTimeout(() => { setStep('cart'); setPriceAdj(0); }, 320); return () => clearTimeout(t); } }, [open]);

  const SummaryRows = () => (
    <React.Fragment>
      <div className="ws-srow"><span>Units</span><span className="v">{units.toLocaleString('en')}</span></div>
      {priceAdj > 0 && step === 'delivery' && <div className="ws-srow"><span>VMP price update</span><span className="v">+ {wsEuro(priceAdj)}</span></div>}
      <div className="ws-srow"><span>Logistics</span><span className="v">{wsEuro(24.5)}</span></div>
      <div className="ws-srow total"><span>{step === 'delivery' ? 'Total · excl. VAT' : 'Subtotal · excl. VAT'}</span><span className="v">{wsEuro(step === 'delivery' ? total : subtotal)}</span></div>
    </React.Fragment>
  );
  const MinNote = () => (
    <div className={`ws-min ${meetsMin ? 'ok' : 'under'}`}>
      {meetsMin ? WI.check({}) : OBI.info({})}
      {meetsMin
        ? <span>You’ve met the <b>{wsEuro(WS_MIN_ORDER)}</b> wholesale minimum.</span>
        : <span>Add <b>{wsEuro(WS_MIN_ORDER - subtotal)}</b> more to reach the <b>{wsEuro(WS_MIN_ORDER)}</b> minimum per delivery.</span>}
    </div>
  );

  return (
    <React.Fragment>
      <aside className={`ws-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        {placed ? (
          <React.Fragment>
            <div className="ws-dr-head">
              <div><h2>Order placed</h2><p className="sub">Confirmation sent</p></div>
              <button className="ws-dr-close" onClick={onClose} aria-label="Close">{OBI.close({})}</button>
            </div>
            <div className="ws-done">
              <div className="badge">{WI.check({})}</div>
              <h2>Thank you — order confirmed</h2>
              <p>Your order <span className="ws-order">{orderNo}</span> is booked for the next auction round. Track its progress any time under My Orders.</p>
              <button className="ws-checkout" onClick={onTrack}>{WI.clock({})}Track order</button>
              <button className="ws-clear" onClick={onContinue}>Continue shopping</button>
            </div>
          </React.Fragment>
        ) : step === 'verify' ? (
          <React.Fragment>
            <div className="ws-dr-head">
              <div><h2>Availability check</h2><p className="sub">Verifying your basket with the VMP</p></div>
              <button className="ws-dr-close" onClick={onClose} aria-label="Close">{OBI.close({})}</button>
            </div>
            <window.WsVerifyStep key={open ? 'v1' : 'v0'} lines={lines} onSwap={onSwap} onRemoveLine={onRemove}
              onPriceAdj={(d) => setPriceAdj((x) => x + d)} onBack={() => { setStep('cart'); setPriceAdj(0); }} onContinue={() => setStep('delivery')} />
          </React.Fragment>
        ) : step === 'delivery' ? (
          <React.Fragment>
            <div className="ws-dr-head">
              <div><h2>Checkout</h2><p className="sub">Delivery &amp; payment</p></div>
              <button className="ws-dr-close" onClick={onClose} aria-label="Close">{OBI.close({})}</button>
            </div>
            <div className="ws-dr-body">
              <button className="ws-back sm" onClick={() => setStep('cart')}>{OBI.back({})}Back to basket</button>
              <div className="ws-co-sec">
                <label className="ws-co-label">Delivery date</label>
                <div className="ws-co-dates">
                  {dates.map((d, i) => (
                    <button key={i} className={`ws-co-date ${dateIdx === i ? 'on' : ''}`} onClick={() => setDateIdx(i)}>
                      <span className="dd">{fmtDate(d)}</span>
                      <span className="ds">{i === 0 ? 'Next auction' : 'Auction-fresh'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="ws-co-sec">
                <label className="ws-co-label">Delivery address</label>
                <div className="ws-co-box">{ORD_ADDRESS}</div>
              </div>
              <div className="ws-co-sec">
                <label className="ws-co-label">Payment</label>
                <div className="ws-pay-opts">
                  <button type="button" className={`ws-pay-opt ${payMethod === 'later' ? 'on' : ''}`} onClick={() => setPayMethod('later')}>
                    <span className="ws-pay-radio" />
                    <span className="ws-pay-ic">{WI.clock({})}</span>
                    <span className="ws-pay-tx">
                      <span className="ws-pay-t">Pay later · 30-day invoice<span className="ws-pay-tag">Recommended</span></span>
                      <span className="ws-pay-s">Settle within 30 days on your wholesale account · {'€\u00A0' + Math.round(creditAvail).toLocaleString('de-DE')} credit available</span>
                    </span>
                  </button>
                  <button type="button" className={`ws-pay-opt ${payMethod === 'now' ? 'on' : ''}`} onClick={() => setPayMethod('now')}>
                    <span className="ws-pay-radio" />
                    <span className="ws-pay-ic">{WI.card({})}</span>
                    <span className="ws-pay-tx">
                      <span className="ws-pay-t">Pay now</span>
                      <span className="ws-pay-s">Charge your prepaid balance or card on order</span>
                    </span>
                  </button>
                </div>
              </div>
              <div className="ws-co-sec">
                <label className="ws-co-label">Order summary</label>
                <div className="ws-co-mini">
                  {lines.map(({ p, qty }) => (
                    <div className="ws-co-mrow" key={p.id}>
                      <span className="mn">{p.name}<span className="mq"> · {ppQty(p, qty)}</span></span>
                      <span className="mt">{wsEuro(ppLineTotal(p, qty))}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="ws-dr-foot">
              <div className="ws-verified">{WI.check({})}Availability &amp; prices checked with the VMP · just now</div>
              <SummaryRows />
              <MinNote />
              <button className="ws-checkout" onClick={() => onPlace({ deliveryDate: dates[dateIdx].toISOString(), terms })}>{OBI.truck({})}{payMethod === 'later' ? 'Place order · pay later' : 'Place & pay'} · {wsEuro(total)}</button>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="ws-dr-head">
              <div>
                <h2>Your order</h2>
                <p className="sub">{units === 0 ? 'No items yet' : `${units} ${units === 1 ? 'item' : 'items'} · auction-fresh`}</p>
              </div>
              <button className="ws-dr-close" onClick={onClose} aria-label="Close">{OBI.close({})}</button>
            </div>

            {lines.length === 0 ? (
              <div className="ws-dr-empty">
                <div className="ec">{WI.cart({})}</div>
                <h3>Your basket is empty</h3>
                <p>Add stems from the catalogue and they’ll appear here.</p>
              </div>
            ) : (
              <React.Fragment>
                <div className="ws-dr-body">
                  {lines.map(({ p, qty }) => {
                    const cat = WS_CAT_MAP[p.cat] || {};
                    const lineTotal = ppLineTotal(p, qty);
                    return (
                      <div className="ws-line" key={p.id}>
                        <div className="lp" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div className="lx">
                          <div>
                            <div className="ln">{p.name}</div>
                            <div className="lu">{ppFromText(p)} / {ppUnit(p)} · {p.origin}</div>
                          </div>
                          <div className="lr">
                            <div className="ws-step">
                              <button onClick={() => onDec(p.id)} aria-label="Remove one">{WI.minus({})}</button>
                              <span className="n">{qty}</span>
                              <button onClick={() => onInc(p.id)} aria-label="Add one">{WI.plus({})}</button>
                            </div>
                            <span className="lt">{wsEuro(lineTotal)}</span>
                            <button className="lremove" onClick={() => onRemove(p.id)} aria-label="Remove">{WI.trash({})}</button>
                          </div>
                          <div className="lu">{ppQty(p, qty)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="ws-dr-foot">
                  <SummaryRows />
                  <MinNote />
                  <button className="ws-checkout" onClick={onCheckout}>Checkout{OBI.fwd({})}</button>
                  <button className="ws-clear" onClick={onClear}>Clear basket</button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </aside>
    </React.Fragment>
  );
}

/* ---------------- quick order pad (bulk) ---------------- */
function WsQuickOrder({ products, cart, onSet, onBox }) {
  return (
    <div className="ws-quick">
      <div className="ws-qtable">
        <div className="ws-qhead">
          <span className="ws-qh-prod">Product</span>
          <span className="ws-qh-price">Unit price</span>
          <span className="ws-qh-qty">Quantity</span>
          <span className="ws-qh-tot">Line total</span>
        </div>
        {products.length === 0 ? (
          <div className="ws-qempty">{WI.search({})}<span>No products match — adjust your search or filters.</span></div>
        ) : products.map((p) => {
          const c = WS_CAT_MAP[p.cat] || {};
          const qty = cart[p.id] || 0;
          const unitPrice = wsUnitPrice(p);
          const isPiece = p.unit === 'piece';
          return (
            <div className={`ws-qrow ${qty > 0 ? 'on' : ''}`} key={p.id}>
              <div className="ws-qprod">
                <span className="ws-qthumb" style={{ backgroundImage: `url("${wsShot(p.id)}")` }} />
                <span className="ws-qtx">
                  <span className="ws-qn">{p.name}</span>
                  <span className="ws-qmeta"><span className="ws-oc">{p.oc}</span>{p.origin} · {isPiece ? 'per piece' : `${p.bunch} stems/bunch`}{!isPiece ? ` · ${p.stemCm} cm` : ''}</span>
                </span>
              </div>
              <div className="ws-qprice">
                <span className="pp">{wsEuro(unitPrice)}</span>
                <span className="pu">/ {isPiece ? 'piece' : 'bunch'}</span>
              </div>
              <div className="ws-qctl">
                <div className="ws-qstep">
                  <button onClick={() => onSet(p.id, qty - 1)} disabled={qty <= 0} aria-label="Less">{WI.minus({})}</button>
                  <input type="number" min="0" value={qty} onChange={(e) => onSet(p.id, Math.max(0, parseInt(e.target.value) || 0))} />
                  <button onClick={() => onSet(p.id, qty + 1)} aria-label="More">{WI.plus({})}</button>
                </div>
                <button className="ws-qbox" onClick={() => onBox(p)} title={`Add a full box (${p.box} ${isPiece ? 'pcs' : 'bunches'})`}>
                  + box<span className="bx">{p.box}</span>
                </button>
              </div>
              <div className="ws-qtot">{qty > 0 ? wsEuro(unitPrice * qty) : <span className="muted">—</span>}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- filter sidebar ---------------- */
/* one predicate per facet, mirroring the grid's filter — lets each option show
   how many products it would actually return given the other active facets */
const WS_FACET = {
  cat:      (p, f) => f.cat === 'all' || p.cat === f.cat,
  ids:      (p, f) => !f.ids || f.ids.includes(p.id),
  colours:  (p, f) => !f.colours.length || f.colours.includes(p.colour),
  types:    (p, f) => !f.types.length || f.types.includes(wsType(p)),
  maxPrice: (p, f) => f.maxPrice == null || p.perStem <= f.maxPrice,
  grades:   (p, f) => !f.grades.length || f.grades.includes(wsGradeId(p)),
  ripe:     (p, f) => !f.ripe.length || f.ripe.includes(p.ripe),
  vase:     (p, f) => !f.vase.length || f.vase.some((m) => p.vase >= m),
  certs:    (p, f) => !f.certs.length || f.certs.some((c) => p.certs.includes(c)),
  scent:    (p, f) => !f.scent || !!p.scent,
  lengths:  (p, f) => !f.lengths.length || f.lengths.some((id) => { const L = WS_LENGTHS.find((x) => x.id === id); return L && L.test(p.stemCm); }),
  weights:  (p, f) => !f.weights || !f.weights.length || (p.bunchG != null && f.weights.some((g) => p.bunchG >= g)),
  avail:    (p, f) => !f.avail.length || f.avail.includes(wsAvail(p).level),
  origins:  (p, f) => !f.origins.length || f.origins.includes(p.oc),
  growers:  (p, f) => !f.growers.length || f.growers.includes(p.grower),
  badges:   (p, f) => !f.badges || !f.badges.length || f.badges.includes(p.badge),
};
const WS_FACET_KEYS = Object.keys(WS_FACET);
function wsFacetBase(f, skip) {
  return WS_PRODUCTS.filter((p) => WS_FACET_KEYS.every((k) => k === skip || WS_FACET[k](p, f)));
}

function WsFilterSection({ title, children, defaultOpen = true, n = 0, hint }) {
  const { useState } = React;
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`ws-fsec ${open ? 'open' : ''}`}>
      <button type="button" className="ws-fsec-h" onClick={() => setOpen(!open)}>
        <span className="ws-fsec-t">{title}{n > 0 && <span className="ws-fsec-n">{n}</span>}</span>
        {!open && hint ? <span className="ws-fsec-hint">{hint}</span> : null}
        <span className="ws-fsec-chev">{OBI.chev({ style: { transform: open ? 'rotate(90deg)' : 'rotate(0deg)' } })}</span>
      </button>
      {open && <div className="ws-fsec-body">{children}</div>}
    </div>
  );
}

/* checkable row: label, optional sub-label, live match count, disabled when it would return nothing */
function WsRow({ on, n, onClick, children, sub }) {
  const dead = n === 0 && !on;
  return (
    <button type="button" className={`ws-check ${on ? 'on' : ''} ${dead ? 'dead' : ''}`} disabled={dead} onClick={onClick}>
      <span className="ws-box">{WI.check({})}</span>
      <span className="ws-check-l">{children}{sub && <span className="ws-check-s">{sub}</span>}</span>
      {n != null && <span className="ws-check-n">{n}</span>}
    </button>
  );
}

function WsSidebar({ f, set, catCounts, allOrigins, allGrowers, activeCount, onClear, resultCount }) {
  const { useState } = React;
  /* the scrollbar only shows itself while the buyer is actually scrolling */
  const [scrolling, setScrolling] = useState(false);
  const idleT = React.useRef(0);
  const onScroll = () => { setScrolling(true); clearTimeout(idleT.current); idleT.current = setTimeout(() => setScrolling(false), 700); };
  React.useEffect(() => () => clearTimeout(idleT.current), []);
  const toggle = (key, id) => set(key, f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id]);
  const [growerQ, setGrowerQ] = useState('');
  const [allCountries, setAllCountries] = useState(false);
  const cnt = (skip, test) => wsFacetBase(f, skip).filter(test).length;

  /* everything currently on, as removable chips */
  const chips = [];
  const push = (k, id, label) => chips.push({ k, id, label });
  if (f.cat !== 'all') push('cat', null, (WS_CAT_MAP[f.cat] || {}).label);
  f.types.forEach((id) => push('types', id, (WS_TYPES.find((t) => t.id === id) || {}).label));
  f.colours.forEach((id) => push('colours', id, (WS_COLOURS.find((c) => c.id === id) || {}).label));
  f.lengths.forEach((id) => push('lengths', id, (WS_LENGTHS.find((l) => l.id === id) || {}).range));
  (f.weights || []).forEach((id) => push('weights', id, id + ' g +'));
  f.grades.forEach((id) => push('grades', id, (WS_GRADES.find((g) => g.id === id) || {}).label));
  f.ripe.forEach((id) => push('ripe', id, (WS_RIPE.find((r) => r.id === id) || {}).label));
  f.vase.forEach((id) => push('vase', id, (WS_VASEOPTS.find((v) => v.id === id) || {}).label));
  f.certs.forEach((id) => push('certs', id, (WS_CERTS.find((c) => c.id === id) || {}).label));
  f.origins.forEach((id) => push('origins', id, (allOrigins.find((o) => o.oc === id) || {}).origin || id));
  f.growers.forEach((id) => push('growers', id, id));
  if (f.scent) push('scent', null, 'Scented only');
  const drop = (c) => {
    if (c.k === 'scent') set('scent', false);
    else if (c.k === 'cat') set('cat', 'all');
    else set(c.k, f[c.k].filter((x) => x !== c.id));
  };

  const quick = [
    { id: 'top', on: f.grades.includes('extra'), label: 'Top grade', act: () => toggle('grades', 'extra') },
    { id: 'scent', on: !!f.scent, label: 'Scented', act: () => set('scent', !f.scent) },
    { id: 'long', on: f.vase.includes(12), label: 'Long vase life', act: () => toggle('vase', 12) },
  ];

  const growers = allGrowers.filter((g) => g.toLowerCase().includes(growerQ.trim().toLowerCase()));
  const countries = allCountries ? allOrigins : allOrigins.slice(0, 6);

  return (
    <aside className={"ws-sidebar" + (scrolling ? " scrolling" : "")} onScroll={onScroll}>
      <div className="ws-sb-head">
        <span className="ws-sb-title">{WI.sliders({})}Filters</span>
        {activeCount > 0
          ? <button className="ws-sb-clear" onClick={onClear}>Clear all</button>
          : <span className="ws-sb-res">{resultCount != null ? resultCount + ' results' : ''}</span>}
      </div>

      {chips.length > 0 && (
        <div className="ws-sb-chips">
          {chips.map((c, i) => (
            <button key={c.k + (c.id || '') + i} type="button" className="ws-sb-chip" onClick={() => drop(c)}>
              {c.label}<span className="x">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="ws-sb-quick">
        {quick.map((q) => (
          <button key={q.id} type="button" className={`ws-qpill ${q.on ? 'on' : ''}`} onClick={q.act}>{q.label}</button>
        ))}
      </div>

      <WsFilterSection title="Type" n={f.types.length} hint={f.types.length ? f.types.length + ' selected' : 'Any'}>
        <div className="ws-checks">
          {WS_TYPES.map((t) => (
            <WsRow key={t.id} on={f.types.includes(t.id)} n={cnt('types', (p) => wsType(p) === t.id)} onClick={() => toggle('types', t.id)}>{t.label}</WsRow>
          ))}
        </div>
      </WsFilterSection>

      <WsFilterSection title="Country" n={f.origins.length} defaultOpen={false} hint={f.origins.length ? f.origins.length + ' selected' : 'Any origin'}>
        <div className="ws-checks">
          {countries.map((o) => (
            <WsRow key={o.oc} on={f.origins.includes(o.oc)} n={cnt('origins', (p) => p.oc === o.oc)} onClick={() => toggle('origins', o.oc)}>
              <span className="ws-oc">{o.oc}</span>{o.origin}
            </WsRow>
          ))}
        </div>
        {allOrigins.length > 6 && (
          <button type="button" className="ws-more" onClick={() => setAllCountries(!allCountries)}>
            {allCountries ? 'Show fewer' : 'Show all ' + allOrigins.length + ' countries'}
          </button>
        )}
      </WsFilterSection>

      <WsFilterSection title="Grower" n={f.growers.length} defaultOpen={false} hint={f.growers.length ? f.growers.length + ' selected' : allGrowers.length + ' growers'}>
        <div className="ws-sb-find">
          {WI.search({})}
          <input value={growerQ} onChange={(e) => setGrowerQ(e.target.value)} placeholder="Find a grower" />
          {growerQ && <button type="button" className="cl" onClick={() => setGrowerQ('')}>×</button>}
        </div>
        <div className="ws-checks scroll-list">
          {growers.map((g) => (
            <WsRow key={g} on={f.growers.includes(g)} n={cnt('growers', (p) => p.grower === g)} onClick={() => toggle('growers', g)}>{g}</WsRow>
          ))}
          {growers.length === 0 && <p className="ws-sb-none">No grower matches that name.</p>}
        </div>
      </WsFilterSection>

      <WsFilterSection title="Colour" n={f.colours.length}>
        <div className="ws-swatches">
          {WS_COLOURS.map((c) => {
            const n = cnt('colours', (p) => p.colour === c.id);
            const on = f.colours.includes(c.id);
            return (
              <button key={c.id} type="button" className={`ws-swatch ${on ? 'on' : ''} ${n === 0 && !on ? 'dead' : ''}`} disabled={n === 0 && !on}
                onClick={() => toggle('colours', c.id)} title={c.label + ' · ' + n + ' products'}>
                <span className={`sw ${c.hex === 'mixed' ? 'mixed' : ''}`} style={c.hex === 'mixed' ? {} : { background: c.hex }} />
                <span className="swl">{c.label}</span><span className="swn">{n}</span>
              </button>
            );
          })}
        </div>
      </WsFilterSection>

      <WsFilterSection title="Stem length" n={f.lengths.length}>
        <div className="ws-lenwrap">
          {WS_LENGTHS.map((l) => {
            const n = cnt('lengths', (p) => l.test(p.stemCm));
            const on = f.lengths.includes(l.id);
            return (
              <button key={l.id} type="button" className={`ws-lenchip ${on ? 'on' : ''} ${n === 0 && !on ? 'dead' : ''}`} disabled={n === 0 && !on} onClick={() => toggle('lengths', l.id)}>
                <b>{l.range}</b><span>{l.label}</span><i>{n}</i>
              </button>
            );
          })}
        </div>
      </WsFilterSection>


    </aside>
  );
}

/* ---------------- full-page checkout ---------------- */
function WsCheckoutPage({ lines, subtotal, units, placed, orderNo, onPlace, onBack, onInc, onDec, onRemove, onTrack, onContinue }) {
  const { useState, useMemo } = React;
  const meetsMin = subtotal >= WS_MIN_ORDER;
  const [dateIdx, setDateIdx] = useState(0);
  const [payMethod, setPayMethod] = useState('transfer');
  const acct = (typeof window !== 'undefined' && window.WS_ACCOUNT) || { creditLimit: 0, creditUsed: 0 };
  const balance = (typeof loadBalance === 'function') ? loadBalance() : 0;
  const enoughBalance = balance >= total;
  const terms = payMethod === 'transfer' ? 'Bank transfer' : 'Account balance';
  const logistics = 24.5;
  const total = subtotal + logistics;

  const oc = (typeof ORD_CONTACT !== 'undefined') ? ORD_CONTACT : { first: '', last: '', street: '', postcode: '', city: '', country: 'Netherlands' };
  const [form, setForm] = useState({
    email: (typeof ORD_EMAIL !== 'undefined' ? ORD_EMAIL : ''),
    country: oc.country, first: oc.first, last: oc.last, address: oc.street, apt: '',
    postcode: oc.postcode, city: oc.city, phone: (typeof ORD_PHONE !== 'undefined' ? ORD_PHONE : ''),
  });
  const setFld = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const [newsletter, setNewsletter] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);
  const [shipToAccount, setShipToAccount] = useState(true);
  const [useAcctEmail, setUseAcctEmail] = useState(true);
  const [discount, setDiscount] = useState('');

  const dates = useMemo(() => {
    const out = []; const d = new Date();
    while (out.length < 3) { d.setDate(d.getDate() + 1); const wd = d.getDay(); if (wd >= 1 && wd <= 5) out.push(new Date(d)); }
    return out;
  }, []);
  const fmtDate = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  if (placed) {
    return (
      <div className="ws-cop">
        <div className="ws-cop-grid">
          <div className="ws-cop-main ws-cop-confirm">
            <div className="ws-cop-badge">{WI.check({})}</div>
            <p className="ws-cop-eyebrow">Order confirmed</p>
            <h1 className="ws-cop-thanks">Thank you for your order</h1>
            <p className="ws-cop-lead">Order <span className="ws-order">{orderNo}</span> is booked for the next auction round. We’ve sent a confirmation to <b>{form.email}</b>.</p>
            <div className="ws-cop-recap">
              <div className="ws-cop-recrow"><span className="k">Delivery date</span><span className="v">{fmtDate(dates[dateIdx])}</span></div>
              <div className="ws-cop-recrow"><span className="k">Payment</span><span className="v">{terms}</span></div>
              <div className="ws-cop-recrow"><span className="k">Ship to</span><span className="v">{ORD_ADDRESS}</span></div>
            </div>
            <div className="ws-cop-done-btns">
              <button className="ws-checkout" onClick={onTrack}>{WI.clock({})}Order history</button>
              <button className="ws-tobasket" onClick={onContinue}>Continue shopping</button>
            </div>
          </div>
          <aside className="ws-cop-side">
            <div className="ws-cop-summary">
              <div className="ws-cop-sumlines">
                {lines.map(({ p, qty }) => {
                  const cat = WS_CAT_MAP[p.cat] || {};
                  return (
                    <div className="ws-cop-sline" key={p.id}>
                      <div className="ws-cop-thumb">
                        <div className="lp" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <span className="ws-cop-qb">{qty}</span>
                      </div>
                      <div className="ws-cop-sinfo">
                        <div className="ws-cop-sname">{p.name}</div>
                        <div className="ws-cop-svar">{ppQty(p, qty)}</div>
                      </div>
                      <span className="ws-cop-sprice">{wsEuro(ppLineTotal(p, qty))}</span>
                    </div>
                  );
                })}
              </div>
              <div className="ws-srow"><span>Subtotal</span><span className="v">{wsEuro(subtotal)}</span></div>
              <div className="ws-srow"><span>Shipping</span><span className="v">{wsEuro(logistics)}</span></div>
              <div className="ws-srow total"><span>Total</span><span className="v"><span className="ws-cop-cur">EUR</span> {wsEuro(total)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  const fld = (k, label, { type = 'text', icon } = {}) => (
    <label className={`ws-fld ${icon ? 'has-ic' : ''}`} key={k}>
      <input type={type} value={form[k]} onChange={setFld(k)} placeholder=" " />
      <span className="ws-fld-lbl">{label}</span>
      {icon && <span className="ws-fld-ic">{icon}</span>}
    </label>
  );

  return (
    <div className="ws-cop">
      <p className="ob-breadcrumb">PP Flowers <span className="sep">›</span> Webshop <span className="sep">›</span> Checkout</p>
      <div className="ws-cop-grid">
        <div className="ws-cop-main">
          <section className="ws-cop-sec">
            <div className="ws-cop-h"><h2>Contact</h2></div>
            {useAcctEmail ? (
              <div className="ws-cop-acctaddr">orders@testaccount.nl</div>
            ) : (
              <label className="ws-fld">
                <input type="email" value={form.email} onChange={setFld('email')} placeholder=" " />
                <span className="ws-fld-lbl">Email or mobile phone number</span>
              </label>
            )}
            <label className="ws-cop-check" onClick={() => setUseAcctEmail((v) => !v)}>
              <span className={`ws-cop-box ${useAcctEmail ? 'on' : ''}`}>{useAcctEmail && WI.check({})}</span>
              <span>Use my email in account address</span>
            </label>
          </section>

          <section className="ws-cop-sec">
            <h2>Delivery</h2>
            {shipToAccount ? (
              <div className="ws-cop-acctaddr">
                {ORD_ADDRESS}
              </div>
            ) : (
              <React.Fragment>
                <label className="ws-fld ws-fld-sel">
                  <select value={form.country} onChange={setFld('country')}>
                    <option>Netherlands</option><option>Belgium</option><option>Germany</option><option>France</option><option>United Kingdom</option>
                  </select>
                  <span className="ws-fld-lbl up">Country / region</span>
                  <span className="ws-fld-ic">{OBI.chev({ style: { transform: 'rotate(90deg)' } })}</span>
                </label>
                <div className="ws-cop-row2">{fld('first', 'First name')}{fld('last', 'Last name')}</div>
                {fld('address', 'Street and house number', { icon: WI.search({}) })}
                {fld('apt', 'Apartment, suite, etc. (optional)')}
                <div className="ws-cop-row2">{fld('postcode', 'Postcode')}{fld('city', 'City')}</div>
                {fld('phone', 'Phone (optional)')}
                <label className="ws-cop-check" onClick={() => setSaveInfo((v) => !v)}>
                  <span className={`ws-cop-box ${saveInfo ? 'on' : ''}`}>{saveInfo && WI.check({})}</span>
                  <span>Save this address to my account</span>
                </label>
              </React.Fragment>
            )}
            <label className="ws-cop-check" onClick={() => setShipToAccount((v) => !v)}>
              <span className={`ws-cop-box ${shipToAccount ? 'on' : ''}`}>{shipToAccount && WI.check({})}</span>
              <span>Ship to my account address</span>
            </label>
          </section>

          <section className="ws-cop-sec">
            <h2>Payment</h2>
            <div className="ws-pay-opts">
              <button type="button" className={`ws-pay-opt ${payMethod === 'transfer' ? 'on' : ''}`} onClick={() => setPayMethod('transfer')}>
                <span className="ws-pay-radio" />
                <span className="ws-pay-ic">{WI.bank ? WI.bank({}) : WI.card({})}</span>
                <span className="ws-pay-tx">
                  <span className="ws-pay-t">Bank transfer</span>
                  <span className="ws-pay-s">Pay by SEPA transfer · order is booked once payment is received</span>
                </span>
              </button>
              <button type="button" className={`ws-pay-opt ${payMethod === 'balance' ? 'on' : ''}`} onClick={() => setPayMethod('balance')} disabled={!enoughBalance}>
                <span className="ws-pay-radio" />
                <span className="ws-pay-ic">{WI.wallet ? WI.wallet({}) : WI.card({})}</span>
                <span className="ws-pay-tx">
                  <span className="ws-pay-t">Pay with account balance{enoughBalance && <span className="ws-pay-tag">Instant</span>}</span>
                  <span className="ws-pay-s">{enoughBalance
                    ? `${'€\u00A0' + Math.round(balance).toLocaleString('de-DE')} available · deducted on order`
                    : `Balance too low · ${'€\u00A0' + Math.round(balance).toLocaleString('de-DE')} available, top up to use`}</span>
                </span>
              </button>
            </div>
            <button className="ws-checkout ws-cop-pay" disabled={units === 0 || !meetsMin || (payMethod === 'balance' && !enoughBalance)}
              onClick={() => onPlace({ deliveryDate: dates[dateIdx].toISOString(), terms })}>
              {payMethod === 'transfer' ? 'Place order · bank transfer' : 'Pay with balance'} · {wsEuro(total)}
            </button>
            <p className="ws-cop-secure">{WI.check({})}All transactions are secure and encrypted.</p>
          </section>
        </div>

        <aside className="ws-cop-side">
          <div className="ws-cop-summary">
            <div className="ws-cop-sumlines">
              {lines.map(({ p, qty }) => {
                const cat = WS_CAT_MAP[p.cat] || {};
                return (
                  <div className="ws-cop-sline" key={p.id}>
                    <div className="ws-cop-thumb">
                      <div className="lp" style={{ '--ph-tint': cat.tint, backgroundImage: `url("${wsShot(p.id)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <span className="ws-cop-qb">{qty}</span>
                    </div>
                    <div className="ws-cop-sinfo">
                      <div className="ws-cop-sname">{p.name}</div>
                      <div className="ws-cop-svar">{ppQty(p, qty)}</div>
                    </div>
                    <span className="ws-cop-sprice">{wsEuro(ppLineTotal(p, qty))}</span>
                  </div>
                );
              })}
            </div>
            <div className="ws-cop-disc">
              <input value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Discount code or gift card" />
              <button type="button" disabled={!discount.trim()}>Apply</button>
            </div>
            <div className="ws-srow"><span>Subtotal</span><span className="v">{wsEuro(subtotal)}</span></div>
            <div className="ws-srow"><span>Shipping</span><span className="v">{wsEuro(logistics)}</span></div>
            <div className="ws-srow total"><span>Total</span><span className="v"><span className="ws-cop-cur">EUR</span> {wsEuro(total)}</span></div>
            <div className={`ws-min ${meetsMin ? 'ok' : 'under'}`}>
              {meetsMin ? WI.check({}) : OBI.info({})}
              {meetsMin
                ? <span>You’ve met the <b>{wsEuro(WS_MIN_ORDER)}</b> wholesale minimum.</span>
                : <span>Add <b>{wsEuro(WS_MIN_ORDER - subtotal)}</b> more to reach the <b>{wsEuro(WS_MIN_ORDER)}</b> minimum.</span>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- main view ---------------- */
function WebshopView({ onNavigate, initialCat, scope, setScope }) {
  const { useState, useMemo, useEffect } = React;
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ cat: 'all', types: [], colours: [], lengths: [], weights: [], avail: [], origins: [], growers: [], badges: [], grades: [], ripe: [], vase: [], certs: [], scent: false, maxPrice: null, ids: null });
  const setF = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const [openSeg, setOpenSeg] = useState(null); // command-band segment: 'search' | 'grower' | 'len'
  const [sort, setSort] = useState('featured');
  const [cart, setCart] = useState({});       // { id: qty }
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const [selected, setSelected] = useState(null);  // product detail
  const [view, setView] = useState('grid');        // grid · quick
  const [mode, setMode] = useState('home');         // home · catalogue

  const stepOf = (id) => { const p = WS_PRODUCTS.find((x) => x.id === id); return p ? (p.unit === 'piece' ? 1 : p.bunch) : 1; };
  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + stepOf(id) }));
  const inc = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + stepOf(id) }));
  const dec = (id) => setCart((c) => { const n = (c[id] || 0) - stepOf(id); const next = { ...c }; if (n <= 0) delete next[id]; else next[id] = n; return next; });
  const remove = (id) => setCart((c) => { const next = { ...c }; delete next[id]; return next; });
  const clear = () => setCart({});
  const setQty = (id, n) => setCart((c) => { const next = { ...c }; if (n <= 0) delete next[id]; else next[id] = n; return next; });
  const addBox = (p) => setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + ppLot(p) }));
  const swap = (fromId, p) => setCart((c) => { const q = c[fromId] || 0; const next = { ...c }; delete next[fromId]; if (q > 0) next[p.id] = (next[p.id] || 0) + q; return next; });
  const subBox = (p) => setCart((c) => { const n = (c[p.id] || 0) - ppLot(p); const next = { ...c }; if (n <= 0) delete next[p.id]; else next[p.id] = n; return next; });
  const [wish, setWish] = useState(() => (typeof loadWishlist === 'function' ? loadWishlist() : []));
  const toggleWish = (id) => setWish((w) => { const n = w.includes(id) ? w.filter((x) => x !== id) : [id, ...w]; if (typeof saveWishlist === 'function') saveWishlist(n); return n; });

  useEffect(() => {
    const r = (typeof takeReorder === 'function') ? takeReorder() : null;
    if (r && Object.keys(r).length) { setCart(r); setOpen(true); }
  }, []);

  useEffect(() => {
    window.__openCart = () => setOpen(true);
    return () => { if (window.__openCart) delete window.__openCart; };
  }, []);

  useEffect(() => {
    if (!initialCat) return;
    setQuery('');
    setFilters((f) => ({ ...f, cat: initialCat === 'shop' ? 'all' : initialCat }));
    setMode('catalogue');
    const s = document.querySelector('.scroll'); if (s) s.scrollTop = 0;
  }, [initialCat]);

  const openDetail = (p) => { setSelected(p); const s = document.querySelector('.scroll'); if (s) s.scrollTop = 0; };
  const closeDetail = () => { setSelected(null); const s = document.querySelector('.scroll'); if (s) s.scrollTop = 0; };
  const scrollTop = () => { const s = document.querySelector('.scroll'); if (s) s.scrollTop = 0; };
  const goCatalogue = (catId) => { setFilters((f) => ({ ...f, cat: catId || 'all' })); setQuery(''); setMode('catalogue'); scrollTop(); };
  const goColour = (colId) => { setFilters((f) => ({ ...f, cat: 'all', colours: [colId], badges: [] })); setQuery(''); setMode('catalogue'); scrollTop(); };
  const goTag = (badge) => { setFilters((f) => ({ ...f, cat: 'all', colours: [], badges: [badge] })); setQuery(''); setMode('catalogue'); scrollTop(); };
  const goFilter = (preset) => {
    const base = { cat: 'all', types: [], colours: [], lengths: [], avail: [], origins: [], growers: [], badges: [], grades: [], ripe: [], vase: [], certs: [], scent: false, maxPrice: null, ids: null };
    setFilters({ ...base, ...(preset.filters || {}) });
    setSort(preset.sort || 'featured');
    setQuery(''); setMode('catalogue'); scrollTop();
  };
  const searchTo = (q) => { setQuery(q); setMode('catalogue'); scrollTop(); };
  useEffect(() => { window.__wsSearch = searchTo; return () => { if (window.__wsSearch) delete window.__wsSearch; }; }, []);
  const goHome = () => { setSelected(null); setMode('home'); scrollTop(); };
  useEffect(() => { window.__wsGoHome = goHome; return () => { if (window.__wsGoHome) delete window.__wsGoHome; }; }, []);

  const catCounts = useMemo(() => {
    const m = { all: WS_PRODUCTS.length };
    for (const p of WS_PRODUCTS) m[p.cat] = (m[p.cat] || 0) + 1;
    return m;
  }, []);

  const allOrigins = useMemo(() => {
    const seen = {}; const out = [];
    WS_PRODUCTS.forEach((p) => { if (!seen[p.oc]) { seen[p.oc] = 1; out.push({ oc: p.oc, origin: p.origin }); } });
    return out;
  }, []);
  const allGrowers = useMemo(() => [...new Set(WS_PRODUCTS.map((p) => p.grower))].sort(), []);
  const activeCount = filters.types.length + filters.colours.length + filters.lengths.length + (filters.weights || []).length
    + filters.origins.length + filters.growers.length + filters.badges.length
    + filters.grades.length + filters.ripe.length + filters.vase.length + filters.certs.length
    + (filters.scent ? 1 : 0) + (filters.maxPrice != null ? 1 : 0) + (filters.ids ? 1 : 0) + (filters.cat !== 'all' ? 1 : 0);
  const clearFilters = () => setFilters({ cat: 'all', types: [], colours: [], lengths: [], weights: [], avail: [], origins: [], growers: [], badges: [], grades: [], ripe: [], vase: [], certs: [], scent: false, maxPrice: null, ids: null });

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = WS_PRODUCTS.filter((p) => {
      if (filters.cat !== 'all' && p.cat !== filters.cat) return false;
      if (q && !(p.name.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q) || p.grower.toLowerCase().includes(q) || p.origin.toLowerCase().includes(q))) return false;
      if (filters.ids && !filters.ids.includes(p.id)) return false;
      if (filters.colours.length && !filters.colours.includes(p.colour)) return false;
      if (filters.types.length && !filters.types.includes(wsType(p))) return false;
      if (filters.maxPrice != null && p.perStem > filters.maxPrice) return false;
      if (filters.grades.length && !filters.grades.includes(wsGradeId(p))) return false;
      if (filters.ripe.length && !filters.ripe.includes(p.ripe)) return false;
      if (filters.vase.length && !filters.vase.some((min) => p.vase >= min)) return false;
      if (filters.certs.length && !filters.certs.some((c) => p.certs.includes(c))) return false;
      if (filters.scent && !p.scent) return false;
      if (filters.lengths.length && !filters.lengths.some((id) => { const Lr = WS_LENGTHS.find((x) => x.id === id); return Lr && Lr.test(p.stemCm); })) return false;
      if (filters.weights && filters.weights.length && !(p.bunchG != null && filters.weights.some((g) => p.bunchG >= g))) return false;
      if (filters.avail.length && !filters.avail.includes(wsAvail(p).level)) return false;
      if (filters.origins.length && !filters.origins.includes(p.oc)) return false;
      if (filters.growers.length && !filters.growers.includes(p.grower)) return false;
      if (filters.badges && filters.badges.length && !filters.badges.includes(p.badge)) return false;
      return true;
    });
    const by = {
      'price-asc': (a, b) => a.perStem - b.perStem,
      'price-desc': (a, b) => b.perStem - a.perStem,
      'stem-desc': (a, b) => b.stemCm - a.stemCm,
      'name': (a, b) => a.name.localeCompare(b.name),
    }[sort];
    if (by) list = [...list].sort(by);
    // lead with cards that have a real photo so the grid opens on imagery
    list = [...list.filter((p) => WS_HAS_PHOTO.has(p.id)), ...list.filter((p) => !WS_HAS_PHOTO.has(p.id))];
    return list;
  }, [query, filters, sort]);

  const lines = useMemo(() => Object.entries(cart)
    .map(([id, qty]) => ({ p: WS_PRODUCTS.find((x) => x.id === id), qty }))
    .filter((l) => l.p), [cart]);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + ppLineTotal(l.p, l.qty), 0), [lines]);
  const units = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  useEffect(() => { window.__cartUnits = units; window.__cartSubtotal = subtotal; window.__cartLines = lines.length; window.__cartMin = WS_MIN_ORDER; }, [units, subtotal, lines]);

  const placeOrder = (delivery) => {
    const id = 'PP-' + Math.floor(100000 + Math.random() * 899999);
    const order = {
      id, placedAt: new Date().toISOString(), status: 'confirmed', region: 'eu',
      address: ORD_ADDRESS, terms: delivery.terms, deliveryDate: delivery.deliveryDate,
      lines: lines.map(({ p, qty }) => ordLine(p.id, qty)).filter(Boolean),
    };
    addOrder(order);
    setOrderNo(id); setPlaced(true);
  };
  const goCheckout = () => { setOpen(false); setPlaced(false); setCheckout(true); scrollTop(); };
  const trackOrder = () => { setPlaced(false); setCheckout(false); setOpen(false); setCart({}); onNavigate && onNavigate('orders'); };
  const continueShopping = () => { setPlaced(false); setCheckout(false); setOpen(false); setCart({}); scrollTop(); };
  const backToBasket = () => { setCheckout(false); setOpen(true); scrollTop(); };

  return (
    <div className="canvas-max" style={{ maxWidth: 1180 }}>
      {checkout ? (
        <WsCheckoutPage lines={lines} subtotal={subtotal} units={units} placed={placed} orderNo={orderNo}
          onPlace={placeOrder} onBack={backToBasket} onInc={inc} onDec={dec} onRemove={remove}
          onTrack={trackOrder} onContinue={continueShopping} />
      ) : selected ? (
        <WsDetail p={selected} qty={cart[selected.id] || 0}
          onAdd={() => add(selected.id)} onInc={() => inc(selected.id)} onDec={() => dec(selected.id)}
          onBack={closeDetail} onOpen={openDetail} onBasket={() => setOpen(true)} onSearch={searchTo} units={units} subtotal={subtotal} />
      ) : mode === 'home' ? (
        <WsCommandCenter
          cart={cart} catCounts={catCounts}
          onAddBox={addBox} onSubBox={subBox} onOpenDetail={openDetail}
          onGoCatalogue={goCatalogue} onSearch={searchTo} onGoColour={goColour} onGoTag={goTag} onGoFilter={goFilter}
          lines={lines} subtotal={subtotal} units={units} minOrder={WS_MIN_ORDER}
          onInc={inc} onDec={dec} onCheckout={() => setOpen(true)} onNavigate={onNavigate} scope={scope} setScope={setScope} />
      ) : (
        <React.Fragment>
          <div className="ws-catband">
            <div className="wh-bar">
              <div className="wh-searchwrap">
                {openSeg && <div className="wh-sb-scrim" onClick={() => setOpenSeg(null)} />}
                <div className={`wh-searchbar ${openSeg ? 'act' : ''}`} role="search">
                  <div className={`wh-sb-seg grow ${openSeg === 'search' ? 'on' : ''}`} onClick={() => setOpenSeg('search')}>
                    <span className="wh-sb-mark">🪴</span>
                    <div className="wh-sb-txt">
                      <span className="wh-sb-k">Search</span>
                      <input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setOpenSeg('search')}
                        onKeyDown={(e) => { if (e.key === 'Enter') setOpenSeg(null); }}
                        placeholder="Flowers, plants, growers…" aria-label="Search the assortment" />
                    </div>
                    {openSeg === 'search' && (
                      <div className="wh-pop" onClick={(e) => e.stopPropagation()}>
                        {query.trim() ? (
                          <React.Fragment>
                            <p className="wh-pop-h">Products</p>
                            {WS_PRODUCTS.filter((p) => (p.name + ' ' + p.sub + ' ' + p.grower).toLowerCase().includes(query.toLowerCase())).slice(0, 6).map((p) => (
                              <button key={p.id} className="wh-pop-row" onClick={() => { setOpenSeg(null); openDetail(p); }}>
                                <span className="wh-pop-ic" style={{ background: (WS_CAT_MAP[p.cat] || {}).tint }}>{WI.bud({})}</span>
                                <span className="wh-pop-tx"><b>{p.name}</b><span>{(WS_CAT_MAP[p.cat] || {}).label} · {p.stemCm} cm</span></span>
                              </button>
                            ))}
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <p className="wh-pop-h">Recent searches</p>
                            {['Red Naomi 60cm', 'Eucalyptus', 'Peonies'].map((t) => (
                              <button key={t} className="wh-pop-row" onClick={() => { setQuery(t); setOpenSeg(null); }}>
                                <span className="wh-pop-ic">{WI.clock({})}</span>
                                <span className="wh-pop-tx"><b>{t}</b></span>
                              </button>
                            ))}
                            <p className="wh-pop-h">Browse categories</p>
                            <div className="wh-pop-tiles">
                              {WS_CATS.filter((c) => c.id !== 'all').slice(0, 6).map((c) => (
                                <button key={c.id} className="wh-pop-tile" onClick={() => { setOpenSeg(null); setF('cat', c.id); }}>
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
                    <span className={`wh-sb-v ${filters.growers.length ? '' : 'muted'}`}>{filters.growers[0] || 'Add any grower'}</span>
                    {openSeg === 'grower' && (
                      <div className="wh-pop" onClick={(e) => e.stopPropagation()}>
                        <p className="wh-pop-h">Popular growers</p>
                        <button className="wh-pop-row" onClick={() => { setF('growers', []); setOpenSeg('len'); }}>
                          <span className="wh-pop-ic">{WI.spark({})}</span><span className="wh-pop-tx"><b>Any grower</b><span>Show the whole assortment</span></span>
                        </button>
                        {allGrowers.slice(0, 8).map((g) => (
                          <button key={g} className="wh-pop-row" onClick={() => { setF('growers', [g]); setOpenSeg('len'); }}>
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
                    <span className={`wh-sb-v ${filters.lengths.length ? '' : 'muted'}`}>{filters.lengths.length ? (WS_LENGTHS.find((l) => l.id === filters.lengths[0]) || {}).range : 'Any length'}</span>
                    {openSeg === 'len' && (
                      <div className="wh-pop right" onClick={(e) => e.stopPropagation()}>
                        <p className="wh-pop-h">Stem length</p>
                        <button className="wh-pop-row" onClick={() => { setF('lengths', []); setOpenSeg(null); }}>
                          <span className="wh-pop-ic">{WI.spark({})}</span><span className="wh-pop-tx"><b>Any length</b><span>Show every grade</span></span>
                        </button>
                        <div className="wh-len-grid">
                          {WS_LENGTHS.map((l) => (
                            <button key={l.id} className={`wh-len-chip ${filters.lengths[0] === l.id ? 'on' : ''}`} onClick={() => { setF('lengths', [l.id]); setOpenSeg(null); }}>
                              <b>{l.range}</b><span>{l.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button type="button" className="wh-sb-go" onClick={() => setOpenSeg(null)} aria-label="Search">{WI.search({})}</button>
                </div>
              </div>
            </div>
          </div>


          <div className="ws-head">
            <div>
              <h1 className="ws-title">{filters.cat === 'all' ? 'Full assortment' : (WS_CAT_MAP[filters.cat] || {}).label}</h1>
            </div>
          </div>

          <div className="ws-layout">
            <WsSidebar f={filters} set={setF} catCounts={catCounts} allOrigins={allOrigins} allGrowers={allGrowers} activeCount={activeCount} onClear={clearFilters} resultCount={shown.length} />
            <div className="ws-main">
          <div className="ws-toolbar">
            <div className="ws-tools-spacer" />
            <span className="ws-count">{shown.length} {shown.length === 1 ? 'product' : 'products'}</span>
            <div className="ws-viewtoggle">
              <button className={`ws-vt ${view === 'grid' ? 'on' : ''}`} onClick={() => setView('grid')} title="Grid view">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>
                <span>Grid</span>
              </button>
              <button className={`ws-vt ${view === 'photo' ? 'on' : ''}`} onClick={() => setView('photo')} title="Photo cards">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 16l4.5-4.2a2 2 0 0 1 2.7 0L15 16"/><circle cx="15.6" cy="9.2" r="1.5"/></svg>
                <span>Photos</span>
              </button>
            </div>
            <div className="ws-sort">
              {WI.sliders({})}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {WS_SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <span className="ws-sort-chev">{OBI.chev({ style: { transform: 'rotate(90deg)' } })}</span>
            </div>
          </div>

          {shown.length === 0 ? (
            <div className="ws-grid">
              <div className="ws-empty">
                <div className="ec">{WI.search({})}</div>
                <h3>No products match</h3>
                <p>Try a different search term or clear the filters to see the full assortment.</p>
              </div>
            </div>
          ) : view === 'photo' ? (
            <div className="wh-grid ws-cat-photogrid">
              {shown.map((p) => (
                <WhProductCard key={p.id} p={p} qty={cart[p.id] || 0}
                  onAddBox={addBox} onSubBox={subBox} onOpen={openDetail}
                  wished={wish.includes(p.id)} onToggleWish={toggleWish} />
              ))}
            </div>
          ) : (
            <div className="wh-grid ws-cat-grid">
              {shown.map((p) => (
                <WhCard key={p.id} p={p} qty={cart[p.id] || 0}
                  onAddBox={addBox} onSub={subBox} onOpen={openDetail}
                  wished={wish.includes(p.id)} onToggleWish={toggleWish} tiered />
              ))}
            </div>
          )}
            </div>
          </div>
        </React.Fragment>
      )}

      <WsCartDrawer open={open} lines={lines} subtotal={subtotal} units={units}
        onClose={() => setOpen(false)} onInc={inc} onDec={dec} onRemove={remove} onClear={clear} onSwap={swap}
        placed={false} orderNo={orderNo} onPlace={placeOrder} onContinue={continueShopping} onTrack={trackOrder}
        onCheckout={goCheckout} />
    </div>
  );
}

Object.assign(window, { WebshopView });
