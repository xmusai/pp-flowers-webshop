// webshop-data.jsx — PP Flowers Webshop: icons, categories & assortment
// Pricing follows Dutch wholesale convention: priced PER STEM (euro),
// sold in bunches (10/20/25 stems) and boxes (n bunches). Potted = per piece.

const _wi = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const WI = {
  cart: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M3 4h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L20.5 8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>),
  search: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>),
  sliders: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h7M15 17h5"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="13" cy="17" r="2"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" {..._wi} strokeWidth="2.1" {...p}><path d="M12 5v14M5 12h14"/></svg>),
  minus: (p) => (<svg viewBox="0 0 24 24" {..._wi} strokeWidth="2.1" {...p}><path d="M5 12h14"/></svg>),
  trash: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6"/></svg>),
  clock: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>),
  leaf: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M4 20c0-8 6-14 16-14 0 10-6 14-14 14M7 17c2.5-4 5.5-6.5 9-8"/></svg>),
  ruler: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M5 19 19 5l-1.8-1.8a1 1 0 0 0-1.4 0L3.2 15.8a1 1 0 0 0 0 1.4L5 19a1 1 0 0 0 1.4 0Z"/><path d="m8 10 1.6 1.6M11 7l1.6 1.6M14 4l1.6 1.6"/></svg>),
  star: (p) => (<svg viewBox="0 0 24 24" {..._wi} fill="currentColor" stroke="none" {...p}><path d="m12 3 2.6 5.6L20.5 9.4l-4.4 4 1.1 6.1L12 16.8 6.8 19.5l1.1-6.1-4.4-4 5.9-.8z"/></svg>),
  heart: (p) => (<svg viewBox="0 0 24 24" {..._wi} fill="currentColor" stroke="none" {...p}><path d="M12 20.5 4.2 12.9a4.7 4.7 0 0 1 0-6.7 4.7 4.7 0 0 1 6.7 0l1.1 1.1 1.1-1.1a4.7 4.7 0 0 1 6.7 0 4.7 4.7 0 0 1 0 6.7z"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" {..._wi} strokeWidth="2.3" {...p}><path d="m5 12 4.5 4.5L19 7"/></svg>),
  spark: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/></svg>),
  card: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/></svg>),
  bank: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M4 10h16M4 10 12 4l8 6M6 10v7M10 10v7M14 10v7M18 10v7M3 20h18"/></svg>),
  wallet: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h13a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H3"/><circle cx="16.5" cy="12" r="1" fill="currentColor" stroke="none"/></svg>),
  tag: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/></svg>),
  euro: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M16.5 7.5a6 6 0 1 0 0 9M4 11h7M4 14h6"/></svg>),
  drop: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/></svg>),
  bud: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M12 21V11M12 11c0-3 1.5-6 4-7 .5 3-1 6-4 7Zm0 0c0-3-1.5-6-4-7-.5 3 1 6 4 7Z"/></svg>),
  shield: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>),
  award: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.5-1.5 7L12 18l5 2.5-1.5-7"/></svg>),
  pin: (p) => (<svg viewBox="0 0 24 24" {..._wi} {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>),
};

// Category palette — soft, low-chroma tints for photo placeholders (warm theme friendly)
const WS_CATS = [
  { id: 'all',      label: 'All products',      tint: 'oklch(0.95 0.012 70)' },
  { id: 'roses',    label: 'Roses',             tint: 'oklch(0.93 0.045 22)' },
  { id: 'tulips',   label: 'Tulips',            tint: 'oklch(0.93 0.045 350)' },
  { id: 'chrys',    label: 'Chrysanthemums',    tint: 'oklch(0.94 0.05 95)' },
  { id: 'peonies',  label: 'Peonies',           tint: 'oklch(0.92 0.05 5)' },
  { id: 'lilies',   label: 'Lilies',            tint: 'oklch(0.95 0.045 60)' },
  { id: 'gerbera',  label: 'Gerberas',          tint: 'oklch(0.93 0.06 45)' },
  { id: 'season',   label: 'Seasonal',          tint: 'oklch(0.93 0.045 320)' },
  { id: 'greens',   label: 'Greens & foliage',  tint: 'oklch(0.93 0.05 145)' },
  { id: 'plants',   label: 'Potted plants',     tint: 'oklch(0.93 0.045 160)' },
  { id: 'accessories', label: 'Accessories',    tint: 'oklch(0.92 0.02 250)' },
];
const WS_CAT_MAP = Object.fromEntries(WS_CATS.map((c) => [c.id, c]));

