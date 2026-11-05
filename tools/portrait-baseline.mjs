// Preserve expansion-era fingerprints while accepting only explicit artwork revisions.
import {readFile} from 'node:fs/promises';
const {portraits:revisions}=JSON.parse(await readFile(new URL('../data/portrait-revisions.json',import.meta.url),'utf8'));
export function historicalPortraits(portraits){
 return portraits.map(p=>{
  const revision=revisions.find(r=>r.id===p.id);if(!revision)return p;
  if(p.sha256!==revision.approvedSha256)throw Error('Unapproved portrait content: '+p.id);
  return {...p,sha256:revision.baselineSha256};
 });
}
