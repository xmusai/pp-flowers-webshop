const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Babel=require('../vendor/babel.cjs');
const M=require('../src/core.js');
const ctx={M,React:{}};
vm.runInNewContext(Babel.transform(fs.readFileSync('src/support.jsx','utf8')+'\nglobalThis.support={sampleSupportTickets,supportTicketList,supportMessageGroups,supportMessageTime};',{presets:['react']}).code,ctx);
const {sampleSupportTickets,supportTicketList,supportMessageGroups,supportMessageTime}=ctx.support;
const now=new Date('2026-10-21T15:00:00Z');
test('legacy single-message tickets open as conversations and receive replies without losing their original text',()=>{
 const legacy={id:'CS-OLD',subject:'Departure question',message:'Can we collect on Friday?',email:'buyer@example.com',createdAt:'2026-10-10T10:00:00Z',status:'not_sent',orderId:'PP-1'};
 const state={...M.initial(now),tickets:[legacy],cart:[{id:'existing',qty:500}],orders:[{id:'PP-1'}]};
 const before=M.clone(state),result=M.replyTicket(state,legacy.id,'  Our collection reference is ABC-123.  ',now);
 assert.equal(M.ticketMessages(legacy).length,1);
 assert.equal(result.ticket.messages.length,2);
 assert.equal(result.ticket.messages[0].body,legacy.message);
 assert.equal(result.ticket.messages[1].body,'Our collection reference is ABC-123.');
 assert.equal(result.ticket.messages[1].author,'customer');
 assert.equal(result.ticket.messages[1].notSent,true);
 assert.equal(result.ticket.status,'not_sent');
 assert.equal(result.ticket.orderId,'PP-1');
 assert.equal(result.ticket.updatedAt,now.toISOString());
 assert.deepEqual(state,before);
 assert.deepEqual(result.state.cart,state.cart);assert.deepEqual(result.state.orders,state.orders);
});
test('created ticket and multiple replies round-trip through existing browser storage with unique message identities',()=>{
 const state=M.initial(now),created=M.createTicket(state,{email:' buyer@example.com ',subject:' Bulk order ',message:'A question about 2,000 stems.',orderId:''},now);
 const first=M.replyTicket(created.state,created.ticket.id,'First follow-up.',now),second=M.replyTicket(first.state,created.ticket.id,'Second follow-up.',now);
 assert.equal(second.ticket.messages.length,3);
 assert.equal(new Set(second.ticket.messages.map(m=>m.id)).size,3);
 assert.equal(second.ticket.messages[0].body,'A question about 2,000 stems.');
 const mem=new Map(),storage={getItem:k=>mem.get(k),setItem:(k,v)=>mem.set(k,v)};
 M.persist(storage,second.state);assert.deepEqual(M.read(storage,now).tickets,second.state.tickets);
 assert.equal(state.tickets.length,0);
});
test('invalid replies and missing ticket IDs cannot modify any history or shopping state',()=>{
 const created=M.createTicket(M.initial(now),{email:'buyer@example.com',subject:'A question',message:'Hello'},now),state=created.state,before=M.clone(state);
 for(const text of ['', '  ', 'a'.repeat(5001)])assert.throws(()=>M.replyTicket(state,created.ticket.id,text,now),/reply/);
 assert.throws(()=>M.replyTicket(state,'unknown','A valid reply.',now),/no longer available/);
 assert.deepEqual(state,before);
});
test('ticket folders and multiword search include earlier messages, references and assignees',()=>{
 const samples=sampleSupportTickets(now),before=JSON.stringify(samples);
 assert.equal(samples.length,6);assert.ok(samples.every(t=>t.sample&&t.id.startsWith('SAMPLE-')));
 assert.equal(supportTicketList(samples,'awaiting_customer').length,1);
 assert.equal(supportTicketList(samples,'resolved').length,3);
 assert.equal(supportTicketList(samples,'in_progress').length,2);
 assert.equal(supportTicketList(samples,'not_sent').length,0);
 assert.equal(supportTicketList(samples,'all','transport Friday')[0].reference,'#1048');
 assert.equal(supportTicketList(samples,'all','PP-1038 Emma')[0].reference,'#1046');
 assert.equal(supportTicketList(samples,'resolved','missing').length,0);
 assert.equal(supportTicketList(samples,'all','', 'oldest')[0].reference,'#1032');
 assert.equal(supportTicketList(samples)[0].reference,'#1048');
 assert.equal(JSON.stringify(samples),before);
});
test('sample reply preview is separate from the buyers persisted ticket history',()=>{
 const state=M.initial(now),before=M.clone(state),samples=sampleSupportTickets(now);
 const preview=M.replyTicket({tickets:samples},samples[0].id,'Preview response',now);
 assert.equal(preview.ticket.messages.length,4);assert.equal(samples[0].messages.length,3);
 assert.equal(preview.ticket.sample,true);assert.deepEqual(state,before);
 assert.equal(sampleSupportTickets(now)[0].messages.length,3);
});

