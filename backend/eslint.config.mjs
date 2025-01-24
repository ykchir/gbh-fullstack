import { fileURLToPath } from "url";
import { dirname } from "path";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jestPlugin from "eslint-plugin-jest";
import eslintPluginPrettier from "eslint-plugin-prettier";
import sharedConfig from "../shared/config/eslint.shared.config.mjs";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default [
  ...sharedConfig,
  {
    files: ["src/**/*.ts"],
    ignores: ["dist/**", "node_modules/**", "eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir,
      },
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      jest: jestPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...tsPlugin.configs["recommended-type-checked"].rules,
      ...jestPlugin.configs.recommended.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
];
