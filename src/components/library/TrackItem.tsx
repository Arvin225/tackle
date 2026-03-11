import React from "react";
import { Track } from "../../core/audio/types";
import { Play, MoreVertical } from "lucide-react";

interface TrackItemProps {
  track: Track;
  onPlay?: () => void;
  onMore?: () => void;
  isSelected?: boolean;
  className?: string;
}

export const TrackItem: React.FC<TrackItemProps> = ({
  track,
  onPlay,
  onMore,
  isSelected = false,
  className = "",
}) => {
  return (
    <div
      className={`group flex items-center gap-4 p-3 rounded-lg transition-all ${
        isSelected ? "bg-[#007aff]/10" : "hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
      } ${className}`}
    >
      <button
        onClick={onPlay}
        className="w-10 h-10 rounded-full bg-transparent hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] flex items-center justify-center transition-colors"
      >
        <Play className="w-5 h-5 text-[#86868b] dark:text-[#8e8e93]" />
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            isSelected ? "text-[#007aff]" : "text-[#1d1d1f] dark:text-white"
          }`}
        >
          {track.title || "Unknown Track"}
        </p>
        <p className="text-xs text-[#86868b] dark:text-[#8e8e93] truncate">
          {track.artist || "Unknown Artist"}
        </p>
      </div>

      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {track.album && (
          <p className="text-xs text-[#aeaeb2] dark:text-[#636366] truncate">{track.album}</p>
        )}
        <p className="text-xs text-[#aeaeb2] dark:text-[#636366]">
          {track.duration
            ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, "0")}`
            : "--:--"}
        </p>
        {onMore && (
          <button
            onClick={onMore}
            className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-[#86868b] dark:text-[#8e8e93]" />
          </button>
        )}
      </div>
    </div>
  );
};
