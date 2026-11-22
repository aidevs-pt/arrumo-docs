---

title: "Rendering, subtitles and delivery"
description: "How Arrumo cuts, renders, checks and exports each video."
---

## Previews and final render

A leased worker on the Preview stage can use `render-preview <workspace-id> <run-id> <attempt> <edit-json>` for recorded-source runs. Pass the Preview result object as the edit. The renderer uses the optional cuts below and writes one MP4 per frozen output format, capped at the longest edge saved in the run snapshot. The recorded result includes these filenames in `preview_videos`. Files are stored in the run's delivery directory with the attempt number in the name so revisions retain separate artifacts.

Use `preview-settings` to inspect the app-wide resolution and `set-preview-max-edge <pixels|auto>` to set a cap from 144 to 2160 pixels or restore the CPU-based recommendation. This applies to new runs across every workspace. Runs saved before preview settings were introduced use a 480 px cap.

For recorded-source runs, the Final render stage can assemble managed clips using `render-primary <workspace-id> <run-id> <attempt>`. It requires `ffmpeg`, `ffprobe`, and the `libx264` encoder. It fits each clip to the frozen output dimensions without stretching, preserves source audio, and inserts silence for clips without audio. Each cut's audio fades in and out over 30 ms so joins don't click, and every rendered video, previews included, is measured and then evened out to -14 LUFS with peaks at -1.5 dBTP (silent videos, and audio quieter than -45 LUFS such as room tone, are left as they are). It writes the primary MP4s and advances to delivery verification. Supply subtitle files separately before verifying.

After mastering, the host checks each recorded-source render without vision: the video must last as long as its clips and animation inserts add up to (within 0.1 s plus 0.05 s per part), or the stage fails with both durations. Both durations are kept per format under `render_checks` in the stage result.

A Preview result can include `"cuts": [{"asset_id": 2, "start_ms": 500, "end_ms": 1500}]`. List cuts in playback order and use millisecond offsets into videos from the frozen draft source list. Final render consumes the approved Preview result in guided mode and the accepted Preview result in autopilot. When an agent cuts the footage, it reads each transcript as phrase lines with start and end seconds, split at pauses of half a second or more, and Arrumo moves any cut edge inside a spoken word to the word's nearer boundary (keeping the word when the edge covers most of it), with 50 ms of padding before a kept first word and 80 ms after a kept last word. When an edge drops a word, the padding counts from the neighbouring kept word and never reaches into the dropped one. Use `format_cuts` to override the shared cuts for a frozen output format, for example `{"format_cuts":{"2":[{"asset_id":2,"start_ms":500,"end_ms":1500}]}}`. A format value of `null` uses whole source clips for that format. Formats without an override use `cuts` or whole source clips in draft order if `cuts` is omitted. Preview and final render use the same format-specific edits.

Use `process-media-stage <workspace-id> <run-id> [preview-edit-json]` to claim and execute one media stage for a specific run. Pass an edit object (or `{}` for whole clips) when the run is ready for Preview. Omit the edit for recorded-source Final render or delivery verification. The command prints the stage and attempt on success, or `null` if the run is unavailable for that operation. Failed media work records a short reason in activity history and can be retried after correction. Guided review still uses `review-stage`.

Use `get_preview_settings` to inspect preview resolution. Set `maxEdge` with `set_preview_max_edge` to a value between 144 and 2160 pixels or pass null to restore the app recommendation. Queued runs retain their captured preview settings.

Use `process_media_stage` to claim and execute a ready media stage for one run. Pass `previewEdit` at Preview, using an empty object for whole clips. Omit it for final rendering or delivery verification. For each rendered format, call `import_delivery_subtitles` with its format ID and an absolute local SRT `source` before verifying delivery.

## Delivery verification

