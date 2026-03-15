import React from "react";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  showValue = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-2 bg-[#d2d2d7] rounded-full appearance-none cursor-pointer dark:bg-[#48484a] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#007aff] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-95 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#007aff] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:active:scale-95"
        style={{
          appearance: "none",
        }}
        {...props}
      />
      {showValue && (
        <span className="text-sm text-[#86868b] dark:text-[#8e8e93] w-12 text-right">{value}</span>
      )}
    </div>
  );
};

interface VolumeSliderProps extends SliderProps {
  onMuteToggle?: () => void;
  isMuted: boolean;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({ isMuted, onMuteToggle, ...props }) => {
  return (
    <div className="flex items-center gap-2">
      {isMuted ? (
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
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            clipRule="evenodd"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      ) : (
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
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      )}
      <div className="flex-1">
        <Slider {...props} />
      </div>
      <button
        onClick={onMuteToggle}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
      >
        <svg
          className={`w-4 h-4 ${isMuted ? "text-[#ff3b30]" : "text-[#86868b]"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      </button>
    </div>
  );
};
