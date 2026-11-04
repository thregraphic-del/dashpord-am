// Vector-illustration fitness figure (2D, no 3D): a woman in a sports bra and leggings,
// animated on a biomechanical skeleton with realistic joint limits and tempo.
const D2R = Math.PI / 180, LR = ['L', 'R'];
const LIM = {k:[0, 150], e:[0, 150], hf:[-35, 140], sf:[-60, 200]};
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
function normPose(p) {
  const n = {rx:p.rx||0, ry:p.ry||0, rz:p.rz||0, sp:p.sp||0, st:p.st||0, ss:p.ss||0, nk:p.nk||0, shrL:p.shrL??p.shr??0, shrR:p.shrR??p.shr??0, jy:p.jy||0};
  for (const S of LR) {
    const g = (k, d = 0) => p[k + S] !== undefined ? p[k + S] : (p[k] !== undefined ? p[k] : d);
    n['sf'+S] = clamp(g('sf'), ...LIM.sf); n['sa'+S] = g('sa', 8); n['e'+S] = clamp(g('e', 6), ...LIM.e); n['w'+S] = g('w');
    n['hf'+S] = clamp(g('hf'), ...LIM.hf); n['ha'+S] = g('ha'); n['k'+S] = clamp(g('k', 2), ...LIM.k);
    let a = g('a', undefined);
    const fl = p['flat'+S] !== undefined ? p['flat'+S] : (p.flat !== undefined ? p.flat : (Math.abs(n.rx) < 35 && Math.abs(n.rz) < 35));
    if (a === undefined) a = fl ? n['hf'+S] - n['k'+S] - n.rx : 0;
    n['a'+S] = a;
  }
  return n;
}
function lerpPose(a, b, u) { const o = {}; for (const k in a) o[k] = a[k] + (b[k] - a[k]) * u; return o; }
function compileAnim(ex, fault) {
  const def = P[ex.pat](ex.po || {});
  let raw = def.f.map(x => ({...x})), ft = null;
  if (fault) {
    ft = def.fault || {t:'مدى حركة ناقص (نصف التكرار)', rom:.5};
    const idx = ft.i || raw.map((_, i) => i).filter(i => i > 0);
    if (ft.m) idx.forEach(i => { raw[i] = {...raw[i], ...ft.m}; });
  }
  let frames = raw.map(normPose);
  if (ft && ft.rom) frames = frames.map((f, i) => i === 0 ? f : lerpPose(frames[0], f, ft.rom));
  return {ex, frames, dur:def.dur || 3, view:def.view || 'side', hold:!!def.hold, anchor:def.anchor || null, sup:def.sup || [], props:def.props || null, track:def.track || 'handL', faultText:ft ? ft.t : (def.fault ? def.fault.t : 'مدى حركة ناقص')};
}
const ease = u => { u = clamp((u - .07) / .86, 0, 1); return u * u * u * (u * (u * 6 - 15) + 10); };
function poseAt(A, t) {
  const n = A.frames.length; if (n === 1) return A.frames[0];
  const x = ((t % 1) + 1) % 1 * n, i = Math.floor(x);
  return lerpPose(A.frames[i], A.frames[(i + 1) % n], ease(x - i));
}
function phaseAt(A, t) {
  if (A.hold) return {name:'ثبات', act:.7};
  const n = A.frames.length, x = ((t % 1) + 1) % 1 * n, i = Math.floor(x), u = x - i;
  if (n === 2) {
    if (i === 0) return {name: u < .1 ? 'وضع البداية' : u > .9 ? 'وضع النهاية' : 'مرحلة الحركة', act:ease(u)};
    return {name: u > .9 ? 'وضع البداية' : 'مرحلة العودة', act:1 - ease(u)};
  }
  return {name:'الحركة ' + (i + 1) + ' من ' + n, act:.55 + .35 * Math.sin(u * Math.PI)};
}
// ---------- math ----------
function rotXYZ(x, y, z) { const a = Math.cos(x), b = Math.sin(x), c = Math.cos(y), d = Math.sin(y), e = Math.cos(z), f = Math.sin(z); return [c*e, -c*f, d, a*f + b*e*d, a*e - b*f*d, -b*c, b*f - a*e*d, b*e + a*f*d, a*c]; }
const mm = (A, B) => { const o = new Array(9); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r*3+c] = A[r*3]*B[c] + A[r*3+1]*B[3+c] + A[r*3+2]*B[6+c]; return o; };
const mv = (A, v) => [A[0]*v[0] + A[1]*v[1] + A[2]*v[2], A[3]*v[0] + A[4]*v[1] + A[5]*v[2], A[6]*v[0] + A[7]*v[1] + A[8]*v[2]];
const add = (a, b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
const lerp3 = (a, b, t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
const SHW = .18;
const MARKERS = {
  footL:['anL',[0,-.065,.15]], footR:['anR',[0,-.065,.15]], heelL:['anL',[0,-.065,-.055]], heelR:['anR',[0,-.065,-.055]],
  kneeL:['knL',[0,0,.055]], kneeR:['knR',[0,0,.055]], handL:['wrL',[0,-.085,0]], handR:['wrR',[0,-.085,0]], elbowL:['elL',[0,0,-.035]], elbowR:['elR',[0,0,-.035]],
  sideL:['spine',[.2,.4,0]], sideR:['spine',[-.2,.4,0]], hipL:['root',[.165,-.02,0]], hipR:['root',[-.165,-.02,0]],
  head:['head',[0,.12,0]], headB:['head',[0,.02,-.1]], backU:['spine',[0,.4,-.11]], backL:['spine',[0,.15,-.1]], chest:['spine',[0,.37,.13]], belly:['spine',[0,.15,.1]],
  butt:['root',[0,-.11,-.06]], glute:['root',[0,-.03,-.12]], pelvisF:['root',[0,0,.1]]
};
function solve(n, anchor) {
  const J = {root:[0,0,0]}, R = {root:rotXYZ(n.rx*D2R, n.ry*D2R, n.rz*D2R)};
  const ch = (nm, par, off, rot) => { J[nm] = add(J[par], mv(R[par], off)); R[nm] = mm(R[par], rotXYZ(rot[0]*D2R, rot[1]*D2R, rot[2]*D2R)); };
  ch('spine', 'root', [0,.06,0], [n.sp, n.st, n.ss]); ch('neck', 'spine', [0,.52,0], [n.nk,0,0]); ch('head', 'neck', [0,.15,0], [0,0,0]);
  for (const S of LR) {
    const s = S === 'L' ? 1 : -1;
    ch('sh'+S, 'spine', [s*SHW, .46 + n['shr'+S], 0], [-n['sf'+S], 0, s*n['sa'+S]]); ch('el'+S, 'sh'+S, [0,-.29,0], [-n['e'+S],0,0]); ch('wr'+S, 'el'+S, [0,-.26,0], [n['w'+S],0,0]);
    ch('hp'+S, 'root', [s*.095,-.05,0], [-n['hf'+S], 0, s*n['ha'+S]]); ch('kn'+S, 'hp'+S, [0,-.44,0], [n['k'+S],0,0]); ch('an'+S, 'kn'+S, [0,-.43,0], [n['a'+S],0,0]);
  }
  const at = (f, l) => add(J[f], mv(R[f], l));
  let dy;
  if (!anchor) { let m = 1e9; for (const k in MARKERS) { const y = at(...MARKERS[k])[1]; if (y < m) m = y; } dy = -m + n.jy; }
  else { let s = 0; anchor.m.forEach(k => s += at(...MARKERS[k])[1]); dy = anchor.y - s / anchor.m.length + n.jy; }
  for (const k in J) J[k] = [J[k][0], J[k][1] + dy, J[k][2]];
  return {J, R, at:(f, l) => add(J[f], mv(R[f], l)), mk:k => add(J[MARKERS[k][0]], mv(R[MARKERS[k][0]], MARKERS[k][1]))};
}
const MDEF = [];
for (const S of LR) {
  const s = S === 'L' ? 1 : -1, m = (id, f, c, z) => MDEF.push([id, f === 'spine' || f === 'root' ? f : f + S, [c[0]*s, c[1], c[2]], z]);
  m('chest_upper','spine',[.068,.43,.1],[.06,.03,.03]); m('chest_lower','spine',[.07,.37,.115],[.065,.04,.03]);
  [.12,.19,.26].forEach(y => m('abs','spine',[.03,y,.09],[.025,.03,.02]));
  m('obliques','spine',[.105,.18,.05],[.03,.08,.045]); m('upper_back','spine',[.055,.37,-.095],[.045,.065,.03]);
  m('lats','spine',[.11,.27,-.065],[.045,.11,.04]); m('lower_back','spine',[.032,.11,-.088],[.028,.07,.024]);
  m('delt_front','sh',[.008,-.03,.036],[.038,.055,.025]); m('delt_side','sh',[.036,-.035,0],[.027,.06,.036]); m('delt_rear','sh',[.008,-.03,-.036],[.038,.055,.025]);
  m('biceps','sh',[0,-.15,.026],[.028,.08,.022]); m('triceps','sh',[0,-.15,-.027],[.031,.09,.024]);
  m('forearms','el',[0,-.085,.006],[.031,.085,.029]);
  m('glutes','root',[.08,-.05,-.085],[.078,.085,.05]); m('hip_flexors','root',[.08,-.03,.085],[.035,.05,.022]);
  m('quads','hp',[0,-.22,.045],[.058,.16,.04]); m('hamstrings','hp',[0,-.24,-.045],[.053,.15,.04]); m('calves','kn',[0,-.12,-.033],[.039,.1,.032]);
}
MDEF.push(['traps','spine',[0,.48,-.045],[.095,.045,.045]]);
const PROF = {
  pelvis:[[0,.1,.085,-.01],[.35,.168,.112,-.02],[1,.14,.098,0]],
  torso:[[0,.13,.092,0],[.22,.113,.088,.004],[.5,.128,.096,.012],[.68,.142,.112,.03],[.8,.148,.104,.025],[.92,.156,.086,0],[1,.055,.05,0]],
  neck:[[0,.043,.045,0],[1,.039,.041,.004]],
  uarm:[[0,.05,.05,0],[.18,.045,.044,0],[.5,.038,.04,.003],[.86,.031,.033,0],[1,.029,.031,0]],
  farm:[[0,.032,.033,0],[.22,.035,.032,.003],[.7,.025,.022,0],[1,.02,.017,0]],
  hand:[[0,.021,.012,0],[.55,.026,.014,0],[1,.018,.011,0]],
  thigh:[[0,.09,.092,-.006],[.3,.081,.081,.006],[.7,.061,.063,.006],[.95,.046,.047,.008],[1,.044,.045,.008]],
  shin:[[0,.045,.046,.004],[.22,.048,.054,-.012],[.55,.037,.04,-.006],[.9,.026,.028,0],[1,.026,.028,0]],
  foot:[[0,.031,.034,0],[.3,.038,.038,0],[.75,.04,.027,0],[1,.029,.016,0]],
  tail:[[0,.032,.032,0],[.35,.04,.04,0],[1,.01,.01,0]]
};
const COL = {skin:'#e3ae8c', skinL:'#f6cfb4', skinD:'#b9805f', line:'rgba(95,55,35,.5)', fit:'#7a9cae', fitL:'#a2c0ce', fitD:'#557686', shoe:'#f4f6f8', shoeD:'#b9c2cb', sole:'#8a96a3', hair:'#3b2419', hairL:'#6a4330', lips:'#b65e58', iron:'#3a434f', ironL:'#6b7684', mat:'#8e9196', matTop:'#a9acb1'};
const FLOOR_PATS = ['quad','bridge','crunch','legraise','prone','clam','nordic','plank','sideplank','pushup','pike','climber','taps','rollout','vup','flutter','heeltap','bearhold','burpee','inchworm','situp'];
const NO_HAND_PROPS = ['bridge','crunch','legraise','plank','sideplank','quad','clam','abduct','legext','legpress','stretch','stretch2','knees','jack','rope','skater','burpee','climber','pushup','pike','prone','nordic','swings','circles','rotate','inchworm','box','bandwalk','kickback','rollout','taps','vup','flutter','heeltap','bearhold','tuck','buttkick','shuffle','rotstretch','hipcircle','sideleg','jumplunge','situp'];
const VIEWS = {front:0, back:Math.PI, right:Math.PI / 2, side:Math.PI / 2, left:-Math.PI / 2};

class FigView {
  constructor(cv, opts = {}) { this.cv = cv; this.g = cv.getContext('2d'); this.mode = opts.mode || 'demo'; this.t = 0; this.yaw = 0; this.hl = {prim:[], sec:[]}; this.sel = null; this.hover = null; this.rec = null; this.path = !!opts.path; this.picks = []; this.samples = []; this.supports = []; this.trail = null; this.anim = null; this.thumb = !!opts.thumb; }
  size(w, h, dpr) { this.dpr = dpr; this.cv.width = Math.max(1, Math.round(w * dpr)); this.cv.height = Math.max(1, Math.round(h * dpr)); this.fit(); }
  view(name) { this.yaw = VIEWS[name] ?? 0; this.fit(); }
  setAnim(ex, opts = {}) {
    this.anim = ex ? compileAnim(ex, !!opts.fault) : null;
    if (!opts.keepT) this.t = 0;
    this.eqKind = null; this.supports = []; this.samples = []; this.trail = null; this.mat = null;
    const frames = this.anim ? Array.from({length:16}, (_, i) => poseAt(this.anim, i / 16)) : [normPose({sa:10})];
    frames.forEach(f => { const s = solve(f, this.anim && this.anim.anchor); this.samples.push(Object.values(s.J).concat(Object.keys(MARKERS).map(s.mk))); });
    if (this.anim) {
      this.noPlates = !!(this.anim.props && this.anim.props.includes('handbar')); if (this.noPlates) this.eqKind = 'bar';
      else if (!NO_HAND_PROPS.includes(ex.pat)) this.eqKind = ex.po && ex.po.arms === 'goblet' ? 'kb' : {db:'db', bb:'bar', kb:'kb'}[ex.eq[0]] || null;
      this.anim.sup.forEach(s => { const sv = solve(this.anim.frames[s.f] || this.anim.frames[0], this.anim.anchor); const pts = s.m.map(sv.mk); this.supports.push({...s, c:pts.reduce((a, p) => add(a, p), [0,0,0]).map(v => v / pts.length)}); });
      const f0 = this.anim.frames[0];
      if (!this.supports.some(s => s.kind === 'box') && (FLOOR_PATS.includes(ex.pat) || Math.abs(f0.rx) > 40 || Math.abs(f0.rz) > 40)) { const c = solve(f0, this.anim.anchor).J.root; this.mat = {c:[c[0], .012, c[2]], w:.62, d:1.75}; }
      if (!this.thumb) this.trail = Array.from({length:49}, (_, i) => solve(poseAt(this.anim, i / 48), this.anim.anchor).mk(this.anim.track));
      this.hl = {prim:ex.prim, sec:ex.sec};
      if (opts.view !== false) this.yaw = VIEWS[opts.view || this.anim.view] ?? 0;
    }
    this.fit();
  }
  fit() {
    if (!this.samples.length) return;
    const c = Math.cos(this.yaw), s = Math.sin(this.yaw); let x0 = 1e9, x1 = -1e9, y1 = 0;
    this.samples.forEach(list => list.forEach(p => { const x = p[0]*c + p[2]*s; if (x < x0) x0 = x; if (x > x1) x1 = x; if (p[1] > y1) y1 = p[1]; }));
    this.supports.forEach(sp => { if (sp.kind === 'bar') y1 = Math.max(y1, sp.c[1] + .08); });
    if (this.mat) { const hw = Math.abs(this.mat.d / 2 * s) + Math.abs(this.mat.w / 2 * c), mx = this.mat.c[0] * c + this.mat.c[2] * s; x0 = Math.min(x0, mx - hw); x1 = Math.max(x1, mx + hw); }
    const W = this.cv.width, H = this.cv.height, pad = this.thumb ? .12 : .35;
    this.k = Math.min(W / ((x1 - x0) + pad), H * (this.thumb ? .9 : .86) / (y1 + .12));
    this.ox = W / 2 - (x0 + x1) / 2 * this.k; this.oy = H * (this.thumb ? .93 : .91);
  }
  frame(dt, speed = 1) {
    let pose, act = 0, ph = null;
    if (this.anim) { this.t += dt * speed / this.anim.dur; pose = poseAt(this.anim, this.t); ph = phaseAt(this.anim, this.t); act = ph.act; }
    else { const b = Math.sin(performance.now() / 1100); pose = normPose({sa:9 + b, sp:b * .4, nk:-b * .4}); }
    this.draw(solve(pose, this.anim && this.anim.anchor), act);
    return ph;
  }
  draw(sk, act) {
    const g = this.g, W = this.cv.width, H = this.cv.height, d = this.dpr || 1, cy = Math.cos(this.yaw), sy = Math.sin(this.yaw), k = this.k, ox = this.ox, oy = this.oy;
    this.col = Stage.col;
    const P = p => [ox + k * (p[0]*cy + p[2]*sy), oy - k * p[1]], V = v => [v[0]*cy + v[2]*sy, -v[1]], depth = p => -p[0]*sy + p[2]*cy;
    this.P = P; this.V = V; this.depth = depth;
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
    const root = P(sk.J.root);
    const sh = g.createRadialGradient(root[0], oy, 0, root[0], oy, k * .55); sh.addColorStop(0, 'rgba(0,0,0,.2)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    g.save(); g.translate(root[0], oy); g.scale(1, .1); g.fillStyle = sh; g.beginPath(); g.arc(0, 0, k * .55, 0, Math.PI * 2); g.fill(); g.restore();
    if (!this.thumb) { g.strokeStyle = 'rgba(120,130,145,.3)'; g.lineWidth = d; g.beginPath(); g.moveTo(W * .05, oy); g.lineTo(W * .95, oy); g.stroke(); }
    if (this.mat) this.box(this.mat.c[0], this.mat.c[2], this.mat.w, this.mat.d, .014, [COL.matTop, COL.mat]);
    this.picks = [];
    this.supports.forEach(s => { if (s.kind === 'box') this.box(s.c[0], s.c[2], s.w, s.d, Math.max(.05, s.c[1] - .02), ['#9aa5b1', '#6f7a87']); });
    if (this.path && this.trail) { g.save(); g.strokeStyle = this.col.accent; g.globalAlpha = .55; g.setLineDash([5 * d, 5 * d]); g.lineWidth = 2 * d; g.beginPath(); this.trail.forEach((p, i) => { const q = P(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.stroke(); g.restore(); }
    this.supports.forEach(s => { if (s.kind === 'bar' || s.kind === 'bars') this.bars(s); });
    const J = sk.J, R = sk.R, items = [], push = (dz, fn) => items.push({dz, fn});
    const seg = (f, a, b) => [sk.at(f, a), sk.at(f, b)];
    const limb = (f, A, B, prof, kind, mus, bias, opt) => push(depth(lerp3(A, B, .5)) + bias, () => { this.limb(A, B, R[f], prof, kind, opt); this.muscles(sk, f, mus, act); });
    push(depth(J.spine), () => { const [a, b] = seg('spine', [0, -.04, 0], [0, .52, 0]); this.limb(a, b, R.spine, PROF.torso, 'skin', {caps:2, cover:[[.56, .955]]}); this.details(sk); this.muscles(sk, 'spine', true, act); });
    push(depth(J.root) + .001, () => { const [a, b] = seg('root', [0, -.13, 0], [0, .05, 0]); this.limb(a, b, R.root, PROF.pelvis, 'fit', {caps:1, ol:1, lines:[.86]}); this.muscles(sk, 'root', true, act); });
    { const [a, b] = seg('neck', [0, -.01, 0], [0, .1, 0]); limb('neck', a, b, PROF.neck, 'skin', false, .02); }
    { const base = sk.at('head', [0, .055, -.085]), back = mv(R.head, [0, .2, -1]), sw = Math.sin(performance.now() / 420) * .012, end = add(base, [back[0] * .07 + sw, -.2 + back[1] * .03, back[2] * .07]);
      push(depth(lerp3(base, end, .5)) + .028, () => { this.limb(base, end, R.head, PROF.tail, 'hair', {ol:2}); this.hairTie(base, R.head); }); }
    push(depth(J.head) + .03, () => this.head(sk));
    for (const S of LR) {
      { const [a, b] = seg('sh'+S, [0, .01, 0], [0, -.29, 0]); limb('sh'+S, a, b, PROF.uarm, 'skin', true, .02, {s0:2}); }
      { const [a, b] = seg('el'+S, [0, 0, 0], [0, -.26, 0]); limb('el'+S, a, b, PROF.farm, 'skin', true, .022, {s0:1}); }
      { const [a, b] = seg('wr'+S, [0, 0, 0], [0, -.095, 0]); limb('wr'+S, a, b, PROF.hand, 'skin', false, .024, {s0:2, ol:2}); }
      { const [a, b] = seg('hp'+S, [0, .02, 0], [0, -.44, 0]); limb('hp'+S, a, b, PROF.thigh, 'fit', true, .01, {s0:3, seam:1}); }
      { const [a, b] = seg('kn'+S, [0, 0, 0], [0, -.43, 0]); limb('kn'+S, a, b, PROF.shin, 'skin', true, .011, {cover:[[0, .88]], s0:1, seam:1}); }
      { const [a, b] = seg('an'+S, [0, -.05, -.06], [0, -.05, .16]); limb('an'+S, a, b, PROF.foot, 'shoe', false, .012, {axes:[[1,0,0],[0,1,0]], ol:3}); }
      if (this.eqKind === 'db') push(depth(sk.mk('hand'+S)) + .03, () => this.dumbbell(sk, S));
    }
    if (this.eqKind === 'bar') this.barbell(push, sk);
    if (this.eqKind === 'kb') push(depth(lerp3(sk.mk('handL'), sk.mk('handR'), .5)) + .04, () => this.kettlebell(sk));
    this.selPos = null;
    items.sort((a, b) => a.dz - b.dz).forEach(i => i.fn());
  }
  limb(A, B, Rf, prof, kind, opt = {}) {
    const g = this.g, P = this.P, V = this.V, d = this.dpr || 1, k = this.k, a = P(A), b = P(B), caps = opt.caps ?? 3, axes = opt.axes;
    let dx = b[0] - a[0], dy = b[1] - a[1]; const L = Math.hypot(dx, dy) || 1e-6; dx /= L; dy /= L;
    const p = [-dy, dx], ax1 = V(mv(Rf, axes ? axes[0] : [1,0,0])), ax2 = V(mv(Rf, axes ? axes[1] : [0,0,1])), zv = mv(Rf, axes ? axes[1] : [0,0,1]);
    const n = 14, left = [], right = [], cs = [], hs = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n; let j = 0; while (j < prof.length - 2 && prof[j + 1][0] < t) j++;
      const p0 = prof[j], p1 = prof[j + 1], u = clamp((t - p0[0]) / (p1[0] - p0[0] || 1), 0, 1), sm = u * u * (3 - 2 * u);
      const rX = p0[1] + (p1[1] - p0[1]) * sm, rZ = p0[2] + (p1[2] - p0[2]) * sm, zb = p0[3] + (p1[3] - p0[3]) * sm;
      const c = P(add(lerp3(A, B, t), zv.map(v => v * zb))), h = k * Math.hypot(rX * (ax1[0]*p[0] + ax1[1]*p[1]), rZ * (ax2[0]*p[0] + ax2[1]*p[1]));
      cs.push(c); hs.push(h); left.push([c[0] + p[0]*h, c[1] + p[1]*h]); right.push([c[0] - p[0]*h, c[1] - p[1]*h]);
    }
    const ang = Math.atan2(dy, dx), path = new Path2D();
    path.moveTo(left[0][0], left[0][1]);
    for (let i = 1; i <= n; i++) path.lineTo(left[i][0], left[i][1]);
    if (caps & 2) path.arc(cs[n][0], cs[n][1], hs[n], ang + Math.PI / 2, ang - Math.PI / 2, true);
    for (let i = n; i >= 0; i--) path.lineTo(right[i][0], right[i][1]);
    if (caps & 1) path.arc(cs[0][0], cs[0][1], hs[0], ang - Math.PI / 2, ang + Math.PI / 2, true);
    path.closePath();
    const m = cs[n >> 1], hm = hs[n >> 1] || 1, lit = (p[0] * -.6 + p[1] * -.8) > 0 ? 1 : -1;
    const grad = pal => { const gr = g.createLinearGradient(m[0] + p[0]*hm*lit, m[1] + p[1]*hm*lit, m[0] - p[0]*hm*lit, m[1] - p[1]*hm*lit); gr.addColorStop(0, pal[0]); gr.addColorStop(.42, pal[1]); gr.addColorStop(1, pal[2]); return gr; };
    const PAL = {skin:[COL.skinL, COL.skin, COL.skinD], fit:[COL.fitL, COL.fit, COL.fitD], shoe:['#ffffff', COL.shoe, COL.shoeD], hair:[COL.hairL, COL.hair, '#1e120c']};
    g.fillStyle = grad(PAL[kind]); g.fill(path);
    if (opt.cover) {
      g.save(); g.clip(path); g.fillStyle = grad(PAL.fit);
      opt.cover.forEach(([t0, t1]) => { const i0 = Math.round(t0 * n), i1 = Math.round(t1 * n), w = 3 * Math.max(...hs), e0 = t0 === 0 ? [cs[0][0] - dx * w, cs[0][1] - dy * w] : cs[i0], e1 = t1 === 1 ? [cs[n][0] + dx * w, cs[n][1] + dy * w] : cs[i1];
        g.beginPath(); g.moveTo(e0[0] + p[0]*w, e0[1] + p[1]*w); g.lineTo(e1[0] + p[0]*w, e1[1] + p[1]*w); g.lineTo(e1[0] - p[0]*w, e1[1] - p[1]*w); g.lineTo(e0[0] - p[0]*w, e0[1] - p[1]*w); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(40,70,85,.35)'; g.lineWidth = 1.2 * d; [i0, i1].forEach(i => { if (i > 0 && i < n) { g.beginPath(); g.moveTo(cs[i][0] + p[0]*hs[i], cs[i][1] + p[1]*hs[i]); g.lineTo(cs[i][0] - p[0]*hs[i], cs[i][1] - p[1]*hs[i]); g.stroke(); } }); });
      g.restore();
    }
    if (kind === 'shoe') { g.save(); g.clip(path); g.fillStyle = COL.sole; g.fillRect(0, this.oy - 3 * d, this.cv.width, 8 * d); g.restore(); }
    { const side = lit > 0 ? left : right, s0 = Math.max(1, opt.s0 || 1); g.save(); g.clip(path); g.globalAlpha = kind === 'skin' ? .32 : .22; g.strokeStyle = '#ffffff'; g.lineWidth = Math.max(1, hm * .35); g.lineCap = 'round'; g.beginPath();
      for (let i = s0; i < n; i++) { const q = [side[i][0] - p[0] * lit * hs[i] * .45, side[i][1] - p[1] * lit * hs[i] * .45]; i === s0 ? g.moveTo(q[0], q[1]) : g.lineTo(q[0], q[1]); } g.stroke(); g.restore(); }
    if (opt.lines) { g.save(); g.clip(path); g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 1.4 * d; opt.lines.forEach(t => { const i = Math.round(t * n); g.beginPath(); g.moveTo(cs[i][0] + p[0]*hs[i], cs[i][1] + p[1]*hs[i]); g.lineTo(cs[i][0] - p[0]*hs[i], cs[i][1] - p[1]*hs[i]); g.stroke(); }); g.restore(); }
    if (opt.seam) { g.save(); g.clip(path); g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 1.1 * d; g.beginPath(); for (let i = 1; i < n; i++) { const q = [cs[i][0] - p[0] * lit * hs[i] * .55, cs[i][1] - p[1] * lit * hs[i] * .55]; i === 1 ? g.moveTo(q[0], q[1]) : g.lineTo(q[0], q[1]); } g.stroke(); g.restore(); }
    if (kind === 'shoe' && !this.thumb) { g.save(); g.clip(path); g.fillStyle = 'rgba(90,100,112,.55)'; [.38, .5, .62].forEach(t => { const i = Math.round(t * n), q = cs[i]; g.beginPath(); g.arc(q[0] - p[0] * hs[i] * .3, q[1] - p[1] * hs[i] * .3, Math.max(1, hs[i] * .12), 0, Math.PI * 2); g.fill(); });
      const i = Math.round(.8 * n); g.strokeStyle = 'rgba(120,130,140,.6)'; g.lineWidth = d; g.beginPath(); g.moveTo(cs[i][0] + p[0]*hs[i], cs[i][1] + p[1]*hs[i]); g.lineTo(cs[i][0] - p[0]*hs[i], cs[i][1] - p[1]*hs[i]); g.stroke(); g.restore(); }
    const ol = opt.ol ?? 0, s0 = opt.s0 || 0, op = new Path2D();
    op.moveTo(left[s0][0], left[s0][1]); for (let i = s0 + 1; i <= n; i++) op.lineTo(left[i][0], left[i][1]);
    if ((ol & 2) && (caps & 2)) op.arc(cs[n][0], cs[n][1], hs[n], ang + Math.PI / 2, ang - Math.PI / 2, true); else op.moveTo(right[n][0], right[n][1]);
    for (let i = n - 1; i >= s0; i--) op.lineTo(right[i][0], right[i][1]);
    if ((ol & 1) && (caps & 1) && s0 === 0) op.arc(cs[0][0], cs[0][1], hs[0], ang - Math.PI / 2, ang + Math.PI / 2, true);
    g.strokeStyle = kind === 'fit' ? 'rgba(40,70,85,.6)' : kind === 'shoe' ? 'rgba(80,90,100,.65)' : kind === 'hair' ? 'rgba(20,10,5,.65)' : COL.line;
    g.lineWidth = (this.thumb ? 1 : 1.4) * d; g.lineJoin = 'round'; g.stroke(op);
    this.picks.push({path, id:null});
  }
  muscles(sk, frame, show, act) {
    if (!show) return;
    const g = this.g, P = this.P, V = this.V, k = this.k, d = this.dpr || 1, C = this.col, explore = this.mode === 'explore', prim = this.hl.prim || [], sec = this.hl.sec || [];
    MDEF.forEach(([id, f, c, z]) => {
      if (f !== frame) return;
      const isP = prim.includes(id), isS = sec.includes(id);
      if (!explore && !this.rec && !isP && !isS && this.sel !== id) return;
      const R = sk.R[f], nrm = mv(R, Math.hypot(c[0], c[2]) > .01 ? [c[0], 0, c[2]] : [0, 0, 1]);
      const face = (-nrm[0] * Math.sin(this.yaw) + nrm[2] * Math.cos(this.yaw)) / (Math.hypot(...nrm) || 1), wrap = Math.hypot(c[0], c[2]) < .02;
      if (!wrap && face < -.05) return;
      const al = wrap ? 1 : clamp((face + .05) / .45, 0, 1);
      const ax = [V(mv(R, [z[0], 0, 0])), V(mv(R, [0, z[1], 0])), V(mv(R, [0, 0, z[2]]))];
      let a = 0, b = 0, cc = 0; ax.forEach(v => { a += v[0]*v[0]; b += v[0]*v[1]; cc += v[1]*v[1]; });
      const tr = (a + cc) / 2, df = Math.sqrt(((a - cc) / 2) ** 2 + b * b), l1 = Math.sqrt(tr + df) * k, l2 = Math.sqrt(Math.max(tr - df, 1e-6)) * k, rot = .5 * Math.atan2(2 * b, a - cc);
      const q = P(sk.at(f, c)), path = new Path2D(); path.ellipse(q[0], q[1], l1 * .92, l2 * .92, rot, 0, Math.PI * 2);
      let fill = explore ? C.prim : C.base, alpha = explore ? .22 : .45;
      if (this.rec) { const r = this.rec[id]; fill = r == null ? C.base : r < 24 ? C.bad : r < 48 ? C.warn : C.good; alpha = .62; }
      if (isS) { fill = C.sec; alpha = .55 + .2 * act; }
      if (isP) { fill = C.prim; alpha = .6 + .32 * act; }
      if (this.sel === id) { fill = C.prim; alpha = .92; this.selPos = q; }
      if (this.hover === id) alpha = Math.min(1, alpha + .25);
      g.save(); g.globalAlpha = al * alpha; g.fillStyle = fill; g.fill(path); g.globalAlpha = al * Math.min(1, alpha + .2); g.strokeStyle = fill; g.lineWidth = d; g.stroke(path); g.restore();
      this.picks.push({path, id});
    });
  }
  head(sk) {
    const g = this.g, P = this.P, V = this.V, k = this.k, d = this.dpr || 1, R = sk.R.head, c = sk.at('head', [0, .01, 0]), q = P(c);
    const up = V(mv(R, [0, 1, 0])), rot = Math.atan2(up[0], -up[1]), fwd = mv(R, [0, 0, 1]), fd = -fwd[0] * Math.sin(this.yaw) + fwd[2] * Math.cos(this.yaw);
    const ell = (p, rx, ry, fill, stroke, lw = 1.1) => { g.beginPath(); g.ellipse(p[0], p[1], rx * k, ry * k, rot, 0, Math.PI * 2); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw * d; g.stroke(); } };
    const vis = f => { const w = mv(R, f), n = Math.hypot(...f) || 1; return (-w[0] * Math.sin(this.yaw) + w[2] * Math.cos(this.yaw)) / n; };
    const L = l => P(sk.at('head', l));
    const hg = g.createRadialGradient(q[0] - .03 * k, q[1] - .05 * k, 0, q[0], q[1], .13 * k); hg.addColorStop(0, COL.hairL); hg.addColorStop(1, COL.hair);
    ell(q, .088, .108, hg, 'rgba(20,10,5,.55)');
    { g.save(); g.globalAlpha = .35; g.strokeStyle = COL.hairL; g.lineWidth = .012 * k; g.lineCap = 'round'; const a1 = L([-.05, .085, -.02]), a2 = L([0, .112, -.01]), a3 = L([.04, .09, -.04]); g.beginPath(); g.moveTo(a1[0], a1[1]); g.quadraticCurveTo(a2[0], a2[1], a3[0], a3[1]); g.stroke(); g.restore(); }
    [1, -1].forEach(s => { if (vis([s, 0, 0]) > .1) ell(L([s * .083, -.012, -.005]), .015, .025, COL.skin, COL.line); });
    if (fd > -.45) {
      const fc = L([0, -.02, .03 * clamp(fd + .5, 0, 1)]);
      const sg = g.createRadialGradient(fc[0] - .025 * k, fc[1] - .03 * k, 0, fc[0], fc[1], .1 * k); sg.addColorStop(0, COL.skinL); sg.addColorStop(.6, COL.skin); sg.addColorStop(1, COL.skinD);
      g.save(); g.beginPath(); g.ellipse(q[0], q[1], .088 * k, .108 * k, rot, 0, Math.PI * 2); g.clip(); ell(fc, .082, .096, sg); g.restore();
      if (!this.thumb || k > 120) {
        [1, -1].forEach(s => { if (vis([s * .35, .1, 1]) > .25) { const e = L([s * .031, .008, .085]); ell(e, .01, .0055, '#ffffff'); ell(e, .0055, .0052, '#3a2418'); g.strokeStyle = '#2a1a12'; g.lineWidth = 1.6 * d; const l1 = L([s * .044, .013, .082]), l2 = L([s * .018, .014, .087]); g.beginPath(); g.moveTo(l1[0], l1[1]); g.lineTo(l2[0], l2[1]); g.stroke(); const b1 = L([s * .046, .03, .08]), b2 = L([s * .017, .033, .087]); g.strokeStyle = COL.hair; g.lineWidth = 1.5 * d; g.beginPath(); g.moveTo(b1[0], b1[1]); g.quadraticCurveTo((b1[0] + b2[0]) / 2, (b1[1] + b2[1]) / 2 - 2 * d, b2[0], b2[1]); g.stroke(); } });
        if (vis([0, -.1, 1]) > .05) { const n1 = L([0, .005, .095]), n2 = L([0, -.022, .104]), n3 = L([.007, -.027, .095]); g.strokeStyle = COL.skinD; g.lineWidth = 1.3 * d; g.beginPath(); g.moveTo(n1[0], n1[1]); g.lineTo(n2[0], n2[1]); g.lineTo(n3[0], n3[1]); g.stroke(); }
        if (vis([0, -.3, 1]) > .1) { const m1 = L([-.019, -.052, .085]), m2 = L([0, -.058, .09]), m3 = L([.019, -.052, .085]); g.fillStyle = COL.lips; g.beginPath(); g.moveTo(m1[0], m1[1]); g.quadraticCurveTo(m2[0], m2[1] - 2 * d, m3[0], m3[1]); g.quadraticCurveTo(m2[0], m2[1] + 3 * d, m1[0], m1[1]); g.fill(); }
      }
      if (!this.thumb || k > 120) [1, -1].forEach(s => {
        if (vis([s * .5, -.2, 1]) > .3) { const ch = L([s * .048, -.028, .072]), rg = g.createRadialGradient(ch[0], ch[1], 0, ch[0], ch[1], .022 * k); rg.addColorStop(0, 'rgba(230,120,110,.35)'); rg.addColorStop(1, 'rgba(230,120,110,0)'); g.fillStyle = rg; g.beginPath(); g.arc(ch[0], ch[1], .022 * k, 0, Math.PI * 2); g.fill(); }
        if (vis([s * .35, .1, 1]) > .25) { const e = L([s * .031, .008, .085]); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(e[0] - .0015 * k, e[1] - .0018 * k, Math.max(.8 * d, .0016 * k), 0, Math.PI * 2); g.fill(); } });
      if (Math.abs(fd) < .75 && (!this.thumb || k > 90)) { // profile: nose and lips break the face outline like a real side view
        const nb = L([0, .012, .09]), nt = L([0, -.022, .106]), nl = L([0, -.03, .092]), lp = L([0, -.054, .088]);
        g.fillStyle = COL.skin; g.strokeStyle = COL.line; g.lineWidth = 1.1 * d; g.beginPath(); g.moveTo(nb[0], nb[1]); g.quadraticCurveTo(nt[0], nt[1] - .004 * k, nt[0], nt[1]); g.lineTo(nl[0], nl[1]); g.closePath(); g.fill(); g.stroke();
        g.fillStyle = COL.lips; g.beginPath(); g.ellipse(lp[0], lp[1], .005 * k, .0045 * k, 0, 0, Math.PI * 2); g.fill();
        [1, -1].forEach(s => { if (vis([s * .6, .05, .8]) > .2) { const e = L([s * .028, .008, .088]); g.fillStyle = '#3a2418'; g.beginPath(); g.ellipse(e[0], e[1], .006 * k, .0065 * k, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#2a1a12'; g.lineWidth = 1.6 * d; const b1 = L([s * .03, .032, .085]), b2 = L([s * .01, .036, .095]); g.beginPath(); g.moveTo(b1[0], b1[1]); g.lineTo(b2[0], b2[1]); g.stroke(); } });
      }
      const h1 = L([-.07, .06, .055]), h2 = L([0, .085, .075]), h3 = L([.07, .06, .055]);
      if (fd > -.1) { g.strokeStyle = COL.hair; g.lineWidth = .02 * k; g.lineCap = 'round'; g.beginPath(); g.moveTo(h1[0], h1[1]); g.quadraticCurveTo(h2[0], h2[1], h3[0], h3[1]); g.stroke(); }
    }
    const pp = new Path2D(); pp.ellipse(q[0], q[1], .088 * k, .108 * k, rot, 0, Math.PI * 2); this.picks.push({path:pp, id:null});
  }
  details(sk) {
    if (this.thumb && this.k < 110) return;
    const g = this.g, P = this.P, k = this.k, d = this.dpr || 1, R = sk.R.spine, sy = Math.sin(this.yaw), cy = Math.cos(this.yaw);
    const vis = l => { const w = mv(R, l); return (-w[0] * sy + w[2] * cy) / (Math.hypot(...l) || 1); };
    const L = l => P(sk.at('spine', l)), curve = (a, c, b, col, w, al) => { const A = L(a), C = L(c), B = L(b); g.save(); g.globalAlpha = al; g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(A[0], A[1]); g.quadraticCurveTo(C[0], C[1], B[0], B[1]); g.stroke(); g.restore(); };
    const front = vis([0, 0, 1]), back = -front;
    [1, -1].forEach(s => {
      if (vis([s * .3, 0, 1]) > -.2) curve([s * .055, .49, .1], [s * .09, .53, .06], [s * .115, .53, .0], COL.fitD, .014 * k, .95);
      if (vis([s * .3, 0, -1]) > -.2) curve([s * .115, .53, .0], [s * .1, .52, -.06], [s * .07, .49, -.09], COL.fitD, .014 * k, .95);
      if (front > .2) curve([s * .02, .5, .08], [s * .07, .51, .095], [s * .125, .505, .06], COL.skinD, 1.4 * d, .5 * front);
      if (back > .25) curve([s * .04, .42, -.1], [s * .09, .36, -.105], [s * .06, .3, -.098], COL.skinD, 1.3 * d, .35 * back);
    });
    if (front > .3) { const nv = L([0, .1, .093]); g.save(); g.globalAlpha = .55 * front; g.fillStyle = COL.skinD; g.beginPath(); g.ellipse(nv[0], nv[1], .006 * k, .009 * k, 0, 0, Math.PI * 2); g.fill(); g.restore();
      curve([0, .28, .1], [0, .22, .099], [0, .15, .095], COL.skinD, 1.1 * d, .22 * front); }
    if (back > .3) curve([0, .3, -.1], [0, .2, -.098], [0, .08, -.092], COL.skinD, 1.2 * d, .3 * back);
  }
  hairTie(base, R) {
    const g = this.g, q = this.P(base), k = this.k; g.save(); g.fillStyle = COL.fitD; g.strokeStyle = 'rgba(20,30,40,.5)'; g.lineWidth = this.dpr || 1;
    g.beginPath(); g.ellipse(q[0], q[1], .02 * k, .014 * k, 0, 0, Math.PI * 2); g.fill(); g.stroke(); g.restore();
  }
  plate(c, axis, r, thick) {
    const g = this.g, k = this.k, d = this.dpr || 1, q = this.P(c), av = this.V(axis), facing = Math.abs(-axis[0] * Math.sin(this.yaw) + axis[2] * Math.cos(this.yaw)), al = Math.hypot(av[0], av[1]);
    g.save(); g.translate(q[0], q[1]); g.rotate(Math.atan2(av[1], av[0]));
    const gr = g.createLinearGradient(0, -r * k, 0, r * k); gr.addColorStop(0, COL.ironL); gr.addColorStop(1, COL.iron);
    g.fillStyle = gr; g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = d; g.beginPath(); g.ellipse(0, 0, Math.max(thick * k * .5, r * k * facing * .98 + thick * k * al * .5), r * k, 0, 0, Math.PI * 2); g.fill(); g.stroke(); g.restore();
  }
  dumbbell(sk, S) {
    const g = this.g, k = this.k, c = sk.at('wr'+S, [0, -.06, 0]), ax = mv(sk.R['wr'+S], [1, 0, 0]), ends = [-1, 1].map(s => add(c, ax.map(v => v * s * .085)));
    const a = this.P(ends[0]), b = this.P(ends[1]); g.strokeStyle = COL.iron; g.lineWidth = .02 * k; g.lineCap = 'round'; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    ends.forEach(e => this.plate(e, ax, .045, .03));
  }
  barbell(push, sk) {
    const hL = sk.mk('handL'), hR = sk.mk('handR'), mid = lerp3(hL, hR, .5);
    let ax = [hL[0] - hR[0], hL[1] - hR[1], hL[2] - hR[2]]; let l = Math.hypot(...ax); if (l < .15) { ax = mv(sk.R.spine, [1, 0, 0]); l = 1; } ax = ax.map(v => v / l);
    const e1 = add(mid, ax.map(v => v * .8)), e2 = add(mid, ax.map(v => -v * .8)), k = this.k, g = this.g;
    push(this.depth(mid) + .025, () => { const a = this.P(e1), b = this.P(e2); g.strokeStyle = COL.iron; g.lineWidth = .018 * k; g.lineCap = 'round'; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); });
    if (!this.noPlates) [[e1, -1], [e2, 1]].forEach(([e, s]) => { const pc = add(e, ax.map(v => v * s * .14)); push(this.depth(pc) + .026, () => this.plate(pc, ax, .19, .05)); });
  }
  kettlebell(sk) {
    const g = this.g, k = this.k, c = lerp3(sk.mk('handL'), sk.mk('handR'), .5), q = this.P([c[0], c[1] - .075, c[2]]);
    const gr = g.createRadialGradient(q[0] - .03 * k, q[1] - .03 * k, 0, q[0], q[1], .09 * k); gr.addColorStop(0, COL.ironL); gr.addColorStop(1, COL.iron);
    g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], .072 * k, 0, Math.PI * 2); g.fill(); g.strokeStyle = COL.iron; g.lineWidth = .016 * k; g.beginPath(); g.arc(q[0], q[1] - .072 * k, .036 * k, Math.PI, 0); g.stroke();
  }
  box(x, z, w, dd, h, cols) {
    const g = this.g, P = this.P, depth = this.depth, hw = w / 2, hd = dd / 2;
    const C = [[x-hw,0,z-hd],[x+hw,0,z-hd],[x+hw,0,z+hd],[x-hw,0,z+hd],[x-hw,h,z-hd],[x+hw,h,z-hd],[x+hw,h,z+hd],[x-hw,h,z+hd]];
    const faces = [[4,5,6,7,0],[0,1,5,4,1],[1,2,6,5,1],[2,3,7,6,1],[3,0,4,7,1]], ctr = [x, h / 2, z];
    faces.map(f => { const cen = [0, 1, 2].map(i => (C[f[0]][i] + C[f[2]][i]) / 2); return {f, dz:depth(cen), out:depth(cen) - depth(ctr)}; })
      .filter(o => o.f[4] === 0 || o.out > .001).sort((a, b) => a.dz - b.dz)
      .forEach(({f}) => { g.beginPath(); f.slice(0, 4).forEach((i, j) => { const q = P(C[i]); j ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.closePath(); g.fillStyle = cols[f[4]]; g.fill(); g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = this.dpr || 1; g.stroke(); });
  }
  bars(s) {
    const g = this.g, k = this.k; g.strokeStyle = COL.iron; g.lineCap = 'round'; g.lineWidth = .028 * k;
    const line = (a, b) => { const p = this.P(a), q = this.P(b); g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); };
    if (s.kind === 'bar') line([-.6, s.c[1] + .02, s.c[2]], [.6, s.c[1] + .02, s.c[2]]); else [-1, 1].forEach(x => line([x * .25, s.c[1], s.c[2] - .5], [x * .25, s.c[1], s.c[2] + .5]));
  }
  pick(e) {
    const r = this.cv.getBoundingClientRect(), d = this.dpr || 1, x = (e.clientX - r.left) * d, y = (e.clientY - r.top) * d;
    for (let i = this.picks.length - 1; i >= 0; i--) if (this.g.isPointInPath(this.picks[i].path, x, y)) return this.picks[i].id;
    return null;
  }
}

const Stage = {
  ok:false, el:null, running:false, speed:1, playing:true, path:true, onPick:null, onPhase:null, autoRot:false, col:{},
  get anim() { return this.fv && this.fv.anim; },
  get t() { return this.fv ? this.fv.t : 0; }, set t(v) { if (this.fv) this.fv.t = v; },
  get sel() { return this.fv && this.fv.sel; }, set sel(v) { if (this.fv) this.fv.sel = v; },
  get rec() { return this.fv && this.fv.rec; }, set rec(v) { if (this.fv) this.fv.rec = v; },
  init() {
    if (this.ok) return true;
    const cv = document.createElement('canvas'); if (!cv.getContext('2d')) return false;
    cv.className = 'fig'; this.theme(); this.fv = new FigView(cv, {mode:'demo', path:true});
    cv.addEventListener('pointerup', e => { const id = this.fv.pick(e); if (this.onPick) this.onPick(id); });
    cv.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const id = this.fv.pick(e); this.fv.hover = id; cv.style.cursor = id ? 'pointer' : 'default'; this.showTip(id, e); });
    cv.addEventListener('pointerleave', () => { this.fv.hover = null; this.showTip(null); });
    this.ro = new ResizeObserver(() => this.resize());
    this.ok = true; return true;
  },
  theme() {
    const cs = getComputedStyle(document.documentElement), c = k => cs.getPropertyValue(k).trim() || '#888';
    this.col = {prim:c('--m-prim'), sec:c('--m-sec'), base:c('--m-base'), accent:c('--accent'), good:c('--good'), warn:c('--warn'), bad:c('--bad')};
  },
  mount(el, opts = {}) {
    if (!this.init()) { el.innerHTML = '<div class="stage-fail">تعذّر تشغيل العرض على هذا الجهاز.</div>'; return false; }
    if (this.el && this.el !== el) this.ro.unobserve(this.el);
    this.el = el; el.prepend(this.fv.cv);
    this.tip = document.createElement('div'); this.tip.className = 'stage-tip'; this.tip.hidden = true; el.appendChild(this.tip);
    this.selTag = document.createElement('div'); this.selTag.className = 'stage-tag'; this.selTag.hidden = true; el.appendChild(this.selTag);
    this.ro.observe(el);
    const fv = this.fv; fv.mode = opts.mode || 'explore'; fv.sel = null; fv.rec = opts.rec || null; fv.hl = {prim:[], sec:[]}; fv.path = this.path;
    this.onPick = opts.onPick || null;
    if (fv.mode === 'explore') { fv.setAnim(null); fv.view(opts.view || 'front'); }
    this.resize();
    if (!this.running) { this.running = true; this.last = performance.now(); requestAnimationFrame(t => this.loop(t)); }
    return true;
  },
  unmount() { this.running = false; if (this.el) this.ro.unobserve(this.el); this.el = null; },
  resize() { if (this.el) this.fv.size(this.el.clientWidth, this.el.clientHeight, Math.min(window.devicePixelRatio || 1, 2)); },
  view(name) { this.fv.view(name); },
  setAnim(ex, opts = {}) { if (!this.ok) return; this.fv.path = this.path; this.fv.setAnim(ex, opts); },
  setHL(h) { if (this.fv) this.fv.hl = h; },
  loop(ts) {
    if (!this.running) return;
    requestAnimationFrame(t => this.loop(t));
    const dt = Math.min(.05, (ts - this.last) / 1000); this.last = ts;
    if (!this.el || !this.el.isConnected) return;
    this.fv.path = this.path;
    const ph = this.fv.frame(this.playing ? dt : 0, this.speed);
    if (ph && this.onPhase) this.onPhase(ph);
    const s = this.fv.selPos, d = this.fv.dpr || 1;
    if (this.fv.sel && s) { this.selTag.hidden = false; this.selTag.textContent = MUSCLES[this.fv.sel].ar; this.selTag.style.left = (s[0] / d) + 'px'; this.selTag.style.top = (s[1] / d - 14) + 'px'; } else this.selTag.hidden = true;
  },
  showTip(id, e) {
    if (!this.tip) return; if (!id) { this.tip.hidden = true; return; }
    const rc = this.el.getBoundingClientRect(); this.tip.hidden = false; this.tip.textContent = MUSCLES[id].ar + (S.prefs.en ? ' · ' + MUSCLES[id].en : '');
    this.tip.style.left = (e.clientX - rc.left) + 'px'; this.tip.style.top = (e.clientY - rc.top - 34) + 'px';
  }
};

// animated thumbnails for exercise cards; only cards on screen animate
const Thumbs = {
  live:new Map(), running:false, io:null,
  scan(root = document) {
    if (!this.io) this.io = new IntersectionObserver(es => es.forEach(en => { const cv = en.target; if (en.isIntersecting) this.start(cv); else this.live.delete(cv); }), {rootMargin:'120px'});
    root.querySelectorAll('canvas.thumb:not([data-on])').forEach(cv => { cv.dataset.on = '1'; this.io.observe(cv); });
  },
  start(cv) {
    const ex = EXI[cv.dataset.ex]; if (!ex) return;
    let fv = cv._fv;
    if (!fv) { Stage.theme(); fv = cv._fv = new FigView(cv, {thumb:true}); fv.size(cv.clientWidth, cv.clientHeight, Math.min(window.devicePixelRatio || 1, 2)); fv.setAnim(ex); fv.t = Math.random(); fv.frame(0); }
    this.live.set(cv, fv);
    if (!this.running) { this.running = true; this.last = performance.now(); requestAnimationFrame(t => this.loop(t)); }
  },
  loop(ts) {
    for (const [cv] of this.live) if (!cv.isConnected) this.live.delete(cv);
    if (!this.live.size) { this.running = false; return; }
    requestAnimationFrame(t => this.loop(t));
    const dt = (ts - this.last) / 1000; if (dt < 1 / 30) return; this.last = ts;
    for (const [, fv] of this.live) fv.frame(Math.min(dt, .1));
  }
};
