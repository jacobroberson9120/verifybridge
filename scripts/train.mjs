import {readFile,writeFile} from 'node:fs/promises';
import {tokens} from '../dist/engine.js';
const rows=JSON.parse(await readFile(new URL('../data/training.json',import.meta.url),'utf8'));
const counts=[new Map(),new Map()], totals=[0,0],docs=[0,0],vocab=new Set();
for(const row of rows){docs[row.label]++;for(const token of tokens(row.text)){vocab.add(token);counts[row.label].set(token,(counts[row.label].get(token)||0)+1);totals[row.label]++;}}
const weights=Object.fromEntries([...vocab].sort().map(t=>[t,Math.log(((counts[1].get(t)||0)+1)/(totals[1]+vocab.size))-Math.log(((counts[0].get(t)||0)+1)/(totals[0]+vocab.size))]));
const model={algorithm:'multinomial-naive-bayes',version:1,trainingExamples:rows.length,synthetic:true,bias:Math.log(docs[1]/docs[0]),weights};
await writeFile(new URL('../dist/model.json',import.meta.url),JSON.stringify(model));
console.log(`Trained on ${rows.length} synthetic examples; ${vocab.size} tokens. No real-world accuracy claim.`);
