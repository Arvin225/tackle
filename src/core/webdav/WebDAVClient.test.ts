import { describe, it, expect, vi, beforeEach } from "vitest";
import { WebDAVService } from "./WebDAVClient";

// Mock the webdav module
vi.mock("webdav", () => ({
  createClient: vi.fn(() => ({
    setCredentials: vi.fn(),
    getDirectoryContents: vi.fn(),
    stat: vi.fn(),
    getFileContents: vi.fn(),
    putFileContents: vi.fn(),
    createDirectory: vi.fn(),
    deleteFile: vi.fn(),
    moveFile: vi.fn(),
  })),
}));

describe("WebDAVService", () => {
  let webdavService: WebDAVService;

  beforeEach(() => {
    webdavService = new WebDAVService();
    vi.clearAllMocks();
  });

  describe("connect", () => {
    it("should connect with username and password", async () => {
      const config = {
        serverUrl: "https://example.com/webdav",
        username: "testuser",
        password: "testpass",
      };

      await webdavService.connect(config);
      expect(webdavService.isConnected()).toBe(true);
    });

    it("should connect with token", async () => {
      const config = {
        serverUrl: "https://example.com/webdav",
        token: "test-token",
      };

      await webdavService.connect(config);
      expect(webdavService.isConnected()).toBe(true);
    });

    it("should throw error when no credentials provided", async () => {
      const config = {
        serverUrl: "https://example.com/webdav",
      };

      await expect(webdavService.connect(config)).rejects.toThrow(
        "Either username/password or token is required"
      );
    });
  });

  describe("disconnect", () => {
    it("should disconnect from server", async () => {
      const config = {
        serverUrl: "https://example.com/webdav",
        username: "testuser",
        password: "testpass",
      };

      await webdavService.connect(config);
      expect(webdavService.isConnected()).toBe(true);

      await webdavService.disconnect();
      expect(webdavService.isConnected()).toBe(false);
    });
  });

  describe("listDirectory", () => {
    it("should throw error when not connected", async () => {
      await expect(webdavService.listDirectory()).rejects.toThrow("Not connected to WebDAV server");
    });

    it("should list directory contents", async () => {
      const mockItems = [
        {
          type: "collection",
          basename: "folder1",
          size: 0,
          lastmod: "2024-01-01T00:00:00Z",
          mime: "httpd/unix-directory",
          filename: "/folder1",
        },
        {
          type: "file",
          basename: "file1.mp3",
          size: 1024,
          lastmod: "2024-01-01T00:00:00Z",
          mime: "audio/mpeg",
          filename: "/file1.mp3",
        },
      ];

      const { createClient } = await import("webdav");
      const mockClient = createClient as any;
      mockClient.mockImplementation(() => ({
        setCredentials: vi.fn(),
        getDirectoryContents: vi.fn().mockResolvedValue(mockItems),
        stat: vi.fn(),
        getFileContents: vi.fn(),
        putFileContents: vi.fn(),
        createDirectory: vi.fn(),
        deleteFile: vi.fn(),
        moveFile: vi.fn(),
      }));

      const config = {
        serverUrl: "https://example.com/webdav",
        username: "testuser",
        password: "testpass",
      };

      await webdavService.connect(config);
      const items = await webdavService.listDirectory();

      expect(items).toHaveLength(2);
      expect(items[0]).toEqual({
        type: "directory",
        name: "folder1",
        size: 0,
        lastModified: new Date("2024-01-01T00:00:00Z"),
        mime: "httpd/unix-directory",
        url: "/folder1",
        path: "/folder1",
      });
      expect(items[1]).toEqual({
        type: "file",
        name: "file1.mp3",
        size: 1024,
        lastModified: new Date("2024-01-01T00:00:00Z"),
        mime: "audio/mpeg",
        url: "/file1.mp3",
        path: "/file1.mp3",
      });
    });
  });

  describe("getFileSize", () => {
    it("should throw error when not connected", async () => {
      await expect(webdavService.getFileSize("/test.mp3")).rejects.toThrow(
        "Not connected to WebDAV server"
      );
    });

    it("should get file size", async () => {
      const mockStat = { size: 2048 };

      const { createClient } = await import("webdav");
      const mockClient = createClient as any;
      mockClient.mockImplementation(() => ({
        setCredentials: vi.fn(),
        getDirectoryContents: vi.fn(),
        stat: vi.fn().mockResolvedValue(mockStat),
        getFileContents: vi.fn(),
        putFileContents: vi.fn(),
        createDirectory: vi.fn(),
        deleteFile: vi.fn(),
        moveFile: vi.fn(),
      }));

      const config = {
        serverUrl: "https://example.com/webdav",
        username: "testuser",
        password: "testpass",
      };

      await webdavService.connect(config);
      const size = await webdavService.getFileSize("/test.mp3");

      expect(size).toBe(2048);
    });
  });

  describe("downloadFile", () => {
    it("should throw error when not connected", async () => {
      await expect(webdavService.downloadFile("/test.mp3")).rejects.toThrow(
        "Not connected to WebDAV server"
      );
    });

    it("should download file", async () => {
      const mockBuffer = new ArrayBuffer(1024);

      const { createClient } = await import("webdav");
      const mockClient = createClient as any;
      mockClient.mockImplementation(() => ({
        setCredentials: vi.fn(),
        getDirectoryContents: vi.fn(),
        stat: vi.fn(),
        getFileContents: vi.fn().mockResolvedValue(mockBuffer),
        putFileContents: vi.fn(),
        createDirectory: vi.fn(),
        deleteFile: vi.fn(),
        moveFile: vi.fn(),
      }));

      const config = {
        serverUrl: "https://example.com/webdav",
        username: "testuser",
        password: "testpass",
      };

      await webdavService.connect(config);
      const buffer = await webdavService.downloadFile("/test.mp3");

      expect(buffer).toBe(mockBuffer);
    });

    it("should download file with range", async () => {
      const mockBuffer = new ArrayBuffer(512);

      const { createClient } = await import("webdav");
      const mockClient = createClient as any;
      mockClient.mockImplementation(() => ({
        setCredentials: vi.fn(),
        getDirectoryContents: vi.fn(),
        stat: vi.fn(),
        getFileContents: vi.fn().mockResolvedValue(mockBuffer),
        putFileContents: vi.fn(),
        createDirectory: vi.fn(),
        deleteFile: vi.fn(),
        moveFile: vi.fn(),
      }));

      const config = {
        serverUrl: "https://example.com/webdav",
        username: "testuser",
        password: "testpass",
      };

      await webdavService.connect(config);
      const buffer = await webdavService.downloadFile("/test.mp3", {
        range: { start: 0, end: 511 },
      });

      expect(buffer).toBe(mockBuffer);
    });
  });
});
