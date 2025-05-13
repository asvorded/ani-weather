import React from 'react';
import {Animated, Image, StyleSheet, View} from 'react-native';
import { useAnimatedBackground } from '../../hooks/useAnimatedBackground'; // Adjust the path as needed

interface AnimatedBackgroundProps {
  style?: any; // Optional styles for the container
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ style}) => {
  const { leftBackground, rightBackground, animationValue } = useAnimatedBackground();

  const opacityValueToNew = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const opacityValueToLeft = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const AnimatedImageBackground = Animated.createAnimatedComponent(Animated.View);

  return (
    <View style={[styles.container, style]}>
      <AnimatedImageBackground
        style={[styles.background, { opacity: opacityValueToLeft }]}
      >
        <Image
          source={leftBackground}
          resizeMode={'cover'}
          style={{ width: '100%', height: '100%'}}
        />
      </AnimatedImageBackground>

      <AnimatedImageBackground
        style={[styles.background, { opacity: opacityValueToNew }]}
      >
        <Animated.Image
          source={rightBackground}
          resizeMode={'cover'}
          //style={{ width: 1000, height: 1000 }}
        />
      </AnimatedImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Ensures the background stays in place
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute', // Spans the container
    width: '100%',
    height: '100%',
  },
  childrenContainer: {
    position: 'absolute', // Place children on top of the animated background
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default AnimatedBackground;
