---

title: "Rascunhos, execuções e revisão"
description: "Põe vídeos em fila, avança pelas etapas e revê os resultados."
---

## Rascunhos

Cria rascunhos de vídeo com uma lista ordenada de identificadores de recursos de vídeo do espaço de trabalho, ou começa do zero com um resumo de intenção. Um `profile_id` opcional tem de se referir a um perfil do mesmo espaço de trabalho.

```sh
cargo run --locked -- ./workspaces.sqlite create-draft 1 '{"title":"Review","source_ids":[2,1],"profile_id":1}'
cargo run --locked -- ./workspaces.sqlite create-draft 1 '{"title":"Explainer","intent":"Show how a cube works"}'
cargo run --locked -- ./workspaces.sqlite drafts 1
```

Usa `update-draft <workspace-id> <draft-id> <settings-json>` para substituir as definições guardadas do rascunho e a ordem das fontes. A vista Rascunhos da aplicação também permite editar e cancelar. Um grupo de fontes inválido deixa o rascunho original intacto.

Usa `create_video_draft` e `update_video_draft` para guardar rascunhos antes de os pôr em fila. Passa o objeto `settings` completo com um título e uma intenção ou uma lista ordenada `source_ids` de recursos de vídeo geridos do espaço de trabalho. Um `profile_id` opcional escolhe um perfil do espaço de trabalho. Guarda o identificador do rascunho devolvido para o atualizar e pôr em fila.

Apaga um rascunho que não esteja em fila com `delete-draft <workspace-id> <draft-id> <confirmed-title>` na CLI ou `delete_video_draft` por MCP e A2A. Passa o título guardado exato. Um rascunho referenciado por uma execução continua disponível para essa execução e para as repetições. As fontes geridas ficam na biblioteca do espaço de trabalho.

## Fila, workers e controlo

Põe um rascunho guardado em fila com uma chave de pedido e opções de execução. Tentar de novo com o mesmo espaço de trabalho, chave, rascunho e opções devolve a execução existente. As execuções em fila mantêm o instantâneo enviado mesmo que o rascunho ou o espaço de trabalho sejam editados depois.

```sh
cargo run --locked -- ./workspaces.sqlite enqueue-draft 1 1 request-1 '{"autopilot":false,"platform":"YouTube"}'
cargo run --locked -- ./workspaces.sqlite generation-runs 1
```

Um worker reclama trabalho em fila com `claim-generation <workspace-id>`. A reclamação inclui um número de tentativa e uma concessão de 60 segundos. Usa `checkpoint-generation <workspace-id> <run-id> <attempt> <json>` para guardar o progresso e renovar a concessão. As reclamações expiradas podem ser reclamadas de novo com o último ponto de controlo guardado. Usa `control-generation <workspace-id> <run-id> <pause|resume|cancel>` para controlar as execuções e `generation-activity <workspace-id> <run-id>` para ler o histórico de transições. As sessões de agente que o Arrumo guardou para seguimentos são apagadas do histórico do agente quando a execução termina, falha ou é cancelada; a aplicação faz isto de poucos em poucos minutos, e `sweep-agent-sessions` fá-lo de imediato.

Um worker pode comunicar uma falha definitiva com `fail-generation <workspace-id> <run-id> <attempt> <detail>`. Dá um motivo curto e compreensível, sem credenciais nem registos em bruto do fornecedor. O histórico de atividade da aplicação mostra o motivo. Usa Tentar de novo na fila da aplicação ou `control-generation <workspace-id> <run-id> retry` para devolver uma execução falhada à fila com o ponto de controlo intacto.

As execuções novas guardam o plano de produção a partir do instantâneo congelado no momento em que entram na fila. Usa `generation-plan <workspace-id> <run-id>` para o ler assim que a execução está em fila. Um worker recebe o passo atual com a reclamação. Em execuções antigas sem plano guardado, o worker pode usar `prepare-generation-plan <workspace-id> <run-id> <attempt>` com a concessão ativa. Os planos guiados assinalam as etapas que exigem revisão. Os planos em piloto automático omitem esses requisitos.

