---

title: "Manifiesto"
description: "Identidad, ajustes, presentación, icono y traducciones."
---

## Borrador de manifiesto

[manifest.schema.json](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/manifest.schema.json) define la identidad del complemento y los metadatos de sus capacidades. Consulta el [ejemplo de transcripción](https://github.com/aidevs-pt/arrumo-plugin-sdk/blob/main/examples/transcription.json).

Las declaraciones de capacidades describen lo que ofrece un complemento. El editor valida el paquete y aplica el ámbito y las concesiones cuando un entorno de ejecución o un adaptador compatible ejecuta una capacidad.

## Declaraciones de ajustes

La versión 2 del esquema de manifiesto puede incluir hasta 64 entradas en `settings`. Da a cada entrada un `id` único dentro del complemento, un `label` y una `description`, un `kind` de `string`, `boolean`, `integer` o `secret`, un `scope` de `app` o `workspace`, y un indicador booleano `required`. Una lista de ajustes omitida es válida. Los hosts actuales siguen leyendo el SDK v1, que no tiene declaraciones de ajustes.

En el esquema 10, un ajuste puede añadir `helpUrl`: una página `https`, de hasta 512 caracteres, sin credenciales ni fragmento, que explica dónde conseguir el valor, como la página de claves de API del proveedor. Arrumo la muestra como Dónde encontrarlo junto al campo y la abre desde el manifiesto instalado, así que no se puede colar otra página desde la interfaz.

Un campo con ámbito de aplicación solo se configura en el ámbito de la aplicación. Un campo con ámbito de espacio de trabajo puede tener un valor predeterminado de la aplicación y una sustitución por espacio de trabajo. Quitar una sustitución restaura el valor predeterminado de la aplicación. Un campo obligatorio necesita un valor configurado antes de que un host pueda usar el complemento para trabajos que dependen de ese campo. El manifiesto solo declara metadatos. Los valores, los valores predeterminados y las credenciales nunca forman parte de una declaración. Por ahora, el host valida y muestra las declaraciones mediante su API de catálogo. El host valida y resuelve los valores normales por separado. El almacenamiento seguro de credenciales requiere soporte aparte del host.

## Presentación y recorrido de complementos

La versión 8 del esquema añade una `introduction` opcional. Cuando llegan complementos después del primer arranque del creador (instalados desde un ZIP o el registro, o incluidos en una actualización), Arrumo los presenta en un recorrido compartido, con una página por complemento con su nombre, `headline` y `body`. Los complementos presentes en el primer arranque no entran en el recorrido. Los creadores pueden repetir el recorrido desde Ajustes › Complementos. El texto va por idioma: `en` es obligatorio, y `es` y `pt` se usan cuando la aplicación está en esos idiomas. Los titulares tienen como máximo 80 caracteres y los cuerpos 320.

```json
"introduction": {
  "headline": {"en": "Your videos, in more languages", "es": "Tus vídeos, en más idiomas"},
  "body": {"en": "Pick a finished video and the languages you want…"}
}
```

## Icono y traducciones

El esquema 8 también añade un `icon` opcional: la ruta de un archivo SVG del paquete, como `"icon": "icon.svg"`. Mantén el SVG autónomo y de 8 KiB como máximo. Arrumo lo muestra como imagen allí donde aparece el complemento, por ejemplo junto al agente que está trabajando, así que no puede ejecutar scripts; el host rechaza iconos con scripts, manejadores de eventos, `href`, `url(…)`, imágenes o documentos incrustados. Dibuja el icono con su propia forma de fondo y sus colores. `package_plugin.py` añade al ZIP el icono declarado, y los complementos sin icono reciben uno predeterminado.

### Marcas: compruébalo antes de incluir una

El logotipo de una empresa solo puede ser el icono de un complemento cuando las pautas de marca publicadas por esa empresa permiten usarlo dentro de la interfaz de otra aplicación. Haz esta comprobación antes de meter el logotipo en el paquete, no después:

1. Lee la página de marca, prensa o marcas registradas de la propia empresa. Un aviso en el manifiesto no concede permiso.
2. Usa el logotipo solo si la página permite este uso sin pedirlo (por ejemplo, una marca ofrecida para ecosistemas de aplicaciones o integraciones). Usa el archivo de la propia empresa, sin modificar, y sigue sus condiciones de espacio libre, color y tamaño.
3. Si la página pide solicitar permiso, está tras un acceso de socios o no se encuentra, dibuja en su lugar un símbolo genérico de lo que hace el complemento, como un prompt de terminal para un agente de línea de comandos o un marco de imagen para imágenes.
4. Anota el resultado en el README del complemento, en "Icon and trademarks": qué página leíste, qué permite y por qué el icono es una marca o un símbolo genérico.

Cuando el icono es una marca, añade `iconNotice` nombrando al titular (por ejemplo, "ElevenLabs and its logo are trademarks of ElevenLabs."). Arrumo lo muestra junto al complemento, y `translations` puede traducirlo como el resto del texto. Los símbolos genéricos no llevan aviso.

Los complementos oficiales se revisaron el 2026-11-22. La página de marca de ElevenLabs recomienda su símbolo "11" para ecosistemas de aplicaciones. OpenAI pide permiso primero, Google tiene las pautas de Gemini tras un acceso de socios, y Anthropic e Higgsfield no publican ninguna regla para este uso. El editor de los complementos oficiales decidió mostrar igualmente el logotipo de cada proveedor con un `iconNotice`, para que los creadores reconozcan el servicio, y reemplazará un logotipo por un símbolo genérico si su titular lo pide. Los complementos de terceros deben seguir los pasos anteriores.

### Forma del icono

Dibuja el icono como una tesela cuadrada completa (por ejemplo, un `viewBox` de 32×32 cuya primera forma sea un `<rect width="32" height="32">` del color de fondo) con esquinas rectas y sin borde. Arrumo redondea las esquinas y dibuja un borde tenue igual para todos los complementos, a cualquier tamaño.

## Traducciones

Los complementos traducen su propio texto. El inglés se queda en los campos del manifiesto, y `translations.es` y `translations.pt` sustituyen el `name` y la `description` del complemento, el `provider.label` del agente y cada capacidad, ajuste (`label`, `description` y las etiquetas de `choices` por valor) y acción declarados. `translations.en` puede añadir etiquetas que faltan en los campos base, como las de las opciones. Cada clave debe nombrar algo que el manifiesto declara.

```json
"translations": {
  "en": {"settings": {"reasoning-effort": {"choices": {"xhigh": "Extra high"}}}},
  "es": {"description": "Usa tu plan de ChatGPT…",
         "settings": {"web-search": {"label": "Búsqueda web"}}}
}
```
