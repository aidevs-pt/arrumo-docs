---

title: "Configura Claude Code no Arrumo"
description: "Instala a CLI local e inicia sessão seguindo o guia do fornecedor."
---

Instala a CLI local e inicia sessão seguindo o [guia do fornecedor](https://code.claude.com/docs/en/setup). O Arrumo encontra a CLI no seu PATH e nas pastas que a tua shell de início de sessão acrescenta, mesmo quando o abres a partir da Dock, do Finder ou de um lançador do ambiente de trabalho. Se a instalaste noutro sítio, escolhe o ficheiro do programa com **Escolher o programa…** na configuração do agente ou nas Definições.

Escolhe Claude Code durante a configuração do espaço de trabalho ou seleciona-o como agente de produção nas Definições. A verificação confirma a sessão local e não inicia uma edição.

## Verifica a ligação

Na CLI do editor, indica o caminho para uma base de dados local e o identificador deste plugin.

```sh
arrumo-workspaces ./workspaces.sqlite agent-login-status claude-code
```

O estado confirmed indica que a CLI aceitou a verificação. Se o Arrumo devolver unavailable, verifica se a CLI está instalada ou escolhe o ficheiro do programa nas Definições. Se devolver unconfirmed, inicia sessão seguindo o guia oficial e volta a verificar. Um tempo de espera excedido ou um erro indica que a verificação não foi concluída.

## Escrever ficheiros e executar comandos

**Escrever ficheiros e executar comandos**, em Definições › Agente, está ativo por predefinição. Enquanto trabalha num vídeo, o Claude Code aceita as edições (`--permission-mode acceptEdits`) e pode usar Read, Write, Edit, Glob, Grep e Bash, além de WebSearch e WebFetch quando **Pesquisa na web** está ativa. Aplica-se a tua própria configuração do Claude Code: os hooks, os servidores MCP e os plugins. Trabalha numa pasta que o Arrumo cria para esse vídeo e apaga quando o vídeo termina, falha ou é cancelado.

Se o desativares, o Claude Code corre em modo restrito (`--restricted`), com os hooks desativados e sem ferramentas de ficheiros nem de terminal, e só lê o que o Arrumo lhe envia. **Usar os meus plugins instalados** decide então se os teus plugins e servidores MCP são carregados.

## Traduz as legendas

Consulta [a tradução de legendas](https://github.com/aidevs-pt/arrumo-plugin-claude-code/blob/main/README.md#translate-subtitles) para usares este plugin como tradutor do Auto-Dubbing. O tradutor envia para Claude Code o texto das legendas selecionadas e o idioma de destino. O processo preserva as marcas temporais originais.

## Perguntas de seguimento

Quando o Claude Code pede ao Arrumo material do espaço de trabalho, como o guião de um vídeo anterior, o Arrumo responde na mesma sessão do Claude Code só com esse material, para que o pedido não seja enviado nem pago duas vezes. Estas sessões ficam no histórico do Claude Code (`claude --resume`); as execuções pontuais não guardam nenhuma.
