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
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useSurveyRunnerStore } from '@/features/survey-runner/store/surveyRunnerStore';
import { quitSurvey } from '@/features/survey-runner/actions/runnerActions';
import { QuestionRenderer, isAnswerValid } from '@/ui/components/QuestionRenderer';
import { GlassPrimaryButton } from '@/ui/components/GlassPrimaryButton';
import type { AnswerValue } from '@/core/models';
import { spacing, typography, useTheme } from '@/ui/theme';

export default function QuestionScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const survey = useSurveyRunnerStore((s) => s.survey);
  const questionIndex = useSurveyRunnerStore((s) => s.questionIndex);
  const submitAnswer = useSurveyRunnerStore((s) => s.submitAnswer);
  const [draft, setDraft] = useState<AnswerValue | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  if (!survey) return null;
  const totalQuestions = survey.questions.length;
  const currentQuestion = survey.questions[questionIndex] ?? null;
  if (!currentQuestion) return null;
  const progress = totalQuestions > 0 ? Math.min((questionIndex + 1) / totalQuestions, 1) : 0;
  const isLast = questionIndex === totalQuestions - 1;

  const onNext = () => {
    if (!draft) return;
    submitAnswer(currentQuestion.id, draft);
    setDraft(undefined);
    if (questionIndex + 1 >= totalQuestions) {
      router.replace(`/runner/${survey.id}/reward`);
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
            quitSurvey();
            router.replace('/(main)/surveys');
          },
        },
      ]
    );
  };

  const valid = isAnswerValid(currentQuestion, draft);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerBar}>
          <View style={[styles.progressTrack, { backgroundColor: colors.separator }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: colors.accent }]} />
          </View>
          <View style={styles.headerRow}>
            <Text style={[styles.step, { color: colors.textSecondary }]}>
              Question {questionIndex + 1} of {totalQuestions}
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
            question={currentQuestion}
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
