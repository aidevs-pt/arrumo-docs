---

title: "Actions and hooks"
description: "Declare actions, their forms and places, and run them on events."
---

## Declare backend actions

Schema v6 lets a plugin with a backend component declare up to 64 entries in `actions`. Each entry has a unique `id`, a human-readable `label` and `description`, and `scope` set to `app` or `workspace`. The host calls `invoke` with JSON shaped as `{"action":"action-id","input":...}`, using the caller’s explicit app or workspace scope. Actions remain subject to component sandbox limits and the plugin’s grants. Invoking a package that declares actions requires a declared action ID.

Schema 9 gives an action a form and places in the app. `inputs` lists up to 16 fields, each with an `id`, `label`, optional `description`, `required` and a `kind`: `text`, `longText`, `number`, `boolean`, `choice` (with `choices`), `language`, `subtitles` or `json`. Arrumo shows the form instead of a JSON box and sends `input` as an object keyed by input ID. A `subtitles` input lets the creator pick a subtitle track of the video in view, open an SRT file or paste one, and it sends the SRT text. `placements` lists where the action is offered besides Settings: `draft` (beside a draft), `generation` (on a video's generation page) and `completed-video` (on a finished video, including its right-click menu). `translations.<lang>.actions.<id>.inputs.<input>` translates an input's `label`, `description` and `choices`.

```json
{
  "id": "translate-subtitles",
  "label": "Translate subtitles",
  "description": "…",
  "scope": "workspace",
  "inputs": [
    {
      "id": "subtitles",
      "label": "Subtitles",
      "kind": "subtitles",
      "required": true
    },
    { "id": "language", "label": "Into", "kind": "language", "required": true }
  ],
  "placements": ["completed-video"]
}
```

### Run an action on its own (hooks)

A schema 9 workspace action can also declare `hooks`, so it runs without anyone opening its form. There are three events, at most one hook each: `video-completed` fires once per finished video, after Arrumo has verified the delivery files; `generation-failed` fires once per failed generation attempt; and `publish-date-reached` fires once per finished output on the date the creator planned for it in the calendar. Each hook names a boolean setting of the same plugin in `enabledBy`, and runs only while that setting resolves to `true` for the workspace, so nothing happens until the creator turns it on. Arrumo shows the hook beside the action's form.

```json
"settings": [{"id": "auto-upload", "label": "Upload finished videos", "description": "…",
              "kind": "boolean", "scope": "workspace", "required": false}],
"actions": [{"id": "upload", "label": "Upload", "description": "…", "scope": "workspace",
             "hooks": [{"event": "video-completed", "enabledBy": "auto-upload"}]}]
```

A hooked run is an ordinary action job, listed with the others in **Plugin actions**. Its input is the event instead of form values:

```json
{
  "event": "video-completed",
  "video": {
    "runId": 3,
    "title": "Launch",
    "profile": "Shorts",
    "outputs": [
      {
        "formatId": 5,
        "format": "Landscape",
        "durationSeconds": 12.5,
        "scheduledFor": "2026-11-20"
      }
    ],
    "texts": [{ "kind": "description", "format_id": null, "text": "…" }]
  }
}
```

`texts` holds the approved title, description and tags; it is emptied when the input would pass the 64 KiB plugin limit. The job ID derives from the event, the video (and the attempt) and the action, so a repeated event never runs a hook twice.

A `generation-failed` hook receives the run, its attempt and the problem Arrumo recorded (up to 2,000 characters):

```json
{
  "event": "generation-failed",
  "video": {
    "runId": 3,
    "title": "Launch",
    "profile": "Shorts",
    "attempt": 1,
    "problem": "The agent stopped before rendering."
  }
}
```

A `publish-date-reached` hook receives the `video-completed` shape with `"event": "publish-date-reached"` and only the output whose date arrived. Arrumo checks every few minutes while it is open; a date up to seven days old still counts, so a day the app was closed is not lost. Each output and date runs the hook once, even if the date is moved back to it.

The creator can skip a switched-on hook for one video when they generate it.

The [action example](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/examples/actions/manifest.json) uses the same compiled echo component as the backend example. Compile `examples/component/echo.wat` to `examples/actions/echo.wasm`, package with `--include echo.wasm`, and install the ZIP. Use `plugin-actions` to discover actions and send JSON on stdin to `invoke-plugin-action action-echo echo app`.
