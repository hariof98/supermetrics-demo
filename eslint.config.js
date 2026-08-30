import js from "@eslint/js";
import ts from "typescript-eslint";
import astro from "eslint-plugin-astro";
import prettier from "eslint-config-prettier";

export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    ...astro.configs.recommended,
    prettier,
    {
        files: ["**/*.astro"],
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^Props$" }],
        },
    },
    {
        ignores: ["dist/", ".astro", "node_modules/"],
    },
];
