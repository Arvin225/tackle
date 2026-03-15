export interface LyricLine {
  time: number;
  text: string;
}

export class LRCParser {
  /**
   * Parse LRC formatted lyrics
   */
  parse(lrc: string): LyricLine[] {
    const lines = lrc.split("\n");
    const lyrics: LyricLine[] = [];

    for (const line of lines) {
      const timeMatch = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
      if (timeMatch) {
        const minutes = parseInt(timeMatch[1], 10);
        const seconds = parseInt(timeMatch[2], 10);
        const milliseconds = parseInt(timeMatch[3], 10);

        // Handle milliseconds (2 or 3 digits)
        const ms = milliseconds.toString().padEnd(3, "0").slice(0, 3);
        const time = minutes * 60 + seconds + ms / 1000;

        const text = timeMatch[4].trim();
        if (text) {
          lyrics.push({ time, text });
        }
      }
    }

    return lyrics;
  }

  /**
   * Format time to MM:SS.mmm
   */
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  }

  /**
   * Find lyrics line at specific time
   */
  findLineAtTime(lyrics: LyricLine[], time: number): LyricLine {
    let foundIndex = 0;
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (lyrics[i].time <= time) {
        foundIndex = i;
        break;
      }
    }
    return lyrics[foundIndex] || { time: 0, text: "" };
  }
}
