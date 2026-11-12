// One continuing story. Guardian IDs document the actual campaign opponents;
// they do not alter formations, combat, artwork or reward rules.
const chapter=(id,title,summary,guardianId,before,after)=>({id,end:id*5,title,summary,guardianId,before,after});
export const CAMPAIGN_ARCS={
 normal:{act:'I',title:'The First Crossing',subtitle:'The Stolen Light',art:'world-map.svg',description:'The Beacon has gone dark. Follow the voice beneath the citadel before its promise of salvation becomes a kingdom’s ruin.',opening:[
 ['Nima','The Beacon above the citadel is dark. Brukk’s wardens have closed the Ashen Gate, and a voice is speaking through the bells.'],
 ['Yshmir','Your rulers have failed you. Open the Crown, and no one in this valley need fear again.'],
 ['Keeper','Then why are his followers blocking the road? We find out what he wants before anyone opens it.'],
 ['Nima','Get through the wardens. The river road leads to the citadel.']
 ],chapters:[
 chapter(1,'The Closed River','Open the Iron Crossroads and restore water to the villages.','bronze_juggernaut',[
 ['Nima','The Bronze Juggernaut has shut the sluices. The villages are running dry while the foundry draws everything toward the citadel.'],
 ['Keeper','We open the crossing. Whoever ordered this can explain why their promise of safety starts with starving the valley.']
 ],[
 ['Nima','The water is returning. These orders bear Auroline’s seal; she is building an engine around the Crown.'],
 ['Keeper','Then we follow its supply road. We need to speak to her.']
 ]),
 chapter(2,'The Warning in the Stone','Pass Obsidian Gate and discover what the Crown protects.','archangel_lucifer',[
 ['Nima','Lucifer holds Obsidian Gate. He says only those sworn to the Crown may pass.'],
 ['Keeper','There are older words beneath his banners: “Keep Yshmir bound.” The Crown is a prison seal.'],
 ['Nima','And the prisoner is promising to save the people above him.'],
 ['Keeper','Clear the gate. Auroline needs to see this warning before her engine starts.']
 ],[
 ['Nima','Lucifer has withdrawn. The old road is open.'],
 ['Keeper','Take a rubbing of the warning. A promise is easy to believe when you have never seen what it hides.']
 ]),
 chapter(3,'The Voice Takes Shape','Cross the aqueduct beneath Ruin Spire.','yshmir_worldwound',[
 ['Yshmir','You have seen the hungry villages. Give me the Crown, and I will make a kingdom that cannot fail them.'],
 ['Keeper','A kingdom ruled by you. What happens to anyone who refuses?'],
 ['Yshmir','There will be no need to refuse.'],
 ['Nima','He is reaching through a crack in the seal. His shape blocks the aqueduct, but his prison is still beneath the citadel. Break through.']
 ],[
 ['Nima','His shape is gone. The crack is still there.'],
 ['Keeper','We have stopped his reach, not freed the kingdom. The engine is drawing him closer.']
 ]),
 chapter(4,'The Last Quiet Garden','Reach the Crown’s water channels at Dragon’s Tooth.','bronze_juggernaut',[
 ['Nima','The dragon gardens feed the Crown through channels beneath these terraces. A second Bronze Juggernaut patrol is guarding the intake.'],
 ['Keeper','We clear the patrol and divert the flow away from the gardens. Then we reach Auroline before she feeds the seal anything else.']
 ],[
 ['Nima','The gardens are safe, but the engine is already charged. Closing the intake will not stop it now.'],
 ['Keeper','Then we disconnect it at the Crown. Bring the warning.']
 ]),
 chapter(5,'A Promise of Light','Reach Auroline at Worldwound Edge and stop the engine.','transmuter_prime',[
 ['Auroline','The Crown is failing. My engine will restore it. I will not let you leave this kingdom without its protection.'],
 ['Keeper','Yshmir gave you those instructions. His seal is weakening because your engine is draining it. Read the warning.'],
 ['Yshmir','They bring you a dead king’s words. I offer you a living kingdom. Stop them.'],
 ['Nima','Quill and Chispa are guarding the controls with her. Hold them back; I can disconnect the feed.']
 ],[
 ['Auroline','The voice has gone quiet. You were right—but the engine’s stored charge is escaping into the buried flame channels.'],
 ['Nima','Smoke at the foundry. More below the gardens. The kingdom is catching fire.'],
 ['Keeper','Sound the evacuation bells. Auroline, help us get the people out. We go back along the road.']
 ])]},
 hard:{act:'II',title:'The Ashfall March',subtitle:'The Last Road Out',art:'world-map-hard.svg',description:'The familiar road is burning. Lead the people out while Yshmir turns the failed engine into a doorway.',opening:[
 ['Nima','The Ashen Gate is crowded with families. Brukk’s wardens still bar the road while the hills burn behind them.'],
 ['Auroline','My orders kept them at their posts. Yshmir is using that obedience to hold the evacuation back.'],
 ['Keeper','Then we break his roadblocks. You find a way to contain the charge; we bring the people to the far ridge.'],
 ['Nima','The gate first. No one gets left behind it.']
 ],chapters:[
 chapter(1,'Water Through the Fire','Clear the Iron Crossroads for the first evacuation carts.','the_verdant_king',[
 ['Nima','The Verdant King has rooted his warband across the crossroads. He is trying to keep the fire from his woods, but the carts cannot pass.'],
 ['Keeper','We break the blockade and open the cold-water sluices. We need a safe road, not another wall between people and safety.']
 ],[
 ['Nima','The carts are through. The cold channel will hold the fire back for a while.'],
 ['Keeper','Send everyone toward Obsidian Gate. We clear the next crossing before they reach it.']
 ]),
 chapter(2,'A Gate for the Living','Open a passage through the burning fortress.','archangel_lucifer',[
 ['Nima','Lucifer is back at Obsidian Gate. He calls the fire a trial and refuses to open the fortress.'],
 ['Keeper','Those families have nothing left to prove. Clear his line and get the doors open.']
 ],[
 ['Nima','The last carts are inside. The fortress walls will shelter them until the aqueduct route is clear.'],
 ['Keeper','Keep both gates open. This place is a passage now, not a prison.']
 ]),
 chapter(3,'The Road Above the Flames','Hold the aqueduct while the wounded cross.','shade_prince',[
 ['Nima','The Shade Prince has taken the road beneath Ruin Spire. Ithreya and Vethra are with him. The wounded have no other way to the ridge.'],
 ['Keeper','We push them off the crossing and hold it until the stretchers pass. No pursuit into the smoke.']
 ],[
 ['Nima','The wounded are through. Auroline’s message says she can draw the fire back toward the Crown.'],
 ['Keeper','First we clear the gardens. The last families are still hiding there.']
 ]),
 chapter(4,'What Can Be Saved','Bring the garden settlements to the evacuation road.','the_verdant_king',[
 ['Nima','The Verdant King has fallen back to Dragon’s Tooth. His roots are keeping the walls upright, but his guards are stopping the families from leaving.'],
 ['Keeper','He cannot save the gardens by trapping people in them. Clear the guards; keep the fighting away from the shelters.']
 ],[
 ['Nima','The shelters are empty. Everyone we found is heading for the ridge. Look—the flames are bending toward the citadel.'],
 ['Keeper','Auroline’s containment is working. We reach her and finish this.']
 ]),
 chapter(5,'The Cost of the Crown','Stop the breach before it reaches the refugees.','archangel_lucifer',[
 ['Auroline','Yshmir changed the engine’s return path. I am not containing the charge; I am feeding his doorway.'],
 ['Keeper','Can you cut it off?'],
 ['Auroline','Only by breaking the Crown’s outer ring. That stops the spread, but the ring supports the ground around his prison. The citadel will fall. Lucifer holds the bridge to its controls.'],
 ['Keeper','The people have reached the far ridge. Clear the bridge and break the ring before the breach reaches them.']
 ],[
 ['Nima','Lucifer’s line is broken. The way is clear.'],
 ['Auroline','The charge has stopped. The ridge will hold—but the foundations beneath us are giving way.'],
 ['Keeper','Stay together. We have saved the people. Now we have to close what is taking their home.']
 ])]},
 nightmare:{act:'III',title:'The World Unmade',subtitle:'The Last Command',art:'world-map-nightmare.svg',description:'The citadel has fallen, exposing the prison beneath it. Cross the ruins and silence Yshmir before he takes the survivors’ last refuge.',opening:[
 ['Auroline','The broken ring has exposed the Crown’s inner lock. I can close it, but you must get me across the old road.'],
 ['Nima','Brukk’s wardens are still at the Ashen Gate. The walls are gone, and they are obeying a voice from the wound.'],
 ['Yshmir','You broke their kingdom. Give me the survivors, and I will build them another.'],
 ['Keeper','You do not get to call a prison a home. We clear the road and end this.']
 ],chapters:[
 chapter(1,'Roots Over the Wound','Cross the ruins of the Iron Crossroads.','elder_rootmother',[
 ['Nima','Elder Rootmother is holding the broken crossing together. The Crown’s command has turned her growth against anyone who approaches.'],
 ['Keeper','Drive her guardians back from the path. We need those roots standing until everyone is across.']
 ],[
 ['Nima','We are over. The roots are still holding, but every shout from the wound pulls them tighter.'],
 ['Keeper','Then we silence the source. Obsidian Gate is ahead.']
 ]),
 chapter(2,'The Broken Oath','Pass the last fortress above the shattered basin.','archangel_lucifer',[
 ['Nima','Lucifer has returned to Obsidian Gate. There is hardly a fortress left, but he still calls the Crown’s orders sacred.'],
 ['Keeper','His oath has become Yshmir’s leash. We break this last defense and reach the spire.']
 ],[
 ['Nima','The gate is clear. His followers are retreating from the wound.'],
 ['Keeper','Let them go. Yshmir has taken enough people’s choices from them.']
 ]),
 chapter(3,'The Kingdom That Never Burned','Resist the false voices beneath Ruin Spire.','pale_matriarch',[
 ['Nima','The Pale Matriarch is waiting at the aqueduct. Behind her, I can see the valley green again. I know it is not real.'],
 ['Keeper','Yshmir wants us to follow that picture off the road. The real people are on the ridge. We clear the crossing and keep going.']
 ],[
 ['Nima','The vision is gone. Just broken stone and an open road.'],
 ['Keeper','A hard truth is still a way forward. Bring Auroline through.']
 ]),
 chapter(4,'A Place to Begin Again','Reach the last bridge through the ruined gardens.','elder_rootmother',[
 ['Nima','Elder Rootmother’s growth has reached Dragon’s Tooth. The gardens are ruined, but there are living shoots beneath her guardians.'],
 ['Keeper','Clear the bridge without burning the roots. When the wound is closed, the survivors will need something left to plant.']
 ],[
 ['Nima','The bridge is steady. Auroline can reach the inner lock.'],
 ['Keeper','Then this is the last crossing. Keep the way open behind us.']
 ]),
 chapter(5,'No Kingdom of Chains','Hold Worldwound Edge while Auroline closes the inner lock.','shellback_brukk',[
 ['Nima','Brukk, Tavin and Tessa are at the final bridge—the same wardens we met at the gate. Yshmir has kept them for his last defense.'],
 ['Yshmir','Leave the lock alone. I can rebuild the valley. I can make them grateful.'],
 ['Keeper','They will rebuild it themselves. Hold the wardens here. Auroline, close his prison.'],
 ['Auroline','I hear him. I know what he is now. Keep the bridge clear; I am ending his command.']
 ],[
 ['Nima','The wound is closing. The wardens have lowered their weapons. For the first time, the bells are silent.'],
 ['Auroline','The lock is sealed. I cannot undo what I helped him do.'],
 ['Keeper','Then help us rebuild. The road is safe, and the people are waiting to come home.']
 ])]}
};
export const STORY_DIFFICULTIES=['normal','hard','nightmare'];
export const STORY_CHAPTERS=Array.from({length:5},(_,i)=>({id:i+1,start:i*5+1,end:(i+1)*5}));
export function campaignArc(difficulty='normal'){return CAMPAIGN_ARCS[difficulty]||CAMPAIGN_ARCS.normal;}
export function campaignScene(difficulty,id){return campaignArc(difficulty).chapters[id-1]||null;}
export function narrativeKey(stage){return `${stage.difficulty}:map:${stage.number===1?'opening':Math.ceil(stage.number/5)}`;}
export const sceneViewed=(p,stage)=>(p.storySeen||[]).includes(narrativeKey(stage));
