# Project: Personal Technology Knowledge Base

## 1. ROLE AND EXECUTION MODE

Act as a senior frontend architect, UI/UX designer, TypeScript engineer, content-platform architect, accessibility specialist, and web-performance engineer.

Your task is to BUILD a complete, working, production-ready documentation website—not merely provide advice, mockups, pseudocode, or disconnected snippets.

Operate autonomously within the authorized project workspace.

Execution rules:

1. Inspect the existing repository before modifying anything.
2. Identify the framework, dependencies, folder structure, package manager, and existing conventions.
3. Preserve useful existing work. Do not replace an existing application without justification.
4. Create a concise implementation plan and then execute it.
5. Implement features completely, including loading states, empty states, error handling, responsive behavior, and accessibility.
6. Install only necessary dependencies.
7. Run the available type checks, linting, tests, production build, and content validation.
8. Fix errors introduced by your changes and rerun relevant checks.
9. Never claim that a command, test, build, or deployment succeeded unless you actually verified it.
10. Do not stop after generating the project structure. Continue until the working implementation is complete or a genuine blocker requires clarification.
11. Make reasonable engineering decisions without asking about every small detail.
12. Never expose credentials, tokens, secrets, or private environment variables.
13. Do not overwrite user data or perform destructive Git operations without explicit authorization.
14. Do not commit, push, publish, or deploy without authorization.
15. At completion, report implemented features, architecture, changed files, validation results, remaining limitations, and commands to run the project.

## 2. PRODUCT VISION

Build a personal, extensible knowledge base for everything I learn in technology.

The website must support, but not be restricted to:

- Artificial Intelligence and Machine Learning
- Deep Learning, NLP, LLMs, RAG, and Generative AI
- Computer Vision and Object Detection
- Web Development and Full-Stack Engineering
- JavaScript, TypeScript, React, and Next.js
- Node.js, Express, REST APIs, and backend development
- Python, FastAPI, and software engineering
- Data Science, NumPy, Pandas, and visualization
- Mathematics, Linear Algebra, Calculus, and Statistics
- Data Structures and Algorithms
- Operating Systems, Networking, and Computer Science
- Git, GitHub, Linux, Docker, and developer tools
- DevOps, MLOps, cloud computing, and deployment
- Future categories that I may create without changing the application code

This is both a technical documentation website and a personal learning journal.

It should help visitors:

- Discover topics and lessons.
- Navigate hierarchical documentation.
- Search all published content.
- Read technical explanations and tutorials.
- Copy code examples.
- Explore formulas, tables, diagrams, and practical examples.
- Find prerequisites and related lessons.
- Understand what I am learning and what I have documented.

The data model must remain generic enough to accommodate future subjects.

## 3. REQUIRED TECHNOLOGY STACK

Use the following stack unless the existing repository has a compelling, documented reason to use an equivalent.

Core:

- Astro with TypeScript.
- Astro static site generation.
- Tailwind CSS.
- Strict TypeScript configuration.
- Zod for runtime content-schema validation.
- JSON files as the canonical structured content source.
- Markdown or MDX for long-form lesson content when justified.
- Shiki for syntax-highlighted code.
- Pagefind for static full-text search, if compatible with the selected Astro version and routing setup.
- KaTeX for mathematical formulas when required.
- Lucide icons using a compatible Astro integration or lightweight icon components.
- Vitest for unit tests where appropriate.
- Playwright for critical end-to-end tests when practical.

Use current stable, mutually compatible dependency versions at implementation time. Check the existing package manager and lockfile before installing anything.

Prefer native Astro components and HTML over React components. Add client-side JavaScript only for genuinely interactive features.

Do not introduce React, a state-management library, or a server-side API layer unnecessarily.

Avoid runtime database calls for ordinary documentation pages.

## 4. ARCHITECTURE AND DATA STRATEGY

Use a Git-backed, file-based content architecture.

GitHub repository
-> JSON and Markdown source files
-> schema validation
-> content indexing
-> static page generation
-> static search-index generation
-> static hosting/CDN

The production site must not require:

