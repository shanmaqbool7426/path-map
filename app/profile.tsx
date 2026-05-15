import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const MENU = [
  { icon: 'map', label: 'My Roadmaps', value: '1 Active' },
  { icon: 'bookmark', label: 'Saved Resources', value: '12 Items' },
  { icon: 'document-text', label: 'Notes', value: '5 Notes' },
  { icon: 'settings', label: 'Settings', value: null },
  { icon: 'help-circle', label: 'Help & Support', value: null },
  { icon: 'log-out', label: 'Logout', value: null, danger: true },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userName, selectedCategory, userStreak, roadmapProgress, resetApp } = useApp();

  const handleLogout = () => {
    resetApp();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileMotto}>Dream Big, Achieve Bigger</Text>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Ionicons name="pencil" size={14} color={Colors.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.planCard}>
          <View style={styles.planLeft}>
            <Ionicons name="diamond" size={20} color={Colors.orange} />
            <View>
              <Text style={styles.planTitle}>Your Plan</Text>
              <Text style={styles.planName}>Premium</Text>
            </View>
          </View>
          <View>
            <View style={[styles.activeBadge]}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
            <Text style={styles.planExpiry}>Valid to 20 June 2025</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{roadmapProgress}%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{userStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>B+</Text>
            <Text style={styles.statLabel}>Grade</Text>
          </View>
        </View>

        <View style={styles.currentPath}>
          <Text style={styles.currentPathLabel}>Current Path</Text>
          <View style={styles.currentPathCard}>
            <View style={styles.currentPathIcon}>
              <Ionicons name="map" size={20} color={Colors.primary} />
            </View>
            <View style={styles.currentPathInfo}>
              <Text style={styles.currentPathTitle}>{selectedCategory}</Text>
              <Text style={styles.currentPathSub}>{roadmapProgress}% complete</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </View>
        </View>

        <View style={styles.menuCard}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < MENU.length - 1 && styles.menuItemBorder]}
              onPress={item.label === 'Logout' ? handleLogout : undefined}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.danger ? Colors.redBg : Colors.primaryBg }]}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={item.danger ? Colors.red : Colors.primary}
                />
              </View>
              <Text style={[styles.menuLabel, item.danger && { color: Colors.red }]}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.value && (
                  <Text style={styles.menuValue}>{item.value}</Text>
                )}
                {!item.danger && <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />}
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
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    alignItems: 'center',
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    marginBottom: 14,
    gap: 6,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryBg,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: { fontSize: 34, fontFamily: 'Inter_700Bold', color: Colors.primary },
  profileName: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  profileMotto: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: Colors.primaryBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  editProfileText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 14,
  },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planTitle: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  planName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.text },
  activeBadge: { backgroundColor: Colors.primaryBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-end', marginBottom: 4 },
  activeBadgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  planExpiry: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 14,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statNum: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  divider: { width: 1, backgroundColor: Colors.border },
  currentPath: { marginHorizontal: 24, marginBottom: 14 },
  currentPathLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary, marginBottom: 8 },
  currentPathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  currentPathIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primaryBg, alignItems: 'center', justifyContent: 'center' },
  currentPathInfo: { flex: 1 },
  currentPathTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  currentPathSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  menuCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.text },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuValue: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
});
