import type { CollectionEntry } from 'astro:content';
import type { SectionFrontmatter } from '../content.config';

/** Map `pages:` shorthand from bocetos to entry id prefixes */
const PAGES_PREFIX: Record<string, string> = {
	colectivos: 'musica/colectivos',
	autor: 'literatura/autor',
	digitales: 'literatura/proyectos-digitales',
	editor: 'literatura/editor',
	kotodama: 'literatura/autor/kotodama',
};

export type ResolvedSection =
	| { type: 'markdown' }
	| { type: 'entries'; pathPrefix: string }
	| { type: 'images'; files: string[] }
	| { type: 'videos'; urls: string[] }
	| { type: 'audio'; urls: string[] };

function frontmatterSectionToResolved(s: SectionFrontmatter): ResolvedSection {
	switch (s.type) {
		case 'markdown':
			return { type: 'markdown' };
		case 'entries':
			return { type: 'entries', pathPrefix: s.path };
		case 'images':
			return { type: 'images', files: [...s.files] };
		case 'videos':
			return { type: 'videos', urls: [...s.urls] };
		case 'audio':
			return { type: 'audio', urls: [...s.urls] };
		default: {
			const _exhaustive: never = s;
			return _exhaustive;
		}
	}
}

export function resolveSections(
	data: Record<string, unknown>,
	body: string | undefined,
): ResolvedSection[] {
	const explicit = data.sections;
	if (Array.isArray(explicit) && explicit.length > 0) {
		const out = (explicit as SectionFrontmatter[]).map(frontmatterSectionToResolved);
		if (body?.trim() && !out.some((s) => s.type === 'markdown')) {
			out.unshift({ type: 'markdown' });
		}
		return out;
	}

	const out: ResolvedSection[] = [];
	const pagesKey = typeof data.pages === 'string' ? data.pages.trim() : '';
	const prefix = pagesKey ? PAGES_PREFIX[pagesKey] : undefined;

	const gallery = data.gallery as string[] | undefined;
	const videos = [...((data.videos as string[]) ?? []), ...((data.video as string[]) ?? [])];

	if (body?.trim()) out.push({ type: 'markdown' });
	if (prefix) out.push({ type: 'entries', pathPrefix: prefix });
	if (gallery?.length) out.push({ type: 'images', files: gallery });
	if (videos.length) out.push({ type: 'videos', urls: videos });

	return out;
}

/** Descendants of `prefix/` (excludes the listing page `currentPageId` and the index file at `prefix` if present). */
export function filterEntriesByPrefix(
	entries: CollectionEntry<'pagesEs' | 'pagesRu'>[],
	prefix: string,
	currentPageId?: string,
): CollectionEntry<'pagesEs' | 'pagesRu'>[] {
	const p = prefix.replace(/\/$/, '');
	return entries.filter((e) => {
		if (currentPageId && e.id === currentPageId) return false;
		if (e.id === p) return false;
		return e.id.startsWith(`${p}/`);
	});
}
