import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SingleSelectQuestion as Q, AnswerValue } from '@/core/models';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

type Props = {
  question: Q;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
};

export function SingleSelectQuestion({ question, value, onChange }: Props) {
  const { colors } = useTheme();
  const selectedId = value?.type === 'single-select' ? value.optionId : undefined;
  return (
    <View style={styles.container}>
      <Text style={[styles.prompt, { color: colors.text }]}>{question.prompt}</Text>
      <View style={styles.options}>
        {question.options.map((opt) => {
          const selected = opt.id === selectedId;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onChange({ type: 'single-select', optionId: opt.id })}
              style={[
                styles.option,
                {
                  backgroundColor: selected ? colors.optionSelectedBg : colors.card,
                  borderColor: selected ? colors.accent : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.optionLabel,
                  { color: colors.text },
                  selected && { fontWeight: '600' },
                ]}
              >
                {opt.label}
              </Text>
              {selected ? <Ionicons name="checkmark-circle" size={22} color={colors.accent} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function isSingleSelectValid(value: AnswerValue | undefined): boolean {
  return value?.type === 'single-select' && !!value.optionId;
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  prompt: { ...typography.title2 },
  options: { gap: spacing.sm },
  option: {
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: { ...typography.body },
});
