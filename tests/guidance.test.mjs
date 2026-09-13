import test from 'node:test';
import assert from 'node:assert/strict';
import {guidance,reasonIds,actionSteps} from '../dist/guidance.js';
for(const [lang,g] of Object.entries(guidance)){
 test(`${lang}: every finding has an explanation`,()=>{assert.equal(g.reasons.length,reasonIds.length);assert.ok(g.reasons.every(x=>typeof x==='string'&&x.length>10));});
 test(`${lang}: family and credential requests have appropriate actions`,()=>{const steps=actionSteps([{id:'family'},{id:'sensitive'}],lang);assert.deepEqual(steps,[g.steps[0],g.steps[2],g.steps[3]]);assert.deepEqual(actionSteps([],lang),[g.steps[0],g.steps[1]]);});
}
