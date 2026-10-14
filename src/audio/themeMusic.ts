// Theme Music Controller for Solo Leveling System
// Self-contained, auto-playlist loop, crossfade, and strict 30-40% volume clamping.

export const MUSIC_MIN = 0.30;
export const MUSIC_MAX = 0.40;
export const MUSIC_DEFAULT = 0.35;

export interface TrackInfo {
  filename: string;
  url: string;
  fallbackUrl?: string;
}

export interface MusicState {
  isPlaying: boolean;
  enabled: boolean;
  volume: number;
  currentTrack: string | null;
  playlist: TrackInfo[];
  isDucked: boolean;
}

export type MusicStateListener = (state: MusicState) => void;

class ThemeMusicManager {
  private audioA: HTMLAudioElement | null = null;
  private audioB: HTMLAudioElement | null = null;
  private activeElement: 'A' | 'B' = 'A';

  // Pre-seed with default track so playlist is never empty on immediate click
  private playlist: TrackInfo[] = [
    {
      filename: '01-solo-leveling.mp3',
      url: '/audio/theme/01-solo-leveling.mp3',
      fallbackUrl: '/api/theme-music/01-solo-leveling.mp3',
    },
  ];
  private currentIndex: number = 0;

  private enabled: boolean = true;
  private userVolume: number = MUSIC_DEFAULT;
  private isDucked: boolean = false;
  private isPlaying: boolean = false;
  private userHasInteracted: boolean = false;
  private crossfadeDuration: number = 1.2;

  private listeners: Set<MusicStateListener> = new Set();
  private crossfadeInterval: NodeJS.Timeout | null = null;
  private duckInterval: NodeJS.Timeout | null = null;

  private cachedState: MusicState = {
    isPlaying: false,
    enabled: true,
    volume: MUSIC_DEFAULT,
    currentTrack: '01-solo-leveling.mp3',
    playlist: [
      {
        filename: '01-solo-leveling.mp3',
        url: '/audio/theme/01-solo-leveling.mp3',
        fallbackUrl: '/api/theme-music/01-solo-leveling.mp3',
      },
    ],
    isDucked: false,
  };

  private updateCachedState() {
    this.cachedState = {
      isPlaying: this.isPlaying,
      enabled: this.enabled,
      volume: this.userVolume,
      currentTrack: this.playlist[this.currentIndex]?.filename || null,
      playlist: this.playlist,
      isDucked: this.isDucked,
    };
  }

  constructor() {
    this.updateCachedState();
    if (typeof window !== 'undefined') {
      this.loadSettings();
      this.updateCachedState();
      this.initAudioElements();
      this.fetchPlaylist();
      this.setupGlobalListeners();
    }
  }

  // Hard clamp volume strictly between 30% and 40%
  public clampVolume(vol: number): number {
    if (isNaN(vol)) return MUSIC_DEFAULT;
    return Math.min(MUSIC_MAX, Math.max(MUSIC_MIN, vol));
  }

  private loadSettings() {
    try {
      const storedEnabled = localStorage.getItem('SYSTEM_MUSIC_ENABLED');
      if (storedEnabled !== null) {
        this.enabled = storedEnabled === 'true';
      }

      const storedVol = localStorage.getItem('SYSTEM_MUSIC_VOLUME');
      if (storedVol !== null) {
        const parsed = parseFloat(storedVol);
        this.userVolume = this.clampVolume(parsed);
      } else {
        this.userVolume = MUSIC_DEFAULT;
      }
    } catch {
      this.enabled = true;
      this.userVolume = MUSIC_DEFAULT;
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem('SYSTEM_MUSIC_ENABLED', String(this.enabled));
      localStorage.setItem('SYSTEM_MUSIC_VOLUME', String(this.userVolume));
    } catch {
      // Ignored
    }
  }

