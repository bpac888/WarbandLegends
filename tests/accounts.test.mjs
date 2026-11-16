import test from 'node:test';
import assert from 'node:assert/strict';
import {createAccountHandler} from '../server/accounts.js';
import {AccountClient} from '../src/accounts.js';
const user={id:'player-a',email:'player@example.com'};
const token={access_token:'access',refresh_token:'refresh',user};
const env={SUPABASE_URL:'https://auth.example.com',SUPABASE_ANON_KEY:'public-key',NODE_ENV:'production'};
const response=(data,status=200)=>new Response(JSON.stringify(data),{status});
async function call({action='session',method='GET',body,origin='https://game.example.com',cookie,fetcher,configured=true}={}){
 const headers={host:'game.example.com',origin,'content-type':'application/json',...(cookie?{cookie}:{})},req={url:'/api/account?action='+action,method,headers,body};
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},end(raw){this.body=JSON.parse(raw);}};
 await createAccountHandler({env:configured?env:{},fetcher:fetcher||(()=>{throw Error('Unexpected request');})})(req,res);return res;
}
const sessionCookie=(remember=false)=>'warband_session='+Buffer.from(JSON.stringify({access:'access',refresh:'refresh',remember})).toString('base64url');
test('unconfigured accounts fail closed; signed-out sessions have no save',async()=>{
 assert.equal((await call({configured:false})).statusCode,503);assert.deepEqual((await call()).body,{user:null});
});
test('cross-origin writes and invalid credentials never reach Supabase',async()=>{
 assert.equal((await call({method:'POST',action:'login',origin:'https://evil.example',body:{}})).statusCode,403);
 assert.equal((await call({method:'POST',action:'login',body:{email:'bad',password:'12345678'}})).statusCode,400);
 assert.equal((await call({method:'POST',action:'login',body:{email:user.email,password:'short'}})).statusCode,400);
});
test('registration normalizes email; remember changes only cookie duration; tokens stay HttpOnly',async()=>{
 for(const remember of [true,false]){
  const res=await call({method:'POST',action:'register',body:{email:' Player@Example.COM ',password:'longpassword',remember},fetcher:async(url,options)=>{assert.ok(url.endsWith('/signup'));assert.deepEqual(JSON.parse(options.body),{email:user.email,password:'longpassword'});return response(token);}});
  assert.equal(res.statusCode,200);assert.deepEqual(res.body,{user});const cookie=res.headers['Set-Cookie'];assert.match(cookie,/HttpOnly; SameSite=Lax; Secure/);assert.equal(cookie.includes('Max-Age=2592000'),remember);assert.ok(!JSON.stringify(res.body).includes('access'));
 }
});
test('duplicate registration, wrong password and rate limits are errors',async()=>{
 for(const [action,status,data,expected] of [['register',422,{code:'user_already_exists'},400],['login',400,{},400],['login',429,{},429]]){
  const res=await call({method:'POST',action,body:{email:user.email,password:'longpassword'},fetcher:async()=>response(data,status)});assert.equal(res.statusCode,expected);
 }
});
test('email confirmation does not create a session cookie',async()=>{
 const res=await call({method:'POST',action:'register',body:{email:user.email,password:'longpassword'},fetcher:async()=>response({user})});assert.equal(res.body.confirmationRequired,true);assert.equal(res.headers['Set-Cookie'],undefined);
});
test('expired access tokens refresh and load only authenticated player save',async()=>{
 const paths=[];const res=await call({cookie:sessionCookie(true),fetcher:async(url,options)=>{paths.push(url);if(paths.length===1)return response({},401);if(url.includes('refresh_token'))return response(token);if(url.endsWith('/user'))return response(user);assert.ok(url.includes('user_id=eq.player-a'));assert.equal(options.headers.Authorization,'Bearer access');return response([{profile:{gold:42},revision:3}]);}});
 assert.equal(res.body.save.revision,3);assert.match(res.headers['Set-Cookie'],/Max-Age=2592000/);assert.equal(paths.length,4);
});
test('account changes and conflicts cannot overwrite saves; identity comes from session',async()=>{
 const profile={team:['a','b','c','d','e'],collection:{}};
 const changed=await call({method:'POST',action:'save',cookie:sessionCookie(),body:{userId:'player-b',profile,revision:1},fetcher:async()=>response(user)});assert.equal(changed.statusCode,409);
 let calls=0;const conflict=await call({method:'POST',action:'save',cookie:sessionCookie(),body:{userId:user.id,profile,revision:1},fetcher:async(url,options)=>{calls++;if(url.endsWith('/user'))return response(user);assert.deepEqual(JSON.parse(options.body),{new_profile:profile,expected_revision:1});return response({code:'P0001'},400);}});assert.equal(conflict.statusCode,409);assert.equal(calls,2);
});
test('logout revokes local session and clears the cookie',async()=>{
 const res=await call({method:'POST',action:'logout',cookie:sessionCookie(),body:{},fetcher:async url=>{assert.ok(url.endsWith('/logout?scope=local'));return response({});}});assert.equal(res.statusCode,200);assert.match(res.headers['Set-Cookie'],/Max-Age=0/);
});
function memory(){const values=new Map();return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};}
test('client serializes concurrent saves and preserves newer pending progress',async()=>{
 let release,started;const firstStarted=new Promise(r=>started=r),storage=memory(),writes=[];
 const client=new AccountClient({storage,request:async(url,options)=>{const body=JSON.parse(options.body);writes.push(body);if(writes.length===1){started();await new Promise(r=>release=r);}return response({revision:body.revision+1});}});client.user=user;
 client.queue({gold:1});const flushed=client.flush();await firstStarted;client.queue({gold:2});release();await flushed;
 assert.deepEqual(writes.map(w=>[w.revision,w.profile.gold,w.userId]),[[0,1,user.id],[1,2,user.id]]);assert.equal(storage.getItem(client.cacheKey()),null);assert.equal(client.pending,null);
});
test('pending saves survive network failure and are retried; conflicting cloud saves are protected',async()=>{
 const storage=memory(),client=new AccountClient({storage,request:async()=>response({error:'offline'},503)});client.user=user;client.queue({gold:7});await assert.rejects(client.flush());assert.ok(storage.getItem(client.cacheKey()));
 client.request=async()=>response({user,save:{profile:{gold:20},revision:2}});await assert.rejects(client.restore(),/cloud save changed/);assert.equal(client.conflict,true);assert.deepEqual(await client.restore(true),{gold:20});assert.equal(storage.getItem(client.cacheKey()),null);
});
test('a save accepted before connection loss is recognized on the next session',async()=>{
 const storage=memory(),client=new AccountClient({storage,request:async()=>response({user,save:{profile:{gold:7},revision:1}})});client.user=user;storage.setItem(client.cacheKey(),JSON.stringify({profile:{gold:7},revision:0}));assert.deepEqual(await client.restore(),{gold:7});assert.equal(client.pending,null);
});
test('save failures prevent logout and keep pending progress recoverable',async()=>{
 const storage=memory(),client=new AccountClient({storage,request:async url=>{assert.ok(url.includes('action=save'));return response({error:'offline'},503);}});client.user=user;client.queue({gold:3});await assert.rejects(client.logout());assert.deepEqual(client.user,user);assert.ok(storage.getItem(client.cacheKey()));
});
test('expired sessions request login once and preserve unsaved progress',async()=>{
 const statuses=[],client=new AccountClient({storage:memory(),onStatus:(text,status)=>statuses.push(status),request:async()=>response({error:'Please log in again.'},401)});client.user=user;client.queue({gold:8});await assert.rejects(client.flush());assert.equal(client.needsLogin,true);await assert.rejects(client.flush(),/log in/);assert.ok(statuses.includes(401));assert.ok(client.pending);
});
test('server refuses cross-scheme requests in production and oversized JSON',async()=>{
 assert.equal((await call({method:'POST',action:'login',origin:'http://game.example.com',body:{}})).statusCode,403);
 assert.equal((await call({method:'POST',action:'save',body:{padding:'a'.repeat(1000001)}})).statusCode,413);
});
