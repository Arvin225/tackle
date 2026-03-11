import React from "react";
import { Track } from "../../core/audio/types";
import { TrackItem } from "../library/TrackItem";

interface QueueProps {
  queue: Track[];
  onRemove?: (trackId: string) => void;
  onPlay?: (trackId: string) => void;
  selectedTrackId?: string;
  className?: string;
}

export const Queue: React.FC<QueueProps> = ({
  queue,
  onRemove,
  onPlay,
  selectedTrackId,
  className = "",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white mb-4 px-2">
        Queue ({queue.length})
      </h2>

      {queue.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-[#86868b] dark:text-[#8e8e93]">Queue is empty</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {queue.map(track => (
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
