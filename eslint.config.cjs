const js = require('@eslint/js');

const nodeGlobals = {
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
};

const mochaGlobals = {
  suite: 'readonly',
  test: 'readonly',
  describe: 'readonly',
  it: 'readonly',
  before: 'readonly',
  after: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly'
};

module.exports = [
  {
    ignores: [
      '.vscode-test/**',
      'node_modules/**',
      'out/**',
      'dist/**'
    ]
  },
  js.configs.recommended,
  {
    // extension.js et les tests sont des modules CommonJS
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: nodeGlobals
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-console': 'off'
    }
  },
  {
    files: ['test/**/*.cjs'],
    languageOptions: {
      globals: mochaGlobals
    }
  }
];
