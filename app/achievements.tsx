import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function AchievementsScreen() {
  const [tab, setTab] = useState(0);
  const insets = useSafeAreaInsets();
  const { userStreak, tasksCompleted, roadmapSteps, roadmapProgress, isOnboarded } = useApp();

  const completedSteps = roadmapSteps.filter((s) => s.status === 'completed').length;

  const BADGES = [
    {
      id: '1',
      title: 'First Step',
      subtitle: 'Onboarded',
      icon: 'flag',
      color: Colors.primary,
      unlocked: isOnboarded,
      requirement: 'Complete onboarding',
    },
    {
      id: '2',
      title: 'On Fire',
      subtitle: `${userStreak} Days`,
      icon: 'flame',
      color: Colors.orange,
      unlocked: userStreak >= 7,
      requirement: '7-day streak',
    },
    {
      id: '3',
      title: 'Task Master',
      subtitle: `${tasksCompleted} Done`,
      icon: 'checkmark-circle',
      color: Colors.cyan,
      unlocked: tasksCompleted >= 5,
      requirement: 'Complete 5 tasks',
    },
    {
      id: '4',
      title: 'Road Warrior',
      subtitle: `${completedSteps} Steps`,
      icon: 'map',
      color: Colors.accent,
      unlocked: completedSteps >= 1,
      requirement: 'Complete 1 roadmap step',
    },
    {
      id: '5',
      title: 'Halfway There',
      subtitle: `${roadmapProgress}%`,
      icon: 'trending-up',
      color: Colors.pink,
      unlocked: roadmapProgress >= 50,
      requirement: 'Reach 50% progress',
    },
    {
      id: '6',
      title: 'Dedicated',
      subtitle: '25 Days',
      icon: 'trophy',
      color: Colors.orange,
      unlocked: userStreak >= 25,
      requirement: '25-day streak',
    },
    {
      id: '7',
      title: 'Centurion',
      subtitle: '100 Tasks',
      icon: 'star',
      color: Colors.accent,
      unlocked: tasksCompleted >= 100,
      requirement: 'Complete 100 tasks',
    },
    {
      id: '8',
      title: 'Path Complete',
      subtitle: '100%',
      icon: 'ribbon',
      color: Colors.primary,
      unlocked: roadmapProgress >= 100,
      requirement: 'Complete the full roadmap',
    },
  ];

  const MILESTONES = [
    {
      title: 'Complete Onboarding',
      done: isOnboarded,
      detail: 'Set up your profile and goals',
    },
    {
      title: 'Generate Your First Roadmap',
      done: roadmapSteps.length > 0,
      detail: 'AI creates your personalized path',
    },
    {
      title: 'Complete First Task',
      done: tasksCompleted >= 1,
      detail: `${tasksCompleted} tasks done so far`,
    },
    {
      title: 'Complete 5 Tasks',
      done: tasksCompleted >= 5,
      detail: 'Building strong habits',
    },
    {
      title: 'Finish Foundation Step',
      done: completedSteps >= 1,
      detail: 'First roadmap step completed',
    },
    {
      title: 'Hit a 7-Day Streak',
      done: userStreak >= 7,
      detail: `Current streak: ${userStreak} days`,
    },
    {
      title: 'Reach 50% Progress',
      done: roadmapProgress >= 50,
      detail: `You're at ${roadmapProgress}%`,
    },
    {
      title: 'Complete the Roadmap',
      done: roadmapProgress >= 100,
      detail: 'The full journey complete',
    },
  ];

  const unlockedCount = BADGES.filter((b) => b.unlocked).length;
  const milestonesDone = MILESTONES.filter((m) => m.done).length;
  const newlyUnlocked = BADGES.filter((b) => b.unlocked).length > 0;

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{unlockedCount}/{BADGES.length}</Text>
        </View>
      </View>

      {newlyUnlocked && (
        <View style={styles.newBadgeBanner}>
          <Ionicons name="star" size={22} color={Colors.orange} />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>{unlockedCount} badge{unlockedCount !== 1 ? 's' : ''} unlocked!</Text>
            <Text style={styles.bannerSubtitle}>{milestonesDone}/{MILESTONES.length} milestones completed</Text>
          </View>
          <Ionicons name="trophy" size={26} color={Colors.primary} />
        </View>
      )}

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
                      <Ionicons name="lock-closed" size={12} color={Colors.textMuted} />
                    </View>
                  )}
                </View>
                <Text style={[styles.badgeTitle, !badge.unlocked && { color: Colors.textMuted }]}>
                  {badge.title}
                </Text>
                <Text style={[styles.badgeSub, !badge.unlocked && { color: Colors.textMuted }]}>
                  {badge.unlocked ? badge.subtitle : badge.requirement}
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
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.milestoneTitle, m.done && { color: Colors.primary }]}>{m.title}</Text>
                    <Text style={styles.milestoneDetail}>{m.detail}</Text>
                  </View>
                  <View style={[styles.milestoneBadge, { backgroundColor: m.done ? Colors.primaryBg : Colors.cardGlass }]}>
                    <Ionicons name={m.done ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={m.done ? Colors.primary : Colors.textMuted} />
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
  countBadge: { backgroundColor: Colors.primaryBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  countText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: Colors.primary },
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
  badgeCardLocked: { opacity: 0.45 },
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
  badgeSub: { fontSize: 9, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, textAlign: 'center' },
  milestoneList: { gap: 0 },
  milestoneRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  milestoneLeft: { alignItems: 'center', paddingTop: 14 },
  milestoneDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  milestoneConnector: { width: 2, height: 44, marginTop: 4 },
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
    gap: 10,
  },
  milestoneCardDone: { borderColor: Colors.primary + '40', backgroundColor: Colors.primaryBg },
  milestoneTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.text, marginBottom: 2 },
  milestoneDetail: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  milestoneBadge: { padding: 6, borderRadius: 8 },
});
