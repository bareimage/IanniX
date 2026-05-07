export function createDrone(ctx: AudioContext, freq: number): AudioNode {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = freq;
  const trim = ctx.createGain();
  trim.gain.value = 0.25;
  osc.connect(trim);
  osc.start();
  // Expose frequency on the wrapper node via a property for the caller.
  (trim as AudioNode & { __osc?: OscillatorNode }).__osc = osc;
  return trim;
}

export function setDroneFreq(node: AudioNode, freq: number) {
  const osc = (node as AudioNode & { __osc?: OscillatorNode }).__osc;
  if (osc) osc.frequency.setTargetAtTime(freq, osc.context.currentTime, 0.01);
}

export async function loadFile(ctx: AudioContext, file: File): Promise<AudioBufferSourceNode> {
  const buf = await file.arrayBuffer();
  const audioBuf = await ctx.decodeAudioData(buf);
  const src = ctx.createBufferSource();
  src.buffer = audioBuf;
  src.loop = true;
  src.start();
  return src;
}
