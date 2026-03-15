import React, { useState } from "react";
import { Playlist, Track } from "../../core/audio/types";
import { Button } from "../common/Button";
import { X, Trash2, Save, Play } from "lucide-react";

interface PlaylistEditorProps {
  playlist?: Playlist;
  onSave: (playlist: Playlist) => void;
  onDelete?: (playlistId: string) => void;
  onClose: () => void;
  existingTracks: Track[];
  className?: string;
}

export const PlaylistEditor: React.FC<PlaylistEditorProps> = ({
  playlist,
  onSave,
  onDelete,
  onClose,
  existingTracks,
  className = "",
}) => {
  const [name, setName] = useState(playlist?.name || "");
  const [description, setDescription] = useState(playlist?.description || "");
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>(playlist?.trackIds || []);

  const handleSave = () => {
    if (!name.trim()) return;

    // Get tracks from selected IDs
    const tracks = existingTracks.filter(track => selectedTrackIds.includes(track.id));

    const newPlaylist: Playlist = {
      id: playlist?.id || `playlist-${Date.now()}`,
      name: name.trim(),
      tracks,
      createdAt: playlist?.createdAt || Date.now(),
      updatedAt: Date.now(),
      description: description.trim() || undefined,
      trackCount: selectedTrackIds.length,
      coverUrl: playlist?.coverUrl,
      trackIds: selectedTrackIds,
    };

    onSave(newPlaylist);
  };

  const handleDelete = () => {
    if (playlist && onDelete) {
      onDelete(playlist.id);
    }
  };

  const toggleTrack = (trackId: string) => {
    setSelectedTrackIds(prev =>
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#d2d2d7] dark:border-[#48484a]">
        <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
          {playlist ? "Edit Playlist" : "New Playlist"}
        </h2>
        <div className="flex items-center gap-2">
          {onDelete && playlist && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-[#ff3b30]/10 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-[#ff3b30]" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
          >
            <X className="w-4 h-4 text-[#86868b] dark:text-[#8e8e93]" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] dark:text-white mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Playlist name"
            className="w-full px-4 py-2 rounded-lg glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] dark:text-white mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg glass-input text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] dark:text-white mb-2">
            Tracks ({selectedTrackIds.length})
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {existingTracks.length === 0 ? (
              <p className="text-sm text-[#86868b] dark:text-[#8e8e93]">No tracks available</p>
            ) : (
              existingTracks.map(track => (
                <button
                  key={track.id}
                  onClick={() => toggleTrack(track.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    selectedTrackIds.includes(track.id)
                      ? "bg-[#007aff]/10 border border-[#007aff]"
                      : "hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
                  }`}
                >
                  <Play className="w-4 h-4 text-[#86868b] dark:text-[#8e8e93]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-[#1d1d1f] dark:text-white">
                      {track.title || "Unknown Track"}
                    </p>
                    <p className="text-xs text-[#86868b] dark:text-[#8e8e93] truncate">
                      {track.artist || "Unknown Artist"}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-4 border-t border-[#d2d2d7] dark:border-[#48484a]">
        <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>
          <Save className="w-4 h-4 mr-2" />
          Save Playlist
        </Button>
      </div>
    </div>
  );
};
