const test=require('node:test');
const assert=require('node:assert/strict');
const M=require('../src/core.js');
const P=require('../src/payment.js');
const qrcode=require('../vendor/qrcode.cjs');
const decode=require('./vendor/jsqr.cjs');
const now=new Date('2026-10-21T10:00:00');
const offer={id:'bulk-test::grower',productId:'bulk-test',name:'Wholesale flowers',grower:'Sample grower',origin:'Holland',stemCm:70,grade:'A1',unit:'stem',unitCents:19,step:10,minQty:10,maxQty:10000,availableDate:M.dates(now)[0]};
function create(payment='transfer'){
 const state={...M.initial(now),cart:M.add([],offer,3000),balanceCents:100000};
 return {state,result:M.place(state,{contact:M.defaultContact,delivery:M.dates(now)[0],payment,offers:[offer],now})};
}
function pixels(matrix,scale=5){const quiet=4,width=(matrix.length+quiet*2)*scale,data=new Uint8ClampedArray(width*width*4);for(let y=0;y<width;y++)for(let x=0;x<width;x++){const r=Math.floor(y/scale)-quiet,c=Math.floor(x/scale)-quiet,black=matrix[r]?.[c]===true,n=(y*width+x)*4;data[n]=data[n+1]=data[n+2]=black?0:255;data[n+3]=255;}return {data,width};}
test('bank-transfer instructions use the saved order total including shipping, reference and pending status',()=>{
 const {state,result}=create(),before=M.clone(result.order),details=P.transferDetails(result.order);
 assert.equal(details.amountCents,59450);assert.equal(details.reference,result.order.id);
 assert.ok(details.qrPayload.includes('Amount: EUR 594.50'));
 assert.ok(details.qrPayload.includes('Payment reference: '+result.order.id));
 assert.equal(details.demo,true);assert.match(details.qrPayload,/Not a payment instruction/);assert.match(details.iban,/Not configured/);
 assert.equal(result.order.status,'awaiting_payment');assert.equal(result.state.balanceCents,state.balanceCents);
 assert.equal(result.state.cart.length,0);assert.equal(state.cart.length,1);assert.deepEqual(result.order,before);
});
test('balance-paid, confirmed and missing orders have no outstanding transfer instructions',()=>{
 const {result}=create('balance');assert.equal(result.order.status,'confirmed');assert.equal(P.transferDetails(result.order),null);
 const transfer=create().result.order;assert.equal(P.transferDetails({...transfer,status:'confirmed'}),null);assert.equal(P.transferDetails(null),null);
 for(const amount of [0,-1,NaN,Infinity,77830.5])assert.throws(()=>P.transferDetails({...transfer,totalCents:amount}),/valid/);
 assert.throws(()=>P.transferDetails({...transfer,id:'bad\nreference'}),/valid/);
});
test('the QR independently decodes to exactly the displayed UTF-8 order details',()=>{
 const details=P.transferDetails(create().result.order),image=pixels(P.qrMatrix(details.qrPayload,qrcode)),decoded=decode(image.data,image.width,image.width);
 assert.ok(decoded,'QR should be scannable');assert.equal(decoded.data,details.copyText);
 assert.ok(decoded.data.includes('DEMO BANK TRANSFER'));assert.ok(!decoded.data.startsWith('BCD\n'),'Prototype must not encode a payable EPC transfer');
});
test('reopening a persisted transfer keeps its original amount even after the current basket changes',()=>{
 const {result}=create(),mem=new Map(),storage={getItem:k=>mem.get(k),setItem:(k,v)=>mem.set(k,v)};
 M.persist(storage,result.state);const restored=M.read(storage,now),order=restored.orders[0];
 restored.cart=M.add([],offer,5000);assert.equal(P.transferDetails(order).amountCents,59450);
 assert.equal(P.transferDetails(order).qrPayload,P.transferDetails(result.order).qrPayload);
 assert.equal(restored.orders.length,1);assert.equal(order.status,'awaiting_payment');
});

