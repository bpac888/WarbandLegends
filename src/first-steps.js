import {SUMMON_COST} from './economy.js?v=0.49.1';
import {tutorialState,tutorialFinished,TUTORIAL_QUESTS,tutorialProgress} from './tutorial.js?v=0.49.1';
const reward=(quest,title)=>({id:'quest',quest,title:'Quest reward ready',text:title,label:'Collect Quest Reward',page:'quests'});
export function nextFirstStep(p){
 if(p.onboardingDismissed||p.openRoster||tutorialFinished(p))return null;
 if(!p.claimed.includes('tutorial-combat'))return tutorialProgress(p,'tutorial-combat')===3?reward('tutorial-combat','Collect your practice reward.'):{id:'practice',title:'Learn the basics of battle',text:'Match tiles, cast a Special and activate special runes.',label:'Start Practice Battle',page:'battle'};
 if(!p.wins)return {id:'battle',title:'Begin your journey',text:'Win your first Normal campaign battle.',label:'Open Campaign',page:'campaign'};
 if(!p.claimed.includes('first-victory'))return reward('first-victory','Collect the reward for your first campaign victory.');
 if(!p.summons)return p.gems>=SUMMON_COST?{id:'summon',title:'Meet a new champion',text:'Summon a champion for 100 Gems.',label:'Visit the Altar',page:'summon'}:{id:'battle',title:'Continue your journey',text:'Campaign victories and quests can earn more Gems.',label:'Open Campaign',page:'campaign'};
 if(!p.claimed.includes('first-summon'))return reward('first-summon','Collect your reward and a Common for training.');
 const t=tutorialState(p);
 for(const q of TUTORIAL_QUESTS){if(p.claimed.includes(q.id))continue;if(tutorialProgress(p,q.id)>=(q.metric==='market'?4:q.metric==='combat'?3:1))return reward(q.id,`Collect “${q.name}” before the next tutorial step.`);
 if(q.metric==='fed'){if(!t.feedingCollection)return {id:'feed-collection',title:'Train a champion',text:'Open your Collection.',label:'Open Collection',page:'roster'};if(!t.feedingChampion)return {id:'feed-select',title:'Choose your champion',text:'Tap the top champion in your Collection—the highest rarity you own.',label:'Show Champion',page:'roster'};return {id:'feed',title:'Level up by feeding',text:'Train Heroes → Choose Heroes. Select a spare Common or Rare, then confirm.',label:'Open Training',page:'champion'};}
 if(q.metric==='market'){const visit=!t.shop?['supplies','Shop']:!t.tokens?['tokens','Token Exchange']:!t.premium?['premium','Premium']:['inventory','Inventory'];return {id:'market',title:'Explore the Market',text:`${tutorialProgress(p,q.id)} / 4 visited · Next: ${visit[1]} tab.`,label:'Visit '+visit[1],page:'shop',tab:visit[0]};}
 return {id:q.metric,title:q.name,text:q.text,label:{shop:'Visit Shop',team:'Change Your Team',guide:'Open the Guide'}[q.metric],page:q.page,tab:'supplies'};}
 return null;
}
export function firstStepsHTML(p,page){const s=nextFirstStep(p);if(!s||!['home','campaign','quests','summon','roster','champion','daily','shop','inventory'].includes(page))return '';return `<aside class="first-steps" aria-label="Suggested next step"><div><span>Tutorial</span><b>${s.title}</b><p>${s.text}</p></div><button class="button outline" data-action="first-step">${s.label}</button><button class="first-steps-dismiss" data-action="dismiss-first-steps" aria-label="Dismiss next-step suggestions">×</button></aside>`;}
