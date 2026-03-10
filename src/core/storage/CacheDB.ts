import { openDB, IDBPDatabase } from 'idb'

const DB_NAME = 'CloudMusicPlayerCacheDB'
const DB_VERSION = 1
const CACHES_STORE = 'caches'

interface CacheEntry {
  key: string
  value: any
  timestamp: number
}

interface CacheDB {
  caches: IDBMap<string, CacheEntry>
}

class CacheDBService {
  private db: IDBPDatabase<CacheDB> | null = null

  async init(): Promise<void> {
    this.db = await openDB<CacheDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(CACHES_STORE)) {
          const store = db.createObjectStore(CACHES_STORE, {
            keyPath: 'key',
          })
          store.createIndex('timestamp', 'timestamp', { unique: false })
        }
      },
    })
  }

  /**
   * Get cached value
   */
  async get(key: string): Promise<any> {
    if (!this.db) {
      await this.init()
    }

    const entry = await this.db!.get(CACHES_STORE, key)
    return entry?.value || null
  }

  /**
   * Set cached value
   */
  async set(key: string, value: any): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    const entry: CacheEntry = {
      key,
      value,
      timestamp: Date.now(),
    }

    await this.db!.put(CACHES_STORE, entry)
  }

  /**
   * Delete cached value
   */
  async delete(key: string): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    await this.db!.delete(CACHES_STORE, key)
  }

  /**
   * Clear all caches
   */
  async clear(): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    await this.db!.clear(CACHES_STORE)
  }

  /**
   * Clear expired caches
   */
  async clearExpired(expirationMs: number): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    const tx = this.db!.transaction(CACHES_STORE, 'readwrite')
    const index = tx.store.index('timestamp')
    const now = Date.now()

    // Get all entries
    const entries = await index.getAll()

    // Filter out expired entries
    const validEntries = entries.filter((entry) => now - entry.timestamp < expirationMs)

    // Delete expired entries
    for (const entry of entries) {
      if (now - entry.timestamp >= expirationMs) {
        await tx.store.delete(entry.key)
      }
    }

    await tx.done
  }

  /**
   * Get cache size (estimate)
   */
  async getCacheSize(): Promise<number> {
    if (!this.db) {
      await this.init()
    }

    const tx = this.db!.transaction(CACHES_STORE, 'readonly')
    const count = await tx.store.count()
    return count
  }

  /**
   * Clear all (force)
   */
  async reset(): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    await this.db!.clear(CACHES_STORE)
  }
}

export const cacheDBService = new CacheDBService()
