import { defineDb, defineTable, column } from 'astro:db';

const Project = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    description: column.text(),
    created_at: column.date(),
  },
});
// https://astro.build/db/config
export default defineDb({
  tables: { Project }
});
