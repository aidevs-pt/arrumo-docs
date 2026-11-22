---

title: "Plugins and providers"
description: "Install, configure, order and run plugins from the host side."
---

## Catalog and installation

The app database also holds a plugin manifest catalog. With the database path as the first CLI argument, use `plugin-catalog` to inspect bundled and locally registered SDK manifests, `install-plugin-manifest <manifest.json>` to register a manifest, `remove-plugin-manifest <plugin-id>` to remove a local entry, and `set-plugin-active <plugin-id> on|off` to turn a plugin on or off. The catalog validates SDK v1 through v6 metadata and reserves the IDs of bundled plugins. Local entries are metadata only. The agent selector and sign-in probes use the bundled agent adapters until the host supports runtime grants.

Use `install-plugin-zip <package.zip>` to register a local ZIP containing a root SDK `manifest.json`. The catalog reports the package size and SHA-256 digest and retains the original ZIP in the app database. Removing the local entry removes its stored ZIP. The CLI displays the third-party plugin notice on registration. ZIP contents remain inert.

Use `install-plugin-repository <https://github.com/owner/name>` to install from the latest release of a public GitHub repository. Arrumo takes the release asset named `plugin.zip`, or its only ZIP, downloads it only from GitHub hosts, checks the SHA-256 digest GitHub publishes for the asset when there is one, and then applies the same checks as a local ZIP. Through MCP and A2A, `install_plugin_from_repository` also needs the reviewed `packageSha256`. In the desktop app it's **Settings › Plugins › From repository**. Publish your plugin as a release asset named `plugin.zip` so creators can install it this way.

Pass `--sha256 <digest>` after the ZIP path to compare the package against an independently obtained release checksum before registration. A malformed or mismatched digest prevents registration. A checksum establishes that the package matches the expected bytes. Publisher trust still depends on how you obtained the checksum.

Use `install-plugin-release <catalog.json> <plugin-id> <version> <package.zip>` to verify a local ZIP against a selected release in a local registry snapshot. Arrumo verifies supported manifest compatibility, the ZIP checksum, and the manifest's plugin ID, then records the declared version and source URLs in the catalog. This command accepts the two files locally. Registry synchronization and remote downloading remain separate work.

Use `download-plugin-release <catalog-url> <plugin-id> <version>` to fetch an exact release from an HTTPS registry and register it locally. Arrumo verifies the release using the same checks as local snapshot registration and records the registry URL. The command expects a registry and package that can be fetched without authentication.

List plugin IDs, source repositories, defaults, and available release versions with `read-plugin-registry <catalog.json>` or `fetch-plugin-registry <catalog-url>`. This host supports manifest schemas 1 through 10; schema 10 lets a setting name a `helpUrl`, which the desktop opens as Where to find it through `open_plugin_setting_help`, reading the address from the installed manifest. Entries with an empty release list have no downloadable version in that catalog. Both commands validate the catalog and can run without opening the app database.

In desktop Settings, open **Browse registry** under **Plugins** and load an HTTPS catalog URL. Expand a plugin to review its source repository and available versions. Arrumo checks the reviewed release again before downloading. If its source or checksum changed, reload the catalog and review the release again.

Use `update-plugin-release <plugin-id> <version>` to replace a remotely installed package with a newer SemVer release from its recorded HTTPS catalog and source repository. Arrumo validates the replacement before saving it and checks that the installed release did not change during the download. Updates to bundled plugins ship with Arrumo.

For packages installed from a local registry snapshot, use `update-plugin-release-from-snapshot <catalog.json> <plugin-id> <version> <package.zip>`. Use a catalog snapshot obtained independently of the ZIP. Arrumo requires the recorded source repository and a newer compatible release and verifies the ZIP before replacing the installed package. Remotely installed packages continue to use their recorded HTTPS catalog.

When you load the same registry in desktop Settings, installed packages show **Update** for newer compatible releases from their recorded repository. Review the release and confirm the update. Local-snapshot packages use the offline CLI update command.

Plugins introduce themselves through the optional `introduction` in their
manifest (schema 8). Plugins that arrive after the first launch are shown once
in a shared tour; the first check records everything already present as seen.
MCP and A2A expose `get_plugin_tour` and `finish_plugin_tour`.

Use `install_plugin_zip` with an absolute local source path and the expected `packageSha256` to install a reviewed package. The digest must match the archive before registration. The response includes the installed catalog entry and the third-party plugin notice. Workspace context access requires a separate grant.

Use `install_plugin_release_from_snapshot` or `update_plugin_release_from_snapshot` with absolute local `catalog` and ZIP `source` paths, the plugin ID, and an exact version. The host verifies the archive against the catalog and records release provenance. Offline updates require a newer release from the same repository.

Use `fetch_plugin_registry` to inspect an HTTPS registry catalog, or `read_plugin_registry_snapshot` to validate a catalog at an absolute local path. Both return release metadata for review before installation.

Use `install_reviewed_plugin_release` and `update_reviewed_plugin_release` with the catalog URL, plugin ID, repository, and exact release object returned by registry discovery. The host checks the metadata again before downloading the package and verifies the archive digest before registration. Updates require a newer release from the original registry and repository.

