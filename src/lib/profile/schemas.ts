import { z } from 'zod';

import {
  CHAOS_PATTERNS,
  ONBOARDING_START_AREAS,
  PRIMARY_NEEDS,
  REMINDER_WINDOWS,
  RESPONSE_STYLES,
  STARTUP_BUNDLES,
  TABS,
  TONE_STYLES,
} from '@/types/models';

export const onboardingAnswersSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  startArea: z.enum(ONBOARDING_START_AREAS),
  chaosPattern: z.enum(CHAOS_PATTERNS),
  primaryNeed: z.enum(PRIMARY_NEEDS),
  responseStyle: z.enum(RESPONSE_STYLES),
  toneStyle: z.enum(TONE_STYLES),
  reminderWindow: z.enum(REMINDER_WINDOWS),
  dailyPlanReminderEnabled: z.boolean(),
  startupBundle: z.enum(STARTUP_BUNDLES),
  specialPreferences: z.string().max(280),
});

export const operationalProfileSchema = z.object({
  profileVersion: z.literal('1.0.0'),
  displayName: z.string().trim().min(1),
  startArea: z.enum(ONBOARDING_START_AREAS),
  chaosPattern: z.enum(CHAOS_PATTERNS),
  primaryNeed: z.enum(PRIMARY_NEEDS),
  responseStyle: z.enum(RESPONSE_STYLES),
  toneStyle: z.enum(TONE_STYLES),
  reminderWindow: z.enum(REMINDER_WINDOWS),
  dailyPlanReminderEnabled: z.boolean(),
  startupBundle: z.enum(STARTUP_BUNDLES),
  specialPreferences: z.string(),
  firstScreen: z.enum(TABS),
  practicalTags: z.array(z.string()).min(3),
  assistantRules: z.array(z.string()).min(3),
  llmProfileSummary: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
