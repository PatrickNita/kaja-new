const introJarStyle=document.createElement('style');
introJarStyle.textContent=`
.is-intro-section .intro-sequence{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
.is-intro-section .intro-jar-clean{position:relative!important;z-index:5!important;grid-column:2!important;grid-row:1!important;justify-self:center!important;align-self:center!important;width:min(46vw,680px)!important;height:min(52vh,560px)!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:clamp(20px,3vw,32px)!important;overflow:visible!important;background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.025))!important;box-shadow:0 60px 140px rgba(0,0,0,.7),inset 0 0 90px rgba(255,255,255,.04)!important;transform-origin:center center!important;pointer-events:none!important}
.is-intro-section .intro-jar-clean img{position:absolute!important;inset:-8%!important;width:116%!important;height:116%!important;object-fit:contain!important;object-position:center!important;display:block!important;filter:drop-shadow(0 46px 70px rgba(0,0,0,.62))!important;transform-origin:center center!important;will-change:transform!important;user-select:none!important;pointer-events:none!important}
@media(max-width:900px){.is-intro-section .intro-jar-clean{grid-column:1!important;grid-row:2!important;width:min(84vw,400px)!important;height:min(33vh,270px)!important;border-radius:22px!important}.is-intro-section .intro-jar-clean img{inset:-10%!important;width:120%!important;height:120%!important}}
`;
document.head.appendChild(introJarStyle);
const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
const smooth=v=>v*v*(3-2*v);
const motion={introScale:1.24,introY:0,visualScale:1.12,visualY:8};
function activeLabel(){return document.querySelector('.scroll-hint span')?.textContent||''}
function percent(){const spans=[...document.querySelectorAll('.scroll-hint span')];const t=spans.at(-1)?.textContent||'0%';const m=t.match(/(\d+)%/);return clamp(m?Number(m[1])/100:0,0,1)}
function transformFor(p){const grow=smooth(clamp(p/.78,0,1));const shrink=smooth(clamp((p-.88)/.12,0,1));return{scale:1.24+grow*.06-shrink*.04,y:0}}
function ensureIntro(){const section=document.querySelector('.is-intro-section');if(!section)return null;let visual=section.querySelector('.intro-jar-clean');if(visual)return visual;visual=document.createElement('div');visual.className='intro-jar-clean';const img=document.createElement('img');img.src='/intro-jar.webp';img.alt='KAJA intro jar';img.draggable=false;visual.appendChild(img);section.appendChild(visual);return visual}
function spring(current,target,amount){return current+(target-current)*amount}
function tick(){const label=activeLabel();const p=percent();if(label.includes('INTRO')){const visual=ensureIntro();const img=visual?.querySelector('img');if(img){const t=transformFor(p);motion.introScale=spring(motion.introScale,t.scale,.16);motion.introY=spring(motion.introY,t.y,.14);img.style.setProperty('transform',`translate3d(0,${motion.introY}vh,0) scale(${motion.introScale})`,'important')}}else{const visual=document.querySelector('.segment.is-active .visual');if(visual){const t=transformFor(p);const targetY=8-(18*p);motion.visualScale=spring(motion.visualScale,t.scale,.18);motion.visualY=spring(motion.visualY,targetY,.16);visual.style.setProperty('transform',`translateY(${motion.visualY}vh) scale(${motion.visualScale})`,'important')}}requestAnimationFrame(tick)}
requestAnimationFrame(tick);
