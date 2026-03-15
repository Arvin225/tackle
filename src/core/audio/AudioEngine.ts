import { Howl } from "howler";
import { AudioFormat, PlaybackState, PlaybackMode } from "./types";

export interface Track {
  id: string;
  url: string;
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  format?: AudioFormat;
}

export interface AudioEngineConfig {
  gaplessPlayback?: boolean;
  crossfadeDuration?: number;
  preloadAheadPercent?: number;
}

export class AudioEngine {
  private howls: Map<string, Howl> = new Map();
  private currentTrack: Track | null = null;
  private queue: Track[] = [];
  private currentIndex: number = -1;
  private state: PlaybackState = PlaybackState.IDLE;
  private volume: number = 1;
  private mode: PlaybackMode = PlaybackMode.SEQUENTIAL;
  private gaplessPlayback: boolean = true;
  private crossfadeDuration: number = 0;
  private preloadAheadPercent: number = 0.8;

  private stateChangeListeners: Array<(state: PlaybackState) => void> = [];
  private progressListeners: Array<(progress: number) => void> = [];
  private endListeners: Array<() => void> = [];

  constructor(config?: AudioEngineConfig) {
    if (config) {
      this.gaplessPlayback = config.gaplessPlayback ?? true;
      this.crossfadeDuration = config.crossfadeDuration ?? 0;
      this.preloadAheadPercent = config.preloadAheadPercent ?? 0.8;
    }
  }

  /**
   * Get current playback state
   */
  getState(): PlaybackState {
    return this.state;
  }

  /**
   * Get current track
   */
  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  /**
   * Get current queue
   */
  getQueue(): Track[] {
    return [...this.queue];
  }

  /**
   * Set playback mode
   */
  setMode(mode: PlaybackMode): void {
    this.mode = mode;
  }