Um worker com concessão pode usar `submit-stage <workspace-id> <run-id> <attempt> <stage> <result-json>` para registar o passo atual do plano. Uma execução guiada espera por `review-stage <workspace-id> <run-id> <result-id> <approved|rejected|revise> <notes>`. A aprovação avança para a etapa seguinte. A rejeição e a revisão voltam a pôr a etapa atual em fila e mantêm o histórico de revisão. Usa `production-progress <workspace-id> <run-id>` para ler os resultados e as decisões. A verificação da entrega tem um caminho de conclusão próprio.

`control-generation <workspace-id> <run-id> stop` devolve uma execução ao passo revisto anterior: o resultado mais recente de uma etapa anterior volta a abrir para revisão, e a decisão original fica no histórico.

Usa `replay-generation <workspace-id> <source-run-id> <request-key> <captured|current>` para pôr em fila uma execução nova a partir de um vídeo concluído. O modo capturado copia o instantâneo de entrada original. O modo atual resolve o último rascunho guardado, o espaço de trabalho, o perfil, a saída e as definições de pré-visualização, com a plataforma e as opções de piloto automático da execução original. Ambos os modos começam no início do plano de produção. Repete a mesma chave, origem e modo para obter a mesma repetição.

Para pôr em fila um rascunho guardado, chama `list_video_drafts` com o identificador do espaço de trabalho e depois `enqueue_video_draft` com o identificador do rascunho e uma chave de pedido. Reutiliza a chave para tentar de novo o mesmo envio. Usa `list_generation_runs` e `get_generation_run` para ver as execuções e as definições capturadas, e `control_generation` para pausar, retomar, tentar de novo ou cancelar uma execução. Usa `get_production_progress` para identificar um resultado de etapa pendente e `review_production_result` para enviar uma aprovação, uma rejeição ou um pedido de revisão.

Os workers podem chamar `claim_generation` para a execução seguinte e usar o número de tentativa devolvido com `checkpoint_generation` para guardar o progresso e renovar a concessão. Envia os resultados de etapa com `submit_production_result` enquanto a concessão está ativa. A verificação da entrega usa um fluxo à parte. Usa `get_generation_activity` para ler as transições registadas da execução, e `list_agent_logs` e `get_agent_log` (com `workspaceId` e `runId` ou `logId`) para ler o que foi pedido ao agente e o que ele imprimiu.

Usa `get_generation_plan` para ver os passos preparados de uma execução. Um worker pode usar `fail_generation` com a tentativa atual e um diagnóstico curto para o registo de atividade. Quando uma execução termina, `replay_generation` pode pôr em fila uma execução nova em modo `captured` ou `current`. Reutiliza a mesma chave e o mesmo modo ao tentar de novo o envio de uma repetição.

## Agente de edição

Usa `agent-settings <app|workspace-id>` para ver o agente configurado e de onde vem. Usa `set-agent-provider <app|workspace-id> <plugin-id|unset>` para mudar a escolha. Retirar a substituição de um espaço de trabalho repõe a escolha da aplicação, se existir. As execuções novas congelam a seleção resolvida e a respetiva origem. Escolher um fornecedor é independente de ligar ou executar o agente.

Abre **Definições** na barra lateral para escolher o agente de produção da aplicação. Usa o seletor de âmbito das definições para configurar uma substituição por espaço de trabalho ou repor a herança. O fornecedor efetivo e a origem aparecem por baixo do seletor.

Numa instalação nova, criar o primeiro espaço de trabalho abre a configuração do agente se não houver fornecedor escolhido para a aplicação. As definições podem verificar se a CLI escolhida está no PATH do Arrumo e abrir o guia de instalação do fornecedor no navegador do sistema. Esta verificação indica se a CLI está disponível localmente. A autenticação é feita na configuração do próprio fornecedor.

Usa **Verificar sessão** nas Definições ou `agent-login-status <plugin-id>` na CLI para perguntar ao fornecedor instalado pelo estado da autenticação local. A verificação não faz nenhum pedido de geração e só devolve uma categoria de estado. Expira ao fim de cinco segundos. No Windows, a deteção e as verificações de sessão usam um executável nativo do PATH.

Usa `agent-plugins` para listar os fornecedores de agentes incluídos. Os identificadores, nomes, guias de configuração e verificações de autenticação vêm dos manifestos do SDK dos repositórios dos fornecedores. As compilações importam os plugins predefinidos do registo a partir dos checkouts separados. A instalação em tempo de execução e as autorizações de confiança são funções à parte do host.

