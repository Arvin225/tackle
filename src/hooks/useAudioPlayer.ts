import { useState, useCallback, useEffect, useRef } from "react";
import { AudioEngine, Track } from "../core/audio/AudioEngine";
import { PlaybackMode } from "../core/audio/types";

export function useAudioPlayer() {
  const engineRef = useRef<AudioEngine>(new AudioEngine());

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  // Initialize engine
  useEffect(() => {
    const engine = engineRef.current;

    // Add event listeners
    const unsubscribeState = engine.onStateChange(state => {
      setIsPlaying(state === "PLAYING");
    });

    const unsubscribeProgress = engine.onProgress((position: number) => {
      setProgress(position);
      setCurrentTime(position);
      // Duration is set when track loads
    });

    const unsubscribeEnd = engine.onEnd(() => {
      // Handle track end
      console.log("Track ended");
    });

    return () => {
      unsubscribeState();
      unsubscribeProgress();
      unsubscribeEnd();
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
      // Get duration from engine
      const duration = engineRef.current.getDuration();
      setDuration(duration);
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
    currentTime,
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
