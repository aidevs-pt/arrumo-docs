---

title: "Manifest"
description: "Identity, settings, introduction, icon and translations."
---

## Draft manifest

[manifest.schema.json](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/manifest.schema.json) defines plugin identity and capability metadata. See the [transcription example](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/examples/transcription.json).

Capability declarations describe what a plugin offers. The editor validates the package and applies scope and grants when a supported runtime or adapter executes a capability.

## Settings declarations

Manifest schema v2 can include up to 64 entries in `settings`. Give each entry a unique plugin-local `id`, a `label` and `description`, a `kind` of `string`, `boolean`, `integer`, or `secret`, a `scope` of `app` or `workspace`, and a boolean `required` flag. An omitted settings array is valid. SDK v1 remains readable by current hosts and has no settings declarations.

In schema 10, a setting can add `helpUrl`: an `https` page, up to 512 characters, without credentials or a fragment, that explains where to get the value, such as the provider's API key page. Arrumo shows it as Where to find it beside the field and opens it from the installed manifest, so a page cannot be swapped in from the UI.

An app-scoped field is configured at app scope only. A workspace-scoped field can have an app default and a workspace override. Clearing an override restores the app default. A required field needs a configured value before a host can use the plugin for work that depends on that field. The manifest declares metadata only. Values, defaults, and credentials are never part of a declaration. The host currently validates and displays declarations through its catalog API. The host validates and resolves ordinary values separately. Secure credential storage requires separate host support.

## Introduction and the plugin tour

Schema version 8 adds an optional `introduction`. When plugins arrive after the
creator's first launch (installed from a ZIP or the registry, or bundled by an
update), Arrumo introduces them in one shared tour, one page per plugin with its
name, `headline` and `body`. Plugins present on first launch are not toured.
Creators can replay the tour from Settings › Plugins. Text is keyed by language:
`en` is required, `es` and `pt` are used when the app is in those languages.
Headlines are at most 80 characters and bodies 320.

```json
"introduction": {
  "headline": {"en": "Your videos, in more languages", "es": "Tus vídeos, en más idiomas"},
  "body": {"en": "Pick a finished video and the languages you want…"}
}
```

## Icon and translations

Schema 8 also adds an optional `icon`: the path of an SVG file in the
package, such as `"icon": "icon.svg"`. Keep the SVG self-contained and at most
8 KiB. Arrumo shows it as an image wherever the plugin appears, such as beside
the agent that is working, so it cannot run script; the host refuses icons with
script, event handlers, `href`, `url(…)`, embedded images or documents. Draw
the icon with its own background shape and colours. `package_plugin.py` adds
the declared icon to the ZIP, and plugins without an icon get a default one.

### Brand marks: check before you ship one

A company's logo may appear as a plugin icon only when that company's published
brand guidelines allow it inside another app's interface. Do this check before
the logo goes into the package, not after:

1. Read the company's own brand, press or trademark page. A notice in the
   manifest does not grant permission.
2. Use the logo only if the page allows this use without asking (for example a
   mark offered for app ecosystems or integrations). Use the company's own file,
   unmodified, and follow its conditions on clear space, colour and size.
3. If the page asks you to request permission, sits behind a partner login, or
   cannot be found, draw a generic symbol of what the plugin does instead, such as
   a terminal prompt for a command-line agent or a picture frame for images.
4. Record the result in the plugin README under "Icon and trademarks": which page
   you read, what it allows, and why the icon is a mark or a generic symbol.

When the icon is a mark, add `iconNotice` naming the owner (for example
"ElevenLabs and its logo are trademarks of ElevenLabs."). Arrumo shows it
beside the plugin, and `translations` may translate it like other text. Generic
symbols carry no notice.

The official plugins were checked on 2026-11-22. ElevenLabs' brand page
recommends its "11" symbol for app ecosystems. OpenAI asks for permission first,
Google keeps the Gemini guidelines behind a partner login, and Anthropic and
Higgsfield publish no rule for this use. The publisher of the official plugins
chose to show each provider's logo with an `iconNotice` anyway, so creators
recognise the service, and will replace a logo with a generic symbol if its owner
asks. Third-party plugins should still follow the steps above.

### Icon shape

Draw the icon as a full square tile (for example a 32×32 `viewBox` whose first
shape is a `<rect width="32" height="32">` in the background colour) with
square corners and no border. Arrumo rounds the corners and draws a faint edge
the same way for every plugin, at every size.

## Translations

Plugins translate their own text. English stays in the manifest's fields, and
`translations.es` and `translations.pt` override the plugin `name` and
`description`, the agent `provider.label`, and each declared capability,
setting (`label`, `description`, and `choices` labels keyed by value) and
action. `translations.en` may add labels the base fields lack, such as choice
labels. Every key must name something the manifest declares.

```json
"translations": {
  "en": {"settings": {"reasoning-effort": {"choices": {"xhigh": "Extra high"}}}},
  "es": {"description": "Usa tu plan de ChatGPT…",
         "settings": {"web-search": {"label": "Búsqueda web"}}}
}
```
