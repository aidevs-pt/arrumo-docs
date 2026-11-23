---

title: "Proveedores de agentes"
description: "Declara un agente de edición: comprobaciones de estado, ejecuciones estructuradas, imágenes, uso y seguimientos."
---

## Declaración de proveedor de agente

Un complemento de agente puede añadir un descriptor `agentProvider` y debe declarar la capacidad `agents`. El identificador del complemento en el manifiesto es el identificador del proveedor. `label` es el nombre del producto que se muestra y `setupUrl` enlaza a la guía de configuración HTTPS del proveedor. `cli.executable` y `cli.authStatusArgs` describen su comando de estado local como un nombre de programa y una lista literal de argumentos.

El host puede ejecutar este comando solo para un complemento de confianza cuyo adaptador admita la política de ejecución del host. Resuelve el ejecutable mediante el PATH del host e informa de un estado acotado sin capturar la salida del comando. La salida 0 confirma la autenticación local, la salida 1 la deja sin confirmar, y las demás salidas indican un fallo. El descriptor no concede al complemento acceso a una shell ni a procesos, y no declara un adaptador de generación. No incluyas nunca credenciales en el descriptor ni en los argumentos de la comprobación.

## Ejecuciones estructuradas del agente

La versión 7 del esquema permite que un proveedor de agente declare `agentProvider.cli.structuredRun`. El host lo usa para etapas de producción como escribir el guion. Ejecuta una vez el ejecutable del proveedor, en un directorio temporal vacío, con el prompt por la entrada estándar y un JSON Schema que la respuesta debe seguir.

```json
"structuredRun": {
  "args": ["exec", "--sandbox", "read-only", "--output-schema", "{schemaPath}",
           "--output-last-message", "{outputPath}", "-"],
  "result": { "source": "outputFile" }
}
```

Los marcadores son argumentos completos: `{schema}` es el esquema como JSON, `{schemaPath}` un archivo que lo contiene y `{outputPath}` un archivo donde el agente escribe su respuesta. Cada ejecución debe pasar el esquema mediante uno de los dos primeros. `result.source` es `outputFile` o `stdout`. `pointer` elige la respuesta dentro de ese documento, y `errorPointer` nombra un booleano que vale true cuando el agente informa de un fallo. El host valida la respuesta con el esquema, acota su tamaño, aplica un tiempo límite y trata una salida distinta de cero como un fallo. Los proveedores son dueños de las opciones que mantienen la ejecución no interactiva y sin las herramientas, hooks y acceso a red que la etapa no necesita.

Las capacidades del agente pertenecen a su complemento. Decláralas como `settings` normales y asigna cada una a opciones con `settingArgs`; el host inserta los argumentos elegidos en un marcador `{settings}`. Un ajuste booleano usa `args` cuando vale true y `otherwise` cuando vale false o no está definido. Los demás ajustes usan `args` con `{value}` reemplazado, y solo aceptan palabras simples (letras, dígitos, `.`, `_`, `:` y `-`); un ajuste de cadena con `choices` solo acepta una de ellas. El `default` de un ajuste se aplica cuando ni la aplicación ni el espacio de trabajo fijan un valor. El host congela los valores resueltos en cada ejecución de generación para poder reproducirla.

El esquema de manifiesto 14 añade condiciones, avisos y una carpeta de trabajo:

- Una entrada de `settingArgs` con `when` (el identificador de un ajuste booleano) solo se aplica mientras ese ajuste está activado, y una con `unless` solo mientras está desactivado. Así, un interruptor puede elegir entre dos conjuntos de opciones para otro ajuste.
- El `warning` de un ajuste se muestra bajo su interruptor mientras está activado, para consecuencias que conviene sopesar. `hiddenWhen` (el identificador de un ajuste booleano) oculta el ajuste mientras ese otro está activado, para opciones que dejan de tener sentido. Ambos se pueden traducir.
- `structuredRun.workFolderSetting` nombra un ajuste booleano. Mientras está activado, Arrumo ejecuta el agente de un vídeo en una carpeta propia, `<database>.work/<workspace>/<run>`, en lugar de un directorio temporal vacío, le dice al agente que esa carpeta es suya y la conserva entre las etapas y preguntas de seguimiento de ese vídeo. Arrumo la borra cuando el vídeo termina, falla o se cancela, y al arrancar para los vídeos que ya no están en marcha.

Los complementos oficiales de Claude Code y Codex usan los tres para **Escribir archivos y ejecutar comandos** (`local-tools`):

```json
"settingArgs": [
  {"setting": "local-tools", "args": ["-c", "sandbox_mode=\"workspace-write\""],
   "otherwise": ["-c", "sandbox_mode=\"read-only\"", "--disable", "shell_tool"]},
  {"setting": "installed-plugins", "args": [],
   "otherwise": ["--ignore-user-config", "--disable", "plugins"], "unless": "local-tools"}
],
"workFolderSetting": "local-tools"
```

`progress` permite al host mostrar qué está haciendo el agente mientras trabaja. Cada entrada es una expresión regular que se compara con cada línea que imprime el agente; su primer grupo de captura (o `label`) se convierte en un paso de tipo `thinking`, `search` o `step`, para que los creadores sigan en directo el razonamiento y las búsquedas. Los agentes que imprimen un evento JSON por línea añaden un `pointer` a cada patrón para comparar el texto en ese lugar del evento, y leen su respuesta con el origen de resultado `stdoutLastLine`.

