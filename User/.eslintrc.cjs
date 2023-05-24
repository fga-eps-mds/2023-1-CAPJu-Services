module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "arrow-parens": "off",
    eqeqeq: "error",
    "function-paren-newline": "off",
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "linebreak-style": [2, "unix"],
    "no-console": [
      "error",
      {
        allow: ["info", "warn", "error", "time", "timeEnd"],
      },
    ],
    "no-duplicate-imports": "error",
    "no-extra-parens": "error",
    "no-return-await": "error",
    "no-unused-vars": "warn",
    "no-shadow": [
      "error",
      {
        builtinGlobals: false,
        hoist: "functions",
        allow: [],
      },
    ],
    "operator-linebreak": [2, "before", { overrides: { "?": "after" } }],
    "import/prefer-default-export": "off",
  },
};
