## Focus

I built the entire setup with an atomic-first approach, because with that approach the codebase scales along with the evolving design system that is
common in a marketing website. It makes it easier to change the design and visual elements without heavy refactoring or losing out on the
architectural and coding standards of the codebase.

With the given time constraint, I felt that going with this approach would give me a better foundation and scalability, and also that once I have
these atoms in place I can build any number of blocks around them easily.

Atoms built:

1. Text
2. Link
3. Button
4. Image
5. Container

These are the basic elements around which any pages or components are developed. They are built with good SEO and accessibility standards in place.

With these atoms in place, we can spin up the different component blocks that are required to create the pages.

Blocks:

1. Hero
2. Feature
3. Action
4. Testimonial

No custom elements are introduced, except some wrapper elements and scoped CSS to achieve the design.

For this demonstration I have chosen to create the Homepage, Product and Pricing pages, which contain different sections built from these blocks.

## Foundation decisions

**A single unidirectional stream for page creation.** With this, the page creation process is the same whether a page comes from a CMS, is created
standalone, or is created by an AI agent.

The stream starts from defining the content types and rules in the schema with Zod. Once defined, it is wired up at the block level, enabling the
blocks to accept the props, and accordingly the JSON data structure can be created to fit the pattern. In a real scenario, the schema can be
configured with the fields that exist in the real CMS.

To mimic the CMS behaviour, I have a mock JSON data structure in place which provides the content for these pages.

**One slug file as a template.** I have used one slug file, which is what is needed to create the multiple different pages we would fetch from a CMS.
That one page is a template that ensures we can handle any number of pages created by marketers in the CMS, from the codebase, and from AI agents in
parallel. This ensures scalability and coherency when it comes to building with a mixed team and AI agents at the same time.

**Content collections configuration.** I have created a configuration for content collections, which Astro looks up for collecting the page data we
have. Pages are picked up automatically, so we don't need to manually register any page we create, which is useful for pages being generated from
different streams.

**Astro over Next.js.** I have used Astro over my preferred choice of Next.js, since supermetrics.com is built with Astro. I had evaluated Astro
during a framework migration at Chargebee but had not shipped with it, so this gave me a chance to go deeper into the framework.

**Fast everywhere, and the freshness side of it.** The site is static, so it's fast everywhere by default — no client JavaScript, images optimised at
build, fonts preloaded. The freshness side is the other half of that requirement. With mock JSON there's no gap between publishing and seeing the
change, because the content lives in the repo. With a real CMS there would be, since a publish doesn't trigger a build.

The foundation for closing that is already here: content is fully decoupled from code, and the rendering strategy is declared per route. What I'd add
next is a webhook from the CMS to trigger rebuilds on publish, incremental builds so the time doesn't grow with the page count, and on-demand
rendering for draft content so editors see their changes immediately while production stays static.

**Tooling for code standards.** I have configured tools like husky, ESLint and Prettier to maintain the code standards. Since the codebase can be
accessed by fellow peers and agents, having these tools ensures that the proper props, conventions and formatting are all followed, **to create a
codebase that belongs to Supermetrics and not to the individual developers or agents.**

The build command pre-runs the checking from Astro, which throws an error and stops the build process if any of the data is missing or mismatching in
the pipeline. Only after fixing it can we proceed further. Husky prevents committing the code if the formatting is wrong or any code-level
discrepancies or issues are found. This is a good founding setup that aligns the team on a single path even if the codebase and website scales
massively.

**A script for creating new blocks.** I have also configured a custom script that can be used to create a new block without manual operation. When the
script is executed with a name, a new block is created with a basic set of atoms.

I deliberately stopped short of automating the registry and schema entries. That would require pattern matching and regex operations on the source
files, which becomes very limiting when the base structure of the blocks or the registry changes in the future. Instead the script prints the exact
code and the file it belongs in. This is useful for both humans and AI agents working on the codebase, since it creates the necessary scaffold and
tells you where the remaining pieces go, so errors in the process are avoided.

**AGENTS.md.** This file has the detailed context about the entire code structure, architecture and tooling used. With these instructions an AI agent
can create the blocks and pages we want with minimal or no additional context.

To improve the accuracy of the agentic workflow, I have added re-prompting to the context file. With that in place, once the agent has created all the
required files it revalidates its own work against the given context to fix any issues or gaps.

## What's left

With more time I would have focused on:

- Closing the freshness gap described above: webhook-triggered rebuilds, incremental builds, and on-demand rendering for draft content.
- Tests: The standard here is enforced by Zod at the content boundary, TypeScript in the build, and lint on commit, which covers the failure modes
  that actually occur in this codebase. With more time, setting up testing will be a priority.
- More blocks that can be used to create the other page types common on a marketing website: a carousel for multiple testimonials, accordions for
  FAQs, an optimised way to handle forms.
- A better colour palette and an overall better visual system in place.
- Scalable integrations for third-party scripts.
- An Extend, Reuse and Build framework, which lets AI agents make a decision during the page creation process when there are new designs. It helps
  maintain codebase quality and standards while achieving the necessary design without compromise.

## Working with AI

Initially I set up the Claude models with OpenRouter - Haiku as the lower-end model for content creation and basic styling, and Sonnet for refactoring
and multi-file changes. Claude didn't work properly through OpenRouter, and that resulted in extensive execution time. I hit around six minutes on a
single file and it consumed two to three dollars for very little in return.

So I switched to OpenAI models, which worked properly. GPT-5 Nano was poor at understanding context and performing basic tasks, so I used GPT-5 Mini
for the lower-level work instead. GPT-5.4 became my main model of choice, since it produced much better agentic results without consuming a lot of
tokens or needing re-prompting.

Total spend currently stands around $17 of the $50 provided.

I also used this to test AGENTS.md itself. Once it was written, I asked an agent to create a new block without pointing it to the file or giving any
other context. It found the file, ran the scaffold script, and built the block from the existing atoms. That was my check that the context file
actually works.
