---

title: "Espaços de trabalho, perfis e recursos"
description: "Configura o ponto de partida de cada vídeo de um espaço de trabalho."
---

## Espaços de trabalho

Usa `create_workspace` para criar um espaço de trabalho; começa com um ícone e uma cor predefinidos ao acaso. Usa `rename_workspace` para lhe mudar o nome e `set_workspace_appearance` para mudar a cor, o ícone (um de `clapperboard`, `camera`, `mic`, `sparkles`, `rocket`, `gamepad`, `book`, `palette`, `music`, `code`, `heart`, `leaf`, `briefcase`, `graduation-cap`, `utensils`, `dumbbell`) ou a imagem mostrada em vez dele. Usa `get_workspace_context` e `set_workspace_context` para ler ou substituir o contexto em Markdown. Usa `list_profiles`, `create_profile` e `update_profile` para gerir os perfis de produção; `draft_profile` para o agente do espaço de trabalho propor a descrição e as orientações de edição de um perfil novo a partir do nome e de algumas palavras sobre os vídeos (nada é guardado); e `set_profile_description` e `set_profile_format_context` para a descrição e o contexto por formato. Usa `share_asset_with_profile`, `unshare_asset_from_profile`, `list_profile_assets` e `list_asset_profile_shares` para limitar recursos do espaço de trabalho a perfis. Passa o identificador de um perfil como `profile_id` nas definições do rascunho. A fila captura o contexto e o perfil guardados quando cria a execução.

## Cópias de segurança

Usa `arrumo-workspaces <database-path> snapshot-database <new-sqlite-file>` para capturar o estado confirmado do SQLite, incluindo as escritas no WAL de origem. O comando cria um ficheiro novo e indica o SHA-256 e o tamanho em bytes. O instantâneo inclui os registos do SQLite e os ZIP de plugins guardados. Os ficheiros multimédia geridos, os ficheiros de entrega e as credenciais do armazenamento do sistema exigem passos de cópia à parte.

Para uma cópia completa, `export-backup <new-zip>` escreve num único ZIP o instantâneo da base de dados, os ficheiros multimédia geridos e as entregas verificadas, com um manifesto que indica os espaços de trabalho e os plugins instalados e lista o tamanho e o SHA-256 de cada ficheiro (`verify-backup <zip>` verifica-o). As credenciais ficam no armazenamento do sistema. `stage-backup-import <zip>` verifica uma cópia e prepara-a junto da base de dados; a aplicação para computador aplica-a no arranque seguinte, antes de alguma coisa abrir a base de dados, e guarda os dados substituídos numa pasta datada `workspaces.sqlite.before-import-*` (`apply-backup-import` faz o mesmo sem interface; `cancel-backup-import` descarta a cópia preparada). As cópias de uma versão mais recente do Arrumo são recusadas. O MCP e o A2A expõem `export_backup`, `verify_backup`, `stage_backup_import`, `get_backup_import_status` e `cancel_backup_import`. Na aplicação, isto está em **Definições › Importar e exportar**.

## Perfis

Para criar e listar perfis do espaço de trabalho 1:

```sh
cargo run --locked -- ./workspaces.sqlite create-profile 1 "Reviews" "## Keep hands-on demos" "#532A9D"
cargo run --locked -- ./workspaces.sqlite profiles 1
```

Para atualizar o perfil 1 do espaço de trabalho 1:

```sh
cargo run --locked -- ./workspaces.sqlite update-profile 1 1 "Tutorials" "## Explain each step" "#532A9D"
```

Passa orientações vazias para as apagar, ou omite a cor ao atualizar para a remover. Ao criar, as orientações e a cor são opcionais. As cores usam `#RRGGBB`.

Um perfil também tem uma descrição de uma linha com até 280 caracteres, mostrada nas listas, e contexto em Markdown para um formato de saída. O contexto de formato só se aplica aos formatos ativos, e guardar texto vazio apaga-o. Ambos são capturados com o perfil nos instantâneos de geração.

