import { useState, useCallback, useEffect } from "react";
import { WebDAVService, WebDAVConfig, DirectoryListingItem } from "../core/webdav/WebDAVClient";
import { LocalStorageService, WebDAVConfigData } from "../core/storage/LocalStorage";
import { useAppStore } from "../store/useAppStore";

export function useWebDAV() {
  const [service] = useState(() => new WebDAVService());
  const [connected, setConnected] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [directoryContents, setDirectoryContents] = useState<DirectoryListingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedConfig, setSavedConfig] = useState<WebDAVConfigData | undefined>(undefined);

  const setWebDAVConfigured = useAppStore(state => state.setWebDAVConfigured);

  // Load saved configuration on mount
  useEffect(() => {
    const config = LocalStorageService.getWebDAVConfig();
    setSavedConfig(config);
    if (config && config.autoConnect && config.serverUrl) {
      setWebDAVConfigured(true);
    }
  }, [setWebDAVConfigured]);

  /**
   * Connect to WebDAV server
   */
  const connect = useCallback(
    async (config: WebDAVConfig): Promise<boolean> => {
      try {
        setError(null);
        setLoading(true);

        // Validate and sanitize config
        const sanitizedConfig = LocalStorageService.sanitizeWebDAVConfig(config);
        const validation = LocalStorageService.validateWebDAVConfig(sanitizedConfig);

        if (!validation.valid) {
          setError(validation.errors.join(", "));
          return false;
        }

        await service.connect(config);
        setConnected(true);
        setCurrentPath("/");

        // Save configuration
        const configToSave: WebDAVConfigData = {
          ...sanitizedConfig,
          lastConnected: Date.now(),
          autoConnect: true,
        };

        const saveResult = LocalStorageService.saveWebDAVConfig(configToSave);
        if (!saveResult.success) {
          setError(`Failed to save configuration: ${saveResult.error}`);
          // Still consider connected for current session
          setConnected(true);
          setCurrentPath("/");
          setSavedConfig(configToSave);
          setWebDAVConfigured(true);
          return true;
        }

        setSavedConfig(configToSave);
        setWebDAVConfigured(true);

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
        setConnected(false);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [service, setWebDAVConfigured]
  );

  /**
   * Disconnect from WebDAV server
   */
  const disconnect = useCallback(async (): Promise<void> => {
    await service.disconnect();
    setConnected(false);
    setCurrentPath("/");
    setDirectoryContents([]);
    setError(null);
  }, [service]);

  /**
   * Save connection configuration
   */
  const saveConnection = useCallback(
    (config: WebDAVConfig): void => {
      const sanitizedConfig = LocalStorageService.sanitizeWebDAVConfig(config);
      const validation = LocalStorageService.validateWebDAVConfig(sanitizedConfig);

      if (!validation.valid) {
        throw new Error(validation.errors.join(", "));
      }

      const configToSave: WebDAVConfigData = {
        ...sanitizedConfig,
        lastConnected: savedConfig?.lastConnected,
      };

      const saveResult = LocalStorageService.saveWebDAVConfig(configToSave);
      if (!saveResult.success) {
        throw new Error(`Failed to save configuration: ${saveResult.error}`);
      }

      setSavedConfig(configToSave);
      setWebDAVConfigured(true);
    },
    [savedConfig, setWebDAVConfigured]
  );

  /**
   * Delete saved configuration
   */
  const deleteConnection = useCallback((): void => {
    try {
      LocalStorageService.deleteWebDAVConfig();
      setSavedConfig(undefined);
      setWebDAVConfigured(false);
      setConnected(false);
      setCurrentPath("/");
      setDirectoryContents([]);
      setError(null);
    } catch (error) {
      console.error("Failed to delete WebDAV configuration:", error);
      setError("Failed to delete configuration. Please try again.");
    }
  }, [setWebDAVConfigured]);

  /**
   * Test connection without saving
   */
  const testConnection = useCallback(async (config: WebDAVConfig): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      const sanitizedConfig = LocalStorageService.sanitizeWebDAVConfig(config);
      const validation = LocalStorageService.validateWebDAVConfig(sanitizedConfig);

      if (!validation.valid) {
        setError(validation.errors.join(", "));
        return false;
      }

      const tempService = new WebDAVService();
      await tempService.connect(config);
      await tempService.disconnect();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection test failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Navigate to parent directory
   */
  const navigateUp = useCallback(async (): Promise<void> => {
    const newPath = currentPath.split("/").filter(Boolean).slice(0, -1).join("/") || "/";
    setCurrentPath(newPath);
    await loadDirectory(newPath);
  }, [currentPath]);

  /**
   * Navigate to specific directory
   */
  const navigateTo = useCallback(async (path: string): Promise<void> => {
    setCurrentPath(path);
    await loadDirectory(path);
  }, []);

  /**
   * Load directory contents
   */
  const loadDirectory = useCallback(
    async (path: string = currentPath): Promise<void> => {
      if (!connected) {
        setError("Not connected to WebDAV server");
        return;
      }

      try {
        setError(null);
        setLoading(true);
        const contents = await service.listDirectory(path);
        setDirectoryContents(contents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load directory");
      } finally {
        setLoading(false);
      }
    },
    [connected, currentPath, service]
  );

  /**
   * Get current connection state
   */
  const getConnectionState = useCallback((): { connected: boolean } => {
    return { connected };
  }, []);

  return {
    // State
    connected,
    loading,
    currentPath,
    directoryContents,
    error,
    savedConfig,

    // Methods
    connect,
    disconnect,
    navigateUp,
    navigateTo,
    loadDirectory,
    getConnectionState,
    saveConnection,
    deleteConnection,
    testConnection,
  };
}
