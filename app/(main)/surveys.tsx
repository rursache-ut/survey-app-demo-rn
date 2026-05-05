import { FlatList, View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import { useSurveyListViewModel } from '@/features/surveys/viewmodels/useSurveyListViewModel';
import { useSurveyListCoordinator } from '@/features/surveys/navigation/useSurveyListCoordinator';
import { SurveyListItem } from '@/ui/components/SurveyListItem';
import { formatCents } from '@/core/utils/currency';
import { radii, spacing, typography, useTheme } from '@/ui/theme';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function SurveysScreen() {
  const { colors } = useTheme();
  const vm = useSurveyListViewModel();
  const coordinator = useSurveyListCoordinator();
  const navigation = useNavigation();
  const balanceCents = useAuthStore((s) => s.balanceCents);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={coordinator.openSettings}
          hitSlop={12}
          style={{ paddingHorizontal: 4 }}
        >
          <Ionicons name="settings-outline" size={26} color={colors.accent} />
        </Pressable>
      ),
      unstable_headerRightItems: () => [
        {
          type: 'custom',
          hidesSharedBackground: true,
          element: (
            <View style={[styles.balancePill, { backgroundColor: colors.payout }]}>
              <Text style={[styles.balanceText, { color: '#fff' }]}>
                {formatCents(balanceCents)}
              </Text>
            </View>
          ),
        },
      ],
    });
  }, [navigation, coordinator, balanceCents, colors]);

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      data={vm.surveys}
      keyExtractor={(s) => s.id}
      renderItem={({ item }) => (
        <SurveyListItem survey={item} onPress={() => coordinator.startSurvey(item.id)} />
      )}
      ListEmptyComponent={
        vm.isLoading ? (
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
      refreshing={vm.isLoading}
      onRefresh={vm.refresh}
      contentContainerStyle={vm.surveys.length === 0 ? { flexGrow: 1 } : { paddingVertical: spacing.sm }}
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
