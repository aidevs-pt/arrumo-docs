---

title: "Let an agent drive Arrumo"
description: "Load the Arrumo skill in Claude Code or Codex so it edits through Arrumo's MCP tools."
---

Arrumo ships an agent skill, [`skills/arrumo/SKILL.md`](https://github.com/aidevs-pt/arrumo-video-editor/blob/main/skills/arrumo/SKILL.md), that teaches an external agent how to work with Arrumo like a careful editor: look at the material, ask, confirm a plan, queue a run, review each stage with specific notes, and save what it learned as workspace feedback.

## Install it

1. [Connect the agent to Arrumo's MCP server](connect.md).
2. Copy the `skills/arrumo` folder into the agent's skills folder, for example `~/.claude/skills/arrumo` for Claude Code or `~/.codex/skills/arrumo` for Codex.
3. Ask the agent to make a video; it loads the skill when the task matches.

## What Arrumo already does

The skill tells the agent not to redo work Arrumo handles itself: Arrumo transcribes footage, shows its agent phrase timings, keeps cuts off spoken words, fades every cut and evens out the final loudness to -14 LUFS.

## Editing guides

Each production step's agent follows a short guide of editing craft notes: writing the script, planning visuals, designing animations, cutting footage, storyboarding, choosing portrait cuts, writing publishing text, and reviewing an edit. The guide sits in the step's prompt apart from the creator's brief, and the brief and learned feedback take precedence. Outside agents read the same guides with `list_editing_guides` and `get_editing_guide` (CLI `list-editing-guides` and `editing-guide <id>`), so their review notes and Arrumo's agent pull the same way.

## Looking at a moment

`render_frame_strip` draws evenly spaced frames from up to 120 seconds of video above its waveform into a new PNG and returns each frame's time. It takes a footage asset (`assetId`), a run's final video (`runId`, `formatId`) or one of its previews (add `previewAttempt`). Agents that can read images use it to check a cut, a join or an overlay at a decision point. The CLI form is `render-frame-strip <workspace-id> <video-asset-id> <start> <end> <destination-png>`.
