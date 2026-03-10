import type { ReminderSettings, SetupAnswers, UserSetupProfile } from '@/types/models';

export function buildSetupProfile(answers: SetupAnswers, now = new Date()): UserSetupProfile {
  const iso = now.toISOString();
  return {
    version: '3.0.0',
    displayName: answers.displayName.trim(),
    priority: answers.priority,
    chaosSource: answers.chaosSource,
    tone: answers.tone,
    reminder: answers.reminder,
    startupModule: answers.startupModule,
    note: answers.note.trim(),
    createdAt: iso,
    updatedAt: iso,
  };
}

export function buildReminderSettings(answers: SetupAnswers): ReminderSettings {
  return {
    reminder: answers.reminder,
    tone: answers.tone,
    expensesEnabled: answers.startupModule === 'expenses' || answers.startupModule === 'all_core',
    workoutsEnabled: answers.startupModule === 'workouts' || answers.startupModule === 'all_core',
  };
}
