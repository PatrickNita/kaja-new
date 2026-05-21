const introJarStyle=document.createElement('style');
introJarStyle.textContent=`
.is-intro-section .intro-sequence,.is-hanger-section ~ .segment .intro-sequence{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
.is-intro-section .intro-jar-clean,.strength-leaf-scene,.catalogue-mixology-scene{position:relative!important;z-index:5!important;grid-column:2!important;grid-row:1!important;justify-self:center!important;align-self:center!important;width:min(46vw,680px)!important;height:min(52vh,560px)!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:clamp(20px,3vw,32px)!important;overflow:visible!important;background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.025))!important;box-shadow:0 60px 140px rgba(0,0,0,.7),inset 0 0 90px rgba(255,255,255,.04)!important;transform-origin:center center!important;pointer-events:none!important}
.is-intro-section .intro-jar-clean img{position:absolute!important;left:50%!important;top:50%!important;width:auto!important;height:116%!important;max-width:116%!important;object-fit:contain!important;object-position:center!important;display:block!important;filter:drop-shadow(0 46px 70px rgba(0,0,0,.62))!important;transform-origin:center center!important;transform:translate3d(-50%,-50%,0) scale(1.24)!important;will-change:transform!important;user-select:none!important;pointer-events:none!important}
.strength-leaf-scene img,.catalogue-mixology-scene img{position:absolute!important;display:block!important;object-fit:contain!important;object-position:center!important;filter:drop-shadow(0 34px 45px rgba(0,0,0,.52))!important;transform-origin:center center!important;will-change:transform!important;user-select:none!important;pointer-events:none!important}
.strength-leaf-middle,.catalogue-mixology-middle{left:50%!important;top:50%!important;width:auto!important;height:78%!important;max-width:78%!important;z-index:5!important;transform:translate3d(-50%,-50%,0) scale(1)!important}
.strength-leaf,.catalogue-mixology-item{z-index:4!important;width:auto!important;height:22%!important;max-width:28%!important;opacity:.92!important}
@media(max-width:900px){.is-intro-section .intro-jar-clean,.strength-leaf-scene,.catalogue-mixology-scene{grid-column:1!important;grid-row:2!important;width:min(84vw,400px)!important;height:min(33vh,270px)!important;border-radius:22px!important}.is-intro-section .intro-jar-clean img{width:auto!important;height:120%!important;max-width:120%!important}.strength-leaf-middle,.catalogue-mixology-middle{height:76%!important;max-width:76%!important}.strength-leaf,.catalogue-mixology-item{height:24%!important;max-width:30%!important}}
`;
document.head.appendChild(introJarStyle);
const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
const smooth=v=>v*v*(3-2*v);
const motion={introScale:1.24,introY:0,visualScale:1.12,visualY:8,leafProgress:0,catalogueProgress:0};
const leafLayout=[
  {x:18,y:22,s:.82,r:-34,dx:-38,dy:-18,dr:-42},
  {x:32,y:12,s:.62,r:18,dx:-18,dy:-34,dr:28},
  {x:58,y:14,s:.72,r:-8,dx:18,dy:-30,dr:-24},
  {x:78,y:24,s:.88,r:31,dx:38,dy:-12,dr:40},
  {x:86,y:48,s:.64,r:-44,dx:48,dy:4,dr:-38},
  {x:75,y:74,s:.78,r:12,dx:34,dy:28,dr:32},
  {x:55,y:86,s:.66,r:-18,dx:12,dy:42,dr:-30},
  {x:32,y:78,s:.84,r:42,dx:-24,dy:34,dr:46},
  {x:13,y:58,s:.7,r:-12,dx:-48,dy:14,dr:-28},
  {x:22,y:42,s:.58,r:24,dx:-36,dy:-4,dr:36},
  {x:48,y:28,s:.52,r:-52,dx:-8,dy:-24,dr:-44},
  {x:65,y:56,s:.6,r:54,dx:24,dy:16,dr:48}
];
const catalogueFiles=['aperol.webp','strawberry.webp','pumpkin.webp','milk.webp','lemon-drops.webp','icecube.webp','coffee.webp','cinnamon.webp','chocolate-strawberry.webp','cheesecake.webp'];
const catalogueLayout=[
  {x:19,y:20,s:.76,r:-22,dx:-34,dy:-16,dr:-34},
  {x:36,y:13,s:.64,r:18,dx:-18,dy:-31,dr:28},
  {x:61,y:15,s:.72,r:-10,dx:18,dy:-28,dr:-24},
  {x:80,y:30,s:.80,r:28,dx:36,dy:-10,dr:36},
  {x:83,y:58,s:.62,r:-38,dx:42,dy:16,dr:-32},
  {x:65,y:80,s:.70,r:14,dx:25,dy:36,dr:30},
  {x:40,y:84,s:.66,r:-16,dx:-10,dy:40,dr:-28},
  {x:18,y:63,s:.74,r:32,dx:-42,dy:18,dr:40},
  {x:24,y:43,s:.58,r:-48,dx:-36,dy:-2,dr:-38},
  {x:51,y:51,s:.68,r:44,dx:8,dy:18,dr:42}
];
function activeLabel(){return document.querySelector('.scroll-hint span')?.textContent||''}
function percent(){const spans=[...document.querySelectorAll('.scroll-hint span')];const t=spans.at(-1)?.textContent||'0%';const m=t.match(/(\d+)%/);return clamp(m?Number(m[1])/100:0,0,1)}
function transformFor(p){const grow=smooth(clamp(p/.78,0,1));const shrink=smooth(clamp((p-.88)/.12,0,1));return{scale:1.24+grow*.06-shrink*.04,y:0}}
function sectionByLabel(label){return [...document.querySelectorAll('.segment')].find(section=>section.querySelector('.eyebrow')?.textContent?.toUpperCase().includes(label))}
function ensureJar(section,className,alt,oldSelector){if(!section)return null;const oldVisual=section.querySelector(oldSelector);if(oldVisual)oldVisual.style.setProperty('display','none','important');let visual=section.querySelector(`.${className}`);if(visual)return visual;visual=document.createElement('div');visual.className=className;const img=document.createElement('img');img.src='/intro-jar.webp';img.alt=alt;img.draggable=false;visual.appendChild(img);section.appendChild(visual);return visual}
function ensureIntro(){return ensureJar(document.querySelector('.is-intro-section'),'intro-jar-clean','KAJA intro jar','.intro-sequence')}
function ensureCatalogue(){const section=sectionByLabel('CATALOGUE');if(!section)return null;const oldVisual=section.querySelector('.visual.visual-strips');if(oldVisual)oldVisual.style.setProperty('display','none','important');const oldBook=section.querySelector('.catalogue-book-scene');if(oldBook)oldBook.remove();const oldJar=section.querySelector('.catalogue-jar-clean');if(oldJar)oldJar.remove();let scene=section.querySelector('.catalogue-mixology-scene');if(scene)return scene;scene=document.createElement('div');scene.className='catalogue-mixology-scene';const middle=document.createElement('img');middle.className='catalogue-mixology-middle';middle.src='/aperol.webp';middle.alt='Catalogue mixology center';middle.draggable=false;scene.appendChild(middle);catalogueFiles.forEach((file,index)=>{const img=document.createElement('img');const data=catalogueLayout[index];img.className='catalogue-mixology-item';img.src=`/${file}`;img.alt='';img.draggable=false;img.setAttribute('aria-hidden','true');img.dataset.x=data.x;img.dataset.y=data.y;img.dataset.s=data.s;img.dataset.r=data.r;img.dataset.dx=data.dx;img.dataset.dy=data.dy;img.dataset.dr=data.dr;img.style.left=`${data.x}%`;img.style.top=`${data.y}%`;scene.appendChild(img)});section.appendChild(scene);return scene}
function ensureStrength(){const section=sectionByLabel('STRENGTH');if(!section)return null;const oldVisual=section.querySelector('.visual.visual-stack');if(oldVisual)oldVisual.style.setProperty('display','none','important');let scene=section.querySelector('.strength-leaf-scene');if(scene)return scene;scene=document.createElement('div');scene.className='strength-leaf-scene';const middle=document.createElement('img');middle.className='strength-leaf-middle';middle.src='/leaf-middle.webp';middle.alt='Strength leaf center';middle.draggable=false;scene.appendChild(middle);for(let i=2;i<=13;i+=1){const img=document.createElement('img');const data=leafLayout[i-2];img.className='strength-leaf';img.src=`/leaf${i}.webp`;img.alt='';img.draggable=false;img.setAttribute('aria-hidden','true');img.dataset.x=data.x;img.dataset.y=data.y;img.dataset.s=data.s;img.dataset.r=data.r;img.dataset.dx=data.dx;img.dataset.dy=data.dy;img.dataset.dr=data.dr;img.style.left=`${data.x}%`;img.style.top=`${data.y}%`;scene.appendChild(img)}section.appendChild(scene);return scene}
function spring(current,target,amount){return current+(target-current)*amount}
function animateJar(visual,p,scaleKey,yKey){const img=visual?.querySelector('img');if(!img)return;const t=transformFor(p);motion[scaleKey]=spring(motion[scaleKey],t.scale,.16);motion[yKey]=spring(motion[yKey],t.y,.14);img.style.setProperty('transform',`translate3d(-50%,calc(-50% + ${motion[yKey]}vh),0) scale(${motion[scaleKey]})`,'important')}
function animateFloatingItems(scene,p,progressKey,itemSelector,middleSelector){if(!scene)return;motion[progressKey]=spring(motion[progressKey],p,.15);const eased=smooth(motion[progressKey]);const middle=scene.querySelector(middleSelector);if(middle)middle.style.setProperty('transform','translate3d(-50%,-50%,0) scale(1)','important');scene.querySelectorAll(itemSelector).forEach((item)=>{const x=Number(item.dataset.x);const y=Number(item.dataset.y);const s=Number(item.dataset.s);const r=Number(item.dataset.r);const dx=Number(item.dataset.dx);const dy=Number(item.dataset.dy);const dr=Number(item.dataset.dr);item.style.left=`${x}%`;item.style.top=`${y}%`;item.style.setProperty('transform',`translate3d(calc(-50% + ${dx*eased}px),calc(-50% + ${dy*eased}px),0) rotate(${r+dr*eased}deg) scale(${s+(eased*.12)})`,'important')})}
function tick(){const label=activeLabel();const p=percent();if(label.includes('INTRO')){animateJar(ensureIntro(),p,'introScale','introY')}else if(label.includes('STRENGTH')){animateFloatingItems(ensureStrength(),p,'leafProgress','.strength-leaf','.strength-leaf-middle')}else if(label.includes('CATALOGUE')){animateFloatingItems(ensureCatalogue(),p,'catalogueProgress','.catalogue-mixology-item','.catalogue-mixology-middle')}else{const visual=document.querySelector('.segment.is-active .visual');if(visual){const t=transformFor(p);const targetY=8-(18*p);motion.visualScale=spring(motion.visualScale,t.scale,.18);motion.visualY=spring(motion.visualY,targetY,.16);visual.style.setProperty('transform',`translateY(${motion.visualY}vh) scale(${motion.visualScale})`,'important')}}requestAnimationFrame(tick)}
requestAnimationFrame(tick);
