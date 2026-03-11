import React from "react";
import { VolumeSlider } from "../common/Slider";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number) => void;
  onMuteToggle: () => void;
  className?: string;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <VolumeSlider
        value={isMuted ? 0 : volume}
        min={0}
        max={1}
        step={0.01}
        onChange={onVolumeChange}
        isMuted={isMuted}
        onMuteToggle={onMuteToggle}
      />
    </div>
  );
};
