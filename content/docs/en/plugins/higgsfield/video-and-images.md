---

title: "Generate video clips and images with Higgsfield"
description: "Make clips and images for your library with Higgsfield's Kling, Seedance and Qwen models."
---

## Add your key

Create an API key in the [Higgsfield console](https://console.higgsfield.ai/). In Arrumo, open **Settings › Services and keys**, find Higgsfield and paste the key as `KEY_ID:KEY_SECRET`. A workspace key takes precedence over the app default. Arrumo keeps it in the system credential store, sends it only to Higgsfield's API and never shows it to agents.

Every clip and image uses your Higgsfield credits. When the account runs out, the job fails and Arrumo says why.

## Make a video clip

Open **Assets › Generate › Video clip**, describe the clip, and choose its ratio (16:9, 9:16 or 1:1) and length. **Model** picks one of these:

| Model                        | Without references | With references                              | Length |
| ---------------------------- | ------------------ | -------------------------------------------- | ------ |
| Kling 3.0 Standard (default) | Text to video      | Animates one image                           | 3–15 s |
| Kling 3.0 Pro                | Text to video      | Animates one image                           | 3–15 s |
| Seedance 2.0                 | Not available      | 1–9 images and up to 3 videos, or 1–3 videos | 4–15 s |

Kling 3.0 Pro looks better and costs more. To change the default for a workspace, set **Video model** in the plugin's settings.

Under **References**, pick images or videos from the workspace library. Arrumo tells you when the chosen model can't take that combination. An animated image keeps its own shape, whatever ratio you chose. Clips are silent; add narration or music in the edit.

The finished MP4 joins **Assets**, with a note naming the model that made it.

## Make an image

Higgsfield also makes images with Qwen Image 3 at 2K. In **Assets › Generate › Image**, describe the image and, to edit or restyle, attach one to three reference images. For thumbnails, Higgsfield takes its turn in the workspace's image provider order in **Services and keys**.

## Agents

Agents connected over MCP use `list_video_models` to see each model and the references it takes, and `generate_library_video` or `generate_library_images` with workspace asset IDs as `references`.

## Privacy

Reference files are uploaded to Higgsfield's storage through a short-lived address, without your key. Only the prompt, settings and the references you picked leave your computer.
