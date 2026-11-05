import { create } from "zustand";
import type { ListQuery } from "@/types";

type FilterState = {
  filters: Partial<ListQuery>;
  set: (patch: Partial<ListQuery>) => void;
  reset: () => void;
};
export const useFilters = create<FilterState>((set) => ({
  filters: { sort: "top", page: 1, limit: 12 },
  set: (patch) => set((s) => ({ filters: { ...s.filters, page: 1, ...patch } })),
  reset: () => set({ filters: { sort: "top", page: 1, limit: 12 } }),
}));
