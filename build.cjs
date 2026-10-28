const fs=require('node:fs'),path=require('node:path');
const Babel=require('./vendor/babel.cjs');
const map=JSON.parse(fs.readFileSync('src/asset-map.json'));
const assetData={};for(const [id,a] of Object.entries(map.paths))assetData[id]='data:'+a.mime+';base64,'+fs.readFileSync(a.path).toString('base64');
let css=fs.readFileSync('src/refined.css','utf8');
for(const [id,url]of Object.entries(assetData))css=css.split(id).join(url);
const resources=Object.fromEntries(Object.entries(map.resources).filter(([id])=>id==='logoDark'||id.startsWith('shot-')).map(([id,uuid])=>[id,assetData[uuid]]));
const compile=text=>Babel.transform(text,{presets:['env','react'],comments:false,compact:true}).code;
let code;
try{code=compile(fs.readFileSync('src/catalogue.jsx','utf8'))+'\n'+compile(fs.readFileSync('src/support.jsx','utf8'))+'\n'+compile(fs.readFileSync('src/payment.jsx','utf8'))+'\n'+compile(fs.readFileSync('src/app.jsx','utf8'));}catch(e){console.error(e.message);process.exit(1);}
const safe=s=>s.replace(/<\/script/gi,'<\\/script');
const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="PP Flowers ordering prototype: explore flowers, compare offers and build a saved order."><title>PP Flowers · Your flower market</title><style>'+css+'</style></head><body><div id="root"></div><script>'+safe(fs.readFileSync('vendor/react.cjs','utf8'))+'</script><script>'+safe(fs.readFileSync('vendor/react-dom.cjs','utf8'))+'</script><script>window.__resources='+JSON.stringify(resources)+';</script><script>'+safe(fs.readFileSync('src/core.js','utf8'))+'</script><script>'+safe('/*\n'+fs.readFileSync('vendor/qrcode-LICENSE.txt','utf8')+'\n*/\n'+fs.readFileSync('vendor/qrcode.cjs','utf8'))+';window.PPQRCode=qrcode;</script><script>'+safe(fs.readFileSync('src/payment.js','utf8'))+'</script><script>'+safe(code)+'</script></body></html>';
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/index.html',html);console.log('Built dist/index.html ('+(html.length/1024/1024).toFixed(1)+' MB), with precompiled JSX and embedded assets.');
