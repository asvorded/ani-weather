// CustomIcon.tsx
import React from 'react';
import {Animated, ImageStyle, StyleProp, View} from 'react-native';
import {useTheme} from '../../hooks/useTheme.tsx';
import {SvgProps} from 'react-native-svg';
import {interpolate, interpolateColor, useAnimatedStyle} from 'react-native-reanimated';

interface CustomIconProps {
  style?: StyleProp<ImageStyle>;
  DarkIcon: React.FC<SvgProps>;
  LightIcon: React.FC<SvgProps>;
  width?: number;
  height?: number;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  style,
  LightIcon,
  DarkIcon,
  width = 40,
  height = 40,
}) => {
  const {progress} = useTheme();

  const lightOpacity = useAnimatedStyle(()=>{
    const opacity = interpolate(progress.value, [0, 1], [1, 0]);
    return {
      opacity: opacity,
    };
  });
  const darkOpacity = useAnimatedStyle(()=>{
    const opacity = interpolate(progress.value, [0, 1], [0, 1]);
    return {
      opacity: opacity,
    };
  });

  return (
    <View style={[{ width, height, position: 'relative' }, style]}>
      {/* First SVG is rendered underneath */}
      <Animated.View style={[{ position: 'absolute', width, height }, lightOpacity]}>
        <LightIcon width={width} height={height} />
      </Animated.View>
      {/* Second SVG overlays the first */}
      <Animated.View style={[{ position: 'absolute', width, height}, darkOpacity]}>
        <DarkIcon width={width} height={height} />
      </Animated.View>
    </View>
  );
};

export default CustomIcon;
