module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ["plugin:@shopify/node"],
  overrides: [
    {
      env: {
        node: true
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    "no-unused-vars": ["error", { vars: "all", ignoreRestSiblings: true }]
  }
};
