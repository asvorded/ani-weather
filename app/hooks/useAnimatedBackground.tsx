import React, { createContext, useState, useRef, useEffect, ReactNode, FC, useContext } from 'react';
import {Easing, useDerivedValue, useSharedValue, withTiming} from 'react-native-reanimated';

interface BackgroundContextProps {
  leftBackground: number;
  rightBackground: number;
  progress: { value: number };
  setNewBackground: (newBackground: number) => Promise<void>;
}

export const BackgroundContext = createContext<BackgroundContextProps>({
  leftBackground: 0,
  rightBackground: 0,
  progress: { value: 0 },
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
  const [leftBackground, setLeftBackground] = useState<number>(initialBackground);
  const [rightBackground, setRightBackground] = useState<number>(initialBackground);
  const [targetSide, setTargetSide] = useState<boolean>(false);

  const progress = useDerivedValue(() => {
    return withTiming(
      targetSide ? 1 : 0
    );
  });

  const setNewBackground = async (newBackground: number) => {
    if ((targetSide && rightBackground === newBackground) ||
      (!targetSide && leftBackground === newBackground)) {
      return;
    }
    if (targetSide) {
      setLeftBackground(newBackground);
    } else {
      setRightBackground(newBackground);
    }
    setTargetSide(prev =>!prev);
  };

  return (
    <BackgroundContext.Provider
      value={{
        leftBackground: leftBackground,
        rightBackground: rightBackground,
        progress,
        setNewBackground,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};
