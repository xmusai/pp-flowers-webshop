const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Babel=require('../vendor/babel.cjs');
const M=require('../src/core.js');
const input=fs.readFileSync('src/catalogue.jsx','utf8')+'\n'+fs.readFileSync('src/app.jsx','utf8')+'\nglobalThis.fixture={RF_PRODUCTS,RF_OFFERS,FILTER_BASE,filterProducts,matchingOffers,featuredOffer,productOfferOverview,readRoute,catalogueOfferRows,reorderItems,reorderQuantity,reorderReviewLines,reorderBatch,importReviewBatch,marketMonth,seasonalRecommendations,qualityRecommendations,savedRecommendations};';
const ctx={window:{PPModel:M},React:{createElement:()=>({})},ReactDOM:{createRoot:()=>({render(){}})},document:{getElementById(){return null}}};
vm.runInNewContext(Babel.transform(input,{presets:['react']}).code,ctx);
const {RF_PRODUCTS,RF_OFFERS,FILTER_BASE,filterProducts,matchingOffers,featuredOffer,productOfferOverview,readRoute,catalogueOfferRows,reorderItems,reorderQuantity,reorderReviewLines,reorderBatch,importReviewBatch,marketMonth,seasonalRecommendations,qualityRecommendations,savedRecommendations}=ctx.fixture;
test('retained and additional mock products have usable unique grower offers',()=>{assert.equal(RF_PRODUCTS.length,48);assert.equal(new Set(RF_PRODUCTS.map(p=>p.id)).size,RF_PRODUCTS.length);assert.equal(new Set(RF_OFFERS.map(o=>o.id)).size,RF_OFFERS.length);for(const p of RF_PRODUCTS){const offers=RF_OFFERS.filter(o=>o.productId===p.id);assert.ok(offers.length);for(const o of offers){assert.ok(Number.isSafeInteger(o.unitCents)&&o.unitCents>0,o.id);assert.equal(M.qtyError(o,o.minQty),'',o.id);}}});
test('search finds an alternate grower with its exact length, origin and price',()=>{const query='Red Naomi Black Tulip 65cm';const ps=filterProducts(RF_PRODUCTS,query,FILTER_BASE,'all');assert.equal(ps.length,1);const os=matchingOffers(ps[0],query,FILTER_BASE);assert.equal(os.length,1);assert.equal(os[0].grower,'Black Tulip');assert.equal(os[0].stemCm,65);assert.equal(os[0].origin,'Ethiopia');assert.equal(os[0].unitCents,26);});
test('combined grower, colour, length, category and price filters all constrain the offer',()=>{const f={cat:'roses',grower:'Black Tulip',colour:'red',length:'medium',maxPrice:'0.30'};const ps=filterProducts(RF_PRODUCTS,'Red Naomi',f,'all');assert.equal(ps.length,1);const o=matchingOffers(ps[0],'Red Naomi',f)[0];assert.equal(o.grower,'Black Tulip');assert.ok(o.stemCm<=65);assert.ok(o.unitCents<=30);assert.equal(filterProducts(RF_PRODUCTS,'Red Naomi',{...f,maxPrice:'0.25'},'all').length,0);assert.equal(filterProducts(RF_PRODUCTS,'Red Naomi',{...f,colour:'blue'},'all').length,0);});
test('plant scope and flower scope cannot show each other’s categories',()=>{assert.ok(filterProducts(RF_PRODUCTS,'',FILTER_BASE,'plants').every(p=>p.cat==='plants'));assert.ok(filterProducts(RF_PRODUCTS,'',FILTER_BASE,'flowers').every(p=>!['plants','accessories'].includes(p.cat)));});
test('delivery filter keeps only available, in-stock offers without losing the selected grower constraints',()=>{
 const p=RF_PRODUCTS[0],days=M.dates();
 const original=RF_OFFERS.filter(o=>o.productId===p.id);
 const offers=[{...original[0],maxQty:0,availableDate:days[0]},{...original[1],availableDate:days[1]},{...original[2],availableDate:days[0]}];
 const early=matchingOffers(p,'',FILTER_BASE,offers,days[0]);
 assert.equal(early.length,1);assert.equal(early[0].id,offers[2].id);
 assert.equal(matchingOffers(p,'',{...FILTER_BASE,grower:offers[1].grower},offers,days[0]).length,0);
 assert.equal(matchingOffers(p,'',{...FILTER_BASE,grower:offers[1].grower},offers,days[1])[0].id,offers[1].id);
 assert.equal(filterProducts([p],'',{...FILTER_BASE,grower:offers[1].grower},'all',offers,days[0]).length,0);
 assert.equal(filterProducts([p],'',{...FILTER_BASE,grower:offers[1].grower},'all',offers,days[1]).length,1);
});
test('an expired delivery cannot produce an available offer and turning off the date filter restores browsing',()=>{
 const p=RF_PRODUCTS[0];
 assert.equal(matchingOffers(p,'',FILTER_BASE,RF_OFFERS,'2000-01-01').length,0);
 assert.ok(matchingOffers(p,'',FILTER_BASE,RF_OFFERS,null).length>0);
});

