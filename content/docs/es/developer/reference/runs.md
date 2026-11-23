---

title: "Borradores, ejecuciones y revisión"
description: "Encola vídeos, avanza por sus etapas y revisa los resultados."
---

## Borradores

Crea borradores de vídeo con una lista ordenada de identificadores de recursos de vídeo del espacio de trabajo, o empieza desde cero con un resumen de intención. Un `profile_id` opcional debe referirse a un perfil del mismo espacio de trabajo.

```sh
cargo run --locked -- ./workspaces.sqlite create-draft 1 '{"title":"Review","source_ids":[2,1],"profile_id":1}'
cargo run --locked -- ./workspaces.sqlite create-draft 1 '{"title":"Explainer","intent":"Show how a cube works"}'
cargo run --locked -- ./workspaces.sqlite drafts 1
```

Usa `update-draft <workspace-id> <draft-id> <settings-json>` para reemplazar los ajustes guardados del borrador y el orden de las fuentes. La vista Borradores de escritorio también permite editar y cancelar. Un grupo de fuentes no válido deja intacto el borrador original.

Usa `create_video_draft` y `update_video_draft` para guardar borradores antes de encolarlos. Pasa el objeto `settings` completo con un título y una intención o una lista ordenada `source_ids` de recursos de vídeo gestionados del espacio de trabajo. Un `profile_id` opcional elige un perfil del espacio de trabajo. Guarda el identificador del borrador devuelto para actualizarlo y encolarlo.

Borra un borrador no encolado con `delete-draft <workspace-id> <draft-id> <confirmed-title>` en la CLI o `delete_video_draft` por MCP y A2A. Pasa el título guardado exacto. Un borrador referenciado por una ejecución sigue disponible para esa ejecución y sus repeticiones. Las fuentes gestionadas se quedan en la biblioteca del espacio de trabajo.

## Cola, workers y control

Encola un borrador guardado con una clave de solicitud y opciones de ejecución. Reintentar con el mismo espacio de trabajo, clave, borrador y opciones devuelve la ejecución existente. Las ejecuciones encoladas conservan la instantánea enviada aunque luego se editen el borrador o el espacio de trabajo.

```sh
cargo run --locked -- ./workspaces.sqlite enqueue-draft 1 1 request-1 '{"autopilot":false,"platform":"YouTube"}'
cargo run --locked -- ./workspaces.sqlite generation-runs 1
```

Un worker reclama trabajo encolado con `claim-generation <workspace-id>`. La reclamación incluye un número de intento y una concesión de 60 segundos. Usa `checkpoint-generation <workspace-id> <run-id> <attempt> <json>` para guardar el progreso y renovar la concesión. Las reclamaciones caducadas se pueden volver a reclamar con el último punto de control guardado. Usa `control-generation <workspace-id> <run-id> <pause|resume|cancel>` para controlar las ejecuciones y `generation-activity <workspace-id> <run-id>` para leer su historial de transiciones. Las sesiones de agente que Arrumo guardó para seguimientos se borran del historial del agente cuando su ejecución termina, falla o se cancela; la aplicación de escritorio lo hace cada pocos minutos, y `sweep-agent-sessions` lo hace en el momento.

Un worker puede informar de un fallo definitivo con `fail-generation <workspace-id> <run-id> <attempt> <detail>`. Da un motivo breve y comprensible, sin credenciales ni registros en bruto del proveedor. El historial de actividad de escritorio muestra el motivo. Usa Reintentar en la cola de escritorio o `control-generation <workspace-id> <run-id> retry` para devolver una ejecución fallida a la cola con su punto de control intacto.

Las ejecuciones nuevas guardan su plan de producción a partir de la instantánea congelada al encolarse. Usa `generation-plan <workspace-id> <run-id>` para leerlo en cuanto la ejecución está en cola. Un worker recibe el paso actual con su reclamación. En ejecuciones antiguas sin plan guardado, el worker puede usar `prepare-generation-plan <workspace-id> <run-id> <attempt>` bajo su concesión activa. Los planes guiados marcan las etapas que requieren revisión. Los planes en piloto automático omiten esos requisitos.

Un worker con concesión puede usar `submit-stage <workspace-id> <run-id> <attempt> <stage> <result-json>` para registrar el paso actual del plan. Una ejecución guiada espera a `review-stage <workspace-id> <run-id> <result-id> <approved|rejected|revise> <notes>`. La aprobación pasa a la etapa siguiente. El rechazo y la revisión vuelven a encolar la etapa actual y conservan el historial de revisión. Usa `production-progress <workspace-id> <run-id>` para leer los resultados y las decisiones. La verificación de la entrega tiene un camino de finalización propio.

