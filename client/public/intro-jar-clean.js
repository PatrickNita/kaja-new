const introJarStyle=document.createElement('style');
introJarStyle.textContent=`
.is-intro-section .intro-jar-clean,.strength-leaf-scene,.catalogue-frame-sequence,.availability-frame-sequence{position:relative!important;z-index:5!important;grid-column:2!important;grid-row:1!important;justify-self:center!important;align-self:center!important;width:min(46vw,680px)!important;height:min(52vh,560px)!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:clamp(20px,3vw,32px)!important;overflow:visible!important;background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.025))!important;box-shadow:0 60px 140px rgba(0,0,0,.7),inset 0 0 90px rgba(255,255,255,.04)!important;transform-origin:center center!important;pointer-events:none!important}
.catalogue-frame-sequence,.availability-frame-sequence{overflow:visible!important;contain:layout!important;backface-visibility:hidden!important;transform:translateZ(0)!important}
.is-intro-section .intro-jar-clean img{position:absolute!important;left:50%!important;top:50%!important;width:auto!important;height:128%!important;max-width:128%!important;object-fit:contain!important;object-position:center!important;display:block!important;filter:drop-shadow(0 46px 70px rgba(0,0,0,.62))!important;transform-origin:center center!important;transform:translate3d(-50%,-50%,0) scale(1.32)!important;will-change:transform!important;user-select:none!important;pointer-events:none!important}
.strength-leaf-scene img{position:absolute!important;display:block!important;object-fit:contain!important;object-position:center!important;filter:drop-shadow(0 34px 45px rgba(0,0,0,.52))!important;transform-origin:center center!important;will-change:transform!important;user-select:none!important;pointer-events:none!important}
.strength-leaf-middle{left:50%!important;top:50%!important;width:auto!important;height:90%!important;max-width:90%!important;z-index:5!important;transform:translate3d(-50%,-50%,0) scale(1)!important}
.strength-leaf{z-index:4!important;width:auto!important;height:28%!important;max-width:34%!important;opacity:.92!important}
.catalogue-frame-sequence canvas,.availability-frame-sequence canvas{position:absolute!important;z-index:8!important;left:50%!important;top:50%!important;width:188%!important;height:188%!important;display:block!important;transform:translate3d(-50%,-50%,0)!important;filter:drop-shadow(0 42px 64px rgba(0,0,0,.62))!important;will-change:contents!important;user-select:none!important;pointer-events:none!important;backface-visibility:hidden!important}
.catalogue-frame-sequence .sequence-poster,.availability-frame-sequence .sequence-poster{position:absolute!important;z-index:7!important;left:50%!important;top:50%!important;width:188%!important;height:188%!important;object-fit:contain!important;transform:translate3d(-50%,-50%,0)!important;filter:drop-shadow(0 42px 64px rgba(0,0,0,.62))!important;pointer-events:none!important;user-select:none!important;visibility:visible!important}
.availability-frame-sequence canvas{width:145%!important;height:145%!important}
.availability-frame-sequence .sequence-poster{width:145%!important;height:145%!important}
.contact-social-links{display:flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;margin-top:18px!important;padding-top:16px!important;border-top:1px solid rgba(255,255,255,.12)!important}
.contact-social-link{width:42px!important;height:42px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:999px!important;display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(255,255,255,.06)!important;box-shadow:inset 0 0 22px rgba(255,255,255,.035)!important;transition:transform .22s ease,background .22s ease,border-color .22s ease!important;pointer-events:auto!important}
.contact-social-link:hover{transform:translateY(-2px) scale(1.04)!important;background:rgba(255,255,255,.13)!important;border-color:rgba(255,255,255,.32)!important}
.contact-social-link img{width:22px!important;height:22px!important;object-fit:contain!important;display:block!important;filter:drop-shadow(0 8px 16px rgba(0,0,0,.45))!important}
@media(max-width:900px){.is-intro-section .intro-jar-clean,.strength-leaf-scene,.catalogue-frame-sequence,.availability-frame-sequence{grid-column:1!important;grid-row:2!important;width:min(84vw,400px)!important;height:min(33vh,270px)!important;border-radius:22px!important}.is-intro-section .intro-jar-clean img{width:auto!important;height:132%!important;max-width:132%!important}.strength-leaf-middle{height:88%!important;max-width:88%!important}.strength-leaf{height:30%!important;max-width:36%!important}.catalogue-frame-sequence canvas,.catalogue-frame-sequence .sequence-poster{width:205%!important;height:205%!important}.availability-frame-sequence canvas,.availability-frame-sequence .sequence-poster{width:158%!important;height:158%!important}.contact-social-link{width:38px!important;height:38px!important}.contact-social-link img{width:20px!important;height:20px!important}}
`;
document.head.appendChild(introJarStyle);
const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
const smooth=v=>v*v*(3-2*v);
const motionBySection={};
const leafLayout=[
{x:18,y:22,s:.92,r:-34,dx:-38,dy:-18,dr:-42},{x:32,y:12,s:.72,r:18,dx:-18,dy:-34,dr:28},{x:58,y:14,s:.82,r:-8,dx:18,dy:-30,dr:-24},{x:78,y:24,s:.98,r:31,dx:38,dy:-12,dr:40},{x:86,y:48,s:.74,r:-44,dx:48,dy:4,dr:-38},{x:75,y:74,s:.88,r:12,dx:34,dy:28,dr:32},{x:55,y:86,s:.76,r:-18,dx:12,dy:42,dr:-30},{x:32,y:78,s:.94,r:42,dx:-24,dy:34,dr:46},{x:13,y:58,s:.8,r:-12,dx:-48,dy:14,dr:-28},{x:22,y:42,s:.68,r:24,dx:-36,dy:-4,dr:36},{x:48,y:28,s:.62,r:-52,dx:-8,dy:-24,dr:-44},{x:65,y:56,s:.7,r:54,dx:24,dy:16,dr:48}
];
const catalogueFrameCount=121;
const availabilityFrameCount=121;
const catalogueFramePath=index=>`/catalogue-animation/frame_${String(index).padStart(4,'0')}.webp`;
const availabilityFramePath=index=>`/countries/frame_${String(index).padStart(4,'0')}.webp`;
const catalogueFrameCache=[];
const availabilityFrameCache=[];
function loadFrame(index,pathFn,cache){
  const slot=index-1;
  if(cache[slot])return cache[slot];
  const img=new Image();
  img.decoding='async';
  img.src=pathFn(index);
  cache[slot]=img;
  return img;
}
function loadCatalogueFrame(index){return loadFrame(index,catalogueFramePath,catalogueFrameCache)}
function loadAvailabilityFrame(index){return loadFrame(index,availabilityFramePath,availabilityFrameCache)}
const sequencePreloadFlags={catalogue:false,availability:false};
function preloadSequenceWindow(centerLoaderIndex,count,loader,radius=10){
  const start=Math.max(1,centerLoaderIndex-radius);
  const end=Math.min(count,centerLoaderIndex+radius);
  for(let i=start;i<=end;i+=1){
    const img=loader(i);
    if(img.decode)img.decode().catch(()=>{});
  }
}
function warmSectionSequence(shape,p,isActive){
  if(!isActive)return;
  if(shape==='strips'){
    const frame=clamp(Math.round(p*(catalogueFrameCount-1)),0,catalogueFrameCount-1);
    preloadSequenceWindow((catalogueFrameCount-1)-frame+1,catalogueFrameCount,loadCatalogueFrame,18);
    scheduleSequencePreload(catalogueFrameCount,loadCatalogueFrame,'catalogue');
  }
  if(shape==='orb'){
    const frame=clamp(Math.round(p*(availabilityFrameCount-1)),0,availabilityFrameCount-1);
    preloadSequenceWindow((availabilityFrameCount-1)-frame+1,availabilityFrameCount,loadAvailabilityFrame,18);
    scheduleSequencePreload(availabilityFrameCount,loadAvailabilityFrame,'availability');
  }
}
function scheduleSequencePreload(count,loader,flagKey){
  if(sequencePreloadFlags[flagKey])return;
  sequencePreloadFlags[flagKey]=true;
  let index=1;
  const run=(deadline)=>{
    while(index<=count&&(!deadline||deadline.timeRemaining()>8)){
      loader(index);
      index+=1;
    }
    if(index<=count){
      if(typeof requestIdleCallback==='function')requestIdleCallback(run,{timeout:2500});
      else setTimeout(()=>run({timeRemaining:()=>16}),16);
    }
  };
  if(typeof requestIdleCallback==='function')requestIdleCallback(run,{timeout:1200});
  else setTimeout(()=>run({timeRemaining:()=>16}),120);
}
function scheduleSequencePreloadForSection(shape,isActive){
  if(!isActive)return;
  if(shape==='strips')scheduleSequencePreload(catalogueFrameCount,loadCatalogueFrame,'catalogue');
  if(shape==='orb')scheduleSequencePreload(availabilityFrameCount,loadAvailabilityFrame,'availability');
}
if(typeof requestIdleCallback==='function'){
  requestIdleCallback(()=>{
    loadCatalogueFrame(1);
    loadCatalogueFrame(catalogueFrameCount);
    loadAvailabilityFrame(1);
    loadAvailabilityFrame(availabilityFrameCount);
  },{timeout:1500});
}else{
  setTimeout(()=>{
    loadCatalogueFrame(1);
    loadCatalogueFrame(catalogueFrameCount);
    loadAvailabilityFrame(1);
    loadAvailabilityFrame(availabilityFrameCount);
  },300);
}
function sequenceFrameForProgress(p,count){return clamp(Math.round(p*(count-1)),0,count-1)}
function sequenceLoaderIndex(frame,count){return(count-1)-frame+1}
function sequenceSceneSelector(shape){
  if(shape==='strips')return '.catalogue-frame-sequence';
  if(shape==='orb')return '.availability-frame-sequence';
  return null;
}
const layoutObservers=new WeakMap();
function sceneLayoutReady(scene){
  if(!scene)return false;
  const rect=scene.getBoundingClientRect();
  return rect.width>24&&rect.height>24;
}
function observeSceneLayout(scene){
  if(!scene||layoutObservers.has(scene)||typeof ResizeObserver==='undefined')return;
  const ro=new ResizeObserver(()=>{
    if(!sceneLayoutReady(scene))return;
    const delay=isMobileSequence()?140:60;
    if(scene._layoutTickTimer)window.clearTimeout(scene._layoutTickTimer);
    scene._layoutTickTimer=window.setTimeout(()=>{
      scene._layoutTickTimer=null;
      scheduleTick();
    },delay);
  });
  ro.observe(scene);
  layoutObservers.set(scene,ro);
}
function sequenceSceneNeedsLayout(section,shape){
  const selector=sequenceSceneSelector(shape);
  if(!selector)return false;
  const scene=section.querySelector(selector);
  if(!scene)return true;
  return !sceneLayoutReady(scene);
}
function scheduleSequencePrime(section,shape,p){
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      primeSequenceStartFrame(section,shape,p);
      scheduleTick();
    });
  });
}
function sequencePosterPath(shape,p){
  const count=shape==='strips'?catalogueFrameCount:availabilityFrameCount;
  const frame=sequenceFrameForProgress(p,count);
  const loaderIndex=sequenceLoaderIndex(frame,count);
  return shape==='strips'?catalogueFramePath(loaderIndex):availabilityFramePath(loaderIndex);
}
function ensureSequencePoster(scene,shape,p){
  if(!scene)return null;
  const src=sequencePosterPath(shape,p);
  let poster=scene.querySelector('img.sequence-poster');
  if(!poster){
    poster=document.createElement('img');
    poster.className='sequence-poster';
    poster.alt='';
    poster.draggable=false;
    poster.decoding='async';
    scene.insertBefore(poster,scene.firstChild);
  }
  if(poster.getAttribute('src')!==src)poster.src=src;
  poster.style.setProperty('opacity','1','important');
  poster.style.setProperty('visibility','visible','important');
  return poster;
}
function hideSequencePoster(scene){
  const poster=scene?.querySelector('img.sequence-poster');
  if(!poster)return;
  poster.style.setProperty('opacity','0','important');
  poster.style.setProperty('visibility','hidden','important');
}
function primeSequenceStartFrame(section,shape,p){
  if(shape==='strips'){
    const scene=ensureCatalogue(section);
    if(!scene)return;
    const state=sectionMotion(section);
    const frame=sequenceFrameForProgress(p,catalogueFrameCount);
    const loaderIndex=sequenceLoaderIndex(frame,catalogueFrameCount);
    const img=loadCatalogueFrame(loaderIndex);
    state.catalogueFrameProgress=p;
    preloadSequenceWindow(loaderIndex,catalogueFrameCount,loadCatalogueFrame,20);
    if(state.catalogueDrawnIndex>=0){
      if(frame!==state.catalogueDrawnIndex&&img.complete&&img.naturalWidth){
        drawSequenceFrame(scene,frame,catalogueFrameCount,loadCatalogueFrame,state,'catalogueDrawnIndex',false,p);
      }
      return;
    }
    ensureSequencePoster(scene,'strips',p);
    if(img.complete&&img.naturalWidth)drawSequenceFrame(scene,frame,catalogueFrameCount,loadCatalogueFrame,state,'catalogueDrawnIndex',false,p);
    else if(!img.dataset.pendingPrime){img.dataset.pendingPrime='1';img.addEventListener('load',()=>{delete img.dataset.pendingPrime;scheduleTick()},{once:true});if(img.decode)img.decode().then(()=>scheduleTick()).catch(()=>{})}
    return;
  }
  if(shape==='orb'){
    const scene=ensureAvailability(section);
    if(!scene)return;
    const state=sectionMotion(section);
    const frame=sequenceFrameForProgress(p,availabilityFrameCount);
    const loaderIndex=sequenceLoaderIndex(frame,availabilityFrameCount);
    const img=loadAvailabilityFrame(loaderIndex);
    state.availabilityFrameProgress=p;
    preloadSequenceWindow(loaderIndex,availabilityFrameCount,loadAvailabilityFrame,20);
    if(state.availabilityDrawnIndex>=0){
      if(frame!==state.availabilityDrawnIndex&&img.complete&&img.naturalWidth){
        drawSequenceFrame(scene,frame,availabilityFrameCount,loadAvailabilityFrame,state,'availabilityDrawnIndex',true,p);
      }
      return;
    }
    ensureSequencePoster(scene,'orb',p);
    if(img.complete&&img.naturalWidth)drawSequenceFrame(scene,frame,availabilityFrameCount,loadAvailabilityFrame,state,'availabilityDrawnIndex',true,p);
    else if(!img.dataset.pendingPrime){img.dataset.pendingPrime='1';img.addEventListener('load',()=>{delete img.dataset.pendingPrime;scheduleTick()},{once:true});if(img.decode)img.decode().then(()=>scheduleTick()).catch(()=>{})}
  }
}
function sectionProgress(section){
  const frozen=section?.dataset.frozenProgress;
  if(frozen!=null&&frozen!==''){
    const parsed=Number.parseFloat(frozen);
    if(!Number.isNaN(parsed))return clamp(parsed,0,1);
  }
  const value=section?.dataset.sectionProgress;
  if(value!=null&&value!==''){
    const parsed=Number.parseFloat(value);
    if(!Number.isNaN(parsed))return clamp(parsed,0,1);
  }
  return 0;
}
function isFrozenSection(section){return section?.dataset.frozenProgress!=null&&section?.dataset.frozenProgress!==''}
function sectionMotion(section){
  const key=section?.dataset.sectionIndex??'0';
  if(!motionBySection[key]){
    motionBySection[key]={
      introScale:1.32,
      introY:0,
      leafProgress:0,
      catalogueFrameProgress:0,
      catalogueDrawnIndex:-1,
      availabilityFrameProgress:0,
      availabilityDrawnIndex:-1,
      availabilityPreloadFrame:-1,
      visualScale:1.12,
      visualY:8
    };
  }
  return motionBySection[key];
}
function transformFor(p){const grow=smooth(clamp(p/.78,0,1));const shrink=smooth(clamp((p-.88)/.12,0,1));return{scale:1.32+grow*.06-shrink*.04,y:0}}
function ensureJar(section,className,alt){if(!section)return null;let visual=section.querySelector(`.${className}`);if(visual)return visual;visual=document.createElement('div');visual.className=className;const img=document.createElement('img');img.src='/intro-jar.webp';img.alt=alt;img.draggable=false;visual.appendChild(img);section.appendChild(visual);return visual}
function ensureContactSocials(section){
  const panel=section?.querySelector('.contact-form-panel,.kaja-contact-form');
  if(!panel||panel.querySelector('.contact-social-links'))return;
  const socials=[
    {label:'Instagram',src:'/socials/telegram.webp',href:'#instagram'},
    {label:'E-mail',src:'/socials/mail.webp',href:'#email'},
    {label:'Telegram',src:'/socials/telegram.webp',href:'#telegram'},
    {label:'WhatsApp',src:'/socials/whatsapp.webp',href:'#whatsapp'}
  ];
  const row=document.createElement('div');
  row.className='contact-social-links';
  socials.forEach(({label,src,href})=>{
    const link=document.createElement('a');
    link.className='contact-social-link';
    link.href=href;
    link.setAttribute('aria-label',label);
    link.title=label;
    const img=document.createElement('img');
    img.src=src;
    img.alt='';
    img.draggable=false;
    link.appendChild(img);
    row.appendChild(link);
  });
  panel.appendChild(row);
}
function sizeSequenceCanvas(scene,canvas,state,drawnKey,isAvailability=false){
  if(!sceneLayoutReady(scene))return false;
  const rect=scene.getBoundingClientRect();
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const mult=isAvailability?1.58:2.05;
  const w=Math.max(1,Math.round(rect.width*mult*dpr));
  const h=Math.max(1,Math.round(rect.height*mult*dpr));
  if(canvas.width!==w||canvas.height!==h){
    const prevW=Math.max(canvas.width,1);
    const prevH=Math.max(canvas.height,1);
    canvas.width=w;
    canvas.height=h;
    const widthShift=Math.abs(w-prevW)/prevW;
    const heightShift=Math.abs(h-prevH)/prevH;
    if(state[drawnKey]<0||widthShift>0.06||heightShift>0.06)state[drawnKey]=-1;
  }
  return true;
}
function drawSequenceFrame(scene,frame,count,loader,state,drawnKey,isAvailability=false,p=0){
  const shape=isAvailability?'orb':'strips';
  const canvas=scene.querySelector('canvas');
  if(!canvas)return;
  if(!sizeSequenceCanvas(scene,canvas,state,drawnKey,isAvailability)){
    observeSceneLayout(scene);
    if(state[drawnKey]<0)ensureSequencePoster(scene,shape,p);
    return;
  }
  const reversedFrame=(count-1)-frame;
  const img=loader(reversedFrame+1);
  if(!img.complete||!img.naturalWidth){
    if(state[drawnKey]<0)ensureSequencePoster(scene,shape,p);
    if(!img.dataset.pendingTick){
      img.dataset.pendingTick='1';
      img.addEventListener('load',()=>{delete img.dataset.pendingTick;scheduleTick()},{once:true});
      img.addEventListener('error',()=>{delete img.dataset.pendingTick},{once:true});
    }
    return;
  }
  if(frame===state[drawnKey]){
    if(state[drawnKey]>=0)hideSequencePoster(scene);
    else ensureSequencePoster(scene,shape,p);
    return;
  }
  if(!canvas._drawCtx)canvas._drawCtx=canvas.getContext('2d',{alpha:true});
  const ctx=canvas._drawCtx;
  const cw=canvas.width,ch=canvas.height;
  ctx.clearRect(0,0,cw,ch);
  const drawScale=isAvailability?1.06:1.28;
  const scale=Math.min(cw/img.naturalWidth,ch/img.naturalHeight)*drawScale;
  const dw=img.naturalWidth*scale;
  const dh=img.naturalHeight*scale;
  ctx.drawImage(img,(cw-dw)/2,(ch-dh)/2,dw,dh);
  state[drawnKey]=frame;
  hideSequencePoster(scene);
}
function cleanOldSectionVisuals(section){
  if(!section)return;
  section.querySelector('.catalogue-mixology-scene')?.remove();
  section.querySelector('.catalogue-book-scene')?.remove();
  section.querySelector('.catalogue-jar-clean')?.remove();
}
function prepareSequenceSection(section){
  const shape=sectionShape(section);
  if(shape==='strips'){
    const scene=ensureCatalogue(section);
    if(!scene)return;
    const state=sectionMotion(section);
    if(state.catalogueDrawnIndex>=0)return;
    ensureSequencePoster(scene,'strips',sectionProgress(section));
    return;
  }
  if(shape==='orb'){
    const scene=ensureAvailability(section);
    if(!scene)return;
    const state=sectionMotion(section);
    if(state.availabilityDrawnIndex>=0)return;
    ensureSequencePoster(scene,'orb',sectionProgress(section));
  }
}
let lastPreparedUpcomingFrom=-1;
function prepareUpcomingSequenceSection(activeSection){
  const activeIndex=Number.parseInt(activeSection?.dataset.sectionIndex??'',10);
  if(Number.isNaN(activeIndex)||lastPreparedUpcomingFrom===activeIndex)return;
  lastPreparedUpcomingFrom=activeIndex;
  getSections().forEach((section)=>{
    const sectionIndex=Number.parseInt(section.dataset.sectionIndex??'',10);
    if(sectionIndex!==activeIndex+1)return;
    const shape=sectionShape(section);
    if(shape!=='strips'&&shape!=='orb')return;
    prepareSequenceSection(section);
  });
}
function ensureCatalogue(section){if(!section)return null;cleanOldSectionVisuals(section);const oldVisual=section.querySelector('.visual.visual-strips');if(oldVisual)oldVisual.style.setProperty('display','none','important');let scene=section.querySelector('.catalogue-frame-sequence');if(scene)return scene;scene=document.createElement('div');scene.className='catalogue-frame-sequence';const canvas=document.createElement('canvas');canvas.setAttribute('aria-label','Catalogue animation frame');scene.appendChild(canvas);section.appendChild(scene);ensureSequencePoster(scene,'strips',sectionProgress(section));observeSceneLayout(scene);scheduleTick();return scene}
function ensureAvailability(section){if(!section)return null;const oldVisual=section.querySelector('.visual');if(oldVisual)oldVisual.style.setProperty('display','none','important');let scene=section.querySelector('.availability-frame-sequence');if(scene)return scene;scene=document.createElement('div');scene.className='availability-frame-sequence';const canvas=document.createElement('canvas');canvas.setAttribute('aria-label','Availability animation frame');scene.appendChild(canvas);section.appendChild(scene);ensureSequencePoster(scene,'orb',sectionProgress(section));observeSceneLayout(scene);scheduleTick();return scene}
function ensureStrength(section){if(!section)return null;const oldVisual=section.querySelector('.visual.visual-stack');if(oldVisual)oldVisual.style.setProperty('display','none','important');let scene=section.querySelector('.strength-leaf-scene');if(scene)return scene;scene=document.createElement('div');scene.className='strength-leaf-scene';const middle=document.createElement('img');middle.className='strength-leaf-middle';middle.src='/leaf-middle.webp';middle.alt='Strength leaf center';middle.draggable=false;scene.appendChild(middle);for(let i=2;i<=13;i+=1){const img=document.createElement('img');const data=leafLayout[i-2];img.className='strength-leaf';img.src=`/leaf${i}.webp`;img.alt='';img.draggable=false;img.setAttribute('aria-hidden','true');img.dataset.x=data.x;img.dataset.y=data.y;img.dataset.s=data.s;img.dataset.r=data.r;img.dataset.dx=data.dx;img.dataset.dy=data.dy;img.dataset.dr=data.dr;img.style.left=`${data.x}%`;img.style.top=`${data.y}%`;scene.appendChild(img)}section.appendChild(scene);return scene}
function spring(current,target,amount){return current+(target-current)*amount}
function isMobileSequence(){return window.matchMedia('(max-width:900px)').matches}
function sequenceAnimProgress(state,key,p,frozen,snapFirst){
  if(frozen||isMobileSequence()){state[key]=p;return p}
  return applyMotion(state,key,p,false,snapFirst?1:.12)
}
function applyMotion(state,key,target,frozen,amount){if(frozen){state[key]=target;return target}state[key]=spring(state[key],target,amount);return state[key]}
function animateJar(visual,p,state,frozen){const img=visual?.querySelector('img');if(!img)return;const t=transformFor(p);const scale=applyMotion(state,'introScale',t.scale,frozen,.22);const y=applyMotion(state,'introY',t.y,frozen,.18);img.style.setProperty('transform',`translate3d(-50%,calc(-50% + ${y}vh),0) scale(${scale})`,'important')}
function animateStrengthItems(scene,p,state,frozen){if(!scene)return;const eased=smooth(applyMotion(state,'leafProgress',p,frozen,.15));const middle=scene.querySelector('.strength-leaf-middle');if(middle)middle.style.setProperty('transform','translate3d(-50%,-50%,0) scale(1.1)','important');scene.querySelectorAll('.strength-leaf').forEach((item)=>{const x=Number(item.dataset.x);const y=Number(item.dataset.y);const s=Number(item.dataset.s);const r=Number(item.dataset.r);const dx=Number(item.dataset.dx);const dy=Number(item.dataset.dy);const dr=Number(item.dataset.dr);item.style.left=`${x}%`;item.style.top=`${y}%`;item.style.setProperty('transform',`translate3d(calc(-50% + ${dx*eased}px),calc(-50% + ${dy*eased}px),0) rotate(${r+dr*eased}deg) scale(${s+(eased*.14)})`,'important')})}
function animateCatalogueFrames(scene,p,state,frozen,isActive,shape){if(!scene)return;const snapFirst=Boolean(isActive&&state.catalogueDrawnIndex<0);const progress=sequenceAnimProgress(state,'catalogueFrameProgress',p,frozen,snapFirst);const frame=clamp(Math.round(progress*(catalogueFrameCount-1)),0,catalogueFrameCount-1);drawSequenceFrame(scene,frame,catalogueFrameCount,loadCatalogueFrame,state,'catalogueDrawnIndex',false,p);if(isActive&&state.catalogueDrawnIndex<0)ensureSequencePoster(scene,'strips',p);preloadSequenceWindow((catalogueFrameCount-1)-frame+1,catalogueFrameCount,loadCatalogueFrame);scheduleSequencePreloadForSection(shape,isActive);scene.style.setProperty('transform','translateZ(0)','important')}
function animateAvailabilityFrames(scene,p,state,frozen,isActive,shape){if(!scene)return;const snapFirst=Boolean(isActive&&state.availabilityDrawnIndex<0);const progress=sequenceAnimProgress(state,'availabilityFrameProgress',p,frozen,snapFirst);const frame=clamp(Math.round(progress*(availabilityFrameCount-1)),0,availabilityFrameCount-1);drawSequenceFrame(scene,frame,availabilityFrameCount,loadAvailabilityFrame,state,'availabilityDrawnIndex',true,p);if(isActive&&state.availabilityDrawnIndex<0)ensureSequencePoster(scene,'orb',p);if(frame!==state.availabilityPreloadFrame){state.availabilityPreloadFrame=frame;preloadSequenceWindow((availabilityFrameCount-1)-frame+1,availabilityFrameCount,loadAvailabilityFrame)}if(isActive)scheduleSequencePreloadForSection(shape,isActive);scene.style.setProperty('transform','translateZ(0)','important')}
const sectionNodes=[];
let sectionsDirty=true;
const lastProgressByKey={};
let tickLoopActive=false;
function markSectionsDirty(){sectionsDirty=true}
function getSections(){
  if(sectionsDirty){
    sectionNodes.length=0;
    document.querySelectorAll('.segment[data-section-index]').forEach((section)=>sectionNodes.push(section));
    sectionsDirty=false;
  }
  return sectionNodes;
}
function sectionShape(section){return section?.dataset?.sectionShape||''}
function sectionVisualReady(section,shape){
  if(section.classList.contains('is-intro-section'))return !!section.querySelector('.intro-jar-clean');
  if(shape==='stack')return !!section.querySelector('.strength-leaf-scene');
  if(shape==='strips')return !!section.querySelector('.catalogue-frame-sequence');
  if(shape==='orb')return !!section.querySelector('.availability-frame-sequence');
  if(shape==='contact')return true;
  return !!section.querySelector('.visual');
}
function sectionNeedsTick(section,p,state,frozen,shape){
  if(frozen)return true;
  const isActive=section.classList.contains('is-active');
  if(isActive&&!sectionVisualReady(section,shape))return true;
  if(isActive&&(shape==='strips'||shape==='orb')&&sequenceSceneNeedsLayout(section,shape))return true;
  if(isActive&&shape==='strips'&&state.catalogueDrawnIndex<0)return true;
  if(isActive&&shape==='orb'&&state.availabilityDrawnIndex<0)return true;
  return !motionSettled(section,p,state,frozen,shape);
}
function motionSettled(section,p,state,frozen,shape){
  if(frozen)return false;
  const key=section.dataset.sectionIndex??'0';
  const last=lastProgressByKey[key];
  if(last!==undefined&&Math.abs(last-p)>0.0005)return false;
  if(section.classList.contains('is-intro-section')){
    const t=transformFor(p);
    return Math.abs(state.introScale-t.scale)<=0.002&&Math.abs(state.introY-t.y)<=0.002;
  }
  if(shape==='stack')return Math.abs(state.leafProgress-p)<=0.002;
  if(shape==='strips')return Math.abs(state.catalogueFrameProgress-p)<=0.002;
  if(shape==='orb')return Math.abs(state.availabilityFrameProgress-p)<=0.002;
  const t=transformFor(p);
  const targetY=8-(18*p);
  return Math.abs(state.visualScale-t.scale)<=0.002&&Math.abs(state.visualY-targetY)<=0.02;
}
function scheduleTick(){
  if(tickLoopActive)return;
  tickLoopActive=true;
  requestAnimationFrame(tick);
}
function tick(){
  tickLoopActive=false;
  let needsNext=false;
  getSections().forEach((section)=>{
    const p=sectionProgress(section);
    const frozen=isFrozenSection(section);
    const state=sectionMotion(section);
    const shape=sectionShape(section);
    const key=section.dataset.sectionIndex??'0';
    if(!sectionNeedsTick(section,p,state,frozen,shape)){
      lastProgressByKey[key]=p;
      return;
    }
    needsNext=true;
    lastProgressByKey[key]=p;
    const isActive=section.classList.contains('is-active');
    if(isActive&&(shape==='strips'||shape==='orb')){
      if((shape==='strips'&&state.catalogueDrawnIndex<0)||(shape==='orb'&&state.availabilityDrawnIndex<0))primeSequenceStartFrame(section,shape,p);
      prepareUpcomingSequenceSection(section);
    }
    warmSectionSequence(shape,p,isActive);
    if(section.classList.contains('is-intro-section')){
      animateJar(ensureJar(section,'intro-jar-clean','KAJA intro jar'),p,state,frozen);
      return;
    }
    if(shape==='stack'){animateStrengthItems(ensureStrength(section),p,state,frozen);return}
    if(shape==='strips'){animateCatalogueFrames(ensureCatalogue(section),p,state,frozen,isActive,shape);return}
    if(shape==='orb'){animateAvailabilityFrames(ensureAvailability(section),p,state,frozen,isActive,shape);return}
    if(shape==='contact'){if(isActive)ensureContactSocials(section);return}
    const visual=section.querySelector('.visual');
    if(!visual)return;
    const t=transformFor(p);
    const targetY=8-(18*p);
    state.visualScale=spring(state.visualScale,t.scale,.18);
    state.visualY=spring(state.visualY,targetY,.16);
    visual.style.setProperty('transform',`translateY(${state.visualY}vh) scale(${state.visualScale})`,'important');
  });
  if(needsNext)scheduleTick();
}
const sectionObserver=new MutationObserver((mutations)=>{
  let shouldTick=false;
  for(const mutation of mutations){
    if(mutation.type==='childList'){markSectionsDirty();scheduleTick();return}
    if(mutation.attributeName!=='data-section-progress'&&mutation.attributeName!=='data-frozen-progress'&&mutation.attributeName!=='class')continue;
    const section=mutation.target;
    if(section?.classList?.contains('is-active')){
      const shape=sectionShape(section);
      if((shape==='strips'||shape==='orb')&&(mutation.attributeName==='class'||mutation.attributeName==='data-frozen-progress')){
        scheduleSequencePrime(section,shape,sectionProgress(section));
      }
    }
    shouldTick=true;
  }
  if(shouldTick)scheduleTick();
});
function observeSections(){
  markSectionsDirty();
  sectionObserver.disconnect();
  getSections().forEach((section)=>{
    const shape=sectionShape(section);
    if(shape==='strips'||shape==='orb')prepareSequenceSection(section);
    sectionObserver.observe(section,{attributes:true,attributeFilter:['data-section-progress','data-frozen-progress','class']});
  });
}
window.__kajaPrimeSequenceSection=(index,progress=0)=>{
  const section=document.querySelector(`.segment[data-section-index="${index}"]`);
  if(!section)return;
  const shape=sectionShape(section);
  if(shape!=='strips'&&shape!=='orb')return;
  primeSequenceStartFrame(section,shape,clamp(Number(progress)||0,0,1));
  scheduleTick();
};
observeSections();
let domObserverTimer=null;
const domObserver=new MutationObserver(()=>{
  if(domObserverTimer!==null)window.clearTimeout(domObserverTimer);
  domObserverTimer=window.setTimeout(()=>{
    domObserverTimer=null;
    observeSections();
    scheduleTick();
  },60);
});
domObserver.observe(document.documentElement,{childList:true,subtree:true});
scheduleTick();
