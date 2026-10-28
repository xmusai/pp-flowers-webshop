const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Babel=require('../vendor/babel.cjs');
const M=require('../src/core.js');
const React={createElement:(type,props,...children)=>({type,props:props||{},children}),useState:value=>[typeof value==='function'?value():value,()=>{}],useRef:value=>({current:value}),useEffect(){}};
const ctx={window:{PPModel:M},React,ReactDOM:{createRoot:()=>({render(){}})},document:{getElementById(){return null}}};
vm.runInNewContext(Babel.transform(fs.readFileSync('src/catalogue.jsx','utf8')+'\n'+fs.readFileSync('src/app.jsx','utf8')+'\nglobalThis.productsFixture={RProductLinesTable,ROrderLinesTable,RCheckout,RDraft,ROrdersTable,RSavedOrders,RBuyAgain,RF_OFFERS};',{presets:['react']}).code,ctx);
const {RProductLinesTable,ROrderLinesTable,RCheckout,RDraft,ROrdersTable,RSavedOrders,RBuyAgain,RF_OFFERS}=ctx.productsFixture;
function find(node,predicate){if(Array.isArray(node)){for(const child of node){const hit=find(child,predicate);if(hit)return hit;}}else if(node&&typeof node==='object'){if(predicate(node))return node;return find(node.children,predicate);}return null;}
function text(node){if(Array.isArray(node))return node.map(text).join('');if(node&&typeof node==='object')return text(node.children);return node==null||typeof node==='boolean'?'':String(node);}
function normalized(node){return text(node).replace(/\s+/g,' ').trim();}
const cash=cents=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(cents/100).replace(/\s+/g,' ');
function historicalLines(){const rose=RF_OFFERS.find(o=>o.productId==='r-rednaomi'),plant=RF_OFFERS.find(o=>o.unit==='plant');return[{...rose,qty:5000,unitCents:17,grower:'Archived grower',stemCm:82,grade:'Archived grade',origin:'Archived origin'},{...rose,id:rose.id+'::second',qty:600,unitCents:29,grower:'Second grower'},{...plant,qty:1200,unitCents:215,potCm:17,stemCm:88}];}
test('the shared worksheet preserves saved grower identities, large quantities, mixed units and historical prices',()=>{
 const lines=historicalLines(),subtotal=lines.reduce((sum,line)=>sum+line.qty*line.unitCents,0),order={id:'PP-HISTORY',lines,subtotalCents:subtotal},before=JSON.stringify(order);
 const wrapper=ROrderLinesTable({order}),tableComponent=find(wrapper,node=>node.type===RProductLinesTable),table=RProductLinesTable(tableComponent.props);
 const body=find(table,node=>node.type==='tbody'),rows=body.children[0];assert.equal(rows.length,3);
 const first=rows[0].children;assert.equal(normalized(first[1]),'Archived grower');assert.equal(normalized(first[2]),'Archived origin');assert.equal(normalized(first[3]),'82 cm');assert.equal(normalized(first[4]),'Archived grade');assert.match(normalized(first[5]),/5,000stems/);assert.equal(normalized(first[6]),cash(17)+'per stem');assert.equal(normalized(first[7]),cash(85000));
 assert.equal(normalized(rows[1].children[1]),'Second grower');assert.equal(normalized(rows[1].children[7]),cash(17400));
 assert.match(normalized(rows[2].children[3]),/88 cmPot Ø 17 cm/);assert.match(normalized(rows[2].children[5]),/1,200plants/);assert.equal(normalized(rows[2].children[7]),cash(258000));
 assert.equal(normalized(find(table,node=>node.type==='tfoot').children[0].children[1]),cash(subtotal));assert.equal(JSON.stringify(order),before);
});
test('checkout uses the same worksheet, retains offer warnings and keeps Edit basket outside submission',()=>{
 const lines=historicalLines(),state={...M.initial(),cart:lines},before=JSON.stringify(state),offers=lines.map(line=>({...line,unitCents:line.unitCents+10}));let back=0;
 const view=RCheckout({state,offers,onBack:()=>back++,onPlace(){throw Error('Must not submit during presentation test');},onTopup(){},onResolve(){},onRemove(){},onDate(){}});
 const worksheet=find(view,node=>node.type===RProductLinesTable);assert.ok(worksheet);assert.equal(worksheet.props.lines,state.cart);assert.equal(worksheet.props.subtotalCents,M.totals(lines).subtotalCents);assert.equal(worksheet.props.regionLabel,'Checkout product details');
 const warnings=find(view,node=>node.type?.name==='ROfferReview');assert.equal(warnings.props.issues.length,3);
 const edit=find(view,node=>node.type==='button'&&text(node)==='Edit basket');assert.equal(edit.props.type,'button');edit.props.onClick();assert.equal(back,1);
 assert.match(text(view),/use an instant bank transfer where available/);assert.equal(JSON.stringify(state),before);
});

