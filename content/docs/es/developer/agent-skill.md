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

## Guías de edición

El agente de cada paso de producción sigue una guía breve con notas de oficio: escribir el guion, planificar los recursos visuales, diseñar animaciones, cortar el material, hacer el storyboard, elegir cortes verticales, escribir los textos de publicación y revisar un montaje. La guía va en las instrucciones del paso, separada del brief del creador, y el brief y el feedback aprendido tienen prioridad. Los agentes externos leen las mismas guías con `list_editing_guides` y `get_editing_guide` (CLI `list-editing-guides` y `editing-guide <id>`), para que sus notas de revisión y el agente de Arrumo vayan en la misma dirección.

## Mirar un momento

`render_frame_strip` dibuja fotogramas espaciados de hasta 120 segundos de vídeo sobre su forma de onda en un PNG nuevo y devuelve el tiempo de cada fotograma. Acepta un recurso de material (`assetId`), el vídeo final de una ejecución (`runId`, `formatId`) o una de sus vistas previas (añade `previewAttempt`). Los agentes que leen imágenes lo usan para comprobar un corte, una unión o una superposición en un momento de decisión. En la CLI es `render-frame-strip <workspace-id> <video-asset-id> <start> <end> <destination-png>`.
