// onboarding-data.jsx — step metadata, onboarding icons, shared field bits
const { useState, useRef, useEffect } = React;

/* ---- onboarding-specific icons (stroke matches the system) ---- */
const _s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const OBI = {
  location: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>),
  idcard: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2.2"/><path d="M5.5 16a3 3 0 0 1 6 0M14.5 10h4M14.5 13.5h3"/></svg>),
  building: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M4 21V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15M14 21V10h5a1 1 0 0 1 1 1v10M2 21h20M7 9h2M7 13h2M7 17h2M17 14h0M17 17h0"/></svg>),
  sparkles: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4L12 3ZM18.5 14l.9 2.2 2.1.8-2.1.8-.9 2.2-.9-2.2-2.1-.8 2.1-.8.9-2.2Z"/></svg>),
  truck: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/></svg>),
  box: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M12 2.6 20 7v10l-8 4.4L4 17V7z"/><path d="m4 7 8 4.4L20 7M12 11.4V21.4M8 4.4l8 4.5"/></svg>),
  bucket: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M5 7h14l-1.4 12.2a1 1 0 0 1-1 .8H7.4a1 1 0 0 1-1-.8L5 7Z"/><path d="M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3"/></svg>),
  trolley: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M3 4h2l2.5 11.5a1 1 0 0 0 1 .8h8.5"/><rect x="8" y="6" width="11" height="7" rx="1"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/></svg>),
  globe: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></svg>),
  home2: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M4 11 12 4l8 7M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/></svg>),
  contract: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M7 3h7l5 5v9.5M7 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="M14 3v5h5M8 12h6M8 15.5h3"/><path d="M15.5 19.5c1-1.5 2.5-1.5 2.5 0s-2 2-2 2 3 .5 3-1"/></svg>),
  upload: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M12 16V5m0 0L8 9m4-4 4 4"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>),
  doc: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5"/></svg>),
  info: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" {..._s} strokeWidth="2.4" {...p}><path d="m5 12 4.5 4.5L19 7"/></svg>),
  checkCircle: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.3 2.3L15.5 9.5"/></svg>),
  chev: (p) => (<svg viewBox="0 0 24 24" {..._s} strokeWidth="2.1" {...p}><path d="m9 6 6 6-6 6"/></svg>),
  back: (p) => (<svg viewBox="0 0 24 24" {..._s} strokeWidth="2.1" {...p}><path d="m15 6-6 6 6 6"/></svg>),
  fwd: (p) => (<svg viewBox="0 0 24 24" {..._s} strokeWidth="2.1" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  send: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M4 12 20 4l-6 16-3-7-7-1Z"/></svg>),
  close: (p) => (<svg viewBox="0 0 24 24" {..._s} strokeWidth="2" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>),
  logout: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l5-5-5-5M15 12H3"/></svg>),
  dash: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/></svg>),
  gear: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.6 13H4.4a2 2 0 1 1 0-4h.2A1.6 1.6 0 0 0 6.3 6.3l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 4.6V4.4a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4.9z"/></svg>),
  flower: (p) => (<svg viewBox="0 0 24 24" {..._s} {...p}><circle cx="12" cy="12" r="2.4"/><path d="M12 9.6c0-3 .8-4.6 0-6.6-1.4 1.4-2.8 2.4-2.8 4.2M12 14.4c0 3-.8 4.6 0 6.6 1.4-1.4 2.8-2.4 2.8-4.2M9.6 12c-3 0-4.6.8-6.6 0 1.4-1.4 2.4-2.8 4.2-2.8M14.4 12c3 0 4.6-.8 6.6 0-1.4 1.4-2.4 2.8-4.2 2.8"/></svg>),
};

/* ---- the 7 steps ---- */
const STEPS = [
  { id: 'address',  short: 'Address',  icon: 'location',  eyebrow: 'Company details',
    title: 'Registered address', desc: 'Where is your business registered? We use this for invoicing and delivery routing.' },
  { id: 'iddoc',    short: 'ID Doc',   icon: 'idcard',    eyebrow: 'Identity',
    title: 'Identity verification', desc: 'Upload a valid ID for the account holder. This keeps wholesale trading secure and compliant.' },
  { id: 'business', short: 'Business', icon: 'building',  eyebrow: 'Company details',
    title: 'Business registration', desc: 'Tell us about your company so we can set the right trading terms and tax handling.' },
  { id: 'services', short: 'Services', icon: 'sparkles', eyebrow: 'Your assortment',
    title: 'Choose your services', desc: 'Pick the product lines you want to trade. You can change these later from your dashboard.' },
  { id: 'transport',short: 'Transport',icon: 'truck',    eyebrow: 'Logistics',
    title: 'Transport & packaging setup', desc: 'Choose how your orders are packaged and who arranges delivery. This determines when you can start ordering.' },
  { id: 'customs',  short: 'Customs',  icon: 'globe',     eyebrow: 'Trade & compliance',
    title: 'Customs & trade', desc: 'Let us know whether you trade across borders so we prepare the right customs paperwork.' },
  { id: 'contract', short: 'Contract', icon: 'contract', eyebrow: 'Almost there',
    title: 'Review & sign agreement', desc: 'Review your wholesale trading agreement and sign to activate your PP Flowers account.' },
];

/* ---- default answers ---- */
const DEFAULT_DATA = {
  street: '', houseNo: '', postal: '', city: '', country: 'Netherlands',
  idFile: '', idNumber: '', idExpiry: '',
  businessName: '', vat: '', legalForm: '', industry: '',
  services: [],
  packaging: 'Boxes', transport: '', carrier: '',
  trade: '', eori: '', incoterm: '',
  signature: '', accept: false,
};

/* ---- per-step validation (controls Submit & Continue) ---- */
function isStepValid(id, d) {
  switch (id) {
    case 'address':  return d.street && d.postal && d.city && d.country;
    case 'iddoc':    return !!d.idFile;
    case 'business': return d.businessName && d.vat && d.legalForm;
    case 'services': return d.services.length > 0;
    case 'transport':return d.transport && (d.transport === 'ppflowers' || (d.transport === 'own' && d.carrier.trim()));
    case 'customs':  return d.trade && (d.trade === 'domestic' || (d.trade === 'cross' && d.eori.trim() && d.incoterm));
    case 'contract': return d.signature.trim() && d.accept;
    default: return true;
  }
}

/* ---- shared field bits ---- */
function Field({ label, required, hint, children }) {
  return (
    <div className="ob-field">
      {label && <label>{label}{required && <span className="req">*</span>}</label>}
      {children}
      {hint && <p className="ob-hint">{hint}</p>}
    </div>
  );
}

Object.assign(window, { OBI, STEPS, DEFAULT_DATA, isStepValid, Field });
