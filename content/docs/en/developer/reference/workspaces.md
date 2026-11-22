---

title: "Workspaces, profiles and assets"
description: "Set up what every video in a workspace starts from."
---

## Workspaces

Use `create_workspace` to initialize a workspace; it starts with a random preset icon and color. Use `rename_workspace` to rename it and `set_workspace_appearance` to change its color, icon (one of `clapperboard`, `camera`, `mic`, `sparkles`, `rocket`, `gamepad`, `book`, `palette`, `music`, `code`, `heart`, `leaf`, `briefcase`, `graduation-cap`, `utensils`, `dumbbell`), or the workspace image shown instead. Use `get_workspace_context` and `set_workspace_context` to read or replace its Markdown context. Use `list_profiles`, `create_profile`, and `update_profile` to manage production profiles, and `draft_profile` to let the workspace agent propose a new profile's description and editing guidance from its name and a few words about the videos (nothing is saved), and `set_profile_description` and `set_profile_format_context` for their description and per-format context. Use `share_asset_with_profile`, `unshare_asset_from_profile`, `list_profile_assets`, and `list_asset_profile_shares` to scope workspace assets to profiles. Pass a profile's ID as `profile_id` in draft settings. The queue captures the saved context and profile when it creates the run.

## Backups

Use `arrumo-workspaces <database-path> snapshot-database <new-sqlite-file>`
to capture committed SQLite state, including writes in the source WAL. The
command creates a new file and reports its SHA-256 and byte length. The
snapshot includes SQLite records and stored plugin ZIPs. Managed media,
delivery files, and system-store credentials require separate backup steps.

For a full backup, `export-backup <new-zip>` writes the database snapshot,
managed media and verified deliveries to one ZIP, with a manifest naming the workspaces and installed plugins and listing each
file's size and SHA-256 (`verify-backup <zip>` checks it). Credentials stay in
the system store. `stage-backup-import <zip>` verifies a backup and stages it
beside the database; the desktop app applies it at its next start, before
anything opens the database, and keeps the replaced data in a dated
`workspaces.sqlite.before-import-*` folder (`apply-backup-import` does the same
headlessly; `cancel-backup-import` discards the staged copy). Backups from a
newer Arrumo are refused. MCP and A2A expose `export_backup`, `verify_backup`,
`stage_backup_import`, `get_backup_import_status` and `cancel_backup_import`.
In the app this is **Settings › Import and export**.

## Profiles

To create and list profiles for workspace ID 1:

```sh
cargo run --locked -- ./workspaces.sqlite create-profile 1 "Reviews" "## Keep hands-on demos" "#532A9D"
cargo run --locked -- ./workspaces.sqlite profiles 1
```

To update profile ID 1 within workspace ID 1:

```sh
cargo run --locked -- ./workspaces.sqlite update-profile 1 1 "Tutorials" "## Explain each step" "#532A9D"
```

Pass an empty guidance string to clear it, or omit color on update to clear the color. On creation, guidance and color are optional. Colors use `#RRGGBB`.

A profile also has a one-line description of up to 280 characters, shown in lists, and Markdown context for a single output format. Format context applies only to enabled formats, and saving empty text clears it. Both are captured in generation snapshots with the profile.

```sh
cargo run --locked -- ./workspaces.sqlite set-profile-description 1 1 "Step-by-step tutorials"
cargo run --locked -- ./workspaces.sqlite set-profile-format-context 1 1 2 "Keep each step under 20 seconds."
```

Workspace assets can be shared with a profile as a whole, or with one of its formats. Sharing does not copy the file. A profile-wide share replaces that profile's format shares for the asset, and replacing an asset's file keeps its shares. Runs for a profile capture the shared assets as `profile_assets`, each with its `format_id`, or null for every format.

```sh
cargo run --locked -- ./workspaces.sqlite share-asset 1 3 1        # every format of profile 1
cargo run --locked -- ./workspaces.sqlite share-asset 1 4 1 2      # only format 2
cargo run --locked -- ./workspaces.sqlite profile-assets 1 1
cargo run --locked -- ./workspaces.sqlite unshare-asset 1 4 1 2
```

## Output formats and deliverables

Workspace output formats include Landscape (1920 × 1080) and Portrait (1080 × 1920) by default. For workspace ID 1:

```sh
cargo run --locked -- ./workspaces.sqlite formats 1
cargo run --locked -- ./workspaces.sqlite create-format 1 '{"name":"Square","width":1080,"height":1080,"enabled":true}'
```

Use `update-format <workspace-id> <format-id> <settings-json>` to edit or disable a format, and `remove-format <workspace-id> <format-id>` to remove it.

Profiles see enabled workspace formats and can override width and height independently. The listing returns resolved dimensions and the raw overrides. On save, absent or null fields inherit workspace values.

