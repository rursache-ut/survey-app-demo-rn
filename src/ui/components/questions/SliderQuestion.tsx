import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useEffect, useRef } from 'react';
import type { SliderQuestion as Q, AnswerValue } from '@/core/models';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

type Props = {
  question: Q;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
};

export function SliderQuestion({ question, value, onChange }: Props) {
  const { colors } = useTheme();
  const current = value?.type === 'slider' ? value.value : Math.round((question.min + question.max) / 2);
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    if (value?.type !== 'slider') {
      onChange({ type: 'slider', value: current });
    }
  }, [value, current, onChange]);
  return (
    <View style={styles.container}>
      <Text style={[styles.prompt, { color: colors.text }]}>{question.prompt}</Text>
      <View style={[styles.valueBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.value, { color: colors.accent }]}>
          {formatValue(current, question.unit)}
        </Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={question.min}
        maximumValue={question.max}
        step={question.step}
        value={current}
        onValueChange={(v) => onChange({ type: 'slider', value: Math.round(v / question.step) * question.step })}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.separator}
        accessibilityRole="adjustable"
        accessibilityLabel={question.prompt}
        accessibilityValue={{
          min: question.min,
          max: question.max,
          now: current,
          text: formatValue(current, question.unit),
        }}
      />
      <View style={styles.bounds}>
        <Text style={[styles.bound, { color: colors.textSecondary }]}>{formatValue(question.min, question.unit)}</Text>
        <Text style={[styles.bound, { color: colors.textSecondary }]}>{formatValue(question.max, question.unit)}</Text>
      </View>
    </View>
  );
}

export function isSliderValid(value: AnswerValue | undefined): boolean {
  return value?.type === 'slider' && Number.isFinite(value.value);
}

function formatValue(v: number, unit?: string): string {
  if (unit === '$') return `$${v.toLocaleString()}`;
  if (unit) return `${v}${unit.startsWith('/') ? unit : ' ' + unit}`;
  return String(v);
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  prompt: { ...typography.title2 },
  valueBox: { borderRadius: radii.lg, paddingVertical: spacing.lg, alignItems: 'center' },
  value: { ...typography.largeTitle, fontVariant: ['tabular-nums'] },
  slider: { width: '100%', height: 40 },
  bounds: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.xs },
  bound: { ...typography.footnote, fontVariant: ['tabular-nums'] },
});
