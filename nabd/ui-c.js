// Welcome, onboarding, coach, recovery, music, profile, prefs
UI.views.welcome = function () {
  return `<section class="landing"><div class="land-copy"><p class="eyebrow">نبض · منصة تدريب شخصي</p><h1>مدربك الشخصي، ومختبر تشريح، وجلسة تمرين موجّهة، في مكان واحد.</h1>
  <p class="lead">اضغط على أي عضلة لتعرف وظيفتها وتمارينها، وشاهد كل حركة ثلاثية الأبعاد من كل الزوايا. ثم اضغط «ابدأ» ليقودك المدرب من الإحماء إلى التهدئة بالمؤقت والعدّات والصوت، ويسجّل إنجازك تلقائيًا.</p>
  <div class="land-cta"><a class="btn primary big" href="#onboard">ابدأ بإعداد ملفك (دقيقة واحدة)</a><a class="btn big" href="#home">جرّب تمرينًا الآن</a></div>
  <p class="muted small">بلا تسجيل وبلا إعلانات. بياناتك محفوظة على جهازك فقط.</p></div>
  <div class="stage-wrap land-stage"><div class="stage tall" id="stage"></div></div></section>
  <section class="pillars">
    <a class="card pillar" href="#body"><span class="pn">١</span><h3>جسم الإنسان ثلاثي الأبعاد</h3><p>19 عضلة قابلة للضغط، مع موقع كل عضلة ووظيفتها وتمارينها والأخطاء الشائعة فيها.</p></a>
    <a class="card pillar" href="#library"><span class="pn">٢</span><h3>مدرب ثلاثي الأبعاد</h3><p>${EX.length} تمرينًا بحركة ثلاثية الأبعاد من الأمام والجانب والخلف، مع التبطيء ومسار الحركة ومقارنة الأداء الصحيح بالخاطئ.</p></a>
    <a class="card pillar" href="#home"><span class="pn">٣</span><h3>جلسة تمرين مباشرة</h3><p>مؤقت دقيق للعمل والراحة، وعدّات وأوزان، وصوت مدرب عربي، وموسيقى، وانتقال تلقائي بين التمارين.</p></a>
    <a class="card pillar" href="#progress"><span class="pn">٤</span><h3>مركز متابعة الأداء</h3><p>سجلّك وأرقامك القياسية وتقويم التزامك، وتوزيع تمارينك على العضلات ومؤشر التوازن.</p></a>
  </section>`;
};
UI.after.welcome = function () { if (Stage.mount($('#stage'), {mode:'explore', autoRot:true})) { const e = EXI['goblet-squat']; Stage.setAnim(e, {view:'side', instant:true}); Stage.autoRot = true; Stage.speed = .8; Stage.path = true; } };

