import { json } from "drizzle-orm/mysql-core";
import { pgTable, serial,text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";

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

export const jobPost = pgTable('job_posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    companyName: text('company_name').notNull(),
    details: text('details'),
    location: text('location'),
    jobType: text('job_type'),
    salary: text('salary'),
    requirements: text('requirements'),
    directApplyLink: text('direct_apply_link'),
    youtubeLink: text('youtube_link'),
    status: text('status').default('active'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
})

export const jobNotification = pgTable('jobNotification', {
    id: serial('id').primaryKey(),
    userId: varchar('userId').notNull(),
    jobId: integer('jobId').references(() => jobPost.id).notNull(),
    isRead: boolean('isRead').default(false),
    createdAt: text('createdAt').notNull(),
})

// New schema for job applications
export const jobApplication = pgTable('job_applications', {
    id: serial('id').primaryKey(),
    jobId: serial('job_id').references(() => jobPost.id),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    gender: varchar('gender', { length: 50 }).notNull(),
    roleApplying: varchar('role_applying', { length: 255 }).notNull(),
    joinTime: varchar('join_time', { length: 255 }).notNull(),
    resumeUrl: varchar('resume_url', { length: 255 }).notNull(),
    status: varchar('status', { length: 50 }).default('pending'),
    appliedAt: timestamp('applied_at').defaultNow()
})

export const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    type: text('type').notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    link: text('link'),
    userId: text('user_id'),
    isGlobal: boolean('is_global').default(false),
    isRead: boolean('is_read').default(false),
    createdAt: timestamp('created_at').notNull()
})