// stock: 'high' | 'mid' | 'low'  ·  unit: 'stem' (sold per bunch) | 'piece'
const WS_PRODUCTS = [
  { id: 'r-avalanche', cat: 'roses', name: 'Avalanche+', sub: 'Large-head white rose',
    origin: 'Holland', oc: 'NL', grower: 'Marginpar', stemCm: 60, perStem: 0.46, bunch: 10, box: 10, stock: 'high', badge: 'Auction-fresh' },
  { id: 'r-rednaomi', cat: 'roses', name: 'Red Naomi', sub: 'Velvet red garden rose',
    origin: 'Holland', oc: 'NL', grower: 'Porta Nova', stemCm: 70, perStem: 0.58, bunch: 10, box: 8, stock: 'high', badge: 'Top grade' },
  { id: 'r-athena', cat: 'roses', name: 'Athena', sub: 'Blush spray rose',
    origin: 'Kenya', oc: 'KE', grower: 'Black Tulip', stemCm: 50, perStem: 0.34, bunch: 20, box: 10, stock: 'high' },
  { id: 'r-quicksand', cat: 'roses', name: 'Quicksand', sub: 'Toffee-beige rose',
    origin: 'Ethiopia', oc: 'ET', grower: 'Joytech', stemCm: 55, perStem: 0.39, bunch: 20, box: 10, stock: 'mid' },

  { id: 't-stronggold', cat: 'tulips', name: 'Strong Gold', sub: 'Single yellow tulip',
    origin: 'Holland', oc: 'NL', grower: 'Maxima Kwekerij', stemCm: 38, perStem: 0.19, bunch: 10, box: 50, stock: 'high', badge: 'Auction-fresh' },
  { id: 't-dynasty', cat: 'tulips', name: 'Dynasty', sub: 'Double pink tulip',
    origin: 'Holland', oc: 'NL', grower: 'JUB Holland', stemCm: 40, perStem: 0.24, bunch: 10, box: 50, stock: 'high' },

  { id: 'c-bacardi', cat: 'chrys', name: 'Bacardi', sub: 'White spray chrysanthemum',
    origin: 'Holland', oc: 'NL', grower: 'Deliflor', stemCm: 70, perStem: 0.42, bunch: 10, box: 8, stock: 'high' },
  { id: 'c-anastasia', cat: 'chrys', name: 'Anastasia', sub: 'Spider bloom, lime',
    origin: 'Holland', oc: 'NL', grower: 'Deliflor', stemCm: 75, perStem: 0.52, bunch: 10, box: 8, stock: 'mid' },

  { id: 'p-sarah', cat: 'peonies', name: 'Sarah Bernhardt', sub: 'Soft-pink double peony',
    origin: 'Holland', oc: 'NL', grower: 'Van der Lugt', stemCm: 55, perStem: 1.10, bunch: 10, box: 6, stock: 'low', badge: 'Seasonal' },

  { id: 'l-sorbonne', cat: 'lilies', name: 'Sorbonne', sub: 'Fragrant oriental lily',
    origin: 'Holland', oc: 'NL', grower: 'Vletter & Den Haan', stemCm: 90, perStem: 0.85, bunch: 10, box: 5, stock: 'mid' },

  { id: 'g-intenzz', cat: 'gerbera', name: 'Pre Intenzz', sub: 'Coral mini gerbera',
    origin: 'Holland', oc: 'NL', grower: 'Schreurs', stemCm: 50, perStem: 0.28, bunch: 10, box: 20, stock: 'high' },

  { id: 's-ranunculus', cat: 'season', name: 'Clooney Ranunculus', sub: 'Layered apricot bloom',
    origin: 'Italy', oc: 'IT', grower: 'Biancheri Creazioni', stemCm: 35, perStem: 0.62, bunch: 10, box: 10, stock: 'low', badge: 'Seasonal' },
  { id: 's-hydrangea', cat: 'season', name: 'Verena Blue', sub: 'Antique hydrangea',
    origin: 'Holland', oc: 'NL', grower: 'Holex', stemCm: 55, perStem: 1.85, bunch: 5, box: 4, stock: 'low' },
  { id: 's-anemone', cat: 'season', name: 'Mistral Anemone', sub: 'Navy-centre anemone',
    origin: 'Italy', oc: 'IT', grower: 'Biancheri Creazioni', stemCm: 35, perStem: 0.54, bunch: 10, box: 10, stock: 'mid', badge: 'New' },

  { id: 'gr-euc', cat: 'greens', name: 'Eucalyptus Cinerea', sub: 'Silver-dollar foliage',
    origin: 'Spain', oc: 'ES', grower: 'Verdissimo', stemCm: 60, perStem: 0.55, bunch: 10, box: 10, stock: 'high' },
  { id: 'gr-ruscus', cat: 'greens', name: 'Italian Ruscus', sub: 'Glossy filler green',
    origin: 'Italy', oc: 'IT', grower: 'OZ Import', stemCm: 60, perStem: 0.48, bunch: 10, box: 20, stock: 'high' },

  { id: 'pl-phal', cat: 'plants', name: 'Phalaenopsis 2-stem', sub: 'White orchid · 12cm pot',
    origin: 'Holland', oc: 'NL', grower: 'Sion Orchids', stemCm: 60, perStem: 6.90, bunch: 1, box: 8, stock: 'mid', unit: 'piece' },
  { id: 'pl-kalanchoe', cat: 'plants', name: 'Kalanchoe', sub: 'Mixed colours · 10.5cm pot',
    origin: 'Holland', oc: 'NL', grower: 'Knol Plants', stemCm: 25, perStem: 1.45, bunch: 1, box: 12, stock: 'high', unit: 'piece' },

  { id: 'r-freedom', cat: 'roses', name: 'Freedom', sub: 'Classic red rose',
    origin: 'Ecuador', oc: 'EC', grower: 'Hoja Verde', stemCm: 60, perStem: 0.52, bunch: 25, box: 10, stock: 'high', badge: 'Top grade' },
  { id: 'r-ohara', cat: 'roses', name: "O'Hara", sub: 'Blush garden rose',
    origin: 'Colombia', oc: 'CO', grower: 'Alexandra Farms', stemCm: 50, perStem: 0.74, bunch: 10, box: 8, stock: 'mid', badge: 'Seasonal' },
  { id: 't-strong', cat: 'tulips', name: 'Menton', sub: 'Apricot French tulip',
    origin: 'Holland', oc: 'NL', grower: 'Barendsen', stemCm: 42, perStem: 0.31, bunch: 10, box: 50, stock: 'high' },
  { id: 't-negrita', cat: 'tulips', name: 'Negrita', sub: 'Deep purple tulip',
    origin: 'Holland', oc: 'NL', grower: 'JUB Holland', stemCm: 40, perStem: 0.26, bunch: 10, box: 50, stock: 'mid' },
  { id: 'c-anastasia-p', cat: 'chrys', name: 'Zembla', sub: 'Large yellow bloom chrys',
    origin: 'Holland', oc: 'NL', grower: 'Deliflor', stemCm: 80, perStem: 0.58, bunch: 5, box: 8, stock: 'high', badge: 'Auction-fresh' },
  { id: 'p-coralcharm', cat: 'peonies', name: 'Coral Charm', sub: 'Coral semi-double peony',
    origin: 'Holland', oc: 'NL', grower: 'Van der Lugt', stemCm: 60, perStem: 1.35, bunch: 10, box: 6, stock: 'low', badge: 'Seasonal' },
  { id: 'l-roselily', cat: 'lilies', name: 'Roselily Natalia', sub: 'Double pollen-free lily',
    origin: 'Holland', oc: 'NL', grower: 'The Originals', stemCm: 85, perStem: 1.05, bunch: 10, box: 5, stock: 'mid', badge: 'New' },
  { id: 'g-germini', cat: 'gerbera', name: 'Germini Mix', sub: 'Mini gerbera, mixed',
    origin: 'Holland', oc: 'NL', grower: 'Schreurs', stemCm: 45, perStem: 0.22, bunch: 10, box: 25, stock: 'high' },
  { id: 's-lisianthus', cat: 'season', name: 'Alissa Purple', sub: 'Double lisianthus',
    origin: 'Holland', oc: 'NL', grower: 'Marginpar', stemCm: 70, perStem: 0.68, bunch: 10, box: 10, stock: 'mid' },
  { id: 's-delphinium', cat: 'season', name: 'Delphinium Volkerfrieden', sub: 'Deep-blue spire',
    origin: 'Holland', oc: 'NL', grower: 'Holex', stemCm: 90, perStem: 0.95, bunch: 10, box: 8, stock: 'low', badge: 'Seasonal' },
  { id: 'gr-pittosporum', cat: 'greens', name: 'Pittosporum', sub: 'Compact green filler',
    origin: 'Israel', oc: 'IL', grower: 'Arava Export', stemCm: 50, perStem: 0.38, bunch: 10, box: 20, stock: 'high' },
  { id: 'gr-salal', cat: 'greens', name: 'Salal Tips', sub: 'Broad-leaf foliage',
    origin: 'Holland', oc: 'NL', grower: 'OZ Import', stemCm: 40, perStem: 0.30, bunch: 10, box: 20, stock: 'high' },
  { id: 'pl-succulent', cat: 'plants', name: 'Succulent Mix', sub: 'Assorted · 8.5cm pot',
    origin: 'Holland', oc: 'NL', grower: 'Ubink', stemCm: 12, perStem: 1.10, bunch: 1, box: 16, stock: 'high', unit: 'piece' },

  { id: 'ac-terrapot', cat: 'accessories', name: 'Terracotta Pot 14cm', sub: 'Classic clay planter',
    origin: 'Portugal', oc: 'PT', grower: 'Deroma', stemCm: 14, perStem: 1.85, bunch: 1, box: 24, stock: 'high', unit: 'piece' },
  { id: 'ac-ceramic', cat: 'accessories', name: 'Ceramic Pot 17cm', sub: 'Matte stone-grey planter',
    origin: 'Holland', oc: 'NL', grower: 'Mica Decorations', stemCm: 17, perStem: 3.40, bunch: 1, box: 12, stock: 'high', unit: 'piece', badge: 'New' },
  { id: 'ac-glassvase', cat: 'accessories', name: 'Glass Cylinder Vase 25cm', sub: 'Clear florist vase',
    origin: 'Poland', oc: 'PL', grower: 'Krosno Glass', stemCm: 25, perStem: 2.60, bunch: 1, box: 12, stock: 'mid', unit: 'piece' },
  { id: 'ac-kraft', cat: 'accessories', name: 'Kraft Wrap Sheets', sub: 'Ribbed natural, 50×70cm',
    origin: 'Germany', oc: 'DE', grower: 'Verpakking Groep', stemCm: 70, perStem: 0.18, bunch: 25, box: 250, stock: 'high', unit: 'piece' },
  { id: 'ac-ribbon', cat: 'accessories', name: 'Satin Ribbon 25mm', sub: 'Dusty-rose, 50m roll',
    origin: 'Italy', oc: 'IT', grower: 'Nastrificio', stemCm: 25, perStem: 4.20, bunch: 1, box: 10, stock: 'high', unit: 'piece' },
  { id: 'ac-floralfoam', cat: 'accessories', name: 'Floral Foam Bricks', sub: 'Wet foam, box of 20',
    origin: 'UK', oc: 'GB', grower: 'Oasis Floral', stemCm: 23, perStem: 1.35, bunch: 1, box: 20, stock: 'mid', unit: 'piece' },
  { id: 'ac-shears', cat: 'accessories', name: 'Florist Shears', sub: 'Stainless, spring-loaded',
    origin: 'Japan', oc: 'JP', grower: 'ARS', stemCm: 18, perStem: 12.50, bunch: 1, box: 6, stock: 'mid', unit: 'piece', badge: 'Top grade' },
  { id: 'ac-flowerfood', cat: 'accessories', name: 'Cut-Flower Food Sachets', sub: 'Universal, 1L mix',
    origin: 'Holland', oc: 'NL', grower: 'Chrysal', stemCm: 10, perStem: 0.09, bunch: 100, box: 1000, stock: 'high', unit: 'piece' },
];

