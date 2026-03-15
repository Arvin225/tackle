import React, { useState } from "react";
import FolderNavigator from "./FolderNavigator";
import { TrackList } from "./TrackList";
import { SearchBar } from "./SearchBar";
import { AlbumList } from "./AlbumList";
import { ArtistList } from "./ArtistList";
import { useLibraryStore } from "../../store/useLibraryStore";
import { usePlayerStore } from "../../store/usePlayerStore";

interface LibraryProps {
  className?: string;
}

export const Library: React.FC<LibraryProps> = ({ className = "" }) => {
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedTrackId, setSelectedTrackId] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"files" | "albums" | "artists">("files");

  const tracks = useLibraryStore(state => state.tracks);
  const albums = useLibraryStore(state => state.albums);
  const artists = useLibraryStore(state => state.artists);
  const setCurrentTrack = usePlayerStore(state => state.setCurrentTrack);

  const handleTrackClick = (trackId: string) => {
    setSelectedTrackId(trackId);
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      setCurrentTrack(track);
    }
  };

  const handlePlayAlbum = (albumId: string) => {
    const albumTracks = tracks.filter(t => t.albumId === albumId);
    if (albumTracks.length > 0) {
      usePlayerStore.getState().setQueue(albumTracks);
      usePlayerStore.getState().setCurrentTrack(albumTracks[0]);
      usePlayerStore.getState().play();
    }
  };

  const handleArtistClick = (artistName: string) => {
    const artistTracks = tracks.filter(t => t.artist === artistName);
    if (artistTracks.length > 0) {
      usePlayerStore.getState().setQueue(artistTracks);
      usePlayerStore.getState().setCurrentTrack(artistTracks[0]);
      usePlayerStore.getState().play();
    }
  };

  const filteredTracks = searchQuery
    ? tracks.filter(
        track =>
          track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.album?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tracks;

  // Convert string arrays to object arrays for components
  const albumObjects = albums.map(albumName => ({
    id: albumName,
    name: albumName,
    artist: tracks.find(t => t.album === albumName)?.artist || "Unknown Artist",
    coverUrl: tracks.find(t => t.album === albumName)?.coverUrl,
  }));

  const artistObjects = artists.map(artistName => ({
    id: artistName,
    name: artistName,
    coverUrl: tracks.find(t => t.artist === artistName)?.coverUrl,
  }));

  const filteredAlbums = searchQuery
    ? albumObjects.filter(
        album =>
          album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          album.artist?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : albumObjects;

  const filteredArtists = searchQuery
    ? artistObjects.filter(artist => artist.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : artistObjects;

  return (
    <div className={`flex h-full ${className}`}>
      {/* Sidebar */}
      <div className="w-64 p-4 glass-panel border-r-0 border-l-0 border-t-0 border-b-0 border-r border-[#d2d2d7] dark:border-[#48484a] flex flex-col">
        <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-6">Library</h2>

        <FolderNavigator currentPath={currentPath} onPathChange={setCurrentPath} />

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search library..."
            />
          </div>

          <div className="flex items-center gap-2 border-b border-[#d2d2d7] dark:border-[#48484a] mb-4">
            <button
              onClick={() => setActiveTab("files")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                activeTab === "files"
                  ? "text-[#007aff] border-b-2 border-[#007aff]"
                  : "text-[#86868b] dark:text-[#8e8e93]"
              }`}
            >
              Files
            </button>
            <button
              onClick={() => setActiveTab("albums")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                activeTab === "albums"
                  ? "text-[#007aff] border-b-2 border-[#007aff]"
                  : "text-[#86868b] dark:text-[#8e8e93]"
              }`}
            >
              Albums
            </button>
            <button
              onClick={() => setActiveTab("artists")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                activeTab === "artists"
                  ? "text-[#007aff] border-b-2 border-[#007aff]"
                  : "text-[#86868b] dark:text-[#8e8e93]"
              }`}
            >
              Artists
            </button>
          </div>

          {activeTab === "files" && (
            <TrackList
              tracks={filteredTracks}
              onItemClick={handleTrackClick}
              selectedTrackId={selectedTrackId}
            />
          )}

          {activeTab === "albums" && (
            <AlbumList albums={filteredAlbums} onAlbumClick={handlePlayAlbum} />
          )}

          {activeTab === "artists" && (
            <ArtistList artists={filteredArtists} onArtistClick={handleArtistClick} />
          )}
        </div>
      </div>
    </div>
  );
};
