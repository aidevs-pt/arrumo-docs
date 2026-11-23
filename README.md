# Arrumo Docs

User, developer and official plugin documentation for [Arrumo](https://github.com/aidevs-pt/arrumo-video-editor), the desktop video editor where an AI agent drafts, cuts and renders videos while you review each step. Built with [Fumadocs](https://fumadocs.dev) on Next.js as a static site, in English, Spanish and Portuguese.

Arrumo is made by DEVS AI Unipessoal LDA. Need a custom AI solution? Visit [aidevs.pt](https://aidevs.pt).

## Content

Pages live in `content/docs/<language>/`, one folder per language with the same files in each:

- `user/`: guides for creators.
- `developer/`: connecting through the CLI, MCP and A2A, the agent skill and the Plugin SDK.
- `plugins/<plugin-id>/`: one folder per official plugin.

`meta.json` files order the sidebar; the section folders are sidebar roots. Link to other pages with relative file paths (`../plugins/index.md`) so links stay in the reader's language. Spanish says "complementos" for plugins; Portuguese says "plugins".

`pnpm check:locales` fails when a page or folder is missing from a language.

## For AI agents

Each language has `llms.txt` and `llms-full.txt` (`/tools/arrumo/llms.txt`, `/pt/tools/arrumo/llms.txt`, …), and every page is available as Markdown under `/tools/arrumo/static/md/<page path>.md`. Each page links its Markdown version and has **Copy Markdown** and **Open** actions.

## Build and hosting

```sh
pnpm install
pnpm dev            # http://localhost:3000/en/tools/arrumo/docs
pnpm build          # static site in out/
```

The site is a static export with static search. It is served by [aidevs.pt](https://www.aidevs.pt/tools/arrumo/docs) under the website's own language paths: English at `/tools/arrumo/docs/…`, Spanish at `/es/tools/arrumo/docs/…` and Portuguese at `/pt/tools/arrumo/docs/…`. The export mirrors them (English under `out/en/`), scripts, search, Markdown and images live under `/tools/arrumo/static/`, and `out/sitemap.xml` lists every page with its translations. Deploy `out/` to any static host with clean URLs (see `vercel.json`) and point the website's `ARRUMO_DOCS_ORIGIN` at it.

The pages ask for and honour the same cookie choice as aidevs.pt, and load its analytics only when `NEXT_PUBLIC_AHREFS_KEY` and `NEXT_PUBLIC_OPENAI_PIXEL_ID` are set at build time.

## License

[AGPL-3.0](LICENSE). Plugin icons in the docs belong to their owners.