Usa `list_agent_plugins` para descobrir os agentes de produção incluídos e `get_agent_settings` para ler a escolha efetiva. Usa `set_agent_provider` ou `clear_agent_provider` no âmbito da aplicação ou de um espaço de trabalho. Omite `workspaceId` para o âmbito da aplicação. As alterações afetam os instantâneos de execuções futuras. Uma execução cujo agente capturado foi desativado entretanto falha na etapa de agente seguinte com esse motivo; ativa o agente e tenta de novo.

Usa `get_agent_login_status` por MCP ou A2A com o identificador do plugin de agente incluído para verificar se a sessão local está pronta. O host devolve um estado e descarta a saída da verificação.

## Registos do agente

Cada execução do agente fica registada com o prompt, a linha de comandos, a saída padrão, a saída de erros, a resposta e o problema. Usa `agent-logs <workspace-id> [run-id]` para as listar, da mais recente para a mais antiga, e `agent-log <workspace-id> <log-id>` para ler uma. Uma entrada em curso é atualizada a cada dois segundos, e uma entrada que ficou em curso por causa de uma falha é marcada como interrompida quando a etapa é tentada de novo. Na aplicação, abre **Registos do agente** junto da atividade de uma execução ou a partir do gerador de animações.

## O que o agente escreve em cada etapa

A etapa Guião é escrita pelo agente da execução quando o plugin declara uma execução estruturada (versão 7 do esquema do SDK). A aplicação redige em segundo plano os guiões em fila; `process-script-stage <workspace-id> <run-id>` e a ferramenta `process_script_stage` fazem-no a pedido. O agente recebe o resumo congelado, o contexto, o perfil, os formatos, os comentários aprendidos e, em tentativas seguintes, os rascunhos anteriores com as notas de revisão. Depois, uma execução guiada espera por revisão, e pedir alterações põe um rascunho novo em fila. Se o agente não conseguir terminar, a execução falha com o motivo e pode ser tentada de novo. Antes de o agente escrever, cada clip de origem é transcrito com os fornecedores de transcrição capturados da execução em blocos de 15 minutos, e a transcrição fica em cache para o ficheiro gerido. Os clips que os fornecedores não conseguem ouvir, por exemplo sem uma chave configurada, aparecem no resultado como `footage_without_transcript`, e o agente trabalha a partir dos nomes e das notas.

Quando uma execução não tem renderizador de movimento, o agente da execução planeia a etapa Recursos e animações: escolhe recursos da biblioteca e itens da biblioteca de movimento para cada secção do guião, ou nenhum quando as gravações sustentam o vídeo (`process-asset-plan`, `process_asset_plan`). Nos vídeos feitos com gravações, o agente corta depois a primeira pré-visualização a partir do guião aprovado e das transcrições com tempos, e o Arrumo renderiza-a (`process-preview-edit`, `process_preview_edit`); cada corte mantém o nome do clip e o propósito para a revisão. A aplicação executa ambos em segundo plano.

Um vídeo começado do zero não tem gravações para cortar. Em **Pré-visualizações de vídeo**, o agente transforma o guião aprovado num storyboard de cenas animadas, reutilizando animações aprovadas quando encaixam, e o Arrumo renderiza-as para cada formato. A renderização final renderiza as mesmas cenas em tamanho completo e escreve o SRT de cada formato a partir do texto no ecrã das cenas, a menos que já exista um SRT. O agente também escreve a narração de cada cena. Quando o primeiro fornecedor de texto para voz da execução tem credencial, o Arrumo locuta-a enquanto faz a pré-visualização, com a definição de voz do plugin ou a voz predefinida, alonga as cenas que precisam de mais tempo e guarda o áudio com a execução para a renderização final o reutilizar; as legendas passam então a seguir a narração. Se a síntese falhar, a pré-visualização fica sem som e o resumo diz porquê.

