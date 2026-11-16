import {createRequire} from 'node:module';import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {createSupabaseEdgeHandler} from '../server/supabase-edge.js';
import {BACKEND_CONFIG} from '../src/backend-config.js';
const {chromium}=createRequire(import.meta.url)('playwright'),root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json')),site='https://bpac888.github.io/WarbandLegends/',publicOrigin=new URL(site).origin,errors=[],id='11111111-1111-4111-8111-111111111111',email='player@example.com';
let registered=false,save=null,revision=0,accessVersion=1,expireAccess=false,refreshes=0,revoked=false;
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}}),token=()=>({user:{id,email},access_token:'access-'+accessVersion,refresh_token:'refresh-'+accessVersion,expires_at:Math.floor(Date.now()/1000)+3600});
const handler=createSupabaseEdgeHandler({env:{SUPABASE_URL:BACKEND_CONFIG.supabaseUrl,SUPABASE_ANON_KEY:'upstream-public-key',SUPABASE_SERVICE_ROLE_KEY:'test-server-only-key'},roster,fetcher:async(url,options)=>{
 const parsed=new URL(url),body=options.body?JSON.parse(options.body):{};
 if(parsed.pathname==='/auth/v1/signup'){if(registered)return json({code:'user_already_exists'},422);registered=true;revoked=false;return json(token());}
 if(parsed.pathname==='/auth/v1/token'){
  if(parsed.searchParams.get('grant_type')==='refresh_token'){assert.equal(body.refresh_token,'refresh-'+accessVersion);accessVersion++;expireAccess=false;refreshes++;return json(token());}
  if(body.password!=='password123'||body.email!==email)return json({},400);revoked=false;return json(token());
 }
 if(parsed.pathname==='/auth/v1/user')return expireAccess||revoked?json({},401):json({id,email});
 if(parsed.pathname==='/auth/v1/logout'){revoked=true;return json({});}
 if(parsed.pathname==='/rest/v1/player_saves'){assert.ok(parsed.searchParams.get('user_id')==='eq.'+id);return json(save?[{profile:save,revision}]:[]);}
 if(parsed.pathname==='/rest/v1/rpc/save_player_progress'){if(body.expected_revision!==revision)return json({code:'P0001'},400);save=body.new_profile;revision++;return json(revision);}
 if(parsed.pathname==='/rest/v1/rpc/championship_dashboard'){assert.equal(options.headers.Authorization,'Bearer test-server-only-key');return json({preview:false,playerId:id,week:'2026-11-16',closesAt:'2026-11-23T08:00:00Z',standing:{score:120,tier:1,attack_wins:4},teams:{attack_ids:save.team,defense_ids:save.team},rankings:[],opponents:[],awards:[],history:[]});}
 throw Error('Unexpected upstream path: '+parsed.pathname);
}});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
async function context(options={}){
 const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',...options});
 await ctx.route('**/*',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.origin===BACKEND_CONFIG.supabaseUrl){
   assert.equal(url.pathname,'/functions/v1/warband');const response=await handler(new Request(req.url(),{method:req.method(),headers:await req.allHeaders(),body:['GET','HEAD','OPTIONS'].includes(req.method())?undefined:req.postData()}));await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:response.status===204?'':await response.text()});return;
  }
  if(url.origin!==publicOrigin){errors.push('Unexpected external request '+url.hostname);return route.abort();}
  const relative=decodeURIComponent(url.pathname).replace(/^\/WarbandLegends\//,'');
  try{const file=path.join(root,'dist',relative||'index.html');await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.otf':'font/otf'})[path.extname(file)]});}catch{errors.push('Missing asset '+url.pathname);await route.abort();}
 });ctx.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));return ctx;
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function login(page,{register=false,remember=false}={}){await page.goto(site);await page.locator('.splash-enter').click();await page.getByRole('button',{name:register?'Register':'Login',exact:true}).click();await page.getByLabel('Email address',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill('password123');if(remember)await page.getByLabel('Remember me').check();await page.getByRole('button',{name:'Enter',exact:true}).click();await page.locator('.topbar').waitFor();}
async function tools(page){await page.getByRole('button',{name:'Guide',exact:true}).click();await page.locator('[data-action="guide-topic"][data-topic="tools"]').click();}
try{
 const ctx=await context(),page=await ctx.newPage();await login(page,{register:true,remember:true});for(let i=0;i<100&&!save;i++)await wait(50);assert.ok(save,'first profile was saved through the cross-origin Edge Function');
 const stored=await page.evaluate(()=>Object.entries(localStorage).find(([key])=>key.startsWith('warband.auth.')));assert.ok(stored);assert.ok(!stored[1].includes('password123'));assert.equal((await ctx.cookies()).length,0);
 const state=await ctx.storageState(),remembered=await context({storageState:state}),returnPage=await remembered.newPage();await returnPage.goto(site);await returnPage.locator('.splash-enter').click();await returnPage.locator('.topbar').waitFor();assert.equal(await returnPage.locator('#account-form').count(),0);await remembered.close();
 expireAccess=true;await page.goto(site);await page.locator('.splash-enter').click();await page.locator('.topbar').waitFor();assert.equal(refreshes,1,'an expired access token refreshed and the player entered directly');
 await page.getByRole('button',{name:'The Championships',exact:true}).click();await page.getByRole('heading',{name:'Rival defenses'}).waitFor();assert.equal(await page.locator('.championship-preview-note').count(),0);await tools(page);await page.getByRole('button',{name:'Log out',exact:true}).click();await page.locator('.splash-enter').waitFor();assert.ok(revoked);assert.equal(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('warband.auth.')).length),0);
 await login(page);assert.equal(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('warband.auth.')).length),0);assert.equal(await page.evaluate(()=>Object.keys(sessionStorage).filter(k=>k.startsWith('warband.auth.')).length),1);
 await page.reload();await page.locator('.topbar').waitFor();const noRememberState=await ctx.storageState(),fresh=await context({storageState:noRememberState}),freshPage=await fresh.newPage();await freshPage.goto(site);await freshPage.locator('.splash-enter').click();await freshPage.getByRole('heading',{name:'Register or Login'}).waitFor();await fresh.close();
 await tools(page);await page.getByRole('button',{name:'Log out',exact:true}).click();await page.locator('.splash-enter').waitFor();assert.equal(await page.evaluate(()=>Object.keys(sessionStorage).filter(k=>k.startsWith('warband.auth.')).length),0);await ctx.close();
 assert.deepEqual(errors,[]);console.log('GitHub Pages + Supabase browser checks passed: subdirectory assets, cross-origin registration/login/saves, remembered browser restart, expired-token refresh, authenticated Championships, cookie-free logout, tab-only sessions and reload.');
}finally{await browser.close();}
