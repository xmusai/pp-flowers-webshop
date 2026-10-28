const M=window.PPModel;
let RF_STORAGE;try{RF_STORAGE=window.localStorage}catch{}
const money=c=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(c/100);
const dayLabel=s=>s?new Date(s+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}):'Choose a date';
const units=(o,n)=>n.toLocaleString('en-GB')+' '+o.unit+(n===1?'':'s');
const RF_PRODUCTS=WS_PRODUCTS;
const prod=id=>RF_PRODUCTS.find(p=>p.id===id);
function productOffers(p){return wsGrowerOffers(p).map(o=>({id:p.id+'::'+o.grower,productId:p.id,name:p.name,grower:o.grower,origin:o.origin,stemCm:o.stemCm,potCm:o.potCm??p.potCm,grade:o.grade,unit:ppUnit(p),unitCents:Math.round(o.perStem*100),step:p.unit==='piece'?1:p.bunch,minQty:o.moq*(p.unit==='piece'?1:p.bunch),lot:ppLot(p),maxQty:Math.max(1,o.boxesLeft||1)*ppLot(p),availableDate:M.dates()[o.lead==='48 h'?1:0]}));}
const RF_OFFERS=RF_PRODUCTS.flatMap(productOffers);
const baseOffer=p=>RF_OFFERS.find(o=>o.productId===p.id);
const market=(overrides={})=>RF_OFFERS.map(o=>({...o,...(overrides[o.id]||{})}));
function RControlIcon({name}){const paths={repeat:'M20 7h-5m5 0V2M4 17h5m-5 0v5M5.5 8a7 7 0 0 1 11.7-3L20 7M4 17l2.8 2A7 7 0 0 0 18.5 16',copy:'M9 9h12v12H9ZM3 15V3h12',back:'M19 12H5m6-6-6 6 6 6',next:'M5 12h14m-6-6 6 6-6 6',minus:'M5 12h14',plus:'M12 5v14M5 12h14',close:'m6 6 12 12M18 6 6 18',calendar:'M8 3v4m8-4v4M4 10h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2m2 9h2m4 0h2m-8 3h2',down:'m7 10 5 5 5-5',sort:'M8 4v16m-4-4 4 4 4-4M16 20V4m-4 4 4-4 4 4'};return <svg className="rf-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]}/></svg>;}
function RReorderMark(){return <svg className="rf-reorder-mark" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false"><path d="M23 9a10.5 10.5 0 1 0 .1 10M23 4.5V9h-4.5" stroke="#426545" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 14v8m0-3c-3.2 0-4.5-1.4-4.5-3.5 2.7 0 4.5 1.2 4.5 3.5m0 1.5c3.1 0 4.5-1.4 4.5-3.5-2.7 0-4.5 1.2-4.5 3.5" stroke="#426545" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 7c-2.8-3-6 1-3.4 3-3.8 1.3-1.3 6 1.5 4.2 1.2 3.5 5.7 1.7 4.5-1.5 3.5-1 1.9-5.5-1.2-4.4C14.2 7.6 13.7 7.2 13 7Z" fill="#ffae73" stroke="#e76b18" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="12.7" cy="11.3" r="1.5" fill="#e76b18"/></svg>;}
function RBackButton({children,onClick,className=''}){return <button type="button" className={'rf-btn rf-back-button '+className} onClick={onClick}><RControlIcon name="back"/><span>{children}</span></button>;}
function RPhoto({p}){const [failed,setFailed]=React.useState(false);const url=p&&window.__resources['shot-'+p.id];return url&&!failed?<img src={url} alt={p.name} loading="lazy" onError={()=>setFailed(true)}/>:<span className="rf-fallback" role="img" aria-label={(p?.name||'Product')+': photo unavailable'}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 3-3 6 6"/></svg><span>Photo unavailable</span></span>;}
function RModal({title,children,onClose,wide=false,className='',style}){
 const ref=React.useRef(null),previous=React.useRef(document.activeElement);
 React.useEffect(()=>{ref.current.showModal();return()=>previous.current?.focus?.({preventScroll:true})},[]);
 return <dialog ref={ref} className={'rf-modal '+(wide?'wide':'')+' '+className} style={style} aria-label={title} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===ref.current)onClose()}}><div className="rf-modal-head"><h2>{title}</h2><button className="rf-icon" aria-label={'Close '+title} onClick={onClose}><RControlIcon name="close"/></button></div><div className="rf-modal-body">{children}</div></dialog>;
}
function RDepartureDate({state,onApply,onClose}){
 const [date,setDate]=React.useState(()=>M.dates()[0]),[error,setError]=React.useState('');const days=M.dates();
 function submit(e){e.preventDefault();if(!M.dates().includes(date)){setDate(M.dates()[0]);setError('The date has changed. Please confirm your new departure date.');return;}onApply(date);}
 return <RModal title="Choose departure date" onClose={onClose}><form onSubmit={submit}><p className="rf-meta">Departure is the day we send your order. Arrival depends on the logistics company.</p><label className="rf-field">Departure date<select value={date} onChange={e=>{setDate(e.target.value);setError('')}}>{days.map((d,i)=><option key={d} value={d}>{i===0?'Tomorrow · ':''}{dayLabel(d)}</option>)}</select></label><div className="rf-address-box"><b>Shipping address</b><address className="rf-address">{state.contact.street}<br/>{state.contact.postcode} {state.contact.city}<br/>{state.contact.country}</address><p className="rf-fine">You can edit the address at checkout.</p></div><p className="rf-fine">Shipping: €24.50 per order, excl. VAT.</p>{error&&<p className="rf-error" role="alert">{error}</p>}<div className="rf-modal-actions"><button type="button" className="rf-btn" onClick={onClose}>Cancel</button><button type="submit" className="rf-btn primary">Confirm departure date</button></div></form></RModal>;
}
function RQuantity({offer,value,onChange,label,allowRemove=false,onConfirm,selectOnFocus=false,retainInvalid=false,onValidityChange}){
 const [raw,setRaw]=React.useState(String(value)),[error,setError]=React.useState('');const rid=React.useId();
 React.useEffect(()=>{setRaw(String(value));setError('');onValidityChange?.(true)},[value]);
 function commit(n){const issue=allowRemove&&n===0?'':M.qtyError(offer,n);if(issue){setError(issue);onValidityChange?.(false);return false;}setError('');onValidityChange?.(true);onChange(n);return true;}
 function edit(e){setRaw(e.target.value);const n=Number(e.target.value),issue=e.target.value===''?'Enter a quantity.':M.qtyError(offer,n);if(onValidityChange){setError(issue);onValidityChange(!issue)}if(!issue){onChange(n);setError('')}}
 function blur(){const n=Number(raw),issue=raw===''?'Enter a quantity.':M.qtyError(offer,n);if(issue){if(!retainInvalid)setRaw(String(value));setError(retainInvalid?issue:'Use multiples of '+offer.step+', minimum '+offer.minQty+'.');onValidityChange?.(false)}else commit(n)}
 return <div className="rf-quantity-wrap"><div className="rf-quantity"><button type="button" aria-label={'Decrease '+label+' by '+offer.step} disabled={value<=offer.minQty&&!allowRemove} onClick={()=>commit(value-offer.step<offer.minQty?(allowRemove?0:offer.minQty):value-offer.step)}><RControlIcon name="minus"/></button><input id={rid} type="number" min={offer.minQty} max={offer.maxQty} step={offer.step} inputMode="numeric" aria-label={label+' quantity'} aria-invalid={!!error} aria-describedby={error?rid+'-error':undefined} value={raw} onFocus={e=>{if(selectOnFocus)e.currentTarget.select()}} onChange={edit} onBlur={blur} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();const n=Number(raw);if(commit(n)&&onConfirm)onConfirm(n)}}}/><button type="button" aria-label={'Increase '+label+' by '+offer.step} disabled={value+offer.step>offer.maxQty} onClick={()=>commit(value+offer.step)}><RControlIcon name="plus"/></button></div>{error&&<span id={rid+'-error'} className="rf-error" role="alert">{error}</span>}</div>;
}
function RCard({p,offer,delivery,saved,onSave,onOpen,onAdd,onDate,quantity,onQuantity,inCart=0,details=false,offerContext=false}){
 const qty=quantity??offer.lot,setQty=onQuantity,open=()=>onOpen(qty),offerLabel=p.name+(offerContext?' from '+offer.grower:'');
 React.useEffect(()=>{if(M.qtyError(offer,qty))setQty(Math.max(offer.minQty,Math.min(Math.floor(offer.maxQty/offer.step)*offer.step,Math.ceil(qty/offer.step)*offer.step)))},[offer.id]);
 const dateValid=M.dates().includes(delivery),eligible=dateValid&&offer.availableDate<=delivery;
 const qtyIssue=M.qtyError(offer,qty),remaining=Math.max(0,offer.maxQty-inCart),canAdd=eligible&&!qtyIssue&&qty<=remaining;
 const colour=WS_COLOURS.find(c=>c.id===p.colour),count=RF_OFFERS.filter(o=>o.productId===p.id).length;
 const buy=<div className="rf-catalogue-buy"><div className={'rf-card-availability '+(!eligible?'later':'')}><span>{eligible?'✓ Departure '+dayLabel(delivery):dateValid?'Departs from '+dayLabel(offer.availableDate):'Choose your departure date'}</span>{inCart>0&&<span className="rf-added">✓ {units(offer,inCart)} in basket</span>}</div><div className="rf-buy-label"><span>Quantity ({offer.unit}s)</span><span>Line total · excl. VAT</span></div><div className="rf-buy-controls"><RQuantity offer={offer} value={qty} onChange={setQty} label={offerLabel} onConfirm={n=>{if(eligible&&n<=remaining)onAdd(offer,n)}}/><button className={'rf-btn '+(eligible?'primary':'rf-change-date')} disabled={eligible&&!canAdd} onClick={()=>eligible?onAdd(offer,qty):onDate()} aria-label={eligible?'Add '+units(offer,qty)+' of '+offerLabel:'Change departure for '+offerLabel}>{!eligible?'Change departure →':canAdd?<><span>Add</span><strong>{money(offer.unitCents*qty)}</strong></>:qtyIssue?'Check quantity':'Stock limit reached'}</button></div><p className="rf-buy-hint">Min. {units(offer,offer.minQty)} · multiples of {offer.step}<span>{units(offer,remaining)} left</span></p></div>;
 const heart=<button className={'rf-icon rf-heart '+(saved?'on':'')} aria-pressed={saved} aria-label={(saved?'Unsave ':'Save ')+p.name} onClick={onSave}>{WI.heart({})}</button>;
 if(details)return <article className={'rf-detail-card rf-order-card '+(inCart?'has-items':'')} aria-label={offerLabel+' details'}>
  <div className="rf-order-card-head"><button className="rf-order-thumb" aria-label={'View '+offerLabel} onClick={open}><RPhoto p={p}/></button><button className="rf-name" title={p.name} onClick={open}>{p.name}</button>{heart}</div>
  <div className="rf-card-unit-price"><strong>{money(offer.unitCents)}</strong><span>/ {offer.unit}</span></div>
  <div className="rf-order-grower"><span>Grower</span><strong title={offer.grower}>{offer.grower}</strong></div>
  <dl className="rf-order-specs"><div><dt>{offer.unit==='plant'?'Height':'Length'}</dt><dd>{offer.stemCm} cm</dd></div><div><dt>Grade</dt><dd>{offer.grade}</dd></div><div><dt>Colour</dt><dd>{colour&&<span className={'rf-colour-dot '+(colour.hex==='mixed'?'mixed':'')} style={colour.hex!=='mixed'?{background:colour.hex}:undefined}/>} {colour?.label||'—'}</dd></div><div><dt>Origin</dt><dd>{offer.origin}</dd></div>{offer.potCm&&<div><dt>Pot diameter</dt><dd>Ø {offer.potCm} cm</dd></div>}</dl>
  <button className="rf-order-compare" onClick={open} aria-label={'Compare '+count+' grower offers for '+offerLabel}><span>Compare offers <b>{count}</b></span><RControlIcon name="next"/></button>
  <div className={'rf-order-delivery '+(!eligible?'later':'')}>{eligible?<><span aria-hidden="true">✓</span> {dayLabel(delivery)} departure</>:<button onClick={onDate}>{dateValid?'Departs from '+dayLabel(offer.availableDate):'Choose departure date'} →</button>}</div>
  <div className="rf-order-stock">{inCart>0?<span className="rf-order-incart">{units(offer,inCart)} in basket · </span>:null}{units(offer,remaining)} left</div>
  <div className="rf-order-purchase"><div className="rf-order-quantity-row"><span>{offer.unit==='stem'?'Stems':offer.unit==='plant'?'Plants':'Pieces'}</span><RQuantity offer={offer} value={qty} onChange={setQty} label={offerLabel} onConfirm={n=>{if(eligible&&n<=remaining)onAdd(offer,n)}}/></div>
   <p className="rf-order-multiple">Min. {offer.minQty} · multiples of {offer.step}</p>
   <button className={'rf-btn rf-order-add '+(eligible?'primary':'rf-change-date')} disabled={eligible&&!canAdd} onClick={()=>eligible?onAdd(offer,qty):onDate()} aria-label={eligible?'Add '+units(offer,qty)+' of '+offerLabel:'Change departure for '+offerLabel}>{!eligible?'Change departure date':canAdd?<><span>Add to basket</span><strong>{money(offer.unitCents*qty)}</strong></>:qtyIssue?'Check quantity':'Stock limit reached'}</button>
  </div>
 </article>;
 return <article className={'rf-card '+(inCart?'has-items':'')} aria-label={offerLabel+' photo card'}><button className="rf-photo" aria-label={'View '+offerLabel} onClick={open}><RPhoto p={p}/></button>{heart}<div className="rf-card-body"><div className="rf-photo-heading"><button className="rf-name" onClick={open}>{p.name}</button><div className="rf-photo-colour"><span className="sr-only">Colour </span>{colour&&<span aria-hidden="true" className={'rf-colour-dot '+(colour.hex==='mixed'?'mixed':'')} style={colour.hex!=='mixed'?{background:colour.hex}:undefined}/>}<span>{colour?.label||'Not specified'}</span></div></div><div className={'rf-meta'+(offerContext?' rf-offer-meta':'')}>{offerContext?<><strong>{offer.grower}</strong>{offer.unit==='plant'?<><span>Height {offer.stemCm} cm · Pot Ø {offer.potCm} cm</span><span>{offer.grade} · {offer.origin}</span></>:<span>{offer.stemCm} cm · {offer.grade} · {offer.origin}</span>}</>:<>{offer.grower} · {offer.stemCm} cm · {offer.grade}</>}</div><div className="rf-photo-price"><strong>{money(offer.unitCents)}</strong><span>per {offer.unit} · excl. VAT</span></div><button className="rf-compare-cta" onClick={open} aria-label={'Compare offers for '+offerLabel}><span>Compare growers <b>{count}</b></span><RControlIcon name="next"/></button>{buy}</div></article>;
}
function RSummary({lines,delivery,children,checkout=false}){const t=M.totals(lines);return <aside className="rf-summary"><h2>Order summary</h2><div className="rf-summary-date"><b>Departure {dayLabel(delivery)}</b><span>Arrival timing depends on the carrier.</span></div><div className="rf-sumrow"><span>{lines.length} product {lines.length===1?'line':'lines'}</span><b>{money(t.subtotalCents)}</b></div><div className="rf-sumrow"><span>Shipping</span><span>{money(t.shippingCents)}</span></div><div className="rf-sumrow total"><span>Total <small>excl. VAT</small></span><strong>{money(t.totalCents)}</strong></div>{(!checkout||t.remainingCents>0)&&<div className={'rf-progress '+(!t.remainingCents?'complete':'')}><progress value={Math.min(t.subtotalCents,M.MIN)} max={M.MIN} aria-label="Progress toward order minimum"/><span>{t.remainingCents?money(t.remainingCents)+' to reach the €500 order minimum':'✓ Your order meets the €500 minimum'}</span></div>}{children}{checkout&&<p className="rf-fine rf-checkout-disclosure">Demo order only. No payment is taken or flowers dispatched.</p>}</aside>}
// Render the supplied line snapshot; never substitute live catalogue specifications or prices.
function RProductLinesTable({lines,subtotalCents,caption,regionLabel='Product details',editable=false,onQty,onRemove,onOffer}){return (
<div className="rf-ordered-table-wrap" role="region" aria-label={regionLabel} tabIndex="0"><table className={'rf-ordered-table'+(editable?' rf-basket-table':'')}>
  <caption className="sr-only">{caption}</caption>
  <thead><tr><th scope="col">Product</th><th scope="col">Grower</th><th scope="col">Origin</th><th scope="col">Size</th><th scope="col">Quality</th><th scope="col" className="numeric">Quantity</th><th scope="col" className="numeric">Unit price</th><th scope="col" className="numeric">Line total</th></tr></thead>
  <tbody>{lines.map((line,index)=><tr key={line.id+'-'+index}>
   <th scope="row"><div className="rf-ordered-product"><span className="rf-ordered-photo"><RPhoto p={{id:line.productId,name:line.name}}/></span><div className="rf-ordered-identity"><strong>{line.name}</strong>{editable&&<div className="rf-basket-row-actions">{onOffer&&<button type="button" onClick={()=>onOffer(line)} aria-label={'Change offer for '+line.name+' from '+line.grower}>Change offer</button>}<button type="button" className="rf-danger-action" onClick={()=>onRemove(line.id)} aria-label={'Remove '+line.name+' from '+line.grower}>Remove</button></div>}</div></div></th>
   <td>{line.grower||'—'}</td><td>{line.origin||'—'}</td><td>{line.stemCm?line.stemCm+' cm':'—'}{line.potCm&&<small>Pot Ø {line.potCm} cm</small>}</td><td>{line.grade||'—'}</td>
   <td className="numeric">{editable?<><RQuantity offer={line} value={line.qty} label={line.name+' from '+line.grower} onChange={n=>onQty(line,n)} allowRemove selectOnFocus/><small>{line.unit}s · multiples of {line.step}</small></>:<><strong>{line.qty.toLocaleString('en-GB')}</strong><small>{line.unit}{line.qty===1?'':'s'}</small></>}</td>
   <td className="numeric">{money(line.unitCents)}<small>per {line.unit}</small></td><td className="numeric"><strong>{money(line.unitCents*line.qty)}</strong></td>
  </tr>)}</tbody>
  <tfoot><tr><th scope="row" colSpan="7">Product subtotal <span>excl. VAT</span></th><td className="numeric"><strong>{money(subtotalCents)}</strong></td></tr></tfoot>
 </table></div>
);}
function ROrderLinesTable({order}){return <section className="rf-panel rf-ordered-products" aria-labelledby="ordered-products-title">
 <div className="rf-ordered-heading"><h2 id="ordered-products-title">Your ordered products</h2><span>{order.lines.length} product {order.lines.length===1?'line':'lines'} · excl. VAT</span></div>
 <RProductLinesTable lines={order.lines} subtotalCents={order.subtotalCents} caption={'Products saved with order '+order.id+'. Prices exclude VAT.'} regionLabel="Ordered product details"/>
</section>;}
function productOfferOverview(offers,delivery,length='all'){
 const visible=offers.filter(o=>length==='all'||String(o.stemCm)===String(length));
 const stocked=visible.filter(o=>o.maxQty>=o.minQty);
 const dateValid=M.dates().includes(delivery);
 return {visible,stocked,dateValid,lengths:[...new Set(offers.map(o=>o.stemCm))].sort((a,b)=>a-b),lowest:stocked.length?Math.min(...stocked.map(o=>o.unitCents)):null,highest:stocked.length?Math.max(...stocked.map(o=>o.unitCents)):null,ready:dateValid?stocked.filter(o=>o.availableDate<=delivery).length:0};
}
function RProduct({p,offers,state,onAdd,onBack,onSave,replaceId,preferredOfferId,preferredQty,onDate,backLabel='products'}){
 const relevant=offers.filter(o=>o.productId===p.id);
 const [selected,setSelected]=React.useState(replaceId||preferredOfferId||relevant[0].id);
 const offer=relevant.find(o=>o.id===selected)||relevant[0];
 const [qty,setQty]=React.useState(Math.max(offer.minQty,replaceId?state.cart.find(l=>l.id===replaceId)?.qty||offer.lot:preferredQty??offer.lot));
 const [sort,setSort]=React.useState('price'),[photoOpen,setPhotoOpen]=React.useState(false),[announcement,setAnnouncement]=React.useState(''),[length,setLength]=React.useState('all');
 const overview=productOfferOverview(relevant,state.delivery,length);
 const eligible=M.dates().includes(state.delivery)&&offer.availableDate<=state.delivery;
 const inCart=state.cart.find(l=>l.id===offer.id&&l.id!==replaceId)?.qty||0;
 const canBuy=eligible&&!M.qtyError(offer,qty)&&qty+inCart<=offer.maxQty;
 const lowest=overview.lowest;
 const sorted=[...overview.visible].sort((a,b)=>sort==='length'?b.stemCm-a.stemCm||a.unitCents-b.unitCents:sort==='delivery'?a.availableDate.localeCompare(b.availableDate)||a.unitCents-b.unitCents:a.unitCents-b.unitCents);
 function pick(o){if(o.maxQty<o.minQty)return;const n=Math.max(o.minQty,Math.min(o.maxQty,Math.ceil(qty/o.step)*o.step));setSelected(o.id);setQty(n);setAnnouncement(o.grower+' selected.'+(n!==qty?' Quantity adjusted to '+units(o,n)+' to match this offer’s minimum and order multiple.':''));}
 function chooseLength(next){setLength(next);const nextOverview=productOfferOverview(relevant,state.delivery,next);if(!nextOverview.visible.some(o=>o.id===offer.id)){const candidates=[...nextOverview.stocked].sort((a,b)=>Number(nextOverview.dateValid&&b.availableDate<=state.delivery)-Number(nextOverview.dateValid&&a.availableDate<=state.delivery)||a.unitCents-b.unitCents);if(candidates.length)pick(candidates[0]);}}
 return <>
  <RBackButton onClick={onBack}>Back to {replaceId?'basket':backLabel}</RBackButton>
  <div className="rf-product-overview rf-buying-overview">
   <div className="rf-buying-identity"><button className="rf-buying-photo" onClick={()=>setPhotoOpen(true)} aria-label={'View larger photo of '+p.name}><RPhoto p={p}/><span>View photo</span></button><div><div className="rf-eyebrow">{WS_CAT_MAP[p.cat]?.label}</div><h1 tabIndex="-1">{p.name}</h1><p>{p.sub}</p><button className="rf-textbtn rf-save-product" onClick={onSave} aria-pressed={state.saved.includes(p.id)}>{WI.heart({'aria-hidden':true})}{state.saved.includes(p.id)?'Saved':'Save product'}</button></div></div>
   <div className="rf-buying-options"><div className="rf-price-range-label">{length==='all'?'Grower price range':length+' cm grower prices'}</div><div className="rf-buying-price">{overview.lowest===null?'No stock available':<><strong>{money(overview.lowest)}{overview.highest!==overview.lowest&&<> – {money(overview.highest)}</>}</strong><span>per {offer.unit} · excl. VAT</span></>}</div><div className="rf-length-choices" role="group" aria-label={offer.unit==='plant'?'Compare offers by height':'Compare offers by length'}><span>{offer.unit==='plant'?'Plant height':offer.unit==='stem'?'Stem length':'Length'}</span>{['all',...overview.lengths].map(n=><button key={n} aria-pressed={String(length)===String(n)} disabled={n!=='all'&&!relevant.some(o=>o.stemCm===n&&o.maxQty>=o.minQty)} onClick={()=>chooseLength(n)}>{n==='all'?(offer.unit==='plant'?'All heights':'All lengths'):n+' cm'}</button>)}</div></div>
   <div className="rf-buying-delivery"><span>Departure date</span><button onClick={onDate} aria-label={overview.dateValid?'Change departure date, '+dayLabel(state.delivery):'Choose departure date'}>{WI.clock({'aria-hidden':true})}<strong>{overview.dateValid?dayLabel(state.delivery):'Choose a date'}</strong><span aria-hidden="true">⌄</span></button><p className={overview.ready?'ready':''}>{overview.dateValid?<><b>{overview.ready} of {overview.visible.length} offers</b> available for this date</>:'Choose a date to check grower availability.'}</p></div>
  </div>
  <div className="rf-compare-layout">
   <section className="rf-offers rf-comparison" aria-labelledby="offers-title">
    <div className="rf-comparison-title"><div><h2 id="offers-title">Compare grower offers <span className="rf-offer-count">{sorted.length}</span></h2><p role="status">{length==='all'?(offer.unit==='plant'?'All heights':'All lengths'):length+' cm offers'} · Select a row to choose your grower.</p></div><label className="rf-offer-sort"><span className="sr-only">Sort grower offers</span><select aria-label="Sort grower offers" value={sort} onChange={e=>setSort(e.target.value)}><option value="price">Lowest price first</option><option value="delivery">Earliest departure first</option><option value="length">{offer.unit==='plant'?'Tallest plants first':'Longest stems first'}</option></select></label></div>
    <div className="rf-comparison-scroll"><table className="rf-compare-table"><caption className="sr-only">Available grower offers for {p.name}. Select one to set your quantity and add it to your basket.</caption><thead><tr><th scope="col"><span className="sr-only">Select</span></th><th scope="col">Grower & origin</th><th scope="col">{offer.unit==='plant'?'Height':'Length'} & grade</th><th scope="col">Earliest departure</th><th scope="col">Min. order</th><th scope="col">Price / {offer.unit}</th></tr></thead><tbody>{sorted.map(o=>{const active=o.id===offer.id,ready=M.dates().includes(state.delivery)&&o.availableDate<=state.delivery,soldOut=o.maxQty<o.minQty;return <tr key={o.id} className={(active?'selected ':'')+(soldOut?'sold-out':'')} onClick={()=>pick(o)}><td className="rf-radio-cell"><input type="radio" name={'grower-'+p.id} aria-label={'Choose '+o.grower+', '+o.stemCm+' cm, '+money(o.unitCents)+' per '+o.unit} checked={active} disabled={soldOut} onChange={()=>pick(o)}/></td><td><strong className="rf-grower-name">{o.grower}</strong><span className="rf-cell-note">{o.origin}</span></td><td><b>{o.stemCm} cm</b><span className="rf-cell-note">{o.grade}{o.potCm&&<> · Pot Ø {o.potCm} cm</>}</span></td><td><b>{dayLabel(o.availableDate)}</b><span className={'rf-cell-note rf-delivery-status '+(!ready||soldOut?'later':'')}>{soldOut?'Sold out':ready?'✓ For your date':'Later departure'}</span></td><td><b>{units(o,o.minQty)}</b><span className="rf-cell-note">Multiples of {o.step}</span></td><td className="rf-compare-price"><strong>{money(o.unitCents)}</strong>{o.unitCents===lowest?<span className="rf-lowest">Lowest price</span>:<span className="rf-cell-note">excl. VAT</span>}</td></tr>})}</tbody></table></div>
    <p className="rf-comparison-note">Prices are per {offer.unit}, excl. VAT. Shipping is charged once per order.</p>
   </section>
   <aside className="rf-offer-summary" aria-label="Selected grower offer">
    <header className="rf-selected-header"><div className="rf-selected-label">{PFI.check({'aria-hidden':true})} Selected grower</div><h3>{offer.grower}</h3><p>{offer.origin}</p></header>
    <dl className="rf-selected-specifications"><div><dt>{offer.unit==='plant'?'Plant height':'Length'}</dt><dd>{offer.stemCm} cm</dd></div><div><dt>Quality</dt><dd>{offer.grade}</dd></div>{offer.potCm&&<div><dt>Pot size</dt><dd>Ø {offer.potCm} cm</dd></div>}</dl>
    <div className="rf-selected-price"><span>Price per {offer.unit}<small>excl. VAT</small></span><strong>{money(offer.unitCents)}</strong></div>
    <div className={'rf-selected-availability '+(!eligible?'later':'')}>{WI.clock({'aria-hidden':true})}<span>{eligible?'Departure':'Earliest departure'}<strong>{dayLabel(eligible?state.delivery:offer.availableDate)}</strong></span>{eligible&&PFI.check({'aria-hidden':true})}</div>
    {!eligible&&<button className="rf-textbtn" onClick={onDate}>Choose a later departure date</button>}
    <div className="rf-selected-quantity"><label className="rf-quantity-label">Quantity in {offer.unit}s</label><RQuantity offer={offer} value={qty} label={p.name} onChange={setQty}/><p className="rf-fine">Min. {units(offer,offer.minQty)} · multiples of {offer.step}</p><p className="rf-selected-stock">{units(offer,Math.max(0,offer.maxQty-inCart))} available to add{inCart>0&&<span>{units(offer,inCart)} already in your basket</span>}</p></div>
    <div className="rf-selected-total"><span>Line total <small>excl. VAT</small></span><strong>{money(qty*offer.unitCents)}</strong></div>
    <button className="rf-btn primary rf-full" disabled={!canBuy} onClick={()=>onAdd(offer,qty)}><span>{replaceId?'Update basket':'Add '+units(offer,qty)}</span><RControlIcon name="next"/></button>
    {!canBuy&&<p className="rf-error">{!eligible?'Select a later departure date to order this offer.':M.qtyError(offer,qty)||'This quantity exceeds the remaining stock.'}</p>}
    <p className="sr-only" role="status">{announcement}</p>
   </aside>
  </div>
  <div className="rf-mobile-basket rf-product-bar"><div className="rf-bar-title"><b>{p.name}</b><span>{offer.grower} · {offer.stemCm} cm · {money(offer.unitCents)} / {offer.unit}</span></div><RQuantity offer={offer} value={qty} onChange={setQty} label={p.name+' quick add'}/><div><b>{money(qty*offer.unitCents)}</b><span>{units(offer,qty)} · excl. VAT</span></div><button className="rf-btn primary" disabled={!canBuy} onClick={()=>onAdd(offer,qty)}>{replaceId?'Update selected offer':'Add selected offer'}</button></div>
  {photoOpen&&<RModal title={p.name} onClose={()=>setPhotoOpen(false)} wide><div className="rf-enlarged-photo"><RPhoto p={p}/></div></RModal>}
 </>;
}
function ROfferReview({issues,onResolve,onRemove,onDate}){return issues.length?<div className="rf-review" role="alert"><h3>{issues.length===1?'One offer needs your attention':issues.length+' offers need your attention'}</h3>{issues.map(i=><div key={i.id} className="rf-review-line"><div><p>{i.type==='delivery'?<>{i.offer.name} can depart from <b>{dayLabel(i.offer.availableDate)}</b>.</>:i.message}{i.type==='price'&&<> New price: <b>{money(i.offer.unitCents)} / {i.offer.unit}</b></>}</p>{i.offer&&<span className="rf-meta">{i.offer.grower} · {i.offer.stemCm} cm · {i.offer.grade}</span>}</div><div className="rf-actions">{i.type==='price'&&<button type="button" className="rf-btn small" onClick={()=>onResolve(i)}>Accept price</button>}{i.type==='stock'&&i.offer?.maxQty>=i.offer?.minQty&&<button type="button" className="rf-btn small" onClick={()=>onResolve(i)}>Use {units(i.offer,Math.floor(i.offer.maxQty/i.offer.step)*i.offer.step)}</button>}{i.type==='delivery'&&<button type="button" className="rf-btn small" onClick={onDate}>Change departure date</button>}<button type="button" className="rf-textbtn rf-danger-action" onClick={()=>onRemove(i.id)}>Remove</button></div></div>)}</div>:null;}
function RCheckout({state,offers,onBack,onPlace,onTopup,onResolve,onRemove,onDate}){
 const [contact,setContact]=React.useState({...state.contact}),[edit,setEdit]=React.useState(false),[errors,setErrors]=React.useState({}),[payment,setPayment]=React.useState('transfer'),[save,setSave]=React.useState(true),[submitting,setSubmitting]=React.useState(false),[message,setMessage]=React.useState('');const pending=React.useRef(false),t=M.totals(state.cart),issues=M.review(state.cart,offers,state.delivery),enough=state.balanceCents>=t.totalCents;
 function submit(e){e.preventDefault();if(pending.current)return;const err=M.validateContact(contact);setErrors(err);if(Object.keys(err).length){setEdit(true);setMessage('Check the highlighted details.');requestAnimationFrame(()=>document.getElementById('checkout-'+Object.keys(err)[0])?.focus());return;}pending.current=true;setSubmitting(true);try{onPlace({contact,delivery:state.delivery,payment,saveContact:save});}catch(e){pending.current=false;setSubmitting(false);setMessage(e.message)}}
 const field=(k,label,type='text')=><label className="rf-field" key={k}>{label}<input id={'checkout-'+k} type={type} value={contact[k]||''} aria-invalid={!!errors[k]} aria-describedby={errors[k]?'err-'+k:undefined} autoComplete={{first:'given-name',last:'family-name',email:'email',street:'street-address',postcode:'postal-code',city:'address-level2',phone:'tel'}[k]} onChange={e=>{setContact(c=>({...c,[k]:e.target.value}));setErrors(x=>({...x,[k]:''}));setMessage('')}}/>{errors[k]&&<span className="rf-error" id={'err-'+k}>{errors[k]}</span>}</label>;
 return <><RBackButton onClick={onBack}>Return to basket</RBackButton><div className="rf-title"><div><h1 tabIndex="-1">Review & place your order</h1><p>Confirm your departure date, products and payment method.</p></div></div><form className="rf-checkout" noValidate onSubmit={submit}><div><section className="rf-panel"><div className="rf-panel-title"><h2><span>1</span> Departure & shipping details</h2><button type="button" className="rf-textbtn" onClick={onDate}>Change date</button></div><p className="rf-date-line">{WI.clock({})}<span>Departure</span><b>{dayLabel(state.delivery)}</b></p>{field('email','Order confirmation email','email')}<div className="rf-panel-title"><h3>Delivery address</h3><button type="button" className="rf-textbtn" onClick={()=>setEdit(x=>!x)}>{edit?'Done editing':'Edit address'}</button></div>{edit?<><div className="rf-fields-two">{field('first','First name')}{field('last','Last name')}</div>{field('street','Street and house number')}<div className="rf-fields-two">{field('postcode','Postcode')}{field('city','City')}</div><label className="rf-field">Country<select value={contact.country} onChange={e=>setContact(c=>({...c,country:e.target.value}))}>{['Netherlands','Belgium','Germany','France','United Kingdom'].map(c=><option key={c}>{c}</option>)}</select></label>{field('phone','Phone (optional)','tel')}<label className="rf-check"><input type="checkbox" checked={save} onChange={e=>setSave(e.target.checked)}/>Save this address for next time</label></>:<address className="rf-address">{contact.first} {contact.last}<br/>{contact.street}<br/>{contact.postcode} {contact.city}<br/>{contact.country}</address>}</section><section className="rf-panel rf-ordered-products" aria-labelledby="checkout-products-title"><div className="rf-ordered-heading"><h2 id="checkout-products-title"><span>2</span> Your products</h2><button type="button" className="rf-textbtn" onClick={onBack}>Edit basket</button></div>{issues.length>0&&<div className="rf-checkout-product-issues"><ROfferReview issues={issues} onResolve={onResolve} onRemove={onRemove} onDate={onDate}/></div>}<RProductLinesTable lines={state.cart} subtotalCents={t.subtotalCents} caption="Products in your checkout. Prices exclude VAT." regionLabel="Checkout product details"/></section><section className="rf-panel"><h2><span>3</span> Payment</h2><label className={'rf-payment '+(payment==='transfer'?'on':'')}><input type="radio" name="payment" value="transfer" checked={payment==='transfer'} onChange={()=>setPayment('transfer')}/><div><b>Bank transfer</b><p>Order received first. Confirmation follows once payment is received.</p><p className="rf-payment-guidance">To help prevent delays to your order, use an instant bank transfer where available.</p></div></label><label className={'rf-payment '+(payment==='balance'?'on':'')}><input type="radio" name="payment" value="balance" checked={payment==='balance'} disabled={!enough} onChange={()=>setPayment('balance')}/><div><b>Account balance · {money(state.balanceCents)}</b><p>{enough?'Enough balance for this order.':'Add '+money(Math.max(0,t.totalCents-state.balanceCents))+' to use your balance.'}</p></div></label>{!enough&&<button type="button" className="rf-textbtn" onClick={onTopup}>Add demo balance</button>}</section></div><RSummary lines={state.cart} delivery={state.delivery} checkout><div className="rf-summary-payment"><span>Payment method</span><strong>{payment==='balance'?'Account balance':'Bank transfer'}</strong></div>{message&&<p role="alert" className="rf-error">{message}</p>}{issues.length>0&&<p className="rf-error">Resolve the highlighted lines to continue.</p>}<button type="submit" className="rf-btn primary" disabled={submitting||!!t.remainingCents||!!issues.length||!state.cart.length||(payment==='balance'&&!enough)}>{submitting?'Placing order…':'Place demo order · '+money(t.totalCents)}</button>{t.remainingCents>0&&<button type="button" className="rf-btn" onClick={onBack}>Return to basket</button>}</RSummary></form></>;
}
function RFilters({filters,onApply,onClose,products,query,scope,offers}){
 const [f,setF]=React.useState({...filters});const filtered=filterProducts(products,query,f,scope,offers);
 return <RModal title="Filter products" onClose={onClose}><form onSubmit={e=>{e.preventDefault();onApply(f)}}><label className="rf-field">Colour<select value={f.colour} onChange={e=>setF(x=>({...x,colour:e.target.value}))}><option value="">Any colour</option>{WS_COLOURS.map(c=><option value={c.id} key={c.id}>{c.label}</option>)}</select></label><label className="rf-field">Maximum price per unit (€)<input type="number" min="0" step="0.01" inputMode="decimal" value={f.maxPrice} placeholder="No maximum" onChange={e=>setF(x=>({...x,maxPrice:e.target.value}))}/></label><div className="rf-modal-actions"><button type="button" className="rf-btn" onClick={()=>setF(x=>({...x,colour:'',maxPrice:''}))}>Reset colour &amp; price</button><button type="submit" className="rf-btn primary">Show {filtered.length} {filtered.length===1?'product':'products'}</button></div></form></RModal>
}
const FILTER_BASE={cat:'all',grower:'',length:'',colour:'',maxPrice:''};
function matchingOffers(p,q,f,offers=RF_OFFERS,delivery=null){return offers.filter(o=>(!delivery||(M.dates().includes(delivery)&&o.availableDate<=delivery&&o.maxQty>=o.minQty))&&o.productId===p.id&&M.search([{...p,grower:o.grower,origin:o.origin,stemCm:o.stemCm}],q).length>0&&(!f.grower||o.grower===f.grower)&&(!f.length||(f.length==='short'?o.stemCm<=45:f.length==='medium'?o.stemCm>45&&o.stemCm<=65:o.stemCm>=66))&&(f.maxPrice===''||o.unitCents<=Number(f.maxPrice)*100));}
function catalogueCategory(p,scope){return scope==='plants'?p.plantGroup:p.cat;}
function filterProducts(products,q,f,scope,offers=RF_OFFERS,delivery=null){return products.filter(p=>(scope!=='flowers'||(p.cat!=='plants'&&p.cat!=='accessories'))&&(scope!=='plants'||p.cat==='plants')&&(f.cat==='all'||catalogueCategory(p,scope)===f.cat)&&(!f.colour||p.colour===f.colour)&&matchingOffers(p,q,f,offers,delivery).length>0)}
// Mock-data grouping only. Production needs server category counts, per-row cursors and virtualization; see DEVELOPER_HANDOFF.md.
function catalogueOfferRows(products,q,filters,scope,offers,sort='featured'){
 const matching=filterProducts(products,q,filters,scope,offers);
 return (scope==='plants'?WS_PLANT_CATS:WS_CATS).filter(category=>category.id!=='all').map(category=>{
  const groups=matching.filter(p=>catalogueCategory(p,scope)===category.id).map(p=>matchingOffers(p,q,filters,offers).map(offer=>({p,offer})));
  let items=[];
  if(sort==='featured'){for(let i=0;i<Math.max(0,...groups.map(group=>group.length));i++)for(const group of groups)if(group[i])items.push(group[i]);}
  else items=groups.flat().sort((a,b)=>sort==='low'?a.offer.unitCents-b.offer.unitCents:sort==='high'?b.offer.unitCents-a.offer.unitCents:a.p.name.localeCompare(b.p.name)||a.offer.unitCents-b.offer.unitCents);
  return {id:category.id,title:category.label,productCount:groups.length,items};
 }).filter(row=>row.items.length>0);
}
function purchaseOrders(orders){return [...orders].sort((a,b)=>(Date.parse(b.placedAt)||0)-(Date.parse(a.placedAt)||0));}
function reorderQuantity(offer,previousQty){
 if(!offer||offer.step<=0)return null;
 const minimum=Math.ceil(offer.minQty/offer.step)*offer.step,maximum=Math.floor(offer.maxQty/offer.step)*offer.step;
 if(maximum<minimum)return null;
 const requested=Number.isSafeInteger(previousQty)&&previousQty>0?previousQty:minimum;
 return Math.min(maximum,Math.max(minimum,Math.ceil(requested/offer.step)*offer.step));
}
// Display-only purchase fixture for reviewing a large wholesale worksheet. Never persisted as account history.
function sampleBulkPurchase(offers,now=new Date()){
 const picks=[['r-rednaomi',600,0],['r-rednaomi',800,2],['r-avalanche',600,0],['r-athena',1200,0],['r-quicksand',600,0],['t-stronggold',2000,0],['t-dynasty',3000,0],['c-bacardi',600,0],['c-anastasia',200,0],['g-intenzz',1800,0],['g-intenzz',1000,1],['p-sarah',100,0],['l-sorbonne',400,0],['s-lisianthus',600,0],['s-ranunculus',100,0],['s-anemone',600,0],['s-hydrangea',80,0],['gr-euc',1500,0],['gr-ruscus',2000,0],['pl-phal',120,0],['pl-kalanchoe',240,0],['pl-phal-pink',160,0],['pl-monstera',80,0],['pl-succulent',320,0]];
 const lines=picks.flatMap(([productId,requested,index])=>{const offer=offers.filter(o=>o.productId===productId)[index],qty=reorderQuantity(offer,requested);return qty===null?[]:[{...offer,qty}];});
 const placed=new Date(now);placed.setDate(placed.getDate()-1);placed.setHours(9,0,0,0);
 return {id:'SAMPLE-BULK-24',name:'Sample bulk purchase',sample:true,placedAt:placed.toISOString(),lines,...M.totals(lines)};
}
function reorderItems(orders,offers){
 const items=new Map();
 for(const order of purchaseOrders(orders)){
  const lines=new Map();
  for(const line of order.lines){const previous=lines.get(line.id);lines.set(line.id,previous?{...previous,qty:previous.qty+line.qty}:{...line});}
  for(const previous of lines.values()){
   if(items.has(previous.id)){items.get(previous.id).orderCount++;continue;}
   const offer=offers.find(o=>o.id===previous.id)||null;
   items.set(previous.id,{id:previous.id,productId:previous.productId,previous,offer,quantity:reorderQuantity(offer,previous.qty),lastOrderedAt:order.placedAt,lastOrderId:order.id,orderCount:1});
  }
 }
 return [...items.values()];
}
function reorderBatch(items,quantities,selected,cart,delivery){
 const ids=[...new Set(selected)];
 if(!ids.length)throw Error('Select at least one product.');
 if(!M.dates().includes(delivery))throw Error('Choose a valid departure date.');
 return ids.map(id=>{
  const item=items.find(item=>item.id===id),offer=item?.offer;
  if(!offer)throw Error('A selected grower offer is no longer available.');
  const qty=quantities[id]??item.quantity,issue=M.qtyError(offer,qty);
  if(issue)throw Error(offer.name+': '+issue);
  if(offer.availableDate>delivery)throw Error(offer.name+' needs a later departure date.');
  const inCart=cart.find(line=>line.id===id);
  if(inCart&&inCart.unitCents!==offer.unitCents)throw Error(offer.name+': review the changed price in your basket before adding more.');
  const combined=(inCart?.qty||0)+qty,stockIssue=M.qtyError(offer,combined);
  if(stockIssue)throw Error(offer.name+': '+stockIssue);
  return {...offer,qty};
 });
}
const purchaseDate=value=>{const date=new Date(value);return Number.isNaN(date.getTime())?'Date unavailable':date.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});};
function RBuyAgain({orders,sampleOrder=null,offers,cart,delivery,quantities,onQuantity,selected,onSelect,query,onQuery,tab,onTab,sort,onSort,onReview,onOpen,onAddMany,onDate,onBrowse,onOrder,onBasket,departureControl}){
 const [error,setError]=React.useState(''),[invalidQuantities,setInvalidQuantities]=React.useState({});
 const history=purchaseOrders(sampleOrder?[sampleOrder,...orders.filter(order=>order.id!==sampleOrder.id)]:orders),latest=history[0],items=reorderItems(history,offers);
 const quantity=item=>quantities[item.id]??item.quantity;
 const capacity=item=>item.offer?Math.max(0,item.offer.maxQty-(cart.find(line=>line.id===item.id)?.qty||0)):0;
 const ready=item=>item.offer&&M.dates().includes(delivery)&&item.offer.availableDate<=delivery;
 const selectable=item=>item.quantity!==null&&ready(item)&&capacity(item)>=item.offer.minQty;
 const valid=item=>selectable(item)&&!invalidQuantities[item.id]&&(!cart.some(line=>line.id===item.id&&line.unitCents!==item.offer.unitCents))&&!M.qtyError(item.offer,quantity(item))&&quantity(item)<=capacity(item);
 const products=items.filter(item=>M.search([{...prod(item.productId),...item.previous,...item.offer}],query).length).sort((a,b)=>sort==='frequent'?b.orderCount-a.orderCount:sort==='name'?a.previous.name.localeCompare(b.previous.name):0);
 const matchingOrders=history.filter(order=>[order.id,...order.lines.flatMap(line=>[line.name,line.grower])].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
 const selectedItems=items.filter(item=>selected.includes(item.id)),visibleChoices=products.filter(selectable),allChecked=visibleChoices.length>0&&visibleChoices.every(item=>selected.includes(item.id));
 const selectedTotal=selectedItems.reduce((sum,item)=>sum+(item.offer?.unitCents||0)*(quantity(item)||0),0),hiddenCount=selectedItems.filter(item=>!products.some(p=>p.id===item.id)).length;

 function selectOne(id,checked){setError('');onSelect(checked?[...new Set([...selected,id])]:selected.filter(value=>value!==id));}
 function nextQuantity(){const fields=[...document.querySelectorAll('.rf-rebuy-table input[type="number"]')],index=fields.indexOf(document.activeElement);if(index>=0&&index<fields.length-1)fields[index+1].focus();}
 function addSelected(){try{onAddMany(reorderBatch(items,quantities,selected,cart,delivery));onSelect([])}catch(e){setError(e.message)}}
 return <div className="rf-rebuy">
  <div className="rf-rebuy-heading"><div><h1 tabIndex="-1">Buy again</h1><p>Enter quantities, select your products and add them together.</p></div>{latest&&<div className="rf-rebuy-heading-actions"><button className="rf-btn" onClick={()=>{onTab(tab==='orders'?'products':'orders');setError('')}}>{tab==='orders'?'Back to products':'Previous orders ('+history.length+')'}</button>{departureControl}</div>}</div>
  {!latest?<div className="rf-rebuy-empty"><RReorderMark/><h2>Your next order will be easier</h2><p>Once you’ve placed an order, find your products and quantities here.</p><button className="rf-btn dark" onClick={()=>onBrowse({scope:'flowers'})}>Find flowers <RControlIcon name="next"/></button></div>:<>
   {tab==='products'&&<div className="rf-rebuy-last"><span>{latest.sample?'Sample bulk order':'Last order'} <strong>{purchaseDate(latest.placedAt)}</strong></span><span>{latest.lines.length} product {latest.lines.length===1?'line':'lines'}</span><span>Previous subtotal <strong>{money(M.totals(latest.lines).subtotalCents)}</strong> excl. VAT</span><button className="rf-btn primary" disabled={!latest.lines.length} onClick={()=>onReview(latest)}>{latest.sample?'Review sample order':'Reorder last order'} <RControlIcon name="next"/></button></div>}
   <section className="rf-rebuy-purchases" aria-labelledby="rebuy-list-title"><div className="rf-rebuy-list-heading"><div><h2 id="rebuy-list-title">{tab==='products'?'Previously purchased products':'Previous orders'}</h2><p>{tab==='products'?'Previous quantities are prefilled. Prices are current and exclude VAT.':'Review current offers before adding an earlier order.'}</p></div><div className="rf-rebuy-tools"><label className="rf-rebuy-search">{WI.search({'aria-hidden':true})}<span className="sr-only">{tab==='products'?'Search purchased products':'Search previous orders'}</span><input value={query} onChange={e=>onQuery(e.target.value)} placeholder={tab==='products'?'Search product or grower':'Search order or product'}/>{query&&<button aria-label="Clear repeat order search" onClick={()=>onQuery('')}><RControlIcon name="close"/></button>}</label>{tab==='products'&&<label className="rf-rebuy-sort"><span className="sr-only">Sort purchased products</span><select value={sort} onChange={e=>onSort(e.target.value)}><option value="recent">Most recently bought</option><option value="frequent">Most often bought</option><option value="name">Name: A–Z</option></select></label>}</div></div>
    {tab==='products'&&products.length>0&&<div className="rf-rebuy-table-wrap" tabIndex="0" role="region" aria-label="Purchased products worksheet"><table className="rf-rebuy-table"><caption className="sr-only">Reorder worksheet. Enter quantities and press Enter to move to the next product. Select rows to add several products together.</caption><thead><tr><th scope="col"><input type="checkbox" aria-label="Select all available products" checked={allChecked} disabled={!visibleChoices.length} ref={input=>{if(input)input.indeterminate=!allChecked&&visibleChoices.some(item=>selected.includes(item.id))}} onChange={e=>{const ids=visibleChoices.map(item=>item.id);onSelect(e.target.checked?[...new Set([...selected,...ids])]:selected.filter(id=>!ids.includes(id)))}}/></th><th scope="col">Product</th><th scope="col">Grower</th><th scope="col">Size</th><th scope="col">Quality</th><th scope="col">Colour</th><th scope="col">Last quantity</th><th scope="col">Current price</th><th scope="col">Quantity to add</th><th scope="col">Line total</th><th scope="col">Availability</th></tr></thead><tbody>{products.map(item=>{
     const {previous,offer}=item,p=prod(item.productId),display=offer||previous,stocked=item.quantity!==null,qty=quantity(item),inCart=cart.find(line=>line.id===item.id)?.qty||0,remaining=capacity(item),isSelected=selected.includes(item.id),colour=WS_COLOURS.find(c=>c.id===p?.colour),open=()=>p&&onOpen(p,null,offer?.id||null,qty);
     const canSelectRow=selectable(item)||isSelected;
     return <tr key={item.id} aria-selected={isSelected} className={(canSelectRow?'rf-selectable-row ':'')+(isSelected?'selected ':'')+(isSelected&&!valid(item)?'needs-review':'')} onClick={canSelectRow?e=>{if(e.defaultPrevented||e.target.closest('button,input,select,textarea,a,label,[role="button"],[role="link"],[contenteditable="true"]'))return;selectOne(item.id,!isSelected);}:undefined}>
      <td><input type="checkbox" aria-label={'Select '+previous.name+' from '+previous.grower} checked={isSelected} disabled={!selectable(item)&&!isSelected} onChange={e=>selectOne(item.id,e.target.checked)}/></td>
      <td><div className="rf-rebuy-product"><button className="rf-rebuy-photo" disabled={!p} onClick={open} aria-label={'View '+previous.name+' from '+previous.grower}><RPhoto p={p||previous}/></button><div><button className="rf-name" disabled={!p} onClick={open}>{previous.name}</button><small>{display.origin}</small></div></div></td>
      <td>{p?<button className="rf-rebuy-grower" onClick={open} aria-label={'Compare growers for '+previous.name+' from '+previous.grower}>{display.grower}<RControlIcon name="next"/></button>:display.grower}</td>
      <td>{display.stemCm} cm{display.potCm&&<small>Pot Ø {display.potCm} cm</small>}</td><td>{display.grade}</td><td><span className="rf-rebuy-colour">{colour&&<i className={'rf-colour-dot '+(colour.hex==='mixed'?'mixed':'')} style={colour.hex!=='mixed'?{background:colour.hex}:undefined}/>} {colour?.label||'—'}</span></td>
      <td><strong>{units(previous,previous.qty)}</strong><small>{purchaseDate(item.lastOrderedAt)}</small></td>
      <td>{offer?<><strong>{money(offer.unitCents)}<span className="rf-rebuy-per-unit"> / {offer.unit}</span></strong>{offer.unitCents!==previous.unitCents&&<small className="rf-rebuy-price-change">Was {money(previous.unitCents)}</small>}</>:<span>—</span>}</td>
      <td>{stocked?<><RQuantity offer={offer} value={qty} onChange={n=>{if(n!==qty){onQuantity(item.id,n);if(selectable(item))selectOne(item.id,true)}setError('')}} label={previous.name+' from '+previous.grower} onConfirm={nextQuantity} selectOnFocus retainInvalid onValidityChange={valid=>setInvalidQuantities(values=>!!values[item.id]===!valid?values:{...values,[item.id]:!valid})}/><small>Min. {offer.minQty} · multiples of {offer.step}</small>{qty>remaining&&remaining>=offer.minQty?<small className="rf-rebuy-adjustment">Up to {units(offer,remaining)} more</small>:item.quantity!==previous.qty&&<small className="rf-rebuy-adjustment">Adjusted for stock / pack size</small>}</>:<span>—</span>}</td>
      <td><strong>{stocked?money(offer.unitCents*qty):'—'}</strong></td>
      <td><div className="rf-rebuy-status">{!stocked?<><span className="later">Offer unavailable</span><button className="rf-textbtn" onClick={()=>onBrowse({scope:previous.unit==='plant'?'plants':'flowers',filters:{cat:previous.unit==='plant'?p?.plantGroup||'all':p?.cat||'all'}})}>Find alternatives</button></>:inCart>0&&cart.find(line=>line.id===item.id).unitCents!==offer.unitCents?<><span className="later">Price changed in basket</span><button className="rf-textbtn" onClick={onBasket}>Review price</button></>:remaining<offer.minQty&&inCart>0?<><span>{units(display,inCart)} in basket</span><button className="rf-textbtn" onClick={onBasket}>View basket</button></>:!ready(item)?<><span className="later">From {dayLabel(offer.availableDate)}</span><button className="rf-textbtn" onClick={onDate}>Change date</button></>:<><span className="ready">✓ Available</span>{inCart>0&&<small>{units(display,inCart)} in basket</small>}</>}</div></td>
     </tr>;
    })}</tbody></table></div>}
    {tab==='products'&&items.length>0&&<div className="rf-rebuy-bulk" role="group" aria-label="Selected products"><div><strong>{selectedItems.length} {selectedItems.length===1?'line':'lines'} selected</strong><span>{selectedItems.length?'Edit quantities directly. Press Enter for the next row.':'Click a row or enter quantities to select products.'}</span>{hiddenCount>0&&<button className="rf-textbtn" onClick={()=>onQuery('')}>{hiddenCount} selected {hiddenCount===1?'line is':'lines are'} hidden by search · Clear search</button>}{selectedItems.length>0&&<button className="rf-textbtn" onClick={()=>{onSelect([]);setError('')}}>Clear selection</button>}</div><div className="rf-rebuy-bulk-total"><span>Selected subtotal · excl. VAT</span><strong>{money(selectedTotal)}</strong></div><button className="rf-btn primary" disabled={!selectedItems.length||selectedItems.some(item=>!valid(item))} onClick={addSelected}>Add selected to basket <RControlIcon name="plus"/></button>{error&&<p className="rf-error" role="alert">{error}</p>}{selectedItems.some(item=>!valid(item))&&<p className="rf-error" role="status">Check the highlighted rows before adding.</p>}</div>}
    {tab==='orders'&&matchingOrders.length>0&&<ROrdersTable orders={matchingOrders} previous onReview={onReview} onOpen={order=>onOrder(order.id)}/>}
    {!(tab==='products'?products:matchingOrders).length&&<div className="rf-rebuy-no-results"><h3>{query?'No matches for “'+query+'”':'No products to reorder yet'}</h3><p>{query?(tab==='products'?'Try a product name or grower.':'Try a product name, grower or order number.'):'Your purchased products will appear here after an order.'}</p>{query&&<button className="rf-btn" onClick={()=>onQuery('')}>Clear search</button>}</div>}
   </section>
  </>}
 </div>;
}
function reorderReviewLines(source,offers,cart=[]){return source.lines.flatMap(previous=>{
 const offer=offers.find(o=>o.id===previous.id);if(!offer)return[];
 const maxForAdd=Math.max(0,offer.maxQty-(cart.find(line=>line.id===offer.id)?.qty||0)),qty=reorderQuantity({...offer,maxQty:maxForAdd},previous.qty);
 return qty===null?[]:[{...offer,qty,maxForAdd,previousCents:previous.unitCents,previousQty:previous.qty}];
});}
function importReviewBatch(lines,offers,cart,delivery){
 const items=lines.map(line=>{const offer=offers.find(offer=>offer.id===line.id);if(offer&&offer.unitCents!==line.unitCents)throw Error(line.name+': the price changed while reviewing. Close and reopen this review.');return {id:line.id,offer,quantity:line.qty};});
 return reorderBatch(items,{},items.map(item=>item.id),cart,delivery);
}
function RImport({source,offers,cart=[],delivery,onClose,onImport}){
 const [lines,setLines]=React.useState(()=>reorderReviewLines(source,offers,cart)),[removed,setRemoved]=React.useState([]),[invalid,setInvalid]=React.useState({}),[error,setError]=React.useState('');
 const original=reorderReviewLines(source,offers,cart),excluded=source.lines.filter(previous=>!original.some(line=>line.id===previous.id));
 const priceChanges=lines.filter(line=>line.unitCents!==line.previousCents).length,quantityChanges=lines.filter(line=>line.qty!==line.previousQty).length;
 const issues=new Map(lines.map(line=>{try{importReviewBatch([line],offers,cart,delivery);return [line.id,'']}catch(e){return [line.id,e.message]}})),invalidCount=lines.filter(line=>invalid[line.id]||issues.get(line.id)).length;
 const quantities=Object.entries(lines.reduce((sum,line)=>({...sum,[line.unit]:(sum[line.unit]||0)+line.qty}),{})).map(([unit,qty])=>units({unit},qty)).join(' · ');
 function nextQuantity(){const fields=[...document.querySelectorAll('.rf-import-table input[type="number"]')],index=fields.indexOf(document.activeElement);if(index>=0&&index<fields.length-1)fields[index+1].focus();}
 function remove(line){setLines(current=>current.filter(item=>item.id!==line.id));setRemoved(current=>[line,...current]);setInvalid(current=>({...current,[line.id]:false}));setError('')}
 function undo(){const line=removed[0];if(!line)return;setLines(current=>[...current,line].sort((a,b)=>source.lines.findIndex(item=>item.id===a.id)-source.lines.findIndex(item=>item.id===b.id)));setRemoved(current=>current.slice(1));setError('')}
 function submit(){try{if(invalidCount)throw Error('Check the highlighted quantities and offers.');onImport(importReviewBatch(lines,offers,cart,delivery))}catch(e){setError(e.message)}}
 return <RModal title="Review your reorder" onClose={onClose} wide className={'rf-import-modal'+(source.lines.length>8?' rf-import-large':'')} style={{'--rf-import-rows':source.lines.length}}>
  <div className="rf-import-context"><div><strong>{source.sample?'Sample bulk order':source.name||source.id||'Saved order'}</strong><span>{lines.length} {lines.length===1?'line':'lines'} to add · Departure {dayLabel(delivery)}</span></div><p>Edit quantities below. Prices are current and exclude VAT.</p></div>
  {(quantityChanges>0||priceChanges>0||removed.length>0||excluded.length>0)&&<div className="rf-import-notices" role="status">{quantityChanges>0&&<span className="changed">{quantityChanges} {quantityChanges===1?'quantity differs':'quantities differ'} from the previous order</span>}{priceChanges>0&&<span className="changed">{priceChanges} {priceChanges===1?'price has':'prices have'} changed</span>}{removed.length>0&&<span>{removed.length} {removed.length===1?'line':'lines'} removed <button className="rf-textbtn" onClick={undo}>Undo last removal</button></span>}{excluded.length>0&&<details><summary>{excluded.length} unavailable {excluded.length===1?'line':'lines'} excluded</summary><ul>{excluded.map(line=><li key={line.id}>{line.name} · {line.grower}</li>)}</ul></details>}</div>}
  {lines.length>0?<div className="rf-import-table-wrap" tabIndex="0" role="region" aria-label="Order review worksheet"><table className="rf-import-table"><caption className="sr-only">Current grower offers to add. Edit quantities directly and press Enter for the next row.</caption><thead><tr><th scope="col">Product</th><th scope="col">Grower</th><th scope="col">Size</th><th scope="col">Quality</th><th scope="col">Current price</th><th scope="col">Quantity to add</th><th scope="col">Line total</th><th scope="col"><span className="sr-only">Remove</span></th></tr></thead><tbody>{lines.map(line=>{
   const product=prod(line.productId),colour=WS_COLOURS.find(colour=>colour.id===product?.colour),issue=issues.get(line.id),hasError=!!invalid[line.id]||!!issue,quantityChanged=line.qty!==line.previousQty;
   return <tr key={line.id} className={hasError?'invalid':quantityChanged||line.unitCents!==line.previousCents?'changed':''}>
    <td><div className="rf-import-product"><span className="rf-import-photo"><RPhoto p={product||line}/></span><div><strong>{line.name}</strong><small>{line.origin}{colour&&<> · {colour.label}</>}</small></div></div>{issue&&<span className="rf-import-issue">{issue}</span>}</td>
    <td>{line.grower}</td><td>{line.stemCm} cm{line.potCm&&<small>Pot Ø {line.potCm} cm</small>}</td><td>{line.grade}</td>
    <td><strong>{money(line.unitCents)} <span>/ {line.unit}</span></strong>{line.unitCents!==line.previousCents&&<small className="rf-import-change">Was {money(line.previousCents)}</small>}</td>
    <td><RQuantity offer={{...line,maxQty:line.maxForAdd}} value={line.qty} onChange={qty=>{setLines(current=>M.setQty(current,line,qty));setError('')}} label={line.name+' from '+line.grower+' to add'} onConfirm={nextQuantity} selectOnFocus retainInvalid onValidityChange={valid=>setInvalid(current=>!!current[line.id]===!valid?current:{...current,[line.id]:!valid})}/><small>Min. {line.minQty} · multiples of {line.step}</small>{quantityChanged&&<small className="rf-import-change">Previously {units(line,line.previousQty)}</small>}</td>
    <td><strong>{money(line.unitCents*line.qty)}</strong></td><td><button className="rf-import-remove" aria-label={'Remove '+line.name+' from '+line.grower+' from review'} title="Remove from this reorder" onClick={()=>remove(line)}>{WI.trash({'aria-hidden':true})}</button></td>
   </tr>;
  })}</tbody></table></div>:<div className="rf-import-empty"><h3>No lines to add</h3><p>{removed.length?'Restore a removed line or close this review.':'These offers have no remaining stock. Close this review to choose alternatives.'}</p>{removed.length>0&&<button className="rf-btn" onClick={undo}>Restore last removed line</button>}</div>}
  <div className="rf-import-footer">{(error||invalidCount>0)&&<p className="rf-error" role="alert">{error||'Check the highlighted quantities and offers before adding.'}</p>}<div className="rf-import-count"><strong>{lines.length} product {lines.length===1?'line':'lines'}</strong><span>{quantities||'Nothing selected'}</span></div><div className="rf-import-total"><span>Subtotal to add · excl. VAT</span><strong>{money(M.totals(lines).subtotalCents)}</strong></div><div className="rf-import-actions"><button className="rf-btn" onClick={onClose}>Cancel</button><button className="rf-btn primary" disabled={!lines.length||invalidCount>0} onClick={submit}>Add {lines.length} {lines.length===1?'line':'lines'} to basket <RControlIcon name="plus"/></button></div></div>
 </RModal>;
}
function RDraft({draft,onSave,onClose,onImport}){
 const [d,setD]=React.useState(M.clone(draft));return <RModal title="Edit saved order" onClose={onClose} wide className="rf-draft-modal">
  <label className="rf-field">Order name<input value={d.name} maxLength={70} onChange={e=>setD(x=>({...x,name:e.target.value}))}/></label>
  {d.lines.length?<RProductLinesTable lines={d.lines} subtotalCents={M.totals(d.lines).subtotalCents} caption={'Products in saved order '+d.name+'. Saved prices exclude VAT.'} regionLabel="Saved order product details" editable onQty={(l,n)=>setD(x=>({...x,lines:M.setQty(x.lines,l,n)}))} onRemove={id=>setD(x=>({...x,lines:x.lines.filter(l=>l.id!==id)}))}/>:<p>This saved order is empty. Add products to your basket, then save it again.</p>}
  <p className="rf-fine">Saved prices are a reference. Current prices and availability are shown before items are added to your basket.</p>
  <div className="rf-modal-actions"><button className="rf-btn" disabled={!d.name.trim()} onClick={()=>onSave(d)}>Save changes</button><button className="rf-btn primary" disabled={!d.lines.length||!d.name.trim()} onClick={()=>{onSave(d);onImport(d)}}>Review for basket</button></div>
 </RModal>;
}
function ROverviewTable({caption,regionLabel,children}){return <div className="rf-ordered-table-wrap rf-overview-wrap" role="region" aria-label={regionLabel} tabIndex="0"><table className="rf-ordered-table rf-overview-table"><caption className="sr-only">{caption}</caption>{children}</table></div>;}
function ROrdersTable({orders,onOpen,onReview,previous=false,billing=false}){return <ROverviewTable regionLabel={previous?'Previous orders overview':billing?'Billing history':'Order history'} caption={previous?'Previous orders. Subtotals exclude VAT and shipping.':'Orders. Totals exclude VAT and include shipping.'}>
 <thead><tr><th scope="col">Order</th><th scope="col">Placed</th>{previous?<th scope="col">Products</th>:billing?<th scope="col">Payment</th>:<th scope="col">Departure</th>}{!billing&&<th scope="col" className="numeric">Lines</th>}{!previous&&<th scope="col">Status</th>}<th scope="col" className="numeric">{previous?'Previous subtotal':'Order total'}<small>{previous?'excl. VAT · excl. shipping':'excl. VAT · incl. shipping'}</small></th><th scope="col">Actions</th></tr></thead>
 <tbody>{orders.map(order=>{const names=[...new Set(order.lines.map(line=>line.name))].join(' · ');return <tr key={order.id}>
  <th scope="row">{order.sample?<><strong>Sample bulk order</strong><small>{order.id}</small></>:<button type="button" className="rf-name" onClick={()=>onOpen(order)} aria-label={'View order '+order.id}>{order.id}</button>}</th>
  <td>{purchaseDate(order.placedAt)}</td>
  {previous?<td className="rf-overview-products"><span title={names}>{names||'No products'}</span></td>:billing?<td>{order.payment==='balance'?'Account balance':'Bank transfer'}</td>:<td>{dayLabel(order.delivery)}</td>}
  {!billing&&<td className="numeric">{order.lines.length}</td>}
  {!previous&&<td><span className={'rf-status '+(order.status==='confirmed'?'ok':'')}>{order.status==='confirmed'?(billing?'Paid':'Confirmed'):'Awaiting payment'}</span></td>}
  <td className="numeric"><strong>{money(previous?(order.subtotalCents??M.totals(order.lines).subtotalCents):order.totalCents)}</strong></td>
  <td><div className="rf-overview-actions rf-order-table-actions">{onReview&&<button type="button" className="rf-btn primary" disabled={!order.lines.length} onClick={()=>onReview(order)} aria-label={(previous?'Review and reorder ':'Buy again ')+order.id}><RControlIcon name="repeat"/>{previous?'Review & reorder':'Buy again'}</button>}{!order.sample&&<button type="button" className="rf-btn rf-order-view-button" onClick={()=>onOpen(order)} aria-label={'View details for '+order.id}>View order<RControlIcon name="next"/></button>}</div></td>
 </tr>})}</tbody>
 </ROverviewTable>;}
function RSavedOrders({drafts,canSave,onSave,onEdit,onReview,onDelete}){
 return <section className="rf-drafts rf-saved-orders" aria-labelledby="saved-orders-heading">
  <div className="rf-saved-orders-head"><div><h2 id="saved-orders-heading">Saved orders <span>{drafts.length}</span></h2><p>Your regular orders, ready for another round.</p></div>{canSave&&<button className="rf-btn" onClick={onSave}><RControlIcon name="plus"/>Save current basket</button>}</div>
  {drafts.length?<ROverviewTable regionLabel="Saved orders overview" caption="Saved orders. Saved subtotals exclude VAT and shipping.">
   <thead><tr><th scope="col">Order name</th><th scope="col">Products</th><th scope="col" className="numeric">Lines</th><th scope="col" className="numeric">Saved subtotal<small>excl. VAT · excl. shipping</small></th><th scope="col">Actions</th></tr></thead>
   <tbody>{drafts.map(d=>{const names=[...new Set(d.lines.map(line=>line.name))].join(' · ');return <tr key={d.id}>
    <th scope="row"><button type="button" className="rf-name" onClick={()=>onEdit(d)}>{d.name}</button></th><td className="rf-overview-products"><span title={names}>{names||'No products yet'}</span></td><td className="numeric">{d.lines.length}</td><td className="numeric"><strong>{money(M.totals(d.lines).subtotalCents)}</strong></td>
    <td><div className="rf-overview-actions"><button type="button" className="rf-btn primary" disabled={!d.lines.length} onClick={()=>onReview(d)} aria-label={'Review and reorder '+d.name}>Review &amp; reorder <RControlIcon name="next"/></button><button type="button" className="rf-textbtn" onClick={()=>onEdit(d)} aria-label={'Edit saved order '+d.name}>Edit</button><button type="button" className="rf-textbtn rf-danger-action" onClick={()=>onDelete(d)} aria-label={'Delete saved order '+d.name}>Delete</button></div></td>
   </tr>})}</tbody>
  </ROverviewTable>:<div className="rf-saved-orders-empty"><span>{WI.box({'aria-hidden':true})}</span><div><h3>Keep your regular orders here</h3><p>Save a basket once, then review and reorder it whenever you need.</p></div></div>}
 </section>;
}
function featuredOffer(productId,offers,delivery){
 const choices=offers.filter(o=>o.productId===productId&&o.maxQty>=o.minQty);
 const ready=choices.filter(o=>M.dates().includes(delivery)&&o.availableDate<=delivery);
 return [...(ready.length?ready:choices)].sort((a,b)=>a.unitCents-b.unitCents)[0]||null;
}
function RMarketOffer({p,offer,state,onOpen,onAdd,onSave,onDate,tag,note,compact=false}){
 const inCart=state.cart.find(l=>l.id===offer.id)?.qty||0;
 const quantity=Math.max(offer.minQty,offer.lot),ready=M.dates().includes(state.delivery)&&offer.availableDate<=state.delivery;
 const canAdd=ready&&!M.qtyError(offer,quantity)&&quantity+inCart<=offer.maxQty;
 const colour=WS_COLOURS.find(c=>c.id===p.colour);
 return <article className={'rf-feature-offer'+(compact?' rf-compact-offer':'')} aria-label={p.name+' featured offer'}>
  <div className="rf-feature-image"><button onClick={()=>onOpen(p,null,offer.id,quantity)} aria-label={'Explore '+p.name}><RPhoto p={p}/></button>{tag&&<span className="rf-feature-tag">{tag}</span>}<button className={'rf-icon rf-heart '+(state.saved.includes(p.id)?'on':'')} aria-label={(state.saved.includes(p.id)?'Unsave ':'Save ')+p.name} aria-pressed={state.saved.includes(p.id)} onClick={()=>onSave(p.id)}>{WI.heart({})}</button>{compact&&inCart>0&&<span className="rf-market-basket-badge">✓ {units(offer,inCart)} in basket</span>}</div>
  <div className="rf-feature-body">
   <div className="rf-feature-name"><button className="rf-name" onClick={()=>onOpen(p,null,offer.id,quantity)}>{p.name}</button>{!compact&&<span>{offer.stemCm} cm</span>}</div>
   {note&&<p className="rf-recommendation-note">{note}</p>}
   <p className="rf-feature-grower">{offer.grower} · {!compact&&<>{offer.grade} · </>}{offer.origin}</p>
   {compact&&<dl className="rf-market-card-specs"><div><dt>{p.cat==='plants'?'Height':'Length'}</dt><dd>{offer.stemCm} cm{p.cat==='plants'&&offer.potCm&&<small>Pot Ø {offer.potCm} cm</small>}</dd></div><div><dt>Quality</dt><dd>{offer.grade}</dd></div><div><dt>Colour</dt><dd><span className={'rf-colour-dot '+(p.colour==='mixed'?'mixed':'')} style={{background:colour?.hex}} aria-hidden="true"/>{colour?.label||p.colour}</dd></div></dl>}
   {compact?<div className="rf-market-card-trade"><div className="rf-market-unit-price"><strong>{money(offer.unitCents)}</strong><span>per {offer.unit} · excl. VAT</span></div><button className="rf-market-card-compare" onClick={()=>onOpen(p,null,offer.id,quantity)} aria-label={'Compare grower offers for '+p.name}>Compare growers</button></div>:<div className="rf-feature-price"><strong>{money(offer.unitCents)}</strong><span>/ {offer.unit}<small>excl. VAT</small></span><button onClick={()=>onOpen(p,null,offer.id,quantity)} className="rf-textbtn">Compare offers</button></div>}
   <div className="rf-feature-delivery">{ready?'Departure '+dayLabel(state.delivery):'Departs from '+dayLabel(offer.availableDate)}{!compact&&inCart>0&&<span> · {units(offer,inCart)} in basket</span>}</div>
   <button className={'rf-btn '+(ready?'primary':'')} disabled={ready&&!canAdd} onClick={()=>ready?onAdd(offer,quantity):onDate()} aria-label={ready?'Add '+units(offer,quantity)+' of '+p.name:'Change departure for '+p.name}>{ready?(canAdd?<><span>Add {units(offer,quantity)}</span><strong>{money(offer.unitCents*quantity)}</strong></>:'Stock limit reached'):'Choose departure date'}</button>
  </div>
 </article>;
}
// A small discovery gesture, once per row per page load, never an automatic carousel advance.
const RF_HINTED_RAILS=new Set();
function setupRailSwipeHint(el,key,onStart,onEnd){
 const media=matchMedia('(prefers-reduced-motion: reduce)'),row=el.closest('section');
 if(RF_HINTED_RAILS.has(key)||media.matches||el.scrollWidth<=el.clientWidth+2||el.scrollLeft>2)return()=>{};
 let frame=0,delay=0,playing=false,disposed=false;
 function stop(restore=false){
  clearTimeout(delay);delay=0;cancelAnimationFrame(frame);frame=0;
  if(!playing)return;
  if(restore)el.scrollLeft=0;
  playing=false;observer.disconnect();el.classList.remove('rf-swipe-hint');onEnd();
 }
 function begin(){
  delay=0;
  if(disposed||RF_HINTED_RAILS.has(key)||media.matches||document.hidden||el.scrollLeft>2||row.contains(document.activeElement))return;
  const distance=Math.min(88,(el.firstElementChild?.getBoundingClientRect().width||240)*.3,el.scrollWidth-el.clientWidth);
  if(distance<=2)return;
  RF_HINTED_RAILS.add(key);playing=true;onStart();el.classList.add('rf-swipe-hint');
  let start;
  const ease=t=>t*t*(3-2*t);
  function tick(now){
   if(!playing)return;
   if(start===undefined)start=now;
   const t=Math.min(1,(now-start)/1250),progress=t<.4?ease(t/.4):t<.56?1:1-ease((t-.56)/.44);
   el.scrollLeft=distance*progress;
   if(t<1)frame=requestAnimationFrame(tick);else stop(true);
  }
  frame=requestAnimationFrame(tick);
 }
 function interact(e){
  if(e.type==='wheel'&&!e.shiftKey&&Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;
  RF_HINTED_RAILS.add(key);observer.disconnect();stop();
 }
 function visibility(){if(document.hidden)stop(true);}
 function motionChanged(){if(media.matches){observer.disconnect();stop(true);}}
 const observer=new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.65)){
   if(!delay&&!playing)delay=setTimeout(begin,250);
  }else stop(true);
 },{threshold:[0,.65],rootMargin:'-100px 0px -90px 0px'});
 const events=['pointerdown','touchstart','wheel','keydown','focusin'];
 events.forEach(type=>row.addEventListener(type,interact,{capture:true,passive:true}));
 document.addEventListener('visibilitychange',visibility);media.addEventListener('change',motionChanged);observer.observe(el);
 return()=>{disposed=true;observer.disconnect();stop(true);events.forEach(type=>row.removeEventListener(type,interact,true));document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',motionChanged);};
}
function RMarketRail({id,title,eyebrow,intro,items,browseLabel,onBrowse,className='',trackClassName='',itemLabel='products',renderItem,positionStore,positionKey,...cardProps}){
 const track=React.useRef(null),hinting=React.useRef(false),[edges,setEdges]=React.useState({previous:false,next:items.length>6});
 function updateEdges(){const el=track.current;if(!el||hinting.current)return;const previous=el.scrollLeft>2,next=el.scrollLeft+el.clientWidth<el.scrollWidth-2;setEdges(old=>old.previous===previous&&old.next===next?old:{previous,next});}
 React.useEffect(()=>{const el=track.current;if(!el)return;if(positionStore)el.scrollLeft=positionStore.current[positionKey]||0;updateEdges();const observer=new ResizeObserver(updateEdges);observer.observe(el);return()=>observer.disconnect()},[items.length,positionKey]);
 React.useEffect(()=>setupRailSwipeHint(track.current,id,()=>{hinting.current=true},()=>{hinting.current=false;updateEdges()}),[id,items.length,positionKey]);
 function scrolled(){if(hinting.current)return;if(positionStore)positionStore.current[positionKey]=track.current.scrollLeft;updateEdges();}
 function move(direction){const el=track.current,first=el?.firstElementChild;if(!first)return;const gap=parseFloat(getComputedStyle(el).columnGap)||0,step=first.getBoundingClientRect().width+gap;el.scrollBy({left:direction*step*Math.max(1,Math.floor((el.clientWidth+gap)/step)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 function keyboard(e){if(e.target!==e.currentTarget)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}else if(e.key==='Home'||e.key==='End'){e.preventDefault();track.current.scrollTo({left:e.key==='Home'?0:track.current.scrollWidth,behavior:'instant'})}}
 return <section className={'rf-market-section rf-market-rail '+className} aria-labelledby={id+'-title'}><div className="rf-market-section-head"><div>{eyebrow&&<span className="rf-market-eyebrow">{eyebrow}</span>}<h2 id={id+'-title'}>{title}</h2>{intro&&<p className="rf-recommendation-intro">{intro}</p>}</div><div className="rf-market-rail-tools">{onBrowse&&<button className="rf-textbtn" onClick={onBrowse}>{browseLabel} <RControlIcon name="next"/></button>}{(edges.previous||edges.next)&&<div className="rf-market-rail-arrows"><button className="rf-rail-arrow" disabled={!edges.previous} onClick={()=>move(-1)} aria-label={'Previous '+title.toLowerCase()} aria-controls={id+'-track'}><RControlIcon name="back"/></button><button className="rf-rail-arrow" disabled={!edges.next} onClick={()=>move(1)} aria-label={'Next '+title.toLowerCase()} aria-controls={id+'-track'}><RControlIcon name="next"/></button></div>}</div></div><div id={id+'-track'} ref={track} className={'rf-market-track '+trackClassName} role="group" aria-roledescription="carousel" aria-label={title+' · '+items.length+' '+itemLabel} tabIndex="0" onScroll={scrolled} onKeyDown={keyboard}>{items.map(item=>renderItem?renderItem(item):<RMarketOffer key={item.offer.id} {...item} compact {...cardProps}/>)}</div></section>;
}
// Category selection is based on RFH clock + direct sales volumes (2023), published by AIPH in 2024.
// These are representative catalogue products, not a ranking of individual cultivars or PP Flowers sales.
const RF_MARKET_FLOWERS=[
 {id:'roses',productId:'r-rednaomi',name:'Roses',grower:'Porta Nova',copy:'Classic red, soft pink and white roses for bouquets and arrangements.'},
 {id:'tulips',productId:'t-stronggold',name:'Tulips',grower:'Maxima Kwekerij',copy:'Single and double tulips in bright colours and softer shades.'},
 {id:'chrys',productId:'c-bacardi',name:'Chrysanthemums',grower:'Deliflor',copy:'Spray and single-head flowers to build a full, colourful bouquet.'},
 {id:'gerbera',productId:'g-intenzz',name:'Gerberas',grower:'Schreurs',copy:'Bright gerberas and mini germini for a fresh pop of colour.'}
];
// Editorial recommendations use the existing catalogue; they are not personal or sales rankings.
const RF_POPULAR_PICKS=['r-rednaomi','t-stronggold','c-bacardi','g-intenzz','r-avalanche','r-athena','t-dynasty','r-quicksand','c-anastasia','l-sorbonne'].map(productId=>({productId}));
// Mock merchandising selection only; production best sellers must come from verified sales data.
const RF_BESTSELLER_PICKS=['r-rednaomi','r-avalanche','t-stronggold','c-bacardi','g-intenzz','r-quicksand','l-sorbonne','gr-euc'].map(productId=>({productId,tag:'Best seller'}));
const RF_BOUQUET_PICKS=[
 {productId:'l-sorbonne',tag:'Lilies',note:'Large, fragrant blooms for a focal point.'},
 {productId:'s-lisianthus',tag:'Lisianthus',note:'Ruffled petals for softer bouquet texture.'},
 {productId:'s-hydrangea',tag:'Hydrangeas',note:'Full flower heads for volume and shape.'},
 {productId:'c-anastasia',tag:'Chrysanthemums',note:'Lime-green petals for a fresh contrast.'},
 {productId:'p-sarah',tag:'Peonies',note:'Soft pink, full blooms for a focal point.'},
 {productId:'s-ranunculus',tag:'Ranunculus',note:'Layered apricot petals for warm colour.'},
 {productId:'s-anemone',tag:'Anemones',note:'Dark centres for a striking contrast.'},
 {productId:'r-athena',tag:'Spray roses',note:'Small blush blooms for softer arrangements.'}
];
const RF_FOLIAGE_PICKS=[
 {productId:'gr-euc',tag:'Foliage',note:'Rounded, silver-green leaves for a softer outline.'},
 {productId:'gr-ruscus',tag:'Foliage',note:'Glossy green stems for structure and depth.'}
];
function marketRecommendations(picks,offers,delivery){return picks.map(pick=>({...pick,p:prod(pick.productId),offer:featuredOffer(pick.productId,offers,delivery)})).filter(x=>x.p&&x.offer);}
// Northern-European editorial monthly selections, not live crop/availability claims. See MARKET_RESEARCH.md.
const RF_SEASONAL_EDITS=[
 {months:[1,2,3,4],products:['t-stronggold','t-dynasty','t-strong','t-negrita','s-ranunculus','s-anemone']},
 {months:[5,6],products:['p-sarah','p-coralcharm','s-lisianthus','s-delphinium','r-avalanche','r-athena']},
 {months:[7,8],products:['s-hydrangea','s-lisianthus','s-delphinium','g-intenzz','l-sorbonne','r-quicksand']},
 {months:[9,10,11],products:['c-bacardi','c-anastasia','s-hydrangea','s-lisianthus','gr-euc','gr-ruscus']},
 {months:[12],products:['r-rednaomi','r-avalanche','c-bacardi','c-anastasia','gr-euc','gr-ruscus']}
];
function marketMonth(now=new Date()){
 return {number:Number(new Intl.DateTimeFormat('en-GB',{month:'numeric',timeZone:'Europe/Amsterdam'}).format(now)),label:new Intl.DateTimeFormat('en-GB',{month:'long',timeZone:'Europe/Amsterdam'}).format(now)};
}
function seasonalRecommendations(offers,delivery,month){
 const edit=RF_SEASONAL_EDITS.find(edit=>edit.months.includes(month));
 return marketRecommendations((edit?.products||[]).map(productId=>({productId,tag:'Seasonal pick'})),offers,delivery);
}
function qualityRecommendations(offers,delivery){
 return marketRecommendations(RF_POPULAR_PICKS,offers.filter(offer=>offer.grade==='A1 Extra'),delivery).map(item=>({...item,tag:'A1 Extra'}));
}
function savedRecommendations(saved,offers,delivery){return marketRecommendations([...new Set(saved)].map(productId=>({productId})),offers,delivery);}
function RMarket({offers,state,onBrowse,onOpen,onAdd,onSave,onDate,onSaved}){
 const [month,setMonth]=React.useState(()=>marketMonth());
 React.useEffect(()=>{const refresh=()=>setMonth(previous=>{const current=marketMonth();return current.number===previous.number?previous:current});const timer=setInterval(refresh,60000);document.addEventListener('visibilitychange',refresh);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',refresh)}},[]);
 const seasonal=seasonalRecommendations(offers,state.delivery,month.number),quality=qualityRecommendations(offers,state.delivery),favourites=savedRecommendations(state.saved,offers,state.delivery);

 const bestSellers=marketRecommendations(RF_BESTSELLER_PICKS,offers,state.delivery);
 const featured=marketRecommendations(RF_POPULAR_PICKS,offers,state.delivery).map(item=>({...item,tag:WS_CATS.find(c=>c.id===item.p.cat)?.label}));
 const growers=RF_MARKET_FLOWERS.map(c=>{const ids=new Set(RF_PRODUCTS.filter(p=>p.cat===c.id).map(p=>p.id));const os=offers.filter(o=>o.grower===c.grower&&ids.has(o.productId)&&o.maxQty>=o.minQty);return{...c,photo:prod(c.productId),count:new Set(os.map(o=>o.productId)).size}}).filter(g=>g.count);
 const bouquetPicks=marketRecommendations(RF_BOUQUET_PICKS,offers,state.delivery),foliagePicks=marketRecommendations(RF_FOLIAGE_PICKS,offers,state.delivery);
 return <>
  <div className="rf-market-hero">
   <section className="rf-rose-edit rf-popular-edit"><div className="rf-rose-copy"><h1 tabIndex="-1">The market’s<br/>everyday favourites.</h1><p>Roses, tulips, chrysanthemums and gerberas. Find your colours, compare growers and build your next order.</p><button className="rf-btn primary" onClick={()=>onBrowse({scope:'flowers'})}>Find flowers →</button></div><div className="rf-popular-photos">{RF_MARKET_FLOWERS.map(c=><button key={c.id} onClick={()=>onBrowse({scope:'flowers',filters:{cat:c.id}})} aria-label={'Shop '+c.name.toLowerCase()}><RPhoto p={prod(c.productId)}/><span>{c.name}</span></button>)}</div></section>
   <section className="rf-plant-promo" aria-labelledby="plant-promo-title"><div className="rf-plant-promo-copy"><span className="rf-market-eyebrow">Discover our plant range</span><h2 id="plant-promo-title">Plants for<br/>every space.</h2><p>Fresh green favourites, flowering plants and succulents for your next order.</p></div><div className="rf-plant-promo-photos" aria-hidden="true"><div><RPhoto p={prod('pl-monstera')}/></div><div><RPhoto p={prod('pl-calathea')}/></div></div><button type="button" className="rf-btn" onClick={()=>onBrowse({scope:'plants'})}><span>Explore plants</span><RControlIcon name="next"/></button></section>
  </div>
  {bestSellers.length>0&&<RMarketRail id="best-sellers" title="Best sellers" items={bestSellers} state={state} onOpen={onOpen} onAdd={onAdd} onSave={onSave} onDate={onDate}/>}
  {seasonal.length>0&&<RMarketRail id="in-season" title={'In season now · '+month.label} items={seasonal} state={state} onOpen={onOpen} onAdd={onAdd} onSave={onSave} onDate={onDate}/>}
  {quality.length>0&&<RMarketRail id="highest-quality" title="Highest quality" intro="Explore offers listed at A1 Extra grade." items={quality} state={state} onOpen={onOpen} onAdd={onAdd} onSave={onSave} onDate={onDate}/>}
  {favourites.length>0?<RMarketRail id="favourites" title="Favourites" eyebrow="Saved by you" items={favourites} browseLabel="View all favourites" onBrowse={onSaved} state={state} onOpen={onOpen} onAdd={onAdd} onSave={onSave} onDate={onDate}/>:<section className="rf-market-section rf-market-favourites-empty" aria-labelledby="favourites-title"><div><span className="rf-market-eyebrow">Saved by you</span><h2 id="favourites-title">Favourites</h2><p>{state.saved.length?'Your saved products have no current offers. Review your favourites for more details.':'Save products with the heart to find them here next time.'}</p></div><button className="rf-btn" onClick={onSaved}>View favourites <RControlIcon name="next"/></button></section>}
  <RMarketRail id="featured" title="Popular flower offers" items={featured} browseLabel="View all flowers" onBrowse={()=>onBrowse({scope:'flowers',sort:'low'})} state={state} onOpen={onOpen} onAdd={onAdd} onSave={onSave} onDate={onDate}/>
  {bouquetPicks.length>0&&<RMarketRail id="bouquet" title="More for your bouquets" intro="Add a focal flower, fuller shape or a different texture." items={bouquetPicks} state={state} onOpen={onOpen} onAdd={onAdd} onSave={onSave} onDate={onDate}/>}
  <section className="rf-market-section" aria-labelledby="growers-title"><div className="rf-market-section-head"><div><h2 id="growers-title">Shop by grower</h2></div></div><div className="rf-grower-grid">{growers.map(g=><button className="rf-grower-tile" key={g.grower} onClick={()=>onBrowse({scope:'flowers',filters:{grower:g.grower,cat:g.id}})}><span className="rf-grower-tile-photo"><RPhoto p={g.photo}/></span><span><strong>{g.grower}</strong><small>{g.name} · {g.count} {g.count===1?'product':'products'}</small></span><span className="rf-grower-tile-arrow" aria-hidden="true">↗</span></button>)}</div></section>
  {foliagePicks.length>0&&<RMarketRail id="foliage" title="Greens & foliage" items={foliagePicks} browseLabel="View all foliage" onBrowse={()=>onBrowse({scope:'flowers',filters:{cat:'greens'}})} state={state} onOpen={onOpen} onAdd={onAdd} onSave={onSave} onDate={onDate}/>}
  <section className="rf-market-section" aria-labelledby="collections-title"><div className="rf-market-section-head"><div><h2 id="collections-title">Shop popular flowers</h2></div></div><div className="rf-collection-grid rf-popular-collections">{RF_MARKET_FLOWERS.map(c=><button className={'rf-collection '+c.id} key={c.id} onClick={()=>onBrowse({scope:'flowers',filters:{cat:c.id}})}><div><h3>{c.name}</h3><p>{c.copy}</p><span className="rf-collection-link">Shop {c.name.toLowerCase()} →</span></div><span className="rf-collection-photo"><RPhoto p={prod(c.productId)}/></span></button>)}</div></section>
  <div className="rf-market-catalogue"><div><h2>Know exactly what you need?</h2><p>Find your staple flowers, compare specifications and build your order.</p></div><button className="rf-btn dark" onClick={()=>onBrowse({scope:'flowers'})}>Open the flower catalogue →</button></div>
 </>;
}
// Coalesce scroll events without moving the viewport or replacing search controls.
function setupCommandBarScroll(onChange){
 let frame=0,previous=null,disposed=false;
 function update(){frame=0;if(disposed)return;const compact=Math.max(0,window.scrollY)>40;if(compact!==previous){previous=compact;onChange(compact)}}
 function schedule(){if(!frame)frame=requestAnimationFrame(update)}
 addEventListener('scroll',schedule,{passive:true});schedule();
 return()=>{disposed=true;removeEventListener('scroll',schedule);cancelAnimationFrame(frame)};
}
function animateCommandSearch(form,before){
 if(!form||!before||matchMedia('(prefers-reduced-motion: reduce)').matches)return null;
 const after=form.getBoundingClientRect(),dx=before.left+before.width/2-after.left-after.width/2,dy=before.top-after.top;
 return form.animate([
  {transform:`translateX(-50%) translate(${dx}px,${dy}px)`,width:before.width+'px',height:before.height+'px'},
  {transform:'translateX(-50%) translate(0,0)',width:after.width+'px',height:after.height+'px'}
 ],{duration:220,easing:'ease'});
}
function RHeaderSearch({query,filters,offers,onSearch,scope='all',departureControl,context,toolbar,command=false,compact=false}){
 const [term,setTerm]=React.useState(query),[grower,setGrower]=React.useState(filters.grower),[length,setLength]=React.useState(filters.length);
 React.useEffect(()=>{setTerm(query);setGrower(filters.grower);setLength(filters.length)},[query,filters.grower,filters.length]);
 const growers=[...new Set(offers.map(o=>o.grower))].sort((a,b)=>a.localeCompare(b));
 const searchLabel=context==='saved'?'Search favourites':context==='again'?'Search past purchases':'Search',placeholder=context==='saved'?'Search your favourite products...':context==='again'?'Search previously ordered products...':scope==='plants'?'Plants, varieties, growers...':'Flowers, plants, growers...';
 const search=<form className={'rf-segmented-search '+(departureControl?'has-departure':'')} role="search" aria-label="Webshop search" onSubmit={e=>{e.preventDefault();onSearch({query:term,grower,length})}}>
  <label className="rf-search-segment"><span>{searchLabel}</span><input aria-label={context==='saved'?'Search favourite products':context==='again'?'Search previously ordered products':'Search products'} placeholder={placeholder} value={term} onChange={e=>setTerm(e.target.value)}/></label>
  <label className="rf-search-segment"><span>Grower</span><select aria-label="Search by grower" className={grower?'':'is-placeholder'} value={grower} onChange={e=>setGrower(e.target.value)}><option value="">Add any grower</option>{growers.map(g=><option value={g} key={g}>{g}</option>)}</select></label>
  <label className="rf-search-segment"><span>{scope==='plants'?'Height':'Length'}</span><select aria-label={scope==='plants'?'Search by height':'Search by length'} className={length?'':'is-placeholder'} value={length} onChange={e=>setLength(e.target.value)}><option value="">{scope==='plants'?'Any height':'Any length'}</option><option value="short">45 cm or shorter</option><option value="medium">46–65 cm</option><option value="long">66 cm or longer</option></select></label>
  {departureControl&&<div className="rf-search-departure">{departureControl}</div>}
  <button className="rf-search-submit" type="submit" aria-label="Search webshop">{WI.search({'aria-hidden':true})}</button>
 </form>;
 return <div className={'rf-search-masthead'+(toolbar?' rf-search-with-toolbar':'')+(command?' rf-command-band':'')}>
  {command?<div className={'rf-command-slot'+(departureControl?' has-departure':'')}>{search}</div>:search}
  {command?<div className="rf-command-fold" inert={compact?'':undefined} aria-hidden={compact||undefined}>{toolbar}</div>:toolbar}
 </div>;
}

const _pf = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const PFI = {
  settings: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="m9.6 3-.5 2.1-2 .9-1.9-.6-2.4 4.2 1.5 1.5v2l-1.5 1.5 2.4 4.2 1.9-.6 2 .9.5 2.1h4.8l.5-2.1 2-.9 1.9.6 2.4-4.2-1.5-1.5v-2l1.5-1.5-2.4-4.2-1.9.6-2-.9-.5-2.1Z"/><circle cx="12" cy="12" r="3"/></svg>),
  mail: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>),
  phone: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="M8 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 2a13 13 0 0 1-6-6l2-2Z"/></svg>),
  globe: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4.5 6 4.5 9s-1.5 6-4.5 9c-3-3-4.5-6-4.5-9S9 6 12 3Z"/></svg>),
  user: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>),
  ticket: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4z"/><path d="M13 6v12"/></svg>),
  wallet: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M16.5 14.5h1.5"/></svg>),
  doc: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 16.5h4"/></svg>),
  down: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><circle cx="12" cy="12" r="9"/><path d="m8.4 12.3 2.5 2.5 4.7-5"/></svg>),
  dot: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><circle cx="12" cy="12" r="9"/></svg>),
  fwd: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="m9 5 7 7-7 7"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" {..._pf} {...p}><path d="M12 5v14M5 12h14"/></svg>),
};


