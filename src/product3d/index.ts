import {balm} from './config';import {selectQuality} from './policy';import {StaticFallback} from './StaticFallback';
const host=document.querySelector<HTMLElement>('[data-product-scene]');
if(host){
 const nav=navigator as Navigator&{deviceMemory?:number;connection?:{saveData?:boolean;effectiveType?:string}};
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const quality=selectQuality({reducedMotion:motion.matches,saveData:!!nav.connection?.saveData,width:innerWidth,memory:nav.deviceMemory??8,cores:nav.hardwareConcurrency??4,slowNetwork:['slow-2g','2g'].includes(nav.connection?.effectiveType??'')});
 host.dataset.quality=quality;
 const fallback=new StaticFallback(host);let scene:import('./ProductScene').ProductScene|undefined;let stopped=false;
 const observer=new IntersectionObserver(async entries=>{if(!entries.some(e=>e.isIntersecting))return;observer.disconnect();if(quality==='static'){fallback.show('capability-policy');return;}host.dataset.state='loading';try{const {ProductScene}=await import('./ProductScene');if(stopped||motion.matches)return;scene=new ProductScene(host,balm,quality);await scene.init();}catch(error){scene?.dispose();fallback.show('initialization-failed');console.warn('Product image retained:',error instanceof Error?error.message:'3D unavailable');}},{rootMargin:'120px'});
 observer.observe(host);
 motion.addEventListener('change',event=>{if(event.matches){stopped=true;observer.disconnect();scene?.fail('reduced-motion');fallback.show('reduced-motion');}});
 addEventListener('pagehide',()=>{stopped=true;observer.disconnect();scene?.dispose();fallback.show('page-hidden');});
}
