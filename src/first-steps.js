import {SUMMON_COST} from './economy.js';
// Suggestions only: never claim rewards, summon, train or spend on the player's behalf.
export function nextFirstStep(p){
 if(p.onboardingDismissed||p.onboardingComplete||p.openRoster||p.wins>=5||p.summons>=3)return null;
 if(!p.wins)return {id:'battle',title:'Begin your journey',text:'Win your first Normal campaign battle.',label:'Open Campaign',page:'campaign'};
 if(!p.claimed.includes('first-victory'))return {id:'quest',title:'Your first quest reward is ready',text:'Claim the reward for your first campaign victory.',label:'View Ready Quests',page:'quests'};
 if(!p.summons)return p.gems>=SUMMON_COST?{id:'summon',title:'Meet a new champion',text:'A single summon costs 100 Gems. Choose when you’re ready.',label:'Visit the Altar',page:'summon'}:{id:'battle',title:'Continue your journey',text:'Campaign victories and quests can earn more Gems.',label:'Open Campaign',page:'campaign'};
 return {id:'review',title:'Get to know your new champion',text:'Explore their Special and training options. No training is required.',label:'View Champion',page:'champion'};
}
export function firstStepsHTML(p,page){const s=nextFirstStep(p);if(!s||!['home','campaign','quests','summon','roster','daily'].includes(page)||s.page===page)return '';return `<aside class="first-steps" aria-label="Suggested next step"><div><span>Suggested Next Step</span><b>${s.title}</b><p>${s.text}</p></div><button class="button outline" data-action="first-step">${s.label}</button><button class="first-steps-dismiss" data-action="dismiss-first-steps" aria-label="Dismiss next-step suggestions">×</button></aside>`;}
