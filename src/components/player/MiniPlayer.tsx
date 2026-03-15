import React from "react";
import { AlbumCover } from "./AlbumCover";
import { TrackInfo } from "./TrackInfo";
import { PlaybackControls } from "./PlaybackControls";
import { VolumeControl } from "./VolumeControl";
import { ProgressBar } from "./ProgressBar";
import { usePlayerStore } from "../../store/usePlayerStore";
import { PlaybackMode } from "../../core/audio/types";

interface MiniPlayerProps {
  className?: string;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ className = "" }) => {
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const volume = usePlayerStore(state => state.volume);
  const isMuted = usePlayerStore(state => state.isMuted);
  const playbackMode = usePlayerStore(state => state.playbackMode);

  const shuffleEnabled = playbackMode === PlaybackMode.SHUFFLE;
  const loopEnabled =
    playbackMode === PlaybackMode.QUEUE_LOOP || playbackMode === PlaybackMode.SINGLE_LOOP;

  const handlePlayPause = usePlayerStore(state => state.togglePlay);
  const handlePrevious = () => {
    const state = usePlayerStore.getState();
    const queue = state.queue;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex > 0) {
      state.setCurrentTrack(queue[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const state = usePlayerStore.getState();
    const queue = state.queue;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex < queue.length - 1) {
      state.setCurrentTrack(queue[currentIndex + 1]);
    }
  };
  const setPlaybackMode = usePlayerStore(state => state.setPlaybackMode);

  const handleShuffleToggle = () => {
    setPlaybackMode(shuffleEnabled ? PlaybackMode.SEQUENTIAL : PlaybackMode.SHUFFLE);
  };

  const handleLoopToggle = () => {
    if (!loopEnabled) {
      setPlaybackMode(PlaybackMode.QUEUE_LOOP);
    } else if (playbackMode === PlaybackMode.QUEUE_LOOP) {
      setPlaybackMode(PlaybackMode.SINGLE_LOOP);
    } else {
      setPlaybackMode(PlaybackMode.SEQUENTIAL);
    }
  };
  const handleVolumeChange = usePlayerStore(state => state.setVolume);
  const handleMuteToggle = usePlayerStore(state => state.toggleMute);

  return (
    <div className={`glass-panel p-3 flex items-center gap-3 ${className}`}>
      <div className="flex-shrink-0">
        <AlbumCover track={currentTrack || { id: "", url: "" }} size="sm" showBlur={false} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <TrackInfo track={currentTrack || { id: "", url: "" }} className="truncate" />
        <ProgressBar currentTime={0} duration={currentTrack?.duration || 0} onChange={() => {}} />
      </div>

      <div className="flex items-center gap-3">
        <PlaybackControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onShuffleToggle={handleShuffleToggle}
          onLoopToggle={handleLoopToggle}
          shuffleEnabled={shuffleEnabled}
          loopEnabled={loopEnabled}
        />

        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={handleMuteToggle}
        />
      </div>
    </div>
  );
};
