export interface Theme {
  background: string;
  text: string;
}

export const themes: Record<'light' | 'dark', Theme> = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
  },
};
