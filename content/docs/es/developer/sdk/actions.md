---

title: "Acciones y hooks"
description: "Declara acciones, sus formularios y ubicaciones, y ejecútalas con eventos."
---

## Declara acciones de backend

El esquema v6 permite que un complemento con componente de backend declare hasta 64 entradas en `actions`. Cada entrada tiene un `id` único, un `label` y una `description` legibles, y `scope` con `app` o `workspace`. El host llama a `invoke` con JSON de la forma `{"action":"action-id","input":...}`, usando el ámbito explícito de aplicación o espacio de trabajo de quien llama. Las acciones siguen sujetas a los límites del sandbox del componente y a las concesiones del complemento. Invocar un paquete que declara acciones requiere un identificador de acción declarado.

El esquema 9 da a una acción un formulario y lugares en la aplicación. `inputs` lista hasta 16 campos, cada uno con `id`, `label`, `description` opcional, `required` y un `kind`: `text`, `longText`, `number`, `boolean`, `choice` (con `choices`), `language`, `subtitles` o `json`. Arrumo muestra el formulario en lugar de una caja de JSON y envía `input` como un objeto con las claves de los identificadores de las entradas. Una entrada `subtitles` permite al creador elegir una pista de subtítulos del vídeo que está viendo, abrir un archivo SRT o pegar uno, y envía el texto SRT. `placements` lista dónde se ofrece la acción además de Ajustes: `draft` (junto a un borrador), `generation` (en la página de generación de un vídeo) y `completed-video` (en un vídeo terminado, incluido su menú contextual). `translations.<lang>.actions.<id>.inputs.<input>` traduce el `label`, la `description` y las `choices` de una entrada.

```json
{
  "id": "translate-subtitles",
  "label": "Translate subtitles",
  "description": "…",
  "scope": "workspace",
  "inputs": [
    {
      "id": "subtitles",
      "label": "Subtitles",
      "kind": "subtitles",
      "required": true
    },
    { "id": "language", "label": "Into", "kind": "language", "required": true }
  ],
  "placements": ["completed-video"]
}
```

### Ejecuta una acción sola (hooks)

Una acción de espacio de trabajo del esquema 9 también puede declarar `hooks`, para ejecutarse sin que nadie abra su formulario. Hay tres eventos, con un hook como máximo cada uno: `video-completed` se dispara una vez por vídeo terminado, después de que Arrumo verifique los archivos de entrega; `generation-failed` se dispara una vez por intento de generación fallido; y `publish-date-reached` se dispara una vez por salida terminada en la fecha que el creador le asignó en el calendario. Cada hook nombra en `enabledBy` un ajuste booleano del mismo complemento, y solo se ejecuta mientras ese ajuste vale `true` para el espacio de trabajo, así que no pasa nada hasta que el creador lo activa. Arrumo muestra el hook junto al formulario de la acción.

```json
"settings": [{"id": "auto-upload", "label": "Upload finished videos", "description": "…",
              "kind": "boolean", "scope": "workspace", "required": false}],
"actions": [{"id": "upload", "label": "Upload", "description": "…", "scope": "workspace",
             "hooks": [{"event": "video-completed", "enabledBy": "auto-upload"}]}]
```

Una ejecución por hook es una tarea de acción normal, que aparece con las demás en **Acciones de complementos**. Su entrada es el evento en lugar de los valores del formulario:

```json
{
  "event": "video-completed",
  "video": {
    "runId": 3,
    "title": "Launch",
    "profile": "Shorts",
    "outputs": [
      {
        "formatId": 5,
        "format": "Landscape",
        "durationSeconds": 12.5,
        "scheduledFor": "2026-11-20"
      }
    ],
    "texts": [{ "kind": "description", "format_id": null, "text": "…" }]
  }
}
```

`texts` contiene el título, la descripción y las etiquetas aprobados; se vacía cuando la entrada superaría el límite de 64 KiB para complementos. El identificador de la tarea se deriva del evento, del vídeo (y del intento) y de la acción, así que un evento repetido nunca ejecuta un hook dos veces.

Un hook `generation-failed` recibe la ejecución, su intento y el problema que registró Arrumo (hasta 2.000 caracteres):

```json
{
  "event": "generation-failed",
  "video": {
    "runId": 3,
    "title": "Launch",
    "profile": "Shorts",
    "attempt": 1,
    "problem": "The agent stopped before rendering."
  }
}
```

Un hook `publish-date-reached` recibe la forma de `video-completed` con `"event": "publish-date-reached"` y solo la salida cuya fecha llegó. Arrumo lo comprueba cada pocos minutos mientras está abierto; una fecha de hasta siete días de antigüedad sigue contando, así que no se pierde un día en que la aplicación estuvo cerrada. Cada salida y fecha ejecuta el hook una vez, aunque la fecha se vuelva a mover a ese día.

El creador puede saltarse un hook activado para un vídeo concreto al generarlo.

El [ejemplo de acciones](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/examples/actions/manifest.json) usa el mismo componente echo compilado que el ejemplo de backend. Compila `examples/component/echo.wat` en `examples/actions/echo.wasm`, empaqueta con `--include echo.wasm` e instala el ZIP. Usa `plugin-actions` para descubrir las acciones y envía JSON por la entrada estándar a `invoke-plugin-action action-echo echo app`.
