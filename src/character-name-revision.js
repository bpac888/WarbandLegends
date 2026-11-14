// Approved display-name change; stable hero and portrait IDs are retained.
export const CHARACTER_NAME_REVISION={
  "id": "nima_dewthread",
  "before": {
    "name": "Nima Dewthread",
    "lore": "Nima sews names into the hems of the tents she repairs, so no lost traveler is ever only a stranger. Her clouded-leopard fur carries pale green whorls that brighten before rain. She learned her craft patching refugees rather than soldiers, and still insists that a healer's first duty is to leave someone a road home."
  },
  "after": {
    "name": "Liora Dewthread",
    "lore": "Liora sews names into the hems of the tents she repairs, so no lost traveler is ever only a stranger. Her clouded-leopard fur carries pale green whorls that brighten before rain. She learned her craft patching refugees rather than soldiers, and still insists that a healer's first duty is to leave someone a road home."
  }
};
export function beforeCharacterNameRevision(records){return records.map(c=>{c=WINDED_NAMES[c.id]&&Object.hasOwn(c,'name')?{...c,...WINDED_NAMES[c.id]}:c;const x=CHARACTER_NAME_REVISION;if(c.id!==x.id||!Object.hasOwn(c,'name')&&!Object.hasOwn(c,'lore'))return c;const match=fields=>Object.entries(fields).every(([k,v])=>c[k]===v);if(match(x.before))return c;if(!match(x.after))throw Error("Unexpected character identity edit: "+c.id);return {...c,...x.before};});}

const WINDED_NAMES={"djedi_commander_pain": {"name": "Commander Pain"}, "djedi_ani_windwalker": {"name": "Windwalker", "lore": "Windwalker greets impossible odds with a grin and a blue blade already in motion. A single thin braid falls over the front of his shoulder, a reminder that his learning is not finished. His quick feet and fearless heart often reach danger before caution can catch him."}, "djedi_ar2": {"name": "AR2", "lore": "AR2 walks with the uneven rhythm of parts assembled across a hundred workshops. Great golden disc-eyes study every broken circuit and wounded companion. His mismatched hands always seem to find one last spare component when hope is running low."}, "djedi_dark_mauler": {"name": "Lord of Darkness", "lore": "Beneath an oversized black hood, four short horns crown a sinister red face and black-ringed eyes. The Lord of Darkness\u2019s double-ended crimson weapon whirls as he vaults impossibly high, descending with predatory precision. He delights in leaving no safe angle from which to face him."}};