const RF_VERIFICATION_STEPS=[
 {label:'Address',title:'Business address',intro:'Enter your registered business address. We’ll use your country to prepare the business and customs details in later steps.'},
 {label:'ID Doc',title:'Identity document',intro:'Choose the document you would provide to verify the account holder.'},
 {label:'Business',title:'Business & contact details',intro:'Tell us about your company and the person we should contact about your account.'},
 {label:'Services',title:'What would you like to buy?',intro:'Choose the products and services your business is interested in.'},
 {label:'Transport',title:'Transport preferences',intro:'Tell us how you would like to collect your orders from PP Flowers.'},
 {label:'Customs',title:'Customs information',intro:'Add any customs references your transport company has asked you to provide.'},
 {label:'Contract',title:'Trading agreement',intro:'Choose your payment preference and prepare for the agreement review with your account manager.'},
 {label:'Deposit',title:'Your first deposit',intro:'Choose how you would like to fund your account. No payment is taken as part of this form.'}
];
const RF_VERIFICATION_COUNTRIES=['Netherlands','Belgium','Germany','France','United Kingdom','Ireland','Spain','Italy','Poland','Denmark','Sweden','Norway','Switzerland','United States','United Arab Emirates'];
function verificationDraft(state){
 const saved=state.profile?.verification||{},contact=state.contact||{};
 return {version:1,step:Number.isInteger(saved.step)?Math.max(0,Math.min(7,saved.step)):0,status:saved.status==='details_saved'?'details_saved':'draft',completedSteps:Array.isArray(saved.completedSteps)?[...new Set(saved.completedSteps.filter(n=>Number.isInteger(n)&&n>=0&&n<8))]:[],
  address:{street:contact.street||'',postcode:contact.postcode||'',city:contact.city||'',country:contact.country||'',...saved.address},
  identity:{type:'',file:null,...saved.identity},business:{company:state.profile?.company||'',registration:'',vat:state.profile?.vat||'',...saved.business},
  contact:{first:contact.first||'',last:contact.last||'',email:contact.email||'',phone:contact.phone||'',...saved.contact},
  services:Array.isArray(saved.services)?saved.services.filter(v=>['flowers','plants','foliage','accessories'].includes(v)):[],
  transport:{method:'',carrier:'',notes:'',...saved.transport},customs:{needed:'',eori:'',broker:'',notes:'',...saved.customs},contract:{payment:'prepayment',ready:false,...saved.contract},deposit:{method:'later',...saved.deposit},savedAt:saved.savedAt||null};
}
function verificationFileError(file){if(!file)return'Choose a sample document to continue.';if(!/\.(pdf|jpe?g|png)$/i.test(file.name||'')||!['application/pdf','image/jpeg','image/png',''].includes(file.type||''))return'Choose a PDF, JPG or PNG file.';if(!Number.isSafeInteger(file.size)||file.size<=0||file.size>10*1024*1024)return'Choose a non-empty file of up to 10 MB.';return'';}
function verificationStepErrors(draft,step){
 const errors={},required=(section,key,label)=>{if(!String(draft[section]?.[key]||'').trim())errors[section+'.'+key]=label+' is required.';};
 if(step===0){for(const [key,label] of [['street','Street address'],['postcode','Postal code'],['city','City'],['country','Country']])required('address',key,label);}
 if(step===1){if(!['passport','national-id','driving-licence'].includes(draft.identity.type))errors['identity.type']='Choose a document type.';const issue=verificationFileError(draft.identity.file);if(issue)errors['identity.file']=issue;}
 if(step===2){required('business','company','Company name');required('business','registration','Registration number');required('contact','first','First name');required('contact','last','Last name');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contact.email||''))errors['contact.email']='Enter a valid email address.';}
 if(step===3&&!draft.services.some(v=>['flowers','plants','foliage','accessories'].includes(v)))errors.services='Choose at least one service.';
 if(step===4){if(!['own-carrier','collection','assistance'].includes(draft.transport.method))errors['transport.method']='Choose a transport option.';if(draft.transport.method==='own-carrier')required('transport','carrier','Transport company');}
 if(step===5&&!['yes','no'].includes(draft.customs.needed))errors['customs.needed']='Tell us whether customs information is needed.';
 if(step===6){if(!['prepayment','terms'].includes(draft.contract.payment))errors['contract.payment']='Choose a payment preference.';if(draft.contract.ready!==true)errors['contract.ready']='Confirm you are ready to review the agreement.';}
 if(step===7&&!['later','transfer','balance'].includes(draft.deposit.method))errors['deposit.method']='Choose a deposit preference.';
 return errors;
}
function verificationSavePayload(state,draft,{finish=false,now=new Date()}={}){
 const safe=M.clone(draft);if(finish){for(let index=0;index<8;index++)if(Object.keys(verificationStepErrors(safe,index)).length)throw Error('Complete '+RF_VERIFICATION_STEPS[index].label+' before saving your account details.');safe.completedSteps=[0,1,2,3,4,5,6,7];safe.status='details_saved';}
 // File contents never enter persistent storage; this prototype retains selection metadata only.
 if(safe.identity.file)safe.identity.file={name:safe.identity.file.name,size:safe.identity.file.size,type:safe.identity.file.type||''};
 safe.savedAt=now.toISOString();
 const contact={...state.contact,...safe.contact},validContact=!Object.keys(M.validateContact(contact)).length;
 return {contact:validContact?contact:M.clone(state.contact),profile:{...state.profile,company:safe.business.company,vat:safe.business.vat,verification:safe,...(finish?{completedAt:state.profile?.completedAt||safe.savedAt}:{})}};
}
function RProfileInformation({state,onSave,onTopup}){
 const [draft,setDraft]=React.useState(()=>verificationDraft(state)),[errors,setErrors]=React.useState({}),[fileError,setFileError]=React.useState('');
 const step=draft.step,current=RF_VERIFICATION_STEPS[step],heading=React.useRef(null),fileInput=React.useRef(null),done=draft.completedSteps.length,furthest=Array.from({length:8},(_,i)=>i).find(i=>!draft.completedSteps.includes(i))??7;
 const countries=[...new Set([...RF_VERIFICATION_COUNTRIES,draft.address.country].filter(Boolean))];
 function focusStep(){requestAnimationFrame(()=>heading.current?.focus({preventScroll:true}));}
 function change(section,key,value){setDraft(d=>({...d,[section]:key?{...d[section],[key]:value}:value,status:'draft',completedSteps:d.completedSteps.filter(i=>i<step)}));setErrors(e=>({...e,[key?section+'.'+key:section]:''}));}
 function navigate(index){if(index>furthest)return;setDraft(d=>({...d,step:index}));setErrors({});setFileError('');focusStep();}
 function persist(next,finish=false,silent=false){const result=verificationSavePayload(state,next,{finish});onSave(result.contact,result.profile,{silent,message:finish?'Account details saved.':'Verification progress saved.'});setDraft(result.profile.verification);}
 function saveDraft(){persist(draft,false);}
 function next(e){e.preventDefault();const issues=verificationStepErrors(draft,step);setErrors(issues);if(Object.keys(issues).length){requestAnimationFrame(()=>document.getElementById('verify-'+Object.keys(issues)[0])?.focus());return;}
  if(step===7){const invalid=RF_VERIFICATION_STEPS.findIndex((_,i)=>Object.keys(verificationStepErrors(draft,i)).length);if(invalid>=0){setDraft(d=>({...d,step:invalid}));setErrors(verificationStepErrors(draft,invalid));focusStep();return;}persist(draft,true);focusStep();return;}
  persist({...draft,step:step+1,completedSteps:[...new Set([...draft.completedSteps,step])]},false,true);setErrors({});focusStep();
 }
 function chooseFile(e){const file=e.target.files?.[0];if(!file)return;const issue=verificationFileError(file);setFileError(issue);if(issue){e.target.value='';return;}change('identity','file',{name:file.name,size:file.size,type:file.type});}
 const error=key=>errors[key]&&<span className="rf-error" id={'verify-error-'+key}>{errors[key]}</span>;
 const field=(section,key,label,{type='text',placeholder='',required=false,autoComplete}={})=><label className="rf-field">{label}{!required&&<span className="rf-verification-optional">Optional</span>}<input id={'verify-'+section+'.'+key} type={type} value={draft[section][key]||''} placeholder={placeholder} required={required} maxLength={key==='notes'?1000:180} autoComplete={autoComplete} aria-invalid={!!errors[section+'.'+key]} aria-describedby={errors[section+'.'+key]?'verify-error-'+section+'.'+key:undefined} onChange={e=>change(section,key,e.target.value)}/>{error(section+'.'+key)}</label>;
 const options=(section,key,label,items)=><fieldset className="rf-verification-options" id={'verify-'+section+'.'+key} tabIndex="-1" aria-invalid={!!errors[section+'.'+key]} aria-describedby={errors[section+'.'+key]?'verify-error-'+section+'.'+key:undefined}><legend>{label}</legend>{items.map(([value,title,copy])=><label key={value} className={'rf-verification-option '+(draft[section][key]===value?'selected':'')}><input type="radio" name={section+'.'+key} value={value} checked={draft[section][key]===value} onChange={()=>change(section,key,value)}/><span><strong>{title}</strong>{copy&&<small>{copy}</small>}</span></label>)}{error(section+'.'+key)}</fieldset>;
 if(draft.status==='details_saved')return <div className="rf-verification"><section className="rf-verification-success"><span className="rf-verification-success-icon">{PFI.check({'aria-hidden':true})}</span><span className="rf-verification-eyebrow">8 of 8 steps completed</span><h3 ref={heading} tabIndex="-1">Your account details are saved</h3><p>Your business information and preferences are ready to review.</p><dl><div><dt>Business</dt><dd>{draft.business.company}</dd></div><div><dt>Registered address</dt><dd>{draft.address.street}, {draft.address.postcode} {draft.address.city}, {draft.address.country}</dd></div><div><dt>Contact</dt><dd>{draft.contact.first} {draft.contact.last} · {draft.contact.email}</dd></div></dl><p className="rf-verification-notice">Preview only. Documents and agreements have not been submitted, and no payment or account activation has taken place.</p><button type="button" className="rf-btn" onClick={()=>{setDraft(d=>({...d,status:'draft',step:0}));focusStep();}}>Review your details<RControlIcon name="next"/></button></section></div>;
 return <div className="rf-verification">
  <div className="rf-verification-intro"><p>Complete all 8 steps to prepare your account and start trading.</p><span>{done} of 8 completed</span></div>
  <div className="rf-verification-progress" role="progressbar" aria-label="Verification steps completed" aria-valuemin="0" aria-valuemax="8" aria-valuenow={done} aria-valuetext={done+' of 8 steps completed'}>{RF_VERIFICATION_STEPS.map((item,i)=><span key={item.label} className={draft.completedSteps.includes(i)?'done':i===step?'current':''}/>)}</div>
  <div className="rf-verification-layout">
   <nav className="rf-verification-steps" aria-label="Account verification steps"><span className="rf-verification-eyebrow">Step {step+1} of 8</span>{RF_VERIFICATION_STEPS.map((item,i)=><button key={item.label} type="button" aria-current={i===step?'step':undefined} disabled={i>furthest} className={(i===step?'current ':'')+(draft.completedSteps.includes(i)?'done':'')} onClick={()=>navigate(i)}><span className="rf-verification-step-number">{draft.completedSteps.includes(i)?PFI.check({'aria-hidden':true}):i+1}</span><span>{item.label}</span>{i===step&&<RControlIcon name="next"/>}</button>)}</nav>
   <form className="rf-verification-card" onSubmit={next} noValidate aria-labelledby="verify-step-title">
    <header><span className="rf-verification-eyebrow">Step {step+1} of 8 · Current</span><h3 id="verify-step-title" ref={heading} tabIndex="-1">{current.title}</h3><p>{current.intro}</p></header>
    <div className="rf-verification-fields" key={step}>
     {step===0&&<>{field('address','street','Street address',{placeholder:'e.g. Hoofdweg 123',required:true,autoComplete:'street-address'})}<div className="rf-verification-postcode">{field('address','postcode','Postal code',{placeholder:'1234 AB',required:true,autoComplete:'postal-code'})}{field('address','city','City',{placeholder:'Amsterdam',required:true,autoComplete:'address-level2'})}</div><label className="rf-field">Country<select id="verify-address.country" value={draft.address.country} required aria-invalid={!!errors['address.country']} aria-describedby={errors['address.country']?'verify-error-address.country':undefined} onChange={e=>change('address','country',e.target.value)}><option value="">Select country…</option>{countries.map(country=><option key={country}>{country}</option>)}</select>{error('address.country')}</label></>}
     {step===1&&<>{options('identity','type','Document type',[['passport','Passport'],['national-id','National identity card'],['driving-licence','Driving licence']])}<div className="rf-verification-upload" id="verify-identity.file" tabIndex="-1" aria-invalid={!!errors['identity.file']} aria-describedby={errors['identity.file']?'verify-error-identity.file':undefined}><span className="rf-verification-upload-icon">{PFI.doc({'aria-hidden':true})}</span><strong>{draft.identity.file?draft.identity.file.name:'Add a sample document'}</strong><p>PDF, JPG or PNG · up to 10 MB</p><button type="button" className="rf-btn" onClick={()=>fileInput.current?.click()}>{draft.identity.file?'Choose another file':'Choose file'}<RControlIcon name="plus"/></button><input className="sr-only" ref={fileInput} type="file" accept=".pdf,.jpg,.jpeg,.png" aria-label="Choose sample identity document" onChange={chooseFile}/>{draft.identity.file&&<button type="button" className="rf-textbtn rf-danger-action" onClick={()=>{change('identity','file',null);if(fileInput.current)fileInput.current.value='';}}>Remove file</button>}{fileError&&<span className="rf-error" role="alert">{fileError}</span>}{error('identity.file')}</div><p className="rf-verification-notice">Preview only. Use a sample file. Only its name, type and size are saved; no document is uploaded.</p></>}
     {step===2&&<><div className="rf-verification-two">{field('business','company','Company name',{required:true,autoComplete:'organization'})}{field('business','registration','Business registration number',{required:true})}</div>{field('business','vat','VAT number')}<h4>Account contact</h4><div className="rf-verification-two">{field('contact','first','First name',{required:true,autoComplete:'given-name'})}{field('contact','last','Last name',{required:true,autoComplete:'family-name'})}</div><div className="rf-verification-two">{field('contact','email','Email address',{type:'email',required:true,autoComplete:'email'})}{field('contact','phone','Phone number',{type:'tel',autoComplete:'tel'})}</div></>}
     {step===3&&<fieldset className="rf-verification-options" id="verify-services" tabIndex="-1" aria-invalid={!!errors.services} aria-describedby={errors.services?'verify-error-services':undefined}><legend>Select all that apply</legend>{[['flowers','Cut flowers','Fresh stems and seasonal varieties.'],['plants','Plants','Flowering plants and green plants.'],['foliage','Greens & foliage','Greenery to complete your bouquets.'],['accessories','Accessories','Supplies for your flower business.']].map(([value,title,copy])=><label key={value} className={'rf-verification-option '+(draft.services.includes(value)?'selected':'')}><input type="checkbox" checked={draft.services.includes(value)} onChange={e=>change('services',null,e.target.checked?[...draft.services,value]:draft.services.filter(item=>item!==value))}/><span><strong>{title}</strong><small>{copy}</small></span></label>)}{error('services')}</fieldset>}
     {step===4&&<>{options('transport','method','How will you collect your orders?',[['own-carrier','My own transport company','Share the carrier you normally work with.'],['collection','Collect from PP Flowers','Your team collects the order.'],['assistance','Help arranging transport','Discuss a suitable option with your account manager.']])}{draft.transport.method==='own-carrier'&&field('transport','carrier','Transport company',{required:true})}{field('transport','notes','Transport notes',{placeholder:'Collection preferences or instructions'})}</>}
     {step===5&&<><div className="rf-verification-country"><span>Business country</span><strong>{draft.address.country||'Not selected'}</strong></div>{options('customs','needed','Do you need to add customs information?',[['no','No customs information to add'],['yes','Yes, I have customs details']])}{draft.customs.needed==='yes'&&<>{field('customs','eori','EORI / customs reference')}{field('customs','broker','Customs broker')}{field('customs','notes','Customs notes')}</>}</>}
     {step===6&&<>{options('contract','payment','Preferred payment arrangement',[['prepayment','Prepayment','Fund your account before ordering.'],['terms','Discuss payment terms','Your account manager will review your request.']])}<div className="rf-verification-agreement"><span>{PFI.doc({'aria-hidden':true})}</span><div><strong>Agreement review</strong><p>Your account manager will share the trading agreement after reviewing your business details.</p></div></div><label className="rf-verification-check"><input type="checkbox" id="verify-contract.ready" aria-invalid={!!errors['contract.ready']} aria-describedby={errors['contract.ready']?'verify-error-contract.ready':undefined} checked={draft.contract.ready} onChange={e=>change('contract','ready',e.target.checked)}/><span>I’m ready to receive and review the trading agreement.</span></label>{error('contract.ready')}<p className="rf-verification-notice">This saves your preference. It does not sign or accept a contract.</p></>}
     {step===7&&<><div className="rf-verification-deposit"><div><span>Available account balance</span><strong>{money(state.balanceCents)}</strong></div><button type="button" className="rf-btn" onClick={onTopup}>Add demo balance{PFI.plus({'aria-hidden':true})}</button></div>{options('deposit','method','How would you like to fund your account?',[['later','Arrange my deposit later'],['transfer','Bank transfer','Use your payment reference when transferring funds.'],['balance','Use my existing balance','You can review your balance in Top-up history.']])}<p className="rf-verification-notice">Saving this form does not start a payment or activate trading. Document submission and account verification are not connected in this preview.</p></>}
    </div>
    <footer><div>{step>0&&<button type="button" className="rf-btn" onClick={()=>navigate(step-1)}><RControlIcon name="back"/>Back</button>}<button type="button" className="rf-textbtn" onClick={saveDraft}>Save draft</button></div><button type="submit" className="rf-btn primary">{step===7?'Save account details':'Save & continue'}<RControlIcon name="next"/></button></footer>
   </form>
  </div>
 </div>;
}
function RLanguagePreference({value,onSave,onClose}){
 const [language,setLanguage]=React.useState(value),[error,setError]=React.useState('');
 function save(e){e.preventDefault();try{onSave(language);onClose()}catch(e){setError(e.message)}}
 return <RModal title="Language preference" onClose={onClose} className="rf-language-modal"><form onSubmit={save}>
  <p className="rf-language-intro">Choose the language you prefer to use with PP Flowers.</p>
  <fieldset className="rf-language-options"><legend className="sr-only">Preferred language</legend>{M.LANGUAGES.map(item=><label key={item.code} className={'rf-language-option'+(language===item.code?' selected':'')}><input type="radio" name="preferred-language" value={item.code} checked={language===item.code} onChange={()=>{setLanguage(item.code);setError('')}}/><span><strong lang={item.code}>{item.nativeName}</strong>{item.name!==item.nativeName&&<small>{item.name}</small>}</span>{language===item.code&&PFI.check({'aria-hidden':true})}</label>)}</fieldset>
  {error&&<p className="rf-error" role="alert">{error}</p>}
  <div className="rf-modal-actions"><button type="button" className="rf-btn" onClick={onClose}>Cancel</button><button type="submit" className="rf-btn primary">Save preference<RControlIcon name="next"/></button></div>
 </form></RModal>;
}
function RContactVerificationPreview({kind,value,onComplete,onClose}){
 const label=kind==='email'?'email':'phone',title='Verify '+label;
 const [challenge,setChallenge]=React.useState(()=>M.contactPreviewChallenge(kind,value)),[code,setCode]=React.useState(''),[error,setError]=React.useState(''),[complete,setComplete]=React.useState(false);
 const codeInput=React.useRef(null);
 React.useEffect(()=>{codeInput.current?.focus({preventScroll:true})},[]);
 function verify(e){e.preventDefault();const result=M.checkContactPreview(challenge,code);setChallenge(result.challenge);if(result.error){setError(result.error);return;}try{onComplete(kind,value);setError('');setComplete(true)}catch(e){setError(e.message)}}
 function regenerate(){setChallenge(M.contactPreviewChallenge(kind,value));setCode('');setError('');codeInput.current?.focus();}
 return <RModal title={title} onClose={onClose} className="rf-contact-verification-modal">
  {complete?<div className="rf-contact-preview-success" role="status"><span>{PFI.check({'aria-hidden':true})}</span><h3>{kind==='email'?'Email':'Phone'} verified in preview</h3><p>{value}</p><p>This completes the demo flow. Live verification will confirm ownership using a code delivered to your {label}.</p><button type="button" className="rf-btn dark" onClick={onClose}>Done</button></div>:<form noValidate onSubmit={verify}>
   <p className="rf-contact-preview-note"><strong>Verification preview</strong>No {kind==='email'?'email':'SMS or WhatsApp message'} is sent. Use the demo code below to try the flow.</p>
   <p className="rf-contact-destination">{kind==='email'?'Email address':'Phone number'}<strong>{value}</strong></p>
   <div className="rf-contact-demo-code"><span>Demo code · valid for 5 minutes</span><strong>{challenge.code}</strong></div>
   <label className="rf-field" htmlFor="contact-verification-code">6-digit code<input id="contact-verification-code" ref={codeInput} type="text" inputMode="numeric" autoComplete="off" maxLength={6} value={code} placeholder="000000" aria-invalid={!!error} aria-describedby={error?'contact-verification-error':undefined} onChange={e=>{setCode(e.target.value.replace(/\D/g,''));setError('')}}/></label>
   {error&&<p id="contact-verification-error" className="rf-error" role="alert">{error}</p>}
   <button type="button" className="rf-textbtn" onClick={regenerate}>Generate a new demo code</button>
   <div className="rf-modal-actions"><button type="button" className="rf-btn" onClick={onClose}>Cancel</button><button type="submit" className="rf-btn dark">Verify {label}<RControlIcon name="next"/></button></div>
  </form>}
 </RModal>;
}
function RProfileSettings({state,onSave,onVerify}){
 const [contact,setContact]=React.useState(()=>({...state.contact})),[errors,setErrors]=React.useState({}),[message,setMessage]=React.useState(''),[verification,setVerification]=React.useState(null);
 React.useEffect(()=>{setContact({...state.contact});setErrors({})},[state.contact]);
 const dirty=['first','last','email','phone'].some(key=>String(contact[key]||'').trim()!==String(state.contact[key]||'').trim());
 function change(key,value){setContact(c=>({...c,[key]:value}));setErrors(e=>({...e,[key]:'',form:''}));setMessage('');}
 function save(e){e.preventDefault();const issues=M.contactSettingsErrors(contact);setErrors(issues);if(Object.keys(issues).length){document.getElementById('settings-'+Object.keys(issues)[0])?.focus();return;}try{onSave(contact);setMessage('Changes saved.')}catch(e){setErrors({form:e.message})}}
 function begin(kind){setMessage('');if(dirty){setErrors({form:'Save your changes before verifying your contact details.'});return;}if(!String(state.contact[kind]||'').trim()){document.getElementById('settings-'+kind)?.focus();return;}const issue=M.contactSettingsErrors(contact)[kind];if(issue){setErrors({[kind]:issue});document.getElementById('settings-'+kind)?.focus();return;}setVerification({kind,value:state.contact[kind]});}
 function field(key,label,type='text',hint=''){return <div className="rf-settings-field"><label className="rf-field" htmlFor={'settings-'+key}><span>{label}{['email','phone'].includes(key)&&<span className={'rf-contact-status '+(M.contactPreviewComplete(state,key,contact[key])?'complete':'')}>{M.contactPreviewComplete(state,key,contact[key])?'Verified in preview':'Not verified'}</span>}</span><input id={'settings-'+key} type={type} autoComplete={{first:'given-name',last:'family-name',email:'email',phone:'tel'}[key]} value={contact[key]||''} placeholder={key==='phone'?'+31 6 1234 5678':undefined} maxLength={key==='phone'?30:key==='email'?254:80} aria-invalid={!!errors[key]} aria-describedby={(hint||errors[key])?'settings-'+key+'-hint':undefined} onChange={e=>change(key,e.target.value)}/></label>{(hint||errors[key])&&<p id={'settings-'+key+'-hint'} className={errors[key]?'rf-error':'rf-settings-hint'}>{errors[key]||hint}</p>}</div>}
 return <div className="rf-settings">
  <p className="rf-settings-intro">Manage your contact details and verify your email and phone number.</p>
  <div className="rf-settings-verification" aria-label="Contact verification">{['email','phone'].map(kind=>{const done=M.contactPreviewComplete(state,kind),icon=kind==='email'?PFI.mail:PFI.phone;return <section key={kind} className={'rf-settings-notice '+(done?'complete':'')}><span className="rf-settings-notice-icon">{(done?PFI.check:icon)({'aria-hidden':true})}</span><div><h3>{kind==='email'?'Email':'Phone'} {done?'verified in preview':'not verified'}</h3><p>{done?'Your demo verification is complete.':kind==='email'?'Confirm the email address used for your account and order updates.':'Confirm your phone number for account and order updates.'}</p></div>{!done&&<button type="button" className="rf-btn" onClick={()=>begin(kind)}>{kind==='phone'&&!state.contact.phone?'Add phone number':'Verify '+kind}</button>}</section>})}</div>
  <form className="rf-settings-card" noValidate onSubmit={save}>
   <header><h3>Account details</h3><p>Your contact information is shared across your profile and checkout.</p></header>
   <div className="rf-settings-fields">{field('first','First name')}{field('last','Last name')}{field('email','Email address','email')}{field('phone','Phone number','tel','Include your international country code.')}</div>
   <footer>{errors.form?<p className="rf-error" role="alert">{errors.form}</p>:<p role="status">{message||'Save changes before starting verification.'}</p>}<button type="submit" className="rf-btn dark" disabled={!dirty}>Save changes<PFI.check aria-hidden="true"/></button></footer>
  </form>
  <p className="rf-settings-preview-info"><strong>Local preview</strong> Codes are shown in the verification dialog. Email and phone delivery will be connected in the live webshop.</p>
  {verification&&<RContactVerificationPreview kind={verification.kind} value={verification.value} onComplete={onVerify} onClose={()=>setVerification(null)}/>}
 </div>;
}
function demoBillingHistory(now=new Date()){
 const products={rose:{productId:'r-rednaomi',name:'Red Naomi',grower:'Porta Nova',origin:'Holland',stemCm:70,grade:'A1 Extra',unit:'stem',unitCents:24},tulip:{productId:'t-stronggold',name:'Strong Gold',grower:'Maxima Kwekerij',origin:'Holland',stemCm:38,grade:'A1',unit:'stem',unitCents:19},bacardi:{productId:'c-bacardi',name:'Bacardi',grower:'Deliflor',origin:'Holland',stemCm:70,grade:'A1',unit:'stem',unitCents:42},eucalyptus:{productId:'gr-euc',name:'Eucalyptus Cinerea',grower:'Verdissimo',origin:'Spain',stemCm:60,grade:'A1',unit:'stem',unitCents:55},avalanche:{productId:'r-avalanche',name:'Avalanche+',grower:'Marginpar',origin:'Holland',stemCm:60,grade:'A1',unit:'stem',unitCents:46}};
 const examples=[{id:'DEMO-1048',days:1,payment:'transfer',status:'confirmed',products:[['rose',80],['tulip',3000]]},{id:'DEMO-1047',days:4,payment:'transfer',status:'awaiting_payment',products:[['bacardi',640],['eucalyptus',800]]},{id:'DEMO-1046',days:8,payment:'balance',status:'confirmed',products:[['avalanche',1100]]},{id:'DEMO-1045',days:13,payment:'transfer',status:'confirmed',products:[['eucalyptus',900],['rose',500]]},{id:'DEMO-1044',days:21,payment:'transfer',status:'awaiting_payment',products:[['tulip',5000],['avalanche',110]]}];
 return examples.map(example=>{const placed=new Date(now);placed.setDate(placed.getDate()-example.days);placed.setHours(12,0,0,0);const departure=new Date(placed);departure.setDate(departure.getDate()+2);const lines=example.products.map(([key,qty],index)=>({...products[key],id:example.id+'-line-'+(index+1),qty}));return{id:example.id,placedAt:placed.toISOString(),delivery:departure.toISOString().slice(0,10),payment:example.payment,status:example.status,lines,...M.totals(lines)};});
}
function RDemoBillingOrder({order,onClose}){
 return <RModal title={'Demo order '+order.id} onClose={onClose} wide className="rf-billing-demo-modal">
  <div className="rf-billing-demo-heading"><div><span>Example billing entry</span><h3>{order.id}</h3><p>{purchaseDate(order.placedAt)} · {order.payment==='balance'?'Account balance':'Bank transfer'}</p></div><span className={'rf-status '+(order.status==='confirmed'?'ok':'')}>{order.status==='confirmed'?'Paid':'Awaiting payment'}</span></div>
  <RProductLinesTable lines={order.lines} subtotalCents={order.subtotalCents} caption={'Products in demo order '+order.id+'. Example amounts exclude VAT.'} regionLabel="Demo billing product details"/>
  <div className="rf-billing-demo-totals"><div><span>Products</span><strong>{money(order.subtotalCents)}</strong></div><div><span>Shipping</span><span>{money(order.shippingCents)}</span></div><div><span>Total <small>excl. VAT</small></span><strong>{money(order.totalCents)}</strong></div></div>
  <p className="rf-billing-demo-note">This is a display-only example. No order or payment is created.</p>
  <div className="rf-modal-actions"><button type="button" className="rf-btn" onClick={onClose}>Close preview</button></div>
 </RModal>;
}
function RProfileBilling({orders,onOpenOrder}){
 const [showDemo,setShowDemo]=React.useState(()=>!orders.length),[examples]=React.useState(()=>demoBillingHistory()),[selected,setSelected]=React.useState(null);
 const rows=showDemo?examples:orders,detail=showDemo?examples.find(order=>order.id===selected):null;
 return <div className="rf-profile-billing"><div className="rf-profile-billing-head"><p className="rf-profile-intro">Payment history and order totals, in one overview.</p><button type="button" className="rf-btn" aria-pressed={showDemo} onClick={()=>{setShowDemo(value=>!value);setSelected(null)}}>{showDemo?'Hide demo data':'Show demo data'}</button></div>
  {showDemo&&<div className="rf-billing-demo-banner"><span>{PFI.doc({'aria-hidden':true})}</span><div><strong>Demo billing history</strong><p>Example paid and awaiting-payment entries. These do not affect your orders or balance.</p></div></div>}
  {rows.length?<ROrdersTable orders={rows} billing onOpen={order=>{if(showDemo)setSelected(order.id);else onOpenOrder(order)}}/>:<div className="rf-profile-empty"><span className="rf-profile-empty-icon">{PFI.doc({'aria-hidden':true})}</span><h3>No billing history yet</h3><p>Your order payments will appear here after you place an order.</p></div>}
  {detail&&<RDemoBillingOrder order={detail} onClose={()=>setSelected(null)}/>}
 </div>;
}
function RCompletedProfile({state}){
 const [orders]=React.useState(()=>demoBillingHistory()),[selected,setSelected]=React.useState(null),heading=React.useRef(null);
 React.useEffect(()=>{heading.current?.focus({preventScroll:true})},[]);
 const pending=orders.filter(order=>order.status==='awaiting_payment'),outstanding=pending.reduce((total,order)=>total+order.totalCents,0),detail=orders.find(order=>order.id===selected);
 const name=[state.contact.first,state.contact.last].filter(Boolean).join(' ')||'Your account',displayName=name==='Test Account'?'Test account':name;
 return <div className="rf-completed-profile">
  <div className="rf-completed-profile-top">
   <article className="rf-profile-id rf-completed-profile-id" aria-label="Customer profile"><header className="rf-profile-identity-header"><div className="rf-profile-avatar" aria-hidden="true">{(state.contact.first||'T').slice(0,1).toUpperCase()}</div><div><h3>{displayName}</h3><p>Wholesale buyer</p><span className="rf-profile-account-status-chip" aria-label="Account status: Active" title="Verified and ready to trade">{PFI.check({'aria-hidden':true})} Active</span></div></header><dl className="rf-profile-identity-details"><div><dt>Customer ID</dt><dd className="rf-profile-identity-number">{M.customerId(state)}</dd></div><div><dt>Location</dt><dd>{state.contact.city}</dd></div><div><dt>Member since</dt><dd><time dateTime="2026-05-26">26 May 2026</time></dd></div></dl><footer className="rf-profile-identity-completion">{PFI.check({'aria-hidden':true})}<div><strong>Profile complete</strong><span>8 of 8 steps completed</span></div></footer></article>
   <section className="rf-profile-account-overview" aria-label="Account overview" ref={heading} tabIndex="-1"><div className="rf-profile-account-metrics">
    <article className="rf-profile-metric"><div><span>Wallet balance</span>{PFI.wallet({'aria-hidden':true})}</div><strong>{money(245000)}</strong><p>Available for your next order</p></article>
    <article className="rf-profile-metric"><div><span>Outstanding balance</span>{PFI.doc({'aria-hidden':true})}</div><strong>{money(outstanding)}</strong><p>{pending.length} orders awaiting payment · excl. VAT</p></article>
    <article className="rf-profile-metric"><div><span>Pending actions</span>{WI.clock({'aria-hidden':true})}</div><strong>{pending.length.toLocaleString('en-GB')}</strong><p>Review the payment details below</p></article>
   </div>
  <section className="rf-profile-pending" aria-labelledby="profile-pending-title"><header><div><h3 id="profile-pending-title">Pending actions <span>{pending.length}</span></h3></div><span className="rf-profile-pending-demo">Example orders</span></header><ul>{pending.map(order=><li key={order.id}><span className="rf-profile-pending-icon">{PFI.doc({'aria-hidden':true})}</span><div><strong>Review outstanding payment</strong><p>{order.id} <span>·</span> <time dateTime={order.placedAt}>{purchaseDate(order.placedAt)}</time></p></div><div className="rf-profile-pending-amount"><strong>{money(order.totalCents)}</strong><span>Awaiting payment</span></div><button type="button" className="rf-btn" aria-label={'Preview payment details for '+order.id} onClick={()=>setSelected(order.id)}>View order<RControlIcon name="next"/></button></li>)}</ul><footer>Demo totals include shipping and exclude VAT.</footer></section></section>
  </div>
  <p className="rf-completed-profile-demo-note">Demo account data · example status and balances.</p>
  {detail&&<RDemoBillingOrder order={detail} onClose={()=>setSelected(null)}/>}
 </div>;
}
function RProfile({state,onSave,onTopup,onOpenOrder,onLanguage,onSettings,onContactVerify}){
 const [tab,setTab]=React.useState('about'),[languageOpen,setLanguageOpen]=React.useState(false),heading=React.useRef(null);
 const language=M.LANGUAGES.find(item=>item.code===M.preferredLanguage(state));
 const tabs=[['about','About me',PFI.user],['information','Account information',PFI.check],['billing','Billing history',PFI.doc],['topups','Top-up history',PFI.wallet]];
 const name=[state.contact.first,state.contact.last].filter(Boolean).join(' ')||'Your account',displayName=name==='Test Account'?'Test account':name,customerId=M.customerId(state);
 const date=s=>new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
 function select(id){setTab(id);requestAnimationFrame(()=>heading.current?.focus({preventScroll:true}));}
 return <div className="rf-profile-layout"><aside className="rf-profile-sidebar"><h1 tabIndex="-1">Profile</h1><nav aria-label="Profile sections">{tabs.map(([id,label,icon])=><button key={id} className={'rf-profile-nav '+(tab===id?'on':'')} aria-current={tab===id?'page':undefined} onClick={()=>select(id)}><span>{icon({'aria-hidden':true})}</span>{label}</button>)}</nav><div className="rf-profile-language"><button type="button" className="rf-profile-language-button" aria-label={'Language preference: '+language.name} aria-haspopup="dialog" aria-expanded={languageOpen} onClick={()=>setLanguageOpen(true)}><span className="rf-profile-language-icon">{PFI.globe({'aria-hidden':true})}</span><span><small>Language</small><strong lang={language.code}>{language.nativeName}</strong></span><RControlIcon name="down"/></button><button type="button" className={'rf-profile-nav rf-profile-settings '+(tab==='settings'?'on':'')} aria-current={tab==='settings'?'page':undefined} onClick={()=>select('settings')}><span>{PFI.settings({'aria-hidden':true})}</span>Settings<PFI.fwd aria-hidden="true"/></button><section className="rf-profile-account" aria-label="Your account identity"><span className="rf-profile-account-avatar" aria-hidden="true">{(state.contact.first||'T').slice(0,1).toUpperCase()}</span><div><strong>{displayName}</strong><span>Customer ID <b>{customerId}</b></span></div></section></div></aside><section className="rf-profile-content"><h2 ref={heading} tabIndex="-1" className={'rf-profile-heading '+(tab==='information'?'rf-verification-page-title':'')}>{tab==='about'?'Good morning, '+displayName:tab==='information'?'Account verification':tab==='settings'?'Settings':tabs.find(t=>t[0]===tab)[1]}</h2>
 {tab==='about'&&<RCompletedProfile state={state}/>}
 {tab==='information'&&<RProfileInformation state={state} onSave={onSave} onTopup={onTopup}/>}
 {tab==='settings'&&<RProfileSettings state={state} onSave={onSettings} onVerify={onContactVerify}/>}

 {tab==='billing'&&<RProfileBilling orders={state.orders} onOpenOrder={onOpenOrder}/>}
 {tab==='topups'&&<><div className="rf-profile-balance"><div><span>Account balance</span><strong>{money(state.balanceCents)}</strong><p>Demo credit for trying the balance payment flow.</p></div><button className="rf-profile-cta" onClick={onTopup}>Add demo balance {PFI.plus({'aria-hidden':true})}</button></div>{(state.topups||[]).length?<div className="rf-profile-table-wrap"><table className="rf-profile-table"><caption className="sr-only">Top-up history</caption><thead><tr><th>Date</th><th>Reference</th><th>Amount</th><th>Status</th></tr></thead><tbody>{state.topups.map(t=><tr key={t.id}><td>{date(t.createdAt)}</td><td>{t.id}</td><td><strong>{money(t.amountCents)}</strong></td><td><span className="rf-status ok">Added</span></td></tr>)}</tbody></table></div>:<div className="rf-profile-empty"><span className="rf-profile-empty-icon">{PFI.wallet({'aria-hidden':true})}</span><h3>No top-ups recorded yet</h3><p>New demo top-ups will appear here.</p></div>}</>}
 </section>{languageOpen&&<RLanguagePreference value={language.code} onSave={onLanguage} onClose={()=>setLanguageOpen(false)}/>}</div>;
}

