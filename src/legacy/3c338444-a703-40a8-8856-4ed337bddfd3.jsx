// orders.jsx — "Order history": purchase list + order detail (no live tracking)
// Depends on: orders-store.jsx, WS_CAT_MAP, OBI, WI

const REICON = (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11a9 9 0 0 1 14.5-7L21 7"/><path d="M21 3v4h-4"/><path d="M21 13a9 9 0 0 1-14.5 7L3 17"/><path d="M3 21v-4h4"/></svg>);
const CAL_ICON = (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>);

function OrdThumbs({ lines, max = 4 }) {
  const extra = lines.length - max;
  return (
    <div className="ord-thumbs">
      {lines.slice(0, max).map((l) => {
        const c = WS_CAT_MAP[l.cat] || {};
        return <span className="ord-thumb" key={l.id} style={{ '--ph-tint': c.tint, backgroundImage: `url("${wsShot(l.id)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} title={l.name} />;
      })}
      {extra > 0 && <span className="ord-thumb more">+{extra}</span>}
    </div>
  );
}

/* ---------------- history row ---------------- */
function OrderRow({ o, onOpen, onReorder }) {
  const total = ordSubtotal(o) + ORD_LOGISTICS;
  const units = ordUnits(o);
  const names = o.lines.map((l) => l.name);
  const preview = names.slice(0, 2).join(', ') + (names.length > 2 ? ` +${names.length - 2}` : '');
  const d = new Date(o.placedAt);
  const wd = d.toLocaleDateString('en-GB', { weekday: 'short' });
  const day = d.toLocaleDateString('en-GB', { day: 'numeric' });
  const mo = d.toLocaleDateString('en-GB', { month: 'short' });
  return (
    <div className="ohrow" onClick={() => onOpen(o.id)} role="button" tabIndex={0}>
      <div className="ohrow-date">
        <span className="wd">{wd}</span>
        <span className="dd">{day}</span>
        <span className="mo">{mo}</span>
      </div>
      <div className="ohrow-id">
        <span className="num">{o.id}</span>
        <span className="meta">{o.lines.length} products · {units} {units === 1 ? 'item' : 'items'}</span>
      </div>
      <div className="ohrow-prod">
        <OrdThumbs lines={o.lines} />
        <span className="names">{preview}</span>
      </div>
      <span className="ohrow-tag">{o.terms}</span>
      <span className="ohrow-total">{ordEuro(total)}</span>
      <button className="o3row-re" onClick={(e) => { e.stopPropagation(); onReorder(o); }} title="Add these items to your basket">{REICON}</button>
      <span className="o3row-go">{OBI.fwd()}</span>
    </div>
  );
}

/* ---------------- order detail ---------------- */
function OrderDetailView({ o, onBack, onReorder }) {
  const subtotal = ordSubtotal(o);
  const total = subtotal + ORD_LOGISTICS;
  const units = ordUnits(o);
  return (
    <div className="ord-detail">
      <div className="ord-dtop">
        <button className="ws-back" onClick={onBack}>{OBI.back()}Order history</button>
        <div className="ord-dtop-r">
          <button className="ord-reorder lg" onClick={() => onReorder(o)} title="Add these items to your basket">{REICON}Reorder</button>
        </div>
      </div>

      <p className="ob-breadcrumb">Order history <span className="sep">›</span> {o.id}</p>
      <h1 className="ord-dtitle">Order {o.id}</h1>
      <p className="ord-dsub">Placed {ordDate(o.placedAt)} · {units} items · {o.lines.length} products</p>

      <div className="ord-dgrid">
        <div className="card ord-items">
          <div className="ord-items-head">Items in this order</div>
          {o.lines.map((l) => {
            const c = WS_CAT_MAP[l.cat] || {};
            const u = l.unit === 'piece' ? (l.qty === 1 ? 'piece' : 'pieces') : (l.qty === 1 ? 'bunch' : 'bunches');
            return (
              <div className="ord-item" key={l.id}>
                <span className="ord-item-th" style={{ '--ph-tint': c.tint, backgroundImage: `url("${wsShot(l.id)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="ord-item-tx">
                  <div className="ord-item-n">{l.name}</div>
                  <div className="ord-item-s">{l.unit === 'piece' ? l.origin : `${l.bunch} stems / bunch · ${l.origin}`}</div>
                </div>
                <div className="ord-item-q">{l.qty} {u}</div>
                <div className="ord-item-t">{ordEuro(ordLineTotal(l))}</div>
              </div>
            );
          })}
        </div>

        <div className="ord-aside">
          <div className="card ord-summary">
            <div className="ord-sum-h">Summary</div>
            <div className="ord-srow"><span>Subtotal · excl. VAT</span><span className="v">{ordEuro(subtotal)}</span></div>
            <div className="ord-srow"><span>Logistics</span><span className="v">{ordEuro(ORD_LOGISTICS)}</span></div>
            <div className="ord-srow total"><span>Total</span><span className="v">{ordEuro(total)}</span></div>
          </div>
          <div className="card ord-delivery-card">
            <div className="ord-sum-h">Order details</div>
            <div className="ord-dl-row"><span className="k">Order date</span><span className="v">{ordDate(o.placedAt)}</span></div>
            <div className="ord-dl-row"><span className="k">Delivery date</span><span className="v">{ordDate(o.deliveryDate)}</span></div>
            <div className="ord-dl-row"><span className="k">Delivered to</span><span className="v">{o.address}</span></div>
            <div className="ord-dl-row"><span className="k">Payment</span><span className="v">{o.terms}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- main view ---------------- */
function MyOrdersView({ onNavigate }) {
  const { useState, useMemo } = React;
  const [orders] = useState(() => loadOrders());
  const [selId, setSelId] = useState(null);
  const [q, setQ] = useState('');

  const open = (id) => { setSelId(id); const s = document.querySelector('.scroll'); if (s) s.scrollTop = 0; };
  const back = () => { setSelId(null); const s = document.querySelector('.scroll'); if (s) s.scrollTop = 0; };
  const reorder = (o) => { setReorder(orderToCart(o)); onNavigate && onNavigate('webshop'); };

  const selected = useMemo(() => orders.find((o) => o.id === selId), [orders, selId]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((o) => o.id.toLowerCase().includes(term) || o.lines.some((l) => l.name.toLowerCase().includes(term)));
  }, [orders, q]);

  // group newest-first by month
  const groups = useMemo(() => {
    const out = [];
    const idx = {};
    shown.forEach((o) => {
      const key = new Date(o.placedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      if (idx[key] === undefined) { idx[key] = out.length; out.push([key, []]); }
      out[idx[key]][1].push(o);
    });
    return out;
  }, [shown]);

  const totalSpent = useMemo(() => orders.reduce((s, o) => s + ordSubtotal(o) + ORD_LOGISTICS, 0), [orders]);

  if (selected) return <div className="canvas-max" style={{ maxWidth: 1180 }}><OrderDetailView o={selected} onBack={back} onReorder={reorder} /></div>;

  return (
    <div className="canvas-max" style={{ maxWidth: 1180 }}>
      <p className="ob-breadcrumb">PP Flowers <span className="sep">›</span> Order history</p>
      <h1 className="ord-title">Order history</h1>
      <p className="ord-sub">Every order you’ve placed with PP Flowers — reorder any of them in one click.</p>

      {orders.length === 0 ? (
        <div className="card o2empty">
          <div className="ec">{WI.cart()}</div>
          <h3>No orders yet</h3>
          <p>When you place an order from the webshop it will appear here in your history.</p>
        </div>
      ) : (
        <React.Fragment>
          <div className="oh-toolbar">
            <div className="oh-search">
              {WI.search()}
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by order number or product…" />
            </div>
            <span className="oh-count">{orders.length} orders · {ordEuro(totalSpent)} total</span>
          </div>

          {shown.length === 0 ? (
            <div className="card o2empty">
              <div className="ec">{WI.search()}</div>
              <h3>No matching orders</h3>
              <p>Try a different order number or product name.</p>
            </div>
          ) : (
            groups.map(([month, list]) => (
              <React.Fragment key={month}>
                <div className="oh-month">{month}<span>{list.length}</span></div>
                <div className="ohlist">
                  {list.map((o) => <OrderRow key={o.id} o={o} onOpen={open} onReorder={reorder} />)}
                </div>
              </React.Fragment>
            ))
          )}
        </React.Fragment>
      )}
    </div>
  );
}

Object.assign(window, { MyOrdersView, OrderDetailView, OrderRow });
