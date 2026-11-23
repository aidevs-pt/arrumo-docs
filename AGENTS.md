# Arrumo Docs

This site is built with [Fumadocs](https://fumadocs.dev) on Next.js as a static export. Fumadocs' APIs may differ from your training data; check https://fumadocs.dev/llms.txt before changing the framework code.

- Write every page in English, Spanish and Portuguese under `content/docs/<lang>/`, and run `pnpm check:locales`.
- Link pages with relative file paths so the reader stays in their language.
- Name the app's real controls in each language, as the editor's `locales/*.json` spells them.
- Keep the site static: no proxy, rewrites or server routes. aidevs.pt serves it, so the export mirrors its paths: pages under `app/[lang]/tools/arrumo/docs` (aidevs.pt drops the `en` prefix) and everything else under `/tools/arrumo/static`. Use `staticRoute` and `localized()` from `lib/shared.ts` for URLs; never root-absolute paths of your own.
- Store screenshots and other media under `public/tools/arrumo/static/media/` through Git LFS.
- Keep the consent banner on the aidevs.pt contract in `lib/consent.ts`.
- Verify with `pnpm lint`, `pnpm types:check` and `pnpm build`.