```sh
cargo run --locked -- ./workspaces.sqlite profile-formats 1 1
cargo run --locked -- ./workspaces.sqlite set-profile-format 1 1 1 '{"width":1280}'
cargo run --locked -- ./workspaces.sqlite set-profile-format 1 1 1 '{}'
```

Disabling a format hides it and preserves its overrides for re-enabling. Removing a format deletes its overrides.

Workspace output formats have supplemental delivery settings for thumbnail, title, and description counts, a tags toggle, and Markdown thumbnail guidance and specifications. Final video and subtitles stay required. Replacing the supplemental settings defaults omitted fields to zero, false, or empty text.

```sh
cargo run --locked -- ./workspaces.sqlite set-format-delivery 1 1 '{"thumbnails":3,"titles":3,"descriptions":1,"tags":true}'
cargo run --locked -- ./workspaces.sqlite format-delivery 1 1
```

Profile delivery settings can override individual workspace values for each enabled format. The read command returns workspace values, overrides, and effective delivery. Saving replaces the profile override set. Omitted and null fields inherit. Zero, false, and empty text are explicit values.

```sh
cargo run --locked -- ./workspaces.sqlite set-profile-delivery 1 1 1 '{"thumbnails":0,"tags":false}'
cargo run --locked -- ./workspaces.sqlite profile-delivery 1 1 1
```

Delivery settings can include `portrait_derivatives`. To request two portrait derivatives from profile ID 1, use `{"portrait_derivatives":{"count":2,"source":{"type":"profile","profile_id":1}}}` as part of the delivery settings JSON. The source profile must belong to the workspace. Use `{"type":"manual","guidance":"…","thumbnails_per_video":2,"thumbnail_guidance":"…"}` as the source to specify the derivative and thumbnail guidance directly. Count zero disables derivative requests. Profile delivery can override the portrait configuration as a unit.

Use `list_output_formats`, `create_output_format`, and `update_output_format` to configure workspace output dimensions. Use `get_format_delivery` and `set_format_delivery` for supplemental deliverables. Sending a replacement resets omitted supplemental fields to their defaults. Final video and subtitles remain required.

Use `list_profile_formats` and `get_profile_delivery` to inspect inherited and effective format settings. Use `set_profile_format_overrides` and `set_profile_delivery` to replace one format's overrides for a profile. Omit a field to inherit its workspace value, or send an empty overrides object to inherit all fields in that group. Explicit zero and false values remain overrides.

Use `remove_output_format` with a workspace and format ID to remove that format from future runs. Captured generation settings retain their original formats.

Use `thumbnail_reference_ids` to select existing image assets in a delivery configuration, including within a manual portrait source. IDs are scoped to the workspace. In profile deliveries, omit the top-level field to inherit the workspace selection or pass an empty list to clear it.

## Assets

Importing a workspace asset copies it into workspace-owned storage alongside the database at `<database>.media/<workspace-id>/<asset-id>`. The source file stays in place. File extensions classify supported image, audio, and video assets.

```sh
cargo run --locked -- ./workspaces.sqlite import-asset 1 ./reference.png
cargo run --locked -- ./workspaces.sqlite assets 1
cargo run --locked -- ./workspaces.sqlite set-asset-notes 1 1 "Keep the product centered"
```

Use `import_workspace_asset` with a workspace ID and an absolute local `source` path to copy a media file into managed storage. Use `list_workspace_assets` to find asset IDs for draft sources. Use `generate_library_images` to make one to four images from a description (`aspectRatio` `16:9`, `9:16`, `1:1` or `4:5`) with the workspace's image providers, or one named `provider`; they join the assets with the given `notes`. Use `generate_library_speech` to voice up to 5,000 characters into an audio asset with the first speech provider (or a named one) and its configured voice. Use `generate_library_video` to make one clip (`16:9`, `9:16` or `1:1`, `durationSeconds` within the model's limits) with the first video provider that has an adapter and a key; it polls the provider for up to its timeout, and the clip joins the assets with the given `notes` and the model used. `list_video_models` lists each video provider's models, the selected one, and the reference images and videos each way of calling it takes; pass `provider` and `model` to choose one, and `references` (workspace image or MP4 asset IDs) to animate or follow them. `generate_library_images` also takes image `references` and reports how many each provider accepted. A named provider that is turned off is refused. `get_provider_usage` reads each keyed provider's allowance through its plugin's SDK `usage.json`, and each installed agent's plan allowance through its schema 11 `usageRun` (unit `percent`, with the window length in `windowMinutes`) (used, limit, reset time and a level: `ok`, `warning` at 20% or less left, `danger` at 10% or less, or `unknown` with the reason); the desktop shows it in Settings › Services and keys, as a dismissible banner across the top, and again above Generate.

Use `replace_workspace_asset` through MCP or A2A with `workspaceId`, the active `assetId`, and an absolute local `source` path to media of the same kind. The returned `asset` has a new ID. Use that ID for subsequent operations on the replacement.

