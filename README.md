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

The build writes `llms.txt` and `llms-full.txt` for all languages at the root, the same per language at `/<lang>/llms.txt`, and every page as Markdown under `/llms.mdx/<lang>/docs/<page>.md`. Each page links its Markdown version and has **Copy Markdown** and **Open** actions.

## Build

```sh
pnpm install
pnpm dev            # http://localhost:3000/en
pnpm build          # static site in out/
```

The site is a static export with static search, so any file host can serve `out/`. To serve it below a path, build with `NEXT_PUBLIC_BASE_PATH=/docs-path pnpm build`. The opening page sends readers to their browser's language.

The final address under aidevs.pt is not decided yet; until then, repositories link to this repository.

## License

[AGPL-3.0](LICENSE). Plugin icons in the docs belong to their owners.
