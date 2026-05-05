import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useSurveyRunnerViewModel } from '@/features/survey-runner/viewmodels/useSurveyRunnerViewModel';
import { useSurveyRunnerCoordinator } from '@/features/survey-runner/navigation/useSurveyRunnerCoordinator';
import { useSurveyListStore } from '@/features/surveys/store/surveyListStore';
import { QuestionRenderer, isAnswerValid } from '@/ui/components/QuestionRenderer';
import { GlassPrimaryButton } from '@/ui/components/GlassPrimaryButton';
import type { AnswerValue } from '@/core/models';
import { spacing, typography, useTheme } from '@/ui/theme';

export default function QuestionScreen() {
  const { colors } = useTheme();
  const vm = useSurveyRunnerViewModel();
  const coordinator = useSurveyRunnerCoordinator();
  const markCompleted = useSurveyListStore((s) => s.markCompleted);
  const [draft, setDraft] = useState<AnswerValue | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  if (!vm.survey || !vm.currentQuestion) {
    return null;
  }

  const onNext = () => {
    if (!draft || !vm.currentQuestion) return;
    vm.submitAnswer(vm.currentQuestion.id, draft);
    setDraft(undefined);
    if (vm.questionIndex + 1 >= vm.totalQuestions) {
      coordinator.goToReward(vm.survey!.id);
    }
  };

  const onQuit = () => {
    Alert.alert(
      'Quit survey?',
      'You will lose your progress and the reward, and the survey will not be available again.',
      [
        { text: 'Continue survey', style: 'cancel' },
        {
          text: 'Quit and lose progress',
          style: 'destructive',
          onPress: () => {
            const surveyId = vm.survey!.id;
            vm.abandon();
            markCompleted(surveyId);
            coordinator.exitToList();
          },
        },
      ]
    );
  };

  const valid = isAnswerValid(vm.currentQuestion, draft);
  const isLast = vm.questionIndex === vm.totalQuestions - 1;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerBar}>
          <View style={[styles.progressTrack, { backgroundColor: colors.separator }]}>
            <View style={[styles.progressFill, { width: `${vm.progress * 100}%`, backgroundColor: colors.accent }]} />
          </View>
          <View style={styles.headerRow}>
            <Text style={[styles.step, { color: colors.textSecondary }]}>
              Question {vm.questionIndex + 1} of {vm.totalQuestions}
            </Text>
            <Pressable onPress={onQuit} hitSlop={8}>
              <Text style={[styles.quit, { color: colors.danger }]}>Quit</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <QuestionRenderer
            question={vm.currentQuestion}
            value={draft}
            onChange={setDraft}
          />
        </ScrollView>

        <View style={styles.footer}>
          <GlassPrimaryButton
            title={isLast ? 'Finish' : 'Next'}
            onPress={onNext}
            disabled={!valid}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerBar: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, gap: spacing.sm },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  step: { ...typography.footnote },
  quit: { ...typography.footnote },
  body: { padding: spacing.xl, gap: spacing.lg, flexGrow: 1 },
  footer: { padding: spacing.xl, paddingTop: spacing.md },
});