// price per purchasable unit (a bunch of N stems, or a single piece)
function wsUnitPrice(p) { return p.unit === 'piece' ? p.perStem : p.perStem * p.bunch; }
function wsEuro(n) { return '€\u00A0' + n.toFixed(2).replace('.', ','); }
function wsShot(id) { return (window.__resources && window.__resources['shot-' + id]) || `PP Flowers Login/assets/shots/${id}.png`; }

// Boxes available right now — wholesale stock is counted & sold in boxes.
const WS_BOXES_LEFT = {
  'r-avalanche': 7, 'r-rednaomi': 9, 'r-athena': 12, 'r-quicksand': 4,
  't-stronggold': 14, 't-dynasty': 11, 'c-bacardi': 8, 'c-anastasia': 3,
  'p-sarah': 2, 'l-sorbonne': 4, 'g-intenzz': 10, 's-ranunculus': 1,
  's-hydrangea': 2, 's-anemone': 3, 'gr-euc': 9, 'gr-ruscus': 13,
  'pl-phal': 4, 'pl-kalanchoe': 8,
};
WS_PRODUCTS.forEach((p) => { p.boxesLeft = WS_BOXES_LEFT[p.id] != null ? WS_BOXES_LEFT[p.id] : 5; });

// dominant colour per product (drives the Colour filter swatches)
const WS_COLOUR = {
  'r-avalanche': 'white', 'r-rednaomi': 'red', 'r-athena': 'pink', 'r-quicksand': 'cream',
  't-stronggold': 'yellow', 't-dynasty': 'pink', 'c-bacardi': 'white', 'c-anastasia': 'green',
  'p-sarah': 'pink', 'l-sorbonne': 'pink', 'g-intenzz': 'orange', 's-ranunculus': 'apricot',
  's-hydrangea': 'blue', 's-anemone': 'purple', 'gr-euc': 'green', 'gr-ruscus': 'green',
  'pl-phal': 'white', 'pl-kalanchoe': 'mixed',
  'r-freedom': 'red', 'r-ohara': 'cream', 't-strong': 'apricot', 't-negrita': 'purple',
  'c-anastasia-p': 'yellow', 'p-coralcharm': 'pink', 'l-roselily': 'pink', 'g-germini': 'mixed',
  's-lisianthus': 'purple', 's-delphinium': 'blue', 'gr-pittosporum': 'green', 'gr-salal': 'green',
  'pl-succulent': 'green',
};
WS_PRODUCTS.forEach((p) => { p.colour = WS_COLOUR[p.id] || 'mixed'; });