UI.views.onboard = function () {
  const p = S.profile || {exp:'beg', goal:'general', place:'home', eq:[], days:3, min:30, limits:[]};
  const radio = (k, opts) => `<div class="chips">${opts.map(([v, t]) => `<label class="chip"><input type="radio" name="${k}" value="${v}" ${p[k] == v ? 'checked' : ''}><span>${t}</span></label>`).join('')}</div>`;
  const check = (k, opts) => `<div class="chips">${opts.map(([v, t]) => `<label class="chip"><input type="checkbox" name="${k}" value="${v}" ${(p[k] || []).includes(v) ? 'checked' : ''}><span>${t}</span></label>`).join('')}</div>`;
  return `<section class="page-head"><h1>ملفك التدريبي</h1><p class="muted">نستخدم إجاباتك لاختيار تمارين تناسب مستواك وأدواتك فقط. تُحفظ على جهازك ولا تُرسل لأي خادم.</p></section>
  <form class="card onb" id="onb">
    <div class="field"><label for="ob-name">الاسم (اختياري)</label><input id="ob-name" name="name" value="${esc(p.name || '')}" maxlength="30"></div>
    <fieldset><legend>١. خبرتك في التمرين</legend>${radio('exp', [['beg','مبتدئ: أقل من 6 أشهر'], ['mid','متوسط: 6 أشهر إلى سنتين'], ['adv','متقدم: أكثر من سنتين']])}</fieldset>
    <fieldset><legend>٢. هدفك الرئيسي</legend>${radio('goal', [['general','لياقة عامة وصحة'], ['strength','زيادة القوة'], ['muscle','بناء العضلات'], ['fat','خسارة الدهون بشكل صحي'], ['mobility','مرونة وحركة أفضل']])}</fieldset>
    <fieldset><legend>٣. أين تتمرن غالبًا؟</legend>${radio('place', [['home','البيت'], ['gym','النادي']])}</fieldset>
    <fieldset><legend>٤. الأدوات المتوفرة في البيت</legend>${check('eq', [['db','دمبل'], ['band','مطاط مقاومة'], ['kb','كيتل بل'], ['bench','مقعد أو كرسي ثابت'], ['bar','عقلة'], ['rope','حبل قفز']])}<p class="muted small">إذا لم تختر شيئًا، سنعتمد على تمارين وزن الجسم.</p></fieldset>
    <div class="row2"><fieldset><legend>٥. أيام التمرين أسبوعيًا</legend>${radio('days', [[2,'2'], [3,'3'], [4,'4'], [5,'5'], [6,'6']])}</fieldset>
    <fieldset><legend>مدة الجلسة المفضلة</legend>${radio('min', [[15,'15 د'], [30,'30 د'], [45,'45 د'], [60,'60 د']])}</fieldset></div>
    <fieldset><legend>٦. هل لديك قيود حركية أو إصابة سابقة؟</legend>${check('limits', [['knee','الركبة'], ['back','أسفل الظهر'], ['shoulder','الكتف']])}<p class="note">سنُبعد التمارين التي قد تُجهد هذه المناطق. هذا ليس تشخيصًا طبيًا؛ مع وجود ألم أو إصابة حالية استشر طبيبًا أو أخصائي علاج طبيعي قبل البدء.</p></fieldset>
    <details><summary>بيانات اختيارية (العمر، الطول، الوزن)</summary><div class="row3"><div class="field"><label for="ob-age">العمر</label><input id="ob-age" type="number" name="age" min="13" max="100" value="${p.age || ''}"></div><div class="field"><label for="ob-h">الطول (سم)</label><input id="ob-h" type="number" name="h" min="100" max="230" value="${p.h || ''}"></div><div class="field"><label for="ob-w">الوزن (كغ)</label><input id="ob-w" type="number" name="w" min="30" max="300" value="${p.w || ''}"></div></div><p class="muted small">غير مطلوبة لتشغيل أي ميزة حاليًا. لا نقدّم أنظمة غذائية، ولا نوصي بتغييرات حادة في الوزن.</p></details>
    <p class="err" id="onb-err" hidden></p>
    <button class="btn primary big" type="submit">احفظ وأنشئ خطتي</button>
  </form>`;
};

