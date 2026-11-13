// The difficulties follow one story: rescue, evacuation, then the final binding.
const chapter=(id,title,summary,guardianId,before,after)=>({id,end:id*5,title,summary,guardianId,before,after});
export const CAMPAIGN_ARCS={
 normal:{act:"I",title:"The Missing Alchemist",subtitle:"A Knock Before Dawn",art:"world-map.svg",description:"Rescue Auroline before Lucifer uses her magic to free the tyrant Yshmir.",opening:[
 ["Runa","Auroline was taken last night. Lucifer’s soldiers carried our village alchemist toward the citadel."],
 ["Commander","Why are the city wardens stopping us?"],
 ["Runa","Even Hald, my old teacher, attacked me. He looked straight through me."],
 ["Commander","Defend yourself, but leave him alive. We’re bringing Auroline home."]
 ],chapters:[
 chapter(1,"The Empty Wells","Restore the village water supply and learn where Auroline was taken.","bronze_juggernaut",[
 ["Runa","The Juggernaut has diverted our river to the citadel. The village wells are empty."],
 ["Commander","Free the sluices. The millers may have seen Auroline’s captors."]
 ],[
 ["Runa","The river is flowing! Auroline dropped a note: “Lucifer needs my magic. Do not trust the voice.”"],
 ["Commander","Lucifer commands Obsidian Gate. Let’s ask him ourselves."]
 ]),
 chapter(2,"The King Beneath the City","Confront Lucifer about the prisoner under the citadel.","archangel_lucifer",[
 ["Lucifer","Auroline will free Yshmir, our rightful king. One ruler will end these wars."],
 ["Commander","You kidnapped her. Is that how your peace begins?"],
 ["Lucifer","She refused to serve. Soon she won’t have a choice."],
 ["Runa","Yshmir was a tyrant. The old monument says he’s imprisoned beneath the citadel."]
 ],[
 ["Runa","Lucifer fled. His orders say Auroline is being held at Yshmir’s prison."],
 ["Commander","We must free her before his ritual ends."]
 ]),
 chapter(3,"The Offer","Resist Yshmir’s apparition at Ruin Spire.","yshmir_worldwound",[
 ["Yshmir","Hald no longer fears anything. I can give you that peace, Runa."],
 ["Runa","You made him attack me. That isn’t peace."],
 ["Commander","Only an apparition—the ritual hasn’t freed his body. Stay with me."]
 ],[
 ["Runa","It’s gone. I wanted to believe him. I wanted Hald back."],
 ["Commander","Then we free Hald. We don’t surrender you."]
 ]),
 chapter(4,"Those Who Refused","Free the prisoners being held in the gardens.","bronze_juggernaut",[
 ["Runa","These villagers refused Lucifer’s demands. His Juggernaut locked them in the storehouse."],
 ["Commander","Break them out. The gardeners can lead them home."]
 ],[
 ["Runa","A prisoner saw Auroline. Lucifer’s spell forces her to cast; Quill and Chispa guard her."],
 ["Commander","Then we break the spell holding her—not Yshmir’s prison."]
 ]),
 chapter(5,"Bring Her Home","Break the spell forcing Auroline to open Yshmir’s prison.","transmuter_prime",[
 ["Auroline","Stay back! He’s forcing me to cast!"],
 ["Runa","We found your note. How do we free you?"],
 ["Auroline","Weaken my magic to break the binding. Keep Quill and Chispa away!"],
 ["Commander","Hold on. We’re getting you out."]
 ],[
 ["Auroline","I’m free—but the prison is cracked. Yshmir’s magic can reach the valley."],
 ["Yshmir","You would leave me buried? Watch your kingdom burn."],
 ["Runa","The fields! He’s setting them alight!"],
 ["Commander","Ring the bells. Get everyone out!"]
 ])]},
 hard:{act:"II",title:"The Burning Valley",subtitle:"People Before Stone",art:"world-map-hard.svg",description:"Evacuate the burning valley and defend the refugees from Lucifer’s army.",opening:[
 ["Runa","The refugees are trapped at Ashen Gate. Hald’s wardens won’t open it."],
 ["Auroline","Their oath to the old throne lets Yshmir control them. Hald cannot disobey."],
 ["Commander","Push the wardens back. Let the families through."],
 ["Auroline","I’ll lead them to the ridge. Yshmir will break free before dawn."]
 ],chapters:[
 chapter(1,"Water for the Living","Release the water trapped in the Verdant King’s grove.","the_verdant_king",[
 ["Runa","The Verdant King dammed the river to save his grove. The villages can’t fight the fire."],
 ["Commander","Open the dam. Hold his guards back without burning his trees."]
 ],[
 ["Runa","Water is reaching the houses—and the millers have saved some for the grove."],
 ["Commander","Take the wounded to Obsidian Gate. Its stone halls should shelter them."]
 ]),
 chapter(2,"The Price of Shelter","Rescue the families Lucifer has imprisoned in the fortress.","archangel_lucifer",[
 ["Lucifer","Swear yourselves to Yshmir. My fortress will shelter the obedient."],
 ["Runa","The oath that took Hald’s mind? You’re making them slaves."],
 ["Commander","Open the cells, Lucifer. They’re leaving with us."]
 ],[
 ["Runa","The prisoners are free. Lucifer escaped while we helped them."],
 ["Commander","Better that than leaving them in a burning fortress."]
 ]),
 chapter(3,"The Stolen Medicine","Recover the refugee supplies taken by the Shade Prince.","shade_prince",[
 ["Runa","The Shade Prince stole the medicine carts. Now he’s charging refugees to cross the aqueduct."],
 ["Commander","Take the medicine back. The wounded can’t wait."]
 ],[
 ["Runa","Auroline has the medicine. The carts have food for the climb, too."],
 ["Commander","Send an escort. Families are still missing in the gardens."]
 ]),
 chapter(4,"Something for Tomorrow","Rescue the families trapped beneath the garden terraces.","the_verdant_king",[
 ["Runa","The Verdant King retreated here. His roots are crushing shelters with children inside."],
 ["Commander","Hold his guards back. Mark every occupied cellar—I’ll reach them."]
 ],[
 ["Runa","Everyone’s out. A gardener saved this chest. Not gold—seeds."],
 ["Commander","Keep them safe. We’ll need something to plant when we return."],
 ["Auroline","The ridge is safe, but Lucifer’s army is coming to drag the refugees back."]
 ]),
 chapter(5,"Nobody Kneels","Defeat Lucifer’s army before it can attack the refugee camp.","archangel_lucifer",[
 ["Lucifer","Yshmir’s subjects will welcome him—even if I bring them back on their knees."],
 ["Runa","You’ll have to get through us."],
 ["Auroline","Stop his army here. The refugees can’t defend themselves."],
 ["Commander","Look around, Lucifer. We’re still standing."]
 ],[
 ["Runa","His army has surrendered. Lucifer fled. The camp is safe."],
 ["Yshmir","You’ve stolen my subjects. Then lose your city!"],
 ["Auroline","The prison is breaking! The citadel is collapsing!"],
 ["Commander","Western stairs! Stay together—the ridge will hold!"]
 ])]},
 nightmare:{act:"III",title:"What Remains",subtitle:"Back Into the Ruins",art:"world-map-nightmare.svg",description:"Return to the ruined citadel and bind Yshmir before he reaches the refugees.",opening:[
 ["Runa","The people survived. Now Yshmir promises to rebuild their homes. Some want to return."],
 ["Auroline","He’s free, but still weak. The old binding spell could imprison him again."],
 ["Commander","Where is it?"],
 ["Auroline","On Lucifer’s scroll. He used it to open the prison. Find him."]
 ],chapters:[
 chapter(1,"The People Left Behind","Free the survivors caught in Elder Rootmother’s enchanted roots.","elder_rootmother",[
 ["Runa","Rootmother sheltered survivors in her roots. Now she won’t release them."],
 ["Yshmir","No hunger. No grief. They can sleep until I restore their world."],
 ["Commander","He’s controlling her. Can you free them, Auroline?"],
 ["Auroline","Keep her guardians away while I undo the enchantment."]
 ],[
 ["Auroline","They’re awake. Rootmother has released them. Yshmir’s spell is broken here."],
 ["Runa","We’ll bring them to the ridge. No more sleeping prisoners."]
 ]),
 chapter(2,"A King Without Mercy","Take the binding spell from Lucifer at the ruined fortress.","archangel_lucifer",[
 ["Runa","Lucifer’s followers are buried in the archives. He’s searching for scrolls instead of helping."],
 ["Lucifer","The king has risen. Whatever the cost, I was right."],
 ["Commander","Give us the binding spell. You can still save lives."],
 ["Lucifer","I will not surrender my triumph!"]
 ],[
 ["Runa","He fled and dropped the scroll. We left ropes for his trapped followers."],
 ["Auroline","The binding spell is here. I must cast it inside the prison."]
 ]),
 chapter(3,"The Home She Remembered","Reject the Pale Matriarch’s false vision of the valley.","pale_matriarch",[
 ["Runa","Our village—the aqueduct, the houses. They’re whole again!"],
 ["Yshmir","The Pale Matriarch can restore your homes. Lay down your weapons."],
 ["Runa","But where are the people? These streets are empty."],
 ["Commander","An illusion, Runa. A home needs people. Fight the Matriarch’s spell."]
 ],[
 ["Runa","It’s gone. I knew it wasn’t real. I still wanted to stay."],
 ["Commander","We’ll rebuild it ourselves. He doesn’t get to choose our future."]
 ]),
 chapter(4,"An Ally, Not a Weapon","Stop Quill poisoning the gardens so Rootmother can help bind Yshmir.","plague_doctor",[
 ["Auroline","Rootmother came to help. Her roots can hold the prison together while I cast."],
 ["Runa","Quill and Chispa are poisoning the channels. Her roots are withering!"],
 ["Commander","Stop them. We need an ally, not another sacrifice."]
 ],[
 ["Auroline","The poison is treated. Rootmother has steadied the prison walls. It’s time."],
 ["Runa","News from the ridge: they’ve planted our seeds. They believe we’re coming back."],
 ["Commander","Then let’s finish this and go home."]
 ]),
 chapter(5,"No One Belongs to You","Defeat Yshmir and free Hald while Auroline seals the prison.","yshmir_worldwound",[
 ["Runa","Yshmir is in the pit. He’s forcing Hald and Tessa to defend him."],
 ["Yshmir","Strike your teacher, Runa. He cannot stop while I command him."],
 ["Runa","Hald taught me mercy. I will not kill him for you."],
 ["Commander","Hold the wardens back. Strike Yshmir. Auroline—begin the binding spell!"]
 ],[
 ["Auroline","The binding is complete. Yshmir is sealed inside. He can’t reach us."],
 ["Runa","Hald and Tessa have dropped their weapons. They’re alive!"],
 ["Hald","Runa? I tried to stop my hands. I could not."],
 ["Runa","I know. Come home. We have a village to rebuild."]
 ])]}
};
export const STORY_DIFFICULTIES=['normal','hard','nightmare'];
export const STORY_CHAPTERS=Array.from({length:5},(_,i)=>({id:i+1,start:i*5+1,end:(i+1)*5}));
export function campaignArc(difficulty='normal'){return CAMPAIGN_ARCS[difficulty]||CAMPAIGN_ARCS.normal;}
export function campaignScene(difficulty,id){return campaignArc(difficulty).chapters[id-1]||null;}
export function narrativeKey(stage){return `${stage.difficulty}:map:${stage.number===1?'opening':Math.ceil(stage.number/5)}`;}
export const sceneViewed=(p,stage)=>(p.storySeen||[]).includes(narrativeKey(stage));