test('featured offers prioritize eligible stock and price, with an honest later-date fallback',()=>{
 const p=RF_PRODUCTS[0],days=M.dates(),base=RF_OFFERS.find(o=>o.productId===p.id);
 const offers=[{...base,id:'sold-out',unitCents:10,maxQty:0,availableDate:days[0]},{...base,id:'later',unitCents:20,availableDate:days[1]},{...base,id:'ready',unitCents:30,availableDate:days[0]}];
 assert.equal(featuredOffer(p.id,offers,days[0]).id,'ready');
 assert.equal(featuredOffer(p.id,offers,days[1]).id,'later');
 assert.equal(featuredOffer(p.id,offers.slice(0,2),days[0]).id,'later');
 assert.equal(featuredOffer(p.id,offers.slice(0,1),days[0]),null);
});


test('product overview compares the chosen length without advertising sold-out prices',()=>{
 const days=M.dates(),base=RF_OFFERS[0];
 const offers=[{...base,id:'sold-out',stemCm:40,unitCents:10,maxQty:0},{...base,id:'ready',stemCm:50,unitCents:30,availableDate:days[0]},{...base,id:'later',stemCm:50,unitCents:50,availableDate:days[1]},{...base,id:'long',stemCm:60,unitCents:70,availableDate:days[0]}];
 const all=productOfferOverview(offers,days[0]);
 assert.equal(all.lowest,30);assert.equal(all.highest,70);assert.equal(all.ready,2);
 assert.equal(Array.from(all.lengths).join(','),'40,50,60');
 const medium=productOfferOverview(offers,days[0],50);
 assert.equal(medium.visible.length,2);assert.equal(medium.lowest,30);assert.equal(medium.highest,50);assert.equal(medium.ready,1);
 assert.equal(productOfferOverview(offers,days[1],50).ready,2);
});
test('product overview does not imply availability for expired dates or sold-out lengths',()=>{
 const base={...RF_OFFERS[0],stemCm:50,maxQty:0};
 const sold=productOfferOverview([base],M.dates()[0],50);
 assert.equal(sold.lowest,null);assert.equal(sold.highest,null);assert.equal(sold.ready,0);
 const expired=productOfferOverview([{...base,maxQty:base.minQty}], '2000-01-01');
 assert.equal(expired.dateValid,false);assert.equal(expired.ready,0);
});

test('route fragments handle malformed encoding without crashing and retain product deep links',()=>{
 assert.equal(readRoute('#product%2Fr-rednaomi'),'product/r-rednaomi');
 assert.equal(readRoute('#checkout'),'checkout');
 assert.equal(readRoute('#saved-orders'),'saved-orders');
 assert.equal(readRoute('#saved'),'saved');
 assert.equal(readRoute('#again'),'again');
 assert.equal(readRoute('#tickets'),'tickets');
 assert.equal(readRoute('#%E0%A4%A'),'shop');
 assert.equal(readRoute('#not-a-page'),'shop');
});


