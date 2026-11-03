// Core state + domain logic
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY = 'nabd.v1';
let S;
const defState = () => ({profile:null, favs:[], history:[], plans:[], week:{}, journal:[], recent:[], viewed:[], prefs:{theme:'system', en:true, voice:true, beep:true, guided:false}, live:null, seed:1});
function load() { try { const r = localStorage.getItem(KEY); S = Object.assign(defState(), r ? JSON.parse(r) : {}); } catch (e) { S = defState(); } S.prefs = Object.assign(defState().prefs, S.prefs || {}); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = sec => { sec = Math.max(0, Math.round(sec)); const m = Math.floor(sec / 60), s = sec % 60; return m + ':' + String(s).padStart(2, '0'); };
const num = n => new Intl.NumberFormat('ar-SA-u-nu-latn').format(Math.round(n));
const dayKey = d => { const x = new Date(d); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
const DAYS = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const repTop = r => { if (!r) return 0; const m = String(r).match(/(\d+)\D*(\d+)?/); return m ? +(m[2] || m[1]) : 10; };
const exName = e => esc(e.ar) + (S.prefs.en ? ` <span class="en">${esc(e.en)}</span>` : '');
const muscleNames = ids => ids.map(i => MUSCLES[i] ? MUSCLES[i].ar : i).join('، ');

// ---------- availability & profile ----------
function userEq() {
  const p = S.profile; if (!p) return null;
  if (p.place === 'gym') return null; // everything
  return ['bw', ...(p.eq || [])];
}
function available(e, eqList) {
  eqList = eqList === undefined ? userEq() : eqList;
  if (!eqList) return true;
  const opts = e.eq.filter(q => q !== 'bench'), needBench = e.eq.includes('bench');
  return (opts.length ? opts.some(q => eqList.includes(q)) : true) && (!needBench || eqList.includes('bench'));
}
function limited(e) {
  const L = (S.profile && S.profile.limits) || [];
  if (L.includes('knee') && (e.hi || ['nordic','jump-squat','bulgarian','skater'].includes(e.id))) return 'قد يُجهد الركبة';
  if (L.includes('back') && (['deadlift','good-morning','back-squat','russian-twist','superman','sl-rdl','kb-swing','bb-row'].includes(e.id))) return 'قد يُجهد أسفل الظهر';
  if (L.includes('shoulder') && (['ohp','dips','chest-dips','upright-row','pike-pushup','skull-crusher','bb-bench'].includes(e.id))) return 'قد يُجهد الكتف';
  return '';
}
const userLvl = () => ({beg:1, mid:2, adv:3}[(S.profile && S.profile.exp) || 'beg']);
function substitute(e, eqList) {
  const pool = EX.filter(x => x.id !== e.id && x.kind === e.kind && x.prim[0] === e.prim[0] && available(x, eqList) && !limited(x));
  pool.sort((a, b) => Math.abs(a.lvl - e.lvl) - Math.abs(b.lvl - e.lvl) || (b.key - a.key));
  return pool[0] || null;
}
function alternatives(e) {
  const same = EX.filter(x => x.id !== e.id && x.prim.some(m => e.prim.includes(m)) && x.kind === e.kind);
  const easier = same.filter(x => x.lvl < e.lvl).sort((a, b) => b.lvl - a.lvl)[0] || same.find(x => x.lvl === e.lvl && x.eq.includes('bw'));
  const harder = same.filter(x => x.lvl > e.lvl).sort((a, b) => a.lvl - b.lvl)[0];
  const related = same.filter(x => x !== easier && x !== harder).slice(0, 6);
  return {easier, harder, related};
}

// ---------- seeded random ----------
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

// ---------- session generator ----------
function genSession(focus, minutes, place, seed = 1) {
  const R = rng(seed + minutes * 7 + focus.length * 13);
  const eqList = place === 'gym' ? null : (S.profile && S.profile.place === 'home' ? userEq() : ['bw', 'db', 'band', 'bench']);
  const lvl = userLvl();
  const f = FOCUS[focus];
  if (focus === 'mobility') {
    const pool = EX.filter(e => (e.kind === 'm' || e.kind === 'x') && available(e, eqList));
    const n = Math.max(4, Math.round(minutes * 60 / 50));
    const pick = []; const p = [...pool].sort(() => R() - .5);
    for (let i = 0; i < n; i++) pick.push(p[i % p.length]);
    return {name:'حركة ومرونة · ' + minutes + ' دقيقة', focus, warm:[], main:pick.map(e => ({id:e.id, sets:1, reps:null, t:e.t || 30, rest:10, weight:0})), cool:[]};
  }
  const warm = warmFor(focus), cool = coolFor(focus);
  const nW = minutes <= 15 ? 2 : minutes <= 30 ? 3 : 4, nC = minutes <= 15 ? 2 : 3;
  const mainSec = Math.max(5, minutes - nW * .9 - nC * .7 - .5) * 60;
  const sets = lvl === 1 ? 3 : minutes >= 45 ? 4 : 3;
  const chosen = []; let used = 0, i = 0;
  while (used < mainSec && i < 30) {
    const m = f.m[i % f.m.length]; i++;
    const cand = EX.filter(e => e.kind === 's' && e.prim[0] === m && !chosen.some(c => c.id === e.id) && available(e, eqList) && !limited(e) && e.lvl <= lvl + (lvl === 1 ? 0 : 1));
    if (!cand.length) continue;
    cand.sort((a, b) => (b.key + R() * .9 - (a.key + R() * .9)) + (Math.abs(a.lvl - lvl) - Math.abs(b.lvl - lvl)) * .6);
    const e = cand[0];
    const st = e.iso ? Math.min(sets, 3) : sets;
    const it = {id:e.id, sets:st, reps:e.reps, t:e.t, rest:e.rest, weight:lastWeight(e.id)};
    const cost = estItem(it);
    if (used + cost > mainSec + 90 && chosen.length >= 2) break;
    chosen.push(it); used += cost;
  }
  const hasCore = chosen.some(c => ['abs','obliques'].includes(EXI[c.id].prim[0]));
  if (minutes >= 30 && !hasCore && focus !== 'upper') { const p = EXI.plank; chosen.push({id:'plank', sets:2, reps:null, t:30, rest:45, weight:0}); }
  return {name:f.ar + ' · ' + minutes + ' دقيقة', focus, style:'sets', warm:warm.slice(0, nW).filter(id => available(EXI[id], eqList) || EXI[id].eq.includes('bw')).map(id => ({id, t:id === 'march' ? 45 : 35})), main:chosen, cool:cool.slice(0, nC).map(id => ({id, t:30}))};
}
const workSec = it => it.t ? it.t : repTop(it.reps) * 3.5 + 5;
const estItem = it => it.sets * (workSec(it) + it.rest) - it.rest + 15;
function estSession(s) { return (s.warm || []).reduce((a, w) => a + w.t + 8, 0) + (s.main || []).reduce((a, it) => a + estItem(it), 0) + (s.cool || []).reduce((a, w) => a + w.t + 8, 0); }
function planToSession(plan, opts = {}) {
  const eqList = opts.gym ? null : userEq();
  const notes = [];
  const main = plan.items.map(it => {
    let e = EXI[it.id];
    if (!available(e, eqList)) { const s = substitute(e, eqList); if (s) { notes.push(`استُبدل «${e.ar}» بـ«${s.ar}» لعدم توفر الأداة`); e = s; } }
    return {id:e.id, sets:it.sets, reps:it.t ? null : it.reps, t:it.t || null, rest:it.rest, weight:it.weight || lastWeight(e.id)};
  });
  const allTimed = main.every(m => ['m','x'].includes(EXI[m.id].kind));
  const g = guessFocus(main);
  return {name:plan.name, focus:g, warm:allTimed ? [] : WARM[g].slice(0, 3).map(id => ({id, t:35})), main, cool:allTimed ? [] : COOL[g].slice(0, 3).map(id => ({id, t:30})), notes, planId:plan.id};
}
function guessFocus(items) {
  let up = 0, lo = 0; items.forEach(it => { const g = MUSCLES[EXI[it.id].prim[0]].g; if (g === 'legs') lo++; else if (g !== 'core') up++; });
  return lo && up ? 'full' : lo ? 'legs' : up ? 'upper' : 'core';
}
// program items helper: [id, sets, reps|tSEC, rest]
const progPlan = p => ({id:p.id, name:p.name, tag:p.tag, builtIn:true, items:p.items.map(([id, sets, r, rest]) => ({id, sets, reps:String(r)[0] === 't' ? null : String(r), t:String(r)[0] === 't' ? +String(r).slice(1) : null, rest, weight:0}))});
const allPlans = () => [...S.plans, ...PROGRAMS.map(progPlan)];
const findPlan = id => allPlans().find(p => p.id === id);

// ---------- history-derived ----------
function lastWeight(id) {
  for (let i = S.history.length - 1; i >= 0; i--) { const s = S.history[i].sets.filter(x => x.id === id && x.weight > 0); if (s.length) return s[s.length - 1].weight; }
  return 0;
}
function lastPerformance(id) {
  for (let i = S.history.length - 1; i >= 0; i--) { const s = S.history[i].sets.filter(x => x.id === id && x.reps); if (s.length) return {date:S.history[i].date, sets:s}; }
  return null;
}
function progression(id, it) {
  const lp = lastPerformance(id); if (!lp) return null;
  const top = repTop(it.reps), w = lp.sets[0].weight || 0;
  const allHit = lp.sets.every(s => s.reps >= top);
  const best = lp.sets.reduce((a, s) => s.reps > a ? s.reps : a, 0);
  if (w > 0 && allHit) { const inc = EXI[id].eq[0] === 'bb' ? 2.5 : 1; return {text:`المرة السابقة: ${w} كغ × ${best} في كل المجموعات. جرّب ${w + inc} كغ اليوم.`, w:w + inc}; }
  if (w === 0 && allHit) return {text:`المرة السابقة أنهيت ${best} عدّات. جرّب زيادة عدّة أو عدّتين، أو انتقل لنسخة أصعب.`};
  return {text:`المرة السابقة: ${w ? w + ' كغ × ' : ''}${lp.sets.map(s => s.reps).join(' / ')} عدّة.`};
}
function muscleLoad(days = 30) {
  const since = Date.now() - days * 864e5, out = {};
  for (const id in MUSCLES) out[id] = 0;
  S.history.filter(h => new Date(h.date) >= since).forEach(h => h.sets.forEach(s => { const e = EXI[s.id]; if (!e || e.kind === 'x' || e.kind === 'm') return; e.prim.forEach(m => out[m] += 1); e.sec.forEach(m => out[m] += .5); }));
  return out;
}
function recoveryMap() { // hours since a muscle was last trained as primary/secondary
  const out = {}, now = Date.now();
  S.history.forEach(h => { const t = (now - new Date(h.date)) / 36e5; h.sets.forEach(s => { const e = EXI[s.id]; if (!e || e.kind === 'x' || e.kind === 'm') return; [...e.prim, ...e.sec].forEach(m => { if (out[m] == null || t < out[m]) out[m] = t; }); }); });
  const today = S.journal.find(j => j.date === dayKey(now));
  if (today && today.level >= 3) (today.groups || []).forEach(g => GROUPS[g].m.forEach(m => out[m] = Math.min(out[m] ?? 99, 20)));
  return out;
}
function streak() {
  const days = new Set(S.history.map(h => dayKey(h.date))); let n = 0; const d = new Date();
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function weekStart(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - x.getDay()); return x; }
function inWeek(h, ws = weekStart()) { const t = new Date(h.date); return t >= ws && t < new Date(+ws + 7 * 864e5); }
const totals = list => list.reduce((a, h) => { a.min += h.dur / 60; h.sets.forEach(s => { if (s.reps) { a.sets++; a.reps += s.reps; a.vol += (s.weight || 0) * s.reps; } }); return a; }, {min:0, sets:0, reps:0, vol:0, n:list.length});
function balance(days = 30) {
  const L = muscleLoad(days), sum = ids => ids.reduce((a, m) => a + L[m], 0);
  return {push:sum(['chest_upper','chest_lower','delt_front','triceps']), pull:sum(['lats','upper_back','delt_rear','biceps']), upper:sum(['chest_upper','chest_lower','delt_front','delt_side','delt_rear','biceps','triceps','lats','upper_back','traps']), lower:sum(['quads','hamstrings','glutes','calves'])};
}
function prs() {
  const out = {};
  S.history.forEach(h => h.sets.forEach(s => { if (!s.reps) return; const e1 = s.weight ? s.weight * (1 + s.reps / 30) : 0; const o = out[s.id]; if (!o || (s.weight || 0) > o.w || ((s.weight || 0) === o.w && s.reps > o.r)) out[s.id] = {w:s.weight || 0, r:s.reps, date:h.date, e1:Math.max(e1, o ? o.e1 : 0)}; else if (e1 > o.e1) o.e1 = e1; }));
  return out;
}
// ---------- badges & challenges ----------
function badges() {
  const H = S.history, T = totals(H), wk = {};
  H.forEach(h => { const k = dayKey(weekStart(new Date(h.date))); wk[k] = (wk[k] || 0) + 1; });
  const last7 = H.filter(h => Date.now() - new Date(h.date) < 7 * 864e5), groups7 = new Set();
  last7.forEach(h => h.sets.forEach(s => { const e = EXI[s.id]; if (e && e.kind === 's') e.prim.forEach(m => groups7.add(MUSCLES[m].g)); }));
  const mob = H.filter(h => h.sets.length && h.sets.every(s => ['m','x'].includes((EXI[s.id] || {}).kind))).length;
  return [
    ['أول خطوة', 'أكملت أول تمرين', H.length >= 1], ['خمس جلسات', 'أكملت 5 جلسات', H.length >= 5], ['عشر جلسات', 'أكملت 10 جلسات', H.length >= 10],
    ['ثلاثة أيام متتالية', 'تمرنت 3 أيام متتالية', streak() >= 3], ['أسبوع ملتزم', '3 جلسات في أسبوع واحد', Object.values(wk).some(v => v >= 3)],
    ['ألف عدّة', 'مجموع 1000 عدّة', T.reps >= 1000], ['عشرة أطنان', 'حجم كلي 10,000 كغ', T.vol >= 10000],
    ['جسم متوازن', 'كل المجموعات العضلية خلال 7 أيام', groups7.size >= 5], ['مستكشف', 'فتحت 20 تمرينًا مختلفًا', S.viewed.length >= 20],
    ['مرونة', '3 جلسات حركة أو إطالة', mob >= 3], ['مبكّر', 'تمرين قبل 8 صباحًا', H.some(h => new Date(h.date).getHours() < 8)]
  ].map(([n, d, ok]) => ({n, d, ok}));
}
function challenge() {
  const wkNo = Math.floor(weekStart() / (7 * 864e5)), list = S.history.filter(h => inWeek(h)), T = totals(list);
  const groups = new Set(); list.forEach(h => h.sets.forEach(s => { const e = EXI[s.id]; if (e && e.kind === 's') e.prim.forEach(m => groups.add(MUSCLES[m].g)); }));
  return [
    {t:'أكمل 3 جلسات هذا الأسبوع', v:list.length, goal:3, u:'جلسة'},
    {t:'150 دقيقة نشاط هذا الأسبوع (توصية منظمة الصحة العالمية للبالغين)', v:Math.round(T.min), goal:150, u:'دقيقة'},
    {t:'درّب 5 مجموعات عضلية مختلفة', v:groups.size, goal:5, u:'مجموعة'},
    {t:'أكمل 60 مجموعة تمرين', v:T.sets, goal:60, u:'مجموعة'}
  ][wkNo % 4];
}
// ---------- demo data ----------
function demoData() {
  const out = [], ids = [['goblet-squat','db-row','floor-press','glute-bridge','plank'], ['lat-pulldown','db-bench','lateral-raise','db-curl','tri-pushdown'], ['rdl','reverse-lunge','calf-raise','dead-bug','bw-squat']];
  for (let d = 34; d >= 1; d--) {
    if ([0, 2, 4].indexOf(d % 7) < 0 && d % 5 !== 0) continue;
    const date = new Date(Date.now() - d * 864e5); date.setHours(18, 30, 0, 0);
    const set = ids[out.length % 3], prog = (34 - d) / 34, sets = [];
    set.forEach(id => { const e = EXI[id]; for (let i = 0; i < 3; i++) sets.push({id, reps:e.t ? null : repTop(e.reps) - (i === 2 ? 2 : 0), weight:e.eq.includes('bw') && e.eq.length === 1 || e.t ? 0 : Math.round((8 + prog * 6 + (e.eq[0] === 'mc' ? 20 : 0)) * 2) / 2, t:e.t || null}); });
    out.push({id:uid(), date:date.toISOString(), name:'تمرين تجريبي', dur:1800 + Math.round(Math.random() * 900), sets, rating:'ok', demo:true});
  }
  return out;
}

// ---------- focus groups + "one exercise per minute" circuit sessions ----------
Object.assign(FOCUS, {
  chest:{ar:'الصدر', m:['chest_lower','chest_upper','chest_lower','chest_upper','triceps']},
  back:{ar:'الظهر', m:['lats','upper_back','lats','lower_back','traps']},
  shoulders:{ar:'الأكتاف', m:['delt_front','delt_side','delt_rear','delt_side']},
  arms:{ar:'الذراعان', m:['biceps','triceps','biceps','triceps','forearms']},
  cardio:{ar:'كارديو', m:[]}
});
const FOCUS_ORDER = ['legs','glutes','full','chest','back','shoulders','arms','core','upper','push','pull','cardio','mobility'];
const FOCUS_CATS = {legs:['legs','glutes'], glutes:['glutes'], chest:['chest'], back:['back'], shoulders:['shoulders'], arms:['arms'], core:['abs'], upper:['chest','back','shoulders','arms'], full:['chest','back','legs','glutes','shoulders','abs','cardio'], cardio:['cardio'], mobility:['mob'],
  push:{m:['chest_upper','chest_lower','delt_front','delt_side','triceps']}, pull:{m:['lats','upper_back','delt_rear','biceps','traps']}};
const warmFor = f => WARM[f] || (['legs','glutes'].includes(f) ? WARM.legs : ['chest','back','shoulders','arms','upper','push','pull'].includes(f) ? WARM.upper : WARM.full);
const coolFor = f => COOL[f] || (['legs','glutes'].includes(f) ? COOL.legs : ['chest','back','shoulders','arms','upper','push','pull'].includes(f) ? COOL.upper : COOL.full);
function focusPool(focus, place) {
  const eqList = place === 'gym' ? null : (S.profile && S.profile.place === 'home' ? userEq() : ['bw', 'db', 'band', 'bench', 'kb', 'rope']);
  const fc = FOCUS_CATS[focus] || FOCUS_CATS.full, lvl = userLvl();
  return EX.filter(e => {
    if (Array.isArray(fc)) { if (!fc.includes(exCat(e))) return false; } else if (!fc.m.includes(e.prim[0]) || e.kind !== 's') return false;
    if (focus !== 'mobility' && (e.kind === 'm' || e.kind === 'x')) return false;
    return available(e, eqList) && !limited(e) && e.lvl <= Math.max(2, lvl + 1) && !(e.t && e.t > 120);
  });
}
function circuitItem(id) { const e = EXI[id]; return {id, sets:1, reps:null, t:e.kind === 'x' || e.kind === 'm' ? Math.min(e.t || 40, 45) : 45, rest:15, weight:lastWeight(id)}; }
function genCircuit(focus, minutes, place, seed) {
  const R = rng(seed * 31 + minutes + focus.length * 7), pool = focusPool(focus, place);
  const nW = focus === 'mobility' ? 0 : minutes <= 15 ? 2 : 3, nC = focus === 'mobility' ? 0 : minutes <= 15 ? 2 : 3;
  const n = Math.max(4, Math.round(minutes - nW * .8 - nC * .7));
  const byM = {}; pool.forEach(e => { (byM[e.prim[0]] = byM[e.prim[0]] || []).push(e); });
  Object.values(byM).forEach(l => l.sort((a, b) => (b.key - a.key) + (R() - .5) * 1.6));
  const keys = Object.keys(byM).sort(() => R() - .5), picked = [];
  for (let i = 0; picked.length < n && i < 400; i++) { const l = byM[keys[i % keys.length]]; if (l && l.length) picked.push(l.shift()); }
  return {name:FOCUS[focus].ar + ' · ' + minutes + ' دقيقة · تمرين كل دقيقة', focus, style:'circuit', warm:warmFor(focus).slice(0, nW).map(id => ({id, t:35})), main:picked.map(e => circuitItem(e.id)), cool:coolFor(focus).slice(0, nC).map(id => ({id, t:30}))};
}
function buildQuick(q) {
  const place = q.place || (S.profile && S.profile.place) || 'home';
  const s = q.style === 'sets' && FOCUS[q.focus].m.length ? genSession(q.focus, q.min, place, S.seed) : genCircuit(q.focus, q.min, place, S.seed);
  if (q.picked) {
    const old = Object.fromEntries(s.main.map(m => [m.id, m]));
    s.main = q.picked.filter(id => EXI[id]).map(id => old[id] || (q.style === 'sets' ? {id, sets:EXI[id].sets, reps:EXI[id].reps, t:EXI[id].t, rest:EXI[id].rest, weight:lastWeight(id)} : circuitItem(id)));
  }
  return s;
}
