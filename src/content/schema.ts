import type { SchemaContext } from "astro:content";
import { z } from "astro/zod";

export const createPageSchema = ({ image }: Pick<SchemaContext, "image">) => {
    /* atoms */
    const cta = z.object({
        text: z.string().min(1),
        href: z.string().min(1),
        variant: z.enum(["fill", "outline", "text"]).optional(),
        tone: z.enum(["default", "green", "purple"]).optional(),
        external: z.boolean().optional(),
        label: z.string().min(1).optional(),
    });

    const link = z.object({
        text: z.string().min(1),
        href: z.string().min(1),
        external: z.boolean().optional(),
    });

    const imageSchema = z.object({
        src: image(),
        alt: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
        loading: z.enum(["lazy", "eager"]).optional(),
    });
    /* atoms */

    /* blocks */
    const hero = z.object({
        type: z.literal("hero"),
        layout: z.enum(["split", "centered"]).default("centered"),
        heading: z.string().min(1),
        description: z.string(),
        image: imageSchema.optional(),
        ctas: z.array(cta).optional(),
    });

    const feature = z.object({
        type: z.literal("feature"),
        imagePosition: z.enum(["left", "right"]).default("left"),
        heading: z.string().min(1),
        description: z.string(),
        image: imageSchema.optional(),
        links: z.array(link).optional(),
    });

    const action = z.object({
        type: z.literal("action"),
        heading: z.string().min(1),
        description: z.string(),
        ctas: z.array(cta).optional(),
    });

    const testimonial = z.object({
        type: z.literal("testimonial"),
        heading: z.string().min(1),
        description: z.string(),
        caption: z.string(),
    });
    /* blocks */

    const blockSchema = z.discriminatedUnion("type", [hero, feature, action, testimonial]);

    return z.object({
        title: z.string().min(1), // title & description are page metadata for SEO
        description: z.string().min(1),
        blocks: z.array(blockSchema),
    });
};

export type Page = z.infer<ReturnType<typeof createPageSchema>>;
export type Block = Page["blocks"][number];
