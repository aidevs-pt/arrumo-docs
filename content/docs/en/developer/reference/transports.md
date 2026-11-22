---

title: "MCP and A2A"
description: "Connect agents and tools to the shared application API."
---

## Local MCP

Configure a local MCP client to launch `arrumo-workspaces <database-path> mcp` over stdio. This server supports MCP `2025-11-25` and exposes `list_workspaces`, `list_plugin_actions`, and `invoke_plugin_action`. Pass the package digest returned by the action listing, and pass a workspace ID for a workspace action. The client process has the same workspace access as an operator running the local CLI. Action execution applies the existing sandbox and plugin grants. Pass an absolute database path when configuring the client.

## Local A2A

Run `arrumo-workspaces <database-path> a2a <port>` with a randomly generated 32–256 character alphanumeric bearer token on redirected stdin. Use port `0` to let the OS choose a port. The command binds only to `127.0.0.1` and prints its endpoint when ready. Anyone with the token has the same access to that database and local operations as the CLI operator.

Read `/.well-known/agent-card.json` at the printed origin for the [A2A 1.0 JSON-RPC interface](https://a2a-protocol.org/latest/specification/#9-json-rpc-protocol-binding). Send requests to the printed endpoint with `Authorization: Bearer <token>`, `Content-Type: application/json`, and `A2A-Version: 1.0`. For example, send this JSON body to discover operation names and arguments.

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

Use the same message format with a listed operation name and arguments. The reply contains a data part with `result` or an operation `error`. Most operations return direct messages. Enqueue and replay return a task. Use its ID with `GetTask` or `CancelTask`. Task status reflects the generation queue, and completed tasks include verified output metadata. Use `ListTasks` to browse tasks, optionally filtering by `contextId` (such as `workspace-1`), `status`, or `statusTimestampAfter`. Pass `nextPageToken` back with the same filters to fetch the next page. Concurrent state changes can reorder the list between pages. Set `includeArtifacts` to include verified outputs for completed tasks. Use `SendStreamingMessage` with the same message body to receive Server-Sent Events, or `SubscribeToTask` with an existing active task ID. Streams send the initial result and then task snapshots as the observed state changes. Streams close at a terminal state or after 60 seconds. Reconnect to an active task for a fresh snapshot. The server accepts up to eight concurrent streams.

To submit a decision on a task waiting for review, send a follow-up message with its `taskId` and the `review_production_result` operation. Pass the current `pendingReviewId` as `resultId`, plus the decision and optional notes. The task ID supplies the workspace and run. If you include `contextId`, it must match the task. A successful decision returns the updated task.
