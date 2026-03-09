import { generateOperationalProfile } from '@/lib/profile/deriveProfile';
import { onboardingAnswersSchema } from '@/lib/profile/schemas';
import { demoAnswers } from '@/app/seed';

describe('onboardingAnswersSchema', () => {
  it('validates onboarding answers', () => {
    expect(() => onboardingAnswersSchema.parse(demoAnswers)).not.toThrow();
  });

  it('rejects invalid special preferences length', () => {
    expect(() =>
      onboardingAnswersSchema.parse({
        ...demoAnswers,
        specialPreferences: 'x'.repeat(281),
      }),
    ).toThrow();
  });
});

describe('generateOperationalProfile', () => {
  it('maps answers into deterministic assistant rules and summary', () => {
    const profile = generateOperationalProfile(demoAnswers, new Date('2026-03-09T08:00:00.000Z'));

    expect(profile.profileVersion).toBe('1.0.0');
    expect(profile.reminderWindow).toBe('evening');
    expect(profile.firstScreen).toBe('today');
    expect(profile.assistantRules).toContain('Подавай ответы коротким списком.');
    expect(profile.llmProfileSummary).toContain('Главная польза от Эмиля: план на день.');
  });
});