Use `remove_workspace_asset` through MCP or A2A with `workspaceId`, `assetId`, and the exact saved filename as `confirmedName`. It returns `removed: false` when the asset is missing, referenced, or the filename differs. Removing an asset leaves the original import in place.

Use `import_thumbnail_reference` to import a local image with thumbnail reference notes. Use `set_asset_notes` with the workspace ID, asset ID, and Markdown notes to change the asset's usage guidance. Pass an empty string to clear the notes.

Use `set-batch-asset-notes <workspace-id> <asset-ids-json> <markdown>` in the CLI, or `set_batch_asset_notes` in MCP and A2A, to replace notes for multiple workspace assets together. A missing or foreign asset rolls back the entire update.

Read asset labels and grouping with `asset-organization <workspace-id> <asset-id>` or `get_asset_organization` through MCP and A2A. Replace them with `set-asset-organization <workspace-id> <asset-id> <settings-json>` or `set_asset_organization`. Settings contain an optional `group` and a `labels` array. An empty settings object clears both without changing the asset or its references.

Use `replace-asset <workspace-id> <asset-id> <source-path>` to import a same-kind replacement. It returns the new asset ID, carries forward usage notes and organization, and updates draft, brand, and thumbnail references. The previous media stays available to generation runs that captured it. Original files remain in place.

Use `remove-asset <workspace-id> <asset-id> <confirmed-name>` to remove an unused asset and its managed file. Use the exact saved filename. Draft sources, brand assignments, thumbnail references, and captured run references protect their assets from removal. If file cleanup is interrupted, repeat the same command to finish it. At startup, the desktop app retries pending asset cleanup and reclaims superseded managed files without remaining references.

## Context, feedback and brand

The workspace Context view edits production guidance in Markdown. The editor supplies a localized template until the first save. The CLI returns JSON `null` for unset context and an empty string for context explicitly cleared by a user.

```sh
cargo run --locked -- ./workspaces.sqlite set-context 1 '## Audience'
cargo run --locked -- ./workspaces.sqlite context 1
```

Agent feedback cards live in workspace Context. A tool can record an observation locally using `add-feedback <workspace-id> <title> <markdown>`. Use `feedback <workspace-id>` to list cards and `update-feedback <workspace-id> <feedback-id> <title> <markdown>` to revise one. Cards can also be expanded and edited in the desktop app.

The workspace Brand view stores an ordered palette. Use `brand-colors <workspace-id>` to read it and `set-brand-colors <workspace-id> '["#532A9D","#FFFFFF"]'` to replace it. Colors use six-digit hex notation. Use an empty array to clear the palette.

The brand image catalog associates existing workspace images with `identity` (for example, logos or avatars) and `style` (visual reference) roles. An image can serve both roles without another copy of the file.

```sh
cargo run --locked -- ./workspaces.sqlite attach-brand-asset 1 1 identity
cargo run --locked -- ./workspaces.sqlite brand-assets 1
cargo run --locked -- ./workspaces.sqlite detach-brand-asset 1 1 identity
```

Workspace Context uses the editorcn rich-text toolbar with Tiptap Markdown. Use the Markdown source toggle to edit raw Markdown directly, including syntax outside the rich toolbar's formatting options. The workspace continues to store Markdown.

`draft-context <workspace-id> <sources-json> [notes]` (and the `draft_workspace_context` tool) reads up to eight public web pages, such as the creator's website or channel, and lets the workspace's agent draft its context and suggest profiles. Only public addresses are contacted: each redirect is checked and the connection is pinned to the checked address. Pages are passed to the agent as quoted data, unreadable links come back with a reason code, and nothing is saved until the creator saves the draft from **Context**. The draft also suggests brand colours, described and grouped images and profiles; when the agent's plugin accepts images, it looks at up to eight of them (video thumbnails first) to describe what they show. `import-context <workspace-id> <import-json>` (and the `import_workspace_context` tool) adds the suggestions the creator keeps, as `{"colors": [...], "images": [...], "profiles": [...]}`, downloading images from public addresses only. Each link it tries is remembered with whether it could be read; `list_context_sources` lists them and `forget_context_source` drops one, and the Context page shows them as chips with the last read date.

Use `list_workspace_feedback`, `add_workspace_feedback`, and `update_workspace_feedback` to manage workspace guidance cards. Use `get_brand_colors` and `set_brand_colors` to read or replace the workspace palette; `get_brand_colors` also returns `palette`, each color's name and whether videos use it, and `set_brand_color_details` changes those. Generation reads only the colors videos use. New generation runs capture both inputs.

Use `list_brand_assets`, `attach_brand_asset`, and `detach_brand_asset` through MCP or A2A to manage which workspace images serve as identity assets or style references. Removing a role keeps the image in the workspace library.
