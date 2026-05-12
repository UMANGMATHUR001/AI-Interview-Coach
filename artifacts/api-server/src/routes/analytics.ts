import { Router, type IRouter } from "express";
import { eq, and, avg, count, sql } from "drizzle-orm";
import { db, interviewsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/analytics", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user!.id;

  const [totals] = await db
    .select({
      totalInterviews: count(),
      completedInterviews: sql<number>`count(*) filter (where ${interviewsTable.status} = 'completed')`,
      avgConfidenceScore: avg(interviewsTable.confidenceScore),
      avgTechnicalScore: avg(interviewsTable.technicalScore),
      avgCommunicationScore: avg(interviewsTable.communicationScore),
    })
    .from(interviewsTable)
    .where(eq(interviewsTable.userId, userId));

  const recentSessions = await db
    .select()
    .from(interviewsTable)
    .where(and(eq(interviewsTable.userId, userId), eq(interviewsTable.status, "completed")))
    .orderBy(sql`${interviewsTable.createdAt} desc`)
    .limit(5);

  const allCompleted = await db
    .select()
    .from(interviewsTable)
    .where(and(eq(interviewsTable.userId, userId), eq(interviewsTable.status, "completed")));

  const weakTopicsMap: Record<string, number> = {};
  for (const interview of allCompleted) {
    if (interview.weakTopics) {
      const topics = interview.weakTopics.split(",").map((t) => t.trim()).filter(Boolean);
      for (const topic of topics) {
        weakTopicsMap[topic] = (weakTopicsMap[topic] ?? 0) + 1;
      }
    }
  }

  const topWeakTopics = Object.entries(weakTopicsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);

  res.json({
    totalInterviews: Number(totals?.totalInterviews ?? 0),
    completedInterviews: Number(totals?.completedInterviews ?? 0),
    avgConfidenceScore: totals?.avgConfidenceScore ? Number(totals.avgConfidenceScore) : null,
    avgTechnicalScore: totals?.avgTechnicalScore ? Number(totals.avgTechnicalScore) : null,
    avgCommunicationScore: totals?.avgCommunicationScore ? Number(totals.avgCommunicationScore) : null,
    topWeakTopics,
    recentSessions,
  });
});

router.get("/dashboard", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user!.id;

  const [totals] = await db
    .select({
      totalInterviews: count(),
      completedInterviews: sql<number>`count(*) filter (where ${interviewsTable.status} = 'completed')`,
      avgScore: sql<number>`avg((${interviewsTable.confidenceScore} + ${interviewsTable.technicalScore} + ${interviewsTable.communicationScore}) / 3.0) filter (where ${interviewsTable.status} = 'completed')`,
    })
    .from(interviewsTable)
    .where(eq(interviewsTable.userId, userId));

  const recentInterviews = await db
    .select()
    .from(interviewsTable)
    .where(eq(interviewsTable.userId, userId))
    .orderBy(sql`${interviewsTable.createdAt} desc`)
    .limit(5);

  const allInterviews = await db
    .select()
    .from(interviewsTable)
    .where(eq(interviewsTable.userId, userId));

  const roleMap: Record<string, number> = {};
  const diffMap: Record<string, number> = {};
  for (const iv of allInterviews) {
    roleMap[iv.role] = (roleMap[iv.role] ?? 0) + 1;
    diffMap[iv.difficulty] = (diffMap[iv.difficulty] ?? 0) + 1;
  }

  const roleBreakdown = Object.entries(roleMap).map(([role, cnt]) => ({ role, count: cnt }));
  const difficultyBreakdown = Object.entries(diffMap).map(([difficulty, cnt]) => ({ difficulty, count: cnt }));

  res.json({
    totalInterviews: Number(totals?.totalInterviews ?? 0),
    completedInterviews: Number(totals?.completedInterviews ?? 0),
    avgScore: totals?.avgScore ? Number(totals.avgScore) : null,
    recentInterviews,
    roleBreakdown,
    difficultyBreakdown,
  });
});

export default router;
