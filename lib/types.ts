/**
 * Site configuration types — see contracts/site-config.schema.md.
 * Mirrors data-model.md entities. Runtime validation lives in lib/validate-config.ts.
 */

export type Recipient = {
  /** 1–60 chars; rendered in hero and outro. */
  name: string;
  /** 1–80 chars; hero headline. */
  headline: string;
  /** 1–200 chars; outro card. */
  outroWish: string;
};

export type Wish = {
  /** 1–300 chars; rendered with split-text reveal. */
  text: string;
};

export type WheelPrize = {
  /** 1–80 chars; displayed on the wheel wedge and the reveal card. */
  label: string;
  /** Optional emoji shown on the wedge (e.g. "💐"). */
  emoji?: string;
  /** Optional hex/oklch color override for this wedge. */
  color?: string;
};

export type MusicTrack =
  | {
      /** Source file URL — /music/foo.mp3 OR https://... */
      src: string;
      kind?: 'file';
      /** 0.0–1.0; default 0.4. */
      volume?: number;
      /** default true. */
      loop?: boolean;
    }
  | {
      /** Procedurally synthesized track — no file required. */
      kind: 'synth';
      /** Which synthesizer preset to play. */
      synth: 'cat-birthday' | 'soft-pad';
      /** 0.0–1.0; default 0.35. */
      volume?: number;
      /** default true. */
      loop?: boolean;
    };

export type ThemeTokens = {
  /** CSS color; hero accent. */
  primary: string;
  /** CSS color; page background. */
  background: string;
  /** CSS color; body text. Must pass WCAG AA vs background. */
  textColor: string;
};

export type SiteConfig = {
  recipient: Recipient;
  /** ≥ 3. */
  wishes: Wish[];
  /** Optional lucky-wheel prizes (defaults to 8 if omitted). */
  wheelPrizes?: WheelPrize[];
  music?: MusicTrack;
  theme: ThemeTokens;
};
