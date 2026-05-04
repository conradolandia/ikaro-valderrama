/** Persisted when the user toggles theme; if missing, system preference is used. */
export const THEME_STORAGE_KEY = 'ikaro-theme';

export type ThemeMode = 'light' | 'dark';

export function readThemePreference(): ThemeMode {
	if (typeof window === 'undefined' || typeof localStorage === 'undefined') return 'light';
	const v = localStorage.getItem(THEME_STORAGE_KEY);
	if (v === 'dark' || v === 'light') return v;
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
	return 'light';
}
