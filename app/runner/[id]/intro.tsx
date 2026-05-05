import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import type { Survey } from '@/core/models';
import { surveyRepository } from '@/core/repositories';
import { useSurveyRunnerStore } from '@/features/survey-runner/store/surveyRunnerStore';
import { useSurveyRunnerCoordinator } from '@/features/survey-runner/navigation/useSurveyRunnerCoordinator';
import { NetworkImage } from '@/ui/components/NetworkImage';
import { GlassPrimaryButton } from '@/ui/components/GlassPrimaryButton';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

export default function IntroScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const start = useSurveyRunnerStore((s) => s.start);
  const coordinator = useSurveyRunnerCoordinator();

  useEffect(() => {
    surveyRepository.getSurvey(id).then(setSurvey);
  }, [id]);

  if (!survey) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator />
      </View>
    );
  }

  const onStart = async () => {
    await start(survey.id);
    coordinator.enterSurvey(survey.id);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
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
          <Meta label="Reward" value={`$${(survey.payoutCents / 100).toFixed(2)}`} primary={colors.text} secondary={colors.textSecondary} />
          <Meta label="Questions" value={String(survey.questions.length)} primary={colors.text} secondary={colors.textSecondary} />
          <Meta label="Duration" value={`~${survey.estimatedMinutes}m`} primary={colors.text} secondary={colors.textSecondary} />
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
        <GlassPrimaryButton title="Start survey" onPress={onStart} />
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

function Meta({
  label,
  value,
  primary,
  secondary,
}: {
  label: string;
  value: string;
  primary: string;
  secondary: string;
}) {
  return (
    <View style={styles.meta}>
      <Text style={[styles.metaLabel, { color: secondary }]}>{label.toUpperCase()}</Text>
      <Text style={[styles.metaValue, { color: primary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, padding: spacing.xl, gap: spacing.lg },
  header: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.xxl },
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
  footer: { padding: spacing.xl, gap: spacing.md },
  cancelBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  cancelText: { ...typography.headline },
});
