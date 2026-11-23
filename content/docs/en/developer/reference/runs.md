---

title: "Drafts, runs and review"
description: "Queue videos, work their stages and review the results."
---

## Drafts

Create video drafts with an ordered list of workspace video asset IDs, or start from scratch with an intent brief. An optional `profile_id` must refer to a profile in the same workspace.

```sh
cargo run --locked -- ./workspaces.sqlite create-draft 1 '{"title":"Review","source_ids":[2,1],"profile_id":1}'
cargo run --locked -- ./workspaces.sqlite create-draft 1 '{"title":"Explainer","intent":"Show how a cube works"}'
cargo run --locked -- ./workspaces.sqlite drafts 1
```

Use `update-draft <workspace-id> <draft-id> <settings-json>` to replace the saved draft settings and source order. The desktop Drafts view also supports editing and cancelling. An invalid source group leaves the original draft intact.

Use `create_video_draft` and `update_video_draft` to save drafts before enqueueing. Pass the full `settings` object with a title and either an intent or an ordered `source_ids` list of managed video assets in the workspace. An optional `profile_id` selects a workspace profile. Keep the returned draft ID for updates and enqueueing.

Delete an unqueued draft with `delete-draft <workspace-id> <draft-id> <confirmed-title>` in the CLI or `delete_video_draft` through MCP and A2A. Pass the exact saved title. A draft referenced by a run stays available for that run and its replays. Managed sources remain in the workspace library.

## Queue, workers and control

Queue a saved draft with a request key and run options. Retrying with the same workspace, request key, draft, and options returns the existing run. Queued runs retain their submitted snapshot after later draft or workspace edits.

```sh
cargo run --locked -- ./workspaces.sqlite enqueue-draft 1 1 request-1 '{"autopilot":false,"platform":"YouTube"}'
cargo run --locked -- ./workspaces.sqlite generation-runs 1
```

A worker claims queued work with `claim-generation <workspace-id>`. The claim includes an attempt number and a 60-second lease. Use `checkpoint-generation <workspace-id> <run-id> <attempt> <json>` to save progress and renew the lease. Expired claims can be reclaimed with the last saved checkpoint. Use `control-generation <workspace-id> <run-id> <pause|resume|cancel>` to control runs and `generation-activity <workspace-id> <run-id>` to read their transition history. Agent sessions Arrumo kept for follow-ups are deleted from the agent's history once their run has completed, failed or been cancelled; the desktop does this every few minutes, and `sweep-agent-sessions` does it now.

A worker can report a terminal failure with `fail-generation <workspace-id> <run-id> <attempt> <detail>`. Supply a short, user-facing reason without credentials or raw provider logs. The desktop activity history shows the reason. Use Retry in the desktop queue or `control-generation <workspace-id> <run-id> retry` to return a failed run to the queue with its checkpoint intact.

New runs save their production plan from the frozen snapshot at enqueue time. Use `generation-plan <workspace-id> <run-id>` to read it as soon as the run is queued. A worker receives the current step with its claim. For older runs with no saved plan, the worker can use `prepare-generation-plan <workspace-id> <run-id> <attempt>` under its active lease. Guided plans flag the stages that require review. Autopilot plans omit those review requirements.

A leased worker can use `submit-stage <workspace-id> <run-id> <attempt> <stage> <result-json>` to record the current plan step. A guided run waits for `review-stage <workspace-id> <run-id> <result-id> <approved|rejected|revise> <notes>`. Approval advances to the next stage. Rejection and revision requeue the current stage and preserve review history. Use `production-progress <workspace-id> <run-id>` to read results and decisions. Delivery verification has a separate completion path.

`control-generation <workspace-id> <run-id> stop` returns a run to its previous reviewed step: the most recent result of an earlier stage opens again for review, while the original decision stays in the history.

Use `replay-generation <workspace-id> <source-run-id> <request-key> <captured|current>` to queue a fresh run from a completed video. Captured mode copies the original input snapshot. Current mode resolves the latest saved draft, workspace, profile, output and preview settings with the original run's platform and autopilot options. Both modes start at the beginning of the production plan. Repeat the same request key, source and mode to retrieve the same replay.

To queue a saved draft, call `list_video_drafts` with the workspace ID, then call `enqueue_video_draft` with the draft ID and a request key. Reuse the key for retries of the same submission. Use `list_generation_runs` and `get_generation_run` to inspect runs and captured settings, and `control_generation` to pause, resume, retry, or cancel a run. Use `get_production_progress` to identify a pending stage result and `review_production_result` to submit an approval, rejection, or revision request.

Workers can call `claim_generation` for the next run and use the returned attempt number with `checkpoint_generation` to save progress and renew the lease. Submit stage results with `submit_production_result` while the lease is active. Delivery verification uses a separate workflow. Use `get_generation_activity` to read the run's recorded transitions, and `list_agent_logs` and `get_agent_log` (with `workspaceId` and `runId` or `logId`) to read what the agent was asked and printed.

