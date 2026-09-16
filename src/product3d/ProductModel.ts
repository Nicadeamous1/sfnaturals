import {Group,Box3,Vector3,Mesh,Material,Texture,MeshStandardMaterial,SphereGeometry,IcosahedronGeometry,LatheGeometry,Vector2} from 'three';
export function disposeModel(root:Group){const geometries=new Set(),materials=new Set<Material>(),textures=new Set<Texture>();root.traverse(o=>{if(o instanceof Mesh){if(!geometries.has(o.geometry)){geometries.add(o.geometry);o.geometry.dispose();}for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});for(const m of materials){for(const value of Object.values(m))if(value instanceof Texture)textures.add(value);m.dispose();}for(const t of textures){t.dispose();const image=t.image as {close?:()=>void}|undefined;if(image&&typeof image.close==='function')image.close();}}
export class ProductModel {
 group=new Group();private lid;private ingredients=new Group();
 constructor(public root:Group){const bounds=new Box3().setFromObject(root),size=bounds.getSize(new Vector3());root.position.y=-size.y*.5;root.scale.setScalar(2/size.y);root.position.y=-1;this.lid=root.getObjectByName('Lid');this.group.add(root);this.group.add(this.ingredients);
  // Visual cues only for ingredients readable on supplied artwork; no formula claims added.
  const orange=new Mesh(new SphereGeometry(.24,32,24),new MeshStandardMaterial({color:0xd57922,roughness:.86}));orange.scale.y=.92;orange.position.set(-1.2,.1,.1);this.ingredients.add(orange);const leaf=new Mesh(new SphereGeometry(.10,16,12),new MeshStandardMaterial({color:0x435934,roughness:.8}));leaf.scale.set(1,.17,.5);leaf.rotation.z=.4;leaf.position.set(-1.10,.31,.1);this.ingredients.add(leaf);
  const honey=new Mesh(new LatheGeometry([new Vector2(.001,-.19),new Vector2(.09,-.17),new Vector2(.14,-.1),new Vector2(.13,0),new Vector2(.08,.12),new Vector2(.02,.23),new Vector2(.001,.29)],32),new MeshStandardMaterial({color:0xb66a12,roughness:.18,metalness:.15}));honey.rotation.z=-.15;honey.position.set(1.15,.35,.1);this.ingredients.add(honey);
  const resin=new Mesh(new IcosahedronGeometry(.15,1),new MeshStandardMaterial({color:0xcab28b,roughness:.8}));resin.position.set(.92,-.7,.25);this.ingredients.add(resin);this.ingredients.visible=false;
 }
 pose(state:{rotation:number;lift:number;scale:number;ingredients:number},offset:number,pointer:{x:number;y:number}){this.group.rotation.set(pointer.y*.035,state.rotation+offset+pointer.x*.12,0);this.group.scale.setScalar(state.scale);if(this.lid)this.lid.position.y=state.lift;this.ingredients.visible=state.ingredients>.01;this.ingredients.scale.setScalar(Math.max(.001,state.ingredients));}
 dispose(){disposeModel(this.group);}
}


