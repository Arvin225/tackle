import { useState, useCallback } from "react";
import { WebDAVService } from "../core/webdav/WebDAVClient";
import { SyncManager, SyncResult } from "../core/storage/SyncManager";
import { LocalStorageService } from "../core/storage/LocalStorage";

interface SyncState {
  enabled: boolean;
  autoSync: boolean;
  lastSync?: number;
  lastSyncMessage?: string;
  isSyncing: boolean;
}

export function useSync(webDAVService: WebDAVService) {
  const [syncState, setSyncState] = useState<SyncState>({
    enabled: true,
    autoSync: true,
    isSyncing: false,
  });

  const syncManager = new SyncManager(webDAVService);

  /**
   * Enable/disable sync
   */
  const setSyncEnabled = useCallback(
    (enabled: boolean): void => {
      if (enabled) {
        syncManager.enable();
      } else {
        syncManager.disable();
      }
      setSyncState(prev => ({ ...prev, enabled }));
    },
    [syncManager]
  );

  /**
   * Set auto sync
   */
  const setAutoSync = useCallback(
    (autoSync: boolean): void => {
      syncManager.stopAutoSync();
      // Don't modify syncManager.config directly
      // Instead, update our local state and let syncManager handle it
      if (autoSync) {
        syncManager.startAutoSync();
      }
      setSyncState(prev => ({ ...prev, autoSync }));
    },
    [syncManager]
  );

  /**
   * Sync to WebDAV
   */
  const syncToCloud = useCallback(async (): Promise<SyncResult> => {
    setSyncState(prev => ({ ...prev, isSyncing: true }));

    try {
      const result = await syncManager.sync();
      if (result.success) {
        setSyncState(prev => ({
          ...prev,
          lastSync: result.timestamp,
          lastSyncMessage: result.message,
          isSyncing: false,
        }));
      } else {
        setSyncState(prev => ({ ...prev, isSyncing: false }));
      }
      return result;
    } catch (error) {
      console.error("Sync error:", error);
      setSyncState(prev => ({ ...prev, isSyncing: false }));
      return {
        success: false,
        message: error instanceof Error ? error.message : "Sync failed",
        timestamp: Date.now(),
      };
    }
  }, [syncManager]);

  /**
   * Pull from WebDAV
   */
  const pullFromCloud = useCallback(async (): Promise<SyncResult> => {
    setSyncState(prev => ({ ...prev, isSyncing: true }));

    try {
      const result = await syncManager.pull();
      if (result.success) {
        setSyncState(prev => ({
          ...prev,
          lastSync: result.timestamp,
          lastSyncMessage: result.message,
          isSyncing: false,
        }));
      } else {
        setSyncState(prev => ({ ...prev, isSyncing: false }));
      }
      return result;
    } catch (error) {
      console.error("Pull error:", error);
      setSyncState(prev => ({ ...prev, isSyncing: false }));
      return {
        success: false,
        message: error instanceof Error ? error.message : "Pull failed",
        timestamp: Date.now(),
      };
    }
  }, [syncManager]);

  /**
   * Get sync status
   */
  const getSyncStatus = useCallback((): SyncState => {
    const config = syncManager.getSyncStatus();
    return {
      enabled: config.enabled,
      autoSync: config.autoSync,
      lastSync: syncState.lastSync,
      lastSyncMessage: syncState.lastSyncMessage,
      isSyncing: syncState.isSyncing,
    };
  }, [syncManager, syncState]);

  /**
   * Set sync interval
   */
  const setSyncInterval = useCallback(
    (intervalMs: number): void => {
      syncManager.setSyncInterval(intervalMs);
    },
    [syncManager]
  );

  /**
   * Get storage info
   */
  const getStorageInfo = useCallback((): { playlists: number; favorites: number } => {
    const playlists = LocalStorageService.getPlaylists().length;
    const favorites = LocalStorageService.getFavorites().length;
    return { playlists, favorites };
  }, []);

  return {
    // State
    ...syncState,
    ...getSyncStatus(),

    // Methods
    setSyncEnabled,
    setAutoSync,
    syncToCloud,
    pullFromCloud,
    setSyncInterval,
    getStorageInfo,
  };
}
