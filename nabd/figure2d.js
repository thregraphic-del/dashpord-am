// Realistic 2D illustrated human figure driven by a biomechanical skeleton (no 3D library).
// Skeleton = forward kinematics; drawing = shaded anatomical contours, face, clothing, equipment, painter's-depth ordering.
const D2R = Math.PI / 180, LR = ['L', 'R'];
const LIM = {k:[0, 150], e:[0, 150], hf:[-35, 140], a:[-35, 60], sf:[-60, 200]};
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
// natural tempo: brief pause at each turnaround, smooth acceleration
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

// ---------- tiny 3x3 math ----------
function rotXYZ(x, y, z) {
  const a = Math.cos(x), b = Math.sin(x), c = Math.cos(y), d = Math.sin(y), e = Math.cos(z), f = Math.sin(z);
  return [c*e, -c*f, d, a*f + b*e*d, a*e - b*f*d, -b*c, b*f - a*e*d, b*e + a*f*d, a*c];
}
const mm = (A, B) => { const o = new Array(9); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r*3+c] = A[r*3]*B[c] + A[r*3+1]*B[3+c] + A[r*3+2]*B[6+c]; return o; };
const mv = (A, v) => [A[0]*v[0] + A[1]*v[1] + A[2]*v[2], A[3]*v[0] + A[4]*v[1] + A[5]*v[2], A[6]*v[0] + A[7]*v[1] + A[8]*v[2]];
const add = (a, b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
const lerp3 = (a, b, t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];

const MARKERS = {
  footL:['anL',[0,-.065,.15]], footR:['anR',[0,-.065,.15]], heelL:['anL',[0,-.065,-.055]], heelR:['anR',[0,-.065,-.055]],
  kneeL:['knL',[0,0,.06]], kneeR:['knR',[0,0,.06]], handL:['wrL',[0,-.09,0]], handR:['wrR',[0,-.09,0]], elbowL:['elL',[0,0,-.04]], elbowR:['elR',[0,0,-.04]],
  sideL:['spine',[.22,.4,0]], sideR:['spine',[-.22,.4,0]], hipL:['root',[.16,-.02,0]], hipR:['root',[-.16,-.02,0]],
  head:['head',[0,.12,0]], headB:['head',[0,.02,-.1]], backU:['spine',[0,.4,-.115]], backL:['spine',[0,.15,-.11]], chest:['spine',[0,.37,.135]], belly:['spine',[0,.15,.11]],
  butt:['root',[0,-.11,-.05]], glute:['root',[0,-.03,-.115]], pelvisF:['root',[0,0,.1]]
};
function solve(n, anchor) {
  const J = {root:[0,0,0]}, R = {root:rotXYZ(n.rx*D2R, n.ry*D2R, n.rz*D2R)};
  const ch = (nm, par, off, rot) => { J[nm] = add(J[par], mv(R[par], off)); R[nm] = mm(R[par], rotXYZ(rot[0]*D2R, rot[1]*D2R, rot[2]*D2R)); };
  ch('spine', 'root', [0,.06,0], [n.sp, n.st, n.ss]); ch('neck', 'spine', [0,.53,0], [n.nk,0,0]); ch('head', 'neck', [0,.15,0], [0,0,0]);
  for (const S of LR) {
    const s = S === 'L' ? 1 : -1;
    ch('sh'+S, 'spine', [s*.2, .47 + n['shr'+S], 0], [-n['sf'+S], 0, s*n['sa'+S]]); ch('el'+S, 'sh'+S, [0,-.3,0], [-n['e'+S],0,0]); ch('wr'+S, 'el'+S, [0,-.27,0], [n['w'+S],0,0]);
    ch('hp'+S, 'root', [s*.09,-.05,0], [-n['hf'+S], 0, s*n['ha'+S]]); ch('kn'+S, 'hp'+S, [0,-.44,0], [n['k'+S],0,0]); ch('an'+S, 'kn'+S, [0,-.43,0], [n['a'+S],0,0]);
  }
  const at = (f, l) => add(J[f], mv(R[f], l));
  let dy;
  if (!anchor) { let m = 1e9; for (const k in MARKERS) { const y = at(...MARKERS[k])[1]; if (y < m) m = y; } dy = -m + n.jy; }
  else { let s = 0; anchor.m.forEach(k => s += at(...MARKERS[k])[1]); dy = anchor.y - s / anchor.m.length + n.jy; }
  for (const k in J) J[k] = [J[k][0], J[k][1] + dy, J[k][2]];
  return {J, R, at:(f, l) => add(J[f], mv(R[f], l)), mk:k => add(J[MARKERS[k][0]], mv(R[MARKERS[k][0]], MARKERS[k][1]))};
}

// ---------- anatomy (muscle ellipsoids in segment frames: [id, frame, mirror, center, size]) ----------
const MDEF = [];
for (const S of LR) {
  const s = S === 'L' ? 1 : -1, m = (id, f, c, z) => MDEF.push([id, f === 'spine' || f === 'root' ? f : f + S, [c[0]*s, c[1], c[2]], z]);
  m('chest_upper','spine',[.075,.43,.1],[.07,.032,.03]); m('chest_lower','spine',[.08,.365,.112],[.075,.045,.03]);
  [.12,.19,.26].forEach(y => m('abs','spine',[.033,y,.098],[.028,.031,.02]));
  m('obliques','spine',[.118,.18,.055],[.035,.085,.05]); m('upper_back','spine',[.06,.37,-.1],[.05,.07,.03]);
  m('lats','spine',[.12,.26,-.07],[.05,.12,.045]); m('lower_back','spine',[.035,.11,-.095],[.03,.075,.025]);
  m('delt_front','sh',[.008,-.035,.04],[.042,.06,.028]); m('delt_side','sh',[.04,-.04,0],[.03,.065,.04]); m('delt_rear','sh',[.008,-.035,-.04],[.042,.06,.028]);
  m('biceps','sh',[0,-.155,.03],[.033,.085,.026]); m('triceps','sh',[0,-.155,-.03],[.036,.095,.028]);
  m('forearms','el',[0,-.09,.008],[.036,.09,.034]);
  m('glutes','root',[.075,-.05,-.08],[.075,.085,.05]); m('hip_flexors','root',[.075,-.03,.085],[.035,.05,.022]);
  m('quads','hp',[0,-.22,.045],[.06,.16,.04]); m('hamstrings','hp',[0,-.24,-.045],[.055,.15,.04]); m('calves','kn',[0,-.12,-.035],[.042,.1,.035]);
}
MDEF.push(['traps','spine',[0,.49,-.05],[.11,.05,.05]]);
// limb cross-section profiles: [t, rX, rZ, frontBias]
const PROF = {
  pelvis:[[0,.1,.08,-.01],[.35,.15,.103,-.015],[1,.145,.1,0]],
  torso:[[0,.143,.099,0],[.25,.132,.095,.006],[.55,.158,.108,.016],[.76,.172,.114,.02],[.92,.182,.095,0],[1,.065,.058,0]],
  neck:[[0,.05,.05,0],[1,.045,.046,.005]],
  uarm:[[0,.058,.058,0],[.18,.052,.05,0],[.5,.045,.047,.004],[.86,.036,.038,0],[1,.033,.035,0]],
  farm:[[0,.036,.037,0],[.22,.041,.037,.003],[.7,.029,.025,0],[1,.023,.019,0]],
  hand:[[0,.024,.014,0],[.55,.03,.016,0],[1,.021,.013,0]],
  thigh:[[0,.086,.088,-.004],[.3,.08,.08,.006],[.7,.063,.064,.006],[.95,.05,.05,.008],[1,.047,.047,.008]],
  shin:[[0,.048,.048,.004],[.22,.052,.058,-.014],[.55,.04,.042,-.006],[.9,.028,.03,0],[1,.028,.03,0]],
  foot:[[0,.032,.034,0],[.3,.04,.04,0],[.75,.042,.028,0],[1,.03,.017,0]]
};
const COL = {skin:'#d6a07d', skinL:'#f1c6a6', skinD:'#a76c4c', line:'rgba(80,45,28,.45)', short:'#26303c', shortL:'#3d4a5a', shortD:'#141a22', shoe:'#eef1f4', shoeD:'#9aa6b2', sole:'#5b6672', hair:'#2b1e17', iron:'#3a434f', ironL:'#6b7684'};

const Stage = {
  ok:false, el:null, cv:null, ctx:null, running:false, t:0, speed:1, playing:true, anim:null, mode:'explore', hl:{prim:[], sec:[]}, sel:null, hover:null, rec:null,
  onPick:null, onPhase:null, autoRot:false, path:true, yaw:0, yawTo:0, zoom:1, fitK:0, fitX:0, fitY:0, picks:[], samples:[], supports:[], trail:null,
  init() {
    if (this.ok) return true;
    this.cv = document.createElement('canvas'); this.ctx = this.cv.getContext('2d'); if (!this.ctx) return false;
    this.cv.className = 'fig'; this.cv.style.touchAction = 'none';
    let drag = null;
    this.cv.addEventListener('pointerdown', e => { drag = {x:e.clientX, y:e.clientY, yaw:this.yawTo, moved:false}; this.cv.setPointerCapture(e.pointerId); });
    this.cv.addEventListener('pointermove', e => {
      if (drag && (e.buttons || e.pointerType !== 'mouse')) { const dx = e.clientX - drag.x; if (Math.abs(dx) > 4) { drag.moved = true; this.autoRot = false; this.yawTo = drag.yaw - dx * .012; this.yaw = this.yawTo; } return; }
      if (e.pointerType === 'mouse') { const id = this.pick(e); if (id !== this.hover) { this.hover = id; this.cv.style.cursor = id ? 'pointer' : 'grab'; } this.showTip(id, e); }
    });
    this.cv.addEventListener('pointerup', e => { if (drag && !drag.moved) { const id = this.pick(e); if (this.onPick) this.onPick(id); } drag = null; });
    this.cv.addEventListener('pointerleave', () => { this.hover = null; this.showTip(null); });
    this.cv.addEventListener('wheel', e => { e.preventDefault(); this.zoom = clamp(this.zoom * (e.deltaY > 0 ? .92 : 1.08), .6, 2.6); }, {passive:false});
    this.ro = new ResizeObserver(() => this.resize());
    this.ok = true; this.theme(); return true;
  },
  theme() {
    const cs = getComputedStyle(document.documentElement), c = k => cs.getPropertyValue(k).trim() || '#888';
    this.col = {prim:c('--m-prim'), sec:c('--m-sec'), base:c('--m-base'), accent:c('--accent'), ink:c('--ink'), muted:c('--muted'), line:c('--line'), good:c('--good'), warn:c('--warn'), bad:c('--bad'), surface2:c('--surface2')};
  },
  mount(el, opts = {}) {
    if (!this.init()) { el.innerHTML = '<div class="stage-fail">تعذّر تشغيل العرض على هذا الجهاز. بقية الموقع يعمل.</div>'; return false; }
    if (this.el && this.el !== el) this.ro.unobserve(this.el);
    this.el = el; el.prepend(this.cv);
    this.tip = document.createElement('div'); this.tip.className = 'stage-tip'; this.tip.hidden = true; el.appendChild(this.tip);
    this.selTag = document.createElement('div'); this.selTag.className = 'stage-tag'; this.selTag.hidden = true; el.appendChild(this.selTag);
    this.ro.observe(el); this.resize();
    this.mode = opts.mode || 'explore'; this.onPick = opts.onPick || null; this.autoRot = !!opts.autoRot; this.zoom = 1;
    this.sel = null; this.rec = opts.rec || null; this.hl = {prim:[], sec:[]};
    if (this.mode === 'explore') { this.setAnim(null); this.view(opts.view || 'front', true); }
    if (!this.running) { this.running = true; this.last = performance.now(); requestAnimationFrame(t => this.loop(t)); }
    return true;
  },
  unmount() { this.running = false; if (this.el) this.ro.unobserve(this.el); this.el = null; },
  resize() { if (!this.el) return; const d = Math.min(window.devicePixelRatio || 1, 2); this.dpr = d; this.cv.width = Math.max(1, this.el.clientWidth * d); this.cv.height = Math.max(1, this.el.clientHeight * d); this.fit(); },
  view(name, instant) {
    const Y = {front:0, back:Math.PI, right:Math.PI / 2, side:Math.PI / 2, left:-Math.PI / 2, three:Math.PI / 4}[name] ?? 0;
    let target = Y; while (target - this.yaw > Math.PI) target -= 2 * Math.PI; while (target - this.yaw < -Math.PI) target += 2 * Math.PI;
    this.yawTo = target; if (instant) this.yaw = target;
  },
  setAnim(ex, opts = {}) {
    this.fault = !!opts.fault;
    this.anim = ex ? compileAnim(ex, this.fault) : null;
    if (!opts.keepT) this.t = 0;
    this.eqKind = null; this.supports = []; this.samples = [];
    const idle = normPose({sa:10});
    const frames = this.anim ? Array.from({length:24}, (_, i) => poseAt(this.anim, i / 24)) : [idle];
    frames.forEach(f => { const s = solve(f, this.anim && this.anim.anchor); this.samples.push(Object.values(s.J).concat(Object.keys(MARKERS).map(s.mk))); });
    if (this.anim) {
      const eq = ex.eq[0], noHands = ['bridge','crunch','legraise','plank','sideplank','quad','clam','abduct','legext','legpress','stretch','stretch2','knees','jack','rope','skater','burpee','climber','pushup','pike','prone','nordic','swings','circles','rotate','inchworm','box','bandwalk','kickback','rollout','taps','vup','flutter','heeltap','bearhold','tuck','buttkick','shuffle','rotstretch','hipcircle','sideleg','jumplunge'].includes(ex.pat);
      if (this.anim.props && this.anim.props.includes('handbar')) this.eqKind = 'bar';
      else if (!noHands) this.eqKind = ex.po && ex.po.arms === 'goblet' ? 'kb' : {db:'db', bb:'bar', kb:'kb'}[eq] || null;
      this.anim.sup.forEach(s => { const sv = solve(this.anim.frames[s.f] || this.anim.frames[0], this.anim.anchor); const pts = s.m.map(sv.mk), c = pts.reduce((a, p) => add(a, p), [0,0,0]).map(v => v / pts.length); this.supports.push({...s, c}); });
      this.trail = Array.from({length:49}, (_, i) => solve(poseAt(this.anim, i / 48), this.anim.anchor).mk(this.anim.track));
      this.hl = {prim:ex.prim, sec:ex.sec};
      if (opts.view !== false) this.view(opts.view || this.anim.view, opts.instant);
    }
    this.fit(true);
  },
  setHL(h) { this.hl = h; },
  fit(instant) {
    if (!this.cv || !this.samples.length) return;
    const c = Math.cos(this.yaw), s = Math.sin(this.yaw); let x0 = 1e9, x1 = -1e9, y1 = 0;
    this.samples.forEach(list => list.forEach(p => { const x = p[0]*c + p[2]*s; if (x < x0) x0 = x; if (x > x1) x1 = x; if (p[1] > y1) y1 = p[1]; }));
    this.supports.forEach(sp => { if (sp.kind === 'bar') y1 = Math.max(y1, sp.c[1] + .1); });
    const W = this.cv.width, H = this.cv.height, w = (x1 - x0) + .5, h = y1 + .35;
    const k = Math.min(W / w, H / h) * .92;
    const tk = k, tx = W / 2 - (x0 + x1) / 2 * k, ty = H * .92;
    if (instant || !this.fitK) { this.fitK = tk; this.fitX = tx; this.fitY = ty; } else { this.fitK += (tk - this.fitK) * .1; this.fitX += (tx - this.fitX) * .1; this.fitY += (ty - this.fitY) * .1; }
  },
  loop(ts) {
    if (!this.running) return;
    requestAnimationFrame(t => this.loop(t));
    const dt = Math.min(.05, (ts - this.last) / 1000); this.last = ts;
    if (!this.el || !this.el.isConnected) return;
    let pose, act = 0;
    if (this.anim) {
      if (this.playing) this.t += dt * this.speed / this.anim.dur;
      pose = poseAt(this.anim, this.t); const ph = phaseAt(this.anim, this.t); act = ph.act; if (this.onPhase) this.onPhase(ph);
    } else { const b = Math.sin(ts / 1100); pose = normPose({sa:9 + b, sp:b * .4, nk:-b * .4}); }
    if (this.autoRot) this.yawTo += dt * .35;
    this.yaw += (this.yawTo - this.yaw) * Math.min(1, dt * 7);
    this.fit();
    this.draw(solve(pose, this.anim && this.anim.anchor), act);
  },
  // ---------- drawing ----------
  draw(sk, act) {
    const g = this.ctx, W = this.cv.width, H = this.cv.height, d = this.dpr || 1, cy = Math.cos(this.yaw), sy = Math.sin(this.yaw);
    const k = this.fitK * this.zoom, ox = W / 2 + (this.fitX - W / 2) * this.zoom, oy = this.fitY - (this.zoom - 1) * H * .35;
    const P = p => [ox + k * (p[0]*cy + p[2]*sy), oy - k * p[1]];
    const V = v => [v[0]*cy + v[2]*sy, -v[1]];
    const depth = p => -p[0]*sy + p[2]*cy;
    this.P = P; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
    // floor + shadow
    const root = P(sk.J.root), fy = oy;
    const fg = g.createLinearGradient(0, fy, 0, H); fg.addColorStop(0, 'rgba(120,130,145,.16)'); fg.addColorStop(1, 'rgba(120,130,145,0)');
    g.fillStyle = fg; g.fillRect(0, fy, W, H - fy);
    g.strokeStyle = 'rgba(120,130,145,.35)'; g.lineWidth = d; g.beginPath(); g.moveTo(W * .06, fy); g.lineTo(W * .94, fy); g.stroke();
    const sh = g.createRadialGradient(root[0], fy, 0, root[0], fy, k * .5); sh.addColorStop(0, 'rgba(0,0,0,.22)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    g.save(); g.translate(root[0], fy); g.scale(1, .12); g.fillStyle = sh; g.beginPath(); g.arc(0, 0, k * .5, 0, Math.PI * 2); g.fill(); g.restore();
    this.picks = [];
    const items = [];
    const push = (dz, fn) => items.push({dz, fn});
    // supports (bench, boxes) first
    this.supports.forEach(s => { if (s.kind === 'box') this.box(g, P, V, s.c, s.w, s.d, depth); });
    // trail
    if (this.path && this.trail) { g.save(); g.strokeStyle = this.col.accent; g.globalAlpha = .55; g.setLineDash([5 * d, 5 * d]); g.lineWidth = 2 * d; g.beginPath(); this.trail.forEach((p, i) => { const q = P(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.stroke(); g.restore(); }
    // bars behind hands
    this.supports.forEach(s => { if (s.kind === 'bar' || s.kind === 'bars') this.bars(g, P, s, d); });
    const J = sk.J, R = sk.R, seg = (f, a, b) => [sk.at(f, a), sk.at(f, b)];
    const limb = (f, A, B, prof, kind, mus, bias = 0, axes) => push(depth(lerp3(A, B, .5)) + bias, () => { this.limb(g, P, V, A, B, R[f], prof, kind, axes); this.muscles(g, P, V, sk, f, mus, act, depth); });
    push(depth(J.spine), () => { const [a, b] = seg('spine', [0, -.04, 0], [0, .53, 0]); this.limb(g, P, V, a, b, R.spine, PROF.torso, 'skin', null, 2); this.muscles(g, P, V, sk, 'spine', true, act, depth); });
    push(depth(J.root) + .001, () => { const [a, b] = seg('root', [0, -.13, 0], [0, .05, 0]); this.limb(g, P, V, a, b, R.root, PROF.pelvis, 'short', null, 1); this.muscles(g, P, V, sk, 'root', true, act, depth); });
    { const [a, b] = seg('neck', [0, -.01, 0], [0, .1, 0]); limb('neck', a, b, PROF.neck, 'skin', false, .02); }
    push(depth(J.head) + .03, () => this.head(g, P, V, sk, depth));
    for (const S of LR) {
      { const [a, b] = seg('sh'+S, [0, .01, 0], [0, -.3, 0]); limb('sh'+S, a, b, PROF.uarm, 'skin', true, .02); }
      { const [a, b] = seg('el'+S, [0, 0, 0], [0, -.27, 0]); limb('el'+S, a, b, PROF.farm, 'skin', true, .022); }
      { const [a, b] = seg('wr'+S, [0, 0, 0], [0, -.1, 0]); limb('wr'+S, a, b, PROF.hand, 'skin', false, .024); }
      { const [a, b] = seg('hp'+S, [0, .02, 0], [0, -.44, 0]); limb('hp'+S, a, b, PROF.thigh, 'thigh', true, .01); }
      { const [a, b] = seg('kn'+S, [0, 0, 0], [0, -.43, 0]); push(depth(lerp3(a, b, .5)) + .011, () => { this.limb(g, P, V, a, b, R['kn'+S], PROF.shin, 'skin'); this.kneecap(g, P, V, sk, S, depth); this.muscles(g, P, V, sk, 'kn'+S, true, act, depth); }); }
      { const [a, b] = seg('an'+S, [0, -.05, -.06], [0, -.05, .16]); limb('an'+S, a, b, PROF.foot, 'shoe', false, .012, [[1,0,0],[0,1,0]]); }
      if (this.eqKind === 'db') push(depth(sk.mk('hand'+S)) + .03, () => this.dumbbell(g, P, V, sk, S, depth));
    }
    if (this.eqKind === 'bar') this.barbell(push, g, P, V, sk, depth);
    if (this.eqKind === 'kb') push(depth(lerp3(sk.mk('handL'), sk.mk('handR'), .5)) + .04, () => this.kettlebell(g, P, sk));
    items.sort((a, b) => a.dz - b.dz).forEach(i => i.fn());
    // selected muscle tag
    if (this.sel && this.selTag && this.selPos) { this.selTag.hidden = false; this.selTag.textContent = MUSCLES[this.sel].ar; this.selTag.style.left = (this.selPos[0] / d) + 'px'; this.selTag.style.top = (this.selPos[1] / d - 14) + 'px'; }
    else if (this.selTag) this.selTag.hidden = true;
    this.selPos = null;
  },
  limb(g, P, V, A, B, Rf, prof, kind, axes, caps = 3) {
    const d = this.dpr || 1, k = this.fitK * this.zoom, a = P(A), b = P(B);
    let dx = b[0] - a[0], dy = b[1] - a[1]; const L = Math.hypot(dx, dy) || 1e-6; dx /= L; dy /= L;
    const p = [-dy, dx];
    const ax1 = V(mv(Rf, axes ? axes[0] : [1,0,0])), ax2 = V(mv(Rf, axes ? axes[1] : [0,0,1])), zv = mv(Rf, axes ? axes[1] : [0,0,1]);
    const n = 14, left = [], right = [], cs = [], hs = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n; let j = 0; while (j < prof.length - 2 && prof[j + 1][0] < t) j++;
      const p0 = prof[j], p1 = prof[j + 1], u = clamp((t - p0[0]) / (p1[0] - p0[0] || 1), 0, 1), sm = u * u * (3 - 2 * u);
      const rX = p0[1] + (p1[1] - p0[1]) * sm, rZ = p0[2] + (p1[2] - p0[2]) * sm, zb = p0[3] + (p1[3] - p0[3]) * sm;
      const c = P(add(lerp3(A, B, t), zv.map(v => v * zb)));
      const h = k * Math.hypot(rX * (ax1[0]*p[0] + ax1[1]*p[1]), rZ * (ax2[0]*p[0] + ax2[1]*p[1]));
      cs.push(c); hs.push(h); left.push([c[0] + p[0]*h, c[1] + p[1]*h]); right.push([c[0] - p[0]*h, c[1] - p[1]*h]);
    }
    const ang = Math.atan2(dy, dx);
    const path = new Path2D();
    path.moveTo(left[0][0], left[0][1]);
    for (let i = 1; i <= n; i++) path.lineTo(left[i][0], left[i][1]);
    if (caps & 2) path.arc(cs[n][0], cs[n][1], hs[n], ang + Math.PI / 2, ang - Math.PI / 2, true);
    for (let i = n; i >= 0; i--) path.lineTo(right[i][0], right[i][1]);
    if (caps & 1) path.arc(cs[0][0], cs[0][1], hs[0], ang - Math.PI / 2, ang + Math.PI / 2, true);
    path.closePath();
    const m = cs[n >> 1], hm = hs[n >> 1] || 1, lit = (p[0] * -.6 + p[1] * -.8) > 0 ? 1 : -1;
    const gr = g.createLinearGradient(m[0] + p[0]*hm*lit, m[1] + p[1]*hm*lit, m[0] - p[0]*hm*lit, m[1] - p[1]*hm*lit);
    const pal = kind === 'short' ? [COL.shortL, COL.short, COL.shortD] : kind === 'shoe' ? ['#ffffff', COL.shoe, COL.shoeD] : [COL.skinL, COL.skin, COL.skinD];
    gr.addColorStop(0, pal[0]); gr.addColorStop(.42, pal[1]); gr.addColorStop(1, pal[2]);
    g.fillStyle = gr; g.fill(path);
    if (kind === 'thigh') { // shorts over the upper thigh
      g.save(); g.clip(path); const sg = g.createLinearGradient(m[0] + p[0]*hm*lit, m[1] + p[1]*hm*lit, m[0] - p[0]*hm*lit, m[1] - p[1]*hm*lit); sg.addColorStop(0, COL.shortL); sg.addColorStop(.45, COL.short); sg.addColorStop(1, COL.shortD);
      g.fillStyle = sg; g.beginPath(); const e = cs[6], q = 4 * hm; g.moveTo(cs[0][0] - dx * q, cs[0][1] - dy * q); g.lineTo(e[0] + p[0]*q, e[1] + p[1]*q); g.lineTo(e[0] - p[0]*q, e[1] - p[1]*q); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1.5 * d; g.beginPath(); g.moveTo(e[0] + p[0]*hs[6], e[1] + p[1]*hs[6]); g.lineTo(e[0] - p[0]*hs[6], e[1] - p[1]*hs[6]); g.stroke(); g.restore();
    }
    if (kind === 'shoe') { g.save(); g.clip(path); g.fillStyle = COL.sole; const bt = this.P([0, 0, 0]); g.fillRect(0, bt[1] - 4 * d, this.cv.width, 10 * d); g.restore(); }
    g.strokeStyle = kind === 'short' || kind === 'shoe' ? 'rgba(0,0,0,.35)' : COL.line; g.lineWidth = 1.1 * d; g.stroke(path);
    this.picks.push({path, id:null});
  },
  muscles(g, P, V, sk, frame, show, act, depth) {
    if (!show) return;
    const k = this.fitK * this.zoom, d = this.dpr || 1, C = this.col, explore = this.mode === 'explore';
    const prim = this.hl.prim || [], sec = this.hl.sec || [];
    MDEF.forEach(([id, f, c, z]) => {
      if (f !== frame) return;
      const R = sk.R[f], ctr = sk.at(f, c), nrm = mv(R, Math.hypot(c[0], c[2]) > .01 ? [c[0], 0, c[2]] : [0, 0, 1]);
      const nl = Math.hypot(...nrm) || 1, face = (-nrm[0] * Math.sin(this.yaw) + nrm[2] * Math.cos(this.yaw)) / nl;
      const wrap = Math.hypot(c[0], c[2]) < .02;
      if (!wrap && face < -.05) return;
      const al = wrap ? 1 : clamp((face + .05) / .45, 0, 1);
      // projected ellipse of the ellipsoid
      const ax = [V(mv(R, [z[0], 0, 0])), V(mv(R, [0, z[1], 0])), V(mv(R, [0, 0, z[2]]))];
      let a = 0, b = 0, cc = 0; ax.forEach(v => { a += v[0]*v[0]; b += v[0]*v[1]; cc += v[1]*v[1]; });
      const tr = (a + cc) / 2, df = Math.sqrt(((a - cc) / 2) ** 2 + b * b), l1 = Math.sqrt(tr + df) * k, l2 = Math.sqrt(Math.max(tr - df, 1e-6)) * k, rot = .5 * Math.atan2(2 * b, a - cc);
      const q = P(ctr), path = new Path2D(); path.ellipse(q[0], q[1], l1 * .92, l2 * .92, rot, 0, Math.PI * 2);
      let fill = null, alpha = 0;
      if (this.rec) { const r = this.rec[id]; fill = r == null ? C.base : r < 24 ? C.bad : r < 48 ? C.warn : C.good; alpha = .62; }
      else if (explore) { fill = C.base; alpha = .5; }
      if (sec.includes(id)) { fill = C.sec; alpha = .5 + .2 * act; }
      if (prim.includes(id)) { fill = C.prim; alpha = .55 + .35 * act; }
      if (this.sel === id) { fill = C.prim; alpha = .92; this.selPos = q; }
      if (this.hover === id) alpha = Math.min(1, alpha + .25);
      g.save(); g.globalAlpha = al;
      if (fill) {
        const rg = g.createRadialGradient(q[0] - l1 * .2, q[1] - l2 * .3, 0, q[0], q[1], Math.max(l1, l2));
        rg.addColorStop(0, fill); rg.addColorStop(1, fill + '00'.slice(0, 0)); g.globalAlpha = al * alpha; g.fillStyle = rg; g.fill(path);
        g.globalAlpha = al * alpha * .7; g.strokeStyle = fill; g.lineWidth = 1 * d; g.stroke(path);
      } else if (!['glutes', 'hip_flexors'].includes(id)) { // subtle anatomical definition on bare skin
        g.globalAlpha = al * .22; g.strokeStyle = COL.skinD; g.lineWidth = 1.2 * d; g.stroke(path);
      }
      g.restore();
      this.picks.push({path, id});
    });
  },
  kneecap(g, P, V, sk, S, depth) {
    const c = sk.at('kn'+S, [0, -.005, .045]), n = mv(sk.R['kn'+S], [0, 0, 1]), f = -n[0] * Math.sin(this.yaw) + n[2] * Math.cos(this.yaw); if (f < .1) return;
    const q = P(c), k = this.fitK * this.zoom; g.save(); g.globalAlpha = .35 * f; g.fillStyle = COL.skinL; g.beginPath(); g.ellipse(q[0], q[1], .022 * k, .028 * k, 0, 0, Math.PI * 2); g.fill(); g.restore();
  },
  head(g, P, V, sk, depth) {
    const k = this.fitK * this.zoom, d = this.dpr || 1, R = sk.R.head, c = sk.at('head', [0, .01, 0]), q = P(c);
    const up = V(mv(R, [0, 1, 0])), rot = Math.atan2(up[0], -up[1]);
    const fwd = mv(R, [0, 0, 1]), fd = -fwd[0] * Math.sin(this.yaw) + fwd[2] * Math.cos(this.yaw);
    const ell = (p, rx, ry, fill, stroke) => { g.beginPath(); g.ellipse(p[0], p[1], rx * k, ry * k, rot, 0, Math.PI * 2); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1.1 * d; g.stroke(); } };
    // hair (full head), then face/skin area pushed toward the face direction
    const hg = g.createRadialGradient(q[0] - .03 * k, q[1] - .04 * k, 0, q[0], q[1], .13 * k); hg.addColorStop(0, '#4a3529'); hg.addColorStop(1, COL.hair);
    ell(q, .094, .116, hg, 'rgba(0,0,0,.4)');
    const vis = f => { const w = mv(R, f), n = Math.hypot(...f) || 1; return (-w[0] * Math.sin(this.yaw) + w[2] * Math.cos(this.yaw)) / n; };
    const L = l => P(sk.at('head', l));
    // ears
    [1, -1].forEach(s => { const v = vis([s, 0, 0]); if (v > -.2) { const e = L([s * .09, -.005, -.005]); ell(e, .018, .03, COL.skin, COL.line); } });
    if (fd > -.45) {
      const fc = L([0, -.018, .03 * clamp(fd + .5, 0, 1)]);
      const sg = g.createRadialGradient(fc[0] - .025 * k, fc[1] - .03 * k, 0, fc[0], fc[1], .11 * k); sg.addColorStop(0, COL.skinL); sg.addColorStop(.6, COL.skin); sg.addColorStop(1, COL.skinD);
      g.save(); g.beginPath(); g.ellipse(q[0], q[1], .094 * k, .116 * k, rot, 0, Math.PI * 2); g.clip();
      ell(fc, .088, .102, sg); g.restore();
      // facial features
      const feat = [];
      [1, -1].forEach(s => { if (vis([s * .35, .1, 1]) > .25) feat.push(() => { const e = L([s * .033, .012, .09]), b = L([s * .034, .036, .088]); ell(e, .011, .006, '#ffffff'); ell(e, .006, .0055, '#2e1f18'); g.strokeStyle = COL.hair; g.lineWidth = 2.2 * d; g.beginPath(); const b1 = L([s * .05, .034, .084]), b2 = L([s * .018, .04, .09]); g.moveTo(b1[0], b1[1]); g.lineTo(b2[0], b2[1]); g.stroke(); }); });
      if (vis([0, -.1, 1]) > .05) feat.push(() => { const n1 = L([0, .01, .1]), n2 = L([0, -.024, .112]), n3 = L([.008, -.03, .1]); g.strokeStyle = COL.skinD; g.lineWidth = 1.6 * d; g.beginPath(); g.moveTo(n1[0], n1[1]); g.lineTo(n2[0], n2[1]); g.lineTo(n3[0], n3[1]); g.stroke(); });
      if (vis([0, -.3, 1]) > .1) feat.push(() => { const m1 = L([-.022, -.056, .088]), m2 = L([0, -.06, .094]), m3 = L([.022, -.056, .088]); g.strokeStyle = '#8a4a3a'; g.lineWidth = 1.8 * d; g.beginPath(); g.moveTo(m1[0], m1[1]); g.quadraticCurveTo(m2[0], m2[1], m3[0], m3[1]); g.stroke(); });
      feat.forEach(f => f());
    }
    this.picks.push({path:(() => { const p = new Path2D(); p.ellipse(q[0], q[1], .094 * k, .116 * k, rot, 0, Math.PI * 2); return p; })(), id:null});
  },
  dumbbell(g, P, V, sk, S, depth) {
    const k = this.fitK * this.zoom, R = sk.R['wr'+S], c = sk.at('wr'+S, [0, -.065, .0]);
    const ax = mv(R, [1, 0, 0]), ends = [-1, 1].map(s => add(c, ax.map(v => v * s * .09)));
    const a = P(ends[0]), b = P(ends[1]); g.strokeStyle = COL.iron; g.lineWidth = .022 * k; g.lineCap = 'round'; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    ends.forEach(e => this.plate(g, P, e, ax, .05, .035));
  },
  plate(g, P, c, axis, r, thick) {
    const k = this.fitK * this.zoom, d = this.dpr || 1, q = P(c), av = [axis[0]*Math.cos(this.yaw) + axis[2]*Math.sin(this.yaw), -axis[1]];
    const facing = Math.abs(-axis[0] * Math.sin(this.yaw) + axis[2] * Math.cos(this.yaw)), al = Math.hypot(av[0], av[1]);
    const rot = Math.atan2(av[1], av[0]);
    g.save(); g.translate(q[0], q[1]); g.rotate(rot);
    const gr = g.createLinearGradient(0, -r * k, 0, r * k); gr.addColorStop(0, COL.ironL); gr.addColorStop(1, COL.iron);
    g.fillStyle = gr; g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = d;
    g.beginPath(); g.ellipse(0, 0, Math.max(thick * k * .5, r * k * facing * .98 + thick * k * al * .5), r * k, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.restore();
  },
  barbell(push, g, P, V, sk, depth) {
    const hL = sk.mk('handL'), hR = sk.mk('handR'), mid = lerp3(hL, hR, .5);
    let ax = [hL[0] - hR[0], hL[1] - hR[1], hL[2] - hR[2]]; let l = Math.hypot(...ax);
    if (l < .15) { ax = mv(sk.R.spine, [1, 0, 0]); l = 1; } ax = ax.map(v => v / l);
    const e1 = add(mid, ax.map(v => v * .8)), e2 = add(mid, ax.map(v => -v * .8)), k = this.fitK * this.zoom;
    const shaft = () => { const a = P(e1), b = P(e2); g.strokeStyle = COL.iron; g.lineWidth = .02 * k; g.lineCap = 'round'; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); };
    push(depth(mid) + .025, shaft);
    [e1, e2].forEach(e => { const pc = add(e, ax.map(v => -v * .14 * Math.sign((e[0] - mid[0]) * ax[0] + (e[1] - mid[1]) * ax[1] + (e[2] - mid[2]) * ax[2]))); push(depth(pc) + .026, () => this.plate(g, P, pc, ax, .2, .05)); });
  },
  kettlebell(g, P, sk) {
    const k = this.fitK * this.zoom, c = lerp3(sk.mk('handL'), sk.mk('handR'), .5), q = P([c[0], c[1] - .08, c[2]]);
    const gr = g.createRadialGradient(q[0] - .03 * k, q[1] - .03 * k, 0, q[0], q[1], .1 * k); gr.addColorStop(0, COL.ironL); gr.addColorStop(1, COL.iron);
    g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], .08 * k, 0, Math.PI * 2); g.fill();
    g.strokeStyle = COL.iron; g.lineWidth = .018 * k; g.beginPath(); g.arc(q[0], q[1] - .08 * k, .04 * k, Math.PI, 0); g.stroke();
  },
  box(g, P, V, c, w, dd, depth) {
    const h = Math.max(.05, c[1] - .02), x = c[0], z = c[2], hw = w / 2, hd = dd / 2;
    const C = [[x-hw,0,z-hd],[x+hw,0,z-hd],[x+hw,0,z+hd],[x-hw,0,z+hd],[x-hw,h,z-hd],[x+hw,h,z-hd],[x+hw,h,z+hd],[x-hw,h,z+hd]];
    const faces = [[4,5,6,7,'#9aa5b1'],[0,1,5,4,'#6f7a87'],[1,2,6,5,'#7d8895'],[2,3,7,6,'#6f7a87'],[3,0,4,7,'#7d8895']];
    const ctr = [x, h / 2, z];
    faces.map(f => { const cen = [0, 1, 2].map(i => (C[f[0]][i] + C[f[2]][i]) / 2); return {f, dz:depth(cen), out:depth(cen) - depth(ctr)}; })
      .filter(o => o.f[4] === '#9aa5b1' || o.out > .001).sort((a, b) => a.dz - b.dz)
      .forEach(({f}) => { g.beginPath(); f.slice(0, 4).forEach((i, j) => { const q = P(C[i]); j ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.closePath(); g.fillStyle = f[4]; g.fill(); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = this.dpr || 1; g.stroke(); });
  },
  bars(g, P, s, d) {
    const k = this.fitK * this.zoom; g.strokeStyle = COL.iron; g.lineCap = 'round'; g.lineWidth = .03 * k;
    const line = (a, b) => { const p = P(a), q = P(b); g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); };
    if (s.kind === 'bar') line([-.65, s.c[1] + .02, s.c[2]], [.65, s.c[1] + .02, s.c[2]]);
    else [-1, 1].forEach(x => line([x * .26, s.c[1], s.c[2] - .5], [x * .26, s.c[1], s.c[2] + .5]));
  },
  pick(e) {
    const r = this.cv.getBoundingClientRect(), d = this.dpr || 1, x = (e.clientX - r.left) * d, y = (e.clientY - r.top) * d;
    for (let i = this.picks.length - 1; i >= 0; i--) if (this.ctx.isPointInPath(this.picks[i].path, x, y)) { return this.picks[i].id; }
    return null;
  },
  showTip(id, e) {
    if (!this.tip) return;
    if (!id) { this.tip.hidden = true; return; }
    const rc = this.el.getBoundingClientRect();
    this.tip.hidden = false; this.tip.textContent = MUSCLES[id].ar + (S.prefs.en ? ' · ' + MUSCLES[id].en : '');
    this.tip.style.left = (e.clientX - rc.left) + 'px'; this.tip.style.top = (e.clientY - rc.top - 34) + 'px';
  }
};
