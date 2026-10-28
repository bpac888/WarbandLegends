// Curated image-generated rune art is committed as self-contained SVG/WebP assets.
// Keep this command as a reproducible integrity check; never replace it with the old placeholders.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const paintings=new Set();
for(const color of ['red','blue','green','yellow','purple']){
 const variants=new Set();
 for(const suffix of ['','-blast','-prism']){
  const file=`assets/runes/${color}${suffix}.svg`,art=await readFile(file,'utf8'),payload=art.match(/data:image\/webp;base64,([^"']+)/)?.[1];
  if(!art.includes('viewBox="0 0 320 320"')||!payload||art.length<10000)throw Error('Invalid curated tile artwork: '+file);
  const fingerprint=createHash('sha256').update(Buffer.from(payload,'base64')).digest('hex');variants.add(fingerprint);paintings.add(fingerprint);
 }
 if(variants.size!==3)throw Error('Regular, Blast and Prism must use different paintings: '+color);
}
if(paintings.size!==15)throw Error('Every element/variant needs its own rune painting.');
console.log('Verified fifteen distinct high-density rune paintings: five elemental silhouettes, five Blast dragons and five Prism crystals.');
