import json, os
from PIL import Image
from multiprocessing import Pool
M={c:json.load(open(f'K_{c}/meta.json')) for c in ['A','B','N2']}
# (t0,t1,clip,clipT0,rate,cx,feet,h,fade)
SEG=[(0.0,5.0,'B',-0.25,1.0,370,1490,1120,0),
     (5.0,12.1,'N2',0,0.72,180,1470,760,0.3),
     (12.1,19.3,'A',0,0.70,180,1470,760,0.3),
     (24.05,30.1,'A',0,0.90,860,1500,650,0.35)]
def work(i):
    t=i/30;bg=Image.open(f'M_bg/f{i:05d}.jpg').convert('RGBA')
    for t0,t1,c,ct0,rate,cx,feet,h,fade in SEG:
        if t0<=t<t1:
            m=M[c];dur=m['n']/m['fps'];u=min(max(0,ct0+(t-t0)*rate),dur-1e-3);k=int(u*m['fps'])
            im=Image.open(f'K_{c}/k{k:04d}.png');s=h/(m['bot']-m['top'])
            im=im.resize((int(im.width*s),int(im.height*s)),Image.LANCZOS)
            op=min(1,(t-t0)/fade) if fade else 1
            if op<1: im.putalpha(im.getchannel('A').point(lambda v:int(v*op)))
            px=int(cx-m['cx']*s);py=int(feet-m['bot']*s)
            layer=Image.new('RGBA',bg.size,(0,0,0,0));layer.paste(im,(px,py),im);bg=Image.alpha_composite(bg,layer)
    bg=Image.alpha_composite(bg,Image.open(f'M_fg/f{i:05d}.png').convert('RGBA'))
    bg.convert('RGB').save(f'OUT30/f{i:05d}.jpg',quality=92)
if __name__=='__main__':
    os.makedirs('OUT30',exist_ok=True)
    with Pool(4) as p:p.map(work,range(900),chunksize=20)