```sh
cargo run --locked -- ./workspaces.sqlite set-profile-description 1 1 "Step-by-step tutorials"
cargo run --locked -- ./workspaces.sqlite set-profile-format-context 1 1 2 "Keep each step under 20 seconds."
```

Os recursos do espaço de trabalho podem ser partilhados com um perfil inteiro ou com um dos seus formatos. Partilhar não copia o ficheiro. Uma partilha com todo o perfil substitui as partilhas desse recurso com os formatos do perfil, e substituir o ficheiro de um recurso mantém as partilhas. As execuções de um perfil capturam os recursos partilhados como `profile_assets`, cada um com o seu `format_id`, ou null para todos os formatos.

```sh
cargo run --locked -- ./workspaces.sqlite share-asset 1 3 1        # every format of profile 1
cargo run --locked -- ./workspaces.sqlite share-asset 1 4 1 2      # only format 2
cargo run --locked -- ./workspaces.sqlite profile-assets 1 1
cargo run --locked -- ./workspaces.sqlite unshare-asset 1 4 1 2
```

## Formatos de saída e entregáveis

Os formatos de saída do espaço de trabalho incluem por predefinição Horizontal (1920 × 1080) e Vertical (1080 × 1920). Para o espaço de trabalho 1:

```sh
cargo run --locked -- ./workspaces.sqlite formats 1
cargo run --locked -- ./workspaces.sqlite create-format 1 '{"name":"Square","width":1080,"height":1080,"enabled":true}'
```

Usa `update-format <workspace-id> <format-id> <settings-json>` para editar ou desativar um formato, e `remove-format <workspace-id> <format-id>` para o remover.

Os perfis veem os formatos ativos do espaço de trabalho e podem substituir a largura e a altura em separado. A lista devolve as dimensões resolvidas e as substituições tal como estão. Ao guardar, os campos ausentes ou null herdam os valores do espaço de trabalho.

```sh
cargo run --locked -- ./workspaces.sqlite profile-formats 1 1
cargo run --locked -- ./workspaces.sqlite set-profile-format 1 1 1 '{"width":1280}'
cargo run --locked -- ./workspaces.sqlite set-profile-format 1 1 1 '{}'
```

Desativar um formato esconde-o e mantém as substituições para quando voltar a ser ativado. Remover um formato apaga as substituições.

Os formatos de saída do espaço de trabalho têm definições de entrega complementares: número de miniaturas, títulos e descrições, um interruptor de etiquetas, e orientações e especificações de miniaturas em Markdown. O vídeo final e as legendas continuam obrigatórios. Ao substituir as definições complementares, os campos omitidos voltam a zero, false ou texto vazio.

```sh
cargo run --locked -- ./workspaces.sqlite set-format-delivery 1 1 '{"thumbnails":3,"titles":3,"descriptions":1,"tags":true}'
cargo run --locked -- ./workspaces.sqlite format-delivery 1 1
```

As definições de entrega de um perfil podem substituir valores concretos do espaço de trabalho para cada formato ativo. O comando de leitura devolve os valores do espaço de trabalho, as substituições e a entrega efetiva. Guardar substitui o conjunto de substituições do perfil. Os campos omitidos e null herdam. Zero, false e texto vazio são valores explícitos.

```sh
cargo run --locked -- ./workspaces.sqlite set-profile-delivery 1 1 1 '{"thumbnails":0,"tags":false}'
cargo run --locked -- ./workspaces.sqlite profile-delivery 1 1 1
```

As definições de entrega podem incluir `portrait_derivatives`. Para pedir dois derivados verticais a partir do perfil 1, usa `{"portrait_derivatives":{"count":2,"source":{"type":"profile","profile_id":1}}}` no JSON das definições de entrega. O perfil de origem tem de pertencer ao espaço de trabalho. Usa `{"type":"manual","guidance":"…","thumbnails_per_video":2,"thumbnail_guidance":"…"}` como origem para indicar diretamente as orientações do derivado e das miniaturas. Uma contagem de zero desativa os pedidos de derivados. A entrega de um perfil pode substituir a configuração vertical como um todo.

