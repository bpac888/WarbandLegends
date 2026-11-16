export class AccountClient {
 constructor({request=(...args)=>fetch(...args),storage=window.localStorage,onStatus=()=>{}}={}){this.request=request;this.storage=storage;this.onStatus=onStatus;this.user=null;this.revision=0;this.pending=null;this.running=null;this.timer=null;this.conflict=false;this.needsLogin=false;this.lastSaved=null;}
 async api(action,body){
  let response;try{response=await this.request(`/api/account?action=${action}`,{method:body===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)});}catch{throw Error('Unable to connect. Check your connection and try again.');}
  const result=await response.json().catch(()=>({error:'Player accounts are not available yet. Please try again later.'}));
  if(!response.ok){const error=Error(result.error||'Account request failed.');error.status=response.status;throw error;}return result;
 }
 key(key){return `${key}.account.${this.user.id}`;}
 cacheKey(){return `warband.pending.${this.user.id}`;}
 async restore(discardPending=false){
  const result=await this.api('session');this.user=result.user;
  if(!this.user){this.pending=null;return null;}
  this.needsLogin=false;this.revision=result.save?.revision||0;this.lastSaved=JSON.stringify(result.save?.profile||null);this.conflict=false;
  let cached;try{cached=JSON.parse(this.storage.getItem(this.cacheKey()));}catch{}
  if(cached&&JSON.stringify(cached.profile)===this.lastSaved)cached=null;
  if(cached&&!discardPending){
   if(cached.revision!==this.revision){this.conflict=true;const error=Error('This device has unsaved progress and the cloud save changed elsewhere. Load the latest cloud save to continue.');error.status=409;throw error;}
   this.pending=cached.profile;return cached.profile;
  }
  this.storage.removeItem(this.cacheKey());this.pending=null;return result.save?.profile||null;
 }
 async authenticate(mode,credentials){const result=await this.api(mode,credentials);return result;}
 queue(profile){
  if(!this.user||this.conflict||!this.pending&&JSON.stringify(profile)===this.lastSaved)return;
  this.pending=structuredClone(profile);this.writePending();
  this.onStatus('Saving progress…');clearTimeout(this.timer);this.timer=setTimeout(()=>this.flush().catch(()=>{}),600);
 }
 writePending(){try{this.storage.setItem(this.cacheKey(),JSON.stringify({revision:this.revision,profile:this.pending}));}catch{}}
 async flush(){
  clearTimeout(this.timer);if(this.running){await this.running;if(this.pending)return this.flush();return;}
  if(!this.pending||!this.user)return;
  if(this.needsLogin)throw Error('Please log in again.');
  if(this.conflict)throw Error('Progress changed elsewhere. Reload to load the latest cloud save.');
  this.running=(async()=>{while(this.pending){
   const snapshot=this.pending;
   try{const result=await this.api('save',{userId:this.user.id,profile:snapshot,revision:this.revision});this.revision=result.revision;this.lastSaved=JSON.stringify(snapshot);if(this.pending===snapshot){this.pending=null;this.storage.removeItem(this.cacheKey());}else this.writePending();this.onStatus(this.pending?'Saving progress…':'Progress saved');}
   catch(error){if(error.status===409)this.conflict=true;if(error.status===401)this.needsLogin=true;this.onStatus([401,409].includes(error.status)?error.message:'Progress saved on this device. Cloud sync pending.',error.status);throw error;}
  }})();
  try{await this.running;}finally{this.running=null;}
 }
 async logout(){await this.flush();await this.api('logout',{});this.user=null;this.pending=null;this.lastSaved=null;this.conflict=false;}
}
export function accountForm(mode='choose'){
 if(mode==='choose')return `<div class="account-choice"><p>Keep your warband’s progress with you.</p><button class="button gold" data-action="account-mode" data-mode="register">Register</button><button class="button outline" data-action="account-mode" data-mode="login">Login</button></div>`;
 return `<form id="account-form" data-mode="${mode}"><label for="account-email">Email address</label><input id="account-email" name="email" type="email" autocomplete="username" maxlength="254" required autofocus><label for="account-password">Password</label><input id="account-password" name="password" type="password" autocomplete="${mode==='register'?'new-password':'current-password'}" minlength="8" maxlength="128" required>${mode==='register'?'<small>At least 8 characters.</small>':''}<label class="account-remember"><input name="remember" type="checkbox"> Remember me</label><p class="account-message" role="status" aria-live="polite"></p><button class="button gold" type="submit">Enter</button><button class="text-button" type="button" data-action="account-mode" data-mode="${mode==='register'?'login':'register'}">${mode==='register'?'Already have an account? Login':'New here? Register'}</button></form>`;
}
