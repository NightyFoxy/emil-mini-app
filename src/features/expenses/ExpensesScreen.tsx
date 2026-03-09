import { Card, PrimaryButton, Screen, SectionTitle } from '@/components/ui';
import { useAppStore } from '@/app/store';

export function ExpensesScreen() {
  const expenses = useAppStore((state) => state.expenses ?? []);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Screen title="Расходы" subtitle="Быстрый обзор трат без лишних деталей">
      <Card className="space-y-3">
        <SectionTitle title="Итог за последние записи" />
        <div className="text-3xl font-semibold tracking-[-0.04em] text-[var(--tg-text-color)]">{total.toLocaleString('ru-RU')} ₽</div>
        <div className="text-sm text-[var(--tg-hint-color)]">Текущий стартовый экран для сценария финансов.</div>
      </Card>

      <Card className="space-y-3">
        <SectionTitle title="Последние траты" />
        {expenses.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between rounded-[18px] bg-black/10 px-4 py-3 text-sm">
            <div>
              <div className="text-[var(--tg-text-color)]">{expense.title}</div>
              <div className="text-[var(--tg-hint-color)]">{expense.category}</div>
            </div>
            <div className="font-medium text-[var(--tg-text-color)]">{expense.amount.toLocaleString('ru-RU')} ₽</div>
          </div>
        ))}
      </Card>

      <PrimaryButton onClick={() => setActiveTab('today')}>Открыть общий план дня</PrimaryButton>
    </Screen>
  );
}
