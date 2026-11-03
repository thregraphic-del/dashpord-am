// 3D stage: procedural anatomical mannequin, pose engine, demo player
const D2R = Math.PI / 180;
const LR = ['L', 'R'];
function normPose(p) {
  const n = {rx:p.rx||0, ry:p.ry||0, rz:p.rz||0, sp:p.sp||0, st:p.st||0, ss:p.ss||0, nk:p.nk||0, shrL:p.shrL??p.shr??0, shrR:p.shrR??p.shr??0, jy:p.jy||0};
  for (const S of LR) {
    const g = (k, d = 0) => p[k + S] !== undefined ? p[k + S] : (p[k] !== undefined ? p[k] : d);
    n['sf'+S] = g('sf'); n['sa'+S] = g('sa', 8); n['e'+S] = g('e', 4); n['w'+S] = g('w');
    n['hf'+S] = g('hf'); n['ha'+S] = g('ha'); n['k'+S] = g('k');
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
  let raw = def.f.map(x => ({...x}));
  let ft = null;
  if (fault) {
    ft = def.fault || {t:'مدى حركة ناقص (نصف التكرار)', rom:.5};
    const idx = ft.i || raw.map((_, i) => i).filter(i => i > 0);
    if (ft.m) idx.forEach(i => { raw[i] = {...raw[i], ...ft.m}; });
  }
  let frames = raw.map(normPose);
  if (ft && ft.rom) frames = frames.map((f, i) => i === 0 ? f : lerpPose(frames[0], f, ft.rom));
  return {ex, frames, dur:def.dur || 3, view:def.view || 'side', hold:!!def.hold, anchor:def.anchor || null, sup:def.sup || [], props:def.props || null, track:def.track || 'handL', faultText:ft ? ft.t : (def.fault ? def.fault.t : 'مدى حركة ناقص'), hasFault:!!def.fault};
}
function poseAt(A, t) {
  const n = A.frames.length; if (n === 1) return A.frames[0];
  const x = ((t % 1) + 1) % 1 * n, i = Math.floor(x); let u = x - i; u = .5 - .5 * Math.cos(Math.PI * u);
  return lerpPose(A.frames[i], A.frames[(i + 1) % n], u);
}
function phaseAt(A, t) {
  if (A.hold) return {name:'ثبات', act:.7};
  const n = A.frames.length, x = ((t % 1) + 1) % 1 * n, i = Math.floor(x), u = x - i;
  if (n === 2) {
    if (i === 0) return {name: u < .12 ? 'وضع البداية' : u > .88 ? 'وضع النهاية' : 'مرحلة الحركة', act:u};
    return {name: u > .88 ? 'وضع البداية' : 'مرحلة العودة', act:1 - u};
  }
  return {name:'الحركة ' + (i + 1) + ' من ' + n, act:.55 + .35 * Math.sin(u * Math.PI)};
}

function buildFigure() {
  const T = THREE, j = {}, mk = {}, mus = {}, musM = {}, meshes = [];
  const skinM = new T.MeshStandardMaterial({color:0xc9d0d8, roughness:.62, metalness:.04});
  for (const id in MUSCLES) musM[id] = new T.MeshStandardMaterial({color:0xd7a9a2, roughness:.45, metalness:.02, emissive:0x000000});
  const G = () => new T.Group();
  const add = (m, p) => { p.add(m); meshes.push(m); return m; };
  const cap = (r, l, p, y, sx = 1, sz = 1) => { const m = new T.Mesh(new T.CapsuleGeometry(r, l, 6, 16), skinM); m.position.y = y; m.scale.set(sx, 1, sz); return add(m, p); };
  const sph = new T.SphereGeometry(1, 22, 16);
  const ball = (p, pos, sc, mat = skinM) => { const m = new T.Mesh(sph, mat); m.position.set(...pos); m.scale.set(...sc); return add(m, p); };
  const muscle = (id, p, pos, sc, rz = 0) => { const m = ball(p, pos, sc, musM[id]); m.rotation.z = rz; m.userData.mid = id; (mus[id] = mus[id] || []).push(m); return m; };
  const marker = (n, p, x, y, z) => { const o = new T.Object3D(); o.position.set(x, y, z); p.add(o); mk[n] = o; };
  const root = G(); j.root = root;
  ball(root, [0, 0, 0], [.16, .11, .105]);
  const spine = G(); spine.position.y = .06; root.add(spine); j.spine = spine;
  cap(.125, .3, spine, .27, 1.28, .82);
  ball(spine, [0, .07, 0], [.15, .09, .1]);
  const neck = G(); neck.position.y = .53; spine.add(neck); j.neck = neck;
  cap(.045, .06, neck, .04);
  const head = G(); head.position.y = .15; neck.add(head);
  ball(head, [0, 0, 0], [.095, .115, .105]);
  for (const S of LR) {
    const s = S === 'L' ? 1 : -1;
    const sh = G(); sh.position.set(s * .2, .47, 0); spine.add(sh); j['sh'+S] = sh;
    ball(sh, [0, -.01, 0], [.055, .055, .055]);
    cap(.042, .2, sh, -.15);
    const el = G(); el.position.y = -.3; sh.add(el); j['el'+S] = el;
    ball(el, [0, 0, 0], [.04, .04, .04]); cap(.036, .19, el, -.13);
    const wr = G(); wr.position.y = -.27; el.add(wr); j['wr'+S] = wr;
    ball(wr, [0, -.05, 0], [.035, .06, .022]);
    const hp = G(); hp.position.set(s * .09, -.05, 0); root.add(hp); j['hp'+S] = hp;
    cap(.062, .3, hp, -.22);
    const kn = G(); kn.position.y = -.44; hp.add(kn); j['kn'+S] = kn;
    ball(kn, [0, 0, 0], [.055, .055, .055]); cap(.047, .3, kn, -.21);
    const an = G(); an.position.y = -.43; kn.add(an); j['an'+S] = an;
    ball(an, [0, 0, 0], [.04, .04, .04]); const foot = new T.Mesh(new T.BoxGeometry(.085, .055, .22), skinM); foot.position.set(0, -.035, .05); add(foot, an);
    // muscles
    muscle('chest_upper', spine, [s*.07, .43, .085], [.068, .035, .04]);
    muscle('chest_lower', spine, [s*.075, .36, .088], [.075, .045, .042]);
    [.11, .18, .25].forEach(y => muscle('abs', spine, [s*.032, y, .092], [.03, .032, .022]));
    muscle('obliques', spine, [s*.105, .17, .05], [.04, .085, .055], s * -.15);
    muscle('upper_back', spine, [s*.06, .37, -.088], [.05, .07, .03]);
    muscle('lats', spine, [s*.11, .25, -.07], [.055, .12, .045], s * .2);
    muscle('lower_back', spine, [s*.035, .11, -.09], [.03, .075, .025]);
    muscle('delt_front', sh, [s*.005, -.03, .04], [.04, .06, .03]);
    muscle('delt_side', sh, [s*.035, -.04, 0], [.03, .065, .042]);
    muscle('delt_rear', sh, [s*.005, -.03, -.04], [.04, .06, .03]);
    muscle('biceps', sh, [0, -.15, .03], [.034, .085, .03]);
    muscle('triceps', sh, [0, -.15, -.03], [.037, .095, .03]);
    muscle('forearms', el, [0, -.1, 0], [.041, .1, .039]);
    muscle('glutes', root, [s*.075, -.05, -.075], [.075, .085, .06]);
    muscle('hip_flexors', root, [s*.075, -.03, .075], [.035, .05, .025]);
    muscle('quads', hp, [0, -.2, .032], [.062, .17, .045]);
    muscle('hamstrings', hp, [0, -.22, -.035], [.058, .16, .042]);
    muscle('calves', kn, [0, -.12, -.03], [.045, .1, .04]);
    marker('foot'+S, an, 0, -.065, .15); marker('heel'+S, an, 0, -.065, -.055);
    marker('knee'+S, kn, 0, 0, .06); marker('hand'+S, wr, 0, -.09, 0); marker('elbow'+S, el, 0, 0, -.04);
    marker('side'+S, spine, s * .22, .4, 0); marker('hip'+S, root, s * .16, -.02, 0);
  }
  muscle('traps', spine, [0, .48, -.04], [.12, .05, .06]);
  muscle('traps', spine, [0, .53, -.03], [.06, .05, .04]);
  marker('head', head, 0, .12, 0); marker('headB', head, 0, .02, -.1);
  marker('backU', spine, 0, .4, -.115); marker('backL', spine, 0, .15, -.11);
  marker('chest', spine, 0, .37, .135); marker('belly', spine, 0, .15, .11);
  marker('butt', root, 0, -.11, -.05); marker('glute', root, 0, -.03, -.115); marker('pelvisF', root, 0, 0, .1);
  return {root, j, mk, mus, musM, skinM, meshes};
}

function applyPose(F, n, anchor) {
  const j = F.j, r = j.root;
  r.position.set(0, 0, 0);
  r.rotation.set(n.rx * D2R, n.ry * D2R, n.rz * D2R);
  j.spine.rotation.set(n.sp * D2R, n.st * D2R, n.ss * D2R);
  j.neck.rotation.x = n.nk * D2R;
  for (const S of LR) {
    const s = S === 'L' ? 1 : -1;
    j['sh'+S].rotation.set(-n['sf'+S] * D2R, 0, s * n['sa'+S] * D2R);
    j['sh'+S].position.y = .47 + n['shr'+S];
    j['el'+S].rotation.x = -n['e'+S] * D2R;
    j['wr'+S].rotation.x = n['w'+S] * D2R;
    j['hp'+S].rotation.set(-n['hf'+S] * D2R, 0, s * n['ha'+S] * D2R);
    j['kn'+S].rotation.x = n['k'+S] * D2R;
    j['an'+S].rotation.x = n['a'+S] * D2R;
  }
  r.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  if (!anchor) { let m = 1e9; for (const k in F.mk) { F.mk[k].getWorldPosition(v); if (v.y < m) m = v.y; } r.position.y = -m + n.jy; }
  else { let sum = 0; anchor.m.forEach(k => { F.mk[k].getWorldPosition(v); sum += v.y; }); r.position.y = anchor.y - sum / anchor.m.length + n.jy; }
  r.updateMatrixWorld(true);
}
function markersMean(F, names) {
  const v = new THREE.Vector3(), s = new THREE.Vector3();
  names.forEach(n => { F.mk[n].getWorldPosition(v); s.add(v); });
  return s.multiplyScalar(1 / names.length);
}

const Stage = {
  ok:false, el:null, running:false, t:0, speed:1, playing:true, anim:null, mode:'explore', hl:{prim:[], sec:[]}, sel:null, hover:null, rec:null,
  onPick:null, autoRot:false, path:true,
  init() {
    if (this.ok) return true;
    if (!window.THREE || !THREE.OrbitControls) return false;
    try {
      const T = THREE;
      this.r = new T.WebGLRenderer({antialias:true, alpha:true});
    } catch (e) { return false; }
    const T = THREE;
    this.r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.r.outputEncoding = T.sRGBEncoding;
    this.scene = new T.Scene();
    this.cam = new T.PerspectiveCamera(34, 1, .05, 60);
    this.cam.position.set(0, 1.15, 4.2);
    this.ctl = new T.OrbitControls(this.cam, this.r.domElement);
    Object.assign(this.ctl, {enableDamping:true, dampingFactor:.08, enablePan:false, minDistance:1.3, maxDistance:8});
    this.ctl.target.set(0, .9, 0);
    this.ctl.addEventListener('start', () => { this.camTo = null; this.autoRot = false; });
    this.scene.add(new T.HemisphereLight(0xffffff, 0x445566, .95));
    const d1 = new T.DirectionalLight(0xffffff, 1.05); d1.position.set(2, 4, 3); this.scene.add(d1);
    const d2 = new T.DirectionalLight(0xffffff, .45); d2.position.set(-2.5, 2, -3); this.scene.add(d2);
    this.floor = new T.Mesh(new T.CircleGeometry(1.7, 72), new T.MeshBasicMaterial({color:0x000000, transparent:true, opacity:.06}));
    this.floor.rotation.x = -Math.PI / 2; this.scene.add(this.floor);
    this.ring = new T.Mesh(new T.RingGeometry(1.68, 1.7, 96), new T.MeshBasicMaterial({color:0x000000, transparent:true, opacity:.2}));
    this.ring.rotation.x = -Math.PI / 2; this.ring.position.y = .001; this.scene.add(this.ring);
    this.F = buildFigure(); this.scene.add(this.F.root);
    this.propM = new T.MeshStandardMaterial({color:0x3a4350, roughness:.4, metalness:.6});
    this.supM = new T.MeshStandardMaterial({color:0x8893a0, roughness:.8, transparent:true, opacity:.55});
    // dumbbells (children of hands)
    this.dbs = LR.map(S => {
      const g = new T.Group();
      const bar = new T.Mesh(new T.CylinderGeometry(.012, .012, .2, 10), this.propM); bar.rotation.z = Math.PI / 2; g.add(bar);
      [-1, 1].forEach(s => { const p = new T.Mesh(new T.CylinderGeometry(.045, .045, .04, 16), this.propM); p.rotation.z = Math.PI / 2; p.position.x = s * .08; g.add(p); });
      g.position.y = -.06; this.F.j['wr'+S].add(g); return g;
    });
    this.bb = new T.Group();
    const bbBar = new T.Mesh(new T.CylinderGeometry(.014, .014, 1.6, 10), this.propM); bbBar.rotation.z = Math.PI / 2; this.bb.add(bbBar);
    [-1, 1].forEach(s => { const p = new T.Mesh(new T.CylinderGeometry(.18, .18, .05, 24), this.propM); p.rotation.z = Math.PI / 2; p.position.x = s * .62; this.bb.add(p); });
    this.scene.add(this.bb);
    this.kb = new T.Mesh(new T.SphereGeometry(.09, 18, 14), this.propM); this.scene.add(this.kb);
    this.supG = new T.Group(); this.scene.add(this.supG);
    this.pathLine = new T.Line(new T.BufferGeometry(), new T.LineBasicMaterial({color:0x0e7f86, transparent:true, opacity:.9}));
    this.scene.add(this.pathLine);
    this.ray = new T.Raycaster(); this.ndc = new T.Vector2();
    const cv = this.r.domElement; cv.style.touchAction = 'none';
    let down = null;
    cv.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
    cv.addEventListener('pointerup', e => { if (down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 6) { const id = this.pick(e); if (this.onPick) this.onPick(id); } down = null; });
    cv.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const id = this.pick(e); if (id !== this.hover) { this.hover = id; cv.style.cursor = id ? 'pointer' : 'grab'; this.showTip(id, e); } else if (id) this.showTip(id, e); });
    cv.addEventListener('pointerleave', () => { this.hover = null; this.showTip(null); });
    this.ro = new ResizeObserver(() => this.resize());
    this.ok = true; this.theme();
    return true;
  },
  theme() {
    if (!this.ok) return;
    const cs = getComputedStyle(document.documentElement), c = k => cs.getPropertyValue(k).trim() || '#888';
    this.col = {prim:c('--m-prim'), sec:c('--m-sec'), base:c('--m-base'), skin:c('--skin'), accent:c('--accent'), ink:c('--ink'), good:c('--good'), warn:c('--warn'), bad:c('--bad')};
    this.F.skinM.color.set(this.col.skin);
    this.floor.material.color.set(this.col.ink); this.ring.material.color.set(this.col.ink);
    this.pathLine.material.color.set(this.col.accent);
  },
  pick(e) {
    const rc = this.r.domElement.getBoundingClientRect();
    this.ndc.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.cam);
    const hit = this.ray.intersectObjects(this.F.meshes, false)[0];
    return hit && hit.object.userData.mid ? hit.object.userData.mid : null;
  },
  showTip(id, e) {
    if (!this.tip) return;
    if (!id) { this.tip.hidden = true; return; }
    const rc = this.el.getBoundingClientRect();
    this.tip.hidden = false; this.tip.textContent = MUSCLES[id].ar + (S.prefs.en ? ' · ' + MUSCLES[id].en : '');
    this.tip.style.left = (e.clientX - rc.left) + 'px'; this.tip.style.top = (e.clientY - rc.top - 34) + 'px';
  },
  mount(el, opts = {}) {
    if (!this.init()) { el.innerHTML = '<div class="stage-fail">تعذّر تشغيل العرض ثلاثي الأبعاد على هذا الجهاز أو لم يكتمل تحميل المكتبة. بقية الموقع يعمل، ويمكنك اختيار العضلات من القائمة.</div>'; return false; }
    if (this.el && this.el !== el) this.ro.unobserve(this.el);
    this.el = el; el.prepend(this.r.domElement);
    this.tip = document.createElement('div'); this.tip.className = 'stage-tip'; this.tip.hidden = true; el.appendChild(this.tip);
    this.selTag = document.createElement('div'); this.selTag.className = 'stage-tag'; this.selTag.hidden = true; el.appendChild(this.selTag);
    this.ro.observe(el); this.resize();
    this.mode = opts.mode || 'explore'; this.onPick = opts.onPick || null; this.autoRot = !!opts.autoRot;
    this.sel = null; this.rec = opts.rec || null; this.hl = {prim:[], sec:[]};
    if (this.mode === 'explore') { this.setAnim(null); this.view(opts.view || 'front', true); }
    if (!this.running) { this.running = true; this.last = performance.now(); requestAnimationFrame(t => this.loop(t)); }
    return true;
  },
  unmount() { this.running = false; if (this.el) this.ro.unobserve(this.el); this.el = null; },
  resize() { if (!this.el) return; const w = this.el.clientWidth, h = this.el.clientHeight; if (!w || !h) return; this.r.setSize(w, h, false); this.r.domElement.style.width = '100%'; this.r.domElement.style.height = '100%'; this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); },
  view(name, instant) {
    const d = this.anim && this.anim.frames[0].rx > 30 || (this.anim && this.anim.frames[0].rx < -30) ? 4.4 : 4.1, y = 1.15;
    const pos = {front:[0, y, d], back:[0, y, -d], left:[d, y, 0], right:[-d, y, 0], side:[-d * .92, y + .2, d * .38], top:[0, d, .6]}[name] || [0, y, d];
    this.camTo = new THREE.Vector3(...pos);
    if (instant) { this.cam.position.copy(this.camTo); this.camTo = null; }
  },
  setAnim(ex, opts = {}) {
    if (!this.ok) return;
    this.fault = !!opts.fault;
    this.anim = ex ? compileAnim(ex, this.fault) : null;
    if (!opts.keepT) this.t = 0;
    const show = (o, v) => { o.visible = v; };
    const eq = ex ? ex.eq : [];
    const props = this.anim && this.anim.props ? this.anim.props : [];
    const hands = ex && !['bridge','crunch','legraise','plank','sideplank','quad','clam','abduct','legext','legpress','calf','stretch','knees','jack','rope','skater','burpee','climber','pushup','pike','prone','nordic','step','swings','circles','rotate','inchworm','box','bandwalk','kickback'].includes(ex.pat) || (ex && ['calf','step','lunge','carry'].includes(ex.pat));
    this.dbs.forEach(g => show(g, !!ex && eq[0] === 'db' && hands && !['goblet'].includes(ex.po.arms)));
    this.bbOn = !!ex && ((eq[0] === 'bb' && hands) || props.includes('handbar'));
    show(this.bb, this.bbOn);
    this.kbOn = !!ex && (eq[0] === 'kb' || (ex.po && ex.po.arms === 'goblet'));
    show(this.kb, this.kbOn);
    while (this.supG.children.length) this.supG.remove(this.supG.children[0]);
    if (this.anim) {
      applyPose(this.F, this.anim.frames[0], this.anim.anchor);
      this.anim.sup.forEach(s => {
        applyPose(this.F, this.anim.frames[s.f] || this.anim.frames[0], this.anim.anchor);
        const c = markersMean(this.F, s.m);
        if (s.kind === 'box') { const h = Math.max(.05, c.y - .02); const b = new THREE.Mesh(new THREE.BoxGeometry(s.w, h, s.d), this.supM); b.position.set(c.x, h / 2, c.z); this.supG.add(b); }
        else if (s.kind === 'bar') { const b = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, 1.3, 10), this.propM); b.rotation.z = Math.PI / 2; b.position.set(0, c.y + .02, c.z); this.supG.add(b); }
        else if (s.kind === 'bars') { [-1, 1].forEach(k => { const b = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, 1, 10), this.propM); b.rotation.x = Math.PI / 2; b.position.set(k * .26, c.y + .01, c.z); this.supG.add(b); }); }
      });
      // movement path
      const pts = [], v = new THREE.Vector3();
      for (let i = 0; i <= 64; i++) { applyPose(this.F, poseAt(this.anim, i / 64), this.anim.anchor); this.F.mk[this.anim.track].getWorldPosition(v); pts.push(v.clone()); }
      this.pathLine.geometry.dispose(); this.pathLine.geometry = new THREE.BufferGeometry().setFromPoints(pts);
      this.hl = {prim:ex.prim, sec:ex.sec};
      if (opts.view !== false) this.view(opts.view || this.anim.view, opts.instant);
    }
    this.pathLine.visible = !!this.anim && this.path;
  },
  setHL(h) { this.hl = h; },
  loop(ts) {
    if (!this.running) return;
    requestAnimationFrame(t => this.loop(t));
    const dt = Math.min(.05, (ts - this.last) / 1000); this.last = ts;
    if (!this.el || !this.el.isConnected) return;
    let act = 0;
    if (this.anim) {
      if (this.playing) this.t += dt * this.speed / this.anim.dur;
      applyPose(this.F, poseAt(this.anim, this.t), this.anim.anchor);
      const ph = phaseAt(this.anim, this.t); act = ph.act;
      if (this.onPhase) this.onPhase(ph);
    } else {
      const b = Math.sin(ts / 900) * 1.2;
      applyPose(this.F, normPose({sa:10 + b, sp:b * .3}), null);
    }
    const hL = this.F.mk.handL, hR = this.F.mk.handR, a = new THREE.Vector3(), b2 = new THREE.Vector3();
    if (this.bbOn || this.kbOn) {
      hL.getWorldPosition(a); hR.getWorldPosition(b2);
      const mid = a.clone().add(b2).multiplyScalar(.5);
      if (this.bbOn) { this.bb.position.copy(mid); const dir = b2.clone().sub(a); if (dir.length() > .15) this.bb.quaternion.setFromUnitVectors(new THREE.Vector3(-1, 0, 0), dir.normalize()); }
      if (this.kbOn) { this.kb.position.copy(mid); this.kb.position.y -= .07; }
    }
    if (this.autoRot && !this.camTo) { const p = this.cam.position, tg = this.ctl.target, ang = dt * .25; const x = p.x - tg.x, z = p.z - tg.z; p.x = tg.x + x * Math.cos(ang) - z * Math.sin(ang); p.z = tg.z + x * Math.sin(ang) + z * Math.cos(ang); }
    if (this.camTo) { this.cam.position.lerp(this.camTo, .12); if (this.cam.position.distanceTo(this.camTo) < .01) this.camTo = null; }
    const pv = new THREE.Vector3(); this.F.root.getWorldPosition(pv);
    this.ctl.target.y += (Math.max(.45, pv.y * .95) - this.ctl.target.y) * .08;
    this.ctl.update();
    this.colorize(act);
    if (this.sel && this.selTag) {
      const m = this.F.mus[this.sel][0], v = new THREE.Vector3(); m.getWorldPosition(v); v.project(this.cam);
      const w = this.el.clientWidth, h = this.el.clientHeight;
      this.selTag.hidden = v.z > 1; this.selTag.textContent = MUSCLES[this.sel].ar;
      this.selTag.style.left = ((v.x + 1) / 2 * w) + 'px'; this.selTag.style.top = ((1 - v.y) / 2 * h - 16) + 'px';
    } else if (this.selTag) this.selTag.hidden = true;
    this.r.render(this.scene, this.cam);
  },
  colorize(act) {
    const C = this.col, prim = this.hl.prim || [], sec = this.hl.sec || [];
    for (const id in this.F.musM) {
      const m = this.F.musM[id]; let c = C.base, em = 0;
      if (this.rec) { const r = this.rec[id]; c = r == null ? C.base : r < 24 ? C.bad : r < 48 ? C.warn : C.good; em = r == null ? 0 : .12; }
      if (sec.includes(id)) { c = C.sec; em = .1 + .15 * act; }
      if (prim.includes(id)) { c = C.prim; em = .15 + .35 * act; }
      if (this.sel === id) { c = C.prim; em = .4; }
      if (this.hover === id) em += .2;
      m.color.set(c); m.emissive.set(c); m.emissiveIntensity = em;
    }
  }
};
