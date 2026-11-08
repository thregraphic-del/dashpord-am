import json,wave,numpy as np
SR=48000;rng=np.random.default_rng(7)
tl=json.load(open('a30/tl30.json'));T=tl['total'];N=int(T*SR)+SR
def rd(p):
  w=wave.open(p);a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768;return a
def env(n,a=.005,d=None):
  t=np.arange(n)/SR;e=np.minimum(1,t/a);return e if d is None else e*np.exp(-t/d)
def lp(x,k):
  if k<=1:return x
  c=np.cumsum(np.insert(x,0,0));y=(c[k:]-c[:-k])/k;return np.pad(y,(0,len(x)-len(y)))
def tone(f,dur,d=.2,h=(1,)):
  n=int(dur*SR);t=np.arange(n)/SR;f=np.broadcast_to(f,(n,)) if np.ndim(f) else np.full(n,f)
  ph=2*np.pi*np.cumsum(f)/SR;y=sum(np.sin(ph*(i+1))*a for i,a in enumerate(h));return y*env(n,.003,d)
def noise(dur):return rng.standard_normal(int(dur*SR))
def sw(dur=.5):
  n=int(dur*SR);x=noise(dur);out=np.zeros(n)
  for i in range(0,n,2400):
    k=int(2+30*(1-np.sin(np.pi*i/n)));out[i:i+2400]=lp(x[i:i+2400+k],k)[:len(out[i:i+2400])]
  return out*np.sin(np.pi*np.arange(n)/n)**2*1.8
S={
 'whoosh':sw(.55)*.8,'swoosh':sw(.35)*.6,
 'pop':tone(np.linspace(500,1300,int(.09*SR)),.09,.04,(1,.3))*.6,
 'tap':tone(1800,.03,.008)*.5,'click':(tone(2400,.025,.006)+lp(noise(.025),2)*.3)*.5,'tick':tone(1500,.02,.005)*.35,
 'thud':(tone(np.linspace(140,60,int(.25*SR)),.25,.09)+lp(noise(.25),30)*env(int(.25*SR),.002,.03)*.6)*.8,
 'ding':tone(1320,.9,.28,(1,.25,.1))*.45+tone(1980,.9,.2)*.15,
 'zip':lp(noise(.18),3)*env(int(.18*SR),.01,.06)*.4,
 'wind':lp(noise(1.6),60)*np.sin(np.pi*np.arange(int(1.6*SR))/(1.6*SR))*3,
 'poof':lp(noise(.45),25)*env(int(.45*SR),.01,.12)*1.4,
}
S['stamp']=(tone(np.linspace(110,50,int(.35*SR)),.35,.12)*1.2+lp(noise(.35),6)*env(int(.35*SR),.001,.04))*.9
cr=np.zeros(int(.6*SR));idx=rng.integers(0,len(cr),260);cr[idx]=rng.standard_normal(260);S['crumple']=lp(cr,3)*6*np.hanning(len(cr))
sh=np.zeros(int(.5*SR))
for i in range(5):
  c=S['click'];o=int(i*.09*SR);sh[o:o+len(c)]+=c*.6
S['shuffle']=sh
w=np.zeros(int(1.2*SR))
for i,f in enumerate([523,659,784,1047]):
  c=tone(f,.6,.2,(1,.3));o=int(i*.1*SR);w[o:o+len(c)]+=c*.4
S['win']=w;S['hit']=np.pad(S['thud'],(0,len(S['ding'])-len(S['thud'])))+S['ding']*.8
sp=np.zeros(int(1*SR))
for i in range(8):
  c=tone(2000+rng.random()*2500,.3,.08)*.18;o=int(rng.random()*.6*SR);sp[o:o+len(c)]+=c
S['sparkle']=sp
fx=np.zeros(N)
for e in json.load(open('a30/sfx30.json')):
  c=S[e['type']]*e['vol'];o=int(e['t']*SR)
  if o<0:continue
  fx[o:o+len(c)]+=c[:max(0,N-o)]
vo=np.zeros(N)
for l in tl['lines']:
  a=rd(f"a30/{l['file']}");o=int(l['start']*SR);vo[o:o+len(a)]+=a*(1.0 if l['id'][0]=='n' else 1.05)
# music
bpm=112;beat=60/bpm;mus=np.zeros(N)
prog=[(261.63,[0,4,7]),(196.0,[0,4,7]),(220.0,[0,3,7]),(174.61,[0,4,7])]
def mar(f,d=.25):return tone(f,.5,d,(1,.0,.25,0,.08))
kick=tone(np.linspace(120,45,int(.18*SR)),.18,.07)
hat=lp(noise(.05),1)*env(int(.05*SR),.001,.012)-lp(lp(noise(.05),1),4)*0
nb=int(T/beat)+4
for b in range(nb):
  bar=(b//4)%4;root,iv=prog[bar];t0=int(b*beat*SR)
  if t0>=N:break
  def add(x,o,g):
    o=int(o);mus[o:o+len(x)]+=x[:max(0,N-o)]*g
  if b%2==0:add(kick,t0,.55)
  add(hat,t0+beat/2*SR,.12)
  if b%4==0:add(tone(root/2,beat*3.5,.9,(1,.4)),t0,.35)
  for e in range(2):
    k=(b*2+e)%6;n=[0,1,2,1,2,1][k];f=root*2**(iv[n]/12)*(2 if k in(2,4) else 1)
    add(mar(f),t0+e*beat/2*SR,.22)
# ducking
ve=lp(np.abs(vo),int(.15*SR));ve=np.minimum(1,ve/ (ve.max()*.25))
ve=lp(ve,int(.3*SR))
gain=.5-.32*ve
tt=np.arange(N)/SR
fade=np.clip((T-tt)/1.8,0,1)*np.clip(tt/0.6,0,1);mus*=gain*fade*.55
mix=vo+fx*.55+mus
mix=mix[:int(T*SR)]
mix=np.tanh(mix*1.1)/np.tanh(1.1);mix*=.92/np.abs(mix).max()
wv=wave.open('mix30.wav','w');wv.setnchannels(1);wv.setsampwidth(2);wv.setframerate(SR);wv.writeframes((mix*32767).astype(np.int16).tobytes());wv.close()
print('ok',len(mix)/SR)
