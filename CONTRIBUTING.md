# Contributing

Thank you for helping improve the Arrumo AI Video Editor documentation. Bug reports, fixes, translations, documentation and
ideas are all welcome. You can write in English, Spanish or Portuguese.

## Before you start

- **Found a security problem?** Don't open an issue. Follow [SECURITY.md](SECURITY.md).
- **Questions and ideas** go to [Discussions](https://github.com/aidevs-pt/arrumo-video-editor/discussions). **Bugs** go to this repository's
  issues, one per problem.
- **For anything larger than a small fix,** open an issue first so we can agree on the approach
  before you spend time on it.
- Everyone taking part follows our [Code of Conduct](CODE_OF_CONDUCT.md).

## Develop

Install Node and the pnpm version in `package.json`, and [Git LFS](https://git-lfs.com/)
before cloning (screenshots are stored with it).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Run the same checks as CI before opening a pull request:

```sh
pnpm check:locales
pnpm lint
pnpm types:check
pnpm build
```

## Guidelines

- **Every page exists in English, Spanish and Portuguese** with the same file name
  (`content/docs/<language>/`). If you can only write one language, say so in the pull request
  and we will translate it.
- **Link pages with relative file paths** (`../plugins/index.md`) so links stay in the reader's
  language.
- **Screenshots are WebP** under `public/tools/arrumo/static/media/`, taken from the real app.
- **Small, focused commits** with [Conventional Commits](https://www.conventionalcommits.org/)
  messages, such as `fix(render): keep the last frame when a clip ends early`.
- **Tests for behaviour changes.** Bug fixes include a test that fails without the fix.
- **Never commit credentials, footage, exports or machine-specific settings.**

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Make your change, with tests and documentation.
3. Open a pull request and fill in the template. CI must pass.
4. The first time you contribute, a bot asks you to sign the
   [Contributor License Agreement](CLA.md) by replying with a comment. You sign it once per
   repository.
5. A maintainer reviews the change. We squash-merge, so the pull request title becomes the commit
   message.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE) and owned by
DEVS AI Unipessoal LDA. The [CLA](CLA.md) lets DEVS AI distribute your contribution under this
license and under other terms in the future; you keep the copyright to your work.
