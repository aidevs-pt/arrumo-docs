---

title: "Adaptadores de fornecedores"
description: "Descreve fornecedores de transcrição, voz, música, efeitos sonoros, imagem, vídeo, utilização e tradução."
---

## Adaptador de transcrição incluído

Inclui explicitamente os descritores de adaptadores ao empacotar um fornecedor. O empacotador valida os descritores reconhecidos da raiz com os esquemas do SDK e com o manifesto do pacote antes de escrever o ZIP.

O [descritor de transcrição](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/transcription.schema.json) é um contrato versionado do host para fornecedores revistos e incluídos. O descritor identifica um plugin com a capacidade `transcription` e indica um campo secreto declarado no manifesto desse plugin. Também declara o endpoint HTTPS, o cabeçalho da credencial e o modelo. O host lê a credencial configurada do armazenamento do sistema e constrói o pedido ele próprio. Os plugins incluídos podem fornecer um `transcription-timed.json` à parte com o mesmo esquema para as legendas de entrega. O mapeamento `response.words` descreve unidades de texto com tempos, que podem ser palavras ou segmentos inteiros. Sem um descritor com tempos, o host usa o descritor normal quando este declara um mapeamento de tempos.

O descritor declara o campo de ficheiro multipart, os campos de formulário fixos, o prefixo da credencial, o limite de entrada e os ponteiros para os campos da resposta JSON. Os mapeamentos de palavras opcionais escolhem os tokens com marca temporal e as etiquetas de orador opcionais. O host aplica estas declarações com um transporte HTTPS genérico com os redirecionamentos desativados. Só os descritores do pacote da aplicação revisto podem usar este transporte.

## Descreve um adaptador de síntese de voz

Um plugin que declara `text-to-speech` pode fornecer um [descritor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/speech-synthesis.schema.json) `speech-synthesis.json` para uma API HTTPS revista que recebe um POST com JSON e aceita um identificador de voz como último segmento do caminho. O descritor indica o campo de texto JSON, os valores fixos do corpo e da consulta, a codificação da resposta e a definição secreta do espaço de trabalho usada para autenticação. A codificação da resposta é `mp3` ou `wav`.

O host tem de fazer corresponder o identificador de plugin do descritor ao manifesto e verificar a credencial com um segredo de espaço de trabalho declarado. Tem de rejeitar credenciais, consultas, fragmentos, segmentos com pontos e URL que não sejam HTTPS no endpoint, e rejeitar uma chave fixa do corpo que entre em conflito com o campo de texto. Os hosts têm de acrescentar o identificador de voz de quem chama como um único segmento de caminho codificado, codificar os valores da consulta, aplicar o limite de caracteres Unicode do descritor, recusar redirecionamentos, e limitar e validar a resposta de áudio antes de a guardar. O host é dono das credenciais e tem de ocultar os erros do fornecedor. O descritor é para entradas de fornecedores de confiança.

Um `voiceSetting` opcional indica uma definição de cadeia não secreta declarada no manifesto onde os criadores escolhem uma voz, e `defaultVoice` é a voz usada quando essa definição está vazia. Os hosts usam-nos quando um fluxo precisa de voz sem pedir uma, como ao narrar um vídeo com storyboard.

## Descreve um adaptador de música e efeitos sonoros

Um plugin pode fornecer um [descritor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/audio-generation.schema.json) `audio-generation.json` com um tipo `music`, um tipo `sound-effect` ou ambos. Cada tipo precisa da sua própria capacidade, `music-generation` ou `sound-effect-generation`, e descreve um POST com JSON para uma API HTTPS revista: o endpoint, os campos da descrição e da duração, se a duração é enviada em `seconds` ou `milliseconds`, a duração permitida em segundos, o limite de caracteres da descrição e os valores fixos do corpo e da consulta. Os valores do corpo podem ser cadeias, números ou booleanos. A resposta é um único ficheiro `mp3` ou `wav`, e a credencial é um segredo do espaço de trabalho.

O host aplica as mesmas regras de endpoint, redirecionamentos, credenciais e resposta que para a voz, rejeita uma chave fixa do corpo que repita o campo da descrição ou da duração, e recusa durações fora do intervalo do tipo antes de chamar o fornecedor. O resultado passa a ser um recurso de áudio do espaço de trabalho. A ElevenLabs usa-o para música instrumental (de 3 a 600 segundos) e efeitos sonoros (de 0,5 a 30 segundos).

## Descreve um adaptador de geração de imagens

Um plugin que declara `image-generation` pode fornecer um [descritor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/image-generation.schema.json) `image-generation.json` para uma API HTTPS que recebe um POST com JSON e devolve uma imagem em base64. `request` é um modelo JSON: os valores de cadeia que são exatamente `{prompt}`, `{aspectRatio}` ou `{model}` são substituídos, e `{prompt}` tem de aparecer. `aspectRatios` associa as proporções que o Arrumo pede (`16:9`, `9:16`, `1:1` e, opcionalmente, mais) ao valor do fornecedor, como um tamanho em píxeis ou a própria proporção. O endpoint pode conter `{model}` num segmento do caminho. É usado `model.default` a menos que o criador defina a definição de cadeia indicada em `model.setting`, para os fornecedores poderem passar a modelos mais recentes sem uma publicação nova. `response.image` aponta para os dados em base64; com `response.items`, o host usa o primeiro elemento da lista onde esse ponteiro se resolve.

