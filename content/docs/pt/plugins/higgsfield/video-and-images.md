---

title: "Gera clipes de vídeo e imagens com a Higgsfield"
description: "Cria clipes e imagens para a tua biblioteca com os modelos Kling, Seedance e Qwen da Higgsfield."
---

## Adiciona a tua chave

Cria uma chave de API na [consola da Higgsfield](https://console.higgsfield.ai/). No Arrumo, abre **Definições › Serviços e chaves**, procura a Higgsfield e cola a chave como `ID_DA_CHAVE:SEGREDO`. A chave de um espaço de trabalho tem prioridade sobre a da aplicação. O Arrumo guarda-a no cofre de credenciais do sistema, só a envia para a API da Higgsfield e nunca a mostra aos agentes.

Cada clipe e imagem gasta os teus créditos da Higgsfield. Quando a conta fica sem créditos, o trabalho falha e o Arrumo explica porquê.

## Cria um clipe de vídeo

Abre **Recursos › Gerar › Clipe de vídeo**, descreve o clipe e escolhe a proporção (16:9, 9:16 ou 1:1) e a duração. **Modelo** escolhe um destes:

| Modelo                           | Sem referências  | Com referências                           | Duração |
| -------------------------------- | ---------------- | ----------------------------------------- | ------- |
| Kling 3.0 Standard (predefinido) | Texto para vídeo | Anima uma imagem                          | 3–15 s  |
| Kling 3.0 Pro                    | Texto para vídeo | Anima uma imagem                          | 3–15 s  |
| Seedance 2.0                     | Não disponível   | 1–9 imagens e até 3 vídeos, ou 1–3 vídeos | 4–15 s  |

O Kling 3.0 Pro tem melhor aspeto e custa mais. Para mudar o predefinido de um espaço de trabalho, define **Modelo de vídeo** nas definições do plugin.

Em **Referências**, escolhe imagens ou vídeos da biblioteca do espaço de trabalho. O Arrumo avisa quando o modelo escolhido não aceita essa combinação. Uma imagem animada mantém a sua forma, seja qual for a proporção escolhida. Os clipes não têm som; acrescenta narração ou música na montagem.

O MP4 final junta-se aos **Recursos**, com uma nota que indica o modelo que o criou.

## Cria uma imagem

A Higgsfield também cria imagens com o Qwen Image 3 em 2K. Em **Recursos › Gerar › Imagem**, descreve a imagem e, para a editar ou mudar o estilo, anexa uma a três imagens de referência. Para as miniaturas, a Higgsfield ocupa o seu lugar na ordem de fornecedores de imagens do espaço de trabalho em **Serviços e chaves**.

## Agentes

Os agentes ligados por MCP usam `list_video_models` para ver cada modelo e as referências que aceita, e `generate_library_video` ou `generate_library_images` com IDs de recursos do espaço de trabalho como `references`.

## Privacidade

Os ficheiros de referência são enviados para o armazenamento da Higgsfield através de um endereço temporário, sem a tua chave. Só saem do teu computador a descrição, as definições e as referências que escolheste.
