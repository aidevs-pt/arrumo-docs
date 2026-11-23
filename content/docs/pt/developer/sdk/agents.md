---

title: "Fornecedores de agentes"
description: "Declara um agente de edição: verificações de estado, execuções estruturadas, imagens, utilização e seguimentos."
---

## Declaração de fornecedor de agente

Um plugin de agente pode acrescentar um descritor `agentProvider` e tem de declarar a capacidade `agents`. O identificador do plugin no manifesto é o identificador do fornecedor. `label` é o nome do produto mostrado e `setupUrl` liga ao guia de configuração HTTPS do fornecedor. `cli.executable` e `cli.authStatusArgs` descrevem o comando de estado local como um nome de programa e uma lista literal de argumentos.

O host só pode executar este comando para um plugin de confiança cujo adaptador suporte a política de execução do host. Resolve o executável através do PATH do host e indica um estado limitado sem capturar a saída do comando. A saída 0 confirma a autenticação local, a saída 1 deixa-a por confirmar, e as restantes saídas indicam uma falha. O descritor não dá ao plugin acesso a uma shell nem a processos, e não declara um adaptador de geração. Nunca incluas credenciais no descritor nem nos argumentos da verificação.

## Execuções estruturadas do agente

A versão 7 do esquema permite que um fornecedor de agente declare `agentProvider.cli.structuredRun`. O host usa-o para etapas de produção como escrever o guião. Executa uma vez o executável do fornecedor, numa pasta temporária vazia, com o prompt na entrada padrão e um JSON Schema que a resposta tem de seguir.

```json
"structuredRun": {
  "args": ["exec", "--sandbox", "read-only", "--output-schema", "{schemaPath}",
           "--output-last-message", "{outputPath}", "-"],
  "result": { "source": "outputFile" }
}
```

Os marcadores são argumentos completos: `{schema}` é o esquema como JSON, `{schemaPath}` um ficheiro que o contém e `{outputPath}` um ficheiro onde o agente escreve a resposta. Cada execução tem de passar o esquema através de um dos dois primeiros. `result.source` é `outputFile` ou `stdout`. `pointer` escolhe a resposta dentro desse documento, e `errorPointer` indica um booleano que é true quando o agente comunica uma falha. O host valida a resposta com o esquema, limita o tamanho, aplica um tempo limite e trata uma saída diferente de zero como falha. Os fornecedores são donos das opções que mantêm a execução não interativa e sem as ferramentas, hooks e acesso à rede de que a etapa não precisa.

As capacidades do agente pertencem ao plugin. Declara-as como `settings` normais e associa cada uma a opções com `settingArgs`; o host insere os argumentos escolhidos num marcador `{settings}`. Uma definição booleana usa `args` quando é true e `otherwise` quando é false ou não está definida. As restantes definições usam `args` com `{value}` substituído, e só aceitam palavras simples (letras, dígitos, `.`, `_`, `:` e `-`); uma definição de cadeia com `choices` só aceita uma delas. O `default` de uma definição aplica-se quando nem a aplicação nem o espaço de trabalho definem um valor. O host congela os valores resolvidos em cada execução de geração para a poder reproduzir.

`progress` permite ao host mostrar o que o agente está a fazer enquanto trabalha. Cada entrada é uma expressão regular comparada com cada linha que o agente imprime; o primeiro grupo de captura (ou `label`) torna-se um passo do tipo `thinking`, `search` ou `step`, para os criadores acompanharem em direto o raciocínio e as pesquisas. Os agentes que imprimem um evento JSON por linha acrescentam um `pointer` a cada padrão para comparar o texto nesse ponto do evento, e leem a resposta com a origem de resultado `stdoutLastLine`.

Os agentes que conseguem ver imagens declaram `imageArgs`, como `["-i", "{imagePath}"]`, e colocam `{images}` em `args`. O host repete esses argumentos uma vez por cada imagem que quer que o agente veja, como referências de miniaturas ou imagens encontradas ao pesquisar um criador, e deixa `{images}` vazio para os agentes que não o suportam.

Os agentes que leem imagens a partir de uma mensagem estruturada declaram antes `structuredRun.imageInput` (esquema de manifesto 13). Quando uma execução leva imagens, o Arrumo acrescenta os seus `args` e escreve na entrada padrão uma linha JSON construída a partir de `stdin`: a cadeia `"{prompt}"` passa a ser o pedido e um elemento de lista `"{images}"` torna-se uma cópia de `image` por imagem, com `"{data}"` como os bytes em base64 e `"{mediaType}"` como `image/png`, `image/jpeg`, `image/gif` ou `image/webp`; as outras imagens, como as SVG, e as com mais de 5 MB ficam de fora. As execuções sem imagens continuam a enviar o pedido tal como está. O Claude Code usa isto com `--input-format stream-json`.

Os agentes com a sua própria ferramenta de imagens também declaram a capacidade `image-generation` e um `imageRun`. O Arrumo envia o pedido da imagem pela entrada padrão, lê o identificador de sessão dos eventos JSON impressos em `sessionPointer` e recolhe o ficheiro PNG, JPEG ou WebP mais recente de `outputDirectory`: `path` (com `{session}`) dentro da pasta da variável de ambiente `env`, ou dentro de `fallback` na pasta pessoal. O agente continua só de leitura e não escreve nada por si. O Arrumo verifica e recorta a imagem como a de qualquer outro fornecedor, e remove o que a execução deixou. `{images}` anexa referências de estilo através de `structuredRun.imageArgs`.