test('flower rows partition every matching grower offer once, without mixing categories',()=>{
 const rows=catalogueOfferRows(RF_PRODUCTS,'',FILTER_BASE,'flowers',RF_OFFERS);
 assert.equal(rows.length,8);
 const expected=RF_OFFERS.filter(o=>!['plants','accessories'].includes(RF_PRODUCTS.find(p=>p.id===o.productId).cat));
 const actual=rows.flatMap(row=>row.items.map(item=>item.offer.id));
 assert.equal(actual.length,expected.length);
 assert.equal(new Set(actual).size,actual.length);
 assert.equal([...actual].sort().join('\n'),Array.from(expected,o=>o.id).sort().join('\n'));
 for(const row of rows){assert.ok(row.items.every(item=>item.p.cat===row.id));assert.equal(row.productCount,new Set(row.items.map(item=>item.p.id)).size);}
});
test('featured flower rows show the variety range before repeating alternate growers',()=>{
 const roses=catalogueOfferRows(RF_PRODUCTS,'',FILTER_BASE,'flowers',RF_OFFERS).find(row=>row.id==='roses');
 assert.equal(new Set(roses.items.slice(0,roses.productCount).map(item=>item.p.id)).size,roses.productCount);
 assert.ok(new Set(roses.items.map(item=>item.offer.grower)).size>1);
});
test('category rows retain exact alternate-grower constraints and omit empty categories',()=>{
 const rows=catalogueOfferRows(RF_PRODUCTS,'Red Naomi',{...FILTER_BASE,cat:'roses',grower:'Black Tulip',colour:'red',length:'medium',maxPrice:'0.30'},'flowers',RF_OFFERS);
 assert.equal(rows.length,1);assert.equal(rows[0].id,'roses');assert.equal(rows[0].items.length,1);
 const {offer}=rows[0].items[0];assert.equal(offer.grower,'Black Tulip');assert.equal(offer.stemCm,65);assert.equal(offer.unitCents,26);
 assert.equal(catalogueOfferRows(RF_PRODUCTS,'no-such-flower',FILTER_BASE,'flowers',RF_OFFERS).length,0);
});
test('price sorting orders every grower offer inside its category, not just base products',()=>{
 for(const sort of ['low','high'])for(const row of catalogueOfferRows(RF_PRODUCTS,'',FILTER_BASE,'flowers',RF_OFFERS,sort)){
  const prices=row.items.map(item=>item.offer.unitCents);
  for(let i=1;i<prices.length;i++)assert.ok(sort==='low'?prices[i]>=prices[i-1]:prices[i]<=prices[i-1]);
 }
});


test('plant rows partition all plant offers into four plant groups without flowers',()=>{
 const rows=catalogueOfferRows(RF_PRODUCTS,'',FILTER_BASE,'plants',RF_OFFERS);
 const plants=RF_PRODUCTS.filter(p=>p.cat==='plants');
 assert.equal(plants.length,12);
 assert.equal(rows.map(r=>r.id).join(','),'plant-orchids,plant-flowering,plant-green,plant-succulents');
 const actual=rows.flatMap(r=>r.items.map(x=>x.offer.id));
 const expected=RF_OFFERS.filter(o=>plants.some(p=>p.id===o.productId)).map(o=>o.id);
 assert.equal(actual.length,new Set(actual).size);
 assert.equal([...actual].sort().join('\n'),[...expected].sort().join('\n'));
 for(const row of rows){
  assert.ok(row.items.every(x=>x.p.cat==='plants'&&x.p.plantGroup===row.id));
  assert.equal(new Set(row.items.slice(0,row.productCount).map(x=>x.p.id)).size,row.productCount);
  assert.ok(new Set(row.items.map(x=>x.offer.grower)).size>1);
 }
});
test('plant group, grower, height and price filters stay on the same offer',()=>{
 const filters={...FILTER_BASE,cat:'plant-green',grower:'Demo Leaf Nursery',length:'medium',maxPrice:'8'};
 const rows=catalogueOfferRows(RF_PRODUCTS,'Monstera',filters,'plants',RF_OFFERS);
 assert.equal(rows.length,1);assert.equal(rows[0].id,'plant-green');assert.equal(rows[0].items.length,1);
 const {offer}=rows[0].items[0];assert.equal(offer.grower,'Demo Leaf Nursery');assert.equal(offer.stemCm,65);assert.equal(offer.potCm,17);assert.equal(offer.unit,'plant');assert.equal(offer.unitCents,750);
 assert.equal(catalogueOfferRows(RF_PRODUCTS,'Monstera',{...filters,cat:'plant-orchids'},'plants',RF_OFFERS).length,0);
});
test('plant offers retain actual plant quantities and positive pot dimensions',()=>{
 for(const p of RF_PRODUCTS.filter(p=>p.cat==='plants'))for(const o of RF_OFFERS.filter(o=>o.productId===p.id)){
  assert.equal(o.unit,'plant');assert.equal(o.step,1);assert.ok(o.potCm>0);assert.ok(o.stemCm>0);
  const qty=Math.max(o.minQty,o.lot),lines=M.add([],o,qty);
  assert.equal(lines[0].qty,qty);assert.equal(lines[0].potCm,o.potCm);assert.equal(M.totals(lines).subtotalCents,qty*o.unitCents);
 }
});
test('plant sorting orders every grower offer within its own group',()=>{
 for(const sort of ['low','high'])for(const row of catalogueOfferRows(RF_PRODUCTS,'',FILTER_BASE,'plants',RF_OFFERS,sort)){
  const prices=row.items.map(item=>item.offer.unitCents);
  for(let i=1;i<prices.length;i++)assert.ok(sort==='low'?prices[i]>=prices[i-1]:prices[i]<=prices[i-1]);
 }
});

