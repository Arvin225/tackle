import React from "react";
import { Play, MoreVertical, Trash2 } from "lucide-react";

interface Playlist {
  id: string;
  name: string;
  tracks: Array<{ id: string }>;
  coverUrl?: string;
}

interface PlaylistItemProps {
  playlist: Playlist;
  onPlay?: (playlistId: string) => void;
  onMore?: (playlistId: string) => void;
  onDelete?: (playlistId: string) => void;
  isSelected?: boolean;
  className?: string;
}

export const PlaylistItem: React.FC<PlaylistItemProps> = ({
  playlist,
  onPlay,
  onMore,
  onDelete,
  isSelected = false,
  className = "",
}) => {
  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-xl transition-all ${
        isSelected ? "bg-[#007aff]/10" : "hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
      } ${className}`}
    >
      <button
        onClick={() => onPlay?.(playlist.id)}
        className="w-12 h-12 rounded-full bg-transparent hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] flex items-center justify-center transition-colors flex-shrink-0"
      >
        <Play className="w-5 h-5 text-[#86868b] dark:text-[#8e8e93]" />
      </button>

      <div className="flex-1 min-w-0">
        <h3
          className={`font-medium truncate ${
            isSelected ? "text-[#007aff]" : "text-[#1d1d1f] dark:text-white"
          }`}
        >
          {playlist.name}
        </h3>
        <p className="text-xs text-[#86868b] dark:text-[#8e8e93]">
          {playlist.tracks.length} tracks
        </p>
      </div>

      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {playlist.coverUrl && (
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-12 h-12 rounded-lg object-cover"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        )}
        {onMore && (
          <button
            onClick={e => {
              e.stopPropagation();
              onMore(playlist.id);
            }}
            className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-[#86868b] dark:text-[#8e8e93]" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(playlist.id);
            }}
            className="p-2 rounded-full hover:bg-[#ff3b30]/10 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-[#ff3b30]" />
          </button>
        )}
      </div>
    </div>
  );
};
