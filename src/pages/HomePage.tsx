import React from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "../components/player/Player";
import { SetupGuide } from "../components/common/SetupGuide";
import { usePlayerStore } from "../store/usePlayerStore";
import { useLibraryStore } from "../store/useLibraryStore";
import { useAppStore } from "../store/useAppStore";
import { Play, Folder, Settings } from "lucide-react";

interface HomePageProps {
  className?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const tracks = useLibraryStore(state => state.tracks);
  const { webdavConfigured, isFirstVisit, showSetupGuide } = useAppStore();

  const [isConfiguring, setIsConfiguring] = React.useState(false);
  const [isBrowsing, setIsBrowsing] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const hasTracks = tracks.length > 0;

  return (
    <div className={`h-screen w-full ${className}`}>
      {!currentTrack ? (
        <main className="h-full w-full flex flex-col items-center justify-center p-8">
          <div className="text-center max-w-md">
            <header className="mb-8">
              <div
                className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#007aff] to-[#5856d6] flex items-center justify-center shadow-lg"
                aria-hidden="true"
              >
                <Play className="w-12 h-12 text-white ml-1" />
              </div>
            </header>

            <h1 className="text-3xl font-bold text-[#1d1d1f] dark:text-white mb-4">
              Welcome to Cloud Music Player
            </h1>

            <p className="text-[#86868b] dark:text-[#8e8e93] mb-8">
              Your personal music player powered by WebDAV
            </p>

            {/* State-aware interface */}
            {!webdavConfigured ? (
              // WebDAV not configured - show setup guide
              <div className="space-y-6 w-full">
                {showSetupGuide ? (
                  <SetupGuide
                    onDismiss={() => {
                      // Handle dismiss - guide will be hidden but can be shown again
                      console.log("Setup guide dismissed");
                    }}
                    onConfigure={() => {
                      // Navigate to settings page
                      window.location.href = "/settings";
                    }}
                    variant={isFirstVisit ? "full" : "compact"}
                  />
                ) : (
                  <div className="glass-card p-6 rounded-xl border-2 border-[#007aff]/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Settings className="w-8 h-8 text-[#007aff]" />
                      <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
                        {isFirstVisit ? "Get Started" : "Setup Required"}
                      </h2>
                    </div>

                    <p className="text-sm text-[#86868b] dark:text-[#8e8e93] mb-4">
                      {isFirstVisit
                        ? "Welcome! To start using the Cloud Music Player, you need to configure your WebDAV server connection."
                        : "WebDAV configuration is required to access your music library."}
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setIsConfiguring(true);
                          // Navigate to settings page
                          navigate("/settings");
                          // Note: We don't reset the state because navigation happens immediately
                        }}
                        disabled={isConfiguring}
                        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                          isFirstVisit
                            ? "bg-gradient-to-r from-[#007aff] to-[#5856d6] text-white hover:from-[#0062cc] hover:to-[#4a48b8] shadow-lg"
                            : "bg-[#007aff] text-white hover:bg-[#0062cc]"
                        } ${isConfiguring ? "opacity-70 cursor-not-allowed" : ""}`}
                        aria-label={
                          isFirstVisit
                            ? "Get started with WebDAV configuration"
                            : "Configure WebDAV connection"
                        }
                      >
                        {isConfiguring ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Configuring...</span>
                          </>
                        ) : (
                          <>
                            <Settings className="w-4 h-4" />
                            {isFirstVisit ? "Get Started" : "Configure WebDAV"}
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          // Show setup guide again
                          useAppStore.getState().setShowSetupGuide(true);
                        }}
                        className="w-full py-2 px-6 text-[#86868b] dark:text-[#8e8e93] rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:scale-95 transform transition-transform"
                        aria-label="Show setup guide"
                      >
                        Show setup guide
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !hasTracks ? (
              // WebDAV configured but no tracks
              <div className="space-y-4">
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Folder className="w-8 h-8 text-[#007aff]" />
                    <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
                      Connect Your Music Library
                    </h2>
                  </div>

                  <p className="text-sm text-[#86868b] dark:text-[#8e8e93] mb-4">
                    WebDAV is configured but no music files were found. Add music to your WebDAV
                    server or browse your library.
                  </p>

                  <button
                    onClick={() => {
                      setIsBrowsing(true);
                      // Navigate to library page
                      navigate("/library");
                    }}
                    disabled={isBrowsing}
                    className={`w-full py-3 px-6 bg-gradient-to-r from-[#34c759] to-[#30d158] text-white rounded-lg font-medium hover:from-[#2ca84e] hover:to-[#28b84e] transition-colors shadow-md flex items-center justify-center gap-2 ${
                      isBrowsing ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    aria-label="Browse music library"
                  >
                    {isBrowsing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      "Browse Library"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // WebDAV configured and has tracks
              <div className="space-y-4">
                <button
                  onClick={() => {
                    if (tracks.length > 0) {
                      setIsPlaying(true);
                      usePlayerStore.getState().setCurrentTrack(tracks[0]);
                      usePlayerStore.getState().play();
                      // Reset playing state after a short delay
                      setTimeout(() => setIsPlaying(false), 1000);
                    }
                  }}
                  disabled={isPlaying || tracks.length === 0}
                  className={`w-full py-4 px-6 bg-gradient-to-r from-[#007aff] to-[#5856d6] text-white rounded-xl font-medium hover:from-[#0062cc] hover:to-[#4a48b8] transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5 ${
                    isPlaying ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  aria-label="Play first track"
                >
                  {isPlaying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Playing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Play First Track
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsBrowsing(true);
                    // Navigate to library page
                    navigate("/library");
                  }}
                  disabled={isBrowsing}
                  className={`w-full py-3 px-6 bg-white dark:bg-gray-800 text-[#1d1d1f] dark:text-white border-2 border-[#007aff]/30 dark:border-[#007aff]/50 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-[#007aff]/50 dark:hover:border-[#007aff]/70 transition-colors flex items-center justify-center gap-2 ${
                    isBrowsing ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  aria-label="Browse music library"
                >
                  {isBrowsing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    "Browse Library"
                  )}
                </button>
              </div>
            )}
          </div>
        </main>
      ) : (
        <Player />
      )}
    </div>
  );
};
