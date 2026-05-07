import { useEffect, useRef, useState } from "react";
import { useStore } from "./state/store";
import { AudioGraph, createGraph, dbToGain } from "./audio/graph";
import { createDrone, setDroneFreq, loadFile } from "./audio/source";

export default function App() {
  const {
    audioReady, sourceMode, fileName, droneFreq, inputGainDb, outputGainDb,
    setAudioReady, setSourceMode, setFileName, setDroneFreq: setFreq,
    setInputGainDb, setOutputGainDb,
  } = useStore();

  const graphRef = useRef<AudioGraph | null>(null);
  const droneRef = useRef<AudioNode | null>(null);
  const fileSrcRef = useRef<AudioBufferSourceNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    try {
      const g = await createGraph();
      graphRef.current = g;
      setAudioReady(true);
    } catch (e) {
      setError(String(e));
    }
  }

  // Apply gains
  useEffect(() => {
    const g = graphRef.current;
    if (!g) return;
    g.inputGain.gain.setTargetAtTime(dbToGain(inputGainDb), g.ctx.currentTime, 0.02);
    g.outputGain.gain.setTargetAtTime(dbToGain(outputGainDb), g.ctx.currentTime, 0.02);
  }, [inputGainDb, outputGainDb, audioReady]);

  // Switch source
  useEffect(() => {
    const g = graphRef.current;
    if (!g) return;
    fileSrcRef.current?.stop();
    fileSrcRef.current = null;
    droneRef.current = null;
    g.setSource(null);
    if (sourceMode === "drone") {
      const node = createDrone(g.ctx, droneFreq);
      droneRef.current = node;
      g.setSource(node);
    }
  }, [sourceMode, audioReady]);

  // Drone freq updates
  useEffect(() => {
    if (sourceMode === "drone" && droneRef.current) {
      setDroneFreq(droneRef.current, droneFreq);
    }
  }, [droneFreq, sourceMode]);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const g = graphRef.current;
    if (!file || !g) return;
    try {
      fileSrcRef.current?.stop();
      const src = await loadFile(g.ctx, file);
      fileSrcRef.current = src;
      g.setSource(src);
      setFileName(file.name);
      setSourceMode("file");
    } catch (err) {
      setError(`Could not decode ${file.name}: ${err}`);
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-boris-ground text-boris-label p-4 gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl tracking-wide text-boris-contrast">BORIS · web prototype</h1>
        {!audioReady ? (
          <button
            onClick={start}
            className="px-4 py-2 rounded bg-boris-active text-black font-medium"
          >
            start audio
          </button>
        ) : (
          <span className="text-xs text-boris-led">audio running</span>
        )}
      </header>

      {error && (
        <div className="rounded border border-boris-mute/60 bg-boris-mute/10 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <section className="grid grid-cols-3 gap-4">
        <Panel title="SOURCE">
          <div className="flex gap-2">
            <ToggleBtn active={sourceMode === "drone"} onClick={() => setSourceMode("drone")}>drone</ToggleBtn>
            <label className={`px-3 py-1 rounded border cursor-pointer text-sm ${sourceMode === "file" ? "border-boris-active text-boris-active" : "border-boris-border"}`}>
              file
              <input type="file" accept="audio/*" className="hidden" onChange={onPickFile} disabled={!audioReady} />
            </label>
          </div>
          {sourceMode === "drone" && (
            <Slider label={`drone ${droneFreq.toFixed(0)} Hz`} min={40} max={1200} step={1}
              value={droneFreq} onChange={setFreq} />
          )}
          {sourceMode === "file" && fileName && (
            <div className="text-xs text-boris-label/70 truncate">loop: {fileName}</div>
          )}
        </Panel>

        <Panel title="MASTER">
          <Slider label={`IN ${inputGainDb.toFixed(1)} dB`} min={-60} max={12} step={0.1}
            value={inputGainDb} onChange={setInputGainDb} />
          <Slider label={`OUT ${outputGainDb.toFixed(1)} dB`} min={-60} max={6} step={0.1}
            value={outputGainDb} onChange={setOutputGainDb} />
        </Panel>

        <Panel title="STATUS">
          <ul className="text-xs text-boris-label/80 space-y-1">
            <li>step 1 — scaffold + playthrough</li>
            <li className="opacity-60">step 2 — ring buffer + waveform</li>
            <li className="opacity-60">step 3 — granulator worklet</li>
            <li className="opacity-60">step 4 — XY pad + envelope</li>
          </ul>
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-boris-border/70 bg-boris-back p-3 flex flex-col gap-2">
      <div className="text-[10px] tracking-[0.2em] text-boris-label/60">{title}</div>
      {children}
    </div>
  );
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1 rounded border text-sm ${active ? "border-boris-active text-boris-active" : "border-boris-border"}`}>
      {children}
    </button>
  );
}

function Slider({ label, min, max, step, value, onChange }: {
  label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-boris-label/70">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="accent-boris-active" />
    </label>
  );
}
