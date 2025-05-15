import React, {createContext, useState, ReactNode, FC, useContext, useEffect} from 'react';
import {useDerivedValue, withTiming} from 'react-native-reanimated';
import {Appearance} from 'react-native';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  currentTheme: ThemeMode;
  progress: { value: number };
  toggleTheme: () => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextProps>({
  currentTheme: 'light',
  progress: { value: 0 },
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
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setCurrentTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => subscription.remove();
  }, []);
  const progress = useDerivedValue(()=>{
    return withTiming(currentTheme === 'light' ? 0 : 1);
  });
  const toggleTheme = async () => {
    const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
  };
  return (
    <ThemeContext.Provider value={{ currentTheme, progress, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

