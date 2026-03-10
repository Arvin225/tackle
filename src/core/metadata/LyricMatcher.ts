export interface LyricsMatch {
  url: string
  sync: boolean
}

export class LyricMatcher {
  /**
   * Match lyrics via LRCLIB API
   */
  async matchViaLRCLIB(
    artist: string,
    title: string
  ): Promise<LyricsMatch | null> {
    try {
      const query = new URLSearchParams({
        artist_name: artist,
        song_name: title,
      })

      const response = await fetch(
        `https://lrclib.net/api/get?${query.toString()}`
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      if (data.syncedLyrics) {
        return {
          url: '',
          sync: true,
        }
      } else if (data.plainLyrics) {
        return {
          url: '',
          sync: false,
        }
      }

      return null
    } catch (error) {
      console.error('LRCLIB match failed:', error)
      return null
    }
  }

  /**
   * Match lyrics via Netease Cloud Music API (Chinese music)
   */
  async matchViaNeteaseCloudMusic(
    artist: string,
    title: string
  ): Promise<LyricsMatch | null> {
    try {
      // Note: This is a non-official API, may have rate limits
      const response = await fetch(
        `https://music.163.com/api/song/lyric?id=${await this.searchNeteaseSongId(artist, title)}`
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      const lyric = data.lrc?.lyric

      if (lyric) {
        return {
          url: '',
          sync: false,
        }
      }

      return null
    } catch (error) {
      console.error('Netease Cloud Music match failed:', error)
      return null
    }
  }

  /**
   * Search song ID on Netease Cloud Music
   */
  private async searchNeteaseSongId(
    artist: string,
    title: string
  ): Promise<number> {
    try {
      const response = await fetch(
        `https://music.163.com/api/search/get/web?keyword=${encodeURIComponent(
          `${artist} ${title}`
        )}&limit=1&type=1`
      )

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      const songs = data.result?.songs || []

      if (songs.length > 0) {
        return songs[0].id
      }

      throw new Error('Song not found')
    } catch (error) {
      console.error('Failed to search song:', error)
      return -1
    }
  }
}
