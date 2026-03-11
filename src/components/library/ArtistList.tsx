import React from "react";
import { Play, Plus } from "lucide-react";

interface Artist {
  id: string;
  name: string;
  trackCount?: number;
}

interface ArtistListProps {
  artists: Artist[];
  onArtistClick?: (artistId: string) => void;
  onAddToPlaylist?: (artistId: string) => void;
  className?: string;
}

export const ArtistList: React.FC<ArtistListProps> = ({
  artists,
  onArtistClick,
  onAddToPlaylist,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {artists.map(artist => (
        <div
          key={artist.id}
          className="glass-card p-4 rounded-xl hover:shadow-lg transition-all cursor-pointer"
          onClick={() => onArtistClick?.(artist.id)}
        >
          <div className="aspect-square rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center mb-3 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#aeaeb2] dark:text-[#636366]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-[#1d1d1f] dark:text-white truncate">{artist.name}</h3>
          {artist.trackCount !== undefined && (
            <p className="text-xs text-[#86868b] dark:text-[#8e8e93]">{artist.trackCount} tracks</p>
          )}
          {onAddToPlaylist && (
            <button
              onClick={e => {
                e.stopPropagation();
                onAddToPlaylist(artist.id);
              }}
              className="absolute top-2 right-2 p-2 bg-[#007aff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
