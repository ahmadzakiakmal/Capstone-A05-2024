import globals from "globals";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.node }},
  {rules: {
    "no-undef": "warn",
    "semi": ["error", "always"],
    "quotes" : ["error", "double"]
  }}
];