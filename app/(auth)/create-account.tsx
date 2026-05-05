import { View, Text, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { GlassPrimaryButton } from '@/ui/components/GlassPrimaryButton';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

export default function CreateAccountScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={styles.container}>
        <Text style={[styles.heading, { color: colors.text }]}>Create your Sayso account</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Start earning on your first survey today.
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
          placeholder="Full name"
          placeholderTextColor={colors.textTertiary}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
          placeholder="Email"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
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
        <GlassPrimaryButton
          title="Create account"
          variant="filled"
          onPress={() => Alert.alert('TBD', 'Account creation is not implemented in this demo')}
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
  },
});
