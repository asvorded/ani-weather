module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'indent': ['warn', 2],
    '@typescript-eslint/no-shadow': 'off',
    'react/no-unstable-nested-components': 'off', // ???
  },
};
