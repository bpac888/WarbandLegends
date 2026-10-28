import {beforeRarityRevision} from './rarity-revision.js';
// Fingerprint historical records while permitting only the audited name/lore edits.
// This does not run migrations or change saved hero IDs.
export function historicalRecords(records,audit,{source=false}={}){
 records=beforeRarityRevision(records,{source});
 const key=source?'source':'champion',entries=new Map(audit.renames.map(x=>[x.id,x]));
 return records.map(c=>{const x=entries.get(c.id);if(!x)return c;for(const field of Object.keys(x[key+'Before']))if(JSON.stringify(c[field])!==JSON.stringify(x[key+'After'][field]))throw Error('Unexpected identity edit: '+c.id+' '+field);return {...c,...x[key+'Before']};});
}
