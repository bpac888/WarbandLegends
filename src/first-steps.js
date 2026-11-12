import {SUMMON_COST} from './economy.js?v=0.41.0';
import {tutorialState,tutorialFinished,TUTORIAL_QUESTS,tutorialProgress} from './tutorial.js?v=0.41.0';
const reward=(quest,title)=>({id:'quest',quest,title:'Quest reward ready',text:title,label:'Collect Quest Reward',page:'quests'});
export function nextFirstStep(p){
 if(p.onboardingDismissed||p.openRoster||tutorialFinished(p))return null;
 if(!p.claimed.includes('tutorial-combat'))return tutorialProgress(p,'tutorial-combat')===3?reward('tutorial-combat','Collect your practice battle reward before the campaign. '):{id:'practice',title:'Learn the basics of battle',text:'Make a normal match, cast a Special, then create and activate four-match and five-match runes in one guided practice battle. No energy is spent.',label:'Start Practice Battle',page:'battle'};
 if(!p.wins)return {id:'battle',title:'Begin your journey',text:'Win your first Normal campaign battle.',label:'Open Campaign',page:'campaign'};
 if(!p.claimed.includes('first-victory'))return reward('first-victory','Collect the reward for your first campaign victory.');
 if(!p.summons)return p.gems>=SUMMON_COST?{id:'summon',title:'Meet a new champion',text:'A single summon costs 100 Gems. Choose when you’re ready.',label:'Visit the Altar',page:'summon'}:{id:'battle',title:'Continue your journey',text:'Campaign victories and quests can earn more Gems.',label:'Open Campaign',page:'campaign'};
 if(!p.claimed.includes('first-summon'))return reward('first-summon','Collect your first summon reward, including a spare Common for training.');
 const t=tutorialState(p);
 for(const q of TUTORIAL_QUESTS){if(p.claimed.includes(q.id))continue;if(tutorialProgress(p,q.id)>=(['resources','combat'].includes(q.metric)?3:1))return reward(q.id,`Collect “${q.name}” before the next tutorial step.`);
 if(q.metric==='fed')return {id:'feed',title:'Level up by feeding',text:'Collection → champion → Train Heroes → Choose Heroes. Feed a spare Common or Rare to gain a level. The selected copy is consumed; team members are protected.',label:'Open Training',page:'roster'};
 if(q.metric==='resources'){const visit=!t.tokens?['tokens','Token Exchange']:!t.premium?['premium','Premium']:['inventory','Inventory'];return {id:'resources',title:'Explore your resources',text:`${tutorialProgress(p,q.id)} / 3 visited · Next: ${visit[1]}. Browsing is enough; nothing needs to be bought or activated.`,label:'Visit '+visit[1],page:visit[0]==='inventory'?'inventory':'shop',tab:visit[0]};}
 return {id:q.metric,title:q.name,text:q.text,label:{shop:'Visit Shop',team:'Change Your Team',guide:'Open the Guide'}[q.metric],page:q.page,tab:'supplies'};}
 return null;
}
export function firstStepsHTML(p,page){const s=nextFirstStep(p);if(!s||!['home','campaign','quests','summon','roster','champion','daily','shop','inventory'].includes(page))return '';return `<aside class="first-steps" aria-label="Suggested next step"><div><span>Tutorial · Suggested Next Step</span><b>${s.title}</b><p>${s.text}</p></div><button class="button outline" data-action="first-step">${s.label}</button><button class="first-steps-dismiss" data-action="dismiss-first-steps" aria-label="Dismiss next-step suggestions">×</button></aside>`;}
