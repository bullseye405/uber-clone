// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/*"],
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          htmlWhitespaceSensitivity: "ignore",
          tabWidth: 2,
          useTabs: false,
        },
      ],
      // Let Prettier handle indentation/spacing — disable ESLint spacing rules
      indent: "off",
      "no-multi-spaces": "off",
      "no-irregular-whitespace": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);
