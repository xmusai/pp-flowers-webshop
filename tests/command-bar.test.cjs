const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('src/app.jsx','utf8');
const helpers=source.slice(source.indexOf('function setupCommandBarScroll('),source.indexOf('function RHeaderSearch('));
function fixture({y=0,reduced=false}={}){
 const frames=new Map(),listeners=new Map(),changes=[],animations=[];
 let id=0,scroll=y;
 const window={get scrollY(){return scroll},set scrollY(value){throw Error('The controller must not move the viewport')}};
 const context={window,addEventListener:(name,fn,options)=>listeners.set(name,{fn,options}),removeEventListener:name=>listeners.delete(name),requestAnimationFrame:fn=>{frames.set(++id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),matchMedia:()=>({matches:reduced})};
 vm.runInNewContext(helpers+'\nglobalThis.commandFixture={setupCommandBarScroll,animateCommandSearch};',context);
 return {changes,frames,listeners,animations,
  install:()=>context.commandFixture.setupCommandBarScroll(value=>changes.push(value)),
  scroll(value){scroll=value;listeners.get('scroll')?.fn()},
  frame(){const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn())},
  animate(before,after){return context.commandFixture.animateCommandSearch({getBoundingClientRect:()=>after,animate:(keyframes,options)=>{const animation={cancel(){}};animations.push({keyframes,options});return animation}},before)}
 };
}
test('command bar collapses past 40 px and fully restores at the top without writing scroll position',()=>{
 const f=fixture();f.install();f.frame();assert.deepEqual(f.changes,[false]);
 f.scroll(40);f.frame();assert.deepEqual(f.changes,[false]);
 f.scroll(41);f.frame();assert.deepEqual(f.changes,[false,true]);
 f.scroll(800);f.frame();assert.deepEqual(f.changes,[false,true]);
 f.scroll(0);f.frame();f.scroll(-12);f.frame();assert.deepEqual(f.changes,[false,true,false]);
});
test('restored scroll positions initialize compact and scroll bursts produce one update per frame',()=>{
 const f=fixture({y:200});f.install();f.frame();assert.deepEqual(f.changes,[true]);
 assert.equal(f.listeners.get('scroll').options.passive,true);
 f.scroll(20);f.scroll(90);f.scroll(0);assert.equal(f.frames.size,1);f.frame();assert.deepEqual(f.changes,[true,false]);
});
test('leaving a command-bar page removes its listener and cancels a pending frame',()=>{
 const f=fixture(),cleanup=f.install();f.frame();f.scroll(70);assert.equal(f.frames.size,1);
 cleanup();assert.equal(f.listeners.size,0);assert.equal(f.frames.size,0);f.frame();f.scroll(300);f.frame();assert.deepEqual(f.changes,[false]);
});
test('the pill animates from its current rectangle to its new position at 220 ms without scaling text',()=>{
 const f=fixture();const before={left:100,top:100,width:980,height:72},after={left:310,top:20,width:560,height:48};
 f.animate(before,after);const {keyframes,options}=f.animations[0];
 assert.equal(options.duration,220);assert.equal(options.easing,'ease');
 assert.equal(keyframes[0].transform,'translateX(-50%) translate(0px,80px)');
 assert.equal(keyframes[0].width,'980px');assert.equal(keyframes[1].width,'560px');assert.equal(keyframes[1].height,'48px');
 assert.equal(keyframes[1].transform.includes('scale'),false);
});
test('reduced motion skips the pill movement animation',()=>{
 const f=fixture({reduced:true});assert.equal(f.animate({left:0,top:100,width:980,height:72},{left:100,top:20,width:560,height:48}),null);assert.equal(f.animations.length,0);
});
