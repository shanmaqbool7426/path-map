import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'sparkles',
    title: 'AI Guidance.\nReal Steps.\nBetter Future.',
    subtitle: 'Personalized roadmaps, daily tasks and smart insights to help you learn, earn and grow.',
    accent: Colors.primary,
  },
  {
    icon: 'map',
    title: 'Your Personal\nRoadmap &\nAction Plan.',
    subtitle: 'From beginner to expert with step-by-step guidance customized to your goals and budget.',
    accent: Colors.accent,
  },
  {
    icon: 'trophy',
    title: 'Track Progress\n& Achieve\nYour Goals.',
    subtitle: 'Daily tasks, weekly evaluations, and AI mentor to keep you on track and motivated.',
    accent: Colors.cyan,
  },
];

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const insets = useSafeAreaInsets();
  const slide = slides[page];

  const handleNext = () => {
    if (page < slides.length - 1) {
      setPage(page + 1);
    } else {
      router.replace('/categories');
    }
  };

  const handleSkip = () => router.replace('/categories');

  return (
    <LinearGradient colors={['#0A0E1A', '#0D1528', '#0A0E1A']} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View />
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.illustrationArea}>
        <View style={[styles.illustrationCircle, { borderColor: slide.accent + '40' }]}>
          <View style={[styles.innerCircle, { backgroundColor: slide.accent + '20' }]}>
            <Ionicons name={slide.icon as any} size={60} color={slide.accent} />
          </View>
        </View>
        <View style={[styles.floatingCard1, { backgroundColor: slide.accent + '20', borderColor: slide.accent + '30' }]}>
          <MaterialCommunityIcons name="check-circle" size={16} color={slide.accent} />
          <Text style={[styles.floatingText, { color: slide.accent }]}>Personalized</Text>
        </View>
        <View style={[styles.floatingCard2, { backgroundColor: Colors.accentBg, borderColor: Colors.accent + '30' }]}>
          <MaterialCommunityIcons name="chart-line" size={16} color={Colors.accent} />
          <Text style={[styles.floatingText, { color: Colors.accent }]}>Growing</Text>
        </View>
        <View style={[styles.floatingCard3, { backgroundColor: Colors.cyanBg, borderColor: Colors.cyan + '30' }]}>
          <MaterialCommunityIcons name="lightning-bolt" size={16} color={Colors.cyan} />
          <Text style={[styles.floatingText, { color: Colors.cyan }]}>Fast Results</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
          <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.nextGradient}>
            <Text style={styles.nextText}>{page === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
            <Ionicons name="arrow-forward" size={18} color="#0A0E1A" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  skipText: { fontSize: 15, color: Colors.textSecondary, fontFamily: 'Inter_500Medium' },
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCard1: {
    position: 'absolute',
    top: '15%',
    left: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  floatingCard2: {
    position: 'absolute',
    top: '10%',
    right: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  floatingCard3: {
    position: 'absolute',
    bottom: '15%',
    right: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  floatingText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  content: { paddingHorizontal: 28, paddingBottom: 24 },
  title: {
    fontSize: 34,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    lineHeight: 42,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.textMuted },
  dotActive: { width: 20, backgroundColor: Colors.primary, borderRadius: 3 },
  nextButton: { borderRadius: 28, overflow: 'hidden' },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  nextText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0A0E1A' },
});
