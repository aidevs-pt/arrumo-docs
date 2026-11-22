---

title: "Genera clips de vídeo e imágenes con Higgsfield"
description: "Crea clips e imágenes para tu biblioteca con los modelos Kling, Seedance y Qwen de Higgsfield."
---

## Añade tu clave

Crea una clave de API en la [consola de Higgsfield](https://console.higgsfield.ai/). En Arrumo, abre **Ajustes › Servicios y claves**, busca Higgsfield y pega la clave como `ID_DE_CLAVE:SECRETO`. La clave de un espacio de trabajo tiene prioridad sobre la de la aplicación. Arrumo la guarda en el almacén de credenciales del sistema, solo la envía a la API de Higgsfield y nunca la muestra a los agentes.

Cada clip e imagen consume tus créditos de Higgsfield. Cuando la cuenta se queda sin créditos, el trabajo falla y Arrumo explica el motivo.

## Crea un clip de vídeo

Abre **Recursos › Generar › Clip de vídeo**, describe el clip y elige su proporción (16:9, 9:16 o 1:1) y su duración. **Modelo** elige uno de estos:

| Modelo                              | Sin referencias | Con referencias                             | Duración |
| ----------------------------------- | --------------- | ------------------------------------------- | -------- |
| Kling 3.0 Standard (predeterminado) | Texto a vídeo   | Anima una imagen                            | 3–15 s   |
| Kling 3.0 Pro                       | Texto a vídeo   | Anima una imagen                            | 3–15 s   |
| Seedance 2.0                        | No disponible   | 1–9 imágenes y hasta 3 vídeos, o 1–3 vídeos | 4–15 s   |

Kling 3.0 Pro se ve mejor y cuesta más. Para cambiar el predeterminado de un espacio de trabajo, ajusta **Modelo de vídeo** en los ajustes del complemento.

En **Referencias**, elige imágenes o vídeos de la biblioteca del espacio de trabajo. Arrumo te avisa cuando el modelo elegido no admite esa combinación. Una imagen animada conserva su forma, sea cual sea la proporción elegida. Los clips no tienen sonido; añade narración o música en el montaje.

El MP4 terminado se suma a **Recursos**, con una nota que indica el modelo que lo creó.

## Crea una imagen

Higgsfield también crea imágenes con Qwen Image 3 en 2K. En **Recursos › Generar › Imagen**, describe la imagen y, para editarla o cambiar su estilo, adjunta de una a tres imágenes de referencia. Para las miniaturas, Higgsfield ocupa su lugar en el orden de proveedores de imágenes del espacio de trabajo en **Servicios y claves**.

## Agentes

Los agentes conectados por MCP usan `list_video_models` para ver cada modelo y las referencias que admite, y `generate_library_video` o `generate_library_images` con ID de recursos del espacio de trabajo como `references`.

## Privacidad

Los archivos de referencia se suben al almacenamiento de Higgsfield mediante una dirección temporal, sin tu clave. Solo salen de tu ordenador la descripción, los ajustes y las referencias que elegiste.
