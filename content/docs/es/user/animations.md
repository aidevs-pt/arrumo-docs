---
title: "Crea una biblioteca de animaciones"
description: "Genera animaciones reutilizables con tu marca, como una cortinilla del logotipo, una tarjeta final y un rótulo inferior, que el agente añade a cualquier vídeo."
---

**Animaciones** guarda superposiciones y transiciones que el agente puede reutilizar en cualquier vídeo. Cada una tiene una vista previa en bucle, una hoja de miniaturas con seis momentos y una nota sobre cuándo usarla. Si creas algunas antes de tu primer vídeo, todos tus vídeos tendrán la misma apertura, el mismo cierre y los mismos rótulos.

## Genera una animación

Abre **Animaciones** en la barra lateral y elige **Generar con el agente**. En **¿Qué debe mostrar?**, describe la pieza con palabras sencillas: qué aparece, qué colores y logotipos de la marca, el ritmo y dónde se usará. El agente la diseña con los colores, las fuentes y los recursos de tu marca, y Arrumo renderiza la vista previa. Puede tardar unos minutos.

Tres piezas que necesitan la mayoría de los espacios, con peticiones que funcionaron bien:

- **Cortinilla del logotipo**: «Unos 3 segundos, para abrir o cerrar un vídeo: sobre un degradado de Tinta a Carbón, la marca sube con una sombra suave y después aparece a su lado el logotipo de texto como tarjeta blanca redondeada. Tranquila, con mucho espacio y sin otro texto».
- **Tarjeta final**: «Unos 6 segundos sobre fondo Papel: la marca arriba, un titular en la fuente de títulos, una línea breve de texto y el logotipo con la URL como llamada a la acción. Entradas escalonadas y suaves, centradas».
- **Rótulo inferior** (una plantilla de estilo): «Unos 5 segundos, para nombrar un tema o a quien habla: una tarjeta Carbón redondeada con sombra suave que entra desde la izquierda en la zona segura inferior izquierda, con una línea de título blanca y una línea de texto Niebla. Sin sonido».

Llama a los colores como los llama tu página de **Marca**, y a los logotipos como se llaman los recursos de marca. El agente coloca esos archivos tal como son.

## Revísala y cámbiala

Abre un elemento para reproducir su vista previa y leer su nota de uso. Si algo no encaja, elige **Cambiar con el agente** y di solo lo que debe cambiar, como «deja la tarjeta final un segundo más» o «haz más pequeña la tarjeta del logotipo». El agente guarda el resultado como un elemento nuevo y deja el original como estaba, así que puedes compararlos y borrar el que no quieras. **Duplicar elemento** copia un elemento, por ejemplo para cambiar su nota de uso para otro fin.

## Quién puede usarla

**Visibilidad** filtra la biblioteca por todo el espacio o por un perfil. Los elementos creados para el espacio están disponibles para todos los perfiles. Para dar a otros perfiles un elemento de un perfil, usa **Compartir con perfiles**.

## En los vídeos

En el paso de recursos de un vídeo, el agente coloca tal como son los elementos de la biblioteca que encajan con el guion, como la cortinilla al principio y la tarjeta final al cierre. Para todo lo que lleva palabras que cambian en cada vídeo, como los rótulos inferiores, diseña animaciones nuevas y sigue la composición, los colores, las fuentes y el ritmo de las piezas de tu biblioteca que hacen lo mismo.

Así que deja en la biblioteca los elementos con texto fijo, y trata piezas como un rótulo inferior como plantillas de estilo: di en la nota de uso que sus palabras son de ejemplo.

## Con un agente

Los agentes pueden hacer lo mismo a través de MCP, la línea de comandos o A2A: `generate_motion_library_item` recibe la petición (y `basedOn` para cambiar un elemento existente), y `list_motion_library`, `duplicate_motion_library_item` y `set_motion_library_shares` gestionan la biblioteca. La [referencia de animación](../developer/reference/motion.md) describe las capas, formas y fuentes que puede usar una animación.
