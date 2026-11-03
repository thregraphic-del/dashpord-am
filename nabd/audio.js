// Audio: in-browser generated workout music (no licensed tracks needed), beeps, Arabic voice coaching
const Sound = {
  ctx:null, master:null, music:null, playing:false, idx:0, vol:.55, timer:null, step:0, nextT:0,
  tracks:[
    {name:'إحماء متدرّج', cat:'إحماء', bpm:100, style:'warm', root:45},
    {name:'قوة ثابتة', cat:'قوة', bpm:90, style:'strength', root:40},
    {name:'كارديو حماسي', cat:'كارديو', bpm:128, style:'cardio', root:43},
    {name:'تحدٍّ سريع', cat:'كارديو', bpm:140, style:'hiit', root:38},
    {name:'إطالة هادئة', cat:'إطالة', bpm:70, style:'stretch', root:48},
    {name:'استرخاء واستشفاء', cat:'استرخاء', bpm:60, style:'calm', root:41}
  ],
  ensure() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return true; }
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return false;
    this.ctx = new C(); this.master = this.ctx.createGain(); this.master.gain.value = 1; this.master.connect(this.ctx.destination);
    this.music = this.ctx.createGain(); this.music.gain.value = this.vol; this.music.connect(this.master);
    const len = this.ctx.sampleRate; this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return true;
  },
  beep(f = 880, dur = .12, vol = .35) {
    if (!S.prefs.beep || !this.ensure()) return;
    const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + .02);
  },
  speak(text) {
    if (!S.prefs.voice || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = 'ar-SA'; u.rate = 1;
      const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith('ar')); if (v) u.voice = v;
      if (this.music && this.playing) { this.music.gain.setTargetAtTime(this.vol * .3, this.ctx.currentTime, .1); u.onend = () => this.music.gain.setTargetAtTime(this.vol, this.ctx.currentTime, .3); }
      speechSynthesis.speak(u);
    } catch (e) {}
  },
  hz: m => 440 * Math.pow(2, (m - 69) / 12),
  tone(type, m, t, dur, vol, cutoff) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = this.hz(m);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + Math.min(.02, dur / 4)); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    let node = o;
    if (cutoff) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cutoff; o.connect(f); node = f; }
    node.connect(g); g.connect(this.music); o.start(t); o.stop(t + dur + .05);
  },
  kick(t, v = .9) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + .14); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(g); g.connect(this.music); o.start(t); o.stop(t + .32); },
  hiss(t, dur, v, hp) { const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = this.noise; f.type = 'highpass'; f.frequency.value = hp; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + dur); s.connect(f); f.connect(g); g.connect(this.music); s.start(t, Math.random() * .5); s.stop(t + dur + .02); },
  schedule(i, t) {
    const tr = this.tracks[this.idx], st = tr.style, beat = 60 / tr.bpm, s16 = i % 16, bar = Math.floor(i / 16) % 4;
    const prog = [0, -4, 3, -2][bar], r = tr.root + prog;
    const drums = !['stretch','calm'].includes(st);
    if (drums) {
      const four = st === 'cardio' || st === 'hiit';
      if (four ? s16 % 4 === 0 : [0, 7, 8, 10].includes(s16) && (st === 'strength' || s16 % 8 === 0)) this.kick(t, st === 'strength' ? 1 : .85);
      if (s16 === 4 || s16 === 12) this.hiss(t, .18, st === 'warm' ? .18 : .3, 1500);
      if (four ? s16 % 4 === 2 : s16 % 2 === 0) this.hiss(t, .05, .12, 7000);
      if (st === 'hiit' && s16 % 2 === 1) this.hiss(t, .03, .06, 9000);
      if (four ? s16 % 4 === 2 : [0, 6, 10].includes(s16)) this.tone('sawtooth', r, t, beat * .45, .16, 600);
    }
    if (s16 === 0) [12, 15, 19].forEach(x => this.tone('triangle', r + x + (bar % 2 ? 0 : 0), t, beat * 4, drums ? .05 : .08));
    if (!drums && s16 % 4 === 0) this.tone('sine', r + 24 + [0, 7, 12, 15][(s16 / 4 + bar) % 4], t, beat * 1.6, .06);
    if (st === 'warm' && s16 % 4 === 3) this.tone('square', r + 24 + [0, 3, 7, 10][bar], t, beat * .2, .025, 2000);
  },
  play() {
    if (!this.ensure()) return false;
    if (this.playing) return true;
    this.playing = true; this.step = 0; this.nextT = this.ctx.currentTime + .08;
    this.timer = setInterval(() => {
      const tr = this.tracks[this.idx], s = 60 / tr.bpm / 4;
      while (this.nextT < this.ctx.currentTime + .15) { this.schedule(this.step, this.nextT); this.nextT += s; this.step++; }
    }, 25);
    UI.musicChanged(); return true;
  },
  pause() { this.playing = false; clearInterval(this.timer); UI.musicChanged(); },
  toggle() { this.playing ? this.pause() : this.play(); },
  go(d) { this.idx = (this.idx + d + this.tracks.length) % this.tracks.length; this.step = 0; UI.musicChanged(); },
  pick(i) { this.idx = i; this.step = 0; if (!this.playing) this.play(); else UI.musicChanged(); },
  setVol(v) { this.vol = v; if (this.music) this.music.gain.setTargetAtTime(v, this.ctx.currentTime, .05); },
  forPhase(ph) { const m = {warm:0, main:1, cool:4}; if (this.playing && m[ph] !== undefined && this.tracks[this.idx].autoLock !== true) { /* keep user choice */ } }
};
