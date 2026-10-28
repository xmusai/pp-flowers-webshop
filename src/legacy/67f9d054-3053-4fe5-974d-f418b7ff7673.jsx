// orders-store.jsx — shared order store for the customer portal
// Orders persist in localStorage (user-placed) and merge with a few seeded
// historical orders so "My Orders" always has content. Depends on WS_PRODUCTS.

const ORDERS_KEY = 'ppflowers.orders.v1';

const ORDER_STAGES = [
  { id: 'placed',    label: 'Order placed',     icon: 'check' },
  { id: 'confirmed', label: 'Confirmed',        icon: 'doc' },
  { id: 'picking',   label: 'Picking & packing',icon: 'box' },
  { id: 'transit',   label: 'In transit',       icon: 'truck' },
  { id: 'delivered', label: 'Delivered',        icon: 'home2' },
];
function ordStageIdx(id) { return Math.max(0, ORDER_STAGES.findIndex((s) => s.id === id)); }
function ordStageMeta(id) {
  const tone = (id === 'delivered' || id === 'confirmed') ? 'green' : id === 'transit' ? 'blue'
    : id === 'picking' ? 'amber' : 'gray';
  const st = ORDER_STAGES.find((s) => s.id === id) || ORDER_STAGES[0];
  return { label: st.label, tone };
}

// build an order line from a product id + quantity (units = bunches or pieces)
function ordLine(id, qty) {
  const p = WS_PRODUCTS.find((x) => x.id === id);
  if (!p) return null;
  return { id: p.id, name: p.name, sub: p.sub, qty, unit: p.unit || 'stem',
    perStem: p.perStem, bunch: p.bunch, box: p.box, origin: p.origin, oc: p.oc, cat: p.cat };
}
function ordLineUnitPrice(l) { return l.unit === 'piece' ? l.perStem : l.perStem * l.bunch; }
function ordLineTotal(l) { return ordLineUnitPrice(l) * l.qty; }
function ordSubtotal(o) { return o.lines.reduce((s, l) => s + ordLineTotal(l), 0); }
function ordUnits(o) { return o.lines.reduce((s, l) => s + l.qty, 0); }

const ORD_ADDRESS = 'Test account · Bloemenmarkt 12, 1012 LM Amsterdam, NL';
const ORD_EMAIL = 'inkoop@testaccount.nl';
const ORD_PHONE = '+31 6 2418 9930';
const ORD_CONTACT = { first: 'Test', last: 'Account', street: 'Bloemenmarkt 12', postcode: '1012 LM', city: 'Amsterdam', country: 'Netherlands' };
const ORD_LOGISTICS = 24.5;

// event timeline for an order: completed stages get a timestamp derived from placedAt
function ordEvents(o) {
  const ci = ordStageIdx(o.status);
  const base = new Date(o.placedAt).getTime();
  const stepMs = 9 * 3600 * 1000;
  return ORDER_STAGES.map((s, i) => ({
    ...s,
    state: i < ci ? 'done' : i === ci ? 'current' : 'todo',
    at: i <= ci ? new Date(base + i * stepMs).toISOString() : null,
  }));
}

function buildSeed() {
  const now = Date.now();
  const days = (n) => new Date(now - n * 86400000).toISOString();
  return [
    { id: 'PP-205882', placedAt: days(2), status: 'transit', region: 'eu', address: ORD_ADDRESS,
      deliveryDate: new Date(now + 1 * 86400000).toISOString(), terms: '30-day invoice',
      lines: [ordLine('t-dynasty', 10), ordLine('g-intenzz', 8), ordLine('gr-ruscus', 5)].filter(Boolean) },
    { id: 'PP-206431', placedAt: new Date(now - 7 * 3600 * 1000).toISOString(), status: 'picking', region: 'eu', address: ORD_ADDRESS,
      deliveryDate: new Date(now + 1 * 86400000).toISOString(), terms: '30-day invoice',
      lines: [ordLine('r-avalanche', 6), ordLine('c-bacardi', 5), ordLine('s-hydrangea', 4)].filter(Boolean) },
    { id: 'PP-204417', placedAt: days(12), status: 'delivered', region: 'eu', address: ORD_ADDRESS,
      deliveryDate: days(11), terms: '30-day invoice',
      lines: [ordLine('r-rednaomi', 4), ordLine('gr-euc', 3), ordLine('t-stronggold', 6)].filter(Boolean) },
  ];
}

function loadUserOrders() {
  try { const raw = localStorage.getItem(ORDERS_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return [];
}
function saveUserOrders(list) {
  try { localStorage.setItem(ORDERS_KEY, JSON.stringify(list)); } catch (e) {}
}
// newest first: user-placed orders, then seeded history
function loadOrders() { return [...loadUserOrders(), ...buildSeed()]; }
function addOrder(order) {
  const list = loadUserOrders();
  saveUserOrders([order, ...list]);
  return order;
}

/* ---- reorder hand-off (My Orders → Webshop) ---- */
const REORDER_KEY = 'ppflowers.reorder.v1';
function setReorder(map) { try { localStorage.setItem(REORDER_KEY, JSON.stringify(map)); } catch (e) {} }
function takeReorder() {
  try { const r = localStorage.getItem(REORDER_KEY); if (r) { localStorage.setItem(REORDER_KEY, ''); return JSON.parse(r); } } catch (e) {}
  return null;
}
function orderToCart(o) { const m = {}; o.lines.forEach((l) => { m[l.id] = l.qty; }); return m; }

/* ---- formatting ---- */
function ordEuro(n) { return '€\u00A0' + n.toFixed(2).replace('.', ','); }
function ordDate(d) { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
function ordDateShort(d) { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
function ordTime(d) { return new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }
function ordRel(d) {
  const ms = Date.now() - new Date(d).getTime();
  const dys = Math.floor(ms / 86400000);
  if (dys <= 0) return 'Today';
  if (dys === 1) return 'Yesterday';
  if (dys < 30) return dys + ' days ago';
  return ordDate(d);
}

Object.assign(window, {
  ORDER_STAGES, ordStageIdx, ordStageMeta, ordLine, ordLineUnitPrice, ordLineTotal,
  ordSubtotal, ordUnits, ordEvents, loadOrders, addOrder, ORD_ADDRESS, ORD_LOGISTICS,
  ordEuro, ordDate, ordDateShort, ordTime, ordRel, setReorder, takeReorder, orderToCart,
});
