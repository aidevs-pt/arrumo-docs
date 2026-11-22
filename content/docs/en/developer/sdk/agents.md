---

title: "Agent providers"
description: "Declare an editing agent: status checks, structured runs, images, usage and follow-ups."
---

## Agent provider declaration

An agent plugin can add an `agentProvider` descriptor and must declare the `agents` capability. The manifest's plugin ID is the provider ID. `label` is the displayed product name and `setupUrl` links to the provider's HTTPS setup guide. `cli.executable` and `cli.authStatusArgs` describe its local status command as a program name and literal argument list.

The host may run this command only for a trusted plugin whose adapter supports the host's execution policy. It resolves the executable through the host's PATH and reports a bounded status without capturing command output. Exit 0 confirms local authentication, exit 1 leaves it unconfirmed, and other exits report failure. The descriptor does not grant shell or process access to a plugin and does not declare a generation adapter. Never include credentials in the descriptor or probe arguments.

## Structured agent runs

Schema version 7 lets an agent provider declare `agentProvider.cli.structuredRun`.
The host uses it for production stages such as writing the script. It runs the
provider's executable once, in an empty temporary directory, with the prompt on
stdin and a JSON Schema the answer must follow.

```json
"structuredRun": {
  "args": ["exec", "--sandbox", "read-only", "--output-schema", "{schemaPath}",
           "--output-last-message", "{outputPath}", "-"],
  "result": { "source": "outputFile" }
}
```

Placeholders are whole arguments: `{schema}` is the schema as JSON, `{schemaPath}`
a file containing it, and `{outputPath}` a file the agent writes its answer to.
Every run must pass the schema through one of the first two. `result.source` is
`outputFile` or `stdout`. `pointer` selects the answer inside that document, and
`errorPointer` names a boolean that is true when the agent reports a failure.
The host validates the answer against the schema, bounds its size, enforces a
time limit, and treats a non-zero exit as a failure. Providers own the flags that
keep the run non-interactive and free of tools, hooks and network access the
stage does not need.

The agent's capabilities belong to its plugin. Declare them as ordinary
`settings` and map each to flags with `settingArgs`; the host inserts the chosen
arguments at a `{settings}` placeholder. A boolean setting uses `args` when true
and `otherwise` when false or unset. Other settings use `args` with `{value}`
replaced, accepting only plain words (letters, digits, `.`, `_`, `:` and `-`),
and a string setting with `choices` only accepts one of them. A setting's
`default` applies when neither the app nor the workspace sets a value. The host
freezes the resolved values into each generation run so it can be reproduced.

`progress` lets the host show what the agent is doing while it works. Each
entry is a regular expression matched against every line the agent prints;
its first capture group (or `label`) becomes a step of kind `thinking`,
`search` or `step`, so creators can follow the reasoning and searches live. Agents that print one JSON event per line add a `pointer` to each pattern to
match the text at that place in the event, and read their answer with the result
source `stdoutLastLine`.

Agents that can look at images declare `imageArgs`, such as `["-i", "{imagePath}"]`,
and place `{images}` in `args`. The host repeats those arguments once per image
it wants the agent to see, such as thumbnail references or images found while
researching a creator, and leaves `{images}` empty for agents without it.

Agents with their own image tool also declare the `image-generation` capability
and an `imageRun`. Arrumo sends the image brief on stdin, reads the session ID
from the printed JSON events at `sessionPointer`, and collects the newest PNG,
JPEG or WebP file from `outputDirectory`: `path` (with `{session}`) under the
directory in the environment variable `env`, or under `fallback` in the home
directory. The agent stays read-only and writes nothing itself. Arrumo verifies
and crops the image like any other provider's, and removes what the run left.
`{images}` attaches style references using `structuredRun.imageArgs`.

```json
"imageRun": {
  "args": ["exec", "--sandbox", "read-only", "--enable", "image_generation", "{images}", "--json", "-"],
  "sessionPointer": "/thread_id",
  "outputDirectory": {"env": "CODEX_HOME", "fallback": ".codex", "path": "generated_images/{session}"}
}
```

