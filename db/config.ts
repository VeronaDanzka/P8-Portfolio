import { defineDb, defineTable, column } from 'astro:db';

const Project = defineTable({
  columns: {
    id: column.number({ primaryKey: true, notNull: true }),
    title: column.text(),
    subtitle: column.text(),
    description: column.text(),
    github: column.text({ optional: true }),
    website: column.text({ optional: true }),
    tags: column.text(),
    created_at: column.date(),
  },
});
const Image = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true, notNull: true }),
    projectId: column.number({ references: () => Project.columns.id }), // clé étrangère
    url: column.text(),
    public_id: column.text(),
    created_at: column.date()
  },
});
// https://astro.build/db/config
export default defineDb({
  tables: { Project, Image }
});
