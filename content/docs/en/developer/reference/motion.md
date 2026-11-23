---

title: "Animation and transition library"
description: "Reusable animations, agent-designed motion and installed renderers."
---

## Library items

Use `create-motion-item <workspace-id> <settings-json>` to register existing managed media as a reusable library item. The settings accept `kind` (`animation` or `transition`), `title`, `usage_markdown`, and `preview_asset_id` (video). Optional `thumbnail_asset_id` (image) and `sound_asset_id` (audio) refer to assets in the same workspace. Omit `profile_id` for workspace-wide use.

Use `motion-library <workspace-id> workspace` for workspace-wide items, or pass a profile ID to include items scoped to that profile. Several entries can refer to the same media without copying it.

Use `update-motion-item <workspace-id> <item-id> <settings-json>` to replace its settings with the same fields as creation. Use `duplicate-motion-item <workspace-id> <item-id> <title>` to create a new entry with the source scope, usage notes, and media. Use `delete-motion-item <workspace-id> <item-id> <confirmed-title>` with the exact saved title. Deletion removes the library entry and keeps its assets in the workspace.

MCP and A2A expose the same library through `list_motion_library`, `create_motion_library_item`, `update_motion_library_item`, `duplicate_motion_library_item`, and `delete_motion_library_item`. Use `workspaceId` and, where applicable, `profileId`, `itemId`, or `confirmedTitle` as top-level arguments. The nested `settings` uses the same field names as the CLI.

Read a profile-scoped item's additional recipients with `motion-item-shares <workspace-id> <item-id>`. Replace the recipient list with `set-motion-item-shares <workspace-id> <item-id> <profile-ids-json>`. Use an empty array to clear sharing. The owning profile is implicit, and workspace-wide entries are already visible to every profile. Duplicating a profile item copies its recipients.

In MCP and A2A, call `get_motion_library_shares` with `workspaceId` and `itemId`. Call `set_motion_library_shares` with those arguments and `profileIds` to replace the additional recipients, or pass an empty array to clear them.

In the desktop Motion library, select a profile to see its entries alongside workspace-wide items. Use **Share with profiles** on a profile-scoped item to add or remove recipients. A link such as `arrumo://open/motion-library?workspace=1&profile=2` opens that profile's library view.

Use **Play preview** to open a looping video preview and audition linked sound separately. Playback depends on the desktop webview supporting the media codec.

## Animations in runs

An Assets stage result can include a `motion_items` array. Each entry uses the same settings fields as `create-motion-item` and refers to managed assets and, optionally, a profile in the run's workspace. The host rejects the entire submission if a reference is invalid. Saved results protect their referenced media from cleanup until the run is removed.

Animations can also be designed by the workspace's agent. The agent answers with a spec of timed text, box and workspace-image layers with entrance and exit motion; Arrumo validates it and renders it with FFmpeg, so no agent-written code runs. Specs are kept with results and library items so the same animation renders at any frame size. Text is set in the workspace's brand fonts, or the system sans-serif without them, and has no emoji or pictographs. A layer can also name a `sound` (`whoosh`, `pop`, `click`, `chime` or `rise`) that Arrumo synthesizes with FFmpeg and plays as the layer arrives, mixed over any narration.

The background can fade diagonally into `backgroundTo`. Text layers take a `font` of `heading` or `body`, set in the workspace's brand fonts, and an `align` of `left`, `center` or `right` within their width. Boxes and images take a corner `radius` (a fraction of their shorter side, up to 0.5 for pills and circles) and a soft `shadow`, and a box can fade into `gradientTo`. Arrumo draws each shaped layer once as a still with FFmpeg and moves that still, so polish adds no per-frame cost. Older specs without these fields render as before.

