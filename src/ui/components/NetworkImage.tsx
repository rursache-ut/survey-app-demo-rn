import { Image as ExpoImage, type ImageStyle } from 'expo-image';
import { requireNativeViewManager } from 'expo-modules-core';
import { type ViewStyle, type StyleProp } from 'react-native';

export type NetworkImageProps = {
  uri: string;
  cornerRadius?: number;
  contentMode?: 'cover' | 'contain' | 'fill';
  style?: StyleProp<ViewStyle>;
};

let NativeNetworkImage: React.ComponentType<NetworkImageProps> | null = null;
try {
  NativeNetworkImage = requireNativeViewManager<NetworkImageProps>('NetworkImage');
} catch {
  NativeNetworkImage = null;
}

export function NetworkImage(props: NetworkImageProps) {
  if (NativeNetworkImage) {
    return <NativeNetworkImage {...props} />;
  }
  return (
    <ExpoImage
      source={{ uri: props.uri }}
      style={[
        props.style as StyleProp<ImageStyle>,
        props.cornerRadius != null ? { borderRadius: props.cornerRadius } : null,
      ]}
      contentFit={props.contentMode ?? 'cover'}
      transition={120}
    />
  );
}
