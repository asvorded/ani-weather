import React from 'react';
import { SystemBars } from 'react-native-edge-to-edge';
import { useTheme } from '../hooks/useTheme';

const AdaptiveSystemBars = () => {
  const theme = useTheme();

  return <SystemBars style={theme.currentTheme === 'light' ? 'dark' : 'light'} />;
};

export default AdaptiveSystemBars;
