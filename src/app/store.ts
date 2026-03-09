import { create } from 'zustand';

import { generateOperationalProfile } from '@/lib/profile/deriveProfile';
import { createStorageAdapter } from '@/lib/storage';
import type {
  AppStateSnapshot,
  EnergyPattern,
  OnboardingAnswers,
  TabId,
  TaskBucket,
  TaskItem,
  TaskType,
  TodayMode,
} from '@/types/models';
import { createCompletedDemoState, createDemoState } from './seed';

const storage = createStorageAdapter();

interface AppStore extends AppStateSnapshot {
  initialized: boolean;
  storageKind: string;
  loadState: () => Promise<void>;
  completeOnboarding: (answers: OnboardingAnswers) => Promise<void>;
  setActiveTab: (tab: TabId) => void;
  setTodayMode: (mode: TodayMode) => void;
  setTodayEnergy: (energy: EnergyPattern | null) => void;
  addTask: (input: {
    title: string;
    type: TaskType;
    bucket: TaskBucket;
    urgency: 'low' | 'medium' | 'high';
    nextAction?: string;
  }) => Promise<void>;
  toggleTaskDone: (taskId: string) => Promise<void>;
  movePriorityTask: (taskId: string, direction: 'up' | 'down') => Promise<void>;
  updateProfileNotes: (patch: Pick<OnboardingAnswers, 'avoidPhrases' | 'startHelps'>) => Promise<void>;
  requestDemoReset: () => Promise<void>;
}

async function persistState(state: AppStore) {
  const snapshot: AppStateSnapshot = {
    onboardingCompleted: state.onboardingCompleted,
    onboardingAnswers: state.onboardingAnswers,
    profile: state.profile,
    tasks: state.tasks,
    weeklyReview: state.weeklyReview,
    todayMode: state.todayMode,
    todayEnergy: state.todayEnergy,
    activeTab: state.activeTab,
  };

  await storage.save(snapshot);
}

function reorderPriorityTasks(tasks: TaskItem[], taskId: string, direction: 'up' | 'down') {
  const priorities = tasks.filter((task) => task.bucket === 'priority');
  const index = priorities.findIndex((task) => task.id === taskId);
  if (index === -1) {
    return tasks;
  }

  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= priorities.length) {
    return tasks;
  }

  const nextPriorities = [...priorities];
  [nextPriorities[index], nextPriorities[swapIndex]] = [nextPriorities[swapIndex], nextPriorities[index]];

  const others = tasks.filter((task) => task.bucket !== 'priority');
  return [...nextPriorities, ...others];
}

export const useAppStore = create<AppStore>((set, get) => ({
  ...createDemoState(),
  initialized: false,
  storageKind: storage.kind,

  async loadState() {
    const loaded = (await storage.load()) ?? (import.meta.env.DEV ? createCompletedDemoState() : createDemoState());
    set({
      ...loaded,
      initialized: true,
      storageKind: storage.kind,
    });
  },

  async completeOnboarding(answers) {
    const profile = generateOperationalProfile(answers);
    set({
      onboardingCompleted: true,
      onboardingAnswers: answers,
      profile,
      activeTab: 'today',
    });
    await persistState(get());
  },

  setActiveTab(tab) {
    set({ activeTab: tab });
    void persistState(get());
  },

  setTodayMode(mode) {
    set({ todayMode: mode });
    void persistState(get());
  },

  setTodayEnergy(energy) {
    set({ todayEnergy: energy });
    void persistState(get());
  },

  async addTask(input) {
    const task: TaskItem = {
      id: crypto.randomUUID(),
      status: 'todo',
      ...input,
    };

    set((state) => ({ tasks: [task, ...state.tasks] }));
    await persistState(get());
  },

  async toggleTaskDone(taskId) {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task,
      ),
    }));
    await persistState(get());
  },

  async movePriorityTask(taskId, direction) {
    set((state) => ({
      tasks: reorderPriorityTasks(state.tasks, taskId, direction),
    }));
    await persistState(get());
  },

  async updateProfileNotes(patch) {
    const answers = get().onboardingAnswers;
    if (!answers) {
      return;
    }

    const nextAnswers = { ...answers, ...patch };
    set({
      onboardingAnswers: nextAnswers,
      profile: generateOperationalProfile(nextAnswers),
    });
    await persistState(get());
  },

  async requestDemoReset() {
    const state = createCompletedDemoState();
    set({ ...state, initialized: true, storageKind: storage.kind });
    await persistState(get());
  },
}));
