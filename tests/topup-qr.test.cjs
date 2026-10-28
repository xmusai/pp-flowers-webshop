const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Babel=require('../vendor/babel.cjs');
const M=require('../src/core.js');
const P=require('../src/payment.js');
const qrcode=require('../vendor/qrcode.cjs');
const decode=require('./vendor/jsqr.cjs');
const now=new Date('2026-10-22T12:00:00Z');
function account(){return {...M.initial(now),balanceCents:100000,topups:[{id:'TU-OLD',amountCents:5000,createdAt:now.toISOString()}],orders:[{id:'existing-order',lines:[],status:'confirmed',totalCents:50000}],profile:{preferredLanguage:'nl'}};}
test('preparing a top-up changes no state and explicit confirmation credits its exact reference once',()=>{
 const s=account(),before=JSON.stringify(s),preview=M.prepareTopUp(s,72550,now);assert.equal(JSON.stringify(s),before);assert.equal(preview.amountCents,72550);assert.equal(preview.createdAt,now.toISOString());
 const next=M.applyDemoTopUp(s,preview);assert.equal(next.balanceCents,172550);assert.deepEqual(next.topups[0],preview);assert.equal(next.topups[1],s.topups[0]);assert.equal(next.orders,s.orders);assert.equal(next.cart,s.cart);assert.equal(next.contact,s.contact);assert.equal(next.profile,s.profile);assert.equal(next.customerId,s.customerId);assert.equal(JSON.stringify(s),before);assert.equal(M.applyDemoTopUp(next,preview),next);
 assert.throws(()=>M.applyDemoTopUp(next,{...preview,amountCents:80000}),/reference is already in use/);
 for(const amount of [4999,10000001,NaN,5000.5])assert.throws(()=>M.prepareTopUp(s,amount,now),/amount/);
 assert.throws(()=>M.applyDemoTopUp(s,{...preview,id:'bad\nreference'}),/new top-up/);assert.throws(()=>M.applyDemoTopUp(s,{...preview,createdAt:'invalid'}),/new top-up/);
});
test('the top-up QR independently decodes to the displayed amount and reference without payment instructions',()=>{
 const preview=M.prepareTopUp(account(),72550,now),details=P.topUpDetails(preview),matrix=P.qrMatrix(details.qrPayload,qrcode),quiet=4,scale=5,width=(matrix.length+quiet*2)*scale,data=new Uint8ClampedArray(width*width*4);
 for(let y=0;y<width;y++)for(let x=0;x<width;x++){const r=Math.floor(y/scale)-quiet,c=Math.floor(x/scale)-quiet,black=matrix[r]?.[c]===true,n=(y*width+x)*4;data[n]=data[n+1]=data[n+2]=black?0:255;data[n+3]=255;}
 const decoded=decode(data,width,width);assert.ok(decoded);assert.equal(decoded.data,details.copyText);assert.equal(details.amountCents,72550);assert.equal(details.reference,preview.id);assert.match(decoded.data,/DEMO BALANCE TOP-UP/);assert.ok(decoded.data.includes('Amount: EUR 725.50'));assert.ok(decoded.data.includes('Payment reference: '+preview.id));assert.match(decoded.data,/Not a payment instruction/);assert.equal(decoded.data.startsWith('BCD\n'),false);
 for(const amountCents of [0,4999,10000001,NaN,1.5])assert.throws(()=>P.topUpDetails({...preview,amountCents}),/valid transfer/);
});

