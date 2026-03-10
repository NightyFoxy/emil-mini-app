import { create } from 'zustand';

import { createStorageAdapter } from '@/lib/storage';
import { buildReminderSettings, buildSetupProfile } from '@/lib/profile/deriveProfile';
import { getPlannerRepository } from '@/lib/planner';
import type {
  AppShellState,
  DailyCheckin,
  OverlayType,
  PlannerItem,
  PlannerItemInput,
  ReminderOption,
  ReminderSettings,
  SetupAnswers,
  ToneOption,
} from '@/types/models';
import { createDemoShellState, demoCheckins, demoPlannerItems, demoReminderSettings, demoSetupAnswers, createEmptyShellState } from './seed';

const shellStorage = createStorageAdapter();
const currentUserId = 'demo-user';

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function parseDeepLinkedDate() {
  const params = new URLSearchParams(window.location.search);
  const date = params.get('date');
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}

function normalizeShell(snapshot: unknown): AppShellState | null {
  if (!snapshot || typeof snapshot !== 'object') {
    return null;
  }

  const raw = snapshot as Record<string, unknown>;
  if ('setupCompleted' in raw) {
    const base = createEmptyShellState();
    return {
      ...base,
      ...raw,
      selectedDate: typeof raw.selectedDate === 'string' ? raw.selectedDate : base.selectedDate,
      overlay: (raw.overlay as OverlayType | null | undefined) ?? null,
      focusedTaskId: (raw.focusedTaskId as string | null | undefined) ?? null,
    };
  }

  if ('setupCompleted' in raw || 'onboardingCompleted' in raw) {
    return createEmptyShellState();
  }

  return null;
}

interface AppStore extends AppShellState {
  initialized: boolean;
  plannerItems: PlannerItem[];
  dailyCheckins: DailyCheckin[];
  reminderSettings: ReminderSettings;
  loadApp: () => Promise<void>;
  reloadPlanner: () => Promise<void>;
  completeSetup: (answers: SetupAnswers) => Promise<void>;
  setSelectedDate: (date: string) => Promise<void>;
  openOverlay: (overlay: OverlayType) => void;
  closeOverlay: () => void;
  openFocusForTask: (taskId: string | null) => void;
  addPlannerItem: (input: PlannerItemInput) => Promise<void>;
  updatePlannerItem: (itemId: string, patch: Partial<PlannerItem>) => Promise<void>;
  markTaskDone: (taskId: string) => Promise<void>;
  moveTaskToNextDay: (taskId: string) => Promise<void>;
  answerCheckin: (response: 'done' | 'move' | 'later' | 'help') => Promise<void>;
  updateReminderSettings: (patch: Partial<ReminderSettings>) => Promise<void>;
  rerunSetup: () => Promise<void>;
  resetAllData: () => Promise<void>;
}

async function persistShell(state: AppStore) {
  const snapshot: AppShellState = {
    setupCompleted: state.setupCompleted,
    setupAnswers: state.setupAnswers,
    profile: state.profile,
    selectedDate: state.selectedDate,
    overlay: state.overlay,
    focusedTaskId: state.focusedTaskId,
  };
  await shellStorage.save(snapshot);
}

