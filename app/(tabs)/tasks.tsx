import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal, TextInput, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp, Task } from '@/context/AppContext';

const TYPE_COLORS: Record<Task['type'], { color: string; bg: string }> = {
  Video: { color: Colors.red, bg: Colors.redBg },
  Research: { color: Colors.cyan, bg: Colors.cyanBg },
  Action: { color: Colors.primary, bg: Colors.primaryBg },
  Networking: { color: Colors.accent, bg: Colors.accentBg },
  Practice: { color: Colors.orange, bg: Colors.orangeBg },
};

const TASK_TYPES: Task['type'][] = ['Action', 'Video', 'Research', 'Networking', 'Practice'];
const TABS = ['To Do', 'In Progress', 'Done'];

export default function TasksScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Task['type']>('Action');
  const insets = useSafeAreaInsets();
  const { tasks, completeTask, startTask, addTask, userName } = useApp();

  const todayTasks = tasks.filter((t) =>
    activeTab === 0 ? t.status === 'todo'
    : activeTab === 1 ? t.status === 'inprogress'
    : t.status === 'done'
  );

  const counts = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    inprogress: tasks.filter((t) => t.status === 'inprogress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  const handleComplete = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    completeTask(id);
  };

  const handleStart = (id: string) => {
    Haptics.selectionAsync();
    startTask(id);
  };

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    Haptics.selectionAsync();
    addTask(newTitle.trim(), newType);
    setNewTitle('');
    setNewType('Action');
    setShowModal(false);
  };

  const openModal = () => {
    Haptics.selectionAsync();
    setShowModal(true);
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            <Ionicons name="sunny" size={18} color={Colors.orange} /> Good Morning, {userName.split(' ')[0]}
          </Text>
          <Text style={styles.subtext}>Let's complete your tasks for today.</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openModal}>
          <Ionicons name="add" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab, i) => {
          const count = i === 0 ? counts.todo : i === 1 ? counts.inprogress : counts.done;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === i && styles.tabActive]}
              onPress={() => setActiveTab(i)}
            >
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                {tab}
              </Text>
              <View style={[styles.tabBadge, activeTab === i && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === i && styles.tabBadgeTextActive]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {todayTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name={activeTab === 2 ? 'checkmark-circle' : 'clipboard-outline'}
              size={48}
              color={activeTab === 2 ? Colors.primary : Colors.textMuted}
            />
            <Text style={styles.emptyText}>
              {activeTab === 2 ? 'No completed tasks yet' : 'No tasks here'}
            </Text>
            {activeTab === 0 && (
              <TouchableOpacity style={styles.emptyAddBtn} onPress={openModal}>
                <Ionicons name="add" size={16} color={Colors.primary} />
                <Text style={styles.emptyAddText}>Add a task</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          todayTasks.map((task) => {
            const typeStyle = TYPE_COLORS[task.type];
            return (
              <View key={task.id} style={[styles.taskCard, task.status === 'done' && styles.taskCardDone]}>
                <TouchableOpacity
                  style={[styles.checkbox, task.status === 'done' && styles.checkboxDone]}
                  onPress={() => task.status !== 'done' && handleComplete(task.id)}
                >
                  {task.status === 'done' && <Ionicons name="checkmark" size={14} color="#0A0E1A" />}
                </TouchableOpacity>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, task.status === 'done' && styles.taskTitleDone]}>
                    {task.title}
                  </Text>
                  <View style={styles.taskMeta}>
                    <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg }]}>
                      <Text style={[styles.typeText, { color: typeStyle.color }]}>{task.type}</Text>
                    </View>
                    {task.status === 'todo' && (
                      <TouchableOpacity style={styles.startBadge} onPress={() => handleStart(task.id)}>
                        <Text style={styles.startBadgeText}>Start</Text>
                      </TouchableOpacity>
                    )}
                    {task.dueDate && (
                      <Text style={styles.dueDateText}>{task.dueDate}</Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add New Task</Text>

            <Text style={styles.modalLabel}>Task Title</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="What do you need to do?"
              placeholderTextColor={Colors.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
              selectionColor={Colors.primary}
              autoFocus
              multiline
            />

            <Text style={styles.modalLabel}>Task Type</Text>
            <View style={styles.typeGrid}>
              {TASK_TYPES.map((t) => {
                const ts = TYPE_COLORS[t];
                const selected = newType === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeChip, selected && { backgroundColor: ts.bg, borderColor: ts.color }]}
                    onPress={() => setNewType(t)}
                  >
                    <Text style={[styles.typeChipText, { color: selected ? ts.color : Colors.textSecondary }]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.modalSaveBtn, !newTitle.trim() && styles.modalSaveBtnDisabled]}
              onPress={handleAddTask}
              disabled={!newTitle.trim()}
            >
              <Ionicons name="checkmark-circle" size={18} color={newTitle.trim() ? '#0A0E1A' : Colors.textMuted} />
              <Text style={[styles.modalSaveText, !newTitle.trim() && { color: Colors.textMuted }]}>Add Task</Text>
            </TouchableOpacity>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 4 },
  subtext: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryBg,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 16, gap: 8 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.primaryBg, borderColor: Colors.primary },
  tabText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontFamily: 'Inter_600SemiBold' },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.cardGlass,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeActive: { backgroundColor: Colors.primary },
  tabBadgeText: { fontSize: 10, fontFamily: 'Inter_700Bold', color: Colors.textSecondary },
  tabBadgeTextActive: { color: '#0A0E1A' },
  scroll: { flex: 1, paddingHorizontal: 24 },
  emptyState: { paddingTop: 60, alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 14, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },
  emptyAddText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
  },
  taskCardDone: { opacity: 0.6 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  taskContent: { flex: 1, gap: 8 },
  taskTitle: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.text, lineHeight: 20 },
  taskTitleDone: { color: Colors.textMuted, textDecorationLine: 'line-through' },
  taskMeta: { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  typeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  startBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: Colors.accentBg,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  startBadgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: Colors.accent },
  dueDateText: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
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
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
    marginBottom: 20,
    minHeight: 60,
  },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  typeChipText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  modalSaveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalSaveBtnDisabled: { backgroundColor: Colors.card },
  modalSaveText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0A0E1A' },
});
