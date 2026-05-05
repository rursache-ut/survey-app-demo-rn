import { FlatList, View, Text, ActivityIndicator, Platform, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useSurveyListStore } from '@/features/surveys/store/surveyListStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { SurveyListItem } from '@/ui/components/SurveyListItem';
import { formatCents } from '@/core/utils/currency';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

export default function SurveysScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const surveys = useSurveyListStore((s) => s.surveys);
  const completedIds = useSurveyListStore((s) => s.completedIds);
  const isLoading = useSurveyListStore((s) => s.isLoading);
  const load = useSurveyListStore((s) => s.load);
  const balanceCents = useAuthStore((s) => s.balanceCents);

  const visible = useMemo(
    () =>
      surveys
        .filter((s) => !completedIds.includes(s.id))
        .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()),
    [surveys, completedIds]
  );

  useEffect(() => {
    load();
  }, [load]);

  useLayoutEffect(() => {
    const settingsButton = (
      <Pressable
        onPress={() => router.push('/settings')}
        hitSlop={12}
        style={{ paddingHorizontal: 4 }}
      >
        <Ionicons name="settings-outline" size={26} color={colors.accent} />
      </Pressable>
    );
    const balancePill = (
      <View style={[styles.balancePill, { backgroundColor: colors.payout }]}>
        <Text style={[styles.balanceText, { color: '#fff' }]}>{formatCents(balanceCents)}</Text>
      </View>
    );

    if (Platform.OS === 'ios') {
      // unstable_headerRightItems gives us the iOS 26 Liquid Glass treatment
      navigation.setOptions({
        headerLeft: () => settingsButton,
        unstable_headerRightItems: () => [
          { type: 'custom', hidesSharedBackground: true, element: balancePill },
        ],
      });
    } else {
      navigation.setOptions({
        headerLeft: () => <View style={{ paddingLeft: spacing.md }}>{balancePill}</View>,
        headerRight: () => <View style={{ paddingRight: spacing.sm }}>{settingsButton}</View>,
      });
    }
  }, [navigation, router, balanceCents, colors]);

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      data={visible}
      keyExtractor={(s) => s.id}
      renderItem={({ item }) => (
        <SurveyListItem survey={item} onPress={() => router.push(`/runner/${item.id}/intro`)} />
      )}
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.empty}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No surveys available</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Check back soon</Text>
          </View>
        )
      }
      refreshing={isLoading}
      onRefresh={load}
      contentContainerStyle={visible.length === 0 ? { flexGrow: 1 } : { paddingVertical: spacing.sm }}
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyText: { ...typography.headline },
  emptySub: { ...typography.subhead, marginTop: 4 },
  balancePill: { borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2 },
  balanceText: { fontWeight: '600' as const, fontVariant: ['tabular-nums'] },
});
