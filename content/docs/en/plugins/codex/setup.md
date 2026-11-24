---

title: "Set up Codex in Arrumo"
description: "Install and sign in to the local CLI using the provider setup guide."
---

Install and sign in to the local CLI using the [provider setup guide](https://learn.chatgpt.com/docs/codex/cli). Arrumo finds the CLI on its PATH and in the folders your login shell adds, even when it's opened from the Dock, Finder or a desktop launcher. If you installed it somewhere else, choose its program file with **Choose the program…** in agent setup or Settings.

Choose Codex during workspace setup or select it as the production agent in Settings. A sign-in check confirms local authentication. It does not start an edit.

## Check the connection

From the editor CLI, pass a local database path and this plugin ID.

```sh
arrumo-workspaces ./workspaces.sqlite agent-login-status codex
```

A confirmed status means the CLI accepted the sign-in probe. If Arrumo reports unavailable, check that the CLI is installed, or choose its program file in Settings. If the login is unconfirmed, sign in using the official guide and check again. A timeout or failure means the probe could not finish successfully.

## Write files and run commands

**Write files and run commands**, in Settings › Agent, is on by default. While working on a video, Codex then runs in its `workspace-write` sandbox with its shell, and loads your own Codex configuration, including MCP servers and plugins. It works in a folder Arrumo makes for that video and deletes once the video is finished, fails or is cancelled.

Turn it off and Codex runs in the `read-only` sandbox without its shell tool, and only reads what Arrumo sends. **Use my installed plugins** then decides whether your own Codex configuration and plugins load. Image generation always runs read-only.

## Translate subtitle cues

See [Translate subtitles](https://github.com/aidevs-pt/arrumo-plugin-codex/blob/main/README.md#translate-subtitles) to use this plugin as an Auto-Dubbing translator. The translator sends the selected cue text and target language to Codex. The workflow keeps the original cue timings.

## Make images

Codex can make thumbnails and other images with its built-in image tool, on your ChatGPT plan, so you do not need an OpenAI or Gemini key for them. It appears under **Image generation** in Settings, Services and keys, first by default; move it down to prefer a keyed provider. Arrumo sends the image brief and up to eight style references. Codex stays read-only, and Arrumo collects, checks and crops the image, then removes Codex's copy.

## Follow-up questions

When Codex asks Arrumo for workspace material, such as an earlier video's script, Arrumo answers in the same Codex session with only that material, so the brief is not sent and paid for twice. These sessions are kept in Codex's own history (`codex resume`); one-off runs keep none.