test('basket worksheet controls address the exact grower line and retain editable quantity rules',()=>{
 const lines=historicalLines(),before=JSON.stringify(lines),calls=[];
 const view=RProductLinesTable({lines,subtotalCents:M.totals(lines).subtotalCents,caption:'Basket',editable:true,onQty:(line,qty)=>calls.push(['qty',line,qty]),onRemove:id=>calls.push(['remove',id]),onOffer:line=>calls.push(['offer',line])});
 const rows=find(view,node=>node.type==='tbody').children[0],second=rows[1],quantity=find(second,node=>node.type?.name==='RQuantity');
 assert.equal(quantity.props.offer,lines[1]);assert.equal(quantity.props.value,600);assert.equal(quantity.props.allowRemove,true);assert.equal(quantity.props.selectOnFocus,true);
 quantity.props.onChange(800);quantity.props.onChange(0);
 const offer=find(second,node=>node.type==='button'&&text(node)==='Change offer'),remove=find(second,node=>node.type==='button'&&text(node)==='Remove');
 assert.equal(offer.props.type,'button');assert.equal(remove.props.type,'button');offer.props.onClick();remove.props.onClick();
 assert.deepEqual(calls,[['qty',lines[1],800],['qty',lines[1],0],['offer',lines[1]],['remove',lines[1].id]]);assert.equal(JSON.stringify(lines),before);
 const readOnly=RProductLinesTable({lines,subtotalCents:M.totals(lines).subtotalCents,caption:'Saved order'});assert.equal(find(readOnly,node=>node.type?.name==='RQuantity'),null);assert.equal(find(readOnly,node=>node.type==='button'),null);
});


test('order overviews keep saved totals and actions tied to the exact historical order',()=>{
 const order={id:'PP-ARCHIVED',placedAt:'2026-10-20T10:00:00Z',delivery:'2026-10-23',status:'confirmed',payment:'balance',lines:historicalLines(),subtotalCents:111111,totalCents:113561},before=JSON.stringify(order),calls=[];
 const props={orders:[order],onOpen:o=>calls.push(['open',o]),onReview:o=>calls.push(['review',o])};
 const view=ROrdersTable(props),body=find(view,node=>node.type==='tbody');assert.ok(normalized(body).includes(cash(order.totalCents)));assert.match(text(body),/Confirmed/);
 find(body,node=>node.type==='button'&&node.props['aria-label']==='View order '+order.id).props.onClick();find(body,node=>node.type==='button'&&text(node)==='Buy again').props.onClick();assert.deepEqual(calls,[['open',order],['review',order]]);
 const previous=ROrdersTable({...props,previous:true});assert.ok(normalized(previous).includes(cash(order.subtotalCents)));assert.ok(!normalized(previous).includes(cash(order.totalCents)));assert.match(text(previous),/Archived grower|Red Naomi/);
 const billing=ROrdersTable({...props,billing:true});assert.match(text(billing),/Account balance/);assert.match(text(billing),/Paid/);
 const sample=ROrdersTable({...props,orders:[{...order,sample:true}],previous:true});assert.equal(find(sample,node=>node.type==='button'&&String(node.props['aria-label']).startsWith('View')),null);assert.equal(JSON.stringify(order),before);
});

test('saved-order overview retains edit, delete and reorder identity and disables empty reorders',()=>{
 const draft={id:'saved-one',name:'Weekly roses',lines:historicalLines()},empty={id:'saved-empty',name:'Empty list',lines:[]},before=JSON.stringify(draft),calls=[];
 const view=RSavedOrders({drafts:[draft,empty],canSave:true,onSave:()=>calls.push(['save']),onEdit:d=>calls.push(['edit',d]),onReview:d=>calls.push(['review',d]),onDelete:d=>calls.push(['delete',d])});
 find(view,node=>node.type==='button'&&node.props['aria-label']==='Edit saved order '+draft.name).props.onClick();find(view,node=>node.type==='button'&&node.props['aria-label']==='Review and reorder '+draft.name).props.onClick();find(view,node=>node.type==='button'&&node.props['aria-label']==='Delete saved order '+draft.name).props.onClick();
 assert.deepEqual(calls,[['edit',draft],['review',draft],['delete',draft]]);assert.equal(find(view,node=>node.type==='button'&&node.props['aria-label']==='Review and reorder '+empty.name).props.disabled,true);assert.ok(normalized(view).includes(cash(M.totals(draft.lines).subtotalCents)));assert.equal(JSON.stringify(draft),before);
});

