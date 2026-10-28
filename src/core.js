(function(root){
 'use strict';
 const KEY='ppflowers.refined.v3',MIN=50000,SHIPPING=2450;
 const clone=x=>JSON.parse(JSON.stringify(x));
 const iso=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
 function dates(now=new Date()){const d=new Date(now),out=[];d.setHours(12,0,0,0);while(out.length<10){d.setDate(d.getDate()+1);out.push(iso(d));}return out;}
 const defaultContact={email:'orders@testaccount.nl',first:'Test',last:'Account',street:'Bloemenmarkt 12',postcode:'1012 LM',city:'Amsterdam',country:'Netherlands',phone:''};
 // One stable demo account ID; a production account service supplies its own customerId.
 const DEMO_CUSTOMER_ID='PP-100001';
 function customerId(s){const id=s.customerId;if(typeof id==='string'&&id.trim())return id.trim();if(Number.isSafeInteger(id)&&id>=0)return String(id);return DEMO_CUSTOMER_ID;}
 const LANGUAGES=[{code:'en',name:'English',nativeName:'English'},{code:'nl',name:'Dutch',nativeName:'Nederlands'},{code:'de',name:'German',nativeName:'Deutsch'},{code:'fr',name:'French',nativeName:'Français'},{code:'es',name:'Spanish',nativeName:'Español'},{code:'it',name:'Italian',nativeName:'Italiano'},{code:'pt',name:'Portuguese',nativeName:'Português'},{code:'pl',name:'Polish',nativeName:'Polski'}];
 function preferredLanguage(s){return LANGUAGES.some(l=>l.code===s.profile?.preferredLanguage)?s.profile.preferredLanguage:'en';}
 function setLanguagePreference(s,code){if(!LANGUAGES.some(l=>l.code===code))throw Error('Choose a language from the list.');return{...s,profile:{...s.profile,preferredLanguage:code}};}
 // Contact verification is a local UI demonstration, never an authentication claim.
 function normalizedContact(kind,value){const text=String(value||'').trim();return kind==='email'?text.toLowerCase():text.replace(/[\s().-]/g,'').replace(/^00/,'+');}
 function contactSettingsErrors(contact){const errors={};for(const key of ['first','last'])if(!String(contact[key]||'').trim())errors[key]=(key==='first'?'First':'Last')+' name is required.';if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(contact.email||'').trim()))errors.email='Enter a valid email address.';if(String(contact.phone||'').trim()&&!/^\+[1-9]\d{7,14}$/.test(normalizedContact('phone',contact.phone)))errors.phone='Include a country code, for example +31 6 1234 5678.';return errors;}
 function contactPreviewComplete(s,kind,value=s.contact?.[kind]){const record=s.profile?.contactVerificationPreview?.[kind];return ['email','phone'].includes(kind)&&!!normalizedContact(kind,value)&&record?.mode==='demo'&&record.value===normalizedContact(kind,value)&&Number.isFinite(Date.parse(record.completedAt));}
 function saveContactSettings(s,fields){
  const contact={...s.contact};for(const key of ['first','last','email','phone'])contact[key]=String(fields[key]||'').trim();
  const errors=contactSettingsErrors(contact);if(Object.keys(errors).length)throw Error(Object.values(errors)[0]);
  const profile={...s.profile},preview={...profile.contactVerificationPreview};for(const kind of ['email','phone'])if(normalizedContact(kind,s.contact[kind])!==normalizedContact(kind,contact[kind]))delete preview[kind];
  if(profile.contactVerificationPreview)profile.contactVerificationPreview=preview;
  // Keep the onboarding draft from restoring old contact values when it is next saved.
  if(profile.verification)profile.verification={...profile.verification,contact:{...profile.verification.contact,first:contact.first,last:contact.last,email:contact.email,phone:contact.phone}};
  return {...s,contact,profile};
 }
 function contactPreviewChallenge(kind,value,now=Date.now(),code=String(Math.floor(100000+Math.random()*900000))){
  if(!['email','phone'].includes(kind))throw Error('Choose email or phone.');const target=normalizedContact(kind,value),errors=contactSettingsErrors({...defaultContact,[kind]:value});
  if(!target||errors[kind])throw Error(errors[kind]||'Add a phone number first.');if(!/^\d{6}$/.test(code))throw Error('The preview code must contain six digits.');
  return {kind,value:target,code,expiresAt:Number(now)+5*60*1000,attempts:0};
 }
 function checkContactPreview(challenge,code,now=Date.now()){
  if(!challenge||!['email','phone'].includes(challenge.kind))throw Error('Start a new verification preview.');
  if(now>=challenge.expiresAt)return {challenge,error:'This code has expired. Generate a new demo code.'};
  if(challenge.attempts>=5)return {challenge,error:'Too many attempts. Generate a new demo code.'};
  const next={...challenge,attempts:challenge.attempts+1};if(!/^\d{6}$/.test(String(code).trim())||String(code).trim()!==challenge.code)return {challenge:next,error:next.attempts>=5?'Too many attempts. Generate a new demo code.':'The code does not match. Try again.'};
  return {challenge:next,error:''};
 }
 function completeContactPreview(s,kind,value,now=new Date()){
  if(!['email','phone'].includes(kind)||!normalizedContact(kind,value)||normalizedContact(kind,s.contact[kind])!==normalizedContact(kind,value))throw Error('Your contact details changed. Save them and start verification again.');
  contactPreviewChallenge(kind,value,now.getTime(),'123456');
  return {...s,profile:{...s.profile,contactVerificationPreview:{...s.profile?.contactVerificationPreview,[kind]:{mode:'demo',value:normalizedContact(kind,value),completedAt:now.toISOString()}}}};
 }
 function initial(now=new Date()){return{version:3,customerId:DEMO_CUSTOMER_ID,cart:[],orders:[],tickets:[],saved:['r-rednaomi','gr-euc','p-sarah'],drafts:[],delivery:dates(now)[0],contact:clone(defaultContact),balanceCents:0,topups:[],profile:{}};}
 // The legacy delivery field stores the chosen departure date; keep saved baskets and orders compatible.
 function read(storage,now=new Date()){const defaults=initial(now);try{const v=JSON.parse(storage.getItem(KEY));if(v?.version===3&&Array.isArray(v.cart)&&Array.isArray(v.orders)){return{...defaults,...v,customerId:customerId(v),delivery:dates(now).includes(v.delivery)?v.delivery:defaults.delivery};}}catch{}return defaults;}
 function persist(storage,s){storage.setItem(KEY,JSON.stringify(s));}
 function totals(lines){const subtotalCents=lines.reduce((n,l)=>n+l.unitCents*l.qty,0);const shippingCents=lines.length?SHIPPING:0;return{subtotalCents,shippingCents,totalCents:subtotalCents+shippingCents,remainingCents:Math.max(0,MIN-subtotalCents)};}
 function qtyError(o,n){if(!Number.isSafeInteger(n)||n<o.minQty)return'Minimum '+o.minQty+' '+o.unit+'s.';if(n%o.step)return'Order in multiples of '+o.step+'.';if(n>o.maxQty)return'Only '+o.maxQty+' '+o.unit+'s available.';return'';}
 function setQty(lines,o,n){if(n===0)return lines.filter(l=>l.id!==o.id);const err=qtyError(o,n);if(err)throw Error(err);let hit=false;const next=lines.map(l=>{if(l.id!==o.id)return l;hit=true;return{...l,qty:n};});return hit?next:[...lines,{...clone(o),qty:n}];}
 function add(lines,o,n){return setQty(lines,o,(lines.find(l=>l.id===o.id)?.qty||0)+n);}
 function validateContact(c){let e={};if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email||''))e.email='Enter a valid email address.';for(const[k,label]of Object.entries({first:'First name',last:'Last name',street:'Street and house number',postcode:'Postcode',city:'City',country:'Country'}))if(!String(c[k]||'').trim())e[k]=label+' is required.';return e;}
 function review(lines,offers,day){return lines.flatMap(l=>{const o=offers.find(o=>o.id===l.id);if(!o||o.maxQty<l.qty)return[{id:l.id,type:'stock',message:l.name+' has insufficient stock.',offer:o||null}];if(o.availableDate>day)return[{id:l.id,type:'delivery',message:l.name+' can depart from '+o.availableDate+'.',offer:o}];if(o.unitCents!==l.unitCents)return[{id:l.id,type:'price',message:l.name+' has a new price.',offer:o}];return[];});}
 function place(s,{contact,delivery,payment,offers,now=new Date()}){const fields=validateContact(contact);if(Object.keys(fields).length)throw Error('Check your shipping address and contact details.');if(!dates(now).includes(delivery))throw Error('Choose an available departure date.');if(!s.cart.length||totals(s.cart).remainingCents)throw Error('The order minimum is €500, excluding shipping.');for(const l of s.cart){const err=qtyError(l,l.qty);if(err)throw Error(err);}if(review(s.cart,offers,delivery).length)throw Error('Review the changed offers before placing your order.');if(!['transfer','balance'].includes(payment))throw Error('Choose a payment method.');const money=totals(s.cart);if(payment==='balance'&&s.balanceCents<money.totalCents)throw Error('Your balance is too low.');const id='PP-'+now.getTime().toString(36).toUpperCase();const order={id,placedAt:now.toISOString(),delivery,contact:clone(contact),payment,status:payment==='balance'?'confirmed':'awaiting_payment',lines:clone(s.cart),...money};return{state:{...s,cart:[],orders:[order,...s.orders],contact:clone(contact),delivery,balanceCents:s.balanceCents-(payment==='balance'?money.totalCents:0)},order};}
 function prepareTopUp(s,cents,now=new Date()){if(!Number.isSafeInteger(cents)||cents<5000||cents>10000000)throw Error('Enter an amount between €50 and €100,000.');return{id:'TU-'+now.getTime().toString(36).toUpperCase()+'-'+((s.topups||[]).length+1),createdAt:now.toISOString(),amountCents:cents};}
 function applyDemoTopUp(s,topup){
  if(!topup||typeof topup.id!=='string'||!topup.id.trim()||/[\r\n]/.test(topup.id)||!Number.isFinite(Date.parse(topup.createdAt)))throw Error('Start a new top-up preview.');
  if(!Number.isSafeInteger(topup.amountCents)||topup.amountCents<5000||topup.amountCents>10000000)throw Error('Enter an amount between €50 and €100,000.');const entries=s.topups||[],existing=entries.find(entry=>entry.id===topup.id);
  if(existing){if(existing.amountCents!==topup.amountCents)throw Error('This reference is already in use. Start a new top-up preview.');return s;}
  const balanceCents=s.balanceCents+topup.amountCents;if(!Number.isSafeInteger(balanceCents))throw Error('This amount cannot be added to your balance.');
  return {...s,balanceCents,topups:[{id:topup.id,createdAt:topup.createdAt,amountCents:topup.amountCents},...entries]};
 }
 function topUp(s,cents,now=new Date()){return applyDemoTopUp(s,prepareTopUp(s,cents,now));}
 function validateTicket(fields,orders=[]){const errors={};if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(fields.email||'').trim()))errors.email='Enter a valid email address.';for(const [key,label,max] of [['subject','subject',120],['message','message',5000]]){const value=String(fields[key]||'').trim();if(!value)errors[key]='Enter a '+label+'.';else if(value.length>max)errors[key]='Keep your '+label+' under '+max+' characters.';}if(fields.orderId&&!orders.some(o=>o.id===fields.orderId))errors.orderId='Choose an order from your account.';return errors;}
 function ticketMessages(ticket){return Array.isArray(ticket.messages)&&ticket.messages.length?ticket.messages:[{id:ticket.id+'-message-1',author:'customer',body:ticket.message||'',createdAt:ticket.createdAt,notSent:ticket.status==='not_sent'}];}
 function createTicket(s,fields,now=new Date()){if(Object.keys(validateTicket(fields,s.orders)).length)throw Error('Check your ticket details.');const entries=s.tickets||[],stamp=now.toISOString(),id='CS-'+now.getTime().toString(36).toUpperCase()+'-'+(entries.length+1);const ticket={id,createdAt:stamp,updatedAt:stamp,status:'not_sent',email:fields.email.trim(),subject:fields.subject.trim(),message:fields.message.trim(),orderId:fields.orderId||'',messages:[{id:id+'-message-1',author:'customer',body:fields.message.trim(),createdAt:stamp,notSent:true}]};return{state:{...s,tickets:[ticket,...entries]},ticket};}
 const TICKET_FILE_COUNT=5,TICKET_FILE_BYTES=2*1024*1024;
 function ticketAttachmentError(files=[]){if(!Array.isArray(files)||files.length>TICKET_FILE_COUNT)return'Attach up to 5 files per reply.';if(files.some(f=>!f||!String(f.name||'').trim()||String(f.name).length>255||!Number.isSafeInteger(f.size)||f.size<=0))return'Choose a non-empty file with a valid filename.';if(files.reduce((n,f)=>n+f.size,0)>TICKET_FILE_BYTES)return'Attachments must be 2 MB or less in total.';return'';}
 function ticketAttachments(files=[]){const error=ticketAttachmentError(files);if(error)throw Error(error);return files.map(f=>{const match=String(f.data||'').match(/^data:application\/octet-stream;base64,([A-Za-z0-9+/]+={0,2})$/),base64=match?.[1]||'',bytes=base64.length/4*3-(base64.endsWith('==')?2:base64.endsWith('=')?1:0);if(!match||base64.length%4||bytes!==f.size)throw Error('This attachment could not be read. Please attach it again.');return{name:String(f.name).replace(/[\\/\u0000-\u001f\u007f]/g,'_'),size:f.size,data:f.data};});}
 function replyTicket(s,id,body,now=new Date(),files=[]){const attachments=ticketAttachments(files),text=String(body||'').trim();if((!text&&!attachments.length)||text.length>5000)throw Error('Write a reply of up to 5,000 characters or attach a file.');const original=(s.tickets||[]).find(t=>t.id===id);if(!original)throw Error('This ticket is no longer available.');const messages=ticketMessages(original),stamp=now.toISOString(),messageId=id+'-message-'+(messages.length+1),ticket={...original,updatedAt:stamp,status:'not_sent',messages:[...messages,{id:messageId,author:'customer',body:text,createdAt:stamp,notSent:true,...(attachments.length?{attachments:attachments.map((a,i)=>({...a,id:messageId+'-file-'+(i+1)}))}:{})}]};return{state:{...s,tickets:s.tickets.map(t=>t.id===id?ticket:t)},ticket};}
 function search(products,q){let text=q.toLowerCase().replace(/(\d+)\s*cm\s*\+?/g,' ').trim();const length=q.match(/(\d+)\s*cm/i);const tokens=text.split(/\s+/).filter(Boolean);return products.filter(p=>(!length||p.stemCm===Number(length[1]))&&tokens.every(t=>[p.name,p.sub,p.grower,p.origin,p.cat,p.colour,p.sku].join(' ').toLowerCase().includes(t)));}
 const api={KEY,MIN,SHIPPING,clone,dates,defaultContact,DEMO_CUSTOMER_ID,customerId,LANGUAGES,preferredLanguage,setLanguagePreference,normalizedContact,contactSettingsErrors,contactPreviewComplete,saveContactSettings,contactPreviewChallenge,checkContactPreview,completeContactPreview,initial,read,persist,totals,qtyError,setQty,add,validateContact,review,place,topUp,prepareTopUp,applyDemoTopUp,validateTicket,createTicket,ticketMessages,replyTicket,TICKET_FILE_COUNT,TICKET_FILE_BYTES,ticketAttachmentError,ticketAttachments,search};root.PPModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
