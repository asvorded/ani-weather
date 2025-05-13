import React, { createContext, useState, useRef, useEffect, ReactNode, FC, useContext } from 'react';
import { Animated } from 'react-native';

interface BackgroundContextProps {
  leftBackground: number;
  rightBackground: number;
  animationValue: Animated.Value;
  setNewBackground: (newBackground: number) => Promise<void>;
}

export const BackgroundContext = createContext<BackgroundContextProps>({
  leftBackground: 0,
  rightBackground: 0,
  animationValue: new Animated.Value(0),
  setNewBackground: async () => {}, // Placeholder async function
});

interface BackgroundProviderProps {
  children: ReactNode;
  initialBackground: number;
}

export const useAnimatedBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('BackgroundContext must be used within a BackgroundProvider');
  }
  return context;
};

export const BackgroundProvider: FC<BackgroundProviderProps> = ({ children, initialBackground }) => {
  const [currentBackground, setCurrentBackground] = useState<number>(initialBackground);
  const [previousBackground, setPreviousBackground] = useState<number>(initialBackground);
  const animationValue = useRef(new Animated.Value(0)).current;

  const setNewBackground = async (newBackground: number) => {
    const toValue = currentBackground === newBackground ? 0 : 1;
    if(toValue === 0) {
      setPreviousBackground(newBackground);
    }
    else
    {
      setCurrentBackground(newBackground);
    }
    const compositeAnimation = Animated.timing(animationValue, {
      toValue: toValue,
      duration: 500,
      useNativeDriver: false,
    });

    await new Promise((resolve) => {
      compositeAnimation.start(() => {
        resolve(true);
      });
    });
  };

  return (
    <BackgroundContext.Provider
      value={{ leftBackground: previousBackground, rightBackground: currentBackground, animationValue, setNewBackground }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};
