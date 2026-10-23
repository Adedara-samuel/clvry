import { create } from "zustand";

type UiState = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  // Circle Sessions player — no audio source yet, so this only drives the UI.
  activeTrackId: string | null;
  playing: boolean;
  toggleTrack: (id: string) => void;
};

export const useUi = create<UiState>()((set) => ({
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  activeTrackId: null,
  playing: false,
  toggleTrack: (id) =>
    set((s) =>
      s.activeTrackId === id
        ? { playing: !s.playing }
        : { activeTrackId: id, playing: true },
    ),
}));
