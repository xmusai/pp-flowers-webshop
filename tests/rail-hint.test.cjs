const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('src/app.jsx','utf8');
const hintSource=source.slice(source.indexOf('const RF_HINTED_RAILS='),source.indexOf('function RMarketRail('));

function fixture({reduced=false,overflow=true,offset=0}={}){
 const frames=new Map(),timers=new Map(),listeners=new Map(),classes=new Set(),observers=[];
 let next=1,starts=0,ends=0;
 const media={matches:reduced,addEventListener(type,fn){this.changed=fn},removeEventListener(){this.changed=null}};
 const row={contains:()=>false,addEventListener(type,fn){listeners.set(type,fn)},removeEventListener(type){listeners.delete(type)}};
 const el={scrollWidth:overflow?1800:1200,clientWidth:1200,scrollLeft:offset,closest:()=>row,firstElementChild:{getBoundingClientRect:()=>({width:260})},classList:{add:name=>classes.add(name),remove:name=>classes.delete(name)}};
 const document={hidden:false,activeElement:null,addEventListener(){},removeEventListener(){}};
 const context={document,matchMedia:()=>media,setTimeout:fn=>{const id=next++;timers.set(id,fn);return id},clearTimeout:id=>timers.delete(id),requestAnimationFrame:fn=>{const id=next++;frames.set(id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),IntersectionObserver:class{constructor(fn){this.fn=fn;this.connected=true;observers.push(this)}observe(){}disconnect(){this.connected=false}}};
 vm.runInNewContext(hintSource+'\nglobalThis.install=setupRailSwipeHint;',context);
 const install=(key='row')=>context.install(el,key,()=>starts++,()=>ends++);
 return {el,media,classes,listeners,observers,install,
  get starts(){return starts},get ends(){return ends},get pendingFrames(){return frames.size},
  visible(ratio=.8){const o=observers.at(-1);if(o?.connected)o.fn([{isIntersecting:ratio>0,intersectionRatio:ratio}])},
  settle(){const pending=[...timers.values()];timers.clear();pending.forEach(fn=>fn())},
  frame(time){const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(time))},
  input(type,extra={}){listeners.get(type)?.({type,deltaX:0,deltaY:0,...extra})}
 };
}

test('a visible overflowing row nudges once and returns to its original position',()=>{
 const f=fixture(),cleanup=f.install();
 f.visible(.3);f.settle();assert.equal(f.starts,0);
 f.visible();f.settle();f.frame(0);f.frame(500);
 assert.equal(f.starts,1);assert.ok(f.el.scrollLeft>0&&f.el.scrollLeft<=88);assert.ok(f.classes.has('rf-swipe-hint'));
 f.frame(1250);assert.equal(f.el.scrollLeft,0);assert.equal(f.ends,1);assert.equal(f.classes.size,0);assert.equal(f.pendingFrames,0);
 cleanup();f.install();f.visible();f.settle();assert.equal(f.starts,1);
});
test('horizontal input takes control immediately while vertical scrolling can reveal the hint',()=>{
 const f=fixture();f.install();f.visible();f.input('wheel',{deltaY:50});f.settle();f.frame(0);f.frame(450);
 assert.ok(f.el.scrollLeft>0);
 f.input('wheel',{deltaX:80});assert.equal(f.ends,1);assert.equal(f.pendingFrames,0);
 f.el.scrollLeft=210;f.frame(1500);assert.equal(f.el.scrollLeft,210);assert.equal(f.classes.size,0);
});
test('reduced motion, non-overflowing rows and restored row positions never animate',()=>{
 for(const options of [{reduced:true},{overflow:false},{offset:260}]){
  const f=fixture(options);f.install();f.visible();f.settle();f.frame(0);f.frame(600);
  assert.equal(f.starts,0);assert.equal(f.observers.length,0);assert.equal(f.el.scrollLeft,options.offset||0);
 }
});
test('leaving the viewport or enabling reduced motion ends the nudge at the starting position',()=>{
 for(const reason of ['viewport','motion']){
  const f=fixture();f.install();f.visible();f.settle();f.frame(0);f.frame(500);assert.ok(f.el.scrollLeft>0);
  if(reason==='viewport')f.visible(0);else{f.media.matches=true;f.media.changed()}
  assert.equal(f.el.scrollLeft,0);assert.equal(f.pendingFrames,0);assert.equal(f.ends,1);assert.equal(f.classes.size,0);
 }
});
test('interacting before the hint and unmounting during its delay prevent later movement',()=>{
 const f=fixture(),cleanup=f.install();f.visible();f.input('pointerdown');f.settle();f.frame(500);assert.equal(f.starts,0);
 cleanup();assert.equal(f.listeners.size,0);
 const g=fixture(),remove=g.install();g.visible();remove();g.settle();g.frame(500);assert.equal(g.starts,0);assert.equal(g.listeners.size,0);
});