// ---------- COACH (rule-based, uses the user's real data) ----------
UI.coachAnswer = function (msg) {
  const m = msg.trim(), has = (...w) => w.some(x => m.includes(x));
  const ex = EX.filter(e => m.includes(e.ar) || m.toLowerCase().includes(e.en.toLowerCase())).sort((a, b) => b.ar.length - a.ar.length)[0];
  if (has('ألم', 'يوجع', 'وجع', 'إصابة', 'اصابة', 'تمزق', 'ألام', 'يألم')) return `<p><b>سلامتك أولًا.</b> لا أستطيع تشخيص الإصابات. إذا شعرت بألم حاد أو ألم في المفصل أو ألم يستمر، فأوقف التمرين المسبب له ولا تتمرن عليه.</p><p>استشر طبيبًا أو أخصائي علاج طبيعي، خصوصًا إذا رافق الألم تورّم أو تنميل أو ضعف. يمكنك تحديد القيود في <a href="#onboard">ملفك</a> لنُبعد التمارين التي قد تُجهد تلك المنطقة.</p>`;
  if (ex && has('بديل', 'غير', 'بدل', 'ما عندي', 'ماعندي', 'لا أملك')) {
    const alt = EX.filter(x => x.id !== ex.id && x.prim[0] === ex.prim[0] && x.kind === ex.kind).slice(0, 5);
    return `<p>بدائل «${esc(ex.ar)}» لنفس العضلة (${esc(MUSCLES[ex.prim[0]].ar)}):</p><ul class="bul">${alt.map(a => `<li><a href="#ex-${a.id}">${esc(a.ar)}</a> · ${a.eq.map(q => EQ[q]).join('/')} · ${LVL[a.lvl]}</li>`).join('')}</ul>`;
  }
  if (ex) { const t = TX[ex.tx] || TX.mob; return `<p><b>${esc(ex.ar)}</b> يستهدف ${esc(muscleNames(ex.prim))}${ex.sec.length ? '، ويساعد فيه ' + esc(muscleNames(ex.sec)) : ''}.</p><ol class="steps">${t.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol><p><b>التنفس:</b> ${esc(t.br)}</p><p><b>تجنّب:</b> ${t.mis.map(esc).join('، ')}.</p><a class="btn sm" href="#ex-${ex.id}">شاهد الحركة ثلاثية الأبعاد</a>`; }
  if (has('اليوم', 'وش أتمرن', 'ماذا أتمرن', 'إيش أتمرن', 'ايش اتمرن', 'أتمرن ايش', 'أدرب')) {
    const rec = recoveryMap(), scores = Object.entries({legs:['quads','glutes','hamstrings'], upper:['chest_lower','lats','delt_side'], core:['abs','obliques']}).map(([k, ms]) => [k, Math.min(...ms.map(x => rec[x] ?? 999))]);
    scores.sort((a, b) => b[1] - a[1]); const f = scores[0][0];
    const sess = genSession(f, (S.profile && S.profile.min) || 30, (S.profile && S.profile.place) || 'home', S.seed);
    this.st.quick.focus = f;
    return `<p>بحسب سجلّك، أكثر مجموعة مرتاحة الآن: <b>${FOCUS[f].ar}</b>${scores[0][1] < 999 ? ` (آخر تدريب لها قبل ${Math.round(scores[0][1])} ساعة)` : ' (لم تُدرَّب مؤخرًا)'}.</p><p>أقترح: ${sess.main.map(x => esc(EXI[x.id].ar)).join('، ')}.</p><button class="btn primary sm" data-act="start-quick">${ic('play')} ابدأ هذا التمرين</button>`;
  }
  if (has('توازن', 'خلل', 'متوازن', 'توزيع')) {
    if (!S.history.length) return '<p>لا يوجد سجل بعد لأحلل توازنك. أكمل بعض الجلسات ثم اسألني مجددًا.</p>';
    const b = balance(30), L = muscleLoad(30), low = Object.entries(GROUPS).map(([g, G]) => [G.ar, G.m.reduce((a, x) => a + L[x], 0)]).sort((a, b) => a[1] - b[1]);
    return `<p>آخر 30 يومًا: الدفع ${Math.round(b.push)} مقابل السحب ${Math.round(b.pull)} مجموعة، والجزء العلوي ${Math.round(b.upper)} مقابل السفلي ${Math.round(b.lower)}.</p><p>أقل مجموعة تدريبًا: <b>${low[0][0]}</b> (${Math.round(low[0][1])}). ${b.push > b.pull * 1.3 ? 'أنصح بإضافة تمارين سحب مثل التجديف لتوازن الكتفين.' : b.lower < b.upper * .6 ? 'أنصح بزيادة تمارين الأرجل.' : 'التوزيع معقول. أضف تمرينًا لأقل مجموعة.'}</p><a class="link" href="#progress">التفاصيل في مركز التقدم</a>`;
  }
  if (has('استشفاء', 'راحة', 'تعب', 'نوم', 'شد عضلي', 'الشد')) return `<p>العضلة تتكيّف وتقوى خلال الراحة وليس أثناء التمرين. إرشادات عامة:</p><ul class="bul"><li>اترك نحو 48 ساعة بين الجلسات الشاقة لنفس العضلة.</li><li>النوم الكافي (7–9 ساعات للبالغين) من أهم عوامل الاستشفاء.</li><li>الألم العضلي المتأخر طبيعي بعد تمرين جديد ويخف خلال يومين أو ثلاثة. الحركة الخفيفة تساعد.</li><li>الألم الحاد أو ألم المفصل ليس طبيعيًا؛ توقف واستشر مختصًا.</li></ul><p class="muted small">تختلف هذه التوصيات حسب شدة التمرين واحتياجك وحالتك الصحية.</p><a class="link" href="#recovery">مركز الاستشفاء ومذكرة الألم العضلي</a>`;
  if (has('أسبوع', 'جدول', 'روتين', 'برنامج')) {
    const d = (S.profile && S.profile.days) || 3, map = {2:['p-full-home','p-full-home'], 3:['p-beginner','p-core','p-legs30'], 4:['p-upper','p-lower','p-upper','p-lower'], 5:['p-push','p-pull','p-legs','p-upper','p-lower'], 6:['p-push','p-pull','p-legs','p-push','p-pull','p-legs']}[d];
    return `<p>بناءً على ${d} أيام أسبوعيًا أقترح:</p><ul class="bul">${map.map((id, i) => `<li>اليوم ${i + 1}: ${esc(findPlan(id).name)}</li>`).join('')}</ul><p>وزّعها مع يوم راحة بين الأيام المتشابهة.</p><button class="btn sm" data-act="auto-week">طبّق على جدولي الأسبوعي</button>`;
  }
  if (has('وزن', 'أزيد', 'تطور', 'تدرج', 'تقدم', 'أقوى')) {
    const P = prs(), top = Object.entries(P).filter(([, p]) => p.w).slice(0, 3);
    return `<p><b>مبدأ التحميل التدريجي:</b> عندما تُكمل كل المجموعات بأعلى العدّات المستهدفة وبأداء صحيح، زِد الوزن قليلًا (1–2.5 كغ)، أو أضف عدّة، أو انتقل لنسخة أصعب.</p>${top.length ? `<p>أفضل أرقامك: ${top.map(([id, p]) => `${esc(EXI[id].ar)} ${p.w} كغ × ${p.r}`).join('، ')}.</p>` : ''}<p class="muted small">في جلسة التمرين أعرض لك أداءك في المرة السابقة وأقترح الوزن التالي تلقائيًا.</p>`;
  }
  if (has('سجل', 'إنجاز', 'كم تمرنت', 'تاريخ')) { const T = totals(S.history), W = totals(S.history.filter(h => inWeek(h))); return `<p>منذ البداية: ${T.n} جلسة، ${num(T.sets)} مجموعة، ${num(T.min)} دقيقة. هذا الأسبوع: ${W.n} جلسة (${num(W.min)} دقيقة). سلسلة الأيام الحالية: ${streak()}.</p>`; }
  if (has('عضل', 'عضلة')) { const mm = Object.entries(MUSCLES).find(([, M]) => m.includes(M.ar)); if (mm) return `<p><b>${esc(mm[1].ar)}</b>: ${esc(mm[1].fn)}</p><button class="btn sm" data-act="sel-muscle-go" data-id="${mm[0]}">اعرضها على الجسم</button>`; }
  return `<p>أستطيع مساعدتك في:</p><ul class="bul"><li>شرح أي تمرين: «كيف أسوي القرفصاء البلغاري؟»</li><li>بدائل: «بديل العقلة ما عندي عقلة»</li><li>«وش أتمرن اليوم؟» (حسب الاستشفاء من سجلّك)</li><li>«هل تمريني متوازن؟»</li><li>«ابنِ لي جدول أسبوع»</li><li>الاستشفاء والتحميل التدريجي</li></ul>`;
};
UI.views.coach = function () {
  if (!this.st.chat.length) this.st.chat.push({me:false, h:this.coachAnswer('مساعدة')});
  const sug = ['وش أتمرن اليوم؟', 'هل تمريني متوازن؟', 'بديل العقلة ما عندي عقلة', 'كيف أسوي الرفعة الرومانية؟', 'ابنِ لي جدول أسبوع', 'كيف أتطور وأزيد الوزن؟'];
  return `<section class="page-head"><h1>المدرب الذكي</h1><p class="muted">يجيب من قاعدة التمارين ومن سجلّك الفعلي على هذا الجهاز.</p></section>
  <section class="card chat"><div class="msgs" id="msgs">${this.st.chat.map(c => `<div class="msg ${c.me ? 'me' : ''}">${c.me ? esc(c.t) : c.h}</div>`).join('')}</div>
  <div class="chips scroll">${sug.map(s => `<button class="chip" data-act="ask" data-v="${esc(s)}">${esc(s)}</button>`).join('')}</div>
  <form class="ask" id="ask"><input id="ask-in" placeholder="اكتب سؤالك…" autocomplete="off"><button class="btn primary" type="submit">إرسال</button></form>
  <p class="note">مدرب قائم على قواعد محلية، وليس نموذج ذكاء اصطناعي توليدي، ولا يرسل أسئلتك لأي خادم. إجاباته تعليمية وليست نصيحة طبية، ولا يشخّص الإصابات.</p></section>`;
};
UI.after.coach = function () { const m = $('#msgs'); if (m) m.scrollTop = m.scrollHeight; };

