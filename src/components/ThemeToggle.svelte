<script lang="ts">
	import { readThemePreference, THEME_STORAGE_KEY } from '../lib/theme';

	let { lang = 'es' as 'es' | 'ru' }: { lang?: 'es' | 'ru' } = $props();

	const a11y = $derived(
		lang === 'ru'
			? {
					switchOnDark: 'Тёмная тема включена',
					switchOnLight: 'Светлая тема включена',
					goLight: 'Переключить на светлую тему',
					goDark: 'Переключить на тёмную тему',
				}
			: {
					switchOnDark: 'Tema oscuro activo',
					switchOnLight: 'Tema claro activo',
					goLight: 'Cambiar a tema claro',
					goDark: 'Cambiar a tema oscuro',
				},
	);

	let mode = $state<'light' | 'dark'>(
		typeof window !== 'undefined' ? readThemePreference() : 'light',
	);

	$effect(() => {
		document.documentElement.classList.toggle('dark', mode === 'dark');
	});

	function toggle() {
		mode = mode === 'dark' ? 'light' : 'dark';
		localStorage.setItem(THEME_STORAGE_KEY, mode);
		document.documentElement.classList.toggle('dark', mode === 'dark');
	}
</script>

<button
	type="button"
	role="switch"
	aria-checked={mode === 'dark'}
	aria-label={mode === 'dark' ? a11y.switchOnDark : a11y.switchOnLight}
	title={mode === 'dark' ? a11y.goLight : a11y.goDark}
	class="relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-text)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
	onclick={toggle}
>
	<span
		class="pointer-events-none absolute inset-y-0 left-1 flex w-5 items-center justify-center transition-opacity"
		class:opacity-100={mode === 'light'}
		class:opacity-40={mode === 'dark'}
		aria-hidden="true"
	>
		<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<path
				d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
			/>
		</svg>
	</span>
	<span
		class="pointer-events-none absolute inset-y-0 right-1 flex w-5 items-center justify-center transition-opacity"
		class:opacity-100={mode === 'dark'}
		class:opacity-40={mode === 'light'}
		aria-hidden="true"
	>
		<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
		</svg>
	</span>
	<span
		class="pointer-events-none absolute top-0.5 left-0.5 h-7 w-7 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-transform duration-200 ease-out"
		class:translate-x-0={mode === 'light'}
		class:translate-x-6={mode === 'dark'}
	></span>
</button>
