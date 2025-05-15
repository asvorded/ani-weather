import React, { createContext, useState, ReactNode, FC, useContext } from 'react';
import { useDerivedValue, withTiming } from 'react-native-reanimated';

interface ThemeContextProps {
  currentTheme: number;
  progress: { value: number };
  fontProgress: { value: number };
  toggleTheme: (number: number) => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextProps>({
  currentTheme: 0,
  progress: { value: 0 },
  fontProgress: { value: 0 },
  toggleTheme: async (number: number) => {},
});

interface ThemeProviderProps {
  theme: number;
  children: ReactNode;
}

export const useWeatherTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('ThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const WeatherThemeProvider: FC<ThemeProviderProps> = ({ theme, children }) => {
  const [currentTheme, setCurrentTheme] = useState<number>(theme);
  const [currentFontTheme, setCurrentFontTheme] = useState<number>(theme > 0.5 ? 1 : 0);
  const progress = useDerivedValue(() => {
    return withTiming(currentTheme);
  });
  const fontProgress = useDerivedValue(() => {
    return withTiming(currentFontTheme);
  });

  const toggleTheme = async (number: number) => {
    setCurrentFontTheme(number > 0.5 ? 1 : 0);
    setCurrentTheme(number);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, progress, fontProgress, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
