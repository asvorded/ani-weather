import React, {useMemo} from 'react';
import {useTheme} from '../../hooks/useTheme';
import Animated, {interpolateColor, useAnimatedStyle} from 'react-native-reanimated';
import {useWeatherTheme} from '../../hooks/useWeatherTheme.tsx';
import {CustomWeatherTextProps} from './CustomWeatherText.types.ts';
import {styles} from './CustomWeatherText.styles.ts';

export const CustomWeatherText: React.FC<CustomWeatherTextProps> = ({ children, style, ...restProps }: CustomWeatherTextProps) => {
  const {fontProgress} = useWeatherTheme();
  const animatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(fontProgress.value, [0, 1], ['#000000', '#FFFFFF']);
    return {
      color: color,
    };
  });
  return (
    <Animated.Text style={[animatedStyle, styles.text, style]} {...restProps}>
      {children}
    </Animated.Text>
  );
};
