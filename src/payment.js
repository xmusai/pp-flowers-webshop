(function(root){
 'use strict';
 // Prototype data only. Do not replace this with invented or unverified bank coordinates.
 function transferDetails(order){
  if(!order||order.payment!=='transfer'||order.status!=='awaiting_payment')return null;
  if(typeof order.id!=='string'||!order.id.trim()||/[\r\n]/.test(order.id)||!Number.isSafeInteger(order.totalCents)||order.totalCents<=0)throw Error('This order has no valid bank-transfer details.');
  const details={demo:true,beneficiary:'PP Flowers (demo)',iban:'Not configured in this demo',bic:'Not configured',reference:order.id,amountCents:order.totalCents,currency:'EUR'};
  details.copyText=['PP FLOWERS — DEMO BANK TRANSFER','Not a payment instruction. Do not transfer money.', 'Recipient: '+details.beneficiary,'IBAN: '+details.iban,'BIC / SWIFT: '+details.bic,'Amount: EUR '+(details.amountCents/100).toFixed(2),'Payment reference: '+details.reference].join('\n');
  details.qrPayload=details.copyText;
  return details;
 }
 function qrMatrix(payload,factory){
  if(typeof payload!=='string'||!payload||typeof factory!=='function')throw Error('QR code unavailable.');
  // UTF-8 encoder supplied by the pinned QR library; no external QR service receives order data.
  factory.stringToBytes=factory.stringToBytesFuncs['UTF-8'];
  const code=factory(0,'M');code.addData(payload,'Byte');code.make();
  const count=code.getModuleCount();
  return Array.from({length:count},(_,r)=>Array.from({length:count},(_,c)=>code.isDark(r,c)));
 }
 function topUpDetails(topup){
  if(!topup||typeof topup.id!=='string'||!topup.id.trim()||/[\r\n]/.test(topup.id)||!Number.isSafeInteger(topup.amountCents)||topup.amountCents<5000||topup.amountCents>10000000)throw Error('This top-up has no valid transfer details.');
  const details={demo:true,beneficiary:'PP Flowers (demo)',iban:'Not configured in this demo',bic:'Not configured',reference:topup.id,amountCents:topup.amountCents,currency:'EUR'};
  details.copyText=['PP FLOWERS — DEMO BALANCE TOP-UP','Not a payment instruction. Do not transfer money.','Recipient: '+details.beneficiary,'IBAN: '+details.iban,'BIC / SWIFT: '+details.bic,'Amount: EUR '+(details.amountCents/100).toFixed(2),'Payment reference: '+details.reference].join('\n');
  details.qrPayload=details.copyText;return details;
 }
 const api={transferDetails,topUpDetails,qrMatrix};root.PPPayment=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
