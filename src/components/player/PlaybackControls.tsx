import React from "react";
import { Button } from "../common/Button";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffleToggle: () => void;
  onLoopToggle: () => void;
  shuffleEnabled: boolean;
  loopEnabled: boolean;
  className?: string;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffleToggle,
  onLoopToggle,
  shuffleEnabled,
  loopEnabled,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center gap-6 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrevious}
        className="text-[#86868b] dark:text-[#8e8e93] hover:text-[#1d1d1f] dark:hover:text-white"
      >
        <SkipBack className="w-5 h-5" />
      </Button>

      <Button
        variant="primary"
        size="lg"
        onClick={onPlayPause}
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl"
      >
        {isPlaying ? <Pause className="w-6 h-6 ml-0.5" /> : <Play className="w-6 h-6 ml-1" />}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        className="text-[#86868b] dark:text-[#8e8e93] hover:text-[#1d1d1f] dark:hover:text-white"
      >
        <SkipForward className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onShuffleToggle}
          className={`${
            shuffleEnabled
              ? "text-[#007aff] dark:text-[#007aff]"
              : "text-[#86868b] dark:text-[#8e8e93]"
          } hover:text-[#1d1d1f] dark:hover:text-white`}
        >
          <Shuffle className={`w-5 h-5 ${shuffleEnabled ? "fill-current" : ""}`} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLoopToggle}
          className={`${
            loopEnabled
              ? "text-[#007aff] dark:text-[#007aff]"
              : "text-[#86868b] dark:text-[#8e8e93]"
          } hover:text-[#1d1d1f] dark:hover:text-white`}
        >
          <Repeat className={`w-5 h-5 ${loopEnabled ? "fill-current" : ""}`} />
        </Button>
      </div>
    </div>
  );
};
