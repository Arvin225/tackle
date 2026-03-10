export interface LocalStorageData {
  playlists: PlaylistData[]
  favorites: string[]
  playbackState: PlaybackStateData
  settings: SettingsData
}

export interface PlaylistData {
  id: string
  name: string
  tracks: string[]
  createdAt: number
  updatedAt: number
}

export interface PlaybackStateData {
  lastTrackId?: string
  lastPosition?: number
  lastVolume?: number
}

export interface SettingsData {
  theme: 'light' | 'dark'
  autoSync: boolean
  defaultPlaybackMode: string
  syncInterval?: number
}

const STORAGE_KEY = 'cloud-music-player-data'

/**
 * Local Storage Service
 */
export class LocalStorageService {
  /**
   * Get all data from localStorage
   */
  static getData(): LocalStorageData {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }

    // Return default data
    return {
      playlists: [],
      favorites: [],
      playbackState: {},
      settings: {
        theme: 'light',
        autoSync: true,
        defaultPlaybackMode: 'SEQUENTIAL',
      },
    }
  }

  /**
   * Save all data to localStorage
   */
  static saveData(data: LocalStorageData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  /**
   * Save playlists
   */
  static savePlaylists(playlists: PlaylistData[]): void {
    const data = this.getData()
    data.playlists = playlists
    this.saveData(data)
  }

  /**
   * Get playlists
   */
  static getPlaylists(): PlaylistData[] {
    return this.getData().playlists
  }

  /**
   * Get playlist by ID
   */
  static getPlaylist(id: string): PlaylistData | undefined {
    return this.getData().playlists.find((p) => p.id === id)
  }

  /**
   * Create playlist
   */
  static createPlaylist(name: string, tracks: string[] = []): PlaylistData {
    const data = this.getData()
    const playlist: PlaylistData = {
      id: this.generateId(),
      name,
      tracks,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    data.playlists.push(playlist)
    this.saveData(data)
    return playlist
  }

  /**
   * Update playlist
   */
  static updatePlaylist(id: string, updates: Partial<PlaylistData>): void {
    const data = this.getData()
    const playlist = data.playlists.find((p) => p.id === id)
    if (playlist) {
      Object.assign(playlist, updates, { updatedAt: Date.now() })
      this.saveData(data)
    }
  }

  /**
   * Delete playlist
   */
  static deletePlaylist(id: string): void {
    const data = this.getData()
    data.playlists = data.playlists.filter((p) => p.id !== id)
    this.saveData(data)
  }

  /**
   * Save favorites
   */
  static saveFavorites(favorites: string[]): void {
    const data = this.getData()
    data.favorites = favorites
    this.saveData(data)
  }

  /**
   * Get favorites
   */
  static getFavorites(): string[] {
    return this.getData().favorites
  }

  /**
   * Add to favorites
   */
  static addToFavorites(trackId: string): void {
    const data = this.getData()
    if (!data.favorites.includes(trackId)) {
      data.favorites.push(trackId)
      this.saveData(data)
    }
  }

  /**
   * Remove from favorites
   */
  static removeFromFavorites(trackId: string): void {
    const data = this.getData()
    data.favorites = data.favorites.filter((id) => id !== trackId)
    this.saveData(data)
  }

  /**
   * Is favorited?
   */
  static isFavorited(trackId: string): boolean {
    return this.getData().favorites.includes(trackId)
  }

  /**
   * Save playback state
   */
  static savePlaybackState(state: PlaybackStateData): void {
    const data = this.getData()
    data.playbackState = { ...data.playbackState, ...state }
    this.saveData(data)
  }

  /**
   * Get playback state
   */
  static getPlaybackState(): PlaybackStateData {
    return this.getData().playbackState
  }

  /**
   * Save settings
   */
  static saveSettings(settings: SettingsData): void {
    const data = this.getData()
    data.settings = { ...data.settings, ...settings }
    this.saveData(data)
  }

  /**
   * Get settings
   */
  static getSettings(): SettingsData {
    return this.getData().settings
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
