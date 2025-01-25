import { sql } from 'drizzle-orm'
import { serial, text, varchar, pgTable } from 'drizzle-orm/pg-core'

export const meetanyonepost = pgTable('meetanyonepost', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  imageUrl: text('imageUrl'),
  authorId: varchar('authorId').notNull(),
  authorName: varchar('authorName').notNull(),
  authorImage: text('authorImage'),
  category: varchar('category').notNull(),
  createdAt: text('createdAt').notNull(),
  likes: text('likes').default('[]'),
  linkUrl: text('linkUrl'),
  linkTitle: text('linkTitle')
})

export const meetanyonecomment = pgTable('meetanyonecomment', {
  id: serial('id').primaryKey(),
  postId: serial('postId').references(() => meetanyonepost.id),
  content: text('content').notNull(),
  authorId: varchar('authorId').notNull(),
  authorName: varchar('authorName').notNull(),
  authorImage: text('authorImage'),
  createdAt: text('createdAt').notNull()
})

export async function up(db) {
  await db.schema.createTable(meetanyonepost)
  await db.schema.createTable(meetanyonecomment)
}

export async function down(db) {
  await db.schema.dropTable(meetanyonepost)
  await db.schema.dropTable(meetanyonecomment)
} 