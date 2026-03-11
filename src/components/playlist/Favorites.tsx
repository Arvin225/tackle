import React from "react";
import { Track } from "../../core/audio/types";
import { TrackItem } from "../library/TrackItem";
import { Heart } from "lucide-react";

interface FavoritesProps {
  tracks: Track[];
  onPlay?: (trackId: string) => void;
  onRemove?: (trackId: string) => void;
  selectedTrackId?: string;
  className?: string;
}

export const Favorites: React.FC<FavoritesProps> = ({
  tracks,
  onPlay,
  onRemove,
  selectedTrackId,
  className = "",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-4 px-2">
        <Heart className="w-5 h-5 text-[#ff3b30]" />
        <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
          Favorites ({tracks.length})
        </h2>
      </div>

      {tracks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto text-[#aeaeb2] dark:text-[#636366] mb-4" />
            <p className="text-[#86868b] dark:text-[#8e8e93]">No favorites yet</p>
            <p className="text-xs text-[#aeaeb2] dark:text-[#636366] mt-2">
              Click the heart icon on tracks to add them to favorites
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {tracks.map(track => (
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
