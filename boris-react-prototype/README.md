# BORIS Granular Station — Web Prototype

React/TypeScript prototype of the [BORIS Granular Station](https://github.com/glesdora/boris-granular-station) plugin, runnable in a browser via the Web Audio API. Inputs: audio file or built-in drone oscillator (live mic is out of scope for the prototype).

This is a research/UX prototype, not a port of the C++/RNBO DSP.

## Run

```bash
cd boris-react-prototype
npm install
npm run dev
```

Then open the printed URL and click **start audio** (browsers require a user gesture to start an `AudioContext`).

## Status

- [x] **Step 1** — Vite + React + TS scaffold, AudioContext bootstrap, source switcher (drone/file) with playthrough, master IN/OUT.
- [ ] Step 2 — ring-buffer worklet + waveform canvas (verify capture, freeze toggle).
- [ ] Step 3 — granulator worklet v1 (density, size, position, drift, pitch, env).
- [ ] Step 4 — XY pad over waveform, envelope morph, full BORIS panel layout.
- [ ] Step 5 — feedback path, tempo sync, presets.

See the working plan in the `claude/boris-react-prototype-yaNNQ` branch description / commit history.

## Mapping to BORIS parameters

| BORIS | Prototype name | Notes |
|---|---|---|
| `gai` IN | inputGainDb | dB, master input |
| `wet` OUT | outputGainDb | dB, master output |
| `den` DENSITY | (step 3) | grains/sec |
| `len` SIZE | (step 3) | ms |
| `psh` PITCH | (step 3) | semitones, 1/4 res |
| `cpo`/`drf` POS/DRIFT | (step 4) | XY pad |
| `env` ENVELOPE | (step 4) | morph 3 shapes |
| `frz` FREEZE | (step 2) | stop ring-buffer writes |
| `fdb` FEEDBACK | (step 5) | output → input, clamped |
| `syc`/`tmp`/`rtm` | (step 5) | density from BPM × subdivision |
