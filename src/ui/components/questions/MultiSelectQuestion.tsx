import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { MultiSelectQuestion as Q, AnswerValue } from '@/core/models';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

type Props = {
  question: Q;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
};

export function MultiSelectQuestion({ question, value, onChange }: Props) {
  const { colors } = useTheme();
  const selected = value?.type === 'multi-select' ? value.optionIds : [];
  const limit = question.maxSelections;

  const toggle = (id: string) => {
    const isSelected = selected.includes(id);
    let next: string[];
    if (isSelected) {
      next = selected.filter((x) => x !== id);
    } else {
      if (limit && selected.length >= limit) return;
      next = [...selected, id];
    }
    Haptics.selectionAsync().catch(() => {});
    onChange({ type: 'multi-select', optionIds: next });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.prompt, { color: colors.text }]}>{question.prompt}</Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        {question.minSelections ? `Pick at least ${question.minSelections}.` : ''}
        {limit ? ` Up to ${limit}.` : ''}
      </Text>
      <View style={styles.options}>
        {question.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <Pressable
              key={opt.id}
              onPress={() => toggle(opt.id)}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? colors.optionSelectedBg : colors.card,
                  borderColor: isSelected ? colors.accent : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.optionLabel,
                  { color: colors.text },
                  isSelected && { fontWeight: '600' },
                ]}
              >
                {opt.label}
              </Text>
              <Ionicons
                name={isSelected ? 'checkbox' : 'square-outline'}
                size={22}
                color={isSelected ? colors.accent : colors.textTertiary}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function isMultiSelectValid(q: { minSelections?: number }, value: AnswerValue | undefined): boolean {
  if (value?.type !== 'multi-select') return false;
  return value.optionIds.length >= (q.minSelections ?? 1);
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  prompt: { ...typography.title2 },
  hint: { ...typography.subhead, marginBottom: spacing.sm },
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
