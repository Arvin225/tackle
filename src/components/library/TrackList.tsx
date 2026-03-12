import React, { useRef, useEffect, useState } from "react";
import { Track } from "../../core/audio/types";
import { TrackItem } from "./TrackItem";

interface TrackListProps {
  tracks: Track[];
  onItemClick?: (trackId: string) => void;
  selectedTrackId?: string;
  className?: string;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onItemClick,
  selectedTrackId,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const itemHeight = 60;
  const totalHeight = tracks.length * itemHeight;

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const viewportHeight = containerRef.current.clientHeight;
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(viewportHeight / itemHeight) + 5,
        tracks.length
      );
      setVisibleCount(endIndex - startIndex);
    }
  }, [scrollTop, tracks.length]);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + 20, tracks.length);
  const visibleTracks = tracks.slice(startIndex, endIndex);

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-y-auto ${className}`}
      style={{
        height: totalHeight > 600 ? "600px" : "auto",
      }}
    >
      <div style={{ height: totalHeight }}>
        {visibleTracks.map((track, index) => (
          <div
            key={track.id}
            style={{
              height: itemHeight,
              transform: `translateY(${(startIndex + index) * itemHeight}px)`,
            }}
          >
            <TrackItem
              track={track}
              onPlay={() => onItemClick?.(track.id)}
              isSelected={selectedTrackId === track.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
