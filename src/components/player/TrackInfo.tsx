import React from "react";
import { Track } from "../../core/audio/types";

interface TrackInfoProps {
  track: Track;
  className?: string;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ track, className = "" }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white truncate">
        {track.title || "Unknown Track"}
      </h2>
      <p className="text-sm text-[#86868b] dark:text-[#8e8e93] truncate">
        {track.artist || "Unknown Artist"}
      </p>
      {track.album && (
        <p className="text-xs text-[#aeaeb2] dark:text-[#636366] truncate">{track.album}</p>
      )}
    </div>
  );
};
