import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useSurveyRunnerViewModel } from '@/features/survey-runner/viewmodels/useSurveyRunnerViewModel';
import { useSurveyRunnerCoordinator } from '@/features/survey-runner/navigation/useSurveyRunnerCoordinator';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useSurveyListStore } from '@/features/surveys/store/surveyListStore';
import { GlassPrimaryButton } from '@/ui/components/GlassPrimaryButton';
import { spacing, typography, useTheme } from '@/ui/theme';

const { width } = Dimensions.get('window');

export default function RewardScreen() {
  const { colors } = useTheme();
  const vm = useSurveyRunnerViewModel();
  const coordinator = useSurveyRunnerCoordinator();
  const award = useAuthStore((s) => s.awardCents);
  const markCompleted = useSurveyListStore((s) => s.markCompleted);
  const [grantedCents] = useState<number>(vm.survey?.payoutCents ?? 0);
  const [grantedTitle] = useState<string>(vm.survey?.title ?? '');

  useEffect(() => {
    if (!vm.survey) return;
    const surveyId = vm.survey.id;
    const payout = vm.survey.payoutCents;
    award(payout);
    markCompleted(surveyId);
    vm.finish();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <View style={[styles.checkBubble, { backgroundColor: colors.success }]}>
          <Text style={styles.check}>✓</Text>
        </View>
        <Text style={[styles.title, { color: colors.textSecondary }]}>You earned</Text>
        <Text style={[styles.amount, { color: colors.text }]}>${(grantedCents / 100).toFixed(2)}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>
          for completing {grantedTitle}
        </Text>
      </View>

      <View style={styles.footer}>
        <GlassPrimaryButton title="Back to surveys" onPress={coordinator.exitToList} />
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
