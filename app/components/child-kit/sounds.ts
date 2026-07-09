// Child-kit sound design — Stage 1.
// A single soft chime family, synthesized in WebAudio (no assets to load).
// HARD RULES (mega prompt): max 5 sounds total, all under 400ms, NONE for
// rewards. Default ON for child screens, OFF for parent screens, toggleable
// from parent settings. Three of the five slots are used:
//   1. page-turn whisper  — on story panel change
//   2. gentle pop         — on card placement
//   3. warm mic tone      — when the mic starts listening

const KEY = "lc.sound.child";

export function soundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const v = window.localStorage.getItem(KEY);
  return v === null ? true : v === "on";
}

export function setSoundEnabled(on: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, on ? "on" : "off");
}

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  if (typeof window === "undefined" || !soundEnabled()) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** 1. Page-turn whisper — 220ms of soft filtered noise, like paper sliding. */
export function playPageTurn(): void {
  const ac = audio();
  if (!ac) return;
  const dur = 0.22;
  const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(900, ac.currentTime);
  filter.frequency.exponentialRampToValueAtTime(2400, ac.currentTime + dur);
  filter.Q.value = 0.9;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.12, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start();
}

/** 2. Gentle pop — 120ms rounded blip for placing a card. Not a reward sound. */
export function playPop(): void {
  const ac = audio();
  if (!ac) return;
  const dur = 0.12;
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(340, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(190, ac.currentTime + dur);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.16, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + dur);
}

/** 3. Warm mic tone — 300ms two-note rise that says "I'm listening". */
export function playMicWarm(): void {
  const ac = audio();
  if (!ac) return;
  const dur = 0.3;
  const notes = [392, 523.25]; // G4 → C5, a warm perfect fourth
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const gain = ac.createGain();
    const t0 = ac.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.1, t0 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(ac.currentTime + dur);
  });
}
