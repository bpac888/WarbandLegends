export const CHAMPIONSHIP_TIERS=[{id:'bronze',name:'Bronze',floor:0},{id:'silver',name:'Silver',floor:120},{id:'gold',name:'Gold',floor:300},{id:'platinum',name:'Platinum',floor:600}];
export const CHAMPIONSHIP_REWARDS=[{from:1,to:1,label:'1st',gems:1000,gold:10000,lootTickets:25},{from:2,to:2,label:'2nd',gems:750,gold:7500,lootTickets:20},{from:3,to:3,label:'3rd',gems:500,gold:5000,lootTickets:15},{from:4,to:25,label:'4–25',gems:250,gold:2500,lootTickets:10},{from:26,to:50,label:'26–50',gems:100,gold:1000,lootTickets:5}];
export const CHAMPIONSHIP_RULES={attackWin:30,attackLoss:10,defenseLoss:10,defenseGrace:3,maxMoves:150,maxActions:600,dailyAttacks:20};
export const CHAMPIONSHIP_STAGE={id:'championship-battle',mode:'championships',difficulty:'normal',number:1,name:'The Championships',description:'Battle a saved five-champion defense. The defending player does not need to be online.',enemyIds:['redknife_tavin','shieldmaiden_runa','grove_druid','ironwall_sniper','cursed_acolyte'],hp:1,atk:1,countdown:3,stats:[1000,300,250],boss:false,art:'assets/championships/citadel.webp',rewards:{gold:0,xp:0}};
export const championshipReward=rank=>CHAMPIONSHIP_REWARDS.find(r=>rank>=r.from&&rank<=r.to)||null;
export function championshipStanding(previous={},event){
 const next={score:0,tier:0,attackWins:0,attackLosses:0,defenseWins:0,defenseLosses:0,strikes:0,...previous};
 if(event==='attack-win'){next.score+=30;next.attackWins++;next.strikes=0;next.tier=CHAMPIONSHIP_TIERS.reduce((tier,t,i)=>next.score>=t.floor?i:tier,next.tier);}
 else if(event==='attack-loss'){next.score=Math.max(0,next.score-10);next.attackLosses++;}
 else if(event==='defense-win')next.defenseWins++;
 else if(event==='defense-loss'){next.score=Math.max(0,next.score-10);next.defenseLosses++;next.strikes++;}
 else throw Error('Unknown Championships event.');
 if(event!=='attack-win'&&next.tier>0&&next.strikes>=3&&next.score<CHAMPIONSHIP_TIERS[next.tier].floor){next.tier--;next.strikes=0;}
 return next;
}
