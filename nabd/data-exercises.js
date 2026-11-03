// Exercise database. X(id, ar, en, pattern, patternOpts, textKey, primary, secondary, equipment, level, kind, sets, reps|tSEC, rest, flags)
// flags: i=isolation, h=high-impact, f=full body, k=key/foundational movement
const EX = [];
function X(id, ar, en, pat, po, tx, prim, sec, eq, lvl, kind, sets, reps, rest, flags = '') {
  const t = typeof reps === 'string' && reps[0] === 't' ? +reps.slice(1) : null;
  EX.push({id, ar, en, pat, po, tx, prim:prim.split(' '), sec:sec ? sec.split(' ') : [], eq:eq.split(' '), lvl, kind, sets, reps:t ? null : reps, t, rest,
    iso:flags.includes('i'), hi:flags.includes('h'), full:flags.includes('f'), key:flags.includes('k')});
}
// CHEST
X('pushup','تمرين الضغط','Push-Up','pushup',{},'pushup','chest_lower chest_upper','triceps delt_front abs','bw',1,'s',3,'8-15',60,'k');
X('knee-pushup','الضغط على الركبتين','Knee Push-Up','pushup',{knee:1},'pushup','chest_lower','triceps delt_front','bw',1,'s',3,'8-12',60);
X('incline-pushup','الضغط المائل (اليدان مرتفعتان)','Incline Push-Up','pushup',{tilt:45,inc:1},'pushup','chest_lower','triceps delt_front','bw bench',1,'s',3,'10-15',60);
X('decline-pushup','الضغط المنحدر (القدمان مرتفعتان)','Decline Push-Up','pushup',{tilt:84,dec:1},'pushup','chest_upper','delt_front triceps abs','bw bench',2,'s',3,'8-12',75);
X('diamond-pushup','الضغط الماسي','Diamond Push-Up','pushup',{dia:1},'pushup','triceps','chest_lower delt_front','bw',2,'s',3,'6-12',75);
X('wide-pushup','الضغط الواسع','Wide Push-Up','pushup',{wide:1},'pushup','chest_lower','delt_front triceps','bw',1,'s',3,'8-15',60);
X('db-bench','ضغط الصدر بالدمبل','Dumbbell Bench Press','bench',{},'bench','chest_lower','triceps delt_front chest_upper','db bench',1,'s',3,'8-12',90,'k');
X('bb-bench','ضغط البار المستوي','Barbell Bench Press','bench',{},'bench','chest_lower','triceps delt_front','bb bench',2,'s',4,'5-10',120,'k');
X('incline-db','ضغط الصدر العلوي بالدمبل','Incline Dumbbell Press','bench',{inc:1},'bench','chest_upper','delt_front triceps','db bench',2,'s',3,'8-12',90);
X('db-fly','تفتيح الصدر بالدمبل','Dumbbell Fly','fly',{},'fly','chest_lower','chest_upper delt_front','db bench',2,'s',3,'10-15',60,'i');
X('cable-crossover','تفتيح الكيبل','Cable Crossover','fly',{stand:1},'fly','chest_lower','chest_upper delt_front','cb',2,'s',3,'12-15',60,'i');
X('chest-press-machine','جهاز ضغط الصدر','Machine Chest Press','press',{seat:1},'machine','chest_lower','triceps delt_front','mc',1,'s',3,'10-12',75);
X('pec-deck','جهاز تفتيح الصدر','Pec Deck','fly',{seat:1},'machine','chest_lower','delt_front','mc',1,'s',3,'12-15',60,'i');
X('chest-dips','التغطيس للصدر','Chest Dips','dip',{chest:1},'dip','chest_lower','triceps delt_front','bar',3,'s',3,'6-10',90);
X('floor-press','ضغط الأرض بالدمبل','Dumbbell Floor Press','bench',{floor:1},'bench','chest_lower','triceps delt_front','db',1,'s',3,'8-12',75);
X('band-chest-press','ضغط الصدر بالمطاط','Band Chest Press','fly',{apart:0,stand:1},'press','chest_lower','triceps delt_front','band',1,'s',3,'12-15',60);
// BACK
X('pullup','العقلة','Pull-Up','pull',{},'pull','lats','biceps upper_back forearms','bar',3,'s',3,'5-10',120,'k');
X('chinup','العقلة بقبضة معكوسة','Chin-Up','pull',{chin:1},'pull','lats biceps','upper_back forearms','bar',3,'s',3,'5-10',120);
X('lat-pulldown','السحب العالي','Lat Pulldown','pull',{seat:1},'pull','lats','biceps upper_back','mc',1,'s',3,'8-12',90,'k');
X('bb-row','التجديف بالبار','Barbell Bent-Over Row','row',{},'row','upper_back lats','biceps delt_rear lower_back','bb',2,'s',3,'6-10',90,'k');
X('db-row','التجديف بالدمبل بذراع واحدة','One-Arm Dumbbell Row','row',{single:1},'row','lats upper_back','biceps delt_rear','db bench',1,'s',3,'8-12',60,'k');
X('seated-cable-row','التجديف بالكيبل جالسًا','Seated Cable Row','row',{seated:1},'row','upper_back lats','biceps delt_rear','cb',1,'s',3,'10-12',75);
X('inverted-row','التجديف المعكوس','Inverted Row','row',{inverted:1},'row','upper_back lats','biceps delt_rear abs','bar',2,'s',3,'8-12',75);
X('deadlift','الرفعة الميتة','Deadlift','hinge',{dl:1},'deadlift','glutes hamstrings lower_back','quads traps forearms lats','bb',3,'s',3,'3-6',150,'kf');
X('band-pull-apart','فتح المطاط','Band Pull-Apart','fly',{apart:1},'raise','delt_rear upper_back','traps','band',1,'s',3,'15-20',45,'i');
X('superman','تمرين سوبرمان','Superman','prone',{},'prone','lower_back','glutes delt_rear','bw',1,'s',3,'10-12',45);
X('back-extension','تمديد الظهر','Back Extension','prone',{backext:1},'machine','lower_back','glutes hamstrings','mc',1,'s',3,'10-15',60);
X('face-pull','السحب للوجه','Face Pull','fly',{face:1},'row','delt_rear upper_back','traps','cb band',1,'s',3,'12-15',60,'i');
X('db-shrug','هزّ الكتفين بالدمبل','Dumbbell Shrug','shrug',{},'shrug','traps','forearms','db',1,'s',3,'10-15',60,'i');
X('kb-swing','تأرجح الكيتل بل','Kettlebell Swing','hinge',{swing:1},'swing','glutes hamstrings','lower_back delt_front abs','kb',2,'s',3,'12-15',60,'hf');
X('good-morning','تمرين صباح الخير','Good Morning','hinge',{arms:'head'},'hinge','hamstrings lower_back','glutes','bb band',2,'s',3,'8-12',75);
X('straight-arm-pulldown','السحب بذراعين مستقيمتين','Straight-Arm Pulldown','pull',{straight:1},'pull','lats','triceps abs','cb',2,'s',3,'12-15',60,'i');
// SHOULDERS
X('db-shoulder-press','ضغط الكتف بالدمبل','Dumbbell Shoulder Press','press',{},'press','delt_front delt_side','triceps traps','db',1,'s',3,'8-12',90,'k');
X('ohp','الضغط العسكري بالبار','Barbell Overhead Press','press',{},'press','delt_front delt_side','triceps traps abs','bb',2,'s',4,'5-8',120);
X('arnold-press','ضغط أرنولد','Arnold Press','press',{arnold:1,seat:1},'press','delt_front delt_side','triceps','db bench',2,'s',3,'8-12',90);
X('lateral-raise','الرفع الجانبي','Lateral Raise','raise',{},'raise','delt_side','traps','db',1,'s',3,'12-15',60,'ik');
X('front-raise','الرفع الأمامي','Front Raise','raise',{front:1},'raise','delt_front','chest_upper','db',1,'s',3,'10-12',60,'i');
X('rear-delt-fly','التفتيح الخلفي للكتف','Rear Delt Fly','fly',{rear:1},'fly','delt_rear','upper_back traps','db',1,'s',3,'12-15',60,'i');
X('pike-pushup','ضغط البايك للكتف','Pike Push-Up','pike',{},'press','delt_front delt_side','triceps upper_back','bw',2,'s',3,'6-10',75);
X('band-lateral-raise','الرفع الجانبي بالمطاط','Band Lateral Raise','raise',{},'raise','delt_side','traps','band',1,'s',3,'15-20',45,'i');
X('upright-row','السحب العمودي','Upright Row','raise',{upright:1},'raise','delt_side traps','biceps','db bb',2,'s',3,'10-12',60);
X('cable-lateral','الرفع الجانبي بالكيبل','Cable Lateral Raise','raise',{},'raise','delt_side','traps','cb',2,'s',3,'12-15',60,'i');
// BICEPS
X('db-curl','تجعيد الدمبل','Dumbbell Biceps Curl','curl',{},'curl','biceps','forearms','db',1,'s',3,'10-12',60,'ik');
X('hammer-curl','التجعيد المطرقي','Hammer Curl','curl',{alt:1},'curl','biceps forearms','','db',1,'s',3,'10-12',60,'i');
X('bb-curl','تجعيد البار','Barbell Curl','curl',{},'curl','biceps','forearms','bb',1,'s',3,'8-12',75,'i');
X('concentration-curl','التجعيد المركّز','Concentration Curl','curl',{conc:1},'curl','biceps','forearms','db bench',2,'s',3,'10-12',45,'i');
X('band-curl','التجعيد بالمطاط','Band Curl','curl',{},'curl','biceps','forearms','band',1,'s',3,'12-15',45,'i');
X('cable-curl','تجعيد الكيبل','Cable Curl','curl',{},'curl','biceps','forearms','cb',1,'s',3,'10-12',60,'i');
X('preacher-curl','تجعيد الواعظ','Preacher Curl','curl',{preacher:1},'machine','biceps','forearms','mc',2,'s',3,'10-12',60,'i');
X('reverse-curl','التجعيد بقبضة عكسية','Reverse Curl','curl',{},'curl','forearms biceps','','db bb',2,'s',3,'10-12',60,'i');
// TRICEPS
X('bench-dip','التغطيس على المقعد','Bench Dip','dip',{bench:1},'dip','triceps','chest_lower delt_front','bench',1,'s',3,'8-12',60);
X('tri-pushdown','دفع الترايسبس بالكيبل','Triceps Pushdown','tri',{},'tri','triceps','','cb',1,'s',3,'10-15',60,'ik');
X('overhead-ext','تمديد الترايسبس فوق الرأس','Overhead Triceps Extension','tri',{over:1},'tri','triceps','','db',1,'s',3,'10-12',60,'i');
X('skull-crusher','كسّارة الجمجمة','Skull Crusher','bench',{skull:1},'tri','triceps','','bb db bench',2,'s',3,'8-12',75,'i');
X('kickback','الركلة الخلفية للترايسبس','Triceps Kickback','tri',{kick:1},'tri','triceps','','db',1,'s',3,'12-15',45,'i');
X('close-grip-bench','ضغط البار بقبضة ضيقة','Close-Grip Bench Press','bench',{close:1},'bench','triceps','chest_lower delt_front','bb bench',2,'s',3,'6-10',90);
X('dips','التغطيس على المتوازي','Parallel Bar Dips','dip',{},'dip','triceps','chest_lower delt_front','bar',3,'s',3,'6-10',90);
X('band-tri-ext','تمديد الترايسبس بالمطاط','Band Triceps Extension','tri',{over:1},'tri','triceps','','band',1,'s',3,'12-15',45,'i');
// FOREARMS
X('wrist-curl','تجعيد الرسغ','Wrist Curl','wrist',{},'wrist','forearms','','db',1,'s',3,'15-20',45,'i');
X('reverse-wrist-curl','تجعيد الرسغ العكسي','Reverse Wrist Curl','wrist',{rev:1},'wrist','forearms','','db',1,'s',3,'15-20',45,'i');
X('farmer-carry','مشية المزارع','Farmer\'s Carry','carry',{},'carry','forearms traps','abs glutes obliques','db kb',1,'s',3,'t40',60,'f');
X('dead-hang','التعلّق الثابت','Dead Hang','pull',{dead:1},'hang','forearms','lats','bar',1,'s',3,'t25',60);
// CORE
X('crunch','الكرنش','Crunch','crunch',{},'crunch','abs','','bw',1,'s',3,'12-20',45,'k');
X('plank','البلانك','Forearm Plank','plank',{},'plank','abs','obliques delt_front glutes','bw',1,'s',3,'t30',45,'k');
X('side-plank','البلانك الجانبي','Side Plank','sideplank',{},'sideplank','obliques','abs glutes delt_side','bw',2,'s',2,'t20',45);
X('leg-raise','رفع الأرجل','Lying Leg Raise','legraise',{},'legraise','abs hip_flexors','','bw',2,'s',3,'8-12',60);
X('russian-twist','الالتفاف الروسي','Russian Twist','twist',{},'twist','obliques','abs','bw db',2,'s',3,'12-20',45);
X('bicycle-crunch','كرنش الدراجة','Bicycle Crunch','crunch',{bike:1},'crunch','obliques abs','hip_flexors','bw',1,'s',3,'12-20',45);
X('dead-bug','الحشرة الميتة','Dead Bug','legraise',{deadbug:1},'quad','abs','hip_flexors obliques','bw',1,'s',3,'8-12',45,'k');
X('mountain-climber','متسلّق الجبال','Mountain Climber','climber',{},'cardio','abs hip_flexors','delt_front quads','bw',2,'c',3,'t30',45,'h');
X('bird-dog','الطائر والكلب','Bird Dog','quad',{},'quad','lower_back abs','glutes delt_front','bw',1,'s',3,'8-10',45,'k');
X('hanging-knee-raise','رفع الركبتين معلّقًا','Hanging Knee Raise','pull',{knee:1},'hang','abs hip_flexors','forearms','bar',2,'s',3,'8-12',60);
X('cable-woodchop','قطع الخشب بالكيبل','Cable Woodchop','twist',{chop:1},'twist','obliques','abs delt_front','cb band',2,'s',3,'10-12',45);
X('hollow-hold','الثبات المجوّف','Hollow Body Hold','legraise',{hollow:1},'legraise','abs','hip_flexors','bw',3,'s',3,'t20',45);
X('reverse-crunch','الكرنش العكسي','Reverse Crunch','crunch',{rev:1},'crunch','abs','hip_flexors','bw',1,'s',3,'10-15',45);
// GLUTES
X('glute-bridge','الجسر للأرداف','Glute Bridge','bridge',{},'bridge','glutes','hamstrings lower_back','bw',1,'s',3,'12-15',45,'k');
X('hip-thrust','دفع الورك بالبار','Barbell Hip Thrust','bridge',{thrust:1},'bridge','glutes','hamstrings quads','bb bench',2,'s',3,'8-12',90,'k');
X('single-leg-bridge','الجسر بساق واحدة','Single-Leg Glute Bridge','bridge',{single:1},'bridge','glutes','hamstrings','bw',2,'s',3,'8-12',45);
X('donkey-kick','ركلة الحمار','Donkey Kick','quad',{donkey:1},'quad','glutes','hamstrings','bw band',1,'s',3,'12-15',45,'i');
X('clamshell','تمرين المحارة','Clamshell','clam',{},'mob','glutes','','bw band',1,'s',3,'12-15',45,'i');
X('fire-hydrant','صنبور الإطفاء','Fire Hydrant','quad',{hydrant:1},'quad','glutes','obliques','bw band',1,'s',3,'12-15',45,'i');
X('cable-kickback','الركلة الخلفية بالكيبل','Cable Glute Kickback','kickback',{},'machine','glutes','hamstrings','cb',2,'s',3,'12-15',45,'i');
X('band-walk','المشي الجانبي بالمطاط','Lateral Band Walk','bandwalk',{},'mob','glutes','quads','band',1,'s',3,'t30',45);
X('hip-abduction','جهاز تبعيد الورك','Hip Abduction Machine','abduct',{},'machine','glutes','','mc',1,'s',3,'12-15',45,'i');
// QUADS
X('bw-squat','القرفصاء بوزن الجسم','Bodyweight Squat','squat',{},'squat','quads glutes','hamstrings abs','bw',1,'s',3,'12-15',60,'k');
X('goblet-squat','قرفصاء الكأس','Goblet Squat','squat',{arms:'goblet'},'squat','quads glutes','abs hamstrings','db kb',1,'s',3,'10-12',75,'k');
X('back-squat','القرفصاء الخلفي بالبار','Barbell Back Squat','squat',{arms:'back'},'squat','quads glutes','hamstrings lower_back abs','bb',3,'s',4,'5-8',150,'kf');
X('front-squat','القرفصاء الأمامي بالبار','Barbell Front Squat','squat',{arms:'front'},'squat','quads','glutes abs upper_back','bb',3,'s',4,'5-8',150);
X('lunge','الطعن الأمامي','Forward Lunge','lunge',{},'lunge','quads glutes','hamstrings calves','bw db',1,'s',3,'8-12',60,'k');
X('reverse-lunge','الطعن الخلفي','Reverse Lunge','lunge',{},'lunge','quads glutes','hamstrings','bw db',1,'s',3,'8-12',60);
X('bulgarian','القرفصاء البلغاري','Bulgarian Split Squat','lunge',{split:1},'lunge','quads glutes','hamstrings abs','db bench',2,'s',3,'8-10',75);
X('step-up','الصعود على الصندوق','Step-Up','step',{},'step','quads glutes','hamstrings calves','bw db bench',1,'s',3,'8-12',60);
X('leg-press','جهاز ضغط الأرجل','Leg Press','legpress',{},'machine','quads glutes','hamstrings','mc',1,'s',3,'10-12',90,'k');
X('leg-extension','جهاز تمديد الركبة','Leg Extension','legext',{},'machine','quads','','mc',1,'s',3,'12-15',60,'i');
X('wall-sit','الجلوس على الحائط','Wall Sit','squat',{hold:1,depth:.9,arms:'hips'},'squat','quads','glutes','bw',1,'s',3,'t30',45);
X('jump-squat','القرفصاء بالقفز','Jump Squat','squat',{jump:1},'squat','quads glutes','calves hamstrings','bw',2,'c',3,'10-12',60,'h');
X('side-lunge','الطعن الجانبي','Lateral Lunge','lunge',{side:1},'lunge','quads glutes','hamstrings','bw db',2,'s',3,'8-10',60);
// HAMSTRINGS
X('rdl','الرفعة الرومانية','Romanian Deadlift','hinge',{},'hinge','hamstrings glutes','lower_back forearms','bb db',2,'s',3,'8-12',90,'k');
X('sl-rdl','الرفعة الرومانية بساق واحدة','Single-Leg Romanian Deadlift','hinge',{single:1},'hinge','hamstrings glutes','lower_back abs','db kb',3,'s',3,'8-10',60);
X('leg-curl','ثني الأرجل على البطن','Lying Leg Curl','prone',{curl:1},'machine','hamstrings','calves','mc',1,'s',3,'10-15',60,'i');
X('nordic','تمرين نورديك','Nordic Hamstring Curl','nordic',{},'nordic','hamstrings','glutes','bw',3,'s',3,'3-6',120);
X('db-rdl','الرفعة الرومانية بالدمبل','Dumbbell Romanian Deadlift','hinge',{},'hinge','hamstrings glutes','lower_back','db',1,'s',3,'10-12',75);
X('kb-deadlift','الرفعة الميتة بالكيتل بل','Kettlebell Deadlift','hinge',{dl:1},'hinge','glutes hamstrings','quads lower_back','kb',1,'s',3,'10-12',75);
// CALVES
X('calf-raise','رفع السمانة واقفًا','Standing Calf Raise','calf',{},'calf','calves','','bw db',1,'s',3,'12-20',45,'ik');
X('seated-calf','رفع السمانة جالسًا','Seated Calf Raise','calf',{seat:1},'calf','calves','','mc db',1,'s',3,'15-20',45,'i');
X('single-calf','رفع السمانة بساق واحدة','Single-Leg Calf Raise','calf',{single:1},'calf','calves','','bw',2,'s',3,'10-15',45,'i');
X('jump-rope','نطّ الحبل','Jump Rope','rope',{},'cardio','calves','quads delt_side','rope',2,'c',3,'t45',45,'h');
// FULL BODY / CARDIO
X('burpee','البيربي','Burpee','burpee',{},'burpee','quads chest_lower','delt_front abs glutes','bw',2,'c',3,'8-12',60,'hf');
X('jumping-jack','القفز المفتوح','Jumping Jacks','jack',{},'cardio','calves delt_side','quads glutes','bw',1,'c',3,'t40',30,'h');
X('low-jack','القفز المفتوح بدون قفز','Low-Impact Jacks','jack',{low:1},'cardio','delt_side glutes','calves','bw',1,'c',3,'t40',30);
X('high-knees','رفع الركبتين السريع','High Knees','knees',{},'cardio','hip_flexors quads','calves abs','bw',1,'c',3,'t30',30,'h');
X('march','المشي في المكان','Marching in Place','knees',{march:1},'cardio','hip_flexors','calves','bw',1,'c',2,'t60',20);
X('thruster','الثراستر بالدمبل','Dumbbell Thruster','thruster',{},'thruster','quads delt_front','glutes triceps abs','db',2,'s',3,'8-12',90,'f');
X('shadow-boxing','الملاكمة الوهمية','Shadow Boxing','box',{},'cardio','delt_front obliques','triceps calves','bw',1,'c',3,'t45',30);
X('skater','قفزة المتزلّج','Skater Jumps','skater',{},'cardio','glutes quads','calves obliques','bw',2,'c',3,'t30',45,'h');
X('inchworm','الدودة','Inchworm','inchworm',{},'mob','hamstrings abs','delt_front','bw',1,'m',2,'6-8',30,'f');
// MOBILITY
X('arm-circles','دوائر الذراعين','Arm Circles','circles',{},'mob','delt_side','delt_front delt_rear','bw',1,'m',1,'t30',10);
X('leg-swings','أرجحة الساق','Leg Swings','swings',{},'mob','hip_flexors hamstrings','glutes','bw',1,'m',1,'t40',10);
X('torso-twist','تدوير الجذع','Torso Rotations','rotate',{},'mob','obliques','lower_back','bw',1,'m',1,'t30',10);
X('cat-cow','القطة والبقرة','Cat-Cow','quad',{cat:1},'mob','lower_back','abs','bw',1,'m',1,'t40',10);
X('deep-squat-hold','الثبات في القرفصاء العميقة','Deep Squat Hold','squat',{hold:1,depth:1.15},'mob','quads glutes','calves','bw',1,'m',1,'t30',10);
X('band-pass','تمرير المطاط فوق الرأس','Band Pass-Through','passthru',{},'mob','delt_front delt_rear','chest_lower','band',1,'m',1,'t30',10);
// STRETCH
X('hamstring-stretch','إطالة الفخذ الخلفية واقفًا','Standing Hamstring Stretch','stretch',{s:'ham'},'stretch','hamstrings','lower_back','bw',1,'x',1,'t30',5);
X('quad-stretch','إطالة الفخذ الأمامية واقفًا','Standing Quad Stretch','stretch',{s:'quad'},'stretch','quads','hip_flexors','bw',1,'x',1,'t30',5);
X('chest-stretch','إطالة الصدر','Chest Stretch','stretch',{s:'chest'},'stretch','chest_lower','delt_front','bw',1,'x',1,'t30',5);
X('cross-shoulder','إطالة الكتف عبر الجسم','Cross-Body Shoulder Stretch','stretch',{s:'cross'},'stretch','delt_rear','upper_back','bw',1,'x',1,'t30',5);
X('tri-stretch','إطالة الترايسبس فوق الرأس','Overhead Triceps Stretch','stretch',{s:'tri'},'stretch','triceps','lats','bw',1,'x',1,'t30',5);
X('hip-flexor-stretch','إطالة ثنية الورك راكعًا','Kneeling Hip Flexor Stretch','stretch',{s:'hipflex'},'stretch','hip_flexors','quads','bw',1,'x',1,'t30',5);
X('seated-fold','الانحناء الأمامي جالسًا','Seated Forward Fold','stretch',{s:'fold'},'stretch','hamstrings','lower_back calves','bw',1,'x',1,'t30',5);
X('butterfly','وضعية الفراشة','Butterfly Stretch','stretch',{s:'fly'},'stretch','glutes','hip_flexors','bw',1,'x',1,'t30',5);
X('cobra','وضعية الكوبرا','Cobra Stretch','prone',{cobra:1},'stretch','abs','hip_flexors','bw',1,'x',1,'t30',5);
X('calf-stretch','إطالة السمانة','Calf Stretch','stretch',{s:'calf'},'stretch','calves','','bw',1,'x',1,'t30',5);
X('childs-pose','وضعية الطفل','Child\'s Pose','stretch',{s:'child'},'stretch','lower_back lats','glutes','bw',1,'x',1,'t40',5);

