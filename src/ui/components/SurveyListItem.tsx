import { Pressable, View, Text, StyleSheet } from 'react-native';
import { MarqueeText } from './MarqueeText';
import type { Survey } from '@/core/models';
import { NetworkImage } from './NetworkImage';
import { formatCents } from '@/core/utils/currency';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

type Props = {
  survey: Survey;
  onPress: () => void;
};

export function SurveyListItem({ survey, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.separator },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.row}>
        <NetworkImage uri={survey.sponsor.logoUrl} cornerRadius={16} style={styles.logo} />
        <View style={styles.middle}>
          <Text style={[styles.sponsor, { color: colors.textSecondary }]}>
            {survey.sponsor.name.toUpperCase()}
          </Text>
          <MarqueeText text={survey.title} style={[styles.title, { color: colors.text }]} />
          <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>
            {survey.description}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: colors.textTertiary }]}>
              {survey.estimatedMinutes}m · {survey.difficulty}
            </Text>
            <Text style={[styles.meta, { color: colors.textTertiary }]}>
              · expires {formatExpiry(survey.expiresAt)}
            </Text>
          </View>
        </View>
        <View style={[styles.payoutWrap, { backgroundColor: colors.payout }]}>
          <Text style={styles.payout}>{formatCents(survey.payoutCents)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function formatExpiry(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  const days = Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days < 7) return `in ${days}d`;
  return `in ${Math.round(days / 7)}w`;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs + 2,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardPressed: { opacity: 0.7 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  logo: { width: 48, height: 48 },
  middle: { flex: 1, gap: 2 },
  sponsor: { ...typography.caption1, letterSpacing: 0.3 },
  title: { ...typography.headline },
  desc: { ...typography.subhead },
  metaRow: { flexDirection: 'row', gap: spacing.xs, marginTop: 2 },
  meta: { ...typography.caption1 },
  payoutWrap: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
  },
  payout: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
