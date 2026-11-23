---
title: "Set up your brand"
description: "Turn a website into a workspace with context, colors, fonts, logos and delivery rules that every video follows."
---

A workspace holds what stays the same across your videos: who you are, how you look and what each delivery contains. Profiles and single videos can override parts of it later. This page sets one up from an existing website.

## Let the agent read your website

Open **Workspace settings › Context**. Under **Where can Claude Code learn about you?** (or the name of your agent), add your website and any channel or social profile links, then let the agent read them. It drafts **About you**, suggests brand colors and profiles, and offers images it found, such as the site's social preview, for you to tick.

With Claude Code, turn on **Web search** in its plugin settings for this workspace first, so it can open the pages. The agent stays read-only and can't run commands. Turn the setting off again once the context is right if you don't want later work to use the web.

Read the draft before you save it. Replace anything the agent guessed, such as a missing address or a vague service list, and keep the facts that matter in videos: names, places, services and the call to action.

## Colors

In **Brand › Brand colors**, check every color against the site itself, for example its CSS variables or the classes of its buttons and headings. An agent reading a page can round colors or invent near-misses. Give each color a name the agent can use in a sentence, such as Ink or Paper, and use its check mark to choose whether videos may use it.

## Fonts

Under **Fonts**, add a Regular and a Bold file for **Headings** and for **Body text**. Use the static `.ttf` or `.otf` files from the font's official release, not a variable font or a web font file. If a site uses a wide cut for headlines, such as an Expanded width, add that cut as the heading font. Each card previews accented letters and the euro sign, so you can see at once when a file lacks them.

## Logos and style references

**Brand assets** are logos, avatars and marks the agent places as they are. **Style references** are looks to follow, such as a thumbnail or a page design, and are never placed in a video.

Prefer PNG for logos. When a mark sits on an opaque background, say so in its description, for example "black text on an opaque white rectangle: use it on light scenes or as a white card". Any item without a description shows **Describe it**. The agent decides where each image goes from these notes, so write what it shows, its size and where it works.

## Profiles

Each profile is a kind of video you make, such as product explainers or client showcases. Give it its own guidance on pacing, structure and on-screen style. Profile settings win over the workspace's for its videos, while context from both adds up.

## Outputs

**Outputs** lists the formats each video is delivered in. Every enabled format always gets a video file and its subtitle file. Turn off the formats you don't publish. Under each format you can ask for titles, descriptions, tags and thumbnails, give **Thumbnail reference images**, and add **Additional specifications**, such as a platform's length limits or a closing line every description ends with.

Subtitles are delivered as a separate SRT file. Turn on **Also deliver a copy with the subtitles in the picture** only when you also want a copy with captions burned in.

## Check before your first video

- **About you** reads like you, with no placeholders.
- Every checked color appears on your site.
- Both font cards show the right letters in the right weights.
- Each logo has a description.
- Only the formats you publish are on.
- Your narration and music providers have keys in **Settings › Services and keys**, and the narration voice is chosen in that plugin's settings.

Next, build a few [animations](animations.md) to reuse, then make [your first video](first-video.md).

## With an agent

Everything on this page is also available to agents through Arrumo's MCP server, the command line and A2A, for example `draft_workspace_context`, `set_workspace_context`, `import_brand_font`, `attach_brand_asset`, `set_asset_notes` and `set_format_delivery`. See [Connect to Arrumo](../developer/connect.md).
