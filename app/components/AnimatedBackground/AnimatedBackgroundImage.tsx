import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import { useAnimatedBackground } from '../../hooks/useAnimatedBackground';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated'; // Adjust the path as needed

interface AnimatedBackgroundProps {
  style?: any;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ style}) => {
  const { leftBackground, rightBackground, progress } = useAnimatedBackground();

  const opacityValueToLeft = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [1, 0]);
    return {
      opacity: opacity,
    };
  });
  const opacityValueToRight = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0, 1]);
    return {
      opacity: opacity,
    };
  });


  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[styles.background, opacityValueToLeft]}
      >
        <Image
          source={leftBackground}
          resizeMode={'cover'}
          style={styles.image}
          blurRadius={1.2}
        />
      </Animated.View>

      <Animated.View
        style={[styles.background, opacityValueToRight]}
      >
        <Image
          source={rightBackground}
          resizeMode={'cover'}
          style={styles.image}
          blurRadius={1.2}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  image:{
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default AnimatedBackground;
