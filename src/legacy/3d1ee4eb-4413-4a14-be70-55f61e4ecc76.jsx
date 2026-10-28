// myshop.jsx — "My Shop" view (Concept B: drafts as boards) + sidebar nav item
// Depends on: myshop-store.jsx, webshop-data.jsx (wsShot, wsEuro), orders-store.jsx (setReorder)

function MyShopNavItem({ route, setRoute }) {
  const { drafts } = useMyShop();
  return (
    <div className="nav-cell">
      <button className={`nav-item ${route === 'myshop' ? 'active' : ''}`} onClick={() => setRoute('myshop')}>
        {MSI.bag()}<span>My Shop</span>
        {drafts.length > 0 && <span className="ms-navbadge">{drafts.length}</span>}
      </button>
    </div>
  );
}

/* one favourite — image card matching the draft cards */
function MsFavChip({ f, onAdd, onUnpin }) {
  const p = msProd(f.id);
  if (!p) return null;
  const unit = p.unit === 'piece' ? (f.qty === 1 ? 'piece' : 'pieces') : (f.qty === 1 ? 'bunch' : 'bunches');
  return (
    <div className="ms-wish ms-favcard">
      <div className="ms-wish-collage n1" role="button" tabIndex={0} onClick={() => onAdd(p, f.qty)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAdd(p, f.qty); } }}>
        <span className="ms-wish-cell" style={{ backgroundImage: `url("${wsShot(p.id)}")` }}></span>
        <button className="ms-favcard-heart" title="Unpin favourite" onClick={(e) => { e.stopPropagation(); onUnpin(p.id); }}>{WI.heart({})}</button>
        <span className="ms-favcard-add">{WI.plus({})}Add {f.qty}</span>
      </div>
      <div className="ms-wish-name">{p.name}</div>
      <div className="ms-wish-meta">usually {f.qty} {unit}</div>
    </div>
  );
}

/* one draft board card — Airbnb-wishlist style collage */
function MsDraftCard({ d, isOpen, onOpen }) {
  const flags = msDraftFlags(d);
  const thumbs = d.lines.slice(0, 4).map((l) => wsShot(l.id));
  const n = thumbs.length;
  return (
    <button className={`ms-wish${isOpen ? ' on' : ''}`} onClick={() => onOpen(d.id)}>
      <div className={`ms-wish-collage n${n}`}>
        {n === 0
          ? <span className="ms-wish-empty">{MSI.bag({})}<span>Empty — fill it from the webshop</span></span>
          : thumbs.map((src, i) => <span key={i} className="ms-wish-cell" style={{ backgroundImage: `url("${src}")` }}></span>)}
        {isOpen && <span className="ms-wish-open">Open</span>}
      </div>
      <div className="ms-wish-name">{d.name}</div>
      <div className="ms-wish-meta">{d.lines.length} {d.lines.length === 1 ? 'line' : 'lines'} · {msDraftUnits(d)} units · <b>{wsEuro(msDraftSubtotal(d))}</b></div>
      <div className="ms-wish-sub">
        <span>edited {msRel(d.updatedAt)}</span>
        {flags > 0 && <span className="ms-flagtag">{flags} price change{flags > 1 ? 's' : ''}</span>}
      </div>
    </button>
  );
}

/* one line in the open-draft panel */
function MsLine({ d, l }) {
  const p = msProd(l.id);
  if (!p) return null;
  const delta = msPriceDelta(l);
  const flagged = Math.abs(delta) > 0.001;
  const unit = p.unit === 'piece' ? (l.qty === 1 ? 'piece' : 'pieces') : (l.qty === 1 ? 'bunch' : 'bunches');
  return (
    <div className="ms-line">
      <span className="th" style={{ backgroundImage: `url("${wsShot(p.id)}")` }}></span>
      <div className="tx">
        <div className="n">{p.name}
          {flagged && <span className="ms-flagtag">price {delta > 0 ? '↑' : '↓'} {wsEuro(Math.abs(delta))}/stem since added</span>}
        </div>
        <div className="m">{p.unit === 'piece' ? p.origin : `${p.bunch} stems / bunch · ${p.origin}`} · added {msRel(l.addedAt)} · {l.from}</div>
      </div>
      <div className="ms-step">
        <button onClick={() => msSetLineQty(d.id, l.id, l.qty - 1)} aria-label="One less">{WI.minus({})}</button>
        <span className="q">{l.qty}</span>
        <button onClick={() => msSetLineQty(d.id, l.id, l.qty + 1)} aria-label="One more">{WI.plus({})}</button>
      </div>
      <span className="unit">{unit}</span>
      <span className="tot">{wsEuro(msLineTotal(l))}</span>
      <button className="rm" title="Remove line" onClick={() => msSetLineQty(d.id, l.id, 0)}>{WI.trash({})}</button>
    </div>
  );
}

