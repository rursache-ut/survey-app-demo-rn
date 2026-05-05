import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useSurveyIntroViewModel } from '@/features/survey-runner/viewmodels/useSurveyIntroViewModel';
import { useSurveyRunnerCoordinator } from '@/features/survey-runner/navigation/useSurveyRunnerCoordinator';
import { NetworkImage } from '@/ui/components/NetworkImage';
import { GlassPrimaryButton } from '@/ui/components/GlassPrimaryButton';
import { formatCents } from '@/core/utils/currency';
import { radii, spacing, typography, useTheme, type ThemeColors } from '@/ui/theme';

export default function IntroScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const vm = useSurveyIntroViewModel(id);
  const coordinator = useSurveyRunnerCoordinator();

  if (vm.isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (vm.error || !vm.survey) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Survey unavailable</Text>
          <Text style={[styles.errorBody, { color: colors.textSecondary }]}>
            {vm.error ?? 'This survey could not be loaded.'}
          </Text>
        </View>
        <View style={styles.footer}>
          <GlassPrimaryButton title="Back to surveys" onPress={coordinator.exitToList} />
        </View>
      </SafeAreaView>
    );
  }

  const survey = vm.survey;

  const onStart = async () => {
    const ok = await vm.begin();
    if (ok) coordinator.enterSurvey(survey.id);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <NetworkImage uri={survey.sponsor.logoUrl} cornerRadius={20} style={styles.logo} />
          <Text style={[styles.sponsor, { color: colors.textSecondary }]}>
            {survey.sponsor.name.toUpperCase()}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>{survey.title}</Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>{survey.description}</Text>
        </View>

        <View style={[styles.metaCard, { backgroundColor: colors.card }]}>
          <Meta label="Reward" value={formatCents(survey.payoutCents)} colors={colors} />
          <Meta label="Questions" value={String(survey.questions.length)} colors={colors} />
          <Meta label="Duration" value={`~${survey.estimatedMinutes}m`} colors={colors} />
        </View>

        <View style={[styles.warningBox, { backgroundColor: colors.warningBg }]}>
          <Text style={[styles.warningTitle, { color: colors.warningTitle }]}>Heads up</Text>
          <Text style={[styles.warningText, { color: colors.warningText }]}>
            Once you start, you cannot return to a previous question. If you leave before finishing,
            your answers and the reward will be lost and the survey will not be available again.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <GlassPrimaryButton title="Start survey" onPress={onStart} loading={vm.isStarting} />
        <Pressable
          onPress={coordinator.exitToList}
          hitSlop={8}
          style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.5 }]}
        >
          <Text style={[styles.cancelText, { color: colors.accent }]}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Meta({ label, value, colors }: { label: string; value: string; colors: ThemeColors }) {
  return (
    <View style={styles.meta}>
      <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>{label.toUpperCase()}</Text>
      <Text style={[styles.metaValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, padding: spacing.xl, gap: spacing.lg },
  errorContainer: { flex: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  errorTitle: { ...typography.title2 },
  errorBody: { ...typography.body, textAlign: 'center' },
  header: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.xxl * 2 },
  logo: { width: 80, height: 80 },
  sponsor: { ...typography.caption1, letterSpacing: 0.4 },
  title: { ...typography.title1, textAlign: 'center' },
  desc: { ...typography.body, textAlign: 'center' },
  metaCard: {
    flexDirection: 'row',
    borderRadius: radii.lg,
    padding: spacing.md,
    justifyContent: 'space-around',
  },
  meta: { alignItems: 'center', gap: 2 },
  metaLabel: { ...typography.caption1 },
  metaValue: { ...typography.title3 },
  warningBox: {
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  warningTitle: { ...typography.headline },
  warningText: { ...typography.subhead },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: 0, gap: spacing.xs },
  cancelBtn: { alignItems: 'center', paddingVertical: spacing.xs },
  cancelText: { ...typography.headline },
});
