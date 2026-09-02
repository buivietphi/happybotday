/**
 * High-End Ghibli-Style Music Box & Celesta Web Audio Synthesizer for the Birthday Page.
 *
 * Features:
 *   - Rich polyphonic music box with crystalline bell plucks and warm acoustic chord harmonies.
 *   - "Happy Birthday to You" melody with full acoustic chords (C, G7, F, C-G-C cadence).
 *   - Soft stereo spatial resonance & chime sparkle without harsh digital aliasing.
 *   - Perfectly tuned harmonic envelopes for a cozy, heartwarming birthday feel.
 */

export type SynthHandle = {
  stop(): void;
};

/** Convert MIDI note number → Hz. 60 = middle C (C4 = 261.63 Hz). */
function midiToHz(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

type Note = { midi: number; beats: number };

// Lead Melody (Celesta / Music Box Bell)
const MELODY: Note[] = [
  // Phrase 1: "Happy Birthday to You"
  { midi: 60, beats: 0.75 },
  { midi: 60, beats: 0.25 },
  { midi: 62, beats: 1.0 },
  { midi: 60, beats: 1.0 },
  { midi: 65, beats: 1.0 },
  { midi: 64, beats: 2.0 },

  // Phrase 2: "Happy Birthday to You"
  { midi: 60, beats: 0.75 },
  { midi: 60, beats: 0.25 },
  { midi: 62, beats: 1.0 },
  { midi: 60, beats: 1.0 },
  { midi: 67, beats: 1.0 },
  { midi: 65, beats: 2.0 },

  // Phrase 3: "Happy Birthday Dear Kiều Lee"
  { midi: 60, beats: 0.75 },
  { midi: 60, beats: 0.25 },
  { midi: 72, beats: 1.0 },
  { midi: 69, beats: 1.0 },
  { midi: 65, beats: 1.0 },
  { midi: 64, beats: 1.0 },
  { midi: 62, beats: 1.5 },

  // Phrase 4: "Happy Birthday to You"
  { midi: 70, beats: 0.75 },
  { midi: 70, beats: 0.25 },
  { midi: 69, beats: 1.0 },
  { midi: 65, beats: 1.0 },
  { midi: 67, beats: 1.0 },
  { midi: 65, beats: 2.5 },
];

// Warm Music-Box Chords / Arpeggio Accompaniment
type ChordEvent = { timeBeat: number; midi: number; duration: number; gain?: number };

const HARMONY_EVENTS: ChordEvent[] = [
  // Phrase 1: C Major Harmony (C3, G3, E4)
  { timeBeat: 0.0, midi: 48, duration: 2.5, gain: 0.12 },
  { timeBeat: 1.0, midi: 55, duration: 1.8, gain: 0.08 },
  { timeBeat: 2.0, midi: 60, duration: 1.8, gain: 0.08 },
  { timeBeat: 3.0, midi: 52, duration: 2.5, gain: 0.10 },
  { timeBeat: 4.0, midi: 55, duration: 1.8, gain: 0.08 },
  { timeBeat: 5.0, midi: 60, duration: 1.8, gain: 0.08 },

  // Phrase 2: G7 Harmony (G2, D3, F3, B3)
  { timeBeat: 6.0, midi: 43, duration: 2.5, gain: 0.12 },
  { timeBeat: 7.0, midi: 50, duration: 1.8, gain: 0.08 },
  { timeBeat: 8.0, midi: 53, duration: 1.8, gain: 0.08 },
  { timeBeat: 9.0, midi: 47, duration: 2.5, gain: 0.10 },
  { timeBeat: 10.0, midi: 50, duration: 1.8, gain: 0.08 },
  { timeBeat: 11.0, midi: 55, duration: 1.8, gain: 0.08 },

  // Phrase 3: F Major → C Major (F2, C3, A3 → C3, E3, G3)
  { timeBeat: 12.0, midi: 41, duration: 2.5, gain: 0.12 },
  { timeBeat: 13.0, midi: 48, duration: 1.8, gain: 0.08 },
  { timeBeat: 14.0, midi: 53, duration: 1.8, gain: 0.08 },
  { timeBeat: 15.0, midi: 48, duration: 2.5, gain: 0.12 },
  { timeBeat: 16.0, midi: 52, duration: 1.8, gain: 0.08 },
  { timeBeat: 17.0, midi: 55, duration: 1.8, gain: 0.08 },

  // Phrase 4: G7 → C Major with chime resolve
  { timeBeat: 18.0, midi: 43, duration: 2.0, gain: 0.12 },
  { timeBeat: 19.0, midi: 50, duration: 1.8, gain: 0.08 },
  { timeBeat: 20.0, midi: 53, duration: 1.8, gain: 0.08 },
  { timeBeat: 21.0, midi: 48, duration: 3.5, gain: 0.14 },
  { timeBeat: 22.0, midi: 55, duration: 2.5, gain: 0.09 },
  { timeBeat: 23.0, midi: 60, duration: 2.5, gain: 0.09 },
  { timeBeat: 24.0, midi: 72, duration: 2.5, gain: 0.08 },
];

const SECONDS_PER_BEAT = 0.58; // ~104 BPM — gentle, festive lilt

/**
 * Render a crystalline music box chime note (fundamental + soft sparkle harmonic).
 */
function playMusicBoxNote(
  ctx: AudioContext,
  dest: AudioNode,
  startAt: number,
  midi: number,
  durationSec: number,
  peakGain: number = 0.22,
): void {
  const baseHz = midiToHz(midi);
  const endAt = startAt + durationSec;

  // 1. Primary Sine Tone (Pure bell fundamental)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(baseHz, startAt);

  // 2. Chime Sparkle Harmonic (2.76x overtone for crystalline music-box sheen)
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(baseHz * 2.756, startAt);

  // Warm low-pass filter to keep sound cozy and soft
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3200, startAt);
  filter.frequency.exponentialRampToValueAtTime(1400, endAt);

  // Note Gain Envelope (Instant strike attack → soft exponential music-box ring decay)
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, startAt);
  gainNode.gain.linearRampToValueAtTime(peakGain, startAt + 0.006);
  gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.35, startAt + 0.22);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt);

  // Secondary sparkle gain (subtle shimmer)
  const sparkleGain = ctx.createGain();
  sparkleGain.gain.setValueAtTime(peakGain * 0.18, startAt);
  sparkleGain.gain.exponentialRampToValueAtTime(0.0001, startAt + Math.min(0.28, durationSec));

  osc1.connect(filter);
  osc2.connect(sparkleGain);
  sparkleGain.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(dest);

  osc1.start(startAt);
  osc1.stop(endAt + 0.05);
  osc2.start(startAt);
  osc2.stop(endAt + 0.05);
}

