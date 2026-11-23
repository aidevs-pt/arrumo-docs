---

title: "Configura Codex no Arrumo"
description: "Instala a CLI local e inicia sessão seguindo o guia do fornecedor."
---

Instala a CLI local e inicia sessão seguindo o [guia do fornecedor](https://learn.chatgpt.com/docs/codex/cli). Inicia o Arrumo num ambiente cujo PATH inclua a pasta do executável.

Escolhe Codex durante a configuração do espaço de trabalho ou seleciona-o como agente de produção nas Definições. A verificação confirma a sessão local e não inicia uma edição.

## Verifica a ligação

Na CLI do editor, indica o caminho para uma base de dados local e o identificador deste plugin.

```sh
arrumo-workspaces ./workspaces.sqlite agent-login-status codex
```

O estado confirmed indica que a CLI aceitou a verificação. Se o Arrumo devolver unavailable, verifica se o executável está no PATH que o Arrumo consegue ver. Se devolver unconfirmed, inicia sessão seguindo o guia oficial e volta a verificar. Um tempo de espera excedido ou um erro indica que a verificação não foi concluída.

## Escrever ficheiros e executar comandos

**Escrever ficheiros e executar comandos**, em Definições › Agente, está ativo por predefinição. Enquanto trabalha num vídeo, o Codex corre na sua sandbox `workspace-write` com o terminal e carrega a tua própria configuração do Codex, incluindo os servidores MCP e os plugins. Trabalha numa pasta que o Arrumo cria para esse vídeo e apaga quando o vídeo termina, falha ou é cancelado.

Se o desativares, o Codex corre na sandbox `read-only` sem a ferramenta de terminal, e só lê o que o Arrumo lhe envia. **Usar os meus plugins instalados** decide então se a tua configuração e os teus plugins do Codex são carregados. A geração de imagens é sempre só de leitura.

## Traduz as legendas

Consulta [a tradução de legendas](https://github.com/aidevs-pt/arrumo-plugin-codex/blob/main/README.md#translate-subtitles) para usares este plugin como tradutor do Auto-Dubbing. O tradutor envia para Codex o texto das legendas selecionadas e o idioma de destino. O processo preserva as marcas temporais originais.

## Cria imagens

O Codex pode criar miniaturas e outras imagens com a sua ferramenta de imagens integrada, com o teu plano do ChatGPT, por isso não precisas de uma chave da OpenAI ou da Gemini para elas. Aparece em **Geração de imagens**, em Definições, Serviços e chaves, em primeiro lugar por omissão; desce-o para preferir um fornecedor com chave. O Arrumo envia a descrição da imagem e até oito referências de estilo. O Codex trabalha só em leitura, e o Arrumo recolhe, verifica e recorta a imagem, e depois apaga a cópia do Codex.

## Perguntas de seguimento

Quando o Codex pede ao Arrumo material do espaço de trabalho, como o guião de um vídeo anterior, o Arrumo responde na mesma sessão do Codex só com esse material, para que o pedido não seja enviado nem pago duas vezes. Estas sessões ficam no histórico do Codex (`codex resume`); as execuções pontuais não guardam nenhuma.
