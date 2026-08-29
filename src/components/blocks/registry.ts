import Hero from "./Hero/Hero.astro";
import Feature from "./Feature/Feature.astro";
import Action from "./Action/Action.astro";
import Testimonial from "./Testimonial/Testimonial.astro";

export const blockRegistry = {
    hero: Hero,
    feature: Feature,
    action: Action,
    testimonial: Testimonial,
} as const;
