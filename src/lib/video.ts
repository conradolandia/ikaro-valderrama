export type VideoProvider = 'youtube' | 'vk' | 'unknown';

export function detectVideo(url: string): { provider: VideoProvider; id: string } {
	const u = url.trim();
	const yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
	if (yt) return { provider: 'youtube', id: yt[1] };
	const vk = u.match(/vkvideo\.ru\/video(-?\d+)_(\d+)/);
	if (vk) return { provider: 'vk', id: `${vk[1]}_${vk[2]}` };
	return { provider: 'unknown', id: u };
}
