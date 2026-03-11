import React, { useState, useEffect } from "react";
import { AlbumCover } from "./AlbumCover";
import { TrackInfo } from "./TrackInfo";
import { PlaybackControls } from "./PlaybackControls";
import { VolumeControl } from "./VolumeControl";
import { ProgressBar } from "./ProgressBar";
import { AudioQualityBadge } from "./AudioQualityBadge";
import { usePlayerStore } from "../../store/usePlayerStore";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { Track, PlaybackMode } from "../../core/audio/types";
import { Play, Pause, SkipBack, SkipForward, Volume2, ChevronDown } from "lucide-react";

interface PlayerProps {
  className?: string;
}

export const Player: React.FC<PlayerProps> = ({ className = "" }) => {
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const volume = usePlayerStore(state => state.volume);
  const isMuted = usePlayerStore(state => state.isMuted);
  const playbackMode = usePlayerStore(state => state.playbackMode);
  const play = usePlayerStore(state => state.play);
  const pause = usePlayerStore(state => state.pause);
  const stop = usePlayerStore(state => state.stop);
  const setCurrentTrack = usePlayerStore(state => state.setCurrentTrack);

  const { currentTime, duration, seek } = useAudioPlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const shuffleEnabled = playbackMode === PlaybackMode.SHUFFLE;
  const loopEnabled =
    playbackMode === PlaybackMode.QUEUE_LOOP || playbackMode === PlaybackMode.SINGLE_LOOP;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handlePrevious = () => {
    const queue = usePlayerStore.getState().queue;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex > 0) {
      setCurrentTrack(queue[currentIndex - 1]);
    } else {
      setCurrentTrack(queue[0]);
    }
  };

  const handleNext = () => {
    const queue = usePlayerStore.getState().queue;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex < queue.length - 1) {
      setCurrentTrack(queue[currentIndex + 1]);
    } else if (playbackMode === PlaybackMode.QUEUE_LOOP) {
      setCurrentTrack(queue[0]);
    }
  };

  const handleShuffleToggle = () => {
    if (playbackMode === PlaybackMode.SEQUENTIAL) {
      usePlayerStore.getState().setPlaybackMode(PlaybackMode.SHUFFLE);
    } else {
      usePlayerStore.getState().setPlaybackMode(PlaybackMode.SEQUENTIAL);
    }
  };

  const handleLoopToggle = () => {
    if (playbackMode === PlaybackMode.SEQUENTIAL) {
      usePlayerStore.getState().setPlaybackMode(PlaybackMode.QUEUE_LOOP);
    } else if (playbackMode === PlaybackMode.QUEUE_LOOP) {
      usePlayerStore.getState().setPlaybackMode(PlaybackMode.SINGLE_LOOP);
    } else {
      usePlayerStore.getState().setPlaybackMode(PlaybackMode.SEQUENTIAL);
    }
  };

  const handleVolumeChange = (value: number) => {
    usePlayerStore.getState().setVolume(value);
  };

  const handleMuteToggle = () => {
    usePlayerStore.getState().toggleMute();
  };

  const handleSeek = (value: number) => {
    seek(value);
  };

  const handleStop = () => {
    stop();
  };

  if (!currentTrack) {
    return (
      <div className={`h-screen w-full flex flex-col items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-[#d2d2d7] dark:text-[#48484a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-2">
            No Track Playing
          </h2>
          <p className="text-[#86868b] dark:text-[#8e8e93]">
            Select a track from the library to start playing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
          >
            <ChevronDown
              className={`w-6 h-6 text-[#86868b] dark:text-[#8e8e93] transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {currentTrack.format && <AudioQualityBadge format={currentTrack.format} />}
        </div>

        <div className="w-16"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-8">
            <AlbumCover track={currentTrack} size="xl" showBlur={true} />
          </div>

          <div className="mb-6">
            <TrackInfo track={currentTrack} />
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <ProgressBar currentTime={currentTime} duration={duration} onChange={handleSeek} />
          </div>

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

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={handleStop}
              className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
            >
              <Pause className="w-5 h-5 text-[#86868b] dark:text-[#8e8e93]" />
            </button>

            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={handleMuteToggle}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4">
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-[#86868b] dark:text-[#8e8e93]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1d1d1f] dark:text-white">
                  WebDAV Cloud Player
                </p>
                <p className="text-xs text-[#86868b] dark:text-[#8e8e93]">
                  {isPlaying ? "Playing from AList" : "Ready to play"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors">
                <svg
                  className="w-5 h-5 text-[#86868b] dark:text-[#8e8e93]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors">
                <svg
                  className="w-5 h-5 text-[#86868b] dark:text-[#8e8e93]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
