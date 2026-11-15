const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audio = new AudioCtx();
let soundEnabled = true;

function playTone(freq, dur, type = 'sine', vol = 0.1, slideTo = null) {
  if (!soundEnabled) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, audio.currentTime + dur);
  gain.gain.setValueAtTime(vol, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + dur);
}

const sfx = {
  jump:        () => playTone(400, 0.15, 'square', 0.08, 700),
  coin:        () => { playTone(660, 0.08, 'sine', 0.1); setTimeout(() => playTone(990, 0.12, 'sine', 0.1), 60); setTimeout(() => playTone(1320, 0.1, 'sine', 0.08), 120); },
  stomp:       () => playTone(200, 0.2, 'sawtooth', 0.12, 80),
  hurt:        () => playTone(300, 0.3, 'sawtooth', 0.15, 100),
  throw:       () => playTone(500, 0.1, 'triangle', 0.08, 200),
  levelup:     () => { [523,659,784,1047].forEach((f,i) => setTimeout(() => playTone(f, 0.15, 'sine', 0.1), i*80)); },
  gameover:    () => { [400,350,300,200].forEach((f,i) => setTimeout(() => playTone(f, 0.2, 'sawtooth', 0.12), i*150)); },
  powerup:     () => { [392,523,659,784,1047].forEach((f,i) => setTimeout(() => playTone(f, 0.2, 'sine', 0.12), i*70)); setTimeout(() => playTone(1047, 0.5, 'sine', 0.1), 400); setTimeout(() => playTone(1318, 0.6, 'sine', 0.1), 600); },
  powerEnd:    () => { [1047,784,523,392].forEach((f,i) => setTimeout(() => playTone(f, 0.15, 'sine', 0.08), i*60)); },
  hammerThrow: () => { playTone(300, 0.1, 'square', 0.1, 600); setTimeout(() => playTone(800, 0.15, 'triangle', 0.08, 200), 50); },
  hammerHit:   () => { playTone(150, 0.2, 'sawtooth', 0.15, 60); setTimeout(() => playTone(400, 0.1, 'square', 0.08, 100), 50); },
  bossRoar:    () => { playTone(80, 0.5, 'sawtooth', 0.2, 40); setTimeout(() => playTone(120, 0.4, 'square', 0.15, 60), 200); setTimeout(() => playTone(60, 0.6, 'sawtooth', 0.18, 30), 400); },
  bossHit:     () => { playTone(250, 0.15, 'square', 0.12, 100); setTimeout(() => playTone(500, 0.1, 'sine', 0.08, 200), 50); },
  victory:     () => { [523,659,784,1047,1318,1568].forEach((f,i) => setTimeout(() => playTone(f, 0.25, 'sine', 0.12), i*100)); setTimeout(() => playTone(1568, 1.0, 'sine', 0.1), 700); },
  buttonHover: () => playTone(600, 0.05, 'sine', 0.06),
  buttonClick: () => { playTone(400, 0.08, 'square', 0.1, 800); setTimeout(() => playTone(900, 0.15, 'sine', 0.08, 1200), 60); }
};

// Разблокировка аудио по первому клику
addEventListener('click', () => {
  if (audio.state === 'suspended') audio.resume();
}, { once: true });
