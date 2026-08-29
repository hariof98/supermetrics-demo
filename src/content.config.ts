import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { createPageSchema } from "./content/schema";

const pages = defineCollection({
    loader: file("src/data/homepage.json"),
    schema: ({ image }) => createPageSchema({ image }),
});

export const collections = { pages };