Na etapa Saídas complementares, o agente da execução escreve os títulos, descrições e listas de etiquetas pedidos para cada formato a partir do guião aprovado, mais um prompt de imagem por cada miniatura pedida. O Arrumo gera cada miniatura com a proporção do formato através da ordem `image-generation` capturada da execução, usando o adaptador `image-generation.json` de cada plugin fornecedor, saltando os fornecedores sem chave, e guarda-a como recurso do espaço de trabalho. Quando o criador aprova uns itens e devolve outros, o agente substitui só esses, com as notas, e os aprovados mantêm-se. A aplicação faz isto em segundo plano; `process-supplemental-writing <workspace-id> <run-id>` e a ferramenta `process_supplemental_writing` fazem-no a pedido. As etapas que também precisam de cortes verticais esperam por um renderizador. Para verificar a chave e o modelo de um fornecedor de imagens, executa `echo "prompt" | arrumo-workspaces <database> generate-image <workspace-id> 16:9 '["gemini"]'`.

Os formatos que pedem cortes verticais recebem-nos em Saídas complementares. O agente da execução escolhe o momento de cada corte na linha temporal do vídeo aprovado, e o Arrumo renderiza a edição aprovada a 1080×1920, recorta cada corte e acrescenta as miniaturas 9:16 pedidas através dos fornecedores de imagens da execução. Os cortes e as miniaturas são revistos com os restantes ficheiros complementares; devolver um corte pede outro momento e mantém as miniaturas, a menos que também tenham sido devolvidas.

## Saídas complementares

Na etapa `supplemental_outputs`, os workers podem enviar `supplemental_text` no resultado da etapa. Cada item tem um `kind` de `title`, `description` ou `tags`, um valor `text` em UTF-8 e um `format_id` opcional da execução congelada. Omite o formato para texto comum a todo o vídeo. O Arrumo aceita até 100 entradas e 64 KiB de texto no total. O resultado aceite fornece as ligações de ficheiros do vídeo concluído e acrescenta os ficheiros `supplemental-<kind>-<index>.txt` correspondentes ao ZIP de entrega. Os índices começam em 1 e seguem a ordem de envio.

Um resultado `supplemental_outputs` também pode incluir até 100 entradas `supplemental_media` com um `asset_id` e um `format_id` congelado opcional. Importa cada imagem, vídeo ou áudio para o espaço de trabalho da execução antes de enviar o identificador. A execução mantém essas versões exatas dos recursos mesmo depois de serem substituídas na biblioteca. As leituras do vídeo concluído expõem os metadados dos ficheiros aceites, e a exportação ZIP inclui ficheiros numerados `supplemental-media-<index>.<extension>`.

Para aprovar de forma seletiva, usa `review-supplemental-items <workspace-id> <run-id> <result-id> <decisions-json> <notes>`. O JSON tem as listas `text` e `media`, cada uma pela ordem dos itens enviados. Cada decisão é `approved`, `revise` ou `rejected`. Inclui uma lista vazia quando uma categoria não tem itens. A execução só avança quando todos os itens estão aprovados. Caso contrário, o envio seguinte de Saídas complementares fornece só as substituições dos itens pendentes, pela ordem original dentro de cada categoria. As substituições de texto mantêm o tipo e o âmbito. As substituições de ficheiros mantêm o tipo de ficheiro e o âmbito. O Arrumo coloca as substituições nas posições originais e mantém as entradas aprovadas. Os workers podem ler as decisões e as notas comuns no progresso de produção.

Na revisão guiada de Saídas da aplicação, escolhe uma decisão por item ou usa um botão de lote para decidir todos de uma vez. Podes alterar qualquer item antes de enviar. O Arrumo guarda as tuas escolhas e notas comuns localmente até escolheres **Enviar**.

O MCP e o A2A suportam `review_supplemental_items` com `workspaceId`, `runId`, `resultId`, `review` (as listas de decisões `text` e `media`) e `notes` opcionais. Numa mensagem de tarefa A2A, o identificador da tarefa indica o âmbito do espaço de trabalho e da execução.

Marca saídas concretas para aplicar uma decisão de lote só às linhas selecionadas. Depois de uma revisão parcial, as aprovações anteriores são preenchidas automaticamente e as substituições precisam de uma decisão nova. As escolhas de revisão podem ser alteradas até Enviar.

Uma revisão complementar pode incluir `review.item_notes` com listas `text` e `media` alinhadas com as listas de decisões. Usa `null` para um item sem nota. Cada nota tem um limite de 4 KiB em UTF-8. Os botões de nota da aplicação preparam comentários na linha correspondente até Enviar. Os workers recebem as notas com a revisão guardada no progresso de produção.

