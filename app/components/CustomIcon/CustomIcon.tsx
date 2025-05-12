// CustomIcon.tsx
import React from 'react';
import {Animated, ImageStyle, StyleProp, View} from 'react-native';
import {useTheme} from '../../hooks/useTheme.tsx';
import {SvgProps} from 'react-native-svg';

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
  const {lightToDarkAnimation} = useTheme();

  const lightOpacity = lightToDarkAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const darkOpacity = lightToDarkAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={[{ width, height, position: 'relative' }, style]}>
      {/* First SVG is rendered underneath */}
      <Animated.View style={{ position: 'absolute', width, height, opacity: lightOpacity }}>
        <LightIcon width={width} height={height} />
      </Animated.View>
      {/* Second SVG overlays the first */}
      <Animated.View style={{ position: 'absolute', width, height, opacity: darkOpacity }}>
        <DarkIcon width={width} height={height} />
      </Animated.View>
    </View>
  );
};

export default CustomIcon;