test('saved-order worksheet edits a clone and only applies its exact grower changes when saved',()=>{
 const draft={id:'saved-one',name:'Weekly roses',lines:historicalLines()},before=JSON.stringify(draft),originalUseState=React.useState;let current,saved;
 React.useState=initial=>{if(current===undefined)current=typeof initial==='function'?initial():initial;return[current,next=>{current=typeof next==='function'?next(current):next}];};
 try{
  const props={draft,onClose(){},onSave:d=>{saved=d},onImport(){}};let view=RDraft(props),table=find(view,node=>node.type===RProductLinesTable);assert.notEqual(table.props.lines,draft.lines);assert.equal(table.props.editable,true);
  table.props.onQty(table.props.lines[1],700);view=RDraft(props);table=find(view,node=>node.type===RProductLinesTable);assert.equal(table.props.lines[0].qty,5000);assert.equal(table.props.lines[1].qty,700);
  table.props.onRemove(table.props.lines[0].id);view=RDraft(props);table=find(view,node=>node.type===RProductLinesTable);assert.equal(table.props.lines.length,2);assert.equal(table.props.subtotalCents,M.totals(table.props.lines).subtotalCents);
  find(view,node=>node.type==='button'&&text(node)==='Save changes').props.onClick();assert.equal(saved,current);assert.equal(saved.lines[0].grower,'Second grower');assert.equal(JSON.stringify(draft),before);
 }finally{React.useState=originalUseState;}
});


test('reorder rows toggle their exact grower selection and interactive controls never double-toggle',()=>{
 const lines=RF_OFFERS.filter(offer=>offer.productId==='r-rednaomi').slice(0,2).map(offer=>({...offer,qty:offer.minQty})),orders=[{id:'row-order',placedAt:new Date().toISOString(),lines}],before=JSON.stringify(orders),calls=[],quantityCalls=[];
 const props={orders,offers:RF_OFFERS,cart:[],delivery:M.dates()[1],quantities:{},onQuantity:(id,n)=>quantityCalls.push([id,n]),selected:[],onSelect:ids=>calls.push([...ids]),query:'',onQuery(){},tab:'products',onTab(){},sort:'recent',onSort(){},onReview(){},onOpen(){},onAddMany(){},onDate(){},onBrowse(){},onOrder(){},onBasket(){}};
 const rowFor=(view,id)=>find(view,node=>node.type==='tr'&&node.props.key===id),plain={target:{closest:()=>null}};
 let row=rowFor(RBuyAgain(props),lines[1].id);row.props.onClick(plain);assert.deepEqual(calls,[[lines[1].id]]);assert.equal(row.props['aria-selected'],false);
 row=rowFor(RBuyAgain({...props,selected:[lines[1].id]}),lines[1].id);assert.equal(row.props['aria-selected'],true);row.props.onClick(plain);assert.deepEqual(calls[1],[]);
 for(const tag of ['button','input','select','textarea','a','label'])row.props.onClick({target:{closest:selector=>selector.split(',').includes(tag)?{}:null}});row.props.onClick({...plain,defaultPrevented:true});assert.equal(calls.length,2);
 const checkbox=find(row,node=>node.type==='input'&&node.props.type==='checkbox');checkbox.props.onChange({target:{checked:false}});row.props.onClick({target:{closest:selector=>selector.split(',').includes('input')?{}:null}});assert.equal(calls.length,3);assert.deepEqual(calls[2],[]);const quantity=find(row,node=>node.type?.name==='RQuantity');quantity.props.onChange(quantity.props.value);assert.equal(calls.length,3);assert.equal(quantityCalls.length,0);quantity.props.onChange(quantity.props.value+lines[1].step);assert.equal(calls.length,4);assert.deepEqual(quantityCalls,[[lines[1].id,quantity.props.value+lines[1].step]]);assert.equal(JSON.stringify(orders),before);
});

test('unavailable reorder rows cannot be selected but an existing selection can still be removed',()=>{
 const line=RF_OFFERS.find(offer=>offer.productId==='r-rednaomi'),order={id:'unavailable',placedAt:new Date().toISOString(),lines:[{...line,qty:line.minQty}]},calls=[];
 const props={orders:[order],offers:RF_OFFERS.map(offer=>offer.id===line.id?{...offer,maxQty:0}:offer),cart:[],delivery:M.dates()[0],quantities:{},onQuantity(){},selected:[],onSelect:ids=>calls.push([...ids]),query:'',onQuery(){},tab:'products',onTab(){},sort:'recent',onSort(){},onReview(){},onOpen(){},onAddMany(){},onDate(){},onBrowse(){},onOrder(){},onBasket(){}};
 const rowFor=view=>find(view,node=>node.type==='tr'&&node.props.key===line.id);let row=rowFor(RBuyAgain(props));assert.equal(row.props.onClick,undefined);assert.equal(find(row,node=>node.type==='input'&&node.props.type==='checkbox').props.disabled,true);
 row=rowFor(RBuyAgain({...props,selected:[line.id]}));row.props.onClick({target:{closest:()=>null}});assert.deepEqual(calls,[[]]);
});
