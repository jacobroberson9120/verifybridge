import {readFile,access} from 'node:fs/promises';
const base=new URL('../dist/',import.meta.url);const html=await readFile(new URL('index.html',base),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){if(!/^(https?:|\.\/$)/.test(match[1]))await access(new URL(match[1],base));}
for(const file of ['index.html','style.css','app.js','engine.js','guidance.js','i18n.js','link-lens.js','live-scan.js','model.json','manifest.webmanifest','icon.svg','sw.js']){const res=await fetch('http://127.0.0.1:4173/'+file);if(!res.ok)throw Error(`${file}: ${res.status}`);}
console.log('Entrypoint, local assets and HTTP routes verified. No browser interaction or visual QA performed.');
