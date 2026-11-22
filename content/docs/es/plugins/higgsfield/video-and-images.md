---

title: "Genera clips de vídeo e imágenes con Higgsfield"
description: "Crea clips e imágenes para tu biblioteca con los 41 modelos de vídeo y 14 de imagen de Higgsfield."
---

## Añade tu clave

Crea una clave de API en la [consola de Higgsfield](https://console.higgsfield.ai/). En Arrumo, abre **Ajustes › Servicios y claves**, busca Higgsfield y pega la clave como `ID_DE_CLAVE:SECRETO`. Una clave del espacio de trabajo tiene prioridad sobre la predeterminada de la aplicación. Arrumo la guarda en el almacén de credenciales del sistema, solo la envía a la API de Higgsfield y nunca se la muestra a los agentes.

Cada clip e imagen gasta tus créditos de Higgsfield. Cuando la cuenta se queda sin créditos, el trabajo falla y Arrumo te dice por qué. Puede que algunos modelos no estén disponibles para todas las cuentas; cuando se rechaza un trabajo, se muestra el motivo de Higgsfield.

## Crea un clip de vídeo

Abre **Recursos › Generar › Clip de vídeo**, describe el clip y elige su tamaño. Elige Higgsfield en **Hecho con** y después un **Modelo**: la línea de debajo dice para qué es ideal, y **Duración** solo ofrece las duraciones que admite ese modelo. Los modelos cuyo nombre termina en *References* siguen las imágenes y vídeos que adjuntas; los modelos *Edit*, *Extend*, *Motion Control* y *Genjutsu* trabajan sobre un clip que adjuntas, y el resultado sigue su duración.

| Modelo | Ideal para |
| --- | --- |
| Cinema Studio 4.0 | Planos de estilo cine de 4–30 s a partir de texto, hasta nueve imágenes o tres vídeos; el modelo elige lente, luz y ritmo. |
| Genjutsu Motion Transfer | Coloca a las personas o personajes de hasta ocho imágenes en el movimiento de un vídeo (mínimo 4 s; más de 30 s se recorta). |
| Genjutsu Object Swap | Sustituye un objeto de un vídeo por el de tus imágenes, manteniendo el movimiento del plano. |
| Grok Imagine Video 1.5 | Clips cortos en 720p de 1–15 s que empiezan en una imagen o siguen hasta siete imágenes de referencia. |
| Happy Horse 1.0 | El modelo de vídeo de Alibaba para clips en 1080p de 2–15 s a partir de texto o un primer fotograma. |
| Happy Horse 1.0 References | Happy Horse siguiendo hasta nueve imágenes de referencia de un sujeto o estilo. |
| Happy Horse 1.1 | El Happy Horse más reciente, en 1080p por defecto, a partir de texto o un primer fotograma. |
| Happy Horse 1.1 References | Happy Horse 1.1 siguiendo hasta nueve imágenes de referencia. |
| Kling 2.5 Turbo Pro | Clips rápidos y económicos de 5 o 10 s; a partir de texto solo hace 16:9. |
| Kling 2.5 Turbo Standard | La forma más barata de animar una imagen en un clip de 5 o 10 s. |
| Kling 2.6 Motion Control Pro | Transferencia de movimiento de Kling 2.6 con más detalle que Standard. |
| Kling 2.6 Motion Control Standard | La transferencia de movimiento anterior: el personaje de una imagen sigue el movimiento de un vídeo, a menor precio. |
| Kling 2.6 Pro | La generación anterior de Kling para clips de 5 o 10 s a partir de texto o una imagen, si buscas su estilo. |
| Kling 3.0 4K | Kling 3.0 en 4K, para pantallas grandes o recortes en la edición; el nivel de Kling más caro. |
| Kling 3.0 Motion Control Pro | Mueve al personaje de tu imagen como se mueve la persona de un vídeo de referencia de 3–30 s; el clip dura lo mismo que el vídeo Pro conserva más detalle. |
| Kling 3.0 Motion Control Standard | Mueve al personaje de tu imagen como se mueve la persona de un vídeo de referencia de 3–30 s; el clip dura lo mismo que el vídeo. |
| Kling 3.0 Pro | Planos protagonistas que piden más detalle y mejor movimiento que Standard; mismas entradas, más coste. |
| Kling 3.0 Standard (predeterminado) | Clips del día a día a buen precio: 3–15 s a partir de texto, un primer fotograma o el primero y el último. |
| Kling 3.0 Turbo | Borradores rápidos en 1080p a partir de texto o una imagen, con prompts más largos (hasta 3000 caracteres). |
| Kling O3 | Clips que empiezan en una imagen y pueden terminar en otra, de 3–15 s. |
| Kling O3 Edit | Cambia un clip existente de 3–15 s con una instrucción, como sustituir el escenario o un objeto, guiado si quieres por imágenes. |
| Kling O3 References | Mantiene coherentes personajes, productos o lugares a partir de hasta cuatro imágenes, o sigue la cámara y el estilo de un vídeo de referencia. |
| Kling Omni | El modelo Omni anterior para clips de 5 o 10 s entre un primer fotograma y un último opcional. |
| Kling Omni Edit | Edita un clip existente de 3–10 s con una instrucción, guiado si quieres por imágenes. |
| Kling Omni References | Omni con hasta cuatro imágenes o un vídeo de referencia, para sujetos coherentes a menor precio que O3. |
| LTX-2.5 Fast | Borradores rápidos de 6, 8 o 10 s en 16:9 o 9:16, a partir de texto, un primer fotograma o el primero y el último. |
| LTX-2.5 Pro | Clips cuidados de 6, 8 o 10 s en 16:9 o 9:16 a partir de texto o una imagen. |
| MiniMax H3 | Clips nítidos en 2K de 5–15 s a partir de texto, un primer fotograma o el primero y el último. |
| MiniMax H3 References | MiniMax H3 siguiendo hasta nueve imágenes o tres vídeos. |
| Seedance 2.0 | Clips cinematográficos en 1080p de 4–15 s a partir de texto, un primer fotograma o el primero y el último. |
| Seedance 2.0 References | Sigue a la vez hasta nueve imágenes y tres vídeos de referencia: personajes, productos, estilo y movimientos de cámara. |
| Seedance 2.5 | Planos cinematográficos más largos, hasta 30 s, a partir de texto o fotogramas, con bitrate alto. |
| Seedance 2.5 Edit | Edita un clip existente con una instrucción, con imágenes opcionales de lo que quieres añadir. |
| Seedance 2.5 Extend | Continúa un clip existente 4–30 s más, desde donde termina. |
| Seedance 2.5 References | Seedance 2.5 siguiendo hasta nueve imágenes y tres vídeos, para planos largos y coherentes de hasta 30 s. |
| Wan 2.6 | Anima una imagen en un clip en 1080p de 5, 10 o 15 s. |
| Wan 2.7 References | Clips en 1080p de 2–10 s en 16:9 o 9:16 que siguen hasta cinco imágenes o vídeos de referencia. |
| Wan 3.0 | Clips largos en 1080p, de 2–30 s, a partir de texto, un primer fotograma o el primero y el último. |
| Wan 3.0 Prime | El nivel premium de Wan 3.0 para clips largos en 1080p cuando la calidad importa más que el coste. |
| Wan 3.0 Prime References | Wan 3.0 Prime con hasta nueve imágenes y tres vídeos de referencia. |
| Wan 3.0 References | Wan 3.0 siguiendo hasta nueve imágenes y tres vídeos para sujetos coherentes en planos largos. |

Para cambiar el predeterminado de un espacio de trabajo, ajusta **Modelo de vídeo** en los ajustes del complemento.

En **Referencias**, elige imágenes o vídeos de la biblioteca del espacio de trabajo. Con dos imágenes, los modelos que admiten fotogramas usan la primera como fotograma inicial y la segunda como final. Arrumo te avisa cuando el modelo elegido no admite esa combinación o ese tamaño. Los clips no tienen sonido; añade narración o música en la edición. El MP4 terminado se añade a **Recursos**, con una nota que indica el modelo que lo hizo.

## Crea una imagen

En **Recursos › Generar › Imagen**, elige Higgsfield y un **Modelo**. Los modelos que admiten imágenes de referencia usan las que adjuntas, hasta el número de la tabla. Para las miniaturas, Higgsfield entra en su turno según el orden de proveedores de imágenes del espacio de trabajo en **Servicios y claves** y usa el ajuste **Modelo de imagen**.

| Modelo | Ideal para | Referencias |
| --- | --- | --- |
| Grok Image 2.0 | Genera o edita con muchas referencias (hasta ocho aquí), para combinar personas, productos y lugares. | Hasta 8 |
| Ideogram 4.0 | La tipografía primero: carteles, títulos y miniaturas con letras exactas; remezcla una imagen de referencia. | Hasta 1 |
| Marketing Studio 2.0 | Imágenes de campañas y anuncios, construidas alrededor de las fotos de tu producto (hasta ocho referencias). | Hasta 8 |
| Marketing Studio 2.5 Flare | El modelo de campañas más reciente para anuncios cuidados a partir de fotos de producto. | Hasta 8 |
| Marketing Studio 2.5 Sunburst | El otro estilo de Marketing Studio 2.5, para imágenes de campaña luminosas y con energía. | Hasta 8 |
| Qwen Image 3 (predeterminado) | Imágenes fiables en 2K con texto limpio dentro de la imagen; edita hasta tres imágenes de referencia. | Hasta 3 |
| Recraft V4.1 | Imágenes de diseño en 1K: ilustraciones, iconos y gráficos de marca. | Ninguna |
| Recraft V4.1 Pro | El estilo de diseño de Recraft en 2K, para impresión o maquetas grandes. | Ninguna |
| Recraft V4.1 Utility | Imágenes prácticas en 1K, como fotos de producto, fondos y diagramas. | Ninguna |
| Recraft V4.1 Utility Pro | Recraft Utility en 2K. | Ninguna |
| SOUL | El modelo fotográfico de Higgsfield para fotos realistas de personas, con estilo de moda. | Ninguna |
| SOUL 2 | El SOUL más reciente para fotos realistas de personas y estilo de vida. | Ninguna |
| SOUL Cinema | Aspecto de fotograma de película: luz y color cinematográficos para escenas con atmósfera y miniaturas. | Ninguna |
| Z-Image Turbo | Borradores rápidos y baratos en 2K a partir de descripciones cortas (hasta 800 caracteres). | Ninguna |

## Lo que no se ofrece aquí

Aún no se ofrecen los flujos que necesitan preajustes o identificadores entrenados de Higgsfield (Genjutsu Restyle, personajes de Soul ID, elementos y prompts de varias tomas de Kling) ni los modelos cuyas páginas de API no se habían publicado cuando se escribió este complemento (Hailuo 2.3, PixVerse V6, Ads Studio).

## Agentes

Los agentes conectados por MCP usan `list_video_models` y `list_image_models` para ver cada modelo, para qué es ideal y qué admite, y después pasan `provider` y `model` a `generate_library_video` o `generate_library_images`, con identificadores de recursos del espacio de trabajo como `references`.

## Privacidad

Los archivos de referencia se suben al almacenamiento de Higgsfield mediante una dirección de corta duración, sin tu clave. Solo salen de tu ordenador la descripción, los ajustes y las referencias que elegiste.
