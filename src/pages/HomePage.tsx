import React from "react";
import { Player } from "../components/player/Player";
import { Library } from "../components/library/Library";
import { Settings } from "../components/settings/Settings";
import { usePlayerStore } from "../store/usePlayerStore";
import { useLibraryStore } from "../store/useLibraryStore";
import { Play, Folder, Sliders } from "lucide-react";

interface HomePageProps {
  className?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ className = "" }) => {
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const tracks = useLibraryStore(state => state.tracks);
  const queue = usePlayerStore(state => state.queue);

  const hasTracks = tracks.length > 0;
  const hasQueue = queue.length > 0;

  return (
    <div className={`h-screen w-full ${className}`}>
      {!currentTrack ? (
        <div className="h-full w-full flex flex-col items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#007aff] to-[#5856d6] flex items-center justify-center shadow-lg">
                <Play className="w-12 h-12 text-white ml-1" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-[#1d1d1f] dark:text-white mb-4">
              Welcome to Cloud Music Player
            </h1>

            <p className="text-[#86868b] dark:text-[#8e8e93] mb-8">
              Your personal music player powered by WebDAV
            </p>

            {!hasTracks ? (
              <div className="space-y-4">
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Folder className="w-8 h-8 text-[#007aff]" />
                    <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
                      Connect Your Music Library
                    </h2>
                  </div>

                  <p className="text-sm text-[#86868b] dark:text-[#8e8e93] mb-4">
                    Connect to your WebDAV server to access your music collection
                  </p>

                  <button
                    onClick={() => {
                      usePlayerStore.getState().setCurrentTrack(tracks[0]);
                      usePlayerStore.getState().play();
                    }}
                    disabled={!hasTracks}
                    className="w-full py-3 px-6 bg-[#007aff] text-white rounded-lg font-medium hover:bg-[#0062cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Browse Library
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    usePlayerStore.getState().setCurrentTrack(tracks[0]);
                    usePlayerStore.getState().play();
                  }}
                  className="w-full py-4 px-6 bg-[#007aff] text-white rounded-lg font-medium hover:bg-[#0062cc] transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Play First Track
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Player />
      )}
    </div>
  );
};
