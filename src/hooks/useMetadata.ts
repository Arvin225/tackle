import { useState, useCallback } from 'react'
import { MetadataParser } from '../../core/metadata/MetadataParser'
import { CoverMatcher } from '../../core/metadata/CoverMatcher'
import { LyricMatcher } from '../../core/metadata/LyricMatcher'
import { metadataDB } from '../../core/metadata/MetadataIndex'

export function useMetadata() {
  const [metadataCache, setMetadataCache] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const parser = new MetadataParser()
  const coverMatcher = new CoverMatcher()
  const lyricMatcher = new LyricMatcher()

  /**
   * Parse metadata from file
   */
  const parseMetadata = useCallback(
    async (file: File): Promise<any> => {
      setLoading(true)
      try {
        const result = await parser.parse(file)
        return result
      } catch (error) {
        console.error('Failed to parse metadata:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [parser, setLoading]
  )

  /**
   * Match cover art
   */
  const matchCover = useCallback(
    async (artist: string, album: string, title?: string): Promise<string | null> => {
      try {
        const cover = await coverMatcher.matchViaMusicBrainz(artist, album, title)
        return cover?.url || null
      } catch (error) {
        console.error('Cover match failed:', error)
        return null
      }
    },
    [coverMatcher]
  )

  /**
   * Match lyrics
   */
  const matchLyrics = useCallback(
    async (artist: string, title: string): Promise<any> => {
      try {
        // Try LRCLIB first
        let lyricsMatch = await lyricMatcher.matchViaLRCLIB(artist, title)

        // If Chinese music, try Netease Cloud Music
        if (!lyricsMatch && this.isChineseText(artist) && this.isChineseText(title)) {
          lyricsMatch = await lyricMatcher.matchViaNeteaseCloudMusic(artist, title)
        }

        return lyricsMatch
      } catch (error) {
        console.error('Lyrics match failed:', error)
        return null
      }
    },
    [lyricMatcher]
  )

  /**
   * Cache metadata
   */
  const cacheMetadata = useCallback(
    async (track: any): Promise<void> => {
      try {
        await metadataDB.saveMetadata([track])
      } catch (error) {
        console.error('Failed to cache metadata:', error)
      }
    },
    []
  )

  /**
   * Get cached metadata
   */
  const getCachedMetadata = useCallback(async () => {
    try {
      return await metadataDB.getAllTracks()
    } catch (error) {
      console.error('Failed to get cached metadata:', error)
      return []
    }
  }, [])

  return {
    // State
    loading,

    // Methods
    parseMetadata,
    matchCover,
    matchLyrics,
    cacheMetadata,
    getCachedMetadata,
  }
}
