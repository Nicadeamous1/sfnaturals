import {Scene,PerspectiveCamera,WebGLRenderer,ACESFilmicToneMapping,SRGBColorSpace} from 'three';
import type {ProductConfig,Quality} from './config';
import {ProductLoader} from './ProductLoader';import {ProductModel,disposeModel} from './ProductModel';import {ProductLighting} from './ProductLighting';import {InteractionController} from './InteractionController';import {StaticFallback} from './StaticFallback';import {PerformanceMonitor} from './PerformanceMonitor';import {ScrollTimeline,sampleTimeline} from './ScrollTimeline';import {shouldRender} from './policy';
export class ProductScene {
 private scene=new Scene();private camera=new PerspectiveCamera(36,1,.1,50);private renderer:WebGLRenderer;
 private loader=new ProductLoader();private model?:ProductModel;private lights:ProductLighting;private interaction:InteractionController;
 private fallback:StaticFallback;private monitor:PerformanceMonitor;private timeline:ScrollTimeline;private observer:IntersectionObserver;private resizeObserver:ResizeObserver;
 private events=new AbortController();private frame=0;private visible=false;private paused=false;private disposed=false;private last=0;private time=0;private quality:Quality;
 constructor(private host:HTMLElement,private config:ProductConfig,quality:Quality){
  this.quality=quality;this.fallback=new StaticFallback(host);
  this.renderer=new WebGLRenderer({alpha:true,antialias:quality==='full',powerPreference:'low-power'});
  this.renderer.outputColorSpace=SRGBColorSpace;this.renderer.toneMapping=ACESFilmicToneMapping;this.renderer.toneMappingExposure=1;
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='full'?1.5:1));
  const canvas=this.renderer.domElement;canvas.setAttribute('aria-hidden','true');canvas.hidden=true;host.append(canvas);
  this.camera.position.set(...config.camera);this.camera.lookAt(0,.05,0);this.lights=new ProductLighting(this.scene,this.renderer);
  this.timeline=new ScrollTimeline([...document.querySelectorAll<HTMLElement>('[data-story-step]')]);
  this.interaction=new InteractionController(host,()=>this.request());this.monitor=new PerformanceMonitor(host,()=>this.degrade());
  const signal=this.events.signal;
  this.observer=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;this.request();},{threshold:0});this.observer.observe(host);
  this.resizeObserver=new ResizeObserver(()=>{this.resize();this.request();});this.resizeObserver.observe(host);
  addEventListener('scroll',()=>this.request(),{passive:true,signal});document.addEventListener('visibilitychange',()=>this.request(),{signal});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.fail('context-lost');},{signal});
  document.querySelector<HTMLButtonElement>('[data-toggle-3d]')?.addEventListener('click',event=>{this.paused=!this.paused;const b=event.currentTarget as HTMLButtonElement;b.textContent=this.paused?'Resume product motion':'Pause product motion';b.setAttribute('aria-pressed',String(this.paused));this.request();},{signal});
  document.querySelector<HTMLButtonElement>('[data-static-3d]')?.addEventListener('click',()=>this.fail('user-static'),{signal});
  host.dataset.quality=quality;this.resize();
 }
 async init(){const gltf=await this.loader.load(this.config.modelUrl);if(this.disposed){disposeModel(gltf.scene);return;}this.model=new ProductModel(gltf.scene);this.scene.add(this.model.group);await this.renderer.compileAsync(this.scene,this.camera);if(this.disposed)return;this.fallback.ready();document.querySelector<HTMLElement>('.product3d-controls')?.removeAttribute('hidden');this.request();}
 private resize(){const {width,height}=this.host.getBoundingClientRect();if(!width||!height)return;this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.position.z=Math.max(this.config.camera[2],3.6/this.camera.aspect);this.camera.updateProjectionMatrix();}
 private active(){return shouldRender({visible:this.visible,hidden:document.hidden,paused:this.paused,disposed:this.disposed});}
 private request(){if(!this.active()){cancelAnimationFrame(this.frame);this.frame=0;this.last=0;this.monitor.reset();this.host.dataset.rendering='false';return;}if(!this.frame&&this.model)this.frame=requestAnimationFrame(t=>this.render(t));}
 private render(now:number){this.frame=0;if(!this.active()||!this.model)return;if(this.last&&now-this.last<(this.quality==='full'?15:31)){this.frame=requestAnimationFrame(t=>this.render(t));return;}const dt=this.last?Math.min(now-this.last,50):0;this.last=now;this.time+=dt/1000;const progress=this.timeline.progress();const state=sampleTimeline(this.config.stages,progress);this.model.pose(state,this.quality==='full'?Math.sin(this.time*.55)*this.config.interaction.idle:0,this.interaction);this.camera.position.y=this.config.camera[1]+state.lift*22;this.camera.lookAt(0,.05,0);this.renderer.render(this.scene,this.camera);this.monitor.sample(now);this.host.dataset.rendering='true';this.host.dataset.stage=String(Math.round(progress));this.host.dataset.drawCalls=String(this.renderer.info.render.calls);this.host.dataset.triangles=String(this.renderer.info.render.triangles);this.frame=requestAnimationFrame(t=>this.render(t));}
 private degrade(){if(this.quality==='full'){this.quality='reduced';this.renderer.setPixelRatio(1);this.host.dataset.quality='reduced';}else this.fail('sustained-low-frame-rate');}
 fail(reason:string){this.fallback.show(reason);this.dispose();document.querySelector<HTMLElement>('.product3d-controls')?.setAttribute('hidden','');}
 dispose(){if(this.disposed)return;this.disposed=true;cancelAnimationFrame(this.frame);this.frame=0;this.events.abort();this.observer.disconnect();this.resizeObserver.disconnect();this.interaction.dispose();this.loader.dispose();this.model?.dispose();this.lights.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();this.host.dataset.rendering='false';}
}


