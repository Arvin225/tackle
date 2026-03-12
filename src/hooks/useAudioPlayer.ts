import { useState, useCallback, useEffect, useRef } from "react";
import { AudioEngine, Track } from "../core/audio/AudioEngine";
import { PlaybackMode } from "../core/audio/types";

export function useAudioPlayer() {
  const engineRef = useRef<AudioEngine>(new AudioEngine());

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress] = useState(0);
  const [duration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Initialize engine
  useEffect(() => {
    const engine = engineRef.current;

    // Add event listeners
    const unsubscribeState = engine.onStateChange(state => {
      setIsPlaying(state === "PLAYING");
    });

    return () => {
      unsubscribeState();
    };
  }, []);

  /**
   * Load track
   */
  const loadTrack = useCallback(async (track: Track): Promise<void> => {
    try {
      await engineRef.current.loadTrack(track);
      setCurrentTrack(track);
      setQueue([track]);
      engineRef.current.play();
    } catch (error) {
      console.error("Failed to load track:", error);
    }
  }, []);

  /**
   * Play track
   */
  const play = useCallback(async (): Promise<void> => {
    await engineRef.current.play();
  }, []);

  /**
   * Pause track
   */
  const pause = useCallback((): void => {
    engineRef.current.pause();
  }, []);

  /**
   * Stop playback
   */
  const stop = useCallback((): void => {
    engineRef.current.stop();
  }, []);

  /**
   * Seek to position
   */
  const seek = useCallback((position: number): void => {
    engineRef.current.seek(position);
  }, []);

  /**
   * Set volume
   */
  const setVolumeHandler = useCallback((vol: number): void => {
    setVolume(vol);
    engineRef.current.setVolume(vol);
  }, []);

  /**
   * Toggle mute
   */
  const toggleMute = useCallback((): void => {
    const muted = !isMuted;
    setIsMuted(muted);
    engineRef.current.toggleMute();
  }, [isMuted]);

  /**
   * Set playback mode
   */
  const setMode = useCallback((mode: PlaybackMode): void => {
    engineRef.current.setMode(mode);
  }, []);

  /**
   * Clear queue
   */
  const clearQueue = useCallback((): void => {
    engineRef.current.clearQueue();
    setCurrentTrack(null);
    setQueue([]);
  }, []);

  return {
    // State
    currentTrack,
    queue,
    isPlaying,
    isMuted,
    progress,
    duration,
    volume,

    // Methods
    loadTrack,
    play,
    pause,
    stop,
    seek,
    setVolumeHandler,
    toggleMute,
    setMode,
    clearQueue,
  };
}
