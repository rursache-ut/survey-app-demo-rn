import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import {
  GlassView,
  isLiquidGlassAvailable,
  isGlassEffectAPIAvailable,
} from 'expo-glass-effect';
import { radii, spacing, typography, useTheme } from '@/ui/theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'glass';
};

export function GlassPrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  variant = 'glass',
}: Props) {
  const { colors } = useTheme();
  const useGlass = variant === 'glass' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

  const inner = (
    <View style={styles.inner}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.label, { color: '#fff' }]}>{title}</Text>
      )}
    </View>
  );

  if (useGlass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        isInteractive
        tintColor={colors.accent}
        style={[styles.glass, disabled && { opacity: 0.4 }]}
      >
        <Pressable
          onPress={onPress}
          disabled={disabled || loading}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          {inner}
        </Pressable>
      </GlassView>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.filled,
        { backgroundColor: colors.accent, borderRadius: radii.pill },
        (disabled || loading) && { opacity: 0.4 },
        pressed && { opacity: 0.85 },
      ]}
    >
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inner: {
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glass: { borderRadius: radii.pill, overflow: 'hidden' },
  filled: { alignItems: 'stretch' },
  label: { ...typography.headline },
});
