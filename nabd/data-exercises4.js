// Batch 4: well-established exercises from recognised training systems (Pilates, yoga, kettlebell,
// suspension training, plyometrics, calisthenics, injury-prevention). Each is tagged with its system.
EQ.sus = 'حبال التعليق'; HOME_EQ.push('sus');
const SRC = {pilates:'بيلاتس', yoga:'يوغا', kb:'تدريب الكيتل بل', sus:'تدريب حبال التعليق', plyo:'تمارين البلايومترك', cali:'الكاليسثنكس', rehab:'الوقاية من الإصابات', strong:'تدريب القوة الوظيفية'};
const _n2 = EX.length, tag = (src, from) => EX.slice(from).forEach(e => { e.src = src; EXI[e.id] = e; });
let _m = EX.length;
// PILATES
X('pilates-roll-up','اللفّ للأعلى (بيلاتس)','Pilates Roll-Up','situp',{},'crunch','abs','hip_flexors','bw',2,'s',3,'6-10',45);
X('single-leg-stretch','مدّ الساق الواحدة (بيلاتس)','Single-Leg Stretch','flutter',{},'legraise','abs','hip_flexors','bw',1,'s',3,'10-12',45);
X('double-leg-stretch','مدّ الساقين معًا (بيلاتس)','Double-Leg Stretch','vup',{},'crunch','abs','hip_flexors','bw',2,'s',3,'8-10',45);
X('pilates-criss-cross','التقاطع (بيلاتس)','Pilates Criss-Cross','crunch',{bike:1},'crunch','obliques abs','','bw',2,'s',3,'10-12',45);
X('pilates-saw','المنشار (بيلاتس)','Pilates Saw','stretch2',{s:'twist'},'mob','obliques hamstrings','lower_back','bw',1,'m',2,'6-8',30);
X('spine-stretch-forward','إطالة العمود الفقري للأمام','Spine Stretch Forward','stretch',{s:'fold'},'stretch','lower_back hamstrings','','bw',1,'x',1,'t40',5);
X('pilates-swan','البجعة (بيلاتس)','Pilates Swan','prone',{cobra:1},'prone','lower_back','glutes upper_back','bw',1,'s',3,'6-8',45);
X('pilates-teaser','التيزر (بيلاتس)','Pilates Teaser','vup',{},'crunch','abs hip_flexors','','bw',3,'s',3,'5-8',60);
X('leg-circles','دوائر الساق (بيلاتس)','Pilates Leg Circles','legraise',{},'legraise','hip_flexors abs','','bw',1,'s',2,'8-10',30);
X('side-kick-series','الركلة الجانبية (بيلاتس)','Side Kick Series','clam',{},'mob','glutes','obliques','bw',1,'s',3,'10-12',30,'i');
X('shoulder-bridge','الجسر الكتفي (بيلاتس)','Pilates Shoulder Bridge','bridge',{single:1},'bridge','glutes hamstrings','abs','bw',2,'s',3,'6-8',45);
X('mermaid-stretch','إطالة حورية البحر','Mermaid Stretch','stretch2',{s:'side'},'stretch','obliques lats','','bw',1,'x',1,'t30',5);
X('open-leg-rocker','الهزاز بساقين مفتوحتين','Open Leg Rocker','vup',{},'crunch','abs','hamstrings','bw',3,'s',3,'6-8',45);
X('rolling-like-ball','التدحرج مثل الكرة','Rolling Like a Ball','twist',{},'crunch','abs','lower_back','bw',1,'m',2,'8-10',30);
X('pilates-swimming','السباحة (بيلاتس)','Pilates Swimming','prone',{},'prone','lower_back glutes','delt_rear','bw',1,'s',3,'t30',30);
// YOGA
X('warrior-one','وضعية المحارب الأولى','Warrior I','lunge',{hold:{sf:170,sa:10}},'stretch','quads hip_flexors','glutes delt_front','bw',1,'m',1,'t40',10);
X('warrior-two','وضعية المحارب الثانية','Warrior II','lunge',{side:1},'stretch','quads glutes','delt_side','bw',1,'m',1,'t40',10);
X('warrior-three','وضعية المحارب الثالثة','Warrior III','hinge',{single:1},'stretch','glutes hamstrings','lower_back abs','bw',2,'m',1,'t30',10);
X('triangle-pose','وضعية المثلث','Triangle Pose','stretch2',{s:'side'},'stretch','obliques hamstrings','','bw',1,'x',1,'t40',5);
X('chair-pose','وضعية الكرسي','Chair Pose','squat',{hold:1,depth:.7},'stretch','quads glutes','delt_front','bw',1,'m',1,'t30',10);
X('tree-pose','وضعية الشجرة','Tree Pose','sideleg',{},'stretch','glutes','calves abs','bw',1,'m',1,'t30',10);
X('crow-pose','وضعية الغراب','Crow Pose','bearhold',{},'plank','abs delt_front','triceps forearms','bw',3,'s',3,'t15',60);
X('boat-pose','وضعية القارب','Boat Pose','twist',{},'crunch','abs hip_flexors','','bw',2,'s',3,'t25',45);
X('camel-pose','وضعية الجمل','Camel Pose','nordic',{},'stretch','hip_flexors abs','quads','bw',2,'x',1,'t30',5);
X('extended-side-angle','الزاوية الجانبية الممتدة','Extended Side Angle','lunge',{side:1},'stretch','obliques quads','glutes','bw',1,'x',1,'t40',5);
X('puppy-pose','وضعية الجرو','Puppy Pose','stretch2',{s:'lat'},'stretch','lats delt_front','upper_back','bw',1,'x',1,'t40',5);
X('sphinx-pose','وضعية أبو الهول','Sphinx Pose','prone',{cobra:1},'stretch','abs lower_back','','bw',1,'x',1,'t40',5);
X('reclined-thunderbolt','وضعية الصاعقة مستلقيًا','Reclined Thunderbolt','stretch',{s:'child'},'stretch','quads hip_flexors','','bw',2,'x',1,'t45',5);
X('garland-pose','وضعية الإكليل','Garland Pose (Malasana)','squat',{hold:1,depth:1.15},'stretch','glutes calves','hip_flexors','bw',1,'x',1,'t40',5);
X('sun-salutation','تحية الشمس','Sun Salutation','inchworm',{},'mob','hamstrings delt_front','abs lower_back','bw',1,'m',2,'t60',15,'f');
// KETTLEBELL
X('turkish-getup','النهوض التركي','Turkish Get-Up','burpee',{},'burpee','delt_front abs','glutes obliques triceps','kb',3,'s',3,'2-3',90,'f');
X('kb-clean','الكلين بالكيتل بل','Kettlebell Clean','hinge',{swing:1},'swing','glutes hamstrings','forearms traps','kb',2,'s',3,'6-8',75);
X('kb-snatch','الخطف بالكيتل بل','Kettlebell Snatch','thruster',{},'thruster','glutes delt_front','hamstrings traps','kb',3,'s',3,'6-8',90,'h');
X('kb-windmill','طاحونة الهواء بالكيتل بل','Kettlebell Windmill','stretch2',{s:'side'},'twist','obliques','delt_side hamstrings','kb',3,'s',3,'5-6',60);
X('kb-figure-eight','رقم 8 بالكيتل بل','Kettlebell Figure-8','hinge',{},'hinge','obliques glutes','forearms','kb',2,'s',3,'t30',45);
X('kb-around-world','حول العالم بالكيتل بل','Kettlebell Around the World','carry',{},'twist','obliques abs','forearms','kb',1,'s',3,'8-10',30);
X('kb-thruster','الثراستر بالكيتل بل','Kettlebell Thruster','thruster',{},'thruster','quads delt_front','glutes triceps','kb',2,'s',3,'8-10',75,'f');
X('kb-high-pull','السحب العالي بالكيتل بل','Kettlebell High Pull','raise',{upright:1},'swing','traps delt_side','glutes hamstrings','kb',2,'s',3,'8-10',60);
X('kb-front-squat','القرفصاء الأمامي بالكيتل بل','Kettlebell Front Squat','squat',{arms:'front'},'squat','quads glutes','abs','kb',2,'s',3,'8-10',75);
X('kb-overhead-carry','الحمل فوق الرأس بالكيتل بل','Kettlebell Overhead Carry','carry',{},'carry','delt_front abs','traps obliques','kb',2,'s',3,'t30',60);
X('kb-goblet-lunge','الطعن مع حمل الكيتل بل','Kettlebell Goblet Reverse Lunge','lunge',{},'lunge','quads glutes','abs','kb',1,'s',3,'8-10',60);
// SUSPENSION
X('sus-row','التجديف بحبال التعليق','Suspension Row','row',{inverted:1},'row','upper_back lats','biceps abs','sus',1,'s',3,'10-12',60);
X('sus-chest-press','ضغط الصدر بحبال التعليق','Suspension Chest Press','pushup',{tilt:45,inc:1},'pushup','chest_lower','triceps abs','sus',2,'s',3,'8-12',60);
X('sus-pike','البايك بحبال التعليق','Suspension Pike','pike',{},'plank','abs delt_front','hip_flexors','sus',3,'s',3,'8-10',60);
X('sus-hamstring-curl','ثني الساق بحبال التعليق','Suspension Hamstring Curl','bridge',{},'bridge','hamstrings glutes','','sus',2,'s',3,'8-12',60);
X('sus-squat','القرفصاء بحبال التعليق','Suspension Squat','squat',{},'squat','quads glutes','','sus',1,'s',3,'12-15',45);
X('sus-y-fly','رفع Y بحبال التعليق','Suspension Y-Fly','raise',{front:1},'raise','delt_rear upper_back','traps','sus',2,'s',3,'10-12',45);
X('sus-atomic-pushup','الضغط الذري بحبال التعليق','Suspension Atomic Push-Up','climber',{},'pushup','chest_lower abs','hip_flexors triceps','sus',3,'s',3,'6-10',75);
X('sus-pistol','قرفصاء المسدس بحبال التعليق','Suspension-Assisted Pistol Squat','squat',{depth:1.1},'squat','quads glutes','','sus',2,'s',3,'5-8',60);
// PLYOMETRICS
X('depth-jump','قفزة العمق','Depth Jump','squat',{jump:1},'squat','quads glutes calves','hamstrings','bench',3,'c',3,'4-6',120,'h');
X('lateral-bound','الوثب الجانبي','Lateral Bound','skater',{},'cardio','glutes quads','calves','bw',2,'c',3,'6-8',75,'h');
X('power-skip','القفز المرتفع بالتبادل','Power Skip','knees',{},'cardio','calves hip_flexors','glutes','bw',2,'c',3,'t20',45,'h');
X('a-skip','تمرين A-Skip','A-Skip Drill','knees',{},'cardio','hip_flexors calves','','bw',1,'c',3,'t20',30);
X('bounding','الوثب المتتالي','Bounding','jumplunge',{},'cardio','glutes quads','calves hamstrings','bw',3,'c',3,'t20',75,'h');
X('mb-chest-pass','تمرير الكرة الطبية من الصدر','Medicine Ball Chest Pass','fly',{apart:0,stand:1},'press','chest_lower triceps','delt_front','mc',2,'c',3,'8-10',60,'h');
X('mb-rotational-throw','رمي الكرة الطبية الدوراني','Medicine Ball Rotational Throw','twist',{chop:1},'twist','obliques','glutes delt_front','mc',2,'c',3,'6-8',60,'h');
X('mb-overhead-throw','رمي الكرة الطبية فوق الرأس','Medicine Ball Overhead Throw','thruster',{},'thruster','lats abs','delt_front','mc',2,'c',3,'6-8',60,'h');
X('split-squat-jump','قفزة الطعن الثابتة','Split Squat Jump','jumplunge',{},'lunge','quads glutes','calves','bw',3,'c',3,'6-8',75,'h');
// CALISTHENICS
X('muscle-up','المسل أب','Muscle-Up','pull',{},'pull','lats triceps','chest_lower biceps abs','bar',3,'s',3,'2-5',150);
X('archer-pullup','عقلة الرامي','Archer Pull-Up','pull',{},'pull','lats biceps','upper_back','bar',3,'s',3,'3-6',120);
X('typewriter-pullup','عقلة الآلة الكاتبة','Typewriter Pull-Up','pull',{},'pull','lats','biceps upper_back','bar',3,'s',3,'3-5',120);
X('handstand-pushup','ضغط الوقوف على اليدين','Handstand Push-Up','pike',{},'press','delt_front delt_side triceps','traps abs','bw',3,'s',3,'3-6',120);
X('tuck-front-lever','الرافعة الأمامية المضمومة','Tuck Front Lever','pull',{knee:1},'hang','lats abs','delt_rear','bar',3,'s',3,'t10',90);
X('planche-lean','ميلان البلانش','Planche Lean','pushup',{},'plank','delt_front chest_lower','abs','bw',3,'s',3,'t15',75);
X('skin-the-cat','سلخ القطة','Skin the Cat','pull',{knee:1},'hang','lats delt_front','abs','bar',3,'m',3,'3-5',90);
// INJURY PREVENTION / REHAB
X('tke','فرد الركبة الطرفي بالمطاط','Terminal Knee Extension','squat',{depth:.3},'squat','quads','','band',1,'s',3,'15-20',30,'i');
X('straight-leg-raise','رفع الساق مستقيمة','Straight Leg Raise','legraise',{},'legraise','quads hip_flexors','','bw',1,'s',3,'10-15',30,'i');
X('chin-tucks','سحب الذقن للخلف','Chin Tucks','shrug',{},'mob','traps','','bw',1,'m',2,'10-12',20);
X('eccentric-heel-drop','إنزال الكعب البطيء','Eccentric Heel Drop','calf',{},'calf','calves','','bw',1,'s',3,'12-15',45,'i');
X('pelvic-tilts','إمالة الحوض','Pelvic Tilts','bridge',{},'mob','abs lower_back','glutes','bw',1,'m',2,'10-15',20);
X('quadruped-rock-back','التأرجح للخلف في وضع الركوع','Quadruped Rock Back','quad',{cat:1},'mob','glutes lower_back','','bw',1,'m',1,'t40',10);
X('isometric-wall-push','الدفع الثابت على الحائط','Isometric Wall Press','pushup',{tilt:20,inc:1},'pushup','chest_lower delt_front','triceps','bw',1,'s',3,'t20',30);
X('band-ankle-mobility','تحريك الكاحل بالمطاط','Banded Ankle Mobilization','lunge',{hold:{kL:110,hfL:80}},'mob','calves','','band',1,'m',1,'t40',10);
// FUNCTIONAL STRENGTH / GYM
X('sled-push','دفع الزلّاجة','Sled Push','lunge',{},'cardio','quads glutes','calves delt_front','mc',2,'c',3,'t20',90,'f');
X('sled-drag','سحب الزلّاجة للخلف','Backward Sled Drag','lunge',{},'cardio','quads','calves','mc',2,'c',3,'t20',90);
X('sandbag-carry','حمل كيس الرمل','Sandbag Bear-Hug Carry','carry',{},'carry','abs upper_back','glutes biceps','mc',2,'s',3,'t30',60,'f');
X('sandbag-shoulder','رفع كيس الرمل على الكتف','Sandbag to Shoulder','hinge',{dl:1},'deadlift','glutes lower_back','biceps traps','mc',3,'s',3,'4-6',90,'f');
X('landmine-row','تجديف اللاندماين','Landmine Row','row',{},'row','lats upper_back','biceps','bb',2,'s',3,'8-10',75);
X('zercher-squat','قرفصاء زيرشر','Zercher Squat','squat',{arms:'goblet'},'squat','quads glutes','biceps abs upper_back','bb',3,'s',3,'5-8',120);
// tag each block with its training system
const blocks = [['pilates',15],['yoga',15],['kb',11],['sus',8],['plyo',9],['cali',7],['rehab',8],['strong',6]];
blocks.forEach(([src, cnt]) => { EX.slice(_m, _m + cnt).forEach(e => { e.src = src; }); _m += cnt; });
EX.slice(_n2).forEach(e => { EXI[e.id] = e; });
