// Web Audio API sound engine with instant preloaded audio pool for custom popup.mp3 SFX

class SoundFX {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private hapticEnabled: boolean = true;

  // Custom audio pool for popup.mp3 (supports rapid concurrent alerts with zero latency)
  private popupPool: HTMLAudioElement[] = [];
  private poolIndex: number = 0;
  private customPopupAvailable: boolean = true;
  private customPopupUrl: string = '/audio/sfx/popup.mp3';

  constructor() {
    if (typeof window !== 'undefined') {
      this.initPopupPool();
      this.checkAndInitCustomSfx();
    }
  }

  private initPopupPool() {
    if (typeof window === 'undefined') return;
    try {
      this.popupPool = [];
      for (let i = 0; i < 4; i++) {
        const audio = new Audio(this.customPopupUrl);
        audio.preload = 'auto';
        this.popupPool.push(audio);
      }
      this.customPopupAvailable = true;
    } catch (e) {
      console.warn('Failed to initialize popup audio pool:', e);
    }
  }

  public async checkAndInitCustomSfx(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const res = await fetch('/api/sfx/upload', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.exists && data.url) {
          this.customPopupUrl = `${data.url}?t=${Date.now()}`;
          this.initPopupPool();
          this.customPopupAvailable = true;
          return true;
        }
      }
    } catch {
      // Ignored
    }
    return this.customPopupAvailable;
  }

  public async reloadCustomSfx(): Promise<boolean> {
    return this.checkAndInitCustomSfx();
  }

  public hasCustomPopup(): boolean {
    return this.customPopupAvailable;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setHapticEnabled(enabled: boolean) {
    this.hapticEnabled = enabled;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public vibrate(pattern: number | number[] = 25) {
    if (!this.hapticEnabled || typeof window === 'undefined') return;
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignored if not supported
    }
  }

  // Futuristic System Ding & Alert sound (Uses src/audio/sfx/popup.mp3)
  public playSystemDing() {
    if (!this.soundEnabled) return;

    this.vibrate(30);

    // Play from preloaded popup audio pool if available
    if (this.customPopupAvailable && this.popupPool.length > 0) {
      const audio = this.popupPool[this.poolIndex];
      this.poolIndex = (this.poolIndex + 1) % this.popupPool.length;

      if (audio) {
        try {
          audio.currentTime = 0;
          audio.volume = 0.85;
          const promise = audio.play();
          if (promise !== undefined) {
            promise.catch(() => {
              // Browser blocked or file issue -> fall back to synthesizer
              this.playSynthesizedDing();
            });
          }
          return;
        } catch {
          // Fall back to synthesizer
        }
      }
    }

    // Fallback: Synthesized Web Audio chime
    this.playSynthesizedDing();
  }

  public playPopupAlert() {
    this.playSystemDing();
  }

  private playSynthesizedDing() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.12); // A6

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1320, now); // E6
    osc2.frequency.exponentialRampToValueAtTime(2640, now + 0.14);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.36);
    osc2.stop(now + 0.36);
  }

  // Cyber Click / Tech button tap
  public playClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.vibrate(15);

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Stat point allocation
  public playStatAdd() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.vibrate(20);

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.08); // C6

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  // Quest Completed fan-tone
  public playQuestComplete() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.vibrate([30, 40, 50]);

    const now = ctx.currentTime;
    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      const start = now + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.26);
    });
  }

  // Level Up / Rank Up fanfare
  public playLevelUp() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.vibrate([50, 50, 100, 50, 150]);

    const now = ctx.currentTime;
    const chords = [
      { t: 0, f: [440, 554.37, 659.25] },
      { t: 0.15, f: [554.37, 659.25, 880] },
      { t: 0.3, f: [659.25, 880, 1108.73] },
      { t: 0.45, f: [880, 1108.73, 1318.51] },
      { t: 0.65, f: [1108.73, 1318.51, 1760] },
    ];

    chords.forEach((chord) => {
      chord.f.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + chord.t);

        gain.gain.setValueAtTime(0.06, now + chord.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + chord.t + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + chord.t);
        osc.stop(now + chord.t + 0.42);
      });
    });

    // Deep sub drop on level up
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.9);

    subGain.gain.setValueAtTime(0.2, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 0.95);
  }

  // Warning Alarm for Penalty Zone
  public playPenaltyWarning() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.vibrate([200, 100, 200, 100, 300]);

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.3);
    osc.frequency.linearRampToValueAtTime(440, now + 0.6);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.72);
  }
}

export const sound = new SoundFX();
