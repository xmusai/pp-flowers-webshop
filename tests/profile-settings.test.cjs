const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Babel=require('../vendor/babel.cjs');
const M=require('../src/core.js');
const now=new Date('2026-10-22T12:00:00Z');

function account(){return {...M.initial(now),customerId:'ACCOUNT-0042',contact:{...M.defaultContact,phone:'+31 6 1234 5678'},profile:{preferredLanguage:'nl',company:'Existing company',verification:{step:3,status:'draft',business:{registration:'123'},contact:{...M.defaultContact}}},cart:[{id:'cart-line',qty:3000}],orders:[{id:'saved-order',lines:[],placedAt:now.toISOString(),delivery:M.dates(now)[0],status:'awaiting_payment'}],balanceCents:10000};}
test('settings validate and trim contact edits while preserving identity, onboarding and shopping data',()=>{
 const s=account(),before=JSON.stringify(s),fields={...s.contact,first:' Ada ',last:' Lopez ',email:' ada@example.com ',phone:' +32 470 12 34 56 '},next=M.saveContactSettings(s,fields);
 assert.equal(JSON.stringify(s),before);assert.equal(next.contact.first,'Ada');assert.equal(next.contact.email,'ada@example.com');assert.equal(next.contact.phone,'+32 470 12 34 56');assert.equal(next.contact.street,s.contact.street);assert.equal(next.customerId,s.customerId);
 assert.equal(next.profile.preferredLanguage,'nl');assert.deepEqual(next.profile.verification.business,s.profile.verification.business);assert.equal(next.profile.verification.step,3);assert.equal(next.profile.verification.contact.email,'ada@example.com');assert.equal(next.profile.verification.contact.phone,next.contact.phone);
 for(const key of ['cart','orders','saved','drafts','topups'])assert.equal(next[key],s[key]);assert.equal(next.balanceCents,s.balanceCents);
 for(const fields of [{first:''},{last:' '},{email:'invalid'},{phone:'0612345678'},{phone:'+31letters'}])assert.throws(()=>M.saveContactSettings(s,{...s.contact,...fields}));
 assert.equal(M.saveContactSettings(s,{...s.contact,phone:''}).contact.phone,'');
});
test('demo verification is stored separately, bound to the contact value and invalidated by changes',()=>{
 const s=account(),before=JSON.stringify(s),email=M.completeContactPreview(s,'email',s.contact.email,now),both=M.completeContactPreview(email,'phone',s.contact.phone,now);
 assert.equal(JSON.stringify(s),before);assert.equal(M.contactPreviewComplete(both,'email'),true);assert.equal(M.contactPreviewComplete(both,'phone','+31612345678'),true);assert.equal(M.contactPreviewComplete(both,'email','different@example.com'),false);
 const record=both.profile.contactVerificationPreview.email;assert.equal(record.mode,'demo');assert.equal(record.value,s.contact.email);assert.equal(record.code,undefined);assert.equal(both.profile.emailVerified,undefined);assert.equal(both.contact.emailVerified,undefined);
 const changed=M.saveContactSettings(both,{...both.contact,email:'new@example.com'});assert.equal(M.contactPreviewComplete(changed,'email'),false);assert.equal(changed.profile.contactVerificationPreview.email,undefined);assert.equal(M.contactPreviewComplete(changed,'phone'),true);
 assert.equal(M.contactPreviewComplete(M.saveContactSettings(both,{...both.contact,email:s.contact.email.toUpperCase()}),'email'),true);
 assert.throws(()=>M.completeContactPreview(changed,'email',s.contact.email,now),/details changed/);assert.throws(()=>M.completeContactPreview(s,'unknown',s.contact.email,now));assert.throws(()=>M.completeContactPreview({...s,contact:{...s.contact,phone:''}},'phone','',now));
 const store={getItem(){return this.value},setItem(key,value){this.value=value}};M.persist(store,both);const restored=M.read(store,now);assert.equal(M.contactPreviewComplete(restored,'phone'),true);assert.deepEqual(restored.orders,s.orders);assert.deepEqual(restored.profile.verification,s.profile.verification);
 assert.equal(M.contactPreviewComplete({...s,profile:{contactVerificationPreview:{email:{mode:'live',value:s.contact.email,completedAt:now.toISOString()}}}},'email'),false);
});
test('preview code checks handle wrong codes, expiry and attempt limits without changing account data',()=>{
 const c=M.contactPreviewChallenge('email',' Ada@Example.com ',now.getTime(),'654321');assert.equal(c.value,'ada@example.com');assert.equal(c.expiresAt,now.getTime()+300000);
 let result=M.checkContactPreview(c,'000000',now.getTime());assert.match(result.error,/does not match/);assert.equal(c.attempts,0);assert.equal(result.challenge.attempts,1);
 for(let i=0;i<4;i++)result=M.checkContactPreview(result.challenge,'000000',now.getTime());assert.match(result.error,/Too many/);assert.match(M.checkContactPreview(result.challenge,'654321',now.getTime()).error,/Too many/);
 assert.match(M.checkContactPreview(c,'654321',c.expiresAt).error,/expired/);assert.equal(M.checkContactPreview(c,'654321',c.expiresAt-1).error,'');
 const fresh=M.contactPreviewChallenge('email',c.value,now.getTime(),'123456');assert.match(M.checkContactPreview(fresh,c.code,now.getTime()).error,/does not match/);assert.equal(M.checkContactPreview(fresh,'123456',now.getTime()).error,'');
 assert.throws(()=>M.contactPreviewChallenge('phone','0612345678',now.getTime(),'123456'),/country code/);assert.throws(()=>M.contactPreviewChallenge('email','not-email',now.getTime(),'123456'),/email/);
});

