import {ARENA_STAGES,EVENT_STAGES,SPECIAL_EVENTS,eventWindow,eventAttemptsLeft} from './modes.js';
// Independent Legends encounters. Structure/names/art adapted from the owner's source game.
export const DIFFICULTIES=[
 {id:'normal',label:'Normal',realm:'The First Crossing',description:'A living realm. The first shadows gather.',art:'assets/scenes/world-map.svg',mult:1,color:'#92c99c'},
 {id:'hard',label:'Hard',realm:'The Ashfall March',description:'War has reached the roads. Towers fall and the forests burn.',art:'assets/scenes/world-map-hard.svg',mult:1.4,color:'#e3b06e'},
 {id:'nightmare',label:'Nightmare',realm:'The World Unmade',description:'The same world, broken beneath an eclipse. Only the road remains.',art:'assets/scenes/world-map-nightmare.svg',mult:1.85,color:'#d78d9e'},
];
export const STAGE_NAMES=['The Ashen Gate','The Frozen Pass','The Veil Sanctum','Howling Ford','Iron Crossroads',"Widow’s Watch",'Broken Banner','Salt Marsh','Gallows Rise','Obsidian Gate','Thorn Labyrinth','Echo Crypts','Blood Orchard','Silent Bastion','Ruin Spire','Ember Cathedral','Night Market','Shattered Keep','Pale Moat',"Dragon’s Tooth",'Veil Crossing','Crown of Crows','Abyss Stair','Final Bell','Worldwound Edge'];
const legacyIds=['ashen-gate','frozen-pass','veil-sanctum'];
const formations=[
 ['redknife_tavin','shellback_brukk','rimebow_tessa'],['berserker_ulf','shieldmaiden_runa','ice_shaman_sigrid'],['demon_witchblade','shade_prince','umbral_hierarch'],
 ['camel_rider_rashid','caravan_warden_samira','dune_mage_sorra'],['ironwall_sniper','bronze_juggernaut','rivet_mender_orsa'],
 ['shadow_stalker','pale_matriarch','cursed_acolyte'],['neon_laser_blade','executor_model_z','neon_hacker_empress'],
 ['barkskin_bruiser','the_verdant_king','grove_druid'],['blood_paladin','vlad_the_soul_eater','carmine_veinreader'],
 ['plague_doctor','transmuter_prime','spore_engineer'],['thornweaver_seraph','elder_rootmother','thornveil_dryad'],
 ['ghoul_scavenger','necropolis_titan','cinder_mender_vessa'],['pit_grunt','archangel_lucifer','demon_witchblade'],
 ['dragon_samurai_kenshin','dragon_empress','jade_mender_lian'],['shadow_thrall','yshmir_worldwound','umbral_hierarch'],
];
const route=[[15,77],[20,70],[25,63],[30,57],[34,50],[29,44],[23,39],[22,32],[28,27],[35,24],[43,28],[49,34],[56,37],[61,32],[63,25],[60,18],[53,15],[46,19],[40,14],[42,7],[54,7],[68,12],[77,18],[83,25],[90,14]];
export const CAMPAIGN_STAGES=DIFFICULTIES.flatMap((diff,d)=>STAGE_NAMES.map((name,i)=>{
 const n=i+1,t=Math.max(0,(n-3)/22),early=[[600,240,210],[800,315,280],[1050,400,350]][i];
 const base=early||[1075+525*t,402+118*t,354+176*t],boss=n%5===0;
 const stats=base.map((v,k)=>Math.round(v*diff.mult*(boss?(k===0?1.08:1.03):1)));
 const formation=i<3?formations[i]:formations[(i+(d*3))%formations.length];
 const legacyReward=[{gold:50,xp:80},{gold:75,xp:120},{gold:100,xp:180}][i];
 return {id:d===0&&i<3?legacyIds[i]:`campaign-${diff.id}-${String(n).padStart(2,'0')}`,mode:'campaign',difficulty:diff.id,number:n,name,region:['Emberfall','Frostwake','Umbra'][i]||['The Golden March','Thornwild Reach','The Broken Crown','The Eclipse Road','Worldwound'][Math.floor(i/5)],description:boss?'Defeat the guardian who holds this crossing.':'Break the warband guarding the road.',enemyIds:formation,hp:i===0?.7:i===1?1:1.2,atk:i===0?.65:.9,countdown:d===2?2:3,stats,boss,map:route[i],art:diff.art,portrait:`assets/champions/${formation[1]}.webp`,recommendedLevel:Math.min(80,Math.round(1+i*1.7+d*17)),rewards:d===0&&legacyReward?legacyReward:{gold:Math.round((80+n*9)*diff.mult),xp:Math.round((120+n*15)*diff.mult)}};
}));
export const DUNGEONS=[
 {id:'ashen_crypt',name:'Ashen Crypt',boss:'The Cinder Warden',bossId:'pit_grunt',guards:['redknife_tavin','demon_witchblade'],lore:'A sealed crypt where ash still breathes.',color:'red',rank:0},
 {id:'obsidian_vault',name:'Obsidian Vault',boss:'Arcane Sentinel',bossId:'bronze_juggernaut',guards:['ironwall_sniper','voltaic_priest'],lore:'Runes crawl across walls of black glass.',color:'yellow',rank:1},
 {id:'voidbone_catacombs',name:'Voidbone Catacombs',boss:'Ossuary Herald',bossId:'necropolis_titan',guards:['ghoul_scavenger','cursed_acolyte'],lore:'A throne of bone still hungers beneath the earth.',color:'purple',rank:2},
 {id:'eclipse_spire',name:'Eclipse Spire',boss:'Nightplate Sovereign',bossId:'yshmir_worldwound',guards:['shadow_stalker','shade_prince'],lore:'The spire drinks the sun. Only the eclipse remains.',color:'purple',rank:4},
 {id:'hellgate_forge',name:'Hellgate Forge',boss:'Forge-Wife Eternal',bossId:'demon_witchblade',guards:['pit_grunt','cinder_mender_vessa'],lore:'Hammers still ring in a throat of fire.',color:'red',rank:2},
 {id:'prismatic_vat',name:'Prismatic Vat',boss:'Apotheon Residue',bossId:'elixir_apotheon',guards:['transmuter_prime','spore_engineer'],lore:'What remains when a formula finishes drinking you.',color:'green',rank:5},
 {id:'magmaheart_crucible',name:'Magmaheart Crucible',boss:'Magmaheart Wyrm',bossId:'abyss_lord',guards:['demon_witchblade','pit_grunt'],bossPortrait:'assets/dungeons/magma-wyrm.svg',lore:'The mountain’s heart is a forge. The Wyrm is the kiln.',color:'red',rank:3},
].map(d=>({...d,art:`assets/dungeons/${d.id.replaceAll('_','-')}.svg`}));
export const DUNGEON_STAGES=DUNGEONS.flatMap(d=>DIFFICULTIES.map((diff,i)=>({id:`dungeon-${d.id}-${diff.id}`,mode:'dungeon',dungeonId:d.id,difficulty:diff.id,number:i+1,name:d.name,region:`${diff.label} · Dungeon`,description:d.lore,enemyIds:[d.guards[0],d.bossId,d.guards[1]],bossName:d.boss,bossPortrait:d.bossPortrait,hp:1,atk:1,countdown:i===2?2:3,stats:[Math.round((850+d.rank*110)*diff.mult),Math.round((300+d.rank*27)*diff.mult),Math.round((250+d.rank*35)*diff.mult)],bossHp:1.65,boss:true,art:d.art,portrait:d.art,recommendedLevel:Math.min(80,5+d.rank*7+i*20),rewards:{gold:Math.round((100+d.rank*30)*diff.mult),xp:Math.round((130+d.rank*35)*diff.mult)}})));
export const ENCOUNTERS=[...CAMPAIGN_STAGES,...DUNGEON_STAGES,...ARENA_STAGES,...EVENT_STAGES];
const byId=new Map(ENCOUNTERS.map(e=>[e.id,e]));
export const getEncounter=id=>byId.get(id);
export const campaignStages=(difficulty='normal')=>CAMPAIGN_STAGES.filter(e=>e.difficulty===difficulty);
export function entryError(profile,id,now=new Date()){const e=getEncounter(id);if(!e)return 'Unknown encounter.';
 if(e.mode==='arena')return null;
 if(e.mode==='event'){if(!eventWindow(e.eventId,now)?.active)return 'This event is outside its monthly window.';return eventAttemptsLeft(profile,e.eventId,now)>0?null:'No attempts remain in this event window.';}
 if(profile.openRoster)return null;
 if(e.mode==='campaign')return e.number<=(profile.campaignProgress?.[e.difficulty]||0)+1?null:`Clear stage ${e.number-1} on ${e.difficulty} first.`;
 const index=DIFFICULTIES.findIndex(d=>d.id===e.difficulty);return index===0||profile.dungeonClears?.[`dungeon-${e.dungeonId}-${DIFFICULTIES[index-1].id}`]?null:`Clear ${DIFFICULTIES[index-1].label} in this dungeon first.`;
}
export function encounterAppearance(state){const e=getEncounter(state.stageId);if(['dungeon','event'].includes(e?.mode)&&state.enemies?.[1]){state.enemies[1].name=e.bossName;if(e.bossPortrait)state.enemies[1].portrait=e.bossPortrait;}return state;}

export function enemyLanes(index,count){return count===4?[[0,1],[2,3],[4],[5,6]][index]:[[0,1],[2,3,4],[5,6]][index];}
