import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url).pathname,players=new Map(),errors=[];
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
async function setup(options={}){
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',...options});
 await context.route('**/*',async route=>{
  const request=route.request(),u=new URL(request.url());
  if(u.hostname!=='legends.local'){errors.push('external '+u.hostname);return route.abort();}
  if(u.pathname.endsWith('/src/backend-config.js'))return route.fulfill({contentType:'text/javascript',body:'export const BACKEND_CONFIG={};'});
  if(u.pathname==='/api/account'){
   const action=u.searchParams.get('action'),input=request.method()==='POST'?request.postDataJSON():{},cookie=(request.headers().cookie||'').match(/test_player=([^;]+)/)?.[1],player=players.get(cookie);
   const reply=(body,status=200,headers={})=>route.fulfill({status,contentType:'application/json',headers:{'Cache-Control':'no-store',...headers},body:JSON.stringify(body)});
   if(action==='register'||action==='login'){
    const email=input.email.trim().toLowerCase();
    if(action==='register'&&players.has(email))return reply({error:'This email already has an account. Choose Login.'},400);
    if(action==='login'&&(!players.has(email)||players.get(email).password!==input.password))return reply({error:'Email or password is incorrect.'},400);
    if(action==='register')players.set(email,{user:{id:email,email},password:input.password,save:null});
    return reply({user:players.get(email).user},200,{'set-cookie':`test_player=${email}; Path=/; HttpOnly; SameSite=Lax${input.remember?'; Max-Age=2592000':''}`});
   }
   if(action==='session')return reply({user:player?.user||null,save:player?.save||null});
   if(action==='logout')return reply({ok:true},200,{'set-cookie':'test_player=; Path=/; Max-Age=0'});
   if(action==='save'){
    if(!player)return reply({error:'Please log in again.'},401);
    if(input.userId!==player.user.id||input.revision!==(player.save?.revision||0))return reply({error:'Progress changed in another tab or device. Reload before continuing.'},409);
    player.save={profile:input.profile,revision:input.revision+1};return reply({revision:player.save.revision});
   }
   throw Error('Unexpected API action '+action);
  }
  try{const file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.otf':'font/otf','.ttf':'font/ttf'})[path.extname(file)]});}catch{errors.push('missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}
 });
 context.on('page',page=>{page.on('pageerror',error=>{errors.push(error.message);console.error('Page error:',error.message);});page.on('requestfailed',r=>console.error('request failed',r.url(),r.failure()));});return context;
}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function waitSaved(email){for(let i=0;i<100;i++){if(players.get(email)?.save)return;await pause(50);}throw Error('Save never uploaded');}
async function enter(page){await page.goto('http://legends.local/');await page.locator('.splash-enter').click();}
async function credentials(page,email,password,remember=false){await page.locator('#account-email').fill(email);await page.locator('#account-password').fill(password);if(remember)await page.getByLabel('Remember me').check();await page.getByRole('button',{name:'Enter',exact:true}).click();}
async function tools(page){await page.getByRole('button',{name:'Guide',exact:true}).click();await page.locator('[data-action="guide-topic"][data-topic="tools"]').click();}
try{
 await fs.mkdir(root+'artifacts',{recursive:true});
 const context=await setup(),page=await context.newPage();
 await enter(page);await page.getByRole('heading',{name:'Register or Login'}).waitFor();assert.equal(await page.locator('.topbar').count(),0);
 for(const width of [320,390,760,1440]){await page.setViewportSize({width,height:844});assert.ok(await page.locator('#modal').evaluate(e=>e.scrollWidth<=e.clientWidth+1));await page.screenshot({path:root+`artifacts/account-choice-${width}.png`});}
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Register',exact:true}).click();
 await page.locator('#account-email').fill('one@example.com');await page.locator('#account-password').fill('password123');await page.getByLabel('Remember me').check();await page.screenshot({path:root+'artifacts/account-register-phone.png'});
 await page.locator('#account-password').press('Enter');await page.locator('.topbar').waitFor().catch(async error=>{console.error(await page.locator('body').innerText());throw error;});await waitSaved('one@example.com');
 const cookies=await context.cookies();assert.ok(cookies.some(c=>c.name==='test_player'&&c.expires>0&&c.httpOnly));
 await tools(page);await page.getByRole('button',{name:'Log out',exact:true}).click();await page.locator('.splash-enter').waitFor();assert.equal(players.get('one@example.com').save.profile.tutorial.guide,true);
 await page.locator('.splash-enter').click();await page.getByRole('button',{name:'Register',exact:true}).click();await credentials(page,'ONE@example.com','password123');await page.locator('.account-message').filter({hasText:'already has an account'}).waitFor();
 await page.getByRole('button',{name:'Already have an account? Login',exact:true}).click();await credentials(page,'one@example.com','wrongpassword');await page.locator('.account-message').filter({hasText:'incorrect'}).waitFor();
 await credentials(page,'one@example.com','password123',true);await page.locator('.topbar').waitFor();
 await page.goto('http://legends.local/');await page.locator('.splash-enter').click();await page.locator('.topbar').waitFor();assert.equal(await page.locator('#account-form').count(),0);
 const rememberedState=await context.storageState();const returned=await setup({storageState:rememberedState}),returnPage=await returned.newPage();await enter(returnPage);await returnPage.locator('.topbar').waitFor();await tools(returnPage);assert.equal(players.get('one@example.com').save.profile.tutorial.guide,true);await returned.close();
 await tools(page);await page.getByRole('button',{name:'Log out',exact:true}).click();await page.locator('.splash-enter').waitFor();await page.locator('.splash-enter').click();await page.getByRole('button',{name:'Register',exact:true}).click();await credentials(page,'two@example.com','password456');await page.locator('.topbar').waitFor();await waitSaved('two@example.com');assert.equal(players.get('two@example.com').save.profile.tutorial.guide,false);
 assert.ok((await context.cookies()).some(c=>c.name==='test_player'&&c.expires===-1));await tools(page);assert.ok((await page.locator('.account-save-status').innerText()).includes('two@example.com'));await page.screenshot({path:root+'artifacts/account-tools-phone.png'});
 await page.getByRole('button',{name:'Log out',exact:true}).click();await page.locator('.splash-enter').waitFor();await page.goto('http://legends.local/#/campaign');await page.getByRole('heading',{name:'Register or Login'}).waitFor();assert.equal(await page.locator('.topbar').count(),0);
 // A separate device signs in and recovers the uploaded save.
 const other=await setup(),otherPage=await other.newPage();await enter(otherPage);await otherPage.getByRole('button',{name:'Login',exact:true}).click();await credentials(otherPage,'one@example.com','password123');await otherPage.locator('.topbar').waitFor();await tools(otherPage);assert.equal(players.get('one@example.com').save.profile.tutorial.guide,true);await other.close();
 assert.deepEqual(errors,[]);console.log('Account browser checks passed: registration, duplicate emails, wrong passwords, remembered sessions, logout, account isolation, cross-device restore, direct-route gate, and four viewport sizes.');
}finally{await browser.close();}
