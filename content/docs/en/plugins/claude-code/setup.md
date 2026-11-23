---

title: "Set up Claude Code in Arrumo"
description: "Install and sign in to the local CLI using the provider setup guide."
---

Install and sign in to the local CLI using the [provider setup guide](https://code.claude.com/docs/en/setup). Start Arrumo from an environment whose PATH includes the directory containing the CLI executable.

Choose Claude Code during workspace setup or select it as the production agent in Settings. A sign-in check confirms local authentication. It does not start an edit.

## Check the connection

From the editor CLI, pass a local database path and this plugin ID.

```sh
arrumo-workspaces ./workspaces.sqlite agent-login-status claude-code
```

A confirmed status means the CLI accepted the sign-in probe. If Arrumo reports unavailable, check that the executable is on the PATH visible to Arrumo. If the login is unconfirmed, sign in using the official guide and check again. A timeout or failure means the probe could not finish successfully.

## Write files and run commands

**Write files and run commands**, in Settings › Agent, is on by default. While working on a video, Claude Code then runs with edits accepted (`--permission-mode acceptEdits`) and may use Read, Write, Edit, Glob, Grep and Bash, plus WebSearch and WebFetch when **Web search** is on. Your own Claude Code setup applies: its hooks, MCP servers and plugins. It works in a folder Arrumo makes for that video and deletes once the video is finished, fails or is cancelled.

Turn it off and Claude Code runs restricted (`--restricted`), with hooks turned off and file and shell tools refused, and only reads what Arrumo sends. **Use my installed plugins** then decides whether your own plugins and MCP servers load.

## Translate subtitle cues

See [Translate subtitles](https://github.com/aidevs-pt/arrumo-plugin-claude-code/blob/main/README.md#translate-subtitles) to use this plugin as an Auto-Dubbing translator. The translator sends the selected cue text and target language to Claude Code. The workflow keeps the original cue timings.

## Follow-up questions

When Claude Code asks Arrumo for workspace material, such as an earlier video's script, Arrumo answers in the same Claude Code session with only that material, so the brief is not sent and paid for twice. These sessions are kept in Claude Code's own history (`claude --resume`); one-off runs keep none.