// ---------- RECOVERY ----------
const ROUTINES = [
  {id:'r-warm', name:'إحماء ديناميكي عام', d:'5 دقائق', items:['march','arm-circles','leg-swings','torso-twist','cat-cow','deep-squat-hold']},
  {id:'r-warm-legs', name:'إحماء الأرجل', d:'4 دقائق', items:['march','leg-swings','deep-squat-hold','low-jack']},
  {id:'r-warm-upper', name:'إحماء الجزء العلوي', d:'4 دقائق', items:['arm-circles','band-pass','torso-twist','cat-cow']},
  {id:'r-cool', name:'تهدئة وإطالة للجسم كامل', d:'6 دقائق', items:['hamstring-stretch','quad-stretch','hip-flexor-stretch','chest-stretch','cross-shoulder','childs-pose']},
  {id:'r-desk', name:'راحة الظهر والرقبة للمكتب', d:'5 دقائق', items:['cat-cow','childs-pose','cobra','torso-twist','chest-stretch']},
  {id:'r-mob', name:'الحركة والمرونة', d:'8 دقائق', items:['cat-cow','deep-squat-hold','hip-flexor-stretch','butterfly','seated-fold','cobra','childs-pose','calf-stretch']}
];
UI.views.recovery = function () {
  const last7 = S.history.filter(h => Date.now() - new Date(h.date) < 7 * 864e5), days = new Set(last7.map(h => dayKey(h.date)));
  let cons = 0; const d = new Date(); while (days.has(dayKey(d))) { cons++; d.setDate(d.getDate() - 1); }
  const rec = recoveryMap(), tired = Object.entries(rec).filter(([, h]) => h < 48).map(([m]) => MUSCLES[m].ar);
  const advice = cons >= 3 ? `تمرنت ${cons} أيام متتالية. يوم راحة أو استشفاء نشط (مشي خفيف وإطالة) خيار جيد اليوم.` : tired.length ? `عضلات ما زالت تتعافى: ${tired.slice(0, 6).join('، ')}. درّب مجموعات أخرى أو خذ جلسة حركة خفيفة.` : 'عضلاتك مرتاحة. يوم مناسب لتمرين كامل.';
  const td = dayKey(new Date());
  return `<section class="page-head"><h1>الإحماء والاستشفاء</h1><p class="muted">تعتمد توصيات الاستشفاء على شدة تمرينك واحتياجاتك وحالتك الصحية، وما هنا إرشادات عامة.</p></section>
  <section class="card"><h3>اقتراح اليوم</h3><p>${esc(advice)}</p></section>
  <section><h2 class="h2">روتينات موجّهة</h2><div class="plist">${ROUTINES.map(r => `<article class="card pcard"><h3>${esc(r.name)}</h3><p class="muted small">${r.d} · ${r.items.length} حركات</p><p class="small">${r.items.map(id => esc(EXI[id].ar)).join(' · ')}</p><button class="btn primary sm" data-act="start-routine" data-id="${r.id}">${ic('play')} ابدأ</button></article>`).join('')}</div></section>
  <section class="grid2">
    <div class="card"><h3>مكتبة الإطالة والحركة</h3><div class="chips">${EX.filter(e => e.kind === 'x' || e.kind === 'm').map(e => `<a class="chip" href="#ex-${e.id}">${esc(e.ar)}</a>`).join('')}</div></div>
    <form class="card" id="journal"><h3>مذكرة الألم العضلي والنوم</h3>
      <div class="field"><label for="j-date">التاريخ</label><input type="date" id="j-date" name="date" value="${td}" max="${td}"></div>
      <div class="field"><label for="j-level">درجة الألم العضلي: <b id="j-lv">2</b> من 5</label><input type="range" id="j-level" name="level" min="0" max="5" value="2"></div>
      <div class="field"><label>المناطق المتأثرة</label><div class="chips">${Object.entries(GROUPS).map(([k, g]) => `<label class="chip"><input type="checkbox" name="groups" value="${k}"><span>${g.ar}</span></label>`).join('')}</div></div>
      <div class="row2"><div class="field"><label for="j-sleep">ساعات النوم</label><input type="number" id="j-sleep" name="sleep" min="0" max="16" step=".5" value="7"></div><div class="field"><label for="j-energy">الطاقة (1–5)</label><input type="number" id="j-energy" name="energy" min="1" max="5" value="3"></div></div>
      <div class="field"><label for="j-note">ملاحظة</label><input id="j-note" name="note" maxlength="140" placeholder="مثال: شدّ خفيف في الفخذ بعد تمرين الأرجل"></div>
      <button class="btn primary" type="submit">حفظ في المذكرة</button><p class="muted small">الألم العضلي من 3 فما فوق يُحتسب في خريطة الاستشفاء لليوم نفسه.</p></form>
  </section>
  <section class="card"><h3>السجل</h3>${S.journal.length ? `<ul class="hist">${[...S.journal].reverse().slice(0, 20).map(j => `<li class="jrow"><b>${j.date}</b><span>ألم ${j.level}/5${(j.groups || []).length ? ' · ' + j.groups.map(g => GROUPS[g].ar).join('، ') : ''} · نوم ${j.sleep} س · طاقة ${j.energy}/5</span>${j.note ? `<span class="muted small">${esc(j.note)}</span>` : ''}<button class="icon-btn" data-act="del-j" data-id="${j.id}" aria-label="حذف">${ic('trash')}</button></li>`).join('')}</ul>` : '<p class="muted">لا توجد ملاحظات بعد.</p>'}</section>`;
};

