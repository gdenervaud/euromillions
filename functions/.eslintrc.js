module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parser: "babel-eslint",
  extends: ["standard", "standard-jsx", "standard-react"],
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true,
  },
  rules: {
    indent: [
      "warn",
      2,
    ],
    quotes: [
      "warn",
      "double",
    ],
    semi: [
      "error",
      "always",
    ],
    curly: [
      "error",
      "all",
    ],
    strict: 0,
  },
};
