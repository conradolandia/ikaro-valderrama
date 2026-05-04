<script lang="ts">
	import { onMount } from 'svelte';
	import { publicImageSrc } from '../lib/images';

	let {
		files,
		alt = '',
		lang = 'es',
	}: { files: string[]; alt?: string; lang?: 'es' | 'ru' } = $props();

	const groupLabel = $derived(
		lang === 'ru' ? 'Галерея изображений' : 'Galería de imágenes',
	);

	let root: HTMLDivElement | undefined;

	const items = $derived(
		files
			.map((file) => ({ file, src: publicImageSrc(file) }))
			.filter((x): x is { file: string; src: string } => Boolean(x.src)),
	);

	/** PhotoSwipe needs intrinsic size; without data-pswp-width/height it sizes slides to the viewport and stretches the image. */
	function setPswpDimensionsFromThumb(anchor: HTMLAnchorElement, img: HTMLImageElement) {
		return new Promise<void>((resolve) => {
			const apply = () => {
				if (img.naturalWidth > 0 && img.naturalHeight > 0) {
					anchor.dataset.pswpWidth = String(img.naturalWidth);
					anchor.dataset.pswpHeight = String(img.naturalHeight);
				}
				resolve();
			};
			if (img.complete) apply();
			else {
				img.addEventListener('load', apply, { once: true });
				img.addEventListener('error', () => resolve(), { once: true });
			}
		});
	}

	onMount(() => {
		let destroyed = false;
		let lightbox: { destroy: () => void } | undefined;

		void (async () => {
			if (!root) return;
			const anchors = [...root.querySelectorAll<HTMLAnchorElement>('a')];
			await Promise.all(
				anchors.map((a) => {
					const img = a.querySelector('img');
					return img ? setPswpDimensionsFromThumb(a, img) : Promise.resolve();
				}),
			);
			await import('photoswipe/style.css');
			const { default: PhotoSwipeLightbox } = await import('photoswipe/lightbox');
			if (destroyed || !root) return;

			const lb = new PhotoSwipeLightbox({
				gallery: root,
				children: 'a',
				pswpModule: () => import('photoswipe'),
				bgOpacity: 0.92,
				padding: { top: 24, bottom: 24, left: 24, right: 24 },
			});
			lb.init();
			lightbox = lb;
		})();

		return () => {
			destroyed = true;
			lightbox?.destroy();
		};
	});
</script>

<div
	bind:this={root}
	class="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
	role="group"
	aria-label={groupLabel}
>
	{#each items as { file, src }}
		<a
			href={src}
			class="block cursor-zoom-in overflow-hidden rounded border border-[var(--color-border)] no-underline outline-none ring-[var(--color-accent)] transition hover:opacity-95 focus-visible:ring-2"
			target="_blank"
			rel="noreferrer"
		>
			<figure class="pointer-events-none aspect-square bg-[var(--color-surface)]">
				<img
					src={src}
					alt={alt || file}
					class="h-full w-full object-cover"
					loading="eager"
					decoding="async"
				/>
			</figure>
		</a>
	{/each}
</div>