// ---------- MUSIC ----------
UI.views.music = function () {
  const tr = Sound.tracks[Sound.idx];
  return `<section class="page-head"><h1>الموسيقى والصوت</h1><p class="muted">مقاطع إيقاعية تتولّد داخل متصفحك أثناء التشغيل، فلا توجد حقوق نشر ولا تحميل ملفات.</p></section>
  <section class="card player" id="music-now"><div class="pl-art ${Sound.playing ? 'on' : ''}"><i></i><i></i><i></i><i></i><i></i></div>
    <div><p class="eyebrow">${esc(tr.cat)} · ${tr.bpm} نبضة/دقيقة</p><h2>${esc(tr.name)}</h2></div>
    <div class="pl-ctl"><button class="icon-btn lg" data-act="m-prev" aria-label="السابق">${ic('next')}</button><button class="icon-btn xl primary" data-act="music" aria-label="${Sound.playing ? 'إيقاف' : 'تشغيل'}">${ic(Sound.playing ? 'pause' : 'play')}</button><button class="icon-btn lg" data-act="m-next" aria-label="التالي">${ic('prev')}</button></div>
    <label class="vol">الصوت <input type="range" id="m-vol" data-in="vol" min="0" max="1" step=".05" value="${Sound.vol}"></label></section>
  <section class="card"><h3>قوائم التشغيل</h3><ul class="tracks">${Sound.tracks.map((t, i) => `<li><button class="${i === Sound.idx ? 'on' : ''}" data-act="m-pick" data-v="${i}"><b>${esc(t.name)}</b><span class="muted small">${esc(t.cat)} · ${t.bpm} BPM</span></button></li>`).join('')}</ul></section>
  <section class="card"><h3>صوت المدرب</h3>
    <label class="tog"><input type="checkbox" id="p-voice" data-in="pref" data-k="voice" ${S.prefs.voice ? 'checked' : ''}> التوجيه الصوتي العربي (اسم التمرين، المجموعة، الراحة)</label>
    <label class="tog"><input type="checkbox" id="p-beep" data-in="pref" data-k="beep" ${S.prefs.beep ? 'checked' : ''}> تنبيهات العدّ التنازلي (3، 2، 1)</label>
    <button class="btn sm" data-act="test-voice">جرّب الصوت</button>
    <p class="note">يعتمد الصوت على أصوات العربية المثبتة في جهازك. تستمر الموسيقى ما دامت الصفحة مفتوحة، وقد يوقفها النظام إذا قفلت شاشة الهاتف.</p></section>`;
};

