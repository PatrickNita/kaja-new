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
const introState={percent:0,lastTouch:null};
function introActive(){return (document.querySelector('.scroll-hint')?.textContent||'').includes('INTRO')}
function syncFromLabel(){
  const text=document.querySelector('.scroll-hint')?.textContent||'';
  if(!text.includes('INTRO'))return null;
  const match=text.match(/(\d+)%/);
  return clamp(match?Number(match[1])/100:0,0,1);
}
function updateFromDelta(delta){
  if(!introActive())return;
  introState.percent=clamp(introState.percent+(delta/1700),0,1);
}
window.addEventListener('wheel',event=>updateFromDelta(event.deltaY),{capture:true,passive:true});
window.addEventListener('touchstart',event=>{introState.lastTouch=event.touches?.[0]?.clientY??null},{capture:true,passive:true});
window.addEventListener('touchmove',event=>{if(introState.lastTouch===null)return;const y=event.touches?.[0]?.clientY??introState.lastTouch;updateFromDelta((introState.lastTouch-y)*3.15);introState.lastTouch=y},{capture:true,passive:true});
window.addEventListener('touchend',()=>{introState.lastTouch=null},{capture:true,passive:true});
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
  const labelPercent=syncFromLabel();
  if(labelPercent!==null&&Math.abs(labelPercent-introState.percent)>.18)introState.percent=labelPercent;
  const img=visual?.querySelector('img');
  if(visual&&img&&introActive()){
    const p=introState.percent;
    const grow=smooth(clamp(p/.65,0,1));
    const shrink=smooth(clamp((p-.65)/.35,0,1));
    const scale=1.12+(grow*.26)-(shrink*.34);
    const y=shrink*10;
    visual.style.transform='translate3d(0,0,0)';
    img.style.setProperty('transform',`translate3d(0,${y}vh,0) scale(${scale})`,'important');
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
