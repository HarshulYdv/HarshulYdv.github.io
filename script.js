var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// Typewriter role cycle
var roles=['AI/ML Engineer','Data Scientist','Deep Learning','Researcher'],ri=0,ci=roles[0].length,del=true,el=document.getElementById('role');
if(!reduce){(function tick(){
  var w=roles[ri];
  if(del){ci--;if(ci<=0){del=false;ri=(ri+1)%roles.length;ci=0;}}
  else{ci++;if(ci>=roles[ri].length){del=true;el.textContent=roles[ri];return void setTimeout(tick,1600);}}
  el.textContent=roles[ri].slice(0,ci)||'\u200b';
  setTimeout(tick,del?45:90);
})();}
// Count-up stats
function run(b){
  var n=parseFloat(b.dataset.n),s=b.dataset.s,dec=String(n).indexOf('.')>-1?1:0;
  if(reduce){b.textContent=n+s;return;}
  var t0=null;(function f(t){t0=t0||t;var p=Math.min((t-t0)/1400,1),e=1-Math.pow(1-p,3);
    b.textContent=(n*e).toFixed(dec)+s;if(p<1)requestAnimationFrame(f);})(performance.now());
}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);io.unobserve(e.target);}});},{threshold:.6});
document.querySelectorAll('[data-n]').forEach(function(b){io.observe(b);});
// Copy email
document.getElementById('copy').addEventListener('click',function(){
  var b=this,t=document.getElementById('addr').textContent;
  try{navigator.clipboard.writeText(t).then(function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy email';},1800);},function(){b.textContent=t;});}
  catch(e){b.textContent=t;}
});
// Custom cursor (mouse and trackpad only)
if(matchMedia('(hover: hover) and (pointer: fine)').matches){
  var dot=document.createElement('div'),ring=document.createElement('div');
  dot.className='cur-dot';ring.className='cur-ring';dot.setAttribute('aria-hidden','true');ring.setAttribute('aria-hidden','true');
  document.body.append(ring,dot);document.documentElement.classList.add('has-cursor');
  var mx=0,my=0,rx=0,ry=0,seen=false;
  addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    if(!seen){seen=true;rx=mx;ry=my;dot.classList.add('show');ring.classList.add('show');}
    dot.style.transform='translate('+mx+'px,'+my+'px)';
    ring.classList.toggle('on',!!(e.target.closest&&e.target.closest('a,button,.card,.rail')));
  });
  addEventListener('mousedown',function(){ring.classList.add('down');});
  addEventListener('mouseup',function(){ring.classList.remove('down');});
  document.addEventListener('mouseleave',function(){dot.classList.remove('show');ring.classList.remove('show');seen=false;});
  (function loop(){
    rx+=(mx-rx)*(reduce?1:.18);ry+=(my-ry)*(reduce?1:.18);
    ring.style.transform='translate('+rx+'px,'+ry+'px)';
    requestAnimationFrame(loop);
  })();
}
// Apple-style scroll effects
(function(){
  var words=document.getElementById('words');
  var ws=words.textContent.trim().split(/\s+/);
  words.innerHTML=ws.map(function(w){return '<span>'+w+'</span>';}).join(' ');
  var spans=words.querySelectorAll('span');
  if(reduce){spans.forEach(function(s){s.classList.add('on');});return;}
  var root=document.documentElement,hero=document.querySelector('.hero'),pin=document.getElementById('pin'),tl=document.querySelector('.tl');
  var bar=document.createElement('div');bar.className='sp';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
  function clamp(v){return Math.max(0,Math.min(1,v));}
  var ticking=false;
  function update(){
    ticking=false;
    var max=root.scrollHeight-innerHeight;
    root.style.setProperty('--sp',max>0?scrollY/max:0);
    var hr=hero.getBoundingClientRect();
    hero.style.setProperty('--hp',clamp(-hr.top/(hr.height*.9)).toFixed(3));
    var pr=pin.getBoundingClientRect();
    var n=Math.floor(clamp(-pr.top/(pr.height-innerHeight))*spans.length*1.15);
    spans.forEach(function(s,i){s.classList.toggle('on',i<n);});
    var tr=tl.getBoundingClientRect();
    tl.style.setProperty('--p',clamp((innerHeight*.65-tr.top)/tr.height).toFixed(3));
  }
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',update);update();
  // Reveal on scroll
  var rio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    var el=e.target,d=Math.min(Array.prototype.indexOf.call(el.parentNode.children,el)*80,400);
    el.style.transitionDelay=d+'ms';el.classList.add('in');rio.unobserve(el);
    setTimeout(function(){el.classList.remove('rv','in');el.style.transitionDelay='';},1200+d);
  });},{threshold:.15,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('section h2,section .sub,.card,.tl>div,.now>div,.intents a,.mail').forEach(function(el){el.classList.add('rv');rio.observe(el);});
})();
// Spotlight glow follows the pointer inside cards
document.querySelectorAll('.card,.intents a,.now div').forEach(function(el){
  el.addEventListener('pointermove',function(e){
    var r=el.getBoundingClientRect();
    el.style.setProperty('--mx',(e.clientX-r.left)+'px');
    el.style.setProperty('--my',(e.clientY-r.top)+'px');
  });
});
// Theme toggle
document.getElementById('theme').addEventListener('click',function(){
  var r=document.documentElement;
  var dark=r.dataset.theme?r.dataset.theme==='dark':!matchMedia('(prefers-color-scheme: light)').matches;
  r.dataset.theme=dark?'light':'dark';
});

