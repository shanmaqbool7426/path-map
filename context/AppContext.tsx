import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RoadmapStep {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  color: string;
  status: 'completed' | 'active' | 'upcoming';
}

export interface Task {
  id: string;
  title: string;
  type: 'Video' | 'Research' | 'Action' | 'Networking' | 'Practice';
  status: 'todo' | 'inprogress' | 'done';
  dueDate: string;
}

export interface AppState {
  isOnboarded: boolean;
  selectedCategory: string;
  selectedSubcategory: string;
  answers: {
    country: string;
    budget: string;
    experience: string;
    hours: string;
    goal: string;
    market: string;
  };
  userName: string;
  userStreak: number;
  tasksCompleted: number;
  totalTasks: number;
  roadmapProgress: number;
  weeklyGoal: number;
  roadmapSteps: RoadmapStep[];
  tasks: Task[];
}

interface AppContextType extends AppState {
  setOnboarded: () => void;
  setCategory: (cat: string, subcat?: string) => void;
  setAnswers: (answers: AppState['answers']) => void;
  generateRoadmap: () => void;
  completeTask: (id: string) => void;
  startTask: (id: string) => void;
  updateProgress: (progress: number) => void;
  resetApp: () => void;
}

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'Watch: Shopify store setup tutorial (30 min)', type: 'Video', status: 'todo', dueDate: 'Today' },
  { id: '2', title: 'Research 5 profitable products', type: 'Research', status: 'todo', dueDate: 'Today' },
  { id: '3', title: 'Create a Shopify account and explore dashboard', type: 'Action', status: 'todo', dueDate: 'Today' },
  { id: '4', title: 'Join a winning products community', type: 'Networking', status: 'todo', dueDate: 'Today' },
  { id: '5', title: 'Install recommended Shopify apps', type: 'Action', status: 'inprogress', dueDate: 'Today' },
  { id: '6', title: 'Watch: Business mindset masterclass', type: 'Video', status: 'done', dueDate: 'Yesterday' },
  { id: '7', title: 'Read: Ecommerce basics guide', type: 'Research', status: 'done', dueDate: 'Yesterday' },
];

const generateRoadmapSteps = (category: string, subcategory: string): RoadmapStep[] => {
  const templates: Record<string, RoadmapStep[]> = {
    Ecommerce: [
      { id: '1', number: 1, title: 'Foundation', description: 'Learn basics of ecommerce and Shopify', duration: '1-2 Weeks', color: '#00D68F', status: 'completed' },
      { id: '2', number: 2, title: 'Store Setup', description: 'Build your Shopify store step-by-step', duration: '2-3 Weeks', color: '#6C63FF', status: 'active' },
      { id: '3', number: 3, title: 'Product Research', description: 'Find winning products to sell', duration: '3-4 Weeks', color: '#06B6D4', status: 'upcoming' },
      { id: '4', number: 4, title: 'Marketing', description: 'Drive traffic and get your first sales', duration: '4-6 Weeks', color: '#F59E0B', status: 'upcoming' },
      { id: '5', number: 5, title: 'Scale & Growth', description: 'Optimize and scale your business', duration: 'Ongoing', color: '#EC4899', status: 'upcoming' },
    ],
    Freelancing: [
      { id: '1', number: 1, title: 'Skill Development', description: 'Master your chosen skill set', duration: '2-4 Weeks', color: '#00D68F', status: 'completed' },
      { id: '2', number: 2, title: 'Portfolio Building', description: 'Create 3-5 impressive projects', duration: '3-4 Weeks', color: '#6C63FF', status: 'active' },
      { id: '3', number: 3, title: 'Profile Setup', description: 'Optimize Upwork/Fiverr profiles', duration: '1 Week', color: '#06B6D4', status: 'upcoming' },
      { id: '4', number: 4, title: 'First Clients', description: 'Land your first paid projects', duration: '4-6 Weeks', color: '#F59E0B', status: 'upcoming' },
      { id: '5', number: 5, title: 'Scale Income', description: 'Raise rates and build reputation', duration: 'Ongoing', color: '#EC4899', status: 'upcoming' },
    ],
    default: [
      { id: '1', number: 1, title: 'Foundation', description: 'Build your core knowledge base', duration: '1-2 Weeks', color: '#00D68F', status: 'completed' },
      { id: '2', number: 2, title: 'Skill Building', description: 'Develop practical skills', duration: '2-4 Weeks', color: '#6C63FF', status: 'active' },
      { id: '3', number: 3, title: 'First Project', description: 'Build your first real project', duration: '3-4 Weeks', color: '#06B6D4', status: 'upcoming' },
      { id: '4', number: 4, title: 'Market Entry', description: 'Start earning from your skill', duration: '4-6 Weeks', color: '#F59E0B', status: 'upcoming' },
      { id: '5', number: 5, title: 'Growth', description: 'Scale and optimize your income', duration: 'Ongoing', color: '#EC4899', status: 'upcoming' },
    ],
  };
  return templates[category] || templates.default;
};

