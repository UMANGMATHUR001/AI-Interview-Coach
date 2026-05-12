import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, conversations, messages, interviewsTable, interviewMessagesTable } from "@workspace/db";
import { ai } from "@workspace/integrations-gemini-ai";
import {
  CreateInterviewBody,
  GetInterviewParams,
  EndInterviewParams,
  SendInterviewMessageParams,
  SendInterviewMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function buildSystemPrompt(role: string, difficulty: string, interviewType: string): string {
  return `You are an experienced ${difficulty.toLowerCase()} technical interviewer conducting a ${interviewType} interview for a ${role} position.

Your behavior:
- Start by briefly greeting the candidate and introducing yourself
- Ask one focused interview question at a time
- After each answer, give brief, honest feedback (2-3 sentences), acknowledge what was good and what could be improved
- Then ask the next question naturally
- Adapt follow-up questions based on the candidate's answers
- Be realistic and challenging but supportive
- Ask 5-8 questions total depending on answer depth
- Keep your responses concise and professional — do not use emojis
- For technical questions, probe deeper if the answer is shallow or incorrect

Interview type specifics:
- Technical Coding / DSA: Focus on problem-solving, code quality, time/space complexity
- System Design: Focus on scalability, trade-offs, architecture decisions
- Behavioral / HR: Focus on STAR method, leadership, conflict resolution
- JavaScript / React / Python / Cloud: Focus on language/framework-specific knowledge

After the interview ends, you will provide detailed scoring.`;
}

router.get("/interviews", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user!.id;
  const interviews = await db
    .select()
    .from(interviewsTable)
    .where(eq(interviewsTable.userId, userId))
    .orderBy(desc(interviewsTable.createdAt));
  res.json(interviews);
});

router.post("/interviews", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateInterviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { role, difficulty, interviewType } = parsed.data;
  const userId = req.user!.id;

  const [convo] = await db
    .insert(conversations)
    .values({ title: `${role} - ${interviewType} (${difficulty})` })
    .returning();

  const systemPrompt = buildSystemPrompt(role, difficulty, interviewType);
  await db.insert(messages).values({
    conversationId: convo.id,
    role: "user",
    content: `[SYSTEM: ${systemPrompt}]\n\nPlease begin the interview.`,
  });

  const [interview] = await db
    .insert(interviewsTable)
    .values({
      userId,
      role,
      difficulty,
      interviewType,
      conversationId: convo.id,
    })
    .returning();

  res.status(201).json(interview);
});

router.get("/interviews/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = GetInterviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [interview] = await db
    .select()
    .from(interviewsTable)
    .where(
      and(
        eq(interviewsTable.id, params.data.id),
        eq(interviewsTable.userId, req.user!.id)
      )
    );

  if (!interview) {
    res.status(404).json({ error: "Interview not found" });
    return;
  }

  const interviewMessages = await db
    .select()
    .from(interviewMessagesTable)
    .where(eq(interviewMessagesTable.interviewId, params.data.id))
    .orderBy(interviewMessagesTable.createdAt);

  res.json({ ...interview, messages: interviewMessages });
});

router.post("/interviews/:id/end", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = EndInterviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [interview] = await db
    .select()
    .from(interviewsTable)
    .where(
      and(
        eq(interviewsTable.id, params.data.id),
        eq(interviewsTable.userId, req.user!.id)
      )
    );

  if (!interview) {
    res.status(404).json({ error: "Interview not found" });
    return;
  }

  const interviewMessages = await db
    .select()
    .from(interviewMessagesTable)
    .where(eq(interviewMessagesTable.interviewId, params.data.id))
    .orderBy(interviewMessagesTable.createdAt);

  const conversationMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, interview.conversationId))
    .orderBy(messages.createdAt);

  let analyticsText = "";
  try {
    const analysisPrompt = `Based on this ${interview.interviewType} interview for a ${interview.role} position (${interview.difficulty} difficulty), analyze the candidate's performance and provide JSON scores.

Interview transcript:
${interviewMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n")}

Respond ONLY with valid JSON in this exact format:
{
  "confidenceScore": <0-100>,
  "technicalScore": <0-100>,
  "communicationScore": <0-100>,
  "weakTopics": "<comma-separated list of weak areas>",
  "improvementSuggestions": "<2-3 specific improvement suggestions>"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: analysisPrompt }] }],
      config: { maxOutputTokens: 1024, responseMimeType: "application/json" },
    });
    analyticsText = response.text ?? "{}";
  } catch {
    analyticsText = '{"confidenceScore":70,"technicalScore":70,"communicationScore":70,"weakTopics":"","improvementSuggestions":"Keep practicing!"}';
  }

  let analytics: {
    confidenceScore?: number;
    technicalScore?: number;
    communicationScore?: number;
    weakTopics?: string;
    improvementSuggestions?: string;
  } = {};
  try {
    analytics = JSON.parse(analyticsText);
  } catch {
    analytics = {};
  }

  const [updatedInterview] = await db
    .update(interviewsTable)
    .set({
      status: "completed",
      endedAt: new Date(),
      confidenceScore: analytics.confidenceScore ?? null,
      technicalScore: analytics.technicalScore ?? null,
      communicationScore: analytics.communicationScore ?? null,
      weakTopics: analytics.weakTopics ?? null,
      improvementSuggestions: analytics.improvementSuggestions ?? null,
    })
    .where(eq(interviewsTable.id, params.data.id))
    .returning();

  void conversationMessages;

  res.json({ interview: updatedInterview });
});

router.post("/interviews/:id/message", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = SendInterviewMessageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = SendInterviewMessageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [interview] = await db
    .select()
    .from(interviewsTable)
    .where(
      and(
        eq(interviewsTable.id, params.data.id),
        eq(interviewsTable.userId, req.user!.id)
      )
    );

  if (!interview) {
    res.status(404).json({ error: "Interview not found" });
    return;
  }

  await db.insert(interviewMessagesTable).values({
    interviewId: params.data.id,
    role: "user",
    content: body.data.content,
  });

  await db.insert(messages).values({
    conversationId: interview.conversationId,
    role: "user",
    content: body.data.content,
  });

  const chatMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, interview.conversationId))
    .orderBy(messages.createdAt);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: chatMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: { maxOutputTokens: 8192 },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }
  } catch (err) {
    req.log.error({ err }, "Gemini streaming error");
    res.write(`data: ${JSON.stringify({ content: "I encountered an error. Please try again." })}\n\n`);
  }

  await db.insert(interviewMessagesTable).values({
    interviewId: params.data.id,
    role: "assistant",
    content: fullResponse,
  });

  await db.insert(messages).values({
    conversationId: interview.conversationId,
    role: "assistant",
    content: fullResponse,
  });

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

export default router;