// ---------- PROFILE ----------
UI.views.profile = function () {
  const p = S.profile, B = badges();
  const goalT = {general:'لياقة عامة وصحة', strength:'زيادة القوة', muscle:'بناء العضلات', fat:'خسارة الدهون بشكل صحي', mobility:'مرونة وحركة'};
  return `<section class="page-head row"><div><h1>ملفي</h1></div><a class="btn" href="#onboard">تعديل الملف</a></section>
  ${p ? `<section class="card"><dl class="facts two"><dt>المستوى</dt><dd>${LVL[userLvl()]}</dd><dt>الهدف</dt><dd>${goalT[p.goal]}</dd><dt>المكان</dt><dd>${p.place === 'gym' ? 'النادي' : 'البيت'}</dd><dt>الأدوات</dt><dd>${(p.eq || []).map(q => EQ[q]).join('، ') || 'وزن الجسم فقط'}</dd><dt>الأيام</dt><dd>${p.days} أيام · ${p.min} دقيقة</dd><dt>القيود</dt><dd>${(p.limits || []).map(l => ({knee:'الركبة', back:'أسفل الظهر', shoulder:'الكتف'}[l])).join('، ') || 'لا يوجد'}</dd></dl></section>` : `<div class="empty card"><h3>لم تُنشئ ملفك بعد</h3><a class="btn primary" href="#onboard">إعداد الملف</a></div>`}
  <section class="card"><h3>الأوسمة (${B.filter(b => b.ok).length} من ${B.length})</h3><div class="bgrid">${B.map(b => `<div class="bdg ${b.ok ? 'ok' : ''}"><b>${esc(b.n)}</b><span class="small muted">${esc(b.d)}</span></div>`).join('')}</div></section>
  <section class="card"><h3>تحدي الأسبوع</h3>${(() => { const c = challenge(); return `<p>${esc(c.t)}</p><div class="bar"><i style="width:${Math.min(100, c.v / c.goal * 100)}%"></i></div><p class="small muted">${num(c.v)} / ${c.goal} ${c.u}</p>`; })()}</section>`;
};

