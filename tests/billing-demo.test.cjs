const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Babel=require('../vendor/babel.cjs');
const M=require('../src/core.js');
const now=new Date('2026-10-22T12:00:00Z');
function find(node,predicate){if(Array.isArray(node)){for(const child of node){const hit=find(child,predicate);if(hit)return hit}}else if(node&&typeof node==='object'){if(predicate(node))return node;return find(node.children,predicate)}return null;}
function text(node){return Array.isArray(node)?node.map(text).join(''):node&&typeof node==='object'?text(node.children):node==null||typeof node==='boolean'?'':String(node)}
const compiled=Babel.transform(fs.readFileSync('src/catalogue.jsx','utf8')+'\n'+fs.readFileSync('src/app.jsx','utf8')+'\nglobalThis.fixture={demoBillingHistory,RProfile,RProfileBilling,RDemoBillingOrder,ROrdersTable};',{presets:['react']}).code;
function harness(component,props={}){
 const values=[];let cursor=0;const React={createElement:(type,props,...children)=>({type,props:props||{},children}),useState(initial){const n=cursor++;if(!(n in values))values[n]=typeof initial==='function'?initial():initial;return[values[n],value=>{values[n]=typeof value==='function'?value(values[n]):value}]},useRef:value=>({current:value}),useEffect(){}};
 const context={window:{PPModel:M},React,ReactDOM:{createRoot:()=>({render(){}})},document:{getElementById(){return null}},requestAnimationFrame(){}};vm.runInNewContext(compiled,context);return {fixture:context.fixture,render(){cursor=0;return context.fixture[component](props)}};
}
test('example billing entries have independent product snapshots and reconciled saved totals',()=>{
 const h=harness('RProfileBilling'),orders=h.fixture.demoBillingHistory(now);assert.equal(orders.length,5);assert.equal(new Set(orders.map(o=>o.id)).size,5);assert.ok(orders.every(o=>o.id.startsWith('DEMO-')));assert.ok(orders.some(o=>o.status==='awaiting_payment'));assert.ok(orders.some(o=>o.status==='confirmed'&&o.payment==='transfer'));assert.ok(orders.some(o=>o.status==='confirmed'&&o.payment==='balance'));
 for(const order of orders){assert.equal(order.subtotalCents,order.lines.reduce((sum,line)=>sum+line.qty*line.unitCents,0));assert.equal(order.totalCents,order.subtotalCents+M.SHIPPING);assert.equal(order.shippingCents,M.SHIPPING);assert.equal(order.remainingCents,0);assert.ok(new Date(order.placedAt)<now);assert.ok(order.lines.every(line=>line.id&&line.name&&line.grower&&line.unit==='stem'&&line.qty>0));}
 const firstId=orders[0].lines[0].id;orders[0].lines[0].qty=1;assert.notEqual(h.fixture.demoBillingHistory(now)[0].lines[0].qty,1);assert.equal(h.fixture.demoBillingHistory(now)[0].lines[0].id,firstId);
});
test('an empty billing history shows demo rows automatically and can return to the empty state',()=>{
 const orders=[],h=harness('RProfileBilling',{orders});let view=h.render();const table=find(view,n=>n.type?.name==='ROrdersTable');assert.equal(table.props.orders.length,5);assert.equal(table.props.billing,true);assert.ok(text(view).includes('Demo billing history'));assert.ok(text(view).includes('do not affect your orders or balance'));assert.equal(orders.length,0);
 find(view,n=>n.type==='button'&&text(n)==='Hide demo data').props.onClick();view=h.render();assert.equal(find(view,n=>n.type?.name==='ROrdersTable'),null);assert.ok(text(view).includes('No billing history yet'));find(view,n=>n.type==='button'&&text(n)==='Show demo data').props.onClick();view=h.render();assert.equal(find(view,n=>n.type?.name==='ROrdersTable').props.orders.length,5);assert.equal(orders.length,0);
});
test('saved history remains the default for existing orders and demo toggling cannot alter or route fake orders',()=>{
 const order={id:'SAVED-42',placedAt:now.toISOString(),payment:'balance',status:'confirmed',lines:[],totalCents:12345},orders=[order],before=JSON.stringify(orders),calls=[],h=harness('RProfileBilling',{orders,onOpenOrder:entry=>calls.push(entry)});let view=h.render(),table=find(view,n=>n.type?.name==='ROrdersTable');assert.equal(table.props.orders,orders);table.props.onOpen(order);assert.deepEqual(calls,[order]);
 find(view,n=>n.type==='button'&&text(n)==='Show demo data').props.onClick();view=h.render();table=find(view,n=>n.type?.name==='ROrdersTable');assert.notEqual(table.props.orders,orders);const demo=table.props.orders[0];table.props.onOpen(demo);view=h.render();assert.equal(find(view,n=>n.type?.name==='RDemoBillingOrder').props.order,demo);assert.equal(calls.length,1);
 find(view,n=>n.type==='button'&&text(n)==='Hide demo data').props.onClick();view=h.render();assert.equal(find(view,n=>n.type?.name==='ROrdersTable').props.orders,orders);assert.equal(find(view,n=>n.type?.name==='RDemoBillingOrder'),null);assert.equal(JSON.stringify(orders),before);
});
test('demo billing details use the shared read-only worksheet and show the matching payment state and totals',()=>{
 const h=harness('RProfileBilling',{orders:[]});let view=h.render();const table=find(view,n=>n.type?.name==='ROrdersTable'),example=table.props.orders.find(o=>o.status==='awaiting_payment');table.props.onOpen(example);view=h.render();const modal=find(view,n=>n.type?.name==='RDemoBillingOrder'),details=harness('RDemoBillingOrder',modal.props).render(),worksheet=find(details,n=>n.type?.name==='RProductLinesTable');assert.equal(worksheet.props.lines,example.lines);assert.equal(worksheet.props.subtotalCents,example.subtotalCents);assert.equal(worksheet.props.editable,undefined);assert.ok(text(details).includes('Awaiting payment'));assert.ok(text(details).includes('No order or payment is created.'));
 const total=new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(example.totalCents/100);assert.ok(text(details).includes(total));assert.equal(find(details,n=>n.type==='button'&&/Pay|Buy|Transfer/.test(text(n))),null);find(details,n=>n.type==='button'&&text(n)==='Close preview').props.onClick();assert.equal(find(h.render(),n=>n.type?.name==='RDemoBillingOrder'),null);
 const renderedTable=h.fixture.ROrdersTable(table.props);assert.ok(text(renderedTable).includes('Paid'));assert.ok(text(renderedTable).includes('Awaiting payment'));assert.ok(text(renderedTable).includes('Account balance'));assert.ok(text(renderedTable).includes('Bank transfer'));
});
test('the Profile Billing history section delegates the current saved orders without mutating account data',()=>{
 const state=M.initial(now),before=JSON.stringify(state),h=harness('RProfile',{state});let view=h.render();find(view,n=>n.type==='button'&&text(n)==='Billing history').props.onClick();view=h.render();assert.equal(text(find(view,n=>n.type==='h2')),'Billing history');assert.equal(find(view,n=>n.type?.name==='RProfileBilling').props.orders,state.orders);assert.equal(JSON.stringify(state),before);
});
