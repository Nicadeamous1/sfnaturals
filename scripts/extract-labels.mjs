import sharp from 'sharp';
import fs from 'node:fs/promises';
const source='dist/assets/tallow-balm.jpg';
const crops={front:{left:244,top:984,width:419,height:351},back:{left:895,top:999,width:375,height:309},top:{left:438,top:153,width:660,height:660}};
for(const [name,rect] of Object.entries(crops)) await sharp(source).extract(rect).png().toFile(`assets/3d/textures/balm-${name}.png`);
await fs.writeFile('assets/3d/textures/provenance.json',JSON.stringify({source,crops,method:'Exact raster extraction; no generated or retyped lettering. Perspective baked into supplied photo remains. Replace with production flat artwork before final packaging approval.'},null,2));