// ---------- PREFS ----------
UI.views.prefs = function () {
  const conf = this.st.confirm;
  return `<section class="page-head"><h1>الإعدادات والخصوصية</h1></section>
  <section class="card"><h3>المظهر واللغة</h3><div class="field"><label for="p-theme">المظهر</label><select id="p-theme" data-in="theme">${[['system','حسب الجهاز'], ['light','فاتح'], ['dark','داكن']].map(([v, t]) => `<option value="${v}" ${S.prefs.theme === v ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
  <label class="tog"><input type="checkbox" id="p-en" data-in="pref" data-k="en" ${S.prefs.en ? 'checked' : ''}> إظهار الأسماء الإنجليزية للتمارين والعضلات</label><p class="muted small">الواجهة الكاملة باللغة الإنجليزية غير متوفرة في هذا الإصدار.</p></section>
  <section class="card"><h3>جلسة التمرين</h3>
  <label class="tog"><input type="checkbox" id="p-voice2" data-in="pref" data-k="voice" ${S.prefs.voice ? 'checked' : ''}> التوجيه الصوتي</label>
  <label class="tog"><input type="checkbox" id="p-beep2" data-in="pref" data-k="beep" ${S.prefs.beep ? 'checked' : ''}> تنبيهات صوتية</label>
  <label class="tog"><input type="checkbox" id="p-guided" data-in="pref" data-k="guided" ${S.prefs.guided ? 'checked' : ''}> العدّ الإيقاعي الموجّه</label>
  <p class="muted small">العدّ الإيقاعي يطلق نغمة مع كل تكرار حسب إيقاع الحركة المعروضة، لتتبعه أنت. لا توجد حاليًا ميزة عدّ تلقائي بالكاميرا أو بالحساسات، وتسجيل العدّات يدوي.</p></section>
  <section class="card"><h3>بياناتك</h3><p>كل بياناتك (الملف، السجل، الخطط، المذكرة) محفوظة في متصفح هذا الجهاز فقط، ولا تُرسل لأي خادم. ستختفي إذا مسحت بيانات المتصفح.</p>
  <div class="pc-a"><button class="btn" data-act="export" data-v="json">تصدير JSON</button><button class="btn" data-act="export" data-v="csv">تصدير CSV للسجل</button><button class="btn" data-act="import-show">استيراد</button></div>
  <div id="xport"></div>
  ${conf === 'wipe' ? `<div class="confirm"><p><b>حذف كل البيانات نهائيًا؟</b> لا يمكن التراجع.</p><button class="btn danger" data-act="wipe">نعم، احذف كل شيء</button><button class="btn" data-act="confirm-cancel">إلغاء</button></div>` : `<button class="btn ghost danger-t" data-act="wipe-ask">${ic('trash')} حذف كل بياناتي</button>`}</section>
  <section class="card"><h3>ما الذي يعمل الآن وما المخطط له</h3><ul class="bul">
  <li><b>يعمل:</b> الجسم التفاعلي ثلاثي الأبعاد، ومكتبة ${EX.length} تمرينًا بحركات ثلاثية الأبعاد، والجلسات الموجّهة بالمؤقتات والصوت، ومنشئ الخطط والجدول الأسبوعي، والتحليلات، والمدرب القائم على القواعد، ومذكرة الاستشفاء، والموسيقى المولّدة.</li>
  <li><b>مؤقت:</b> المجسم أسلوبي مبسّط من إنتاجنا، والحركات مولّدة برمجيًا.</li>
  <li><b>مخطط لاحقًا:</b> الحسابات والمزامنة السحابية عبر Supabase، ونموذج تشريحي واقعي مرخّص، وجسم أنثوي، ومدرب ذكاء اصطناعي توليدي، وتطبيق قابل للتثبيت (PWA)، وتذكيرات الإشعارات، والواجهة الإنجليزية الكاملة.</li></ul></section>`;
};
