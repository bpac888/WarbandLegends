import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {createSupabaseEdgeHandler} from '../server/supabase-edge.js';
import {SupabaseSession} from '../src/supabase-session.js';
const roster=JSON.parse(fs.readFileSync(new URL('../data/champions.json',import.meta.url))),origin='https://bpac888.github.io',env={SUPABASE_URL:'https://project.supabase.co',SUPABASE_ANON_KEY:'anon-key',SUPABASE_SERVICE_ROLE_KEY:'server-only-secret'},user={id:'11111111-1111-4111-8111-111111111111',email:'one@example.com'},config={supabaseUrl:env.SUPABASE_URL,publishableKey:'sb_publishable_example',functionName:'warband'};
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
const providerSession=(access='access-1',refresh='refresh-1')=>({access_token:access,refresh_token:refresh,expires_at:Math.floor(Date.now()/1000)+3600,user});
const memory=()=>{const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};};
const request=(action,body,{access='access-1',site=origin,method}={})=>new Request(env.SUPABASE_URL+'/functions/v1/warband?action='+action,{method:method||(body===undefined?'GET':'POST'),headers:{...(site?{Origin:site}:{}),...(access?{Authorization:'Bearer '+access}:{}),...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body)});
test('Edge preflight permits only the GitHub Pages origin and never uses cross-site cookies',async()=>{
 const handler=createSupabaseEdgeHandler({env,roster,fetcher:()=>assert.fail('Unexpected upstream call')});
 const response=await handler(request('session',undefined,{method:'OPTIONS'}));assert.equal(response.status,204);assert.equal(response.headers.get('access-control-allow-origin'),origin);assert.equal(response.headers.get('access-control-allow-credentials'),null);
 const denied=await handler(request('login',{email:user.email,password:'password123'},{site:'https://evil.example'}));assert.equal(denied.status,403);assert.equal(denied.headers.get('access-control-allow-origin'),null);assert.equal((await handler(request('save',{}, {site:null}))).status,403);
 const health=await handler(request('health',undefined,{site:null,access:null}));assert.deepEqual(await health.json(),{service:'warband',ready:true});
});
test('Edge login normalizes email and confirmation never invents a signed-in session',async()=>{
 let confirmation=false;const handler=createSupabaseEdgeHandler({env,roster,fetcher:async(url,options)=>{assert.equal(options.headers.apikey,'anon-key');assert.equal(options.headers.Authorization,undefined);assert.deepEqual(JSON.parse(options.body),{email:user.email,password:'password123'});return json(confirmation?{user}:providerSession());}});
 const signed=await handler(request('register',{email:' One@Example.COM ',password:'password123'}));assert.equal(signed.status,200);const data=await signed.json();assert.equal(data.session.user.id,user.id);assert.equal(signed.headers.get('set-cookie'),null);confirmation=true;const result=await(await handler(request('register',{email:user.email,password:'password123'}))).json();assert.equal(result.confirmationRequired,true);assert.equal(result.session,undefined);
});
test('Edge authenticates the bearer and rejects cross-account saves before database writes',async()=>{
 const paths=[];const handler=createSupabaseEdgeHandler({env,roster,fetcher:async(url,options)=>{paths.push(url);assert.equal(options.headers.Authorization,'Bearer access-1');if(url.endsWith('/auth/v1/user'))return json(user);assert.fail('Should not write another player’s save');}});
 assert.equal((await handler(request('save',{userId:'another-user',revision:0,profile:{team:Array(5).fill('a'),collection:{}}}))).status,409);assert.equal(paths.length,1);
 assert.deepEqual(await(await handler(request('session',undefined,{access:null}))).json(),{user:null});
});
test('Edge save uses the player JWT; tournament RPCs alone use the service credential',async()=>{
 const handler=createSupabaseEdgeHandler({env,roster,fetcher:async(url,options)=>{
  if(url.endsWith('/auth/v1/user'))return json(user);
  if(url.endsWith('/save_player_progress')){assert.equal(options.headers.Authorization,'Bearer access-1');assert.equal(options.headers.apikey,'anon-key');return json(4);}
  assert.ok(url.endsWith('/championship_dashboard'));assert.equal(options.headers.Authorization,'Bearer server-only-secret');assert.equal(options.headers.apikey,'server-only-secret');assert.deepEqual(JSON.parse(options.body),{player:user.id});return json({rankings:[]});
 }});
 assert.deepEqual(await(await handler(request('save',{userId:user.id,revision:3,profile:{team:Array(5).fill('a'),collection:{}}}))).json(),{revision:4});
 const championship=await handler(request('championship-dashboard'));assert.deepEqual(await championship.json(),{rankings:[]});
});
test('Edge rejects oversized bodies, wrong methods, unverified users and invalid refresh requests',async()=>{
 const handler=createSupabaseEdgeHandler({env,roster,fetcher:async()=>json({},401)});
 assert.equal((await handler(request('save',{padding:'a'.repeat(1000001)}))).status,413);assert.equal((await handler(request('logout'))).status,405);assert.equal((await handler(request('session'))).status,401);assert.equal((await handler(request('refresh',{refreshToken:''}))).status,400);
});
test('remembered sessions use local storage for 30 days; non-remembered sessions use tab storage',async()=>{
 const local=memory(),tab=memory(),transport=new SupabaseSession({config,storage:local,sessionStorage:tab,request:async(url,options)=>{assert.equal(options.credentials,'omit');assert.equal(options.headers.apikey,config.publishableKey);assert.equal(options.headers.Authorization,undefined);return json({user,session:providerSession()});}});
 const result=await(await transport.apiResponse('login',{email:user.email,password:'password123',remember:true})).json();assert.deepEqual(result,{user});assert.ok(local.getItem(transport.key));assert.equal(tab.getItem(transport.key),null);assert.ok(transport.read().rememberUntil>Date.now()+29*86400000);assert.ok(!local.getItem(transport.key).includes('password123'));
 await transport.apiResponse('login',{email:user.email,password:'password123',remember:false});assert.equal(local.getItem(transport.key),null);assert.ok(tab.getItem(transport.key));assert.equal(transport.read().rememberUntil,null);
});
test('browser session refresh is serialized and a rotated token is sent on the retried request',async()=>{
 let refreshes=0;const local=memory(),tab=memory(),transport=new SupabaseSession({config,storage:local,sessionStorage:tab,request:async(url,options)=>{if(url.includes('action=refresh')){refreshes++;await new Promise(r=>setTimeout(r,10));return json({session:providerSession('access-2','refresh-2')});}assert.equal(options.headers.Authorization,'Bearer access-2');return json({revision:2});}});
 transport.write({...providerSession(),expires_at:1},{remember:true});const until=transport.read().rememberUntil;await Promise.all([transport.apiResponse('save',{}),transport.apiResponse('save',{})]);assert.equal(refreshes,1);assert.equal(transport.read().refresh_token,'refresh-2');assert.equal(transport.read().rememberUntil,until);
});
test('401 responses retry once after refresh and rejected refreshes require login',async()=>{
 let attempts=0;const transport=new SupabaseSession({config,storage:memory(),sessionStorage:memory(),request:async(url,options)=>{if(url.includes('action=refresh'))return json({session:providerSession('access-2','refresh-2')});attempts++;return options.headers.Authorization==='Bearer access-1'?json({},401):json({user,save:null});}});transport.write(providerSession());assert.equal((await transport.apiResponse('session')).status,200);assert.equal(attempts,2);
 transport.request=async()=>json({},401);assert.deepEqual(await(await transport.apiResponse('session')).json(),{user:null});assert.equal(transport.read(),null);
});
test('logout removes this device session after revocation and cannot log out another account',async()=>{
 let revoked=0;const local=memory(),tab=memory(),transport=new SupabaseSession({config,storage:local,sessionStorage:tab,request:async()=>{revoked++;return json({ok:true});}});transport.write(providerSession(),{remember:true});assert.equal((await transport.apiResponse('logout',{userId:'another-user'})).status,409);assert.equal(revoked,0);assert.ok(transport.read());assert.equal((await transport.apiResponse('logout',{userId:user.id})).status,200);assert.equal(revoked,1);assert.equal(transport.read(),null);assert.equal(local.getItem(transport.key),null);assert.equal(tab.getItem(transport.key),null);
});
test('remembered-session expiry does not extend itself indefinitely',async()=>{
 let now=Date.now();const transport=new SupabaseSession({config,storage:memory(),sessionStorage:memory(),now:()=>now,request:async()=>assert.fail()});transport.write(providerSession(),{remember:true});now+=31*86400000;assert.equal(transport.read(),null);assert.deepEqual(await(await transport.apiResponse('session')).json(),{user:null});
});
test('the deployable single-file bundle runs without filesystem or Node server dependencies',async()=>{
 let handler;const old=globalThis.Deno;globalThis.Deno={env:{get:key=>env[key]},serve:value=>{handler=value;}};
 try{await import('../supabase/functions/warband/bundle.js?bundle-test');const response=await handler(new Request('https://project.supabase.co/functions/v1/warband?action=health'));assert.deepEqual(await response.json(),{service:'warband',ready:true});}finally{if(old===undefined)delete globalThis.Deno;else globalThis.Deno=old;}
});
test('remembered login still loads when tab storage is unavailable',()=>{
 const local=memory(),writer=new SupabaseSession({config,storage:local,sessionStorage:memory()});writer.write(providerSession(),{remember:true});const blocked={getItem:()=>{throw Error('Blocked');},setItem:()=>{throw Error('Blocked');},removeItem:()=>{throw Error('Blocked');}},reader=new SupabaseSession({config,storage:local,sessionStorage:blocked});assert.equal(reader.read().user.id,user.id);
});