function find(node,predicate){if(Array.isArray(node)){for(const child of node){const hit=find(child,predicate);if(hit)return hit}}else if(node&&typeof node==='object'){if(predicate(node))return node;return find(node.children,predicate)}return null;}
function text(node){return Array.isArray(node)?node.map(text).join(''):node&&typeof node==='object'?text(node.children):node==null||typeof node==='boolean'?'':String(node)}
const compiled=Babel.transform(fs.readFileSync('src/catalogue.jsx','utf8')+'\n'+fs.readFileSync('src/payment.jsx','utf8')+'\n'+fs.readFileSync('src/app.jsx','utf8')+'\nglobalThis.fixture={RefinedApp,RTopUpTransfer};',{presets:['react']}).code;
function harness(component='RefinedApp',props={}){
 const values=[],refs=[],store={value:JSON.stringify(account()),writes:0,fail:false,getItem(key){return key===M.KEY?this.value:null},setItem(key,value){if(this.fail)throw Error('quota');if(key===M.KEY){this.value=value;this.writes++}}};let cursor=0,refCursor=0;
 const React={createElement:(type,props,...children)=>({type,props:props||{},children}),useState(initial){const n=cursor++;if(!(n in values))values[n]=typeof initial==='function'?initial():initial;return[values[n],value=>{values[n]=typeof value==='function'?value(values[n]):value}]},useRef(initial){const n=refCursor++;return refs[n]||(refs[n]={current:initial})},useEffect(){},useLayoutEffect(){}};
 const context={window:{PPModel:M,PPPayment:P,localStorage:store,__resources:{logoDark:'test'},scrollY:0},navigator:{clipboard:{async writeText(){}}},React,ReactDOM:{createRoot:()=>({render(){}})},document:{getElementById(){return null}},location:{hash:'#profile'},requestAnimationFrame(){}};
 vm.runInNewContext(compiled,context);return {values,store,render(){cursor=0;refCursor=0;return context.fixture[component](props)}};
}
function openAmount(h){let view=h.render();find(view,n=>n.type?.name==='RProfile').props.onTopup();return h.render();}
function preview(h,amount='725.50'){let view=openAmount(h);find(view,n=>n.type==='input'&&n.props.type==='number').props.onChange({target:{value:amount}});view=h.render();const dialog=find(view,n=>n.type?.name==='RModal'&&n.props.title==='Add demo balance');find(dialog,n=>n.type==='form').props.onSubmit({preventDefault(){}});return h.render();}
test('Add demo balance opens a QR preview with the selected amount and cancellation saves nothing',()=>{
 const h=harness(),before=h.store.value,view=preview(h),popup=find(view,n=>n.type?.name==='RTopUpTransfer');assert.ok(popup);assert.equal(popup.props.topup.amountCents,72550);assert.equal(h.store.value,before);assert.equal(h.store.writes,0);assert.equal(h.values[0].balanceCents,100000);popup.props.onClose();const closed=h.render();assert.equal(find(closed,n=>n.type?.name==='RTopUpTransfer'),null);assert.equal(h.store.value,before);
});
test('changing the amount returns to the amount form and invalid amounts cannot open a QR popup',()=>{
 const h=harness();let view=preview(h);find(view,n=>n.type?.name==='RTopUpTransfer').props.onBack();view=h.render();assert.equal(find(view,n=>n.type==='input'&&n.props.type==='number').props.value,'725.50');
 find(view,n=>n.type==='input'&&n.props.type==='number').props.onChange({target:{value:'49.99'}});view=h.render();find(find(view,n=>n.type?.name==='RModal'&&n.props.title==='Add demo balance'),n=>n.type==='form').props.onSubmit({preventDefault(){}});view=h.render();assert.equal(find(view,n=>n.type?.name==='RTopUpTransfer'),null);assert.match(text(view),/between €50 and €100,000/);assert.equal(h.store.writes,0);
});
test('QR confirmation atomically saves the exact top-up and repeated callbacks cannot add credit twice',()=>{
 const h=harness(),view=preview(h),popup=find(view,n=>n.type?.name==='RTopUpTransfer');popup.props.onConfirm(popup.props.topup);const saved=JSON.parse(h.store.value);assert.equal(saved.balanceCents,172550);assert.equal(saved.topups[0].id,popup.props.topup.id);assert.equal(saved.topups[0].amountCents,72550);assert.deepEqual(saved.orders,account().orders);assert.deepEqual(saved.contact,account().contact);assert.deepEqual(saved.profile,account().profile);assert.equal(saved.customerId,account().customerId);assert.equal(find(h.render(),n=>n.type?.name==='RTopUpTransfer'),null);popup.props.onConfirm(popup.props.topup);assert.equal(h.store.writes,1);assert.equal(JSON.parse(h.store.value).balanceCents,172550);
});
test('a failed confirmation leaves the QR open with balance and history unchanged',()=>{
 const h=harness(),before=h.store.value,view=preview(h),popup=find(view,n=>n.type?.name==='RTopUpTransfer');h.store.fail=true;assert.throws(()=>popup.props.onConfirm(popup.props.topup),/balance has not changed/);assert.equal(h.store.value,before);assert.equal(h.values[0].balanceCents,100000);assert.equal(h.values[0].topups.length,1);assert.ok(find(h.render(),n=>n.type?.name==='RTopUpTransfer'));
 const modal=harness('RTopUpTransfer',popup.props);let rendered=modal.render();find(rendered,n=>n.type==='button'&&text(n)==='Add demo credit').props.onClick();rendered=modal.render();assert.match(text(find(rendered,n=>n.props.role==='alert')),/balance has not changed/);assert.equal(find(rendered,n=>n.type==='button'&&text(n)==='Add demo credit').props.disabled,false);
});
test('the top-up popup labels its QR correctly and guards rapid confirmation clicks',()=>{
 let calls=0,back=0,closed=0;const topup=M.prepareTopUp(account(),50000,now),h=harness('RTopUpTransfer',{topup,onConfirm:()=>calls++,onBack:()=>back++,onClose:()=>closed++});let view=h.render();const qr=find(view,n=>n.type?.name==='RTransferQR');assert.match(qr.props.label,/top-up amount and reference/);assert.equal(qr.props.payload,P.topUpDetails(topup).qrPayload);find(view,n=>n.type==='button'&&text(n)==='Change amount').props.onClick();assert.equal(back,1);view.props.onClose();assert.equal(closed,1);assert.equal(calls,0);const button=find(view,n=>n.type==='button'&&text(n)==='Add demo credit');button.props.onClick();button.props.onClick();assert.equal(calls,1);view=h.render();assert.equal(find(view,n=>n.type==='button'&&text(n)==='Adding credit…').props.disabled,true);
});
