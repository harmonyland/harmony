module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['standard-with-typescript', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json'
  },
  plugins: [],
  rules: {
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
}
