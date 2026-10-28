// Explicitly approved roster changes; snapshots preserve historical audit contracts.
export const RARITY_REVISION=[
  {
    "id": "neon_wire runner",
    "name": "Kaelen, the Grid Runner",
    "before": {
      "template_id": "neon_wire runner",
      "name": "Kaelen, the Grid Runner",
      "title": "Data Thief of the Low Slums",
      "rarity": "common",
      "faction": "neon_syndicate",
      "role": "attack",
      "hp": 744,
      "atk": 508,
      "def": 435,
      "ability_name": "Overclock Circuit",
      "lore": "Kaelen sells stolen memory shards just to afford clean water. In the dark dacha woods, wire is cheaper than iron.",
      "image_url": "/api/static/champions/neon_wirerunner.png",
      "id": "neon_wire runner",
      "color": "yellow",
      "source_image": "/api/static/champions/neon_wirerunner.png",
      "portrait": "assets/champions/neon_wire runner.webp",
      "passive": null,
      "manaSpeed": "very_fast",
      "special": {
        "name": "Overclock Circuit",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "very_fast",
            "tiles": 6.5,
            "target": "enemy",
            "damage": 1.93,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "block_buffs",
                "turns": 3,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 193% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "neon_wire runner",
      "name": "Kaelen, the Grid Runner",
      "title": "Data Thief of the Low Slums",
      "rarity": "common",
      "faction": "neon_syndicate",
      "role": "attack",
      "hp": 845,
      "atk": 112,
      "def": 70,
      "spd": 113,
      "ability_name": "Overclock Circuit",
      "ability_desc": "Overclocks the circuit — a current that shorts the foe out of any blessing for three rounds.",
      "lore": "Kaelen sells stolen memory shards just to afford clean water. In the dark dacha woods, wire is cheaper than iron.",
      "image_url": "/api/static/champions/neon_wirerunner.png",
      "id": "neon_wire runner",
      "color": "yellow",
      "source_image": "/api/static/champions/neon_wirerunner.png",
      "portrait": "assets/champions/neon_wire runner.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "block_buffs",
            3
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "neon_wire runner",
      "name": "Kaelen, the Grid Runner",
      "title": "Data Thief of the Low Slums",
      "rarity": "rare",
      "faction": "neon_syndicate",
      "role": "attack",
      "hp": 1028,
      "atk": 678,
      "def": 546,
      "ability_name": "Overclock Circuit",
      "lore": "Kaelen sells stolen memory shards just to afford clean water. In the dark dacha woods, wire is cheaper than iron.",
      "image_url": "/api/static/champions/neon_wirerunner.png",
      "id": "neon_wire runner",
      "color": "yellow",
      "source_image": "/api/static/champions/neon_wirerunner.png",
      "portrait": "assets/champions/neon_wire runner.webp",
      "passive": null,
      "manaSpeed": "very_fast",
      "special": {
        "name": "Overclock Circuit",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "very_fast",
            "tiles": 6.5,
            "target": "enemy",
            "damage": 2.12,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "block_buffs",
                "turns": 2,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 212% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "neon_wire runner",
      "name": "Kaelen, the Grid Runner",
      "title": "Data Thief of the Low Slums",
      "rarity": "rare",
      "faction": "neon_syndicate",
      "role": "attack",
      "hp": 1028,
      "atk": 678,
      "def": 546,
      "spd": 113,
      "ability_name": "Overclock Circuit",
      "ability_desc": "Deal 212% ATK damage to selected enemy.",
      "lore": "Kaelen sells stolen memory shards just to afford clean water. In the dark dacha woods, wire is cheaper than iron.",
      "image_url": "/api/static/champions/neon_wirerunner.png",
      "id": "neon_wire runner",
      "color": "yellow",
      "source_image": "/api/static/champions/neon_wirerunner.png",
      "portrait": "assets/champions/neon_wire runner.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "block_buffs",
            2
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "pit_scout",
    "name": "Rhagz, Pit Scout",
    "before": {
      "template_id": "pit_scout",
      "name": "Rhagz, Pit Scout",
      "title": "Runner of the Third Rung",
      "rarity": "common",
      "faction": "nether",
      "role": "attack",
      "hp": 749,
      "atk": 507,
      "def": 426,
      "ability_name": "Rusted Bolt",
      "lore": "Rhagz has never won a duel — he has never stayed long enough for one to begin.",
      "image_url": "/api/static/champions/pit_scout.png",
      "id": "pit_scout",
      "color": "green",
      "source_image": "/api/static/champions/pit_scout.png",
      "portrait": "assets/champions/pit_scout.webp",
      "passive": null,
      "manaSpeed": "very_fast",
      "special": {
        "name": "Rusted Bolt",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "very_fast",
            "tiles": 6.5,
            "target": "enemy",
            "damage": 1.93,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "poison",
                "turns": 2,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 193% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "pit_scout",
      "name": "Rhagz, Pit Scout",
      "title": "Runner of the Third Rung",
      "rarity": "common",
      "faction": "nether",
      "role": "attack",
      "hp": 700,
      "atk": 104,
      "def": 54,
      "spd": 118,
      "ability_name": "Rusted Bolt",
      "ability_desc": "A hurried crossbow bolt that finds the gap in the armour and leaves the wound septic for two rounds.",
      "lore": "Rhagz has never won a duel — he has never stayed long enough for one to begin.",
      "image_url": "/api/static/champions/pit_scout.png",
      "id": "pit_scout",
      "color": "purple",
      "source_image": "/api/static/champions/pit_scout.png",
      "portrait": "assets/champions/pit_scout.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "poison",
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "pit_scout",
      "name": "Rhagz, Pit Scout",
      "title": "Runner of the Third Rung",
      "rarity": "rare",
      "faction": "nether",
      "role": "attack",
      "hp": 1029,
      "atk": 678,
      "def": 546,
      "ability_name": "Rusted Bolt",
      "lore": "Rhagz has never won a duel — he has never stayed long enough for one to begin.",
      "image_url": "/api/static/champions/pit_scout.png",
      "id": "pit_scout",
      "color": "green",
      "source_image": "/api/static/champions/pit_scout.png",
      "portrait": "assets/champions/pit_scout.webp",
      "passive": null,
      "manaSpeed": "very_fast",
      "special": {
        "name": "Rusted Bolt",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "very_fast",
            "tiles": 6.5,
            "target": "enemy",
            "damage": 2.12,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "poison",
                "turns": 2,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 212% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "pit_scout",
      "name": "Rhagz, Pit Scout",
      "title": "Runner of the Third Rung",
      "rarity": "rare",
      "faction": "nether",
      "role": "attack",
      "hp": 1029,
      "atk": 678,
      "def": 546,
      "spd": 118,
      "ability_name": "Rusted Bolt",
      "ability_desc": "Deal 212% ATK damage to selected enemy.",
      "lore": "Rhagz has never won a duel — he has never stayed long enough for one to begin.",
      "image_url": "/api/static/champions/pit_scout.png",
      "id": "pit_scout",
      "color": "green",
      "source_image": "/api/static/champions/pit_scout.png",
      "portrait": "assets/champions/pit_scout.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "poison",
            2
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "scavenger_jax",
    "name": "Scavenger Jax",
    "before": {
      "template_id": "scavenger_jax",
      "name": "Scavenger Jax",
      "title": "Picker of the Still-Warm Dead",
      "rarity": "common",
      "faction": "duneriders",
      "role": "attack",
      "hp": 772,
      "atk": 495,
      "def": 439,
      "ability_name": "Whirlwind",
      "lore": "Jax never starts wars. He finishes the paperwork — pockets first, mercy never.",
      "image_url": "/api/static/champions/hero-25.png",
      "id": "scavenger_jax",
      "color": "red",
      "source_image": "/api/static/champions/hero-25.png",
      "portrait": "assets/champions/scavenger_jax.webp",
      "passive": null,
      "manaSpeed": "fast",
      "special": {
        "name": "Whirlwind",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "enemy",
            "damage": 2.17,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": true,
            "effects": []
          }
        ]
      },
      "ability_desc": "Deal 217% ATK damage to selected enemy, ignoring 25% of DEF."
    },
    "sourceBefore": {
      "template_id": "scavenger_jax",
      "name": "Scavenger Jax",
      "title": "Picker of the Still-Warm Dead",
      "rarity": "common",
      "faction": "duneriders",
      "role": "attack",
      "hp": 800,
      "atk": 98,
      "def": 72,
      "spd": 106,
      "ability_name": "Whirlwind",
      "ability_desc": "A dirty spin of rusted steel that ignores a quarter of the foe's armour.",
      "lore": "Jax never starts wars. He finishes the paperwork — pockets first, mercy never.",
      "image_url": "/api/static/champions/hero-25.png",
      "id": "scavenger_jax",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-25.png",
      "portrait": "assets/champions/scavenger_jax.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "ignore_def",
            0
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "scavenger_jax",
      "name": "Scavenger Jax",
      "title": "Picker of the Still-Warm Dead",
      "rarity": "rare",
      "faction": "duneriders",
      "role": "attack",
      "hp": 1028,
      "atk": 678,
      "def": 546,
      "ability_name": "Whirlwind",
      "lore": "Jax never starts wars. He finishes the paperwork — pockets first, mercy never.",
      "image_url": "/api/static/champions/hero-25.png",
      "id": "scavenger_jax",
      "color": "red",
      "source_image": "/api/static/champions/hero-25.png",
      "portrait": "assets/champions/scavenger_jax.webp",
      "passive": null,
      "manaSpeed": "fast",
      "special": {
        "name": "Whirlwind",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "enemy",
            "damage": 2.37,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": true,
            "effects": []
          }
        ]
      },
      "ability_desc": "Deal 237% ATK damage to selected enemy, ignoring 25% of DEF."
    },
    "sourceAfter": {
      "template_id": "scavenger_jax",
      "name": "Scavenger Jax",
      "title": "Picker of the Still-Warm Dead",
      "rarity": "rare",
      "faction": "duneriders",
      "role": "attack",
      "hp": 1028,
      "atk": 678,
      "def": 546,
      "spd": 106,
      "ability_name": "Whirlwind",
      "ability_desc": "Deal 237% ATK damage to selected enemy, ignoring 25% of DEF.",
      "lore": "Jax never starts wars. He finishes the paperwork — pockets first, mercy never.",
      "image_url": "/api/static/champions/hero-25.png",
      "id": "scavenger_jax",
      "color": "red",
      "source_image": "/api/static/champions/hero-25.png",
      "portrait": "assets/champions/scavenger_jax.webp",
      "kit": {
        "a2": [],
        "a3": []
      },
      "passive": null
    }
  },
  {
    "id": "shellback_brukk",
    "name": "Shellback Brukk",
    "before": {
      "template_id": "shellback_brukk",
      "name": "Shellback Brukk",
      "title": "The Door That Would Not Break",
      "rarity": "common",
      "faction": "chymera",
      "role": "defense",
      "hp": 974,
      "atk": 352,
      "def": 560,
      "ability_name": "Shellback Challenge",
      "lore": "Bred to survive the menagerie's cruelest trials, Brukk broke his collar and stood in the doorway while the smaller experiments escaped. He has never learned to stop guarding it.",
      "image_url": "/api/static/champions/shellback_brukk.png",
      "id": "shellback_brukk",
      "color": "green",
      "source_image": "/api/static/champions/shellback_brukk.png",
      "portrait": "assets/champions/shellback_brukk.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Shellback Challenge",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.38,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "guard",
                "turns": 1,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 138% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "shellback_brukk",
      "name": "Shellback Brukk",
      "title": "The Door That Would Not Break",
      "rarity": "common",
      "faction": "chymera",
      "role": "defense",
      "hp": 1040,
      "atk": 82,
      "def": 98,
      "spd": 72,
      "ability_name": "Shellback Challenge",
      "ability_desc": "Strikes and taunts one foe, forcing its next action to be a basic attack against Brukk.",
      "lore": "Bred to survive the menagerie's cruelest trials, Brukk broke his collar and stood in the doorway while the smaller experiments escaped. He has never learned to stop guarding it.",
      "image_url": "/api/static/champions/shellback_brukk.png",
      "id": "shellback_brukk",
      "color": "green",
      "source_image": "/api/static/champions/shellback_brukk.png",
      "portrait": "assets/champions/shellback_brukk.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "taunt",
            1
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "shellback_brukk",
      "name": "Shellback Brukk",
      "title": "The Door That Would Not Break",
      "rarity": "rare",
      "faction": "chymera",
      "role": "defense",
      "hp": 1248,
      "atk": 524,
      "def": 701,
      "ability_name": "Shellback Challenge",
      "lore": "Bred to survive the menagerie's cruelest trials, Brukk broke his collar and stood in the doorway while the smaller experiments escaped. He has never learned to stop guarding it.",
      "image_url": "/api/static/champions/shellback_brukk.png",
      "id": "shellback_brukk",
      "color": "green",
      "source_image": "/api/static/champions/shellback_brukk.png",
      "portrait": "assets/champions/shellback_brukk.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Shellback Challenge",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.5,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "guard",
                "turns": 2,
                "scope": "self"
              },
              {
                "id": "shield",
                "turns": 1,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 150% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "shellback_brukk",
      "name": "Shellback Brukk",
      "title": "The Door That Would Not Break",
      "rarity": "rare",
      "faction": "chymera",
      "role": "defense",
      "hp": 1248,
      "atk": 524,
      "def": 701,
      "spd": 72,
      "ability_name": "Shellback Challenge",
      "ability_desc": "Deal 150% ATK damage to selected enemy.",
      "lore": "Bred to survive the menagerie's cruelest trials, Brukk broke his collar and stood in the doorway while the smaller experiments escaped. He has never learned to stop guarding it.",
      "image_url": "/api/static/champions/shellback_brukk.png",
      "id": "shellback_brukk",
      "color": "green",
      "source_image": "/api/static/champions/shellback_brukk.png",
      "portrait": "assets/champions/shellback_brukk.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "guard",
            2
          ],
          [
            "shield",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "the_mutant",
    "name": "The Abyss Mutant",
    "before": {
      "template_id": "the_mutant",
      "name": "The Abyss Mutant",
      "title": "Laboratory's Favorite Mistake",
      "rarity": "common",
      "faction": "chymera",
      "role": "attack",
      "hp": 765,
      "atk": 487,
      "def": 420,
      "ability_name": "Adaptive Evolution",
      "lore": "They numbered the failures. This one ate the chalkboard and walked out wearing a new name.",
      "image_url": "/api/static/champions/hero-34.png",
      "id": "the_mutant",
      "color": "green",
      "source_image": "/api/static/champions/hero-34.png",
      "portrait": "assets/champions/the_mutant.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Adaptive Evolution",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.41,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "dec_def",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 241% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "the_mutant",
      "name": "The Abyss Mutant",
      "title": "Laboratory's Favorite Mistake",
      "rarity": "common",
      "faction": "chymera",
      "role": "attack",
      "hp": 840,
      "atk": 100,
      "def": 75,
      "spd": 100,
      "ability_name": "Adaptive Evolution",
      "ability_desc": "An adaptive, mutating strike that caves in the foe's guard for a round.",
      "lore": "They numbered the failures. This one ate the chalkboard and walked out wearing a new name.",
      "image_url": "/api/static/champions/hero-34.png",
      "id": "the_mutant",
      "color": "green",
      "source_image": "/api/static/champions/hero-34.png",
      "portrait": "assets/champions/the_mutant.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "dec_def",
            1
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "the_mutant",
      "name": "The Abyss Mutant",
      "title": "Laboratory's Favorite Mistake",
      "rarity": "rare",
      "faction": "chymera",
      "role": "attack",
      "hp": 1028,
      "atk": 678,
      "def": 546,
      "ability_name": "Adaptive Evolution",
      "lore": "They numbered the failures. This one ate the chalkboard and walked out wearing a new name.",
      "image_url": "/api/static/champions/hero-34.png",
      "id": "the_mutant",
      "color": "green",
      "source_image": "/api/static/champions/hero-34.png",
      "portrait": "assets/champions/the_mutant.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Adaptive Evolution",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.63,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "dec_def",
                "turns": 2,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 263% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "the_mutant",
      "name": "The Abyss Mutant",
      "title": "Laboratory's Favorite Mistake",
      "rarity": "rare",
      "faction": "chymera",
      "role": "attack",
      "hp": 1028,
      "atk": 678,
      "def": 546,
      "spd": 100,
      "ability_name": "Adaptive Evolution",
      "ability_desc": "Deal 263% ATK damage to selected enemy.",
      "lore": "They numbered the failures. This one ate the chalkboard and walked out wearing a new name.",
      "image_url": "/api/static/champions/hero-34.png",
      "id": "the_mutant",
      "color": "green",
      "source_image": "/api/static/champions/hero-34.png",
      "portrait": "assets/champions/the_mutant.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "dec_def",
            2
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "vinestrider",
    "name": "Vinestrider",
    "before": {
      "template_id": "vinestrider",
      "name": "Vinestrider",
      "title": "Many Eyes, No Face",
      "rarity": "common",
      "faction": "wildgrove",
      "role": "attack",
      "hp": 730,
      "atk": 495,
      "def": 426,
      "ability_name": "Stranglehold",
      "lore": "Wardens swear she was a child once. The vines disagree — they remember only hunger and green light.",
      "image_url": "/api/static/champions/hero-44.png",
      "id": "vinestrider",
      "color": "blue",
      "source_image": "/api/static/champions/hero-44.png",
      "portrait": "assets/champions/vinestrider.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Stranglehold",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.41,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "poison",
                "turns": 3,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 241% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "vinestrider",
      "name": "Vinestrider",
      "title": "Many Eyes, No Face",
      "rarity": "common",
      "faction": "wildgrove",
      "role": "attack",
      "hp": 750,
      "atk": 108,
      "def": 60,
      "spd": 116,
      "ability_name": "Stranglehold",
      "ability_desc": "A strangling vine-lash that works poison into the wound for three rounds.",
      "lore": "Wardens swear she was a child once. The vines disagree — they remember only hunger and green light.",
      "image_url": "/api/static/champions/hero-44.png",
      "id": "vinestrider",
      "color": "green",
      "source_image": "/api/static/champions/hero-44.png",
      "portrait": "assets/champions/vinestrider.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "poison",
            3
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "vinestrider",
      "name": "Vinestrider",
      "title": "Many Eyes, No Face",
      "rarity": "rare",
      "faction": "wildgrove",
      "role": "attack",
      "hp": 1028,
      "atk": 678,
      "def": 546,
      "ability_name": "Stranglehold",
      "lore": "Wardens swear she was a child once. The vines disagree — they remember only hunger and green light.",
      "image_url": "/api/static/champions/hero-44.png",
      "id": "vinestrider",
      "color": "blue",
      "source_image": "/api/static/champions/hero-44.png",
      "portrait": "assets/champions/vinestrider.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Stranglehold",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.63,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "poison",
                "turns": 2,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 263% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "vinestrider",
      "name": "Vinestrider",
      "title": "Many Eyes, No Face",
      "rarity": "rare",
      "faction": "wildgrove",
      "role": "attack",
      "hp": 1028,
      "atk": 678,
      "def": 546,
      "spd": 116,
      "ability_name": "Stranglehold",
      "ability_desc": "Deal 263% ATK damage to selected enemy.",
      "lore": "Wardens swear she was a child once. The vines disagree — they remember only hunger and green light.",
      "image_url": "/api/static/champions/hero-44.png",
      "id": "vinestrider",
      "color": "blue",
      "source_image": "/api/static/champions/hero-44.png",
      "portrait": "assets/champions/vinestrider.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "poison",
            2
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "beastmaster_gharn",
    "name": "Beastmaster Gharn",
    "before": {
      "template_id": "beastmaster_gharn",
      "name": "Beastmaster Gharn",
      "title": "Pack-Lord of the Frozen Marrow",
      "rarity": "rare",
      "faction": "frost",
      "role": "attack",
      "hp": 1044,
      "atk": 685,
      "def": 547,
      "ability_name": "Primal Rage",
      "lore": "Gharn does not tame beasts. He bargains in blood and winter, and the pack always collects.",
      "image_url": "/api/static/champions/hero-13.png",
      "id": "beastmaster_gharn",
      "color": "green",
      "source_image": "/api/static/champions/hero-13.png",
      "portrait": "assets/champions/beastmaster_gharn.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Primal Rage",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.63,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "mana_slow",
                "turns": 2,
                "scope": "enemy"
              },
              {
                "id": "burn",
                "turns": 2,
                "scope": "enemy"
              },
              {
                "id": "tile_boost",
                "turns": 2,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 263% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "beastmaster_gharn",
      "name": "Beastmaster Gharn",
      "title": "Pack-Lord of the Frozen Marrow",
      "rarity": "rare",
      "faction": "frost",
      "role": "attack",
      "hp": 1200,
      "atk": 175,
      "def": 110,
      "spd": 112,
      "ability_name": "Primal Rage",
      "ability_desc": "A savage strike that sets the foe alight for two rounds.",
      "lore": "Gharn does not tame beasts. He bargains in blood and winter, and the pack always collects.",
      "image_url": "/api/static/champions/hero-13.png",
      "id": "beastmaster_gharn",
      "color": "blue",
      "source_image": "/api/static/champions/hero-13.png",
      "portrait": "assets/champions/beastmaster_gharn.webp",
      "kit": {
        "a2": [
          [
            "dec_spd",
            2
          ]
        ],
        "a3": [
          [
            "burn",
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "beastmaster_gharn",
      "name": "Beastmaster Gharn",
      "title": "Pack-Lord of the Frozen Marrow",
      "rarity": "common",
      "faction": "frost",
      "role": "attack",
      "hp": 733,
      "atk": 522,
      "def": 413,
      "ability_name": "Primal Rage",
      "lore": "Gharn does not tame beasts. He bargains in blood and winter, and the pack always collects.",
      "image_url": "/api/static/champions/hero-13.png",
      "id": "beastmaster_gharn",
      "color": "green",
      "source_image": "/api/static/champions/hero-13.png",
      "portrait": "assets/champions/beastmaster_gharn.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Primal Rage",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.1,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "mana_slow",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 210% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "beastmaster_gharn",
      "name": "Beastmaster Gharn",
      "title": "Pack-Lord of the Frozen Marrow",
      "rarity": "common",
      "faction": "frost",
      "role": "attack",
      "hp": 733,
      "atk": 522,
      "def": 413,
      "spd": 112,
      "ability_name": "Primal Rage",
      "ability_desc": "Deal 210% ATK damage to selected enemy.",
      "lore": "Gharn does not tame beasts. He bargains in blood and winter, and the pack always collects.",
      "image_url": "/api/static/champions/hero-13.png",
      "id": "beastmaster_gharn",
      "color": "green",
      "source_image": "/api/static/champions/hero-13.png",
      "portrait": "assets/champions/beastmaster_gharn.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "mana_slow",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "camel_rider_rashid",
    "name": "Camel-Rider Rashid",
    "before": {
      "template_id": "camel_rider_rashid",
      "name": "Camel-Rider Rashid",
      "title": "Thunder Across the Salt Flats",
      "rarity": "rare",
      "faction": "duneriders",
      "role": "attack",
      "hp": 1050,
      "atk": 703,
      "def": 549,
      "ability_name": "Sandstorm Volley",
      "lore": "Rashid measures distance in heartbeats and graves. His camel has never lost a race with death.",
      "image_url": "/api/static/champions/hero-23.png",
      "id": "camel_rider_rashid",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-23.png",
      "portrait": "assets/champions/camel_rider_rashid.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Sandstorm Volley",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.63,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": true,
            "effects": [
              {
                "id": "mana_slow",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 263% ATK damage to selected enemy, ignoring 25% of DEF."
    },
    "sourceBefore": {
      "template_id": "camel_rider_rashid",
      "name": "Camel-Rider Rashid",
      "title": "Thunder Across the Salt Flats",
      "rarity": "rare",
      "faction": "duneriders",
      "role": "attack",
      "hp": 1180,
      "atk": 165,
      "def": 115,
      "spd": 120,
      "ability_name": "Sandstorm Volley",
      "ability_desc": "A mounted shot that finds the seam, ignoring a quarter of the foe's armour.",
      "lore": "Rashid measures distance in heartbeats and graves. His camel has never lost a race with death.",
      "image_url": "/api/static/champions/hero-23.png",
      "id": "camel_rider_rashid",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-23.png",
      "portrait": "assets/champions/camel_rider_rashid.webp",
      "kit": {
        "a2": [
          [
            "dec_spd",
            1
          ]
        ],
        "a3": [
          [
            "ignore_def",
            0
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "camel_rider_rashid",
      "name": "Camel-Rider Rashid",
      "title": "Thunder Across the Salt Flats",
      "rarity": "common",
      "faction": "duneriders",
      "role": "attack",
      "hp": 734,
      "atk": 522,
      "def": 413,
      "ability_name": "Sandstorm Volley",
      "lore": "Rashid measures distance in heartbeats and graves. His camel has never lost a race with death.",
      "image_url": "/api/static/champions/hero-23.png",
      "id": "camel_rider_rashid",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-23.png",
      "portrait": "assets/champions/camel_rider_rashid.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Sandstorm Volley",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.1,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": true,
            "effects": []
          }
        ]
      },
      "ability_desc": "Deal 210% ATK damage to selected enemy, ignoring 25% of DEF."
    },
    "sourceAfter": {
      "template_id": "camel_rider_rashid",
      "name": "Camel-Rider Rashid",
      "title": "Thunder Across the Salt Flats",
      "rarity": "common",
      "faction": "duneriders",
      "role": "attack",
      "hp": 734,
      "atk": 522,
      "def": 413,
      "spd": 120,
      "ability_name": "Sandstorm Volley",
      "ability_desc": "Deal 210% ATK damage to selected enemy, ignoring 25% of DEF.",
      "lore": "Rashid measures distance in heartbeats and graves. His camel has never lost a race with death.",
      "image_url": "/api/static/champions/hero-23.png",
      "id": "camel_rider_rashid",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-23.png",
      "portrait": "assets/champions/camel_rider_rashid.webp",
      "kit": {
        "a2": [],
        "a3": []
      },
      "passive": null
    }
  },
  {
    "id": "cult_zealot",
    "name": "Cult Zealot",
    "before": {
      "template_id": "cult_zealot",
      "name": "Cult Zealot",
      "title": "Willing Knife of the Blood God",
      "rarity": "rare",
      "faction": "umbra",
      "role": "attack",
      "hp": 1046,
      "atk": 704,
      "def": 565,
      "ability_name": "Mass Consecration",
      "lore": "He offered himself first. The god accepted, then asked for everyone else.",
      "image_url": "/api/static/champions/hero-17.png",
      "id": "cult_zealot",
      "color": "purple",
      "source_image": "/api/static/champions/hero-17.png",
      "portrait": "assets/champions/cult_zealot.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Mass Consecration",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.63,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "weaken",
                "turns": 2,
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
      "ability_desc": "Deal 263% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "cult_zealot",
      "name": "Cult Zealot",
      "title": "Willing Knife of the Blood God",
      "rarity": "rare",
      "faction": "umbra",
      "role": "attack",
      "hp": 1180,
      "atk": 169,
      "def": 105,
      "spd": 110,
      "ability_name": "Mass Consecration",
      "ability_desc": "A fanatic's consecration — the foe is sealed off from any blessing for two rounds.",
      "lore": "He offered himself first. The god accepted, then asked for everyone else.",
      "image_url": "/api/static/champions/hero-17.png",
      "id": "cult_zealot",
      "color": "purple",
      "source_image": "/api/static/champions/hero-17.png",
      "portrait": "assets/champions/cult_zealot.webp",
      "kit": {
        "a2": [
          [
            "weaken",
            2
          ]
        ],
        "a3": [
          [
            "block_buffs",
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "cult_zealot",
      "name": "Cult Zealot",
      "title": "Willing Knife of the Blood God",
      "rarity": "common",
      "faction": "umbra",
      "role": "attack",
      "hp": 733,
      "atk": 522,
      "def": 413,
      "ability_name": "Mass Consecration",
      "lore": "He offered himself first. The god accepted, then asked for everyone else.",
      "image_url": "/api/static/champions/hero-17.png",
      "id": "cult_zealot",
      "color": "purple",
      "source_image": "/api/static/champions/hero-17.png",
      "portrait": "assets/champions/cult_zealot.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Mass Consecration",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.1,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "block_buffs",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 210% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "cult_zealot",
      "name": "Cult Zealot",
      "title": "Willing Knife of the Blood God",
      "rarity": "common",
      "faction": "umbra",
      "role": "attack",
      "hp": 733,
      "atk": 522,
      "def": 413,
      "spd": 110,
      "ability_name": "Mass Consecration",
      "ability_desc": "Deal 210% ATK damage to selected enemy.",
      "lore": "He offered himself first. The god accepted, then asked for everyone else.",
      "image_url": "/api/static/champions/hero-17.png",
      "id": "cult_zealot",
      "color": "purple",
      "source_image": "/api/static/champions/hero-17.png",
      "portrait": "assets/champions/cult_zealot.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "block_buffs",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "desert_assassin",
    "name": "Desert Assassin",
    "before": {
      "template_id": "desert_assassin",
      "name": "Desert Assassin",
      "title": "Mirage with a Knife",
      "rarity": "rare",
      "faction": "duneriders",
      "role": "attack",
      "hp": 982,
      "atk": 705,
      "def": 547,
      "ability_name": "Death Mirage",
      "lore": "You see heat shimmer. You feel a cut. By the time you understand both were her, she is already gone.",
      "image_url": "/api/static/champions/hero-22.png",
      "id": "desert_assassin",
      "color": "purple",
      "source_image": "/api/static/champions/hero-22.png",
      "portrait": "assets/champions/desert_assassin.webp",
      "passive": null,
      "manaSpeed": "fast",
      "special": {
        "name": "Death Mirage",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "enemy",
            "damage": 2.13,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": true,
            "effects": [
              {
                "id": "mana_slow",
                "turns": 3,
                "scope": "enemy"
              },
              {
                "id": "dispel",
                "turns": 0,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 213% ATK damage to selected enemy, ignoring 25% of DEF."
    },
    "sourceBefore": {
      "template_id": "desert_assassin",
      "name": "Desert Assassin",
      "title": "Mirage with a Knife",
      "rarity": "rare",
      "faction": "duneriders",
      "role": "attack",
      "hp": 1100,
      "atk": 182,
      "def": 88,
      "spd": 130,
      "ability_name": "Death Mirage",
      "ability_desc": "A lethal strike slipped under the plate, ignoring a quarter of the foe's armour.",
      "lore": "You see heat shimmer. You feel a cut. By the time you understand both were her, she is already gone.",
      "image_url": "/api/static/champions/hero-22.png",
      "id": "desert_assassin",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-22.png",
      "portrait": "assets/champions/desert_assassin.webp",
      "kit": {
        "a2": [
          [
            "dec_spd",
            3
          ]
        ],
        "a3": [
          [
            "ignore_def",
            0
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "desert_assassin",
      "name": "Desert Assassin",
      "title": "Mirage with a Knife",
      "rarity": "common",
      "faction": "duneriders",
      "role": "attack",
      "hp": 734,
      "atk": 522,
      "def": 413,
      "ability_name": "Death Mirage",
      "lore": "You see heat shimmer. You feel a cut. By the time you understand both were her, she is already gone.",
      "image_url": "/api/static/champions/hero-22.png",
      "id": "desert_assassin",
      "color": "red",
      "source_image": "/api/static/champions/hero-22.png",
      "portrait": "assets/champions/desert_assassin.webp",
      "passive": null,
      "manaSpeed": "fast",
      "special": {
        "name": "Death Mirage",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "enemy",
            "damage": 1.9,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": true,
            "effects": []
          }
        ]
      },
      "ability_desc": "Deal 190% ATK damage to selected enemy, ignoring 25% of DEF."
    },
    "sourceAfter": {
      "template_id": "desert_assassin",
      "name": "Desert Assassin",
      "title": "Mirage with a Knife",
      "rarity": "common",
      "faction": "duneriders",
      "role": "attack",
      "hp": 734,
      "atk": 522,
      "def": 413,
      "spd": 130,
      "ability_name": "Death Mirage",
      "ability_desc": "Deal 190% ATK damage to selected enemy, ignoring 25% of DEF.",
      "lore": "You see heat shimmer. You feel a cut. By the time you understand both were her, she is already gone.",
      "image_url": "/api/static/champions/hero-22.png",
      "id": "desert_assassin",
      "color": "red",
      "source_image": "/api/static/champions/hero-22.png",
      "portrait": "assets/champions/desert_assassin.webp",
      "kit": {
        "a2": [],
        "a3": []
      },
      "passive": null
    }
  },
  {
    "id": "grove_druid",
    "name": "Grove Druid",
    "before": {
      "template_id": "grove_druid",
      "name": "Grove Druid",
      "title": "Speaker for the Green Choir",
      "rarity": "rare",
      "faction": "wildgrove",
      "role": "support",
      "hp": 1092,
      "atk": 596,
      "def": 614,
      "ability_name": "Call of the Wild",
      "lore": "He does not command the forest. He asks, and the forest answers with teeth.",
      "image_url": "/api/static/champions/hero-12.png",
      "id": "grove_druid",
      "color": "green",
      "source_image": "/api/static/champions/hero-12.png",
      "portrait": "assets/champions/grove_druid.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Call of the Wild",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "self",
            "damage": 1.03,
            "healing": 0.32,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "inc_def",
                "turns": 1,
                "scope": "allies"
              },
              {
                "id": "poison",
                "turns": 2,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 32% max HP to all living allies. Deal 103% ATK damage to lowest-hp living enemy."
    },
    "sourceBefore": {
      "template_id": "grove_druid",
      "name": "Grove Druid",
      "title": "Speaker for the Green Choir",
      "rarity": "rare",
      "faction": "wildgrove",
      "role": "support",
      "hp": 1140,
      "atk": 145,
      "def": 125,
      "spd": 112,
      "ability_name": "Call of the Wild",
      "ability_desc": "Calls the spirit storm — it mends the chosen ally while the struck foe rots with poison for two rounds.",
      "lore": "He does not command the forest. He asks, and the forest answers with teeth.",
      "image_url": "/api/static/champions/hero-12.png",
      "id": "grove_druid",
      "color": "green",
      "source_image": "/api/static/champions/hero-12.png",
      "portrait": "assets/champions/grove_druid.webp",
      "kit": {
        "a2": [
          [
            "inc_def",
            1
          ]
        ],
        "a3": [
          [
            "poison",
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "grove_druid",
      "name": "Grove Druid",
      "title": "Speaker for the Green Choir",
      "rarity": "common",
      "faction": "wildgrove",
      "role": "support",
      "hp": 833,
      "atk": 412,
      "def": 473,
      "ability_name": "Call of the Wild",
      "lore": "He does not command the forest. He asks, and the forest answers with teeth.",
      "image_url": "/api/static/champions/hero-12.png",
      "id": "grove_druid",
      "color": "green",
      "source_image": "/api/static/champions/hero-12.png",
      "portrait": "assets/champions/grove_druid.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Call of the Wild",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "ally",
            "damage": 0,
            "healing": 0.28,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "inc_def",
                "turns": 1,
                "scope": "ally"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 28% max HP to one living ally."
    },
    "sourceAfter": {
      "template_id": "grove_druid",
      "name": "Grove Druid",
      "title": "Speaker for the Green Choir",
      "rarity": "common",
      "faction": "wildgrove",
      "role": "support",
      "hp": 833,
      "atk": 412,
      "def": 473,
      "spd": 112,
      "ability_name": "Call of the Wild",
      "ability_desc": "Restore 28% max HP to one living ally.",
      "lore": "He does not command the forest. He asks, and the forest answers with teeth.",
      "image_url": "/api/static/champions/hero-12.png",
      "id": "grove_druid",
      "color": "green",
      "source_image": "/api/static/champions/hero-12.png",
      "portrait": "assets/champions/grove_druid.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "inc_def",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "ironwall_sniper",
    "name": "Ironwall Sniper",
    "before": {
      "template_id": "ironwall_sniper",
      "name": "Ironwall Sniper",
      "title": "Steam-Rifled Judgment",
      "rarity": "rare",
      "faction": "ironclad",
      "role": "attack",
      "hp": 1019,
      "atk": 699,
      "def": 557,
      "ability_name": "Railgun Overture",
      "lore": "Distance is a kindness he refuses to offer. The rifle speaks first; apologies never follow.",
      "image_url": "/api/static/champions/hero-9.png",
      "id": "ironwall_sniper",
      "color": "blue",
      "source_image": "/api/static/champions/hero-9.png",
      "portrait": "assets/champions/ironwall_sniper.webp",
      "passive": null,
      "manaSpeed": "charging",
      "special": {
        "name": "Railgun Overture",
        "charging": true,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "enemy",
            "damage": 1.79,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "mana_slow",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          },
          {
            "level": 2,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.63,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "mana_slow",
                "turns": 2,
                "scope": "enemy"
              },
              {
                "id": "dec_def",
                "turns": 2,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 263% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "ironwall_sniper",
      "name": "Ironwall Sniper",
      "title": "Steam-Rifled Judgment",
      "rarity": "rare",
      "faction": "ironclad",
      "role": "attack",
      "hp": 1072,
      "atk": 178,
      "def": 95,
      "spd": 118,
      "ability_name": "Railgun Overture",
      "ability_desc": "A single armor-breaking shot that leaves the target soft for two rounds.",
      "lore": "Distance is a kindness he refuses to offer. The rifle speaks first; apologies never follow.",
      "image_url": "/api/static/champions/hero-9.png",
      "id": "ironwall_sniper",
      "color": "blue",
      "source_image": "/api/static/champions/hero-9.png",
      "portrait": "assets/champions/ironwall_sniper.webp",
      "kit": {
        "a2": [
          [
            "dec_spd",
            2
          ]
        ],
        "a3": [
          [
            "dec_def",
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "ironwall_sniper",
      "name": "Ironwall Sniper",
      "title": "Steam-Rifled Judgment",
      "rarity": "common",
      "faction": "ironclad",
      "role": "attack",
      "hp": 733,
      "atk": 522,
      "def": 413,
      "ability_name": "Railgun Overture",
      "lore": "Distance is a kindness he refuses to offer. The rifle speaks first; apologies never follow.",
      "image_url": "/api/static/champions/hero-9.png",
      "id": "ironwall_sniper",
      "color": "blue",
      "source_image": "/api/static/champions/hero-9.png",
      "portrait": "assets/champions/ironwall_sniper.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Railgun Overture",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.1,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "mana_slow",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 210% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "ironwall_sniper",
      "name": "Ironwall Sniper",
      "title": "Steam-Rifled Judgment",
      "rarity": "common",
      "faction": "ironclad",
      "role": "attack",
      "hp": 733,
      "atk": 522,
      "def": 413,
      "spd": 118,
      "ability_name": "Railgun Overture",
      "ability_desc": "Deal 210% ATK damage to selected enemy.",
      "lore": "Distance is a kindness he refuses to offer. The rifle speaks first; apologies never follow.",
      "image_url": "/api/static/champions/hero-9.png",
      "id": "ironwall_sniper",
      "color": "blue",
      "source_image": "/api/static/champions/hero-9.png",
      "portrait": "assets/champions/ironwall_sniper.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "mana_slow",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "jade_monk_xuan",
    "name": "Jade Monk Xuan",
    "before": {
      "template_id": "jade_monk_xuan",
      "name": "Jade Monk Xuan",
      "title": "Fist That Weathered Dynasties",
      "rarity": "rare",
      "faction": "dragondynasty",
      "role": "defense",
      "hp": 1222,
      "atk": 545,
      "def": 687,
      "ability_name": "Celestial Roar",
      "lore": "Xuan does not block the blow. He becomes the mountain the blow regrets meeting.",
      "image_url": "/api/static/champions/hero-38.png",
      "id": "jade_monk_xuan",
      "color": "green",
      "source_image": "/api/static/champions/hero-38.png",
      "portrait": "assets/champions/jade_monk_xuan.webp",
      "passive": null,
      "manaSpeed": "charging",
      "special": {
        "name": "Celestial Roar",
        "charging": true,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "enemy",
            "damage": 1.02,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "heal",
                "turns": 1,
                "scope": "self"
              }
            ]
          },
          {
            "level": 2,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.5,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "heal",
                "turns": 2,
                "scope": "self"
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
      "ability_desc": "Deal 150% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "jade_monk_xuan",
      "name": "Jade Monk Xuan",
      "title": "Fist That Weathered Dynasties",
      "rarity": "rare",
      "faction": "dragondynasty",
      "role": "defense",
      "hp": 1370,
      "atk": 140,
      "def": 168,
      "spd": 88,
      "ability_name": "Celestial Roar",
      "ability_desc": "A chi-shockwave that leaves the struck foe able to attack nothing but Xuan for two rounds.",
      "lore": "Xuan does not block the blow. He becomes the mountain the blow regrets meeting.",
      "image_url": "/api/static/champions/hero-38.png",
      "id": "jade_monk_xuan",
      "color": "red",
      "source_image": "/api/static/champions/hero-38.png",
      "portrait": "assets/champions/jade_monk_xuan.webp",
      "kit": {
        "a2": [
          [
            "heal",
            2
          ]
        ],
        "a3": [
          [
            "taunt",
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "jade_monk_xuan",
      "name": "Jade Monk Xuan",
      "title": "Fist That Weathered Dynasties",
      "rarity": "common",
      "faction": "dragondynasty",
      "role": "defense",
      "hp": 934,
      "atk": 382,
      "def": 538,
      "ability_name": "Celestial Roar",
      "lore": "Xuan does not block the blow. He becomes the mountain the blow regrets meeting.",
      "image_url": "/api/static/champions/hero-38.png",
      "id": "jade_monk_xuan",
      "color": "green",
      "source_image": "/api/static/champions/hero-38.png",
      "portrait": "assets/champions/jade_monk_xuan.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Celestial Roar",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.3,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "heal",
                "turns": 1,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 130% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "jade_monk_xuan",
      "name": "Jade Monk Xuan",
      "title": "Fist That Weathered Dynasties",
      "rarity": "common",
      "faction": "dragondynasty",
      "role": "defense",
      "hp": 934,
      "atk": 382,
      "def": 538,
      "spd": 88,
      "ability_name": "Celestial Roar",
      "ability_desc": "Deal 130% ATK damage to selected enemy.",
      "lore": "Xuan does not block the blow. He becomes the mountain the blow regrets meeting.",
      "image_url": "/api/static/champions/hero-38.png",
      "id": "jade_monk_xuan",
      "color": "green",
      "source_image": "/api/static/champions/hero-38.png",
      "portrait": "assets/champions/jade_monk_xuan.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "heal",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "neon_glitch_weaver",
    "name": "Nadia, the Patchwork Witch",
    "before": {
      "template_id": "neon_glitch_weaver",
      "name": "Nadia, the Patchwork Witch",
      "title": "Splicer of Broken Codes",
      "rarity": "rare",
      "faction": "neon_syndicate",
      "role": "support",
      "hp": 1092,
      "atk": 568,
      "def": 599,
      "ability_name": "Signal Jam",
      "lore": "Nadia hotwires the ancient runes left in the dirt, mixing dark fantasy witchcraft with broken neon tech.",
      "image_url": "/api/static/champions/neon_glitchweaver.png",
      "id": "neon_glitch_weaver",
      "color": "purple",
      "source_image": "/api/static/champions/neon_glitchweaver.png",
      "portrait": "assets/champions/neon_glitch_weaver.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Signal Jam",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "self",
            "damage": 0,
            "healing": 0.32,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "mana_surge",
                "turns": 3,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 32% max HP to all living allies."
    },
    "sourceBefore": {
      "template_id": "neon_glitch_weaver",
      "name": "Nadia, the Patchwork Witch",
      "title": "Splicer of Broken Codes",
      "rarity": "rare",
      "faction": "neon_syndicate",
      "role": "support",
      "hp": 790,
      "atk": 100,
      "def": 75,
      "spd": 104,
      "ability_name": "Signal Jam",
      "ability_desc": "A patchwork pulse — the whole warband runs faster for three rounds.",
      "lore": "Nadia hotwires the ancient runes left in the dirt, mixing dark fantasy witchcraft with broken neon tech.",
      "image_url": "/api/static/champions/neon_glitchweaver.png",
      "id": "neon_glitch_weaver",
      "color": "yellow",
      "source_image": "/api/static/champions/neon_glitchweaver.png",
      "portrait": "assets/champions/neon_glitch_weaver.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "inc_spd",
            3
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "neon_glitch_weaver",
      "name": "Nadia, the Patchwork Witch",
      "title": "Splicer of Broken Codes",
      "rarity": "common",
      "faction": "neon_syndicate",
      "role": "support",
      "hp": 834,
      "atk": 411,
      "def": 473,
      "ability_name": "Signal Jam",
      "lore": "Nadia hotwires the ancient runes left in the dirt, mixing dark fantasy witchcraft with broken neon tech.",
      "image_url": "/api/static/champions/neon_glitchweaver.png",
      "id": "neon_glitch_weaver",
      "color": "blue",
      "source_image": "/api/static/champions/neon_glitchweaver.png",
      "portrait": "assets/champions/neon_glitch_weaver.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Signal Jam",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "ally",
            "damage": 0,
            "healing": 0.28,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "mana_surge",
                "turns": 1,
                "scope": "ally"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 28% max HP to one living ally."
    },
    "sourceAfter": {
      "template_id": "neon_glitch_weaver",
      "name": "Nadia, the Patchwork Witch",
      "title": "Splicer of Broken Codes",
      "rarity": "common",
      "faction": "neon_syndicate",
      "role": "support",
      "hp": 834,
      "atk": 411,
      "def": 473,
      "spd": 104,
      "ability_name": "Signal Jam",
      "ability_desc": "Restore 28% max HP to one living ally.",
      "lore": "Nadia hotwires the ancient runes left in the dirt, mixing dark fantasy witchcraft with broken neon tech.",
      "image_url": "/api/static/champions/neon_glitchweaver.png",
      "id": "neon_glitch_weaver",
      "color": "blue",
      "source_image": "/api/static/champions/neon_glitchweaver.png",
      "portrait": "assets/champions/neon_glitch_weaver.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "mana_surge",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "paladin_of_dusk",
    "name": "Paladin of Dusk",
    "before": {
      "template_id": "paladin_of_dusk",
      "name": "Paladin of Dusk",
      "title": "Keeper of the Horizon Vow",
      "rarity": "rare",
      "faction": "ironclad",
      "role": "defense",
      "hp": 1215,
      "atk": 541,
      "def": 685,
      "ability_name": "Last Rites",
      "lore": "Born as the sun kissed the horizon, he walks forever in that knife-thin hour — cursed to guard it, blessed to endure it.",
      "image_url": "/api/static/champions/hero-2.png",
      "id": "paladin_of_dusk",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-2.png",
      "portrait": "assets/champions/paladin_of_dusk.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Last Rites",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.5,
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
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 150% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "paladin_of_dusk",
      "name": "Paladin of Dusk",
      "title": "Keeper of the Horizon Vow",
      "rarity": "rare",
      "faction": "ironclad",
      "role": "defense",
      "hp": 1380,
      "atk": 145,
      "def": 165,
      "spd": 78,
      "ability_name": "Last Rites",
      "ability_desc": "Spends a fragment of his own life to crush one foe, and stands behind a dusk-shield for a round.",
      "lore": "Born as the sun kissed the horizon, he walks forever in that knife-thin hour — cursed to guard it, blessed to endure it.",
      "image_url": "/api/static/champions/hero-2.png",
      "id": "paladin_of_dusk",
      "color": "blue",
      "source_image": "/api/static/champions/hero-2.png",
      "portrait": "assets/champions/paladin_of_dusk.webp",
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
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "paladin_of_dusk",
      "name": "Paladin of Dusk",
      "title": "Keeper of the Horizon Vow",
      "rarity": "common",
      "faction": "ironclad",
      "role": "defense",
      "hp": 933,
      "atk": 382,
      "def": 537,
      "ability_name": "Last Rites",
      "lore": "Born as the sun kissed the horizon, he walks forever in that knife-thin hour — cursed to guard it, blessed to endure it.",
      "image_url": "/api/static/champions/hero-2.png",
      "id": "paladin_of_dusk",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-2.png",
      "portrait": "assets/champions/paladin_of_dusk.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Last Rites",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.3,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "strengthen",
                "turns": 1,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 130% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "paladin_of_dusk",
      "name": "Paladin of Dusk",
      "title": "Keeper of the Horizon Vow",
      "rarity": "common",
      "faction": "ironclad",
      "role": "defense",
      "hp": 933,
      "atk": 382,
      "def": 537,
      "spd": 78,
      "ability_name": "Last Rites",
      "ability_desc": "Deal 130% ATK damage to selected enemy.",
      "lore": "Born as the sun kissed the horizon, he walks forever in that knife-thin hour — cursed to guard it, blessed to endure it.",
      "image_url": "/api/static/champions/hero-2.png",
      "id": "paladin_of_dusk",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-2.png",
      "portrait": "assets/champions/paladin_of_dusk.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "strengthen",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "sister_seraphel",
    "name": "Sister Seraphel",
    "before": {
      "template_id": "sister_seraphel",
      "name": "Sister Seraphel",
      "title": "Hymnist of the Liminal Choir",
      "rarity": "rare",
      "faction": "frost",
      "role": "support",
      "hp": 1145,
      "atk": 575,
      "def": 599,
      "ability_name": "Resurrection Hymn",
      "lore": "From an icebound sanctuary, Sister Seraphel leads the Frost's Liminal Choir. Her hymns carry across the northern wastes, guiding lost warriors home and lending strength to those who stand against the winter.",
      "image_url": "/api/static/champions/hero-3.png",
      "id": "sister_seraphel",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-3.png",
      "portrait": "assets/champions/sister_seraphel.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Resurrection Hymn",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "self",
            "damage": 0,
            "healing": 0.32,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "heal",
                "turns": 2,
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
      "ability_desc": "Restore 32% max HP to all living allies."
    },
    "sourceBefore": {
      "template_id": "sister_seraphel",
      "name": "Sister Seraphel",
      "title": "Hymnist of the Liminal Choir",
      "rarity": "rare",
      "faction": "frost",
      "role": "support",
      "hp": 1140,
      "atk": 140,
      "def": 110,
      "spd": 118,
      "ability_name": "Resurrection Hymn",
      "ability_desc": "A hymn raised over the warband — a mend for the chosen ally and 15% less damage taken by every ally for two rounds.",
      "lore": "From an icebound sanctuary, Sister Seraphel leads the Frost's Liminal Choir. Her hymns carry across the northern wastes, guiding lost warriors home and lending strength to those who stand against the winter.",
      "image_url": "/api/static/champions/hero-3.png",
      "id": "sister_seraphel",
      "color": "blue",
      "source_image": "/api/static/champions/hero-3.png",
      "portrait": "assets/champions/sister_seraphel.webp",
      "kit": {
        "a2": [
          [
            "heal",
            2
          ]
        ],
        "a3": [
          [
            "strengthen",
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "sister_seraphel",
      "name": "Sister Seraphel",
      "title": "Hymnist of the Liminal Choir",
      "rarity": "common",
      "faction": "frost",
      "role": "support",
      "hp": 833,
      "atk": 412,
      "def": 472,
      "ability_name": "Sheltering Hymn",
      "lore": "From an icebound sanctuary, Sister Seraphel leads the Frost's Liminal Choir. Her hymns carry across the northern wastes, guiding lost warriors home and lending strength to those who stand against the winter.",
      "image_url": "/api/static/champions/hero-3.png",
      "id": "sister_seraphel",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-3.png",
      "portrait": "assets/champions/sister_seraphel.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Sheltering Hymn",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "ally",
            "damage": 0,
            "healing": 0.28,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "strengthen",
                "turns": 1,
                "scope": "ally"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 28% max HP to one living ally."
    },
    "sourceAfter": {
      "template_id": "sister_seraphel",
      "name": "Sister Seraphel",
      "title": "Hymnist of the Liminal Choir",
      "rarity": "common",
      "faction": "frost",
      "role": "support",
      "hp": 833,
      "atk": 412,
      "def": 472,
      "spd": 118,
      "ability_name": "Sheltering Hymn",
      "ability_desc": "Restore 28% max HP to one living ally.",
      "lore": "From an icebound sanctuary, Sister Seraphel leads the Frost's Liminal Choir. Her hymns carry across the northern wastes, guiding lost warriors home and lending strength to those who stand against the winter.",
      "image_url": "/api/static/champions/hero-3.png",
      "id": "sister_seraphel",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-3.png",
      "portrait": "assets/champions/sister_seraphel.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "strengthen",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "spirit_fox_mei",
    "name": "Spirit-Fox Mei",
    "before": {
      "template_id": "spirit_fox_mei",
      "name": "Spirit-Fox Mei",
      "title": "Ninefold Flame in Silk",
      "rarity": "rare",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 1015,
      "atk": 708,
      "def": 558,
      "ability_name": "Nine Tails",
      "lore": "Mei smiles with too many mouths. Only one of them is kind, and it is rarely showing.",
      "image_url": "/api/static/champions/hero-39.png",
      "id": "spirit_fox_mei",
      "color": "green",
      "source_image": "/api/static/champions/hero-39.png",
      "portrait": "assets/champions/spirit_fox_mei.webp",
      "passive": null,
      "manaSpeed": "fast",
      "special": {
        "name": "Nine Tails",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "enemy",
            "damage": 2.37,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "burn",
                "turns": 3,
                "scope": "enemy"
              },
              {
                "id": "inc_atk",
                "turns": 2,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 237% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "spirit_fox_mei",
      "name": "Spirit-Fox Mei",
      "title": "Ninefold Flame in Silk",
      "rarity": "rare",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 1181,
      "atk": 172,
      "def": 100,
      "spd": 111,
      "ability_name": "Nine Tails",
      "ability_desc": "A flame-dance that lifts Mei's own attack a quarter higher for two rounds.",
      "lore": "Mei smiles with too many mouths. Only one of them is kind, and it is rarely showing.",
      "image_url": "/api/static/champions/hero-39.png",
      "id": "spirit_fox_mei",
      "color": "red",
      "source_image": "/api/static/champions/hero-39.png",
      "portrait": "assets/champions/spirit_fox_mei.webp",
      "kit": {
        "a2": [
          [
            "burn",
            3
          ]
        ],
        "a3": [
          [
            "inc_atk",
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "spirit_fox_mei",
      "name": "Spirit-Fox Mei",
      "title": "Ninefold Flame in Silk",
      "rarity": "common",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 734,
      "atk": 521,
      "def": 413,
      "ability_name": "Nine Tails",
      "lore": "Mei smiles with too many mouths. Only one of them is kind, and it is rarely showing.",
      "image_url": "/api/static/champions/hero-39.png",
      "id": "spirit_fox_mei",
      "color": "green",
      "source_image": "/api/static/champions/hero-39.png",
      "portrait": "assets/champions/spirit_fox_mei.webp",
      "passive": null,
      "manaSpeed": "fast",
      "special": {
        "name": "Nine Tails",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "enemy",
            "damage": 1.9,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "burn",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 190% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "spirit_fox_mei",
      "name": "Spirit-Fox Mei",
      "title": "Ninefold Flame in Silk",
      "rarity": "common",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 734,
      "atk": 521,
      "def": 413,
      "spd": 111,
      "ability_name": "Nine Tails",
      "ability_desc": "Deal 190% ATK damage to selected enemy.",
      "lore": "Mei smiles with too many mouths. Only one of them is kind, and it is rarely showing.",
      "image_url": "/api/static/champions/hero-39.png",
      "id": "spirit_fox_mei",
      "color": "green",
      "source_image": "/api/static/champions/hero-39.png",
      "portrait": "assets/champions/spirit_fox_mei.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "burn",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "succubus_lilth",
    "name": "Succubus Lilth",
    "before": {
      "template_id": "succubus_lilth",
      "name": "Succubus Lilth",
      "title": "Smile That Empties the Vein",
      "rarity": "rare",
      "faction": "umbra",
      "role": "attack",
      "hp": 955,
      "atk": 681,
      "def": 534,
      "ability_name": "Dark Embrace",
      "lore": "Lilth never hunts the strong. She waits until they beg to be weak.",
      "image_url": "/api/static/champions/hero-19.png",
      "id": "succubus_lilth",
      "color": "purple",
      "source_image": "/api/static/champions/hero-19.png",
      "portrait": "assets/champions/succubus_lilth.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Dark Embrace",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.63,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "block_buffs",
                "turns": 3,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 263% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "succubus_lilth",
      "name": "Succubus Lilth",
      "title": "Smile That Empties the Vein",
      "rarity": "rare",
      "faction": "umbra",
      "role": "attack",
      "hp": 730,
      "atk": 116,
      "def": 58,
      "spd": 114,
      "ability_name": "Dark Embrace",
      "ability_desc": "A seductive strike that leaves the foe unable to accept any blessing for three rounds.",
      "lore": "Lilth never hunts the strong. She waits until they beg to be weak.",
      "image_url": "/api/static/champions/hero-19.png",
      "id": "succubus_lilth",
      "color": "purple",
      "source_image": "/api/static/champions/hero-19.png",
      "portrait": "assets/champions/succubus_lilth.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "block_buffs",
            3
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "succubus_lilth",
      "name": "Succubus Lilth",
      "title": "Smile That Empties the Vein",
      "rarity": "common",
      "faction": "umbra",
      "role": "attack",
      "hp": 733,
      "atk": 522,
      "def": 413,
      "ability_name": "Dark Embrace",
      "lore": "Lilth never hunts the strong. She waits until they beg to be weak.",
      "image_url": "/api/static/champions/hero-19.png",
      "id": "succubus_lilth",
      "color": "red",
      "source_image": "/api/static/champions/hero-19.png",
      "portrait": "assets/champions/succubus_lilth.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Dark Embrace",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.1,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "block_buffs",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 210% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "succubus_lilth",
      "name": "Succubus Lilth",
      "title": "Smile That Empties the Vein",
      "rarity": "common",
      "faction": "umbra",
      "role": "attack",
      "hp": 733,
      "atk": 522,
      "def": 413,
      "spd": 114,
      "ability_name": "Dark Embrace",
      "ability_desc": "Deal 210% ATK damage to selected enemy.",
      "lore": "Lilth never hunts the strong. She waits until they beg to be weak.",
      "image_url": "/api/static/champions/hero-19.png",
      "id": "succubus_lilth",
      "color": "red",
      "source_image": "/api/static/champions/hero-19.png",
      "portrait": "assets/champions/succubus_lilth.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "block_buffs",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "shadow_thrall",
    "name": "The Hooded Thrall",
    "before": {
      "template_id": "shadow_thrall",
      "name": "The Hooded Thrall",
      "title": "Promised Nothing, Paid Everything",
      "rarity": "rare",
      "faction": "umbra",
      "role": "support",
      "hp": 1093,
      "atk": 586,
      "def": 590,
      "ability_name": "Veil Step",
      "lore": "The bargain he made was simple: an end to the pain. The price has yet to be tallied in full.",
      "image_url": "/api/static/champions/shadow_thrall.png",
      "id": "shadow_thrall",
      "color": "purple",
      "source_image": "/api/static/champions/shadow_thrall.png",
      "portrait": "assets/champions/shadow_thrall.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Veil Step",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "self",
            "damage": 0,
            "healing": 0.32,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "inc_def",
                "turns": 1,
                "scope": "allies"
              },
              {
                "id": "heal",
                "turns": 3,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 32% max HP to all living allies."
    },
    "sourceBefore": {
      "template_id": "shadow_thrall",
      "name": "The Hooded Thrall",
      "title": "Promised Nothing, Paid Everything",
      "rarity": "rare",
      "faction": "umbra",
      "role": "support",
      "hp": 1179,
      "atk": 145,
      "def": 105,
      "spd": 107,
      "ability_name": "Veil Step",
      "ability_desc": "Slips through the veil to lay hands on the chosen ally — a lingering mend that threads through the whole warband.",
      "lore": "The bargain he made was simple: an end to the pain. The price has yet to be tallied in full.",
      "image_url": "/api/static/champions/shadow_thrall.png",
      "id": "shadow_thrall",
      "color": "purple",
      "source_image": "/api/static/champions/shadow_thrall.png",
      "portrait": "assets/champions/shadow_thrall.webp",
      "kit": {
        "a2": [
          [
            "inc_def",
            1
          ]
        ],
        "a3": [
          [
            "heal",
            3
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "shadow_thrall",
      "name": "The Hooded Thrall",
      "title": "Promised Nothing, Paid Everything",
      "rarity": "common",
      "faction": "umbra",
      "role": "support",
      "hp": 833,
      "atk": 412,
      "def": 472,
      "ability_name": "Veil Step",
      "lore": "The bargain he made was simple: an end to the pain. The price has yet to be tallied in full.",
      "image_url": "/api/static/champions/shadow_thrall.png",
      "id": "shadow_thrall",
      "color": "blue",
      "source_image": "/api/static/champions/shadow_thrall.png",
      "portrait": "assets/champions/shadow_thrall.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Veil Step",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "ally",
            "damage": 0,
            "healing": 0.28,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "inc_def",
                "turns": 1,
                "scope": "ally"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 28% max HP to one living ally."
    },
    "sourceAfter": {
      "template_id": "shadow_thrall",
      "name": "The Hooded Thrall",
      "title": "Promised Nothing, Paid Everything",
      "rarity": "common",
      "faction": "umbra",
      "role": "support",
      "hp": 833,
      "atk": 412,
      "def": 472,
      "spd": 107,
      "ability_name": "Veil Step",
      "ability_desc": "Restore 28% max HP to one living ally.",
      "lore": "The bargain he made was simple: an end to the pain. The price has yet to be tallied in full.",
      "image_url": "/api/static/champions/shadow_thrall.png",
      "id": "shadow_thrall",
      "color": "blue",
      "source_image": "/api/static/champions/shadow_thrall.png",
      "portrait": "assets/champions/shadow_thrall.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "inc_def",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "dragon_samurai_kenshin",
    "batch": 2,
    "name": "Dragon Samurai Kenshin",
    "before": {
      "template_id": "dragon_samurai_kenshin",
      "name": "Dragon Samurai Kenshin",
      "title": "Blood of the Scale, Edge of the Wind",
      "rarity": "legendary",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 1281,
      "atk": 820,
      "def": 693,
      "ability_name": "Thousand Cuts",
      "lore": "Kenshin's blade is faster than apology. His dragon blood has never learned patience.",
      "image_url": "/api/static/champions/hero-37.png",
      "id": "dragon_samurai_kenshin",
      "color": "red",
      "source_image": "/api/static/champions/hero-37.png",
      "portrait": "assets/champions/dragon_samurai_kenshin.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Thousand Cuts",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.65,
            "healing": 0,
            "healScope": "allies",
            "aoe": true,
            "pierce": false,
            "effects": [
              {
                "id": "burn",
                "turns": 1,
                "scope": "enemies"
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
      "ability_desc": "Deal 165% ATK damage to all living enemies."
    },
    "sourceBefore": {
      "template_id": "dragon_samurai_kenshin",
      "name": "Dragon Samurai Kenshin",
      "title": "Blood of the Scale, Edge of the Wind",
      "rarity": "legendary",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 2169,
      "atk": 319,
      "def": 188,
      "spd": 130,
      "ability_name": "Thousand Cuts",
      "ability_desc": "Blazing cuts across the entire line, and Kenshin answers the next two blows he takes.",
      "lore": "Kenshin's blade is faster than apology. His dragon blood has never learned patience.",
      "image_url": "/api/static/champions/hero-37.png",
      "id": "dragon_samurai_kenshin",
      "color": "red",
      "source_image": "/api/static/champions/hero-37.png",
      "portrait": "assets/champions/dragon_samurai_kenshin.webp",
      "kit": {
        "a2": [
          [
            "burn",
            1
          ]
        ],
        "a3": [
          [
            "aoe",
            0
          ],
          [
            "counterattack",
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "dragon_samurai_kenshin",
      "name": "Dragon Samurai Kenshin",
      "title": "Blood of the Scale, Edge of the Wind",
      "rarity": "rare",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 1020,
      "atk": 690,
      "def": 555,
      "ability_name": "Thousand Cuts",
      "lore": "Kenshin's blade is faster than apology. His dragon blood has never learned patience.",
      "image_url": "/api/static/champions/hero-37.png",
      "id": "dragon_samurai_kenshin",
      "color": "red",
      "source_image": "/api/static/champions/hero-37.png",
      "portrait": "assets/champions/dragon_samurai_kenshin.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Thousand Cuts",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.4,
            "healing": 0,
            "healScope": "allies",
            "aoe": true,
            "pierce": false,
            "effects": [
              {
                "id": "burn",
                "turns": 1,
                "scope": "enemies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 140% ATK damage to all living enemies."
    },
    "sourceAfter": {
      "template_id": "dragon_samurai_kenshin",
      "name": "Dragon Samurai Kenshin",
      "title": "Blood of the Scale, Edge of the Wind",
      "rarity": "rare",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 1020,
      "atk": 690,
      "def": 555,
      "spd": 130,
      "ability_name": "Thousand Cuts",
      "ability_desc": "Deal 140% ATK damage to all living enemies.",
      "lore": "Kenshin's blade is faster than apology. His dragon blood has never learned patience.",
      "image_url": "/api/static/champions/hero-37.png",
      "id": "dragon_samurai_kenshin",
      "color": "red",
      "source_image": "/api/static/champions/hero-37.png",
      "portrait": "assets/champions/dragon_samurai_kenshin.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "burn",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "shade_prince",
    "batch": 2,
    "name": "The Shade Prince",
    "before": {
      "template_id": "shade_prince",
      "name": "The Shade Prince",
      "title": "Crowned in Five Cold Flames",
      "rarity": "legendary",
      "faction": "umbra",
      "role": "attack",
      "hp": 1293,
      "atk": 839,
      "def": 688,
      "ability_name": "Coronation of Ash",
      "lore": "He was the youngest of five brothers. The eldest four are the flames that follow him now.",
      "image_url": "/api/static/champions/shade_prince.png",
      "id": "shade_prince",
      "color": "blue",
      "source_image": "/api/static/champions/shade_prince.png",
      "portrait": "assets/champions/shade_prince.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Coronation of Ash",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.8,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": true,
            "effects": [
              {
                "id": "mana_block",
                "turns": 2,
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
      "ability_desc": "Deal 280% ATK damage to selected enemy, ignoring 25% of DEF."
    },
    "sourceBefore": {
      "template_id": "shade_prince",
      "name": "The Shade Prince",
      "title": "Crowned in Five Cold Flames",
      "rarity": "legendary",
      "faction": "umbra",
      "role": "attack",
      "hp": 2080,
      "atk": 342,
      "def": 172,
      "spd": 132,
      "ability_name": "Coronation of Ash",
      "ability_desc": "Shadow-cuts of five dead kings — they ignore a quarter of the foe's armour and seal them off from any blessing for two rounds.",
      "lore": "He was the youngest of five brothers. The eldest four are the flames that follow him now.",
      "image_url": "/api/static/champions/shade_prince.png",
      "id": "shade_prince",
      "color": "purple",
      "source_image": "/api/static/champions/shade_prince.png",
      "portrait": "assets/champions/shade_prince.webp",
      "kit": {
        "a2": [
          [
            "dec_spd",
            3
          ]
        ],
        "a3": [
          [
            "block_buffs",
            2
          ],
          [
            "ignore_def",
            0
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "shade_prince",
      "name": "The Shade Prince",
      "title": "Crowned in Five Cold Flames",
      "rarity": "rare",
      "faction": "umbra",
      "role": "attack",
      "hp": 1010,
      "atk": 710,
      "def": 550,
      "ability_name": "Coronation of Ash",
      "lore": "He was the youngest of five brothers. The eldest four are the flames that follow him now.",
      "image_url": "/api/static/champions/shade_prince.png",
      "id": "shade_prince",
      "color": "blue",
      "source_image": "/api/static/champions/shade_prince.png",
      "portrait": "assets/champions/shade_prince.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Coronation of Ash",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.45,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": true,
            "effects": [
              {
                "id": "mana_block",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 245% ATK damage to selected enemy, ignoring 25% of DEF."
    },
    "sourceAfter": {
      "template_id": "shade_prince",
      "name": "The Shade Prince",
      "title": "Crowned in Five Cold Flames",
      "rarity": "rare",
      "faction": "umbra",
      "role": "attack",
      "hp": 1010,
      "atk": 710,
      "def": 550,
      "spd": 132,
      "ability_name": "Coronation of Ash",
      "ability_desc": "Deal 245% ATK damage to selected enemy, ignoring 25% of DEF.",
      "lore": "He was the youngest of five brothers. The eldest four are the flames that follow him now.",
      "image_url": "/api/static/champions/shade_prince.png",
      "id": "shade_prince",
      "color": "purple",
      "source_image": "/api/static/champions/shade_prince.png",
      "portrait": "assets/champions/shade_prince.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "mana_block",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "chem_tank_brax",
    "batch": 2,
    "name": "Chem-Tank Brax",
    "before": {
      "template_id": "chem_tank_brax",
      "name": "Chem-Tank Brax",
      "title": "Hazmat Heart, Iron Lung",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "defense",
      "hp": 1523,
      "atk": 652,
      "def": 815,
      "ability_name": "Chemical Fortress",
      "lore": "Brax is less a soldier than a walking spill. The plating is the only thing that keeps the spill polite.",
      "image_url": "/api/static/champions/hero-33.png",
      "id": "chem_tank_brax",
      "color": "green",
      "source_image": "/api/static/champions/hero-33.png",
      "portrait": "assets/champions/chem_tank_brax.webp",
      "passive": null,
      "manaSpeed": "slow",
      "special": {
        "name": "Chemical Fortress",
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
                "id": "inc_def",
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
      "template_id": "chem_tank_brax",
      "name": "Chem-Tank Brax",
      "title": "Hazmat Heart, Iron Lung",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "defense",
      "hp": 2471,
      "atk": 235,
      "def": 246,
      "spd": 101,
      "ability_name": "Chemical Fortress",
      "ability_desc": "Seals the chemical fortress — shields settle over the whole warband while the struck foe can attack nothing but Brax for two rounds.",
      "lore": "Brax is less a soldier than a walking spill. The plating is the only thing that keeps the spill polite.",
      "image_url": "/api/static/champions/hero-33.png",
      "id": "chem_tank_brax",
      "color": "blue",
      "source_image": "/api/static/champions/hero-33.png",
      "portrait": "assets/champions/chem_tank_brax.webp",
      "kit": {
        "a2": [
          [
            "inc_def",
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
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "chem_tank_brax",
      "name": "Chem-Tank Brax",
      "title": "Hazmat Heart, Iron Lung",
      "rarity": "rare",
      "faction": "ironclad",
      "role": "defense",
      "hp": 1230,
      "atk": 530,
      "def": 705,
      "ability_name": "Chemical Fortress",
      "lore": "Brax is less a soldier than a walking spill. The plating is the only thing that keeps the spill polite.",
      "image_url": "/api/static/champions/hero-33.png",
      "id": "chem_tank_brax",
      "color": "green",
      "source_image": "/api/static/champions/hero-33.png",
      "portrait": "assets/champions/chem_tank_brax.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Chemical Fortress",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.5,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "guard",
                "turns": 2,
                "scope": "self"
              },
              {
                "id": "shield",
                "turns": 1,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 150% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "chem_tank_brax",
      "name": "Chem-Tank Brax",
      "title": "Hazmat Heart, Iron Lung",
      "rarity": "rare",
      "faction": "ironclad",
      "role": "defense",
      "hp": 1230,
      "atk": 530,
      "def": 705,
      "spd": 101,
      "ability_name": "Chemical Fortress",
      "ability_desc": "Deal 150% ATK damage to selected enemy.",
      "lore": "Brax is less a soldier than a walking spill. The plating is the only thing that keeps the spill polite.",
      "image_url": "/api/static/champions/hero-33.png",
      "id": "chem_tank_brax",
      "color": "blue",
      "source_image": "/api/static/champions/hero-33.png",
      "portrait": "assets/champions/chem_tank_brax.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "guard",
            2
          ],
          [
            "shield",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "plague_doctor",
    "batch": 2,
    "name": "Quill, the Plague Sovereign",
    "before": {
      "template_id": "plague_doctor",
      "name": "Quill, the Plague Sovereign",
      "title": "Black Coat, Brass Beak",
      "rarity": "legendary",
      "faction": "nether",
      "role": "support",
      "hp": 1390,
      "atk": 717,
      "def": 736,
      "ability_name": "Censer of Rot",
      "lore": "He used to cure people. He used to. The mask kept whispering ideas he could not unhear.",
      "image_url": "/api/static/champions/plague_doctor.png",
      "id": "plague_doctor",
      "color": "green",
      "source_image": "/api/static/champions/plague_doctor.png",
      "portrait": "assets/champions/plague_doctor.webp",
      "passive": null,
      "manaSpeed": "very_slow",
      "special": {
        "name": "Censer of Rot",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "very_slow",
            "tiles": 13.5,
            "target": "self",
            "damage": 0,
            "healing": 0.34,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "block_debuffs",
                "turns": 2,
                "scope": "allies"
              },
              {
                "id": "remove_debuffs",
                "turns": 0,
                "scope": "allies"
              },
              {
                "id": "revive_on_death",
                "turns": 2,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 34% max HP to all living allies."
    },
    "sourceBefore": {
      "template_id": "plague_doctor",
      "name": "Quill, the Plague Sovereign",
      "title": "Black Coat, Brass Beak",
      "rarity": "legendary",
      "faction": "nether",
      "role": "support",
      "hp": 2042,
      "atk": 290,
      "def": 212,
      "spd": 119,
      "ability_name": "Censer of Rot",
      "ability_desc": "Swings the censer of rot — every curse is lifted from the warband and each ally is promised one return from death.",
      "lore": "He used to cure people. He used to. The mask kept whispering ideas he could not unhear.",
      "image_url": "/api/static/champions/plague_doctor.png",
      "id": "plague_doctor",
      "color": "purple",
      "source_image": "/api/static/champions/plague_doctor.png",
      "portrait": "assets/champions/plague_doctor.webp",
      "kit": {
        "a2": [
          [
            "block_debuffs",
            2
          ]
        ],
        "a3": [
          [
            "remove_debuffs",
            0
          ],
          [
            "revive_on_death",
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "plague_doctor",
      "name": "Quill, the Plague Sovereign",
      "title": "Black Coat, Brass Beak",
      "rarity": "rare",
      "faction": "nether",
      "role": "support",
      "hp": 1072,
      "atk": 574,
      "def": 590,
      "ability_name": "Censer of Rot",
      "lore": "He used to cure people. He used to. The mask kept whispering ideas he could not unhear.",
      "image_url": "/api/static/champions/plague_doctor.png",
      "id": "plague_doctor",
      "color": "green",
      "source_image": "/api/static/champions/plague_doctor.png",
      "portrait": "assets/champions/plague_doctor.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Censer of Rot",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "self",
            "damage": 0,
            "healing": 0.26,
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
      "ability_desc": "Restore 26% max HP to all living allies."
    },
    "sourceAfter": {
      "template_id": "plague_doctor",
      "name": "Quill, the Plague Sovereign",
      "title": "Black Coat, Brass Beak",
      "rarity": "rare",
      "faction": "nether",
      "role": "support",
      "hp": 1072,
      "atk": 574,
      "def": 590,
      "spd": 119,
      "ability_name": "Censer of Rot",
      "ability_desc": "Restore 26% max HP to all living allies.",
      "lore": "He used to cure people. He used to. The mask kept whispering ideas he could not unhear.",
      "image_url": "/api/static/champions/plague_doctor.png",
      "id": "plague_doctor",
      "color": "purple",
      "source_image": "/api/static/champions/plague_doctor.png",
      "portrait": "assets/champions/plague_doctor.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "remove_debuffs",
            0
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "void_herald_mara",
    "batch": 3,
    "kind": "faction_and_role",
    "name": "Void-Herald Mara",
    "before": {
      "template_id": "void_herald_mara",
      "name": "Void-Herald Mara",
      "title": "Envoy of the Starless Between",
      "rarity": "common",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 732,
      "atk": 511,
      "def": 403,
      "ability_name": "Oblivion",
      "lore": "Mara serves the Dragon Dynasty as its envoy to the starless reaches beyond the sky. Bearing a pact sealed with ancient dragonfire, she returns from the void with warnings for the throne and ruin for its enemies.",
      "image_url": "/api/static/champions/hero-18.png",
      "id": "void_herald_mara",
      "color": "purple",
      "source_image": "/api/static/champions/hero-18.png",
      "portrait": "assets/champions/void_herald_mara.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Oblivion",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.41,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "inc_atk",
                "turns": 2,
                "scope": "self"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 241% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "void_herald_mara",
      "name": "Void-Herald Mara",
      "title": "Envoy of the Starless Between",
      "rarity": "common",
      "faction": "dragondynasty",
      "role": "attack",
      "hp": 797,
      "atk": 104,
      "def": 58,
      "spd": 117,
      "ability_name": "Oblivion",
      "ability_desc": "Voids the field around herself — Mara's own attack surges a quarter higher for two rounds.",
      "lore": "Mara serves the Dragon Dynasty as its envoy to the starless reaches beyond the sky. Bearing a pact sealed with ancient dragonfire, she returns from the void with warnings for the throne and ruin for its enemies.",
      "image_url": "/api/static/champions/hero-18.png",
      "id": "void_herald_mara",
      "color": "red",
      "source_image": "/api/static/champions/hero-18.png",
      "portrait": "assets/champions/void_herald_mara.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "inc_atk",
            2
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "void_herald_mara",
      "name": "Void-Herald Mara",
      "title": "Keeper of the Last Passage",
      "rarity": "common",
      "faction": "nether",
      "role": "support",
      "hp": 850,
      "atk": 400,
      "def": 475,
      "ability_name": "Graveward",
      "lore": "Mara walks the silent roads of the Nether, carrying a violet lantern for souls who have lost their way. Its cold light shelters the living from the grasping dead. Those she guides remember a gentle voice in the dark, asking them to hold on until dawn.",
      "image_url": "/api/static/champions/hero-18.png",
      "id": "void_herald_mara",
      "color": "purple",
      "source_image": "/api/static/champions/hero-18.png",
      "portrait": "assets/champions/void_herald_mara.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Graveward",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "ally",
            "damage": 0,
            "healing": 0.28,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "shield",
                "turns": 1,
                "scope": "ally"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 28% max HP to one living ally."
    },
    "sourceAfter": {
      "template_id": "void_herald_mara",
      "name": "Void-Herald Mara",
      "title": "Keeper of the Last Passage",
      "rarity": "common",
      "faction": "nether",
      "role": "support",
      "hp": 850,
      "atk": 400,
      "def": 475,
      "spd": 117,
      "ability_name": "Graveward",
      "ability_desc": "Restore 28% max HP to one living ally.",
      "lore": "Mara walks the silent roads of the Nether, carrying a violet lantern for souls who have lost their way. Its cold light shelters the living from the grasping dead. Those she guides remember a gentle voice in the dark, asking them to hold on until dawn.",
      "image_url": "/api/static/champions/hero-18.png",
      "id": "void_herald_mara",
      "color": "red",
      "source_image": "/api/static/champions/hero-18.png",
      "portrait": "assets/champions/void_herald_mara.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "shield",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "mosswitch_lira",
    "batch": 4,
    "kind": "element_or_faction",
    "name": "Mosswitch Brynna",
    "before": {
      "template_id": "mosswitch_lira",
      "name": "Mosswitch Brynna",
      "title": "Barefoot Through the Thorns",
      "rarity": "common",
      "faction": "wildgrove",
      "role": "support",
      "hp": 877,
      "atk": 394,
      "def": 482,
      "ability_name": "Verdant Blessing",
      "lore": "The Blood Cult burned her village. The moss grew over the burns. Now she feels only the pulse of the earth.",
      "image_url": "/api/static/champions/hero-45.png",
      "id": "mosswitch_lira",
      "color": "blue",
      "source_image": "/api/static/champions/hero-45.png",
      "portrait": "assets/champions/mosswitch_lira.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Verdant Blessing",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "ally",
            "damage": 0,
            "healing": 0.32,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "heal",
                "turns": 1,
                "scope": "ally"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 32% max HP to one living ally."
    },
    "sourceBefore": {
      "template_id": "mosswitch_lira",
      "name": "Mosswitch Brynna",
      "title": "Barefoot Through the Thorns",
      "rarity": "common",
      "faction": "wildgrove",
      "role": "support",
      "hp": 790,
      "atk": 85,
      "def": 72,
      "spd": 108,
      "ability_name": "Verdant Blessing",
      "ability_desc": "A verdant blessing — the whole warband mends under her moss-song.",
      "lore": "The Blood Cult burned her village. The moss grew over the burns. Now she feels only the pulse of the earth.",
      "image_url": "/api/static/champions/hero-45.png",
      "id": "mosswitch_lira",
      "color": "green",
      "source_image": "/api/static/champions/hero-45.png",
      "portrait": "assets/champions/mosswitch_lira.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "heal",
            1
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "mosswitch_lira",
      "name": "Mosswitch Brynna",
      "title": "Barefoot Through the Thorns",
      "rarity": "common",
      "faction": "wildgrove",
      "role": "support",
      "hp": 877,
      "atk": 394,
      "def": 482,
      "ability_name": "Verdant Blessing",
      "lore": "The Blood Cult burned her village. The moss grew over the burns. Now she feels only the pulse of the earth.",
      "image_url": "/api/static/champions/hero-45.png",
      "id": "mosswitch_lira",
      "color": "green",
      "source_image": "/api/static/champions/hero-45.png",
      "portrait": "assets/champions/mosswitch_lira.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Verdant Blessing",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "ally",
            "damage": 0,
            "healing": 0.32,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "heal",
                "turns": 1,
                "scope": "ally"
              }
            ]
          }
        ]
      },
      "ability_desc": "Restore 32% max HP to one living ally."
    },
    "sourceAfter": {
      "template_id": "mosswitch_lira",
      "name": "Mosswitch Brynna",
      "title": "Barefoot Through the Thorns",
      "rarity": "common",
      "faction": "wildgrove",
      "role": "support",
      "hp": 790,
      "atk": 85,
      "def": 72,
      "spd": 108,
      "ability_name": "Verdant Blessing",
      "ability_desc": "A verdant blessing — the whole warband mends under her moss-song.",
      "lore": "The Blood Cult burned her village. The moss grew over the burns. Now she feels only the pulse of the earth.",
      "image_url": "/api/static/champions/hero-45.png",
      "id": "mosswitch_lira",
      "color": "green",
      "source_image": "/api/static/champions/hero-45.png",
      "portrait": "assets/champions/mosswitch_lira.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "heal",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "solar_scribe",
    "batch": 4,
    "kind": "element_or_faction",
    "name": "Solar Scribe",
    "before": {
      "template_id": "solar_scribe",
      "name": "Solar Scribe",
      "title": "Whose Quill Writes in Daylight",
      "rarity": "common",
      "faction": "duneriders",
      "role": "attack",
      "hp": 703,
      "atk": 517,
      "def": 408,
      "ability_name": "Chronicle of Doom",
      "lore": "He does not predict the battle. He edits it — golden strokes that the world is too polite to refuse.",
      "image_url": "/api/static/champions/hero-5.png",
      "id": "solar_scribe",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-5.png",
      "portrait": "assets/champions/solar_scribe.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Chronicle of Doom",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.41,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "mana_slow",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 241% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "solar_scribe",
      "name": "Solar Scribe",
      "title": "Whose Quill Writes in Daylight",
      "rarity": "common",
      "faction": "duneriders",
      "role": "attack",
      "hp": 720,
      "atk": 135,
      "def": 55,
      "spd": 108,
      "ability_name": "Chronicle of Doom",
      "ability_desc": "Inscribes a foe into the chronicle of doom — the ink drags at them, a step slower for a round.",
      "lore": "He does not predict the battle. He edits it — golden strokes that the world is too polite to refuse.",
      "image_url": "/api/static/champions/hero-5.png",
      "id": "solar_scribe",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-5.png",
      "portrait": "assets/champions/solar_scribe.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "dec_spd",
            1
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "solar_scribe",
      "name": "Solar Scribe",
      "title": "Whose Quill Writes in Daylight",
      "rarity": "common",
      "faction": "nether",
      "role": "attack",
      "hp": 703,
      "atk": 517,
      "def": 408,
      "ability_name": "Chronicle of Doom",
      "lore": "In the Nether, the Solar Scribe records the last light of dying suns. His golden ink preserves the names of souls the dark would erase. When war reaches the silent archives, he writes a different ending for those who threaten their keeping.",
      "image_url": "/api/static/champions/hero-5.png",
      "id": "solar_scribe",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-5.png",
      "portrait": "assets/champions/solar_scribe.webp",
      "passive": null,
      "manaSpeed": "average",
      "special": {
        "name": "Chronicle of Doom",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 2.41,
            "healing": 0,
            "healScope": "ally",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "mana_slow",
                "turns": 1,
                "scope": "enemy"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 241% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "solar_scribe",
      "name": "Solar Scribe",
      "title": "Whose Quill Writes in Daylight",
      "rarity": "common",
      "faction": "nether",
      "role": "attack",
      "hp": 720,
      "atk": 135,
      "def": 55,
      "spd": 108,
      "ability_name": "Chronicle of Doom",
      "ability_desc": "Inscribes a foe into the chronicle of doom — the ink drags at them, a step slower for a round.",
      "lore": "In the Nether, the Solar Scribe records the last light of dying suns. His golden ink preserves the names of souls the dark would erase. When war reaches the silent archives, he writes a different ending for those who threaten their keeping.",
      "image_url": "/api/static/champions/hero-5.png",
      "id": "solar_scribe",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-5.png",
      "portrait": "assets/champions/solar_scribe.webp",
      "kit": {
        "a2": [],
        "a3": [
          [
            "dec_spd",
            1
          ]
        ]
      },
      "passive": null
    }
  },
  {
    "id": "blood_paladin",
    "batch": 5,
    "kind": "element_and_lore",
    "name": "Sir Aurel, the Crimson Paladin",
    "before": {
      "template_id": "blood_paladin",
      "name": "Sir Aurel, the Crimson Paladin",
      "title": "Whose Halo Was Cracked",
      "rarity": "mythical",
      "faction": "bloodcourt",
      "role": "defense",
      "hp": 1653,
      "atk": 748,
      "def": 875,
      "ability_name": "Weeping Sanctuary",
      "lore": "Sir Aurel was promised paradise. Sir Aurel was lied to. Sir Aurel still keeps the vow anyway.",
      "image_url": "/api/static/champions/blood_paladin.png",
      "id": "blood_paladin",
      "color": "red",
      "source_image": "/api/static/champions/blood_paladin.png",
      "portrait": "assets/champions/blood_paladin.webp",
      "passive": {
        "id": "oath_unbroken",
        "name": "Oath Unbroken",
        "kind": "revive_once",
        "value": 0.35,
        "desc": "Revives once per battle."
      },
      "manaSpeed": "slow",
      "special": {
        "name": "Weeping Sanctuary",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "slow",
            "tiles": 12,
            "target": "enemy",
            "damage": 1.81,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "dec_atk",
                "turns": 3,
                "scope": "enemy"
              },
              {
                "id": "block_debuffs",
                "turns": 1,
                "scope": "self"
              },
              {
                "id": "guard",
                "turns": 3,
                "scope": "self"
              },
              {
                "id": "shield",
                "turns": 1,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 181% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "blood_paladin",
      "name": "Sir Aurel, the Crimson Paladin",
      "title": "Whose Halo Was Cracked",
      "rarity": "mythical",
      "faction": "bloodcourt",
      "role": "defense",
      "hp": 3366,
      "atk": 310,
      "def": 357,
      "spd": 116,
      "ability_name": "Weeping Sanctuary",
      "ability_desc": "Raises a bleeding halo — foes can strike nothing but Aurel for three rounds, and a crimson shield settles over the whole warband.",
      "lore": "Sir Aurel was promised paradise. Sir Aurel was lied to. Sir Aurel still keeps the vow anyway.",
      "image_url": "/api/static/champions/blood_paladin.png",
      "id": "blood_paladin",
      "color": "red",
      "source_image": "/api/static/champions/blood_paladin.png",
      "portrait": "assets/champions/blood_paladin.webp",
      "kit": {
        "a2": [
          [
            "dec_atk",
            3
          ],
          [
            "block_debuffs",
            1
          ]
        ],
        "a3": [
          [
            "taunt",
            3
          ],
          [
            "shield",
            1
          ]
        ]
      },
      "passive": {
        "id": "oath_unbroken",
        "name": "Oath Unbroken",
        "kind": "revive_once",
        "value": 0.35,
        "desc": "Revives once per battle."
      }
    },
    "after": {
      "template_id": "blood_paladin",
      "name": "Sir Aurel, the Crimson Paladin",
      "title": "Whose Halo Was Cracked",
      "rarity": "mythical",
      "faction": "bloodcourt",
      "role": "defense",
      "hp": 1653,
      "atk": 748,
      "def": 875,
      "ability_name": "Weeping Sanctuary",
      "lore": "Sir Aurel swore to guard the Bloodcourt’s dawn gates, where the first light once struck down an entire noble house. He bound that light to his shield with an oath written in his own blood. Now its golden radiance shelters those under his protection, and even death must wait until his watch is ended.",
      "image_url": "/api/static/champions/blood_paladin.png",
      "id": "blood_paladin",
      "color": "yellow",
      "source_image": "/api/static/champions/blood_paladin.png",
      "portrait": "assets/champions/blood_paladin.webp",
      "passive": {
        "id": "oath_unbroken",
        "name": "Oath Unbroken",
        "kind": "revive_once",
        "value": 0.35,
        "desc": "Revives once per battle."
      },
      "manaSpeed": "slow",
      "special": {
        "name": "Weeping Sanctuary",
        "charging": false,
        "levels": [
          {
            "level": 1,
            "speed": "slow",
            "tiles": 12,
            "target": "enemy",
            "damage": 1.81,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "dec_atk",
                "turns": 3,
                "scope": "enemy"
              },
              {
                "id": "block_debuffs",
                "turns": 1,
                "scope": "self"
              },
              {
                "id": "guard",
                "turns": 3,
                "scope": "self"
              },
              {
                "id": "shield",
                "turns": 1,
                "scope": "allies"
              }
            ]
          }
        ]
      },
      "ability_desc": "Deal 181% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "blood_paladin",
      "name": "Sir Aurel, the Crimson Paladin",
      "title": "Whose Halo Was Cracked",
      "rarity": "mythical",
      "faction": "bloodcourt",
      "role": "defense",
      "hp": 3366,
      "atk": 310,
      "def": 357,
      "spd": 116,
      "ability_name": "Weeping Sanctuary",
      "ability_desc": "Raises a bleeding halo — foes can strike nothing but Aurel for three rounds, and a crimson shield settles over the whole warband.",
      "lore": "Sir Aurel swore to guard the Bloodcourt’s dawn gates, where the first light once struck down an entire noble house. He bound that light to his shield with an oath written in his own blood. Now its golden radiance shelters those under his protection, and even death must wait until his watch is ended.",
      "image_url": "/api/static/champions/blood_paladin.png",
      "id": "blood_paladin",
      "color": "yellow",
      "source_image": "/api/static/champions/blood_paladin.png",
      "portrait": "assets/champions/blood_paladin.webp",
      "kit": {
        "a2": [
          [
            "dec_atk",
            3
          ],
          [
            "block_debuffs",
            1
          ]
        ],
        "a3": [
          [
            "taunt",
            3
          ],
          [
            "shield",
            1
          ]
        ]
      },
      "passive": {
        "id": "oath_unbroken",
        "name": "Oath Unbroken",
        "kind": "revive_once",
        "value": 0.35,
        "desc": "Revives once per battle."
      }
    }
  },
  {
    "id": "archangel_lucifer",
    "batch": 6,
    "kind": "element",
    "name": "Archangel Lucifer",
    "before": {
      "template_id": "archangel_lucifer",
      "name": "Archangel Lucifer",
      "title": "Fallen Blade of the First Choir",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "defense",
      "hp": 1524,
      "atk": 680,
      "def": 792,
      "ability_name": "Apocalyptic Wrath",
      "lore": "Cast from the vault, Lucifer chose neither heaven nor hell — only the battlefield between, and the vow he would not break.",
      "image_url": "/api/static/champions/hero-1.png",
      "id": "archangel_lucifer",
      "color": "yellow",
      "source_image": "/api/static/champions/hero-1.png",
      "portrait": "assets/champions/archangel_lucifer.webp",
      "passive": null,
      "manaSpeed": "charging",
      "special": {
        "name": "Apocalyptic Wrath",
        "charging": true,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "enemy",
            "damage": 1.09,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "inc_def",
                "turns": 2,
                "scope": "self"
              },
              {
                "id": "shield",
                "turns": 2,
                "scope": "allies"
              }
            ]
          },
          {
            "level": 2,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.6,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "inc_def",
                "turns": 3,
                "scope": "self"
              },
              {
                "id": "shield",
                "turns": 3,
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
      "ability_desc": "Deal 160% ATK damage to selected enemy."
    },
    "sourceBefore": {
      "template_id": "archangel_lucifer",
      "name": "Archangel Lucifer",
      "title": "Fallen Blade of the First Choir",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "defense",
      "hp": 2375,
      "atk": 300,
      "def": 230,
      "spd": 112,
      "ability_name": "Apocalyptic Wrath",
      "ability_desc": "Scours the field with fallen light — heavy shields settle over the whole warband, and Lucifer answers the next blow he takes.",
      "lore": "Cast from the vault, Lucifer chose neither heaven nor hell — only the battlefield between, and the vow he would not break.",
      "image_url": "/api/static/champions/hero-1.png",
      "id": "archangel_lucifer",
      "color": "blue",
      "source_image": "/api/static/champions/hero-1.png",
      "portrait": "assets/champions/archangel_lucifer.webp",
      "kit": {
        "a2": [
          [
            "inc_def",
            3
          ]
        ],
        "a3": [
          [
            "shield",
            3
          ],
          [
            "counterattack",
            1
          ]
        ]
      },
      "passive": null
    },
    "after": {
      "template_id": "archangel_lucifer",
      "name": "Archangel Lucifer",
      "title": "Fallen Blade of the First Choir",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "defense",
      "hp": 1524,
      "atk": 680,
      "def": 792,
      "ability_name": "Apocalyptic Wrath",
      "lore": "Cast from the vault, Lucifer chose neither heaven nor hell — only the battlefield between, and the vow he would not break.",
      "image_url": "/api/static/champions/hero-1.png",
      "id": "archangel_lucifer",
      "color": "red",
      "source_image": "/api/static/champions/hero-1.png",
      "portrait": "assets/champions/archangel_lucifer.webp",
      "passive": null,
      "manaSpeed": "charging",
      "special": {
        "name": "Apocalyptic Wrath",
        "charging": true,
        "levels": [
          {
            "level": 1,
            "speed": "fast",
            "tiles": 8,
            "target": "enemy",
            "damage": 1.09,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "inc_def",
                "turns": 2,
                "scope": "self"
              },
              {
                "id": "shield",
                "turns": 2,
                "scope": "allies"
              }
            ]
          },
          {
            "level": 2,
            "speed": "average",
            "tiles": 10,
            "target": "enemy",
            "damage": 1.6,
            "healing": 0,
            "healScope": "allies",
            "aoe": false,
            "pierce": false,
            "effects": [
              {
                "id": "inc_def",
                "turns": 3,
                "scope": "self"
              },
              {
                "id": "shield",
                "turns": 3,
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
      "ability_desc": "Deal 160% ATK damage to selected enemy."
    },
    "sourceAfter": {
      "template_id": "archangel_lucifer",
      "name": "Archangel Lucifer",
      "title": "Fallen Blade of the First Choir",
      "rarity": "legendary",
      "faction": "ironclad",
      "role": "defense",
      "hp": 2375,
      "atk": 300,
      "def": 230,
      "spd": 112,
      "ability_name": "Apocalyptic Wrath",
      "ability_desc": "Scours the field with fallen light — heavy shields settle over the whole warband, and Lucifer answers the next blow he takes.",
      "lore": "Cast from the vault, Lucifer chose neither heaven nor hell — only the battlefield between, and the vow he would not break.",
      "image_url": "/api/static/champions/hero-1.png",
      "id": "archangel_lucifer",
      "color": "red",
      "source_image": "/api/static/champions/hero-1.png",
      "portrait": "assets/champions/archangel_lucifer.webp",
      "kit": {
        "a2": [
          [
            "inc_def",
            3
          ]
        ],
        "a3": [
          [
            "shield",
            3
          ],
          [
            "counterattack",
            1
          ]
        ]
      },
      "passive": null
    }
  }
];
export function beforeRarityRevision(records,{source=false}={}){const m=new Map(RARITY_REVISION.map(x=>[x.id,x]));return records.map(c=>{const x=m.get(c.id);if(!x)return c;const expected=source?x.sourceAfter:x.after;if(JSON.stringify(c)!==JSON.stringify(expected))throw Error("Unexpected rarity revision: "+c.id);return structuredClone(source?x.sourceBefore:x.before);});}
