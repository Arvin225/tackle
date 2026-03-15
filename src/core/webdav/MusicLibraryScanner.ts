import { WebDAVService } from "./WebDAVClient";
import { Track } from "../audio/types";

// Supported audio file extensions
const AUDIO_EXTENSIONS = [
  ".mp3",
  ".m4a",
  ".aac",
  ".flac",
  ".wav",
  ".ogg",
  ".wma",
  ".mp4",
  ".aiff",
  ".au",
  ".ra",
  ".mid",
  ".midi",
];

export async function scanMusicLibrary(
  webDAVService: WebDAVService,
  onProgress?: (current: string, total: number) => void
): Promise<Track[]> {
  const tracks: Track[] = [];
  const visitedPaths = new Set<string>();

  async function scanDirectory(path: string): Promise<void> {
    if (visitedPaths.has(path)) {
      return;
    }
    visitedPaths.add(path);

    try {
      const items = await webDAVService.listDirectory(path);

      for (const item of items) {
        if (item.type === "directory") {
          // Recursively scan subdirectories
          await scanDirectory(item.path);
        } else if (isAudioFile(item.name)) {
          // Create track from audio file
          const track: Track = {
            id: `${item.path}-${item.name}`,
            url: webDAVService.getFileUrl(item.path),
            title: item.name.replace(/\.[^/.]+$/, ""),
            artist: "Unknown Artist",
            album: "Unknown Album",
            duration: 0,
            xhrHeaders: webDAVService.getAuthHeaders(),
          };
          tracks.push(track);
        }
      }

      // Report progress
      if (onProgress) {
        onProgress(path, tracks.length);
      }
    } catch (error) {
      console.error(`Error scanning directory ${path}:`, error);
    }
  }

  // Start scanning from root
  await scanDirectory("/");

  return tracks;
}

function isAudioFile(filename: string): boolean {
  const lowerName = filename.toLowerCase();
  return AUDIO_EXTENSIONS.some(ext => lowerName.endsWith(ext));
}
