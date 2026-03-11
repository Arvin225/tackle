import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { PlaylistPage } from "./pages/PlaylistPage";
import { SettingsPage } from "./pages/SettingsPage";
import { MiniPlayer } from "./components/player/MiniPlayer";
import { usePlayerStore } from "./store/usePlayerStore";

function App() {
  const currentTrack = usePlayerStore(state => state.currentTrack);

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/playlists" element={<PlaylistPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>

      {currentTrack && <MiniPlayer />}
    </div>
  );
}

export default App;
