import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal, TextInput, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const MENU = [
  { icon: 'map', label: 'My Roadmaps', value: '1 Active', route: '/' },
  { icon: 'analytics', label: 'Skill Analytics', value: null, route: '/analytics' },
  { icon: 'trophy', label: 'Achievements', value: null, route: '/achievements' },
  { icon: 'settings', label: 'Settings', value: null, route: '/settings' },
  { icon: 'log-out', label: 'Logout', value: null, danger: true },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userName, selectedCategory, userStreak, roadmapProgress, weeklyEvaluation, resetApp, setUserName } = useApp();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(userName);

  const grade = weeklyEvaluation?.grade || '—';

  const handleLogout = () => {
    resetApp();
    router.replace('/');
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      setUserName(editName.trim());
    }
    setShowEditModal(false);
  };

  const handleMenuPress = (item: typeof MENU[0]) => {
    if (item.label === 'Logout') {
      handleLogout();
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileMotto}>{selectedCategory} Learner</Text>
          <TouchableOpacity style={styles.editProfileBtn} onPress={() => { setEditName(userName); setShowEditModal(true); }}>
            <Ionicons name="pencil" size={14} color={Colors.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
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
            <Text style={[styles.statNum, { color: Colors.accent }]}>{grade}</Text>
            <Text style={styles.statLabel}>Grade</Text>
          </View>
        </View>

        <View style={styles.currentPath}>
          <Text style={styles.currentPathLabel}>Current Path</Text>
          <TouchableOpacity style={styles.currentPathCard} onPress={() => router.push('/')}>
            <View style={styles.currentPathIcon}>
              <Ionicons name="map" size={20} color={Colors.primary} />
            </View>
            <View style={styles.currentPathInfo}>
              <Text style={styles.currentPathTitle}>{selectedCategory}</Text>
              <Text style={styles.currentPathSub}>{roadmapProgress}% complete</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuCard}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < MENU.length - 1 && styles.menuItemBorder]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: (item as any).danger ? Colors.redBg : Colors.primaryBg }]}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={(item as any).danger ? Colors.red : Colors.primary}
                />
              </View>
              <Text style={[styles.menuLabel, (item as any).danger && { color: Colors.red }]}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.value && (
                  <Text style={styles.menuValue}>{item.value}</Text>
                )}
                {!(item as any).danger && <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={() => setShowEditModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowEditModal(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Text style={styles.modalLabel}>Your Name</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textMuted}
              selectionColor={Colors.primary}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, !editName.trim() && styles.modalSaveBtnDisabled]}
                onPress={handleSaveName}
                disabled={!editName.trim()}
              >
                <Text style={[styles.modalSaveText, !editName.trim() && { color: Colors.textMuted }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 20 },
  modalLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
    marginBottom: 20,
  },
  modalBtns: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSaveBtnDisabled: { backgroundColor: Colors.card },
  modalSaveText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#0A0E1A' },
});