- A continuously running backend server.
- A hosted SQL or NoSQL database.
- A database connection string.
- Runtime API calls to GitHub to render ordinary lessons.
- A paid external search API.

All ordinary published pages must render without a network request to GitHub.

Use build-time imports and validated content registries.

The website must support adding new categories, topics, lessons, and content-section types without rewriting the overall architecture.

Clearly distinguish between:

- Content source: JSON and Markdown files in Git.
- Content index: generated, validated in-memory data during the build.
- Search index: generated static search files.
- User preferences: optional browser-local preferences such as theme.
- Future application database: unnecessary unless future features require user accounts, collaboration, comments, or other persistent server-side state.

Do not use localStorage as the canonical content database.

## 5. REQUIRED DATA DIRECTORY

Create a well-organized data directory similar to:

src/
data/
site.json
categories.json
topics.json
navigation.json
content/
programming/
python.json
javascript.json
web-development/
react.json
nextjs.json
ai-ml/
machine-learning.json
deep-learning.json
tools/
git.json
schemas/
site.schema.ts
category.schema.ts
topic.schema.ts
lesson.schema.ts
section.schema.ts
lib/
content-registry.ts
content-validation.ts
content-query.ts
slug.ts
navigation.ts
search.ts
components/
layouts/
pages/
styles/

Adapt this structure if necessary, but preserve clear separation between content, schemas, rendering, and UI.

## 6. DATA MODEL REQUIREMENTS

Create and enforce typed schemas.

### A. Site configuration

Support:

- title
- description
- author
- site URL
- default language
- default theme
- logo and favicon
- social links
- SEO defaults
- navigation settings
- search settings
- footer configuration

Use a valid, documented placeholder for the canonical production URL until it is configured.

### B. Category

Fields:

- id: unique stable identifier
- title
- description
- slug
- icon
- order
- status
- tags, optional
- metadata, optional

Example:
{
"id": "ai-ml",
"title": "AI & Machine Learning",
"slug": "ai-ml",
"description": "Machine learning, deep learning, and AI systems.",
"icon": "brain",
"order": 1,
"status": "published",
"tags": ["ai", "machine-learning"]
}

### C. Topic

Fields:

- id
- categoryId
- title
- description
- slug
- order
- status
- tags
- optional icon
- optional prerequisites

### D. Lesson

Fields:

- id
- topicId
- title
- description
- slug
- level
- status
- tags
- prerequisites
- relatedLessons
- sections
- sources
- createdAt
- updatedAt
- optional estimatedReadingMinutes
- optional author
- optional version
- optional learningObjectives

Support statuses such as draft, published, and archived.

Only published content should be publicly rendered or indexed by search.

### E. Lesson sections

Use a discriminated union for section types.

Required types:

- markdown
- code
- table
- list
- callout
- image
- formula
- diagram
- video
- example
- quiz
- checklist

Use section-specific schemas rather than one object with dozens of irrelevant optional properties.

Examples:

Code:
{
"id": "python-example",
"type": "code",
"title": "Example",
"language": "python",
"content": "print('Hello, world!')",
"output": "Hello, world!",
"showLineNumbers": true
}

Callout:
{
"id": "important-note",
"type": "callout",
"variant": "warning",
"title": "Important",
"content": "Explain the relevant caveat here."
}

Table:
{
"id": "comparison",
"type": "table",
"title": "Comparison",
"columns": ["Method", "Purpose"],
"rows": [
["Method A", "Purpose A"],
["Method B", "Purpose B"]
]
}

Formula:
{
"id": "equation",
"type": "formula",
"latex": "y = mx + b",
"caption": "Linear equation"
}

The exact schema may improve these examples, but maintain strong validation and predictable rendering.

For diagrams, use a documented, supported representation. Do not treat arbitrary JSON as executable SVG or HTML.

For Markdown, use a safe rendering pipeline. Never execute arbitrary content from a JSON field.

### F. Relationship integrity

Validate:

- Unique category IDs.
- Unique topic IDs.
- Unique lesson IDs.
- Valid category references.
- Valid topic references.
- Valid prerequisite references.
- Valid related-lesson references.
- Valid slugs.
- Valid dates.
- Valid section-specific properties.
- Duplicate routes.
- Invalid image paths.
- Invalid navigation references.

