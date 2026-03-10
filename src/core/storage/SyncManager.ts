import { WebDAVService } from '../webdav/WebDAVClient'
import { LocalStorageService } from './LocalStorage'

export interface SyncConfig {
  enabled: boolean
  autoSync: boolean
  syncInterval?: number // in milliseconds
}

export interface SyncResult {
  success: boolean
  message: string
  timestamp: number
}

export interface SyncConflict {
  key: string
  local: any
  remote: any
  resolution: 'local' | 'remote'
}

export class SyncManager {
  private webDAVService: WebDAVService
  private config: SyncConfig
  private syncIntervalId: number | null = null
  private pendingSyncs: Set<string> = new Set()

  constructor(webDAVService: WebDAVService) {
    this.webDAVService = webDAVService
    this.config = {
      enabled: true,
      autoSync: true,
    }
  }

  /**
   * Enable sync
   */
  enable(): void {
    this.config.enabled = true
    this.startAutoSync()
  }

  /**
   * Disable sync
   */
  disable(): void {
    this.config.enabled = false
    this.stopAutoSync()
  }

  /**
   * Start automatic sync
   */
  startAutoSync(): void {
    if (!this.config.enabled || !this.config.autoSync) {
      return
    }

    this.stopAutoSync()

    this.syncIntervalId = window.setInterval(() => {
      this.sync()
    }, this.config.syncInterval || 60000) // Default: 1 minute
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncIntervalId !== null) {
      clearInterval(this.syncIntervalId)
      this.syncIntervalId = null
    }
  }

  /**
   * Sync local data to WebDAV
   */
  async sync(): Promise<SyncResult> {
    if (!this.webDAVService.isConnected()) {
      return {
        success: false,
        message: 'Not connected to WebDAV',
        timestamp: Date.now(),
      }
    }

    try {
      const playlists = LocalStorageService.getPlaylists()
      const favorites = LocalStorageService.getFavorites()
      const settings = LocalStorageService.getSettings()
      const playbackState = LocalStorageService.getPlaybackState()

      const syncData = {
        playlists,
        favorites,
        settings,
        playbackState,
        syncTimestamp: Date.now(),
      }

      // Upload to WebDAV
      const path = '/music-player-data/sync.json'
      const jsonStr = JSON.stringify(syncData, null, 2)

      // Convert string to ArrayBuffer
      const encoder = new TextEncoder()
      const arrayBuffer = encoder.encode(jsonStr)

      await this.webDAVService.uploadFile(path, arrayBuffer)

      return {
        success: true,
        message: 'Sync successful',
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error('Sync failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Sync failed',
        timestamp: Date.now(),
      }
    }
  }

  /**
   * Pull data from WebDAV to local
   */
  async pull(): Promise<SyncResult> {
    if (!this.webDAVService.isConnected()) {
      return {
        success: false,
        message: 'Not connected to WebDAV',
        timestamp: Date.now(),
      }
    }

    try {
      const path = '/music-player-data/sync.json'

      // Download from WebDAV
      const arrayBuffer = await this.webDAVService.downloadFile(path)

      // Convert ArrayBuffer to string
      const decoder = new TextDecoder()
      const jsonStr = decoder.decode(arrayBuffer)

      const syncData = JSON.parse(jsonStr)

      // Merge with local data
      this.resolveConflicts(syncData)

      return {
        success: true,
        message: 'Pull successful',
        timestamp: Date.now(),
      }
    } catch (error) {
      // File doesn't exist yet (first sync)
      if (error instanceof Error && error.message.includes('404')) {
        return {
          success: true,
          message: 'No remote data found (first sync)',
          timestamp: Date.now(),
        }
      }

      console.error('Pull failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Pull failed',
        timestamp: Date.now(),
      }
    }
  }

  /**
   * Resolve conflicts between local and remote data
   */
  private resolveConflicts(remoteData: any): void {
    // Playlists
    if (remoteData.playlists) {
      LocalStorageService.savePlaylists(remoteData.playlists)
    }

    // Favorites
    if (remoteData.favorites) {
      LocalStorageService.saveFavorites(remoteData.favorites)
    }

    // Settings
    if (remoteData.settings) {
      LocalStorageService.saveSettings(remoteData.settings)
    }

    // Playback state
    if (remoteData.playbackState) {
      LocalStorageService.savePlaybackState(remoteData.playbackState)
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(): SyncConfig {
    return { ...this.config }
  }

  /**
   * Set sync interval
   */
  setSyncInterval(intervalMs: number): void {
    this.config.syncInterval = intervalMs
    this.startAutoSync()
  }
}
