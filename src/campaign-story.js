// The three difficulties are successive acts, not alternate versions of events.
// Guardian IDs identify the existing milestone opponents, not story constraints.
const chapter=(id,title,summary,guardianId,before,after)=>({id,end:id*5,title,summary,guardianId,before,after});
export const CAMPAIGN_ARCS={
 normal:{act:'I',title:'The Missing Alchemist',subtitle:'A Knock Before Dawn',art:'world-map.svg',description:'Auroline has been taken to the citadel. Find her before her captors use her magic to release an imprisoned tyrant.',opening:[
 ['Runa','Auroline was taken last night. She is the alchemist who treats our village. Witnesses saw Lucifer’s soldiers carrying her toward the citadel.'],
 ['Commander','Then why are the city wardens stopping us from reporting it?'],
 ['Runa','I asked Brukk. He taught me to fight; he knows my face. Today he looked straight through me and raised his weapon.'],
 ['Commander','Something has happened to him. Defend yourself, but leave him alive. We are bringing Auroline home.']
 ],chapters:[
 chapter(1,'The Empty Wells','Restore the village water supply and learn where Auroline was taken.','bronze_juggernaut',[
 ['Runa','The wells have dried up. This Juggernaut is diverting the river toward the citadel, and its guards have driven the millers out.'],
 ['Commander','Get the millers back to their sluices. Then ask whether the prison cart passed this way. We can help the village and find her trail.']
 ],[
 ['Runa','The millers have opened the river again. They saw Auroline in a prison cart. She dropped this note: “Lucifer needs my magic. Do not trust the voice.”'],
 ['Commander','She knew someone would follow. We take her note to Obsidian Gate, where Lucifer commands the garrison.']
 ]),
 chapter(2,'The King Beneath the City','Confront Lucifer about the prisoner under the citadel.','archangel_lucifer',[
 ['Lucifer','Yshmir ruled this valley before your factions tore it apart. Auroline will release him. One king, one law, and an end to these endless wars.'],
 ['Commander','You kidnapped her. Is that how your peace begins?'],
 ['Lucifer','She refused to serve. That will cease to matter when he wakes.'],
 ['Runa','The old monument names Yshmir a tyrant, imprisoned beneath the citadel. Lucifer is not rescuing a king. He is freeing him.']
 ],[
 ['Runa','Lucifer has fled to the citadel. His soldiers left their orders behind: Auroline is being held at the prison beneath it.'],
 ['Commander','He is forcing her to open it. If we can free her before the ritual ends, we can stop him.']
 ]),
 chapter(3,'The Offer','Resist Yshmir’s apparition at Ruin Spire.','yshmir_worldwound',[
 ['Yshmir','Your friend Brukk has stopped struggling. He is never frightened, never uncertain. I can give you that peace, Runa.'],
 ['Runa','You made him attack someone he cared about. That is not peace.'],
 ['Commander','His body is still imprisoned, but the ritual has let this apparition through. Stay with me. It cannot have her.']
 ],[
 ['Runa','It vanished when we struck it. For a moment, though, I wanted to believe him. I wanted Brukk back the way he was.'],
 ['Commander','Then we help the real Brukk. We do not give Yshmir another person to command.']
 ]),
 chapter(4,'Those Who Refused','Free the prisoners being held in the gardens.','bronze_juggernaut',[
 ['Runa','There are people locked inside the garden storehouse. They refused Lucifer’s soldiers when he ordered the villages to send supplies.'],
 ['Commander','That Juggernaut is their jailer. Free them, and ask the gardeners to lead them home. We cannot leave them here.']
 ],[
 ['Runa','One prisoner worked at the citadel. Quill and Chispa are guarding Auroline there. Lucifer has bound her to the ritual; she cannot stop it herself.'],
 ['Commander','Now we know what she needs. We break the spell holding her, not the prison beneath her.']
 ]),
 chapter(5,'Bring Her Home','Break the spell forcing Auroline to open Yshmir’s prison.','transmuter_prime',[
 ['Auroline','Stay back! He is making me cast. I cannot turn my hands away.'],
 ['Runa','Auroline, it is us. We found your note. Tell us how to help you.'],
 ['Auroline','Weaken my magic and the binding will break. Do not let Quill and Chispa reach me while you do it.'],
 ['Commander','You are not alone anymore. We are getting you out.']
 ],[
 ['Auroline','I can move again. But the prison is cracked. Yshmir can reach the valley now, even though his body is still trapped.'],
 ['Yshmir','You would leave me buried? Then watch what becomes of the kingdom you chose instead.'],
 ['Runa','The fields are burning. He is setting them alight!'],
 ['Commander','Ring the village bells. Get everyone out of their homes. Auroline, come with us.']
 ])]},
 hard:{act:'II',title:'The Burning Valley',subtitle:'People Before Stone',art:'world-map-hard.svg',description:'Yshmir is burning the valley to force its people to submit. Rescue the villages and defend the refugees from Lucifer’s army.',opening:[
 ['Runa','The evacuation has reached Ashen Gate. Brukk’s wardens are still there. Families are pleading with them to open it.'],
 ['Auroline','Yshmir commands the wardens through their oath to the old throne. They cannot disobey him. That is what happened to Brukk.'],
 ['Commander','Then we fight them back from the gates and let the families through. No chasing them once the people are safe.'],
 ['Auroline','I will guide the refugees to the ridge beyond the valley. The prison is failing; Yshmir will break free before dawn. We cannot leave people here when he does.']
 ],chapters:[
 chapter(1,'Water for the Living','Release the water trapped in the Verdant King’s grove.','the_verdant_king',[
 ['Runa','The Verdant King has dammed the river to save his grove from the fire. The villages downstream have nothing left to fight it with.'],
 ['Commander','Ask him to share it. If he sends his guards at us, hold them back while the millers open the dam. We will not let a village burn for his trees.']
 ],[
 ['Runa','The water is reaching the houses. The millers are steering some back toward the grove, too. We may save both.'],
 ['Commander','Good. Leave them the tools and take the wounded to Obsidian Gate. Its stone halls can shelter them.']
 ]),
 chapter(2,'The Price of Shelter','Rescue the families Lucifer has imprisoned in the fortress.','archangel_lucifer',[
 ['Lucifer','These people have shelter. They need only swear themselves to Yshmir. When he rises, he will spare the obedient.'],
 ['Runa','The same oath that took Brukk’s mind? You are turning frightened families into slaves.'],
 ['Commander','We came here for shelter. Now we are getting them out of your cells.']
 ],[
 ['Runa','The cells are open. Lucifer escaped while we were helping the prisoners. We could have caught him.'],
 ['Commander','And left those people in a burning fortress. We made the right choice. There is still time to stop him.']
 ]),
 chapter(3,'The Stolen Medicine','Recover the refugee supplies taken by the Shade Prince.','shade_prince',[
 ['Runa','The Shade Prince has stolen the medicine carts. His warband is selling passage across the aqueduct to people who have nothing left.'],
 ['Commander','The wounded need those carts tonight. Take them back. He can keep his toll.']
 ],[
 ['Runa','The medicine is intact. Auroline has enough to treat the burns, and the refugees have food for the climb to the ridge.'],
 ['Commander','Send the carts with an escort. We still have missing families in the gardens.']
 ]),
 chapter(4,'Something for Tomorrow','Rescue the families trapped beneath the garden terraces.','the_verdant_king',[
 ['Runa','The Verdant King’s warband retreated here after we opened the dam. His roots are crushing the garden shelters. There are children inside.'],
 ['Commander','Keep his guards occupied. I will reach the shelters. Tell the gardeners to mark every occupied cellar.']
 ],[
 ['Runa','The families are out. The King withdrew when his guards fell. One gardener went back for a chest—I thought it was gold. It is seeds.'],
 ['Commander','Then put it on the last cart to the ridge. Once these people are safe, they will need a reason to come back.'],
 ['Auroline','I have come back from the ridge. The refugees are safe for now, but Lucifer is gathering an army at the citadel. He means to force them back into the valley.']
 ]),
 chapter(5,'Nobody Kneels','Defeat Lucifer’s army before it can attack the refugee camp.','archangel_lucifer',[
 ['Lucifer','When Yshmir rises, his subjects will welcome him. I will bring them down from that ridge on their knees.'],
 ['Runa','You will have to get through us first.'],
 ['Auroline','The refugees cannot defend themselves. Break his army here, before it reaches them.'],
 ['Commander','You wanted people to kneel, Lucifer. Look around you. We are still standing.']
 ],[
 ['Runa','His soldiers are throwing down their weapons. Lucifer has fled. The camp is safe.'],
 ['Yshmir','You have turned my subjects against me. Then there will be no city left for you to save.'],
 ['Auroline','He is tearing through the prison! The citadel is falling into it.'],
 ['Commander','Down the western stairs. The ridge is beyond the collapse. Stay together!']
 ])]},
 nightmare:{act:'III',title:'What Remains',subtitle:'Back Into the Ruins',art:'world-map-nightmare.svg',description:'Yshmir has broken free beneath the fallen citadel. Return to the ruins and bind him again before he reaches the refugees.',opening:[
 ['Runa','The ridge held. The people are alive. But Yshmir is calling them back to the ruins, promising to rebuild everything. Some are listening.'],
 ['Auroline','His body is free, but he is still gathering strength in the pit beneath the citadel. I can bind him again with the spell that imprisoned him before.'],
 ['Commander','Where do we find it?'],
 ['Auroline','Lucifer used an ancient scroll to force the prison open. I saw the binding spell on it. He kept the scroll—find him, and we can undo what he started.']
 ],chapters:[
 chapter(1,'The People Left Behind','Free the survivors caught in Elder Rootmother’s enchanted roots.','elder_rootmother',[
 ['Runa','There are people in those roots. Elder Rootmother sheltered them during the collapse, but now she will not let them go.'],
 ['Yshmir','No hunger. No grief. They can sleep until I have made the world worthy of them.'],
 ['Commander','He is speaking through her. Auroline, can you free her without hurting the people she is holding?'],
 ['Auroline','Yes. Keep her guardians away from me while I undo the enchantment.']
 ],[
 ['Auroline','They are waking. Rootmother is letting them go. I have quieted the spell here, but Yshmir will keep turning the valley against us until he is bound.'],
 ['Runa','We will take them to the ridge. They deserve to choose where they sleep.']
 ]),
 chapter(2,'A King Without Mercy','Take the binding spell from Lucifer at the ruined fortress.','archangel_lucifer',[
 ['Runa','Lucifer is searching the fallen archives. His own followers are buried underneath them. He has not even tried to help.'],
 ['Lucifer','The king has risen. Whatever the cost, I was right.'],
 ['Commander','You have the spell that can stop him. Hand it over. There is still one thing you can put right.'],
 ['Lucifer','I will not kneel to the people who destroyed my triumph.']
 ],[
 ['Runa','He dropped the scroll when he fled. His surviving followers are digging their friends out. We left them our ropes.'],
 ['Auroline','This is the binding spell. It must be spoken inside the prison. Yshmir will do everything he can to keep me from finishing it.']
 ]),
 chapter(3,'The Home She Remembered','Reject the Pale Matriarch’s false vision of the valley.','pale_matriarch',[
 ['Runa','The aqueduct is whole. The houses, too. I can see our village. This is how it looked before any of this happened.'],
 ['Yshmir','The Pale Matriarch can give them back their homes. Lay down your weapons. Let them have something beautiful.'],
 ['Runa','Where are the people? The millers, the children—we brought them out. None of them are here.'],
 ['Commander','He has made a picture, not a home. Do not let the Matriarch draw you into it.']
 ],[
 ['Runa','The vision is gone. I knew it could not be real, but I still wanted to stay.'],
 ['Commander','Keep that memory. We can build toward it ourselves. He does not get to use it against you.']
 ]),
 chapter(4,'An Ally, Not a Weapon','Stop Quill poisoning the gardens so Rootmother can help bind Yshmir.','plague_doctor',[
 ['Auroline','Rootmother has followed us to help. Her roots can support the broken prison while I cast the binding spell.'],
 ['Runa','But they are withering. Quill and Chispa are pouring poison into the garden channels. They know what we are trying to do.'],
 ['Commander','Stop them before the poison reaches her. We need Rootmother alive, not another sacrifice.']
 ],[
 ['Auroline','The vats are broken. I have treated the poisoned roots, and Rootmother is holding the prison walls together. She has given us our chance.'],
 ['Runa','A gardener brought a message from the ridge. They are planting those seeds we saved. They believe we are coming back.'],
 ['Commander','Then let us finish this and go home.']
 ]),
 chapter(5,'No One Belongs to You','Defeat Yshmir and free Brukk while Auroline seals the prison.','yshmir_worldwound',[
 ['Runa','Yshmir is in the pit. Brukk and Tessa are beside him. He is making them defend him.'],
 ['Yshmir','Strike your teacher, Runa. He will never stop while I command him.'],
 ['Runa','Brukk taught me to stop a fight without taking a life. I will not kill him for you.'],
 ['Commander','Hold the wardens back and strike Yshmir. Auroline, begin the spell. Rootmother is holding the walls; we will keep him away from you.']
 ],[
 ['Auroline','Yshmir has fallen back into the prison. The binding is complete, and the cracks are sealed. He cannot reach us anymore.'],
 ['Runa','Brukk and Tessa have dropped their weapons. They are alive.'],
 ['Brukk','Runa? I remember the gate. I tried to stop my hands. I could not.'],
 ['Runa','I know. Come with us. There are people waiting on the ridge, and a village that needs rebuilding.']
 ])]}

};
export const STORY_DIFFICULTIES=['normal','hard','nightmare'];
export const STORY_CHAPTERS=Array.from({length:5},(_,i)=>({id:i+1,start:i*5+1,end:(i+1)*5}));
export function campaignArc(difficulty='normal'){return CAMPAIGN_ARCS[difficulty]||CAMPAIGN_ARCS.normal;}
export function campaignScene(difficulty,id){return campaignArc(difficulty).chapters[id-1]||null;}
export function narrativeKey(stage){return `${stage.difficulty}:map:${stage.number===1?'opening':Math.ceil(stage.number/5)}`;}
export const sceneViewed=(p,stage)=>(p.storySeen||[]).includes(narrativeKey(stage));
