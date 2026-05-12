import { useGetUserAnalytics, getGetUserAnalyticsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function Analytics() {
  const { data: analytics, isLoading } = useGetUserAnalytics({ query: { queryKey: getGetUserAnalyticsQueryKey() } });

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  // Prepare radar chart data
  const radarData = [
    { subject: 'Overall', A: analytics.avgConfidenceScore || 0, fullMark: 100 },
    { subject: 'Technical', A: analytics.avgTechnicalScore || 0, fullMark: 100 },
    { subject: 'Communication', A: analytics.avgCommunicationScore || 0, fullMark: 100 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your interview skills and areas for improvement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <Card className="h-full border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Skill Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[300px]">
               {(analytics.avgConfidenceScore || 0) > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
               ) : (
                 <div className="text-muted-foreground text-sm">Not enough data to generate chart.</div>
               )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="h-full border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" /> Top Weak Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topWeakTopics && analytics.topWeakTopics.length > 0 ? (
                <ul className="space-y-4">
                  {analytics.topWeakTopics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-destructive shrink-0" />
                      <span className="text-sm font-medium">{topic}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm text-center">
                  <Lightbulb className="h-8 w-8 mb-3 opacity-20" />
                  <p>Complete more interviews to identify weak areas.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {analytics.recentSessions && analytics.recentSessions.filter(s => s.improvementSuggestions).length > 0 ? (
               analytics.recentSessions.filter(s => s.improvementSuggestions).slice(0, 3).map(session => (
                 <div key={session.id} className="p-4 border border-border/40 rounded-xl bg-background/50">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="font-semibold text-primary">{session.role}</span>
                     <span className="text-xs text-muted-foreground uppercase tracking-wider">• {session.interviewType}</span>
                   </div>
                   <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-primary pl-4">
                     "{session.improvementSuggestions}"
                   </p>
                 </div>
               ))
             ) : (
               <div className="text-sm text-muted-foreground">No recent feedback available. Complete an interview to get suggestions.</div>
             )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}