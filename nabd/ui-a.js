// UI shell, router, home, anatomy explorer, library, exercise detail
const IC = {
  home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  body:'<circle cx="12" cy="4.5" r="2"/><path d="M5 8.5h14M12 8.5v5.5m0 0-3 7m3-7 3 7"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  chart:'<path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/>',
  more:'<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  play:'<path d="M7 5v14l12-7z"/>', pause:'<path d="M8 5v14M16 5v14"/>', next:'<path d="M17 6v12M7 6l8 6-8 6z"/>', prev:'<path d="M7 6v12M17 6l-8 6 8 6z"/>',
  star:'<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>', music:'<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  theme:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/>', plus:'<path d="M12 5v14M5 12h14"/>', x:'<path d="M6 6l12 12M18 6 6 18"/>',
  up:'<path d="M12 19V5M6 11l6-6 6 6"/>', down:'<path d="M12 5v14M6 13l6 6 6-6"/>', trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>', leaf:'<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7"/>', user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>', gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  drag:'<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/>', swap:'<path d="M4 8h13l-3-3M20 16H7l3 3"/>'
};
const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const NAV = [['home','الرئيسية','home'],['body','الجسم','body'],['library','التمارين','list'],['plans','الخطط','cal'],['progress','التقدم','chart']];
const MORE = [['coach','المدرب الذكي','chat'],['recovery','الإحماء والاستشفاء','leaf'],['music','الموسيقى','music'],['profile','ملفي','user'],['prefs','الإعدادات والخصوصية','gear']];
const lvlDots = l => `<span class="lvl" title="${LVL[l]}">${[1,2,3].map(i => `<i class="${i <= l ? 'on' : ''}"></i>`).join('')}<b>${LVL[l]}</b></span>`;
const chipsM = (ids, cls) => ids.map(m => `<button class="mchip ${cls}" data-act="muscle" data-id="${m}">${esc(MUSCLES[m].ar)}</button>`).join('');