Usa `list_output_formats`, `create_output_format` e `update_output_format` para configurar as dimensões de saída do espaço de trabalho. Usa `get_format_delivery` e `set_format_delivery` para os entregáveis complementares. Enviar uma substituição repõe os valores predefinidos dos campos complementares omitidos. O vídeo final e as legendas continuam obrigatórios.

Usa `list_profile_formats` e `get_profile_delivery` para ver as definições de formato herdadas e efetivas. Usa `set_profile_format_overrides` e `set_profile_delivery` para substituir as substituições de um formato num perfil. Omite um campo para herdar o valor do espaço de trabalho, ou envia um objeto de substituições vazio para herdar todos os campos desse grupo. Zero e false explícitos continuam a ser substituições.

Usa `remove_output_format` com um espaço de trabalho e um identificador de formato para retirar esse formato das execuções futuras. As definições de geração capturadas mantêm os formatos originais.

Usa `thumbnail_reference_ids` para escolher recursos de imagem existentes numa configuração de entrega, incluindo dentro de uma origem vertical manual. Os identificadores pertencem ao espaço de trabalho. Nas entregas de perfil, omite o campo de primeiro nível para herdar a seleção do espaço de trabalho, ou passa uma lista vazia para a apagar.

## Recursos

Importar um recurso para o espaço de trabalho copia-o para o armazenamento do espaço de trabalho, junto da base de dados, em `<database>.media/<workspace-id>/<asset-id>`. O ficheiro de origem fica onde está. As extensões de ficheiro classificam os recursos de imagem, áudio e vídeo suportados.

```sh
cargo run --locked -- ./workspaces.sqlite import-asset 1 ./reference.png
cargo run --locked -- ./workspaces.sqlite assets 1
cargo run --locked -- ./workspaces.sqlite set-asset-notes 1 1 "Keep the product centered"
```

Usa `import_workspace_asset` com um identificador de espaço de trabalho e um caminho local absoluto em `source` para copiar um ficheiro multimédia para o armazenamento gerido. Usa `list_workspace_assets` para encontrar os identificadores dos recursos para as fontes de um rascunho. Usa `generate_library_images` para criar de uma a quatro imagens a partir de uma descrição (`aspectRatio` `16:9`, `9:16`, `1:1` ou `4:5`) com os fornecedores de imagens do espaço de trabalho, ou com um `provider` indicado; juntam-se aos recursos com as `notes` dadas. Usa `generate_library_speech` para locutar até 5000 caracteres num recurso de áudio com o primeiro fornecedor de voz (ou um indicado) e a voz configurada. Usa `generate_library_video` para criar um clip (`16:9`, `9:16` ou `1:1`, com `durationSeconds` dentro dos limites do modelo) com o primeiro fornecedor de vídeo que tenha adaptador e chave; consulta o fornecedor até ao tempo limite, e o clip junta-se aos recursos com as `notes` dadas e o modelo usado. `list_video_models` lista os modelos de cada fornecedor de vídeo, o selecionado, e as imagens e vídeos de referência que cada forma de o chamar aceita; passa `provider` e `model` para escolher um, e `references` (identificadores de recursos de imagem ou MP4 do espaço de trabalho) para os animar ou seguir. `generate_library_images` também aceita `references` de imagem e indica quantas cada fornecedor aceitou. Um fornecedor indicado que esteja desativado é recusado. `get_provider_usage` lê a quota de cada fornecedor com chave através do `usage.json` do SDK do plugin, e a quota do plano de cada agente instalado através do `usageRun` do esquema 11 (unidade `percent`, com a duração do período em `windowMinutes`) (utilização, limite, data de renovação e um nível: `ok`, `warning` com 20% ou menos restante, `danger` com 10% ou menos, ou `unknown` com o motivo); a aplicação para computador mostra-o em Definições › Serviços e chaves, como um aviso que se pode fechar no topo, e de novo acima de Gerar.

