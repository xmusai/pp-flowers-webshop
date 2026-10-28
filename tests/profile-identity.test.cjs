const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Babel=require('../vendor/babel.cjs');
const M=require('../src/core.js');
const now=new Date('2026-10-22T12:00:00');

test('legacy accounts receive a stable demo ID and supplied account IDs are preserved',()=>{
 const legacy=M.initial(now);delete legacy.customerId;const before=JSON.stringify(legacy);
 const restored=M.read({getItem:()=>JSON.stringify(legacy)},now);assert.equal(restored.customerId,'PP-100001');assert.equal(M.customerId(restored),'PP-100001');assert.equal(JSON.stringify(legacy),before);
 for(const [saved,expected] of [['000042','000042'],['ACCOUNT-0042','ACCOUNT-0042'],[42,'42'],[null,'PP-100001'],['  ','PP-100001'],[{},'PP-100001']]){
  const state=M.read({getItem:()=>JSON.stringify({...legacy,customerId:saved})},now);assert.equal(state.customerId,expected);assert.equal(M.customerId(state),expected);
 }
});
test('editing contact details and language cannot change the customer ID across reloads',()=>{
 const original={...M.initial(now),customerId:'ACCOUNT-00042',profile:{company:'Existing business',verification:{step:3,status:'draft'}},cart:[{id:'existing-line',qty:50}],orders:[{id:'existing-order'}],balanceCents:12500},before=JSON.stringify(original);
 const edited={...original,contact:{...original.contact,first:'Ada',last:'Lopez',email:'ada@example.com'}};
 const next=M.setLanguagePreference(edited,'nl'),values=new Map(),storage={getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)};
 M.persist(storage,next);const restored=M.read(storage,now);assert.equal(M.customerId(restored),'ACCOUNT-00042');assert.deepEqual(restored.contact,edited.contact);assert.deepEqual(restored.profile,next.profile);assert.deepEqual(restored.cart,original.cart);assert.deepEqual(restored.orders,original.orders);assert.equal(restored.balanceCents,original.balanceCents);assert.equal(JSON.stringify(original),before);
});
const React={createElement:(type,props,...children)=>({type,props:props||{},children}),useState:value=>[typeof value==='function'?value():value,()=>{}],useRef:value=>({current:value}),useEffect(){}};
const context={window:{PPModel:M},React,ReactDOM:{createRoot:()=>({render(){}})},document:{getElementById(){return null}}};
vm.runInNewContext(Babel.transform(fs.readFileSync('src/catalogue.jsx','utf8')+'\n'+fs.readFileSync('src/app.jsx','utf8')+'\nglobalThis.profileFixture=RProfile;globalThis.completedFixture=RCompletedProfile;',{presets:['react']}).code,context);
function find(node,predicate){if(Array.isArray(node)){for(const child of node){const hit=find(child,predicate);if(hit)return hit}}else if(node&&typeof node==='object'){if(predicate(node))return node;return find(node.children,predicate)}return null;}
function text(node){return Array.isArray(node)?node.map(text).join(''):node&&typeof node==='object'?text(node.children):node==null||typeof node==='boolean'?'':String(node)}
test('the profile card and sidebar use the same supplied ID and current account name',()=>{
 const state={...M.initial(now),customerId:'ACCOUNT-00042',contact:{...M.defaultContact,first:'Ada',last:'Lopez'}};
 const view=context.profileFixture({state}),completed=find(view,n=>n.type?.name==='RCompletedProfile'),card=context.completedFixture(completed.props),sidebar=find(view,n=>n.props.className==='rf-profile-account'),language=find(view,n=>n.props.className==='rf-profile-language');
 assert.ok(text(card).includes('Ada Lopez'));assert.ok(text(card).includes('Customer IDACCOUNT-00042'));assert.ok(text(sidebar).includes('Ada Lopez'));assert.ok(text(sidebar).includes('Customer ID ACCOUNT-00042'));
 const customerId=find(card,n=>n.props.className==='rf-profile-identity-number');assert.equal(text(customerId),'ACCOUNT-00042');assert.equal(language.children[0].type,'button');assert.ok(language.children[1].props.className.includes('rf-profile-settings'));assert.equal(language.children[2].props.className,'rf-profile-account');
});