`control-generation <workspace-id> <run-id> stop` devuelve una ejecución a su paso revisado anterior: el resultado más reciente de una etapa anterior se abre de nuevo para revisión, y la decisión original queda en el historial.

Usa `replay-generation <workspace-id> <source-run-id> <request-key> <captured|current>` para encolar una ejecución nueva a partir de un vídeo completado. El modo capturado copia la instantánea de entrada original. El modo actual resuelve el último borrador guardado, el espacio de trabajo, el perfil, la salida y los ajustes de vista previa, con la plataforma y las opciones de piloto automático de la ejecución original. Ambos modos empiezan al principio del plan de producción. Repite la misma clave, origen y modo para obtener la misma repetición.

Para encolar un borrador guardado, llama a `list_video_drafts` con el identificador del espacio de trabajo y después a `enqueue_video_draft` con el identificador del borrador y una clave de solicitud. Reutiliza la clave para reintentar el mismo envío. Usa `list_generation_runs` y `get_generation_run` para ver las ejecuciones y sus ajustes capturados, y `control_generation` para pausar, reanudar, reintentar o cancelar una ejecución. Usa `get_production_progress` para identificar un resultado de etapa pendiente y `review_production_result` para enviar una aprobación, un rechazo o una petición de revisión.

Los workers pueden llamar a `claim_generation` para la siguiente ejecución y usar el número de intento devuelto con `checkpoint_generation` para guardar el progreso y renovar la concesión. Envía los resultados de etapa con `submit_production_result` mientras la concesión está activa. La verificación de la entrega usa un flujo aparte. Usa `get_generation_activity` para leer las transiciones registradas de la ejecución, y `list_agent_logs` y `get_agent_log` (con `workspaceId` y `runId` o `logId`) para leer qué se le pidió al agente y qué imprimió.

Usa `get_generation_plan` para ver los pasos preparados de una ejecución. Un worker puede usar `fail_generation` con su intento actual y un diagnóstico breve para el registro de actividad. Cuando una ejecución termina, `replay_generation` puede encolar una ejecución nueva en modo `captured` o `current`. Reutiliza la misma clave y el mismo modo al reintentar el envío de una repetición.

## Agente de edición

Usa `agent-settings <app|workspace-id>` para ver el agente configurado y de dónde viene. Usa `set-agent-provider <app|workspace-id> <plugin-id|unset>` para cambiar la elección. Quitar la sustitución de un espacio de trabajo restaura la elección de la aplicación, si hay una. Las ejecuciones nuevas congelan la selección resuelta y su procedencia. Elegir un proveedor es independiente de conectar o ejecutar su agente.

Abre **Ajustes** en la barra lateral de escritorio para elegir el agente de producción de la aplicación. Usa el selector de ámbito de los ajustes para configurar una sustitución por espacio de trabajo o restaurar la herencia. El proveedor efectivo y su origen aparecen bajo el selector.

En una instalación nueva, crear el primer espacio de trabajo abre la configuración del agente si no hay proveedor elegido para la aplicación. Los ajustes pueden comprobar si la CLI elegida está en el PATH de Arrumo y abrir la guía de instalación del proveedor en el navegador del sistema. Esta comprobación informa de si la CLI está disponible localmente. La autenticación se hace con la configuración propia del proveedor.

Usa **Comprobar inicio de sesión** en Ajustes o `agent-login-status <plugin-id>` en la CLI para preguntar al proveedor instalado por su estado de autenticación local. La comprobación no hace ninguna petición de generación y solo devuelve una categoría de estado. Caduca a los cinco segundos. En Windows, la detección y las comprobaciones de sesión usan un ejecutable nativo del PATH.

Usa `agent-plugins` para listar los proveedores de agentes incluidos. Sus identificadores, nombres, guías de configuración y comprobaciones de autenticación vienen de los manifiestos del SDK de los repositorios de los proveedores. Las compilaciones importan los complementos predeterminados del registro desde sus checkouts separados. La instalación en tiempo de ejecución y las concesiones de confianza son funciones aparte del host.

Usa `list_agent_plugins` para descubrir los agentes de producción incluidos y `get_agent_settings` para leer la elección efectiva. Usa `set_agent_provider` o `clear_agent_provider` en el ámbito de la aplicación o de un espacio de trabajo. Omite `workspaceId` para el ámbito de la aplicación. Los cambios afectan a las instantáneas de ejecuciones futuras. Una ejecución cuyo agente capturado se desactivó después falla en su siguiente etapa de agente con ese motivo; activa el agente y reintenta.

