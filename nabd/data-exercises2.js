// Extra movement patterns + extended exercise library (batch 2)
Object.assign(P, {
  pullover: o => ({f:[{rx:-90, hf:10, k:85, flat:true, sf:175, e:15, sa:5}, {rx:-90, hf:10, k:85, flat:true, sf:85, e:15, sa:5}], dur:3, view:'side', anchor:{m:['backU','backL'], y:.47}, sup:[box(['backU','backL','glute'],0,.34,.9)], track:'handL', fault:{t:'ثني المرفقين كثيرًا وتقوّس الظهر', m:{e:70, sp:-15}}}),
  rollout: o => ({f:[{rx:50, hf:50, k:90, flat:false, sf:50, e:0}, {rx:80, hf:80, k:90, flat:false, sf:160, e:0}], dur:3.4, view:'side', track:'handL', fault:{t:'ترهّل أسفل الظهر عند الامتداد', m:{sp:-20}}}),
  sideleg: o => ({f:[{saL:20}, {haR:35, saL:20}], dur:2.4, view:'front', track:'footR', fault:{t:'ميلان الجذع للجانب', m:{ss:15}}}),
  taps: o => { const t = {rx:64, sf:64, e:0, flat:false, a:26}; return {f:[t, {...t, sfL:110, eL:60}, t, {...t, sfR:110, eR:60}], dur:2.4, view:'front', track:'handL'}; },
  vup: o => ({f:[{rx:-90, sf:175, flat:false, sa:15}, {rx:-90, sp:40, hf:70, sf:80, flat:false, sa:15}], dur:2.4, view:'side', track:'handL'}),
  flutter: o => { const b = {rx:-90, sp:10, sa:20, flat:false}; return {f:[{...b, hfL:30, hfR:10}, {...b, hfL:10, hfR:30}], dur:.9, view:'side', track:'footL'}; },
  situp: o => ({f:[{rx:-90, hf:45, k:135, flat:true, sf:30, e:120}, {rx:-90, hf:45, k:135, flat:true, sp:75, sf:30, e:120}], dur:2.8, view:'side', track:'head', fault:{t:'سحب الرقبة والارتداد بالزخم', m:{nk:45}}}),
  heeltap: o => { const b = {rx:-90, hf:45, k:135, flat:true, sp:20, sa:10}; return {f:[{...b, ss:15, saL:25}, {...b, ss:-15, saR:25}], dur:1.6, view:'front', track:'handL'}; },
  bearhold: o => { const q = {...Q, k:90, hf:90, rx:90}; return {f:[{...q}, {...q, jy:.07}], dur:3, view:'side', hold:true, track:'kneeL'}; },
  curtsy: o => ({f:[{}, {hfL:80, kL:95, hfR:-10, haR:-20, kR:85, aR:-35, sp:8, sf:20}], dur:3, view:'front', track:'butt'}),
  sumo: o => ({f:[{ha:25, sf:10, e:4}, {ha:32, hf:90, k:105, sp:25, sf:10}], dur:3, view:'front', track:'butt', fault:{t:'دخول الركبتين للداخل', m:{ha:5}}}),
  jumplunge: o => ({f:[{hfL:85, kL:95, hfR:-12, kR:85, aR:-37}, {jy:.22, hfL:30, kL:40, hfR:20, kR:40, flat:false}, {hfR:85, kR:95, hfL:-12, kL:85, aL:-37}, {jy:.22, hfL:20, kL:40, hfR:30, kR:40, flat:false}], dur:2.4, view:'side', track:'butt'}),
  tuck: o => ({f:[{hf:40, k:50, sp:20, sf:-20}, {jy:.35, hf:95, k:120, flat:false, sf:40}], dur:1.3, view:'side', track:'butt'}),
  buttkick: o => ({f:[{kL:130, sfR:40, eR:90, sfL:-20, eL:90, jy:.04}, {kR:130, sfL:40, eL:90, sfR:-20, eR:90, jy:.04}], dur:.7, view:'side', track:'heelL'}),
  shuffle: o => { const q = {hf:40, k:45, sp:25, sf:40, e:80}; return {f:[{...q, haL:18}, {...q, haR:18}], dur:.9, view:'front', track:'butt'}; },
  rotstretch: o => ({f:[{hfL:90, kL:95, hfR:-15, kR:20, flat:false, sp:40, sfR:80, sfL:80}, {hfL:90, kL:95, hfR:-15, kR:20, flat:false, sp:30, st:45, sfL:170, saL:30, sfR:80}], dur:4, view:'front', track:'handL'}),
  hipcircle: o => ({f:[{ss:10, sa:30, e:90}, {sp:10, sa:30, e:90}, {ss:-10, sa:30, e:90}, {sp:-8, sa:30, e:90}], dur:3, view:'front', track:'butt'}),
  stretch2: o => {
    const p = {
      side:{ss:-24, saL:170, saR:10}, knees:{rx:-90, hf:120, k:130, sf:60, e:90, flat:false}, lyingham:{rx:-90, hfR:85, kR:0, sfR:90, e:20, flat:false},
      upward:{rx:90, sp:-45, sf:45, e:0, flat:false}, wrist:{sfR:90, eR:0, wR:-60, sfL:80, eL:40}, frog:{...Q, ha:45},
      happy:{rx:-90, hf:130, k:90, ha:30, sf:60, e:30, flat:false}, lat:{rx:60, sp:40, hf:90, k:120, sf:180, saL:25, flat:false, a:60},
      pigeon:{rx:30, hfL:80, kL:110, haL:20, hfR:-30, kR:0, flat:false, sf:30}, twist:{hf:90, k:90, flat:false, st:45, sfL:90, saL:40, sfR:40}
    }[o.s];
    return {f:[p, {...p, sp:(p.sp || 0) + 4}], dur:4, hold:true, view:['side','wrist'].includes(o.s) ? 'front' : 'side', track:'head'};
  }
});
const _n0 = EX.length;
// CHEST
X('wall-pushup','الضغط على الحائط','Wall Push-Up','pushup',{tilt:20,inc:1},'pushup','chest_lower','triceps delt_front','bw',1,'s',3,'12-20',45);
X('spiderman-pushup','ضغط سبايدرمان','Spiderman Push-Up','pushup',{},'pushup','chest_lower','obliques triceps hip_flexors','bw',2,'s',3,'6-10',75);
X('clap-pushup','الضغط مع تصفيق','Clap Push-Up','pushup',{},'pushup','chest_lower','triceps delt_front','bw',3,'s',3,'5-8',90,'h');
X('archer-pushup','ضغط الرامي','Archer Push-Up','pushup',{wide:1},'pushup','chest_lower','triceps delt_front','bw',3,'s',3,'5-8',90);
X('incline-bb-bench','ضغط البار المائل','Incline Barbell Bench Press','bench',{inc:1},'bench','chest_upper','delt_front triceps','bb bench',2,'s',4,'6-10',120);
X('decline-db-press','ضغط الدمبل المنحدر','Decline Dumbbell Press','bench',{},'bench','chest_lower','triceps','db bench',2,'s',3,'8-12',90);
X('single-db-bench','ضغط الصدر بدمبل واحد','Single-Arm Dumbbell Press','bench',{},'bench','chest_lower','obliques triceps','db bench',2,'s',3,'8-10',75);
X('hex-press','ضغط الدمبل الملتصق','Dumbbell Squeeze Press','bench',{close:1},'bench','chest_lower','triceps','db bench',1,'s',3,'10-12',60);
X('incline-fly','التفتيح المائل بالدمبل','Incline Dumbbell Fly','fly',{},'fly','chest_upper','delt_front','db bench',2,'s',3,'10-15',60,'i');
X('low-cable-fly','تفتيح الكيبل من الأسفل للأعلى','Low-to-High Cable Fly','fly',{stand:1},'fly','chest_upper','delt_front','cb',2,'s',3,'12-15',60,'i');
X('band-fly','التفتيح بالمطاط','Band Chest Fly','fly',{stand:1},'fly','chest_lower','delt_front','band',1,'s',3,'12-15',45,'i');
X('db-pullover','السحب فوق الرأس بالدمبل','Dumbbell Pullover','pullover',{},'fly','chest_lower lats','triceps','db bench',2,'s',3,'10-12',60);
X('incline-machine-press','جهاز الضغط المائل','Incline Machine Press','press',{seat:1},'machine','chest_upper','triceps delt_front','mc',1,'s',3,'10-12',75);
X('kb-floor-press','ضغط الأرض بالكيتل بل','Kettlebell Floor Press','bench',{floor:1},'bench','chest_lower','triceps','kb',1,'s',3,'8-12',60);
// BACK
X('close-pulldown','السحب العالي بقبضة ضيقة','Close-Grip Lat Pulldown','pull',{seat:1,chin:1},'pull','lats','biceps','mc cb',1,'s',3,'10-12',75);
X('neutral-pulldown','السحب العالي بقبضة محايدة','Neutral-Grip Pulldown','pull',{seat:1,chin:1},'pull','lats','biceps forearms','mc cb',1,'s',3,'10-12',75);
X('band-pulldown','السحب العالي بالمطاط','Band Lat Pulldown','pull',{seat:1},'pull','lats','biceps','band',1,'s',3,'12-15',45);
X('assisted-pullup','العقلة بالمساعدة','Assisted Pull-Up','pull',{},'pull','lats','biceps upper_back','mc band bar',1,'s',3,'6-10',90);
X('scap-pullup','عقلة لوح الكتف','Scapular Pull-Up','pull',{dead:1},'hang','lats traps','forearms','bar',1,'s',3,'8-12',60);
X('pendlay-row','تجديف بندلاي','Pendlay Row','row',{},'row','upper_back lats','biceps lower_back','bb',3,'s',4,'5-8',120);
X('tbar-row','التجديف بالبار T','T-Bar Row','row',{},'row','upper_back lats','biceps','bb mc',2,'s',3,'8-10',90);
X('chest-supported-row','التجديف بالدمبل على مقعد مائل','Chest-Supported Dumbbell Row','row',{},'row','upper_back','delt_rear biceps','db bench',1,'s',3,'10-12',60);
X('single-cable-row','التجديف بالكيبل بذراع واحدة','Single-Arm Cable Row','row',{seated:1},'row','lats','upper_back biceps','cb',1,'s',3,'10-12',60);
X('band-row','التجديف بالمطاط','Band Seated Row','row',{seated:1},'row','upper_back lats','biceps','band',1,'s',3,'12-15',45);
X('renegade-row','تجديف رينيجيد','Renegade Row','row',{single:1},'row','lats upper_back','abs obliques triceps','db',3,'s',3,'6-10',90);
X('rack-pull','السحب من الحامل','Rack Pull','hinge',{dl:1},'deadlift','lower_back glutes traps','hamstrings forearms','bb',2,'s',3,'5-8',120);
X('cable-pullover','السحب بالكيبل بذراعين مستقيمتين','Cable Pullover','pull',{straight:1},'pull','lats','triceps','cb',2,'s',3,'12-15',60,'i');
X('prone-y-raise','رفع Y على البطن','Prone Y Raise','prone',{},'prone','upper_back traps','delt_rear lower_back','bw',1,'s',3,'10-12',45,'i');
X('ytw','تمرين Y-T-W','Y-T-W Raises','fly',{rear:1},'raise','upper_back delt_rear','traps','db bw',1,'s',2,'8-10',45,'i');
X('kb-row','التجديف بالكيتل بل','Kettlebell Row','row',{single:1},'row','lats upper_back','biceps','kb bench',1,'s',3,'10-12',60);
X('reverse-hyper','الفرد العكسي للظهر','Reverse Hyperextension','prone',{},'prone','glutes lower_back','hamstrings','mc bench',2,'s',3,'12-15',60);
// SHOULDERS
X('seated-db-press','ضغط الكتف بالدمبل جالسًا','Seated Dumbbell Shoulder Press','press',{seat:1},'press','delt_front delt_side','triceps','db bench',1,'s',3,'8-12',90);
X('machine-shoulder-press','جهاز ضغط الكتف','Machine Shoulder Press','press',{seat:1},'machine','delt_front delt_side','triceps','mc',1,'s',3,'10-12',75);
X('landmine-press','ضغط اللاندماين','Landmine Press','press',{},'press','delt_front chest_upper','triceps abs','bb',2,'s',3,'8-10',75);
X('push-press','الضغط بالدفع','Push Press','press',{},'press','delt_front delt_side','triceps quads','bb db',3,'s',4,'4-6',120,'f');
X('z-press','ضغط Z جالسًا على الأرض','Z Press','press',{seat:1},'press','delt_front delt_side','triceps abs','bb db',3,'s',3,'6-8',120);
X('band-shoulder-press','ضغط الكتف بالمطاط','Band Shoulder Press','press',{},'press','delt_front delt_side','triceps','band',1,'s',3,'12-15',45);
X('cable-front-raise','الرفع الأمامي بالكيبل','Cable Front Raise','raise',{front:1},'raise','delt_front','chest_upper','cb',1,'s',3,'12-15',45,'i');
X('plate-front-raise','الرفع الأمامي بالقرص','Plate Front Raise','raise',{front:1},'raise','delt_front','traps','mc',1,'s',3,'10-12',45,'i');
X('seated-lateral-raise','الرفع الجانبي جالسًا','Seated Lateral Raise','raise',{},'raise','delt_side','','db bench',1,'s',3,'12-15',45,'i');
X('reverse-pec-deck','جهاز التفتيح الخلفي','Reverse Pec Deck','fly',{rear:1},'machine','delt_rear','upper_back','mc',1,'s',3,'12-15',45,'i');
X('band-external-rotation','التدوير الخارجي بالمطاط','Band External Rotation','fly',{face:1},'raise','delt_rear','upper_back','band cb',1,'s',2,'12-15',30,'i');
X('elevated-pike-pushup','ضغط البايك بقدمين مرتفعتين','Elevated Pike Push-Up','pike',{},'press','delt_front delt_side','triceps','bw bench',3,'s',3,'5-8',90);
X('kb-press','ضغط الكتف بالكيتل بل','Kettlebell Overhead Press','press',{},'press','delt_front delt_side','triceps abs','kb',2,'s',3,'6-10',75);
// BICEPS
X('incline-db-curl','تجعيد الدمبل على مقعد مائل','Incline Dumbbell Curl','curl',{},'curl','biceps','forearms','db bench',2,'s',3,'10-12',60,'i');
X('spider-curl','تجعيد العنكبوت','Spider Curl','curl',{preacher:1},'curl','biceps','','db bench',2,'s',3,'10-12',45,'i');
X('zottman-curl','تجعيد زوتمان','Zottman Curl','curl',{},'curl','biceps forearms','','db',2,'s',3,'10-12',60,'i');
X('ez-curl','تجعيد البار المتعرّج','EZ-Bar Curl','curl',{},'curl','biceps','forearms','bb',1,'s',3,'8-12',60,'i');
X('curl-21s','تجعيد 21','21s Biceps Curl','curl',{},'curl','biceps','forearms','bb db',2,'s',3,'21',75,'i');
X('band-hammer-curl','التجعيد المطرقي بالمطاط','Band Hammer Curl','curl',{alt:1},'curl','biceps forearms','','band',1,'s',3,'12-15',45,'i');
X('rope-hammer-curl','التجعيد المطرقي بالحبل','Cable Rope Hammer Curl','curl',{},'curl','biceps forearms','','cb',1,'s',3,'10-12',60,'i');
X('drag-curl','تجعيد السحب','Drag Curl','curl',{},'curl','biceps','delt_rear','bb',2,'s',3,'8-12',60,'i');
X('chinup-hold','الثبات في العقلة المعكوسة','Chin-Up Hold','pull',{dead:1},'hang','biceps lats','forearms','bar',2,'s',3,'t15',75);
// TRICEPS
X('rope-pushdown','دفع الترايسبس بالحبل','Rope Pushdown','tri',{},'tri','triceps','','cb',1,'s',3,'12-15',45,'i');
X('single-pushdown','دفع الترايسبس بذراع واحدة','Single-Arm Pushdown','tri',{},'tri','triceps','','cb',2,'s',3,'12-15',45,'i');
X('cable-overhead-ext','تمديد الترايسبس فوق الرأس بالكيبل','Cable Overhead Extension','tri',{over:1},'tri','triceps','','cb',2,'s',3,'10-12',60,'i');
X('band-pushdown','دفع الترايسبس بالمطاط','Band Pushdown','tri',{},'tri','triceps','','band',1,'s',3,'15-20',45,'i');
X('tate-press','ضغط تيت','Tate Press','bench',{skull:1},'tri','triceps','','db bench',2,'s',3,'10-12',60,'i');
X('dip-machine','جهاز التغطيس','Machine Dip','dip',{},'machine','triceps','chest_lower','mc',1,'s',3,'10-12',60);
X('db-skull-crusher','كسّارة الجمجمة بالدمبل','Dumbbell Skull Crusher','bench',{skull:1},'tri','triceps','','db bench',2,'s',3,'10-12',60,'i');
// FOREARMS
X('suitcase-carry','حمل الحقيبة','Suitcase Carry','carry',{},'carry','forearms obliques','traps abs','db kb',1,'s',3,'t30',60);
X('wrist-roller','بكرة الرسغ','Wrist Roller','wrist',{},'wrist','forearms','delt_front','mc',2,'s',3,'t30',60,'i');
X('towel-hang','التعلّق بالمنشفة','Towel Hang','pull',{dead:1},'hang','forearms','lats biceps','bar',3,'s',3,'t20',75);
X('finger-curl','تجعيد الأصابع','Finger Curl','wrist',{},'wrist','forearms','','db bb',1,'s',3,'15-20',45,'i');
X('plate-pinch','قبضة القرص','Plate Pinch Hold','carry',{},'carry','forearms','traps','mc',2,'s',3,'t30',60);
// CORE
X('ab-rollout','تمرين عجلة البطن','Ab Wheel Rollout','rollout',{},'plank','abs','lats obliques','mc bw',3,'s',3,'6-10',75);
X('knee-rollout','عجلة البطن على الركبتين','Kneeling Ab Rollout','rollout',{},'plank','abs','lats','mc bw',2,'s',3,'8-10',60);
X('pallof-press','ضغط بالوف','Pallof Press','fly',{apart:0,stand:1},'twist','obliques abs','','cb band',1,'s',3,'10-12',45);
X('v-up','تمرين V','V-Up','vup',{},'crunch','abs','hip_flexors','bw',3,'s',3,'8-12',60);
X('toe-touch','لمس أصابع القدم مستلقيًا','Toe Touches','vup',{},'crunch','abs','','bw',1,'s',3,'12-15',45);
X('flutter-kicks','الركلات الرفرفة','Flutter Kicks','flutter',{},'legraise','abs hip_flexors','','bw',1,'s',3,'t30',45);
X('scissor-kicks','ركلات المقص','Scissor Kicks','flutter',{},'legraise','abs hip_flexors','obliques','bw',2,'s',3,'t30',45);
X('heel-taps','لمس الكعبين','Heel Taps','heeltap',{},'crunch','obliques','abs','bw',1,'s',3,'16-20',45);
X('shoulder-taps','بلانك مع لمس الكتف','Plank Shoulder Taps','taps',{},'plank','abs obliques','delt_front triceps','bw',2,'s',3,'16-20',45);
X('plank-jacks','بلانك مع قفز','Plank Jacks','climber',{},'cardio','abs','delt_front glutes','bw',2,'c',3,'t30',45,'h');
X('side-plank-dip','البلانك الجانبي مع خفض الورك','Side Plank Hip Dips','sideplank',{},'sideplank','obliques','abs glutes','bw',2,'s',2,'10-12',45);
X('hanging-leg-raise','رفع الساقين معلّقًا','Hanging Leg Raise','pull',{knee:1},'hang','abs hip_flexors','forearms obliques','bar',3,'s',3,'6-10',75);
X('cable-crunch','الكرنش بالكيبل','Cable Crunch','quad',{cat:1},'crunch','abs','','cb',2,'s',3,'12-15',60,'i');
X('situp','الجلوس من الاستلقاء','Sit-Up','situp',{},'crunch','abs hip_flexors','','bw',1,'s',3,'10-15',45);
X('decline-situp','الجلوس على مقعد منحدر','Decline Sit-Up','situp',{},'crunch','abs hip_flexors','','bench mc',2,'s',3,'10-12',60);
X('bear-hold','ثبات الدب','Bear Plank Hold','bearhold',{},'quad','abs','delt_front quads','bw',1,'s',3,'t30',45);
X('cross-climber','متسلّق الجبال المتقاطع','Cross-Body Mountain Climber','climber',{},'cardio','obliques abs','hip_flexors','bw',2,'c',3,'t30',45,'h');
X('weighted-crunch','الكرنش بالوزن','Weighted Crunch','crunch',{},'crunch','abs','','db mc',2,'s',3,'10-15',45);
// GLUTES
X('frog-pump','ضخ الضفدع','Frog Pump','bridge',{},'bridge','glutes','','bw',1,'s',3,'15-20',45,'i');
X('glute-march','الجسر مع المشي','Glute Bridge March','bridge',{single:1},'bridge','glutes','hamstrings abs','bw',2,'s',3,'10-12',45);
X('bstance-thrust','دفع الورك بوضعية B','B-Stance Hip Thrust','bridge',{thrust:1},'bridge','glutes','hamstrings','bb db bench',2,'s',3,'8-12',75);
X('db-hip-thrust','دفع الورك بالدمبل','Dumbbell Hip Thrust','bridge',{thrust:1},'bridge','glutes','hamstrings','db bench',1,'s',3,'10-15',60);
X('kb-sumo-deadlift','الرفعة الميتة السومو بالكيتل بل','Kettlebell Sumo Deadlift','sumo',{},'hinge','glutes quads','hamstrings lower_back','kb db',1,'s',3,'10-12',60);
X('cable-pull-through','السحب بين الساقين بالكيبل','Cable Pull-Through','hinge',{swing:1},'hinge','glutes hamstrings','lower_back','cb band',1,'s',3,'12-15',60);
X('curtsy-lunge','طعن الانحناءة','Curtsy Lunge','curtsy',{},'lunge','glutes quads','hamstrings','bw db',2,'s',3,'8-10',60);
X('standing-abduction','تبعيد الساق واقفًا','Standing Hip Abduction','sideleg',{},'mob','glutes','obliques','bw band cb',1,'s',3,'12-15',45,'i');
X('monster-walk','مشية الوحش بالمطاط','Monster Walk','bandwalk',{},'mob','glutes','quads','band',1,'s',3,'t30',45);
X('side-lying-raise','رفع الساق مستلقيًا على الجانب','Side-Lying Leg Raise','clam',{},'mob','glutes','obliques','bw band',1,'s',3,'12-15',45,'i');
X('kb-single-swing','التأرجح بذراع واحدة','Single-Arm Kettlebell Swing','hinge',{swing:1},'swing','glutes hamstrings','obliques forearms','kb',3,'s',3,'10-12',60,'h');
// QUADS
X('split-squat','قرفصاء الخطوة الثابتة','Split Squat','lunge',{},'lunge','quads glutes','hamstrings','bw db',1,'s',3,'8-12',60);
X('walking-lunge','الطعن مع المشي','Walking Lunge','lunge',{},'lunge','quads glutes','hamstrings calves','bw db',2,'s',3,'10-12',60);
X('jump-lunge','الطعن بالقفز','Jumping Lunge','jumplunge',{},'lunge','quads glutes','calves hamstrings','bw',3,'c',3,'8-12',75,'h');
X('sumo-squat','قرفصاء السومو','Sumo Squat','sumo',{},'squat','quads glutes','hamstrings','bw db kb',1,'s',3,'12-15',60);
X('hack-squat','جهاز الهاك سكوات','Hack Squat','squat',{arms:'back'},'machine','quads','glutes','mc',2,'s',3,'8-12',90);
X('smith-squat','القرفصاء على جهاز سميث','Smith Machine Squat','squat',{arms:'back'},'squat','quads glutes','hamstrings','mc',1,'s',3,'8-12',90);
X('box-squat','القرفصاء على الصندوق','Box Squat','squat',{},'squat','quads glutes','hamstrings','bw bench',1,'s',3,'10-12',60);
X('heel-elevated-squat','القرفصاء بكعبين مرتفعين','Heel-Elevated Goblet Squat','squat',{arms:'goblet'},'squat','quads','glutes','db kb',2,'s',3,'10-12',75);
X('pause-squat','القرفصاء مع توقف','Pause Squat','squat',{},'squat','quads glutes','abs','bw db bb',2,'s',3,'6-10',90);
X('pistol-squat','قرفصاء المسدس بالمساعدة','Assisted Pistol Squat','squat',{depth:1.1},'squat','quads glutes','abs calves','bw',3,'s',3,'4-8',90);
X('step-down','النزول من الصندوق','Step-Down','step',{},'step','quads','glutes','bw bench',2,'s',3,'8-10',60);
X('spanish-squat','القرفصاء الإسبانية بالمطاط','Spanish Squat','squat',{hold:1,depth:.9,arms:'hips'},'squat','quads','glutes','band',2,'s',3,'t30',60);
X('cossack-squat','قرفصاء القوزاق','Cossack Squat','lunge',{side:1},'lunge','quads glutes','hamstrings','bw kb',3,'s',3,'6-8',60);
// HAMSTRINGS
X('ball-leg-curl','ثني الساق على الكرة','Stability Ball Leg Curl','bridge',{},'bridge','hamstrings','glutes','mc',2,'s',3,'8-12',60);
X('seated-leg-curl','ثني الأرجل جالسًا','Seated Leg Curl','legext',{},'machine','hamstrings','','mc',1,'s',3,'10-15',60,'i');
X('hamstring-walkout','المشي بالكعبين في الجسر','Hamstring Walkout','bridge',{},'bridge','hamstrings','glutes','bw',2,'s',3,'6-10',60);
X('band-good-morning','صباح الخير بالمطاط','Band Good Morning','hinge',{arms:'head'},'hinge','hamstrings lower_back','glutes','band',1,'s',3,'12-15',45);
X('glute-ham-raise','رفع الأرداف والخلفية','Glute-Ham Raise','nordic',{},'nordic','hamstrings','glutes calves','mc',3,'s',3,'5-8',90);
X('kb-rdl','الرفعة الرومانية بالكيتل بل','Kettlebell Romanian Deadlift','hinge',{},'hinge','hamstrings glutes','lower_back','kb',1,'s',3,'10-12',60);
// CALVES
X('donkey-calf','رفع السمانة مع الانحناء','Donkey Calf Raise','calf',{},'calf','calves','','mc bw',2,'s',3,'15-20',45,'i');
X('leg-press-calf','رفع السمانة على جهاز الأرجل','Leg Press Calf Raise','calf',{seat:1},'calf','calves','','mc',1,'s',3,'15-20',45,'i');
X('stair-calf','رفع السمانة على الدرج','Step Calf Raise','calf',{},'calf','calves','','bw db',1,'s',3,'12-20',45,'i');
X('pogo-hops','قفزات البوغو','Pogo Hops','rope',{},'cardio','calves','quads','bw',2,'c',3,'t30',45,'h');
// CARDIO
X('butt-kicks','ركل الأرداف','Butt Kicks','buttkick',{},'cardio','hamstrings','calves','bw',1,'c',3,'t30',30,'h');
X('tuck-jump','القفز مع ضم الركبتين','Tuck Jump','tuck',{},'cardio','quads glutes','abs calves','bw',3,'c',3,'6-10',75,'h');
X('squat-jacks','القرفصاء المفتوح بالقفز','Squat Jacks','sumo',{},'cardio','quads glutes','calves','bw',2,'c',3,'t30',45,'h');
X('star-jump','قفزة النجمة','Star Jump','jack',{},'cardio','calves delt_side','quads glutes','bw',2,'c',3,'8-12',45,'h');
X('sprint-in-place','العدو في المكان','Sprint in Place','knees',{},'cardio','hip_flexors quads','calves','bw',2,'c',4,'t20',40,'h');
X('step-touch','الخطوة الجانبية','Step Touch','jack',{low:1},'cardio','glutes','calves','bw',1,'c',3,'t45',20);
X('lateral-shuffle','الحركة الجانبية السريعة','Lateral Shuffle','shuffle',{},'cardio','glutes quads','calves','bw',2,'c',3,'t30',30,'h');
X('fast-feet','الأقدام السريعة','Fast Feet','rope',{},'cardio','calves','quads','bw',1,'c',3,'t20',30,'h');
X('cross-jacks','القفز المتقاطع','Cross Jacks','jack',{},'cardio','delt_side calves','chest_lower','bw',1,'c',3,'t30',30,'h');
X('no-jump-burpee','البيربي بدون قفز','No-Jump Burpee','burpee',{},'burpee','quads chest_lower','abs','bw',1,'c',3,'8-10',60,'f');
X('speed-skater','المتزلّج السريع','Speed Skater','skater',{},'cardio','glutes','quads calves','bw',2,'c',3,'t30',45,'h');
X('invisible-rope','نطّ الحبل الوهمي','Invisible Jump Rope','rope',{},'cardio','calves','delt_side','bw',1,'c',3,'t40',30,'h');
X('boxing-combo','تركيبة الملاكمة','Boxing Combination','box',{},'cardio','delt_front obliques','triceps','bw',2,'c',3,'t60',30);
X('bear-crawl','زحف الدب','Bear Crawl','bearhold',{},'cardio','abs delt_front','quads','bw',2,'c',3,'t30',45,'f');
X('db-snatch','الخطف بالدمبل','Dumbbell Snatch','thruster',{},'thruster','glutes delt_front','hamstrings traps','db kb',3,'s',3,'6-8',90,'hf');
X('man-maker','صانع الرجال','Man Maker','burpee',{},'burpee','chest_lower quads','delt_front lats','db',3,'c',3,'5-8',90,'f');
X('wall-ball','رمي الكرة على الحائط','Wall Ball','thruster',{},'thruster','quads delt_front','glutes','mc',2,'c',3,'12-15',60,'hf');
// MOBILITY
X('worlds-greatest','أعظم إطالة في العالم','World\'s Greatest Stretch','rotstretch',{},'mob','hip_flexors obliques','hamstrings','bw',1,'m',1,'t40',10);
X('hip-circles','دوائر الورك','Hip Circles','hipcircle',{},'mob','glutes obliques','hip_flexors','bw',1,'m',1,'t30',10);
X('thoracic-rotation','تدوير الصدر في وضع الركوع','Quadruped Thoracic Rotation','quad',{cat:1},'mob','upper_back obliques','','bw',1,'m',1,'t40',10);
X('wall-slides','الانزلاق على الحائط','Wall Slides','passthru',{},'mob','delt_front traps','upper_back','bw',1,'m',1,'t30',10);
X('scap-pushup','ضغط لوح الكتف','Scapular Push-Up','pushup',{},'mob','chest_lower','delt_front','bw',1,'m',2,'10-12',30);
X('shoulder-rolls','دحرجة الكتفين','Shoulder Rolls','shrug',{},'mob','traps','','bw',1,'m',1,'t30',10);
X('knee-hugs','ضم الركبة واقفًا','Walking Knee Hugs','knees',{march:1},'mob','glutes hip_flexors','','bw',1,'m',1,'t30',10);
X('inch-to-rotation','الدودة مع الدوران','Inchworm with Rotation','inchworm',{},'mob','hamstrings obliques','delt_front','bw',2,'m',1,'t45',10);
X('ankle-rocks','تأرجح الكاحل','Ankle Rocks','lunge',{hold:{kL:110,hfL:80}},'mob','calves','','bw',1,'m',1,'t30',10);
// STRETCH
X('side-stretch','إطالة الجانب واقفًا','Standing Side Stretch','stretch2',{s:'side'},'stretch','obliques lats','','bw',1,'x',1,'t30',5);
X('knees-to-chest','ضم الركبتين للصدر','Knees to Chest','stretch2',{s:'knees'},'stretch','lower_back glutes','','bw',1,'x',1,'t30',5);
X('lying-hamstring','إطالة الخلفية مستلقيًا','Lying Hamstring Stretch','stretch2',{s:'lyingham'},'stretch','hamstrings','calves','bw band',1,'x',1,'t30',5);
X('upward-dog','وضعية الكلب المتجه للأعلى','Upward Dog','stretch2',{s:'upward'},'stretch','abs hip_flexors','chest_lower','bw',1,'x',1,'t30',5);
X('wrist-stretch','إطالة الرسغ والساعد','Wrist Flexor Stretch','stretch2',{s:'wrist'},'stretch','forearms','','bw',1,'x',1,'t30',5);
X('frog-stretch','وضعية الضفدع','Frog Stretch','stretch2',{s:'frog'},'stretch','glutes','hip_flexors','bw',2,'x',1,'t40',5);
X('happy-baby','وضعية الطفل السعيد','Happy Baby','stretch2',{s:'happy'},'stretch','glutes lower_back','hamstrings','bw',1,'x',1,'t30',5);
X('lat-stretch','إطالة الظهرية العريضة','Lat Stretch','stretch2',{s:'lat'},'stretch','lats','delt_rear','bw',1,'x',1,'t30',5);
X('pigeon','وضعية الحمامة','Pigeon Pose','stretch2',{s:'pigeon'},'stretch','glutes hip_flexors','','bw',2,'x',1,'t40',5);
X('seated-twist','الالتفاف جالسًا','Seated Spinal Twist','stretch2',{s:'twist'},'stretch','obliques lower_back','glutes','bw',1,'x',1,'t30',5);
X('biceps-stretch','إطالة البايسبس على الحائط','Biceps Wall Stretch','stretch',{s:'chest'},'stretch','biceps','chest_lower delt_front','bw',1,'x',1,'t30',5);
X('neck-stretch','إطالة الرقبة والكتف العلوي','Upper Trap Stretch','stretch2',{s:'side'},'stretch','traps','','bw',1,'x',1,'t30',5);
EX.slice(_n0).forEach(e => { EXI[e.id] = e; });
PROGRAMS.push(
 {id:'p-hiit',name:'تمارين عالية الشدة (HIIT) — 20 دقيقة',tag:'متوسط · بلا أدوات',items:[['jumping-jack',3,'t40',20],['jump-squat',3,'10',30],['mountain-climber',3,'t30',20],['burpee',3,'8',40],['lateral-shuffle',3,'t30',20],['plank-jacks',3,'t30',30]]},
 {id:'p-glutes',name:'الأرداف والورك',tag:'كل المستويات · بيت',items:[['glute-bridge',3,'15',45],['frog-pump',3,'20',45],['curtsy-lunge',3,'10',60],['sumo-squat',3,'12',60],['fire-hydrant',2,'12',30],['monster-walk',2,'t30',30]]},
 {id:'p-arms',name:'الذراعان (بايسبس وترايسبس)',tag:'متوسط · نادي',items:[['ez-curl',3,'10',60],['rope-pushdown',3,'12',60],['incline-db-curl',3,'10',60],['cable-overhead-ext',3,'12',60],['hammer-curl',2,'12',45],['dip-machine',2,'12',60]]},
 {id:'p-core2',name:'الجذع المتقدم',tag:'متقدم · بلا أدوات',items:[['hollow-hold',3,'t25',45],['v-up',3,'10',45],['shoulder-taps',3,'20',45],['side-plank-dip',2,'12',45],['flutter-kicks',3,'t30',30],['ab-rollout',3,'8',60]]}
);