In a storyboard, scenes can also have `video` layers that play one of the workspace's own videos, such as a screen recording, inside their box. The storyboard stage offers the workspace's videos that are neither draft footage nor files Arrumo generated, with their notes and length, so describe in each clip's notes what happens at which second. A video layer starts `clipStart` seconds into its clip, plays for the layer's span and holds its last frame if the clip runs out. `radius` rounds it, and `shadow` lifts it on a card in the layer's `color`. `zoom` lists up to eight camera keys, each with `at` (seconds into the scene), `x` and `y` (the centre of the view as fractions of the clip) and `scale` (1 to 3); the view eases from key to key, so a key at scale 1 followed by one at 2 punches in on a control. Zoom crops the clip inside its box, so the agent keeps it for text too small to read. `spotlight` lists up to six moments, each with `from` and `to` (seconds into the scene) and `x`, `y`, `width` and `height` (a rounded area as fractions of the clip, `x` and `y` its centre): the area stays bright while the rest of the clip dims, fading in and out over 0.3 s, and it follows the zoom. A spotlight that starts less than 0.6 s after another ends takes over from it without the clip brightening in between. When consecutive scenes play the same clip, a scene that would start before the previous one stopped starts where it stopped, so no moment repeats. Library animations never play clips.

Use `generate-motion-item <workspace-id> <request>` to describe an animation and save the rendered preview and thumbnail to the library. MCP and A2A use `generate_motion_library_item` with `workspaceId`, `request`, and optionally `profileId` and `basedOn` to add a changed version of an existing item while keeping the original. In the desktop Motion library, use **Generate with agent**, or **Change with agent** on a selected item.

Without an installed motion renderer, the Assets stage asks the run's agent for library placements and up to four new animations for the video. They are rendered at the run's preview size and reviewed with the stage; accepted animations are saved to the library when the run saves motion by default. When the video has recorded footage, the Video previews agent places approved animations in its cut: full-screen inserts before a cut or at the end, and overlays drawn over a cut from a given second. The preview edit keeps them as `animations`, `motion_inserts` (`before_cut`, `animation`) and `motion_overlays` (`cut`, `animation`, `at_ms`), so the final render draws the same animations at full size.

Use `save-motion-result <workspace-id> <run-id> <result-id> <index>` to save one accepted Assets stage motion result to the library. The index is zero-based. Repeating the command returns the existing entry while it remains in the library. Saved entries retain the run and result IDs and share the exact managed media, including earlier versions that were replaced after the run.

In MCP and A2A, call `save_motion_result` with `workspaceId`, `runId`, `resultId`, and the zero-based `index` in the accepted Assets result's `motion_items` array. The response includes the saved `item`.

Accepted motion results are saved to the library by default when an Assets stage advances, including in autopilot. Set `save_motion_to_library` to `false` in the run options or turn off **Save motion to library** when queuing a desktop run. You can still save an item manually from its accepted result.

During guided Assets review, select which animations and transitions to keep before approving. In MCP and A2A, pass `saveMotionIndexes` to `review_production_result`. In the CLI, append a JSON array of indexes to `review-stage`. Omit the selection to use the run default, or pass an empty array to save none. Indexes are zero-based.

A local renderer worker can submit finished files with `submit-motion-artifacts <workspace-id> <run-id> <attempt> <artifacts-json>` while it holds the Assets-stage lease. Pass an array of objects with `kind`, `title`, `usage_markdown`, and an absolute local `preview` video path. Optional fields are `profile_id`, `thumbnail` (image path), and `sound` (audio path). The host imports the files and submits their managed IDs together. A rejected batch leaves the run at its current stage and does not publish catalog entries. The input files remain with the worker.

MCP and A2A expose `submit_motion_artifacts` with `workspaceId`, `runId`, `attempt`, and `artifacts`. Each artifact uses the CLI's field names and absolute paths on the machine running Arrumo. The response includes `resultId`.

On a queued desktop run at the Assets stage, use **Submit motion files** to add one or more finished animations and transitions, each with a video preview and optional thumbnail and sound. Use **Add another item** to include more in the same submission. Submitting completes the stage or sends it to guided review, according to the run options.

Motion artifact submission requires `ffprobe`. The host probes each managed copy with the demuxer for its extension and checks for the expected video or audio stream before publishing the batch.

