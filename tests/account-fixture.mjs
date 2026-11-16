// Existing gameplay suites predate accounts and stage profiles in browser storage.
// Adapt only their served app response to an already-authenticated local fixture.
// Account integration tests never use this adapter; production source is untouched.
export function accountFixtureResponse(file,body){
 if(!file.endsWith('/src/app.js'))return body;
 let source=body.toString();
 source=source.replace('let accountReady=false','let accountReady=true');
 source=source.replace('profile=defaultProfile();renderRoute();','profile=loadProfile(storage,roster);byId=new Map(battleRoster(profile,roster).map(c=>[c.id,c]));battle=null;clearBattleSave(storage);if(profile.eventEntry)profile={...profile,eventEntry:null};persist(PROFILE_KEY,profile);renderRoute();');
 source=source.replace('\nboot();',"\naccount.user={id:'gameplay-fixture',email:'fixture@example.com'};account.key=key=>key;account.queue=()=>{};\nboot();");
 return Buffer.from(source);
}
