import { openDB, IDBPDatabase } from 'idb'

export interface TrackMetadata {
  id: string
  path: string
  title: string
  artist: string
  album: string
  duration: number
  coverUrl?: string
  lastModified: number
  webdavSource?: string
}

export interface MetadataCache {
  tracks: TrackMetadata[]
  lastUpdated: number
}

const DB_NAME = 'CloudMusicPlayerDB'
const DB_VERSION = 1
const STORE_NAME = 'tracks'

class MetadataDB {
  private db: IDBPDatabase<MetadataCache> | null = null

  async init(): Promise<void> {
    this.db = await openDB<MetadataCache>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('byArtist', 'artist')
          store.createIndex('byAlbum', 'album')
          store.createIndex('byTitle', 'title')
          store.createIndex('byLastModified', 'lastModified')
        }
      },
    })
  }

  /**
   * Save metadata to cache
   */
  async saveMetadata(metadata: TrackMetadata[]): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    const tx = this.db!.transaction(STORE_NAME, 'readwrite')
    const store = tx.store

    for (const item of metadata) {
      await store.put(item)
    }

    await tx.done
  }

  /**
   * Get all tracks
   */
  async getAllTracks(): Promise<TrackMetadata[]> {
    if (!this.db) {
      await this.init()
    }

    return await this.db!.getAllFromIndex(STORE_NAME, 'byTitle')
  }

  /**
   * Get tracks by artist
   */
  async getTracksByArtist(artist: string): Promise<TrackMetadata[]> {
    if (!this.db) {
      await this.init()
    }

    const index = this.db!.index('byArtist')
    return await index.getAll(artist)
  }

  /**
   * Get tracks by album
   */
  async getTracksByAlbum(album: string): Promise<TrackMetadata[]> {
    if (!this.db) {
      await this.init()
    }

    const index = this.db!.index('byAlbum')
    return await index.getAll(album)
  }

  /**
   * Search tracks
   */
  async searchTracks(query: string): Promise<TrackMetadata[]> {
    if (!this.db) {
      await this.init()
    }

    const tx = this.db!.transaction(STORE_NAME, 'readonly')
    const store = tx.store

    const tracks: TrackMetadata[] = []
    await store.openCursor().then(async (cursor) => {
      while (cursor) {
        const track = cursor.value
        if (
          track.title.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase()) ||
          track.album.toLowerCase().includes(query.toLowerCase())
        ) {
          tracks.push(track)
        }
        await cursor.continue()
      }
    })

    return tracks
  }

  /**
   * Update track metadata
   */
  async updateTrack(metadata: TrackMetadata): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    const tx = this.db!.transaction(STORE_NAME, 'readwrite')
    await tx.store.put(metadata)
    await tx.done
  }

  /**
   * Delete track
   */
  async deleteTrack(id: string): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    const tx = this.db!.transaction(STORE_NAME, 'readwrite')
    await tx.store.delete(id)
    await tx.done
  }

  /**
   * Clear all metadata
   */
  async clearAll(): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    const tx = this.db!.transaction(STORE_NAME, 'readwrite')
    await tx.store.clear()
    await tx.done
  }
}

export const metadataDB = new MetadataDB()
