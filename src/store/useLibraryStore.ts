import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TrackItem {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  coverUrl?: string
  url: string
  format: string
}

interface LibraryState {
  tracks: TrackItem[]
  artists: string[]
  albums: string[]
  favorites: string[]
  searchQuery: string

  // Actions
  setTracks: (tracks: TrackItem[]) => void
  addTracks: (tracks: TrackItem[]) => void
  removeTracks: (trackIds: string[]) => void
  setArtistList: (artists: string[]) => void
  setAlbumList: (albums: string[]) => void
  toggleFavorite: (trackId: string) => void
  setSearchQuery: (query: string) => void
  getFilteredTracks: () => TrackItem[]
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      tracks: [],
      artists: [],
      albums: [],
      favorites: new Set() as any,
      searchQuery: '',

      setTracks: (tracks) =>
        set({
          tracks,
          artists: Array.from(new Set(tracks.map((t) => t.artist))),
          albums: Array.from(new Set(tracks.map((t) => t.album))),
        }),
      addTracks: (tracks) => {
        const currentTracks = get().tracks
        const newTracks = tracks.filter(
          (t) => !currentTracks.find((ct) => ct.id === t.id)
        )
        set({
          tracks: [...currentTracks, ...newTracks],
          artists: Array.from(
            new Set([...get().artists, ...newTracks.map((t) => t.artist)])
          ),
          albums: Array.from(
            new Set([...get().albums, ...newTracks.map((t) => t.album)])
          ),
        })
      },
      removeTracks: (trackIds) =>
        set((state) => ({
          tracks: state.tracks.filter((t) => !trackIds.includes(t.id)),
        })),
      setArtistList: (artists) => set({ artists }),
      setAlbumList: (albums) => set({ albums }),
      toggleFavorite: (trackId) =>
        set((state) => {
          const favorites = new Set(state.favorites as Set<string>)
          if (favorites.has(trackId)) {
            favorites.delete(trackId)
          } else {
            favorites.add(trackId)
          }
          return { favorites: Array.from(favorites) as any }
        }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      getFilteredTracks: () => {
        const state = get()
        if (!state.searchQuery) return state.tracks
        const query = state.searchQuery.toLowerCase()
        return state.tracks.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.artist.toLowerCase().includes(query) ||
            t.album.toLowerCase().includes(query)
        )
      },
    }),
    {
      name: 'library-storage',
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
)
