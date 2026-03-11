import React from "react";
import { Track } from "../../core/audio/types";

interface AlbumCoverProps {
  track: Track;
  size?: "sm" | "md" | "lg" | "xl";
  showBlur?: boolean;
  className?: string;
}

export const AlbumCover: React.FC<AlbumCoverProps> = ({
  track,
  size = "md",
  showBlur = true,
  className = "",
}) => {
  const sizeStyles = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
  };

  const coverUrl = track.coverUrl || track.url;

  return (
    <div className={`${sizeStyles[size]} relative ${showBlur ? "album-blur" : ""} ${className}`}>
      <img
        src={coverUrl}
        alt={track.title || "Album cover"}
        className="w-full h-full object-cover rounded-xl"
        onError={e => {
          const target = e.target as HTMLImageElement;
          target.src =
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23d2d2d7"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%2386868b" font-size="20"%3E🎵%3C/text%3E%3C/svg%3E';
        }}
      />
    </div>
  );
};
