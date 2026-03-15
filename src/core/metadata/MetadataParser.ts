import { parseBuffer } from "music-metadata-browser";
import { Track } from "../audio/types";

export interface MetadataResult {
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover?: { data: Uint8Array; format: string };
  artwork?: Array<{ data: Uint8Array; format: string }>;
}

export interface ParsedTrack extends Track {
  metadata?: MetadataResult;
}

export class MetadataParser {
  /**
   * Parse metadata from audio file
   */
  async parse(file: Blob): Promise<MetadataResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const metadata = await parseBuffer(uint8Array, {
        mimeType: file.type || undefined,
      });

      const result: MetadataResult = {
        title: metadata.common.title || "",
        artist: metadata.common.artist || "Unknown Artist",
        album: metadata.common.album || "Unknown Album",
        duration: metadata.format.duration || 0,
      };

      // Extract embedded cover art
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        result.cover = {
          data: metadata.common.picture[0].data,
          format: metadata.common.picture[0].format,
        };
      }

      // Extract additional artwork from picture array
      if (metadata.common.picture && metadata.common.picture.length > 1) {
        result.artwork = metadata.common.picture.slice(1).map((art: any) => ({
          data: art.data,
          format: art.format,
        }));
      }

      return result;
    } catch (error) {
      console.error("Failed to parse metadata:", error);
      throw error;
    }
  }

  /**
   * Parse metadata from URL (via file fetch)
   */
  async parseFromUrl(url: string): Promise<MetadataResult> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const file = await response.blob();
      return await this.parse(file);
    } catch (error) {
      console.error("Failed to parse metadata from URL:", error);
      throw error;
    }
  }

  /**
   * Create track from metadata and file
   */
  createTrackFromMetadata(
    id: string,
    url: string,
    metadata: MetadataResult,
    _file?: Blob
  ): ParsedTrack {
    return {
      id,
      url,
      title: metadata.title || "Unknown Title",
      artist: metadata.artist || "Unknown Artist",
      album: metadata.album || "Unknown Album",
      duration: metadata.duration,
      metadata,
    };
  }
}