Los agentes que pueden mirar imágenes declaran `imageArgs`, como `["-i", "{imagePath}"]`, y colocan `{images}` en `args`. El host repite esos argumentos una vez por cada imagen que quiere que vea el agente, como referencias de miniaturas o imágenes encontradas al investigar a un creador, y deja `{images}` vacío para los agentes que no lo admiten.

Los agentes que leen imágenes desde un mensaje estructurado declaran en su lugar `structuredRun.imageInput` (esquema de manifiesto 13). Cuando una ejecución lleva imágenes, Arrumo añade sus `args` y escribe en la entrada estándar una línea JSON construida a partir de `stdin`: la cadena `"{prompt}"` pasa a ser el encargo y un elemento de lista `"{images}"` se convierte en una copia de `image` por imagen, con `"{data}"` como los bytes en base64 y `"{mediaType}"` como `image/png`, `image/jpeg`, `image/gif` o `image/webp`; las demás imágenes, como las SVG, y las de más de 5 MB se dejan fuera. Las ejecuciones sin imágenes siguen enviando el encargo tal cual. Claude Code lo usa con `--input-format stream-json`.

Los agentes con su propia herramienta de imágenes también declaran la capacidad `image-generation` y un `imageRun`. Arrumo envía el encargo de la imagen por la entrada estándar, lee el identificador de sesión de los eventos JSON impresos en `sessionPointer` y recoge el archivo PNG, JPEG o WebP más reciente de `outputDirectory`: `path` (con `{session}`) dentro del directorio de la variable de entorno `env`, o dentro de `fallback` en la carpeta personal. El agente sigue en solo lectura y no escribe nada por sí mismo. Arrumo verifica y recorta la imagen como la de cualquier otro proveedor, y quita lo que dejó la ejecución. `{images}` adjunta referencias de estilo mediante `structuredRun.imageArgs`.

```json
"imageRun": {
  "args": ["exec", "--sandbox", "read-only", "--enable", "image_generation", "{images}", "--json", "-"],
  "sessionPointer": "/thread_id",
  "outputDirectory": {"env": "CODEX_HOME", "fallback": ".codex", "path": "generated_images/{session}"}
}
```

Los agentes del esquema 11 pueden declarar un `usageRun` para que los creadores vean cuánto les queda de la cuota de su plan, junto a los proveedores con clave en Ajustes › Servicios y claves y en los avisos de cuota baja. Arrumo inicia la CLI con `args`, escribe cada valor de `input` en la entrada estándar como una línea JSON y lee la primera línea JSON impresa cuyo `id` es `responseId`. Cada elemento de `windows` apunta al porcentaje usado y, opcionalmente, a su hora de renovación en segundos Unix y a su duración en minutos; Arrumo muestra el periodo más usado. La lectura no debe gastar cuota, y se detiene a los 20 segundos.

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

Los agentes que solo informan de su cuota mientras trabajan pueden declarar en su lugar un `usageEvent` (esquema 12). En cada ejecución normal, Arrumo busca la última línea JSON impresa cuyo `typePointer` sea igual a `typeValue`, lee cada ventana (`used` como `fraction` de 0 a 1 o como `percent`, un puntero `resetsAt` opcional y una duración fija en `minutes`) y las guarda. Servicios y claves muestra entonces la ventana más usada que aún no se ha reiniciado, así que ninguna petición extra gasta la cuota. Hasta que el agente se ejecute una vez, no se muestra el uso.

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

### Mensajes de seguimiento

Cuando un agente pide al host material del espacio de trabajo, Arrumo responde en la misma sesión si el complemento declara `resume`, enviando solo el material nuevo en lugar de todo el encargo otra vez. Pon `{ephemeral}` en `args` donde van las opciones que impiden al agente conservar una sesión, y lístalas en `ephemeralArgs`; el host las omite solo en una ejecución a la que va a dar seguimiento. `resume.args` sustituye a `args` en el seguimiento, con `{session}` para el identificador leído de `resume.session`. Si una sesión no se puede continuar (ha desaparecido, no se puede leer o está atascada), el host empieza una nueva con todo el encargo y todo el material reunido hasta entonces.

Declara `resume.cleanup` para que las sesiones conservadas no se acumulen en el historial propio del agente: Arrumo registra cada sesión que conserva y borra sus archivos cuando el vídeo al que pertenece se ha completado, ha fallado o se ha cancelado, o justo después de una petición que no tiene vídeo. Busca dentro de `directory`, en la carpeta que nombra la variable `homeEnv` (solo rutas absolutas), o si no en `home` dentro de la carpeta personal del usuario, los archivos cuyo nombre termina en `fileSuffix`. Nunca sigue enlaces y quita las carpetas que el borrado deja vacías.

```json
"args": ["exec", "{ephemeral}", "--output-schema", "{schemaPath}", "-"],
"ephemeralArgs": ["--ephemeral"],
"resume": {
  "args": ["exec", "resume", "--output-schema", "{schemaPath}", "{session}", "-"],
  "session": {"stream": "stderr", "pattern": "^session id: ([0-9A-Za-z-]+)$"},
  "cleanup": {"homeEnv": "CODEX_HOME", "home": ".codex", "directory": "sessions", "fileSuffix": "{session}.jsonl"}
}
```