Detect circular prerequisites or related references where they create an actual problem.

Produce actionable validation errors containing the filename, record ID, and field.

Fail the production build for invalid published content or broken published references.

Do not silently discard invalid records.

Support draft content without exposing it publicly.

## 7. CONTENT MANAGEMENT WORKFLOW

I will update the content manually in GitHub.

The workflow must be:

1. Create a new JSON content file or edit an existing one.
2. Validate it locally.
3. Commit and push the change when I choose.
4. Let the hosting platform run the production build.
5. Publish the updated static site.

Provide npm scripts equivalent to:

- npm run dev
- npm run build
- npm run preview
- npm run check
- npm run validate:content
- npm run test
- npm run lint

Ensure every script exists and works, or document any intentional omission.

Create:

- A JSON content template.
- A new-category template.
- A new-topic template.
- A new-lesson template.
- A content authoring guide.
- A troubleshooting guide.

Make the common content-editing workflow straightforward for someone who is comfortable editing JSON.

## 8. ROUTING

Implement clean, stable URLs.

Suggested routes:

/
Home page

/docs/
Documentation landing page

/docs/[category]/
Category overview

/docs/[category]/[topic]/
Topic overview

/docs/[category]/[topic]/[lesson]/
Lesson page

/search/
Search interface, if required by the search integration

/about/
About the knowledge base

/404
Not-found experience

Use Astro's static route generation and getStaticPaths where appropriate.

Generate routes only for valid published content.

Avoid generating duplicate routes.

Provide a sensible redirect or migration strategy if slugs change in the future.

## 9. FRONTEND AND UI/UX

Design a polished, modern developer knowledge base.

The visual design should feel like a professional technical documentation product, not a generic marketing landing page.

Visual direction:

- Minimal, clean, typography-focused design.
- Excellent readability for long technical articles.
- Neutral background and restrained accent colors.
- Light and dark themes.
- Consistent spacing and typography.
- Clear hierarchy for categories, topics, and lessons.
- Responsive layouts.
- Subtle borders and restrained use of shadows.
- Accessible focus indicators.
- Avoid excessive glassmorphism, gradients, animated backgrounds, and decorative effects that compromise readability.

### Desktop layout

Implement:

- Header with logo, navigation, theme toggle, and search trigger.
- Persistent left sidebar with category and topic navigation.
- Main article content with a readable maximum width.
- Optional right-hand table of contents on long pages.
- Breadcrumb navigation.
- Previous and next lesson links.
- Related lessons.
- Footer.

The sidebar must support nested categories and topics, active-page highlighting, expand/collapse controls, and keyboard navigation.

### Mobile layout

Implement:

- Responsive header.
- Search accessible without excessive tapping.
- Collapsible sidebar or accessible navigation drawer.
- Readable code blocks with horizontal overflow where necessary.
- Tables that remain usable on narrow screens.
- Touch-friendly controls.
- No unintended horizontal page overflow.
- Correct handling of long URLs and code lines.

### Home page

Include:

- A concise introduction.
- Global documentation search.
- Category cards.
- Recently updated lessons based on content metadata.
- Recently added topics or featured content.
- Useful quick links.
- A small statistics section derived from actual content counts.
- Clear empty states when a category has no published lessons.

Do not hardcode statistics that can be computed from the content registry.

### Article pages

Include:

- Breadcrumbs.
- Article title and description.
- Reading time when available.
- Last updated date.
- Table of contents generated from headings.
- Proper heading hierarchy.
- Syntax-highlighted code.
- Copy-code buttons.
- Optional line numbers.
- Tables and callouts.
- Mathematical formula rendering.
- Related lessons and prerequisites.
- Previous and next navigation.
- Source references.
- A clear article reading width.

Ensure that the sidebar and article table of contents reflect the actual document structure.

## 10. SEARCH

Implement static full-text search.

Preferred implementation: Pagefind if it integrates cleanly with the chosen Astro version.

Search must:

