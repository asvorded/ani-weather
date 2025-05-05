import * as React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';

import { styles } from './CityCarousel.styles';
import { CityCarouselProps } from './CityCarousel.types';
import { customTextStyles } from '../../../components/CustomText/CustomText';

const PAGE_WIDTH = 130;
const TEXT_WIDTH = 110;
const PAGE_HEIGHT = 40;


function CityCarousel({ cities, onChange, style }: CityCarouselProps) {
  const r = React.useRef<ICarouselInstance>(null);

  return (
    <Carousel
      ref={r}
      loop
      style={[
        styles.carousel,
        {
          height: PAGE_HEIGHT,
        },
        style,
      ]}
      width={PAGE_WIDTH}
      height={PAGE_HEIGHT}
      data={cities.map(e => e.name)}
      onSnapToItem={(index) => {
        onChange && onChange(cities[index]);
      }}
      renderItem={({ item, animationValue }) => {
        return (
          <Item
            animationValue={animationValue}
            label={item}
            onPress={() =>
              r.current?.scrollTo({
                count: animationValue.value,
                animated: true,
              })
            }
          />
        );
      }}
    />
  );
}

export default CityCarousel;

interface Props {
	animationValue: Animated.SharedValue<number>;
	label: string;
	onPress?: () => void;
}

const Item: React.FC<Props> = (props) => {
  const { animationValue, label, onPress } = props;

  const translateY = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
    };
  }, [animationValue]);

  const labelStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [1, 1.25, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }, { translateY: translateY.value }],
    };
  }, [animationValue, translateY]);

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.textWrapper,
          containerStyle,
        ]}
      >
        <Animated.Text
          style={[
            customTextStyles,
            styles.text,
            {
              maxWidth: TEXT_WIDTH,
            },
            labelStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};
