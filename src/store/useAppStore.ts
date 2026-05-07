import { create } from "zustand";

type UserMode = "beginner" | "advanced";

interface AppState {
  isDarkMode: boolean;
  userMode: UserMode;

  // Actions
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  setUserMode: (mode: UserMode) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isDarkMode: false,
  userMode: "beginner",

  // Actions
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  setDarkMode: (value: boolean) => set({ isDarkMode: value }),

  setUserMode: (mode: UserMode) => set({ userMode: mode }),
}));
