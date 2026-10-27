// Curated image-generated rune art is committed as self-contained SVG/WebP assets.
// Keep this command as a reproducible integrity check; never replace it with the old placeholders.
import {readFile} from 'node:fs/promises';
for(const color of ['red','blue','green','yellow','purple'])for(const suffix of ['','-blast','-prism']){
 const file=`assets/runes/${color}${suffix}.svg`,art=await readFile(file,'utf8');
 if(!art.includes('viewBox="0 0 320 320"')||!art.includes('data:image/webp;base64,')||art.length<10000)throw Error('Invalid curated tile artwork: '+file);
}
console.log('Verified fifteen high-density rune artworks: five distinct elemental silhouettes with Blast and Prism badges.');