/* the colour groups the trade actually sorts by */
const WS_COLOURS = [
  { id: 'white',   label: 'White',   hex: '#F2EEE4' },
  { id: 'cream',   label: 'Cream',   hex: '#EBDCB8' },
  { id: 'yellow',  label: 'Yellow',  hex: '#E6C247' },
  { id: 'apricot', label: 'Apricot', hex: '#EBB07A' },
  { id: 'orange',  label: 'Orange',  hex: '#E0863C' },
  { id: 'pink',    label: 'Pink',    hex: '#E48AAE' },
  { id: 'red',     label: 'Red',     hex: '#C0392B' },
  { id: 'purple',  label: 'Purple',  hex: '#6E4B9E' },
  { id: 'blue',    label: 'Blue',    hex: '#5E84B8' },
  { id: 'green',   label: 'Green',   hex: '#7BA05B' },
  { id: 'mixed',   label: 'Mixed',   hex: 'mixed' },
];
const WS_LENGTHS = [
  { id: 'short', label: 'Short', range: '≤ 45 cm',  test: (cm) => cm <= 45 },
  { id: 'mid',   label: 'Medium', range: '46–65 cm', test: (cm) => cm >= 46 && cm <= 65 },
  { id: 'long',  label: 'Long',  range: '66 cm +',  test: (cm) => cm >= 66 },
];

