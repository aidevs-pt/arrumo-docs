---

title: "Renderizadores de movimiento"
description: "Entrega movimiento renderizado y ejecuta renderizadores en el sandbox de Linux."
---

## Entrega medios de movimiento renderizados

Usa el [esquema de resultado de movimiento](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/motion-result.schema.json) para la parte de movimiento de un resultado de la etapa Recursos. El [ejemplo](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/examples/motion-result.json) referencia una vista previa en vídeo y una miniatura gestionadas. Los elementos también pueden referenciar audio y un perfil. Son identificadores de recursos y perfiles locales del espacio de trabajo que asigna Arrumo. El host comprueba la propiedad, los tipos de medios y la concesión de generación actual antes de aceptar el resultado.

Un adaptador renderizador se ejecuta en su propio entorno autorizado. Importa su vista previa terminada y cualquier medio de apoyo mediante la operación de importación de recursos del host, y después envía los identificadores devueltos en `motion_items` para la etapa Recursos de la ejecución. Las rutas del sistema de archivos y el código ejecutable quedan fuera de este contrato de resultado. Los componentes WIT genéricos no pueden lanzar procesos renderizadores externos ni acceder al sistema de archivos del host. El esquema permite validar la forma del JSON en quien lo produce, y el host sigue siendo responsable de comprobar a qué se refiere cada identificador.

## Envía un lote de renderizado local

Usa el [esquema de artefactos de movimiento](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/motion-artifacts.schema.json) y el [lote de ejemplo](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/examples/motion-artifacts.json) cuando el renderizador ha producido archivos locales y el worker tiene la concesión de la etapa Recursos. Pasa el JSON del lote a la CLI del editor como último argumento de `submit-motion-artifacts <workspace-id> <run-id> <attempt> <artifacts-json>`. Con MCP o A2A, pásalo como `artifacts` a `submit_motion_artifacts` junto con `workspaceId`, `runId` y `attempt`.

Las rutas de archivo se refieren a la máquina y al sistema de archivos donde se ejecuta el host. Si un renderizador usa un punto de montaje como `/output`, traduce cada ruta a su ubicación visible para el host antes de enviarla. El esquema comprueba la forma de la entrada. Arrumo comprueba la concesión y analiza los medios reales antes de confirmar el lote y emitir identificadores gestionados.

Cuando un renderizador aislado devuelve rutas bajo `/output`, detén el renderizador antes de resolver o importar sus archivos. Ejecuta `python tools/resolve_motion_artifacts.py <host-output-directory>` con el lote de artefactos por la entrada estándar. Emite el lote con rutas absolutas visibles para el host por la salida estándar y rechaza archivos que faltan, recorridos de directorios y enlaces simbólicos que apuntan fuera del directorio de salida. Usa un directorio de salida nuevo para cada trabajo y mantenlo privado para el worker hasta que el host termine la importación.

### Ejecutor local de renderizado en Linux

`python tools/run_motion_renderer.py --project <project-directory> --output <new-output-directory> -- /usr/bin/sh /input/render.sh` lanza en Bubblewrap un renderizador elegido por el operador. El proyecto se monta en solo lectura en `/input`, el trabajo recibe `/output` con escritura y almacenamiento temporal, y el ejecutor vacía las variables de entorno heredadas y aísla la red. Un `--toolchain <directory>` opcional se monta en solo lectura en `/renderer`. La ruta de salida debe ser nueva y estar fuera de ambos directorios de entrada. Fija un límite de tiempo de reloj con `--timeout`.

El renderizador escribe `/output/artifacts.json` conforme al esquema de artefactos de movimiento y termina. El SDK imprime las rutas visibles para el host tras validar que los archivos siguen dentro del directorio del trabajo. Usa esas rutas con `submit_motion_artifacts`. El worker es dueño del directorio del trabajo hasta que termina el envío. Este ejecutor requiere Linux con Bubblewrap y un conjunto de herramientas del sistema compatible. Los paquetes del editor instalados y los demás sistemas operativos necesitan una integración propia.

El ejecutor de Linux también requiere `prlimit` de util-linux. Usa `--max-output-bytes` para fijar el límite estricto de escritura por archivo y el límite total de los archivos únicos referenciados por el lote de artefactos. El valor predeterminado es 512 MiB. La comprobación total se hace después de renderizar. Un worker que puede crear muchos archivos sigue necesitando una cuota de sistema de archivos por trabajo.

Usa `--max-scratch-bytes` para dimensionar el sistema de archivos `/tmp` privado del renderizador. Por defecto es 256 MiB. El ejecutor apunta `HOME` y `TMPDIR` a ese montaje. Este límite se aplica al almacenamiento temporal durante la ejecución. El directorio de salida del trabajo se rige por las comprobaciones por archivo y posteriores al renderizado descritas arriba.

### Ejecuta un ZIP renderizador revisado

Un worker local puede ejecutar un ZIP revisado que declare la capacidad `motion-render` e incluya `renderer.json` con un único campo `entrypoint` que nombre un script de shell del paquete. Incluye ambos archivos con la herramienta de empaquetado. El script se ejecuta dentro del mismo sandbox de Linux y escribe el mismo manifiesto `/output/artifacts.json`.

Ejecuta `python tools/run_motion_package.py <package.zip> --sha256 <reviewed-digest> --output <new-output-directory>`. Aporta el digest del registro del paquete revisado. El worker comprueba el digest, los límites del paquete descomprimido, las rutas de los archivos y el manifiesto antes de invocar el script. Puede montar un conjunto de herramientas preparado por el operador con `--toolchain`. El editor usa este punto de entrada para despachar los renderizadores instalados en Linux.

### Distribuye el worker del SDK para Linux

Las compilaciones de conformidad del SDK publican un artefacto de CI `arrumo-motion-worker-linux` con el ZIP del worker y `SHA256SUMS`. Para compilarlo en local, ejecuta `python tools/package_motion_worker.py arrumo-motion-worker-linux.zip` desde el checkout del SDK. La herramienta imprime el SHA-256 del archivo. Elige una revisión del SDK o una ejecución de CI de confianza y verifica la suma de comprobación del archivo antes de extraerlo en una ubicación de confianza fuera de los directorios de los complementos.

Instala el `motion-worker-requirements.txt` extraído en el entorno de Python 3 que lanza Arrumo. El host también necesita Bubblewrap, util-linux con `prlimit` y FFprobe. Define `ARRUMO_MOTION_SDK_WORKER` con la ruta absoluta extraída de `tools/run_motion_package.py` al iniciar el editor, MCP o A2A. Mantén intacta la estructura extraída para que el worker pueda cargar sus esquemas del SDK.
