// Five distinct places revisited as the same kingdom changes across difficulties.
const states={normal:'green kingdom',hard:'burning kingdom',nightmare:'ruined kingdom'};
const places={gate:'river gate',obsidian:'Obsidian Gate marsh fortress',moonward:'Moonward Aqueduct',gardens:'dragon gardens',crown:'citadel sanctuary'};
export function campaignMilestone(difficulty,number){
 if(!states[difficulty]||!Number.isInteger(number)||number<5||number>25||number%5)return null;
 const place={5:'gate',10:'obsidian',15:'moonward',20:'gardens',25:'crown'}[number];
 const focus=place==='obsidian'?(difficulty==='hard'?60:72):place==='crown'?(difficulty==='nightmare'?50:70):place==='moonward'&&difficulty==='normal'?35:50;
 return {focus,art:`assets/scenes/milestones/${difficulty}-${place}${difficulty==='nightmare'?(place==='gardens'?'-poison':place==='crown'?'-prison':''):''}.webp`,alt:difficulty==='nightmare'&&place==='gardens'?'Poisoned channels among the ruined gardens':difficulty==='nightmare'&&place==='crown'?'The root-supported prison beneath the ruined citadel':`The ${places[place]} in the ${states[difficulty]}`};
}
export function campaignEntryArt(difficulty,number){return number===1&&states[difficulty]?{focus:50,art:`assets/scenes/world-map${difficulty==='normal'?'':'-'+difficulty}.svg`,alt:`The ${states[difficulty]}`} : campaignMilestone(difficulty,number);}
export function milestoneIllustration(difficulty,number){const m=campaignEntryArt(difficulty,number);return m?`<figure class="campaign-milestone-art"><img src="./${m.art}" alt="${m.alt}" width="1536" height="1024" style="object-position:${m.focus}% center"></figure>`:'';}
