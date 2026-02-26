module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    'sonarjs',
    '@typescript-eslint',
    'react-refresh',
  ],
  extends: [
    'standard',
    'standard-react',
    'plugin:sonarjs/recommended',
    'plugin:react-hooks/recommended',
  ],
  env: {
    browser: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  overrides: [
    {
      files: ['cypress/**/*.ts', 'cypress/**/*.tsx', 'src/__tests__/**/*.ts', 'src/__tests__/**/*.tsx'],
      env: {
        'cypress/globals': true,
      },
      plugins: ['cypress'],
      rules: {
        'sonarjs/no-duplicate-string': 'off',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: '18',
    },
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'no-use-before-define': 'off',
    'no-shadow': 'off',
    'react/react-in-jsx-scope': 'off',
    'standard/no-callback-literal': 'off',
    'no-unused-expressions': 'off',
    'space-before-function-paren': 0,
    'react/prop-types': 0,
    'react/jsx-handler-names': 0,
    'react/jsx-fragments': 0,
    'react/no-unused-prop-types': 0,
    'import/export': 0,
    'max-len': ['error', { code: 120 }],
  },
}
