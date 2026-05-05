import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo } from 'react';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import type { TopXQuestion as Q, AnswerValue } from '@/core/models';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

type Props = {
  question: Q;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
};

type Item = { id: string; label: string };

export function TopXQuestion({ question, value, onChange }: Props) {
  const { colors } = useTheme();

  const initialOrder = useMemo(() => {
    const stored = value?.type === 'top-x' ? value.orderedOptionIds : null;
    if (stored && stored.length === question.options.length) {
      const map = new Map(question.options.map((o) => [o.id, o]));
      return stored.map((id) => map.get(id)).filter((x): x is Item => !!x);
    }
    return question.options;
  }, [question.options, value]);

  useEffect(() => {
    if (value?.type !== 'top-x') {
      onChange({ type: 'top-x', orderedOptionIds: initialOrder.map((o) => o.id) });
    }
  }, []);

  const setOrder = (items: Item[]) => {
    onChange({ type: 'top-x', orderedOptionIds: items.map((o) => o.id) });
  };

  const move = (index: number, direction: -1 | 1) => {
    const items = [...initialOrder];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target]!, items[index]!];
    setOrder(items);
  };

  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<Item>) => {
    const index = getIndex() ?? 0;
    const isTop = index < question.topCount;
    return (
      <ScaleDecorator>
        <View
          style={[
            styles.row,
            { backgroundColor: colors.card },
            isActive && { backgroundColor: colors.optionSelectedBg, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8 },
            isTop && { borderWidth: 1.5, borderColor: colors.accent },
          ]}
        >
          <View style={[styles.rank, { backgroundColor: isTop ? colors.accent : colors.separator }]}>
            <Text style={[styles.rankText, { color: isTop ? '#fff' : colors.text }]}>{index + 1}</Text>
          </View>
          <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
          <View style={styles.controls}>
            <Pressable onPress={() => move(index, -1)} hitSlop={8} disabled={index === 0}>
              <Ionicons
                name="chevron-up"
                size={22}
                color={index === 0 ? colors.textTertiary : colors.accent}
              />
            </Pressable>
            <Pressable
              onPress={() => move(index, 1)}
              hitSlop={8}
              disabled={index === initialOrder.length - 1}
            >
              <Ionicons
                name="chevron-down"
                size={22}
                color={
                  index === initialOrder.length - 1 ? colors.textTertiary : colors.accent
                }
              />
            </Pressable>
            <Pressable onPressIn={drag} hitSlop={8} style={{ paddingLeft: spacing.sm }}>
              <Ionicons name="reorder-three" size={26} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.prompt, { color: colors.text }]}>{question.prompt}</Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Top {question.topCount} are highlighted. Drag the handle or use the arrows to reorder.
      </Text>
      <DraggableFlatList
        data={initialOrder}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={({ data }) => setOrder(data)}
        activationDistance={10}
        containerStyle={{ flexGrow: 0 }}
      />
    </View>
  );
}

export function isTopXValid(q: { options: { id: string }[] }, value: AnswerValue | undefined): boolean {
  if (value?.type !== 'top-x') return false;
  return value.orderedOptionIds.length === q.options.length;
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm, flex: 1 },
  prompt: { ...typography.title2 },
  hint: { ...typography.subhead, marginBottom: spacing.sm },
  row: {
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: 4,
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { ...typography.footnote, fontWeight: '700' },
  label: { ...typography.body, flex: 1 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
