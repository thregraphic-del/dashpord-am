// Plans/builder, calendar, live workout view, progress analytics
UI.views.plans = function () {
  const tab = this.st.plansTab;
  const tabs = `<div class="seg wide">${[['mine','خططي'],['ready','البرامج الجاهزة'],['week','الجدول الأسبوعي'],['cal','التقويم الشهري']].map(([k, t]) => `<button aria-pressed="${tab === k}" data-act="ptab" data-v="${k}">${t}</button>`).join('')}</div>`;
  let body = '';
  if (this.st.edit) body = this.editor();
  else if (tab === 'mine') body = S.plans.length ? `<div class="plist">${S.plans.map(p => this.planCard(p)).join('')}</div>` : `<div class="empty"><h3>لا توجد خطط بعد</h3><p class="muted">أنشئ خطة من الصفر، أو انسخ برنامجًا جاهزًا وعدّله.</p></div>`;
  else if (tab === 'ready') body = `<div class="plist">${PROGRAMS.map(p => this.planCard(progPlan(p))).join('')}</div>`;
  else if (tab === 'week') body = this.weekView();
  else body = this.calView();
  return `<section class="page-head row"><div><h1>الخطط والجدول</h1><p class="muted">ابنِ خطتك، رتّب التمارين بالسحب، ووزّعها على أيام الأسبوع.</p></div>${!this.st.edit ? `<button class="btn primary" data-act="new-plan">${ic('plus')} خطة جديدة</button>` : ''}</section>${!this.st.edit ? tabs : ''}${body}`;
};
UI.planCard = function (p) {
  const mins = Math.round(estSession({warm:[], main:p.items, cool:[]}) / 60) + 6;
  const days = Object.entries(S.week).filter(([, v]) => v === p.id).map(([d]) => DAYS[d]);
  return `<article class="card pcard"><div class="pc-h"><div><h3>${esc(p.name)}</h3><p class="muted small">${p.tag ? esc(p.tag) + ' · ' : ''}${p.items.length} تمارين · ≈ ${mins} دقيقة${days.length ? ' · ' + days.join('، ') : ''}</p></div></div>
  <p class="small">${p.items.map(it => esc(EXI[it.id].ar)).join(' · ')}</p>
  <div class="pc-a"><button class="btn primary sm" data-act="start-plan" data-id="${p.id}">${ic('play')} ابدأ</button>${p.builtIn ? `<button class="btn sm" data-act="dup-plan" data-id="${p.id}">${ic('copy')} نسخ وتعديل</button>` : `<button class="btn sm" data-act="edit-plan" data-id="${p.id}">تعديل</button><button class="btn sm" data-act="dup-plan" data-id="${p.id}">${ic('copy')} نسخ</button><button class="btn sm ghost" data-act="del-plan" data-id="${p.id}">${ic('trash')} حذف</button>`}</div></article>`;
};
UI.editor = function () {
  const p = this.st.edit, mins = Math.round(estSession({warm:[], main:p.items, cool:[]}) / 60) + 6;
  const groups = this.st.editGroup || '';
  const pool = EX.filter(e => !groups || MUSCLES[e.prim[0]].g === groups).filter(e => !this.st.editQ || e.ar.includes(this.st.editQ) || e.en.toLowerCase().includes(this.st.editQ.toLowerCase())).slice(0, 40);
  return `<section class="card editor">
    <div class="field"><label for="pl-name">اسم الخطة</label><input id="pl-name" data-in="plname" value="${esc(p.name)}" maxlength="60"></div>
    <div class="ed-sum"><span>${p.items.length} تمارين · ≈ <b>${mins}</b> دقيقة مع الإحماء والتهدئة</span><span class="ed-fit"><select id="fit-min">${[20, 30, 45, 60].map(m => `<option value="${m}">${m} دقيقة</option>`).join('')}</select><button class="btn sm" data-act="fit">ضغط الخطة لهذه المدة</button></span></div>
    <ul class="items" id="items">${p.items.length ? p.items.map((it, i) => { const e = EXI[it.id]; return `<li draggable="true" data-i="${i}"><span class="grip" aria-hidden="true">${ic('drag')}</span><div class="it-n"><b>${esc(e.ar)}</b><span class="muted small">${esc(muscleNames(e.prim))}</span></div>
      <label>مجموعات<input type="number" min="1" max="10" value="${it.sets}" data-in="it" data-i="${i}" data-k="sets" id="it-s-${i}"></label>
      ${it.t ? `<label>ثوانٍ<input type="number" min="5" max="600" value="${it.t}" data-in="it" data-i="${i}" data-k="t" id="it-t-${i}"></label>` : `<label>عدّات<input value="${esc(it.reps)}" data-in="it" data-i="${i}" data-k="reps" id="it-r-${i}" size="5"></label>`}
      <label>الوزن كغ<input type="number" min="0" step="0.5" value="${it.weight || 0}" data-in="it" data-i="${i}" data-k="weight" id="it-w-${i}"></label>
      <label>راحة ث<input type="number" min="0" max="600" step="5" value="${it.rest}" data-in="it" data-i="${i}" data-k="rest" id="it-rs-${i}"></label>
      <span class="it-a"><button class="icon-btn" data-act="it-up" data-i="${i}" aria-label="تحريك للأعلى">${ic('up')}</button><button class="icon-btn" data-act="it-down" data-i="${i}" aria-label="تحريك للأسفل">${ic('down')}</button><button class="icon-btn" data-act="it-swap" data-i="${i}" aria-label="استبدال ببديل">${ic('swap')}</button><button class="icon-btn" data-act="it-del" data-i="${i}" aria-label="حذف">${ic('trash')}</button></span></li>`; }).join('') : '<li class="muted empty-row">أضف تمارين من القائمة بالأسفل.</li>'}</ul>
    <div class="ed-act"><button class="btn primary" data-act="save-plan">حفظ الخطة</button><button class="btn" data-act="cancel-edit">إلغاء</button></div>
    <h3>أضف تمارين</h3>
    <div class="filters"><input type="search" id="ed-q" data-in="edq" placeholder="ابحث…" value="${esc(this.st.editQ || '')}"><div class="chips">${[['','الكل'], ...Object.entries(GROUPS).map(([k, g]) => [k, g.ar])].map(([k, t]) => `<button class="chip" aria-pressed="${groups === k}" data-act="ed-group" data-v="${k}">${t}</button>`).join('')}</div></div>
    <div class="addlist">${pool.map(e => `<button class="addx" data-act="it-add" data-id="${e.id}">${ic('plus')}<span>${esc(e.ar)}</span><small class="muted">${e.eq.map(q => EQ[q]).join('/')}</small></button>`).join('')}</div>
  </section>`;
};
UI.weekView = function () {
  const plans = allPlans();
  return `<section class="card"><p class="muted">اختر خطة لكل يوم. يظهر تمرين اليوم في الرئيسية تلقائيًا.</p><div class="week">${DAYS.map((d, i) => `<div class="wday ${new Date().getDay() === i ? 'today' : ''}"><b>${d}</b><select id="wk-${i}" data-in="week" data-d="${i}"><option value="">راحة</option>${plans.map(p => `<option value="${p.id}" ${S.week[i] === p.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select></div>`).join('')}</div>
  ${S.profile ? `<button class="btn" data-act="auto-week">وزّع الأيام تلقائيًا حسب ملفي (${S.profile.days} أيام)</button>` : ''}</section>`;
};
UI.calView = function () {
  const base = this.st.calMonth ? new Date(this.st.calMonth) : new Date(); base.setDate(1);
  const y = base.getFullYear(), m = base.getMonth(), first = new Date(y, m, 1).getDay(), n = new Date(y, m + 1, 0).getDate();
  const done = {}; S.history.forEach(h => { const k = dayKey(h.date); (done[k] = done[k] || []).push(h); });
  const cells = []; for (let i = 0; i < first; i++) cells.push('<div class="cday off"></div>');
  for (let d = 1; d <= n; d++) {
    const dt = new Date(y, m, d), k = dayKey(dt), H = done[k] || [], pl = S.week[dt.getDay()] && findPlan(S.week[dt.getDay()]), isT = k === dayKey(new Date());
    cells.push(`<div class="cday ${isT ? 'today' : ''} ${H.length ? 'done' : ''}"><span class="dn">${d}</span>${H.map(h => `<span class="ev done" title="${esc(h.name)}">✓ ${esc(h.name).slice(0, 18)}</span>`).join('')}${!H.length && pl && dt >= new Date(new Date().toDateString()) ? `<span class="ev plan">${esc(pl.name).slice(0, 18)}</span>` : ''}</div>`);
  }
  return `<section class="card"><div class="calh"><button class="icon-btn" data-act="cal" data-v="-1" aria-label="الشهر السابق">›</button><h3>${MONTHS[m]} ${y}</h3><button class="icon-btn" data-act="cal" data-v="1" aria-label="الشهر التالي">‹</button></div>
  <div class="calg">${DAYS.map(d => `<div class="cdh">${d.slice(0, 3)}</div>`).join('')}${cells.join('')}</div><div class="legend"><span><i class="dot good"></i>تمرين مكتمل</span><span><i class="dot acc"></i>مجدول</span></div></section>`;
};

// ---------- LIVE WORKOUT ----------
UI.views.workout = function () {
  if (!S.live) return `<div class="empty"><h3>لا توجد جلسة نشطة</h3><p class="muted">اختر تمرينًا من الرئيسية أو من خططك ثم اضغط «ابدأ».</p><a class="btn primary" href="#home">اختيار تمرين</a></div>`;
  return `<div class="live"><div class="lw-top"><div><span class="muted small">الوقت الكلي</span><b id="lw-el" class="mono">0:00</b></div><div class="lw-prog"><div class="bar"><i id="lw-pb"></i></div><span class="small muted" id="lw-pt"></span></div><button class="icon-btn" data-act="music" id="lw-music" aria-label="الموسيقى">${ic('music')}</button><button class="btn sm ghost" data-act="end-ask">إنهاء</button></div>
  <div class="lw-body"><div class="stage-wrap card"><div class="stage tall" id="stage"><div class="phase" id="phase"></div></div>
  <div class="stage-bar"><div class="seg">${[['front','أمام'],['side','جانب'],['back','خلف']].map(([k, t]) => `<button data-act="view" data-v="${k}">${t}</button>`).join('')}</div><div class="seg">${[.5, 1].map(s => `<button data-act="speed" data-v="${s}">${s === 1 ? 'عادي' : 'بطيء'}</button>`).join('')}</div></div></div>
  <div id="lw-panel" class="lw-panel"></div></div><div id="lw-confirm"></div></div>`;
};
UI.after.workout = function () { if (!S.live) return; Stage.mount($('#stage'), {mode:'demo'}); Stage.speed = 1; Stage.playing = true; Live.shownEx = null; this.livePanel(); Live.run(); };
UI.livePanel = function () {
  const el = $('#lw-panel'); if (!el || !S.live) return;
  const L = S.live;
  if (L.done) return this.liveSummary(el);
  const c = Live.cur, show = c.kind === 'rest' ? Live.nextWork() : c;
  if (show && show.id !== Live.shownEx && Stage.ok) { Live.shownEx = show.id; Stage.setAnim(EXI[show.id], {}); Stage.onPhase = ph => { const p = $('#phase'); if (p && p.textContent !== ph.name) p.textContent = ph.name; }; }
  const phT = {warm:'إحماء', main:'التمرين الأساسي', cool:'تهدئة'}[c.ph];
  const paused = !!L.pausedAt;
  let main;
  if (c.kind === 'rest') {
    const n = Live.nextWork();
    main = `<p class="eyebrow">${phT} · راحة</p><h2>استرح وتنفّس</h2><div class="bigt mono" id="lw-t">0:00</div>
    ${n ? `<div class="next card"><span class="muted small">التالي</span><b>${esc(EXI[n.id].ar)}</b><span class="small">${n.kind === 'reps' ? `المجموعة ${n.set} من ${n.sets} · ${n.target} عدّة${n.weight ? ' · ' + n.weight + ' كغ' : ''}` : n.dur + ' ثانية'}</span></div>` : ''}
    <div class="lw-btns"><button class="btn" data-act="lw-extend">+15 ثانية</button><button class="btn primary big" data-act="lw-next">تخطّي الراحة</button></div>`;
  } else {
    const e = EXI[c.id], t = TX[e.tx] || TX.mob, pg = c.kind === 'reps' && c.set === 1 ? progression(c.id, c) : null;
    const firstTime = !S.history.some(h => h.sets.some(s => s.id === c.id));
    main = `<p class="eyebrow">${phT}${c.set ? ` · المجموعة ${c.set} من ${c.sets}` : ''}</p><h2>${exName(e)}</h2>
    <p class="mus small"><span class="mdot prim"></span>${esc(muscleNames(e.prim))}${e.sec.length ? ` <span class="mdot sec"></span>${esc(muscleNames(e.sec))}` : ''}</p>
    ${c.kind === 'time' ? `<div class="bigt mono" id="lw-t">0:00</div>` : `
      <div class="reps"><button class="icon-btn lg" data-act="lw-rep" data-v="-1" aria-label="إنقاص عدّة">−</button><div><b class="mono" id="lw-reps">${c.reps_done ?? c.target}</b><span class="muted small">عدّة (الهدف ${esc(c.reps)})</span></div><button class="icon-btn lg" data-act="lw-rep" data-v="1" aria-label="زيادة عدّة">+</button></div>
      ${e.eq.some(q => q !== 'bw' && q !== 'bench') ? `<div class="reps w"><button class="icon-btn" data-act="lw-w" data-v="-${e.eq[0] === 'bb' ? 2.5 : 1}" aria-label="إنقاص الوزن">−</button><div><b class="mono" id="lw-wt">${c.weight || 0}</b><span class="muted small">كغ</span></div><button class="icon-btn" data-act="lw-w" data-v="${e.eq[0] === 'bb' ? 2.5 : 1}" aria-label="زيادة الوزن">+</button></div>` : ''}
      <p class="small muted">مدة المجموعة: <span class="mono" id="lw-t">0:00</span>${S.prefs.guided ? ` · العدّ الإيقاعي: <b id="lw-g">0</b>` : ''}</p>`}
    ${pg ? `<p class="hint">${esc(pg.text)}</p>` : ''}
    ${firstTime && c.ph === 'main' && c.set === 1 ? `<details class="learn" open><summary>أول مرة تؤدي هذا التمرين؟</summary><ol class="steps">${t.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol><p class="small"><b>تجنّب:</b> ${esc(t.mis[0])}</p></details>` : `<p class="small cue">${esc(t.steps[1] || t.steps[0])}</p>`}
    <div class="lw-btns">${c.kind === 'reps' ? `<button class="btn primary big" data-act="lw-done">✓ أنهيت المجموعة</button>` : `<button class="btn primary big" data-act="lw-next">التالي</button>`}<button class="btn sm ghost" data-act="lw-swap">${ic('swap')} بديل</button></div>`;
  }
  el.innerHTML = `${main}<div class="lw-ctrl"><button class="btn" data-act="lw-prev">${ic('next')} السابق</button><button class="btn" data-act="${paused ? 'lw-resume' : 'lw-pause'}">${paused ? ic('play') + ' استئناف' : ic('pause') + ' إيقاف مؤقت'}</button><button class="btn" data-act="lw-skip">تخطّي التمرين ${ic('prev')}</button></div>${paused ? '<p class="paused">متوقف مؤقتًا</p>' : ''}${(L.sess.notes || []).length && L.i < 3 ? `<p class="note">${L.sess.notes.map(esc).join('<br>')}</p>` : ''}`;
  this.liveTick();
};
UI.liveTick = function () {
  const L = S.live; if (!L || !$('#lw-el')) return;
  $('#lw-el').textContent = fmt(Live.sessElapsed());
  const pct = L.done ? 100 : L.i / L.steps.length * 100; $('#lw-pb').style.width = pct + '%';
  const works = L.steps.filter(s => s.kind !== 'rest').length, doneW = L.steps.slice(0, L.i).filter(s => s.kind !== 'rest').length;
  $('#lw-pt').textContent = `${doneW} من ${works} خطوة`;
  const c = Live.cur, t = $('#lw-t');
  if (t && c && !L.done) t.textContent = c.dur ? fmt(Math.ceil(Live.remaining())) : fmt(Live.stepElapsed());
  const g = $('#lw-g'); if (g && c) g.textContent = c.guided || 0;
};
UI.liveSummary = function (el) {
  const L = S.live, h = S.history.find(x => x.id === L.histId), sets = L.log.filter(x => x.reps), reps = sets.reduce((a, s) => a + s.reps, 0), vol = sets.reduce((a, s) => a + s.reps * (s.weight || 0), 0);
  const mus = new Set(); L.log.forEach(x => EXI[x.id].prim.forEach(m => mus.add(m)));
  if (Stage.ok) { Stage.setAnim(null); Stage.setHL({prim:[...mus], sec:[]}); Stage.autoRot = true; }
  el.innerHTML = `<p class="eyebrow">اكتملت الجلسة</p><h2>أحسنت! 🎉</h2>
  <div class="sumg"><div><b class="mono">${fmt((L.endAt - L.start - L.pausedTotal) / 1000)}</b><span>المدة</span></div><div><b>${sets.length}</b><span>مجموعة</span></div><div><b>${num(reps)}</b><span>عدّة</span></div><div><b>${num(vol)}</b><span>كغ حجم كلي</span></div></div>
  <p class="small">العضلات التي درّبتها (ملوّنة على المجسم): ${esc(muscleNames([...mus]))}</p>
  ${h ? `<div class="field"><label>كيف كانت الشدة؟</label><div class="chips">${[['easy','سهلة'],['ok','مناسبة'],['hard','صعبة']].map(([k, t]) => `<button class="chip" aria-pressed="${h.rating === k}" data-act="rate" data-v="${k}">${t}</button>`).join('')}</div>${h.rating === 'easy' ? '<p class="hint">سنقترح عليك زيادة بسيطة في الوزن أو العدّات المرة القادمة.</p>' : h.rating === 'hard' ? '<p class="hint">خذ راحة كافية، وحافظ على نفس الحمل المرة القادمة حتى يصبح مريحًا.</p>' : ''}</div>` : '<p class="muted">لم تُسجَّل مجموعات في هذه الجلسة.</p>'}
  <div class="lw-btns"><button class="btn primary big" data-act="lw-close">عرض تقدمي</button><a class="btn" href="#home" data-act="lw-close-home">الرئيسية</a></div>`;
  const top = $('.lw-top'); if (top) top.querySelector('[data-act="end-ask"]').hidden = true;
};

// ---------- PROGRESS ----------
const svgBars = (vals, labels, unit = '') => {
  const W = 320, H = 150, pad = 22, max = Math.max(1, ...vals), bw = (W - pad) / vals.length;
  return `<svg viewBox="0 0 ${W} ${H + 24}" class="chart" role="img">${[0, .5, 1].map(f => `<line x1="${pad}" x2="${W}" y1="${H - f * (H - 16)}" y2="${H - f * (H - 16)}" class="grid"/><text x="${pad - 4}" y="${H - f * (H - 16) + 4}" class="ax" text-anchor="end">${Math.round(max * f)}</text>`).join('')}
  ${vals.map((v, i) => { const h = v / max * (H - 16), x = pad + i * bw + bw * .18; return `<rect x="${x}" y="${H - h}" width="${bw * .64}" height="${Math.max(h, .5)}" rx="3" class="${i === vals.length - 1 ? 'b1' : 'b0'}"><title>${labels[i]}: ${Math.round(v)}${unit}</title></rect><text x="${x + bw * .32}" y="${H + 16}" class="ax" text-anchor="middle">${labels[i]}</text>`; }).join('')}</svg>`;
};
const svgLine = pts => {
  if (pts.length < 2) return '<p class="muted">تحتاج جلستين على الأقل بوزن مسجّل لرسم المنحنى.</p>';
  const W = 320, H = 150, pad = 28, ys = pts.map(p => p.y), mn = Math.min(...ys) * .9, mx = Math.max(...ys) * 1.05, X = i => pad + i / (pts.length - 1) * (W - pad - 8), Y = v => H - (v - mn) / (mx - mn || 1) * (H - 16);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${X(i)},${Y(p.y)}`).join('');
  return `<svg viewBox="0 0 ${W} ${H + 22}" class="chart"><line x1="${pad}" x2="${W}" y1="${H}" y2="${H}" class="grid"/>${[mn, (mn + mx) / 2, mx].map(v => `<text x="${pad - 4}" y="${Y(v) + 4}" class="ax" text-anchor="end">${Math.round(v)}</text>`).join('')}
  <path d="${d}L${X(pts.length - 1)},${H}L${X(0)},${H}Z" class="area"/><path d="${d}" class="ln"/>${pts.map((p, i) => `<circle cx="${X(i)}" cy="${Y(p.y)}" r="${i === pts.length - 1 ? 4 : 2.5}" class="pt"><title>${p.l}: ${p.y.toFixed(1)} كغ</title></circle>`).join('')}
  <text x="${X(0)}" y="${H + 16}" class="ax">${pts[0].l}</text><text x="${X(pts.length - 1)}" y="${H + 16}" class="ax" text-anchor="end">${pts[pts.length - 1].l}</text></svg>`;
};
UI.views.progress = function () {
  const H = S.history;
  if (!H.length) return `<section class="page-head"><h1>مركز التقدم</h1></section><div class="empty card"><h3>لا توجد بيانات بعد</h3><p class="muted">عند إكمال أول جلسة تمرين سيظهر هنا سجلّك وتطورك والتزامك وتوزيع تمارينك على العضلات.</p><a class="btn primary" href="#home">ابدأ أول تمرين</a><button class="btn" data-act="demo">عرض بيانات تجريبية للمعاينة</button></div>`;
  const now = Date.now(), T = totals(H), last30 = H.filter(h => now - new Date(h.date) < 30 * 864e5), prev30 = H.filter(h => { const a = now - new Date(h.date); return a >= 30 * 864e5 && a < 60 * 864e5; });
  const A = totals(last30), B = totals(prev30), delta = (a, b) => b ? `<span class="${a >= b ? 'up' : 'down'}">${a >= b ? '▲' : '▼'} ${Math.abs(Math.round((a - b) / b * 100))}%</span>` : '';
  const weeks = [], wl = []; for (let i = 7; i >= 0; i--) { const ws = new Date(+weekStart() - i * 7 * 864e5); const l = H.filter(h => inWeek(h, ws)); weeks.push(l.length); wl.push(i === 0 ? 'الحالي' : `${ws.getDate()}/${ws.getMonth() + 1}`); }
  const months = [], ml = []; for (let i = 5; i >= 0; i--) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i); months.push(H.filter(h => { const x = new Date(h.date); return x.getMonth() === d.getMonth() && x.getFullYear() === d.getFullYear(); }).length); ml.push(MONTHS[d.getMonth()].slice(0, 5)); }
  const L = muscleLoad(30), gsum = Object.entries(GROUPS).map(([g, G]) => [G.ar, G.m.reduce((a, m) => a + L[m], 0)]), gmax = Math.max(1, ...gsum.map(x => x[1]));
  const bal = balance(30), P = prs(), prList = Object.entries(P).filter(([id]) => EXI[id]).sort((a, b) => b[1].e1 - a[1].e1 || b[1].r - a[1].r).slice(0, 8);
  const weighted = [...new Set(H.flatMap(h => h.sets.filter(s => s.weight > 0).map(s => s.id)))];
  const pe = this.st.progEx && weighted.includes(this.st.progEx) ? this.st.progEx : weighted[0];
  const pts = pe ? H.filter(h => h.sets.some(s => s.id === pe && s.weight)).map(h => { const best = Math.max(...h.sets.filter(s => s.id === pe && s.weight).map(s => s.weight * (1 + (s.reps || 1) / 30))); const d = new Date(h.date); return {y:best, l:`${d.getDate()}/${d.getMonth() + 1}`}; }) : [];
  // heatmap 16 weeks
  const days = {}; H.forEach(h => { const k = dayKey(h.date); days[k] = (days[k] || 0) + h.dur / 60; });
  const start = new Date(+weekStart() - 15 * 7 * 864e5), cells = [];
  for (let w = 0; w < 16; w++) for (let d = 0; d < 7; d++) { const dt = new Date(+start + (w * 7 + d) * 864e5), k = dayKey(dt), v = days[k] || 0; cells.push(`<rect x="${w * 15}" y="${d * 15}" width="12" height="12" rx="2" class="hm${v ? (v > 40 ? 3 : v > 20 ? 2 : 1) : 0}${dt > new Date() ? ' fut' : ''}"><title>${k}${v ? ': ' + Math.round(v) + ' دقيقة' : ''}</title></rect>`); }
  const ratio = (a, b) => a + b ? Math.round(a / (a + b) * 100) : 50;
  const pushPct = ratio(bal.push, bal.pull), upPct = ratio(bal.upper, bal.lower);
  const balMsg = Math.abs(pushPct - 50) > 15 ? (pushPct > 50 ? 'تمارين الدفع أكثر بوضوح من السحب. أضف تجديفًا أو سحبًا لحماية الكتفين ودعم الوقفة.' : 'تمارين السحب أكثر من الدفع. أضف ضغطًا للصدر أو الكتف.') : 'توازن جيد بين الدفع والسحب.';
  return `<section class="page-head row"><div><h1>مركز التقدم</h1><p class="muted">تاريخك وتطورك والتزامك وتوزيع تمارينك.</p></div>${H.some(h => h.demo) ? '<button class="btn sm ghost" data-act="demo-clear">حذف البيانات التجريبية</button>' : ''}</section>
  ${H.some(h => h.demo) ? '<p class="note">تعرض الصفحة بيانات تجريبية للمعاينة، وليست تمارينك الحقيقية.</p>' : ''}
  <section class="grid4">
    <div class="card stat"><span class="muted">الجلسات (30 يومًا)</span><b class="n">${A.n}</b>${delta(A.n, B.n)}</div>
    <div class="card stat"><span class="muted">المجموعات</span><b class="n">${num(A.sets)}</b>${delta(A.sets, B.sets)}</div>
    <div class="card stat"><span class="muted">الحجم الكلي</span><b class="n">${num(A.vol)}<small> كغ</small></b>${delta(A.vol, B.vol)}</div>
    <div class="card stat"><span class="muted">وقت التمرين</span><b class="n">${num(A.min)}<small> د</small></b>${delta(A.min, B.min)}</div>
  </section>
  <p class="muted small">النسب مقارنة بالثلاثين يومًا السابقة. المجموع منذ البداية: ${T.n} جلسة · ${num(T.reps)} عدّة · ${num(T.min)} دقيقة.</p>
  <section class="grid2">
    <div class="card"><h3>الجلسات أسبوعيًا</h3>${svgBars(weeks, wl)}</div>
    <div class="card"><h3>الجلسات شهريًا</h3>${svgBars(months, ml)}</div>
    <div class="card"><h3>تقويم الالتزام (16 أسبوعًا)</h3><div class="hmwrap"><svg viewBox="0 0 240 105" class="heat">${cells.join('')}</svg></div><div class="legend"><span>أقل</span><i class="sw hm0"></i><i class="sw hm1"></i><i class="sw hm2"></i><i class="sw hm3"></i><span>أكثر</span></div></div>
    <div class="card"><h3>توزيع التمرين على العضلات (30 يومًا)</h3><div class="hbars">${gsum.sort((a, b) => b[1] - a[1]).map(([n, v]) => `<div><span>${n}</span><i style="width:${v / gmax * 100}%"></i><b>${Math.round(v)}</b></div>`).join('')}</div><p class="muted small">عدد المجموعات: العضلة الأساسية تُحسب مجموعة كاملة، والمساعدة نصف مجموعة.</p></div>
    <div class="card"><h3>مؤشر التوازن</h3><div class="balance"><span>دفع ${pushPct}%</span><div class="bar2"><i style="width:${pushPct}%"></i></div><span>سحب ${100 - pushPct}%</span></div><div class="balance"><span>علوي ${upPct}%</span><div class="bar2"><i style="width:${upPct}%"></i></div><span>سفلي ${100 - upPct}%</span></div><p class="small">${balMsg}</p></div>
    <div class="card"><h3>تطور القوة</h3>${weighted.length ? `<select id="prog-ex" data-in="progex">${weighted.map(id => `<option value="${id}" ${id === pe ? 'selected' : ''}>${esc(EXI[id].ar)}</option>`).join('')}</select>${svgLine(pts)}<p class="muted small">القيمة: تقدير أقصى تكرار واحد (معادلة Epley: الوزن × (1 + العدّات/30)). تقدير تقريبي وليس اختبارًا فعليًا.</p>` : '<p class="muted">سجّل أوزانًا في تمارينك لترى منحنى القوة.</p>'}</div>
  </section>
  <section class="card"><h3>الأرقام القياسية الشخصية</h3>${prList.length ? `<div class="prs">${prList.map(([id, p]) => `<a class="pr" href="#ex-${id}"><span>${esc(EXI[id].ar)}</span><b>${p.w ? p.w + ' كغ × ' + p.r : p.r + ' عدّة'}</b><small class="muted">${new Date(p.date).toLocaleDateString('ar-SA-u-nu-latn')}</small></a>`).join('')}</div>` : '<p class="muted">لا توجد أرقام بعد.</p>'}</section>
  <section class="card"><h3>سجل التمارين</h3><ul class="hist">${[...H].reverse().slice(0, 30).map(h => { const t = totals([h]); return `<li><details><summary><b>${esc(h.name)}</b><span class="muted small">${new Date(h.date).toLocaleDateString('ar-SA-u-nu-latn', {weekday:'long', day:'numeric', month:'long'})} · ${fmt(h.dur)} · ${t.sets} مجموعة${h.rating ? ' · ' + {easy:'سهلة', ok:'مناسبة', hard:'صعبة'}[h.rating] : ''}</span></summary>
    <table class="tbl"><tbody>${h.sets.map(s => `<tr><td>${esc((EXI[s.id] || {ar:s.id}).ar)}</td><td>${s.reps ? s.reps + ' عدّة' : (s.t || 0) + ' ث'}</td><td>${s.weight ? s.weight + ' كغ' : '—'}</td></tr>`).join('')}</tbody></table><button class="btn sm ghost" data-act="del-hist" data-id="${h.id}">${ic('trash')} حذف هذه الجلسة</button></details></li>`; }).join('')}</ul>
    <a class="link" href="#prefs">تصدير السجل</a></section>`;
};
