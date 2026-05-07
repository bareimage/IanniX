import { create } from "zustand";

export type SourceMode = "file" | "drone";

interface AppState {
  audioReady: boolean;
  sourceMode: SourceMode;
  fileName: string | null;
  droneFreq: number;
  inputGainDb: number;
  outputGainDb: number;
  setAudioReady: (v: boolean) => void;
  setSourceMode: (m: SourceMode) => void;
  setFileName: (n: string | null) => void;
  setDroneFreq: (f: number) => void;
  setInputGainDb: (g: number) => void;
  setOutputGainDb: (g: number) => void;
}

export const useStore = create<AppState>((set) => ({
  audioReady: false,
  sourceMode: "drone",
  fileName: null,
  droneFreq: 220,
  inputGainDb: 0,
  outputGainDb: -6,
  setAudioReady: (v) => set({ audioReady: v }),
  setSourceMode: (m) => set({ sourceMode: m }),
  setFileName: (n) => set({ fileName: n }),
  setDroneFreq: (f) => set({ droneFreq: f }),
  setInputGainDb: (g) => set({ inputGainDb: g }),
  setOutputGainDb: (g) => set({ outputGainDb: g }),
}));
