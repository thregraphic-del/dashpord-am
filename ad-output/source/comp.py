import subprocess, numpy as np, json
from PIL import Image
from scipy import ndimage
def frames(path,w,h):
    p=subprocess.Popen(['ffmpeg','-v','error','-i',path,'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
    out=[]
    while True:
        b=p.stdout.read(w*h*3)
        if len(b)<w*h*3:break
        out.append(np.frombuffer(b,np.uint8).reshape(h,w,3))
    return out
def key(f,gain=(1,1,1)):
    a=(f.astype(np.float32)*np.array(gain,np.float32)).clip(0,255).astype(np.int16);r,g,b=a[...,0],a[...,1],a[...,2]
    dom=g-np.maximum(r,b)
    alpha=np.clip(1-(dom-25)/55,0,1)               # strong green -> 0
    m=alpha>0.5
    lab,n=ndimage.label(m)
    if n>1:
        sizes=ndimage.sum(m,lab,range(1,n+1));keep=1+int(np.argmax(sizes))
        body=lab==keep
        body=ndimage.binary_closing(body,iterations=3)
        alpha=alpha*ndimage.binary_dilation(body,iterations=2)
    out=a.copy();mx=np.maximum(r,b);out[...,1]=np.minimum(g,mx+2)  # despill
    if gain!=(1,1,1):
        reg=out[1560:]; lum=reg.mean(axis=2,keepdims=True); dark=(reg.max(axis=2,keepdims=True)<120)
        out[1560:]=np.where(dark,(lum*0.9+reg*0.1),reg).astype(np.int16)
    alpha=ndimage.gaussian_filter(alpha,0.7)
    return np.dstack([np.clip(out,0,255).astype(np.uint8),(alpha*255).astype(np.uint8)])
A=frames('clips/A_intro.mp4',1080,1916);B=frames('clips/B_talk.mp4',1088,1920)
print(len(A),len(B))
tl=json.load(open('timeline.json'));f1=[l for l in tl['lines'] if l['id']=='f1'][0]['start'];END=tl['scenes'][0]['end']
S=0.80;cacheA={};cacheB={}
import os;os.makedirs('fr_s1c',exist_ok=True)
def ease(x):x=min(1,max(0,x));return x*x*(3-2*x)
N=len(os.listdir('fr_s1'))
for i in range(N):
    t=i/30;bg=Image.open(f'fr_s1/f{i:05d}.jpg').convert('RGBA')
    if t<f1:
        k=min(len(A)-1,int(t*24))
        if k not in cacheA: cacheA[k]=Image.fromarray(key(A[k])).resize((int(1080*S),int(1916*S)),Image.LANCZOS)
        im=cacheA[k];x=(1080-im.width)//2;y=1460-int(1716*S)
    else:
        k=min(len(B)-1,int((t-f1)*25))
        if k not in cacheB: cacheB[k]=Image.fromarray(key(B[k],(0.995,0.995,1.045))).resize((int(1088*S),int(1920*S)),Image.LANCZOS)
        im=cacheB[k];x0=(1080-im.width)//2;x=int(x0+(-235-x0)*ease((t-f1)/0.45));y=1460-int(1716*S)
    bg.alpha_composite(im,(x,y))
    bg.convert('RGB').save(f'fr_s1c/f{i:05d}.jpg',quality=92)
print('done',N)