Usa `replace_workspace_asset` por MCP ou A2A com `workspaceId`, o `assetId` ativo e um caminho local absoluto em `source` para um ficheiro do mesmo tipo. O `asset` devolvido tem um identificador novo. Usa esse identificador nas operações seguintes sobre a substituição.

Usa `remove_workspace_asset` por MCP ou A2A com `workspaceId`, `assetId` e o nome de ficheiro guardado exato como `confirmedName`. Devolve `removed: false` quando o recurso não existe, está referenciado ou o nome não corresponde. Remover um recurso deixa a importação original no sítio.

Usa `import_thumbnail_reference` para importar uma imagem local com notas de referência para miniaturas. Usa `set_asset_notes` com o identificador do espaço de trabalho, o do recurso e notas em Markdown para mudar as orientações de utilização do recurso. Passa uma cadeia vazia para apagar as notas.

Usa `set-batch-asset-notes <workspace-id> <asset-ids-json> <markdown>` na CLI, ou `set_batch_asset_notes` no MCP e no A2A, para substituir de uma vez as notas de vários recursos. Um recurso inexistente ou de outro espaço de trabalho anula toda a atualização.

Lê as etiquetas e o grupo de um recurso com `asset-organization <workspace-id> <asset-id>` ou `get_asset_organization` por MCP e A2A. Substitui-os com `set-asset-organization <workspace-id> <asset-id> <settings-json>` ou `set_asset_organization`. As definições contêm um `group` opcional e uma lista `labels`. Um objeto de definições vazio apaga ambos sem alterar o recurso nem as referências.

Usa `replace-asset <workspace-id> <asset-id> <source-path>` para importar uma substituição do mesmo tipo. Devolve o identificador do recurso novo, transfere as notas de utilização e a organização, e atualiza as referências de rascunhos, marca e miniaturas. O ficheiro anterior continua disponível para as execuções que o capturaram. Os ficheiros originais ficam onde estão.

Usa `remove-asset <workspace-id> <asset-id> <confirmed-name>` para remover um recurso não usado e o respetivo ficheiro gerido. Usa o nome de ficheiro guardado exato. As fontes de rascunhos, as atribuições de marca, as referências de miniaturas e as referências de execuções capturadas protegem os seus recursos. Se a limpeza de ficheiros for interrompida, repete o mesmo comando para a terminar. No arranque, a aplicação para computador volta a tentar as limpezas de recursos pendentes e recupera os ficheiros geridos substituídos que já não têm referências.

Ferramentas de voz e dobragem: `list_speech_models` lista os modelos com nome de cada fornecedor de voz, para que é ideal cada um e o limite de caracteres; passa `provider` e `model` a `generate_library_speech`. `get_speech_provider_status` indica o formato de áudio, o limite e onde está a chave de um fornecedor de voz, nunca a chave. `list_audio_transforms` e `transform_audio_asset` mudam a voz de um recurso de áudio ou vídeo (`voice-change`, com um ID de `voice` opcional) ou mantêm só a voz (`voice-isolation`). `list_dubbing_providers` e `dub_asset` dobram a fala de um recurso para um dos códigos `language` do fornecedor, esperando que termine. Cada resultado é um recurso novo cujas notas indicam a origem. `list_image_models` lista os modelos de imagem. `list_ready_plugins` lista os plugins ativos com todas as definições obrigatórias e chaves preenchidas; os outros ainda não podem trabalhar. `list_workspace_footage` lista o material de origem, `list_pending_reviews` as execuções à espera de uma pessoa e `list_saved_run_motion` que animações de uma execução estão na biblioteca de animações.

