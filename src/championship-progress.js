// Lifetime quest milestones are learned from authenticated tournament dashboards.
// Keep each week's maximum so refreshes, retries and weekly resets cannot count wins twice.
const MAX=999999999;
const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
const integer=(value,max=MAX)=>Number.isSafeInteger(value)&&value>=0&&value<=max;
const weekKey=week=>typeof week==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(week)&&Number.isFinite(Date.parse(week+'T12:00:00Z'))&&new Date(week+'T12:00:00Z').toISOString().slice(0,10)===week;
export function normalizeChampionshipProgress(raw){
 const p=object(raw?.championshipProgress)?raw.championshipProgress:{},winsByWeek={};
 for(const [week,wins]of Object.entries(object(p.winsByWeek)?p.winsByWeek:{}))if(weekKey(week)&&integer(wins)&&wins>0)winsByWeek[week]=wins;
 return {championshipProgress:{winsByWeek,highestTier:integer(p.highestTier,3)?p.highestTier:0,bestWeeklyRank:integer(p.bestWeeklyRank,50)?p.bestWeeklyRank:0,podiumPlaces:[...new Set(Array.isArray(p.podiumPlaces)?p.podiumPlaces.filter(rank=>integer(rank,3)&&rank>0):[])].sort((a,b)=>a-b)}};
}
export function validChampionshipProgress(profile){
 const p=profile?.championshipProgress;if(p===undefined)return true;
 return object(p)&&object(p.winsByWeek)&&Object.entries(p.winsByWeek).every(([week,wins])=>weekKey(week)&&integer(wins)&&wins>0)&&integer(p.highestTier,3)&&integer(p.bestWeeklyRank,50)&&Array.isArray(p.podiumPlaces)&&p.podiumPlaces.every(rank=>integer(rank,3)&&rank>0)&&new Set(p.podiumPlaces).size===p.podiumPlaces.length;
}
export function championshipWins(profile){return Math.min(MAX,Object.values(normalizeChampionshipProgress(profile).championshipProgress.winsByWeek).reduce((sum,wins)=>sum+wins,0));}
export function recordChampionshipProgress(profile,dashboard,playerId){
 if(profile.openRoster||!playerId||dashboard?.playerId!==playerId||dashboard.preview===true||dashboard.available===false||!weekKey(dashboard.week))return profile;
 const before=normalizeChampionshipProgress(profile).championshipProgress,next={...before,winsByWeek:{...before.winsByWeek},podiumPlaces:[...before.podiumPlaces]};
 const observe=(week,standing)=>{if(!weekKey(week)||!object(standing))return;if(integer(standing.attack_wins)&&standing.attack_wins>0)next.winsByWeek[week]=Math.max(next.winsByWeek[week]||0,standing.attack_wins);if(integer(standing.tier,3))next.highestTier=Math.max(next.highestTier,standing.tier);};
 observe(dashboard.week,dashboard.standing);
 for(const award of Array.isArray(dashboard.awards)?dashboard.awards:[]){if(!weekKey(award?.week)||award.week>=dashboard.week||!integer(award.rank,50)||award.rank===0)continue;if(award.rank<=3&&!next.podiumPlaces.includes(award.rank))next.podiumPlaces.push(award.rank);next.bestWeeklyRank=next.bestWeeklyRank?Math.min(next.bestWeeklyRank,award.rank):award.rank;observe(award.week,award.snapshot);}
 next.podiumPlaces.sort((a,b)=>a-b);
 return JSON.stringify(next)===JSON.stringify(before)?profile:{...profile,championshipProgress:next};
}
