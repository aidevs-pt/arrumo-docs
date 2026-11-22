---

title: "Provider adapters"
description: "Describe transcription, speech, music, sound-effect, image, video, usage and translation providers."
---

## Bundled transcription adapter

Include adapter descriptors explicitly when packaging a provider. The packager
validates recognized root descriptors against their SDK schemas and the package
manifest before it writes the ZIP.

The [transcription descriptor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/transcription.schema.json) is a versioned host contract for reviewed, bundled providers. The descriptor identifies a plugin with the `transcription` capability and names a secret field declared in that plugin's manifest. It also declares the HTTPS endpoint, credential header, and model. The host reads the configured credential from its system store and builds the request itself. Bundled plugins can supply a separate `transcription-timed.json` using the same schema for delivery captions. Its `response.words` mapping describes timed text units, which may be words or full segments. Without a timed descriptor, the host uses the standard descriptor when it declares a timing mapping.

The descriptor declares the multipart file field, static form fields, credential prefix, input limit, and JSON response field pointers. Optional word mappings select timestamped tokens and optional speaker labels. The host applies these declarations using a generic HTTPS transport with redirects disabled. Only descriptors in the reviewed application bundle can use this transport.

## Describe a speech synthesis adapter

A plugin declaring `text-to-speech` can provide a `speech-synthesis.json`
[descriptor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/speech-synthesis.schema.json) for a reviewed HTTPS JSON POST API
that takes a voice identifier as the last path segment. The descriptor names
the JSON text field, static body and query values, response encoding, and the
workspace secret setting used for authentication. The response encoding is
`mp3` or `wav`.

The host must match the descriptor's plugin ID to the manifest and check the
credential against a declared workspace secret. It must reject credentials,
queries, fragments, dot segments, and non-HTTPS URLs in the endpoint, and
reject a static body key that conflicts with the text field. Hosts must append
the caller's voice ID as one encoded path segment, encode query values, apply
the descriptor's Unicode character limit, refuse redirects, and bound and
validate the audio response before storing it. The host owns credentials and
must redact provider errors. The descriptor is for trusted provider inputs.

An optional `voiceSetting` names a non-secret string setting declared in the
manifest where creators choose a voice, and `defaultVoice` is the voice used
when that setting is empty. Hosts use them when a workflow needs speech
without asking for a voice, such as narrating a storyboarded video.

Schema 2 adds named models. `models` maps each model ID to a `label`, a `bestFor` line (`en`
required, `es` and `pt` optional), `body` fields that replace the adapter's, and the model's own
`maxTextCharacters`. `model.default` picks one when the caller names none, and `model.setting` can
name a string setting whose `choices` are exactly the model IDs. Agents list them with
`list_speech_models` and pass `model` to `generate_library_speech`.

## Describe a music and sound-effect adapter

A plugin can provide an `audio-generation.json` [descriptor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/audio-generation.schema.json) with a
`music` kind, a `sound-effect` kind, or both. Each kind needs its own
capability, `music-generation` or `sound-effect-generation`, and describes one
reviewed HTTPS JSON POST: its endpoint, the prompt and duration fields, whether
the duration is sent in `seconds` or `milliseconds`, the allowed length in
seconds, the prompt's character limit, and static body and query values. Body
values can be strings, numbers or booleans. The response is one `mp3` or `wav`
file, and the credential is a workspace secret.

The host checks the same endpoint, redirect, credential and response rules as
for speech, rejects a static body key that repeats the prompt or duration
field, and refuses lengths outside the kind's range before calling the
provider. The result becomes a workspace audio asset. ElevenLabs uses it for
instrumental music (3 to 600 seconds) and sound effects (0.5 to 30 seconds).

## Describe a voice changer or isolation adapter

An `audio-transform.json` [descriptor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/audio-transform.schema.json) declares multipart HTTPS
POST endpoints that take one sound and return processed audio. `voice-change` needs the
`voice-changer` capability, appends the voice as the last path segment and requires a
`voiceSetting`. `voice-isolation` needs the `voice-isolation` capability. Each names the file
field, fixed text fields and query values, and the shortest and longest input it takes.

The host converts the asset's soundtrack to MP3, checks its length and size, posts it with the
workspace secret, recognises MP3, WAV, FLAC or Ogg from the returned bytes and stores it as a new
asset whose notes name the source. Agents use `list_audio_transforms` and `transform_audio_asset`.

## Describe a dubbing adapter

A plugin declaring `dubbing` can provide a `dubbing.json` [descriptor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/dubbing.schema.json)
for an asynchronous job in three steps. `create` uploads the MP3 soundtrack as multipart with the
target language and reads the job ID from `idField`. `status` is polled every five seconds at an
endpoint with an `{id}` segment until `statusField` holds a `done` or `failed` value or
`errorField` has a message. `result` downloads the dub from an endpoint with `{id}` and
`{language}` segments. `languages` lists the codes offered, and `maxWaitSeconds` bounds the wait.
Agents use `list_dubbing_providers` and `dub_asset`.

## Describe an image generation adapter

