import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOpenAIClient } from '@/utils/openai';

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
    platform?: string;
  };
  userName: string;
  userStreak: number;
  tasksCompleted: number;
  totalTasks: number;
  roadmapProgress: number;
  weeklyGoal: number;
  roadmapSteps: RoadmapStep[];
  tasks: Task[];
  estimatedTime: string;
  isGenerating: boolean;
  generationError: string | null;
}

interface AppContextType extends AppState {
  setOnboarded: () => void;
  setCategory: (cat: string, subcat?: string) => void;
  setAnswers: (answers: AppState['answers']) => void;
  generateRoadmapWithAI: (
    answers: AppState['answers'],
    category: string,
    subcategory: string
  ) => Promise<void>;
  generateRoadmap: () => void;
  completeTask: (id: string) => void;
  startTask: (id: string) => void;
  updateProgress: (progress: number) => void;
  resetApp: () => void;
}

const STEP_COLORS = ['#00D68F', '#6C63FF', '#06B6D4', '#F59E0B', '#EC4899', '#EF4444', '#8B5CF6'];

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'Watch: Shopify store setup tutorial (30 min)', type: 'Video', status: 'todo', dueDate: 'Today' },
  { id: '2', title: 'Research 5 profitable products', type: 'Research', status: 'todo', dueDate: 'Today' },
  { id: '3', title: 'Create a Shopify account and explore dashboard', type: 'Action', status: 'todo', dueDate: 'Today' },
  { id: '4', title: 'Join a winning products community', type: 'Networking', status: 'todo', dueDate: 'Today' },
  { id: '5', title: 'Install recommended Shopify apps', type: 'Action', status: 'inprogress', dueDate: 'Today' },
  { id: '6', title: 'Watch: Business mindset masterclass', type: 'Video', status: 'done', dueDate: 'Yesterday' },
  { id: '7', title: 'Read: Ecommerce basics guide', type: 'Research', status: 'done', dueDate: 'Yesterday' },
];

const FALLBACK_STEPS: RoadmapStep[] = [
  { id: '1', number: 1, title: 'Foundation', description: 'Build your core knowledge base', duration: '1-2 Weeks', color: '#00D68F', status: 'completed' },
  { id: '2', number: 2, title: 'Skill Building', description: 'Develop practical skills daily', duration: '2-4 Weeks', color: '#6C63FF', status: 'active' },
  { id: '3', number: 3, title: 'First Project', description: 'Build your first real project', duration: '3-4 Weeks', color: '#06B6D4', status: 'upcoming' },
  { id: '4', number: 4, title: 'Market Entry', description: 'Start earning from your skill', duration: '4-6 Weeks', color: '#F59E0B', status: 'upcoming' },
  { id: '5', number: 5, title: 'Growth', description: 'Scale and optimize your income', duration: 'Ongoing', color: '#EC4899', status: 'upcoming' },
];

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
    platform: 'Shopify',
  },
  userName: 'Ali Hassan',
  userStreak: 12,
  tasksCompleted: 28,
  totalTasks: 65,
  roadmapProgress: 42,
  weeklyGoal: 78,
  roadmapSteps: FALLBACK_STEPS,
  tasks: DEFAULT_TASKS,
  estimatedTime: '3–6 Months',
  isGenerating: false,
  generationError: null,
};

const AppContext = createContext<AppContextType>({
  ...defaultState,
  setOnboarded: () => {},
  setCategory: () => {},
  setAnswers: () => {},
  generateRoadmapWithAI: async () => {},
  generateRoadmap: () => {},
  completeTask: () => {},
  startTask: () => {},
  updateProgress: () => {},
  resetApp: () => {},
});

const STORAGE_KEY = '@pathpilot_state';

