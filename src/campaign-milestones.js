// Three places revisited as the same kingdom changes across difficulties.
const states={normal:'green kingdom',hard:'burning kingdom',nightmare:'ruined kingdom'};
const places={gate:'river gate',gardens:'dragon gardens',crown:'Crown sanctuary'};
export function campaignMilestone(difficulty,number){
 if(!states[difficulty]||!Number.isInteger(number)||number<5||number>25||number%5)return null;
 const place=number<=10?'gate':number<=20?'gardens':'crown';
 return {art:`assets/scenes/milestones/${difficulty}-${place}.webp`,alt:`The ${places[place]} in the ${states[difficulty]}`};
}
export function milestoneIllustration(difficulty,number){const m=campaignMilestone(difficulty,number);return m?`<figure class="campaign-milestone-art"><img src="./${m.art}" alt="${m.alt}" width="1536" height="1024"></figure>`:'';}
