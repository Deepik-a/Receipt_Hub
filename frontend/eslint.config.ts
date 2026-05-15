import js from '@eslint/js'
import globals from 'globals'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: react,
    },
   rules: {
  ...js.configs.recommended.rules,
  ...((tseslint.configs.recommended?.rules) || {}),
  ...react.configs.recommended.rules,
  'react/react-in-jsx-scope': 'off',
},
  },
]