const UI = {
  st:{lib:{q:'', cat:'', lvl:'', eq:[], place:'', kind:'', mech:'', impact:'', tab:'all', sort:'fit', adv:false}, body:{sel:null, rec:false, rot:true}, quick:{focus:'legs', min:30, place:null}, plansTab:'mine', edit:null, progEx:null, chat:[], confirm:null, detail:{fault:false, speed:1}, calMonth:null},
  route() { const h = (location.hash || '').slice(1); if (h.startsWith('ex-')) return {v:'ex', id:h.slice(3)}; return {v:h || (S.profile ? 'home' : 'welcome')}; },
  render() {
    const r = this.route(), V = this.views[r.v] ? r.v : 'home';
    if (V !== 'workout') Live.stop();
    Stage.unmount(); Stage.onPhase = null; Stage.rec = null; Stage.sel = null;
    document.body.dataset.view = V;
    $('#main').innerHTML = this.views[V].call(this, r);
    $$('.tabbar a, .dnav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + V || (V === 'ex' && a.getAttribute('href') === '#library')));
    $('#sheet').hidden = true;
    if (this.after[V]) this.after[V].call(this, r);
    window.scrollTo(0, 0);
    this.musicChanged();
  },
  shell() {
    $('#app').innerHTML = `
    <header class="top"><div class="top-in">
      <a class="brand" href="#home"><span class="brand-mark"></span>نبض</a>
      <nav class="dnav">${NAV.map(([h, t]) => `<a href="#${h}">${t}</a>`).join('')}${MORE.slice(0, 3).map(([h, t]) => `<a href="#${h}">${t}</a>`).join('')}</nav>
      <div class="tools"><button class="icon-btn" data-act="music" id="mini-music" aria-label="تشغيل الموسيقى أو إيقافها">${ic('music')}</button><button class="icon-btn" data-act="theme" aria-label="تبديل المظهر">${ic('theme')}</button><a class="icon-btn" href="#prefs" aria-label="الإعدادات">${ic('gear')}</a></div>
    </div></header>
    <main id="main"></main>
    <nav class="tabbar">${NAV.map(([h, t, i]) => `<a href="#${h}">${ic(i)}<span>${t}</span></a>`).join('')}<button data-act="more">${ic('more')}<span>المزيد</span></button></nav>
    <div class="sheet" id="sheet" hidden><div class="sheet-in">${MORE.map(([h, t, i]) => `<a href="#${h}">${ic(i)}${t}</a>`).join('')}<a href="#welcome">${ic('home')}عن نبض</a></div></div>
    <div class="toast" id="toast" hidden></div>`;
  },
  toast(t) { const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(this._tt); this._tt = setTimeout(() => el.hidden = true, 2600); },
  musicChanged() { const b = $('#mini-music'); if (b) b.classList.toggle('on', Sound.playing); const m = $('#music-now'); if (m && this.views.music && location.hash === '#music') $('#main').innerHTML = this.views.music.call(this); const lw = $('#lw-music'); if (lw) lw.classList.toggle('on', Sound.playing); },
  views:{}, after:{}
};

// ---------- HOME ----------
UI.views.home = function () {
  const q = this.st.quick; q.place = q.place || (S.profile && S.profile.place) || 'home';
  const sess = genSession(q.focus, q.min, q.place, S.seed), est = Math.round(estSession(sess) / 60);
  const wk = S.history.filter(h => inWeek(h)), T = totals(wk), goal = (S.profile && S.profile.days) || 3;
  const today = new Date().getDay(), plan = S.week[today] && findPlan(S.week[today]);
  const rec = recoveryMap(), ready = [], tired = [];
  Object.keys(GROUPS).forEach(g => { const hrs = GROUPS[g].m.map(m => rec[m]).filter(x => x != null); const mn = hrs.length ? Math.min(...hrs) : null; (mn != null && mn < 48 ? tired : ready).push(GROUPS[g].ar); });
  const ch = challenge(), bd = badges().filter(b => b.ok);
  const greet = new Date().getHours() < 12 ? 'صباح الخير' : 'مساء الخير';
  return `
  ${S.live && !S.live.done ? `<a class="resume" href="#workout"><b>لديك جلسة قيد التقدم</b><span>${esc(S.live.sess.name)} — اضغط للمتابعة</span></a>` : ''}
  <section class="hero-home">
    <div><p class="eyebrow">${greet}${S.profile && S.profile.name ? '، ' + esc(S.profile.name) : ''} · ${DAYS[today]}</p><h1>ماذا ستدرّب اليوم؟</h1></div>
  </section>
  <section class="quick card">
    <div class="quick-head"><h2>تمرين سريع موجّه</h2><span class="muted">من الإحماء حتى التهدئة، ويُسجَّل تلقائيًا</span></div>
    <div class="field"><label>التركيز</label><div class="chips">${Object.entries(FOCUS).map(([k, f]) => `<button class="chip" aria-pressed="${q.focus === k}" data-act="q" data-k="focus" data-v="${k}">${f.ar}</button>`).join('')}</div></div>
    <div class="row2">
      <div class="field"><label>المدة</label><div class="chips">${[15, 30, 45, 60].map(m => `<button class="chip" aria-pressed="${q.min === m}" data-act="q" data-k="min" data-v="${m}">${m} د</button>`).join('')}</div></div>
      <div class="field"><label>المكان</label><div class="chips">${[['home','البيت'],['gym','النادي']].map(([k, t]) => `<button class="chip" aria-pressed="${q.place === k}" data-act="q" data-k="place" data-v="${k}">${t}</button>`).join('')}</div></div>
    </div>
    <ol class="preview">
      ${sess.warm.length ? `<li class="ph"><span class="tag warm">إحماء</span>${sess.warm.map(w => esc(EXI[w.id].ar)).join(' · ')}</li>` : ''}
      ${sess.main.map(m => { const e = EXI[m.id]; return `<li><a href="#ex-${e.id}">${esc(e.ar)}</a><span class="muted">${m.sets} × ${m.t ? m.t + ' ث' : esc(m.reps)}</span></li>`; }).join('')}
      ${sess.cool.length ? `<li class="ph"><span class="tag cool">تهدئة</span>${sess.cool.map(w => esc(EXI[w.id].ar)).join(' · ')}</li>` : ''}
    </ol>
    <div class="quick-foot"><span class="est">≈ ${est} دقيقة · ${sess.main.length} تمارين</span><button class="btn ghost" data-act="reshuffle">${ic('swap')} تشكيلة أخرى</button><button class="btn primary big" data-act="start-quick">${ic('play')} ابدأ التمرين</button></div>
  </section>
  <section class="grid3">
    <div class="card stat"><span class="muted">هذا الأسبوع</span><b class="n">${T.n}<small> / ${goal}</small></b><span>جلسات</span><div class="bar"><i style="width:${Math.min(100, T.n / goal * 100)}%"></i></div></div>
    <div class="card stat"><span class="muted">سلسلة الأيام</span><b class="n">${streak()}</b><span>يوم متتالي</span></div>
    <div class="card stat"><span class="muted">دقائق النشاط</span><b class="n">${num(T.min)}</b><span>هذا الأسبوع</span></div>
  </section>
  <section class="grid2">
    ${plan ? `<div class="card"><h3>مجدول اليوم</h3><p><b>${esc(plan.name)}</b> · ${plan.items.length} تمارين</p><button class="btn primary" data-act="start-plan" data-id="${plan.id}">${ic('play')} ابدأ خطة اليوم</button></div>` : ''}
    <div class="card"><h3>حالة الاستشفاء</h3><p class="muted small">مبنية على آخر مرة درّبت فيها كل مجموعة (أقل من 48 ساعة = ما زالت تتعافى).</p>
      <div class="rec-row"><span class="dot good"></span><b>جاهزة:</b> ${ready.join('، ') || '—'}</div><div class="rec-row"><span class="dot warn"></span><b>تتعافى:</b> ${tired.join('، ') || 'لا شيء'}</div>
      <a class="link" href="#body" data-act="body-rec">اعرض خريطة الاستشفاء على الجسم</a></div>
    <div class="card"><h3>تحدي الأسبوع</h3><p>${esc(ch.t)}</p><div class="bar"><i style="width:${Math.min(100, ch.v / ch.goal * 100)}%"></i></div><p class="muted small">${num(ch.v)} من ${ch.goal} ${ch.u}</p></div>
    <div class="card"><h3>الأوسمة</h3>${bd.length ? `<div class="badges">${bd.map(b => `<span class="badge" title="${esc(b.d)}">${esc(b.n)}</span>`).join('')}</div>` : '<p class="muted">أكمل أول تمرين لتحصل على أول وسام.</p>'}<a class="link" href="#profile">كل الأوسمة</a></div>
  </section>
  ${!S.profile ? `<section class="card cta-onb"><div><h3>خصّص التجربة لك</h3><p class="muted">ستة أسئلة سريعة لنختار لك التمارين المناسبة لمستواك وأدواتك.</p></div><a class="btn primary" href="#onboard">إعداد ملفي</a></section>` : ''}`;
};

// ---------- BODY EXPLORER ----------
UI.views.body = function () {
  const b = this.st.body;
  return `<section class="page-head"><h1>الجسم التفاعلي</h1><p class="muted">اسحب يمينًا أو يسارًا لتدوير الجسم، واستخدم عجلة الفأرة للتكبير، واضغط على أي عضلة لتعرف تمارينها.</p></section>
  <div class="explorer">
    <div class="stage-wrap card">
      <div class="stage" id="stage"></div>
      <div class="stage-bar">
        <div class="seg">${[['front','أمام'],['back','خلف'],['right','يمين'],['left','يسار']].map(([k, t]) => `<button data-act="view" data-v="${k}">${t}</button>`).join('')}</div>
        <label class="tog"><input type="checkbox" id="rec-t" data-in="rec" ${b.rec ? 'checked' : ''}> خريطة الاستشفاء</label>
        <label class="tog"><input type="checkbox" id="rot-t" data-in="rot" ${b.rot ? 'checked' : ''}> تدوير تلقائي</label>
      </div>
      ${b.rec ? `<div class="legend"><span><i class="dot bad"></i>أقل من 24 ساعة</span><span><i class="dot warn"></i>24–48 ساعة</span><span><i class="dot good"></i>جاهزة (+48)</span><span><i class="dot base"></i>لم تُدرَّب مؤخرًا</span></div>` : ''}
      <p class="note">رسم توضيحي لجسم بشري بنسب حقيقية، يتحرك على هيكل عظمي بمفاصل حقيقية. العضلات الـ19 قابلة للضغط. الجسم الأنثوي مخطط له لاحقًا.</p>
    </div>
    <aside class="card mpanel" id="mpanel">${this.musclePanel(b.sel)}</aside>
  </div>
  <section class="card"><h3>كل العضلات</h3>${Object.entries(GROUPS).map(([g, G]) => `<div class="mgroup"><b>${G.ar}</b><div class="chips">${G.m.map(m => `<button class="chip" aria-pressed="${b.sel === m}" data-act="sel-muscle" data-id="${m}">${esc(MUSCLES[m].ar)}</button>`).join('')}</div></div>`).join('')}</section>`;
};
UI.musclePanel = function (id) {
  if (!id) return `<h2>اختر عضلة</h2><p class="muted">اضغط على أي عضلة في المجسم أو من القائمة بالأسفل لترى اسمها ووظيفتها وأفضل تمارينها.</p><div class="legend col"><span><i class="dot prim"></i>العضلة المحددة أو المستهدفة أساسًا</span><span><i class="dot sec"></i>عضلات مساعدة</span></div>`;
  const M = MUSCLES[id], list = EX.filter(e => e.prim.includes(id)), secL = EX.filter(e => e.sec.includes(id));
  const beg = list.filter(e => e.lvl === 1), adv = list.filter(e => e.lvl > 1);
  const li = e => `<li><a href="#ex-${e.id}">${esc(e.ar)}</a><span class="muted small">${e.eq.map(q => EQ[q]).join(' / ')}</span></li>`;
  return `<p class="eyebrow">${GROUPS[M.g].ar}</p><h2>${esc(M.ar)}</h2>${S.prefs.en ? `<p class="en">${esc(M.en)}</p>` : ''}
  <dl class="facts"><dt>الموقع</dt><dd>${esc(M.loc)}</dd><dt>الوظيفة</dt><dd>${esc(M.fn)}</dd><dt>تكرار التدريب</dt><dd>${esc(FREQ)}</dd></dl>
  <h4>تمارين للمبتدئين <small class="muted">(تستهدفها أساسًا)</small></h4><ul class="xlist">${beg.map(li).join('') || '<li class="muted">لا يوجد</li>'}</ul>
  <h4>تمارين متوسطة ومتقدمة</h4><ul class="xlist">${adv.map(li).join('') || '<li class="muted">لا يوجد</li>'}</ul>
  <h4>تشارك كعضلة مساعدة في</h4><p class="small">${secL.slice(0, 8).map(e => `<a href="#ex-${e.id}">${esc(e.ar)}</a>`).join('، ') || '—'}</p>
  <h4>أخطاء شائعة</h4><ul class="bul">${M.mist.map(m => `<li>${esc(m)}</li>`).join('')}</ul>
  <button class="btn primary" data-act="filter-muscle" data-id="${id}">كل تمارين ${esc(M.ar)} (${list.length})</button>`;
};
UI.after.body = function () {
  const b = this.st.body;
  Stage.mount($('#stage'), {mode:'explore', autoRot:b.rot, rec:b.rec ? recoveryMap() : null, onPick:id => { if (id) this.selMuscle(id); }});
  Stage.sel = b.sel; if (b.sel) Stage.setHL({prim:[b.sel], sec:[]});
};
UI.selMuscle = function (id) {
  this.st.body.sel = id; Stage.sel = id; Stage.setHL({prim:[id], sec:[]});
  const back = ['traps','upper_back','lats','lower_back','glutes','hamstrings','calves','triceps','delt_rear'].includes(id);
  if (Stage.ok) Stage.view(back ? 'back' : 'front'); Stage.autoRot = false; const rt = $('#rot-t'); if (rt) rt.checked = false; this.st.body.rot = false;
  $('#mpanel').innerHTML = this.musclePanel(id);
  $$('[data-act="sel-muscle"]').forEach(c => c.setAttribute('aria-pressed', c.dataset.id === id));
  if (window.innerWidth < 900) $('#mpanel').scrollIntoView({behavior:'smooth', block:'start'});
};

// ---------- LIBRARY ----------
UI.libResults = function () {
  const f = this.st.lib, q = f.q.trim().toLowerCase(), lvl = userLvl();
  let list = EX.filter(e => {
    if (q && !(e.ar.includes(f.q.trim()) || e.en.toLowerCase().includes(q) || [...e.prim, ...e.sec].some(m => MUSCLES[m].ar.includes(f.q.trim())))) return false;
    if (f.cat) { if (f.cat === 'full' ? !e.full : f.cat.startsWith('m:') ? !e.prim.includes(f.cat.slice(2)) : exCat(e) !== f.cat) return false; }
    if (f.lvl && e.lvl !== +f.lvl) return false;
    if (f.eq.length && !e.eq.some(q => f.eq.includes(q))) return false;
    if (f.place === 'home' && !available(e, HOME_EQ)) return false;
    if (f.place === 'gym' && e.eq.every(x => HOME_EQ.includes(x)) && !e.eq.includes('bb')) { /* gym can do all */ }
    if (f.kind && e.kind !== f.kind) return false;
    if (f.mech === 'c' && (e.iso || e.kind !== 's')) return false;
    if (f.mech === 'i' && !e.iso) return false;
    if (f.impact === 'low' && e.hi) return false;
    if (f.impact === 'high' && !e.hi) return false;
    if (f.safe && limited(e)) return false;
    if (f.tab === 'fav' && !S.favs.includes(e.id)) return false;
    if (f.tab === 'recent' && !S.recent.includes(e.id)) return false;
    return true;
  });
  const sorters = {fit:(a, b) => (Math.abs(a.lvl - lvl) - Math.abs(b.lvl - lvl)) || (b.key - a.key) || (available(b) - available(a)), easy:(a, b) => a.lvl - b.lvl, hard:(a, b) => b.lvl - a.lvl, az:(a, b) => a.ar.localeCompare(b.ar, 'ar'), recent:(a, b) => (S.recent.indexOf(a.id) + 1 || 999) - (S.recent.indexOf(b.id) + 1 || 999)};
  list.sort(sorters[f.sort] || sorters.fit);
  if (!list.length) return `<div class="empty"><h3>لا توجد تمارين بهذه الفلاتر</h3><p class="muted">${f.tab === 'fav' ? 'لم تضف تمارين للمفضلة بعد. اضغط النجمة على أي تمرين.' : f.tab === 'recent' ? 'لم تؤدِّ تمارين بعد. ابدأ جلسة من الرئيسية.' : 'جرّب إزالة بعض الفلاتر.'}</p><button class="btn" data-act="lib-reset">مسح الفلاتر</button></div>`;
  return `<p class="muted small count">${list.length} تمرين</p><div class="exgrid">${list.map(e => this.exCard(e)).join('')}</div>`;
};
UI.exCard = function (e) {
  const fav = S.favs.includes(e.id), lim = limited(e);
  return `<article class="excard"><a href="#ex-${e.id}" class="exlink"><span class="excat">${CATS[exCat(e)]}</span><h3>${exName(e)}</h3>
  <p class="mus"><span class="mdot prim"></span>${esc(muscleNames(e.prim))}${e.sec.length ? ` <span class="muted">+ ${esc(muscleNames(e.sec.slice(0, 2)))}</span>` : ''}</p>
  <div class="meta">${lvlDots(e.lvl)}<span>${e.eq.map(q => EQ[q]).join(' / ')}</span>${e.hi ? '<span class="pill">عالي الصدمة</span>' : ''}${lim ? `<span class="pill warn">${lim}</span>` : ''}</div></a>
  <button class="fav ${fav ? 'on' : ''}" data-act="fav" data-id="${e.id}" aria-label="${fav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}">${ic('star')}</button></article>`;
};
UI.views.library = function () {
  const f = this.st.lib, sel = (k, opts) => `<select id="f-${k}" data-in="lib" data-k="${k}">${opts.map(([v, t]) => `<option value="${v}" ${f[k] == v ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
  return `<section class="page-head"><h1>مكتبة التمارين</h1><p class="muted">${EX.length} تمرينًا بأسماء عربية وإنجليزية، ولكل تمرين عرض حركة حيّ وخطوات وأخطاء شائعة.</p></section>
  <div class="libbar">
    <input type="search" id="lib-q" data-in="lib" data-k="q" placeholder="ابحث باسم التمرين أو العضلة… (مثال: ضغط، أرداف، Squat)" value="${esc(f.q)}">
    <div class="seg">${[['all','الكل'],['fav','المفضلة'],['recent','أُدّيت مؤخرًا']].map(([k, t]) => `<button aria-pressed="${f.tab === k}" data-act="lib-tab" data-v="${k}">${t}</button>`).join('')}</div>
  </div>
  <div class="chips scroll">${[['','الكل'], ...Object.entries(CATS)].map(([k, t]) => `<button class="chip" aria-pressed="${f.cat === k}" data-act="lib-cat" data-v="${k}">${t}</button>`).join('')}${f.cat.startsWith('m:') ? `<button class="chip" aria-pressed="true" data-act="lib-cat" data-v="">${esc(MUSCLES[f.cat.slice(2)].ar)} ✕</button>` : ''}</div>
  <div class="filters">
    ${sel('lvl', [['','كل المستويات'], ['1','مبتدئ'], ['2','متوسط'], ['3','متقدم']])}
    ${sel('place', [['','البيت أو النادي'], ['home','مناسب للبيت'], ['gym','النادي']])}
    ${sel('sort', [['fit','الأنسب لمستواك'], ['easy','الأسهل أولًا'], ['hard','الأصعب أولًا'], ['az','أبجديًا'], ['recent','أُدّيت مؤخرًا']])}
    <button class="btn ghost sm" data-act="lib-adv">${f.adv ? 'إخفاء' : 'فلاتر متقدمة'}</button>
  </div>
  ${f.adv ? `<div class="card advf">
    <div class="field"><label>الأدوات المتاحة</label><div class="chips">${Object.entries(EQ).map(([k, t]) => `<button class="chip" aria-pressed="${f.eq.includes(k)}" data-act="lib-eq" data-v="${k}">${t}</button>`).join('')}</div></div>
    <div class="filters">${sel('kind', [['','كل الأنواع'], ['s','قوة'], ['c','كارديو'], ['m','حركة ومرونة'], ['x','إطالة']])}${sel('mech', [['','مركب أو عزل'], ['c','مركب (عدة مفاصل)'], ['i','عزل (مفصل واحد)']])}${sel('impact', [['','كل الشدات'], ['low','منخفض الصدمة'], ['high','عالي الصدمة']])}
    <label class="tog"><input type="checkbox" id="f-safe" data-in="libsafe" ${f.safe ? 'checked' : ''}> إخفاء ما قد يتعارض مع القيود في ملفي</label></div>
    <p class="note">فلتر القيود إرشادي فقط ولا يغني عن رأي طبيب أو أخصائي علاج طبيعي.</p></div>` : ''}
  <div id="lib-res">${this.libResults()}</div>`;
};

// ---------- EXERCISE DETAIL ----------
UI.views.ex = function (r) {
  const e = EXI[r.id]; if (!e) return '<div class="empty"><h3>لم نجد هذا التمرين</h3><a class="btn" href="#library">العودة للمكتبة</a></div>';
  if (!S.viewed.includes(e.id)) { S.viewed.push(e.id); save(); }
  const t = TX[e.tx] || TX.mob, alt = alternatives(e), fav = S.favs.includes(e.id), lim = limited(e), d = this.st.detail;
  const prog = lastPerformance(e.id), pr = prs()[e.id];
  const altCard = (x, lbl) => x ? `<a class="altc" href="#ex-${x.id}"><span class="muted small">${lbl}</span><b>${esc(x.ar)}</b>${lvlDots(x.lvl)}</a>` : '';
  const dose = e.t ? `${e.sets} × ${e.t} ثانية` : `${e.sets} × ${esc(e.reps)} عدّة`;
  return `<nav class="crumb"><a href="#library">التمارين</a> / <span>${CATS[exCat(e)]}</span></nav>
  <section class="exhead"><div><h1>${esc(e.ar)}</h1>${S.prefs.en ? `<p class="en big">${esc(e.en)}</p>` : ''}
    <div class="meta">${lvlDots(e.lvl)}<span>${e.eq.map(q => EQ[q]).join(' / ')}</span><span>${KIND[e.kind]}</span><span>${e.kind === 's' ? (e.iso ? 'تمرين عزل' : 'تمرين مركب') : ''}</span>${e.hi ? '<span class="pill">عالي الصدمة</span>' : '<span class="pill soft">منخفض الصدمة</span>'}${lim ? `<span class="pill warn">${lim}</span>` : ''}</div></div>
    <div class="exacts"><button class="btn ${fav ? 'on' : ''}" data-act="fav" data-id="${e.id}">${ic('star')} ${fav ? 'في المفضلة' : 'أضف للمفضلة'}</button><button class="btn" data-act="add-to-plan" data-id="${e.id}">${ic('plus')} أضف لخطة</button><button class="btn primary" data-act="try" data-id="${e.id}">${ic('play')} جرّبه الآن</button></div>
  </section>
  <div class="detail">
    <div class="stage-wrap card">
      <div class="stage tall" id="stage"><div class="phase" id="phase">—</div>${d.fault ? `<div class="fault-tag">✕ أداء خاطئ: <span id="fault-t"></span></div>` : ''}</div>
      <div class="stage-bar">
        <div class="seg">${[['front','أمام'],['side','جانب'],['back','خلف'],['left','يسار']].map(([k, t]) => `<button data-act="view" data-v="${k}">${t}</button>`).join('')}</div>
        <button class="icon-btn" data-act="playpause" id="pp" aria-label="تشغيل أو إيقاف الحركة">${ic('pause')}</button>
        <button class="btn sm ghost" data-act="replay">إعادة</button>
        <div class="seg">${[.25, .5, 1].map(s => `<button aria-pressed="${d.speed === s}" data-act="speed" data-v="${s}">${s === 1 ? 'عادي' : s === .5 ? 'بطيء' : 'بطيء جدًا'}</button>`).join('')}</div>
      </div>
      <div class="stage-bar">
        <div class="seg">${[[0,'✓ الأداء الصحيح'],[1,'✕ خطأ شائع']].map(([k, t]) => `<button aria-pressed="${d.fault == k}" data-act="fault" data-v="${k}">${t}</button>`).join('')}</div>
        <label class="tog"><input type="checkbox" id="path-t" data-in="path" ${Stage.path ? 'checked' : ''}> مسار الحركة</label>
      </div>
      <div class="legend"><span><i class="dot prim"></i>أساسية: ${esc(muscleNames(e.prim))}</span>${e.sec.length ? `<span><i class="dot sec"></i>مساعدة: ${esc(muscleNames(e.sec))}</span>` : ''}</div>
      <p class="note">رسم توضيحي متحرك على هيكل عظمي بمفاصل حقيقية لتوضيح المسار والعضلات العاملة، وليس تصويرًا لمدرب حقيقي.</p>
    </div>
    <div class="dcol">
      <div class="card dose"><div><span class="muted small">الجرعة المقترحة</span><b>${dose}</b></div><div><span class="muted small">الراحة</span><b>${e.rest} ث</b></div>${pr ? `<div><span class="muted small">أفضل أداء لك</span><b>${pr.w ? pr.w + ' كغ × ' : ''}${pr.r}</b></div>` : ''}</div>
      ${prog ? `<p class="card small">آخر مرة: ${prog.sets.map(s => (s.weight ? s.weight + 'كغ×' : '') + s.reps).join(' / ')}</p>` : ''}
      <div class="card"><h3>وضعية البداية</h3><p>${esc(t.st)}</p><h3>الخطوات</h3><ol class="steps">${t.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol><h3>التنفس</h3><p>${esc(t.br)}</p></div>
      <div class="card"><h3>أخطاء شائعة</h3><ul class="bul bad">${t.mis.map(m => `<li>${esc(m)}</li>`).join('')}</ul><h3>السلامة</h3><p>${esc(t.saf)}</p><h3>نصيحة المدرب</h3><p>${esc(t.tip)}</p></div>
    </div>
  </div>
  <section class="card"><h3>سلّم الصعوبة</h3><div class="alts">${altCard(alt.easier, 'أسهل')}<div class="altc cur"><span class="muted small">الحالي</span><b>${esc(e.ar)}</b>${lvlDots(e.lvl)}</div>${altCard(alt.harder, 'أصعب')}</div>
  ${alt.related.length ? `<h4>تمارين مشابهة</h4><div class="chips">${alt.related.map(x => `<a class="chip" href="#ex-${x.id}">${esc(x.ar)}</a>`).join('')}</div>` : ''}</section>
  <section class="card evidence"><h3>مصدر المعلومات ومستوى الدليل</h3>
  <ul class="bul"><li><b>عدد المجموعات والتكرارات:</b> مبنيّة على الإرشادات العامة (موقف ACSM 2009: للمبتدئين 1–3 مجموعات من 8–12 تكرارًا، ومرتين إلى ثلاث أسبوعيًا لكل مجموعة عضلية). <span class="pill soft">إرشاد علمي عام</span></li>
  <li><b>العضلات الأساسية والمساعدة:</b> من وظائف العضلات التشريحية المعروفة. <span class="pill soft">مرجع تشريحي</span></li>
  <li><b>نصائح الأداء والتنفس والأخطاء:</b> ممارسات تدريبية شائعة لدى المدربين. <span class="pill soft">توصية تدريبية عملية</span></li></ul>
  <p class="small">${SOURCES.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(n)}</a>`).join(' · ')}</p>
  <p class="note">المحتوى تعليمي ولا يغني عن استشارة مختص صحي، خصوصًا مع وجود إصابة أو حالة مرضية.</p></section>
  <div id="planpick"></div>`;
};
UI.after.ex = function (r) {
  const e = EXI[r.id]; if (!e) return;
  const d = this.st.detail;
  if (!Stage.mount($('#stage'), {mode:'demo'})) return;
  Stage.speed = d.speed; Stage.playing = true;
  Stage.setAnim(e, {fault:d.fault, instant:true});
  const ft = $('#fault-t'); if (ft) ft.textContent = Stage.anim.faultText;
  Stage.onPhase = ph => { const el = $('#phase'); if (el && el.textContent !== ph.name) el.textContent = ph.name; };
};
