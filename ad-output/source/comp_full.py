import json, os, glob, sys
from PIL import Image
from multiprocessing import Pool
tl=json.load(open('timeline.json'));L={l['id']:l['start'] for l in tl['lines']};S=[(s['start'],s['end']) for s in tl['scenes']]
R={}
for f in glob.glob('rects_*.json'): R.update({int(k):v for k,v in json.load(open(f)).items()})
M={c:json.load(open(f'K_{c}/meta.json')) for c in ['A','B','N2','HQ']}
# schedule: (t0,t1,clip,mode,offset)
SCH=[(0,L['f1'],'A','fwd',0),(L['f1'],S[0][1],'B','fwd',0),
 (S[1][0],L['n2'],'B','fwd',0.3),(L['n2'],S[1][1],'N2','pp',0),
 (S[2][0],L['n3'],'B','fwd',1.6),(L['n3'],S[2][1],'A','pp',0),
 (S[3][0],L['n4'],'B','fwd',0.8),(L['n4'],S[3][1],'N2','pp',1.0),
 (S[4][0],L['n5'],'B','fwd',2.4),(L['n5'],S[4][1],'HQ','pp',0),
 (S[5][0],L['n6'],'B','fwd',4.0),(L['n6'],S[5][1],'A','pp',1.5),
 (S[6][0],L['n8']-0.25,'HQ','fwd',0),(L['n8']-0.25,S[6][1]+1,'A','pp',0)]
def pick(t):
    for t0,t1,c,mode,off in SCH:
        if t0<=t<t1:
            m=M[c];dur=m['n']/m['fps'];u=t-t0+off
            if mode=='fwd':u=min(u,dur-1e-3)
            else:
                u=u%(2*dur);u=u if u<dur else 2*dur-u
            return c,min(m['n']-1,int(u*m['fps']))
    return None
def work(i):
    t=i/30;bg=Image.open(f'L_bg/f{i:05d}.jpg').convert('RGBA')
    r=R.get(i,[]);best=None
    for x,y,w,h,op in r:
        if op>0.02 and w>20 and 0<=x+w/2<=1080 and (best is None or op*w*h>best[4]*best[2]*best[3]):best=(x,y,w,h,op)
    p=pick(t)
    if best and p:
        c,k=p;m=M[c];x,y,w,h,op=best
        im=Image.open(f'K_{c}/k{k:04d}.png')
        H=0.93*h;s=H/(m['bot']-m['top'])
        im=im.resize((max(1,int(im.width*s)),max(1,int(im.height*s))),Image.BILINEAR)
        px=int(x+w/2-m['cx']*s);py=int(y+0.995*h-m['bot']*s)
        if op<0.999:
            a=im.getchannel('A').point(lambda v:int(v*op));im.putalpha(a)
        layer=Image.new('RGBA',bg.size,(0,0,0,0));layer.paste(im,(px,py),im)
        bg=Image.alpha_composite(bg,layer)
    fg=Image.open(f'L_fg/f{i:05d}.png').convert('RGBA');bg=Image.alpha_composite(bg,fg)
    bg.convert('RGB').save(f'OUT/f{i:05d}.jpg',quality=92)
if __name__=='__main__':
    os.makedirs('OUT',exist_ok=True);N=len(os.listdir('L_bg'))
    ids=range(N) if len(sys.argv)<2 else [int(v) for v in sys.argv[1].split(',')]
    with Pool(4) as p:p.map(work,ids,chunksize=20)
    print('done')
