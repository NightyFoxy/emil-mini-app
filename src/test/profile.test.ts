import { generateOperationalProfile } from '@/lib/profile/deriveProfile';
import { onboardingAnswersSchema } from '@/lib/profile/schemas';
import { demoAnswers } from '@/app/seed';

describe('onboardingAnswersSchema', () => {
  it('validates onboarding answers', () => {
    expect(() => onboardingAnswersSchema.parse(demoAnswers)).not.toThrow();
  });

  it('rejects empty goals', () => {
    expect(() =>
      onboardingAnswersSchema.parse({
        ...demoAnswers,
        goals: [],
      }),
    ).toThrow();
  });
});

describe('generateOperationalProfile', () => {
  it('maps answers into deterministic assistant rules and summary', () => {
    const profile = generateOperationalProfile(demoAnswers, new Date('2026-03-09T08:00:00.000Z'));

    expect(profile.profileVersion).toBe('1.0.0');
    expect(profile.reminderTime).toBe('21:30');
    expect(profile.assistantRules).toContain('Показывай связь между днём и недельными приоритетами.');
    expect(profile.llmProfileSummary).toContain('Тон контроля: прямой тон.');
  });
});
