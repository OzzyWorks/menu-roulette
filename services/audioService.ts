
export const playTaDaSound = () => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 (C Major Chord)
  
  const now = audioCtx.currentTime;
  
  notes.forEach((freq, i) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freq, now);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 1.5);
  });

  // Brass-like fanfare accent
  const noise = audioCtx.createOscillator();
  const noiseGain = audioCtx.createGain();
  noise.type = 'sawtooth';
  noise.frequency.setValueAtTime(100, now);
  noise.frequency.exponentialRampToValueAtTime(200, now + 0.5);
  noiseGain.gain.setValueAtTime(0.1, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
  noise.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noise.start(now);
  noise.stop(now + 0.5);
};

let tickAudioCtx: AudioContext | null = null;

export const playTickSound = (volume: number = 0.1) => {
  if (!tickAudioCtx) {
    tickAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  
  if (tickAudioCtx.state === 'suspended') {
    tickAudioCtx.resume();
  }

  const now = tickAudioCtx.currentTime;
  const osc = tickAudioCtx.createOscillator();
  const gain = tickAudioCtx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(tickAudioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
};
