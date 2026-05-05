import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  Text,
  View,
  type LayoutChangeEvent,
  type TextStyle,
} from 'react-native';

type Props = {
  text: string;
  style?: TextStyle | TextStyle[];
  pxPerSecond?: number;
  pauseMs?: number;
  /** Minimum allowed scale before falling back to marquee. */
  minScale?: number;
};

export function MarqueeText({
  text,
  style,
  pxPerSecond = 28,
  pauseMs = 1500,
  minScale = 0.95,
}: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const offset = useRef(new Animated.Value(0)).current;

  const fitsAtFull = textWidth > 0 && textWidth <= containerWidth;
  const requiredScale = textWidth > 0 ? containerWidth / textWidth : 1;
  const fitsAtMinScale = requiredScale >= minScale;
  const useShrink = !fitsAtFull && textWidth > 0 && containerWidth > 0 && fitsAtMinScale;
  const useMarquee =
    !fitsAtFull && textWidth > 0 && containerWidth > 0 && !fitsAtMinScale;

  useEffect(() => {
    if (!useMarquee) {
      offset.setValue(0);
      return;
    }
    const distance = textWidth - containerWidth;
    const duration = (distance / pxPerSecond) * 1000;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(pauseMs),
        Animated.timing(offset, {
          toValue: -distance,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(pauseMs),
        Animated.timing(offset, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => {
      loop.stop();
      offset.setValue(0);
    };
  }, [useMarquee, textWidth, containerWidth, pxPerSecond, pauseMs, offset]);

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width)}
      style={{ overflow: 'hidden' }}
    >
      <ScrollView
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 0 }}
      >
        <Animated.View
          style={
            useShrink
              ? {
                  transform: [
                    { translateX: 0 },
                    { scale: requiredScale },
                  ],
                  // anchor scale at the left edge
                  // eslint-disable-next-line react-native/no-inline-styles
                  ...({ transformOrigin: '0% 50%' } as object),
                }
              : { transform: [{ translateX: offset }] }
          }
        >
          <Text
            numberOfLines={1}
            style={style}
            onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
          >
            {text}
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
