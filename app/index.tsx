import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Colors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { isOnboarded } = useApp();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOnboarded) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [isOnboarded]);

  return (
    <LinearGradient
      colors={['#0A0E1A', '#0D1528', '#0A0E1A']}
      style={styles.container}
    >
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="map-marker-path" size={40} color={Colors.primary} />
          </View>
          <View style={styles.logoGlow} />
        </View>

        <Text style={styles.appName}>PathPilot AI</Text>
        <Text style={styles.tagline}>Your AI Career & Business{'\n'}Roadmap Guide</Text>

        <View style={styles.featuresRow}>
          {['AI Mentor', 'Roadmaps', 'Daily Tasks'].map((f, i) => (
            <View key={i} style={styles.featurePill}>
              <Ionicons
                name={i === 0 ? 'sparkles' : i === 1 ? 'map' : 'checkmark-circle'}
                size={12}
                color={Colors.primary}
              />
              <Text style={styles.featurePillText}>{f}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.roadIllustration}>
          <View style={styles.roadPath} />
          <View style={styles.roadDot1} />
          <View style={styles.roadDot2} />
          <View style={styles.roadDot3} />
          <MaterialCommunityIcons name="home-city" size={32} color={Colors.textMuted} style={styles.buildingIcon} />
          <MaterialCommunityIcons name="flag-checkered" size={28} color={Colors.primary} style={styles.flagIcon} />
        </View>
        <Text style={styles.buildingText}>Building your future...</Text>
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 24, position: 'relative' },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primaryBg,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryGlow,
    zIndex: -1,
  },
  appName: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresRow: { flexDirection: 'row', gap: 8 },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryBg,
    borderWidth: 1,
    borderColor: 'rgba(0,214,143,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  featurePillText: { fontSize: 11, color: Colors.primary, fontFamily: 'Inter_500Medium' },
  bottomSection: { alignItems: 'center', paddingHorizontal: 24 },
  roadIllustration: {
    width: width - 80,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roadPath: {
    position: 'absolute',
    width: '80%',
    height: 3,
    backgroundColor: Colors.primary,
    opacity: 0.4,
    borderRadius: 2,
  },
  roadDot1: {
    position: 'absolute',
    left: '15%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    opacity: 0.6,
  },
  roadDot2: {
    position: 'absolute',
    left: '48%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    opacity: 0.8,
  },
  roadDot3: {
    position: 'absolute',
    right: '12%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    opacity: 0.6,
  },
  buildingIcon: { position: 'absolute', left: '5%', bottom: 20 },
  flagIcon: { position: 'absolute', right: '5%', bottom: 20 },
  buildingText: { fontSize: 13, color: Colors.textMuted, fontFamily: 'Inter_400Regular', marginBottom: 16 },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.textMuted },
  dotActive: { backgroundColor: Colors.primary, width: 18 },
});
