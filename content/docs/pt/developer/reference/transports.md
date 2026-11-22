---

title: "MCP e A2A"
description: "Liga agentes e ferramentas à API partilhada da aplicação."
---

## MCP local

Configura um cliente MCP local para lançar `arrumo-workspaces <database-path> mcp` por stdio. Este servidor suporta MCP `2025-11-25` e expõe `list_workspaces`, `list_plugin_actions` e `invoke_plugin_action`. Passa o digest do pacote devolvido pela lista de ações, e um identificador de espaço de trabalho para as ações de espaço de trabalho. O processo cliente tem o mesmo acesso aos espaços de trabalho que um operador que use a CLI local. A execução de ações aplica o isolamento e as autorizações de plugins existentes. Passa um caminho absoluto para a base de dados ao configurar o cliente.

## A2A local

Executa `arrumo-workspaces <database-path> a2a <port>` com um token bearer alfanumérico aleatório de 32 a 256 caracteres na entrada padrão redirecionada. Usa a porta `0` para o sistema operativo escolher uma. O comando só escuta em `127.0.0.1` e imprime o endpoint quando está pronto. Quem tiver o token tem o mesmo acesso a essa base de dados e às operações locais que o operador da CLI.

Lê `/.well-known/agent-card.json` na origem impressa para obter a [interface JSON-RPC do A2A 1.0](https://a2a-protocol.org/latest/specification/#9-json-rpc-protocol-binding). Envia os pedidos para o endpoint impresso com `Authorization: Bearer <token>`, `Content-Type: application/json` e `A2A-Version: 1.0`. Por exemplo, envia este corpo JSON para descobrir os nomes e argumentos das operações.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "SendMessage",
  "params": {
    "message": {
      "messageId": "discover-operations-1",
      "role": "ROLE_USER",
      "parts": [{ "data": { "operation": "list_operations", "arguments": {} } }]
    }
  }
}
```

Usa o mesmo formato de mensagem com um nome de operação da lista e os respetivos argumentos. A resposta contém uma parte de dados com `result` ou um `error` da operação. A maioria das operações devolve mensagens diretas. Pôr em fila e repetir devolvem uma tarefa. Usa o identificador dela com `GetTask` ou `CancelTask`. O estado da tarefa reflete a fila de geração, e as tarefas concluídas incluem os metadados das saídas verificadas. Usa `ListTasks` para percorrer as tarefas, filtrando opcionalmente por `contextId` (como `workspace-1`), `status` ou `statusTimestampAfter`. Devolve `nextPageToken` com os mesmos filtros para obter a página seguinte. Alterações de estado simultâneas podem reordenar a lista entre páginas. Ativa `includeArtifacts` para incluir as saídas verificadas das tarefas concluídas. Usa `SendStreamingMessage` com o mesmo corpo de mensagem para receber Server-Sent Events, ou `SubscribeToTask` com o identificador de uma tarefa ativa. Os fluxos enviam o resultado inicial e depois instantâneos da tarefa à medida que o estado observado muda. Os fluxos fecham num estado final ou após 60 segundos. Volta a ligar-te a uma tarefa ativa para obter um instantâneo novo. O servidor aceita até oito fluxos simultâneos.

Para enviar uma decisão sobre uma tarefa à espera de revisão, envia uma mensagem de seguimento com o `taskId` e a operação `review_production_result`. Passa o `pendingReviewId` atual como `resultId`, mais a decisão e notas opcionais. O identificador da tarefa indica o espaço de trabalho e a execução. Se incluíres `contextId`, tem de corresponder à tarefa. Uma decisão bem-sucedida devolve a tarefa atualizada.
