import React, { useState, useEffect } from "react";
import { LyricLine } from "./LyricLine";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

interface LyricsPanelProps {
  trackId: string;
  className?: string;
}

export const LyricsPanel: React.FC<LyricsPanelProps> = ({ trackId, className = "" }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const { currentTime, seek } = useAudioPlayer();
  const [lyrics, setLyrics] = useState<{ lines: { timestamp: number; text: string }[] } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLyrics = async () => {
      setLoading(true);
      try {
        // Simulated lyrics loading - in real implementation, this would come from the metadata service
        const mockLyrics = `
          [00:00.00] Example Song Title
          [00:00.00] Example Artist
          [00:05.20] Verse 1 - Line 1
          [00:10.50] Verse 1 - Line 2
          [00:15.80] Chorus - Line 1
          [00:20.20] Chorus - Line 2
          [00:25.50] Verse 2 - Line 1
          [00:30.80] Verse 2 - Line 2
          [00:35.20] Chorus - Line 3
          [00:40.50] Bridge - Line 1
          [00:45.80] Bridge - Line 2
          [00:50.20] Chorus - Line 4
          [00:55.50] Outro - Line 1
          [01:00.80] Outro - Line 2
        `;
        setLyrics(parseLRC(mockLyrics));
      } catch (error) {
        console.error("Failed to load lyrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLyrics();
  }, [trackId]);

  useEffect(() => {
    if (!lyrics || !showLyrics) return;

    const interval = setInterval(() => {
      const index = findCurrentLineIndex(lyrics, currentTime);
      setCurrentLineIndex(index);
    }, 100);

    return () => clearInterval(interval);
  }, [lyrics, currentTime, showLyrics]);

  const handleLineClick = (index: number) => {
    if (lyrics && lyrics.lines[index]) {
      seek(lyrics.lines[index].timestamp);
      setCurrentLineIndex(index);
    }
  };

  const parseLRC = (lrc: string): { lines: { timestamp: number; text: string }[] } => {
    const lines: { timestamp: number; text: string }[] = [];
    lrc.split("\n").forEach(line => {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const milliseconds = parseInt(match[3].padEnd(3, "0"), 10);
        const text = match[4].trim();
        lines.push({
          timestamp: minutes * 60 + seconds + milliseconds / 1000,
          text,
        });
      }
    });
    return { lines };
  };

  const findCurrentLineIndex = (
    lyrics: { lines: { timestamp: number; text: string }[] },
    currentTime: number
  ): number => {
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

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="animate-spin w-8 h-8 border-2 border-[#007aff] border-t-transparent rounded-full" />
        <p className="text-[#86868b] dark:text-[#8e8e93] mt-2">Loading lyrics...</p>
      </div>
    );
  }

  if (!lyrics || lyrics.lines.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <svg
          className="w-16 h-16 text-[#aeaeb2] dark:text-[#636366] mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
        <p className="text-[#86868b] dark:text-[#8e8e93]">No lyrics available</p>
      </div>
    );
  }

  const displayLines = lyrics.lines.slice(Math.max(0, currentLineIndex - 4), currentLineIndex + 6);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-[#d2d2d7] dark:border-[#48484a]">
        <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">Lyrics</h2>
        <button onClick={() => setShowLyrics(!showLyrics)} className="text-sm text-[#007aff]">
          {showLyrics ? "Hide" : "Show"}
        </button>
      </div>

      {showLyrics ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {lyrics.lines.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-4">
                {lyrics.lines[0].text}
              </h3>
              <p className="text-sm text-[#86868b] dark:text-[#8e8e93] mb-4">Example Artist</p>
              <div className="space-y-2">
                {displayLines.map(line => {
                  const realIndex = lyrics.lines.indexOf(line);
                  return (
                    <LyricLine
                      key={realIndex}
                      text={line.text}
                      isActive={realIndex === currentLineIndex}
                      onClick={() => handleLineClick(realIndex)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#86868b] dark:text-[#8e8e93]">Click "Show" to display lyrics</p>
        </div>
      )}
    </div>
  );
};
