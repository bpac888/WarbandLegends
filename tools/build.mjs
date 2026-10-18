import {readFile,writeFile,cp,mkdir,rm,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const roster=JSON.parse(await readFile('data/champions.json','utf8'));
if(roster.length!==135||new Set(roster.map(c=>c.id)).size!==135)throw Error('Roster identity check failed');
for(const c of roster){if(!/^assets\/champions\/[a-zA-Z0-9_ -]+\.webp$/.test(c.portrait)||(await stat(c.portrait)).size<1000)throw Error(`Missing portrait: ${c.id}`);}
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const path of ['index.html','src','data','assets'])await cp(path,`dist/${path}`,{recursive:true});
const manifest={version:'0.1.0',champions:roster.length,rosterSha256:createHash('sha256').update(await readFile('data/champions.json')).digest('hex')};
await writeFile('dist/build.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Built independent static game: ${roster.length} champions and local portraits → dist/`);