```json
"imageRun": {
  "args": ["exec", "--sandbox", "read-only", "--enable", "image_generation", "{images}", "--json", "-"],
  "sessionPointer": "/thread_id",
  "outputDirectory": {"env": "CODEX_HOME", "fallback": ".codex", "path": "generated_images/{session}"}
}
```

Os agentes do esquema 11 podem declarar um `usageRun` para os criadores verem quanto lhes resta da quota do plano, junto dos fornecedores com chave em Definições › Serviços e chaves e nos avisos de quota baixa. O Arrumo inicia a CLI com `args`, escreve cada valor de `input` na entrada padrão como uma linha JSON e lê a primeira linha JSON impressa cujo `id` seja `responseId`. Cada elemento de `windows` aponta para a percentagem usada e, opcionalmente, para a hora de renovação em segundos Unix e a duração em minutos; o Arrumo mostra o período mais usado. A leitura não pode gastar quota, e para ao fim de 20 segundos.

```json
"usageRun": {
  "args": ["app-server"],
  "input": [
    {"id": 1, "method": "initialize", "params": {"clientInfo": {"name": "arrumo", "version": "1"}}},
    {"method": "initialized"},
    {"id": 2, "method": "account/rateLimits/read"}
  ],
  "responseId": 2,
  "windows": [{"usedPercent": "/result/rateLimits/primary/usedPercent",
               "resetsAt": "/result/rateLimits/primary/resetsAt",
               "minutes": "/result/rateLimits/primary/windowDurationMins"}]
}
```

Os agentes que só informam a quota enquanto trabalham podem declarar antes um `usageEvent` (esquema 12). Em cada execução normal, o Arrumo procura a última linha JSON impressa cujo `typePointer` seja igual a `typeValue`, lê cada janela (`used` como `fraction` de 0 a 1 ou como `percent`, um ponteiro `resetsAt` opcional e uma duração fixa em `minutes`) e guarda-as. Serviços e chaves mostra então a janela mais usada que ainda não reiniciou, por isso nenhum pedido extra gasta a quota. Até o agente correr uma vez, não é mostrada utilização.

```json
"usageEvent": {
  "typePointer": "/type",
  "typeValue": "rate_limit_event",
  "windows": [{"used": "/rate_limit_info/unifiedWindows/seven_day/utilization",
               "scale": "fraction",
               "resetsAt": "/rate_limit_info/unifiedWindows/seven_day/resetsAt",
               "minutes": 10080}]
}
```

```json
"settings": [
  {"id": "web-search", "label": "Web search", "description": "…", "kind": "boolean",
   "scope": "workspace", "required": false, "default": false},
  {"id": "reasoning-effort", "label": "Reasoning effort", "description": "…",
   "kind": "string", "scope": "workspace", "required": false,
   "choices": ["low", "medium", "high"], "default": "medium"}
],
"structuredRun": {
  "args": ["exec", "{settings}", "--output-schema", "{schemaPath}", "-"],
  "settingArgs": [
    {"setting": "web-search", "args": ["-c", "web_search=\"live\""],
     "otherwise": ["-c", "web_search=\"disabled\""]},
    {"setting": "reasoning-effort", "args": ["-c", "model_reasoning_effort=\"{value}\""]}
  ],
  "result": { "source": "outputFile" }
}
```

### Mensagens de seguimento

Quando um agente pede ao host material do espaço de trabalho, o Arrumo responde na mesma sessão se o plugin declarar `resume`, enviando só o material novo em vez de todo o pedido outra vez. Põe `{ephemeral}` em `args` onde ficam as opções que impedem o agente de guardar uma sessão, e lista-as em `ephemeralArgs`; o host omite-as só numa execução a que vai dar seguimento. `resume.args` substitui `args` no seguimento, com `{session}` para o identificador lido de `resume.session`. Se uma sessão não puder continuar (desapareceu, não se consegue ler ou está bloqueada), o host começa uma nova com todo o pedido e todo o material reunido até aí.

Declara `resume.cleanup` para as sessões guardadas não se acumularem no histórico do próprio agente: o Arrumo regista cada sessão que guarda e apaga os ficheiros quando o vídeo a que pertence é concluído, falha ou é cancelado, ou logo depois de um pedido que não tem vídeo. Procura dentro de `directory`, na pasta indicada pela variável `homeEnv` (só caminhos absolutos), ou então em `home` dentro da pasta pessoal do utilizador, os ficheiros cujo nome termine em `fileSuffix`. Nunca segue ligações e remove as pastas que a remoção deixa vazias.

```json
"args": ["exec", "{ephemeral}", "--output-schema", "{schemaPath}", "-"],
"ephemeralArgs": ["--ephemeral"],
"resume": {
  "args": ["exec", "resume", "--output-schema", "{schemaPath}", "{session}", "-"],
  "session": {"stream": "stderr", "pattern": "^session id: ([0-9A-Za-z-]+)$"},
  "cleanup": {"homeEnv": "CODEX_HOME", "home": ".codex", "directory": "sessions", "fileSuffix": "{session}.jsonl"}
}
```
