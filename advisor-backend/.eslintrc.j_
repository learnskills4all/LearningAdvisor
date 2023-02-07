module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    node: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      moduleDirectory: ['src', 'node_modules'],
    },
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 0,
    'import/extensions': 0,
    'max-lines': ['error', 400],
    complexity: ['error', 20],
    'max-classes-per-file': ['error', 20],
    'linebreak-style': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'warn',
    'import/no-unresolved': 'off',
    'import/no-cycle': [
      'error',
      {
        // "ignoreExternal": true // prevent the cycle detection to expand to external modules
      },
    ],
  },
};
