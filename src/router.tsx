import { createBrowserRouter, Outlet } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { PlaylistPage } from "./pages/PlaylistPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NavigationBar } from "./components/navigation/NavigationBar";
import { MiniPlayer } from "./components/player/MiniPlayer";
import { usePlayerStore } from "./store/usePlayerStore";

const Root = () => {
  const currentTrack = usePlayerStore(state => state.currentTrack);

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white">
      <NavigationBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      {currentTrack && <MiniPlayer />}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "library",
        element: <LibraryPage />,
      },
      {
        path: "playlists",
        element: <PlaylistPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

export { router };
