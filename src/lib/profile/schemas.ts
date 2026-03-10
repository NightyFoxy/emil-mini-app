import { z } from 'zod';

import {
  CHAOS_SOURCES,
  REMINDER_OPTIONS,
  SETUP_PRIORITIES,
  STARTUP_MODULES,
  TONE_OPTIONS,
} from '@/types/models';

export const setupAnswersSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  priority: z.enum(SETUP_PRIORITIES),
  chaosSource: z.enum(CHAOS_SOURCES),
  tone: z.enum(TONE_OPTIONS),
  reminder: z.enum(REMINDER_OPTIONS),
  startupModule: z.enum(STARTUP_MODULES),
  note: z.string().max(200),
});
