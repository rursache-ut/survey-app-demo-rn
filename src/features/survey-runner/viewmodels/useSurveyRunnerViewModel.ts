import { useSurveyRunnerStore } from '@/features/survey-runner/store/surveyRunnerStore';

export function useSurveyRunnerViewModel() {
  const survey = useSurveyRunnerStore((s) => s.survey);
  const idx = useSurveyRunnerStore((s) => s.questionIndex);
  const submit = useSurveyRunnerStore((s) => s.submitAnswer);
  const abandon = useSurveyRunnerStore((s) => s.abandon);
  const finish = useSurveyRunnerStore((s) => s.finish);

  const totalQuestions = survey?.questions.length ?? 0;
  const currentQuestion = survey ? survey.questions[idx] ?? null : null;
  const isFinished = survey != null && idx >= totalQuestions;
  const progress = totalQuestions > 0 ? Math.min(idx / totalQuestions, 1) : 0;

  return {
    survey,
    currentQuestion,
    questionIndex: idx,
    totalQuestions,
    isFinished,
    progress,
    submitAnswer: submit,
    abandon,
    finish,
  };
}
