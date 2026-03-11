import React from "react";
import { Slider } from "../common/Slider";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onChange: (value: number) => void;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onChange,
  className = "",
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (duration === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="text-xs text-[#86868b] dark:text-[#8e8e93] w-10 text-right">
        {formatTime(currentTime)}
      </span>

      <div className="flex-1">
        <Slider value={currentTime} min={0} max={duration} step={0.1} onChange={onChange} />
      </div>

      <span className="text-xs text-[#86868b] dark:text-[#8e8e93] w-10">
        {formatTime(duration)}
      </span>
    </div>
  );
};
