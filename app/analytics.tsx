import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

const SKILLS = [
  { label: 'Store Setup', value: 75, color: Colors.primary },
  { label: 'Marketing', value: 60, color: Colors.accent },
  { label: 'Branding', value: 50, color: Colors.pink },
  { label: 'Product Research', value: 80, color: Colors.cyan },
  { label: 'Sales', value: 45, color: Colors.orange },
  { label: 'Mindset', value: 55, color: '#10B981' },
];

const WEEKLY_DATA = [30, 45, 62, 38, 55, 72, 50];
const DAYS = ['28 Apr', '5 May', '12 May', '19 May', '26 May'];
const BAR_MAX = Math.max(...WEEKLY_DATA);

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Skill Analytics</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>This Month</Text>
          <Ionicons name="chevron-down" size={12} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Skills Overview</Text>
          <View style={styles.skillBars}>
            {SKILLS.map((skill) => (
              <View key={skill.label} style={styles.skillRow}>
                <View style={styles.skillLabelRow}>
                  <Text style={styles.skillLabel}>{skill.label}</Text>
                  <Text style={[styles.skillValue, { color: skill.color }]}>{skill.value}%</Text>
                </View>
                <View style={styles.skillTrack}>
                  <View style={[styles.skillFill, { width: `${skill.value}%`, backgroundColor: skill.color }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <View style={[styles.timeIcon, { backgroundColor: Colors.accentBg }]}>
              <Ionicons name="time" size={20} color={Colors.accent} />
            </View>
            <View>
              <Text style={styles.timeTitle}>Learning Time</Text>
              <Text style={styles.timeValue}>32h 45m</Text>
            </View>
            <View style={[styles.trendBadge, { backgroundColor: Colors.primaryBg }]}>
              <Ionicons name="trending-up" size={12} color={Colors.primary} />
              <Text style={styles.trendText}>+12%</Text>
            </View>
          </View>
          <Text style={styles.timeCompare}>vs last month</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Weekly Learning (hours)</Text>
          <View style={styles.barChart}>
            {WEEKLY_DATA.map((val, i) => (
              <View key={i} style={styles.barCol}>
                <Text style={[styles.barValue, { color: val === BAR_MAX ? Colors.primary : Colors.textMuted }]}>
                  {val}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${(val / BAR_MAX) * 100}%`,
                        backgroundColor: val === BAR_MAX ? Colors.primary : Colors.accent + '60',
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.topSkillCard}>
          <Text style={styles.sectionTitle}>Top Skills</Text>
          {SKILLS.slice(0, 3).map((s, i) => (
            <View key={s.label} style={styles.topSkillRow}>
              <View style={[styles.topSkillRank, { backgroundColor: s.color + '20' }]}>
                <Text style={[styles.topSkillRankText, { color: s.color }]}>#{i + 1}</Text>
              </View>
              <Text style={styles.topSkillLabel}>{s.label}</Text>
              <View style={[styles.topSkillBadge, { backgroundColor: s.color + '20' }]}>
                <Text style={[styles.topSkillPct, { color: s.color }]}>{s.value}%</Text>
              </View>
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
  sectionCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 18 },
  skillBars: { gap: 14 },
  skillRow: { gap: 8 },
  skillLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  skillLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.text },
  skillValue: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  skillTrack: { height: 6, backgroundColor: Colors.cardGlass, borderRadius: 3 },
  skillFill: { height: '100%', borderRadius: 3 },
  timeCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
    gap: 4,
  },
  timeHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  timeIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  timeTitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  timeValue: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.text },
  trendBadge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: Colors.primary },
  timeCompare: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginLeft: 58 },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  barCol: { flex: 1, alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' },
  barValue: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  barTrack: {
    width: 28,
    backgroundColor: Colors.cardGlass,
    borderRadius: 6,
    overflow: 'hidden',
    height: 80,
    justifyContent: 'flex-end',
  },
  barFill: { width: '100%', borderRadius: 6 },
  topSkillCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 14,
  },
  topSkillRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  topSkillRank: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  topSkillRankText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  topSkillLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.text },
  topSkillBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  topSkillPct: { fontSize: 13, fontFamily: 'Inter_700Bold' },
});