Use `get_generation_plan` to inspect a run's prepared steps. A worker can use `fail_generation` with its current attempt and a short diagnostic for the activity log. Once a run completes, `replay_generation` can queue a new run in `captured` or `current` mode. Reuse the same request key and mode when retrying a replay submission.

## Editing agent

Use `agent-settings <app|workspace-id>` to inspect the configured agent and where it came from. Use `set-agent-provider <app|workspace-id> <plugin-id|unset>` to change the choice. Unsetting a workspace override restores the app choice, if configured. New runs freeze the resolved selection and provenance. Selecting a provider is separate from connecting or running its agent.

Open **Settings** in the desktop sidebar to choose the app's production agent. Use the settings scope picker to configure a workspace override or restore inheritance. The effective provider and its source appear under the selector.

On a fresh install, creating the first workspace opens agent setup if no app provider is selected. Settings can check whether the selected CLI is on Arrumo's PATH and open the provider's installation guide in the system browser. This check reports local CLI availability. Authentication is handled through the provider's own setup.

Use **Check sign-in** in Settings or `agent-login-status <plugin-id>` in the CLI to ask the installed provider about its local authentication state. The check makes no generation request and returns only a status category. It times out after five seconds. Windows detection and sign-in checks use a native executable on PATH.

Use `agent-plugins` to list the bundled agent providers. Their IDs, labels, setup guides, and authentication probes come from the provider repositories' SDK manifests. Builds import the registry defaults from their separate plugin checkouts. Runtime installation and trust grants are separate host features.

Use `list_agent_plugins` to discover bundled production agents and `get_agent_settings` to read the effective choice. Use `set_agent_provider` or `clear_agent_provider` at app or workspace scope. Omit `workspaceId` for app scope. Changes affect future run snapshots. A run whose captured agent was turned off since fails at its next agent stage with that reason; turn the agent on and retry.

Use `get_agent_login_status` through MCP or A2A with the bundled agent plugin ID to check local sign-in readiness. The host returns a status and discards the probe's output.

## Agent logs

Every agent run is logged with its prompt, command line, standard output, error output, answer and problem. Use `agent-logs <workspace-id> [run-id]` to list them, newest first, and `agent-log <workspace-id> <log-id>` to read one. A running entry is updated every two seconds, and an entry left running by a crash is marked interrupted when the stage is retried. In the desktop, open **Agent logs** next to a run's activity, or from the animation generator.

## What the agent writes at each stage

The Script stage is written by the run's agent when its plugin declares a structured run (SDK schema version 7). The desktop app drafts queued scripts in the background; `process-script-stage <workspace-id> <run-id>` and the `process_script_stage` tool do it on demand. The agent receives the frozen brief, context, profile, formats, learned feedback and, on later attempts, earlier drafts with their review notes. A guided run then waits for review, and asking for changes queues a new draft. If the agent cannot finish, the run fails with the reason and can be retried. Before the agent writes, each source clip is transcribed with the run's captured transcription providers in 15-minute chunks, and the transcript is cached for the managed file. Clips the providers cannot hear, for example without a configured key, are listed in the result as `footage_without_transcript` and the agent works from their names and notes.

When a run has no motion renderer, the run's agent plans the Assets and animations stage: it chooses library assets and motion library items for each script section, or none when the footage carries the video (`process-asset-plan`, `process_asset_plan`). Library animations play exactly as saved, so the agent is told not to place one whose text does not fit the video. The brief carries the saved design (`design`, the motion spec) of up to six recent library animations under 12 KB each, and new animations that do a similar job, such as lower thirds, follow their layout, colors, fonts and timing. For videos made from recorded footage, the agent then cuts the first preview from the approved script and timed transcripts, and Arrumo renders it (`process-preview-edit`, `process_preview_edit`); each cut keeps its clip name and purpose for review. The desktop app runs both in the background.

A video started from scratch has no footage to cut. At **Video previews**, its agent storyboards the approved script as animated scenes, reusing approved animations where they fit, and Arrumo renders them for every format. Scenes can also play the workspace's own videos, such as screen recordings, inside a framed and zoomable box (see [animations](motion.md)). The final render renders the same scenes at full size and writes each format's SRT from the scenes' on-screen text, unless an SRT already exists. The agent also writes each scene's narration. When the run's first text-to-speech provider has a credential, Arrumo voices it while making the preview, using the plugin's voice setting or its default voice, lengthens scenes that need more time, and stores the audio with the run so the final render reuses it; subtitles then follow the narration. If synthesis fails, the preview stays silent and its summary says why.

