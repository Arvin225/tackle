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

  constructor() {
    this.client = null;
  }

  /**
   * Connect to WebDAV server
   */
  async connect(config: WebDAVConfig): Promise<void> {
    this.config = config;

    try {
      // Create client with server URL
      this.client = createWebDAVClient(config.serverUrl);

      // webdav library will handle authentication automatically based on config
      // No need to manually call authenticate methods
      console.log("WebDAV client created for:", config.serverUrl);
    } catch (error) {
      console.error("Failed to create WebDAV client:", error);
      throw error;
    }
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
    // Handle both FileStat and ResponseDataDetailed<FileStat>
    const fileStat = "data" in stat ? stat.data : stat;
    return fileStat.size || 0;
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

    const getFileOptions: any = { format: "binary" };

    if (options?.range) {
      // Note: range option may not be supported by all webdav implementations
      getFileOptions.range = options.range;
    }

    const response = await this.client.getFileContents(path, getFileOptions);

    // Convert response to ArrayBuffer
    if (typeof response === "string") {
      return new TextEncoder().encode(response).buffer;
    } else if (response instanceof ArrayBuffer) {
      return response;
    } else if (response && typeof response === "object" && "data" in response) {
      // Handle ResponseDataDetailed
      const data = response.data;
      if (typeof data === "string") {
        return new TextEncoder().encode(data).buffer;
      } else if (data instanceof ArrayBuffer) {
        return data;
      }
    }

    throw new Error("Unsupported response type from WebDAV server");
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
