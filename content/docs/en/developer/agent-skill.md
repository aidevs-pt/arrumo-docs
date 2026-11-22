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
