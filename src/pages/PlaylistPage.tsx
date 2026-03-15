import React from "react";
import { Playlist } from "../components/playlist/Playlist";

interface PlaylistPageProps {
  className?: string;
}

export const PlaylistPage: React.FC<PlaylistPageProps> = ({ className = "" }) => {
  // For now, pass empty playlists array
  // In a real implementation, this would come from a store or API
  const playlists: any[] = [];

  return <Playlist playlists={playlists} className={className} />;
};