test('reply attachments preserve exact downloadable bytes through storage without changing shopping state',()=>{
 const state=M.createTicket(M.initial(now),{email:'buyer@example.com',subject:'Order photos',message:'A question.'},now).state,before=M.clone(state);
 const content='Sample packing information.\n',file={name:'packing-notes.txt',size:Buffer.byteLength(content),data:'data:application/octet-stream;base64,'+Buffer.from(content).toString('base64')};
 const result=M.replyTicket(state,state.tickets[0].id,'Please see the attached file.',now,[file]),message=result.ticket.messages.at(-1);
 assert.equal(message.attachments.length,1);assert.equal(message.attachments[0].name,file.name);assert.equal(message.attachments[0].data,file.data);
 assert.equal(message.attachments[0].size,file.size);assert.ok(message.attachments[0].id.startsWith(message.id));
 const mem=new Map(),storage={getItem:k=>mem.get(k),setItem:(k,v)=>mem.set(k,v)};
 M.persist(storage,result.state);const restored=M.read(storage,now).tickets[0].messages.at(-1);
 assert.equal(Buffer.from(restored.attachments[0].data.split(',')[1],'base64').toString(),content);
 assert.deepEqual(state,before);assert.deepEqual(result.state.cart,state.cart);assert.deepEqual(result.state.orders,state.orders);
 file.name='Changed after saving';assert.equal(message.attachments[0].name,'packing-notes.txt');
});
test('attachment-only replies are searchable by filename and file payloads cannot bypass validation',()=>{
 const state=M.createTicket(M.initial(now),{email:'buyer@example.com',subject:'Quality question',message:'Hello'},now).state,before=M.clone(state),file={name:'quality-photo.txt',size:3,data:'data:application/octet-stream;base64,YWJj'};
 const result=M.replyTicket(state,state.tickets[0].id,'',now,[file]);
 assert.equal(result.ticket.messages.at(-1).body,'');assert.equal(supportTicketList(result.state.tickets,'all','quality-photo.txt').length,1);
 for(const files of [[{...file,size:4}],[{...file,data:'data:text/html;base64,YWJj'}],[{...file,data:'data:application/octet-stream;base64,invalid'}],[{...file,size:0}],[{...file,size:M.TICKET_FILE_BYTES+1}],Array(6).fill(file),null]){
  assert.throws(()=>M.replyTicket(state,state.tickets[0].id,'Attached',now,files));
 }
 assert.deepEqual(state,before);
 assert.equal(M.ticketAttachmentError(Array(5).fill(file)),'');
 assert.match(M.ticketAttachmentError([{name:'a',size:1048576},{name:'b',size:1048577}]),/2 MB/);
});


test('chat groups messages by the Amsterdam calendar day without changing their order or contents',()=>{
 const messages=[{id:'one',createdAt:'2026-10-20T21:30:00Z',body:'Earlier'},{id:'two',createdAt:'2026-10-20T22:30:00Z',body:'New day'},{id:'three',createdAt:'2026-10-21T01:30:00Z',body:'Later'}],before=JSON.stringify(messages);
 const groups=supportMessageGroups(messages,new Date('2026-10-21T02:00:00Z'));
 assert.equal(groups.length,2);assert.equal(groups[0].day,'2026-10-20');assert.equal(groups[0].label,'Yesterday');assert.equal(groups[1].label,'Today');assert.equal(groups[1].messages.length,2);
 assert.equal(groups.flatMap(g=>g.messages.map(m=>m.id)).join(','),'one,two,three');assert.equal(groups[1].messages[0],messages[1]);assert.equal(JSON.stringify(messages),before);
});
test('chat date grouping handles daylight-saving changes and invalid historical timestamps',()=>{
 const messages=[{id:'summer',createdAt:'2026-10-25T00:30:00Z'},{id:'winter',createdAt:'2026-10-25T01:30:00Z'}];
 const groups=supportMessageGroups(messages,new Date('2026-10-26T00:30:00Z'));assert.equal(groups.length,1);assert.equal(groups[0].label,'Yesterday');assert.equal(groups[0].messages.length,2);
 assert.equal(supportMessageTime(messages[0].createdAt),'02:30');assert.equal(supportMessageTime(messages[1].createdAt),'02:30');
 assert.equal(supportMessageGroups([{createdAt:'invalid'}],now)[0].label,'Date unavailable');assert.equal(supportMessageTime('invalid'),'');assert.equal(supportMessageGroups([],now).length,0);
});
