module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020, // Use the latest ecmascript standard
    sourceType: 'module', // Allows using import/export statements
  },
  env: {
    node: true, // Enables Node.js global variables and Node.js scoping.
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['simple-import-sort'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
      { usePrettierrc: true },
    ], // Use our .prettierrc file as source
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'max-lines': ['error', 350],
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'no-unused-vars': 'off',
    'no-case-declarations': 'off',
  },
};