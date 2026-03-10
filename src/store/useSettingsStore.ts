import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'

interface SettingsState {
  theme: ThemeMode
  autoSync: boolean
  defaultPlaybackMode: PlaybackMode
  syncInterval: number
  showAlbumCovers: boolean
  showLyrics: boolean
  equalizer: EqualizerSettings

  // Actions
  setTheme: (theme: ThemeMode) => void
  setAutoSync: (autoSync: boolean) => void
  setDefaultPlaybackMode: (mode: PlaybackMode) => void
  setSyncInterval: (interval: number) => void
  setShowAlbumCovers: (show: boolean) => void
  setShowLyrics: (show: boolean) => void
  setEqualizer: (equalizer: EqualizerSettings) => void
  resetSettings: () => void
}

export interface EqualizerSettings {
  bass: number
  mid: number
  treble: number
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      autoSync: true,
      defaultPlaybackMode: 'SEQUENTIAL',
      syncInterval: 60000,
      showAlbumCovers: true,
      showLyrics: true,
      equalizer: {
        bass: 0,
        mid: 0,
        treble: 0,
      },

      setTheme: (theme) => set({ theme }),
      setAutoSync: (autoSync) => set({ autoSync }),
      setDefaultPlaybackMode: (mode) => set({ defaultPlaybackMode: mode }),
      setSyncInterval: (interval) => set({ syncInterval: interval }),
      setShowAlbumCovers: (show) => set({ showAlbumCovers: show }),
      setShowLyrics: (show) => set({ showLyrics: show }),
      setEqualizer: (equalizer) => set({ equalizer }),
      resetSettings: () =>
        set({
          theme: 'light',
          autoSync: true,
          defaultPlaybackMode: 'SEQUENTIAL',
          syncInterval: 60000,
          showAlbumCovers: true,
          showLyrics: true,
          equalizer: { bass: 0, mid: 0, treble: 0 },
        }),
    }),
    {
      name: 'settings-storage',
    }
  )
)
