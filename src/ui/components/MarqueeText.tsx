import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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
};

export function MarqueeText({ text, style, pxPerSecond = 28, pauseMs = 1500 }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const offset = useRef(new Animated.Value(0)).current;
  const overflow = textWidth > containerWidth && containerWidth > 0;

  useEffect(() => {
    if (!overflow) {
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
  }, [overflow, textWidth, containerWidth, pxPerSecond, pauseMs, offset]);

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width)}
      style={{ overflow: 'hidden' }}
    >
      <Animated.View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          transform: [{ translateX: offset }],
        }}
      >
        <Text
          numberOfLines={1}
          style={style}
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        >
          {text}
        </Text>
      </Animated.View>
    </View>
  );
}
