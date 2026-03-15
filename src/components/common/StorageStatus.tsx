import React, { useState, useEffect } from "react";
import { Database, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { LocalStorageService } from "../../core/storage/LocalStorage";

interface StorageStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const StorageStatus: React.FC<StorageStatusProps> = ({
  className = "",
  showDetails = false,
}) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [storageUsed, setStorageUsed] = useState(0);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [checking, setChecking] = useState(false);

  const checkStorageStatus = () => {
    setChecking(true);

    // Check if localStorage is available
    const available = LocalStorageService.isAvailable();
    setIsAvailable(available);

    if (available) {
      try {
        // Estimate storage usage
        const data = localStorage.getItem("cloud-music-player-data");
        const usage = data ? Math.round((data.length * 2) / 1024) : 0; // Approximate KB
        setStorageUsed(usage);
      } catch (error) {
        console.error("Error checking storage usage:", error);
      }
    }

    setLastCheck(new Date());
    setChecking(false);
  };

  useEffect(() => {
    // Use setTimeout to avoid synchronous state updates in effect
    setTimeout(() => {
      checkStorageStatus();
    }, 0);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!showDetails) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${className} ${
          isAvailable
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
        }`}
      >
        {isAvailable ? (
          <>
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Storage OK</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Storage Issue</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h4 className="font-medium text-[#1d1d1f] dark:text-white">Storage Status</h4>
        </div>
        <button
          onClick={checkStorageStatus}
          disabled={checking}
          className="flex items-center gap-1 text-sm text-[#007aff] hover:text-[#0062cc] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
          <div
            className={`flex items-center gap-1.5 ${
              isAvailable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {isAvailable ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Available</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Unavailable</span>
              </>
            )}
          </div>
        </div>

        {isAvailable && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used</span>
              <span className="text-sm font-medium text-[#1d1d1f] dark:text-white">
                {storageUsed} KB
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-[#007aff] h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(storageUsed / 10, 100)}%` }} // 10KB = 100%
              />
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>Local storage is used to save your preferences and WebDAV configuration.</p>
              {storageUsed > 50 && (
                <p className="mt-1 text-amber-600 dark:text-amber-400">
                  ⚠️ Storage usage is getting high. Consider clearing unused data.
                </p>
              )}
            </div>
          </>
        )}

        {!isAvailable && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
            <p className="font-medium mb-1">Storage is not available</p>
            <p className="text-xs">This may be due to:</p>
            <ul className="text-xs list-disc pl-4 mt-1 space-y-1">
              <li>Private/Incognito browsing mode</li>
              <li>Browser storage permissions</li>
              <li>Storage quota exceeded</li>
            </ul>
            <p className="text-xs mt-2">Your settings will not be saved between sessions.</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>Last checked</span>
          <span>{formatTime(lastCheck)}</span>
        </div>
      </div>
    </div>
  );
};
