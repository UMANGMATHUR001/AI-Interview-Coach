import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const interviewMessagesTable = pgTable("interview_messages", {
  id: serial("id").primaryKey(),
  interviewId: integer("interview_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertInterviewMessageSchema = createInsertSchema(interviewMessagesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertInterviewMessage = z.infer<typeof insertInterviewMessageSchema>;
export type InterviewMessage = typeof interviewMessagesTable.$inferSelect;
