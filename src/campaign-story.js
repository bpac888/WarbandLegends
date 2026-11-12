// One concise continuing story across the green, burning and ruined kingdom.
export const CAMPAIGN_ARCS={
  "normal": {
    "act": "I",
    "title": "The First Crossing",
    "subtitle": "Before the Ash",
    "art": "world-map.svg",
    "description": "A green kingdom stands above an ancient wound. Follow the stolen light before its protectors turn it into a weapon.",
    "opening": [
      [
        "Nima",
        "The valley is still green, but the Beacon above the citadel has gone dark. The river gates are closing, and the villages need help."
      ],
      [
        "Keeper",
        "We start at the foundry. Find out who closed the gates and what happened to the light."
      ]
    ],
    "chapters": [
      {
        "id": 1,
        "end": 5,
        "title": "The Water Behind the Wall",
        "summary": "Reach the Iron Crossroads and reopen the channels feeding the valley.",
        "before": [
          [
            "Nima",
            "The foundry has shut the river gates. Bronze Juggernaut is guarding the controls under Auroline’s orders."
          ],
          [
            "Keeper",
            "The farms need that water. We open the gates, then find out what Auroline is building."
          ]
        ],
        "after": [
          [
            "Nima",
            "The water is returning, but there is golden light in it. The foundry is drawing power from beneath the citadel."
          ],
          [
            "Keeper",
            "Follow the channels. We need to stop that power reaching the villages."
          ]
        ]
      },
      {
        "id": 2,
        "end": 10,
        "title": "A Shadow at Noon",
        "summary": "Trace the stolen charge through the marsh to Obsidian Gate.",
        "before": [
          [
            "Nima",
            "Azhar warned us about the buried Crown. The trail of golden light leads through Obsidian Gate."
          ],
          [
            "Keeper",
            "Then we clear the gate and learn why the Crown was hidden."
          ]
        ],
        "after": [
          [
            "Nima",
            "The inscription calls the Crown a seal over the Worldwound. It warns against lighting it."
          ],
          [
            "Keeper",
            "Auroline thinks she is restoring the Beacon. We must get this warning to her."
          ]
        ]
      },
      {
        "id": 3,
        "end": 15,
        "title": "The Moonward",
        "summary": "Learn what the Crown seals before its light can return.",
        "before": [
          [
            "Asterox",
            "The Beacon is only a warning light. The Crown beneath it seals a breach between worlds. Water, root, flame, moon and memory are its five anchors."
          ],
          [
            "Keeper",
            "And Auroline’s engine is draining that seal?"
          ],
          [
            "Asterox",
            "Yes. Take this moonward. You will need it to guide the seal back into place."
          ],
          [
            "Keeper",
            "We will reach her before the engine opens the wound."
          ]
        ],
        "after": [
          [
            "Nima",
            "The shadows are following the stolen charge. We have to keep them away from the villages."
          ],
          [
            "Keeper",
            "Carry the moonward. The gardens lie on the road to the citadel."
          ]
        ]
      },
      {
        "id": 4,
        "end": 20,
        "title": "Roots Beneath the Citadel",
        "summary": "Protect the living anchor as the charge spreads through the gardens.",
        "before": [
          [
            "Nima",
            "Qingluo is protecting the gardens, but the charge in the water is burning their roots. A foundry patrol blocks the road."
          ],
          [
            "Keeper",
            "We clear the patrol and keep the fighting away from the gardens."
          ]
        ],
        "after": [
          [
            "Nima",
            "The gardens are safe for now. Qingluo has sheltered the living root that anchors this part of the seal."
          ],
          [
            "Keeper",
            "Good. We still have something to protect. Now we reach Auroline."
          ]
        ]
      },
      {
        "id": 5,
        "end": 25,
        "title": "The Light That Opens",
        "summary": "Reach Auroline and discover who has rewritten the Crown’s purpose.",
        "before": [
          [
            "Vex",
            "The inscription proves it. The voice in the Crown removed the warning from our formula. It taught us to open its prison."
          ],
          [
            "Auroline",
            "I trusted it. My orders put the valley in danger. I will warn the city and open the evacuation roads."
          ],
          [
            "Vex",
            "We can disconnect the engine, but the trapped charge may escape into the flame channels. Clear the guardians so I can reach the controls."
          ],
          [
            "Keeper",
            "Stop the engine. We will help everyone get out."
          ]
        ],
        "after": [
          [
            "Nima",
            "The engine is stopped, but smoke is rising from the flame channels. The kingdom is catching fire."
          ],
          [
            "Keeper",
            "Ring the bells. We return along the road and bring the people with us."
          ]
        ]
      }
    ]
  },
  "hard": {
    "act": "II",
    "title": "The Ashfall March",
    "subtitle": "The Kingdom on Fire",
    "art": "world-map-hard.svg",
    "description": "The Crown’s trapped charge has entered the flame channels. Return through the same kingdom to evacuate its people and contain the breach.",
    "opening": [
      [
        "Nima",
        "The escaped charge has entered the old flame channels. The same roads we crossed are burning."
      ],
      [
        "Keeper",
        "Then we follow those roads back through the kingdom. Clear a way out and bring the people to safety."
      ]
    ],
    "chapters": [
      {
        "id": 1,
        "end": 5,
        "title": "Water That Burns",
        "summary": "Reopen the foundry’s emergency sluices and guide the lower settlements out.",
        "before": [
          [
            "Nima",
            "Families are trapped at the foundry gates. The main channel is boiling, but the side sluices still carry cold water."
          ],
          [
            "Keeper",
            "Clear the guards and open those sluices. We need a safe road for the carts."
          ]
        ],
        "after": [
          [
            "Nima",
            "The families are through. The foundry cannot hold the charge any longer."
          ],
          [
            "Keeper",
            "Keep moving. The next settlement needs a way out."
          ]
        ]
      },
      {
        "id": 2,
        "end": 10,
        "title": "The Price of a Passage",
        "summary": "A burning fortress blocks the route to the shelter beyond the marsh.",
        "before": [
          [
            "Murgash",
            "The Crown’s light has turned my sentries against me. I can hold this arch, but your people need a clear path."
          ],
          [
            "Keeper",
            "We clear the sentries. Hold it until the last family passes."
          ],
          [
            "Murgash",
            "And then?"
          ],
          [
            "Keeper",
            "You come with us. No one gets left under that wall."
          ]
        ],
        "after": [
          [
            "Nima",
            "Murgash kept the arch standing. The last group has reached the shelter."
          ],
          [
            "Keeper",
            "He kept his word. Now we keep the road open for the wounded."
          ]
        ]
      },
      {
        "id": 3,
        "end": 15,
        "title": "A Line in the Ash",
        "summary": "Keep the evacuation corridor open while the fire reaches the upper gardens.",
        "before": [
          [
            "Sir Aurel",
            "The aqueduct is our last route. I have wounded people to move and enemies gathering ahead."
          ],
          [
            "Keeper",
            "We clear the road. Bring the stretchers through behind us."
          ]
        ],
        "after": [
          [
            "Nima",
            "The wounded are safe. Aurel is guarding the route to the ridge."
          ],
          [
            "Keeper",
            "Then we go to the gardens before the living anchor burns."
          ]
        ]
      },
      {
        "id": 4,
        "end": 20,
        "title": "The Last Green Root",
        "summary": "Save the living anchor while the rest of the map burns.",
        "before": [
          [
            "Nima",
            "The root is still alive. I can save it with mountain water and the moonward, but we need to hold off that patrol."
          ],
          [
            "Keeper",
            "Take the time you need. We defend the gardens."
          ]
        ],
        "after": [
          [
            "Nima",
            "I have the root, water and a sheltered ember for the flame anchor. Vex is joining the channels to contain the fire."
          ],
          [
            "Keeper",
            "Bring them to the Crown. We must finish this before the next surge."
          ]
        ]
      },
      {
        "id": 5,
        "end": 25,
        "title": "A Door Made of Fire",
        "summary": "Reach the Crown as the attempt to contain the flames becomes a breach.",
        "before": [
          [
            "Auroline",
            "The voice has corrupted our containment circuit. It is feeding the breach. If we leave it running, the wound will reach the refugees."
          ],
          [
            "Vex",
            "Cutting it stops the spread, but the damaged Crown will lose the support holding up the land around it."
          ],
          [
            "Nima",
            "The people are beyond those foundations. We can still carry the anchors across what remains."
          ],
          [
            "Keeper",
            "Clear the bridge and cut the circuit. Save the people, even if the citadel falls."
          ]
        ],
        "after": [
          [
            "Nima",
            "The spread has stopped. But the foundations are breaking, just as Vex warned."
          ],
          [
            "Keeper",
            "Stay on the road. We still have to close the wound beneath us."
          ]
        ]
      }
    ]
  },
  "nightmare": {
    "act": "III",
    "title": "The World Unmade",
    "subtitle": "What Remains",
    "art": "world-map-nightmare.svg",
    "description": "The fires are gone. The same road hangs in fragments above the Worldwound. Carry the surviving anchors to the Crown and seal the breach.",
    "opening": [
      [
        "Nima",
        "The fires have stopped, but the broken seal has left the kingdom in ruins. The survivors are safe beyond the ridge."
      ],
      [
        "Keeper",
        "We still have the five anchors. Follow the old road to the Crown and close the wound for good."
      ]
    ],
    "chapters": [
      {
        "id": 1,
        "end": 5,
        "title": "The Road That Remembers",
        "summary": "Cross the broken gate without surrendering the surviving anchors.",
        "before": [
          [
            "Nima",
            "The foundry is gone, but its sentinel is still blocking the broken crossing."
          ],
          [
            "Keeper",
            "Silence its last command. We need this road to reach the Crown."
          ]
        ],
        "after": [
          [
            "Nima",
            "The sentinel has stopped. The stones are steady enough to cross."
          ],
          [
            "Keeper",
            "Keep the anchors close. We go together."
          ]
        ]
      },
      {
        "id": 2,
        "end": 10,
        "title": "Winter Over Nothing",
        "summary": "Find a way across the shattered basin while the sky opens beneath it.",
        "before": [
          [
            "Iseldra",
            "The basin has fallen into the wound. Give me a drop of your water; I can freeze a crossing, but it will not last."
          ],
          [
            "Keeper",
            "Leave enough for the seal. We will clear the guardians on the far side."
          ]
        ],
        "after": [
          [
            "Nima",
            "We are across, and the root still has water. Iseldra held the bridge until the last of us passed."
          ],
          [
            "Keeper",
            "Thank her. The citadel is ahead."
          ]
        ]
      },
      {
        "id": 3,
        "end": 15,
        "title": "Names Beneath the Ruins",
        "summary": "Resist the wound’s false voices as the road passes the fallen kingdom.",
        "before": [
          [
            "Nima",
            "The wound is showing me the gardens as they were. It wants us to leave the road and follow them."
          ],
          [
            "Keeper",
            "Remember the real people waiting on the ridge. We are closing this wound for them."
          ]
        ],
        "after": [
          [
            "Nima",
            "The false voices are fading. Asterox said memory was the fifth anchor. Now I understand."
          ],
          [
            "Keeper",
            "Keep their names in mind. We have almost reached the Crown."
          ]
        ]
      },
      {
        "id": 4,
        "end": 20,
        "title": "A Root in the Dark",
        "summary": "Bring the surviving living anchor through the final ruined gardens.",
        "before": [
          [
            "Nima",
            "The root is holding the broken moonward together. We still have water and the sheltered ember."
          ],
          [
            "Keeper",
            "All four are here. Auroline’s original design shows where they belong; memory will guide them."
          ]
        ],
        "after": [
          [
            "Nima",
            "The roots have steadied the final bridge. We can reach the seal."
          ],
          [
            "Keeper",
            "One last crossing. Hold together."
          ]
        ]
      },
      {
        "id": 5,
        "end": 25,
        "title": "No Throne Above the Wound",
        "summary": "Hold the final approach and return the Crown to its purpose as a seal.",
        "before": [
          [
            "Yshmir",
            "Let me through. I can give you back the kingdom you lost."
          ],
          [
            "Keeper",
            "You caused this. We will rebuild without you."
          ],
          [
            "Nima",
            "Water, root, flame, moon and memory—all five are ready. Hold the remaining guardians while I set the anchors into the Crown."
          ],
          [
            "Keeper",
            "Make the seal. We will hold the bridge."
          ]
        ],
        "after": [
          [
            "Nima",
            "The wound is closed. The ground is steady, but the kingdom is still in ruins."
          ],
          [
            "Keeper",
            "Then we bring the people home and rebuild. This time, the road belongs to them."
          ]
        ]
      }
    ]
  }
};
export const STORY_DIFFICULTIES=['normal','hard','nightmare'];
export const STORY_CHAPTERS=Array.from({length:5},(_,i)=>({id:i+1,start:i*5+1,end:(i+1)*5}));
export function campaignArc(difficulty='normal'){return CAMPAIGN_ARCS[difficulty]||CAMPAIGN_ARCS.normal;}
export function campaignScene(difficulty,id){return campaignArc(difficulty).chapters[id-1]||null;}
export function narrativeKey(stage){return `${stage.difficulty}:map:${stage.number===1?'opening':Math.ceil(stage.number/5)}`;}
export const sceneViewed=(p,stage)=>(p.storySeen||[]).includes(narrativeKey(stage));
