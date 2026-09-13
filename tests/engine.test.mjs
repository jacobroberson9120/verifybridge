import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {analyze,suspiciousHosts,normalize,isProtectiveAdvice} from '../dist/engine.js';import {examples,copy} from '../dist/i18n.js';
const model=JSON.parse(await readFile(new URL('../dist/model.json',import.meta.url),'utf8'));
const enhancementKeys=new Set(['skip','methodPrivacy','methodExplain','methodLimits','uscisResource','copyPlan','planHeading','planFooter','copied','copyFailed','officialTitle','officialBody']);
for(const lang of Object.keys(examples)){
test(`${lang}: payment and threat`,()=>{const r=analyze(examples[lang].threat,model);assert.equal(r.level,'high');assert.ok(r.findings.some(f=>f.id==='payment'));assert.ok(r.findings.some(f=>f.id==='domain'));});
test(`${lang}: family emergency`,()=>{assert.ok(analyze(examples[lang].family,model).findings.some(f=>f.id==='family'));});
test(`${lang}: routine reminder`,()=>{assert.equal(analyze(examples[lang].routine,model).level,'unknown');});
test(`${lang}: translations complete`,()=>{assert.deepEqual(Object.keys(copy[lang]).filter(k=>!enhancementKeys.has(k)).sort(),Object.keys(copy.en).filter(k=>!enhancementKeys.has(k)).sort());assert.deepEqual(Object.keys(copy[lang].labels).sort(),Object.keys(copy.en.labels).sort());});}
test('official subdomains are not flagged as lookalikes',()=>assert.deepEqual(suspiciousHosts('https://www.uscis.gov/a https://my.uscis.gov https://ice.gov'),[]));
test('deceptive suffix and userinfo do not bypass host parsing',()=>{assert.deepEqual(suspiciousHosts('https://uscis.gov.attacker.com'),['uscis.gov.attacker.com']);assert.deepEqual(suspiciousHosts('https://attacker.com@uscis-fake.com'),['uscis-fake.com']);});
test('unrelated hostname with ice substring is not flagged',()=>assert.deepEqual(suspiciousHosts('https://nice.com https://service.org'),[]));
test('missing model leaves rules functional',()=>{const r=analyze('Pay with gift cards immediately or face arrest.');assert.equal(r.level,'high');assert.equal(r.model.signal,'unavailable');});
test('empty and excessive input rejected',()=>{assert.throws(()=>analyze('  '),/empty/);assert.throws(()=>analyze('a'.repeat(10001)),/long/);});
test('unfamiliar text is inconclusive, never safe',()=>{const r=analyze('zzqv vxzz qqqq',model);assert.equal(r.level,'unknown');assert.equal(r.model.signal,'insufficient');});
test('unicode normalization detects zero-width and full-width evasion',()=>{assert.equal(normalize('ＰＡＹ'),'pay');assert.equal(analyze('P\u200bay with gift cards or face arrest',model).level,'high');});
test('spaced-out payment wording does not bypass detection',()=>assert.equal(analyze('P a y with g i f t c a r d today or face arrest.',model).level,'high'));
test('common character substitutions do not bypass risky payment detection',()=>assert.equal(analyze('Pay now with g1ft cards or face arrest.',model).level,'high'));
test('safety advice is not treated as a scam request',()=>{const r=analyze('Never pay with gift cards. Scammers threaten arrest.',model);assert.equal(r.level,'unknown');assert.equal(r.protective,true);});
test('quoted educational scam examples are not treated as direct requests',()=>{const r=analyze('Warning example: scammers may ask you to pay with gift cards.',model);assert.equal(r.level,'unknown');assert.equal(r.protective,true);});
test('a warning label does not hide a direct payment demand',()=>assert.equal(analyze('Warning: you must pay now with gift cards or face arrest.',model).level,'high'));
test('protective advice patterns cover all supported languages',()=>{for(const text of ['No compartas tu contraseña con nadie.','Đừng gửi mật khẩu cho bất kỳ ai.','不要向任何人发送密码。'])assert.ok(isProtectiveAdvice(normalize(text)));});
test('an agency fee reference needs an actual request before it becomes a finding',()=>{const r=analyze('Your visa application fee receipt is available for your records.',model);assert.equal(r.level,'unknown');assert.equal(r.findings.length,0);});
test('a real payment demand still receives a warning',()=>assert.equal(analyze('Pay the visa fee with gift cards today or face arrest.',model).level,'high'));
test('new-number family money request triggers a cautious review',()=>{const r=analyze('I changed my number, Mum. Can you cover this invoice for me?',model);assert.equal(r.level,'review');assert.ok(r.findings.some(f=>f.id==='impersonation'));});
test('a number change without a money request stays unflagged',()=>assert.equal(analyze('Mum, I changed my number. Please save it.',model).level,'unknown'));
test('credential-phishing login lure triggers a cautious review',()=>{const r=analyze('Microsoft 365 notice: your account will be disabled today. Sign in now at https://microsoft365-security-check.example to keep your email and files.',model);assert.equal(r.level,'review');assert.ok(r.findings.some(f=>f.id==='sensitive'));});
test('ordinary service notice without urgency or sign-in lure stays unflagged',()=>assert.equal(analyze('Microsoft 365 service status is available at https://status.office.com.',model).level,'unknown'));
test('official immigration fee reminder without payment request stays unflagged',()=>{
 const r=analyze('USCIS reminder: review your case status at https://www.uscis.gov and keep your receipt for your records.',model);
 assert.equal(r.level,'unknown');
 assert.equal(r.findings.length,0);
});
test('mixed case official government hosts are not suspicious',()=>assert.deepEqual(suspiciousHosts('HTTPS://My.USCIS.GOV/account and www.ICE.gov/news'),[]));
test('duplicate suspicious hosts are reported once',()=>assert.deepEqual(suspiciousHosts('uscis-login.example.com and https://uscis-login.example.com/pay'),['uscis-login.example.com']));
test('punctuation-obfuscated credential lure is reviewed',()=>{
 const r=analyze('Your account expires today. Please log-in at https://secure-mail.example.com/password to verify access.',model);
 assert.equal(r.level,'review');
 assert.ok(r.findings.some(f=>f.id==='sensitive'));
});
test('Spanish payment threat triggers high warning',()=>{
 const r=analyze('Debe pagar hoy con tarjeta de regalo o sera detenido por inmigracion.',model);
 assert.equal(r.level,'high');
 assert.ok(r.findings.some(f=>f.id==='payment'));
});
test('Vietnamese password warning advice stays protective',()=>{
 const r=analyze('Cảnh báo: đừng gửi mật khẩu hoặc mã xác minh cho bất kỳ ai.',model);
 assert.equal(r.level,'unknown');
 assert.equal(r.protective,true);
});
test('Chinese urgent payment and visa language triggers warning',()=>{
 const r=analyze('请立即付款，否则签证会被取消。',model);
 assert.equal(r.level,'high');
 assert.ok(r.findings.some(f=>f.id==='threat'||f.id==='urgency'||f.id==='agency'));
});
test('ordinary cancellation notice without payment request stays unflagged',()=>{
 const r=analyze('Your appointment was canceled. Please schedule a new time on the official website.',model);
 assert.equal(r.level,'unknown');
});
test('quoted direct scam demand remains direct when it asks the reader to act',()=>{
 const r=analyze('This is urgent: you must pay now with gift cards or face arrest.',model);
 assert.equal(r.level,'high');
});
