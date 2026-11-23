---

title: "Tutorial: from your website to a finished video"
description: "Set up a workspace from your website, start a video from a short brief, review each stage and export it, in about an hour."
---

This tutorial makes a short explainer video from scratch, the way the videos in these docs were made. You need Arrumo, and [Claude Code](../plugins/claude-code/setup.md) or [Codex](../plugins/codex/setup.md) installed and signed in. A voice provider such as [ElevenLabs](../plugins/elevenlabs/narration.md) adds narration; without one, the video uses on-screen text.

[![Watch “Meet Arrumo” on YouTube, made with these steps](/tools/arrumo/static/media/videos/01-meet-arrumo.webp)](https://youtu.be/v2KcwE8xuso)

## 1. Create a workspace from your website

On first launch, Arrumo asks for a workspace name, the agent to use and where it can learn about you. Add your website and any channel or social profile links. When the workspace opens, **Workspace settings › Context** shows the links, and the agent drafts **About you** from them.

![Context with the website the agent read and the About you it drafted](/tools/arrumo/static/media/app/context.webp)

Read the draft and fix anything it guessed. Keep the facts videos need: names, services, the call to action.

## 2. Check your brand

Open **Brand**. The agent suggested colors from your site: give each a name and tick the ones videos may use. Add your heading and body fonts, Regular and Bold. Under **Brand assets**, upload your logos and describe each one, such as "white wordmark for dark backgrounds".

![Brand colors with names and checks](/tools/arrumo/static/media/app/brand-colors.webp)

## 3. Choose the outputs

Open **Outputs**. Turn on the formats you publish, such as **Landscape** for YouTube, and set how many thumbnails each video gets. Add a few thumbnail reference images so new thumbnails match your style.

![The Landscape output with thumbnails and reference images](/tools/arrumo/static/media/app/outputs.webp)

## 4. Make an opening and a closing animation

Open **Animations** and choose **Generate with agent**. Ask for "a three-second logo sting on our dark brand color" and, after it, "an end card with our website and a call to action". Arrumo renders each one; open it, play the preview and choose **Change with agent** if something is off. Videos can now reuse them.

![The animation library](/tools/arrumo/static/media/app/animations-library.webp)

## 5. Write the brief

Go to **Home** and choose **Start from scratch**. Give the video a title, pick a profile and write in a few sentences what it should get across. The panel on the right shows what the agent will make, such as one landscape video, subtitles, titles and tags. Leave **Autopilot** off to review each stage. Choose **Generate this video**.

![A new video's brief and what the agent will make](/tools/arrumo/static/media/app/new-video-brief.webp)

## 6. Review the script

The screen turns cobalt while the agent works; follow its reasoning and the activity on the right. When the script is ready, Arrumo notifies you. Approve each section, or choose **Ask for changes** and say what to change, then **Send** your decisions. Nothing moves on until you do.

![Reviewing the script section by section](/tools/arrumo/static/media/app/review-script.webp)

## 7. Review animations and previews

At **Assets and animations**, check each scene's animation and tick **Save to the library when approved** on the ones worth keeping. At **Video previews**, play the cut of each format with its voice and captions, and approve it or ask for changes.

![Reviewing the preview of a format](/tools/arrumo/static/media/app/review-previews.webp)

## 8. Choose titles, descriptions and tags

The agent writes several titles, descriptions and tags, and the thumbnails, for each format. Approve the ones to publish and reject the rest.

![Reviewing titles, descriptions and tags](/tools/arrumo/static/media/app/review-titles.webp)

## 9. Final render and delivery

Arrumo renders each format at full quality, writes the subtitles and checks everything against your output rules. When the run says **Everything is delivered**, open the finished video.

![A run with every stage delivered](/tools/arrumo/static/media/app/run-delivered.webp)

## 10. Schedule and export

On the finished video, set a **Schedule date** so it appears on the calendar, and choose **Export ZIP** to save the video, subtitles, titles, descriptions, tags and thumbnail together for uploading.

![The finished video with its files and schedule](/tools/arrumo/static/media/app/finished-video.webp)

Next, read [Create and export your first video](first-video.md) for every option along the way, or let an agent do all of this for you over [MCP](../developer/agent-skill.md).
