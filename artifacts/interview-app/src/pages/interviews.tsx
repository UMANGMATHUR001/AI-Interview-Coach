import { useListInterviews, getListInterviewsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, Plus, Code2, ChevronRight } from "lucide-react";

export default function Interviews() {
  const { data: interviews, isLoading } = useListInterviews({ query: { queryKey: getListInterviewsQueryKey() } });

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Sessions Log</h1>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessions Log</h1>
          <p className="text-muted-foreground mt-1">Review past interviews and track your progress.</p>
        </div>
        <Link href="/interview/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Session
          </Button>
        </Link>
      </div>

      {!interviews || interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border/60 rounded-2xl bg-card/30">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Code2 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No sessions yet</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            Start your first practice interview to begin sharpening your skills and collecting analytics.
          </p>
          <Link href="/interview/new">
            <Button>Start Interview</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview, i) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/interview/${interview.id}`}>
                <Card className="group hover:border-primary/50 transition-colors cursor-pointer bg-card border-border/40 shadow-sm">
                  <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {interview.role}
                        </h3>
                        <Badge variant="outline" className="bg-background">
                          {interview.difficulty}
                        </Badge>
                        <Badge variant={interview.status === "completed" ? "default" : "secondary"}>
                          {interview.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5" />
                          <span>{interview.interviewType}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{format(new Date(interview.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {interview.status === "completed" && (
                        <>
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tech</span>
                            <span className="font-bold text-lg">{interview.technicalScore || "--"}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Comm</span>
                            <span className="font-bold text-lg">{interview.communicationScore || "--"}</span>
                          </div>
                          <div className="w-px h-8 bg-border"></div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Overall</span>
                            <span className="font-bold text-xl text-primary">{interview.confidenceScore || "--"}</span>
                          </div>
                        </>
                      )}
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