O host verifica o descritor com o manifesto, envia o segredo do espaço de trabalho no cabeçalho declarado, recusa redirecionamentos, limita a resposta com `maxImageBytes`, verifica que os bytes descodificados são uma imagem PNG, JPEG ou WebP e guarda-a como recurso do espaço de trabalho. Os fornecedores são tentados pela ordem `image-generation` capturada da execução; um sem credencial configurada é saltado.

O esquema 2 acrescenta fornecedores assíncronos. Com `job`, o host lê o endereço de estado do trabalho enviado, consulta-o no host do endpoint com a credencial e descarrega a imagem terminada em `job.status.image` sem ela, da mesma forma que os adaptadores de vídeo; nesse caso, `response` é omitido. Com referências `urls`, cada imagem de referência é enviada através de `upload` (vê o adaptador de vídeo) e os endereços públicos são definidos como `field` do pedido JSON enviado para o `endpoint` das referências.

## Descreve um adaptador de geração de vídeo

Um plugin que declara `video-generation` pode fornecer um [descritor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/video-generation.schema.json) `video-generation.json` para uma API HTTPS assíncrona. O host envia por POST o modelo `request` com `{prompt}`, `{aspectRatio}` e `{duration}` preenchidos (a duração como número, ajustada a `durations`), lê o endereço de estado do trabalho em `submission.statusUrl` e consulta-o a cada `pollSeconds` até `status.state` ser `completed` ou `failed`, ou até passarem `timeoutSeconds`. O endereço de estado tem de ser HTTPS no host do endpoint, porque recebe a credencial. `status.video` aponta para o endereço HTTPS do clip terminado, que o host descarrega sem a credencial, limita com `maxVideoBytes`, verifica como MP4, MOV ou WebM e guarda como recurso do espaço de trabalho. `status.error` pode apontar para um motivo curto mostrado ao criador. Os fornecedores são tentados pela ordem `video-generation` do espaço de trabalho; um sem chave configurada, ou sem a proporção pedida em `aspectRatios`, é saltado.

Os descritores do esquema 2 podem oferecer vários modelos. `models` associa a cada identificador de modelo até quatro variantes de pedido; o host chama a primeira variante cujos intervalos `images` e `videos` correspondem aos ficheiros de referência que o criador ou o agente anexou (um intervalo ausente não aceita nenhum), por isso um modelo pode ter endpoints de texto para vídeo, imagem para vídeo e referência para vídeo. `model.default` e uma definição de cadeia opcional com as `choices` correspondentes escolhem o modelo quando quem chama não indica nenhum. As referências são recursos de imagem ou MP4 do espaço de trabalho: o host envia cada uma através de `upload` (um POST com credencial no host do fornecedor que devolve um endereço HTTPS pré-assinado e um público, e depois um PUT sem a credencial) e preenche `{image}`, `{images}`, `{video}` ou `{videos}` com os endereços públicos. Os campos de primeiro nível `endpoint`, `aspectRatios`, `durations` e `request` mantêm-se como alternativa do esquema 1.

## Descreve um adaptador de utilização

Um plugin fornecedor pode acrescentar um [descritor](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/usage.schema.json) `usage.json` para os criadores verem quanto lhes resta da quota. O host envia um GET para `endpoint` com a credencial do espaço de trabalho, recusa redirecionamentos e lê os números nos ponteiros `used` e `limit` (e, opcionalmente, `resetsAt`, em segundos Unix). O Arrumo mostra a parte restante em Definições › Serviços e chaves, avisa no topo da aplicação quando restam 20% e de novo na cor de perigo com 10%, e repete o aviso antes de uma geração que use o fornecedor. Uma leitura falhada aparece como desconhecida, nunca como vazia.

## Tradutores de legendas locais

Um fornecedor incluído pode declarar a capacidade `subtitle-translation` e incluir `tools/translate-subtitles.py` no checkout de desenvolvimento. O script lê da entrada padrão um objeto JSON com `targetLanguage` e `cues`, e escreve na saída padrão um objeto com `translations`. Ambas as listas de entradas usam elementos `{ "cue": 1, "text": "…" }`. Os identificadores das entradas são inteiros positivos e têm de corresponder exatamente entre o pedido e a resposta. Os adaptadores de tradução tratam da autenticação do fornecedor e têm de deixar as credenciais fora da resposta.

O Auto-Dubbing resolve este ponto de entrada só para identificadores de plugins incluídos escolhidos explicitamente no fluxo com checkouts locais. Esta convenção depende de fontes locais de plugins de confiança.
