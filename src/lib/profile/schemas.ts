import { z } from 'zod';

import {
  CHAOS_SOURCES,
  HELP_FORMATS,
  REMINDER_OPTIONS,
  SETUP_PRIORITIES,
  STARTUP_MODULES,
  TONE_OPTIONS,
} from '@/types/models';

export const setupAnswersSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  priority: z.enum(SETUP_PRIORITIES),
  chaosSource: z.enum(CHAOS_SOURCES),
  helpFormat: z.enum(HELP_FORMATS),
  tone: z.enum(TONE_OPTIONS),
  reminder: z.enum(REMINDER_OPTIONS),
  startupModule: z.enum(STARTUP_MODULES),
  note: z.string().max(240),
});

export const profileSchema = z.object({
  version: z.literal('2.0.0'),
  displayName: z.string().trim().min(1),
  priority: z.enum(SETUP_PRIORITIES),
  chaosSource: z.enum(CHAOS_SOURCES),
  helpFormat: z.enum(HELP_FORMATS),
  tone: z.enum(TONE_OPTIONS),
  reminder: z.enum(REMINDER_OPTIONS),
  startupModule: z.enum(STARTUP_MODULES),
  note: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
