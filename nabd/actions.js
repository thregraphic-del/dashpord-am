// Event delegation + boot
const ACT = {
  more() { $('#sheet').hidden = !$('#sheet').hidden; },
  theme() { const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); S.prefs.theme = cur === 'dark' ? 'light' : 'dark'; applyTheme(); save(); },
  music() { Sound.toggle(); },
  'm-next'() { Sound.go(1); }, 'm-prev'() { Sound.go(-1); }, 'm-pick'(b) { Sound.pick(+b.dataset.v); },
  'test-voice'() { Sound.speak('مرحبًا، أنا مدربك. لنبدأ التمرين.'); Sound.beep(880); },
  q(b) { const k = b.dataset.k; UI.st.quick[k] = k === 'min' ? +b.dataset.v : b.dataset.v; UI.st.quick.picked = null; UI.st.pool = false; keepScroll(() => UI.render()); },
  pick(b) { const q = UI.st.quick; if (!q.picked) q.picked = buildQuick({...q, picked:null}).main.map(m => m.id); const id = b.dataset.id, i = q.picked.indexOf(id); i < 0 ? q.picked.push(id) : q.picked.splice(i, 1); keepScroll(() => UI.render()); UI.toast(i < 0 ? 'أُضيف ' + EXI[id].ar : 'أُزيل ' + EXI[id].ar); },
  'pool-toggle'() { UI.st.pool = !UI.st.pool; keepScroll(() => UI.render()); },
  reshuffle() { S.seed++; UI.st.quick.picked = null; save(); keepScroll(() => UI.render()); },
  'start-quick'() { const s = buildQuick(UI.st.quick); if (!s.main.length) return UI.toast('اختر تمرينًا واحدًا على الأقل'); Live.start(s); },
  'start-plan'(b) { const p = findPlan(b.dataset.id); if (p) Live.start(planToSession(p)); },
  'start-routine'(b) { const r = ROUTINES.find(x => x.id === b.dataset.id); Live.start({name:r.name, warm:[], main:r.items.map(id => ({id, sets:1, t:EXI[id].t || 30, reps:null, rest:8, weight:0})), cool:[]}); },
  try(b) { const e = EXI[b.dataset.id]; Live.start({name:e.ar, warm:[], main:[{id:e.id, sets:e.sets, reps:e.reps, t:e.t, rest:e.rest, weight:lastWeight(e.id)}], cool:[]}); },
  'body-rec'() { UI.st.body.rec = true; },
  view(b) { Stage.autoRot = false; Stage.view(b.dataset.v); },
  'sel-muscle'(b) { UI.selMuscle(b.dataset.id); },
  'sel-muscle-go'(b) { UI.st.body.sel = b.dataset.id; location.hash = 'body'; },
  muscle(b) { UI.st.body.sel = b.dataset.id; location.hash = 'body'; },
  'filter-muscle'(b) { Object.assign(UI.st.lib, {cat:'m:' + b.dataset.id, q:'', tab:'all'}); location.hash = 'library'; },
  fav(b) { const id = b.dataset.id, i = S.favs.indexOf(id); i < 0 ? S.favs.push(id) : S.favs.splice(i, 1); save(); if (UI.route().v === 'library') { $('#lib-res').innerHTML = UI.libResults(); Thumbs.scan($('#lib-res')); } else { UI.render(); } UI.toast(i < 0 ? 'أُضيف للمفضلة' : 'أُزيل من المفضلة'); },
  'lib-tab'(b) { UI.st.lib.tab = b.dataset.v; UI.render(); },
  'lib-cat'(b) { UI.st.lib.cat = b.dataset.v; UI.render(); },
  'lib-adv'() { UI.st.lib.adv = !UI.st.lib.adv; UI.render(); },
  'lib-eq'(b) { const a = UI.st.lib.eq, i = a.indexOf(b.dataset.v); i < 0 ? a.push(b.dataset.v) : a.splice(i, 1); UI.render(); },
  'lib-reset'() { Object.assign(UI.st.lib, {q:'', cat:'', lvl:'', eq:[], place:'', kind:'', mech:'', impact:'', tab:'all', safe:false}); UI.render(); },
  playpause() { Stage.playing = !Stage.playing; $('#pp').innerHTML = ic(Stage.playing ? 'pause' : 'play'); },
  replay() { Stage.t = 0; Stage.playing = true; const p = $('#pp'); if (p) p.innerHTML = ic('pause'); },
  speed(b) { Stage.speed = +b.dataset.v; UI.st.detail.speed = Stage.speed; $$('[data-act="speed"]').forEach(x => x.setAttribute('aria-pressed', x === b)); },
  fault(b) { UI.st.detail.fault = b.dataset.v === '1'; UI.render(); },
  'add-to-plan'(b) {
    const id = b.dataset.id, el = $('#planpick');
    el.innerHTML = `<section class="card"><h3>أضف «${esc(EXI[id].ar)}» إلى</h3><div class="chips">${S.plans.map(p => `<button class="chip" data-act="add-to" data-p="${p.id}" data-id="${id}">${esc(p.name)}</button>`).join('')}<button class="chip" data-act="add-to" data-p="" data-id="${id}">${ic('plus')} خطة جديدة</button></div></section>`;
    el.scrollIntoView({behavior:'smooth'});
  },
  'add-to'(b) {
    const e = EXI[b.dataset.id], it = {id:e.id, sets:e.sets, reps:e.reps, t:e.t, rest:e.rest, weight:0};
    let p = S.plans.find(x => x.id === b.dataset.p);
    if (!p) { p = {id:uid(), name:'خطتي ' + (S.plans.length + 1), items:[]}; S.plans.push(p); }
    p.items.push(it); save(); UI.toast(`أُضيف إلى «${p.name}»`); $('#planpick').innerHTML = '';
  },
  // plans
  ptab(b) { UI.st.plansTab = b.dataset.v; UI.render(); },
  'new-plan'() { UI.st.edit = {id:uid(), name:'خطة جديدة', items:[], isNew:true}; UI.render(); },
  'edit-plan'(b) { const p = S.plans.find(x => x.id === b.dataset.id); UI.st.edit = JSON.parse(JSON.stringify(p)); UI.render(); },
  'dup-plan'(b) { const p = JSON.parse(JSON.stringify(findPlan(b.dataset.id))); p.id = uid(); p.name = p.name + ' (نسخة)'; delete p.builtIn; delete p.tag; p.isNew = true; UI.st.edit = p; UI.render(); },
  'del-plan'(b) { S.plans = S.plans.filter(x => x.id !== b.dataset.id); for (const d in S.week) if (S.week[d] === b.dataset.id) delete S.week[d]; save(); UI.render(); UI.toast('حُذفت الخطة'); },
  'save-plan'() { const p = UI.st.edit; if (!p.name.trim()) return UI.toast('اكتب اسمًا للخطة'); if (!p.items.length) return UI.toast('أضف تمرينًا واحدًا على الأقل'); delete p.isNew; const i = S.plans.findIndex(x => x.id === p.id); i < 0 ? S.plans.push(p) : S.plans[i] = p; save(); UI.st.edit = null; UI.st.plansTab = 'mine'; UI.render(); UI.toast('حُفظت الخطة'); },
  'cancel-edit'() { UI.st.edit = null; UI.render(); },
  'it-add'(b) { const e = EXI[b.dataset.id]; UI.st.edit.items.push({id:e.id, sets:e.sets, reps:e.reps, t:e.t, rest:e.rest, weight:0}); UI.render(); UI.toast('أُضيف ' + e.ar); },
  'it-del'(b) { UI.st.edit.items.splice(+b.dataset.i, 1); UI.render(); },
  'it-up'(b) { moveItem(+b.dataset.i, -1); }, 'it-down'(b) { moveItem(+b.dataset.i, 1); },
  'it-swap'(b) { const it = UI.st.edit.items[+b.dataset.i], s = substitute(EXI[it.id], userEq()); if (!s) return UI.toast('لا يوجد بديل مناسب'); UI.toast(`استُبدل بـ«${s.ar}»`); it.id = s.id; if (s.t && !it.t) { it.t = s.t; it.reps = null; } if (!s.t && it.t) { it.t = null; it.reps = s.reps; } UI.render(); },
  'ed-group'(b) { UI.st.editGroup = b.dataset.v; UI.render(); },
  fit() { const target = +$('#fit-min').value * 60 - 360, p = UI.st.edit; let guard = 0;
    while (estSession({warm:[], main:p.items, cool:[]}) > target && guard++ < 60) { const big = p.items.filter(i => i.rest > 45); if (big.length) big.forEach(i => i.rest -= 15); else { const s = [...p.items].sort((a, b) => (EXI[b.id].iso - EXI[a.id].iso) || b.sets - a.sets)[0]; if (s.sets > 2) s.sets--; else if (p.items.length > 2) p.items.splice(p.items.indexOf(s), 1); else break; } }
    UI.render(); UI.toast('عُدّلت الخطة لتناسب المدة'); },
  cal(b) { const d = UI.st.calMonth ? new Date(UI.st.calMonth) : new Date(); d.setDate(1); d.setMonth(d.getMonth() + +b.dataset.v); UI.st.calMonth = +d; UI.render(); },
  'auto-week'() { autoWeek(); save(); UI.st.plansTab = 'week'; if (location.hash !== '#plans') location.hash = 'plans'; else UI.render(); UI.toast('وُزّعت الخطط على الأسبوع'); },
  // live
  'lw-next'() { Live.next(); }, 'lw-skip'() { Live.skip(); }, 'lw-prev'() { Live.prev(); },
  'lw-pause'() { Live.pause(); }, 'lw-resume'() { Live.resume(); }, 'lw-extend'() { Live.extend(15); },
  'lw-done'() { Live.next(); },
  'lw-rep'(b) { const c = Live.cur; c.reps_done = Math.max(0, (c.reps_done ?? c.target) + +b.dataset.v); $('#lw-reps').textContent = c.reps_done; save(); },
  'lw-w'(b) { const c = Live.cur; c.weight = Math.max(0, Math.round(((c.weight || 0) + +b.dataset.v) * 2) / 2); $('#lw-wt').textContent = c.weight; const L = S.live; L.steps.forEach((s, i) => { if (i > L.i && s.id === c.id && s.kind !== 'rest') s.weight = c.weight; }); save(); },
  'lw-swap'() { const L = S.live, c = Live.cur, s = substitute(EXI[c.id], (S.profile && S.profile.place === 'gym') ? null : userEq()); if (!s) return UI.toast('لا يوجد بديل مناسب'); const old = c.id; L.steps.forEach((x, i) => { if (i >= L.i && x.id === old) { x.id = s.id; if (s.t) { x.kind = 'time'; x.dur = s.t; } else if (x.kind === 'time' && x.ph === 'main') { x.kind = 'reps'; x.reps = s.reps; x.target = repTop(s.reps); x.dur = null; } } }); L.stepStart = Date.now(); L.stepPaused = 0; save(); Live.shownEx = null; UI.livePanel(); UI.toast('استُبدل بـ' + s.ar); },
  'end-ask'() { $('#lw-confirm').innerHTML = `<div class="confirm"><p><b>إنهاء الجلسة الآن؟</b> سنحفظ ما أكملته من مجموعات.</p><button class="btn primary" data-act="lw-end">إنهاء وحفظ</button><button class="btn" data-act="lw-discard">إنهاء بدون حفظ</button><button class="btn ghost" data-act="lw-keep">متابعة التمرين</button></div>`; },
  'lw-keep'() { $('#lw-confirm').innerHTML = ''; },
  'lw-end'() { $('#lw-confirm').innerHTML = ''; Live.end(); },
  'lw-discard'() { Live.stop(); S.live = null; save(); location.hash = 'home'; },
  rate(b) { const h = S.history.find(x => x.id === S.live.histId); if (h) { h.rating = b.dataset.v; save(); UI.livePanel(); } },
  'lw-close'() { Live.close(); }, 'lw-close-home'() { S.live = null; save(); },
  // progress / data
  demo() { S.history = demoData().concat(S.history); S.history.sort((a, b) => new Date(a.date) - new Date(b.date)); save(); UI.render(); },
  'demo-clear'() { S.history = S.history.filter(h => !h.demo); save(); UI.render(); },
  'del-hist'(b) { S.history = S.history.filter(h => h.id !== b.dataset.id); save(); UI.render(); UI.toast('حُذفت الجلسة'); },
  ask(b) { askCoach(b.dataset.v); },
  'del-j'(b) { S.journal = S.journal.filter(j => j.id !== b.dataset.id); save(); UI.render(); },
  export(b) {
    let txt;
    if (b.dataset.v === 'json') txt = JSON.stringify({...S, live:null}, null, 1);
    else { txt = 'date,session,exercise_ar,exercise_en,reps,weight_kg,seconds\n' + S.history.flatMap(h => h.sets.map(s => [h.date, h.name, EXI[s.id] ? EXI[s.id].ar : s.id, EXI[s.id] ? EXI[s.id].en : '', s.reps ?? '', s.weight ?? '', s.t ?? ''].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))).join('\n'); }
    $('#xport').innerHTML = `<textarea id="xport-t" readonly rows="8">${esc(txt)}</textarea><button class="btn sm" data-act="copy-x">${ic('copy')} نسخ</button><p class="muted small">انسخ النص واحفظه في ملف على جهازك.</p>`;
  },
  'copy-x'() { const t = $('#xport-t'); navigator.clipboard.writeText(t.value).then(() => UI.toast('نُسخ'), () => { t.select(); UI.toast('حدّد النص وانسخه يدويًا'); }); },
  'import-show'() { $('#xport').innerHTML = `<textarea id="imp-t" rows="6" placeholder="الصق هنا نص JSON المُصدَّر سابقًا"></textarea><button class="btn sm primary" data-act="import">استيراد واستبدال البيانات</button>`; },
  import() { try { const d = JSON.parse($('#imp-t').value); if (!d || !Array.isArray(d.history)) throw 0; S = Object.assign(defState(), d); save(); applyTheme(); UI.toast('تم الاستيراد'); UI.render(); } catch (e) { UI.toast('النص غير صالح. تأكد أنه ملف تصدير JSON من نبض.'); } },
  'wipe-ask'() { UI.st.confirm = 'wipe'; UI.render(); }, 'confirm-cancel'() { UI.st.confirm = null; UI.render(); },
  wipe() { S = defState(); save(); UI.st.confirm = null; applyTheme(); location.hash = 'welcome'; UI.toast('حُذفت كل البيانات'); }
};
function keepScroll(fn) { const y = window.scrollY; fn(); window.scrollTo(0, y); }
function moveItem(i, d) { const a = UI.st.edit.items, j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; UI.render(); }
function autoWeek() {
  const d = (S.profile && S.profile.days) || 3, gym = S.profile && S.profile.place === 'gym', mine = S.plans[0];
  const map = {2:[gym ? 'p-full-gym' : 'p-full-home', gym ? 'p-full-gym' : 'p-beginner'], 3:gym ? ['p-full-gym', 'p-upper', 'p-lower'] : ['p-beginner', 'p-legs30', 'p-core'], 4:['p-upper', 'p-lower', 'p-upper', 'p-lower'], 5:['p-push', 'p-pull', 'p-legs', 'p-upper', 'p-lower'], 6:['p-push', 'p-pull', 'p-legs', 'p-push', 'p-pull', 'p-legs']}[d];
  const slots = {2:[0, 3], 3:[0, 2, 4], 4:[0, 1, 3, 4], 5:[0, 1, 2, 4, 5], 6:[0, 1, 2, 3, 4, 5]}[d];
  S.week = {}; slots.forEach((day, i) => { S.week[day] = mine && i === 0 && !gym ? mine.id : map[i]; });
}
function askCoach(q) { if (!q.trim()) return; UI.st.chat.push({me:true, t:q}, {me:false, h:UI.coachAnswer(q)}); UI.render(); }
function applyTheme() { const t = S.prefs.theme; if (t === 'system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t; Stage.theme(); }

document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]'); if (!a) { if (!e.target.closest('.sheet-in, [data-act="more"]')) { const s = $('#sheet'); if (s) s.hidden = true; } return; }
  const f = ACT[a.dataset.act]; if (!f) return;
  if (a.tagName === 'BUTTON' || a.dataset.act !== 'body-rec') { if (a.tagName === 'BUTTON') e.preventDefault(); }
  Sound.ensure(); f(a, e);
});
document.addEventListener('input', e => {
  const t = e.target, k = t.dataset.in; if (!k) return;
  if (k === 'lib') { UI.st.lib[t.dataset.k] = t.value; if (t.id === 'lib-q') { $('#lib-res').innerHTML = UI.libResults(); Thumbs.scan($('#lib-res')); } else UI.render(); }
  else if (k === 'libsafe') { UI.st.lib.safe = t.checked; UI.render(); }
  else if (k === 'rec') { UI.st.body.rec = t.checked; UI.render(); }
  
  else if (k === 'path') { Stage.path = t.checked; }
  else if (k === 'plname') UI.st.edit.name = t.value;
  else if (k === 'it') { const it = UI.st.edit.items[+t.dataset.i], key = t.dataset.k; it[key] = key === 'reps' ? t.value : Math.max(0, +t.value || 0); if (key === 'sets' && it.sets < 1) it.sets = 1; const s = $('.ed-sum b'); if (s) s.textContent = Math.round(estSession({warm:[], main:UI.st.edit.items, cool:[]}) / 60) + 6; }
  else if (k === 'edq') { UI.st.editQ = t.value; clearTimeout(UI._edq); UI._edq = setTimeout(() => { UI.render(); const q = $('#ed-q'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); } }, 350); }
  else if (k === 'week') { if (t.value) S.week[t.dataset.d] = t.value; else delete S.week[t.dataset.d]; save(); UI.toast('حُدّث الجدول'); }
  else if (k === 'progex') { UI.st.progEx = t.value; UI.render(); }
  else if (k === 'vol') Sound.setVol(+t.value);
  else if (k === 'pref') { S.prefs[t.dataset.k] = t.checked; save(); }
  else if (k === 'theme') { S.prefs.theme = t.value; save(); applyTheme(); }
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, fd = new FormData(f);
  if (f.id === 'onb') {
    const p = {name:(fd.get('name') || '').trim(), exp:fd.get('exp'), goal:fd.get('goal'), place:fd.get('place'), eq:fd.getAll('eq'), days:+fd.get('days'), min:+fd.get('min'), limits:fd.getAll('limits'), age:+fd.get('age') || null, h:+fd.get('h') || null, w:+fd.get('w') || null};
    const err = $('#onb-err'); if (!p.exp || !p.goal || !p.place || !p.days || !p.min) { err.hidden = false; err.textContent = 'أكمل الأسئلة المرقّمة من ١ إلى ٦.'; return; }
    if (p.age && (p.age < 13 || p.age > 100)) { err.hidden = false; err.textContent = 'العمر يجب أن يكون بين 13 و100.'; return; }
    const first = !S.profile; S.profile = p;
    UI.st.quick = {focus:p.goal === 'mobility' ? 'mobility' : 'full', min:p.min, place:p.place, style:'circuit', picked:null};
    if (first || !Object.keys(S.week).length) autoWeek();
    save(); location.hash = 'home'; UI.toast(first ? 'جاهز! اخترنا لك جدولًا أسبوعيًا وتمرين اليوم.' : 'حُفظ الملف');
  } else if (f.id === 'ask') { const i = $('#ask-in'); askCoach(i.value); }
  else if (f.id === 'journal') { S.journal.push({id:uid(), date:fd.get('date'), level:+fd.get('level'), groups:fd.getAll('groups'), sleep:+fd.get('sleep'), energy:+fd.get('energy'), note:(fd.get('note') || '').slice(0, 140)}); save(); UI.render(); UI.toast('حُفظت الملاحظة'); }
});
document.addEventListener('change', e => { if (e.target.id === 'j-level') {} });
document.addEventListener('input', e => { if (e.target.id === 'j-level') $('#j-lv').textContent = e.target.value; });
// drag & drop reorder in builder
let dragI = null;
document.addEventListener('dragstart', e => { const li = e.target.closest && e.target.closest('#items li[draggable]'); if (li) { dragI = +li.dataset.i; e.dataTransfer.effectAllowed = 'move'; li.classList.add('drag'); } });
document.addEventListener('dragover', e => { const li = e.target.closest && e.target.closest('#items li[draggable]'); if (li && dragI != null) { e.preventDefault(); $$('#items li').forEach(x => x.classList.toggle('over', x === li)); } });
document.addEventListener('drop', e => { const li = e.target.closest && e.target.closest('#items li[draggable]'); if (li && dragI != null) { e.preventDefault(); const to = +li.dataset.i, a = UI.st.edit.items, [m] = a.splice(dragI, 1); a.splice(to, 0, m); dragI = null; UI.render(); } });
document.addEventListener('dragend', () => { dragI = null; $$('#items li').forEach(x => x.classList.remove('drag', 'over')); });

function boot() {
  load(); document.documentElement.lang = 'ar'; document.documentElement.dir = 'rtl';
  UI.shell(); applyTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => Stage.theme());
  window.addEventListener('hashchange', () => UI.render());
  if (!location.hash && S.live && !S.live.done) location.hash = 'workout';
  UI.render();
}
boot();
