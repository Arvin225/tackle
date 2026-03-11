import React, { useState } from "react";
import { Button } from "../common/Button";
import { Switch } from "../common/Switch";
import { CloudSync, RefreshCw, Save } from "lucide-react";
import { useSync } from "../../hooks/useSync";
import { useSettingsStore } from "../../store/useSettingsStore";

interface SyncSettingsProps {
  className?: string;
}

export const SyncSettings: React.FC<SyncSettingsProps> = ({ className = "" }) => {
  const syncStatus = useSync();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const settings = useSettingsStore(state => ({
    sync: state.sync,
    setSync: state.setSync,
    syncOnStartup: state.syncOnStartup,
    setSyncOnStartup: state.setSyncOnStartup,
  }));

  const handleSyncNow = async () => {
    setSyncing(true);
    try {
      await syncStatus.sync();
      setLastSync(new Date().toLocaleString());
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveSettings = () => {
    // Settings are auto-saved by Zustand
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <CloudSync className="w-6 h-6 text-[#007aff]" />
          <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white">Sync Settings</h2>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium text-[#1d1d1f] dark:text-white">Sync on Startup</h3>
              <p className="text-sm text-[#86868b] dark:text-[#8e8e93]">
                Automatically sync with WebDAV when app starts
              </p>
            </div>
            <Switch checked={settings.syncOnStartup} onChange={settings.setSyncOnStartup} />
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg">
          <h3 className="font-medium text-[#1d1d1f] dark:text-white mb-3">Manual Sync</h3>
          <p className="text-sm text-[#86868b] dark:text-[#8e8e93] mb-4">
            Manually sync your data with WebDAV server
          </p>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={handleSyncNow}
              isLoading={syncing}
              disabled={!syncStatus.isConnected}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </Button>

            {syncStatus.isConnected && lastSync && (
              <span className="text-sm text-[#86868b] dark:text-[#8e8e93]">
                Last sync: {lastSync}
              </span>
            )}
          </div>
        </div>

        {syncStatus.status === "syncing" && (
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#007aff] animate-spin" />
              <span className="text-sm text-[#1d1d1f] dark:text-white">Syncing data...</span>
            </div>
          </div>
        )}

        {syncStatus.status === "error" && (
          <div className="glass-card p-4 rounded-lg border-l-4 border-red-500">
            <p className="text-sm text-[#1d1d1f] dark:text-white">
              Sync failed: {syncStatus.error}
            </p>
          </div>
        )}

        {syncStatus.status === "success" && lastSync && (
          <div className="glass-card p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <RefreshCw className="w-5 h-5" />
              <span className="text-sm">Sync completed successfully at {lastSync}</span>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card p-4 rounded-lg">
        <h3 className="font-medium text-[#1d1d1f] dark:text-white mb-3">Synced Data Types</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-[#86868b] dark:text-[#8e8e93]">
            <span className="w-2 h-2 bg-[#007aff] rounded-full"></span>
            Playlists
          </li>
          <li className="flex items-center gap-2 text-sm text-[#86868b] dark:text-[#8e8e93]">
            <span className="w-2 h-2 bg-[#007aff] rounded-full"></span>
            Favorites
          </li>
          <li className="flex items-center gap-2 text-sm text-[#86868b] dark:text-[#8e8e93]">
            <span className="w-2 h-2 bg-[#007aff] rounded-full"></span>
            Playback State
          </li>
          <li className="flex items-center gap-2 text-sm text-[#86868b] dark:text-[#8e8e93]">
            <span className="w-2 h-2 bg-[#007aff] rounded-full"></span>
            Settings
          </li>
        </ul>
      </div>

      <Button variant="secondary" onClick={handleSaveSettings}>
        <Save className="w-4 h-4 mr-2" />
        Save All Settings
      </Button>
    </div>
  );
};
