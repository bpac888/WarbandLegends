import {heroInsight} from './tactics-ui.js';
// One concise source for the Guide and battle help.
export const guideTopics={roster:'heroes',champion:'growth',shop:'rewards',summon:'summon',daily:'rewards',quests:'rewards',events:'adventure',arena:'adventure',inventory:'rewards',settings:'account',campaign:'adventure',dungeons:'adventure',world:'adventure'};
const battleRules=[
 ['Match & attack','Swap neighboring runes to match 3 or more. Attacks follow their columns. Invalid swaps cost nothing.'],
 ['Specials & turns','Match a hero’s color to charge their Special. Tap a ready hero to cast or choose a charge level. Each matching tile gives 1 charge, or 2 in an empty lane. Casting spends all their mana but no turn. Higher charges can change targets and effects as well as power. Enemy countdowns advance once per board move.'],
 ['Enemy Specials','Enemies gain 4 charge at each attack opportunity and cast their highest charge when full. Your matches do not charge them.'],
 ['Special runes','Match 4 for a Blast rune; 5 or more for a Prism. Tap one twice or swap it with a neighbor to activate it.'],
 ['Elements','Red beats Green, Green beats Blue, and Blue beats Red. Yellow and Purple are strong against each other.'],
 ['Battle speed','Every battle starts at ×1 on phone and desktop. The ×2 button speeds up only the current battle.'],
 ['Leaving a fight','Leaving the battle screen, refreshing or closing the game abandons it. Start again from the beginning; completed rewards stay saved.'],
];
const topics=[
 ['overview','Start here',[
  ['Find your way','Tavern opens the four main areas. Adventure leads to battles, Codex manages heroes and teams, Summon opens The Altar, and Quests offers rewards.'],
  ['Your first steps','Choose your five heroes in Codex, then start the Normal campaign in Adventure.'],
 ]],
 ['heroes','Heroes & Teams',[
  ['Your warband','Change champions at the top of Codex. Choose five owned copies; copies of the same hero can fight together.'],
  ['The three tabs','Collection shows your owned copies and their independent growth. Codex previews every hero at maximum stats. Teams saves and loads up to three warbands.'],
 ]],
 ['growth','Hero growth',[
  ['Level up','Earn XP from battles and quests, or feed spare Common or Rare copies for 25 Gold each. Fresh Commons give 360+ XP; Rares give 3× Common XP (1,080+). Trained donors pass on some XP; matching colors add 25%. A Rare copy of the same character gives 5× its normal Rare XP (15× Common XP). Donors are permanently consumed; current teams, saved teams and active-battle copies are protected. XP stops at the current level cap.'],
  ['Ascend & Limit Break','At the level cap, ascend with gold and materials. The new tier starts at level 1 while keeping earned power, plus 2% ATK, DEF and HP. Fully ascended Rare and higher heroes can Limit Break twice, adding 3% stats and unlocking five more levels each time. Common heroes cannot Limit Break.'],
  ['Full-strength Specials','Specials start at full power. Limit Break 2 grants Attack Up to attackers, Defense Up to defenders or Mana Surge to supports for the first two board moves.'],
 ]],
 ['battles','Battles',battleRules],
 ['adventure','Adventure',[
  ['Campaign & Dungeons','Clear Normal, Hard, then Nightmare. Dungeons offer materials and first-clear rewards. Preview enemies and rewards before entering.'],
  ['Arena','Fight preset rival teams to earn rating and Arena Tokens. These are single-player battles against four-champion teams.'],
  ['Monthly windows','Crimson Eclipse: 1st–8th. Frostwake Siege: 9th–16th. Veil of Umbra: 17th–24th. Dates use Los Angeles time.'],
  ['Event attempts','Each event window has 20 attempts. Starting a fight spends one, even if you leave or lose. Wins earn event tokens and other rewards.'],
 ]],
 ['summon','The Altar',[
  ['Ten calls & twins','Ten calls guarantee a Rare or better. Twin calls give two Common copies. If the first nine calls are all Commons, a final Common or twin result becomes one Rare.'],
  ['Check the rates','Open Summoning odds below the summon buttons. Prices and any Gem shortage appear on the buttons.'],
 ]],
 ['rewards','Rewards & supplies',[
  ['Daily gifts','Claim your gift and Today’s Path from the Tavern. Daily rewards reset at midnight in Los Angeles; missed days keep your calendar place. The calendar has 180 days, then repeats a 30-day cycle. Today’s Path requires 2 wins, 150 Gems earned and 1 summon; calendar gifts and quests count toward Gems, while playtest battles do not count.'],
  ['Quests','Filter Active, Ready or Completed quests. Each reward can be claimed once. Collection goals count different hero designs.'],
  ['Inventory & Shop','Inventory shows your currencies and materials. Shop trades gold, Gems or earned tokens for supplies.'],
 ]],
 ['account','Progress & Settings',[
  ['Keep your progress','Heroes, teams and completed rewards save in this browser. Another device or browser has a separate save. Clearing browser data removes your progress.'],
  ['Playtesting','Open roster in Settings lets you try all heroes at maximum level. Playtest battles give no rewards or progress.'],
 ]],
];
export function guideHTML(id='overview',champion=null){
 const selected=topics.find(t=>t[0]===id)||topics[0];
 return `<div class="guide-layout"><nav aria-label="Guide topics">${topics.map(([key,label])=>`<button class="${key===selected[0]?'active':''}" aria-pressed="${key===selected[0]}" data-action="guide-topic" data-topic="${key}">${label}</button>`).join('')}</nav><section><h2>${selected[1]}</h2>${selected[2].map(([title,body])=>`<article><h3>${title}</h3><p>${body}</p></article>`).join('')}${champion&&['heroes','growth'].includes(selected[0])?heroInsight(champion):''}</section></div>`;
}
export function battleHelpHTML(){return `<div class="help-grid">${battleRules.map(([title,body])=>`<section><b>${title}</b><p>${body}</p></section>`).join('')}</div>`;}