Quando um worker reclama uma etapa de Saídas complementares depois de uma revisão seletiva, a reclamação inclui `supplemental_revision`. Leva o identificador do resultado de origem, as notas comuns e listas separadas `text` e `media` de itens pendentes. Cada item tem o índice de posição a partir de zero, a decisão, a nota opcional e o valor enviado antes. Envia uma substituição por cada item listado, pela ordem da lista. O mesmo pedido sobrevive à expiração da concessão e à passagem para outro worker. As restantes reclamações omitem este campo.

Usa `review-preview-formats <workspace-id> <run-id> <result-id> <decisions-json> <notes>` para rever cada pré-visualização renderizada. Passa uma lista como `[{"format_id":1,"decision":"approved"},{"format_id":2,"decision":"revise"}]` com uma decisão por formato congelado. Se algum formato precisar de substituição, reclama a etapa e volta a usar `render-preview`. O renderizador mantém os ficheiros e cortes aprovados e só volta a renderizar os formatos pendentes. Uma revisão parcial exige o renderizador gerido. Quando todos os formatos estão aprovados, a renderização final usa os cortes mantidos ou revistos de cada formato.

A revisão de Pré-visualização da aplicação oferece decisões individuais e de lote por formatos selecionados para as pré-visualizações que cobrem todos os formatos congelados. Depois de uma revisão parcial, os formatos aprovados aparecem pré-selecionados. Podes juntar uma nota a um formato antes de Enviar, ou incluir uma `note` opcional em cada decisão de formato da CLI.

O MCP e o A2A expõem a mesma operação como `review_preview_formats`. Uma reclamação de worker depois de uma revisão seletiva inclui `preview_revision`, com o identificador do resultado de origem, as notas comuns e só os formatos pendentes. Cada entrada inclui a decisão, a nota de formato opcional, o nome de ficheiro da pré-visualização anterior e os cortes efetivos. O pedido sobrevive à passagem da concessão para outro worker. Para produzir os ficheiros de substituição, usa o renderizador gerido através de `render-preview` ou da aplicação.

## Vídeos concluídos

Usa `completed-video <workspace-id> <run-id>` para ler de uma vez o título atual, as entradas e definições capturadas, a entrega verificada, as decisões de produção e o histórico de atividade. Usa `rename-completed-video <workspace-id> <run-id> <title>` para mudar o título visível, mantendo o título do instantâneo da execução.

Usa `add-completed-video-feedback <workspace-id> <run-id> <run|result-id> <markdown>` para comentar um vídeo concluído ou um dos seus resultados de produção. Os comentários aparecem no detalhe do vídeo concluído. As execuções novas e as repetições com definições atuais do mesmo rascunho capturam esses comentários como comentários de entrega. As repetições capturadas reutilizam os comentários do instantâneo original.

Na barra lateral, abre **Vídeos concluídos** e escolhe um vídeo para rever a lista de ficheiros verificados, guardar um título visível ou exportar a entrega com a caixa de diálogo nativa para guardar o ZIP.

O painel do vídeo concluído também põe em fila uma repetição com definições capturadas ou atuais e guarda comentários em Markdown sobre o vídeo inteiro ou sobre um resultado de produção escolhido.

O separador **Vídeo** abre o leitor verificado, mostra um seletor de formato quando há várias saídas e inclui **Texto das legendas**. O Arrumo transmite o ficheiro escolhido pela interface local de loopback. A reprodução usa os codecs do WebView da aplicação. No Linux, o WebKitGTK precisa de descodificadores GStreamer de H.264 e AAC, como os fornecidos por `gstreamer1.0-libav` no Ubuntu.

No plano de produção de uma execução guiada, abre **Ver pré-visualização** para reproduzir um MP4 renderizado antes de enviar a decisão da etapa. Cada pré-visualização de substituição aparece com o seu próprio número de tentativa.

O plano de produção da aplicação pode renderizar uma pré-visualização com clips inteiros em execuções com gravações, renderizar a edição aceite na resolução final e verificar a entrega quando os SRT estão presentes. Cada ação reclama só a etapa mostrada no plano.

Usa `rename_completed_video` para mudar o título visível de uma execução concluída. Usa `add_completed_video_feedback` para guardar comentários em Markdown sobre a execução inteira ou um resultado de produção concreto. Passa o identificador do resultado de `get_completed_video` para comentar uma etapa.

