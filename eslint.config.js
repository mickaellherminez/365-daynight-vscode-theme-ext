import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended
});

export default [
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
            'no-console': 'off'
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
            'no-console': 'off'
        }
    },
    ...compat.extends('eslint:recommended')
]; 