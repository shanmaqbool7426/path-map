import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

interface MenuItem {
  icon: string;
  label: string;
  route?: string;
  color?: string;
  badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: 'person-circle', label: 'My Profile', route: '/profile' },
  { icon: 'map', label: 'My Roadmaps', route: '/categories', badge: '1' },
  { icon: 'analytics', label: 'Skill Analytics', route: '/analytics' },
  { icon: 'trophy', label: 'Achievements', route: '/achievements', badge: 'New' },
  { icon: 'star', label: 'Weekly Evaluation', route: '/evaluation' },
  { icon: 'bookmark', label: 'Saved Resources' },
  { icon: 'settings', label: 'Settings' },
  { icon: 'help-circle', label: 'Help & Support' },
  { icon: 'log-out', label: 'Logout', color: Colors.red },
];

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { userName, roadmapProgress, userStreak, selectedCategory } = useApp();

  const handleMenu = (item: MenuItem) => {
    if (item.route) router.push(item.route as any);
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileSub}>{selectedCategory} Learner</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/profile')}>
            <Ionicons name="pencil" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Ionicons name="flame" size={16} color={Colors.orange} />
            <Text style={styles.statValue}>{userStreak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Ionicons name="trending-up" size={16} color={Colors.primary} />
            <Text style={styles.statValue}>{roadmapProgress}%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Ionicons name="star" size={16} color={Colors.accent} />
            <Text style={styles.statValue}>B+</Text>
            <Text style={styles.statLabel}>Grade</Text>
          </View>
        </View>

        <View style={styles.premiumCard}>
          <View style={styles.premiumLeft}>
            <Ionicons name="diamond" size={22} color={Colors.orange} />
            <View>
              <Text style={styles.premiumTitle}>Premium Plan</Text>
              <Text style={styles.premiumSub}>Valid to 20 June 2025 · Active</Text>
            </View>
          </View>
          <View style={[styles.activeBadge]}>
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
              onPress={() => handleMenu(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: (item.color || Colors.primary) + '20' }]}>
                <Ionicons name={item.icon as any} size={18} color={item.color || Colors.primary} />
              </View>
              <Text style={[styles.menuLabel, item.color && { color: item.color }]}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                {item.route && !item.badge && (
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold', color: Colors.text },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Colors.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 24,
    padding: 16,
    marginBottom: 14,
    gap: 14,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primaryBg,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.primary },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontFamily: 'Inter_700Bold', color: Colors.text },
  profileSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primaryBg,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 24,
    marginBottom: 14,
    paddingVertical: 14,
  },
  statPill: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  statValue: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.text },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.orangeBg,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.orange + '30',
    marginHorizontal: 24,
    marginBottom: 14,
    padding: 16,
  },
  premiumLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  premiumTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.text },
  premiumSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  activeBadge: { backgroundColor: Colors.primaryBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  activeBadgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: Colors.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 24,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.text },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgePill: { backgroundColor: Colors.primaryBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
});
