// Minimal audio graph for the scaffold step.
// Step 4 will replace `connectSource -> destination` with the ring-buffer + granulator worklets.

export interface AudioGraph {
  ctx: AudioContext;
  inputGain: GainNode;
  outputGain: GainNode;
  setSource: (node: AudioNode | null) => void;
}

export async function createGraph(): Promise<AudioGraph> {
  const ctx = new AudioContext();
  const inputGain = ctx.createGain();
  const outputGain = ctx.createGain();
  inputGain.connect(outputGain).connect(ctx.destination);

  let current: AudioNode | null = null;
  return {
    ctx,
    inputGain,
    outputGain,
    setSource(node) {
      if (current) {
        try { current.disconnect(); } catch { /* already disconnected */ }
      }
      current = node;
      if (node) node.connect(inputGain);
    },
  };
}

export function dbToGain(db: number) {
  return Math.pow(10, db / 20);
}
