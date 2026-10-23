import { create } from "zustand";

type BagState = {
  items: string[];
  add: (productId: string) => void;
  clear: () => void;
};

export const useBag = create<BagState>()((set) => ({
  items: [],
  add: (productId) => set((s) => ({ items: [...s.items, productId] })),
  clear: () => set({ items: [] }),
}));
