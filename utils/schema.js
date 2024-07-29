import { json } from "drizzle-orm/mysql-core";
import { pgTable, serial,text, varchar } from "drizzle-orm/pg-core";

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