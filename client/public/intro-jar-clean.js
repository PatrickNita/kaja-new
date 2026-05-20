const introJarStyle=document.createElement('style');
introJarStyle.textContent=`
.is-intro-section .intro-jar-clean{
  position:relative!important;
  z-index:5!important;
  grid-column:2!important;
  grid-row:1!important;
  justify-self:center!important;
  align-self:center!important;
  width:min(46vw,680px)!important;
  height:min(52vh,560px)!important;
  border:1px solid rgba(255,255,255,.16)!important;
  border-radius:clamp(20px,3vw,32px)!important;
  overflow:visible!important;
  background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.025))!important;
  box-shadow:0 60px 140px rgba(0,0,0,.7),inset 0 0 90px rgba(255,255,255,.04)!important;
  transform-origin:center center!important;
  pointer-events:none!important;
}
.is-intro-section .intro-jar-clean img{
  position:absolute!important;
  inset:-8%!important;
  width:116%!important;
  height:116%!important;
  object-fit:contain!important;
  object-position:center!important;
  display:block!important;
  filter:drop-shadow(0 46px 70px rgba(0,0,0,.62))!important;
  transform-origin:center center!important;
  will-change:transform!important;
  user-select:none!important;
  pointer-events:none!important;
}
@media(max-width:900px){
  .is-intro-section .intro-jar-clean{grid-column:1!important;grid-row:2!important;width:min(84vw,400px)!important;height:min(33vh,270px)!important;border-radius:22px!important;}
  .is-intro-section .intro-jar-clean img{inset:-10%!important;width:120%!important;height:120%!important;}
}
`;
document.head.appendChild(introJarStyle);
const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
const smooth=(v)=>v*v*(3-2*v);
const state={progress:0,scale:1.18,y:0};
function targetProgress(){
  const hint=document.querySelector('.scroll-hint');
  const text=hint?.textContent||'';
  if(!text.includes('INTRO'))return null;
  const match=text.match(/(\d+)%/);
  if(match)return clamp(Number(match[1])/100,0,1);
  const bar=document.querySelector('.is-intro-section .progress-track span');
  const transform=bar?getComputedStyle(bar).transform:'';
  if(transform&&transform!=='none'){
    const values=transform.match(/matrix\(([^)]+)\)/)?.[1]?.split(',').map(Number);
    if(values&&Number.isFinite(values[0]))return clamp(values[0],0,1);
  }
  return 0;
}
function ensure(){
  const section=document.querySelector('.is-intro-section');
  if(!section)return null;
  let visual=section.querySelector('.intro-jar-clean');
  if(visual)return visual;
  visual=document.createElement('div');
  visual.className='intro-jar-clean';
  visual.setAttribute('aria-label','KAJA intro jar visual');
  const img=document.createElement('img');
  img.src='/intro-jar.webp';
  img.alt='KAJA intro jar';
  img.draggable=false;
  visual.appendChild(img);
  section.appendChild(visual);
  return visual;
}
function tick(){
  const visual=ensure();
  const target=targetProgress();
  const img=visual?.querySelector('img');
  if(visual&&img&&target!==null){
    state.progress+=(target-state.progress)*.105;
    if(Math.abs(target-state.progress)<.002)state.progress=target;
    const grow=smooth(clamp(state.progress/.55,0,1));
    const end=smooth(clamp((state.progress-.68)/.32,0,1));
    const scale=1.18+grow*.34-end*.42;
    const y=end*13;
    state.scale+=(scale-state.scale)*.26;
    state.y+=(y-state.y)*.26;
    visual.style.transform='translate3d(0,0,0)';
    img.style.setProperty('transform',`translate3d(0,${state.y}vh,0) scale(${state.scale})`,'important');
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