Turn a plugin on or off for the whole app on its page in **Settings › Plugins**, or with `set_plugin_active` (`pluginId`, `active`) through MCP or A2A. A plugin that is off keeps its settings, but Arrumo does not run it: it leaves provider orders (including orders a run captured earlier), action listings and jobs, hooks, frontend surfaces, usage reads and the agent list. Bundled plugins start on; imported plugins start off, except imports installed before this switch existed. An agent can't be turned off while the app, a workspace or an unfinished video uses it.

Use `remove_reviewed_plugin_package` through MCP or A2A with the plugin ID and its installed package SHA-256. A mismatched digest leaves the installed revision intact. Uninstalling removes that package's stored settings and grants.

Use `list_plugin_catalog` to discover plugin IDs and declared settings. Use `get_plugin_credential_status` for a declared credential and optional workspace ID. The response reports configuration flags and the effective source. Set credentials through desktop Settings or the CLI's redirected-stdin command.

## Settings and credentials

Use `plugin-settings <plugin-id> <app|workspace-id>` to read declared non-secret values and their effective source. Use `set-plugin-setting <plugin-id> <app|workspace-id> <setting-id> <value-json>` to store a string, boolean, or signed 64-bit integer. Use `clear-plugin-setting <plugin-id> <app|workspace-id> <setting-id>` to unset a value. Clearing a workspace override restores its app default. Empty strings, `false`, and `0` are explicit values. Secret fields require separate credential storage and are excluded from these commands.

Desktop Settings shows **Plugin settings** when an installed manifest declares editable non-secret fields. Choose the app scope to set defaults or a workspace scope to override workspace fields. **Use app default** clears an override. The form shows where each effective value comes from.

Use `plugin-credential-status <plugin-id> <app|workspace-id> <setting-id>` to read configuration flags and the effective scope for a bundled provider's declared secret. Use `set-plugin-credential <plugin-id> <app|workspace-id> <setting-id>` with the credential on redirected standard input, or `clear-plugin-credential <plugin-id> <app|workspace-id> <setting-id>` to remove it. A workspace credential overrides the app credential. Secret bytes are stored in the system credential store. On Linux this requires an available Secret Service session, and building from source requires D-Bus development headers. CLI output reports status only.

In desktop Settings, expand a bundled provider under **Plugin settings** to save or remove its credential at the app or workspace scope. Arrumo shows whether a credential is configured and where it comes from. Removing a workspace credential restores the app credential when one is configured.

Use `get_plugin_settings`, `set_plugin_setting`, and `clear_plugin_setting` to manage SDK-declared non-secret settings. Omit `workspaceId` for app scope. Clearing a workspace override restores inheritance. Stored credentials are excluded from these tools.

Use `clear_plugin_credential` with a plugin and setting ID to remove an app credential. Include `workspaceId` to clear only that workspace's credential and restore inheritance.

## Provider order

Use `provider-preferences <capability> <app|workspace-id>` to inspect the catalog candidates and effective provider order. Use `set-provider-preferences <capability> <app|workspace-id> <order-json>` with an ordered JSON array of plugin IDs. An empty array explicitly selects no providers. Use `clear-provider-preferences <capability> <app|workspace-id>` to inherit. The default order contains only bundled plugins. Eligibility here reflects declared capabilities. Runtime readiness and execution are separate.

New generation runs capture the effective provider order and its source for each capability. A replay using captured settings preserves that order. A replay using current settings resolves it again. Agent selection continues to use the separately captured agent settings. Snapshots created before provider order capture remain readable.

The `enqueue-draft` options JSON can include `provider_overrides`, a map from capability ID to an ordered array of provider plugin IDs. An omitted capability inherits the workspace or app order. An empty array disables providers for that capability for this run. Both replay modes preserve the requested per-run overrides. A replay with current settings revalidates the requested providers. Agent selection uses the agent settings.

In the desktop generation form, expand **Providers for this run** to include or exclude individual providers. **Use saved order** clears a capability override. Closing the disclosure preserves your selections for that draft. Submitting the run leaves the workspace preferences unchanged.

Use `list_provider_preferences` or `get_provider_preferences` to inspect provider availability, effective ordering, and provenance. Use `set_provider_preferences` to save an order and `clear_provider_preferences` to restore inheritance. Omit `workspaceId` for app scope. Passing an empty order explicitly disables providers for the capability at that scope.

## Transcription and speech

Use `transcribe-wav <workspace-id> [plugin-id] <audio.wav>` to submit a WAV to a bundled transcription adapter. Omit the plugin ID to use the effective provider order. Each plugin declares its limits and transcript fields. The host skips unavailable adapters, oversized inputs for a particular adapter, and missing credentials before upload. An HTTP 401, 403, or 429 permits fallback. Other failures stop the request. This is an explicit cloud upload.

Use `synthesize-speech <workspace-id> <plugin-id> <voice-id> <new-audio-file>` to send UTF-8 text on stdin to a trusted bundled speech provider. The output extension must match the adapter's response format. The editor resolves the configured workspace credential with app fallback, validates the returned audio with FFprobe, and saves it without overwriting an existing file. This command makes one provider request per invocation.

