import { View, Text, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { GlassPrimaryButton } from '@/ui/components/GlassPrimaryButton';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={styles.container}>
        <Text style={[styles.heading, { color: colors.text }]}>Reset your password</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Enter your account email and we will send you a link to reset your password.
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
          placeholder="Email"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <GlassPrimaryButton
          title="Send reset link"
          variant="filled"
          onPress={() => Alert.alert('TBD', 'Password reset is not implemented in this demo')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: spacing.xl, gap: spacing.md },
  heading: { ...typography.title2 },
  body: { ...typography.body },
  input: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderRadius: radii.md,
    fontSize: 17,
    marginTop: spacing.sm,
  },
});
