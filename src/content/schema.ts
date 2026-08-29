import type { SchemaContext } from "astro:content";
import { z } from "astro/zod";

export const createPageSchema = ({ image }: Pick<SchemaContext, "image">) => {
    const cta = z.object({
        text: z.string().min(1),
        href: z.string().min(1),
        variant: z.enum(["fill", "outline", "text"]).optional(),
        tone: z.enum(["default", "green", "purple"]).optional(),
        external: z.boolean().optional(),
        label: z.string().min(1).optional(),
    });

    const imageSchema = z.object({
        src: image(),
        alt: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
        loading: z.enum(["lazy", "eager"]).optional(),
    });

    const hero = z.object({
        type: z.literal("hero"),
        layout: z.enum(["split", "centered"]).default("centered"),
        heading: z.string().min(1),
        description: z.string().optional(),
        image: imageSchema.optional(),
        ctas: z.array(cta).optional(),
    });

    const blockSchema = z.discriminatedUnion("type", [hero]);

    return z.object({
        title: z.string().min(1), // title & description are page metadata for SEO
        description: z.string().min(1),
        blocks: z.array(blockSchema),
    });
};

export type Page = ReturnType<typeof createPageSchema>["_output"];
export type Block = Page["blocks"][number];