function MyShopView({ onNavigate }) {
  const { useState, useRef, useEffect } = React;
  const { drafts, favs, openId } = useMyShop();
  const open = drafts.find((d) => d.id === openId) || drafts[0] || null;

  const [q, setQ] = useState('');
  const [toast, setToast] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const [nameVal, setNameVal] = useState('');
  const toastRef = useRef(null);
  const say = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 3200);
  };
  useEffect(() => () => clearTimeout(toastRef.current), []);

  const quickAdd = (e) => {
    e.preventDefault();
    if (!open) return;
    const r = msQuickParse(q);
    if (!r) { say('No match — try a product name, e.g. “20x Red Naomi”'); return; }
    msAddTo(open.id, r.p.id, r.qty, 'quick add');
    say(`Added ${r.qty} × ${r.p.name} to “${open.name}”`);
    setQ('');
  };
  const addFav = (p, qty) => {
    if (!open) return;
    msAddTo(open.id, p.id, qty, 'favourites');
    say(`Added ${qty} × ${p.name} to “${open.name}”`);
  };
  const place = (d) => {
    if (!d.lines.length || typeof setReorder !== 'function') return;
    const map = {};
    d.lines.forEach((l) => { map[l.id] = (map[l.id] || 0) + l.qty; });
    setReorder(map);
    onNavigate && onNavigate('webshop');
  };
  const startRename = () => { setNameVal(open.name); setRenaming(true); };
  const commitRename = () => { msRenameDraft(open.id, nameVal); setRenaming(false); };
  const newDraft = () => { msNewDraft(); say('New draft created — it’s now your open draft'); };
  const dupDraft = () => { msDuplicateDraft(open.id); say(`Duplicated “${open.name}”`); };
  const delDraft = () => { const n = open.name; msDeleteDraft(open.id); say(`Deleted “${n}”`); };

  return (
    <div className="canvas-max ms-wrap" style={{ maxWidth: 1180 }} data-screen-label="My Shop">
      <div className="ms-head">
        <div>
          <h1 className="ms-title">My Wishlist</h1>
          <p className="ms-sub">Build orders over days. Nothing is placed until you say so — prices stay live.</p>
        </div>
      </div>

      <section className="wh-panel ms-panel">
        <div className="wh-sec-h">
          <div className="wh-sec-l">
            <h2 className="wh-sec-title">Products you recently liked</h2>
          </div>
          <button className="wh-sec-link" onClick={() => onNavigate && onNavigate('webshop')}>Pin more from the webshop {OBI.fwd({})}</button>
        </div>
        <div className="ms-favs">
          {favs.length ? favs.map((f) => <MsFavChip key={f.id} f={f} onAdd={addFav} onUnpin={(id) => msToggleFav(id)} />)
            : <p className="ms-favs-empty">No favourites yet — tap the star on any product in the webshop to keep it here.</p>}
        </div>
      </section>

      <section className="wh-panel ms-panel">
        <div className="wh-sec-h">
          <div className="wh-sec-l">
            <span className="wh-sec-eyebrow">{MSI.bag({})}Draft orders</span>
            <h2 className="wh-sec-title">Orders you’re building</h2>
            <p className="wh-sec-note">Several can run at once — one is always your open draft.</p>
          </div>
        </div>
        <div className="ms-grid">
          {drafts.map((d) => <MsDraftCard key={d.id} d={d} isOpen={open && d.id === open.id} onOpen={msSetOpen} onPlace={place} />)}
          <button className="ms-new" onClick={newDraft}>{WI.plus({})}New draft</button>
        </div>
      </section>

      {toast && <div className="ms-toast">{toast}</div>}
    </div>
  );
}

Object.assign(window, { MyShopView, MyShopNavItem });
