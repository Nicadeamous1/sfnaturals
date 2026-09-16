import {Scene,WebGLRenderer,PMREMGenerator,HemisphereLight,DirectionalLight} from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export class ProductLighting {
 private environment;private generator;private room;
 constructor(scene:Scene,renderer:WebGLRenderer){this.generator=new PMREMGenerator(renderer);this.room=new RoomEnvironment();this.environment=this.generator.fromScene(this.room,.04);scene.environment=this.environment.texture;scene.environmentIntensity=.6;scene.add(new HemisphereLight(0xffedce,0x173a38,1.2));const key=new DirectionalLight(0xffead1,2.3);key.position.set(-3,4,4);scene.add(key);const fill=new DirectionalLight(0xd9e8ee,.8);fill.position.set(3,1,2);scene.add(fill);}
 dispose(){this.environment.dispose();this.generator.dispose();this.room.dispose();}
}
