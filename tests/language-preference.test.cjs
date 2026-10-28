const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Babel=require('../vendor/babel.cjs');
const M=require('../src/core.js');

test('legacy and unsupported language preferences default to English',()=>{
 assert.equal(M.preferredLanguage(M.initial()),'en');
 for(const value of [undefined,null,'unknown',{},'EN'])assert.equal(M.preferredLanguage({profile:{preferredLanguage:value}}),'en');
 for(const language of M.LANGUAGES)assert.equal(M.preferredLanguage({profile:{preferredLanguage:language.code}}),language.code);
});
test('saving and reloading a language preference preserves verification, contact and shopping data',()=>{
 const state={...M.initial(),profile:{company:'Existing company',preferredLanguage:'en',completedAt:'2026-01-01',verification:{step:3,status:'draft',services:['flowers']}},orders:[{id:'order-1'}],cart:[{id:'line-1',qty:500}],balanceCents:12000},before=JSON.stringify(state);
 const next=M.setLanguagePreference(state,'nl'),values=new Map(),storage={getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)};
 assert.equal(JSON.stringify(state),before);assert.deepEqual(next,{...state,profile:{...state.profile,preferredLanguage:'nl'}});
 M.persist(storage,next);const restored=M.read(storage);assert.equal(M.preferredLanguage(restored),'nl');assert.deepEqual(restored.profile.verification,state.profile.verification);assert.deepEqual(restored.contact,state.contact);assert.deepEqual(restored.cart,state.cart);assert.deepEqual(restored.orders,state.orders);assert.equal(restored.balanceCents,state.balanceCents);
 for(const value of ['xx','',null,{}])assert.throws(()=>M.setLanguagePreference(state,value),/Choose a language/);
 assert.equal(JSON.stringify(state),before);
});
function harness({value='en',fail=false}={}){
 const values=[],calls=[];let cursor=0,closed=0;
 const React={createElement:(type,props,...children)=>({type,props:props||{},children}),useState(initial){const n=cursor++;if(!(n in values))values[n]=initial;return[values[n],next=>{values[n]=typeof next==='function'?next(values[n]):next}]}};
 const context={window:{PPModel:M},React,ReactDOM:{createRoot:()=>({render(){}})},document:{getElementById(){return null}}};
 vm.runInNewContext(Babel.transform(fs.readFileSync('src/catalogue.jsx','utf8')+'\n'+fs.readFileSync('src/app.jsx','utf8')+'\nglobalThis.languageFixture=RLanguagePreference;',{presets:['react']}).code,context);
 return {calls,get closed(){return closed},render(){cursor=0;return context.languageFixture({value,onSave:code=>{if(fail)throw Error('Could not save');calls.push(code)},onClose:()=>closed++})}};
}
function find(node,predicate){if(Array.isArray(node)){for(const child of node){const hit=find(child,predicate);if(hit)return hit}}else if(node&&typeof node==='object'){if(predicate(node))return node;return find(node.children,predicate)}return null;}
function text(node){return Array.isArray(node)?node.map(text).join(''):node&&typeof node==='object'?text(node.children):node==null||typeof node==='boolean'?'':String(node)}
test('choosing a language remains local until Save preference; Cancel does not save',()=>{
 const h=harness();let view=h.render();find(view,n=>n.type==='input'&&n.props.value==='es').props.onChange();view=h.render();
 assert.equal(find(view,n=>n.type==='input'&&n.props.value==='es').props.checked,true);assert.equal(h.calls.length,0);
 find(view,n=>n.type==='button'&&text(n)==='Cancel').props.onClick();assert.equal(h.closed,1);assert.equal(h.calls.length,0);
 const saved=harness();view=saved.render();find(view,n=>n.type==='input'&&n.props.value==='pl').props.onChange();view=saved.render();find(view,n=>n.type==='form').props.onSubmit({preventDefault(){}});assert.deepEqual(saved.calls,['pl']);assert.equal(saved.closed,1);
});
test('a storage failure leaves the picker open with an error and preserves the pending choice',()=>{
 const h=harness({fail:true});let view=h.render();find(view,n=>n.type==='input'&&n.props.value==='de').props.onChange();view=h.render();find(view,n=>n.type==='form').props.onSubmit({preventDefault(){}});view=h.render();
 assert.equal(h.closed,0);assert.equal(h.calls.length,0);assert.equal(find(view,n=>n.props?.role==='alert').children[0],'Could not save');assert.equal(find(view,n=>n.type==='input'&&n.props.value==='de').props.checked,true);
});