- Work without a custom search server.
- Index published pages only.
- Support title and body-text searches.
- Display meaningful result titles and excerpts.
- Link directly to the relevant page.
- Show a clear no-results state.
- Support keyboard use.
- Debounce typing where applicable.
- Avoid loading a large content JSON file just to perform a search.
- Exclude drafts and private content.
- Work in the production build, not only the development server.

Provide an accessible search dialog or dedicated search page.

If a dependency is incompatible, choose a documented alternative instead of shipping broken search.

## 11. PERFORMANCE REQUIREMENTS

Performance is a core requirement.

Targets under appropriate test conditions:

- Lighthouse Performance: aim for 95+ on representative static pages.
- Accessibility: aim for 95+.
- Best Practices: aim for 95+.
- SEO: aim for 95+.
- CLS: target 0.1 or lower.
- LCP: target 2.5 seconds or lower.
- INP: target 200 milliseconds or lower.

These are targets, not guaranteed results; verify them using real measurements.

Engineering requirements:

- Generate static HTML for published documentation pages.
- Minimize client-side JavaScript.
- Avoid unnecessary hydration.
- Avoid heavy component libraries.
- Use system fonts or carefully optimized local fonts.
- Set image dimensions or aspect ratios to reduce layout shifts.
- Lazy-load noncritical below-the-fold images.
- Avoid unnecessary third-party scripts.
- Generate search indexes during the build.
- Prevent large JSON bundles from being shipped to every visitor.
- Keep content validation and registry logic on the build side wherever possible.
- Use caching and CDN-friendly static assets.
- Test both mobile and desktop layouts.
- Measure rather than guess about performance bottlenecks.

Do not add animation libraries without a concrete requirement.

## 12. SEO AND ACCESSIBILITY

Implement:

- Page-specific titles and descriptions.
- Canonical URL support.
- Open Graph metadata.
- Appropriate social-sharing metadata.
- Sitemap.
- robots.txt.
- Semantic HTML.
- Accessible landmarks.
- Keyboard-accessible navigation.
- Visible focus states.
- Sufficient color contrast.
- Reduced-motion support.
- Accessible theme and search controls.
- Descriptive image alternative text.
- Meaningful link text.
- Valid heading hierarchy.
- Appropriate structured data only when its content and schema are accurate.

Do not publish placeholder canonical URLs or fake metadata as real production values.

Avoid indexing drafts, internal routes, or search-result URLs if they should not appear in search engines.

## 13. SECURITY AND CONTENT SAFETY

Treat JSON and Markdown content as data, never as executable code.

Requirements:

- Validate external URLs before rendering links or embeds.
- Prevent unsafe HTML injection.
- Sanitize any permitted HTML.
- Do not execute scripts from content.
- Avoid dangerous dynamic HTML rendering.
- Use a trusted Markdown renderer and a documented sanitization policy.
- Do not allow arbitrary content to create unrestricted embeds.
- Never store secrets in JSON or client-side environment variables.
- Keep private or draft content out of public generated pages and search indexes.

If rich embeds are supported, allow only explicitly approved providers.

## 14. THEME AND USER PREFERENCES

Implement light, dark, and system theme modes.

Requirements:

- Respect the system preference by default.
- Avoid a visible theme flash when practical.
- Persist the user's theme preference locally.
- Keep content independent of theme state.
- Maintain sufficient contrast in both themes.
- Ensure code blocks remain readable.

Do not use localStorage for lesson content, search data, or the canonical configuration.

## 15. SAMPLE CONTENT

Create realistic, concise sample content to demonstrate all major content renderers.

Include at least:

- Python fundamentals.
- Python regular expressions.
- JavaScript fundamentals.
- Next.js fundamentals.
- Machine learning fundamentals.
- K-nearest neighbors.
- Neural network fundamentals.
- Git fundamentals.
- Linear algebra fundamentals.

Include a mixture of:

- Markdown.
- Code blocks.
- Code output.
- Tables.
- Callouts.
- Formulas.
- Examples.
- Related lessons.

Ensure all sample IDs, routes, references, and schema properties are valid.

Do not fabricate academic citations or present uncertain technical claims as verified facts.