function readRoute(hash){try{const route=decodeURIComponent(hash.replace(/^#/,''));return /^(shop|catalogue|again|saved|saved-orders|orders|profile|support|tickets|cart|checkout|product\/.+|order\/.+)$/.test(route)?route:'shop';}catch{return 'shop';}}
function RefinedApp(){
 const [state,setState]=React.useState(()=>M.read(RF_STORAGE)),stateRef=React.useRef(state),topupTrigger=React.useRef(null);
 const commandRoot=React.useRef(null),commandBefore=React.useRef(null),commandAnimation=React.useRef(null),commandFocus=React.useRef(false),commandValue=React.useRef(false);
 const [commandCompact,setCommandCompact]=React.useState(false);
 const [route,setRoute]=React.useState(()=>readRoute(location.hash));
 const [q,setQ]=React.useState(''),[scope,setScope]=React.useState('all'),[filters,setFilters]=React.useState({...FILTER_BASE}),[sort,setSort]=React.useState('featured'),[view,setView]=React.useState(()=>{try{return RF_STORAGE?.getItem('ppflowers.catalogue-view')==='grid'?'grid':'details'}catch{return 'details'}}),[modal,setModal]=React.useState(null),[toast,setToast]=React.useState(null),[storageError,setStorageError]=React.useState(RF_STORAGE?'':'This browser cannot save changes between visits.'),[replaceId,setReplaceId]=React.useState(null),[returnRoute,setReturnRoute]=React.useState('shop');
 React.useEffect(()=>{try{RF_STORAGE?.setItem('ppflowers.catalogue-view',view)}catch{}},[view]);
 const [preferredOfferId,setPreferredOfferId]=React.useState(null),[preferredQty,setPreferredQty]=React.useState(null),[catalogueQuantities,setCatalogueQuantities]=React.useState({});
 const [reorderTab,setReorderTab]=React.useState('products'),[reorderSort,setReorderSort]=React.useState('recent'),[reorderQuantities,setReorderQuantities]=React.useState({}),[reorderSelected,setReorderSelected]=React.useState([]);
 const [supportTarget,setSupportTarget]=React.useState(null);
 const [orderSearch,setOrderSearch]=React.useState(''),[saveName,setSaveName]=React.useState(''),[amount,setAmount]=React.useState('500'),[addError,setAddError]=React.useState('');const scrolls=React.useRef({}),catalogueRowScrolls=React.useRef({}),mainRef=React.useRef(null);
 function update(fn){const next=typeof fn==='function'?fn(stateRef.current):fn;stateRef.current=next;setState(next);try{M.persist(RF_STORAGE,next);setStorageError('')}catch{setStorageError('Changes are kept on this page, but this browser cannot save them.')}}
 React.useEffect(()=>{const handler=e=>{if(e.key===M.KEY){const next=M.read(RF_STORAGE);stateRef.current=next;setState(next)}};addEventListener('storage',handler);return()=>removeEventListener('storage',handler)},[]);
 React.useEffect(()=>{const pop=()=>{setRoute(readRoute(location.hash));setModal(null);setReplaceId(null)};addEventListener('popstate',pop);return()=>removeEventListener('popstate',pop)},[]);
 React.useEffect(()=>{requestAnimationFrame(()=>{window.scrollTo(0,scrolls.current[route]||0);mainRef.current?.querySelector('h1')?.focus({preventScroll:true})})},[route]);
 const commandEnabled=route==='shop'||route==='catalogue',compactSearch=commandEnabled&&commandCompact;
 React.useEffect(()=>{
  if(!commandEnabled){commandValue.current=false;setCommandCompact(false);return;}
  return setupCommandBarScroll(compact=>{
   if(compact===commandValue.current)return;
   commandValue.current=compact;
   commandFocus.current=compact&&!!document.activeElement?.closest('.rf-nav, .rf-command-fold, .rf-results-tools');
   commandBefore.current=commandRoot.current?.querySelector('.rf-command-slot>.rf-segmented-search')?.getBoundingClientRect();
   setCommandCompact(compact);
  });
 },[route,scope]);
 React.useLayoutEffect(()=>{
  const root=commandRoot.current,form=root?.querySelector('.rf-command-slot>.rf-segmented-search');
  commandAnimation.current?.cancel();
  if(compactSearch){
   const active=document.activeElement;
   if(commandFocus.current||active?.closest('.rf-nav, .rf-command-fold, .rf-results-tools'))form?.querySelector('input')?.focus({preventScroll:true});
  }
  commandAnimation.current=animateCommandSearch(form,commandBefore.current);commandBefore.current=null;commandFocus.current=false;
  return()=>commandAnimation.current?.cancel();
 },[compactSearch,route,scope]);
 React.useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(null),toast.undo?9000:4000);return()=>clearTimeout(timer)},[toast]);
 const offers=RF_OFFERS,totals=M.totals(state.cart),activeFilters=Object.entries(filters).filter(([k,v])=>k!=='cat'&&v!=='').length,extraFilters=[filters.colour,filters.maxPrice].filter(v=>v!=='').length;
 function go(r,{preserveCatalogue=false}={}){if(['shop','catalogue','saved','again'].includes(r)&&r!==route&&!preserveCatalogue){setQ('');setFilters({...FILTER_BASE});setScope('all')}if(!r.startsWith('product/'))setReplaceId(null);scrolls.current[route]=window.scrollY;setRoute(r);history.pushState(null,'','#'+encodeURIComponent(r));setModal(null)}
 function openSupport(ticket=null,compose=false){setSupportTarget({id:ticket?.id||null,compose});scrolls.current.tickets=0;go('tickets')}
 function saveSupport(result){M.persist(RF_STORAGE,result.state);stateRef.current=result.state;setState(result.state);setStorageError('');return result.ticket;}
 function browseCatalogue(options={}){go('catalogue');setQ(options.query||'');setFilters({...FILTER_BASE,...options.filters});setSort(options.sort||'featured');setScope(options.scope||'all');scrolls.current.catalogue=0;}
 function searchWebshop({query,grower,length}){if(['catalogue','saved','again'].includes(route)){setQ(query);setFilters(f=>({...f,grower,length}))}else browseCatalogue({query,filters:{grower,length}});}
 function openProduct(p,line=null,offerId=null,quantity=null){setPreferredQty(quantity);setPreferredOfferId(line?.id||offerId);setReturnRoute(route==='cart'?'cart':route);setReplaceId(line?.id||null);go('product/'+p.id)}
 function addOffer(o,n){try{update(s=>({...s,cart:M.add(replaceId?s.cart.filter(l=>l.id!==replaceId):s.cart,o,n)}));setToast({text:units(o,n)+' of '+o.name+' '+(replaceId?'updated.':'added to your basket.'),basket:true});if(replaceId){setReplaceId(null);go('cart')}}catch(e){setToast({text:e.message})}}
 function setLine(l,n){try{if(n===0)return removeLine(l.id);update(s=>({...s,cart:M.setQty(s.cart,l,n)}))}catch(e){setToast({text:e.message})}}
 function removeLine(id){const old=stateRef.current.cart.find(l=>l.id===id);update(s=>({...s,cart:s.cart.filter(l=>l.id!==id)}));setToast({text:old.name+' removed.',undo:()=>update(s=>({...s,cart:M.add(s.cart,old,old.qty)}))})}
 function clearBasket(){const old=stateRef.current.cart;update(s=>({...s,cart:[]}));setToast({text:'Basket cleared.',undo:()=>update(s=>({...s,cart:old.reduce((ls,l)=>M.add(ls,l,l.qty),s.cart)}))})}
 function toggleSaved(id){update(s=>({...s,saved:s.saved.includes(id)?s.saved.filter(x=>x!==id):[...s.saved,id]}))}
 function importLines(lines){update(s=>({...s,cart:lines.reduce((ls,l)=>M.add(ls,l,l.qty),s.cart)}));go('cart');setToast({text:lines.length+' product lines added. Review your basket.'})}
 function place(options){const result=M.place(stateRef.current,{...options,offers});if(!options.saveContact)result.state.contact=stateRef.current.contact;try{M.persist(RF_STORAGE,result.state)}catch{throw Error('Your order could not be saved in this browser. Your basket is still here; please try again.')}stateRef.current=result.state;setState(result.state);setStorageError('');go('order/'+result.order.id);if(result.order.payment==='transfer')setModal({type:'bank-transfer',order:result.order})}
 function resolve(issue){update(s=>({...s,cart:s.cart.map(l=>l.id===issue.id?{...issue.offer,qty:issue.type==='stock'?Math.floor(issue.offer.maxQty/issue.offer.step)*issue.offer.step:l.qty}:l)}))}
 const basketIssues=M.review(state.cart,offers,state.delivery);
 const shownOffer=p=>matchingOffers(p,q,filters,offers)[0]||offers.find(o=>o.id===baseOffer(p).id);
 const cataloguePool=route==='saved'?RF_PRODUCTS.filter(p=>state.saved.includes(p.id)):RF_PRODUCTS;
 const scopedProducts=cataloguePool.filter(p=>scope==='plants'?p.cat==='plants':scope==='flowers'?!['plants','accessories'].includes(p.cat):true);
 const scopedOffers=offers.filter(o=>scopedProducts.some(p=>p.id===o.productId));
 let shown=filterProducts(cataloguePool,q,filters,scope,offers);
 shown=[...shown].sort((a,b)=>sort==='low'?shownOffer(a).unitCents-shownOffer(b).unitCents:sort==='high'?shownOffer(b).unitCents-shownOffer(a).unitCents:sort==='name'?a.name.localeCompare(b.name):0);
 const groupedCatalogue=route==='catalogue';
 const offerRows=groupedCatalogue?catalogueOfferRows(cataloguePool,q,filters,scope,offers,sort):[];
 const offerCount=offerRows.reduce((total,row)=>total+row.items.length,0);
 const rowContext=JSON.stringify([scope,q,filters,sort,view]);
 function renderCatalogueCard({p,offer:o}){return <RCard key={o.id} p={p} offer={o} delivery={state.delivery} saved={state.saved.includes(p.id)} onSave={()=>toggleSaved(p.id)} quantity={catalogueQuantities[o.id]} onQuantity={n=>setCatalogueQuantities(v=>({...v,[o.id]:n}))} onOpen={n=>openProduct(p,null,o.id,n)} onAdd={addOffer} onDate={()=>setModal({type:'delivery'})} inCart={state.cart.find(l=>l.id===o.id)?.qty||0} details={view==='details'} offerContext={groupedCatalogue}/>;}
 const shopping=['shop','catalogue','again','saved'].includes(route);const chosen=route.startsWith('product/')?prod(route.slice(8)):null;const order=route.startsWith('order/')?state.orders.find(o=>o.id===route.slice(6)):null;
 React.useEffect(()=>{const names={shop:'Flower market',catalogue:scope==='flowers'?'Find flowers':scope==='plants'?'Find plants':'All products',saved:'Favourite products','saved-orders':'Saved orders',again:'Buy again',cart:'Your basket',checkout:'Review your order',orders:'My orders',profile:'Your account',support:'Customer service',tickets:'Support inbox'};document.title=(chosen?chosen.name:order?order.id:names[route]||'Flower market')+' · PP Flowers';},[route,scope,chosen?.id,order?.id]);
 const filteredOrders=state.orders.filter(o=>[o.id,...o.lines.map(l=>l.name)].join(' ').toLowerCase().includes(orderSearch.toLowerCase()));
 function title(name,note,eyebrow){return <div className="rf-title"><div>{eyebrow&&<div className="rf-eyebrow">{eyebrow}</div>}<h1 tabIndex="-1">{name}</h1>{note&&<p>{note}</p>}</div></div>}
 const departureControl=<button type="button" className="rf-departure-selector" aria-label={route==='again'?'Change reorder departure date':'Change catalogue departure date'} aria-haspopup="dialog" aria-expanded={modal?.type==='delivery'} onClick={()=>setModal({type:'delivery'})}><span className="rf-departure-calendar"><RControlIcon name="calendar"/></span><span className="rf-departure-value"><span>Departure date</span><strong>{M.dates().includes(state.delivery)?dayLabel(state.delivery):'Choose a date'}</strong></span><RControlIcon name="down"/></button>;
 function savedNavigation(){return <nav className="rf-saved-navigation" aria-label="Saved collections"><button aria-current={route==='saved'?'page':undefined} className={route==='saved'?'on':''} onClick={()=>go('saved')}>Favourite products <span>{state.saved.length}</span></button><button aria-current={route==='saved-orders'?'page':undefined} className={route==='saved-orders'?'on':''} onClick={()=>go('saved-orders')}>Saved orders <span>{state.drafts.length}</span></button></nav>;}
 function renderSavedOrders(){return <>{title('Saved','Your favourites and regular orders, in one place.')}{savedNavigation()}<RSavedOrders drafts={state.drafts} canSave={state.cart.length>0} onSave={()=>{setSaveName('My next order');setModal({type:'save'})}} onEdit={draft=>setModal({type:'draft',draft})} onReview={source=>setModal({type:'import',source})} onDelete={d=>{update(s=>({...s,drafts:s.drafts.filter(x=>x.id!==d.id)}));setToast({text:'Saved order removed.',undo:()=>update(s=>({...s,drafts:[d,...s.drafts]}))})}}/></>;}
 function catalogueView(){return <div className="rf-view" role="group" aria-label="Catalogue view"><button aria-pressed={view==='grid'} onClick={()=>setView('grid')}>Photos</button><button aria-pressed={view==='details'} onClick={()=>setView('details')}>Details</button></div>;}
 function catalogueSort(compact=false){
  const options=[['featured','Featured'],['low','Price: low to high'],['high','Price: high to low'],['name','Name: A–Z']];
  const select=<select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}>{options.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select>;
  return compact?<label className="rf-sort-pill"><RControlIcon name="sort"/><span>Sort by</span><strong>{{featured:'Featured',low:'Lowest price',high:'Highest price',name:'Name: A–Z'}[sort]}</strong><RControlIcon name="down"/>{select}</label>:<label className="rf-sort"><span className="sr-only">Sort products</span>{select}</label>;
 }
 function filterButton(){return <button className="rf-btn" aria-haspopup="dialog" aria-expanded={modal?.type==='filters'} onClick={()=>setModal({type:'filters'})}>{WI.sliders({})}Filters{extraFilters>0&&<span className="rf-badge">{extraFilters}</span>}</button>;}
 function resultCount(){return <span role="status"><b>{shown.length}</b> {shown.length===1?'product':'products'}{groupedCatalogue&&<> · <b>{offerCount}</b> grower {offerCount===1?'offer':'offers'}</>}{q?' matching “'+q+'”':''}</span>;}
 function appliedFilters(includeSearch=false){return (activeFilters>0||(includeSearch&&q))&&<div className="rf-applied">{includeSearch&&q&&<button onClick={()=>setQ('')} aria-label="Clear search">Search: {q} <span aria-hidden="true">×</span></button>}{Object.entries(filters).filter(([k,v])=>k!=='cat'&&v!=='').map(([k,v])=><button key={k} onClick={()=>setFilters(f=>({...f,[k]:''}))}>{k==='maxPrice'?'Up to €'+v:k==='length'?({short:'≤45 cm',medium:'46–65 cm',long:'≥66 cm'}[v]):v} ×</button>)}{activeFilters>0&&<button onClick={()=>setFilters({...FILTER_BASE})}>Clear all filters</button>}</div>;}
 function catalogueToolbar(){return <div className="rf-discovery-toolbar"><div className="rf-discovery-controls">{filterButton()}<span className="rf-filter-divider" aria-hidden="true"/><nav className="rf-cats" aria-label="Product categories">{(scope==='plants'?WS_PLANT_CATS:WS_CATS.filter(c=>scope==='flowers'?!['plants','accessories'].includes(c.id):true)).map(c=><button key={c.id} className={'rf-chip '+(filters.cat===c.id?'on':'')} aria-pressed={filters.cat===c.id} onClick={()=>setFilters(f=>({...f,cat:c.id}))}>{c.id==='all'?(scope==='plants'?'All plants':scope==='flowers'?'All flowers':c.label):c.label}</button>)}</nav><span className="rf-filter-divider" aria-hidden="true"/>{catalogueSort(true)}</div>{appliedFilters(true)}</div>;}
 function renderShop(){
  const name=route==='saved'?'Saved':scope==='flowers'?'Find flowers':scope==='plants'?'Find plants':'All products';
  return <>
   {route==='catalogue'?<><div className="sr-only"><h1 tabIndex="-1">{name}</h1>{resultCount()}</div><div className="rf-results-heading" inert={compactSearch?'':undefined} aria-hidden={compactSearch||undefined}><div className="rf-results-tools">{catalogueView()}</div></div></>:<div className="rf-shop-heading">{title(name,route==='saved'?'Your favourites and regular orders, in one place.':'','')}{catalogueView()}</div>}
   {route==='saved'&&savedNavigation()}
   {route!=='catalogue'&&<><div className="rf-catalogue-controls"><div className="rf-catalogue-tools">{q&&<button className="rf-textbtn" onClick={()=>setQ('')}>Clear search</button>}{filterButton()}{catalogueSort()}</div></div>{appliedFilters()}<div className="rf-results">{resultCount()}</div></>}
   {groupedCatalogue?<div className="rf-catalogue-rows">{offerRows.map(row=><RMarketRail key={row.id+rowContext} id={'category-'+row.id} title={row.title} intro={row.productCount+' '+(row.productCount===1?'variety':'varieties')+' · '+row.items.length+' grower '+(row.items.length===1?'offer':'offers')} items={row.items} itemLabel="grower offers" className="rf-catalogue-rail" trackClassName={(view==='details'?'rf-detail-grid':'rf-grid')+' rf-catalogue-track'} renderItem={renderCatalogueCard} positionStore={catalogueRowScrolls} positionKey={row.id+rowContext}/>)}</div>:<div className={view==='details'?'rf-detail-grid':'rf-grid'}>{shown.map(p=>renderCatalogueCard({p,offer:shownOffer(p)}))}</div>}
   {!shown.length&&<div className="rf-empty"><h2>No matching products</h2><p>{q?'No match for “'+q+'”. Try a shorter name or remove a filter.':route==='saved'?'Save a flower with the heart button to keep it here.':'Try a different category or remove a filter.'}</p><div className="rf-actions">{q&&<button className="rf-btn" onClick={()=>setQ('')}>Clear search</button>}<button className="rf-btn" onClick={()=>{setQ('');setFilters({...FILTER_BASE});setScope('all');if(route!=='catalogue')go('catalogue')}}>Browse all products</button></div></div>}
  </>;
 }
 function emptyBasket(){return <div className="rf-empty"><div className="rf-empty-icon">{WI.cart({})}</div><h2>Your next order starts here</h2><p>Choose your flowers and quantities. We’ll keep your basket as you browse.</p><button className="rf-btn dark" onClick={()=>go('shop')}>Explore the flower market →</button></div>}
 function renderBasket(){return <><div className="rf-basket-heading"><RBackButton className="rf-continue-shopping" onClick={()=>go('shop')}>Continue shopping</RBackButton>{title('Your basket','Review your growers, quantities and departure date.')}</div>{state.cart.length?<div className="rf-checkout"><section className="rf-panel rf-ordered-products" aria-labelledby="basket-products-title"><div className="rf-ordered-heading"><h2 id="basket-products-title">{state.cart.length} product {state.cart.length===1?'line':'lines'}</h2><button type="button" className="rf-textbtn" onClick={()=>{setSaveName('My next order');setModal({type:'save'})}}>Save this order</button></div>{basketIssues.length>0&&<div className="rf-checkout-product-issues"><ROfferReview issues={basketIssues} onResolve={resolve} onRemove={removeLine} onDate={()=>setModal({type:'delivery'})}/></div>}<RProductLinesTable lines={state.cart} subtotalCents={totals.subtotalCents} caption="Products in your basket. Edit quantities directly. Prices exclude VAT." regionLabel="Basket product details" editable onQty={setLine} onRemove={removeLine} onOffer={l=>openProduct(prod(l.productId),l)}/><div className="rf-basket-table-footer"><button type="button" className="rf-textbtn rf-danger-action" onClick={clearBasket}>Clear basket</button></div></section><RSummary lines={state.cart} delivery={state.delivery}>{totals.remainingCents?<button className="rf-btn dark" onClick={()=>go('shop')}>Add more flowers →</button>:<button className="rf-btn primary" onClick={()=>go('checkout')}>Review order →</button>}<button className="rf-textbtn" onClick={()=>setModal({type:'delivery'})}>Change departure date</button></RSummary></div>:emptyBasket()}</>}
 function renderOrders(){return <>{title('My orders','Track your orders and reorder your favourites.')}{state.orders.length>0&&<div className="rf-orders-toolbar"><div className="rf-search rf-order-search">{WI.search({})}<input aria-label="Search orders" placeholder="Search by order number or flower" value={orderSearch} onChange={e=>setOrderSearch(e.target.value)}/></div><button className="rf-btn" onClick={()=>go('again')}>Shop previously ordered</button></div>}{!state.orders.length?<div className="rf-empty"><h2>Your orders will appear here</h2><p>Once you place an order, you can review its details and buy it again here.</p><button className="rf-btn dark" onClick={()=>go('shop')}>Start shopping</button></div>:!filteredOrders.length?<div className="rf-empty"><h2>No matching orders</h2><button className="rf-btn" onClick={()=>setOrderSearch('')}>Clear search</button></div>:<ROrdersTable orders={filteredOrders} onOpen={order=>go('order/'+order.id)} onReview={order=>setModal({type:'import',source:order})}/>}</>}
 function renderOrder(){if(!order)return <>{title('Order not found','This order is not saved in this browser.')}<button className="rf-btn" onClick={()=>go('orders')}>View my orders</button></>;return <><RBackButton onClick={()=>go('orders')}>My orders</RBackButton>{title('Order '+order.id,'Placed '+new Date(order.placedAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}))}<div className="rf-confirm-banner"><span className={'rf-status '+(order.status==='confirmed'?'ok':'')}>{order.status==='confirmed'?'Confirmed':'Awaiting payment'}</span><p>{order.status==='confirmed'?'Paid with demo account balance.':'Bank transfer selected.'} This demo order is saved in this browser. No payment is taken, flowers dispatched or email sent.</p></div><div className="rf-checkout"><div><section className="rf-panel"><div className="rf-order-details"><div><h2>Departure</h2><b>{dayLabel(order.delivery)}</b><address className="rf-address">{order.contact.first} {order.contact.last}<br/>{order.contact.street}<br/>{order.contact.postcode} {order.contact.city}<br/>{order.contact.country}</address></div><div><h2>Contact & payment</h2><p>{order.contact.email}</p>{order.contact.phone&&<p>{order.contact.phone}</p>}<p>{order.payment==='balance'?'Account balance':'Bank transfer'}</p></div></div></section><ROrderLinesTable order={order}/></div><aside className="rf-summary"><h2>Order total</h2><div className="rf-sumrow"><span>Products</span><b>{money(order.subtotalCents)}</b></div><div className="rf-sumrow"><span>Shipping</span><span>{money(order.shippingCents)}</span></div><div className="rf-sumrow total"><span>Total <small>excl. VAT</small></span><strong>{money(order.totalCents)}</strong></div>{order.payment==='transfer'&&order.status==='awaiting_payment'&&<button type="button" className="rf-btn primary" data-payment-details onClick={()=>setModal({type:'bank-transfer',order})}>Bank transfer details<RControlIcon name="next"/></button>}<button className={order.payment==='transfer'&&order.status==='awaiting_payment'?'rf-btn':'rf-btn primary'} onClick={()=>setModal({type:'import',source:order})}>Review & buy again</button><button className="rf-btn" onClick={()=>go('shop')}>Continue shopping</button><p className="rf-fine">Prices, quantities, shipping address and departure date are saved with this order.</p></aside></div></>}
 function saveLanguagePreference(code){
  const next=M.setLanguagePreference(stateRef.current,code);
  try{M.persist(RF_STORAGE,next)}catch{throw Error('Your language preference could not be saved. Please try again.')}
  stateRef.current=next;setState(next);setStorageError('');setToast({text:'Language preference saved.'});
 }
 function saveAccountSettings(contact){
  const next=M.saveContactSettings(stateRef.current,contact);
  try{M.persist(RF_STORAGE,next)}catch{throw Error('Your changes could not be saved. Please try again.')}
  stateRef.current=next;setState(next);setStorageError('');
 }
 function saveContactVerificationPreview(kind,value){
  const next=M.completeContactPreview(stateRef.current,kind,value);
  try{M.persist(RF_STORAGE,next)}catch{throw Error('The verification preview could not be saved. Please try again.')}
  stateRef.current=next;setState(next);setStorageError('');
 }
 function openTopUp(){topupTrigger.current=document.activeElement;setAddError('');setModal({type:'topup'})}
 function closeTopUp(){setModal(null);requestAnimationFrame(()=>topupTrigger.current?.focus?.({preventScroll:true}))}
 function previewTopUp(e){e.preventDefault();try{const topup=M.prepareTopUp(stateRef.current,Math.round(Number(amount)*100));setAddError('');setModal({type:'topup-transfer',topup})}catch(e){setAddError(e.message)}}
 function confirmDemoTopUp(topup){
  const next=M.applyDemoTopUp(stateRef.current,topup);
  if(next!==stateRef.current){try{M.persist(RF_STORAGE,next)}catch{throw Error('Your demo credit could not be saved. Your balance has not changed; please try again.')}stateRef.current=next;setState(next);setStorageError('');setToast({text:money(topup.amountCents)+' added to your demo balance.'})}
  closeTopUp();
 }
 function renderAccount(){return <RProfile state={state} onLanguage={saveLanguagePreference} onSettings={saveAccountSettings} onContactVerify={saveContactVerificationPreview} onSave={(contact,profile,options={})=>{update(s=>({...s,contact,profile:{...s.profile,...profile}}));if(!options.silent)setToast({text:options.message||'Account information saved.'})}} onTopup={openTopUp} onOpenOrder={o=>go('order/'+o.id)}/>;}
 function renderHelp(){return <>{title('Customer service','Ordering, departures and your account.')}<div className="rf-help-grid">{[['How do quantities work?','Every quantity is the actual number of stems, plants or pieces. Each product shows its order multiple and line total. Changing growers carries the selected price, length and origin into your basket.'],['What is the minimum order?','The demo uses a €500 product minimum, with €24.50 shipping per order. Your progress and shipping are visible before checkout. Displayed totals exclude VAT.'],['Can I choose a departure date?','Yes. The date picker starts with tomorrow, including weekends. Choose a later date if needed. Departure is the day we send your order; arrival depends on the logistics company. Offers must be available by your departure date. Dates in this prototype are illustrative.'],['How are repeat orders handled?','Save your basket as a named order, or choose Buy again from an earlier order. Review current offers and adjust quantities before adding them to your basket.'],['Can I get back to my basket?','Your basket is retained when you browse, open My orders or reload this page, provided browser storage is available. The basket button shows your current product lines.']].map(([h,p])=><section className="rf-panel" key={h}><h2>{h}</h2><p>{p}</p></section>)}</div><button className="rf-btn dark" onClick={()=>openSupport()}>Still have questions? Get in touch <RControlIcon name="next"/></button></>}
 return <div ref={commandRoot} className={'rf-app '+(commandEnabled?'rf-command-app ':'')+(compactSearch?'rf-command-collapsed ':'')+(route==='profile'?'rf-profile-app':route==='shop'?'rf-market-app':route==='tickets'?'rf-support-app':'')+(state.cart.length?' rf-has-basket':'')}><a className="rf-skip" href="#main-content" onClick={e=>{e.preventDefault();mainRef.current?.focus();mainRef.current?.scrollIntoView({block:'start'})}}>Skip to main content</a><header className="rf-header rf-reference-header"><div className="rf-top"><button className="rf-logo" aria-label="PP Flowers home" onClick={()=>go('shop')}><img src={window.__resources.logoDark} alt="PP Flowers"/></button><nav className="rf-nav" aria-label="Main navigation" inert={compactSearch?'':undefined} aria-hidden={compactSearch||undefined}><button className={route==='shop'?'on':''} aria-current={route==='shop'?'page':undefined} onClick={()=>go('shop')}><span aria-hidden="true">✨</span> Recommended</button><button className={route==='catalogue'&&scope==='flowers'?'on':''} aria-current={route==='catalogue'&&scope==='flowers'?'page':undefined} onClick={()=>browseCatalogue({scope:'flowers'})}><span aria-hidden="true">🌷</span> Find Flowers</button><button className={route==='catalogue'&&scope==='plants'?'on':''} aria-current={route==='catalogue'&&scope==='plants'?'page':undefined} onClick={()=>browseCatalogue({scope:'plants'})}><span aria-hidden="true">🪴</span> Find Plants</button><button className={route==='again'?'on':''} aria-current={route==='again'?'page':undefined} onClick={()=>go('again')}><span aria-hidden="true"><RReorderMark/></span> Buy again</button></nav><div className="rf-tools"><button className={'rf-service-link '+(['support','tickets'].includes(route)?'on':'')} onClick={()=>go('support')}>Customer service</button><button className={'rf-icon '+(route==='profile'?'active':'')} aria-label="My account" title="My account" onClick={()=>go('profile')}>{WI.user({'aria-hidden':true})}</button><button className={'rf-icon '+(route==='orders'?'active':'')} aria-label="My orders" title="My orders" onClick={()=>go('orders')}>{WI.box({'aria-hidden':true})}</button><button className={'rf-icon '+(['saved','saved-orders'].includes(route)?'active':'')} aria-label="Saved favourites and orders" title="Saved favourites and orders" onClick={()=>go('saved')}>{WI.heart({'aria-hidden':true})}</button><button className="rf-icon rf-reference-cart" aria-label={'Basket, '+state.cart.length+(state.cart.length===1?' line':' lines')} title="Basket" onClick={()=>go('cart')}>{WI.cart({'aria-hidden':true})}{state.cart.length>0&&<span className="rf-cart-count">{state.cart.length}</span>}</button></div></div></header>{(shopping||chosen)&&route!=='again'&&<RHeaderSearch command={commandEnabled} compact={compactSearch} context={route} key={route+':'+scope} scope={chosen?.cat==='plants'?'plants':scope} query={q} filters={filters} offers={['catalogue','saved','again'].includes(route)?scopedOffers:offers} onSearch={searchWebshop} toolbar={route==='catalogue'?catalogueToolbar():null} departureControl={['catalogue','saved','again'].includes(route)?departureControl:null}/>}{storageError&&<div className="rf-warning rf-storage" role="alert">{storageError}</div>}<main id="main-content" tabIndex="-1" ref={mainRef} className={'rf-main '+(route==='profile'?'rf-profile-main':route==='shop'?'rf-market-main':route==='again'?'rf-again-main':route==='tickets'?'rf-support-main':(shopping||route==='saved-orders')?'rf-shop-main':'')}>{route!=='profile'&&route!=='shop'&&route!=='tickets'&&!chosen&&!M.dates().includes(state.delivery)&&<div className="rf-date-notice" role="status"><div><b>Choose a new departure date</b><span>Your previous departure date is no longer available. Your basket is still saved.</span></div><button className="rf-btn" onClick={()=>setModal({type:'delivery'})}>Choose date →</button></div>}{route==='shop'?<RMarket offers={offers} state={state} onBrowse={browseCatalogue} onOpen={openProduct} onAdd={addOffer} onSave={toggleSaved} onDate={()=>setModal({type:'delivery'})} onSaved={()=>go('saved')}/>:route==='again'?<RBuyAgain orders={state.orders} sampleOrder={sampleBulkPurchase(offers)} offers={offers} cart={state.cart} delivery={state.delivery} quantities={reorderQuantities} selected={reorderSelected} onSelect={setReorderSelected} onQuantity={(id,n)=>setReorderQuantities(v=>({...v,[id]:n}))} query={q} onQuery={setQ} tab={reorderTab} onTab={tab=>{setReorderTab(tab);setQ('')}} sort={reorderSort} onSort={setReorderSort} onReview={source=>setModal({type:'import',source})} onOpen={openProduct} onAddMany={importLines} onDate={()=>setModal({type:'delivery'})} onBrowse={browseCatalogue} onOrder={id=>go('order/'+id)} onBasket={()=>go('cart')} departureControl={departureControl}/>:route==='saved-orders'?renderSavedOrders():shopping?renderShop():chosen?<RProduct key={chosen.id} p={chosen} offers={offers} state={state} replaceId={replaceId} preferredOfferId={preferredOfferId} preferredQty={preferredQty} backLabel={returnRoute==='shop'?'flower market':'products'} onDate={()=>setModal({type:'delivery'})} onAdd={addOffer} onSave={()=>toggleSaved(chosen.id)} onBack={()=>{setReplaceId(null);go(returnRoute,{preserveCatalogue:true})}}/>:route==='cart'?renderBasket():route==='checkout'?state.cart.length?<RCheckout state={state} offers={offers} onBack={()=>go('cart')} onPlace={place} onTopup={openTopUp} onResolve={resolve} onRemove={removeLine} onDate={()=>setModal({type:'delivery'})}/>:<>{title('Your basket is empty')}{emptyBasket()}</>:route==='orders'?renderOrders():route.startsWith('order/')?renderOrder():route==='profile'?renderAccount():route==='support'?renderHelp():route==='tickets'?<RSupportInbox state={state} target={supportTarget} onCreate={fields=>saveSupport(M.createTicket(stateRef.current,fields))} onReply={(id,text,files)=>saveSupport(M.replyTicket(stateRef.current,id,text,new Date(),files))} onHelp={()=>go('support')} onOrder={id=>go('order/'+id)}/>:<>{title('Let’s get you back to shopping')}<button className="rf-btn" onClick={()=>go('shop')}>Open flower market</button></>}</main><footer className="rf-footer"><span>PP Flowers · Wholesale, thoughtfully.</span><button className="rf-textbtn" onClick={()=>go('support')}>Shipping & buying help</button><button className="rf-textbtn" onClick={()=>go('profile')}>Your account</button></footer>{state.cart.length>0&&shopping&&<div className="rf-mobile-basket"><div className="rf-bar-title"><b>Your next order</b><span>{state.cart.length} product {state.cart.length===1?'line':'lines'} · departure {dayLabel(state.delivery)}</span></div><div className="rf-order-progress"><progress aria-label="Progress toward order minimum" max={M.MIN} value={Math.min(totals.subtotalCents,M.MIN)}/><span>{totals.remainingCents?money(totals.remainingCents)+' to the €500 minimum':'✓ Order minimum reached'}</span></div><div><b>{money(totals.subtotalCents)}</b><span>Products · excl. shipping & VAT</span></div><button className="rf-btn primary" onClick={()=>go('cart')}>Review basket →</button></div>}{toast&&<div className="rf-toast" role="status"><span>{toast.text}</span>{toast.basket&&route!=='cart'&&<button onClick={()=>{setToast(null);go('cart')}}>View basket →</button>}{toast.undo&&<button onClick={()=>{try{toast.undo();setToast(null)}catch(e){setToast({text:e.message})}}}>Undo</button>}</div>}
 {modal?.type==='bank-transfer'&&<RBankTransfer order={modal.order} onClose={()=>{setModal(null);requestAnimationFrame(()=>mainRef.current?.querySelector('[data-payment-details]')?.focus())}}/>}
 {modal?.type==='filters'&&<RFilters filters={filters} products={cataloguePool} query={q} scope={scope} offers={offers} onClose={()=>setModal(null)} onApply={f=>{setFilters(f);setModal(null)}}/>}
 {modal?.type==='import'&&<RImport source={modal.source} offers={offers} cart={state.cart} delivery={state.delivery} onClose={()=>setModal(null)} onImport={importLines}/>}
 {modal?.type==='draft'&&<RDraft draft={modal.draft} onClose={()=>setModal(null)} onSave={d=>{update(s=>({...s,drafts:s.drafts.map(x=>x.id===d.id?d:x)}));setModal(null);setToast({text:'Saved order updated.'})}} onImport={d=>setModal({type:'import',source:d})}/>}
 {modal?.type==='save'&&<RModal title="Save your order" onClose={()=>setModal(null)}><p>Keep this basket as a reusable order. You can edit it from Saved.</p><form onSubmit={e=>{e.preventDefault();if(!saveName.trim()||!state.cart.length)return;update(s=>({...s,drafts:[{id:'draft-'+Date.now(),name:saveName.trim(),lines:M.clone(s.cart)},...s.drafts]}));setModal(null);setToast({text:'Order saved. Find it under Saved.'})}}><label className="rf-field">Order name<input required maxLength={70} value={saveName} onChange={e=>setSaveName(e.target.value)} placeholder="Friday shop flowers"/></label><div className="rf-modal-actions"><button type="button" className="rf-btn" onClick={()=>setModal(null)}>Cancel</button><button className="rf-btn primary" disabled={!saveName.trim()||!state.cart.length}>Save order</button></div></form></RModal>}
 {modal?.type==='delivery'&&<RDepartureDate state={state} onClose={()=>setModal(null)} onApply={date=>{update(s=>({...s,delivery:date}));setModal(null)}}/>}
 {modal?.type==='topup'&&<RModal title="Add demo balance" onClose={closeTopUp}><p>Choose an amount to preview the bank-transfer QR code. No real money is added or charged.</p><form onSubmit={previewTopUp}><label className="rf-field">Amount in euros<input type="number" min="50" max="100000" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} inputMode="decimal" required/></label>{addError&&<p className="rf-error" role="alert">{addError}</p>}<div className="rf-modal-actions"><button type="button" className="rf-btn" onClick={closeTopUp}>Cancel</button><button className="rf-btn primary">Add demo balance</button></div></form></RModal>}
 {modal?.type==='topup-transfer'&&<RTopUpTransfer topup={modal.topup} onClose={closeTopUp} onBack={()=>setModal({type:'topup'})} onConfirm={confirmDemoTopUp}/>}
 </div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<RefinedApp/>);
