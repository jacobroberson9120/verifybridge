const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
export async function onRequestPost({request,env}){
  if(!env.WEB_RISK_API_KEY)return json({error:'Live scanning is not configured.'},503);
  let url,parsed;
  try{({url}=await request.json());if(typeof url!=='string'||url.length>2048)throw Error();parsed=new URL(url);url=parsed.href;}catch{return json({error:'Enter a valid http or https link.'},400);}
  if(!['http:','https:'].includes(parsed.protocol)||!parsed.hostname)return json({error:'Only web links can be scanned.'},400);
  if(parsed.username||parsed.password)return json({error:'Links containing embedded credentials cannot be scanned.'},400);
  const endpoint=new URL('https://webrisk.googleapis.com/v1/uris:search');
  endpoint.searchParams.set('uri',url);
  endpoint.searchParams.append('threatTypes','MALWARE');
  endpoint.searchParams.append('threatTypes','SOCIAL_ENGINEERING');
  endpoint.searchParams.append('threatTypes','UNWANTED_SOFTWARE');
  endpoint.searchParams.set('key',env.WEB_RISK_API_KEY);
  try{const response=await fetch(endpoint,{signal:AbortSignal.timeout(8000)});if(!response.ok)return json({error:'Live scan provider returned status '+response.status+'.'},502);const data=await response.json();return json({checked:true,unsafe:Boolean(data.threat),threat:data.threat?.threatTypes||[]});}catch{return json({error:'Live scan is temporarily unavailable.'},502);}
}