Usa `get_agent_login_status` por MCP o A2A con el identificador del complemento de agente incluido para comprobar si la sesión local está lista. El host devuelve un estado y descarta la salida de la comprobación.

## Registros del agente

Cada ejecución del agente queda registrada con su prompt, línea de comandos, salida estándar, salida de errores, respuesta y problema. Usa `agent-logs <workspace-id> [run-id]` para listarlas, de la más reciente a la más antigua, y `agent-log <workspace-id> <log-id>` para leer una. Una entrada en curso se actualiza cada dos segundos, y una entrada que quedó en curso por un cierre inesperado se marca como interrumpida cuando se reintenta la etapa. En la aplicación de escritorio, abre **Registros del agente** junto a la actividad de una ejecución o desde el generador de animaciones.

## Lo que escribe el agente en cada etapa

La etapa Guion la escribe el agente de la ejecución cuando su complemento declara una ejecución estructurada (versión 7 del esquema del SDK). La aplicación de escritorio redacta en segundo plano los guiones encolados; `process-script-stage <workspace-id> <run-id>` y la herramienta `process_script_stage` lo hacen a demanda. El agente recibe el resumen congelado, el contexto, el perfil, los formatos, los comentarios aprendidos y, en intentos posteriores, los borradores anteriores con sus notas de revisión. Después, una ejecución guiada espera revisión, y pedir cambios encola un borrador nuevo. Si el agente no puede terminar, la ejecución falla con el motivo y se puede reintentar. Antes de que el agente escriba, cada clip de origen se transcribe con los proveedores de transcripción capturados de la ejecución en fragmentos de 15 minutos, y la transcripción se guarda en caché para el archivo gestionado. Los clips que los proveedores no pueden oír, por ejemplo sin una clave configurada, aparecen en el resultado como `footage_without_transcript`, y el agente trabaja con sus nombres y notas.

Cuando una ejecución no tiene renderizador de movimiento, el agente de la ejecución planifica la etapa Recursos y animaciones: elige recursos de la biblioteca y elementos de la biblioteca de movimiento para cada sección del guion, o ninguno cuando las grabaciones sostienen el vídeo (`process-asset-plan`, `process_asset_plan`). Las animaciones de la biblioteca se reproducen tal como se guardaron, así que se le indica al agente que no coloque una cuyo texto no encaje con el vídeo. El brief incluye el diseño guardado (`design`, la especificación de movimiento) de hasta seis animaciones recientes de la biblioteca de menos de 12 KB cada una, y las animaciones nuevas que hacen algo parecido, como los rótulos inferiores, siguen su composición, colores, fuentes y ritmo. En los vídeos hechos con grabaciones, el agente corta después la primera vista previa a partir del guion aprobado y las transcripciones con tiempos, y Arrumo la renderiza (`process-preview-edit`, `process_preview_edit`); cada corte conserva el nombre de su clip y su propósito para la revisión. La aplicación de escritorio ejecuta ambas cosas en segundo plano.

Un vídeo empezado desde cero no tiene grabaciones que cortar. Sus escenas sí pueden reproducir los vídeos del propio espacio de trabajo, como grabaciones de pantalla, dentro de una caja enmarcada con focos y zoom (consulta [animaciones](motion.md)). La fase de guion ve los mismos clips con sus notas y su duración, así que escribe a partir de lo que muestran. En **Vistas previas de vídeo**, su agente convierte el guion aprobado en un storyboard de escenas animadas, reutilizando cuando encajan las animaciones aprobadas y las animaciones guardadas de la biblioteca que nombra el plan de recursos, y Arrumo las renderiza para cada formato. El renderizado final renderiza las mismas escenas a tamaño completo y escribe el SRT de cada formato a partir del texto en pantalla de las escenas, salvo que ya exista un SRT. El agente también escribe la narración de cada escena. Cuando el primer proveedor de texto a voz de la ejecución tiene credencial, Arrumo la locuta mientras hace la vista previa, con el ajuste de voz del complemento o su voz predeterminada, alarga las escenas que necesitan más tiempo y guarda el audio con la ejecución para que el renderizado final lo reutilice; los subtítulos siguen entonces a la narración. Si la síntesis falla, la vista previa queda sin sonido y su resumen dice por qué.

