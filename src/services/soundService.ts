
// Simple synthesized sound effects using Web Audio API

let audioCtx: AudioContext | null = null;
let musicGain: GainNode | null = null;
let musicOscillators: OscillatorNode[] = [];
let isMusicPlaying = false;
let isMusicMuted = false;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// --- Background Music Control ---

export const initMusic = () => {
  const ctx = getContext();
  if (!ctx || isMusicPlaying) return;

  // Resume context if suspended (browser policy)
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  // Create a master gain for music to control volume/ducking
  musicGain = ctx.createGain();
  musicGain.gain.setValueAtTime(isMusicMuted ? 0 : 0.15, ctx.currentTime);
  musicGain.connect(ctx.destination);

  // Create ambient drone (Horror atmosphere)
  // Osc 1: Deep low drone
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(50, ctx.currentTime);
  
  // Osc 2: Slightly detuned for "beating" effect
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(53, ctx.currentTime); // 3Hz beat

  // Osc 3: Higher pitch eerie tone
  const osc3 = ctx.createOscillator();
  osc3.type = 'triangle';
  osc3.frequency.setValueAtTime(120, ctx.currentTime);
  
  // LFO for Osc 3 volume (undulating effect)
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.2; // Slow cycle
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.05;
  lfo.connect(lfoGain.gain);

  osc1.connect(musicGain);
  osc2.connect(musicGain);
  osc3.connect(musicGain);

  osc1.start();
  osc2.start();
  osc3.start();
  lfo.start();

  musicOscillators = [osc1, osc2, osc3, lfo];
  isMusicPlaying = true;
};

export const toggleMusic = (mute: boolean) => {
  isMusicMuted = mute;
  if (musicGain) {
    const ctx = getContext();
    if (ctx) {
       musicGain.gain.setTargetAtTime(mute ? 0 : 0.15, ctx.currentTime, 0.1);
    }
  } else if (!mute) {
    // If we try to unmute but music hasn't started (e.g. autoplay blocked), start it
    initMusic();
  }
};

export const duckMusic = () => {
  if (!musicGain || isMusicMuted) return;
  const ctx = getContext();
  if (!ctx) return;

  // Duck volume down
  musicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicGain.gain.setTargetAtTime(0.02, ctx.currentTime, 0.1);

  // Bring it back up after a short delay
  musicGain.gain.setTargetAtTime(0.15, ctx.currentTime + 1.0, 0.5);
};


// --- SFX ---

export const playCorrectSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  
  duckMusic();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

export const playIncorrectSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  
  duckMusic();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
  
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

export const playTickSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  
  // Tick is subtle, maybe don't duck for every single tick or it will pump too much
  // But user said "any sound". Let's duck but maybe less aggressively?
  // Actually, regular ducking is fine, it keeps bgm low during high tension.
  duckMusic();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

export const playClickSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  
  duckMusic();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Short high-pitched blip for UI click
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};
