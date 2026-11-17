import {heroForId} from './hero-copies.js?v=0.53.6';
import {championshipTeamError} from './championship-battle.js?v=0.53.6';
export const FIRST_TOURNAMENT_MONTH='2027-02-01';
export const TOURNAMENT_RULES=[
 {id:'rares',name:'Only Rares',rarities:['rare']},
 {id:'red',name:'Only Red',colors:['red']},
 {id:'blue',name:'Only Blue',colors:['blue']},
 {id:'green',name:'Only Green',colors:['green']},
 {id:'purple-yellow',name:'Only Purple & Yellow',colors:['purple','yellow']},
 {id:'no-green',name:'Every Color but Green',bannedColors:['green']},
 {id:'no-mythical-blue',name:'No Mythicals or Blue',bannedRarities:['mythical'],bannedColors:['blue']},
 {id:'no-mythical-red',name:'No Mythicals or Red',bannedRarities:['mythical'],bannedColors:['red']},
 {id:'no-mythical-purple-yellow',name:'No Mythicals, Purple or Yellow',bannedRarities:['mythical'],bannedColors:['purple','yellow']},
 {id:'rares-no-yellow',name:'Only Rares · No Yellow',rarities:['rare'],bannedColors:['yellow']},
 {id:'rares-no-blue-purple',name:'Only Rares · No Blue or Purple',rarities:['rare'],bannedColors:['blue','purple']}
];
export const validTournamentMonth=m=>typeof m==='string'&&/^\d{4}-\d{2}-01$/.test(m)&&m>=FIRST_TOURNAMENT_MONTH&&Number.isFinite(Date.parse(m+'T12:00:00Z'))&&new Date(m+'T12:00:00Z').toISOString().slice(0,10)===m;
export function tournamentRule(month){if(!validTournamentMonth(month))throw Error('Unknown tournament month.');const [y,m]=month.split('-').map(Number),[fy,fm]=FIRST_TOURNAMENT_MONTH.split('-').map(Number);return TOURNAMENT_RULES[((y-fy)*12+m-fm)%TOURNAMENT_RULES.length];}
function midnight(date){const [y,m,d]=date.split('-').map(Number);let t=Date.UTC(y,m-1,d,8);for(let i=0;i<3;i++){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).formatToParts(new Date(t)),get=k=>Number(parts.find(p=>p.type===k).value);t+=Date.UTC(y,m-1,d)-Date.UTC(get('year'),get('month')-1,get('day'),get('hour'),get('minute'));}return new Date(t);}
export function tournamentCalendar(now=new Date(),requested){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit'}).formatToParts(now),get=k=>parts.find(p=>p.type===k).value,current=`${get('year')}-${get('month')}-01`,month=requested||(current<FIRST_TOURNAMENT_MONTH?FIRST_TOURNAMENT_MONTH:current);if(!validTournamentMonth(month))throw Error('Unknown tournament month.');
 const [y,m]=month.split('-').map(Number),nextMonth=new Date(Date.UTC(y,m,1)).toISOString().slice(0,10),signupDate=new Date(Date.UTC(y,m-1,-1)).toISOString().slice(0,10),start=midnight(month),end=midnight(nextMonth),opens=midnight(signupDate),phase=now<opens?'upcoming':now<start?'signup':now<end?'active':'closed';
 return {month,nextMonth,rule:tournamentRule(month),startsAt:start.toISOString(),signupOpensAt:opens.toISOString(),closesAt:end.toISOString(),phase};
}
export function tournamentTeamError(ids,profile,roster,month){
 const error=championshipTeamError(ids,profile,roster);if(error)return error;const rule=tournamentRule(month),heroes=ids.map(id=>heroForId(roster,id));
 if(heroes.some(h=>rule.rarities&&!rule.rarities.includes(h.rarity)||rule.bannedRarities?.includes(h.rarity)||rule.colors&&!rule.colors.includes(h.color)||rule.bannedColors?.includes(h.color)))return 'This team does not follow the rules: '+rule.name+'.';
 return null;
}