Use `speech-provider-status <workspace-id> <plugin-id>` to read the bundled
provider's response format, maximum cue length, adapter digest, and configured credential scope
before synthesis. The command makes no provider request.

## Runtime, permissions and panels

The bundled plugin index is generated from the official registry defaults and local plugin checkouts. Provider-specific transcription settings live in the plugin's SDK descriptor. Manifest schema v3 accepts ZIPs with declared WebAssembly backend and HTML frontend entrypoints, validates their presence, and retains the code. Installed backend components support explicit CLI invocation. Installed frontend panels render from declared documents. Workspace-scoped panels can request explicitly granted context access.

Use `invoke-plugin <plugin-id>` with JSON on standard input to invoke an installed package's declared WebAssembly backend. The runtime instantiates the component with no host imports or WASI and limits its size, execution fuel, linear memory and JSON payloads. The result is JSON on standard output.

A plugin that declares workspace context access needs a separate grant. Use `grant-plugin-context <plugin-id> <workspace-id>`, `plugin-context-grant <plugin-id> <workspace-id>`, and `revoke-plugin-context <plugin-id> <workspace-id>` to grant, check, or revoke access. Pass the workspace ID to `invoke-plugin <plugin-id> <workspace-id>` to use the grant. Revocation and package updates affect subsequent invocations. Each invocation sees only the context selected at its start.

Desktop Settings, workspace Context, and completed video details can show **Plugin panels** from installed ZIPs. Opening a panel loads its declared HTML from a dedicated local protocol and checks the package revision. A sandbox isolates the panel from the editor and its native commands.

In desktop Settings, choose a workspace and open **Plugin permissions** to grant or revoke context access for a requesting plugin. The confirmation names the plugin and workspace, and the host verifies the package revision before applying your choice.

Workspace and completed video plugin panels can request the host’s selected workspace context if their manifest declares that permission and the operator grants it. The bridge handles one request per panel opening and rechecks the package revision and grant before returning the context.

Use `list_plugin_context_requests` with a workspace ID to inspect packages that request workspace context access. After reviewing a package, call `apply_reviewed_plugin_context_grant` with the workspace ID, plugin ID, the listed package SHA-256, and the desired `allowed` value. The host rejects a digest that no longer matches the installed package.

## Actions, jobs and hooks

Use `plugin-actions` to discover named backend actions. Invoke an action with `invoke-plugin-action <plugin-id> <action-id> <app|workspace-id>` and pass JSON on standard input. The host validates the action's declared scope before running the component.

In desktop Settings, expand an action under **Plugin actions**. The Settings scope determines which actions are shown. Fill in the form the action declares (schema 9 `inputs`), or enter JSON for actions without one, select **Run action**, and review the result. Actions that declare `placements` also appear in a **Plugin actions** card beside drafts, on generation pages or on finished videos, where a subtitles input offers the tracks of the video in view; `completed-video` actions also appear in the right-click menu of finished videos and their player. The editor checks that the package matches the version shown when the form was opened. Actions that declare `hooks` also run on their own: a `video-completed` hook queues one action job per finished video, after delivery verification, while the boolean setting it names is on for the workspace. The job receives the video's title, outputs and approved texts, and its ID derives from the video and action, so a repeated event never runs it twice. Generation options list the hooks switched on for the workspace; turning one off adds it to the run's `skip_hooks` (`plugin-id/action-id`), so that video does not run it.

Send a JSON object with `id` (a caller-generated UUID), `pluginId`,
`actionId`, `packageSha256`, `input`, and `workspaceId` for workspace
actions to `queue-plugin-action-job` on stdin. Repeating the same request
returns the existing job. Reusing the UUID with changed input or scope fails.

Read a job with `plugin-action-job <app|workspace-id> <job-id>`. Run a queued
job with `process-plugin-action-job <app|workspace-id> <job-id>`. Processing
checks the reviewed package again, retains the result, and can reclaim a job
after its two-minute lease expires. MCP and A2A expose these as
`queue_plugin_action_job`, `get_plugin_action_job`, and
`process_plugin_action_job`. These jobs run declared Wasm actions in the
existing sandbox. Job requests persist their input, so include only the data
the action needs. A job whose plugin was turned off after it was queued does not run.

Run `arrumo-workspaces <database-path> watch-plugin-action-queue` as a
foreground worker for queued Wasm actions when the desktop is closed. It
claims queued jobs and recovers expired leases. Read each outcome through
the same job status commands. The worker writes no job input or result to
its console. Stop it with Ctrl+C.

The desktop **Plugin actions** panel records each run as a job and includes
recent jobs in the selected scope. While the desktop app is open, it processes
queued jobs and recovers interrupted jobs after their leases expire. The panel
refreshes when a job finishes. Use **Process job** to claim a specific job when
it is available. To list jobs from the CLI, use
`list-plugin-action-jobs <app|workspace-id>`. MCP and A2A expose
`list_plugin_action_jobs`.
