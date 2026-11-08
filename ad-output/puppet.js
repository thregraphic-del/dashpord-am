// Rigged vector puppet of "Fahd" — joints: waist, neck, shoulders, elbows, wrists, hips; face rig: brows, eyes, blink, mouth visemes.
(function(){
const NS='http://www.w3.org/2000/svg';
const C={out:'#2a1a14',hair:'#2B1813',hairHi:'#5a3a2a',skin:'#F7C49A',skinSh:'#E8A878',cheek:'#F29C8A',thobe:'#FFFFFF',thobeSh:'#E4E8EF',det:'#C9CFD9',shoe:'#3d3d42',shoeHi:'#5a5a60',sole:'#F4F4F4',mouth:'#6e1f22',tongue:'#E8767A',must:'#1d1412'};
const SW=6;
let uid=0;
function mk(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function g(parent,attrs){return mk('g',attrs||{},parent)}
const P=(d,fill,parent,extra)=>mk('path',Object.assign({d,fill,stroke:C.out,'stroke-width':SW,'stroke-linejoin':'round','stroke-linecap':'round'},extra||{}),parent);

// ---------- hands (drawn pointing DOWN from wrist at 0,0) ----------
function hands(parent){
 const H={};
 // open palm (palm toward viewer, fingers down)
 H.open=g(parent);
 [[-19,40,10,34],[-6,46,10,40],[7,45,10,38],[19,38,9,30]].forEach(f=>mk('rect',{x:f[0]-f[2]/2,y:f[1]-6,width:f[2],height:f[3],rx:f[2]/2,fill:C.skin,stroke:C.out,'stroke-width':5},H.open));
 P('M-24,4 Q-27,30 -18,44 L20,44 Q28,30 24,4 Z',C.skin,H.open,{'stroke-width':5});
 P('M24,12 Q42,18 40,34 Q34,38 22,30',C.skin,H.open,{'stroke-width':5});
 mk('path',{d:'M-14,40 L16,40',stroke:C.skin,'stroke-width':7},H.open);
 // fist
 H.fist=g(parent);
 P('M-23,4 Q-28,26 -20,44 Q0,54 20,44 Q28,26 23,4Z',C.skin,H.fist,{'stroke-width':5});
 [-12,0,12].forEach(x=>mk('path',{d:`M${x},30 L${x},44`,stroke:C.out,'stroke-width':3.5,'stroke-linecap':'round'},H.fist));
 // point (index finger extended)
 H.point=g(parent);
 mk('rect',{x:-7,y:30,width:13,height:48,rx:6.5,fill:C.skin,stroke:C.out,'stroke-width':5},H.point);
 P('M-23,4 Q-28,26 -20,42 Q0,50 20,42 Q28,26 23,4Z',C.skin,H.point,{'stroke-width':5});
 mk('path',{d:'M-7,34 L5,34',stroke:C.skin,'stroke-width':7},H.point);
 // thumb up (thumb extends sideways toward -x, i.e. "up" when forearm is horizontal)
 H.thumb=g(parent);
 P('M-23,4 Q-28,26 -20,44 Q0,54 20,44 Q28,26 23,4Z',C.skin,H.thumb,{'stroke-width':5});
 mk('rect',{x:-58,y:6,width:44,height:15,rx:7.5,fill:C.skin,stroke:C.out,'stroke-width':5},H.thumb);
 mk('path',{d:'M-18,9 L-18,19',stroke:C.skin,'stroke-width':6},H.thumb);
 [-8,4,14].forEach(x=>mk('path',{d:`M${x},30 L${x},44`,stroke:C.out,'stroke-width':3.5,'stroke-linecap':'round'},H.thumb));
 return H;
}

// ---------- props held in a hand group ----------
function props(parent){
 const R={};
 R.phone=g(parent);
 mk('rect',{x:-26,y:10,width:52,height:96,rx:10,fill:'#1B263A',stroke:C.out,'stroke-width':5},R.phone);
 mk('rect',{x:-19,y:18,width:38,height:78,rx:5,fill:'#D6ECEB'},R.phone);
 mk('circle',{cx:0,cy:50,r:12,fill:'#105C6D'},R.phone);mk('path',{d:'M-4,44 L6,50 L-4,56Z',fill:'#fff'},R.phone);
 R.book=g(parent);
 mk('rect',{x:-70,y:6,width:140,height:100,rx:6,fill:'#105C6D',stroke:C.out,'stroke-width':5},R.book);
 mk('rect',{x:-62,y:12,width:124,height:88,rx:4,fill:'#fff',stroke:C.out,'stroke-width':3},R.book);
 mk('path',{d:'M0,12 V100',stroke:C.out,'stroke-width':4},R.book);
 [30,46,62,78].forEach(y=>{mk('path',{d:`M-52,${y} H-10 M10,${y} H52`,stroke:'#c9c4ba','stroke-width':5,'stroke-linecap':'round'},R.book)});
 R.paper=g(parent);
 mk('rect',{x:-48,y:10,width:96,height:124,rx:6,fill:'#fff',stroke:C.out,'stroke-width':5},R.paper);
 [34,52,70,88].forEach(y=>mk('path',{d:`M-32,${y} H32`,stroke:'#c9c4ba','stroke-width':5,'stroke-linecap':'round'},R.paper));
 mk('path',{d:'M-30,104 L30,120 M-26,124 L28,100',stroke:'#D9534F','stroke-width':6,'stroke-linecap':'round'},R.paper);
 return R;
}

// ---------- arm (pivot at shoulder 0,0; hangs down) ----------
function arm(parent,mirror){
 const root=g(parent);const A={root,mirror};
 A.sh=g(root);
 P('M-26,-10 Q-30,60 -24,128 L24,128 Q28,60 26,-10 Q0,-24 -26,-10Z',C.thobe,A.sh);
 mk('path',{d:'M14,10 Q18,60 14,118',stroke:C.thobeSh,'stroke-width':8,fill:'none','stroke-linecap':'round'},A.sh);
 A.el=g(A.sh,{transform:'translate(0,122)'});
 A.wr=g(A.el,{transform:'translate(0,118)'});
 A.hand=g(A.wr);A.H=hands(A.hand);A.R=props(A.wr);
 P('M-24,-4 Q-26,60 -21,112 L21,112 Q26,60 24,-4Z',C.thobe,A.el);
 mk('path',{d:'M12,8 Q15,56 12,102',stroke:C.thobeSh,'stroke-width':7,fill:'none','stroke-linecap':'round'},A.el);
 P('M-23,100 L23,100 L23,122 L-23,122Z',C.thobe,A.el,{'stroke-width':5}); // cuff
 mk('circle',{cx:0,cy:111,r:3.5,fill:C.det},A.el);
 A.el.appendChild(A.wr); // wrist above forearm
 return A;
}

// ---------- shoe (front view, ankle at 0,0) ----------
function shoe(parent){const s=g(parent);
 P('M-30,-6 L30,-6 L34,58 Q36,78 18,80 L-18,80 Q-36,78 -34,58Z',C.shoe,s);
 mk('rect',{x:-38,y:66,width:76,height:20,rx:9,fill:C.sole,stroke:C.out,'stroke-width':SW},s);
 mk('ellipse',{cx:0,cy:66,rx:24,ry:11,fill:C.sole,stroke:C.out,'stroke-width':4},s);
 [8,22,36].forEach(y=>mk('path',{d:`M-12,${y} L12,${y+6} M12,${y} L-12,${y+6}`,stroke:'#fff','stroke-width':3.5,'stroke-linecap':'round'},s));
 mk('circle',{cx:-24,cy:16,r:7,fill:'#fff',stroke:C.out,'stroke-width':3},s);
 return s}

class Fahd{
 constructor(parent,opts={}){
  this.id=++uid;this.seed=(opts.seed||this.id)*1.37;
  this.svg=mk('svg',{viewBox:'0 0 400 1000',width:'100%',style:'overflow:visible;display:block'},parent);
  const defs=mk('defs',{},this.svg);
  this.clipId='mc'+this.id;this.clip=mk('clipPath',{id:this.clipId},defs);this.clipPath=mk('path',{d:''},this.clip);
  const s=this.s={lean:0,bodyY:0,bodyX:0,squash:0,head:0,headX:0,headY:0,shA:6,elA:-6,wrA:0,shB:6,elB:-6,wrB:0,legA:2,legB:2,liftA:0,liftB:0,sit:0,
   brow:0,browAng:0,eye:1,happy:0,winkA:0,winkB:0,px:0,py:0,mouthO:0,smile:.7,round:0,talk:0,gaze:0,blush:.35};
  this.hA='open';this.hB='open';this.pA='none';this.pB='none';this.laptop=0;
  const root=this.root=g(this.svg);
  this.body=g(root);
  // ---- standing legs
  this.legs=g(this.body);
  this.legA=g(this.legs);this.legB=g(this.legs);
  [this.legA,this.legB].forEach(L=>{mk('rect',{x:-16,y:0,width:32,height:340,rx:16,fill:C.thobe,stroke:C.out,'stroke-width':SW},L);L.shoe=shoe(g(L,{transform:'translate(0,342)'}))});
  this.skirt=P('',C.thobe,this.body);this.skirtFold=mk('path',{d:'',stroke:C.thobeSh,'stroke-width':10,fill:'none','stroke-linecap':'round'},this.body);
  this.skirtFold2=mk('path',{d:'',stroke:C.thobeSh,'stroke-width':8,fill:'none','stroke-linecap':'round'},this.body);
  // ---- seated lap
  this.lap=g(this.body,{opacity:0});
  P('M60,885 Q50,812 140,790 L260,790 Q350,812 340,885 Q300,935 200,925 Q100,935 60,885Z',C.thobe,this.lap);
  mk('path',{d:'M110,850 Q200,890 290,850',stroke:C.thobeSh,'stroke-width':10,fill:'none','stroke-linecap':'round'},this.lap);
  const sa=g(this.lap,{transform:'translate(92,862) rotate(-70) scale(.9)'});shoe(sa);const sb=g(this.lap,{transform:'translate(308,862) rotate(70) scale(.9)'});shoe(sb);
  // ---- torso (pivot at waist 200,560)
  this.torso=g(this.body);
  this.armBackA=g(this.torso);this.armBackB=g(this.torso);
  P('M124,314 Q120,440 138,575 L262,575 Q280,440 276,314 Q240,292 200,292 Q160,292 124,314Z',C.thobe,this.torso);
  mk('path',{d:'M150,330 Q140,450 150,560',stroke:C.thobeSh,'stroke-width':10,fill:'none','stroke-linecap':'round'},this.torso);
  P('M200,306 L200,420',null,this.torso,{fill:'none','stroke-width':4,stroke:C.det});
  P('M188,300 L212,300 L212,420 Q200,428 188,420Z',C.thobe,this.torso,{'stroke-width':4,stroke:C.det});
  [330,362,394].forEach(y=>mk('circle',{cx:200,cy:y,r:5,fill:C.thobe,stroke:C.det,'stroke-width':3},this.torso));
  P('M222,352 L258,352 L258,398 Q240,404 222,398Z',C.thobe,this.torso,{'stroke-width':4,stroke:C.det});
  // neck + head
  mk('rect',{x:182,y:262,width:36,height:40,fill:C.skin,stroke:C.out,'stroke-width':SW},this.torso);
  this.headG=g(this.torso);this.buildHead(this.headG);
  P('M166,288 Q200,300 234,288 L236,312 Q200,322 164,312Z',C.thobe,this.torso,{'stroke-width':5}); // collar band (over neck)
  mk('circle',{cx:200,cy:306,r:4,fill:C.det},this.torso);
  // arms (front)
  this.A=arm(this.torso,false);this.B=arm(this.torso,true);
  this.body.appendChild(this.lap);
  // laptop (front of lap)
  this.lapTop=g(this.body,{opacity:0});
  mk('path',{d:'M110,770 L290,770 L310,800 L90,800Z',fill:'#9aa3ad',stroke:C.out,'stroke-width':SW,'stroke-linejoin':'round'},this.lapTop);
  mk('path',{d:'M126,640 L274,640 L290,772 L110,772Z',fill:'#b8c0c8',stroke:C.out,'stroke-width':SW,'stroke-linejoin':'round'},this.lapTop);
  mk('circle',{cx:200,cy:705,r:12,fill:'#e8ecef'},this.lapTop);
 }
 buildHead(par){
  const h=this.head=g(par);
  // hair back mass (union of circles: outline layer then fill layer)
  const curls=[[-58,-186,30],[-26,-214,34],[14,-224,37],[52,-208,32],[76,-178,24],[-76,-156,22],[80,-148,15],[-6,-192,30],[34,-188,28],[-79,-128,12],[81,-126,10]];
  const ol=g(h),fl=g(h);
  curls.forEach(c=>{mk('circle',{cx:c[0],cy:c[1],r:c[2]+SW/2,fill:C.out},ol);mk('circle',{cx:c[0],cy:c[1],r:c[2]-SW/2,fill:C.hair},fl)});
  // ears
  [-1,1].forEach(sx=>{const e=g(h,{transform:`translate(${sx*76},-104)`});mk('ellipse',{cx:0,cy:0,rx:16,ry:24,fill:C.skin,stroke:C.out,'stroke-width':SW},e);mk('path',{d:`M${sx*-4},-10 Q${sx*6},0 ${sx*-2},12`,stroke:C.skinSh,'stroke-width':4,fill:'none','stroke-linecap':'round'},e)});
  // face
  P('M-74,-150 C-80,-70 -52,-8 0,-4 C52,-8 80,-70 74,-150 C66,-196 -66,-196 -74,-150Z',C.skin,h);
  this.cheeks=[-1,1].map(sx=>mk('ellipse',{cx:sx*48,cy:-62,rx:16,ry:9,fill:C.cheek,opacity:.35},h));
  // fringe curls over forehead
  const fr=[[-50,-170,20],[-18,-182,22],[18,-184,22],[50,-174,20],[68,-156,13],[-68,-150,13]];
  const ol2=g(h),fl2=g(h);
  fr.forEach(c=>{mk('circle',{cx:c[0],cy:c[1],r:c[2]+SW/2,fill:C.out},ol2);mk('circle',{cx:c[0],cy:c[1],r:c[2]-SW/2,fill:C.hair},fl2)});
  [[-40,-204],[4,-222],[42,-204],[-64,-176],[20,-192]].forEach(p=>mk('path',{d:`M${p[0]-12},${p[1]+8} q12,-18 28,-6`,stroke:C.hairHi,'stroke-width':5,fill:'none','stroke-linecap':'round'},h));
  // sideburns
  [-1,1].forEach(sx=>P(`M${sx*70},-140 L${sx*74},-112 L${sx*64},-112 Z`,C.hair,h,{'stroke-width':4}));
  // eyes
  this.eyes=[-1,1].map(sx=>{const e=g(h,{transform:`translate(${sx*30},-102)`});
   const open=g(e);mk('ellipse',{cx:0,cy:0,rx:15,ry:19,fill:'#fff',stroke:C.out,'stroke-width':5},open);
   const pu=g(open);mk('circle',{cx:0,cy:2,r:9.5,fill:C.out},pu);mk('circle',{cx:3,cy:-2,r:3.2,fill:'#fff'},pu);
   const happy=mk('path',{d:'M-15,6 Q0,-14 15,6',stroke:C.out,'stroke-width':6,fill:'none','stroke-linecap':'round'},e);
   const lid=mk('path',{d:'M-15,0 L15,0',stroke:C.out,'stroke-width':6,'stroke-linecap':'round'},e);
   return {e,open,pu,happy,lid,sx}});
  // brows
  this.brows=[-1,1].map(sx=>{const b=g(h);mk('path',{d:`M${-20},4 Q0,-8 20,2`,stroke:C.hair,'stroke-width':11,fill:'none','stroke-linecap':'round'},b);return {b,sx}});
  // nose
  mk('path',{d:'M-4,-90 Q-12,-70 -2,-66 Q4,-64 8,-68',stroke:C.skinSh,'stroke-width':5,fill:'none','stroke-linecap':'round'},h);
  // mouth
  this.mouthG=g(h,{transform:'translate(0,-40)'});
  this.mouthFill=mk('path',{d:'',fill:C.mouth,stroke:C.out,'stroke-width':5,'stroke-linejoin':'round'},this.mouthG);
  const inner=g(this.mouthG,{'clip-path':`url(#${this.clipId})`});
  this.teeth=mk('rect',{x:-40,y:-30,width:80,height:0,fill:'#fff'},inner);
  this.tongue=mk('ellipse',{cx:0,cy:0,rx:18,ry:10,fill:C.tongue},inner);
  this.mouthLine=mk('path',{d:'',stroke:C.out,'stroke-width':5,fill:'none','stroke-linecap':'round'},this.mouthG);
  this.mouthOut=mk('path',{d:'',stroke:C.out,'stroke-width':5,fill:'none','stroke-linejoin':'round'},this.mouthG);
  // mustache (handlebar)
  this.must=g(h,{transform:'translate(0,-56)'});
  P('M0,-6 C-18,-12 -40,-8 -52,4 C-60,12 -66,4 -64,-6 C-70,6 -64,22 -48,16 C-30,10 -14,10 0,6 C14,10 30,10 48,16 C64,22 70,6 64,-6 C66,4 60,12 52,4 C40,-8 18,-12 0,-6Z',C.must,this.must,{'stroke-width':4});
 }
 setHand(side,name){this[side=='A'?'hA':'hB']=name}
 setProp(side,name){this[side=='A'?'pA':'pB']=name}
 render(t,talkEnv){
  const s=this.s;
  // idle life
  const br=Math.sin(t*2.4+this.seed)*1;
  const env=talkEnv||0;
  // root/body
  this.body.setAttribute('transform',`translate(${s.bodyX},${s.bodyY+br*1.5}) translate(200,1000) scale(${1+s.squash*.06},${1-s.squash*.06}) translate(-200,-1000)`);
  const sit=s.sit>.5;
  this.legs.style.display=sit?'none':'';this.skirt.style.display=sit?'none':'';this.skirtFold.style.display=sit?'none':'';this.skirtFold2.style.display=sit?'none':'';
  this.lap.setAttribute('opacity',sit?1:0);this.lapTop.setAttribute('opacity',sit&&this.laptop?1:0);
  // legs
  const legT=(L,x,ang,lift,m)=>{L.setAttribute('transform',`translate(${x},${575-lift}) rotate(${m*ang})`)};
  legT(this.legA,174,s.legA,s.liftA,1);legT(this.legB,226,s.legB,s.liftB,-1);
  const foot=(x,ang,lift,m)=>{const r=m*ang*Math.PI/180;return [x-Math.sin(r)*340,575-lift+Math.cos(r)*340]};
  const fa=foot(174,s.legA,s.liftA,1),fb=foot(226,s.legB,s.liftB,-1);
  const hy=Math.max(fa[1],fb[1])-6+Math.sin(t*3+this.seed)*2;const swing=Math.sin(t*2+this.seed)*3+s.lean*.6;
  const L0=Math.min(fa[0],fb[0])-34,R0=Math.max(fa[0],fb[0])+34;
  this.skirt.setAttribute('d',`M134,560 L266,560 Q${R0+6},${(560+hy)/2+40} ${R0+swing},${hy} Q${(L0+R0)/2+swing},${hy+16} ${L0+swing},${hy} Q${L0-6},${(560+hy)/2+40} 134,560Z`);
  this.skirtFold.setAttribute('d',`M180,600 Q${(L0+200)/2},${(600+hy)/2} ${L0+40+swing},${hy-14}`);
  this.skirtFold2.setAttribute('d',`M238,620 Q${(R0+240)/2},${(620+hy)/2} ${R0-50+swing},${hy-10}`);
  // torso
  const sitY=sit?300:0;
  this.torso.setAttribute('transform',`translate(0,${sitY}) rotate(${s.lean+br*.4},200,575) translate(200,575) scale(1,${1+br*.006}) translate(-200,-575)`);
  // head
  const nod=env*6*Math.sin(t*11+this.seed);
  this.head.setAttribute('transform',`translate(${200+s.headX},${290+s.headY+env*-3}) rotate(${s.head+nod*.6+Math.sin(t*1.3+this.seed)*1.2}) scale(1.14)`);
  // arms
  const setArm=(A,x,sh,el,wr,hand,prop,m)=>{
   A.root.setAttribute('transform',`translate(${x},322) scale(${m},1)`);
   A.sh.setAttribute('transform',`rotate(${sh+br*.8})`);A.el.setAttribute('transform',`translate(0,122) rotate(${el})`);
   A.wr.setAttribute('transform',`translate(0,118) rotate(${wr})`);
   for(const k in A.H)A.H[k].style.display=k==hand?'':'none';
   for(const k in A.R)A.R[k].style.display=k==prop?'':'none'};
  setArm(this.A,136,s.shA,s.elA,s.wrA,this.hA,this.pA,1);setArm(this.B,264,s.shB,s.elB,s.wrB,this.hB,this.pB,-1);
  // face
  const blinkPh=((t+this.seed*2.1)%3.4);const blink=blinkPh<.13?Math.sin(blinkPh/.13*Math.PI):0;
  this.eyes.forEach((E,i)=>{const wink=i==0?s.winkA:s.winkB;const happy=s.happy>.5;
   const open=Math.max(0,s.eye*(1-blink)*(1-wink));
   E.open.style.display=(happy||open<.15)?'none':'';E.happy.style.display=happy?'':'none';E.lid.style.display=(!happy&&open<.15)?'':'none';
   E.open.setAttribute('transform',`scale(${1+(s.eye-1)*.3},${open})`);
   E.pu.setAttribute('transform',`translate(${s.px*6},${s.py*6}) scale(${s.eye>1.15?.75:1})`)});
  this.brows.forEach(B=>{const x=B.sx*30,y=-134-s.brow*10-(s.eye>1.15?8:0);B.b.setAttribute('transform',`translate(${x},${y}) rotate(${B.sx*s.browAng*14})`)});
  this.cheeks.forEach(c=>c.setAttribute('opacity',s.blush+(s.happy>.5?.25:0)));
  // mouth
  let o=Math.min(1.1,s.mouthO+env*.85),sm=s.smile,r=Math.min(1,s.round+env*.35*(.5+.5*Math.sin(t*17+this.seed)));
  const w=30*(1-.45*r)*(1+Math.max(0,sm)*.15);const cy=-sm*9;
  if(o<.06){this.mouthFill.style.display='none';this.mouthOut.style.display='none';this.teeth.style.display='none';this.tongue.style.display='none';this.mouthLine.style.display='';
   this.mouthLine.setAttribute('d',`M${-w},${cy} Q0,${cy+16*sm+2} ${w},${cy}`)}
  else{this.mouthLine.style.display='none';this.mouthFill.style.display='';this.mouthOut.style.display='';this.teeth.style.display='';this.tongue.style.display='';
   const top=cy-2+(sm>0?4:0)-o*4*r, bot=cy+8+o*46+Math.max(0,sm)*10;
   const d=`M${-w},${cy} Q0,${top} ${w},${cy} Q${w*.9},${bot} 0,${bot} Q${-w*.9},${bot} ${-w},${cy}Z`;
   this.mouthFill.setAttribute('d',d);this.mouthOut.setAttribute('d',d);this.clipPath.setAttribute('d',d);

   this.teeth.setAttribute('y',top-4);this.teeth.setAttribute('height',Math.max(0,8+o*4));
   this.tongue.setAttribute('cy',bot-4);this.tongue.setAttribute('rx',w*.6);}
  this.must.setAttribute('transform',`translate(0,${-56-Math.max(0,sm)*3-o*3}) scale(${1+Math.max(0,sm)*.04},1)`);
 }
}
// ---------- pose library ----------
Fahd.POSES={
 idle:{lean:0,head:0,shA:6,elA:-6,wrA:0,shB:6,elB:-6,wrB:0,legA:2,legB:2,liftA:0,liftB:0,bodyY:0,squash:0},
 wave:{shB:150,elB:20,wrB:0,shA:8,elA:-30,head:6,lean:2},
 hipsHands:{shA:32,elA:-62,wrA:0,shB:32,elB:-62,wrB:0},
 armsCrossed:{shA:-8,elA:-118,wrA:-10,shB:-14,elB:-108,wrB:-10},
 think:{shA:-6,elA:-80,wrA:20,shB:-30,elB:-140,wrB:-10,head:-8},
 shrug:{shA:42,elA:-95,wrA:40,shB:42,elB:-95,wrB:40,head:-6},
 cheer:{shA:150,elA:-30,shB:150,elB:-30,head:0},
 facepalm:{shB:-25,elB:-150,wrB:-20,shA:10,elA:-10,head:-10,lean:-3},
 shockHands:{shA:150,elA:-20,wrA:0,shB:150,elB:-20,wrB:0},
 holdPhone:{shB:-4,elB:-125,wrB:170,shA:6,elA:-8},
 holdBook:{shA:-10,elA:-95,wrA:0,shB:-10,elB:-95,wrB:0},
 present:{shB:70,elB:-20,wrB:-30,shA:24,elA:-110},
 pointUp:{shB:20,elB:-150,wrB:180},
 thumbsUp:{shB:30,elB:-110,wrB:180},
 holdHead:{shA:150,elA:120,wrA:0,shB:150,elB:120,wrB:0,head:0},
 reach:{shA:100,elA:-10,wrA:0,shB:40,elB:-20,lean:-8},
 hug:{shA:-20,elA:-125,wrA:0,shB:-20,elB:-125,wrB:0},
 sitType:{shA:-8,elA:-70,wrA:-10,shB:-8,elB:-70,wrB:-10},
};
window.Fahd=Fahd;
})();
