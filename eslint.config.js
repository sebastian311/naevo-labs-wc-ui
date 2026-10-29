import js from '@eslint/js';
import globals from 'globals';
import lit from 'eslint-plugin-lit';
import wc from 'eslint-plugin-wc';
import prettier from 'eslint-config-prettier';

/**
 * ESLint flat config — an ordered array; later entries override earlier ones for matching files.
 * Prettier owns formatting, ESLint owns correctness: eslint-config-prettier (last) switches off style rules.
 */
export default [
  {
    ignores: [
      '**/dist/',
      'coverage/',
      'storybook-static/',
      'playwright-report/',
      'test-results/',
      '!.storybook/',
    ],
  },

  js.configs.recommended,

  // Browser code: components, unit tests, stories, Storybook preview
  {
    files: ['src/**/*.js', '.storybook/preview.js'],
    ignores: ['src/**/e2e/**'],
    languageOptions: { globals: globals.browser },
  },

  // Component source only: Lit template rules + Custom Element best practices
  {
    ...lit.configs['flat/recommended'],
    files: ['src/**/*.js'],
    ignores: ['src/**/{test,stories,e2e}/**'],
  },
  {
    ...wc.configs['flat/best-practice'],
    files: ['src/**/*.js'],
    ignores: ['src/**/{test,stories,e2e}/**'],
  },

  // Unit tests run under Mocha (describe / it / beforeEach ...)
  {
    files: ['src/**/test/**/*.js'],
    languageOptions: { globals: globals.mocha },
  },

  // Node code: tool configs, scaffolding scripts, and Playwright specs
  {
    files: ['*.{js,mjs,cjs}', 'scripts/**/*.{js,mjs,cjs}', '.storybook/main.js', 'src/**/e2e/**/*.js'],
    languageOptions: { globals: globals.node },
  },

  prettier,
];
