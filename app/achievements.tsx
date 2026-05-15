import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

const BADGES = [
  { id: '1', title: 'First Step', subtitle: 'Completed', icon: 'flag', color: Colors.primary, unlocked: true },
  { id: '2', title: 'Consistent', subtitle: '12 Days', icon: 'flame', color: Colors.orange, unlocked: true },
  { id: '3', title: 'Task Master', subtitle: '50 Tasks', icon: 'checkmark-circle', color: Colors.cyan, unlocked: true },
  { id: '4', title: 'Quick Learner', subtitle: '10 Lessons', icon: 'flash', color: Colors.accent, unlocked: true },
  { id: '5', title: 'Rising Star', subtitle: 'Level 2', icon: 'star', color: Colors.orange, unlocked: false },
  { id: '6', title: 'Dedicated', subtitle: '25 Days', icon: 'trophy', color: Colors.pink, unlocked: false },
];

const MILESTONES = [
  { title: 'Complete Onboarding', done: true, date: 'May 1' },
  { title: 'Finish Foundation Module', done: true, date: 'May 5' },
  { title: 'Set Up Your First Store', done: true, date: 'May 10' },
  { title: 'Complete Product Research', done: false, date: 'May 20' },
  { title: 'Make First Sale', done: false, date: 'Jun 1' },
  { title: 'Reach $1,000 Revenue', done: false, date: 'Jul 1' },
];

export default function AchievementsScreen() {
  const [tab, setTab] = useState(0);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.newBadgeBanner}>
        <Ionicons name="star" size={24} color={Colors.orange} />
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>You unlocked a new badge!</Text>
          <Text style={styles.bannerSubtitle}>Keep pushing your limits.</Text>
        </View>
        <Ionicons name="trophy" size={28} color={Colors.primary} />
      </View>

      <View style={styles.tabs}>
        {['Badges', 'Milestones'].map((t, i) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === i && styles.tabActive]}
            onPress={() => setTab(i)}
          >
            <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {tab === 0 ? (
          <View style={styles.badgesGrid}>
            {BADGES.map((badge) => (
              <View
                key={badge.id}
                style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}
              >
                <View style={[styles.badgeIcon, { backgroundColor: badge.color + '20', borderColor: badge.color + (badge.unlocked ? '60' : '20') }]}>
                  <Ionicons
                    name={badge.icon as any}
                    size={28}
                    color={badge.unlocked ? badge.color : Colors.textMuted}
                  />
                  {!badge.unlocked && (
                    <View style={styles.lockOverlay}>
                      <Ionicons name="lock-closed" size={16} color={Colors.textMuted} />
                    </View>
                  )}
                </View>
                <Text style={[styles.badgeTitle, !badge.unlocked && { color: Colors.textMuted }]}>
                  {badge.title}
                </Text>
                <Text style={[styles.badgeSub, !badge.unlocked && { color: Colors.textMuted }]}>
                  {badge.subtitle}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.milestoneList}>
            {MILESTONES.map((m, i) => (
              <View key={i} style={styles.milestoneRow}>
                <View style={styles.milestoneLeft}>
                  <View style={[styles.milestoneDot, { backgroundColor: m.done ? Colors.primary : Colors.card, borderColor: m.done ? Colors.primary : Colors.border }]}>
                    {m.done && <Ionicons name="checkmark" size={12} color="#0A0E1A" />}
                  </View>
                  {i < MILESTONES.length - 1 && (
                    <View style={[styles.milestoneConnector, { backgroundColor: m.done ? Colors.primary : Colors.border }]} />
                  )}
                </View>
                <View style={[styles.milestoneCard, m.done && styles.milestoneCardDone]}>
                  <Text style={[styles.milestoneTitle, m.done && { color: Colors.primary }]}>{m.title}</Text>
                  <View style={[styles.milestoneBadge, { backgroundColor: m.done ? Colors.primaryBg : Colors.cardGlass }]}>
                    <Text style={[styles.milestoneDate, { color: m.done ? Colors.primary : Colors.textMuted }]}>{m.date}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
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
    paddingBottom: 16,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.text },
  newBadgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: Colors.orangeBg,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.orange + '30',
    padding: 14,
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.text },
  bannerSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 24,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: Colors.primaryBg },
  tabText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeCard: {
    width: '31%',
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  badgeCardLocked: { opacity: 0.5 },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeTitle: { fontSize: 12, fontFamily: 'Inter_700Bold', color: Colors.text, textAlign: 'center' },
  badgeSub: { fontSize: 10, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  milestoneList: { gap: 0 },
  milestoneRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  milestoneLeft: { alignItems: 'center', paddingTop: 14 },
  milestoneDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  milestoneConnector: { width: 2, height: 40, marginTop: 4 },
  milestoneCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
  },
  milestoneCardDone: { borderColor: Colors.primary + '40', backgroundColor: Colors.primaryBg },
  milestoneTitle: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.text, flex: 1, marginRight: 8 },
  milestoneBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  milestoneDate: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
});

