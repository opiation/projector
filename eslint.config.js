import jsdoc from "eslint-plugin-jsdoc";

/** @type {import("eslint").Linter.FlatConfig} */
const baseConfig = {
  files: ["**/*.{js}"],
  ignores: ["node_modules"],
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
};

/** @type {ReadonlyArray<import("eslint").Linter.FlatConfig>} */
const configs = [
  {
    ...jsdoc.configs["flat/recommended-typescript-flavor"],
    rules: {
      ...jsdoc.configs["flat/recommended-typescript-flavor"].rules,
      "jsdoc/tag-lines": ["off", "always", { startLines: 1 }],
    },
  },
  baseConfig,
];

export default configs;
