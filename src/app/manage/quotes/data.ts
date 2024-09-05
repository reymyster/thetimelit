import { create } from "zustand";

type State = {
  globalFilter: string;
};

type Action = {
  setGlobalFilter: (f: State["globalFilter"]) => void;
};

export const useStore = create<State & Action>((set) => ({
  globalFilter: "",
  setGlobalFilter: (f) => set(() => ({ globalFilter: f })),
}));
