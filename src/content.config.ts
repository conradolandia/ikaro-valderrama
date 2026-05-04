import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const sectionSchema = z.discriminatedUnion('type', [
	z.object({ type: z.literal('markdown') }),
	z.object({
		type: z.literal('entries'),
		path: z.string(),
		/** Card shape for EntriesGrid; omit for square. */
		cardAspect: z.enum(['square', 'vertical']).optional(),
	}),
	z.object({ type: z.literal('images'), files: z.array(z.string()) }),
	z.object({ type: z.literal('videos'), urls: z.array(z.string()) }),
	z.object({ type: z.literal('audio'), urls: z.array(z.string()) }),
]);

export type SectionFrontmatter = z.infer<typeof sectionSchema>;

const pageFrontmatter = z
	.object({
		title: z.string(),
		subtitle: z.string().optional(),
		image: z.string().optional(),
		layout: z.string(),
		sections: z.array(sectionSchema).optional(),
		gallery: z.array(z.string()).optional(),
		videos: z.array(z.string()).optional(),
		video: z.array(z.string()).optional(),
		pages: z.string().optional(),
		subtitlePosition: z.enum(['nw', 'ne', 'sw', 'se']).optional(),
		subtitleClass: z.string().optional(),
	})
	.loose();

export const collections = {
	pagesEs: defineCollection({
		loader: glob({ pattern: '**/*.md', base: './src/content/es' }),
		schema: pageFrontmatter,
	}),
	pagesRu: defineCollection({
		loader: glob({ pattern: '**/*.md', base: './src/content/ru' }),
		schema: pageFrontmatter,
	}),
};
