import { useState, useCallback, useEffect } from 'react'
import { WebDAVService, WebDAVConfig, DirectoryListingItem } from '../webdav'

export function useWebDAV() {
  const [service] = useState(() => new WebDAVService())
  const [connected, setConnected] = useState(false)
  const [currentPath, setCurrentPath] = useState<string>('/')
  const [directoryContents, setDirectoryContents] = useState<DirectoryListingItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Connect to WebDAV server
   */
  const connect = useCallback(async (config: WebDAVConfig): Promise<boolean> => {
    try {
      setError(null)
      setLoading(true)
      await service.connect(config)
      setConnected(true)
      setCurrentPath('/')
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed')
      setConnected(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [service])

  /**
   * Disconnect from WebDAV server
   */
  const disconnect = useCallback(async (): Promise<void> => {
    await service.disconnect()
    setConnected(false)
    setCurrentPath('/')
    setDirectoryContents([])
    setError(null)
  }, [service])

  /**
   * Navigate to parent directory
   */
  const navigateUp = useCallback(async (): Promise<void> => {
    const newPath = currentPath.split('/').filter(Boolean).slice(0, -1).join('/') || '/'
    setCurrentPath(newPath)
    await loadDirectory(newPath)
  }, [currentPath])

  /**
   * Navigate to specific directory
   */
  const navigateTo = useCallback(
    async (path: string): Promise<void> => {
      setCurrentPath(path)
      await loadDirectory(path)
    },
    []
  )

  /**
   * Load directory contents
   */
  const loadDirectory = useCallback(
    async (path: string = currentPath): Promise<void> => {
      if (!connected) {
        setError('Not connected to WebDAV server')
        return
      }

      try {
        setError(null)
        setLoading(true)
        const contents = await service.listDirectory(path)
        setDirectoryContents(contents)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load directory')
      } finally {
        setLoading(false)
      }
    },
    [connected, currentPath, service]
  )

  /**
   * Get current connection state
   */
  const getConnectionState = useCallback((): { connected: boolean } => {
    return { connected }
  }, [])

  return {
    // State
    connected,
    loading,
    currentPath,
    directoryContents,
    error,

    // Methods
    connect,
    disconnect,
    navigateUp,
    navigateTo,
    loadDirectory,
    getConnectionState,
  }
}
