module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'standard-with-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: 'tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
}
