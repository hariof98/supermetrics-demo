import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [, , rawName] = process.argv;

function fail(message: string): never {
    console.error(`Error: ${message}`);
    process.exit(1);
}

function toPascalCase(value: string): string {
    return value
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join("");
}

function toCamelCase(value: string): string {
    const pascal = toPascalCase(value);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

if (!rawName) {
    fail("Missing block name. Usage: npm run new:block <name>");
}

if (!/^[a-z][a-z0-9]*(?:[-_][a-z0-9]+)*$/i.test(rawName)) {
    fail("Invalid block name. Use letters, numbers, hyphens, or underscores, and start with a letter.");
}

const pascalName = toPascalCase(rawName);
const blockType = toCamelCase(rawName);

const rootDir = process.cwd();
const blockDir = path.join(rootDir, "src", "components", "blocks", pascalName);
const componentPath = path.join(blockDir, `${pascalName}.astro`);

const componentSource = `---
import Container from "../../atoms/Container/Container.astro";
import Text from "../../atoms/Text/Text.astro";
import type { Block } from "../../../content/schema";

type Props = Extract<Block, { type: "${blockType}" }>;

const { heading, description } = Astro.props;
---

<section class="${blockType}">
    <Container>
        <div class="${blockType}-content">
            <Text as="h2" variant="heading">{heading}</Text>

            <Text variant="body">{description}</Text>
        </div>
    </Container>
</section>

<style>
    .${blockType} {
        padding-block: var(--spacing-section);
    }

    .${blockType}-content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        max-width: 40rem;
    }
</style>
`;

try {
    await mkdir(blockDir, { recursive: false });
    await writeFile(componentPath, componentSource, "utf8");
} catch (error) {
    if (error && typeof error === "object" && "code" in error) {
        if (error.code === "EEXIST") {
            fail(`Block "${pascalName}" already exists at ${componentPath}`);
        }
        if (error.code === "ENOENT") {
            fail(`Could not create ${componentPath}. Expected the project structure to already exist.`);
        }
    }
    throw error;
}

console.log(`
Created ${path.relative(rootDir, componentPath)}

1. Add to src/components/blocks/registry.ts

   import ${pascalName} from "./${pascalName}/${pascalName}.astro";

   ${blockType}: ${pascalName},

2. Add to src/content/schema.ts

   const ${blockType} = z.object({
       type: z.literal("${blockType}"),
       heading: z.string().min(1),
       description: z.string(),
   });

   Then add ${blockType} to the discriminatedUnion array.

3. Example block JSON

   {
       "type": "${blockType}",
       "heading": "Add a ${pascalName} heading",
       "description": "Add a short supporting description for this block."
   }

Compose from atoms only. No raw h1, p, a or img.
`);
