# ikarovalderrama.com

Sitio estático para Ikaro Valderrama (Astro, Tailwind CSS, islas Svelte).

## Requisitos

- Node.js 22.12+

## Comandos

| Comando | Descripción |
|--------|-------------|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo local |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` en local |

## Despliegue (LAMP)

1. Ejecutar `npm run build`.
2. Subir el contenido de `dist/` al directorio raíz del vhost (FTP, rsync, o `git pull` más CI que ejecute el build en el servidor si hay Node).
3. Si el sitio no está en la raíz del dominio, definir `base` en `astro.config.mjs` y volver a construir.
4. En Apache suele no hacer falta fallback tipo SPA: cada ruta es un directorio con `index.html` (URLs con barra final habilitadas).

## Contenido

- Páginas: `src/content/es/` y `src/content/ru/` (un `.md` por ruta; el árbol de carpetas define la URL bajo `/es/...` y `/ru/...`).
- Imágenes referenciadas en frontmatter: archivos en `public/img/` (o URL absoluta, ver abajo).

`npm run build` valida el frontmatter contra el esquema en `src/content.config.ts`.

### YAML

Reglas habituales: el segundo `---` cierra el frontmatter antes del cuerpo Markdown; no dejar líneas con solo `...` dentro del bloque YAML; entrecomillar textos que contengan `:`; no usar `image:` vacío justo encima de `gallery:` (YAML lo interpreta mal).

## Frontmatter

### Campos de página

| Campo | Obligatorio | Descripción |
|--------|-------------|-------------|
| `title` | Sí | Título de la página. Puede ser varias líneas con bloque literal YAML (`\|`); en metadatos (título de ventana, etc.) se normaliza a una sola línea. |
| `layout` | Sí | `hero` o `normal` (únicos valores válidos). |
| `subtitle` | No | Texto bajo el título. |
| `image` | No | Imagen destacada. Ver [Imagen destacada](#imagen-destacada). |
| `subtitlePosition` | No | Solo con `layout: hero`: posición del bloque título/subtítulo sobre la imagen. Valores: `nw`, `ne`, `sw`, `se`. Por defecto `sw`. |
| `sections` | No | Lista ordenada de bloques de contenido (galería, rejilla de entradas, vídeos, etc.). Si está presente y no vacía, define el orden explícito. Ver [Secciones](#secciones-sections). |
| `gallery` | No | Lista de nombres de archivo en `public/img/` (modo legacy si no usas `sections`). |
| `videos` | No | Lista de URLs de vídeo embebibles (legacy). |
| `video` | No | Mismo uso que `videos`; ambas listas se concatenan (legacy). |
| `pages` | No | Atajo legacy: clave corta que activa un bloque `entries` con un prefijo de rutas. Ver [Atajo `pages`](#atajo-pages). |

El esquema Zod usa `.loose()` en el objeto raíz: se toleran claves extra sin romper el build, pero el sitio solo usa las anteriores (más las entradas de `sections` tipadas).

### `layout`

- **`hero`**: cabecera a pantalla con la imagen de `image` como fondo (`object-cover`), degradado y título/subtítulo encima. Tiene sentido con `image` definida; sin imagen, la plantilla cae en el bloque tipo `normal` (título en bloque, sin hero visual).
- **`normal`**: título y subtítulo en bloque, imagen destacada opcional debajo (`object-contain`, altura máxima acotada), luego las secciones.

Las rutas `src/pages/es/index.astro` y `src/pages/ru/index.astro` pasan `viewportShell="home-hero"` a `BaseLayout` y `homeHeroShell` a `PageView`: el hero de inicio ocupa el alto disponible bajo la cabecera (no es una clave del frontmatter).

### Imagen destacada

`image` puede ser:

- Un nombre de archivo o ruta relativa a `public/img/` (por ejemplo `Home.jpg` → se sirve como `/img/Home.jpg`).
- Una ruta que empiece por `/`, o una URL `http://` / `https://`, usada tal cual.

### Secciones (`sections`)

Array ordenado. Cada elemento es un objeto con `type` y campos según el tipo:

1. **`markdown`** — Renderiza el cuerpo del `.md` (prose del sitio) **una sola vez** en esa posición. Si defines `sections` y el archivo tiene cuerpo pero no incluyes ningún `type: markdown`, el build inserta al inicio un bloque `markdown` automáticamente. No tiene sentido repetir varios `markdown`: solo el primero se pinta.

2. **`entries`** — Rejilla de tarjetas con páginas hijas bajo un prefijo de colección.

   ```yaml
   - type: entries
     path: literatura/autor
     cardAspect: vertical   # opcional: square | vertical; por defecto cuadrado
   ```

   `path` es el prefijo de `id` de entradas en la misma colección (idioma), sin barra final (por ejemplo `musica/colectivos`).

3. **`images`** — Galería (PhotoSwipe) a partir de rutas en `public/img/`:

   ```yaml
   - type: images
     files:
       - foto-1.jpg
       - subcarpeta/foto-2.jpg
   ```

4. **`videos`** — Un bloque por URL. Embebido si la URL es YouTube (`youtube.com`, `youtu.be`) o VK Video (`vkvideo.ru/...`); en otro caso se muestra un enlace (`src/lib/video.ts`, `VideoEmbed.astro`).

   ```yaml
   - type: videos
     urls:
       - https://www.youtube.com/watch?v=...
   ```

5. **`audio`** — Lista de enlaces a audio (se muestran como lista de enlaces externos).

   ```yaml
   - type: audio
     urls:
       - https://ejemplo.com/pista.mp3
   ```

### Modo legacy (sin `sections`)

Si no defines `sections` o el array está vacío, el orden de bloques se deduce así:

1. Markdown del cuerpo, si hay texto en el archivo.
2. Rejilla `entries` si existe `pages` con valor conocido.
3. Galería si existe `gallery` con al menos un archivo.
4. Vídeos si hay entradas en `videos` y/o `video`.

### Atajo `pages`

Solo en modo legacy. Valor de `pages` → prefijo de entradas:

| `pages` | Prefijo de rutas |
|--------|-------------------|
| `colectivos` | `musica/colectivos` |
| `autor` | `literatura/autor` |
| `digitales` | `literatura/proyectos-digitales` |
| `editor` | `literatura/editor` |
| `kotodama` | `literatura/autor/kotodama` |

La rejilla lista entradas cuya `id` empiece por ese prefijo, excluyendo la página índice actual y el propio nodo índice del prefijo.

## Stack

- [Astro](https://astro.build/) (salida estática)
- [Tailwind CSS v4](https://tailwindcss.com/) vía `@tailwindcss/vite`
- [Svelte](https://svelte.dev/) (interruptor de tema)