Clearly identify sample material as documentation content, not as an actual personal achievement or credential.

## 16. TESTING

Add automated checks for:

Content:

- Schema validation.
- Unique IDs.
- Relationship integrity.
- Route collisions.
- Invalid published content.
- Missing local assets.

Rendering:

- Category page generation.
- Topic page generation.
- Lesson page generation.
- Code blocks and tables.
- Empty states.
- Unknown routes.

Interaction:

- Sidebar navigation.
- Theme toggle.
- Search.
- Copy-code controls.
- Mobile navigation.
- Previous/next lesson navigation.

Quality:

- TypeScript checks.
- Linting.
- Production build.
- Basic accessibility checks.
- Critical responsive behavior.

Do not claim that Lighthouse or browser-based tests were run unless the appropriate tools were available and the tests actually ran.

## 17. DOCUMENTATION DELIVERABLES

Create a useful README.md containing:

- Project purpose.
- Technology stack.
- Prerequisites.
- Installation.
- Development commands.
- Production build commands.
- Deployment instructions.
- Repository structure.
- Content architecture.
- JSON schemas.
- How to add a category.
- How to add a topic.
- How to add a lesson.
- How to link related lessons.
- How to add images and diagrams.
- How search indexing works.
- How to diagnose schema errors.
- How to update and publish through GitHub.

Also create a dedicated CONTENT_GUIDE.md with practical examples.

Document the exact hosting assumptions and build settings.

## 18. DEPLOYMENT

Prepare the project for GitHub-based deployment.

Prefer Cloudflare Pages or another compatible static hosting provider.

The deployment process should:

- Install dependencies using the committed lockfile.
- Validate the content.
- Run checks and tests as appropriate.
- Build the static website.
- Generate the search index.
- Publish the generated output directory.

Keep the hosting configuration explicit and documented.

Do not create accounts, expose tokens, change DNS, or deploy publicly without authorization.

If GitHub Pages is selected, handle base paths and asset URLs correctly.

## 19. IMPLEMENTATION ORDER

Follow this sequence:

Phase 1: Inspect the repository and establish the architecture.

Phase 2: Define the content schemas and sample JSON files.

Phase 3: Implement validation and the content registry.

Phase 4: Implement static routing and page generation.

Phase 5: Build the shared layout, header, sidebar, footer, and responsive navigation.

Phase 6: Build reusable content renderers.

Phase 7: Implement search, theme switching, table of contents, and code-copy controls.

Phase 8: Implement metadata, sitemap, accessibility, and performance optimizations.

Phase 9: Add tests and documentation.

Phase 10: Run the checks, fix defects, and verify the production build.

Phase 11: Provide a concise handover report.

If the repository is already an existing application, adapt this sequence without destroying working features.

## 20. ACCEPTANCE CRITERIA

The project is complete only when:

1. The application starts locally.
2. The production build succeeds.
3. Content schemas validate all published sample lessons.
4. New categories and topics can be added through JSON.
5. New lessons can be added without modifying frontend components.
6. Published lessons generate stable, navigable pages.
7. The sidebar reflects the content hierarchy.
8. Search works in the production build.
9. Code blocks support syntax highlighting and copying.
10. The website works on mobile and desktop.
11. Light and dark themes work.
12. SEO metadata and sitemap generation are configured.
13. Invalid content produces actionable errors.
14. Draft content is excluded from public output.
15. The README and content authoring guide are complete.
16. Relevant automated checks have been run and their results reported.
17. No unnecessary backend or hosted database is required.
18. No destructive repository changes have been made without authorization.

## 21. FINAL HANDOVER

After implementation, report:

- Architecture decisions.
- Final folder structure.
- Important files created or modified.
- Dependencies added and their purpose.
- JSON content schema summary.
- Commands for development and production.
- How to add new categories, topics, and lessons.
- Test and build results.
- Performance checks actually performed.
- Deployment configuration and remaining manual steps.
- Known limitations and recommended next steps.

Prioritize a working, maintainable implementation over unnecessary complexity.

Begin by inspecting the repository, then execute the implementation plan.
