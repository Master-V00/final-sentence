
// Simple sound effects and background music using Audio API

let audioCtx: AudioContext | null = null;
let bgMusic: HTMLAudioElement | null = null;
let isMusicMuted = false;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// --- Background Music Control ---

export const initMusic = () => {
  if (bgMusic) return; // Already initialized

  bgMusic = new Audio('/Dark-Pulse-Monitor.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0.5; // Default volume

  if (!isMusicMuted) {
    bgMusic.play().catch(e => {
      console.log("Auto-play prevented, waiting for interaction:", e);
    });
  }
};

export const toggleMusic = (mute: boolean) => {
  isMusicMuted = mute;
  
  if (!bgMusic) {
    initMusic();
    return;
  }
  
  if (mute) {
    bgMusic.pause();
  } else {
    bgMusic.play().catch(e => console.error(e));
  }
};

export const duckMusic = () => {
  if (!bgMusic || isMusicMuted) return;
  
  // Lower volume temporarily
  bgMusic.volume = 0.1;
  
  // Restore after short delay
  setTimeout(() => {
    if (bgMusic && !isMusicMuted) {
      // Smooth-ish restoration
      const restoreInterval = setInterval(() => {
        if (bgMusic!.volume < 0.5) {
          bgMusic!.volume = Math.min(0.5, bgMusic!.volume + 0.05);
        } else {
          clearInterval(restoreInterval);
        }
      }, 50);
    }
  }, 800);
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
