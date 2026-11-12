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
export function beforeCharacterNameRevision(records){return records.map(c=>{const x=CHARACTER_NAME_REVISION;if(c.id!==x.id||!Object.hasOwn(c,'name')&&!Object.hasOwn(c,'lore'))return c;const match=fields=>Object.entries(fields).every(([k,v])=>c[k]===v);if(match(x.before))return c;if(!match(x.after))throw Error("Unexpected character identity edit: "+c.id);return {...c,...x.before};});}
