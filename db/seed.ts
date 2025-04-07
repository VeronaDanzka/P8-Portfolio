import { db, Project } from 'astro:db';

// // https://astro.build/db/seed
export default async function seed() {
	await db.insert(Project).values([
	  {
		id: 1,
		title: 'Portfolio Astro',
		description: 'Site personnel construit avec Astro, Tailwind, SQLite',
		image: 'https://example.com/img.jpg',
		created_at: new Date(),
	  },
	  {
		id: 2,
		title: 'Blog Tech',
		description: 'Blog sur le développement web moderne',
		image: 'https://example.com/blog.jpg',
		created_at: new Date(),
	  },
	]);
  }
