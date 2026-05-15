import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useApp, RoadmapStep } from '@/context/AppContext';

const STATUS_COLOR: Record<RoadmapStep['status'], string> = {
  completed: Colors.primary,
  active: Colors.accent,
  upcoming: Colors.textMuted,
};

const STATUS_BG: Record<RoadmapStep['status'], string> = {
  completed: Colors.primaryBg,
  active: Colors.accentBg,
  upcoming: 'rgba(75,85,99,0.2)',
};

export default function RoadmapScreen() {
  const insets = useSafeAreaInsets();
  const { selectedCategory, selectedSubcategory, answers, roadmapSteps, isOnboarded } = useApp();

  if (!isOnboarded) {
    return (
      <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="map" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Roadmap Yet</Text>
          <Text style={styles.emptySubtitle}>Answer a few questions to get your personalized roadmap</Text>
          <TouchableOpacity style={styles.startBtn} onPress={() => router.push('/categories')}>
            <Text style={styles.startBtnText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={18} color="#0A0E1A" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const estimatedTime = '3–6 Months';

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Your {selectedCategory}</Text>
          <Text style={styles.headerSubtitle}>({selectedSubcategory}) Roadmap</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => router.push('/categories')}>
          <Ionicons name="refresh" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tagRow}>
        <View style={[styles.tag, { backgroundColor: Colors.primaryBg }]}>
          <Ionicons name="school" size={12} color={Colors.primary} />
          <Text style={[styles.tagText, { color: Colors.primary }]}>{answers.experience || 'Beginner'}</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: Colors.accentBg }]}>
          <Ionicons name="flag" size={12} color={Colors.accent} />
          <Text style={[styles.tagText, { color: Colors.accent }]}>{answers.country || 'Pakistan'}</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: Colors.cyanBg }]}>
          <Ionicons name="wallet" size={12} color={Colors.cyan} />
          <Text style={[styles.tagText, { color: Colors.cyan }]}>{answers.budget || 'Low Budget'}</Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
        <Text style={styles.timeText}>Estimated Time: {estimatedTime}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {roadmapSteps.map((step, idx) => (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.stepLeft}>
              <View style={[styles.stepCircle, { backgroundColor: STATUS_BG[step.status], borderColor: STATUS_COLOR[step.status] }]}>
                {step.status === 'completed' ? (
                  <Ionicons name="checkmark" size={14} color={Colors.primary} />
                ) : step.status === 'active' ? (
                  <View style={[styles.activeDot, { backgroundColor: Colors.accent }]} />
                ) : (
                  <Text style={styles.stepNum}>{step.number}</Text>
                )}
              </View>
              {idx < roadmapSteps.length - 1 && (
                <View style={[styles.connector, { backgroundColor: idx === 0 ? Colors.primary : Colors.border }]} />
              )}
            </View>

            <View style={[styles.stepCard, step.status === 'active' && styles.stepCardActive]}>
              <View style={styles.stepCardHeader}>
                <View>
                  <Text style={[styles.stepLabel, { color: Colors.textMuted }]}>0{step.number}</Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.description}</Text>
                </View>
                <View style={[styles.durationBadge, { backgroundColor: step.status === 'upcoming' ? Colors.cardGlass : STATUS_BG[step.status] }]}>
                  <Text style={[styles.durationText, { color: STATUS_COLOR[step.status] }]}>{step.duration}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  headerSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 24, marginBottom: 10 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  timeText: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  scroll: { flex: 1, paddingHorizontal: 24 },
  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  stepLeft: { alignItems: 'center', width: 36 },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
  },
  activeDot: { width: 10, height: 10, borderRadius: 5 },
  stepNum: { fontSize: 13, fontFamily: 'Inter_700Bold', color: Colors.textMuted },
  connector: { width: 2, flex: 1, minHeight: 20, marginVertical: 4 },
  stepCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 12,
  },
  stepCardActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentBg,
  },
  stepCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  stepLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', marginBottom: 2 },
  stepTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 4 },
  stepDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 18 },
  durationBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, minWidth: 70, alignItems: 'center' },
  durationText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryBg,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 10 },
  emptySubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  startBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  startBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0A0E1A' },
});
