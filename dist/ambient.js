/* Localized ambient photo motion. Foreground products are outside every mask. */
(() => {
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const scenes=[
  {id:'soap',width:355,height:768,top:.015,bottom:.29,dx:9,dy:3,speed:.7,label:'sky drift',hint:'Watch the pink sky above the soap.'},
  {id:'lotion',width:640,height:640,top:.015,bottom:.225,dx:13,dy:4,speed:1.1,label:'foliage motion',hint:'Watch the leaves above the lotion.'}
 ];
 scenes.forEach(settings=>{
  const panel=document.querySelector('.product-'+settings.id);
  const source=panel.querySelector('.product-visual img');
  const surfaces=[panel.querySelector('.product-visual'),panel.querySelector('.scene-backdrop')];
  const {width,height}=settings;
  const canvases=surfaces.map(surface=>{const c=document.createElement('canvas');c.width=width;c.height=height;c.className='ambient-motion';c.setAttribute('aria-hidden','true');surface.append(c);return c;});
  const buffer=document.createElement('canvas');buffer.width=width;buffer.height=height;const ctx=buffer.getContext('2d');
  const mask=document.createElement('canvas');mask.width=width;mask.height=height;const m=mask.getContext('2d');
  const top=settings.top*height,bottom=settings.bottom*height;
  const vertical=m.createLinearGradient(0,top,0,bottom);vertical.addColorStop(0,'transparent');vertical.addColorStop(.14,'white');vertical.addColorStop(.75,'white');vertical.addColorStop(1,'transparent');m.fillStyle=vertical;m.fillRect(0,top,width,bottom-top);
  m.globalCompositeOperation='destination-in';const horizontal=m.createLinearGradient(0,0,width,0);horizontal.addColorStop(0,'transparent');horizontal.addColorStop(.07,'white');horizontal.addColorStop(.93,'white');horizontal.addColorStop(1,'transparent');m.fillStyle=horizontal;m.fillRect(0,0,width,height);
  let paused=false,visible=false,frame=0,last=0;
  const control=document.createElement('button');control.type='button';control.className='water-control';
  const hint=document.createElement('p');hint.className='water-hint';hint.textContent=settings.hint;panel.querySelector('.product-copy').append(control,hint);
  function allowed(){return !paused&&!preference.matches&&!document.hidden&&visible&&panel.getAttribute('aria-hidden')!=='true';}
  function draw(time){
   frame=0;if(!allowed())return;frame=requestAnimationFrame(draw);
   if(time-last<42||!source.complete||!source.naturalWidth)return;last=time;
   ctx.clearRect(0,0,width,height);const t=time/1000*settings.speed;
   for(let y=Math.floor(top);y<bottom;y+=2){
    const dx=Math.sin(t+y*.017)*settings.dx;
    const dy=Math.sin(t*.8+y*.023)*settings.dy;
    ctx.drawImage(source,0,(y+dy)/height*source.naturalHeight,source.naturalWidth,2/height*source.naturalHeight,dx,y,width,2);
   }
   ctx.globalCompositeOperation='destination-in';ctx.drawImage(mask,0,0);ctx.globalCompositeOperation='source-over';
   canvases.forEach(c=>{const target=c.getContext('2d');target.clearRect(0,0,width,height);target.drawImage(buffer,0,0);});
   canvases[1].style.transform=surfaces[1].querySelector('img').style.transform;
  }
  function sync(){
   canvases.forEach(c=>c.hidden=paused||preference.matches);
   control.disabled=preference.matches;control.textContent=preference.matches?'Motion off · reduced motion':(paused?'Play ':'Pause ')+settings.label;control.setAttribute('aria-pressed',String(!paused&&!preference.matches));
   if(frame)cancelAnimationFrame(frame);frame=0;if(allowed())frame=requestAnimationFrame(draw);
  }
  control.addEventListener('click',()=>{paused=!paused;sync();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(document.querySelector('.scene-pin'));
  new MutationObserver(sync).observe(panel,{attributes:true,attributeFilter:['aria-hidden']});
  preference.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);source.addEventListener('load',sync);sync();
 });
})();
