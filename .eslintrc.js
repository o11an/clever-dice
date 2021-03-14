module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/vue',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'linebreak-style': 0,
    quotes: ['error', 'single'],
    'vue/no-unused-components': 1,
  },
};
