import eslintConfigPrettier from "eslint-config-prettier";
import pluginCypress from "eslint-plugin-cypress/flat";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["/node_modules"],
  },
  pluginJs.configs.recommended,
  pluginCypress.configs.recommended,
  eslintConfigPrettier,
];
