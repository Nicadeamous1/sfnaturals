import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
export class ProductLoader {
 private abort=new AbortController();
 async load(url:string){const response=await fetch(url,{signal:this.abort.signal,cache:'force-cache'});if(!response.ok)throw new Error(`Model response ${response.status}`);const bytes=await response.arrayBuffer();if(this.abort.signal.aborted)throw new Error('Disposed');return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes,new URL('.',new URL(url,location.href)).href);}
 dispose(){this.abort.abort();}
}