const EXI = Object.fromEntries(EX.map(e => [e.id, e]));
const exCat = e => {
  if (e.kind === 'c') return 'cardio'; if (e.kind === 'm') return 'mob'; if (e.kind === 'x') return 'stretch';
  const m = e.prim[0];
  return m.startsWith('chest') ? 'chest' : m.startsWith('delt') ? 'shoulders' : ['traps','upper_back','lats','lower_back'].includes(m) ? 'back'
    : m === 'biceps' ? 'biceps' : m === 'triceps' ? 'triceps' : m === 'forearms' ? 'forearms' : ['abs','obliques','hip_flexors'].includes(m) ? 'abs' : m;
};
const CATS = {chest:'الصدر',back:'الظهر',shoulders:'الأكتاف',biceps:'البايسبس',triceps:'الترايسبس',forearms:'الساعد',abs:'البطن والجذع',glutes:'الأرداف',quads:'الفخذ الأمامية',hamstrings:'الفخذ الخلفية',calves:'السمانة',full:'الجسم كامل',cardio:'كارديو',mob:'حركة ومرونة',stretch:'إطالة'};

// Ready-made programs: [exerciseId, sets, reps|tSEC, rest]
const PROGRAMS = [
 {id:'p-beginner',name:'برنامج المبتدئين — الجسم كامل',tag:'مبتدئ · بلا أدوات',items:[['bw-squat',3,'10-12',60],['knee-pushup',3,'8-10',60],['glute-bridge',3,'12',45],['superman',2,'10',45],['plank',3,'t20',45],['dead-bug',2,'8',45]]},
 {id:'p-legs30',name:'الأرجل في 30 دقيقة — البيت',tag:'مبتدئ · بيت',items:[['bw-squat',3,'12-15',60],['reverse-lunge',3,'10',60],['glute-bridge',3,'15',45],['side-lunge',2,'8',60],['wall-sit',2,'t30',45],['calf-raise',3,'15',45]]},
 {id:'p-full-home',name:'الجسم كامل بالدمبل',tag:'متوسط · بيت',items:[['goblet-squat',3,'10-12',75],['floor-press',3,'8-12',75],['db-row',3,'10',60],['db-shoulder-press',3,'10',75],['reverse-lunge',2,'10',60],['db-curl',2,'12',45]]},
 {id:'p-full-gym',name:'الجسم كامل — النادي',tag:'مبتدئ · نادي',items:[['leg-press',3,'10-12',90],['chest-press-machine',3,'10',75],['lat-pulldown',3,'10',75],['seated-cable-row',3,'10',75],['db-shoulder-press',2,'10',75],['plank',2,'t30',45]]},
 {id:'p-upper',name:'الجزء العلوي',tag:'متوسط · نادي',items:[['db-bench',3,'8-12',90],['lat-pulldown',3,'8-12',90],['db-shoulder-press',3,'10',75],['seated-cable-row',3,'10',75],['db-curl',2,'12',60],['tri-pushdown',2,'12',60]]},
 {id:'p-lower',name:'الجزء السفلي',tag:'متوسط · نادي',items:[['goblet-squat',3,'10',90],['rdl',3,'8-10',90],['leg-press',3,'12',90],['leg-curl',3,'12',60],['calf-raise',3,'15',45],['plank',2,'t30',45]]},
 {id:'p-push',name:'دفع (Push)',tag:'متوسط · نادي',items:[['bb-bench',4,'6-10',120],['incline-db',3,'8-12',90],['db-shoulder-press',3,'10',90],['lateral-raise',3,'12-15',60],['tri-pushdown',3,'12',60],['overhead-ext',2,'12',60]]},
 {id:'p-pull',name:'سحب (Pull)',tag:'متوسط · نادي',items:[['lat-pulldown',4,'8-12',90],['bb-row',3,'8',90],['face-pull',3,'15',60],['rear-delt-fly',2,'15',60],['db-curl',3,'10',60],['hammer-curl',2,'12',60]]},
 {id:'p-legs',name:'أرجل (Legs)',tag:'متقدم · نادي',items:[['back-squat',4,'5-8',150],['rdl',3,'8',120],['bulgarian',3,'8',90],['leg-extension',3,'12',60],['leg-curl',3,'12',60],['calf-raise',4,'15',45]]},
 {id:'p-strength',name:'القوة الأساسية',tag:'متقدم · نادي',items:[['back-squat',5,'5',180],['bb-bench',5,'5',180],['bb-row',5,'5',150],['ohp',3,'5',150],['deadlift',1,'5',180]]},
 {id:'p-core',name:'تقوية الجذع',tag:'كل المستويات · بلا أدوات',items:[['plank',3,'t30',45],['dead-bug',3,'10',45],['bicycle-crunch',3,'16',45],['side-plank',2,'t20',45],['bird-dog',3,'8',45],['reverse-crunch',2,'12',45]]},
 {id:'p-fitness',name:'لياقة عامة وكارديو',tag:'مبتدئ · بلا أدوات',items:[['jumping-jack',3,'t40',30],['bw-squat',3,'15',45],['pushup',3,'10',45],['mountain-climber',3,'t30',45],['glute-bridge',3,'15',45],['high-knees',3,'t30',45]]},
 {id:'p-mobility',name:'روتين الحركة والمرونة',tag:'كل المستويات · 12 دقيقة',items:[['cat-cow',1,'t45',10],['torso-twist',1,'t40',10],['leg-swings',1,'t40',10],['arm-circles',1,'t30',10],['deep-squat-hold',2,'t30',15],['hip-flexor-stretch',2,'t30',10],['childs-pose',1,'t45',10]]}
];
const WARM = {legs:['march','leg-swings','torso-twist','deep-squat-hold'], upper:['arm-circles','band-pass','torso-twist','march'], full:['march','arm-circles','leg-swings','torso-twist'], core:['cat-cow','torso-twist','march'], mobility:[]};
const COOL = {legs:['quad-stretch','hamstring-stretch','hip-flexor-stretch','calf-stretch'], upper:['chest-stretch','cross-shoulder','tri-stretch','childs-pose'], full:['hamstring-stretch','chest-stretch','hip-flexor-stretch','childs-pose'], core:['cobra','childs-pose','seated-fold'], mobility:[]};
const FOCUS = {
 legs:{ar:'الأرجل',m:['quads','glutes','hamstrings','quads','glutes','calves']},
 upper:{ar:'الجزء العلوي',m:['chest_lower','lats','delt_side','upper_back','biceps','triceps']},
 full:{ar:'الجسم كامل',m:['quads','chest_lower','lats','glutes','delt_front','abs']},
 push:{ar:'دفع',m:['chest_lower','delt_front','chest_upper','delt_side','triceps']},
 pull:{ar:'سحب',m:['lats','upper_back','delt_rear','biceps','lats']},
 core:{ar:'الجذع',m:['abs','obliques','lower_back','abs','obliques']},
 glutes:{ar:'الأرداف',m:['glutes','hamstrings','glutes','glutes']},
 mobility:{ar:'حركة ومرونة',m:[]}
};
const SOURCES = [
 ['ACSM Position Stand: Progression Models in Resistance Training for Healthy Adults (2009)','https://pubmed.ncbi.nlm.nih.gov/19204579/'],
 ['WHO Guidelines on Physical Activity and Sedentary Behaviour (2020)','https://www.who.int/publications/i/item/9789240015128'],
 ['NSCA — Education Articles','https://www.nsca.com/education/articles/'],
 ['ExRx.net — Exercise & Muscle Directory','https://exrx.net/Lists/Directory']
];
