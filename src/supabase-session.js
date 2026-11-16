// Cross-origin sessions for static hosting. Refresh tokens stay on this device;
// passwords are never saved. The Edge Function verifies every access token.
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
export class SupabaseSession {
 constructor({config,request=(...args)=>fetch(...args),storage,sessionStorage,locks=globalThis.navigator?.locks,now=Date.now}={}){
  this.config=config;this.request=request;this.local=storage;this.tab=sessionStorage;this.locks=locks;this.now=now;this.memory=null;this.memoryOnly=false;this.refreshing=null;
  const project=new URL(config.supabaseUrl);if(project.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(project.hostname))throw Error('A secure Supabase URL is required.');
  this.key='warband.auth.'+project.hostname;this.url=config.supabaseUrl.replace(/\/$/,'')+'/functions/v1/'+encodeURIComponent(config.functionName||'warband');
 }
 read(){
  let raw;for(const storage of [this.tab,this.local])try{raw=storage?.getItem(this.key);if(raw)break;}catch{}if(!raw&&!this.memoryOnly)return null;
  let session;try{session=raw?JSON.parse(raw):this.memory;}catch{return null;}
  if(!session?.access_token||!session?.refresh_token)return null;
  if(session.rememberUntil&&session.rememberUntil<=this.now()){this.clear();return null;}return session;
 }
 write(session,{remember=false,rememberUntil}={}){
  const value={access_token:session.access_token,refresh_token:session.refresh_token,expires_at:session.expires_at||Math.floor(this.now()/1000)+(session.expires_in||3600),user:session.user,rememberUntil:rememberUntil||(remember?this.now()+30*86400000:null)};
  this.clear();this.memory=value;const target=value.rememberUntil?this.local:this.tab;
  try{if(!target)throw Error('Storage unavailable');target.setItem(this.key,JSON.stringify(value));this.memoryOnly=false;}catch{this.memoryOnly=true;}
  return value;
 }
 clear(){for(const storage of [this.local,this.tab])try{storage?.removeItem(this.key);}catch{}this.memory=null;this.memoryOnly=false;}
 async locked(fn){return this.locks?.request?this.locks.request(this.key,fn):fn();}
 async send(action,body,access){
  return this.request(this.url+'?action='+encodeURIComponent(action),{method:body===undefined?'GET':'POST',credentials:'omit',cache:'no-store',headers:{apikey:this.config.publishableKey,...(access?{Authorization:'Bearer '+access}:{}),...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
 }
 async refresh(failedAccess){
  if(this.refreshing)return this.refreshing;
  this.refreshing=this.locked(async()=>{
   const current=this.read();if(!current)return null;
   if(current.access_token!==failedAccess&&current.expires_at*1000>this.now()+30000)return current;
   const response=await this.send('refresh',{refreshToken:current.refresh_token});
   if(!response.ok){if([400,401,403].includes(response.status)){this.clear();return null;}throw Error('Could not refresh your session. Please try again.');}
   const result=await response.json(),latest=this.read();if(latest?.refresh_token!==current.refresh_token)return latest;
   return this.write(result.session,{rememberUntil:current.rememberUntil});
  });try{return await this.refreshing;}finally{this.refreshing=null;}
 }
 async apiResponse(action,body){
  if(action==='login'||action==='register'){
   const response=await this.send(action,body),result=await response.clone().json().catch(()=>null);
   if(response.ok&&result?.session)await this.locked(()=>this.write(result.session,{remember:body.remember===true}));
   // Auth tokens belong to this transport; normal game code only sees the user.
   if(response.ok&&result?.session){delete result.session;return reply(result);}return response;
  }
  let session=this.read();
  if(!session){if(action==='session')return reply({user:null});if(action==='logout'){this.clear();return reply({ok:true});}return reply({error:'Please log in again.'},401);}
  if(session.expires_at*1000<=this.now()+30000)session=await this.refresh(session.access_token);
  if(!session)return action==='session'?reply({user:null}):reply({error:'Your session expired. Please log in again.'},401);
  if(action==='logout'&&body?.userId&&session.user?.id!==body.userId)return reply({error:'The signed-in account changed in another tab. Reload before logging out.'},409);
  let response=await this.send(action,body,session.access_token);
  if(response.status===401){session=await this.refresh(session.access_token);if(!session)return action==='session'?reply({user:null}):reply({error:'Your session expired. Please log in again.'},401);response=await this.send(action,body,session.access_token);}
  if(action==='logout'&&response.ok)await this.locked(()=>this.clear());return response;
 }
}
