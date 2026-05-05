import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NetworkImage } from '@/ui/components/NetworkImage';
import { useSettingsViewModel } from '@/features/settings/viewmodels/useSettingsViewModel';
import { radii, spacing, typography, useTheme, type ThemeColors } from '@/ui/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const vm = useSettingsViewModel();
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      <Section header="Profile" colors={colors}>
        <View style={[styles.profileRow, { borderBottomColor: colors.separator }]}>
          {vm.user ? (
            <NetworkImage uri={vm.user.avatarUrl} cornerRadius={16} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.separator }]} />
          )}
          <View style={styles.profileText}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {vm.user?.fullName ?? 'Guest'}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {vm.user?.email ?? ''}
            </Text>
          </View>
        </View>
        <IconRow
          icon="wallet-outline"
          iconBg="#34C759"
          label="Balance"
          value={vm.balanceFormatted}
          colors={colors}
          last
        />
      </Section>

      <Section header="Preferences" colors={colors}>
        <ToggleRow
          icon="notifications-outline"
          iconBg="#FF453A"
          label="Push notifications"
          value={vm.pushNotifications}
          onChange={vm.setPushNotifications}
          colors={colors}
          last
        />
      </Section>

      <Section header="Legal" colors={colors}>
        <IconRow
          icon="lock-closed-outline"
          iconBg="#5856D6"
          label="Privacy Policy"
          colors={colors}
          onPress={() => Alert.alert('TBD', 'Privacy policy is not implemented in this demo')}
        />
        <IconRow
          icon="document-text-outline"
          iconBg="#8E8E93"
          label="Terms of Service"
          colors={colors}
          last
          onPress={() => Alert.alert('TBD', 'Terms of service are not implemented in this demo')}
        />
      </Section>

      <Section header="Support" colors={colors}>
        <IconRow
          icon="mail-outline"
          iconBg="#0A84FF"
          label="Contact us"
          colors={colors}
          last
          onPress={() => Linking.openURL('mailto:contact@randusoft.ro')}
        />
      </Section>

      <Section colors={colors}>
        <Pressable
          onPress={() => {
            vm.signOut();
            router.replace('/(auth)/login');
          }}
          style={({ pressed }) => [
            styles.row,
            { borderBottomColor: 'transparent' },
            pressed && { backgroundColor: 'rgba(255,255,255,0.04)' },
          ]}
        >
          <Text style={[styles.rowLabel, { color: colors.danger, textAlign: 'center', flex: 1 }]}>
            Sign out
          </Text>
        </Pressable>
      </Section>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text }]}>Sayso</Text>
        <Text style={[styles.footerSub, { color: colors.textTertiary }]}>
          Version {appVersion} · {Platform.OS}
        </Text>
      </View>
    </ScrollView>
  );
}

function Section({
  header,
  children,
  colors,
}: {
  header?: string;
  children: React.ReactNode;
  colors: ThemeColors;
}) {
  return (
    <View style={styles.section}>
      {header ? (
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          {header.toUpperCase()}
        </Text>
      ) : null}
      <View style={[styles.sectionBody, { backgroundColor: colors.card }]}>{children}</View>
    </View>
  );
}

function IconRow({
  icon,
  iconBg,
  label,
  value,
  onPress,
  colors,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  label: string;
  value?: string;
  onPress?: () => void;
  colors: ThemeColors;
  last?: boolean;
}) {
  const inner = (
    <View
      style={[
        styles.row,
        { borderBottomColor: last ? 'transparent' : colors.separator },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={16} color="#fff" />
      </View>
      <Text style={[styles.rowLabel, { color: colors.text, flex: 1 }]}>{label}</Text>
      {value ? (
        <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{value}</Text>
      ) : null}
      {onPress ? (
        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
      ) : null}
    </View>
  );
  if (!onPress) return inner;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
      {inner}
    </Pressable>
  );
}

function ToggleRow({
  icon,
  iconBg,
  label,
  value,
  onChange,
  colors,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  colors: ThemeColors;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: last ? 'transparent' : colors.separator },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={16} color="#fff" />
      </View>
      <Text style={[styles.rowLabel, { color: colors.text, flex: 1 }]}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.lg },
  sectionHeader: {
    ...typography.footnote,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xs,
  },
  sectionBody: {
    marginHorizontal: spacing.lg,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { ...typography.body },
  rowValue: { ...typography.body, fontVariant: ['tabular-nums'] },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: { width: 56, height: 56 },
  profileText: { flex: 1 },
  profileName: { ...typography.headline },
  profileEmail: { ...typography.subhead, marginTop: 2 },
  footer: { alignItems: 'center', padding: spacing.xl, gap: 2 },
  footerText: { ...typography.headline },
  footerSub: { ...typography.caption1 },
});