async function callAIRoadmap(
  answers: AppState['answers'],
  category: string,
  subcategory: string
): Promise<{ roadmapSteps: RoadmapStep[]; tasks: Task[]; estimatedTime: string }> {
  const openai = getOpenAIClient();

  const prompt = `You are PathPilot AI. Generate a personalized learning roadmap for:
- Category: ${category} (${subcategory})
- Platform: ${answers.platform || subcategory}
- Country: ${answers.country}
- Budget: ${answers.budget}
- Experience: ${answers.experience}
- Daily Hours: ${answers.hours}
- Goal: ${answers.goal}

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "roadmapSteps": [
    {
      "id": "1",
      "number": 1,
      "title": "Short Phase Title",
      "description": "Specific 1-sentence description of what to do",
      "duration": "1-2 Weeks",
      "status": "completed"
    }
  ],
  "tasks": [
    {
      "id": "1",
      "title": "Specific actionable task title",
      "type": "Video",
      "status": "todo",
      "dueDate": "Today"
    }
  ],
  "estimatedTime": "3-6 Months"
}

Rules:
- Generate exactly 5-6 roadmap steps. Step 1 status = "completed", step 2 = "active", rest = "upcoming"
- Generate exactly 6-8 tasks. Task types can be: Video, Research, Action, Networking, Practice
- Task statuses: 2-3 "done", 1 "inprogress", rest "todo". Due dates: "Today", "Yesterday", "This Week"
- Make everything very specific to ${category}/${subcategory} and ${answers.experience} level
- estimatedTime should reflect hours/day and experience level`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-5.4',
    messages: [{ role: 'user', content: prompt }],
    max_completion_tokens: 1200,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw);

  const steps: RoadmapStep[] = (parsed.roadmapSteps || []).map((s: any, i: number) => ({
    id: String(i + 1),
    number: i + 1,
    title: s.title || `Step ${i + 1}`,
    description: s.description || '',
    duration: s.duration || '2-3 Weeks',
    color: STEP_COLORS[i % STEP_COLORS.length],
    status: s.status || (i === 0 ? 'completed' : i === 1 ? 'active' : 'upcoming'),
  }));

  const tasks: Task[] = (parsed.tasks || []).map((t: any, i: number) => ({
    id: String(i + 1),
    title: t.title || 'Complete task',
    type: (['Video', 'Research', 'Action', 'Networking', 'Practice'].includes(t.type) ? t.type : 'Action') as Task['type'],
    status: (['todo', 'inprogress', 'done'].includes(t.status) ? t.status : 'todo') as Task['status'],
    dueDate: t.dueDate || 'Today',
  }));

  return {
    roadmapSteps: steps.length > 0 ? steps : FALLBACK_STEPS,
    tasks: tasks.length > 0 ? tasks : DEFAULT_TASKS,
    estimatedTime: parsed.estimatedTime || '3-6 Months',
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try {
          const parsed = JSON.parse(val);
          setState((prev) => ({ ...prev, ...parsed, isGenerating: false, generationError: null }));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const save = useCallback((newState: AppState) => {
    const { isGenerating, generationError, ...toSave } = newState;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
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
    update({ roadmapSteps: FALLBACK_STEPS, tasks: DEFAULT_TASKS });
  }, [update]);

  const generateRoadmapWithAI = useCallback(async (
    answers: AppState['answers'],
    category: string,
    subcategory: string
  ) => {
    setState((prev) => ({ ...prev, isGenerating: true, generationError: null }));
    try {
      const result = await callAIRoadmap(answers, category, subcategory);
      setState((prev) => {
        const next = {
          ...prev,
          roadmapSteps: result.roadmapSteps,
          tasks: result.tasks,
          estimatedTime: result.estimatedTime,
          isGenerating: false,
          isOnboarded: true,
        };
        save(next);
        return next;
      });
    } catch (err: any) {
      setState((prev) => {
        const next = {
          ...prev,
          roadmapSteps: FALLBACK_STEPS,
          tasks: DEFAULT_TASKS,
          isGenerating: false,
          generationError: 'Could not reach AI. Using smart defaults.',
          isOnboarded: true,
        };
        save(next);
        return next;
      });
    }
  }, [save]);

  const completeTask = useCallback((id: string) => {
    setState((prev) => {
      const tasks = prev.tasks.map((t) =>
        t.id === id ? { ...t, status: 'done' as const } : t
      );
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
      generateRoadmapWithAI,
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
