import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Track, AudioFormat } from "../../core/audio/types";

interface LibraryState {
  tracks: Track[];
  artists: string[];
  albums: string[];
  favorites: string[];
  searchQuery: string;

  // Actions
  setTracks: (tracks: Track[]) => void;
  addTracks: (tracks: Track[]) => void;
  removeTracks: (trackIds: string[]) => void;
  setArtistList: (artists: string[]) => void;
  setAlbumList: (albums: string[]) => void;
  toggleFavorite: (trackId: string) => void;
  setSearchQuery: (query: string) => void;
  getFilteredTracks: () => Track[];
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      tracks: [],
      artists: [],
      albums: [],
      favorites: [],
      searchQuery: "",

      setTracks: tracks =>
        set({
          tracks,
          artists: Array.from(new Set(tracks.map(t => t.artist || "Unknown Artist"))),
          albums: Array.from(new Set(tracks.map(t => t.album || "Unknown Album"))),
        }),
      addTracks: tracks => {
        const currentTracks = get().tracks;
        const newTracks = tracks.filter(t => !currentTracks.find(ct => ct.id === t.id));
        set({
          tracks: [...currentTracks, ...newTracks],
          artists: Array.from(
            new Set([...get().artists, ...newTracks.map(t => t.artist || "Unknown Artist")])
          ),
          albums: Array.from(
            new Set([...get().albums, ...newTracks.map(t => t.album || "Unknown Album")])
          ),
        });
      },
      removeTracks: trackIds =>
        set(state => ({
          tracks: state.tracks.filter(t => !trackIds.includes(t.id)),
        })),
      setArtistList: artists => set({ artists }),
      setAlbumList: albums => set({ albums }),
      toggleFavorite: trackId =>
        set(state => {
          const favorites = state.favorites.filter(id => id !== trackId);
          if (!favorites.includes(trackId)) {
            favorites.push(trackId);
          }
          return { favorites };
        }),
      setSearchQuery: query => set({ searchQuery: query }),
      getFilteredTracks: () => {
        const state = get();
        if (!state.searchQuery) return state.tracks;
        const query = state.searchQuery.toLowerCase();
        return state.tracks.filter(
          t =>
            (t.title && t.title.toLowerCase().includes(query)) ||
            (t.artist && t.artist.toLowerCase().includes(query)) ||
            (t.album && t.album.toLowerCase().includes(query))
        );
      },
    }),
    {
      name: "library-storage",
      partialize: state => ({
        favorites: state.favorites,
      }),
    }
  )
);