function find(node,predicate){if(Array.isArray(node)){for(const child of node){const hit=find(child,predicate);if(hit)return hit}}else if(node&&typeof node==='object'){if(predicate(node))return node;return find(node.children,predicate)}return null;}
function text(node){return Array.isArray(node)?node.map(text).join(''):node&&typeof node==='object'?text(node.children):node==null||typeof node==='boolean'?'':String(node)}
const compiled=Babel.transform(fs.readFileSync('src/catalogue.jsx','utf8')+'\n'+fs.readFileSync('src/app.jsx','utf8')+'\nglobalThis.fixture={RProfile,RProfileSettings,RContactVerificationPreview,RefinedApp};',{presets:['react']}).code;
function harness(component,props={},options={}){
 const values=[],refs=[],store={value:JSON.stringify(account()),getItem(key){return key===M.KEY?this.value:null},setItem(key,value){if(options.failStorage)throw Error('quota');if(key===M.KEY)this.value=value}};let cursor=0,refCursor=0;
 const React={createElement:(type,props,...children)=>({type,props:props||{},children}),useState(initial){const n=cursor++;if(!(n in values))values[n]=typeof initial==='function'?initial():initial;return[values[n],next=>{values[n]=typeof next==='function'?next(values[n]):next}]},useRef(initial){const n=refCursor++;return refs[n]||(refs[n]={current:initial})},useEffect(){},useLayoutEffect(){}};
 const context={window:{PPModel:M,localStorage:store,__resources:{logoDark:'test'},scrollY:0},React,ReactDOM:{createRoot:()=>({render(){}})},document:{getElementById(){return null}},location:{hash:'#profile'},requestAnimationFrame(){}};
 vm.runInNewContext(compiled,context);return {values,store,render(){cursor=0;refCursor=0;return context.fixture[component](props)}};
}
test('Settings sits immediately above customer identity and opens the contact screen',()=>{
 const h=harness('RProfile',{state:account()}),before=h.render(),bottom=find(before,n=>n.props.className==='rf-profile-language');
 assert.equal(text(bottom.children[1]),'Settings');assert.equal(bottom.children[2].props.className,'rf-profile-account');bottom.children[1].props.onClick();const view=h.render();assert.equal(text(find(view,n=>n.type==='h2')),'Settings');assert.ok(find(view,n=>n.type?.name==='RProfileSettings'));assert.equal(find(view,n=>n.props.className==='rf-profile-id'),null);
});
test('unsaved settings cannot start verification; validation and save failures retain the draft',()=>{
 const calls=[],h=harness('RProfileSettings',{state:account(),onSave:contact=>{calls.push(contact);throw Error('Save unavailable')}});let view=h.render();
 find(view,n=>n.type==='input'&&n.props.id==='settings-email').props.onChange({target:{value:'new@example.com'}});view=h.render();find(view,n=>n.type==='button'&&text(n)==='Verify email').props.onClick();view=h.render();assert.match(text(find(view,n=>n.props.role==='alert')),/Save your changes/);assert.equal(find(view,n=>n.type?.name==='RContactVerificationPreview'),null);assert.equal(calls.length,0);
 find(view,n=>n.type==='form').props.onSubmit({preventDefault(){}});view=h.render();assert.equal(calls.length,1);assert.equal(find(view,n=>n.props.id==='settings-email').props.value,'new@example.com');assert.match(text(find(view,n=>n.props.role==='alert')),/Save unavailable/);
 find(view,n=>n.props.id==='settings-phone').props.onChange({target:{value:'bad'}});view=h.render();find(view,n=>n.type==='form').props.onSubmit({preventDefault(){}});view=h.render();assert.equal(find(view,n=>n.props.id==='settings-phone').props['aria-invalid'],true);assert.equal(calls.length,1);
});
test('verification dialog rejects an incorrect code, preserves errors and only completes after a successful save',()=>{
 const calls=[],props={kind:'email',value:'ada@example.com',onComplete:(...args)=>calls.push(args),onClose:()=>calls.push('closed')},h=harness('RContactVerificationPreview',props);let view=h.render();
 const code=text(find(view,n=>n.props.className==='rf-contact-demo-code').children[1]);find(view,n=>n.type==='input').props.onChange({target:{value:code==='000000'?'111111':'000000'}});view=h.render();find(view,n=>n.type==='form').props.onSubmit({preventDefault(){}});view=h.render();assert.match(text(find(view,n=>n.props.role==='alert')),/does not match/);assert.equal(calls.length,0);
 find(view,n=>n.type==='input').props.onChange({target:{value:code}});view=h.render();find(view,n=>n.type==='form').props.onSubmit({preventDefault(){}});view=h.render();assert.deepEqual(calls,[['email','ada@example.com']]);assert.match(text(find(view,n=>n.props.role==='status')),/verified in preview/);
 const failed=harness('RContactVerificationPreview',{...props,onComplete:()=>{throw Error('Storage unavailable')}});view=failed.render();const correct=text(find(view,n=>n.props.className==='rf-contact-demo-code').children[1]);find(view,n=>n.type==='input').props.onChange({target:{value:correct}});view=failed.render();find(view,n=>n.type==='form').props.onSubmit({preventDefault(){}});view=failed.render();assert.match(text(find(view,n=>n.props.role==='alert')),/Storage unavailable/);assert.ok(find(view,n=>n.type==='form'));
});
test('cancelling verification discards its code entry and saves nothing',()=>{
 let completed=0,closed=0;const h=harness('RContactVerificationPreview',{kind:'phone',value:'+31612345678',onComplete:()=>completed++,onClose:()=>closed++});let view=h.render();find(view,n=>n.type==='input').props.onChange({target:{value:'123456'}});view=h.render();find(view,n=>n.type==='button'&&text(n)==='Cancel').props.onClick();assert.equal(completed,0);assert.equal(closed,1);
});
test('actual account callbacks persist atomically and never overwrite shopping state on failure',()=>{
 for(const failStorage of [false,true]){
  const h=harness('RefinedApp',{}, {failStorage}),view=h.render(),profile=find(view,n=>n.type?.name==='RProfile'),before=h.store.value;
  assert.ok(profile);const fields={...account().contact,first:'Ada'};
  if(failStorage){assert.throws(()=>profile.props.onSettings(fields),/could not be saved/);assert.equal(h.store.value,before);assert.equal(h.values[0].contact.first,'Test');assert.throws(()=>profile.props.onContactVerify('email',account().contact.email),/could not be saved/);assert.equal(h.store.value,before);assert.equal(M.contactPreviewComplete(h.values[0],'email'),false)}
  else{profile.props.onSettings(fields);profile.props.onContactVerify('email',fields.email);const saved=JSON.parse(h.store.value);assert.equal(saved.contact.first,'Ada');assert.equal(M.contactPreviewComplete(saved,'email'),true);assert.deepEqual(saved.cart,account().cart);assert.deepEqual(saved.orders,account().orders);assert.equal(saved.customerId,'ACCOUNT-0042');assert.equal(saved.profile.preferredLanguage,'nl')}
 }
});
