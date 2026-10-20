// A catalogue ID identifies a hero design. A copy ID identifies one owned hero.
// The first copy retains its source ID; later copies use a monotonically issued suffix.
export const baseHeroId=id=>String(id).split('~')[0];
export const validCopyId=(id,roster)=>typeof id==='string'&&(id===baseHeroId(id)||/^[1-9][0-9]{0,8}$/.test(id.split('~')[1])&&id.split('~').length===2)&&roster.some(c=>c.id===baseHeroId(id));
export function heroForId(roster,id){const source=roster.find(c=>c.id===baseHeroId(id));return source?{...source,id,baseId:source.id}:null;}
export const ownedHeroes=(profile,roster)=>Object.keys(profile.collection||{}).map(id=>heroForId(roster,id)).filter(Boolean);
export const battleRoster=(profile,roster)=>[...roster,...ownedHeroes(profile,roster).filter(c=>c.id!==c.baseId)];
export const uniqueHeroCount=profile=>new Set(Object.keys(profile.collection||{}).map(baseHeroId)).size;
export function nextCopyId(profile,base){let n=Math.max(1,(profile.copySequence||0)+1);while(profile.collection[base+'~'+n])n++;return {id:profile.collection[base]||profile.copySequence?base+'~'+n:base,sequence:n};}
export function splitLegacyCopies(raw,roster){
 const p=structuredClone(raw),collection={};let sequence=0;
 for(const [id,count]of Object.entries(raw.collection||{})){
  if(!roster.some(c=>c.id===id)||!Number.isSafeInteger(count)||count<1||count>99999)continue;
  collection[id]=1;
  for(let i=1;i<count;i++){sequence++;collection[id+'~'+sequence]=1;}
 }
 return {...p,profileVersion:10,copySequence:sequence,collection};
}
