import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "clvry-theme";

type ThemeState = {
  // null = never chosen, follow the OS.
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
};

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: null,
      setTheme: (theme) => {
        document.documentElement.dataset.theme = theme;
        set({ theme });
      },
    }),
    { name: THEME_STORAGE_KEY },
  ),
);

/**
 * Runs inline in <head> before first paint so the page never flashes the wrong theme.
 * Reads the zustand-persist payload ({ state: { theme } }) and falls back to the OS setting.
 */
export const themeInitScript = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})||"null");var t=s&&s.state&&s.state.theme;if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){}})()`;
