import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { roadmapSteps, tasks, userStreak, roadmapProgress, tasksCompleted, selectedCategory } = useApp();

  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === 'inprogress').length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const completedSteps = roadmapSteps.filter((s) => s.status === 'completed').length;
  const totalSteps = roadmapSteps.length;

  const taskTypeStats = ['Action', 'Video', 'Research', 'Networking', 'Practice'].map((type) => {
    const total = tasks.filter((t) => t.type === type).length;
    const done = tasks.filter((t) => t.type === type && t.status === 'done').length;
    return { label: type, total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }).filter((s) => s.total > 0);

  const SKILL_COLORS: Record<string, string> = {
    Action: Colors.primary,
    Video: Colors.red,
    Research: Colors.cyan,
    Networking: Colors.accent,
    Practice: Colors.orange,
  };

  const streakLevel = userStreak >= 30 ? 'Elite' : userStreak >= 14 ? 'Consistent' : userStreak >= 7 ? 'Building' : 'Starting';
  const streakColor = userStreak >= 30 ? Colors.orange : userStreak >= 14 ? Colors.primary : userStreak >= 7 ? Colors.cyan : Colors.textSecondary;

  const weeklyBars = [
    Math.max(10, completionRate - 20),
    Math.max(10, completionRate - 10),
    Math.max(10, completionRate - 5),
    completionRate,
    Math.min(100, completionRate + 5),
    Math.min(100, completionRate + 10),
    completionRate,
  ];
  const BAR_MAX = Math.max(...weeklyBars);

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Skill Analytics</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{selectedCategory}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>{doneTasks}</Text>
            <Text style={styles.summaryLabel}>Tasks Done</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryNum, { color: Colors.accent }]}>{completionRate}%</Text>
            <Text style={styles.summaryLabel}>Completion</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryNum, { color: streakColor }]}>{userStreak}</Text>
            <Text style={styles.summaryLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Roadmap Progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${roadmapProgress}%` }]} />
            </View>
            <Text style={styles.progressPct}>{roadmapProgress}%</Text>
          </View>
          <Text style={styles.progressSub}>{completedSteps} of {totalSteps} steps completed</Text>

          <View style={styles.stepsList}>
            {roadmapSteps.map((step) => (
              <View key={step.id} style={styles.stepRow}>
                <View style={[styles.stepDot, {
                  backgroundColor: step.status === 'completed' ? Colors.primary : step.status === 'active' ? Colors.accent : Colors.cardGlass,
                  borderColor: step.status === 'completed' ? Colors.primary : step.status === 'active' ? Colors.accent : Colors.border,
                }]}>
                  {step.status === 'completed' && <Ionicons name="checkmark" size={10} color="#0A0E1A" />}
                  {step.status === 'active' && <View style={styles.activeDot} />}
                </View>
                <Text style={[styles.stepLabel, { color: step.status === 'upcoming' ? Colors.textMuted : Colors.text }]}>{step.title}</Text>
                <View style={[styles.stepStatusBadge, {
                  backgroundColor: step.status === 'completed' ? Colors.primaryBg : step.status === 'active' ? Colors.accentBg : Colors.cardGlass,
                }]}>
                  <Text style={[styles.stepStatusText, {
                    color: step.status === 'completed' ? Colors.primary : step.status === 'active' ? Colors.accent : Colors.textMuted,
                  }]}>{step.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {taskTypeStats.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Task Type Breakdown</Text>
            <View style={styles.skillBars}>
              {taskTypeStats.map((skill) => (
                <View key={skill.label} style={styles.skillRow}>
                  <View style={styles.skillLabelRow}>
                    <Text style={styles.skillLabel}>{skill.label}</Text>
                    <Text style={[styles.skillValue, { color: SKILL_COLORS[skill.label] || Colors.primary }]}>
                      {skill.done}/{skill.total}
                    </Text>
                  </View>
                  <View style={styles.skillTrack}>
                    <View style={[styles.skillFill, { width: `${skill.pct}%`, backgroundColor: SKILL_COLORS[skill.label] || Colors.primary }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Weekly Completion Trend</Text>
          <View style={styles.barChart}>
            {weeklyBars.map((val, i) => (
              <View key={i} style={styles.barCol}>
                <Text style={[styles.barValue, { color: i === 3 ? Colors.primary : Colors.textMuted }]}>
                  {val}%
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${(val / BAR_MAX) * 100}%`,
                        backgroundColor: i === 3 ? Colors.primary : Colors.accent + '60',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barDay}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View style={[styles.streakIcon, { backgroundColor: Colors.orangeBg }]}>
              <Ionicons name="flame" size={22} color={Colors.orange} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.streakTitle}>Current Streak</Text>
              <Text style={styles.streakValue}>{userStreak} Days</Text>
            </View>
            <View style={[styles.streakBadge, { backgroundColor: streakColor + '20' }]}>
              <Text style={[styles.streakLevel, { color: streakColor }]}>{streakLevel}</Text>
            </View>
          </View>
          <View style={styles.streakTrack}>
            <View style={[styles.streakFill, { width: `${Math.min(100, (userStreak / 30) * 100)}%`, backgroundColor: streakColor }]} />
          </View>
          <Text style={styles.streakSub}>{Math.max(0, 30 - userStreak)} days to Elite status</Text>
        </View>

        <View style={styles.tasksOverviewCard}>
          <Text style={styles.sectionTitle}>Tasks Overview</Text>
          <View style={styles.tasksOverviewRow}>
            <View style={styles.taskStatBox}>
              <Text style={[styles.taskStatNum, { color: Colors.textSecondary }]}>{tasks.filter(t => t.status === 'todo').length}</Text>
              <Text style={styles.taskStatLabel}>To Do</Text>
            </View>
            <View style={styles.taskStatBox}>
              <Text style={[styles.taskStatNum, { color: Colors.accent }]}>{inProgressTasks}</Text>
              <Text style={styles.taskStatLabel}>In Progress</Text>
            </View>
            <View style={styles.taskStatBox}>
              <Text style={[styles.taskStatNum, { color: Colors.primary }]}>{doneTasks}</Text>
              <Text style={styles.taskStatLabel}>Completed</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.text },
  categoryBadge: {
    backgroundColor: Colors.primaryBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  summaryNum: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  summaryLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  sectionCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 16 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  progressTrack: { flex: 1, height: 8, backgroundColor: Colors.cardGlass, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  progressPct: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.primary, minWidth: 36 },
  progressSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginBottom: 16 },
  stepsList: { gap: 10 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent },
  stepLabel: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
  stepStatusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  stepStatusText: { fontSize: 10, fontFamily: 'Inter_600SemiBold', textTransform: 'capitalize' },
  skillBars: { gap: 14 },
  skillRow: { gap: 8 },
  skillLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  skillLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.text },
  skillValue: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  skillTrack: { height: 6, backgroundColor: Colors.cardGlass, borderRadius: 3 },
  skillFill: { height: '100%', borderRadius: 3 },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
  },
  barCol: { flex: 1, alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' },
  barValue: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  barTrack: {
    width: 26,
    backgroundColor: Colors.cardGlass,
    borderRadius: 6,
    overflow: 'hidden',
    height: 70,
    justifyContent: 'flex-end',
  },
  barFill: { width: '100%', borderRadius: 6 },
  barDay: { fontSize: 10, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  streakCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  streakHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  streakIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  streakTitle: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  streakValue: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  streakBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  streakLevel: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  streakTrack: { height: 6, backgroundColor: Colors.cardGlass, borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  streakFill: { height: '100%', borderRadius: 3 },
  streakSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  tasksOverviewCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  tasksOverviewRow: { flexDirection: 'row', gap: 10 },
  taskStatBox: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  taskStatNum: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  taskStatLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
});
