import { create } from "zustand";

type UiState = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  // Newsletter: shared by the page section and the popup. In memory only, so a
  // refresh resets it (a closed popup comes back after the next page load).
  subscribed: boolean;
  markSubscribed: () => void;
  popupOpen: boolean;
  popupDismissed: boolean;
  /** Timed auto-open: skipped if already subscribed or dismissed this page load. */
  openPopup: () => void;
  /** Explicit open (e.g. "Get early access" buttons): always opens. */
  showPopup: () => void;
  dismissPopup: () => void;
  // Circle Sessions player — no audio source yet, so this only drives the UI.
  activeTrackId: string | null;
  playing: boolean;
  toggleTrack: (id: string) => void;
};

export const useUi = create<UiState>()((set) => ({
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  subscribed: false,
  markSubscribed: () => set({ subscribed: true }),
  popupOpen: false,
  popupDismissed: false,
  openPopup: () =>
    set((s) => (s.subscribed || s.popupDismissed ? {} : { popupOpen: true })),
  showPopup: () => set({ popupOpen: true }),
  dismissPopup: () => set({ popupOpen: false, popupDismissed: true }),
  activeTrackId: null,
  playing: false,
  toggleTrack: (id) =>
    set((s) =>
      s.activeTrackId === id
        ? { playing: !s.playing }
        : { activeTrackId: id, playing: true },
    ),
}));