## Contexto, comentários e marca

A vista Contexto do espaço de trabalho edita as orientações de produção em Markdown. O editor oferece um modelo traduzido até ao primeiro guardar. A CLI devolve JSON `null` para um contexto por definir e uma cadeia vazia para um contexto que o utilizador apagou explicitamente.

```sh
cargo run --locked -- ./workspaces.sqlite set-context 1 '## Audience'
cargo run --locked -- ./workspaces.sqlite context 1
```

Os cartões de comentários do agente ficam no Contexto do espaço de trabalho. Uma ferramenta pode registar uma observação localmente com `add-feedback <workspace-id> <title> <markdown>`. Usa `feedback <workspace-id>` para listar os cartões e `update-feedback <workspace-id> <feedback-id> <title> <markdown>` para rever um. Os cartões também podem ser abertos e editados na aplicação para computador.

A vista Marca do espaço de trabalho guarda uma paleta ordenada. Usa `brand-colors <workspace-id>` para a ler e `set-brand-colors <workspace-id> '["#532A9D","#FFFFFF"]'` para a substituir. As cores usam notação hexadecimal de seis dígitos. Usa uma lista vazia para apagar a paleta.

O catálogo de imagens de marca associa imagens existentes do espaço de trabalho aos papéis `identity` (por exemplo, logótipos ou avatares) e `style` (referência visual). Uma imagem pode ter os dois papéis sem outra cópia do ficheiro.

```sh
cargo run --locked -- ./workspaces.sqlite attach-brand-asset 1 1 identity
cargo run --locked -- ./workspaces.sqlite brand-assets 1
cargo run --locked -- ./workspaces.sqlite detach-brand-asset 1 1 identity
```

O Contexto do espaço de trabalho usa a barra de texto formatado do editorcn com Tiptap Markdown. Usa o interruptor de código Markdown para editar o Markdown diretamente, incluindo sintaxe que a barra não oferece. O espaço de trabalho continua a guardar Markdown.

`draft-context <workspace-id> <sources-json> [notes]` (e a ferramenta `draft_workspace_context`) lê até oito páginas web públicas, como o site ou o canal do criador, e deixa o agente do espaço de trabalho redigir o contexto e sugerir perfis. Só são contactados endereços públicos: cada redirecionamento é verificado e a ligação fica fixa no endereço verificado. As páginas chegam ao agente como dados citados, as ligações ilegíveis voltam com um código de motivo, e nada é guardado até o criador guardar o rascunho em **Contexto**. O rascunho também sugere cores de marca, imagens descritas e agrupadas, e perfis; quando o plugin do agente aceita imagens, olha para até oito (primeiro as miniaturas de vídeo) para descrever o que mostram. `import-context <workspace-id> <import-json>` (e a ferramenta `import_workspace_context`) acrescenta as sugestões que o criador mantém, como `{"colors": [...], "images": [...], "profiles": [...]}`, descarregando imagens só de endereços públicos. Cada ligação tentada é lembrada, com a indicação de se foi possível lê-la; `list_context_sources` lista-as e `forget_context_source` esquece uma, e a página Contexto mostra-as como etiquetas com a data da última leitura.

Usa `list_workspace_feedback`, `add_workspace_feedback` e `update_workspace_feedback` para gerir os cartões de orientações do espaço de trabalho. Usa `get_brand_colors` e `set_brand_colors` para ler ou substituir a paleta; `get_brand_colors` também devolve `palette`, com o nome de cada cor e se os vídeos a usam, e `set_brand_color_details` altera esses dados. A geração só lê as cores que os vídeos usam. As execuções novas capturam as duas entradas.

Usa `list_brand_assets`, `attach_brand_asset` e `detach_brand_asset` por MCP ou A2A para gerir que imagens do espaço de trabalho servem de recursos de identidade ou de referências de estilo. Remover um papel mantém a imagem na biblioteca do espaço de trabalho.