test('reorder worksheet retains each exact grower offer and the newest previous quantity',()=>{
 const rose=RF_OFFERS.find(o=>o.productId==='r-rednaomi'&&o.grower==='Porta Nova'),alternate=RF_OFFERS.find(o=>o.productId==='r-rednaomi'&&o.grower==='Black Tulip');
 const old={id:'old',placedAt:'2026-09-01T12:00:00Z',lines:[{...rose,qty:100},{...alternate,qty:40}]},recent={id:'recent',placedAt:'2026-10-01T12:00:00Z',lines:[{...rose,qty:300}]};
 const original=JSON.stringify([old,recent]),items=reorderItems([old,recent],RF_OFFERS);
 assert.equal(items.length,2);assert.equal(items[0].id,rose.id);assert.equal(items[0].previous.qty,300);assert.equal(items[0].quantity,300);assert.equal(items[0].lastOrderId,'recent');assert.equal(items[0].orderCount,2);
 assert.equal(items[1].offer.id,alternate.id);assert.equal(items[1].quantity,40);assert.equal(JSON.stringify([old,recent]),original);
});
test('reorder quantities respect current minimum, pack multiple and stock without changing historical values',()=>{
 const offer={minQty:20,step:20,maxQty:180};
 assert.equal(reorderQuantity(offer,100),100);assert.equal(reorderQuantity(offer,105),120);assert.equal(reorderQuantity(offer,5000),180);assert.equal(reorderQuantity(offer,10),20);
 assert.equal(reorderQuantity({...offer,maxQty:19},100),null);assert.equal(reorderQuantity(null,100),null);
});
test('unavailable past grower offers remain visible and are never silently replaced',()=>{
 const offer=RF_OFFERS.find(o=>o.productId==='r-rednaomi');
 const items=reorderItems([{id:'past',placedAt:'2026-09-01',lines:[{...offer,id:'discontinued-offer',qty:100}]}],RF_OFFERS);
 assert.equal(items.length,1);assert.equal(items[0].offer,null);assert.equal(items[0].quantity,null);assert.equal(items[0].previous.qty,100);assert.equal(items[0].previous.grower,offer.grower);
});
test('batch reorder uses current prices and exact quantities, keeping large plant quantities as plants',()=>{
 const day=M.dates()[0],base=RF_OFFERS.find(o=>o.productId==='pl-monstera'),offer={...base,maxQty:10000,availableDate:day},history={id:'past',placedAt:'2026-09-01',lines:[{...offer,unitCents:600,qty:2000}]};
 const items=reorderItems([history],[offer]),result=reorderBatch(items,{[offer.id]:4000},[offer.id,offer.id],[],day);
 assert.equal(result.length,1);assert.equal(result[0].qty,4000);assert.equal(result[0].unit,'plant');assert.equal(result[0].potCm,17);assert.equal(result[0].unitCents,offer.unitCents);assert.equal(M.totals(result).subtotalCents,4000*offer.unitCents);assert.equal(history.lines[0].qty,2000);
});
test('batch reorder rejects invalid quantities, dates and cumulative basket stock before any addition',()=>{
 const day=M.dates()[0],rose={...RF_OFFERS.find(o=>o.productId==='r-rednaomi'),availableDate:day,maxQty:1000},tulip={...RF_OFFERS.find(o=>o.productId==='t-stronggold'),availableDate:day,maxQty:5000};
 const items=reorderItems([{id:'past',placedAt:'2026-09-01',lines:[{...rose,qty:100},{...tulip,qty:3000}]}],[rose,tulip]),cart=[{...tulip,qty:4000}],snapshot=JSON.stringify(cart);
 assert.throws(()=>reorderBatch(items,{},[rose.id,tulip.id],cart,day),/available/);
 assert.equal(JSON.stringify(cart),snapshot);
 assert.throws(()=>reorderBatch(items,{[rose.id]:11},[rose.id],[],day),/multiples/);
 assert.throws(()=>reorderBatch(items,{},[rose.id],[],'2000-01-01'),/departure/);
 assert.throws(()=>reorderBatch(items,{},[],[],day),/Select/);
 assert.throws(()=>reorderBatch(items,{},['missing'],[],day),/no longer available/);
});
test('batch reorder preserves selected grower identity and blocks later-departure offers',()=>{
 const day=M.dates()[0],offer=RF_OFFERS.find(o=>o.productId==='r-rednaomi'&&o.grower==='Black Tulip'),late={...offer,availableDate:M.dates()[1]};
 const items=reorderItems([{id:'past',placedAt:'2026-09-01',lines:[{...late,qty:100}]}],[late]);
 assert.throws(()=>reorderBatch(items,{},[late.id],[],day),/later departure/);
 const result=reorderBatch(items,{},[late.id],[],late.availableDate);
 assert.equal(result[0].id,late.id);assert.equal(result[0].grower,'Black Tulip');assert.equal(result[0].stemCm,late.stemCm);assert.equal(result[0].qty,100);
});
test('whole-order review accounts for existing basket quantities and discloses adjustments',()=>{
 const offer={...RF_OFFERS.find(o=>o.productId==='t-stronggold'),maxQty:5000},source={lines:[{...offer,unitCents:30,qty:3000}]};
 const review=reorderReviewLines(source,[offer],[{...offer,qty:4000}]);
 assert.equal(review.length,1);assert.equal(review[0].qty,1000);assert.equal(review[0].maxForAdd,1000);assert.equal(review[0].maxQty,5000);assert.equal(review[0].previousQty,3000);assert.equal(review[0].previousCents,30);
 assert.equal(reorderReviewLines(source,[offer],[{...offer,qty:5000}]).length,0);assert.equal(source.lines[0].qty,3000);
});
test('reorder history counts one purchase per order and combines duplicate lines for the same offer',()=>{
 const offer=RF_OFFERS[0],items=reorderItems([{id:'past',placedAt:'2026-09-01',lines:[{...offer,qty:40},{...offer,qty:60}]}],[offer]);
 assert.equal(items.length,1);assert.equal(items[0].previous.qty,100);assert.equal(items[0].orderCount,1);assert.equal(reorderItems([],RF_OFFERS).length,0);
});
test('large batch additions merge and persist exact unit quantities without changing order history',()=>{
 const day=M.dates()[0],rose={...RF_OFFERS.find(o=>o.productId==='r-rednaomi'),availableDate:day,maxQty:10000},tulip={...RF_OFFERS.find(o=>o.productId==='t-stronggold'),availableDate:day,maxQty:20000};
 const state={...M.initial(),orders:[{id:'past',placedAt:'2026-09-01',lines:[{...rose,qty:2000},{...tulip,qty:5000}]}],cart:[{...rose,qty:100}]},before=JSON.stringify(state);
 const lines=reorderBatch(reorderItems(state.orders,[rose,tulip]),{},[rose.id,tulip.id],state.cart,day),next={...state,cart:lines.reduce((cart,line)=>M.add(cart,line,line.qty),state.cart)};
 let record;M.persist({setItem(k,v){record=v}},next);const restored=M.read({getItem(){return record}});
 assert.equal(restored.cart.find(line=>line.id===rose.id).qty,2100);assert.equal(restored.cart.find(line=>line.id===tulip.id).qty,5000);assert.equal(restored.cart[0].unit,'stem');assert.equal(JSON.stringify(state),before);assert.equal(JSON.stringify(restored.orders),JSON.stringify(state.orders));
});
test('batch additions never merge a current price into an existing basket line at a different price',()=>{
 const day=M.dates()[0],offer={...RF_OFFERS[0],availableDate:day},cart=[{...offer,qty:offer.minQty,unitCents:offer.unitCents+10}],items=reorderItems([{id:'past',placedAt:'2026-09-01',lines:[{...offer,qty:offer.minQty}]}],[offer]);
 assert.throws(()=>reorderBatch(items,{},[offer.id],cart,day),/review the changed price/);assert.equal(cart[0].qty,offer.minQty);assert.equal(cart[0].unitCents,offer.unitCents+10);
});

