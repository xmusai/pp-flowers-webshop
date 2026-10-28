const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/core.js');
const now = new Date('2026-09-08T09:00:00');
const day = M.dates(now)[1];
const rose = {id:'r-rednaomi::Porta Nova',productId:'r-rednaomi',name:'Red Naomi',grower:'Porta Nova',origin:'Holland',stemCm:70,grade:'A1 Extra',unit:'stem',unitCents:24,step:10,minQty:10,maxQty:720,availableDate:M.dates(now)[0]};
const tulip = {...rose,id:'t-stronggold::Maxima',productId:'t-stronggold',name:'Strong Gold',grower:'Maxima',unitCents:19,stemCm:38,maxQty:10000};
const alternate = {...rose,id:'r-rednaomi::Black Tulip',grower:'Black Tulip',origin:'Ethiopia',stemCm:65,grade:'A1',unitCents:26,maxQty:240,availableDate:day};
function basket(){return M.add(M.add([],rose,10),tulip,3000)}
function options(overrides={}){return {contact:{...M.defaultContact,street:'Keizersgracht 100'},delivery:day,payment:'transfer',offers:[rose,tulip,alternate],now,...overrides}}
test('€596.90 regression: stems never become bunches in saved orders',()=>{const s={...M.initial(),cart:basket()};const t=M.totals(s.cart);assert.deepEqual(t,{subtotalCents:57240,shippingCents:2450,totalCents:59690,remainingCents:0});const result=M.place(s,options());assert.equal(result.order.totalCents,59690);assert.equal(result.order.lines[1].qty,3000);assert.equal(result.order.lines[1].unitCents,19);assert.equal(result.state.cart.length,0);assert.equal(result.order.status,'awaiting_payment');});
test('selected grower keeps its exact identity, origin, length and price',()=>{const ls=M.add([],alternate,10);assert.equal(ls[0].unitCents,26);assert.equal(ls[0].origin,'Ethiopia');assert.equal(ls[0].stemCm,65);assert.equal(M.totals(ls).subtotalCents,260);const both=M.add(ls,rose,10);assert.equal(both.length,2);});
test('one serialized record preserves basket, quantities and grower through reload',()=>{const mem=new Map(),storage={getItem:k=>mem.get(k),setItem:(k,v)=>mem.set(k,v)};const s={...M.initial(),cart:M.add(basket(),alternate,10),delivery:day};M.persist(storage,s);assert.deepEqual(M.read(storage,now).cart,s.cart);assert.equal(M.read(storage,now).delivery,day);});
test('saved order is an independent snapshot of exact address and chosen delivery',()=>{const s={...M.initial(),cart:basket()};const opt=options();const {order}=M.place(s,opt);opt.contact.street='Later edit';s.cart[0].qty=700;s.cart[1].unitCents=999;assert.equal(order.contact.street,'Keizersgracht 100');assert.equal(order.delivery,day);assert.equal(order.lines[0].qty,10);assert.equal(order.totalCents,59690);});
test('minimum excludes delivery and order cannot be empty',()=>{assert.throws(()=>M.place({...M.initial(),cart:[]},options()),/minimum/);const cart=M.add([],tulip,2600);assert.equal(M.totals(cart).remainingCents,600);assert.throws(()=>M.place({...M.initial(),cart},options()),/minimum/);});
test('quantity edits enforce actual unit multiples, minimum and stock',()=>{for(const n of [9,11,721,NaN,10.5])assert.throws(()=>M.add([],rose,n));assert.equal(M.setQty(M.add([],rose,80),rose,10)[0].qty,10);assert.equal(M.setQty(M.add([],rose,80),rose,0).length,0);assert.throws(()=>M.add(M.add([],rose,720),rose,10),/available/);});
test('email and required address fields block submission; optional phone does not',()=>{const c={...M.defaultContact,email:'invalid',street:'   '};assert.deepEqual(Object.keys(M.validateContact(c)),['email','street']);assert.throws(()=>M.place({...M.initial(),cart:basket()},options({contact:c})),/details/);assert.deepEqual(M.validateContact(M.defaultContact),{});});
test('past dates and an earlier-than-available delivery cannot pass',()=>{assert.throws(()=>M.place({...M.initial(),cart:basket()},options({delivery:'2026-09-01'})),/date/);const cart=M.add(M.add([],alternate,10),tulip,3000);assert.equal(M.review(cart,[alternate,tulip],M.dates(now)[0])[0].type,'delivery');assert.throws(()=>M.place({...M.initial(),cart},options({delivery:M.dates(now)[0]})),/changed offers/);});
test('price and stock changes require explicit review without silently repricing',()=>{const s={...M.initial(),cart:basket()};const offers=[{...rose,unitCents:29},tulip];assert.equal(M.review(s.cart,offers,day)[0].type,'price');assert.throws(()=>M.place(s,options({offers})),/changed offers/);assert.equal(s.cart[0].unitCents,24);assert.equal(M.review(s.cart,[{...rose,maxQty:0},tulip],day)[0].type,'stock');assert.equal(M.review(s.cart,[tulip],day)[0].type,'stock');});
test('balance eligibility uses total with delivery and deducts exactly that amount',()=>{const s={...M.initial(),cart:basket(),balanceCents:59689};assert.throws(()=>M.place(s,options({payment:'balance'})),/balance/);s.balanceCents=60000;const r=M.place(s,options({payment:'balance'}));assert.equal(r.state.balanceCents,310);assert.equal(r.order.status,'confirmed');assert.throws(()=>M.place(r.state,options({payment:'balance'})),/minimum/);assert.equal(r.state.balanceCents,310);});
test('adding a repeat order is atomic when one line exceeds stock',()=>{const original=M.add([],rose,720);assert.throws(()=>basket().reduce((lines,l)=>M.add(lines,l,l.qty),original));assert.equal(original.length,1);assert.equal(original[0].qty,720);});
test('search combines name, grower and 70cm or 70 cm tokens',()=>{const products=[{...rose,sub:'Velvet red garden rose',cat:'roses',colour:'red'}, {...tulip,cat:'tulips',colour:'yellow'}];assert.equal(M.search(products,'Red Naomi 70cm').length,1);assert.equal(M.search(products,'Porta Nova 70 cm').length,1);assert.equal(M.search(products,'Red Naomi 65cm').length,0);assert.equal(M.search(products,'yellow').length,1);});
test('departure dates start tomorrow including weekends and corrupt browser data has a safe fallback',()=>{const ds=M.dates(new Date('2026-09-11T09:00:00'));assert.equal(ds[0],'2026-09-12');assert.equal(ds[1],'2026-09-13');assert.equal(ds[2],'2026-09-14');assert.equal(ds.length,10);assert.equal(M.read({getItem(){throw Error('Storage disabled')}}).cart.length,0);assert.equal(M.read({getItem(){return '{broken'}}).cart.length,0);});
test('demo top-ups preserve balance and history together, including older saved accounts',()=>{
 const original={...M.initial(),balanceCents:310};delete original.topups;
 const first=M.topUp(original,5000,now),second=M.topUp(first,7500,now);
 assert.equal(original.balanceCents,310);assert.equal(original.topups,undefined);
 assert.equal(first.balanceCents,5310);assert.equal(first.topups.length,1);
 assert.equal(second.balanceCents,12810);assert.equal(second.topups.length,2);
 assert.notEqual(second.topups[0].id,second.topups[1].id);
 assert.deepEqual(second.topups[1],first.topups[0]);assert.equal(second.topups[0].amountCents,7500);
 assert.equal(second.topups[0].createdAt,now.toISOString());
 for(const invalid of [4999,10000001,NaN,5000.5])assert.throws(()=>M.topUp(second,invalid),/amount/);
 const mem=new Map(),storage={getItem:k=>mem.get(k),setItem:(k,v)=>mem.set(k,v)};
 M.persist(storage,second);assert.deepEqual(M.read(storage),second);
});

