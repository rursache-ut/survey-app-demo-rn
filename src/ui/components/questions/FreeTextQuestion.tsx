import { View, Text, TextInput, StyleSheet } from 'react-native';
import type { FreeTextQuestion as Q, AnswerValue } from '@/core/models';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

type Props = {
  question: Q;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
};

export function FreeTextQuestion({ question, value, onChange }: Props) {
  const { colors } = useTheme();
  const text = value?.type === 'free-text' ? value.text : '';
  return (
    <View style={styles.container}>
      <Text style={[styles.prompt, { color: colors.text }]}>{question.prompt}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder={question.placeholder ?? 'Type your answer...'}
        placeholderTextColor={colors.textTertiary}
        multiline
        textAlignVertical="top"
        value={text}
        onChangeText={(t) => onChange({ type: 'free-text', text: t })}
        maxLength={question.maxLength}
      />
      {question.minLength ? (
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Min {question.minLength} characters · {text.length}/{question.maxLength ?? '∞'}
        </Text>
      ) : null}
    </View>
  );
}

export function isFreeTextValid(q: { minLength?: number }, value: AnswerValue | undefined): boolean {
  if (value?.type !== 'free-text') return false;
  return value.text.trim().length >= (q.minLength ?? 1);
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  prompt: { ...typography.title2 },
  input: {
    borderRadius: radii.md,
    padding: spacing.lg,
    minHeight: 160,
    fontSize: 17,
  },
  hint: { ...typography.caption1, paddingHorizontal: spacing.xs },
});
