const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Babel=require('../vendor/babel.cjs');
const M=require('../src/core.js');
const React={createElement:(type,props,...children)=>({type,props:props||{},children}),useState:value=>[typeof value==='function'?value():value,()=>{}],useRef:value=>({current:value}),useEffect(){}};
const ctx={window:{PPModel:M},React,ReactDOM:{createRoot:()=>({render(){}})},document:{getElementById(){return null}},requestAnimationFrame:fn=>fn()};
vm.runInNewContext(Babel.transform(fs.readFileSync('src/catalogue.jsx','utf8')+'\n'+fs.readFileSync('src/app.jsx','utf8')+'\nglobalThis.verificationFixture={verificationDraft,verificationFileError,verificationStepErrors,verificationSavePayload,RProfileInformation};',{presets:['react']}).code,ctx);
const {verificationDraft,verificationFileError,verificationStepErrors,verificationSavePayload,RProfileInformation}=ctx.verificationFixture;
const normalize=value=>JSON.parse(JSON.stringify(value));
function find(node,predicate){if(Array.isArray(node)){for(const child of node){const hit=find(child,predicate);if(hit)return hit;}}else if(node&&typeof node==='object'){if(predicate(node))return node;return find(node.children,predicate);}return null;}
function text(node){if(Array.isArray(node))return node.map(text).join('');if(node&&typeof node==='object')return text(node.children);return node==null||typeof node==='boolean'?'':String(node);}
function validDraft(state=M.initial()){
 const draft=verificationDraft(state);draft.identity={type:'passport',file:{name:'sample.pdf',type:'application/pdf',size:200}};draft.business={company:'Flower Shop BV',registration:'EXAMPLE-123',vat:''};draft.services=['flowers','foliage'];draft.transport={method:'collection',carrier:'',notes:''};draft.customs={needed:'no',eori:'',broker:'',notes:''};draft.contract={payment:'prepayment',ready:true};return draft;
}
test('verification starts from saved contact/business details without treating a legacy completed profile as verified',()=>{
 const state={...M.initial(),profile:{company:'Existing company',vat:'EXAMPLE-VAT',completedAt:'2026-01-01T10:00:00Z',otherPreference:'keep'}},before=JSON.stringify(state),draft=verificationDraft(state);
 assert.equal(draft.step,0);assert.equal(draft.status,'draft');assert.equal(draft.completedSteps.length,0);assert.equal(draft.business.company,'Existing company');assert.equal(draft.address.street,state.contact.street);assert.notEqual(draft.contact,state.contact);draft.address.street='Different business address';assert.equal(JSON.stringify(state),before);
});
test('each verification step validates its own fields and transport/customs choices remain conditional',()=>{
 const draft=validDraft();for(let step=0;step<8;step++)assert.equal(Object.keys(verificationStepErrors(draft,step)).length,0,'step '+step);
 draft.address.city=' ';assert.ok(verificationStepErrors(draft,0)['address.city']);assert.equal(Object.keys(verificationStepErrors(draft,2)).length,0);
 draft.business.registration='';draft.contact.email='bad';const business=verificationStepErrors(draft,2);assert.ok(business['business.registration']);assert.ok(business['contact.email']);
 draft.transport.method='own-carrier';assert.ok(verificationStepErrors(draft,4)['transport.carrier']);draft.transport.carrier='Sample carrier';assert.equal(Object.keys(verificationStepErrors(draft,4)).length,0);
 draft.customs.needed='yes';assert.equal(Object.keys(verificationStepErrors(draft,5)).length,0);draft.customs.needed='';assert.ok(verificationStepErrors(draft,5)['customs.needed']);
 draft.contract.ready=false;assert.ok(verificationStepErrors(draft,6)['contract.ready']);draft.services=[];assert.ok(verificationStepErrors(draft,3).services);
});
test('sample-document validation rejects unsupported, empty and oversized selections',()=>{
 for(const file of [null,{name:'file.exe',type:'application/pdf',size:100},{name:'file.pdf',type:'application/x-msdownload',size:100},{name:'file.png',type:'image/png',size:0},{name:'file.jpg',type:'image/jpeg',size:10*1024*1024+1}])assert.notEqual(verificationFileError(file),'');
 for(const file of [{name:'sample.PDF',type:'application/pdf',size:200},{name:'sample.jpeg',type:'image/jpeg',size:10*1024*1024},{name:'sample.png',type:'',size:100}])assert.equal(verificationFileError(file),'');
});
test('saving verification separates business address from shipping, preserves account state and excludes file contents',()=>{
 const state={...M.initial(),profile:{company:'Old company',completedAt:'2026-01-01T10:00:00Z',otherPreference:'keep'},balanceCents:12345,orders:[{id:'old-order'}],cart:[{id:'basket-line',qty:50}]},draft=validDraft(state),before=JSON.stringify(state);
 draft.address.street='Business address 99';draft.contact.first='New contact';draft.identity.file.data='MUST NOT BE SAVED';draft.step=4;draft.completedSteps=[0,1,2,3];
 const payload=verificationSavePayload(state,draft,{now:new Date('2026-10-22T10:00:00Z')}),next={...state,...payload};
 assert.equal(next.contact.street,state.contact.street);assert.equal(next.contact.first,'New contact');assert.equal(next.profile.verification.address.street,'Business address 99');assert.equal(next.profile.verification.step,4);assert.equal(next.profile.verification.status,'draft');assert.equal(next.profile.otherPreference,'keep');assert.equal(next.profile.completedAt,state.profile.completedAt);assert.equal(JSON.stringify(payload).includes('MUST NOT BE SAVED'),false);assert.deepEqual(normalize(next.profile.verification.identity.file),{name:'sample.pdf',size:200,type:'application/pdf'});assert.equal(next.cart,state.cart);assert.equal(next.orders,state.orders);assert.equal(next.balanceCents,12345);assert.equal(JSON.stringify(state),before);
 const invalid=validDraft(state);invalid.contact.email='invalid';assert.deepEqual(normalize(verificationSavePayload(state,invalid).contact),state.contact);
});
test('finishing revalidates every step and saves details without activation, contract signing or a payment',()=>{
 const state=M.initial(),draft=validDraft(state);draft.completedSteps=[0,1,2,3,4,5,6,7];draft.contact.email='bad';assert.throws(()=>verificationSavePayload(state,draft,{finish:true}),/Business/);
 draft.contact.email=state.contact.email;const payload=verificationSavePayload(state,draft,{finish:true,now:new Date('2026-10-22T10:00:00Z')});assert.equal(payload.profile.verification.status,'details_saved');assert.equal(payload.profile.verification.completedSteps.length,8);assert.equal(payload.profile.verified,undefined);assert.equal(payload.profile.verification.contract.signedAt,undefined);assert.equal(payload.profile.completedAt,'2026-10-22T10:00:00.000Z');assert.equal(state.balanceCents,0);
 const memory=new Map(),storage={getItem:key=>memory.get(key),setItem:(key,value)=>memory.set(key,value)};M.persist(storage,{...state,...payload});assert.deepEqual(normalize(verificationDraft(M.read(storage))),normalize(payload.profile.verification));
});
function harness(state){
 let current=M.clone(state),slots=[],cursor=0,calls=[];const original=React.useState;
 React.useState=initial=>{const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value;}];};
 return {render(){cursor=0;return RProfileInformation({state:current,onSave:(contact,profile,options)=>{calls.push({contact,profile,options});current={...current,contact,profile};},onTopup(){throw Error('Payment should not start while saving verification.');}});},get state(){return current;},calls,close(){React.useState=original;}};
}
test('the eight-step form advances, persists its draft and invalidates later completion when an earlier field changes',()=>{
 const state=M.initial();state.profile.verification=validDraft(state);const h=harness(state);
 try{let view;for(let step=0;step<8;step++){view=h.render();assert.match(text(view),new RegExp('Step '+(step+1)+' of 8'));find(view,node=>node.type==='form').props.onSubmit({preventDefault(){}});}
  view=h.render();assert.match(text(view),/Your account details are saved/);assert.match(text(view),/no payment or account activation/);assert.equal(h.calls.length,8);assert.equal(h.state.profile.verification.status,'details_saved');
  find(view,node=>node.type==='button'&&text(node).startsWith('Review your details')).props.onClick();view=h.render();find(view,node=>node.type==='input'&&node.props.id==='verify-address.street').props.onChange({target:{value:'Updated business address'}});view=h.render();const progress=find(view,node=>node.props.role==='progressbar');assert.equal(progress.props['aria-valuenow'],0);const nextNav=find(view,node=>node.type==='button'&&text(node)==='2ID Doc');assert.equal(nextNav.props.disabled,true);assert.equal(h.state.contact.street,state.contact.street);
 }finally{h.close();}
});
test('invalid step submission stays put and cannot save or unlock another step',()=>{
 const state=M.initial();state.profile.verification=validDraft(state);state.profile.verification.address.street='';const h=harness(state);
 try{let view=h.render();find(view,node=>node.type==='form').props.onSubmit({preventDefault(){}});view=h.render();assert.match(text(view),/Street address is required/);assert.equal(h.calls.length,0);assert.equal(find(view,node=>node.type==='button'&&text(node)==='2ID Doc').props.disabled,true);}finally{h.close();}
});
