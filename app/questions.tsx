import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const QUESTIONS = [
  {
    id: 'platform',
    label: 'Which platform do you want to work with?',
    options: [
      { label: 'Shopify', icon: 'storefront' },
      { label: 'Amazon FBA', icon: 'logo-amazon' },
      { label: 'Daraz', icon: 'bag' },
      { label: 'WooCommerce', icon: 'cart' },
      { label: 'Other', icon: 'ellipsis-horizontal' },
    ],
  },
  {
    id: 'country',
    label: 'Which country are you from?',
    options: [
      { label: 'Pakistan', icon: 'flag' },
      { label: 'India', icon: 'flag' },
      { label: 'USA', icon: 'flag' },
      { label: 'UK', icon: 'flag' },
      { label: 'Other', icon: 'ellipsis-horizontal' },
    ],
  },
  {
    id: 'budget',
    label: 'What is your starting budget?',
    options: [
      { label: 'Very Low (< $100)', icon: 'wallet' },
      { label: 'Low ($100–$500)', icon: 'wallet' },
      { label: 'Medium ($500–$2k)', icon: 'wallet' },
      { label: 'High ($2k+)', icon: 'wallet' },
    ],
  },
  {
    id: 'experience',
    label: 'What is your experience level?',
    options: [
      { label: 'Complete Beginner', icon: 'school' },
      { label: 'Some Knowledge', icon: 'book' },
      { label: 'Intermediate', icon: 'star-half' },
      { label: 'Advanced', icon: 'star' },
    ],
  },
  {
    id: 'hours',
    label: 'How many hours daily can you dedicate?',
    options: [
      { label: '1–2 Hours', icon: 'time' },
      { label: '3–4 Hours', icon: 'time' },
      { label: '5–6 Hours', icon: 'time' },
      { label: '8+ Hours (Full Time)', icon: 'time' },
    ],
  },
  {
    id: 'goal',
    label: 'What is your primary goal?',
    options: [
      { label: 'Fast Online Income', icon: 'flash' },
      { label: 'Long-term Business', icon: 'trending-up' },
      { label: 'Side Hustle', icon: 'briefcase' },
      { label: 'Full-time Career', icon: 'trophy' },
    ],
  },
];

const GENERATING_TIPS = [
  'Analyzing your experience level...',
  'Matching to your budget...',
  'Building your step-by-step roadmap...',
  'Creating personalized daily tasks...',
  'Almost ready...',
];

export default function QuestionsScreen() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const { setAnswers: saveAnswers, selectedCategory, selectedSubcategory, generateRoadmapWithAI } = useApp();

  const q = QUESTIONS[step];
  const selected = answers[q.id];

  const handleSelect = (opt: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: opt }));
  };

  const handleNext = async () => {
    if (!selected) return;
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const finalAnswers = {
        country: answers['country'] || 'Pakistan',
        budget: answers['budget'] || 'Low Budget',
        experience: answers['experience'] || 'Beginner',
        hours: answers['hours'] || '3-4 Hours',
        goal: answers['goal'] || 'Fast Income',
        market: 'Local',
        platform: answers['platform'] || selectedSubcategory,
      };
      saveAnswers(finalAnswers);
      setGenerating(true);

      const tipTimer = setInterval(() => {
        setTipIndex((i) => Math.min(i + 1, GENERATING_TIPS.length - 1));
      }, 1400);

      await generateRoadmapWithAI(finalAnswers, selectedCategory, selectedSubcategory);
      clearInterval(tipTimer);
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else router.back();
  };

  const progress = ((step + 1) / QUESTIONS.length) * 100;

  if (generating) {
    return (
      <View style={[styles.container, styles.generatingContainer, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
        <LinearGradient
          colors={['rgba(0,214,143,0.06)', 'transparent']}
          style={styles.generatingGradient}
        />

        <View style={styles.generatingContent}>
          <View style={styles.aiOrb}>
            <LinearGradient
              colors={[Colors.primary, Colors.accent]}
              style={styles.aiOrbInner}
            >
              <Ionicons name="flash" size={32} color="#0A0E1A" />
            </LinearGradient>
          </View>

          <Text style={styles.generatingTitle}>Building Your Roadmap</Text>
          <Text style={styles.generatingSubtitle}>
            AI is crafting a personalized plan just for you
          </Text>

          <View style={styles.tipBox}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.tipText}>{GENERATING_TIPS[tipIndex]}</Text>
          </View>

          <View style={styles.dotsRow}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === tipIndex % 3 ? Colors.primary : Colors.border },
                ]}
              />
            ))}
          </View>

          <View style={styles.featuresRow}>
            {['Roadmap Steps', 'Daily Tasks', 'AI Mentor'].map((f) => (
              <View key={f} style={styles.featureTag}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
                <Text style={styles.featureTagText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.stepText}>Step {step + 1} of {QUESTIONS.length}</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.caption}>Personalizing your AI roadmap</Text>
          <Text style={styles.question}>{q.label}</Text>
        </View>

        <View style={styles.options}>
          {q.options.map((opt) => {
            const isSelected = selected === opt.label;
            return (
              <TouchableOpacity
                key={opt.label}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => handleSelect(opt.label)}
                activeOpacity={0.8}
              >
                <View style={[styles.optionIcon, isSelected && styles.optionIconSelected]}>
                  <Ionicons name={opt.icon as any} size={20} color={isSelected ? '#0A0E1A' : Colors.textSecondary} />
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {opt.label}
                </Text>
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={14} color="#0A0E1A" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.nextBtn, !selected && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!selected}
          activeOpacity={0.85}
        >
          {step === QUESTIONS.length - 1 ? (
            <>
              <Ionicons name="flash" size={18} color="#0A0E1A" />
              <Text style={styles.nextText}>Generate My AI Roadmap</Text>
            </>
          ) : (
            <>
              <Text style={styles.nextText}>Next</Text>
              <Ionicons name="arrow-forward" size={18} color="#0A0E1A" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  generatingContainer: { alignItems: 'center', justifyContent: 'center' },
  generatingGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 300,
  },
  generatingContent: { alignItems: 'center', paddingHorizontal: 40, gap: 20 },
  aiOrb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryBg,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  aiOrbInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generatingTitle: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    textAlign: 'center',
  },
  generatingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  tipText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.primary,
  },
  dotsRow: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  featuresRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primaryBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featureTagText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.primary },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  stepText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  progressBar: {
    height: 3,
    backgroundColor: Colors.card,
    marginHorizontal: 24,
    borderRadius: 2,
    marginBottom: 32,
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 24 },
  titleSection: { gap: 8 },
  caption: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.primary, letterSpacing: 0.5 },
  question: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text, lineHeight: 30 },
  options: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 16,
  },
  optionSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryBg },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.cardGlass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconSelected: { backgroundColor: Colors.primary },
  optionText: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.text },
  optionTextSelected: { color: Colors.primary, fontFamily: 'Inter_600SemiBold' },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
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
  nextBtnDisabled: { backgroundColor: Colors.textMuted, opacity: 0.5 },
  nextText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0A0E1A' },
});
