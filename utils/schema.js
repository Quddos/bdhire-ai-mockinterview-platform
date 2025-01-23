import { json } from "drizzle-orm/mysql-core";
import { pgTable, serial,text, varchar, integer } from "drizzle-orm/pg-core";

export const MockInterview= pgTable('mockInterview',{
    // create columns
    id:serial('id').primaryKey(),
    jsonMockResp:text('jsonMockResp').notNull(),
    jobPosition:varchar('jobPosition').notNull(),
    jobDesc:varchar('jobDesc').notNull(),
    jobExperience:varchar('jobExperience').notNull(),
    createdBy:varchar('createdBy').notNull(),
    createdAt:text('createdAt'),
    mockId:varchar('mockId').notNull()
})

// npm run db:push
// npm run db:studio
export const UserAnswer=pgTable('userAnswer',{
    id:serial('id').primaryKey(),
    mockIdRef:varchar('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAns:text('correctAns'),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt'),
})

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
    postId: integer('postId').references(() => meetanyonepost.id).notNull(),
    parentCommentId: integer('parentCommentId').references(() => meetanyonecomment.id),
    content: text('content').notNull(),
    authorId: varchar('authorId').notNull(),
    authorName: varchar('authorName').notNull(),
    authorImage: text('authorImage'),
    createdAt: text('createdAt').notNull()
})