Delivery verification requires `ffprobe` on PATH. At the `verify_delivery` stage, place each configured format's final files under `<database>.deliveries/<workspace-id>/<run-id>/`, named `<format-id>.mp4` and `<format-id>.srt`. Run `verify-delivery <workspace-id> <run-id> <attempt>` to check each video’s dimensions and duration and its subtitle cues. A successful verification records metadata and completes the run while the lease is still active. While the desktop is open, it automatically verifies eligible runs once every captured output format has a managed MP4 and SRT. Runs with missing files stay queued so you can import the remaining subtitles.

Run `arrumo-workspaces <database-path> watch-delivery-queue` as a foreground
worker when the desktop is closed. It verifies ready deliveries and generates
missing subtitles for runs that opted in. It uses the same database and claim
rules as the desktop. Stop the worker with Ctrl+C. Failed or interrupted
automatic subtitle attempts still require an explicit retry.

At the `verify_delivery` step, call `verify_generation_delivery` with the workspace ID, run ID, and current attempt. The server checks the managed MP4 and SRT files with `ffprobe` using the database path configured at launch. After a successful verification, call `get_completed_video` for verified output metadata and production history.

## Subtitles

Use `generate-delivery-subtitles <workspace-id> <run-id> <format-id>` to
transcribe a rendered format while the run is at delivery verification. This
command sends the format's extracted audio to a configured transcription
provider from the run's captured order. It requires FFmpeg, ffprobe, and a
provider that returns timed words or segments. It validates the generated SRT before
publishing it and preserves any existing subtitle file. MCP and A2A expose
`generate_delivery_subtitles` with `workspaceId`, `runId`, and `formatId`.
Only one subtitle generation request can run per output at a time. In the
desktop delivery step, select **Generate subtitles** for the rendered format
or **Import SRT** to supply your own subtitles.

In the desktop queue form, turn on **Generate missing subtitles automatically**
for the selected draft. To opt in when submitting a run through the CLI, MCP,
or A2A, set
`generate_delivery_subtitles: true` in its run options. While the desktop is
open, it attempts transcription once per rendered format missing an SRT.
An interrupted or failed automatic attempt requires an explicit retry via
**Generate subtitles**, or you can import an SRT. Existing SRTs are kept. The
desktop delivery step shows the last automatic attempt for each format. The
shared production progress response exposes the same states in
`automatic_subtitles`, keyed by format ID.

At delivery verification, use **Import SRT** beside an output format or run `import-delivery-subtitles <workspace-id> <run-id> <format-id> <source-srt>`. The importer checks UTF-8 text and cue timing against the rendered MP4 before replacing the delivery subtitle file. The CLI prints the number of accepted cues.

From a completed video's output, select **Subtitle text** to open the SRT file alongside its video. Search the transcript or select a cue to seek to it. A link such as `arrumo://open/completed-video?workspace=1&run=3&format=2&file=subtitles` opens that output's transcript directly. Linux WebKit playback of H.264 requires a compatible GStreamer decoder. The desktop disables WebKitGTK's DMA-BUF renderer at startup because it stalls media loading on many Linux systems; set `WEBKIT_DISABLE_DMABUF_RENDERER=0` before launch to keep it. The Debian packages depend on FFmpeg, `gstreamer1.0-plugins-good` and `gstreamer1.0-libav`; the RPM package requires `ffmpeg` and `ffprobe` and recommends `gstreamer1-plugin-libav` or `gstreamer1-plugin-openh264`; the AppImage bundles GStreamer. When playback fails on Linux, the app names the package to install.

The CLI command `completed-subtitles <workspace-id> <run-id> <format-id> [revision]` returns the subtitle text and revision number as JSON. Omit the revision for the latest version or pass `0` for the verified original. Use `revise-completed-subtitles <workspace-id> <run-id> <format-id> <expected-revision> <srt-file>` to append a version. The command validates cue timing against the verified video and rejects a stale expected revision. The completed-video viewer and ZIP export read the latest revision.

Additional language tracks are scoped to one verified output format and have independent revision histories. Use `completed-subtitle-languages <workspace-id> <run-id> <format-id>` to list them and `completed-subtitle-track <workspace-id> <run-id> <format-id> <language> [revision]` to read one. Use `revise-completed-subtitle-track <workspace-id> <run-id> <format-id> <language> <expected-revision> <srt-file>` with expected revision zero to add a track. Language tags such as `pt-PT` are stored in lowercase. The delivery ZIP includes the latest revision of each language as `<format-id>.<language>.srt` alongside the primary subtitle.

