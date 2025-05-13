import React from 'react';
import {Animated, Text} from 'react-native';
import { styles } from './CustomText.styles';
import { CustomTextProps } from './CustomText.types';
import {useTheme} from '../../hooks/useTheme.tsx';
import {themes} from '../../themes/themes.ts';


export const CustomText: React.FC<CustomTextProps> = ({ children, style, ...restProps }: CustomTextProps) => {
  const { lightToDarkAnimation } = useTheme();
  const animatedTextColor = lightToDarkAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [themes.light.text, themes.dark.text],
  });
  return (
    <Animated.Text
      style={[styles.text,{ color: animatedTextColor }, style]}
      {...restProps}
    >
      {children}
    </Animated.Text>
  );
};

const customTextStyles = styles.text;

export { customTextStyles };
