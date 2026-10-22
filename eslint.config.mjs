import neostandard, { plugins } from 'neostandard'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  {
    // Mirrors the previous .eslintignore plus the old lint scope, which was
    // `eslint "**/*.{ts,tsx}"` and so never covered scripts/ or config files.
    ignores: [
      'dist/**',
      'docs/**',
      'build/**',
      'example/**',
      'node_modules/**',
      '.snapshots/**',
      '**/*.min.js',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs'
    ]
  },

  // neostandard replaces eslint-config-standard + standard-react and bundles
  // typescript-eslint, eslint-plugin-react, -n and -promise.
  ...neostandard({
    ts: true,
    jsx: true,
    noJsx: false,
    semi: false
  }),

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // Carried over from the previous .eslintrc.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      'no-use-before-define': 'off',
      'no-shadow': 'off',
      'no-unused-expressions': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-handler-names': 'off',
      'react/jsx-fragments': 'off',
      'react/no-unused-prop-types': 'off',
      'import/export': 'off',
      '@stylistic/space-before-function-paren': 'off',
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/max-len': ['error', { code: 120 }],
      // src/types/index.ts documents the public API with 4-space indented
      // members; eslint-config-standard never enforced indent there.
      '@stylistic/indent': 'off'
    },
    settings: {
      react: { version: '19' }
    }
  },

  {
    files: ['src/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...plugins.globals?.node,
        jest: 'readonly'
      }
    }
  }
]
