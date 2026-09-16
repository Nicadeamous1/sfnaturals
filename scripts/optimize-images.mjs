import sharp from 'sharp';import fs from 'node:fs/promises';
for(const name of ['texture','lotion-citrus-concept'])await sharp(`dist/assets/${name}.png`).webp({quality:92}).toFile(`dist/assets/${name}.webp`);
for(const file of ['dist/index.html','dist/app.js']){let s=await fs.readFile(file,'utf8');s=s.replaceAll('lotion-citrus-concept.png','lotion-citrus-concept.webp').replaceAll('texture.png','texture.webp');await fs.writeFile(file,s);}
let css=await fs.readFile('dist/style.css','utf8');css=css.replace(/^@import[^\n]+/,"@font-face{font-family:'DM Sans';font-style:normal;font-weight:100 1000;font-display:swap;src:url('assets/fonts/dm-sans-latin.woff2') format('woff2')}");await fs.writeFile('dist/style.css',css);
