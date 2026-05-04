# ikarovalderrama.com

Static site for Ikaro Valderrama (Astro, Tailwind CSS, Svelte islands). Content lives in `src/content/es` and `src/content/ru` as Markdown with frontmatter. Reference sketches stay in `_bases/` and are not read by the build.

## Requirements

- Node.js 22.12+

## Commands

| Command | Description |
|--------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server |
| `npm run build` | Output static site to `dist/` |
| `npm run preview` | Serve `dist/` locally |

## Deploy (LAMP)

1. Run `npm run build`.
2. Upload the contents of `dist/` to the vhost document root (FTP, rsync, or `git pull` plus CI that runs build on the server if Node is available there).
3. If the site is not at the domain root, set `base` in `astro.config.mjs` and rebuild.
4. Apache usually needs no SPA fallback: each route is a directory with `index.html` (trailing slash URLs are enabled).

## Content from `_bases`

To refresh page Markdown or images from `_bases` without wiring `_bases` into Astro:

```bash
rsync -a --delete _bases/es_CO/ src/content/es/
rsync -a --delete _bases/ru_RU/ src/content/ru/
rsync -a --delete _bases/img/ public/img/
```

Then edit Markdown frontmatter as needed (valid YAML: closing `---` before the body, no bare `...` lines, quote values that contain `:`, avoid an empty `image:` key above `gallery:`). Run `npm run build` to validate collections.

## Stack

- [Astro](https://astro.build/) (static output)
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- [Svelte](https://svelte.dev/) (theme toggle)
