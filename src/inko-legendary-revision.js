// Approved Legendary upgrade; strict snapshots preserve earlier roster audits.
export const INKO_LEGENDARY_REVISION={
  "recordBefore": {
    "template_id": "inko_plasma_skirmisher",
    "name": "Inko, Plasma Skirmisher",
    "title": "Runner Beyond the Barricades",
    "rarity": "rare",
    "faction": "neon_syndicate",
    "role": "attack",
    "hp": 1040,
    "atk": 650,
    "def": 580,
    "ability_name": "Redline Cut",
    "lore": "Inko ran messages through the Neon Syndicate\u2019s barricades before learning what those orders cost the people outside. Now her plasma sabers cut supply locks and disable patrol armor. The red trail she leaves across the snow has become a promise that another route will open.",
    "image_url": "/assets/champions/inko_plasma_skirmisher.webp",
    "id": "inko_plasma_skirmisher",
    "color": "red",
    "source_image": "assets/champions/inko_plasma_skirmisher.webp",
    "portrait": "assets/champions/inko_plasma_skirmisher.webp",
    "passive": null,
    "manaSpeed": "fast",
    "special": {
      "name": "Redline Cut",
      "charging": false,
      "levels": [
        {
          "level": 1,
          "speed": "fast",
          "tiles": 8,
          "damage": 2.15,
          "healing": 0,
          "target": "enemy",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "dec_atk",
              "turns": 1,
              "scope": "enemy"
            }
          ]
        }
      ]
    },
    "ability_desc": "Deal 215% ATK damage to selected enemy."
  },
  "recordAfter": {
    "template_id": "inko_plasma_skirmisher",
    "name": "Inko, Plasma Skirmisher",
    "title": "Runner Beyond the Barricades",
    "rarity": "legendary",
    "faction": "neon_syndicate",
    "role": "attack",
    "hp": 1340,
    "atk": 825,
    "def": 690,
    "ability_name": "Redline Cut",
    "lore": "Inko ran messages through the Neon Syndicate\u2019s barricades before learning what those orders cost the people outside. Now her plasma sabers cut supply locks and disable patrol armor. The red trail she leaves across the snow has become a promise that another route will open.",
    "image_url": "/assets/champions/inko_plasma_skirmisher.webp",
    "id": "inko_plasma_skirmisher",
    "color": "red",
    "source_image": "assets/champions/inko_plasma_skirmisher.webp",
    "portrait": "assets/champions/inko_plasma_skirmisher.webp",
    "passive": null,
    "manaSpeed": "fast",
    "special": {
      "name": "Redline Cut",
      "charging": false,
      "levels": [
        {
          "level": 1,
          "speed": "fast",
          "tiles": 8,
          "damage": 2.5,
          "healing": 0,
          "target": "enemy",
          "healScope": "allies",
          "aoe": true,
          "pierce": false,
          "effects": [
            {
              "id": "dec_atk",
              "turns": 2,
              "scope": "enemies"
            }
          ]
        }
      ]
    },
    "ability_desc": "Deal 250% ATK damage to all enemies and apply ATK Down for 2 turns."
  },
  "sourceBefore": {
    "template_id": "inko_plasma_skirmisher",
    "name": "Inko, Plasma Skirmisher",
    "title": "Runner Beyond the Barricades",
    "rarity": "rare",
    "faction": "neon_syndicate",
    "role": "attack",
    "hp": 1040,
    "atk": 650,
    "def": 580,
    "ability_name": "Redline Cut",
    "lore": "Inko ran messages through the Neon Syndicate\u2019s barricades before learning what those orders cost the people outside. Now her plasma sabers cut supply locks and disable patrol armor. The red trail she leaves across the snow has become a promise that another route will open.",
    "image_url": "/assets/champions/inko_plasma_skirmisher.webp",
    "id": "inko_plasma_skirmisher",
    "color": "red",
    "source_image": "assets/champions/inko_plasma_skirmisher.webp",
    "portrait": "assets/champions/inko_plasma_skirmisher.webp",
    "passive": null,
    "ability_desc": "Deal 215% ATK damage to selected enemy.",
    "spd": 100,
    "kit": {
      "a2": [],
      "a3": [
        [
          "dec_atk",
          1
        ]
      ]
    }
  },
  "sourceAfter": {
    "template_id": "inko_plasma_skirmisher",
    "name": "Inko, Plasma Skirmisher",
    "title": "Runner Beyond the Barricades",
    "rarity": "legendary",
    "faction": "neon_syndicate",
    "role": "attack",
    "hp": 1340,
    "atk": 825,
    "def": 690,
    "ability_name": "Redline Cut",
    "lore": "Inko ran messages through the Neon Syndicate\u2019s barricades before learning what those orders cost the people outside. Now her plasma sabers cut supply locks and disable patrol armor. The red trail she leaves across the snow has become a promise that another route will open.",
    "image_url": "/assets/champions/inko_plasma_skirmisher.webp",
    "id": "inko_plasma_skirmisher",
    "color": "red",
    "source_image": "assets/champions/inko_plasma_skirmisher.webp",
    "portrait": "assets/champions/inko_plasma_skirmisher.webp",
    "passive": null,
    "ability_desc": "Deal 250% ATK damage to all enemies and apply ATK Down for 2 turns.",
    "spd": 100,
    "kit": {
      "a2": [],
      "a3": [
        [
          "dec_atk",
          2
        ]
      ]
    }
  }
};
export function beforeInkoLegendary(records){return records.map(c=>{if(c.id!=="inko_plasma_skirmisher"||!c.special&&!c.kit)return c;const x=INKO_LEGENDARY_REVISION,source=!!c.kit,before=source?x.sourceBefore:x.recordBefore,after=source?x.sourceAfter:x.recordAfter;if(JSON.stringify(c)===JSON.stringify(before))return c;if(JSON.stringify(c)!==JSON.stringify(after))throw Error("Unexpected Inko revision");return structuredClone(before);});}
