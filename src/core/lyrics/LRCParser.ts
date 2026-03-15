export interface LyricLine {
  timestamp: number;
  text: string;
}

export interface ParsedLyrics {
  title?: string;
  artist?: string;
  lines: LyricLine[];
}

export const parseLRC = (lrc: string): ParsedLyrics => {
  const lines: LyricLine[] = [];
  let title: string | undefined;
  let artist: string | undefined;

  lrc.split("\n").forEach(line => {
    line = line.trim();
    if (!line) return;

    const timestampMatch = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$/);
    if (timestampMatch) {
      const minutes = parseInt(timestampMatch[1], 10);
      const seconds = parseInt(timestampMatch[2], 10);
      const milliseconds = parseInt(timestampMatch[3].padEnd(3, "0"), 10);
      const text = timestampMatch[4].trim();
      lines.push({
        timestamp: minutes * 60 + seconds + milliseconds / 1000,
        text,
      });
    } else {
      const metaMatch = line.match(/^\[(.*?)\](.*)$/);
      if (metaMatch) {
        const key = metaMatch[1].toLowerCase();
        const value = metaMatch[2].trim();
        if (key === "ti") {
          title = value;
        } else if (key === "ar") {
          artist = value;
        }
      }
    }
  });

  return {
    title,
    artist,
    lines,
  };
};

export const findCurrentLineIndex = (lyrics: ParsedLyrics, currentTime: number): number => {
  let index = 0;
  for (let i = 0; i < lyrics.lines.length; i++) {
    if (lyrics.lines[i].timestamp <= currentTime) {
      index = i;
    } else {
      break;
    }
  }
  return index;
};