/**
 * Play full Ghibli Music Box "Happy Birthday" with melody and warm harmony chords.
 */
export function catBirthday(
  ctx: AudioContext,
  opts?: { volume?: number; loop?: boolean },
): SynthHandle {
  const master = ctx.createGain();
  master.gain.value = opts?.volume ?? 0.32;

  // Delay resonance for cozy music-box ambient space
  const delay = ctx.createDelay();
  delay.delayTime.value = 0.22;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.24;
  const delayFilter = ctx.createBiquadFilter();
  delayFilter.type = 'lowpass';
  delayFilter.frequency.value = 2200;

  master.connect(ctx.destination);
  master.connect(delay);
  delay.connect(delayFilter);
  delayFilter.connect(feedback);
  feedback.connect(delay);
  delayFilter.connect(ctx.destination);

  let cancelled = false;
  let timeoutId: number | null = null;

  const scheduleSong = (startAt: number): number => {
    // 1. Play Lead Melody Notes
    let currentBeat = 0;
    for (const note of MELODY) {
      const noteTime = startAt + currentBeat * SECONDS_PER_BEAT;
      const noteDur = note.beats * SECONDS_PER_BEAT * 1.6;
      playMusicBoxNote(ctx, master, noteTime, note.midi, noteDur, 0.24);
      currentBeat += note.beats;
    }

    // 2. Play Harmony Chords & Bass
    for (const chord of HARMONY_EVENTS) {
      const chordTime = startAt + chord.timeBeat * SECONDS_PER_BEAT;
      const chordDur = chord.duration * SECONDS_PER_BEAT;
      playMusicBoxNote(ctx, master, chordTime, chord.midi, chordDur, chord.gain ?? 0.10);
    }

    const totalSeconds = currentBeat * SECONDS_PER_BEAT;
    return startAt + totalSeconds;
  };

  const runLoop = () => {
    if (cancelled) return;
    const now = ctx.currentTime + 0.08;
    const endAt = scheduleSong(now);
    const loopDelayMs = Math.max(0, (endAt - ctx.currentTime + 1.2) * 1000);
    timeoutId = window.setTimeout(runLoop, loopDelayMs);
  };

  runLoop();

  return {
    stop() {
      cancelled = true;
      if (timeoutId != null) window.clearTimeout(timeoutId);
      try {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
      } catch {
        // ignore
      }
    },
  };
}