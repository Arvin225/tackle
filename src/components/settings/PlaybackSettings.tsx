import React, { useState } from "react";
import { Button } from "../common/Button";
import { Slider } from "../common/Slider";
import { Volume2, Zap } from "lucide-react";
import { useSettingsStore } from "../../store/useSettingsStore";

interface PlaybackSettingsProps {
  className?: string;
}

export const PlaybackSettings: React.FC<PlaybackSettingsProps> = ({ className = "" }) => {
  const settings = useSettingsStore(state => ({
    volume: state.volume,
    setVolume: state.setVolume,
    crossfade: state.crossfade,
    setCrossfade: state.setCrossfade,
    gaplessPlayback: state.gaplessPlayback,
    setGaplessPlayback: state.setGaplessPlayback,
    preloadAhead: state.preloadAhead,
    setPreloadAhead: state.setPreloadAhead,
  }));

  const [tempVolume, setTempVolume] = useState(settings.volume);
  const [tempCrossfade, setTempCrossfade] = useState(settings.crossfade);
  const [tempPreload, setTempPreload] = useState(settings.preloadAhead);

  const handleVolumeChange = (value: number) => {
    setTempVolume(value);
    settings.setVolume(value);
  };

  const handleCrossfadeChange = (value: number) => {
    setTempCrossfade(value);
    settings.setCrossfade(value);
  };

  const handlePreloadChange = (value: number) => {
    setTempPreload(value);
    settings.setPreloadAhead(value);
  };

  const handleGaplessToggle = () => {
    settings.setGaplessPlayback(!settings.gaplessPlayback);
  };

  const saveSettings = () => {
    // Settings are auto-saved
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-[#007aff]" />
          <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white">
            Playback Settings
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-[#1d1d1f] dark:text-white">Volume</h3>
              <p className="text-sm text-[#86868b] dark:text-[#8e8e93]">Default playback volume</p>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#86868b] dark:text-[#8e8e93]" />
              <span className="text-sm font-medium text-[#1d1d1f] dark:text-white">
                {Math.round(tempVolume * 100)}%
              </span>
            </div>
          </div>

          <Slider value={tempVolume} min={0} max={1} step={0.01} onChange={handleVolumeChange} />
        </div>

        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-[#1d1d1f] dark:text-white">Crossfade Duration</h3>
              <p className="text-sm text-[#86868b] dark:text-[#8e8e93]">
                Smooth transition between tracks (seconds)
              </p>
            </div>
            <span className="text-sm font-medium text-[#1d1d1f] dark:text-white">
              {tempCrossfade}s
            </span>
          </div>

          <Slider
            value={tempCrossfade}
            min={0}
            max={10}
            step={0.5}
            onChange={handleCrossfadeChange}
          />

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => settings.setCrossfade(0)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tempCrossfade === 0
                  ? "bg-[#007aff] text-white"
                  : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white"
              }`}
            >
              Off
            </button>
            <button
              onClick={() => settings.setCrossfade(2)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tempCrossfade === 2
                  ? "bg-[#007aff] text-white"
                  : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white"
              }`}
            >
              2s
            </button>
            <button
              onClick={() => settings.setCrossfade(5)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tempCrossfade === 5
                  ? "bg-[#007aff] text-white"
                  : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white"
              }`}
            >
              5s
            </button>
            <button
              onClick={() => settings.setCrossfade(10)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tempCrossfade === 10
                  ? "bg-[#007aff] text-white"
                  : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white"
              }`}
            >
              10s
            </button>
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-[#1d1d1f] dark:text-white">Preload Ahead</h3>
              <p className="text-sm text-[#86868b] dark:text-[#8e8e93]">
                How far ahead to preload next tracks
              </p>
            </div>
            <span className="text-sm font-medium text-[#1d1d1f] dark:text-white">
              {tempPreload}s
            </span>
          </div>

          <Slider value={tempPreload} min={5} max={30} step={5} onChange={handlePreloadChange} />

          <p className="text-xs text-[#86868b] dark:text-[#8e8e93] mt-3">
            Higher values use more bandwidth but reduce playback interruptions
          </p>
        </div>

        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-[#1d1d1f] dark:text-white">Gapless Playback</h3>
              <p className="text-sm text-[#86868b] dark:text-[#8e8e93]">
                Seamless transition between tracks
              </p>
            </div>
            <button
              onClick={handleGaplessToggle}
              className={`w-12 h-7 rounded-full transition-colors ${
                settings.gaplessPlayback ? "bg-[#007aff]" : "bg-[#d2d2d7] dark:bg-[#48484a]"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.gaplessPlayback ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <Button variant="secondary" onClick={saveSettings}>
        Save All Settings
      </Button>
    </div>
  );
};
