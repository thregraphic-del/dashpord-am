import json,wave,numpy as np
tl=json.load(open('timeline.json')); fps=30; out={}
for l in tl['lines']:
  if not l['id'].startswith('f'): continue
  w=wave.open(f"trim/{l['id']}.wav"); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768; sr=w.getframerate()
  hop=sr//fps; e=[float(np.sqrt(np.mean(a[i:i+hop]**2))) for i in range(0,len(a),hop)]
  m=max(e); out[l['id']]=[round(min(1,x/m*1.3),2) for x in e]
open('data.js','w').write('window.TL='+json.dumps(tl)+';window.ENV='+json.dumps(out)+';')
