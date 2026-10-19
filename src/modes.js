// Local ghost rivals adapted from the owner’s Warband Legends presets.
export const ARENA_RIVALS=[
 {
  "preset_id": "rival_ashlord",
  "player_name": "Ashlord_Kael",
  "title": "Cinder Rank III",
  "rating": 1120,
  "team_templates": [
   "pit_grunt",
   "demon_witchblade",
   "shadow_thrall",
   "cursed_acolyte"
  ],
  "flavor": "A dune-scarred warband that never retreats."
 },
 {
  "preset_id": "rival_veilcutter",
  "player_name": "Veilcutter_Nyx",
  "title": "Umbra Contender",
  "rating": 1280,
  "team_templates": [
   "shadow_thrall",
   "cursed_acolyte",
   "ghoul_scavenger",
   "demon_witchblade"
  ],
  "flavor": "Knives first. Mercy never."
 },
 {
  "preset_id": "rival_ironvow",
  "player_name": "IronVow_Bren",
  "title": "Shield Wall",
  "rating": 1350,
  "team_templates": [
   "bronze_juggernaut",
   "pit_grunt",
   "voltaic_priest",
   "steel_oracle"
  ],
  "flavor": "Four shields, one oath."
 },
 {
  "preset_id": "rival_goldvein",
  "player_name": "Goldvein_Mira",
  "title": "Chymera Adept",
  "rating": 1410,
  "team_templates": [
   "spore_engineer",
   "transmuter_prime",
   "mercuric_saboteur",
   "plague_doctor"
  ],
  "flavor": "Alchemy of blood and coin."
 },
 {
  "preset_id": "rival_nightcourt",
  "player_name": "Nightcourt_Vess",
  "title": "Bloodcourt Duelist",
  "rating": 1500,
  "team_templates": [
   "demon_witchblade",
   "cursed_acolyte",
   "abyss_lord",
   "blood_paladin"
  ],
  "flavor": "Court etiquette: kill cleanly."
 },
 {
  "preset_id": "rival_radiant",
  "player_name": "Halo_Seraph",
  "title": "Radiant Vanguard",
  "rating": 1580,
  "team_templates": [
   "voltaic_priest",
   "steel_oracle",
   "bronze_juggernaut",
   "iron_revenant"
  ],
  "flavor": "Light that burns."
 },
 {
  "preset_id": "rival_worldwound",
  "player_name": "Woundwalker",
  "title": "Arena Tyrant",
  "rating": 1720,
  "team_templates": [
   "yshmir_worldwound",
   "elixir_apotheon",
   "abyss_lord",
   "necropolis_titan"
  ],
  "flavor": "Myths made flesh — and angry."
 },
 {
  "preset_id": "rival_dunerider",
  "player_name": "Sandglass_Orin",
  "title": "Dunerider Scout",
  "rating": 1190,
  "team_templates": [
   "mercuric_saboteur",
   "ghoul_scavenger",
   "pit_grunt",
   "shadow_thrall"
  ],
  "flavor": "Quicksilver and carrion."
 },
 {
  "preset_id": "rival_ossuary",
  "player_name": "Bone_Scribe",
  "title": "Nether Chronicler",
  "rating": 1460,
  "team_templates": [
   "necropolis_titan",
   "ghoul_scavenger",
   "shadow_thrall",
   "cursed_acolyte"
  ],
  "flavor": "Every kill is annotated."
 }
];
export const SPECIAL_EVENTS=[
 {id:'crimson_eclipse',name:'Crimson Eclipse',start:1,end:8,boss:'Crimson Praetor of the Eclipse',bossId:'crimson_praetor',guards:['demon_witchblade','blood_paladin'],token:'eclipse_sigil',tokenName:'Eclipse Sigils',theme:'Bloodcourt',flavor:'Bleed and burst pressure. Break the bloodcourt before it breaks you.',lore:'When the moon drinks blood, the Nightcourt opens its gates. Survive the eclipse or join the banquet.',color:'#db7375',stats:[1350,510,350],art:'assets/events/crimson-eclipse.svg'},
 {id:'frostwake_siege',name:'Frostwake Siege',start:9,end:16,boss:'Jarl of the Frostwake',bossId:'jarl_bjorn_ironhide',guards:['ice_shaman_sigrid','shieldmaiden_runa'],token:'frostwake_shard',tokenName:'Frostwake Shards',theme:'Frost',flavor:'A wall of ice and iron. Bring sustained damage and answers to protection.',lore:'The fjord freezes overnight. Hold the gate until dawn or be sealed with the jarls.',color:'#82cee8',stats:[1700,405,470],art:'assets/events/frostwake-siege.svg'},
 {id:'veil_of_umbra',name:'Veil of Umbra',start:17,end:24,boss:'Shade Prince of the Veil',bossId:'shade_prince',guards:['umbral_hierarch','shadow_thrall'],token:'veil_mark',tokenName:'Veil Marks',theme:'Umbra',flavor:'A swift shadow duel. Strike true before the dark finishes counting.',lore:'The veil thins. A shade prince dances between heartbeats, counting the last light out of the world.',color:'#b29be5',stats:[1150,560,315],art:'assets/events/veil-of-umbra.svg'},
];
export const EVENT_ATTEMPTS=20;
export const EVENT_TIMEZONE='America/Los_Angeles';
export function eventCalendar(now=new Date()){
 if(!(now instanceof Date)||!Number.isFinite(now.getTime()))throw Error('Invalid calendar date');
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:EVENT_TIMEZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
 const year=Number(parts.year),month=Number(parts.month),day=Number(parts.day),active=SPECIAL_EVENTS.find(e=>day>=e.start&&day<=e.end)||null;
 const next=day<25?SPECIAL_EVENTS.find(e=>e.start>day)||SPECIAL_EVENTS[0]:SPECIAL_EVENTS[0];
 const nextMonth=day>=25?(month===12?1:month+1):month,nextYear=day>=25&&month===12?year+1:year;
 return {year,month,day,monthKey:`${year}-${String(month).padStart(2,'0')}`,active,next,nextMonth,nextYear};
}
export function eventWindow(eventId,now=new Date()){
 const event=SPECIAL_EVENTS.find(e=>e.id===eventId),calendar=eventCalendar(now);if(!event)return null;
 return {event,key:`${event.id}:${calendar.monthKey}`,active:calendar.active?.id===eventId,calendar};
}
export function eventAttemptsLeft(profile,eventId,now=new Date()){const window=eventWindow(eventId,now);return window?.active?Math.max(0,EVENT_ATTEMPTS-(profile.eventAttempts?.[window.key]||0)):0;}
export const ARENA_STAGES=ARENA_RIVALS.map((r,i)=>({id:`arena-${r.preset_id}`,mode:'arena',difficulty:'arena',number:i+1,name:r.player_name,region:'Ghost Rivals · Arena',description:r.flavor,enemyIds:r.team_templates,hp:1,atk:1,countdown:i<4?3:2,stats:[700+i*90,250+i*27,235+i*30],boss:false,bossHp:1,art:'assets/destinations/arena.svg',portrait:`assets/champions/${r.team_templates[0]}.webp`,recommendedLevel:3+i*7,rewards:{gold:80+i*10,xp:0},opponentRating:r.rating,arenaTokens:8+i}));
export const EVENT_STAGES=SPECIAL_EVENTS.map((e,i)=>({id:`event-${e.id}`,mode:'event',eventId:e.id,difficulty:'event',number:i+1,name:e.name,region:'Special Event · '+e.theme,description:e.flavor,enemyIds:[e.guards[0],e.bossId,e.guards[1]],bossName:e.boss,hp:1,atk:1,countdown:e.id==='veil_of_umbra'?2:3,stats:e.stats,bossHp:1.5,boss:true,art:e.art,portrait:`assets/champions/${e.bossId}.webp`,recommendedLevel:45,rewards:{gold:150,xp:220},eventToken:e.token}));