// Exercise the actual checkout onPlace callback with an isolated in-memory account.
// This does not seed or modify the browser's account or basket.
function checkoutHarness({failStorage=false}={}){
 const fs=require('node:fs'),vm=require('node:vm'),Babel=require('../vendor/babel.cjs'),values=[],refs=[];let index=0,refIndex=0,pushed='';
 const storage={value:null,getItem(key){return key===M.KEY?this.value:null},setItem(key,value){if(failStorage&&key===M.KEY)throw Error('quota');if(key===M.KEY)this.value=value}};
 const React={createElement:(type,props,...children)=>({type,props:props||{},children}),useState(initial){const n=index++;values[n]=typeof initial==='function'?initial():initial;return[values[n],next=>{values[n]=typeof next==='function'?next(values[n]):next}]},useRef(value){const ref={current:value};refs[refIndex++]=ref;return ref},useEffect(){},useLayoutEffect(){}};
 const ctx={window:{PPModel:M,PPPayment:P,localStorage:storage,__resources:{logoDark:'test'},scrollY:0},React,ReactDOM:{createRoot:()=>({render(){}})},document:{getElementById(){return null}},location:{hash:'#checkout'},history:{pushState(a,b,path){pushed=path}},requestAnimationFrame(){}};
 vm.runInNewContext(Babel.transform(fs.readFileSync('src/catalogue.jsx','utf8')+'\n'+fs.readFileSync('src/app.jsx','utf8')+'\nglobalThis.checkoutFixture={RefinedApp,RF_OFFERS};',{presets:['react']}).code,ctx);
 const currentOffer=ctx.checkoutFixture.RF_OFFERS.find(o=>o.productId==='t-stronggold'),state={...M.initial(),cart:M.add([],currentOffer,3000),balanceCents:100000};storage.value=JSON.stringify(state);
 const tree=ctx.checkoutFixture.RefinedApp();
 function find(node){if(!node||typeof node!=='object')return null;if(node.type?.name==='RCheckout')return node;if(Array.isArray(node)){for(const child of node){const found=find(child);if(found)return found}}else if(node.children)return find(node.children);return null;}
 const checkout=find(tree);assert.ok(checkout,'Checkout component should be present');
 return {state,storage,values,pushed:()=>pushed,submit(payment='transfer'){return checkout.props.onPlace({contact:state.contact,delivery:state.delivery,payment,saveContact:true})}};
}
test('actual checkout callback saves the order before opening its QR popup, and balance orders skip it',()=>{
 const transfer=checkoutHarness();transfer.submit();const saved=JSON.parse(transfer.storage.value),popup=transfer.values.find(value=>value?.type==='bank-transfer');
 assert.ok(popup);assert.equal(popup.order.id,saved.orders[0].id);assert.equal(popup.order.totalCents,saved.orders[0].totalCents);
 assert.equal(transfer.pushed(),'#'+encodeURIComponent('order/'+saved.orders[0].id));assert.equal(saved.cart.length,0);assert.equal(saved.orders[0].status,'awaiting_payment');
 const balance=checkoutHarness();balance.submit('balance');assert.equal(balance.values.some(value=>value?.type==='bank-transfer'),false);assert.equal(JSON.parse(balance.storage.value).orders[0].status,'confirmed');
});
test('checkout storage failure preserves the basket and opens no QR or success route',()=>{
 const harness=checkoutHarness({failStorage:true}),before=harness.storage.value;
 assert.throws(()=>harness.submit(),/basket is still here/);assert.equal(harness.storage.value,before);assert.equal(harness.pushed(),'');
 assert.equal(harness.values.some(value=>value?.type==='bank-transfer'),false);assert.equal(harness.values[0].cart.length,1);assert.equal(harness.values[0].orders.length,0);
});