/* bunch weight in grams — how tulips and bulb flowers are graded and traded.
   Only lines that are actually sold by weight carry a value. */
const WS_WEIGHT_MAP = {
  't-stronggold': 220, 't-dynasty': 260, 't-strong': 300, 't-negrita': 240,
  'l-sorbonne': 480, 'l-roselily': 420, 'p-sarah': 520, 'p-coralcharm': 560,
};
WS_PRODUCTS.forEach((p) => { p.bunchG = WS_WEIGHT_MAP[p.id] || null; });
const WS_WEIGHTS = [
  { id: 150, label: '150 g +' },
  { id: 200, label: '200 g +' },
  { id: 250, label: '250 g +' },
  { id: 400, label: '400 g +' },
];


// ---- extended buyer attributes (drive the expanded filter facets) ----
// application type: cut flowers / greens / potted plants
function wsType(p) { return p.cat === 'plants' ? 'plants' : p.cat === 'greens' ? 'greens' : 'cut'; }
const WS_TYPES = [
  { id: 'cut',    label: 'Cut flowers' },
  { id: 'greens', label: 'Greens & foliage' },
  { id: 'plants', label: 'Potted plants' },
];

// maturity / ripeness stage at dispatch
const WS_RIPE_MAP = {
  'r-avalanche': 'half', 'r-rednaomi': 'tight', 'r-athena': 'half', 'r-quicksand': 'half',
  't-stronggold': 'tight', 't-dynasty': 'half', 'c-bacardi': 'half', 'c-anastasia': 'open',
  'p-sarah': 'tight', 'l-sorbonne': 'tight', 'g-intenzz': 'open', 's-ranunculus': 'half',
  's-hydrangea': 'open', 's-anemone': 'half', 'gr-euc': 'open', 'gr-ruscus': 'open',
  'pl-phal': 'open', 'pl-kalanchoe': 'open',
};
WS_PRODUCTS.forEach((p) => { p.ripe = WS_RIPE_MAP[p.id] || 'half'; });
const WS_RIPE = [
  { id: 'tight', label: 'Tight bud',   sub: 'Stage 1–2' },
  { id: 'half',  label: 'Half open',   sub: 'Stage 2–3' },
  { id: 'open',  label: 'Open / blown', sub: 'Stage 3–4' },
];

