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
  will-change:transform!important;
  pointer-events:none!important;
}
.is-intro-section .intro-jar-clean img{
  position:absolute!important;
  inset:-2%!important;
  width:104%!important;
  height:104%!important;
  object-fit:contain!important;
  object-position:center!important;
  display:block!important;
  filter:drop-shadow(0 46px 70px rgba(0,0,0,.62))!important;
  user-select:none!important;
  pointer-events:none!important;
}
@media(max-width:900px){
  .is-intro-section .intro-jar-clean{
    grid-column:1!important;
    grid-row:2!important;
    width:min(84vw,400px)!important;
    height:min(33vh,270px)!important;
    border-radius:22px!important;
  }
  .is-intro-section .intro-jar-clean img{inset:-4%!important;width:108%!important;height:108%!important;}
}
`;
document.head.appendChild(introJarStyle);
const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
const smooth=(v)=>v*v*(3-2*v);
const state={scale:1.16,y:0,targetScale:1.16,targetY:0};
let fallbackProgress=0;
function progress(){
  const text=document.querySelector('.scroll-hint')?.textContent||'';
  if(text.includes('INTRO')){
    const match=text.match(/(\d+)%/);
    fallbackProgress=clamp(match?Number(match[1])/100:0,0,1);
    return fallbackProgress;
  }
  return null;
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
  const p=progress();
  if(visual&&p!==null){
    const grow=smooth(clamp(p/.56,0,1));
    const end=smooth(clamp((p-.68)/.32,0,1));
    state.targetScale=1.16+grow*.28-end*.34;
    state.targetY=end*10;
    state.scale+=(state.targetScale-state.scale)*.24;
    state.y+=(state.targetY-state.y)*.24;
    visual.style.transform=`translate3d(0,${state.y}vh,0) scale(${state.scale})`;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
