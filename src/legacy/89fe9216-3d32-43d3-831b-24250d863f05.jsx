// onboarding-steps.jsx — the seven form bodies

function StepAddress({ d, set }) {
  return (
    <React.Fragment>
      <Field label="Street" required>
        <input className="ob-input" placeholder="e.g. Bloemenmarkt" value={d.street} onChange={(e) => set('street', e.target.value)} />
      </Field>
      <div className="ob-row split">
        <Field label="No." required>
          <input className="ob-input" placeholder="12B" value={d.houseNo} onChange={(e) => set('houseNo', e.target.value)} />
        </Field>
        <Field label="Postal code" required>
          <input className="ob-input" placeholder="1012 AA" value={d.postal} onChange={(e) => set('postal', e.target.value)} />
        </Field>
      </div>
      <div className="ob-row">
        <Field label="City" required>
          <input className="ob-input" placeholder="Amsterdam" value={d.city} onChange={(e) => set('city', e.target.value)} />
        </Field>
        <Field label="Country" required>
          <select className="ob-select" value={d.country} onChange={(e) => set('country', e.target.value)}>
            {['Netherlands', 'Belgium', 'Germany', 'France', 'United Kingdom', 'Other'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <div className="ob-callout">
        <span className="co-ico">{OBI.info()}</span>
        <p>We deliver wholesale across the EU. Your registered address sets your default <b>delivery zone</b> and invoicing details.</p>
      </div>
    </React.Fragment>
  );
}

function StepIdDoc({ d, set }) {
  const fileRef = React.useRef(null);
  const pick = () => fileRef.current && fileRef.current.click();
  const onFile = (e) => { const f = e.target.files[0]; if (f) set('idFile', f.name); };
  return (
    <React.Fragment>
      <Field label="Identity document" required hint="Passport, national ID or driver’s licence · PDF, JPG or PNG · max 10 MB">
        <div className={`ob-drop ${d.idFile ? 'filled' : ''}`} onClick={pick}>
          <div className="d-ico">{d.idFile ? OBI.checkCircle({ width: 26, height: 26 }) : OBI.upload()}</div>
          {d.idFile
            ? <React.Fragment><h4>{d.idFile}</h4><p>Click to replace</p></React.Fragment>
            : <React.Fragment><h4>Drag &amp; drop or click to upload</h4><p>Your document is encrypted and only used for verification</p></React.Fragment>}
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" hidden onChange={onFile} />
        </div>
      </Field>
    </React.Fragment>
  );
}

function StepBusiness({ d, set }) {
  return (
    <React.Fragment>
      <Field label="Registered business name" required>
        <input className="ob-input" placeholder="e.g. De Vries Bloemen B.V." value={d.businessName} onChange={(e) => set('businessName', e.target.value)} />
      </Field>
      <div className="ob-row">
        <Field label="VAT / registration no." required>
          <input className="ob-input" placeholder="NL001234567B01" value={d.vat} onChange={(e) => set('vat', e.target.value)} />
        </Field>
        <Field label="Legal form" required>
          <select className="ob-select" value={d.legalForm} onChange={(e) => set('legalForm', e.target.value)}>
            <option value="" disabled>Select…</option>
            {['Sole proprietor', 'B.V. / Ltd', 'V.O.F. / Partnership', 'N.V. / PLC', 'Other'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Primary industry" hint="Helps us recommend the right assortment and pricing tier.">
        <select className="ob-select" value={d.industry} onChange={(e) => set('industry', e.target.value)}>
          <option value="" disabled>Select…</option>
          {['Florist / retail shop', 'Event & wedding styling', 'Hospitality & interior', 'Reseller / distributor', 'Online flower shop', 'Other'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
    </React.Fragment>
  );
}

const SERVICES = [
  { id: 'cut', icon: 'flower', nm: 'Fresh Cut Flowers', ds: 'Daily auction-fresh stems' },
  { id: 'potted', icon: 'sparkles', nm: 'Potted Plants', ds: 'Indoor & outdoor greenery' },
  { id: 'supplies', icon: 'box', nm: 'Floral Supplies', ds: 'Foam, ribbon, tools & vases' },
  { id: 'greens', icon: 'flower', nm: 'Decorative Greens', ds: 'Foliage & fillers' },
  { id: 'dried', icon: 'sparkles', nm: 'Dried & Preserved', ds: 'Long-life arrangements' },
  { id: 'event', icon: 'sparkles', nm: 'Seasonal & Event', ds: 'Holiday & occasion lines' },
];
function StepServices({ d, set }) {
  const toggle = (id) => set('services', d.services.includes(id) ? d.services.filter((x) => x !== id) : [...d.services, id]);
  return (
    <React.Fragment>
      <Field label="Product lines" required hint="Select at least one. Most florists start with Fresh Cut Flowers and Supplies.">
        <div className="ob-svc">
          {SERVICES.map((s) => (
            <div key={s.id} className={`ob-svc-item ${d.services.includes(s.id) ? 'on' : ''}`} onClick={() => toggle(s.id)}>
              <div className="box">{OBI.check()}</div>
              <span className="si-ico">{OBI[s.icon]()}</span>
              <div style={{ flex: 1 }}>
                <div className="nm">{s.nm}</div>
                <div className="ds">{s.ds}</div>
              </div>
            </div>
          ))}
        </div>
      </Field>
    </React.Fragment>
  );
}

const PACKS = [
  { id: 'Boxes', icon: 'box' }, { id: 'Buckets', icon: 'bucket' }, { id: 'Trolleys', icon: 'trolley' },
];
function StepTransport({ d, set }) {
  return (
    <React.Fragment>
      <Field label="Packaging preference">
        <div className="ob-seg-group">
          {PACKS.map((p) => (
            <button key={p.id} className={`ob-seg-btn ${d.packaging === p.id ? 'on' : ''}`} onClick={() => set('packaging', p.id)}>
              {OBI[p.icon]()}{p.id}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Transport arrangement" required>
        <div className="ob-choices">
          <button className={`ob-choice ${d.transport === 'own' ? 'on' : ''}`} onClick={() => set('transport', 'own')}>
            <span className="c-check">{OBI.check()}</span>
            <div className="c-ico">{OBI.truck()}</div>
            <h4>I arrange my own transport</h4>
            <p>You provide a carrier or drive yourself</p>
            <span className="c-tag go">Order immediately after verification</span>
          </button>
          <button className={`ob-choice ${d.transport === 'ppflowers' ? 'on' : ''}`} onClick={() => set('transport', 'ppflowers')}>
            <span className="c-check">{OBI.check()}</span>
            <div className="c-ico">{OBI.box()}</div>
            <h4>PP Flowers arranges transport</h4>
            <p>Our logistics team sets up delivery</p>
            <span className="c-tag wait">Ordering starts after setup is confirmed</span>
          </button>
        </div>
      </Field>
      {d.transport === 'own' && (
        <Field label="Carrier name" required>
          <input className="ob-input" placeholder="e.g. DHL, Van der Valk Transport, own vehicle…" value={d.carrier} onChange={(e) => set('carrier', e.target.value)} />
        </Field>
      )}
      {d.transport === 'ppflowers' && (
        <Field label="Preferred delivery days" hint="Our team will confirm a route that fits your schedule.">
          <select className="ob-select" value={d.incoterm === '' ? '' : d.incoterm} onChange={(e) => set('carrier', e.target.value)}>
            <option value="">No preference</option>
            <option>Mon / Wed / Fri</option><option>Tue / Thu</option><option>Daily</option>
          </select>
        </Field>
      )}
      {d.transport && (
        <div className={`ob-callout ${d.transport === 'own' ? 'ok' : ''}`}>
          <span className="co-ico">{d.transport === 'own' ? OBI.checkCircle() : OBI.info()}</span>
          <p>{d.transport === 'own'
            ? <React.Fragment>You arrange your own transport — you can <b>start ordering</b> as soon as your account verification is complete.</React.Fragment>
            : <React.Fragment>Our logistics team will contact you to set up delivery. <b>Ordering opens</b> once your route is confirmed.</React.Fragment>}</p>
        </div>
      )}
    </React.Fragment>
  );
}

function StepCustoms({ d, set }) {
  return (
    <React.Fragment>
      <Field label="Where do you trade?" required>
        <div className="ob-choices">
          <button className={`ob-choice ${d.trade === 'domestic' ? 'on' : ''}`} onClick={() => set('trade', 'domestic')}>
            <span className="c-check">{OBI.check()}</span>
            <div className="c-ico">{OBI.home2()}</div>
            <h4>Domestic only</h4>
            <p>I trade within my own country</p>
            <span className="c-tag go">No customs paperwork needed</span>
          </button>
          <button className={`ob-choice ${d.trade === 'cross' ? 'on' : ''}`} onClick={() => set('trade', 'cross')}>
            <span className="c-check">{OBI.check()}</span>
            <div className="c-ico">{OBI.globe()}</div>
            <h4>Cross-border</h4>
            <p>I import or export across the EU / beyond</p>
            <span className="c-tag wait">EORI &amp; terms required</span>
          </button>
        </div>
      </Field>
      {d.trade === 'cross' && (
        <React.Fragment>
          <div className="ob-row">
            <Field label="EORI number" required hint="Your EU Economic Operators Registration & Identification number.">
              <input className="ob-input" placeholder="NL123456789012345" value={d.eori} onChange={(e) => set('eori', e.target.value)} />
            </Field>
            <Field label="Incoterms" required>
              <select className="ob-select" value={d.incoterm} onChange={(e) => set('incoterm', e.target.value)}>
                <option value="" disabled>Select…</option>
                {['EXW — Ex Works', 'FCA — Free Carrier', 'CPT — Carriage Paid To', 'DAP — Delivered at Place', 'DDP — Delivered Duty Paid'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <div className="ob-callout">
            <span className="co-ico">{OBI.info()}</span>
            <p>Not sure which Incoterm applies? Ask <b>Wholebot</b> — it can explain the difference in plain language.</p>
          </div>
        </React.Fragment>
      )}
      {d.trade === 'domestic' && (
        <div className="ob-callout ok">
          <span className="co-ico">{OBI.checkCircle()}</span>
          <p>Great — domestic trading needs <b>no customs setup</b>. You’re one step from finishing.</p>
        </div>
      )}
    </React.Fragment>
  );
}

function StepContract({ d, set }) {
  return (
    <React.Fragment>
      <Field label="Wholesale Trading Agreement">
        <div className="ob-terms">
          <h5>PP Flowers — Wholesale Trading Agreement</h5>
          <p>This agreement sets out the terms under which PP Flowers B.V. (“PP Flowers”) supplies floral products on a wholesale basis to the registered business named in this onboarding (“the Customer”).</p>
          <p><b>1. Account &amp; eligibility.</b> Wholesale accounts are available to registered businesses only. The Customer confirms that the identity and business details provided are accurate and that they are authorised to enter this agreement.</p>
          <p><b>2. Orders &amp; pricing.</b> Prices follow the daily wholesale rate at the moment of order confirmation. Minimum order values may apply depending on the selected services and delivery zone.</p>
          <p><b>3. Delivery &amp; transport.</b> Where the Customer arranges their own transport, ordering opens upon account verification. Where PP Flowers arranges transport, ordering opens once a delivery route is confirmed.</p>
          <p><b>4. Payment.</b> Invoices are issued per the registered details and payable within the agreed term. Cross-border orders are subject to the customs terms selected during onboarding.</p>
          <p><b>5. Quality &amp; claims.</b> Claims regarding product quality must be submitted within 24 hours of delivery, with photographic evidence where applicable.</p>
          <p>By signing below, the Customer accepts these terms in full.</p>
        </div>
      </Field>
      <div className="ob-row split">
        <Field label="Sign — type your full name" required>
          <input className="ob-input ob-sign" placeholder="Your name" value={d.signature} onChange={(e) => set('signature', e.target.value)} />
        </Field>
        <Field label="Date">
          <input className="ob-input" value={new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} readOnly style={{ background: '#FCFAF5', color: 'var(--muted)' }} />
        </Field>
      </div>
      <div className={`ob-checkrow ${d.accept ? 'on' : ''}`} onClick={() => set('accept', !d.accept)}>
        <div className="box">{OBI.check()}</div>
        <span>I have read and agree to the PP Flowers Wholesale Trading Agreement and confirm the information provided is accurate.</span>
      </div>
    </React.Fragment>
  );
}

const STEP_BODIES = {
  address: StepAddress, iddoc: StepIdDoc, business: StepBusiness,
  services: StepServices, transport: StepTransport, customs: StepCustoms, contract: StepContract,
};
Object.assign(window, { STEP_BODIES });