// expected vase life in days
const WS_VASE_MAP = {
  'r-avalanche': 12, 'r-rednaomi': 14, 'r-athena': 10, 'r-quicksand': 11,
  't-stronggold': 7, 't-dynasty': 8, 'c-bacardi': 14, 'c-anastasia': 13,
  'p-sarah': 7, 'l-sorbonne': 12, 'g-intenzz': 10, 's-ranunculus': 7,
  's-hydrangea': 8, 's-anemone': 6, 'gr-euc': 21, 'gr-ruscus': 21,
  'pl-phal': 30, 'pl-kalanchoe': 30,
};
WS_PRODUCTS.forEach((p) => { p.vase = WS_VASE_MAP[p.id] || 7; });
const WS_VASEOPTS = [
  { id: 7,  label: '7+ days' },
  { id: 10, label: '10+ days' },
  { id: 14, label: '14+ days' },
];

// sustainability certifications
const WS_CERT_MAP = {
  'r-avalanche': ['mps'], 'r-rednaomi': ['mps'], 'r-athena': ['fairtrade'], 'r-quicksand': ['fairtrade', 'mps'],
  't-stronggold': ['mps'], 't-dynasty': ['mps'], 'c-bacardi': ['mps'], 'c-anastasia': [],
  'p-sarah': ['organic'], 'l-sorbonne': ['mps'], 'g-intenzz': [], 's-ranunculus': ['organic'],
  's-hydrangea': [], 's-anemone': ['organic'], 'gr-euc': ['organic'], 'gr-ruscus': ['mps'],
  'pl-phal': ['mps'], 'pl-kalanchoe': [],
};
WS_PRODUCTS.forEach((p) => { p.certs = WS_CERT_MAP[p.id] || []; });
const WS_CERTS = [
  { id: 'mps',       label: 'MPS-A',        sub: 'Sustainable grower' },
  { id: 'fairtrade', label: 'Fairtrade',    sub: 'Fair-trade certified' },
  { id: 'organic',   label: 'Organic / bio', sub: 'Biologisch' },
];