For the Supplemental outputs stage, the run's agent writes the requested titles, descriptions and tag lists for each format from the approved script, plus one image prompt per requested thumbnail. Arrumo generates each thumbnail at the format's aspect ratio through the run's captured `image-generation` order, using each provider plugin's `image-generation.json` adapter, skipping providers without a key, and saves it as a workspace asset. When the creator approves some items and sends others back, the agent replaces only those items, with their notes, and the approved ones are kept. The desktop app does this in the background; `process-supplemental-writing <workspace-id> <run-id>` and the `process_supplemental_writing` tool do it on demand. Stages that also need portrait cuts wait for a renderer. To check an image provider's key and model, run `echo "prompt" | arrumo-workspaces <database> generate-image <workspace-id> 16:9 '["gemini"]'`.

Formats that ask for portrait cuts get them at Supplemental outputs. The run's agent picks each cut's moment from the approved video's timeline, and Arrumo renders the approved edit at 1080×1920, trims each cut, and adds the requested 9:16 thumbnails through the run's image providers. Cuts and their thumbnails are reviewed with the other supplemental media; sending a cut back asks for a different moment and keeps its thumbnails unless those were sent back too.

## Supplemental outputs

At the `supplemental_outputs` stage, workers can submit `supplemental_text` in the stage result. Each item has a `kind` of `title`, `description`, or `tags`, a UTF-8 `text` value, and an optional `format_id` from the frozen run. Omit the format for text shared by the whole video. Arrumo accepts up to 100 entries and 64 KiB of combined text. The accepted stage result supplies the completed-video file links and adds corresponding `supplemental-<kind>-<index>.txt` files to the delivery ZIP. Indexes start at 1 and follow submission order.

A `supplemental_outputs` result can also include up to 100 `supplemental_media` entries with an `asset_id` and optional frozen `format_id`. Import each image, video, or audio file into the run's workspace before submitting its asset ID. The run retains those exact asset versions even after a library replacement. Completed-video reads expose the accepted media metadata and ZIP export includes numbered `supplemental-media-<index>.<extension>` files.

For selective approval, use `review-supplemental-items <workspace-id> <run-id> <result-id> <decisions-json> <notes>`. The JSON has `text` and `media` arrays, each in the order of the corresponding submitted items. Each decision is `approved`, `revise`, or `rejected`. Include an empty array when a category has no items. The run advances only when every item is approved. Otherwise, the next Supplemental Outputs submission supplies only replacements for the unresolved items, in their original order within each category. Text replacements keep their kind and scope. Media replacements keep the media type and scope. Arrumo merges the replacements into their original positions and retains approved entries. Workers can read the decisions and shared notes from production progress.

In desktop guided Outputs review, choose a decision per item or use a batch button to set all items at once. You can override any item before sending. Arrumo stages your choices and shared notes locally until you select **Send**.

MCP and A2A support `review_supplemental_items` with `workspaceId`, `runId`, `resultId`, `review` (the `text` and `media` decision arrays), and optional `notes`. In an A2A task message, the task ID supplies the workspace and run scope.

Check individual outputs to apply a batch decision only to the selected rows. After a partial revision, prior approvals fill in automatically and the replacement items need a new decision. Review choices stay editable until Send.

A supplemental review may include `review.item_notes` with `text` and `media` arrays aligned with the decision arrays. Use `null` for an item without a note. Each note has a 4 KiB UTF-8 limit. The desktop note buttons stage feedback on the corresponding row until Send. Workers receive the notes with the saved review in production progress.

When a worker claims a Supplemental Outputs stage after a selective review, the claim includes `supplemental_revision`. This carries the source result ID, shared notes, and separate `text` and `media` arrays of unresolved items. Each item has its zero-based slot index, decision, optional note, and previous submitted value. Submit one replacement per listed item in array order. The same request survives lease expiry and takeover. Other claims omit this field.

Use `review-preview-formats <workspace-id> <run-id> <result-id> <decisions-json> <notes>` to review each rendered preview. Supply an array such as `[{"format_id":1,"decision":"approved"},{"format_id":2,"decision":"revise"}]` with one decision per frozen format. If any format needs replacement, claim the stage and use `render-preview` again. The renderer keeps approved files and cuts and rerenders only unresolved formats. A partial revision requires the managed renderer. Once every format is approved, final rendering uses each format's retained or revised cuts.

Desktop Preview review offers individual and selected-format batch decisions for rendered previews that cover all frozen formats. Approved formats are preselected after a partial revision. You can attach a note to a format before Send, or include an optional `note` in each CLI format decision.

MCP and A2A expose the same operation as `review_preview_formats`. A worker claim after a selective review includes `preview_revision`, with the source result ID, shared notes, and only the unresolved formats. Each entry includes the decision, optional format note, previous preview filename, and effective cuts. The request survives lease takeover. To produce the replacement files, use the managed renderer through `render-preview` or the desktop.

