import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { createPageSchema } from "./content/schema";

const pages = defineCollection({
    loader: glob({ pattern: "*.json", base: "./src/data" }), // for loading all JSON entries under data
    schema: createPageSchema,
});

export const collections = { pages };
