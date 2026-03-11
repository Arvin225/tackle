import React from "react";
import { Track } from "../../core/audio/types";
import { TrackItem } from "../library/TrackItem";
import { Clock } from "lucide-react";

interface RecentTrack {
  track: Track;
  lastPlayed: Date;
  playCount: number;
}

interface RecentTracksProps {
  recentTracks: RecentTrack[];
  onPlay?: (trackId: string) => void;
  onRemove?: (trackId: string) => void;
  selectedTrackId?: string;
  className?: string;
}

export const RecentTracks: React.FC<RecentTracksProps> = ({
  recentTracks,
  onPlay,
  onRemove,
  selectedTrackId,
  className = "",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-4 px-2">
        <Clock className="w-5 h-5 text-[#86868b] dark:text-[#8e8e93]" />
        <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
          Recent Tracks ({recentTracks.length})
        </h2>
      </div>

      {recentTracks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Clock className="w-16 h-16 mx-auto text-[#aeaeb2] dark:text-[#636366] mb-4" />
            <p className="text-[#86868b] dark:text-[#8e8e93]">No recent tracks</p>
            <p className="text-xs text-[#aeaeb2] dark:text-[#636366] mt-2">
              Start playing tracks to see them here
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {recentTracks.map(({ track }) => (
            <TrackItem
              key={track.id}
              track={track}
              onPlay={() => onPlay?.(track.id)}
              onMore={onRemove ? () => onRemove(track.id) : undefined}
              isSelected={selectedTrackId === track.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
