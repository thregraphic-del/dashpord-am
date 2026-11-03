// Live workout engine: timestamp-based timers survive re-renders, tab switches and reloads
const Live = {
  tickH:null, lastBeep:null, wake:null, shownEx:null,
  build(sess) {
    const steps = [], add = s => steps.push(s);
    (sess.warm || []).forEach((w, i) => { add({ph:'warm', id:w.id, kind:'time', dur:w.t}); add({ph:'warm', kind:'rest', dur:i === sess.warm.length - 1 ? 20 : 8}); });
    (sess.main || []).forEach((m, mi) => {
      for (let s = 1; s <= m.sets; s++) {
        add({ph:'main', id:m.id, kind:m.t ? 'time' : 'reps', dur:m.t, reps:m.reps, target:repTop(m.reps), weight:m.weight || 0, set:s, sets:m.sets});
        const lastOfAll = mi === sess.main.length - 1 && s === m.sets;
        if (!lastOfAll) add({ph:'main', kind:'rest', dur:m.rest || 60});
      }
    });
    if ((sess.cool || []).length) add({ph:'cool', kind:'rest', dur:15});
    (sess.cool || []).forEach((c, i) => { add({ph:'cool', id:c.id, kind:'time', dur:c.t}); if (i < sess.cool.length - 1) add({ph:'cool', kind:'rest', dur:6}); });
    return steps;
  },
  start(sess) {
    const now = Date.now();
    S.live = {sess, steps:this.build(sess), i:0, start:now, stepStart:now, pausedAt:null, pausedTotal:0, stepPaused:0, log:[], done:false, histId:null};
    save(); Sound.ensure(); location.hash = 'workout'; this.announce();
  },
  get cur() { return S.live && S.live.steps[S.live.i]; },
  now() { const L = S.live; return L.pausedAt || Date.now(); },
  stepElapsed() { const L = S.live; return (this.now() - L.stepStart - L.stepPaused) / 1000; },
  sessElapsed() { const L = S.live; return (this.now() - L.start - L.pausedTotal) / 1000; },
  remaining() { const c = this.cur; return c && c.dur ? c.dur - this.stepElapsed() : null; },
  nextWork(from) { const L = S.live; for (let k = (from ?? L.i) + 1; k < L.steps.length; k++) if (L.steps[k].kind !== 'rest') return L.steps[k]; return null; },
  announce() {
    const c = this.cur; if (!c) return;
    if (c.kind === 'rest') { const n = this.nextWork(); Sound.speak(`راحة ${c.dur} ثانية.` + (n ? ` التالي: ${EXI[n.id].ar}` : '')); }
    else { const e = EXI[c.id]; Sound.speak(c.ph === 'main' ? `${e.ar}. المجموعة ${c.set} من ${c.sets}. ${c.kind === 'reps' ? c.target + ' عدّة' : c.dur + ' ثانية'}` : `${e.ar}، ${c.dur} ثانية`); Sound.beep(660, .15); }
  },
  logCurrent(skipped) {
    const L = S.live, c = this.cur; if (!c || c.kind === 'rest' || skipped) return;
    L.log = L.log.filter(x => x.i !== L.i);
    L.log.push({i:L.i, id:c.id, reps:c.kind === 'reps' ? c.reps_done ?? c.target : null, weight:c.weight || 0, t:c.kind === 'time' ? Math.round(Math.min(c.dur, this.stepElapsed())) : null, ph:c.ph});
  },
  go(to, opts = {}) {
    const L = S.live; if (!L) return;
    if (!opts.noLog) this.logCurrent(opts.skip);
    if (to >= L.steps.length) return this.finish();
    if (to < 0) to = 0;
    const end = opts.at || Date.now();
    L.i = to; L.stepStart = L.pausedAt ? L.pausedAt : end; L.stepPaused = 0; this.lastBeep = null;
    // carry weight forward to next sets of same exercise
    const c = this.cur; if (c.kind !== 'rest') { const prev = L.steps.slice(0, to).reverse().find(s => s.id === c.id && s.kind !== 'rest'); if (prev && prev.weight !== undefined && c.weight === 0) c.weight = prev.weight; }
    save(); this.announce(); UI.livePanel();
  },
  next(skip) { this.go(S.live.i + 1, {skip}); },
  prev() { const L = S.live; let k = L.i - 1; while (k > 0 && L.steps[k].kind === 'rest') k--; this.go(k, {noLog:true}); },
  pause() { const L = S.live; if (L.pausedAt) return; L.pausedAt = Date.now(); save(); Sound.speak('إيقاف مؤقت'); UI.livePanel(); },
  resume() { const L = S.live; if (!L.pausedAt) return; const d = Date.now() - L.pausedAt; L.pausedTotal += d; L.stepPaused += d; L.pausedAt = null; save(); this.lockWake(); UI.livePanel(); },
  extend(sec) { const c = this.cur; if (c && c.kind === 'rest') { c.dur += sec; save(); UI.livePanel(); } },
  tick() {
    const L = S.live; if (!L || L.done || L.pausedAt) return UI.liveTick();
    const c = this.cur;
    if (c && c.dur) {
      const rem = this.remaining(), r = Math.ceil(rem);
      if (r <= 3 && r >= 1 && this.lastBeep !== r) { this.lastBeep = r; Sound.beep(880, .1); }
      if (c.kind === 'rest' && r === 10 && this.lastBeep !== 10 && c.dur > 20) { this.lastBeep = 10; Sound.speak('عشر ثوانٍ'); }
      if (rem <= 0) { Sound.beep(1320, .25); const endAt = L.stepStart + L.stepPaused + c.dur * 1000; this.go(L.i + 1, {at:Math.min(endAt, Date.now())}); return; }
    }
    if (c && c.kind === 'reps' && S.prefs.guided && Stage.anim) {
      const n = Math.min(c.target, Math.floor(this.stepElapsed() / Stage.anim.dur));
      if (n !== c.guided) { c.guided = n; if (n > 0) { Sound.beep(n === c.target ? 1320 : 990, .08); if (n === c.target) Sound.speak('أحسنت. اضغط إنهاء المجموعة'); } }
    }
    UI.liveTick();
  },
  finish() {
    const L = S.live; L.done = true; L.endAt = Date.now();
    if (!L.histId) {
      const h = {id:uid(), date:new Date(L.start).toISOString(), name:L.sess.name, dur:Math.round(this.sessElapsed()), sets:L.log.map(x => ({id:x.id, reps:x.reps, weight:x.weight, t:x.t})), rating:null};
      if (h.sets.length) { S.history.push(h); L.histId = h.id; h.sets.forEach(s => { S.recent = [s.id, ...S.recent.filter(x => x !== s.id)].slice(0, 30); }); }
    }
    save(); Sound.speak('أحسنت! أنهيت التمرين.'); UI.livePanel();
  },
  end() { this.finish(); },
  close() { S.live = null; save(); location.hash = 'progress'; },
  run() { clearInterval(this.tickH); this.tickH = setInterval(() => this.tick(), 200); this.lockWake(); },
  stop() { clearInterval(this.tickH); this.tickH = null; if (this.wake) { this.wake.release().catch(() => {}); this.wake = null; } },
  lockWake() { if (navigator.wakeLock && !this.wake) navigator.wakeLock.request('screen').then(w => { this.wake = w; w.addEventListener('release', () => { this.wake = null; }); }).catch(() => {}); }
};
document.addEventListener('visibilitychange', () => { if (!document.hidden && Live.tickH) { Live.wake = null; Live.lockWake(); Live.tick(); } });
