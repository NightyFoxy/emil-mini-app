import type { AppSettings, SetupAnswers, UserProfile } from '@/types/models';
import { profileSchema } from './schemas';

export function buildProfile(answers: SetupAnswers, now = new Date()): UserProfile {
  const iso = now.toISOString();
  return profileSchema.parse({
    version: '2.0.0',
    displayName: answers.displayName.trim(),
    priority: answers.priority,
    chaosSource: answers.chaosSource,
    helpFormat: answers.helpFormat,
    tone: answers.tone,
    reminder: answers.reminder,
    startupModule: answers.startupModule,
    note: answers.note.trim(),
    createdAt: iso,
    updatedAt: iso,
  });
}

export function buildSettingsFromAnswers(answers: SetupAnswers): AppSettings {
  return {
    reminder: answers.reminder,
    tone: answers.tone,
    modules: {
      expenses: answers.startupModule === 'expenses' || answers.startupModule === 'all_core',
      workouts: answers.startupModule === 'workouts' || answers.startupModule === 'all_core',
    },
  };
}