Schema 11 agents can declare a `usageRun` so creators see how much of their
plan's allowance is left, next to the keyed providers in Settings › Services and
keys and in the low-allowance warnings. Arrumo starts the CLI with `args`, writes
each `input` value to stdin as one JSON line, and reads the first printed JSON
line whose `id` is `responseId`. Each of `windows` points at the share used in
percent and, optionally, its reset time in Unix seconds and its length in
minutes; Arrumo shows the most used window. The read must not spend the
allowance, and it stops after 20 seconds.

```json
"usageRun": {
  "args": ["app-server"],
  "input": [
    {"id": 1, "method": "initialize", "params": {"clientInfo": {"name": "arrumo", "version": "1"}}},
    {"method": "initialized"},
    {"id": 2, "method": "account/rateLimits/read"}
  ],
  "responseId": 2,
  "windows": [{"usedPercent": "/result/rateLimits/primary/usedPercent",
               "resetsAt": "/result/rateLimits/primary/resetsAt",
               "minutes": "/result/rateLimits/primary/windowDurationMins"}]
}
```

Agents that report their allowance only while they work can declare a
`usageEvent` instead (schema 12). Arrumo looks for the last printed JSON line
whose `typePointer` equals `typeValue` during each ordinary run, reads every
window (`used` as a `fraction` from 0 to 1 or a `percent`, an optional
`resetsAt` pointer and a fixed `minutes` length) and keeps them. Services and
keys then shows the most used window that has not reset yet, so no extra
request spends the allowance. Until the agent has run once, no usage is shown.

```json
"usageEvent": {
  "typePointer": "/type",
  "typeValue": "rate_limit_event",
  "windows": [{"used": "/rate_limit_info/unifiedWindows/seven_day/utilization",
               "scale": "fraction",
               "resetsAt": "/rate_limit_info/unifiedWindows/seven_day/resetsAt",
               "minutes": 10080}]
}
```

```json
"settings": [
  {"id": "web-search", "label": "Web search", "description": "…", "kind": "boolean",
   "scope": "workspace", "required": false, "default": false},
  {"id": "reasoning-effort", "label": "Reasoning effort", "description": "…",
   "kind": "string", "scope": "workspace", "required": false,
   "choices": ["low", "medium", "high"], "default": "medium"}
],
"structuredRun": {
  "args": ["exec", "{settings}", "--output-schema", "{schemaPath}", "-"],
  "settingArgs": [
    {"setting": "web-search", "args": ["-c", "web_search=\"live\""],
     "otherwise": ["-c", "web_search=\"disabled\""]},
    {"setting": "reasoning-effort", "args": ["-c", "model_reasoning_effort=\"{value}\""]}
  ],
  "result": { "source": "outputFile" }
}
```

### Follow-up messages

When an agent asks the host for workspace material, Arrumo answers in the same
session if the plugin declares `resume`, sending only the new material instead
of the whole brief again. Put `{ephemeral}` in `args` where the flags that stop
the agent keeping a session belong, and list them in `ephemeralArgs`; the host
leaves them out only for a run it will follow up. `resume.args` replaces `args`
for the follow-up, with `{session}` for the ID read from `resume.session`. If a
session cannot be continued (it is gone, unreadable or stuck), the host starts
a new one with the whole brief and all material so far.

Declare `resume.cleanup` so kept sessions do not pile up in the agent's own
history: Arrumo records each session it keeps and deletes its files once the
video it belongs to has completed, failed or been cancelled, or right after a
request that has no video. It looks under `directory` in the folder the
`homeEnv` variable names (absolute paths only), or else `home` in the user's
home folder, for files whose names end with `fileSuffix`. It never follows
links and removes folders the deletion leaves empty.

```json
"args": ["exec", "{ephemeral}", "--output-schema", "{schemaPath}", "-"],
"ephemeralArgs": ["--ephemeral"],
"resume": {
  "args": ["exec", "resume", "--output-schema", "{schemaPath}", "{session}", "-"],
  "session": {"stream": "stderr", "pattern": "^session id: ([0-9A-Za-z-]+)$"},
  "cleanup": {"homeEnv": "CODEX_HOME", "home": ".codex", "directory": "sessions", "fileSuffix": "{session}.jsonl"}
}
```