En la etapa Salidas complementarias, el agente de la ejecución escribe los títulos, descripciones y listas de etiquetas pedidos para cada formato a partir del guion aprobado, más un prompt de imagen por cada miniatura pedida. Arrumo genera cada miniatura con la relación de aspecto del formato mediante el orden `image-generation` capturado de la ejecución, usando el adaptador `image-generation.json` de cada complemento proveedor, saltándose los proveedores sin clave, y la guarda como recurso del espacio de trabajo. Cuando el creador aprueba unos elementos y devuelve otros, el agente reemplaza solo esos, con sus notas, y se conservan los aprobados. La aplicación de escritorio lo hace en segundo plano; `process-supplemental-writing <workspace-id> <run-id>` y la herramienta `process_supplemental_writing` lo hacen a demanda. Las etapas que también necesitan cortes verticales esperan a un renderizador. Para comprobar la clave y el modelo de un proveedor de imágenes, ejecuta `echo "prompt" | arrumo-workspaces <database> generate-image <workspace-id> 16:9 '["gemini"]'`.

Los formatos que piden cortes verticales los reciben en Salidas complementarias. El agente de la ejecución elige el momento de cada corte en la línea de tiempo del vídeo aprobado, y Arrumo renderiza la edición aprobada a 1080×1920, recorta cada corte y añade las miniaturas 9:16 pedidas mediante los proveedores de imágenes de la ejecución. Los cortes y sus miniaturas se revisan con el resto de medios complementarios; devolver un corte pide otro momento y conserva sus miniaturas, salvo que también se devolvieran.

## Salidas complementarias

En la etapa `supplemental_outputs`, los workers pueden enviar `supplemental_text` en el resultado de la etapa. Cada elemento tiene un `kind` de `title`, `description` o `tags`, un valor `text` en UTF-8 y un `format_id` opcional de la ejecución congelada. Omite el formato para el texto común a todo el vídeo. Arrumo acepta hasta 100 entradas y 64 KiB de texto en total. El resultado aceptado aporta los enlaces de archivo del vídeo completado y añade los archivos `supplemental-<kind>-<index>.txt` correspondientes al ZIP de entrega. Los índices empiezan en 1 y siguen el orden de envío.

Un resultado `supplemental_outputs` también puede incluir hasta 100 entradas `supplemental_media` con un `asset_id` y un `format_id` congelado opcional. Importa cada imagen, vídeo o audio al espacio de trabajo de la ejecución antes de enviar su identificador. La ejecución conserva esas versiones exactas de los recursos aunque se reemplacen en la biblioteca. Las lecturas del vídeo completado exponen los metadatos de los medios aceptados, y la exportación ZIP incluye archivos numerados `supplemental-media-<index>.<extension>`.

Para aprobar de forma selectiva, usa `review-supplemental-items <workspace-id> <run-id> <result-id> <decisions-json> <notes>`. El JSON tiene las listas `text` y `media`, cada una en el orden de los elementos enviados. Cada decisión es `approved`, `revise` o `rejected`. Incluye una lista vacía cuando una categoría no tiene elementos. La ejecución solo avanza cuando todos los elementos están aprobados. Si no, el siguiente envío de Salidas complementarias aporta solo los reemplazos de los elementos pendientes, en su orden original dentro de cada categoría. Los reemplazos de texto conservan su tipo y su ámbito. Los reemplazos de medios conservan el tipo de medio y el ámbito. Arrumo coloca los reemplazos en sus posiciones originales y conserva las entradas aprobadas. Los workers pueden leer las decisiones y las notas comunes en el progreso de producción.

En la revisión guiada de Salidas de escritorio, elige una decisión por elemento o usa un botón de lote para decidir todos a la vez. Puedes cambiar cualquier elemento antes de enviar. Arrumo guarda tus elecciones y notas comunes localmente hasta que eliges **Enviar**.

MCP y A2A admiten `review_supplemental_items` con `workspaceId`, `runId`, `resultId`, `review` (las listas de decisiones `text` y `media`) y `notes` opcionales. En un mensaje de tarea A2A, el identificador de la tarea aporta el ámbito del espacio de trabajo y de la ejecución.

Marca salidas concretas para aplicar una decisión de lote solo a las filas seleccionadas. Tras una revisión parcial, las aprobaciones anteriores se rellenan solas y los reemplazos necesitan una decisión nueva. Las elecciones de revisión se pueden cambiar hasta Enviar.

