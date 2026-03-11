import React from "react";
import { Playlist } from "../components/playlist/Playlist";

interface PlaylistPageProps {
  className?: string;
}

export const PlaylistPage: React.FC<PlaylistPageProps> = ({ className = "" }) => {
  return <Playlist className={className} />;
};
