import { z } from 'zod';
import type { SiteConfig } from './types';

export const SiteConfigSchema = z.object({
  recipient: z.object({
    name: z.string().min(1).max(60),
    headline: z.string().min(1).max(80),
    outroWish: z.string().min(1).max(200),
  }),
  wishes: z
    .array(
      z.object({
        text: z.string().min(1).max(300),
      }),
    )
    .min(3),
  wheelPrizes: z
    .array(
      z.object({
        label: z.string().min(1).max(80),
        emoji: z.string().optional(),
        color: z.string().optional(),
      }),
    )
    .max(24)
    .optional(),
  music: z
    .union([
      z.object({
        kind: z.literal('file').optional(),
        src: z.string().min(1),
        volume: z.number().min(0).max(1).optional(),
        loop: z.boolean().optional(),
      }),
      z.object({
        kind: z.literal('synth'),
        synth: z.enum(['cat-birthday', 'soft-pad']),
        volume: z.number().min(0).max(1).optional(),
        loop: z.boolean().optional(),
      }),
    ])
    .optional(),
  theme: z.object({
    primary: z.string().min(1),
    background: z.string().min(1),
    textColor: z.string().min(1),
  }),
});

/**
 * Parse and validate a config object. Throws ZodError on misconfiguration;
 * use `validateSiteConfigSafe` if you want a non-throwing variant.
 */
export function validateSiteConfig(input: unknown): SiteConfig {
  return SiteConfigSchema.parse(input) as SiteConfig;
}
