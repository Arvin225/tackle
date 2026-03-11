import React from "react";

interface LyricLineProps {
  text: string;
  isActive: boolean;
  timestamp?: number;
  onClick?: () => void;
  className?: string;
}

export const LyricLine: React.FC<LyricLineProps> = ({
  text,
  isActive,
  timestamp,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
        isActive
          ? "bg-[#007aff]/10 text-[#007aff] font-medium"
          : "text-[#86868b] dark:text-[#8e8e93] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
      } ${className}`}
    >
      {text}
    </button>
  );
};
