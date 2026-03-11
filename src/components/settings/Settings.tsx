import React, { useState } from "react";
import { WebDAVConfig } from "./WebDAVConfig";
import { SyncSettings } from "./SyncSettings";
import { ThemeSettings } from "./ThemeSettings";
import { PlaybackSettings } from "./PlaybackSettings";
import { Settings, Database, Palette, Music } from "lucide-react";
import { useSettingsStore } from "../../store/useSettingsStore";

interface SettingsProps {
  className?: string;
}

export const Settings: React.FC<SettingsProps> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState<"general" | "sync" | "appearance" | "playback">(
    "general"
  );

  const settings = useSettingsStore(state => ({
    theme: state.theme,
  }));

  return (
    <div className={`flex h-full ${className}`}>
      {/* Sidebar */}
      <div className="w-72 p-6 glass-panel border-r-0 border-l-0 border-t-0 border-b-0 border-r border-[#d2d2d7] dark:border-[#48484a] flex flex-col">
        <h2 className="text-2xl font-semibold text-[#1d1d1f] dark:text-white mb-8">Settings</h2>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === "general"
                ? "bg-[#007aff]/10 text-[#007aff]"
                : "hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white"
            }`}
          >
            <Database className="w-5 h-5" />
            <span className="font-medium">General</span>
          </button>

          <button
            onClick={() => setActiveTab("sync")}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === "sync"
                ? "bg-[#007aff]/10 text-[#007aff]"
                : "hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white"
            }`}
          >
            <CloudSync className="w-5 h-5" />
            <span className="font-medium">Sync</span>
          </button>

          <button
            onClick={() => setActiveTab("appearance")}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === "appearance"
                ? "bg-[#007aff]/10 text-[#007aff]"
                : "hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white"
            }`}
          >
            <Palette className="w-5 h-5" />
            <span className="font-medium">Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab("playback")}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === "playback"
                ? "bg-[#007aff]/10 text-[#007aff]"
                : "hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white"
            }`}
          >
            <Music className="w-5 h-5" />
            <span className="font-medium">Playback</span>
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "general" && <WebDAVConfig />}

        {activeTab === "sync" && <SyncSettings />}

        {activeTab === "appearance" && <ThemeSettings />}

        {activeTab === "playback" && <PlaybackSettings />}
      </div>
    </div>
  );
};

const CloudSync = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);
