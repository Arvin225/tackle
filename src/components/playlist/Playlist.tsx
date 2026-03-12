import React, { useState } from "react";
import { Playlist as PlaylistType } from "../../core/audio/types";
import { PlaylistItem } from "./PlaylistItem";
import { PlaylistEditor } from "./PlaylistEditor";
import { Plus, Play } from "lucide-react";

interface PlaylistProps {
  playlists: PlaylistType[];
  onPlay?: (playlistId: string) => void;
  onAddTrack?: (playlistId: string, trackId: string) => void;
  onRemoveTrack?: (playlistId: string, trackId: string) => void;
  onDelete?: (playlistId: string) => void;
  onSavePlaylist?: (playlist: PlaylistType) => void;
  className?: string;
}

export const Playlist: React.FC<PlaylistProps> = ({
  playlists,
  onPlay,
  onDelete,
  onSavePlaylist,
  className = "",
}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistType | undefined>();

  const handleEditPlaylist = (playlist: PlaylistType) => {
    setEditingPlaylist(playlist);
    setShowEditor(true);
  };

  const handleCreatePlaylist = () => {
    setEditingPlaylist(undefined);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingPlaylist(undefined);
  };

  return (
    <div className={`flex h-full ${className}`}>
      {/* Playlist List */}
      <div className="w-80 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#d2d2d7] dark:border-[#48484a]">
          <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
            Playlists ({playlists.length})
          </h2>
          <button
            onClick={handleCreatePlaylist}
            className="p-2 rounded-full bg-[#007aff] text-white hover:bg-[#0062cc] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {playlists.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <Plus className="w-12 h-12 mx-auto text-[#aeaeb2] dark:text-[#636366] mb-4" />
                <p className="text-[#86868b] dark:text-[#8e8e93]">No playlists yet</p>
                <p className="text-xs text-[#aeaeb2] dark:text-[#636366] mt-2">
                  Create your first playlist
                </p>
              </div>
            </div>
          ) : (
            playlists.map(playlist => (
              <button
                key={playlist.id}
                onClick={() => setSelectedPlaylist(playlist)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                  selectedPlaylist?.id === playlist.id
                    ? "bg-[#007aff]/10"
                    : "hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 text-[#86868b] dark:text-[#8e8e93]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate text-[#1d1d1f] dark:text-white">
                    {playlist.name}
                  </h3>
                  <p className="text-xs text-[#86868b] dark:text-[#8e8e93]">
                    {playlist.tracks.length} tracks
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Playlist Content */}
      {selectedPlaylist ? (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-[#d2d2d7] dark:border-[#48484a]">
            <div>
              <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
                {selectedPlaylist.name}
              </h2>
              <p className="text-xs text-[#86868b] dark:text-[#8e8e93]">
                {selectedPlaylist.tracks.length} tracks
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditPlaylist(selectedPlaylist)}
                className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#86868b] dark:text-[#8e8e93]" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedPlaylist.tracks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-[#86868b] dark:text-[#8e8e93]">No tracks in this playlist</p>
              </div>
            ) : (
              <PlaylistItem playlist={selectedPlaylist} onPlay={onPlay} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#86868b] dark:text-[#8e8e93]">Select a playlist to view details</p>
        </div>
      )}

      {/* Playlist Editor */}
      {showEditor && editingPlaylist && (
        <PlaylistEditor
          playlist={editingPlaylist}
          onSave={onSavePlaylist || (() => {})}
          onDelete={onDelete}
          onClose={handleCloseEditor}
          existingTracks={[]}
        />
      )}

      {showEditor && !editingPlaylist && (
        <PlaylistEditor
          playlist={undefined}
          onSave={onSavePlaylist || (() => {})}
          onDelete={undefined}
          onClose={handleCloseEditor}
          existingTracks={[]}
        />
      )}
    </div>
  );
};
