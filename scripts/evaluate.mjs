import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {analyze,normalize} from '../dist/engine.js';
const read=async path=>JSON.parse(await readFile(new URL(path,import.meta.url),'utf8'));
const [cases,training,model]=await Promise.all([read('../data/evaluation.json'),read('../data/training.json'),read('../dist/model.json')]);
const trained=new Set(training.map(x=>normalize(x.text)));
assert.equal(new Set(cases.map(x=>normalize(x.text))).size,cases.length,'Duplicate evaluation case');
for(const item of cases)assert.ok(!trained.has(normalize(item.text)),'Evaluation overlaps training');
const rows=cases.map((item,index)=>{const result=analyze(item.text,model);return {...item,id:index+1,level:result.level,flagged:result.level!=='unknown'};});
let report=`# VerifyBridge diagnostic evaluation\n\n${cases.length} AI-authored synthetic cases, excluded from training. Related multilingual scenarios are not independent observations. Labels reflect the fictional author intent (including scams whose wording is ambiguous). This is a development diagnostic, not independently labeled evidence or a real-world accuracy benchmark. No model retraining or rule tuning used these cases in this iteration.\n\nA flag means either “Pause and verify” or “Strong warning signs.” A miss means “No clear warning signs,” which never means safe.\n\n| Language | Scam cases flagged | Scams missed | Benign cases flagged | Benign cases unflagged |\n|---|---:|---:|---:|---:|\n`;
for(const lang of ['en','es','vi','zh','all']){const subset=rows.filter(x=>lang==='all'||x.lang===lang);const count=(label,flagged)=>subset.filter(x=>x.label===label&&x.flagged===flagged).length;report+=`| ${lang} | ${count(1,true)} | ${count(1,false)} | ${count(0,true)} | ${count(0,false)} |\n`;}
report+='\n## Cases needing review\n\n';
for(const r of rows.filter(x=>x.flagged!==Boolean(x.label)))report+=`- Case ${r.id} (${r.lang}, ${r.kind}): ${r.label?'missed scam':'benign flagged'}; result ${r.level}. ${r.text}\n`;
report+='\n## Next evaluation step\n\nObtain consented or public examples, have independent reviewers label them, keep related templates in one split, and reserve a new untouched test set before tuning. Native-speaker review is pending. Do not use this small challenge set to advertise accuracy.\n';
await writeFile(new URL('../EVALUATION.md',import.meta.url),report);
console.log(report);
