import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  isFirstVisit: boolean;
  webdavConfigured: boolean;
  showSetupGuide: boolean;
  currentView: string;

  // Actions
  markAsVisited: () => void;
  setWebDAVConfigured: (configured: boolean) => void;
  setShowSetupGuide: (show: boolean) => void;
  setCurrentView: (view: string) => void;
  resetAppState: () => void;
  clearAppState: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      isFirstVisit: true,
      webdavConfigured: false,
      showSetupGuide: true,
      currentView: "home",

      markAsVisited: () => set({ isFirstVisit: false }),
      setWebDAVConfigured: configured => set({ webdavConfigured: configured }),
      setShowSetupGuide: show => set({ showSetupGuide: show }),
      setCurrentView: view => set({ currentView: view }),
      resetAppState: () =>
        set({
          isFirstVisit: true,
          webdavConfigured: false,
          showSetupGuide: true,
          currentView: "home",
        }),
      clearAppState: () =>
        set(
          {
            isFirstVisit: true,
            webdavConfigured: false,
            showSetupGuide: true,
            currentView: "home",
          },
          true
        ), // true表示清除持久化存储
    }),
    {
      name: "app-storage",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            currentView: "home",
          };
        }
        return persistedState;
      },
    }
  )
);
