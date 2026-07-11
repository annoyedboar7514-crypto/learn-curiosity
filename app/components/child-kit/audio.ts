"use client";
// The one client audio manager for mentor speech (Stage 2; hardened in Stage 4).
// Single queue — no overlapping voices ever. Consumers subscribe to the
// speaking state so the mic can be hard-disabled while the mentor talks.
// Cached lines (greetings, narration) go through the Cache API so replays
// don't re-bill TTS.

type SpeakingListener = (speaking: boolean) => void;

const TTS_CACHE = "lc-tts-v1";

interface SpeakJob {
  text: string;
  mentorId: string;
  cacheKey?: string;
  resolve: () => void;
}

class MentorAudioManager {
  private queue: SpeakJob[] = [];
  private current: HTMLAudioElement | null = null;
  private processing = false;
  private listeners = new Set<SpeakingListener>();

  get isSpeaking(): boolean {
    return this.processing;
  }

  subscribe(cb: SpeakingListener): () => void {
    this.listeners.add(cb);
    cb(this.processing);
    return () => this.listeners.delete(cb);
  }

  private notify(speaking: boolean) {
    if (this.processing === speaking) return;
    this.processing = speaking;
    this.listeners.forEach((cb) => cb(speaking));
  }

  /** Queue a line of mentor speech. Resolves when the line finishes (or fails —
   *  speech failures are never fatal; the text is always on screen too). */
  speak(text: string, mentorId: string, opts?: { cacheKey?: string }): Promise<void> {
    const clean = text.trim();
    if (!clean) return Promise.resolve();
    return new Promise<void>((resolve) => {
      this.queue.push({ text: clean, mentorId, cacheKey: opts?.cacheKey, resolve });
      void this.pump();
    });
  }

  /** Stop the current line and drop everything queued. */
  stop() {
    this.queue.forEach((j) => j.resolve());
    this.queue = [];
    if (this.current) {
      this.current.pause();
      this.current.src = "";
      this.current = null;
    }
    this.notify(false);
  }

  private async pump() {
    if (this.processing) return;
    const job = this.queue.shift();
    if (!job) return;
    this.notify(true);
    try {
      const blob = await this.fetchAudio(job);
      if (blob) await this.play(blob);
    } catch {
      /* never fatal — the text is on screen */
    }
    job.resolve();
    this.notify(false);
    if (this.queue.length) void this.pump();
  }

  private async fetchAudio(job: SpeakJob): Promise<Blob | null> {
    const cacheReq = job.cacheKey
      ? new Request(`/__tts-cache/${encodeURIComponent(job.mentorId)}/${encodeURIComponent(job.cacheKey)}`)
      : null;

    if (cacheReq && "caches" in window) {
      try {
        const hit = await (await caches.open(TTS_CACHE)).match(cacheReq);
        if (hit) return await hit.blob();
      } catch { /* cache unavailable (private mode) — fall through */ }
    }

    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: job.text, mentorId: job.mentorId }),
    });
    if (!res.ok) return null;
    const blob = await res.blob();

    if (cacheReq && "caches" in window && blob.size > 0) {
      try {
        await (await caches.open(TTS_CACHE)).put(
          cacheReq,
          new Response(blob.slice(), { headers: { "Content-Type": "audio/mpeg" } })
        );
      } catch { /* best-effort */ }
    }
    return blob;
  }

  private play(blob: Blob): Promise<void> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const el = new Audio(url);
      this.current = el;
      const done = () => {
        URL.revokeObjectURL(url);
        if (this.current === el) this.current = null;
        resolve();
      };
      el.onended = done;
      el.onerror = done;
      el.play().catch(done); // autoplay blocked → resolve silently
    });
  }
}

/** Singleton — every child surface speaks through this. */
export const mentorAudio = new MentorAudioManager();
