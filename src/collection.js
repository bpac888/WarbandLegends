// One filter contract shared by collection, codex and team selection.
export const DEFAULT_FILTERS=Object.freeze({tab:'owned',query:'',color:'all',rarity:'all',mana:'all',role:'all',faction:'all',sort:'rarity'});
export const factionLabel=id=>id.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()).replace('Dragondynasty','Dragon Dynasty').replace('Duneriders','Dune Riders').replace('Neonsyndicate','Neon Syndicate');
export function filterChampions(roster,profile,filters={}){
 const f={...DEFAULT_FILTERS,...filters},clean=v=>v.toLowerCase().replace(/[^a-z0-9]/g,''),query=clean(f.query.trim());
 const rows=roster.filter(c=>(f.tab==='all'||!!profile.collection[c.id])&&(f.color==='all'||c.color===f.color)&&(f.rarity==='all'||c.rarity===f.rarity)&&(f.mana==='all'||c.manaSpeed===f.mana)&&(f.role==='all'||c.role===f.role)&&(f.faction==='all'||c.faction===f.faction)&&(!query||clean(`${c.name} ${c.faction} ${factionLabel(c.faction)}`).includes(query)));
 const rarity={mythical:4,legendary:3,rare:2,common:1};
 return rows.sort((a,b)=>{const byName=a.name.localeCompare(b.name);return f.sort==='name'?byName:f.sort==='attack'?b.atk-a.atk||byName:f.sort==='defense'?b.def-a.def||byName:f.sort==='health'?b.hp-a.hp||byName:rarity[b.rarity]-rarity[a.rarity]||byName;});
}
