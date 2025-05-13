import React, { createContext, useState, useRef, useEffect, ReactNode, FC, useContext } from 'react';
import { Animated } from 'react-native';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  currentTheme: ThemeMode;
  lightToDarkAnimation: Animated.Value;
  toggleTheme: () => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextProps>({
  currentTheme: 'light',
  lightToDarkAnimation: new Animated.Value(0),
  toggleTheme: async () => {}, // Async toggle function placeholder
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('ThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('light');
  const lightToDarkAnimation = useRef(new Animated.Value(currentTheme === 'light' ? 0 : 1)).current;
  const toggleTheme = async () => {
    const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
  };
  useEffect(() => {
    const compositeAnimation = Animated.timing(lightToDarkAnimation, {
      toValue: currentTheme === 'light' ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    });
    compositeAnimation.start();
    return () => compositeAnimation.stop();
  }, [lightToDarkAnimation, currentTheme]);
  return (
    <ThemeContext.Provider value={{ currentTheme, lightToDarkAnimation: lightToDarkAnimation, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