Una revisión complementaria puede incluir `review.item_notes` con listas `text` y `media` alineadas con las listas de decisiones. Usa `null` para un elemento sin nota. Cada nota tiene un límite de 4 KiB en UTF-8. Los botones de nota de escritorio preparan comentarios en la fila correspondiente hasta Enviar. Los workers reciben las notas con la revisión guardada en el progreso de producción.

Cuando un worker reclama una etapa de Salidas complementarias tras una revisión selectiva, la reclamación incluye `supplemental_revision`. Lleva el identificador del resultado de origen, las notas comunes y listas separadas `text` y `media` de elementos pendientes. Cada elemento tiene su índice de posición desde cero, la decisión, la nota opcional y el valor enviado antes. Envía un reemplazo por cada elemento listado, en el orden de la lista. La misma petición sobrevive a la caducidad de la concesión y al relevo. Las demás reclamaciones omiten este campo.

Usa `review-preview-formats <workspace-id> <run-id> <result-id> <decisions-json> <notes>` para revisar cada vista previa renderizada. Pasa una lista como `[{"format_id":1,"decision":"approved"},{"format_id":2,"decision":"revise"}]` con una decisión por formato congelado. Si algún formato necesita reemplazo, reclama la etapa y vuelve a usar `render-preview`. El renderizador conserva los archivos y cortes aprobados y vuelve a renderizar solo los formatos pendientes. Una revisión parcial requiere el renderizador gestionado. Cuando todos los formatos están aprobados, el renderizado final usa los cortes conservados o revisados de cada formato.

La revisión de Vista previa de escritorio ofrece decisiones individuales y de lote por formatos seleccionados para las vistas previas que cubren todos los formatos congelados. Tras una revisión parcial, los formatos aprobados aparecen preseleccionados. Puedes añadir una nota a un formato antes de Enviar, o incluir una `note` opcional en cada decisión de formato de la CLI.

MCP y A2A exponen la misma operación como `review_preview_formats`. Una reclamación de worker tras una revisión selectiva incluye `preview_revision`, con el identificador del resultado de origen, las notas comunes y solo los formatos pendientes. Cada entrada incluye la decisión, la nota de formato opcional, el nombre de archivo de la vista previa anterior y los cortes efectivos. La petición sobrevive al relevo de la concesión. Para producir los archivos de reemplazo, usa el renderizador gestionado mediante `render-preview` o la aplicación de escritorio.

## Vídeos completados

Usa `completed-video <workspace-id> <run-id>` para leer juntos el título actual, las entradas y ajustes capturados, la entrega verificada, las decisiones de producción y el historial de actividad. Usa `rename-completed-video <workspace-id> <run-id> <title>` para cambiar el título visible conservando el título de la instantánea de la ejecución.

Usa `add-completed-video-feedback <workspace-id> <run-id> <run|result-id> <markdown>` para comentar un vídeo completado o uno de sus resultados de producción. Los comentarios aparecen en el detalle del vídeo completado. Las ejecuciones nuevas y las repeticiones con ajustes actuales del mismo borrador capturan esos comentarios como comentarios de entrega. Las repeticiones capturadas reutilizan los comentarios de la instantánea original.

En la barra lateral de escritorio, abre **Vídeos completados** y elige un vídeo para revisar la lista de archivos verificados, guardar un título visible o exportar la entrega con el diálogo nativo para guardar el ZIP.

El panel del vídeo completado también encola una repetición con ajustes capturados o actuales y guarda comentarios en Markdown sobre el vídeo entero o sobre un resultado de producción concreto.

La pestaña **Vídeo** abre el reproductor verificado, muestra un selector de formato cuando hay varias salidas e incluye **Texto de los subtítulos**. Arrumo transmite el archivo elegido por su interfaz local de loopback. La reproducción usa los códecs del WebView de escritorio. En Linux, WebKitGTK necesita decodificadores GStreamer de H.264 y AAC, como los que aporta `gstreamer1.0-libav` en Ubuntu.

En el plan de producción de una ejecución guiada, abre **Ver vista previa** para reproducir un MP4 renderizado antes de enviar la decisión de la etapa. Cada vista previa de reemplazo aparece con su propio número de intento.

El plan de producción de escritorio puede renderizar una vista previa con clips enteros en ejecuciones con grabaciones, renderizar la edición aceptada a resolución final y verificar la entrega cuando los SRT están presentes. Cada acción reclama solo la etapa que muestra el plan.

