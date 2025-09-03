import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';

interface ShimmerProps {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

export const Shimmer: React.FC<ShimmerProps> = ({ width = '100%', height = 16, radius = 8, style }) => {
  const translateX = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, { toValue: 100, useNativeDriver: true, duration: 1200 }),
        Animated.timing(translateX, { toValue: -100, useNativeDriver: true, duration: 0 }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [translateX]);

  return (
    <View style={[styles.container, { width: width as any, height, borderRadius: radius }, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [
              {
                translateX: translateX.interpolate({
                  inputRange: [-100, 100],
                  outputRange: [-100, 100],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '60%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    opacity: 0.6,
  },
});

export default Shimmer;
