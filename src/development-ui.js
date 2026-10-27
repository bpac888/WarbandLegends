import {ascensionPanel} from './ascension-ui.js';
import {trainingQuote,developedChampion,heroDevelopment} from './development.js';
import {ASCENSION_CAPS,ascensionTier,awakeningRank,tierLevel} from './ascension.js';
import {glyph} from './card-ui.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function levelMark(champion,profile,{preview=false,showTier=true}={}){const owned=!!profile.collection[champion.id]&&!preview,d=heroDevelopment(profile,champion),stage=tierLevel(profile,champion,d.level);return `<span class="hero-level-mark" title="${owned?'Ascension tier and level':'Maximum-level codex preview'}">${owned?`${showTier?`T${stage.tier} · `:''}Lv. ${stage.level}`:'MAX'}</span>`;}
export function rankTrack(champion,profile,{preview=false}={}){
 const total=ASCENSION_CAPS[champion.rarity].length-1;
 const ascended=preview?total:ascensionTier(profile,champion);
 const breaks=preview&&champion.rarity!=='common'?2:awakeningRank(profile,champion);
 const label=preview?`Maximum potential: ${total} ascensions${champion.rarity==='common'?'':', 2 Limit Breaks'}`:`${ascended} of ${total} ascensions, ${breaks} of ${champion.rarity==='common'?0:2} Limit Breaks`;
 return `<span class="hero-rank-track" role="img" aria-label="${label}" title="${label}"><span class="rank-track-label" aria-hidden="true">ASCENSION</span><span class="rank-track-slots" aria-hidden="true">${Array.from({length:total},(_,i)=>`<i class="rank-chevron ${i>=ascended?'empty':i>=total-breaks?'limit-broken':'ascended'}"></i>`).join('')}</span></span>`;
}
export function developmentPanel(champion,profile){
 const owned=!!profile.collection[champion.id],q=trainingQuote(profile,champion),unit=developedChampion(champion,profile);
 if(!owned)return '';
 const atAscension=q.atCap&&q.cap===q.physicalCap,stage=tierLevel(profile,champion,q.level),limit=tierLevel(profile,champion,q.physicalCap);
 return `<section class="hero-development ${atAscension?'fully-developed':''}" id="hero-development" aria-labelledby="development-title"><div class="development-intro"><span class="eyebrow">CHAMPION DEVELOPMENT · TIER ${stage.tier}</span><h2 id="development-title">${atAscension?q.error==='This champion is at maximum level.'?'Maximum level reached':'Level cap reached':'A legend in the making'}</h2><div class="level-dial" aria-label="Tier ${stage.tier} level ${stage.level} of ${limit.cap}"><span>LEVEL</span><b>${stage.level}</b><small>/ ${limit.cap}</small></div></div><div class="development-track"><div class="xp-caption"><strong>${q.atCap?'Current limit':'Experience'}</strong><span>${q.atCap?`${q.bankedXp.toLocaleString()} XP earned`:`${q.earned.toLocaleString()} / ${q.needed.toLocaleString()} XP`}</span></div><div class="hero-xp-bar" role="progressbar" aria-label="Experience toward next level" aria-valuemin="0" aria-valuemax="${q.atCap?1:q.needed}" aria-valuenow="${q.atCap?1:q.earned}"><i style="width:${q.ratio*100}%"></i></div><div class="growth-stats" aria-label="Current and next level stats">${[['attack','atk'],['defense','def'],['health','hp']].map(([icon,key])=>`<div><span>${glyph(icon)}<small>${icon}</small></span><b>${unit[key]}</b>${!atAscension?`<span class="stat-growth-arrow" aria-hidden="true">→</span><strong>${q.next[key]}<small>+${q.next[key]-unit[key]}</small></strong>`:''}</div>`).join('')}</div><div class="training-offer"><div><b>Train heroes</b><small>25 Gold per donor</small></div><button class="button gold" data-action="feed-preview" data-id="${esc(champion.id)}" ${atAscension?'disabled':''}>Choose heroes ${glyph('attack')}</button></div></div></section><div class="advancement-pair">${ascensionPanel(champion,profile)}</div>`;
}
