export interface CoverMatch {
  url: string
  size: number
  format: string
}

export class CoverMatcher {
  private musicBrainzApiKey: string | null = null

  constructor(apiKey?: string) {
    this.musicBrainzApiKey = apiKey || null
  }

  /**
   * Match cover art via MusicBrainz
   */
  async matchViaMusicBrainz(
    artist: string,
    album: string,
    title?: string
  ): Promise<CoverMatch | null> {
    if (!this.musicBrainzApiKey) {
      console.warn('MusicBrainz API key not set')
      return null
    }

    try {
      // Build search query
      const query = new URLSearchParams({
        artist,
        release: album,
        ...(title && { recording: title }),
      })

      const response = await fetch(
        `https://musicbrainz.org/ws/2/release?limit=1&fmt=json&${query.toString()}`,
        {
          headers: {
            'User-Agent': 'CloudMusicPlayer/1.0 (https://github.com/Arvin225/tackle)',
          },
        }
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      const releases = data.releases || []

      for (const release of releases) {
        if (release.coverart && release.coverart.image && release.coverart.image.length > 0) {
          const firstImage = release.coverart.image[0]
          return {
            url: firstImage.thumbnails?.[0]?.size || firstImage.url,
            size: firstImage.size || 0,
            format: firstImage.thumbnails?.[0]?.format || 'unknown',
          }
        }
      }

      return null
    } catch (error) {
      console.error('MusicBrainz match failed:', error)
      return null
    }
  }

  /**
   * Set MusicBrainz API key
   */
  setMusicBrainzApiKey(apiKey: string): void {
    this.musicBrainzApiKey = apiKey
  }

  /**
   * Get API key
   */
  getMusicBrainzApiKey(): string | null {
    return this.musicBrainzApiKey
  }
}
