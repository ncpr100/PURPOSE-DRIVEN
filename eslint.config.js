const { FlatCompat } = require("@eslint/eslintrc");
const globals = require("globals");

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

module.exports = [
  ...compat.extends("next/core-web-vitals"),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@next/next/no-duplicate-head": "off",
      // Prevent state vs. props confusion in UI components
      // Warns when rendering props directly that might need state-based conditional logic
      "react/jsx-no-leaked-render": "warn",
    },
  },
];
