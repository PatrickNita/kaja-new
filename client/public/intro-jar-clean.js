const introJarStyle=document.createElement('style');
introJarStyle.textContent=`
.is-intro-section .intro-sequence,.is-hanger-section ~ .segment .intro-sequence{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
.is-intro-section .intro-jar-clean,.strength-leaf-scene,.catalogue-frame-sequence,.availability-frame-sequence{position:relative!important;z-index:5!important;grid-column:2!important;grid-row:1!important;justify-self:center!important;align-self:center!important;width:min(46vw,680px)!important;height:min(52vh,560px)!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:clamp(20px,3vw,32px)!important;overflow:visible!important;background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.025))!important;box-shadow:0 60px 140px rgba(0,0,0,.7),inset 0 0 90px rgba(255,255,255,.04)!important;transform-origin:center center!important;pointer-events:none!important}
.catalogue-frame-sequence,.availability-frame-sequence{overflow:visible!important;contain:layout!important;backface-visibility:hidden!important;transform:translateZ(0)!important}
.availability-frame-sequence::after{content:''!important;position:absolute!important;inset:-2%!important;z-index:9!important;pointer-events:none!important;border-radius:inherit!important;background:radial-gradient(circle at 50% 52%,rgba(255,255,255,.22),rgba(255,255,255,.11) 38%,rgba(255,255,255,.035) 66%,rgba(0,0,0,.08) 100%),linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.18) 52%,rgba(0,0,0,.06))!important;mix-blend-mode:screen!important;opacity:.46!important}
.is-intro-section .intro-jar-clean img{position:absolute!important;left:50%!important;top:50%!important;width:auto!important;height:128%!important;max-width:128%!important;object-fit:contain!important;object-position:center!important;display:block!important;filter:drop-shadow(0 46px 70px rgba(0,0,0,.62))!important;transform-origin:center center!important;transform:translate3d(-50%,-50%,0) scale(1.32)!important;will-change:transform!important;user-select:none!important;pointer-events:none!important}
.strength-leaf-scene img{position:absolute!important;display:block!important;object-fit:contain!important;object-position:center!important;filter:drop-shadow(0 34px 45px rgba(0,0,0,.52))!important;transform-origin:center center!important;will-change:transform!important;user-select:none!important;pointer-events:none!important}
.strength-leaf-middle{left:50%!important;top:50%!important;width:auto!important;height:90%!important;max-width:90%!important;z-index:5!important;transform:translate3d(-50%,-50%,0) scale(1)!important}
.strength-leaf{z-index:4!important;width:auto!important;height:28%!important;max-width:34%!important;opacity:.92!important}
.catalogue-frame-sequence canvas,.availability-frame-sequence canvas{position:absolute!important;z-index:8!important;left:50%!important;top:50%!important;width:188%!important;height:188%!important;display:block!important;transform:translate3d(-50%,-50%,0)!important;filter:drop-shadow(0 42px 64px rgba(0,0,0,.62))!important;will-change:contents!important;user-select:none!important;pointer-events:none!important;backface-visibility:hidden!important}
.availability-frame-sequence canvas{width:145%!important;height:145%!important;filter:brightness(1.08) contrast(.72) saturate(.92) drop-shadow(0 38px 58px rgba(0,0,0,.58))!important}
.contact-social-links{display:flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;margin-top:18px!important;padding-top:16px!important;border-top:1px solid rgba(255,255,255,.12)!important}
.contact-social-link{width:42px!important;height:42px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:999px!important;display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(255,255,255,.06)!important;box-shadow:inset 0 0 22px rgba(255,255,255,.035)!important;transition:transform .22s ease,background .22s ease,border-color .22s ease!important;pointer-events:auto!important}
.contact-social-link:hover{transform:translateY(-2px) scale(1.04)!important;background:rgba(255,255,255,.13)!important;border-color:rgba(255,255,255,.32)!important}
.contact-social-link img{width:22px!important;height:22px!important;object-fit:contain!important;display:block!important;filter:drop-shadow(0 8px 16px rgba(0,0,0,.45))!important}
@media(max-width:900px){.is-intro-section .intro-jar-clean,.strength-leaf-scene,.catalogue-frame-sequence,.availability-frame-sequence{grid-column:1!important;grid-row:2!important;width:min(84vw,400px)!important;height:min(33vh,270px)!important;border-radius:22px!important}.is-intro-section .intro-jar-clean img{width:auto!important;height:132%!important;max-width:132%!important}.strength-leaf-middle{height:88%!important;max-width:88%!important}.strength-leaf{height:30%!important;max-width:36%!important}.catalogue-frame-sequence canvas{width:205%!important;height:205%!important}.availability-frame-sequence canvas{width:158%!important;height:158%!important}.contact-social-link{width:38px!important;height:38px!important}.contact-social-link img{width:20px!important;height:20px!important}}
`;
document.head.appendChild(introJarStyle);
const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
const smooth=v=>v*v*(3-2*v);
const motion={introScale:1.32,introY:0,visualScale:1.12,visualY:8,leafProgress:0,catalogueFrameProgress:0,catalogueFrameIndex:-1,catalogueDrawnIndex:-1,availabilityFrameProgress:0,availabilityFrameIndex:-1,availabilityDrawnIndex:-1};
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
function preloadFrames(count,loader){
  for(let i=1;i<=count;i+=1){
    const img=loader(i);
    if(img.decode)img.decode().catch(()=>{});
  }
}
preloadFrames(catalogueFrameCount,loadCatalogueFrame);
preloadFrames(availabilityFrameCount,loadAvailabilityFrame);
function activeLabel(){return document.querySelector('.scroll-hint span')?.textContent||''}
function percent(){const spans=[...document.querySelectorAll('.scroll-hint span')];const t=spans.at(-1)?.textContent||'0%';const m=t.match(/(\d+)%/);return clamp(m?Number(m[1])/100:0,0,1)}
function transformFor(p){const grow=smooth(clamp(p/.78,0,1));const shrink=smooth(clamp((p-.88)/.12,0,1));return{scale:1.32+grow*.06-shrink*.04,y:0}}
function activeIntroSection(){return document.querySelector('.segment.is-active.is-intro-section')}
function sectionByLabel(label){return [...document.querySelectorAll('.segment')].find(section=>section.querySelector('.eyebrow')?.textContent?.toUpperCase().includes(label))}
function ensureJar(section,className,alt,oldSelector){if(!section)return null;const oldVisual=section.querySelector(oldSelector);if(oldVisual)oldVisual.style.setProperty('display','none','important');let visual=section.querySelector(`.${className}`);if(visual)return visual;visual=document.createElement('div');visual.className=className;const img=document.createElement('img');img.src='/intro-jar.webp';img.alt=alt;img.draggable=false;visual.appendChild(img);section.appendChild(visual);return visual}
function ensureIntro(){return ensureJar(document.querySelector('.is-intro-section'),'intro-jar-clean','KAJA intro jar','.intro-sequence')}
function ensureContactSocials(){
  const section=sectionByLabel('CONTACT');
  const panel=section?.querySelector('.contact-form-panel');
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
function sizeSequenceCanvas(scene,canvas,drawnKey,isAvailability=false){
  const rect=scene.getBoundingClientRect();
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const mult=isAvailability?1.58:2.05;
  const w=Math.max(1,Math.round(rect.width*mult*dpr));
  const h=Math.max(1,Math.round(rect.height*mult*dpr));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;motion[drawnKey]=-1}
}
function applyExposureBalance(ctx,w,h){
  const imageData=ctx.getImageData(0,0,w,h);
  const data=imageData.data;
  for(let i=0;i<data.length;i+=4){
    const a=data[i+3];
    if(a===0)continue;
    const r=data[i],g=data[i+1],b=data[i+2];
    const l=(0.2126*r+0.7152*g+0.0722*b)/255;
    const lift=clamp((0.72-l)*0.44,0,.34);
    const dim=clamp((l-0.72)*0.28,0,.14);
    const gamma=.78;
    data[i]=clamp(Math.pow((r*(1-dim)+255*lift)/255,gamma)*255,0,255);
    data[i+1]=clamp(Math.pow((g*(1-dim)+255*lift)/255,gamma)*255,0,255);
    data[i+2]=clamp(Math.pow((b*(1-dim)+255*lift)/255,gamma)*255,0,255);
  }
  ctx.putImageData(imageData,0,0);
}
function drawSequenceFrame(scene,frame,count,loader,drawnKey,isAvailability=false){
  const canvas=scene.querySelector('canvas');
  if(!canvas)return;
  sizeSequenceCanvas(scene,canvas,drawnKey,isAvailability);
  const reversedFrame=(count-1)-frame;
  const img=loader(reversedFrame+1);
  if(!img.complete||!img.naturalWidth)return;
  if(frame===motion[drawnKey])return;
  const ctx=canvas.getContext('2d',{alpha:true,willReadFrequently:isAvailability});
  const cw=canvas.width,ch=canvas.height;
  ctx.clearRect(0,0,cw,ch);
  const drawScale=isAvailability?1.06:1.28;
  const scale=Math.min(cw/img.naturalWidth,ch/img.naturalHeight)*drawScale;
  const dw=img.naturalWidth*scale;
  const dh=img.naturalHeight*scale;
  ctx.drawImage(img,(cw-dw)/2,(ch-dh)/2,dw,dh);
  if(isAvailability)applyExposureBalance(ctx,cw,ch);
  motion[drawnKey]=frame;
}
function cleanOldSectionVisuals(section){
  if(!section)return;
  section.querySelector('.catalogue-mixology-scene')?.remove();
  section.querySelector('.catalogue-book-scene')?.remove();
  section.querySelector('.catalogue-jar-clean')?.remove();
}
function ensureCatalogue(){const section=sectionByLabel('CATALOGUE');if(!section)return null;cleanOldSectionVisuals(section);const oldVisual=section.querySelector('.visual.visual-strips');if(oldVisual)oldVisual.style.setProperty('display','none','important');let scene=section.querySelector('.catalogue-frame-sequence');if(scene)return scene;scene=document.createElement('div');scene.className='catalogue-frame-sequence';const canvas=document.createElement('canvas');canvas.setAttribute('aria-label','Catalogue animation frame');scene.appendChild(canvas);section.appendChild(scene);return scene}
function ensureAvailability(){const section=sectionByLabel('AVAILABILITY');if(!section)return null;const oldVisual=section.querySelector('.visual');if(oldVisual)oldVisual.style.setProperty('display','none','important');let scene=section.querySelector('.availability-frame-sequence');if(scene)return scene;scene=document.createElement('div');scene.className='availability-frame-sequence';const canvas=document.createElement('canvas');canvas.setAttribute('aria-label','Availability animation frame');scene.appendChild(canvas);section.appendChild(scene);return scene}
function ensureStrength(){const section=sectionByLabel('STRENGTH');if(!section)return null;const oldVisual=section.querySelector('.visual.visual-stack');if(oldVisual)oldVisual.style.setProperty('display','none','important');let scene=section.querySelector('.strength-leaf-scene');if(scene)return scene;scene=document.createElement('div');scene.className='strength-leaf-scene';const middle=document.createElement('img');middle.className='strength-leaf-middle';middle.src='/leaf-middle.webp';middle.alt='Strength leaf center';middle.draggable=false;scene.appendChild(middle);for(let i=2;i<=13;i+=1){const img=document.createElement('img');const data=leafLayout[i-2];img.className='strength-leaf';img.src=`/leaf${i}.webp`;img.alt='';img.draggable=false;img.setAttribute('aria-hidden','true');img.dataset.x=data.x;img.dataset.y=data.y;img.dataset.s=data.s;img.dataset.r=data.r;img.dataset.dx=data.dx;img.dataset.dy=data.dy;img.dataset.dr=data.dr;img.style.left=`${data.x}%`;img.style.top=`${data.y}%`;scene.appendChild(img)}section.appendChild(scene);return scene}
function spring(current,target,amount){return current+(target-current)*amount}
function animateJar(visual,p,scaleKey,yKey){const img=visual?.querySelector('img');if(!img)return;const t=transformFor(p);motion[scaleKey]=spring(motion[scaleKey],t.scale,.16);motion[yKey]=spring(motion[yKey],t.y,.14);img.style.setProperty('transform',`translate3d(-50%,calc(-50% + ${motion[yKey]}vh),0) scale(${motion[scaleKey]})`,'important')}
function animateStrengthItems(scene,p){if(!scene)return;motion.leafProgress=spring(motion.leafProgress,p,.15);const eased=smooth(motion.leafProgress);const middle=scene.querySelector('.strength-leaf-middle');if(middle)middle.style.setProperty('transform','translate3d(-50%,-50%,0) scale(1.1)','important');scene.querySelectorAll('.strength-leaf').forEach((item)=>{const x=Number(item.dataset.x);const y=Number(item.dataset.y);const s=Number(item.dataset.s);const r=Number(item.dataset.r);const dx=Number(item.dataset.dx);const dy=Number(item.dataset.dy);const dr=Number(item.dataset.dr);item.style.left=`${x}%`;item.style.top=`${y}%`;item.style.setProperty('transform',`translate3d(calc(-50% + ${dx*eased}px),calc(-50% + ${dy*eased}px),0) rotate(${r+dr*eased}deg) scale(${s+(eased*.14)})`,'important')})}
function animateCatalogueFrames(scene,p){if(!scene)return;motion.catalogueFrameProgress=spring(motion.catalogueFrameProgress,p,.12);const frame=clamp(Math.round(motion.catalogueFrameProgress*(catalogueFrameCount-1)),0,catalogueFrameCount-1);drawSequenceFrame(scene,frame,catalogueFrameCount,loadCatalogueFrame,'catalogueDrawnIndex',false);scene.style.setProperty('transform','translateZ(0)','important')}
function animateAvailabilityFrames(scene,p){if(!scene)return;motion.availabilityFrameProgress=spring(motion.availabilityFrameProgress,p,.12);const frame=clamp(Math.round(motion.availabilityFrameProgress*(availabilityFrameCount-1)),0,availabilityFrameCount-1);drawSequenceFrame(scene,frame,availabilityFrameCount,loadAvailabilityFrame,'availabilityDrawnIndex',true);scene.style.setProperty('transform','translateZ(0)','important')}
function tick(){const label=activeLabel();const p=percent();if(activeIntroSection()||label.includes('INTRO')){animateJar(ensureIntro(),p,'introScale','introY')}else if(label.includes('STRENGTH')){animateStrengthItems(ensureStrength(),p)}else if(label.includes('CATALOGUE')){animateCatalogueFrames(ensureCatalogue(),p)}else if(label.includes('AVAILABILITY')){animateAvailabilityFrames(ensureAvailability(),p)}else if(label.includes('CONTACT')){ensureContactSocials()}else{const visual=document.querySelector('.segment.is-active .visual');if(visual){const t=transformFor(p);const targetY=8-(18*p);motion.visualScale=spring(motion.visualScale,t.scale,.18);motion.visualY=spring(motion.visualY,targetY,.16);visual.style.setProperty('transform',`translateY(${motion.visualY}vh) scale(${motion.visualScale})`,'important')}}requestAnimationFrame(tick)}
requestAnimationFrame(tick);