  /**
   * Get current playback mode
   */
  getMode(): PlaybackMode {
    return this.mode;
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.howls.forEach(howl => {
      if (howl) {
        howl.volume(this.volume);
      }
    });
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Add track to queue
   */
  addToQueue(track: Track): void {
    this.queue.push(track);
  }

  /**
   * Set queue
   */
  setQueue(tracks: Track[]): void {
    this.queue = tracks;
    this.currentIndex = -1;
    this.currentTrack = null;
  }

  /**
   * Clear queue
   */
  clearQueue(): void {
    this.queue = [];
    this.currentIndex = -1;
    this.currentTrack = null;
  }

  /**
   * Remove track from queue by ID
   */
  removeFromQueue(trackId: string): void {
    this.queue = this.queue.filter(track => track.id !== trackId);
  }

  /**
   * Load and prepare track (alias for loadTrack)
   */
  public async load(track: Track): Promise<void> {
    return this.loadTrack(track);
  }

  /**
   * Load and prepare track
   */
  public async loadTrack(track: Track): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const format = this.detectFormat(track.url);
        track.format = format;

        const howl = new Howl({
          src: [track.url],
          format: [format],
          html5: true,
          preload: true,
          onload: () => {
            console.log(`Loaded track: ${track.title || track.url}`);
            this.state = PlaybackState.READY;
            this.notifyStateChange();
            resolve();
          },
          onloaderror: (id, error) => {
            console.error(`Failed to load track: ${track.title}`, error);
            reject(new Error(`Failed to load track: ${track.title}`));
          },
          onplay: () => {
            this.state = PlaybackState.PLAYING;
            this.notifyStateChange();
          },
          onpause: () => {
            this.state = PlaybackState.PAUSED;
            this.notifyStateChange();
          },
          onstop: () => {
            this.state = PlaybackState.IDLE;
            this.notifyStateChange();
          },
          onend: () => {
            this.state = PlaybackState.IDLE;
            this.notifyStateChange();
            this.onTrackEnd();
          },
          onseek: () => {
            // Progress listener
          },
        });

        this.howls.set(track.id, howl);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Detect audio format from URL
   */
  private detectFormat(url: string): AudioFormat {
    const extension = url.split(".").pop()?.toLowerCase();
    const formats: Record<string, AudioFormat> = {
      mp3: AudioFormat.MP3,
      m4a: AudioFormat.M4A,
      aac: AudioFormat.AAC,
      wav: AudioFormat.WAV,
      ogg: AudioFormat.OGG,
    };
    return formats[extension || ""] || AudioFormat.MP3;
  }

  /**
   * Play next track
   */
  private async playNext(): Promise<void> {
    if (this.queue.length === 0) {
      this.state = PlaybackState.IDLE;
      this.currentTrack = null;
      this.notifyStateChange();
      return;
    }

    if (this.mode === PlaybackMode.SHUFFLE) {
      this.currentIndex = Math.floor(Math.random() * this.queue.length);
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.queue.length;
    }

    if (this.currentIndex >= this.queue.length) {
      this.currentIndex = 0;
    }

    await this.playAtIndex(this.currentIndex);
  }

  /**
   * Play previous track
   */
  private async playPrevious(): Promise<void> {
    if (this.state === PlaybackState.PLAYING) {
      // If more than 3 seconds into track, restart it
      const howl = this.howls.get(this.currentTrack!.id);
      if (howl && howl.seek() > 3) {
        howl.seek(0);
        return;
      }
    }

    if (this.mode === PlaybackMode.SHUFFLE) {
      this.currentIndex = Math.floor(Math.random() * this.queue.length);
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length;
    }

    await this.playAtIndex(this.currentIndex);
  }

  /**
   * Play track at specific index
   */
  private async playAtIndex(index: number): Promise<void> {
    if (index < 0 || index >= this.queue.length) {
      return;
    }

    const track = this.queue[index];
    this.currentTrack = track;

    // Preload next track if gapless playback is enabled
    if (this.gaplessPlayback && this.preloadAheadPercent > 0) {
      const nextIndex = (index + 1) % this.queue.length;
      this.loadTrack(this.queue[nextIndex]).catch(console.error);
    }

    try {
      await this.loadTrack(track);
      const howl = this.howls.get(track.id);
      if (howl) {
        howl.volume(this.volume);
        howl.play();
      }
    } catch (err) {
      console.error("Failed to play track:", err);
      // Try next track
      this.playNext();
    }
  }

  /**
   * Handle track end
   */
  private onTrackEnd(): void {
    if (this.mode === PlaybackMode.SINGLE_LOOP) {
      // Restart current track
      const howl = this.howls.get(this.currentTrack!.id);
      if (howl) {
        howl.play();
      }
    } else {
      this.playNext();
    }
  }

  /**
   * Play current or next track
   */
  async play(): Promise<void> {
    if (this.state === PlaybackState.PLAYING) {
      return;
    }

    if (!this.currentTrack) {
      if (this.queue.length === 0) {
        return;
      }
      await this.playAtIndex(0);
    } else {
      const howl = this.howls.get(this.currentTrack.id);
      if (howl) {
        howl.play();
      }
    }
  }

  /**
   * Pause current track
   */
  pause(): void {
    const howl = this.howls.get(this.currentTrack!.id);
    if (howl) {
      howl.pause();
    }
  }

  /**
   * Stop current track
   */
  stop(): void {
    const howl = this.howls.get(this.currentTrack!.id);
    if (howl) {
      howl.stop();
    }
    this.state = PlaybackState.IDLE;
    this.notifyStateChange();
  }

  /**
   * Seek to position (0-1)
   */
  seek(position: number): void {
    const howl = this.howls.get(this.currentTrack!.id);
    if (howl) {
      howl.seek(position);
    }
  }

  /**
   * Get current seek position (0-1)
   */
  getSeek(): number {
    const howl = this.howls.get(this.currentTrack!.id);
    if (howl) {
      return howl.seek();
    }
    return 0;
  }

  /**
   * Get duration (0-1)
   */
  getDuration(): number {
    const howl = this.howls.get(this.currentTrack!.id);
    if (howl) {
      return howl.duration() || 0;
    }
    return 0;
  }

  /**
   * Toggle mute
   */
  toggleMute(): void {
    const howl = this.howls.get(this.currentTrack!.id);
    if (howl) {
      howl.mute(!howl.mute());
    }
  }

  /**
   * Is muted?
   */
  isMuted(): boolean {
    const howl = this.howls.get(this.currentTrack!.id);
    if (howl) {
      return howl.mute();
    }
    return false;
  }

  /**
   * Unload all tracks
   */
  unload(): void {
    this.howls.forEach(howl => {
      howl.unload();
    });
    this.howls.clear();
    this.queue = [];
    this.currentIndex = -1;
    this.currentTrack = null;
    this.state = PlaybackState.IDLE;
  }

  /**
   * Add state change listener
   */
  onStateChange(listener: (state: PlaybackState) => void): () => void {
    this.stateChangeListeners.push(listener);
    return () => {
      const index = this.stateChangeListeners.indexOf(listener);
      if (index > -1) {
        this.stateChangeListeners.splice(index, 1);
      }
    };
  }

  /**
   * Remove state change listener
   */
  offStateChange(listener: (state: PlaybackState) => void): void {
    const index = this.stateChangeListeners.indexOf(listener);
    if (index > -1) {
      this.stateChangeListeners.splice(index, 1);
    }
  }

  /**
   * Add progress listener
   */
  onProgress(listener: (progress: number) => void): () => void {
    this.progressListeners.push(listener);
    return () => {
      const index = this.progressListeners.indexOf(listener);
      if (index > -1) {
        this.progressListeners.splice(index, 1);
      }
    };
  }

  /**
   * Add end listener
   */
  onEnd(listener: () => void): () => void {
    this.endListeners.push(listener);
    return () => {
      const index = this.endListeners.indexOf(listener);
      if (index > -1) {
        this.endListeners.splice(index, 1);
      }
    };
  }

  private notifyStateChange(): void {
    this.stateChangeListeners.forEach(listener => listener(this.state));
  }

  private notifyProgress(progress: number): void {
    this.progressListeners.forEach(listener => listener(progress));
  }
}
