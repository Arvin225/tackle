import React from "react";
import { Play } from "lucide-react";

interface Album {
  id: string;
  name: string;
  artist?: string;
  coverUrl?: string;
  trackCount?: number;
}

interface AlbumListProps {
  albums: Album[];
  onAlbumClick?: (albumId: string) => void;
  onPlayAlbum?: (albumId: string) => void;
  className?: string;
}

export const AlbumList: React.FC<AlbumListProps> = ({
  albums,
  onAlbumClick,
  onPlayAlbum,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {albums.map(album => (
        <div
          key={album.id}
          className="glass-card p-4 rounded-xl hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => onAlbumClick?.(album.id)}
        >
          <div className="relative mb-3">
            <div className="aspect-square rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e] overflow-hidden">
              {album.coverUrl ? (
                <img
                  src={album.coverUrl}
                  alt={album.name}
                  className="w-full h-full object-cover"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-[#aeaeb2] dark:text-[#636366]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              )}
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                onPlayAlbum?.(album.id);
              }}
              className="absolute bottom-2 right-2 p-2 bg-[#007aff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <Play className="w-4 h-4 text-white" />
            </button>
          </div>
          <h3 className="font-semibold text-[#1d1d1f] dark:text-white truncate">{album.name}</h3>
          {album.artist && (
            <p className="text-xs text-[#86868b] dark:text-[#8e8e93] truncate">{album.artist}</p>
          )}
          {album.trackCount !== undefined && (
            <p className="text-xs text-[#aeaeb2] dark:text-[#636366]">{album.trackCount} tracks</p>
          )}
        </div>
      ))}
    </div>
  );
};
