import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const { width } = Dimensions.get('window');

function CircularProgress({ percent, size = 120 }: { percent: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - percent / 100);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 8,
            borderColor: Colors.card,
          }}
        />
      </View>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 8,
          borderColor: Colors.primary,
          position: 'absolute',
          borderTopColor: percent > 75 ? Colors.primary : Colors.card,
          borderRightColor: percent > 50 ? Colors.primary : Colors.card,
          borderBottomColor: percent > 25 ? Colors.primary : Colors.card,
          borderLeftColor: Colors.primary,
          transform: [{ rotate: `${(percent / 100) * 360 - 90}deg` }],
        }}
      />
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.text }}>{percent}%</Text>
        <Text style={{ fontSize: 10, fontFamily: 'Inter_400Regular', color: Colors.textSecondary }}>Complete</Text>
      </View>
    </View>
  );
}

function MiniBar({ label, value, max, color = Colors.primary }: { label: string; value: string | number; max?: number; color?: string }) {
  return (
    <View style={styles.miniBar}>
      <View style={styles.miniBarHeader}>
        <Text style={styles.miniBarLabel}>{label}</Text>
        <Text style={[styles.miniBarValue, { color }]}>{value}</Text>
      </View>
      {max != null && typeof value === 'number' && (
        <View style={styles.miniBarTrack}>
          <View style={[styles.miniBarFill, { width: `${(value / max) * 100}%`, backgroundColor: color }]} />
        </View>
      )}
    </View>
  );
}

const weekData = [18, 35, 52, 28, 65, 42, 38];
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const maxBar = Math.max(...weekData);
const BAR_MAX_H = 60;

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { roadmapProgress, tasksCompleted, totalTasks, userStreak, weeklyGoal } = useApp();

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress Overview</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>This Week</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.overallCard}>
          <Text style={styles.cardTitle}>Overall Progress</Text>
          <View style={styles.progressRow}>
            <CircularProgress percent={roadmapProgress} />
            <View style={styles.progressInfo}>
              <View style={[styles.motivationBadge]}>
                <Text style={styles.motivationText}>You're doing great!{'\n'}Keep it up</Text>
                <Ionicons name="trending-up" size={16} color={Colors.primary} />
              </View>
              <MiniBar label="Roadmap" value={roadmapProgress} max={100} color={Colors.primary} />
              <MiniBar label="Tasks Done" value={`${tasksCompleted}/${totalTasks}`} color={Colors.accent} />
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={22} color={Colors.orange} />
            <Text style={styles.statValue}>{userStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={22} color={Colors.primary} />
            <Text style={styles.statValue}>{weeklyGoal}%</Text>
            <Text style={styles.statLabel}>Weekly Goal</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={22} color={Colors.cyan} />
            <Text style={styles.statValue}>{tasksCompleted}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.cardTitle}>Skill Level</Text>
            <View style={[styles.levelBadge, { backgroundColor: Colors.accentBg }]}>
              <Text style={[styles.levelBadgeText, { color: Colors.accent }]}>Growing</Text>
            </View>
          </View>
          <View style={styles.levelBar}>
            <View style={styles.levelTrack}>
              <View style={[styles.levelFill, { width: `${roadmapProgress}%` }]} />
            </View>
          </View>
          <View style={styles.levelLabels}>
            <Text style={styles.levelLabel}>Beginner</Text>
            <Text style={[styles.levelLabel, { color: Colors.primary }]}>Intermediate</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Weekly Activity</Text>
          <View style={styles.barChart}>
            {weekData.map((val, i) => (
              <View key={i} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: (val / maxBar) * BAR_MAX_H,
                        backgroundColor: i === 5 ? Colors.primary : Colors.accent + '70',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{weekDays[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.evalCard}>
          <View style={styles.evalLeft}>
            <Ionicons name="star" size={22} color={Colors.orange} />
            <View>
              <Text style={styles.evalTitle}>Weekly Evaluation</Text>
              <Text style={styles.evalSub}>See your performance grade</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.evalBtn} onPress={() => router.push('/evaluation')}>
            <Text style={styles.evalBtnText}>View</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  overallCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 16 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  progressInfo: { flex: 1, gap: 12 },
  motivationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryBg,
    borderRadius: 10,
    padding: 10,
  },
  motivationText: { flex: 1, fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.primary, lineHeight: 17 },
  miniBar: { gap: 6 },
  miniBarHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  miniBarLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  miniBarValue: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  miniBarTrack: { height: 4, backgroundColor: Colors.cardGlass, borderRadius: 2 },
  miniBarFill: { height: '100%', borderRadius: 2 },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statValue: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, textAlign: 'center' },
  levelCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  levelBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  levelBadgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  levelBar: { marginBottom: 8 },
  levelTrack: { height: 8, backgroundColor: Colors.cardGlass, borderRadius: 4 },
  levelFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  levelLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  levelLabel: { fontSize: 11, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  chartCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80 },
  barCol: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: { flex: 1, width: 18, justifyContent: 'flex-end', backgroundColor: Colors.cardGlass, borderRadius: 4 },
  barFill: { width: '100%', borderRadius: 4 },
  barLabel: { fontSize: 10, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  evalCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  evalLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  evalTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  evalSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  evalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  evalBtnText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
});