MCP and A2A provide `list_completed_subtitle_languages` and accept an optional `language` on `get_completed_subtitles` and `revise_completed_subtitles`.

In the desktop subtitle viewer, use **Subtitle language** to switch between the primary subtitles and additional tracks. **Add language** creates a track from a language tag and translated SRT. **Edit subtitles** opens the selected track for editing. **Save version** adds a validated revision, and the history arrows browse that track’s revisions.

MCP and A2A expose `get_completed_subtitles` with `workspaceId`, `runId`, `formatId`, and optional `revision`. Submit `revise_completed_subtitles` with those three IDs, `expectedRevision` from the latest read, and `subtitles` containing the complete SRT text. Both transports have a 128 KiB request envelope. Use the desktop or CLI to save larger SRT files within the 2 MiB subtitle limit.

## Export

Use `export-delivery <workspace-id> <run-id> <destination-zip>` after delivery verification. It exports the primary MP4 and SRT files recorded as verified for the completed run. Choose a new ZIP path in an existing directory. An incomplete export leaves that path free.

A format whose frozen delivery has `burned_captions` set also gets `<format-id>-captioned.mp4`: FFmpeg's `subtitles` filter (libass) draws the latest subtitle revision into a copy at export time, with text about 5.5% of the shorter side and portrait captions raised to 20% of the height. The video stream is re-encoded with libx264 and the audio copied. The setting sits in a format's supplemental delivery, a profile override and a video's `format_overrides`, and is off by default.

Call `export_generation_delivery` with the workspace ID, completed run ID, and an absolute local `destination` path in an existing directory. The shared exporter writes a ZIP of the verified video and subtitle files and refuses to replace an existing path.

The local CLI command `verified-video-source <workspace-id> <run-id> <format-id>` prints the verified MP4 path as JSON for workflows running on the same machine.

## Files added after completion

The completed-video file viewer opens supplemental images, audio and video from the captured asset reference. For example, `arrumo://open/completed-video?workspace=1&run=3&file=media-1` opens the first supplemental media item. Playback depends on the desktop WebView's installed codecs.

To add a file produced after completion, import it into the run's workspace and use
`attach-completed-media <workspace-id> <run-id> <format-id> <asset-id>`.
MCP and A2A expose the same operation as `attach_completed_media` with
`workspaceId`, `runId`, `formatId`, and `assetId`. A repeated attachment
returns false in the CLI or `{"added":false}` through MCP and A2A.
Attachments appear in supplemental files with a stable `attachment_id`, which
also identifies their delivery ZIP entry as `attachment-<id>.<extension>`.
Use `detach-completed-media <workspace-id> <run-id> <attachment-id>` or
`detach_completed_media` with `workspaceId`, `runId`, and `attachmentId`
to remove the attachment while keeping the asset in the workspace. A repeated
removal returns false. Other attachment links keep their IDs.

In the desktop Video tab, select the output format and use **Attach file** under **Other files in this video** to choose a managed workspace asset. In the desktop file viewer, **Detach file** removes a post-completion attachment from the delivery and returns to the video. The managed file remains in workspace Assets.

Use `import-completed-video-variant <workspace-id> <run-id> <format-id> <source.mp4>`
to add a rendered alternate video. The editor verifies the managed copy's
dimensions and duration against the selected completed output and requires an
audio track before committing the asset and attachment together.

MCP and A2A expose the same import as `import_completed_video_variant` with
`workspaceId`, `runId`, `formatId`, and an absolute local `source` path.
Identical bytes submitted again to the same run and format return the original managed asset. Detaching the file allows a fresh import. Attachments created before digest tracking retain their existing links.

The desktop Video tab exposes this verification under **Import alternate MP4**.
Select the intended output format before opening the file picker.
