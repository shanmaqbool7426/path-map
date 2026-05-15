import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useApp, WeeklyEvaluation, EvaluationRatings } from '@/context/AppContext';

function StarRating({ score }: { score: number }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.floor(score) ? 'star' : score >= i - 0.5 ? 'star-half' : 'star-outline'}
          size={16}
          color={Colors.orange}
        />
      ))}
      <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
    </View>
  );
}

function gradeColor(grade: string): string {
  if (grade.startsWith('A')) return Colors.primary;
  if (grade.startsWith('B')) return Colors.accent;
  if (grade.startsWith('C')) return Colors.orange;
  return Colors.red;
}

const RATING_LABELS: { key: keyof EvaluationRatings; label: string }[] = [
  { key: 'discipline', label: 'Discipline' },
  { key: 'consistency', label: 'Consistency' },
  { key: 'learning', label: 'Learning' },
  { key: 'taskCompletion', label: 'Task Completion' },
  { key: 'overall', label: 'Overall' },
];

const ANALYZING_TIPS = [
  'Reviewing your completed tasks...',
  'Calculating performance scores...',
  'Analyzing your consistency...',
  'Writing personalized feedback...',
  'Setting next week goals...',
];

export default function EvaluationScreen() {
  const insets = useSafeAreaInsets();
  const {
    weeklyEvaluation,
    isEvaluating,
    evaluationError,
    runWeeklyEvaluation,
    tasks,
    userStreak,
    roadmapProgress,
    selectedCategory,
    selectedSubcategory,
  } = useApp();
  const [tipIndex, setTipIndex] = useState(0);

  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const completionRate = Math.round((doneTasks / Math.max(tasks.length, 1)) * 100);

  const handleEvaluate = async () => {
    setTipIndex(0);
    const tipTimer = setInterval(() => {
      setTipIndex((i) => Math.min(i + 1, ANALYZING_TIPS.length - 1));
    }, 1200);
    await runWeeklyEvaluation();
    clearInterval(tipTimer);
  };

  if (isEvaluating) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
        <LinearGradient colors={['rgba(108,99,255,0.08)', 'transparent']} style={styles.loadingGradient} />
        <View style={styles.loadingContent}>
          <View style={styles.evalOrb}>
            <LinearGradient colors={[Colors.accent, Colors.primary]} style={styles.evalOrbInner}>
              <Ionicons name="analytics" size={32} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={styles.loadingTitle}>AI is Evaluating</Text>
          <Text style={styles.loadingSubtitle}>Analyzing your week's performance</Text>
          <View style={styles.tipBox}>
            <ActivityIndicator size="small" color={Colors.accent} />
            <Text style={styles.tipText}>{ANALYZING_TIPS[tipIndex]}</Text>
          </View>
          <View style={styles.statsSummary}>
            <View style={styles.statBubble}>
              <Text style={styles.statNum}>{doneTasks}</Text>
              <Text style={styles.statLabel}>Tasks Done</Text>
            </View>
            <View style={styles.statBubble}>
              <Text style={styles.statNum}>{userStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statBubble}>
              <Text style={styles.statNum}>{roadmapProgress}%</Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (!weeklyEvaluation) {
    return (
      <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Weekly Evaluation</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.emptyState}>
          <LinearGradient colors={['rgba(108,99,255,0.12)', 'transparent']} style={styles.emptyGlow} />
          <View style={styles.emptyOrb}>
            <Ionicons name="star" size={40} color={Colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>Evaluate Your Week</Text>
          <Text style={styles.emptySubtitle}>
            Get a personalized AI-powered grade, performance scores, and next week's goals based on your actual activity.
          </Text>

          <View style={styles.statsPreview}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
              <Text style={styles.statCardNum}>{doneTasks}/{tasks.length}</Text>
              <Text style={styles.statCardLabel}>Tasks Done</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={22} color={Colors.orange} />
              <Text style={styles.statCardNum}>{userStreak}</Text>
              <Text style={styles.statCardLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={22} color={Colors.accent} />
              <Text style={styles.statCardNum}>{roadmapProgress}%</Text>
              <Text style={styles.statCardLabel}>Roadmap</Text>
            </View>
          </View>

          {evaluationError && (
            <View style={styles.errorBox}>
              <Ionicons name="warning" size={16} color={Colors.orange} />
              <Text style={styles.errorText}>{evaluationError}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.evaluateBtn} onPress={handleEvaluate} activeOpacity={0.85}>
            <LinearGradient colors={[Colors.accent, Colors.primary]} style={styles.evaluateBtnGradient}>
              <Ionicons name="flash" size={20} color="#fff" />
              <Text style={styles.evaluateBtnText}>Generate AI Evaluation</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.poweredBy}>Powered by GPT · Takes ~5 seconds</Text>
        </View>
      </View>
    );
  }

  const ev = weeklyEvaluation;
  const gColor = gradeColor(ev.grade);
  const evalDate = new Date(ev.generatedAt);
  const dateStr = evalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Evaluation</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={handleEvaluate}>
          <Ionicons name="refresh" size={14} color={Colors.textSecondary} />
          <Text style={styles.filterText}>Re-run</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.gradeCard}>
          <LinearGradient
            colors={[gColor + '18', 'transparent']}
            style={styles.gradeCardGlow}
          />
          <View style={styles.gradeTop}>
            <Ionicons name="star" size={26} color={Colors.orange} />
            <Text style={styles.gradeLabel}>{ev.headline}</Text>
          </View>
          <Text style={styles.gradeSubtext}>Week of {dateStr} · {selectedCategory}</Text>

          <View style={[styles.gradeBig, { borderColor: gColor }]}>
            <Text style={[styles.gradeText, { color: gColor }]}>{ev.grade}</Text>
          </View>

          <View style={styles.divider} />

          {RATING_LABELS.map(({ key, label }) => (
            <View key={key} style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>{label}</Text>
              <StarRating score={ev.ratings[key]} />
            </View>
          ))}
        </View>

        <View style={styles.feedbackCard}>
          <View style={styles.feedbackIcon}>
            <Ionicons name="chatbubble-ellipses" size={18} color={Colors.accent} />
          </View>
          <Text style={styles.feedbackTitle}>AI Feedback</Text>
          <Text style={styles.feedbackText}>{ev.feedback}</Text>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="bulb" size={20} color={Colors.orange} />
          </View>
          <Text style={styles.tipTitle}>AI Suggestion</Text>
          <Text style={styles.tipText}>{ev.suggestion}</Text>
        </View>

        <View style={styles.nextStepsCard}>
          <View style={styles.nextStepsHeader}>
            <Ionicons name="rocket" size={18} color={Colors.primary} />
            <Text style={styles.nextStepsTitle}>Next Week Goals</Text>
          </View>
          {ev.nextWeekGoals.map((goal, i) => (
            <View key={i} style={styles.goalRow}>
              <View style={styles.goalNum}>
                <Text style={styles.goalNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.goalText}>{goal}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.rerunBtn} onPress={handleEvaluate} activeOpacity={0.8}>
          <Ionicons name="refresh" size={16} color={Colors.textSecondary} />
          <Text style={styles.rerunText}>Re-evaluate with updated progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
  loadingGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  loadingContent: { alignItems: 'center', paddingHorizontal: 40, gap: 18 },
  evalOrb: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.accentBg, borderWidth: 2, borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  evalOrbInner: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  loadingTitle: { fontSize: 26, fontFamily: 'Inter_700Bold', color: Colors.text, textAlign: 'center' },
  loadingSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, textAlign: 'center' },
  tipBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 16, paddingVertical: 12, marginTop: 4,
  },
  tipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.accent },
  statsSummary: { flexDirection: 'row', gap: 12, marginTop: 8 },
  statBubble: {
    flex: 1, backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 12, alignItems: 'center', gap: 4,
  },
  statNum: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.text },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.text },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.card, borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  filterText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 20 },
  emptyGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  emptyOrb: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.accentBg, borderWidth: 2, borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.text, textAlign: 'center' },
  emptySubtitle: {
    fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
  statsPreview: { flexDirection: 'row', gap: 10, width: '100%' },
  statCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 16, alignItems: 'center', gap: 6,
  },
  statCardNum: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.text },
  statCardLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.orangeBg, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    width: '100%',
  },
  errorText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.orange, flex: 1 },
  evaluateBtn: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  evaluateBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16,
  },
  evaluateBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  poweredBy: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: -8 },

  scroll: { paddingBottom: 40 },
  gradeCard: {
    marginHorizontal: 24, backgroundColor: Colors.card,
    borderRadius: Colors.radiusLg, borderWidth: 1, borderColor: Colors.border,
    padding: 24, marginBottom: 16, overflow: 'hidden',
  },
  gradeCardGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  gradeTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  gradeLabel: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  gradeSubtext: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular', marginBottom: 24 },
  gradeBig: {
    alignSelf: 'center', width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.card, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  gradeText: { fontSize: 38, fontFamily: 'Inter_700Bold' },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 20 },
  ratingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
  },
  ratingLabel: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.text },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  scoreText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: Colors.orange, marginLeft: 6 },

  feedbackCard: {
    marginHorizontal: 24, backgroundColor: Colors.accentBg,
    borderRadius: Colors.radius, borderWidth: 1, borderColor: Colors.accent + '30',
    padding: 16, marginBottom: 12, gap: 8,
  },
  feedbackIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.accent + '30', alignItems: 'center', justifyContent: 'center',
  },
  feedbackTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.text },
  feedbackText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 20 },

  tipCard: {
    marginHorizontal: 24, backgroundColor: Colors.orangeBg,
    borderRadius: Colors.radius, borderWidth: 1, borderColor: Colors.orange + '30',
    padding: 16, marginBottom: 12, gap: 8,
  },
  tipIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.orange + '30', alignItems: 'center', justifyContent: 'center',
  },
  tipTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.text },
  tipText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 20 },

  nextStepsCard: {
    marginHorizontal: 24, backgroundColor: Colors.card,
    borderRadius: Colors.radius, borderWidth: 1, borderColor: Colors.border,
    padding: 16, gap: 12, marginBottom: 16,
  },
  nextStepsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  nextStepsTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.text },
  goalRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  goalNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primaryBg, borderWidth: 1, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  goalNumText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: Colors.primary },
  goalText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 20 },

  rerunBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 24, paddingVertical: 12,
    backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
  },
  rerunText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
});