// scented?
const WS_SCENT = new Set(['r-rednaomi', 'p-sarah', 'l-sorbonne', 'gr-euc']);
WS_PRODUCTS.forEach((p) => { p.scent = WS_SCENT.has(p.id); });

// quality grade id used by the grade facet
function wsGradeId(p) { return p.badge === 'Top grade' ? 'extra' : 'a1'; }
const WS_GRADES = [
  { id: 'a1',    label: 'A1',       sub: 'Standard premium' },
  { id: 'extra', label: 'A1 Extra', sub: 'Top grade' },
];

// per-stem price bounds across the assortment (drives the price slider)
const WS_PRICE_MIN = Math.floor(Math.min(...WS_PRODUCTS.map((p) => p.perStem)) * 100) / 100;
const WS_PRICE_MAX = Math.ceil(Math.max(...WS_PRODUCTS.map((p) => p.perStem)) * 100) / 100;

// what a single box holds + what it costs (the wholesale buying unit)
function wsBoxInfo(p) {
  const isPiece = p.unit === 'piece';
  const boxStems = p.bunch * p.box;
  const boxPrice = p.perStem * (isPiece ? p.box : boxStems);
  const content = isPiece ? `${p.box} pcs` : `${p.box} bunches · ${boxStems} stems`;
  return { isPiece, boxStems, boxPrice, content };
}
function wsGrade(p) { return p.badge === 'Top grade' ? 'A1 Extra' : 'A1'; }


/* ---------------------------------------------------------------------------
   display_prices — pricing feed (MOCK, mirrors the live view 1:1).
   One aggregated record per product; field names are the real ones so the live
   feed drops straight in. Price is per ONE unit (stem / plant / piece), is the
   cheapest live offer ("from"), and is a snapshot — never real-time.
   --------------------------------------------------------------------------- */
const PP_PRICED_AT = '2026-07-28T13:00:00Z';

// authentic records from the live feed (real SKUs, prices and seller counts)
const PP_DISPLAY_PRICES = [
  { sku: '27157',  description: 'R Gr Red Naomi!',                unit_noun: 'stem',  from_price: 0.24, max_price: 1.84, range_ok: false, priced_offers: 55, in_stock: true, priced_at: PP_PRICED_AT },
  { sku: '104927', description: 'R Gr Heidi!',                    unit_noun: 'stem',  from_price: 0.21, max_price: 0.55, range_ok: true,  priced_offers: 9,  in_stock: true, priced_at: PP_PRICED_AT },
  { sku: '122606', description: 'Craspedia Kl Bh Blue Lagoon Mix', unit_noun: 'stem', from_price: 0.22, max_price: 0.37, range_ok: true,  priced_offers: 30, in_stock: true, priced_at: PP_PRICED_AT },
  { sku: '17776',  description: 'Salix Ca Snow Flake',            unit_noun: 'stem',  from_price: 0.20, max_price: 0.51, range_ok: true,  priced_offers: 12, in_stock: true, priced_at: PP_PRICED_AT },
  { sku: '130771', description: 'Germini Tompouce Doos',          unit_noun: 'stem',  from_price: 0.24, max_price: 0.40, range_ok: true,  priced_offers: 15, in_stock: true, priced_at: PP_PRICED_AT },
  { sku: '24797',  description: 'Lim Saf Dark Blue',              unit_noun: 'stem',  from_price: 0.22, max_price: 0.54, range_ok: true,  priced_offers: 10, in_stock: true, priced_at: PP_PRICED_AT },
  { sku: '112909', description: 'PHAL GEM',                       unit_noun: 'plant', from_price: 2.28, max_price: 6.09, range_ok: true,  priced_offers: 16, in_stock: true, priced_at: PP_PRICED_AT },
  { sku: '2548',   description: 'Sedum Spectabile',               unit_noun: 'stem',  from_price: 0.22, max_price: 0.44, range_ok: true,  priced_offers: 10, in_stock: true, priced_at: PP_PRICED_AT },
  { sku: '118008', description: 'Germini Nirvana Doos',           unit_noun: 'stem',  from_price: 0.25, max_price: 0.34, range_ok: true,  priced_offers: 10, in_stock: true, priced_at: PP_PRICED_AT },
];

