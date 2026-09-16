import {build} from 'esbuild';import fs from 'node:fs/promises';
// Remove only generated JavaScript chunks, so obsolete bundles cannot ship.
await fs.mkdir('dist/js',{recursive:true});
for(const name of await fs.readdir('dist/js'))if(/^(product3d|ProductScene-[A-Z0-9]+|chunk-[A-Z0-9]+)\.js$/.test(name))await fs.unlink('dist/js/'+name);
await build({entryPoints:['src/product3d/index.ts'],bundle:true,splitting:true,format:'esm',outdir:'dist/js',entryNames:'product3d',chunkNames:'[name]-[hash]',minify:true,target:'es2022',metafile:true}).then(async r=>fs.writeFile('docs/bundle-sizes.json',JSON.stringify(Object.fromEntries(Object.entries(r.metafile.outputs).map(([k,v])=>[k,v.bytes])),null,2)));
const html=await fs.readFile('dist/index.html','utf8');for(const match of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)){const ref=match[1].split('?')[0];if(!/^(https?:|data:)/.test(ref))await fs.access('dist/'+ref);}
console.log('Production bundle built; local HTML assets verified.');
