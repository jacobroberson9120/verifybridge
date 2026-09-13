export function levelFor(score){return score>=70?'high':score>=25?'review':'low';}

export function localCheck(raw){
  let value=raw.trim();
  if(!value)throw Error('Enter a link to inspect.');
  if(!/^https?:\/\//i.test(value))value='https://'+value;
  let parsed;
  try{parsed=new URL(value);}catch{throw Error('Enter a complete address, such as example.com.');}
  const host=parsed.hostname.toLowerCase(),signals=[];
  const add=(text,points)=>signals.push({text,points});
  const labels=host.split('.').filter(Boolean),root=labels.slice(-2).join('.'),path=parsed.pathname+parsed.search;
  if(parsed.protocol==='http:')add('Uses http instead of encrypted https.',22);
  if(/^\d{1,3}(\.\d{1,3}){3}$/.test(host))add('Uses an IP address instead of a domain name.',30);
  if(value.includes('@'))add('Contains @, which can hide the real destination.',32);
  if(host.includes('xn--'))add('Uses punycode that can imitate a familiar name.',28);
  if(['zip','mov','top','xyz','click','link','work','live','cam','rest','cyou','quest'].includes(host.split('.').pop()))add('Uses an unusual domain ending.',14);
  if(['bit.ly','tinyurl.com','t.co','is.gd','cutt.ly','shorturl.at','rebrand.ly','ow.ly'].includes(root))add('Uses a shortened link that hides the final website.',24);
  if(host.includes('uscis')&&!host.endsWith('uscis.gov'))add('Looks like USCIS but is not uscis.gov.',36);
  if(host.includes('irs')&&!host.endsWith('irs.gov'))add('Looks like IRS but is not irs.gov.',36);
  if(host.includes('gov')&&!host.endsWith('.gov'))add('Uses gov in the name but is not a .gov website.',24);
  if(labels.length>=4)add('Uses several subdomains, which can make the real website harder to see.',12);
  if(/\b(account|secure|verify|login|signin|support|wallet|payment|update)\b/i.test(host.replaceAll('-',' ')))add('Puts account or security words in the website name.',12);
  if(/login|signin|verify|account|secure|password|mfa|otp|wallet/i.test(path))add('Uses login or verification language.',10);
  if(/%[0-9a-f]{2}/i.test(path))add('Contains encoded characters in the address path.',8);
  return {value,host,signals,score:Math.min(96,5+signals.reduce((sum,item)=>sum+item.points,0))};
}
