import React, { useState } from "react";

import { Moon, Sun, Monitor } from "lucide-react";
import { useSettingsStore } from "../../store/useSettingsStore";

interface ThemeSettingsProps {
  className?: string;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ className = "" }) => {
  const [_manualTheme, setManualTheme] = useState<"light" | "dark" | "system">("system");
  const settings = useSettingsStore(state => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }));

  const handleSetTheme = (newTheme: "light" | "dark" | "system") => {
    setManualTheme(newTheme);
    settings.setTheme(newTheme);
  };

  const isSystem = settings.theme === "system";
  const isDark = settings.theme === "dark";
  const isLight = settings.theme === "light";

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="w-6 h-6 text-[#007aff]" />
          <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white">Theme</h2>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleSetTheme("system")}
            className={`glass-card p-4 rounded-lg text-center transition-all ${
              isSystem
                ? "bg-[#007aff]/10 border-2 border-[#007aff]"
                : "hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
            }`}
          >
            <Monitor
              className={`w-8 h-8 mx-auto mb-2 ${
                isSystem ? "text-[#007aff]" : "text-[#86868b] dark:text-[#8e8e93]"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                isSystem ? "text-[#007aff]" : "text-[#86868b] dark:text-[#8e8e93]"
              }`}
            >
              System
            </p>
            {isSystem && (
              <p className="text-xs text-[#86868b] dark:text-[#8e8e93] mt-1">
                Follow system preference
              </p>
            )}
          </button>

          <button
            onClick={() => handleSetTheme("light")}
            className={`glass-card p-4 rounded-lg text-center transition-all ${
              isLight
                ? "bg-[#007aff]/10 border-2 border-[#007aff]"
                : "hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
            }`}
          >
            <Sun
              className={`w-8 h-8 mx-auto mb-2 ${
                isLight ? "text-[#007aff]" : "text-[#86868b] dark:text-[#8e8e93]"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                isLight ? "text-[#007aff]" : "text-[#86868b] dark:text-[#8e8e93]"
              }`}
            >
              Light
            </p>
            {isLight && (
              <p className="text-xs text-[#86868b] dark:text-[#8e8e93] mt-1">Always light</p>
            )}
          </button>

          <button
            onClick={() => handleSetTheme("dark")}
            className={`glass-card p-4 rounded-lg text-center transition-all ${
              isDark
                ? "bg-[#007aff]/10 border-2 border-[#007aff]"
                : "hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
            }`}
          >
            <Moon
              className={`w-8 h-8 mx-auto mb-2 ${
                isDark ? "text-[#007aff]" : "text-[#86868b] dark:text-[#8e8e93]"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                isDark ? "text-[#007aff]" : "text-[#86868b] dark:text-[#8e8e93]"
              }`}
            >
              Dark
            </p>
            {isDark && (
              <p className="text-xs text-[#86868b] dark:text-[#8e8e93] mt-1">Always dark</p>
            )}
          </button>
        </div>

        {isSystem && (
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center">
                <Monitor className="w-5 h-5 text-[#86868b] dark:text-[#8e8e93]" />
              </div>
              <div>
                <h4 className="font-medium text-[#1d1d1f] dark:text-white">
                  Using System Preference
                </h4>
                <p className="text-sm text-[#86868b] dark:text-[#8e8e93]">
                  The theme will automatically follow your system settings
                </p>
              </div>
            </div>
          </div>
        )}

        {isLight && (
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                <Sun className="w-5 h-5 text-[#86868b]" />
              </div>
              <div>
                <h4 className="font-medium text-[#1d1d1f] dark:text-white">Light Mode Enabled</h4>
                <p className="text-sm text-[#86868b] dark:text-[#8e8e93]">
                  Your interface will always appear in light theme
                </p>
              </div>
            </div>
          </div>
        )}

        {isDark && (
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2c2c2e] flex items-center justify-center">
                <Moon className="w-5 h-5 text-[#8e8e93]" />
              </div>
              <div>
                <h4 className="font-medium text-[#1d1d1f] dark:text-white">Dark Mode Enabled</h4>
                <p className="text-sm text-[#86868b] dark:text-[#8e8e93]">
                  Your interface will always appear in dark theme
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card p-4 rounded-lg">
        <h3 className="font-medium text-[#1d1d1f] dark:text-white mb-3">Theme Preview</h3>
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-lg shadow-md flex items-center justify-center ${
              isDark ? "bg-[#2c2c2e]" : "bg-[#f5f5f7]"
            }`}
          >
            <Sun className={`w-6 h-6 ${isDark ? "text-[#8e8e93]" : "text-[#86868b]"}`} />
          </div>
          <div className="flex-1">
            <div className={`h-4 rounded w-3/4 mb-2 ${isDark ? "bg-[#48484a]" : "bg-[#d2d2d7]"}`} />
            <div className={`h-4 rounded w-1/2 ${isDark ? "bg-[#48484a]" : "bg-[#d2d2d7]"}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
