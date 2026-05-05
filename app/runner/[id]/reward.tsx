import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useSurveyRunnerStore } from '@/features/survey-runner/store/surveyRunnerStore';
import { claimSurveyReward, type RewardSnapshot } from '@/features/survey-runner/actions/runnerActions';
import { GlassPrimaryButton } from '@/ui/components/GlassPrimaryButton';
import { formatCents } from '@/core/utils/currency';
import { spacing, typography, useTheme } from '@/ui/theme';

const { width } = Dimensions.get('window');

export default function RewardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const survey = useSurveyRunnerStore((s) => s.survey);
  const claimedRef = useRef(false);
  const [snapshot, setSnapshot] = useState<RewardSnapshot | null>(() =>
    survey ? { title: survey.title, payoutCents: survey.payoutCents } : null
  );

  useEffect(() => {
    if (claimedRef.current) return;
    claimedRef.current = true;
    const claimed = claimSurveyReward();
    if (claimed) setSnapshot(claimed);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <View style={[styles.checkBubble, { backgroundColor: colors.success }]}>
          <Text style={styles.check}>✓</Text>
        </View>
        <Text style={[styles.title, { color: colors.textSecondary }]}>You earned</Text>
        <Text style={[styles.amount, { color: colors.text }]}>
          {formatCents(snapshot?.payoutCents ?? 0)}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>
          for completing {snapshot?.title ?? ''}
        </Text>
      </View>

      <View style={styles.footer}>
        <GlassPrimaryButton title="Back to surveys" onPress={() => router.replace('/(main)/surveys')} />
      </View>

      <ConfettiCannon
        count={140}
        origin={{ x: width / 2, y: 0 }}
        autoStart
        fadeOut
        explosionSpeed={350}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  checkBubble: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  check: { color: '#fff', fontSize: 56, fontWeight: '700' },
  title: { ...typography.title3 },
  amount: { fontSize: 64, fontWeight: '800' as const, fontVariant: ['tabular-nums'] },
  subtitle: { ...typography.body, textAlign: 'center', paddingHorizontal: spacing.xl },
  footer: { padding: spacing.xl },
});
