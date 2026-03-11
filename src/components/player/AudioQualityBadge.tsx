import React from "react";
import { AudioFormat } from "../../core/audio/types";

interface AudioQualityBadgeProps {
  format: AudioFormat;
  bitrate?: number;
  className?: string;
}

const formatNames: Record<AudioFormat, string> = {
  MP3: "MP3",
  M4A: "AAC",
  AAC: "AAC",
  FLAC: "FLAC",
  WAV: "WAV",
  OGG: "OGG",
};

const isLossless = (format: AudioFormat): boolean => {
  return format === AudioFormat.FLAC || format === AudioFormat.WAV;
};

export const AudioQualityBadge: React.FC<AudioQualityBadgeProps> = ({
  format,
  bitrate,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isLossless(format)
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
      } ${className}`}
    >
      <span>{formatNames[format]}</span>
      {bitrate && <span>{bitrate} kbps</span>}
      {isLossless(format) && <span className="opacity-70">• Lossless</span>}
    </div>
  );
};