Usa `delete-completed-video <workspace-id> <run-id> <confirmed-title>` na CLI para remover uma execução concluída e a respetiva pasta de entrega gerida. Usa o título visível atual exato. Uma execução referenciada por uma repetição continua disponível. Se a limpeza de ficheiros for interrompida, volta a executar o mesmo comando para a terminar. Os recursos de origem partilhados ficam na biblioteca do espaço de trabalho.

Por MCP ou A2A, usa `delete_completed_video` com `workspaceId`, `runId` e o `confirmedTitle` exato. Usa a mesma remoção e a mesma limpeza retomável que o comando da CLI.

Usa `recover-delivery-cleanup <workspace-id>` na CLI ou `recover_delivery_cleanup` no MCP e no A2A para tentar de novo a limpeza pendente de execuções apagadas antes. O relatório lista as limpezas concluídas e as entradas que ainda precisam de atenção.

Usa `delete-generation <workspace-id> <run-id> <confirmed-title>` ou a operação partilhada `delete_generation` para apagar uma execução em fila, ativa ou terminada. Uma remoção bem-sucedida invalida qualquer concessão de worker e remove a pasta de entrega gerida. O rascunho e os recursos partilhados continuam disponíveis. Os workers externos têm de deixar de usar os caminhos da execução quando a concessão deixa de ser válida.

## Calendário

Agenda uma saída verificada com `set-output-schedule <workspace-id> <run-id> <format-id> <YYYY-MM-DD|clear>`. Cada formato de saída pode ter a sua própria data. Usa `scheduled-outputs <workspace-id> <start-date> <end-date> [profile-id]` para listar um intervalo inclusivo. As entradas do calendário incluem a cor guardada do perfil e as dimensões da saída.

Por MCP ou A2A, usa `set_output_schedule` com um espaço de trabalho, uma execução e um identificador de formato. Passa uma `date` ISO ou null para a apagar. Usa `list_scheduled_outputs` com datas `start` e `end` e um `profileId` opcional para percorrer o calendário.

Abre o calendário da aplicação num mês e num perfil concretos com uma ligação como `arrumo://open/calendar?workspace=1&profile=2&month=2028-02`. Omite o perfil para ver todas as saídas do espaço de trabalho. As ligações para vídeos concluídos podem incluir um identificador `format` para escolher uma saída entregue concreta.

## Notificações

Consulta os eventos de revisão, conclusão e falha com `list_generation_notifications` e um identificador de espaço de trabalho, ou com a CLI `generation-notifications <workspace-id> <after-id>`. Começa com um cursor de zero e passa o último identificador de evento devolvido ao consultar de novo. Cada resposta contém no máximo 100 eventos por ordem crescente de identificador. Os eventos incluem o identificador da execução e descrevem transições que podem já ter sido tratadas.

Os eventos de conclusão incluem uma marca temporal `read_at` que pode ser nula. Para confirmar uma conclusão, chama `read_completion_notification` do MCP com os identificadores do espaço de trabalho e da execução, ou usa a CLI `read-completion-notification <workspace-id> <run-id>`. Ambos indicam se o estado mudou. A confirmação mantém o evento original e o identificador. Consulta de novo a partir de um cursor anterior para ver o estado de leitura atualizado. `read_all_completion_notifications` marca como lidas todas as conclusões de um espaço de trabalho. A caixa de entrada da aplicação lista revisões e conclusões, da mais recente para a mais antiga, com a hora em que aconteceram e o perfil do rascunho.

Enquanto o Arrumo está em segundo plano, a aplicação também envia cada novo evento de revisão, conclusão ou falha de todos os espaços de trabalho para as notificações do sistema operativo através do plugin de notificações do Tauri. Desativa isto em **Definições › Geral › Notificações**, ou com `set_notification_settings` do MCP (`get_notification_settings` lê-o). Clicar numa traz o Arrumo para a frente nessa execução ou vídeo terminado: o host da aplicação trata a ação do plugin de notificações, foca a janela e abre a página. Verificado no Linux (GNOME) com o sinal `ActionInvoked` do servidor; o macOS e o Windows comunicam os cliques através do mesmo tratamento do plugin, mas não foram testados. A caixa de entrada da aplicação liga sempre à execução.
