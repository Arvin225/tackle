import { createClient as createWebDAVClient } from "webdav";

export interface WebDAVConfig {
  serverUrl: string;
  username?: string;
  password?: string;
  token?: string;
}

export interface DirectoryListingItem {
  type: "file" | "directory";
  name: string;
  size?: number;
  lastModified?: Date;
  mime?: string;
  url: string;
  path: string;
}

export class WebDAVService {
  private client: ReturnType<typeof createWebDAVClient> | null = null;
  private config: WebDAVConfig | null = null;

  constructor() {
    this.client = null;
    this.config = null;
  }

  /**
   * Connect to WebDAV server
   */
  async connect(config: WebDAVConfig): Promise<void> {
    this.config = config;
    this.client = createWebDAVClient(config.serverUrl);

    // Authenticate
    if (config.token) {
      await this.authenticateWithToken();
    } else if (config.username && config.password) {
      await this.authenticateWithPassword();
    } else {
      throw new Error("Either username/password or token is required");
    }
  }

  /**
   * Authenticate with token
   */
  private async authenticateWithToken(): Promise<void> {
    if (!this.client || !this.config) return;

    this.client.setCredentials("token", this.config.token!);
  }

  /**
   * Authenticate with username and password (Basic Auth)
   */
  private async authenticateWithPassword(): Promise<void> {
    if (!this.client || !this.config) return;

    this.client.setCredentials("basic", {
      username: this.config.username!,
      password: this.config.password!,
    });
  }

  /**
   * Disconnect from server
   */
  async disconnect(): Promise<void> {
    this.client = null;
    this.config = null;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.client !== null;
  }

  /**
   * List directory contents
   */
  async listDirectory(path: string = "/"): Promise<DirectoryListingItem[]> {
    if (!this.client) {
      throw new Error("Not connected to WebDAV server");
    }

    const items = await this.client.getDirectoryContents(path);

    return items.map((item: any) => ({
      type: item.type === "collection" ? "directory" : "file",
      name: item.basename,
      size: item.size,
      lastModified: item.lastmod ? new Date(item.lastmod) : undefined,
      mime: item.mime,
      url: item.filename,
      path: item.filename,
    }));
  }

  /**
   * Get file size
   */
  async getFileSize(path: string): Promise<number> {
    if (!this.client) {
      throw new Error("Not connected to WebDAV server");
    }

    const stat = await this.client.stat(path);
    return stat.size || 0;
  }

  /**
   * Download file as ArrayBuffer
   */
  async downloadFile(
    path: string,
    options?: { range?: { start: number; end: number } }
  ): Promise<ArrayBuffer> {
    if (!this.client) {
      throw new Error("Not connected to WebDAV server");
    }

    if (options?.range) {
      const response = await this.client.getFileContents(path, {
        range: options.range,
        format: "binary",
      });
      return response as ArrayBuffer;
    }

    return this.client.getFileContents(path, { format: "binary" }) as ArrayBuffer;
  }

  /**
   * Upload file
   */
  async uploadFile(path: string, data: ArrayBuffer): Promise<void> {
    if (!this.client) {
      throw new Error("Not connected to WebDAV server");
    }

    await this.client.putFileContents(path, data, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
  }

  /**
   * Create directory
   */
  async createDirectory(path: string): Promise<void> {
    if (!this.client) {
      throw new Error("Not connected to WebDAV server");
    }

    await this.client.createDirectory(path);
  }

  /**
   * Delete file or directory
   */
  async delete(path: string): Promise<void> {
    if (!this.client) {
      throw new Error("Not connected to WebDAV server");
    }

    await this.client.deleteFile(path);
  }

  /**
   * Rename/move file or directory
   */
  async move(sourcePath: string, destinationPath: string): Promise<void> {
    if (!this.client) {
      throw new Error("Not connected to WebDAV server");
    }

    await this.client.moveFile(sourcePath, destinationPath);
  }
}
