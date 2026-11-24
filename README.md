<p align="center">
  <img src="public/tools/arrumo/static/icon.svg" width="88" height="88" alt="">
</p>

<h1 align="center">Arrumo AI Video Editor documentation</h1>

<p align="center">Guides, a tutorial and the full developer reference for <b>Arrumo AI Video Editor</b>, in English, Spanish and Portuguese.</p>

<p align="center">
  <a href="LICENSE"><img alt="License: AGPL-3.0" src="https://img.shields.io/badge/license-AGPL--3.0-2337B4"></a>
  <img alt="English, Spanish and Portuguese" src="https://img.shields.io/badge/languages-EN%20%C2%B7%20ES%20%C2%B7%20PT-111">
  <img alt="Built with Fumadocs" src="https://img.shields.io/badge/built%20with-Fumadocs-111">
</p>

<p align="center">
  <a href="https://www.aidevs.pt/tools/arrumo/docs"><b>Read the docs</b></a> · <a href="https://www.aidevs.pt/tools/arrumo/docs/user/tutorials/website-to-video">Tutorial</a> · <a href="https://www.aidevs.pt/tools/arrumo/docs/developer">Developers</a> · <a href="https://github.com/aidevs-pt/arrumo-video-editor">The editor</a>
</p>

[![From brief to finished video, made entirely in Arrumo](.github/media/from-brief-to-finished-video.gif)](https://youtu.be/ldBiG89NOvA)

The documentation covers [Arrumo AI Video Editor](https://github.com/aidevs-pt/arrumo-video-editor), the free, open-source desktop app where an AI agent writes, designs, voices and cuts videos and you review each step. It is published at [aidevs.pt/tools/arrumo/docs](https://www.aidevs.pt/tools/arrumo/docs), with every page in English, Spanish and Portuguese, real app screenshots, and the showcase videos made with Arrumo.

## Content

Pages live in `content/docs/<language>/`, one folder per language with the same files in each:

- `user/`: guides for creators, with step-by-step walkthroughs in `user/tutorials/`.
- `developer/`: connecting through the CLI, MCP and A2A, the agent skill and the Plugin SDK.
- `plugins/<plugin-id>/`: one folder per official plugin.

`meta.json` files order the sidebar; the section folders are sidebar roots. Link to other pages with relative file paths (`../plugins/index.mdx`) so links stay in the reader's language. Spanish says "complementos" for plugins; Portuguese says "plugins".

`pnpm check:locales` fails when a page or folder is missing from a language.

Pages are MDX. Besides Markdown, every page can use these components without importing them: `Cards`/`Card`, `Callout`, `Steps`/`Step`, `Tabs`/`Tab`, `Accordions`/`Accordion`, `TypeTable`, `Files`/`Folder`/`File` and `Icon` (a [Lucide](https://lucide.dev/icons) icon by name, such as `<Icon name="Mic" />`). Pages and folders name their sidebar icon the same way, with `icon:` in the front matter or `meta.json`. Images zoom when clicked, except video thumbnails, which open the video. Use components where they help a reader, and keep reference data that agents need, such as settings and limits, readable as text.

Screenshots and video thumbnails live in `public/tools/arrumo/static/media/` and are stored with Git LFS (run `git lfs install` before cloning). Use the same file for all three languages unless the screenshot is about wording. Reference them from Markdown as `/tools/arrumo/static/media/...`. Link a video by its thumbnail: `[![Title](/tools/arrumo/static/media/videos/<name>.webp)](https://youtu.be/<id>)`; a play badge marks it.

## For AI agents

Each language has `llms.txt` and `llms-full.txt` (`/tools/arrumo/llms.txt`, `/pt/tools/arrumo/llms.txt`, …), each section has its own `llms-full.txt`, and every page is available as Markdown at its own address plus `.md` (`/tools/arrumo/docs/user/install.md`; the docs home is `/tools/arrumo/docs/index.md`). `scripts/markdown-pages.mjs` puts those files beside the pages after `next build`. Each page links its Markdown version and has **Copy Markdown** and **Open** actions.

## Build and hosting

```sh
pnpm install
pnpm dev            # http://localhost:3000/en/tools/arrumo/docs
pnpm build          # static site in out/
```

The site is a static export with static search. It is served by [aidevs.pt](https://www.aidevs.pt/tools/arrumo/docs) under the website's own language paths: English at `/tools/arrumo/docs/…`, Spanish at `/es/tools/arrumo/docs/…` and Portuguese at `/pt/tools/arrumo/docs/…`. The export mirrors them (English under `out/en/`), scripts, search, Markdown and images live under `/tools/arrumo/static/`, and `out/sitemap.xml` lists every page with its translations. Deploy `out/` to any static host with clean URLs (see `vercel.json`) and point the website's `ARRUMO_DOCS_ORIGIN` at it.

The pages ask for and honour the same cookie choice as aidevs.pt, and load its analytics only when `NEXT_PUBLIC_AHREFS_KEY` and `NEXT_PUBLIC_OPENAI_PIXEL_ID` are set at build time.

## Contributing

Contributions are welcome: read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md). Report security problems privately as described in [SECURITY.md](SECURITY.md).

## License

Copyright © 2026 DEVS.AI UNIPESSOAL LDA. Licensed under the [GNU Affero General Public License v3.0](LICENSE). Plugin icons and the brands they show belong to their owners. Built by [DEVS AI](https://aidevs.pt), who make custom AI solutions for companies.
