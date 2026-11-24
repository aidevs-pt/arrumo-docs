---

title: "Configura Claude Code en Arrumo"
description: "Instala la CLI local e inicia sesión siguiendo la guía del proveedor."
---

Instala la CLI local e inicia sesión siguiendo la [guía del proveedor](https://code.claude.com/docs/en/setup). Arrumo encuentra la CLI en su PATH y en las carpetas que añade tu shell de inicio de sesión, aunque lo abras desde el Dock, el Finder o un lanzador del escritorio. Si la instalaste en otro sitio, elige su archivo de programa con **Elegir el programa…** en la configuración del agente o en Ajustes.

Elige Claude Code al configurar el espacio de trabajo o selecciónalo como agente de producción en Ajustes. La comprobación confirma la sesión local y no inicia ningún montaje.

## Comprueba la conexión

Desde la CLI del editor, indica la ruta de una base de datos local y el identificador de este complemento.

```sh
arrumo-workspaces ./workspaces.sqlite agent-login-status claude-code
```

El estado confirmed indica que la CLI aceptó la comprobación. Si Arrumo devuelve unavailable, comprueba que la CLI esté instalada o elige su archivo de programa en Ajustes. Si devuelve unconfirmed, inicia sesión según la guía oficial y vuelve a comprobarlo. Un tiempo de espera agotado o un error indica que la comprobación no pudo completarse.

## Escribir archivos y ejecutar comandos

**Escribir archivos y ejecutar comandos**, en Ajustes › Agente, está activado por defecto. Mientras trabaja en un vídeo, Claude Code acepta las ediciones (`--permission-mode acceptEdits`) y puede usar Read, Write, Edit, Glob, Grep y Bash, además de WebSearch y WebFetch cuando **Búsqueda web** está activada. Se aplica tu propia configuración de Claude Code: sus hooks, servidores MCP y complementos. Trabaja en una carpeta que Arrumo crea para ese vídeo y borra cuando el vídeo termina, falla o se cancela.

Si lo desactivas, Claude Code se ejecuta en modo restringido (`--restricted`), con los hooks desactivados y sin herramientas de archivos ni de terminal, y solo lee lo que Arrumo le envía. **Usar mis complementos instalados** decide entonces si se cargan tus complementos y servidores MCP.

## Traduce los subtítulos

Consulta [la traducción de subtítulos](https://github.com/aidevs-pt/arrumo-plugin-claude-code/blob/main/README.md#translate-subtitles) para usar este complemento como traductor de Auto-Dubbing. El traductor envía a Claude Code el texto de los subtítulos seleccionados y el idioma de destino. El proceso conserva las marcas de tiempo originales.

## Preguntas de seguimiento

Cuando Claude Code pide a Arrumo material del espacio de trabajo, como el guion de un vídeo anterior, Arrumo responde en la misma sesión de Claude Code solo con ese material, así el encargo no se envía ni se paga dos veces. Estas sesiones quedan en el historial de Claude Code (`claude --resume`); las ejecuciones puntuales no guardan ninguna.
