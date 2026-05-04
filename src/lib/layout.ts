/** Normalize boceto layout strings to hero | normal */
export function layoutKind(layout: string | undefined): 'hero' | 'normal' {
	if (!layout) return 'normal';
	const l = layout.toLowerCase();
	if (l.includes('imagen') || l === 'hero') return 'hero';
	return 'normal';
}
