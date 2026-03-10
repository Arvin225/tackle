import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Track, PlaybackMode } from '../../core/audio/types'

interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  isMuted: boolean
  volume: number
  playbackMode: PlaybackMode

  // Actions
  setCurrentTrack: (track: Track) => void
  addToQueue: (track: Track) => void
  setQueue: (tracks: Track[]) => void
  clearQueue: () => void
  play: () => void
  pause: () => void
  stop: () => void
  togglePlay: () => void
  toggleMute: () => void
  setVolume: (volume: number) => void
  setPlaybackMode: (mode: PlaybackMode) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentTrack: null,
      queue: [],
      isPlaying: false,
      isMuted: false,
      volume: 1,
      playbackMode: PlaybackMode.SEQUENTIAL,

      setCurrentTrack: (track) => set({ currentTrack: track }),
      addToQueue: (track) =>
        set((state) => ({ queue: [...state.queue, track] })),
      setQueue: (tracks) => set({ queue: tracks }),
      clearQueue: () => set({ queue: [], currentTrack: null }),
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      stop: () => set({ isPlaying: false, currentTrack: null }),
      togglePlay: () =>
        set((state) => ({ isPlaying: !state.isPlaying })),
      toggleMute: () =>
        set((state) => ({ isMuted: !state.isMuted })),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setPlaybackMode: (mode) => set({ playbackMode: mode }),
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        currentTrack: state.currentTrack,
        volume: state.volume,
        playbackMode: state.playbackMode,
      }),
    }
  )
)
