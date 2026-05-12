import { useGetDashboard, getGetDashboardQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Target, Activity, CheckCircle2, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetDashboard({ query: { queryKey: getGetDashboardQueryKey() } });

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
        <p className="text-muted-foreground">Your interview performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard.totalInterviews}</div>
              <p className="text-xs text-muted-foreground mt-1">{dashboard.completedInterviews} completed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard.avgScore ? dashboard.avgScore.toFixed(1) : "--"}/100</div>
              <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {dashboard.totalInterviews > 0 
                  ? Math.round((dashboard.completedInterviews / dashboard.totalInterviews) * 100) 
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Sessions finished</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/50 col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Role Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {dashboard.roleBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.roleBreakdown} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="role" type="category" axisLine={false} tickLine={false} fontSize={12} width={100} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {dashboard.roleBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Sessions</CardTitle>
              <Link href="/interviews" className="text-sm text-primary flex items-center hover:underline">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.recentInterviews.length > 0 ? (
                  dashboard.recentInterviews.map((interview) => (
                    <Link key={interview.id} href={`/interview/${interview.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-card hover:bg-muted/30 transition-colors cursor-pointer group">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-sm group-hover:text-primary transition-colors">{interview.role}</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{interview.difficulty}</span>
                            <span>•</span>
                            <span>{format(new Date(interview.createdAt), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {interview.status === "completed" && interview.confidenceScore !== null ? (
                            <div className="text-right">
                              <div className="text-sm font-bold text-green-500">{interview.confidenceScore}</div>
                              <div className="text-[10px] text-muted-foreground uppercase">Score</div>
                            </div>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                              {interview.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground text-sm border border-dashed border-border/50 rounded-lg">
                    No recent interviews found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}