---

title: "Deja que un agente maneje Arrumo"
description: "Carga la skill de Arrumo en Claude Code o Codex para que edite con las herramientas MCP de Arrumo."
---

Arrumo incluye una skill para agentes, [`skills/arrumo/SKILL.md`](https://github.com/aidevs-pt/arrumo-video-editor/blob/main/skills/arrumo/SKILL.md), que enseña a un agente externo a trabajar con Arrumo como un editor cuidadoso: mirar el material, preguntar, confirmar un plan, poner en cola una generación, revisar cada etapa con notas concretas y guardar lo aprendido como comentarios del espacio de trabajo.

## Instálala

1. [Conecta el agente al servidor MCP de Arrumo](connect.md).
2. Copia la carpeta `skills/arrumo` en la carpeta de skills del agente, por ejemplo `~/.claude/skills/arrumo` para Claude Code o `~/.codex/skills/arrumo` para Codex.
3. Pide al agente que haga un vídeo; cargará la skill cuando la tarea encaje.

## Lo que Arrumo ya hace

La skill indica al agente que no repita el trabajo que hace Arrumo: Arrumo transcribe el material, muestra a su agente los tiempos de cada frase, evita cortar palabras, suaviza el audio de cada corte e iguala el volumen final a -14 LUFS.
