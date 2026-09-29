// Native Web Audio API Soundscape & Binaural Beats Synthesizer (0 dependencies)

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.tracks = {};
    this.isPlaying = false;
    this.activeTracks = {
      gamma: { active: false, volume: 0.5 },
      alpha: { active: false, volume: 0.4 },
      brown: { active: true, volume: 0.6 },
      rain: { active: false, volume: 0.5 },
      clock: { active: false, volume: 0.3 },
    };
    this.clockInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Master Volume Control (0.0 to 1.0)
  setMasterVolume(vol) {
    if (!this.masterGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, vol));
    this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
  }

  // Helper to create looping noise buffer
  createNoiseBuffer(type = 'brown') {
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds loop
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }
    } else {
      // White / Rain base
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }
    }
    return buffer;
  }

  // Track: 40Hz Gamma Focus Binaural Beats
  startGamma(vol) {
    this.stopTrack('gamma');
    const baseFreq = 200; // Base carrier (200 Hz)
    const beatFreq = 40;  // 40 Hz Gamma difference

    const leftOsc = this.ctx.createOscillator();
    const rightOsc = this.ctx.createOscillator();
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    rightOsc.frequency.setValueAtTime(baseFreq + beatFreq, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.4, this.ctx.currentTime);

    // Stereo split
    const merger = this.ctx.createChannelMerger(2);
    leftOsc.connect(merger, 0, 0); // Left channel
    rightOsc.connect(merger, 0, 1); // Right channel

    merger.connect(gain);
    gain.connect(this.masterGain);

    leftOsc.start();
    rightOsc.start();

    this.tracks.gamma = { leftOsc, rightOsc, gain, type: 'binaural' };
  }

  // Track: 10Hz Alpha Waves
  startAlpha(vol) {
    this.stopTrack('alpha');
    const baseFreq = 180;
    const beatFreq = 10; // 10 Hz Alpha difference

    const leftOsc = this.ctx.createOscillator();
    const rightOsc = this.ctx.createOscillator();
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    rightOsc.frequency.setValueAtTime(baseFreq + beatFreq, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.4, this.ctx.currentTime);

    const merger = this.ctx.createChannelMerger(2);
    leftOsc.connect(merger, 0, 0);
    rightOsc.connect(merger, 0, 1);

    merger.connect(gain);
    gain.connect(this.masterGain);

    leftOsc.start();
    rightOsc.start();

    this.tracks.alpha = { leftOsc, rightOsc, gain, type: 'binaural' };
  }

  // Track: Deep Brown Noise
  startBrown(vol) {
    this.stopTrack('brown');
    const buffer = this.createNoiseBuffer('brown');
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    // Low-pass filter for deeper rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.6, this.ctx.currentTime);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    src.start();
    this.tracks.brown = { src, gain, filter, type: 'noise' };
  }

  // Track: Rain / Nature Ambience
  startRain(vol) {
    this.stopTrack('rain');
    const buffer = this.createNoiseBuffer('white');
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    // Bandpass + Lowpass filter to simulate rain texture
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.5, this.ctx.currentTime);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    src.start();
    this.tracks.rain = { src, gain, filter, type: 'noise' };
  }

  // Track: Analog Clock Tick
  startClock(vol) {
    this.stopTrack('clock');
    const tick = () => {
      if (!this.ctx || !this.isPlaying || !this.activeTracks.clock.active) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(this.activeTracks.clock.volume * 0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    };

    tick();
    this.clockInterval = setInterval(tick, 1000);
    this.tracks.clock = { interval: this.clockInterval, type: 'clock' };
  }

  stopTrack(key) {
    if (this.tracks[key]) {
      const t = this.tracks[key];
      if (t.type === 'binaural') {
        try { t.leftOsc.stop(); t.rightOsc.stop(); } catch(e){}
      } else if (t.type === 'noise') {
        try { t.src.stop(); } catch(e){}
      } else if (t.type === 'clock') {
        if (this.clockInterval) clearInterval(this.clockInterval);
        this.clockInterval = null;
      }
      delete this.tracks[key];
    }
  }

  updateTrack(key, active, volume) {
    this.activeTracks[key] = { active, volume };
    if (!this.isPlaying) return;

    if (!active) {
      this.stopTrack(key);
    } else {
      if (key === 'gamma') this.startGamma(volume);
      else if (key === 'alpha') this.startAlpha(volume);
      else if (key === 'brown') this.startBrown(volume);
      else if (key === 'rain') this.startRain(volume);
      else if (key === 'clock') this.startClock(volume);
    }
  }

  playAll() {
    this.init();
    this.isPlaying = true;
    Object.keys(this.activeTracks).forEach((key) => {
      const cfg = this.activeTracks[key];
      if (cfg.active) {
        this.updateTrack(key, true, cfg.volume);
      }
    });
  }

  stopAll() {
    this.isPlaying = false;
    Object.keys(this.tracks).forEach((key) => {
      this.stopTrack(key);
    });
  }

  toggleMaster() {
    if (this.isPlaying) {
      this.stopAll();
      return false;
    } else {
      this.playAll();
      return true;
    }
  }
}

export const soundEngine = new SoundEngine();
