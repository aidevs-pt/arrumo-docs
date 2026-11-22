# Arrumo Docs

This site is built with [Fumadocs](https://fumadocs.dev) on Next.js as a static export. Fumadocs' APIs may differ from your training data; check https://fumadocs.dev/llms.txt before changing the framework code.

- Write every page in English, Spanish and Portuguese under `content/docs/<lang>/`, and run `pnpm check:locales`.
- Link pages with relative file paths so the reader stays in their language.
- Name the app's real controls in each language, as the editor's `locales/*.json` spells them.
- Keep the site static: no proxy, rewrites or server routes. Prefix fetched URLs with `NEXT_PUBLIC_BASE_PATH`.
- Verify with `pnpm lint`, `pnpm types:check` and `pnpm build`.
