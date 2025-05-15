// app/components/CustomText/CustomText.tsx
import React, {useMemo} from 'react';
import { styles } from './CustomText.styles';
import { CustomTextProps } from './CustomText.types';
import {useTheme} from '../../hooks/useTheme';
import Animated, {interpolateColor, useAnimatedStyle} from 'react-native-reanimated';

export const CustomText: React.FC<CustomTextProps> = ({ children, style, ...restProps }: CustomTextProps) => {
  const {progress} = useTheme();
  const animatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, [0, 1], ['#000000', '#FFFFFF']);
    return {
      color: color,
    };
  });
  return (
    <Animated.Text style={[style, animatedStyle, styles.text]} {...restProps}>
      {children}
    </Animated.Text>
  );
};
