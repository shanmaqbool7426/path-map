import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const CATEGORIES = [
  { id: '1', name: 'Ecommerce', icon: 'cart', iconSet: 'Ionicons', color: Colors.primary, bg: Colors.primaryBg },
  { id: '2', name: 'Digital Marketing', icon: 'megaphone', iconSet: 'Ionicons', color: Colors.accent, bg: Colors.accentBg },
  { id: '3', name: 'Web Development', icon: 'code-slash', iconSet: 'Ionicons', color: Colors.cyan, bg: Colors.cyanBg },
  { id: '4', name: 'Freelancing', icon: 'briefcase', iconSet: 'Ionicons', color: Colors.orange, bg: Colors.orangeBg },
  { id: '5', name: 'Trading', icon: 'trending-up', iconSet: 'Ionicons', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  { id: '6', name: 'Graphic Design', icon: 'color-palette', iconSet: 'Ionicons', color: Colors.pink, bg: Colors.pinkBg },
  { id: '7', name: 'AI & Automation', icon: 'hardware-chip', iconSet: 'Ionicons', color: Colors.cyan, bg: Colors.cyanBg },
  { id: '8', name: 'YouTube / Content', icon: 'videocam', iconSet: 'Ionicons', color: Colors.red, bg: Colors.redBg },
  { id: '9', name: 'App Development', icon: 'phone-portrait', iconSet: 'Ionicons', color: Colors.accent, bg: Colors.accentBg },
  { id: '10', name: 'SEO', icon: 'search', iconSet: 'Ionicons', color: Colors.orange, bg: Colors.orangeBg },
  { id: '11', name: 'Copywriting', icon: 'create', iconSet: 'Ionicons', color: Colors.primary, bg: Colors.primaryBg },
  { id: '12', name: 'Crypto / Web3', icon: 'logo-bitcoin', iconSet: 'Ionicons', color: Colors.orange, bg: Colors.orangeBg },
  { id: '13', name: 'Video Editing', icon: 'film', iconSet: 'Ionicons', color: Colors.pink, bg: Colors.pinkBg },
  { id: '14', name: 'UI/UX Design', icon: 'layers', iconSet: 'Ionicons', color: Colors.accent, bg: Colors.accentBg },
  { id: '15', name: 'Affiliate Marketing', icon: 'git-branch', iconSet: 'Ionicons', color: Colors.primary, bg: Colors.primaryBg },
  { id: '16', name: 'More Categories', icon: 'apps', iconSet: 'Ionicons', color: Colors.textSecondary, bg: Colors.cardGlass },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;

export default function CategoriesScreen() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { setCategory } = useApp();

  const filtered = CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (cat: typeof CATEGORIES[0]) => {
    setSelected(cat.id);
    setCategory(cat.name);
  };

  const handleNext = () => {
    if (selected) router.push('/questions');
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose a Category</Text>
        <Text style={styles.subtitle}>What do you want to learn or build?</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search skills or business..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          selectionColor={Colors.primary}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.card,
              { borderColor: selected === cat.id ? cat.color : Colors.border },
              selected === cat.id && { backgroundColor: cat.bg },
            ]}
            onPress={() => handleSelect(cat)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, { backgroundColor: cat.bg }]}>
              <Ionicons name={cat.icon as any} size={26} color={cat.color} />
            </View>
            <Text style={[styles.catName, selected === cat.id && { color: cat.color }]}>
              {cat.name}
            </Text>
            {selected === cat.id && (
              <View style={[styles.checkBadge, { backgroundColor: cat.color }]}>
                <Ionicons name="checkmark" size={12} color="#0A0E1A" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selected && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="arrow-forward" size={18} color="#0A0E1A" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.text },
  scroll: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.card,
    borderRadius: Colors.radius,
    borderWidth: 1.5,
    padding: 16,
    alignItems: 'flex-start',
    gap: 10,
    position: 'relative',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.text, lineHeight: 18 },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  nextText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0A0E1A' },
});
