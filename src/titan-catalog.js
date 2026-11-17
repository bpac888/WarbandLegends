export const FIRST_TITAN_MONTH='2026-12-01';
export const TITAN_RULES={attacks:6,moves:30,percentHealthBase:50000};
const special=(name,damage,effects,pierce=false)=>({name,charging:false,levels:[{level:1,speed:'slow',tiles:12,target:'enemy',damage,healing:0,healScope:'allies',aoe:true,pierce,effects}]});
export const TITANS=[
 {id:'ember',name:'Ember Titan',color:'red',source:'bronze_juggernaut',health:5000000,art:'assets/titans/ember.webp',special:special('Cinder Cataclysm',2.1,[{id:'burn',turns:3,scope:'enemies'}]),description:'Scorches the warband with Burn.'},
 {id:'verdant',name:'Worldroot Titan',color:'green',source:'elder_rootmother',health:5000000,art:'assets/titans/verdant.webp',special:special('Worldroot Crush',1.9,[{id:'poison',turns:3,scope:'enemies'},{id:'dec_def',turns:2,scope:'enemies'}]),description:'Poisons the warband and lowers Defense.'},
 {id:'frost',name:'Glacier Titan',color:'blue',source:'ice_shaman_sigrid',health:5000000,art:'assets/titans/frost.webp',special:special('Glacial Ruin',1.9,[{id:'frostbite',turns:2,scope:'enemies'},{id:'mana_slow',turns:3,scope:'enemies'}]),description:'Freezes the warband with Frostbite and slows mana.'},
 {id:'ultimate',name:'Ultimate Titan',color:'purple',dualColors:['yellow','purple'],source:'yshmir_worldwound',health:10000000,art:'assets/titans/ultimate.webp',special:special('Eclipse Annihilation',2.3,[{id:'dispel',turns:0,scope:'enemies'},{id:'mana_block',turns:2,scope:'enemies'}],true),description:'Dispels buffs and blocks mana. No elemental weakness.'}
];
export const TITAN_STAGES=TITANS.map((t,i)=>({id:'titan-'+t.id,mode:'titans',difficulty:'normal',number:i+1,name:t.name,description:t.description,enemyIds:[t.source],hp:1,atk:1,countdown:3,stats:[t.health,i===3?650:520,i===3?480:380],boss:true,art:t.art,rewards:{gold:0,xp:0},titanIndex:i}));
export const TITAN_REWARDS=[{from:1,to:1,label:'1st',gems:1000,gold:10000,lootTickets:25},{from:2,to:2,label:'2nd',gems:750,gold:7500,lootTickets:20},{from:3,to:3,label:'3rd',gems:500,gold:5000,lootTickets:15},{from:4,to:50,label:'4–50',gems:250,gold:2500,lootTickets:10}];
export const titanReward=rank=>TITAN_REWARDS.find(r=>rank>=r.from&&rank<=r.to)||null;
export const validTitanMonth=m=>typeof m==='string'&&/^\d{4}-\d{2}-01$/.test(m)&&m>=FIRST_TITAN_MONTH&&Number.isFinite(Date.parse(m+'T12:00:00Z'))&&new Date(m+'T12:00:00Z').toISOString().slice(0,10)===m;
