import { db, Project } from 'astro:db';

// // https://astro.build/db/seed
export default async function seed() {
	await db.insert(Project).values([
	  {
		id: 1,
		title: 'Portfolio Astro',
		subtitle: 'Mon portfolio construit avec Astro',
		description: 'Site personnel construit avec Astro, Tailwind, SQLite',
		github: 'https://github.com/your-repo', // Updated GitHub link
		website: 'https://your-website.com', // Updated website link
		tags: 'astro, tailwind, sqlite',
		created_at: new Date(),
	  },
	  {
		id: 2,
		title: 'Blog Tech',
		subtitle: 'Blog sur le développement web moderne',
		description: 'Blog sur le développement web moderne',
		github: 'https://github.com/your-blog-repo', // Updated GitHub link for Blog Tech
		website: 'https://your-blog-website.com', // Updated website link for Blog Tech
		tags: 'HTML, CSS, JavaScript',
		created_at: new Date(),
	  },
	]);
  }
