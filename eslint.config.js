const { FlatCompat } = require("@eslint/eslintrc");
const globals = require("globals");

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: [
      ".next/**",
      "out/**", 
      "build/**",
      "node_modules/**",
      "*.config.js",
      "public/**/*.js"
    ]
  },
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
      // Maintain enterprise-grade code quality standards
      "react/jsx-no-leaked-render": "warn",
    },
  },
];