test('tomorrow defaults follow calendar boundaries and never reuse today',()=>{
 for(const [stamp,tomorrow] of [['2026-09-23T23:59:00','2026-09-24'],['2026-09-26T09:00:00','2026-09-27'],['2026-12-31T23:59:00','2027-01-01'],['2028-02-28T09:00:00','2028-02-29'],['2026-03-28T23:59:00','2026-03-29'],['2026-10-24T23:59:00','2026-10-25']]){
  const clock=new Date(stamp),days=M.dates(clock);
  assert.equal(days[0],tomorrow,stamp);assert.equal(M.initial(clock).delivery,tomorrow);assert.equal(new Set(days).size,10);
 }
});
test('expired saved departures reset to tomorrow without changing basket or order history',()=>{
 const clock=new Date('2026-09-23T12:00:00'),order={id:'existing-order',delivery:'2026-09-10',lines:basket()};
 const saved={...M.initial(now),delivery:'2026-09-23',cart:basket(),orders:[order]};
 const storage={getItem:()=>JSON.stringify(saved)};
 const restored=M.read(storage,clock);
 assert.equal(restored.delivery,'2026-09-24');assert.deepEqual(restored.cart,saved.cart);assert.deepEqual(restored.orders,[order]);assert.equal(saved.delivery,'2026-09-23');
 saved.delivery='2026-09-27';assert.equal(M.read(storage,clock).delivery,'2026-09-27');
 saved.delivery='';assert.equal(M.read(storage,clock).delivery,'2026-09-24');
});
test('weekend departure is accepted while today and premature departures remain blocked',()=>{
 const clock=new Date('2026-09-25T09:00:00'),state={...M.initial(clock),cart:basket()};
 const result=M.place(state,options({now:clock,delivery:'2026-09-26'}));
 assert.equal(result.order.delivery,'2026-09-26');
 assert.throws(()=>M.place(state,options({now:clock,delivery:'2026-09-25'})),/departure date/);
 const later=[{...rose,availableDate:'2026-09-27'},tulip];
 assert.throws(()=>M.place(state,options({now:clock,delivery:'2026-09-26',offers:later})),/changed offers/);
});
test('support tickets persist with their message and order reference without changing shopping data',()=>{
 const state={...M.initial(now),cart:basket(),orders:[{id:'PP-EXISTING',placedAt:now.toISOString()}]};
 const before=M.clone(state),fields={email:' buyer@example.com ',subject:' Departure question ',message:' Can I choose Friday?\nThank you. ',orderId:'PP-EXISTING'};
 const first=M.createTicket(state,fields,now);
 const second=M.createTicket(first.state,fields,now);
 assert.notEqual(first.ticket.id,second.ticket.id);
 assert.equal(first.ticket.subject,'Departure question');assert.equal(first.ticket.email,'buyer@example.com');assert.equal(first.ticket.message,'Can I choose Friday?\nThank you.');
 assert.equal(first.ticket.orderId,'PP-EXISTING');assert.equal(first.ticket.status,'not_sent');assert.deepEqual(state,before);
 const mem=new Map(),storage={getItem:k=>mem.get(k),setItem:(k,v)=>mem.set(k,v)};
 M.persist(storage,second.state);const restored=M.read(storage,now);
 assert.deepEqual(restored.tickets,[second.ticket,first.ticket]);assert.deepEqual(restored.cart,state.cart);assert.deepEqual(restored.orders,state.orders);
});
test('invalid tickets are blocked and older saved accounts get an empty ticket history',()=>{
 const state=M.initial(now),valid={email:'buyer@example.com',subject:'Question',message:'Please help with my order.',orderId:''};
 for(const bad of [{email:'wrong'},{subject:'   '},{message:'\n '},{subject:'x'.repeat(121)},{message:'x'.repeat(5001)},{orderId:'UNKNOWN'}]){
  assert.throws(()=>M.createTicket(state,{...valid,...bad},now),/ticket details/);
 }
 assert.deepEqual(M.validateTicket(valid,state.orders),{});
 const legacy={...state};delete legacy.tickets;
 assert.deepEqual(M.read({getItem:()=>JSON.stringify(legacy)},now).tickets,[]);
 assert.equal(state.tickets.length,0);
});
