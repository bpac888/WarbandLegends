import {beforeCharacterNameRevision} from './character-name-revision.js?v=0.50.0';
// Owner-approved 2026-11-11 balance batch. Full snapshots make historical checks strict.
export const UPGRADE_BALANCE_REVISION=[
  {
    "id": "necropolis_titan",
    "proposal": "Keep Slow 12; extend Taunt and self Damage Ward from 1 to 2 turns. Retain the 176% hit and Attack Down 3.",
    "before": {
      "template_id": "necropolis_titan",
      "name": "Ossir, Necropolis Titan",
      "title": "God-King of the Bone Throne",
      "rarity": "legendary",
      "faction": "nether",
      "role": "defense",
      "hp": 1568,
      "atk": 667,
      "def": 823,
      "ability_name": "Verdict of the Silent Court",
      "lore": "Ossir ruled a kingdom of dust for so long the dust began to worship him. He did not stop it.",
      "image_url": "/api/static/champions/necropolis_titan.png",
      "id": "necropolis_titan",
      "color": "purple",
      "source_image": "/api/static/champions/necropolis_titan.png",
      "portrait": "assets/champions/necropolis_titan.webp",
      "passive": null,
      "manaSpeed": "slow",
      "special": {
        "name": "Verdict of the Silent Court",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "slow",
            "tiles": 12,
            "target": "enemy",
            "damage": 1.76,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "strengthen",
                "turns": 1,
                "scope": "self"
              },
              {
                "id": "dec_atk",
                "turns": 3,
                "scope": "enemy"
              },
              {
                "id": "guard",
                "turns": 1,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 176% ATK damage to selected enemy."
    },
    "after": {
      "template_id": "necropolis_titan",
      "name": "Ossir, Necropolis Titan",
      "title": "God-King of the Bone Throne",
      "rarity": "legendary",
      "faction": "nether",
      "role": "defense",
      "hp": 1568,
      "atk": 667,
      "def": 823,
      "ability_name": "Verdict of the Silent Court",
      "lore": "Ossir ruled a kingdom of dust for so long the dust began to worship him. He did not stop it.",
      "image_url": "/api/static/champions/necropolis_titan.png",
      "id": "necropolis_titan",
      "color": "purple",
      "source_image": "/api/static/champions/necropolis_titan.png",
      "portrait": "assets/champions/necropolis_titan.webp",
      "passive": null,
      "manaSpeed": "slow",
      "special": {
        "name": "Verdict of the Silent Court",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "slow",
            "tiles": 12,
            "target": "enemy",
            "damage": 1.76,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "strengthen",
                "turns": 2,
                "scope": "self"
              },
              {
                "id": "dec_atk",
                "turns": 3,
                "scope": "enemy"
              },
              {
                "id": "guard",
                "turns": 2,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 176% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "necropolis_titan",
      "name": "Ossir, Necropolis Titan",
      "title": "God-King of the Bone Throne",
      "rarity": "legendary",
      "faction": "nether",
      "role": "defense",
      "hp": 2535,
      "atk": 235,
      "def": 269,
      "spd": 102,
      "ability_name": "Verdict of the Silent Court",
      "ability_desc": "The bone-court passes sentence on one foe — their strength withers for three rounds and the verdict drags their eyes onto Ossir alone.",
      "lore": "Ossir ruled a kingdom of dust for so long the dust began to worship him. He did not stop it.",
      "image_url": "/api/static/champions/necropolis_titan.png",
      "id": "necropolis_titan",
      "color": "purple",
      "source_image": "/api/static/champions/necropolis_titan.png",
      "portrait": "assets/champions/necropolis_titan.webp",
      "kit": {
        "a2": [
          [
            "strengthen",
            1
          ]
        ],
        "a3": [
          [
            "dec_atk",
            3
          ],
          [
            "taunt",
            1
          ]
        ]
      },
      "passive": null
    },
    "sourceAfter": {
      "template_id": "necropolis_titan",
      "name": "Ossir, Necropolis Titan",
      "title": "God-King of the Bone Throne",
      "rarity": "legendary",
      "faction": "nether",
      "role": "defense",
      "hp": 2535,
      "atk": 235,
      "def": 269,
      "spd": 102,
      "ability_name": "Verdict of the Silent Court",
      "ability_desc": "Deal 176% ATK damage to selected enemy.",
      "lore": "Ossir ruled a kingdom of dust for so long the dust began to worship him. He did not stop it.",
      "image_url": "/api/static/champions/necropolis_titan.png",
      "id": "necropolis_titan",
      "color": "purple",
      "source_image": "/api/static/champions/necropolis_titan.png",
      "portrait": "assets/champions/necropolis_titan.webp",
      "kit": {
        "a2": [
          [
            "strengthen",
            1
          ]
        ],
        "a3": [
          [
            "dec_atk",
            3
          ],
          [
            "taunt",
            1
          ]
        ]
      },
      "passive": null
    },
    "designBefore": {
      "color": "purple",
      "manaSpeed": "slow"
    },
    "designAfter": {
      "color": "purple",
      "manaSpeed": "slow",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "slow",
          "tiles": 12,
          "target": "enemy",
          "damage": 1.76,
          "healing": 0,
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "strengthen",
              "turns": 2,
              "scope": "self"
            },
            {
              "id": "dec_atk",
              "turns": 3,
              "scope": "enemy"
            },
            {
              "id": "guard",
              "turns": 2,
              "scope": "self"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "bronze_juggernaut",
    "proposal": "Keep Slow 12; extend self Damage Ward, team Barrier and Taunt from 1 to 2 turns. Retain damage.",
    "before": {
      "template_id": "bronze_juggernaut",
      "name": "The Bronze Juggernaut",
      "title": "Boilerplate Heresy",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "defense",
      "hp": 1555,
      "atk": 670,
      "def": 801,
      "ability_name": "Steam Purge",
      "lore": "The heart crystal in his chest still remembers being a person. The pistons remember only work.",
      "image_url": "/api/static/champions/bronze_juggernaut.png",
      "id": "bronze_juggernaut",
      "color": "red",
      "source_image": "/api/static/champions/bronze_juggernaut.png",
      "portrait": "assets/champions/bronze_juggernaut.webp",
      "passive": null,
      "manaSpeed": "slow",
      "special": {
        "name": "Steam Purge",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "slow",
            "tiles": 12,
            "target": "enemy",
            "damage": 1.76,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "strengthen",
                "turns": 1,
                "scope": "self"
              },
              {
                "id": "shield",
                "turns": 1,
                "scope": "allies"
              },
              {
                "id": "guard",
                "turns": 1,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 176% ATK damage to selected enemy."
    },
    "after": {
      "template_id": "bronze_juggernaut",
      "name": "The Bronze Juggernaut",
      "title": "Boilerplate Heresy",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "defense",
      "hp": 1555,
      "atk": 670,
      "def": 801,
      "ability_name": "Steam Purge",
      "lore": "The heart crystal in his chest still remembers being a person. The pistons remember only work.",
      "image_url": "/api/static/champions/bronze_juggernaut.png",
      "id": "bronze_juggernaut",
      "color": "red",
      "source_image": "/api/static/champions/bronze_juggernaut.png",
      "portrait": "assets/champions/bronze_juggernaut.webp",
      "passive": null,
      "manaSpeed": "slow",
      "special": {
        "name": "Steam Purge",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "slow",
            "tiles": 12,
            "target": "enemy",
            "damage": 1.76,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "strengthen",
                "turns": 2,
                "scope": "self"
              },
              {
                "id": "shield",
                "turns": 2,
                "scope": "allies"
              },
              {
                "id": "guard",
                "turns": 2,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 176% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "bronze_juggernaut",
      "name": "The Bronze Juggernaut",
      "title": "Boilerplate Heresy",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "defense",
      "hp": 2547,
      "atk": 245,
      "def": 259,
      "spd": 110,
      "ability_name": "Steam Purge",
      "ability_desc": "Vents scalding pressure — bronze shields settle over the warband and the struck foe can look at nothing else.",
      "lore": "The heart crystal in his chest still remembers being a person. The pistons remember only work.",
      "image_url": "/api/static/champions/bronze_juggernaut.png",
      "id": "bronze_juggernaut",
      "color": "blue",
      "source_image": "/api/static/champions/bronze_juggernaut.png",
      "portrait": "assets/champions/bronze_juggernaut.webp",
      "kit": {
        "a2": [
          [
            "strengthen",
            1
          ]
        ],
        "a3": [
          [
            "shield",
            1
          ],
          [
            "taunt",
            1
          ]
        ]
      },
      "passive": null
    },
    "sourceAfter": {
      "template_id": "bronze_juggernaut",
      "name": "The Bronze Juggernaut",
      "title": "Boilerplate Heresy",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "defense",
      "hp": 2547,
      "atk": 245,
      "def": 259,
      "spd": 110,
      "ability_name": "Steam Purge",
      "ability_desc": "Deal 176% ATK damage to selected enemy.",
      "lore": "The heart crystal in his chest still remembers being a person. The pistons remember only work.",
      "image_url": "/api/static/champions/bronze_juggernaut.png",
      "id": "bronze_juggernaut",
      "color": "blue",
      "source_image": "/api/static/champions/bronze_juggernaut.png",
      "portrait": "assets/champions/bronze_juggernaut.webp",
      "kit": {
        "a2": [
          [
            "strengthen",
            1
          ]
        ],
        "a3": [
          [
            "shield",
            1
          ],
          [
            "taunt",
            1
          ]
        ]
      },
      "passive": null
    },
    "designBefore": {
      "color": "red",
      "manaSpeed": "slow"
    },
    "designAfter": {
      "color": "red",
      "manaSpeed": "slow",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "slow",
          "tiles": 12,
          "target": "enemy",
          "damage": 1.76,
          "healing": 0,
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "strengthen",
              "turns": 2,
              "scope": "self"
            },
            {
              "id": "shield",
              "turns": 2,
              "scope": "allies"
            },
            {
              "id": "guard",
              "turns": 2,
              "scope": "self"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "nayara_deep_well",
    "proposal": "Keep Fast 8; increase team healing from 24% to 28% and Ailment Ward from 1 to 2 turns; retain Cleanse and passive.",
    "before": {
      "template_id": "nayara_deep_well",
      "name": "Nayara, Keeper of the Deep Well",
      "title": "Voice of the Buried River",
      "rarity": "mythical",
      "faction": "duneriders",
      "role": "support",
      "hp": 1540,
      "atk": 835,
      "def": 800,
      "ability_name": "The River Remembers",
      "lore": "Nayara refused the pearl throne while a single caravan still searched for water. The buried river answered by lifting its oldest well into the moonlight. Wherever she walks, its blue current washes poison from the weary and carries them one crossing farther from the desert's hunger.",
      "image_url": "/assets/champions/nayara_deep_well.webp",
      "id": "nayara_deep_well",
      "color": "blue",
      "source_image": "assets/champions/nayara_deep_well.webp",
      "portrait": "assets/champions/nayara_deep_well.webp",
      "passive": {
        "id": "deep_well_heart",
        "name": "Heart of the Deep Well",
        "kind": "regen",
        "value": 0.03,
        "desc": "Restore 3% of Nayara's maximum HP at the start of each board move."
      },
      "manaSpeed": "fast",
      "special": {
        "name": "The River Remembers",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "self",
            "damage": 0,
            "healing": 0.24,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "remove_debuffs",
                "turns": 0,
                "scope": "allies"
              },
              {
                "id": "block_debuffs",
                "turns": 1,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 24% max HP to all living allies."
    },
    "after": {
      "template_id": "nayara_deep_well",
      "name": "Nayara, Keeper of the Deep Well",
      "title": "Voice of the Buried River",
      "rarity": "mythical",
      "faction": "duneriders",
      "role": "support",
      "hp": 1540,
      "atk": 835,
      "def": 800,
      "ability_name": "The River Remembers",
      "lore": "Nayara refused the pearl throne while a single caravan still searched for water. The buried river answered by lifting its oldest well into the moonlight. Wherever she walks, its blue current washes poison from the weary and carries them one crossing farther from the desert's hunger.",
      "image_url": "/assets/champions/nayara_deep_well.webp",
      "id": "nayara_deep_well",
      "color": "blue",
      "source_image": "assets/champions/nayara_deep_well.webp",
      "portrait": "assets/champions/nayara_deep_well.webp",
      "passive": {
        "id": "deep_well_heart",
        "name": "Heart of the Deep Well",
        "kind": "regen",
        "value": 0.03,
        "desc": "Restore 3% of Nayara's maximum HP at the start of each board move."
      },
      "manaSpeed": "fast",
      "special": {
        "name": "The River Remembers",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "self",
            "damage": 0,
            "healing": 0.28,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "remove_debuffs",
                "turns": 0,
                "scope": "allies"
              },
              {
                "id": "block_debuffs",
                "turns": 2,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 28% max HP to all living allies."
    },
    "sourceBefore": {
      "template_id": "nayara_deep_well",
      "name": "Nayara, Keeper of the Deep Well",
      "title": "Voice of the Buried River",
      "rarity": "mythical",
      "faction": "duneriders",
      "role": "support",
      "hp": 1540,
      "atk": 835,
      "def": 800,
      "ability_name": "The River Remembers",
      "lore": "Nayara refused the pearl throne while a single caravan still searched for water. The buried river answered by lifting its oldest well into the moonlight. Wherever she walks, its blue current washes poison from the weary and carries them one crossing farther from the desert's hunger.",
      "image_url": "/assets/champions/nayara_deep_well.webp",
      "id": "nayara_deep_well",
      "color": "blue",
      "source_image": "assets/champions/nayara_deep_well.webp",
      "portrait": "assets/champions/nayara_deep_well.webp",
      "passive": {
        "id": "deep_well_heart",
        "name": "Heart of the Deep Well",
        "kind": "regen",
        "value": 0.03,
        "desc": "Restore 3% of Nayara's maximum HP at the start of each board move."
      },
      "ability_desc": "Restore 24% max HP to all living allies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "remove_debuffs",
            0
          ],
          [
            "block_debuffs",
            1
          ]
        ]
      }
    },
    "sourceAfter": {
      "template_id": "nayara_deep_well",
      "name": "Nayara, Keeper of the Deep Well",
      "title": "Voice of the Buried River",
      "rarity": "mythical",
      "faction": "duneriders",
      "role": "support",
      "hp": 1540,
      "atk": 835,
      "def": 800,
      "ability_name": "The River Remembers",
      "lore": "Nayara refused the pearl throne while a single caravan still searched for water. The buried river answered by lifting its oldest well into the moonlight. Wherever she walks, its blue current washes poison from the weary and carries them one crossing farther from the desert's hunger.",
      "image_url": "/assets/champions/nayara_deep_well.webp",
      "id": "nayara_deep_well",
      "color": "blue",
      "source_image": "assets/champions/nayara_deep_well.webp",
      "portrait": "assets/champions/nayara_deep_well.webp",
      "passive": {
        "id": "deep_well_heart",
        "name": "Heart of the Deep Well",
        "kind": "regen",
        "value": 0.03,
        "desc": "Restore 3% of Nayara's maximum HP at the start of each board move."
      },
      "ability_desc": "Restore 28% max HP to all living allies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "remove_debuffs",
            0
          ],
          [
            "block_debuffs",
            1
          ]
        ]
      }
    },
    "designBefore": {
      "color": "blue",
      "manaSpeed": "fast",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "fast",
          "tiles": 8,
          "target": "self",
          "damage": 0,
          "healing": 0.24,
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "remove_debuffs",
              "turns": 0,
              "scope": "allies"
            },
            {
              "id": "block_debuffs",
              "turns": 1,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1540,
        "atk": 835,
        "def": 800
      }
    },
    "designAfter": {
      "color": "blue",
      "manaSpeed": "fast",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "fast",
          "tiles": 8,
          "target": "self",
          "damage": 0,
          "healing": 0.28,
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "remove_debuffs",
              "turns": 0,
              "scope": "allies"
            },
            {
              "id": "block_debuffs",
              "turns": 2,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1540,
        "atk": 835,
        "def": 800
      }
    }
  },
  {
    "id": "beatrice_verdigris_mender",
    "proposal": "Keep Fast 8 and 24% team healing/Cleanse; add team Defense Up for 2 turns.",
    "before": {
      "template_id": "beatrice_verdigris_mender",
      "name": "Beatrice, Verdigris Mender",
      "title": "Hands Behind the Iron Line",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "support",
      "hp": 1420,
      "atk": 730,
      "def": 737,
      "ability_name": "Mend the Living Line",
      "lore": "Beatrice learned that an Ironclad warband could survive a shattered engine but not a crew left behind. Her verdigris tinctures seal wounds as readily as cracked armor, while her clockwork assistants carry clean bandages through the smoke. She measures every invention by how many soldiers return home.",
      "image_url": "/assets/champions/beatrice_verdigris_mender.webp",
      "id": "beatrice_verdigris_mender",
      "color": "green",
      "source_image": "assets/champions/beatrice_verdigris_mender.webp",
      "portrait": "assets/champions/beatrice_verdigris_mender.webp",
      "passive": null,
      "manaSpeed": "fast",
      "special": {
        "name": "Mend the Living Line",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "damage": 0,
            "healing": 0.24,
            "target": "self",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "remove_debuffs",
                "turns": 0,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 24% max HP to all living allies."
    },
    "after": {
      "template_id": "beatrice_verdigris_mender",
      "name": "Beatrice, Verdigris Mender",
      "title": "Hands Behind the Iron Line",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "support",
      "hp": 1420,
      "atk": 730,
      "def": 737,
      "ability_name": "Mend the Living Line",
      "lore": "Beatrice learned that an Ironclad warband could survive a shattered engine but not a crew left behind. Her verdigris tinctures seal wounds as readily as cracked armor, while her clockwork assistants carry clean bandages through the smoke. She measures every invention by how many soldiers return home.",
      "image_url": "/assets/champions/beatrice_verdigris_mender.webp",
      "id": "beatrice_verdigris_mender",
      "color": "green",
      "source_image": "assets/champions/beatrice_verdigris_mender.webp",
      "portrait": "assets/champions/beatrice_verdigris_mender.webp",
      "passive": null,
      "manaSpeed": "fast",
      "special": {
        "name": "Mend the Living Line",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "damage": 0,
            "healing": 0.24,
            "target": "self",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "remove_debuffs",
                "turns": 0,
                "scope": "allies"
              },
              {
                "id": "inc_def",
                "turns": 2,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 24% max HP to all living allies."
    },
    "sourceBefore": {
      "template_id": "beatrice_verdigris_mender",
      "name": "Beatrice, Verdigris Mender",
      "title": "Hands Behind the Iron Line",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "support",
      "hp": 1420,
      "atk": 730,
      "def": 737,
      "ability_name": "Mend the Living Line",
      "lore": "Beatrice learned that an Ironclad warband could survive a shattered engine but not a crew left behind. Her verdigris tinctures seal wounds as readily as cracked armor, while her clockwork assistants carry clean bandages through the smoke. She measures every invention by how many soldiers return home.",
      "image_url": "/assets/champions/beatrice_verdigris_mender.webp",
      "id": "beatrice_verdigris_mender",
      "color": "green",
      "source_image": "assets/champions/beatrice_verdigris_mender.webp",
      "portrait": "assets/champions/beatrice_verdigris_mender.webp",
      "passive": null,
      "ability_desc": "Restore 24% max HP to all living allies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "remove_debuffs",
            0
          ]
        ]
      }
    },
    "sourceAfter": {
      "template_id": "beatrice_verdigris_mender",
      "name": "Beatrice, Verdigris Mender",
      "title": "Hands Behind the Iron Line",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "support",
      "hp": 1420,
      "atk": 730,
      "def": 737,
      "ability_name": "Mend the Living Line",
      "lore": "Beatrice learned that an Ironclad warband could survive a shattered engine but not a crew left behind. Her verdigris tinctures seal wounds as readily as cracked armor, while her clockwork assistants carry clean bandages through the smoke. She measures every invention by how many soldiers return home.",
      "image_url": "/assets/champions/beatrice_verdigris_mender.webp",
      "id": "beatrice_verdigris_mender",
      "color": "green",
      "source_image": "assets/champions/beatrice_verdigris_mender.webp",
      "portrait": "assets/champions/beatrice_verdigris_mender.webp",
      "passive": null,
      "ability_desc": "Restore 24% max HP to all living allies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "remove_debuffs",
            0
          ]
        ]
      }
    },
    "designBefore": {
      "color": "green",
      "manaSpeed": "fast",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "fast",
          "tiles": 8,
          "damage": 0,
          "healing": 0.24,
          "target": "self",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "remove_debuffs",
              "turns": 0,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1420,
        "atk": 730,
        "def": 737
      }
    },
    "designAfter": {
      "color": "green",
      "manaSpeed": "fast",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "fast",
          "tiles": 8,
          "damage": 0,
          "healing": 0.24,
          "target": "self",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "remove_debuffs",
              "turns": 0,
              "scope": "allies"
            },
            {
              "id": "inc_def",
              "turns": 2,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1420,
        "atk": 730,
        "def": 737
      }
    }
  },
  {
    "id": "eudoma_nova_keeper",
    "proposal": "Keep Average 10; healing 26% to 30%, team Attack Up 1 to 2 turns.",
    "before": {
      "template_id": "eudoma_nova_keeper",
      "name": "Eudoma, Nova Keeper",
      "title": "Nova Keeper",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1440,
      "atk": 710,
      "def": 745,
      "ability_name": "Hearth of the Wanderers",
      "lore": "Eudoma tends the small captive star at the heart of the Concord’s oldest ark. Its warmth has sustained generations born between worlds, and she carries a fragment into every battle. Those who stand beside her remember that even the longest journey can lead home.",
      "image_url": "/assets/champions/eudoma_nova_keeper.webp",
      "id": "eudoma_nova_keeper",
      "color": "red",
      "source_image": "assets/champions/eudoma_nova_keeper.webp",
      "portrait": "assets/champions/eudoma_nova_keeper.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Hearth of the Wanderers",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "damage": 0,
            "healing": 0.26,
            "target": "self",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "inc_atk",
                "turns": 1,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 26% max HP to all living allies."
    },
    "after": {
      "template_id": "eudoma_nova_keeper",
      "name": "Eudoma, Nova Keeper",
      "title": "Nova Keeper",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1440,
      "atk": 710,
      "def": 745,
      "ability_name": "Hearth of the Wanderers",
      "lore": "Eudoma tends the small captive star at the heart of the Concord’s oldest ark. Its warmth has sustained generations born between worlds, and she carries a fragment into every battle. Those who stand beside her remember that even the longest journey can lead home.",
      "image_url": "/assets/champions/eudoma_nova_keeper.webp",
      "id": "eudoma_nova_keeper",
      "color": "red",
      "source_image": "assets/champions/eudoma_nova_keeper.webp",
      "portrait": "assets/champions/eudoma_nova_keeper.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Hearth of the Wanderers",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "damage": 0,
            "healing": 0.3,
            "target": "self",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "inc_atk",
                "turns": 2,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 30% max HP to all living allies."
    },
    "sourceBefore": {
      "template_id": "eudoma_nova_keeper",
      "name": "Eudoma, Nova Keeper",
      "title": "Nova Keeper",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1440,
      "atk": 710,
      "def": 745,
      "ability_name": "Hearth of the Wanderers",
      "lore": "Eudoma tends the small captive star at the heart of the Concord’s oldest ark. Its warmth has sustained generations born between worlds, and she carries a fragment into every battle. Those who stand beside her remember that even the longest journey can lead home.",
      "image_url": "/assets/champions/eudoma_nova_keeper.webp",
      "id": "eudoma_nova_keeper",
      "color": "red",
      "source_image": "assets/champions/eudoma_nova_keeper.webp",
      "portrait": "assets/champions/eudoma_nova_keeper.webp",
      "passive": null,
      "ability_desc": "Restore 26% max HP to all living allies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "inc_atk",
            1
          ]
        ]
      }
    },
    "sourceAfter": {
      "template_id": "eudoma_nova_keeper",
      "name": "Eudoma, Nova Keeper",
      "title": "Nova Keeper",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1440,
      "atk": 710,
      "def": 745,
      "ability_name": "Hearth of the Wanderers",
      "lore": "Eudoma tends the small captive star at the heart of the Concord’s oldest ark. Its warmth has sustained generations born between worlds, and she carries a fragment into every battle. Those who stand beside her remember that even the longest journey can lead home.",
      "image_url": "/assets/champions/eudoma_nova_keeper.webp",
      "id": "eudoma_nova_keeper",
      "color": "red",
      "source_image": "assets/champions/eudoma_nova_keeper.webp",
      "portrait": "assets/champions/eudoma_nova_keeper.webp",
      "passive": null,
      "ability_desc": "Restore 30% max HP to all living allies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "inc_atk",
            1
          ]
        ]
      }
    },
    "designBefore": {
      "color": "red",
      "manaSpeed": "average",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "average",
          "tiles": 10,
          "damage": 0,
          "healing": 0.26,
          "target": "self",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "inc_atk",
              "turns": 1,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1440,
        "atk": 710,
        "def": 745
      }
    },
    "designAfter": {
      "color": "red",
      "manaSpeed": "average",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "average",
          "tiles": 10,
          "damage": 0,
          "healing": 0.3,
          "target": "self",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "inc_atk",
              "turns": 2,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1440,
        "atk": 710,
        "def": 745
      }
    }
  },
  {
    "id": "ophira_seed_of_worlds",
    "proposal": "Keep Average 10; healing 26% to 30%, team Ailment Ward 1 to 2 turns.",
    "before": {
      "template_id": "ophira_seed_of_worlds",
      "name": "Ophira, Seed of Worlds",
      "title": "Seed of Worlds",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1440,
      "atk": 700,
      "def": 755,
      "ability_name": "Spring Beyond the Stars",
      "lore": "Ophira carries a seed that flowers only beneath an unfamiliar sky. From its roots she draws the strength to sustain settlers through barren seasons and strange plagues. The Concord follows her blooms from world to world, leaving gardens where there had been only dust.",
      "image_url": "/assets/champions/ophira_seed_of_worlds.webp",
      "id": "ophira_seed_of_worlds",
      "color": "green",
      "source_image": "assets/champions/ophira_seed_of_worlds.webp",
      "portrait": "assets/champions/ophira_seed_of_worlds.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Spring Beyond the Stars",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "damage": 0,
            "healing": 0.26,
            "target": "self",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "block_debuffs",
                "turns": 1,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 26% max HP to all living allies."
    },
    "after": {
      "template_id": "ophira_seed_of_worlds",
      "name": "Ophira, Seed of Worlds",
      "title": "Seed of Worlds",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1440,
      "atk": 700,
      "def": 755,
      "ability_name": "Spring Beyond the Stars",
      "lore": "Ophira carries a seed that flowers only beneath an unfamiliar sky. From its roots she draws the strength to sustain settlers through barren seasons and strange plagues. The Concord follows her blooms from world to world, leaving gardens where there had been only dust.",
      "image_url": "/assets/champions/ophira_seed_of_worlds.webp",
      "id": "ophira_seed_of_worlds",
      "color": "green",
      "source_image": "assets/champions/ophira_seed_of_worlds.webp",
      "portrait": "assets/champions/ophira_seed_of_worlds.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Spring Beyond the Stars",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "damage": 0,
            "healing": 0.3,
            "target": "self",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "block_debuffs",
                "turns": 2,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 30% max HP to all living allies."
    },
    "sourceBefore": {
      "template_id": "ophira_seed_of_worlds",
      "name": "Ophira, Seed of Worlds",
      "title": "Seed of Worlds",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1440,
      "atk": 700,
      "def": 755,
      "ability_name": "Spring Beyond the Stars",
      "lore": "Ophira carries a seed that flowers only beneath an unfamiliar sky. From its roots she draws the strength to sustain settlers through barren seasons and strange plagues. The Concord follows her blooms from world to world, leaving gardens where there had been only dust.",
      "image_url": "/assets/champions/ophira_seed_of_worlds.webp",
      "id": "ophira_seed_of_worlds",
      "color": "green",
      "source_image": "assets/champions/ophira_seed_of_worlds.webp",
      "portrait": "assets/champions/ophira_seed_of_worlds.webp",
      "passive": null,
      "ability_desc": "Restore 26% max HP to all living allies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "block_debuffs",
            1
          ]
        ]
      }
    },
    "sourceAfter": {
      "template_id": "ophira_seed_of_worlds",
      "name": "Ophira, Seed of Worlds",
      "title": "Seed of Worlds",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1440,
      "atk": 700,
      "def": 755,
      "ability_name": "Spring Beyond the Stars",
      "lore": "Ophira carries a seed that flowers only beneath an unfamiliar sky. From its roots she draws the strength to sustain settlers through barren seasons and strange plagues. The Concord follows her blooms from world to world, leaving gardens where there had been only dust.",
      "image_url": "/assets/champions/ophira_seed_of_worlds.webp",
      "id": "ophira_seed_of_worlds",
      "color": "green",
      "source_image": "assets/champions/ophira_seed_of_worlds.webp",
      "portrait": "assets/champions/ophira_seed_of_worlds.webp",
      "passive": null,
      "ability_desc": "Restore 30% max HP to all living allies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "block_debuffs",
            1
          ]
        ]
      }
    },
    "designBefore": {
      "color": "green",
      "manaSpeed": "average",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "average",
          "tiles": 10,
          "damage": 0,
          "healing": 0.26,
          "target": "self",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "block_debuffs",
              "turns": 1,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1440,
        "atk": 700,
        "def": 755
      }
    },
    "designAfter": {
      "color": "green",
      "manaSpeed": "average",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "average",
          "tiles": 10,
          "damage": 0,
          "healing": 0.3,
          "target": "self",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "block_debuffs",
              "turns": 2,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1440,
        "atk": 700,
        "def": 755
      }
    }
  },
  {
    "id": "kelydras_worldbearer",
    "proposal": "Keep Slow 12; team Barrier 2 to 3 turns and team Damage Ward 1 to 2 turns.",
    "before": {
      "template_id": "kelydras_worldbearer",
      "name": "Kelydras, Worldbearer",
      "title": "Worldbearer",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "defense",
      "hp": 1571,
      "atk": 650,
      "def": 837,
      "ability_name": "Carry the Living World",
      "lore": "An entire orchard grows across the shell of Kelydras, preserved from the world he could not save. He carries its last seeds between the Concord’s arks, planting wherever life can take root. In battle, he shelters his companions as carefully as that fragile forest.",
      "image_url": "/assets/champions/kelydras_worldbearer.webp",
      "id": "kelydras_worldbearer",
      "color": "green",
      "source_image": "assets/champions/kelydras_worldbearer.webp",
      "portrait": "assets/champions/kelydras_worldbearer.webp",
      "passive": null,
      "manaSpeed": "slow",
      "special": {
        "name": "Carry the Living World",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "slow",
            "tiles": 12,
            "damage": 0,
            "healing": 0,
            "target": "self",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "shield",
                "turns": 2,
                "scope": "allies"
              },
              {
                "id": "strengthen",
                "turns": 1,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Empower your warband with the effects below."
    },
    "after": {
      "template_id": "kelydras_worldbearer",
      "name": "Kelydras, Worldbearer",
      "title": "Worldbearer",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "defense",
      "hp": 1571,
      "atk": 650,
      "def": 837,
      "ability_name": "Carry the Living World",
      "lore": "An entire orchard grows across the shell of Kelydras, preserved from the world he could not save. He carries its last seeds between the Concord’s arks, planting wherever life can take root. In battle, he shelters his companions as carefully as that fragile forest.",
      "image_url": "/assets/champions/kelydras_worldbearer.webp",
      "id": "kelydras_worldbearer",
      "color": "green",
      "source_image": "assets/champions/kelydras_worldbearer.webp",
      "portrait": "assets/champions/kelydras_worldbearer.webp",
      "passive": null,
      "manaSpeed": "slow",
      "special": {
        "name": "Carry the Living World",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "slow",
            "tiles": 12,
            "damage": 0,
            "healing": 0,
            "target": "self",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "shield",
                "turns": 3,
                "scope": "allies"
              },
              {
                "id": "strengthen",
                "turns": 2,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Empower your warband with the effects below."
    },
    "sourceBefore": {
      "template_id": "kelydras_worldbearer",
      "name": "Kelydras, Worldbearer",
      "title": "Worldbearer",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "defense",
      "hp": 1571,
      "atk": 650,
      "def": 837,
      "ability_name": "Carry the Living World",
      "lore": "An entire orchard grows across the shell of Kelydras, preserved from the world he could not save. He carries its last seeds between the Concord’s arks, planting wherever life can take root. In battle, he shelters his companions as carefully as that fragile forest.",
      "image_url": "/assets/champions/kelydras_worldbearer.webp",
      "id": "kelydras_worldbearer",
      "color": "green",
      "source_image": "assets/champions/kelydras_worldbearer.webp",
      "portrait": "assets/champions/kelydras_worldbearer.webp",
      "passive": null,
      "ability_desc": "Empower your warband with the effects below.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "shield",
            2
          ],
          [
            "strengthen",
            1
          ]
        ]
      }
    },
    "sourceAfter": {
      "template_id": "kelydras_worldbearer",
      "name": "Kelydras, Worldbearer",
      "title": "Worldbearer",
      "rarity": "legendary",
      "faction": "astral_concord",
      "role": "defense",
      "hp": 1571,
      "atk": 650,
      "def": 837,
      "ability_name": "Carry the Living World",
      "lore": "An entire orchard grows across the shell of Kelydras, preserved from the world he could not save. He carries its last seeds between the Concord’s arks, planting wherever life can take root. In battle, he shelters his companions as carefully as that fragile forest.",
      "image_url": "/assets/champions/kelydras_worldbearer.webp",
      "id": "kelydras_worldbearer",
      "color": "green",
      "source_image": "assets/champions/kelydras_worldbearer.webp",
      "portrait": "assets/champions/kelydras_worldbearer.webp",
      "passive": null,
      "ability_desc": "Empower your warband with the effects below.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "shield",
            2
          ],
          [
            "strengthen",
            1
          ]
        ]
      }
    },
    "designBefore": {
      "color": "green",
      "manaSpeed": "slow",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "slow",
          "tiles": 12,
          "damage": 0,
          "healing": 0,
          "target": "self",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "shield",
              "turns": 2,
              "scope": "allies"
            },
            {
              "id": "strengthen",
              "turns": 1,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1571,
        "atk": 650,
        "def": 837
      }
    },
    "designAfter": {
      "color": "green",
      "manaSpeed": "slow",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "slow",
          "tiles": 12,
          "damage": 0,
          "healing": 0,
          "target": "self",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "shield",
              "turns": 3,
              "scope": "allies"
            },
            {
              "id": "strengthen",
              "turns": 2,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1571,
        "atk": 650,
        "def": 837
      }
    }
  },
  {
    "id": "orrix_amethyst_bulwark",
    "proposal": "Slow 12 to Average 10; retain 125% hit/team Barrier 2 and extend self Riposte 1 to 2 turns.",
    "before": {
      "template_id": "orrix_amethyst_bulwark",
      "name": "Orrix, Amethyst Bulwark",
      "title": "The Patient Mutation",
      "rarity": "rare",
      "faction": "chymera",
      "role": "defense",
      "hp": 1129,
      "atk": 618,
      "def": 620,
      "ability_name": "Living Bastion",
      "lore": "The Chymera bred Orrix to survive the pressure beneath their crystal mines. Amethyst plates grew across his back, but the miners discovered a patient guardian beneath the experiment. When the tunnels collapsed, he held the ceiling until the last worker escaped. He has guarded their refuge ever since.",
      "image_url": "/assets/champions/orrix_amethyst_bulwark.webp",
      "id": "orrix_amethyst_bulwark",
      "color": "purple",
      "source_image": "assets/champions/orrix_amethyst_bulwark.webp",
      "portrait": "assets/champions/orrix_amethyst_bulwark.webp",
      "passive": null,
      "manaSpeed": "slow",
      "special": {
        "name": "Living Bastion",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "slow",
            "tiles": 12,
            "target": "enemy",
            "damage": 1.25,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "shield",
                "turns": 2,
                "scope": "allies"
              },
              {
                "id": "counterattack",
                "turns": 1,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 125% ATK damage to selected enemy."
    },
    "after": {
      "template_id": "orrix_amethyst_bulwark",
      "name": "Orrix, Amethyst Bulwark",
      "title": "The Patient Mutation",
      "rarity": "rare",
      "faction": "chymera",
      "role": "defense",
      "hp": 1129,
      "atk": 618,
      "def": 620,
      "ability_name": "Living Bastion",
      "lore": "The Chymera bred Orrix to survive the pressure beneath their crystal mines. Amethyst plates grew across his back, but the miners discovered a patient guardian beneath the experiment. When the tunnels collapsed, he held the ceiling until the last worker escaped. He has guarded their refuge ever since.",
      "image_url": "/assets/champions/orrix_amethyst_bulwark.webp",
      "id": "orrix_amethyst_bulwark",
      "color": "purple",
      "source_image": "assets/champions/orrix_amethyst_bulwark.webp",
      "portrait": "assets/champions/orrix_amethyst_bulwark.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Living Bastion",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.25,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "shield",
                "turns": 2,
                "scope": "allies"
              },
              {
                "id": "counterattack",
                "turns": 2,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 125% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "orrix_amethyst_bulwark",
      "name": "Orrix, Amethyst Bulwark",
      "title": "The Patient Mutation",
      "rarity": "rare",
      "faction": "chymera",
      "role": "defense",
      "hp": 1129,
      "atk": 618,
      "def": 620,
      "ability_name": "Living Bastion",
      "lore": "The Chymera bred Orrix to survive the pressure beneath their crystal mines. Amethyst plates grew across his back, but the miners discovered a patient guardian beneath the experiment. When the tunnels collapsed, he held the ceiling until the last worker escaped. He has guarded their refuge ever since.",
      "image_url": "/assets/champions/orrix_amethyst_bulwark.webp",
      "id": "orrix_amethyst_bulwark",
      "color": "purple",
      "source_image": "assets/champions/orrix_amethyst_bulwark.webp",
      "portrait": "assets/champions/orrix_amethyst_bulwark.webp",
      "passive": null,
      "ability_desc": "Deal 125% ATK damage to selected enemy.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "shield",
            2
          ],
          [
            "counterattack",
            1
          ]
        ]
      }
    },
    "sourceAfter": {
      "template_id": "orrix_amethyst_bulwark",
      "name": "Orrix, Amethyst Bulwark",
      "title": "The Patient Mutation",
      "rarity": "rare",
      "faction": "chymera",
      "role": "defense",
      "hp": 1129,
      "atk": 618,
      "def": 620,
      "ability_name": "Living Bastion",
      "lore": "The Chymera bred Orrix to survive the pressure beneath their crystal mines. Amethyst plates grew across his back, but the miners discovered a patient guardian beneath the experiment. When the tunnels collapsed, he held the ceiling until the last worker escaped. He has guarded their refuge ever since.",
      "image_url": "/assets/champions/orrix_amethyst_bulwark.webp",
      "id": "orrix_amethyst_bulwark",
      "color": "purple",
      "source_image": "assets/champions/orrix_amethyst_bulwark.webp",
      "portrait": "assets/champions/orrix_amethyst_bulwark.webp",
      "passive": null,
      "ability_desc": "Deal 125% ATK damage to selected enemy.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "shield",
            2
          ],
          [
            "counterattack",
            1
          ]
        ]
      }
    },
    "designBefore": {
      "color": "purple",
      "manaSpeed": "slow",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "slow",
          "tiles": 12,
          "target": "enemy",
          "damage": 1.25,
          "healing": 0,
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "shield",
              "turns": 2,
              "scope": "allies"
            },
            {
              "id": "counterattack",
              "turns": 1,
              "scope": "self"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1129,
        "atk": 618,
        "def": 620
      }
    },
    "designAfter": {
      "color": "purple",
      "manaSpeed": "average",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "average",
          "tiles": 10,
          "target": "enemy",
          "damage": 1.25,
          "healing": 0,
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "shield",
              "turns": 2,
              "scope": "allies"
            },
            {
              "id": "counterattack",
              "turns": 2,
              "scope": "self"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1129,
        "atk": 618,
        "def": 620
      }
    }
  },
  {
    "id": "qingluo_jade_tempest",
    "proposal": "Keep Slow 12; AoE coefficient 165% to 185%, enemy Defense Down 1 to 2 turns.",
    "before": {
      "template_id": "qingluo_jade_tempest",
      "name": "Qingluo, Jade Tempest",
      "title": "Storm of the Bamboo Sea",
      "rarity": "legendary",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 1340,
      "atk": 810,
      "def": 700,
      "ability_name": "Dragon Through the Bamboo",
      "lore": "Qingluo trained where the Dragon Dynasty’s jade mountains rise above an endless bamboo sea. He learned to turn a single sweeping strike into the rhythm of a storm, breaking an enemy line without taking a backward step. The imperial banners call him a weapon; his mountain village remembers the boy who defended its bridge.",
      "image_url": "/assets/champions/qingluo_jade_tempest.webp",
      "id": "qingluo_jade_tempest",
      "color": "green",
      "source_image": "assets/champions/qingluo_jade_tempest.webp",
      "portrait": "assets/champions/qingluo_jade_tempest.webp",
      "passive": null,
      "manaSpeed": "slow",
      "special": {
        "name": "Dragon Through the Bamboo",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "slow",
            "tiles": 12,
            "damage": 1.65,
            "healing": 0,
            "target": "enemy",
            "healScope": "allies",
            "aoe": true,
            "pierce": false,
            "effects": [
              {
                "id": "dec_def",
                "turns": 1,
                "scope": "enemies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 165% ATK damage to all living enemies."
    },
    "after": {
      "template_id": "qingluo_jade_tempest",
      "name": "Qingluo, Jade Tempest",
      "title": "Storm of the Bamboo Sea",
      "rarity": "legendary",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 1340,
      "atk": 810,
      "def": 700,
      "ability_name": "Dragon Through the Bamboo",
      "lore": "Qingluo trained where the Dragon Dynasty’s jade mountains rise above an endless bamboo sea. He learned to turn a single sweeping strike into the rhythm of a storm, breaking an enemy line without taking a backward step. The imperial banners call him a weapon; his mountain village remembers the boy who defended its bridge.",
      "image_url": "/assets/champions/qingluo_jade_tempest.webp",
      "id": "qingluo_jade_tempest",
      "color": "green",
      "source_image": "assets/champions/qingluo_jade_tempest.webp",
      "portrait": "assets/champions/qingluo_jade_tempest.webp",
      "passive": null,
      "manaSpeed": "slow",
      "special": {
        "name": "Dragon Through the Bamboo",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "slow",
            "tiles": 12,
            "damage": 1.85,
            "healing": 0,
            "target": "enemy",
            "healScope": "allies",
            "aoe": true,
            "pierce": false,
            "effects": [
              {
                "id": "dec_def",
                "turns": 2,
                "scope": "enemies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 185% ATK damage to all living enemies."
    },
    "sourceBefore": {
      "template_id": "qingluo_jade_tempest",
      "name": "Qingluo, Jade Tempest",
      "title": "Storm of the Bamboo Sea",
      "rarity": "legendary",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 1340,
      "atk": 810,
      "def": 700,
      "ability_name": "Dragon Through the Bamboo",
      "lore": "Qingluo trained where the Dragon Dynasty’s jade mountains rise above an endless bamboo sea. He learned to turn a single sweeping strike into the rhythm of a storm, breaking an enemy line without taking a backward step. The imperial banners call him a weapon; his mountain village remembers the boy who defended its bridge.",
      "image_url": "/assets/champions/qingluo_jade_tempest.webp",
      "id": "qingluo_jade_tempest",
      "color": "green",
      "source_image": "assets/champions/qingluo_jade_tempest.webp",
      "portrait": "assets/champions/qingluo_jade_tempest.webp",
      "passive": null,
      "ability_desc": "Deal 165% ATK damage to all living enemies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "dec_def",
            1
          ]
        ]
      }
    },
    "sourceAfter": {
      "template_id": "qingluo_jade_tempest",
      "name": "Qingluo, Jade Tempest",
      "title": "Storm of the Bamboo Sea",
      "rarity": "legendary",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 1340,
      "atk": 810,
      "def": 700,
      "ability_name": "Dragon Through the Bamboo",
      "lore": "Qingluo trained where the Dragon Dynasty’s jade mountains rise above an endless bamboo sea. He learned to turn a single sweeping strike into the rhythm of a storm, breaking an enemy line without taking a backward step. The imperial banners call him a weapon; his mountain village remembers the boy who defended its bridge.",
      "image_url": "/assets/champions/qingluo_jade_tempest.webp",
      "id": "qingluo_jade_tempest",
      "color": "green",
      "source_image": "assets/champions/qingluo_jade_tempest.webp",
      "portrait": "assets/champions/qingluo_jade_tempest.webp",
      "passive": null,
      "ability_desc": "Deal 185% ATK damage to all living enemies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "dec_def",
            1
          ]
        ]
      }
    },
    "designBefore": {
      "color": "green",
      "manaSpeed": "slow",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "slow",
          "tiles": 12,
          "damage": 1.65,
          "healing": 0,
          "target": "enemy",
          "healScope": "allies",
          "aoe": true,
          "pierce": false,
          "effects": [
            {
              "id": "dec_def",
              "turns": 1,
              "scope": "enemies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1340,
        "atk": 810,
        "def": 700
      }
    },
    "designAfter": {
      "color": "green",
      "manaSpeed": "slow",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "slow",
          "tiles": 12,
          "damage": 1.85,
          "healing": 0,
          "target": "enemy",
          "healScope": "allies",
          "aoe": true,
          "pierce": false,
          "effects": [
            {
              "id": "dec_def",
              "turns": 2,
              "scope": "enemies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1340,
        "atk": 810,
        "def": 700
      }
    }
  },
  {
    "id": "nix_biosteel_hunter",
    "proposal": "Keep 5/10/15 charge costs and Pierce; damage 90/180/270% to 110/220/340%; retain existing utility.",
    "before": {
      "template_id": "nix_biosteel_hunter",
      "name": "Nix, Biosteel Hunter",
      "title": "Blade of the Living Circuit",
      "rarity": "legendary",
      "faction": "neon_syndicate",
      "role": "attack",
      "hp": 1335,
      "atk": 800,
      "def": 704,
      "ability_name": "Overgrow the Grid",
      "lore": "When a Neon Syndicate weapons program grew a nervous system of its own, Nix cut herself free from its command lattice. Living filaments now repair her railblade between strikes. She stalks the syndicate towers as both hunter and evidence, carrying every stolen memory the program tried to erase.",
      "image_url": "/assets/champions/nix_biosteel_hunter.webp",
      "id": "nix_biosteel_hunter",
      "color": "green",
      "source_image": "assets/champions/nix_biosteel_hunter.webp",
      "portrait": "assets/champions/nix_biosteel_hunter.webp",
      "passive": null,
      "manaSpeed": "charging",
      "special": {
        "name": "Overgrow the Grid",
        "charging": true,
        "levels": [
          {
            "level": 1,
            "speed": "charge_1",
            "tiles": 5,
            "target": "enemy",
            "damage": 0.9,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": true,
            "effects": []
          },
          {
            "level": 2,
            "speed": "charge_2",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.8,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": true,
            "effects": [
              {
                "id": "dispel",
                "turns": 0,
                "scope": "enemy"
              }
            ]
          },
          {
            "level": 3,
            "speed": "charge_3",
            "tiles": 15,
            "target": "enemy",
            "damage": 2.7,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": true,
            "effects": [
              {
                "id": "dispel",
                "turns": 0,
                "scope": "enemy"
              },
              {
                "id": "block_buffs",
                "turns": 2,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 270% ATK damage to selected enemy, ignoring 25% of DEF."
    },
    "after": {
      "template_id": "nix_biosteel_hunter",
      "name": "Nix, Biosteel Hunter",
      "title": "Blade of the Living Circuit",
      "rarity": "legendary",
      "faction": "neon_syndicate",
      "role": "attack",
      "hp": 1335,
      "atk": 800,
      "def": 704,
      "ability_name": "Overgrow the Grid",
      "lore": "When a Neon Syndicate weapons program grew a nervous system of its own, Nix cut herself free from its command lattice. Living filaments now repair her railblade between strikes. She stalks the syndicate towers as both hunter and evidence, carrying every stolen memory the program tried to erase.",
      "image_url": "/assets/champions/nix_biosteel_hunter.webp",
      "id": "nix_biosteel_hunter",
      "color": "green",
      "source_image": "assets/champions/nix_biosteel_hunter.webp",
      "portrait": "assets/champions/nix_biosteel_hunter.webp",
      "passive": null,
      "manaSpeed": "charging",
      "special": {
        "name": "Overgrow the Grid",
        "charging": true,
        "levels": [
          {
            "level": 1,
            "speed": "charge_1",
            "tiles": 5,
            "target": "enemy",
            "damage": 1.1,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": true,
            "effects": []
          },
          {
            "level": 2,
            "speed": "charge_2",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.2,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": true,
            "effects": [
              {
                "id": "dispel",
                "turns": 0,
                "scope": "enemy"
              }
            ]
          },
          {
            "level": 3,
            "speed": "charge_3",
            "tiles": 15,
            "target": "enemy",
            "damage": 3.4,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": true,
            "effects": [
              {
                "id": "dispel",
                "turns": 0,
                "scope": "enemy"
              },
              {
                "id": "block_buffs",
                "turns": 2,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 340% ATK damage to selected enemy, ignoring 25% of DEF."
    },
    "sourceBefore": {
      "template_id": "nix_biosteel_hunter",
      "name": "Nix, Biosteel Hunter",
      "title": "Blade of the Living Circuit",
      "rarity": "legendary",
      "faction": "neon_syndicate",
      "role": "attack",
      "hp": 1335,
      "atk": 800,
      "def": 704,
      "ability_name": "Overgrow the Grid",
      "lore": "When a Neon Syndicate weapons program grew a nervous system of its own, Nix cut herself free from its command lattice. Living filaments now repair her railblade between strikes. She stalks the syndicate towers as both hunter and evidence, carrying every stolen memory the program tried to erase.",
      "image_url": "/assets/champions/nix_biosteel_hunter.webp",
      "id": "nix_biosteel_hunter",
      "color": "green",
      "source_image": "assets/champions/nix_biosteel_hunter.webp",
      "portrait": "assets/champions/nix_biosteel_hunter.webp",
      "passive": null,
      "ability_desc": "Deal 270% ATK damage to selected enemy, ignoring 25% of DEF.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "dispel",
            0
          ],
          [
            "block_buffs",
            2
          ]
        ]
      }
    },
    "sourceAfter": {
      "template_id": "nix_biosteel_hunter",
      "name": "Nix, Biosteel Hunter",
      "title": "Blade of the Living Circuit",
      "rarity": "legendary",
      "faction": "neon_syndicate",
      "role": "attack",
      "hp": 1335,
      "atk": 800,
      "def": 704,
      "ability_name": "Overgrow the Grid",
      "lore": "When a Neon Syndicate weapons program grew a nervous system of its own, Nix cut herself free from its command lattice. Living filaments now repair her railblade between strikes. She stalks the syndicate towers as both hunter and evidence, carrying every stolen memory the program tried to erase.",
      "image_url": "/assets/champions/nix_biosteel_hunter.webp",
      "id": "nix_biosteel_hunter",
      "color": "green",
      "source_image": "assets/champions/nix_biosteel_hunter.webp",
      "portrait": "assets/champions/nix_biosteel_hunter.webp",
      "passive": null,
      "ability_desc": "Deal 340% ATK damage to selected enemy, ignoring 25% of DEF.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "dispel",
            0
          ],
          [
            "block_buffs",
            2
          ]
        ]
      }
    },
    "designBefore": {
      "color": "green",
      "manaSpeed": "charging",
      "chargeLevels": 3,
      "levelOverrides": [
        {
          "level": 1,
          "speed": "charge_1",
          "tiles": 5,
          "target": "enemy",
          "damage": 0.9,
          "healing": 0,
          "healScope": "allies",
          "aoe": false,
          "pierce": true,
          "effects": []
        },
        {
          "level": 2,
          "speed": "charge_2",
          "tiles": 10,
          "target": "enemy",
          "damage": 1.8,
          "healing": 0,
          "healScope": "allies",
          "aoe": false,
          "pierce": true,
          "effects": [
            {
              "id": "dispel",
              "turns": 0,
              "scope": "enemy"
            }
          ]
        },
        {
          "level": 3,
          "speed": "charge_3",
          "tiles": 15,
          "target": "enemy",
          "damage": 2.7,
          "healing": 0,
          "healScope": "allies",
          "aoe": false,
          "pierce": true,
          "effects": [
            {
              "id": "dispel",
              "turns": 0,
              "scope": "enemy"
            },
            {
              "id": "block_buffs",
              "turns": 2,
              "scope": "enemy"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1335,
        "atk": 800,
        "def": 704
      }
    },
    "designAfter": {
      "color": "green",
      "manaSpeed": "charging",
      "chargeLevels": 3,
      "levelOverrides": [
        {
          "level": 1,
          "speed": "charge_1",
          "tiles": 5,
          "target": "enemy",
          "damage": 1.1,
          "healing": 0,
          "healScope": "allies",
          "aoe": false,
          "pierce": true,
          "effects": []
        },
        {
          "level": 2,
          "speed": "charge_2",
          "tiles": 10,
          "target": "enemy",
          "damage": 2.2,
          "healing": 0,
          "healScope": "allies",
          "aoe": false,
          "pierce": true,
          "effects": [
            {
              "id": "dispel",
              "turns": 0,
              "scope": "enemy"
            }
          ]
        },
        {
          "level": 3,
          "speed": "charge_3",
          "tiles": 15,
          "target": "enemy",
          "damage": 3.4,
          "healing": 0,
          "healScope": "allies",
          "aoe": false,
          "pierce": true,
          "effects": [
            {
              "id": "dispel",
              "turns": 0,
              "scope": "enemy"
            },
            {
              "id": "block_buffs",
              "turns": 2,
              "scope": "enemy"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1335,
        "atk": 800,
        "def": 704
      }
    }
  },
  {
    "id": "kozhak_glacier_prowler",
    "proposal": "Keep 5/10/15 costs; damage 85/175/260% to 100/210/330%; final blue Vulnerability 1 to 2 turns.",
    "before": {
      "template_id": "kozhak_glacier_prowler",
      "name": "Kozhak, Glacier Prowler",
      "title": "Hunter Beneath the Whiteout",
      "rarity": "legendary",
      "faction": "veldtborn",
      "role": "attack",
      "hp": 1320,
      "atk": 815,
      "def": 680,
      "ability_name": "Whiteout Pursuit",
      "lore": "Kozhak follows the glacier herds along the Veldtborn’s highest migration paths. He waits through storms that bury entire hunting parties, trusting the tremor of the ice to betray a hidden enemy. When he finally moves, the whiteout itself seems to spring forward with his blades.",
      "image_url": "/assets/champions/kozhak_glacier_prowler.webp",
      "id": "kozhak_glacier_prowler",
      "color": "blue",
      "source_image": "assets/champions/kozhak_glacier_prowler.webp",
      "portrait": "assets/champions/kozhak_glacier_prowler.webp",
      "passive": null,
      "manaSpeed": "charging",
      "special": {
        "name": "Whiteout Pursuit",
        "charging": true,
        "levels": [
          {
            "level": 1,
            "speed": "charge_1",
            "tiles": 5,
            "damage": 0.85,
            "healing": 0,
            "target": "enemy",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": []
          },
          {
            "level": 2,
            "speed": "charge_2",
            "tiles": 10,
            "damage": 1.75,
            "healing": 0,
            "target": "enemy",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "frostbite",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          },
          {
            "level": 3,
            "speed": "charge_3",
            "tiles": 15,
            "damage": 2.6,
            "healing": 0,
            "target": "enemy",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "frostbite",
                "turns": 2,
                "scope": "enemy"
              },
              {
                "id": "vulnerable_blue",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 260% ATK damage to selected enemy."
    },
    "after": {
      "template_id": "kozhak_glacier_prowler",
      "name": "Kozhak, Glacier Prowler",
      "title": "Hunter Beneath the Whiteout",
      "rarity": "legendary",
      "faction": "veldtborn",
      "role": "attack",
      "hp": 1320,
      "atk": 815,
      "def": 680,
      "ability_name": "Whiteout Pursuit",
      "lore": "Kozhak follows the glacier herds along the Veldtborn’s highest migration paths. He waits through storms that bury entire hunting parties, trusting the tremor of the ice to betray a hidden enemy. When he finally moves, the whiteout itself seems to spring forward with his blades.",
      "image_url": "/assets/champions/kozhak_glacier_prowler.webp",
      "id": "kozhak_glacier_prowler",
      "color": "blue",
      "source_image": "assets/champions/kozhak_glacier_prowler.webp",
      "portrait": "assets/champions/kozhak_glacier_prowler.webp",
      "passive": null,
      "manaSpeed": "charging",
      "special": {
        "name": "Whiteout Pursuit",
        "charging": true,
        "levels": [
          {
            "level": 1,
            "speed": "charge_1",
            "tiles": 5,
            "damage": 1,
            "healing": 0,
            "target": "enemy",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": []
          },
          {
            "level": 2,
            "speed": "charge_2",
            "tiles": 10,
            "damage": 2.1,
            "healing": 0,
            "target": "enemy",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "frostbite",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          },
          {
            "level": 3,
            "speed": "charge_3",
            "tiles": 15,
            "damage": 3.3,
            "healing": 0,
            "target": "enemy",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "frostbite",
                "turns": 2,
                "scope": "enemy"
              },
              {
                "id": "vulnerable_blue",
                "turns": 2,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 330% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "kozhak_glacier_prowler",
      "name": "Kozhak, Glacier Prowler",
      "title": "Hunter Beneath the Whiteout",
      "rarity": "legendary",
      "faction": "veldtborn",
      "role": "attack",
      "hp": 1320,
      "atk": 815,
      "def": 680,
      "ability_name": "Whiteout Pursuit",
      "lore": "Kozhak follows the glacier herds along the Veldtborn’s highest migration paths. He waits through storms that bury entire hunting parties, trusting the tremor of the ice to betray a hidden enemy. When he finally moves, the whiteout itself seems to spring forward with his blades.",
      "image_url": "/assets/champions/kozhak_glacier_prowler.webp",
      "id": "kozhak_glacier_prowler",
      "color": "blue",
      "source_image": "assets/champions/kozhak_glacier_prowler.webp",
      "portrait": "assets/champions/kozhak_glacier_prowler.webp",
      "passive": null,
      "ability_desc": "Deal 260% ATK damage to selected enemy.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "frostbite",
            2
          ],
          [
            "vulnerable_blue",
            1
          ]
        ]
      }
    },
    "sourceAfter": {
      "template_id": "kozhak_glacier_prowler",
      "name": "Kozhak, Glacier Prowler",
      "title": "Hunter Beneath the Whiteout",
      "rarity": "legendary",
      "faction": "veldtborn",
      "role": "attack",
      "hp": 1320,
      "atk": 815,
      "def": 680,
      "ability_name": "Whiteout Pursuit",
      "lore": "Kozhak follows the glacier herds along the Veldtborn’s highest migration paths. He waits through storms that bury entire hunting parties, trusting the tremor of the ice to betray a hidden enemy. When he finally moves, the whiteout itself seems to spring forward with his blades.",
      "image_url": "/assets/champions/kozhak_glacier_prowler.webp",
      "id": "kozhak_glacier_prowler",
      "color": "blue",
      "source_image": "assets/champions/kozhak_glacier_prowler.webp",
      "portrait": "assets/champions/kozhak_glacier_prowler.webp",
      "passive": null,
      "ability_desc": "Deal 330% ATK damage to selected enemy.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "frostbite",
            2
          ],
          [
            "vulnerable_blue",
            1
          ]
        ]
      }
    },
    "designBefore": {
      "color": "blue",
      "manaSpeed": "charging",
      "chargeLevels": 3,
      "levelOverrides": [
        {
          "level": 1,
          "speed": "charge_1",
          "tiles": 5,
          "damage": 0.85,
          "healing": 0,
          "target": "enemy",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": []
        },
        {
          "level": 2,
          "speed": "charge_2",
          "tiles": 10,
          "damage": 1.75,
          "healing": 0,
          "target": "enemy",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "frostbite",
              "turns": 1,
              "scope": "enemy"
            }
          ]
        },
        {
          "level": 3,
          "speed": "charge_3",
          "tiles": 15,
          "damage": 2.6,
          "healing": 0,
          "target": "enemy",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "frostbite",
              "turns": 2,
              "scope": "enemy"
            },
            {
              "id": "vulnerable_blue",
              "turns": 1,
              "scope": "enemy"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1320,
        "atk": 815,
        "def": 680
      }
    },
    "designAfter": {
      "color": "blue",
      "manaSpeed": "charging",
      "chargeLevels": 3,
      "levelOverrides": [
        {
          "level": 1,
          "speed": "charge_1",
          "tiles": 5,
          "damage": 1,
          "healing": 0,
          "target": "enemy",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": []
        },
        {
          "level": 2,
          "speed": "charge_2",
          "tiles": 10,
          "damage": 2.1,
          "healing": 0,
          "target": "enemy",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "frostbite",
              "turns": 1,
              "scope": "enemy"
            }
          ]
        },
        {
          "level": 3,
          "speed": "charge_3",
          "tiles": 15,
          "damage": 3.3,
          "healing": 0,
          "target": "enemy",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "frostbite",
              "turns": 2,
              "scope": "enemy"
            },
            {
              "id": "vulnerable_blue",
              "turns": 2,
              "scope": "enemy"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1320,
        "atk": 815,
        "def": 680
      }
    }
  },
  {
    "id": "phozia_star_oracle",
    "proposal": "Keep Average 10; healing 22% to 28%, team Barrier 1 to 2 turns.",
    "before": {
      "template_id": "phozia_star_oracle",
      "name": "Phozia, Star Oracle",
      "title": "Star Oracle",
      "rarity": "rare",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1110,
      "atk": 595,
      "def": 610,
      "ability_name": "Tomorrow’s Shelter",
      "lore": "Phozia reads possible futures in the dust caught inside her halo. She cannot promise victory, but she can find the instant when a shield will matter most. The Concord trusts her because she speaks plainly about what even the stars cannot know.",
      "image_url": "/assets/champions/phozia_star_oracle.webp",
      "id": "phozia_star_oracle",
      "color": "yellow",
      "source_image": "assets/champions/phozia_star_oracle.webp",
      "portrait": "assets/champions/phozia_star_oracle.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Tomorrow’s Shelter",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "damage": 0,
            "healing": 0.22,
            "target": "self",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "shield",
                "turns": 1,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 22% max HP to all living allies."
    },
    "after": {
      "template_id": "phozia_star_oracle",
      "name": "Phozia, Star Oracle",
      "title": "Star Oracle",
      "rarity": "rare",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1110,
      "atk": 595,
      "def": 610,
      "ability_name": "Tomorrow’s Shelter",
      "lore": "Phozia reads possible futures in the dust caught inside her halo. She cannot promise victory, but she can find the instant when a shield will matter most. The Concord trusts her because she speaks plainly about what even the stars cannot know.",
      "image_url": "/assets/champions/phozia_star_oracle.webp",
      "id": "phozia_star_oracle",
      "color": "yellow",
      "source_image": "assets/champions/phozia_star_oracle.webp",
      "portrait": "assets/champions/phozia_star_oracle.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Tomorrow’s Shelter",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "damage": 0,
            "healing": 0.28,
            "target": "self",
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "shield",
                "turns": 2,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 28% max HP to all living allies."
    },
    "sourceBefore": {
      "template_id": "phozia_star_oracle",
      "name": "Phozia, Star Oracle",
      "title": "Star Oracle",
      "rarity": "rare",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1110,
      "atk": 595,
      "def": 610,
      "ability_name": "Tomorrow’s Shelter",
      "lore": "Phozia reads possible futures in the dust caught inside her halo. She cannot promise victory, but she can find the instant when a shield will matter most. The Concord trusts her because she speaks plainly about what even the stars cannot know.",
      "image_url": "/assets/champions/phozia_star_oracle.webp",
      "id": "phozia_star_oracle",
      "color": "yellow",
      "source_image": "assets/champions/phozia_star_oracle.webp",
      "portrait": "assets/champions/phozia_star_oracle.webp",
      "passive": null,
      "ability_desc": "Restore 22% max HP to all living allies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "shield",
            1
          ]
        ]
      }
    },
    "sourceAfter": {
      "template_id": "phozia_star_oracle",
      "name": "Phozia, Star Oracle",
      "title": "Star Oracle",
      "rarity": "rare",
      "faction": "astral_concord",
      "role": "support",
      "hp": 1110,
      "atk": 595,
      "def": 610,
      "ability_name": "Tomorrow’s Shelter",
      "lore": "Phozia reads possible futures in the dust caught inside her halo. She cannot promise victory, but she can find the instant when a shield will matter most. The Concord trusts her because she speaks plainly about what even the stars cannot know.",
      "image_url": "/assets/champions/phozia_star_oracle.webp",
      "id": "phozia_star_oracle",
      "color": "yellow",
      "source_image": "assets/champions/phozia_star_oracle.webp",
      "portrait": "assets/champions/phozia_star_oracle.webp",
      "passive": null,
      "ability_desc": "Restore 28% max HP to all living allies.",
      "spd": 100,
      "kit": {
        "a2": [],
        "a3": [
          [
            "shield",
            1
          ]
        ]
      }
    },
    "designBefore": {
      "color": "yellow",
      "manaSpeed": "average",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "average",
          "tiles": 10,
          "damage": 0,
          "healing": 0.22,
          "target": "self",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "shield",
              "turns": 1,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1110,
        "atk": 595,
        "def": 610
      }
    },
    "designAfter": {
      "color": "yellow",
      "manaSpeed": "average",
      "levelOverrides": [
        {
          "level": 1,
          "speed": "average",
          "tiles": 10,
          "damage": 0,
          "healing": 0.28,
          "target": "self",
          "healScope": "allies",
          "aoe": false,
          "pierce": false,
          "effects": [
            {
              "id": "shield",
              "turns": 2,
              "scope": "allies"
            }
          ]
        }
      ],
      "statsOverride": {
        "hp": 1110,
        "atk": 595,
        "def": 610
      }
    }
  }
];
export function beforeUpgradeBalance(records){return beforeCharacterNameRevision(records).map(c=>{if(!c?.id||!c.special&&!c.kit)return c;const x=UPGRADE_BALANCE_REVISION.find(x=>x.id===c.id);if(!x)return c;const source=!!c.kit,before=source?x.sourceBefore:x.before,after=source?x.sourceAfter:x.after;if(JSON.stringify(c)===JSON.stringify(before))return structuredClone(c);if(JSON.stringify(c)!==JSON.stringify(after))throw Error('Unexpected approved balance revision: '+c.id);return structuredClone(before);});}
