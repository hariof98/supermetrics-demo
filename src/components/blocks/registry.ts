import Hero from "./Hero/Hero.astro";
import Feature from "./Feature/Feature.astro";

export const blockRegistry = {
    hero: Hero,
    feature: Feature,
} as const;
