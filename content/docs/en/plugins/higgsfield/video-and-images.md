---

title: "Generate video clips and images with Higgsfield"
description: "Make clips and images for your library with Higgsfield's 45 video and 15 image models."
---

[![Watch “Arrumo + Higgsfield: what it can do” on YouTube](/tools/arrumo/static/media/videos/06-arrumo-with-higgsfield.webp)](https://youtu.be/a8z9Aql6qPg)

_Every clip and image in this video was generated with this plugin, and Arrumo made the whole video._

## Add your key

Create an API key in the [Higgsfield console](https://console.higgsfield.ai/). In Arrumo, open **Settings › Services and keys**, find Higgsfield and paste the key as `KEY_ID:KEY_SECRET`. A workspace key takes precedence over the app default. Arrumo keeps it in the system credential store, sends it only to Higgsfield's API and never shows it to agents.

Every clip and image uses your Higgsfield credits. When the account runs out, the job fails and Arrumo says why. Some models may not be open to every account; Higgsfield's reason is shown when a job is refused.

## Make a video clip

Open **Assets › Generate › Video clip**, describe the clip and choose its size. Pick Higgsfield under **Made with**, then a **Model**: the line under it says what the model is best for, and **Length** offers only the lengths that model takes. Models whose name ends in _References_ follow the images and videos you attach; _Edit_, _Extend_, _Motion Control_ and _Genjutsu_ models work on a clip you attach, and the result follows its length.

| Model                             | Best for                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Cinema Studio 4.0                 | Film-style shots of 4–30 s from text, up to nine images or three videos; the model picks lens, light and pacing.                |
| Genjutsu Motion Transfer          | Puts the people or characters from up to eight images into a source video's motion (at least 4 s; longer than 30 s is trimmed). |
| Genjutsu Object Swap              | Replaces an object in a source video with the one in your images, keeping the shot's motion.                                    |
| Grok Imagine Video 1.5            | Short 720p clips of 1–15 s that start on one image or follow up to seven reference images.                                      |
| Hailuo 2.3 Standard               | Animates one image into a 6 or 10 s clip at 768p.                                                                               |
| Happy Horse 1.0                   | Alibaba's video model for 1080p clips of 2–15 s from text or a first frame.                                                     |
| Happy Horse 1.0 References        | Happy Horse following up to nine reference images of a subject or style.                                                        |
| Happy Horse 1.1                   | The newer Happy Horse, 1080p by default, from text or a first frame.                                                            |
| Happy Horse 1.1 References        | Happy Horse 1.1 following up to nine reference images.                                                                          |
| Kling 2.5 Turbo Pro               | 5 or 10 s clips from text or one image. Its text API takes no size, so Arrumo asks it for 16:9 only.                            |
| Kling 2.5 Turbo Standard          | Animates one image into a 5 or 10 s clip, at the Turbo Standard tier.                                                           |
| Kling 2.6 Motion Control Pro      | Kling 2.6 motion transfer at the Pro tier.                                                                                      |
| Kling 2.6 Motion Control Standard | Kling 2.6 motion transfer: an image's character follows a 3–30 s reference video's movement.                                    |
| Kling 2.6 Pro                     | The previous Kling generation: 5 or 10 s clips from text or one image.                                                          |
| Kling 3.0 4K                      | Kling 3.0 rendered in 4K, for big screens or crops in the edit.                                                                 |
| Kling 3.0 Motion Control Pro      | Kling 3.0 motion transfer at the Pro tier: an image's character follows a 3–30 s reference video.                               |
| Kling 3.0 Motion Control Standard | Moves the character in your image the way the person in a 3–30 s reference video moves; the clip runs as long as the video.     |
| Kling 3.0 Pro                     | Kling 3.0's Pro tier, above Standard, with the same inputs.                                                                     |
| Kling 3.0 Standard (default)      | Kling 3.0's Standard tier: 3–15 s from text, a first frame, or first and last frames.                                           |
| Kling 3.0 Turbo                   | Kling 3.0's Turbo tier: 1080p clips from text or one image, with prompts up to 3,000 characters.                                |
| Kling O3                          | Clips that start on one image and can land on a second, 3–15 s.                                                                 |
| Kling O3 Edit                     | Changes an existing 3–15 s clip with an instruction, such as swapping the setting or an object, optionally guided by images.    |
| Kling O3 References               | Keeps characters, products or places consistent from up to four images, or follows a reference video's camera and style.        |
| Kling Omni                        | The earlier Omni model for 5 or 10 s clips between a first and an optional last frame.                                          |
| Kling Omni Edit                   | Edits an existing 3–10 s clip with an instruction, optionally guided by images.                                                 |
| Kling Omni References             | Omni with up to four reference images or one reference video, for consistent subjects.                                          |
| LTX-2.5 Fast                      | LTX-2.5's Fast tier: 6, 8 or 10 s in 16:9 or 9:16, from text, a first frame or first and last frames.                           |
| LTX-2.5 Pro                       | LTX-2.5's Pro tier: 6, 8 or 10 s in 16:9 or 9:16 from text or one image.                                                        |
| MiniMax H3                        | 2K clips of 5–15 s from text, a first frame, or first and last frames.                                                          |
| MiniMax H3 References             | MiniMax H3 following up to nine images or three videos.                                                                         |
| PixVerse V6                       | 1080p clips of 1–15 s from text.                                                                                                |
| Seedance 2.0                      | 1080p clips of 4–15 s from text, a first frame, or first and last frames.                                                       |
| Seedance 2.0 References           | Follows up to nine reference images and three reference videos at once: characters, products, style and camera moves.           |
| Seedance 2.5                      | Longer shots, up to 30 s, from text or frames, at high bitrate.                                                                 |
| Seedance 2.5 Edit                 | Edits an existing clip from an instruction, optionally with images of what to bring in.                                         |
| Seedance 2.5 Extend               | Continues an existing clip by 4–30 s, picking up where it ends.                                                                 |
| Seedance 2.5 References           | Seedance 2.5 following up to nine images and three videos, for long consistent shots up to 30 s.                                |
| Wan 2.6                           | Animates one image into a 5, 10 or 15 s 1080p clip.                                                                             |
| Wan 2.6 References                | 5 or 10 s 1080p clips that follow one to three reference videos.                                                                |
| Wan 2.7                           | 1080p clips of 2–15 s from text, a first frame, or first and last frames.                                                       |
| Wan 2.7 References                | 2–10 s 1080p clips in 16:9 or 9:16 that follow up to five reference images or videos.                                           |
| Wan 3.0                           | Long 1080p clips, 2–30 s, from text, a first frame, or first and last frames.                                                   |
| Wan 3.0 Prime                     | Wan 3.0's Prime tier, with the same inputs as Wan 3.0.                                                                          |
| Wan 3.0 Prime References          | Wan 3.0 Prime with up to nine images and three videos as references.                                                            |
| Wan 3.0 References                | Wan 3.0 following up to nine images and three videos for consistent subjects in long shots.                                     |

To change the default for a workspace, set **Video model** in the plugin's settings.

Under **References**, pick images or videos from the workspace library. With two images, models that take frames use the first as the opening frame and the second as the closing one. Arrumo tells you when the chosen model can't take that combination or size. Clips are silent; add narration or music in the edit. The finished MP4 joins **Assets**, with a note naming the model that made it.

## Make an image

In **Assets › Generate › Image**, pick Higgsfield and a **Model**. Models that take reference images use the ones you attach, up to the number in the table. For thumbnails, Higgsfield takes its turn in the workspace's image provider order in **Services and keys** and uses the **Image model** setting.

| Model                         | Best for                                                                                               | References |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ | ---------- |
| Ads Studio                    | Turns a marketing brief and up to eight product references into an ad concept image.                   | Up to 8    |
| Grok Image 2.0                | Generates or edits with many references (up to eight here), for combining people, products and places. | Up to 8    |
| Ideogram 4.0                  | Images with lettering, such as posters, titles and thumbnails; remixes one reference image.            | Up to 1    |
| Marketing Studio 2.0          | Campaign images, generated or edited from up to eight references such as product photos.               | Up to 8    |
| Marketing Studio 2.5 Flare    | Marketing Studio 2.5 Flare, the newer campaign image model, with up to eight references.               | Up to 8    |
| Marketing Studio 2.5 Sunburst | Marketing Studio 2.5's Sunburst variant, with up to eight references.                                  | Up to 8    |
| Qwen Image 3 (default)        | 2K images from a description, or edits of up to three reference images.                                | Up to 3    |
| Recraft V4.1                  | Recraft V4.1 at 1K.                                                                                    | None       |
| Recraft V4.1 Pro              | Recraft V4.1 at 2K.                                                                                    | None       |
| Recraft V4.1 Utility          | Recraft V4.1's Utility variant at 1K.                                                                  | None       |
| Recraft V4.1 Utility Pro      | Recraft V4.1's Utility variant at 2K.                                                                  | None       |
| SOUL                          | Higgsfield's own SOUL text-to-image model, at 1080p.                                                   | None       |
| SOUL 2                        | The second version of SOUL, at 1080p.                                                                  | None       |
| SOUL Cinema                   | SOUL with its fixed cinema style, at 1080p.                                                            | None       |
| Z-Image Turbo                 | Turbo 2K images from short descriptions (up to 800 characters).                                        | None       |

## Not offered here

Workflows that need Higgsfield presets or trained IDs (Genjutsu Restyle, Soul ID characters, Kling elements and multi-shot prompts) aren't offered. Text-to-video for Hailuo 2.3 and Wan 2.6 is left out because those APIs take no size, and PixVerse V6 image-to-video is not included yet.

## Agents

Agents connected over MCP use `list_video_models` and `list_image_models` to see each model, what it is best for and what it takes, then pass `provider` and `model` to `generate_library_video` or `generate_library_images`, with workspace asset IDs as `references`.

## Privacy

Reference files are uploaded to Higgsfield's storage through a short-lived address, without your key. Only the prompt, settings and the references you picked leave your computer.
