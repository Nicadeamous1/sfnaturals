import {Group,Box3,Vector3,Mesh,Material,Texture,MeshStandardMaterial,SphereGeometry,IcosahedronGeometry,LatheGeometry,Vector2} from 'three';
import type {ProductConfig} from './config';
export function disposeModel(root:Group){
 const geometries=new Set(),materials=new Set<Material>(),textures=new Set<Texture>();
 root.traverse(o=>{if(o instanceof Mesh){if(!geometries.has(o.geometry)){geometries.add(o.geometry);o.geometry.dispose();}for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});
 for(const m of materials){for(const value of Object.values(m))if(value instanceof Texture)textures.add(value);m.dispose();}
 for(const t of textures){t.dispose();const image=t.image as {close?:()=>void}|undefined;if(image&&typeof image.close==='function')image.close();}
}
export class ProductModel {
 group=new Group();private lid;private ingredients=new Group();
 constructor(public root:Group,private config:ProductConfig){
  const size=new Box3().setFromObject(root).getSize(new Vector3());root.scale.setScalar(2/size.y);root.position.y=-1;
  this.lid=root.getObjectByName(config.movingPart);this.group.add(root,this.ingredients);
  for(const cue of config.ingredientCues){
   const group=new Group();group.position.set(...cue.position);
   if(cue.kind==='orange'){
    const fruit=new Mesh(new SphereGeometry(.24,32,24),new MeshStandardMaterial({color:0xd57922,roughness:.86}));fruit.scale.y=.92;group.add(fruit);
    const leaf=new Mesh(new SphereGeometry(.10,16,12),new MeshStandardMaterial({color:0x435934,roughness:.8}));leaf.scale.set(1,.17,.5);leaf.rotation.z=.4;leaf.position.set(.10,.21,0);group.add(leaf);
   }else if(cue.kind==='honey'){
    const drop=new Mesh(new LatheGeometry([new Vector2(.001,-.19),new Vector2(.09,-.17),new Vector2(.14,-.1),new Vector2(.13,0),new Vector2(.08,.12),new Vector2(.02,.23),new Vector2(.001,.29)],32),new MeshStandardMaterial({color:0xb66a12,roughness:.18,metalness:.15}));drop.rotation.z=-.15;group.add(drop);
   }else group.add(new Mesh(new IcosahedronGeometry(.15,1),new MeshStandardMaterial({color:0xcab28b,roughness:.8})));
   group.name=cue.kind;this.ingredients.add(group);
  }
  this.ingredients.visible=false;
 }
 pose(state:{rotation:number;lift:number;scale:number;ingredients:number},offset:number,pointer:{x:number;y:number}){
  this.group.rotation.set(pointer.y*.035,state.rotation+offset+pointer.x*this.config.interaction.pointer,0);
  this.group.position.x=pointer.x*.025;this.group.position.y=-pointer.y*.015;
  this.group.scale.setScalar(state.scale);if(this.lid)this.lid.position.y=state.lift;
  this.ingredients.visible=state.ingredients>.01;this.ingredients.scale.setScalar(Math.max(.001,state.ingredients));
 }
 dispose(){disposeModel(this.group);}
}
