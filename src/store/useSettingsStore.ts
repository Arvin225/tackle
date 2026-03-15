import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PlaybackMode } from "../core/audio/types";

export type ThemeMode = "light" | "dark" | "system";

interface SettingsState {
  theme: ThemeMode;
  autoSync: boolean;
  defaultPlaybackMode: PlaybackMode;
  syncInterval: number;
  showAlbumCovers: boolean;
  showLyrics: boolean;
  equalizer: EqualizerSettings;
  volume: number;
  crossfade: number;
  gaplessPlayback: boolean;
  preloadAhead: number;
  sync: boolean;
  syncOnStartup: boolean;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  setAutoSync: (autoSync: boolean) => void;
  setDefaultPlaybackMode: (mode: PlaybackMode) => void;
  setSyncInterval: (interval: number) => void;
  setShowAlbumCovers: (show: boolean) => void;
  setShowLyrics: (show: boolean) => void;
  setEqualizer: (equalizer: EqualizerSettings) => void;
  setVolume: (volume: number) => void;
  setCrossfade: (crossfade: number) => void;
  setGaplessPlayback: (gaplessPlayback: boolean) => void;
  setPreloadAhead: (preloadAhead: number) => void;
  setSync: (sync: boolean) => void;
  setSyncOnStartup: (syncOnStartup: boolean) => void;
  resetSettings: () => void;
}

export interface EqualizerSettings {
  bass: number;
  mid: number;
  treble: number;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      theme: "system",
      autoSync: true,
      defaultPlaybackMode: PlaybackMode.SEQUENTIAL,
      syncInterval: 60000,
      showAlbumCovers: true,
      showLyrics: true,
      equalizer: {
        bass: 0,
        mid: 0,
        treble: 0,
      },
      volume: 0.8,
      crossfade: 0,
      gaplessPlayback: true,
      preloadAhead: 10,
      sync: true,
      syncOnStartup: true,

      setTheme: theme => set({ theme }),
      setAutoSync: autoSync => set({ autoSync }),
      setDefaultPlaybackMode: mode => set({ defaultPlaybackMode: mode }),
      setSyncInterval: interval => set({ syncInterval: interval }),
      setShowAlbumCovers: show => set({ showAlbumCovers: show }),
      setShowLyrics: show => set({ showLyrics: show }),
      setEqualizer: equalizer => set({ equalizer }),
      setVolume: volume => set({ volume }),
      setCrossfade: crossfade => set({ crossfade }),
      setGaplessPlayback: gaplessPlayback => set({ gaplessPlayback }),
      setPreloadAhead: preloadAhead => set({ preloadAhead }),
      setSync: sync => set({ sync }),
      setSyncOnStartup: syncOnStartup => set({ syncOnStartup }),
      resetSettings: () =>
        set({
          theme: "system",
          autoSync: true,
          defaultPlaybackMode: PlaybackMode.SEQUENTIAL,
          syncInterval: 60000,
          showAlbumCovers: true,
          showLyrics: true,
          equalizer: { bass: 0, mid: 0, treble: 0 },
          volume: 0.8,
          crossfade: 0,
          gaplessPlayback: true,
          preloadAhead: 10,
          sync: true,
          syncOnStartup: true,
        }),
    }),
    {
      name: "settings-storage",
    }
  )
);
