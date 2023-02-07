module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "plugin:@typescript-eslint/recommended", "plugin:import/typescript", "prettier"], // Prettier must be last in the array to override other configs
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  ignorePatterns: ["src/react-app-env.d.ts"],
  rules: {
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "react/react-in-jsx-scope": "off",
    "linebreak-style": 0,
    "max-lines": ["error", 400],
    "complexity": ["error", 20],
    "max-classes-per-file": ["error", 20],
    "import/no-cycle": [
      "error",
      {
        // "ignoreExternal": true // prevent the cycle detection to expand to external modules
      }
    ]
    // Extras
    // "@typescript-eslint/explicit-function-return-type": [
    //   "error",
    //   {
    //     allowExpressions: true,
    //   },
    // ],
    // "max-len": ["warn", { code: 80 }],
    // "react-hooks/rules-of-hooks": "error",
    // "react-hooks/exhaustive-deps": "warn",
    // "import/prefer-default-export": "off",
    // "react/prop-types": "off",
  },
};
