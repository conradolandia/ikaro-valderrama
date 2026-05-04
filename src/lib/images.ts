/** Featured / gallery filenames from frontmatter point at /img/ */
export function publicImageSrc(filename: string | undefined): string | undefined {
	if (!filename?.trim()) return undefined;
	const f = filename.trim();
	if (f.startsWith('http://') || f.startsWith('https://') || f.startsWith('/')) return f;
	return `/img/${f.split('/').map(encodeURIComponent).join('/')}`;
}
