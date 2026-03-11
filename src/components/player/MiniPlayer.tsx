import React from "react";
import { AlbumCover } from "./AlbumCover";
import { TrackInfo } from "./TrackInfo";
import { PlaybackControls } from "./PlaybackControls";
import { VolumeControl } from "./VolumeControl";
import { ProgressBar } from "./ProgressBar";
import { usePlayerStore } from "../../store/usePlayerStore";
import { Track } from "../../core/audio/types";

interface MiniPlayerProps {
  className?: string;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ className = "" }) => {
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const volume = usePlayerStore(state => state.volume);
  const isMuted = usePlayerStore(state => state.isMuted);
  const playbackMode = usePlayerStore(state => state.playbackMode);

  const shuffleEnabled = playbackMode === "SHUFFLE";
  const loopEnabled = playbackMode === "QUEUE_LOOP" || playbackMode === "SINGLE_LOOP";

  const handlePlayPause = usePlayerStore(state => state.togglePlay);
  const handlePrevious = usePlayerStore(state => {
    const queue = state.queue;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex > 0) {
      return () => state.setCurrentTrack(queue[currentIndex - 1]);
    }
    return () => {};
  });
  const handleNext = usePlayerStore(state => {
    const queue = state.queue;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex < queue.length - 1) {
      return () => state.setCurrentTrack(queue[currentIndex + 1]);
    }
    return () => {};
  });
  const handleShuffleToggle = usePlayerStore(state => state.setPlaybackMode);
  const handleLoopToggle = usePlayerStore(state => state.setPlaybackMode);
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
          onPrevious={handlePrevious()}
          onNext={handleNext()}
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
