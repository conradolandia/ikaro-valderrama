/**
 * Navigation tree: `href` is path without locale (e.g. musica/solista).
 * `external` optional absolute URL opens in new tab.
 */
export type NavItem = {
	key: string;
	href?: string;
	external?: string;
	children?: NavItem[];
};

export const navTree: NavItem[] = [
	{ key: 'nav_home', href: '' },
	{
		key: 'nav_music',
		children: [
			{ key: 'nav_music_solo', href: 'musica/solista' },
			{ key: 'nav_music_collective', href: 'musica/proyectos-colectivos' },
		],
	},
	{
		key: 'nav_literature',
		children: [
			{ key: 'nav_literature_author', href: 'literatura/autor' },
			{ key: 'nav_literature_editor', href: 'literatura/editor' },
		],
	},
	{ key: 'nav_kotodama', href: 'kotodama' },
	{ key: 'nav_press', href: 'prensa' },
	{ key: 'nav_photos', href: 'fotos' },
	{ key: 'nav_events', href: 'eventos' },
	{ key: 'nav_about', href: 'sobre-mi' },
	{ key: 'nav_contact', href: 'contacto' },
];

export const navLabels: Record<'es' | 'ru', Record<string, string>> = {
	es: {
		nav_home: 'Inicio',
		nav_music: 'Música',
		nav_music_solo: 'Solista',
		nav_music_collective: 'Proyectos colectivos',
		nav_literature: 'Literatura',
		nav_literature_author: 'Autor',
		nav_literature_editor: 'Editor',
		nav_kotodama: 'Kotodama',
		nav_press: 'Prensa',
		nav_photos: 'Fotos',
		nav_events: 'Eventos',
		nav_about: 'Sobre Íkaro',
		nav_contact: 'Contacto',
	},
	ru: {
		nav_home: 'Главная',
		nav_music: 'Музыка',
		nav_music_solo: 'Солист',
		nav_music_collective: 'Коллективные проекты',
		nav_literature: 'Литература',
		nav_literature_author: 'Автор',
		nav_literature_editor: 'Редактор',
		nav_kotodama: 'Котодама',
		nav_press: 'Пресса',
		nav_photos: 'Фото',
		nav_events: 'События',
		nav_about: 'Об Икаро',
		nav_contact: 'Контакты',
	},
};

export const siteTitles: Record<'es' | 'ru', { title: string; tagline: string }> = {
	es: { title: 'Ikaro Valderrama', tagline: 'Música y literatura' },
	ru: { title: 'Икаро Вальдеррама', tagline: 'Музыка и литература' },
};