const defaultState: AppState = {
  isOnboarded: false,
  selectedCategory: 'Ecommerce',
  selectedSubcategory: 'Shopify',
  answers: {
    country: 'Pakistan',
    budget: 'Low Budget',
    experience: 'Beginner',
    hours: '3-4 Hours',
    goal: 'Fast Income',
    market: 'Local',
  },
  userName: 'Ali Hassan',
  userStreak: 12,
  tasksCompleted: 28,
  totalTasks: 65,
  roadmapProgress: 42,
  weeklyGoal: 78,
  roadmapSteps: generateRoadmapSteps('Ecommerce', 'Shopify'),
  tasks: DEFAULT_TASKS,
};

const AppContext = createContext<AppContextType>({
  ...defaultState,
  setOnboarded: () => {},
  setCategory: () => {},
  setAnswers: () => {},
  generateRoadmap: () => {},
  completeTask: () => {},
  startTask: () => {},
  updateProgress: () => {},
  resetApp: () => {},
});

const STORAGE_KEY = '@pathpilot_state';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try {
          const parsed = JSON.parse(val);
          setState((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const save = useCallback((newState: AppState) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const update = useCallback((partial: Partial<AppState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      save(next);
      return next;
    });
  }, [save]);

  const setOnboarded = useCallback(() => update({ isOnboarded: true }), [update]);

  const setCategory = useCallback((cat: string, subcat?: string) => {
    update({ selectedCategory: cat, selectedSubcategory: subcat || cat });
  }, [update]);

  const setAnswers = useCallback((answers: AppState['answers']) => {
    update({ answers });
  }, [update]);

  const generateRoadmap = useCallback(() => {
    const steps = generateRoadmapSteps(state.selectedCategory, state.selectedSubcategory);
    update({ roadmapSteps: steps, tasks: DEFAULT_TASKS });
  }, [state.selectedCategory, state.selectedSubcategory, update]);

  const completeTask = useCallback((id: string) => {
    setState((prev) => {
      const tasks = prev.tasks.map((t) =>
        t.id === id ? { ...t, status: 'done' as const } : t
      );
      const completed = tasks.filter((t) => t.status === 'done').length;
      const next = { ...prev, tasks, tasksCompleted: prev.tasksCompleted + 1 };
      save(next);
      return next;
    });
  }, [save]);

  const startTask = useCallback((id: string) => {
    setState((prev) => {
      const tasks = prev.tasks.map((t) =>
        t.id === id ? { ...t, status: 'inprogress' as const } : t
      );
      const next = { ...prev, tasks };
      save(next);
      return next;
    });
  }, [save]);

  const updateProgress = useCallback((progress: number) => {
    update({ roadmapProgress: progress });
  }, [update]);

  const resetApp = useCallback(() => {
    AsyncStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }, []);

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      ...state,
      setOnboarded,
      setCategory,
      setAnswers,
      generateRoadmap,
      completeTask,
      startTask,
      updateProgress,
      resetApp,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
