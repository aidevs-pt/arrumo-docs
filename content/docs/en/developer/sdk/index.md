---

title: "Plugin SDK reference"
description: "The manifest, package and adapter contracts a plugin declares to Arrumo."
---

The [Plugin SDK](https://github.com/aidevs-pt/arrumo-plugin-sdk) holds the versioned JSON schemas, the WIT worlds, the packaging tools and the conformance suite. These pages explain each contract; the schemas are the source of truth. Start with [Write your first plugin](../first-plugin.md).

- [Manifest](manifest.md): identity, settings, introduction, icon and translations.
- [Packages and code](packages.md): ZIP packages, WebAssembly backends, frontend panels and reviewed files.
- [Actions and hooks](actions.md): actions, their forms and places, and hooks that run on events.
- [Provider adapters](adapters.md): transcription, speech, image, video, usage and subtitle translation.
- [Agent providers](agents.md): status checks, structured runs, images, usage and follow-up messages.
- [Motion renderers](motion.md): rendered motion hand-off and the Linux renderer sandbox.

## Document your plugin

Write one guide per task a creator does with the plugin, such as setup or making images, in English, Spanish and Portuguese, with the same pages in each language. Name the app's controls as Arrumo shows them in each language, and say what leaves the creator's computer. Official plugins publish their guides in [Arrumo Docs](https://github.com/aidevs-pt/arrumo-docs) under `content/docs/<lang>/plugins/<plugin-id>/`; other plugins can keep them in their repository as `docs/<lang>/<page>.md` and link them from the README.