  private initAudioElements() {
    if (typeof window === 'undefined') return;

    this.audioA = new Audio();
    this.audioB = new Audio();

    // Assign initial track source immediately
    const initialUrl = this.playlist[0]?.url || '/audio/theme/01-solo-leveling.mp3';
    this.audioA.src = initialUrl;
    this.audioA.loop = true; // Default to looping single song

    [this.audioA, this.audioB].forEach((audio, idx) => {
      audio.preload = 'auto';
      audio.volume = this.effectiveTargetVolume();

      audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      audio.addEventListener('pause', () => {
        const other = this.getInactiveAudio();
        if (!other || other.paused) {
          this.isPlaying = false;
          this.notify();
        }
      });

      audio.addEventListener('ended', () => {
        this.handleTrackEnded();
      });

      audio.addEventListener('error', (e) => {
        console.warn(`Audio element ${idx} error`, e);
      });
    });
  }

  public async fetchPlaylist() {
    if (typeof window === 'undefined') return;

    try {
      const res = await fetch('/api/theme-music', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tracks) && data.tracks.length > 0) {
          this.playlist = data.tracks;
          this.notify();

          // Ensure active audio has current track
          const currentAudio = this.getCurrentAudio();
          if (currentAudio && !currentAudio.src) {
            currentAudio.src = this.playlist[this.currentIndex]?.url || '/audio/theme/01-solo-leveling.mp3';
            currentAudio.loop = this.playlist.length === 1;
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch theme music playlist:', err);
    }
  }

  private setupGlobalListeners() {
    if (typeof window === 'undefined') return;

    // Handle tab visibility change (pause on background, resume on foreground)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const currentAudio = this.getCurrentAudio();
        if (currentAudio && !currentAudio.paused) {
          currentAudio.pause();
        }
      } else {
        if (this.enabled && this.userHasInteracted && this.isPlaying) {
          const currentAudio = this.getCurrentAudio();
          if (currentAudio && currentAudio.paused) {
            currentAudio.play().catch(() => {});
          }
        }
      }
    });
  }

  // Explicitly start theme music when the player clicks YES on onboarding
  public startThemeOnYesAccept() {
    this.userHasInteracted = true;
    this.enabled = true;
    this.saveSettings();

    const audio = this.getCurrentAudio();
    if (audio) {
      const targetUrl = this.playlist[0]?.url || '/audio/theme/01-solo-leveling.mp3';
      audio.src = targetUrl;
      audio.loop = this.playlist.length <= 1;
      audio.volume = this.effectiveTargetVolume();

      audio.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch((err) => {
        console.warn('Playback on YES button failed:', err);
      });
    }
  }

  private getCurrentAudio(): HTMLAudioElement | null {
    return this.activeElement === 'A' ? this.audioA : this.audioB;
  }

  private getInactiveAudio(): HTMLAudioElement | null {
    return this.activeElement === 'A' ? this.audioB : this.audioA;
  }

  private effectiveTargetVolume(): number {
    if (!this.enabled) return 0;
    if (this.isDucked) return MUSIC_MIN;
    return this.clampVolume(this.userVolume);
  }

  public playCurrentTrack() {
    if (!this.enabled) return;

    const currentTrack = this.playlist[this.currentIndex] || this.playlist[0];
    if (!currentTrack) return;

    const audio = this.getCurrentAudio();
    if (!audio) return;

    const targetUrl = currentTrack.url;
    if (!audio.src || (!audio.src.endsWith(targetUrl) && audio.src !== targetUrl)) {
      audio.src = targetUrl;
    }

    audio.loop = this.playlist.length <= 1;
    audio.volume = this.effectiveTargetVolume();

    const promise = audio.play();
    if (promise !== undefined) {
      promise.then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch((err) => {
        console.log('Audio playback waiting for direct user gesture:', err);
      });
    }
  }

  public unlockAndPlay() {
    this.userHasInteracted = true;
    this.enabled = true;
    this.saveSettings();

    // Call synchronously within the event callstack
    const audio = this.getCurrentAudio();
    if (audio) {
      if (!audio.src) {
        audio.src = this.playlist[this.currentIndex]?.url || '/audio/theme/01-solo-leveling.mp3';
      }
      audio.loop = this.playlist.length <= 1;
      audio.volume = this.effectiveTargetVolume();
      audio.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch((e) => {
        console.warn('Unlock audio caught:', e);
      });
    }
  }

  private handleTrackEnded() {
    if (this.playlist.length <= 1) return;
    this.advanceTrackWithCrossfade();
  }

  private advanceTrackWithCrossfade() {
    if (this.playlist.length <= 1) return;

    const nextIndex = (this.currentIndex + 1) % this.playlist.length;
    const nextTrack = this.playlist[nextIndex];
    if (!nextTrack) return;

    const fadingOutAudio = this.getCurrentAudio();
    const fadingInAudio = this.getInactiveAudio();

    if (!fadingOutAudio || !fadingInAudio) return;

    this.activeElement = this.activeElement === 'A' ? 'B' : 'A';
    this.currentIndex = nextIndex;

    fadingInAudio.src = nextTrack.url;
    fadingInAudio.loop = false;
    fadingInAudio.volume = 0;

    fadingInAudio.play().then(() => {
      this.isPlaying = true;
      this.notify();

      const steps = 12;
      const stepInterval = (this.crossfadeDuration * 1000) / steps;
      let currentStep = 0;
      const targetVol = this.effectiveTargetVolume();

      if (this.crossfadeInterval) clearInterval(this.crossfadeInterval);

      this.crossfadeInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        const outVol = Math.max(0, targetVol * (1 - progress));
        fadingOutAudio.volume = outVol;

        const inVol = Math.min(targetVol, targetVol * progress);
        fadingInAudio.volume = inVol;

        if (currentStep >= steps) {
          if (this.crossfadeInterval) clearInterval(this.crossfadeInterval);
          fadingOutAudio.pause();
          fadingInAudio.volume = targetVol;
        }
      }, stepInterval);
    }).catch(() => {
      this.playCurrentTrack();
    });
  }

  public triggerUserInteraction() {
    this.unlockAndPlay();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.setEnabled(false);
    } else {
      this.unlockAndPlay();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    this.saveSettings();

    const currentAudio = this.getCurrentAudio();
    if (!val) {
      if (currentAudio) currentAudio.pause();
      this.isPlaying = false;
    } else {
      this.unlockAndPlay();
    }
    this.notify();
  }

  public setVolume(val: number) {
    const clamped = this.clampVolume(val);
    this.userVolume = clamped;
    this.saveSettings();

    const currentAudio = this.getCurrentAudio();
    if (currentAudio && this.enabled && !this.isDucked) {
      currentAudio.volume = clamped;
    }
    this.notify();
  }

  public setDucked(ducked: boolean) {
    if (this.isDucked === ducked) return;
    this.isDucked = ducked;

    const audio = this.getCurrentAudio();
    if (!audio || !this.enabled) {
      this.notify();
      return;
    }

    const startVol = audio.volume;
    const targetVol = ducked ? MUSIC_MIN : this.clampVolume(this.userVolume);

    if (this.duckInterval) clearInterval(this.duckInterval);

    const steps = 6;
    let step = 0;
    this.duckInterval = setInterval(() => {
      step++;
      const current = startVol + (targetVol - startVol) * (step / steps);
      audio.volume = this.clampVolume(current);

      if (step >= steps) {
        if (this.duckInterval) clearInterval(this.duckInterval);
        audio.volume = targetVol;
      }
    }, 50);

    this.notify();
  }

  public subscribe(listener: MusicStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): MusicState {
    return this.cachedState;
  }

  private notify() {
    this.updateCachedState();
    const state = this.cachedState;
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in music state listener', err);
      }
    });
  }
}

export const themeMusic = new ThemeMusicManager();