Usa `rename_completed_video` para cambiar el título visible de una ejecución completada. Usa `add_completed_video_feedback` para guardar comentarios en Markdown sobre la ejecución entera o un resultado de producción concreto. Pasa el identificador del resultado de `get_completed_video` para comentar una etapa.

Usa `delete-completed-video <workspace-id> <run-id> <confirmed-title>` en la CLI para quitar una ejecución completada y su directorio de entrega gestionado. Usa el título visible actual exacto. Una ejecución referenciada por una repetición sigue disponible. Si la limpieza de archivos se interrumpe, vuelve a ejecutar el mismo comando para terminarla. Los recursos de origen compartidos se quedan en la biblioteca del espacio de trabajo.

Por MCP o A2A, usa `delete_completed_video` con `workspaceId`, `runId` y el `confirmedTitle` exacto. Usa el mismo borrado y la misma limpieza reanudable que el comando de la CLI.

Usa `recover-delivery-cleanup <workspace-id>` en la CLI o `recover_delivery_cleanup` en MCP y A2A para reintentar la limpieza pendiente de ejecuciones borradas antes. El informe lista las limpiezas completadas y las entradas que aún necesitan atención.

Usa `delete-generation <workspace-id> <run-id> <confirmed-title>` o la operación compartida `delete_generation` para borrar una ejecución encolada, activa o terminada. Un borrado correcto invalida cualquier concesión de worker y quita el directorio de entrega gestionado. El borrador y los recursos compartidos siguen disponibles. Los workers externos deben dejar de usar las rutas de la ejecución cuando su concesión deja de ser válida.

## Calendario

Programa una salida verificada con `set-output-schedule <workspace-id> <run-id> <format-id> <YYYY-MM-DD|clear>`. Cada formato de salida puede tener su propia fecha. Usa `scheduled-outputs <workspace-id> <start-date> <end-date> [profile-id]` para listar un intervalo inclusivo. Las entradas del calendario incluyen el color guardado del perfil y las dimensiones de la salida.

Por MCP o A2A, usa `set_output_schedule` con un espacio de trabajo, una ejecución y un identificador de formato. Pasa una `date` ISO o null para borrarla. Usa `list_scheduled_outputs` con fechas `start` y `end` y un `profileId` opcional para recorrer el calendario.

Abre el calendario de escritorio en un mes y un perfil concretos con un enlace como `arrumo://open/calendar?workspace=1&profile=2&month=2028-02`. Omite el perfil para ver todas las salidas del espacio de trabajo. Los enlaces a vídeos completados pueden incluir un identificador `format` para elegir una salida entregada concreta.

## Notificaciones

Consulta los eventos de revisión, finalización y fallo con `list_generation_notifications` y un identificador de espacio de trabajo, o con la CLI `generation-notifications <workspace-id> <after-id>`. Empieza con un cursor de cero y pasa el último identificador de evento devuelto al volver a consultar. Cada respuesta contiene como máximo 100 eventos en orden ascendente de identificador. Los eventos incluyen el identificador de la ejecución y describen transiciones que quizá ya se hayan atendido.

Los eventos de finalización incluyen una marca de tiempo `read_at` que puede ser nula. Para confirmar una finalización, llama a `read_completion_notification` de MCP con los identificadores del espacio de trabajo y de la ejecución, o usa la CLI `read-completion-notification <workspace-id> <run-id>`. Ambos indican si cambió el estado. La confirmación conserva el evento original y su identificador. Vuelve a consultar desde un cursor anterior para ver su estado de lectura actualizado. `read_all_completion_notifications` marca como leídas todas las finalizaciones de un espacio de trabajo. La bandeja de escritorio lista revisiones y finalizaciones, de la más reciente a la más antigua, con la hora en que ocurrieron y el perfil del borrador.

Mientras Arrumo está en segundo plano, la aplicación de escritorio también envía cada nuevo evento de revisión, finalización o fallo de todos los espacios de trabajo a las notificaciones del sistema operativo mediante el complemento de notificaciones de Tauri. Desactívalo en **Ajustes › General › Notificaciones**, o con `set_notification_settings` de MCP (`get_notification_settings` lo lee). Al pulsar una, Arrumo pasa a primer plano en esa ejecución o vídeo terminado: el host de escritorio atiende la acción del complemento de notificaciones, enfoca la ventana y abre la página. Verificado en Linux (GNOME) con la señal `ActionInvoked` del servidor; macOS y Windows informan de los clics mediante el mismo manejador del complemento, pero no se han probado. La bandeja de la aplicación siempre enlaza a la ejecución.
