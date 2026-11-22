---

title: "Deixa um agente controlar o Arrumo"
description: "Carrega a skill do Arrumo no Claude Code ou no Codex para que edite com as ferramentas MCP do Arrumo."
---

O Arrumo inclui uma skill para agentes, [`skills/arrumo/SKILL.md`](https://github.com/aidevs-pt/arrumo-video-editor/blob/main/skills/arrumo/SKILL.md), que ensina um agente externo a trabalhar com o Arrumo como um editor cuidadoso: olhar para o material, perguntar, confirmar um plano, pôr uma geração em fila, rever cada etapa com notas concretas e guardar o que aprendeu como feedback do espaço de trabalho.

## Instala-a

1. [Liga o agente ao servidor MCP do Arrumo](connect.md).
2. Copia a pasta `skills/arrumo` para a pasta de skills do agente, por exemplo `~/.claude/skills/arrumo` para o Claude Code ou `~/.codex/skills/arrumo` para o Codex.
3. Pede ao agente que faça um vídeo; ele carrega a skill quando a tarefa encaixa.

## O que o Arrumo já faz

A skill diz ao agente para não repetir o trabalho que o Arrumo faz: o Arrumo transcreve as gravações, mostra ao seu agente os tempos de cada frase, evita cortar palavras, suaviza o áudio de cada corte e iguala o volume final a -14 LUFS.
