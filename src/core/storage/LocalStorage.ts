export interface LocalStorageData {
  playlists: PlaylistData[];
  favorites: string[];
  playbackState: PlaybackStateData;
  settings: SettingsData;
  webdavConfig?: WebDAVConfigData;
}

export interface WebDAVConfigData {
  serverUrl: string;
  username?: string;
  token?: string;
  lastConnected?: number;
  autoConnect?: boolean;
}

export interface PlaylistData {
  id: string;
  name: string;
  tracks: string[];
  createdAt: number;
  updatedAt: number;
}

export interface PlaybackStateData {
  lastTrackId?: string;
  lastPosition?: number;
  lastVolume?: number;
}

export interface SettingsData {
  theme: "light" | "dark";
  autoSync: boolean;
  defaultPlaybackMode: string;
  syncInterval?: number;
}

const STORAGE_KEY = "cloud-music-player-data";

/**
 * Local Storage Service
 */
export class LocalStorageService {
  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const testKey = "__test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn("localStorage is not available:", error);
      return false;
    }
  }

  /**
   * Get all data from localStorage
   */
  static getData(): LocalStorageData {
    // Check if localStorage is available
    if (!this.isAvailable()) {
      console.warn("localStorage is not available, returning default data");
      return this.getDefaultData();
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsedData = JSON.parse(data);
        // Validate data structure
        return this.validateAndMigrateData(parsedData);
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }

    // Return default data
    return this.getDefaultData();
  }

  /**
   * Get default data structure
   */
  private static getDefaultData(): LocalStorageData {
    return {
      playlists: [],
      favorites: [],
      playbackState: {},
      settings: {
        theme: "light",
        autoSync: true,
        defaultPlaybackMode: "SEQUENTIAL",
      },
      webdavConfig: undefined,
    };
  }

  /**
   * Validate and migrate data if needed
   */
  private static validateAndMigrateData(data: any): LocalStorageData {
    const defaultData = this.getDefaultData();

    // Ensure all required fields exist
    const validatedData: LocalStorageData = {
      playlists: Array.isArray(data.playlists) ? data.playlists : defaultData.playlists,
      favorites: Array.isArray(data.favorites) ? data.favorites : defaultData.favorites,
      playbackState:
        data.playbackState && typeof data.playbackState === "object"
          ? { ...defaultData.playbackState, ...data.playbackState }
          : defaultData.playbackState,
      settings:
        data.settings && typeof data.settings === "object"
          ? { ...defaultData.settings, ...data.settings }
          : defaultData.settings,
      webdavConfig:
        data.webdavConfig && typeof data.webdavConfig === "object"
          ? this.validateWebDAVConfigStructure(data.webdavConfig)
          : undefined,
    };

    return validatedData;
  }

  /**
   * Validate WebDAV configuration data structure
   */
  private static validateWebDAVConfigStructure(config: any): WebDAVConfigData | undefined {
    if (!config || typeof config !== "object") {
      return undefined;
    }

    // Basic validation
    if (!config.serverUrl || typeof config.serverUrl !== "string") {
      return undefined;
    }

    const validatedConfig: WebDAVConfigData = {
      serverUrl: config.serverUrl,
    };

    // Optional fields
    if (config.username && typeof config.username === "string") {
      validatedConfig.username = config.username;
    }

    if (config.token && typeof config.token === "string") {
      validatedConfig.token = config.token;
    }

    if (typeof config.lastConnected === "number") {
      validatedConfig.lastConnected = config.lastConnected;
    }

    if (typeof config.autoConnect === "boolean") {
      validatedConfig.autoConnect = config.autoConnect;
    }

    return validatedConfig;
  }

  /**
   * Save all data to localStorage
   */
  static saveData(data: LocalStorageData): boolean {
    // Check if localStorage is available
    if (!this.isAvailable()) {
      console.error("Cannot save data: localStorage is not available");
      return false;
    }

    try {
      // Validate data before saving
      const validatedData = this.validateAndMigrateData(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedData));
      return true;
    } catch (error) {
      console.error("Failed to save to localStorage:", error);

      // Try to save with fallback (remove large data if any)
      try {
        const fallbackData = {
          ...data,
          // Remove potentially large data
          playlists: data.playlists.slice(0, 10), // Keep only first 10 playlists
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackData));
        console.warn("Saved with fallback strategy (reduced data size)");
        return true;
      } catch (fallbackError) {
        console.error("Fallback save also failed:", fallbackError);
        return false;
      }
    }
  }

  /**
   * Save playlists
   */
  static savePlaylists(playlists: PlaylistData[]): void {
    const data = this.getData();
    data.playlists = playlists;
    this.saveData(data);
  }

  /**
   * Get playlists
   */
  static getPlaylists(): PlaylistData[] {
    return this.getData().playlists;
  }

  /**
   * Get playlist by ID
   */
  static getPlaylist(id: string): PlaylistData | undefined {
    return this.getData().playlists.find(p => p.id === id);
  }

  /**
   * Create playlist
   */
  static createPlaylist(name: string, tracks: string[] = []): PlaylistData {
    const data = this.getData();
    const playlist: PlaylistData = {
      id: this.generateId(),
      name,
      tracks,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    data.playlists.push(playlist);
    this.saveData(data);
    return playlist;
  }

  /**
   * Update playlist
   */
  static updatePlaylist(id: string, updates: Partial<PlaylistData>): void {
    const data = this.getData();
    const playlist = data.playlists.find(p => p.id === id);
    if (playlist) {
      Object.assign(playlist, updates, { updatedAt: Date.now() });
      this.saveData(data);
    }
  }

  /**
   * Delete playlist
   */
  static deletePlaylist(id: string): void {
    const data = this.getData();
    data.playlists = data.playlists.filter(p => p.id !== id);
    this.saveData(data);
  }

  /**
   * Save favorites
   */
  static saveFavorites(favorites: string[]): void {
    const data = this.getData();
    data.favorites = favorites;
    this.saveData(data);
  }

  /**
   * Get favorites
   */
  static getFavorites(): string[] {
    return this.getData().favorites;
  }

  /**
   * Add to favorites
   */
  static addToFavorites(trackId: string): void {
    const data = this.getData();
    if (!data.favorites.includes(trackId)) {
      data.favorites.push(trackId);
      this.saveData(data);
    }
  }

  /**
   * Remove from favorites
   */
  static removeFromFavorites(trackId: string): void {
    const data = this.getData();
    data.favorites = data.favorites.filter(id => id !== trackId);
    this.saveData(data);
  }

  /**
   * Is favorited?
   */
  static isFavorited(trackId: string): boolean {
    return this.getData().favorites.includes(trackId);
  }

  /**
   * Save playback state
   */
  static savePlaybackState(state: PlaybackStateData): void {
    const data = this.getData();
    data.playbackState = { ...data.playbackState, ...state };
    this.saveData(data);
  }

  /**
   * Get playback state
   */
  static getPlaybackState(): PlaybackStateData {
    return this.getData().playbackState;
  }

  /**
   * Save settings
   */
  static saveSettings(settings: SettingsData): void {
    const data = this.getData();
    data.settings = { ...data.settings, ...settings };
    this.saveData(data);
  }

  /**
   * Get settings
   */
  static getSettings(): SettingsData {
    return this.getData().settings;
  }

  /**
   * Save WebDAV configuration
   */
  static saveWebDAVConfig(config: WebDAVConfigData): { success: boolean; error?: string } {
    try {
      // Validate configuration
      const validation = this.validateWebDAVConfig(config);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(", "),
        };
      }

      // Sanitize configuration
      const sanitizedConfig = this.sanitizeWebDAVConfig(config);

      const data = this.getData();
      data.webdavConfig = sanitizedConfig;
      const saved = this.saveData(data);

      return {
        success: saved,
        error: saved ? undefined : "Failed to save configuration to storage",
      };
    } catch (error) {
      console.error("Error saving WebDAV configuration:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get WebDAV configuration
   */
  static getWebDAVConfig(): WebDAVConfigData | undefined {
    return this.getData().webdavConfig;
  }

  /**
   * Update WebDAV configuration
   */
  static updateWebDAVConfig(updates: Partial<WebDAVConfigData>): void {
    const data = this.getData();
    data.webdavConfig = { ...data.webdavConfig, ...updates } as WebDAVConfigData;
    this.saveData(data);
  }

  /**
   * Delete WebDAV configuration
   */
  static deleteWebDAVConfig(): void {
    const data = this.getData();
    data.webdavConfig = undefined;
    this.saveData(data);
  }

  /**
   * Check if WebDAV is configured
   */
  static isWebDAVConfigured(): boolean {
    const config = this.getWebDAVConfig();
    return !!config && !!config.serverUrl;
  }

  /**
   * Validate WebDAV configuration
   */
  static validateWebDAVConfig(config: WebDAVConfigData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.serverUrl) {
      errors.push("Server URL is required");
    } else if (
      !config.serverUrl.startsWith("http://") &&
      !config.serverUrl.startsWith("https://")
    ) {
      errors.push("Server URL must start with http:// or https://");
    }

    if (config.serverUrl && config.serverUrl.length > 500) {
      errors.push("Server URL is too long (max 500 characters)");
    }

    if (config.username && config.username.length > 100) {
      errors.push("Username is too long (max 100 characters)");
    }

    if (config.token && config.token.length > 1000) {
      errors.push("Token is too long (max 1000 characters)");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize WebDAV configuration
   */
  static sanitizeWebDAVConfig(config: WebDAVConfigData): WebDAVConfigData {
    const sanitized: WebDAVConfigData = {
      serverUrl: config.serverUrl?.trim() || "",
      username: config.username?.trim(),
      token: config.token?.trim(),
      lastConnected: config.lastConnected,
      autoConnect: config.autoConnect,
    };

    // Ensure server URL ends without trailing slash
    if (sanitized.serverUrl.endsWith("/")) {
      sanitized.serverUrl = sanitized.serverUrl.slice(0, -1);
    }

    return sanitized;
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
