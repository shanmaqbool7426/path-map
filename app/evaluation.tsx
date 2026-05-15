import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

const RATINGS = [
  { label: 'Discipline', score: 4.5 },
  { label: 'Consistency', score: 4.5 },
  { label: 'Learning', score: 4.0 },
  { label: 'Task Completion', score: 4.5 },
  { label: 'Overall', score: 4.3 },
];

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
      <Text style={styles.scoreText}>{score}</Text>
    </View>
  );
}

export default function EvaluationScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Evaluation</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>This Week</Text>
          <Ionicons name="chevron-down" size={12} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.gradeCard}>
          <View style={styles.gradeTop}>
            <Ionicons name="star" size={28} color={Colors.orange} />
            <Text style={styles.gradeLabel}>Great Work!</Text>
          </View>
          <Text style={styles.gradeSubtext}>Here is your weekly evaluation</Text>

          <View style={styles.gradeBig}>
            <Text style={styles.gradeText}>B+</Text>
          </View>

          <View style={styles.divider} />

          {RATINGS.map((r) => (
            <View key={r.label} style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>{r.label}</Text>
              <StarRating score={r.score} />
            </View>
          ))}
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="bulb" size={20} color={Colors.orange} />
          </View>
          <Text style={styles.tipTitle}>AI Suggestion</Text>
          <Text style={styles.tipText}>
            Focus more on product research and marketing this week. Your foundation is strong — now it's time to test and iterate.
          </Text>
        </View>

        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>Next Week Goals</Text>
          {[
            'Complete 5 product research tasks',
            'Run first Facebook/TikTok ad test',
            'Reach out to 3 potential suppliers',
            'Build your email list to 50 subscribers',
          ].map((goal, i) => (
            <View key={i} style={styles.goalRow}>
              <View style={styles.goalNum}>
                <Text style={styles.goalNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.goalText}>{goal}</Text>
            </View>
          ))}
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
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  filterText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  gradeCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    marginBottom: 16,
  },
  gradeTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  gradeLabel: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  gradeSubtext: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular', marginBottom: 24 },
  gradeBig: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryBg,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  gradeText: { fontSize: 38, fontFamily: 'Inter_700Bold', color: Colors.primary },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 20 },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  ratingLabel: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.text },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  scoreText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: Colors.orange, marginLeft: 6 },
  tipCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.orangeBg,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.orange + '30',
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.orange + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.text },
  tipText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 20 },
  nextStepsCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 12,
  },
  nextStepsTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 4 },
  goalRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  goalNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryBg,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalNumText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: Colors.primary },
  goalText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 20 },
});