## Installed motion renderers

On Linux, run an installed motion-rendering package with `run-installed-motion-renderer <plugin-id> <digest> <sdk-worker> <output-directory> [toolchain]`. Use the installed package digest from the plugin catalog and point `sdk-worker` at your trusted local Plugin SDK checkout's `tools/run_motion_package.py`. Arrumo checks that the installed ZIP still matches the digest and declares `motion-render`. The SDK worker runs it in Bubblewrap and returns a JSON artifact batch. Submit that batch separately with the active Assets-stage lease.

For a queued Assets stage, use `render-run-motion <workspace-id> <run-id> <plugin-id> <digest> <sdk-worker> <output-directory> [toolchain]` to render and submit in one command. Arrumo claims the queued stage before rendering and renews the lease until the worker exits. If the lease is lost, the command stops its worker or refuses publication. Rendered files remain in the output directory. A successful command prints the production result ID.

For desktop development on Linux, launch Arrumo with `ARRUMO_MOTION_SDK_WORKER` set to the absolute path of the trusted SDK checkout's `tools/run_motion_package.py`. Optionally set `ARRUMO_MOTION_TOOLCHAIN` to a local toolchain directory. At a queued Assets stage, **Render motion** runs the selected installed renderer and submits its files through the same operation as the CLI. The desktop host owns the temporary output directory and removes it when the operation ends.

In MCP and A2A, call `render_run_motion` with `workspaceId`, `runId`, `pluginId`, and `packageSha256`. Launch the transport host with the same Linux worker configuration as the desktop. The host creates and cleans up its own temporary output directory. The call waits for publication and returns `resultId`. A2A accepts up to two concurrent render requests and continues serving task status and cancellation during rendering.

To build a Linux Debian package with the SDK worker, download the worker ZIP from a trusted Plugin SDK build. Run `python3 scripts/stage_motion_worker.py <worker.zip> <expected-sha256>` from a clean editor checkout, then run `pnpm tauri build --bundles deb --config src-tauri/tauri.motion-worker.conf.json`. The package declares Python, JSON Schema, Bubblewrap, util-linux, and FFmpeg dependencies. The installed desktop discovers the worker in its application resources. A process-level `ARRUMO_MOTION_SDK_WORKER` setting takes precedence for development and testing. Headless hosts still use the explicit worker setting. [Tauri resources](https://v2.tauri.app/develop/resources/)

Use `process-motion-stage <workspace-id> <run-id>` for one-shot worker dispatch with `ARRUMO_MOTION_SDK_WORKER` configured. At queue time, Arrumo captures the installed package digest for the first provider in the effective `motion-render` preference. To pick a renderer for one run, set `provider_overrides` to an object such as `{"motion-render":["my-renderer"]}`. An explicit empty order disables installed motion renderers for that run. The one-shot command returns the result ID after publishing or `null` if there is no queued Assets stage with a captured renderer. If the captured package is missing or has changed, the command fails and leaves the stage queued. A captured renderer that was turned off since counts as none: the run's agent makes the animations instead.

On Linux, the desktop also watches the motion queue while the app is open if it
finds the bundled SDK worker or an explicit `ARRUMO_MOTION_SDK_WORKER`. It
automatically starts eligible Assets stages using the renderer captured at
queue time. The result appears in the run's existing review or autopilot flow.
If the host exits mid-render, Linux stops the SDK worker. Arrumo can recover
the stage once the original attempt lease expires. Desktop and queue-worker
startup remove abandoned managed motion scratch beside the database. File
locks protect scratch directories still in use by another Arrumo process.

Run `watch-motion-queue` as a foreground Linux worker with `ARRUMO_MOTION_SDK_WORKER` configured. It polls the shared database, starts the oldest eligible Assets stage with a captured installed package, and prints each published result ID. Multiple worker processes use the same attempt lease, so only one can publish a particular stage. An expired Assets lease can be reclaimed after a restart. Runs whose captured renderer package is missing or has changed stay queued while other eligible runs proceed.