## Completed videos

Use `completed-video <workspace-id> <run-id>` to read the current title, captured inputs and settings, verified delivery, production decisions, and activity history together. Use `rename-completed-video <workspace-id> <run-id> <title>` to change the display title while preserving the title in the run snapshot.

Use `add-completed-video-feedback <workspace-id> <run-id> <run|result-id> <markdown>` to comment on a completed video or one of its production results. The comments appear in the completed-video detail. New runs and current-settings replays of the same draft capture those comments as delivery feedback. Captured replays reuse the feedback in the original snapshot.

In the desktop sidebar, open **Completed videos** and select a video to review the verified file list, save a display title, or export the delivery through the native ZIP save dialog.

The completed-video panel also queues a replay with captured or current settings and saves Markdown feedback against the whole video or a selected production result.

The **Video** tab opens the verified player, shows a format picker when several outputs exist, and includes **Subtitle text**. Arrumo streams the selected file through its local loopback interface. Playback uses the desktop WebView's codecs. On Linux, WebKitGTK needs GStreamer H.264 and AAC decoders, such as those provided by `gstreamer1.0-libav` on Ubuntu.

In a guided run's production plan, open **Watch preview** to play a rendered MP4 before submitting the stage decision. Each replacement preview appears with its own attempt number.

The desktop production plan can render a whole-clip preview for recorded-source runs, render the accepted edit at final resolution, and verify delivery after the SRT files are present. Each action claims only the stage shown in the plan.

Use `rename_completed_video` to change a completed run's display title. Use `add_completed_video_feedback` to save Markdown feedback about the full run or a specific production result. Pass the result ID from `get_completed_video` for stage feedback.

Use `delete-completed-video <workspace-id> <run-id> <confirmed-title>` in the CLI to remove a completed run and its managed delivery directory. Use the exact current display title. A run referenced by a replay stays available. If file cleanup is interrupted, rerun the same command to finish the pending cleanup. Shared source assets stay in the workspace library.

Through MCP or A2A, use `delete_completed_video` with `workspaceId`, `runId`, and the exact `confirmedTitle`. It uses the same deletion and resumable file cleanup as the CLI command.

Use `recover-delivery-cleanup <workspace-id>` in the CLI or `recover_delivery_cleanup` in MCP and A2A to retry pending cleanup for previously deleted runs. The report lists completed cleanup and entries that still require attention.

Use `delete-generation <workspace-id> <run-id> <confirmed-title>` or the shared `delete_generation` operation to delete a queued, active, or terminal run. A successful deletion invalidates any worker lease and removes the managed delivery directory. The draft and shared assets remain available. External workers must stop using run paths when their lease becomes invalid.

## Schedule

Schedule a verified output with `set-output-schedule <workspace-id> <run-id> <format-id> <YYYY-MM-DD|clear>`. Each output format can have its own calendar date. Use `scheduled-outputs <workspace-id> <start-date> <end-date> [profile-id]` to list an inclusive range. Calendar entries include the saved profile color and output dimensions.

Through MCP or A2A, use `set_output_schedule` with a workspace, run, and format ID. Pass an ISO calendar `date` or null to clear it. Use `list_scheduled_outputs` with `start` and `end` dates and an optional `profileId` to browse the schedule.

Open the desktop calendar at a specific month and profile with a link such as `arrumo://open/calendar?workspace=1&profile=2&month=2028-02`. Omit the profile for all workspace outputs. Completed-video links can include a `format` ID to select a specific delivered output.

## Notifications

Poll for review, completion and failure events with `list_generation_notifications` and a workspace ID, or with CLI `generation-notifications <workspace-id> <after-id>`. Start with a cursor of zero and pass the last returned event ID when polling again. Each response contains at most 100 events in ascending ID order. Events include the run ID and describe transitions that may have been acted on already.

Completion events include a nullable `read_at` timestamp. To acknowledge a completion, call MCP `read_completion_notification` with the workspace and run IDs or use CLI `read-completion-notification <workspace-id> <run-id>`. Both report whether the state changed. Acknowledgement retains the original event and ID. Refresh from an earlier cursor to observe its updated read state. `read_all_completion_notifications` marks every completion in a workspace as read. The desktop inbox lists reviews and completions newest first with the time they happened and the draft's profile.

While Arrumo is in the background, the desktop also sends each new review, completion and failure event from every workspace to the operating system's notifications through the Tauri notification plugin. Turn this off in **Settings › General › Notifications**, or with MCP `set_notification_settings` (`get_notification_settings` reads it). Clicking one brings Arrumo forward on that run or finished video: the desktop host handles the notification plugin's action, focuses the window and opens the page. Verified on Linux (GNOME) with the server's `ActionInvoked` signal; macOS and Windows report clicks through the same plugin handler but are untested. The in-app inbox always links to the run.
