import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";


export default defineConfig([
  globalIgnores([
    "**/node_modules/",
    "**/dist/",
    "**/prisma/",
    "**/generated/",
  ]),
  { 
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.browser },
    plugins: { js },
    extends: ["js/recommended"]
  },
  tseslint.configs.recommended,
]);