const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

module.exports = [
  {
    ignores: [
      '.vscode-test/**',
      'node_modules/**',
      'out/**',
      'dist/**'
    ]
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-console': 'off',
      'no-const-assign': 'warn',
      'no-this-before-super': 'warn',
      'no-unreachable': 'warn',
      'constructor-super': 'warn',
      'valid-typeof': 'warn'
    }
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        console: true,
        process: true,
        __dirname: true,
        __filename: true,
        require: true,
        module: true,
        exports: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        Buffer: true,
        // Test globals
        suite: true,
        test: true,
        describe: true,
        it: true,
        before: true,
        after: true,
        beforeEach: true,
        afterEach: true
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-console': 'off',
      'no-const-assign': 'warn',
      'no-this-before-super': 'warn',
      'no-unreachable': 'warn',
      'constructor-super': 'warn',
      'valid-typeof': 'warn'
    }
  },
  ...compat.extends('eslint:recommended')
]; 