test('seasonal recommendations use the Amsterdam calendar month and change the editorial selection',()=>{
 const month=marketMonth(new Date('2026-10-31T23:30:00Z'));assert.equal(month.number,11);assert.equal(month.label,'November');
 const autumn=seasonalRecommendations(RF_OFFERS,M.dates()[0],10),summer=seasonalRecommendations(RF_OFFERS,M.dates()[0],6);
 assert.ok(autumn.some(item=>item.p.cat==='chrys'));assert.ok(!autumn.some(item=>item.p.cat==='peonies'||item.p.cat==='tulips'));assert.ok(summer.some(item=>item.p.cat==='peonies'));
 assert.equal(new Set(autumn.map(item=>item.p.id)).size,autumn.length);assert.ok(autumn.every(item=>item.offer.productId===item.p.id));
});
test('highest-quality recommendations retain the actual top-grade offer rather than a cheaper lower-grade offer',()=>{
 const day=M.dates()[0],base=RF_OFFERS.find(o=>o.productId==='r-rednaomi');
 const offers=[{...base,id:'cheap',grade:'A1',unitCents:5,availableDate:day},{...base,id:'extra',grower:'Extra Grower',grade:'A1 Extra',unitCents:50,availableDate:day},{...base,id:'sold-out-extra',grade:'A1 Extra',unitCents:10,maxQty:0,availableDate:day}];
 const items=qualityRecommendations(offers,day);assert.equal(items.length,1);assert.equal(items[0].offer.id,'extra');assert.equal(items[0].offer.grower,'Extra Grower');assert.equal(items[0].offer.unitCents,50);assert.equal(qualityRecommendations(offers.slice(0,1),day).length,0);
});
test('saved recommendations show only saved products, including plants, and do not fill an empty personal row',()=>{
 const saved=['pl-monstera','r-rednaomi','r-rednaomi','missing'],before=JSON.stringify(saved),items=savedRecommendations(saved,RF_OFFERS,M.dates()[0]);
 assert.equal(items.map(item=>item.p.id).join(','),'pl-monstera,r-rednaomi');assert.equal(items[0].offer.unit,'plant');assert.equal(JSON.stringify(saved),before);assert.equal(savedRecommendations([],RF_OFFERS,M.dates()[0]).length,0);assert.equal(savedRecommendations(['r-rednaomi'],[],M.dates()[0]).length,0);
});

test('reorder review validates the displayed quote, departure and remaining stock before an atomic addition',()=>{
 const day=M.dates()[0],offer={...RF_OFFERS.find(o=>o.productId==='t-stronggold'),availableDate:day,maxQty:6000},cart=[{...offer,qty:4000}],source={lines:[{...offer,qty:3000}]};
 const lines=reorderReviewLines(source,[offer],cart),snapshot=JSON.stringify(cart),batch=importReviewBatch(lines,[offer],cart,day);
 assert.equal(batch[0].qty,2000);assert.equal(batch[0].maxQty,6000);assert.equal(batch[0].maxForAdd,undefined);assert.equal(batch[0].previousQty,undefined);assert.equal(JSON.stringify(cart),snapshot);
 assert.throws(()=>importReviewBatch(lines,[{...offer,unitCents:offer.unitCents+1}],cart,day),/price changed while reviewing/);
 assert.throws(()=>importReviewBatch(lines,[{...offer,maxQty:5000}],cart,day),/available/);
 assert.throws(()=>importReviewBatch(lines,[{...offer,availableDate:M.dates()[1]}],cart,day),/later departure/);
 assert.throws(()=>importReviewBatch(lines,[offer],cart,'2000-01-01'),/departure date/);
});