// ---- Second script block: boot, demos, interactive elements ----
(function(){
function clamp(v){return Math.max(0,Math.min(1,v));}
function onView(el,fn){new IntersectionObserver(function(es){fn(es[0].isIntersecting);},{threshold:.2}).observe(el);}
// Boot intro
var boot=document.getElementById('boot'),seen=false;
try{seen=sessionStorage.getItem('hy-boot')==='1';sessionStorage.setItem('hy-boot','1');}catch(e){}
function endBoot(){if(!boot)return;boot.classList.add('off');setTimeout(function(){if(boot){boot.remove();boot=null;}},700);}
if(reduce||seen){if(boot){boot.remove();boot=null;}}
else{
  var out=document.getElementById('bootTxt'),lines=['> loading harshul.py ...','> import torch, xgboost, fastapi','> <em>ready.</em>'],li=0,ci2=0,buf='';
  boot.addEventListener('click',endBoot);addEventListener('keydown',endBoot,{once:true});
  (function type(){
    if(!boot)return;
    if(li>=lines.length){setTimeout(endBoot,350);return;}
    var plain=lines[li].replace(/<[^>]+>/g,'');
    if(ci2<plain.length){ci2++;out.innerHTML=buf+plain.slice(0,ci2);setTimeout(type,18);}
    else{buf+=lines[li]+'\n';out.innerHTML=buf;li++;ci2=0;setTimeout(type,li===1?260:200);}
  })();
}
// Rotating status
(function(){
  var el=document.getElementById('nowv'),items=['AgentGuard','Competency Gap Platform','AgentGuard banking simulation'],i=0;
  if(reduce)return;
  setInterval(function(){el.classList.add('out');setTimeout(function(){i=(i+1)%items.length;el.textContent=items[i];el.classList.remove('out');},320);},3200);
})();
// Mel spectrogram demo
(function(){
  var cv=document.getElementById('logc');if(!cv)return;
  var cx=cv.getContext('2d'),W=cv.width,H=cv.height,N=72,R=22,T=9000,B=Math.round(N*.52),box=document.getElementById('logd'),vt=document.getElementById('logv'),last='',vis=false,raf=0;
  function rnd(i,j){var x=Math.sin(i*127.1+j*311.7)*43758.5453;return x-Math.floor(x);}
  function S(i,j){var v=.08+.14*rnd(i,j)+.12*Math.max(0,1-j/R*1.6);
    if(i>=B){var h=0;[3,6,9,12,15].forEach(function(r){h+=Math.exp(-Math.pow(j-r,2)/.8);});v+=.55*h*(.8+.2*rnd(i,5))+.25*Math.max(0,1-j/R*1.2);}
    return Math.min(1,v);}
  var stops=[[16,12,40],[90,60,200],[255,93,143],[255,214,102]];
  function col(v){var p=v*3,k=Math.min(2,Math.floor(p)),f=p-k;return 'rgb('+[0,1,2].map(function(c){return Math.round(stops[k][c]+(stops[k+1][c]-stops[k][c])*f);}).join(',')+')';} 
  function amp(i,t){var a=.12+.08*Math.sin(i*.9+t*.004)+.06*rnd(i,Math.floor(t/90));if(i>=B)a+=.55*(.6+.4*Math.sin(i*2.3+t*.03))*(.7+.3*rnd(i,Math.floor(t/70)));return Math.min(1,a);}
  function frame(t){
    var ph=t%T,m=ph<3000?0:ph<5200?(ph-3000)/2200:1,cs=getComputedStyle(document.documentElement),acc=cs.getPropertyValue('--accent').trim()||'#8b7bff',hot=cs.getPropertyValue('--hot').trim()||'#ff5d8f',cw=W/N,ch=H/R;
    cx.clearRect(0,0,W,H);
    for(var i=0;i<N;i++){
      var x=i*cw;
      if(i/N<m){for(var j=0;j<R;j++){cx.fillStyle=col(S(i,j));cx.fillRect(x,H-(j+1)*ch,cw+.5,ch+.5);}}
      else{var a=amp(i,t)*H*.5;cx.fillStyle=i>=B?hot:acc;cx.fillRect(x+cw*.2,H/2-a,cw*.6,Math.max(2,2*a));}
    }
    if(m>0&&m<1){cx.fillStyle=hot;cx.fillRect(m*W,0,2,H);}
    if(ph>=5200){cx.strokeStyle=hot;cx.globalAlpha=.55+.45*Math.sin(ph*.012);cx.lineWidth=3;cx.strokeRect(B*cw,2,W-B*cw-2,H-4);cx.globalAlpha=1;}
    var s=ph<3000?'Listening…':ph<5200?'Converting to Mel spectrogram…':'Chainsaw detected';
    if(s!==last){last=s;vt.textContent=s;box.classList.toggle('hit',ph>=5200);}
  }
  function loop(t){if(!vis)return;frame(t);raf=requestAnimationFrame(loop);}
  if(reduce){frame(5600);return;}
  onView(cv,function(v){vis=v;cancelAnimationFrame(raf);if(v)raf=requestAnimationFrame(loop);});
})();
// Grad-CAM tap/keyboard toggle (hover is handled in CSS)
(function(){
  var c=document.getElementById('cam');if(!c)return;
  function tg(){var on=c.classList.toggle('on');c.setAttribute('aria-pressed',on);}
  c.addEventListener('click',tg);
  c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tg();}});
})();
// Pipeline draws on scroll
(function(){
  var ps=document.querySelectorAll('.pipe');if(!ps.length)return;
  function upd(){ps.forEach(function(p){var r=p.getBoundingClientRect();p.style.setProperty('--pp',reduce?1:clamp((innerHeight*.9-r.top)/(innerHeight*.45)).toFixed(3));});}
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
})();
// AgentGuard action chain
(function(){
  var c=document.getElementById('chain');if(!c)return;
  var li=[].slice.call(c.querySelectorAll('li')),vis=false,running=false,tm=[];
  function lab(l,s){l.querySelector('i').textContent=s;}
  function flag(){var l=li[li.length-1];l.classList.add('bad');lab(l,'blocked');c.classList.add('flag');}
  function reset(){li.forEach(function(l){l.className='';lab(l,'');});c.classList.remove('flag');}
  if(reduce){li.forEach(function(l){l.classList.add('on');lab(l,'allowed');});flag();return;}
  function play(){
    reset();
    li.forEach(function(l,k){tm.push(setTimeout(function(){l.classList.add('on');lab(l,'allowed');},500+k*700));});
    var t=500+li.length*700+500;
    tm.push(setTimeout(flag,t));
    tm.push(setTimeout(function(){running=false;if(vis){running=true;play();}},t+4000));
  }
  onView(c,function(v){vis=v;if(v&&!running){running=true;play();}});
})();
})();
