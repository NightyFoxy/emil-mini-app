import { z } from 'zod';

import {
  ACCOUNTABILITY_STYLES,
  BLOCKERS,
  CHAOS_SOURCES,
  DAILY_PRIORITY_CAPACITIES,
  ENERGY_PATTERNS,
  OUTPUT_FORMATS,
  PLANNING_STYLES,
} from '@/types/models';

export const onboardingAnswersSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  goals: z.array(z.string().trim().min(1).max(120)).min(1).max(3),
  chaosSources: z.array(z.enum(CHAOS_SOURCES)).min(1),
  planningStyle: z.enum(PLANNING_STYLES),
  dailyPriorityCapacity: z.enum(DAILY_PRIORITY_CAPACITIES),
  energyPattern: z.enum(ENERGY_PATTERNS),
  accountabilityStyle: z.enum(ACCOUNTABILITY_STYLES),
  mainBlockers: z.array(z.enum(BLOCKERS)).min(1),
  preferredOutputFormats: z.array(z.enum(OUTPUT_FORMATS)).min(1),
  reminderEnabled: z.boolean(),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/),
  avoidPhrases: z.string().max(280),
  startHelps: z.string().max(280),
});

export const operationalProfileSchema = z.object({
  profileVersion: z.literal('1.0.0'),
  displayName: z.string().trim().min(1),
  goals: z.array(z.string().min(1)).min(1).max(3),
  chaosSources: z.array(z.enum(CHAOS_SOURCES)).min(1),
  planningStyle: z.enum(PLANNING_STYLES),
  dailyPriorityCapacity: z.enum(DAILY_PRIORITY_CAPACITIES),
  energyPattern: z.enum(ENERGY_PATTERNS),
  accountabilityStyle: z.enum(ACCOUNTABILITY_STYLES),
  mainBlockers: z.array(z.enum(BLOCKERS)).min(1),
  preferredOutputFormats: z.array(z.enum(OUTPUT_FORMATS)).min(1),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  avoidPhrases: z.string(),
  startHelps: z.string(),
  assistantRules: z.array(z.string()).min(3),
  llmProfileSummary: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