// which catalogue product each authentic record prices
const PP_SKU_BY_PRODUCT = {
  'r-rednaomi': '27157', 'r-athena': '104927', 's-anemone': '122606', 'gr-salal': '17776',
  'g-germini': '130771', 's-delphinium': '24797', 'pl-phal': '112909', 's-lisianthus': '2548',
  'g-intenzz': '118008',
};

function ppHash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
function ppUnitNounFor(p) { return p.cat === 'plants' ? 'plant' : (p.unit === 'piece' ? 'piece' : 'stem'); }

// every other product gets a record of the same shape (mock stand-in for the feed)
WS_PRODUCTS.forEach((p) => {
  const real = PP_SKU_BY_PRODUCT[p.id];
  if (real) { p.sku = real; return; }
  const h = ppHash(p.id);
  p.sku = String(10000 + (h % 89999));
  PP_DISPLAY_PRICES.push({ sku: p.sku, description: p.name, unit_noun: ppUnitNounFor(p),
    from_price: p.perStem, max_price: Math.round(p.perStem * (1.6 + (h % 18) / 10) * 100) / 100,
    range_ok: h % 13 !== 0, priced_offers: 4 + (h % 47), in_stock: true, priced_at: PP_PRICED_AT });
});
const PP_BY_SKU = Object.fromEntries(PP_DISPLAY_PRICES.map((r) => [r.sku, r]));

/* ---- display rules (the only place prices are formatted) ---- */
function ppRec(p) { return (p && PP_BY_SKU[p.sku]) || null; }
function ppEuro(n) { return '\u20AC\u00A0' + Number(n).toFixed(2).replace('.', ','); }
function ppPrice(p) { const r = ppRec(p); return r && r.from_price != null ? r.from_price : null; }
function ppUnit(p) { const r = ppRec(p); return r ? r.unit_noun : 'stem'; }
function ppUnitPlural(p, n) { const u = ppUnit(p); return n === 1 ? u : u + 's'; }
// "from € 0,24" — or "from € 2,28 – € 6,09" when the feed says the range is trustworthy
function ppFromText(p) {
  const r = ppRec(p);
  if (!r || r.from_price == null) return 'Price on request';
  const range = r.range_ok && r.max_price > r.from_price;
  return 'from ' + ppEuro(r.from_price) + (range ? ' \u2013 ' + ppEuro(r.max_price) : '');
}
function ppAsOf(p) {
  const r = ppRec(p); const dt = new Date((r && r.priced_at) || PP_PRICED_AT);
  const day = dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });
  const tm = dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
  return 'as of ' + day + ' ' + tm;
}
function ppSellers(p) { const r = ppRec(p); return r ? r.priced_offers + (r.priced_offers === 1 ? ' seller' : ' sellers') : ''; }
function ppStockText(p) { const r = ppRec(p); return r && r.in_stock === false ? 'out of stock' : 'in stock'; }
function ppMeta(p) { return [ppSellers(p), ppStockText(p), ppAsOf(p)].filter(Boolean).join(' \u00B7 '); }
// order lots are still whole boxes, but always counted in stems / plants / pieces
function ppLot(p) { return p.unit === 'piece' ? p.box : p.box * p.bunch; }
function ppQty(p, n) { return Number(n).toLocaleString('en') + ' ' + ppUnitPlural(p, n); }
function ppLineTotal(p, qty) { const u = ppPrice(p); return u == null ? 0 : u * qty; }

Object.assign(window, { PP_DISPLAY_PRICES, PP_BY_SKU, ppRec, ppEuro, ppPrice, ppUnit, ppUnitPlural, ppFromText, ppAsOf, ppSellers, ppStockText, ppMeta, ppLot, ppQty, ppLineTotal });

Object.assign(window, { WI, WS_CATS, WS_CAT_MAP, WS_PRODUCTS, WS_COLOURS, WS_LENGTHS, wsUnitPrice, wsEuro, wsShot, wsBoxInfo, wsGrade,
  wsType, WS_TYPES, WS_RIPE, WS_VASEOPTS, WS_CERTS, WS_GRADES, wsGradeId, WS_PRICE_MIN, WS_PRICE_MAX, WS_WEIGHTS });
