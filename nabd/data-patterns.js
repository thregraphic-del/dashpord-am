// Movement patterns: keyframe poses in degrees for a procedural rig.
// keys: rx/ry/rz root rotation, sp spine flex(+fwd), st twist, ss side bend, nk neck,
// sf shoulder flex(+fwd), sa abduction, e elbow flex, w wrist, hf hip flex, ha hip abd, k knee flex, a ankle,
// shr shoulder elevation (m), jy lift (m), flat feet-flat flag. Suffix L/R targets one side.
const Q = {rx:90, sf:90, hf:90, k:90, flat:false, a:0};
const SEAT = {hf:90, k:90, flat:true};
const SEAT_ANCHOR = {m:['butt'], y:.5};
const box = (m, f=0, w=.38, d=.5) => ({kind:'box', m, f, w, d});
const P = {
 squat: o => {
  const A = {fwd:[{sf:10},{sf:85}], goblet:[{sf:22,e:140,sa:0},{sf:28,e:140,sa:0}], back:[{sa:72,e:118},{sa:72,e:118}], front:[{sf:90,e:150,sa:5},{sf:90,e:150,sa:5}], hips:[{sa:20,e:90},{sa:20,e:90}]}[o.arms||'fwd'];
  const d = o.depth||1, bot = {hf:100*d, k:115*d, sp:38*d, ...A[1]};
  const f = o.hold ? [bot, {...bot, hf:bot.hf+4}] : [{...A[0]}, bot];
  if (o.jump) f.push({jy:.28, sf:150, flat:false, a:28});
  return {f, dur:o.jump?2.4:3, view:'side', hold:o.hold, track:'butt', fault:{t:'انهيار الركبتين للداخل وتقوّس الظهر', m:{haL:-12, haR:-12, sp:65, nk:-10}}};
 },
 lunge: o => {
  const L = {hfL:85, kL:95, hfR:-12, kR:85, aR:-37, sp:5, sf:10};
  const R = {hfR:85, kR:95, hfL:-12, kL:85, aL:-37, sp:5, sf:10};
  if (o.side) return {f:[{}, {haL:28, hfL:72, kL:92, haR:22, sp:25, sf:70}], dur:3, view:'front', track:'butt', fault:{t:'ركبة الساق المثنية تدخل للداخل', m:{haL:5}}};
  if (o.split) return {f:[{hfL:20, kL:20, hfR:-25, kR:85, aR:-30}, {hfL:85, kL:100, hfR:-10, kR:105, aR:-30, sp:12}], dur:3, view:'side', track:'butt', sup:[box(['footR'],0,.4,.4)], fault:{t:'ميلان الجذع للأمام بكثرة', m:{sp:45}}};
  if (o.hold) return {f:[{...L, ...o.hold}, {...L, ...o.hold, sp:8}], dur:4, view:'side', hold:true, track:'butt'};
  return {f:[{}, L, {}, R], dur:5, view:'side', track:'butt', fault:{t:'دخول الركبة الأمامية للداخل وميلان الجذع', m:{haL:-12, haR:-12, sp:35}, i:[1,3]}};
 },
 hinge: o => {
  const arms = o.arms==='head' ? {sf:150, e:145, sa:40} : {};
  const top = {flat:true, ...arms}, bot = {rx:75, hf:85, k:10, flat:true, sf:arms.sf||75, ...arms};
  if (o.single) return {f:[{flat:true}, {rx:80, hfL:85, kL:12, hfR:-5, kR:0, flatL:true, flatR:false, sf:80}], dur:3.6, view:'side', track:'handL', fault:{t:'تقوّس الظهر ودوران الحوض', m:{sp:30, rx:55}}};
  if (o.dl) return {f:[top, {rx:55, hf:105, k:60, flat:true, sf:55}], dur:3.4, view:'side', track:'handL', fault:{t:'تقوّس الظهر أثناء الرفع', m:{sp:35, rx:35, sf:70, nk:20}}};
  if (o.swing) return {f:[{rx:60, hf:80, k:25, flat:true, sf:40}, {sf:85, flat:true}], dur:1.6, view:'side', track:'handL', fault:{t:'الرفع بالذراعين والقرفصاء بدل دفع الورك', m:{hf:60, k:70, sf:120}}};
  return {f:[top, bot], dur:3.4, view:'side', track:'handL', fault:{t:'تقوّس الظهر (انحناء العمود الفقري)', m:{sp:35, rx:50, nk:15, sf:85}}};
 },
 bridge: o => {
  if (o.thrust) return {f:[{rx:-50, hf:80, k:130, flat:true, sa:30}, {rx:-95, hf:0, k:95, flat:true, sa:30}], dur:3, view:'side', track:'butt', sup:[box(['backU'],1,.9,.35)], fault:{t:'تقوّس أسفل الظهر بدل فرد الورك', m:{sp:-20}}};
  const b = {rx:-90, hf:45, k:135, flat:true, sa:15}, t = {rx:-115, hf:0, k:110, flat:true, sa:15};
  if (o.single) { b.hfR = 85; b.kR = 30; b.flatR = false; t.hfR = 30; t.kR = 5; t.flatR = false; }
  return {f:[b, t], dur:3, view:'side', track:'butt', fault:{t:'دفع الحوض قليلًا مع تقوّس الظهر', m:{rx:-100, sp:-15}}};
 },
 calf: o => o.seat
  ? {f:[{...SEAT}, {...SEAT, flat:false, a:28}], dur:2.2, view:'side', anchor:SEAT_ANCHOR, sup:[box(['butt'])], track:'heelL'}
  : {f:[{flat:true, ...(o.single?{hfR:30,kR:60}:{})}, {flat:false, a:35, ...(o.single?{hfR:30,kR:60}:{})}], dur:2.2, view:'side', track:'heelL', fault:{t:'ارتداد سريع ومدى قصير', rom:.4}},
 pushup: o => {
  const t = o.tilt ?? 64, sa = o.wide ? 38 : o.dia ? -2 : 12, knee = o.knee ? {k:95, flat:false} : {};
  const top = {rx:t, sf:t, sa, e:0, flat:false, a:90-t, ...knee}, bot = {rx:t+12, sf:t+12-50, sa:sa+(o.dia?0:10), e:50, flat:false, a:90-t, ...knee};
  const sup = o.inc ? [box(['handL','handR'],0,.9,.4)] : o.dec ? [box(['footL','footR'],0,.5,.4)] : null;
  return {f:[top, bot], dur:2.6, view:'side', sup, track:'chest', fault:{t:'ترهّل الورك وانحناء أسفل الظهر', m:{sp:-18, rx:t+20}}};
 },
 pike: o => ({f:[{rx:135, hf:105, sf:170, e:0, flat:false, a:20}, {rx:142, hf:112, sf:135, e:80, flat:false, a:20}], dur:2.8, view:'side', track:'head', fault:{t:'فتح المرفقين بقوة للجانبين', m:{sa:60}}}),
 plank: o => {
  const p = {rx:78, sf:78, e:90, sa:5, flat:false, a:12};
  return {f:[p, {...p, rx:81, nk:2}], dur:4, view:'side', hold:true, track:'butt', fault:{t:'ترهّل الورك', m:{rx:92, sp:-15}}};
 },
 sideplank: o => {
  const p = {rz:72, saR:72, eR:90, saL:15, flat:false};
  return {f:[p, {...p, rz:74}], dur:4, view:'front', hold:true, track:'butt', fault:{t:'هبوط الورك نحو الأرض', m:{rz:60, ss:-14}}};
 },
 press: o => {
  const seat = o.seat ? {...SEAT} : {};
  const b = o.arnold ? {sf:60, e:140, sa:0} : {sf:90, e:90, sa:25};
  return {f:[{...seat, ...b}, {...seat, sf:172, e:5, sa:15}], dur:2.8, view:'side', anchor:o.seat?SEAT_ANCHOR:null, sup:o.seat?[box(['butt'])]:null, track:'handL', fault:{t:'تقوّس أسفل الظهر للخلف', m:{sp:-18}}};
 },
 thruster: o => ({f:[{hf:100, k:115, sp:38, sf:90, e:150, sa:5}, {sf:172, e:5, sa:15}], dur:2.8, view:'side', track:'handL', fault:{t:'قرفصاء نصفية وتقوّس الظهر في الأعلى', m:{sp:-15}}}),
 bench: o => {
  const rx = o.inc ? -60 : -90, top = rx === -90 ? 90 : 120, legs = o.floor ? {hf:45, k:135, flat:true} : {hf:10, k:85, flat:true};
  const sa = o.close ? 5 : 10, saB = o.close ? 18 : 55;
  const f = o.skull ? [{rx, ...legs, sf:100, e:0, sa:5}, {rx, ...legs, sf:100, e:115, sa:5}]
                    : [{rx, ...legs, sf:top, e:0, sa}, {rx, ...legs, sf:o.floor?0:top-75, sa:saB, e:95}];
  const anchor = o.floor ? null : {m:['backU','backL'], y:.47};
  return {f, dur:2.8, view:'side', anchor, sup:o.floor?null:[box(['backU','backL','glute'],0,.34,.9)], track:'handL', fault:{t:'فتح المرفقين 90° وتقوّس الظهر', m:{sa:85, sp:-15}}};
 },
 fly: o => {
  if (o.stand) return {f:[{sp:15, sa:80, e:15, sf:15}, {sp:15, sa:-12, sf:35, e:15}], dur:3, view:'front', track:'handL', fault:{t:'ثني المرفقين وتحويلها إلى ضغط', m:{e:80}}};
  if (o.seat) return {f:[{...SEAT, sf:90, sa:80, e:90}, {...SEAT, sf:90, sa:0, e:90}], dur:3, view:'front', anchor:SEAT_ANCHOR, sup:[box(['butt'])], track:'handL'};
  if (o.rear) return {f:[{rx:70, hf:80, k:10, flat:true, sf:70, e:15}, {rx:70, hf:80, k:10, flat:true, sf:70, sa:80, e:15}], dur:2.8, view:'front', track:'handL', fault:{t:'هزّ الكتفين وأرجحة الجذع', m:{shr:.04, rx:50}}};
  if (o.apart) return {f:[{sf:90, sa:0, e:0}, {sf:90, sa:85, e:0}], dur:2.4, view:'front', track:'handL'};
  if (o.face) return {f:[{sf:90, sa:0, e:0}, {sf:90, sa:70, e:110}], dur:2.6, view:'side', track:'handL'};
  return {f:[{rx:-90, hf:10, k:85, flat:true, sf:90, sa:5, e:15}, {rx:-90, hf:10, k:85, flat:true, sf:90, sa:80, e:20}], dur:3.2, view:'front', anchor:{m:['backU','backL'], y:.47}, sup:[box(['backU','backL','glute'],0,.34,.9)], track:'handL', fault:{t:'فرد المرفقين والنزول بعمق مبالغ', m:{e:0, sa:100}}};
 },
 row: o => {
  if (o.seated) return {f:[{hf:90, k:20, flat:false, sp:20, sf:85, e:0}, {hf:90, k:20, flat:false, sp:-5, sf:-25, e:100}], dur:2.8, view:'side', track:'handL', fault:{t:'أرجحة الجذع للخلف', m:{sp:-30}}};
  if (o.inverted) return {f:[{rx:-70, sf:110, e:0, sa:20, flat:false}, {rx:-70, sf:30, e:110, sa:30, flat:false}], dur:2.8, view:'side', anchor:{m:['handL','handR'], y:1.0}, sup:[{kind:'bar', m:['handL','handR'], f:0}], track:'chest'};
  const base = {rx:50, hf:65, k:15, flat:true};
  if (o.single) return {f:[{...base, sfL:50, sfR:50}, {...base, sfL:50, sfR:-20, eR:90}], dur:2.8, view:'side', sup:[box(['handL'],0,.4,.6)], track:'handR', fault:{t:'تدوير الجذع والسحب بالكتف', m:{st:-25, shrR:.04}}};
  return {f:[{...base, sf:50, sa:12}, {...base, sf:-20, e:90, sa:15}], dur:2.8, view:'side', track:'handL', fault:{t:'تقوّس الظهر ورفع الجذع أثناء السحب', m:{sp:30, rx:25}}};
 },
 pull: o => {
  const sa = o.chin ? 2 : 15;
  if (o.seat) return {f:[{...SEAT, sf:175, sa, e:0}, {...SEAT, sf:40, e:125, sa, sp:-8}], dur:2.8, view:'side', anchor:SEAT_ANCHOR, sup:[box(['butt'])], props:['handbar'], track:'handL', fault:{t:'الميلان للخلف بشدة وسحب البار خلف الرقبة', m:{sp:-35}}};
  if (o.straight) return {f:[{rx:15, hf:15, k:10, flat:true, sf:110, e:10}, {rx:15, hf:15, k:10, flat:true, sf:10, e:10}], dur:2.8, view:'side', props:['handbar'], track:'handL'};
  const hangA = {m:['handL','handR'], y:2.15}, bar = [{kind:'bar', m:['handL','handR'], f:0}];
  if (o.dead) return {f:[{sf:175, sa:15, e:0, hf:5, k:10, flat:false}, {sf:176, sa:15, e:0, hf:7, k:12, flat:false}], dur:4, hold:true, view:'front', anchor:hangA, sup:bar, track:'pelvisF'};
  if (o.knee) return {f:[{sf:175, sa:15, e:0, flat:false}, {sf:175, sa:15, e:0, hf:95, k:95, flat:false, sp:10}], dur:2.8, view:'side', anchor:hangA, sup:bar, track:'kneeL', fault:{t:'التأرجح بالجسم', m:{sp:-15}}};
  return {f:[{sf:175, sa, e:0, hf:10, k:30, flat:false}, {sf:40, e:125, sa, hf:10, k:30, flat:false}], dur:3, view:'front', anchor:hangA, sup:bar, track:'head', fault:{t:'نصف مدى حركة مع أرجحة الساقين', rom:.5, m:{hf:40}}};
 },
 curl: o => {
  if (o.conc) return {f:[{...SEAT, sp:40, sfR:40, eR:5}, {...SEAT, sp:40, sfR:40, eR:130}], dur:2.8, view:'side', anchor:SEAT_ANCHOR, sup:[box(['butt'])], track:'handR'};
  if (o.preacher) return {f:[{...SEAT, sf:45, e:10, sa:5}, {...SEAT, sf:45, e:130, sa:5}], dur:2.8, view:'side', anchor:SEAT_ANCHOR, sup:[box(['butt'])], track:'handL'};
  if (o.alt) return {f:[{e:5}, {eL:140, eR:5}, {e:5}, {eR:140, eL:5}], dur:4.4, view:'front', track:'handL'};
  return {f:[{sf:0, e:5}, {sf:8, e:140}], dur:2.6, view:'side', track:'handL', fault:{t:'أرجحة الجسم لرفع الوزن', m:{sp:-18, sf:35}}};
 },
 wrist: o => ({f:[{...SEAT, sp:25, sf:30, e:70, w:o.rev?40:-40}, {...SEAT, sp:25, sf:30, e:70, w:o.rev?-35:45}], dur:2, view:'side', anchor:SEAT_ANCHOR, sup:[box(['butt'])], track:'handL'}),
 tri: o => {
  if (o.over) return {f:[{sf:170, e:140, sa:10}, {sf:170, e:10, sa:10}], dur:2.8, view:'side', track:'handL', fault:{t:'فتح المرفقين للخارج', m:{sa:45}}};
  if (o.kick) { const b = {rx:55, hf:70, k:15, flat:true, sf:-35}; return {f:[{...b, e:90}, {...b, e:0}], dur:2.4, view:'side', track:'handL', fault:{t:'تأرجح العضد', m:{sf:10}}}; }
  return {f:[{sf:5, e:95, sp:10}, {sf:5, e:5, sp:10}], dur:2.4, view:'side', track:'handL', fault:{t:'تحرّك المرفقين للأمام', m:{sf:40}}};
 },
 dip: o => {
  if (o.bench) return {f:[{sf:-30, e:0, hf:80, k:10, flat:false}, {sf:-70, e:75, hf:85, k:10, flat:false}], dur:2.8, view:'side', anchor:{m:['handL','handR'], y:.45}, sup:[box(['handL','handR'],0,.9,.35)], track:'butt'};
  return {f:[{sf:-5, e:0, sa:10, hf:20, k:60, flat:false, sp:o.chest?20:5}, {sf:-58, e:60, sa:12, hf:20, k:60, flat:false, sp:o.chest?28:8}], dur:2.8, view:'side', anchor:{m:['handL','handR'], y:1.3}, sup:[{kind:'bars', m:['handL','handR'], f:0}], track:'chest', fault:{t:'النزول العميق جدًا مع رفع الكتفين', m:{sf:-80, shr:.04}}};
 },
 raise: o => {
  if (o.front) return {f:[{sf:5, e:10}, {sf:90, e:10}], dur:2.6, view:'side', track:'handL', fault:{t:'أرجحة الجسم', m:{sp:-15}}};
  if (o.upright) return {f:[{sf:5, e:5, sa:5}, {sa:75, e:110, sf:20}], dur:2.6, view:'front', track:'handL'};
  return {f:[{sa:10, e:15}, {sa:85, e:15}], dur:2.6, view:'front', track:'handL', fault:{t:'هزّ الكتفين ورفع الذراعين فوق الكتف', m:{shr:.04, sa:115, sp:-8}}};
 },
 shrug: o => ({f:[{}, {shr:.045}], dur:2, view:'front', track:'head', fault:{t:'تدوير الكتفين', m:{shr:.03, sf:20}}}),
 crunch: o => {
  const b = {rx:-90, hf:45, k:135, flat:true, sf:150, e:140, sa:30};
  if (o.bike) return {f:[{...b, sp:28, st:25, hfL:90, kL:90, hfR:20, kR:5, flat:false}, {...b, sp:28, st:-25, hfR:90, kR:90, hfL:20, kL:5, flat:false}], dur:2.4, view:'side', track:'kneeL'};
  if (o.rev) return {f:[{rx:-90, hf:90, k:90, flat:false, sa:20}, {rx:-112, hf:118, k:90, flat:false, sa:20}], dur:2.6, view:'side', track:'kneeL'};
  return {f:[b, {...b, sp:35, nk:15}], dur:2.4, view:'side', track:'head', fault:{t:'سحب الرقبة باليدين', m:{nk:45, sp:20}}};
 },
 legraise: o => {
  if (o.hollow) { const p = {rx:-90, sp:20, hf:25, sf:170, flat:false}; return {f:[p, {...p, sp:22}], dur:4, hold:true, view:'side', track:'head'}; }
  if (o.deadbug) { const b = {rx:-90, sf:90, hf:90, k:90, flat:false}; return {f:[b, {...b, sfL:180, hfR:15, kR:0}, b, {...b, sfR:180, hfL:15, kL:0}], dur:5, view:'side', track:'handL'}; }
  return {f:[{rx:-90, hf:5, flat:false, sa:20}, {rx:-90, hf:85, flat:false, sa:20}], dur:3, view:'side', track:'footL', fault:{t:'تقوّس أسفل الظهر', m:{sp:-14}}};
 },
 twist: o => {
  if (o.chop) return {f:[{st:-35, sf:150, sa:0, e:5, hf:15, k:20}, {st:40, sf:30, sa:0, e:5, hf:25, k:35}], dur:2.6, view:'front', track:'handL'};
  const b = {rx:-35, hf:90, k:90, flat:false, sf:60, e:30, sa:0};
  return {f:[{...b, st:-35}, {...b, st:35}], dur:2.4, view:'front', track:'handL', fault:{t:'تقوّس الظهر وتحريك اليدين فقط', m:{sp:25}}};
 },
 quad: o => {
  if (o.cat) return {f:[{...Q, sp:12, nk:15}, {...Q, sp:-14, nk:-20}], dur:4, view:'side', track:'backU'};
  if (o.donkey) return {f:[Q, {...Q, hfR:-15}], dur:2.4, view:'side', track:'footR'};
  if (o.hydrant) return {f:[Q, {...Q, haR:45}], dur:2.4, view:'front', track:'kneeR'};
  return {f:[Q, {...Q, sfL:180, hfR:0, kR:0}, Q, {...Q, sfR:180, hfL:0, kL:0}], dur:6, view:'side', track:'handL', fault:{t:'تقوّس الظهر ودوران الحوض', m:{sp:-18}, i:[1,3]}};
 },
 prone: o => {
  if (o.backext) return {f:[{rx:90, sp:60, sf:30, e:120}, {rx:90, sp:0, sf:30, e:120}], dur:3, view:'side', anchor:{m:['pelvisF'], y:.95}, sup:[box(['pelvisF'],0,.4,.4)], track:'head', fault:{t:'فرد الظهر للخلف بمبالغة', m:{sp:-25}}};
  if (o.curl) return {f:[{rx:90, flat:false, sf:150, e:90}, {rx:90, flat:false, k:110, sf:150, e:90}], dur:2.6, view:'side', track:'heelL'};
  if (o.cobra) return {f:[{rx:90, sf:140, e:135, flat:false}, {rx:90, sp:-40, sf:50, e:15, flat:false}], dur:4, hold:true, view:'side', track:'head'};
  return {f:[{rx:90, sf:170, flat:false}, {rx:90, sp:-15, nk:-5, sf:185, hf:-15, flat:false}], dur:3, view:'side', track:'head', fault:{t:'رفع الرأس للخلف بقوة', m:{nk:-40}}};
 },
 clam: o => ({f:[{rz:90, hf:45, k:90, sfR:150, eR:120, flat:false}, {rz:90, hf:45, k:90, haL:40, sfR:150, eR:120, flat:false}], dur:2.4, view:'front', track:'kneeL'}),
 kickback: o => ({f:[{sp:15, sf:40}, {sp:15, sf:40, hfR:-35, kR:5}], dur:2.4, view:'side', track:'heelR'}),
 bandwalk: o => { const q = {hf:35, k:40, sp:20, sf:30}; return {f:[q, {...q, haL:18, haR:18}], dur:1.6, view:'front', track:'footL'}; },
 abduct: o => ({f:[{...SEAT}, {...SEAT, ha:35}], dur:2.4, view:'front', anchor:SEAT_ANCHOR, sup:[box(['butt'])], track:'kneeL'}),
 legpress: o => ({f:[{rx:-50, hf:110, k:105, flat:false}, {rx:-50, hf:40, k:5, flat:false}], dur:2.8, view:'side', sup:[box(['backL','glute'],0,.4,.6)], track:'footL', fault:{t:'نزول الركبتين أعمق من اللازم مع رفع الحوض', m:{hf:135, k:130, sp:20}}}),
 legext: o => ({f:[{...SEAT, flat:false}, {...SEAT, flat:false, k:5}], dur:2.4, view:'side', anchor:SEAT_ANCHOR, sup:[box(['butt'])], track:'footL'}),
 nordic: o => ({f:[{k:90, flat:false, a:0, sf:30, e:90}, {rx:62, k:28, flat:false, a:0, sf:60, e:60}], dur:4, view:'side', track:'head', fault:{t:'ثني الورك بدل إبقاء الجسم مستقيمًا', m:{hf:50, k:50}}}),
 step: o => ({f:[{hfL:70, kL:70, flatL:true, sf:10}, {hfR:20, kR:40, flatR:false, sf:10}], dur:3, view:'side', anchor:{m:['heelL','footL'], y:.32}, sup:[box(['heelL','footL'],0,.45,.4)], track:'butt'}),
 burpee: o => ({f:[{}, {hf:110, k:120, sp:60, sf:120, flat:true}, {rx:64, sf:64, e:0, flat:false, a:26}, {hf:110, k:120, sp:60, sf:120, flat:true}, {jy:.3, sf:170, a:25, flat:false}], dur:3.6, view:'side', track:'head'}),
 jack: o => o.low ? {f:[{sa:10}, {sa:165, haL:25}, {sa:10}, {sa:165, haR:25}], dur:2.4, view:'front', track:'handL'} : {f:[{sa:10}, {jy:.08, sa:90, ha:12}, {sa:165, ha:22}, {jy:.08, sa:90, ha:12}], dur:1.4, view:'front', track:'handL'},
 knees: o => { const h = o.march ? 60 : 85, jy = o.march ? 0 : .04, d = o.march ? 1.4 : .7; return {f:[{hfL:h, kL:90, sfR:40, eR:90, sfL:-20, eL:90, jy}, {hfR:h, kR:90, sfL:40, eL:90, sfR:-20, eR:90, jy}], dur:d, view:'side', track:'kneeL'}; },
 climber: o => { const t = {rx:64, sf:64, e:0, flat:false, a:26}; return {f:[{...t, hfL:90, kL:100}, {...t, hfR:90, kR:100}], dur:1, view:'side', track:'kneeL'}; },
 rope: o => ({f:[{sa:30, e:60, sf:10}, {jy:.08, a:25, flat:false, sa:30, e:60, sf:10}], dur:.5, view:'side', track:'footL'}),
 skater: o => ({f:[{hfL:60, kL:70, hfR:-20, kR:40, sp:30, st:20, sfR:60, sfL:-20, jy:.04}, {hfR:60, kR:70, hfL:-20, kL:40, sp:30, st:-20, sfL:60, sfR:-20, jy:.04}], dur:1.6, view:'front', track:'butt'}),
 box: o => ({f:[{e:120, sf:40, st:0}, {sfL:90, eL:0, eR:120, sfR:40, st:-15}, {e:120, sf:40}, {sfR:90, eR:0, eL:120, sfL:40, st:15}], dur:1.4, view:'front', track:'handL'}),
 carry: o => ({f:[{hfL:30, kL:40}, {}, {hfR:30, kR:40}, {}], dur:1.6, view:'side', track:'handL', fault:{t:'الميلان للجانب', m:{ss:12}}}),
 inchworm: o => ({f:[{}, {rx:80, hf:85, k:5, sf:80, flat:true}, {rx:64, sf:64, e:0, flat:false, a:26}, {rx:80, hf:85, k:5, sf:80, flat:true}], dur:5, view:'side', track:'handL'}),
 circles: o => ({f:[{sa:80}, {sa:90, sf:15}, {sa:100}, {sa:90, sf:-15}], dur:1.2, view:'front', track:'handL'}),
 swings: o => ({f:[{hfR:-25, saL:80}, {hfR:60, saL:80}], dur:1.6, view:'side', track:'footR'}),
 rotate: o => ({f:[{st:-50, sa:80, e:10}, {st:50, sa:80, e:10}], dur:2.4, view:'front', track:'handL'}),
 passthru: o => ({f:[{sf:10, sa:30}, {sf:190, sa:30}], dur:3, view:'side', track:'handL'}),
 stretch: o => {
  const p = {
   ham:{rx:70, hf:70, sf:70, flat:true}, quad:{kR:150, sfR:-35, eR:40, saL:70}, chest:{sa:85, sf:-25, e:10},
   cross:{sfR:90, saR:-55, sfL:70, eL:100}, tri:{sfR:170, eR:150, sfL:160, eL:120},
   hipflex:{hfL:90, kL:90, hfR:-25, kR:90, flatR:false, aR:0, sf:10, sa:20},
   fold:{hf:90, k:0, flat:false, sp:55, sf:90}, fly:{hf:70, ha:60, k:130, flat:false, sf:30, e:40},
   calf:{hfL:30, kL:40, hfR:-25, kR:0, sp:10, sf:80, flatR:true},
   child:{rx:60, sp:40, hf:90, k:120, sf:180, flat:false, a:60}
  }[o.s];
  return {f:[p, {...p, sp:(p.sp||0)+4}], dur:4, hold:true, view:o.s==='chest'||o.s==='cross'||o.s==='tri'?'front':'side', track:'head'};
 }
};