export const useAppStore = create<AppStore>((set, get) => ({
  ...createEmptyShellState(),
  initialized: false,
  plannerItems: [],
  dailyCheckins: [],
  reminderSettings: {
    reminder: 'off',
    tone: 'calm',
    expensesEnabled: false,
    workoutsEnabled: false,
  },

  async loadApp() {
    const shell = normalizeShell(await shellStorage.load());
    const plannerRepository = getPlannerRepository();
    let plannerState = await plannerRepository.getState(currentUserId);

    if (import.meta.env.DEV && plannerState.items.length === 0) {
      for (const item of demoPlannerItems) {
        await plannerRepository.createItem(currentUserId, item, item.source);
      }
      for (const checkin of demoCheckins) {
        await plannerRepository.recordCheckin(currentUserId, {
          date: checkin.date,
          type: checkin.type,
          response: checkin.response,
          completed: checkin.completed,
        });
      }
      await plannerRepository.updateReminderSettings(currentUserId, demoReminderSettings);
      plannerState = await plannerRepository.getState(currentUserId);
    }

    const deepLinkDate = parseDeepLinkedDate();
    const baseShell = shell ?? (import.meta.env.DEV ? createDemoShellState() : createEmptyShellState());
    const fallbackSetup = import.meta.env.DEV && !shell ? demoSetupAnswers : null;
    const fallbackProfile = import.meta.env.DEV && !shell ? buildSetupProfile(demoSetupAnswers, new Date('2026-03-10T08:00:00.000Z')) : null;

    set({
      ...baseShell,
      setupAnswers: baseShell.setupAnswers ?? fallbackSetup,
      profile: baseShell.profile ?? fallbackProfile,
      setupCompleted: baseShell.setupCompleted || Boolean(fallbackProfile),
      selectedDate: deepLinkDate ?? baseShell.selectedDate ?? todayString(),
      plannerItems: plannerState.items,
      dailyCheckins: plannerState.checkins,
      reminderSettings: plannerState.reminderSettings,
      initialized: true,
    });
  },

  async reloadPlanner() {
    const plannerState = await getPlannerRepository().getState(currentUserId);
    set({
      plannerItems: plannerState.items,
      dailyCheckins: plannerState.checkins,
      reminderSettings: plannerState.reminderSettings,
    });
  },

  async completeSetup(answers) {
    const profile = buildSetupProfile(answers);
    const reminderSettings = buildReminderSettings(answers);
    await getPlannerRepository().updateReminderSettings(currentUserId, reminderSettings);
    set({
      setupCompleted: true,
      setupAnswers: answers,
      profile,
      selectedDate: parseDeepLinkedDate() ?? todayString(),
      overlay: null,
      reminderSettings,
    });
    await persistShell(get());
    await get().reloadPlanner();
  },

  async setSelectedDate(date) {
    set({ selectedDate: date });
    await persistShell(get());
  },

  openOverlay(overlay) {
    set({ overlay });
    void persistShell(get());
  },

  closeOverlay() {
    set({ overlay: null });
    void persistShell(get());
  },

  openFocusForTask(taskId) {
    set({ focusedTaskId: taskId, overlay: 'focus' });
    void persistShell(get());
  },

  async addPlannerItem(input) {
    await getPlannerRepository().createItem(currentUserId, input, 'miniapp');
    set({ overlay: null, selectedDate: input.date });
    await persistShell(get());
    await get().reloadPlanner();
  },

  async updatePlannerItem(itemId, patch) {
    await getPlannerRepository().updateItem(currentUserId, itemId, patch);
    await get().reloadPlanner();
  },

  async markTaskDone(taskId) {
    await getPlannerRepository().updateItem(currentUserId, taskId, { status: 'done' });
    await get().reloadPlanner();
  },

  async moveTaskToNextDay(taskId) {
    const task = get().plannerItems.find((item) => item.id === taskId);
    if (!task) {
      return;
    }
    const nextDay = new Date(`${task.date}T00:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    const date = nextDay.toISOString().slice(0, 10);
    await getPlannerRepository().updateItem(currentUserId, taskId, { date, status: 'moved' });
    await get().reloadPlanner();
  },

  async answerCheckin(response) {
    await getPlannerRepository().recordCheckin(currentUserId, {
      date: get().selectedDate,
      type: 'midday_progress',
      response,
      completed: true,
    });
    await get().reloadPlanner();
  },

  async updateReminderSettings(patch) {
    const nextSettings = {
      ...get().reminderSettings,
      ...patch,
    };
    await getPlannerRepository().updateReminderSettings(currentUserId, nextSettings);
    set({
      reminderSettings: nextSettings,
      profile: get().profile
        ? {
            ...get().profile!,
            reminder: (patch.reminder as ReminderOption | undefined) ?? get().profile!.reminder,
            tone: (patch.tone as ToneOption | undefined) ?? get().profile!.tone,
            updatedAt: new Date().toISOString(),
          }
        : null,
    });
    await persistShell(get());
  },

  async rerunSetup() {
    set({ setupCompleted: false, overlay: null });
    await persistShell(get());
  },

  async resetAllData() {
    const plannerRepository = getPlannerRepository();
    await plannerRepository.updateReminderSettings(currentUserId, {
      reminder: 'off',
      tone: 'calm',
      expensesEnabled: false,
      workoutsEnabled: false,
    });
    window.localStorage.clear();
    set({
      ...createEmptyShellState(),
      initialized: true,
      plannerItems: [],
      dailyCheckins: [],
      reminderSettings: {
        reminder: 'off',
        tone: 'calm',
        expensesEnabled: false,
        workoutsEnabled: false,
      },
    });
  },
}));
