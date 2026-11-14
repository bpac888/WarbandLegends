import {LOOT_TICKET_ART} from './loot-ticket-item.js?v=0.49.1';
import {energyCost,energyStatus} from './keeper.js?v=0.49.1';
import {materialArt,materialById} from './ascension.js?v=0.49.1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function lootTicketEntry(profile,stage){
 if(stage.mode!=='campaign'||profile.openRoster||!profile.cleared.includes(stage.id))return '';
 const count=profile.lootTickets||0,cost=energyCost(stage),ready=count>0&&energyStatus(profile).current>=cost;
 return `<section class="loot-ticket-entry"><img src="${LOOT_TICKET_ART}" alt=""><div><b>Instant clear</b><p>${count} Loot Tickets owned · ${cost} Energy per clear</p></div><button class="button outline" data-action="loot-preview" data-stage="${stage.id}" ${ready?'':'disabled'}>${!count?'No tickets':!ready?'Need Energy':'Use Loot Ticket'}</button></section>`;
}
function rewards(r){return `<div class="loot-ticket-rewards"><span>${r.gold} Gold</span>${r.gems?`<span>${r.gems} Gems</span>`:''}<span>Up to ${r.xp} XP per active champion</span><span>${r.accountXp} profile XP</span>${Object.entries(r.materials).filter(([,n])=>n>0).map(([id,n])=>`<span><img src="${materialArt(id)}" alt="">${n} ${materialById(id).name}</span>`).join('')}</div>${r.milestone?'<p>Includes the five-campaign-victory Gem bonus.</p>':''}`;}
export function lootTicketConfirmation(q){return `<div class="loot-ticket-intro"><img src="${LOOT_TICKET_ART}" alt=""><div><h3>${esc(q.stage.name)}</h3><p>${q.stage.difficulty} · Stage ${q.stage.number}</p></div></div><p>Spend <strong>1 Loot Ticket and ${q.cost} Energy</strong> for these rewards. XP goes to your active team, up to their Lv. caps.</p>${rewards(q.reward)}<div class="modal-actions"><button class="button outline" data-action="close">Cancel</button><button class="button gold" data-action="loot-confirm" data-stage="${q.stage.id}" data-uses="${q.uses}">Use ticket · ${q.cost} Energy</button></div>`;}
export function lootTicketResult(result){return `<div class="loot-ticket-intro"><img src="${LOOT_TICKET_ART}" alt=""><div><h3>${esc(result.stage.name)}</h3><p>1 ticket and ${result.cost} Energy spent · ${result.profile.lootTickets} tickets left</p></div></div>${rewards(result.reward)}<div class="modal-actions"><button class="button gold" data-action="close">Back to Campaign</button></div>`;}