A plugin declaring `image-generation` can provide an `image-generation.json`
[descriptor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/image-generation.schema.json) for an HTTPS JSON POST API that
returns one base64-encoded image. The `request` is a JSON template: string
values that are exactly `{prompt}`, `{aspectRatio}` or `{model}` are replaced,
and `{prompt}` must appear. `aspectRatios` maps the ratios Arrumo asks for
(`16:9`, `9:16`, `1:1`, and optionally more) to the provider's value, such as a
pixel size or the ratio itself. The endpoint may contain `{model}` in a path
segment. `model.default` is used unless the creator sets the string setting
named by `model.setting`, so providers can move to newer models without a new
release. `response.image` points at the base64 data; with `response.items`, the
host uses the first array item where that pointer resolves.

The host checks the descriptor against the manifest, sends the workspace secret
in the declared header, refuses redirects, bounds the response by
`maxImageBytes`, verifies that the decoded bytes are a PNG, JPEG or WebP image,
and stores it as a workspace asset. Providers are tried in the run's captured
`image-generation` order; one without a configured credential is skipped.

Schema 2 adds asynchronous providers. With `job`, the host reads the status
address from the submitted job, polls it on the endpoint's host with the
credential, and downloads the finished image at `job.status.image` without it,
the same way as video adapters; `response` is then left out. With `urls`
references, each reference image is uploaded through `upload` (see the video
adapter) and the public addresses are set as `field` of the JSON request posted
to the references `endpoint`.

Schema 3 adds named models. `models` maps each model ID to its `label`, a
`bestFor` line (`en`, and optionally `es` and `pt`) and its own `endpoint`,
`aspectRatios`, `request` and `references`; a model without `references` takes
none. `model.default` must be one of them, and the `model.setting` choices must
match the model IDs. Creators see each model's label and best-for line under
**Model** in Generate, and agents read them from `list_image_models` and pass
`model` to `generate_library_images`. A `urls` reference can set `single` to
send the first address as a string, for providers that take one image.

## Describe a video generation adapter

A plugin declaring `video-generation` can provide a `video-generation.json`
[descriptor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/video-generation.schema.json) for an asynchronous HTTPS API. The
host POSTs the `request` template with `{prompt}`, `{aspectRatio}` and
`{duration}` filled in (the duration as a number, clamped to `durations`),
reads the job's status address from `submission.statusUrl`, and polls it every
`pollSeconds` until `status.state` is one of `completed` or `failed`, or until
`timeoutSeconds` pass. The status address must be HTTPS on the endpoint's host,
because it receives the credential. `status.video` points at the finished
clip's HTTPS address, which the host downloads without the credential, bounds
by `maxVideoBytes`, verifies as MP4, MOV or WebM, and stores as a workspace
asset. `status.error` can point at a short reason shown to the creator.
Providers are tried in the workspace's `video-generation` order; one without a
configured key, or without the requested ratio in `aspectRatios`, is skipped.

Schema 2 descriptors can offer several models. `models` maps each model ID to
up to four request variants; the host calls the first variant whose `images`
and `videos` ranges fit the reference media the creator or agent attached (an
absent range takes none), so one model can have text-to-video, image-to-video
and reference-to-video endpoints. `model.default` and an optional string
setting with matching `choices` pick the model when the caller names none.
References are workspace image or MP4 assets: the host uploads each through
`upload` (a credentialed POST on the provider's host that returns a presigned
HTTPS address and a public one, then a PUT without the credential) and fills
`{image}`, `{images}`, `{video}` or `{videos}` with the public addresses. The
top-level `endpoint`, `aspectRatios`, `durations` and `request` stay as the
schema 1 fallback.

Schema 3 lets a model be an object with a `label`, a `bestFor` line and its
`variants`, shown to creators under **Model** and to agents in
`list_video_models`. `durations.allowed` lists the only lengths a model takes;
the host moves a requested length to the nearest of them. A variant that takes
a reference video may leave out `durations`, and the clip then follows that
video's length; its request must not use `{duration}`. A variant taking up to
two images can use `{image}` for the opening frame and `{lastImage}` for the
closing one. Setting `choices` can list up to 64 models.

## Describe a usage adapter

A provider plugin can add a `usage.json` [descriptor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/usage.schema.json) so
creators see how much of its allowance is left. The host sends a GET to
`endpoint` with the workspace credential, refuses redirects, and reads the
numbers at the `used` and `limit` pointers (and optionally `resetsAt`, in Unix
seconds). Arrumo shows the remaining share in Settings › Services and keys,
warns across the top of the app at 20% left and again in the danger color at
10%, and repeats the warning before a generation that uses the provider. A
failed read is shown as unknown, never as empty.

## Local subtitle translators

A bundled provider can declare the `subtitle-translation` capability and ship
`tools/translate-subtitles.py` in its development checkout. The script reads
a JSON object with `targetLanguage` and `cues` from stdin and writes an object
with `translations` to stdout. Both cue arrays use `{ "cue": 1, "text": "…" }`
items. Cue IDs are positive integers and must match exactly across the request
and response. Translation adapters own provider authentication and must keep
credentials out of the response.

Auto-Dubbing resolves this entry point only for explicitly selected bundled
plugin IDs in its local checkout workflow. This convention relies on trusted
local plugin sources.
