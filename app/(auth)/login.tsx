import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/features/auth/store/authStore';
import { GlassPrimaryButton } from '@/ui/components/GlassPrimaryButton';
import { isLikelyEmail } from '@/core/utils/email';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

const TAP_WINDOW_MS = 800;

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isSigningIn = useAuthStore((s) => s.isSigningIn);
  const signInError = useAuthStore((s) => s.signInError);
  const signIn = useAuthStore((s) => s.signIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const tapsRef = useRef<number[]>([]);

  const canSubmit = isLikelyEmail(email) && password.length > 0 && !isSigningIn;

  useEffect(() => {
    if (user) router.replace('/(main)/surveys');
  }, [user, router]);

  const onSubmit = async () => {
    const ok = await signIn(email, password);
    if (ok) router.replace('/(main)/surveys');
  };

  const onHeroTap = () => {
    const now = Date.now();
    tapsRef.current = [...tapsRef.current.filter((t) => now - t < TAP_WINDOW_MS), now];
    if (tapsRef.current.length >= 3) {
      tapsRef.current = [];
      setEmail('test@user.com');
      setPassword('testpass');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable onPress={onHeroTap} style={styles.heroContainer}>
          <View style={[styles.heroIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="checkmark-done-circle" size={72} color={colors.accent} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Sayso</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>Surveys that pay</Text>
        </Pressable>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="Email"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="Password"
            placeholderTextColor={colors.textTertiary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {signInError ? (
            <Text style={[styles.error, { color: colors.danger }]}>{signInError}</Text>
          ) : null}

          <View style={{ marginTop: spacing.sm }}>
            <GlassPrimaryButton
              title="Sign in"
              onPress={onSubmit}
              disabled={!canSubmit}
              loading={isSigningIn}
              variant="filled"
            />
          </View>

          <View style={styles.linksRow}>
            <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={[styles.link, { color: colors.accent }]}>Forgot password</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/(auth)/create-account')}>
              <Text style={[styles.link, { color: colors.accent }]}>Create account</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1, paddingHorizontal: spacing.xl },
  heroContainer: { alignItems: 'center', marginTop: spacing.xxl * 1.5, marginBottom: spacing.xl },
  heroIcon: {
    width: 112,
    height: 112,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  appName: { ...typography.largeTitle, marginTop: spacing.lg },
  tagline: { ...typography.subhead, marginTop: spacing.xs },
  form: { gap: spacing.md, marginTop: spacing.lg },
  input: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderRadius: radii.md,
    fontSize: 17,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  link: { ...typography.callout },
  error: { ...typography.footnote, paddingHorizontal: spacing.xs },
});
