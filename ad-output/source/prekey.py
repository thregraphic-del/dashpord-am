import subprocess, numpy as np, json, os, sys
from PIL import Image
from scipy import ndimage
SC=0.6;X0,X1=120,960
def frames(path):
    w,h=map(int,subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',path]).decode().split(','))
    p=subprocess.Popen(['ffmpeg','-v','error','-i',path,'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
    while True:
        b=p.stdout.read(w*h*3)
        if len(b)<w*h*3:break
        yield np.frombuffer(b,np.uint8).reshape(h,w,3)
def key(f,fix):
    a=f.astype(np.float32)
    if fix: a*=np.array((0.995,0.995,1.045),np.float32)
    a=a.clip(0,255).astype(np.int16);r,g,b=a[...,0],a[...,1],a[...,2]
    dom=g-np.maximum(r,b);alpha=np.clip(1-(dom-25)/55,0,1);m=alpha>0.5
    lab,n=ndimage.label(m)
    if n>1:
        sizes=ndimage.sum(m,lab,range(1,n+1));body=lab==(1+int(np.argmax(sizes)))
        body=ndimage.binary_closing(body,iterations=3);alpha=alpha*ndimage.binary_dilation(body,iterations=2)
    out=a.copy();out[...,1]=np.minimum(g,np.maximum(r,b)+2)
    if fix:
        reg=out[1560:];lum=reg.mean(axis=2,keepdims=True);dark=reg.max(axis=2,keepdims=True)<120
        out[1560:]=np.where(dark,lum*0.9+reg*0.1,reg).astype(np.int16)
    alpha=ndimage.gaussian_filter(alpha,0.7)
    return np.dstack([out.clip(0,255).astype(np.uint8),(alpha*255).astype(np.uint8)])
name,path,fix=sys.argv[1],sys.argv[2],sys.argv[3]=='1'
d=f'K_{name}';os.makedirs(d,exist_ok=True);meta=None;n=0
for i,f in enumerate(frames(path)):
    k=key(f,fix)[:,X0:X1]
    im=Image.fromarray(k);im=im.resize((int(im.width*SC),int(im.height*SC)),Image.LANCZOS)
    if meta is None:
        al=np.array(im)[...,3]>128;ys=np.where(al.any(1))[0];xs=np.where(al.any(0))[0]
        meta={'top':int(ys[0]),'bot':int(ys[-1]),'cx':float((xs[0]+xs[-1])/2)}
    im.save(f'{d}/k{i:04d}.png');n=i+1
fps=float(eval(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=r_frame_rate','-of','csv=p=0',path]).decode().strip()))
meta.update(n=n,fps=fps);json.dump(meta,open(f'{d}/meta.json','w'));print(name,meta)
