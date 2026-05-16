import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { resetApp, userName, selectedCategory } = useApp();

  const [notifications, setNotifications] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [taskAlerts, setTaskAlerts] = useState(false);

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete your roadmap, tasks, progress, and all saved data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetApp();
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileSub}>{selectedCategory} Learner</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.primaryBg }]}>
                <Ionicons name="notifications" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDesc}>Enable all notifications</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.cardGlass, true: Colors.primary + '60' }}
              thumbColor={notifications ? Colors.primary : Colors.textMuted}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.orangeBg }]}>
                <Ionicons name="flame" size={18} color={Colors.orange} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Streak Reminders</Text>
                <Text style={styles.settingDesc}>Daily reminder to keep streak</Text>
              </View>
            </View>
            <Switch
              value={streakReminders}
              onValueChange={setStreakReminders}
              trackColor={{ false: Colors.cardGlass, true: Colors.orange + '60' }}
              thumbColor={streakReminders ? Colors.orange : Colors.textMuted}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.accentBg }]}>
                <Ionicons name="bar-chart" size={18} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Weekly Report</Text>
                <Text style={styles.settingDesc}>Sunday summary of your week</Text>
              </View>
            </View>
            <Switch
              value={weeklyReport}
              onValueChange={setWeeklyReport}
              trackColor={{ false: Colors.cardGlass, true: Colors.accent + '60' }}
              thumbColor={weeklyReport ? Colors.accent : Colors.textMuted}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.cyanBg }]}>
                <Ionicons name="alarm" size={18} color={Colors.cyan} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Task Due Alerts</Text>
                <Text style={styles.settingDesc}>Alert when tasks are due today</Text>
              </View>
            </View>
            <Switch
              value={taskAlerts}
              onValueChange={setTaskAlerts}
              trackColor={{ false: Colors.cardGlass, true: Colors.cyan + '60' }}
              thumbColor={taskAlerts ? Colors.cyan : Colors.textMuted}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>App</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/profile')}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.primaryBg }]}>
                <Ionicons name="person" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.settingTitle}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/categories')}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.accentBg }]}>
                <Ionicons name="refresh" size={18} color={Colors.accent} />
              </View>
              <Text style={styles.settingTitle}>Change Learning Path</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.primaryBg }]}>
                <Ionicons name="information-circle" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.settingTitle}>App Version</Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.primaryBg }]}>
                <Ionicons name="sparkles" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.settingTitle}>AI Model</Text>
            </View>
            <Text style={styles.settingValue}>GPT-4o</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Danger Zone</Text>
        <View style={[styles.card, styles.dangerCard]}>
          <TouchableOpacity style={styles.settingRow} onPress={handleReset}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.redBg }]}>
                <Ionicons name="trash" size={18} color={Colors.red} />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: Colors.red }]}>Reset All Data</Text>
                <Text style={styles.settingDesc}>Delete everything and start over</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.red + '80'} />
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.text },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryBg,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.primary },
  profileName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.text },
  profileSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: 24,
    marginBottom: 8,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: Colors.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    overflow: 'hidden',
  },
  dangerCard: { borderColor: Colors.red + '30' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingTitle: { fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.text },
  settingDesc: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  settingValue: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 64 },
});
