---

title: "Referencia del SDK de complementos"
description: "Los contratos de manifiesto, paquete y adaptador que un complemento declara a Arrumo."
---

El [SDK de complementos](https://github.com/aidevs-pt/arrumo-plugin-sdk) contiene los esquemas JSON versionados, los mundos WIT, las herramientas de empaquetado y el conjunto de pruebas de conformidad. Estas páginas explican cada contrato; los esquemas son la fuente de verdad. Empieza por [Crea tu primer complemento](../first-plugin.md).

- [Manifiesto](manifest.md): identidad, ajustes, presentación, icono y traducciones.
- [Paquetes y código](packages.md): paquetes ZIP, backends WebAssembly, paneles de interfaz y archivos revisados.
- [Acciones y hooks](actions.md): acciones, sus formularios y ubicaciones, y hooks que se ejecutan con eventos.
- [Adaptadores de proveedores](adapters.md): transcripción, voz, imagen, vídeo, uso y traducción de subtítulos.
- [Proveedores de agentes](agents.md): comprobaciones de estado, ejecuciones estructuradas, imágenes, uso y mensajes de seguimiento.
- [Renderizadores de movimiento](motion.md): entrega de movimiento renderizado y el sandbox de renderizado en Linux.

## Documenta tu complemento

Escribe una guía por cada tarea que un creador hace con el complemento, como la configuración o crear imágenes, en inglés, español y portugués, con las mismas páginas en cada idioma. Nombra los controles de la aplicación tal como Arrumo los muestra en cada idioma, y di qué sale del ordenador del creador. Los complementos oficiales publican sus guías en [Arrumo Docs](https://github.com/aidevs-pt/arrumo-docs) en `content/docs/<lang>/plugins/<plugin-id>/`; los demás complementos pueden guardarlas en su repositorio como `docs/<lang>/<page>.md` y enlazarlas desde el README.
