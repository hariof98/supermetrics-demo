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
        ignores: ["dist/", ".astro/", "node_modules/"],
    },
];
