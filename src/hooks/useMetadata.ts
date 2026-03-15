import { useState, useCallback } from "react";
import { MetadataParser } from "../core/metadata/MetadataParser";
import { CoverMatcher } from "../core/metadata/CoverMatcher";
import { LyricMatcher } from "../core/metadata/LyricMatcher";
import { metadataDB } from "../core/metadata/MetadataIndex";

export function useMetadata() {
  const [loading, setLoading] = useState(false);

  const parser = new MetadataParser();
  const coverMatcher = new CoverMatcher();
  const lyricMatcher = new LyricMatcher();

  /**
   * Parse metadata from file
   */
  const parseMetadata = useCallback(
    async (file: File): Promise<any> => {
      setLoading(true);
      try {
        const result = await parser.parse(file);
        return result;
      } catch (error) {
        console.error("Failed to parse metadata:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [parser, setLoading]
  );

  /**
   * Match cover art
   */
  const matchCover = useCallback(
    async (artist: string, album: string, title?: string): Promise<string | null> => {
      try {
        const cover = await coverMatcher.matchViaMusicBrainz(artist, album, title);
        return cover?.url || null;
      } catch (error) {
        console.error("Cover match failed:", error);
        return null;
      }
    },
    [coverMatcher]
  );

  /**
   * Match lyrics
   */
  const matchLyrics = useCallback(
    async (artist: string, title: string): Promise<any> => {
      try {
        // Try LRCLIB first
        let lyricsMatch = await lyricMatcher.matchViaLRCLIB(artist, title);

        // TODO: Add support for Chinese music via Netease Cloud Music
        // This would need isChineseText check and additional API calls

        return lyricsMatch;
      } catch (error) {
        console.error("Lyrics match failed:", error);
        return null;
      }
    },
    [lyricMatcher]
  );

  /**
   * Cache metadata
   */
  const cacheMetadata = useCallback(async (track: any): Promise<void> => {
    try {
      await metadataDB.saveMetadata([track]);
    } catch (error) {
      console.error("Failed to cache metadata:", error);
    }
  }, []);

  /**
   * Get cached metadata
   */
  const getCachedMetadata = useCallback(async () => {
    try {
      return await metadataDB.getAllTracks();
    } catch (error) {
      console.error("Failed to get cached metadata:", error);
      return [];
    }
  }, []);

  /**
   * Get metadata by track ID
   */
  const getMetadataByTrackId = useCallback(async (trackId: string) => {
    try {
      return await metadataDB.getTrackById(trackId);
    } catch (error) {
      console.error("Failed to get metadata by track ID:", error);
      return null;
    }
  }, []);

  /**
   * Get lyrics by track ID
   */
  const getLyricsByTrackId = useCallback(async (_trackId: string) => {
    // TODO: Implement lyrics fetching from a different source
    // TrackMetadata doesn't have lyrics property
    return null;
  }, []);

  return {
    // State
    loading,

    // Methods
    parseMetadata,
    matchCover,
    matchLyrics,
    cacheMetadata,
    getCachedMetadata,
    getMetadataByTrackId,
    getLyricsByTrackId,
  };

  return {
    // State
    loading,

    // Methods
    parseMetadata,
    matchCover,
    matchLyrics,
    cacheMetadata,
    getCachedMetadata,
  };
}
