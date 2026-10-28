// customer-dashboard.jsx — My Dashboard, Support Tickets, Settings (customer portal)

/* extra icons not in OBI */
const _cs = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const CI = {
  mail: (p) => (<svg viewBox="0 0 24 24" {..._cs} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 5 8-5"/></svg>),
  bell: (p) => (<svg viewBox="0 0 24 24" {..._cs} {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>),
  ticket: (p) => (<svg viewBox="0 0 24 24" {..._cs} {...p}><path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4z"/><path d="M14 6v12" strokeDasharray="2 3"/></svg>),
  card: (p) => (<svg viewBox="0 0 24 24" {..._cs} {...p}><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/></svg>),
  catalogue: (p) => (<svg viewBox="0 0 24 24" {..._cs} {...p}><path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2z"/><path d="M20 5a2 2 0 0 0-2-2h-5v18h5a2 2 0 0 0 2-2z"/></svg>),
  truck: (p) => (<svg viewBox="0 0 24 24" {..._cs} {...p}><path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/></svg>),
  redo: (p) => (<svg viewBox="0 0 24 24" {..._cs} {...p}><path d="M20 7v5h-5"/><path d="M19.5 12a8 8 0 1 0-2 5.3"/></svg>),
  logout: (p) => (<svg viewBox="0 0 24 24" {..._cs} {...p}><path d="M15 4h2.5A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15"/><path d="M10 12h9M16 8.5 19.5 12 16 15.5"/></svg>),
};

const CUSTOMER = { name: 'Test account', id: '93', since: '26 May 2026', location: 'Aalsmeer, NL' };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/* ---------------- shared shell ---------------- */
function PortalSide({ route, setRoute, onAskWholebot }) {
  const Item = ({ id, icon, label, menu }) => (
    <div className="nav-cell">
      <button className={`nav-item ${route === id ? 'active' : ''}`} onClick={() => setRoute(id)}>
        {icon()}<span>{label}</span>
      </button>
      {menu && <div className="nav-flyout"><div className="nav-flyout-inner">{menu}</div></div>}
    </div>
  );

  const dashboardMenu = (
    <div className="nav-fly-col">
      <div className="nav-fly-head">Overview</div>
      <button className="nav-fly-link" onClick={() => setRoute('dashboard')}>{OBI.dash()}Dashboard home</button>
      <button className="nav-fly-link" onClick={() => setRoute('orders', 'active')}>{OBI.truck()}Active deliveries</button>
      <button className="nav-fly-link" onClick={() => setRoute('settings')}>{OBI.gear()}Account settings</button>
    </div>
  );
  const webshopMenu = (
    <React.Fragment>
      <div className="nav-fly-col">
        <div className="nav-fly-head">Browse categories</div>
        {WS_CATS.filter((c) => c.id !== 'all').slice(0, 6).map((c) => (
          <button key={c.id} className="nav-fly-link" onClick={() => setRoute('home', c.id)}>
            <span className="fly-dot" style={{ background: c.tint }} />{c.label}
          </button>
        ))}
      </div>
      <div className="nav-fly-col">
        <div className="nav-fly-head">Discover</div>
        <button className="nav-fly-link" onClick={() => setRoute('home', 'shop')}>{CI.catalogue()}Full assortment</button>
        <button className="nav-fly-link" onClick={() => setRoute('home', 'season')}>{OBI.checkCircle()}In season now</button>
        <button className="nav-fly-link" onClick={() => setRoute('orders', 'all')}>{OBI.box()}Ready to reorder</button>
      </div>
    </React.Fragment>
  );
  const ordersMenu = (
    <React.Fragment>
      <div className="nav-fly-col">
        <div className="nav-fly-head">Track orders</div>
        <button className="nav-fly-link" onClick={() => setRoute('orders', 'all')}>{OBI.box()}All orders</button>
        <button className="nav-fly-link" onClick={() => setRoute('orders', 'active')}>{OBI.truck()}In transit</button>
        <button className="nav-fly-link" onClick={() => setRoute('orders', 'delivered')}>{OBI.checkCircle()}Delivered</button>
      </div>
      <div className="nav-fly-col">
        <div className="nav-fly-head">Quick actions</div>
        <button className="nav-fly-link" onClick={() => setRoute('orders', 'active')}>{OBI.truck()}Track latest delivery</button>
        <button className="nav-fly-link" onClick={() => setRoute('home', 'shop')}>{CI.catalogue()}Start a new order</button>
        <button className="nav-fly-link" onClick={() => setRoute('support')}>{CI.ticket()}Issue with an order</button>
      </div>
    </React.Fragment>
  );
  const supportMenu = (
    <div className="nav-fly-col">
      <div className="nav-fly-head">Support</div>
      <button className="nav-fly-link" onClick={() => setRoute('support')}>{CI.ticket()}Open tickets</button>
      <button className="nav-fly-link" onClick={() => setRoute('support')}>{OBI.fwd()}New ticket</button>
    </div>
  );

  return (
    <aside className="side">
      <div className="side-logo">
        <img src={(window.__resources && window.__resources.logoDark) || "PP Flowers Login/assets/logo-horizontal-dark.png"} alt="PP Flowers" style={{ height: 34 }} />
        <img className="side-mark" src={(window.__resources && window.__resources.ppMark) || "PP Flowers Login/assets/pp-mark.png"} alt="PP Flowers" />
      </div>
      <nav className="side-nav">
        <div className="nav-cell">
          <button className={`nav-item ${(route === 'home' || route === 'webshop') ? 'active' : ''}`} onClick={() => setRoute('home')}>
            {OBI.dash()}<span>Home</span>
          </button>
          <div className="nav-flyout"><div className="nav-flyout-inner">{webshopMenu}</div></div>
        </div>
        {window.MyShopNavItem && <window.MyShopNavItem route={route} setRoute={setRoute} />}
        <Item id="orders" icon={OBI.box} label="My Orders" menu={ordersMenu} />
        <div className="nav-cell">
          <a className="nav-item" href="PP Flowers Onboarding.html">{OBI.checkCircle()}<span>Account information</span></a>
        </div>
        <Item id="support" icon={CI.ticket} label="Costumer Service" menu={supportMenu} />
      </nav>
      <div style={{ padding: '0 14px 8px' }}>
        <button className={`nav-item ${route === 'settings' ? 'active' : ''}`} onClick={() => setRoute('settings')}>{OBI.gear()}<span>Settings</span></button>
      </div>
      <div className="side-user">
        <div className="avatar">{CUSTOMER.name[0]}</div>
        <div>
          <div className="nm">{CUSTOMER.name}</div>
          <div className="sub">Customer ID · {CUSTOMER.id}</div>
        </div>
      </div>
    </aside>
  );
}

/* ---------------- My Dashboard ---------------- */
const STATS = [
  { lbl: 'Account balance', kind: 'balance', sub: 'Instant top-up via Revolut' },
  { lbl: 'Outstanding balance', val: '€ 0,00', sub: 'Includes € 0,00 from partial invoices' },
  { lbl: 'Customer ID', val: CUSTOMER.id, sub: `Since ${CUSTOMER.since}` },
];

function DashboardView({ onAskWholebot, onNavigate }) {
  const { useState } = React;
  const [balance, setBalance] = useState(() => loadBalance());
  const [topOpen, setTopOpen] = useState(false);
  const QUICK = [
    { icon: CI.catalogue, h: 'Browse catalogue', p: "Explore today's auction-fresh assortment.", go: 'View assortment', onClick: () => onNavigate && onNavigate('webshop') },
    { icon: CI.card, h: 'Invoices & payments', p: 'View statements and manage your invoices.', go: 'Open billing', onClick: onAskWholebot },
    { icon: CI.ticket, h: 'Need a hand?', p: 'Ask Wholebot or open a support ticket.', go: 'Ask Wholebot', onClick: onAskWholebot },
  ];
  return (
    <div className="canvas-max" style={{ maxWidth: 1140 }}>
      <div className="cust-barrow">
        <div className="cust-statusbar">
          <div className="csb-seg">
            <span className="csb-dot" />
            <div className="csb-tx"><span className="csb-t">Account active</span><span className="csb-s">Verified</span></div>
          </div>
          <span className="csb-div" />
          <div className="csb-seg">
            <div className="csb-tx"><span className="csb-k">Balance</span><span className="csb-v">{tuEuro(balance)}</span></div>
            <button className="csb-topup" onClick={() => setTopOpen(true)} title="Top up balance">{TUI.plus({})}</button>
          </div>
          <span className="csb-div" />
          <div className="csb-seg">
            <div className="csb-tx"><span className="csb-k">Outstanding</span><span className="csb-v">€ 0,00</span></div>
          </div>
          <span className="csb-div" />
          <div className="csb-seg">
            <div className="csb-tx"><span className="csb-k">Customer ID</span><span className="csb-v">{CUSTOMER.id}</span></div>
          </div>
        </div>
      </div>
      <WhPromoBar onGoCatalogue={() => onNavigate && onNavigate('webshop')} />
      <div className="cust-head">
        <div className="cust-head-l">
          <p className="ob-breadcrumb">PP Flowers <span className="sep">›</span> Dashboard</p>
          <h1 className="cust-greeting"><span className="cust-greeting-tx">{greeting()}, <span className="nm">{CUSTOMER.name}</span></span></h1>
        </div>
      </div>

      <div className="cust-block">
        <div className="cust-block-head"><h2 className="cust-section-h">Pending actions</h2></div>
        <div className="card pending-card">
          <div className="pending-empty">
            <span className="pe-ico">{OBI.checkCircle()}</span>
            You’re all caught up — no pending actions.
          </div>
        </div>
      </div>

      <div className="cust-block">
        <div className="cust-block-head"><h2 className="cust-section-h">Getting started</h2></div>
        <div className="ql-grid">
          {QUICK.map((q, i) => (
            <div className="card ql" key={i} onClick={q.onClick}>
              <div className="ql-ico">{q.icon()}</div>
              <h4>{q.h}</h4>
              <p>{q.p}</p>
              <span className="ql-go">{q.go} {OBI.fwd()}</span>
            </div>
          ))}
        </div>
      </div>

      <TopUpModal open={topOpen} balance={balance} onClose={() => setTopOpen(false)}
        onDone={(amt) => { setBalance(addBalance(amt)); setTopOpen(false); }} />
    </div>
  );
}

/* ---------------- Support Tickets ---------------- */
function SupportView({ onAskWholebot }) {
  return (
    <div className="canvas-max" style={{ maxWidth: 1140 }}>
      <p className="ob-breadcrumb">PP Flowers <span className="sep">›</span> Support Tickets</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 26 }}>
        <h1 className="cust-page-title">Support Tickets</h1>
        <button className="btn-accent" onClick={onAskWholebot}>{CI.ticket({ width: 17, height: 17 })} New ticket</button>
      </div>
      <div className="card empty-card">
        <div className="ec-ico">{CI.ticket()}</div>
        <h3>No tickets yet</h3>
        <p>When you raise a question our support team will track it here so you can follow every update in one place.</p>
      </div>
    </div>
  );
}

/* ---------------- Settings ---------------- */
function SettingsView() {
  const rows = [
    ['Account name', CUSTOMER.name],
    ['Customer ID', CUSTOMER.id],
    ['Member since', CUSTOMER.since],
    ['Account status', 'Active'],
    ['Language', 'English (EN)'],
  ];
  return (
    <div className="canvas-max" style={{ maxWidth: 1140 }}>
      <p className="ob-breadcrumb">PP Flowers <span className="sep">›</span> Settings</p>
      <h1 className="cust-page-title" style={{ marginBottom: 26 }}>Settings</h1>
      <div className="card set-card">
        {rows.map(([k, v], i) => (
          <div className="set-row" key={i}>
            <span className="sr-k">{k}</span>
            <span className="sr-v">{v}{k === 'Account status' && <span className="status-pill" style={{ marginLeft: 10 }}><span className="d" /> Active</span>}</span>
          </div>
        ))}
      </div>

      <div className="card set-card set-actions">
        <div className="set-act-row">
          <div className="set-act-tx">
            <span className="set-act-t">Redo onboarding</span>
            <span className="set-act-s">Walk through the setup quiz again to re-tune your storefront.</span>
          </div>
          <a className="btn-ghost" href="PP Flowers Create Account - Light.html">{CI.redo({ width: 17, height: 17 })}Start onboarding</a>
        </div>
        <div className="set-act-row">
          <div className="set-act-tx">
            <span className="set-act-t">Log out</span>
            <span className="set-act-s">End your session on this device and return to the sign-in screen.</span>
          </div>
          <a className="btn-danger" href="PP Flowers Login.html">{CI.logout({ width: 17, height: 17 })}Log out</a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CI, CUSTOMER, PortalSide, DashboardView, SupportView, SettingsView, greeting });
