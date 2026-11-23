---

title: "Gera clipes de vídeo e imagens com a Higgsfield"
description: "Cria clipes e imagens para a tua biblioteca com os 45 modelos de vídeo e 15 de imagem da Higgsfield."
---

[![Ver «Arrumo + Higgsfield: o que consegue fazer» no YouTube](/tools/arrumo/static/media/videos/06-arrumo-with-higgsfield.webp)](https://youtu.be/a8z9Aql6qPg)

_Todos os clipes e imagens deste vídeo foram gerados com este plugin, e o Arrumo fez o vídeo inteiro._

## Adiciona a tua chave

Cria uma chave de API na [consola Higgsfield](https://console.higgsfield.ai/). No Arrumo, abre **Definições › Serviços e chaves**, procura a Higgsfield e cola a chave como `ID_DA_CHAVE:SEGREDO`. Uma chave do espaço de trabalho tem prioridade sobre a predefinida da aplicação. O Arrumo guarda-a no cofre de credenciais do sistema, só a envia para a API da Higgsfield e nunca a mostra aos agentes.

Cada clipe e imagem gasta os teus créditos Higgsfield. Quando a conta fica sem créditos, o trabalho falha e o Arrumo diz-te porquê. Alguns modelos podem não estar disponíveis para todas as contas; quando um trabalho é recusado, é mostrado o motivo da Higgsfield.

## Cria um clipe de vídeo

Abre **Recursos › Gerar › Clipe de vídeo**, descreve o clipe e escolhe o tamanho. Escolhe a Higgsfield em **Feito com** e depois um **Modelo**: a linha por baixo diz para que é ideal, e **Duração** só oferece as durações que esse modelo aceita. Os modelos cujo nome termina em _References_ seguem as imagens e vídeos que anexas; os modelos _Edit_, _Extend_, _Motion Control_ e _Genjutsu_ trabalham sobre um clipe que anexas, e o resultado segue a sua duração.

| Modelo                            | Ideal para                                                                                                                                |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Cinema Studio 4.0                 | Planos de estilo cinema de 4–30 s a partir de texto, até nove imagens ou três vídeos; o modelo escolhe lente, luz e ritmo.                |
| Genjutsu Motion Transfer          | Coloca as pessoas ou personagens de até oito imagens no movimento de um vídeo (mínimo 4 s; acima de 30 s é cortado).                      |
| Genjutsu Object Swap              | Substitui um objeto de um vídeo pelo das tuas imagens, mantendo o movimento do plano.                                                     |
| Grok Imagine Video 1.5            | Clipes curtos em 720p de 1–15 s que começam numa imagem ou seguem até sete imagens de referência.                                         |
| Hailuo 2.3 Standard               | Anima uma imagem num clipe de 6 ou 10 s a 768p.                                                                                           |
| Happy Horse 1.0                   | O modelo de vídeo da Alibaba para clipes em 1080p de 2–15 s a partir de texto ou um primeiro fotograma.                                   |
| Happy Horse 1.0 References        | Happy Horse seguindo até nove imagens de referência de um sujeito ou estilo.                                                              |
| Happy Horse 1.1                   | O Happy Horse mais recente, em 1080p por omissão, a partir de texto ou um primeiro fotograma.                                             |
| Happy Horse 1.1 References        | Happy Horse 1.1 seguindo até nove imagens de referência.                                                                                  |
| Kling 2.5 Turbo Pro               | Clipes de 5 ou 10 s a partir de texto ou uma imagem. A sua API de texto não aceita tamanho, por isso o Arrumo só lhe pede 16:9.           |
| Kling 2.5 Turbo Standard          | Anima uma imagem num clipe de 5 ou 10 s, no nível Turbo Standard.                                                                         |
| Kling 2.6 Motion Control Pro      | Transferência de movimento do Kling 2.6 no nível Pro.                                                                                     |
| Kling 2.6 Motion Control Standard | Transferência de movimento do Kling 2.6: a personagem de uma imagem segue o movimento de um vídeo de 3–30 s.                              |
| Kling 2.6 Pro                     | A geração anterior do Kling: clipes de 5 ou 10 s a partir de texto ou uma imagem.                                                         |
| Kling 3.0 4K                      | Kling 3.0 em 4K, para ecrãs grandes ou recortes na edição.                                                                                |
| Kling 3.0 Motion Control Pro      | Transferência de movimento do Kling 3.0 no nível Pro: a personagem de uma imagem segue um vídeo de 3–30 s.                                |
| Kling 3.0 Motion Control Standard | Move a personagem da tua imagem como se move a pessoa de um vídeo de referência de 3–30 s; o clipe dura o mesmo que o vídeo.              |
| Kling 3.0 Pro                     | O nível Pro do Kling 3.0, acima do Standard, com as mesmas entradas.                                                                      |
| Kling 3.0 Standard (predefinido)  | O nível Standard do Kling 3.0: 3–15 s a partir de texto, um primeiro fotograma ou o primeiro e o último.                                  |
| Kling 3.0 Turbo                   | O nível Turbo do Kling 3.0: clipes em 1080p a partir de texto ou uma imagem, com prompts até 3000 caracteres.                             |
| Kling O3                          | Clipes que começam numa imagem e podem terminar noutra, de 3–15 s.                                                                        |
| Kling O3 Edit                     | Altera um clipe existente de 3–15 s com uma instrução, como trocar o cenário ou um objeto, guiado se quiseres por imagens.                |
| Kling O3 References               | Mantém coerentes personagens, produtos ou lugares a partir de até quatro imagens, ou segue a câmara e o estilo de um vídeo de referência. |
| Kling Omni                        | O modelo Omni anterior para clipes de 5 ou 10 s entre um primeiro fotograma e um último opcional.                                         |
| Kling Omni Edit                   | Edita um clipe existente de 3–10 s com uma instrução, guiado se quiseres por imagens.                                                     |
| Kling Omni References             | Omni com até quatro imagens ou um vídeo de referência, para sujeitos coerentes.                                                           |
| LTX-2.5 Fast                      | O nível Fast do LTX-2.5: 6, 8 ou 10 s em 16:9 ou 9:16, a partir de texto, um primeiro fotograma ou o primeiro e o último.                 |
| LTX-2.5 Pro                       | O nível Pro do LTX-2.5: 6, 8 ou 10 s em 16:9 ou 9:16 a partir de texto ou uma imagem.                                                     |
| MiniMax H3                        | Clipes em 2K de 5–15 s a partir de texto, um primeiro fotograma ou o primeiro e o último.                                                 |
| MiniMax H3 References             | MiniMax H3 seguindo até nove imagens ou três vídeos.                                                                                      |
| PixVerse V6                       | Clipes em 1080p de 1–15 s a partir de texto.                                                                                              |
| Seedance 2.0                      | Clipes em 1080p de 4–15 s a partir de texto, um primeiro fotograma ou o primeiro e o último.                                              |
| Seedance 2.0 References           | Segue ao mesmo tempo até nove imagens e três vídeos de referência: personagens, produtos, estilo e movimentos de câmara.                  |
| Seedance 2.5                      | Planos mais longos, até 30 s, a partir de texto ou fotogramas, com bitrate alto.                                                          |
| Seedance 2.5 Edit                 | Edita um clipe existente com uma instrução, com imagens opcionais do que queres acrescentar.                                              |
| Seedance 2.5 Extend               | Continua um clipe existente mais 4–30 s, a partir de onde termina.                                                                        |
| Seedance 2.5 References           | Seedance 2.5 seguindo até nove imagens e três vídeos, para planos longos e coerentes até 30 s.                                            |
| Wan 2.6                           | Anima uma imagem num clipe em 1080p de 5, 10 ou 15 s.                                                                                     |
| Wan 2.6 References                | Clipes em 1080p de 5 ou 10 s que seguem um a três vídeos de referência.                                                                   |
| Wan 2.7                           | Clipes em 1080p de 2–15 s a partir de texto, um primeiro fotograma ou o primeiro e o último.                                              |
| Wan 2.7 References                | Clipes em 1080p de 2–10 s em 16:9 ou 9:16 que seguem até cinco imagens ou vídeos de referência.                                           |
| Wan 3.0                           | Clipes longos em 1080p, de 2–30 s, a partir de texto, um primeiro fotograma ou o primeiro e o último.                                     |
| Wan 3.0 Prime                     | O nível Prime do Wan 3.0, com as mesmas entradas do Wan 3.0.                                                                              |
| Wan 3.0 Prime References          | Wan 3.0 Prime com até nove imagens e três vídeos de referência.                                                                           |
| Wan 3.0 References                | Wan 3.0 seguindo até nove imagens e três vídeos para sujeitos coerentes em planos longos.                                                 |

Para mudar o predefinido de um espaço de trabalho, define **Modelo de vídeo** nas definições do plugin.

Em **Referências**, escolhe imagens ou vídeos da biblioteca do espaço de trabalho. Com duas imagens, os modelos que aceitam fotogramas usam a primeira como fotograma inicial e a segunda como final. O Arrumo avisa-te quando o modelo escolhido não aceita essa combinação ou esse tamanho. Os clipes não têm som; acrescenta narração ou música na edição. O MP4 terminado junta-se a **Recursos**, com uma nota que indica o modelo que o fez.

## Cria uma imagem

Em **Recursos › Gerar › Imagem**, escolhe a Higgsfield e um **Modelo**. Os modelos que aceitam imagens de referência usam as que anexas, até ao número da tabela. Para as miniaturas, a Higgsfield entra na sua vez segundo a ordem de fornecedores de imagens do espaço de trabalho em **Serviços e chaves** e usa a definição **Modelo de imagem**.

| Modelo                        | Ideal para                                                                                                | Referências |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- | ----------- |
| Ads Studio                    | Transforma um briefing de marketing e até oito referências de produto numa imagem de conceito de anúncio. | Até 8       |
| Grok Image 2.0                | Gera ou edita com muitas referências (até oito aqui), para combinar pessoas, produtos e lugares.          | Até 8       |
| Ideogram 4.0                  | Imagens com texto, como cartazes, títulos e miniaturas; remistura uma imagem de referência.               | Até 1       |
| Marketing Studio 2.0          | Imagens de campanha, geradas ou editadas a partir de até oito referências, como fotografias de produto.   | Até 8       |
| Marketing Studio 2.5 Flare    | Marketing Studio 2.5 Flare, o modelo de imagens de campanha mais recente, com até oito referências.       | Até 8       |
| Marketing Studio 2.5 Sunburst | A variante Sunburst do Marketing Studio 2.5, com até oito referências.                                    | Até 8       |
| Qwen Image 3 (predefinido)    | Imagens em 2K a partir de uma descrição, ou edições de até três imagens de referência.                    | Até 3       |
| Recraft V4.1                  | Recraft V4.1 em 1K.                                                                                       | Nenhuma     |
| Recraft V4.1 Pro              | Recraft V4.1 em 2K.                                                                                       | Nenhuma     |
| Recraft V4.1 Utility          | A variante Utility do Recraft V4.1 em 1K.                                                                 | Nenhuma     |
| Recraft V4.1 Utility Pro      | A variante Utility do Recraft V4.1 em 2K.                                                                 | Nenhuma     |
| SOUL                          | O modelo SOUL de texto para imagem da Higgsfield, em 1080p.                                               | Nenhuma     |
| SOUL 2                        | A segunda versão do SOUL, em 1080p.                                                                       | Nenhuma     |
| SOUL Cinema                   | SOUL com o seu estilo de cinema fixo, em 1080p.                                                           | Nenhuma     |
| Z-Image Turbo                 | Imagens Turbo em 2K a partir de descrições curtas (até 800 caracteres).                                   | Nenhuma     |

## O que não é oferecido aqui

Não são oferecidos os fluxos que precisam de predefinições ou identificadores treinados da Higgsfield (Genjutsu Restyle, personagens Soul ID, elementos e prompts de várias tomadas do Kling). O texto para vídeo do Hailuo 2.3 e do Wan 2.6 fica de fora porque essas API não aceitam tamanho, e a imagem para vídeo do PixVerse V6 ainda não está incluída.

## Agentes

Os agentes ligados por MCP usam `list_video_models` e `list_image_models` para ver cada modelo, para que é ideal e o que aceita, e depois passam `provider` e `model` a `generate_library_video` ou `generate_library_images`, com identificadores de recursos do espaço de trabalho como `references`.

## Privacidade

Os ficheiros de referência são enviados para o armazenamento da Higgsfield através de um endereço de curta duração, sem a tua chave. Só saem do teu computador a descrição, as definições e as referências que escolheste.
