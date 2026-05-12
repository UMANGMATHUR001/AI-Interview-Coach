import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const interviewsTable = pgTable("interviews", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  role: text("role").notNull(),
  difficulty: text("difficulty").notNull(),
  interviewType: text("interview_type").notNull(),
  status: text("status").notNull().default("active"),
  conversationId: integer("conversation_id").notNull(),
  confidenceScore: real("confidence_score"),
  technicalScore: real("technical_score"),
  communicationScore: real("communication_score"),
  weakTopics: text("weak_topics"),
  improvementSuggestions: text("improvement_suggestions"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
});

export const insertInterviewSchema = createInsertSchema(interviewsTable).omit({
  id: true,
  createdAt: true,
  endedAt: true,
  status: true,
  confidenceScore: true,
  technicalScore: true,
  communicationScore: true,
  weakTopics: true,
  improvementSuggestions: true,
});

export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Interview = typeof interviewsTable.$inferSelect;
