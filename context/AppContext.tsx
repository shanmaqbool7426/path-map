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

export interface EvaluationRatings {
  discipline: number;
  consistency: number;
  learning: number;
  taskCompletion: number;
  overall: number;
}

export interface WeeklyEvaluation {
  grade: string;
  headline: string;
  feedback: string;
  ratings: EvaluationRatings;
  suggestion: string;
  nextWeekGoals: string[];
  generatedAt: string;
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
  weeklyEvaluation: WeeklyEvaluation | null;
  isEvaluating: boolean;
  evaluationError: string | null;
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
  runWeeklyEvaluation: () => Promise<void>;
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
  weeklyEvaluation: null,
  isEvaluating: false,
  evaluationError: null,
};

const AppContext = createContext<AppContextType>({
  ...defaultState,
  setOnboarded: () => {},
  setCategory: () => {},
  setAnswers: () => {},
  generateRoadmapWithAI: async () => {},
  generateRoadmap: () => {},
  runWeeklyEvaluation: async () => {},
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

Return ONLY valid JSON (no markdown):
{
  "roadmapSteps": [{"id":"1","number":1,"title":"Short Phase Title","description":"Specific 1-sentence description","duration":"1-2 Weeks","status":"completed"}],
  "tasks": [{"id":"1","title":"Specific actionable task","type":"Video","status":"todo","dueDate":"Today"}],
  "estimatedTime": "3-6 Months"
}
Rules: 5-6 steps (step1=completed, step2=active, rest=upcoming), 6-8 tasks (2-3 done, 1 inprogress, rest todo), task types: Video/Research/Action/Networking/Practice, dueDates: Today/Yesterday/This Week. Be specific to ${category}/${subcategory} and ${answers.experience} level.`;

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

async function callAIEvaluation(state: AppState): Promise<WeeklyEvaluation> {
  const openai = getOpenAIClient();
  const doneTasks = state.tasks.filter((t) => t.status === 'done');
  const totalTasks = state.tasks.length;
  const completionRate = Math.round((doneTasks.length / Math.max(totalTasks, 1)) * 100);

  const prompt = `You are PathPilot AI evaluating a user's weekly performance. Analyze and give an honest assessment:

User Profile:
- Category: ${state.selectedCategory} (${state.selectedSubcategory})
- Goal: ${state.answers.goal}
- Experience: ${state.answers.experience}
- Daily Hours: ${state.answers.hours}

This Week's Stats:
- Tasks completed: ${doneTasks.length} out of ${totalTasks} (${completionRate}%)
- Current streak: ${state.userStreak} days
- Overall roadmap progress: ${state.roadmapProgress}%
- Weekly goal reached: ${state.weeklyGoal}%

Completed tasks: ${doneTasks.map((t) => t.title).join(', ') || 'None'}

Return ONLY valid JSON (no markdown):
{
  "grade": "B+",
  "headline": "3-4 word motivating title",
  "feedback": "2-3 sentence honest personalized feedback on their performance this week",
  "ratings": {
    "discipline": 4.5,
    "consistency": 4.0,
    "learning": 4.5,
    "taskCompletion": 4.0,
    "overall": 4.3
  },
  "suggestion": "1-2 sentence specific AI suggestion for improvement next week",
  "nextWeekGoals": ["goal 1", "goal 2", "goal 3", "goal 4"]
}

Rules:
- grade: A+/A/A-/B+/B/B-/C+/C based on completion rate and streak
- ratings: 1.0–5.0, reflect actual performance (don't always give high scores)
- nextWeekGoals: 4 specific, actionable goals tailored to ${state.selectedCategory}/${state.selectedSubcategory}
- Be honest but encouraging. Low completion = lower grade.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-5.4',
    messages: [{ role: 'user', content: prompt }],
    max_completion_tokens: 600,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw);

  return {
    grade: parsed.grade || 'B',
    headline: parsed.headline || 'Keep Going!',
    feedback: parsed.feedback || 'You made progress this week. Keep building momentum.',
    ratings: {
      discipline: Number(parsed.ratings?.discipline) || 3.5,
      consistency: Number(parsed.ratings?.consistency) || 3.5,
      learning: Number(parsed.ratings?.learning) || 3.5,
      taskCompletion: Number(parsed.ratings?.taskCompletion) || 3.5,
      overall: Number(parsed.ratings?.overall) || 3.5,
    },
    suggestion: parsed.suggestion || 'Focus on completing more tasks consistently each day.',
    nextWeekGoals: Array.isArray(parsed.nextWeekGoals) ? parsed.nextWeekGoals.slice(0, 4) : [
      'Complete all daily tasks',
      'Maintain your streak',
      'Advance one roadmap step',
      'Review your progress',
    ],
    generatedAt: new Date().toISOString(),
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
          setState((prev) => ({
            ...prev,
            ...parsed,
            isGenerating: false,
            generationError: null,
            isEvaluating: false,
            evaluationError: null,
          }));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const save = useCallback((newState: AppState) => {
    const { isGenerating, generationError, isEvaluating, evaluationError, ...toSave } = newState;
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
    } catch {
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

  const runWeeklyEvaluation = useCallback(async () => {
    setState((prev) => ({ ...prev, isEvaluating: true, evaluationError: null }));
    try {
      const currentState = await new Promise<AppState>((resolve) => {
        setState((prev) => { resolve(prev); return prev; });
      });
      const evaluation = await callAIEvaluation(currentState);
      setState((prev) => {
        const next = { ...prev, weeklyEvaluation: evaluation, isEvaluating: false };
        save(next);
        return next;
      });
    } catch {
      setState((prev) => ({
        ...prev,
        isEvaluating: false,
        evaluationError: 'Could not generate evaluation. Please try again.',
      }));
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
      runWeeklyEvaluation,
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
